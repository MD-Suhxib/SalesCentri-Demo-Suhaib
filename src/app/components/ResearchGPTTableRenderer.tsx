"use client";

import React, { useRef, memo, useMemo, useEffect } from 'react';
import MarkdownRenderer from '@/app/blocks/ResearchComparison/MarkdownRenderer';
import ResearchGPTTextRenderer from './ResearchGPTTextRenderer';
import { parseMixedContent } from '@/app/lib/contentParser';
import styles from '@/app/blocks/ResearchComparison/MarkdownStyles.module.css';
import './lightning-mode.css';

interface ResearchGPTTableRendererProps {
  markdown: string;
  className?: string;
  hideTopToolbar?: boolean;
}

/**
 * Enhanced table renderer specifically for ResearchGPT mode
 * Provides better table display with improved headers and styling
 */
const ResearchGPTTableRenderer: React.FC<ResearchGPTTableRendererProps> = memo(({ 
  markdown, 
  className, 
  hideTopToolbar = false 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle scroll indicator for main container and table containers
  useEffect(() => {
    const handleScroll = () => {
      // Handle main container scroll
      const mainContainer = contentRef.current?.closest('.researchgpt-table-container') as HTMLElement;
      if (mainContainer) {
        const isScrolledRight = mainContainer.scrollLeft >= (mainContainer.scrollWidth - mainContainer.clientWidth - 1);
        
        if (isScrolledRight) {
          mainContainer.classList.add('scrolled-right');
        } else {
          mainContainer.classList.remove('scrolled-right');
        }
      }

      // Handle table containers scroll
      const tableContainers = contentRef.current?.querySelectorAll('.table-container');
      tableContainers?.forEach((container) => {
        const element = container as HTMLElement;
        const isScrolledRight = element.scrollLeft >= (element.scrollWidth - element.clientWidth - 1);
        
        if (isScrolledRight) {
          element.classList.add('scrolled-right');
        } else {
          element.classList.remove('scrolled-right');
        }
      });
    };

    // Add scroll listeners to main container
    const mainContainer = contentRef.current?.closest('.researchgpt-table-container') as HTMLElement;
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
    }

    // Add scroll listeners to all table containers
    const tableContainers = contentRef.current?.querySelectorAll('.table-container');
    tableContainers?.forEach((container) => {
      container.addEventListener('scroll', handleScroll);
    });

    // Initial check
    handleScroll();

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
      tableContainers?.forEach((container) => {
        container.removeEventListener('scroll', handleScroll);
      });
    };
  }, [markdown]);

  // Parse content to separate text and tables
  const parsedContent = useMemo(() => {
    const result = parseMixedContent(markdown);
    console.log('🔍 ResearchGPTTableRenderer - Content Analysis:', {
      originalLength: markdown.length,
      isMixedContent: result.isMixedContent,
      hasText: result.hasText,
      hasTables: result.hasTables,
      textSectionsCount: result.textSections.length,
      tableSectionsCount: result.tableSections.length,
      firstTextPreview: result.textSections[0]?.substring(0, 200),
      firstTablePreview: result.tableSections[0]?.substring(0, 200)
    });
    return result;
  }, [markdown]);

  // Enhanced table processing for ResearchGPT with Focus Mode integration
  const processedMarkdown = useMemo(() => {
    if (!markdown) return markdown;

    // Check if this is a prospect table that should use Focus Mode layout
    if (isProspectTable(markdown)) {
      console.log('🔍 ResearchGPT: Detected prospect table, converting to Focus Mode layout');
      const converted = convertToFocusModeGrid(markdown);
      console.log('🔍 ResearchGPT: Conversion result preview:', converted.substring(0, 500));
      return converted;
    }

    // Process regular tables with enhanced normalization
    return markdown.replace(
      /<table[^>]*>[\s\S]*?<\/table>/gi,
      (table) => {
        try {
          return enhanceTableStructure(table);
        } catch (error) {
          console.error('Error enhancing table:', error);
          return table;
        }
      }
    );
  }, [markdown]);

  // Check if we should use Focus Mode layout
  const isUsingFocusModeLayout = isProspectTable(markdown);

  // Handle mixed content rendering
  if (parsedContent.isMixedContent) {
    return (
      <div className={`${styles.markdown} ${className || ''}`}>
        {!hideTopToolbar && (
          <div className={styles.markdownToolbar}>
            <button 
              onClick={() => {
                // Enhanced download functionality for ResearchGPT tables
                if (contentRef.current) {
                  handleResearchGPTDownload(contentRef.current, markdown);
                }
              }} 
              className={styles.downloadButton}
            >
              Download Research Results
            </button>
          </div>
        )}
        <div ref={contentRef}>
          {/* Render text sections first */}
          {parsedContent.textSections.map((textSection, index) => (
            <ResearchGPTTextRenderer
              key={`text-${index}`}
              content={textSection}
              className="mb-4"
            />
          ))}
          
          {/* Render table sections */}
          {parsedContent.tableSections.map((tableSection, index) => (
            <div key={`table-${index}`} className="mb-4">
              <ResearchGPTTableRenderer
                markdown={tableSection}
                hideTopToolbar={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle text-only content
  if (parsedContent.hasText && !parsedContent.hasTables) {
    return (
      <div className={`${styles.markdown} ${className || ''}`}>
        {!hideTopToolbar && (
          <div className={styles.markdownToolbar}>
            <button 
              onClick={() => {
                // Enhanced download functionality for ResearchGPT tables
                if (contentRef.current) {
                  handleResearchGPTDownload(contentRef.current, markdown);
                }
              }} 
              className={styles.downloadButton}
            >
              Download Research Results
            </button>
          </div>
        )}
        <div ref={contentRef}>
          <ResearchGPTTextRenderer content={markdown} />
        </div>
      </div>
    );
  }

  // Handle content that has tables but no text sections (pure table content)
  if (parsedContent.hasTables && !parsedContent.hasText) {
    console.log('🔍 ResearchGPT: Pure table content detected, using ResearchGPT grid renderer');
    // Use ResearchGPT grid layout
    return (
      <div className={`${styles.markdown} ${className || ''} researchgpt-grid-container`}>
        {!hideTopToolbar && (
          <div className={styles.markdownToolbar}>
            <button 
              onClick={() => {
                // Enhanced download functionality for ResearchGPT tables
                if (contentRef.current) {
                  handleResearchGPTDownload(contentRef.current, markdown);
                }
              }} 
              className={styles.downloadButton}
            >
              Download Research Results
            </button>
          </div>
        )}
        <div ref={contentRef} className="researchgpt-grid-content">
            <div dangerouslySetInnerHTML={{ __html: processedMarkdown }} />
        </div>
      </div>
    );
  }

  // Fallback for any other content type
  console.log('🔍 ResearchGPT: Fallback rendering for content type:', {
    hasText: parsedContent.hasText,
    hasTables: parsedContent.hasTables,
    isMixedContent: parsedContent.isMixedContent
  });
  
  return (
    <div className={`${styles.markdown} ${className || ''}`}>
      {!hideTopToolbar && (
        <div className={styles.markdownToolbar}>
          <button 
            onClick={() => {
              // Enhanced download functionality for ResearchGPT tables
              if (contentRef.current) {
                handleResearchGPTDownload(contentRef.current, markdown);
              }
            }} 
            className={styles.downloadButton}
          >
            Download Research Results
          </button>
        </div>
      )}
      <div ref={contentRef}>
        <MarkdownRenderer
          markdown={markdown}
          hideTopToolbar={true}
        />
      </div>
    </div>
  );
});

/**
 * Detect if the markdown content contains prospect tables
 */
function isProspectTable(markdown: string): boolean {
  if (!markdown) return false;
  
  // Check for common prospect table indicators
  const prospectIndicators = [
    'Company Name',
    'Website',
    'Industry',
    'Decision Maker',
    'Pain Points',
    'generate leads',
    'prospect',
    'lead generation',
    'sales opportunities',
    'QUALIFIED PROSPECT LIST',
    'grid-header',
    'grid-cell',
    'Sales Opportunities Analysis',
    'HIGH-PRIORITY PROSPECTS',
    'MEDIUM-PRIORITY PROSPECTS'
  ];
  
  const lowerMarkdown = markdown.toLowerCase();
  
  // Check if it contains HTML grid structure (already converted)
  const hasGridStructure = markdown.includes('sales-opportunities-grid-container') || 
                          markdown.includes('grid-header') ||
                          markdown.includes('grid-cell');
  
  // Check if it contains markdown table structure
  const hasTableStructure = markdown.includes('|') && markdown.includes('---');
  
  // Check if it has prospect content
  const hasProspectContent = prospectIndicators.some(indicator => 
    lowerMarkdown.includes(indicator.toLowerCase())
  );

  // Also check for the specific 13-column table structure
  const hasStandardColumns = markdown.includes('Company Name') && 
                           markdown.includes('Website') && 
                           markdown.includes('Industry') &&
                           markdown.includes('Pain Points') &&
                           markdown.includes('Approach Strategy');
  
  // Return true if it has prospect content AND either grid structure OR table structure OR standard columns
  return hasProspectContent && (hasGridStructure || hasTableStructure || hasStandardColumns);
}

/**
 * Convert ResearchGPT markdown tables to CSS Grid format with headers and data in separate rows
 */
function convertToFocusModeGrid(markdown: string): string {
  try {
    // First, clean the markdown to remove unwanted columns
    const cleanedMarkdown = removeUnwantedColumns(markdown);
    
    // If content already has grid structure, clean and fix it
    if (cleanedMarkdown.includes('researchgpt-grid-container')) {
      console.log('🔍 ResearchGPT: Content already in grid format, cleaning and fixing structure');
      return cleanAndFixGridStructure(cleanedMarkdown);
    }
    
    // Extract tables from markdown - improved regex to catch all table formats
    const tableRegex = /(\|.*\|[\s\S]*?)(?=\n\n|\n#|\n\*\*|\n\*|\n$|$)/g;
    const tables = cleanedMarkdown.match(tableRegex);
    
    console.log('🔍 Table Detection Debug:', {
      cleanedMarkdownLength: cleanedMarkdown.length,
      tablesFound: tables ? tables.length : 0,
      firstTable: tables ? tables[0]?.substring(0, 200) : 'No tables found'
    });
    
    if (!tables || tables.length === 0) {
      return cleanedMarkdown;
    }
    
    let convertedMarkdown = cleanedMarkdown;
    
    tables.forEach((table, index) => {
      console.log(`🔍 Processing table ${index + 1}:`, {
        tableLength: table.length,
        tablePreview: table.substring(0, 200)
      });
      
      const gridContent = convertTableToResearchGPTGrid(table);
      console.log(`🔍 Grid conversion result for table ${index + 1}:`, {
        gridContentLength: gridContent.length,
        gridContentPreview: gridContent.substring(0, 200),
        wasConverted: gridContent !== table
      });
      
      if (gridContent && gridContent !== table) {
        convertedMarkdown = convertedMarkdown.replace(table, gridContent);
        console.log(`🔍 Table ${index + 1} replaced successfully`);
      } else {
        console.log(`🔍 Table ${index + 1} not converted or no change`);
      }
    });
    
    return convertedMarkdown;
  } catch (error) {
    console.error('Error converting table to grid:', error);
    return markdown;
  }
}

/**
 * Remove unwanted columns from markdown tables before processing
 */
function removeUnwantedColumns(markdown: string): string {
  try {
    const unwantedColumns = ['verification evidence', 'urgency', 'contact info', 'linkedin', 'source model', 'contact information', 'email', 'phone'];
    
    // Process markdown tables
    return markdown.replace(/(\|.*\|[\s\S]*?)(?=\n\n|\n#|\n\*\*|$)/g, (table) => {
      const lines = table.trim().split('\n').filter(line => line.trim());
      if (lines.length < 3) return table; // Need header, separator, and at least one data row
      
      // Parse header row
      const headerLine = lines[0];
      const headers = headerLine.split('|').map(h => h.trim()).filter(h => h && h !== '');
      
      // Find unwanted column indices
      const unwantedIndices = headers.map((header, index) => {
        const lowerHeader = header.toLowerCase().trim();
        const isUnwanted = unwantedColumns.some(unwanted => 
          lowerHeader.includes(unwanted.toLowerCase()) || 
          unwanted.toLowerCase().includes(lowerHeader)
        );
        return isUnwanted ? index : -1;
      }).filter(index => index !== -1);
      
      if (unwantedIndices.length === 0) return table; // No unwanted columns found
      
      console.log('🔍 ResearchGPT: Removing unwanted columns', {
        originalHeaders: headers,
        unwantedIndices,
        removedHeaders: unwantedIndices.map(i => headers[i])
      });
      
      // Rebuild table without unwanted columns
      const filteredLines = lines.map(line => {
        const cells = line.split('|').map(c => c.trim());
        const filteredCells = cells.filter((_, index) => !unwantedIndices.includes(index));
        return '|' + filteredCells.join('|') + '|';
      });
      
      return filteredLines.join('\n');
    });
  } catch (error) {
    console.error('Error removing unwanted columns:', error);
    return markdown;
  }
}

/**
 * Clean and fix existing grid structure to ensure proper column order
 */
function cleanAndFixGridStructure(markdown: string): string {
  try {
    // Extract all ResearchGPT grid containers
    const researchGPTGridRegex = /<div class="researchgpt-grid-container">[\s\S]*?<\/div>\s*<\/div>/g;
    const researchGPTGrids = markdown.match(researchGPTGridRegex);
    
    // Extract all legacy grid containers
    const legacyGridRegex = /<div class="sales-opportunities-grid-container">[\s\S]*?<\/div>\s*<\/div>/g;
    const legacyGrids = markdown.match(legacyGridRegex);
    
    let cleanedMarkdown = markdown;
    
    // Process ResearchGPT grids
    if (researchGPTGrids) {
      researchGPTGrids.forEach(grid => {
        const cleanedGrid = cleanResearchGPTGrid(grid);
        if (cleanedGrid) {
          cleanedMarkdown = cleanedMarkdown.replace(grid, cleanedGrid);
        }
      });
    }
    
    // Process legacy grids
    if (legacyGrids) {
      legacyGrids.forEach(grid => {
      const tableStructure = convertGridToTable(grid);
      if (tableStructure) {
        cleanedMarkdown = cleanedMarkdown.replace(grid, tableStructure);
      }
    });
    }
    
    return cleanedMarkdown;
  } catch (error) {
    console.error('Error cleaning grid structure:', error);
    return markdown;
  }
}

/**
 * Clean ResearchGPT grid structure
 */
function cleanResearchGPTGrid(gridHtml: string): string {
  try {
    // Extract headers and cells from ResearchGPT grid
    const headers = gridHtml.match(/<div class="researchgpt-grid-header">([^<]*)<\/div>/g) || [];
    const cells = gridHtml.match(/<div class="researchgpt-grid-cell">([\s\S]*?)<\/div>/g) || [];
    
    if (headers.length === 0 || cells.length === 0) return gridHtml;
    
    // Clean headers (remove extra whitespace and markdown)
    const cleanHeaders = headers.map(header => {
      let content = header.replace(/<div class="researchgpt-grid-header">|<\/div>/g, '').trim();
      // Remove markdown formatting
      content = content.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold
      content = content.replace(/\*([^*]+)\*/g, '$1'); // Remove italic
      return content;
    });

    // Clean cells (remove markdown formatting and extra whitespace)
    const cleanCells = cells.map(cell => {
      let content = cell.replace(/<div class="researchgpt-grid-cell[^"]*">|<\/div>/g, '').trim();
      // Remove markdown formatting
      content = content.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold
      content = content.replace(/\*([^*]+)\*/g, '$1'); // Remove italic
      content = content.replace(/`([^`]+)`/g, '$1'); // Remove code
      // Clean up extra whitespace and newlines
      content = content.replace(/\s+/g, ' ').trim();
      // Remove any remaining HTML tags that might be in the content
      content = content.replace(/<[^>]*>/g, '');
      return content;
    });
    
    // Calculate rows based on actual cell count and header count
    const cellCount = cleanCells.length;
    const headerCount = cleanHeaders.length;
    const rows = Math.floor(cellCount / headerCount);
    
    // Create header row
    const headerRow = cleanHeaders.map(header => 
      `<div class="researchgpt-grid-header">${header}</div>`
    ).join('');
    
    // Create data rows
    const dataRows = Array.from({ length: rows }, (_, rowIndex) => {
      const rowCells = [];
      for (let col = 0; col < headerCount; col++) {
        const cellIndex = rowIndex * headerCount + col;
        if (cellIndex < cellCount) {
          const cellContent = cleanCells[cellIndex];
          
          // Special handling for website column - make it a link if it looks like a URL
          let formattedContent = cellContent;
          if (col === 1 && cellContent && (cellContent.includes('www.') || cellContent.includes('http'))) {
            const url = cellContent.startsWith('http') ? cellContent : `https://${cellContent}`;
            formattedContent = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: none;">${cellContent}</a>`;
          }
          
          rowCells.push(`<div class="researchgpt-grid-cell researchgpt-grid-cell-${col}">${formattedContent}</div>`);
        }
      }
      return `<div class="researchgpt-grid-row researchgpt-grid-row-${rowIndex}">${rowCells.join('')}</div>`;
    }).join('');
    
    // Return cleaned grid structure
    return `
<div class="researchgpt-grid-container">
  <div class="researchgpt-grid-header-row">
    ${headerRow}
  </div>
  <div class="researchgpt-grid-data">
    ${dataRows}
  </div>
</div>`;
  } catch (error) {
    console.error('Error cleaning ResearchGPT grid:', error);
    return gridHtml;
  }
}

/**
 * Convert grid structure to proper HTML table format (like Lightning Mode)
 */
function convertGridToTable(gridHtml: string): string {
  try {
    // Extract headers and cells
    const headers = gridHtml.match(/<div class="grid-header">([^<]*)<\/div>/g) || [];
    const cells = gridHtml.match(/<div class="grid-cell">([\s\S]*?)<\/div>/g) || [];
    
    if (headers.length === 0 || cells.length === 0) return gridHtml;
    
    // Clean headers (remove extra whitespace and markdown)
    const cleanHeaders = headers.map(header => {
      let content = header.replace(/<div class="grid-header">|<\/div>/g, '').trim();
      // Remove markdown formatting
      content = content.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold
      content = content.replace(/\*([^*]+)\*/g, '$1'); // Remove italic
      return content;
    });

    // Filter out unwanted columns completely
    const unwantedColumns = ['verification evidence', 'urgency', 'contact info', 'linkedin', 'source model', 'contact information', 'email', 'phone'];
    
    // Filter headers and get their original indices
    const filteredHeaderData = cleanHeaders.map((header, index) => {
      const lowerHeader = header.toLowerCase().trim();
      const isUnwanted = unwantedColumns.some(unwanted => 
        lowerHeader.includes(unwanted.toLowerCase()) || 
        unwanted.toLowerCase().includes(lowerHeader)
      );
      return { header, index, isUnwanted };
    });

    // Keep only wanted headers
    const wantedHeaders = filteredHeaderData.filter(item => !item.isUnwanted);
    const filteredHeaders = wantedHeaders.map(item => item.header);
    const wantedIndices = wantedHeaders.map(item => item.index);

    console.log('🔍 ResearchGPT: Header filtering', {
      originalHeaders: cleanHeaders,
      unwantedColumns,
      filteredHeaders,
      removedHeaders: filteredHeaderData.filter(item => item.isUnwanted).map(item => item.header)
    });

    // Standard headers for mapping
    const standardHeaders = [
      'Company Name',
      'Website', 
      'Industry',
      'Sub-Industry',
      'Product Line',
      'Use Case',
      'Employees',
      'Revenue',
      'Location',
      'Key Decision Maker',
      'Designation',
      'Pain Points',
      'Approach Strategy'
    ];

    // Map filtered headers to standard headers
    const headerMapping = standardHeaders.map(standardHeader => {
      const foundIndex = filteredHeaders.findIndex(header => 
        header.toLowerCase().includes(standardHeader.toLowerCase()) ||
        standardHeader.toLowerCase().includes(header.toLowerCase())
      );
      return foundIndex >= 0 ? wantedIndices[foundIndex] : -1;
    });

    console.log('🔍 ResearchGPT: Header mapping', {
      originalHeaders: cleanHeaders,
      standardHeaders,
      headerMapping
    });
    
    // Clean cells (remove markdown formatting and extra whitespace)
    const cleanCells = cells.map(cell => {
      let content = cell.replace(/<div class="grid-cell">|<\/div>/g, '').trim();
      // Remove markdown formatting
      content = content.replace(/\*\*([^*]+)\*\*/g, '$1'); // Remove bold
      content = content.replace(/\*([^*]+)\*/g, '$1'); // Remove italic
      content = content.replace(/`([^`]+)`/g, '$1'); // Remove code
      // Clean up extra whitespace and newlines
      content = content.replace(/\s+/g, ' ').trim();
      // Remove any remaining HTML tags that might be in the content
      content = content.replace(/<[^>]*>/g, '');
      return content;
    });
    
    // Use the standard headers (13 columns)
    const finalHeaders = standardHeaders;
    const headerCount = finalHeaders.length;
    
    // Calculate rows based on actual cell count and original header count
    const cellCount = cleanCells.length;
    const originalHeaderCount = cleanHeaders.length;
    const rows = Math.floor(cellCount / originalHeaderCount);
    
    // Filter cells to remove data from unwanted columns
    const filteredCells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < originalHeaderCount; col++) {
        const cellIndex = row * originalHeaderCount + col;
        if (cellIndex < cellCount) {
          // Only include cells from wanted columns
          if (wantedIndices.includes(col)) {
            filteredCells.push(cleanCells[cellIndex]);
          }
        }
      }
    }
    
    console.log('🔍 ResearchGPT: Converting grid to table', {
      originalHeaders: cleanHeaders.length,
      standardHeaders: finalHeaders.length,
      cellCount,
      calculatedRows: rows
    });
    
    let tableHTML = `
    <div class="lightning-mode-table-wrapper">
      <div class="lightning-mode-table-title">ResearchGPT Prospect Analysis</div>
      <div class="sales-opportunities-table-container">
        <table class="sales-opportunities-table">
          <thead>
            <tr>
              ${finalHeaders.map(header => `<th>${header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
             ${Array.from({ length: rows }, (_, rowIndex) => {
               const rowCells = [];
               for (let col = 0; col < finalHeaders.length; col++) {
                 // Use header mapping to find the correct cell content from filtered cells
                 const originalColIndex = headerMapping[col];
                 let cellContent = '';
                 
                 if (originalColIndex >= 0) {
                   // Find the cell in filtered cells array
                   const filteredCellIndex = wantedIndices.indexOf(originalColIndex);
                   if (filteredCellIndex >= 0) {
                     const cellIndex = rowIndex * wantedIndices.length + filteredCellIndex;
                     if (cellIndex < filteredCells.length) {
                       cellContent = filteredCells[cellIndex];
                     }
                   }
                 }
                 
                 // Special handling for website column - make it a link if it looks like a URL
                 let formattedContent = cellContent;
                 if (col === 1 && cellContent && (cellContent.includes('www.') || cellContent.includes('http'))) {
                   const url = cellContent.startsWith('http') ? cellContent : `https://${cellContent}`;
                   formattedContent = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: none;">${cellContent}</a>`;
                 }
                 
                 rowCells.push(`<td>${formattedContent}</td>`);
               }
               return `<tr>${rowCells.join('')}</tr>`;
             }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
    
    return tableHTML;
  } catch (error) {
    console.error('Error converting grid to table:', error);
    return gridHtml;
  }
}

/**
 * Convert individual table to ResearchGPT grid format with headers and data in separate rows
 */
function convertTableToResearchGPTGrid(tableContent: string): string {
  try {
    console.log('🔍 convertTableToResearchGPTGrid Debug:', {
      tableContentLength: tableContent.length,
      tableContentPreview: tableContent.substring(0, 300)
    });
    
    const lines = tableContent.trim().split('\n').filter(line => line.trim());
    console.log('🔍 Table Lines Debug:', {
      linesCount: lines.length,
      firstLine: lines[0],
      secondLine: lines[1],
      thirdLine: lines[2]
    });
    
    if (lines.length < 2) {
      console.log('🔍 Table too short, returning original content');
      return tableContent;
    }
    
    // Parse header row
    const headerLine = lines[0];
    const headers = headerLine.split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);
    
    console.log('🔍 Headers Debug:', {
      headerLine,
      headersCount: headers.length,
      headers: headers
    });
    
    // Skip separator row (second line with ---)
    const dataLines = lines.slice(2);
    
    console.log('🔍 Data Lines Debug:', {
      dataLinesCount: dataLines.length,
      firstDataLine: dataLines[0]
    });
    
    // Create header row
    const headerRow = headers.map(header => 
      `<div class="researchgpt-grid-header">${header}</div>`
    ).join('');
    
    // Create data rows - each row is a separate grid row
    const dataRows = dataLines.map((line, rowIndex) => {
      const cells = line.split('|')
        .map(c => c.trim())
        .filter(c => c.length > 0);
      
      // Ensure we have the right number of cells
      const paddedCells = [...cells];
      while (paddedCells.length < headers.length) {
        paddedCells.push('');
      }
      
      const rowCells = paddedCells.slice(0, headers.length).map((cell, colIndex) => {
        // Special handling for website column - make it a link if it looks like a URL
        let formattedCell = cell;
        if (colIndex === 1 && cell && (cell.includes('www.') || cell.includes('http'))) {
          const url = cell.startsWith('http') ? cell : `https://${cell}`;
          formattedCell = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: none;">${cell}</a>`;
        }
        return `<div class="researchgpt-grid-cell researchgpt-grid-cell-${colIndex}">${formattedCell}</div>`;
      }).join('');
      
      return `<div class="researchgpt-grid-row researchgpt-grid-row-${rowIndex}">${rowCells}</div>`;
    }).join('');
    
    // Wrap in ResearchGPT grid container with separate header and data rows
    return `
<div class="researchgpt-grid-container">
  <div class="researchgpt-grid-header-row">
    ${headerRow}
  </div>
  <div class="researchgpt-grid-data">
    ${dataRows}
  </div>
</div>`;
  } catch (error) {
    console.error('Error converting individual table to ResearchGPT grid:', error);
    return tableContent;
  }
}

/**
 * Convert individual table to grid format (legacy function for backward compatibility)
 */
function convertTableToGrid(tableContent: string): string {
  try {
    const lines = tableContent.trim().split('\n').filter(line => line.trim());
    if (lines.length < 2) return tableContent;
    
    // Parse header row
    const headerLine = lines[0];
    const headers = headerLine.split('|')
      .map(h => h.trim())
      .filter(h => h.length > 0);
    
    // Skip separator row (second line with ---)
    const dataLines = lines.slice(2);
    
    // Create grid headers (these should already be filtered)
    const gridHeaders = headers.map(header => 
      `<div class="grid-header">${header}</div>`
    ).join('');
    
    // Create grid cells for each data row
    const gridRows = dataLines.map(line => {
      const cells = line.split('|')
        .map(c => c.trim())
        .filter(c => c.length > 0);
      
      // Ensure we have the right number of cells
      const paddedCells = [...cells];
      while (paddedCells.length < headers.length) {
        paddedCells.push('');
      }
      
      return paddedCells.slice(0, headers.length).map(cell => 
        `<div class="grid-cell">${cell}</div>`
      ).join('');
    }).join('');
    
    // Wrap in Focus Mode grid container
    return `
<div class="sales-opportunities-grid-container">
  <div class="lead-grid">
    ${gridHeaders}
    ${gridRows}
  </div>
</div>`;
  } catch (error) {
    console.error('Error converting individual table:', error);
    return tableContent;
  }
}

/**
 * Enhanced table structure processing for ResearchGPT
 */
function enhanceTableStructure(tableHtml: string): string {
  try {
    // Parse table structure
    const rows = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    if (rows.length === 0) return tableHtml;

    // Find header row
    const headerIndex = rows.findIndex((r) => /<th\b/i.test(r));
    if (headerIndex === -1) {
      // No header row found, add default headers based on first data row
      return addDefaultHeaders(tableHtml, rows);
    }

    const headerRow = rows[headerIndex];
    const headerCells = headerRow.match(/<th\b[^>]*>[\s\S]*?<\/th>/gi) || [];
    const columnCount = headerCells.length;

    if (columnCount === 0) return tableHtml;

    // Enhanced header processing
    const enhancedHeaders = processHeaders(headerCells);
    
    // Enhanced data row processing
    const enhancedDataRows = processDataRows(rows, columnCount, headerIndex);

    // Build enhanced table structure
    const enhancedTable = buildEnhancedTable(tableHtml, enhancedHeaders, enhancedDataRows);
    
    return enhancedTable;
  } catch (error) {
    console.error('Error enhancing table structure:', error);
    return tableHtml;
  }
}

/**
 * Add default headers when none are present
 */
function addDefaultHeaders(tableHtml: string, rows: string[]): string {
  // Find first data row to determine column count
  const firstDataRow = rows.find(r => /<td\b/i.test(r));
  if (!firstDataRow) return tableHtml;

  const dataCells = firstDataRow.match(/<td\b[^>]*>[\s\S]*?<\/td>/gi) || [];
  const columnCount = dataCells.length;

  // Generate default headers based on common ResearchGPT patterns
  const defaultHeaders = generateDefaultHeaders(columnCount);
  
  // Create header row
  const headerRow = `<tr>${defaultHeaders.map(header => 
    `<th class="researchgpt-header" style="background: #374151; color: #F9FAFB; font-weight: 600; padding: 0.75rem; border: 1px solid #4B5563; text-align: left;">${header}</th>`
  ).join('')}</tr>`;

  // Insert header row at the beginning
  return tableHtml.replace(
    /<table[^>]*>/i,
    (match) => `${match}<thead>${headerRow}</thead><tbody>`
  ).replace(/<\/table>/i, '</tbody></table>');
}

/**
 * Generate default headers based on column count and common patterns
 */
function generateDefaultHeaders(columnCount: number): string[] {
  const commonHeaders = [
    'Company Name', 'Website', 'Industry', 'Sub-Industry', 'Product Line',
    'Use Case', 'Employees', 'Revenue', 'Location', 'Key Decision Maker',
    'Designation', 'Pain Points', 'Approach Strategy', 'Priority',
    'Contact Info', 'LinkedIn', 'Email', 'Phone'
  ];

  // Return appropriate headers based on column count
  if (columnCount <= commonHeaders.length) {
    return commonHeaders.slice(0, columnCount);
  }

  // For more columns, generate generic headers
  return Array.from({ length: columnCount }, (_, i) => {
    if (i < commonHeaders.length) {
      return commonHeaders[i];
    }
    return `Column ${i + 1}`;
  });
}

/**
 * Process and enhance table headers
 */
function processHeaders(headerCells: string[]): string {
  return headerCells.map((cell, index) => {
    // Extract content between <th> tags
    const content = cell.replace(/<th[^>]*>([\s\S]*?)<\/th>/i, "$1").trim();
    
    // Enhanced header styling with better visibility
    return `<th class="researchgpt-header researchgpt-header-${index}" 
             style="
               background: linear-gradient(135deg, #374151 0%, #4B5563 100%);
               color: #F9FAFB;
               font-weight: 700;
               padding: 1rem 0.75rem;
               border: 1px solid #6B7280;
               text-align: left;
               font-size: 0.9rem;
               text-transform: uppercase;
               letter-spacing: 0.5px;
               position: sticky;
               top: 0;
               z-index: 10;
               box-shadow: 0 2px 4px rgba(0,0,0,0.2);
               min-width: 180px;
               max-width: none;
               word-break: break-word;
               white-space: normal;
               line-height: 1.3;
             ">
             ${content}
             </th>`;
  }).join('');
}

/**
 * Process and enhance data rows
 */
function processDataRows(rows: string[], columnCount: number, headerIndex: number): string {
  return rows
    .filter((r, index) => index !== headerIndex && /<td\b/i.test(r))
    .map((row, rowIndex) => {
      const cells = row.match(/<td\b[^>]*>[\s\S]*?<\/td>/gi) || [];
      const processedCells: string[] = [];

      // Ensure each row has the correct number of columns
      for (let i = 0; i < columnCount; i++) {
        const cell = cells[i] || `<td></td>`;
        const content = cell.replace(/<td[^>]*>([\s\S]*?)<\/td>/i, "$1").trim();
        
        // Enhanced cell styling
        const cellClass = `researchgpt-cell researchgpt-cell-${i}`;
              const cellStyle = `
                background: ${rowIndex % 2 === 0 ? '#1F2937' : '#111827'};
                color: #E5E7EB;
                padding: 0.75rem;
                border: 1px solid #374151;
                text-align: left;
                vertical-align: top;
                font-size: 0.85rem;
                line-height: 1.4;
                word-break: break-word;
                white-space: normal;
                min-width: 180px;
                max-width: none;
                overflow-wrap: break-word;
              `;

        processedCells.push(`<td class="${cellClass}" style="${cellStyle}">${content}</td>`);
      }

      return `<tr class="researchgpt-row researchgpt-row-${rowIndex}">${processedCells.join('')}</tr>`;
    })
    .join('');
}

/**
 * Build enhanced table with proper structure
 */
function buildEnhancedTable(originalTable: string, headers: string, dataRows: string): string {
  return originalTable
    .replace(/<table[^>]*>/i, (match) => {
          // Add enhanced table styling
          return `${match} 
            class="researchgpt-table"
            style="
              width: 100%;
              min-width: 1600px;
              max-width: none;
              border-collapse: collapse;
              border: 2px solid #374151;
              border-radius: 8px;
              overflow: visible;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              background: #1F2937;
              display: table;
            "
          `;
    })
    .replace(/<thead[\s\S]*?<\/thead>/i, '')
    .replace(/<tbody[\s\S]*?<\/tbody>/i, '')
    .replace(
      /(<table[^>]*>)[\s\S]*?(<\/table>)/i,
      `$1<thead><tr>${headers}</tr></thead><tbody>${dataRows}</tbody>$2`
    );
}

/**
 * Enhanced download functionality for ResearchGPT tables
 */
async function handleResearchGPTDownload(element: HTMLElement, originalMarkdown: string) {
  try {
    // Extract title from markdown
    let title = 'ResearchGPT Analysis Results';
    const headingMatch = originalMarkdown.match(/^#\s*🔍\s*([^\n]+)/m);
    if (headingMatch && headingMatch[1]) {
      title = headingMatch[1].trim();
    }

    // Create enhanced PDF with ResearchGPT branding
    const { jsPDF } = await import('jspdf');
    const { toPng } = await import('html-to-image');
    const { getDefaultLogoDataUrl } = await import('@/app/lib/leadTableExporter');

    // Clean the content to remove unwanted headings and metadata
    const cleanedElement = cleanContentForPdf(element);

    // Create temporary element with enhanced styling (matching Lightning Mode approach)
    const tempElement = document.createElement('div');
    tempElement.innerHTML = cleanedElement.innerHTML;
    tempElement.style.padding = '20px';
    tempElement.style.background = '#ffffff';
    tempElement.style.color = '#000000';
    tempElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif';
    tempElement.style.width = '1000px';
    tempElement.style.position = 'fixed';
    tempElement.style.top = '0';
    tempElement.style.left = '-9999px';
    tempElement.style.zIndex = '-1000';
    tempElement.style.lineHeight = '1.6';

    // Apply comprehensive styling for PDF generation (matching Lightning Mode)
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
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        border: 1px solid #dee2e6;
        font-size: 0.85rem;
      }
      th {
        background: #f8f9fa !important;
        padding: 0.5rem 0.25rem;
        text-align: left;
        border: 1px solid #dee2e6;
        font-weight: 600;
        color: #000000 !important;
        font-size: 0.8rem;
      }
      td {
        border: 1px solid #dee2e6;
        padding: 0.5rem 0.4rem;
        text-align: left;
        color: #000000 !important;
        background: #ffffff !important;
        font-size: 0.75rem;
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
    
    document.head.appendChild(styleElement);
    document.body.appendChild(tempElement);

    // Convert to image with better quality settings
    const dataUrl = await toPng(tempElement, {
      quality: 1.0,
      width: 1000,
      height: tempElement.offsetHeight,
      pixelRatio: 2,
      canvasWidth: 2000,
      skipFonts: false,
      cacheBust: true,
      backgroundColor: '#ffffff'
    });

    // Clean up temporary elements
    document.body.removeChild(tempElement);
    document.head.removeChild(styleElement);

    // Create PDF document (A4 landscape for tables)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Calculate dimensions for the image in the PDF (A4 landscape = 297mm × 210mm)
    const pdfWidth = 297;
    const pdfHeight = 210;
    const imgWidth = pdfWidth - 20; // Add margins
    
    // Load the image
    const img = new Image();
    img.src = dataUrl;
    
    await new Promise<void>((resolve) => {
      img.onload = () => {
        // Calculate height proportionally to width
        const aspectRatio = img.height / img.width;
        const imgHeight = imgWidth * aspectRatio;
        
        // Add header with logo (matching Lightning Mode approach)
        pdf.setFillColor(26, 26, 26); // Dark background matching display (#1a1a1a)
        pdf.rect(0, 0, pdfWidth, 15, 'F');
        
        // Add title with white text
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(255, 255, 255); // White text
        pdf.text(title, 42, 10);

        // Try add logo on header left (using cache system like Lightning Mode)
        try {
          const anyWindow = window as any;
          if (!anyWindow.__scLogoCache) {
            getDefaultLogoDataUrl().then((d) => { anyWindow.__scLogoCache = d; });
          }
          if (anyWindow.__scLogoCache) {
            try { pdf.addImage(anyWindow.__scLogoCache, 'PNG', 10, 4, 24, 9); } catch {}
          }
        } catch {}
        
        // Add content image
        pdf.addImage(dataUrl, 'PNG', 10, 20, imgWidth, imgHeight);
        
        // Add footer with page number and dark theme
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(204, 204, 204); // Light gray text (#cccccc)
        pdf.text('Page 1', pdfWidth / 2, pdfHeight - 5, { align: 'center' });
        
        // Add timestamp in footer
        const timestamp = new Date().toLocaleString();
        pdf.text(`Generated on: ${timestamp}`, pdfWidth - 10, pdfHeight - 5, { align: 'right' });
        
        resolve();
      };
    });

    // Save PDF
    const fileName = title.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '_researchgpt.pdf';
    pdf.save(fileName);

  } catch (error) {
    console.error('Error downloading ResearchGPT results:', error);
    alert('Failed to download results. Please try again.');
  }
}

/**
 * Clean content for PDF generation by removing unwanted headings and metadata
 */
function cleanContentForPdf(element: HTMLElement): HTMLElement {
  const cleanedElement = element.cloneNode(true) as HTMLElement;
  
  // More aggressive cleaning - remove all elements containing unwanted text
  const unwantedPatterns = [
    /Generated:\s*\d{1,2}\/\d{1,2}\/\d{4}/,
    /Query:\s*/,
    /Response:\s*/,
    /Configuration:\s*/,
    /market_analysis/,
    /basic - Global/,
    /comprehensive - Global/,
    /Status:\s*Starting research/,
    /Please wait while I analyze/
  ];
  
  // Remove elements by text content (more comprehensive approach)
  const allElements = Array.from(cleanedElement.querySelectorAll('*'));
  allElements.forEach(el => {
    const text = el.textContent || '';
    
    // Check if element contains any unwanted patterns
    const containsUnwanted = unwantedPatterns.some(pattern => pattern.test(text));
    
    // Also check for specific unwanted text fragments
    const hasUnwantedText = text.includes('Generated:') || 
                           text.includes('Query:') || 
                           text.includes('Configuration:') || 
                           text.includes('Response:') ||
                           text.includes('ResearchGPT Analysis') ||
                           text.includes('market_analysis') ||
                           text.includes('basic - Global') ||
                           text.includes('comprehensive - Global') ||
                           text.includes('Status: Starting research') ||
                           text.includes('Please wait while I analyze');
    
    if (containsUnwanted || hasUnwantedText) {
      // If it's a direct text element (p, div, span), remove it
      if (['P', 'DIV', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
        el.remove();
      } else {
        // If it's a container, try to clean its content instead
        el.innerHTML = el.innerHTML.replace(/Generated:.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/Query:.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/Configuration:.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/Response:.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/ResearchGPT Analysis.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/market_analysis.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/basic - Global.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/comprehensive - Global.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/Status: Starting research.*?\n/g, '');
        el.innerHTML = el.innerHTML.replace(/Please wait while I analyze.*?\n/g, '');
      }
    }
  });
  
  // Remove empty paragraphs, divs, and other elements
  const emptyElements = cleanedElement.querySelectorAll('p:empty, div:empty, span:empty, h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty');
  emptyElements.forEach(el => el.remove());
  
  // Remove horizontal rules that might be separators
  const hrElements = cleanedElement.querySelectorAll('hr');
  hrElements.forEach(el => el.remove());
  
  // Clean up any remaining unwanted text in the main content
  const mainContent = cleanedElement.innerHTML;
  const cleanedContent = mainContent
    .replace(/Generated:\s*\d{1,2}\/\d{1,2}\/\d{4}[^<]*/g, '')
    .replace(/Query:[^<]*/g, '')
    .replace(/Configuration:[^<]*/g, '')
    .replace(/Response:[^<]*/g, '')
    .replace(/ResearchGPT Analysis[^<]*/g, '')
    .replace(/market_analysis[^<]*/g, '')
    .replace(/basic - Global[^<]*/g, '')
    .replace(/comprehensive - Global[^<]*/g, '')
    .replace(/Status: Starting research[^<]*/g, '')
    .replace(/Please wait while I analyze[^<]*/g, '')
    .replace(/<hr[^>]*>/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<div>\s*<\/div>/g, '');
  
  cleanedElement.innerHTML = cleanedContent;
  
  return cleanedElement;
}

ResearchGPTTableRenderer.displayName = 'ResearchGPTTableRenderer';

export default ResearchGPTTableRenderer;
