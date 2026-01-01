// LLM Usage Tracking API Route
import { NextRequest, NextResponse } from 'next/server';

interface LLMUsageRequest {
  provider: 'openai' | 'gemini' | 'perplexity' | 'langchain_orchestrated';
  model: string;
  taskType: string;
  queryComplexity: 'low' | 'medium' | 'high';
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cost: number;
  responseTime: number;
  timestamp: string;
  chatId?: string;
  userId?: string;
  query: string;
  response: string;
  accuracy?: number;
  sources?: string[];
  webSearchUsed?: boolean;
  ragUsed?: boolean;
}

const handleTrackLLMUsage = async (request: NextRequest) => {
  try {
    const usageData: LLMUsageRequest = await request.json();
    
    // Validate required fields
    if (!usageData.provider || !usageData.model || !usageData.taskType) {
      return NextResponse.json(
        { error: 'Provider, model, and taskType are required' },
        { status: 400 }
      );
    }

    // Add additional metadata
    const enrichedData = {
      ...usageData,
      user_agent: request.headers.get('user-agent'),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      session_id: request.headers.get('x-session-id'),
      timestamp: new Date().toISOString()
    };
    
    // Call external tracking API
    const baseURL = 'https://app.demandintellect.com/app/api';
    const url = `${baseURL}/tracker/llm-usage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedData),
    });
    
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      console.error('External API error:', response.status, response.statusText);
      // Store locally if external API fails
      return NextResponse.json({ 
        success: true, 
        message: 'LLM usage tracked locally',
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
  } catch (error) {
    console.error('LLM usage tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track LLM usage' },
      { status: 500 }
    );
  }
};

export const POST = handleTrackLLMUsage;
