import { NextRequest, NextResponse } from 'next/server';

import { convertUsdToInr } from '../utils';

export async function GET(req: NextRequest) {
  const amountParam = req.nextUrl.searchParams.get('amount');
  const amountUsd = amountParam ? Number(amountParam) : NaN;

  if (!amountParam || !Number.isFinite(amountUsd) || amountUsd <= 0) {
    return NextResponse.json(
      { error: 'Invalid amount supplied' },
      { status: 400 },
    );
  }

  try {
    const { rate, inrAmount, source } = await convertUsdToInr(amountUsd);
    const resolvedAmount = Number(inrAmount.toFixed(2));
    console.info('[convertUsdToInrRoute] Conversion successful', {
      amountUsd,
      rate,
      amountInr: resolvedAmount,
      source,
    });
    return NextResponse.json({
      amountInr: resolvedAmount,
      rate,
      source,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to convert currency';
    console.error('[convertUsdToInrRoute] Conversion failed', {
      amountUsd,
      error: message,
    });
    return NextResponse.json(
      { error: message || 'Failed to convert currency' },
      { status: 502 },
    );
  }
}

