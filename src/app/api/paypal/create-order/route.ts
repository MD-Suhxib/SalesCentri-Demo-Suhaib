import { NextResponse } from 'next/server';
import { getPayPalClient } from '../_client';
import { adminDb } from '@/app/lib/firebaseAdmin';
import { makeDocId } from '@/app/lib/pricingRepo';
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

type Body = {
  segment: 'Personal' | 'Business' | 'Funnel Level';
  billingCycle: 'Monthly' | 'Yearly';
  planName?: string;
  funnelLevel?: string;
  leadGenName?: string;
  currency?: 'USD' | 'INR' | 'GBP';
  amount?: number;
  returnUrl?: string;
  cancelUrl?: string;
};

async function getPriceFromFirestore(segment: string, billingCycle: string, planName?: string, funnelLevel?: string, leadGenName?: string) {
  try {
    if (!adminDb) return null;
    let query = adminDb.collection('pricing')
      .where('segment', '==', segment)
      .where('billingCycle', '==', billingCycle);
    
    if (segment === 'Funnel Level') {
      if (funnelLevel) query = query.where('funnelLevel', '==', funnelLevel);
      if (leadGenName) query = query.where('leadGenName', '==', leadGenName);
    } else {
      if (planName) query = query.where('planName', '==', planName);
    }
    
    const snap = await query.limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0].data() as { price?: unknown; minimumPrice?: unknown };
    // For funnel-level, prefer minimumPrice
    if (segment === 'Funnel Level' && typeof doc.minimumPrice === 'number') {
      return doc.minimumPrice;
    }
    if (typeof doc.price === 'number') return doc.price;
    return null;
  } catch {
    return null;
  }
}

async function getPriceFromClientFallback(segment: string, billingCycle: string, planName?: string, funnelLevel?: string, leadGenName?: string) {
  try {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    } as const;
    if (!config.projectId || !config.apiKey) return null;
    const app = getApps().length ? getApps()[0] : initializeApp(config);
    const db = getFirestore(app);
    const id = makeDocId({ segment, billingCycle, planName, funnelLevel, leadGenName } as any);
    const ref = doc(db, 'pricing', id);
    const s = await getDoc(ref);
    if (!s.exists()) return null;
    const data = s.data() as { price?: unknown; minimumPrice?: unknown };
    // For funnel-level, prefer minimumPrice
    if (segment === 'Funnel Level' && typeof data.minimumPrice === 'number') {
      return data.minimumPrice;
    }
    if (typeof data.price !== 'number') return null;
    return data.price;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    // Check for required environment variables
    if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_SECRET) {
      return NextResponse.json({ 
        error: 'PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_SECRET environment variables.' 
      }, { status: 500 });
    }
    
    // Validate request body exists and parse it safely
    let body: Body;
    try {
      // Check content-type header
      const contentType = req.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json({ 
          error: 'Invalid content-type. Expected application/json' 
        }, { status: 400 });
      }

      // Read and validate request body
      const rawBody = await req.text();
      if (!rawBody || rawBody.trim() === '') {
        return NextResponse.json({ 
          error: 'Request body is empty' 
        }, { status: 400 });
      }

      body = JSON.parse(rawBody) as Body;
    } catch (parseError) {
      console.error('PayPal create-order: JSON parse error:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : 'Unknown parse error'
      }, { status: 400 });
    }

    // Validate required fields
    if (!body.segment || !body.billingCycle) {
      return NextResponse.json({ 
        error: 'Missing required fields: segment and billingCycle are required' 
      }, { status: 400 });
    }

    // Validate segment-specific fields
    if (body.segment === 'Funnel Level') {
      if (!body.funnelLevel || !body.leadGenName) {
        return NextResponse.json({ 
          error: 'Missing required fields: funnelLevel and leadGenName are required for Funnel Level segment' 
        }, { status: 400 });
      }
    } else {
      if (!body.planName) {
        return NextResponse.json({ 
          error: 'Missing required fields: planName is required for Personal/Business segments' 
        }, { status: 400 });
      }
    }

    const { segment, billingCycle, planName, funnelLevel, leadGenName, returnUrl, cancelUrl } = body;
    const currency = body.currency || 'USD';

    // Use provided amount or get from pricing data
    let amount = body.amount;
    if (!amount) amount = await getPriceFromFirestore(segment, billingCycle, planName, funnelLevel, leadGenName);
    if (!amount) amount = await getPriceFromClientFallback(segment, billingCycle, planName, funnelLevel, leadGenName);
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid plan or non-numeric price for PayPal' }, { status: 400 });
    }

    const client = getPayPalClient();
    const paypalSDK = require('@paypal/checkout-server-sdk');
    const request = new paypalSDK.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    
    // Change intent to CAPTURE for immediate payment
    // Store all custom data in custom_id to avoid query param conflicts
    const planIdentifier = segment === 'Funnel Level' 
      ? `${funnelLevel}|${leadGenName}` 
      : planName;
    const customId = `${segment}|${billingCycle}|${planIdentifier}|${amount.toFixed(2)}`;
    
    const orderBody: any = {
      intent: 'CAPTURE', // Changed to CAPTURE for immediate payment
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          custom_id: customId,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        brand_name: 'Sales Centri',
        landing_page: 'BILLING',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
        }
      },
    };

    // Add return and cancel URLs if provided
    if (returnUrl || cancelUrl) {
      orderBody.application_context.return_url = returnUrl;
      orderBody.application_context.cancel_url = cancelUrl;
    }

    request.requestBody(orderBody);

    console.log('Creating PayPal order with body:', JSON.stringify(orderBody, null, 2));

    const order = await client.execute(request);

    console.log('PayPal order created successfully:', order.result.id);

    // Extract approval URL from PayPal response (more reliable than hardcoding)
    const approveLink = order.result.links?.find((link: any) => link.rel === 'approve');
    const approveUrl = approveLink?.href || null;

    return NextResponse.json({ 
      id: order.result.id,
      approveUrl, // Return the approval URL from PayPal API
      customId // Return custom_id for reference
    });
  } catch (e: any) {
    console.error('PayPal create-order: Error occurred:', e);
    
    // Provide more specific error messages
    if (e?.message) {
      console.error('Error details:', {
        message: e.message,
        stack: e.stack,
        name: e.name
      });
    }

    // Return appropriate error response
    const errorMessage = e?.message || 'Failed to create order';
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}



