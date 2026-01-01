// Gemini API handler (to be implemented)
import { NextRequest, NextResponse } from 'next/server';
import { runGemini } from './geminiHandler';

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  try {
    const result = await runGemini(query);
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: 'Gemini API error', details: (error as Error).message }, { status: 500 });
  }
}
