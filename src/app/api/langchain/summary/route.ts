// Chat Summary Management API Route
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/authMiddleware';
import { chatMemoryManager, ChatMessage } from '../../../lib/langchain/chatMemory';

interface SummaryRequest {
  action: 'generate' | 'get' | 'list';
  chatId?: string;
  messages?: ChatMessage[];
  title?: string;
}

const handleSummary = async (request: NextRequest) => {
  try {
    const { 
      action, 
      chatId, 
      messages = [],
      title
    }: SummaryRequest = await request.json();
    
    if (!action) {
      return NextResponse.json({ 
        error: 'Action is required' 
      }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'generate':
        if (!chatId || messages.length === 0) {
          return NextResponse.json({ 
            error: 'ChatId and messages are required for summary generation' 
          }, { status: 400 });
        }
        result = await chatMemoryManager.generateChatSummary(chatId, messages, title);
        break;

      case 'get':
        if (!chatId) {
          return NextResponse.json({ 
            error: 'ChatId is required' 
          }, { status: 400 });
        }
        result = await chatMemoryManager.getChatSummary(chatId);
        if (!result) {
          return NextResponse.json({ 
            error: 'Summary not found' 
          }, { status: 404 });
        }
        break;

      case 'list':
        result = await chatMemoryManager.getAllChatSummaries();
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
    console.error('Summary operation error:', error);
    return NextResponse.json({ 
      error: 'Summary operation failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
};

export const POST = requireAuth(handleSummary);
