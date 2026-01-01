// Authentication utilities for token management
export const TOKEN_KEYS = {
  TOKEN: 'salescentri_token',
  REFRESH_TOKEN: 'salescentri_refreshToken',
  EXPIRES_AT: 'salescentri_expiresAt',
} as const;

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface UserProfile {
  user: {
    id: number;
    email: string;
    organization_id: number;
    role: string;
    job_title?: string;
    linkedin_profile?: string;
    last_login_at: string;
    auth_provider: string;
    created_at: string;
  };
  organization: {
    id: number;
    name: string;
    website?: string;
    industry?: string;
    description?: string;
    linkedin_page?: string;
    created_at: string;
  };
}

export const saveTokens = (tokens: AuthTokens): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(TOKEN_KEYS.TOKEN, tokens.token);
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  localStorage.setItem(TOKEN_KEYS.EXPIRES_AT, tokens.expiresAt);

  // Notify same-tab listeners (storage events don't fire in the same tab)
  window.dispatchEvent(new Event('salescentri-auth-changed'));
};

export const getTokens = (): AuthTokens | null => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem(TOKEN_KEYS.TOKEN);
  const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  const expiresAt = localStorage.getItem(TOKEN_KEYS.EXPIRES_AT);
  
  if (!token || !refreshToken || !expiresAt) return null;
  
  return { token, refreshToken, expiresAt };
};

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TOKEN_KEYS.TOKEN);
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(TOKEN_KEYS.EXPIRES_AT);

  // Notify same-tab listeners (storage events don't fire in the same tab)
  window.dispatchEvent(new Event('salescentri-auth-changed'));
};

export const isTokenExpired = (): boolean => {
  const tokens = getTokens();
  if (!tokens) return true;
  
  // Convert local time to UTC and check expiry
  const expiresAtUTC = new Date(tokens.expiresAt).getTime();
  const nowUTC = new Date().getTime();
  
  return nowUTC >= expiresAtUTC;
};

// Phase 1: Check token validity and fetch user profile
export const validateAuthenticationAsync = async (): Promise<{ isAuthenticated: boolean; profile?: UserProfile }> => {
  try {
    // First check if token exists and is not expired
    if (isTokenExpired()) {
      return { isAuthenticated: false };
    }

    const tokens = getTokens();
    if (!tokens) {
      return { isAuthenticated: false };
    }

    // Make request to profile API with Bearer token
    const response = await fetch('https://app.demandintellect.com/app/api/profile.php', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      // User is authenticated, parse and return profile
      const profile: UserProfile = await response.json();
      return { isAuthenticated: true, profile };
    } else if (response.status === 401) {
      // Token is invalid, clear tokens from localStorage
      clearTokens();
      return { isAuthenticated: false };
    } else {
      // Other error, assume not authenticated
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.error('Authentication validation error:', error);
    // On error, assume not authenticated but don't clear tokens
    // (might be network issue)
    return { isAuthenticated: false };
  }
};

// Client-side authentication check utility
// Returns true if user appears to be authenticated (has valid token)
// Note: This is a quick client-side check. For server-side validation, use validateAuthenticationAsync
export const checkAuthQuick = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const tokens = getTokens();
  if (!tokens) return false;
  
  // Check if token is expired
  if (isTokenExpired()) {
    return false;
  }
  
  return true;
};

// Utility to require authentication and redirect if not authenticated
// Use this before API calls or actions that require authentication
export const requireAuthOrRedirect = (redirectToLogin: () => void): boolean => {
  const isAuth = checkAuthQuick();
  if (!isAuth) {
    console.log('🔐 Authentication required - redirecting to login');
    redirectToLogin();
    return false;
  }
  return true;
};

// Legacy function for backward compatibility - now async
export const isAuthenticated = (): boolean => {
  const tokens = getTokens();
  return tokens !== null && !isTokenExpired();
};

export const getAuthHeaders = (): { Authorization: string } | Record<string, never> => {
  const tokens = getTokens();
  if (!tokens || isTokenExpired()) return {};
  
  return {
    Authorization: `Bearer ${tokens.token}`
  };
};

// Get user profile from localStorage or API
export const getUserProfile = async (): Promise<UserProfile | null> => {
  const result = await validateAuthenticationAsync();
  return result.profile || null;
};
