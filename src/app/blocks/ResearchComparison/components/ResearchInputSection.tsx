import React from 'react';
import { Settings } from 'lucide-react';
import { FileUpload } from './FileUpload';

interface ResearchInputSectionProps {
  query: string;
  setQuery: (query: string) => void;
  websiteUrl: string;
  setWebsiteUrl: (url: string) => void;
  websiteUrl2: string;
  setWebsiteUrl2: (url: string) => void;
  uploadedFile: File | null;
  displayedFileName: string | null;
  excelData: any[];
  loading: boolean;
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
  onResearch: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSetWebsiteUrl2: (url: string) => void;
  onSetExcelData: (data: any[]) => void;
  onSetError: (error: string | null) => void;
  // Bulk research props
  companiesToProcess?: number;
  setCompaniesToProcess?: (count: number) => void;
  onStartBulkProcessing?: () => void;
  isProcessingBulk?: boolean;
  processedCompanyCount?: number;
}

export const ResearchInputSection: React.FC<ResearchInputSectionProps> = ({
  query,
  setQuery,
  websiteUrl,
  setWebsiteUrl,
  websiteUrl2,
  setWebsiteUrl2,
  uploadedFile,
  displayedFileName,
  excelData,
  loading,
  showConfig,
  setShowConfig,
  onResearch,
  onFileUpload,
  onSetWebsiteUrl2,
  onSetExcelData,
  onSetError,
  companiesToProcess = 0,
  setCompaniesToProcess,
  onStartBulkProcessing,
  isProcessingBulk = false,
  processedCompanyCount = 0
}) => {
  const isBulkMode = excelData.length > 1;
  const defaultCompaniesToProcess = isBulkMode ? excelData.length : 0;
  return (
    <div className="research-input-container bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-2 sm:p-3 md:p-4 lg:p-5 mb-3 sm:mb-4 md:mb-6 transition-all duration-200 hover:border-gray-600 mx-auto"
         style={{
           contain: 'layout style paint',
           willChange: 'auto',
           width: '75%',
           maxWidth: '1000px'
         }}>
      {/* Desktop: Original two-column layout | Mobile: Single column with specific order */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
        {/* Left Column: Research Topic and Your Website */}
        <div className="space-y-3 md:space-y-4">
          {/* Mobile Order: 1. Research Topic */}
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-medium text-white">
              Research Topic
            </label>
            <textarea
              placeholder="Enter research topic (e.g., 'AI startups in healthcare')"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border resize-none transition-all duration-200 font-medium placeholder:font-normal text-sm bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{
                fontSize: '16px',
                lineHeight: '1.5'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--research-primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--research-focus)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--research-border)';
                e.target.style.boxShadow = 'none';
              }}
              rows={1}
              autoFocus
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                const scrollHeight = target.scrollHeight;
                const maxHeight = parseInt(getComputedStyle(target).lineHeight) * 3;
                const newHeight = Math.min(scrollHeight, maxHeight);
                target.style.height = newHeight + 'px';
                // Use transform for better performance
                target.style.transform = 'translateZ(0)';
              }}
            />
          </div>
          
          {/* Mobile Order: 2. Your Website */}
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-medium text-white">
              Your Website
            </label>
            <input
              type="url"
              placeholder="https://your-company.com"
              value={websiteUrl}
              onChange={e => setWebsiteUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border transition-all duration-200 font-medium placeholder:font-normal text-sm bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{
                fontSize: '16px',
                lineHeight: '1.5'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--research-primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--research-focus)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--research-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          {/* Desktop: Action buttons in left column */}
          <div className="hidden lg:block">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl border transition-all duration-200 font-medium hover:-translate-y-0.5"
                style={{
                  background: 'var(--research-surface)',
                  borderColor: 'var(--research-border)',
                  color: 'var(--research-text)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--research-primary)';
                  e.currentTarget.style.boxShadow = '0 4px 12px var(--research-focus)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--research-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Research Configuration
                <span className="flex items-center justify-center">
                  <Settings size={18} />
                </span>
              </button>
              
              <button
                onClick={onResearch}
                disabled={loading || !query}
                className="flex items-center justify-center gap-3 px-8 py-3 rounded-xl border-0 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onMouseEnter={(e) => {
                  if (!loading && query) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 170, 255, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--research-shadow)';
                }}
              >
                {loading ? 'Researching...' : 'Start Research Now'}
                {!loading && <span className="text-lg">→</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Client Website and File Upload */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Mobile Order: 3. Client Website */}
          <div className="space-y-1 sm:space-y-2">
            <label className="research-label block text-xs sm:text-sm font-medium text-white">
              Client Website
            </label>
            <input
              type="url"
              placeholder="https://client-company.com"
              value={websiteUrl2}
              onChange={e => setWebsiteUrl2(e.target.value)}
              className="research-input-field w-full px-3 py-2 rounded-lg border transition-all duration-200 font-medium placeholder:font-normal text-sm bg-gray-800 text-white border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{
                fontSize: 'clamp(14px, 2.5vw, 16px)',
                lineHeight: '1.4',
                // Mobile-first responsive sizing
                height: '40px',
                minHeight: '40px'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--research-primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--research-focus)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--research-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          {/* Mobile Order: 4. Bulk Upload */}
          <div className="space-y-2">
            {/* OR Divider */}
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center w-full max-w-xs">
                <div className="flex-1 border-t"
                     style={{ borderColor: 'var(--research-border)' }}></div>
                <span className="px-4 text-sm font-medium"
                      style={{ 
                        color: 'var(--research-text-muted)',
                        background: 'var(--research-bg)'
                      }}>
                  OR
                </span>
                <div className="flex-1 border-t"
                     style={{ borderColor: 'var(--research-border)' }}></div>
              </div>
            </div>
            
            {/* File Upload Section */}
            <FileUpload
              uploadedFile={uploadedFile}
              displayedFileName={displayedFileName}
              excelData={excelData}
              onFileUpload={onFileUpload}
              onSetWebsiteUrl2={onSetWebsiteUrl2}
              onSetExcelData={onSetExcelData}
              onSetError={onSetError}
            />

            {/* Bulk Research Controls */}
            {isBulkMode && (
              <div className="mt-4 p-4 rounded-lg border"
                   style={{
                     background: 'rgba(59, 130, 246, 0.1)',
                     borderColor: 'rgba(59, 130, 246, 0.3)'
                   }}>
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-blue-300">
                    {excelData.length} companies loaded
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-white">
                      Batch Size: 20 companies per batch
                    </label>
                    <div className="w-full px-3 py-2.5 rounded-lg border text-sm bg-gray-700/50 text-white border-gray-600">
                      <div className="font-medium text-blue-300">
                        Processing rows {processedCompanyCount + 1}–{Math.min(processedCompanyCount + (companiesToProcess || 20), excelData.length)} of {excelData.length}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {processedCompanyCount > 0 && (
                        <span>{processedCompanyCount} already processed. </span>
                      )}
                      {excelData.length - processedCompanyCount > 0 && (
                        <span>{excelData.length - processedCompanyCount} remaining.</span>
                      )}
                    </div>
                  </div>

                  {onStartBulkProcessing && (
                    <button
                      onClick={onStartBulkProcessing}
                      disabled={loading || isProcessingBulk || !companiesToProcess}
                      className="w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      {isProcessingBulk ? 'Processing...' : 'Start Processing'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Order: 5. Research Configuration & 6. Start Research Now - Mobile Only */}
      <div className="lg:hidden mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="research-button flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl border transition-all duration-200 font-medium hover:-translate-y-0.5"
          style={{
            background: 'var(--research-surface)',
            borderColor: 'var(--research-border)',
            color: 'var(--research-text)',
            // Mobile-first sizing with proper touch targets
            height: '44px',
            minHeight: '44px',
            fontSize: 'clamp(13px, 2.2vw, 14px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--research-primary)';
            e.currentTarget.style.boxShadow = '0 4px 12px var(--research-focus)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--research-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Research Configuration
          <span className="flex items-center justify-center">
            <Settings size={18} />
          </span>
        </button>
        
        <button
          onClick={onResearch}
          disabled={loading || !query}
          className="research-button flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl border-0 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          style={{
            background: 'var(--research-gradient)',
            color: 'white',
            boxShadow: 'var(--research-shadow)',
            // Mobile-first sizing with proper touch targets
            height: '44px',
            minHeight: '44px',
            fontSize: 'clamp(13px, 2.2vw, 14px)'
          }}
          onMouseEnter={(e) => {
            if (!loading && query) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 170, 255, 0.25)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--research-shadow)';
          }}
        >
          {loading ? 'Researching...' : 'Start Research Now'}
          {!loading && <span className="text-lg">→</span>}
        </button>
      </div>
    </div>
  );
};

