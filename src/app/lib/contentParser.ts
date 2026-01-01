// Content parser utility for separating text and table content

export interface ParsedContent {
  textSections: string[];
  tableSections: string[];
  hasTables: boolean;
  hasText: boolean;
  isMixedContent: boolean;
}

/**
 * Parse mixed content to separate text from tables
 * @param content - The raw content string from ResearchGPT
 * @returns ParsedContent object with separated sections
 */
export function parseMixedContent(content: string): ParsedContent {
  if (!content || typeof content !== 'string') {
    return {
      textSections: [],
      tableSections: [],
      hasTables: false,
      hasText: false,
      isMixedContent: false
    };
  }

  // Enhanced table detection - properly separate multiple consecutive tables
  // Split content by lines to process each table individually
  const lines = content.split('\n');
  const validTables: string[] = [];
  let currentTable: string[] = [];
  let inTable = false;
  let headerProcessed = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      if (inTable && currentTable.length > 0) {
        // End of table - save it if valid
        const tableText = currentTable.join('\n');
        if (isValidTable(tableText)) {
          validTables.push(tableText);
        }
        currentTable = [];
        inTable = false;
        headerProcessed = false;
      }
      continue;
    }
    
    // Check if this line starts a table (has pipes and looks like header)
    if (trimmedLine.includes('|') && !inTable) {
      const isTableHeader = isTableHeaderLine(trimmedLine);
      if (isTableHeader) {
        inTable = true;
        headerProcessed = true;
        currentTable = [line]; // Keep original formatting
        continue;
      }
    }
    
    // If we're in a table, check if this line continues the table
    if (inTable) {
      const isTableRow = isTableRowLine(trimmedLine);
      const isTableSeparator = isTableSeparatorLine(trimmedLine);
      
      if (isTableRow || isTableSeparator) {
        currentTable.push(line);
      } else {
        // This line doesn't belong to the table - end current table
        const tableText = currentTable.join('\n');
        if (isValidTable(tableText)) {
          validTables.push(tableText);
        }
        currentTable = [];
        inTable = false;
        headerProcessed = false;
        
        // Check if this line starts a new table
        const isTableHeader = isTableHeaderLine(trimmedLine);
        if (isTableHeader) {
          inTable = true;
          headerProcessed = true;
          currentTable = [line];
        }
      }
    }
  }
  
  // Handle table that ends at the end of content
  if (inTable && currentTable.length > 0) {
    const tableText = currentTable.join('\n');
    if (isValidTable(tableText)) {
      validTables.push(tableText);
    }
  }
  
  // Helper functions for table detection
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
  
  function isValidTable(tableText: string): boolean {
    const lines = tableText.trim().split('\n').filter(line => line.trim());
    
    console.log('🔍 isValidTable Debug:', {
      tableTextLength: tableText.length,
      linesCount: lines.length,
      firstLine: lines[0]?.substring(0, 100),
      hasPipes: lines.some(line => line.includes('|')),
      hasSeparator: lines.some(line => line.match(/^[-=]+$/))
    });
    
    // Handle single-line tables (like the user's format)
    if (lines.length === 1) {
      const line = lines[0];
      const hasCompanyName = line.includes('Company Name');
      const hasSeparator = line.includes('---');
      const hasPipes = line.includes('|');
      return hasCompanyName && hasSeparator && hasPipes;
    }
    
    // Handle multi-line tables - more flexible detection
    const hasValidStructure = lines.length >= 2 && 
           lines.some(line => line.match(/^\|.*\|$/)) && // Has proper table rows
           !lines.every(line => line.match(/^[-=]+$/)); // Not just separator lines
    
    // More flexible check - look for common table indicators
    const hasTableIndicators = lines.some(line => 
      line.toLowerCase().includes('company') || 
      line.toLowerCase().includes('website') ||
      line.toLowerCase().includes('industry') ||
      line.toLowerCase().includes('revenue') ||
      line.toLowerCase().includes('employees') ||
      line.toLowerCase().includes('product line') ||
      line.toLowerCase().includes('use case') ||
      line.toLowerCase().includes('location') ||
      line.toLowerCase().includes('designation') ||
      line.toLowerCase().includes('pain points')
    );
    
    // Also check for pipe-separated content even without perfect structure
    const hasPipeContent = lines.some(line => 
      line.includes('|') && 
      (line.includes('Company') || line.includes('Website') || line.includes('Industry'))
    );
    
    const isValid = (hasValidStructure && hasTableIndicators) || hasPipeContent;
    
    console.log('🔍 Table Validation Result:', {
      hasValidStructure,
      hasTableIndicators,
      hasPipeContent,
      isValid
    });
    
    return isValid;
  }
  
  console.log('🔍 Table Detection Debug:', {
    totalLines: lines.length,
    validTables: validTables.length,
    tablePreviews: validTables.map(t => t.substring(0, 100) + '...'),
    contentPreview: content.substring(0, 200) + '...'
  });
  
  // Extract text sections by removing valid table content
  let textContent = content;
  validTables.forEach(table => {
    textContent = textContent.replace(table, '');
  });
  
  // Clean up text content - split by sections and filter out empty ones
  const textSections = textContent
    .split(/\n\s*\n/) // Split by double newlines
    .map(section => section.trim())
    .filter(section => {
      // Filter out very short sections and sections that are just table artifacts
      return section.length > 50 && 
             !section.match(/^\|.*\|$/) && // Not a single table line
             !section.match(/^[-=]+$/) && // Not separator lines
             !section.match(/^#+\s*$/) && // Not empty headers
             !section.match(/^\s*\|.*\|\s*$/) && // Not table lines with spaces
             section.includes(' ') && // Must contain spaces (actual text)
             !section.match(/^\*\*Configuration:\*\*/) && // Not configuration lines&& // Not main headers
             !section.match(/^## \*\*.*\*\*$/) && // Not section headers
             !section.match(/^### \*\*.*\*\*$/) && // Not subsection headers
             !section.match(/^---.*Research completed/) && // Not footer lines
             !section.match(/^\*\*TABLE \d+:/) && // Not table headers
             !section.match(/^### \*\*.*Sector.*\*\*$/) && // Not sector headers
             section.match(/[a-zA-Z]{3,}/); // Must contain actual words
    });
  
  // Clean up table content
  const tableSections = validTables
    .map(table => table.trim())
    .filter(table => table.length > 0);
  
  const hasTables = tableSections.length > 0;
  const hasText = textSections.length > 0;
  const isMixedContent = hasTables && hasText;
  
  console.log('🔍 Content Parser Debug:', {
    originalLength: content.length,
    tableMatches: validTables.length,
    textSections: textSections.length,
    hasTables,
    hasText,
    isMixedContent,
    textPreview: textSections[0]?.substring(0, 100) + '...',
    tablePreview: tableSections[0]?.substring(0, 100) + '...'
  });
  
  return {
    textSections,
    tableSections,
    hasTables,
    hasText,
    isMixedContent
  };
}

/**
 * Check if content contains tables
 * @param content - The content string to check
 * @returns boolean indicating if content has tables
 */
export function hasTableContent(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  
  // Check for markdown tables with proper structure
  const markdownTableRegex = /\|.*\|[\s\S]*?---[\s\S]*?\|.*\|/;
  const hasMarkdownTables = markdownTableRegex.test(content);
  
  // Check for ResearchGPT specific table format (Company Name column)
  const hasResearchGPTTables = content.includes('| Company Name |') && content.includes('---');
  
  // Check for single-line table format (like the user's format)
  const hasSingleLineTables = content.includes('| Company Name |') && 
                             content.includes('---') && 
                             content.includes('|') &&
                             content.split('\n').some(line => 
                               line.includes('| Company Name |') && 
                               line.includes('---') && 
                               line.includes('|')
                             );
  
  // Check for HTML tables
  const hasHtmlTables = content.includes('<table') && content.includes('</table>');
  
  // Check for grid structures
  const hasGridStructures = content.includes('sales-opportunities-grid-container') || 
                           content.includes('grid-header') ||
                           content.includes('grid-cell');
  
  const result = hasMarkdownTables || hasResearchGPTTables || hasSingleLineTables || hasHtmlTables || hasGridStructures;
  
  console.log('🔍 hasTableContent Debug:', {
    hasMarkdownTables,
    hasResearchGPTTables,
    hasSingleLineTables,
    hasHtmlTables,
    hasGridStructures,
    result,
    contentPreview: content.substring(0, 200) + '...'
  });
  
  return result;
}

/**
 * Check if content is primarily text
 * @param content - The content string to check
 * @returns boolean indicating if content is primarily text
 */
export function isTextContent(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  
  const parsed = parseMixedContent(content);
  return parsed.hasText && !parsed.hasTables;
}

/**
 * Check if content is mixed (both text and tables)
 * @param content - The content string to check
 * @returns boolean indicating if content is mixed
 */
export function isMixedContent(content: string): boolean {
  if (!content || typeof content !== 'string') return false;
  
  const parsed = parseMixedContent(content);
  return parsed.isMixedContent;
}
