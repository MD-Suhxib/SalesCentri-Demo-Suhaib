import { NextRequest, NextResponse } from 'next/server';

// Simple test route to verify Stripe API routes are working
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Stripe API routes are working',
    timestamp: new Date().toISOString(),
    path: '/api/stripe/test'
  });
}

