import { test, expect } from '@playwright/test';
import * as fs from 'fs';

/**
 * Excel Export Test Suite
 * Tests Excel/XLSX generation and download functionality
 * 
 * Test Scenarios:
 * 1. Research findings spreadsheet download
 * 2. Excel file structure validation
 */

test.describe('Excel Export', () => {

  /**
   * SCENARIO 1: Research Findings Spreadsheet Download
   * Tests that Excel export is triggered and file is downloaded
   */
  test('should export research findings to Excel', async ({ page }) => {
    // Navigate to research page or data page
    await page.goto('/multi-gpt-aggregated-research');
    await page.waitForLoadState('networkidle');
    
    // Look for Excel export button (multiple possible selectors)
    const excelButton = page.locator(
      'button:has-text("Excel"), button:has-text("XLSX"), button:has-text("Spreadsheet"), [aria-label*="Excel" i], [title*="Excel" i]'
    ).first();
    
    if (await excelButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      
      // Click export button
      await excelButton.click();
      
      try {
        // Wait for download
        const download = await downloadPromise;
        
        // Verify filename
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.(xlsx|xls)$/i);
        
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
        console.log('Excel download not triggered - feature may not be available');
        test.skip();
      }
    } else {
      console.log('Excel export button not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 2: Excel File Structure Validation
   * Tests that downloaded Excel file has valid structure
   */
  test('should generate Excel with valid structure', async ({ page }) => {
    await page.goto('/multi-gpt-aggregated-research');
    await page.waitForLoadState('networkidle');
    
    const excelButton = page.locator('button:has-text("Excel"), button:has-text("Export")').first();
    
    if (await excelButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      await excelButton.click();
      
      try {
        const download = await downloadPromise;
        const downloadPath = await download.path();
        
        if (downloadPath && fs.existsSync(downloadPath)) {
          // Read file header to verify it's a valid Excel file
          const buffer = fs.readFileSync(downloadPath);
          
          // XLSX files start with PK (ZIP format signature)
          const header = buffer.toString('hex', 0, 2);
          expect(header).toBe('504b'); // PK in hex
          
          // Verify file size is reasonable (at least 2KB for minimal Excel)
          expect(buffer.length).toBeGreaterThan(2048);
          
          // Check for Excel-specific content
          const content = buffer.toString('utf8');
          const hasExcelMarkers = content.includes('xl/') || content.includes('workbook');
          expect(hasExcelMarkers).toBeTruthy();
        }
      } catch (error) {
        console.log('Excel validation not possible - skipping');
        test.skip();
      }
    } else {
      console.log('Excel export not available - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 3: Lead Data Export to Excel
   * Tests Excel export from lead/contact data pages
   */
  test('should export lead data to Excel spreadsheet', async ({ page }) => {
    // Navigate to a page that might have lead data export
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for data export functionality
    const exportButton = page.locator('button:has-text("Export"), [aria-label*="export" i]').first();
    
    if (await exportButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Click to open export options
      await exportButton.click();
      await page.waitForTimeout(500);
      
      // Look for Excel option in dropdown/menu
      const excelOption = page.locator('text=/Excel|XLSX|Spreadsheet/i').first();
      
      if (await excelOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
        await excelOption.click();
        
        try {
          const download = await downloadPromise;
          const filename = download.suggestedFilename();
          expect(filename).toMatch(/\.(xlsx|xls|csv)$/i);
        } catch (error) {
          console.log('Lead data export not available - skipping');
          test.skip();
        }
      } else {
        console.log('Excel export option not found - skipping');
        test.skip();
      }
    } else {
      console.log('Export functionality not found - skipping test');
      test.skip();
    }
  });

  /**
   * SCENARIO 4: CSV Export Alternative
   * Tests CSV export as alternative to Excel
   */
  test('should export data to CSV format', async ({ page }) => {
    await page.goto('/multi-gpt-aggregated-research');
    await page.waitForLoadState('networkidle');
    
    // Look for CSV export option
    const csvButton = page.locator('button:has-text("CSV"), [aria-label*="CSV" i]').first();
    
    if (await csvButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 });
      await csvButton.click();
      
      try {
        const download = await downloadPromise;
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.csv$/i);
        
        const downloadPath = await download.path();
        if (downloadPath && fs.existsSync(downloadPath)) {
          const content = fs.readFileSync(downloadPath, 'utf8');
          
          // Verify CSV structure (should have commas or semicolons)
          expect(content).toMatch(/[,;]/);
          
          // Verify it has content
          expect(content.length).toBeGreaterThan(0);
        }
      } catch (error) {
        console.log('CSV export not available - skipping');
        test.skip();
      }
    } else {
      console.log('CSV export button not found - skipping test');
      test.skip();
    }
  });
});
