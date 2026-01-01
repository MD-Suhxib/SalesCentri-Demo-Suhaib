/**
 * Perplexity Usage Controls and Configuration
 * 
 * This file contains configuration settings and usage control mechanisms
 * for regulating expensive Perplexity API calls.
 */

// Cost tiers for different Perplexity models (relative cost multiplier)
export const MODEL_COST_TIERS = {
  'pplx-7b-online': 1.0,      // Basic model - baseline cost
  'pplx-70b-online': 2.5,     // Standard model - 2.5x more expensive
  'pplx-online-claude-3-opus': 6.0, // Advanced model - 6x more expensive
  'pplx-online-mixtral-8x22b': 5.0, // Research model - 5x more expensive
  'sonar-deep-research': 4.0, // Deep research sonar model - 4x more expensive
};

// Monthly token budget for different subscription tiers (in dollars)
export const MONTHLY_BUDGET = {
  FREE_TIER: 5,      // Free tier: $5/month
  BASIC_TIER: 15,    // Basic subscription: $15/month
  PRO_TIER: 50,      // Pro subscription: $50/month
  ENTERPRISE_TIER: 200, // Enterprise: $200/month
};

// Storage keys for tracking usage
export const PERPLEXITY_USAGE_KEY = 'perplexity_usage';
export const PERPLEXITY_CONFIG_KEY = 'perplexity_config';

// Interface for usage tracking
export interface PerplexityUsage {
  monthlyUsage: number;       // Estimated cost used this month ($)
  monthlyBudget: number;      // Total monthly budget ($)
  resetDate: string;          // Date of last monthly reset (ISO string)
  usageHistory: ModelUsage[]; // History of model usage
}

// Interface for individual model usage
export interface ModelUsage {
  model: string;              // Model name
  timestamp: number;          // When it was used
  estimatedCost: number;      // Estimated cost of the call
}

// Interface for Perplexity configuration
export interface PerplexityConfig {
  costLimitEnabled: boolean;  // Whether to enforce budget limits
  monthlyBudget: number;      // Current monthly budget
  modelRestrictions: {        // Model access restrictions
    'pplx-7b-online': boolean;
    'pplx-70b-online': boolean;
    'pplx-online-claude-3-opus': boolean;
    'pplx-online-mixtral-8x22b': boolean;
  };
  userTier: string;           // User's subscription tier
}

/**
 * Initialize default Perplexity configuration
 */
export function initializePerplexityConfig(): PerplexityConfig {
  // Default configuration for new users
  const defaultConfig: PerplexityConfig = {
    costLimitEnabled: true,
    monthlyBudget: MONTHLY_BUDGET.BASIC_TIER,
    modelRestrictions: {
      'pplx-7b-online': false,        // No restrictions on basic model
      'pplx-70b-online': false,       // No restrictions on standard model
      'pplx-online-claude-3-opus': true,  // Restrict advanced model
      'pplx-online-mixtral-8x22b': true,  // Restrict research model
    },
    userTier: 'BASIC_TIER'
  };
  
  savePerplexityConfig(defaultConfig);
  return defaultConfig;
}

/**
 * Initialize usage tracking
 */
export function initializePerplexityUsage(): PerplexityUsage {
  const config = getPerplexityConfig();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  const usage: PerplexityUsage = {
    monthlyUsage: 0,
    monthlyBudget: config.monthlyBudget,
    resetDate: monthStart,
    usageHistory: []
  };
  
  savePerplexityUsage(usage);
  return usage;
}

/**
 * Get current Perplexity configuration
 */
export function getPerplexityConfig(): PerplexityConfig {
  if (typeof window === 'undefined') {
    return initializePerplexityConfig();
  }
  
  try {
    const storedConfig = localStorage.getItem(PERPLEXITY_CONFIG_KEY);
    if (!storedConfig) {
      return initializePerplexityConfig();
    }
    
    return JSON.parse(storedConfig) as PerplexityConfig;
  } catch (error) {
    console.error('Error getting Perplexity configuration:', error);
    return initializePerplexityConfig();
  }
}

/**
 * Save Perplexity configuration
 */
export function savePerplexityConfig(config: PerplexityConfig): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PERPLEXITY_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving Perplexity configuration:', error);
  }
}

/**
 * Get current Perplexity usage data
 */
