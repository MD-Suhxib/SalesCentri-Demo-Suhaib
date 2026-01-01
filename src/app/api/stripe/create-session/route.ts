import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
// Import price utilities from shared module
import { getPriceFromFirestore, getPriceFromClientFallback } from '@/app/lib/payment/priceUtils';
import { formatPaymentMetadata, getPaymentUrls, logPaymentEvent } from '@/app/lib/payment/utils';

type Body = {
  segment: 'Personal' | 'Business' | 'Funnel Level';
  billingCycle: 'Monthly' | 'Yearly';
  planName?: string;
  funnelLevel?: string;
  leadGenName?: string;
  currency?: 'USD';
  amount?: number;
  orderId?: string;
  userEmail?: string;
};

// Initialize Stripe
function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY is not set');
    return null;
  }
  
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  });
}

export async function POST(req: Request) {
  try {
    // Check for required environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        error: 'Stripe credentials not configured. Please set STRIPE_SECRET_KEY environment variable.' 
      }, { status: 500 });
    }
    
    // Validate request body
    let body: Body;
    try {
      const contentType = req.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json({ 
          error: 'Invalid content-type. Expected application/json' 
        }, { status: 400 });
      }

      const rawBody = await req.text();
      if (!rawBody || rawBody.trim() === '') {
        return NextResponse.json({ 
          error: 'Request body is empty' 
        }, { status: 400 });
      }

      body = JSON.parse(rawBody) as Body;
    } catch (parseError) {
      console.error('Stripe create-session: JSON parse error:', parseError);
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

    const { segment, billingCycle, planName, funnelLevel, leadGenName, currency = 'USD', orderId, userEmail } = body;

    // Get amount from pricing data if not provided
    let amount = body.amount;
    if (!amount) {
      amount = await getPriceFromFirestore(segment, billingCycle, planName, funnelLevel, leadGenName);
    }
    if (!amount) {
      amount = await getPriceFromClientFallback(segment, billingCycle, planName, funnelLevel, leadGenName);
    }
    
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid plan or non-numeric price' }, { status: 400 });
    }

    // Get Stripe client
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({ error: 'Stripe client initialization failed' }, { status: 500 });
    }

    // Generate order ID if not provided
    const finalOrderId = orderId || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get success and cancel URLs
    const { successUrl, cancelUrl } = getPaymentUrls('stripe');

    // Create metadata for the session
    const metadata = formatPaymentMetadata({
      segment,
      billingCycle,
      planName,
      funnelLevel,
      leadGenName,
      amount,
      currency,
      orderId: finalOrderId,
      userEmail,
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency.toLowerCase(),
            product_data: {
              name: segment === 'Funnel Level' 
                ? `${leadGenName} (${billingCycle})`
                : `${planName} (${billingCycle})`,
              description: `SalesCentri ${segment} Plan - ${billingCycle} billing`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: userEmail,
    });

    logPaymentEvent('stripe_session_created', 'stripe', {
      segment,
      billingCycle,
      amount,
      orderId: finalOrderId,
      sessionId: session.id,
    });

    console.log('Stripe checkout session created:', session.id);

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      id: session.id, // For compatibility
    });
  } catch (e: any) {
    console.error('Stripe create-session: Error occurred:', e);
    
    const errorMessage = e?.message || 'Failed to create checkout session';
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}

