/**
 * Enhanced Decision Maker Extraction and Contact Discovery
 * 
 * This module provides comprehensive decision maker identification and contact discovery
 * for sales research results.
 */

import { maskDecisionMakerName } from './decisionMakerVerification';

export interface DecisionMaker {
  name: string;
  position: string;
  company: string;
  email?: string;
  linkedin?: string;
  phone?: string;
  confidence: number;
  source: string;
  department?: string;
  seniority?: 'C-Level' | 'VP' | 'Director' | 'Manager' | 'Other';
  decisionInfluence?: 'High' | 'Medium' | 'Low';
  lastVerified?: string;
}

export interface CompanyDecisionMakers {
  company: string;
  website?: string;
  industry?: string;
  decisionMakers: DecisionMaker[];
  totalEmployees?: number;
  revenue?: string;
  headquarters?: string;
}

export class DecisionMakerExtractor {
  private static readonly DECISION_MAKER_PATTERNS = [
    // C-Level positions
    /(?:CEO|Chief Executive Officer|President|Founder|Co-Founder)/gi,
    /(?:CTO|Chief Technology Officer|Chief Technical Officer)/gi,
    /(?:CFO|Chief Financial Officer)/gi,
    /(?:CMO|Chief Marketing Officer)/gi,
    /(?:COO|Chief Operating Officer)/gi,
    /(?:CPO|Chief Product Officer)/gi,
    /(?:CRO|Chief Revenue Officer)/gi,
    /(?:CDO|Chief Data Officer)/gi,
    /(?:CISO|Chief Information Security Officer)/gi,
    
    // VP Level
    /(?:VP|Vice President|Vice-President)\s+(?:of\s+)?(?:Sales|Marketing|Engineering|Technology|Product|Operations|Finance|HR|Human Resources)/gi,
    
    // Director Level
    /(?:Director|Head)\s+(?:of\s+)?(?:Sales|Marketing|Engineering|Technology|Product|Operations|Finance|HR|Human Resources|Business Development)/gi,
    
    // Manager Level
    /(?:Manager|Lead|Principal)\s+(?:of\s+)?(?:Sales|Marketing|Engineering|Technology|Product|Operations|Finance|HR|Human Resources|Business Development)/gi,
    
    // Specific roles
    /(?:Sales Director|Sales Manager|Business Development Manager|Account Executive|Sales Executive)/gi,
    /(?:Marketing Director|Marketing Manager|Digital Marketing Manager|Growth Manager)/gi,
    /(?:Engineering Manager|Tech Lead|Software Engineering Manager|DevOps Manager)/gi,
    /(?:Product Manager|Product Owner|Product Marketing Manager)/gi,
    /(?:Operations Manager|Operations Director|General Manager)/gi,
    /(?:Finance Manager|Financial Controller|Accounting Manager)/gi,
    /(?:HR Manager|Human Resources Manager|People Operations Manager)/gi,
  ];

