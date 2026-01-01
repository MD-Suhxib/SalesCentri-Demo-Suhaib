// Test LLM Tracking API Route
import { NextRequest, NextResponse } from 'next/server';
import { llmTracker } from '../../../lib/llmTracker';

export async function GET() {
  try {
    // Get current usage history
    const usageHistory = llmTracker.getUsageHistory();
    const analytics = llmTracker.getAnalytics();
    
    return NextResponse.json({
      success: true,
      data: {
        totalQueries: usageHistory.length,
        recentQueries: usageHistory.slice(-5), // Last 5 queries
        analytics
      }
    });
  } catch (error) {
    console.error('Test tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to get tracking data' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Add a test query to demonstrate tracking
    llmTracker.trackLLMUsage(
      'openai',
      'gpt-4o',
      'test_query',
      'medium',
      1000, // input tokens
      2000, // output tokens
      5000, // response time ms
      'Test query: What are the latest trends in AI?',
      'Test response: AI is evolving rapidly with advances in LLMs, multimodal AI, and autonomous systems...',
      {
        userId: 'test-user',
        webSearchUsed: true
      }
    );
    
    const usageHistory = llmTracker.getUsageHistory();
    
    return NextResponse.json({
      success: true,
      message: 'Test query tracked successfully',
      totalQueries: usageHistory.length,
      latestQuery: usageHistory[usageHistory.length - 1]
    });
  } catch (error) {
    console.error('Test tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track test query' },
      { status: 500 }
    );
  }
}
