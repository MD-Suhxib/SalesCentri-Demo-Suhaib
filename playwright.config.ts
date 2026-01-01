import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

/**
 * Playwright Configuration for SalesCentri Lightning Mode
 * 
 * This configuration is optimized for:
 * - Complex multi-step payment flows (sequential execution)
 * - AI streaming features (extended timeouts)
 * - Cross-browser compatibility testing
 * - CI/CD integration (GitHub Actions)
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',
  
  // Run tests sequentially for payment flows to avoid race conditions
  fullyParallel: false,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests on CI for flakiness mitigation
  retries: process.env.CI ? 2 : 0,
  
  // Single worker for sequential payment tests
  workers: process.env.CI ? 1 : 1,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'] // Console output
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3000',
    
    // Collect trace on first retry for debugging
    trace: 'on-first-retry',
    
    // Screenshot on failure only
    screenshot: 'only-on-failure',
    
    // Record video on failure only (saves storage)
    video: 'retain-on-failure',
    
    // Extended timeouts for AI operations
    actionTimeout: 15000, // 15 seconds for standard actions
    navigationTimeout: 30000, // 30 seconds for page loads (AI features)
    
    // Viewport size
    viewport: { width: 1280, height: 720 },
    
    // Ignore HTTPS errors in test environment
    ignoreHTTPSErrors: true,
    
    // Extra HTTP headers
    extraHTTPHeaders: {
      'Accept-Language': 'en-US',
    },
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Disable animations for stable visual testing
        launchOptions: {
          args: [
            '--disable-animations',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
      },
    },

    // Mobile testing (Phase 2+)
    // Uncomment when ready for mobile testing
    // {
    //   name: 'Mobile Chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { 
    //     ...devices['iPhone 13'],
    //   },
    // },
  ],

  // Development server configuration
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes for Next.js startup
    stdout: 'ignore',
    stderr: 'pipe',
  },

  // Global timeout for each test
  timeout: 60000, // 60 seconds per test (AI operations can be slow)
  
  // Global timeout for the whole test run
  globalTimeout: process.env.CI ? 600000 : 0, // 10 minutes on CI, unlimited locally
  
  // Expect timeout for assertions
  expect: {
    timeout: 10000, // 10 seconds for expect() assertions
  },
});
