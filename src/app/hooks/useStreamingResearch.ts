import { useState, useCallback } from 'react';
import { SearchSource } from './useSourceCycler';

interface WebSearchProgress {
  startProgress: (query: string) => void;
  hideProgress: () => void;
  addLogMessage?: (message: string) => void;
  sourceCycler?: {
    startCycling: (sources: SearchSource[]) => void;
  };
}

export interface StreamingResearchHook {
  isStreaming: boolean;
  sources: SearchSource[];
  result: string | null;
  error: string | null;
  startStreamingResearch: (query: string, webSearchProgress?: WebSearchProgress) => Promise<void>;
  stopStreaming: () => void;
}

export const useStreamingResearch = (): StreamingResearchHook => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const stopStreaming = useCallback(() => {
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }
    setIsStreaming(false);
  }, [eventSource]);

  const startStreamingResearch = useCallback(async (query: string, webSearchProgress?: WebSearchProgress) => {
    try {
      setIsStreaming(true);
      setSources([]);
      setResult(null);
      setError(null);

      // Start the web search progress UI if provided
      if (webSearchProgress) {
        webSearchProgress.startProgress(query);
      }

      // Stop any existing stream
      if (eventSource) {
        eventSource.close();
      }

      console.log('🚀 STREAMING: Starting research for:', query);

      // Start streaming via fetch + SSE
      const response = await fetch('/api/research/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('📡 STREAMING: Response status:', response.status, response.statusText);

      if (!response.ok) {
        console.error('📡 STREAMING: Response not OK:', response.status, response.statusText);
        throw new Error(`Failed to start streaming research: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body reader available');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('🏁 STREAMING: Research stream ended');
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                console.log('📡 STREAMING: Received data:', data.type, data.message);

                switch (data.type) {
                  case 'sources':
                    if (data.data && Array.isArray(data.data)) {
                      const streamingSources = data.data.map((source: Record<string, unknown>, index: number) => ({
                        id: `streaming_source_${index}`,
                        title: source.title as string || '',
                        url: source.url as string || '',
                        domain: source.domain as string || '',
                        description: (source.content as string) || (source.snippet as string) || ''
                      }));
                      
                      console.log('🎯 STREAMING: Setting sources immediately:', streamingSources.length);
                      setSources(streamingSources);
                      
                      // Update web search progress UI with real sources
                      if (webSearchProgress && webSearchProgress.sourceCycler) {
                        console.log('🔄 STREAMING: Updating web search progress with real sources');
                        webSearchProgress.sourceCycler.startCycling(streamingSources);
                      }
                    }
                    break;
                  
                  case 'result':
                    console.log('✅ STREAMING: Received final result');
                    setResult(data.data as string);
                    
                    // Hide web search progress UI when result is ready
                    if (webSearchProgress) {
                      webSearchProgress.hideProgress();
                    }
                    break;
                  
                  case 'complete':
                    console.log('🏁 STREAMING: Research completed');
                    setIsStreaming(false);
                    break;
                  
                  case 'error':
                    console.error('❌ STREAMING: Error:', data.message);
                    setError(data.message as string);
                    setIsStreaming(false);
                    
                    // Hide web search progress UI on error
                    if (webSearchProgress) {
                      webSearchProgress.hideProgress();
                    }
                    break;
                  
                  case 'log':
                    console.log('📝 STREAMING: Log:', data.message);
                    
                    // Add log messages to web search progress UI
                    if (webSearchProgress && webSearchProgress.addLogMessage) {
                      webSearchProgress.addLogMessage(data.message as string);
                    }
                    break;
                }
              } catch (parseError) {
                console.error('Parse error:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

    } catch (err) {
      console.error('Streaming research error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsStreaming(false);
      
      // Hide web search progress UI on error
      if (webSearchProgress) {
        webSearchProgress.hideProgress();
      }
    }
  }, [eventSource]);

  return {
    isStreaming,
    sources,
    result,
    error,
    startStreamingResearch,
    stopStreaming
  };
};
