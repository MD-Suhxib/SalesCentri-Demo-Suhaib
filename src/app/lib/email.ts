/**
 * Email Service using Nodemailer
 * Handles OTP email delivery with HTML templates
 */

import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_ENCRYPTION === 'ssl', // true for SSL, false for TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production',
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('[Email] Transporter verification failed:', error);
  } else {
    console.log('[Email] Transporter ready to send emails');
  }
});

/**
 * Generate HTML email template for OTP
 */
function generateOTPEmailHTML(otp: string, expiryMinutes: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0D1117; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 170, 255, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Verification Code</h1>
              <p style="color: #E0F2FE; margin: 10px 0 0 0; font-size: 16px;">SalesCentri</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <p style="color: #E5E7EB; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                Thank you for your interest in SalesCentri. Use the code below to verify your identity:
              </p>
              
              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%); border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; margin: 20px 0; display: inline-block;">
                <p style="color: #93C5FD; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                <p style="color: #ffffff; font-size: 36px; font-weight: 700; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</p>
              </div>
              
              <p style="color: #9CA3AF; font-size: 14px; line-height: 20px; margin: 30px 0 0 0;">
                ⏱️ This code will expire in <strong style="color: #60A5FA;">${expiryMinutes} minutes</strong>
              </p>
              
              <p style="color: #9CA3AF; font-size: 14px; line-height: 20px; margin: 20px 0 0 0;">
                🔒 For security reasons, never share this code with anyone.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #030712; padding: 30px; text-align: center; border-top: 1px solid #1F2937;">
              <p style="color: #6B7280; font-size: 12px; line-height: 18px; margin: 0 0 10px 0;">
                If you didn't request this code, please ignore this email.
              </p>
              <p style="color: #4B5563; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} SalesCentri. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate plain text version of OTP email
 */
function generateOTPEmailText(otp: string, expiryMinutes: number): string {
  return `
SalesCentri - Verification Code

Thank you for your interest in SalesCentri.

Your OTP Code: ${otp}

This code will expire in ${expiryMinutes} minutes.

For security reasons, never share this code with anyone.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} SalesCentri. All rights reserved.
  `.trim();
}

/**
 * Send OTP via email
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  expiryMinutes: number = 3
): Promise<{ success: boolean; message: string; messageId?: string }> {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: `Your Sales Centri Verification Code: ${otp}`,
      text: generateOTPEmailText(otp, expiryMinutes),
      html: generateOTPEmailHTML(otp, expiryMinutes),
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
      },
    });

    console.log('[Email] OTP sent successfully:', {
      messageId: info.messageId,
      recipient: email,
      accepted: info.accepted,
    });

    return {
      success: true,
      message: 'OTP email sent successfully',
      messageId: info.messageId,
    };
  } catch (error) {
    console.error('[Email] Failed to send OTP:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  objective: string
): Promise<{ success: boolean; message: string }> {
  try {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Sales Centri</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #000000;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #0D1117; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 600;">Welcome to Sales Centri! 🎉</h1>
            </td>
          </tr>
          
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #E5E7EB; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Hi there,
              </p>
              <p style="color: #E5E7EB; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Thank you for reaching out to us regarding <strong style="color: #60A5FA;">${objective}</strong>. We're excited to connect with you!
              </p>
              <p style="color: #E5E7EB; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                Our team will review your request and get back to you within 24 hours.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://salescentri.com" style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Visit Our Website</a>
              </div>
            </td>
          </tr>
          
          <tr>
            <td style="background-color: #030712; padding: 30px; text-align: center; border-top: 1px solid #1F2937;">
              <p style="color: #6B7280; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} SalesCentri. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Welcome to Sales Centri - We\'ve received your request!',
      html,
    });

    return { success: true, message: 'Welcome email sent' };
  } catch (error) {
    console.error('[Email] Failed to send welcome email:', error);
    return { success: false, message: 'Failed to send welcome email' };
  }
}

/**
 * Send Print Media OCR upload notification email with attachments
 */
export async function sendBusinessOCREmail(
  userEmail: string,
  userId: string,
  files: { filename: string; content: Buffer; contentType: string }[]
): Promise<{ success: boolean; message: string }> {
  try {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Print Media OCR Upload</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
    <h2 style="color: #2563EB;">New Print Media OCR Upload</h2>
    <p>A user has uploaded business card files for OCR processing.</p>
    <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
      <tr style="background-color: #f8f9fa;">
        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">User ID:</td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${userId}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">User Email:</td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${userEmail}</td>
      </tr>
      <tr style="background-color: #f8f9fa;">
        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Files Count:</td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${files.length}</td>
      </tr>
      <tr>
        <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Upload Time:</td>
        <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date().toLocaleString()}</td>
      </tr>
    </table>
    <p style="color: #666; font-size: 14px;">Please process these files and send the Excel output to the user within 24 working hours.</p>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'SalesCentri'}" <${process.env.SMTP_FROM_EMAIL || 'no-reply@salescentri.com'}>`,
      to: 'info@salescentri.com',
      subject: `Print Media OCR Upload - ${files.length} files from ${userEmail}`,
      html,
      attachments: files,
    });

    return { success: true, message: 'Print Media OCR email sent' };
  } catch (error) {
    console.error('[Email] Failed to send Print Media OCR email:', error);
    return { success: false, message: 'Failed to send Print Media OCR email' };
  }
}

export async function sendPrintMediaOCREmail(
  userEmail: string,
  userId: string,
  files: { filename: string; content: Buffer; contentType: string }[]
): Promise<{ success: boolean; message: string }> {
  // For now, reuse the same underlying implementation and message, but provide a separate name
  return await sendBusinessOCREmail(userEmail, userId, files);
}

export default transporter;
