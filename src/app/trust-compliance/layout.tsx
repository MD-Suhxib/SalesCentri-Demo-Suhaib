import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trust & Compliance | Sales Centri AI - Enterprise Security & Data Protection',
  description: 'Learn about Sales Centri\'s enterprise-grade security, compliance certifications, and data protection measures.',
  keywords: 'trust, compliance, security, data protection, SOC 2, ISO 27001, GDPR, CCPA, HIPAA, PCI DSS',
  openGraph: {
    title: 'Trust & Compliance | Sales Centri AI',
    description: 'Learn about Sales Centri\'s enterprise-grade security, compliance certifications, and data protection measures.',
    type: 'website',
    url: 'https://salescentri.com/trust-compliance',
  },
};

export default function TrustComplianceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
