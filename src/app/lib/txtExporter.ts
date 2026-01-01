/**
 * TXT File Exporter Utility
 * 
 * This utility provides functions to export research results and chat conversations to TXT format
 */

export interface ChatMessage {
  role: 'User' | 'Bot' | 'Assistant' | 'System';
  message: string;
  timestamp?: string;
}

export interface TxtExportOptions {
  fileName?: string;
  includeTimestamp?: boolean;
  separator?: string;
  rolePrefix?: {
    user: string;
    bot: string;
    assistant: string;
    system: string;
  };
}

const DEFAULT_OPTIONS: Required<TxtExportOptions> = {
  fileName: 'export.txt',
  includeTimestamp: true,
  separator: '\n' + '='.repeat(80) + '\n',
  rolePrefix: {
    user: '[USER]',
    bot: '[BOT]',
    assistant: '[ASSISTANT]',
    system: '[SYSTEM]'
  }
};

/**
 * Export chat messages to TXT file
 */
export function exportChatToTxt(
  messages: ChatMessage[], 
  options: Partial<TxtExportOptions> = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  let content = '';
  
  // Add header
  content += `CHAT EXPORT\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;
  content += opts.separator;
  
  // Add messages
  messages.forEach((message, index) => {
    const rolePrefix = opts.rolePrefix[message.role.toLowerCase() as keyof typeof opts.rolePrefix] || `[${message.role.toUpperCase()}]`;
    
    content += `${rolePrefix}`;
    if (opts.includeTimestamp && message.timestamp) {
      content += ` (${message.timestamp})`;
    }
    content += '\n';
    content += message.message;
    content += '\n';
    
    // Add separator between messages (except for last one)
    if (index < messages.length - 1) {
      content += opts.separator;
    }
  });
  
  // Download the file
  downloadTxtFile(content, opts.fileName);
}

/**
 * Export bulk research results to TXT file
 */
export function exportBulkResearchToTxt(
  query: string,
  bulkResults: { [website: string]: { companyName: string; results?: { gpt4o?: string | null; gemini?: string | null; perplexity?: string | null; claude?: string | null; llama?: string | null; grok?: string | null; deepseek?: string | null; qwen3?: string | null; mistralLarge?: string | null }; error?: string; processedAt?: string; processingIndex?: number } },
  options: Partial<TxtExportOptions> = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Get sorted companies by processing index
  const sortedCompanies = Object.entries(bulkResults)
    .map(([website, data]) => ({ website, ...data }))
    .sort((a, b) => (a.processingIndex ?? 0) - (b.processingIndex ?? 0));

  let content = '';
  
  // Add header
  content += `BULK RESEARCH RESULTS\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;
  content += `Query: ${query}\n`;
  content += `Total Companies Processed: ${sortedCompanies.length}\n`;
  content += opts.separator;
  
  sortedCompanies.forEach((company, idx) => {
    content += `COMPANY ${idx + 1}: ${company.companyName}\n`;
    content += `Website: ${company.website}\n`;
    if (company.processedAt) {
      content += `Processed At: ${new Date(company.processedAt).toLocaleString()}\n`;
    }
    content += opts.separator;
    
    if (company.error) {
      content += `ERROR: ${company.error}\n\n`;
    } else if (company.results) {
      // Add results for each model
      const models = [
        { key: 'gpt4o', name: 'GPT-4O' },
        { key: 'gemini', name: 'PSA GPT (Gemini)' },
        { key: 'perplexity', name: 'Perplexity' },
        { key: 'claude', name: 'Claude' },
        { key: 'llama', name: 'Llama 3' },
        { key: 'grok', name: 'Grok' },
        { key: 'deepseek', name: 'DeepSeek' },
        { key: 'qwen3', name: 'Qwen 3' },
        { key: 'mistralLarge', name: 'Mistral Large' }
      ];
      
      models.forEach(({ key, name }) => {
        const result = company.results?.[key as keyof typeof company.results];
        if (result && !result.includes('Error:') && !result.includes('No response')) {
          content += `${name} Analysis:\n`;
          content += opts.separator;
          content += `${result}\n\n`;
        }
      });
    }
    
    content += opts.separator;
  });
  
  content += `\nEXPORT COMPLETED: ${new Date().toLocaleString()}`;
  
  // Download the file
  const defaultFileName = opts.fileName || `Sales_Centri_bulk_research_${new Date().toISOString().split('T')[0]}.txt`;
  downloadTxtFile(content, defaultFileName);
}

/**
 * Export research results to TXT file
 */
export function exportResearchToTxt(
  query: string,
  results: {
    gpt4o?: string | null;
    gemini?: string | null;
    perplexity?: string | null;
  },
  options: Partial<TxtExportOptions> = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  let content = '';
  
  // Add header
  content += `RESEARCH ANALYSIS EXPORT\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;
  content += `Query: ${query}\n`;
  content += opts.separator;
  
  // Add GPT-4O results
  if (results.gpt4o) {
    content += `GPT-4O ANALYSIS\n`;
    content += opts.separator;
    content += results.gpt4o;
    content += '\n' + opts.separator;
  }
  
  // Add Gemini results
  if (results.gemini) {
    content += `GEMINI ANALYSIS\n`;
    content += opts.separator;
    content += results.gemini;
    content += '\n' + opts.separator;
  }
  
  // Add Perplexity results
  if (results.perplexity) {
    content += `PERPLEXITY DEEP RESEARCH ANALYSIS\n`;
    content += opts.separator;
    content += results.perplexity;
    content += '\n' + opts.separator;
  }
  
  // Add footer
  content += `\nEXPORT COMPLETED: ${new Date().toLocaleString()}`;
  
  // Download the file
  downloadTxtFile(content, opts.fileName || 'research_analysis.txt');
}

/**
 * Export single model research result to TXT file
 */
export function exportSingleResearchToTxt(
  query: string,
  result: string,
  modelName: string,
  fileName?: string
): void {
  let content = '';
  
  // Add header
  content += `${modelName.toUpperCase()} RESEARCH ANALYSIS\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;
  content += `Query: ${query}\n`;
  content += '\n' + '='.repeat(80) + '\n\n';
  
  // Add content
  content += result;
  
  // Add footer
  content += '\n\n' + '='.repeat(80) + '\n';
  content += `Export completed: ${new Date().toLocaleString()}`;
  
  // Download the file
  const defaultFileName = `Sales_Centri_${modelName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_research.txt`;
  downloadTxtFile(content, fileName || defaultFileName);
}

/**
 * Download content as TXT file
 */
function downloadTxtFile(content: string, fileName: string): void {
  try {
    // Create blob with UTF-8 encoding
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`TXT file "${link.download}" downloaded successfully`);
  } catch (error) {
    console.error('Error downloading TXT file:', error);
    throw new Error('Failed to download TXT file');
  }
}

/**
 * Copy content to clipboard as fallback
 */
export function copyToClipboard(content: string): Promise<void> {
  return navigator.clipboard.writeText(content)
    .then(() => {
      console.log('Content copied to clipboard');
    })
    .catch((error) => {
      console.error('Error copying to clipboard:', error);
      throw new Error('Failed to copy to clipboard');
    });
}