  private static readonly NAME_PATTERNS = [
    // Full names with titles
    /(?:Mr\.|Ms\.|Mrs\.|Dr\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    // Names with positions
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*[,:]\s*(CEO|CTO|CFO|CMO|COO|VP|Director|Manager|Lead|President|Founder)/gi,
    // Names in quotes or brackets
    /["'`]([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)["'`]/g,
    // Names with common patterns
    /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s*[,:]\s*|\s+is\s+|\s+-\s+)/gi,
  ];

  private static readonly EMAIL_PATTERNS = [
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
  ];

  private static readonly LINKEDIN_PATTERNS = [
    /(?:linkedin\.com\/in\/|linkedin\.com\/pub\/)([a-zA-Z0-9-]+)/gi,
    /(?:linkedin\.com\/company\/)([a-zA-Z0-9-]+)/gi,
  ];

  private static readonly PHONE_PATTERNS = [
    /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g,
    /(?:\+?[1-9]\d{1,14})/g, // International format
  ];

  /**
   * Extract decision makers from research results
   */
  public static extractDecisionMakers(researchResults: string): CompanyDecisionMakers[] {
    const companies: CompanyDecisionMakers[] = [];
    
    // Split results by company sections
    const companySections = this.splitByCompany(researchResults);
    
    for (const section of companySections) {
      const company = this.extractCompanyInfo(section);
      if (company) {
        const decisionMakers = this.extractDecisionMakersFromSection(section, company.company);
        company.decisionMakers = decisionMakers;
        companies.push(company);
      }
    }
    
    return companies;
  }

  /**
   * Split research results by company sections
   */
  private static splitByCompany(text: string): string[] {
    // Look for company headers, bullet points, or table rows
    const companyMarkers = [
      /(?:^|\n)\s*(?:Company|Organization|Business|Firm|Corporation|Enterprise):\s*([^\n]+)/gmi,
      /(?:^|\n)\s*•\s*([A-Z][^•\n]+(?:Inc|LLC|Corp|Ltd|Company|Corporation))/gmi,
      /(?:^|\n)\s*\d+\.\s*([A-Z][^•\n]+(?:Inc|LLC|Corp|Ltd|Company|Corporation))/gmi,
      /(?:^|\n)\s*([A-Z][^•\n]+(?:Inc|LLC|Corp|Ltd|Company|Corporation))/gmi,
    ];

    const sections: string[] = [];
    let currentSection = '';

    const lines = text.split('\n');
    for (const line of lines) {
      let isCompanyHeader = false;
      
      for (const pattern of companyMarkers) {
        if (pattern.test(line)) {
          if (currentSection.trim()) {
            sections.push(currentSection.trim());
          }
          currentSection = line + '\n';
          isCompanyHeader = true;
          break;
        }
      }
      
      if (!isCompanyHeader) {
        currentSection += line + '\n';
      }
    }
    
    if (currentSection.trim()) {
      sections.push(currentSection.trim());
    }
    
    return sections;
  }

  /**
   * Extract company information from a section
   */
  private static extractCompanyInfo(section: string): CompanyDecisionMakers | null {
    const companyMatch = section.match(/([A-Z][^•\n]+(?:Inc|LLC|Corp|Ltd|Company|Corporation|Ltd\.|Inc\.|LLC\.|Corp\.))/i);
    if (!companyMatch) return null;

    const company = companyMatch[1].trim();
    
    // Extract website
    const websiteMatch = section.match(/(?:website|site|url):\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    const website = websiteMatch ? websiteMatch[1] : undefined;
    
    // Extract industry
    const industryMatch = section.match(/(?:industry|sector|field):\s*([^\n,]+)/i);
    const industry = industryMatch ? industryMatch[1].trim() : undefined;
    
    // Extract employee count
    const employeeMatch = section.match(/(?:employees|staff|team):\s*([0-9,]+)/i);
    const totalEmployees = employeeMatch ? parseInt(employeeMatch[1].replace(/,/g, '')) : undefined;
    
    // Extract revenue
    const revenueMatch = section.match(/(?:revenue|sales):\s*\$?([0-9,.]+[KMB]?)/i);
    const revenue = revenueMatch ? revenueMatch[1] : undefined;
    
    // Extract headquarters
    const hqMatch = section.match(/(?:headquarters|hq|location|based):\s*([^\n,]+)/i);
    const headquarters = hqMatch ? hqMatch[1].trim() : undefined;

    return {
      company,
      website,
      industry,
      totalEmployees,
      revenue,
      headquarters,
      decisionMakers: []
    };
  }

  /**
   * Extract decision makers from a specific section
   */
  private static extractDecisionMakersFromSection(section: string, company: string): DecisionMaker[] {
    const decisionMakers: DecisionMaker[] = [];
    
    // Find all potential decision maker mentions
    const lines = section.split('\n');
    
    for (const line of lines) {
      // Check if line contains decision maker patterns
      const hasDecisionMakerPattern = this.DECISION_MAKER_PATTERNS.some(pattern => pattern.test(line));
      
      if (hasDecisionMakerPattern) {
        const decisionMaker = this.extractDecisionMakerFromLine(line, company);
        if (decisionMaker) {
          decisionMakers.push(decisionMaker);
        }
      }
    }
    
    // Remove duplicates and sort by confidence
    return this.deduplicateDecisionMakers(decisionMakers)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract decision maker information from a single line
   */
  private static extractDecisionMakerFromLine(line: string, company: string): DecisionMaker | null {
    // Extract name
    const name = this.extractName(line);
    if (!name) return null;
    
    // Extract position
    const position = this.extractPosition(line);
    if (!position) return null;
    
    // Extract contact information
    const email = this.extractEmail(line);
    const linkedin = this.extractLinkedIn(line);
    const phone = this.extractPhone(line);
    
    // Determine seniority level
    const seniority = this.determineSeniority(position);
    
    // Determine decision influence
    const decisionInfluence = this.determineDecisionInfluence(position, seniority);
    
    // Calculate confidence score
    const confidence = this.calculateConfidence(name, position, email, linkedin);
    
    return {
      name,
      position,
      company,
      email,
      linkedin,
      phone,
      confidence,
      source: 'research_extraction',
      seniority,
      decisionInfluence,
      lastVerified: new Date().toISOString()
    };
  }

  /**
   * Extract name from text
   */
  private static extractName(text: string): string | null {
    for (const pattern of this.NAME_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        const name = match[1] || match[0];
        // Clean up the name
        return name.replace(/[^\w\s]/g, '').trim();
      }
    }
    return null;
  }

  /**
   * Extract position from text
   */
  private static extractPosition(text: string): string | null {
    for (const pattern of this.DECISION_MAKER_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }
    return null;
  }

  /**
   * Extract email from text
   */
  private static extractEmail(text: string): string | undefined {
    const match = text.match(this.EMAIL_PATTERNS[0]);
    return match ? match[1] : undefined;
  }

  /**
   * Extract LinkedIn profile from text
   */
  private static extractLinkedIn(text: string): string | undefined {
    const match = text.match(this.LINKEDIN_PATTERNS[0]);
    return match ? `https://linkedin.com/in/${match[1]}` : undefined;
  }

  /**
   * Extract phone number from text
   */
  private static extractPhone(text: string): string | undefined {
    const match = text.match(this.PHONE_PATTERNS[0]);
    return match ? match[0] : undefined;
  }

  /**
   * Determine seniority level based on position
   */
  private static determineSeniority(position: string): DecisionMaker['seniority'] {
    const pos = position.toLowerCase();
    
    if (pos.includes('ceo') || pos.includes('chief') || pos.includes('president') || pos.includes('founder')) {
      return 'C-Level';
    } else if (pos.includes('vp') || pos.includes('vice president')) {
      return 'VP';
    } else if (pos.includes('director') || pos.includes('head of')) {
      return 'Director';
    } else if (pos.includes('manager') || pos.includes('lead')) {
      return 'Manager';
    } else {
      return 'Other';
    }
  }

  /**
   * Determine decision influence level
   */
  private static determineDecisionInfluence(position: string, seniority: DecisionMaker['seniority']): DecisionMaker['decisionInfluence'] {
    if (seniority === 'C-Level' || seniority === 'VP') {
      return 'High';
    } else if (seniority === 'Director') {
      return 'Medium';
    } else {
      return 'Low';
    }
  }

  /**
   * Calculate confidence score for decision maker
   */
  private static calculateConfidence(name: string, position: string, email?: string, linkedin?: string): number {
    let confidence = 0.5; // Base confidence
    
    // Name quality
    if (name.split(' ').length >= 2) confidence += 0.2;
    
    // Position quality
    if (position.length > 5) confidence += 0.1;
    
    // Contact information
    if (email) confidence += 0.1;
    if (linkedin) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Remove duplicate decision makers
   */
  private static deduplicateDecisionMakers(decisionMakers: DecisionMaker[]): DecisionMaker[] {
    const seen = new Set<string>();
    return decisionMakers.filter(dm => {
      const key = `${dm.name.toLowerCase()}-${dm.company.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Format decision makers for display
   */
  public static formatDecisionMakers(companies: CompanyDecisionMakers[]): string {
    if (companies.length === 0) {
      return 'No decision makers found in the research results.';
    }

    let output = '# Decision Makers & Key Contacts\n\n';
    
    for (const company of companies) {
      output += `## ${company.company}\n`;
      
      if (company.website) output += `**Website:** ${company.website}\n`;
      if (company.industry) output += `**Industry:** ${company.industry}\n`;
      if (company.totalEmployees) output += `**Employees:** ${company.totalEmployees.toLocaleString()}\n`;
      if (company.revenue) output += `**Revenue:** $${company.revenue}\n`;
      if (company.headquarters) output += `**Location:** ${company.headquarters}\n`;
      
      output += '\n### Key Decision Makers:\n\n';
      
      if (company.decisionMakers.length === 0) {
        output += '*No specific decision makers identified in this research.*\n\n';
        continue;
      }
      
      for (const dm of company.decisionMakers) {
        const maskedName = maskDecisionMakerName(dm.name);
        output += `**${maskedName}** - ${dm.position}\n`;
        output += `- **Company:** ${dm.company}\n`;
        output += `- **Seniority:** ${dm.seniority}\n`;
        output += `- **Decision Influence:** ${dm.decisionInfluence}\n`;
        output += `- **Confidence:** ${Math.round(dm.confidence * 100)}%\n`;
        
        if (dm.email) output += `- **Email:** ${dm.email}\n`;
        if (dm.linkedin) output += `- **LinkedIn:** ${dm.linkedin}\n`;
        if (dm.phone) output += `- **Phone:** ${dm.phone}\n`;
        
        output += '\n';
      }
    }
    
    return output;
  }
}
