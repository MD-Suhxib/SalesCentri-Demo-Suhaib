// Enhanced LLM Router with Usage and Cost Tracking
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { HumanMessage } from "@langchain/core/messages";
import { llmTracker } from '../llmTracker';

export interface TrackedLLMConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  streaming?: boolean;
  forceGPT?: boolean;
  requiresWebSearch?: boolean;
  privacyLevel?: 'private' | 'public';
  userIntent?: 'analysis' | 'chat' | 'deep-info' | 'summary' | 'lead-gen' | 'company-info';
}

export type TaskType = 
  | 'research' 
  | 'company-analysis' 
  | 'lead-generation'
  | 'icp-development'
  | 'simple-chat'
  | 'summarization'
  | 'fast-response';

export interface TrackedLLMResponse {
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    cost: number;
    responseTime: number;
  };
  metadata: {
    provider: string;
    model: string;
    taskType: string;
    queryComplexity: 'low' | 'medium' | 'high';
    timestamp: string;
  };
}

export class TrackedLLMRouter {
  private openaiModels: Record<string, ChatOpenAI> = {};
  private geminiModels: Record<string, ChatGoogleGenerativeAI> = {};

  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    // OpenAI Models for different research tasks
    this.openaiModels = {
      'research': new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.3,
        maxTokens: 16000,
        streaming: true
      }),
      'deep-research': new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.2,
        maxTokens: 16000,
        streaming: true
      }),
      'company-analysis': new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.4,
        maxTokens: 12000,
        streaming: true
      }),
      'lead-generation': new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.3,
        maxTokens: 16000,
        streaming: true
      }),
      'summarization': new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.1,
        maxTokens: 12000,
        streaming: false
      }),
      'fast': new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.7,
        maxTokens: 4000,
        streaming: true
      })
    };

    // Gemini Models for simple tasks and chat
    this.geminiModels = {
      'simple-chat': new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.7,
        maxOutputTokens: 8000
      }),
      'icp-development': new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.5,
        maxOutputTokens: 12000
      }),
      'fast-response': new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.8,
        maxOutputTokens: 4000
      })
    };
  }

  /**
   * Enhanced router with tracking capabilities
   */
  public async routeAndTrackLLM(
    taskType: TaskType,
    query: string,
    queryComplexity?: 'low' | 'medium' | 'high',
    options?: {
      forceGPT?: boolean;
      requiresWebSearch?: boolean;
      privacyLevel?: 'private' | 'public';
      userIntent?: 'analysis' | 'chat' | 'deep-info' | 'summary' | 'lead-gen' | 'company-info';
      chatId?: string;
      userId?: string;
      sources?: string[];
      webSearchUsed?: boolean;
      ragUsed?: boolean;
    }
  ): Promise<TrackedLLMResponse> {
    const startTime = Date.now();
    
    // Route to appropriate model
    const model = this.routeLLM(taskType, queryComplexity, options);
    const provider = this.getProviderFromModel(model);
    const modelName = this.getModelName(model);
    
    console.log(`🤖 TRACKED LLM ROUTER: Using ${provider}/${modelName} for ${taskType}`);
    
    try {
      // Execute the LLM call
      const messages = [new HumanMessage(query)];
      const response = await model.invoke(messages);
      
      const responseTime = Date.now() - startTime;
      const content = response.content as string;
      
      // Estimate token usage
      const inputTokens = llmTracker.estimateTokens(query);
      const outputTokens = llmTracker.estimateTokens(content);
      
      // Track usage
      const usageMetrics = llmTracker.trackLLMUsage(
        provider,
        modelName,
        taskType,
        queryComplexity || 'medium',
        inputTokens,
        outputTokens,
        responseTime,
        query,
        content,
        {
          chatId: options?.chatId,
          userId: options?.userId,
          sources: options?.sources,
          webSearchUsed: options?.webSearchUsed,
          ragUsed: options?.ragUsed
        }
      );
      
      return {
        content,
        usage: {
          inputTokens: usageMetrics.inputTokens,
          outputTokens: usageMetrics.outputTokens,
          totalTokens: usageMetrics.totalTokens,
          cost: usageMetrics.cost,
          responseTime: usageMetrics.responseTime
        },
        metadata: {
          provider: usageMetrics.provider,
          model: usageMetrics.model,
          taskType: usageMetrics.taskType,
          queryComplexity: usageMetrics.queryComplexity,
          timestamp: usageMetrics.timestamp
        }
      };
      
    } catch (error) {
      console.error(`❌ LLM Error (${provider}/${modelName}):`, error);
      throw error;
    }
  }

  /**
   * Route to appropriate model (same logic as original router)
   */
  private routeLLM(
    taskType: TaskType,
    queryComplexity?: 'low' | 'medium' | 'high',
    options?: {
      forceGPT?: boolean;
      requiresWebSearch?: boolean;
      privacyLevel?: 'private' | 'public';
      userIntent?: 'analysis' | 'chat' | 'deep-info' | 'summary' | 'lead-gen' | 'company-info';
    }
  ): BaseChatModel {
    console.log(`🤖 LLM ROUTER: Routing request - Task: ${taskType}, Complexity: ${queryComplexity || 'unspecified'}`);
    if (options) console.log('🔧 Routing options:', options);

    // Force GPT usage if requested
    if (options?.forceGPT) {
      if (queryComplexity === 'high' || options.userIntent === 'deep-info' || options.userIntent === 'analysis') {
        console.log('🧠 MODEL SELECTION: Forced GPT-4o (deep-research)');
        return this.openaiModels['deep-research'];
      }
      if (taskType === 'summarization' || options.userIntent === 'summary') {
        console.log('📝 MODEL SELECTION: Forced GPT-4o-mini for summarization');
        return this.openaiModels['summarization'];
      }
      console.log('🧠 MODEL SELECTION: Forced GPT-4o for general chat');
      return this.openaiModels['research'];
    }

    // If privacy is private, prefer GPT (OpenAI) for all tasks
    if (options?.privacyLevel === 'private') {
      if (taskType === 'summarization' || options.userIntent === 'summary') {
        return this.openaiModels['summarization'];
      }
      if (queryComplexity === 'high' || options.userIntent === 'deep-info' || options.userIntent === 'analysis') {
        return this.openaiModels['deep-research'];
      }
      return this.openaiModels['research'];
    }

    // If web search is required, use GPT for research, else Gemini for fast tasks
    if (options?.requiresWebSearch) {
      if (taskType === 'research' || options.userIntent === 'analysis' || queryComplexity === 'high') {
        return this.openaiModels['deep-research'];
      }
      return this.openaiModels['research'];
    }

    // Use GPT for business, analysis, deep info, company, lead-gen, or high complexity
    if ([
      'research', 'company-analysis', 'lead-generation', 'icp-development', 'summarization'
    ].includes(taskType) ||
      options?.userIntent === 'analysis' ||
      options?.userIntent === 'deep-info' ||
      options?.userIntent === 'company-info' ||
      queryComplexity === 'high') {
      if (taskType === 'summarization' || options?.userIntent === 'summary') {
        return this.openaiModels['summarization'];
      }
      if (queryComplexity === 'high' || options?.userIntent === 'deep-info' || options?.userIntent === 'analysis') {
        return this.openaiModels['deep-research'];
      }
      if (taskType === 'icp-development') {
        // Use Gemini for ICP if not deep
        return this.geminiModels['icp-development'];
      }
      return this.openaiModels['research'];
    }

    // Use Gemini for fast, simple, or low-complexity chat
    if (taskType === 'simple-chat' || options?.userIntent === 'chat' || queryComplexity === 'low') {
      return this.geminiModels['fast-response'];
    }

    // Default: Gemini for medium complexity, else OpenAI for fallback
    if (queryComplexity === 'medium') {
      return this.geminiModels['simple-chat'];
    }
    return this.openaiModels['research'];
  }

  /**
   * Get provider from model instance
   */
  private getProviderFromModel(model: BaseChatModel): 'openai' | 'gemini' | 'perplexity' | 'langchain_orchestrated' {
    if (model instanceof ChatOpenAI) {
      return 'openai';
    } else if (model instanceof ChatGoogleGenerativeAI) {
      return 'gemini';
    }
    return 'langchain_orchestrated';
  }

  /**
   * Get model name from model instance
   */
  private getModelName(model: BaseChatModel): string {
    if (model instanceof ChatOpenAI) {
      // Use the model name from the internal configuration
      return (model as unknown as { modelName?: string }).modelName || 'gpt-4o';
    } else if (model instanceof ChatGoogleGenerativeAI) {
      return (model as ChatGoogleGenerativeAI).model || 'gemini-2.0-flash';
    }
    return 'unknown';
  }

  /**
   * Analyze query to determine task type and complexity
   */
  public analyzeQuery(query: string): { taskType: TaskType; complexity: 'low' | 'medium' | 'high' } {
    const lowerQuery = query.toLowerCase();
    
    // Research indicators
    const researchKeywords = ['research', 'analyze', 'find companies', 'competitors', 'market', 'industry', 'prospects'];
    const companyKeywords = ['company', 'business model', 'website', 'organization'];
    const leadKeywords = ['leads', 'prospects', 'customers', 'target', 'sales'];
    const icpKeywords = ['icp', 'ideal customer', 'customer profile', 'target audience'];
    
    // Determine task type
    let taskType: TaskType = 'simple-chat';
    
    if (researchKeywords.some(keyword => lowerQuery.includes(keyword))) {
      taskType = 'research';
    } else if (companyKeywords.some(keyword => lowerQuery.includes(keyword))) {
      taskType = 'company-analysis';
    } else if (leadKeywords.some(keyword => lowerQuery.includes(keyword))) {
      taskType = 'lead-generation';
    } else if (icpKeywords.some(keyword => lowerQuery.includes(keyword))) {
      taskType = 'icp-development';
    }
    
    // Determine complexity
    let complexity: 'low' | 'medium' | 'high' = 'medium';
    
    const queryLength = query.split(' ').length;
    const hasMultipleQuestions = (query.match(/\?/g) || []).length > 1;
    const hasComplexTerms = /\b(comprehensive|detailed|in-depth|thorough|extensive)\b/i.test(query);
    
    if (queryLength < 10 && !hasComplexTerms) {
      complexity = 'low';
    } else if (queryLength > 30 || hasMultipleQuestions || hasComplexTerms) {
      complexity = 'high';
    }
    
    return { taskType, complexity };
  }

  /**
   * Get analytics for all tracked usage
   */
  public getAnalytics(timeframe?: { start: Date; end: Date }) {
    return llmTracker.getAnalytics(timeframe);
  }

  /**
   * Track accuracy for a specific response
   */
  public async trackAccuracy(
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
  ) {
    return llmTracker.trackAccuracy(
      queryId,
      provider,
      model,
      query,
      response,
      accuracy,
      options
    );
  }
}

// Export singleton instance
export const trackedLLMRouter = new TrackedLLMRouter();
export default trackedLLMRouter;
