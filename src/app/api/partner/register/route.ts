import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { adminDb } from '@/app/lib/firebaseAdmin';

const INTERNAL_NOTIFY_EMAIL = 'no-reply@salescentri.com';

function assertSmtpConfig() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS.');
  }
}

async function ensureCollectionExists() {
  if (!adminDb) {
    throw new Error('Firestore not initialized. Please check Firebase configuration.');
  }

  try {
    // Check if partner_registrations_meta collection exists by trying to read meta
    const metaRef = adminDb.collection('partner_registrations_meta').doc('meta');
    const metaSnap = await metaRef.get();
    
    if (!metaSnap.exists) {
      // Create meta document to ensure collection exists
      const now = new Date().toISOString();
      await metaRef.set({ 
        updatedAt: now, 
        count: 0,
        description: 'Partner registration submissions metadata'
      });
      console.log('✅ Created partner_registrations_meta collection');
    }
  } catch (error: any) {
    console.error('Error ensuring collection exists:', error);
    // Continue anyway - collection might already exist
  }
}

async function storeInFirestore(data: any): Promise<string> {
  if (!adminDb) {
    throw new Error('Firestore not initialized');
  }

  // Ensure collection exists first
  await ensureCollectionExists();

  // Store the registration data
  const docRef = await adminDb.collection('partner_registrations').add({
    ...data,
    status: 'submitted',
    createdAt: adminDb.FieldValue.serverTimestamp(),
    updatedAt: adminDb.FieldValue.serverTimestamp(),
  } as any);

  // Update meta count
  const metaRef = adminDb.collection('partner_registrations_meta').doc('meta');
  const metaSnap = await metaRef.get();
  const currentCount = metaSnap.exists ? (metaSnap.data()?.count || 0) : 0;
  await metaRef.set({ 
    count: currentCount + 1,
    updatedAt: new Date().toISOString()
  }, { merge: true });

  return docRef.id;
}

function buildEmailContent(registrationData: any) {
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? INTERNAL_NOTIFY_EMAIL;
  const fromName = process.env.SMTP_FROM_NAME ?? 'SalesCentri Partner Portal';

  const subject = `New Partner Registration - ${registrationData.partnershipType} - ${registrationData.country}`;

  // Build detailed email body
  const textBody = [
    'New Partner Registration Received',
    '='.repeat(50),
    '',
    'PARTNERSHIP INFORMATION:',
    `Partnership Type: ${registrationData.partnershipType || 'N/A'}`,
    `Country: ${registrationData.country || 'N/A'}`,
    '',
    'COMPANY INFORMATION:',
    `Company Legal Name: ${registrationData.partnerDetails?.companyLegalName || 'N/A'}`,
    `Company Name: ${registrationData.partnerDetails?.companyName || 'N/A'}`,
    `Website: ${registrationData.partnerDetails?.website || 'N/A'}`,
    `Registered Address: ${registrationData.partnerDetails?.registeredAddress || 'N/A'}`,
    '',
    'CONTACT INFORMATION:',
    `Contact Person: ${registrationData.partnerDetails?.contactPersonName || 'N/A'}`,
    `Email: ${registrationData.partnerDetails?.contactPersonEmail || 'N/A'}`,
    `Phone: ${registrationData.partnerDetails?.contactPersonPhone || 'N/A'}`,
    '',
    'TAX & BANKING:',
    `Tax ID: ${registrationData.partnerDetails?.taxId || 'N/A'}`,
    ...(registrationData.partnerDetails?.bankAccount 
      ? [`Bank Account: ${registrationData.partnerDetails.bankAccount}`]
      : []
    ),
    '',
    'DOCUMENTS:',
    ...(registrationData.documents && Object.keys(registrationData.documents).length > 0
      ? Object.keys(registrationData.documents).map(docId => {
          const doc = registrationData.documents[docId];
          return `- ${docId}: ${doc.fileName || 'Uploaded'}`;
        })
      : ['- No documents uploaded']
    ),
    '',
    'SUBMISSION DETAILS:',
    `Submitted At: ${new Date().toISOString()}`,
    `Application ID: ${registrationData.applicationId || 'Pending'}`,
    '',
    '='.repeat(50),
    'Please review this application in the partner admin dashboard.',
  ].join('\n');

  const htmlBody = [
    `<div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #0D1117; color: #F0F6FC; padding: 32px;">`,
    `<div style="background: linear-gradient(145deg, rgba(22,27,34,0.95), rgba(13,17,23,0.95)); border-radius: 20px; padding: 28px; border: 1px solid rgba(88,166,255,0.18); box-shadow: 0 20px 45px rgba(0,0,0,0.45);">`,
    `<h2 style="color: #58A6FF; margin-top: 0;">New Partner Registration Received</h2>`,
    `<div style="margin-top: 24px;">`,
    `<h3 style="color: #58A6FF; margin-top: 20px;">Partnership Information</h3>`,
    `<table style="width: 100%; border-collapse: collapse; margin-top: 12px;">`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Partnership Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.partnershipType || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Country:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.country || 'N/A'}</td></tr>`,
    `</table>`,
    `<h3 style="color: #58A6FF; margin-top: 24px;">Company Information</h3>`,
    `<table style="width: 100%; border-collapse: collapse; margin-top: 12px;">`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Company Legal Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.partnerDetails?.companyLegalName || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Company Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.partnerDetails?.companyName || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Website:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.partnerDetails?.website || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Address:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.partnerDetails?.registeredAddress || 'N/A'}</td></tr>`,
    `</table>`,
    `<h3 style="color: #58A6FF; margin-top: 24px;">Contact Information</h3>`,
    `<table style="width: 100%; border-collapse: collapse; margin-top: 12px;">`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Contact Person:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.partnerDetails?.contactPersonName || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);"><a href="mailto:${registrationData.partnerDetails?.contactPersonEmail || ''}" style="color: #58A6FF;">${registrationData.partnerDetails?.contactPersonEmail || 'N/A'}</a></td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.partnerDetails?.contactPersonPhone || 'N/A'}</td></tr>`,
    `</table>`,
    `<h3 style="color: #58A6FF; margin-top: 24px;">Documents</h3>`,
    `<ul style="margin-top: 12px; color: #8B949E;">`,
    ...(registrationData.documents && Object.keys(registrationData.documents).length > 0
      ? Object.keys(registrationData.documents).map(docId => {
          const doc = registrationData.documents[docId];
          return `<li style="padding: 6px 0;">${docId}: ${doc.fileName || 'Uploaded'}</li>`;
        })
      : ['<li>No documents uploaded</li>']
    ),
    `</ul>`,
    `<div style="margin-top: 32px; padding: 16px; background: rgba(88,166,255,0.1); border-radius: 12px; border: 1px solid rgba(88,166,255,0.2);">`,
    `<p style="margin: 0; color: #8B949E;"><strong>Application ID:</strong> ${registrationData.applicationId || 'Pending'}</p>`,
    `<p style="margin: 8px 0 0 0; color: #8B949E;"><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>`,
    `</div>`,
    `</div>`,
    `</div>`,
    `</div>`,
  ].join('\n');

  return {
    from: `"${fromName}" <${fromEmail}>`,
    to: INTERNAL_NOTIFY_EMAIL,
    subject,
    text: textBody,
    html: htmlBody,
  };
}

