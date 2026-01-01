import { LightningInputs } from '../../types/lightningMode';
import { createLeadsResultMessage } from '../../prompts/leadGenerationPrompts';
import '../../globals.css';
import '../../components/lightning-mode.css';
// Track posting state to prevent duplicate outputs
let leadsPosted = false;
let isGeneratingLeads = false;

/**
 * Handle Lightning prospect list generation
 */
export async function handleLightningLeadGeneration(): Promise<void> {
  console.log('🔍 handleLightningLeadGeneration called!');
  
  // Prevent multiple simultaneous calls
  if (isGeneratingLeads) {
    console.log('⚡ Lead generation already in progress, skipping duplicate call...');
    return;
  }
  
  isGeneratingLeads = true;
  
  try {
    console.log('⚡ Starting Lightning prospect list generation...');
    
    // Get stored data from localStorage
    const companySummary = localStorage.getItem('lightning_company_summary');
    const rawCompanyAnalysis = localStorage.getItem('lightning_company_analysis_raw');
    const inputsJson = localStorage.getItem('lightning_inputs');
    
    if (!companySummary || !inputsJson) {
      console.error('⚡ Missing required data for Lightning prospect list generation');
      return;
    }
    
    const inputs = JSON.parse(inputsJson);
    
    // Use raw company analysis if available, otherwise use formatted summary
    const companyAnalysisForAPI = rawCompanyAnalysis ? JSON.parse(rawCompanyAnalysis) : { summary: companySummary };
    
    // Get target audience data from localStorage (saved from the Lightning Mode form)
    const targetAudienceDataJson = localStorage.getItem('lightning_target_audience_data');
    let targetAudienceData;
    
    if (targetAudienceDataJson) {
      try {
        targetAudienceData = JSON.parse(targetAudienceDataJson);
        console.log('⚡ Using target audience data from localStorage:', targetAudienceData);
      } catch (error) {
        console.warn('⚡ Failed to parse target audience data from localStorage, using defaults:', error);
        targetAudienceData = null;
      }
    }
    
    // Fallback to default values if no target audience data is found
    if (!targetAudienceData) {
      targetAudienceData = {
        salesObjective: 'Generate qualified leads',
        companyRole: 'Sales Director or Manager', 
        shortTermGoal: 'Schedule a demo',
        websiteUrl: inputs.website || '',
        gtm: 'B2B',
        targetIndustry: 'Technology/IT',
        targetRevenueSize: '500K-1M',
        targetEmployeeSize: '51-200',
        targetDepartments: 'Sales, Marketing',
        targetRegion: 'North America',
        targetLocation: 'United States'
      };
      console.log('⚡ Using fallback target audience data:', targetAudienceData);
    }
    
    console.log('⚡ Extracted target audience data:', targetAudienceData);
    
    // COMMENTED OUT: Frontend save causes duplicate onboarding records
    // Backend will handle the save in /api/lightning-mode/leads/route.ts (line 208)
    // This prevents creating multiple onboarding records for a single Lightning Mode session
    
    /*
    // CRITICAL: Save target audience to backend before generating leads (replicating Focus Mode)
    try {
      console.log('🔄 LIGHTNING: Auto-saving target audience to backend before lead generation...');
      
      // Parse targetDepartments from string to array (required by backend)
      let targetDepartmentsArray: string[] = [];
      if (targetAudienceData.targetDepartments) {
        if (typeof targetAudienceData.targetDepartments === 'string') {
          targetDepartmentsArray = targetAudienceData.targetDepartments
            .split(',')
            .map((d: string) => d.trim())
            .filter((d: string) => d.length > 0);
        } else if (Array.isArray(targetAudienceData.targetDepartments)) {
          targetDepartmentsArray = targetAudienceData.targetDepartments;
        }
      }
      
      // Ensure we have valid departments
      if (targetDepartmentsArray.length === 0) {
        targetDepartmentsArray = ['Sales', 'Marketing'];
      }
      
      // Map Lightning Mode field names to backend onboarding schema
      const onboardingData = {
        salesObjective: targetAudienceData.salesObjective || 'Generate qualified leads',
        userRole: targetAudienceData.companyRole || 'Sales Director or Manager',
        immediateGoal: targetAudienceData.shortTermGoal || 'Schedule a demo',
        companyWebsite: targetAudienceData.websiteUrl || inputs.website || '',
        marketFocus: targetAudienceData.gtm || 'B2B',
        targetDepartments: targetDepartmentsArray, // Array format required
        targetRegion: targetAudienceData.targetRegion || 'North America',
        targetLocation: targetAudienceData.targetLocation || 'United States',
        companyInfo: {
          industry: targetAudienceData.targetIndustry || 'Technology/IT',
          revenueSize: targetAudienceData.targetRevenueSize || '500K-1M',
          employeeSize: targetAudienceData.targetEmployeeSize || '51-200'
        }
      };
      
      console.log('📤 LIGHTNING: Auto-save formatted onboarding data:', onboardingData);
      
      // Import chatApi dynamically to save to backend
      const { chatApi } = await import('../../lib/chatApi');
      
      // Ensure anonymous user exists (creates tracker_anon_id if needed)
      await chatApi.ensureAnonymousUser();
      
      // Verify tracker_anon_id exists
      const anonId = localStorage.getItem('tracker_anon_id');
      console.log('🔑 LIGHTNING: Auto-save tracker anon_id:', anonId);
      
      // Save to backend using the same method as Focus Mode
      await chatApi.saveOnboardingData(onboardingData as Record<string, string | number | boolean | object | undefined>);
      
      console.log('✅ LIGHTNING: Target audience auto-saved to backend successfully!');
      
    } catch (error) {
      console.warn('⚠️ LIGHTNING: Auto-save to backend failed, continuing with lead generation:', error);
      // Don't block lead generation if save fails - data is still in localStorage
    }
    */
    
    console.log('✅ LIGHTNING: Skipping frontend save - backend will handle onboarding data save');
    
    // Show loading message with timer
    const startTime = Date.now();
    const loadingMessage = document.createElement('div');
    loadingMessage.id = 'lightning-leads-loading';
    loadingMessage.innerHTML = `
      <div style="margin: 20px 0; padding: 20px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2); text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 12px;">
          <div style="width: 20px; height: 20px; border: 2px solid #3B82F6; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <span style="color: #3B82F6; font-weight: 600;">Generating qualified leads...</span>
        </div>
        <div style="margin-bottom: 12px;">
          <div style="color: #94A3B8; font-size: 14px; margin-bottom: 4px;">⏱️ <span id="elapsed-time">0s</span> elapsed • Estimated: 1-2 minutes</div>
          <div style="color: #94A3B8; font-size: 12px;">Searching databases and analyzing company profiles...</div>
        </div>
        <div style="background: rgba(59, 130, 246, 0.1); height: 4px; border-radius: 2px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #3B82F6, #1D4ED8); height: 100%; width: 60%; border-radius: 2px; animation: pulse 2s ease-in-out infinite;"></div>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      </style>
    `;
    
    // Start timer
    let timerInterval: NodeJS.Timeout | null = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const timeElement = document.getElementById('elapsed-time');
      if (timeElement) {
        timeElement.textContent = `${elapsed}s`;
      }
    }, 1000);
    
    try {
      // Find the generate prospect list button and replace it with loading message
      let generateButton = document.querySelector('button[onclick="handleGenerateProspectsClick()"]');
      if (!generateButton) {
        // Fallback to old button selector
        generateButton = document.querySelector('button[onclick="lightningGenerateLeads()"]');
      }
      if (generateButton && generateButton.parentElement) {
        generateButton.parentElement.replaceWith(loadingMessage);
      }
      
      // Get tracker_anon_id from localStorage to pass to backend
      const trackerAnonId = localStorage.getItem('tracker_anon_id');
      console.log('⚡ FRONTEND: Passing tracker_anon_id to backend:', trackerAnonId);
      
      // Call the Lightning leads API
      const response = await fetch('/api/lightning-mode/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs,
          targetAudienceData,
          companySummary: companyAnalysisForAPI.summary,
          tracker_anon_id: trackerAnonId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Lightning leads generation failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('⚡ Lightning leads generated successfully:', data);
      console.log('⚡ Leads data type:', typeof data.leads);
      console.log('⚡ Leads data length:', data.leads?.length || 'N/A');
      console.log('⚡ Leads data preview:', data.leads?.substring?.(0, 200) || data.leads);
      
      // Clear timer and remove loading message
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      const loadingElement = document.getElementById('lightning-leads-loading');
      if (loadingElement) {
        loadingElement.remove();
      }
      
      // Check if leads is a string (HTML/markdown) or array
      let leadsContent;
      console.log('⚡ Processing leads data...');
      
      if (typeof data.leads === 'string') {
        console.log('⚡ Leads is string, cleaning and using for display');
        // Clean the content to remove any button/disclaimer that might be included
        leadsContent = data.leads
          .replace(/<div style="margin: 24px 0; text-align: center;">[\s\S]*?<\/div>/g, '')
          .replace(/<div style="margin: 20px 0; padding: 16px; background: rgba\(156, 163, 175, 0\.1\);[\s\S]*?<\/div>/g, '')
          .replace(/Impressed\? Come aboard for more! 🚀[\s\S]*?View Dashboard[\s\S]*?<\/a>/g, '')
          .replace(/Disclaimer:[\s\S]*?Privacy Policy\./g, '')
          .trim();
        
        // Ensure we have proper grid structure
        if (!leadsContent.includes('sales-opportunities-grid-container')) {
          console.log('⚡ Wrapping content in proper grid container');
          leadsContent = `<div class="sales-opportunities-grid-container">
  <div class="lead-grid">
    ${leadsContent}
  </div>
</div>`;
        }

        // Enforce Key Decision Maker format: FirstName ***** (mask last name only)
        try {
          const sanitizeDecisionMakersInGrid = (html: string): string => {
            if (!html || typeof html !== 'string') return html;
            if (!html.includes('lead-grid') || !html.includes('grid-cell')) return html;
            let cellIndex = 0;
            return html.replace(/(<div\s+class="grid-cell">)([\s\S]*?)(<\/div>)/g, (m, open, inner, close) => {
              cellIndex += 1;
              // Column 10 (Key Decision Maker) in a 13-column grid
              if (((cellIndex - 1) % 13) !== 9) return m;
              const textOnly = inner.replace(/<[^>]*>/g, '').trim();
              if (!textOnly) return m;
              // Already in correct masked format: FirstName *****
              if (/^[A-Za-z][A-Za-z\-'.]*\s+\*{3,}$/.test(textOnly)) return m;
              // If it's only stars, leave unchanged (cannot recover)
              if (/^\*{3,}$/.test(textOnly)) return m;
              const tokens = textOnly.split(/\s+/).filter(Boolean);
              // If we have first and last, mask last(s)
              if (tokens.length >= 2) {
                const masked = `${tokens[0]} *****`;
                return `${open}${masked}${close}`;
              }
              // Single token (likely a first name) – keep as is
              return `${open}${tokens[0]}${close}`;
            });
          };
          leadsContent = sanitizeDecisionMakersInGrid(leadsContent);
        } catch (e) {
          console.warn('⚠️ Failed to sanitize decision maker cells:', e);
        }
      } else if (Array.isArray(data.leads)) {
        console.log('⚡ Leads is array, formatting for display');
        leadsContent = formatCompactProspectsTable(data.leads);
      } else {
        console.log('⚡ Leads is neither string nor array, using fallback');
        leadsContent = '<p>No prospect data available.</p>';
      }
      
      console.log('⚡ Final leads content length:', leadsContent.length);
      
      // Structure the content - ONLY the grid content with wrapper
      const gridContent = `
        <div class="lightning-mode-table-wrapper">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div class="lightning-mode-table-title">Your Lightning Mode Prospects</div>
            <div id="lightning-excel-export-button-header" data-content="${leadsContent.replace(/"/g, '&quot;')}" style="margin-left: auto;"></div>
          </div>
          ${leadsContent}
        </div>
      `;
      
      // Button content - Using structured data instead of HTML
      const buttonContent = {
        type: 'dashboard_button',
        title: 'Impressed? Come aboard for more! 🚀',
        buttonText: '📊 View Dashboard',
        buttonUrl: 'https://dashboard.salescentri.com/dashboard',
        style: 'primary'
      };
      
      // Disclaimer content - Using structured data instead of HTML
      const disclaimerContent = {
        type: 'disclaimer',
        title: 'Disclaimer:',
        text: 'Access to complete and verified information requires a user account (Sign up). Some data currently displayed may be heuristic or placeholder. We strictly adhere to and comply with GDPR, CCPA, CPRA, and other applicable data privacy regulations. By signing up, you agree to our Terms of Service and Privacy Policy.'
      };
      
      // Post the content as separate messages for complete isolation
      if (!leadsPosted) {
        leadsPosted = true; // Set flag to prevent duplicate posting
        
        // Post grid content first
        window.dispatchEvent(new CustomEvent('postLightningMessage', {
          detail: {
            content: gridContent,
            type: 'lightning_leads',
            timestamp: Date.now(),
            isHTML: true
          }
        }));
        
        // Post disclaimer content first (before dashboard button)
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('postLightningMessage', {
            detail: {
              content: JSON.stringify(disclaimerContent),
              type: 'lightning_disclaimer',
              timestamp: Date.now(),
              isStructuredData: true,
              data: disclaimerContent
            }
          }));
        }, 500);
        
        // Post button content after disclaimer
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('postLightningMessage', {
            detail: {
              content: JSON.stringify(buttonContent),
              type: 'lightning_dashboard_button',
              timestamp: Date.now(),
              isStructuredData: true,
              data: buttonContent
            }
          }));
        }, 1000);
        
      } else {
        console.log('🔍 Leads already posted via event system, skipping duplicate...');
      }
      
      // Store leads results in localStorage
      localStorage.setItem('lightning_leads_results', JSON.stringify(data));
      
      console.log('⚡ Lightning prospect list generation completed successfully');
      
    } catch (error) {
      // Clear timer and remove loading message
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
      const loadingElement = document.getElementById('lightning-leads-loading');
      if (loadingElement) {
        loadingElement.remove();
      }
      
      // Re-throw the error to be caught by outer catch block
      throw error;
    } finally {
      // Reset the generation flag
      isGeneratingLeads = false;
    }
    
  } catch (error) {
    console.error('⚡ Lightning prospect list generation error:', error);
    
    // Reset the generation flag on error
    isGeneratingLeads = false;
    
    // Show error message
    const errorMessage = document.createElement('div');
    errorMessage.innerHTML = `
      <div style="margin: 20px 0; padding: 20px; background: rgba(239, 68, 68, 0.1); border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2);">
        <h3 style="color: #EF4444; margin-bottom: 8px;">❌ Prospect List Error</h3>
        <p style="color: #6B7280; margin: 0;">Failed to generate prospect list: ${error instanceof Error ? error.message : 'Unknown error'}</p>
        <button onclick="handleLightningLeadGeneration()" style="margin-top: 12px; background: #EF4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
          Try Again
        </button>
      </div>
    `;
    
    // Insert error message
    let generateButton = document.querySelector('button[onclick="handleGenerateProspectsClick()"]');
    if (!generateButton) {
      // Fallback to old button selector
      generateButton = document.querySelector('button[onclick="lightningGenerateLeads()"]');
    }
    if (generateButton && generateButton.parentElement) {
      generateButton.parentElement.replaceWith(errorMessage);
    }
  }
}

