import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthenticatedUser } from '../../../lib/authMiddleware';
import { callGemini } from '../../../lib/callGemini';

interface ConversationMessage {
  role: string;
  content: string;
}

const handleSummarize = async (request: NextRequest, user: AuthenticatedUser) => {
  try {
    const { conversation, userPreferences, workflow } = await request.json();
    
    if (!conversation || !Array.isArray(conversation)) {
      return NextResponse.json({ error: 'Conversation history is required' }, { status: 400 });
    }

    // Create comprehensive summary prompt
    const summaryPrompt = `You are a professional AI assistant tasked with creating a comprehensive summary of a SalesGPT conversation.
    
    Conversation History:
    ${conversation.map((msg: ConversationMessage) => `${msg.role}: ${msg.content}`).join('\n')}
    
    ${userPreferences ? `User Preferences: ${JSON.stringify(userPreferences)}` : ''}
    ${workflow ? `Workflow Context: ${JSON.stringify(workflow)}` : ''}
    
    Please provide a detailed summary that includes:
    
    1. **Conversation Overview**: Brief description of the main topic and purpose
    2. **Key Insights**: Main findings, recommendations, or solutions discussed
    3. **Action Items**: Specific next steps or recommendations for the user
    4. **Results Generated**: Any files, lists, or data that were created
    5. **Workflow Path**: Brief description of the path taken (CSV upload vs ResearchGPT)
    6. **Business Value**: How this conversation can help the user's business goals
    
    Format the response in a clear, professional manner that can be easily saved and referenced later.`;

    // Call Gemini for summary generation
    const summary = await callGemini(summaryPrompt, []);
    
    // Create summary object with metadata
    const summaryData = {
      id: `summary_${Date.now()}`,
      userId: user.uid,
      userEmail: user.email,
      summary,
      conversationLength: conversation.length,
      createdAt: new Date().toISOString(),
      workflow: workflow || 'unknown',
      metadata: {
        userPreferences: userPreferences || null,
        conversationTopics: extractTopics(conversation),
        keyMetrics: {
          totalMessages: conversation.length,
          userMessages: conversation.filter((msg: ConversationMessage) => msg.role === 'user').length,
          aiMessages: conversation.filter((msg: ConversationMessage) => msg.role === 'assistant').length
        }
      }
    };
    
    // TODO: Store summary in database
    console.log(`Summary created for ${user.email}:`, summaryData.id);

    return NextResponse.json({
      success: true,
      summary: summaryData,
      message: 'Summary generated successfully'
    });

  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate summary' 
    }, { status: 500 });
  }
};

// Helper function to extract topics from conversation
const extractTopics = (conversation: ConversationMessage[]): string[] => {
  const userMessages = conversation
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content)
    .join(' ');
  
  // Simple keyword extraction (in a real app, you'd use NLP)
  const commonTopics = ['sales', 'marketing', 'leads', 'conversion', 'email', 'prospects', 'revenue', 'growth'];
  return commonTopics.filter(topic => 
    userMessages.toLowerCase().includes(topic)
  );
};

export const POST = requireAuth(handleSummarize);
