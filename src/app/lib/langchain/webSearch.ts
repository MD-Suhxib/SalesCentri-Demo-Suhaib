// Multi-Provider Web Search System
import { TavilySearch } from "@langchain/tavily";
import { progressEmitter } from "../progressEmitter";

export interface SearchResult {
  content: string;
  url: string;
  title?: string;
  snippet?: string;
}

interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

interface GenericSearchResult {
  title?: string;
  url?: string;
  link?: string;
  content?: string;
  snippet?: string;
  description?: string;
  score?: number;
}

interface TavilyResponse {
  results?: TavilySearchResult[];
}

interface SerpApiResult {
  title: string;
  link: string;
  snippet: string;
}

interface DuckDuckGoTopic {
  Text: string;
  FirstURL: string;
}

export class WebSearchService {
  private tavilySearch: TavilySearch | null = null;
  private tavilyAvailable: boolean = true;
  // Cooldown timestamp to avoid permanently disabling Tavily after transient failures
  private tavilyCooldownUntil: number | null = null;

  constructor() {
    // Initialize Tavily if API key is available
    if (process.env.TAVILY_API_KEY) {
      try {
        this.tavilySearch = new TavilySearch({
          maxResults: 10,
          topic: "general"
        });
        console.log('✅ TAVILY INIT: Tavily search initialized with correct package');
      } catch (error) {
        console.error('🚨 TAVILY INIT ERROR:', error);
        this.tavilyAvailable = false;
      }
    } else {
      console.warn('⚠️ TAVILY MISSING: No TAVILY_API_KEY found in environment');
      this.tavilyAvailable = false;
    }
  }

  /**
   * Perform web search with multiple provider fallbacks
   */
  public async search(query: string, maxResults: number = 5): Promise<SearchResult[]> {
    const searchStartMessage = `🌐 WEB SEARCH START: Searching for "${query}" (max ${maxResults} results)`;
    console.log(searchStartMessage);
    progressEmitter.emitLog(searchStartMessage);

    // Optimize search query - extract domain if it's a complex research query
    let optimizedQuery = query;
    const domainMatch = query.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    if (domainMatch && query.length > 100) {
      optimizedQuery = `${domainMatch[1]} company overview services`;
      const optimizationMessage = `🔧 QUERY OPTIMIZATION: Simplified to "${optimizedQuery}"`;
      console.log(optimizationMessage);
      progressEmitter.emitLog(optimizationMessage);
    }

    // Try Tavily first unless we're in cooldown
    const now = Date.now();
    const inCooldown = this.tavilyCooldownUntil !== null && now < this.tavilyCooldownUntil;
    if (this.tavilyAvailable && this.tavilySearch && !inCooldown) {
      try {
        const tavilyMessage = '🔍 SEARCH PROVIDER: Connecting to search API';
        console.log(tavilyMessage);
        progressEmitter.emitLog(tavilyMessage);
        
        const results = await this.tavilySearch.invoke({ query: optimizedQuery });
        const parsedResults = this.parseTavilyResults(results, maxResults);
        
        if (parsedResults.length > 0) {
          const successMessage = `✅ WEB SEARCH SUCCESS: Found ${parsedResults.length} relevant sources`;
          console.log(successMessage);
          progressEmitter.emitLog(successMessage);
          return parsedResults;
        } else {
          const emptyMessage = '⚠️ SEARCH EMPTY: No results returned';
          console.log(emptyMessage);
          progressEmitter.emitLog(emptyMessage);
        }
      } catch (error) {
        console.error('🚨 SEARCH ERROR:', error);
        progressEmitter.emitLog('🚨 SEARCH ERROR: Switching to backup search provider');
        // Put Tavily on a short cooldown instead of disabling permanently
        this.tavilyCooldownUntil = Date.now() + 60_000; // 60 seconds cooldown
      }
    }

    // Fallback to SerpAPI if available
    if (process.env.SERPAPI_API_KEY) {
      try {
        const serpMessage = '🔍 SEARCH PROVIDER: Trying SerpAPI fallback';
        console.log(serpMessage);
        progressEmitter.emitLog(serpMessage);
        
        const results = await this.searchWithSerpAPI(query, maxResults);
        if (results.length > 0) {
          const successMessage = `✅ SERPAPI SUCCESS: Found ${results.length} results`;
          console.log(successMessage);
          progressEmitter.emitLog(successMessage);
          return results;
        }
      } catch (error) {
        console.error('🚨 SERPAPI ERROR:', error);
        progressEmitter.emitLog('🚨 SERPAPI ERROR: Trying final backup provider');
      }
    }

    // Final fallback to DuckDuckGo (free, no API key required)
    try {
      const duckMessage = '🔍 SEARCH PROVIDER: Trying DuckDuckGo fallback (free)';
      console.log(duckMessage);
      progressEmitter.emitLog(duckMessage);
      
      const results = await this.searchWithDuckDuckGo(query, maxResults);
      if (results.length > 0) {
        const successMessage = `✅ DUCKDUCKGO SUCCESS: Found ${results.length} results`;
        console.log(successMessage);
        progressEmitter.emitLog(successMessage);
        return results;
      }
    } catch (error) {
      console.error('🚨 DUCKDUCKGO ERROR:', error);
      progressEmitter.emitLog('🚨 DUCKDUCKGO ERROR: All search providers failed');
    }

    // If all search methods fail, return mock data for development
    const mockMessage = '⚠️ ALL SEARCH FAILED: Returning mock development data';
    console.warn(mockMessage);
    progressEmitter.emitLog(mockMessage);
    return this.getMockSearchResults(query);
  }

