// Model column component for ResearchComparison

import React, { memo } from 'react';
import { Bot, Gem, Search } from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer';
import ResearchGPTTableRenderer from '../../../components/ResearchGPTTableRenderer';
import WebSearchIndicator from '../../../components/WebSearchIndicator';
import PerplexityModelIndicator from '../../../components/PerplexityModelIndicator';
import { ResearchTxtExportButton, CopyToClipboardButton } from '../../../components/TxtExportButton';
import { ResearchExcelExportButton, SingleModelExcelExportButton } from '../../../components/ExcelExportComponents';
import { ImprovedSalesOpportunitiesExcelExport } from '../../../components/ImprovedExcelExport';
import RobustPdfExportButton from '../../../components/RobustPdfExportButton';
import { ResearchResults, ResearchCategory } from '../types';
import { generateFilename } from '../utils';
import { TAILWIND_CLASSES } from '../constants';

interface ModelColumnProps {
  modelName: 'gpt4o' | 'gemini' | 'perplexity' | 'claude' | 'llama' | 'grok' | 'deepseek' | 'qwen3' | 'mistralLarge';
  displayName: string;
  icon: React.ReactNode;
  result: string | null;
  isLoading: boolean;
  query: string;
  category: ResearchCategory;
  websiteUrl?: string;
  websiteUrl2?: string;
  usingWebSearch?: boolean;
  requestedModel?: string;
  actualModel?: string;
  isDowngraded?: boolean;
  showWebSearchIndicator?: boolean;
}

