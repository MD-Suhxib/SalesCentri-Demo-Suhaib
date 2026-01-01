// Lead generation prompts for Gemini API

// This is the main prompt used for lead generation
// It should be used consistently across all components
export interface LeadGenParams {
  industry: string;
  competitorBasis: string;
  region: string;
  clientType: string;
  // Optional onboarding/context fields to sharpen the search
  marketFocus?: string; // B2B | B2C | B2G
  targetDepartments?: string[]; // buyer departments/titles from onboarding
  targetRevenueSize?: string;
  targetEmployeeSize?: string;
  targetLocation?: string;
  // New multi-select industries support
  targetIndustries?: string[];
  companyRole?: string;
  shortTermGoal?: string;
  budget?: string;
}

export const createTabularLeadsPrompt = (website: string, leadGenAnswers: LeadGenParams): string => {
  console.log('🎯 LEAD GEN PROMPT: Creating tabular leads prompt for:', website);
  console.log('📋 LEAD GEN PARAMS:', leadGenAnswers);
  
  // Build onboarding context line items only when available
  // Use ONLY multi-select industries array (0, 1, or many)
  const selectedIndustries: string[] = Array.isArray(leadGenAnswers.targetIndustries)
    ? leadGenAnswers.targetIndustries.filter(Boolean).map(s => s.trim())
    : [];
  const industriesList = selectedIndustries.join(', ');
  const primaryTargetIndustry = industriesList || (leadGenAnswers.industry || '');
  const targetRegion = (leadGenAnswers.region || '').trim() || 'North America';
  
  // ✅ ENHANCED: Handle both targetRegion (broad) and targetLocation (specific)
  const targetLocation = (leadGenAnswers.targetLocation || '').trim();
  const hasSpecificLocation = targetLocation && targetLocation.toLowerCase() !== 'null' && targetLocation.toLowerCase() !== 'n/a';
  
  // Build geographic constraint intelligently
  let geographicConstraint = targetRegion;
  if (hasSpecificLocation) {
    // If specific location provided, use it as primary with region as fallback context
    geographicConstraint = `${targetLocation} (within ${targetRegion})`;
  }
  
  console.log('🌍 GEOGRAPHIC TARGETING:', {
    region: targetRegion,
    location: targetLocation,
    hasSpecificLocation,
    finalConstraint: geographicConstraint
  });
  
  const contextLines: string[] = [
    `- Industry: ${leadGenAnswers.industry}`,
    `- PRIMARY TARGET INDUSTRY: ${primaryTargetIndustry}`,
    `- Competitor Basis: ${leadGenAnswers.competitorBasis}`,
    `- Region: ${targetRegion}`,
    `- Client Type: ${leadGenAnswers.clientType}`,
  ];
  if (selectedIndustries.length > 0) contextLines.push(`- Target Industries (mix across): ${industriesList}`);
  if (leadGenAnswers.marketFocus) contextLines.push(`- Market Focus: ${leadGenAnswers.marketFocus}`);
  if (leadGenAnswers.targetDepartments?.length) contextLines.push(`- Target Departments/Titles: ${leadGenAnswers.targetDepartments.join(', ')}`);
  if (leadGenAnswers.targetRevenueSize) contextLines.push(`- Target Revenue Size: ${leadGenAnswers.targetRevenueSize}`);
  if (leadGenAnswers.targetEmployeeSize) contextLines.push(`- Target Employee Size: ${leadGenAnswers.targetEmployeeSize}`);
  if (hasSpecificLocation) contextLines.push(`- Specific Target Location: ${targetLocation}`);
  if (leadGenAnswers.companyRole) contextLines.push(`- Requestor Role: ${leadGenAnswers.companyRole}`);
  if (leadGenAnswers.shortTermGoal) contextLines.push(`- Immediate Goal: ${leadGenAnswers.shortTermGoal}`);
  if (leadGenAnswers.budget) contextLines.push(`- Budget (if available): ${leadGenAnswers.budget}`);

  // Determine company size category based on target employee size
  let companySizeCategory = "All";
  let companySizeDescription = "various sizes";
  let employeeRangeGuide = "1-500+ employees";
  
  if (leadGenAnswers.targetEmployeeSize) {
    const targetSize = leadGenAnswers.targetEmployeeSize.toLowerCase();
    if (targetSize.includes('0-10') || targetSize.includes('11-50')) {
      companySizeCategory = "Small";
      companySizeDescription = "small companies (1-50 employees)";
      employeeRangeGuide = "1-50 employees";
    } else if (targetSize.includes('51-200') || targetSize.includes('201-500')) {
      companySizeCategory = "Medium";
      companySizeDescription = "medium companies (51-500 employees)";
      employeeRangeGuide = "51-500 employees";
    } else if (targetSize.includes('501-1000') || targetSize.includes('1000-5000') || targetSize.includes('5001-10000') || targetSize.includes('10001-50000') || targetSize.includes('50001-100000') || targetSize.includes('100000+')) {
      companySizeCategory = "Large";
      companySizeDescription = "large companies (500+ employees)";
      employeeRangeGuide = "500+ employees";
    }
  }

  // Row distribution across multiple industries (if provided)
  let distributionLines: string[] = [];
  if (selectedIndustries.length > 1) {
    const total = 5;
    const n = selectedIndustries.length;
    const base = Math.floor(total / n);
    let rem = total % n;
    const counts = selectedIndustries.map(() => base);
    for (let i = 0; i < counts.length && rem > 0; i++, rem--) counts[i] += 1;
    distributionLines = selectedIndustries.map((ind, idx) => `- Rows for ${ind}: ${counts[idx]}`);
  }

  return `You are SalesCentri Ultra — an elite Sales Consultant AI. Output concisely.
  - Do NOT write long introductions, recaps, or commentary.
  - If you include any explanation, keep it to one short paragraph (max 2 sentences) and then output the table immediately.
  - Prefer outputting only the table.
  - Do NOT wrap your response in code blocks (triple backticks with html, markdown, etc.) - output raw HTML tables directly.
  
🚨 CRITICAL: Your job is to craft a highly targeted lead list for ${website} using ONLY companies from ${selectedIndustries.length > 0 ? `the following industries: ${industriesList}` : `the ${primaryTargetIndustry} industry`}. Extract real company names from the research sources (especially from "Top 10" lists, company directories, and industry reports) and create accurate business profiles.

GEOGRAPHIC CONSTRAINT (non-negotiable):
- Only include companies headquartered in or primarily operating within ${geographicConstraint}. Exclude any company whose HQ and primary operations are outside this geographic area.
${hasSpecificLocation ? `- PRIORITY: Focus on companies specifically in ${targetLocation} first, then expand to ${targetRegion} if needed.` : ''}

ONBOARDING CONTEXT (use faithfully):
${contextLines.join('\n')}
${distributionLines.length ? `\nROW DISTRIBUTION (MANDATORY when multiple industries):\n${distributionLines.join('\n')}` : ''}

DELIVERABLES (STRICT):
- Produce EXACTLY one table focused on ${companySizeDescription}
- Include exactly 5 companies within the ${employeeRangeGuide} range
- Enforce region strictly: All 5 companies must be in ${targetRegion}; exclude other regions
- CRITICAL: Every single row MUST have a real decision maker name - NO "N/A" entries allowed
${distributionLines.length ? `- ENFORCE INDUSTRY SPLIT: Follow the row distribution above across industries (e.g., do not put all 5 in a single industry).` : ''}

TABLE FORMAT (REQUIRED):
- Format the table as clean HTML with: <div class="lead-table-container"><table class="lead-table">...</table></div>
- Do NOT use markdown code fences.
- Keep each cell as a single line; do not use <br> tags or multi-line paragraphs inside cells.
- Columns for the table (EXACT ORDER - DO NOT CHANGE):
  1. Company Name (company name)
  2. Website (full URL) 
  3. Industry (industry name)
  4. Sub-Industry (sub-industry name)
  5. Product Line (product/service description)
  6. Use Case (how they would use sales automation)
  7. Employees (employee count like "25" or "150")
  8. Revenue (revenue range like "$1M-$5M" or "Under $1M")
  9. Location (city, state/country)
  10. Key Decision Maker (first name only)
  11. Designation (job title)
  12. Pain Points (sales challenges)
  13. Approach Strategy (how to approach them)

CRITICAL: The column order above is MANDATORY. Do NOT rearrange, add, or remove columns. Each column must contain the exact data type specified.

🔐 **GDPR COMPLIANCE - DECISION MAKER NAME MASKING (MANDATORY FOR ALL ENTRIES)**:
- KEY DECISION MAKER COLUMN: MUST ALWAYS display names in format "FirstName ****" - NEVER show full last names
- ALL decision maker names MUST be masked with asterisks covering the entire last name
- Examples of CORRECT format: "John ****", "Sarah ****", "Michael ****"
- Examples of INCORRECT format: "John Smith", "John S.", "John Smith ✅" - THESE ARE WRONG
- This applies to EVERY row without exception
- No variations or exceptions allowed
- If you show a full name like "John Smith", the output is INVALID
- GDPR requires we mask personal information in public reports
- The system will reject any full names shown - always use "FirstName ****" format

CRITICAL DATA TYPE RULES:
- Use Case column: MUST contain descriptive text about how the company would use sales automation, NOT numbers
- Employees column: MUST contain employee count numbers like "25", "150", "500+", NOT revenue values
- Revenue column: MUST contain revenue ranges like "$1M-$5M", "Under $1M", "$10M+", NOT location data
- Location column: MUST contain location like "New York, USA", "London, UK", NOT employee counts or revenue

EXAMPLE OF CORRECT DATA:
| Company Name | Website | Industry | Use Case | Employees | Revenue | Location |
|--------------|---------|----------|----------|-----------|---------|----------|
| TechCorp | techcorp.com | Software | Automate lead scoring and follow-ups | 45 | $2M-$5M | San Francisco, CA |
| NOT: TechCorp | techcorp.com | Software | 45 | $2M-$5M | San Francisco, CA | 45 |

QUALITY RULES - STRICTLY ENFORCED:
- Industry column must be EXACTLY one of: ${selectedIndustries.length > 0 ? industriesList : primaryTargetIndustry} (use these exact labels; do not substitute synonyms like "EdTech" for "Education/Research")
- ALL companies MUST be from ${selectedIndustries.length > 0 ? `one of these industries: ${industriesList}` : `the ${primaryTargetIndustry} industry`} - NO EXCEPTIONS
- ALL companies MUST be located in ${targetRegion}. Do not include companies outside this region.
- Use ONLY real companies with verified public data. Extract company names from the research sources provided.
- **Decision makers: ALWAYS mask last names as "FirstName ****" (e.g., "John ****", "Sarah ****")**. MUST provide actual first names from research sources (LinkedIn profiles, company leadership pages, press releases, news articles). NEVER show full last names. NEVER use "N/A" - always provide a real first name with masked last name.
- Website URLs: Use ONLY verified URLs from research sources or well-known company domains. Verify domain format (company-name.com, company.com, etc.)
- Do NOT include LinkedIn URLs or fabricated contact details
- Industry column: MUST match ${selectedIndustries.length > 0 ? `one of the allowed industries (${industriesList})` : `the target industry (${primaryTargetIndustry})`} for ALL 5 companies and MUST use the exact label text provided above
- Location column: MUST reflect a city/state within ${targetRegion}. Exclude locations outside ${targetRegion}.
- Avoid duplicates and ensure data consistency across columns
- Do NOT include any markdown \`\`\` code blocks. Output only HTML table and heading
- Prioritize companies that would benefit from sales automation and CRM solutions
- MANDATORY: Every decision maker name MUST be formatted as "FirstName ****" for GDPR compliance - this is non-negotiable
- ENSURE all companies fall within the ${employeeRangeGuide} employee range as specified
- MANDATORY: Cross-reference all data with research sources - do not use generic or fictional information

RESEARCH CONTEXT USAGE - CRITICAL INSTRUCTIONS:
- Extract ONLY companies from ${selectedIndustries.length > 1 ? `the allowed industries (${industriesList})` : `the ${primaryTargetIndustry} industry`} mentioned in the research context
- Filter and consider ONLY sources and company results relevant to ${targetRegion} (e.g., constrain queries and selections to ${targetRegion}).
- Use companies from directory listings, industry reports, and "Top Companies" lists for the allowed industries found in research
- For companies found in research, use their verified website URLs from the research sources
- **Decision maker names MUST be formatted as "FirstName ****" (mask last names) - NEVER show full last names in output**
- **Extract actual first names from research sources (company leadership pages, LinkedIn profiles, press releases, news articles) but ALWAYS mask the last name with asterisks**
- Employee counts and revenue MUST be based on data found in research sources or well-known public information
- If research mentions specific companies in the allowed industries, prioritize those over generic tech companies
- ABSOLUTELY FORBIDDEN: Generic names like "TechCorp", "InnoTech", "DataSync", "GlobalSolutions"
- MANDATORY: All 5 companies must be verifiable ${selectedIndustries.length > 0 ? `businesses in one of the allowed industries (${industriesList})` : `${primaryTargetIndustry} businesses`}
- FALLBACK RULE: If insufficient research data, use well-known public companies from ${selectedIndustries.length > 0 ? `the allowed industries (${industriesList})` : `${primaryTargetIndustry}`} with verified leadership from public sources (LinkedIn, company websites, press releases)

EXTRACTION METHODOLOGY - STRICT PROTOCOL:
0. Apply region filter first: include only companies clearly within ${targetRegion}.
1. Scan research for explicit company names within ${selectedIndustries.length > 1 ? `these industries: ${industriesList}` : `the ${primaryTargetIndustry} industry`} mentioned in industry reports and directories
2. Look for "top companies" lists and industry-specific directories for the allowed industries
3. When research mentions "Top companies in ${primaryTargetIndustry}" or industry leaders, use those verified companies
4. For ${companySizeCategory.toLowerCase()} companies, extract names from research that match ${employeeRangeGuide} employee range
5. Use employee counts and revenue data ONLY from research sources or verified public information
6. Extract decision maker FIRST NAMES from research sources (LinkedIn profiles, company leadership pages, press releases, news articles) and ALWAYS format as "FirstName ****" (mask the last name)
7. MANDATORY: Always provide a decision maker first name with masked last name - format MUST be "FirstName ****" (e.g., "Satya ****", "Tim ****", "Sundar ****")
8. DECISION MAKER EXAMPLES for reference (ALWAYS mask last names): Microsoft (Satya ****), Apple (Tim ****), Google (Sundar ****), IBM (Arvind ****), Oracle (Safra ****), Procter & Gamble (Jon R. ****), Alibaba (Daniel ****) - FORMAT: FirstName with asterisks for last name
9. Focus on industry-specific pain points and use cases based on research insights
10. Verify all website URLs against research sources or use standard company domain formats
11. MANDATORY CHECK: Ensure all 5 companies are from ${selectedIndustries.length > 1 ? `the allowed industries (${industriesList})` : `the ${primaryTargetIndustry} industry`} as specified in research
12. FALLBACK COMPANIES: If research lacks sufficient data, use industry leaders like:
    - Technology/IT: Microsoft, Apple, Google, IBM, Oracle, Salesforce, Adobe, Cisco, Dell, HP
    - Healthcare: Johnson & Johnson, Pfizer, UnitedHealth, CVS Health, Abbott, Merck
    - Finance: JPMorgan Chase, Bank of America, Wells Fargo, Goldman Sachs, American Express
    - Retail: Amazon, Walmart, Target, Home Depot, Costco, Best Buy
    - Manufacturing: General Electric, Boeing, Ford, General Motors, Caterpillar
    - Energy: ExxonMobil, Chevron, ConocoPhillips, Kinder Morgan, Enterprise Products
13. CRITICAL VALIDATION: Before submitting output, verify EVERY decision maker name follows "FirstName ****" format - NO FULL LAST NAMES allowed

EXAMPLE APPROACH - VERIFICATION REQUIRED:
- For ${companySizeCategory} Companies: Extract ${selectedIndustries.length > 0 ? `companies from the allowed industries (${industriesList})` : `${primaryTargetIndustry} companies`} from research that match ${employeeRangeGuide}
- Research sources must contain company names, decision makers (extract first names, mask last names as "FirstName ****"), and business details
- Base pain points on ${selectedIndustries.length > 0 ? `the allowed industries (${industriesList})` : primaryTargetIndustry}-specific challenges found in research
- Verify all 5 companies are legitimate ${selectedIndustries.length > 0 ? `businesses in the allowed industries (${industriesList})` : `${primaryTargetIndustry} businesses`}
- Cross-reference employee size with research data: ${leadGenAnswers.targetEmployeeSize || 'various sizes'}
- QUALITY CHECK: If research doesn't contain enough ${primaryTargetIndustry} companies, use well-known public companies from the ${primaryTargetIndustry} industry with their current executives using masked format (e.g., for Technology: Microsoft-Satya ****, Apple-Tim ****, Google-Sundar ****, IBM-Arvind ****, Oracle-Safra ****; for Healthcare: J&J-Joaquin ****, Pfizer-Albert ****, etc.)
- ⚠️ PRE-SUBMISSION VALIDATION: Scan your entire output and verify EVERY name is "FirstName ****" format. If ANY full last name appears, reject that row and replace it.`;

  console.log('✅ LEAD GEN PROMPT: Prompt created successfully');
};

