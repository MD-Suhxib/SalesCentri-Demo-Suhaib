import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '@/app/lib/firebaseAdmin';

// Initialize Firebase Storage using Admin SDK
const getStorage = () => {
  if (!adminApp) {
    throw new Error('Firebase Admin not initialized');
  }
  return adminApp.storage();
};

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminApp) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized. Please check server configuration.' },
        { status: 500 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const partnerId = formData.get('partnerId') as string;
    const documentType = formData.get('documentType') as string;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!partnerId) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const sanitizedDocType = documentType.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${partnerId}/${sanitizedDocType}_${timestamp}.${fileExtension}`;

    // Get storage bucket
    const storage = getStorage();
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    
    if (!bucketName) {
      return NextResponse.json(
        { error: 'Storage bucket not configured' },
        { status: 500 }
      );
    }

    const bucket = storage.bucket(bucketName);
    const fileUpload = bucket.file(`partner-documents/${fileName}`);

    // Upload file
    await fileUpload.save(buffer, {
      metadata: {
        contentType: file.type,
        metadata: {
          partnerId,
          documentType,
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Make file publicly accessible (optional - remove if you want private files)
    // await fileUpload.makePublic();

    // Generate signed URL for private access (expires in 7 days)
    const [signedUrl] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Get public URL (use this if file is made public)
    const publicUrl = `https://storage.googleapis.com/${bucketName}/partner-documents/${fileName}`;

    return NextResponse.json({
      success: true,
      fileName,
      fileUrl: signedUrl, // Use signedUrl for private files, publicUrl for public files
      publicUrl,
      message: 'File uploaded successfully',
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for fetching uploaded documents)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');

    if (!partnerId) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
        { status: 400 }
      );
    }

    if (!adminApp) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    const storage = getStorage();
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    
    if (!bucketName) {
      return NextResponse.json(
        { error: 'Storage bucket not configured' },
        { status: 500 }
      );
    }

    const bucket = storage.bucket(bucketName);
    const [files] = await bucket.getFiles({
      prefix: `partner-documents/${partnerId}/`,
    });

    const fileList = await Promise.all(
      files.map(async (file) => {
        const [metadata] = await file.getMetadata();
        const [signedUrl] = await file.getSignedUrl({
          action: 'read',
          expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        return {
          name: file.name,
          size: metadata.size,
          contentType: metadata.contentType,
          created: metadata.timeCreated,
          updated: metadata.updated,
          url: signedUrl,
          metadata: metadata.metadata,
        };
      })
    );

    return NextResponse.json({
      success: true,
      files: fileList,
    });

  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch files',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle DELETE requests (optional - for deleting documents)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    if (!adminApp) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    const storage = getStorage();
    const bucketName = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    
    if (!bucketName) {
      return NextResponse.json(
        { error: 'Storage bucket not configured' },
        { status: 500 }
      );
    }

    const bucket = storage.bucket(bucketName);
    const file = bucket.file(`partner-documents/${fileName}`);

    await file.delete();

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
