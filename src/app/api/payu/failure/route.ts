import { NextRequest, NextResponse } from 'next/server';

import { handlePayURedirect } from '../success/route';

export async function POST(req: NextRequest) {
  return handlePayURedirect(req, false);
}

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin;
  return NextResponse.redirect(`${baseUrl}/payment/failed`);
}

