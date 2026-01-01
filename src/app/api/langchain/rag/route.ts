// RAG System Management API Route
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/authMiddleware';
import { ragSystem } from '../../../lib/langchain/ragSystem';
import { chatMemoryManager } from '../../../lib/langchain/chatMemory';

interface RAGRequest {
  action: 'search' | 'index-memory' | 'index-urls' | 'reset' | 'stats';
  query?: string;
  urls?: string[];
  options?: {
    topK?: number;
    filter?: Record<string, any>;
  };
}

const handleRAG = async (request: NextRequest) => {
  try {
    const { 
      action, 
      query, 
      urls = [],
      options = {}
    }: RAGRequest = await request.json();
    
    if (!action) {
      return NextResponse.json({ 
        error: 'Action is required' 
      }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'search':
        if (!query) {
          return NextResponse.json({ 
            error: 'Query is required for search' 
          }, { status: 400 });
        }
        result = await ragSystem.search(query);
        break;

      case 'index-memory':
        await ragSystem.indexMemoryFile();
        result = { message: 'Memory file indexed successfully' };
        break;

      case 'index-urls':
        if (urls.length === 0) {
          return NextResponse.json({ 
            error: 'URLs are required for indexing' 
          }, { status: 400 });
        }
        await ragSystem.indexWebContent(urls);
        result = { 
          message: `Indexed ${urls.length} URLs successfully`,
          urls 
        };
        break;

      case 'reset':
        await ragSystem.resetCollection();
        result = { message: 'RAG collection reset successfully' };
        break;

      case 'stats':
        result = await ragSystem.getStats();
        break;

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }

    return NextResponse.json({ 
      action,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('RAG operation error:', error);
    return NextResponse.json({ 
      error: 'RAG operation failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
};

export const POST = requireAuth(handleRAG);
