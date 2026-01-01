import { NextRequest, NextResponse } from 'next/server';
import { runGemini } from '../gemini/geminiHandler';
import { requireAuth } from '../../lib/authMiddleware';

interface ResearchRequest {
  query: string;
  chatHistory?: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
  companyContext?: string;
  icpStatus?: 'done' | 'pending' | 'unknown';
  researchType?: 'competitor' | 'icp' | 'general';
}

const handleResearchQuery = async (request: NextRequest) => {
  try {
    const { query, chatHistory = [], companyContext, icpStatus, researchType }: ResearchRequest = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Determine the research flow based on query and context
    let researchPrompt = '';
    // const shouldAutoTrigger = false;

    // Check if this is the initial research mode activation
    if (query.toLowerCase().includes('research') && !chatHistory.length) {
      // Initial research mode - start with company and ICP flow
      researchPrompt = `
Welcome to ResearchGPT! I'm your elite AI research specialist focused on comprehensive business intelligence and competitive analysis.

To provide you with the most targeted research, I need to understand your company context first.

**Step 1: Company Information**
What is your company name or website? (e.g., salescentri.com)

Once I have this information, I'll help you with:
- Ideal Customer Profile (ICP) development or validation
- Competitor analysis with client lists
- Lead generation research
- Market intelligence and strategic insights

Please share your company details to get started.
      `;
    } else if (companyContext && icpStatus === 'unknown') {
      // Ask about ICP status
      researchPrompt = `
Thank you for providing your company context: ${companyContext}

**Step 2: ICP Status Check**
Do you have your Ideal Customer Profile (ICP) already defined and documented?

Please respond with:
- **"Yes"** - I have my ICP defined and ready
- **"No"** - I need help creating my ICP first

Based on your answer, I'll either:
- Proceed with competitor research and lead generation (if ICP is done)
- Help you develop a comprehensive ICP first (if ICP is needed)
      `;
    } else if (icpStatus === 'done' && companyContext) {
      // User has ICP, proceed with competitor research
      // shouldAutoTrigger = true;
      researchPrompt = `
Perfect! Since you have your ICP defined, I'll now conduct comprehensive competitor research for ${companyContext}.

**Initiating Automated Research Process...**

Please wait while I analyze:
1. Industry classification and market positioning
2. Direct and indirect competitors
3. Competitor client lists and case studies
4. Market opportunities and gaps

I'll provide you with a detailed analysis including a table of 5 companies (small, medium, and large) with their key information.

*Research in progress...*
      `;
      
      // Auto-trigger the backend research
      const autoPrompt = `
I want a comprehensive competitor analysis for ${companyContext}. Please provide:

1. **Industry Analysis**: What industry or sector is ${companyContext} operating in (e.g., CRM, marketing automation, sales enablement)?

2. **Competitor Research**: I need a list of 5 companies (mix of small, medium, large competitors):
   - Small companies: <50 employees
   - Medium companies: 50-500 employees  
   - Large companies: 500+ employees

3. **Client Analysis**: For each competitor, include their notable clients and key partnerships

4. **Market Positioning**: How each competitor positions themselves vs ${companyContext}

Please structure this in a clear table format with:
- Company Name
- Company Size (Small/Medium/Large)
- Industry Focus
- Key Clients
- Market Position
- Website/Contact Info

Additional research questions to address:
- Are you looking for competitors based on similar product offerings, target markets, or both?
- Should I focus on global companies, or specific regions?
- Should the clients of competitors be notable/key clients only, or as comprehensive as publicly available?

Provide actionable competitive intelligence that can drive sales strategy.
      `;
      
      // Call the research function with the auto prompt
      const autoResult = await runGemini(autoPrompt, chatHistory, { 
        mode: 'research'
      });
      
      return NextResponse.json({
        success: true,
        result: autoResult,
        mode: 'research',
        researchType: 'competitor',
        autoTriggered: true,
        query: autoPrompt,
        timestamp: new Date().toISOString()
      });
      
    } else if (icpStatus === 'pending' && companyContext) {
      // User needs ICP development
      researchPrompt = `
I'll help you develop a comprehensive Ideal Customer Profile (ICP) for ${companyContext}.

**ICP Development Process**

To create your perfect customer profile, I need to research:

1. **Company Demographics**: Industry, company size, revenue, location
2. **Buyer Personas**: Key decision-makers, their roles, pain points
3. **Behavioral Patterns**: Buying process, budget cycles, decision criteria
4. **Technology Stack**: Tools they use, integration needs
5. **Market Segments**: Primary and secondary target markets

Let me start by analyzing ${companyContext} and your market...

*Initiating ICP research...*
      `;
      
      // Auto-trigger ICP development
      const icpPrompt = `
Develop a comprehensive Ideal Customer Profile (ICP) for ${companyContext}. 

Please research and provide:

1. **Company Profile Analysis**:
   - What does ${companyContext} offer?
   - What industry/market do they serve?
   - What are their key value propositions?

2. **Target Customer Segments**:
   - Industry verticals that would benefit most
   - Company size ranges (startup, SMB, enterprise)
   - Geographic markets
   - Revenue ranges

3. **Buyer Personas**:
   - Primary decision-makers (titles, departments)
   - Secondary influencers
   - Pain points they experience
   - Goals and objectives

4. **Behavioral Characteristics**:
   - Buying process and timeline
   - Budget considerations
   - Technology adoption patterns
   - Preferred communication channels

5. **Qualification Criteria**:
   - Must-have characteristics
   - Nice-to-have attributes
   - Red flags/disqualifiers

Present this in a structured, actionable format that can be used for sales and marketing targeting.
      `;
      
      const icpResult = await runGemini(icpPrompt, chatHistory, { 
        mode: 'research'
      });
      
      return NextResponse.json({
        success: true,
        result: icpResult,
        mode: 'research',
        researchType: 'icp',
        autoTriggered: true,
        nextStep: 'competitor_research',
        query: icpPrompt,
        timestamp: new Date().toISOString()
      });
    } else {
      // General research query
      researchPrompt = query;
    }

    // For non-auto-triggered requests, use regular Gemini call
    const result = await runGemini(researchPrompt, chatHistory, { 
      mode: 'research'
    });
    
    return NextResponse.json({
      success: true,
      result,
      mode: 'research',
      researchType: researchType || 'general',
      query: researchPrompt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('ResearchGPT error:', error);
    return NextResponse.json({ 
      error: 'Failed to process research query',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const POST = requireAuth(handleResearchQuery);
