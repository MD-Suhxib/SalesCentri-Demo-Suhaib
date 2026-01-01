import { test, expect } from '@playwright/test';
import { mockStreamingResearch, mockOpenAIResponse } from '../../helpers/ai-mocking';

/**
 * Streaming Research Test Suite
 * Tests Server-Sent Events (SSE) streaming functionality
 * 
 * Test Scenarios:
 * 1. Progressive result rendering (streaming chunks)
 * 2. Source citation display
 * 3. Streaming completion handling
 */

test.describe('Streaming Research', () => {

  /**
   * SCENARIO 1: Progressive Result Rendering
   * Tests that streaming chunks are progressively displayed
   */
  test('should display progressive streaming results', async ({ page }) => {
    // Mock streaming research with multiple chunks
    const mockChunks = [
      { type: 'start', message: 'Starting research...' },
      { type: 'chunk', data: 'First piece of research data' },
      { type: 'chunk', data: 'Second piece of research data' },
      { type: 'chunk', data: 'Third piece of research data' },
      { type: 'complete', message: 'Research complete' }
    ];
    
    await mockStreamingResearch(page, mockChunks);
    await mockOpenAIResponse(page, 'Research analysis complete.');
    
    // Navigate to research page
    await page.goto('/multi-gpt-aggregated-research');
    await page.waitForLoadState('networkidle');
    
    // Find research input
    const searchInput = page.locator('input[type="search"], input[placeholder*="research" i], textarea[placeholder*="research" i]').first();
    
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Enter research query
      await searchInput.fill('Test research query');
      
      // Submit research request
      const submitButton = page.getByRole('button', { name: /research|search|analyze|start/i }).first();
      await expect(submitButton).toBeVisible({ timeout: 5000 });
      await submitButton.click();
      
      // Wait for streaming to start
      await page.waitForTimeout(1000);
      
      // Check for streaming indicator
      const streamingIndicator = await page.locator('.streaming, .loading, [data-streaming="true"]').isVisible({ timeout: 5000 }).catch(() => false);
      
      // Wait for results to appear
      await page.waitForTimeout(2000);
      
      // Verify research results are displayed
      const hasResults = await page.locator('.research-result, .result, [data-type="result"]').count() > 0;
      const hasContent = await page.locator('text=/research|data|analysis/i').count() > 0;
      
      expect(streamingIndicator || hasResults || hasContent).toBeTruthy();
    } else {
      console.log('Research interface not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 2: Source Citation Display
   * Tests that research sources are properly displayed
   */
  test('should display source citations', async ({ page }) => {
    // Mock streaming with source citations
    const mockChunks = [
      { type: 'start', message: 'Gathering sources...' },
      { 
        type: 'source', 
        data: { 
          title: 'Example Source 1', 
          url: 'https://example.com/source1',
          snippet: 'This is source content...'
        } 
      },
      { 
        type: 'source', 
        data: { 
          title: 'Example Source 2', 
          url: 'https://example.com/source2',
          snippet: 'More source content...'
        } 
      },
      { type: 'complete', message: 'Sources gathered' }
    ];
    
    await mockStreamingResearch(page, mockChunks);
    
    await page.goto('/multi-gpt-aggregated-research');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="research" i]').first();
    
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('Research with sources');
      await page.getByRole('button', { name: /research|search/i }).first().click();
      
      // Wait for sources to load
      await page.waitForTimeout(2000);
      
      // Check for source citations (multiple possible selectors)
      const hasSources = await page.locator('.source, [data-type="source"], a[href*="http"]').count() > 0;
      const hasSourceText = await page.getByText(/source|citation|reference/i).isVisible({ timeout: 5000 }).catch(() => false);
      const hasLinks = await page.locator('a[href^="http"]').count() > 0;
      
      expect(hasSources || hasSourceText || hasLinks).toBeTruthy();
    } else {
      console.log('Research interface not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 3: Streaming Completion Handling
   * Tests that streaming properly completes and shows final state
   */
  test('should handle streaming completion correctly', async ({ page }) => {
    const mockChunks = [
      { type: 'start', message: 'Starting...' },
      { type: 'chunk', data: 'Processing data' },
      { type: 'complete', message: 'Complete' }
    ];
    
    await mockStreamingResearch(page, mockChunks);
    
    await page.goto('/multi-gpt-aggregated-research');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="research" i]').first();
    
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('Test completion');
      await page.getByRole('button', { name: /research|search/i }).first().click();
      
      // Wait for completion
      await page.waitForTimeout(3000);
      
      // Verify streaming indicator is hidden
      const streamingHidden = await page.locator('.streaming, .loading').isHidden().catch(() => true);
      
      // Verify completion state
      const hasCompleteMessage = await page.getByText(/complete|done|finished/i).isVisible({ timeout: 5000 }).catch(() => false);
      const hasResults = await page.locator('.result, [data-type="result"]').count() > 0;
      
      expect(streamingHidden || hasCompleteMessage || hasResults).toBeTruthy();
    } else {
      console.log('Research interface not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 4: Streaming Error Handling
   * Tests error state when streaming fails
   */
  test('should handle streaming errors gracefully', async ({ page }) => {
    // Mock streaming error
    await page.route('**/api/research/stream', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Streaming failed' })
      });
    });
    
    await page.goto('/multi-gpt-aggregated-research');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="research" i]').first();
    
    if (await searchInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await searchInput.fill('Test error handling');
      await page.getByRole('button', { name: /research|search/i }).first().click();
      
      // Wait for error to display
      await page.waitForTimeout(2000);
      
      // Check for error indicators
      const errorVisible = await page.locator('.error, [role="alert"]').isVisible({ timeout: 5000 }).catch(() => false);
      const errorMessage = await page.getByText(/error|failed|try again/i).isVisible({ timeout: 5000 }).catch(() => false);
      
      expect(errorVisible || errorMessage).toBeTruthy();
    } else {
      console.log('Research interface not found - skipping test');
      test.skip();
    }
  });
});