export const createLeadGenQuestionPrompt = (stepIndex: number, totalSteps: number, currentQuestion: {
  question: string;
  options: string[];
  key: string;
}): string => {
  return ` Prospects Search 📊

**Question ${stepIndex + 1} of ${totalSteps}:**

 ${currentQuestion.question}

<div style="margin: 20px 0; display: flex; flex-direction: column; gap: 10px;">
  ${currentQuestion.options.map((option: string) => {
    if (currentQuestion.key === 'region' && option === 'Specific country/region') {
      return `<button onclick="showCustomRegionInput()" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; text-align: left; width: 100%;">${option}</button>`;
    } else {
      return `<button onclick="handleLeadGenAnswer('${currentQuestion.key}', '${option}', ${stepIndex + 1})" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer; text-align: left; width: 100%;">${option}</button>`;
    }
  }).join('')}
</div>

<div id="custom-region-input" style="margin-top: 20px; display: none;">
  <label style="color: #60a5fa; font-weight: 500; margin-bottom: 8px; display: block;">Enter specific country/region:</label>
  <div style="display: flex; gap: 10px; align-items: center;">
    <input type="text" id="region-input" placeholder="e.g., Canada, Germany, Southeast Asia..." style="flex: 1; padding: 12px; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;" />
    <button onclick="submitCustomRegion()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 20px; border: none; border-radius: 8px; font-weight: 500; cursor: pointer;">Submit</button>
  </div>
