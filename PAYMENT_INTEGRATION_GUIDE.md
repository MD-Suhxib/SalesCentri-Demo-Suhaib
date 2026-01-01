# Payment Gateway Integration Guide

## Overview

This guide documents the payment gateway integration for Stripe (with the existing PayPal flow preserved). Hosted checkout pages are used for secure payment processing.

## Environment Variables

Add these environment variables to your `.env.local` file or your hosting platform's environment settings:

### Stripe Configuration

```env
# Stripe Checkout Configuration
STRIPE_SECRET_KEY=sk_test_...                    # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_...                # Your Stripe publishable key (for future use)
STRIPE_WEBHOOK_SECRET=whsec_...                   # Webhook signing secret from Stripe dashboard
STRIPE_ENV=sandbox                                # 'live' or 'sandbox'
STRIPE_CURRENCY=USD
STRIPE_SUCCESS_URL=https://yourdomain.com/api/stripe/success
STRIPE_CANCEL_URL=https://yourdomain.com/checkout?cancelled=true
```

### Base URL Configuration

```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com       # Your production domain
```

## File Structure

```
src/app/
├── checkout/page.tsx                              # Updated checkout page with Stripe + PayPal options
├── api/
│   ├── stripe/
│   │   ├── create-session/route.ts               # Creates Stripe checkout session
│   │   ├── webhook/route.ts                      # Handles Stripe webhooks
│   │   └── success/route.ts                      # Handles successful Stripe payments
│   └── paypal/...                                 # Existing PayPal integration
└── lib/payment/
    ├── utils.ts                                   # Payment utility functions
    └── handler.ts                                 # Centralized payment handler
```

## Implementation Details

### Payment Utilities (`src/app/lib/payment/utils.ts`)

Provides shared utilities:
- `getGatewayUrl()` - Maps gateway name to API routes (Stripe)
- `redirectToGateway()` - Safe frontend redirect helper
- `generateOrderId()` - Unified order ID generator
- `logPaymentEvent()` - Centralized logging
- `validatePaymentAmount()` - Amount validation
- `getPaymentUrls()` - Success/cancel URL helpers
- `formatPaymentMetadata()` / `parsePaymentMetadata()` - Metadata handling

### Payment Handler (`src/app/lib/payment/handler.ts`)

Centralized payment processing that routes to the appropriate gateway:
- `processPayment()` - Main payment processing function

### Stripe Integration

**Flow:**
1. User selects Stripe payment method
2. Frontend calls `/api/stripe/create-session` with payment metadata
3. Backend creates Stripe Checkout Session
4. User redirected to Stripe-hosted checkout page
5. After payment, Stripe redirects to `/api/stripe/success`
6. Webhook at `/api/stripe/webhook` receives payment confirmation

**Features:**
- Hosted checkout (no card fields on your site)
- Webhook signature verification
- Automatic payment confirmation

## Checkout Page Updates

The checkout page (`src/app/checkout/page.tsx`) now includes:

1. **Payment Method Selection** (Step 3):
   - Stripe - "Pay with credit/debit card"
   - PayPal - "Pay with PayPal account" (existing)

2. **Unified Payment Handler**:
   - Routes to Stripe for hosted checkout sessions
   - Handles PayPal separately (existing flow)
   - Shows loading state during processing

3. **Dynamic Payment Button**:
   - Button text changes based on selected payment method
   - Shows loading spinner during processing

## Webhook Configuration

### Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Testing Checklist

### Stripe
- [ ] Test hosted checkout redirect
- [ ] Test successful payment flow
- [ ] Test cancel flow
- [ ] Verify webhook receives events
- [ ] Test webhook signature verification

### All Gateways
- [ ] Success redirects work correctly
- [ ] Cancel redirects work correctly
- [ ] Error handling displays appropriate messages
- [ ] Payment metadata is correctly stored
- [ ] User email is captured when available

## Security Considerations

1. **Secret Keys**: Never expose secret keys in client-side code
2. **Webhook Verification**: Always verify webhook signatures
3. **Amount Validation**: Server-side validation of payment amounts
4. **HTTPS Only**: All success/cancel URLs should use HTTPS
5. **Order Verification**: Verify payment status before fulfilling orders

## Next Steps

1. **Configure Environment Variables**: Add required Stripe keys to your environment
2. **Test Stripe Gateway**: Test in sandbox/test mode first
3. **Database Integration**: Replace in-memory payment storage with database
4. **Email Notifications**: Add payment confirmation emails
5. **Admin Dashboard**: Create admin interface to view payments

## Notes

- Payment storage currently uses in-memory arrays (should be migrated to database in production)
- The Stripe integration reuses the shared payment metadata structure for consistency
- The checkout page maintains backward compatibility with the existing PayPal integration

