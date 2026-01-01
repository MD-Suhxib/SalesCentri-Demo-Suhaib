/**
 * Improved PDF Export Utility using jsPDF
 * 
 * This module provides enhanced PDF export functionality for research bot conversations
 * with better error handling and browser compatibility.
 */

'use client';

import { jsPDF } from 'jspdf';
import { getDefaultLogoDataUrl } from '@/app/lib/leadTableExporter';

// Define types for better TypeScript support
export interface ChatMessage {
  role: string;
  message: string;
  timestamp?: string;
}

export interface PdfExportOptions {
  fileName?: string;
  pageWidth?: number;
  pageHeight?: number;
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  fontSize?: {
    title: number;
    role: number;
    message: number;
  };
  colors?: {
    title: string;
    user: string;
    bot: string;
    text: string;
  };
  lineHeight?: number;
}

// Default configuration
const DEFAULT_OPTIONS: Required<PdfExportOptions> = {
  fileName: 'research_conversation.pdf',
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  fontSize: {
    title: 16,
    role: 12,
    message: 10
  },
  colors: {
    title: '#2d3748',
    user: '#0070f3',
    bot: '#00b894',
    text: '#4a5568'
  },
  lineHeight: 1.4
};

/**
 * Enhanced text splitting function that handles word wrapping more reliably
 */
function splitTextToLines(doc: jsPDF, text: string, maxWidth: number, fontSize: number): string[] {
  try {
    // Set the font size for accurate text width calculation
    doc.setFontSize(fontSize);
    
    // Handle empty text
    if (!text || text.trim() === '') {
      return [''];
    }
    
    // Use jsPDF's built-in splitTextToSize method which is more reliable
    const splitText = doc.splitTextToSize(text, maxWidth);
    
    // Ensure we return an array
    if (Array.isArray(splitText)) {
      return splitText;
    } else {
      return [splitText];
    }
  } catch (error) {
    console.error('Error splitting text to lines:', error);
    // Fallback to simple line splitting
    return text.split('\n');
  }
}

/**
 * Convert hex color to RGB values for jsPDF
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ];
  }
  return [0, 0, 0]; // Default to black
}

/**
 * Add a professional header to the PDF
 */
function addHeader(doc: jsPDF, options: Required<PdfExportOptions>, logoDataUrl?: string): number {
  try {
    const [r, g, b] = hexToRgb(options.colors.title);
    
    // Set title styling
    doc.setFontSize(options.fontSize.title);
    doc.setTextColor(r, g, b);
    doc.setFont('helvetica', 'bold');
    
    // Optional logo centered above title
    let headerExtra = 0;
    if (logoDataUrl) {
      try {
        const logoWidth = 32;
        const logoHeight = 12;
        const x = options.margin.left;
        const y = options.margin.top - 2;
        doc.addImage(logoDataUrl, 'PNG', x, y - logoHeight, logoWidth, logoHeight);
        headerExtra = logoHeight - 4;
      } catch {}
    }

    // Add Sales Centri branding with centered logo (matching lead export style)
    let y = options.margin.top;
    const pageW = options.pageWidth;
    
    // Center the logo at the top
    if (logoDataUrl) {
      try {
        const logoWidth = 70;
        const logoHeight = 28;
        const logoX = (pageW - logoWidth) / 2; // center horizontally
        doc.addImage(logoDataUrl, 'PNG', logoX, y, logoWidth, logoHeight);
        y += logoHeight + 10; // space after logo
      } catch {}
    }
    
    // Center the title below the logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const title = 'Research Bot Conversation';
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageW - titleWidth) / 2; // center horizontally
    doc.text(title, titleX, y);
    
    // Add date below title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    y += 5;
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const dateText = `Generated on: ${currentDate}`;
    const dateWidth = doc.getTextWidth(dateText);
    const dateX = (pageW - dateWidth) / 2; // center date
    doc.text(dateText, dateX, y);
    
    y += 10; // space before content
    
    return y - options.margin.top + 10; // Return actual header height
  } catch (error) {
    console.error('Error adding header:', error);
    return 20; // Return default header height
  }
}

/**
 * Add page footer
 */
