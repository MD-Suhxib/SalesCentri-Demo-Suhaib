import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources & Insights | Sales Centri AI - Case Studies, Whitepapers & Tutorials',
  description: 'Access case studies, whitepapers, tutorials, and expert insights to maximize your sales automation success with Sales Centri.',
  keywords: 'resources, case studies, whitepapers, tutorials, sales automation resources, AI sales resources',
  openGraph: {
    title: 'Resources & Insights | Sales Centri AI',
    description: 'Access case studies, whitepapers, tutorials, and expert insights to maximize your sales automation success.',
    type: 'website',
    url: 'https://salescentri.com/resources',
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
