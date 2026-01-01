// DeepSeek API integration
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function callDeepSeek(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  try {
    if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your_deepseek_api_key_here') {
      return `Mock DeepSeek Response: This is a development response for "${prompt}". In production, this would be a real DeepSeek API response.`;
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
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
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from DeepSeek API');
    }

    return data.choices[0].message.content || 'No response generated';
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw new Error(`DeepSeek API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function runDeepSeek(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  return callDeepSeek(prompt, systemPrompt);
}