/**
 * Format prospects table for Lightning Mode display using lead-table styling
 */
export function formatCompactProspectsTable(prospects: any[]): string {
  if (!prospects || prospects.length === 0) {
    return '<p>No prospects generated.</p>';
  }

  return `
    <div class="lightning-mode-table-wrapper">
      <div class="lightning-mode-table-title">Your Lightning Mode Prospects</div>
      <div class="sales-opportunities-table-container">
        <table class="sales-opportunities-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Website</th>
              <th>Industry</th>
              <th>Sub-Industry</th>
              <th>Product Line</th>
              <th>Use Case</th>
              <th>Employees</th>
              <th>Revenue</th>
              <th>Location</th>
              <th>Key Decision Maker</th>
              <th>Designation</th>
              <th>Pain Points</th>
              <th>Approach Strategy</th>
            </tr>
          </thead>
          <tbody>
            ${prospects.slice(0, 10).map((prospect, index) => `
              <tr>
                <td>${prospect.company || prospect['Company Name'] || 'N/A'}</td>
                <td><a href="${prospect.website || prospect['Website'] || '#'}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: none;">${prospect.website || prospect['Website'] || 'N/A'}</a></td>
                <td>${prospect.industry || prospect['Industry'] || 'N/A'}</td>
                <td>${prospect.subIndustry || prospect['Sub-Industry'] || 'N/A'}</td>
                <td>${prospect.productLine || prospect['Product Line'] || 'N/A'}</td>
                <td>${prospect.useCase || prospect['Use Case'] || 'N/A'}</td>
                <td>${prospect.employees || prospect['Employees'] || 'N/A'}</td>
                <td>${prospect.revenue || prospect['Revenue'] || 'N/A'}</td>
                <td>${prospect.location || prospect['Location'] || 'N/A'}</td>
                <td>${prospect.decisionMaker || prospect['Key Decision Maker'] || 'CEO/Founder'}</td>
                <td>${prospect.decisionMakerRole || prospect['Designation'] || 'Business Owner'}</td>
                <td>${prospect.painPoints || prospect['Pain Points'] || 'N/A'}</td>
                <td>${prospect.approachStrategy || prospect['Approach Strategy'] || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ${prospects.length > 10 ? `<p style="text-align: center; color: #6B7280; margin-top: 12px; font-size: 14px;">Showing top 10 of ${prospects.length} prospects</p>` : ''}
    </div>
  `;
}
