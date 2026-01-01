// Lead Generation Modal Prompt component for ResearchComparison

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Zap, 
  Globe, 
  ArrowLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { chatApi } from '../../../lib/chatApi';

interface LeadModalPromptProps {
  showModal: boolean;
  onClose: () => void;
}

export const LeadModalPrompt: React.FC<LeadModalPromptProps> = ({
  showModal,
  onClose
}) => {
  const [mounted, setMounted] = useState(false);
  const [showWebsiteInput, setShowWebsiteInput] = useState(false);
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [websiteError, setWebsiteError] = useState('');

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!showModal) {
      setShowWebsiteInput(false);
      setCompanyWebsite('');
      setWebsiteError('');
      setIsCreatingChat(false);
    }
  }, [showModal]);

  if (!showModal || !mounted) return null;

  // Validate website URL
  const validateWebsite = (url: string): boolean => {
    if (!url.trim()) {
      setWebsiteError('Website URL is required');
      return false;
    }

    // Basic URL validation
    let normalizedUrl = url.trim();
    
    // Add https:// if no protocol is specified
    if (!normalizedUrl.match(/^https?:\/\//i)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Basic URL pattern validation
    const urlPattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
    
    if (!urlPattern.test(normalizedUrl)) {
      setWebsiteError('Please enter a valid website URL (e.g., example.com or https://example.com)');
      return false;
    }

    setWebsiteError('');
    return true;
  };

  // Handle website input change
  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyWebsite(value);
    if (websiteError) {
      validateWebsite(value);
    }
  };

  // Handle "Yes" button click - show website input
  const handleYesClick = () => {
    setShowWebsiteInput(true);
  };

  // Handle "Back" button click - return to prompt
  const handleBackClick = () => {
    setShowWebsiteInput(false);
    setCompanyWebsite('');
    setWebsiteError('');
  };

  // Handle "No" button click - close modal
  const handleNoClick = () => {
    onClose();
  };

  // Handle lightning mode chat creation
  const handleStartLightningMode = async () => {
    if (!validateWebsite(companyWebsite)) {
      return;
    }

    setIsCreatingChat(true);
    setWebsiteError('');

    try {
      // Normalize URL
      let normalizedUrl = companyWebsite.trim();
      if (!normalizedUrl.match(/^https?:\/\//i)) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      // Create chat with Lightning Mode flag
      const chat = await chatApi.createChat("Lightning Mode Chat", "lightning");
      
      if (!chat || !chat.id) {
        throw new Error("Failed to create chat. Please try again.");
      }

      // Store lightning mode data for the PSA chat
      localStorage.setItem("lightningModeData", JSON.stringify({
        chatId: chat.id,
        inputs: { website: normalizedUrl },
        step: 'entry',
        timestamp: Date.now()
      }));

      // Create initial Lightning Mode message
      const lightningMessage = {
        id: `lightning_entry_${Date.now()}`,
        role: 'user' as const,
        content: `Lightning Mode Entry: ${JSON.stringify({ website: normalizedUrl })}`,
        timestamp: Date.now(),
        lightningMode: {
          type: 'lightning_mode' as const,
          step: 'entry' as const,
          data: { inputs: { website: normalizedUrl } },
          timestamp: Date.now()
        }
      };

      // Store the message for the chat to process
      localStorage.setItem("pendingLightningMessage", JSON.stringify(lightningMessage));

      // Redirect to PSA chat page
      window.location.href = `/solutions/psa-suite-one-stop-solution/c/${chat.id}`;

    } catch (err) {
      console.error('Error creating lightning mode chat:', err);
      setWebsiteError(err instanceof Error ? err.message : 'Failed to create chat. Please try again.');
      setIsCreatingChat(false);
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Min-height wrapper for proper centering */}
      <div
        style={{
          minHeight: 'calc(100vh - 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 0',
          boxSizing: 'border-box',
          width: '100%',
          flexShrink: 0
        }}
      >
        {/* Modal container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full"
          style={{ 
            background: 'var(--research-surface)',
            color: 'var(--research-text)',
            width: '100%',
            maxWidth: '32rem',
            maxHeight: 'calc(100vh - 2rem)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            margin: 'auto'
          }}
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b"
               style={{ borderColor: 'var(--research-border)' }}>
            <h3 id="lead-modal-title" className="text-lg sm:text-xl font-semibold flex items-center gap-2 sm:gap-3"
                style={{ color: 'var(--research-text)' }}>
              <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg"
                    style={{ background: 'var(--research-primary)' }}>
                <Zap size={16} className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </span>
              <span>Generate Leads</span>
            </h3>
            <button
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg transition-colors duration-200 text-xl sm:text-2xl font-light hover:bg-red-500/20 touch-manipulation"
              style={{ color: 'var(--research-text-muted)' }}
              onClick={onClose}
              aria-label="Close modal"
              type="button"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--research-danger)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--research-text-muted)';
              }}
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6"
               style={{
                 contain: 'layout style paint',
                 willChange: 'auto',
                 overscrollBehavior: 'contain',
                 scrollBehavior: 'smooth',
                 isolation: 'isolate',
                 minHeight: 0,
                 flex: '1 1 auto'
               }}>
            
            {!showWebsiteInput ? (
              /* Prompt Card */
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-base sm:text-lg font-medium mb-2" style={{ color: 'var(--research-text)' }}>
                    Do you want to start generating leads?
                  </p>
                  <p className="text-sm text-gray-400">
                    We'll help you create a lightning mode chat to generate leads based on your research.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleYesClick}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 touch-manipulation"
                    style={{
                      background: 'var(--research-accent)',
                      color: 'white',
                      minHeight: '2.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--research-accent-hover)';
                      e.currentTarget.style.boxShadow = '0 0.125rem 0.5rem rgba(167, 139, 250, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--research-accent)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Zap size={16} />
                    <span>Yes, Generate Leads</span>
                  </button>
                  
                  <button
                    onClick={handleNoClick}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 border touch-manipulation"
                    style={{
                      background: 'var(--research-surface)',
                      borderColor: 'var(--research-border)',
                      color: 'var(--research-text)',
                      minHeight: '2.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--research-primary)';
                      e.currentTarget.style.background = 'var(--research-muted)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--research-border)';
                      e.currentTarget.style.background = 'var(--research-surface)';
                    }}
                  >
                    <span>Not Now</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Website Input Card */
              <div className="space-y-4">
                <button
                  onClick={handleBackClick}
                  className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 touch-manipulation"
                  style={{ color: 'var(--research-text-muted)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--research-text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--research-text-muted)';
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <div>
                  <label className="block mb-2">
                    <span className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: 'var(--research-text)' }}>
                      <Globe size={16} />
                      Company Website <span className="text-red-400">*</span>
                    </span>
                    <input
                      type="text"
                      value={companyWebsite}
                      onChange={handleWebsiteChange}
                      onBlur={() => validateWebsite(companyWebsite)}
                      placeholder="example.com or https://example.com"
                      className="w-full px-3 py-2 rounded border transition-all duration-200 font-medium text-sm touch-manipulation"
                      style={{
                        background: 'var(--research-surface)',
                        borderColor: websiteError ? 'var(--research-danger)' : 'var(--research-border)',
                        color: 'var(--research-text)',
                        minHeight: '2.5rem'
                      }}
                      onFocus={(e) => {
                        if (!websiteError) {
                          e.target.style.borderColor = 'var(--research-primary)';
                          e.target.style.boxShadow = '0 0 0 0.125rem var(--research-focus)';
                        }
                      }}
                      onBlur={(e) => {
                        if (!websiteError) {
                          e.target.style.borderColor = 'var(--research-border)';
                          e.target.style.boxShadow = 'none';
                        }
                      }}
                      disabled={isCreatingChat}
                    />
                  </label>
                  
                  {websiteError && (
                    <div className="flex items-center gap-2 mt-2 text-sm" style={{ color: 'var(--research-danger)' }}>
                      <AlertCircle size={14} />
                      <span>{websiteError}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleStartLightningMode}
                  disabled={!companyWebsite.trim() || !!websiteError || isCreatingChat}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'var(--research-accent)',
                    color: 'white',
                    minHeight: '2.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.background = 'var(--research-accent-hover)';
                      e.currentTarget.style.boxShadow = '0 0.125rem 0.5rem rgba(167, 139, 250, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.background = 'var(--research-accent)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {isCreatingChat ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating Chat...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      <span>Start Lightning Mode</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document root
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }
  
  return null;
};

