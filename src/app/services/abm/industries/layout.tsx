import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Who Should Use ABM? Industries & Use Cases | Sales Centri AI',
  description: 'Discover which industries benefit most from Account-Based Marketing. Healthcare, Fintech, SaaS, Manufacturing, HR Tech, and more. Perfect for strategic B2B growth.',
  keywords: 'ABM industries, who should use ABM, healthcare ABM, fintech ABM, SaaS ABM, manufacturing ABM, HR tech ABM, blockchain ABM',
  openGraph: {
    title: 'Who Should Use ABM? Industries & Use Cases | Sales Centri AI',
    description: 'Discover which industries benefit most from Account-Based Marketing. Healthcare, Fintech, SaaS, Manufacturing, HR Tech, and more.',
    type: 'website',
    url: 'https://salescentri.com/platforms/lead-management/abm/industries',
  },
};

export default function ABMIndustriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
