/**
 * Chat PDF Exporter Utility
 * 
 * This utility provides functions to export chat conversations to PDF format
 * using the jsPDF library with proper text wrapping and pagination.
 */

import jsPDF from 'jspdf';
import { getDefaultLogoDataUrl } from '@/app/lib/leadTableExporter';

export interface ChatMessage {
  role: 'User' | 'Bot' | 'Assistant' | 'System';
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
    role: number;
    message: number;
  };
  colors?: {
    user: string;
    bot: string;
    text: string;
  };
  lineHeight?: number;
}

const DEFAULT_OPTIONS: Required<PdfExportOptions> = {
  fileName: 'chat_output.pdf',
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  margin: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  },
  fontSize: {
    role: 12,
    message: 10
  },
  colors: {
    user: '#0070f3',
    bot: '#00b894',
    text: '#000000'
  },
  lineHeight: 1.4
};

/**
 * Splits text into lines that fit within the specified width
 */
function splitTextToLines(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  fontSize: number
): string[] {
  doc.setFontSize(fontSize);
  
  // Handle empty text
  if (!text || text.trim() === '') {
    return [''];
  }
  
  // Split by existing line breaks first
  const paragraphs = text.split('\n');
  const lines: string[] = [];
  
  paragraphs.forEach((paragraph, paragraphIndex) => {
    if (paragraph.trim() === '') {
      // Preserve empty lines between paragraphs
      if (paragraphIndex > 0) {
        lines.push('');
      }
      return;
    }
    
    // Use jsPDF's built-in text splitting
    const wrappedLines = doc.splitTextToSize(paragraph, maxWidth);
    lines.push(...wrappedLines);
    
    // Add space between paragraphs (except for the last one)
    if (paragraphIndex < paragraphs.length - 1) {
      lines.push('');
    }
  });
  
  return lines;
}

/**
 * Adds a header to the PDF
 */
