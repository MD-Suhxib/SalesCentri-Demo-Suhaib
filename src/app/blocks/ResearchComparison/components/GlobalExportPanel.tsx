// Global export panel component for ResearchComparison

import React from 'react';
import { SimpleTxtExportButton, ResearchTxtExportButton, CopyToClipboardButton } from '../../../components/TxtExportButton';
import { ResearchExcelExportButton } from '../../../components/ExcelExportComponents';
import RobustPdfExportButton from '../../../components/RobustPdfExportButton';
import { exportResearchToTxt, exportBulkResearchToTxt } from '../../../lib/txtExporter';
import { exportBulkResearchToExcel } from '../../../lib/excelExporter';
import { ResearchResults } from '../types';
import { generateFilename } from '../utils';

interface GlobalExportPanelProps {
  query: string;
  results: ResearchResults;
  websiteUrl?: string;
  websiteUrl2?: string;
  bulkResults?: { [website: string]: { companyName: string; results?: ResearchResults; error?: string; processedAt?: string; processingIndex?: number } };
}

export const GlobalExportPanel: React.FC<GlobalExportPanelProps> = ({
  query,
  results,
  websiteUrl,
  websiteUrl2,
  bulkResults
}) => {
  // Check if we have bulk results or regular results
  const hasBulkResults = bulkResults && Object.keys(bulkResults).length > 0;
  const hasResults = hasBulkResults || Object.values(results).some(result => result);

  if (!hasResults) return null;

  return (
    <div className="mt-8 p-6 rounded-xl border mx-auto max-w-4xl"
         style={{
           background: 'var(--research-surface)',
           borderColor: 'var(--research-border)',
           boxShadow: 'var(--research-shadow)'
         }}>
      <h3 className="text-lg font-semibold mb-4 text-center"
          style={{ color: 'var(--research-text)' }}>
        Global Export Options
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {/* Export all results combined */}
        {hasBulkResults ? (
          <>
            <SimpleTxtExportButton
              onClick={() => {
                exportBulkResearchToTxt(query, bulkResults!, {
                  fileName: 'bulk_research_analysis.txt'
                });
              }}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'var(--research-primary)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--research-primary-hover)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--research-primary)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📄 Export Bulk Results TXT
            </SimpleTxtExportButton>
            
            <button
              onClick={() => {
                exportBulkResearchToExcel(query, bulkResults!);
              }}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'var(--research-primary)',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--research-primary-hover)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--research-primary)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              📊 Export Bulk Results Excel
            </button>
          </>
        ) : (
          <SimpleTxtExportButton
            onClick={() => {
              exportResearchToTxt(query, results, {
                fileName: 'complete_research_analysis.txt'
              });
            }}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'var(--research-primary)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--research-primary-hover)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--research-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          📄 Export All Results TXT
        </SimpleTxtExportButton>
        )}
        
        {/* Export all results to Excel */}
        {!hasBulkResults && (
          <ResearchExcelExportButton
            results={results}
          filename={generateFilename("complete_research_analysis.xlsx", "multi_model", websiteUrl, websiteUrl2)}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'var(--research-primary)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--research-primary-hover)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--research-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        )}
        
        {/* Export all results to PDF */}
        {!hasBulkResults && (
          <RobustPdfExportButton
          conversations={[
            ...(results.gpt4o ? [{
              userQuery: `${query} (GPT-4O Analysis)`,
              botResponse: results.gpt4o
            }] : []),
            ...(results.gemini ? [{
              userQuery: `${query} (PSAGPT Analysis)`,
              botResponse: results.gemini
            }] : []),
            ...(results.perplexity ? [{
              userQuery: `${query} (Perplexity Analysis)`,
              botResponse: results.perplexity
            }] : []),
            ...(results.claude ? [{
              userQuery: `${query} (Claude Analysis)`,
              botResponse: results.claude
            }] : []),
            ...(results.llama ? [{
              userQuery: `${query} (Llama 3 Analysis)`,
              botResponse: results.llama
            }] : []),
            ...(results.grok ? [{
              userQuery: `${query} (Grok Analysis)`,
              botResponse: results.grok
            }] : [])
          ]}
          fileName={generateFilename("complete_research_analysis.pdf", "multi_model", websiteUrl, websiteUrl2)}
          buttonText="📄 Export All Results PDF"
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'var(--research-primary)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--research-primary-hover)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--research-primary)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        )}
        
        {/* Copy to clipboard option */}
        {!hasBulkResults && (
          <CopyToClipboardButton
          content={`RESEARCH ANALYSIS\nQuery: ${query}\n\n${results.gpt4o ? 'GPT-4O:\n' + results.gpt4o + '\n\n' : ''}${results.gemini ? 'PSAGPT:\n' + results.gemini + '\n\n' : ''}${results.perplexity ? 'PERPLEXITY:\n' + results.perplexity + '\n\n' : ''}${results.claude ? 'CLAUDE:\n' + results.claude + '\n\n' : ''}${results.llama ? 'LLAMA 3:\n' + results.llama + '\n\n' : ''}${results.grok ? 'GROK:\n' + results.grok + '\n\n' : ''}`}
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background: 'var(--research-primary)',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--research-primary-hover)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--research-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        )}
        
        {/* Analytics Link */}
        <a
          href="/analytics"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:-translate-y-0.5 border"
          style={{
            background: 'var(--research-surface)',
            borderColor: 'var(--research-border)',
            color: 'var(--research-text)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--research-muted)';
            e.currentTarget.style.borderColor = 'var(--research-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--research-surface)';
            e.currentTarget.style.borderColor = 'var(--research-border)';
          }}
        >
          📋 View Query History & Costs
        </a>
      </div>
    </div>
  );
};
