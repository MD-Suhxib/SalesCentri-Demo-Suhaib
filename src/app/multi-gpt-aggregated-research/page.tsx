'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ResearchComparison from '../blocks/ResearchComparison/ResearchComparison';
import { Navigation } from '../components/Navigation';

function PageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');
  const mode = searchParams.get('mode');
  const chatId = searchParams.get('chatId');

  useEffect(() => {
    // Handle ResearchGPT mode with pre-loaded results
    if (query && mode === 'researchgpt' && chatId) {
      console.log('ResearchGPT mode activated with query:', query, 'chatId:', chatId);
      
      // Check if we have stored research results
      const storedResults = localStorage.getItem('researchResults');
      if (storedResults) {
        try {
          const results = JSON.parse(storedResults);
          if (results.chatId === chatId) {
            console.log('Found stored research results for chat:', chatId);
            // Results will be loaded by the ResearchComparison component
          }
        } catch (error) {
          console.error('Error parsing stored research results:', error);
        }
      }
    }
  }, [query, mode, chatId]);

  return (
    <>
      <Navigation />
      <main className="pt-19 mt-1">
        <ResearchComparison 
          initialQuery={query || ''}
          initialMode={mode || 'research'}
          chatId={chatId || undefined}
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
