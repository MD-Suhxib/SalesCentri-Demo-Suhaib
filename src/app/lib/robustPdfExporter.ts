/**
 * Robust PDF Export Utility
 * 
 * This is a simplified, more reliable PDF export that ensures text appears correctly
 */

'use client';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getDefaultLogoDataUrl } from './leadTableExporter';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

export interface ChatMessage {
  role: string;
  message: string;
  timestamp?: string;
}

export interface PdfOptions {
  fileName?: string;
  title?: string;
}

/**
 * Parse markdown tables from text - Improved version
 */
function parseMarkdownTables(text: string): { tables: any[], textSegments: string[] } {
  const tables: any[] = [];
  const textSegments: string[] = [];
  
  // Split text by lines
  const allLines = text.split(/\r?\n/);
  let i = 0;
  let currentTextSegment = '';
  
  while (i < allLines.length) {
    const line = allLines[i];
    
    // Check if this line starts a table (has pipes and content)
    if (line.trim().startsWith('|') && line.trim().endsWith('|') && line.includes('|')) {
      // Found potential table start
      const tableStartIndex = i;
      const headerLine = line;
      
      // Check if next line is separator (|---|---|)
      if (i + 1 < allLines.length) {
        const separatorLine = allLines[i + 1];
        const isSeparator = separatorLine.trim().startsWith('|') && 
                           separatorLine.includes('-') && 
                           separatorLine.trim().endsWith('|');
        
        if (isSeparator) {
          // Valid table found! Parse headers
          const headers = headerLine
            .split('|')
            .map(h => h.trim())
            .filter(h => h.length > 0);
          
          // Parse rows until we hit a non-table line
          const rows: string[][] = [];
          i += 2; // Skip header and separator
          
          while (i < allLines.length && 
                 allLines[i].trim().startsWith('|') && 
                 allLines[i].trim().endsWith('|')) {
            const rowData = allLines[i]
              .split('|')
              .map(cell => cell.trim())
              .filter(cell => cell.length > 0);
            
            if (rowData.length > 0) {
              rows.push(rowData);
            }
            i++;
          }
          
          // Save the text segment before this table
          if (currentTextSegment.trim()) {
            textSegments.push(currentTextSegment.trim());
          }
          currentTextSegment = '';
          
          // Save the table
          tables.push({ headers, rows });
          textSegments.push(''); // Placeholder for table position
          
          continue; // Skip the i++ at the end
        }
      }
    }
    
    // Not a table line, add to current text segment
    currentTextSegment += allLines[i] + '\n';
    i++;
  }
  
  // Add any remaining text
  if (currentTextSegment.trim()) {
    textSegments.push(currentTextSegment.trim());
  }
  
  console.log(`Parsed ${tables.length} tables from markdown`);
  tables.forEach((table, idx) => {
    console.log(`Table ${idx + 1}: ${table.headers.length} columns, ${table.rows.length} rows`);
  });
  
  return { tables, textSegments };
}

/**
 * Clean text from markdown and special characters
 */
