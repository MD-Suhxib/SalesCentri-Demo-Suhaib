// Enhanced Research API with LLM Tracking
import { NextRequest, NextResponse } from 'next/server';
import { trackedResearchAgent } from '../../../lib/langchain/trackedResearchAgent';
import { trackedLLMRouter } from '../../../lib/langchain/trackedLLMRouter';
import { UserProfile } from '../../../lib/auth';

interface TrackedResearchRequest {
  query: string;
  chatHistory?: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  userProfile?: UserProfile;
  conversationContext?: string;
  icpStatus?: 'done' | 'pending' | 'unknown';
  researchType?: 'context_aware' | 'lead_generation' | 'icp' | 'research' | 'comparison';
  shouldTriggerLeadGen?: boolean;
  enableWebSearch?: boolean;
  enableRAG?: boolean;
  compareProviders?: boolean;
  chatId?: string;
  userId?: string;
}

const handleTrackedResearchQuery = async (request: NextRequest) => {
  try {
    const { 
      query, 
      userProfile,
      conversationContext,
      researchType = 'research',
      enableWebSearch = true,
      enableRAG = false,
      compareProviders = false,
      chatId,
      userId
    }: TrackedResearchRequest = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log(`🔬 TRACKED RESEARCH API: Processing query: "${query}"`);
    console.log(`⚙️ CONFIG: Type=${researchType}, WebSearch=${enableWebSearch}, RAG=${enableRAG}, Compare=${compareProviders}`);

    const finalChatId = chatId || `tracked_research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const finalUserId = userId || (userProfile?.user?.id?.toString()) || 'anonymous';

    try {
      let result;

      if (compareProviders) {
        // Compare multiple providers
        console.log('🔄 PROVIDER COMPARISON: Running comparison between GPT-4o and Gemini');
        const comparisonResult = await trackedResearchAgent.compareProviders(query, {
          taskType: 'research',
          enableWeb: enableWebSearch,
          enableRAG: enableRAG,
          userProfile: userProfile ? {
            preferences: { role: userProfile.user.role, jobTitle: userProfile.user.job_title },
            history: [],
            context: `User: ${userProfile.user.email}, Role: ${userProfile.user.role}`
          } : undefined,
          companyAnalysis: conversationContext ? {
            industry: 'Unknown',
            size: 'Unknown', 
            challenges: [conversationContext],
            goals: []
          } : undefined,
          chatId: finalChatId,
          userId: finalUserId
        });

        result = {
          answer: `## Provider Comparison Results\n\n**GPT-4o Response:**\n${comparisonResult.gpt4o.answer}\n\n**Gemini Response:**\n${comparisonResult.gemini.answer}\n\n**Comparison Analysis:**\n- Cost: GPT-4o (${comparisonResult.comparison.costComparison.gpt4o.toFixed(4)}) vs Gemini (${comparisonResult.comparison.costComparison.gemini.toFixed(4)})\n- Quality: GPT-4o (${(comparisonResult.comparison.qualityComparison.gpt4o * 100).toFixed(1)}%) vs Gemini (${(comparisonResult.comparison.qualityComparison.gemini * 100).toFixed(1)}%)\n- Speed: GPT-4o (${(comparisonResult.gpt4o.usage.totalResponseTime / 1000).toFixed(2)}s) vs Gemini (${(comparisonResult.gemini.usage.totalResponseTime / 1000).toFixed(2)}s)\n- Recommendation: ${comparisonResult.comparison.recommendation}`,
          detailedSources: [
            ...comparisonResult.gpt4o.detailedSources,
            ...comparisonResult.gemini.detailedSources
          ],
          sources: [
            ...comparisonResult.gpt4o.sources,
            ...comparisonResult.gemini.sources
          ],
          usage: {
            totalCost: comparisonResult.gpt4o.usage.totalCost + comparisonResult.gemini.usage.totalCost,
            totalTokens: comparisonResult.gpt4o.usage.totalTokens + comparisonResult.gemini.usage.totalTokens,
            totalResponseTime: Math.max(comparisonResult.gpt4o.usage.totalResponseTime, comparisonResult.gemini.usage.totalResponseTime),
            modelBreakdown: [
              ...comparisonResult.gpt4o.usage.modelBreakdown,
              ...comparisonResult.gemini.usage.modelBreakdown
            ]
          },
          metadata: {
            ...comparisonResult.gpt4o.metadata,
            comparison: true,
            providers: ['gpt4o', 'gemini']
          }
        };

      } else {
        // Single provider research
        console.log('🔬 SINGLE PROVIDER: Running research with tracked LLM');
        const researchResult = await trackedResearchAgent.researchWithTracking(query, {
          taskType: 'research',
          enableWeb: enableWebSearch,
          enableRAG: enableRAG,
          userProfile: userProfile ? {
            preferences: { role: userProfile.user.role, jobTitle: userProfile.user.job_title },
            history: [],
            context: `User: ${userProfile.user.email}, Role: ${userProfile.user.role}`
          } : undefined,
          companyAnalysis: conversationContext ? {
            industry: 'Unknown',
            size: 'Unknown', 
            challenges: [conversationContext],
            goals: []
          } : undefined,
          chatId: finalChatId,
          userId: finalUserId
        });

        result = {
          answer: researchResult.answer,
          detailedSources: researchResult.detailedSources,
          sources: researchResult.sources,
          usage: researchResult.usage,
          metadata: researchResult.metadata
        };
      }

      console.log(`✅ TRACKED RESEARCH COMPLETE: Cost=$${result.usage.totalCost.toFixed(4)}, Tokens=${result.usage.totalTokens}, Time=${result.usage.totalResponseTime}ms`);

      return NextResponse.json({
        success: true,
        result: result.answer,
        response: result.answer, // Backward compatibility
        detailedSources: result.detailedSources,
        sources: result.sources,
        usage: result.usage,
        metadata: result.metadata,
        mode: 'tracked_research',
        researchType: researchType,
        query: query,
        timestamp: new Date().toISOString(),
        chatId: finalChatId
      });

    } catch (error) {
      console.error('❌ TRACKED RESEARCH ERROR:', error);
      
      // Fallback to simple tracked LLM call
      console.log('🔄 FALLBACK: Using simple tracked LLM call');
      try {
        const fallbackResult = await trackedLLMRouter.routeAndTrackLLM(
          'research',
          query,
          'medium',
          {
            requiresWebSearch: enableWebSearch,
            userIntent: 'analysis',
            chatId: finalChatId,
            userId: finalUserId,
            webSearchUsed: enableWebSearch,
            ragUsed: enableRAG
          }
        );

        return NextResponse.json({
          success: true,
          result: fallbackResult.content,
          response: fallbackResult.content,
          detailedSources: [],
          sources: [],
          usage: fallbackResult.usage,
          metadata: fallbackResult.metadata,
          mode: 'tracked_fallback',
          researchType: researchType,
          query: query,
          timestamp: new Date().toISOString(),
          chatId: finalChatId
        });

      } catch (fallbackError) {
        console.error('❌ FALLBACK ERROR:', fallbackError);
        throw fallbackError;
      }
    }

  } catch (error) {
    console.error('ResearchGPT tracked error:', error);
    return NextResponse.json({ 
      error: 'Failed to process tracked research query',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const POST = handleTrackedResearchQuery;
