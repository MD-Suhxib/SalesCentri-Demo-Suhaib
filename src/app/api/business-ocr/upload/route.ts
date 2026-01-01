import { NextRequest, NextResponse } from "next/server";

// This route is kept for backward compatibility and proxies requests to the new /api/print-media-ocr/upload endpoint.
export async function POST(request: NextRequest) {
  try {
    const target = new URL(request.url);
    // Replace path to the new endpoint
    target.pathname = target.pathname.replace('/api/business-ocr/upload', '/api/print-media-ocr/upload');
    // Forward the request and return the response transparently
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
    console.error('[Business OCR Proxy] Error forwarding upload request:', err);
    return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
  }
}
