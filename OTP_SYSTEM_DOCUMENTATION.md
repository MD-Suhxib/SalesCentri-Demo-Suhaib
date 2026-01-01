# OTP System Documentation

## Overview

Complete OTP (One-Time Password) implementation with email delivery, rate limiting, expiration, and security best practices for the Let's Talk lead capture system.

## Features

✅ **6-digit numeric OTP generation**
✅ **3-minute expiration** with automatic cleanup
✅ **Maximum 3 verification attempts** per OTP
✅ **Rate limiting**: 3 OTP requests per 15 minutes per email
✅ **Email delivery** via Nodemailer with professional HTML templates
✅ **In-memory storage** (ready for Redis migration)
✅ **Development mode** bypass for reCAPTCHA
✅ **Welcome email** after successful verification

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  User Submits Form                  │
│            (Email + Phone + reCAPTCHA)              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│         POST /api/lead-capture/send-otp             │
│  • Validate inputs                                  │
│  • Check rate limiting (3 per 15 min)              │
│  • Verify reCAPTCHA (skipped in dev)               │
│  • Generate 6-digit OTP                             │
│  • Store OTP with 3-min expiry                      │
│  • Send email via Nodemailer                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│       User Receives Email & Enters OTP              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│        POST /api/lead-capture/verify-otp            │
│  • Validate OTP format (6 digits)                   │
│  • Check expiration (3 minutes)                     │
│  • Check attempts (max 3)                           │
│  • Verify OTP match                                 │
│  • Delete OTP on success                            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│      User Selects Objective & Submits              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│         POST /api/lead-capture/submit               │
│  • Store lead in database (TODO)                    │
│  • Send welcome email                               │
│  • Notify sales team (TODO)                         │
└─────────────────────────────────────────────────────┘
```

## Files Created

### Core Libraries

1. **`src/app/lib/otp.ts`** - OTP Management Library
   - `generateOTP(length)` - Generate secure random OTP
   - `storeOTP(identifier, otp, email, phone)` - Store with expiration
   - `verifyOTP(identifier, inputOTP)` - Verify with attempt tracking
   - `checkRateLimit(identifier)` - Rate limiting logic
   - `cleanupExpiredOTPs()` - Auto-cleanup utility

2. **`src/app/lib/email.ts`** - Email Service
   - `sendOTPEmail(email, otp, expiryMinutes)` - Send OTP with HTML template
   - `sendWelcomeEmail(email, name, objective)` - Post-verification welcome
   - Beautiful HTML templates with SalesCentri branding

### API Routes

3. **`src/app/api/lead-capture/send-otp/route.ts`**
   - Validates email and phone
   - Checks rate limiting
   - Verifies reCAPTCHA (skipped in dev)
   - Generates and stores OTP
   - Sends email via Nodemailer

4. **`src/app/api/lead-capture/verify-otp/route.ts`**
   - Validates OTP format
   - Checks expiration and attempts
   - Returns remaining attempts on failure

5. **`src/app/api/lead-capture/submit/route.ts`**
   - Stores verified lead data
   - Sends welcome email
   - Ready for CRM integration

## Configuration

### Environment Variables

```env
# SMTP Configuration (Microsoft 365)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=No-Reply@Salescentri.com
SMTP_PASS="Asrum3owSp7#F5t1"
SMTP_ENCRYPTION=tls
SMTP_FROM_EMAIL=No-Reply@salescentri.com
SMTP_FROM_NAME=Salescentri

# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LcBMxgsAAAAAPGN83gm3_o0kJC-6X07d7ECwsZ2
RECAPTCHA_SECRET_KEY=6LcBMxgsAAAAAL4itXZzSbYrfASlxDZBF2V4bnn4
```

### OTP Settings (in `otp.ts`)

```typescript
const OTP_CONFIG = {
  LENGTH: 6,                    // OTP length
  EXPIRY_MINUTES: 3,            // Expiration time
  MAX_ATTEMPTS: 3,              // Verification attempts
  RATE_LIMIT: {
    MAX_REQUESTS: 3,            // Max OTP requests
    WINDOW_MINUTES: 15,         // Time window
  },
};
```

## Security Features

### 1. **Rate Limiting**
- Maximum 3 OTP requests per email within 15 minutes
- Prevents spam and abuse
- Returns retry time on limit exceeded

### 2. **Expiration**
- OTPs expire after 3 minutes
- Automatic cleanup of expired OTPs
- User must request new OTP if expired

### 3. **Attempt Limiting**
- Maximum 3 verification attempts per OTP
- OTP deleted after max attempts
- Shows remaining attempts to user

### 4. **reCAPTCHA v3**
- Prevents bot submissions
- Score-based validation (threshold: 0.5)
- Bypassed in development mode

### 5. **Input Validation**
- Email format validation
- 6-digit numeric OTP format
- Required field checks

## Email Templates

### OTP Email

**Subject**: `Your SalesCentri Verification Code: 123456`

Features:
- 🎨 Beautiful HTML with gradient backgrounds
- 📱 Responsive design
- 🔐 Security warnings
- ⏱️ Expiration notice
- 🌟 SalesCentri branding

### Welcome Email

**Subject**: `Welcome to SalesCentri - We've received your request!`

Features:
- 🎉 Welcoming design
- ✅ Confirmation of objective
- 📞 Response time expectation (24 hours)
- 🔗 Call-to-action button

## Usage Example

### Frontend Flow

