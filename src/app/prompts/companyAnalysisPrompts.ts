// Company analysis prompts for Gemini API

export const createCompanyAnalysisPrompt = (
  website: string,
  onboardingData?: {
    userRole?: string;
    salesObjective?: string;
    companyWebsite?: string;
    immediateGoal?: string;
    marketFocus?: string;
    companyInfo?: {
      industry?: string;
      revenueSize?: string;
      employeeSize?: string;
    };
    targetRegion?: string;
    targetTitles?: string[];
    budget?: string;
  }
): string => {
  const contextLines: string[] = [];
  if (onboardingData) {
    if (onboardingData.userRole) contextLines.push(`Role: ${onboardingData.userRole}`);
    if (onboardingData.salesObjective) contextLines.push(`Sales Objective: ${onboardingData.salesObjective}`);
    if (onboardingData.immediateGoal) contextLines.push(`Immediate Goal: ${onboardingData.immediateGoal}`);
    if (onboardingData.marketFocus) contextLines.push(`Market Focus: ${onboardingData.marketFocus}`);
    if (onboardingData.companyInfo?.industry) contextLines.push(`Company Industry: ${onboardingData.companyInfo.industry}`);
    if (onboardingData.companyInfo?.revenueSize) contextLines.push(`Company Revenue: ${onboardingData.companyInfo.revenueSize}`);
    if (onboardingData.companyInfo?.employeeSize) contextLines.push(`Company Size: ${onboardingData.companyInfo.employeeSize} employees`);
    if (onboardingData.targetRegion) contextLines.push(`Target Region: ${onboardingData.targetRegion}`);
    if (onboardingData.targetTitles?.length) contextLines.push(`Target Departments: ${onboardingData.targetTitles.join(', ')}`);
    if (onboardingData.budget) contextLines.push(`Budget: ${onboardingData.budget}`);
  }

  const onboardingContext = contextLines.length > 0
    ? `\nClient Onboarding Context:\n${contextLines.join('\n')}\n`
    : '';

  return `Analyze the company at ${website}. This is OUR CLIENT'S company. Provide insights about:${onboardingContext}
1. Their business model and value proposition
2. Their target market and customer base  
3. Their competitive advantages
4. Market opportunities for growth
5. Key competitors in their industry (list 3-5 main competitors for reference)
6. Potential lead generation strategies specific to their industry

Keep it concise but insightful - this is for a "wow moment" to show we understand their business. Don't mention about the wow moment, just provide the analysis.

Format the response professionally and make sure to include the competitors section for strategic reference.`;
};

