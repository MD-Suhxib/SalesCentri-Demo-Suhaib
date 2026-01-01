# AI Implementation Documentation

## Gemini, LangChain, Embeddings, RAG, and OpenAI Implementation Guide

This document provides comprehensive implementation patterns, syntax, and knowledge for implementing Gemini, LangChain, embeddings, RAG, and OpenAI in a new codebase, based on the current SalesCentri implementation.

---

## Table of Contents

1. [Gemini Implementation](#1-gemini-implementation)
2. [LangChain Implementation](#2-langchain-implementation)
3. [Embeddings Implementation](#3-embeddings-implementation)
4. [RAG (Retrieval Augmented Generation) Implementation](#4-rag-retrieval-augmented-generation-implementation)
5. [OpenAI Implementation](#5-openai-implementation)
6. [Integration Patterns](#6-integration-patterns)

---

## 1. Gemini Implementation

### 1.1 Core Setup

**Package**: `@google/genai`

**Environment Variable**: `GOOGLE_API_KEY`

**Basic Initialization**:

```typescript
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY;
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});
```

### 1.2 Chat Creation and Configuration

**Basic Chat Setup**:

```typescript
const chat = ai.chats.create({
  model: "gemini-2.5-flash", // or 'gemini-2.0-flash', 'gemini-1.5-flash'
  history: chatHistory, // Array of ChatMessage objects
  config: {
    systemInstruction: "Your system prompt here",
    thinkingConfig: { thinkingBudget: -1 },
    responseMimeType: "text/plain",
  },
});
```

**Chat History Format**:

```typescript
interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

// Example chat history
const chatHistory: ChatMessage[] = [
  {
    role: "user",
    parts: [{ text: "Hello" }],
  },
  {
    role: "model",
    parts: [{ text: "Hi there!" }],
  },
];
```

### 1.3 Google Search Grounding (Web Search Integration)

**Enable Grounding**:

```typescript
const useGrounding = true; // Enable web search

const modelConfig = {
  systemInstruction: "Your system prompt",
  thinkingConfig: { thinkingBudget: -1 },
  responseMimeType: "text/plain",
  tools: useGrounding
    ? [
        {
          googleSearch: {
            usePersonalData: false,
          },
        },
      ]
    : undefined,
};

const chat = ai.chats.create({
  model: "gemini-2.5-flash",
  history: chatHistory,
  config: modelConfig,
});
```

**Grounding with Custom Search Queries**:

```typescript
const groundingConfig = {
  googleSearchEndpoint: {
    enable: true,
    searchQueries: [
      "company business model industry",
      "competitors market analysis",
      "recent news funding partnerships",
    ],
  },
};
```

### 1.4 Sending Messages

**Basic Message Sending**:

```typescript
const response = await chat.sendMessage({
  message: "Your prompt here",
});

const result = response.text ?? "";
```

### 1.5 Error Handling and Retry Logic

**Retry Pattern with Exponential Backoff**:

```typescript
export async function runGemini(
  prompt: string,
  chatHistory: ChatMessage[] = [],
  options: GeminiOptions = {},
  retryCount = 0
): Promise<string> {
  try {
    const response = await chat.sendMessage({ message: prompt });
    return response.text ?? "";
  } catch (error) {
    if (
      error.message &&
      (error.message.includes("fetch failed") ||
        error.message.includes("timeout"))
    ) {
      if (retryCount < 2) {
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retryCount) * 1000)
        );
        return runGemini(prompt, chatHistory, options, retryCount + 1);
      } else {
        // Fallback to simplified configuration
        const simpleChat = ai.chats.create({
          model: "gemini-2.5-flash",
          history: chatHistory,
          config: {
            temperature: 0.1,
            maxOutputTokens: 8000,
          },
        });
        const simpleResponse = await simpleChat.sendMessage({
          message: prompt,
        });
        return simpleResponse.text ?? "";
      }
    }
    throw new Error(`Gemini API failed: ${error.message}`);
  }
}
```

### 1.6 Mode-Specific System Instructions

**Different Modes for Different Use Cases**:

```typescript
interface GeminiOptions {
  mode?:
    | "sales"
    | "research"
    | "context_aware"
    | "lead_generation"
    | "icp"
    | "company_summary"
    | "icp_generation"
    | "lightning_lead_generation"
    | "grounded_search";
  userProfile?: UserProfile;
  useGrounding?: boolean;
  enableWebSearch?: boolean;
  // ... other options
}

// Example: Research mode
if (options.mode === "research") {
  systemInstruction = `
You are PSAGPT, an advanced AI research assistant that PERFORMS ACTUAL RESEARCH.

🎯 YOUR PRIMARY FUNCTION:
1. Research the company's business model, products, and services
2. Identify their target customer profile and market segments
3. Find actual companies that match their ideal customer profile
4. Provide specific company names, websites, contact information

⚠️ CRITICAL: You are NOT a consultant giving advice. You are a RESEARCH EXECUTOR.
  `;
}
```

### 1.7 Lead Classification Pattern

**For Lead Classification (Hot/Warm/Cold)**:

```typescript
// Classification prompt structure
const classificationPrompt = `
Classify the following email reply as one of: hot, warm, cold, info_request, spam

Email Content:
${emailContent}

Conversation History:
${conversationHistory}

Return JSON format:
{
  "intent": "hot" | "warm" | "cold" | "info_request" | "spam",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation",
  "next_action": "suggested action"
}
`;

const response = await runGemini(classificationPrompt, [], {
  mode: "research",
  useGrounding: false,
});

// Parse JSON response
const classification = JSON.parse(response);
```

---

## 2. LangChain Implementation

### 2.1 Core Packages

**Required Packages**:

```json
{
  "@langchain/core": "^0.3.66",
  "@langchain/community": "^0.3.49",
  "@langchain/openai": "^0.6.3",
  "@langchain/google-genai": "^0.2.16",
  "@langchain/tavily": "^0.1.4",
  "@langchain/textsplitters": "^0.1.0",
  "langchain": "^0.3.30"
}
```

### 2.2 LLM Router Pattern

**Multi-LLM Router for Automatic Model Selection**:

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

export class LLMRouter {
  private openaiModels: Record<string, ChatOpenAI> = {};
  private geminiModels: Record<string, ChatGoogleGenerativeAI> = {};

  constructor() {
    this.initializeModels();
  }

  private initializeModels() {
    // OpenAI Models
    this.openaiModels = {
      research: new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.3,
        maxTokens: 16000,
        streaming: true,
      }),
      "deep-research": new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.2,
        maxTokens: 16000,
        streaming: true,
      }),
      "company-analysis": new ChatOpenAI({
        modelName: "gpt-4o-mini",
        temperature: 0.4,
        maxTokens: 12000,
        streaming: true,
      }),
      "lead-generation": new ChatOpenAI({
        modelName: "gpt-4o",
        temperature: 0.3,
        maxTokens: 16000,
        streaming: true,
      }),
    };

    // Gemini Models
    this.geminiModels = {
      "simple-chat": new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.7,
        maxOutputTokens: 8000,
        maxRetries: 3,
        streaming: false,
      }),
      "fast-response": new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash",
        temperature: 0.8,
        maxOutputTokens: 4000,
        maxRetries: 3,
        streaming: false,
      }),
    };
  }

  public routeLLM(
    taskType: TaskType,
    queryComplexity?: "low" | "medium" | "high",
    options?: {
      forceGPT?: boolean;
      requiresWebSearch?: boolean;
      privacyLevel?: "private" | "public";
      userIntent?: "analysis" | "chat" | "deep-info" | "summary" | "lead-gen";
    }
  ): BaseChatModel {
    // Force GPT if requested
    if (options?.forceGPT) {
      return this.openaiModels["research"];
    }

    // Use GPT for research, analysis, or high complexity
    if (
      ["research", "company-analysis", "lead-generation"].includes(taskType) ||
      queryComplexity === "high"
    ) {
      return this.openaiModels["research"];
    }

    // Use Gemini for simple chat or low complexity
    if (taskType === "simple-chat" || queryComplexity === "low") {
      return this.geminiModels["fast-response"];
    }

    // Default to GPT
    return this.openaiModels["research"];
  }
}
```

### 2.3 Orchestrator Pattern

**Smart Orchestration for Conversation Routing**:

```typescript
import {
  BaseMessage,
  HumanMessage,
  AIMessage,
  SystemMessage,
} from "@langchain/core/messages";