function addHeader(doc: jsPDF, options: Required<PdfExportOptions>, logoDataUrl?: string): number {
  const headerHeight = 15;
  
  // Set header styling
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  
  // Optional logo
  if (logoDataUrl) {
    try { doc.addImage(logoDataUrl, 'PNG', options.margin.left, options.margin.top - 10, 28, 10); } catch {}
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
}

/**
 * Adds a footer to the PDF
 */
function addFooter(doc: jsPDF, pageNumber: number, options: Required<PdfExportOptions>) {
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  
  const footerText = `Page ${pageNumber}`;
  const textWidth = doc.getTextWidth(footerText);
  const x = (options.pageWidth - textWidth) / 2;
  const y = options.pageHeight - options.margin.bottom + 5;
  
  doc.text(footerText, x, y);
}

/**
 * Exports chat messages to PDF format
 */
export function exportChatToPdf(
  messages: ChatMessage[],
  options: Partial<PdfExportOptions> = {}
): void {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  // Merge margin options properly
  if (options.margin) {
    opts.margin = { ...DEFAULT_OPTIONS.margin, ...options.margin };
  }
  
  // Merge fontSize options properly
  if (options.fontSize) {
    opts.fontSize = { ...DEFAULT_OPTIONS.fontSize, ...options.fontSize };
  }
  
  // Merge colors options properly
  if (options.colors) {
    opts.colors = { ...DEFAULT_OPTIONS.colors, ...options.colors };
  }
  
  if (!messages || messages.length === 0) {
    console.warn('No messages to export');
    return;
  }
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  let currentY = opts.margin.top;
  let pageNumber = 1;
  const maxWidth = opts.pageWidth - opts.margin.left - opts.margin.right;
  const maxHeight = opts.pageHeight - opts.margin.top - opts.margin.bottom;
  
  // Add header
  const headerHeight = addHeader(doc, opts);
  currentY += headerHeight;
  
  // Process each message
  messages.forEach((msg, index) => {
    // Determine role color
    const roleColor = msg.role.toLowerCase() === 'user' ? opts.colors.user : opts.colors.bot;
    
    // Format role text
    const roleText = `${msg.role}:`;
    const timestamp = msg.timestamp ? ` (${msg.timestamp})` : '';
    const fullRoleText = roleText + timestamp;
    
    // Calculate role text height
    doc.setFontSize(opts.fontSize.role);
    const roleHeight = opts.fontSize.role * opts.lineHeight;
    
    // Check if we need a new page for the role
    if (currentY + roleHeight > opts.margin.top + maxHeight) {
      doc.addPage();
      pageNumber++;
      addFooter(doc, pageNumber - 1, opts);
      currentY = opts.margin.top + addHeader(doc, opts);
    }
    
    // Add role text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(opts.fontSize.role);
    doc.setTextColor(roleColor);
    doc.text(fullRoleText, opts.margin.left, currentY);
    currentY += roleHeight;
    
    // Process message content
    const messageLines = splitTextToLines(doc, msg.message, maxWidth, opts.fontSize.message);
    const messageLineHeight = opts.fontSize.message * opts.lineHeight;
    
    // Add each line of the message
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(opts.fontSize.message);
    doc.setTextColor(opts.colors.text);
    
    messageLines.forEach((line) => {
      // Check if we need a new page
      if (currentY + messageLineHeight > opts.margin.top + maxHeight) {
        addFooter(doc, pageNumber, opts);
        doc.addPage();
        pageNumber++;
        currentY = opts.margin.top + addHeader(doc, opts);
      }
      
      // Add the line (handle empty lines)
      if (line.trim() === '') {
        currentY += messageLineHeight * 0.5; // Reduced height for empty lines
      } else {
        doc.text(line, opts.margin.left + 5, currentY); // Indent message text slightly
        currentY += messageLineHeight;
      }
    });
    
    // Add spacing between messages
    if (index < messages.length - 1) {
      currentY += messageLineHeight * 0.8;
    }
  });
  
  // Add final footer
  addFooter(doc, pageNumber, opts);
  
  // Download the PDF
  try {
    doc.save(opts.fileName);
    console.log(`Chat exported successfully as ${opts.fileName}`);
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw new Error('Failed to save PDF file');
  }
}

/**
 * Converts research bot conversation to chat messages format
 */
export function formatResearchBotConversation(
  userQuery: string,
  botResponse: string,
  timestamp?: string
): ChatMessage[] {
  const messages: ChatMessage[] = [];
  
  // Add user message
  messages.push({
    role: 'User',
    message: userQuery,
    timestamp: timestamp || new Date().toLocaleTimeString()
  });
  
  // Add bot response
  messages.push({
    role: 'Bot',
    message: botResponse,
    timestamp: timestamp || new Date().toLocaleTimeString()
  });
  
  return messages;
}

/**
 * Quick export function for research bot conversations
 */
export function exportResearchBotToPdf(
  userQuery: string,
  botResponse: string,
  fileName: string = 'Sales_Centri_research_conversation.pdf'
): void {
  const messages = formatResearchBotConversation(userQuery, botResponse);
  
  exportChatToPdf(messages, {
    fileName,
    colors: {
      user: '#0070f3',
      bot: '#00b894',
      text: '#2d3748'
    }
  });
}

/**
 * Export multiple research conversations to a single PDF
 */
export function exportMultipleConversationsToPdf(
  conversations: Array<{
    userQuery: string;
    botResponse: string;
    timestamp?: string;
  }>,
  fileName: string = 'Sales_Centri_research_conversations.pdf'
): void {
  const allMessages: ChatMessage[] = [];
  
  conversations.forEach((conv, index) => {
    const messages = formatResearchBotConversation(
      conv.userQuery,
      conv.botResponse,
      conv.timestamp
    );
    
    allMessages.push(...messages);
    
    // Add separator between conversations (except for the last one)
    if (index < conversations.length - 1) {
      allMessages.push({
        role: 'System',
        message: '--- End of Conversation ---\n\n'
      });
    }
  });
  
  exportChatToPdf(allMessages, {
    fileName,
    colors: {
      user: '#0070f3',
      bot: '#00b894',
      text: '#2d3748'
    }
  });
}
