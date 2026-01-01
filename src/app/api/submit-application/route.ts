import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string;
    const role = formData.get('role') as string;
    const currentCTC = formData.get('currentCTC') as string;
    const experience = formData.get('experience') as string;
    const resume = formData.get('resume') as File | null;

    // Validate required fields
    if (!name || !email || !phone || !city || !role || !currentCTC) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test the connection
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error('SMTP connection failed:', verifyError);
      return NextResponse.json(
        { error: 'Email service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    // Prepare email content
    const emailSubject = `Job Application for ${role} Position - ${name}`;
    const emailBody = `
      New job application received:
      
      Position: ${role}
      
      Candidate Details:
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      City: ${city}
      Previous/Current CTC: ${currentCTC} Lakhs
      
      Experience & Skills:
      ${experience || 'Not provided'}
      
      Application submitted on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
    `;

    // Prepare email options
    interface MailOptions {
      from: string;
      to: string;
      subject: string;
      text: string;
      html: string;
      attachments?: Array<{
        filename: string;
        content: Buffer;
        contentType: string;
      }>;
    }

    const mailOptions: MailOptions = {
      from: process.env.SMTP_USER as string,
      to: 'hr@salescentri.com', // HR Email
      subject: emailSubject,
      text: emailBody,
      html: emailBody.replace(/\n/g, '<br>'),
    };

    // Handle resume attachment
    if (resume && resume.size > 0) {
      const resumeBuffer = Buffer.from(await resume.arrayBuffer());
      mailOptions.attachments = [
        {
          filename: `${name.replace(/\s+/g, '_')}_Resume_${resume.name}`,
          content: resumeBuffer,
          contentType: resume.type,
        },
      ];
    }

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to candidate
    const confirmationEmail = {
      from: process.env.SMTP_USER,
      to: email,
      subject: `Application Received - ${role} Position at Sales Centri`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for your application!</h2>
          
          <p>Dear ${name},</p>
          
          <p>We have received your application for the <strong>${role}</strong> position at SalesCentri.</p>
          
          <p><strong>Application Summary:</strong></p>
          <ul>
            <li>Position: ${role}</li>
            <li>Current/Previous CTC: ${currentCTC} Lakhs</li>
            <li>City: ${city}</li>
          </ul>
          
          <p>Our HR team will review your application and get back to you within 2-3 business days.</p>
          
          <p>Best regards,<br>
          SalesCentri HR Team</p>
          
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated email. Please do not reply to this email address.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(confirmationEmail);

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
