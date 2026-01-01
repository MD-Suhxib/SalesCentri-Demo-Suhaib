
"use client";

import React from 'react';
import { Bot, Settings, FileText, FileSpreadsheet, Search, Save, ChevronDown, X, Atom, History, Plus, Trash2 } from 'lucide-react';
// Removed CSS module import - using Tailwind CSS instead
import { AppShell } from '../../components/AppShell';
import MarkdownRenderer from '../ResearchComparison/MarkdownRenderer';
import WebSearchIndicator from '../../components/WebSearchIndicator';
import ProductionLoader from '../../components/ProductionLoader';
import { SimpleTxtExportButton, ResearchTxtExportButton, CopyToClipboardButton } from '../../components/TxtExportButton';
import { ResearchExcelExportButton, SingleModelExcelExportButton } from '../../components/ExcelExportComponents';
import { ImprovedSalesOpportunitiesExcelExport } from '../../components/ImprovedExcelExport';
import RobustPdfExportButton from '../../components/RobustPdfExportButton';
import * as XLSX from 'xlsx';
import { useTracker } from '../../hooks/useTracker';

// Dynamic import for PDF.js to avoid SSR issues
let pdfjsLib: any = null;

// Initialize PDF.js only on client side
if (typeof window !== 'undefined') {
  import('pdfjs-dist')
    .then((pdf: any) => {
      pdfjsLib = pdf;
      if (pdfjsLib && (pdfjsLib as any).GlobalWorkerOptions) {
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      }
    })
    .catch((error) => {
      console.warn('Failed to load PDF.js:', error);
    });
}

// BulkResult interface for typing
interface BulkResult {
  companyName: string;
  result?: string;
  error?: string;
}

