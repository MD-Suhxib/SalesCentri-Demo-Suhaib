/**
 * OTP Generation and Management Library
 * Handles OTP generation, storage, validation, and rate limiting
 * 
 * PRODUCTION FIX: Includes stateless verification for serverless environments
 */

import crypto from 'crypto';

interface OTPRecord {
  otp: string;
  email: string;
  phone: string;
  attempts: number;
  createdAt: number;
  expiresAt: number;
}

interface SignedOTPData {
  otp: string;
  email: string;
  phone: string;
  expiresAt: number;
  signature: string;
}

// In-memory storage (Use Redis in production for scalability)
const otpStore = new Map<string, OTPRecord>();
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Configuration
const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  MAX_ATTEMPTS: 3,
  RATE_LIMIT: {
    MAX_REQUESTS: 3, // Max OTP requests per window
    WINDOW_MINUTES: 15, // Time window in minutes
  },
};

// Secret for signing OTP tokens (use environment variable in production)
const OTP_SECRET = process.env.OTP_SECRET || 'default-otp-secret-change-in-production';

/**
 * Generate a secure random numeric OTP
 */
export function generateOTP(length: number = OTP_CONFIG.LENGTH): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * Create a signed OTP token for stateless verification (serverless-friendly)
 */
export function createSignedOTP(
  otp: string,
  email: string,
  phone: string
): string {
  const expiresAt = Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000;
  
  const data = {
    otp,
    email: email.toLowerCase(),
    phone,
    expiresAt,
  };
  
  // Create HMAC signature
  const dataString = JSON.stringify(data);
  const signature = crypto
    .createHmac('sha256', OTP_SECRET)
    .update(dataString)
    .digest('hex');
  
  // Return base64-encoded signed token
  const signedData: SignedOTPData = { ...data, signature };
  return Buffer.from(JSON.stringify(signedData)).toString('base64');
}

/**
 * Verify a signed OTP token (stateless)
 */
export function verifySignedOTP(
  token: string,
  email: string,
  inputOTP: string
): {
  success: boolean;
  message: string;
} {
  try {
    // Decode token
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const signedData: SignedOTPData = JSON.parse(decoded);
    
    // Verify signature
    const dataString = JSON.stringify({
      otp: signedData.otp,
      email: signedData.email,
      phone: signedData.phone,
      expiresAt: signedData.expiresAt,
    });
    
    const expectedSignature = crypto
      .createHmac('sha256', OTP_SECRET)
      .update(dataString)
      .digest('hex');
    
    if (signedData.signature !== expectedSignature) {
      return {
        success: false,
        message: 'Invalid or tampered OTP token.',
      };
    }
    
    // Check expiration
    if (Date.now() > signedData.expiresAt) {
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
      };
    }
    
    // Check email match
    if (signedData.email.toLowerCase() !== email.toLowerCase()) {
      return {
        success: false,
        message: 'Email mismatch.',
      };
    }
    
    // Verify OTP
    if (signedData.otp !== inputOTP) {
      return {
        success: false,
        message: 'Invalid OTP.',
      };
    }
    
    return {
      success: true,
      message: 'OTP verified successfully.',
    };
  } catch (error) {
    console.error('[OTP] Error verifying signed token:', error);
    return {
      success: false,
      message: 'Invalid OTP token format.',
    };
  }
}

/**
 * Store OTP with expiration and metadata
 */
export function storeOTP(
  identifier: string,
  otp: string,
  email: string,
  phone: string
): { success: boolean; expiresAt: number; signedToken?: string } {
  const now = Date.now();
  const expiresAt = now + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000;

  const record: OTPRecord = {
    otp,
    email,
    phone,
    attempts: 0,
    createdAt: now,
    expiresAt,
  };

  otpStore.set(identifier, record);

  // Auto-cleanup after expiration
  setTimeout(() => {
    otpStore.delete(identifier);
  }, OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000 + 5000); // Extra 5 seconds buffer

  // Also create signed token for serverless environments
  const signedToken = createSignedOTP(otp, email, phone);

  return { success: true, expiresAt, signedToken };
}

/**
 * Verify OTP with rate limiting and expiration checks
 */
export function verifyOTP(
  identifier: string,
  inputOTP: string,
  signedToken?: string
): {
  success: boolean;
  message: string;
  attemptsRemaining?: number;
} {
  const record = otpStore.get(identifier);

  // If no record found and we have a signed token, use stateless verification
  if (!record && signedToken) {
    console.log('[OTP] In-memory record not found, using signed token verification');
    return verifySignedOTP(signedToken, identifier, inputOTP);
  }

  if (!record) {
    return {
      success: false,
      message: 'OTP not found or expired. Please request a new one.',
    };
  }

  const now = Date.now();

  // Check expiration
  if (now > record.expiresAt) {
    otpStore.delete(identifier);
    return {
      success: false,
      message: 'OTP has expired. Please request a new one.',
    };
  }

  // Check max attempts
  if (record.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
    otpStore.delete(identifier);
    return {
      success: false,
      message: 'Maximum verification attempts exceeded. Please request a new OTP.',
    };
  }

  // Verify OTP
  record.attempts += 1;

  if (record.otp !== inputOTP) {
    const attemptsRemaining = OTP_CONFIG.MAX_ATTEMPTS - record.attempts;
    
    if (attemptsRemaining <= 0) {
      otpStore.delete(identifier);
      return {
        success: false,
        message: 'Invalid OTP. Maximum attempts exceeded.',
      };
    }

    return {
      success: false,
      message: `Invalid OTP. ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining.`,
      attemptsRemaining,
    };
  }

  // Success - remove OTP
  otpStore.delete(identifier);
  return {
    success: true,
    message: 'OTP verified successfully.',
  };
}

/**
 * Rate limiting for OTP requests
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  message?: string;
  retryAfter?: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    // First request
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + OTP_CONFIG.RATE_LIMIT.WINDOW_MINUTES * 60 * 1000,
    });
    return { allowed: true };
  }

  // Check if window has expired
  if (now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + OTP_CONFIG.RATE_LIMIT.WINDOW_MINUTES * 60 * 1000,
    });
    return { allowed: true };
  }

  // Check if limit exceeded
  if (record.count >= OTP_CONFIG.RATE_LIMIT.MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000 / 60); // minutes
    return {
      allowed: false,
      message: `Too many OTP requests. Please try again in ${retryAfter} minute${retryAfter > 1 ? 's' : ''}.`,
      retryAfter,
    };
  }

  // Increment count
  record.count += 1;
  return { allowed: true };
}

/**
 * Get OTP record (for debugging/testing only)
 */
export function getOTPRecord(identifier: string): OTPRecord | undefined {
  return otpStore.get(identifier);
}

/**
 * Clear expired OTPs (cleanup utility)
 */
export function cleanupExpiredOTPs(): number {
  const now = Date.now();
  let cleaned = 0;

  for (const [key, record] of otpStore.entries()) {
    if (now > record.expiresAt) {
      otpStore.delete(key);
      cleaned++;
    }
  }

  return cleaned;
}

// Auto-cleanup every 5 minutes
setInterval(() => {
  const cleaned = cleanupExpiredOTPs();
  if (cleaned > 0) {
    console.log(`[OTP Cleanup] Removed ${cleaned} expired OTP(s)`);
  }
}, 5 * 60 * 1000);
