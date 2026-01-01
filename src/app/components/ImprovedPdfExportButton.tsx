/**
 * Improved PDF Export Button Component
 * 
 * This component provides a robust PDF export button for research bot conversations
 * with enhanced error handling and user feedback.
 */

'use client';

import React, { useState } from 'react';
import { 
  exportResearchToPdf,
  exportResearchBotToPdf, 
  exportMultipleConversationsToPdf,
  ChatMessage,
  PdfExportOptions
} from '@/app/lib/improvedPdfExporter';

interface PdfExportButtonProps {
  // For single conversation export
  userQuery?: string;
  botResponse?: string;
  
  // For multiple conversations export
  conversations?: Array<{
    userQuery: string;
    botResponse: string;
    timestamp?: string;
  }>;
  
  // For custom message format export
  messages?: ChatMessage[];
  
  // Customization options
  fileName?: string;
  buttonText?: string;
  buttonClassName?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  pdfOptions?: Partial<PdfExportOptions>;
}

export default function ImprovedPdfExportButton({
  userQuery,
  botResponse,
  conversations,
  messages,
  fileName,
  buttonText = 'Export to PDF',
  buttonClassName,
  disabled = false,
  variant = 'primary',
  pdfOptions = {}
}: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const getButtonClasses = () => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm hover:shadow-md',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white'
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${buttonClassName || ''}`;
  };

  const handleExport = async () => {
    if (disabled || isExporting) return;

    setIsExporting(true);
    setExportStatus('idle');
    setErrorMessage('');

    try {
      // Determine export type and execute
      if (messages && messages.length > 0) {
        // Custom messages format
        await exportResearchToPdf(messages, { ...pdfOptions, fileName });
      } else if (conversations && conversations.length > 0) {
        // Multiple conversations
        await exportMultipleConversationsToPdf(conversations, fileName);
      } else if (userQuery && botResponse) {
        // Single conversation
        await exportResearchBotToPdf(userQuery, botResponse, fileName);
      } else {
        throw new Error('No valid conversation data provided for export');
      }

      setExportStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('PDF export failed:', error);
      setExportStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setExportStatus('idle');
        setErrorMessage('');
      }, 5000);
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
          Generating PDF...
        </>
      );
    }

    if (exportStatus === 'success') {
      return (
        <>
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-500">PDF Downloaded!</span>
        </>
      );
    }

    if (exportStatus === 'error') {
      return (
        <>
          <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="text-red-500">Export Failed</span>
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

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={disabled || isExporting}
        className={getButtonClasses()}
        title="Export conversation to PDF format"
      >
        {getButtonContent()}
      </button>
      
      {/* Error message tooltip */}
      {exportStatus === 'error' && errorMessage && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-100 border border-red-300 rounded-md shadow-lg z-50 max-w-xs">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      )}
    </div>
  );
}

// Simple PDF export button for basic use cases
export function SimplePdfExportButton({
  onClick,
  children = 'Export PDF',
  className = '',
  disabled = false
}: {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded transition-colors ${className}`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
      {children}
    </button>
  );
}

// Hook for manual PDF export functionality
export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const exportToPdf = async (
    data: {
      userQuery?: string;
      botResponse?: string;
      messages?: ChatMessage[];
      conversations?: Array<{
        userQuery: string;
        botResponse: string;
        timestamp?: string;
      }>;
    },
    options: Partial<PdfExportOptions> & { fileName?: string } = {}
  ) => {
    setIsExporting(true);
    setLastError(null);

    try {
      if (data.messages && data.messages.length > 0) {
        await exportResearchToPdf(data.messages, options);
      } else if (data.conversations && data.conversations.length > 0) {
        await exportMultipleConversationsToPdf(data.conversations, options.fileName);
      } else if (data.userQuery && data.botResponse) {
        await exportResearchBotToPdf(data.userQuery, data.botResponse, options.fileName);
      } else {
        throw new Error('No valid conversation data provided for export');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setLastError(errorMessage);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPdf,
    isExporting,
    lastError,
    clearError: () => setLastError(null)
  };
}