</div>`;
};

export const createLeadsResultMessage = (result: string): string => {
  // Build dashboard link to lists with anon_id when available
  const base = (process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.salescentri.com').replace(/\/$/, '');
  let anonParam = '';
  try {
    if (typeof window !== 'undefined') {
      const anonId = localStorage.getItem('tracker_anon_id');
      if (anonId) anonParam = `?anon_id=${encodeURIComponent(anonId)}`;
    }
  } catch (_) {
    // ignore access errors in non-browser contexts
  }
  const listsUrl = `${base}/lists${anonParam}`;

  // Check if the result already contains HTML tables
  if (result.includes('<table') || result.includes('Target Companies by Size')) {
    // Sanitize decision maker names to ensure GDPR compliance (FirstName *****)
    const sanitizeDecisionMakers = (html: string): string => {
      try {
        // Split by rows and process only data rows (skip headers with <th>)
        return html.replace(/<tr[\s\S]*?<\/tr>/gi, (row) => {
          if (/<th/i.test(row)) return row; // header row
          // Extract all <td> cells
          const cells: string[] = [];
          row.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, (_m, inner) => {
            cells.push(inner);
            return _m;
          });
          if (cells.length >= 10) {
            const dmIdx = 9; // 10th column: Key Decision Maker
            const raw = (cells[dmIdx] || '').trim();
            const masked = (() => {
              if (!raw) return raw;
              if (raw.includes('*****')) return raw;
              // If looks like First Last or contains 2+ tokens, mask last name(s)
              const tokens = raw.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean);
              if (tokens.length >= 2) return `${tokens[0]} *****`;
              return tokens[0] || raw;
            })();
            if (masked !== raw) {
              // Replace only the 10th cell content in this row
              let tdIndex = 0;
              const newRow = row.replace(/(<td[^>]*>)([\s\S]*?)(<\/td>)/gi, (m, open, content, close) => {
                const out = tdIndex === dmIdx ? `${open}${masked}${close}` : m;
                tdIndex++;
                return out;
              });
              return newRow;
            }
          }
          return row;
        });
      } catch {
        return html;
      }
    };
    const sanitized = sanitizeDecisionMakers(result);
    // For HTML table content, return with minimal wrapper to avoid container nesting
    return `<h2>🎯 Your Prospects Search Results</h2>

