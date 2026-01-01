import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

import { writePaymentRecord } from '@/app/lib/payment/paymentStore';

const PAYU_KEY = process.env.PAYU_KEY ?? '';
const PAYU_SALT = process.env.PAYU_SALT ?? '';

function formDataToObject(form: FormData) {
  return Array.from(form.entries()).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      acc[key] = String(value ?? '');
      return acc;
    },
    {},
  );
}

type HashVerification = {
  valid: boolean;
  sequence: string;
  expectedHash: string;
  receivedHash: string;
  hasAdditionalCharges: boolean;
};

function normalizeField(value: unknown): string {
  return String(value ?? '').trim();
}

function verifyHash(payload: Record<string, string>): HashVerification {
  const status = normalizeField(payload.status);
  const txnid = normalizeField(payload.txnid);
  const email = normalizeField(payload.email);
  const firstname = normalizeField(payload.firstname);
  const productinfo = normalizeField(payload.productinfo);
  const amount = normalizeField(payload.amount);
  const udf1 = normalizeField(payload.udf1);
  const udf2 = normalizeField(payload.udf2);
  const udf3 = normalizeField(payload.udf3);
  const udf4 = normalizeField(payload.udf4);
  const udf5 = normalizeField(payload.udf5);
  const hash = normalizeField(payload.hash).toLowerCase();
  const additionalCharges = normalizeField(payload.additionalCharges);

  const blanks = ['', '', '', '', ''];
  const hasAdditionalCharges = additionalCharges.length > 0;

  const sequenceParts = hasAdditionalCharges
    ? [
        additionalCharges,
        PAYU_SALT,
        status,
        ...blanks,
        udf5,
        udf4,
        udf3,
        udf2,
        udf1,
        email,
        firstname,
        productinfo,
        amount,
        txnid,
        PAYU_KEY,
      ]
    : [
        PAYU_SALT,
        status,
        ...blanks,
        udf5,
        udf4,
        udf3,
        udf2,
        udf1,
        email,
        firstname,
        productinfo,
        amount,
        txnid,
        PAYU_KEY,
      ];

  const sequence = sequenceParts.join('|');
  const expectedHash = crypto
    .createHash('sha512')
    .update(sequence)
    .digest('hex')
    .toLowerCase();

  const valid = hash.length > 0 && expectedHash === hash;

  return {
    valid,
    sequence,
    expectedHash,
    receivedHash: hash,
    hasAdditionalCharges,
  };
}

export async function handlePayURedirect(
  req: NextRequest,
  isSuccessRoute: boolean,
) {
  if (!PAYU_KEY || !PAYU_SALT) {
    return NextResponse.json(
      { error: 'PayU credentials not configured' },
      { status: 500 },
    );
  }

  const form = await req.formData();
  const payload = formDataToObject(form);
  const verification = verifyHash(payload);
  const status = normalizeField(payload.status).toLowerCase();
  const txnid = normalizeField(payload.txnid);
  let firestoreDocId: string | undefined;

  console.info('[handlePayURedirect] PayU hash verification', {
    txnid,
    status,
    valid: verification.valid,
    hasAdditionalCharges: verification.hasAdditionalCharges,
    route: isSuccessRoute ? 'success' : 'failure',
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;

  const redirectToSuccess = verification.valid && status === 'success';
  const targetPath = redirectToSuccess ? '/payment/success' : '/payment/failed';

  if (redirectToSuccess && txnid) {
    try {
      const amount = normalizeField(payload.amount);
      const orderId = normalizeField(payload.udf4);
      const segment = normalizeField(payload.udf1);
      const billingCycle = normalizeField(payload.udf2);
      const planName = normalizeField(payload.udf3) || normalizeField(payload.productinfo);

      const metadata = {
        productinfo: normalizeField(payload.productinfo),
        firstname: normalizeField(payload.firstname),
        phone: normalizeField(payload.phone),
        mihpayid: normalizeField(payload.mihpayid),
        mode: normalizeField(payload.mode),
        bankcode: normalizeField(payload.bankcode),
        pgType:
          normalizeField((payload as Record<string, unknown>).PG_TYPE) ||
          normalizeField((payload as Record<string, unknown>).pg_type),
        additionalCharges: normalizeField(payload.additionalCharges),
        netAmountDebit: normalizeField(payload.net_amount_debit),
        udf1: segment,
        udf2: billingCycle,
        udf3: planName,
        udf4: orderId,
        udf5: normalizeField(payload.udf5),
        field1: normalizeField(payload.field1),
        field2: normalizeField(payload.field2),
        field3: normalizeField(payload.field3),
        field4: normalizeField(payload.field4),
        field5: normalizeField(payload.field5),
        field6: normalizeField(payload.field6),
        field7: normalizeField(payload.field7),
        field8: normalizeField(payload.field8),
        field9: normalizeField(payload.field9),
        error: normalizeField(payload.error),
      };

      const result = await writePaymentRecord(
        {
          gateway: 'payu',
          orderId: orderId || null,
          sessionId: null,
          transactionId: normalizeField(payload.mihpayid) || null,
          txnid,
          amount: amount || null,
          currency: normalizeField(payload.currency) || 'INR',
          segment: segment || null,
          billingCycle: billingCycle || null,
          planName: planName || null,
          status,
          userEmail: normalizeField(payload.email) || null,
          source: isSuccessRoute ? 'payu_success_redirect' : 'payu_failure_redirect',
          metadata,
          rawPayload: payload,
        },
        {
          docId: txnid,
          merge: false,
        },
      );

      firestoreDocId = result.id;
      console.info('[handlePayURedirect] PayU payment persisted', {
        txnid,
        docId: firestoreDocId,
      });
    } catch (error) {
      console.error('[handlePayURedirect] Failed to persist PayU payment', {
        txnid,
        error,
      });
    }
  }

  const redirectUrl = new URL(targetPath, baseUrl);
  if (txnid) redirectUrl.searchParams.set('txnid', txnid);
  if (status) redirectUrl.searchParams.set('status', status);
  redirectUrl.searchParams.set('verified', redirectToSuccess ? 'true' : 'false');
  if (firestoreDocId) {
    redirectUrl.searchParams.set('payment_doc_id', firestoreDocId);
  }

  return NextResponse.redirect(redirectUrl.toString(), { status: 302 });
}

export async function POST(req: NextRequest) {
  return handlePayURedirect(req, true);
}

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
  return NextResponse.redirect(`${baseUrl}/payment/success`);
}