function cleanMarkdownText(text: string): string {
  return text
    // Remove emojis and special unicode characters (keep only basic ASCII and common chars)
    .replace(/[^\x20-\x7E\n\r\t]/g, '')
    // Remove bold markers
    .replace(/\*\*/g, '')
    // Remove italic markers  
    .replace(/\*/g, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Render markdown text with proper formatting
 */
function renderMarkdownText(doc: jsPDF, text: string, startX: number, startY: number, maxWidth: number): number {
  let currentY = startY;
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      currentY += 3; // Empty line spacing
      continue;
    }
    
    // Detect header level and clean text
    let headerLevel = 0;
    let cleanedText = trimmedLine;
    
    if (trimmedLine.startsWith('###')) {
      headerLevel = 3;
      cleanedText = trimmedLine.substring(3).trim();
    } else if (trimmedLine.startsWith('##')) {
      headerLevel = 2;
      cleanedText = trimmedLine.substring(2).trim();
    } else if (trimmedLine.startsWith('#')) {
      headerLevel = 1;
      cleanedText = trimmedLine.substring(1).trim();
    }
    
    // Clean the text
    cleanedText = cleanMarkdownText(cleanedText);
    
    if (!cleanedText) continue; // Skip if nothing left after cleaning
    
    // Render based on header level
    if (headerLevel > 0) {
      // Headers are always bold
      doc.setFont('helvetica', 'bold');
      
      switch (headerLevel) {
        case 1:
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          break;
        case 2:
          doc.setFontSize(12);
          doc.setTextColor(40, 40, 40);
          break;
        case 3:
          doc.setFontSize(11);
          doc.setTextColor(60, 60, 60);
          break;
      }
      
      const headerLines = doc.splitTextToSize(cleanedText, maxWidth);
      doc.text(headerLines, startX, currentY);
      currentY += headerLines.length * (6 - headerLevel) + 4;
    } else {
      // Regular text - check if it was bold in original
      const wasBold = trimmedLine.includes('**');
      
      doc.setFont('helvetica', wasBold ? 'bold' : 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const textLines = doc.splitTextToSize(cleanedText, maxWidth);
      doc.text(textLines, startX, currentY);
      currentY += textLines.length * 5;
    }
    
    // Check if we need a new page
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
  }
  
  return currentY + 5; // Add spacing after text block
}

/**
 * Render markdown table using autoTable
 */
function renderTable(doc: jsPDF, headers: string[], rows: string[][], startY: number): number {
  // Validate table data
  if (!headers || headers.length === 0) {
    console.warn('No headers provided for table, skipping');
    return startY;
  }
  
  if (!rows || rows.length === 0) {
    console.warn('No rows provided for table, skipping');
    return startY;
  }
  
  console.log(`Rendering table: ${headers.length} columns × ${rows.length} rows at Y=${startY}`);
  
  try {
    // Use autoTable as imported function
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: startY,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak',
        cellWidth: 'wrap',
        minCellHeight: 6,
        halign: 'left',
        valign: 'top'
      },
      headStyles: {
        fillColor: [66, 153, 225],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
        fontSize: 7
      },
      columnStyles: {
        // Equal column widths for all columns
        ...Object.fromEntries(
          headers.map((_, i) => [i, { cellWidth: 170 / headers.length }])
        )
      },
      margin: { left: 20, right: 20 },
      tableWidth: 'auto'
    });
    
    const finalY = (doc.lastAutoTable?.finalY || startY) + 10;
    console.log(`Table rendered successfully, finalY=${finalY}`);
    return finalY;
  } catch (error) {
    console.error('Error rendering table:', error);
    return startY;
  }
}

/**
 * Simple, reliable PDF export function
 */
export async function exportToPdf(
  userQuery: string,
  botResponse: string,
  options: PdfOptions = {}
): Promise<void> {
  try {
    const { fileName = 'Sales_Centri_research_export.pdf', title = 'Research Analysis' } = options;
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Set up basic styling
    doc.setFont('helvetica');

    // Add Sales Centri branding with centered logo (matching lead export style)
    let y = 20;
    const pageW = doc.internal.pageSize.getWidth();
    
    // Center the logo at the top
    try {
      const logoDataUrl = await getDefaultLogoDataUrl();
      if (logoDataUrl) {
        const logoWidth = 70;
        const logoHeight = 28;
        const logoX = (pageW - logoWidth) / 2; // center horizontally
        doc.addImage(logoDataUrl, 'PNG', logoX, y, logoWidth, logoHeight);
        y += logoHeight + 10; // space after logo
      }
    } catch {}
    
    // Center the title below the logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageW - titleWidth) / 2; // center horizontally
    doc.text(title, titleX, y);
    
    // Add timestamp below title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    y += 5;
    const timestamp = `Generated: ${new Date().toLocaleString()}`;
    const timestampWidth = doc.getTextWidth(timestamp);
    const timestampX = (pageW - timestampWidth) / 2; // center timestamp
    doc.text(timestamp, timestampX, y);
    
    y += 10; // space before content
    
    let currentY = y + 10; // Start content after branding
    
    // Add user query
    doc.setFontSize(12);
    doc.setTextColor(0, 70, 243); // Blue for user
    doc.text('Query:', 20, currentY);
    currentY += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Split query text to fit page width
    const queryLines = doc.splitTextToSize(userQuery, 170);
    doc.text(queryLines, 20, currentY);
    currentY += (queryLines.length * 5) + 10;
    
    // Add response
    doc.setFontSize(12);
    doc.setTextColor(0, 184, 148); // Green for bot
    doc.text('Response:', 20, currentY);
    currentY += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    // Parse markdown tables from response
    const { tables, textSegments } = parseMarkdownTables(botResponse);
    
    let tableIndex = 0;
    
    // Render text segments and tables
    for (let segIdx = 0; segIdx < textSegments.length; segIdx++) {
      const segment = textSegments[segIdx];
      
      // If segment is empty, it means there's a table here
      if (segment === '' && tableIndex < tables.length) {
        // Check if we need a new page for the table
        if (currentY > 220) {
          doc.addPage();
          currentY = 20;
        }
        
        // Render table
        const table = tables[tableIndex];
        currentY = renderTable(doc, table.headers, table.rows, currentY);
        tableIndex++;
      } else if (segment.trim()) {
        // Render text with markdown formatting
        currentY = renderMarkdownText(doc, segment, 20, currentY, 170);
      }
    }
    
    // Save the PDF
    doc.save(fileName);
    
    console.log(`✅ PDF exported successfully: ${fileName}`);
  } catch (error) {
    console.error('❌ PDF export failed:', error);
    throw new Error(`Failed to export PDF: ${error.message}`);
  }
}

