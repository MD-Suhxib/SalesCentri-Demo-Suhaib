import { NextRequest, NextResponse } from 'next/server';

// Simple fuzzy matcher using Levenshtein distance and static knowledge base
const knowledgeBase: { question: string; answer: string }[] = [
  { question: 'How can I improve my sales conversion rate?', answer: 'Focus on lead qualification, follow-ups, and personalized pitches.' },
  { question: 'What are the best practices for lead qualification?', answer: 'Score leads, research prospects, and use discovery calls.' },
  { question: 'Help me create a compelling sales pitch for my product', answer: 'Highlight unique value, address pain points, and use social proof.' },
  { question: 'How do I identify decision makers?', answer: 'Research company hierarchy, use LinkedIn, and ask qualifying questions.' },
  { question: 'What should I include in a follow-up email?', answer: 'Reference previous conversation, provide value, and clear next steps.' },
  { question: 'How to handle objections?', answer: 'Listen actively, acknowledge concerns, provide evidence, and ask clarifying questions.' },
  { question: 'What is a good sales process?', answer: 'Prospecting → Qualification → Discovery → Presentation → Closing → Follow-up.' },
  { question: 'How to research prospects?', answer: 'Use LinkedIn, company website, news, social media, and mutual connections.' },
  { question: 'What makes a good cold email?', answer: 'Personalized subject, relevant value proposition, social proof, and clear CTA.' },
  { question: 'How to price my product?', answer: 'Research competitors, understand value delivered, consider customer budget, and test different tiers.' },
  { question: 'What CRM should I use?', answer: 'Popular options: Salesforce, HubSpot, Pipedrive. Choose based on size, budget, and features needed.' },
  { question: 'How to generate leads?', answer: 'Content marketing, social media, referrals, cold outreach, partnerships, and events.' },
  { question: 'How to close more deals?', answer: 'Build relationships, understand pain points, present solutions clearly, and create urgency.' },
  { question: 'What is sales enablement?', answer: 'Tools, content, and training that help sales teams sell more effectively.' },
  { question: 'How to build rapport with prospects?', answer: 'Find common ground, ask personal questions, mirror communication style, and show genuine interest.' }
];

function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[a.length][b.length];
}

function fuzzyMatch(query: string): { match: string; answer: string; confidence: number } | null {
  const normalizedQuery = query.toLowerCase().trim();
  let bestMatch = { question: '', answer: '', distance: Infinity, confidence: 0 };
  
  for (const item of knowledgeBase) {
    const normalizedQuestion = item.question.toLowerCase();
    const distance = levenshtein(normalizedQuery, normalizedQuestion);
    const maxLength = Math.max(normalizedQuery.length, normalizedQuestion.length);
    const confidence = 1 - (distance / maxLength);
    
    if (distance < bestMatch.distance) {
      bestMatch = { question: item.question, answer: item.answer, distance, confidence };
    }
  }
  
  // Check for keyword matching as well
  const queryWords = normalizedQuery.split(/\s+/);
  for (const item of knowledgeBase) {
    const questionWords = item.question.toLowerCase().split(/\s+/);
    const matchedWords = queryWords.filter(word => 
      questionWords.some(qWord => qWord.includes(word) || word.includes(qWord))
    );
    const keywordConfidence = matchedWords.length / Math.max(queryWords.length, questionWords.length);
    
    if (keywordConfidence > bestMatch.confidence) {
      bestMatch = { 
        question: item.question, 
        answer: item.answer, 
        distance: 0, 
        confidence: keywordConfidence 
      };
    }
  }
  
  return bestMatch.confidence > 0.3 ? {
    match: bestMatch.question,
    answer: bestMatch.answer,
    confidence: bestMatch.confidence
  } : null;
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }
    
    const result = fuzzyMatch(query);
    
    return NextResponse.json({
      success: true,
      query,
      result
    });
    
  } catch (error) {
    console.error('Fuzzy match error:', error);
    return NextResponse.json(
      { error: 'Failed to process fuzzy match' },
      { status: 500 }
    );
  }
}
