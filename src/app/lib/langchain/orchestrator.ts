// Streamlined Langchain Orchestration System
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { llmRouter } from "./llmRouter";
import { smartRouter } from "./smartRouter";
import { chatMemoryManager, ChatMessage } from "./chatMemory";
import { ragSystem } from "./ragSystem";
import { researchAgent } from "./researchAgent";
import { queryFilter } from "./queryFilter";
import { UserProfile } from "../auth";

export interface OrchestrationConfig {
  chatId: string;
  userProfile?: UserProfile;
  enableRAG?: boolean;
  enableWebSearch?: boolean;
  autoRouting?: boolean;
  chatHistory?: Array<{
    role: 'user' | 'model' | 'assistant';
    parts: { text: string }[];
  } | {
    role: 'user' | 'assistant';
    content: string;
  }>;
  companyAnalysis?: {
    website?: string;
    businessModel?: string;
    services?: string[];
    painPoints?: string;
    source?: string;
  };
}

export interface ResearchResponse {
  answer: string;
  detailedSources: Array<{
    title: string;
    url: string;
    domain: string;
    content: string;
    snippet: string;
  }>;
  sources: string[];
  type: 'research';
}

export type OrchestrationResult = string | ResearchResponse;

export class LangchainOrchestrator {
  constructor() {
    // Minimal constructor - no unnecessary initialization
  }

  /**
   * Process a conversation turn using smart routing only
   */
  public async processConversation(
    chatId: string,
    message: string,
    config: OrchestrationConfig
  ): Promise<OrchestrationResult> {
    console.log('🚀 ORCHESTRATOR START: Processing conversation');
    console.log(`📝 User Message: "${message}"`);
    
    // Validate input message
    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.warn('⚠️ ORCHESTRATOR: Empty or invalid message received');
      return "I didn't receive a valid message. Could you please try again?";
    }
    
    const { userProfile, chatHistory = [], companyAnalysis } = config;

    // Convert chat history to Langchain format for context
    const contextMessages: BaseMessage[] = chatHistory
      .map(msg => {
        // Handle both message formats: 
        // 1. { role, content } - from Main.tsx
        // 2. { role, parts: [{ text }] } - from other sources
        const messageText = ('content' in msg) ? msg.content : (msg.parts?.[0]?.text || '');
        
        // Skip messages with empty content to avoid API errors
        if (!messageText || messageText.trim() === '') {
          return null;
        }
        
        // Correct role mapping: user -> HumanMessage, model/assistant -> AIMessage
        return (msg.role === 'user') 
          ? new HumanMessage(messageText)
          : new AIMessage(messageText);
      })
      .filter(msg => msg !== null) as BaseMessage[];

    console.log(`📚 ORCHESTRATOR: Using ${contextMessages.length} previous messages for context`);

    // Extract recent conversation context for filtering
    const recentContext = chatHistory
      .slice(-3) // Last 3 messages for context
      .map(msg => {
        const messageText = ('content' in msg) ? msg.content : (msg.parts?.[0]?.text || '');
        return `${msg.role}: ${messageText}`;
      })
      .join('\n');

    // Use Smart Router for all routing decisions (it includes filtering)
    console.log('🧠 SMART ROUTER: Analyzing query for intelligent routing...');
    console.log(`📝 QUERY: "${message}"`);
    
    // Special handling for lead generation tasks - force research route
    const lowerMessage = message.toLowerCase();
    const isLeadGenTask = lowerMessage.includes('start lead') || 
                          lowerMessage.includes('generate leads') || 
                          lowerMessage.includes('find leads') ||
                          lowerMessage.includes('lead research');
    