```typescript
// Step 1: Send OTP
const response = await fetch('/api/lead-capture/send-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    phone: '+1234567890',
    recaptchaToken: 'token_from_grecaptcha',
  }),
});

// Step 2: Verify OTP
const verifyResponse = await fetch('/api/lead-capture/verify-otp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    otp: '123456',
  }),
});

// Step 3: Submit Lead
const submitResponse = await fetch('/api/lead-capture/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    phone: '+1234567890',
    objective: 'Sales',
  }),
});
```

## Testing

### Development Mode

In development (`NODE_ENV=development`):
- ✅ reCAPTCHA verification is bypassed
- ✅ OTP is logged to console
- ✅ OTP is returned in API response (`debug.otp`)

Console output:
```
[OTP] Generated for user@example.com: 123456 (expires in 3 minutes)
[Email] OTP sent successfully: { messageId: '...', recipient: 'user@example.com' }
```

### Testing OTP Flow

1. **Request OTP**: Check console for OTP code
2. **Verify OTP**: Use the logged OTP
3. **Test Expiration**: Wait 3+ minutes, OTP should be invalid
4. **Test Attempts**: Enter wrong OTP 3 times, should block
5. **Test Rate Limit**: Request OTP 4 times quickly, 4th should fail

## Production Checklist

### Before Deployment

- [ ] **Replace In-Memory Storage with Redis**
  ```typescript
  // Install Redis client
  npm install redis
  
  // Update otp.ts to use Redis
  import { createClient } from 'redis';
  const redis = createClient({ url: process.env.REDIS_URL });
  ```

- [ ] **Configure reCAPTCHA Domains**
  1. Go to https://www.google.com/recaptcha/admin
  2. Add production domain to allowed domains
  3. Verify site key and secret are correct

- [ ] **Remove Debug OTP from API Response**
  ```typescript
  // In send-otp/route.ts, remove:
  ...(isDevelopment && { debug: { otp } }),
  ```

- [ ] **Set Up Database for Leads**
  ```typescript
  // Add to submit/route.ts:
  await db.leads.create({
    email,
    phone,
    objective,
    verified: true,
    createdAt: new Date(),
  });
  ```

- [ ] **Configure SMTP for Production**
  - Verify SMTP credentials work
  - Test email delivery
  - Set up SPF/DKIM records

- [ ] **Add CRM Integration**
  ```typescript
  // Options: Salesforce, HubSpot, Pipedrive, etc.
  await sendToSalesforce(leadData);
  ```

- [ ] **Set Up Monitoring**
  - Log failed OTP attempts
  - Monitor rate limit hits
  - Track email delivery failures

- [ ] **Add Analytics**
  ```typescript
  // Track conversion funnel:
  analytics.track('otp_requested', { email });
  analytics.track('otp_verified', { email });
  analytics.track('lead_submitted', { email, objective });
  ```

## Migration to Redis

### Why Redis?

- ✅ Scalable across multiple servers
- ✅ Built-in TTL (time-to-live)
- ✅ Atomic operations
- ✅ Production-ready

### Redis Implementation

```typescript
import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err) => console.error('Redis error:', err));
await redis.connect();

// Store OTP with automatic expiration
await redis.setEx(
  `otp:${identifier}`,
  180, // 3 minutes in seconds
  JSON.stringify({ otp, email, phone, attempts: 0 })
);

// Retrieve OTP
const data = await redis.get(`otp:${identifier}`);
const record = JSON.parse(data);

// Delete OTP
await redis.del(`otp:${identifier}`);
```

## Error Handling

### Common Errors

| Error | Status | Cause | Solution |
|-------|--------|-------|----------|
| `Invalid email format` | 400 | Malformed email | Validate input |
| `Too many OTP requests` | 429 | Rate limit exceeded | Wait 15 minutes |
| `OTP expired` | 400 | 3+ minutes elapsed | Request new OTP |
| `Invalid OTP` | 400 | Wrong code entered | Try again (3 attempts) |
| `Maximum attempts exceeded` | 400 | 3 failed attempts | Request new OTP |
| `Failed to send email` | 500 | SMTP error | Check SMTP config |
| `reCAPTCHA failed` | 400 | Low score or invalid | Retry submission |

## Monitoring & Logging

### Key Metrics to Track

1. **OTP Request Rate**: Requests per minute
2. **Verification Success Rate**: Successful verifications / Total attempts
3. **Email Delivery Rate**: Sent / Failed emails
4. **Average Time to Verify**: Time between send and verify
5. **Rate Limit Hits**: Number of blocked requests
6. **Expiration Rate**: OTPs expired before verification

### Log Format

```
[OTP] Generated for user@example.com: 123456 (expires in 3 minutes)
[Email] OTP sent successfully: { messageId: 'abc123', recipient: 'user@example.com' }
[OTP] Verification successful for: user@example.com
[Lead Capture] New verified lead: { email: 'user@example.com', objective: 'Sales' }
```

## Future Enhancements

### Potential Improvements

1. **SMS Delivery** (via Twilio)
   ```typescript
   import twilio from 'twilio';
   const client = twilio(accountSid, authToken);
   await client.messages.create({
     body: `Your OTP is ${otp}`,
     to: phone,
     from: twilioNumber,
   });
   ```

2. **Multi-Channel Delivery**
   - Send to both email and SMS
   - User chooses preferred channel

3. **Persistent Storage**
   - PostgreSQL for lead data
   - Redis for OTP cache

4. **Advanced Analytics**
   - Conversion funnel tracking
   - A/B testing for email templates
   - Geographic distribution

5. **Admin Dashboard**
   - View recent leads
   - Monitor OTP statistics
   - Manually verify users

## Support

For issues or questions:
- Check server logs for detailed error messages
- Verify SMTP configuration
- Test reCAPTCHA keys in Google Console
- Ensure environment variables are set

## License

Part of the SalesCentri application. All rights reserved.
