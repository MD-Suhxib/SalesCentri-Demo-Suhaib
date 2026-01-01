/**
 * Payment Handler
 * Centralized payment processing logic
 */

import type { PaymentGateway, PaymentMetadata } from './utils';
import { logPaymentEvent, validatePaymentAmount } from './utils';

export interface PaymentRequest {
  gateway: PaymentGateway;
  metadata: PaymentMetadata;
}

export interface PaymentResponse {
  success: boolean;
  url?: string;
  sessionId?: string;
  transactionId?: string;
  error?: string;
}

/**
 * Process payment request for any gateway
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const { gateway, metadata } = request;
  
  // Validate amount
  if (!validatePaymentAmount(metadata.amount)) {
    logPaymentEvent('validation_failed', gateway, metadata);
    return {
      success: false,
      error: 'Invalid payment amount',
    };
  }
  
  logPaymentEvent('payment_initiated', gateway, metadata);
  
  try {
    // Route to appropriate gateway handler
    const response = await fetch(`/api/${gateway}/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      logPaymentEvent('payment_failed', gateway, { ...metadata, error: errorData.error });
      return {
        success: false,
        error: errorData.error || 'Failed to create payment session',
      };
    }
    
    const data = await response.json();
    logPaymentEvent('payment_session_created', gateway, { ...metadata, sessionId: data.sessionId || data.id });
    
    return {
      success: true,
      url: data.url || data.checkout_url || data.approveUrl,
      sessionId: data.sessionId || data.id,
      transactionId: data.transactionId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logPaymentEvent('payment_error', gateway, { ...metadata, error: errorMessage });
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

