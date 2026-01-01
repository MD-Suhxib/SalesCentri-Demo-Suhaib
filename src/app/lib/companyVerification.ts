/**
 * Company Verification Pipeline
 * Verifies companies exist and are legitimate before including in research results
 */

import { WebSearchService } from './langchain/webSearch';
import { progressEmitter } from './progressEmitter';

export interface CompanyVerificationResult {
  isValid: boolean;
  companyName: string;
  website: string;
  verificationSource: string;
  confidence: number;
  reason?: string;
}

export class CompanyVerificationPipeline {
  private webSearchService: WebSearchService;

  constructor() {
    this.webSearchService = new WebSearchService();
  }

  /**
   * Verify a single company exists and is legitimate
   */
  async verifyCompany(companyName: string, website?: string): Promise<CompanyVerificationResult> {
    try {
      progressEmitter.emitLog(`🔍 VERIFYING: Checking ${companyName}...`);

      // If no website provided, search for the company
      let companyWebsite = website;
      if (!companyWebsite) {
        const searchResults = await this.webSearchService.search(`${companyName} official website`, 3);
        if (searchResults.length > 0) {
          companyWebsite = searchResults[0].url;
        }
      }

      if (!companyWebsite) {
        return {
          isValid: false,
          companyName,
          website: '',
          verificationSource: 'No website found',
          confidence: 0,
          reason: 'No official website found for this company'
        };
      }

      // Verify the website is accessible and legitimate
      const websiteVerification = await this.verifyWebsite(companyWebsite);
      if (!websiteVerification.isValid) {
        return {
          isValid: false,
          companyName,
          website: companyWebsite,
          verificationSource: 'Website verification failed',
          confidence: 0,
          reason: websiteVerification.error || 'Website is not accessible or legitimate'
        };
      }

      // Search for additional verification sources
      const verificationSources = await this.findVerificationSources(companyName, companyWebsite);
      
      // Calculate confidence score
      const confidence = this.calculateConfidenceScore(verificationSources, websiteVerification);

      if (confidence < 0.6) {
        return {
          isValid: false,
          companyName,
          website: companyWebsite,
          verificationSource: 'Insufficient verification',
          confidence,
          reason: 'Company could not be sufficiently verified through multiple sources'
        };
      }

      progressEmitter.emitLog(`✅ VERIFIED: ${companyName} - ${verificationSources.length} sources found`);

      return {
        isValid: true,
        companyName,
        website: companyWebsite,
        verificationSource: verificationSources.join(', '),
        confidence,
        reason: 'Company verified through multiple sources'
      };

    } catch (error) {
      console.error('Company verification error:', error);
      return {
        isValid: false,
        companyName,
        website: website || '',
        verificationSource: 'Verification error',
        confidence: 0,
        reason: 'Error occurred during verification process'
      };
    }
  }

  /**
   * Verify multiple companies and return only valid ones
   */
  async verifyCompanies(companies: Array<{name: string, website?: string}>): Promise<CompanyVerificationResult[]> {
    const verificationPromises = companies.map(company => 
      this.verifyCompany(company.name, company.website)
    );

    const results = await Promise.all(verificationPromises);
    const validCompanies = results.filter(result => result.isValid);
    
    progressEmitter.emitLog(`📊 VERIFICATION COMPLETE: ${validCompanies.length}/${results.length} companies verified`);

    return validCompanies;
  }

  /**
   * Verify a website is accessible and legitimate
   */
  private async verifyWebsite(url: string): Promise<{isValid: boolean, error?: string}> {
    try {
      // Basic URL validation
      if (!url || !url.startsWith('http')) {
        return { isValid: false, error: 'Invalid URL format' };
      }

      // Check for known invalid domains
      const invalidPatterns = [
        'godaddy.com',
        'example.com',
        'test.com',
        'placeholder.com',
        'localhost',
        '127.0.0.1',
        'domain.com',
        'site.com'
      ];

      const urlLower = url.toLowerCase();
      if (invalidPatterns.some(pattern => urlLower.includes(pattern))) {
        return { isValid: false, error: 'Invalid or placeholder domain' };
      }

      // Try to fetch the website (with timeout)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; CompanyVerification/1.0)'
          }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return { isValid: true };
        } else {
          return { isValid: false, error: `HTTP ${response.status}` };
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        return { isValid: false, error: 'Website not accessible' };
      }

    } catch (error) {
      return { isValid: false, error: 'Verification failed' };
    }
  }

  /**
   * Find additional verification sources for a company
   */
  private async findVerificationSources(companyName: string, website: string): Promise<string[]> {
    const sources: string[] = [];

    try {
      // Search for LinkedIn company page
      const linkedinResults = await this.webSearchService.search(`${companyName} LinkedIn company`, 2);
      if (linkedinResults.some(result => result.url.includes('linkedin.com/company'))) {
        sources.push('LinkedIn');
      }

      // Search for business directory listings
      const directoryResults = await this.webSearchService.search(`${companyName} business directory`, 2);
      if (directoryResults.length > 0) {
        sources.push('Business Directory');
      }

      // Search for news mentions
      const newsResults = await this.webSearchService.search(`${companyName} news recent`, 2);
      if (newsResults.length > 0) {
        sources.push('News Sources');
      }

      // Search for official website content
      const websiteResults = await this.webSearchService.search(`site:${new URL(website).hostname} ${companyName}`, 2);
      if (websiteResults.length > 0) {
        sources.push('Official Website');
      }

    } catch (error) {
      console.error('Error finding verification sources:', error);
    }

    return sources;
  }

  /**
   * Calculate confidence score based on verification sources
   */
  private calculateConfidenceScore(sources: string[], websiteVerification: {isValid: boolean}): number {
    let score = 0;

    // Base score for valid website
    if (websiteVerification.isValid) {
      score += 0.4;
    }

    // Additional points for each verification source
    if (sources.includes('LinkedIn')) score += 0.2;
    if (sources.includes('Business Directory')) score += 0.15;
    if (sources.includes('News Sources')) score += 0.15;
    if (sources.includes('Official Website')) score += 0.1;

    return Math.min(score, 1.0);
  }

  /**
   * Extract companies from text and verify them
   */
  async extractAndVerifyCompanies(text: string): Promise<CompanyVerificationResult[]> {
    // Simple regex to extract company names and websites from text
    const companyMatches = text.match(/\| ([^|]+) \| ([^|]+) \|/g);
    
    if (!companyMatches) {
      return [];
    }

    const companies = companyMatches.map(match => {
      const parts = match.split('|').map(part => part.trim());
      return {
        name: parts[1] || '',
        website: parts[2] || ''
      };
    }).filter(company => company.name && company.name !== 'Company Name');

    return await this.verifyCompanies(companies);
  }
}

// Export singleton instance
export const companyVerificationPipeline = new CompanyVerificationPipeline();
