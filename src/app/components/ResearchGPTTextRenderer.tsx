"use client";

import React from 'react';
import MarkdownRenderer from '@/app/blocks/ResearchComparison/MarkdownRenderer';
import styles from './ResearchGPTTableStyles.module.css';

interface ResearchGPTTextRendererProps {
  content: string;
  className?: string;
}

/**
 * Simple text renderer for ResearchGPT text content
 * Uses existing MarkdownRenderer but optimized for text content
 */
const ResearchGPTTextRenderer: React.FC<ResearchGPTTextRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <div className={`${styles['researchgpt-text-content']} ${className}`}>
      <MarkdownRenderer
        markdown={content}
        hideTopToolbar={true}
      />
    </div>
  );
};

ResearchGPTTextRenderer.displayName = 'ResearchGPTTextRenderer';

export default ResearchGPTTextRenderer;
