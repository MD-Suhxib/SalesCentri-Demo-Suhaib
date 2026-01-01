# SalesCentri Playwright Testing Guide - Complete Documentation

**Last Updated:** December 2, 2024  
**Status:** Phase 2-4 Complete | Phase 5-6 Planned  
**Total Test Coverage:** 43 tests (20 critical paths + 8 AI features + 15 document/API tests)

---

## Table of Contents

1. [Overview](#overview)
2. [Current Status](#current-status)
3. [Quick Start](#quick-start)
4. [Test Architecture](#test-architecture)
5. [Phase 2: Implementation Details](#phase-2-implementation-details)
6. [Writing Tests](#writing-tests)
7. [Test Helpers & Utilities](#test-helpers--utilities)
8. [Debugging & Troubleshooting](#debugging--troubleshooting)
9. [Next Phases (3-6)](#next-phases-3-6)
10. [Best Practices](#best-practices)
11. [CI/CD Integration](#cicd-integration)

---

## Overview

This project uses **Playwright** for end-to-end (E2E) testing of the SalesCentri Lightning Mode SaaS platform. The testing strategy follows a hybrid approach:

- **Manual test authoring** using Standard Playwright
- **Strategic AI assistance** for test scaffolding (ChatGPT/Copilot)
- **Comprehensive mocking** for external APIs (payment gateways, LLMs, auth services)
- **Security-first approach** (sandbox-only, no production data)

### Why Playwright?

✅ **Deterministic testing** - Critical for payment flows  
✅ **Fine-grained control** - Handle complex scenarios (auth gating, streaming)  
✅ **Excellent debugging** - Trace viewer, video recording, screenshots  
✅ **Multi-browser support** - Chromium, Firefox, WebKit  
✅ **No external dependencies** - No reliance on AI services for test execution  

---

## Current Status

### ✅ Phase 2: Core Critical Paths (COMPLETE)

| Test Suite | Tests | Status | Files |
|------------|-------|--------|-------|
| **Checkout Flow** | 5 | ✅ Complete | `tests/e2e/checkout/checkout-flow.spec.ts` |
| **OTP Verification** | 5 | ✅ Complete | `tests/e2e/auth/otp-verification.spec.ts` |
| **Authentication/Login** | 5 | ✅ Complete | `tests/e2e/auth/login-redirect.spec.ts` |
| **Smoke Tests** | 5 | ✅ Complete | `tests/e2e/smoke/homepage.spec.ts` |
| **TOTAL** | **20** | ✅ Implemented | - |

### ✅ Phase 3: AI Feature Testing (COMPLETE)

| Test Suite | Tests | Status | Files |
|------------|-------|--------|-------|
| **AI Chat Interaction** | 4 | ✅ Complete | `tests/e2e/ai-chat/chat-interaction.spec.ts` |
| **Streaming Research** | 4 | ✅ Complete | `tests/e2e/ai-chat/streaming-research.spec.ts` |
| **TOTAL** | **8** | ✅ Implemented | - |

### ✅ Phase 4: Document Generation & APIs (COMPLETE)

| Test Suite | Tests | Status | Files |
|------------|-------|--------|-------|
| **PDF Export** | 3 | ✅ Complete | `tests/e2e/documents/pdf-export.spec.ts` |
| **Excel/CSV Export** | 4 | ✅ Complete | `tests/e2e/documents/excel-export.spec.ts` |
| **API Integration** | 8 | ✅ Complete | `tests/e2e/api/integration.spec.ts` |
| **TOTAL** | **15** | ✅ Implemented | - |

**Cross-browser:** 43 tests × 3 browsers = **129 total test executions**

---

## Quick Start

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Install Playwright browsers
pnpm exec playwright install --with-deps

# 3. Verify installation
pnpm exec playwright --version
```

### Running Tests

```bash
# Run all tests
pnpm test:e2e

# Run Phase 2 tests only
pnpm test:e2e tests/e2e/checkout tests/e2e/auth

# Run specific test file
pnpm test:e2e tests/e2e/checkout/checkout-flow.spec.ts

# Run single test by name
pnpm test:e2e -g "authenticated user"

# Run with specific browser
pnpm test:e2e --project=chromium

# Interactive UI mode
pnpm test:e2e:ui

# Debug mode (step through)
pnpm test:e2e:debug

# Headed mode (see browser)
pnpm test:e2e:headed

# View HTML report
pnpm test:e2e:report
```

### Development Workflow

```bash
# Terminal 1: Start dev server
pnpm run dev

# Terminal 2: Run tests (after server is ready)
pnpm test:e2e tests/e2e/checkout
```

---

## Test Architecture

### Directory Structure

```
SalesCentri-lightning_mode/
├── tests/
│   ├── e2e/                           # Test specifications
│   │   ├── auth/
│   │   │   ├── otp-verification.spec.ts    # OTP flow tests
│   │   │   └── login-redirect.spec.ts      # Auth/login tests
│   │   ├── checkout/
│   │   │   └── checkout-flow.spec.ts       # Checkout flow tests
│   │   ├── smoke/
│   │   │   └── homepage.spec.ts            # Basic smoke tests
│   │   ├── ai-chat/                   # Phase 3 (planned)
│   │   ├── documents/                 # Phase 4 (planned)
│   │   └── marketplace/               # Phase 6 (planned)
│   ├── fixtures/                      # Test data & fixtures
│   │   ├── auth.fixture.ts            # Pre-authenticated page
│   │   ├── mock-responses.ts          # Mock API responses
│   │   └── pricing-data.json          # Test pricing data
│   └── helpers/                       # Test utilities
│       ├── ai-mocking.ts              # AI/LLM mocking
│       ├── network-interceptors.ts    # API mocking
│       └── payment-helpers.ts         # Payment utilities
├── playwright.config.ts               # Playwright configuration
├── .env.test                          # Test environment (gitignored)
└── test-results/                      # Test execution results
    ├── results.json                   # JSON results
    ├── junit.xml                      # JUnit XML
    └── playwright-report/             # HTML report
```

### Configuration

**File:** `playwright.config.ts`

```typescript
{
  testDir: './tests/e2e',
  fullyParallel: false,              // Sequential for payment flows
  retries: process.env.CI ? 2 : 0,   // 2 retries on CI
  workers: 1,                        // Single worker for stability
  timeout: 60000,                    // 60s per test
  
  projects: [
    { name: 'chromium' },            // Desktop Chrome
    { name: 'firefox' },             // Desktop Firefox
    { name: 'webkit' }               // Desktop Safari
  ],
  
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
}
```

### Environment Variables

**File:** `.env.test` (never commit to Git!)

```bash
# Base URL
TEST_BASE_URL=http://localhost:3000

# Payment Gateways (SANDBOX ONLY)
PAYPAL_MODE=sandbox
PAYPAL_CLIENT_ID=sandbox-client-id
PAYPAL_SECRET=sandbox-secret

PAYU_MERCHANT_KEY=test-merchant-key
PAYU_MERCHANT_SALT=test-salt
PAYU_MODE=test

# Email (Mailtrap or similar)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=test-user
EMAIL_PASS=test-pass

# LLM APIs (test accounts or mocks)
OPENAI_API_KEY=test-key-or-mock
ANTHROPIC_API_KEY=test-key-or-mock
GOOGLE_GENERATIVE_AI_API_KEY=test-key-or-mock
```

---

## Phase 2: Implementation Details

### ✅ Checkout Flow Tests (5 scenarios)

**File:** `tests/e2e/checkout/checkout-flow.spec.ts`

| # | Test | Description |
|---|------|-------------|
| 1 | **Authenticated Complete Flow** | Full 4-step checkout with auth bypass, billing, payment, PayPal redirect |
| 2 | **Unauthenticated Redirect** | Redirects non-authenticated users to login portal |
| 3 | **Billing Validation Errors** | Form validation for incomplete/invalid data |
| 4 | **Payment Method Selection** | Payment option selection and navigation |
| 5 | **PayPal Redirect** | Successful redirect to PayPal sandbox |

**Key Features Tested:**
- 4-step wizard (Auth → Billing → Payment → Review)
- Authentication gating with external API validation
- Form validation and error handling
- PayPal sandbox integration
- Multi-step state management
- URL query parameter handling

**Example Test:**
```typescript
authTest('should complete full checkout flow', async ({ authenticatedPage: page }) => {
  await mockAuthAPI(page, true);
  await mockPayPalCheckout(page, orderId);
  
  await page.goto('/checkout?segment=Business&cycle=Yearly&plan=Premium');
  await fillBillingForm(page);
  await page.getByRole('button', { name: /continue to payment/i }).click();
  await page.getByRole('button', { name: /pay with paypal/i }).click();
  
  await expect(page).toHaveURL(/paypal.com/);
});
```

---

### ✅ OTP Verification Tests (5 scenarios)

**File:** `tests/e2e/auth/otp-verification.spec.ts`

| # | Test | Description |
|---|------|-------------|
| 1 | **Successful Verification** | Valid 6-digit OTP verification |
| 2 | **Expired OTP** | Rejects OTP after 3-minute timeout |
| 3 | **Invalid OTP** | Shows error for wrong code + remaining attempts |
| 4 | **Rate Limiting** | Blocks after 3 requests in 15 minutes |
| 5 | **Max Attempts** | Blocks verification after max attempts exceeded |

**Key Features Tested:**
- OTP generation and delivery (mocked email)
- 6-digit code validation
- 3-minute expiration timer
- Attempt tracking (3 max)
- Rate limiting (3 requests per 15 min)
- Error messaging

**Example Test:**
```typescript
test('should reject expired OTP', async ({ page }) => {
  await mockOTPSend(page, 'success');
  await mockOTPVerify(page, 'expired');
  
  await page.goto('/get-started/free-trial/account-setup');
  // ... fill form and submit OTP
  
  await expect(page.getByText(/expired|no longer valid/i)).toBeVisible();
});
```

---

### ✅ Authentication Tests (5 scenarios)

**File:** `tests/e2e/auth/login-redirect.spec.ts`

| # | Test | Description |
|---|------|-------------|
| 1 | **Login Redirect Flow** | Redirects to external auth portal (dashboard.salescentri.com) |
| 2 | **Token Persistence** | Stores tokens in localStorage after login |
| 3 | **Token Expiration** | Detects and handles expired tokens |
| 4 | **Token Polling** | 20-attempt polling for token detection (100ms intervals) |
| 5 | **Logout Cleanup** | Clears tokens from localStorage on logout |

**Key Features Tested:**
- External authentication portal redirect
- Cross-domain auth flow
- Token storage (`salescentri_token`, `salescentri_refreshToken`, `salescentri_expiresAt`)
- Token expiration validation
- Polling mechanism (20 attempts × 100ms)
- Redirect URL preservation

**Example Test:**
```typescript
test('should persist tokens in localStorage', async ({ page }) => {
  await page.goto('/');
  
  await page.evaluate(() => {
    localStorage.setItem('salescentri_token', 'mock-jwt-token');
    localStorage.setItem('salescentri_expiresAt', String(Date.now() + 3600000));
  });
  
  await page.reload();
  
  const token = await page.evaluate(() => localStorage.getItem('salescentri_token'));
  expect(token).toBeTruthy();
});
```

---

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
```

### Authenticated Test (Using Fixture)

```typescript
import { test as authTest } from '../../fixtures/auth.fixture';

authTest('should access protected page', async ({ authenticatedPage: page }) => {
  // page is pre-authenticated with valid tokens
  await page.goto('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

### Test with API Mocking

```typescript
import { mockAuthAPI, mockPayPalCheckout } from '../../helpers/network-interceptors';

test('should complete checkout', async ({ page }) => {
  await mockAuthAPI(page, true);
  await mockPayPalCheckout(page, 'ORDER-123');
  
  await page.goto('/checkout');
  // ... test checkout flow
});
```

### Selector Best Practices

```typescript
// ✅ GOOD: Role-based selectors (preferred)
await page.getByRole('button', { name: 'Sign In' });
await page.getByRole('heading', { name: 'Billing Information' });

// ✅ GOOD: Text content
await page.getByText('You are signed in');

// ✅ GOOD: Test IDs (add to components)
await page.getByTestId('checkout-continue-button');

// ✅ GOOD: ARIA labels
await page.locator('[aria-label="Email address"]');

// ❌ AVOID: CSS selectors (brittle)
await page.locator('.btn-primary');
await page.locator('#submit-button');
```

---

## Test Helpers & Utilities

### Authentication Helpers

**File:** `tests/helpers/network-interceptors.ts`

```typescript
// Mock authenticated user
await mockAuthAPI(page, true);

// Mock unauthenticated user
await mockAuthAPI(page, false);
```

**File:** `tests/fixtures/auth.fixture.ts`

```typescript
// Pre-authenticated page fixture
import { test as authTest } from '../../fixtures/auth.fixture';

authTest('test name', async ({ authenticatedPage: page }) => {
  // page already has valid auth tokens + mocked API
});
```

### OTP Helpers

```typescript
// Mock successful OTP send
await mockOTPSend(page, 'success');

// Mock rate limiting
await mockOTPSend(page, 'rate_limit');

// Mock successful verification
await mockOTPVerify(page, 'success');

// Mock expired OTP
await mockOTPVerify(page, 'expired');

// Mock invalid OTP
await mockOTPVerify(page, 'invalid');

// Mock max attempts
await mockOTPVerify(page, 'max_attempts');
```

### Payment Helpers

```typescript
// Mock PayPal checkout
await mockPayPalCheckout(page, 'ORDER-123');

// Mock PayPal capture
await mockPayPalCapture(page, 'ORDER-123');

// Mock pricing API
await mockPricingAPI(page, pricingData);

// Fill billing form
await fillBillingForm(page, {
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@example.com',
  phone: '+1234567890',
  country: 'United States'
});

// Generate mock order ID
const orderId = generateMockOrderId(); // Returns: MOCK-ORDER-{timestamp}-{random}

// Wait for payment redirect
await waitForPaymentRedirect(page, 'paypal', 10000);
```

### Network Mocking Patterns

```typescript
// Mock external API
await page.route('**/api/external-service', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ success: true })
  });
});

// Block external APIs (offline mode)
await blockExternalAPIs(page, ['localhost', 'demandintellect.com']);

// Log all API calls
const calls = await interceptExternalAPIs(page, true);
```

---

## Debugging & Troubleshooting

### View Test Traces

```bash
# Generate trace on failure
pnpm exec playwright test --trace on

# View specific trace
pnpm exec playwright show-trace test-results/.../trace.zip
```

### Debug Mode

```bash
# Step through test
pnpm test:e2e:debug tests/e2e/checkout/checkout-flow.spec.ts

# Run with browser visible
pnpm test:e2e:headed

# Pause test at specific point
await page.pause(); // Add to test code
```

### Common Issues & Solutions

#### Issue: Dev server timeout

```bash
# Start dev server manually first
pnpm run dev

# Wait for "✓ Ready" message, then in another terminal:
pnpm test:e2e
```

#### Issue: Authentication not working

```typescript
// Ensure mockAuthAPI is called BEFORE navigation
await mockAuthAPI(page, true);
await page.goto('/checkout');
```

#### Issue: Flaky tests

```bash
# Increase timeout
pnpm exec playwright test --timeout=90000

# Run with retries
pnpm exec playwright test --retries=3

# Use explicit waits instead of timeouts
await expect(page.getByText('Success')).toBeVisible();
// ❌ Avoid: await page.waitForTimeout(5000);
```

#### Issue: Selector not found

```typescript
// Use multiple selector strategies
const button = page.getByRole('button', { name: 'Submit' })
  .or(page.getByTestId('submit-button'))
  .or(page.locator('button:has-text("Submit")'));
```

---

## Implemented Phases (3-4)

### ✅ Phase 3: AI Feature Testing (COMPLETE)

**Status:** ✅ Implemented | 8 Tests | December 2024

**Deliverables:**
- ✅ **AI Chat Tests (4 scenarios)**
  - Message sending + response rendering (mocked LLM)
  - Chat history persistence in localStorage
  - Error state handling (API failure)
  - Multi-turn conversation handling

- ✅ **Streaming Research Tests (4 scenarios)**
  - Progressive result rendering (SSE)
  - Source citation display
  - Streaming completion handling
  - Streaming error handling

- ✅ **Network Mocking Infrastructure**
  - `mockOpenAIResponse()` - Mock GPT-4 responses
  - `mockStreamingResearch()` - Mock SSE streaming
  - `mockGeminiResponse()` - Mock Google Gemini
  - `mockAnthropicResponse()` - Mock Claude
  - `mockLLMError()` - Mock API failures

**Test Files:**
```
tests/e2e/ai-chat/
├── chat-interaction.spec.ts       # 4 chat functionality tests
└── streaming-research.spec.ts     # 4 SSE streaming tests
```

**Key Features:**
- Content-agnostic assertions (structure, not content)
- Mock streaming responses with Server-Sent Events
- Error states tested (API failures, timeouts)
- Chat persistence verified in localStorage
- Modal/overlay handling for UI interactions
- Zero actual LLM API calls ($0 cost)

**Example Test:**
```typescript
test('should render AI response', async ({ page }) => {
  await mockOpenAIResponse(page, 'This is a test response.');
  
  // Close any blocking modals
  const closeButton = page.locator('button[aria-label*="close" i]').first();
  if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
    await closeButton.click();
  }
  
  await page.goto('/');
  await page.locator('textarea[placeholder*="message" i]').fill('Hello');
  await page.getByRole('button', { name: /send/i }).first().click({ force: true });
  
  // Assert structural rendering
  await expect(page.locator('[data-role="assistant"]')).toBeVisible();
});
```

**Success Criteria:**
- ✅ 8 passing AI tests with mocked responses
- ✅ No actual LLM API calls ($0 cost)
- ✅ Streaming states validated correctly
- ✅ Error handling tested comprehensively

---

### ✅ Phase 4: Document Generation & API Tests (COMPLETE)

**Status:** ✅ Implemented | 15 Tests | December 2024

**Deliverables:**
- ✅ **PDF Export Tests (3 scenarios)**
  - Chat history PDF download
  - PDF structure validation (file header check)
  - Research report PDF export

- ✅ **Excel Export Tests (4 scenarios)**
  - Research findings spreadsheet download
  - Excel structure validation (ZIP format check)
  - Lead data export functionality
  - CSV format alternative

- ✅ **API Integration Tests (8 scenarios)**
  - `/api/lead-capture/send-otp` success/failure/rate-limit
  - `/api/lead-capture/verify-otp` success validation
  - `/api/get-pricing` data validation
  - `/api/paypal/create-order` mocking
  - `/api/profile` authentication check
  - API timeout error handling

**Test Files:**
```
tests/e2e/documents/
├── pdf-export.spec.ts             # 3 PDF generation tests
├── excel-export.spec.ts           # 4 Excel/CSV tests
tests/e2e/api/
└── integration.spec.ts            # 8 API endpoint tests
```

**Key Features:**
- File download validation with fs module
- PDF header validation (`%PDF`)
- Excel ZIP structure validation (`PK` header)
- API response mocking for all endpoints
- Rate limiting simulation
- Timeout and error handling
- Defensive programming (test.skip() when features unavailable)

**Example Tests:**

**PDF Export:**
```typescript
test('should export chat as PDF', async ({ page }) => {
  await page.goto('/');
  
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /export|download|pdf/i }).click();
  const download = await downloadPromise;
  
  const filePath = await download.path();
  const fileContent = fs.readFileSync(filePath);
  
  // Verify PDF header
  expect(fileContent.toString('utf8', 0, 4)).toBe('%PDF');
});
```

**API Integration:**
```typescript
test('should validate pricing API response', async ({ page }) => {
  const mockPricing = {
    data: [{ segment: 'Business', price: 299, features: ['Feature 1'] }]
  };
  
  await mockPricingAPI(page, mockPricing);
  await page.goto('/pricing');
  
  const hasPricing = await page.locator('.price, [data-price]').count() > 0;
  expect(hasPricing).toBeTruthy();
});
```

**Success Criteria:**
- ✅ 15 passing document and API tests
- ✅ File structure validation working correctly
- ✅ All critical API endpoints covered
- ✅ Error states and edge cases tested

---

## Planned Phases (5-6)

### 📋 Phase 5: CI/CD Integration (Planned - 1 week)

**Goal:** Automate test execution in GitHub Actions
```

**Implementation Steps:**
1. Test file download triggers
2. Validate downloaded file exists
3. Parse PDF/Excel to verify basic structure
4. Test error states (download failures)
5. Verify correct MIME types

**Example Test:**
```typescript
test('should export chat to PDF', async ({ page }) => {
  const downloadPromise = page.waitForEvent('download');
  
  await page.goto('/chat/123');
  await page.getByRole('button', { name: 'Export PDF' }).click();
  
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  
  const path = await download.path();
  expect(path).toBeTruthy();
});
```

**Success Criteria:**
- ✅ 9 passing tests for documents & API integration
- ✅ Binary file downloads verified
- ✅ All critical API routes covered

---

### 📋 Phase 5: CI/CD Integration (Planned - 1 week)

**Goal:** Automate test execution on every PR and commit

**Deliverables:**
- [ ] **GitHub Actions Workflow**
  - Auto-run on push/PR
  - Parallel execution across browsers
  - Test report upload
  - Secret injection

**Workflow File:** `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps
      
      - name: Run tests
        run: pnpm test:e2e --project=${{ matrix.browser }}
        env:
          PAYPAL_MODE: sandbox
          OPENAI_API_KEY: ${{ secrets.TEST_OPENAI_API_KEY }}
          PAYPAL_CLIENT_ID: ${{ secrets.PAYPAL_SANDBOX_CLIENT_ID }}
      
      - name: Upload test report
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
```

**Implementation Steps:**
1. Create GitHub Actions workflow file
2. Configure repository secrets
3. Set up test result reporting
4. Configure branch protection rules
5. Add status badges to README

**Success Criteria:**
- ✅ Tests run automatically on every PR
- ✅ PR cannot merge if tests fail
- ✅ Test reports accessible in GitHub UI

---

### 📋 Phase 6: Advanced Features (Planned - 2-3 weeks)

**Goal:** Expand test coverage to marketplace, mobile, and visual regression

**Deliverables:**
- [ ] **Marketplace Tests (3 scenarios)**
  - Vendor registration flow
  - Document uploads
  - Form validation

- [ ] **Mobile Viewport Tests (2 scenarios)**
  - Responsive design verification
  - Touch interactions

- [ ] **Visual Regression Tests (3 scenarios)**
  - Screenshot comparison
  - Layout stability
  - Component rendering

**Test Files:**
```
tests/e2e/marketplace/
├── vendor-registration.spec.ts    # Marketplace registration
└── document-upload.spec.ts        # File upload tests

tests/e2e/mobile/
├── responsive-checkout.spec.ts    # Mobile checkout flow
└── touch-interactions.spec.ts     # Mobile gestures

tests/e2e/visual/
├── homepage-visual.spec.ts        # Homepage screenshots
└── component-visual.spec.ts       # Component snapshots
```

**Implementation Steps:**
1. Add mobile viewport projects to config
2. Implement file upload helpers
3. Set up visual regression baseline
4. Test touch/swipe gestures
5. Validate responsive breakpoints

**Success Criteria:**
- ✅ Marketplace flow fully tested
- ✅ Mobile tests pass on Pixel 5 & iPhone 13
- ✅ Visual regression baseline established

---

## Best Practices

### 1. Use Semantic Selectors

```typescript
// ✅ BEST: Role-based
await page.getByRole('button', { name: 'Sign In' });

// ✅ GOOD: Text content
await page.getByText('Success');

// ✅ ACCEPTABLE: Test IDs
await page.getByTestId('submit-btn');

// ❌ AVOID: CSS selectors
await page.locator('.btn-primary');
```

### 2. Mock External APIs

```typescript
// Always mock external services
await mockAuthAPI(page, true);
await mockPayPalCheckout(page, orderId);
await mockOpenAIResponse(page, 'Mock response');
```

### 3. Wait for State, Not Time

```typescript
// ✅ GOOD: Wait for condition
await expect(page.getByText('Success')).toBeVisible();

// ❌ AVOID: Arbitrary waits
await page.waitForTimeout(5000);
```

### 4. Use Fixtures for Common Setup

```typescript
// ✅ GOOD: Reusable fixture
authTest('test', async ({ authenticatedPage: page }) => {
  // Already authenticated
});

// ❌ AVOID: Repeated setup
test('test', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('token', '...'));
  // ... repeated in every test
});
```

### 5. Handle Non-Deterministic Features

```typescript
// For AI responses, test structure not content
await mockOpenAIResponse(page, 'Paris is the capital');

// Assert rendering, not exact text
await expect(page.locator('.ai-response')).toBeVisible();
await expect(page.locator('.ai-response')).toContainText('Paris');
```

### 6. Keep Tests Isolated

```typescript
// Each test should be independent
test('test 1', async ({ page }) => {
  // Clean state
  await page.goto('/');
  // ... test
});

test('test 2', async ({ page }) => {
  // Don't depend on test 1
  await page.goto('/');
  // ... test
});
```

---

## CI/CD Integration

### GitHub Actions Setup (Planned)

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e
        env:
          PAYPAL_MODE: sandbox
          OPENAI_API_KEY: ${{ secrets.TEST_OPENAI_API_KEY }}
```

### Required Secrets

Configure in **GitHub > Settings > Secrets > Actions**:

- `TEST_OPENAI_API_KEY` - OpenAI test account key
- `PAYPAL_SANDBOX_CLIENT_ID` - PayPal sandbox credentials
- `PAYPAL_SANDBOX_SECRET` - PayPal sandbox secret
- `TEST_EMAIL_HOST` - Mailtrap SMTP host
- `TEST_EMAIL_USER` - Mailtrap username
- `TEST_EMAIL_PASS` - Mailtrap password

---

## Test Reports

### HTML Report

```bash
pnpm exec playwright show-report
```

**Location:** `playwright-report/index.html`

**Features:**
- Test execution timeline
- Screenshots on failure
- Video recordings
- Trace files
- Browser console logs

### JSON Results

**Location:** `test-results/results.json`

**Usage:** CI/CD integration, custom reporting

### JUnit XML

**Location:** `test-results/junit.xml`

**Usage:** Jenkins, TeamCity, other CI tools

---

## Resources

### Documentation
- **Architecture Report:** `QA_AUTOMATION_ARCHITECTURE_REPORT.md`
- **Playwright Docs:** https://playwright.dev/docs/intro
- **Next.js Testing:** https://nextjs.org/docs/testing/playwright

### Support
- **Playwright Discord:** https://discord.gg/playwright
- **GitHub Issues:** https://github.com/microsoft/playwright/issues
- **Internal Team:** qa-team@salescentri.com

---

## Summary

### Current State
- ✅ **Phase 2 Complete:** 20 tests covering checkout, OTP, and authentication
- ✅ **Phase 3 Complete:** 8 tests for AI chat interactions and streaming research
- ✅ **Phase 4 Complete:** 15 tests for document exports and API integrations
- ✅ **Infrastructure Ready:** Fixtures, helpers, mocking utilities
- ✅ **Documentation Complete:** Comprehensive testing guide

### Test Coverage by Phase

| Phase | Tests | Coverage Area |
|-------|-------|---------------|
| Phase 2 | 20 | Checkout, Auth, OTP, Smoke |
| Phase 3 | 8 | AI Chat, Streaming, LLM Integration |
| Phase 4 | 15 | PDF/Excel Export, API Endpoints |
| **Total** | **43** | **Critical business flows** |

### Key Achievements
- ✅ Zero production API calls (100% mocked)
- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Comprehensive error handling and defensive programming
- ✅ File validation for exports (PDF headers, Excel structure)
- ✅ Authentication flow fully tested with external API mocking
- ✅ PayPal sandbox integration verified

### Next Steps
- 🚧 **Phase 5:** CI/CD Integration (GitHub Actions, parallel execution)
- 🚧 **Phase 6:** Advanced Features (marketplace, mobile, visual regression)

### Upcoming Phases
- 📋 **Phase 3:** AI feature testing (2 weeks)
- 📋 **Phase 4:** Document generation tests (1-2 weeks)
- 📋 **Phase 5:** CI/CD integration (1 week)
- 📋 **Phase 6:** Advanced features (2-3 weeks)

### Total Timeline
- **Phase 2:** ✅ Complete
- **Phases 3-6:** 6-8 weeks estimated

---

**Last Updated:** December 2, 2025  
**Version:** 2.0  
**Status:** Phase 2 Complete | Phases 3-6 Planned