// Bulk sales opportunities research for multiple websites (Gemini-only) - hoisted outside component
const handleBulkSalesOpportunitiesResearch = async (
  excelData: string[],
  category: string,
  depth: string,
  timeframe: string,
  geoScope: string,
  companySize: 'small' | 'medium' | 'big' | 'all',
  revenueCategory: 'startup' | 'emerging' | 'growth' | 'enterprise' | 'all',
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setResult: (result: string | null) => void,
  addToChatHistory: (entry: any) => void,
  trackCustomEvent: (event: string, props: any) => void,
  showStatus: (msg: string, type?: 'success' | 'error' | 'info') => void,
  uploadedFile?: File | null,
  websiteUrl?: string,
  websiteUrl2?: string
): Promise<void> => {
  const startTime = Date.now();
  setLoading(true);
  setError(null);

  try {
    const bulkResults: { [key: string]: BulkResult } = {};
    const processedWebsites: string[] = [];

    for (let i = 0; i < excelData.length; i++) {
      const websiteEntry = excelData[i];
      const website = websiteEntry.split(' (')[0];
      const companyName = websiteEntry.includes(' (') ? websiteEntry.split(' (')[1].replace(')', '') : '';

      console.log(`🔍 Processing website ${i + 1}/${excelData.length}: ${website} (${companyName || 'Unknown Company'})`);

      const individualQuery = companyName
        ? `Find sales opportunities and business prospects for ${companyName} at ${website}`
        : `Find sales opportunities and business prospects for the company at ${website}`;

      const payload = {
        query: individualQuery,
        category: 'sales_opportunities',
        depth,
        timeframe,
        geographic_scope: geoScope,
        website_url: website,
        website_url_2: null,
        company_size: companySize,
        revenue_category: revenueCategory,
        focus_on_leads: category === 'sales_opportunities',
        web_search_enabled: true,
        excel_data: null,
        excel_file_name: null,
        deep_research: true,
        include_founders: true,
        include_products: true,
        analyze_sales_opportunities: true,
        include_tabular_data: true,
        extract_company_info: true,
        analyze_prospective_clients: true,
        include_employee_count: true,
        include_revenue_data: true,
        include_complete_urls: true,
        selected_models: { gpt4o: false, gemini: true, perplexity: false, claude: false, llama: false, grok: false },
        using_web_search: true,
        config_summary: `Bulk Sales Opportunities Research: Processing ${companyName || 'Unknown Company'} at ${website}`
      };

      try {
        const res = await fetch('/api/multi-research-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`API error for ${website}:`, res.status, errorText);
          bulkResults[website] = {
            companyName: companyName || 'Unknown Company',
            error: `Failed to process ${website}: ${res.status} ${errorText}`
          };
        } else {
          const data = await res.json();
          console.log(`✅ Research completed for ${website}`);

          bulkResults[website] = {
            companyName: companyName || 'Unknown Company',
            result: data.gemini || (data.errors?.gemini ? `Error: ${data.errors.gemini}` : "No response from PSA GPT")
          };
        }

        processedWebsites.push(website);

        if (i < excelData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (websiteError) {
        console.error(`Error processing ${website}:`, websiteError);
        bulkResults[website] = {
          companyName: companyName || 'Unknown Company',
          error: `Error processing ${website}: ${(websiteError as Error).message}`
        };
      }
    }

    // Aggregate results
    let aggregatedResult = `# Bulk Sales Opportunities Research Results (PSA GPT/Gemini)\n\n**Total Websites Processed:** ${processedWebsites.length}\n**Research Focus:** Sales opportunities and business prospects\n\n`;

    processedWebsites.forEach(website => {
      const websiteData = bulkResults[website];
      if (websiteData.result && !websiteData.result.includes('Error:')) {
        aggregatedResult += `## ${websiteData.companyName} (${website})\n\n${websiteData.result}\n\n---\n\n`;
      } else if (websiteData.error) {
        aggregatedResult += `## ${websiteData.companyName} (${website})\n\n**Error:** ${websiteData.error}\n\n---\n\n`;
      }
    });

    aggregatedResult += `\n**Analysis Summary:**\n- Processed ${processedWebsites.length} websites for sales opportunities using PSA GPT (Gemini)\n- Each website analyzed individually for business prospects\n- Results include company analysis and sales opportunity identification\n`;

    setResult(aggregatedResult);

    // Add to history as single bulk entry
    addToChatHistory({
      query: `Bulk research for ${excelData.length} companies`,
      result: aggregatedResult,
      websiteUrl: websiteUrl || '',
      websiteUrl2: websiteUrl2 || '',
      excelData,
      fileName: uploadedFile?.name || null,
      category,
      depth,
    });

    trackCustomEvent('psagpt_bulk_research_completed', {
      totalWebsites: excelData.length,
      processedWebsites: processedWebsites.length,
      duration: Date.now() - startTime,
      category,
      depth
    });

    showStatus(`Bulk research completed for ${processedWebsites.length} websites`, 'success');

  } catch (error) {
    console.error('Bulk sales opportunities research error:', error);
    setError(`Failed to complete bulk research: ${(error as Error).message}`);
    showStatus('Bulk research failed', 'error');
  } finally {
    setLoading(false);
  }
};

// PSAGPT Component - Single Model Research with Gemini Integration
const PSAGPT: React.FC = () => {
  const { trackCustomEvent } = useTracker();
  const [query, setQuery] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(false);

  // Chat history state
  const [chatHistory, setChatHistory] = React.useState<Array<{
    id: number;
    query: string;
    result: string | null;
    timestamp: string;
    websiteUrl: string;
    websiteUrl2: string;
    excelData: string[];
    fileName: string | null;
    category: string;
    depth: string;
  }>>([]);

  // Current session ID for highlighting
  const [currentSessionId, setCurrentSessionId] = React.useState<number | null>(null);

  // State for controls
  const [category, setCategory] = React.useState<string>('sales_opportunities');
  const [depth, setDepth] = React.useState<string>('comprehensive');
  const [timeframe] = React.useState<string>('1Y');
  const [geoScope] = React.useState<string>('Regional');
  const [websiteUrl, setWebsiteUrl] = React.useState<string>('');
  const [websiteUrl2, setWebsiteUrl2] = React.useState<string>('');
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [excelData, setExcelData] = React.useState<string[]>([]);
  const [companySize, setCompanySize] = React.useState<'small' | 'medium' | 'big' | 'all'>('all');
  const [revenueCategory, setRevenueCategory] = React.useState<'startup' | 'emerging' | 'growth' | 'enterprise' | 'all'>('all');
  const [focusOnLeads, setFocusOnLeads] = React.useState<boolean>(true);
  const [usingWebSearch, setUsingWebSearch] = React.useState<boolean>(true);
  const [showConfig, setShowConfig] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string>('');
  const [statusType, setStatusType] = React.useState<'success' | 'error' | 'info'>('info');

  // Load initial query from localStorage if coming from homepage research mode
  React.useEffect(() => {
    const initialQuery = localStorage.getItem('psagpt_initial_query');
    if (initialQuery) {
      setQuery(initialQuery);
      localStorage.removeItem('psagpt_initial_query');
    }

    // Load chat history
    loadChatHistory();
  }, []);

  // Function to generate dynamic filename based on website input
  const generateFilename = (baseName: string): string => {
    const website = websiteUrl2 || websiteUrl;

    if (website && website.trim() !== '') {
      const cleanWebsite = website
        .replace(/^https?:\/\//, '')
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 30);

      return `${cleanWebsite}_psagpt_${baseName}`;
    }

    return `psagpt_${baseName}`;
  };

  // Show status message
  const showStatus = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatus(message);
    setStatusType(type);
    setTimeout(() => setStatus(''), 5000);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    showStatus(`File uploaded: ${file.name}`, 'success');

    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const extractedData = jsonData
            .slice(0, 20)
            .map((row: any) => {
              if (Array.isArray(row) && row.length >= 2) {
                const website = row[0]?.toString() || '';
                const company = row[1]?.toString() || '';
                return website && company ? `${website} (${company})` : website || company;
              }
              return '';
            })
            .filter(item => item.trim() !== '');

          setExcelData(extractedData);
          showStatus(`Extracted ${extractedData.length} companies from Excel file`, 'success');
        } catch (error) {
          console.error('Error reading Excel file:', error);
          showStatus('Error reading Excel file', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').slice(0, 20);
          const extractedData = lines
            .map(line => {
              const columns = line.split(',');
              if (columns.length >= 2) {
                const website = columns[0]?.trim() || '';
                const company = columns[1]?.trim() || '';
                return website && company ? `${website} (${company})` : website || company;
              }
              return line.trim();
            })
            .filter(item => item.trim() !== '');

          setExcelData(extractedData);
          showStatus(`Extracted ${extractedData.length} companies from CSV file`, 'success');
        } catch (error) {
          console.error('Error reading CSV file:', error);
          showStatus('Error reading CSV file', 'error');
        }
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          if (!pdfjsLib) {
            const pdfModule = await import('pdfjs-dist');
            pdfjsLib = pdfModule;
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          }

          const arrayBuffer = e.target?.result as ArrayBuffer;
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';

          for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => ('str' in item ? (item as { str: string }).str : ''))
              .join(' ');
            fullText += pageText + ' ';
          }

          const urlRegex = /https?:\/\/[^\s]+/g;
          const extractedUrls = fullText.match(urlRegex) || [];

          const websites = extractedUrls
            .filter((url: string) => {
              const cleanUrl = url.replace(/[^\w:\/\.\-]/g, '');
              return cleanUrl.length > 10 && (cleanUrl.includes('.com') || cleanUrl.includes('.org') || cleanUrl.includes('.net') || cleanUrl.includes('.io'));
            })
            .slice(0, 10);

          setExcelData(websites);
          showStatus(`Extracted ${websites.length} websites from PDF file`, 'success');
        } catch (error) {
          console.error('Error reading PDF file:', error);
          showStatus('Error reading PDF file', 'error');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle research
  const handleResearch = async () => {
    // Allow guest users to execute research - authentication check removed
    // Gate will be shown AFTER results are displayed
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    trackCustomEvent('psagpt_research_started', {
      query: query.substring(0, 100),
      category,
      depth,
      hasWebsite: !!websiteUrl,
      hasClientWebsite: !!websiteUrl2,
      hasExcelData: excelData.length > 0,
      companySize,
      revenueCategory,
      focusOnLeads
    });

    // Check for bulk processing
    if (excelData.length > 1 && category === 'sales_opportunities') {
      await handleBulkSalesOpportunitiesResearch(
        excelData,
        category,
        depth,
        timeframe,
        geoScope,
        companySize,
        revenueCategory,
        setLoading,
        setError,
        setResult,
        addToChatHistory,
        trackCustomEvent,
        showStatus,
        uploadedFile,
        websiteUrl,
        websiteUrl2
      );
      return;
    }

    try {
      const payload = {
        query,
        category,
        depth,
        timeframe,
        geographic_scope: geoScope,
        website_url: websiteUrl || null,
        website_url_2: websiteUrl2 || null,
        company_size: companySize,
        revenue_category: revenueCategory,
        focus_on_leads: focusOnLeads,
        web_search_enabled: true,
        excel_data: excelData.length > 0 ? excelData : null,
        excel_file_name: uploadedFile?.name || null,
        deep_research: true,
        include_founders: true,
        include_products: true,
        analyze_sales_opportunities: true,
        include_tabular_data: true,
        extract_company_info: true,
        analyze_prospective_clients: true,
        include_employee_count: true,
        include_revenue_data: true,
        include_complete_urls: true,
        selected_models: { gpt4o: false, gemini: true, perplexity: false, claude: false, llama: false, grok: false },
        using_web_search: usingWebSearch,
        config_summary: `PSAGPT Research: ${category.replace(/_/g, ' ')} analysis with ${depth} depth`
      };

      const res = await fetch('/api/multi-research-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to fetch research results: ${res.status} ${errorText}`);
      }

      const data = await res.json();

      const newResult = data.gemini || (data.errors?.gemini ? `Error: ${data.errors.gemini}` : "No response from PSAGPT");

      setResult(newResult);

      // Add to chat history
      addToChatHistory({
        query,
        result: newResult,
        websiteUrl,
        websiteUrl2,
        excelData,
        fileName: uploadedFile?.name || null,
        category,
        depth,
      });

      trackCustomEvent('psagpt_research_completed', {
        duration: Date.now() - startTime,
        hasResult: !!newResult
      });

      showStatus('PSAGPT research completed successfully', 'success');

    } catch (err) {
      console.error('PSAGPT research error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during research');
      showStatus('Research failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load chat history from localStorage
  const loadChatHistory = () => {
    try {
      const raw = localStorage.getItem('psagpt_chat_history');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setChatHistory(parsed);
      }
    } catch {
      // ignore
    }
  };

  // Add to chat history helper
  const addToChatHistory = (entry: {
    query: string;
    result: string | null;
    websiteUrl: string;
    websiteUrl2: string;
    excelData: string[];
    fileName: string | null;
    category: string;
    depth: string;
  }) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setChatHistory((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('psagpt_chat_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  return (
      <AppShell>
      <div className="min-h-screen bg-black text-white">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PSA GPT
                </h1>
                <p className="text-gray-400 text-sm">Advanced AI Research Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
            <div className="space-y-6">
              {/* Research Query */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Research Query
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your research question or topic..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Website URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Website
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Client Website
                  </label>
                  <input
                    type="url"
                    value={websiteUrl2}
                    onChange={(e) => setWebsiteUrl2(e.target.value)}
                    placeholder="https://clientcompany.com"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload Excel/CSV File (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors duration-200">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileSpreadsheet className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Excel (.xlsx, .xls) or CSV files
                    </p>
                  </label>
                </div>
                {uploadedFile && (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-300">
                      File: {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
                    </p>
                    {excelData.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {excelData.length} companies extracted
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Research Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleResearch}
                  disabled={loading || !query.trim()}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Start Research
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          {showConfig && (
            <div className="mb-8 p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Research Configuration</h3>
                <button
                  onClick={() => setShowConfig(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                  title="Close configuration panel"
                  aria-label="Close configuration panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select research category"
                  >
                    <option value="sales_opportunities">Sales Opportunities</option>
                    <option value="market_analysis">Market Analysis</option>
                    <option value="competitive_intelligence">Competitive Intelligence</option>
                    <option value="industry_insights">Industry Insights</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Depth
                  </label>
                  <select
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select research depth"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="comprehensive">Comprehensive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Size
                  </label>
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select company size"
                  >
                    <option value="all">All Sizes</option>
                    <option value="small">Small (1-50)</option>
                    <option value="medium">Medium (51-200)</option>
                    <option value="big">Large (200+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Revenue Category
                  </label>
                  <select
                    value={revenueCategory}
                    onChange={(e) => setRevenueCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Select revenue category"
                  >
                    <option value="all">All Categories</option>
                    <option value="startup">Startup</option>
                    <option value="emerging">Emerging</option>
                    <option value="growth">Growth</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={focusOnLeads}
                    onChange={(e) => setFocusOnLeads(e.target.checked)}
                    className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">Focus on Lead Generation</span>
                </label>
              </div>
            </div>
          )}

          {/* Results Section */}
          {loading && (
            <div className="mb-8 p-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 text-center">
              <ProductionLoader isVisible={loading} />
              <p className="text-gray-300 mt-4">Conducting research...</p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-6 bg-red-900/20 border border-red-700 rounded-xl">
              <h3 className="text-red-400 font-semibold mb-2">Error</h3>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Research Results</h2>
                <div className="flex gap-2">
                  <CopyToClipboardButton content={result} />
                  <ResearchTxtExportButton 
                    query={query} 
                    result={result} 
                    modelName="PSA GPT" 
                    fileName={generateFilename('research')} 
                  />
                  <ResearchExcelExportButton 
                    results={{ gpt4o: null, gemini: result, perplexity: null }} 
                  />
                  <RobustPdfExportButton 
                    userQuery={query} 
                    botResponse={result} 
                    fileName={generateFilename('research')} 
                  />
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <MarkdownRenderer markdown={result} />
              </div>
            </div>
          )}

          {/* Status Message */}
          {status && (
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
              statusType === 'success' ? 'bg-green-600' : 
              statusType === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}>
              <p className="text-white text-sm">{status}</p>
            </div>
          )}
        </div>
      </div>
      </AppShell>
  );
};

export default PSAGPT;
