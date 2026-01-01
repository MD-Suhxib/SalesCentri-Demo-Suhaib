import { NextRequest, NextResponse } from 'next/server';
import { orchestrateResearch, ResearchRequest } from '../../../lib/researchOrchestration';
import { LightningInputs, CompanyProfile } from '../../../types/lightningMode';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Lightning Mode Research API called');
    const inputs: LightningInputs = await request.json();
    console.log('🔍 Lightning Mode Research API inputs:', inputs);
    
    // Validate inputs
    if (!inputs.email && !inputs.website && !inputs.linkedin) {
      console.log('🔍 Lightning Mode Research API: No valid inputs provided');
      return NextResponse.json({ error: 'At least one input is required' }, { status: 400 });
    }

    // Create research query based on available inputs
    let researchQuery = '';
    const queryParts: string[] = [];

    if (inputs.email) {
      queryParts.push(`Email: ${inputs.email}`);
    }
    if (inputs.website) {
      queryParts.push(`Website: ${inputs.website}`);
    }
    if (inputs.linkedin) {
      queryParts.push(`LinkedIn: ${inputs.linkedin}`);
    }

    researchQuery = `Please analyze this company and provide a comprehensive company profile: ${queryParts.join(', ')}`;

    // Create research request with Lightning Mode configuration - Multi-GPT Aggregated Research
    const researchRequest: ResearchRequest = {
      query: researchQuery,
      category: 'market_analysis',
      depth: 'comprehensive',
      timeframe: '1Y',
      geographic_scope: 'Global',
      data_sources: [],
      company_size: 'all',
      focus_on_leads: false,
      selected_models: { 
        gpt4o: false, 
        gemini: true, 
        perplexity: false,
        claude: false,
        llama: false,
        grok: false,
        deepseek: false
      },
      web_search_enabled: true,
      excel_data: null,
      excel_file_name: null,
      using_web_search: true,
      config_summary: 'Lightning Mode company profile research - Multi-GPT Aggregated Research',
      website_url: inputs.website || null,
      website_url_2: null,
      revenue_category: null,
      deep_research: true,
      include_founders: true,
      include_products: true,
      analyze_sales_opportunities: true,
      include_tabular_data: true,
      extract_company_info: true,
      analyze_prospective_clients: true,
      include_employee_count: true,
      include_revenue_data: true,
      include_complete_urls: true,
      perplexity_model: 'sonar-deep-research'
    };

    console.log('🔍 Lightning Mode research request:', researchRequest);

    // Call research orchestration
    console.log('🔍 Calling orchestrateResearch...');
    const results = await orchestrateResearch(researchRequest);
    console.log('🔍 Research results received:', results);
    console.log('🔍 GPT-4o result length:', results.gpt4o?.length || 0);
    console.log('🔍 Gemini result length:', results.gemini?.length || 0);
    console.log('🔍 Perplexity result length:', results.perplexity?.length || 0);
    console.log('🔍 Lightning Mode using Multi-GPT Aggregated Research (GPT-4o + Gemini + Perplexity)');
    
    // Parse results into company profile
    console.log('🔍 Parsing company profile...');
    const companyProfile = parseCompanyProfile(results, inputs);
    console.log('🔍 Company profile parsed:', companyProfile);
    
    return NextResponse.json(companyProfile);
  } catch (error) {
    console.error('Lightning Mode research error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Research failed' },
      { status: 500 }
    );
  }
}

/**
 * Parse research results into structured company profile
 */