  /**
   * Parse Tavily results into standard format
   */
  private parseTavilyResults(results: TavilyResponse, maxResults: number): SearchResult[] {
    try {
      const rawResponse = JSON.stringify(results, null, 2);
      console.log('🔍 SEARCH RAW RESPONSE:', rawResponse);
      
      // Emit raw response for frontend processing
      progressEmitter.emitLog(`🔍 SEARCH RAW RESPONSE: ${rawResponse}`);
      
      let parsedResults: GenericSearchResult[] = [];

      if (typeof results === 'string') {
        console.log('📄 SEARCH FORMAT: String response, parsing JSON');
        const parsed = JSON.parse(results);
        parsedResults = Array.isArray(parsed) ? parsed : parsed.results || [parsed];
      } else if (Array.isArray(results)) {
        console.log('📋 SEARCH FORMAT: Array response');
        parsedResults = results as TavilySearchResult[];
      } else if (results && typeof results === 'object') {
        console.log('📦 SEARCH FORMAT: Object response');
        // Search API returns { results: [...] } format
        if (results.results && Array.isArray(results.results)) {
          console.log('📋 SEARCH RESULTS: Found results array with', results.results.length, 'items');
          parsedResults = results.results;
        } else {
          console.log('📦 SEARCH SINGLE: Wrapping single result in array');
          parsedResults = [results as TavilySearchResult];
        }
      }

      console.log(`📊 SEARCH PARSED: ${parsedResults.length} results found`);
      
      const mappedResults = parsedResults.slice(0, maxResults).map((result: GenericSearchResult, index: number) => {
        const mapped = {
          content: result.content || result.snippet || result.description || '',
          url: result.url || result.link || 'N/A',
          title: result.title || '',
          snippet: result.snippet || result.content || ''
        };
        
        const logMessage = `📝 RESULT ${index + 1}: ${mapped.title} - ${mapped.url} (${mapped.content.length} chars)`;
        console.log(logMessage);
        
        // Emit individual source discovery for frontend slideshow - this happens DURING search
        const sourceData = {
          title: mapped.title,
          url: mapped.url,
          domain: this.extractDomain(mapped.url),
          content: mapped.content.substring(0, 200) + '...',
          score: this.calculateRelevanceScore(result),
          index: index + 1,
          total: Math.min(parsedResults.length, maxResults)
        };
        
        console.log('🚀 EMITTING SOURCE IN REAL-TIME:', sourceData.title, sourceData.domain);
        progressEmitter.emitResult('source-discovered', sourceData);
        
        return mapped;
      });

      return mappedResults;
    } catch (error) {
      console.error('🚨 SEARCH PARSE ERROR:', error);
      progressEmitter.emitLog('🚨 SEARCH PARSE ERROR: Failed to process search results');
      return [];
    }
  }

