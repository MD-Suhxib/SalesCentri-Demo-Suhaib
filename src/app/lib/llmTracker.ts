// LLM Usage and Cost Tracking System
// BaseChatModel import removed as it's unused

export interface LLMUsageMetrics {
  provider: 'openai' | 'gemini' | 'perplexity' | 'langchain_orchestrated';
  model: string;
  taskType: string;
  queryComplexity: 'low' | 'medium' | 'high';
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  responseTime: number;
  timestamp: string;
  chatId?: string;
  userId?: string;
  query: string;
  response: string;
  accuracy?: number;
  sources?: string[];
  webSearchUsed?: boolean;
  ragUsed?: boolean;
}

export interface LLMCostConfig {
  // OpenAI pricing (per 1M tokens)
  'gpt-4o': { input: 2.50, output: 10.00 };
  'gpt-4o-mini': { input: 0.15, output: 0.60 };
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 };
  // Gemini pricing (per 1M tokens)
  'gemini-2.0-flash': { input: 0.075, output: 0.30 };
  // Perplexity pricing (per 1M tokens)
  'llama-3.1-sonar': { input: 0.20, output: 0.20 };
  'llama-3.1-sonar-large': { input: 0.27, output: 0.27 };
  'sonar-deep-research': { input: 1.00, output: 3.00 };
}

export interface LLMAccuracyMetrics {
  queryId: string;
  provider: string;
  model: string;
  query: string;
  response: string;
  expectedResponse?: string;
  accuracy: number;
  relevance: number;
  completeness: number;
  factualCorrectness: number;
  timestamp: string;
  reviewer?: string;
  notes?: string;
}

export interface LLMAnalytics {
  totalQueries: number;
  totalCost: number;
  averageResponseTime: number;
  accuracyByProvider: Record<string, number>;
  costByProvider: Record<string, number>;
  usageByTaskType: Record<string, number>;
  tokenUsage: {
    totalInput: number;
    totalOutput: number;
    totalTokens: number;
  };
  topModels: Array<{
    model: string;
    usage: number;
    cost: number;
    accuracy: number;
  }>;
}

class LLMTracker {
  private costConfig: LLMCostConfig = {
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
    'gemini-2.0-flash': { input: 0.075, output: 0.30 },
    'llama-3.1-sonar': { input: 0.20, output: 0.20 },
    'llama-3.1-sonar-large': { input: 0.27, output: 0.27 },
    'sonar-deep-research': { input: 1.00, output: 3.00 }
  };

  private usageHistory: LLMUsageMetrics[] = [];
  private accuracyHistory: LLMAccuracyMetrics[] = [];

  /**
   * Track LLM usage and calculate costs
   */
  public trackLLMUsage(
    provider: 'openai' | 'gemini' | 'perplexity' | 'langchain_orchestrated',
    model: string,
    taskType: string,
    queryComplexity: 'low' | 'medium' | 'high',
    inputTokens: number,
    outputTokens: number,
    responseTime: number,
    query: string,
    response: string,
    options: {
      chatId?: string;
      userId?: string;
      sources?: string[];
      webSearchUsed?: boolean;
      ragUsed?: boolean;
    } = {}
  ): LLMUsageMetrics {
    const totalTokens = inputTokens + outputTokens;
    const cost = this.calculateCost(model, inputTokens, outputTokens);
    
    const metrics: LLMUsageMetrics = {
      provider,
      model,
      taskType,
      queryComplexity,
      inputTokens,
      outputTokens,
      totalTokens,
      cost,
      responseTime,
      timestamp: new Date().toISOString(),
      chatId: options.chatId,
      userId: options.userId,
      query: query.substring(0, 1000), // Truncate for storage
      response: response.substring(0, 2000), // Truncate for storage
      sources: options.sources,
      webSearchUsed: options.webSearchUsed,
      ragUsed: options.ragUsed
    };

    this.usageHistory.push(metrics);
    this.sendToAnalytics(metrics);
    
    return metrics;
  }

  /**
   * Track accuracy metrics for LLM responses
   */
  public trackAccuracy(
    queryId: string,
    provider: string,
    model: string,
    query: string,
    response: string,
    accuracy: number,
    options: {
      expectedResponse?: string;
      relevance?: number;
      completeness?: number;
      factualCorrectness?: number;
      reviewer?: string;
      notes?: string;
    } = {}
  ): LLMAccuracyMetrics {
    const accuracyMetrics: LLMAccuracyMetrics = {
      queryId,
      provider,
      model,
      query: query.substring(0, 1000),
      response: response.substring(0, 2000),
      expectedResponse: options.expectedResponse?.substring(0, 2000),
      accuracy,
      relevance: options.relevance || accuracy,
      completeness: options.completeness || accuracy,
      factualCorrectness: options.factualCorrectness || accuracy,
      timestamp: new Date().toISOString(),
      reviewer: options.reviewer,
      notes: options.notes
    };

    this.accuracyHistory.push(accuracyMetrics);
    this.sendAccuracyToAnalytics(accuracyMetrics);
    
    return accuracyMetrics;
  }

  /**
   * Calculate cost based on token usage
   */
  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = this.costConfig[model as keyof LLMCostConfig];
    if (!pricing) {
      console.warn(`No pricing found for model: ${model}`);
      return 0;
    }

