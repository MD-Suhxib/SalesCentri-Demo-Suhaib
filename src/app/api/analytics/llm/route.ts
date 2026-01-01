// LLM Analytics API Route
import { NextRequest, NextResponse } from 'next/server';
import { llmTracker } from '../../../lib/llmTracker';

const handleGetLLMAnalytics = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start');
    const endDate = searchParams.get('end');
    
    let timeframe;
    if (startDate && endDate) {
      timeframe = {
        start: new Date(startDate),
        end: new Date(endDate)
      };
    }

    // Get analytics from tracker
    const analytics = llmTracker.getAnalytics(timeframe);
    
    // Get usage history
    const usageHistory = llmTracker.getUsageHistory();
    
    // Get accuracy history
    const accuracyHistory = llmTracker.getAccuracyHistory();
    
    // Calculate additional metrics
    const totalProviders = new Set(usageHistory.map(u => u.provider)).size;
    const totalModels = new Set(usageHistory.map(u => u.model)).size;
    const averageAccuracy = accuracyHistory.length > 0 
      ? accuracyHistory.reduce((sum, a) => sum + a.accuracy, 0) / accuracyHistory.length 
      : 0;

    const response = {
      ...analytics,
      additionalMetrics: {
        totalProviders,
        totalModels,
        averageAccuracy,
        dataPoints: usageHistory.length,
        accuracyDataPoints: accuracyHistory.length
      },
      usageHistory: usageHistory.slice(-100), // Last 100 entries
      accuracyHistory: accuracyHistory.slice(-50) // Last 50 entries
    };

    return NextResponse.json(response);
    
  } catch (error) {
    console.error('LLM Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to get LLM analytics' },
      { status: 500 }
    );
  }
};

const handlePostLLMAnalytics = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    switch (action) {
      case 'track_accuracy':
        const accuracyResult = llmTracker.trackAccuracy(
          data.queryId,
          data.provider,
          data.model,
          data.query,
          data.response,
          data.accuracy,
          {
            expectedResponse: data.expectedResponse,
            relevance: data.relevance,
            completeness: data.completeness,
            factualCorrectness: data.factualCorrectness,
            reviewer: data.reviewer,
            notes: data.notes
          }
        );
        return NextResponse.json({ success: true, data: accuracyResult });
        
      case 'clear_history':
        llmTracker.clearHistory();
        return NextResponse.json({ success: true, message: 'History cleared' });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('LLM Analytics POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process LLM analytics request' },
      { status: 500 }
    );
  }
};

export const GET = handleGetLLMAnalytics;
export const POST = handlePostLLMAnalytics;
