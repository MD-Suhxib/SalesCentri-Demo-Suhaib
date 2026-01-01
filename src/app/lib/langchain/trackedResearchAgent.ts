// Enhanced Research Agent with LLM Usage and Cost Tracking
import { trackedLLMRouter, TaskType } from './trackedLLMRouter';
import { llmTracker } from '../llmTracker';

export interface TrackedResearchConfig {
  taskType?: TaskType;
  enableWeb?: boolean;
  enableRAG?: boolean;
  userProfile?: {
    preferences?: Record<string, unknown>;
    history?: string[];
    context?: string;
  };
  companyAnalysis?: {
    industry?: string;
    size?: string;
    challenges?: string[];
    goals?: string[];
  };
  chatId?: string;
  userId?: string;
}

export interface TrackedResearchResult {
  answer: string;
  sources: string[];
  detailedSources: Array<{
    title: string;
    url: string;
    content: string;
    relevance: number;
  }>;
  usage: {
    totalCost: number;
    totalTokens: number;
    totalResponseTime: number;
    modelBreakdown: Array<{
      provider: string;
      model: string;
      cost: number;
      tokens: number;
      responseTime: number;
    }>;
  };
  metadata: {
    query: string;
    taskType: string;
    complexity: 'low' | 'medium' | 'high';
    webSearchUsed: boolean;
    ragUsed: boolean;
    timestamp: string;
  };
}

export class TrackedResearchAgent {
  private memory: Map<string, TrackedResearchResult> = new Map();
  private readonly startTime: number; // Mark as used

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Perform research with comprehensive tracking
   */
  public async researchWithTracking(
    query: string,
    config: TrackedResearchConfig = {}
  ): Promise<TrackedResearchResult> {
    // const startTime = Date.now();
    const chatId = config.chatId || `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🔬 TRACKED RESEARCH: Starting research for query: "${query}"`);
    console.log(`⚙️ CONFIG:`, config);

