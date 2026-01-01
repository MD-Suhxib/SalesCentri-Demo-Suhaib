/**
 * OpenAI API Integration for GPT-4o
 */

// Check if OpenAI API key is available
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
console.log('🔑 OpenAI API Key Check:', {
  keyExists: !!OPENAI_API_KEY,
  keyLength: OPENAI_API_KEY?.length || 0,
  keyPrefix: OPENAI_API_KEY?.substring(0, 7) || 'none'
});

if (!OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY is not set in environment variables');
} else {
  console.log('✅ OpenAI API key is properly configured');
}

// Types for OpenAI API
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
}

/**
 * Calls OpenAI's GPT-4o API with the provided prompt
 * 
 * @param prompt - The research prompt to send to GPT-4o
 * @param systemPrompt - Optional system prompt for context
 * @returns The response text from GPT-4o
 */
export async function callGPT4o(
  prompt: string,
  systemPrompt: string = 'You are a strategic business analysis assistant providing comprehensive research and insights.'
): Promise<string> {
  console.log('🤖 GPT-4o API Call Initiated');
  console.log('📝 Prompt length:', prompt.length);
  console.log('⚙️ System prompt length:', systemPrompt.length);
  
  if (!OPENAI_API_KEY) {
    const errorMsg = 'OPENAI_API_KEY environment variable is not set';
    console.error('❌ OpenAI API Error:', errorMsg);
    throw new Error(errorMsg);
  }

  // Prepare messages for the API call
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: systemPrompt
    },
    {
      role: 'user',
      content: prompt
    }
  ];

  // Prepare request payload
  const payload: OpenAIRequest = {
    model: 'gpt-4o',
    messages,
    temperature: 0.3, // Lower temperature for more factual, consistent responses
    max_tokens: 4000  // Adjust based on response length needs
  };

  console.log('📤 Sending request to OpenAI API...');

  try {
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 OpenAI API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    
    console.log('✅ GPT-4o API Success');
    console.log('📝 Response length:', result?.length || 0);
    
    return result;
  } catch (error) {
    console.error('❌ Error calling OpenAI API:', error);
    throw error;
  }
}
