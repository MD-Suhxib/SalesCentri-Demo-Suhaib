import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP, checkRateLimit } from '@/app/lib/otp';
import { isCorporateEmail } from '@/app/lib/corporateEmail';
import { sendOTPEmail } from '@/app/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, phone, recaptchaToken } = await request.json();

    // Validate input
    if (!email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Email and phone are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
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

    // Check rate limiting
    const identifier = email.toLowerCase();
    const rateLimit = checkRateLimit(identifier);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: rateLimit.message },
        { status: 429 }
      );
    }

    // Verify reCAPTCHA token
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (recaptchaToken && !isDevelopment) {
      const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
      
      if (recaptchaSecret) {
        try {
          const recaptchaResponse = await fetch(
            'https://www.google.com/recaptcha/api/siteverify',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
            }
          );

          const recaptchaData = await recaptchaResponse.json();

          if (!recaptchaData.success || recaptchaData.score < 0.5) {
            console.log('[reCAPTCHA] Verification failed:', recaptchaData);
            return NextResponse.json(
              { success: false, message: 'reCAPTCHA verification failed. Please try again.' },
              { status: 400 }
            );
          }

          console.log('[reCAPTCHA] Score:', recaptchaData.score);
        } catch (error) {
          console.error('[reCAPTCHA] Verification error:', error);
          // Continue without blocking if reCAPTCHA service is down
        }
      }
    } else if (isDevelopment) {
      console.log('[DEV MODE] Skipping reCAPTCHA verification');
    }

    // Generate OTP (6-digit numeric code)
    const otp = generateOTP(6);
    
    // Store OTP with 5-minute expiration
    const { expiresAt, signedToken } = storeOTP(identifier, otp, email, phone);

    console.log(`[OTP] Generated for ${email}: ${otp} (expires in 5 minutes)`);
    console.log(`[OTP] Signed token created for serverless verification`);

    // Send OTP via email
    const emailResult = await sendOTPEmail(email, otp, 3);
    
    if (!emailResult.success) {
      console.error('[OTP] Failed to send email:', emailResult.message);
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    console.log('[OTP] Email sent successfully to:', email);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
      expiresAt,
      signedToken, // For production serverless verification
      // REMOVE IN PRODUCTION - Only for development/testing
      ...(isDevelopment && { debug: { otp } }),
    });
  } catch (error) {
    console.error('[OTP] Error sending OTP:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