export const ModelColumn: React.FC<ModelColumnProps> = memo(({
  modelName,
  displayName,
  icon,
  result,
  isLoading,
  query,
  category,
  websiteUrl,
  websiteUrl2,
  usingWebSearch,
  requestedModel,
  actualModel,
  isDowngraded,
  showWebSearchIndicator = false
}) => {
  const getModelSpecificContent = () => {
    switch (modelName) {
      case 'gpt4o':
        return (
          <>
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2"
                style={{ color: 'var(--research-text)' }}>
              <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
                <Bot size={16} />
              </span>
              <span>GPT-4O</span>
              <span className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: 'var(--research-muted)',
                      color: 'var(--research-text-muted)'
                    }}>
                OpenAI
              </span>
            </h2>
            {showWebSearchIndicator && (
              <WebSearchIndicator 
                isActive={usingWebSearch || false} 
                quotaExceeded={false}
                remainingSearches={undefined}
              />
            )}
          </>
        );
      
      case 'gemini':
        return (
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--research-text)' }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
              <Gem size={16} />
            </span>
            PSAGPT 
          </h2>
        );
      
      case 'perplexity':
        return (
          <h2 className="text-xl font-bold mb-2"
              style={{ color: 'var(--research-text)' }}>
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
                <Search size={16} />
              </span>
              <span>Perplexity</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: 'var(--research-muted)',
                        color: 'var(--research-text-muted)'
                      }}>
                  Perplexity AI
                </span>
                <span className="text-xs px-2 py-1 rounded-full"
                      style={{
                        background: 'var(--research-primary)',
                        color: 'white'
                      }}>
                  Deep Research
                </span>
              </div>
            </div>
          </h2>
        );
      
      case 'claude':
        return (
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--research-text)' }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
              <Bot size={16} />
            </span>
            <span>Claude (Anthropic)</span>
          </h2>
        );
      
      case 'llama':
        return (
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--research-text)' }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
              <Bot size={16} />
            </span>
            <span>Llama 3 (Meta)</span>
          </h2>
        );
      
      case 'grok':
        return (
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--research-text)' }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
              <Bot size={16} />
            </span>
            <span>Grok (xAI)</span>
          </h2>
        );
      
      case 'deepseek':
        return (
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--research-text)' }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
              <Bot size={16} />
            </span>
            <span>DeepSeek</span>
          </h2>
        );
      
      case 'qwen3':
        return (
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--research-text)' }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
              <Bot size={16} />
            </span>
            <span>Qwen 3</span>
          </h2>
        );
      
      case 'mistralLarge':
        return (
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"
              style={{ color: 'var(--research-text)' }}>
            <span className="flex items-center justify-center w-8 h-8 rounded-lg research-gradient">
              <Bot size={16} />
            </span>
            <span>Mistral Large</span>
          </h2>
        );
      
      default:
        return null;
    }
  };

  const getLoadingMessage = () => {
    switch (modelName) {
      case 'gpt4o':
        return 'Loading GPT-4O analysis...';
      case 'gemini':
        return 'Loading PSAGPT analysis...';
      case 'perplexity':
        return 'Loading Perplexity Deep Research analysis...';
      case 'claude':
        return 'Loading Claude analysis...';
      case 'llama':
        return 'Loading Llama 3 analysis...';
      case 'grok':
        return 'Loading Grok analysis...';
      case 'deepseek':
        return 'Loading DeepSeek analysis...';
      case 'qwen3':
        return 'Loading Qwen 3 analysis...';
      case 'mistralLarge':
        return 'Loading Mistral Large analysis...';
      default:
        return 'Loading analysis...';
    }
  };

  const getExportButtons = () => {
    if (!result || result.trim() === "") return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t"
           style={{ borderColor: 'var(--research-border)' }}>
        <ResearchTxtExportButton
          query={query}
          result={result}
          modelName={displayName}
          fileName={generateFilename("research.txt", modelName, websiteUrl, websiteUrl2)}
          className={TAILWIND_CLASSES.exportButton}
        />
        {category === 'sales_opportunities' ? (
          <ImprovedSalesOpportunitiesExcelExport
            data={result}
            filename={generateFilename("sales_opportunities.xlsx", modelName, websiteUrl, websiteUrl2)}
            title="Excel (Enhanced)"
            className={TAILWIND_CLASSES.exportButton}
          />
        ) : (
          <SingleModelExcelExportButton
            data={result}
            filename={generateFilename("research.xlsx", modelName, websiteUrl, websiteUrl2)}
            title="Excel"
            className={TAILWIND_CLASSES.exportButton}
          />
        )}
        <RobustPdfExportButton
          userQuery={query}
          botResponse={result}
          fileName={generateFilename("research.pdf", modelName, websiteUrl, websiteUrl2)}
          buttonText="PDF"
          className={TAILWIND_CLASSES.exportButton}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 min-w-0 w-full model-column"
         style={{
           minWidth: '300px',
           maxWidth: 'none'
         }}>
      {/* Model Header with Avatar - Chat-like Styling */}
      <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {displayName}
          </h3>
          {modelName === 'perplexity' && requestedModel && actualModel && (
            <PerplexityModelIndicator 
              requestedModel={requestedModel}
              actualModel={actualModel}
              isDowngraded={isDowngraded || false}
            />
          )}
        </div>
      </div>

      {/* Chat-like Content Area with Glass Container Styling */}
      <div className="glass-container rounded-xl p-4 border border-blue-400/30 bg-gradient-to-r from-blue-950/40 to-black/40 backdrop-blur-xl shadow-lg transition-all duration-200 hover:border-blue-400/50 w-full"
           style={{
             minHeight: '400px',
             width: '100%'
           }}>
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-sm text-white font-medium">
              {getLoadingMessage()}
            </div>
          </div>
        ) : result && result.trim() !== "" ? (
          <>
            {modelName === 'perplexity' && (
              <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-blue-900/30 text-blue-200 border border-blue-500/30 backdrop-blur-sm">
                Using Perplexity Deep Research for this analysis
              </div>
            )}
            <div className="text-white leading-relaxed prose prose-invert max-w-none model-column-content">
              {modelName === 'gemini' ? (
                <ResearchGPTTableRenderer markdown={result} hideTopToolbar={true} />
              ) : (
                <MarkdownRenderer markdown={result} hideTopToolbar={true} />
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 px-4 rounded-lg border-2 border-dashed border-blue-400/30 text-blue-300">
            No result yet. Enter a query and click "Start Research Now".
          </div>
        )}
      </div>
      
      {/* Export Buttons - Chat-like Styling */}
      {result && result.trim() !== "" && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/30">
          <div className="flex flex-wrap gap-2">
            {getExportButtons()}
          </div>
        </div>
      )}
    </div>
  );
});

ModelColumn.displayName = 'ModelColumn';
