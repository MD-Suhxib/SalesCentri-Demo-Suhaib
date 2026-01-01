import { ResearchCategory, ResearchRequest } from './researchOrchestration';

interface ModelSpecialization {
  focus: string;
  prompt_enhancement: string;
  strengths: string[];
}

interface ModelSpecializations {
  [key: string]: ModelSpecialization;
}

export const modelSpecializations: ModelSpecializations = {
  gpt4o: {
    focus: "STRICTLY VERIFIED Real Business Lead Generation - NO FICTIONAL DATA ALLOWED",
    prompt_enhancement: "🚨 CRITICAL ANTI-FICTIONAL DATA PROTOCOL 🚨 ROLE: You are a STRICTLY VERIFIED BUSINESS LEAD GENERATOR who provides ONLY real, verifiable companies. YOU ARE FORBIDDEN from creating fictional companies, fake websites, or made-up business information. ⛔ ABSOLUTE PROHIBITION: 1) NEVER create fictional company names 2) NEVER generate fake websites or URLs 3) NEVER use placeholder business information 4) NEVER create imaginary revenue figures 5) NEVER invent employee counts 6) ZERO TOLERANCE for fictional data 7) NEVER use GoDaddy parked domains or placeholder pages 8) NEVER use generic domains like example.com, test.com, placeholder.com 9) NEVER create websites that redirect to domain registrars or hosting providers ✅ MANDATORY REAL DATA VERIFICATION PROTOCOL: 1) ONLY use companies with VERIFIED, accessible websites (test URLs work) 2) ONLY include businesses with CONFIRMED public information and professional websites that show actual business content 3) VERIFY each company exists through multiple sources before including 4) Include SPECIFIC verification source for each entry (e.g., 'Verified on LinkedIn company page', 'Confirmed via official website') 5) Cross-reference company information across multiple reliable sources 6) If you cannot 100% verify a company exists, EXCLUDE IT entirely 7) Use ONLY well-established companies with strong digital footprints 8) PRIORITIZE publicly traded companies and industry leaders with verified information 🔐 MANDATORY GDPR NAME MASKING PROTOCOL: For ANY person's name (Decision Maker, Contact Person, Stakeholder, etc.): 1) ALWAYS output ONLY the first name 2) ALWAYS replace the ENTIRE last name with four asterisks (****) 3) FORMAT: 'FirstName ****' (e.g., 'John ****', 'Sarah ****', 'Michael ****') 4) NEVER show full last names under ANY circumstances 5) This applies to ALL name fields: Decision Maker, Contact Person, Stakeholder, Key Contact, etc. 6) Examples - CORRECT: 'John ****', 'Sarah ****' | WRONG: 'John Smith', 'John S.', 'J. Smith' 7) NO exceptions - protect identity privacy by masking ALL last names 🎯 OUTPUT REQUIREMENT: Generate ONLY ONE TABLE with 15-20 VERIFIED prospects with decision maker information ⚠️ STRICT UNIQUENESS: Each table MUST contain COMPLETELY DIFFERENT companies. NO duplicates across tables. ✅ ENHANCED TABLE FORMAT: **SINGLE LEADS TABLE (VERIFIED REAL COMPANIES ONLY)** | Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy | � QUALITY CONTROL: Each entry must pass verification test: Can you personally confirm this company exists by visiting their website and seeing actual business content? If NO, exclude immediately. NO GoDaddy pages, NO placeholder domains, NO redirects to hosting providers.",
    strengths: ["Strict anti-fictional protocols", "Real company verification", "Multi-source validation", "Business legitimacy checking", "URL accessibility testing", "Public information confirmation", "Unique company generation", "Website verification", "Real-time validation"]
  },
  gemini: {
    focus: "ULTRA-STRICT VERIFIED REAL BUSINESS DATA ONLY - ZERO FICTIONAL TOLERANCE",
    prompt_enhancement: "🚨 MAXIMUM SECURITY PROTOCOL - FICTIONAL DATA ELIMINATION 🚨 ROLE: You are a ULTRA-STRICT VERIFIED BUSINESS DATA SPECIALIST with ZERO TOLERANCE for ANY fictional, placeholder, or unverified information. ⛔ ABSOLUTE TOTAL PROHIBITION: 1) NEVER EVER create fictional company names 2) NEVER EVER generate fake websites or non-existent URLs 3) NEVER EVER use made-up revenue figures 4) NEVER EVER invent employee counts 5) NEVER EVER create imaginary business information 6) NEVER EVER use placeholder data like 'example.com' 7) NEVER EVER generate generic company names 8) NEVER EVER create fake business addresses 9) NEVER EVER invent business descriptions 10) COMPLETE BAN on any unverified data ✅ ULTRA-STRICT VERIFICATION PROTOCOL: 1) ONLY use companies that DEFINITELY EXIST with PROVEN websites 2) ONLY include businesses with CURRENT, ACTIVE web presence (2024-2025) 3) VERIFY each company by VISITING their actual website in your knowledge 4) Include SPECIFIC VERIFICATION EVIDENCE for each entry (e.g., 'Verified: Official website shows 2024 annual report', 'Confirmed: LinkedIn company page with 500+ employees', 'Validated: SEC filing from Q2 2024') 5) Cross-validate information across MULTIPLE AUTHORITATIVE SOURCES 6) If you cannot provide 100% VERIFICATION EVIDENCE, EXCLUDE the company IMMEDIATELY 7) Use ONLY well-established companies with STRONG DIGITAL FOOTPRINTS 8) PRIORITIZE Fortune 500, publicly traded, or industry-leading companies with VERIFIED DATA 9) REQUIRE SPECIFIC BUSINESS METRICS (real revenue, real employee count, real industry position) 10) DEMAND PROOF of business legitimacy (official website, business registration, industry recognition) 🔐 MANDATORY GDPR NAME MASKING PROTOCOL: For ANY person's name (Decision Maker, Contact Person, Stakeholder, etc.): 1) ALWAYS output ONLY the first name 2) ALWAYS replace the ENTIRE last name with four asterisks (****) 3) FORMAT: 'FirstName ****' (e.g., 'John ****', 'Sarah ****', 'Michael ****') 4) NEVER show full last names under ANY circumstances 5) This applies to ALL name fields: Decision Maker, Contact Person, Stakeholder, Key Contact, etc. 6) Examples - CORRECT: 'John ****', 'Sarah ****' | WRONG: 'John Smith', 'John S.', 'J. Smith' 7) NO exceptions - protect identity privacy by masking ALL last names 8) PRE-SUBMISSION CHECK: Scan ALL names in your output - if ANY full last name exists, REJECT the output 🎯 ULTRA-STRICT OUTPUT REQUIREMENT: Generate ONLY ONE TABLE with 15-20 VERIFIED REAL COMPANIES with decision maker information ⚠️ ABSOLUTE UNIQUENESS ENFORCEMENT: Each table MUST contain COMPLETELY DIFFERENT companies. ZERO overlap between ANY tables. Generate 80 TOTAL UNIQUE VERIFIED companies. ✅ MAXIMUM VERIFICATION TABLE FORMAT: **SINGLE LEADS TABLE (ULTRA-VERIFIED REAL COMPANIES ONLY)** | Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy | � ULTRA-STRICT VERIFICATION TEST: For EACH entry, you MUST provide CONCRETE VERIFICATION EVIDENCE. Ask yourself: 'Can I prove this company exists with specific evidence?' If you cannot provide VERIFICATION EVIDENCE, EXCLUDE IT. NO EXCEPTIONS. NO COMPROMISES.",
    strengths: ["Ultra-strict fictional data elimination", "Maximum verification requirements", "Concrete evidence demands", "Multi-source validation", "Business legitimacy proof", "Real metrics requirement", "Zero tolerance policy", "Unique company enforcement"]
  },
  perplexity: {
    focus: "Real-Time Verified Business Intelligence - Live Company Data with Source Attribution", 
    prompt_enhancement: "ROLE: You are a REAL-TIME VERIFIED BUSINESS INTELLIGENCE SPECIALIST who provides ONLY real, verified company data through live web search with source attribution. 🔐 MANDATORY GDPR NAME MASKING PROTOCOL: For ANY person's name (Decision Maker, Contact Person, Stakeholder, etc.): 1) ALWAYS output ONLY the first name 2) ALWAYS replace the ENTIRE last name with four asterisks (****) 3) FORMAT: 'FirstName ****' (e.g., 'John ****', 'Sarah ****', 'Michael ****') 4) NEVER show full last names under ANY circumstances 5) This applies to ALL name fields: Decision Maker, Contact Person, Stakeholder, Key Contact, etc. 6) Examples - CORRECT: 'John ****', 'Sarah ****' | WRONG: 'John Smith', 'John S.', 'J. Smith' 7) NO exceptions - protect identity privacy by masking ALL last names 🎯 OUTPUT REQUIREMENT: Generate ONLY ONE TABLE with 15-20 UNIQUE REAL prospects with decision maker information. ⚠️ CRITICAL UNIQUENESS REQUIREMENT: Each table MUST contain COMPLETELY DIFFERENT companies. NO company should appear in multiple tables. Generate 30+ TOTAL UNIQUE companies across all tables. ⚠️ CRITICAL VERIFICATION REQUIREMENT: You MUST only include companies that you can verify are real and active through live web search. Do NOT create fictional companies or unverified data. ✅ MANDATORY REAL-TIME VERIFICATION PROTOCOL: 1) ONLY use companies that exist and have current, verifiable web presence 2) ONLY include businesses with live websites and recent activity (2024-2025) 3) VERIFY each company's operational status through real-time web search 4) Include live data source for each entry (e.g., 'Live company website Sept 2025', 'Recent LinkedIn activity', 'Current business directory listing') 5) If you cannot verify a company's current status through web search, DO NOT INCLUDE IT 6) Prioritize companies with recent online activity and strong digital presence 7) Use only companies with publicly accessible, up-to-date business information 8) ENSURE ZERO OVERLAP between tables - each company appears only once ✅ MANDATORY VERIFIED TABLE FORMAT: **SINGLE LEADS TABLE (UNIQUE VERIFIED COMPANIES)** | Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy | 🚀 STRICT OUTPUT FORMAT: Provide ONLY ONE table with 15-20 UNIQUE VERIFIED data rows. Include decision maker information for all leads (with last names masked as 'FirstName ****').",
    strengths: ["Real-time company verification", "Live web search validation", "Current data source attribution", "Revenue-based organization", "Employee count validation", "Product need alignment", "Business legitimacy checking", "Unique company generation"]
  }
};

