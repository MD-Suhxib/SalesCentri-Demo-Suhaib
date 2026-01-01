import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace | Sales Centri - Connect, Collaborate & Grow Your Business',
  description: 'Join the Sales Centri Marketplace to connect with verified startups, buyers, and suppliers. Accelerate business growth through AI-powered matching, global reach, and streamlined collaboration. Register now to access opportunities across 40+ industries.',
  keywords: 'business marketplace, B2B marketplace, startup network, supplier directory, buyer network, business connections, verified businesses, business collaboration, startup marketplace, supplier marketplace, buyer marketplace, business network, Sales Centri marketplace',
  openGraph: {
    title: 'Marketplace | Sales Centri - Connect, Collaborate & Grow Your Business',
    description: 'Join the Sales Centri Marketplace to connect with verified startups, buyers, and suppliers. Accelerate business growth through AI-powered matching and global reach.',
    type: 'website',
    url: 'https://salescentri.com/market-place',
    images: [
      {
        url: 'https://cdn.salescentri.com/marketplace-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sales Centri Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Marketplace | Sales Centri - Connect, Collaborate & Grow Your Business',
    description: 'Join the Sales Centri Marketplace to connect with verified businesses and accelerate growth.',
  },
  alternates: {
    canonical: 'https://salescentri.com/market-place',
  },
  // Geo targeting and localization
  other: {
    'geo.region': 'US,IN,GB,CA,AU',
    'geo.placename': 'Global',
    'geo.position': 'global',
    'ICBM': 'global',
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Sales Centri Marketplace',
            description: 'Connect with verified startups, buyers, and suppliers to accelerate business growth',
            url: 'https://salescentri.com/market-place',
            mainEntity: {
              '@type': 'Service',
              name: 'Sales Centri Marketplace',
              description: 'A B2B marketplace connecting startups, buyers, and suppliers',
              provider: {
                '@type': 'Organization',
                name: 'Sales Centri',
                url: 'https://salescentri.com',
              },
              areaServed: {
                '@type': 'Place',
                name: 'Global',
              },
              serviceType: 'Business Marketplace',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://salescentri.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Resources',
                  item: 'https://salescentri.com/resources',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Marketplace',
                  item: 'https://salescentri.com/market-place',
                },
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
