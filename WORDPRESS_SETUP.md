# WordPress.com Blog Setup Guide

## Free WordPress.com Setup

1. **Create a WordPress.com site** (free):
   - Go to [wordpress.com](https://wordpress.com)
   - Sign up for a free account
   - Create a new site (e.g., `blogsalescentri.wordpress.com`)

2. **Get your Site ID**:
   - Go to your WordPress.com dashboard
   - Navigate to Settings → General
   - Look for "Site ID" or check the URL when you're in the admin area
   - The site ID is usually visible in the admin URL or settings

3. **Add environment variables** to `.env.local`:
   ```bash
   WORDPRESS_SITE_ID=123456789
   WORDPRESS_SITE_URL=https://blogsalescentri.wordpress.com
   ```

## Features Available

✅ **Free WordPress.com REST API** - No plugins needed  
✅ **Blog listing with pagination** - `/blog`  
✅ **Individual blog posts** - `/blog/[slug]`  
✅ **Category filtering** - `/blog?category=tech`  
✅ **Search functionality** - `/blog?q=search-term`  
✅ **RSS feed** - `/blog/rss`  
✅ **Subdomain routing** - `blog.salescentri.com` → `/blog/*`  
✅ **ISR (Incremental Static Regeneration)** - 60s revalidation  
✅ **Featured images** - From WordPress media library  
✅ **Categories and authors** - Full metadata support

## DNS Setup for Subdomain

To enable `blog.salescentri.com`:

1. **Add subdomain in your DNS provider**:

   ```
   Type: CNAME
   Name: blog
   Value: cname.vercel-dns.com
   ```

2. **Add domain in Vercel** (if using Vercel):
   - Go to your project settings
   - Add `blog.salescentri.com` to domains
   - Vercel will handle the routing automatically

## WordPress.com API Endpoints Used

- `https://public-api.wordpress.com/wp/v2/sites/{SITE_ID}/posts` - Blog posts
- `https://public-api.wordpress.com/wp/v2/sites/{SITE_ID}/categories` - Categories
- `https://public-api.wordpress.com/wp/v2/sites/{SITE_ID}` - Site info

## Next Steps

1. Set the environment variables
2. Deploy your app
3. Create some test posts on your WordPress.com site
4. Visit `blog.salescentri.com` to see your blog!

The middleware will automatically route `blog.salescentri.com/*` to `/blog/*` in your Next.js app.
