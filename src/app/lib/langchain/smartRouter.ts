// Smart AI Router - Intelligent query routing system
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { queryFilter } from "./queryFilter";

export type RouteDecision = 'rag' | 'research' | 'general' | 'reject';

export interface RouteAnalysis {
  route: RouteDecision;
  confidence: number;
  reasoning: string;
  shouldUseWeb: boolean;
  shouldUseRAG: boolean;
  isRelevant?: boolean;
}

export class SmartRouter {
  private routerLLM: ChatGoogleGenerativeAI;
  // Circuit breaker to avoid repeated slow/failed router LLM calls
  private static routerCircuitOpenUntil: number = 0;

  constructor() {
    // Use a small, fast Gemini model for routing decisions (newer flash) with minimal retries
    this.routerLLM = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.1, // Low temperature for consistent routing
      maxOutputTokens: 200, // Keep responses short
    }) as unknown as ChatGoogleGenerativeAI & { maxRetries?: number };
    // Set minimal retries to avoid long stalls on overload
    (this.routerLLM as unknown as { maxRetries?: number }).maxRetries = 1;
  }

  /**
   * Intelligently analyze a query and decide the best routing strategy
   */
  public async analyzeAndRoute(query: string, conversationContext?: string): Promise<RouteAnalysis> {
    console.log('🧠 SMART ROUTER: Analyzing query for intelligent routing');

    // Global override or temporary circuit open → skip LLM routing entirely
    const now = Date.now();
    const llmDisabled = process.env.ROUTER_LLM_DISABLED === '1' || process.env.NEXT_PUBLIC_ROUTER_LLM_DISABLED === '1';
    const isCircuitOpen = SmartRouter.routerCircuitOpenUntil > now;
    
    // Ultra-fast heuristic short-circuit: if it's clearly general chat, skip LLM routing entirely
    const lower = query.toLowerCase();
    const isCompanyQuestion = /(salesai|salescentri|your\s+pricing|how\s+does\s+your|your\s+company|your\s+system|faq)/i.test(lower);
    const isExternalResearch = /(\.[a-z]{2,}|research|analy[sz]e\s+company|competitor|market|prospect|lead\s+generation|start\s+lead|generate\s+leads|find\s+leads)/i.test(lower);
    
    // Prioritize research detection for lead generation tasks
    if (isExternalResearch) {
      console.log('🔍 SMART ROUTER: Research indicators detected, prioritizing research route');
      return {
        route: 'research',
        confidence: 85,
        reasoning: 'Heuristic: Lead generation/research task detected',
        shouldUseWeb: true,
        shouldUseRAG: false,
        isRelevant: true
      };
    }
    
    if (!isCompanyQuestion && !isExternalResearch) {
      const quick = this.quickRoute(query);
      if (quick === 'general') {
        console.log('⚡ SMART ROUTER: Heuristic fast-path → general');
        return {
          route: 'general',
          confidence: 70,
          reasoning: 'Heuristic fast-path: no company or research indicators',
          shouldUseWeb: false,
          shouldUseRAG: false,
          isRelevant: true
        };
      }
    }
    
    // First, filter out non-sales related queries (now with context)
    console.log('🔍 SMART ROUTER: Checking query relevance...');
    // If LLM disabled or circuit open, skip filter LLM and mark as relevant
    const filterResult = (llmDisabled || isCircuitOpen)
      ? { isRelevant: true, confidence: 80, reason: llmDisabled ? 'Router LLM disabled' : 'Router circuit open' }
      : await Promise.race([
          queryFilter.filterQuery(query, conversationContext),
          new Promise<import('./queryFilter').QueryFilterResult>(resolve => setTimeout(() => resolve({
            isRelevant: true,
            confidence: 30,
            reason: 'Filter timeout: allowing query'
          }), 900))
        ]);
    
    // Increased threshold to 85 to be less aggressive (was 70)
    if (!filterResult.isRelevant && filterResult.confidence > 85) {
      console.log('❌ SMART ROUTER: Query rejected as unrelated to sales/business');
      return {
        route: 'reject',
        confidence: filterResult.confidence,
        reasoning: `Query rejected: ${filterResult.reason}`,
        shouldUseWeb: false,
        shouldUseRAG: false,
        isRelevant: false
      };
    }
    
    console.log('✅ SMART ROUTER: Query is relevant, proceeding with routing...');
    
    const systemPrompt = `You are an intelligent query router for SalesCentri (aka SalesAI in older references), powered by SalesCentri's proprietary AI infrastructure. 

IDENTITY & INFRASTRUCTURE:
- You run exclusively on SalesCentri's secure, private AI infrastructure
- All conversations and data are processed on SalesCentri's advanced servers
- Never mention external AI providers, Google, OpenAI, or other cloud platforms
- When asked about your location, data storage, or infrastructure, refer to SalesCentri's secure cloud systems

Decide the best system to handle each query.

ROUTING RULES:
1. **RAG** (our company knowledge): Use ONLY for questions about SalesCentri/SalesAI company itself:
   - Pricing, features, modules, onboarding, support, compliance, ROI
   - FAQs, company information, "what is SalesCentri", "who is it for"
   - "How does your system work?", "What are your prices?", "Do you support XYZ?"

2. **RESEARCH** (internet search): Use for external company/competitor research and lead generation:
   - Researching other companies (any .com, .org, company names)
   - Market analysis, competitor research
   - Lead generation, ICP development, finding prospects
   - "Research company X", "What does [company] do?"
   - "Start Lead Research", "Generate leads", "Find prospects"
   - ANY request to find, research, or generate leads for companies
   - Use your own mind, think "Do I need to research this? Or do i have the answer in my pretrained data?"

3. **GENERAL** (fast chat): Use for simple conversations:
   - Greetings, casual chat
   - General sales advice (not company-specific)
   - Simple questions that don't need research

CRITICAL: Lead generation tasks like "Start Lead Research" should ALWAYS route to RESEARCH, never to RAG or GENERAL.

Respond in this exact format:
ROUTE: [rag/research/general]
CONFIDENCE: [0-100]
REASONING: [brief explanation]
WEB_SEARCH: [true/false]
RAG_SEARCH: [true/false]`;

    // If LLM disabled or circuit open, use heuristic routing
    if (llmDisabled || isCircuitOpen) {
      const quick = this.quickRoute(query);
      console.log('⚡ SMART ROUTER: LLM disabled/circuit open, heuristic route →', quick);
      return {
        route: quick,
        confidence: quick === 'general' ? 70 : 60,
        reasoning: llmDisabled ? 'Router LLM disabled by env' : 'Router circuit open due to recent failures',
        shouldUseWeb: quick === 'research',
        shouldUseRAG: quick === 'rag',
        isRelevant: true
      };
    }

    try {
      // Guard LLM routing with a tight timeout and fall back to heuristic
      const response = await Promise.race([
        this.routerLLM.invoke([
          new SystemMessage(systemPrompt),
          new HumanMessage(`Analyze this query: "${query}"`)
        ]),
        new Promise<unknown>((_, reject) => setTimeout(() => reject(new Error('router_timeout')), 1200))
      ]);

      const content = (response as { content: string }).content as string;
      console.log('🤖 ROUTER RESPONSE:', content);

      // Parse the structured response
      const routeMatch = content.match(/ROUTE:\s*(\w+)/i);
      const confidenceMatch = content.match(/CONFIDENCE:\s*(\d+)/i);
      const reasoningMatch = content.match(/REASONING:\s*([\s\S]*?)(?=WEB_SEARCH|RAG_SEARCH|$)/i);
      const webSearchMatch = content.match(/WEB_SEARCH:\s*(true|false)/i);
      const ragSearchMatch = content.match(/RAG_SEARCH:\s*(true|false)/i);

      const route = (routeMatch?.[1]?.toLowerCase() as RouteDecision) || 'general';
      const confidence = parseInt(confidenceMatch?.[1] || '50');
      const reasoning = reasoningMatch?.[1]?.trim().replace(/\s+/g, ' ') || 'Default routing decision';
      const shouldUseWeb = webSearchMatch?.[1] === 'true';
      const shouldUseRAG = ragSearchMatch?.[1] === 'true';

      const analysis: RouteAnalysis = {
        route,
        confidence,
        reasoning,
        shouldUseWeb,
        shouldUseRAG,
        isRelevant: true
      };

      console.log('📊 SMART ROUTER DECISION:', analysis);
      return analysis;

    } catch (error) {
      console.error('🚨 SMART ROUTER ERROR:', error);
      
      // Fallback logic if router fails or times out → use quick heuristic
      const queryLower = query.toLowerCase();
      const quick = this.quickRoute(query);
      // Open circuit for 5 minutes to avoid repeated slow calls
      SmartRouter.routerCircuitOpenUntil = Date.now() + 5 * 60 * 1000;
      if (quick !== 'general') {
        return {
          route: quick,
          confidence: 60,
          reasoning: 'Heuristic fallback routing',
          shouldUseWeb: quick === 'research',
          shouldUseRAG: quick === 'rag',
          isRelevant: true
        };
      }
      
      if (queryLower.includes('salesai') || queryLower.includes('salescentri') || queryLower.includes('pricing') || queryLower.includes('your company') || queryLower.includes('what is your product') || queryLower.includes('faq')) {
        return {
          route: 'rag',
          confidence: 60,
          reasoning: 'Fallback: Detected SalesAI company question',
          shouldUseWeb: false,
          shouldUseRAG: true,
          isRelevant: true
        };
      }
      
      if (queryLower.includes('.com') || queryLower.includes('research') || queryLower.includes('company')) {
        return {
          route: 'research',
          confidence: 70,
          reasoning: 'Fallback: Detected external company research',
          shouldUseWeb: true,
          shouldUseRAG: false,
          isRelevant: true
        };
      }

      return {
        route: 'general',
        confidence: 50,
        reasoning: 'Fallback: Default to general chat',
        shouldUseWeb: false,
        shouldUseRAG: false,
        isRelevant: true
      };
    }
  }

  /**
   * Quick heuristic routing for simple cases (backup method)
   */
  public quickRoute(query: string): RouteDecision {
    const queryLower = query.toLowerCase();
    
    // SalesAI company questions
    if (queryLower.includes('salesai') || 
        queryLower.includes('your pricing') || 
        queryLower.includes('how does your') ||
        queryLower.includes('your company') ||
        queryLower.includes('your system')) {
      return 'rag';
    }
    
    // External research and lead generation (PRIORITY)
    if (queryLower.includes('.com') || 
        queryLower.includes('.org') || 
        queryLower.includes('research about') ||
        queryLower.includes('analyze company') ||
        queryLower.includes('competitor') ||
        queryLower.includes('lead generation') ||
        queryLower.includes('start lead') ||
        queryLower.includes('generate leads') ||
        queryLower.includes('find leads') ||
        queryLower.includes('find prospects') ||
        queryLower.includes('research')) {
      return 'research';
    }
    
    // General chat
    return 'general';
  }
}

// Export singleton instance
export const smartRouter = new SmartRouter();
