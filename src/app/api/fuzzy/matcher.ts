// Simple fuzzy matcher using Levenshtein distance and static knowledge base
const knowledgeBase: { question: string; answer: string }[] = [
  { question: 'How can I improve my sales conversion rate?', answer: 'Focus on lead qualification, follow-ups, and personalized pitches.' },
  { question: 'What are the best practices for lead qualification?', answer: 'Score leads, research prospects, and use discovery calls.' },
  { question: 'Help me create a compelling sales pitch for my product', answer: 'Highlight unique value, address pain points, and use social proof.' },
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

export function fuzzyMatch(query: string): string {
  let bestScore = Infinity;
  let bestAnswer = '';
  for (const { question, answer } of knowledgeBase) {
    const score = levenshtein(query.toLowerCase(), question.toLowerCase());
    if (score < bestScore) {
      bestScore = score;
      bestAnswer = answer;
    }
  }
  // If the match is close enough, return the answer, else return empty string
  return bestScore <= 12 ? bestAnswer : '';
}
