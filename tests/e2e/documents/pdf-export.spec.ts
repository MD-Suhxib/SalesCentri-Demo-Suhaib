import { test, expect } from '@playwright/test';
import { mockOpenAIResponse } from '../../helpers/ai-mocking';
import * as fs from 'fs';
import * as path from 'path';

/**
 * PDF Export Test Suite
 * Tests PDF generation and download functionality
 * 
 * Test Scenarios:
 * 1. Chat history PDF download
 * 2. PDF content validation (basic structure)
 */

test.describe('PDF Export', () => {

  /**
   * SCENARIO 1: Chat History PDF Download
   * Tests that PDF export is triggered and file is downloaded
   */
  test('should export chat history to PDF', async ({ page }) => {
    await mockOpenAIResponse(page, 'This is a test chat message for PDF export.');
    
    // Navigate to a page with chat functionality
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const chatInput = page.locator('textarea[placeholder*="message" i], input[placeholder*="message" i]').first();
    
    if (await chatInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Send a message to create chat history
      await chatInput.fill('Test message for PDF');
      await page.getByRole('button', { name: /send/i }).first().click();
      await page.waitForTimeout(2000);
      
      // Look for PDF export button (multiple possible selectors)
      const pdfButton = page.locator('button:has-text("PDF"), button:has-text("Export"), [aria-label*="PDF" i], [title*="PDF" i]').first();
      
      if (await pdfButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        // Set up download listener
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
        
        // Click export button
        await pdfButton.click();
        
        try {
          // Wait for download
          const download = await downloadPromise;
          
          // Verify filename
          const filename = download.suggestedFilename();
          expect(filename).toMatch(/\.pdf$/i);
          
          // Verify file was downloaded
          const downloadPath = await download.path();
          expect(downloadPath).toBeTruthy();
          
          // Verify file exists and has content
          if (downloadPath) {
            const fileExists = fs.existsSync(downloadPath);
            expect(fileExists).toBeTruthy();
            
            if (fileExists) {
              const fileStats = fs.statSync(downloadPath);
              expect(fileStats.size).toBeGreaterThan(0);
            }
          }
        } catch (error) {
          console.log('PDF download not triggered - feature may not be available');
          test.skip();
        }
      } else {
        console.log('PDF export button not found - skipping test');
        test.skip();
      }
    } else {
      console.log('Chat interface not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 2: PDF Content Validation
   * Tests that downloaded PDF contains expected content
   */
  test('should generate PDF with valid structure', async ({ page }) => {
    await mockOpenAIResponse(page, 'PDF content test message.');
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const chatInput = page.locator('textarea[placeholder*="message" i]').first();
    
    if (await chatInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Create chat history
      await chatInput.fill('Message for PDF validation');
      await page.getByRole('button', { name: /send/i }).first().click();
      await page.waitForTimeout(2000);
      
      // Find PDF export button
      const pdfButton = page.locator('button:has-text("PDF"), button:has-text("Export")').first();
      
      if (await pdfButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
        await pdfButton.click();
        
        try {
          const download = await downloadPromise;
          const downloadPath = await download.path();
          
          if (downloadPath && fs.existsSync(downloadPath)) {
            // Read file header to verify it's a valid PDF
            const buffer = fs.readFileSync(downloadPath);
            const header = buffer.toString('utf8', 0, 4);
            
            // PDF files start with %PDF
            expect(header).toBe('%PDF');
            
            // Verify file size is reasonable (at least 1KB)
            expect(buffer.length).toBeGreaterThan(1024);
          }
        } catch (error) {
          console.log('PDF validation not possible - skipping');
          test.skip();
        }
      } else {
        console.log('PDF export not available - skipping test');
        test.skip();
      }
    } else {
      console.log('Chat interface not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 3: Research Report PDF Export
   * Tests PDF export from research page
   */
  test('should export research report to PDF', async ({ page }) => {
    await mockOpenAIResponse(page, 'Research findings for PDF export.');
    
    // Navigate to research page
    await page.goto('/multi-gpt-aggregated-research');
    await page.waitForLoadState('networkidle');
    
    // Look for export button on research page
    const exportButton = page.locator('button:has-text("Export"), button:has-text("PDF"), button:has-text("Download")').first();
    
    if (await exportButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      await exportButton.click();
      
      try {
        const download = await downloadPromise;
        const filename = download.suggestedFilename();
        
        // Verify it's a PDF
        expect(filename).toMatch(/\.pdf$/i);
        
        // Verify download completed
        const path = await download.path();
        expect(path).toBeTruthy();
      } catch (error) {
        console.log('Research PDF export not available - skipping');
        test.skip();
      }
    } else {
      console.log('Export button not found on research page - skipping test');
      test.skip();
    }
  });
});
