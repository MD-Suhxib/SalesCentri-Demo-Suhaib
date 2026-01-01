/**
 * Groq API Integration for Multi-GPT Research
 * Supports multiple models: Llama, Mixtral, etc.
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqRequest {
  model: string;
  messages: GroqMessage[];
  temperature: number;
  max_tokens: number;
  stream: boolean;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// Validate Groq API key at module load
const GROQ_API_KEY = process.env.GROQ_API_KEY;
console.log('🔑 Groq API Key Check:', {
  keyExists: !!GROQ_API_KEY,
  keyLength: GROQ_API_KEY?.length || 0,
  keyPrefix: GROQ_API_KEY?.substring(0, 7) || 'none'
});

if (!GROQ_API_KEY) {
  console.warn('⚠️ GROQ_API_KEY is not set in environment variables');
} else {
  console.log('✅ Groq API key is properly configured');
}

/**
 * Calls Groq API with specified model
 * 
 * @param prompt - The research prompt to send to Groq
 * @param systemPrompt - Optional system prompt for context
 * @param model - The model to use (default: llama-3.1-70b-versatile)
 * @returns The response text from Groq
 */
export async function callGroq(
  prompt: string,
  systemPrompt: string = 'You are a strategic business analysis assistant providing comprehensive research and insights.',
  model: string = 'llama-3.1-70b-versatile'
): Promise<string> {
  console.log('🤖 Groq API Call Initiated');
  console.log('📝 Prompt length:', prompt.length);
  console.log('⚙️ System prompt length:', systemPrompt.length);
  console.log('🎯 Model:', model);
  
  if (!GROQ_API_KEY) {
    const errorMsg = 'GROQ_API_KEY environment variable is not set';
    console.error('❌ Groq API Error:', errorMsg);
    throw new Error(errorMsg);
  }

  // Prepare messages for the API call
  const messages: GroqMessage[] = [
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
  const payload: GroqRequest = {
    model,
    messages,
    temperature: 0.3, // Lower temperature for more factual, consistent responses
    max_tokens: 4000  // Adjust based on response length needs
  };

  console.log('📤 Sending request to Groq API...');

  try {
    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Groq API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API error details:', {
        status: response.status,
        statusText: response.statusText,
        errorBody: errorText
      });
      throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: GroqResponse = await response.json();
    const result = data.choices[0].message.content;
    
    console.log('✅ Groq API Success');
    console.log('📝 Response length:', result?.length || 0);
    
    return result;
  } catch (error) {
    console.error('❌ Error calling Groq API:', error);
    throw error;
  }
}

/**
 * Run Groq with default settings
 */
export async function runGroq(
  prompt: string,
  systemPrompt: string = 'You are a strategic business analysis assistant providing comprehensive research and insights.',
  model: string = 'llama-3.1-70b-versatile'
): Promise<string> {
  return callGroq(prompt, systemPrompt, model);
}

/**
 * List available Groq models
 */
export const GROQ_MODELS = {
  LLAMA_70B: 'llama-3.1-70b-versatile',
  LLAMA_8B: 'llama-3.1-8b-instant',
  MIXTRAL: 'mixtral-8x7b-32768',
  GEMMA: 'gemma-7b-it'
} as const;

/**
 * Call specific Groq model - Llama 70B
 */
export async function callGroqLlama70b(
  prompt: string,
  systemPrompt: string = 'You are a strategic business analysis assistant providing comprehensive research and insights.'
): Promise<string> {
  return callGroq(prompt, systemPrompt, GROQ_MODELS.LLAMA_70B);
}

/**
 * Call specific Groq model - Llama 8B
 */
export async function callGroqLlama8b(
  prompt: string,
  systemPrompt: string = 'You are a strategic business analysis assistant providing comprehensive research and insights.'
): Promise<string> {
  return callGroq(prompt, systemPrompt, GROQ_MODELS.LLAMA_8B);
}

/**
 * Call specific Groq model - Mixtral
 */
export async function callGroqMixtral(
  prompt: string,
  systemPrompt: string = 'You are a strategic business analysis assistant providing comprehensive research and insights.'
): Promise<string> {
  return callGroq(prompt, systemPrompt, GROQ_MODELS.MIXTRAL);
}

/**
 * Call specific Groq model - Gemma
 */
export async function callGroqGemma(
  prompt: string,
  systemPrompt: string = 'You are a strategic business analysis assistant providing comprehensive research and insights.'
): Promise<string> {
  return callGroq(prompt, systemPrompt, GROQ_MODELS.GEMMA);
}
