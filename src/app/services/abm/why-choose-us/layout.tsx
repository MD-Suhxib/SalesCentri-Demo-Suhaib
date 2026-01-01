import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Choose Sales Centri AI for ABM? | Performance-Based Pricing & Free Trial',
  description: 'Most ABM tools give you data — we deliver actual buying conversations. Performance-based pricing, 3 free qualified leads, exclusive delivery, and human+AI advantage.',
  keywords: 'why choose Sales Centri ABM, ABM performance-based pricing, free ABM trial, exclusive ABM leads, human AI ABM, ABM vs competitors',
  openGraph: {
    title: 'Why Choose Sales Centri AI for ABM? | Performance-Based Pricing & Free Trial',
    description: 'Most ABM tools give you data — we deliver actual buying conversations. Performance-based pricing, 3 free qualified leads, exclusive delivery.',
    type: 'website',
    url: 'https://salescentri.com/platforms/lead-management/abm/why-choose-us',
  },
};

export default function ABMWhyChooseUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
