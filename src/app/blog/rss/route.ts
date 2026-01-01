import { NextResponse } from 'next/server';
import { getWpRecentPostsForRss } from '../../lib/wordpress';

export async function GET() {
  const data = await getWpRecentPostsForRss(600);
  const siteUrl = (data.generalSettings?.url || '').replace(/\/$/, '');

  const items = (data.posts?.nodes || [])
    .map((p: { title: string; slug: string; date: string; excerpt?: string }) => `
      <item>
        <title>${escapeXml(p.title)}</title>
        <link>${siteUrl}/blog/${p.slug}</link>
        <guid>${siteUrl}/blog/${p.slug}</guid>
        <pubDate>${new Date(p.date).toUTCString()}</pubDate>
        <description>${escapeXml(p.excerpt || '')}</description>
      </item>
    `)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>${escapeXml(data.generalSettings?.title || 'Blog')}</title>
      <link>${siteUrl}/blog</link>
      <description>${escapeXml(data.generalSettings?.title || 'Blog')}</description>
      ${items}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=600, stale-while-revalidate',
    },
  });
}

function escapeXml(str: string) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}


