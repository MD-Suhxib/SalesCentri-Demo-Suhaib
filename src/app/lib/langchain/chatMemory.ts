// Chat History and Memory Management with Langchain
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { MemorySaver } from "@langchain/langgraph";
import { trimMessages } from "@langchain/core/messages";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { llmRouter } from "./llmRouter";
import fs from 'fs/promises';
import path from 'path';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  chat_id: string;
}

export interface ChatSummary {
  chat_id: string;
  title: string;
  summary: string;
  key_topics: string[];
  user_intent: string;
  created_at: string;
  last_updated: string;
  message_count: number;
}

export class ChatMemoryManager {
  private memorySaver: MemorySaver;
  private summariesPath: string;
  private memoryFilePath: string;
  
  constructor() {
    this.memorySaver = new MemorySaver();
    this.summariesPath = path.join(process.cwd(), 'data', 'chat-summaries.json');
    this.memoryFilePath = path.join(process.cwd(), 'data', 'chat-memory.txt');
    this.ensureDataDirectory();
  }

  private async ensureDataDirectory() {
    try {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    } catch {
      // Directory might already exist
    }
  }

  /**
   * Convert API messages to Langchain format
   */
  public convertToLangchainMessages(messages: ChatMessage[]): BaseMessage[] {
    return messages.map(msg => {
      switch (msg.role) {
        case 'user':
          return new HumanMessage(msg.content);
        case 'assistant':
          return new AIMessage(msg.content);
        case 'system':
          return new SystemMessage(msg.content);
        default:
          return new HumanMessage(msg.content);
      }
    });
  }

  /**
   * Trim messages to fit context window
   */
  public async trimChatHistory(
    messages: BaseMessage[], 
    maxTokens: number = 6000
  ): Promise<BaseMessage[]> {
    const trimmer = trimMessages({
      strategy: "last",
      maxTokens,
      tokenCounter: (msgs) => msgs.reduce((count, msg) => count + msg.content.length / 4, 0)
    });
    
    return await trimmer.invoke(messages);
  }

  /**
   * Create a chat summary using LLM
   */
  public async generateChatSummary(
    chatId: string, 
    messages: ChatMessage[], 
    title?: string
  ): Promise<ChatSummary> {
    const llm = llmRouter.routeLLM('summarization');
    
    const summaryPrompt = `Analyze this conversation and provide a JSON summary with the following structure:
{
  "summary": "Brief 2-3 sentence summary of the conversation",
  "key_topics": ["topic1", "topic2", "topic3"],
  "user_intent": "What the user was trying to accomplish"
}

Conversation:
${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n')}

Respond only with valid JSON:`;

    try {
      const response = await llm.invoke([new HumanMessage(summaryPrompt)]);
      const summaryData = JSON.parse(response.content as string);
      
      const chatSummary: ChatSummary = {
        chat_id: chatId,
        title: title || `Chat ${new Date().toLocaleDateString()}`,
        summary: summaryData.summary,
        key_topics: summaryData.key_topics || [],
        user_intent: summaryData.user_intent || 'General conversation',
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        message_count: messages.length
      };

      await this.saveChatSummary(chatSummary);
      return chatSummary;
    } catch (error) {
      console.error('Error generating chat summary:', error);
      
      // Fallback summary
      const fallbackSummary: ChatSummary = {
        chat_id: chatId,
        title: title || `Chat ${new Date().toLocaleDateString()}`,
        summary: `Conversation with ${messages.length} messages`,
        key_topics: ['general'],
        user_intent: 'Chat conversation',
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        message_count: messages.length
      };
      
      await this.saveChatSummary(fallbackSummary);
      return fallbackSummary;
    }
  }

  /**
   * Save chat summary to JSON file
   */
  private async saveChatSummary(summary: ChatSummary): Promise<void> {
    try {
      let summaries: ChatSummary[] = [];
      
      try {
        const existingData = await fs.readFile(this.summariesPath, 'utf-8');
        summaries = JSON.parse(existingData);
      } catch {
        // File doesn't exist or is empty
      }
      
      // Update existing summary or add new one
      const existingIndex = summaries.findIndex(s => s.chat_id === summary.chat_id);
      if (existingIndex >= 0) {
        summaries[existingIndex] = { ...summaries[existingIndex], ...summary, last_updated: new Date().toISOString() };
      } else {
        summaries.push(summary);
      }
      
      await fs.writeFile(this.summariesPath, JSON.stringify(summaries, null, 2));
    } catch (error) {
      console.error('Error saving chat summary:', error);
    }
  }

  /**
   * Get chat summary by ID
   */
  public async getChatSummary(chatId: string): Promise<ChatSummary | null> {
    try {
      const data = await fs.readFile(this.summariesPath, 'utf-8');
      const summaries: ChatSummary[] = JSON.parse(data);
      return summaries.find(s => s.chat_id === chatId) || null;
    } catch {
      return null;
    }
  }

  /**
   * Get all chat summaries
   */
  public async getAllChatSummaries(): Promise<ChatSummary[]> {
    try {
      const data = await fs.readFile(this.summariesPath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  /**
   * Update memory file for RAG (append chat context)
   */
  public async updateMemoryFile(chatId: string, content: string): Promise<void> {
    // Intentionally disabled: do not persist chat memory to filesystem.
    // Serverless production environments have read-only filesystems. Keeping
    // this as a no-op prevents EROFS errors while preserving the call site API.
    return;
  }

  /**
   * Get memory file path for RAG indexing
   */
  public getMemoryFilePath(): string {
    return this.memoryFilePath;
  }

  /**
   * Create context-aware prompt with history
   */
  public createContextualPrompt(
    systemMessage: string,
    includeHistory: boolean = true
  ): ChatPromptTemplate {
    const messageComponents: ([string, string] | MessagesPlaceholder)[] = [
      ["system", systemMessage]
    ];

    if (includeHistory) {
      messageComponents.push(new MessagesPlaceholder("chat_history"));
    }

    messageComponents.push(["human", "{input}"]);

    return ChatPromptTemplate.fromMessages(messageComponents);
  }

  /**
   * Process chat with memory persistence
   */
  public async processWithMemory(
    chatId: string,
    messages: BaseMessage[],
    llm: BaseChatModel,
    systemPrompt?: string
  ): Promise<string> {
    // Trim messages if too long
    const trimmedMessages = await this.trimChatHistory(messages);
    
    if (systemPrompt) {
      trimmedMessages.unshift(new SystemMessage(systemPrompt));
    }
    
    const response = await llm.invoke(trimmedMessages);
    return response.content as string;
  }
}

// Export singleton instance
export const chatMemoryManager = new ChatMemoryManager();
