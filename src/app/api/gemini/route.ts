// Langchain-enhanced Gemini API Route
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { runGemini } from './geminiHandler';
import { orchestrator } from '../../lib/langchain/orchestrator';

export async function POST(req: NextRequest) {
  let requestBody;
  try {
    const text = await req.text();
    console.log('📥 RAW REQUEST BODY:', text.substring(0, 200) + '...');
    
    if (!text || text.trim() === '') {
      console.error('🚨 EMPTY REQUEST BODY');
      return NextResponse.json({ 
        error: 'Empty request body',
        details: 'Request body is empty. Please provide valid JSON data.'
      }, { status: 400 });
    }

    requestBody = JSON.parse(text);
  } catch (error) {
    console.error('🚨 JSON PARSE ERROR: Invalid request body', error);
    return NextResponse.json({ 
      error: 'Invalid request body - must be valid JSON',
      details: 'Request body is empty or contains invalid JSON'
    }, { status: 400 });
  }

  const { 
    query, 
    message, 
    chatHistory = [], 
    options = {}, 
    useGrounding = false, 
    groundingParams,
    useLangchain = false,
    enableWebSearch = false,
    enableRAG = false,
    chatId = `chat_${Date.now()}`,
    userProfile,
    companyAnalysis
  } = requestBody;
  
  // Use either 'query' or 'message' parameter for backward compatibility
  const prompt = query || message;
  
  console.log('🚀 API ROUTE START: /api/gemini');
  console.log(`📝 User Input: "${prompt}"`);
  console.log(`⚙️ Options: Langchain=${useLangchain}, WebSearch=${enableWebSearch}, RAG=${enableRAG}`);
  
  try {
    // Always use Langchain orchestration for smart routing
    if (useLangchain) {
      console.log('� ROUTING: Using Langchain smart orchestration');
      
      // Use userProfile from request body if provided, fallback to auth middleware
      const finalUserProfile = userProfile || (req as any).userProfile;
      const result = await orchestrator.processConversation(
        chatId,
        prompt,
        { 
          chatId, 
          userProfile: finalUserProfile,
          enableRAG,
          enableWebSearch,
          autoRouting: true,
          chatHistory, // Pass chat history to orchestrator
          companyAnalysis // Pass company analysis for targeted searches
        }
      );
      
      console.log('✅ API SUCCESS: Langchain orchestration completed');
      
      // Handle different response types (string vs object with sources)
      const isResearchResult = typeof result === 'object' && result.type === 'research';
      
      console.log('🔍 API ROUTE: Is research result?', isResearchResult);
      if (isResearchResult) {
        console.log('📋 API ROUTE: detailedSources count:', result.detailedSources?.length || 0);
        console.log('🎯 API ROUTE: Sample detailed source:', result.detailedSources?.[0]);
      }
      
      return NextResponse.json({ 
        result: isResearchResult ? result.answer : result, 
        response: isResearchResult ? result.answer : result,
        detailedSources: isResearchResult ? result.detailedSources : [],
        sources: isResearchResult ? result.sources : [],
        model_used: 'smart_orchestrated',
        web_search_enabled: enableWebSearch,
        rag_enabled: enableRAG
      });
    } else {
      // Original Gemini-only behavior for backward compatibility
      console.log('🔄 ROUTING: Using legacy Gemini-only mode');
      const result = await runGemini(prompt, chatHistory, { 
        ...options, 
        useGrounding, 
        groundingParams 
      });
      console.log('✅ API SUCCESS: Legacy Gemini completed');
      
      // Add ResearchGPT header to the result
      const formattedResult = `# 🔍 ResearchGPT Analysis\n\n${result}`;
      
      return NextResponse.json({ 
        result: formattedResult, 
        response: formattedResult,
        model_used: 'gemini_legacy'
      });
    }
  } catch (error) {
    console.error('🚨 API ERROR: Request failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`🚨 ERROR DETAILS: ${errorMessage}`);
    
    return NextResponse.json({ 
      error: 'API error', 
      details: errorMessage 
    }, { status: 500 });
  }
}
