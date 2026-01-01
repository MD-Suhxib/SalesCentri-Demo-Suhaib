import { useCallback, useState } from 'react';
import { resetLightningSession } from '../lib/lightningSession';
import { chatApi } from '../lib/chatApi';
import { LightningInputs, ICPResult, SampleLead } from '../types/lightningMode';

export interface LightningModeState {
  isActive: boolean;
  isProcessing: boolean;
  error: string | null;
  icpResult?: ICPResult;
  sampleLeads?: SampleLead[];
}

export interface LightningModeActions {
  activateLightningMode: () => void;
  deactivateLightningMode: () => void;
  processLightningInput: (input: string) => Promise<void>;
  generateICPAndLeads: (inputs: LightningInputs) => Promise<{ icp: ICPResult; leads: SampleLead[] }>;
  clearError: () => void;
}

export function useLightningMode(): LightningModeState & LightningModeActions {
  const [isActive, setIsActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [icpResult, setIcpResult] = useState<ICPResult | undefined>();
  const [sampleLeads, setSampleLeads] = useState<SampleLead[] | undefined>();

  const activateLightningMode = useCallback(() => {
    console.log('🔍 Lightning Mode activated');
    setIsActive(true);
    setError(null);
  }, []);

  const deactivateLightningMode = useCallback(() => {
    console.log('🔍 Lightning Mode deactivated');
    setIsActive(false);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateICPAndLeads = useCallback(async (inputs: LightningInputs): Promise<{ icp: ICPResult; leads: SampleLead[] }> => {
    console.log('🚀 Generating ICP and leads for inputs:', inputs);
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/lightning-mode/icp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      console.log('✅ ICP and leads generated successfully:', result);
      
      // Store results in state
      setIcpResult(result.icp);
      setSampleLeads(result.sampleLeads);
      
      return {
        icp: result.icp,
        leads: result.sampleLeads
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate ICP and leads';
      console.error('❌ ICP generation error:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const processLightningInput = useCallback(async (input: string): Promise<void> => {
    if (!input.trim() || isProcessing) return;

    console.log('🔍 Processing Lightning Mode input:', input.substring(0, 50) + '...');
    setIsProcessing(true);
    setError(null);

    try {
      // Ensure a fresh Lightning session before any processing
      resetLightningSession();
      // Simple input parsing to avoid chunk loading issues
      let lightningInputs: LightningInputs;
      
      // Check if input contains structured data (email/website/LinkedIn)
      const hasEmail = input.includes('@') || input.includes('email');
      const hasWebsite = input.includes('http') || input.includes('www.') || input.includes('website');
      const hasLinkedIn = input.includes('linkedin.com') || input.includes('linkedin');
      
      if (hasEmail || hasWebsite || hasLinkedIn) {
        console.log('🔍 Structured input detected, parsing...');
        
        // Simple parsing logic
        const emailMatch = input.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        const websiteMatch = input.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/);
        const linkedinMatch = input.match(/(https?:\/\/[^\/]*linkedin\.com\/[^\s]+)/);
        
        lightningInputs = {};
        
        if (emailMatch) {
          lightningInputs.email = emailMatch[1];
        }
        if (websiteMatch) {
          lightningInputs.website = websiteMatch[1];
        }
        if (linkedinMatch) {
          lightningInputs.linkedin = linkedinMatch[1];
        }
        
        // If no structured data found, treat as regular input
        if (!lightningInputs.email && !lightningInputs.website && !lightningInputs.linkedin) {
          lightningInputs = { input: input };
        }
      } else {
        // Treat as regular Lightning Mode input
        lightningInputs = { input: input };
      }
      
      // Create chat with Lightning Mode flag
      const chat = await chatApi.createChat("Lightning Mode Chat", "lightning");
      
      if (!chat || !chat.id) {
        throw new Error("Failed to create chat. Please try again.");
      }
      
      // Store Lightning Mode data
      localStorage.setItem("lightningModeData", JSON.stringify({
        chatId: chat.id,
        inputs: lightningInputs,
        step: 'entry',
        timestamp: Date.now()
      }));
      
      // Create initial Lightning Mode message
      const lightningMessage = {
        id: `lightning_entry_${Date.now()}`,
        role: 'user' as const,
        content: isLightningInput ? `Lightning Mode Entry: ${JSON.stringify(lightningInputs)}` : input,
        timestamp: Date.now(),
        lightningMode: {
          type: 'lightning_mode' as const,
          step: 'entry' as const,
          data: isLightningInput ? { inputs: lightningInputs } : { input: input },
          timestamp: Date.now()
        }
      };
      
      // Store the message for the chat to process
      localStorage.setItem("pendingLightningMessage", JSON.stringify(lightningMessage));
      
      // Redirect to PSA chat page
      window.location.href = `/solutions/psa-suite-one-stop-solution/c/${chat.id}`;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Lightning Mode processing error:', errorMessage);
      
      // Handle chunk loading errors specifically
      if (errorMessage.includes('Loading chunk') || errorMessage.includes('failed')) {
        console.log('🔍 Chunk loading error detected, using fallback approach');
        setError('Loading error detected. Please refresh the page and try again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing]);

  return {
    isActive,
    isProcessing,
    error,
    icpResult,
    sampleLeads,
    activateLightningMode,
    deactivateLightningMode,
    processLightningInput,
    generateICPAndLeads,
    clearError
  };
}
