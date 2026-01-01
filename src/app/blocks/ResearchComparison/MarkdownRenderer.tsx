"use client";

import React, { useRef, memo } from 'react';
import styles from './MarkdownStyles.module.css';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import ReactMarkdown from 'react-markdown';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { getDefaultLogoDataUrl } from '@/app/lib/leadTableExporter';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
  hideTopToolbar?: boolean;
}

/**
 * Renders markdown content with appropriate styling
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = memo(({ markdown, className, hideTopToolbar = false }) => {
  // Reference to the content element that will be converted to PDF
  const contentRef = useRef<HTMLDivElement>(null);

  // Enhanced markdown processing for better table handling
  const processMarkdown = (markdown: string) => {
    try {
      // Process markdown and wrap tables in scrollable containers
      let processedMarkdown = markdown.replace(
        /<table[^>]*>[\s\S]*?<\/table>/gi,
        (table) => `<div class="table-container">${table}</div>`
      );
      
      // Enhanced markdown table formatting for ResearchGPT tables
      // Process each table individually to avoid merging multiple tables
      processedMarkdown = processedMarkdown.replace(
        /(\|.*\|[\s\S]*?)(?=\n\n|\n#|\n\*\*|\n##|\n###|\n####|\n-|\n\*|\n\d+\.|$)/g,
        (tableBlock) => {
          // Split the block by lines and process each potential table separately
          const lines = tableBlock.trim().split('\n');
          const processedLines: string[] = [];
          let currentTable: string[] = [];
          let inTable = false;
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Check if this line starts a table
            if (trimmedLine.includes('|') && !inTable) {
              const isTableHeader = isTableHeaderLine(trimmedLine);
              if (isTableHeader) {
                inTable = true;
                currentTable = [line];
                continue;
              }
            }
            
            // If we're in a table, check if this line continues the table
            if (inTable) {
              const isTableRow = isTableRowLine(trimmedLine);
              const isTableSeparator = isTableSeparatorLine(trimmedLine);
              const isEmpty = !trimmedLine;
              
              if (isTableRow || isTableSeparator) {
                currentTable.push(line);
              } else if (isEmpty) {
                // Empty line - end current table
                if (currentTable.length > 0) {
                  const processedTable = processTableBlock(currentTable);
                  processedLines.push(processedTable);
                  currentTable = [];
                }
                inTable = false;
                processedLines.push(line); // Keep the empty line
              } else {
                // Non-table content - end current table
                if (currentTable.length > 0) {
                  const processedTable = processTableBlock(currentTable);
                  processedLines.push(processedTable);
                  currentTable = [];
                }
                inTable = false;
                processedLines.push(line);
              }
            } else {
              processedLines.push(line);
            }
          }
          
          // Handle table that ends at the end of the block
          if (inTable && currentTable.length > 0) {
            const processedTable = processTableBlock(currentTable);
            processedLines.push(processedTable);
          }
          
          return processedLines.join('\n') + '\n';
        }
      );
      
      // Helper functions for table detection and processing
      function isTableHeaderLine(line: string): boolean {
        return line.includes('|') && 
               (line.toLowerCase().includes('company') || 
                line.toLowerCase().includes('name') ||
                line.toLowerCase().includes('website') ||
                line.toLowerCase().includes('industry'));
      }
      
      function isTableRowLine(line: string): boolean {
        return line.includes('|') && 
               !line.match(/^[-=\s|]+$/) && // Not a separator
               line.split('|').length >= 3; // Has at least 3 columns
      }
      
      function isTableSeparatorLine(line: string): boolean {
        return !!line.match(/^[-=\s|]+$/); // Contains only dashes, equals, spaces, and pipes
      }
      
      function processTableBlock(tableLines: string[]): string {
        const lines = tableLines.filter(line => line.trim());
        
        if (lines.length === 0) return '';
        
        // Check if this is a single-line table with headers and data mixed
        if (lines.length === 1) {
          const line = lines[0];
          
          // Check if this line contains both headers and data (common in malformed tables)
          if (line.includes('|') && (line.includes('Company') || line.includes('Website') || line.includes('Industry'))) {
            // Try to detect where headers end and data begins
            const parts = line.split('|').map(p => p.trim()).filter(p => p);
            
            // If we have too many columns, it might be headers + data on same line
            if (parts.length > 6) {
              // Try to find a logical split point
              let headerEndIndex = -1;
              for (let i = 0; i < parts.length; i++) {
                const part = parts[i].toLowerCase();
                // Look for common header indicators
                if (part.includes('company') || part.includes('website') || part.includes('industry') || 
                    part.includes('revenue') || part.includes('employees') || part.includes('location')) {
                  headerEndIndex = i;
                }
              }
              
              if (headerEndIndex >= 0 && headerEndIndex < parts.length - 1) {
                // Split into headers and data
                const headers = parts.slice(0, headerEndIndex + 1);
                const dataRow = parts.slice(headerEndIndex + 1);
                
                // Create proper table structure
                const headerLine = '| ' + headers.join(' | ') + ' |';
                const separatorLine = '|' + ' --- |'.repeat(headers.length);
                const dataLine = '| ' + dataRow.join(' | ') + ' |';
                
                return `${headerLine}\n${separatorLine}\n${dataLine}`;
              }
            }
          }
        }
        
        // Check if this looks like a ResearchGPT table
        const hasCompanyName = lines.some(line => line.includes('Company Name'));
        const hasSeparator = lines.some(line => /^[-=\s|]+$/.test(line));
        
        if (hasCompanyName && !hasSeparator && lines.length > 1) {
          // Add separator row if missing
          const headerLine = lines[0];
          const columnCount = headerLine.split('|').length - 2; // Account for empty start/end
          const separator = '|' + ' --- |'.repeat(columnCount);
          
          // Insert separator after header
          lines.splice(1, 0, separator);
        }
        
        return lines.join('\n');
      }
      
      return processedMarkdown;
      
    } catch (error) {
      console.error('Error processing markdown:', error);
      return markdown; // Return original on error
    }
  };
  
  console.log("MarkdownRenderer received:", markdown ? `${markdown.length} characters` : "null/empty");
  
  if (!markdown) {
    console.log("MarkdownRenderer: No markdown content provided");
    return null;
  }
  
  // Function to convert markdown content to PDF and download
  const handleDownload = async () => {
    if (!contentRef.current) return;
    
    // Get button reference
    const downloadButton = document.querySelector(`.${styles.downloadButton}`) as HTMLButtonElement;
    const originalButtonText = downloadButton?.textContent;
    
    const updateButtonStatus = (message: string) => {
      if (downloadButton) {
        downloadButton.textContent = message;
      }
    };
    
    try {
      // Show loading state with steps
      updateButtonStatus('Preparing content...');
      
      // Create a temporary element for PDF generation with light theme for better compatibility
      updateButtonStatus('Formatting content...');
      const tempElement = document.createElement('div');
      tempElement.innerHTML = contentRef.current.innerHTML;
      tempElement.style.padding = '20px';
      tempElement.style.background = '#ffffff'; // White background for PDF compatibility
      tempElement.style.color = '#000000'; // Black text for PDF compatibility
      tempElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
      tempElement.style.width = '800px';
      tempElement.style.position = 'fixed';
      tempElement.style.top = '0';
      tempElement.style.left = '-9999px';
      tempElement.style.zIndex = '-1000';
      tempElement.style.lineHeight = '1.6';
      
      // Apply styles to the temp element for PDF generation with light theme for compatibility
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        * { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
          color: #000000 !important;
        }
        h1 { 
          font-size: 1.5rem; 
          margin-top: 0.5rem; 
          margin-bottom: 1rem; 
          font-weight: 600; 
          color: #000000 !important; 
        }
        h2 { 
          font-size: 1.25rem; 
          margin-top: 1.5rem; 
          margin-bottom: 0.75rem; 
          font-weight: 600; 
          color: #000000 !important; 
        }
        h3 { 
          font-size: 1.1rem; 
          margin-top: 1.25rem; 
          margin-bottom: 0.5rem; 
          font-weight: 600; 
          color: #000000 !important; 
        }
        p { 
          margin: 0.75rem 0; 
          color: #000000 !important; 
          line-height: 1.6; 
        }
        li { 
          margin: 0.25rem 0; 
          color: #000000 !important; 
        }
        code {
          background: #f5f5f5 !important;
          color: #d63384 !important;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.85rem;
        }
        pre {
          background: #f8f9fa !important;
          color: #000000 !important;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          margin: 1.5rem 0;
          border: 1px solid #dee2e6;
        }
        pre code {
          background: transparent !important;
          padding: 0;
          color: #000000 !important;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          border: 1px solid #dee2e6;
          font-size: 0.85rem; /* Smaller font for better PDF fitting */
          table-layout: fixed !important; /* FIXED layout FORCES equal column widths */
        }
        th {
          background: #f8f9fa !important;
          padding: 0.5rem 0.25rem; /* Reduced padding for PDF */
          text-align: left;
          border: 1px solid #dee2e6;
          font-weight: 600;
          color: #000000 !important;
          font-size: 0.8rem; /* Smaller header font */
          /* Prevent word breaks in headers */
          word-break: normal;
          overflow-wrap: break-word;
          hyphens: none; /* Prevent automatic hyphenation */
          white-space: normal; /* Allow wrapping but keep words intact */
          width: 10%; /* Equal width distribution for 10 columns */
          min-width: 100px; /* Minimum column width */
          max-width: none; /* Remove max-width constraint */
        }
        td {
          border: 1px solid #dee2e6;
          padding: 0.5rem 0.4rem; /* Slightly increased padding for better readability */
          text-align: left;
          color: #000000 !important;
          background: #ffffff !important;
          font-size: 0.75rem; /* Smaller cell font for PDF */
          /* Prevent awkward word breaks */
          word-break: normal;
          overflow-wrap: break-word;
          hyphens: none; /* Prevent automatic hyphenation */
          white-space: normal; /* Allow wrapping but keep words intact */
          width: 10%; /* Equal width distribution for 10 columns */
          min-width: 100px; /* Minimum column width */
          max-width: none; /* Remove max-width constraint for better distribution */
          vertical-align: top; /* Align content to top for better readability */
        }
        blockquote {
          border-left: 4px solid #0070f3;
          margin-left: 0;
          padding: 0.5rem 0 0.5rem 1rem;
          color: #333333 !important;
          background-color: #f8f9fa !important;
          margin: 1rem 0;
        }
        a { 
          color: #0070f3 !important; 
          text-decoration: none; 
        }
        a:hover { 
          text-decoration: underline; 
        }
        ul, ol { 
          margin: 0.75rem 0; 
          padding-left: 1.5rem; 
        }
        strong { 
          font-weight: 600; 
          color: #000000 !important; 
        }
        em { 
          font-style: italic; 
          color: #000000 !important; 
        }
      `;
      tempElement.appendChild(styleElement);
      
      // Add to DOM temporarily
      document.body.appendChild(tempElement);
      
      // Convert to image with better quality settings for light theme compatibility
      updateButtonStatus('Creating image...');
      const dataUrl = await toPng(tempElement, {
        quality: 1.0,         // Highest quality
        width: 800,
        height: tempElement.offsetHeight,
        pixelRatio: 2,        // Good balance of quality and rendering speed
        canvasWidth: 1600,    // 2x the width for better quality
        skipFonts: false,     // Include fonts for better rendering
        cacheBust: true,      // Avoid caching issues
        backgroundColor: '#ffffff'  // White background for better PDF compatibility
      });
      
      // Remove temporary element
      document.body.removeChild(tempElement);
      
      // Extract a title from the markdown content if possible
      let title = 'Research Results';
      try {
        // Try to extract a title from the first heading
        const headingMatch = markdown.match(/^#\s+(.+)$/m);
        if (headingMatch && headingMatch[1]) {
          title = headingMatch[1].trim();
        }
      } catch (e) {
        // Fallback to default title if extraction fails
        console.error('Error extracting title:', e);
      }

      // Create PDF document (A4 size)
      updateButtonStatus('Generating PDF...');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Calculate dimensions for the image in the PDF (A4 = 210mm × 297mm)
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth - 20; // Add some margins
      
      // Load the image
      const img = new Image();
      img.src = dataUrl;
      
      await new Promise<void>((resolve) => {
        img.onload = () => {
          // Calculate height proportionally to width
          const aspectRatio = img.height / img.width;
          // imgHeight is calculated for future use when implementing proportional scaling
          const imgHeight = imgWidth * aspectRatio;
          console.log(`Image aspect ratio: ${aspectRatio}, calculated height: ${imgHeight}`);
          
          // Add each section to a new page if too long
          let remainingHeight = img.height;
          let srcY = 0;
          let pageCount = 1;
          
          const addHeaderFooter = (pageNum: number) => {
            // Add header with dark theme styling
            pdf.setFillColor(26, 26, 26); // Dark background matching display (#1a1a1a)
            pdf.rect(0, 0, pdfWidth, 15, 'F');
            
            // Add title with white text
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(255, 255, 255); // White text
            pdf.text(title, 42, 10);

            // Try add logo on header left
            try {
              // getDefaultLogoDataUrl returns promise; we already are in sync loop, but we can prefetch above; fallback to inline await isn't possible here, so best-effort sync cache via window
              const anyWindow = window as any;
              if (!anyWindow.__scLogoCache) {
                getDefaultLogoDataUrl().then((d) => { anyWindow.__scLogoCache = d; });
              }
              if (anyWindow.__scLogoCache) {
                try { pdf.addImage(anyWindow.__scLogoCache, 'PNG', 10, 4, 24, 9); } catch {}
              }
            } catch {}
            
            // Add footer with page number and dark theme
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(204, 204, 204); // Light gray text (#cccccc)
            pdf.text(`Page ${pageNum}`, pdfWidth / 2, pdfHeight - 5, { align: 'center' });
            
            // Add timestamp in footer
            const timestamp = new Date().toLocaleString();
            pdf.text(`Generated on: ${timestamp}`, pdfWidth - 10, pdfHeight - 5, { align: 'right' });
            
            // Return the Y position after the header for content
            return 20; // Space after header
          };
          
          while (remainingHeight > 0) {
            // Add header and get starting Y position for content
            const pdfY = addHeaderFooter(pageCount);
            
            const canvasHeight = Math.min(remainingHeight, (pdfHeight - 30) * (img.width / imgWidth));
            
            // Add image section to PDF - specify just the essential params
            // For jsPDF 3.x, we need to use a different approach for clipping images
            const clipHeight = canvasHeight * (imgWidth / img.width);
            
            // Create a temporary canvas for the clipped portion
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not create canvas context");
            
            canvas.width = img.width;
            canvas.height = canvasHeight;
            ctx.drawImage(img, 0, srcY, img.width, canvasHeight, 0, 0, img.width, canvasHeight);
            
            // Convert the clipped canvas to data URL
            const clippedImage = canvas.toDataURL('image/png');
            
            // Add the clipped image to PDF
            pdf.addImage(
              clippedImage,
              'PNG',
              10,
              pdfY,
              imgWidth,
              clipHeight
            );
            
            // Calculate how much is left to render
            remainingHeight -= canvasHeight;
            srcY += canvasHeight;
            
            // If more content remains, add a new page
            if (remainingHeight > 0) {
              pdf.addPage();
              pageCount++;
            }
          }
          
          resolve();
        };
      });
      
      // Customize file name based on content
      const fileName = title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.pdf';
      
      // Save PDF file
      updateButtonStatus('Finalizing...');
      pdf.save(fileName);
      
      // Restore button text with success indicator
      setTimeout(() => {
        if (downloadButton) {
          downloadButton.textContent = '✓ PDF Downloaded';
          
          // Reset after 2 seconds
          setTimeout(() => {
            if (downloadButton) {
              downloadButton.textContent = originalButtonText || 'Download PDF';
            }
          }, 2000);
        }
      }, 500);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      // Restore button text on error with indicator
      if (downloadButton) {
        downloadButton.textContent = '❌ Download Failed';
        
        // Reset after 2 seconds
        setTimeout(() => {
          if (downloadButton) {
            downloadButton.textContent = 'Download PDF';
          }
        }, 2000);
      }
    }
  };

  return (
    <div className={`${styles.markdown} ${className || ''}`}>
      {!hideTopToolbar && (
        <div className={styles.markdownToolbar}>
          <button onClick={handleDownload} className={styles.downloadButton}>
            Download PDF
          </button>
        </div>
      )}
      <div ref={contentRef}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            // Customize link behavior if needed
            a: ({ href, children, ...props }) => {
              // Special case for ICP button
              if (href === '#show-icp') {
                return (
                  <div className="icp-button-container">
                    <button 
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).showICP) {
                          (window as any).showICP();
                        }
                      }}
                      className="icp-button"
                      onMouseOver={(e) => {
                        e.currentTarget.classList.add('icp-button-hover');
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.classList.remove('icp-button-hover');
                      }}
                    >
                      {children}
                    </button>
                  </div>
                );
              }
              // Default link behavior
              return <a target="_blank" rel="noopener noreferrer" href={href} {...props}>{children}</a>;
            },
            // Enhanced table wrapper for horizontal scrolling with ResearchGPT support
            table: ({ children, ...props }) => {
              // Check if this is a ResearchGPT table
              const tableContent = React.Children.toArray(children).join('');
              const isResearchGPTTable = tableContent.includes('Company Name') || 
                                       tableContent.includes('Website') ||
                                       tableContent.includes('Industry');
              
              return (
                <div className={`table-container ${isResearchGPTTable ? 'researchgpt-table' : ''}`}>
                  <table 
                    {...props} 
                    className={isResearchGPTTable ? 'researchgpt-table-content researchgpt-table-styles' : ''}
                  >
                    {children}
                  </table>
                </div>
              );
            },
          }}
        >
          {processMarkdown(markdown)}
        </ReactMarkdown>
      </div>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
