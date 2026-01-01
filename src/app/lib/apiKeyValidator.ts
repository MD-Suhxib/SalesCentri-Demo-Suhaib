/**
 * API Key Validator - Ensures API keys are properly configured for real data
 */

export interface ApiKeyValidationResult {
  provider: string;
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

export interface ValidationSummary {
  allValid: boolean;
  validProviders: string[];
  invalidProviders: string[];
  results: ApiKeyValidationResult[];
}

/**
 * Validates OpenAI API key format and presence
 */
export function validateOpenAIKey(): ApiKeyValidationResult {
  const key = process.env.OPENAI_API_KEY;
  
  if (!key) {
    return {
      provider: 'OpenAI/ChatGPT',
      isValid: false,
      error: 'OPENAI_API_KEY environment variable is not set',
      suggestions: [
        'Set OPENAI_API_KEY in your .env file',
        'Ensure the .env file is in the project root',
        'Restart your development server after adding the key'
      ]
    };
  }
  
  if (!key.startsWith('sk-')) {
    return {
      provider: 'OpenAI/ChatGPT',
      isValid: false,
      error: 'Invalid OpenAI API key format - should start with "sk-"',
      suggestions: [
        'Check your API key from OpenAI dashboard',
        'Ensure you copied the complete key',
        'Verify there are no extra spaces or characters'
      ]
    };
  }
  
  if (key.length < 40) {
    return {
      provider: 'OpenAI/ChatGPT',
      isValid: false,
      error: 'OpenAI API key appears to be truncated or incomplete',
      suggestions: [
        'Check that the complete API key was copied',
        'Verify the .env file format is correct',
        'Ensure no line breaks in the middle of the key'
      ]
    };
  }
  
  return {
    provider: 'OpenAI/ChatGPT',
    isValid: true
  };
}

/**
 * Validates Google/Gemini API key format and presence
 */
export function validateGoogleKey(): ApiKeyValidationResult {
  const key = process.env.GOOGLE_API_KEY;
  
  if (!key) {
    return {
      provider: 'Google/Gemini',
      isValid: false,
      error: 'GOOGLE_API_KEY environment variable is not set',
      suggestions: [
        'Set GOOGLE_API_KEY in your .env file',
        'Get an API key from Google Cloud Console',
        'Enable the Gemini API for your project'
      ]
    };
  }
  
  if (key.length < 20) {
    return {
      provider: 'Google/Gemini',
      isValid: false,
      error: 'Google API key appears to be too short',
      suggestions: [
        'Check your API key from Google Cloud Console',
        'Ensure you copied the complete key',
        'Verify the API key has Gemini access enabled'
      ]
    };
  }
  
  return {
    provider: 'Google/Gemini',
    isValid: true
  };
}

/**
 * Validates Perplexity API key format and presence
 */
export function validatePerplexityKey(): ApiKeyValidationResult {
  const key = process.env.PERPLEXITY_API_KEY;
  
  if (!key) {
    return {
      provider: 'Perplexity',
      isValid: false,
      error: 'PERPLEXITY_API_KEY environment variable is not set',
      suggestions: [
        'Set PERPLEXITY_API_KEY in your .env file',
        'Get an API key from Perplexity dashboard',
        'Ensure you have sufficient credits'
      ]
    };
  }
  
  if (!key.startsWith('pplx-')) {
    return {
      provider: 'Perplexity',
      isValid: false,
      error: 'Invalid Perplexity API key format - should start with "pplx-"',
      suggestions: [
        'Check your API key from Perplexity dashboard',
        'Ensure you copied the complete key',
        'Verify there are no extra spaces or characters'
      ]
    };
  }
  
  return {
    provider: 'Perplexity',
    isValid: true
  };
}

/**
 * Validates Tavily API key for web search
 */
export function validateTavilyKey(): ApiKeyValidationResult {
  const key = process.env.TAVILY_API_KEY;
  
  if (!key) {
    return {
      provider: 'Tavily (Web Search)',
      isValid: false,
      error: 'TAVILY_API_KEY environment variable is not set',
      suggestions: [
        'Set TAVILY_API_KEY in your .env file',
        'Get an API key from Tavily dashboard',
        'Web search enhancement will be disabled without this key'
      ]
    };
  }
  
  return {
    provider: 'Tavily (Web Search)',
    isValid: true
  };
}

/**
 * Validates Groq API key format and presence
 */
export function validateGroqKey(): ApiKeyValidationResult {
  const key = process.env.GROQ_API_KEY;
  
  if (!key) {
    return {
      provider: 'Groq (Llama/Mixtral)',
      isValid: false,
      error: 'GROQ_API_KEY environment variable is not set',
      suggestions: [
        'Set GROQ_API_KEY in your .env file',
        'Get an API key from Groq console',
        'Groq provides fast inference for Llama and other models'
      ]
    };
  }
  
  if (key.length < 30) {
    return {
      provider: 'Groq (Llama/Mixtral)',
      isValid: false,
      error: 'Groq API key appears to be too short',
      suggestions: [
        'Check your API key from Groq console',
        'Ensure you copied the complete key',
        'Verify the API key is valid and active'
      ]
    };
  }
  
  return {
    provider: 'Groq (Llama/Mixtral)',
    isValid: true
  };
}

/**
 * Validates all API keys and returns a comprehensive summary
 */
export function validateAllApiKeys(): ValidationSummary {
  const results = [
    validateOpenAIKey(),
    validateGoogleKey(),
    validatePerplexityKey(),
    validateTavilyKey(),
    validateGroqKey()
  ];
  
  const validProviders = results.filter(r => r.isValid).map(r => r.provider);
  const invalidProviders = results.filter(r => !r.isValid).map(r => r.provider);
  
  return {
    allValid: results.every(r => r.isValid),
    validProviders,
    invalidProviders,
    results
  };
}

/**
 * Logs validation results to console with detailed formatting
 */
export function logValidationResults(summary: ValidationSummary): void {
  console.log('\n🔑 API KEY VALIDATION RESULTS');
  console.log('='.repeat(50));
  
  if (summary.allValid) {
    console.log('✅ ALL API KEYS VALID - Real data available from all providers');
  } else {
    console.log('⚠️  SOME API KEYS MISSING/INVALID - Limited real data available');
  }
  
  console.log(`\n✅ Valid Providers (${summary.validProviders.length}):`);
  summary.validProviders.forEach(provider => {
    console.log(`   ✓ ${provider}`);
  });
  
  if (summary.invalidProviders.length > 0) {
    console.log(`\n❌ Invalid Providers (${summary.invalidProviders.length}):`);
    summary.results.filter(r => !r.isValid).forEach(result => {
      console.log(`   ✗ ${result.provider}: ${result.error}`);
      if (result.suggestions) {
        console.log('     Suggestions:');
        result.suggestions.forEach(suggestion => {
          console.log(`       • ${suggestion}`);
        });
      }
    });
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (!summary.allValid) {
    console.log('⚠️  IMPORTANT: Missing API keys will result in error messages instead of mock data');
    console.log('⚠️  Configure all API keys to ensure real research data is available');
  }
}

/**
 * Quick check to see if real ChatGPT data is available
 */
export function isChatGPTAvailable(): boolean {
  return validateOpenAIKey().isValid;
}

/**
 * Quick check to see if real Gemini data is available
 */
export function isGeminiAvailable(): boolean {
  return validateGoogleKey().isValid;
}

/**
 * Quick check to see if real Perplexity data is available
 */
export function isPerplexityAvailable(): boolean {
  return validatePerplexityKey().isValid;
}

/**
 * Quick check to see if real Groq data is available
 */
export function isGroqAvailable(): boolean {
  return validateGroqKey().isValid;
}
