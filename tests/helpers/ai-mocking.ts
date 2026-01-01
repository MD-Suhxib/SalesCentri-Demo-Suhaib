import { Page, Route } from '@playwright/test';
import mockResponses from '../fixtures/mock-responses';

/**
 * AI Mocking Helper Functions
 * Provides utilities for mocking LLM API responses in tests
 */

/**
 * Mock OpenAI API response
 */
export async function mockOpenAIResponse(page: Page, response?: string | object) {
  const mockContent = typeof response === 'string' 
    ? response 
    : (response || mockResponses.openai.success.choices[0].message.content);
  
  await page.route('**/api.openai.com/v1/chat/completions', async (route: Route) => {
    if (typeof mockContent === 'string') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...mockResponses.openai.success,
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: mockContent
            },
            finish_reason: 'stop'
          }]
        })
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockContent)
      });
    }
  });
}

/**
 * Mock Anthropic Claude API response
 */
export async function mockAnthropicResponse(page: Page, response?: string) {
  const mockContent = response || mockResponses.anthropic.success.content[0].text;
  
  await page.route('**/api.anthropic.com/v1/messages', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...mockResponses.anthropic.success,
        content: [{
          type: 'text',
          text: mockContent
        }]
      })
    });
  });
}

/**
 * Mock Google Gemini API response
 */
export async function mockGeminiResponse(page: Page, response?: string) {
  const mockContent = response || mockResponses.gemini.success.candidates[0].content.parts[0].text;
  
  await page.route('**/generativelanguage.googleapis.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        ...mockResponses.gemini.success,
        candidates: [{
          content: {
            parts: [{ text: mockContent }],
            role: 'model'
          },
          finishReason: 'STOP'
        }]
      })
    });
  });
}

/**
 * Mock Groq API response
 */
export async function mockGroqResponse(page: Page, response?: string) {
  const mockContent = response || 'This is a mock response from Groq Llama.';
  
  await page.route('**/api.groq.com/**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'chatcmpl-groq-test',
        object: 'chat.completion',
        created: Date.now(),
        model: 'llama-3.1-70b-versatile',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: mockContent
          },
          finish_reason: 'stop'
        }]
      })
    });
  });
}

/**
 * Mock streaming research response (Server-Sent Events)
 */
export async function mockStreamingResearch(page: Page, chunks?: Array<{ type: string; data?: any; message?: string }>) {
  const mockChunks = chunks || mockResponses.streaming.researchChunks;
  
  await page.route('**/api/research/stream', async (route: Route) => {
    // Create SSE stream
    let streamData = '';
    
    for (const chunk of mockChunks) {
      streamData += `data: ${JSON.stringify(chunk)}\n\n`;
    }
    
    await route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
      body: streamData
    });
  });
}

/**
 * Mock all LLM APIs at once (cost-saving for tests)
 */
export async function mockAllLLMAPIs(page: Page, defaultResponse?: string) {
  const response = defaultResponse || 'This is a mock AI response for testing.';
  
  await Promise.all([
    mockOpenAIResponse(page, response),
    mockAnthropicResponse(page, response),
    mockGeminiResponse(page, response),
    mockGroqResponse(page, response)
  ]);
}

/**
 * Mock LLM API error (rate limit, timeout, etc.)
 */
export async function mockLLMError(page: Page, provider: 'openai' | 'anthropic' | 'gemini' | 'groq', errorType: 'rate_limit' | 'timeout' | 'server_error') {
  const apiUrls = {
    openai: '**/api.openai.com/**',
    anthropic: '**/api.anthropic.com/**',
    gemini: '**/generativelanguage.googleapis.com/**',
    groq: '**/api.groq.com/**'
  };
  
  const errorResponses = {
    rate_limit: {
      status: 429,
      body: { error: { message: 'Rate limit exceeded', type: 'rate_limit_error' } }
    },
    timeout: {
      status: 504,
      body: { error: { message: 'Gateway timeout', type: 'timeout_error' } }
    },
    server_error: {
      status: 500,
      body: { error: { message: 'Internal server error', type: 'server_error' } }
    }
  };
  
  const error = errorResponses[errorType];
  
  await page.route(apiUrls[provider], async (route: Route) => {
    await route.fulfill({
      status: error.status,
      contentType: 'application/json',
      body: JSON.stringify(error.body)
    });
  });
}

/**
 * Wait for AI response to be visible in the UI
 */
export async function waitForAIResponse(page: Page, timeout = 30000) {
  // Wait for assistant message to appear
  await page.waitForSelector('[data-role="assistant"], .message.assistant, .ai-response', { timeout });
  
  // Wait for streaming indicator to disappear
  await page.waitForSelector('.streaming-indicator, .loading-spinner', { state: 'hidden', timeout: 5000 }).catch(() => {
    // Ignore if indicator not found
  });
}

/**
 * Get AI response text from the page
 */
export async function getAIResponseText(page: Page): Promise<string> {
  const responseElement = await page.locator('[data-role="assistant"], .message.assistant, .ai-response').last();
  return await responseElement.textContent() || '';
}
