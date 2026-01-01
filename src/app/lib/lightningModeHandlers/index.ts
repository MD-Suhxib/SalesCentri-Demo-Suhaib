// Lightning Mode Handlers - Modular Export System
// This file exports all Lightning Mode handler functions from their respective modules

// Core Lightning Mode functions
export { 
  handleLightningModeEntry, 
  resetPostingFlags, 
  forceClearLightningModeData, 
  endLightningModeSession, 
  startSessionTimeout 
} from './core';

// Background processing and company summary generation
export { 
  startBackgroundProcessing, 
  generateICPData, 
  generateLeadsData, 
  formatCompactCompanySummary,
  formatCompactEditableICPTable,
  formatCompactProspectsTable,
  shouldDebounceApiCall,
  markQuestionsComplete,
  areQuestionsComplete,
  resetQuestionState
} from './backgroundProcessing';

// Question handlers
export { 
  handleQ1Response, 
  handleQ2Response, 
  handleQ3Response,
  formatOutreachPreferenceQuestion, 
  formatLeadHandoffPreferenceQuestion 
} from './questionHandlers';

// Lead generation handlers
export { 
  handleLightningLeadGeneration
} from './leadGeneration';

// Global handlers
// Note: Do not re-export side-effectful globals to avoid multiple initializations

// Legacy functions for backward compatibility
export { 
  getLightningModeResults, 
  getLightningModeICPResults, 
  handleICPConfirmation,
  editICPField,
  updateICPField,
  formatMarkdownProspectsTable
} from './legacy';

// Import and initialize global handlers
