"use client";

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import './scroll-performance.css';
import LightRays from '../Backgrounds/LightRays/LightRays';
import ProductionLoader from '../../components/ProductionLoader';
import StatusIndicator from '../../components/StatusIndicator';
import { useTracker } from '../../hooks/useTracker';
import { validateAuthenticationAsync } from '../../lib/auth';
import { getLoginUrl } from '../../lib/loginUtils';
import { MultiGPTGate } from '../../components/MultiGPTGate';

// Import components
import { HistorySidebar } from './components/HistorySidebar';
import { ConfigurationModal } from './components/ConfigurationModal';
import { LeadModalPrompt } from './components/LeadModalPrompt';
import { GlobalExportPanel } from './components/GlobalExportPanel';
import { ResearchInputSection } from './components/ResearchInputSection';
import { ResearchResultsGrid } from './components/ResearchResultsGrid';
import { BulkResearchProgress } from './components/BulkResearchProgress';
import { TimeCounter } from './components/TimeCounter';

// Import hooks
import {
  useResearchState,
  useSidebarState,
  useChatHistory,
  useVisibleModels,
  useLoadingStates,
  useStatusNotification,
  useAnalytics,
  usePerplexityBudget,
  useResearchConfiguration,
  useModalState,
  usePerplexityModel
} from './hooks';

// Import handlers
import { createResearchHandlers } from './ResearchHandlers';

// Research comparison dashboard with multi-model research capabilities
interface ResearchComparisonProps {
  initialQuery?: string;
  initialMode?: string;
  chatId?: string;
}

