import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/authMiddleware';

interface LightningResearchRequest {
  researchQuery: string;
  userPrompt: string;
  chatId?: string;
  researchType?: string;
}

interface LightningResearchResult {
  query: string;
  researchType: 'company' | 'general';
  comprehensiveAnalysis: string;
  keyInsights: string[];
  recommendations: string[];
  sources: string[];
  researchTimestamp: string;
}

// Helper function for company research
async function performCompanyResearch(researchQuery: string, userPrompt: string, chatId?: string) {
  console.log('🔥 Lightning Mode: Starting deep company analysis for:', researchQuery);

  // Step 1: Perform company research using the company API
  const companyResearchResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/research/company`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      websiteUrl: researchQuery.includes('http') ? researchQuery : `https://${researchQuery}`,
      companyName: researchQuery,
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
Perform comprehensive competitor analysis for ${researchQuery}:

1. **Industry Classification**: What industry/sector does ${researchQuery} operate in?

2. **Competitor Research**: Provide 5 competitors (mix of small, medium, large):
   - Small companies: <50 employees
   - Medium companies: 50-500 employees
   - Large companies: 500+ employees

3. **For each competitor include**:
   - Company name and size category
   - Industry focus/specialization
   - Key clients/partners (if available)
   - Market positioning vs ${researchQuery}
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
      companyContext: researchQuery,
      icpStatus: 'done',
      researchType: 'competitor'
    })
  });

  if (!researchResponse.ok) {
    throw new Error('Failed to perform competitor research');
  }

  const researchData = await researchResponse.json();


  // Compile comprehensive company analysis
  const result: LightningResearchResult = {
    query: researchQuery,
    researchType: 'company',
    comprehensiveAnalysis: `
# 🚀 Lightning Company Analysis: ${companyAnalysis?.companyName || researchQuery}

## 📊 Company Overview
**Industry:** ${companyAnalysis?.industry || 'Analysis in progress'}
**Description:** ${companyAnalysis?.description || 'Deep analysis being performed'}
**Market Position:** ${companyAnalysis?.marketPosition || 'Analysis in progress'}

## 🎯 Target Audience
${companyAnalysis?.targetAudience || 'To be determined'}

## 🛠️ Key Products & Services
${companyAnalysis?.keyProducts?.map(product => `- ${product}`).join('\n') || 'Analysis in progress'}

## 🏢 Technical Stack
${companyAnalysis?.technicalStack?.map(tech => `- ${tech}`).join('\n') || 'Analysis in progress'}

## 🏆 Competitive Analysis
${researchData.response || 'Analysis in progress'}

## 📈 Lead Generation Insights
Strategic lead generation recommendations based on analysis

---
*Analysis completed at: ${new Date().toLocaleString()}*
*Powered by Lightning Mode - Deep Company Intelligence*
    `,
    keyInsights: [
      companyAnalysis?.industry || 'Industry analysis in progress',
      companyAnalysis?.marketPosition || 'Market position analysis in progress',
      'Competitor analysis completed',
    ],
    recommendations: [],
    sources: ['Company website analysis', 'Industry research', 'Competitor intelligence', 'Market data'],
    researchTimestamp: new Date().toISOString()
  };

  console.log('✅ Lightning Mode: Deep company analysis completed for:', researchQuery);

  return NextResponse.json({
    success: true,
    data: result,
    message: `Lightning analysis completed for ${researchQuery}`
  });
}