/**
 * Export multiple conversations to PDF
 */
export async function exportMultipleConversationsToPdf(
  conversations: Array<{
    userQuery: string;
    botResponse: string;
    timestamp?: string;
  }>,
  fileName: string = 'Sales_Centri_multiple_conversations.pdf'
): Promise<void> {
  try {
    const doc = new jsPDF();
    
    // Add Sales Centri branding with centered logo (matching lead export style)
    let y = 20;
    const pageW = doc.internal.pageSize.getWidth();
    
    // Center the logo at the top
    try {
      const logoDataUrl = await getDefaultLogoDataUrl();
      if (logoDataUrl) {
        const logoWidth = 70;
        const logoHeight = 28;
        const logoX = (pageW - logoWidth) / 2; // center horizontally
        doc.addImage(logoDataUrl, 'PNG', logoX, y, logoWidth, logoHeight);
        y += logoHeight + 10; // space after logo
      }
    } catch {}
    
    // Center the title below the logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const title = 'Research Conversations';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageW - titleWidth) / 2; // center horizontally
    doc.text(title, titleX, y);
    
    // Add timestamp below title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    y += 5;
    const timestamp = `Generated: ${new Date().toLocaleString()}`;
    const timestampWidth = doc.getTextWidth(timestamp);
    const timestampX = (pageW - timestampWidth) / 2; // center timestamp
    doc.text(timestamp, timestampX, y);
    
    y += 10; // space before content
    
    let currentY = y + 10; // Start content after branding
    
    conversations.forEach((conv, index) => {
      // Add conversation header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Conversation ${index + 1}`, 20, currentY);
      currentY += 10;
      
      if (conv.timestamp) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(conv.timestamp, 20, currentY);
        currentY += 8;
      }
      
      // Add query
      doc.setFontSize(10);
      doc.setTextColor(0, 70, 243);
      doc.text('Query:', 20, currentY);
      currentY += 6;
      
      doc.setTextColor(0, 0, 0);
      const queryLines = doc.splitTextToSize(conv.userQuery, 170);
      doc.text(queryLines, 20, currentY);
      currentY += (queryLines.length * 5) + 5;
      
      // Add response
      doc.setTextColor(0, 184, 148);
      doc.text('Response:', 20, currentY);
      currentY += 6;
      
      doc.setTextColor(0, 0, 0);
      
      // Parse markdown tables from response
      const { tables, textSegments } = parseMarkdownTables(conv.botResponse);
      let tableIndex = 0;
      
      // Render text segments and tables
      for (let segIdx = 0; segIdx < textSegments.length; segIdx++) {
        const segment = textSegments[segIdx];
        
        // If segment is empty, it means there's a table here
        if (segment === '' && tableIndex < tables.length) {
          // Check if we need a new page for the table
          if (currentY > 220) {
            doc.addPage();
            currentY = 20;
          }
          
          // Render table
          const table = tables[tableIndex];
          currentY = renderTable(doc, table.headers, table.rows, currentY);
          tableIndex++;
        } else if (segment.trim()) {
          // Render text with markdown formatting
          currentY = renderMarkdownText(doc, segment, 20, currentY, 170);
        }
      }
      
      // Add spacing between conversations
      currentY += 10;
      
      // Add separator line if not the last conversation
      if (index < conversations.length - 1) {
        if (currentY > 265) {
          doc.addPage();
          currentY = 20;
        }
        doc.line(20, currentY, 190, currentY);
        currentY += 10;
      }
    });
    
    doc.save(fileName);
    console.log(`✅ Multiple conversations exported: ${fileName}`);
  } catch (error) {
    console.error('❌ Multiple conversations export failed:', error);
    throw new Error(`Failed to export multiple conversations: ${error.message}`);
  }
}

/**
 * Simple wrapper for research bot export
 */
export async function exportResearchToPdf(
  userQuery: string,
  botResponse: string,
  fileName: string = 'Sales_Centri_research.pdf'
): Promise<void> {
  await exportToPdf(userQuery, botResponse, { 
    fileName, 
    title: 'Research Analysis Report' 
  });
}
