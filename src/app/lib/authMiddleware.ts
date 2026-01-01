import { NextRequest, NextResponse } from 'next/server';

export interface AuthenticatedUser {
  uid: string;
  email: string;
}

export const authenticate = async (request: NextRequest): Promise<AuthenticatedUser | null> => {
  try {
    const authorization = request.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return null;
    }

    const token = authorization.split(' ')[1];
    
    if (!token) {
      return null;
    }

    // Validate token by calling the profile API (same as validateAuthenticationAsync)
    try {
      const response = await fetch('https://app.demandintellect.com/app/api/profile.php', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Token is valid, get user info from profile
        const profile = await response.json();
        
        // Extract user info from profile
        if (profile?.user?.id && profile?.user?.email) {
          return {
            uid: String(profile.user.id),
            email: profile.user.email
          };
        }
        
        // Fallback: try to decode JWT if profile doesn't have expected structure
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.uid || payload.sub) {
              return {
                uid: String(payload.uid || payload.sub),
                email: payload.email || profile?.user?.email || ''
              };
            }
          }
        } catch {
          // JWT decode failed, but profile API succeeded, so token is valid
          return {
            uid: String(profile?.user?.id || '0'),
            email: profile?.user?.email || ''
          };
        }
      } else if (response.status === 401) {
        // Token is invalid
        return null;
      } else {
        // Other error - don't authenticate but don't fail
        return null;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      // On network error, don't authenticate but don't crash
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

export const requireAuth = (handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>) => {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await authenticate(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return handler(request, user);
  };
};

// Direct auth check function for use in route handlers
export const checkAuth = async (request: NextRequest) => {
  const user = await authenticate(request);
  
  if (!user) {
    return {
      error: 'Unauthorized',
      status: 401
    };
  }
  
  return { user };
};
