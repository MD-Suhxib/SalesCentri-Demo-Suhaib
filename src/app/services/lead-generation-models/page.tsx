import type { Metadata } from 'next';
import LeadGenerationModelsContent from './LeadGenerationModelsContent';

export const metadata: Metadata = {
  title: 'Lead Generation Models | Sales Centri',
  description: 'Discover SalesCentri\'s proven B2B lead generation models — from awareness to conversion. Explore TOFU, MOFU, and BOFU lead strategies to drive pipeline growth and ROI.',
  keywords: 'B2B lead generation, MQL, SQL, HQL, content syndication, appointment generation, SalesCentri services',
  openGraph: {
    title: 'Lead Generation Models | Sales Centri',
    description: 'Discover SalesCentri\'s proven B2B lead generation models — from awareness to conversion. Explore TOFU, MOFU, and BOFU lead strategies to drive pipeline growth and ROI.',
    type: 'website',
    url: 'https://salescentri.com/services/lead-generation-models',
  },
};

export default function LeadGenerationModelsPage() {
  return <LeadGenerationModelsContent />;
}

