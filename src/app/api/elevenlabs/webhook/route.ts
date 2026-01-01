import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * ElevenLabs Webhook Endpoint
 * Receives post_call_transcription events when calls end
 * 
 * Configure webhook URL in ElevenLabs dashboard:
 * https://your-domain.com/api/elevenlabs/webhook
 * 
 * Webhook signature verification (HMAC) is optional but recommended for production.
 * Set ELEVENLABS_WEBHOOK_SECRET in env to enable verification.
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();
    
    if (!rawBody || rawBody.trim() === '') {
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }
    
    // Optional: Verify webhook signature (HMAC) if secret is configured
    const webhookSecret = process.env.ELEVENLABS_WEBHOOK_SECRET;
    if (webhookSecret) {
      // ElevenLabs may send signature in various headers - check common ones
      const signature = request.headers.get('x-elevenlabs-signature') || 
                       request.headers.get('x-signature') ||
                       request.headers.get('signature') ||
                       request.headers.get('x-hub-signature-256');
      
      if (signature) {
        // HMAC-SHA256 verification
        // Handle both raw hex and "sha256=hex" format
        const sigValue = signature.startsWith('sha256=') 
          ? signature.substring(7) 
          : signature;
        
        const hmac = crypto.createHmac('sha256', webhookSecret);
        hmac.update(rawBody);
        const expectedSignature = hmac.digest('hex');
        
        // Compare signatures (constant-time comparison)
        // Both should be hex strings of same length
        if (sigValue.length !== expectedSignature.length) {
          console.error('[ElevenLabs Webhook] Signature length mismatch');
          return NextResponse.json(
            { error: 'Invalid webhook signature' },
            { status: 401 }
          );
        }
        
        // Convert to buffers for timing-safe comparison
        const sigBuffer = Buffer.from(sigValue, 'hex');
        const expectedBuffer = Buffer.from(expectedSignature, 'hex');
        
        if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
          console.error('[ElevenLabs Webhook] Signature verification failed');
          return NextResponse.json(
            { error: 'Invalid webhook signature' },
            { status: 401 }
          );
        }
        console.log('[ElevenLabs Webhook] Signature verified');
      } else {
        console.warn('[ElevenLabs Webhook] Webhook secret configured but no signature header found');
      }
    }
    
    // Parse JSON payload
    const payload = JSON.parse(rawBody);
    console.log('[ElevenLabs Webhook] Received event:', payload.type || 'unknown');
    
    // Handle post_call_transcription event
    if (payload.type === 'post_call_transcription') {
      const { data } = payload;
      
      // Extract core identifiers (always present)
      const conversationId = data?.conversation_id || null;
      const agentId = data?.agent_id || null;
      const status = data?.status || null;
      const eventTimestamp = payload?.event_timestamp || null;
      
      // Parse transcript array into full transcript string
      // Transcript is an array of turn objects: [{role: "agent"|"user", message: "...", time_in_call_secs: ...}, ...]
      let transcript: string | null = null;
      if (Array.isArray(data?.transcript) && data.transcript.length > 0) {
        transcript = data.transcript
          .map((turn: { role?: string; message?: string; time_in_call_secs?: number }) => {
            const role = turn.role === 'user' ? 'User' : 'Agent';
            const message = turn.message || '';
            const timestamp = turn.time_in_call_secs !== undefined 
              ? `[${Math.floor(turn.time_in_call_secs)}s]` 
              : '';
            return `${timestamp} ${role}: ${message}`.trim();
          })
          .join('\n');
      }
      
      // Extract summary if available (may not be in standard payload)
      let summary = data?.summary || data?.analysis?.summary || null;
      
      // If we have transcript but no summary, generate one
      if (transcript && !summary) {
        console.log('[ElevenLabs Webhook] Transcript found but no summary - will generate after matching user data');
      }
      
      // Calculate duration if available from transcript turns
      let duration: number | null = null;
      if (Array.isArray(data?.transcript) && data.transcript.length > 0) {
        const lastTurn = data.transcript[data.transcript.length - 1];
        duration = lastTurn?.time_in_call_secs || null;
      }
      
      // Extract user info from metadata or custom fields
      // These should be passed via widget data attributes or conversation metadata
      let email = data?.email || 
                  data?.user_email || 
                  data?.metadata?.email || 
                  data?.custom_data?.email ||
                  null;
      let phone = data?.phone || 
                  data?.user_phone || 
                  data?.metadata?.phone || 
                  data?.custom_data?.phone ||
                  null;
      let subject = data?.subject || 
                    data?.metadata?.subject || 
                    data?.metadata?.objective ||
                    data?.custom_data?.subject ||
                    null;
      
      // Get lead data from lead-capture/submit endpoint (source of truth for email/phone/subject)
      // Merge with webhook data (transcript/summary)
      if (agentId) {
        const { getCallData } = await import('@/app/lib/callTracking');
        const leadData = getCallData(agentId);
        
        if (leadData) {
          // Use lead data as source of truth for email/phone/subject
          email = leadData.email;
          phone = leadData.phone;
          subject = leadData.subject;
          
          // Update call end time with webhook timestamp
          const webhookTimestamp = eventTimestamp ? eventTimestamp * 1000 : Date.now();
          if (webhookTimestamp > leadData.callEndTime) {
            const { storeCallData } = await import('@/app/lib/callTracking');
            storeCallData(agentId, {
              ...leadData,
              callEndTime: webhookTimestamp,
            });
          }
          
          console.log('[ElevenLabs Webhook] Merged lead data with webhook:', { 
            email: email ? `${email.substring(0, 3)}***` : null,
            phone: phone ? `${phone.substring(0, 3)}***` : null,
            subject,
            hasTranscript: !!transcript,
            hasSummary: !!summary,
            leadStoredAt: new Date(leadData.timestamp).toISOString(),
          });
        } else {
          console.log('[ElevenLabs Webhook] No lead data found for agent:', agentId);
          console.log('[ElevenLabs Webhook] Lead data should be stored when user submits form via /api/lead-capture/submit');
        }
      }
      
      // Forward to DemandIntellect backend if we have required fields
      if (email && phone) {
        // Generate summary if we have transcript but no summary
        if (transcript && !summary) {
          try {
            console.log('[ElevenLabs Webhook] Generating summary from transcript...');
            const { summarizeTranscript } = await import('@/app/lib/summarizeTranscript');
            summary = await summarizeTranscript(transcript, email, phone, subject);
            console.log('[ElevenLabs Webhook] Summary generated successfully');
          } catch (summaryError) {
            console.error('[ElevenLabs Webhook] Failed to generate summary:', summaryError);
            // Continue without summary - transcript will still be sent
          }
        }
        
        const backendUrl = process.env.SALESCENTRI_BASE_URL || 'https://app.demandintellect.com/app/api';
        const apiKey = process.env.SALESCENTRI_CLIENT_API_KEY;
        
        if (!apiKey) {
          console.error('[ElevenLabs Webhook] SALESCENTRI_CLIENT_API_KEY not configured');
          return NextResponse.json(
            { error: 'Backend API key not configured' },
            { status: 500 }
          );
        }
        
        // Map and merge data: email/phone/subject from lead-capture/submit, transcript/summary from webhook
        const backendPayload: Record<string, unknown> = {
          email,      // From lead-capture/submit
          phone,      // From lead-capture/submit
          subject,    // From lead-capture/submit (objective)
          transcript, // From webhook
          summary,    // From webhook or generated
        };
        
        console.log('[ElevenLabs Webhook] Mapped payload for DemandIntellect:', {
          email: email ? `${email.substring(0, 3)}***` : null,
          phone: phone ? `${phone.substring(0, 3)}***` : null,
          subject,
          hasTranscript: !!transcript,
          hasSummary: !!summary,
          transcriptLength: transcript?.length || 0,
          summaryLength: summary?.length || 0,
        });
        
        // Include metadata (conversation_id and agent_id for tracking/correlation)
        backendPayload.metadata = {
          conversation_id: conversationId,
          agent_id: agentId,
          status,
          duration,
          event_timestamp: eventTimestamp,
          source: 'elevenlabs_webhook',
          webhook_event_type: payload.type,
          received_at: new Date().toISOString(),
          // Store raw transcript array for potential future processing
          transcript_turns_count: Array.isArray(data?.transcript) ? data.transcript.length : 0,
        };
        
        try {
          const backendResponse = await fetch(`${backendUrl}/ai-call.php/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
            },
            body: JSON.stringify(backendPayload),
          });
          
          const backendData = await backendResponse.json();
          
          if (!backendResponse.ok) {
            console.error('[ElevenLabs Webhook] Backend register failed:', backendData);
            return NextResponse.json(
              {
                error: 'Backend register failed',
                status: backendResponse.status,
                body: backendData,
              },
              { status: 502 }
            );
          }
          
          console.log('[ElevenLabs Webhook] Successfully forwarded to backend:', backendData.data?.call?.id);
          
          return NextResponse.json({
            success: true,
            message: 'Webhook processed and forwarded to backend',
            backendCallId: backendData.data?.call?.id,
          });
        } catch (backendError) {
          console.error('[ElevenLabs Webhook] Backend request failed:', backendError);
          return NextResponse.json(
            {
              error: 'Backend request failed',
              details: backendError instanceof Error ? backendError.message : 'Unknown error',
            },
            { status: 502 }
          );
        }
      } else {
        console.warn('[ElevenLabs Webhook] Missing email or phone, cannot forward to backend');
        return NextResponse.json(
          {
            success: true,
            message: 'Webhook received but missing required fields (email/phone)',
            note: 'Transcript will be stored when user info is available',
          },
          { status: 200 }
        );
      }
    }
    
    // Handle other event types (acknowledge but don't process)
    console.log('[ElevenLabs Webhook] Unhandled event type:', payload.type);
    return NextResponse.json({
      success: true,
      message: 'Webhook received (event type not processed)',
      eventType: payload.type,
    });
  } catch (error) {
    console.error('[ElevenLabs Webhook] Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

