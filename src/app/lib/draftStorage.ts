/**
 * Draft Storage Utility
 * Handles saving, loading, and managing draft registration data
 * with automatic expiration and completion percentage tracking
 */

export type DraftType = 'marketplace' | 'partner';

interface DraftMetadata {
  savedAt: number; // timestamp
  expiresAt: number; // timestamp
  completionPercentage: number;
  lastStep: string;
}

interface BaseDraft<T> {
  data: T;
  metadata: DraftMetadata;
}

// Storage keys
const STORAGE_KEYS = {
  marketplace: 'salescentri_marketplace_draft',
  partner: 'salescentri_partner_draft',
} as const;

// Draft expiration time (7 days in milliseconds)
const DRAFT_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Save draft registration data to localStorage
 */
export function saveDraft<T>(
  type: DraftType,
  data: T,
  completionPercentage: number,
  lastStep: string
): boolean {
  try {
    const now = Date.now();
    const draft: BaseDraft<T> = {
      data,
      metadata: {
        savedAt: now,
        expiresAt: now + DRAFT_EXPIRATION_MS,
        completionPercentage,
        lastStep,
      },
    };
    localStorage.setItem(STORAGE_KEYS[type], JSON.stringify(draft));
    return true;
  } catch (error) {
    console.error(`Failed to save ${type} draft:`, error);
    return false;
  }
}

/**
 * Load draft registration data from localStorage
 */
export function loadDraft<T>(type: DraftType): BaseDraft<T> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS[type]);
    if (!stored) return null;

    const draft: BaseDraft<T> = JSON.parse(stored);
    
    // Check if draft has expired
    if (draft.metadata.expiresAt < Date.now()) {
      clearDraft(type);
      return null;
    }

    return draft;
  } catch (error) {
    console.error(`Failed to load ${type} draft:`, error);
    return null;
  }
}

/**
 * Clear draft data from localStorage
 */
export function clearDraft(type: DraftType): void {
  try {
    localStorage.removeItem(STORAGE_KEYS[type]);
  } catch (error) {
    console.error(`Failed to clear ${type} draft:`, error);
  }
}

/**
 * Check if a draft exists
 */
export function hasDraft(type: DraftType): boolean {
  return loadDraft(type) !== null;
}

/**
 * Get draft metadata only (without loading full data)
 */
export function getDraftMetadata(type: DraftType): DraftMetadata | null {
  const draft = loadDraft<unknown>(type);
  return draft?.metadata ?? null;
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(expiresAt: number): string {
  const now = Date.now();
  const remaining = expiresAt - now;
  
  if (remaining <= 0) return 'Expired';
  
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  
  if (days > 0) {
    return `${days} day${days === 1 ? '' : 's'} remaining`;
  }
  return `${hours} hour${hours === 1 ? '' : 's'} remaining`;
}

/**
 * Calculate marketplace registration completion percentage
 */
export interface MarketplaceRegistrationData {
  accountCategory?: string;
  individualType?: string;
  businessSize?: string;
  region?: string;
  businessType?: string;
  companyType?: string;
  companyDetails?: {
    companyLegalName?: string;
    website?: string;
    registeredAddress?: string;
    contactPersonName?: string;
    contactPersonId?: string;
    businessPhone?: string;
    businessEmail?: string;
    taxId?: string;
  };
  documents?: Record<string, unknown>;
}

export function calculateMarketplaceCompletion(
  data: MarketplaceRegistrationData,
  isAuthenticated: boolean
): { percentage: number; completedSteps: number; totalSteps: number } {
  const isIndividual = data.accountCategory === 'Individual';
  
  // Steps for Individual: Auth, Account Category, Business Role, Individual Type, Region, Company Details, Documents, Review
  // Steps for Business: Auth, Account Category, Business Role, Business Size, Region, Company Type, Company Details, Documents, Review
  
  let completedSteps = 0;
  
  // Step 1: Authentication
  if (isAuthenticated) completedSteps++;
  
  // Step 2: Account Category
  if (data.accountCategory) completedSteps++;
  
  // Step 3: Business Role
  if (data.businessType) completedSteps++;
  
  if (isIndividual) {
    // Step 4: Individual Type
    if (data.individualType) completedSteps++;
  } else {
    // Step 4: Business Size
    if (data.businessSize) completedSteps++;
  }
  
  // Step 5: Region
  if (data.region) completedSteps++;
  
  if (!isIndividual) {
    // Step 6: Company Type (Business only)
    if (data.companyType) completedSteps++;
  }
  
  // Step 6/7: Company Details
  if (data.companyDetails && Object.values(data.companyDetails).some(v => v)) {
    completedSteps++;
  }
  
  // Step 7/8: Documents
  if (data.documents && Object.keys(data.documents).length > 0) {
    completedSteps++;
  }
  
  const totalSteps = isIndividual ? 8 : 9;
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  
  return { percentage, completedSteps, totalSteps };
}

/**
 * Calculate partner registration completion percentage
 */
export interface PartnerRegistrationData {
  partnershipType?: string;
  country?: string;
  partnerDetails?: {
    companyLegalName?: string;
    companyName?: string;
    website?: string;
    registeredAddress?: string;
    contactPersonName?: string;
    contactPersonEmail?: string;
    contactPersonPhone?: string;
    taxId?: string;
    bankAccount?: string;
  };
  documents?: Record<string, unknown>;
}

export function calculatePartnerCompletion(
  data: PartnerRegistrationData,
  isAuthenticated: boolean
): { percentage: number; completedSteps: number; totalSteps: number } {
  // Steps: Auth, Partnership Type, Country, Details, Documents, Review
  const totalSteps = 6;
  let completedSteps = 0;
  
  // Step 1: Authentication
  if (isAuthenticated) completedSteps++;
  
  // Step 2: Partnership Type
  if (data.partnershipType) completedSteps++;
  
  // Step 3: Country
  if (data.country) completedSteps++;
  
  // Step 4: Details
  if (data.partnerDetails && Object.values(data.partnerDetails).some(v => v)) {
    completedSteps++;
  }
  
  // Step 5: Documents
  if (data.documents && Object.keys(data.documents).length > 0) {
    completedSteps++;
  }
  
  // Step 6: Review (counted as complete when submitting)
  
  const percentage = Math.round((completedSteps / totalSteps) * 100);
  
  return { percentage, completedSteps, totalSteps };
}

/**
 * Get step name based on progress
 */
export function getMarketplaceStepName(percentage: number, isIndividual: boolean): string {
  if (percentage < 15) return 'Authentication';
  if (percentage < 28) return 'Account Category';
  if (percentage < 42) return 'Business Role';
  if (isIndividual) {
    if (percentage < 55) return 'Individual Type';
    if (percentage < 68) return 'Region';
    if (percentage < 82) return 'Company Details';
    if (percentage < 95) return 'Documents';
    return 'Review';
  } else {
    if (percentage < 50) return 'Business Size';
    if (percentage < 60) return 'Region';
    if (percentage < 72) return 'Company Type';
    if (percentage < 84) return 'Company Details';
    if (percentage < 95) return 'Documents';
    return 'Review';
  }
}

export function getPartnerStepName(percentage: number): string {
  if (percentage < 17) return 'Authentication';
  if (percentage < 34) return 'Partnership Type';
  if (percentage < 50) return 'Country';
  if (percentage < 67) return 'Details';
  if (percentage < 84) return 'Documents';
  return 'Review';
}