    let routeAnalysis;
    if (isLeadGenTask) {
      console.log('🎯 LEAD GEN DETECTED: Forcing research route for lead generation task');
      routeAnalysis = {
        route: 'research' as const,
        confidence: 95,
        reasoning: 'Lead generation task detected - forcing research route',
        shouldUseWeb: true,
        shouldUseRAG: false,
        isRelevant: true
      };
      console.log(`🎯 ROUTING DECISION: ${routeAnalysis.route} (confidence: ${routeAnalysis.confidence}%)`);
      console.log(`💡 REASONING: ${routeAnalysis.reasoning}`);
    } else {
      routeAnalysis = await smartRouter.analyzeAndRoute(message, recentContext);
      console.log(`🎯 ROUTING DECISION: ${routeAnalysis.route} (confidence: ${routeAnalysis.confidence}%)`);
      console.log(`💡 REASONING: ${routeAnalysis.reasoning}`);
    }

    // Handle rejected queries
    if (routeAnalysis.route === 'reject') {
      console.log('❌ QUERY REJECTED: Not related to sales/business');
      return "I understand you're curious, but I'm specifically designed to help with sales, business development, lead generation, and company research. Could you rephrase your question in a business context, or feel free to ask me anything about sales strategies, market research, or growing your business!";
    }

