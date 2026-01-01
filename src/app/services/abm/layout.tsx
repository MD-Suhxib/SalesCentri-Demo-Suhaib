import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account-Based Marketing (ABM) | Sales Centri AI - Precision B2B Targeting',
  description: 'Transform your B2B strategy with AI-powered Account-Based Marketing. Precision targeting, personalized outreach, and measurable engagement for high-value accounts.',
  keywords: 'account-based marketing, ABM, B2B marketing, precision targeting, sales automation, lead generation, AI marketing',
  openGraph: {
    title: 'Account-Based Marketing (ABM) | Sales Centri AI',
    description: 'Transform your B2B strategy with AI-powered Account-Based Marketing. Precision targeting, personalized outreach, and measurable engagement.',
    type: 'website',
    url: 'https://salescentri.com/platforms/lead-management/abm',
  },
};

export default function ABMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
