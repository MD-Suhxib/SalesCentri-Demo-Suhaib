export type Currency = 'INR' | 'GBP' | 'USD';

export interface ExchangeRates {
  INR: number;
  GBP: number;
}

/**
 * Round price based on currency-specific rules
 */
function roundPriceByCurrency(amount: number, currency: Currency): number {
  // Round to nearest whole number for all currencies
  return Math.round(amount);
}

/**
 * Convert price from one currency to another
 * Prices are rounded to whole numbers after conversion
 */
export function convertPrice(
  amount: number,
  from: Currency,
  to: Currency,
  rates: ExchangeRates
): number {
  if (from === to) {
    return amount;
  }
  
  // Convert to USD first if needed
  let usdAmount: number;
  if (from === 'USD') {
    usdAmount = amount;
  } else if (from === 'INR') {
    usdAmount = amount / rates.INR;
  } else if (from === 'GBP') {
    usdAmount = amount / rates.GBP;
  } else {
    usdAmount = amount;
  }
  
  // Convert from USD to target currency
  let convertedAmount: number;
  if (to === 'USD') {
    convertedAmount = usdAmount;
  } else if (to === 'INR') {
    convertedAmount = usdAmount * rates.INR;
  } else if (to === 'GBP') {
    convertedAmount = usdAmount * rates.GBP;
  } else {
    convertedAmount = usdAmount;
  }
  
  // Round the converted amount to eliminate decimals
  return roundPriceByCurrency(convertedAmount, to);
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  switch (currency) {
    case 'INR':
      return '₹';
    case 'GBP':
      return '£';
    case 'USD':
      return '$';
    default:
      return '$';
  }
}

/**
 * Format currency amount with proper symbol and formatting
 * Ensures no decimal places are shown for whole numbers
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  
  // Round to whole number to ensure no decimals
  const roundedAmount = Math.round(amount);
  
  // Format number based on currency locale
  let formattedAmount: string;
  
  if (currency === 'INR') {
    // Indian numbering system: 1,00,000 format
    formattedAmount = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  } else if (currency === 'GBP') {
    // UK formatting
    formattedAmount = new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  } else {
    // US formatting (default)
    formattedAmount = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  }
  
  return `${symbol}${formattedAmount}`;
}

/**
 * Format currency amount without symbol (just the number)
 * Ensures no decimal places are shown for whole numbers
 */
export function formatCurrencyAmount(amount: number, currency: Currency): string {
  // Round to whole number to ensure no decimals
  const roundedAmount = Math.round(amount);
  
  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  } else if (currency === 'GBP') {
    return new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  } else {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedAmount);
  }
}

