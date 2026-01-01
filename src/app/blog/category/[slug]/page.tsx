import { redirect } from 'next/navigation';

type Params = { params: Promise<{ slug: string }> };

export default async function CategoryRedirect({ params }: Params) {
  const { slug } = await params;
  redirect(`/blog?category=${encodeURIComponent(slug)}`);
}


