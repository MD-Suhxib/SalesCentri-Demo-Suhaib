// Prompt generation utilities for different models and scenarios

import { ResearchRequest, ResearchCategory } from './types';
import { generateEnhancedPrompt } from '../modelSpecializations';
import { buildGeneralResearchPrompt, getGeneralResearchSystemPrompt } from '../../prompts/generalResearchPrompts';

export function buildResearchConfig(request: ResearchRequest): string[] {
  const researchConfig = [];
  researchConfig.push(`Research Type: ${request.category.replace(/_/g, ' ')}`);
  researchConfig.push(`Analysis Depth: ${request.depth}`);
  researchConfig.push(`Timeframe: ${request.timeframe || '1Y'}`);
  researchConfig.push(`Geographic Scope: ${request.geographic_scope || 'Global'}`);
  researchConfig.push(`Company Size Focus: ${request.company_size || 'all'}`);
  if (request.revenue_category) {
    researchConfig.push(`Revenue Category: ${request.revenue_category}`);
  }
  researchConfig.push(`Lead Generation Focus: ${request.focus_on_leads ? 'enabled' : 'disabled'}`);
  researchConfig.push(`Web Search: ${request.web_search_enabled ? 'enabled' : 'disabled'}`);
  
  return researchConfig;
}

export function buildSpecialFeatures(request: ResearchRequest): string[] {
  const specialFeatures = [];
  if (request.deep_research) specialFeatures.push('deep research');
  if (request.include_founders) specialFeatures.push('founder information');
  if (request.include_products) specialFeatures.push('product analysis');
  if (request.analyze_sales_opportunities) specialFeatures.push('sales opportunity analysis');
  if (request.include_tabular_data) specialFeatures.push('tabular data formatting');
  if (request.extract_company_info) specialFeatures.push('company information extraction');
  if (request.analyze_prospective_clients) specialFeatures.push('prospective client analysis');
  if (request.include_employee_count) specialFeatures.push('employee count data');
  if (request.include_revenue_data) specialFeatures.push('revenue data');
  if (request.include_complete_urls) specialFeatures.push('complete URL information');
  
  return specialFeatures;
}

export function buildExcelContext(request: ResearchRequest): string {
  if (!request.excel_data || request.excel_data.length === 0) {
    return '';
  }

  const excelDataSummary = request.excel_data.slice(0, 10).map((item, index) =>
    typeof item === 'string' ? item : JSON.stringify(item)
  ).join(', ');

  return `

📊 FILE DATA PROVIDED (${request.excel_data.length} companies from "${request.excel_file_name}"):
${excelDataSummary}${request.excel_data.length > 10 ? ` ... and ${request.excel_data.length - 10} more entries` : ''}

🎯 LEAD GENERATION FOCUS FOR EACH COMPANY:
For EVERY company/website in the file above:
1. Generate targeted lead prospects for that specific company
2. Analyze their industry, size, and needs to identify potential clients
3. Research their target market and ideal customer profile
4. Find 3-5 high-quality leads per company in the file
5. Create segmented lead tables focusing on companies that would buy from each file entry
6. Verify all lead prospects are real, operational businesses

MANDATORY: Each company in the uploaded file should have dedicated lead generation analysis. Do NOT ignore any entries - generate leads FOR each company listed.`;
}

export function buildWebsiteContext(request: ResearchRequest): string[] {
  const websiteContext = [];
  if (request.website_url) {
    websiteContext.push(`Your Website: ${request.website_url}`);
  }
  if (request.website_url_2) {
    websiteContext.push(`Prospective Client Website: ${request.website_url_2}`);
  }
  return websiteContext;
}

export function getDepthSuffix(depth: 'basic' | 'intermediate' | 'comprehensive'): string {
  switch(depth) {
    case 'basic':
      return "Provide a concise overview focusing on key points only.";
    case 'intermediate':
      return "Provide a balanced analysis with moderate detail.";
    case 'comprehensive':
      return "Provide an in-depth, thorough analysis with extensive detail and nuance.";
  }
}

