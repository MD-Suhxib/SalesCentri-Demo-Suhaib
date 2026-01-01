// Types and interfaces for ResearchComparison component

export interface ResearchResults {
  gpt4o: string | null;
  gemini: string | null;
  perplexity: string | null;
  claude: string | null;
  llama: string | null;
  grok: string | null;
  deepseek: string | null;
  qwen3: string | null;
  mistralLarge: string | null;
}

export interface ChatHistoryEntry {
  id: number;
  query: string;
  results: ResearchResults;
  timestamp: string;
  websiteUrl: string;
  websiteUrl2: string;
  excelData: string[];
  fileName: string | null;
  category: string;
  depth: string;
}

export interface VisibleModels {
  gpt4o: boolean;
  gemini: boolean;
  perplexity: boolean;
  claude: boolean;
  llama: boolean;
  grok: boolean;
  deepseek: boolean;
  qwen3: boolean;
  mistralLarge: boolean;
}

export interface LoadingStates {
  gpt4o: boolean;
  gemini: boolean;
  perplexity: boolean;
  claude: boolean;
  llama: boolean;
  grok: boolean;
  deepseek: boolean;
  qwen3: boolean;
  mistralLarge: boolean;
}

export interface StatusNotification {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  visible: boolean;
}

export interface AnalyticsSummary {
  totalQueries: number;
  totalCost: number;
  averageResponseTime: number;
  totalProviders: number;
  totalModels: number;
}

export interface PerplexityBudget {
  used: number;
  total: number;
  percentage: number;
}

export type CompanySize = 'small' | 'medium' | 'big' | 'all';
export type RevenueCategory = 'startup' | 'emerging' | 'growth' | 'enterprise' | 'all';
export type ResearchCategory = 'market_analysis' | 'sales_opportunities' | 'competitive_intelligence' | 'industry_insights' | 'company_deep_research' | 'general_research';
export type DepthLevel = 'basic' | 'intermediate' | 'comprehensive';
export type AnalysisType = 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused';
export type MultiGPTOutputFormat = 'tableOnly' | 'withContext';

export interface ResearchConfiguration {
  name: string;
  category: ResearchCategory;
  depth: DepthLevel;
  timeframe: string;
  geoScope: string;
  websiteUrl: string;
  websiteUrl2: string;
  companySize: CompanySize;
  revenueCategory: RevenueCategory;
  focusOnLeads: boolean;
  visibleModels: VisibleModels;
  savedAt: string;
}

export interface BulkResearchResult {
  [website: string]: {
    companyName: string;
    results?: ResearchResults;
    error?: string;
    processedAt?: string;
    processingIndex?: number;
  };
}

export interface BulkResearchState {
  bulkResults: BulkResearchResult;
  processedCount: number;
  totalCount: number;
  currentIndex: number;
  isProcessing: boolean;
  companiesToProcess: number;
}
