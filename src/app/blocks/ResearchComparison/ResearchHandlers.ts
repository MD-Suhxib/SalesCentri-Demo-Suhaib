import type { Dispatch, SetStateAction, MutableRefObject } from 'react';
import React from 'react';
import { ResearchService } from './services/researchService';
import { 
  determinePerplexityModel, 
  shouldUseWebSearch,
  createConfigurationName 
} from './utils';
import type {
  ChatHistoryEntry,
  CompanySize,
  DepthLevel,
  LoadingStates,
  PerplexityBudget,
  ResearchCategory,
  ResearchResults,
  RevenueCategory,
  VisibleModels
} from './types';

export interface ResearchHandlersParams {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  category: ResearchCategory;
  setCategory: Dispatch<SetStateAction<ResearchCategory>>;
  depth: DepthLevel;
  setDepth: Dispatch<SetStateAction<DepthLevel>>;
  timeframe: string;
  geoScope: string;
  websiteUrl: string;
  setWebsiteUrl: Dispatch<SetStateAction<string>>;
  websiteUrl2: string;
  setWebsiteUrl2: Dispatch<SetStateAction<string>>;
  uploadedFile: File | null;
  setUploadedFile: Dispatch<SetStateAction<File | null>>;
  excelData: string[];
  setExcelData: Dispatch<SetStateAction<string[]>>;
  companySize: CompanySize;
  setCompanySize: Dispatch<SetStateAction<CompanySize>>;
  revenueCategory: RevenueCategory;
  setRevenueCategory: Dispatch<SetStateAction<RevenueCategory>>;
  focusOnLeads: boolean;
  setFocusOnLeads: Dispatch<SetStateAction<boolean>>;
  displayedFileName: string | null;
  setDisplayedFileName: Dispatch<SetStateAction<string | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
  results: ResearchResults;
  setResults: Dispatch<SetStateAction<ResearchResults>>;
  loadingStates: LoadingStates;
  setLoadingStates: Dispatch<SetStateAction<LoadingStates>>;
  visibleModels: VisibleModels;
  setVisibleModels: Dispatch<SetStateAction<VisibleModels>>;
  chatHistory: ChatHistoryEntry[];
  setChatHistory: Dispatch<SetStateAction<ChatHistoryEntry[]>>;
  currentSessionId: number | null;
  setCurrentSessionId: Dispatch<SetStateAction<number | null>>;
  perplexityModel: string;
  setPerplexityModel: Dispatch<SetStateAction<string>>;
  modelDowngraded: boolean;
  setModelDowngraded: Dispatch<SetStateAction<boolean>>;
  requestedModel: string;
  setRequestedModel: Dispatch<SetStateAction<string>>;
  usingWebSearch: boolean;
  setUsingWebSearch: Dispatch<SetStateAction<boolean>>;
  webSearchEnabled: boolean;
  perplexityBudget: PerplexityBudget;
  setPerplexityBudget: Dispatch<SetStateAction<PerplexityBudget>>;
  saveSuccess: boolean;
  setSaveSuccess: Dispatch<SetStateAction<boolean>>;
  successMessage: string;
  setSuccessMessage: Dispatch<SetStateAction<string>>;
  showStatus: (message: string, type: 'success' | 'warning' | 'error' | 'info') => void;
  loadAnalyticsSummary: () => Promise<void>;
  trackCustomEvent: (eventName: string, properties: Record<string, unknown>) => void;
  currentBatchIndex?: number;
  totalBatches?: number;
  setShowContinueButton?: Dispatch<SetStateAction<boolean>>;
  // Bulk research state
  bulkResearchResults?: { [website: string]: { companyName: string; results?: ResearchResults; error?: string; processedAt?: string; processingIndex?: number } };
  setBulkResearchResults?: Dispatch<SetStateAction<{ [website: string]: { companyName: string; results?: ResearchResults; error?: string; processedAt?: string; processingIndex?: number } }>>;
  processedCompanyCount?: number;
  setProcessedCompanyCount?: Dispatch<SetStateAction<number>>;
  companiesToProcess?: number;
  setCompaniesToProcess?: Dispatch<SetStateAction<number>>;
  isProcessingBulk?: boolean;
  setIsProcessingBulk?: Dispatch<SetStateAction<boolean>>;
  currentProcessingIndex?: number;
  setCurrentProcessingIndex?: Dispatch<SetStateAction<number>>;
  bulkProcessingPaused?: boolean;
  setBulkProcessingPaused?: Dispatch<SetStateAction<boolean>>;
  // Batch confirmation
  setShowBatchConfirmation?: Dispatch<SetStateAction<boolean>>;
  setNextBatchStartIndex?: Dispatch<SetStateAction<number>>;
  // Analysis Type for General Research
  analysisType?: 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused';
  setAnalysisType?: Dispatch<SetStateAction<'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused'>>;
  // Output format for multiGPTFocused mode
  multiGPTOutputFormat?: 'tableOnly' | 'withContext';
  setMultiGPTOutputFormat?: Dispatch<SetStateAction<'tableOnly' | 'withContext'>>;
}

