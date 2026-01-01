import { LightningInputs } from '../../types/lightningMode';
import { handleQ1Response, handleQ2Response, handleQ3Response } from './questionHandlers';
import { handleLightningLeadGeneration } from './leadGeneration';
import { forceClearLightningModeData } from './core';

// Track posting state to prevent duplicate outputs
let summaryPosted = false;

/**
 * Global function for Lightning prospect list generation (called by HTML button)
 */
declare global {
  interface Window {
    editTargetField: (fieldName: string) => void;
    clearLightningModeData: () => void;
    handleQ1Response: (productFocus: string) => void;
    handleQ2Response: (outreachPreference: string) => void;
    handleQ3Response: (leadHandoffPreference: string) => void;
    lightningGenerateLeads: () => void;
    handleGenerateProspectsClick: () => Promise<void>;
    toggleTargetAudienceEdit: () => void;
    saveTargetAudienceChanges: () => void;
    cancelTargetAudienceEdit: () => void;
  }
}

// Make the function available globally
if (typeof window !== 'undefined') {
  window.editTargetField = (fieldName: string) => {
    const input = document.getElementById(`edit-${fieldName}`) as HTMLInputElement | HTMLSelectElement;
    if (input) {
      input.focus();
      if (input instanceof HTMLInputElement) {
        input.select();
      }
    }
  };
  
  window.clearLightningModeData = () => {
    forceClearLightningModeData();
    console.log('🔍 Lightning Mode data cleared manually');
  };
  
  // Global Q&A response handlers
  window.handleQ1Response = async (productFocus: string) => {
    console.log('🔍 Q1 Response called:', productFocus);
    const lightningData = JSON.parse(localStorage.getItem('lightningModeData') || '{}');
    const result = await handleQ1Response(productFocus, lightningData.inputs);
    
    // Post the result to chat
    if (result.content) {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: result.content,
          type: 'q1_response',
          timestamp: Date.now()
        }
      }));
    }
  };
  
  window.handleQ2Response = async (outreachPreference: string) => {
    console.log('🔍 Q2 Response called:', outreachPreference);
    const lightningData = JSON.parse(localStorage.getItem('lightningModeData') || '{}');
    const result = await handleQ2Response(outreachPreference, lightningData);
    
    // Post the result to chat
    if (result.content) {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: result.content,
          type: 'q2_response',
          timestamp: Date.now()
        }
      }));
    }
  };
  
  window.handleQ3Response = async (leadHandoffPreference: string) => {
    console.log('🔍 Q3 Response called:', leadHandoffPreference);
    const lightningData = JSON.parse(localStorage.getItem('lightningModeData') || '{}');
    const result = await handleQ3Response(leadHandoffPreference, lightningData);
    
    // Post the result to chat
    if (result.content) {
      window.dispatchEvent(new CustomEvent('postLightningMessage', {
        detail: {
          content: result.content,
          type: 'q3_response',
          timestamp: Date.now()
        }
      }));
    }
    
    // Also trigger the results display after Q3 completion
    console.log('🔍 Q3 completed, triggering results display...');
    setTimeout(() => {
      // Check for stored summary and display it
      const summary = localStorage.getItem('lightning_company_summary');
      console.log('🔍 Checking for summary in localStorage:', summary ? 'Found' : 'Not found');
      console.log('🔍 Summary posted flag:', summaryPosted);
      
      if (summary && !summaryPosted) {
        summaryPosted = true;
        console.log('🔍 Posting stored summary to chat from global handler...');
        console.log('🔍 Summary content preview:', summary.substring(0, 200) + '...');
        
        try {
          const { formatCompactCompanySummary } = require('./backgroundProcessing');
          const formattedSummary = formatCompactCompanySummary(summary);
          console.log('🔍 Formatted summary length:', formattedSummary.length);
          
          window.dispatchEvent(new CustomEvent('postLightningMessage', {
            detail: {
              content: formattedSummary,
              type: 'company_summary',
              timestamp: Date.now()
            }
          }));
          console.log('🔍 Summary posted to chat successfully');
        } catch (error) {
          console.error('🔍 Error formatting or posting summary:', error);
        }
      } else if (!summary) {
        console.log('🔍 No summary found in localStorage, checking if background processing is still running...');
        // Check if background processing is still running
        const processingData = localStorage.getItem('lightningModeResults');
        if (processingData) {
          console.log('🔍 Background processing data found, waiting for completion...');
        }
        
        // Company summary posting is now handled by startBackgroundProcessing
        // No need for delayed checking to avoid duplication
        console.log('🔍 Company summary posting is handled by startBackgroundProcessing, no delayed checking needed...');
      }
    }, 3000);
  };

  // Global Lightning leads generation handler
  window.lightningGenerateLeads = handleLightningLeadGeneration;
  
  // Global robust click handler with fallback
  window.handleGenerateProspectsClick = async function() {
    console.log('🔍 Generate Prospects button clicked!');
    
    try {
      // Try to use the global function first
      if (typeof window.lightningGenerateLeads === 'function') {
        console.log('🔍 Using global lightningGenerateLeads function');
        await window.lightningGenerateLeads();
      } else {
        console.log('🔍 Global function not available, trying dynamic import...');
        // Fallback: dynamically import and call the function
        const { handleLightningLeadGeneration } = await import('./leadGeneration');
        await handleLightningLeadGeneration();
      }
    } catch (error) {
      console.error('🔍 Error generating prospects:', error);
      alert('Error generating prospects: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };
  
  // Debug: Log that the functions are set up
  console.log('🔍 Global handlers initialized - lightningGenerateLeads function available:', typeof window.lightningGenerateLeads);
  console.log('🔍 Global handlers initialized - handleGenerateProspectsClick function available:', typeof window.handleGenerateProspectsClick);
}

/**
 * View Dashboard function (to be attached to window)
 */
export function viewDashboard(): void {
  try {
    console.log('📊 View Dashboard button clicked');
    
    // Redirect to SalesCentri dashboard
    if (typeof window !== 'undefined') {
      window.open('https://dashboard.salescentri.com', '_blank');
    }
  } catch (error) {
    console.error('Error opening dashboard:', error);
  }
}

// Make viewDashboard available globally
if (typeof window !== 'undefined') {
  (window as any).viewDashboard = viewDashboard;
}

/**
 * Toggle target audience edit mode
 */
if (typeof window !== 'undefined') {
  (window as any).toggleTargetAudienceEdit = () => {
    const textView = document.getElementById('target-audience-text-view');
    const editView = document.getElementById('target-audience-edit-view');
    
    if (textView && editView) {
      textView.style.display = 'none';
      editView.style.display = 'block';
    }
  };
}

/**
 * Save target audience changes (with backend persistence)
 */
if (typeof window !== 'undefined') {
  (window as any).saveTargetAudienceChanges = async () => {
    const fields = [
      'salesObjective', 'companyRole', 'shortTermGoal', 'websiteUrl', 'gtm',
      'targetIndustry', 'targetRevenueSize', 'targetEmployeeSize', 
      'targetDepartments', 'targetRegion', 'targetLocation'
    ];
    
    // Collect updated values
    const updatedTargetAudienceData: any = {};
    
    // Update text view with new values and collect data
    fields.forEach(field => {
      const input = document.getElementById(`edit-${field}`) as HTMLInputElement | HTMLSelectElement;
      const textElement = document.getElementById(`text-${field}`);
      
      if (input && textElement) {
        textElement.textContent = input.value;
        updatedTargetAudienceData[field] = input.value;
      }
    });
    
    // Save updated target audience data to localStorage for lead generation to use
    localStorage.setItem('lightning_target_audience_data', JSON.stringify(updatedTargetAudienceData));
    console.log('💾 Target audience data saved to localStorage:', updatedTargetAudienceData);
    
    // Backend save removed: Manual save now writes to localStorage only
    // Keeping UI simple to avoid duplicate saves and indicators
    
    // Switch back to text view
    const textView = document.getElementById('target-audience-text-view');
    const editView = document.getElementById('target-audience-edit-view');
    
    if (textView && editView) {
      textView.style.display = 'block';
      editView.style.display = 'none';
    }
    
    console.log('✅ Target audience changes saved');
  };
}

/**
 * Cancel target audience edit
 */
if (typeof window !== 'undefined') {
  (window as any).cancelTargetAudienceEdit = () => {
    // Switch back to text view without saving
    const textView = document.getElementById('target-audience-text-view');
    const editView = document.getElementById('target-audience-edit-view');
    
    if (textView && editView) {
      textView.style.display = 'block';
      editView.style.display = 'none';
    }
    
    console.log('❌ Target audience edit cancelled');
  };
}