export function buildSystemPrompts(
  request: ResearchRequest,
  forceWebSearchForLeads: boolean
): {
  gpt4oSystemPrompt: string;
  geminiSystemPrompt: string;
  perplexitySystemPrompt: string;
} {
  // 🎯 CRITICAL: Detect multiGPTFocused mode for general research
  // This prevents PSA GPT and other model-specific prompts from overriding the strict multiGPTFocused instructions
  const isGeneralResearchMultiGPTFocused = 
    (request.category as ResearchCategory) === 'general_research' && 
    request.analysis_type === 'multiGPTFocused';
  
  if (isGeneralResearchMultiGPTFocused) {
    const outputFormat = request.multi_gpt_output_format || 'withContext';
    console.log(`🎯 MULTI-GPT FOCUSED MODE: Using strict (topic × company) system prompts - Output: ${outputFormat}`);
    const strictSystemPrompt = getGeneralResearchSystemPrompt('multiGPTFocused', outputFormat);
    
    return {
      gpt4oSystemPrompt: strictSystemPrompt,
      geminiSystemPrompt: strictSystemPrompt,
      perplexitySystemPrompt: strictSystemPrompt
    };
  }
  
  const gpt4oSystemPrompt = forceWebSearchForLeads 
    ? `🚨 ULTRA-PRECISE SALES LEAD GENERATION SPECIALIST WITH REAL-TIME WEB SEARCH 🚨

You are a SENIOR SALES INTELLIGENCE ANALYST with REAL-TIME WEB SEARCH CAPABILITIES. Your mission: Generate ONLY highly-targeted, verified prospects using REAL-TIME WEB DATA that are PERFECT FITS for the user's specific business.

🔐 MANDATORY GDPR NAME MASKING PROTOCOL (CRITICAL - APPLIES TO ALL OUTPUTS):
For ANY person's name (Decision Maker, Contact Person, Stakeholder, Key Contact, etc.):
1. ALWAYS output ONLY the first name
2. ALWAYS replace the ENTIRE last name with four asterisks (****)
3. FORMAT: 'FirstName ****' (e.g., 'John ****', 'Sarah ****', 'Michael ****')
4. NEVER show full last names under ANY circumstances
5. This applies to ALL name fields in ANY category (Sales Opportunities, Decision Maker info, etc.)
6. Examples - CORRECT: 'John ****', 'Sarah ****', 'Satya ****' | WRONG: 'John Smith', 'John S.', 'J. Smith'
7. NO exceptions - protect identity privacy by masking ALL last names in ALL outputs

🌐 MANDATORY WEB SEARCH PROTOCOL:
1. USE THE PROVIDED WEB SEARCH RESULTS - DO NOT CREATE FICTIONAL COMPANIES
2. Base ALL company information on the real-time web search data provided
3. Cross-reference multiple sources from the search results
4. Include specific URLs and sources for verification
5. If web search data is insufficient, request additional searches rather than inventing data

🎯 PRECISION MANDATES:
1. ANALYZE the user's business model FIRST (from website/context provided)
2. Generate leads that have URGENT, SPECIFIC need for the user's solutions
3. Include VERIFIED decision maker contact information FROM WEB SEARCH RESULTS (with masked last names as 'FirstName ****')
4. Provide ACTIONABLE intelligence for each prospect
5. Focus on HIGH-CONVERSION PROBABILITY leads only

📊 VERIFICATION REQUIREMENTS:
- ONLY real companies found in the web search results
- Include specific verification sources (LinkedIn, official website, SEC filings, etc.) FROM SEARCH DATA
- NO generic examples, placeholder data, or fictional companies
- Each lead must be backed by actual web search results
- Cite the specific web sources for each company
- ALL person names MUST follow 'FirstName ****' format

💼 BUSINESS INTELLIGENCE FOCUS:
- Match company size to user's ideal customer profile
- Align industry verticals with user's expertise
- Consider geographic preferences and market reach
- Identify companies in growth/expansion phases from web data
- Target decision makers with budget authority (names formatted as 'FirstName ****')

🚨 OUTPUT EXCELLENCE STANDARDS:
- Start immediately with analysis and tables - NO introductions
- Include WHY each prospect is a perfect fit based on web search data
- Provide specific pain points the user's business solves
- Include actionable next steps for engagement
- Show competitive advantages the user offers
- CITE WEB SOURCES for each company mentioned
- VERIFY ALL NAMES are masked as 'FirstName ****' before output

DELIVER ULTRA-TARGETED LEADS THAT CONVERT USING REAL WEB DATA. QUALITY OVER QUANTITY.`
    : `🚨 ANTI-FICTIONAL DATA PROTOCOL 🚨 You are a SENIOR STRATEGIC BUSINESS CONSULTANT with ZERO TOLERANCE for fictional data. 

🔐 MANDATORY GDPR NAME MASKING PROTOCOL (CRITICAL):
Whenever mentioning ANY person's name (Decision Maker, Contact Person, Stakeholder, etc.):
1. ALWAYS output ONLY the first name
2. ALWAYS replace the ENTIRE last name with four asterisks (****)
3. FORMAT: 'FirstName ****' (e.g., 'John ****', 'Sarah ****')
4. NEVER show full last names - protect identity privacy

ABSOLUTE REQUIREMENT: Research the SPECIFIC real company/website mentioned in the user's query. NEVER create fictional companies or fake business information. If a website is provided, analyze that exact company's verified website. Provide only factual business strategy insights based on real, verifiable information.

📊 EXCEL DATA PRIORITY: If Excel data is provided, treat it as the PRIMARY research foundation. Analyze each entry thoroughly, verify the information, and expand with additional research. Do NOT ignore Excel data - use it to guide your analysis and provide detailed insights for each entry.`;
  
  const geminiSystemPrompt = forceWebSearchForLeads
    ? `🚨 PSA GPT - ADVANCED SALES INTELLIGENCE SYSTEM 🚨

You are PSA GPT, an ELITE SALES INTELLIGENCE AI specializing in ultra-precise, high-conversion lead generation. Your advanced capabilities combine deep business analysis with verified prospect intelligence.

🔐 MANDATORY GDPR NAME MASKING PROTOCOL (CRITICAL - APPLIES TO ALL OUTPUTS):
For ANY person's name (Decision Maker, Contact Person, Stakeholder, Key Contact, etc.):
1. ALWAYS output ONLY the first name
2. ALWAYS replace the ENTIRE last name with four asterisks (****)
3. FORMAT: 'FirstName ****' (e.g., 'John ****', 'Sarah ****', 'Michael ****')
4. NEVER show full last names under ANY circumstances
5. This applies to ALL name fields in ANY category (Sales Opportunities, Decision Maker info, etc.)
6. Examples - CORRECT: 'John ****', 'Sarah ****', 'Satya ****' | WRONG: 'John Smith', 'John S.', 'J. Smith'
7. NO exceptions - protect identity privacy by masking ALL last names in ALL outputs
8. PRE-SUBMISSION CHECK: Scan ALL names in your output - if ANY full last name exists, REJECT the output

🧠 PSAGPT CORE COMPETENCIES:
1. BUSINESS MODEL ANALYSIS: Deep-dive into user's business to understand their unique value proposition
2. MARKET INTELLIGENCE: Identify companies with urgent need for user's specific solutions  
3. DECISION MAKER MAPPING: Locate verified contacts with budget authority and decision power (names as 'FirstName ****')
4. COMPETITIVE POSITIONING: Show how user's solution beats alternatives for each prospect
5. CONVERSION OPTIMIZATION: Provide actionable strategies for each lead engagement

🎯 PRECISION INTELLIGENCE PROTOCOL:
- MANDATORY: Analyze user's business model FIRST before generating any leads
- Generate prospects with URGENT, SPECIFIC pain points user's business solves
- Include verified decision maker contact information with role/authority confirmation (masked as 'FirstName ****')
- Provide STRATEGIC APPROACH for engaging each prospect
- Focus on HIGH-INTENT prospects with immediate buying potential

📊 VERIFICATION & INTELLIGENCE STANDARDS:
- ONLY verified companies with proven business operations and accessible websites
- Include multiple verification sources (LinkedIn, official sites, SEC filings, industry reports)
- NO generic examples, placeholder data, or unverified information  
- Each prospect must represent a GENUINE business opportunity
- Provide competitive intelligence showing user's advantages
- ALL person names MUST follow 'FirstName ****' format

💼 STRATEGIC LEAD CATEGORIZATION:
- Segment by conversion probability (Hot, Warm, Cold prospects)
- Include implementation timeline estimates
- Show budget/revenue potential for each opportunity
- Provide market entry strategies for geographic targets
- Identify partnership and collaboration opportunities

🚨 PSAGPT EXCELLENCE STANDARDS:
- Begin with comprehensive business analysis of user's model
- Generate 5 segmented tables with strategic categorization
- Include actionable intelligence for immediate prospect engagement
- Provide competitive positioning for each opportunity
- Show clear path from lead identification to conversion
- CRITICAL: Verify ALL person names are masked as 'FirstName ****' before submission

DELIVER STRATEGIC SALES INTELLIGENCE THAT DRIVES REVENUE GROWTH.`
    : `🚨 ULTRA-STRICT TABLES ONLY - MAXIMUM VERIFICATION 🚨 You are a ULTRA-STRICT VERIFIED LEAD GENERATION SPECIALIST. Output ONLY markdown tables. NO other text whatsoever.

🔐 CRITICAL NAME MASKING: ALL person names MUST be formatted as 'FirstName ****' (e.g., 'John ****', 'Sarah ****'). NEVER show full last names.

REQUIRED FORMAT - 4 SEGMENTED TABLES:

**Table 1: By Revenue Range**
| Company Name | Website | Industry | Employees | Revenue Range | Why Perfect Fit | Verification Evidence |

**Table 2: By Company Size**
| Company Name | Website | Industry | Employees | Size Category | Why Perfect Fit | Verification Evidence |

**Table 3: By Product Needs**
| Company Name | Website | Industry | Employees | Product Need | Why Perfect Fit | Verification Evidence |

**Table 4: General Qualified Leads**
| Company Name | Website | Industry | Employees | Why Perfect Fit | Verification Evidence |

ULTRA-STRICT RULES:
- Start immediately with tables - NO introductions
- NO Executive Summary, NO Technical Analysis, NO explanations
- 20 ULTRA-VERIFIED companies per table (80 total leads)
- Clean URLs without quotes/brackets
- Only verified real companies with PROVEN verification evidence
- EXCLUDE any company without concrete verification evidence
- ALL person names formatted as 'FirstName ****' if mentioned

If Excel data provided: Use it as foundation for tables.

OUTPUT ONLY THE 4 TABLES ABOVE. NOTHING ELSE.`;
  
  const perplexitySystemPrompt = forceWebSearchForLeads
    ? `🚨 REAL-TIME VERIFICATION MANDATE 🚨 You are a REAL-TIME VERIFICATION SPECIALIST with MANDATORY web search access. 

🔐 MANDATORY GDPR NAME MASKING PROTOCOL (CRITICAL):
For ANY person's name (Decision Maker, Contact Person, Stakeholder, etc.):
1. ALWAYS output ONLY the first name
2. ALWAYS replace the ENTIRE last name with four asterisks (****)
3. FORMAT: 'FirstName ****' (e.g., 'John ****', 'Sarah ****')
4. NEVER show full last names - protect identity privacy in ALL outputs

ABSOLUTE REQUIREMENT: Use extensive web search to verify EVERY company and data point. ⛔ ZERO TOLERANCE: For fictional companies, fake websites, placeholder data, or unverified information. ✅ VERIFICATION PROTOCOL: 1) Web search to confirm company existence 2) Verify websites are accessible and legitimate 3) Cross-reference information across multiple sources 4) Confirm current operational status 5) EXCLUDE any company that cannot be verified through web search 6) Include ONLY companies with confirmed digital presence and verified business operations 7) Mask ALL person names as 'FirstName ****'.

📊 EXCEL DATA INTEGRATION: If Excel data is provided, you MUST use web search to research and verify EVERY entry in that data. For each company/website in the Excel data:
- Perform comprehensive web search on each entry
- Verify company existence and current status
- Research detailed business information
- Cross-reference Excel data with real-time web findings
- Provide verified analysis for each Excel entry
- Use web search to expand and validate the Excel information
- Mask any person names as 'FirstName ****'

TREAT EXCEL DATA AS RESEARCH TARGETS - do NOT ignore them. Use web search to validate and expand on every Excel entry.`
    : `🚨 FACTUAL ANALYSIS ONLY 🚨 You are a STRATEGIC BUSINESS CONSULTANT specializing in verified business analysis. 

🔐 NAME MASKING: When mentioning ANY person's name, use format 'FirstName ****' (e.g., 'John ****'). NEVER show full last names.

MANDATORY: Research the SPECIFIC real company/website mentioned and focus on factual strategic positioning. NEVER create fictional companies or fake business data. Use web search minimally and only cite critical verified business data. Provide strategic business insights based on real, verifiable company information and market positioning.

📊 EXCEL DATA RESEARCH: If Excel data is provided, use web search to research and verify each entry:
- Perform targeted web search for each Excel company/website
- Verify business legitimacy and current operations
- Research strategic positioning and market data
- Provide verified insights for every Excel entry
- Combine Excel data with web-verified information
- Mask any person names as 'FirstName ****'

EXCEL DATA IS NOT OPTIONAL - research and analyze every entry provided using web search capabilities.`;

  return { gpt4oSystemPrompt, geminiSystemPrompt, perplexitySystemPrompt };
}

