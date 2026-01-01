/**
 * Search Usage Controls and Configuration
 * 
 * This file contains configuration settings and usage control mechanisms
 * for regulating expensive API calls like Tavily web search.
 */

// Maximum number of web searches allowed per day (per user/account)
export const DAILY_SEARCH_QUOTA = {
  FREE_TIER: 5,      // Free tier users get 5 searches per day
  BASIC_TIER: 15,    // Basic subscription tier
  PRO_TIER: 50,      // Professional subscription tier
  ENTERPRISE_TIER: 200, // Enterprise subscription tier (configurable)
};

// Default search quota for development environment
export const DEFAULT_SEARCH_QUOTA = 100; // Increased for development

// Storage key for tracking usage in localStorage
export const SEARCH_USAGE_STORAGE_KEY = 'tavily_search_usage';

/**
 * Interface for tracking search usage
 */
export interface SearchUsageData {
  count: number;        // Number of searches used today
  date: string;         // Date of last usage reset (ISO string)
  quota: number;        // Current user's quota
  tier: string;         // User's subscription tier
  lastSearchTimestamp?: number; // Timestamp of last search (for rate limiting)
}

/**
 * Get the current user's search usage data
 * Resets count if it's a new day
 */
export function getSearchUsage(): SearchUsageData {
  // In a server environment, always allow searches for development
  if (typeof window === 'undefined') {
    return {
      count: 0,
      date: new Date().toISOString().split('T')[0],
      quota: DEFAULT_SEARCH_QUOTA,
      tier: 'DEVELOPMENT'
    };
  }

  try {
    const storedData = localStorage.getItem(SEARCH_USAGE_STORAGE_KEY);
    if (!storedData) {
      return initializeSearchUsage();
    }

    const usageData: SearchUsageData = JSON.parse(storedData);
    const today = new Date().toISOString().split('T')[0];
    
    // Reset count if it's a new day
    if (usageData.date !== today) {
      usageData.count = 0;
      usageData.date = today;
      saveSearchUsage(usageData);
    }
    
    return usageData;
  } catch (error) {
    console.error('Error getting search usage data:', error);
    return initializeSearchUsage();
  }
}

/**
 * Create initial search usage data
 */
function initializeSearchUsage(): SearchUsageData {
  // In a real application, this would determine the user's subscription tier
  // For now, we use a default quota for development
  const initialData: SearchUsageData = {
    count: 0,
    date: new Date().toISOString().split('T')[0],
    quota: DEFAULT_SEARCH_QUOTA,
    tier: 'BASIC_TIER'
  };
  
  saveSearchUsage(initialData);
  return initialData;
}

/**
 * Save search usage data to localStorage
 */
export function saveSearchUsage(data: SearchUsageData): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SEARCH_USAGE_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving search usage data:', error);
  }
}

/**
 * Check if a user has exceeded their search quota
 * @returns true if the user can perform another search, false if quota exceeded
 */
export function canPerformSearch(): boolean {
  const usageData = getSearchUsage();
  return usageData.count < usageData.quota;
}

/**
 * Record a search usage and return updated count
 * @returns The number of searches remaining in the quota
 */
export function recordSearchUsage(): number {
  const usageData = getSearchUsage();
  
  // Don't increment if already at quota
  if (usageData.count >= usageData.quota) {
    return 0;
  }
  
  // Increment usage count and save
  usageData.count += 1;
  usageData.lastSearchTimestamp = Date.now();
  saveSearchUsage(usageData);
  
  // Return remaining searches
  return usageData.quota - usageData.count;
}

/**
 * Get number of searches remaining in quota
 */
export function getSearchesRemaining(): number {
  const usageData = getSearchUsage();
  return Math.max(0, usageData.quota - usageData.count);
}

/**
 * Reset usage tracking (for testing or admin purposes)
 */
export function resetSearchUsage(): void {
    if (typeof window === 'undefined') {
    // In server environment, just log the reset
    console.log('🔄 SEARCH QUOTA RESET: Server-side quota reset (development mode)');
    return;
  }
  localStorage.removeItem(SEARCH_USAGE_STORAGE_KEY);
  initializeSearchUsage();
}

/**
 * Force allow search (bypass quota for development)
 */
export function forceAllowSearch(): boolean {
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
  if (isDevelopment) {
    console.log('🔓 FORCE ALLOW: Development mode - bypassing search quota');
    return true;
  }
  return canPerformSearch();
}
 