export const generateEnhancedPrompt = (
  query: string, 
  category: ResearchCategory, 
  model: 'gpt4o' | 'gemini' | 'perplexity',
  company_size?: 'small' | 'medium' | 'big' | 'all',
  focus_on_leads?: boolean,
  fullRequest?: ResearchRequest
): string => {
  // Company size filter
  const companySizeFilter = company_size && company_size !== 'all' ? 
    `\n\nCOMPANY SIZE FILTER: Focus only on ${company_size} companies (${company_size === 'small' ? '1-50 employees' : company_size === 'medium' ? '51-500 employees' : '500+ employees'})` : '';

  // Lead focus enhancement for sales opportunities (skip for general_research)
  const leadFocusEnhancement = (focus_on_leads || category === 'sales_opportunities') && category !== 'general_research' ? 
    `\n\nBUSINESS WEBSITE LEAD GENERATION FOCUS: Prioritize identifying and listing prospective client companies with verified business websites. Provide detailed company information, business intelligence, and qualification criteria based on web presence and corporate data.` : '';

  // Enhanced configuration requirements from full request
  // For general_research, only include relevant requirements (skip company/lead specific ones)
  const additionalRequirements = fullRequest ? [
    fullRequest.deep_research ? 'DEEP RESEARCH: Provide comprehensive, detailed analysis with extensive supporting data' : '',
    // Skip company/lead specific requirements for general_research
    category !== 'general_research' && fullRequest.include_founders ? 'COMPANY LEADERSHIP: Include founder and leadership team information available on company websites' : '',
    category !== 'general_research' && fullRequest.include_products ? 'PRODUCT ANALYSIS: Analyze products, services, and offerings in detail' : '',
    category !== 'general_research' && fullRequest.analyze_sales_opportunities ? 'SALES FOCUS: Emphasize sales opportunities and lead qualification' : '',
    fullRequest.include_tabular_data ? 'TABULAR FORMAT: Present data in structured tables where appropriate' : '',
    category !== 'general_research' && fullRequest.extract_company_info ? 'COMPANY DETAILS: Extract comprehensive company information and metrics' : '',
    category !== 'general_research' && fullRequest.analyze_prospective_clients ? 'PROSPECT ANALYSIS: Focus on prospective client identification and qualification' : '',
    category !== 'general_research' && fullRequest.include_employee_count ? 'EMPLOYEE DATA: Include employee count and organizational size information' : '',
    category !== 'general_research' && fullRequest.include_revenue_data ? 'REVENUE INFO: Include revenue, financial data, and business metrics' : '',
    category !== 'general_research' && fullRequest.include_complete_urls ? 'COMPLETE URLS: Provide full website URLs and online presence information' : '',
    category !== 'general_research' && fullRequest.revenue_category ? `REVENUE FILTER: Focus on companies in ${fullRequest.revenue_category} revenue category` : ''
  ].filter(req => req).join('\n') : '';

  const enhancedRequirements = additionalRequirements ? `\n\nADDITIONAL REQUIREMENTS:\n${additionalRequirements}` : '';

  // Excel data integration - CRITICAL: Include actual Excel data content in prompts
  // Skip Excel data integration for general_research category
  let excelDataIntegration = '';
  if (fullRequest?.excel_data && fullRequest.excel_data.length > 0 && category !== 'general_research') {
    const excelDataSummary = fullRequest.excel_data.slice(0, 20).map((item, index) => 
      typeof item === 'string' ? item : JSON.stringify(item)
    ).join(', ');

    excelDataIntegration = `

📊 EXCEL DATA PROVIDED FOR ANALYSIS (${fullRequest.excel_data.length} entries from "${fullRequest.excel_file_name}"):
${excelDataSummary}${fullRequest.excel_data.length > 20 ? ` ... and ${fullRequest.excel_data.length - 20} more entries` : ''}

🎯 EXCEL DATA ANALYSIS REQUIREMENTS:
1. **PRIMARY FOCUS**: Treat each Excel entry as a specific research target requiring detailed analysis
2. **VERIFY & EXPAND**: Research each company/website in the Excel data and verify the provided information
3. **COMPREHENSIVE ANALYSIS**: Provide detailed insights for EVERY Excel entry
4. **CROSS-REFERENCE**: Use the Excel data as foundation and expand with additional verified research
5. **STRUCTURED OUTPUT**: Organize analysis by Excel entry with clear findings for each
6. **VERIFICATION**: Confirm business legitimacy and current status for each Excel company/website

⚠️ CRITICAL: Do NOT ignore the Excel data. Use it as your PRIMARY research foundation and provide specific analysis for each entry listed above.`;
  }
      
      const basePrompt = category === 'sales_opportunities' ? 
    `This is handled by the two-step sales opportunities process. This prompt should not be used.` :
    category === 'general_research' ?
    `RESEARCH ANALYSIS: "${query}"${companySizeFilter}

**RESEARCH FOCUS:**
Conduct comprehensive research on the topic: "${query}"

**RESEARCH REQUIREMENTS:**
- Focus exclusively on researching and analyzing the topic: "${query}"
- Provide detailed information, insights, and analysis related to this specific topic
- Include relevant facts, data, trends, and information about the topic
- Structure your analysis with clear sections relevant to the research topic
- Base all analysis on verified, factual information about the topic

**OUTPUT FORMAT:**
Structure your analysis with clear sections that directly address the research topic.
All insights must be directly related to "${query}".

**CRITICAL REQUIREMENTS:**
- Research ONLY the topic: "${query}"
- Provide comprehensive information about the topic itself
- Do not deviate into unrelated topics or generic information
- Focus all analysis on the specific research topic requested
` :
    `RESEARCH ANALYSIS: "${query}"${companySizeFilter}

**MANDATORY FIRST STEP: SPECIFIC COMPANY/WEBSITE RESEARCH**
1. IDENTIFY: Extract the specific company name, website, or organization mentioned in "${query}"
2. RESEARCH: If a website is provided, visit and analyze that exact website first
3. UNDERSTAND: Research the specific company's business model, products, services, and market position
4. ANALYZE: Focus your entire analysis on this specific company/topic, NOT generic information

**RESEARCH REQUIREMENTS:**
- If a website URL is mentioned in "${query}", prioritize researching that specific website
- If a company name is mentioned, research that exact company's official website and information
- Extract key details: company size, industry, products/services, target market, recent news

🚨 CRITICAL ANTI-HALLUCINATION PROTOCOL 🚨
- NEVER invent, assume, or guess executive names or titles
- ONLY use decision maker names and titles that are DIRECTLY found in search documents, databases, or search results
- If you cannot find a specific executive name, use "Contact [Department]" (e.g., "Contact Sales", "Contact Marketing")
- NEVER create fictional executive names like "John Smith", "Sarah Johnson", "Mike Chen", etc.
- NEVER assume titles without verification from official sources
- If no specific executive is found, indicate "Executive information not publicly available"
- ALWAYS cite the source where you found the executive information
- Cross-reference executive information across multiple sources before including
- Use only verified, current information about the SPECIFIC entity mentioned
- Focus specifically on "${query}" and the exact company/website referenced
- Include recent developments about the specific company (within last 12 months)

**OUTPUT FORMAT:**
Structure your analysis with clear sections relevant to the research category.
All insights must be directly related to the SPECIFIC company/website mentioned in "${query}".

**CRITICAL REQUIREMENTS:**
- Research the EXACT company/website mentioned in the user's query
- Never provide generic responses - always focus on the specific entity
- Base all analysis on the actual company's website, products, and market position
- If no specific company is mentioned, research the most relevant companies in the topic area
`;

  // Add model-specific specialization (skip lead generation focus for general_research)
  const specialization = modelSpecializations[model];
  const specializationText = category === 'general_research' 
    ? '' // Skip model specialization for general research to avoid lead generation instructions
    : `\n\nSpecial focus area for your analysis: ${specialization.focus}\n${specialization.prompt_enhancement}`;
  
  const enhancedPrompt = `${basePrompt}${specializationText}`;

  // Add category-specific enhancements
  let categoryPrompt = "";
  switch(category) {
    case 'market_analysis':
      categoryPrompt = `
MARKET ANALYSIS REQUIREMENTS for "${query}":
1. **Market Size & Dynamics**: Provide actual market size (TAM, SAM, SOM), CAGR, and key market drivers
2. **Competitive Landscape**: Identify main competitors, market leaders, and their market share
3. **Customer Segmentation**: Define target customer segments with size and characteristics
4. **Growth Opportunities**: Specific market opportunities and expansion areas
5. **Barriers to Entry**: Market entry challenges and competitive moats
6. **Market Trends**: Current and emerging trends affecting the market
7. **Key Success Factors**: Critical factors for success in this market
8. **Geographic Analysis**: Regional market variations and opportunities

Focus specifically on "${query}" market dynamics, not generic market information.`;
      break;
    case 'competitive_intelligence':
      categoryPrompt = `
COMPETITIVE INTELLIGENCE REQUIREMENTS for "${query}":
1. **Direct Competitors**: List actual companies competing in the same space with detailed profiles
2. **Competitive Positioning**: How each competitor positions themselves in the market
3. **Pricing Strategies**: Competitor pricing models, tiers, and value propositions
4. **Product/Service Comparison**: Feature-by-feature analysis of competing offerings
5. **SWOT Analysis**: Strengths, weaknesses, opportunities, threats for key competitors
6. **Market Share**: Relative market positions and share data where available
7. **Competitive Advantages**: Unique differentiators and competitive moats
8. **Strategic Moves**: Recent acquisitions, partnerships, product launches
9. **Competitive Threats**: Emerging competitors and disruption risks

Research specifically about "${query}" competitive landscape, not generic competitor analysis.`;
      break;
    case 'technology_trends':
      categoryPrompt = `
TECHNOLOGY TRENDS REQUIREMENTS for "${query}":
1. **Emerging Technologies**: Latest technological developments relevant to "${query}"
2. **Adoption Curves**: Technology adoption rates and maturity levels
3. **Innovation Leaders**: Companies and organizations driving technology innovation
4. **Technical Standards**: Emerging standards, protocols, and frameworks
5. **Disruption Potential**: Technologies that could disrupt current solutions
6. **Investment Trends**: Funding and investment patterns in relevant technologies
7. **Patent Landscape**: Key patents and intellectual property developments
8. **Implementation Challenges**: Technical and business challenges for adoption
9. **Future Roadmap**: Predicted technology evolution over next 3-5 years

Focus specifically on technology trends related to "${query}", not general tech trends.`;
      break;
    case 'industry_insights':
      categoryPrompt = `
INDUSTRY INSIGHTS REQUIREMENTS for "${query}":
1. **Industry Structure**: Value chain, key players, and industry ecosystem
2. **Supply Chain Dynamics**: Suppliers, distributors, and channel partners
3. **Regulatory Environment**: Industry regulations, compliance requirements, policy impacts
4. **Economic Factors**: Industry economic drivers, cyclical patterns, cost structures
5. **Industry Maturity**: Growth stage, maturity indicators, consolidation trends
6. **Key Performance Metrics**: Industry benchmarks, KPIs, and success metrics
7. **Growth Drivers**: Primary factors driving industry growth and expansion
8. **Industry Challenges**: Major obstacles, risks, and pressure points
9. **Future Outlook**: Industry predictions, disruption risks, evolution trends

Analyze specifically the industry related to "${query}", not generic industry information.`;
      break;
    case 'academic_research':
      categoryPrompt = `
ACADEMIC RESEARCH REQUIREMENTS for "${query}":
1. **Literature Review**: Recent peer-reviewed research papers and studies
2. **Research Methodologies**: Relevant research approaches and methodologies
3. **Key Findings**: Major research findings and conclusions in the field
4. **Research Gaps**: Areas lacking sufficient research or investigation
5. **Theoretical Frameworks**: Relevant theories and conceptual models
6. **Empirical Evidence**: Data, statistics, and evidence-based insights
7. **Research Institutions**: Leading academic institutions and research centers
8. **Publication Trends**: Recent publication patterns and research directions
9. **Practical Applications**: How research translates to real-world applications

Focus specifically on academic research related to "${query}", with proper citation standards.`;
      break;
    case 'financial_analysis':
      categoryPrompt = `
FINANCIAL ANALYSIS REQUIREMENTS for "${query}":
1. **Financial Metrics**: Key financial ratios, profitability, and performance indicators
2. **Valuation Analysis**: Valuation multiples, DCF analysis, comparable company analysis
3. **Revenue Models**: Business model analysis, revenue streams, and monetization
4. **Cost Structure**: Cost breakdown, margin analysis, and cost optimization opportunities
5. **Investment Metrics**: ROI, IRR, payback period, and investment attractiveness
6. **Financial Trends**: Historical performance trends and future projections
7. **Risk Assessment**: Financial risks, sensitivity analysis, and risk mitigation
8. **Capital Structure**: Debt/equity analysis, financing options, capital requirements
9. **Benchmarking**: Industry financial benchmarks and peer comparisons

Analyze specifically the financial aspects of "${query}", not generic financial information.`;
      break;
    case 'consumer_behavior':
      categoryPrompt = `
CONSUMER BEHAVIOR REQUIREMENTS for "${query}":
1. **Purchase Patterns**: How consumers discover, evaluate, and purchase related products/services
2. **Decision Factors**: Key factors influencing consumer decisions in this category
3. **Customer Journey**: Detailed mapping of the customer decision process
4. **Psychographic Segmentation**: Consumer attitudes, values, interests, and lifestyle factors
5. **Demographic Analysis**: Age, income, education, geographic factors affecting behavior
6. **Digital Behavior**: Online research patterns, social media influence, digital touchpoints
7. **Pain Points**: Consumer frustrations, unmet needs, and improvement opportunities
8. **Brand Preferences**: Brand loyalty patterns, switching behavior, preference drivers
9. **Seasonal Trends**: Timing patterns, seasonal variations, and cyclical behavior

Focus specifically on consumer behavior related to "${query}", not general consumer trends.`;
      break;
    case 'regulatory_landscape':
      categoryPrompt = `
REGULATORY LANDSCAPE REQUIREMENTS for "${query}":
1. **Current Regulations**: Existing laws, regulations, and compliance requirements
2. **Recent Changes**: Recent regulatory updates, new rules, and policy changes
3. **Regulatory Bodies**: Key agencies, authorities, and governing organizations
4. **Compliance Requirements**: Specific compliance obligations and standards
5. **Pending Legislation**: Proposed laws, upcoming regulatory changes, policy discussions
6. **International Variations**: Regional differences in regulatory approaches
7. **Industry Impact**: How regulations affect business operations and strategies
8. **Enforcement Trends**: Regulatory enforcement patterns, penalties, and compliance audits
9. **Regulatory Risks**: Potential regulatory changes and compliance risks

Analyze specifically the regulatory environment for "${query}", not generic regulatory information.`;
      break;
      case 'sales_opportunities':
        categoryPrompt = `
🚨 LEADS TABLE ONLY - NO EXTRA CONTENT 🚨

Generate ONLY ONE clean leads table with verified business prospects.

**MANDATORY SINGLE TABLE FORMAT:**
| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |

**STRICT RULES:**
- Generate exactly 15-20 verified real companies
- NO introductions, NO Executive Summary, NO Technical Analysis
- NO market overview, NO explanations, NO additional text
- Start immediately with the table
- Only verified real companies with active websites
- Clean URLs without quotes/brackets
- MANDATORY: For each company, perform Google Search to find their actual leadership team
- Search pattern: "[Company Name] leadership team" OR "[Company Name] executives" OR "[Company Name] about us team"
- Include first name and role of decision makers from verified sources
- All columns must be filled with relevant data
- Focus ONLY on qualified sales leads
- Use real working company names and websites
- Decision maker names should be real, verified names (e.g., "John", "Sarah") - NEVER generic templates
- Designation should be specific job titles (e.g., "VP Sales", "Marketing Director", "CEO")
- NEVER use fictional names like "John Smith", "Sarah Johnson", "Mike Chen" - always verify from company sources`;
        break;
      case 'general_research':
        categoryPrompt = `
GENERAL RESEARCH REQUIREMENTS for "${query}":
1. **Topic Analysis**: Provide comprehensive analysis of the research topic: "${query}"
2. **Key Information**: Include relevant facts, data, and insights about the topic
3. **Current State**: Describe the current state and status of the topic
4. **Important Details**: Highlight important details, trends, or developments related to the topic
5. **Relevant Context**: Provide relevant context and background information
6. **Key Findings**: Summarize key findings and insights about the topic
7. **Analysis**: Provide detailed analysis and interpretation of the topic

Focus exclusively on researching and analyzing the topic: "${query}". Do not include company research, lead generation, or other unrelated analysis.`;
        break;
  }

  return `${enhancedPrompt}

Category-specific analysis: ${categoryPrompt}${enhancedRequirements}${leadFocusEnhancement}${excelDataIntegration}`;
};
