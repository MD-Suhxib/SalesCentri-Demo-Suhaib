import { LightningInputs } from '../../types/lightningMode';


// Track processing state to prevent duplicate calls
let isProcessing = false;

// Track whether all questions have been answered
let allQuestionsAnswered = false;

/**
 * Check if API call should be debounced
 */
export function shouldDebounceApiCall(): boolean {
  const lastCall = localStorage.getItem('lastLightningApiCall');
  if (!lastCall) return false;
  
  const timeSinceLastCall = Date.now() - parseInt(lastCall);
  return timeSinceLastCall < 2000; // 2 second debounce
}

/**
 * Mark all questions as complete
 */
export function markQuestionsComplete(): void {
  allQuestionsAnswered = true;
  localStorage.setItem('lightning_questions_complete', 'true');
  console.log('✅ All Lightning Mode questions marked as complete');
}

/**
 * Check if all questions have been answered
 */
export function areQuestionsComplete(): boolean {
  return allQuestionsAnswered || localStorage.getItem('lightning_questions_complete') === 'true';
}

/**
 * Reset question state for new session
 */
export function resetQuestionState(): void {
  allQuestionsAnswered = false;
  localStorage.removeItem('lightning_questions_complete');
  localStorage.removeItem('lightning_summary_ready');
  localStorage.removeItem('lightning_summary_posted');
  console.log('🔄 Lightning Mode question state reset');
}

/**
 * Start background processing for Lightning Mode
 */
export async function startBackgroundProcessing(inputs: LightningInputs): Promise<void> {
  if (isProcessing) {
    console.log('🔍 Background processing already in progress, skipping...');
    return;
  }

  isProcessing = true;
  
  try {
    console.log('🔍 Starting Lightning Mode background processing...', { inputs });
    
    // Check if summary was already generated to prevent duplicates
    const summaryReady = localStorage.getItem('lightning_summary_ready');
    const existingSummary = localStorage.getItem('lightning_company_summary');
    
    console.log('🔍 Background processing state check:', {
      summaryReady,
      hasExistingSummary: !!existingSummary,
      summaryLength: existingSummary?.length || 0
    });
    
    if (summaryReady && existingSummary) {
      console.log('🔍 Company summary already generated, skipping...');
      return;
    }
    // If the ready flag exists without a stored summary (stale state), clear it to allow regeneration
    if (summaryReady && !existingSummary) {
      console.log('⚠️ Stale lightning_summary_ready flag detected without summary. Clearing flag and regenerating...');
      localStorage.removeItem('lightning_summary_ready');
    }
    
    // Generate company summary
    console.log('🔍 Calling generateCompactCompanySummary...');
    const companySummary = await generateCompactCompanySummary(inputs);
    
    console.log('🔍 generateCompactCompanySummary result:', {
      hasSummary: !!companySummary,
      summaryLength: companySummary?.length || 0,
      summaryPreview: companySummary?.substring(0, 100) + '...' || 'null'
    });
    
    if (companySummary) {
      // Store formatted summary for display (but don't post yet)
      localStorage.setItem('lightning_company_summary', companySummary);
      localStorage.setItem('lightning_inputs', JSON.stringify(inputs));
      
      // Mark as ready (will be posted after Q3 is answered)
      localStorage.setItem('lightning_summary_ready', 'true');
      
      console.log('✅ Lightning Mode company summary generated and ready (will display after Q3)');
      console.log('🔍 Stored summary length:', companySummary.length);
    } else {
      console.warn('⚠️ generateCompactCompanySummary returned null/undefined');
    }
    
  } catch (error) {
    console.error('❌ Lightning Mode background processing error:', error);
    await postErrorToChat(`Background processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    isProcessing = false;
    console.log('🔍 Background processing completed, isProcessing set to false');
  }
}

/**
 * Generate compact company summary with target audience
 */
async function generateCompactCompanySummary(inputs: LightningInputs): Promise<string | null> {
  try {
    console.log('🔍 Generating compact company summary...');
    
    // Normalize inputs to ensure a resolvable website is provided to the API
    const resolvedInputs: LightningInputs = (() => {
      const clone: LightningInputs = { ...inputs };
      // Derive website from domain or email if missing
      let websiteCandidate = clone.website || clone.domain || undefined;
      if (!websiteCandidate && clone.email && clone.email.includes('@')) {
        const domainPart = clone.email.split('@')[1];
        if (domainPart) websiteCandidate = domainPart.trim();
      }
      // Fallback to linkedin if absolutely nothing else is present
      if (!websiteCandidate && clone.linkedin) {
        websiteCandidate = clone.linkedin;
      }
      // Ensure scheme for website URLs
      if (websiteCandidate && !/^https?:\/\//i.test(websiteCandidate)) {
        websiteCandidate = `https://${websiteCandidate}`;
      }
      if (websiteCandidate) clone.website = websiteCandidate;
      return clone;
    })();

    if (!resolvedInputs.website && !resolvedInputs.linkedin && !resolvedInputs.email) {
      console.warn('⚠️ No resolvable company identifier (website/linkedin/email). Skipping summary generation.');
      return null;
    }

    const response = await fetch('/api/lightning-mode/company-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: resolvedInputs })
    });
    
    if (!response.ok) {
      // Check for rate limit or service unavailable errors
      if (response.status === 503 || response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.details || 'We are experiencing high demand. Please restart Lightning Mode after a few minutes.';
        throw new Error(`SERVICE_UNAVAILABLE: ${errorMessage}`);
      }
      throw new Error(`Company summary generation failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🔍 Company summary generated successfully');
    
    // Extract target audience data from the summary
    const targetAudienceData = extractTargetAudienceFromSummary(data.summary);
    
    // Store raw company analysis for API calls
    localStorage.setItem('lightning_company_analysis_raw', JSON.stringify({ summary: data.summary }));
    
    // Format the summary with target audience table
    const formattedSummary = formatCompactCompanySummary(data.summary, targetAudienceData, inputs);
    
    // Save target audience to localStorage for lead generation to use
    localStorage.setItem('lightning_target_audience_data', JSON.stringify(targetAudienceData));
    console.log('💾 Initial target audience data saved to localStorage:', targetAudienceData);
    
    // Save target audience to DemandIntellect database
    //await saveTargetAudienceToDemandIntellect(targetAudienceData, inputs);
    
    return formattedSummary;
    
  } catch (error) {
    console.error('Company summary generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check if it's a service unavailable/rate limit error
    if (errorMessage.includes('SERVICE_UNAVAILABLE') || errorMessage.includes('RATE_LIMIT') || errorMessage.includes('high demand')) {
      // Return a formatted error message that can be displayed to the user
      return `<div class="lightning-error-message" style="padding: 24px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15); margin: 16px 0;">
        <h3 style="color: #60A5FA; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">⚠️ Service Temporarily Unavailable</h3>
        <p style="color: #93C5FD; margin: 0 0 16px 0; line-height: 1.6;">We are experiencing high demand at the moment. Our AI services are temporarily at capacity.</p>
        <div style="background: rgba(255,255,255,0.08); padding: 14px; border-radius: 10px; border: 1px solid rgba(59, 130, 246, 0.2);">
          <p style="color: #60A5FA; margin: 0; font-weight: 500;">🔄 What to do:</p>
          <ul style="color: #93C5FD; margin: 8px 0 0 0; padding-left: 20px;">
            <li>Please wait a few minutes</li>
            <li>Start a new Lightning Mode session</li>
            <li>Try again with your company information</li>
          </ul>
        </div>
      </div>`;
    }
    
    return null;
  }
}

/**
 * Generate ICP data (legacy function for compatibility)
 */
export async function generateICPData(inputs: LightningInputs): Promise<any> {
  console.log('🔍 Generating ICP data for:', inputs);
  return { icp: 'Generated ICP data' };
}

/**
 * Generate leads data (legacy function for compatibility)
 */
export async function generateLeadsData(inputs: LightningInputs, icpData: any): Promise<any> {
  console.log('🔍 Generating leads data for:', inputs);
  
  try {
    const response = await fetch('/api/lightning-mode/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs, icp: icpData })
    });
    
    if (!response.ok) {
      throw new Error(`Leads generation failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('🔍 Leads data generated successfully');
    return data.leads;
    
  } catch (error) {
    console.error('Leads generation error:', error);
    return null;
  }
}

