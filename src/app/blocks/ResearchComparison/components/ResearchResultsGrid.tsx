import React, { useState } from 'react';
import { Microscope, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';
import { ModelColumn } from './ModelColumn';
import MarkdownRenderer from '../MarkdownRenderer';

interface ResearchResultsGridProps {
  visibleModels: {
    gpt4o: boolean;
    gemini: boolean;
    perplexity: boolean;
    claude: boolean;
    llama: boolean;
    grok: boolean;
    deepseek: boolean;
    qwen3: boolean;
    mistralLarge: boolean;
  };
  results: {
    gpt4o: string | null;
    gemini: string | null;
    perplexity: string | null;
    claude: string | null;
    llama: string | null;
    grok: string | null;
    deepseek: string | null;
    qwen3: string | null;
    mistralLarge: string | null;
  };
  loadingStates: {
    gpt4o: boolean;
    gemini: boolean;
    perplexity: boolean;
    claude: boolean;
    llama: boolean;
    grok: boolean;
    deepseek: boolean;
    qwen3: boolean;
    mistralLarge: boolean;
  };
  query: string;
  category: string;
  websiteUrl: string;
  websiteUrl2: string;
  usingWebSearch: boolean;
  requestedModel: string;
  perplexityModel: string;
  modelDowngraded: boolean;
  bulkResults?: { [website: string]: { companyName: string; results?: any; error?: string; processedAt?: string; processingIndex?: number } };
}

export const ResearchResultsGrid: React.FC<ResearchResultsGridProps> = ({
  visibleModels,
  results,
  loadingStates,
  query,
  category,
  websiteUrl,
  websiteUrl2,
  usingWebSearch,
  requestedModel,
  perplexityModel,
  modelDowngraded,
  bulkResults
}) => {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

  const toggleCompany = (website: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(website)) {
      newExpanded.delete(website);
    } else {
      newExpanded.add(website);
    }
    setExpandedCompanies(newExpanded);
  };

  // If bulk results exist, display them in a table/list format
  if (bulkResults && Object.keys(bulkResults).length > 0) {
    const sortedCompanies = Object.entries(bulkResults)
      .map(([website, data]) => ({ website, ...data }))
      .sort((a, b) => (a.processingIndex ?? 0) - (b.processingIndex ?? 0));

    return (
      <div className="w-full mb-6 sm:mb-8">
        <div className="space-y-4">
          {sortedCompanies.map((company) => {
            const isExpanded = expandedCompanies.has(company.website);
            const hasError = !!company.error;
            const hasResults = company.results && Object.values(company.results).some(r => r && !r.includes('Error:') && !r.includes('No response'));

            return (
              <div
                key={company.website}
                className="rounded-xl border p-4"
                style={{
                  background: hasError ? 'rgba(239, 68, 68, 0.1)' : 'var(--research-surface)',
                  borderColor: hasError ? 'rgba(239, 68, 68, 0.3)' : 'var(--research-border)',
                  boxShadow: 'var(--research-shadow)'
                }}
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCompany(company.website)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {hasError ? (
                      <XCircle size={20} className="text-red-400 flex-shrink-0" />
                    ) : hasResults ? (
                      <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-white truncate">
                        {company.companyName || company.website}
                      </div>
                      <div className="text-sm text-gray-400 truncate">
                        {company.website}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      #{company.processingIndex !== undefined ? company.processingIndex + 1 : '?'}
                    </div>
                  </div>
                  <button className="ml-4 p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    {hasError ? (
                      <div className="text-red-400 p-3 rounded-lg bg-red-500/10">
                        <strong>Error:</strong> {company.error}
                      </div>
                    ) : company.results ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(company.results).map(([model, result]) => {
                          if (!result || result.includes('Error:') || result.includes('No response')) return null;
                          
                          const modelNames: { [key: string]: string } = {
                            gpt4o: 'GPT-4O',
                            gemini: 'PSA GPT',
                            perplexity: 'Perplexity',
                            claude: 'Claude',
                            llama: 'Llama 3',
                            grok: 'Grok',
                            deepseek: 'DeepSeek',
                            qwen3: 'Qwen 3',
                            mistralLarge: 'Mistral Large'
                          };

                          return (
                            <div
                              key={model}
                              className="p-3 rounded-lg border"
                              style={{
                                background: 'var(--research-muted)',
                                borderColor: 'var(--research-border)'
                              }}
                            >
                              <div className="font-semibold text-sm mb-2 text-blue-300">
                                {modelNames[model] || model}
                              </div>
                              <div className="text-sm text-gray-300 max-h-64 overflow-y-auto">
                                <MarkdownRenderer markdown={result} hideTopToolbar={true} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center py-4">
                        No results available
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default single research display
  return (
    <div className="w-full overflow-x-auto mb-6 sm:mb-8 research-results-container"
         style={{
           contain: 'layout style paint',
           willChange: 'auto'
         }}>
      <div className="research-grid-full-width w-full"
           style={{
             width: '100%',
             minWidth: '100%'
           }}>
        {/* PSAGPT Column */}
        {visibleModels.gemini && (
          <ModelColumn
            modelName="gemini"
            displayName="PSA GPT"
            icon={<Microscope size={16} />}
            result={results.gemini}
            isLoading={loadingStates.gemini}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
          />
        )}
        
        {/* GPT-4O Column */}
        {visibleModels.gpt4o && (
          <ModelColumn
            modelName="gpt4o"
            displayName="GPT - 4o"
            icon={<Microscope size={16} />}
            result={results.gpt4o}
            isLoading={loadingStates.gpt4o}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
            usingWebSearch={usingWebSearch}
            showWebSearchIndicator={true}
          />
        )}
        
        {/* Perplexity Column */}
        {visibleModels.perplexity && (
          <ModelColumn
            modelName="perplexity"
            displayName="Perplexity"
            icon={<Microscope size={16} />}
            result={results.perplexity}
            isLoading={loadingStates.perplexity}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
            requestedModel={requestedModel}
            actualModel={perplexityModel}
            isDowngraded={modelDowngraded}
          />
        )}

        {/* Claude Column */}
        {visibleModels.claude && (
          <ModelColumn
            modelName="claude"
            displayName="Claude"
            icon={<Microscope size={16} />}
            result={results.claude}
            isLoading={loadingStates.claude}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
          />
        )}

        {/* Llama 3 Column */}
        {visibleModels.llama && (
          <ModelColumn
            modelName="llama"
            displayName="Llama 3"
            icon={<Microscope size={16} />}
            result={results.llama}
            isLoading={loadingStates.llama}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
          />
        )}

        {/* Grok Column */}
        {visibleModels.grok && (
          <ModelColumn
            modelName="grok"
            displayName="Grok"
            icon={<Microscope size={16} />}
            result={results.grok}
            isLoading={loadingStates.grok}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
          />
        )}

        {/* DeepSeek Column */}
        {visibleModels.deepseek && (
          <ModelColumn
            modelName="deepseek"
            displayName="DeepSeek"
            icon={<Microscope size={16} />}
            result={results.deepseek}
            isLoading={loadingStates.deepseek}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
          />
        )}

        {/* Qwen 3 Column */}
        {visibleModels.qwen3 && (
          <ModelColumn
            modelName="qwen3"
            displayName="Qwen 3"
            icon={<Microscope size={16} />}
            result={results.qwen3}
            isLoading={loadingStates.qwen3}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
          />
        )}

        {/* Mistral Large Column */}
        {visibleModels.mistralLarge && (
          <ModelColumn
            modelName="mistralLarge"
            displayName="Mistral Large"
            icon={<Microscope size={16} />}
            result={results.mistralLarge}
            isLoading={loadingStates.mistralLarge}
            query={query}
            category={category}
            websiteUrl={websiteUrl}
            websiteUrl2={websiteUrl2}
          />
        )}
      </div>
    </div>
  );
};

