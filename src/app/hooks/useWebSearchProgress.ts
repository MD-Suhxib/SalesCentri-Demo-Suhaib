// Hook for managing web search progress state
import { useState, useEffect, useCallback } from 'react';
import { WebSearchStep } from '../components/WebSearchProgress';
import { webSearchProgressParser } from '../lib/webSearchProgressParser';
import { progressEmitter } from '../lib/progressEmitter';
import { useSourceCycler, SearchSource } from './useSourceCycler';

export interface UseWebSearchProgressOptions {
  onComplete?: () => void;
  autoShow?: boolean;
}

export const useWebSearchProgress = (options: UseWebSearchProgressOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [steps, setSteps] = useState<WebSearchStep[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [discoveredSources, setDiscoveredSources] = useState<SearchSource[]>([]);

  const { onComplete, autoShow = true } = options;

  // Initialize source cycler
  const sourceCycler = useSourceCycler({
    cycleDuration: 1500, // 1.5 seconds per source
    autoStart: false
  });

  /**
   * Add a log message and convert it to a progress step
   */
  const addLogMessage = useCallback((logMessage: string) => {
    const step = webSearchProgressParser.parseLogMessage(logMessage);
    if (step) {
      setSteps(prev => [...prev, step]);
      
      // Check if this log message contains source information
      if (step.type === 'result' && step.data?.result) {
        const result = step.data.result;
        const source: SearchSource = {
          id: `source_${Date.now()}_${Math.random()}`,
          title: result.title || 'Unknown Source',
          url: result.url || '',
          domain: result.url ? new URL(result.url).hostname : 'unknown',
          description: result.content?.substring(0, 100) + '...' || ''
        };
        
        setDiscoveredSources(prev => [...prev, source]);
        sourceCycler.addSource(source);
      }
    }
  }, [sourceCycler]);

  // Subscribe to real-time progress events from backend
  useEffect(() => {
    // Enable the progress emitter when this hook is active
    progressEmitter.enable();

    const unsubscribe = progressEmitter.subscribe((event) => {
      if (event.type === 'log') {
        // Convert backend log messages to UI steps
        addLogMessage(event.message);
      } else if (event.type === 'sources' && event.data && Array.isArray(event.data)) {
        // Handle real-time sources from backend
        console.log('🎯 HOOK: Received sources event from backend:', event.data.length);
        const realSources = event.data.map((source: Record<string, unknown>, index: number) => ({
          id: `realtime_source_${index}`,
          title: source.title as string || '',
          url: source.url as string || '',
          domain: source.domain as string || '',
          description: (source.content as string) || (source.snippet as string) || ''
        }));
        
        console.log('🚀 HOOK: Replacing predicted sources with real-time sources:', realSources);
        sourceCycler.startCycling(realSources);
        setDiscoveredSources(realSources);
      } else if (event.type === 'result' && event.data && typeof event.data === 'object' && !Array.isArray(event.data)) {
        // Handle individual source discoveries (fallback)
        const sourceStep = webSearchProgressParser.createSourceStep(event.data);
        if (sourceStep) {
          setSteps(prev => [...prev, sourceStep]);
        }
      } else if (event.type === 'complete') {
        // Mark search as completed
        setIsSearching(false);
        sourceCycler.stopCycling();
        if (onComplete) {
          setTimeout(onComplete, 1500); // Delay to show completion
        }
      }
    });

    return () => {
      unsubscribe();
      progressEmitter.disable();
    };
  }, [addLogMessage, onComplete, sourceCycler]);

  /**
   * Start showing web search progress
   */
  const startProgress = useCallback((query: string) => {
    webSearchProgressParser.reset();
    const initialSteps = webSearchProgressParser.createTypicalSearchSteps(query);
    setSteps(initialSteps);
    setIsSearching(true);
    setDiscoveredSources([]);
    
    // Extract domain from query and create realistic sources to show immediately
    const domainMatch = query.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    const domain = domainMatch ? domainMatch[1] : 'company.com';
    
    // Create realistic sources that will likely be found
    const predictedSources: SearchSource[] = [
      {
        id: 'predicted_1',
        title: `${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} - Official Website`,
        url: `https://www.${domain}`,
        domain: domain,
        description: 'Official company website and information'
      },
      {
        id: 'predicted_2', 
        title: `${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} - LinkedIn`,
        url: `https://linkedin.com/company/${domain.split('.')[0]}`,
        domain: 'linkedin.com',
        description: 'Professional company profile and updates'
      },
      {
        id: 'predicted_3',
        title: `${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} - Crunchbase`,
        url: `https://crunchbase.com/organization/${domain.split('.')[0]}`,
        domain: 'crunchbase.com', 
        description: 'Company profile and funding information'
      },
      {
        id: 'predicted_4',
        title: `${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)} - ZoomInfo`,
        url: `https://zoominfo.com/c/${domain.split('.')[0]}`,
        domain: 'zoominfo.com',
        description: 'Business directory and company insights'
      },
      {
        id: 'predicted_5',
        title: `About - ${domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)}`,
        url: `https://www.${domain}/about`,
        domain: domain,
        description: 'Company about page and overview'
      }
    ];
    
    // Start cycling with predicted sources immediately
    sourceCycler.startCycling(predictedSources);
    
    if (autoShow) {
      setIsVisible(true);
    }
  }, [autoShow, sourceCycler]);

  /**
   * Add multiple log messages at once
   */
  const addLogMessages = useCallback((logMessages: string[]) => {
    const newSteps = webSearchProgressParser.parseLogMessages(logMessages);
    if (newSteps.length > 0) {
      setSteps(prev => [...prev, ...newSteps]);
    }
  }, []);

  /**
   * Complete the search progress
   */
  const completeProgress = useCallback(() => {
    setIsSearching(false);
    
    // Add a final success step if not already added
    const hasSuccessStep = steps.some(step => step.type === 'success');
    if (!hasSuccessStep) {
      const successStep: WebSearchStep = {
        id: `success_${Date.now()}`,
        type: 'success',
        message: '✅ Research completed successfully!',
        timestamp: Date.now(),
        data: { resultsCount: steps.filter(s => s.type === 'result').length }
      };
      setSteps(prev => [...prev, successStep]);
    }
  }, [steps]);

  /**
   * Hide the progress modal
   */
  const hideProgress = useCallback(() => {
    setIsVisible(false);
    sourceCycler.stopCycling();
    setTimeout(() => {
      setSteps([]);
      setIsSearching(false);
      setDiscoveredSources([]);
    }, 500); // Allow fade-out animation
  }, [sourceCycler]);

  /**
   * Handle progress completion
   */
  const handleComplete = useCallback(() => {
    onComplete?.();
    hideProgress();
  }, [onComplete, hideProgress]);

  /**
   * Simulate progress for demo/testing
   */
  const simulateProgress = useCallback((query: string = "example research query") => {
    startProgress(query);
    
    // Simulate typical log messages
    const simulatedLogs = [
      '🔬 RESEARCH CONFIG: Web=true, RAG=false, MaxResults=5, Type=research',
      '🌐 WEB SEARCH START: Searching for "' + query + '" (max 5 results)',
      '🔧 QUERY OPTIMIZATION: Simplified to "company overview services"',
      '🔍 SEARCH PROVIDER: Trying Tavily API',
      '✅ TAVILY SUCCESS: Found 5 results',
      '✅ WEB SEARCH SUCCESS: Found 5 web results'
    ];

    // Add simulated search results
    const simulatedResults = [
      {
        title: "Company Overview - Official Website",
        url: "https://example.com/about",
        content: "We are a leading technology company providing innovative solutions...",
        score: 0.95
      },
      {
        title: "Company Profile - Business Directory",
        url: "https://directory.com/company-profile",
        content: "Established in 2010, this company has grown to become a market leader...",
        score: 0.87
      },
      {
        title: "Recent News and Updates",
        url: "https://news.com/company-updates",
        content: "Latest developments and strategic initiatives from the company...",
        score: 0.73
      }
    ];

    simulatedLogs.forEach((log, index) => {
      setTimeout(() => {
        addLogMessage(log);
        
        // Add simulated results after provider step
        if (log.includes('SEARCH PROVIDER') && index < simulatedLogs.length - 1) {
          setTimeout(() => {
            simulatedResults.forEach((result, resultIndex) => {
              setTimeout(() => {
                const resultStep: WebSearchStep = {
                  id: `sim_result_${resultIndex}`,
                  type: 'result',
                  message: `📄 Found: ${result.title}`,
                  timestamp: Date.now(),
                  data: { result }
                };
                setSteps(prev => [...prev, resultStep]);
              }, resultIndex * 300);
            });
          }, 500);
        }
        
        // Complete on last log
        if (index === simulatedLogs.length - 1) {
          setTimeout(() => {
            completeProgress();
          }, 1500);
        }
      }, index * 800);
    });
  }, [startProgress, addLogMessage, completeProgress]);

  return {
    isVisible,
    steps,
    isSearching,
    startProgress,
    addLogMessage,
    addLogMessages,
    completeProgress,
    hideProgress,
    handleComplete,
    simulateProgress,
    showProgress: () => setIsVisible(true),
    // Convenience methods
    reset: () => {
      setSteps([]);
      setIsSearching(false);
      setIsVisible(false);
      setDiscoveredSources([]);
      sourceCycler.stopCycling();
    },
    // Source cycling methods
    sourceCycler,
    discoveredSources,
    currentSource: sourceCycler.currentSource
  };
};