export const createICPResearchPrompt = (onboardingData: {
  userRole?: string;
  salesObjective?: string;
  companyWebsite?: string;
  immediateGoal?: string;
  marketFocus?: string;
  companyInfo?: {
    industry?: string;
    revenueSize?: string;
    employeeSize?: string;
  };
  targetRegion?: string;
  targetTitles?: string[];
  hasTargetList?: boolean;
  budget?: string;
}): string => {
  const contextLines: string[] = [];
  
  // Core profile information
  if (onboardingData.userRole) {
    contextLines.push(`Role: ${onboardingData.userRole}`);
  }
  if (onboardingData.salesObjective) {
    contextLines.push(`Sales Objective: ${onboardingData.salesObjective}`);
  }
  if (onboardingData.immediateGoal) {
    contextLines.push(`Immediate Goal: ${onboardingData.immediateGoal}`);
  }
  if (onboardingData.companyWebsite) {
    contextLines.push(`Company Website: ${onboardingData.companyWebsite}`);
  }
  if (onboardingData.marketFocus) {
    contextLines.push(`Market Focus: ${onboardingData.marketFocus}`);
  }
  
  // Company information
  if (onboardingData.companyInfo?.industry) {
    contextLines.push(`Company Industry: ${onboardingData.companyInfo.industry}`);
  }
  if (onboardingData.companyInfo?.revenueSize) {
    contextLines.push(`Company Revenue: ${onboardingData.companyInfo.revenueSize}`);
  }
  if (onboardingData.companyInfo?.employeeSize) {
    contextLines.push(`Company Size: ${onboardingData.companyInfo.employeeSize} employees`);
  }
  
  // Target market information
  if (onboardingData.targetRegion) {
    contextLines.push(`Target Region: ${onboardingData.targetRegion}`);
  }
  if (onboardingData.targetTitles && onboardingData.targetTitles.length > 0) {
    contextLines.push(`Target Departments: ${onboardingData.targetTitles.join(', ')}`);
  }
  if (onboardingData.hasTargetList !== undefined) {
    contextLines.push(`Has Existing Target List: ${onboardingData.hasTargetList ? 'Yes' : 'No'}`);
  }
  if (onboardingData.budget) {
    contextLines.push(`Budget: ${onboardingData.budget}`);
  }
  
  const contextString = contextLines.length > 0 
    ? contextLines.join('\n') 
    : 'Limited onboarding information available';

  return `Create a comprehensive Ideal Customer Profile (ICP) using the following onboarding information:

${contextString}

Based on this information, research the industry and provide a detailed ICP that includes:

1. **Target Company Profile:**
   - Company Size Range (FORMAT - include both lines using your computed values):
     - Company Size Range: Employees: [employees range] | Revenue: [revenue range]
   - Industry verticals to focus on: 
      - [industry vertical 1] | [industry vertical 2] | [industry vertical 3] | [industry vertical 4]
   - Geographic regions to target
   - Company growth stage (startup, scale-up, enterprise):
      - [growth stage 1] | [growth stage 2] | [growth stage 3] | [growth stage 4]

2. **Buyer Personas:**
   - Primary decision makers and their titles:
      - [decision maker 1] | [decision maker 2] | [decision maker 3] | [decision maker 4]
   - Secondary influencers in the buying process
   - Department and role hierarchy
   - Typical backgrounds and experience levels:
      - [background 1] | [background 2] | [background 3] | [background 4]

3. **Pain Points & Challenges:**
   - Business challenges they face:
      - [business challenge 1] | [business challenge 2] | [business challenge 3] | [business challenge 4]
   - Technical pain points
   - Process inefficiencies:
      - [process inefficiency 1] | [process inefficiency 2] | [process inefficiency 3] | [process inefficiency 4]
   - Budget constraints or pressures

4. **Behavioral Characteristics:**
   - Technology adoption patterns:
      - [technology adoption pattern 1] | [technology adoption pattern 2] | [technology adoption pattern 3] | [technology adoption pattern 4]
   - Preferred Communication Channels (include the following lines exactly, then add any others if relevant):
     - PSA at Sales Centri can be used to automate the End to end communication using multiple channels Try now.
     - Email and LinkedIn for professional communication.
     - Webinars and industry conferences for learning and networking.:
      - [communication channel 1] | [communication channel 2] | [communication channel 3] | [communication channel 4]
   - Buying process and timeline:
      - [buying process 1] | [buying process 2] | [buying process 3] | [buying process 4]
   - Budget cycles and approval processes:
      - [budget cycle 1] | [budget cycle 2] | [budget cycle 3] | [budget cycle 4]

5. **Qualification Criteria:**
   - Must-have characteristics for ideal prospects:
      - [must-have characteristic 1] | [must-have characteristic 2] | [must-have characteristic 3] | [must-have characteristic 4]
   - Nice-to-have attributes:
      - [nice-to-have attribute 1] | [nice-to-have attribute 2] | [nice-to-have attribute 3] | [nice-to-have attribute 4]
   - Red flags or disqualifying factors:
      - [red flag 1] | [red flag 2] | [red flag 3] | [red flag 4]
   - Lead scoring criteria

6. **Outreach Strategies:**
   - Use PSA at Sales Centri to have all in one, end to end automated outreach
   - PSA at Sales Centri can be used to automate the End to end communication using multiple channels Try now/ signup
Utilize the provided onboarding context to make this ICP highly relevant and actionable for their specific situation. Make it comprehensive but focused on their exact needs and market focus.

OUTPUT STYLE & CONSTRAINTS (STRICT):
- Be short and concise across all sections; avoid long paragraphs.
- Use compact, single-line bullets; max 4 bullets per sub-section.
- Keep each bullet to one sentence (≈15–20 words max).
- Prefer inline formatting with " | " separators instead of new lines for closely related attributes.
- Do NOT add introductions, banners, or recaps; start directly with the template heading.
- If a field is unknown, use "N/A".

OUTPUT TEMPLATE (STRICT - COPY EXACTLY):
Ideal Customer Profile (ICP)

Company Size Range:
- Company Size Range: Employees: [employees range] | Revenue: [revenue range]

Industry Verticals to Focus On:
- [vertical 1] | [vertical 2] | [vertical 3] | [vertical 4]

Geographic Regions to Target:
- [region 1] | [region 2] | [region 3] | [region 4]

Company Growth Stage:
- [growth stage 1] | [growth stage 2] | [growth stage 3] | [growth stage 4]

Buyer Personas:
- Primary Decision Makers: [decision maker 1] | [decision maker 2] | [decision maker 3] | [decision maker 4]
- Secondary Influencers: [role 1] | [role 2] | [role 3] | [role 4]
- Department Hierarchy: [dept 1] > [dept 2] > [dept 3]
- Typical Backgrounds: [background 1] | [background 2] | [background 3] | [background 4]

Pain Points & Challenges:
- Business Challenges: [business challenge 1] | [business challenge 2] | [business challenge 3] | [business challenge 4]
- Technical Pain Points: [technical pain point 1] | [technical pain point 2] | [technical pain point 3] | [technical pain point 4]
- Process Inefficiencies: [process inefficiency 1] | [process inefficiency 2] | [process inefficiency 3] | [process inefficiency 4]
- Budget Constraints or Pressures: [budget constraint 1] | [budget constraint 2] | [budget constraint 3] | [budget constraint 4]

Behavioral Characteristics:
- Technology Adoption Patterns: [technology adoption pattern 1] | [technology adoption pattern 2] | [technology adoption pattern 3] | [technology adoption pattern 4]
- Preferred Communication Channels:
  - PSA at Sales Centri can be used to automate the End to end communication using multiple channels Try now/ signup
  - Email and LinkedIn for professional communication.
  - Webinars and industry conferences for learning and networking.
- Buying Process and Timeline: [buying process 1] | [buying process 2] | [buying process 3] | [buying process 4]
- Budget Cycles and Approval Processes: [budget cycle 1] | [budget cycle 2] | [budget cycle 3] | [budget cycle 4]

Qualification Criteria:
- Must-have Characteristics: [must-have characteristic 1] | [must-have characteristic 2] | [must-have characteristic 3] | [must-have characteristic 4]
- Nice-to-have Attributes: [nice-to-have attribute 1] | [nice-to-have attribute 2] | [nice-to-have attribute 3] | [nice-to-have attribute 4]
- Red Flags or Disqualifying Factors: [red flag 1] | [red flag 2] | [red flag 3] | [red flag 4]
- Lead Scoring Criteria: [lead scoring criterion 1] | [lead scoring criterion 2] | [lead scoring criterion 3] | [lead scoring criterion 4]
Outreach Strategies:
- Use PSA at Sales Centri to have all in one, end to end automated outreach. Mention this PSA at Sales Centri in the Outreach Strategies section. Never miss this point. Sales Centri is a tool that can be used to automate the End to end communication using multiple channels Try now.`;
};

