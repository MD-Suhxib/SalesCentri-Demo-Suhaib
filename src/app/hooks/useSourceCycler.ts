// Hook for cycling through search sources with timing
import { useState, useEffect, useCallback, useMemo } from 'react';

export interface SearchSource {
  id: string;
  title: string;
  url: string;
  domain: string;
  description?: string;
  favicon?: string;
}

export interface UseSourceCyclerOptions {
  cycleDuration?: number; // Duration in milliseconds to show each source
  sources?: SearchSource[];
  autoStart?: boolean;
}

export const useSourceCycler = (options: UseSourceCyclerOptions = {}) => {
  const { cycleDuration = 1500, sources = [], autoStart = true } = options;
  
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sourcesQueue, setSourcesQueue] = useState<SearchSource[]>(sources);

  // Default sources to cycle through when no real sources are available
  const defaultSources: SearchSource[] = useMemo(() => [
    {
      id: 'default_1',
      title: 'Company Website',
      url: 'https://company.com',
      domain: 'company.com',
      description: 'Official company website and information'
    },
    {
      id: 'default_2',
      title: 'Business Directory',
      url: 'https://directory.com',
      domain: 'directory.com',
      description: 'Business listings and company profiles'
    },
    {
      id: 'default_3',
      title: 'News Sources',
      url: 'https://news.com',
      domain: 'news.com',
      description: 'Latest news and press releases'
    },
    {
      id: 'default_4',
      title: 'Industry Reports',
      url: 'https://reports.com',
      domain: 'reports.com',
      description: 'Market analysis and industry insights'
    },
    {
      id: 'default_5',
      title: 'Social Media',
      url: 'https://social.com',
      domain: 'social.com',
      description: 'Social media presence and updates'
    }
  ], []);

  // Get current source to display
  const currentSource = sourcesQueue.length > 0 
    ? sourcesQueue[currentSourceIndex % sourcesQueue.length]
    : defaultSources[currentSourceIndex % defaultSources.length];

  // Start the cycling
  const startCycling = useCallback((newSources?: SearchSource[]) => {
    if (newSources && newSources.length > 0) {
      setSourcesQueue(newSources);
    } else if (sourcesQueue.length === 0) {
      setSourcesQueue(defaultSources);
    }
    setCurrentSourceIndex(0);
    setIsActive(true);
  }, [sourcesQueue.length, defaultSources]);

  // Stop the cycling
  const stopCycling = useCallback(() => {
    setIsActive(false);
  }, []);

  // Add a new source to the queue
  const addSource = useCallback((source: SearchSource) => {
    setSourcesQueue(prev => [...prev, source]);
  }, []);

  // Add multiple sources
  const addSources = useCallback((newSources: SearchSource[]) => {
    setSourcesQueue(prev => [...prev, ...newSources]);
  }, []);

  // Reset to default sources
  const resetToDefaults = useCallback(() => {
    setSourcesQueue(defaultSources);
    setCurrentSourceIndex(0);
  }, [defaultSources]);

  // Effect to handle automatic cycling
  useEffect(() => {
    if (!isActive) return;

    const activeSources = sourcesQueue.length > 0 ? sourcesQueue : defaultSources;
    if (activeSources.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSourceIndex(prev => (prev + 1) % activeSources.length);
    }, cycleDuration);

    return () => clearInterval(interval);
  }, [isActive, cycleDuration, sourcesQueue, defaultSources]);

  // Auto-start if specified
  useEffect(() => {
    if (autoStart && !isActive) {
      startCycling();
    }
  }, [autoStart, isActive, startCycling]);

  return {
    currentSource,
    currentSourceIndex,
    isActive,
    sourcesQueue,
    totalSources: sourcesQueue.length > 0 ? sourcesQueue.length : defaultSources.length,
    startCycling,
    stopCycling,
    addSource,
    addSources,
    resetToDefaults
  };
};
