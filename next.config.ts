import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Add your WordPress media domain if needed, e.g. 'your-wp-domain.com' or CDN
    ],
  },
  async redirects() {
    return [
      // Send all demo booking routes directly to Microsoft Bookings
      { source: '/book-demo', destination: process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled', permanent: false },
      { source: '/get-started/book-demo', destination: process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled', permanent: false },
      { source: '/get-started/book-demo/:path*', destination: process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled', permanent: false },
      // Temporary redirects (307) for legacy/missing routes
      { source: '/blog-2', destination: '/resources', permanent: false },
      { source: '/components/ROICalculator', destination: '/roi-calculator', permanent: false },
      { source: '/contact-2', destination: '/contact', permanent: false },
      { source: '/contact-us', destination: '/contact', permanent: false },

      // Docs user-guide legacy paths → Support Resources until docs pages are live
      { source: '/docs/user-guide/ai-configuration', destination: '/get-started/free-trial/support-resources', permanent: false },
      { source: '/docs/user-guide/campaign-monitoring', destination: '/get-started/free-trial/support-resources', permanent: false },
      { source: '/docs/user-guide/campaign-setup', destination: '/get-started/free-trial/support-resources', permanent: false },
      { source: '/docs/user-guide/contact-import', destination: '/get-started/free-trial/support-resources', permanent: false },
      { source: '/docs/user-guide/getting-started', destination: '/get-started/free-trial/support-resources', permanent: false },

      { source: '/hello-world', destination: '/', permanent: false },
      { source: '/login-portal/customer-portal', destination: '/login-portal', permanent: false },
      { source: '/login-portal/partner-portal', destination: '/login-portal', permanent: false },
      { source: '/post-2', destination: '/', permanent: false },
      { source: '/post-3', destination: '/', permanent: false },
      { source: '/post-3-2', destination: '/', permanent: false },
      { source: '/services', destination: '/services/ai-digital-marketing', permanent: false },
      { source: '/solutions/salesgpt', destination: '/solutions/psa-suite-one-stop-solution', permanent: false },
      { source: '/trust', destination: '/solutions/psa-suite-one-stop-solution', permanent: true },
      { source: '/trust/compliance-certifications', destination: '/solutions/psa-suite-one-stop-solution', permanent: true },
    ];
  },
};

export default nextConfig;