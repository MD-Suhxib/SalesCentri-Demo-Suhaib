// Integration Example: How to use the Tracked LLM System
import { trackedLLMRouter, TaskType } from './trackedLLMRouter';
import { trackedResearchAgent } from './trackedResearchAgent';
import { llmTracker } from '../llmTracker';

/**
 * Example 1: Simple tracked LLM call
 */
export async function simpleTrackedCall() {
  const query = "What are the latest trends in AI for sales automation?";
  
  const result = await trackedLLMRouter.routeAndTrackLLM(
    'research',
    query,
    'medium',
    {
      requiresWebSearch: true,
      userIntent: 'analysis',
      chatId: 'example_chat_1',
      userId: 'user_123'
    }
  );

  console.log('Response:', result.content);
  console.log('Cost:', result.usage.cost);
  console.log('Tokens:', result.usage.totalTokens);
  console.log('Response Time:', result.usage.responseTime);

  return result;
}

/**
 * Example 2: Comprehensive research with tracking
 */
export async function comprehensiveResearch() {
  const query = "Analyze the competitive landscape for CRM software companies";
  
  const result = await trackedResearchAgent.researchWithTracking(query, {
    taskType: 'research',
    enableWeb: true,
    enableRAG: false,
    chatId: 'example_chat_2',
    userId: 'user_123'
  });

  console.log('Answer:', result.answer);
  console.log('Sources:', result.sources.length);
  console.log('Total Cost:', result.usage.totalCost);
  console.log('Model Breakdown:', result.usage.modelBreakdown);

  return result;
}

/**
 * Example 3: Provider comparison
 */
export async function compareProviders() {
  const query = "What are the key features of modern sales automation tools?";
  
  const comparison = await trackedResearchAgent.compareProviders(query, {
    enableWeb: true,
    chatId: 'example_chat_3',
    userId: 'user_123'
  });

  console.log('GPT-4o Cost:', comparison.gpt4o.usage.totalCost);
  console.log('Gemini Cost:', comparison.gemini.usage.totalCost);
  console.log('Recommendation:', comparison.comparison.recommendation);

  return comparison;
}

/**
 * Example 4: Track accuracy manually
 */
export async function trackAccuracy() {
  const queryId = 'example_query_123';
  const query = "What is the capital of France?";
  const response = "The capital of France is Paris.";
  
  const accuracyResult = await llmTracker.trackAccuracy(
    queryId,
    'openai',
    'gpt-4o',
    query,
    response,
    0.95, // 95% accuracy
    {
      expectedResponse: "Paris is the capital of France.",
      relevance: 0.98,
      completeness: 0.92,
      factualCorrectness: 1.0,
      reviewer: 'human_reviewer',
      notes: 'Correct factual information'
    }
  );

  console.log('Accuracy tracked:', accuracyResult);
  return accuracyResult;
}

/**
 * Example 5: Get analytics
 */
export async function getAnalytics() {
  // Get analytics for the last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  const analytics = llmTracker.getAnalytics({
    start: sevenDaysAgo,
    end: now
  });

  console.log('Total Queries:', analytics.totalQueries);
  console.log('Total Cost:', analytics.totalCost);
  console.log('Average Response Time:', analytics.averageResponseTime);
  console.log('Accuracy by Provider:', analytics.accuracyByProvider);

  return analytics;
}

/**
 * Example 6: Integration with existing research flow
 */
export async function integrateWithExistingFlow(
  originalQuery: string,
  userProfile: {
    preferences?: Record<string, unknown>;
    history?: string[];
    context?: string;
  },
  chatId: string
) {
  // Replace existing LLM calls with tracked versions
  // const { taskType } = trackedLLMRouter.analyzeQuery(originalQuery);
  
  // Use tracked research agent instead of regular research
  const result = await trackedResearchAgent.researchWithTracking(originalQuery, {
    taskType: 'research' as TaskType,
    enableWeb: true,
    enableRAG: false,
    userProfile,
    chatId,
    userId: 'anonymous'
  });

  // Track the interaction
  console.log(`Research completed for chat ${chatId}`);
  console.log(`Cost: $${result.usage.totalCost.toFixed(4)}, Tokens: ${result.usage.totalTokens}`);

  return {
    answer: result.answer,
    sources: result.sources,
    detailedSources: result.detailedSources,
    // Include usage metrics for monitoring
    usage: result.usage,
    metadata: result.metadata
  };
}

/**
 * Example 7: Batch processing with tracking
 */
export async function batchProcessWithTracking(queries: string[], userId: string) {
  const results = [];
  let totalCost = 0;
  let totalTokens = 0;

  for (const query of queries) {
    const result = await trackedLLMRouter.routeAndTrackLLM(
      'research',
      query,
      'medium',
      {
        chatId: `batch_${Date.now()}`,
        userId
      }
    );

    results.push({
      query,
      response: result.content,
      cost: result.usage.cost,
      tokens: result.usage.totalTokens
    });

    totalCost += result.usage.cost;
    totalTokens += result.usage.totalTokens;
  }

  console.log(`Batch processing complete: ${queries.length} queries, $${totalCost.toFixed(4)} total cost, ${totalTokens} total tokens`);

  return {
    results,
    summary: {
      totalQueries: queries.length,
      totalCost,
      totalTokens,
      averageCostPerQuery: totalCost / queries.length
    }
  };
}

// Export all examples for easy testing
export const examples = {
  simpleTrackedCall,
  comprehensiveResearch,
  compareProviders,
  trackAccuracy,
  getAnalytics,
  integrateWithExistingFlow,
  batchProcessWithTracking
};