export class LangchainOrchestrator {
  public async processConversation(
    chatId: string,
    message: string,
    config: OrchestrationConfig
  ): Promise<OrchestrationResult> {
    const { userProfile, chatHistory = [] } = config;

    // Convert chat history to Langchain format
    const contextMessages: BaseMessage[] = chatHistory
      .map((msg) => {
        const messageText =
          "content" in msg ? msg.content : msg.parts?.[0]?.text || "";
        if (!messageText || messageText.trim() === "") return null;

        return msg.role === "user"
          ? new HumanMessage(messageText)
          : new AIMessage(messageText);
      })
      .filter((msg) => msg !== null) as BaseMessage[];

    // Route based on query analysis
    const routeAnalysis = await smartRouter.analyzeAndRoute(
      message,
      recentContext
    );

    switch (routeAnalysis.route) {
      case "research":
        return await this.handleResearchTask(chatId, message, userProfile);
      case "rag":
        return await this.handleRAGQuery(chatId, message, userProfile);
      case "general":
      default:
        return await this.handleGeneralChat(
          chatId,
          message,
          userProfile,
          contextMessages
        );
    }
  }

  private async handleGeneralChat(
    chatId: string,
    message: string,
    userProfile?: UserProfile,
    contextMessages: BaseMessage[] = []
  ): Promise<string> {
    const llm = llmRouter.routeLLM("simple-chat", "low", {
      forceGPT: false,
      requiresWebSearch: false,
      userIntent: "chat",
    });

    const systemPrompt = `You are SalesCentriAI, a professional sales consultant...`;

    const messages: BaseMessage[] = [
      new SystemMessage(systemPrompt),
      ...contextMessages.slice(-5), // Last 5 messages for context
      new HumanMessage(message),
    ];

    const response = await llm.invoke(messages);
    return response.content as string;
  }
}
```

### 2.4 Research Agent Pattern

**Research Agent with Web Search and RAG**:

```typescript
import { HumanMessage } from "@langchain/core/messages";