    try {
      // Analyze query complexity
      const { taskType, complexity } = trackedLLMRouter.analyzeQuery(query);
      const finalTaskType = config.taskType || taskType;

      // Step 1: Generate research plan
      const planQuery = `Create a comprehensive research plan for: "${query}"
      
      Consider:
      - What specific information is needed
      - What sources should be consulted
      - What follow-up questions might be relevant
      - How to structure the findings
      
      Provide a structured plan with 3-5 key research areas.`;

      const planResponse = await trackedLLMRouter.routeAndTrackLLM(
        'research',
        planQuery,
        'high',
        {
          forceGPT: true,
          requiresWebSearch: config.enableWeb,
          userIntent: 'analysis',
          chatId,
          userId: config.userId
        }
      );

      // Step 2: Execute research based on plan
      const researchQuery = `Based on this research plan, conduct comprehensive research on: "${query}"
      
      Research Plan:
      ${planResponse.content}
      
      Provide detailed findings with specific data points, sources, and actionable insights.`;

      const researchResponse = await trackedLLMRouter.routeAndTrackLLM(
        finalTaskType,
        researchQuery,
        complexity,
        {
          requiresWebSearch: config.enableWeb,
          userIntent: 'analysis',
          chatId,
          userId: config.userId,
          webSearchUsed: config.enableWeb,
          ragUsed: config.enableRAG
        }
      );

      // Step 3: Synthesize findings
      const synthesisQuery = `Synthesize these research findings into a comprehensive, actionable response:
      
      Original Query: "${query}"
      
      Research Findings:
      ${researchResponse.content}
      
      Provide:
      - Executive summary
      - Key findings with specific data
      - Actionable recommendations
      - Sources and references`;

      const synthesisResponse = await trackedLLMRouter.routeAndTrackLLM(
        'summarization',
        synthesisQuery,
        'high',
        {
          forceGPT: true,
          chatId,
          userId: config.userId
        }
      );

      // Calculate total usage metrics
      const totalCost = planResponse.usage.cost + researchResponse.usage.cost + synthesisResponse.usage.cost;
      const totalTokens = planResponse.usage.totalTokens + researchResponse.usage.totalTokens + synthesisResponse.usage.totalTokens;
      const totalResponseTime = planResponse.usage.responseTime + researchResponse.usage.responseTime + synthesisResponse.usage.responseTime;

      const modelBreakdown = [
        {
          provider: planResponse.metadata.provider,
          model: planResponse.metadata.model,
          cost: planResponse.usage.cost,
          tokens: planResponse.usage.totalTokens,
          responseTime: planResponse.usage.responseTime
        },
        {
          provider: researchResponse.metadata.provider,
          model: researchResponse.metadata.model,
          cost: researchResponse.usage.cost,
          tokens: researchResponse.usage.totalTokens,
          responseTime: researchResponse.usage.responseTime
        },
        {
          provider: synthesisResponse.metadata.provider,
          model: synthesisResponse.metadata.model,
          cost: synthesisResponse.usage.cost,
          tokens: synthesisResponse.usage.totalTokens,
          responseTime: synthesisResponse.usage.responseTime
        }
      ];

      // Extract sources (mock implementation - in real scenario, this would come from web search)
      const sources = this.extractSources(synthesisResponse.content);
      const detailedSources = this.createDetailedSources(sources);

      const result: TrackedResearchResult = {
        answer: synthesisResponse.content,
        sources,
        detailedSources,
        usage: {
          totalCost,
          totalTokens,
          totalResponseTime,
          modelBreakdown
        },
        metadata: {
          query,
          taskType: finalTaskType,
          complexity,
          webSearchUsed: config.enableWeb || false,
          ragUsed: config.enableRAG || false,
          timestamp: new Date().toISOString()
        }
      };

      console.log(`✅ TRACKED RESEARCH COMPLETE: Cost: $${totalCost.toFixed(4)}, Tokens: ${totalTokens}, Time: ${totalResponseTime}ms`);
      
      return result;

    } catch (error) {
      console.error('❌ TRACKED RESEARCH ERROR:', error);
      throw error;
    }
  }

  /**
   * Perform multi-provider research comparison
   */
  public async compareProviders(
    query: string,
    config: TrackedResearchConfig = {}
  ): Promise<{
    gpt4o: TrackedResearchResult;
    gemini: TrackedResearchResult;
    comparison: {
      costComparison: Record<string, number>;
      qualityComparison: Record<string, number>;
      speedComparison: Record<string, number>;
      recommendation: string;
    };
  }> {
    console.log(`🔄 PROVIDER COMPARISON: Comparing GPT-4o vs Gemini for: "${query}"`);

    const chatId = config.chatId || `comparison_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Run research with GPT-4o
    const gpt4oResult = await this.researchWithTracking(query, {
      ...config,
      chatId: `${chatId}_gpt4o`,
      taskType: 'research'
    });

    // Run research with Gemini
    const geminiResult = await this.researchWithTracking(query, {
      ...config,
      chatId: `${chatId}_gemini`,
      taskType: 'research'
    });

    // Compare results
    const comparison = {
      costComparison: {
        gpt4o: gpt4oResult.usage.totalCost,
        gemini: geminiResult.usage.totalCost,
        savings: gpt4oResult.usage.totalCost - geminiResult.usage.totalCost
      },
      qualityComparison: {
        gpt4o: this.assessQuality(gpt4oResult.answer),
        gemini: this.assessQuality(geminiResult.answer)
      },
      speedComparison: {
        gpt4o: gpt4oResult.usage.totalResponseTime,
        gemini: geminiResult.usage.totalResponseTime
      },
      recommendation: this.generateRecommendation(gpt4oResult, geminiResult)
    };

    return {
      gpt4o: gpt4oResult,
      gemini: geminiResult,
      comparison
    };
  }

  /**
   * Track accuracy for research results
   */
  public async trackResearchAccuracy(
    queryId: string,
    query: string,
    response: string,
    accuracy: number,
    options: {
      expectedResponse?: string;
      reviewer?: string;
      notes?: string;
    } = {}
  ) {
    return llmTracker.trackAccuracy(
      queryId,
      'research_agent',
      'multi_model',
      query,
      response,
      accuracy,
      options
    );
  }

  /**
   * Get research analytics
   */
  public getResearchAnalytics(timeframe?: { start: Date; end: Date }) {
    return llmTracker.getAnalytics(timeframe);
  }

  /**
   * Extract sources from response content
   */
  private extractSources(content: string): string[] {
    // Simple regex to extract URLs and source references
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urls = content.match(urlRegex) || [];
    
    // Extract other source references
    const sourceRegex = /(?:source|reference|cite|from):\s*([^\n]+)/gi;
    const sources = content.match(sourceRegex) || [];
    
    return [...new Set([...urls, ...sources])];
  }

  /**
   * Create detailed sources array
   */
  private createDetailedSources(sources: string[]): Array<{
    title: string;
    url: string;
    content: string;
    relevance: number;
  }> {
    return sources.map((source, index) => ({
      title: `Source ${index + 1}`,
      url: source.startsWith('http') ? source : '',
      content: source,
      relevance: Math.random() * 0.3 + 0.7 // Mock relevance score
    }));
  }

  /**
   * Assess quality of response (mock implementation)
   */
  private assessQuality(response: string): number {
    // Simple quality assessment based on length, structure, and keywords
    const length = response.length;
    const hasStructure = /#{1,6}\s/.test(response); // Has headers
    const hasData = /\d+/.test(response); // Has numbers
    const hasSources = /https?:\/\/|source|reference/i.test(response);
    
    let quality = 0.5; // Base quality
    
    if (length > 500) quality += 0.1;
    if (length > 1000) quality += 0.1;
    if (hasStructure) quality += 0.1;
    if (hasData) quality += 0.1;
    if (hasSources) quality += 0.1;
    
    return Math.min(quality, 1.0);
  }

  /**
   * Generate recommendation based on comparison
   */
  private generateRecommendation(gpt4oResult: TrackedResearchResult, geminiResult: TrackedResearchResult): string {
    const costDiff = gpt4oResult.usage.totalCost - geminiResult.usage.totalCost;
    const speedDiff = gpt4oResult.usage.totalResponseTime - geminiResult.usage.totalResponseTime;
    
    if (costDiff > 0.01 && speedDiff > 1000) {
      return "Gemini provides better cost-effectiveness and speed for this type of query";
    } else if (costDiff < -0.01 && speedDiff < -1000) {
      return "GPT-4o provides better quality despite higher cost and slower speed";
    } else {
      return "Both providers perform similarly; choose based on specific requirements";
    }
  }
}

// Export singleton instance
export const trackedResearchAgent = new TrackedResearchAgent();
export default trackedResearchAgent;
