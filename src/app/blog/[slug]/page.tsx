import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getWpAllPostSlugs, getWpAdjacentPostsByDate, getWpGeneralSettings, getWpPostBySlug } from '../../lib/wordpress';
import ReadingProgress from '../components/ReadingProgress';

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const slugs = await getWpAllPostSlugs(200, 3600);
    console.log('[BLOG] Generated slugs:', slugs);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error('[BLOG] Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = await getWpPostBySlug(slug, 60);
  if (!post) return {};
  const settings = await getWpGeneralSettings(3600);
  const baseUrl = (settings?.url || '').replace(/\/$/, '');
  const title = post.seo?.title || post.title;
  const description = post.seo?.metaDesc || post.excerpt || '';
  const ogImage = post.featuredImage?.node?.sourceUrl || undefined;
  return {
    title,
    description,
    alternates: { canonical: post.seo?.canonical || `${baseUrl}/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/blog/${post.slug}`,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
      type: 'article',
    },
  } as const;
}

function computeReadingMinutesFromHtml(html?: string | null): number {
  const text = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').filter(Boolean).length : 0;
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogPost({ params }: Params) {
  try {
    const { slug } = await params;
    console.log('[BLOG] Fetching post for slug:', slug);
    
    const post = await getWpPostBySlug(slug, 60);
    if (!post) {
      console.log('[BLOG] Post not found for slug:', slug);
      return notFound();
    }

    const adjacent = await getWpAdjacentPostsByDate(post.date, 300).catch(() => ({ previous: null, next: null }));
    const readingMinutes = computeReadingMinutesFromHtml(post.content);

    return (
      <article className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-300">
        <ReadingProgress />
        <header className="mx-auto max-w-3xl px-4 pt-20">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/50 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
          <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString()} • {readingMinutes} min read</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">{post.title}</span>
          </h1>
          {post.featuredImage?.node?.sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              className="mt-8 w-full rounded-xl border border-gray-800"
            />
          ) : null}
        </header>

        <section className="mx-auto max-w-3xl px-4 py-10">
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </section>

        <footer className="mx-auto max-w-3xl px-4 pb-16">
          <div className="flex items-center justify-between border-t border-gray-800 pt-6 text-sm">
            {adjacent.previous ? (
              <Link href={`/blog/${adjacent.previous.slug}`} className="text-gray-400 hover:text-gray-200">← {adjacent.previous.title}</Link>
            ) : <span />}
            {adjacent.next ? (
              <Link href={`/blog/${adjacent.next.slug}`} className="text-gray-400 hover:text-gray-200">{adjacent.next.title} →</Link>
            ) : <span />}
          </div>
        </footer>

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              datePublished: post.date,
              author: post.author?.node?.name ? { '@type': 'Person', name: post.author.node.name } : undefined,
              image: post.featuredImage?.node?.sourceUrl ? [post.featuredImage.node.sourceUrl] : undefined,
            }),
          }}
        />
      </article>
    );
  } catch (error) {
    console.error('[BLOG] Error in BlogPost component:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-300 p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Blog Post</h1>
          <pre className="text-sm text-red-200 bg-red-900/20 p-4 rounded">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
}