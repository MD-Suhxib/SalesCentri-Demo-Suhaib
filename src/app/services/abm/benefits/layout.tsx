import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ABM Benefits for Sales & Marketing Teams | Sales Centri AI',
  description: 'Discover how Account-Based Marketing bridges the gap between sales and marketing teams. Shorter sales cycles, higher deal values, and better ROI with AI-powered ABM.',
  keywords: 'ABM benefits, sales marketing alignment, shorter sales cycles, higher deal values, B2B ROI, account-based marketing benefits',
  openGraph: {
    title: 'ABM Benefits for Sales & Marketing Teams | Sales Centri AI',
    description: 'Discover how Account-Based Marketing bridges the gap between sales and marketing teams. Shorter sales cycles, higher deal values, and better ROI.',
    type: 'website',
    url: 'https://salescentri.com/platforms/lead-management/abm/benefits',
  },
};

export default function ABMBenefitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