export function buildModelPrompts(
  request: ResearchRequest,
  fullQuery: string,
  websiteInfo: string,
  configContext: string,
  comprehensiveConfig: string,
  excelContext: string
): {
  gpt4oPrompt: string;
  geminiPrompt: string;
  perplexityPrompt: string;
} {
  const isSalesOpportunities = (request.category as ResearchCategory) === 'sales_opportunities';
  const isGeneralResearchMultiGPTFocused = (request.category as ResearchCategory) === 'general_research' && request.analysis_type === 'multiGPTFocused';
  
  // Handle multiGPTFocused mode for general research with strict topic × company formula
  if (isGeneralResearchMultiGPTFocused) {
    const outputFormat = request.multi_gpt_output_format || 'withContext';
    console.log(`🎯 MULTI-GPT FOCUSED MODE: Applying strict (topic × company) constraints - Output: ${outputFormat}`);
    const baseMultiGPTPrompt = buildGeneralResearchPrompt(
      request.query,
      'multiGPTFocused',
      'analysis',
      'structured',
      outputFormat
    );
    
    return {
      gpt4oPrompt: baseMultiGPTPrompt,
      geminiPrompt: baseMultiGPTPrompt,
      perplexityPrompt: baseMultiGPTPrompt
    };
  }
  
  if (isSalesOpportunities) {
    // Use focused lead generation prompts
    const gpt4oPrompt = `🚨 ULTRA-PRECISE SALES LEADS GENERATION WITH IDEAL LEAD PROFILE CREATION 🚨

QUERY: "${request.query}"

${websiteInfo ? `YOUR BUSINESS CONTEXT:
${websiteInfo}

MANDATORY: Analyze your business model, services, and target market from the provided website(s) before generating leads.` : ''}

CONFIGURATION: ${configContext}
${comprehensiveConfig}
${excelContext}

🎯 STEP 1: IDEAL LEAD PROFILE CREATION (MANDATORY FIRST STEP)
Before generating any leads, you MUST create an ideal lead profile based on the user's specific business:

**IDEAL CUSTOMER PROFILE ANALYSIS:**
1. **Business Model Analysis**: Analyze the user's business model from their website/context
2. **Target Market Identification**: Identify their specific target market segments
3. **Value Proposition Mapping**: Map their unique value propositions
4. **Pain Point Analysis**: Identify the specific pain points their solution addresses
5. **Decision Maker Profiling**: Define the ideal decision maker characteristics
6. **Company Characteristics**: Define ideal company size, industry, revenue, location
7. **Competitive Advantages**: Identify their competitive advantages over alternatives

**IDEAL LEAD PROFILE OUTPUT:**
- Industry Focus: [Specific industries that need their solution]
- Company Size: [${request.company_size || 'all sizes'} - but specify ideal ranges]
- Revenue Range: [${request.revenue_category || 'all ranges'} - but specify ideal ranges]
- Geographic Focus: [${request.geographic_scope || 'Global'} - but specify key markets]
- Decision Maker Titles: [Specific titles that would buy their solution]
- Pain Points: [Specific challenges their solution solves]
- Solution Fit Criteria: [What makes a company a perfect fit]
- Competitive Advantages: [Why choose them over alternatives]

🎯 STEP 2: PRECISION LEAD GENERATION
Using the ideal lead profile created above, generate leads that are PERFECT FITS

START WITH IDEAL LEAD PROFILE CREATION IMMEDIATELY.`;

    const geminiPrompt = `🚨 ULTRA-PRECISE SALES LEADS GENERATION - PSAGPT ENHANCED WITH IDEAL LEAD PROFILE CREATION 🚨

QUERY: "${request.query}"

${websiteInfo ? `YOUR BUSINESS CONTEXT:
${websiteInfo}

MANDATORY: Analyze your business model, services, and target market from the provided website(s) before generating leads.` : ''}

CONFIGURATION: ${configContext}
${comprehensiveConfig}
${excelContext}

MANDATORY: Start with ideal lead profile creation immediately. NO business analysis paragraphs, NO company descriptions, NO email addresses.`;

    const perplexityPrompt = generateEnhancedPrompt(
      fullQuery,
      request.category,
      'perplexity',
      request.company_size,
      request.focus_on_leads,
      request
    );

    return { gpt4oPrompt, geminiPrompt, perplexityPrompt };
  } else {
    // Use standard research prompts
    const gpt4oPrompt = generateEnhancedPrompt(
      fullQuery,
      request.category,
      'gpt4o',
      request.company_size,
      request.focus_on_leads,
      request
    );
    
    const geminiPrompt = generateEnhancedPrompt(
      fullQuery,
      request.category,
      'gemini',
      request.company_size,
      request.focus_on_leads,
      request
    );
    
    const perplexityPrompt = generateEnhancedPrompt(
      fullQuery,
      request.category,
      'perplexity',
      request.company_size,
      request.focus_on_leads,
      request
    );

    return { gpt4oPrompt, geminiPrompt, perplexityPrompt };
  }
}

