// Minimal Gemini grounding route - no Langchain, no wrappers
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { runGemini } from '../geminiHandler';

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const body = bodyText ? JSON.parse(bodyText) : {};
    const { query, message, chatHistory = [], options = {} } = body || {};
    const prompt = query || message;
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const result = await runGemini(prompt, chatHistory, {
      mode: 'grounded_search',
      enableWebSearch: true,
      useGrounding: true,
      ...options,
    });

    return NextResponse.json({
      result,
      response: result,
      model_used: 'gemini_grounded',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}


