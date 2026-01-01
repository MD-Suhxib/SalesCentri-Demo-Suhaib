import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      first_name,
      last_name,
      business_email,
      no_business_email = false,
      linkedin_profile,
      company,
      job_title,
      sales_team_size,
      areas_of_interest = [],
      additional_information
    } = body;

    // Validate required fields
    if (!first_name || !last_name || !business_email || !company || !job_title) {
      return NextResponse.json(
        { error: 'Missing required fields: first_name, last_name, business_email, company, job_title' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(business_email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get IP address and user agent for metadata
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // Prepare the data for external API
    const contactData = {
      first_name,
      last_name,
      business_email,
      no_business_email,
      linkedin_profile,
      company,
      job_title,
      sales_team_size,
      areas_of_interest,
      additional_information,
      ip_address,
      user_agent,
      created_at: new Date().toISOString()
    };

    // Send email notification to info@salescentri.com
    try {

      // Validate environment variables
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS environment variables.');
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.office365.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false
        }
      });

      // Test the connection
      await transporter.verify();

      // Prepare email content
      const emailSubject = `New Contact Form Submission - ${company}`;
      const emailBody = `
        New contact form submission received:
        
        Contact Details:
        Name: ${first_name} ${last_name}
        Email: ${business_email}
        Company: ${company}
        Job Title: ${job_title}
        Sales Team Size: ${sales_team_size}
        
        Areas of Interest: ${areas_of_interest.join(', ')}
        
        Additional Information:
        ${additional_information}
        
        Submission Details:
        IP Address: ${ip_address}
        User Agent: ${user_agent}
        Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      `;

      // Send email to info@salescentri.com
      await transporter.sendMail({
        from: process.env.SMTP_USER as string,
        to: 'info@salescentri.com',
        subject: emailSubject,
        text: emailBody,
        html: emailBody.replace(/\n/g, '<br>'),
      });

    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      
      // More detailed error logging
      if (emailError instanceof Error) {
        console.error('Error details:', {
          message: emailError.message,
          code: (emailError as any).code,
          response: (emailError as any).response,
          responseCode: (emailError as any).responseCode
        });
      }
      
      // Continue execution even if email fails
    }

    // Send to external API
    const externalApiResponse = await fetch('https://app.demandintellect.com/app/api/contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!externalApiResponse.ok) {
      // If external API fails, still return success to user but log the error
      console.error('External API failed:', await externalApiResponse.text());
      // You might want to store in a fallback database here
    }

    // Generate a mock ID for response (in real implementation, you'd get this from your database)
    const mockId = Math.floor(Math.random() * 10000) + 1;

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        id: mockId
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch from external API
    const apiUrl = new URL('https://app.demandintellect.com/app/api/contact-form');
    if (id) apiUrl.searchParams.set('id', id);
    apiUrl.searchParams.set('limit', limit.toString());
    apiUrl.searchParams.set('offset', offset.toString());

    const externalApiResponse = await fetch(apiUrl.toString());
    
    if (!externalApiResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch contact form submissions' },
        { status: 500 }
      );
    }

    const data = await externalApiResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching contact forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact form submissions' },
      { status: 500 }
    );
  }
}
