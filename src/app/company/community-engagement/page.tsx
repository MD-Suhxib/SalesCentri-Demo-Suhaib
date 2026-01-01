import type { Metadata } from "next";
import CommunityEngagementContent from "./CommunityEngagementContent";

export const metadata: Metadata = {
  title: "Community Engagement | Empowering Sales Teams Worldwide | Sales Centri",
  description:
    "Join SalesCentri's community engagement initiatives. Free sales training, startup support, webinars, and resources for sales professionals worldwide. Empowering women, differently abled people, and neurodivergent professionals through our Neurodivergent Talent Empowerment Program with employment opportunities and comprehensive training.",
  keywords: [
    "sales community engagement",
    "sales training programs",
    "sales professional development",
    "sales education",
    "sales community resources",
    "sales webinars",
    "sales workshops",
    "startup sales support",
    "sales automation community",
    "B2B sales community",
    "sales networking",
    "sales professional resources",
    "sales team empowerment",
    "global sales community",
    "sales mentorship",
    "sales best practices",
    "sales innovation",
    "sales collaboration",
    "CSR initiatives",
    "corporate social responsibility",
    "empowering women",
    "diversity and inclusion",
    "differently abled employment",
    "neurodivergent talent empowerment program",
    "neurodivergent employment",
    "inclusive hiring",
    "community empowerment",
    "rural employment",
    "rural areas connection",
    "digital divide",
    "rural training programs",
    "intern on-job training program",
    "community service internships",
    "student internships",
    "on-the-job training",
    "student skill development",
    "youth empowerment",
    "internship opportunities",
    "community service training",
    "student professional development",
    "internship program",
    "hands-on training",
    "student mentorship",
    "career development internships",
    "community impact internships",
  ],
  authors: [{ name: "Sales Centri" }],
  creator: "Sales Centri",
  publisher: "Sales Centri",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://salescentri.com"),
  alternates: {
    canonical: "/company/community-engagement",
    languages: {
      "en-US": "/company/community-engagement",
      "en": "/company/community-engagement",
    },
  },
  openGraph: {
    title: "Community Engagement | Empowering Sales Teams Worldwide | Sales Centri",
    description:
      "Join SalesCentri's community engagement initiatives. Free sales training, startup support, webinars, and resources for sales professionals worldwide. Empowering women, differently abled people, and neurodivergent professionals through our Neurodivergent Talent Empowerment Program with employment opportunities and comprehensive training.",
    url: "https://salescentri.com/company/community-engagement",
    siteName: "Sales Centri",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "SalesCentri Community Engagement - Empowering Sales Teams Worldwide",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Engagement | Empowering Sales Teams Worldwide | Sales Centri",
    description:
      "Join SalesCentri's community engagement initiatives. Free sales training, startup support, webinars, and resources for sales professionals worldwide. Empowering women, differently abled people, and neurodivergent professionals through our Neurodivergent Talent Empowerment Program with employment opportunities and comprehensive training.",
    images: ["https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop"],
    creator: "@salescentri",
    site: "@salescentri",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  category: "Business",
  classification: "Sales Community, Business Resources, Professional Development",
  other: {
    "geo.region": "US",
    "geo.placename": "United States",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "DC.title": "Sales Centri Community Engagement",
    "DC.creator": "Sales Centri",
    "DC.subject": "Sales Community, Business Resources, Professional Development",
    "DC.description":
      "Join SalesCentri's community engagement initiatives. Free sales training, startup support, webinars, and resources for sales professionals worldwide.",
    "DC.publisher": "Sales Centri",
    "DC.contributor": "Sales Centri",
    "DC.date": new Date().toISOString(),
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": "https://salescentri.com/company/community-engagement",
    "DC.source": "https://salescentri.com",
    "DC.language": "en-US",
    "DC.relation": "https://salescentri.com/company",
    "DC.coverage": "Global",
    "DC.rights": "Copyright Sales Centri",
  },
};

export default function CommunityEngagementPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://salescentri.com/company/community-engagement",
        url: "https://salescentri.com/company/community-engagement",
        name: "Community Engagement | Sales Centri",
        description:
          "Join SalesCentri's community engagement initiatives. Free sales training, startup support, webinars, and resources for sales professionals worldwide.",
        inLanguage: "en-US",
        isPartOf: {
          "@id": "https://salescentri.com/#website",
        },
        about: {
          "@id": "https://salescentri.com/#organization",
        },
        primaryImageOfPage: {
          "@id": "https://salescentri.com/company/community-engagement#primaryimage",
        },
        breadcrumb: {
          "@id": "https://salescentri.com/company/community-engagement#breadcrumb",
        },
      },
      {
        "@type": "ImageObject",
        "@id": "https://salescentri.com/company/community-engagement#primaryimage",
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        caption: "SalesCentri Community Engagement - Empowering Sales Teams Worldwide",
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://salescentri.com/company/community-engagement#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://salescentri.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Company",
            item: "https://salescentri.com/company",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Community Engagement",
            item: "https://salescentri.com/company/community-engagement",
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://salescentri.com/#organization",
        name: "Sales Centri",
        url: "https://salescentri.com",
        logo: {
          "@type": "ImageObject",
          url: "https://salescentri.com/logo.png",
        },
        sameAs: [
          "https://www.linkedin.com/company/salescentri",
          "https://twitter.com/salescentri",
          "https://www.facebook.com/salescentri",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "Customer Service",
          availableLanguage: ["en", "en-US"],
        },
        address: {
          "@type": "PostalAddress",
          addressCountry: "US",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://salescentri.com/#website",
        url: "https://salescentri.com",
        name: "Sales Centri",
        description: "AI-Powered Sales Automation Platform",
        publisher: {
          "@id": "https://salescentri.com/#organization",
        },
        inLanguage: "en-US",
      },
      {
        "@type": "EducationalOrganization",
        name: "SalesCentri Community Education",
        description:
          "Free training modules and certifications for sales professionals looking to enhance their skills with AI-powered tools.",
        url: "https://salescentri.com/company/community-engagement",
        address: {
          "@type": "PostalAddress",
          addressCountry: "US",
        },
        areaServed: {
          "@type": "Place",
          name: "Worldwide",
        },
      },
      {
        "@type": "ItemList",
        name: "SalesCentri Community Engagement Initiatives",
        description: "Key community engagement programs and initiatives",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Sales Education Program",
            description: "Free training modules and certifications for sales professionals",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Startup Support Initiative",
            description: "Providing discounted access and mentorship to early-stage startups",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Community Forums",
            description: "Active online communities where sales professionals share best practices",
          },
          {
            "@type": "ListItem",
            position: 4,
            name: "Free Webinars & Workshops",
            description: "Monthly educational sessions covering automation and sales strategy",
          },
          {
            "@type": "ListItem",
            position: 5,
            name: "Empowering Women",
            description: "Providing equal employment opportunities and specialized training for women",
          },
          {
            "@type": "ListItem",
            position: 6,
            name: "Empowering Differently Abled People",
            description: "Employment opportunities and comprehensive training programs for differently abled individuals",
          },
          {
            "@type": "ListItem",
            position: 7,
            name: "Neurodivergent Talent Empowerment Program",
            description: "Structured guidance, inclusive workflows, and tailored skill-building opportunities for neurodivergent professionals to strengthen their capabilities in sales automation and technology",
          },
          {
            "@type": "ListItem",
            position: 8,
            name: "Connecting Rural Areas",
            description: "Remote employment opportunities and digital skills training for rural communities",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CommunityEngagementContent />
    </>
  );
}