export class ResearchAgent {
  public async researchWithRAG(
    query: string,
    config: ResearchConfig = {}
  ): Promise<ResearchResult> {
    const {
      maxSearchResults = 5,
      enableWeb = true,
      enableRAG = true,
      taskType = "research",
    } = config;

    let searchResults: SearchResult[] = [];
    let ragContext = "";

    // Web search if enabled
    if (enableWeb) {
      searchResults = await this.searchInternet(query, maxSearchResults);
    }

    // RAG search if enabled
    if (enableRAG) {
      const ragResults = await ragSystem.search(query);
      ragContext = ragResults.map((r) => r.content).join("\n\n");
    }

    // Combine contexts
    const webContext = searchResults
      .map((r) => `Source: ${r.url}\nContent: ${r.content}`)
      .join("\n\n");

    const fullContext = [webContext, ragContext]
      .filter(Boolean)
      .join("\n\n---\n\n");

    // Build prompt with context
    const prompt = `Research Query: ${query}

Available Context:
${fullContext}

Please provide a comprehensive answer based on the available context.`;

    // Get appropriate LLM
    const llm = llmRouter.routeLLM(taskType);
    const response = await llm.invoke([new HumanMessage(prompt)]);

    return {
      answer: response.content as string,
      sources: searchResults.map((r) => r.url),
      detailedSources: searchResults.map((r) => ({
        title: r.title || "Unknown Source",
        url: r.url || "",
        domain: new URL(r.url).hostname.replace("www.", ""),
        content: (r.content || "").substring(0, 200) + "...",
        snippet: r.snippet || r.content || "",
      })),
      searchQueries: [query],
      timestamp: new Date().toISOString(),
      taskType,
    };
  }
}
```

### 2.5 Web Search Integration (Tavily)

**Tavily Search Service**:

```typescript
import { TavilySearchResults } from "@langchain/tavily";

export class WebSearchService {
  private tavily: TavilySearchResults;