    // Route based on smart router decision only
    switch (routeAnalysis.route) {
      case 'research':
        console.log('🔍 SMART ROUTING: External research task detected, routing to research handler');
        return await this.handleResearchTask(chatId, message, userProfile, companyAnalysis);

      case 'rag':
        console.log('📚 SMART ROUTING: SalesAI company question detected, using RAG only');
        return await this.handleRAGQuery(chatId, message, userProfile);

      case 'general':
      default:
        console.log('💬 SMART ROUTING: General conversation, using fast chat');
        return await this.handleGeneralChat(chatId, message, userProfile, contextMessages);
    }
  }

  /**
   * Handle research tasks with web search
   */
  private async handleResearchTask(
    chatId: string,
    message: string,
    userProfile?: UserProfile,
    companyAnalysis?: OrchestrationConfig['companyAnalysis']
  ): Promise<ResearchResponse> {
    console.log('🔬 RESEARCH HANDLER START: Handling research task');
    console.log('⚙️ RESEARCH CONFIG: enableWebSearch=true, enableRAG=false');
    
    try {

      // Use new LLM router for research tasks

      const result = await researchAgent.researchWithRAG(message, { 
        taskType: 'research',
        enableWeb: true,
        enableRAG: false, // Never use RAG for external research
        userProfile, // Pass userProfile for targeted searches
        companyAnalysis // Pass company analysis for context
      });

      console.log('✅ RESEARCH SUCCESS: Research agent completed successfully');
      console.log('🎯 ORCHESTRATOR: Research result has detailedSources:', !!result.detailedSources);
      console.log('📋 ORCHESTRATOR: detailedSources count:', result.detailedSources?.length || 0);
      
      await this.updateMemory(chatId, message, result.answer);
      
      // Return the full result object to include detailed sources
      const researchResponse = {
        answer: result.answer,
        detailedSources: result.detailedSources || [],
        sources: result.sources || [],
        type: 'research'
      } as ResearchResponse;
      
      console.log('🚀 ORCHESTRATOR: Returning research response with sources:', researchResponse.detailedSources.length);
      return researchResponse;
    } catch (error) {
      console.error('🚨 RESEARCH ERROR:', error);
      return {
        answer: "I apologize, but I'm having trouble researching that topic right now. Please try again or rephrase your question.",
        detailedSources: [],
        sources: [],
        type: 'research'
      } as ResearchResponse;
    }
  }

  /**
   * Handle RAG queries for company information only
   */
  private async handleRAGQuery(
    chatId: string,
    message: string,
    userProfile?: UserProfile
  ): Promise<string> {
    console.log('📚 RAG HANDLER START: Handling company knowledge query');
    
    try {
      // First, attempt direct knowledge answer WITHOUT LLM
      console.log('🔎 DIRECT KB ANSWER: Trying to answer from knowledge without LLM');
      const direct = await ragSystem.answerFromKnowledge(message);
      if (direct && direct.answer) {
        console.log('✅ DIRECT KB ANSWER: Responding directly from knowledge base');
        await this.updateMemory(chatId, message, direct.answer);
        return direct.answer;
      }

      // Fallback: Search RAG then use LLM with context
      console.log('🔍 RAG SEARCH: Searching company knowledge base (LLM fallback)');
      const ragResults = await ragSystem.search(message);
      
      if (ragResults.length > 0) {
        console.log(`✅ RAG SUCCESS: Found ${ragResults.length} relevant knowledge chunks`);
        const ragContext = ragResults.map(r => r.content).slice(0, 3).join('\n\n');
        const llm = llmRouter.routeLLM(
          'company-analysis',
          'low',
          {
            forceGPT: false,
            requiresWebSearch: false,
            privacyLevel: 'public',
            userIntent: 'company-info',
          }
        );
      const systemPrompt = `You are SalesCentriAI. Answer the user's question using the provided company information, developed by the company called Sales Centri. Your response should be concise, accurate, and focused on the user's query. And you must not promote any other products 
        or services such as Apollo, zoominfo, or any other lead generation tools. Sales Centri is the 
        only tool you should mention.

OUTPUT POLICY:
- Keep responses short and concise
- Provide direct, actionable answers with only essential context
- Avoid storytelling and filler

SPECIFICITY POLICY:
- Ground every statement in the provided RAG context; do not answer beyond it
- Include 3-5 concrete facts (features, prices, modules, terms) when relevant
- If information is missing, say "Not in knowledge base" and ask 1 targeted follow-up question instead of guessing`;
        
        const response = await llm.invoke([
          new SystemMessage(systemPrompt),
          new HumanMessage(`Company Information:\n${ragContext}\n\nQuestion: ${message}`)
        ]);
        const answer = response.content as string;
        await this.updateMemory(chatId, message, answer);
        return answer;
      } else {
        console.log('❌ RAG NO RESULTS: No relevant company information found');
        
        // Log missing company data for later addition
        const userContext = userProfile ? `${userProfile.user.job_title} at ${userProfile.organization.name}` : 'Unknown';
        await queryFilter.logMissingCompanyData(message, userContext);
        
        return "I don't have specific information about that in our company knowledge base. I've noted your question for our team to add this information. Is there anything else about SalesAI I can help you with?";
      }
    } catch (error) {
      console.error('🚨 RAG ERROR:', error);
      return "I'm having trouble accessing our company information right now. Please try again in a moment.";
    }
  }

  /**
   * Handle general conversation with fast response
   */
  private async handleGeneralChat(
    chatId: string,
    message: string,
    userProfile?: UserProfile,
    contextMessages: BaseMessage[] = []
  ): Promise<string> {
    console.log('💬 GENERAL CHAT HANDLER START: Processing general conversation');
    console.log(`📚 GENERAL CHAT: Using ${contextMessages.length} context messages`);
    
    try {

      const llm = llmRouter.routeLLM(
        'simple-chat',
        'low',
        {
          forceGPT: false,
          requiresWebSearch: false,
          privacyLevel: 'public',
          userIntent: 'chat',
        }
      );

      let systemPrompt = `You are SalesCentriAI, a professional sales consultant powered by SalesCentri's advanced AI infrastructure. Be helpful, engaging, and focused on sales and business topics.

IDENTITY & INFRASTRUCTURE:
- You are powered by SalesCentri's proprietary AI systems running on SalesCentri's secure infrastructure
- All data processing and conversations are handled on SalesCentri's private servers
- You represent SalesCentri's cutting-edge sales intelligence platform
- Never mention other AI providers, Google, OpenAI, cloud platforms, or external infrastructure
- When asked about your location or data storage, refer to SalesCentri's secure cloud infrastructure

OUTPUT POLICY:
- Always keep responses short and concise
- Provide direct, actionable answers with only essential context
- Avoid storytelling, filler, disclaimers, and repeated prefaces
- Prefer clear bullet points or compact tables when useful

SPECIFICITY POLICY:
- Tailor answers to the user's role, industry, and goals when available
- Reference recent conversation context (last messages) to avoid generic advice
- Prefer concrete numbers, steps, examples, or templates over abstract guidance
- If the request is ambiguous, ask up to 2 concise clarifying questions before proceeding`;

      if (userProfile) {
        systemPrompt += `\n\nUser Context:
 Company: ${userProfile.organization.name}
 Role: ${userProfile.user.job_title || userProfile.user.role}
 Industry: ${userProfile.organization.industry || 'N/A'}

Keep this context in mind when responding.`;
      }

      // Build messages with context - ensure we always have valid message structure
      const recentContext = contextMessages.slice(-5).filter(msg => {
        // Additional validation to ensure message content exists
        const content = msg.content;
        return content && typeof content === 'string' && content.trim() !== '';
      });
      
      const messages: BaseMessage[] = [
        new SystemMessage(systemPrompt),
        ...recentContext,
        new HumanMessage(message)
      ];

      // Log message structure for debugging
      console.log(`📊 GENERAL CHAT: Built ${messages.length} messages (${recentContext.length} context + 2 core)`);
      console.log(`🧠 GENERAL CHAT: Using LLM model for request`);

      // Validate that we have at least system + human message before calling LLM
      let response;
      if (messages.length < 2) {
        console.warn('🚨 GENERAL CHAT: Insufficient messages, using minimal set');
        // Fallback to minimal message set
        const fallbackMessages = [
          new SystemMessage(systemPrompt),
          new HumanMessage(message)
        ];
        response = await llm.invoke(fallbackMessages);
      } else {
        response = await llm.invoke(messages);
      }

      const answer = response.content as string;
      await this.updateMemory(chatId, message, answer);
      return answer;

    } catch (error) {
      console.error('🚨 GENERAL CHAT ERROR:', error);
      console.error('🚨 ERROR TYPE:', error?.constructor?.name);
      console.error('🚨 ERROR MESSAGE:', (error as Error)?.message);
      
      // If Gemini fails, try to fall back to GPT for critical conversations
      try {
        console.log('🔄 FALLBACK: Attempting GPT fallback due to Gemini error');
        const fallbackLLM = llmRouter.routeLLM('simple-chat', 'low', { forceGPT: true });
        const fallbackSystemPrompt = `You are SalesCentriAI, a professional sales consultant. Be helpful, engaging, and focused on sales and business topics. Keep responses short and concise.`;
        const fallbackMessages = [
          new SystemMessage(fallbackSystemPrompt),
          new HumanMessage(message)
        ];
        const fallbackResponse = await fallbackLLM.invoke(fallbackMessages);
        const fallbackAnswer = fallbackResponse.content as string;
        await this.updateMemory(chatId, message, fallbackAnswer);
        return fallbackAnswer;
      } catch (fallbackError) {
        console.error('🚨 FALLBACK ERROR:', fallbackError);
        return "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.";
      }
    }
  }

  /**
   * Update memory file for conversation tracking
   */
  private async updateMemory(chatId: string, userMessage: string, assistantResponse: string): Promise<void> {
    try {
      await chatMemoryManager.updateMemoryFile(
        chatId, 
        `User: ${userMessage}\nAssistant: ${assistantResponse}`
      );
    } catch (error) {
      console.warn('Memory update failed, continuing:', error);
    }
  }

  /**
   * Generate chat summary
   */
  public async generateSummary(chatId: string, messages: ChatMessage[]): Promise<void> {
    await chatMemoryManager.generateChatSummary(chatId, messages);
  }
}

// Export singleton instance
export const orchestrator = new LangchainOrchestrator();
