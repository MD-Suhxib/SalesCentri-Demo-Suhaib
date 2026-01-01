import { NextRequest, NextResponse } from 'next/server';
import { runGemini } from '../../gemini/geminiHandler';
import { UserProfile } from '../../../lib/auth';
import { orchestrator } from '../../../lib/langchain/orchestrator';
import { researchAgent } from '../../../lib/langchain/researchAgent';

interface ResearchRequest {
  query: string;
  chatHistory?: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  userProfile?: UserProfile;
  conversationContext?: string;
  icpStatus?: 'done' | 'pending' | 'unknown';
  researchType?: 'context_aware' | 'lead_generation' | 'icp' | 'research';
  shouldTriggerLeadGen?: boolean;
  useLangchain?: boolean; // New flag for using Langchain
}

const handleResearchQuery = async (request: NextRequest) => {
  try {
    const { 
      query, 
      chatHistory = [], 
      userProfile,
      conversationContext,
      icpStatus, 
      researchType,
      shouldTriggerLeadGen,
      useLangchain = true // Default to using Langchain for research
    }: ResearchRequest = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    let result = '';
    let modelUsed = 'gemini_legacy';
    let detailedSources: Record<string, unknown>[] = [];

    // Use Langchain for advanced research capabilities
    if (useLangchain) {
      const chatId = `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      if (researchType === 'context_aware' && userProfile) {
        // Normal context-aware chat with Langchain orchestration
        const orchestratorResult = await orchestrator.processConversation(chatId, query, {
          chatId,
          userProfile,
          enableRAG: true,
          enableWebSearch: false,
          autoRouting: true
        });
        
        // Handle different result types
        if (typeof orchestratorResult === 'string') {
          result = orchestratorResult;
        } else {
          result = orchestratorResult.answer;
          detailedSources = orchestratorResult.detailedSources || [];
        }
        modelUsed = 'langchain_contextual';
        
      } else if (researchType === 'lead_generation' && shouldTriggerLeadGen && userProfile) {
        // Use LangChain research agent for lead generation (GPT-4o)
        const onboardingData = {
          userRole: userProfile.user.job_title || userProfile.user.role,
          salesObjective: userProfile.organization.industry,
          companyWebsite: userProfile.organization.website,
          immediateGoal: query || 'lead generation'
        };
        
        const leadResult = await researchAgent.generateLeads(onboardingData);
        result = leadResult.answer;
        detailedSources = leadResult.detailedSources || [];
        modelUsed = 'langchain_lead_generation';
        
      } else if (query === 'ICP_DONE' && icpStatus === 'done' && userProfile) {
        // Generate leads using research agent
        const onboardingData = {
          userRole: userProfile.user.job_title || userProfile.user.role,
          salesObjective: userProfile.organization.industry,
          companyWebsite: userProfile.organization.website,
          immediateGoal: 'lead generation'
        };
        
        const leadResult = await researchAgent.generateLeads(onboardingData);
        result = leadResult.answer;
        detailedSources = leadResult.detailedSources || [];
        modelUsed = 'langchain_icp_leads';
        
      } else if (query === 'ICP_PENDING' && icpStatus === 'pending' && userProfile) {
        // Help develop ICP using research agent
        const onboardingData = {
          userRole: userProfile.user.job_title || userProfile.user.role,
          salesObjective: userProfile.organization.industry,
          companyWebsite: userProfile.organization.website
        };
        
        const icpResult = await researchAgent.researchICP(onboardingData);
        result = icpResult.answer;
        detailedSources = icpResult.detailedSources || [];
        modelUsed = 'langchain_icp_development';
        
      } else {
        // Deep research with web search and RAG
        const researchResult = await researchAgent.researchWithRAG(query, {
          enableWeb: true,
          enableRAG: true,
          taskType: 'research'
        });
        result = researchResult.answer;
        detailedSources = researchResult.detailedSources || [];
        console.log('🎯 RESEARCH ROUTE: detailedSources from agent:', detailedSources.length);
        modelUsed = 'langchain_deep_research';
      }
    } else {
      // Legacy Gemini behavior for backward compatibility
      if (researchType === 'context_aware' && userProfile) {
        result = await runGemini(query, chatHistory, {
          mode: 'context_aware',
          userProfile
        });
      } else if (researchType === 'lead_generation' && shouldTriggerLeadGen && userProfile) {
        const leadGenPrompt = `Based on the conversation context and my research on ${userProfile.organization.name}, I want to create a wow moment and offer lead generation help.`;
        
        result = await runGemini(leadGenPrompt, chatHistory, {
          mode: 'lead_generation',
          userProfile,
          conversationContext
        });
      } else if (query === 'ICP_DONE' && icpStatus === 'done' && userProfile) {
        result = await runGemini('Generate leads for user with defined ICP', chatHistory, {
          mode: 'research',
          userProfile,
          icpStatus: 'done'
        });
      } else if (query === 'ICP_PENDING' && icpStatus === 'pending' && userProfile) {
        result = await runGemini('Help user develop their ICP', chatHistory, {
          mode: 'icp',
          userProfile,
          icpStatus: 'pending'
        });
      } else {
        result = await runGemini(query, chatHistory, {
          mode: 'research',
          userProfile
        });
      }
    }

    // Add ResearchGPT header to the result
    const formattedResult = `# 🔍 ResearchGPT Analysis\n\n${result}`;

    return NextResponse.json({ 
      result: formattedResult,
      detailedSources,
      researchType,
      autoTriggered: shouldTriggerLeadGen || query.startsWith('ICP_'),
      modelUsed,
      langchainEnabled: useLangchain
    });

  } catch (error) {
    console.error('Research query error:', error);
    return NextResponse.json(
      { error: 'Failed to process research query' },
      { status: 500 }
    );
  }
};

export const POST = handleResearchQuery;