  constructor() {
    this.tavily = new TavilySearchResults({
      apiKey: process.env.TAVILY_API_KEY,
      maxResults: 5,
    });
  }

  public async search(
    query: string,
    maxResults: number = 5
  ): Promise<SearchResult[]> {
    const results = await this.tavily.invoke(query);

    return results.map((result: any) => ({
      content: result.content || "",
      url: result.url || "",
      title: result.title || "Unknown Source",
      snippet: result.snippet || result.content || "",
    }));
  }
}
```

---

## 3. Embeddings Implementation

### 3.1 Google Generative AI Embeddings

**Setup**:

```typescript
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "embedding-001",
});
```

### 3.2 Generating Embeddings

**Basic Embedding Generation**:

```typescript
// Single text embedding
const embedding = await embeddings.embedQuery("Your text here");

// Multiple texts (batch)
const texts = ["Text 1", "Text 2", "Text 3"];
const embeddingsArray = await embeddings.embedDocuments(texts);
```

### 3.3 Storing Embeddings in MySQL

**MySQL Storage Pattern**:

```typescript
// Table structure
CREATE TABLE embeddings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_id INT,
  lead_id INT,
  embedding JSON,  -- Store as JSON array
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_lead_id (lead_id),
  INDEX idx_message_id (message_id)
);

// Store embedding
async function storeEmbedding(
  messageId: number,
  leadId: number,
  text: string,
  metadata: Record<string, unknown>
) {
  const embedding = await embeddings.embedQuery(text);

  await db.query(
    `INSERT INTO embeddings (message_id, lead_id, embedding, metadata)
     VALUES (?, ?, ?, ?)`,
    [messageId, leadId, JSON.stringify(embedding), JSON.stringify(metadata)]
  );
}
```

### 3.4 Cosine Similarity Search in MySQL

**Semantic Search with MySQL**:

```typescript
// Cosine similarity function (MySQL stored function)
// Note: This is a simplified version - you may need to implement in application layer

async function findSimilarMessages(
  queryText: string,
  leadId: number,
  topK: number = 5
): Promise<Array<{ message_id: number; similarity: number }>> {
  const queryEmbedding = await embeddings.embedQuery(queryText);

  // Get all embeddings for this lead
  const results = await db.query(
    `SELECT id, message_id, embedding 
     FROM embeddings 
     WHERE lead_id = ?`,
    [leadId]
  );

  // Calculate cosine similarity in application layer
  const similarities = results.map((row: any) => {
    const storedEmbedding = JSON.parse(row.embedding);
    const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);
    return {
      message_id: row.message_id,
      similarity,
    };
  });

  // Sort by similarity and return top K
  return similarities
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
```

---

## 4. RAG (Retrieval Augmented Generation) Implementation

### 4.1 RAG System Architecture

**Core Components**:

```typescript
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export class RAGSystem {
  private embeddings: GoogleGenerativeAIEmbeddings;
  private vectorStore: MemoryVectorStore | null = null;
  private splitter: RecursiveCharacterTextSplitter;
  private config: Required<RAGConfig>;

  constructor(config: RAGConfig = {}) {
    this.config = {
      chunkSize: config.chunkSize || 1000,
      chunkOverlap: config.chunkOverlap || 200,
      topK: config.topK || 5,
      collectionName: config.collectionName || "salesai_memory",
    };

    this.embeddings = new GoogleGenerativeAIEmbeddings({
      model: "embedding-001",
    });

    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.config.chunkSize,
      chunkOverlap: this.config.chunkOverlap,
      separators: ["\n\n", "\n", ". ", " ", ""],
    });
  }
}
```

### 4.2 Document Indexing

**Index Text Content**:

```typescript
public async indexMemoryFile(): Promise<void> {
  // Load knowledge base file
  const content = await fs.readFile('data/company-knowledge.txt', 'utf-8');

  // Split into chunks
  const docs = await this.splitter.splitText(content);
  const documents = docs.map((text, index) => new Document({
    pageContent: text,
    metadata: {
      source: 'company_knowledge',
      chunk_id: index,
      indexed_at: new Date().toISOString()
    }
  }));

  // Initialize vector store if needed
  if (!this.vectorStore) {
    this.vectorStore = new MemoryVectorStore(this.embeddings);
  }

  // Add documents to vector store
  await this.vectorStore.addDocuments(documents);
}
```

**Index Web Content**:

```typescript
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

