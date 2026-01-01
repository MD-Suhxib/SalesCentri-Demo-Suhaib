/**
 * Payment Gateway Utilities
 * Shared utilities for payment processing across all gateways
 */

export type PaymentGateway = 'stripe';

export interface PaymentMetadata {
  segment: 'Personal' | 'Business' | 'Funnel Level';
  billingCycle: 'Monthly' | 'Yearly';
  planName?: string;
  funnelLevel?: string;
  leadGenName?: string;
  amount: number;
  currency: string;
  orderId: string;
  userEmail?: string;
}

/**
 * Maps gateway name to API route
 */
export function getGatewayUrl(gateway: PaymentGateway, action: 'create-session' | 'webhook' | 'success' | 'cancel' = 'create-session'): string {
  const basePath = `/api/${gateway}`;

  switch (action) {
    case 'create-session':
      return `${basePath}/create-session`;
    case 'webhook':
      return `${basePath}/webhook`;
    case 'success':
    case 'cancel':
      return `${basePath}/success`;
    default:
      return `${basePath}/create-session`;
  }
}

/**
 * Safe frontend redirect helper
 */
export function redirectToGateway(url: string): void {
  if (typeof window !== 'undefined' && url) {
    window.location.href = url;
  }
}

/**
 * Unified order ID generator
 */
export function generateOrderId(): string {
  return `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Centralized payment event logging
 */
export function logPaymentEvent(
  event: string,
  gateway: PaymentGateway,
  metadata: Partial<PaymentMetadata> & { [key: string]: any }
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    gateway,
    ...metadata,
  };
  
  console.log(`[Payment Event] ${event}`, logData);
  
  // In production, you might want to send this to a logging service
  // Example: sendToLoggingService(logData);
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && amount <= 1000000; // Max $1M
}

/**
 * Get success/cancel URLs based on environment
 */
export function getPaymentUrls(gateway: PaymentGateway): { successUrl: string; cancelUrl: string } {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ||
                  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  const successUrl = process.env.STRIPE_SUCCESS_URL || `${baseUrl}/api/${gateway}/success`;
  const cancelUrl = process.env.STRIPE_CANCEL_URL || `${baseUrl}/checkout?cancelled=true`;

  return { successUrl, cancelUrl };
}

/**
 * Format payment metadata for storage
 */
export function formatPaymentMetadata(metadata: PaymentMetadata): Record<string, string> {
  return {
    segment: metadata.segment,
    billingCycle: metadata.billingCycle,
    planName: metadata.planName || '',
    funnelLevel: metadata.funnelLevel || '',
    leadGenName: metadata.leadGenName || '',
    amount: metadata.amount.toFixed(2),
    currency: metadata.currency,
    orderId: metadata.orderId,
    userEmail: metadata.userEmail || '',
  };
}

/**
 * Parse payment metadata from stored format
 */
export function parsePaymentMetadata(stored: Record<string, any>): PaymentMetadata | null {
  try {
    return {
      segment: stored.segment as 'Personal' | 'Business' | 'Funnel Level',
      billingCycle: stored.billingCycle as 'Monthly' | 'Yearly',
      planName: stored.planName || undefined,
      funnelLevel: stored.funnelLevel || undefined,
      leadGenName: stored.leadGenName || undefined,
      amount: parseFloat(stored.amount || '0'),
      currency: stored.currency || 'USD',
      orderId: stored.orderId || generateOrderId(),
      userEmail: stored.userEmail || undefined,
    };
  } catch (error) {
    console.error('Error parsing payment metadata:', error);
    return null;
  }
}

