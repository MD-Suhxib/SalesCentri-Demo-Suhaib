// RAG System with MemoryVectorStore for deep research and memory retrieval
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ContextualCompressionRetriever } from "langchain/retrievers/contextual_compression";
import { LLMChainExtractor } from "langchain/retrievers/document_compressors/chain_extract";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { llmRouter } from "./llmRouter";
import fs from 'fs/promises';
import path from 'path';

export interface RAGConfig {
  chunkSize?: number;
  chunkOverlap?: number;
  topK?: number;
  collectionName?: string;
}

export interface SearchResult {
  content: string;
  metadata?: Record<string, unknown>;
  score?: number;
}

export class RAGSystem {
  private embeddings: GoogleGenerativeAIEmbeddings | null = null;
  private vectorStore: MemoryVectorStore | null = null;
  private splitter: RecursiveCharacterTextSplitter;
  private config: Required<RAGConfig>;
  private vectorStorePath: string;
  private embeddingsAvailable: boolean = true;
  private memoryChunks: Document[] = []; // Fallback storage for simple text search

  constructor(config: RAGConfig = {}) {
    this.config = {
      chunkSize: config.chunkSize || 1000,
      chunkOverlap: config.chunkOverlap || 200,
      topK: config.topK || 5,
      collectionName: config.collectionName || 'salesai_memory'
    };

    try {
      this.embeddings = new GoogleGenerativeAIEmbeddings({
        model: "embedding-001"
      });
    } catch (error) {
      console.warn('Failed to initialize embeddings, RAG will use fallback text search:', error);
      this.embeddingsAvailable = false;
    }

    this.splitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.config.chunkSize,
      chunkOverlap: this.config.chunkOverlap,
      separators: ['\n\n', '\n', '. ', ' ', '']
    });

    // Set up FAISS vector store path
    this.vectorStorePath = path.join(process.cwd(), 'data', 'faiss_index');

    // Don't initialize vector store immediately - only when needed
    console.log('🔧 RAG SYSTEM: Initialized but vector store will be lazy-loaded');
  }

  private async initializeVectorStore(): Promise<void> {
    if (!this.embeddingsAvailable || !this.embeddings) {
      console.warn('Embeddings not available, using fallback text search');
      // Still try to load memory for fallback search
      await this.loadMemoryForFallback();
      return;
    }

    try {
      // Create new MemoryVectorStore (simpler than FAISS, no persistence needed)
      this.vectorStore = new MemoryVectorStore(this.embeddings);
      console.log('Created new MemoryVectorStore');
      
      // Load memory for fallback search immediately
      await this.loadMemoryForFallback();
      
    } catch (error) {
      console.error('Error initializing MemoryVectorStore:', error);
      console.warn('Vector store not available, using fallback text search');
      this.embeddingsAvailable = false;
      this.vectorStore = null;
      // Load memory for fallback search
      await this.loadMemoryForFallback();
    }
  }

  /**
   * Load company knowledge file for fallback text search
   */
  private async loadMemoryForFallback(): Promise<void> {
    // Prefer root-level knowledge.txt; fallback to legacy path in data/
    // Canonical knowledge file + fallbacks
    const candidatePaths = [
      path.join(process.cwd(), 'data', 'company-knowledge.txt'),
      path.join(process.cwd(), 'data', 'knowledge.txt'),
      // Legacy root file (last resort)
      path.join(process.cwd(), 'knowledge.txt')
    ];

    for (const kbPath of candidatePaths) {
      try {
        const raw = await fs.readFile(kbPath, 'utf-8');
        const content = this.preprocessKnowledgeContent(raw);

        if (content && content.trim()) {
          const docs = await this.splitter.splitText(content);
          const documents = docs.map((text, index) => new Document({
            pageContent: text,
            metadata: {
              source: kbPath.endsWith('knowledge.txt') ? 'knowledge_txt' : 'company_knowledge',
              chunk_id: index,
              indexed_at: new Date().toISOString()
            }
          }));

          // Replace memory with the latest loaded KB, but if we already have
          // chunks from a previous path, append uniquely
          this.memoryChunks = documents;
          console.log(`Loaded ${documents.length} chunks from ${kbPath} for fallback text search`);
          // Stop after loading the first available knowledge file to keep a single source of truth
          return;
        }
      } catch (error) {
        // Try next candidate path
        console.warn(`Could not load knowledge file at ${kbPath}:`, error);
      }
    }

    if (this.memoryChunks.length === 0) {
      console.warn('No knowledge files loaded. Fallback text search will have no data.');
    }
  }

  private async checkIfIndexExists(): Promise<boolean> {
    try {
      await fs.access(this.vectorStorePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Index memory file for RAG retrieval
   */
  public async indexMemoryFile(): Promise<void> {
    if (!this.vectorStore) {
      console.warn('Vector store not available');
      // Still ensure fallback memory is loaded
      await this.loadMemoryForFallback();
      return;
    }

    try {
      // Prefer root knowledge.txt, fallback to legacy
      const candidatePaths = [
        path.join(process.cwd(), 'data', 'company-knowledge.txt'),
        path.join(process.cwd(), 'data', 'knowledge.txt'),
        path.join(process.cwd(), 'knowledge.txt')
      ];

      let content = '';
      let loadedFrom = '';
      for (const kbPath of candidatePaths) {
        try {
          const raw = await fs.readFile(kbPath, 'utf-8');
          content = this.preprocessKnowledgeContent(raw);
          loadedFrom = kbPath;
          if (content && content.trim()) break;
        } catch {
          // try next path
        }
      }

      if (!content || !content.trim()) {
        console.log('Knowledge base is empty or missing, nothing to index');
        return;
      }

      // Split content into chunks
      const docs = await this.splitter.splitText(content);
      const documents = docs.map((text, index) => new Document({
        pageContent: text,
        metadata: {
          source: loadedFrom.endsWith('knowledge.txt') ? 'knowledge_txt' : 'company_knowledge',
          chunk_id: index,
          indexed_at: new Date().toISOString()
        }
      }));

      // Add to vector store or fallback storage
      if (this.vectorStore && this.embeddingsAvailable) {
        try {
          await this.vectorStore.addDocuments(documents);
          console.log(`Indexed ${documents.length} chunks from knowledge base to MemoryVectorStore`);
        } catch (vectorError) {
          console.error('Error adding documents to vector store:', vectorError);
          console.warn('Falling back to text storage for knowledge chunks');
          // Fall back to storing in memory
          this.memoryChunks = [...this.memoryChunks, ...documents];
          this.embeddingsAvailable = false;
        }
      } else {
        // Store in fallback memory
        this.memoryChunks = [...this.memoryChunks, ...documents];
        console.log(`Stored ${documents.length} chunks from knowledge base in fallback storage`);
      }
    } catch (error) {
      console.error('Error indexing memory file:', error);
      // Check if it's a quota error
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('InsufficientQuotaError')) {
        console.warn('Embedding quota exceeded, memory indexing skipped for this request');
      }
    }
  }

  /**
   * Index web content for research
   */
  public async indexWebContent(urls: string[]): Promise<void> {
    if (!this.vectorStore) {
      console.warn('Vector store not available');
      return;
    }

    for (const url of urls) {
      try {
        const loader = new CheerioWebBaseLoader(url, {
          selector: "p, h1, h2, h3, h4, h5, h6, li, td, th, div.content, article, main"
        });
        
        const docs = await loader.load();
        const splits = await this.splitter.splitDocuments(docs);

        // Add metadata
        const documentsWithMetadata = splits.map((doc, index) => ({
          ...doc,
          metadata: {
            ...doc.metadata,
            source: url,
            chunk_id: index,
            indexed_at: new Date().toISOString()
          }
        }));

        // Add to vector store or fallback storage
        if (this.vectorStore && this.embeddingsAvailable) {
          await this.vectorStore.addDocuments(documentsWithMetadata);
          console.log(`Indexed ${splits.length} chunks from ${url} to MemoryVectorStore`);
        } else {
          // Store in fallback memory
          this.memoryChunks = [...this.memoryChunks, ...documentsWithMetadata];
          console.log(`Stored ${splits.length} chunks from ${url} in fallback storage`);
        }
      } catch (error) {
        console.error(`Error indexing ${url}:`, error);
      }
    }
  }

  /**
   * Search for relevant context
   */
  public async search(query: string): Promise<SearchResult[]> {
    console.log(`🔍 RAG SEARCH START: Searching for "${query}"`);
    
    // Lazy load vector store if not initialized
    if (!this.vectorStore && this.embeddingsAvailable) {
      console.log('🔧 RAG LAZY LOAD: Initializing vector store on first use');
      await this.initializeVectorStore();
    }
    
    // Try vector search first if available
    if (this.vectorStore && this.embeddingsAvailable) {
      console.log('🧠 VECTOR SEARCH: Using GoogleGenerativeAI embeddings');
      try {
        // Check if vector store has any documents before searching
        const hasDocuments = await this.checkVectorStoreHasDocuments();
        if (!hasDocuments) {
          console.log('⚠️ VECTOR STORE EMPTY: Vector store is empty, attempting to load knowledge base...');
          try {
            await this.indexMemoryFile();
            const hasDocumentsAfterLoad = await this.checkVectorStoreHasDocuments();
            if (!hasDocumentsAfterLoad) {
              console.log('⚠️ KNOWLEDGE BASE EMPTY: No documents found after loading, falling back to text search');
              return await this.fallbackTextSearch(query);
            }
            console.log('✅ KNOWLEDGE BASE LOADED: Vector store now has documents');
          } catch (loadError) {
            console.error('🚨 KNOWLEDGE BASE LOAD ERROR:', loadError);
            console.log('⚠️ FALLBACK: Using text search due to load failure');
            return await this.fallbackTextSearch(query);
          }
        }

        console.log(`📊 VECTOR SEARCH: Searching for top ${this.config.topK} results`);
        const results = await this.vectorStore.similaritySearchWithScore(
          query, 
          this.config.topK
        );

        console.log(`✅ VECTOR SEARCH SUCCESS: Found ${results.length} results`);
        return results.map(([doc, score]) => ({
          content: doc.pageContent,
          metadata: doc.metadata,
          score
        }));
      } catch (error) {
        console.error('🚨 VECTOR SEARCH ERROR: Error searching vector store:', error);
        
        // Check if it's an authentication, quota, or initialization error
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('quota') || errorMessage.includes('429') || 
            errorMessage.includes('InsufficientQuotaError') || errorMessage.includes('401') ||
            errorMessage.includes('UNAUTHENTICATED') || errorMessage.includes('not initialised')) {
          console.warn('⚠️ VECTOR SEARCH DISABLED: Vector store error, falling back to text search');
          this.embeddingsAvailable = false;
        }
      }
    } else {
      console.log('⚠️ VECTOR SEARCH UNAVAILABLE: Vector store not available or embeddings disabled');
    }

    // Fallback to simple text search
    console.log('🔤 FALLBACK: Using text-based search as fallback');
    return await this.fallbackTextSearch(query);
  }

  /**
   * Check if the vector store has any documents
   */
  private async checkVectorStoreHasDocuments(): Promise<boolean> {
    if (!this.vectorStore) return false;
    
    try {
      // Try a simple search to see if there are any documents
      const testResults = await this.vectorStore.similaritySearch('test', 1);
      return testResults.length > 0;
    } catch (error) {
      // If we get the "not initialised" error, it means no documents
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('not initialised')) {
        return false;
      }
      // For other errors, assume it has documents but there's another issue
      throw error;
    }
  }

  /**
   * Fallback text search when embeddings are not available
   */
  private async fallbackTextSearch(query: string): Promise<SearchResult[]> {
    console.log(`🔤 TEXT SEARCH START: Searching ${this.memoryChunks.length} knowledge chunks`);
    
    if (this.memoryChunks.length === 0) {
      console.log('❌ TEXT SEARCH EMPTY: No company knowledge chunks available, attempting to load...');
      try {
        await this.loadMemoryForFallback();
        if (this.memoryChunks.length === 0) {
          console.log('❌ KNOWLEDGE BASE EMPTY: No chunks found after loading');
          return [];
        }
        console.log(`✅ KNOWLEDGE BASE LOADED: ${this.memoryChunks.length} chunks now available for text search`);
      } catch (loadError) {
        console.error('🚨 FALLBACK LOAD ERROR:', loadError);
        return [];
      }
    }

    const queryLower = query.toLowerCase();
    const results: SearchResult[] = [];
    console.log(`🔍 TEXT SEARCH: Analyzing query "${query}" for keyword matches`);

    for (const chunk of this.memoryChunks) {
      const content = chunk.pageContent.toLowerCase();
      
      // Simple keyword matching with more strict relevance requirements
      const words = queryLower.split(/\s+/).filter(word => word.length > 2); // Filter out short words
      let score = 0;
      let matchedWords = 0;
      
      for (const word of words) {
        if (content.includes(word)) {
          score += 1;
          matchedWords += 1;
          
          // Bonus for exact phrase match
          if (content.includes(queryLower)) {
            score += 3;
          }
        }
      }
      
      // Only include results with significant relevance (at least 30% of words matched)
      const relevanceThreshold = Math.max(1, Math.floor(words.length * 0.3));
      if (matchedWords >= relevanceThreshold && score > 0) {
        results.push({
          content: chunk.pageContent,
          metadata: chunk.metadata,
          score: score / Math.max(words.length, 1) // Normalize by query length
        });
      }
    }

    // Sort by score and return top K
    const sortedResults = results
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, this.config.topK);
      
    if (sortedResults.length > 0) {
      console.log(`✅ TEXT SEARCH SUCCESS: Found ${sortedResults.length} relevant results`);
    } else {
      console.log(`❌ TEXT SEARCH NO RESULTS: No relevant results found for query`);
    }
    return sortedResults;
  }

  /**
   * Directly answer from knowledge without using any LLM.
   * Uses simple keyword-based retrieval and sentence extraction.
   */
  public async answerFromKnowledge(query: string): Promise<{ answer: string; sources: Array<{ source?: unknown; chunk_id?: unknown }> } | null> {
    // Ensure memory is loaded
    if (this.memoryChunks.length === 0) {
      await this.loadMemoryForFallback();
    }

    const results = await this.fallbackTextSearch(query);
    if (!results || results.length === 0) {
      return null;
    }

    // Extract relevant sentences from top results
    const topResults = results.slice(0, Math.max(1, Math.min(3, this.config.topK)));
    const sentences: string[] = [];
    const seen = new Set<string>();
    const queryTerms = query.toLowerCase().split(/\W+/).filter(w => w.length > 2);

    for (const res of topResults) {
      const cleaned = this.cleanTextForAnswer(String(res.content));
      const pieces = this.splitIntoSentences(cleaned);
      const scored = pieces
        .map(s => ({ s, score: this.scoreSentence(s, queryTerms) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5) // pick a few best per chunk
        .map(x => x.s.trim());

      for (const s of scored) {
        const key = s.toLowerCase();
        if (!seen.has(key)) {
          sentences.push(s);
          seen.add(key);
        }
      }
    }

    // Fallback: if no scored sentences, take the first 2-3 lines of the best chunk
    if (sentences.length === 0) {
      const best = this.cleanTextForAnswer(String(topResults[0].content)).split(/\n+/).slice(0, 4).join(' ').trim();
      if (!best) return null;
      return {
        answer: best.substring(0, 1200),
        sources: topResults.map(r => ({ source: r.metadata?.source, chunk_id: r.metadata?.chunk_id }))
      };
    }

    const answer = sentences.join(' ').substring(0, 1500);
    return {
      answer,
      sources: topResults.map(r => ({ source: r.metadata?.source, chunk_id: r.metadata?.chunk_id }))
    };
  }

  private splitIntoSentences(text: string): string[] {
    // Split by typical sentence boundaries and newlines
    return text
      .split(/(?<=[\.\!\?])\s+|\n+/)
      .map(s => s.trim())
      .filter(Boolean);
  }

  private cleanTextForAnswer(text: string): string {
    // Remove question prefixes or tag lines from structured KB
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l.length > 0)
      .filter(l => !/^Q\s*:/.test(l))
      .filter(l => !/^Tags\s*:/.test(l))
      .map(l => l.replace(/^A\s*:\s*/i, ''));
    return lines.join(' ');
  }

  private preprocessKnowledgeContent(raw: string): string {
    // If file has many 'A:' lines, keep only answers and optionally tags
    const lines = raw.split(/\r?\n/);
    const answerLines = lines.filter(l => /^\s*A\s*:/i.test(l));
    if (answerLines.length >= 10) {
      const condensed: string[] = [];
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^A\s*:/i.test(line)) {
          condensed.push(line.replace(/^A\s*:\s*/i, ''));
          // Optionally merge immediate Tags line as keywords but without the prefix
          const next = lines[i + 1]?.trim() || '';
          if (/^Tags\s*:/i.test(next)) {
            condensed.push(next.replace(/^Tags\s*:\s*/i, ''));
            i += 1; // skip the tags line already consumed
          }
        }
      }
      return condensed.join('\n\n');
    }

    // Otherwise, strip obvious headings/markdown blocks and keep plain text
    const filtered = lines
      .filter(l => !/^#/.test(l))
      .filter(l => !/^\*\*/.test(l))
      .filter(l => l.trim().length > 0)
      .join('\n');
    return filtered;
  }

  private scoreSentence(sentence: string, queryTerms: string[]): number {
    const lower = sentence.toLowerCase();
    let score = 0;
    for (const term of queryTerms) {
      if (lower.includes(term)) score += 1;
    }
    // Bonus for question markers or obvious FAQ structure
    if (/^q\d+\.|^what\b|^how\b|^who\b|^when\b|^where\b|^which\b|^do\b|^does\b|^can\b|\?$/.test(lower)) {
      score += 1.5;
    }
    // Prefer concise sentences
    const lenPenalty = Math.max(0, (lower.length - 300) / 300);
    score -= lenPenalty;
    return score;
  }

  /**
   * RAG-enhanced query processing
   */
  public async processRAGQuery(
    query: string
  ): Promise<string> {
    // Get relevant context
    const relevantDocs = await this.search(query);
    
    if (relevantDocs.length === 0) {
      console.log('No relevant context found, using direct LLM response');
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
      ["system", `You are an AI assistant with access to relevant context information. Use the provided context to answer questions accurately. If the context doesn't contain enough information, say so and provide what you can based on your general knowledge.

Context:
{context}`],
      ["human", "{question}"]
    ]);

    // Get appropriate LLM for research
    const llm = llmRouter.routeLLM('research');
    
    const chain = ragPrompt.pipe(llm);
    const response = await chain.invoke({
      context,
      question: query
    });

    return response.content as string;
  }

  /**
   * Create contextual compression retriever for more relevant results
   */
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

  /**
   * Delete collection (for cleanup/reset)
   */
  public async resetCollection(): Promise<void> {
    if (!this.embeddingsAvailable || !this.embeddings) {
      console.warn('Embeddings not available, resetting fallback storage');
      this.memoryChunks = [];
      return;
    }

    if (!this.vectorStore) {
      console.warn('Vector store not available');
      return;
    }

    try {
      // Reset by creating a new empty MemoryVectorStore
      this.vectorStore = new MemoryVectorStore(this.embeddings);
      console.log('MemoryVectorStore reset successfully');
    } catch (error) {
      console.error('Error resetting MemoryVectorStore:', error);
    }
  }

  /**
   * Save the current vector store to disk (MemoryVectorStore doesn't persist, so this is a no-op)
   */
  public async saveIndex(): Promise<void> {
    if (!this.vectorStore) {
      console.warn('Vector store not available');
      return;
    }

    // MemoryVectorStore doesn't support persistence, so we just log
    console.log('MemoryVectorStore data is kept in memory only (no disk persistence)');
  }

  /**
   * Get collection stats
   */
  public async getStats(): Promise<{ count: number; collections: string[] }> {
    // For FAISS, we can get basic stats from the vector store
    // This is a simplified implementation
    return {
      count: this.vectorStore ? await this.getDocumentCount() : 0,
      collections: [this.config.collectionName]
    };
  }

  private async getDocumentCount(): Promise<number> {
    // FAISS doesn't have a direct count method, so this is an approximation
    // In a real implementation, you might track this separately
    return 0;
  }
}

// Export singleton instance
export const ragSystem = new RAGSystem();
