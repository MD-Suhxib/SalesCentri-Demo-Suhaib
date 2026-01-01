'use client';

import { useEffect, useState } from 'react';
import type { Currency } from '@/app/lib/currency';

interface GeolocationData {
  country: string;
  countryCode: string;
  currency: Currency;
}

interface UseCurrencyResult {
  currency: Currency;
  country: string | null;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'salescentri_currency';
const STORAGE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCachedCurrency(): { currency: Currency; timestamp: number } | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > STORAGE_TTL) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

function setCachedCurrency(currency: Currency): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currency,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore localStorage errors
  }
}

export function useCurrency(): UseCurrencyResult {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    // Check for URL parameter override (for testing)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const forceCurrency = urlParams.get('currency') as Currency | null;
      if (forceCurrency && ['USD', 'INR', 'GBP'].includes(forceCurrency)) {
        console.log('[useCurrency] Using forced currency from URL:', forceCurrency);
        setCurrency(forceCurrency);
        setLoading(false);
        return () => {
          mounted = false;
        };
      }
    }
    
    // Check cache first
    const cached = getCachedCurrency();
    if (cached) {
      setCurrency(cached.currency);
      setLoading(false);
      // Still fetch fresh data in background
    }
    
    // Fetch geolocation with timeout to prevent hanging on slow connections
    const fetchCurrency = async () => {
      try {
        // Set a timeout for the fetch request (10 seconds)
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch('/api/geolocation', {
          cache: 'no-store',
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (!response.ok) {
          throw new Error(`Geolocation API returned ${response.status}`);
        }
        
        const data: GeolocationData = await response.json();
        
        if (!mounted) return;
        
        // Validate the currency value
        if (data.currency && ['USD', 'INR', 'GBP'].includes(data.currency)) {
          console.log('[useCurrency] Server detected currency:', data.currency, 'for country:', data.country);
          
          // If server detected USD but we're on localhost, try client-side detection as fallback
          if (data.currency === 'USD' && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
            // Try browser locale and timezone detection as fallback
            const browserLocale = navigator.language || navigator.languages?.[0] || 'en-US';
            const localeCountry = browserLocale.split('-')[1]?.toUpperCase();
            
            // Check timezone as additional indicator (more reliable than locale)
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const isIndiaTimezone = timezone.includes('Calcutta') || timezone.includes('Kolkata') || 
                                   timezone.includes('Mumbai') || timezone.includes('Delhi') || 
                                   timezone.includes('Chennai') || timezone.includes('Bangalore') ||
                                   timezone.includes('Hyderabad') || timezone.includes('Pune') ||
                                   timezone === 'Asia/Kolkata' || timezone.startsWith('Asia/Calcutta');
            const isUKTimezone = timezone.includes('London') || timezone === 'Europe/London';
            
            console.log('[useCurrency] Browser locale:', browserLocale, 'Country code:', localeCountry, 'Timezone:', timezone);
            
            if (localeCountry === 'IN' || isIndiaTimezone) {
              console.log('[useCurrency] Overriding to INR based on browser locale/timezone');
              setCurrency('INR');
              setCountry('India');
              setError(null);
              setCachedCurrency('INR');
              return;
            } else if (localeCountry === 'GB' || localeCountry === 'UK' || isUKTimezone) {
              console.log('[useCurrency] Overriding to GBP based on browser locale/timezone');
              setCurrency('GBP');
              setCountry('United Kingdom');
              setError(null);
              setCachedCurrency('GBP');
              return;
            }
          }
          
          setCurrency(data.currency);
          setCountry(data.country);
          setError(null);
          setCachedCurrency(data.currency);
        } else {
          // Invalid currency, default to USD
          setCurrency('USD');
          setCountry(data.country || null);
          setError('Invalid currency detected');
        }
      } catch (err) {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        if (!mounted) return;
        
        // Don't log timeout errors as they're expected on slow connections
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Currency detection error:', err);
        }
        
        // If API fails and we're on localhost, try browser locale and timezone detection
        if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
          const browserLocale = navigator.language || navigator.languages?.[0] || 'en-US';
          const localeCountry = browserLocale.split('-')[1]?.toUpperCase();
          
          // Check timezone as additional indicator (more reliable than locale)
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const isIndiaTimezone = timezone.includes('Calcutta') || timezone.includes('Kolkata') || 
                                 timezone.includes('Mumbai') || timezone.includes('Delhi') || 
                                 timezone.includes('Chennai') || timezone.includes('Bangalore') ||
                                 timezone.includes('Hyderabad') || timezone.includes('Pune') ||
                                 timezone === 'Asia/Kolkata' || timezone.startsWith('Asia/Calcutta');
          const isUKTimezone = timezone.includes('London') || timezone === 'Europe/London';
          
          console.log('[useCurrency] API failed, trying browser locale/timezone:', browserLocale, 'Country code:', localeCountry, 'Timezone:', timezone);
          
          if (localeCountry === 'IN' || isIndiaTimezone) {
            console.log('[useCurrency] Using INR based on browser locale/timezone (API failed)');
            setCurrency('INR');
            setCountry('India');
            setError(null);
            setCachedCurrency('INR');
            if (mounted) {
              setLoading(false);
            }
            return;
          } else if (localeCountry === 'GB' || localeCountry === 'UK' || isUKTimezone) {
            console.log('[useCurrency] Using GBP based on browser locale/timezone (API failed)');
            setCurrency('GBP');
            setCountry('United Kingdom');
            setError(null);
            setCachedCurrency('GBP');
            if (mounted) {
              setLoading(false);
            }
            return;
          }
        }
        
        setError(err instanceof Error && err.name !== 'AbortError' 
          ? err.message 
          : 'Failed to detect currency');
        
        // Only update currency if we don't have a cached value
        if (!cached) {
          setCurrency('USD');
          setCountry(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    // Only fetch if not cached, or fetch in background if cached
    if (!cached) {
      fetchCurrency();
    } else {
      // Fetch in background to update cache
      fetchCurrency();
    }
    
    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
  
  return { currency, country, loading, error };
}

