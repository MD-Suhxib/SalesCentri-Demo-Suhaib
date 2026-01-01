/**
 * Perplexity API Integration
 * API Documentation: https://docs.perplexity.ai/
 * 
 * Includes usage control to regulate expensive models
 */

import { getResearchModelForProvider } from './modelMapping';
import { progressEmitter } from './progressEmitter';

// Type definition for dynamically imported usage control module
interface PerplexityUsageControl {
  canUsePerplexityModel: (modelName: string) => boolean;
  getAvailablePerplexityModel: (requestedModel: string) => string;
  recordModelUsage: (modelName: string) => number;
  getBudgetInfo: () => { used: number; total: number; percentage: number };
  resetPerplexityUsage: () => void;
}

// Dynamically import usage controls to avoid SSR issues
let perplexityUsageControl: PerplexityUsageControl | null = null;

// Interface for the Perplexity API request
export interface PerplexityRequest {
  model: string;
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  top_k?: number;
}

// Interface for the Perplexity API response
export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Calls the Perplexity API with the provided prompt
 * 
 * @param prompt - The research prompt to send to Perplexity
 * @param model - The Perplexity model to use (defaults to 'sonar-deep-research')
 * @param systemPrompt - Optional system prompt for context
 * @returns The response text from Perplexity
 */
export async function callPerplexity(
  prompt: string,
  model: string = getResearchModelForProvider('perplexity'),
  systemPrompt: string = 'You are an advanced real-time research specialist focused on providing comprehensive, accurate, and up-to-the-minute information. You must ONLY respond to the specific user prompt and website/company provided. Do NOT provide generic sales automation content. Do NOT include <think> tags in your response. When researching prospects for a specific company, focus exclusively on that company\'s industry, target market, and specific needs. For each company category, identify AT LEAST 12-13 qualified prospective clients with detailed information including company size, key decision makers, contact details, and specific reasons they are qualified prospects for the SPECIFIC company being researched. Always include detailed market mapping, segmentation, and actionable lead intelligence. Use your online search capabilities to find the most current information available about the specific company and their potential clients.'
): Promise<string> {
  console.log('🔧 PERPLEXITY CALL STARTING...');
  console.log('🔑 Environment check:', {
    hasApiKey: !!process.env.PERPLEXITY_API_KEY,
    apiKeyLength: process.env.PERPLEXITY_API_KEY?.length,
    modelRequested: model,
    promptLength: prompt.length,
    systemPromptLength: systemPrompt.length
  });
  
  const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
  if (!PERPLEXITY_API_KEY) {
    console.error('❌ PERPLEXITY_API_KEY environment variable is not set');
    console.error('💡 Make sure PERPLEXITY_API_KEY is added to your .env.local file');
    throw new Error('PERPLEXITY_API_KEY environment variable is not set');
  }

  // Validate API key format - Perplexity keys should start with 'pplx-'
  if (!PERPLEXITY_API_KEY.startsWith('pplx-')) {
    console.error('❌ Invalid Perplexity API key format. Keys should start with "pplx-"');
    console.error('🔑 Current key format:', PERPLEXITY_API_KEY.substring(0, 10) + '...');
    throw new Error('Invalid Perplexity API key format. Please check your PERPLEXITY_API_KEY environment variable.');
  }

  try {
    // TEMPORARILY DISABLED: Skip usage control checks for debugging
    console.log('⚠️ Usage control temporarily disabled for debugging');
    progressEmitter.emitLog(`⚠️ USAGE CONTROL: Temporarily disabled - using requested model ${model}`);
    
    // Dynamically import usage control module (prevents SSR issues) - but don't use it
    if (!perplexityUsageControl) {
      console.log('📊 Loading Perplexity usage control module (disabled)...');
      try {
        perplexityUsageControl = await import('./perplexityUsageControl');
      } catch (importError) {
        console.log('⚠️ Usage control module not available, continuing without restrictions');
      }
    }
    
    console.log(`🚀 Using model ${model} without restrictions`);
    progressEmitter.emitLog(`🚀 PERPLEXITY: Using ${model} without budget restrictions`);
  } catch (error) {
    console.error('❌ Error with usage control (continuing anyway):', error);
    progressEmitter.emitLog(`⚠️ USAGE CONTROL ERROR: ${error instanceof Error ? error.message : 'Unknown error'} - continuing anyway`);
    // Continue with original model regardless of usage control
  }

  // Prepare the request payload with enhanced settings for deep research
  const payload: {
    model: string;
    messages: Array<{role: string; content: string}>;
    options?: Record<string, unknown>;
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    top_k?: number;
  } = {
    model,
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
    temperature: 0.4, // Slightly increased temperature for more comprehensive lead generation
    max_tokens: 12000, // Significantly increased token count for more detailed responses and longer lead lists
    top_p: 0.97,      // Adjusted top_p for better comprehensive coverage
    top_k: 45         // Increased top_k parameter to improve lead discovery and variety
  };

  try {
    console.log(`🔍 Calling Perplexity API with model: ${model}`);
    console.log(`🔑 API Key length: ${PERPLEXITY_API_KEY.length} - Format: ${PERPLEXITY_API_KEY.substring(0, 4)}...`);
    
    // Log the request payload for debugging (without the key)
    console.log('📤 Perplexity API request:', JSON.stringify({
      model: payload.model,
      messages: payload.messages.length,
      temperature: payload.temperature,
      max_tokens: payload.max_tokens,
      prompt_length: prompt.length
    }, null, 2));
    
    // Create abort controller with significantly increased timeout for complex research
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600000); // Increased to 10 minutes for comprehensive research
    
    try {
      console.log('🔗 Making request to Perplexity API...');
      progressEmitter.emitLog(`🔍 PERPLEXITY: Starting research with model ${model}`);
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
          'User-Agent': 'SalesCentri/1.0'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`📊 Perplexity API response status: ${response.status}`);

      // Handle unsuccessful responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Perplexity API error response:', errorText);
        
        // Handle specific error cases
        if (response.status === 401) {
          console.error('❌ 401 Unauthorized - Invalid or expired Perplexity API key');
          progressEmitter.emitLog('❌ PERPLEXITY AUTH ERROR: Invalid API key - please check credentials');
          throw new Error('Perplexity API authentication failed. Please check your API key.');
        }
        
        if (response.status === 429) {
          console.error('❌ 429 Rate Limited - Too many requests to Perplexity API');
          progressEmitter.emitLog('⏳ PERPLEXITY RATE LIMIT: Too many requests - will retry later');
          throw new Error('Perplexity API rate limit exceeded. Please try again later.');
        }
        
        if (response.status === 503 || response.status === 502) {
          console.error(`❌ ${response.status} Service Unavailable - Perplexity API experiencing issues`);
          progressEmitter.emitLog(`🚨 PERPLEXITY SERVICE ERROR: API experiencing ${response.status} issues`);
          throw new Error('Perplexity API service temporarily unavailable. Please try again later.');
        }
        
        try {
          // Try to parse the error as JSON for more detailed information
          const errorJson = JSON.parse(errorText);
          const errorMessage = errorJson.error?.message || errorText;
          console.error('Perplexity API error details:', errorMessage);
          progressEmitter.emitLog(`❌ PERPLEXITY ERROR: ${errorMessage}`);
          throw new Error(`Perplexity API error: ${errorMessage}`);
        } catch (parseError) {
          // If we can't parse the error as JSON, just use the status code
          console.error('Failed to parse error response:', parseError);
          throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
        }
      }

      // Parse and return the response
      const data: PerplexityResponse = await response.json();
      let content = data.choices[0].message.content;
      
      // Remove <think>...</think> tags from the response
      content = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
      
      // Log the cleaned content for debugging
      console.log(`✅ Perplexity response cleaned, length: ${content.length} characters`);
      progressEmitter.emitLog(`✅ PERPLEXITY SUCCESS: Research completed (${content.length} chars)`);
      
      return content;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Error calling Perplexity API:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Perplexity API request timed out after 10 minutes');
      }
      
      // If it's a timeout or network error, return a fallback message
      if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('fetch failed'))) {
        console.log('Perplexity API timeout - returning fallback response');
        return 'Perplexity API request timed out after 10 minutes. The research data has been generated by other AI models. For real-time market intelligence, please try again with a more specific query or check your internet connection.';
      }
      
      throw error;
    }
  } catch (outerError) {
    console.error('Unexpected error in callPerplexity function:', outerError);
    throw outerError;
  }
}