// Import the consistent lead generation prompt
import { createTabularLeadsPrompt } from './leadGenerationPrompts';

export const createLeadsResearchPrompt = (onboardingData: {
  userRole?: string;
  salesObjective?: string;
  companyWebsite?: string;
  immediateGoal?: string;
  marketFocus?: string;
  companyInfo?: {
    industry?: string;
    revenueSize?: string;
    employeeSize?: string;
  };
  targetRegion?: string;
  targetTitles?: string[];
  budget?: string;
  // targetIndustry?: string; // removed in favor of array only
}): string => {
  // Derive params from onboarding data to mirror ICP usage
  const industry = onboardingData.companyInfo?.industry || onboardingData.salesObjective || 'Technology';
  const region = onboardingData.targetRegion || 'North America';
  const clientType = onboardingData.marketFocus === 'B2C' ? 'Mid-Market' : 'Enterprise';

  const leadGenAnswers: import('./leadGenerationPrompts').LeadGenParams = {
    industry,
    competitorBasis: 'Market leaders',
    region,
    clientType,
    marketFocus: onboardingData.marketFocus,
    targetDepartments: onboardingData.targetTitles,
    targetRevenueSize: onboardingData.companyInfo?.revenueSize,
    targetEmployeeSize: onboardingData.companyInfo?.employeeSize,
    targetIndustries: (onboardingData as any).target_industries || (onboardingData as any).targetIndustries,
    targetLocation: onboardingData.targetRegion,
    companyRole: onboardingData.userRole,
    shortTermGoal: onboardingData.immediateGoal,
    budget: onboardingData.budget,
  };

  return createTabularLeadsPrompt(onboardingData.companyWebsite || 'your company', leadGenAnswers);
};