// Research type definitions and interfaces

export type ResearchDepth = 'basic' | 'intermediate' | 'comprehensive';

export type ResearchCategory = 
  | 'market_analysis' 
  | 'competitive_intelligence' 
  | 'technology_trends' 
  | 'industry_insights' 
  | 'academic_research' 
  | 'financial_analysis' 
  | 'consumer_behavior' 
  | 'regulatory_landscape' 
  | 'sales_opportunities' 
  | 'company_deep_research' 
  | 'general_research';

export interface LeadProfile {
  companyName: string;
  website: string;
  products: string[];
  services: string[];
  targetCustomers: string[];
  valuePropositions: string[];
  useCases: string[];
  competitiveAdvantages: string[];
  industry: string;
  companySize: 'small' | 'medium' | 'large' | 'unknown';
  businessModel: string;
  idealCustomerProfile: {
    industryFocus: string[];
    companySize: string[];
    revenueRange: string[];
    geographicFocus: string[];
    decisionMakerTitles: string[];
    painPoints: string[];
    solutionFitCriteria: string[];
    competitiveAdvantages: string[];
  };
}

export interface ResearchRequest {
  query: string;
  originalPrompt?: string; // Original query for batch research context
  category: ResearchCategory;
  depth: ResearchDepth;
  timeframe?: string;
  geographic_scope?: string;
  data_sources?: string[];
  company_size?: 'small' | 'medium' | 'big' | 'all';
  focus_on_leads?: boolean;
  selected_models?: {
    gpt4o: boolean;
    gemini: boolean;
    perplexity: boolean;
    claude: boolean;
    llama: boolean;
    grok: boolean;
    deepseek: boolean;
    groq: boolean;
  };
  web_search_enabled?: boolean;
  excel_data?: any[] | null;
  excel_file_name?: string | null;
  using_web_search?: boolean;
  config_summary?: string;
  website_url?: string | null;
  website_url_2?: string | null;
  // Additional configuration settings
  revenue_category?: string | null;
  deep_research?: boolean;
  include_founders?: boolean;
  include_products?: boolean;
  analyze_sales_opportunities?: boolean;
  include_tabular_data?: boolean;
  extract_company_info?: boolean;
  analyze_prospective_clients?: boolean;
  include_employee_count?: boolean;
  include_revenue_data?: boolean;
  include_complete_urls?: boolean;
  perplexity_model?: string;
  analysis_type?: 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused';
  multi_gpt_output_format?: 'tableOnly' | 'withContext';
  
  // Batch research fields for incremental processing
  sessionId?: string;
  isContinuation?: boolean;
  batchIndex?: number;
  currentBatch?: string[]; // Current batch of rows/items to process
  previousResults?: ResearchResponse; // Results from previous batch for context
  mergedInstructions?: string; // Combined instructions with batch-specific additions
}

export interface ResearchResponse {
  gpt4o: string | null;
  gemini: string | null;
  perplexity: string | null;
  claude: string | null;
  llama: string | null;
  grok: string | null;
  deepseek: string | null;
  groq: string | null;
  errors?: { [provider: string]: string };
  metadata?: {
    processing_time: number;
    source_count: number;
    confidence_score: number;
  };
}