    const inputCost = (inputTokens / 1000000) * pricing.input;
    const outputCost = (outputTokens / 1000000) * pricing.output;
    
    return Math.round((inputCost + outputCost) * 10000) / 10000; // Round to 4 decimal places
  }

  /**
   * Estimate token count from text (rough approximation)
   */
  public estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Get analytics summary
   */
  public getAnalytics(timeframe?: { start: Date; end: Date }): LLMAnalytics {
    let filteredHistory = this.usageHistory;
    
    if (timeframe) {
      filteredHistory = this.usageHistory.filter(usage => {
        const usageTime = new Date(usage.timestamp);
        return usageTime >= timeframe.start && usageTime <= timeframe.end;
      });
    }

    const totalQueries = filteredHistory.length;
    const totalCost = filteredHistory.reduce((sum, usage) => sum + usage.cost, 0);
    const averageResponseTime = filteredHistory.reduce((sum, usage) => sum + usage.responseTime, 0) / totalQueries || 0;

    // Group by provider
    const providerStats = filteredHistory.reduce((acc, usage) => {
      if (!acc[usage.provider]) {
        acc[usage.provider] = { cost: 0, accuracy: 0, count: 0 };
      }
      acc[usage.provider].cost += usage.cost;
      acc[usage.provider].count += 1;
      return acc;
    }, {});

    // Calculate accuracy by provider
    const accuracyByProvider = this.accuracyHistory.reduce((acc, accuracy) => {
      if (!acc[accuracy.provider]) {
        acc[accuracy.provider] = { total: 0, count: 0 };
      }
      acc[accuracy.provider].total += accuracy.accuracy;
      acc[accuracy.provider].count += 1;
      return acc;
    }, {});

    Object.keys(providerStats).forEach(provider => {
      const accuracy = accuracyByProvider[provider];
      providerStats[provider].accuracy = accuracy ? accuracy.total / accuracy.count : 0;
    });

    // Usage by task type
    const usageByTaskType = filteredHistory.reduce((acc, usage) => {
      acc[usage.taskType] = (acc[usage.taskType] || 0) + 1;
      return acc;
    }, {});

    // Token usage
    const tokenUsage = filteredHistory.reduce((acc, usage) => {
      acc.totalInput += usage.inputTokens;
      acc.totalOutput += usage.outputTokens;
      acc.totalTokens += usage.totalTokens;
      return acc;
    }, { totalInput: 0, totalOutput: 0, totalTokens: 0 });

    // Top models
    const modelStats = filteredHistory.reduce((acc, usage) => {
      if (!acc[usage.model]) {
        acc[usage.model] = { usage: 0, cost: 0, accuracy: 0, count: 0 };
      }
      acc[usage.model].usage += 1;
      acc[usage.model].cost += usage.cost;
      return acc;
  }, {});

    const topModels = Object.entries(modelStats)
      .map(([model, stats]) => ({
        model,
        usage: (stats as { usage: number; cost: number; accuracy: number; count: number }).usage,
        cost: (stats as { usage: number; cost: number; accuracy: number; count: number }).cost,
        accuracy: (stats as { usage: number; cost: number; accuracy: number; count: number }).accuracy
      }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 10);

    return {
      totalQueries,
      totalCost,
      averageResponseTime,
      accuracyByProvider: Object.fromEntries(
        Object.entries(providerStats).map(([provider, stats]) => [provider, (stats as { cost: number; accuracy: number; count: number }).accuracy])
      ),
      costByProvider: Object.fromEntries(
        Object.entries(providerStats).map(([provider, stats]) => [provider, (stats as { cost: number; accuracy: number; count: number }).cost])
      ),
      usageByTaskType,
      tokenUsage,
      topModels
    };
  }

  /**
   * Send usage metrics to analytics
   */
  private async sendToAnalytics(metrics: LLMUsageMetrics): Promise<void> {
    try {
      // Check if we're in browser environment
      if (typeof window !== 'undefined') {
        // Send to internal analytics
        await fetch('/api/tracker/llm-usage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metrics),
        });
      } else {
        // In server environment, we can't use relative URLs
        console.log('LLM usage metrics (server-side):', metrics);
      }
    } catch (error) {
      console.error('Failed to send LLM usage to analytics:', error);
    }
  }

  /**
   * Send accuracy metrics to analytics
   */
  private async sendAccuracyToAnalytics(metrics: LLMAccuracyMetrics): Promise<void> {
    try {
      await fetch('/api/tracker/llm-accuracy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      });
    } catch (error) {
      console.error('Failed to send LLM accuracy to analytics:', error);
    }
  }

  /**
   * Get usage history
   */
  public getUsageHistory(): LLMUsageMetrics[] {
    return [...this.usageHistory];
  }

  /**
   * Get accuracy history
   */
  public getAccuracyHistory(): LLMAccuracyMetrics[] {
    return [...this.accuracyHistory];
  }

  /**
   * Clear history (for testing)
   */
  public clearHistory(): void {
    this.usageHistory = [];
    this.accuracyHistory = [];
  }
}

// Export singleton instance
export const llmTracker = new LLMTracker();
export default llmTracker;
