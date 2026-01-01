import { NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret') || '';
  const expected = process.env.NEXT_PREVIEW_SECRET || '';
  if (expected && secret !== expected) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }
  const d = await draftMode();
  d.enable();
  const slug = url.searchParams.get('slug') || '';
  const redirectTo = slug ? `/blog/${slug}` : '/blog';
  return NextResponse.redirect(new URL(redirectTo, url.origin));
}


