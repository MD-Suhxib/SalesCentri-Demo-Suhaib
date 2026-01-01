import { NextRequest, NextResponse } from 'next/server';
import { storeCallData } from '@/app/lib/callTracking';

export async function POST(request: NextRequest) {
  try {
    const { leadId, email, objective, callDuration, callStartTime, callEndTime, phone, isCallStart } = await request.json();

    // Validate input (relaxed for call start - duration can be 0)
    if (!email || !objective) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const callData = {
      leadId,
      email,
      objective,
      callDuration: callDuration || 0, // in seconds
      callStartTime: new Date(callStartTime).toISOString(),
      callEndTime: new Date(callEndTime).toISOString(),
      timestamp: new Date().toISOString(),
      source: 'elevenlabs-voice-agent',
    };

    if (isCallStart) {
      console.log('[Call Tracking] Voice call started:', callData);
    } else {
      console.log('[Call Tracking] Voice call completed:', callData);
      console.log(`[Call Tracking] Call duration: ${callDuration} seconds (${Math.floor(callDuration / 60)}m ${callDuration % 60}s)`);
    }

    // Store call data for webhook matching (using default agent ID)
    // Store immediately when call starts so webhook can find it
    // Update callEndTime when call actually ends
    const agentId = 'agent_7701kbcrdr3zemzajc9ct39m2q9y'; // Your agent ID
    storeCallData(agentId, {
      email,
      phone: phone || '', // Phone might not be in track-call payload
      subject: objective,
      callEndTime: new Date(callEndTime).getTime(), // Will be updated when call ends
      timestamp: Date.now(),
    });

    // TODO: Update lead record in database with call information
    // Example: await db.leads.update({
    //   where: { id: leadId },
    //   data: {
    //     callDuration,
    //     callStartTime: callData.callStartTime,
    //     callEndTime: callData.callEndTime,
    //     voiceCallCompleted: true,
    //   }
    // });

    // TODO: Send notification to sales team with call details
    // Example: await notifySalesTeam({
    //   type: 'voice_call_completed',
    //   leadId,
    //   email,
    //   objective,
    //   duration: callDuration,
    // });

    // TODO: Integrate with CRM to log call activity
    // Example: await salesforce.logActivity({
    //   leadId,
    //   activityType: 'voice_call',
    //   duration: callDuration,
    //   status: 'completed',
    // });

    return NextResponse.json({
      success: true,
      message: 'Call tracked successfully',
      data: {
        leadId,
        callDuration,
        callDurationFormatted: `${Math.floor(callDuration / 60)}m ${callDuration % 60}s`,
      },
    });
  } catch (error) {
    console.error('[Call Tracking] Error tracking call:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track call' },
      { status: 500 }
    );
  }
}
