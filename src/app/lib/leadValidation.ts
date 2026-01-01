// Lead validation utilities for sales opportunities

export interface LeadValidationResult {
  isValid: boolean;
  score: number; // 1-10 BANT qualification score
  issues: string[];
  suggestions: string[];
}

export interface LeadData {
  company: string;
  website: string;
  industry: string;
  decisionMaker: string;
  decisionMakerRole: string;
  opportunityFit: string;
  score: number;
  nextStep: string;
}

// Validate website accessibility and professionalism
export async function validateWebsite(website: string): Promise<{
  isAccessible: boolean;
  isProfessional: boolean;
  issues: string[];
}> {
  const issues: string[] = [];
  let isAccessible = false;
  let isProfessional = false;

  try {
    // Basic URL validation
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    
    // Check for common invalid domains
    const invalidDomains = [
      'example.com', 'test.com', 'placeholder.com', 'localhost',
      'godaddy.com', 'namecheap.com', 'domain.com', 'parked.com'
    ];
    
    if (invalidDomains.some(domain => url.hostname.includes(domain))) {
      issues.push('Invalid or placeholder domain');
      return { isAccessible: false, isProfessional: false, issues };
    }

    // In a real implementation, you would make an HTTP request to check accessibility
    // For now, we'll do basic validation
    isAccessible = true;
    
    // Check for professional indicators in the URL
    const professionalIndicators = [
      'www.', 'https://', '.com', '.org', '.net', '.co', '.io'
    ];
    
    isProfessional = professionalIndicators.some(indicator => 
      website.toLowerCase().includes(indicator)
    );

    if (!isProfessional) {
      issues.push('Website may not be professional');
    }

  } catch (error) {
    issues.push('Invalid website URL format');
  }

  return { isAccessible, isProfessional, issues };
}

// Validate decision maker role appropriateness
export function validateDecisionMakerRole(role: string, companySize: string): {
  isValid: boolean;
  isAppropriate: boolean;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let isValid = true;
  let isAppropriate = true;

  // Common decision maker roles
  const validRoles = [
    'CEO', 'CTO', 'CMO', 'VP Sales', 'VP Marketing', 'VP Technology',
    'Director of Sales', 'Director of Marketing', 'Sales Manager',
    'Marketing Manager', 'Head of Sales', 'Head of Marketing',
    'Business Development Manager', 'Operations Manager', 'Founder',
    'President', 'Managing Director', 'General Manager'
  ];

  const roleLower = role.toLowerCase();
  const hasValidRole = validRoles.some(validRole => 
    roleLower.includes(validRole.toLowerCase())
  );

  if (!hasValidRole) {
    isValid = false;
    suggestions.push('Use standard business titles like CEO, VP Sales, Director, etc.');
  }

  // Check appropriateness for company size
  const executiveRoles = ['CEO', 'CTO', 'CMO', 'President', 'Founder'];
  const isExecutiveRole = executiveRoles.some(execRole => 
    roleLower.includes(execRole.toLowerCase())
  );

  if (companySize === 'small' && isExecutiveRole) {
    isAppropriate = true; // Small companies often have executives as decision makers
  } else if (companySize === 'large' && !isExecutiveRole && !roleLower.includes('vp') && !roleLower.includes('director')) {
    suggestions.push('Large companies typically have VP or Director level decision makers');
  }

  return { isValid, isAppropriate, suggestions };
}

// Calculate BANT qualification score
export function calculateBANTScore(lead: LeadData): number {
  let score = 0;
  const maxScore = 10;

  // Budget indicators (0-3 points)
  if (lead.opportunityFit.toLowerCase().includes('budget') || 
      lead.opportunityFit.toLowerCase().includes('investment') ||
      lead.opportunityFit.toLowerCase().includes('spending')) {
    score += 3;
  } else if (lead.opportunityFit.toLowerCase().includes('cost') ||
             lead.opportunityFit.toLowerCase().includes('price')) {
    score += 2;
  } else {
    score += 1; // Base score for having opportunity fit
  }

  // Authority indicators (0-3 points)
  const authorityRoles = ['ceo', 'cto', 'cmo', 'vp', 'director', 'manager'];
  const hasAuthority = authorityRoles.some(role => 
    lead.decisionMakerRole.toLowerCase().includes(role)
  );
  
  if (hasAuthority) {
    score += 3;
  } else {
    score += 1; // Base score for having a decision maker
  }

  // Need indicators (0-2 points)
  const needKeywords = ['need', 'require', 'looking for', 'seeking', 'challenge', 'problem'];
  const hasNeed = needKeywords.some(keyword => 
    lead.opportunityFit.toLowerCase().includes(keyword)
  );
  
  if (hasNeed) {
    score += 2;
  } else {
    score += 1; // Base score for having opportunity fit
  }

  // Timeline indicators (0-2 points)
  const timelineKeywords = ['urgent', 'immediate', 'asap', 'soon', 'this quarter', 'next month'];
  const hasTimeline = timelineKeywords.some(keyword => 
    lead.opportunityFit.toLowerCase().includes(keyword) ||
    lead.nextStep.toLowerCase().includes(keyword)
  );
  
  if (hasTimeline) {
    score += 2;
  } else {
    score += 1; // Base score for having next step
  }

  return Math.min(score, maxScore);
}

// Validate complete lead data
export async function validateLead(lead: LeadData): Promise<LeadValidationResult> {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Validate website
  const websiteValidation = await validateWebsite(lead.website);
  if (!websiteValidation.isAccessible) {
    issues.push(...websiteValidation.issues);
  }
  if (!websiteValidation.isProfessional) {
    issues.push(...websiteValidation.issues);
  }

  // Validate decision maker role
  const roleValidation = validateDecisionMakerRole(lead.decisionMakerRole, 'medium');
  if (!roleValidation.isValid) {
    issues.push('Invalid decision maker role');
  }
  suggestions.push(...roleValidation.suggestions);

  // Validate opportunity fit specificity
  if (lead.opportunityFit.length < 20) {
    issues.push('Opportunity fit description too brief');
    suggestions.push('Provide more specific details about how the company would use the product');
  }

  // Validate score
  const calculatedScore = calculateBANTScore(lead);
  if (lead.score !== calculatedScore) {
    issues.push(`Score mismatch: provided ${lead.score}, calculated ${calculatedScore}`);
    suggestions.push('Use the calculated BANT score based on qualification criteria');
  }

  // Validate next step
  if (!lead.nextStep || lead.nextStep.length < 10) {
    issues.push('Next step too vague');
    suggestions.push('Provide specific, actionable next steps');
  }

  const isValid = issues.length === 0;
  const score = calculatedScore;

  return {
    isValid,
    score,
    issues,
    suggestions
  };
}

// Validate multiple leads
export async function validateLeads(leads: LeadData[]): Promise<{
  validLeads: LeadData[];
  invalidLeads: LeadData[];
  overallScore: number;
  recommendations: string[];
}> {
  const validLeads: LeadData[] = [];
  const invalidLeads: LeadData[] = [];
  const recommendations: string[] = [];

  for (const lead of leads) {
    const validation = await validateLead(lead);
    
    if (validation.isValid) {
      validLeads.push(lead);
    } else {
      invalidLeads.push(lead);
      recommendations.push(`Lead ${lead.company}: ${validation.issues.join(', ')}`);
    }
  }

  const overallScore = validLeads.length > 0 
    ? validLeads.reduce((sum, lead) => sum + lead.score, 0) / validLeads.length
    : 0;

  return {
    validLeads,
    invalidLeads,
    overallScore,
    recommendations
  };
}
