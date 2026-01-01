// Lead generation and profile creation functions

import { ResearchRequest, LeadProfile } from './types';
import { runGemini } from '../../api/gemini/geminiHandler';
import { callPerplexityWithRetry } from '../perplexityApi';
import { analyzeBusinessContext } from '../businessContextAnalyzer';

export async function generateLeadProfile(request: ResearchRequest): Promise<LeadProfile> {
  // Use the user's query as the primary source, fallback to website_url
  const query = request.query || request.website_url || 'the company';
  const website = request.website_url || query;
  
  // Analyze business context first
  let businessContext = null;
  if (request.website_url) {
    try {
      businessContext = await analyzeBusinessContext(request.website_url);
    } catch (error) {
      console.error('Error analyzing business context:', error);
    }
  }

  // Create lead profile generation prompt
  const leadProfilePrompt = `You are a Sales Lead Generation Specialist. Your task is to create an ideal lead profile based on the user's research query: "${query}".

🎯 COMPANY ANALYSIS (MANDATORY FIRST STEP):
1. Analyze the user's query "${query}" to extract:
   - Products/services offered
   - Target customers (industry, size, geography)
   - Typical use cases and value propositions
   - Competitive advantages

2. Create ideal customer profile based on their offerings

${businessContext ? `
BUSINESS CONTEXT ANALYSIS:
- Company: ${businessContext.companyName}
- Industry: ${businessContext.industry}
- Products: ${businessContext.products.join(', ')}
- Services: ${businessContext.services.join(', ')}
- Value Propositions: ${businessContext.valuePropositions.join(', ')}
- Target Customers: ${businessContext.targetCustomers.join(', ')}
- Use Cases: ${businessContext.useCases.join(', ')}
- Competitive Advantages: ${businessContext.competitiveAdvantages.join(', ')}
` : ''}

OUTPUT FORMAT (JSON):
{
  "companyName": "Company Name",
  "website": "${website}",
  "products": ["Product 1", "Product 2"],
  "services": ["Service 1", "Service 2"],
  "targetCustomers": ["Target Customer 1", "Target Customer 2"],
  "valuePropositions": ["Value Prop 1", "Value Prop 2"],
  "useCases": ["Use Case 1", "Use Case 2"],
  "competitiveAdvantages": ["Advantage 1", "Advantage 2"],
  "industry": "Industry Name",
  "companySize": "small|medium|large|unknown",
  "businessModel": "SaaS|Consulting|Agency|B2B",
  "idealCustomerProfile": {
    "industryFocus": ["Industry 1", "Industry 2"],
    "companySize": ["1-50", "51-500", "500+"],
    "revenueRange": ["$0-10M", "$10M-100M", "$100M+"],
    "geographicFocus": ["${request.geographic_scope || 'Global'}"],
    "decisionMakerTitles": ["CEO", "VP Sales", "Director", "Manager"],
    "painPoints": ["Pain Point 1", "Pain Point 2"],
    "solutionFitCriteria": ["Criteria 1", "Criteria 2"],
    "competitiveAdvantages": ["Advantage 1", "Advantage 2"]
  }
}

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no additional text.`;

  try {
    // Use GPT-4O for lead profile generation (most reliable for structured output)
    const { callEnhancedGPT4o } = await import('../enhancedGPT4o');
    const response = await callEnhancedGPT4o(leadProfilePrompt, 'You are a Sales Lead Generation Specialist creating ideal customer profiles.');
    
    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const leadProfile = JSON.parse(jsonMatch[0]);
      console.log('✅ LEAD PROFILE GENERATED:', leadProfile);
      return leadProfile;
    } else {
      throw new Error('No valid JSON found in response');
    }
  } catch (error) {
    console.error('Error generating lead profile:', error);
    
    // Fallback to basic lead profile
    return {
      companyName: businessContext?.companyName || 'Unknown Company',
      website: website,
      products: businessContext?.products || ['Products/Services'],
      services: businessContext?.services || [],
      targetCustomers: businessContext?.targetCustomers || ['Target Customers'],
      valuePropositions: businessContext?.valuePropositions || ['Value Propositions'],
      useCases: businessContext?.useCases || ['Use Cases'],
      competitiveAdvantages: businessContext?.competitiveAdvantages || ['Competitive Advantages'],
      industry: businessContext?.industry || 'general',
      companySize: businessContext?.companySize || 'unknown',
      businessModel: businessContext?.businessModel || 'B2B',
      idealCustomerProfile: {
        industryFocus: ['Technology', 'Manufacturing', 'Services'],
        companySize: ['1-50', '51-500', '500+'],
        revenueRange: ['$0-10M', '$10M-100M', '$100M+'],
        geographicFocus: [request.geographic_scope || 'Global'],
        decisionMakerTitles: ['CEO', 'VP Sales', 'Director', 'Manager'],
        painPoints: ['Operational inefficiencies', 'Growth challenges', 'Cost optimization'],
        solutionFitCriteria: ['Budget availability', 'Authority to decide', 'Urgent need'],
        competitiveAdvantages: ['Proven expertise', 'Customized solutions', 'Reliable delivery']
      }
    };
  }
}

