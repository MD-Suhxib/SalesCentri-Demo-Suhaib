// Research flow utilities for ResearchGPT mode
import { getAuthHeaders, UserProfile } from './auth';

export interface ResearchFlowState {
  step: 'normal_chat' | 'context_research' | 'icp_check' | 'icp_development' | 'lead_generation' | 'completed';
  userProfile?: UserProfile;
  conversationContext?: string;
  icpStatus?: 'done' | 'pending' | 'unknown';
  researchType?: 'context_aware' | 'lead_generation' | 'icp' | 'general';
  isAutoProcessing?: boolean;
  shouldTriggerLeadGen?: boolean;
}

export interface ResearchRequest {
  query: string;
  chatHistory?: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  userProfile?: UserProfile | null;
  conversationContext?: string;
  icpStatus?: 'done' | 'pending' | 'unknown';
  researchType?: 'context_aware' | 'lead_generation' | 'icp' | 'research' | 'general';
  shouldTriggerLeadGen?: boolean;
}

export const initiateResearchMode = async (userProfile?: UserProfile): Promise<string> => {
  const authHeaders = getAuthHeaders();
  
  const response = await fetch('/api/gpt/research', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify({
      query: 'research mode activation',
      chatHistory: [],
      userProfile,
      researchType: 'context_aware',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to initiate research mode');
  }

  const data = await response.json();
  return data.result;
};

export const processResearchQuery = async (request: ResearchRequest): Promise<{
  result: string;
  shouldTrigger?: boolean;
}> => {
  const authHeaders = getAuthHeaders();
  
  const response = await fetch('/api/gpt/research', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to process research query');
  }

  return await response.json();
};

export const extractCompanyFromMessage = (message: string): string | null => {
  // Simple regex patterns to extract company names/URLs
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/g;
  const companyPattern = /(?:company|website|site|domain)?\s*(?:is|:)?\s*([a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})?)/gi;
  
  const urlMatch = message.match(urlPattern);
  if (urlMatch) {
    return urlMatch[0].replace(/^https?:\/\//, '').replace(/^www\./, '');
  }
  
  const companyMatch = message.match(companyPattern);
  if (companyMatch) {
    return companyMatch[0].split(/\s+/).pop() || null;
  }
  
  return null;
};

export const detectICPResponse = (message: string): 'done' | 'pending' | 'unknown' => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('yes') || lowerMessage.includes('done') || lowerMessage.includes('defined') || lowerMessage.includes('have')) {
    return 'done';
  }
  
  if (lowerMessage.includes('no') || lowerMessage.includes('need') || lowerMessage.includes('help') || lowerMessage.includes('create')) {
    return 'pending';
  }
  
  return 'unknown';
};

// Check if conversation should trigger lead generation (end of conversation indicator)
export const shouldTriggerLeadGeneration = (message: string, messageCount: number): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Trigger if conversation has enough context (3+ messages) and contains wrap-up indicators
  if (messageCount >= 3) {
    const wrapUpIndicators = [
      'thank', 'thanks', 'help', 'appreciate', 'great', 'good', 'perfect', 
      'that works', 'sounds good', 'bye', 'goodbye', 'see you', 'later',
      'done', 'finished', 'complete', 'ready', 'next step', 'final'
    ];
    
    return wrapUpIndicators.some(indicator => lowerMessage.includes(indicator));
  }
  
  return false;
};

// Extract conversation context for lead generation
export const extractConversationContext = (chatHistory: Array<{
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}>): string => {
  if (!chatHistory || chatHistory.length === 0) return '';
  
  // Get user messages (excluding system/assistant messages)
  const userMessages = chatHistory
    .filter(msg => msg.role === 'user')
    .map(msg => msg.parts[0]?.text || '')
    .join(' ');
  
  return userMessages.substring(0, 1000); // Limit context to prevent API overload
};
