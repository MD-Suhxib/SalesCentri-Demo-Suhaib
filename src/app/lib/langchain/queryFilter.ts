// Query Filter Service - Filters non-sales related queries
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import * as fs from 'fs/promises';
import * as path from 'path';

export interface QueryFilterResult {
  isRelevant: boolean;
  reason: string;
  confidence: number;
}

export class QueryFilter {
  private filterLLM: ChatGoogleGenerativeAI;
  private unrelatedLogPath: string;
  private missingDataLogPath: string;

  constructor() {
    // Use a small, fast Gemini model for filtering (newer flash) with minimal retries
    this.filterLLM = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.1,
      maxOutputTokens: 150,
    }) as unknown as ChatGoogleGenerativeAI & { maxRetries?: number };
    // Set minimal retries defensively at runtime to avoid long stalls
    (this.filterLLM as unknown as { maxRetries?: number }).maxRetries = 1;

    this.unrelatedLogPath = path.join(process.cwd(), 'data', 'unrelated-queries.txt');
    this.missingDataLogPath = path.join(process.cwd(), 'data', 'missing-company-data.txt');
  }

  /**
   * Check if a query is relevant to sales/business consultation
   * Now considers conversation context and is more lenient
   */
  public async filterQuery(query: string, conversationContext?: string): Promise<QueryFilterResult> {
    console.log('🔍 QUERY FILTER: Checking query relevance...');
    
    // First check for obvious follow-up or clarification requests
    const followUpPatterns = [
      /can\s+(you|u)\s+(repeat|explain|clarify|rephrase)/i,
      /what\s+(do\s+you\s+mean|did\s+you\s+mean)/i,
      /can\s+you\s+(elaborate|expand|tell\s+me\s+more)/i,
      /could\s+you\s+(be\s+more\s+specific|give\s+more\s+details)/i,
      /(in\s+a\s+better\s+way|more\s+clearly|differently)/i,
      /what\s+exactly/i,
      /how\s+so/i,
      /explain\s+(that|this)/i
    ];

    const isFollowUp = followUpPatterns.some(pattern => pattern.test(query));
    if (isFollowUp && conversationContext) {
      console.log('✅ QUERY FILTER: Detected follow-up/clarification request, allowing...');
      return {
        isRelevant: true,
        confidence: 95,
        reason: 'Follow-up or clarification request in conversation'
      };
    }

    const systemPrompt = `You are a query filter for SalesAI. You should be LENIENT and allow most queries unless they are CLEARLY unrelated to business.

ALLOW queries about:
- Sales consultation, lead generation, business research  
- Company analysis, marketing strategies, customer outreach
- Sales tools/CRM, business development
- Curiosity-driven questions about business concepts
- Questions that could relate to business even tangentially
- Follow-up questions or clarifications
- General business advice or sales techniques
- Questions about pricing, costs, or business models
- ANY question that shows business interest or curiosity

ONLY REJECT queries that are CLEARLY personal/entertainment:
- Dating advice, personal relationships
- Health/medical advice (non-business)
- Cooking recipes, entertainment (movies, games)
- Academic subjects completely unrelated to business
- Pure technical programming (unless for business tools)

CONTEXT: ${conversationContext ? `Previous conversation: ${conversationContext}` : 'No previous context'}

Be GENEROUS - when in doubt, ALLOW the query. Business can relate to many topics.

Respond exactly:
RELEVANT: [true/false]
CONFIDENCE: [0-100]  
REASON: [brief explanation]`;

    try {
      // Guard with a short timeout; on timeout treat as relevant
      const response = await Promise.race([
        this.filterLLM.invoke([
          new SystemMessage(systemPrompt),
          new HumanMessage(`Filter this query: "${query}"`)
        ]),
        new Promise<unknown>((_, reject) => setTimeout(() => reject(new Error('filter_timeout')), 800))
      ]);

      const content = (response as { content: string }).content as string;
      console.log('🔍 FILTER RESPONSE:', content);

      const relevantMatch = content.match(/RELEVANT:\s*(true|false)/i);
      const confidenceMatch = content.match(/CONFIDENCE:\s*(\d+)/i);
      const reasonMatch = content.match(/REASON:\s*(.*)/i);

      const isRelevant = relevantMatch?.[1] === 'true';
      const confidence = parseInt(confidenceMatch?.[1] || '50');
      const reason = reasonMatch?.[1]?.trim() || 'No reason provided';

      const result: QueryFilterResult = {
        isRelevant,
        confidence,
        reason
      };

      console.log('🎯 FILTER DECISION:', result);

      // Only log unrelated queries with very high confidence (85+) to be less aggressive
      if (!isRelevant && confidence > 85) {
        await this.logUnrelatedQuery(query, reason);
      }

      return result;

    } catch (error) {
      console.error('🚨 QUERY FILTER ERROR:', error);
      
      // Fallback - allow query but with low confidence
      return {
        isRelevant: true,
        confidence: 30,
        reason: 'Filter failed, allowing query as fallback'
      };
    }
  }

  /**
   * Log unrelated queries for analysis
   */
  private async logUnrelatedQuery(query: string, reason: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const logEntry = `${timestamp} - "${query}" - ${reason}\n`;
      
      await fs.appendFile(this.unrelatedLogPath, logEntry, 'utf8');
      console.log('📝 UNRELATED QUERY LOGGED:', query.substring(0, 50) + '...');
    } catch (error) {
      console.error('❌ Failed to log unrelated query:', error);
    }
  }

  /**
   * Log missing company data when RAG can't answer
   */
  public async logMissingCompanyData(query: string, userContext?: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      const context = userContext ? ` - Context: ${userContext}` : '';
      const logEntry = `${timestamp} - "${query}"${context}\n`;
      
      await fs.appendFile(this.missingDataLogPath, logEntry, 'utf8');
      console.log('📝 MISSING DATA LOGGED:', query.substring(0, 50) + '...');
    } catch (error) {
      console.error('❌ Failed to log missing company data:', error);
    }
  }
}

// Export singleton instance
export const queryFilter = new QueryFilter();
