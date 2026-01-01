import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HomePage } from './pages/home';

export const metadata: Metadata = {
  title: 'AI Sales Automation Platform',
  description: 'Sales Centri: AI-powered lead generation, contact intelligence, and revenue acceleration platform.',
};

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <HomePage />
    </Suspense>
  );
}
