// Lightning Mode Prospect List Prompts
// Adapted from leadGenerationPrompts.ts for Lightning Mode specific inputs

export interface LightningLeadGenParams {
  industry: string;
  competitorBasis: string;
  region: string;
  clientType: string;
  marketFocus?: string; // B2B | B2C | B2G
  targetDepartments?: string[];
  targetRevenueSize?: string;
  targetEmployeeSize?: string;
  targetLocation?: string;
  companyRole?: string;
  shortTermGoal?: string;
  budget?: string;
  websiteUrl?: string;
}

export const createLightningTabularLeadsPrompt = (
  website: string, 
  leadGenAnswers: LightningLeadGenParams,
  companySummary?: string
): string => {
  console.log('⚡ LIGHTNING LEAD GEN PROMPT: Creating prompt for:', website);
  console.log('📋 LIGHTNING LEAD GEN PARAMS:', leadGenAnswers);
  
  // Build target audience context line items only when available
  const contextLines: string[] = [
    `- Industry: ${leadGenAnswers.industry}`,
    `- Competitor Basis: ${leadGenAnswers.competitorBasis}`,
    `- Region: ${leadGenAnswers.region}`,
    `- Client Type: ${leadGenAnswers.clientType}`,
  ];
  
  if (leadGenAnswers.marketFocus) contextLines.push(`- Market Focus: ${leadGenAnswers.marketFocus}`);
  if (leadGenAnswers.targetDepartments?.length) contextLines.push(`- Target Departments/Titles: ${leadGenAnswers.targetDepartments.join(', ')}`);
  if (leadGenAnswers.targetRevenueSize) contextLines.push(`- Target Revenue Size: ${leadGenAnswers.targetRevenueSize}`);
  if (leadGenAnswers.targetEmployeeSize) contextLines.push(`- Target Employee Size: ${leadGenAnswers.targetEmployeeSize}`);
  if (leadGenAnswers.targetLocation) contextLines.push(`- Target Location: ${leadGenAnswers.targetLocation}`);
  if (leadGenAnswers.companyRole) contextLines.push(`- Requestor Role: ${leadGenAnswers.companyRole}`);
  if (leadGenAnswers.shortTermGoal) contextLines.push(`- Immediate Goal: ${leadGenAnswers.shortTermGoal}`);
  if (leadGenAnswers.budget) contextLines.push(`- Budget (if available): ${leadGenAnswers.budget}`);

  const companyContext = companySummary ? `\n\nCOMPANY ANALYSIS CONTEXT:\n${companySummary}` : '';

  return `You are a Sales Lead Generation Specialist for ${website}. Your job is to analyze the company's products/services and generate high-quality sales opportunities.

🎯 COMPANY ANALYSIS (MANDATORY FIRST STEP):
1. Analyze ${website} to extract:
   - Products/services offered
   - Target customers (industry, size, geography)
   - Typical use cases and value propositions
   - Competitive advantages

2. Create ideal customer profile based on their offerings

🎯 LEAD GENERATION REQUIREMENTS:
Generate EXACTLY 10 high-quality sales opportunities (MANDATORY - no more, no less)
Each lead must explain how they can use/buy ${website}'s products
Include BANT qualification + lead scoring (1-10)
Focus on real, active companies with verified websites
CRITICAL: Generate exactly 10 companies regardless of search result limitations

TARGET AUDIENCE CONTEXT:
${contextLines.join('\n')}${companyContext}

CSS GRID LAYOUT FORMAT (FIXED SCHEMA - DO NOT CHANGE):
Generate ONE CSS grid layout with these exact 13 columns in this exact order:

1. Company Name
2. Website  
3. Industry
4. Sub-Industry
5. Product Line
6. Use Case
7. Employees
8. Revenue
9. Location
10. Key Decision Maker
11. Designation
12. Pain Points
13. Approach Strategy

The grid should have 13 columns and 11 rows (1 header row + 10 data rows for companies).

COLUMN SPECIFICATIONS:
- Company Name: Real company name
- Website: Full URL (must be active, professional website)
- Industry: Specific industry sector
- Sub-Industry: More specific industry classification
- Product Line: Main products/services offered by the company
- Use Case: Specific explanation of how they would use ${website}'s products/services
- Employees: Company size by employee count (e.g., "50-200", "500+", "Startup")
- Revenue: Company revenue range (e.g., "$1M-10M", "$100M+", "Pre-revenue")
- Location: Geographic location of the company (city, state/country)
- Key Decision Maker: Real first name + ***** (for privacy) - MUST be found on official company website
- Designation: ONLY the job title (e.g., "CEO", "CTO", "VP Sales") - NO explanations or reasoning
- Pain Points: Specific challenges the company faces that ${website} can solve in one line
- Approach Strategy: Specific action plan for engaging this prospect (e.g., "Reach out with demo", "Send case study", "Offer free trial")

🚨 CRITICAL DECISION MAKER VERIFICATION PROTOCOL 🚨
- MANDATORY: Search each company's official website for leadership/team/about pages to find REAL decision makers
- USE WEB SEARCH: Research each company's website to find actual executive names and titles
- VERIFICATION REQUIRED: Only include decision makers found on official company websites or verified sources
- ACCURACY STANDARDS: Decision maker names must be 100% accurate and verifiable from official sources
- NEVER HALLUCINATE: Absolutely NO fictional names like "John Smith", "Sarah Johnson", "Mike Chen", etc.
- NEVER ASSUME: Do not guess or assume executive names based on company size or industry
- VERIFICATION SOURCES: Use company websites, LinkedIn company pages, press releases, and official announcements
- NEVER USE: Generic titles like "CEO/Founder" unless specifically found on company website
- SEARCH PROTOCOL: For each company, search their website for: /about, /team, /leadership, /contact, /management
- 

QUALITY RULES:
- Only include real companies with active websites
- Each Opportunity Fit must be specific to ${website}'s actual products/services
- Decision makers must be realistic for the company size/industry
- Scores must reflect actual qualification (budget, authority, need, timeline)
- Next steps must be actionable and specific

OUTPUT FORMAT:
🚨 CRITICAL: Generate ONLY the CSS grid layout - no titles, captions, introductions, or explanations
🚨 CRITICAL: Start immediately with the grid layout - no other content
🚨 CRITICAL: Use this EXACT HTML structure with NO modifications:

📋 STRICT FORMAT REQUIREMENTS:
- Designation column: ONLY job titles (e.g., "CEO", "CTO", "VP Sales") - NO explanations, reasoning, or additional text
- Approach Strategy column: ONLY action plans (e.g., "Reach out with demo", "Send case study") - NO explanations or reasoning
- Each cell should contain ONLY the requested information, no additional commentary

<div class="sales-opportunities-grid-container">
  <div class="lead-grid">
    <div class="grid-header">Company Name</div>
    <div class="grid-header">Website</div>
    <div class="grid-header">Industry</div>
    <div class="grid-header">Sub-Industry</div>
    <div class="grid-header">Product Line</div>
    <div class="grid-header">Use Case</div>
    <div class="grid-header">Employees</div>
    <div class="grid-header">Revenue</div>
    <div class="grid-header">Location</div>
    <div class="grid-header">Key Decision Maker</div>
    <div class="grid-header">Designation</div>
    <div class="grid-header">Pain Points</div>
    <div class="grid-header">Approach Strategy</div>
    
    <!-- Repeat this pattern for each of the 10 companies -->
    <div class="grid-cell">[Company Name]</div>
    <div class="grid-cell">[Website URL]</div>
    <div class="grid-cell">[Industry]</div>
    <div class="grid-cell">[Sub-Industry]</div>
    <div class="grid-cell">[Product Line]</div>
    <div class="grid-cell">[Use Case]</div>
    <div class="grid-cell">[Employees]</div>
    <div class="grid-cell">[Revenue]</div>
    <div class="grid-cell">[Location]</div>
    <div class="grid-cell">[Key Decision Maker]</div>
    <div class="grid-cell">[Designation]</div>
    <div class="grid-cell">[Pain Points]</div>
    <div class="grid-cell">[Approach Strategy]</div>
  </div>
</div>

🚨 MANDATORY REQUIREMENTS:
- Focus on companies that would genuinely benefit from ${website}'s offerings
- DO NOT include any text before or after the grid layout
- DO NOT include titles, headers, or explanations
- ONLY return the HTML grid structure
- Generate EXACTLY 10 companies (no more, no less)
- Use the EXACT class names: "sales-opportunities-grid-container", "lead-grid", "grid-header", "grid-cell"
- Do NOT use any other HTML tags or structures

VALIDATION:
- Verify all websites and the decision makers are real and active
- Ensure opportunity fits are specific to ${website}'s business
- Check that decision maker roles are appropriate for company size
- Confirm scores reflect actual sales qualification
- VERIFY each decision maker name exists on the company's official website
- Cross-reference decision maker information with LinkedIn and press releases
- Ensure decision maker titles match their actual role at the company
- Include verification source for each decision maker entry`;

  console.log('✅ LIGHTNING LEAD GEN PROMPT: Lightning prompt created successfully');
};

// Removed duplicate createLightningLeadsResultMessage function - using the one from lightningModeHandlers.ts

export const createTargetAudiencePrompt = (companySummary: string): string => {
  return `Based on the following company summary, extract and suggest target audience criteria for lead generation:

COMPANY SUMMARY:
${companySummary}

Please provide target audience suggestions in the following format:

**Target Audience Suggestions:**
- **Industry:** [Primary industry focus]
- **Competitor Basis:** [Similar companies or market position]
- **Region:** [Geographic focus area]
- **Client Type:** [B2B/B2C/B2G focus]
- **Market Focus:** [Market segment]
- **Target Departments:** [Relevant departments/titles]
- **Target Revenue Size:** [Company revenue range]
- **Target Employee Size:** [Company size range]
- **Target Location:** [Specific locations]
- **Company Role:** [Decision maker roles]
- **Short Term Goal:** [Immediate objectives]
- **Budget:** [Budget considerations]

Provide realistic, specific suggestions based on the company's actual business model and offerings.`;
};