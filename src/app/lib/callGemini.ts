// Client-side function to call Gemini/Langchain API route with chat history support

// Type definitions for Gemini chat history
interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiOptions {
  mode?: 'sales' | 'research' | 'focus' | 'lightning' | 'brain' | 'explore';
  companyContext?: string;
  useLangchain?: boolean;
  enableWebSearch?: boolean;
  enableRAG?: boolean;
  useGrounding?: boolean;
  chatId?: string;
}

// Response interface for enhanced results
export interface GeminiResponse {
  result: string;
  detailedSources?: Array<{
    title: string;
    url: string;
    domain: string;
    content: string;
    snippet: string;
  }>;
  sources?: string[];
}

export async function callGemini(
  prompt: string, 
  chatHistory: ChatMessage[] = [], 
  options: GeminiOptions = {}
): Promise<string> {
  // Default to using Langchain for enhanced capabilities
  const {
    enableWebSearch = options.mode === 'research' || options.mode === 'focus',
    enableRAG = true,
    useGrounding = false,
    chatId = `chat_${Date.now()}`,
    ...otherOptions
  } = options;

  // Helper with timeout
  const postWithTimeout = async (body: unknown, timeoutMs = 14000) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timeout);
    }
  };

  // Retry strategy: langchain+history -> langchain with small history -> langchain no history -> legacy gemini
  const payloadBase = {
    options: otherOptions,
    enableWebSearch,
    enableRAG,
    useGrounding,
    chatId,
  } as const;

  // Attempt 1: full payload
  try {
    const data = await postWithTimeout({
      query: prompt,
      chatHistory,
      useLangchain: true,
      ...payloadBase,
    });
    if (data.result) return data.result;
  } catch {
    // continue to next attempt
  }

  // Attempt 2: langchain with last few messages only (preserve context, avoid payload bloat)
  try {
    const smallHistory = Array.isArray(chatHistory) && chatHistory.length > 0
      ? chatHistory.slice(-6)
      : [];
    const data = await postWithTimeout({
      query: prompt,
      chatHistory: smallHistory,
      useLangchain: true,
      ...payloadBase,
    }, 16000);
    if (data.result) return data.result;
  } catch {
    // continue to next attempt
  }

  // Attempt 3: langchain without history (avoid huge payloads / history formatting issues)
  try {
    const data = await postWithTimeout({
      query: prompt,
      chatHistory: [],
      useLangchain: true,
      ...payloadBase,
    }, 16000);
    if (data.result) return data.result;
  } catch {
    // continue to fallback
  }

  // Attempt 4: legacy Gemini-only mode as a safety net
  const data = await postWithTimeout({
    query: prompt,
    chatHistory: [],
    useLangchain: false,
    ...payloadBase,
  }, 18000);
  if (data.result) return data.result;
  throw new Error(data.error || 'Unknown API error');
}

// Enhanced version that returns full response with sources
export async function callGeminiWithSources(
  prompt: string, 
  chatHistory: ChatMessage[] = [], 
  options: GeminiOptions = {}
): Promise<GeminiResponse> {
  // Default to using Langchain for enhanced capabilities
  const {
    enableWebSearch = options.mode === 'research' || options.mode === 'focus',
    enableRAG = true,
    useGrounding = false,
    chatId = `chat_${Date.now()}`,
    ...otherOptions
  } = options;

  const postWithTimeout = async (body: unknown, timeoutMs = 18000) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timeout);
    }
  };

  const payloadBase = {
    options: otherOptions,
    enableWebSearch,
    enableRAG,
    useGrounding,
    chatId,
  } as const;

  const smallHistory = Array.isArray(chatHistory) && chatHistory.length > 0 ? chatHistory.slice(-6) : [];
  const tryOrders = [
    { useLangchain: true, chatHistory },
    { useLangchain: true, chatHistory: smallHistory as ChatMessage[] },
    { useLangchain: true, chatHistory: [] as ChatMessage[] },
    { useLangchain: false, chatHistory: [] as ChatMessage[] },
  ];

  let lastData: { result?: string; detailedSources?: Array<{ title: string; url: string; domain: string; content: string; snippet: string }>; sources?: string[] } | null = null;
  for (const attempt of tryOrders) {
    try {
      const data = await postWithTimeout({
        query: prompt,
        ...attempt,
        ...payloadBase,
      });
      lastData = data;
      if (data?.result) {
        return {
          result: data.result || '',
          detailedSources: data.detailedSources || [],
          sources: data.sources || []
        };
      }
    } catch {
      // proceed to next attempt
    }
  }

  // If all attempts failed but we have some data, return empty-structured result
  return {
    result: lastData?.result || '',
    detailedSources: lastData?.detailedSources || [],
    sources: lastData?.sources || []
  };
}