async function sendEmailNotification(registrationData: any) {
  assertSmtpConfig();

  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = buildEmailContent(registrationData);
  await transporter.sendMail(mailOptions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.partnershipType) {
      return NextResponse.json(
        { error: 'Partnership type is required' },
        { status: 400 }
      );
    }

    if (!body.country) {
      return NextResponse.json(
        { error: 'Country is required' },
        { status: 400 }
      );
    }

    if (!body.partnerDetails) {
      return NextResponse.json(
        { error: 'Partner details are required' },
        { status: 400 }
      );
    }

    // Validate partner details
    const { partnerDetails } = body;
    const requiredFields = ['contactPersonName', 'contactPersonEmail', 'contactPersonPhone'];
    
    for (const field of requiredFields) {
      if (!partnerDetails[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Store in Firestore
    let applicationId: string;
    try {
      applicationId = await storeInFirestore(body);
    } catch (error: any) {
      console.error('Error storing in Firestore:', error);
      return NextResponse.json(
        { 
          error: 'Failed to store registration data',
          details: error.message 
        },
        { status: 500 }
      );
    }

    // Send email notification (non-blocking)
    const registrationDataWithId = { ...body, applicationId };
    sendEmailNotification(registrationDataWithId).catch((err) => {
      console.error('Error sending email notification:', err);
      // Don't fail the request if email fails
    });

    return NextResponse.json({
      success: true,
      applicationId,
      message: 'Partner registration submitted successfully',
    });

  } catch (error: any) {
    console.error('Error processing partner registration:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred while processing your registration',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve partner registrations (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firestore not initialized' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (applicationId) {
      // Get specific application
      const docRef = adminDb.collection('partner_registrations').doc(applicationId);
      const doc = await docRef.get();

      if (!doc.exists) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        application: {
          id: doc.id,
          ...doc.data(),
        },
      });
    } else {
      // Get all applications (with optional filtering)
      const status = searchParams.get('status');
      const country = searchParams.get('country');
      const partnershipType = searchParams.get('partnershipType');

      let query = adminDb.collection('partner_registrations').orderBy('createdAt', 'desc').limit(50);

      if (status) {
        query = query.where('status', '==', status) as any;
      }
      if (country) {
        query = query.where('country', '==', country) as any;
      }
      if (partnershipType) {
        query = query.where('partnershipType', '==', partnershipType) as any;
      }

      const snapshot = await query.get();
      const applications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({
        success: true,
        applications,
        count: applications.length,
      });
    }

  } catch (error: any) {
    console.error('Error fetching partner registrations:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch registrations',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
