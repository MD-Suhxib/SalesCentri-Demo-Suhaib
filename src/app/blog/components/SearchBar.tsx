'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set('q', query.trim());
      params.set('page', '1');
    } else {
      params.delete('q');
    }
    
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto mt-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full rounded-full border border-gray-700 bg-gray-900/50 px-5 py-3 pl-12 text-sm text-gray-200 placeholder-gray-500 backdrop-blur transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <button
          type="submit"
          disabled={isPending}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 p-2 text-white transition-all duration-200 hover:bg-blue-500 disabled:opacity-50"
        >
          {isPending ? (
            <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </button>
      </div>
      
      {searchParams.get('q') && (
        <p className="mt-3 text-sm text-gray-400 text-center">
          Showing results for: <span className="text-blue-400 font-medium">&quot;{searchParams.get('q')}&quot;</span>
        </p>
      )}
    </form>
  );
}