public async indexWebContent(urls: string[]): Promise<void> {
  for (const url of urls) {
    const loader = new CheerioWebBaseLoader(url, {
      selector: "p, h1, h2, h3, h4, h5, h6, li, td, th, div.content, article, main"
    });

    const docs = await loader.load();
    const splits = await this.splitter.splitDocuments(docs);

    const documentsWithMetadata = splits.map((doc, index) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source: url,
        chunk_id: index,
        indexed_at: new Date().toISOString()
      }
    }));

    await this.vectorStore.addDocuments(documentsWithMetadata);
  }
}
```

### 4.3 Semantic Search

**Search with Similarity Scoring**:

```typescript
public async search(query: string): Promise<SearchResult[]> {
  if (!this.vectorStore) {
    await this.initializeVectorStore();
  }

  // Similarity search with scores
  const results = await this.vectorStore.similaritySearchWithScore(
    query,
    this.config.topK
  );

  return results.map(([doc, score]) => ({
    content: doc.pageContent,
    metadata: doc.metadata,
    score
  }));
}
```

### 4.4 RAG Query Processing

**RAG-Enhanced Query with LLM**:

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";

public async processRAGQuery(query: string): Promise<string> {
  // Get relevant context
  const relevantDocs = await this.search(query);

  if (relevantDocs.length === 0) {
    // Fallback to direct LLM response
    const llm = llmRouter.routeLLM('research');
    const response = await llm.invoke([{ role: 'user', content: query }]);
    return response.content as string;
  }

  // Build context from retrieved documents
  const context = relevantDocs
    .map(doc => doc.content)
    .join('\n\n');

  // Create RAG prompt
  const ragPrompt = ChatPromptTemplate.fromMessages([
    ["system", `You are an AI assistant with access to relevant context information.
     Use the provided context to answer questions accurately.
     If the context doesn't contain enough information, say so and provide what you can.

Context:
{context}`],
    ["human", "{question}"]
  ]);

  // Get appropriate LLM
  const llm = llmRouter.routeLLM('research');

  const chain = ragPrompt.pipe(llm);
  const response = await chain.invoke({
    context,
    question: query
  });

  return response.content as string;
}
```

### 4.5 Contextual Compression Retriever

**Advanced Retrieval with Compression**:

```typescript
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";

public async createCompressedRetriever() {
  if (!this.vectorStore) {
    throw new Error('Vector store not available');
  }

  const baseRetriever = this.vectorStore.asRetriever({
    k: this.config.topK * 2 // Get more docs initially
  });

  const llm = llmRouter.routeLLM('fast-response');
  const compressor = LLMChainExtractor.fromLLM(llm);

  return new ContextualCompressionRetriever({
    baseCompressor: compressor,
    baseRetriever
  });
}
```

---

## 5. OpenAI Implementation

### 5.1 Basic Setup

**Environment Variable**: `OPENAI_API_KEY`

**Direct API Call**:

```typescript
export async function callGPT4o(
  prompt: string,
  systemPrompt: string = "You are a strategic business analysis assistant."
): Promise<string> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: prompt,
    },
  ];

  const payload: OpenAIRequest = {
    model: "gpt-4o",
    messages,
    temperature: 0.3,
    max_tokens: 4000,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
```

### 5.2 LangChain OpenAI Integration

**Using LangChain ChatOpenAI**:

```typescript
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.3,
  maxTokens: 16000,
  streaming: true,
});

// Invoke with messages
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const response = await llm.invoke([
  new SystemMessage("You are a helpful assistant."),
  new HumanMessage("What is the capital of France?"),
]);

const answer = response.content as string;
```

### 5.3 Enhanced GPT-4o with Web Search

**GPT-4o with Tavily Search Integration**:

