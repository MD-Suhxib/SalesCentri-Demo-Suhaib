import 'server-only';

const WORDPRESS_SITE_ID = process.env.WORDPRESS_SITE_ID as string | undefined;
const WORDPRESS_SITE_URL = process.env.WORDPRESS_SITE_URL as string | undefined;

if (!process.env.NEXT_RUNTIME && !WORDPRESS_SITE_ID) {
  console.warn('[WP] Missing WORDPRESS_SITE_ID env. Set to your WordPress.com site ID (e.g., 123456789)');
}

if (!process.env.NEXT_RUNTIME && !WORDPRESS_SITE_URL) {
  console.warn('[WP] Missing WORDPRESS_SITE_URL env. Set to your WordPress.com site URL (e.g., https://yoursite.wordpress.com)');
}

const WP_API_BASE = `https://public-api.wordpress.com/wp/v2/sites/${WORDPRESS_SITE_ID}`;

// WordPress API response types
type WpPost = {
  id: number;
  title: { rendered: string };
  slug: string;
  date: string;
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string }>>;
    author?: Array<{ name: string }>;
  };
};

type WpCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
};

type WpSite = {
  name: string;
  URL: string;
};

export type WpPostListItem = {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  featuredImageUrl?: string | null;
  categories?: string[];
  authorName?: string | null;
};

export async function getWpPosts({ 
  page = 1, 
  per_page = 9, 
  categorySlug, 
  search 
}: { 
  page?: number; 
  per_page?: number; 
  categorySlug?: string | null; 
  search?: string | null; 
}, revalidateSeconds = 60) {
  if (!WORDPRESS_SITE_ID) throw new Error('WORDPRESS_SITE_ID is not set');

  const params = new URLSearchParams({
    page: page.toString(),
    per_page: per_page.toString(),
    _embed: '1',
  });

  if (categorySlug) {
    // First get category ID by slug
    const categoryRes = await fetch(`${WP_API_BASE}/categories?slug=${categorySlug}`, {
      next: { revalidate: revalidateSeconds, tags: ['blog'] },
    });
    const categories: WpCategory[] = await categoryRes.json();
    if (categories.length > 0) {
      params.append('categories', categories[0].id.toString());
    }
  }

  if (search) {
    params.append('search', search);
  }

  const res = await fetch(`${WP_API_BASE}/posts?${params}`, {
    next: { revalidate: revalidateSeconds, tags: ['blog'] },
  });

  if (!res.ok) {
    throw new Error(`[WP] HTTP ${res.status}: ${await res.text()}`);
  }

  const posts: WpPost[] = await res.json();
  const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0');
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1');

  const postsList: WpPostListItem[] = posts.map((post: WpPost) => ({
    title: decodeHtmlEntities(post.title.rendered),
    slug: post.slug,
    date: post.date,
    excerpt: stripHtml(post.excerpt.rendered),
    featuredImageUrl: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
    categories: post._embedded?.['wp:term']?.[0]?.map((cat) => decodeHtmlEntities(cat.name)) || [],
    authorName: post._embedded?.author?.[0]?.name || null,
  }));

  // Get categories for sidebar
  const categoriesRes = await fetch(`${WP_API_BASE}/categories?per_page=50`, {
    next: { revalidate: revalidateSeconds, tags: ['blog'] },
  });
  const categories: WpCategory[] = await categoriesRes.json();

  const categoryIndex = categories.map((cat: WpCategory) => ({
    title: decodeHtmlEntities(cat.name),
    slug: cat.slug,
    description: decodeHtmlEntities(cat.description),
    postCount: cat.count,
  }));

  return {
    posts: postsList,
    pageInfo: {
      hasNextPage: page < totalPages,
      endCursor: page.toString(),
    },
    categories: categoryIndex,
    totalPosts,
    totalPages,
  } as const;
}

export async function getWpAllPostSlugs(limit = 100, revalidateSeconds = 3600) {
  if (!WORDPRESS_SITE_ID) throw new Error('WORDPRESS_SITE_ID is not set');

  // WordPress.com REST API has a max of 100 posts per request
  const perPage = Math.min(limit, 100);
  
  const res = await fetch(`${WP_API_BASE}/posts?per_page=${perPage}`, {
    next: { revalidate: revalidateSeconds, tags: ['blog'] },
  });

  if (!res.ok) {
    throw new Error(`[WP] HTTP ${res.status}: ${await res.text()}`);
  }

  const posts: WpPost[] = await res.json();
  return posts.map((post: WpPost) => post.slug).filter(Boolean);
}

