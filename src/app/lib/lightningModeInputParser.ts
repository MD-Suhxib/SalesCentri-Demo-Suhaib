import { LightningInputs } from '../types/lightningMode';

/**
 * Parse user input from textarea to extract email/website/LinkedIn
 */
export function parseLightningModeInput(input: string): LightningInputs {
  console.log('🔍 parseLightningModeInput called with:', input);
  
  const inputs: LightningInputs = {};
  
  // Extract email
  const email = extractEmail(input);
  console.log('🔍 Extracted email:', email);
  if (email) {
    inputs.email = email;
    inputs.domain = extractDomainFromEmail(email);
  }
  
  // Extract website
  const website = extractWebsite(input);
  console.log('🔍 Extracted website:', website);
  if (website) {
    inputs.website = website;
  }
  
  // Extract LinkedIn
  const linkedin = extractLinkedIn(input);
  console.log('🔍 Extracted linkedin:', linkedin);
  if (linkedin) {
    inputs.linkedin = linkedin;
  }
  
  console.log('🔍 Final parsed inputs:', inputs);
  return inputs;
}

/**
 * Extract email address from input text
 */
export function extractEmail(input: string): string | null {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = input.match(emailRegex);
  return matches ? matches[0] : null;
}

/**
 * Extract website URL from input text
 */
export function extractWebsite(input: string): string | null {
  console.log('🔍 extractWebsite called with input:', input);
  
  const websiteRegex = /(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;
  const matches = input.match(websiteRegex);
  
  console.log('🔍 Website regex matches:', matches);
  
  if (matches) {
    // Filter out LinkedIn URLs and prioritize actual websites
    const websiteMatches = matches.filter(match => 
      !match.includes('linkedin.com') && 
      !match.includes('facebook.com') && 
      !match.includes('twitter.com') &&
      !match.includes('instagram.com')
    );
    
    console.log('🔍 Filtered website matches:', websiteMatches);
    
    if (websiteMatches.length > 0) {
      let website = websiteMatches[0];
      // Add https:// if not present
      if (!website.startsWith('http')) {
        website = 'https://' + website;
      }
      console.log('🔍 Final website extracted:', website);
      return website;
    }
  }
  
  console.log('🔍 No website found');
  return null;
}

/**
 * Extract LinkedIn profile URL from input text
 */
export function extractLinkedIn(input: string): string | null {
  const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/g;
  const matches = input.match(linkedinRegex);
  
  if (matches) {
    let linkedin = matches[0];
    // Add https:// if not present
    if (!linkedin.startsWith('http')) {
      linkedin = 'https://' + linkedin;
    }
    return linkedin;
  }
  
  return null;
}

/**
 * Extract domain from email address
 */
export function extractDomainFromEmail(email: string): string | null {
  const domain = email.split('@')[1];
  return domain || null;
}

/**
 * Validate Lightning Mode inputs
 */
export function validateLightningModeInputs(inputs: LightningInputs): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // At least one input is required
  if (!inputs.email && !inputs.website && !inputs.linkedin) {
    errors.push('Please provide at least one of: email, website, or LinkedIn profile');
  }
  
  // Validate email format if provided
  if (inputs.email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!emailRegex.test(inputs.email)) {
      errors.push('Please provide a valid email address');
    }
  }
  
  // Validate website format if provided
  if (inputs.website) {
    try {
      new URL(inputs.website);
    } catch {
      errors.push('Please provide a valid website URL');
    }
  }
  
  // Validate LinkedIn format if provided
  if (inputs.linkedin) {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedinRegex.test(inputs.linkedin)) {
      errors.push('Please provide a valid LinkedIn profile URL');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Format inputs for display in chat
 */
export function formatInputsForDisplay(inputs: LightningInputs): string {
  const parts: string[] = [];
  
  if (inputs.email) {
    parts.push(`📧 Email: ${inputs.email}`);
  }
  
  if (inputs.website) {
    parts.push(`🌐 Website: ${inputs.website}`);
  }
  
  if (inputs.linkedin) {
    parts.push(`💼 LinkedIn: ${inputs.linkedin}`);
  }
  
  return parts.join('\n');
}

/**
 * Check if input contains Lightning Mode keywords
 */
export function isLightningModeInput(input: string): boolean {
  const lightningKeywords = [
    'email:', 'website:', 'linkedin:',
    'my email', 'my website', 'my linkedin',
    'email is', 'website is', 'linkedin is',
    '@', 'http', 'linkedin.com',
    'email', 'website', 'linkedin',
    'com', 'www.', 'https://', 'http://'
  ];
  
  const lowerInput = input.toLowerCase();
  const hasKeywords = lightningKeywords.some(keyword => lowerInput.includes(keyword));
  
  // Also check if input contains email pattern or URL pattern
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(input);
  const hasUrl = /(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(input);
  
  console.log('🔍 Lightning Mode detection:', {
    input: input.substring(0, 50) + '...',
    hasKeywords,
    hasEmail,
    hasUrl,
    result: hasKeywords || hasEmail || hasUrl,
    fullInput: input
  });
  
  return hasKeywords || hasEmail || hasUrl;
}
