import { Page, Route } from '@playwright/test';
import mockResponses from '../fixtures/mock-responses';

/**
 * Network Interceptor Helper Functions
 * Provides utilities for intercepting and mocking network requests
 */

/**
 * Mock external authentication API
 */
export async function mockAuthAPI(page: Page, authenticated = true) {
  await page.route('**/app.demandintellect.com/app/api/profile.php', async (route: Route) => {
    if (authenticated) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponses.auth.profile)
      });
    } else {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Unauthorized'
        })
      });
    }
  });
}

/**
 * Mock OTP send API
 */
export async function mockOTPSend(page: Page, scenario: 'success' | 'rate_limit' | 'error' = 'success') {
  await page.route('**/api/lead-capture/send-otp', async (route: Route) => {
    let response;
    
    switch (scenario) {
      case 'success':
        response = { status: 200, body: mockResponses.otp.sendSuccess };
        break;
      case 'rate_limit':
        response = { status: 429, body: mockResponses.otp.sendRateLimit };
        break;
      case 'error':
        response = { status: 500, body: { success: false, message: 'Internal server error' } };
        break;
    }
    
    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      body: JSON.stringify(response.body)
    });
  });
}

/**
 * Mock OTP verify API
 */
export async function mockOTPVerify(page: Page, scenario: 'success' | 'expired' | 'invalid' | 'max_attempts' = 'success') {
  await page.route('**/api/lead-capture/verify-otp', async (route: Route) => {
    let response;
    
    switch (scenario) {
      case 'success':
        response = { status: 200, body: mockResponses.otp.verifySuccess };
        break;
      case 'expired':
        response = { status: 400, body: mockResponses.otp.verifyExpired };
        break;
      case 'invalid':
        response = { status: 400, body: mockResponses.otp.verifyInvalid };
        break;
      case 'max_attempts':
        response = { status: 400, body: mockResponses.otp.verifyMaxAttempts };
        break;
    }
    
    await route.fulfill({
      status: response.status,
      contentType: 'application/json',
      body: JSON.stringify(response.body)
    });
  });
}

/**
 * Mock login redirect URL
 */
export async function mockLoginRedirect(page: Page, preserveUrl = true) {
  const currentUrl = page.url();
  const redirectUrl = preserveUrl 
    ? `https://dashboard.salescentri.com/login?redirect=${encodeURIComponent(currentUrl)}`
    : 'https://dashboard.salescentri.com/login';
  
  await page.route('**/lib/loginUtils.ts', async (route: Route) => {
    await route.fulfill({
      status: 200,
      body: `export function getLoginUrl(preserve) { return "${redirectUrl}"; }`
    });
  });
}

/**
 * Intercept all external API calls and log them
 */
export async function interceptExternalAPIs(page: Page, logToConsole = false) {
  const interceptedCalls: Array<{ url: string; method: string; timestamp: number }> = [];
  
  await page.route('**/*', async (route: Route) => {
    const request = route.request();
    const url = request.url();
    
    // Log external API calls (not localhost or static assets)
    if (!url.includes('localhost') && !url.includes('127.0.0.1') && !url.match(/\.(js|css|png|jpg|svg|woff|ttf)$/)) {
      const call = {
        url,
        method: request.method(),
        timestamp: Date.now()
      };
      
      interceptedCalls.push(call);
      
      if (logToConsole) {
        console.log(`[INTERCEPTED] ${call.method} ${call.url}`);
      }
    }
    
    // Continue with the request
    await route.continue();
  });
  
  return interceptedCalls;
}

/**
 * Block all external API calls (offline mode)
 */
export async function blockExternalAPIs(page: Page, allowlist: string[] = []) {
  await page.route('**/*', async (route: Route) => {
    const url = route.request().url();
    
    // Allow localhost and allowlisted domains
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    const isAllowed = allowlist.some(domain => url.includes(domain));
    const isStaticAsset = url.match(/\.(js|css|png|jpg|svg|woff|ttf)$/);
    
    if (isLocalhost || isAllowed || isStaticAsset) {
      await route.continue();
    } else {
      // Block external API call
      await route.abort('blockedbyclient');
    }
  });
}

/**
 * Mock Firebase Firestore operations
 */
export async function mockFirestoreOperations(page: Page) {
  // Mock Firestore SDK initialization
  await page.route('**/firebasestorage.googleapis.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true })
    });
  });
  
  // Mock Firestore data fetch
  await page.route('**/firestore.googleapis.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        documents: []
      })
    });
  });
}

/**
 * Simulate network latency
 */
export async function simulateNetworkLatency(page: Page, delayMs = 1000) {
  await page.route('**/*', async (route: Route) => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    await route.continue();
  });
}

/**
 * Simulate network failure
 */
export async function simulateNetworkFailure(page: Page, failureRate = 0.5) {
  await page.route('**/*', async (route: Route) => {
    const shouldFail = Math.random() < failureRate;
    
    if (shouldFail && !route.request().url().includes('localhost')) {
      await route.abort('failed');
    } else {
      await route.continue();
    }
  });
}