function addFooter(doc: jsPDF, pageNumber: number, options: Required<PdfExportOptions>): void {
  try {
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    
    const footerText = `Page ${pageNumber}`;
    const textWidth = doc.getTextWidth(footerText);
    const x = (options.pageWidth - textWidth) / 2;
    const y = options.pageHeight - options.margin.bottom + 5;
    
    doc.text(footerText, x, y);
  } catch (error) {
    console.error('Error adding footer:', error);
  }
}

/**
 * Enhanced PDF export function with better error handling
 */
export function exportResearchToPdf(
  messages: ChatMessage[],
  options: Partial<PdfExportOptions> = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Merge options with defaults
      const opts: Required<PdfExportOptions> = {
        ...DEFAULT_OPTIONS,
        ...options,
        margin: { ...DEFAULT_OPTIONS.margin, ...(options.margin || {}) },
        fontSize: { ...DEFAULT_OPTIONS.fontSize, ...(options.fontSize || {}) },
        colors: { ...DEFAULT_OPTIONS.colors, ...(options.colors || {}) }
      };
      
      // Validate input
      if (!messages || messages.length === 0) {
        throw new Error('No messages to export');
      }
      
      // Create PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      let currentY = opts.margin.top;
      let pageNumber = 1;
      const maxWidth = opts.pageWidth - opts.margin.left - opts.margin.right;
      const maxHeight = opts.pageHeight - opts.margin.top - opts.margin.bottom;

      // Load logo and add header
      getDefaultLogoDataUrl().then((logoDataUrl) => {
        const headerHeight = addHeader(doc, opts, logoDataUrl);
        currentY += headerHeight;
      
        // Process each message
        messages.forEach((msg, index) => {
        try {
          // Determine role color
          const isUser = msg.role.toLowerCase().includes('user');
          const colorHex = isUser ? opts.colors.user : opts.colors.bot;
          const [r, g, b] = hexToRgb(colorHex);
          
          // Format role text
          const roleText = `${msg.role}:`;
          const timestamp = msg.timestamp ? ` (${msg.timestamp})` : '';
          const fullRoleText = roleText + timestamp;
          
          // Calculate role text height
          const roleHeight = opts.fontSize.role * opts.lineHeight;
          
          // Check if we need a new page for the role
          if (currentY + roleHeight > opts.margin.top + maxHeight) {
            addFooter(doc, pageNumber, opts);
            doc.addPage();
            pageNumber++;
            currentY = opts.margin.top + addHeader(doc, opts, logoDataUrl);
          }
          
          // Add role text
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(opts.fontSize.role);
          doc.setTextColor(r, g, b);
          doc.text(fullRoleText, opts.margin.left, currentY);
          currentY += roleHeight;
          
          // Process message content
          const messageLines = splitTextToLines(doc, msg.message, maxWidth - 5, opts.fontSize.message);
          const messageLineHeight = opts.fontSize.message * opts.lineHeight;
          
          // Add each line of the message
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(opts.fontSize.message);
          const [textR, textG, textB] = hexToRgb(opts.colors.text);
          doc.setTextColor(textR, textG, textB);
          
          messageLines.forEach((line) => {
            // Check if we need a new page
            if (currentY + messageLineHeight > opts.margin.top + maxHeight) {
              addFooter(doc, pageNumber, opts);
              doc.addPage();
              pageNumber++;
              currentY = opts.margin.top + addHeader(doc, opts, logoDataUrl);
            }
            
            // Add the line (handle empty lines)
            if (line.trim() === '') {
              currentY += messageLineHeight * 0.5;
            } else {
              // Ensure we have valid coordinates and text
              const x = opts.margin.left + 5;
              const y = currentY;
              
              try {
                doc.text(line, x, y);
              } catch (textError) {
                console.error('Error adding text to PDF:', textError);
                // Fallback: try with simplified text
                doc.text(String(line).substring(0, 100), x, y);
              }
              currentY += messageLineHeight;
            }
          });
          
          // Add spacing between messages
          if (index < messages.length - 1) {
            currentY += messageLineHeight * 0.8;
          }
        } catch (messageError) {
          console.error(`Error processing message ${index}:`, messageError);
        }
        });

        // Add final footer
        addFooter(doc, pageNumber, opts);
        
        // Save the PDF
        doc.save(opts.fileName);
        
        console.log(`PDF exported successfully as ${opts.fileName}`);
        resolve();
      }).catch((e) => {
        console.warn('Logo load failed, continuing without logo', e);
        const headerHeight = addHeader(doc, opts);
        currentY += headerHeight;
        // Fallback: no content if logo fails? Proceed similarly would require duplicating logic; simplest retry recursion
        // For simplicity, re-run without logo by calling exportResearchToPdf again not ideal. Instead, just resolve as failure.
        // But to keep output, we can proceed without logo by re-running minimal rendering:
        messages.forEach((msg, index) => {
          try {
            const isUser = msg.role.toLowerCase().includes('user');
            const colorHex = isUser ? opts.colors.user : opts.colors.bot;
            const [r, g, b] = hexToRgb(colorHex);
            const roleText = `${msg.role}:`;
            const timestamp = msg.timestamp ? ` (${msg.timestamp})` : '';
            const fullRoleText = roleText + timestamp;
            const roleHeight = opts.fontSize.role * opts.lineHeight;
            if (currentY + roleHeight > opts.margin.top + maxHeight) {
              addFooter(doc, pageNumber, opts);
              doc.addPage();
              pageNumber++;
              currentY = opts.margin.top + addHeader(doc, opts);
            }
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(opts.fontSize.role);
            doc.setTextColor(r, g, b);
            doc.text(fullRoleText, opts.margin.left, currentY);
            currentY += roleHeight;
            const messageLines = splitTextToLines(doc, msg.message, maxWidth - 5, opts.fontSize.message);
            const messageLineHeight = opts.fontSize.message * opts.lineHeight;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(opts.fontSize.message);
            const [textR, textG, textB] = hexToRgb(opts.colors.text);
            doc.setTextColor(textR, textG, textB);
            messageLines.forEach((line) => {
              if (currentY + messageLineHeight > opts.margin.top + maxHeight) {
                addFooter(doc, pageNumber, opts);
                doc.addPage();
                pageNumber++;
                currentY = opts.margin.top + addHeader(doc, opts);
              }
              if (line.trim() === '') {
                currentY += messageLineHeight * 0.5;
              } else {
                const x = opts.margin.left + 5;
                const y = currentY;
                try { doc.text(line, x, y); } catch { doc.text(String(line).substring(0, 100), x, y); }
                currentY += messageLineHeight;
              }
            });
            if (index < messages.length - 1) currentY += messageLineHeight * 0.8;
          } catch {}
        });
        addFooter(doc, pageNumber, opts);
        doc.save(opts.fileName);
        resolve();
      });
      
    } catch (error) {
      console.error('PDF export failed:', error);
      reject(new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

/**
 * Convenience function for research bot conversations
 */
export function exportResearchBotToPdf(
  userQuery: string,
  botResponse: string,
  fileName: string = 'Sales_Centri_research_conversation.pdf'
): Promise<void> {
  const messages: ChatMessage[] = [
    {
      role: 'User',
      message: userQuery,
      timestamp: new Date().toLocaleTimeString()
    },
    {
      role: 'Research Bot',
      message: botResponse,
      timestamp: new Date().toLocaleTimeString()
    }
  ];
  
  return exportResearchToPdf(messages, {
    fileName,
    colors: {
      title: '#2d3748',
      user: '#0070f3',
      bot: '#00b894',
      text: '#4a5568'
    }
  });
}

/**
 * Export multiple conversations to a single PDF
 */
export function exportMultipleConversationsToPdf(
  conversations: Array<{
    userQuery: string;
    botResponse: string;
    timestamp?: string;
  }>,
  fileName: string = 'Sales_Centri_research_conversations.pdf'
): Promise<void> {
  const allMessages: ChatMessage[] = [];
  
  conversations.forEach((conv, index) => {
    allMessages.push({
      role: 'User',
      message: conv.userQuery,
      timestamp: conv.timestamp || new Date().toLocaleTimeString()
    });
    
    allMessages.push({
      role: 'Research Bot',
      message: conv.botResponse,
      timestamp: conv.timestamp || new Date().toLocaleTimeString()
    });
    
    // Add separator between conversations (except for the last one)
    if (index < conversations.length - 1) {
      allMessages.push({
        role: 'System',
        message: '--- End of Conversation ---\n\n'
      });
    }
  });
  
  return exportResearchToPdf(allMessages, { fileName });
}
