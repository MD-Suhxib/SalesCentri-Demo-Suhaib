/**
 * Name Masking Utility for GDPR Compliance
 * 
 * This utility provides functions to mask last names in research outputs
 * to ensure privacy protection across all Multi-GPT categories.
 * 
 * Format: "FirstName ****" (e.g., "John ****", "Sarah ****")
 */

/**
 * Helper function to check if a phrase is a common business term, column header, or job title
 * that should NOT be masked
 */
function isBusinessTermOrColumnHeader(phrase: string, fullContext?: string): boolean {
  const normalizedPhrase = phrase.toLowerCase().trim();
  
  // Common column headers and business terms (case-insensitive)
  const businessTerms = [
    // Location names - Extended
    'san francisco', 'new york', 'los angeles', 'united states', 'united kingdom',
    'north america', 'south america', 'middle east', 'silicon valley',
    'salt lake', 'las vegas', 'hong kong', 'new delhi', 'cape town', 'costa rica',
    'south africa', 'saudi arabia', 'puerto rico', 'south korea', 'new zealand',
    
    // Job titles and roles (when appearing alone)
    'chief executive', 'chief technology', 'chief financial', 'chief operating',
    'vice president', 'general manager', 'product manager', 'sales manager',
    'account manager', 'project manager', 'program manager', 'customer success',
    'human resources', 'business development', 'software engineer', 'data analyst',
    'marketing director', 'sales director', 'operations director',
    
    // Column headers and labels
    'key decision', 'decision maker', 'key maker', 'annual revenue',
    'company size', 'company name', 'website url', 'contact information',
    'email address', 'phone number', 'street address', 'zip code',
    'employee count', 'revenue range', 'industry sector', 'market segment',
    'target market', 'business model', 'growth rate', 'founding year',
    
    // Major Companies - Financial
    'goldman sachs', 'morgan stanley', 'jpmorgan chase', 'bank america',
    'wells fargo', 'credit suisse', 'deutsche bank', 'barclays bank',
    'capital one', 'american express', 'charles schwab',
    
    // Major Companies - Tech
    'microsoft office', 'google analytics', 'salesforce platform', 'adobe creative',
    'amazon web', 'oracle database', 'general electric', 'hewlett packard',
    'international business', 'texas instruments',
    
    // Major Companies - Other Industries
    'american airlines', 'united airlines', 'general motors', 'ford motor',
    'johnson johnson', 'procter gamble', 'coca cola',
    
    // Technology and Industry Terms - Expanded
    'machine learning', 'artificial intelligence', 'business intelligence',
    'data science', 'customer service', 'real estate', 'social media',
    'email marketing', 'content marketing', 'digital marketing', 'search engine',
    'cloud computing', 'cyber security', 'supply chain', 'quality assurance',
    'risk management', 'financial services', 'health care', 'information technology',
    'deep learning', 'natural language', 'computer vision', 'quantum computing',
    'neural network', 'cloud storage', 'investment banking', 'private equity',
    'venture capital', 'asset management', 'market research', 'consumer electronics',
    'software development', 'web development', 'mobile development', 'database management',
    'network security', 'information security', 'project management', 'change management',
    'business analytics', 'predictive analytics', 'customer relationship', 'enterprise resource',
    
    // Table column keywords
    'company website', 'contact person', 'decision makers', 'key contact',
    'primary contact', 'main contact', 'sales rep', 'account rep',
    'territory manager', 'regional manager', 'district manager'
  ];
  
  // Check if the phrase matches any business term (case-insensitive)
  if (businessTerms.some(term => normalizedPhrase === term || normalizedPhrase.includes(term))) {
    return true;
  }
  
  // Check if this appears to be in a table header row
  if (fullContext) {
    const contextLower = fullContext.toLowerCase();
    // If the line contains multiple column-like keywords, it's likely a header
    const headerKeywords = ['company', 'website', 'revenue', 'employees', 'location', 
                           'industry', 'designation', 'maker', 'contact', 'email', 'phone'];
    const keywordCount = headerKeywords.filter(kw => contextLower.includes(kw)).length;
    if (keywordCount >= 3) {
      return true; // This is likely a table header row
    }
  }
  
  return false;
}

/**
 * Helper function to check if a phrase appears in a table header row
 */
