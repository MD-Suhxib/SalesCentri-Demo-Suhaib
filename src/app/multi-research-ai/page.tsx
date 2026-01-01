'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResearchComparison from '../blocks/ResearchComparison/ResearchComparison';
import { Navigation } from '../components/Navigation';
import { LoginRedirectHandler } from '../components/LoginRedirectHandler';

function PageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const mode = searchParams.get('mode');

  useEffect(() => {
    // If there's a query parameter, we can handle it here
    // The ResearchComparison component will handle the actual research
    if (query && mode === 'researchgpt') {
      console.log('ResearchGPT mode activated with query:', query);
    }
  }, [query, mode]);

  return (
    <>
      <LoginRedirectHandler />
      <Navigation />
      <main className="pt-16">
        <ResearchComparison 
          initialQuery={query || ''}
          initialMode={mode || 'research'}
        />
      </main>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}