// Onboarding and focus mode message templates

export const createWelcomeMessage = (onboardingData: {
  userRole?: string;
  salesObjective?: string;
  immediateGoal?: string;
  companyWebsite?: string;
  marketFocus?: string;
  companyInfo?: {
    industry?: string;
    revenueSize?: string;
    employeeSize?: string;
  };
  // Target industry selections (new multi-select)
  targetIndustries?: string[];
  // Legacy single-target field for backward compatibility
  targetIndustry?: string;
  targetRegion?: string;
  targetLocation?: string;
  targetTitles?: string[];
  hasTargetList?: boolean;
  budget?: string;
}): string => {
  const profileItems: string[] = [];
  
  // Core profile information
  if (onboardingData.userRole) {
    profileItems.push(`- **Role:** ${onboardingData.userRole}`);
  }
  if (onboardingData.salesObjective) {
    profileItems.push(`- **Objective:** ${onboardingData.salesObjective}`);
  }
  if (onboardingData.immediateGoal) {
    profileItems.push(`- **Goal:** ${onboardingData.immediateGoal}`);
  }
  if (onboardingData.companyWebsite) {
    profileItems.push(`- **Company Website:** ${onboardingData.companyWebsite}`);
  }
  if (onboardingData.marketFocus) {
    profileItems.push(`- **Market Focus:** ${onboardingData.marketFocus}`);
  }
  
  // Company information
  if (onboardingData.companyInfo?.revenueSize) {
    profileItems.push(`- **Company Revenue:** ${onboardingData.companyInfo.revenueSize}`);
  }
  if (onboardingData.companyInfo?.employeeSize) {
    profileItems.push(`- **Company Size:** ${onboardingData.companyInfo.employeeSize}`);
  }
  
  // Target market information
  if (onboardingData.targetIndustries && onboardingData.targetIndustries.length > 0) {
    profileItems.push(`- **Target Industries:** ${onboardingData.targetIndustries.join(', ')}`);
  }
  if (onboardingData.targetRegion) {
    profileItems.push(`- **Target Region:** ${onboardingData.targetRegion}`);
  }
  if (onboardingData.targetLocation && onboardingData.targetLocation.toLowerCase() !== 'null') {
    profileItems.push(`- **Target Location:** ${onboardingData.targetLocation}`);
  }
  if (onboardingData.targetTitles && onboardingData.targetTitles.length > 0) {
    profileItems.push(`- **Target Departments:** ${onboardingData.targetTitles.join(', ')}`);
  }
  if (onboardingData.hasTargetList !== undefined) {
    profileItems.push(`- **Existing Target List:** ${onboardingData.hasTargetList ? 'Yes' : 'No'}`);
  }
  if (onboardingData.budget) {
    profileItems.push(`- **Budget:** ${onboardingData.budget}`);
  }
  
  // Fallback if no information is available
  if (profileItems.length === 0) {
    profileItems.push('- **Role:** Sales Professional');
    profileItems.push('- **Objective:** Growing sales');
    profileItems.push('- **Goal:** Improving results');
  }

  return `Welcome to Focus Mode! 🎯<br/><br/>I've reviewed your onboarding information and I'm ready to help you with personalized sales strategies.<br/><br/>**Your Profile:**<br/>${profileItems.join('<br/>')}<br/><br/>Let me analyze your company and create a strategic plan for you. <br/>**We are processing your profile and this might take upto 30-60 seconds...**`;
};

export const createICPQuestionMessage = (): string => {
  return ` Lead Generation Strategy 🎯

<br/>Now let's focus on finding your ideal customers. 

<br/>**Have you already defined your Ideal Customer Profile (ICP)?**

<br/>An ICP helps us target the right prospects and generate higher-quality leads.

<div style="margin: 20px 0; display: flex; gap: 12px; flex-wrap: wrap;">
  <button onclick="handleICPResponse('no')" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); font-size: 14px; display: inline-block !important; visibility: visible !important; opacity: 1 !important;">
      No, help me create one
  </button>
  <button onclick="handleICPResponse('yes')" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); font-size: 14px; display: inline-block !important; visibility: visible !important; opacity: 1 !important;">
      Yes, I have my ICP ready
  </button>
</div>`;
};

export const createICPCreationMessage = (): string => {
  return ` Creating Your Ideal Customer Profile 🎯

<br/>🔍 **Researching your industry and market...**
<br/>🌐 **Internet Mode: ACTIVE**

<br/>Let me analyze your industry patterns and create a comprehensive ICP for you. <br/>**This might take 20-30 seconds...**`;
};

export const createLeadsGenerationMessage = (): string => {
  return ` Excellent! Let's Find Your Leads 🎯

Since you already have your ICP defined, let me ask a few strategic questions to ensure we target the right prospects and gather competitive intelligence.

<div style="margin: 20px 0;">
  <button onclick="startLeadGenQuestions()" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); font-size: 16px;">
    🎯 Start Prospect Research
  </button>
</div>`;
};

export const createResearchMessage = (leadGenQuestions: {
  industry: string;
  competitorBasis: string;
  region: string;
  clientType: string;
}): string => {
  return ` Generating Comprehensive Lead Research 🔍

🎯 **Research Parameters Set:**
- Industry: ${leadGenQuestions.industry}
- Competitor Basis: ${leadGenQuestions.competitorBasis} 
- Region: ${leadGenQuestions.region}
- Client Focus: ${leadGenQuestions.clientType}

🌐 **Internet Research Mode: ACTIVATED**
📊 **Generating tabular data for leads and competitors...**

*This comprehensive research may take a 30-60 seconds...*`;
};

export const createFallbackMessage = (): string => {
  return ` Welcome to Focus Mode! 🎯

I have your profile information and I'm ready to help you with personalized sales strategies.

What would you like to focus on first?`;
};

export const createLeadsActivationMessage = (): string => {
  return ` Generating Your Prospects 🎯

🔍 **Internet Research Mode: ACTIVATED**
🌐 **Searching for high-quality prospects...**

*This may take a moment while I gather comprehensive data...*`;
};
