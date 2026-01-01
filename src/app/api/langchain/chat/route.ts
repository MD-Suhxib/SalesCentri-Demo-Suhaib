// Langchain-powered Chat API Route
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/authMiddleware';
import { UserProfile } from '../../../lib/auth';
import { orchestrator } from '../../../lib/langchain/orchestrator';

interface LangchainChatRequest {
  message: string;
  chatId: string;
  chatHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp?: number;
  }>;
  options?: {
    enableRAG?: boolean;
    enableWebSearch?: boolean;
    autoRouting?: boolean;
    taskType?: string;
  };
}

const handleLangchainChat = async (request: NextRequest) => {
  try {
    const { 
      message, 
      chatId,
      chatHistory = [],
      options = {}
    }: LangchainChatRequest = await request.json();
    
    if (!message || !chatId) {
      return NextResponse.json({ 
        error: 'Message and chatId are required' 
      }, { status: 400 });
    }

    // Get user profile from auth
    const userProfile = (request as any).userProfile as UserProfile;

    // Configure orchestration
    const config = {
      chatId,
      userProfile,
      enableRAG: options.enableRAG ?? true,
      enableWebSearch: options.enableWebSearch ?? true,
      autoRouting: options.autoRouting ?? true
    };

    // Process with Langchain orchestrator
    const response = await orchestrator.processConversation(
      chatId,
      message,
      config
    );

    // Generate summary if chat is getting long
    if (chatHistory.length > 0 && chatHistory.length % 20 === 0) {
      const chatMessages = chatHistory.map((msg, index) => ({
        id: `msg_${index}`,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || Date.now(),
        chat_id: chatId
      }));
      
      await orchestrator.generateSummary(chatId, chatMessages);
    }

    return NextResponse.json({ 
      result: response,
      response: response, // Backward compatibility
      chatId,
      timestamp: new Date().toISOString(),
      model_used: 'langchain_orchestrated'
    });

  } catch (error) {
    console.error('Langchain chat error:', error);
    return NextResponse.json({ 
      error: 'Chat processing failed', 
      details: (error as Error).message 
    }, { status: 500 });
  }
};

export const POST = requireAuth(handleLangchainChat);