  /**
   * Extract domain from URL for display
   */
  private extractDomain(url: string): string {
    try {
      if (url === 'N/A' || !url) return 'Unknown';
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url.substring(0, 30) + '...';
    }
  }

  /**
   * Calculate relevance score for a search result
   */
  private calculateRelevanceScore(result: GenericSearchResult): number {
    // Use search API's score if available, otherwise calculate based on content quality
    if (result.score && typeof result.score === 'number') {
      return Math.round(result.score * 100);
    }
    
    // Fallback scoring based on content length and title quality
    const contentLength = (result.content || '').length;
    const hasGoodTitle = result.title && result.title.length > 10;
    const hasGoodContent = contentLength > 100;
    
    let score = 50; // Base score
    if (hasGoodTitle) score += 20;
    if (hasGoodContent) score += 20;
    if (contentLength > 500) score += 10;
    
    return Math.min(score, 95); // Cap at 95%
  }

  /**
   * Search using SerpAPI (Google Search API)
   */
  private async searchWithSerpAPI(query: string, maxResults: number): Promise<SearchResult[]> {
    const response = await fetch(`https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERPAPI_API_KEY}&num=${maxResults}`);
    
    if (!response.ok) {
      throw new Error(`SerpAPI error: ${response.status}`);
    }

    const data = await response.json();
    const organicResults = data.organic_results || [];

    return organicResults.map((result: SerpApiResult) => ({
      content: result.snippet || '',
      url: result.link || '',
      title: result.title || '',
      snippet: result.snippet || ''
    }));
  }

  /**
   * Search using DuckDuckGo (free, no API key required)
   */
  private async searchWithDuckDuckGo(query: string, maxResults: number): Promise<SearchResult[]> {
    // Using DuckDuckGo Instant Answer API (limited but free)
    const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`);
    
    if (!response.ok) {
      throw new Error(`DuckDuckGo error: ${response.status}`);
    }

    const data = await response.json();
    const results: SearchResult[] = [];

    // Add main result if available
    if (data.Abstract) {
      results.push({
        content: data.Abstract,
        url: data.AbstractURL || 'N/A',
        title: data.Heading || 'Main Result',
        snippet: data.Abstract
      });
    }

    // Add related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, maxResults - 1).forEach((topic: DuckDuckGoTopic) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            content: topic.Text,
            url: topic.FirstURL,
            title: 'Related Topic',
            snippet: topic.Text
          });
        }
      });
    }

    return results.slice(0, maxResults);
  }

  /**
   * Mock search results for development/testing
   */
  private getMockSearchResults(query: string): SearchResult[] {
    const domain = query.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/)?.[1] || 'example.com';
    
    return [
      {
        content: `${domain} is a technology company that provides various digital services and solutions. They focus on helping businesses improve their digital presence and operational efficiency.`,
        url: `https://${domain}`,
        title: `${domain} - Technology Services`,
        snippet: `${domain} offers comprehensive technology solutions for modern businesses.`
      },
      {
        content: `Company overview: ${domain} specializes in digital transformation, web development, and IT consulting services. They serve clients across multiple industries.`,
        url: `https://${domain}/about`,
        title: `About ${domain}`,
        snippet: `Learn more about ${domain}'s mission and services.`
      },
      {
        content: `Contact information and business details for ${domain}. Located in the technology sector, they provide B2B services and solutions.`,
        url: `https://${domain}/contact`,
        title: `Contact ${domain}`,
        snippet: `Get in touch with ${domain} for your business needs.`
      }
    ];
  }

  /**
   * Check if web search is available
   */
  public isAvailable(): boolean {
    return this.tavilyAvailable || 
           !!process.env.SERPAPI_API_KEY || 
           true; // DuckDuckGo is always available
  }
}

// Export singleton instance
export const webSearchService = new WebSearchService();
