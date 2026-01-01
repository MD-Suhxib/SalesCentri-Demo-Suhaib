/**
 * Enhanced GPT-4o Integration with Tavily Web Search
 */

import { callGPT4o } from './openaiApi';
import { WebSearchService, SearchResult } from './langchain/webSearch';
import { progressEmitter } from './progressEmitter';
import { analyzeBusinessContext, createValuePropositionMappings } from './businessContextAnalyzer';
import { validateLeads } from './leadValidation';
import { formatForCRM } from './crmOutputFormatter';
import { companyVerificationPipeline } from './companyVerification';
import { DecisionMakerExtractor } from './decisionMakerExtractor';
import { ContactDiscoveryService } from './contactDiscoveryService';

// Initialize web search service
const webSearchService = new WebSearchService();

/**
 * Calls GPT-4o with web search enhancement using Tavily
 * 
 * @param prompt - The research prompt to send to GPT-4o
 * @param systemPrompt - Optional system prompt for context
 * @param searchDepth - Number of search results to include (default: 5)
 * @returns The response text from GPT-4o enhanced with web search
 */
export async function callEnhancedGPT4o(
  prompt: string,
  systemPrompt: string = 'You are an advanced business intelligence specialist providing comprehensive lead generation and market analysis with extensive prospect research capabilities.',
  searchDepth: number = 10,  // Increased depth for more comprehensive results
  request?: any  // Optional request object for bulk upload data
): Promise<string> {
  // Log the start of enhanced processing
  progressEmitter.emitLog('🚀 ENHANCED GPT-4O: Starting research with Tavily web search augmentation');
  
  // Extract primary research topic and company categories
  const companyNameMatch = prompt.match(/(?:company|business|organization|firm|corporation|enterprise)\s+(?:called|named)?\s*["|']?([^"',.]+)["|']?/i) ||
                          prompt.match(/research\s+(?:on|about)?\s+["|']?([^"',.]+)["|']?/i);
  
  // Extract industry or market from the prompt
  const industryMatch = prompt.match(/(?:industry|market|sector|field|niche)\s+(?:of|for|in)?\s*["|']?([^"',.]+)["|']?/i);
  
  // Extract website URL for product-specific searches
  const websiteMatch = prompt.match(/(?:website|analyze|analyzing)\s*:?\s*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  
  // Build a more comprehensive search query
  const primaryTopic = companyNameMatch ? companyNameMatch[1] : prompt.substring(0, 100);
  const industry = industryMatch ? industryMatch[1] : '';
  const website = websiteMatch ? websiteMatch[1] : '';
  
  // Create contextual search queries based on research type
  let searchQueries: string[] = [];
  
  // Check if this is bulk upload data
  const isBulkUpload = request?.excel_data && request.excel_data.length > 0;
  
  if (systemPrompt.includes('Sales Lead Generation Specialist') || prompt.includes('sales opportunities')) {
    if (isBulkUpload) {
      // Generate search queries for each company in bulk upload
      const companies = request.excel_data.slice(0, 5); // Limit to first 5 for search queries
      searchQueries = companies.flatMap((company: any, index: number) => {
        const companyName = typeof company === 'string' ? company.substring(0, 30) : JSON.stringify(company).substring(0, 30);
        return [
          `companies that would buy from ${companyName}`,
          `${companyName} potential customers and prospects`,
          `businesses that need ${companyName} services`,
          `${companyName} target market and ideal customers`
        ];
      });
    } else if (website) {
      // Product-specific search queries for sales opportunities
      searchQueries = [
        `companies expanding sales teams ${industry.substring(0, 30)}`,
        `businesses investing in ${primaryTopic.substring(0, 40)} solutions`,
        `${industry.substring(0, 30)} companies hiring sales professionals`,
        `growing companies ${industry.substring(0, 30)} market expansion`
      ];
    } else {
      searchQueries = [
        `${primaryTopic.substring(0, 50)} companies prospects`,
        `${industry.substring(0, 30)} industry leaders manufacturers`,
        `${primaryTopic.substring(0, 40)} target clients customers`,
        `business directory ${industry.substring(0, 30)} companies`
      ];
    }
  } else {
    // General research queries
    searchQueries = [
      `${primaryTopic.substring(0, 50)} companies prospects`,
      `${industry.substring(0, 30)} industry leaders manufacturers`,
      `${primaryTopic.substring(0, 40)} target clients customers`,
      `business directory ${industry.substring(0, 30)} companies`
    ];
  }
  
  searchQueries = searchQueries.filter(query => query.length < 400);
  
  progressEmitter.emitLog(`🔍 SEARCH QUERIES: Generated ${searchQueries.length} specialized search queries for comprehensive research`);
  
  // Analyze business context if this is a sales opportunities request
  let businessContext = null;
  let valuePropositionMappings = [];
  
  if (systemPrompt.includes('Sales Lead Generation Specialist') && website) {
    try {
      progressEmitter.emitLog('🏢 BUSINESS CONTEXT: Analyzing company website for value propositions');
      businessContext = await analyzeBusinessContext(website);
      valuePropositionMappings = createValuePropositionMappings(businessContext);
      progressEmitter.emitLog(`✅ BUSINESS CONTEXT: Extracted ${businessContext.products.length} products and ${businessContext.valuePropositions.length} value propositions`);
    } catch (error) {
      console.error('Error analyzing business context:', error);
      progressEmitter.emitLog('⚠️ BUSINESS CONTEXT: Failed to analyze website, proceeding without context');
    }
  }
  
  try {
    // Check if web search is allowed by quota limits
    const { forceAllowSearch, recordSearchUsage, getSearchUsage } = await import('./searchUsageControl');
    
    // Debug logging for quota system
    const canSearch = forceAllowSearch();
    const usageData = getSearchUsage();
    progressEmitter.emitLog(`🔍 QUOTA CHECK: Can search: ${canSearch}, Count: ${usageData.count}/${usageData.quota}`);
    
    if (!canSearch) {
      progressEmitter.emitLog('⚠️ SEARCH QUOTA EXCEEDED: Daily search limit reached, using standard GPT-4o');
      console.error('🚨 GPT-4O FALLBACK: Search quota exceeded - GPT-4o will return fake data without web search');
      console.error('🔧 SOLUTION: Reset search quota or add TAVILY_API_KEY to get real company data');
      return callGPT4o(prompt, systemPrompt);
    }
    
    // Emit special event for Tavily web search enhancement
    progressEmitter.emitLog('🔎 TAVILY SEARCH: Enhancing GPT-4o with real-time web information from multiple queries');
    
    // Record usage before performing the search
    const remainingSearches = recordSearchUsage();
    progressEmitter.emitLog(`📊 SEARCH QUOTA: ${remainingSearches} searches remaining today`);
    
    // Run multiple specialized searches to gather comprehensive data
    let allSearchResults: SearchResult[] = [];
    
    // Perform primary search first
    const primaryQuery = searchQueries[0];
    progressEmitter.emitLog(`🔍 PRIMARY SEARCH: "${primaryQuery}"`);
    const primaryResults = await webSearchService.search(primaryQuery, Math.ceil(searchDepth * 0.4));
    allSearchResults = [...primaryResults];
    
    // If we have quota and time, run secondary searches for more comprehensive coverage
    if (primaryResults.length > 0 && searchQueries.length > 1) {
      progressEmitter.emitLog(`🔍 RUNNING SUPPLEMENTARY SEARCHES for additional prospect data...`);
      
      // Run supplementary searches with remaining queries to find more leads and prospects
      const secondaryDepthPerQuery = Math.ceil((searchDepth * 0.6) / (searchQueries.length - 1));
      
      for (let i = 1; i < searchQueries.length; i++) {
        const query = searchQueries[i];
        progressEmitter.emitLog(`🔍 SUPPLEMENTARY SEARCH ${i}: "${query}"`);
        const results = await webSearchService.search(query, secondaryDepthPerQuery);
        allSearchResults = [...allSearchResults, ...results];
      }
    }
    
    // Handle case with no results
    if (allSearchResults.length === 0) {
      progressEmitter.emitLog('⚠️ SEARCH RESULTS: No relevant information found, using standard GPT-4o');
      return callGPT4o(prompt, systemPrompt);
    }
    
    // Remove duplicate results
    const uniqueResults = Array.from(
      new Map(allSearchResults.map(result => [result.url, result])).values()
    );
    
    // Emit information about search success
    progressEmitter.emitLog(`✅ TAVILY RESULTS: Found ${uniqueResults.length} relevant sources from ${searchQueries.length} different search queries`);
    
    // Format search results for inclusion in the prompt
    const formattedResults = formatSearchResultsForPrompt(uniqueResults);
    
    // Create enhanced system prompt with search context
    const enhancedSystemPrompt = `${systemPrompt}
    
You have access to recent web search results about this topic. Use this information to provide the most accurate and up-to-date comprehensive business analysis possible, especially for generating extensive lists of qualified business prospects with detailed business intelligence. Here are the web search results:

${formattedResults}

CRITICAL OUTPUT REQUIREMENTS:
- Generate MINIMUM 15-20 qualified business prospects per industry category
- Provide COMPREHENSIVE business profiles for each prospect (3-4 sentences minimum)
- Include detailed business intelligence: industry classification, services, market position, recent developments
- Organize prospects by industry segments and company size categories  
- Include actionable business insights for sales strategy and lead qualification
- Focus on companies with strong business websites and established market presence
- Provide strategic context and market analysis for each prospect category

STRICT DATA VERIFICATION REQUIREMENTS:
- DO NOT invent, fabricate, or hallucinate any decision maker names, emails, or phone numbers
- ONLY include information that can be verified directly from trusted sources (official company website, LinkedIn company page, annual reports, or Tavily search results)
- If a decision maker name or contact detail cannot be confirmed, leave the cell blank or mark as "Not Verified"
- Sources (LinkedIn, company website, etc.) should be listed only in the Verification column
- Do not create extra "Discovered Contacts", "Key Decision Makers", or external notes outside the table
- The goal is clean, fact-checked tables without any hallucinated data

Incorporate these search results into your response when relevant, but maintain a focus on comprehensive lead generation and detailed business intelligence analysis. For each company category, provide EXTENSIVE qualified prospect lists with detailed information including:
1. Full company name and website URL
2. Comprehensive company description and business focus (3-4 sentences)
3. Industry classification and market positioning
4. Company size indicators and growth stage
5. Specific business intelligence and recent developments
6. Strategic fit analysis and business development opportunities
7. Technology stack and digital presence assessment
8. Market context and competitive positioning

Cite specific sources when referring to information from these search results. IMPORTANT: Do not mention that you're using search results in your response - just incorporate the information naturally. Organize the prospects into logical industry subcategories and provide comprehensive market intelligence that enables effective sales strategy development.`;
    
    progressEmitter.emitLog('🧠 ENHANCED CONTEXT: Added web search results to GPT-4o prompt');
    
    // Call GPT-4o with enhanced prompt
    const response = await callGPT4o(prompt, enhancedSystemPrompt);
    
    // Background company verification (don't show in output)
    try {
      progressEmitter.emitLog('🔍 BACKGROUND VERIFICATION: Verifying companies in background...');
      const verificationResults = await companyVerificationPipeline.extractAndVerifyCompanies(response);
      const validCompanies = verificationResults.filter(result => result.isValid);
      progressEmitter.emitLog(`✅ BACKGROUND VERIFICATION: ${validCompanies.length} companies verified in background`);
    } catch (error) {
      console.error('Background verification error:', error);
      // Don't fail the main request if verification fails
    }
    
    // Note: Decision maker extraction removed to ensure clean, fact-checked tables only
    // All contact information should be verified and included directly in the main response tables
    
    // If this is a sales opportunities request, validate and format leads
    if (systemPrompt.includes('Sales Lead Generation Specialist') && response.includes('<table')) {
      try {
        progressEmitter.emitLog('🔍 LEAD VALIDATION: Validating generated leads for quality');
        
        // Extract leads from the response (this would need more sophisticated parsing in production)
        const leads = extractLeadsFromResponse(response);
        
        if (leads.length > 0) {
          // Validate leads
          const validationResult = await validateLeads(leads);
          
          // Format for CRM if validation passed
          if (validationResult.validLeads.length > 0) {
            const crmLeads = formatForCRM(validationResult.validLeads, {
              format: 'html',
              includeContactInfo: true,
              includeNotes: true,
              includeScoring: true
            });
            
            progressEmitter.emitLog(`✅ LEAD VALIDATION: ${validationResult.validLeads.length} valid leads, ${validationResult.invalidLeads.length} invalid leads`);
            
            // Return validated and formatted response
            return crmLeads.length > 0 ? formatLeadsAsTable(crmLeads) : response;
          }
        }
      } catch (error) {
        console.error('Error validating leads:', error);
        progressEmitter.emitLog('⚠️ LEAD VALIDATION: Failed to validate leads, returning original response');
      }
    }
    
    return response;
    
  } catch (error) {
    // If web search fails, fall back to standard GPT-4o
    progressEmitter.emitLog(`⚠️ WEB SEARCH ERROR: ${error}. Falling back to standard GPT-4o`);
    console.error('Error in enhanced GPT-4o:', error);
    return callGPT4o(prompt, systemPrompt);
  }
}

/**
 * Formats search results into a prompt-friendly format
 */
function formatSearchResultsForPrompt(results: SearchResult[]): string {
  return results.map((result, index) => {
    return `[SOURCE ${index + 1}] ${result.title || 'Untitled Source'}
URL: ${result.url}
${result.content || result.snippet || 'No content available'}
---------------------`;
  }).join('\n\n');
}

/**
 * Extract leads from GPT-4o response (simplified implementation)
 */
function extractLeadsFromResponse(response: string): Array<{
  company: string;
  website: string;
  industry: string;
  decisionMaker: string;
  decisionMakerRole: string;
  opportunityFit: string;
  score: number;
  nextStep: string;
}> {
  // This is a simplified implementation
  // In production, you would need more sophisticated HTML table parsing
  const leads: Array<{
    company: string;
    website: string;
    industry: string;
    decisionMaker: string;
    decisionMakerRole: string;
    opportunityFit: string;
    score: number;
    nextStep: string;
  }> = [];

  // Basic regex to extract table rows (this would need to be more robust)
  const tableRowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
  const cellRegex = /<td[^>]*>(.*?)<\/td>/gs;
  
  const rows = response.match(tableRowRegex);
  if (rows) {
    for (const row of rows.slice(1)) { // Skip header row
      const cells = row.match(cellRegex);
      if (cells && cells.length >= 8) {
        const lead = {
          company: cells[0].replace(/<[^>]*>/g, '').trim(),
          website: cells[1].replace(/<[^>]*>/g, '').trim(),
          industry: cells[2].replace(/<[^>]*>/g, '').trim(),
          decisionMaker: cells[3].replace(/<[^>]*>/g, '').trim(),
          decisionMakerRole: cells[4].replace(/<[^>]*>/g, '').trim(),
          opportunityFit: cells[5].replace(/<[^>]*>/g, '').trim(),
          score: parseInt(cells[6].replace(/<[^>]*>/g, '').trim()) || 5,
          nextStep: cells[7].replace(/<[^>]*>/g, '').trim()
        };
        
        if (lead.company && lead.website) {
          leads.push(lead);
        }
      }
    }
  }

  return leads;
}

/**
 * Format CRM leads as CSS Grid
 */
function formatLeadsAsTable(crmLeads: any[]): string {
  const gridRows = crmLeads.map(lead => `
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 150px; display: flex; align-items: flex-start;">${lead.company || 'Not Available'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 120px; display: flex; align-items: flex-start;"><a href="${lead.website}" target="_blank" style="word-break: break-all; overflow-wrap: break-word;">${lead.website || 'Not Available'}</a></div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 120px; display: flex; align-items: flex-start;">${lead.industry || 'Not Available'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 80px; display: flex; align-items: flex-start;">${lead.employees || 'Not Available'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 100px; display: flex; align-items: flex-start;">${lead.revenueRange || 'Not Available'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 120px; display: flex; align-items: flex-start;">${lead.decisionMaker || 'Not Verified'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 100px; display: flex; align-items: flex-start;">${lead.decisionMakerRole || 'Not Verified'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 150px; display: flex; align-items: flex-start;">${lead.painPoints || 'Not Available'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 80px; display: flex; align-items: flex-start;">${lead.qualificationScore || 'N/A'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 80px; display: flex; align-items: flex-start;">${lead.priority || 'N/A'}</div>
    <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; vertical-align: top; min-width: 120px; display: flex; align-items: flex-start;">${lead.verification || 'Not Verified'}</div>
  `).join('');

  return `
    <div style="width: 100%; margin: 20px 0; word-break: normal; overflow-wrap: break-word; min-width: 1000px; overflow-x: auto;">
      <div style="display: grid; grid-template-columns: 150px 120px 120px 80px 100px 120px 100px 150px 80px 80px 120px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <!-- Header Row -->
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 150px; background-color: #f2f2f2; display: flex; align-items: center;">Company Name</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 120px; background-color: #f2f2f2; display: flex; align-items: center;">Website</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 120px; background-color: #f2f2f2; display: flex; align-items: center;">Industry</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 80px; background-color: #f2f2f2; display: flex; align-items: center;">Employees</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 100px; background-color: #f2f2f2; display: flex; align-items: center;">Revenue Range</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 120px; background-color: #f2f2f2; display: flex; align-items: center;">Decision Maker</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 100px; background-color: #f2f2f2; display: flex; align-items: center;">Title</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 150px; background-color: #f2f2f2; display: flex; align-items: center;">Pain Points</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 80px; background-color: #f2f2f2; display: flex; align-items: center;">Qualification Score</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 80px; background-color: #f2f2f2; display: flex; align-items: center;">Priority</div>
        <div style="border: 1px solid #ddd; padding: 12px 8px; text-align: left; font-weight: 600; word-break: normal; overflow-wrap: break-word; hyphens: none; white-space: normal; min-width: 120px; background-color: #f2f2f2; display: flex; align-items: center;">Verification</div>
        
        <!-- Data Rows -->
        ${gridRows}
      </div>
    </div>
  `;
}
