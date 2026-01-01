import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Sales Centri AI - AI Digital Marketing & Sales Services',
  description: 'Transform your business with AI-powered digital marketing, sales automation, and lead generation services.',
  keywords: 'AI services, digital marketing, sales automation, lead generation, AI marketing, B2B services',
  openGraph: {
    title: 'Services | Sales Centri AI',
    description: 'Transform your business with AI-powered digital marketing, sales automation, and lead generation services.',
    type: 'website',
    url: 'https://salescentri.com/services',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
