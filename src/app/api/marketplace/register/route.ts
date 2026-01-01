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
    // Check if marketplace_registrations_meta collection exists by trying to read meta
    const metaRef = adminDb.collection('marketplace_registrations_meta').doc('meta');
    const metaSnap = await metaRef.get();
    
    if (!metaSnap.exists) {
      // Create meta document to ensure collection exists
      const now = new Date().toISOString();
      await metaRef.set({ 
        updatedAt: now, 
        count: 0,
        description: 'Marketplace registration submissions metadata'
      });
      console.log('✅ Created marketplace_registrations_meta collection');
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
  const docRef = await adminDb.collection('marketplace_registrations').add({
    ...data,
    status: 'submitted',
    createdAt: adminDb.FieldValue.serverTimestamp(),
    updatedAt: adminDb.FieldValue.serverTimestamp(),
  } as any);

  // Update meta count
  const metaRef = adminDb.collection('marketplace_registrations_meta').doc('meta');
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
  const fromName = process.env.SMTP_FROM_NAME ?? 'SalesCentri Marketplace';

  const subject = `New Marketplace Registration - ${registrationData.accountCategory} - ${registrationData.businessType}`;

  // Build detailed email body
  const textBody = [
    'New Marketplace Registration Received',
    '='.repeat(50),
    '',
    'ACCOUNT INFORMATION:',
    `Account Category: ${registrationData.accountCategory || 'N/A'}`,
    `Business Role: ${registrationData.businessType || 'N/A'}`,
    ...(registrationData.accountCategory === 'Individual' 
      ? [`Individual Type: ${registrationData.individualType || 'N/A'}`]
      : [`Business Size: ${registrationData.businessSize || 'N/A'}`]
    ),
    '',
    'REGION & COMPANY DETAILS:',
    `Region: ${registrationData.region || 'N/A'}`,
    ...(registrationData.accountCategory === 'Business' 
      ? [`Company Type: ${registrationData.companyType || 'N/A'}`]
      : []
    ),
    '',
    'COMPANY INFORMATION:',
    ...(registrationData.accountCategory === 'Business' 
      ? [`Company Legal Name: ${registrationData.companyDetails?.companyLegalName || 'N/A'}`]
      : []
    ),
    `Contact Person: ${registrationData.companyDetails?.contactPersonName || 'N/A'}`,
    `Contact ID: ${registrationData.companyDetails?.contactPersonId || 'N/A'}`,
    `Business Email: ${registrationData.companyDetails?.businessEmail || 'N/A'}`,
    `Business Phone: ${registrationData.companyDetails?.businessPhone || 'N/A'}`,
    `Registered Address: ${registrationData.companyDetails?.registeredAddress || 'N/A'}`,
    `Tax ID: ${registrationData.companyDetails?.taxId || 'N/A'}`,
    ...(registrationData.companyDetails?.website 
      ? [`Website: ${registrationData.companyDetails.website}`]
      : []
    ),
    '',
    'DOCUMENTS:',
    ...(registrationData.documents && Object.keys(registrationData.documents).length > 0
      ? Object.keys(registrationData.documents).map(docId => `- ${docId}: Uploaded`)
      : ['- No documents uploaded']
    ),
    '',
    'SUBMISSION DETAILS:',
    `Submitted At: ${new Date().toISOString()}`,
    `Application ID: ${registrationData.applicationId || 'Pending'}`,
    '',
    '='.repeat(50),
    'Please review this application in the admin dashboard.',
  ].join('\n');

  const htmlBody = [
    `<div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #0D1117; color: #F0F6FC; padding: 32px;">`,
    `<div style="background: linear-gradient(145deg, rgba(22,27,34,0.95), rgba(13,17,23,0.95)); border-radius: 20px; padding: 28px; border: 1px solid rgba(88,166,255,0.18); box-shadow: 0 20px 45px rgba(0,0,0,0.45);">`,
    `<h2 style="color: #58A6FF; margin-top: 0;">New Marketplace Registration Received</h2>`,
    `<div style="margin-top: 24px;">`,
    `<h3 style="color: #58A6FF; margin-top: 20px;">Account Information</h3>`,
    `<table style="width: 100%; border-collapse: collapse; margin-top: 12px;">`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Account Category:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.accountCategory || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Business Role:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.businessType || 'N/A'}</td></tr>`,
    ...(registrationData.accountCategory === 'Individual'
      ? [`<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Individual Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.individualType || 'N/A'}</td></tr>`]
      : [`<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Business Size:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.businessSize || 'N/A'}</td></tr>`]
    ),
    `</table>`,
    `<h3 style="color: #58A6FF; margin-top: 24px;">Region & Company Details</h3>`,
    `<table style="width: 100%; border-collapse: collapse; margin-top: 12px;">`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Region:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.region || 'N/A'}</td></tr>`,
    ...(registrationData.accountCategory === 'Business'
      ? [`<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Company Type:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyType || 'N/A'}</td></tr>`]
      : []
    ),
    `</table>`,
    `<h3 style="color: #58A6FF; margin-top: 24px;">Company Information</h3>`,
    `<table style="width: 100%; border-collapse: collapse; margin-top: 12px;">`,
    ...(registrationData.accountCategory === 'Business'
      ? [`<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Company Legal Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyDetails?.companyLegalName || 'N/A'}</td></tr>`]
      : []
    ),
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Contact Person:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyDetails?.contactPersonName || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Contact ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyDetails?.contactPersonId || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Business Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyDetails?.businessEmail || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Business Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyDetails?.businessPhone || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Registered Address:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyDetails?.registeredAddress || 'N/A'}</td></tr>`,
    `<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Tax ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyDetails?.taxId || 'N/A'}</td></tr>`,
    ...(registrationData.companyDetails?.website
      ? [`<tr><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2); color: #8B949E;"><strong>Website:</strong></td><td style="padding: 8px; border-bottom: 1px solid rgba(88,166,255,0.2);">${registrationData.companyDetails.website}</td></tr>`]
      : []
    ),
    `</table>`,
    `<h3 style="color: #58A6FF; margin-top: 24px;">Documents</h3>`,
    `<ul style="line-height: 1.7; padding-left: 22px; margin: 16px 0;">`,
    ...(registrationData.documents && Object.keys(registrationData.documents).length > 0
      ? Object.keys(registrationData.documents).map(docId => `<li style="margin-bottom: 6px;">${docId}: Uploaded</li>`)
      : ['<li style="margin-bottom: 6px;">No documents uploaded</li>']
    ),
    `</ul>`,
    `<div style="margin-top: 24px; padding: 16px; background: rgba(88,166,255,0.08); border-radius: 12px; border-left: 3px solid #58A6FF;">`,
    `<p style="margin: 0; font-size: 13px; color: #8B949E;">Submitted At: ${new Date().toISOString()}</p>`,
    `<p style="margin: 6px 0 0 0; font-size: 13px; color: #8B949E;">Application ID: ${registrationData.applicationId || 'Pending'}</p>`,
    `</div>`,
    `</div>`,
    `</div>`,
    `<p style="margin-top: 24px; font-size: 12px; color: #8B949E; text-align: center;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>`,
    `</div>`,
  ].join('');

  return { subject, textBody, htmlBody, fromEmail, fromName };
}

