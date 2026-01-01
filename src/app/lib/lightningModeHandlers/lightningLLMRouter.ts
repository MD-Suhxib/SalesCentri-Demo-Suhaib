import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from '@langchain/openai';

export type LightningLLMModel = 'gemini' | 'gpt4o';

export class LightningLLMRouter {
  private geminiModel: ChatGoogleGenerativeAI;
  private gpt4oModel: ChatOpenAI;

  constructor() {
    this.geminiModel = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      temperature: 0.1,
      maxOutputTokens: 8192,
    });

    this.gpt4oModel = new ChatOpenAI({
      model: 'gpt-4o',
      temperature: 0.1,
      maxTokens: 8192,
    });
  }

  /**
   * Route to appropriate LLM based on task type
   */
  public routeLLM(taskType: string): ChatGoogleGenerativeAI | ChatOpenAI {
    switch (taskType) {
      case 'lightning-lead-generation':
        // Use Gemini for lead generation in Lightning Mode
        return this.geminiModel;
      
      case 'lightning-research':
        // Use Gemini for research in Lightning Mode
        return this.geminiModel;
      
      case 'lightning-company-analysis':
        // Use Gemini for company analysis in Lightning Mode
        return this.geminiModel;
      
      default:
        // Default to Gemini for Lightning Mode
        return this.geminiModel;
    }
  }

  /**
   * Get Gemini model directly
   */
  public getGeminiModel(): ChatGoogleGenerativeAI {
    return this.geminiModel;
  }

  /**
   * Get GPT-4o model directly
   */
  public getGPT4oModel(): ChatOpenAI {
    return this.gpt4oModel;
  }
}

// Export singleton instance
export const lightningLLMRouter = new LightningLLMRouter();
