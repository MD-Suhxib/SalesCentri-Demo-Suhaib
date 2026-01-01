import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface GeolocationResponse {
  country: string;
  countryCode: string;
  currency: 'INR' | 'GBP' | 'USD';
}

// Cache for geolocation results (in-memory, resets on server restart)
const geolocationCache = new Map<string, { data: GeolocationResponse; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  
  // Fallback to connection IP (may not be available in serverless)
  return request.ip || 'unknown';
}

function mapCountryToCurrency(countryCode: string): 'INR' | 'GBP' | 'USD' {
  const code = countryCode.toUpperCase();
  
  // India → INR
  if (code === 'IN') {
    return 'INR';
  }
  
  // UK → GBP
  if (code === 'GB' || code === 'UK') {
    return 'GBP';
  }
  
  // All others → USD
  return 'USD';
}

export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Log detected IP for debugging
    console.log('[Geolocation] Detected IP:', clientIP);
    
    // Determine if IP is private/localhost
    const isPrivateIP = clientIP === 'unknown' || 
                       clientIP === '127.0.0.1' || 
                       clientIP === '::1' || 
                       clientIP.startsWith('192.168.') || 
                       clientIP.startsWith('10.') || 
                       clientIP.startsWith('172.');
    
    // Check cache first
    if (!isPrivateIP) {
      // For public IPs, use IP as cache key
      const cached = geolocationCache.get(clientIP);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log('[Geolocation] Using cached result for IP:', clientIP);
        return NextResponse.json(cached.data);
      }
    } else {
      // For private IPs, check session-based cache keys
      // Try common session keys in order of likelihood
      const sessionKeys = ['session_US', 'session_IN', 'session_GB'];
      for (const sessionKey of sessionKeys) {
        const cached = geolocationCache.get(sessionKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          console.log('[Geolocation] Using cached session result:', sessionKey);
          return NextResponse.json(cached.data);
        }
      }
    }
    
    // Use free ip-api.com service (no API key required for basic usage)
    // If IP is localhost/private, call API without IP parameter to auto-detect from request origin
    let apiUrl: string;
    if (isPrivateIP) {
      // For localhost/private IPs, call API without IP to auto-detect from request origin
      console.log('[Geolocation] Local/private IP detected, using auto-detect');
      apiUrl = 'https://ip-api.com/json/?fields=status,country,countryCode';
    } else {
      apiUrl = `https://ip-api.com/json/${clientIP}?fields=status,country,countryCode`;
    }
    
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'SalesCentri-Pricing/1.0',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Geolocation API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('[Geolocation] API response:', data);
      
      if (data.status === 'success' && data.countryCode) {
        const result: GeolocationResponse = {
          country: data.country || 'United States',
          countryCode: data.countryCode,
          currency: mapCountryToCurrency(data.countryCode),
        };
        
        console.log('[Geolocation] Mapped to currency:', result.currency, 'for country:', result.country);
        
        // Cache the result using the detected IP or a session-based key
        const cacheKey = isPrivateIP 
          ? `session_${data.countryCode}`
          : clientIP;
        
        geolocationCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
        
        return NextResponse.json(result);
      } else {
        console.warn('[Geolocation] API returned unsuccessful status:', data);
      }
    } catch (apiError) {
      console.error('[Geolocation] API error:', apiError);
      // Fall through to default
    }
    
    // Fallback to USD if API fails
    const defaultResponse: GeolocationResponse = {
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
    };
    
    // Cache the fallback result using the same pattern as successful responses
    const fallbackCacheKey = isPrivateIP 
      ? 'session_US'  // Use session pattern for private IPs
      : clientIP;     // Use IP for public IPs
    
    geolocationCache.set(fallbackCacheKey, {
      data: defaultResponse,
      timestamp: Date.now(),
    });
    
    return NextResponse.json(defaultResponse);
  } catch (error) {
    console.error('Geolocation route error:', error);
    
    // Always return a valid response, defaulting to USD
    return NextResponse.json({
      country: 'United States',
      countryCode: 'US',
      currency: 'USD',
    });
  }
}

