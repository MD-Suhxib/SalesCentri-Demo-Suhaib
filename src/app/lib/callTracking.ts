/**
 * Shared call tracking store for linking webhook data with call metadata
 * This allows the webhook handler to find email/phone when ElevenLabs doesn't include them
 * 
 * Uses globalThis to ensure the Map is shared across Next.js serverless function instances
 */

interface CallData {
  email: string;
  phone: string;
  subject: string | null;
  callEndTime: number;
  timestamp: number;
}

// Use globalThis to ensure the Map persists across serverless function instances
// This is critical for Next.js where each API route might run in a separate process
declare global {
  // eslint-disable-next-line no-var
  var __callTrackingStore: Map<string, CallData> | undefined;
  // eslint-disable-next-line no-var
  var __callTrackingCleanupInterval: NodeJS.Timeout | undefined;
}

// Initialize the store on globalThis if it doesn't exist
if (!globalThis.__callTrackingStore) {
  globalThis.__callTrackingStore = new Map<string, CallData>();
  console.log('[Call Tracking] Initialized global call tracking store');
  
  // Clean up old entries (older than 10 minutes)
  // Only set up interval once
  if (!globalThis.__callTrackingCleanupInterval) {
    globalThis.__callTrackingCleanupInterval = setInterval(() => {
      const now = Date.now();
      const tenMinutes = 10 * 60 * 1000;
      const store = globalThis.__callTrackingStore;
      if (store) {
        for (const [agentId, data] of store.entries()) {
          if (now - data.timestamp > tenMinutes) {
            store.delete(agentId);
            console.log('[Call Tracking] Cleaned up old entry for agent:', agentId);
          }
        }
      }
    }, 5 * 60 * 1000); // Run cleanup every 5 minutes
  }
}

// Get the shared store
function getStore(): Map<string, CallData> {
  if (!globalThis.__callTrackingStore) {
    globalThis.__callTrackingStore = new Map<string, CallData>();
  }
  return globalThis.__callTrackingStore;
}

export function storeCallData(agentId: string, data: CallData) {
  const store = getStore();
  store.set(agentId, data);
  console.log('[Call Tracking] Stored call data for webhook matching:', { 
    agentId, 
    email: data.email, 
    phone: data.phone,
    storeSize: store.size 
  });
}

export function getCallData(agentId: string): CallData | null {
  const store = getStore();
  const data = store.get(agentId);
  console.log('[Call Tracking] Retrieved call data:', { 
    agentId, 
    found: !!data,
    storeSize: store.size,
    allAgents: Array.from(store.keys())
  });
  return data || null;
}

export function clearCallData(agentId: string) {
  const store = getStore();
  store.delete(agentId);
  console.log('[Call Tracking] Cleared call data for agent:', agentId);
}

