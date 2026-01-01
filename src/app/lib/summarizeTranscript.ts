import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * Summarize a call transcript using LangChain and OpenAI
 * Returns a structured summary suitable for lead classification
 */
export async function summarizeTranscript(
  transcript: string,
  email: string,
  phone: string,
  subject: string | null
): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.3,
    openAIApiKey: openaiApiKey,
  });

  const summarizerPrompt = ChatPromptTemplate.fromTemplate(
    [
      "You are a sales intelligence summarizer. Create a classifier-ready brief.",
      "Extract key details from the conversation transcript, focusing on sales-relevant information.",
      "Output should be in two parts: a narrative summary and a structured JSON object with specific fields.",
      "Narrative Summary: A brief, flowing paragraph summarizing the core interaction, user's needs, and any outcomes.",
      "Structured Fields: A JSON object containing the following keys, extracting values from the conversation:",
      "{{",
      "  \"intent\": \"<why they reached out>\",",
      "  \"need\": \"<what solution/outcome they want>\",",
      "  \"timeline\": \"<when they want to act>\",",
      "  \"budget\": \"<budget or price sensitivity>\",",
      "  \"authority\": \"<decision power/role>\",",
      "  \"next_step\": \"<promised or requested follow-up>\",",
      "  \"blockers\": \"<risks or objections>\"",
      "}}",
      "If a field is not explicitly mentioned or inferable, use \"unknown\".",
      "---",
      "Email: {email}",
      "Phone: {phone}",
      "Subject: {subject}",
      "Transcript: {transcript}",
    ].join("\n")
  );

  try {
    const chain = summarizerPrompt.pipe(model);
    const response = await chain.invoke({
      email,
      phone,
      subject: subject || "Not specified",
      transcript,
    });

    const summaryText = response.content as string;
    console.log('[Summarize] Generated summary length:', summaryText.length);
    
    return summaryText;
  } catch (error) {
    console.error('[Summarize] Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