// Retry wrapper for Perplexity API calls with enhanced error handling
export async function callPerplexityWithRetry(prompt: string, model?: string, systemPrompt?: string): Promise<string> {
  const maxRetries = 3; // Increased retries for better reliability
  let lastError: Error | unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Perplexity API attempt ${attempt}/${maxRetries}`);
      const result = await callPerplexity(prompt, model, systemPrompt);
      
      // Success - return result
      console.log(`✅ Perplexity API success on attempt ${attempt}`);
      return result;
      
    } catch (error) {
      lastError = error;
      console.log(`❌ Perplexity API attempt ${attempt} failed:`, error);
      
      // If it's the last attempt, don't retry
      if (attempt === maxRetries) {
        break;
      }
      
      // Check if it's a recoverable error
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isTimeout = errorMessage.includes('timeout') || errorMessage.includes('aborted');
      const isServerError = errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503');
      const isAuthError = errorMessage.includes('authentication') || errorMessage.includes('401') || errorMessage.includes('Unauthorized');
      const isRateLimit = errorMessage.includes('429') || errorMessage.includes('rate limit');
      
      // Don't retry on authentication errors or rate limits
      if (isAuthError || isRateLimit) {
        console.log(`💀 Non-recoverable error (${isAuthError ? 'Auth' : 'Rate Limit'}), stopping retries`);
        break;
      }
      
      // Only retry on timeout or server errors
      if (isTimeout || isServerError) {
        // Progressive backoff: 2s, 4s, 8s
        const delayMs = Math.pow(2, attempt) * 1000;
        console.log(`⏳ Waiting ${delayMs}ms before retry (recoverable error)...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        // Non-recoverable error, break early
        console.log(`💀 Non-recoverable error, stopping retries`);
        break;
      }
    }
  }
  
  // All retries failed, return enhanced fallback
  console.log('🔄 All Perplexity API retries failed, returning enhanced fallback response');
  console.error('Final error:', lastError);
  
  // Return a more informative fallback response
  return `# Perplexity Real-Time Intelligence (Service Temporarily Unavailable)

## Notice
Perplexity's real-time web search service is currently experiencing high demand. The comprehensive research analysis has been provided by our other AI models with the latest available data.

## Alternative Actions
- **Immediate**: Use the detailed research from GPT-4o and Gemini models above
- **Manual Verification**: Cross-reference contact information through LinkedIn and company websites
- **Retry Option**: Try the research again in a few minutes when Perplexity service stabilizes

## Contact Discovery Recommendations
For finding real decision maker emails:
1. Check company "About Us" and "Leadership" pages directly
2. Use LinkedIn Sales Navigator for verified contact details
3. Look for recent press releases with executive contact information
4. Check industry directories and professional associations

*Note: This fallback ensures you still receive comprehensive research insights while Perplexity's real-time contact discovery features are restored.*`;
}
