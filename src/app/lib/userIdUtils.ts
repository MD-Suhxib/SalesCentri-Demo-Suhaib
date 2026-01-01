/**
 * Utility functions for managing user IDs, including anonymous users
 */

export const generateAnonymousUserId = (): string => {
  // Generate a unique ID using timestamp and random string
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  return `anon_${timestamp}_${randomString}`;
};

export const getOrCreateAnonymousUserId = (): string => {
  // Check if we already have an anonymous user ID in localStorage
  if (typeof window !== 'undefined') {
    const existingId = localStorage.getItem('salesai_anonymous_user_id');
    if (existingId) {
      return existingId;
    }
    
    // Generate new anonymous user ID and store it
    const newId = generateAnonymousUserId();
    localStorage.setItem('salesai_anonymous_user_id', newId);
    return newId;
  }
  
  // Fallback for server-side rendering
  return generateAnonymousUserId();
};

export const clearAnonymousUserId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('salesai_anonymous_user_id');
  }
};

export const isAnonymousUserId = (userId: string): boolean => {
  return userId.startsWith('anon_');
};

export const getUserId = (authenticatedUserId?: string): string => {
  if (authenticatedUserId) {
    return authenticatedUserId;
  }
  
  return getOrCreateAnonymousUserId();
};
