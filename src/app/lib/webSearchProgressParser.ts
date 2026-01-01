// Web Search Progress Parser - Converts backend logs to UI steps
import { WebSearchStep } from '../components/WebSearchProgress';

interface SearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

interface SearchResultsData {
  results: SearchResult[];
}

export class WebSearchProgressParser {
  private steps: WebSearchStep[] = [];
  private stepCounter = 0;

  /**
   * Parse a log message and convert it to a UI step
   */
  public parseLogMessage(logMessage: string): WebSearchStep | null {
    const timestamp = Date.now();
    const id = `step_${this.stepCounter++}`;

    // Research configuration
    if (logMessage.includes('RESEARCH CONFIG:')) {
      return {
        id,
        type: 'config',
        message: '⚙️ Configuring research parameters...',
        timestamp,
        data: {
          query: this.extractFromLog(logMessage, 'Web=true, RAG=false')
        }
      };
    }

    // Web search start
    if (logMessage.includes('WEB SEARCH START:')) {
      const query = this.extractQuery(logMessage);
      return {
        id,
        type: 'search',
        message: '🔍 Starting web search...',
        timestamp,
        data: { query }
      };
    }

    // Query optimization
    if (logMessage.includes('QUERY OPTIMIZATION:')) {
      const optimizedQuery = this.extractOptimizedQuery(logMessage);
      return {
        id,
        type: 'optimization',
        message: '🔧 Optimizing search query for better results',
        timestamp,
        data: { optimizedQuery }
      };
    }

    // Search provider
    if (logMessage.includes('SEARCH PROVIDER:')) {
      const provider = this.extractProvider(logMessage);
      return {
        id,
        type: 'provider',
        message: `🌐 Connecting to ${provider}...`,
        timestamp,
        data: { provider }
      };
    }

    // Search API results parsing
    if (logMessage.includes('SEARCH RAW RESPONSE:')) {
      try {
        const resultsData = this.extractTavilyResults(logMessage);
        if (resultsData.results && resultsData.results.length > 0) {
          // Create multiple steps for each result
          const resultSteps: WebSearchStep[] = [];
          
          resultsData.results.slice(0, 5).forEach((result: SearchResult, index: number) => {
            resultSteps.push({
              id: `${id}_result_${index}`,
              type: 'result',
              message: `📄 Found: ${result.title}`,
              timestamp: timestamp + (index * 100), // Stagger timestamps
              data: {
                result: {
                  title: result.title,
                  url: result.url,
                  content: result.content,
                  score: result.score
                }
              }
            });
          });

          return resultSteps[0]; // Return first result, others will be handled separately
        }
      } catch (error) {
        console.error('Error parsing search results:', error);
      }
      return null;
    }

    // Success message
    if (logMessage.includes('WEB SEARCH SUCCESS:') || logMessage.includes('SUCCESS:')) {
      const resultsCount = this.extractResultsCount(logMessage);
      return {
        id,
        type: 'success',
        message: `✅ Search completed! Found ${resultsCount} relevant sources`,
        timestamp,
        data: { resultsCount }
      };
    }

    return null;
  }

  /**
   * Parse multiple log messages and return all steps
   */
  public parseLogMessages(logMessages: string[]): WebSearchStep[] {
    const steps: WebSearchStep[] = [];
    
    for (const message of logMessages) {
      const step = this.parseLogMessage(message);
      if (step) {
        steps.push(step);
      }
    }

    // Add individual result steps if we found search API data
    const searchMessage = logMessages.find(msg => msg.includes('SEARCH RAW RESPONSE:'));
    if (searchMessage) {
      try {
        const resultsData = this.extractTavilyResults(searchMessage);
        if (resultsData.results && resultsData.results.length > 0) {
          resultsData.results.slice(0, 5).forEach((result: SearchResult, index: number) => {
            steps.push({
              id: `search_result_${index}`,
              type: 'result',
              message: `📄 Analyzing: ${result.title}`,
              timestamp: Date.now() + (index * 200),
              data: {
                result: {
                  title: result.title,
                  url: result.url,
                  content: result.content,
                  score: result.score
                }
              }
            });
          });
        }
      } catch (error) {
        console.error('Error parsing search results for steps:', error);
      }
    }

    return steps;
  }

