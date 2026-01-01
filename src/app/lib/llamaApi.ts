// Llama API integration using Groq (since Llama models are available through Groq)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callLlama(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  try {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
      return `Mock Llama Response: This is a development response for "${prompt}". In production, this would be a real Llama API response.`;
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
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
      throw new Error(`Groq API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from Groq API');
    }

    return data.choices[0].message.content || 'No response generated';
  } catch (error) {
    console.error('Llama API error:', error);
    throw new Error(`Llama API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function runLlama(
  prompt: string,
  systemPrompt: string = 'You are a helpful AI assistant.'
): Promise<string> {
  return callLlama(prompt, systemPrompt);
}
