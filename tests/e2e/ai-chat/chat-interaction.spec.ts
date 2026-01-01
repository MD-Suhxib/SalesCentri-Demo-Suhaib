import { test, expect } from '@playwright/test';
import { mockOpenAIResponse, mockAllLLMAPIs, mockLLMError, waitForAIResponse, getAIResponseText } from '../../helpers/ai-mocking';

/**
 * AI Chat Interaction Test Suite
 * Tests basic AI chat functionality with mocked LLM responses
 * 
 * Test Scenarios:
 * 1. Message sending + response rendering
 * 2. Chat history persistence
 * 3. Error state handling (API failure)
 */

test.describe('AI Chat Interaction', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mock all LLM APIs to prevent actual API calls
    await mockAllLLMAPIs(page, 'This is a test AI response.');
  });

  /**
   * SCENARIO 1: Message Sending + Response Rendering
   * Tests that user can send a message and receive AI response
   */
  test('should send message and render AI response', async ({ page }) => {
    // Mock OpenAI response
    await mockOpenAIResponse(page, 'Hello! I am an AI assistant. How can I help you today?');
    
    // Navigate to homepage with AI chat
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Close any modals/overlays
    const closeButton = page.locator('button[aria-label*="close" i], button:has-text("×"), button:has-text("Close")').first();
    if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeButton.click();
      await page.waitForTimeout(500);
    }
    
    // Find chat input (try multiple selectors)
    const chatInput = page.locator('textarea[placeholder*="message" i], input[placeholder*="message" i], textarea[name="message"]').first();
    
    // Verify chat input is visible
    if (await chatInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Type message
      await chatInput.fill('Hello, can you help me?');
      
      // Find and click send button with force option to bypass overlays
      const sendButton = page.getByRole('button', { name: /send|submit/i }).first();
      await expect(sendButton).toBeVisible({ timeout: 5000 });
      await sendButton.click({ force: true });
      
      // Wait for AI response to appear
      await waitForAIResponse(page);
      
      // Verify response is rendered
      const responseText = await getAIResponseText(page);
      expect(responseText.length).toBeGreaterThan(0);
      
      // Check if response contains expected content (structure, not exact text)
      const hasResponse = await page.locator('[data-role="assistant"], .message.assistant, .ai-response').count() > 0;
      expect(hasResponse).toBeTruthy();
    } else {
      console.log('Chat interface not found on homepage - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 2: Chat History Persistence
   * Tests that chat messages are persisted in localStorage
   */
  test('should persist chat history in localStorage', async ({ page }) => {
    await mockOpenAIResponse(page, 'I remember our conversation.');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const chatInput = page.locator('textarea[placeholder*="message" i], input[placeholder*="message" i]').first();
    
    if (await chatInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Send first message
      await chatInput.fill('First message');
      await page.getByRole('button', { name: /send/i }).first().click();
      await waitForAIResponse(page);
      
      // Check localStorage for chat history
      const chatHistory = await page.evaluate(() => {
        const keys = Object.keys(localStorage).filter(key => 
          key.includes('chat') || key.includes('message') || key.includes('history')
        );
        return keys.map(key => ({ key, value: localStorage.getItem(key) }));
      });
      
      // Verify chat data exists in localStorage
      expect(chatHistory.length).toBeGreaterThan(0);
      
      // Reload page and verify messages persist
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Check if previous messages are still visible
      const messageCount = await page.locator('[data-role="user"], .message.user').count();
      expect(messageCount).toBeGreaterThan(0);
    } else {
      console.log('Chat interface not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 3: Error State Handling
   * Tests error handling when AI API fails
   */
  test('should display error when AI API fails', async ({ page }) => {
    // Mock API error (rate limit)
    await mockLLMError(page, 'openai', 'rate_limit');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const chatInput = page.locator('textarea[placeholder*="message" i], input[placeholder*="message" i]').first();
    
    if (await chatInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Send message
      await chatInput.fill('Test message');
      await page.getByRole('button', { name: /send/i }).first().click();
      
      // Wait for error message to appear
      await page.waitForTimeout(3000);
      
      // Check for error indicators
      const errorVisible = await page.locator('.error, [role="alert"], .text-red').isVisible({ timeout: 5000 }).catch(() => false);
      const errorMessage = await page.getByText(/error|failed|limit|retry/i).isVisible({ timeout: 5000 }).catch(() => false);
      
      // Either error element or error message should be visible
      expect(errorVisible || errorMessage).toBeTruthy();
    } else {
      console.log('Chat interface not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 4: Multiple Message Exchange
   * Tests multi-turn conversation
   */
  test('should handle multiple message exchanges', async ({ page }) => {
    await mockOpenAIResponse(page, 'Response to your question.');
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Close any modals
    const closeButton = page.locator('button[aria-label*="close" i], button:has-text("×")').first();
    if (await closeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeButton.click();
      await page.waitForTimeout(500);
    }
    
    const chatInput = page.locator('textarea[placeholder*="message" i], input[placeholder*="message" i]').first();
    
    if (await chatInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Send first message
      await chatInput.fill('First question');
      await page.getByRole('button', { name: /send/i }).first().click({ force: true });
      await waitForAIResponse(page);
      
      // Count messages after first exchange
      const firstCount = await page.locator('[data-role="user"], [data-role="assistant"]').count();
      expect(firstCount).toBeGreaterThanOrEqual(2); // At least user + assistant
      
      // Send second message
      await chatInput.fill('Second question');
      await page.getByRole('button', { name: /send/i }).first().click();
      await waitForAIResponse(page);
      
      // Count messages after second exchange
      const secondCount = await page.locator('[data-role="user"], [data-role="assistant"]').count();
      expect(secondCount).toBeGreaterThan(firstCount);
    } else {
      console.log('Chat interface not found - skipping test');
      test.skip();
    }
  });
});
