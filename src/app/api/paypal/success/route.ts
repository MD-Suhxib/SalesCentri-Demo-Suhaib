import { NextRequest, NextResponse } from 'next/server';
import { writePaymentRecord } from '@/app/lib/payment/paymentStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle PayPal webhook or additional payment processing
    console.log('PayPal success POST received:', body);
    
    return NextResponse.json({ success: true, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('PayPal success POST error:', error);
    return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
  }
}

// Debug endpoint to check stored payments
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('debug') === 'payments') {
    return NextResponse.json({ 
      message: 'Payments are now stored in Firestore. Use Firestore console or emulator to inspect records.',
    });
  }
  
  // Regular success flow - call the main GET function
  return await handleSuccessRedirect(request);
}

async function handleSuccessRedirect(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const { searchParams } = requestUrl;
    
    // Get the origin from the request (works in all environments)
    const origin = `${requestUrl.protocol}//${requestUrl.host}`;
    
    // Extract PayPal parameters (always present after PayPal redirect)
    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');
    const userEmail = searchParams.get('email'); // Optional, from our query params

    // Validate required PayPal parameters
    if (!token || !payerId) {
      console.error('Missing required PayPal parameters:', { token, payerId });
      return NextResponse.redirect(`${origin}/?error=missing_paypal_parameters`);
    }

    // Fetch order details from PayPal API to get custom_id (contains our metadata)
    let orderDetails: any = null;
    let metadata: { segment?: string; billingCycle?: string; planName?: string; amount?: number } | null = null;
    
    try {
      const orderRes = await fetch(`${origin}/api/paypal/get-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: token }),
      });

      if (orderRes.ok) {
        orderDetails = await orderRes.json();
        metadata = orderDetails.metadata || null;
        console.log('Order details fetched from PayPal:', orderDetails);
      } else {
        console.warn('Failed to fetch order details, will use fallback');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      // Continue with fallback
    }

    // Extract metadata from custom_id if available
    let segment = metadata?.segment;
    let billingCycle = metadata?.billingCycle;
    let planName = metadata?.planName;
    let amount = metadata?.amount;

    // Fallback: try to get from query params (may not be present if PayPal stripped them)
    if (!segment) segment = searchParams.get('segment') || 'Unknown';
    if (!billingCycle) billingCycle = searchParams.get('billingCycle') || 'Unknown';
    if (!planName) planName = searchParams.get('planName') || 'Unknown';
    if (!amount) amount = parseFloat(searchParams.get('amount') || '0');

    // Capture the order (since we're using CAPTURE intent)
    let captureResult: any = null;
    try {
      const captureRes = await fetch(`${origin}/api/paypal/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: token }),
      });

      if (captureRes.ok) {
        captureResult = await captureRes.json();
        console.log('Order captured successfully:', captureResult);
      } else {
        const errorData = await captureRes.json();
        console.error('Failed to capture order:', errorData);
        // Don't fail completely - payment might have already been captured
      }
    } catch (error) {
      console.error('Error capturing order:', error);
      // Continue - PayPal may have already completed the payment
    }

    // Use captured amount if available (more accurate)
    if (captureResult?.details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value) {
      amount = parseFloat(captureResult.details.purchase_units[0].payments.captures[0].amount.value);
    }

    const currency =
      captureResult?.details?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code ||
      orderDetails?.purchase_units?.[0]?.amount?.currency_code ||
      'USD';
    const captureId =
      captureResult?.details?.purchase_units?.[0]?.payments?.captures?.[0]?.id || null;

    let firestoreDocId: string | undefined;
    try {
      const writeResult = await writePaymentRecord(
        {
          gateway: 'paypal',
          orderId: orderDetails?.id ?? token ?? null,
          sessionId: null,
          transactionId: captureId,
          amount: amount ?? null,
          currency,
          segment: segment || null,
          billingCycle: billingCycle || null,
          planName: planName || null,
          status: captureResult?.status === 'COMPLETED' ? 'completed' : 'pending',
          userEmail: userEmail || null,
          source: 'paypal_success_redirect',
          metadata: {
            token,
            payerId,
            captureStatus: captureResult?.status ?? null,
            orderMetadata: metadata ?? null,
            captureDetails: captureResult?.details ?? null,
          },
          rawPayload: {
            orderDetails: orderDetails ?? null,
            captureResult: captureResult ?? null,
            queryParams: Object.fromEntries(searchParams.entries()),
          },
        },
        {
          docId: (orderDetails?.id as string | undefined) ?? token ?? undefined,
        }
      );
      firestoreDocId = writeResult.id;
      console.info('PayPal payment persisted to Firestore:', writeResult);
    } catch (error) {
      console.error('Failed to persist PayPal payment to Firestore:', error);
      // Continue with redirect even if storage fails
    }

    // Create success URL - redirect to booking page with payment info
    const successUrl = new URL('/get-started/book-demo', origin);
    successUrl.searchParams.set('payment_success', 'true');
    if (typeof amount === 'number' && Number.isFinite(amount)) {
      successUrl.searchParams.set('amount', amount.toString());
    }
    if (currency) {
      successUrl.searchParams.set('currency', currency);
    }
    if (planName) {
      successUrl.searchParams.set('plan', planName);
    }
    const paymentIdentifier = firestoreDocId ?? captureId ?? token ?? '';
    if (paymentIdentifier) {
      successUrl.searchParams.set('payment_id', paymentIdentifier);
      successUrl.searchParams.set('payment_doc_id', paymentIdentifier);
    }

    console.log('Redirecting to booking page with payment success:', successUrl.toString());
    return NextResponse.redirect(successUrl.toString());

  } catch (error) {
    console.error('PayPal success handler error:', error);
    // Use request origin for error redirect as well
    const origin = request.url ? new URL(request.url).origin : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
    return NextResponse.redirect(`${origin}/?error=payment_processing_failed`);
  }
}
