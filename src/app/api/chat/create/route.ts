// Chat Creation API Route
import { NextRequest, NextResponse } from 'next/server';

interface CreateChatRequest {
  title: string;
  mode?: string;
  research_type?: string;
  source?: 'homepage' | 'psa-page' | 'psa-chat';
  llm_settings?: {
    category?: string;
    depth?: string;
    [key: string]: any;
  };
}

const handleCreateChat = async (request: NextRequest) => {
  try {
    // Check if request has a body
    const contentLength = request.headers.get('content-length');
    const contentType = request.headers.get('content-type');
    
    console.log('📥 CHAT CREATE: Request headers:', {
      contentLength,
      contentType,
      method: request.method
    });
    
    // Read the raw body first to debug (read once)
    const rawBody = await request.text();
    console.log('📥 CHAT CREATE: Raw body length:', rawBody.length);
    console.log('📥 CHAT CREATE: Raw body preview:', rawBody.substring(0, 200));
    
    if (!rawBody || rawBody.trim() === '') {
      console.log('❌ CHAT CREATE: Empty request body');
      return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
    }
    
    let body: CreateChatRequest;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.log('❌ CHAT CREATE: JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    const { title, mode, research_type, source, llm_settings } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Get authentication details from headers or query params
    const authHeader = request.headers.get('authorization');
    const authToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const anonId = request.nextUrl.searchParams.get('anon_id') || undefined;

    console.log('🔄 CHAT CREATE API:', {
      hasAuthToken: !!authToken,
      anonId,
      title,
      timestamp: new Date().toISOString()
    });

    // Call external API
    const baseURL = 'https://app.demandintellect.com/app/api';
    let url = `${baseURL}/chats.php`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Bearer token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('🔑 Using Bearer token for authenticated user');
    } else {
      console.log('👤 No Bearer token, treating as anonymous user');
    }
    
    // Always add anon_id as query parameter if available
    if (anonId) {
      url += `?anon_id=${anonId}`;
      console.log('🆔 Added anon_id to URL:', anonId);
    }

    console.log('📡 Making request to external API:', url);

    // Build request body with all configuration
    const requestBody: any = { title };
    
    // Add mode and research configuration if provided
    if (mode) requestBody.mode = mode;
    if (research_type) requestBody.research_type = research_type;
    if (source) requestBody.source = source;
    if (llm_settings) requestBody.llm_settings = llm_settings;
    
    console.log('📤 Sending to external API:', requestBody);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    console.log('📡 External API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Chat created successfully:', data);
      return NextResponse.json(data);
    } else {
      const errorText = await response.text();
      console.error('❌ External API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        hasAuthToken: !!authToken,
        anonId
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to create chat', 
          details: errorText,
          status: response.status,
          hasAuthToken: !!authToken,
          anonId
        },
        { status: response.status }
      );
    }

  } catch (error) {
    console.error('❌ CHAT CREATE API ERROR:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};

export const POST = handleCreateChat;