```typescript
export async function callEnhancedGPT4o(
  prompt: string,
  systemPrompt: string = "You are an advanced business intelligence specialist.",
  searchDepth: number = 10
): Promise<string> {
  // Generate search queries
  const searchQueries = [
    `${prompt.substring(0, 50)} companies prospects`,
    `industry leaders manufacturers`,
    `target clients customers`,
  ];

  // Perform web searches
  const webSearchService = new WebSearchService();
  let allSearchResults: SearchResult[] = [];

  for (const query of searchQueries) {
    const results = await webSearchService.search(
      query,
      Math.ceil(searchDepth / searchQueries.length)
    );
    allSearchResults = [...allSearchResults, ...results];
  }

  // Format search results for prompt
  const formattedResults = allSearchResults
    .map(
      (result, index) =>
        `[SOURCE ${index + 1}] ${result.title}\nURL: ${result.url}\n${result.content}`
    )
    .join("\n\n");

  // Create enhanced system prompt
  const enhancedSystemPrompt = `${systemPrompt}

You have access to recent web search results:
${formattedResults}

Use this information to provide accurate and up-to-date analysis.`;

  // Call GPT-4o with enhanced context
  return await callGPT4o(prompt, enhancedSystemPrompt);
}
```

---

## 6. Integration Patterns

### 6.1 Lead Classification Workflow

**Complete Lead Classification Implementation**:

```typescript
async function classifyLeadReply(
  emailContent: string,
  conversationHistory: ChatMessage[],
  companyContext?: string
): Promise<LeadClassification> {
  // Build classification prompt
  const classificationPrompt = `
Classify the following email reply as one of: hot, warm, cold, info_request, spam

Email Content:
${emailContent}

Conversation History:
${conversationHistory.map((m) => `${m.role}: ${m.parts[0].text}`).join("\n")}

${companyContext ? `Company Context:\n${companyContext}` : ""}

Return JSON format:
{
  "intent": "hot" | "warm" | "cold" | "info_request" | "spam",
  "confidence": 0.0-1.0,
  "reasoning": "brief explanation",
  "next_action": "suggested action",
  "lead_score": 0-100
}
`;

  // Use Gemini for classification (fast and cost-effective)
  const response = await runGemini(classificationPrompt, [], {
    mode: "research",
    useGrounding: false,
  });

  // Parse and return
  const classification = JSON.parse(response);
  return classification;
}
```

### 6.2 Lead Nurturing Response Generation

**Generate Contextual Follow-up**:

```typescript
async function generateNurturingResponse(
  leadId: number,
  conversationHistory: ChatMessage[],
  companyContext: string,
  intent: "hot" | "warm" | "cold"
): Promise<string> {
  // Retrieve similar past conversations for context
  const similarMessages = await findSimilarMessages(
    conversationHistory[conversationHistory.length - 1].parts[0].text,
    leadId,
    3
  );

  // Build context from similar messages
  const contextMessages = await Promise.all(
    similarMessages.map(async (sim) => {
      const msg = await getMessageById(sim.message_id);
      return msg;
    })
  );

  // Build nurturing prompt
  const nurturingPrompt = `
Generate a personalized follow-up email for a ${intent} lead.

Company Context:
${companyContext}

Conversation History:
${conversationHistory.map((m) => `${m.role}: ${m.parts[0].text}`).join("\n")}

Similar Past Conversations:
${contextMessages.map((m) => m.content).join("\n\n")}

Requirements:
- Keep it concise (2-3 paragraphs max)
- Match company voice and tone
- Address specific pain points mentioned
- Include a clear call-to-action
- Be helpful, not pushy
`;

  // Use GPT-4o for high-quality generation
  const llm = llmRouter.routeLLM("lead-generation");
  const response = await llm.invoke([
    new SystemMessage("You are an expert sales email writer."),
    new HumanMessage(nurturingPrompt),
  ]);

  return response.content as string;
}
```

### 6.3 Company Context Scraping

**Web Scraping for Company Voice**:

```typescript
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

async function scrapeCompanyContext(
  websiteUrl: string
): Promise<CompanyContext> {
  // Load website content
  const loader = new CheerioWebBaseLoader(websiteUrl, {
    selector: "p, h1, h2, h3, h4, h5, h6, article, main, .content",
  });

  const docs = await loader.load();
  const fullContent = docs.map((d) => d.pageContent).join("\n\n");

  // Use LLM to extract key information
  const extractionPrompt = `
