// Fuzzy matching layer for cost-saving, old-school AI
import { NextRequest, NextResponse } from 'next/server';
import { fuzzyMatch } from './matcher';

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  const result = fuzzyMatch(query);
  return NextResponse.json({ result });
}