export async function getWpPostBySlug(slug: string, revalidateSeconds = 60) {
  if (!WORDPRESS_SITE_ID) throw new Error('WORDPRESS_SITE_ID is not set');

  const res = await fetch(`${WP_API_BASE}/posts?slug=${slug}&_embed=1`, {
    next: { revalidate: revalidateSeconds, tags: ['blog'] },
  });

  if (!res.ok) {
    throw new Error(`[WP] HTTP ${res.status}: ${await res.text()}`);
  }

  const posts: WpPost[] = await res.json();
  if (!posts.length) return null;

  const post = posts[0];
  return {
    title: decodeHtmlEntities(post.title.rendered),
    slug: post.slug,
    date: post.date,
    excerpt: stripHtml(post.excerpt.rendered),
    content: post.content.rendered,
    featuredImage: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? {
      node: { sourceUrl: post._embedded['wp:featuredmedia'][0].source_url }
    } : null,
    seo: {
      title: decodeHtmlEntities(post.title.rendered),
      metaDesc: stripHtml(post.excerpt.rendered),
      canonical: `${WORDPRESS_SITE_URL}/blog/${post.slug}`,
    },
    categories: post._embedded?.['wp:term']?.[0]?.map((cat) => ({
      name: decodeHtmlEntities(cat.name),
      slug: cat.slug,
    })) || [],
    author: post._embedded?.author?.[0] ? {
      node: { name: post._embedded.author[0].name }
    } : null,
  };
}

export async function getWpAdjacentPostsByDate(dateIso: string, revalidateSeconds = 300) {
  if (!WORDPRESS_SITE_ID) throw new Error('WORDPRESS_SITE_ID is not set');

  const date = new Date(dateIso);
  const beforeDate = new Date(date.getTime() - 24 * 60 * 60 * 1000); // 1 day before
  const afterDate = new Date(date.getTime() + 24 * 60 * 60 * 1000); // 1 day after

  const [prevRes, nextRes] = await Promise.all([
    fetch(`${WP_API_BASE}/posts?before=${beforeDate.toISOString()}&per_page=1&orderby=date&order=desc`, {
      next: { revalidate: revalidateSeconds, tags: ['blog'] },
    }),
    fetch(`${WP_API_BASE}/posts?after=${afterDate.toISOString()}&per_page=1&orderby=date&order=asc`, {
      next: { revalidate: revalidateSeconds, tags: ['blog'] },
    }),
  ]);

  const [prevPosts, nextPosts] = await Promise.all([
    prevRes.ok ? prevRes.json() : [],
    nextRes.ok ? nextRes.json() : [],
  ]);

  return {
    previous: prevPosts[0] ? { title: decodeHtmlEntities(prevPosts[0].title.rendered), slug: prevPosts[0].slug } : null,
    next: nextPosts[0] ? { title: decodeHtmlEntities(nextPosts[0].title.rendered), slug: nextPosts[0].slug } : null,
  } as const;
}

export async function getWpGeneralSettings(revalidateSeconds = 3600) {
  if (!WORDPRESS_SITE_ID) throw new Error('WORDPRESS_SITE_ID is not set');

  const res = await fetch(`${WP_API_BASE}`, {
    next: { revalidate: revalidateSeconds, tags: ['blog'] },
  });

  if (!res.ok) {
    throw new Error(`[WP] HTTP ${res.status}: ${await res.text()}`);
  }

  const site: WpSite = await res.json();
  return {
    title: site.name,
    url: site.URL,
  };
}

export async function getWpRecentPostsForRss(revalidateSeconds = 600) {
  if (!WORDPRESS_SITE_ID) throw new Error('WORDPRESS_SITE_ID is not set');

  const [postsRes, siteRes] = await Promise.all([
    fetch(`${WP_API_BASE}/posts?per_page=20&orderby=date&order=desc`, {
      next: { revalidate: revalidateSeconds, tags: ['blog'] },
    }),
    getWpGeneralSettings(revalidateSeconds),
  ]);

  if (!postsRes.ok) {
    throw new Error(`[WP] HTTP ${postsRes.status}: ${await postsRes.text()}`);
  }

  const posts: WpPost[] = await postsRes.json();
  return {
    posts: {
      nodes: posts.map((post: WpPost) => ({
        title: decodeHtmlEntities(post.title.rendered),
        slug: post.slug,
        date: post.date,
        excerpt: stripHtml(post.excerpt.rendered),
      })),
    },
    generalSettings: siteRes,
  };
}

function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '–',
    '&#8212;': '—',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…',
    '&nbsp;': ' ',
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char);
  }
  
  // Handle numeric entities like &#123;
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  // Handle hex entities like &#x1F600;
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  
  return decoded;
}

function stripHtml(html: string) {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, '').trim());
}


