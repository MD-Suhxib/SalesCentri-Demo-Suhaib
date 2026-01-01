import { NextRequest, NextResponse } from 'next/server';
import { AuthenticatedUser } from '../../../lib/authMiddleware';

interface CompanyResearchRequest {
  websiteUrl: string;
  companyName?: string;
  researchFocus?: string; // e.g., 'general', 'industry', 'competitors', 'target-audience'
  anonymousUserId?: string; // For anonymous users
}

interface CompanyResearchResult {
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
  contactInfo: {
    email?: string;
    phone?: string;
    address?: string;
  };
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  recentNews: string[];
  researchedAt: string;
}

const handleCompanyResearch = async (request: NextRequest, user?: AuthenticatedUser) => {
  try {
    const { websiteUrl, companyName, researchFocus = 'general', anonymousUserId }: CompanyResearchRequest = await request.json();
    
    // Get user ID (authenticated or anonymous)
    const userId = user?.uid || anonymousUserId || `anon_${Date.now()}`;
    
    console.log('🔍 Research API - User ID:', userId, 'User:', user ? 'authenticated' : 'anonymous');
    
    if (!websiteUrl) {
      return NextResponse.json(
        { error: 'Website URL is required' },
        { status: 400 }
      );
    }
    
    // Prepare the research prompt with Google Search grounding
    const researchPrompt = buildResearchPrompt(websiteUrl, companyName, researchFocus);
    
    // Call Gemini with Google Search grounding
    const geminiResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: researchPrompt,
        useGrounding: true, // Enable Google Search grounding
        groundingParams: {
          searchQueries: [
            `${companyName || websiteUrl} company information about us services products`,
            `${companyName || websiteUrl} industry competitive analysis market position`,
            `${companyName || websiteUrl} recent news announcements funding partnerships`,
            `${companyName || websiteUrl} target customers case studies testimonials`,
            `${companyName || websiteUrl} contact information leadership team executives`,
            `${companyName || websiteUrl} technology stack tools integrations`
          ]
        }
      })
    });
    
    if (!geminiResponse.ok) {
      throw new Error('Failed to get research from Gemini');
    }
    
    const geminiData = await geminiResponse.json();
    
    // Parse the research results
    const researchResult = parseResearchResponse(geminiData.response, websiteUrl, companyName);
    
    return NextResponse.json({
      success: true,
      data: researchResult
    });
    
  } catch (error) {
    console.error('Company research error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to research company' 
      },
      { status: 500 }
    );
  }
};

const buildResearchPrompt = (websiteUrl: string, companyName?: string, researchFocus?: string): string => {
  const basePrompt = `
You are a professional business analyst. Please conduct a comprehensive research analysis of the company at ${websiteUrl}${companyName ? ` (${companyName})` : ''}.

**IMPORTANT**: Use Google Search to find the most current and accurate information about this company. Look at their website, recent news, social media, and industry reports.

Please provide a detailed analysis in the following structured format:

**Company Overview:**
- Full company name and legal structure
- Industry and business sector
- Founded date and company age
- Headquarters location and other offices

**Business Model & Services:**
- Primary products/services offered
- Value proposition and unique selling points
- Target customer segments (B2B/B2C)
- Revenue model (SaaS, product sales, services, etc.)

**Market Position:**
- Company size (employees and estimated revenue)
- Market position (startup, growth stage, established, enterprise)
- Key competitors and competitive advantages
- Recent funding rounds or financial news

**Target Audience Analysis:**
- Primary customer demographics
- Industries they serve
- Company sizes they typically work with
- Geographic markets they operate in

**Technology & Operations:**
- Technology stack (visible from website/job posts)
- Key partnerships and integrations
- Distribution channels
- Operational locations

**Contact & Social Presence:**
- Main contact information (email, phone, address)
- LinkedIn, Twitter, Facebook profiles
- Key executives and their LinkedIn profiles
- Press contact information

**Recent Developments:**
- Latest news and announcements
- Product launches or updates
- Hiring trends and job openings
- Awards or recognitions

**Sales Intelligence:**
- Potential pain points or challenges
- Growth opportunities and expansion plans
- Budget indicators and spending patterns
- Decision-maker roles and departments

**Research Focus**: ${researchFocus}

Please ensure all information is current and factual by searching the web for the latest data about this company.
`;

  return basePrompt;
};

const parseResearchResponse = (response: string, websiteUrl: string, companyName?: string): CompanyResearchResult => {
  // This is a simplified parser - in production, you might use more sophisticated parsing
  // or ask Gemini to return structured JSON
  
  const defaultResult: CompanyResearchResult = {
    companyName: companyName || extractDomainName(websiteUrl),
    industry: 'Unknown',
    description: '',
    targetAudience: '',
    keyProducts: [],
    competitors: [],
    marketPosition: '',
    challenges: [],
    opportunities: [],
    technicalStack: [],
    contactInfo: {},
    socialMedia: {},
    recentNews: [],
    researchedAt: new Date().toISOString()
  };
  
  // For now, we'll store the full response and extract what we can
  // In production, you'd implement more sophisticated parsing
  try {
    // Try to extract structured information from the response
    const lines = response.split('\n');
    const result = { ...defaultResult };
    
    // Simple extraction logic - you can enhance this
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('company name:') || lower.includes('name:')) {
        result.companyName = line.split(':')[1]?.trim() || result.companyName;
      }
      if (lower.includes('industry:') || lower.includes('sector:')) {
        result.industry = line.split(':')[1]?.trim() || result.industry;
      }
      if (lower.includes('description:') || lower.includes('what they do:')) {
        result.description = line.split(':')[1]?.trim() || result.description;
      }
    });
    
    // Store the full response as description if no specific description found
    if (!result.description) {
      result.description = response.substring(0, 500) + '...';
    }
    
    return result;
    
  } catch (error) {
    console.error('Error parsing research response:', error);
    return {
      ...defaultResult,
      description: response.substring(0, 500) + '...'
    };
  }
};

const extractDomainName = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '').split('.')[0];
  } catch {
    return url;
  }
};

export async function POST(request: NextRequest) {
  // Try to authenticate first
  try {
    const { authenticate } = await import('../../../lib/authMiddleware');
    const user = await authenticate(request);
    
    if (user) {
      return handleCompanyResearch(request, user);
    }
  } catch {
    // Authentication failed, continue as anonymous
    console.log('Authentication failed, handling as anonymous user');
  }
  
  // Handle as anonymous user
  return handleCompanyResearch(request, undefined);
}
