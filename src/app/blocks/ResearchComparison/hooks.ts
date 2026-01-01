// Custom hooks for ResearchComparison component

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ResearchResults, 
  ChatHistoryEntry, 
  VisibleModels, 
  LoadingStates, 
  StatusNotification,
  AnalyticsSummary,
  PerplexityBudget,
  CompanySize,
  RevenueCategory,
  ResearchCategory,
  DepthLevel
} from './types';

// Hook for managing research state
export const useResearchState = () => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ResearchResults>({ 
    gpt4o: null, 
    gemini: null, 
    perplexity: null, 
    claude: null, 
    llama: null, 
    grok: null,
    deepseek: null,
    qwen3: null,
    mistralLarge: null
  });
  const [error, setError] = useState<string | null>(null);

  return {
    query,
    setQuery,
    loading,
    setLoading,
    results,
    setResults,
    error,
    setError
  };
};

// Hook for managing sidebar state
export const useSidebarState = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarDocked, setSidebarDocked] = useState<boolean>(false);

  return {
    sidebarOpen,
    setSidebarOpen,
    sidebarDocked,
    setSidebarDocked
  };
};

// Hook for managing chat history
export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  // Load chat history on component mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('researchBotHistory') || '[]');
    const enhancedHistory = savedHistory.map((entry: ChatHistoryEntry) => ({
      ...entry,
      websiteUrl: entry.websiteUrl || '',
      websiteUrl2: entry.websiteUrl2 || '',
      excelData: entry.excelData || [],
      fileName: entry.fileName || null,
      category: entry.category || 'market_analysis',
      depth: entry.depth || 'comprehensive'
    }));
    setChatHistory(enhancedHistory.slice(-20)); // Limit to last 20 entries
  }, []);

  return {
    chatHistory,
    setChatHistory,
    currentSessionId,
    setCurrentSessionId
  };
};

// Hook for managing visible models
export const useVisibleModels = () => {
  const [visibleModels, setVisibleModels] = useState<VisibleModels>({
    gpt4o: true,
    gemini: true,
    perplexity: false,
    claude: false,
    llama: false,
    grok: false,
    deepseek: false,
    qwen3: false,
    mistralLarge: false
  });

  return {
    visibleModels,
    setVisibleModels
  };
};

// Hook for managing loading states
export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = useState<LoadingStates>({
    gpt4o: false,
    gemini: false,
    perplexity: false,
    claude: false,
    llama: false,
    grok: false,
    deepseek: false,
    qwen3: false,
    mistralLarge: false
  });

  return {
    loadingStates,
    setLoadingStates
  };
};

// Hook for managing status notifications
export const useStatusNotification = () => {
  const [status, setStatus] = useState<StatusNotification>({
    message: '',
    type: 'info',
    visible: false
  });

  const showStatus = (message: string, type: 'success' | 'warning' | 'error' | 'info') => {
    setStatus({ message, type, visible: true });
  };

  return {
    status,
    setStatus,
    showStatus
  };
};

// Hook for managing analytics
export const useAnalytics = () => {
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);

  const loadAnalyticsSummary = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics/llm');
      if (response.ok) {
        const data = await response.json();
        
        // Check if data is an array or an object with analytics properties
        if (Array.isArray(data)) {
          // Legacy format: array of usage entries
          const summary = {
            totalQueries: data.length,
            totalCost: data.reduce((sum: number, item: any) => sum + (item.cost || 0), 0),
            averageResponseTime: data.length > 0 ? 
              data.reduce((sum: number, item: any) => sum + (item.responseTime || 0), 0) / data.length : 0,
            totalProviders: new Set(data.map((item: any) => item.provider)).size,
            totalModels: new Set(data.map((item: any) => item.model)).size
          };
          setAnalyticsSummary(summary);
        } else if (data && typeof data === 'object') {
          // New format: analytics object with summary properties
          const summary = {
            totalQueries: data.totalQueries || 0,
            totalCost: data.totalCost || 0,
            averageResponseTime: data.averageResponseTime || 0,
            totalProviders: data.additionalMetrics?.totalProviders || 0,
            totalModels: data.additionalMetrics?.totalModels || 0
          };
          setAnalyticsSummary(summary);
        } else {
          // Fallback: set default values
          setAnalyticsSummary({
            totalQueries: 0,
            totalCost: 0,
            averageResponseTime: 0,
            totalProviders: 0,
            totalModels: 0
          });
        }
      }
    } catch (error) {
      console.error('Failed to load analytics summary:', error);
      // Set default values on error
      setAnalyticsSummary({
        totalQueries: 0,
        totalCost: 0,
        averageResponseTime: 0,
        totalProviders: 0,
        totalModels: 0
      });
    }
  }, []); // Empty dependency array to prevent recreation

  return {
    analyticsSummary,
    setAnalyticsSummary,
    loadAnalyticsSummary
  };
};

