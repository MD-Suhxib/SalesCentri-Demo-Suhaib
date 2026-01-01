/**
 * Robust PDF Export Button
 * 
 * Simple, reliable PDF export button component
 */

'use client';

import React, { useState } from 'react';
import { 
  exportToPdf,
  exportMultipleConversationsToPdf,
  exportResearchToPdf
} from '@/app/lib/robustPdfExporter';

interface RobustPdfExportButtonProps {
  // For single conversation
  userQuery?: string;
  botResponse?: string;
  
  // For multiple conversations
  conversations?: Array<{
    userQuery: string;
    botResponse: string;
    timestamp?: string;
  }>;
  
  // Customization
  fileName?: string;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
}

export default function RobustPdfExportButton({
  userQuery,
  botResponse,
  conversations,
  fileName,
  buttonText = 'Export PDF',
  className = '',
  disabled = false
}: RobustPdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    if (disabled || isExporting) return;

    // Check authentication before exporting
    const { checkAuthQuick } = await import('../lib/auth');
    const { getLoginUrl } = await import('../lib/loginUtils');
    
    if (!checkAuthQuick()) {
      console.log('🔐 PDF Export: Authentication required');
      // Redirect to login with current page preserved
      window.location.href = getLoginUrl(true);
      return;
    }

    setIsExporting(true);
    setStatus('idle');

    try {
      if (conversations && conversations.length > 0) {
        // Multiple conversations
        await exportMultipleConversationsToPdf(conversations, fileName);
      } else if (userQuery && botResponse) {
        // Single conversation
        await exportResearchToPdf(userQuery, botResponse, fileName);
      } else {
        throw new Error('No valid data provided for PDF export');
      }

      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('PDF export failed:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonContent = () => {
    if (isExporting) {
      return (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exporting...
        </>
      );
    }

    if (status === 'success') {
      return (
        <>
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-500">Downloaded!</span>
        </>
      );
    }

    if (status === 'error') {
      return (
        <>
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-red-500">Failed</span>
        </>
      );
    }

    return (
      <>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        {buttonText}
      </>
    );
  };

  const baseClasses = 'inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const buttonClasses = `${baseClasses} ${className}`;

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={buttonClasses}
      style={{
        backgroundColor: (disabled || isExporting) ? 'var(--research-border, #E2E8F0)' : 'var(--research-info, #4299E1)',
        color: 'white',
        border: 'none'
      }}
      onMouseEnter={(e) => {
        if (!disabled && !isExporting) {
          e.currentTarget.style.backgroundColor = 'var(--research-primary-hover, #3182CE)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !isExporting) {
          e.currentTarget.style.backgroundColor = 'var(--research-info, #4299E1)';
        }
      }}
      title="Export to PDF format"
    >
      {getButtonContent()}
    </button>
  );
}