/**
 * Post error message to PSA chat
 */
async function postErrorToChat(errorMessage: string): Promise<void> {
  try {
    const errorContent = `<div class="lightning-error-message" style="padding: 24px; background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: 16px; border: 1px solid rgba(59, 130, 246, 0.3); box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15); margin: 16px 0;">
      <h3 style="color: #60A5FA; margin: 0 0 12px 0; font-size: 18px; font-weight: 600;">❌ Lightning Mode Error</h3>
      <p style="color: #93C5FD; margin: 0 0 16px 0; line-height: 1.6;">${errorMessage}</p>
      <div style="background: rgba(255,255,255,0.08); padding: 14px; border-radius: 10px; border: 1px solid rgba(59, 130, 246, 0.2);">
        <p style="color: #60A5FA; margin: 0; font-weight: 500;">🔄 What to do:</p>
        <ul style="color: #93C5FD; margin: 8px 0 0 0; padding-left: 20px;">
          <li>Please try again</li>
          <li>Contact support if the issue persists</li>
        </ul>
      </div>
    </div>`;
    
    // Post to PSA chat via custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: errorContent,
          type: 'error',
          isHTML: true,
          timestamp: Date.now()
        }
      }));
    }
  } catch (error) {
    console.error('Error posting error to chat:', error);
  }
}

/**
 * Format compact company summary for display (website-inferred profile and analysis)
 */
