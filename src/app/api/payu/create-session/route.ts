import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

import { convertUsdToInr } from '../utils';

const PAYU_KEY = process.env.PAYU_KEY ?? '';
const PAYU_SALT = process.env.PAYU_SALT ?? '';
const PAYU_URL = process.env.PAYU_URL ?? 'https://test.payu.in/_payment';

function buildHash(params: {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
}) {
  const sequence = [
    params.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    PAYU_SALT,
  ].join('|');

  return crypto.createHash('sha512').update(sequence).digest('hex');
}

export async function POST(req: NextRequest) {
  if (!PAYU_KEY || !PAYU_SALT) {
    return NextResponse.json(
      { error: 'PayU credentials not configured' },
      { status: 500 },
    );
  }

  const { amount, firstname, email, phone, productinfo } = await req.json();

  if (!amount || !firstname || !email || !phone || !productinfo) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 },
    );
  }

  const txnid = uuid().replace(/-/g, '').slice(0, 20);
  const amountUsd = Number(amount);

  if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json(
      { error: 'Invalid amount provided' },
      { status: 400 },
    );
  }

  let conversion;
  try {
    conversion = await convertUsdToInr(amountUsd);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to convert currency';
    return NextResponse.json(
      { error: message || 'Failed to convert currency' },
      { status: 502 },
    );
  }

  const amountInrStr = conversion.inrAmount.toFixed(2);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;

  const params = {
    key: PAYU_KEY,
    txnid,
    amount: amountInrStr,
    productinfo,
    firstname,
    email,
    phone,
    surl: `${baseUrl}/api/payu/success`,
    furl: `${baseUrl}/api/payu/failure`,
  };

  return NextResponse.json({
    action: PAYU_URL,
    params: {
      ...params,
      hash: buildHash({
        key: params.key,
        txnid: params.txnid,
        amount: params.amount,
        productinfo: params.productinfo,
        firstname: params.firstname,
        email: params.email,
      }),
    },
    meta: {
      amountUsd: amountUsd.toFixed(2),
      amountInr: amountInrStr,
      usdToInrRate: conversion.rate,
      fxSource: conversion.source,
    },
  });
}