const ResearchComparison: React.FC<ResearchComparisonProps> = ({
  initialQuery = '',
  initialMode = 'research',
  chatId
}) => {
  const { trackCustomEvent } = useTracker();

  // Batch size constant - always process 20 rows (or fewer if less remain)
  const BATCH_SIZE = 20;

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showAuthGate, setShowAuthGate] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // State hooks
  const { query, setQuery, loading, setLoading, results, setResults, error, setError } = useResearchState();
  const { sidebarOpen, setSidebarOpen, sidebarDocked, setSidebarDocked } = useSidebarState();
  const { chatHistory, setChatHistory, currentSessionId, setCurrentSessionId } = useChatHistory();
  const { visibleModels, setVisibleModels } = useVisibleModels();
  const { loadingStates, setLoadingStates } = useLoadingStates();
  const { status, setStatus, showStatus } = useStatusNotification();
  const { analyticsSummary, loadAnalyticsSummary } = useAnalytics();
  const { perplexityBudget, setPerplexityBudget } = usePerplexityBudget();
  const {
    category, setCategory, depth, setDepth, timeframe, geoScope,
    websiteUrl, setWebsiteUrl, websiteUrl2, setWebsiteUrl2,
    uploadedFile, setUploadedFile, excelData, setExcelData,
    companySize, setCompanySize, revenueCategory, setRevenueCategory,
    focusOnLeads, setFocusOnLeads, displayedFileName, setDisplayedFileName
  } = useResearchConfiguration();
  const {
    showConfig, setShowConfig, showHistorySelectionModal, setShowHistorySelectionModal,
    selectedHistoryQueries, setSelectedHistoryQueries, saveSuccess, setSaveSuccess,
    successMessage, setSuccessMessage, modalBodyRef
  } = useModalState();
  const {
    perplexityModel, setPerplexityModel, modelDowngraded, setModelDowngraded,
    requestedModel, setRequestedModel, usingWebSearch, setUsingWebSearch, webSearchEnabled
  } = usePerplexityModel();

  // Analysis Type State - for General Research category to select analysis variant
  const [analysisType, setAnalysisType] = useState<'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused'>('default');
  
  // MultiGPT Output Format State - for multiGPTFocused mode to select table-only or with-context output
  const [multiGPTOutputFormat, setMultiGPTOutputFormat] = useState<'tableOnly' | 'withContext'>('withContext');
  
  // Debug logging for output format changes
  useEffect(() => {
    console.log('🎨 multiGPTOutputFormat changed to:', multiGPTOutputFormat);
  }, [multiGPTOutputFormat]);
  
  useEffect(() => {
    console.log('📊 analysisType changed to:', analysisType);
  }, [analysisType]);

  // Lead Generation Modal State
  const [showLeadGenModal, setShowLeadGenModal] = useState(false);
  const [leadGenModalShown, setLeadGenModalShown] = useState(false);

  // Batch Research State Management
  const [batchSize, setBatchSize] = useState<number>(20); // Default batch size
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [totalBatches, setTotalBatches] = useState<number>(0);
  const [currentBatchData, setCurrentBatchData] = useState<string[]>([]);
  const [previousResults, setPreviousResults] = useState<any>(null);
  const [showContinueButton, setShowContinueButton] = useState<boolean>(false);
  const [batchInstructions, setBatchInstructions] = useState<string>('');
  const [showBatchInstructionsModal, setShowBatchInstructionsModal] = useState<boolean>(false);
  const [isBatchResearch, setIsBatchResearch] = useState<boolean>(false);

  // Bulk Research State Management (for real-time incremental processing)
  const [bulkResearchResults, setBulkResearchResults] = useState<{ [website: string]: { companyName: string; results?: any; error?: string; processedAt?: string; processingIndex?: number } }>({});
  const [processedCompanyCount, setProcessedCompanyCount] = useState<number>(0);
  const [companiesToProcess, setCompaniesToProcess] = useState<number>(0);
  const [isProcessingBulk, setIsProcessingBulk] = useState<boolean>(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number>(0);
  const [bulkProcessingPaused, setBulkProcessingPaused] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const cancellationRef = React.useRef<boolean>(false);
  
  // Wrapper function to reset processed count when setting new Excel data
  const setExcelDataWithReset = useCallback((newData: string[]) => {
    setExcelData(newData);
    // Only reset processed count if we're not restoring from localStorage
    if (!isRestoringRef.current && newData.length > 0) {
      console.log('🔄 New Excel data loaded, resetting processed count to 0');
      setProcessedCompanyCount(0);
      // Reset companiesToProcess to enable the button
      const BATCH_SIZE = 20;
      setCompaniesToProcess(Math.min(BATCH_SIZE, newData.length));
      
      // Clear ALL localStorage bulk research data for clean slate
      localStorage.removeItem('bulkResearch_excelData');
      localStorage.removeItem('bulkResearch_totalCompanies');
      localStorage.removeItem('bulkResearch_processedCount');
      console.log('🧹 Cleared all localStorage bulk research data for new file');
      
      // Reset bulk research results
      setBulkResearchResults({});
    }
  }, []);
  
  // Debug logging for continue button visibility
  useEffect(() => {
    console.log('🔍 Continue Button Visibility Check:', {
      excelDataLength: excelData.length,
      isProcessingBulk,
      loading,
      processedCompanyCount,
      bulkResultsCount: Object.keys(bulkResearchResults).length,
      shouldShow: excelData.length > 0 && !isProcessingBulk && !loading && processedCompanyCount > 0 && processedCompanyCount < excelData.length && Object.keys(bulkResearchResults).length > 0
    });
  }, [excelData.length, isProcessingBulk, loading, processedCompanyCount, bulkResearchResults]);
  
  // Persist Excel data and processing state to localStorage whenever they change
  useEffect(() => {
    if (excelData.length > 0) {
      try {
        localStorage.setItem('bulkResearch_excelData', JSON.stringify(excelData));
        localStorage.setItem('bulkResearch_totalCompanies', excelData.length.toString());
        localStorage.setItem('bulkResearch_processedCount', processedCompanyCount.toString());
        console.log('💾 Excel data saved to localStorage:', {
          companies: excelData.length,
          processed: processedCompanyCount
        });
      } catch (error) {
        console.error('Failed to save Excel data to localStorage:', error);
      }
    }
  }, [excelData, processedCompanyCount]);
  
  // Track if we're restoring from localStorage to prevent unwanted resets
  const isRestoringRef = React.useRef(false);
  
  // Restore Excel data and processing state from localStorage on mount
  useEffect(() => {
    try {
      const savedExcelData = localStorage.getItem('bulkResearch_excelData');
      const savedProcessedCount = localStorage.getItem('bulkResearch_processedCount');
      
      if (savedExcelData && excelData.length === 0) {
        const parsed = JSON.parse(savedExcelData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          isRestoringRef.current = true;
          setExcelData(parsed);
          
          // Restore processed count if available
          if (savedProcessedCount) {
            const count = parseInt(savedProcessedCount, 10);
            if (!isNaN(count) && count > 0) {
              setProcessedCompanyCount(count);
              console.log('📂 Restored from localStorage:', {
                companies: parsed.length,
                processed: count,
                remaining: parsed.length - count
              });
            }
          } else {
            console.log('📂 Excel data restored from localStorage:', parsed.length, 'companies');
          }
          // Reset flag after a short delay to allow state updates to complete
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 100);
        }
      }
    } catch (error) {
      console.error('Failed to restore Excel data from localStorage:', error);
    }
  }, []);
  
  // Batch confirmation dialog state
  const [showBatchConfirmation, setShowBatchConfirmation] = useState<boolean>(false);
  const [nextBatchStartIndex, setNextBatchStartIndex] = useState<number>(0);

  // Analytics will be loaded only when user starts research, not on mount

  // Auto-save disabled - removed per user request

  // Check authentication on mount and when tokens change
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let mounted = true;

    const checkAuth = async () => {
      // Quick check: if already authenticated, skip
      if (isAuthenticated === true && !authLoading) {
        return;
      }

      if (!mounted) return;

      setAuthLoading(true);
      try {
        const result = await validateAuthenticationAsync();
        if (!mounted) return;

        if (result.isAuthenticated) {
          setIsAuthenticated(true);
          setShowAuthGate(false);
          // Stop checking once authenticated
          if (interval) {
            clearInterval(interval);
            interval = null;
          }
        } else {
          setIsAuthenticated(false);
          setShowAuthGate(true);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        if (!mounted) return;
        setIsAuthenticated(false);
        setShowAuthGate(true);
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    };

    // Initial check
    checkAuth();

    // Check URL params for tokens (login redirect)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token') || urlParams.get('refreshToken')) {
      // Wait a bit for LoginRedirectHandler to save tokens
      setTimeout(() => {
        checkAuth();
      }, 500);
    }

    // Also check when tokens might have been saved (e.g., after login redirect)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'salescentri_token' || e.key === 'salescentri_refreshToken') {
        checkAuth();
      }
    };

    // Custom event listener for same-tab token changes
    const handleTokenChange = () => {
      checkAuth();
    };

    // Listen for storage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    // Listen for custom event (same-tab)
    window.addEventListener('auth:tokenChanged', handleTokenChange);

    // Check periodically for token changes (same-tab) - only if not authenticated
    if (!isAuthenticated) {
      interval = setInterval(() => {
        // Check if tokens exist before making API call
        const { getTokens } = require('../../lib/auth');
        const tokens = getTokens();
        if (tokens) {
          checkAuth();
        }
      }, 1500); // Check every 1.5 seconds when not authenticated
    }

    // Also check after delays to catch login redirects
    const timeout1 = setTimeout(() => {
      checkAuth();
    }, 500);
    const timeout2 = setTimeout(() => {
      checkAuth();
    }, 2000);

    return () => {
      mounted = false;
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:tokenChanged', handleTokenChange);
      if (interval) clearInterval(interval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []); // Run once on mount

  // Handle initial query and mode from URL parameters
  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      
      // If it's ResearchGPT mode, check for pre-loaded results first
      if (initialMode === 'researchgpt') {
        // Set market analysis configuration
        setCategory('market_analysis');
        setDepth('comprehensive');
        
        // Set visible models to only Gemini for ResearchGPT mode
        setVisibleModels({
          gpt4o: false,
          gemini: true,
          perplexity: false,
          claude: false,
          llama: false,
          grok: false,
          deepseek: false,
          qwen3: false,
          mistralLarge: false
        });
        
        // Check for pre-loaded research results
        if (chatId) {
          const storedResults = localStorage.getItem('researchResults');
          if (storedResults) {
            try {
              const results = JSON.parse(storedResults);
              if (results.chatId === chatId && results.results) {
                console.log('Loading pre-stored research results for ResearchGPT mode');
                setResults(results.results);
                setLoading(false);
                return; // Don't trigger new research
              }
            } catch (error) {
              console.error('Error parsing stored research results:', error);
            }
          }
        }
        
        // If no pre-loaded results, trigger research after a short delay
        setTimeout(() => {
          handleResearch();
        }, 100);
      }
    }
  }, [initialQuery, initialMode, setQuery, setCategory, setDepth, chatId]);

  // Check for login success indicators in URL
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const loginSuccess = urlParams.get('login_success');
      const hasPreservedData = localStorage.getItem('salescentri_research_preserved_data');
      
      if (loginSuccess === 'true' && hasPreservedData) {
        // Show a message that data will be restored
        setStatus({
          message: 'Login successful! Restoring your previous data...',
          type: 'success',
          visible: true
        });
      }
    }
  }, []);

  // Calculate batches when Excel data is loaded
  useEffect(() => {
    if (excelData.length > 0) {
      setIsBatchResearch(true);
      const batches = Math.ceil(excelData.length / batchSize);
      setTotalBatches(batches);
      setCurrentBatchIndex(0);
      
      // Set first batch data
      const firstBatchData = excelData.slice(0, batchSize);
      setCurrentBatchData(firstBatchData);
      
      console.log(`📊 Excel data loaded: ${excelData.length} rows, split into ${batches} batches of ${batchSize} rows`);
    } else {
      setIsBatchResearch(false);
      setTotalBatches(0);
      setCurrentBatchIndex(0);
      setCurrentBatchData([]);
    }
  }, [excelData, batchSize]);

  // Memoize expensive calculations
  const memoizedAnalyticsSummary = useMemo(() => {
    if (!analyticsSummary) return null;
    return analyticsSummary;
  }, [analyticsSummary]);

  // Memoize visible models array for performance
  const visibleModelsArray = useMemo(() => {
    return Object.keys(visibleModels).filter(key => visibleModels[key as keyof typeof visibleModels]);
  }, [visibleModels]);

  // Handler for file upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // Reset processed count when new file is uploaded
      setProcessedCompanyCount(0);
      // File processing logic will be handled by FileUpload component
    }
  }, [setUploadedFile]);

  // Show lead generation modal when results are ready
  useEffect(() => {
    // Check if results exist (at least one model has results)
    const hasResults = results.gpt4o || results.gemini || results.perplexity || 
                       results.claude || results.llama || results.grok || 
                       results.deepseek || results.qwen3 || results.mistralLarge;
    
    // Show modal when:
    // 1. Research is complete (not loading)
    // 2. Results exist
    // 3. Modal hasn't been shown for this research session
    if (!loading && hasResults && !leadGenModalShown) {
      // Small delay to ensure results are fully rendered
      const timer = setTimeout(() => {
        setShowLeadGenModal(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, results, leadGenModalShown]);

  // Reset lead modal state when new research starts
  useEffect(() => {
    if (loading) {
      setLeadGenModalShown(false);
      setShowLeadGenModal(false);
    }
  }, [loading]);
  
  // Create all research handlers
  const handlers = useMemo(() => createResearchHandlers({
    query, setQuery, category, setCategory, depth, setDepth,
    timeframe, geoScope, websiteUrl, setWebsiteUrl, websiteUrl2, setWebsiteUrl2,
    uploadedFile, setUploadedFile, excelData, setExcelData,
    companySize, setCompanySize, revenueCategory, setRevenueCategory,
    focusOnLeads, setFocusOnLeads, displayedFileName, setDisplayedFileName,
    loading, setLoading, error, setError, results, setResults,
    loadingStates, setLoadingStates, visibleModels, setVisibleModels,
    chatHistory, setChatHistory, currentSessionId, setCurrentSessionId,
    perplexityModel, setPerplexityModel, modelDowngraded, setModelDowngraded,
    requestedModel, setRequestedModel, usingWebSearch, setUsingWebSearch,
    webSearchEnabled, perplexityBudget, setPerplexityBudget,
    saveSuccess, setSaveSuccess, successMessage, setSuccessMessage,
    showStatus, loadAnalyticsSummary, trackCustomEvent,
    currentBatchIndex, totalBatches, setShowContinueButton,
    bulkResearchResults, setBulkResearchResults,
    processedCompanyCount, setProcessedCompanyCount,
    companiesToProcess, setCompaniesToProcess,
    isProcessingBulk, setIsProcessingBulk,
    currentProcessingIndex, setCurrentProcessingIndex,
    bulkProcessingPaused, setBulkProcessingPaused,
    setShowBatchConfirmation, setNextBatchStartIndex,
    analysisType, setAnalysisType,
    multiGPTOutputFormat, setMultiGPTOutputFormat
  }), [
    query, setQuery, category, setCategory, depth, setDepth,
    timeframe, geoScope, websiteUrl, setWebsiteUrl, websiteUrl2, setWebsiteUrl2,
    uploadedFile, setUploadedFile, excelData, setExcelData,
    companySize, setCompanySize, revenueCategory, setRevenueCategory,
    focusOnLeads, setFocusOnLeads, displayedFileName, setDisplayedFileName,
    loading, setLoading, error, setError, results, setResults,
    loadingStates, setLoadingStates, visibleModels, setVisibleModels,
    chatHistory, setChatHistory, currentSessionId, setCurrentSessionId,
    perplexityModel, setPerplexityModel, modelDowngraded, setModelDowngraded,
    requestedModel, setRequestedModel, usingWebSearch, setUsingWebSearch,
    webSearchEnabled, perplexityBudget, setPerplexityBudget,
    saveSuccess, setSaveSuccess, successMessage, setSuccessMessage,
    showStatus, loadAnalyticsSummary, trackCustomEvent,
    currentBatchIndex, totalBatches, setShowContinueButton,
    bulkResearchResults, setBulkResearchResults,
    processedCompanyCount, setProcessedCompanyCount,
    companiesToProcess, setCompaniesToProcess,
    isProcessingBulk, setIsProcessingBulk,
    currentProcessingIndex, setCurrentProcessingIndex,
    bulkProcessingPaused, setBulkProcessingPaused,
    setShowBatchConfirmation, setNextBatchStartIndex,
    analysisType, setAnalysisType,
    multiGPTOutputFormat, setMultiGPTOutputFormat
  ]);

  const { 
    handleResearch, 
    handleIncrementalBulkResearch,
    saveConfiguration, 
    newResearch, 
    loadHistoryEntry, 
    deleteHistoryEntry 
  } = handlers;

  // Reset bulk research state when new file is uploaded (using ref to track previous length)
  const prevExcelDataLengthRef = React.useRef<number>(excelData.length);
  useEffect(() => {
    // Only reset if excelData length changed, we're not currently processing, and we're not restoring from localStorage
    if (excelData.length !== prevExcelDataLengthRef.current && !isProcessingBulk && !isRestoringRef.current) {
      console.log('🔄 New Excel file detected, resetting processing state');
      setBulkResearchResults({});
      setProcessedCompanyCount(0);
      setCurrentProcessingIndex(0);
      setIsProcessingBulk(false);
      prevExcelDataLengthRef.current = excelData.length;
    } else if (isRestoringRef.current) {
      console.log('📂 Skipping reset - restoring from localStorage');
      prevExcelDataLengthRef.current = excelData.length;
    }
  }, [excelData.length, isProcessingBulk, setBulkResearchResults, setProcessedCompanyCount, setCurrentProcessingIndex, setIsProcessingBulk]);

  // Initialize companiesToProcess when Excel data is loaded (default to BATCH_SIZE)
  useEffect(() => {
    if (excelData.length > 1 && companiesToProcess === 0) {
      const remaining = excelData.length - processedCompanyCount;
      setCompaniesToProcess(Math.min(BATCH_SIZE, remaining));
    }
  }, [excelData.length, companiesToProcess, setCompaniesToProcess]);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (showBatchConfirmation || showBatchInstructionsModal) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scrolling when modal is closed
      document.body.style.overflow = '';
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [showBatchConfirmation, showBatchInstructionsModal]);

  // Handler to start bulk processing
  const handleStartBulkProcessing = useCallback(() => {
    // Check if Excel data needs to be restored from localStorage
    let currentExcelData = excelData;
    if (excelData.length === 0) {
      try {
        const savedExcelData = localStorage.getItem('bulkResearch_excelData');
        if (savedExcelData) {
          const parsed = JSON.parse(savedExcelData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentExcelData = parsed;
            setExcelData(parsed);
            console.log('📂 Restored Excel data from localStorage for batch processing:', parsed.length);
          }
        }
      } catch (error) {
        console.error('Failed to restore Excel data:', error);
      }
    }
    
    if (currentExcelData.length === 0) {
      showStatus('No Excel data found. Please upload a file.', 'warning');
      return;
    }
    
    const startIndex = processedCompanyCount;
    const remaining = currentExcelData.length - processedCompanyCount;
    
    console.log('🚀 handleStartBulkProcessing called:', {
      companiesToProcess,
      processedCompanyCount,
      totalCompanies: currentExcelData.length,
      remaining,
      startIndex
    });
    
    if (remaining <= 0) {
      showStatus('All companies have been processed', 'info');
      return;
    }
    
    // Reset cancellation flag when starting new research
    cancellationRef.current = false;
    setIsCancelled(false);
    
    const count = Math.min(BATCH_SIZE, remaining);
    const endRow = startIndex + count;
    
    // Reset companiesToProcess to the batch size for next iteration
    setCompaniesToProcess(count);
    
    console.log('📦 Batch started: processing rows', (startIndex + 1), '-', endRow, 'of', currentExcelData.length);
    console.log('📊 Batch calculation:', { startIndex, count, remaining, BATCH_SIZE });

    handleIncrementalBulkResearch(startIndex, count, bulkResearchResults, cancellationRef);
  }, [companiesToProcess, processedCompanyCount, excelData, setExcelData, setCompaniesToProcess, bulkResearchResults, handleIncrementalBulkResearch, showStatus]);

  // Handler to resume bulk processing
  const handleResumeBulkProcessing = useCallback(() => {
    // Restore Excel data if needed
    let currentExcelData = excelData;
    if (excelData.length === 0) {
      try {
        const savedExcelData = localStorage.getItem('bulkResearch_excelData');
        if (savedExcelData) {
          const parsed = JSON.parse(savedExcelData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentExcelData = parsed;
            setExcelData(parsed);
            console.log('📂 Restored Excel data for resume:', parsed.length);
          }
        }
      } catch (error) {
        console.error('Failed to restore Excel data:', error);
      }
    }
    
    const remaining = currentExcelData.length - processedCompanyCount;
    if (remaining <= 0) {
      showStatus('All companies have been processed', 'info');
      return;
    }

    // Reset cancellation flag when resuming
    cancellationRef.current = false;
    setIsCancelled(false);

    const count = Math.min(BATCH_SIZE, remaining);
    const endRow = processedCompanyCount + count;
    console.log('🔄 Resuming batch: rows', (processedCompanyCount + 1), '-', endRow, 'of', currentExcelData.length);
    handleIncrementalBulkResearch(processedCompanyCount, count, bulkResearchResults, cancellationRef);
  }, [processedCompanyCount, excelData, setExcelData, companiesToProcess, bulkResearchResults, handleIncrementalBulkResearch, showStatus]);

  // Handler to cancel ongoing research
  const handleCancelResearch = useCallback(() => {
    cancellationRef.current = true;
    setIsCancelled(true);
    setLoading(false);
    setIsProcessingBulk(false);
    setLoadingStates({ gpt4o: false, gemini: false, perplexity: false, claude: false, llama: false, grok: false, deepseek: false, qwen3: false, mistralLarge: false });
    showStatus('Research cancelled by user', 'info');
    console.log('🛑 Research cancelled by user');
  }, [setLoadingStates, showStatus]);

  // Handler to confirm next batch processing
  const handleConfirmNextBatch = useCallback(() => {
    console.log('🎯 handleConfirmNextBatch called');
    console.log('📊 Current state:', {
      excelDataLength: excelData.length,
      processedCompanyCount,
      nextBatchStartIndex,
      bulkResearchResultsLength: bulkResearchResults.length
    });
    
    setShowBatchConfirmation(false);
    
    // Restore Excel data if needed
    let currentExcelData = excelData;
    if (excelData.length === 0) {
      console.log('⚠️ excelData is empty, attempting to restore from localStorage');
      try {
        const savedExcelData = localStorage.getItem('bulkResearch_excelData');
        console.log('📦 localStorage data exists:', !!savedExcelData);
        if (savedExcelData) {
          const parsed = JSON.parse(savedExcelData);
          console.log('📦 Parsed data:', {
            isArray: Array.isArray(parsed),
            length: parsed?.length
          });
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentExcelData = parsed;
            setExcelData(parsed);
            console.log('✅ Restored Excel data for next batch:', parsed.length, 'companies');
          }
        }
      } catch (error) {
        console.error('❌ Failed to restore Excel data:', error);
      }
    }
    
    const remaining = currentExcelData.length - processedCompanyCount;
    console.log('📈 Calculated remaining companies:', {
      totalInExcel: currentExcelData.length,
      processed: processedCompanyCount,
      remaining
    });
    
    if (remaining <= 0) {
      console.log('❌ No remaining companies to process');
      showStatus('All companies have been processed', 'info');
      return;
    }
    
    const count = Math.min(BATCH_SIZE, remaining);
    const endRow = nextBatchStartIndex + count;
    console.log('🚀 Starting next batch: rows', (nextBatchStartIndex + 1), '-', endRow, 'of', currentExcelData.length);
    console.log('📊 Batch details:', {
      startIndex: nextBatchStartIndex,
      count,
      BATCH_SIZE,
      willProcess: currentExcelData.slice(nextBatchStartIndex, nextBatchStartIndex + count).map((r: any) => r.companyName || r['Company Name'])
    });
    handleIncrementalBulkResearch(nextBatchStartIndex, count, bulkResearchResults, cancellationRef);
  }, [excelData, setExcelData, processedCompanyCount, nextBatchStartIndex, bulkResearchResults, handleIncrementalBulkResearch, showStatus]);

  // Handler to cancel next batch processing
  const handleCancelNextBatch = useCallback(() => {
    setShowBatchConfirmation(false);
    showStatus('Batch processing stopped. You can resume later.', 'info');
  }, [showStatus]);

  // Batch research handlers
  const handleContinueNextBatch = useCallback(async () => {
    if (currentBatchIndex >= totalBatches - 1) {
      showStatus('All batches have been processed', 'info');
      return;
    }

    const nextBatchIndex = currentBatchIndex + 1;
    const batchStartIdx = nextBatchIndex * batchSize;
    const batchEndIdx = Math.min(batchStartIdx + batchSize, excelData.length);
    const nextBatchData = excelData.slice(batchStartIdx, batchEndIdx);

    console.log(`🔄 Moving to batch ${nextBatchIndex + 1} of ${totalBatches}`);

    // Track batch continuation
    trackCustomEvent('excel_batch_continue_clicked', {
      sessionId,
      fromBatchIndex: currentBatchIndex,
      toBatchIndex: nextBatchIndex,
      totalBatches,
      query: query.substring(0, 100),
      category
    });

    setCurrentBatchIndex(nextBatchIndex);
    setCurrentBatchData(nextBatchData);
    setPreviousResults(results);
    setShowContinueButton(false);
    setResults({
      gpt4o: null,
      gemini: null,
      perplexity: null,
      claude: null,
      llama: null,
      grok: null,
      deepseek: null,
      qwen3: null,
      mistralLarge: null,
    });

    // Prepare for incremental research by setting isContinuation flag
    // This will be picked up by handleResearch
    setLoading(true);

    // Call research with isContinuation flag
    setTimeout(() => {
      handleResearch();
    }, 100);
  }, [
    currentBatchIndex, totalBatches, batchSize, excelData,
    sessionId, query, category, results, showStatus, trackCustomEvent,
    setCurrentBatchIndex, setCurrentBatchData, setPreviousResults,
    setShowContinueButton, setResults, setLoading, handleResearch
  ]);

  const handleOpenBatchInstructionsModal = useCallback(() => {
    setShowBatchInstructionsModal(true);
  }, []);

  const handleApplyBatchInstructions = useCallback(() => {
    if (batchInstructions.trim()) {
      setShowBatchInstructionsModal(false);
      // Instructions will be merged in the API call
      showStatus('Batch instructions saved. Apply to next batch research.', 'success');
    }
  }, [batchInstructions, showStatus]);
  
  // Handle ESC key and modal focus management
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showConfig) {
        setShowConfig(false);
      }
    };
    
    if (showConfig) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
      document.addEventListener('keydown', handleEscape);
      
      const modalContent = document.querySelector('[role="dialog"]') as HTMLElement;
      if (modalContent) {
        modalContent.focus();
      }
      
      if (modalBodyRef.current) {
        modalBodyRef.current.style.scrollBehavior = 'smooth';
        modalBodyRef.current.style.overflowY = 'auto';
        modalBodyRef.current.style.minHeight = '0';
        modalBodyRef.current.style.flex = '1';
        
        const checkScrollable = () => {
          if (modalBodyRef.current) {
            const isScrollable = modalBodyRef.current.scrollHeight > modalBodyRef.current.clientHeight;
            if (isScrollable) {
              modalBodyRef.current.classList.add('scrollable');
            } else {
              modalBodyRef.current.classList.remove('scrollable');
            }
          }
        };
        
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
        
        modalBodyRef.current.focus();
        
        return () => {
          window.removeEventListener('resize', checkScrollable);
        };
      }
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showConfig]);

  return (
      <>
        {/* Authentication Gate */}
        <MultiGPTGate
          isOpen={showAuthGate && !authLoading}
          onClose={() => {
            // Don't allow closing the gate - user must authenticate
            // If they close, redirect to login
            window.location.href = getLoginUrl(true);
          }}
        />

        {/* Show loading state while checking auth */}
        {authLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">Checking authentication...</p>
            </div>
          </div>
        )}

        {/* Main content - only show if authenticated */}
        {!authLoading && isAuthenticated && (
      <div className="relative min-h-screen overflow-x-hidden font-poppins bg-black"
           style={{
             background: 'radial-gradient(1200px 500px at 50% -10%, rgba(0, 170, 255, 0.12), transparent 60%), radial-gradient(900px 400px at 80% 10%, rgba(163, 93, 255, 0.10), transparent 60%), radial-gradient(700px 300px at 20% 20%, rgba(0, 255, 255, 0.08), transparent 60%), #000',
             WebkitFontSmoothing: 'antialiased',
             MozOsxFontSmoothing: 'grayscale',
             contain: 'layout style paint',
             willChange: 'auto'
           }}>
        {/* Time Counter */}
        <TimeCounter isRunning={loading} />

        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <LightRays
            raysOrigin="top-center"
            raysColor="#00ffff"
            raysSpeed={1.0}
            lightSpread={0.85}
            rayLength={1.1}
            followMouse={true}
            mouseInfluence={0.08}
            noiseAmount={0.08}
            distortion={0.04}
            className="rc-light-rays"
          />
        </div>

        {/* History Sidebar */}
        <HistorySidebar
          sidebarOpen={sidebarOpen}
          sidebarDocked={sidebarDocked}
          onClose={() => setSidebarOpen(!sidebarOpen)}
          onToggleDock={() => setSidebarDocked(!sidebarDocked)}
          chatHistory={chatHistory}
          currentSessionId={currentSessionId}
          onLoadHistoryEntry={loadHistoryEntry}
          onDeleteHistoryEntry={deleteHistoryEntry}
          onNewResearch={newResearch}
        />

        {/* Main Content */}
        <div className={`relative z-10 transition-all duration-300 ${sidebarDocked ? 'ml-0 lg:ml-80' : 'ml-0'}`}
             style={{
               contain: 'layout style paint',
               willChange: 'auto'
             }}>
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-1 sm:px-2 md:px-4 lg:px-6 pt-0 pb-4 sm:pb-6 w-full relative min-h-screen scroll-container"
               style={{
                 color: 'var(--research-text)',
                 scrollBehavior: 'auto',
                 overscrollBehaviorY: 'contain',
                 backfaceVisibility: 'hidden',
                 perspective: '1000px',
                 contain: 'layout style paint',
                 willChange: 'auto'
               }}>


        {/* Production Loading Overlay */}
        {loading && (
          <ProductionLoader 
            isVisible={loading}
            message="Running multi-model analysis across GPT-4O, PSA GPT, and Perplexity"
            onCancel={handleCancelResearch}
          />
        )}
        
        {/* Status Notifications */}
        <StatusIndicator
          message={status.message}
          type={status.type}
          isVisible={status.visible}
          title="Status"
          onClose={() => setStatus({ ...status, visible: false })}
        />

        {/* Hero Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8 relative mt-8 sm:mt-12 md:mt-15">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent px-2">
            Multi GPT: Aggregated Research
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed text-gray-300 px-2 sm:px-4">
            Compare AI models side-by-side for comprehensive research analysis.
          </p>
        </div>

        {/* Analytics Summary - Hidden per user request */}
        {false && memoizedAnalyticsSummary && (
          <div className="research-glass rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 mb-4 sm:mb-6 md:mb-8"
               style={{ boxShadow: 'var(--research-shadow)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold flex items-center gap-1 sm:gap-2 m-0"
                  style={{ color: 'var(--research-text)' }}>
                <BarChart3 size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="hidden xs:inline">LLM Analytics Summary</span>
                <span className="xs:hidden">Analytics</span>
              </h3>
              <button
                onClick={() => loadAnalyticsSummary()}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-all duration-200 border-none hover:-translate-y-0.5"
                style={{
                  background: 'var(--research-primary)',
                  color: 'white',
                  minHeight: '32px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--research-primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--research-primary)';
                }}
              >
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              <div className="backdrop-blur-sm border rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-200 hover:-translate-y-1"
                   style={{
                     background: 'var(--research-muted)',
                     borderColor: 'var(--research-border)',
                     boxShadow: '0 4px 16px rgba(0, 170, 255, 0.1)'
                   }}>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 research-text-gradient">
                  {memoizedAnalyticsSummary.totalQueries}
                </div>
                <div className="text-xs font-medium"
                     style={{ color: 'var(--research-text-muted)' }}>
                  <span className="hidden sm:inline">Total Queries</span>
                  <span className="sm:hidden">Queries</span>
                </div>
              </div>
              <div className="backdrop-blur-sm border rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-200 hover:-translate-y-1"
                   style={{
                     background: 'var(--research-muted)',
                     borderColor: 'var(--research-border)',
                     boxShadow: '0 4px 16px rgba(0, 170, 255, 0.1)'
                   }}>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 research-text-gradient">
                  ${memoizedAnalyticsSummary.totalCost.toFixed(2)}
                </div>
                <div className="text-xs font-medium"
                     style={{ color: 'var(--research-text-muted)' }}>
                  <span className="hidden sm:inline">Total Cost</span>
                  <span className="sm:hidden">Cost</span>
                </div>
              </div>
              <div className="backdrop-blur-sm border rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-200 hover:-translate-y-1"
                   style={{
                     background: 'var(--research-muted)',
                     borderColor: 'var(--research-border)',
                     boxShadow: '0 4px 16px rgba(0, 170, 255, 0.1)'
                   }}>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 research-text-gradient">
                  {memoizedAnalyticsSummary.averageResponseTime.toFixed(1)}s
                </div>
                <div className="text-xs font-medium"
                     style={{ color: 'var(--research-text-muted)' }}>
                  <span className="hidden sm:inline">Avg Response</span>
                  <span className="sm:hidden">Avg Time</span>
                </div>
              </div>
              <div className="backdrop-blur-sm border rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-200 hover:-translate-y-1"
                   style={{
                     background: 'var(--research-muted)',
                     borderColor: 'var(--research-border)',
                     boxShadow: '0 4px 16px rgba(0, 170, 255, 0.1)'
                   }}>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 research-text-gradient">
                  {memoizedAnalyticsSummary.totalProviders}
                </div>
                <div className="text-xs font-medium"
                     style={{ color: 'var(--research-text-muted)' }}>
                  Providers
                </div>
              </div>
              <div className="backdrop-blur-sm border rounded-lg p-2 sm:p-3 md:p-4 transition-all duration-200 hover:-translate-y-1"
                   style={{
                     background: 'var(--research-muted)',
                     borderColor: 'var(--research-border)',
                     boxShadow: '0 4px 16px rgba(0, 170, 255, 0.1)'
                   }}>
                <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-1 research-text-gradient">
                  {memoizedAnalyticsSummary.totalModels}
                </div>
                <div className="text-xs font-medium"
                     style={{ color: 'var(--research-text-muted)' }}>
                  Models
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Input Section */}
        <ResearchInputSection
          query={query}
          setQuery={setQuery}
          websiteUrl={websiteUrl}
          setWebsiteUrl={setWebsiteUrl}
          websiteUrl2={websiteUrl2}
          setWebsiteUrl2={setWebsiteUrl2}
          uploadedFile={uploadedFile}
          displayedFileName={displayedFileName}
          excelData={excelData}
          loading={loading}
          showConfig={showConfig}
          setShowConfig={setShowConfig}
          onResearch={handleResearch}
          onFileUpload={handleFileUpload}
          onSetWebsiteUrl2={setWebsiteUrl2}
          onSetExcelData={setExcelDataWithReset}
          onSetError={setError}
          companiesToProcess={companiesToProcess}
          setCompaniesToProcess={setCompaniesToProcess}
          onStartBulkProcessing={handleStartBulkProcessing}
          isProcessingBulk={isProcessingBulk}
          processedCompanyCount={processedCompanyCount}
        />
        
        {/* Configuration Modal */}
            <ConfigurationModal
              showConfig={showConfig}
              onClose={() => setShowConfig(false)}
              category={category}
              setCategory={setCategory}
              depth={depth}
              setDepth={setDepth}
              companySize={companySize}
              setCompanySize={setCompanySize}
              revenueCategory={revenueCategory}
              setRevenueCategory={setRevenueCategory}
              focusOnLeads={focusOnLeads}
              setFocusOnLeads={setFocusOnLeads}
              visibleModels={visibleModels}
              setVisibleModels={setVisibleModels}
              analysisType={analysisType}
              setAnalysisType={setAnalysisType}
              multiGPTOutputFormat={multiGPTOutputFormat}
              setMultiGPTOutputFormat={setMultiGPTOutputFormat}
              onSaveConfiguration={saveConfiguration}
              saveSuccess={saveSuccess}
              successMessage={successMessage}
              modalBodyRef={modalBodyRef}
            />
        
        {/* Lead Generation Modal Prompt */}
        <LeadModalPrompt
          showModal={showLeadGenModal}
          onClose={() => {
            setShowLeadGenModal(false);
            setLeadGenModalShown(true);
          }}
        />
        
        {/* Bulk Research Progress and Results Grid Container */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full">
          {/* Main Content Area - Takes remaining space */}
          <div className="flex-1 min-w-0 w-full">
            {/* Multi-column comparison dashboard */}
            <ResearchResultsGrid
              visibleModels={visibleModels}
              results={results}
              loadingStates={loadingStates}
              query={query}
              category={category}
              websiteUrl={websiteUrl}
              websiteUrl2={websiteUrl2}
              usingWebSearch={usingWebSearch}
              requestedModel={requestedModel}
              perplexityModel={perplexityModel}
              modelDowngraded={modelDowngraded}
              bulkResults={Object.keys(bulkResearchResults).length > 0 ? bulkResearchResults : undefined}
            />
          </div>

          {/* Bulk Research Progress - Sticky on right side (desktop), full width (mobile) */}
          {excelData.length > 1 && Object.keys(bulkResearchResults).length > 0 && (
            <BulkResearchProgress
              totalCompanies={excelData.length}
              processedCount={processedCompanyCount}
              currentIndex={currentProcessingIndex}
              isProcessing={isProcessingBulk}
              bulkResults={bulkResearchResults}
              onResume={handleResumeBulkProcessing}
            />
          )}
        </div>

        {/* Batch Progress Display */}
        {isBatchResearch && totalBatches > 0 && (
          <div className="mt-6 p-4 rounded-lg border" style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.3)'
          }}>
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-blue-400">
                Batch {currentBatchIndex + 1} of {totalBatches}
              </div>
              <div className="text-sm text-gray-400">
                {excelData.length} rows total
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentBatchIndex + 1) / totalBatches) * 100}%`
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Batch Results Section - Show results first */}
        {isBatchResearch && totalBatches > 0 && !loading && (
          <div className="mt-4 p-4 rounded-lg border border-green-500/30 bg-green-500/5">
            <div className="font-semibold text-green-400 mb-2">
              ✅ Batch {currentBatchIndex + 1} Analysis Complete
            </div>
            <p className="text-sm text-gray-300">
              Results are displayed in the columns above. Review the analysis before continuing to the next batch.
            </p>
          </div>
        )}

        {/* Batch Actions */}
        {isBatchResearch && totalBatches > 0 && !loading && currentBatchIndex < totalBatches - 1 && Object.values(results).some(r => r) && (
          <div className="mt-4 flex gap-3">
            <button
              onClick={handleContinueNextBatch}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold"
            >
              ➜ Continue with Batch {currentBatchIndex + 2}
            </button>
            <button
              onClick={handleOpenBatchInstructionsModal}
              className="px-4 py-3 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-400/10 transition-all duration-200 font-semibold"
            >
              ⚙ Add Instructions
            </button>
          </div>
        )}

        {/* Bulk Research Continue Button - Show after batch completion when more companies remain */}
        {excelData.length > 0 && !isProcessingBulk && !loading && processedCompanyCount > 0 && processedCompanyCount < excelData.length && Object.keys(bulkResearchResults).length > 0 && (
          <div className="mt-6 p-4 rounded-lg border bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-white flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  Batch Complete
                </h3>
                <p className="text-sm text-gray-300">
                  Processed <span className="font-bold text-blue-400">{processedCompanyCount}</span> of <span className="font-bold text-purple-400">{excelData.length}</span> companies.
                  <span className="ml-2 text-yellow-400 font-semibold">{excelData.length - processedCompanyCount} remaining</span>
                </p>
              </div>
              <button
                onClick={handleStartBulkProcessing}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
              >
                ➜ Continue Next Batch
              </button>
            </div>
          </div>
        )}

        {/* Last Batch Completion Message */}
        {isBatchResearch && totalBatches > 0 && !loading && currentBatchIndex === totalBatches - 1 && Object.values(results).some(r => r) && (
          <div className="mt-4 p-4 rounded-lg border border-green-500 bg-green-500/10">
            <div className="font-semibold text-green-400">
              ✅ All Batches Complete!
            </div>
            <p className="text-sm text-gray-300 mt-2">
              You have successfully processed all {totalBatches} batches ({excelData.length} rows total). 
              All results are displayed above for review and export.
            </p>
          </div>
        )}

        {/* Batch Instructions Modal */}
        {showBatchInstructionsModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4 relative">
              <h3 className="text-lg font-semibold mb-4 text-white">Add Batch Instructions</h3>
              <textarea
                value={batchInstructions}
                onChange={(e) => setBatchInstructions(e.target.value)}
                placeholder="Add additional instructions for the next batch research..."
                className="w-full h-32 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowBatchInstructionsModal(false);
                    setBatchInstructions('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyBatchInstructions}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Confirmation Dialog */}
        {showBatchConfirmation && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6 max-w-md w-full mx-4 relative">
              <h3 className="text-lg font-semibold mb-2 text-white">Batch Complete</h3>
              <p className="text-sm text-gray-300 mb-4">
                Batch of 20 companies completed. {excelData.length - processedCompanyCount} companies remaining.
                Continue with next batch?
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleCancelNextBatch}
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmNextBatch}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                >
                  Continue Next Batch
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-lg border text-center font-medium"
               style={{
                 background: 'rgba(239, 68, 68, 0.1)',
                 borderColor: 'rgba(239, 68, 68, 0.3)',
                 color: 'var(--research-error)'
               }}>
            {error}
          </div>
        )}
        
            {/* Global Export Panel */}
            <GlobalExportPanel
              query={query}
              results={results}
              websiteUrl={websiteUrl}
              websiteUrl2={websiteUrl2}
              bulkResults={Object.keys(bulkResearchResults).length > 0 ? bulkResearchResults : undefined}
            />
            </div>
          </div>

  </div>
        )}
      </>
  );
};

export default ResearchComparison;