export function getPerplexityUsage(): PerplexityUsage {
  if (typeof window === 'undefined') {
    return initializePerplexityUsage();
  }
  
  try {
    const storedUsage = localStorage.getItem(PERPLEXITY_USAGE_KEY);
    if (!storedUsage) {
      return initializePerplexityUsage();
    }
    
    const usage = JSON.parse(storedUsage) as PerplexityUsage;
    
    // Check if we need to reset for a new month
    const now = new Date();
    const resetDate = new Date(usage.resetDate);
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      return initializePerplexityUsage();
    }
    
    return usage;
  } catch (error) {
    console.error('Error getting Perplexity usage data:', error);
    return initializePerplexityUsage();
  }
}

/**
 * Save Perplexity usage data
 */
export function savePerplexityUsage(usage: PerplexityUsage): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(PERPLEXITY_USAGE_KEY, JSON.stringify(usage));
  } catch (error) {
    console.error('Error saving Perplexity usage data:', error);
  }
}

/**
 * Check if a specific Perplexity model can be used based on budget and restrictions
 */
export function canUsePerplexityModel(modelName: string): boolean {
  const config = getPerplexityConfig();
  const usage = getPerplexityUsage();
  
  // Check if model is restricted by configuration
  if (config.modelRestrictions[modelName as keyof typeof config.modelRestrictions]) {
    return false;
  }
  
  // If cost limits are disabled, allow usage
  if (!config.costLimitEnabled) {
    return true;
  }
  
  // Check if we're over budget
  if (usage.monthlyUsage >= usage.monthlyBudget) {
    return false;
  }
  
  // For expensive models, ensure we have enough budget remaining
  const modelCostFactor = MODEL_COST_TIERS[modelName as keyof typeof MODEL_COST_TIERS] || 1.0;
  const estimatedCallCost = 0.10 * modelCostFactor; // Base cost of $0.10 per call
  
  // If this call would put us over budget, deny it
  if (usage.monthlyUsage + estimatedCallCost > usage.monthlyBudget) {
    return false;
  }
  
  return true;
}

/**
 * Record usage of a Perplexity model
 */
export function recordModelUsage(modelName: string): number {
  const usage = getPerplexityUsage();
  const modelCostFactor = MODEL_COST_TIERS[modelName as keyof typeof MODEL_COST_TIERS] || 1.0;
  const estimatedCallCost = 0.10 * modelCostFactor; // Base cost of $0.10 per call
  
  // Add to usage history
  usage.usageHistory.push({
    model: modelName,
    timestamp: Date.now(),
    estimatedCost: estimatedCallCost
  });
  
  // Keep history to most recent 100 calls
  if (usage.usageHistory.length > 100) {
    usage.usageHistory = usage.usageHistory.slice(-100);
  }
  
  // Update total usage
  usage.monthlyUsage += estimatedCallCost;
  
  // Save updated usage
  savePerplexityUsage(usage);
  
  // Return remaining budget
  return Math.max(0, usage.monthlyBudget - usage.monthlyUsage);
}

/**
 * Get the most cost-effective available model
 * Falls back to simpler models if expensive ones are restricted or over budget
 */
export function getAvailablePerplexityModel(requestedModel: string): string {
  // Check if requested model is available
  if (canUsePerplexityModel(requestedModel)) {
    return requestedModel;
  }
  
  // Try to fallback in order of decreasing cost
  const fallbackOrder = [
    'pplx-online-claude-3-opus',
    'pplx-online-mixtral-8x22b',
    'pplx-70b-online',
    'pplx-7b-online'
  ];
  
  // Find where the requested model is in the fallback order
  const startIndex = fallbackOrder.indexOf(requestedModel);
  
  // Try each less expensive model
  for (let i = startIndex + 1; i < fallbackOrder.length; i++) {
    if (canUsePerplexityModel(fallbackOrder[i])) {
      return fallbackOrder[i];
    }
  }
  
  // If no models are available within budget/restrictions, use the basic model
  // (in a real app, you might want to show an error instead)
  return 'pplx-7b-online';
}

/**
 * Get formatted budget information for display
 */
export function getBudgetInfo(): { used: number, total: number, percentage: number } {
  const usage = getPerplexityUsage();
  
  return {
    used: parseFloat(usage.monthlyUsage.toFixed(2)),
    total: usage.monthlyBudget,
    percentage: Math.min(100, (usage.monthlyUsage / usage.monthlyBudget) * 100)
  };
}

/**
 * Reset usage tracking (for testing or admin purposes)
 */
export function resetPerplexityUsage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PERPLEXITY_USAGE_KEY);
  initializePerplexityUsage();
}