Extract the following from the company website content:

1. Business Model
2. Products/Services
3. Value Propositions
4. Target Customers
5. Company Voice/Tone
6. Key Messaging

Website Content:
${fullContent.substring(0, 8000)}  // Limit to avoid token limits

Return JSON format with all fields.
`;

  const llm = llmRouter.routeLLM("company-analysis");
  const response = await llm.invoke([new HumanMessage(extractionPrompt)]);

  const companyContext = JSON.parse(response.content as string);

  // Store in database
  await storeCompanyContext(websiteUrl, companyContext);

  return companyContext;
}
```

### 6.4 Complete Email Ingestion Flow

**End-to-End Email Processing**:

```typescript
async function processIncomingEmail(emailData: {
  from: string;
  to: string;
  subject: string;
  body: string;
  threadId: string;
  timestamp: string;
}): Promise<void> {
  // 1. Store message
  const messageId = await storeMessage({
    lead_id: await getOrCreateLead(emailData.from),
    direction: "in",
    content: emailData.body,
    subject: emailData.subject,
    timestamp: emailData.timestamp,
  });

  // 2. Generate embedding
  const embedding = await embeddings.embedQuery(emailData.body);
  await storeEmbedding(messageId, leadId, emailData.body, {
    subject: emailData.subject,
    thread_id: emailData.threadId,
  });

  // 3. Classify intent
  const conversationHistory = await getConversationHistory(emailData.threadId);
  const companyContext = await getCompanyContext();

  const classification = await classifyLeadReply(
    emailData.body,
    conversationHistory,
    companyContext
  );

  // 4. Update lead status and score
  await updateLead(leadId, {
    status: classification.intent,
    lead_score: classification.lead_score,
    last_activity: emailData.timestamp,
  });

  // 5. Generate and send response if hot/warm
  if (["hot", "warm"].includes(classification.intent)) {
    const response = await generateNurturingResponse(
      leadId,
      conversationHistory,
      companyContext,
      classification.intent
    );

    // Send via mailer
    await sendEmail({
      to: emailData.from,
      subject: `Re: ${emailData.subject}`,
      body: response,
      threadId: emailData.threadId,
    });

    // Store outgoing message
    await storeMessage({
      lead_id: leadId,
      direction: "out",
      content: response,
      subject: `Re: ${emailData.subject}`,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## Key Takeaways

1. **Gemini**: Use for fast, cost-effective classification and simple chat. Enable grounding for web search integration.

2. **LangChain**: Provides orchestration, routing, and chain composition. Use for complex workflows requiring multiple steps.

3. **Embeddings**: Store in MySQL as JSON arrays. Implement cosine similarity in application layer for semantic search.

4. **RAG**: Use MemoryVectorStore for development, with fallback to text search. Index company knowledge and web content for context retrieval.

5. **OpenAI**: Use GPT-4o for high-quality generation and analysis. Integrate with web search for real-time information.

6. **Integration**: Combine all components for end-to-end workflows: ingestion → classification → embedding → retrieval → generation → sending.

---

## Environment Variables Required

```env
GOOGLE_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key  # For web search
```

---

## Database Schema Recommendations

```sql
-- Leads table
CREATE TABLE leads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255),
  name VARCHAR(255),
  status ENUM('hot', 'warm', 'cold', 'info_request', 'spam'),
  lead_score INT DEFAULT 0,
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  lead_id INT,
  direction ENUM('in', 'out'),
  content TEXT,
  subject VARCHAR(500),
  thread_id VARCHAR(255),
  timestamp TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- Embeddings table
CREATE TABLE embeddings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message_id INT,
  lead_id INT,
  embedding JSON,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id),
  FOREIGN KEY (lead_id) REFERENCES leads(id)
);

-- Agents table (company context)
CREATE TABLE agents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(255),
  website VARCHAR(255),
  auto_summary TEXT,
  tone TEXT,
  examples JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

This documentation provides the foundation for implementing a complete AI-powered lead nurturing system using the patterns and syntax from the current SalesCentri codebase.
