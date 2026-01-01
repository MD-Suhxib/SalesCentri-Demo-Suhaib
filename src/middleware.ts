import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  if (host.startsWith('blog.')) {
    const url = request.nextUrl.clone();
    // Prevent double-prefixing if already on /blog
    if (!url.pathname.startsWith('/blog')) {
      url.pathname = `/blog${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|.*\.(?:ico|png|jpg|jpeg|webp|gif|svg|txt|xml|json)).*)',
  ],
};