export function formatCompactCompanySummary(summary: string, targetAudienceData?: any, inputs?: LightningInputs): string {
  console.log('🔍 Formatting compact company summary...');
  
  // Clean the summary to remove any target audience section
  const cleanSummary = summary.replace(/## AI Audience Profiling[\s\S]*?(?=##|$)/i, '').trim();
  
  if (targetAudienceData) {
    // Include target audience table with website URL from inputs
    const targetAudienceTable = generateTargetAudienceTable(targetAudienceData, inputs);
    const generateLeadsButton = generateLightningLeadsButtonHTML();
    
    return `${cleanSummary}\n\n<div class="target-audience-section">${targetAudienceTable}\n\n${generateLeadsButton}</div>`;
  } else {
    // Fallback without target audience
    const targetAudienceTable = generateTargetAudienceTable({}, inputs);
    const generateLeadsButton = generateLightningLeadsButtonHTML();
    
    return `${cleanSummary}\n\n<div class="target-audience-section">${targetAudienceTable}\n\n${generateLeadsButton}</div>`;
  }
}

/**
 * Detect if a message is a company summary message
 */
export function isCompanySummaryMessage(message: any): boolean {
  if (!message || !message.content) return false;
  
  const content = message.content;
  const hasCompanyAnalysis = /##\s*Your\s+Company\s+Analysis/i.test(content);
  const hasLightningMetadata = message.lightningMode?.type === 'company_summary';
  const hasTargetAudienceSection = content.includes('<div class="target-audience-section">');
  
  // Check if it's a company summary that might be missing the HTML formatting
  const isPlainCompanySummary = hasCompanyAnalysis && !hasTargetAudienceSection;
  
  return hasLightningMetadata || (hasCompanyAnalysis && (hasTargetAudienceSection || isPlainCompanySummary));
}

/**
 * Normalize company summary message on reload to ensure consistent formatting
 */
export function normalizeCompanySummaryMessage(message: any): string {
  console.log('🔍 Normalizing company summary message...');
  
  if (!message || !message.content) {
    console.warn('⚠️ No message content to normalize');
    return message?.content || '';
  }
  
  const content = message.content;
  
  // If message already has the target audience section, return as-is
  if (content.includes('<div class="target-audience-section">')) {
    console.log('✅ Message already has target audience section, no normalization needed');
    return content;
  }
  
  // Try to get target audience data from localStorage
  let targetAudienceData: any = null;
  try {
    const storedTargetAudience = localStorage.getItem('lightning_target_audience_data');
    if (storedTargetAudience) {
      targetAudienceData = JSON.parse(storedTargetAudience);
      console.log('✅ Restored target audience data from localStorage');
    }
  } catch (error) {
    console.warn('⚠️ Failed to parse target audience data from localStorage:', error);
  }
  
  // Try to get inputs from localStorage
  let inputs: LightningInputs | undefined = undefined;
  try {
    const storedInputs = localStorage.getItem('lightning_inputs');
    if (storedInputs) {
      inputs = JSON.parse(storedInputs);
      console.log('✅ Restored inputs from localStorage');
    }
  } catch (error) {
    console.warn('⚠️ Failed to parse inputs from localStorage:', error);
  }
  
  // Try to extract target audience data from the raw summary if available
  if (!targetAudienceData) {
    try {
      const rawAnalysis = localStorage.getItem('lightning_company_analysis_raw');
      if (rawAnalysis) {
        const parsed = JSON.parse(rawAnalysis);
        if (parsed.summary) {
          targetAudienceData = extractTargetAudienceFromSummary(parsed.summary);
          console.log('✅ Extracted target audience from raw analysis');
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to extract target audience from raw analysis:', error);
    }
  }
  
  // If we still don't have target audience data, try to extract from the message content itself
  if (!targetAudienceData && content.includes('## AI Audience Profiling')) {
    targetAudienceData = extractTargetAudienceFromSummary(content);
    console.log('✅ Extracted target audience from message content');
  }
  
  // Reformat the message using formatCompactCompanySummary
  const normalizedContent = formatCompactCompanySummary(content, targetAudienceData, inputs);
  
  console.log('✅ Company summary message normalized successfully');
  return normalizedContent;
}

/**
 * Extract target audience data from company summary
 */
export function extractTargetAudienceFromSummary(summary: string): any {
  console.log('🔍 Extracting target audience from company summary...');
  
  const targetAudienceData: any = {};
  
  try {
    // Look for target audience section
    const targetAudienceMatch = summary.match(/## AI Audience Profiling[\s\S]*?(?=##|$)/i);
    const targetAudienceText = targetAudienceMatch ? targetAudienceMatch[0] : '';
    
    console.log('📋 Target audience text found:', targetAudienceText ? 'Yes' : 'No');
    
    if (targetAudienceText) {
      // Extract individual fields with multiple regex patterns
      const fieldPatterns = [
        { key: 'salesObjective', patterns: ['Sales Objective', 'salesObjective', 'Sales objective'] },
        { key: 'companyRole', patterns: ['Company Role', 'companyRole', 'Company role'] },
        { key: 'shortTermGoal', patterns: ['Short Term Goal', 'shortTermGoal', 'Short term goal'] },
        { key: 'websiteUrl', patterns: ['Website URL', 'websiteUrl', 'Website url'] },
        { key: 'gtm', patterns: ['Go-to-Market', 'gtm', 'Go-to-Market'] },
        { key: 'targetIndustry', patterns: ['Target Industry', 'targetIndustry', 'Target industry'] },
        { key: 'targetRevenueSize', patterns: ['Target Revenue Size', 'targetRevenueSize', 'Target revenue size'] },
        { key: 'targetEmployeeSize', patterns: ['Target Employee Size', 'targetEmployeeSize', 'Target employee size'] },
        { key: 'targetDepartments', patterns: ['Target Departments', 'targetDepartments', 'Target departments'] },
        { key: 'targetRegion', patterns: ['Target Region', 'targetRegion', 'Target region'] },
        { key: 'targetLocation', patterns: ['Target Location', 'targetLocation', 'Target location'] }
      ];
      
      fieldPatterns.forEach(field => {
        for (const pattern of field.patterns) {
          // Try multiple regex patterns for each field
          const patterns = [
            // Match patterns like "• **Industry**: Event Management, Corporate Services, Education, Hospitality"
            new RegExp(`[•-] \\*\\*${pattern}:\\*\\*\\s*([^\\n]+)`, 'i'),
            new RegExp(`\\*\\*${pattern}:\\*\\*\\s*([^\\n]+)`, 'i'),
            new RegExp(`[•-] ${pattern}:\\s*([^\\n]+)`, 'i'),
            new RegExp(`${pattern}:\\s*([^\\n]+)`, 'i'),
            // Match patterns like "• **Industry**: [Event Management, Corporate Services, Education, Hospitality]"
            new RegExp(`[•-] \\*\\*${pattern}:\\*\\*\\s*\\[([^\\]]+)\\]`, 'i'),
            new RegExp(`\\*\\*${pattern}:\\*\\*\\s*\\[([^\\]]+)\\]`, 'i'),
            new RegExp(`[•-] ${pattern}:\\s*\\[([^\\]]+)\\]`, 'i'),
            new RegExp(`${pattern}:\\s*\\[([^\\]]+)\\]`, 'i')
          ];
          
          for (const regex of patterns) {
            const match = targetAudienceText.match(regex);
            if (match && match[1] && match[1].trim() && !targetAudienceData[field.key]) {
              targetAudienceData[field.key] = match[1].trim();
              break;
            }
          }
          if (targetAudienceData[field.key]) break;
        }
      });
    }
  } catch (error) {
    console.error('Error extracting target audience data:', error);
  }
  
  // Define valid options for each field
  const validOptions = {
    salesObjective: ['Generate qualified leads', 'Expand into a new region or sector', 'Enrich or clean an existing list', 'Purchase a new contact list'],
    companyRole: ['Founder / CEO', 'Sales Director or Manager', 'Marketing Director or Manager', 'Sales Development Representative (SDR)', 'Consultant / Advisor', 'Other'],
    shortTermGoal: ['Schedule a demo', 'Purchase or download contacts', 'Enrich my existing list', 'Create a new list from scratch', 'Get advice on strategy'],
    gtm: ['B2B', 'B2C', 'B2G', 'BOTH'],
    targetIndustry: ['Accounting/Finance', 'Advertising/Public Relations', 'Aerospace/Aviation', 'Agriculture/Livestock', 'Animal Care/Pet Services', 'Arts/Entertainment/Publishing', 'Automotive', 'Banking/Mortgage', 'Business Development', 'Business Opportunity', 'Clerical/Administrative', 'Construction/Facilities', 'Education/Research', 'Energy/Utilities', 'Food/Beverage', 'Government/Non-Profit', 'Healthcare/Wellness', 'Legal/Security', 'Manufacturing/Industrial', 'Real Estate/Property', 'Retail/Wholesale', 'Technology/IT', 'Transportation/Logistics', 'Other', 'NA'],
    targetRevenueSize: ['0-500K', '500K-1M', '1M-5M', '5M-10M', '10M-50M', '50M-100M', '100M-500M', '500M-1B', '1B-5B', '5B+', 'NA'],
    targetEmployeeSize: ['0-10', '11-50', '51-200', '201-500', '501-1000', '1000-5000', '5001-10000', '10001-50000', '50001-100000', '100000+', 'NA'],
    targetDepartments: ['C-suite', 'Sales', 'Marketing', 'Engineering', 'IT', 'Operations', 'HR', 'Finance', 'Procurement', 'Other'],
    targetRegion: ['India', 'North America', 'Europe', 'Asia-Pacific', 'Global / Multiple regions']
  };

  // Function to validate and clean field values
  const validateField = (value: string, validOptions: string[], defaultValue: string): string => {
    if (!value) return defaultValue;
    
    // Remove any descriptive text in parentheses or brackets
    const cleanValue = value.replace(/\s*\([^)]*\)/g, '').replace(/\s*\[[^\]]*\]/g, '').trim();
    
    // Check if the clean value matches any valid option
    const matchedOption = validOptions.find(option => 
      option.toLowerCase() === cleanValue.toLowerCase() || 
      cleanValue.toLowerCase().includes(option.toLowerCase())
    );
    
    return matchedOption || defaultValue;
  };

  // Validate and clean website URL - remove placeholder text
  let cleanWebsiteUrl = targetAudienceData.websiteUrl || '';
  
  // Remove placeholder patterns that might have been extracted from AI output
  const placeholderPatterns = [
    '[Company website',
    '[company website',
    'Company website URL',
    'Not provided',
    '[Website URL]',
    '[website url]'
  ];
  
  for (const pattern of placeholderPatterns) {
    if (cleanWebsiteUrl.includes(pattern)) {
      console.log('⚠️ Detected placeholder in website URL, clearing:', cleanWebsiteUrl);
      cleanWebsiteUrl = '';
      break;
    }
  }
  
  // Set default values for the new field structure with validation
  return {
    salesObjective: validateField(targetAudienceData.salesObjective, validOptions.salesObjective, 'Generate qualified leads'),
    companyRole: validateField(targetAudienceData.companyRole, validOptions.companyRole, 'Sales Director or Manager'),
    shortTermGoal: validateField(targetAudienceData.shortTermGoal, validOptions.shortTermGoal, 'Schedule a demo'),
    websiteUrl: cleanWebsiteUrl,
    gtm: validateField(targetAudienceData.gtm, validOptions.gtm, 'B2B'),
    targetIndustry: validateField(targetAudienceData.targetIndustry, validOptions.targetIndustry, 'Technology/IT'),
    targetRevenueSize: validateField(targetAudienceData.targetRevenueSize, validOptions.targetRevenueSize, '500K-1M'),
    targetEmployeeSize: validateField(targetAudienceData.targetEmployeeSize, validOptions.targetEmployeeSize, '51-200'),
    targetDepartments: validateField(targetAudienceData.targetDepartments, validOptions.targetDepartments, 'Sales, Marketing'),
    targetRegion: validateField(targetAudienceData.targetRegion, validOptions.targetRegion, 'North America'),
    targetLocation: targetAudienceData.targetLocation || 'United States'
  };
}

/**
 * Generate target audience table with text-only view and edit functionality
 */
function generateTargetAudienceTable(targetAudienceData: any, inputs?: LightningInputs): string {
  return `
<div style="margin: 20px 0;">
  <h3 style="color: #FFFFFF; margin-bottom: 16px; font-size: 18px; font-weight: 600;">Target Audience</h3>
  
  <!-- Text-only view (default) -->
  <div id="target-audience-text-view">
    <div style="display: grid; grid-template-columns: 1fr 3fr; background: rgba(255, 255, 255, 0.05); border-radius: 8px; overflow: hidden;">
      <!-- Header Row -->
      <div style="padding: 12px 16px; background: rgba(59, 130, 246, 0.15); color: #FFFFFF; font-weight: 600; font-size: 14px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center;">Field</div>
      <div style="padding: 12px 16px; background: rgba(59, 130, 246, 0.15); color: #FFFFFF; font-weight: 600; font-size: 14px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center;">Value</div>
      
      <!-- Data Rows -->
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Sales Objective</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-salesObjective">${targetAudienceData.salesObjective || 'Generate qualified leads'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Company Role</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-companyRole">${targetAudienceData.companyRole || 'Sales Director or Manager'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Short Term Goal</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-shortTermGoal">${targetAudienceData.shortTermGoal || 'Schedule a demo'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Website URL</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-websiteUrl">${inputs?.website || targetAudienceData.websiteUrl || 'Not provided'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Go-to-Market</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-gtm">${targetAudienceData.gtm || 'B2B'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Industry</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-targetIndustry">${targetAudienceData.targetIndustry || 'Technology/IT'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Revenue Size</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-targetRevenueSize">${targetAudienceData.targetRevenueSize || '500K-1M'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Employee Size</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-targetEmployeeSize">${targetAudienceData.targetEmployeeSize || '51-200'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Departments</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-targetDepartments">${targetAudienceData.targetDepartments || 'Sales, Marketing'}</div>
      
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Region</div>
      <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #FFFFFF; display: flex; align-items: center;" id="text-targetRegion">${targetAudienceData.targetRegion || 'North America'}</div>
      
      <div style="padding: 6px 12px; border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Location</div>
      <div style="padding: 6px 12px; color: #FFFFFF; display: flex; align-items: center;" id="text-targetLocation">${targetAudienceData.targetLocation || 'United States'}</div>
    </div>
    
    <div style="margin-top: 16px; text-align: center;">
      <button onclick="toggleTargetAudienceEdit()" style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
         Edit Target Audience
      </button>
    </div>
  </div>
  
  <!-- Editable view (hidden by default) -->
  <div id="target-audience-edit-view" style="display: none;">
    ${generateEditableTargetAudienceTable(targetAudienceData, inputs)}
    
    <div style="margin-top: 16px; text-align: center; display: flex; gap: 12px; justify-content: center;">
      <button onclick="saveTargetAudienceChanges()" style="background: linear-gradient(135deg, #10B981, #059669); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); transition: all 0.3s ease;">
        💾 Save Changes
      </button>
      <button onclick="cancelTargetAudienceEdit()" style="background: linear-gradient(135deg, #6B7280, #4B5563); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3); transition: all 0.3s ease;">
        ❌ Cancel
      </button>
    </div>
  </div>
</div>`;
}

/**
 * Generate editable target audience table (for edit mode)
 */
function generateEditableTargetAudienceTable(targetAudienceData: any, inputs?: LightningInputs): string {
  return `
<div style="margin: 20px 0;">
  <div style="display: grid; grid-template-columns: 1fr 3fr; background: rgba(255, 255, 255, 0.05); border-radius: 8px; overflow: hidden;">
    <!-- Header Row -->
    <div style="padding: 8px 12px; background: rgba(59, 130, 246, 0.15); color: #FFFFFF; font-weight: 600; font-size: 14px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center;">Field</div>
    <div style="padding: 8px 12px; background: rgba(59, 130, 246, 0.15); color: #FFFFFF; font-weight: 600; font-size: 14px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center;">Current Value</div>
    
    <!-- Data Rows -->
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Sales Objective</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-salesObjective" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="Generate qualified leads" ${(targetAudienceData.salesObjective || 'Generate qualified leads') === 'Generate qualified leads' ? 'selected' : ''}>Generate qualified leads</option>
        <option value="Expand into a new region or sector" ${(targetAudienceData.salesObjective || '') === 'Expand into a new region or sector' ? 'selected' : ''}>Expand into a new region or sector</option>
        <option value="Enrich or clean an existing list" ${(targetAudienceData.salesObjective || '') === 'Enrich or clean an existing list' ? 'selected' : ''}>Enrich or clean an existing list</option>
        <option value="Purchase a new contact list" ${(targetAudienceData.salesObjective || '') === 'Purchase a new contact list' ? 'selected' : ''}>Purchase a new contact list</option>
      </select>
    </div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Company Role</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-companyRole" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="Founder / CEO" ${(targetAudienceData.companyRole || 'Sales Director or Manager') === 'Founder / CEO' ? 'selected' : ''}>Founder / CEO</option>
        <option value="Sales Director or Manager" ${(targetAudienceData.companyRole || 'Sales Director or Manager') === 'Sales Director or Manager' ? 'selected' : ''}>Sales Director or Manager</option>
        <option value="Marketing Director or Manager" ${(targetAudienceData.companyRole || '') === 'Marketing Director or Manager' ? 'selected' : ''}>Marketing Director or Manager</option>
        <option value="Sales Development Representative (SDR)" ${(targetAudienceData.companyRole || '') === 'Sales Development Representative (SDR)' ? 'selected' : ''}>Sales Development Representative (SDR)</option>
        <option value="Consultant / Advisor" ${(targetAudienceData.companyRole || '') === 'Consultant / Advisor' ? 'selected' : ''}>Consultant / Advisor</option>
        <option value="Other" ${(targetAudienceData.companyRole || '') === 'Other' ? 'selected' : ''}>Other</option>
      </select>
    </div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Short Term Goal</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-shortTermGoal" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="Schedule a demo" ${(targetAudienceData.shortTermGoal || 'Schedule a demo') === 'Schedule a demo' ? 'selected' : ''}>Schedule a demo</option>
        <option value="Get advice on strategy" ${(targetAudienceData.shortTermGoal || '') === 'Get advice on strategy' ? 'selected' : ''}>Get advice on strategy</option>
        <option value="See pricing" ${(targetAudienceData.shortTermGoal || '') === 'See pricing' ? 'selected' : ''}>See pricing</option>
        <option value="Get a proposal" ${(targetAudienceData.shortTermGoal || '') === 'Get a proposal' ? 'selected' : ''}>Get a proposal</option>
        <option value="Other" ${(targetAudienceData.shortTermGoal || '') === 'Other' ? 'selected' : ''}>Other</option>
      </select>
    </div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Website URL</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <input type="text" id="edit-websiteUrl" value="${inputs?.website || targetAudienceData.websiteUrl || 'Not provided'}" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; text-align: left; font-size: 14px;" />
    </div>
    
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Go-to-Market</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-gtm" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="B2B" ${(targetAudienceData.gtm || 'B2B') === 'B2B' ? 'selected' : ''}>B2B</option>
        <option value="B2C" ${(targetAudienceData.gtm || '') === 'B2C' ? 'selected' : ''}>B2C</option>
        <option value="Both" ${(targetAudienceData.gtm || '') === 'Both' ? 'selected' : ''}>Both</option>
      </select>
    </div>
    
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Industry</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-targetIndustry" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="Technology/IT" ${(targetAudienceData.targetIndustry || 'Technology/IT') === 'Technology/IT' ? 'selected' : ''}>Technology/IT</option>
        <option value="Manufacturing/Industrial" ${(targetAudienceData.targetIndustry || '') === 'Manufacturing/Industrial' ? 'selected' : ''}>Manufacturing/Industrial</option>
        <option value="Retail/Wholesale" ${(targetAudienceData.targetIndustry || '') === 'Retail/Wholesale' ? 'selected' : ''}>Retail/Wholesale</option>
        <option value="Healthcare/Wellness" ${(targetAudienceData.targetIndustry || '') === 'Healthcare/Wellness' ? 'selected' : ''}>Healthcare/Wellness</option>
        <option value="Finance/Banking" ${(targetAudienceData.targetIndustry || '') === 'Finance/Banking' ? 'selected' : ''}>Finance/Banking</option>
        <option value="Business Services" ${(targetAudienceData.targetIndustry || '') === 'Business Services' ? 'selected' : ''}>Business Services</option>
        <option value="Other" ${(targetAudienceData.targetIndustry || '') === 'Other' ? 'selected' : ''}>Other</option>
      </select>
    </div>
    
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Revenue Size</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-targetRevenueSize" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="100K-500K" ${(targetAudienceData.targetRevenueSize || '500K-1M') === '100K-500K' ? 'selected' : ''}>100K-500K</option>
        <option value="500K-1M" ${(targetAudienceData.targetRevenueSize || '500K-1M') === '500K-1M' ? 'selected' : ''}>500K-1M</option>
        <option value="1M-5M" ${(targetAudienceData.targetRevenueSize || '') === '1M-5M' ? 'selected' : ''}>1M-5M</option>
        <option value="5M-10M" ${(targetAudienceData.targetRevenueSize || '') === '5M-10M' ? 'selected' : ''}>5M-10M</option>
        <option value="10M-50M" ${(targetAudienceData.targetRevenueSize || '') === '10M-50M' ? 'selected' : ''}>10M-50M</option>
        <option value="50M-100M" ${(targetAudienceData.targetRevenueSize || '') === '50M-100M' ? 'selected' : ''}>50M-100M</option>
        <option value="100M-500M" ${(targetAudienceData.targetRevenueSize || '') === '100M-500M' ? 'selected' : ''}>100M-500M</option>
        <option value="500M+" ${(targetAudienceData.targetRevenueSize || '') === '500M+' ? 'selected' : ''}>500M+</option>
      </select>
    </div>
    
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Employee Size</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-targetEmployeeSize" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="1-10" ${(targetAudienceData.targetEmployeeSize || '51-200') === '1-10' ? 'selected' : ''}>1-10</option>
        <option value="11-50" ${(targetAudienceData.targetEmployeeSize || '') === '11-50' ? 'selected' : ''}>11-50</option>
        <option value="51-200" ${(targetAudienceData.targetEmployeeSize || '51-200') === '51-200' ? 'selected' : ''}>51-200</option>
        <option value="201-500" ${(targetAudienceData.targetEmployeeSize || '') === '201-500' ? 'selected' : ''}>201-500</option>
        <option value="501-1000" ${(targetAudienceData.targetEmployeeSize || '') === '501-1000' ? 'selected' : ''}>501-1000</option>
        <option value="1000-5000" ${(targetAudienceData.targetEmployeeSize || '') === '1000-5000' ? 'selected' : ''}>1000-5000</option>
        <option value="5000+" ${(targetAudienceData.targetEmployeeSize || '') === '5000+' ? 'selected' : ''}>5000+</option>
      </select>
    </div>
    
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Departments</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-targetDepartments" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="Sales" ${(targetAudienceData.targetDepartments || 'Sales, Marketing') === 'Sales' ? 'selected' : ''}>Sales</option>
        <option value="Marketing" ${(targetAudienceData.targetDepartments || 'Sales, Marketing') === 'Marketing' ? 'selected' : ''}>Marketing</option>
        <option value="Sales, Marketing" ${(targetAudienceData.targetDepartments || 'Sales, Marketing') === 'Sales, Marketing' ? 'selected' : ''}>Sales, Marketing</option>
        <option value="Sales, Marketing, Operations" ${(targetAudienceData.targetDepartments || '') === 'Sales, Marketing, Operations' ? 'selected' : ''}>Sales, Marketing, Operations</option>
        <option value="All Departments" ${(targetAudienceData.targetDepartments || '') === 'All Departments' ? 'selected' : ''}>All Departments</option>
      </select>
    </div>
    
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Region</div>
    <div style="padding: 6px 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); display: flex; align-items: center;">
      <select id="edit-targetRegion" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="North America" ${(targetAudienceData.targetRegion || 'North America') === 'North America' ? 'selected' : ''}>North America</option>
        <option value="Europe" ${(targetAudienceData.targetRegion || '') === 'Europe' ? 'selected' : ''}>Europe</option>
        <option value="Asia-Pacific" ${(targetAudienceData.targetRegion || '') === 'Asia-Pacific' ? 'selected' : ''}>Asia-Pacific</option>
        <option value="Latin America" ${(targetAudienceData.targetRegion || '') === 'Latin America' ? 'selected' : ''}>Latin America</option>
        <option value="Middle East & Africa" ${(targetAudienceData.targetRegion || '') === 'Middle East & Africa' ? 'selected' : ''}>Middle East & Africa</option>
        <option value="Global" ${(targetAudienceData.targetRegion || '') === 'Global' ? 'selected' : ''}>Global</option>
      </select>
    </div>
    
    <div style="padding: 6px 12px; border-right: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500; color: #E2E8F0; display: flex; align-items: center;">Target Location</div>
    <div style="padding: 6px 12px; display: flex; align-items: center;">
      <select id="edit-targetLocation" style="width: 100%; padding: 6px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; background: rgba(15, 23, 42, 0.6); color: white; font-size: 14px;">
        <option value="United States" ${(targetAudienceData.targetLocation || 'United States') === 'United States' ? 'selected' : ''}>United States</option>
        <option value="Canada" ${(targetAudienceData.targetLocation || '') === 'Canada' ? 'selected' : ''}>Canada</option>
        <option value="United Kingdom" ${(targetAudienceData.targetLocation || '') === 'United Kingdom' ? 'selected' : ''}>United Kingdom</option>
        <option value="Germany" ${(targetAudienceData.targetLocation || '') === 'Germany' ? 'selected' : ''}>Germany</option>
        <option value="France" ${(targetAudienceData.targetLocation || '') === 'France' ? 'selected' : ''}>France</option>
        <option value="India" ${(targetAudienceData.targetLocation || '') === 'India' ? 'selected' : ''}>India</option>
        <option value="Australia" ${(targetAudienceData.targetLocation || '') === 'Australia' ? 'selected' : ''}>Australia</option>
        <option value="Japan" ${(targetAudienceData.targetLocation || '') === 'Japan' ? 'selected' : ''}>Japan</option>
        <option value="Brazil" ${(targetAudienceData.targetLocation || '') === 'Brazil' ? 'selected' : ''}>Brazil</option>
        <option value="Mexico" ${(targetAudienceData.targetLocation || '') === 'Mexico' ? 'selected' : ''}>Mexico</option>
        <option value="Other" ${(targetAudienceData.targetLocation || '') === 'Other' ? 'selected' : ''}>Other</option>
      </select>
    </div>
  </div>
</div>`;
}

/**
 * Generate Lightning leads button HTML
 */
function generateLightningLeadsButtonHTML(): string {
  return `
<div style="margin: 20px 0; text-align: center;">
  <button onclick="handleGenerateProspectsClick()" style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; border: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s ease;">
     Generate Prospects List
  </button>
  <div style="margin-top: 8px; font-size: 12px; color: #94A3B8; text-align: center;">
    ⏱️ Estimated time: 1-2 minutes
  </div>
</div>`;
}

/**
 * Format compact editable ICP table for display (6 essential fields)
 */
export function formatCompactEditableICPTable(icpData: any): string {
  console.log('🔍 formatCompactEditableICPTable called with icpData:', icpData);
  console.log('🔍 icpData type:', typeof icpData);
  console.log('🔍 icpData keys:', icpData ? Object.keys(icpData) : 'null/undefined');
  
  let content = `<div style="margin: 20px 0;">`;
  
  // Header
  content += `<h3 style="color: #FFFFFF; margin-bottom: 16px; font-size: 20px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Ideal Customer Profile (ICP)</h3>`;
  
  // Instruction text
  content += `<p style="color: #CBD5E1; margin-bottom: 20px; font-size: 14px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">Please review and edit your ICP below. All values have been inferred from your website analysis. Once confirmed, we'll generate a tailored list of prospective clients.</p>`;
  
  // Editable table with glassmorphism theme and scrollbars
  content += `<div style="background: rgba(24, 18, 43, 0.55); backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2); border-radius: 16px; border: 1.5px solid rgba(59, 130, 246, 0.18); overflow: auto; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 0 rgba(59, 130, 246, 0.08) inset; max-height: 500px; max-width: 100%;">`;
  content += `<table style="width: 100%; border-collapse: collapse; min-width: 600px;">`;
  
  // Table header
  content += `<thead style="background: rgba(59, 130, 246, 0.1); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px);">`;
  content += `<tr>`;
  content += `<th style="padding: 20px 16px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); width: 200px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);">Field</th>`;
  content += `<th style="padding: 20px 16px; text-align: left; font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);">Inferred Value (from website + context)</th>`;
  content += `</tr>`;
  content += `</thead>`;
  
  // Table body with editable fields
  content += `<tbody>`;
  
  const fields = [
    { key: 'industry', label: 'Industry' },
    { key: 'location', label: 'Location' },
    { key: 'companySize', label: 'Company Size' },
    { key: 'decisionMakers', label: 'Decision Makers' },
    { key: 'painPoints', label: 'Pain Points' },
    { key: 'techStack', label: 'Tech Stack' }
  ];
  
  fields.forEach((field, index) => {
    // Ensure we have inferred values, not "N/A"
    let value = icpData[field.key];
    console.log(`🔍 Processing field ${field.key}:`, value, 'type:', typeof value);
    
    // Convert to string and check if it's empty or N/A
    const stringValue = String(value || '');
    if (!value || value === 'N/A' || stringValue.trim() === '') {
      // Provide intelligent defaults based on field type
      switch (field.key) {
        case 'industry':
          value = 'Technology, Manufacturing, Healthcare, Financial Services';
          break;
        case 'location':
          value = 'North America, Europe, Asia-Pacific, Global';
          break;
        case 'companySize':
          value = 'Medium to Large Enterprises (500–5,000 employees)';
          break;
        case 'decisionMakers':
          value = 'CEOs, CTOs, VPs of Engineering, Procurement Directors';
          break;
        case 'painPoints':
          value = 'Scalability challenges, Cost optimization, Integration complexity, Digital transformation';
          break;
        case 'techStack':
          value = 'Cloud platforms (AWS, Azure), CRM systems (Salesforce), Analytics tools, Modern development frameworks';
          break;
        default:
          value = 'Inferred from website analysis';
      }
    }
    
    const isEven = index % 2 === 0;
    content += `<tr style="border-bottom: 1px solid rgba(59, 130, 246, 0.2); background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease;">`;
    content += `<td style="padding: 20px 16px; font-weight: 600; color: #FFFFFF; vertical-align: top; border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);">${field.label}</td>`;
    content += `<td style="padding: 20px 16px; vertical-align: top;">`;
    content += `<span id="icp-${field.key}" contenteditable="true" style="display: block; min-height: 24px; padding: 16px; border: 1.5px solid rgba(59, 130, 246, 0.3); border-radius: 12px; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); color: #FFFFFF; outline: none; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1);" onblur="updateICPField('${field.key}', this.textContent)" onfocus="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.border='1.5px solid rgba(59, 130, 246, 0.6)'; this.style.boxShadow='0 0 20px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'" onblur="this.style.background='rgba(255, 255, 255, 0.05)'; this.style.border='1.5px solid rgba(59, 130, 246, 0.3)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'">${String(value || '')}</span>`;
    content += `</td>`;
    content += `</tr>`;
  });
  
  content += `</tbody>`;
  content += `</table>`;
  content += `</div>`;
  
  // Note: Confirm button separated for dangerouslySetInnerHTML rendering
  content += `<p style="color: #94A3B8; font-size: 14px; text-align: center; margin-top: 16px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">Review the ICP above, then click "Confirm ICP" to generate your prospective clients list.</p>`;
  
  content += `</div>`;
  
  return content;
}

/**
 * Format compact prospects table for display
 * Updated to match the 14-column structure defined in lightningLeadGenerationPrompts.ts
 */
export function formatCompactProspectsTable(leadsData: any[]): string {
  let content = `<div style="margin: 20px 0;">`;
  
  // Header
  content += `<h2 style="color: #FFFFFF; margin-bottom: 16px; font-size: 24px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">⚡ Lightning Mode Prospect List Results (${leadsData.length} prospects)</h2>`;
  
  // Description
  content += `<p style="color: #CBD5E1; margin-bottom: 20px; font-size: 14px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">Based on your confirmed ICP:</p>`;
  
  // Responsive grid container with glassmorphism styling
  content += `<div style="background: rgba(24, 18, 43, 0.55); backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2); border-radius: 16px; border: 1.5px solid rgba(59, 130, 246, 0.18); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 0 rgba(59, 130, 246, 0.08) inset; max-height: 600px; max-width: 100%;">`;
  
  // CSS Grid layout - Updated for 14 columns with single scroll container
  content += `<div style="display: grid; grid-template-columns: 140px 160px 100px 110px 140px 160px 90px 100px 120px 130px 120px 140px 130px; min-width: 1800px; font-size: 14px; overflow-x: auto;">`;
  
  // Grid header - Updated to match 14-column structure from prompt
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Company Name</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Website</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Industry</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Sub-Industry</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Product Line</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Use Case</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Employees</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Revenue</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Location</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Key Decision Maker</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Designation</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Pain Points</div>`;
  content += `<div style="padding: 16px 12px; background: rgba(59, 130, 246, 0.1); font-weight: 600; color: #FFFFFF; border-bottom: 2px solid rgba(59, 130, 246, 0.3); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); display: flex; align-items: center; backdrop-filter: blur(10px);">Approach Strategy</div>`;
  
  // Grid data rows
  leadsData.forEach((lead: any, index: number) => {
    const isEven = index % 2 === 0;
    const website = lead.website || lead['Website'] || 'N/A';
    const websiteLink = website !== 'N/A' ? `<a href="${website}" target="_blank" style="color: #60A5FA; text-decoration: none; word-break: break-all;">${website}</a>` : 'N/A';
    
    // Company Name
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); font-weight: 500; word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.company || lead['Company Name'] || 'N/A'}</div>`;
    
    // Website
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-all; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${websiteLink}</div>`;
    
    // Industry
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.industry || lead['Industry'] || 'N/A'}</div>`;
    
    // Sub-Industry
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.subIndustry || lead['Sub-Industry'] || 'N/A'}</div>`;
    
    // Product Line
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.productLine || lead['Product Line'] || 'N/A'}</div>`;
    
    // Use Case
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; line-height: 1.4; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.useCase || lead['Use Case'] || 'N/A'}</div>`;
    
    // Employees
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.employees || lead['Employees'] || 'N/A'}</div>`;
    
    // Revenue
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.revenue || lead['Revenue'] || 'N/A'}</div>`;
    
    // Location
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.location || lead['Location'] || 'N/A'}</div>`;
    
    // Key Decision Maker
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.decisionMaker || lead['Key Decision Maker'] || 'N/A'}</div>`;
    
    // Designation
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.decisionMakerRole || lead['Designation'] || 'N/A'}</div>`;
    
    // Pain Points
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); border-right: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; line-height: 1.4; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.painPoints || lead['Pain Points'] || 'N/A'}</div>`;
    
    // Approach Strategy
    content += `<div style="padding: 16px 12px; color: #FFFFFF; border-bottom: 1px solid rgba(59, 130, 246, 0.2); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); word-break: break-word; line-height: 1.4; background: ${isEven ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)'}; transition: all 0.3s ease; display: flex; align-items: flex-start;">${lead.approachStrategy || lead['Approach Strategy'] || 'N/A'}</div>`;
  });
  
  content += `</div>`;
  content += `</div>`;
  
  // Next Steps
  content += `<div style="margin: 24px 0; padding: 24px; background: rgba(24, 18, 43, 0.55); backdrop-filter: blur(24px) saturate(1.2); -webkit-backdrop-filter: blur(24px) saturate(1.2); border-radius: 16px; border: 1.5px solid rgba(59, 130, 246, 0.18); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 0 rgba(59, 130, 246, 0.08) inset;">`;
  content += `<h3 style="color: #FFFFFF; margin-bottom: 16px; font-size: 18px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Next Steps</h3>`;
  content += `<ul style="color: #CBD5E1; margin: 0; padding-left: 20px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">`;
  content += `<li style="margin-bottom: 8px;">Review prospects - Each company matches your confirmed ICP criteria</li>`;
  content += `<li style="margin-bottom: 8px;">Start outreach - Use the contact information provided</li>`;
  content += `<li style="margin-bottom: 8px;">Track results - Monitor response rates and adjust your approach</li>`;
  content += `<li style="margin-bottom: 8px;">Find more leads - Use your ICP criteria to discover similar prospects</li>`;
  content += `</ul>`;
  content += `</div>`;
  
  // View Dashboard button
  content += `<div style="text-align: center; margin: 20px 0;">`;
  content += `<button onclick="viewDashboard()" style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(15px); border: 1px solid rgba(16, 185, 129, 0.3); color: white; padding: 16px 32px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 18px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); transition: all 0.3s ease; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);" onmouseover="this.style.background='rgba(16, 185, 129, 0.1)'; this.style.borderColor='rgba(16, 185, 129, 0.5)'; this.style.boxShadow='0 8px 24px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(16, 185, 129, 0.3)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">`;
  content += `View SalesCentri Dashboard`;
  content += `</button>`;
  content += `</div>`;
  
  content += `<p style="color: #94A3B8; font-size: 14px; text-align: center; margin-top: 16px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">Lightning Mode Complete! Your analysis is ready to use.</p>`;
  
  content += `</div>`;
  
  return content;
}

