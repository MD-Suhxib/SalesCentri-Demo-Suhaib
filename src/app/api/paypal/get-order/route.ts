import { NextResponse } from 'next/server';
import { getPayPalClient } from '../_client';

/**
 * GET endpoint to retrieve order details from PayPal
 * This is used to fetch order information including custom_id
 * when PayPal redirects back without preserving query params
 */
export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const client = getPayPalClient();
    const paypalSDK = require('@paypal/checkout-server-sdk');
    const request = new paypalSDK.orders.OrdersGetRequest(orderId);

    const order = await client.execute(request);
    const orderData = order.result;

    // Extract custom_id from purchase_units
    const customId = orderData.purchase_units?.[0]?.custom_id || null;
    
    // Parse custom_id to extract metadata if needed
    let metadata = null;
    if (customId) {
      const parts = customId.split('|');
      if (parts.length >= 3) {
        metadata = {
          segment: parts[0],
          billingCycle: parts[1],
          planName: parts[2],
          amount: parts[3] ? parseFloat(parts[3]) : null,
        };
      }
    }

    return NextResponse.json({
      id: orderData.id,
      status: orderData.status,
      customId,
      metadata,
      purchase_units: orderData.purchase_units,
      payer: orderData.payer,
    });
  } catch (e: any) {
    console.error('PayPal get-order error:', e);
    const errorMessage = e?.message || 'Failed to get order details';
    return NextResponse.json({ 
      error: errorMessage,
      details: e?.response || null
    }, { status: 500 });
  }
}

