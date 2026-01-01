import { NextRequest, NextResponse } from 'next/server';
import { runGemini } from '../../gemini/geminiHandler';

export async function POST(request: NextRequest) {
  try {
    // Safely parse request body
    let body;
    try {
      const text = await request.text();
      if (!text || text.trim() === '') {
        console.error('Company Summary API: Empty request body');
        return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
      }
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('Company Summary API: JSON parse error:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    const { inputs } = body;
    
    if (!inputs) {
      return NextResponse.json({ error: 'Inputs are required' }, { status: 400 });
    }

    console.log('🔍 Company Summary API called with inputs:', inputs);

    // Extract company information from inputs
    const companyInfo = inputs.website || inputs.linkedin || inputs.email || '';
    
    console.log('🔍 Extracted company info:', companyInfo);
    console.log('🔍 Input breakdown:', {
      website: inputs.website,
      linkedin: inputs.linkedin,
      email: inputs.email,
      domain: inputs.domain
    });
    
    if (!companyInfo) {
      return NextResponse.json({ error: 'Company information is required' }, { status: 400 });
    }

    // Create enhanced prompt with web search integration
    const prompt = `You are an expert business analyst with access to real-time web data. Analyze the following company/website and provide a comprehensive business analysis using current web information.

COMPANY/WEBSITE TO ANALYZE: ${companyInfo}

IMPORTANT: You must analyze ONLY the website "${companyInfo}" - do not analyze any other website or company. Focus exclusively on this specific website and its business.

RESEARCH INSTRUCTIONS:
1. Use web search to gather current information about this company
2. Visit their website to understand their actual business model
3. Research their industry, recent news, and market position
4. Find information about their products/services, target customers, and competitive landscape
5. Look for recent company updates, funding, partnerships, or growth

Generate the analysis in this EXACT structure:

## Your Company Analysis 
- **Business Overview** (2-3 sentences: what they actually do, core value proposition based on current website)
- **Company Snapshot** (Revenue Size: [current best estimate with currency], Employee Size: [current headcount range or best estimate], Founders: [full names and roles], Investors: [notable investors or funding partners])
- **Target Industries & Customers** (who they actually serve, based on their current products/services and case studies)
- **Competitive Advantages** (3-4 bullets, derived from their unique selling points and market positioning)
- **Growth Opportunities** (based on current market trends and their business model)
- **Competitors** (list 3-5 real competitors in their industry, based on current market research)

## AI Audience Profiling
Based on the company analysis above, suggest target audience criteria for prospect list generation:

- **Sales Objective:** [Generate qualified leads, Expand into a new region or sector, Enrich or clean an existing list, Purchase a new contact list]
- **Company Role:** [Founder / CEO, Sales Director or Manager, Marketing Director or Manager, Sales Development Representative (SDR), Consultant / Advisor, Other]
- **Short Term Goal:** [Schedule a demo, Purchase or download contacts, Enrich my existing list, Create a new list from scratch, Get advice on strategy]
- **Website URL:** ${companyInfo}
- **Go-to-Market:** [B2B, B2C, B2G, BOTH]
- **Target Industry:** [Accounting/Finance, Advertising/Public Relations, Aerospace/Aviation, Agriculture/Livestock, Animal Care/Pet Services, Arts/Entertainment/Publishing, Automotive, Banking/Mortgage, Business Development, Business Opportunity, Clerical/Administrative, Construction/Facilities, Education/Research, Energy/Utilities, Food/Beverage, Government/Non-Profit, Healthcare/Wellness, Legal/Security, Manufacturing/Industrial, Real Estate/Property, Retail/Wholesale, Technology/IT, Transportation/Logistics, Other, NA]
- **Target Revenue Size:** [0-500K, 500K-1M, 1M-5M, 5M-10M, 10M-50M, 50M-100M, 100M-500M, 500M-1B, 1B-5B, 5B+, NA]
- **Target Employee Size:** [0-10, 11-50, 51-200, 201-500, 501-1000, 1000-5000, 5001-10000, 10001-50000, 50001-100000, 100000+, NA]
- **Target Departments:** [C-suite, Sales, Marketing, Engineering, IT, Operations, HR, Finance, Procurement, Other]
- **Target Region:** [India, North America, Europe, Asia-Pacific, Global / Multiple regions]
- **Target Location:** [Specific city, state, or region name]

CRITICAL: You must ONLY provide company analysis and target audience criteria. DO NOT include any actual prospect lists, company examples, contact information, or ready-to-contact leads.

ABSOLUTELY FORBIDDEN CONTENT:
- NO actual prospect lists
- NO company names with websites
- NO contact information
- NO "ready-to-contact leads"
- NO "Here are X prospects" sections
- NO individual company examples
- NO "Prospect 1", "Prospect 2", etc.

CRITICAL REQUIREMENTS:
- Use REAL, CURRENT data from web search and website analysis
- NO "N/A" or generic answers allowed - make educated assumptions based on research
- Base all recommendations on actual company information, not assumptions
- If the company website is unclear, use web search to find additional context
- Provide specific, realistic values based on current market research
- Format exactly as shown above with proper markdown headers
- Focus on actionable insights that can drive real prospect list generation results
- ONLY provide the company analysis and target audience criteria as specified above
- STOP after the target audience criteria - do not add any additional content

TARGET AUDIENCE FIELD VALIDATION:
- For each target audience field, you MUST select ONLY from the exact options provided in brackets
- DO NOT add any descriptive text, explanations, or additional context to the field values
- DO NOT include phrases like "(implied by location and market focus)" or similar explanatory text
- Each field value must be EXACTLY one of the options listed in the brackets
- If unsure, select the most appropriate option from the provided list
- For Target Location, provide only the specific city, state, or region name without additional context`;

    console.log('🔍 Calling Gemini for company summary...');
    
    // Use direct Gemini with web search for faster results (skip research API to improve performance)
    const summary = await runGemini(prompt, [], {
      mode: 'company_summary',
      enableWebSearch: true,
      useGrounding: true,
      groundingParams: {
        searchQueries: [
          `"${companyInfo}" company business model industry`,
          `"${companyInfo}" competitors market analysis`,
          `"${companyInfo}" recent news funding partnerships`,
          `"${companyInfo}" products services target customers`,
          `site:${companyInfo} about us services products`,
          `"${companyInfo}" revenue size latest`,
          `"${companyInfo}" employee count headcount`,
          `"${companyInfo}" founders leadership team`,
          `"${companyInfo}" investors funding rounds`
        ]
      }
    });

    console.log('🔍 Company summary generated successfully');
    console.log('📊 Summary length:', summary.length);
    console.log('📊 Summary preview:', summary.substring(0, 200) + '...');
    console.log('📊 Full summary for debugging:', summary);

    // Clean up any disclaimers or unwanted text
    let cleanSummary = summary;
    
    // Remove common disclaimer patterns and unwanted content
    const disclaimerPatterns = [
      /Please note:.*?Therefore, I will provide.*?based on the provided website and search results.*?adhering strictly to the allowed output format and content\./gi,
      /Here's a comprehensive analysis of.*?based on the website and search results:/gi,
      /My instructions prohibit me from.*?Therefore, I will provide.*?adhering strictly to the allowed output format and content\./gi,
      /I cannot generate.*?Therefore, I will provide.*?based on the provided information\./gi,
      /Based on my analysis of.*?here's the structured business analysis:/gi,
      /ACTUAL PROSPECT LIST.*?Citations:.*$/gis, // Remove actual prospect lists
      /Prospect \d+:.*?Citations:.*$/gis, // Remove individual prospect entries
      /Company Name & Website:.*?Urgency Level:.*$/gms, // Remove detailed prospect information
      /Citations:.*$/gms, // Remove citations section
      /Actual Prospect List.*$/gis, // Remove any "Actual Prospect List" headers
      /Here are.*?ready-to-contact leads.*$/gis, // Remove prospect list introductions
      /Prospect \d+.*$/gm, // Remove individual prospect entries
      /Company Name.*?Website.*$/gm, // Remove prospect company details
      /Industry.*?Urgency Level.*$/gm, // Remove prospect details
      /Based on.*?offering.*?prospects.*$/gis, // Remove prospect list introductions
    ];
    
    disclaimerPatterns.forEach(pattern => {
      cleanSummary = cleanSummary.replace(pattern, '').trim();
    });
    
    console.log('📊 Cleaned summary length:', cleanSummary.length);
    console.log('📊 Cleaned summary preview:', cleanSummary.substring(0, 200) + '...');
    
    // Ensure it starts with the proper structure
    if (!cleanSummary.includes('## Your Company Analysis')) {
      // Find the first section header and remove everything before it
      const sectionMatch = cleanSummary.match(/(## .*)/);
      if (sectionMatch) {
        cleanSummary = cleanSummary.substring(cleanSummary.indexOf(sectionMatch[1]));
      }
    }
    
    console.log('📊 Final cleaned summary:', cleanSummary);

    return NextResponse.json({ 
      summary: cleanSummary,
      inputs,
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Company Summary API error:', error);
    
    // Check if it's a rate limit error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('RATE_LIMIT_EXCEEDED') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return NextResponse.json(
        { 
          error: 'Service temporarily unavailable',
          details: 'We are experiencing high demand. Please restart Lightning Mode after a few minutes.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: 300 // Suggest retry after 5 minutes
        }, 
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate company summary',
        details: errorMessage
      }, 
      { status: 500 }
    );
  }
}
