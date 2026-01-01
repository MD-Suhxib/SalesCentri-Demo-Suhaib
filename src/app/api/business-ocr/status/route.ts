import { NextRequest, NextResponse } from "next/server";

// Proxy the status endpoint to the new /api/print-media-ocr/status for backward compatibility.
export async function GET(request: NextRequest) {
  try {
    const target = new URL(request.url);
    target.pathname = target.pathname.replace('/api/business-ocr/status', '/api/print-media-ocr/status');
    const forwarded = await fetch(new Request(target.toString(), request));
    const body = await forwarded.arrayBuffer();
    const forwardedHeaders = Object.fromEntries(forwarded.headers.entries());
    forwardedHeaders['x-deprecated-endpoint'] = 'business-ocr';
    const res = new NextResponse(Buffer.from(body), {
      status: forwarded.status,
      headers: forwardedHeaders,
    });
    return res;
  } catch (err) {
    console.error('[Business OCR Proxy] Error forwarding status request:', err);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}