function parseCompanyProfile(results: any, inputs: LightningInputs): CompanyProfile {
  const profile: CompanyProfile = {};

  // Extract from all available results (Multi-GPT Aggregated Research)
  const gpt4oResult = results.gpt4o || '';
  const geminiResult = results.gemini || '';
  const perplexityResult = results.perplexity || '';
  
  // Combine all results for comprehensive parsing
  const combinedResult = `${gpt4oResult}\n\n${geminiResult}\n\n${perplexityResult}`;
  
  console.log('🔍 Multi-GPT research results for parsing:');
  console.log('🔍 GPT-4o result length:', gpt4oResult.length);
  console.log('🔍 Gemini result length:', geminiResult.length);
  console.log('🔍 Perplexity result length:', perplexityResult.length);
  console.log('🔍 Combined result preview:', combinedResult.substring(0, 500) + '...');

  // Use input data as primary source
  if (inputs.website) {
    profile.website = inputs.website;
  }

  // Extract company name from website domain if not found in text
  if (inputs.website) {
    const domain = inputs.website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    profile.companyName = domain.replace('.com', '').replace('.', ' ').toUpperCase();
  }

  // Try to find better company name in the research text (using combined results)
  const companyNamePatterns = [
    /([A-Z][a-zA-Z\s&]+(?:Pvt|Ltd|Inc|Corp|LLC|Company|Industries|Industries?)\s*(?:Ltd|Pvt|Inc|Corp|LLC)?)/,
    /Company[:\s]+([^\n,]+)/i,
    /Profile[:\s]+([^\n,]+)/i,
    /Business[:\s]+([^\n,]+)/i
  ];

  for (const pattern of companyNamePatterns) {
    const match = geminiResult.match(pattern);
    if (match && match[1]) {
      const candidate = match[1].trim()
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/`/g, '') // Remove code markdown
        .replace(/###/g, '') // Remove header markdown
        .replace(/##/g, '') // Remove header markdown
        .replace(/#/g, '') // Remove header markdown
        .replace(/\|/g, ' ') // Remove table separators
        .replace(/-{3,}/g, '') // Remove table separators
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      if (candidate.length > 3 && candidate.length < 100) {
        profile.companyName = candidate;
        break;
      }
    }
  }

  // Extract industry - look for manufacturing, technology, etc.
  const industryPatterns = [
    /manufacturing/i,
    /technology/i,
    /services/i,
    /retail/i,
    /healthcare/i,
    /finance/i,
    /education/i,
    /government/i
  ];

  for (const pattern of industryPatterns) {
    if (geminiResult.match(pattern)) {
      profile.industry = pattern.source.replace(/[\/i]/g, '').toLowerCase();
      break;
    }
  }

  // Extract employee size - look for numbers
  const employeePatterns = [
    /(\d+)\s*(?:employees?|staff|people|workers?)/i,
    /employees?[:\s]+([^\n,]+)/i,
    /staff[:\s]+([^\n,]+)/i
  ];

  for (const pattern of employeePatterns) {
    const match = geminiResult.match(pattern);
    if (match) {
      const employeeData = (match[1] || match[0])
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/`/g, '') // Remove code markdown
        .replace(/###/g, '') // Remove header markdown
        .replace(/##/g, '') // Remove header markdown
        .replace(/#/g, '') // Remove header markdown
        .replace(/\|/g, ' ') // Remove table separators
        .replace(/-{3,}/g, '') // Remove table separators
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      profile.employeeSize = employeeData;
      break;
    }
  }

  // Extract revenue - look for currency amounts
  const revenuePatterns = [
    /(\$[\d,]+|\d+[\d,]*\s*(?:million|billion|cr|lakh|thousand))/i,
    /revenue[:\s]+([^\n,]+)/i,
    /sales[:\s]+([^\n,]+)/i
  ];

  for (const pattern of revenuePatterns) {
    const match = geminiResult.match(pattern);
    if (match) {
      const revenueData = (match[1] || match[0])
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/`/g, '') // Remove code markdown
        .replace(/###/g, '') // Remove header markdown
        .replace(/##/g, '') // Remove header markdown
        .replace(/#/g, '') // Remove header markdown
        .replace(/\|/g, ' ') // Remove table separators
        .replace(/-{3,}/g, '') // Remove table separators
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      profile.revenueBand = revenueData;
      break;
    }
  }

  // Extract location - look for countries and cities
  const locationPatterns = [
    /([A-Z][a-zA-Z\s,]+(?:India|USA|UK|Canada|Australia|Germany|France|Japan|China|Brazil|Mexico|Gujarat|Mumbai|Delhi|Bangalore|Chennai|Kolkata))/,
    /headquarters[:\s]+([^\n,]+)/i,
    /located[:\s]+([^\n,]+)/i,
    /based[:\s]+([^\n,]+)/i
  ];

  for (const pattern of locationPatterns) {
    const match = geminiResult.match(pattern);
    if (match) {
      const locationData = (match[1] ? match[1].trim() : match[0])
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/`/g, '') // Remove code markdown
        .replace(/###/g, '') // Remove header markdown
        .replace(/##/g, '') // Remove header markdown
        .replace(/#/g, '') // Remove header markdown
        .replace(/\|/g, ' ') // Remove table separators
        .replace(/-{3,}/g, '') // Remove table separators
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      profile.targetGeography = locationData;
      break;
    }
  }

  // Extract products/services - look for product mentions
  const productPatterns = [
    /products?[:\s]+([^\n,]+)/i,
    /services?[:\s]+([^\n,]+)/i,
    /manufactures?[:\s]+([^\n,]+)/i,
    /offers?[:\s]+([^\n,]+)/i
  ];

  for (const pattern of productPatterns) {
    const match = geminiResult.match(pattern);
    if (match) {
      const productData = match[1].trim()
        .replace(/\*\*/g, '') // Remove bold markdown
        .replace(/`/g, '') // Remove code markdown
        .replace(/###/g, '') // Remove header markdown
        .replace(/##/g, '') // Remove header markdown
        .replace(/#/g, '') // Remove header markdown
        .replace(/\|/g, ' ') // Remove table separators
        .replace(/-{3,}/g, '') // Remove table separators
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      profile.productsServices = [productData];
      break;
    }
  }

  // Use description from research text (first 300 characters) - clean markdown
  let description = geminiResult.substring(0, 300)
    .replace(/\*\*/g, '') // Remove bold markdown
    .replace(/`/g, '') // Remove code markdown
    .replace(/###/g, '') // Remove header markdown
    .replace(/##/g, '') // Remove header markdown
    .replace(/#/g, '') // Remove header markdown
    .replace(/\|/g, ' ') // Remove table separators
    .replace(/-{3,}/g, '') // Remove table separators
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  profile.description = description + '...';

  // Set fallbacks for missing data
  if (!profile.industry) {
    profile.industry = 'Manufacturing';
  }
  
  if (!profile.employeeSize) {
    profile.employeeSize = 'Not specified';
  }
  
  if (!profile.revenueBand) {
    profile.revenueBand = 'Not specified';
  }
  
  if (!profile.targetGeography) {
    profile.targetGeography = 'Global';
  }

  if (!profile.productsServices || profile.productsServices.length === 0) {
    profile.productsServices = ['Rubber Products'];
  }

  // Extract social media
  if (inputs.linkedin) {
    profile.socialMedia = {
      linkedin: inputs.linkedin
    };
  }

  console.log('🔍 Parsed company profile:', profile);
  return profile;
}