  /**
   * Create steps from typical research flow
   */
  public createTypicalSearchSteps(query: string): WebSearchStep[] {
    const timestamp = Date.now();
    
    return [
      {
        id: 'step_0',
        type: 'config',
        message: '⚙️ Configuring research parameters...',
        timestamp,
        data: { query }
      },
      {
        id: 'step_1',
        type: 'search',
        message: '🔍 Starting comprehensive web search...',
        timestamp: timestamp + 500,
        data: { query }
      },
      {
        id: 'step_2',
        type: 'optimization',
        message: '🔧 Optimizing search query for better results',
        timestamp: timestamp + 1000,
        data: { 
          query,
          optimizedQuery: this.optimizeQuery(query)
        }
      },
      {
        id: 'step_3',
        type: 'provider',
        message: '🌐 Connecting to Search API...',
        timestamp: timestamp + 1500,
        data: { provider: 'Search API' }
      }
    ];
  }

  // Helper methods
  private extractFromLog(logMessage: string, pattern: string): string {
    const index = logMessage.indexOf(pattern);
    if (index !== -1) {
      return logMessage.substring(index);
    }
    return '';
  }

  private extractQuery(logMessage: string): string {
    const match = logMessage.match(/Searching for "([^"]+)"/);
    return match ? match[1] : '';
  }

  private extractOptimizedQuery(logMessage: string): string {
    const match = logMessage.match(/Simplified to "([^"]+)"/);
    return match ? match[1] : '';
  }

  private extractProvider(logMessage: string): string {
    const match = logMessage.match(/Trying (\w+)/);
    return match ? match[1] : 'Search API';
  }

  private extractResultsCount(logMessage: string): number {
    const match = logMessage.match(/Found (\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private extractTavilyResults(logMessage: string): SearchResultsData {
    try {
      // Extract the JSON part from the log message
      const jsonStart = logMessage.indexOf('{');
      if (jsonStart === -1) return { results: [] };
      
      const jsonStr = logMessage.substring(jsonStart);
      const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
      
      // Validate the structure
      if (parsed.results && Array.isArray(parsed.results)) {
        return { results: parsed.results as SearchResult[] };
      }
      
      return { results: [] };
    } catch (error) {
      console.error('Error parsing search JSON:', error);
      return { results: [] };
    }
  }

  private optimizeQuery(query: string): string {
    // Simple query optimization logic
    const companyMatch = query.match(/([a-zA-Z0-9.-]+\.com)/);
    if (companyMatch) {
      return `${companyMatch[1]} company overview services`;
    }
    
    // Remove common question words and optimize
    return query
      .replace(/^(can you |please |could you )/i, '')
      .replace(/\b(research about|tell me about|find out about)\b/gi, '')
      .replace(/\b(and|the|how|what|why|when|where)\b/gi, '')
      .trim()
      .substring(0, 50) + (query.length > 50 ? '...' : '');
  }

  /**
   * Create a source discovery step from backend data
   */
  public createSourceStep(sourceData: Record<string, unknown>): WebSearchStep | null {
    try {
      return {
        id: `source_${this.stepCounter++}`,
        type: 'result',
        message: `📄 Found: ${(sourceData.title as string) || (sourceData.domain as string)}`,
        timestamp: Date.now(),
        data: {
          result: {
            title: (sourceData.title as string) || 'Untitled Source',
            url: (sourceData.url as string) || '#',
            content: (sourceData.content as string) || '',
            score: (sourceData.score as number) || 75
          }
        }
      };
    } catch (error) {
      console.error('Error creating source step:', error);
      return null;
    }
  }

  public reset(): void {
    this.steps = [];
    this.stepCounter = 0;
  }
}

// Export singleton instance
export const webSearchProgressParser = new WebSearchProgressParser();
