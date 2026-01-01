import React from 'react';
import { exportChatToTxt, exportSingleResearchToTxt, copyToClipboard } from '../lib/txtExporter';
import type { ChatMessage } from '../lib/txtExporter';

interface TxtExportButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

// Simple TXT Export Button
export const SimpleTxtExportButton: React.FC<TxtExportButtonProps> = ({
  onClick,
  children,
  className = '',
  disabled = false
}) => {
  const handleClick = async () => {
    // Check authentication before exporting
    const { checkAuthQuick } = await import('../lib/auth');
    const { getLoginUrl } = await import('../lib/loginUtils');
    
    if (!checkAuthQuick()) {
      console.log('🔐 TXT Export: Authentication required');
      // Redirect to login with current page preserved
      window.location.href = getLoginUrl(true);
      return;
    }
    
    onClick();
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      style={{
        backgroundColor: disabled ? 'var(--research-border, #E2E8F0)' : 'var(--research-primary, #4299E1)',
        color: 'white',
        border: 'none'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--research-primary-hover, #3182CE)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--research-primary, #4299E1)';
        }
      }}
    >
      📄 {children}
    </button>
  );
};

// Research TXT Export Button (for single model results)
interface ResearchTxtExportButtonProps {
  query: string;
  result: string;
  modelName: string;
  fileName?: string;
  className?: string;
  disabled?: boolean;
}

export const ResearchTxtExportButton: React.FC<ResearchTxtExportButtonProps> = ({
  query,
  result,
  modelName,
  fileName,
  className = '',
  disabled = false
}) => {
  const handleExport = async () => {
    // Check authentication before exporting
    const { checkAuthQuick } = await import('../lib/auth');
    const { getLoginUrl } = await import('../lib/loginUtils');
    
    if (!checkAuthQuick()) {
      console.log('🔐 Research TXT Export: Authentication required');
      // Redirect to login with current page preserved
      window.location.href = getLoginUrl(true);
      return;
    }
    
    try {
      exportSingleResearchToTxt(query, result, modelName, fileName);
    } catch (error) {
      console.error('Error exporting research to TXT:', error);
      alert('Failed to export research to TXT file');
    }
  };

  return (
    <SimpleTxtExportButton
      onClick={handleExport}
      className={className}
      disabled={disabled}
    >
      Export {modelName} TXT
    </SimpleTxtExportButton>
  );
};

// Chat TXT Export Button
interface ChatTxtExportButtonProps {
  messages: ChatMessage[];
  fileName?: string;
  className?: string;
  disabled?: boolean;
}

export const ChatTxtExportButton: React.FC<ChatTxtExportButtonProps> = ({
  messages,
  fileName,
  className = '',
  disabled = false
}) => {
  const handleExport = async () => {
    // Check authentication before exporting
    const { checkAuthQuick } = await import('../lib/auth');
    const { getLoginUrl } = await import('../lib/loginUtils');
    
    if (!checkAuthQuick()) {
      console.log('🔐 Chat TXT Export: Authentication required');
      // Redirect to login with current page preserved
      window.location.href = getLoginUrl(true);
      return;
    }
    
    try {
      exportChatToTxt(messages, { fileName });
    } catch (error) {
      console.error('Error exporting chat to TXT:', error);
      alert('Failed to export chat to TXT file');
    }
  };

  return (
    <SimpleTxtExportButton
      onClick={handleExport}
      className={className}
      disabled={disabled}
    >
      Export Chat TXT
    </SimpleTxtExportButton>
  );
};

// Copy to Clipboard Button
interface CopyToClipboardButtonProps {
  content: string;
  className?: string;
  disabled?: boolean;
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  content,
  className = '',
  disabled = false
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <button
      onClick={handleCopy}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      style={{
        backgroundColor: copied 
          ? 'var(--research-success, #48BB78)' 
          : disabled 
            ? 'var(--research-border, #E2E8F0)' 
            : 'var(--research-accent, #805AD5)',
        color: 'white',
        border: 'none'
      }}
      onMouseEnter={(e) => {
        if (!disabled && !copied) {
          e.currentTarget.style.backgroundColor = 'var(--research-accent-hover, #6B46C1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !copied) {
          e.currentTarget.style.backgroundColor = 'var(--research-accent, #805AD5)';
        }
      }}
    >
      {copied ? '✅ Copied!' : '📋 Copy'}
    </button>
  );
};

export default SimpleTxtExportButton;
