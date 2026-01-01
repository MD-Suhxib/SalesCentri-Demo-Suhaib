import type { Metadata } from 'next';
import StartupProgramContent from './StartupProgramContent';

export const metadata: Metadata = {
  title: 'Startup Program | Sales Centri Resources for Founders & Accelerators',
  description:
    'Join the Sales Centri Startup Program to access AI-powered go-to-market playbooks, partner perks, and investor-ready resources tailored for high-growth teams.',
  keywords: [
    'Sales Centri startup program',
    'startup initiatives',
    'go-to-market playbooks',
    'startup resources',
    'sales automation for startups',
    'accelerator partnerships',
  ],
  openGraph: {
    title: 'Sales Centri Startup Program',
    description:
      'Glassmorphism-inspired resource hub covering startup initiatives, regional programs, and GTM articles powered by Sales Centri.',
    type: 'website',
    url: 'https://salescentri.com/resources/startup-program',
  },
};

export default function StartupProgramPage() {
  return <StartupProgramContent />;
}


