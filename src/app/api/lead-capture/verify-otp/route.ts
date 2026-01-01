import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/app/lib/otp';
import { isCorporateEmail } from '@/app/lib/corporateEmail';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, signedToken } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP format. Must be 6 digits.' },
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

    // Verify OTP (with signed token fallback for production)
    const identifier = email.toLowerCase();
    const result = verifyOTP(identifier, otp, signedToken);

    if (!result.success) {
      console.log('[OTP] Verification failed for', email, ':', result.message);
      return NextResponse.json(
        { 
          success: false, 
          message: result.message,
          attemptsRemaining: result.attemptsRemaining 
        },
        { status: 400 }
      );
    }

    console.log('[OTP] Verification successful for:', email);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('[OTP] Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
