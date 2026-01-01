import React, { useState } from 'react';
import { Play, Pause, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface BulkResearchProgressProps {
  totalCompanies: number;
  processedCount: number;
  currentIndex: number;
  isProcessing: boolean;
  bulkResults: { [website: string]: { companyName: string; results?: any; error?: string; processedAt?: string; processingIndex?: number } };
  onResume: () => void;
  onPause?: () => void;
}

export const BulkResearchProgress: React.FC<BulkResearchProgressProps> = ({
  totalCompanies,
  processedCount,
  currentIndex,
  isProcessing,
  bulkResults,
  onResume,
  onPause
}) => {
  const progressPercentage = totalCompanies > 0 ? (processedCount / totalCompanies) * 100 : 0;
  const remainingCount = totalCompanies - processedCount;
  const hasResults = Object.keys(bulkResults).length > 0;
  const [isCompaniesListExpanded, setIsCompaniesListExpanded] = useState(false);

  // Get sorted companies by processing index
  const sortedCompanies = Object.entries(bulkResults)
    .map(([website, data]) => ({ website, ...data }))
    .sort((a, b) => (a.processingIndex ?? 0) - (b.processingIndex ?? 0));

  return (
    <div className="mt-4 p-3 sm:p-4 rounded-lg border w-full lg:sticky lg:top-28 lg:w-[320px] lg:self-start lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:z-10"
         style={{
           background: 'var(--research-surface)',
           borderColor: 'var(--research-border)',
           boxShadow: 'var(--research-shadow)'
         }}>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold"
              style={{ color: 'var(--research-text)' }}>
            Bulk Research Progress
          </h3>
          <div className="text-xs sm:text-sm font-medium px-2 py-1 rounded"
               style={{ 
                 color: 'var(--research-text)',
                 background: 'var(--research-muted)'
               }}>
            {processedCount} / {totalCompanies}
          </div>
        </div>
        
        {/* Compact Progress Bar */}
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
          <div
            className="h-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
            style={{
              width: `${progressPercentage}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          />
        </div>

        {/* Current Status - Compact Badge */}
        {isProcessing && (
          <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm">
            <Loader2 size={14} className="text-blue-400 animate-spin" />
            <span className="font-medium text-blue-300">
              Processing {currentIndex + 1}/{totalCompanies}
            </span>
          </div>
        )}

        {/* Resume Button - Compact */}
        {!isProcessing && remainingCount > 0 && (
          <button
            onClick={onResume}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm rounded-md font-medium transition-all duration-200 hover:-translate-y-0.5 mb-2"
            style={{
              background: 'var(--research-primary)',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--research-primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--research-primary)';
            }}
          >
            <Play size={14} />
            Resume ({remainingCount} left)
          </button>
        )}

        {/* Completion Message - Compact Badge */}
        {!isProcessing && remainingCount === 0 && totalCompanies > 0 && (
          <div className="flex items-center gap-1.5 mb-2 text-xs sm:text-sm">
            <CheckCircle2 size={14} className="text-green-400" />
            <span className="font-medium text-green-300">
              All {totalCompanies} completed
            </span>
          </div>
        )}
      </div>

      {/* Collapsible Completed Companies List */}
      {hasResults && (
        <div className="mt-2 border-t pt-2"
             style={{ borderColor: 'var(--research-border)' }}>
          <button
            onClick={() => setIsCompaniesListExpanded(!isCompaniesListExpanded)}
            className="flex items-center justify-between w-full text-xs sm:text-sm font-semibold mb-2"
            style={{ color: 'var(--research-text)' }}
          >
            <span>Processed Companies ({sortedCompanies.length})</span>
            {isCompaniesListExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
          {isCompaniesListExpanded && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {sortedCompanies.map((company, idx) => (
                <div
                  key={company.website || idx}
                  className="flex items-center justify-between p-1.5 rounded border text-xs"
                  style={{
                    background: company.error ? 'rgba(239, 68, 68, 0.1)' : 'var(--research-muted)',
                    borderColor: company.error ? 'rgba(239, 68, 68, 0.3)' : 'var(--research-border)'
                  }}
                >
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    {company.error ? (
                      <XCircle size={12} className="text-red-400 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
                    )}
                    <span className="font-medium truncate"
                          style={{ color: 'var(--research-text)' }}>
                      {company.companyName || company.website}
                    </span>
                  </div>
                  <div className="text-xs ml-1.5 flex-shrink-0"
                       style={{ color: 'var(--research-text-muted)' }}>
                    #{company.processingIndex !== undefined ? company.processingIndex + 1 : idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

