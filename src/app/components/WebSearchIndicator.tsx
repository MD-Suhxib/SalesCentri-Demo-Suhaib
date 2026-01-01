'use client';

import React from 'react';
import styles from '../components/HomepageSalesGPT.module.css';

interface WebSearchIndicatorProps {
  isActive: boolean;
  quotaExceeded?: boolean;
  remainingSearches?: number;
}

/**
 * A component that displays when web search is actively being used
 * to enhance research results with real-time information.
 */
export default function WebSearchIndicator({ isActive, quotaExceeded, remainingSearches }: WebSearchIndicatorProps) {
  // Don't show anything if web search isn't active and quota isn't exceeded
  if (!isActive && !quotaExceeded) return null;
  
  // Show quota exceeded warning
  if (quotaExceeded) {
    return (
      <div className={`${styles.webSearchIndicator} ${styles.quotaExceeded}`}>
        <div className={styles.webSearchIcon}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            fill="currentColor" 
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0-1A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
        </div>
        <span>Web search quota exceeded. Using standard mode.</span>
      </div>
    );
  }
  
  // Show active web search indicator
  return (
    <div className={styles.webSearchIndicator}>
      <div className={styles.webSearchIcon}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
        </svg>
      </div>
      <span>
        Enhanced with real-time web search
      </span>
    </div>
  );
}
