import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if OpenAI API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: 'OpenAI API key not found',
        debug: {
          hasKey: false,
          envVars: Object.keys(process.env).filter(key => key.includes('OPENAI'))
        }
      }, { status: 500 });
    }

    // Test a simple API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: 'Say "Hello, this is a test" and nothing else.'
          }
        ],
        max_tokens: 50
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'OpenAI API call failed',
        status: response.status,
        statusText: response.statusText,
        details: errorText,
        debug: {
          hasKey: true,
          keyLength: apiKey.length,
          keyPrefix: apiKey.substring(0, 10)
        }
      }, { status: 500 });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'OpenAI API is working correctly',
      response: data.choices[0].message.content,
      debug: {
        hasKey: true,
        keyLength: apiKey.length,
        keyPrefix: apiKey.substring(0, 10)
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        hasKey: !!process.env.OPENAI_API_KEY,
        keyLength: process.env.OPENAI_API_KEY?.length || 0
      }
    }, { status: 500 });
  }
}
