import { NextRequest, NextResponse } from 'next/server';
import { callPerplexityWithRetry } from '../../lib/perplexityApi';

export async function POST(request: NextRequest) {
  try {
    const { query, model } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    console.log(`Testing Perplexity API with query: ${query}`);
    console.log(`Using model: ${model || 'sonar-deep-research'}`);
    
    const response = await callPerplexityWithRetry(
      query,
      model || 'sonar-deep-research',
      'You are a helpful research assistant. Provide a clear and comprehensive response.'
    );
    
    return NextResponse.json({ 
      success: true, 
      response,
      model: model || 'sonar-deep-research',
      responseLength: response.length
    });
    
  } catch (error) {
    console.error('Perplexity test failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.toString()
    }, { status: 500 });
  }
}
