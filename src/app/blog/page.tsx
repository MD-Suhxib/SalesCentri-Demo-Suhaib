import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { PAGE_SIZE } from '../lib/blogConfig';
import { getWpPosts } from '../lib/wordpress';
import SearchBar from './components/SearchBar';

export const revalidate = 60;

type SearchParams = Promise<{
  page?: string;
  category?: string;
  q?: string;
}>;

type PostListItem = {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  featuredImageUrl?: string | null;
  categories?: string[];
  author?: string | null;
};



export default async function BlogIndex({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? '1'));
  const category = params?.category || undefined;
  const q = params?.q || undefined;

  // Redirect away from uncategorized filter
  if (category === 'uncategorized') {
    redirect('/blog');
  }

  const { posts, categories, totalPages } = await getWpPosts({ 
    page, 
    per_page: PAGE_SIZE, 
    categorySlug: category || null, 
    search: q || null 
  }, 60);

  const postsList: PostListItem[] = posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    publishedAt: p.date,
    excerpt: p.excerpt,
    featuredImageUrl: p.featuredImageUrl || null,
    categories: p.categories || [],
    author: p.authorName || null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-gray-300">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Sales Centri Blog
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent">Insights</span> & Updates
        </h1>
        <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
          Discover the latest trends in B2B sales, AI-powered strategies, and expert insights to accelerate your growth.
        </p>

        {/* Search Bar */}
        <Suspense fallback={<div className="h-12 mt-6" />}>
          <SearchBar />
        </Suspense>

        {/* Category Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link 
            href="/blog" 
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${!category ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-300'}`}
          >
            All Posts
          </Link>
          {categories?.filter((c: { slug: string; title: string; postCount: number }) => c.slug !== 'uncategorized').map((c: { slug: string; title: string; postCount: number }) => (
            <Link 
              key={c.slug} 
              href={{ pathname: '/blog', query: { ...params, category: c.slug, page: 1 } }} 
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${c.slug === category ? 'border-blue-500 bg-blue-500/20 text-blue-300' : 'border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-300'}`}
            >
              {c.title} ({c.postCount})
            </Link>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 pb-16">
        {postsList?.map((post, index) => (
          <article 
            key={post.slug} 
            className={`group overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-900/50 to-black/50 shadow-xl backdrop-blur transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10 hover:shadow-2xl hover:-translate-y-1 ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
          >
            {post.featuredImageUrl ? (
              <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.featuredImageUrl}
                  alt={post.title}
                  className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${index === 0 ? 'h-72' : 'h-48'}`}
                  loading="lazy"
                />
              </Link>
            ) : (
              <div className={`w-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center ${index === 0 ? 'h-72' : 'h-48'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            )}
            <div className="p-6">
              <div className="flex flex-wrap gap-2 text-xs">
                {post.categories?.filter(cat => cat !== 'Uncategorized').map((cat: string) => (
                  <span key={cat} className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-blue-400">{cat}</span>
                ))}
              </div>
              <h2 className={`mt-3 font-bold text-gray-100 group-hover:text-blue-400 transition-colors duration-200 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.excerpt ? (
                <p className="mt-3 text-sm text-gray-400 line-clamp-2">{post.excerpt}</p>
              ) : null}
              <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Read more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Pagination */}
      <nav className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 pb-20">
        <Link
          aria-disabled={page <= 1}
          className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${page <= 1 ? 'pointer-events-none opacity-40 border-gray-800' : 'border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400'}`}
          href={{ pathname: '/blog', query: { ...params, page: Math.max(1, page - 1) } }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Link>
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Link
                key={pageNum}
                href={{ pathname: '/blog', query: { ...params, page: pageNum } }}
                className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 ${page === pageNum ? 'bg-blue-600 text-white' : 'border border-gray-700 hover:border-blue-500 hover:text-blue-400'}`}
              >
                {pageNum}
              </Link>
            );
          })}
          {totalPages > 5 && <span className="text-gray-500">...</span>}
        </div>
        <Link
          aria-disabled={page >= totalPages}
          className={`inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${page >= totalPages ? 'pointer-events-none opacity-40 border-gray-800' : 'border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-400'}`}
          href={{ pathname: '/blog', query: { ...params, page: Math.min(totalPages, page + 1) } }}
        >
          Next
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </nav>
    </div>
  );
}