function isInTableHeader(text: string, matchIndex: number): boolean {
  // Find the line containing this match
  const beforeMatch = text.substring(0, matchIndex);
  const lastNewline = beforeMatch.lastIndexOf('\n');
  const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
  
  const afterMatch = text.substring(matchIndex);
  const nextNewline = afterMatch.indexOf('\n');
  const lineEnd = nextNewline === -1 ? text.length : matchIndex + nextNewline;
  
  const currentLine = text.substring(lineStart, lineEnd).toLowerCase();
  
  // Check if this line is a table header (contains pipe and multiple column keywords)
  if (currentLine.includes('|')) {
    const headerKeywords = ['company', 'website', 'revenue', 'employees', 'location', 
                           'industry', 'designation', 'maker', 'contact', 'email', 'phone',
                           'key', 'decision', 'name', 'size', 'annual'];
    const keywordCount = headerKeywords.filter(kw => currentLine.includes(kw)).length;
    return keywordCount >= 2;
  }
  
  return false;
}

/**
 * Helper function to detect if a phrase has company/organization context indicators
 */
function hasCompanyContext(phrase: string, fullContext?: string): boolean {
  const normalizedPhrase = phrase.toLowerCase().trim();
  
  // Check for company suffixes (Inc, LLC, Corp, Ltd, Co)
  if (/\b(inc|llc|corp|ltd|co|corporation|incorporated|limited|company)\b/i.test(phrase)) {
    return true;
  }
  
  // Check context for company indicators
  if (fullContext) {
    const contextLower = fullContext.toLowerCase();
    const beforePhrase = contextLower.substring(0, contextLower.indexOf(normalizedPhrase));
    const afterPhrase = contextLower.substring(contextLower.indexOf(normalizedPhrase) + normalizedPhrase.length);
    
    // Check for "at [Company]" pattern
    if (/\bat\s*$/.test(beforePhrase) || /^\s*at\b/.test(afterPhrase)) {
      return true;
    }
    
    // Check for company-related keywords before the phrase
    const companyKeywords = ['company', 'firm', 'corporation', 'organization', 'business', 'enterprise', 'vendor', 'partner', 'client', 'supplier'];
    if (companyKeywords.some(kw => beforePhrase.includes(kw))) {
      return true;
    }
    
    // Check for product/platform/service indicators after the phrase
    const productKeywords = ['platform', 'software', 'service', 'product', 'solution', 'system', 'tool', 'application', 'website', 'portal'];
    if (productKeywords.some(kw => afterPhrase.substring(0, 50).includes(kw))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Helper function to detect if a pattern matches a person name with strong signals
 */
function hasStrongPersonNameSignal(fullContext: string, matchIndex: number): boolean {
  const beforeMatch = fullContext.substring(Math.max(0, matchIndex - 50), matchIndex).toLowerCase();
  
  // Strong person name indicators
  const personIndicators = [
    /\bcontact:\s*$/,
    /\brep:\s*$/,
    /\bmanager:\s*$/,
    /\blead:\s*$/,
    /\bspoke\s+(?:with|to)\s*$/,
    /\bmet\s+(?:with)?\s*$/,
    /\binterviewed\s*$/,
    /\b(?:mr\.|mrs\.|ms\.|dr\.|prof\.)\s*$/i,
    /\breported\s+by\s*$/,
    /\bwritten\s+by\s*$/,
    /\bauthored\s+by\s*$/,
  ];
  
  return personIndicators.some(pattern => pattern.test(beforeMatch));
}

/**
 * Masks full names in text by replacing last names with asterisks
 * 
 * Patterns detected:
 * - "First Last" → "First ****"
 * - "First Middle Last" → "First ****"
 * - "Dr. First Last" → "Dr. First ****"
 * - "First Last, Title" → "First ****, Title"
 * - "Sales Manager John Smith" → "Sales Manager John ****"
 * 
 * Will NOT mask:
 * - Column headers like "Key Decision Maker", "Annual Revenue"
 * - Job titles appearing alone like "Sales Manager", "Chief Executive"
 * - Location names like "San Francisco", "New York"
 * - Business terms like "Machine Learning", "Customer Service"
 * 
 * @param text - The text containing potential full names
 * @returns Text with last names masked
 */
export function maskFullNames(text: string): string {
  if (!text) return text;

  let maskedText = text;
  
  // Pattern 1: Names with STRONG person-name indicators (titles, contact labels, etc.)
  // Only mask when we have clear evidence this is a person's name
  // Matches: "Dr. John Smith", "Contact: John Smith", "Manager: John Smith"
  const strongPersonPattern = /\b((?:Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.|Contact:|Rep:|Manager:|Lead:|spoke with|met with|interviewed)\s+)([A-Z][a-z]+)(?:\s+[A-Z]\.?)?\s+([A-Z][a-z]+)\b/gi;
  
  maskedText = maskedText.replace(strongPersonPattern, (match, indicator, firstName, lastName, offset) => {
    const phrase = `${firstName} ${lastName}`;
    const contextStart = Math.max(0, offset - 50);
    const contextEnd = Math.min(text.length, offset + match.length + 50);
    const context = text.substring(contextStart, contextEnd);
    
    // Still check business terms
    if (isBusinessTermOrColumnHeader(phrase, context)) {
      return match;
    }
    
    // This has a strong person indicator, mask it
    return `${indicator}${firstName} ****`;
  });
  
  // Pattern 1b: Generic two-word capitalized patterns (CAREFUL - only mask with additional context)
  // Matches: "John Smith" but only if NOT a business term and NOT in company context
  const namePattern = /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/g;
  
  maskedText = maskedText.replace(namePattern, (match, firstName, lastName, offset) => {
    const phrase = `${firstName} ${lastName}`;
    
    // Get surrounding context (100 chars before and after for better analysis)
    const contextStart = Math.max(0, offset - 100);
    const contextEnd = Math.min(maskedText.length, offset + match.length + 100);
    const context = maskedText.substring(contextStart, contextEnd);
    
    // Don't mask if it's a business term or column header
    if (isBusinessTermOrColumnHeader(phrase, context)) {
      return match;
    }
    
    // Don't mask if it has company context indicators
    if (hasCompanyContext(match, context)) {
      return match;
    }
    
    // Don't mask if in a table header row
    if (isInTableHeader(maskedText, offset)) {
      return match;
    }
    
    // Only mask if we have strong person-name signals
    if (hasStrongPersonNameSignal(maskedText, offset)) {
      return `${firstName} ****`;
    }
    
    // Default: Don't mask unless we're sure it's a person
    return match;
  });

  // Pattern 2: Names in markdown table cells
  // Matches: "| John Smith |" → "| John **** |"
  // BUT skip header rows and company name columns
  const lines = maskedText.split('\n');
  maskedText = lines.map((line, lineIndex) => {
    // Skip if this looks like a table header row
    const lineLower = line.toLowerCase();
    if (line.includes('|')) {
      const headerKeywords = ['company', 'website', 'revenue', 'employees', 'location', 
                             'industry', 'designation', 'maker', 'contact', 'email', 'phone',
                             'key', 'decision', 'name', 'size', 'annual'];
      const keywordCount = headerKeywords.filter(kw => lineLower.includes(kw)).length;
      
      if (keywordCount >= 2) {
        return line; // Don't mask anything in header rows
      }
      
      // Also skip separator rows (e.g., |---|---|)
      if (/^\|[\s-:|]+\|$/.test(line)) {
        return line;
      }
      
      // Get the header row to understand column context
      const headerRow = lines.slice(0, lineIndex).reverse().find(l => 
        l.includes('|') && headerKeywords.some(kw => l.toLowerCase().includes(kw))
      );
      
      // Check if this column is for company names or person names
      const isPersonColumn = headerRow && /\b(contact|person|maker|representative|rep|manager|lead|stakeholder|executive)\b/i.test(headerRow);
      
      // For data rows, only mask if in person-specific columns
      if (isPersonColumn) {
        const tableNamePattern = /\|\s*([A-Z][a-z]+)\s+([A-Z][a-z]+)\s*\|/g;
        return line.replace(tableNamePattern, (match, firstName, lastName) => {
          const phrase = `${firstName} ${lastName}`;
          if (isBusinessTermOrColumnHeader(phrase, line)) {
            return match;
          }
          return `| ${firstName} **** |`;
        });
      }
    }
    return line;
  }).join('\n');

  // Pattern 3: Names with job titles preceding them
  // Matches: "Sales Manager John Smith" → "Sales Manager John ****"
  // BUT "Sales Manager" alone remains unchanged
  const jobTitleNamePattern = /\b((?:Sales|Account|Project|Program|Product|Marketing|Operations|Customer|Territory|Regional|District)\s+(?:Manager|Director|Representative|Rep|Executive|Specialist|Coordinator|Lead|Engineer|Analyst))\s+([A-Z][a-z]+)\s+([A-Z][a-z]+)\b/gi;
  
  maskedText = maskedText.replace(jobTitleNamePattern, (match, jobTitle, firstName, lastName, offset) => {
    // The job title is followed by what appears to be a person's name
    // Check if the firstName + lastName combo is actually a business term
    const namePart = `${firstName} ${lastName}`;
    if (isBusinessTermOrColumnHeader(namePart, match)) {
      return match;
    }
    
    // Mask the last name but keep the job title and first name
    return `${jobTitle} ${firstName} ****`;
  });

  // Pattern 4: Names with titles in parentheses or after colon (with person context)
  // Only mask if we have evidence it's a person, not a company
  const contextNamePattern = /\b([A-Z][a-z]+)\s+([A-Z][a-z]+)\s*(\(|,|\s*-\s*|:|$)/g;
  maskedText = maskedText.replace(contextNamePattern, (match, firstName, lastName, separator, offset) => {
    const phrase = `${firstName} ${lastName}`;
    
    // Check if this is a business term or column header
    const contextStart = Math.max(0, offset - 50);
    const contextEnd = Math.min(maskedText.length, offset + match.length + 50);
    const context = maskedText.substring(contextStart, contextEnd);
    
    if (isBusinessTermOrColumnHeader(phrase, context)) {
      return match;
    }
    
    // Don't mask if it has company context
    if (hasCompanyContext(match, context)) {
      return match;
    }
    
    // Check if we have strong person-name signals
    if (hasStrongPersonNameSignal(maskedText, offset)) {
      return `${firstName} ****${separator}`;
    }
    
    // Check if this looks like a person's name with job title context
    // (e.g., "John Smith, CEO" or "John Smith (Director)")
    const afterSeparator = maskedText.substring(offset + match.length, offset + match.length + 50);
    const hasJobTitleAfter = /^\s*(CEO|CTO|CFO|COO|Director|Manager|President|VP|Lead|Engineer|Analyst|Consultant)/i.test(afterSeparator);
    
    if (hasJobTitleAfter && lastName.length > 2 && !lastName.match(/^(Inc|LLC|Ltd|Corp|Co|USA|UK)$/)) {
      return `${firstName} ****${separator}`;
    }
    
    // Default: don't mask
    return match;
  });

  return maskedText;
}

/**
 * Validates if text contains any unmasked full names
 * 
 * @param text - The text to validate
 * @returns Object with validation result and any detected unmasked names
 */
export function validateNameMasking(text: string): {
  isValid: boolean;
  unmaskedNames: string[];
  message: string;
} {
  if (!text) {
    return { isValid: true, unmaskedNames: [], message: 'No text to validate' };
  }

  const unmaskedNames: string[] = [];
  
  // Detect potential unmasked names
  const suspiciousPatterns = [
    // "John Smith" pattern (two capitalized words)
    /\b([A-Z][a-z]{2,})\s+([A-Z][a-z]{2,})\b/g,
    // Names in table format without masking
    /\|\s*([A-Z][a-z]+)\s+([A-Z][a-z]+)\s*\|/g,
  ];

  for (const pattern of suspiciousPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const potentialName = match[0];
      
      // Exclude common non-name phrases - Expanded
      const excludeList = [
        // Locations
        'United States', 'United Kingdom', 'New York', 'San Francisco', 'Los Angeles',
        'North America', 'South America', 'Salt Lake', 'Las Vegas', 'Hong Kong',
        'New Delhi', 'Cape Town', 'Costa Rica', 'South Africa', 'South Korea',
        // Job Titles
        'Vice President', 'Chief Executive', 'Chief Technology', 'Chief Financial',
        'General Manager', 'Product Manager', 'Sales Manager', 'Customer Success',
        // Companies - Financial
        'Goldman Sachs', 'Morgan Stanley', 'Bank America', 'Wells Fargo',
        'Credit Suisse', 'Deutsche Bank', 'Capital One', 'American Express',
        // Companies - Tech
        'Microsoft Office', 'Google Analytics', 'Salesforce Platform', 'Adobe Creative',
        'Amazon Web', 'Oracle Database', 'General Electric', 'Hewlett Packard',
        // Companies - Other
        'American Airlines', 'United Airlines', 'General Motors', 'Ford Motor',
        // Technology Terms
        'Machine Learning', 'Data Science', 'Real Estate', 'Social Media',
        'Business Intelligence', 'Human Resources', 'Deep Learning', 'Natural Language',
        'Computer Vision', 'Quantum Computing', 'Neural Network', 'Cloud Storage',
        'Cloud Computing', 'Cyber Security', 'Investment Banking', 'Private Equity',
        'Venture Capital', 'Asset Management', 'Market Research', 'Consumer Electronics'
      ];
      
      if (!excludeList.some(phrase => potentialName.includes(phrase)) && 
          !potentialName.includes('****')) {
        unmaskedNames.push(potentialName.trim());
      }
    }
  }

  const isValid = unmaskedNames.length === 0;
  const message = isValid 
    ? 'All names are properly masked' 
    : `Found ${unmaskedNames.length} potentially unmasked name(s): ${unmaskedNames.slice(0, 5).join(', ')}${unmaskedNames.length > 5 ? '...' : ''}`;

  return { isValid, unmaskedNames: [...new Set(unmaskedNames)], message };
}

/**
 * Masks names in markdown tables specifically
 * Useful for table-based research outputs
 * 
 * @param tableContent - Markdown table content
 * @returns Table with masked names
 */
export function maskNamesInTable(tableContent: string): string {
  if (!tableContent) return tableContent;

  // Split into rows
  const rows = tableContent.split('\n');
  
  return rows.map(row => {
    // Skip header separator rows (e.g., |---|---|)
    if (row.match(/^\|[\s-:|]+\|$/)) {
      return row;
    }
    
    // Process each cell in the row
    return row.replace(/\|([^|]+)\|/g, (match, cellContent) => {
      // Mask any full names in the cell
      const maskedContent = maskFullNames(cellContent);
      return `|${maskedContent}|`;
    });
  }).join('\n');
}

/**
 * Sanitizes decision maker fields in JSON/object data
 * 
 * @param data - Object or array containing decision maker information
 * @param fields - Field names that contain person names (default: common decision maker fields)
 * @returns Sanitized data with masked names
 */
export function sanitizeDecisionMakerData<T extends Record<string, any>>(
  data: T | T[],
  fields: string[] = [
    'decisionMaker',
    'keyDecisionMaker',
    'contactPerson',
    'stakeholder',
    'keyContact',
    'contact',
    'name',
    'personName',
    'executiveName',
    'leaderName'
  ]
): T | T[] {
  const sanitizeObject = (obj: T): T => {
    const result = { ...obj } as any;
    
    for (const field of fields) {
      if (field in result && typeof result[field] === 'string') {
        result[field] = maskFullNames(result[field]);
      }
    }
    
    return result as T;
  };

  if (Array.isArray(data)) {
    return data.map(item => sanitizeObject(item));
  }
  
  return sanitizeObject(data);
}

/**
 * Post-processes AI model responses to ensure name masking
 * This is the main function to use for all research outputs
 * 
 * @param response - Raw response from AI model
 * @param validateOnly - If true, only validates without modifying (default: false)
 * @returns Processed response with masked names and validation info
 */
export function processResearchResponse(
  response: string,
  validateOnly: boolean = false
): {
  processedResponse: string;
  validation: ReturnType<typeof validateNameMasking>;
  wasModified: boolean;
} {
  if (!response) {
    return {
      processedResponse: response,
      validation: { isValid: true, unmaskedNames: [], message: 'Empty response' },
      wasModified: false
    };
  }

  // First validate the original response
  const validation = validateNameMasking(response);

  if (validateOnly) {
    return {
      processedResponse: response,
      validation,
      wasModified: false
    };
  }

  // Mask any unmasked names
  const processedResponse = maskFullNames(response);
  const wasModified = processedResponse !== response;

  // Re-validate after masking
  const finalValidation = validateNameMasking(processedResponse);

  return {
    processedResponse,
    validation: finalValidation,
    wasModified
  };
}

// Export a logging helper for debugging
export function logNameMaskingResults(
  category: string,
  model: string,
  validation: ReturnType<typeof validateNameMasking>,
  wasModified: boolean
): void {
  if (!validation.isValid || wasModified) {
    console.warn(`🔐 NAME MASKING [${category}/${model}]:`, {
      valid: validation.isValid,
      modified: wasModified,
      message: validation.message,
      unmaskedCount: validation.unmaskedNames.length
    });
  } else {
    console.log(`✅ NAME MASKING [${category}/${model}]: All names properly masked`);
  }
}
