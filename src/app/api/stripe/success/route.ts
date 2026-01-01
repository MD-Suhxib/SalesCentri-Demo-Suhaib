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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.redirect(`${request.nextUrl.origin}/checkout?error=missing_session_id`);
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.redirect(`${request.nextUrl.origin}/checkout?error=stripe_not_configured`);
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.redirect(`${request.nextUrl.origin}/checkout?error=session_not_found`);
    }

    // Parse metadata
    const metadata = parsePaymentMetadata(session.metadata || {});
    
    if (!metadata) {
      return NextResponse.redirect(`${request.nextUrl.origin}/checkout?error=invalid_metadata`);
    }

    // Verify payment status
    if (session.payment_status === 'paid') {
      const orderId = metadata.orderId;
      const paymentIntentId = typeof session.payment_intent === 'string' ? session.payment_intent : undefined;

      let docId: string | undefined;
      try {
        const result = await writePaymentRecord(
          {
            gateway: 'stripe',
            orderId,
            sessionId: session.id,
            transactionId: paymentIntentId,
            amount: metadata.amount,
            currency: metadata.currency,
            segment: metadata.segment,
            billingCycle: metadata.billingCycle,
            planName: metadata.planName || metadata.leadGenName || 'unknown',
            status: 'completed',
            userEmail: metadata.userEmail ?? session.customer_email ?? null,
            source: 'stripe_success_redirect',
            metadata: {
              ...(session.metadata ?? {}),
              stripeCustomer: session.customer ?? null,
              paymentIntent: paymentIntentId ?? null,
              customerDetails: session.customer_details ?? null,
            },
            rawPayload: {
              session,
            },
          },
          {
            docId: orderId || session.id,
          },
        );
        docId = result.id;
        console.log('Stripe payment persisted to Firestore:', result);
      } catch (error) {
        console.error('Error writing Stripe payment to Firestore:', error);
        // Continue with redirect even if storage fails
      }

      logPaymentEvent('stripe_success_redirect', 'stripe', {
        ...metadata,
        sessionId: session.id,
        paymentIntentId: session.payment_intent as string,
        firestoreDocId: docId,
      });

      // Redirect to home page first to show success popup (same as PayPal flow)
      // The home page will detect payment_success params and show the PaymentSuccessPopup
      const successUrl = new URL('/', request.nextUrl.origin);
      successUrl.searchParams.set('payment_success', 'true');
      successUrl.searchParams.set('gateway', 'stripe');
      const amountParam =
        typeof metadata.amount === 'number' && Number.isFinite(metadata.amount)
          ? metadata.amount.toString()
          : '';
      if (amountParam) {
        successUrl.searchParams.set('amount', amountParam);
      }
      if (metadata.currency) {
        successUrl.searchParams.set('currency', metadata.currency);
      }
      const planParam = metadata.planName || metadata.leadGenName || '';
      if (planParam) {
        successUrl.searchParams.set('plan', planParam);
      }
      if (docId) {
        successUrl.searchParams.set('payment_doc_id', docId);
      }
      successUrl.searchParams.set('payment_id', docId ?? (paymentIntentId ?? session.id));
      successUrl.searchParams.set('session_id', sessionId);

      console.log('Redirecting to home page with payment success:', successUrl.toString());
      return NextResponse.redirect(successUrl.toString());
    } else {
      // Payment not completed
      return NextResponse.redirect(`${request.nextUrl.origin}/checkout?error=payment_not_completed&status=${session.payment_status}`);
    }
  } catch (error: any) {
    console.error('Stripe success handler error:', error);
    const origin = request.nextUrl.origin;
    return NextResponse.redirect(`${origin}/checkout?error=payment_processing_failed`);
  }
}

