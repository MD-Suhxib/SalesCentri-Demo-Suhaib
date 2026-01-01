import paypal from '@paypal/checkout-server-sdk';

export function getPayPalClient() {
  const clientId = process.env.PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_SECRET || '';
  
  // Use PAYPAL_ENV environment variable (should match NEXT_PUBLIC_PAYPAL_ENV)
  // 'live' for production, 'sandbox' (or anything else) for development
  const environment = process.env.PAYPAL_ENV === 'live' 
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  return new paypal.core.PayPalHttpClient(environment);
}


