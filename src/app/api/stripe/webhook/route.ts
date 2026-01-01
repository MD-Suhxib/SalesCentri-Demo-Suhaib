import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { logPaymentEvent, parsePaymentMetadata } from '@/app/lib/payment/utils';
import { writePaymentRecord } from '@/app/lib/payment/paymentStore';

// Initialize Stripe
function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  });
}

export async function POST(req: NextRequest) {
  const stripe = getStripeClient();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  try {
    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature provided' }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const metadata = parsePaymentMetadata(session.metadata || {});
      const paymentIntentId = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : undefined;

      let firestoreDocId: string | undefined;
      try {
        const result = await writePaymentRecord(
          {
            gateway: 'stripe',
            orderId: metadata?.orderId ?? null,
            sessionId: session.id,
            transactionId: paymentIntentId ?? null,
            amount:
              metadata?.amount ??
              (typeof session.amount_total === 'number' ? session.amount_total / 100 : null),
            currency:
              metadata?.currency ??
              (typeof session.currency === 'string' ? session.currency.toUpperCase() : null),
            segment: metadata?.segment ?? null,
            billingCycle: metadata?.billingCycle ?? null,
            planName: metadata?.planName ?? metadata?.leadGenName ?? null,
            status: session.payment_status ?? 'completed',
            userEmail: metadata?.userEmail ?? session.customer_email ?? null,
            source: 'stripe_webhook',
            metadata: {
              ...(session.metadata ?? {}),
              paymentMetadata: metadata ?? null,
              stripeCustomer: session.customer ?? null,
              paymentIntent: paymentIntentId ?? null,
              customerDetails: session.customer_details ?? null,
              webhookEventId: event.id,
              totalDetails: session.total_details ?? null,
              amountSubtotal: session.amount_subtotal ?? null,
              amountTotal: session.amount_total ?? null,
            },
            rawPayload: {
              eventId: event.id,
              eventType: event.type,
              created: event.created,
              apiVersion: event.api_version,
            },
          },
          {
            docId: metadata?.orderId || session.id,
            merge: true,
          },
        );
        firestoreDocId = result.id;
      } catch (error) {
        console.error('Failed to persist Stripe webhook payment:', error);
      }

      logPaymentEvent('stripe_payment_completed', 'stripe', {
        ...(metadata || {}),
        sessionId: session.id,
        paymentIntentId: session.payment_intent as string,
        customerEmail: session.customer_email || undefined,
        firestoreDocId,
      });

      // Here you would typically:
      // 1. Update order status in database
      // 2. Send confirmation email
      // 3. Activate subscription
      // 4. Update user account
      
      console.log('Payment completed for session:', session.id);
    } else if (event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      logPaymentEvent('stripe_payment_succeeded_async', 'stripe', {
        sessionId: session.id,
        paymentIntentId: session.payment_intent as string,
      });
    } else if (event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object as Stripe.Checkout.Session;
      logPaymentEvent('stripe_payment_failed', 'stripe', {
        sessionId: session.id,
        error: 'Async payment failed',
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

