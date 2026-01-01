import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  try {
    const secret = process.env.NEXT_PREVIEW_SECRET;
    const url = new URL(request.url);
    const querySecret = url.searchParams.get('secret');
    if (secret && querySecret && secret !== querySecret) {
      return NextResponse.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const slug = body?.slug?.current || body?.slug || body?.document?.slug?.current || body?.path?.slug || body?.ids?.[0]?.split(':').pop();

    revalidatePath('/blog');
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    revalidateTag('blog');

    return NextResponse.json({ revalidated: true, slug: slug || null });
  } catch (err) {
    return NextResponse.json({ revalidated: false, error: (err as Error).message }, { status: 500 });
  }
}