/**
 * Save target audience to DemandIntellect database
 */
async function saveTargetAudienceToDemandIntellect(targetAudienceData: any, inputs: LightningInputs): Promise<void> {
  try {
    console.log('🔍 Saving Lightning Mode target audience to DemandIntellect database...');
    
    // Get auth token from localStorage
    const authToken = localStorage.getItem('salescentri_token');
    
    // Get tracker anon_id from localStorage (same as used for chat creation)
    const trackerAnonId = localStorage.getItem('tracker_anon_id');
    console.log('🔍 Retrieved tracker_anon_id for target audience save:', trackerAnonId);
    
    // Use tracker_anon_id if available, otherwise fall back to inputs
    const userId = trackerAnonId || inputs.userId;
    const anonymousUserId = trackerAnonId || inputs.anonymousUserId;
    console.log('🔍 Using anon IDs for save:', { userId, anonymousUserId });
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch('/api/lightning-mode/save-target-audience', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        targetAudienceData: targetAudienceData,
        userId: userId,
        anonymousUserId: anonymousUserId,
        companySummary: localStorage.getItem('lightning_company_summary'),
        websiteUrl: inputs?.website || ''
      })
    });

    if (response.ok) {
      console.log('✅ Lightning Mode target audience saved to DemandIntellect database successfully');
    } else {
      console.warn('⚠️ Failed to save Lightning Mode target audience to DemandIntellect database');
    }
  } catch (error) {
    console.error('❌ Error saving Lightning Mode target audience to DemandIntellect:', error);
    // Don't fail the entire process if saving fails
  }
}
