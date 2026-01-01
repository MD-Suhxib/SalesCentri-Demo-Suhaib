import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans | Sales Centri AI - Transparent Pricing for Sales Automation',
  description: 'Choose the perfect Sales Centri plan for your business. Transparent pricing for AI-powered sales automation and lead generation.',
  keywords: 'pricing, sales automation pricing, AI pricing, lead generation pricing, Sales Centri pricing',
  openGraph: {
    title: 'Pricing Plans | Sales Centri AI',
    description: 'Choose the perfect Sales Centri plan for your business. Transparent pricing for AI-powered sales automation.',
    type: 'website',
    url: 'https://salescentri.com/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