export const createResearchHandlers = (params: ResearchHandlersParams) => {
  const {
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
    currentBatchIndex = 0,
    totalBatches = 0,
    setShowContinueButton,
    bulkResearchResults,
    setBulkResearchResults,
    processedCompanyCount,
    setProcessedCompanyCount,
    companiesToProcess,
    setCompaniesToProcess,
    isProcessingBulk,
    setIsProcessingBulk,
    currentProcessingIndex,
    setCurrentProcessingIndex,
    bulkProcessingPaused,
    setBulkProcessingPaused,
    setShowBatchConfirmation,
    setNextBatchStartIndex,
    analysisType = 'default',
    multiGPTOutputFormat = 'withContext'
  } = params;

  // Handler to trigger research
  const handleResearch = async () => {
    // Allow guest users to execute research - authentication check removed
    // Gate will be shown AFTER results are displayed
    const startTime = Date.now();

    // Track research start
    trackCustomEvent('research_started', {
      query: query.substring(0, 100),
      category,
      depth,
      selectedModels: Object.keys(visibleModels).filter(key => visibleModels[key as keyof typeof visibleModels]),
      webSearchEnabled,
      hasWebsite: !!websiteUrl,
      hasClientWebsite: !!websiteUrl2,
      hasExcelData: excelData.length > 0,
      companySize,
      revenueCategory,
      focusOnLeads
    });
    
    // Track batch research start if this is Excel batch research
    if (excelData.length > 0) {
      trackCustomEvent('excel_batch_research_started', {
        query: query.substring(0, 100),
        totalRows: excelData.length,
        category,
        depth,
        selectedModels: Object.keys(visibleModels).filter(key => visibleModels[key as keyof typeof visibleModels]),
        webSearchEnabled
      });
    }

    // Check if we have multiple websites from bulk upload
    // For bulk uploads, users should use the "Start Processing" button instead
    if (excelData.length > 1) {
      showStatus('Please use the "Start Processing" button to begin bulk research', 'info');
      return;
    }

    // Set loading state
    setLoading(true);
    setError(null);

    // Only set loading states for selected models
    setLoadingStates({
      gpt4o: visibleModels.gpt4o,
      gemini: visibleModels.gemini,
      perplexity: visibleModels.perplexity,
      claude: visibleModels.claude,
      llama: visibleModels.llama,
      grok: visibleModels.grok,
      deepseek: visibleModels.deepseek,
      qwen3: visibleModels.qwen3,
      mistralLarge: visibleModels.mistralLarge
    });
    
    // Check if web search should be used
    const shouldUseWebSearchResult = shouldUseWebSearch(
      webSearchEnabled,
      category,
      query,
      websiteUrl,
      websiteUrl2
    );

    console.log('🔍 Web search debug:', {
      webSearchEnabled,
      category,
      hasWebsiteUrl: !!websiteUrl,
      hasClientWebsite: !!websiteUrl2,
      querySnippet: query.substring(0, 100),
      shouldUseWebSearch: shouldUseWebSearchResult
    });

    if (shouldUseWebSearchResult) {
      setUsingWebSearch(true);
      console.log('✅ Web search enabled - unlimited usage');
    } else {
      setUsingWebSearch(false);
    }
    
    // Determine the appropriate Perplexity model
    const selectedPerplexityModel = determinePerplexityModel(category, depth, websiteUrl);
    setRequestedModel(selectedPerplexityModel);
    
    // Check if the selected model is allowed within budget constraints
    try {
      const { canUsePerplexityModel, getAvailablePerplexityModel } = await import('../../lib/perplexityUsageControl');
      
      if (!canUsePerplexityModel(selectedPerplexityModel)) {
        const availableModel = getAvailablePerplexityModel(selectedPerplexityModel);
        console.log(`Model ${selectedPerplexityModel} exceeds budget or is restricted, using ${availableModel} instead`);
        
        setModelDowngraded(true);
        setPerplexityModel(availableModel);
      } else {
        setModelDowngraded(false);
        setPerplexityModel(selectedPerplexityModel);
      }
    } catch (error) {
      console.error("Error checking Perplexity model availability:", error);
      setPerplexityModel(selectedPerplexityModel);
      setModelDowngraded(false);
    }
    
    console.log("Starting deep research with environment:", process.env.NODE_ENV);
    console.log(`Selected Perplexity model: ${perplexityModel} for ${category} research at ${depth} depth`);
    
    try {
      console.log('🚀 Starting research with payload:', { query, category, depth, visibleModels });
      
      const newResults = await ResearchService.handleSingleResearch(
        query, 
        category, 
        depth, 
        timeframe, 
        geoScope,
        websiteUrl,
        websiteUrl2,
        companySize,
        revenueCategory,
        focusOnLeads,
        webSearchEnabled,
        excelData,
        uploadedFile?.name || null,
        visibleModels,
        usingWebSearch,
        analysisType
      );
      
      console.log('✅ Research completed successfully:', newResults);
      setResults(newResults);
      showStatus('Research analysis completed successfully', 'success');

      // Save to chat history
      const historyEntry: ChatHistoryEntry = {
        id: typeof window !== 'undefined' ? Date.now() : Math.floor(Math.random() * 1000000),
        query,
        results: newResults,
        timestamp: typeof window !== 'undefined' ? new Date().toISOString() : new Date(Date.now()).toISOString(),
        websiteUrl,
        websiteUrl2,
        excelData,
        fileName: uploadedFile?.name || null,
        category,
        depth
      };
      const updatedHistory = [historyEntry, ...chatHistory].slice(0, 20);
      setChatHistory(updatedHistory);
      localStorage.setItem('researchBotHistory', JSON.stringify(updatedHistory));
      setCurrentSessionId(historyEntry.id);
    } catch (err) {
      console.error("Research error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      trackCustomEvent('research_error', {
        duration: Date.now() - startTime,
        error: errorMessage,
        category,
        depth,
        selectedModels: Object.keys(visibleModels).filter(key => visibleModels[key as keyof typeof visibleModels]),
        webSearchEnabled,
        hasWebsite: !!websiteUrl,
        hasClientWebsite: !!websiteUrl2,
        hasExcelData: excelData.length > 0
      });
      
      showStatus(`Research failed: ${errorMessage}`, 'error');
    } finally {
      console.log('🔄 Clearing loading states...');
      setLoading(false);
      setLoadingStates({ gpt4o: false, gemini: false, perplexity: false, claude: false, llama: false, grok: false, deepseek: false, qwen3: false, mistralLarge: false });
      console.log('✅ Loading states cleared');
      
      // Update Perplexity budget information after research
      try {
        import('../../lib/perplexityUsageControl').then(({ getBudgetInfo }) => {
          const budgetInfo = getBudgetInfo();
          setPerplexityBudget(budgetInfo);
        });
      } catch (error) {
        console.error("Failed to update Perplexity budget:", error);
      }
      
      // Track research completion
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      trackCustomEvent('research_completed', {
        duration,
        success: !error,
        modelsUsed: Object.keys(visibleModels).filter(key => visibleModels[key as keyof typeof visibleModels]),
        webSearchUsed: usingWebSearch,
        hasResults: Object.values(results).some(result => result && !result.startsWith('Error:')),
        category,
        depth,
        queryLength: query.length,
        hasWebsite: !!websiteUrl,
        hasClientWebsite: !!websiteUrl2,
        hasExcelData: excelData.length > 0
      });
      
      // Track batch research completion if this is Excel batch research
      if (excelData.length > 0) {
        trackCustomEvent('excel_batch_research_completed', {
          duration,
          success: !error,
          totalRows: excelData.length,
          modelsUsed: Object.keys(visibleModels).filter(key => visibleModels[key as keyof typeof visibleModels]),
          hasResults: Object.values(results).some(result => result && !result.startsWith('Error:')),
          category,
          depth,
          currentBatchIndex,
          totalBatches
        });
        
        // Show continue button if not the last batch and results exist
        const hasResults = Object.values(results).some(result => result && !result.startsWith('Error:'));
        if (hasResults && currentBatchIndex < totalBatches - 1 && setShowContinueButton) {
          console.log(`✅ Batch ${currentBatchIndex + 1} complete. Showing continue button for batch ${currentBatchIndex + 2}`);
          setShowContinueButton(true);
        }
      }
      
      // Refresh analytics after research completion
      loadAnalyticsSummary();
    }
  };

  // Function to handle incremental bulk research with real-time updates
  const handleIncrementalBulkResearch = async (
    startIndex: number,
    count: number,
    existingResults: { [website: string]: { companyName: string; results?: ResearchResults; error?: string; processedAt?: string; processingIndex?: number } },
    cancellationRef?: MutableRefObject<boolean>
  ) => {
    console.log('🚀 handleIncrementalBulkResearch called with:', {
      startIndex,
      count,
      analysisType,
      multiGPTOutputFormat,
      excelDataLength: excelData.length
    });
    
    if (!setBulkResearchResults || !setProcessedCompanyCount || !setIsProcessingBulk || !setCurrentProcessingIndex) {
      console.error('Bulk research state setters not available');
      return;
    }

    const startTime = Date.now();
    
    // Reset cancellation flag at start
    if (cancellationRef) {
      cancellationRef.current = false;
    }
    
    setIsProcessingBulk(true);
    setLoading(true);
    setError(null);
    setCurrentProcessingIndex(startIndex);

    // Merge existing results
    const currentResults = { ...existingResults };

    setLoadingStates({
      gpt4o: visibleModels.gpt4o,
      gemini: visibleModels.gemini,
      perplexity: visibleModels.perplexity,
      claude: visibleModels.claude,
      llama: visibleModels.llama,
      grok: visibleModels.grok,
      deepseek: visibleModels.deepseek,
      qwen3: visibleModels.qwen3,
      mistralLarge: visibleModels.mistralLarge
    });

    // Use passed cancellation ref or create a local one
    const cancelRef = cancellationRef || { current: false };
    
    try {
      const newResults = await ResearchService.handleIncrementalBulkResearch(
        excelData,
        startIndex,
        count,
        category,
        depth,
        timeframe,
        geoScope,
        companySize,
        revenueCategory,
        visibleModels,
        webSearchEnabled,
        determinePerplexityModel,
        query, // Pass user's research query
        analysisType, // Pass analysis type for multiGPTFocused mode
        multiGPTOutputFormat, // Pass output format for multiGPTFocused mode
        (index: number, website: string, result: { companyName: string; results?: ResearchResults; error?: string }) => {
          // Check if cancelled before updating
          if (cancelRef.current) {
            return;
          }
          // Update results immediately after each company completes
          currentResults[website] = {
            ...result,
            processedAt: new Date().toISOString(),
            processingIndex: index
          };
          
          // Update state to trigger UI re-render
          setBulkResearchResults({ ...currentResults });
          if (setProcessedCompanyCount) {
            // Calculate cumulative count: existing results + current batch results
            // Important: Only count results from THIS batch (currentResults), not existingResults
            // The total will be updated at the end of the batch processing
            const currentBatchCount = Object.keys(currentResults).length;
            // Update with cumulative total: startIndex (already processed) + current batch count
            setProcessedCompanyCount(startIndex + currentBatchCount);
          }
          if (setCurrentProcessingIndex) {
            setCurrentProcessingIndex(index + 1);
          }

          // Show status for each completion
          if (result.error) {
            showStatus(`Error processing ${result.companyName}: ${result.error}`, 'error');
          } else {
            showStatus(`Completed research for ${result.companyName} (${index + 1}/${excelData.length})`, 'success');
          }
        },
        cancelRef // Pass cancellation reference to service for backend cancellation
      );

      // Merge all results
      const finalResults = { ...currentResults, ...newResults };
      const totalProcessed = Object.keys(finalResults).length;
      setBulkResearchResults(finalResults);
      
      if (setProcessedCompanyCount) {
        setProcessedCompanyCount(totalProcessed);
      }

      trackCustomEvent('incremental_bulk_research_completed', {
        startIndex,
        count,
        totalProcessed: totalProcessed,
        totalWebsites: excelData.length,
        duration: Date.now() - startTime,
        category,
        depth
      });

      // Check if batch of 20 is complete and more companies remain
      const BATCH_SIZE = 20;
      const remainingCompanies = excelData.length - totalProcessed;
      const isBatchComplete = totalProcessed % BATCH_SIZE === 0;
      const processedRows = `${startIndex + 1}–${totalProcessed}`;
      
      console.log('✅ Batch completed: rows', processedRows, 'processed. Total:', totalProcessed, '/', excelData.length);
      console.log('🔍 Batch completion check:', {
        totalProcessed,
        BATCH_SIZE,
        isBatchComplete,
        remainingCompanies,
        hasSetShowBatchConfirmation: !!setShowBatchConfirmation,
        hasSetNextBatchStartIndex: !!setNextBatchStartIndex
      });
      
      if (isBatchComplete && remainingCompanies > 0 && setShowBatchConfirmation && setNextBatchStartIndex) {
        // Show confirmation dialog for next batch
        console.log('🎯 Showing batch confirmation modal');
        setNextBatchStartIndex(totalProcessed);
        setShowBatchConfirmation(true);
        showStatus(`Processing rows ${processedRows} completed. Remaining: ${remainingCompanies} companies.`, 'info');
      } else {
        console.log('ℹ️ Not showing batch confirmation:', {
          reason: !isBatchComplete ? 'Batch not complete' : 
                  remainingCompanies <= 0 ? 'No remaining companies' :
                  !setShowBatchConfirmation ? 'Missing setShowBatchConfirmation' :
                  !setNextBatchStartIndex ? 'Missing setNextBatchStartIndex' : 'Unknown'
        });
        showStatus(`Completed processing rows ${processedRows}. Total processed: ${totalProcessed}/${excelData.length}`, 'success');
      }

    } catch (error) {
      console.error('Incremental bulk research error:', error);
      // Don't show error if it was cancelled
      if (!cancelRef.current) {
        setError(`Failed to complete bulk research: ${(error as Error).message}`);
        showStatus(`Bulk research error: ${(error as Error).message}`, 'error');
      } else {
        console.log('🛑 Research was cancelled, skipping error display');
      }
    } finally {
      // Always clear loading states, even if cancelled
      console.log('🔄 Clearing loading states (cancelled:', cancelRef.current, ')');
      setIsProcessingBulk(false);
      setLoading(false);
      setLoadingStates({ gpt4o: false, gemini: false, perplexity: false, claude: false, llama: false, grok: false, deepseek: false, qwen3: false, mistralLarge: false });
      console.log('✅ Loading states cleared');
      
      // Update Perplexity budget information after research
      try {
        import('../../lib/perplexityUsageControl').then(({ getBudgetInfo }) => {
          const budgetInfo = getBudgetInfo();
          setPerplexityBudget(budgetInfo);
        });
      } catch (error) {
        console.error("Failed to update Perplexity budget:", error);
      }
      
      // Refresh analytics after research completion
      loadAnalyticsSummary();
    }
  };

  // Function to handle bulk research for all categories
  const handleBulkResearchForAllCategories = async () => {
    const startTime = Date.now();
    setLoading(true);
    setError(null);

    setLoadingStates({
      gpt4o: visibleModels.gpt4o,
      gemini: visibleModels.gemini,
      perplexity: visibleModels.perplexity,
      claude: visibleModels.claude,
      llama: visibleModels.llama,
      grok: visibleModels.grok,
      deepseek: visibleModels.deepseek,
      qwen3: visibleModels.qwen3,
      mistralLarge: visibleModels.mistralLarge
    });

    try {
      const bulkResults = await ResearchService.handleBulkResearchForAllCategories(
        excelData,
        category,
        depth,
        timeframe,
        geoScope,
        companySize,
        revenueCategory,
        visibleModels,
        webSearchEnabled,
        determinePerplexityModel
      );

      setResults(bulkResults);

      trackCustomEvent('bulk_research_completed', {
        totalWebsites: excelData.length,
        processedWebsites: excelData.length,
        duration: Date.now() - startTime,
        category,
        depth
      });

    } catch (error) {
      console.error('Bulk research error:', error);
      setError(`Failed to complete bulk research: ${(error as Error).message}`);
    } finally {
      console.log('🔄 Clearing bulk research loading states...');
      setLoading(false);
      setLoadingStates({ gpt4o: false, gemini: false, perplexity: false, claude: false, llama: false, grok: false, deepseek: false, qwen3: false, mistralLarge: false });
      console.log('✅ Bulk research loading states cleared');
    }
  };

  // Function to save current configuration
  const saveConfiguration = () => {
    const autoName = createConfigurationName(category, depth);
    
    const configuration = {
      name: autoName,
      category,
      depth,
      timeframe,
      geoScope,
      websiteUrl,
      websiteUrl2,
      companySize,
      revenueCategory,
      focusOnLeads,
      visibleModels,
      savedAt: typeof window !== 'undefined' ? new Date().toISOString() : new Date(Date.now()).toISOString()
    };
    
    localStorage.setItem('currentResearchConfig', JSON.stringify(configuration));
    
    setSaveSuccess(true);
    setSuccessMessage('Current configuration saved successfully!');
    showStatus('Current configuration saved successfully!', 'success');
    
    setTimeout(() => {
      setSaveSuccess(false);
      setSuccessMessage('');
    }, 3000);
  };

  // New Research function
  const newResearch = () => {
    setQuery('');
    setWebsiteUrl('');
    setWebsiteUrl2('');
    setUploadedFile(null);
    setExcelData([]);
    setDisplayedFileName(null);
    setResults({ gpt4o: null, gemini: null, perplexity: null, claude: null, llama: null, grok: null, deepseek: null, qwen3: null, mistralLarge: null });
    setCategory('market_analysis');
    setDepth('comprehensive');
    setCurrentSessionId(null);
    setError(null);
    
    // Clear localStorage bulk research data
    localStorage.removeItem('bulkResearch_excelData');
    localStorage.removeItem('bulkResearch_totalCompanies');
    localStorage.removeItem('bulkResearch_processedCount');
    console.log('🧹 Cleared localStorage bulk research data');
    
    // Reset bulk research state
    if (setBulkResearchResults) setBulkResearchResults({});
    if (setProcessedCompanyCount) setProcessedCompanyCount(0);
    if (setCompaniesToProcess) setCompaniesToProcess(0);
    
    showStatus('Started new research session', 'info');
  };

  // Load previous query from history
  const loadHistoryEntry = (entry: ChatHistoryEntry) => {
    setQuery(entry.query);
    setWebsiteUrl(entry.websiteUrl);
    setWebsiteUrl2(entry.websiteUrl2);
    setExcelData(entry.excelData);
    setDisplayedFileName(entry.fileName);
    setCategory(entry.category as any);
    setDepth(entry.depth as any);
    setResults(entry.results);
    setCurrentSessionId(entry.id);
    showStatus(`Loaded previous research: "${entry.query.substring(0, 50)}..."`, 'info');
  };

  // Delete history entry
  const deleteHistoryEntry = (id: number) => {
    const updatedHistory = chatHistory.filter(entry => entry.id !== id);
    setChatHistory(updatedHistory);
    localStorage.setItem('researchBotHistory', JSON.stringify(updatedHistory));
    if (currentSessionId === id) {
      setCurrentSessionId(null);
    }
    showStatus('Research session deleted', 'success');
  };

  return {
    handleResearch,
    handleBulkResearchForAllCategories,
    handleIncrementalBulkResearch,
    saveConfiguration,
    newResearch,
    loadHistoryEntry,
    deleteHistoryEntry
  };
};

