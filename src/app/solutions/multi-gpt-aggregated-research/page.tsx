"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RedirectComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get any query parameters to preserve them during redirect
    const queryString = searchParams.toString();
    const redirectUrl = queryString 
      ? `/multi-gpt-aggregated-research?${queryString}`
      : '/multi-gpt-aggregated-research';
    
    // Redirect to multi-gpt-aggregated-research
    router.replace(redirectUrl);
  }, [router, searchParams]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to Multi Research GPT...</p>
      </div>
    </div>
  );
}

export default function MultiGPTAggregatedResearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    }>
      <RedirectComponent />
    </Suspense>
  );
}      