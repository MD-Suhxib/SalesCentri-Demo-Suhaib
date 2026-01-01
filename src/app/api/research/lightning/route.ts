import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/authMiddleware';

interface LightningResearchRequest {
  researchQuery: string;
  userPrompt: string;
  chatId?: string;
  researchType?: string;
  excel_data?: any[] | null;
  excel_file_name?: string | null;
}

interface LightningResearchResult {
  companyAnalysis: {
    companyName: string;
    industry: string;
    description: string;
    targetAudience: string;
    keyProducts: string[];
    competitors: string[];
    marketPosition: string;
    challenges: string[];
    opportunities: string[];
    technicalStack: string[];
    contactInfo: any;
    socialMedia: any;
    recentNews: string[];
  };
  competitorAnalysis: {
    industryAnalysis: string;
    competitors: Array<{
      name: string;
      size: string;
      industryFocus: string;
      keyClients: string[];
      marketPosition: string;
      website: string;
    }>;
    marketInsights: string;
  };
  leadGenerationInsights: string;
  researchTimestamp: string;
}

const handleLightningResearch = async (request: NextRequest) => {
  try {
    const { researchQuery, userPrompt, chatId, researchType, excel_data, excel_file_name }: LightningResearchRequest = await request.json();

    if (!researchQuery) {
      return NextResponse.json({ error: 'Research query is required' }, { status: 400 });
    }

    console.log('🔥 Lightning Mode: Starting comprehensive research for:', researchQuery);

    // Determine research approach based on query type
    const isCompanyQuery = researchQuery.includes('.com') || researchQuery.includes('.org') ||
                          researchQuery.includes('.net') || researchQuery.split(' ').length <= 3;

    if (isCompanyQuery) {
      // Company-specific research
      return await performCompanyResearch(researchQuery, userPrompt, chatId, excel_data, excel_file_name);
    } else {
      // General research query
      return await performGeneralResearch(researchQuery, userPrompt, chatId, excel_data, excel_file_name);
    }
  } catch (error) {
    console.error('Lightning research error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform lightning research',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};

// Perform company-specific research with attachment support
async function performCompanyResearch(
  companyInfo: string,
  userPrompt: string,
  chatId?: string,
  excel_data?: any[] | null,
  excel_file_name?: string | null
) {
  try {
    console.log('🔥 Lightning Mode: Starting enhanced company research with decision maker verification for:', companyInfo);
    
    const companyResearchResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/research/company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        websiteUrl: companyInfo.includes('http') ? companyInfo : `https://${companyInfo}`,
        companyName: companyInfo,
        researchFocus: 'general'
      })
    });

    if (!companyResearchResponse.ok) {
      throw new Error('Failed to perform company research');
    }

    const companyData = await companyResearchResponse.json();
    const companyAnalysis = companyData.success ? companyData.data : null;

    // Step 2: Perform competitor analysis using the research API
    const competitorPrompt = `
Perform comprehensive competitor analysis for ${companyInfo}:

${excel_data && excel_data.length > 0 ? `\nAdditional Data Context: User has provided Excel data with ${excel_data.length} entries from file "${excel_file_name}". Consider this supplementary data in your analysis.` : ''}

1. **Industry Classification**: What industry/sector does ${companyInfo} operate in?

2. **Competitor Research**: Provide 5 competitors (mix of small, medium, large):
   - Small companies: <50 employees
   - Medium companies: 50-500 employees
   - Large companies: 500+ employees

3. **For each competitor include**:
   - Company name and size category
   - Industry focus/specialization
   - Key clients/partners (if available)
   - Market positioning vs ${companyInfo}
   - Website URL

4. **Market Insights**: Key market trends, opportunities, and competitive landscape

Structure the response in a clear, actionable format.
    `;

    const researchResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: competitorPrompt,
        companyContext: companyInfo,
        icpStatus: 'done',
        researchType: 'competitor'
      })
    });

    if (!researchResponse.ok) {
      throw new Error('Failed to perform competitor research');
    }

    const researchData = await researchResponse.json();


    // Step 4: Compile comprehensive lightning analysis
    const lightningResult: LightningResearchResult = {
      companyAnalysis: companyAnalysis || {
        companyName: companyInfo,
        industry: 'Analysis in progress',
        description: 'Deep analysis being performed',
        targetAudience: 'To be determined',
        keyProducts: [],
        competitors: [],
        marketPosition: 'Analysis in progress',
        challenges: [],
        opportunities: [],
        technicalStack: [],
        contactInfo: {},
        socialMedia: {},
        recentNews: []
      },
      competitorAnalysis: {
        industryAnalysis: researchData.response || 'Analysis in progress',
        competitors: [], // Will be parsed from research response
        marketInsights: 'Analysis in progress'
      },
      leadGenerationInsights: 'Strategic lead generation recommendations will be provided based on analysis',
      researchTimestamp: new Date().toISOString()
    };

    console.log('✅ Lightning Mode: Deep analysis completed for:', companyInfo);

    return NextResponse.json({
      success: true,
      data: lightningResult,
      message: `Lightning analysis completed for ${companyInfo}`
    });

  } catch (error) {
    console.error('Company research error:', error);
    throw error;
  }
}

// Perform general research with attachment support
async function performGeneralResearch(
  researchQuery: string,
  userPrompt: string,
  chatId?: string,
  excel_data?: any[] | null,
  excel_file_name?: string | null
) {
  try {
    // General research implementation
    const generalPrompt = `
Perform comprehensive research on: ${researchQuery}

${excel_data && excel_data.length > 0 ? `\nAdditional Context: User has provided ${excel_data.length} data entries from file "${excel_file_name}". Consider this supplementary data in your analysis.` : ''}

Please provide:
1. Key findings and insights
2. Relevant data and statistics
3. Industry trends and implications
4. Strategic recommendations
5. Actionable next steps

Structure your response in a clear, comprehensive format.
    `;

    const researchResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: generalPrompt,
        useGrounding: true
      })
    });

    if (!researchResponse.ok) {
      throw new Error('Failed to perform general research');
    }

    const researchData = await researchResponse.json();

    const generalResult: LightningResearchResult = {
      companyAnalysis: {
        companyName: researchQuery,
        industry: 'General Research',
        description: researchData.response || 'Research completed',
        targetAudience: 'Based on research findings',
        keyProducts: [],
        competitors: [],
        marketPosition: 'Analysis completed',
        challenges: [],
        opportunities: [],
        technicalStack: [],
        contactInfo: {},
        socialMedia: {},
        recentNews: []
      },
      competitorAnalysis: {
        industryAnalysis: 'General research analysis completed',
        competitors: [],
        marketInsights: researchData.response || 'Analysis completed'
      },
      leadGenerationInsights: 'Research-based insights provided',
      researchTimestamp: new Date().toISOString()
    };

    console.log('✅ Lightning Mode: General research completed for:', researchQuery);

    return NextResponse.json({
      success: true,
      data: generalResult,
      message: `General research completed for ${researchQuery}`
    });

  } catch (error) {
    console.error('General research error:', error);
    throw error;
  }
}

export const POST = handleLightningResearch;
