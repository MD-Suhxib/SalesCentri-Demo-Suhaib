import { Anthropic } from '@anthropic-ai/sdk';

// Initialize Claude API client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function runClaude(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  try {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_api_key_here') {
      return `Mock Claude Response: This is a development response for "${prompt}". In production, this would be a real Claude API response.`;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0].type === 'text' ? response.content[0].text : 'No response generated';
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error(`Claude API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function callClaude(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  return runClaude(prompt, systemPrompt);
}
