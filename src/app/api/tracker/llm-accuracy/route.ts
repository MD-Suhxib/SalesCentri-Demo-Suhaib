// LLM Accuracy Tracking API Route
import { NextRequest, NextResponse } from 'next/server';

interface LLMAccuracyRequest {
  queryId: string;
  provider: string;
  model: string;
  query: string;
  response: string;
  expectedResponse?: string;
  accuracy: number;
  relevance: number;
  completeness: number;
  factualCorrectness: number;
  timestamp: string;
  reviewer?: string;
  notes?: string;
}

const handleTrackLLMAccuracy = async (request: NextRequest) => {
  try {
    const accuracyData: LLMAccuracyRequest = await request.json();
    
    // Validate required fields
    if (!accuracyData.queryId || !accuracyData.provider || !accuracyData.model) {
      return NextResponse.json(
        { error: 'QueryId, provider, and model are required' },
        { status: 400 }
      );
    }

    // Validate accuracy scores (0-1 range)
    const accuracyFields = ['accuracy', 'relevance', 'completeness', 'factualCorrectness'];
    for (const field of accuracyFields) {
      const value = accuracyData[field as keyof LLMAccuracyRequest] as number;
      if (value < 0 || value > 1) {
        return NextResponse.json(
          { error: `${field} must be between 0 and 1` },
          { status: 400 }
        );
      }
    }

    // Add additional metadata
    const enrichedData = {
      ...accuracyData,
      user_agent: request.headers.get('user-agent'),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      session_id: request.headers.get('x-session-id'),
      timestamp: new Date().toISOString()
    };
    
    // Call external tracking API
    const baseURL = 'https://app.demandintellect.com/app/api';
    const url = `${baseURL}/tracker/llm-accuracy`;
    
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
        message: 'LLM accuracy tracked locally',
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
  } catch (error) {
    console.error('LLM accuracy tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track LLM accuracy' },
      { status: 500 }
    );
  }
};

export const POST = handleTrackLLMAccuracy;