// Helper function for general research
async function performGeneralResearch(researchQuery: string, userPrompt: string, chatId?: string) {
  console.log('🔥 Lightning Mode: Starting comprehensive research for:', researchQuery);

  // Create a comprehensive research prompt
  const comprehensivePrompt = `
Perform comprehensive research and analysis on: "${researchQuery}"

Please provide:
1. **Overview**: What is this topic/subject about?
2. **Key Facts & Information**: Most important details and data
3. **Current Trends**: What's happening now in this area?
4. **Expert Insights**: Professional perspectives and analysis
5. **Practical Applications**: How this applies in real-world scenarios
6. **Future Outlook**: What to expect moving forward
7. **Recommendations**: Actionable advice based on the research

Make this analysis comprehensive, well-structured, and highly informative.
Use current data and provide sources where possible.
  `;

  // Use the main research API for general queries
  const researchResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/research`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: comprehensivePrompt,
      researchType: 'general'
    })
  });

  if (!researchResponse.ok) {
    throw new Error('Failed to perform general research');
  }

  const researchData = await researchResponse.json();

  // Get additional insights from Gemini
  const insightPrompt = `
Based on the research about "${researchQuery}", provide:
1. **Key Takeaways**: 3-5 most important insights
2. **Actionable Recommendations**: What should someone do with this information?
3. **Related Topics**: What other areas should be explored?
4. **Potential Impact**: How this could affect businesses or individuals

Keep it concise but comprehensive.
  `;

  const insightResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gemini`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: insightPrompt,
      useGrounding: true
    })
  });

  const insightData = await insightResponse.json();

  // Compile comprehensive general research
  const result: LightningResearchResult = {
    query: researchQuery,
    researchType: 'general',
    comprehensiveAnalysis: `
# 🔍 Lightning Research Analysis: ${researchQuery}

## 📋 Comprehensive Research Findings

${researchData.response || 'Research analysis in progress... Please wait for detailed findings.'}

## 💡 Key Insights & Takeaways

${insightData.response || 'Additional insights being generated...'}

## 🎯 Actionable Recommendations

Based on the research, here are practical steps you can take:

1. **Immediate Actions**: What to do right now
2. **Short-term Strategy**: Next steps for the coming weeks
3. **Long-term Planning**: Strategic considerations for the future
4. **Monitoring & Evaluation**: How to track progress and results

## 🔗 Related Research Areas

Explore these connected topics for deeper understanding:
- Industry trends and developments
- Competitive landscape analysis
- Technology and innovation impacts
- Market opportunities and challenges

## 📊 Research Methodology

This analysis was conducted using:
- Multi-source data aggregation
- AI-powered content analysis
- Real-time web search integration
- Expert knowledge synthesis

---
*Research completed at: ${new Date().toLocaleString()}*
*Powered by Lightning Mode - Comprehensive Research Intelligence*
    `,
    keyInsights: [
      'Comprehensive research completed',
      'Multi-source data analysis',
      'Actionable recommendations provided',
      'Future trends identified'
    ],
    recommendations: insightData.response ? insightData.response.split('\n').filter(line => line.trim()) : [],
    sources: ['Web search integration', 'AI analysis', 'Multiple data sources', 'Expert synthesis'],
    researchTimestamp: new Date().toISOString()
  };

  console.log('✅ Lightning Mode: Comprehensive research completed for:', researchQuery);

  return NextResponse.json({
    success: true,
    data: result,
    message: `Lightning research completed for ${researchQuery}`
  });
}

const handleLightningResearch = async (request: NextRequest) => {
  try {
    const { researchQuery, userPrompt, chatId, researchType }: LightningResearchRequest = await request.json();

    if (!researchQuery) {
      return NextResponse.json({ error: 'Research query is required' }, { status: 400 });
    }

    console.log('🔥 Lightning Mode: Starting comprehensive research for:', researchQuery);

    // Determine research approach based on query type
    const isCompanyQuery = researchQuery.includes('.com') || researchQuery.includes('.org') ||
                          researchQuery.includes('.net') || researchQuery.split(' ').length <= 3;

    if (isCompanyQuery) {
      // Company-specific research
      return await performCompanyResearch(researchQuery, userPrompt, chatId);
    } else {
      // General research query
      return await performGeneralResearch(researchQuery, userPrompt, chatId);
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

export const POST = requireAuth(handleLightningResearch);
