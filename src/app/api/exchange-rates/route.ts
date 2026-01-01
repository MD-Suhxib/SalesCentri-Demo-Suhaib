import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ExchangeRatesResponse {
  rates: {
    INR: number;
    GBP: number;
  };
  base: 'USD';
  timestamp: string;
}

// Cache for exchange rates (in-memory, resets on server restart)
let cachedRates: { data: ExchangeRatesResponse; timestamp: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Fallback rates (updated periodically, but static as backup)
const FALLBACK_RATES = {
  INR: 83.0, // Approximate USD to INR rate
  GBP: 0.79, // Approximate USD to GBP rate
};

async function fetchExchangeRates(): Promise<ExchangeRatesResponse | null> {
  try {
    // Use exchangerate-api.com free tier (no API key required for basic usage)
    // Alternative: fixer.io, exchangerate-api.com with API key for higher limits
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const apiUrl = apiKey 
      ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
      : 'https://api.exchangerate-api.com/v4/latest/USD';
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'SalesCentri-Pricing/1.0',
      },
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    if (!response.ok) {
      throw new Error(`Exchange rate API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different API response formats
    let inrRate: number;
    let gbpRate: number;
    
    if (data.rates) {
      // exchangerate-api.com format
      inrRate = data.rates.INR || FALLBACK_RATES.INR;
      gbpRate = data.rates.GBP || FALLBACK_RATES.GBP;
    } else if (data.conversion_rates) {
      // Alternative format
      inrRate = data.conversion_rates.INR || FALLBACK_RATES.INR;
      gbpRate = data.conversion_rates.GBP || FALLBACK_RATES.GBP;
    } else {
      throw new Error('Unexpected API response format');
    }
    
    return {
      rates: {
        INR: inrRate,
        GBP: gbpRate,
      },
      base: 'USD',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Exchange rate API error:', error);
    return null;
  }
}

export async function GET() {
  try {
    // Check cache first
    if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedRates.data);
    }
    
    // Fetch fresh rates
    const rates = await fetchExchangeRates();
    
    if (rates) {
      // Update cache
      cachedRates = {
        data: rates,
        timestamp: Date.now(),
      };
      return NextResponse.json(rates);
    }
    
    // If API fails, use fallback rates
    const fallbackResponse: ExchangeRatesResponse = {
      rates: FALLBACK_RATES,
      base: 'USD',
      timestamp: new Date().toISOString(),
    };
    
    // Cache fallback (shorter TTL)
    cachedRates = {
      data: fallbackResponse,
      timestamp: Date.now(),
    };
    
    return NextResponse.json(fallbackResponse);
  } catch (error) {
    console.error('Exchange rates route error:', error);
    
    // Always return a valid response with fallback rates
    return NextResponse.json({
      rates: FALLBACK_RATES,
      base: 'USD',
      timestamp: new Date().toISOString(),
    });
  }
}

