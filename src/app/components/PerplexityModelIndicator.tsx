'use client';

import React from 'react';
import styles from '../components/HomepageSalesGPT.module.css';

interface PerplexityModelIndicatorProps {
  requestedModel: string;
  actualModel: string;
  isDowngraded?: boolean;
}

/**
 * A component that displays when Perplexity model has been downgraded due to budget constraints
 */
export default function PerplexityModelIndicator({ 
  // requestedModel is kept in props for future reference but not used currently
  actualModel,
  isDowngraded
}: PerplexityModelIndicatorProps) {
  if (!isDowngraded) return null;
  
  // Map model IDs to friendly names
  const modelNames: Record<string, string> = {
    'pplx-7b-online': 'Basic (7B)',
    'pplx-70b-online': 'Standard (70B)',
    'pplx-online-claude-3-opus': 'Advanced (Claude-3-Opus)',
    'pplx-online-mixtral-8x22b': 'Research (Mixtral-8x22b)',
  };
  
  return (
    <div className={`${styles.webSearchIndicator} ${styles.modelDowngraded}`}>
      <div className={styles.webSearchIcon}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M8.277.084a.5.5 0 0 0-.554 0l-7.5 5A.5.5 0 0 0 .5 6h1.875v7H1.5a.5.5 0 0 0 0 1h13a.5.5 0 1 0 0-1h-.875V6H15.5a.5.5 0 0 0 .277-.916l-7.5-5zM12.375 6v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7h-1.25V6h1.25zm-2.5 0v7H3.5V6h1.25zM1.5 5a.5.5 0 0 1-.488-.62l3-11a.5.5 0 0 1 .488-.38h8a.5.5 0 0 1 .488.38l3 11a.5.5 0 0 1-.488.62h-14z"/>
        </svg>
      </div>
      <span>
        Model downgraded to {modelNames[actualModel] || actualModel} to stay within budget
      </span>
    </div>
  );
}
