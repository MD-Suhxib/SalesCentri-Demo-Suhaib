import { NextRequest, NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/app/lib/email';
import { isCorporateEmail } from '@/app/lib/corporateEmail';
import { storeCallData } from '@/app/lib/callTracking';

export async function POST(request: NextRequest) {
  try {
    const { email, phone, objective } = await request.json();

    // Validate input
    if (!email || !phone || !objective) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Reject free/personal email providers - require corporate email
    if (!isCorporateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please use a business email address. Personal email addresses are not accepted.' },
        { status: 400 }
      );
    }

    const leadData = {
      email,
      phone,
      objective,
      timestamp: new Date().toISOString(),
      source: 'lets-talk-button',
      verified: true,
    };

    console.log('[Lead Capture] New verified lead:', leadData);

    // Store lead data for webhook matching (using default agent ID)
    // This is the source of truth for email/phone/subject
    const agentId = 'agent_7701kbcrdr3zemzajc9ct39m2q9y';
    storeCallData(agentId, {
      email,
      phone,
      subject: objective,
      callEndTime: Date.now(), // Placeholder, will be updated when webhook arrives
      timestamp: Date.now(),
    });
    console.log('[Lead Capture] Stored lead data for webhook matching');

    // TODO: Store lead in database
    // Example: await db.leads.create(leadData);

    // Send welcome email
    try {
      await sendWelcomeEmail(email, '', objective);
      console.log('[Lead Capture] Welcome email sent to:', email);
    } catch (emailError) {
      console.error('[Lead Capture] Failed to send welcome email:', emailError);
      // Don't fail the entire request if email fails
    }

    // TODO: Integrate with CRM or notification system
    // Example: await sendToSalesforce(leadData);
    // Example: await notifySalesTeam(leadData);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your interest! Our team will contact you shortly.',
      leadId: `LEAD-${Date.now()}`,
    });
  } catch (error) {
    console.error('[Lead Capture] Error submitting lead:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit your information' },
      { status: 500 }
    );
  }
}
