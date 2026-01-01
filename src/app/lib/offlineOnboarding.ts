/**
 * Offline JSON file operations for onboarding data
 * These functions work directly with the JSON file without API calls
 */

// Types
interface OnboardingData {
  userId: string;
  currentStep: string;
  salesObjective?: string;
  userRole?: string;
  immediateGoal?: string;
  companyWebsite?: string;
  marketFocus?: 'B2B' | 'B2C' | 'B2G';
  companyInfo?: {
    industry: string;
    revenueSize: string;
    employeeSize: string;
  };
  targetTitles?: string[];
  targetRegion?: string;
  hasTargetList?: boolean;
  contactListStatus?: {
    isUpToDate: boolean;
    isVerified: boolean;
    needsEnrichment: boolean;
  };
  outreachChannels?: string[];
  leadHandlingCapacity?: number;
  currentLeadGeneration?: number;
  budget?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  isAnonymous?: boolean;
}

interface OnboardingStorage {
  _metadata?: {
    version: string;
    created?: string;
    lastUpdated?: string;
    description: string;
  };
  users: Record<string, OnboardingData>;
}

// Client-side localStorage operations (for browser)
export const saveOnboardingDataOffline = (userId: string, data: Partial<OnboardingData>): void => {
  try {
    // Get existing data from localStorage
    const existingDataStr = localStorage.getItem('salesai_onboarding_data');
    const existingStorage: OnboardingStorage = existingDataStr 
      ? JSON.parse(existingDataStr)
      : { users: {} };

    // Ensure proper structure
    if (!existingStorage.users) {
      existingStorage.users = {};
    }

    const existing = existingStorage.users[userId];
    
    // Create updated onboarding data
    const onboardingData: OnboardingData = {
      ...existing,
      ...data,
      userId,
      currentStep: data.currentStep || 'start',
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAnonymous: userId.startsWith('anon_'),
    };

    // Update storage
    existingStorage.users[userId] = onboardingData;
    existingStorage._metadata = {
      version: "1.0",
      lastUpdated: new Date().toISOString(),
      description: "SalesAI onboarding data storage"
    };

    // Save to localStorage
    localStorage.setItem('salesai_onboarding_data', JSON.stringify(existingStorage, null, 2));
    
    console.log('Onboarding data saved offline for user:', userId);
  } catch (error) {
    console.error('Error saving onboarding data offline:', error);
    throw error;
  }
};

export const loadOnboardingDataOffline = (userId: string): OnboardingData | null => {
  try {
    // Get data from localStorage
    const existingDataStr = localStorage.getItem('salesai_onboarding_data');
    if (!existingDataStr) {
      return null;
    }

    const existingStorage: OnboardingStorage = JSON.parse(existingDataStr);
    
    if (!existingStorage.users || !existingStorage.users[userId]) {
      return null;
    }

    console.log('Onboarding data loaded offline for user:', userId);
    return existingStorage.users[userId];
  } catch (error) {
    console.error('Error loading onboarding data offline:', error);
    return null;
  }
};

export const getAllOnboardingDataOffline = (): OnboardingStorage => {
  try {
    const existingDataStr = localStorage.getItem('salesai_onboarding_data');
    if (!existingDataStr) {
      return { users: {} };
    }

    return JSON.parse(existingDataStr);
  } catch (error) {
    console.error('Error getting all onboarding data offline:', error);
    return { users: {} };
  }
};

export const clearOnboardingDataOffline = (userId?: string): void => {
  try {
    if (userId) {
      // Clear specific user data
      const existingDataStr = localStorage.getItem('salesai_onboarding_data');
      if (existingDataStr) {
        const existingStorage: OnboardingStorage = JSON.parse(existingDataStr);
        if (existingStorage.users && existingStorage.users[userId]) {
          delete existingStorage.users[userId];
          localStorage.setItem('salesai_onboarding_data', JSON.stringify(existingStorage, null, 2));
        }
      }
    } else {
      // Clear all data
      localStorage.removeItem('salesai_onboarding_data');
    }
    
    console.log('Onboarding data cleared offline', userId ? `for user: ${userId}` : '(all users)');
  } catch (error) {
    console.error('Error clearing onboarding data offline:', error);
  }
};
