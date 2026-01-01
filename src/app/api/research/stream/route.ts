import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedUser } from '../../../lib/authMiddleware';
import { researchAgent } from '../../../lib/langchain/researchAgent';

interface StreamResearchRequest {
  query: string;
  userProfile?: Record<string, unknown>;
}

const handleStreamResearch = async (request: NextRequest, user: AuthenticatedUser) => {
  console.log('🎯 STREAM API: handleStreamResearch called with user:', user);
  
  try {
    const { query }: StreamResearchRequest = await request.json();
    console.log('🎯 STREAM API: Received query:', query);
    
    if (!query) {
      console.log('❌ STREAM API: No query provided');
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log('🚀 STREAM API: Starting streaming research for:', query);

    // Create a readable stream for SSE
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        
        // Send initial message
        const send = (data: Record<string, unknown>) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Custom search function that streams sources
        const performStreamingSearch = async () => {
          try {
            send({ type: 'log', message: '🔬 Starting research...' });
            send({ type: 'log', message: '🌐 Performing web search...' });
            
            // First, get search results immediately and stream them
            console.log('🔍 STREAMING: Getting search results first...');
            const searchResults = await researchAgent.searchInternet(query, 5);
            
            if (searchResults && searchResults.length > 0) {
              // Convert and send sources immediately
              const detailedSources = searchResults.map(result => ({
                title: result.title || 'Unknown Source',
                url: result.url || '',
                domain: result.url ? new URL(result.url).hostname.replace('www.', '') : 'unknown',
                content: (result.content || '').substring(0, 200) + '...',
                snippet: result.snippet || result.content || ''
              })).filter(source => source.url && source.url !== 'N/A');
              
              console.log('🚀 STREAMING: Sending sources immediately:', detailedSources.length);
              send({ 
                type: 'sources', 
                data: detailedSources,
                message: `Found ${detailedSources.length} sources`
              });
              
              send({ type: 'log', message: '🤖 Generating analysis...' });
              
              // Now do the analysis with the search results we already have
              const researchResult = await researchAgent.researchWithRAG(query, {
                enableWeb: false, // We already have search results
                enableRAG: true,
                taskType: 'research'
              });
              
              // Send the final result
              send({ 
                type: 'result', 
                data: researchResult.answer,
                message: 'Research completed'
              });
              
            } else {
              console.log('⚠️ STREAMING: No search results found, using full research');
              // Fallback to full research if no search results
              const researchResult = await researchAgent.researchWithRAG(query, {
                enableWeb: true,
                enableRAG: true,
                taskType: 'research'
              });
              
              // Send empty sources and result
              send({ 
                type: 'sources', 
                data: [],
                message: 'No sources found'
              });
              
              send({ 
                type: 'result', 
                data: researchResult.answer,
                message: 'Research completed'
              });
            }
            
            send({ type: 'complete', message: 'Done' });
            
          } catch (error) {
            console.error('🚨 STREAMING: Research error:', error);
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            send({ type: 'error', message: `Research failed: ${errorMessage}` });
          } finally {
            controller.close();
          }
        };

        // Start the streaming search
        performStreamingSearch();
      }
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });

  } catch (error) {
    console.error('Stream research error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};

export const POST = requireAuth(async (request: NextRequest, user: AuthenticatedUser) => {
  return handleStreamResearch(request, user);
});
