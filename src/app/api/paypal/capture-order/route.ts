import { NextResponse } from 'next/server';
import { getPayPalClient } from '../_client';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const client = getPayPalClient();
    const paypalSDK = require('@paypal/checkout-server-sdk');
    const request = new paypalSDK.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client.execute(request);
    
    // Verify capture status
    const captureStatus = capture.result?.status;
    if (captureStatus !== 'COMPLETED') {
      console.warn('PayPal capture status is not COMPLETED:', captureStatus);
    }

    console.log('PayPal order captured successfully:', orderId);
    
    return NextResponse.json({ 
      success: true, 
      status: captureStatus,
      details: capture.result 
    });
  } catch (e: any) {
    console.error('PayPal capture error:', e);
    const errorMessage = e?.message || 'Failed to capture order';
    return NextResponse.json({ 
      error: errorMessage,
      details: e?.response || null
    }, { status: 500 });
  }
}


