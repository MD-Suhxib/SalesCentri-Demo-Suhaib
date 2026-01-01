/**
 * Model Mapping Utility
 * 
 * This utility provides a consistent way to map between different LLM providers and their models.
 * It's especially useful when integrating with multiple LLM providers that have different model naming schemes.
 */

export type LLMProvider = 'openai' | 'gemini' | 'perplexity' | 'anthropic' | 'claude' | 'llama' | 'grok' | 'deepseek';
export type ResearchModelTier = 'basic' | 'standard' | 'advanced';

/**
 * Gets the appropriate model name for a specific provider and tier
 */
export function getResearchModel(provider: LLMProvider, tier: ResearchModelTier = 'standard'): string {
  const modelMap: Record<LLMProvider, Record<ResearchModelTier, string>> = {
    openai: {
      basic: 'gpt-3.5-turbo',
      standard: 'gpt-4o',
      advanced: 'gpt-4o'
    },
    gemini: {
      basic: 'gemini-1.0-pro',
      standard: 'gemini-1.5-flash',
      advanced: 'gemini-1.5-pro'
    },
    perplexity: {
      basic: 'sonar-deep-research',
      standard: 'sonar-deep-research', 
      advanced: 'sonar-deep-research'
    },
    anthropic: {
      basic: 'claude-3-haiku-20240307',
      standard: 'claude-3-sonnet-20240229',
      advanced: 'claude-3-opus-20240229'
    },
    claude: {
      basic: 'claude-3-haiku-20240307',
      standard: 'claude-3-sonnet-20240229',
      advanced: 'claude-3-opus-20240229'
    },
    llama: {
      basic: 'llama-3.1-70b-versatile',
      standard: 'llama-3.1-70b-versatile',
      advanced: 'llama-3.1-70b-versatile'
    },
    grok: {
      basic: 'grok-beta',
      standard: 'grok-beta',
      advanced: 'grok-beta'
    },
    deepseek: {
      basic: 'deepseek-chat',
      standard: 'deepseek-chat',
      advanced: 'deepseek-chat'
    }
  };

  return modelMap[provider][tier];
}

/**
 * Gets the best research model for a provider
 */
export function getResearchModelForProvider(provider: LLMProvider): string {
  // Use provider-specific research models
  switch (provider) {
    case 'openai':
      return 'gpt-4o'; // Best for general research
    case 'gemini':
      return 'gemini-1.5-flash'; // Good balance of speed and quality
    case 'perplexity':
      return 'sonar-deep-research'; // Best for deep research
    case 'anthropic':
      return 'claude-3-opus-20240229'; // Best for comprehensive analysis
    case 'llama':
      return 'llama-3.1-70b-versatile'; // Best for open source models
    case 'grok':
      return 'grok-beta'; // Best for real-time information
    case 'deepseek':
      return 'deepseek-chat'; // Best for coding and analysis
    default:
      return 'gpt-4o'; // Default to OpenAI
  }
}