// Hook for managing Perplexity budget
export const usePerplexityBudget = () => {
  const [perplexityBudget, setPerplexityBudget] = useState<PerplexityBudget>({ 
    used: 0, 
    total: 15, 
    percentage: 0 
  });
  const [perplexityCostLimitEnabled, setPerplexityCostLimitEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Load Perplexity budget data
    import('../../lib/perplexityUsageControl').then(({ getBudgetInfo, getPerplexityConfig }) => {
      const budgetInfo = getBudgetInfo();
      setPerplexityBudget(budgetInfo);
      
      const config = getPerplexityConfig();
      setPerplexityCostLimitEnabled(config.costLimitEnabled);
    }).catch(error => {
      console.error("Failed to load Perplexity budget data:", error);
    });
  }, []);

  return {
    perplexityBudget,
    setPerplexityBudget,
    perplexityCostLimitEnabled,
    setPerplexityCostLimitEnabled
  };
};

// Hook for managing research configuration
export const useResearchConfiguration = () => {
  const [category, setCategory] = useState<ResearchCategory>('market_analysis');
  const [depth, setDepth] = useState<DepthLevel>('comprehensive');
  const [timeframe] = useState<string>('1Y');
  const [geoScope] = useState<string>('Regional');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [websiteUrl2, setWebsiteUrl2] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<string[]>([]);
  const [companySize, setCompanySize] = useState<CompanySize>('all');
  const [revenueCategory, setRevenueCategory] = useState<RevenueCategory>('all');
  const [focusOnLeads, setFocusOnLeads] = useState<boolean>(true);
  const [displayedFileName, setDisplayedFileName] = useState<string | null>(null);

  return {
    category,
    setCategory,
    depth,
    setDepth,
    timeframe,
    geoScope,
    websiteUrl,
    setWebsiteUrl,
    websiteUrl2,
    setWebsiteUrl2,
    uploadedFile,
    setUploadedFile,
    excelData,
    setExcelData,
    companySize,
    setCompanySize,
    revenueCategory,
    setRevenueCategory,
    focusOnLeads,
    setFocusOnLeads,
    displayedFileName,
    setDisplayedFileName
  };
};

// Hook for managing modal state
export const useModalState = () => {
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [showHistorySelectionModal, setShowHistorySelectionModal] = useState<boolean>(false);
  const [selectedHistoryQueries, setSelectedHistoryQueries] = useState<string[]>([]);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const modalBodyRef = useRef<HTMLDivElement>(null);

  return {
    showConfig,
    setShowConfig,
    showHistorySelectionModal,
    setShowHistorySelectionModal,
    selectedHistoryQueries,
    setSelectedHistoryQueries,
    saveSuccess,
    setSaveSuccess,
    successMessage,
    setSuccessMessage,
    modalBodyRef
  };
};

// Hook for managing Perplexity model state
export const usePerplexityModel = () => {
  const [perplexityModel, setPerplexityModel] = useState<string>('sonar-deep-research');
  const [modelDowngraded, setModelDowngraded] = useState<boolean>(false);
  const [requestedModel, setRequestedModel] = useState<string>('sonar-deep-research');
  const [usingWebSearch, setUsingWebSearch] = useState<boolean>(false);
  const [webSearchEnabled] = useState<boolean>(true);

  return {
    perplexityModel,
    setPerplexityModel,
    modelDowngraded,
    setModelDowngraded,
    requestedModel,
    setRequestedModel,
    usingWebSearch,
    setUsingWebSearch,
    webSearchEnabled
  };
};
