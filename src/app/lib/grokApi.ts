// Grok API integration (using xAI's API)
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

export async function callGrok(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  try {
    if (!process.env.XAI_API_KEY || process.env.XAI_API_KEY === 'your_xai_api_key_here') {
      return `Mock Grok Response: This is a development response for "${prompt}". In production, this would be a real Grok API response.`;
    }

    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-4-fast-reasoning',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.3,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Grok API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Grok API');
    }

    return data.choices[0].message.content || 'No response generated';
  } catch (error) {
    console.error('Grok API error:', error);
    throw new Error(`Grok API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function runGrok(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  return callGrok(prompt, systemPrompt);
}
