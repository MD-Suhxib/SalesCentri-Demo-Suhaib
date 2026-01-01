import { LightningInputs, LightningStep, ChatMessage } from '../../types/lightningMode';

// Track processing state to prevent multiple simultaneous calls
let isProcessing = false;


// Track posting state to prevent duplicate outputs
let summaryPosted = false;
let icpPosted = false;
let leadsPosted = false;
let icpConfirmationInProgress = false;

// Track question processing to prevent duplicate responses
let q1Processed = false;
let q2Processed = false;
let q3Processed = false;
let initialQuestionsDisplayed = false;
let lightningModeActive = false;

// Track last processed responses to prevent rapid duplicates
let lastQ1Response: string | null = null;
let lastQ2Response: string | null = null;
let lastQ3Response: string | null = null;
const RESPONSE_DEBOUNCE_MS = 1000; // 1 second debounce for responses

// Session timeout
let sessionTimeoutId: NodeJS.Timeout | null = null;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

// Track API calls to prevent duplicate requests
let apiCallTimestamps: Record<string, number> = {};
const API_DEBOUNCE_MS = 2000; // 2 seconds debounce

/**
 * Handle Lightning Mode entry - start streamlined Q&A → Company Summary → ICP → Leads flow
 */
export async function handleLightningModeEntry(inputs: LightningInputs | { input: string }): Promise<ChatMessage> {
  try {
    console.log('🔍 handleLightningModeEntry called with:', inputs);
    
    // Check if Lightning Mode is already active
    if (lightningModeActive) {
      console.log('🔍 Lightning Mode already active, skipping duplicate entry...');
      return {
        id: `lightning_active_${Date.now()}`,
        role: 'assistant' as const,
        content: '', // Empty content to prevent display
        timestamp: Date.now(),
        lightningMode: {
          type: 'lightning_mode' as const,
          step: LightningStep.GROWTH_CHALLENGE,
          data: { inputs: typeof inputs === 'object' && 'inputs' in inputs ? inputs.inputs : inputs },
          timestamp: Date.now()
        }
      };
    }
    
    lightningModeActive = true;
    
    // Start session timeout
    startSessionTimeout();
    
    // If inputs is a string input, parse it first
    let parsedInputs: LightningInputs;
    if ('input' in inputs) {
      console.log('🔍 Input is string, parsing...');
      const { parseLightningModeInput } = await import('../lightningModeInputParser');
      parsedInputs = parseLightningModeInput(inputs.input);
    } else if ('inputs' in inputs) {
      console.log('🔍 Input has inputs property, extracting...');
      parsedInputs = inputs.inputs;
    } else {
      console.log('🔍 Input is LightningInputs object');
      parsedInputs = inputs;
    }
    
    console.log('🔍 Lightning Mode entry with parsed inputs:', parsedInputs);
    
    // Reset posting flags for new session
    await resetPostingFlags();
    
    // Force clear all old data from localStorage to prevent contamination
    forceClearLightningModeData();
    
    // Store initial lightning mode data in localStorage
    const initialLightningData = {
      inputs: parsedInputs,
      step: 'q1',
      timestamp: Date.now(),
      answers: {}
    };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('lightningModeData', JSON.stringify(initialLightningData));
      console.log('🔍 Initial lightning mode data stored:', initialLightningData);
    }
    
    // Start background processing (Company Summary + ICP + Leads) in parallel
    console.log('🔍 Starting background processing during Q&A');
    const { startBackgroundProcessing } = await import('./backgroundProcessing');
    startBackgroundProcessing(parsedInputs);
    
    // Return questions immediately while background processing happens
    console.log('🔍 Background processing started, returning questions immediately');
    
    // Check if initial questions have already been displayed
    if (initialQuestionsDisplayed) {
      console.log('🔍 Initial questions already displayed, skipping duplicate...');
      return {
        id: `lightning_questions_duplicate_${Date.now()}`,
        role: 'assistant' as const,
        content: '', // Empty content to prevent display
        timestamp: Date.now(),
        lightningMode: {
          type: 'lightning_mode' as const,
          step: LightningStep.GROWTH_CHALLENGE,
          data: { inputs: parsedInputs, backgroundProcessingInProgress: true },
          timestamp: Date.now()
        }
      };
    }
    
    initialQuestionsDisplayed = true;
    const questionsContent = formatLightningModeQuestions();
    console.log('🔍 Generated questions content:', questionsContent.substring(0, 200) + '...');
    
    const lightningMessage = {
      id: `lightning_questions_${Date.now()}`,
      role: 'assistant' as const,
      content: questionsContent,
      timestamp: Date.now(),
      lightningMode: {
        type: 'lightning_mode' as const,
        step: LightningStep.GROWTH_CHALLENGE,
        data: { inputs: parsedInputs, backgroundProcessingInProgress: true },
        timestamp: Date.now()
      }
    };
    
    console.log('🔍 Returning Lightning mode message:', lightningMessage);
    return lightningMessage;
  } catch (error) {
    console.error('Lightning Mode entry error:', error);
    return {
      id: `lightning_error_${Date.now()}`,
      role: 'assistant',
      content: `❌ Lightning Mode failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
      timestamp: Date.now(),
      lightningMode: {
        type: 'lightning_mode',
        step: LightningStep.ENTRY,
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: Date.now()
      }
    };
  }
}

/**
 * Reset all posting flags for a new Lightning Mode session
 */
function resetPostingFlags(): void {
  summaryPosted = false;
  icpPosted = false;
  leadsPosted = false;
  icpConfirmationInProgress = false;
  q1Processed = false;
  q2Processed = false;
  q3Processed = false;
  initialQuestionsDisplayed = false;
  lightningModeActive = false;
  lastQ1Response = null;
  lastQ2Response = null;
  lastQ3Response = null;
  apiCallTimestamps = {}; // Reset API call timestamps
  console.log('🔍 Lightning Mode posting flags reset');
}

/**
 * Force clear all Lightning Mode data from localStorage
 */
function forceClearLightningModeData(): void {
  if (typeof window !== 'undefined') {
    const keysToRemove = [
      'lightning_company_summary',
      'lightning_summary',
      'lightning_inputs',
      'lightning_leads',
      'lightning_leads_results',
      'lightningModeResults',
      'lightning_icp',
      'lightningModeData',
      'lightning_summary_posted',
      'lightning_summary_ready',  // Clear the ready flag for new sessions
      'lightning_target_audience_data',
      'lightning_company_analysis_raw',
      'lightning_questions_complete'  // Clear question completion flag
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🔍 Force cleared all Lightning Mode data from localStorage (including summary flags)');
  }
}

/**
 * End Lightning Mode session
 */
export function endLightningModeSession(): void {
  lightningModeActive = false;
  
  // Clear session timeout
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
    sessionTimeoutId = null;
  }
  
  console.log('🔍 Lightning Mode session ended');
}

/**
 * Start session timeout
 */
function startSessionTimeout(): void {
  // Clear existing timeout
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
  }
  
  // Set new timeout
  sessionTimeoutId = setTimeout(() => {
    console.log('🔍 Lightning Mode session timed out');
    endLightningModeSession();
  }, SESSION_TIMEOUT_MS);
}

/**
 * Check if API call should be debounced
 */
function shouldDebounceApiCall(apiName: string): boolean {
  const now = Date.now();
  const lastCall = apiCallTimestamps[apiName];
  
  if (lastCall && (now - lastCall) < API_DEBOUNCE_MS) {
    console.log(`🔍 API call to ${apiName} debounced (last call was ${now - lastCall}ms ago)`);
    return true;
  }
  
  apiCallTimestamps[apiName] = now;
  return false;
}

/**
 * Format Lightning Mode Questions (Q1) with proper HTML formatting
 */
function formatLightningModeQuestions(): string {
  let content = `<div style="margin: 20px 0; padding: 24px;">`;
  
  content += `<h2 style="color: #FFFFFF; margin-bottom: 16px; font-size: 24px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">Let's Personalize Your Sales Strategy</h2>`;
  
  content += `<div style="margin-bottom: 20px;">`;
  content += `<h3 style="color: #E2E8F0; margin-bottom: 12px; font-size: 18px; font-weight: 500;">Q1. Which product or service are you focusing on?</h3>`;
  content += `<p style="color: #CBD5E1; margin-bottom: 16px; font-size: 14px; line-height: 1.5;">Please select or specify which products or services you want to focus on for prospect list generation.</p>`;
  content += `</div>`;
  
  content += `<div style="display: flex; flex-wrap: wrap; gap: 12px; margin: 20px 0;">`;
  content += `<button onclick="handleQ1Response('Software Solutions')" style="background: rgba(255, 255, 255, 0.1);  border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 14px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); min-width: 140px;" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.boxShadow='0 8px 24px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">`;
  content += `Software Solutions`;
  content += `</button>`;
  content += `<button onclick="handleQ1Response('Consulting Services')" style="background: rgba(255, 255, 255, 0.1);  border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 14px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); min-width: 140px;" onmouseover="this.style.background='rgba(139, 92, 246, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.boxShadow='0 8px 24px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">`;
  content += `Consulting Services`;
  content += `</button>`;
  content += `<button onclick="handleQ1Response('E-commerce Products')" style="background: rgba(255, 255, 255, 0.1);  border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 14px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); min-width: 140px;" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.boxShadow='0 8px 24px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">`;
  content += `E-commerce Products`;
  content += `</button>`;
  content += `<button onclick="handleQ1Response('SaaS Platform')" style="background: rgba(255, 255, 255, 0.1);  border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 14px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); min-width: 140px;" onmouseover="this.style.background='rgba(139, 92, 246, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.boxShadow='0 8px 24px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">`;
  content += `SaaS Platform`;
  content += `</button>`;
  content += `<button onclick="handleQ1Response('Others')" style="background: rgba(255, 255, 255, 0.1);  border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 14px 24px; border-radius: 12px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1); min-width: 140px;" onmouseover="this.style.background='rgba(139, 92, 246, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.4)'; this.style.boxShadow='0 8px 24px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.borderColor='rgba(255, 255, 255, 0.2)'; this.style.boxShadow='0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'; this.style.transform='translateY(0)'">`;
  content += `Others`;
  content += `</button>`;
  content += `</div>`;
  
  content += `<p style="color: #94A3B8; font-size: 14px; text-align: center; margin-top: 16px;"></p>`;
  
  content += `</div>`;
  
  return content;
}

// Export the main function and session management
export { resetPostingFlags, forceClearLightningModeData, startSessionTimeout };
