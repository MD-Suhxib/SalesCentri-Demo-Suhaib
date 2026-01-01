/**
 * Chat PDF Export Button Component
 * 
 * This component provides a button to export research bot conversations to PDF
 */

'use client';

import React, { useState } from 'react';
import { 
  exportChatToPdf, 
  exportResearchBotToPdf, 
  exportMultipleConversationsToPdf,
  ChatMessage 
} from '@/app/lib/chatPdfExporter';

interface ChatPdfExportProps {
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
}

export default function ChatPdfExportButton({
  userQuery,
  botResponse,
  conversations,
  messages,
  fileName,
  buttonText = 'Export to PDF',
  buttonClassName,
  disabled = false,
  variant = 'primary'
}: ChatPdfExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const getButtonClasses = () => {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
    };
    
    return `${baseClasses} ${variantClasses[variant]} ${buttonClassName || ''}`;
  };

  const handleExport = async () => {
    if (disabled) return;

    setIsExporting(true);
    setExportStatus('idle');

    try {
      // Determine export type and execute
      if (messages && messages.length > 0) {
        // Custom messages format
        exportChatToPdf(messages, { fileName });
      } else if (conversations && conversations.length > 0) {
        // Multiple conversations
        exportMultipleConversationsToPdf(conversations, fileName);
      } else if (userQuery && botResponse) {
        // Single conversation
        exportResearchBotToPdf(userQuery, botResponse, fileName);
      } else {
        throw new Error('No valid conversation data provided for export');
      }

      setExportStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setExportStatus('idle');
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
          Exporting...
        </>
      );
    }

    if (exportStatus === 'success') {
      return (
        <>
          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-500">Exported!</span>
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
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={getButtonClasses()}
      title="Export conversation to PDF"
    >
      {getButtonContent()}
    </button>
  );
}

// Export additional utility component for custom styling
export function SimplePdfExportButton({
  onClick,
  children = 'Export PDF',
  className = ''
}: {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors ${className}`}
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
      {children}
    </button>
  );
}
