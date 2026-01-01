import type { Metadata } from 'next';
import { ROICalculator } from '../components/ROICalculator';

export const metadata: Metadata = {
  title: 'ROI Calculator',
  description: 'Calculate the return on investment for Sales Centri sales automation tools. See how much you can save with AI-powered lead generation.',
};

export default function ROICalculatorPage() {
  return (
    <div className="min-h-screen bg-black">
      <section className="pt-20">
        <ROICalculator />
      </section>
    </div>
  );
}