async function sendNotificationEmail(registrationData: any, applicationId: string) {
  assertSmtpConfig();

  const { subject, textBody, htmlBody, fromEmail, fromName } = buildEmailContent({
    ...registrationData,
    applicationId,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `${fromName} <${fromEmail}>`,
    to: INTERNAL_NOTIFY_EMAIL,
    subject,
    text: textBody,
    html: htmlBody,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.accountCategory || !body.businessType || !body.region) {
      return NextResponse.json(
        { error: 'Missing required fields: accountCategory, businessType, region' },
        { status: 400 }
      );
    }

    // Validate business-specific fields
    if (body.accountCategory === 'Business' && !body.companyType) {
      return NextResponse.json(
        { error: 'Missing required field: companyType (required for Business accounts)' },
        { status: 400 }
      );
    }

    // Validate individual-specific fields
    if (body.accountCategory === 'Individual' && !body.individualType) {
      return NextResponse.json(
        { error: 'Missing required field: individualType (required for Individual accounts)' },
        { status: 400 }
      );
    }

    // Validate company details
    if (!body.companyDetails) {
      return NextResponse.json(
        { error: 'Missing required field: companyDetails' },
        { status: 400 }
      );
    }

    // Prepare registration data (exclude file objects, just store file names)
    const registrationData = {
      accountCategory: body.accountCategory,
      businessType: body.businessType,
      region: body.region,
      individualType: body.individualType || null,
      businessSize: body.businessSize || null,
      companyType: body.companyType || null,
      companyDetails: body.companyDetails,
      documents: body.documents ? Object.keys(body.documents).reduce((acc: Record<string, string>, key: string) => {
        acc[key] = typeof body.documents[key] === 'string' 
          ? body.documents[key] 
          : body.documents[key]?.name || 'Uploaded';
        return acc;
      }, {}) : {},
      submittedAt: new Date().toISOString(),
    };

    // Store in Firestore (initialize first, then store)
    let applicationId: string;
    try {
      applicationId = await storeInFirestore(registrationData);
      console.log('✅ Marketplace registration stored in Firestore:', applicationId);
    } catch (firestoreError) {
      console.error('❌ Firestore storage error:', firestoreError);
      return NextResponse.json(
        { error: 'Failed to store registration data. Please try again later.' },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      await sendNotificationEmail(registrationData, applicationId);
      console.log('✅ Notification email sent to', INTERNAL_NOTIFY_EMAIL);
    } catch (emailError) {
      console.error('❌ Email notification error:', emailError);
      // Continue even if email fails - data is already stored
    }

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully',
      applicationId,
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Marketplace registration error:', error);
    return NextResponse.json(
      { error: 'Failed to submit registration. Please try again later.' },
      { status: 500 }
    );
  }
}