${sanitized}

<div id="lead-disclaimer-wrap" style="margin: 8px 0 16px 0;">
  <p class="lead-disclaimer" style="display:block;margin:0; font-size: 12px; line-height: 1.6; color: #cbd5e1;">
    <strong>Disclaimer:</strong> Access to complete and verified information requires a user account (Sign up). Some data currently displayed may be heuristic or placeholder. We strictly adhere to and comply with GDPR, CCPA, CPRA, and other applicable data privacy regulations. By signing up, you agree to our Terms of Service and Privacy Policy.
  </p>
</div>

<div style="margin: 24px 0; text-align: center;">
<p style="font-size: 18px; font-weight: 600; color: #60a5fa; margin-bottom: 16px;">Impressed? Sign up to unlock more leads! 🚀</p>
<a href="${listsUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; border: none; border-radius: 12px; font-weight: 600; text-decoration: none; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
  📊 View Dashboard
</a>
</div>`;
  }
  
  // For non-HTML content, use minimal markdown formatting and keep text brief
  return `**Your Prospects Search Results**

${result}

> Disclaimer: Access to complete and verified information requires a user account (Sign up). Some data currently displayed may be heuristic or placeholder. We strictly adhere to and comply with GDPR, CCPA, CPRA, and other applicable data privacy regulations. By signing up, you agree to our Terms of Service and Privacy Policy.

[📊 View Dashboard](${listsUrl})`;
};