export async function generateLeadsWithProfile(
  request: ResearchRequest,
  leadProfile: LeadProfile,
  model: 'gpt4o' | 'gemini' | 'perplexity' | 'claude' | 'llama' | 'grok'
): Promise<string> {
  const leadGenerationPrompt = `You are a Sales Lead Generation Specialist analyzing the user's research query: "${request.query}".

IDEAL LEAD PROFILE (USE THIS TO GENERATE LEADS):
- Company: ${leadProfile.companyName} (${leadProfile.website})
- Industry: ${leadProfile.industry}
- Products: ${leadProfile.products.join(', ')}
- Services: ${leadProfile.services.join(', ')}
- Value Propositions: ${leadProfile.valuePropositions.join(', ')}
- Target Customers: ${leadProfile.targetCustomers.join(', ')}
- Use Cases: ${leadProfile.useCases.join(', ')}
- Competitive Advantages: ${leadProfile.competitiveAdvantages.join(', ')}

IDEAL CUSTOMER PROFILE:
- Industry Focus: ${leadProfile.idealCustomerProfile.industryFocus.join(', ')}
- Company Size: ${leadProfile.idealCustomerProfile.companySize.join(', ')}
- Revenue Range: ${leadProfile.idealCustomerProfile.revenueRange.join(', ')}
- Geographic Focus: ${leadProfile.idealCustomerProfile.geographicFocus.join(', ')}
- Decision Maker Titles: ${leadProfile.idealCustomerProfile.decisionMakerTitles.join(', ')}
- Pain Points: ${leadProfile.idealCustomerProfile.painPoints.join(', ')}
- Solution Fit Criteria: ${leadProfile.idealCustomerProfile.solutionFitCriteria.join(', ')}
- Competitive Advantages: ${leadProfile.idealCustomerProfile.competitiveAdvantages.join(', ')}

🎯 LEAD GENERATION REQUIREMENTS:
- Generate exactly 30-40 high-quality sales opportunities across multiple segments
- Each lead must explain how they can use/buy products/services related to "${request.query}"
- Include BANT qualification + lead scoring (1-10)
- Focus on real, active companies with verified websites
- NO domains for sale, NO placeholder websites, NO generic domains

User Query: "${request.query}"
Company Size: ${request.company_size}
Revenue Category: ${request.revenue_category}
Geographic Scope: ${request.geographic_scope}

WEBSITE VALIDATION REQUIREMENTS:
- ALL websites must be real, active business websites with actual content
- NO GoDaddy parked domains or placeholder pages
- NO generic domains like example.com, test.com, placeholder.com
- NO domains that redirect to hosting providers or domain registrars
- ONLY include companies with professional, operational websites
- Verify each website shows actual business content, not parked pages
- NO domains for sale or under construction

OUTPUT FORMAT - STANDARDIZED TABLES:
Generate multiple segmented tables with the following UNIFIED structure:

# Sales Opportunities Analysis

## **HIGH-PRIORITY PROSPECTS (Large Companies)**
### **TABLE 1: Enterprise-Level Opportunities**

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| Company 1 | https://company1.com | Technology | Enterprise Software | CRM Solutions | Customer Management | 1000+ | $100M+ | USA | John S***** | VP Sales | Growth challenges | Enterprise sales focus |

## **MEDIUM-PRIORITY PROSPECTS (Mid-Market)**
### **TABLE 2: Mid-Market Opportunities**

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| Company 2 | https://company2.com | Manufacturing | Industrial Equipment | Automation Tools | Process Optimization | 200-500 | $10M-50M | USA | Sarah M***** | Director | Operational efficiency | Mid-market approach |

## **EMERGING PROSPECTS (Small Companies)**
### **TABLE 3: Small Business Opportunities**

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| Company 3 | https://company3.com | Services | Business Consulting | Advisory Services | Strategic Planning | 50-200 | $1M-10M | USA | Mike J***** | Manager | Cost optimization | Small business focus |

## **INDUSTRY-SPECIFIC SEGMENTS**

### **Technology Sector Prospects**
[Similar table format with 13 columns for tech companies]

### **Manufacturing Sector Prospects**  
[Similar table format with 13 columns for manufacturing companies]

### **Services Sector Prospects**
[Similar table format with 13 columns for service companies]

STANDARDIZED COLUMN SPECIFICATIONS (13 COLUMNS TOTAL - NO EXCEPTIONS):
- Company Name: Real company name
- Website: Full URL (must be active, professional website)
- Industry: Specific industry sector
- Sub-Industry: Detailed industry subcategory
- Product Line: Main products or services offered
- Use Case: How they would use your solution
- Employees: Company size range
- Revenue: Revenue category
- Location: Geographic location
- Key Decision Maker: First name + ***** (for privacy)
- Designation: Job title (e.g., VP Sales, CMO, CEO)
- Pain Points: Specific pain points they face
- Approach Strategy: Recommended sales approach

🚨 CRITICAL: DO NOT ADD EXTRA COLUMNS like "Verification Evidence", "Urgency", "Contact Info", "LinkedIn", or any other columns. Use EXACTLY these 13 columns only.

🚨 ABSOLUTELY NO "Verification Evidence" COLUMN: Do not create a separate "Verification Evidence" column. If you need to include verification information, integrate it into the existing columns (e.g., mention verification sources in the "Pain Points" or "Approach Strategy" columns).

QUALITY RULES:
- Only include real companies with active websites
- Each Opportunity Fit must be specific to the user's query: "${request.query}"
- Decision makers must be realistic for the company size/industry
- Scores must reflect actual qualification (budget, authority, need, timeline)
- Generate 30-40 leads total across all segments
- Distribute leads across different company sizes and industries

🚨 CRITICAL DECISION MAKER VERIFICATION PROTOCOL 🚨
- ALL decision maker information MUST be VERIFIED from official company websites (leadership/team/about pages)
- MANDATORY: Use Google Search to verify each company's actual leadership team before generating decision makers
- Search pattern: "[Company Name] leadership team" OR "[Company Name] executives" OR "[Company Name] about us team"
- If decision maker is found on official website -> Use verified information with "✅ Verified from [URL]"
- If decision maker is NOT found on official website -> Mark as "⚠️ This information may be outdated - could not verify from official company website"
- NEVER invent, assume, or guess executive names or titles
- If you cannot find a specific executive name, use "Contact [Department]" (e.g., "Contact Sales", "Contact Marketing")
- NEVER create fictional executive names like "John Smith", "Sarah Johnson", "Mike Chen", etc.
- Decision makers will be automatically verified after generation - focus on finding real, verifiable information
- Include source URL where you found the decision maker information
- FOR EACH COMPANY: Perform a separate Google Search to find their actual leadership team
- Use the search results to identify real executives with their actual titles
- Cross-reference multiple sources (company website, LinkedIn, press releases) for accuracy

OUTPUT FORMAT:
- Markdown format with headers and tables
- No summary or recommendations section
- Focus on companies that would genuinely benefit from products/services related to "${request.query}"
- Each table should have 8-12 leads

VALIDATION:
- Verify all websites are real and active
- Ensure opportunity fits are specific to the user's query: "${request.query}"
- Check that decision maker roles are appropriate for company size
- Verify decision maker names are real and position-appropriate
- Confirm scores reflect actual sales qualification
- Include verification status for each lead (e.g., "Verified via LinkedIn", "Verified via company website")
- Cross-reference decision maker information with company size and industry standards`;

  try {
    let rawResponse: string;
    switch (model) {
      case 'gpt4o': {
        const { callEnhancedGPT4o } = await import('../enhancedGPT4o');
        rawResponse = await callEnhancedGPT4o(leadGenerationPrompt, 'You are a Sales Lead Generation Specialist providing high-quality sales opportunities.');
        break;
      }
      case 'gemini': {
        // Special prompt for Gemini to only generate tables without extra content
        const geminiPrompt = `${leadGenerationPrompt}

🚨 CRITICAL GEMINI INSTRUCTIONS 🚨
- Generate ONLY the segmented tables as shown in the format above
- NO introductory text, NO explanations, NO additional content
- Start immediately with "# Sales Opportunities Analysis"
- Follow the EXACT table format with 13 STANDARDIZED columns: Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy
- NO extra columns, NO Contact Info, LinkedIn, Source Model, Verification Evidence, Urgency, or ANY other columns
- ABSOLUTELY NO "Verification Evidence" column - if verification is needed, mention it within existing columns
- NEVER create a "Verification Evidence" header or column under any circumstances
- Generate 30-40 leads across all segments
- Each table should have 8-12 leads
- Focus ONLY on the standardized 13-column table structure provided
- Use markdown table format (| column | column |) not HTML grid format`;
        rawResponse = await runGemini(geminiPrompt, [], { 
          mode: 'research',
          useGrounding: false
        });
        break;
      }
      case 'perplexity': {
        rawResponse = await callPerplexityWithRetry(leadGenerationPrompt, 'sonar-deep-research');
        break;
      }
      case 'claude': {
        const { runClaude } = await import('../claudeApi');
        rawResponse = await runClaude(leadGenerationPrompt, 'You are a Sales Lead Generation Specialist providing high-quality sales opportunities.');
        break;
      }
      case 'llama': {
        const { callLlama } = await import('../llamaApi');
        rawResponse = await callLlama(leadGenerationPrompt, 'You are a Sales Lead Generation Specialist providing high-quality sales opportunities.');
        break;
      }
      case 'grok': {
        const { callGrok } = await import('../grokApi');
        rawResponse = await callGrok(leadGenerationPrompt, 'You are a Sales Lead Generation Specialist providing high-quality sales opportunities.');
        break;
      }
      default:
        throw new Error(`Unsupported model: ${model}`);
    }

    // Ensure ResearchGPT header so UI renders inside research-chat-container
    const hasHeader = typeof rawResponse === 'string' && rawResponse.includes('# 🔍 ResearchGPT Analysis');
    const formatted = hasHeader ? rawResponse : `# 🔍 ResearchGPT Analysis\n\n${rawResponse}`;
    return formatted;
  } catch (error) {
    console.error(`Error generating leads with ${model}:`, error);
    return `Error: Failed to generate leads with ${model}. ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

