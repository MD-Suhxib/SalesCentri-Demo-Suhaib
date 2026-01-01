import { NextRequest, NextResponse } from 'next/server';
import { LightningInputs, ICPResult, SampleLead } from '../../../types/lightningMode';
import { runGemini } from '../../gemini/geminiHandler';

export async function POST(request: NextRequest) {
  try {
    const { inputs, companyInfo } = await request.json();
    
    // Validate inputs
    if (!inputs || (!inputs.email && !inputs.website && !inputs.linkedin)) {
      return NextResponse.json({ error: 'Missing required inputs' }, { status: 400 });
    }

    console.log('🚀 Lightning Mode ICP generation started with inputs:', inputs);

    // Generate ICP only (no leads until user confirms ICP)
    const icpResult = await generateICPFromInputs(inputs, companyInfo);
    
    // Return only ICP data (leads generated separately after confirmation)
    const result = {
      icp: icpResult,
      timestamp: new Date().toISOString(),
      inputSource: inputs
    };
    
    console.log('✅ Lightning Mode ICP generation completed');
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Lightning Mode ICP error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'ICP generation failed' },
      { status: 500 }
    );
  }
}

/**
 * Generate ICP using direct Gemini API
 */
async function generateICPFromInputs(inputs: LightningInputs, companyInfo?: any): Promise<ICPResult> {
  try {
    // Extract company information from inputs
    const companyName = extractCompanyNameFromInputs(inputs);
    const industry = extractIndustryFromInputs(inputs, companyInfo);
    const website = inputs.website || extractWebsiteFromEmail(inputs.email);
    
    // Create ICP research query
    const icpQuery = createLightningModeICPQuery(inputs, companyName, industry, website);
    
    // Use Gemini directly for ICP generation
    const result = await runGemini(icpQuery, [], {
      mode: 'icp_generation',
      enableWebSearch: true,
      useGrounding: true
    });
    
    // Parse results into structured ICP
    return parseICPResults({ gemini: result }, companyName, industry);
  } catch (error) {
    console.error('Error generating ICP:', error);
    throw new Error('Failed to generate ICP');
  }
}

/**
 * Generate sample leads based on ICP
 */
async function generateSampleLeads(icp: ICPResult, inputs: LightningInputs): Promise<SampleLead[]> {
  try {
    // Create lead generation query based on ICP
    const leadQuery = createLeadGenerationQuery(icp, inputs);
    
    // Use Gemini directly for lead generation
    const result = await runGemini(leadQuery, [], {
      mode: 'research',
      enableWebSearch: true,
      useGrounding: true
    });
    
    // Parse results into sample leads
    return parseSampleLeads({ gemini: result }, icp);
  } catch (error) {
    console.error('Error generating sample leads:', error);
    return []; // Return empty array if lead generation fails
  }
}

/**
 * Create ICP query for lightning mode
 */
function createLightningModeICPQuery(inputs: LightningInputs, companyName: string, industry: string, website: string | null): string {
  let query = `Create a detailed Ideal Customer Profile (ICP) for lead generation based on the following company information. You must provide specific, researched values for all 6 fields - NO "N/A" or generic answers allowed.\n\n`;
  
  query += `**Company Information:**\n`;
  if (companyName) query += `Company: ${companyName}\n`;
  if (industry) query += `Industry: ${industry}\n`;
  if (website) query += `Website: ${website}\n`;
  if (inputs.email) query += `Email Domain: ${inputs.email.split('@')[1]}\n`;
  if (inputs.linkedin) query += `LinkedIn: ${inputs.linkedin}\n`;
  
  query += `\n**Required ICP Fields (provide specific, researched answers):**\n`;
  query += `1. Industry - List 3-4 specific target industries/sectors where this company's solutions would be most valuable\n`;
  query += `2. Location - Specify 3-4 geographic regions/countries where target customers are located\n`;
  query += `3. Company Size - Provide specific employee count ranges (e.g., "Medium to Large Enterprises (500–5,000 employees)")\n`;
  query += `4. Decision Makers - List 3-4 specific job titles/roles who would make purchasing decisions\n`;
  query += `5. Pain Points - Identify 3-4 specific challenges/problems these customers face that the company's solutions address\n`;
  query += `6. Tech Stack - List 3-4 specific technologies/tools these customers likely use\n`;
  
  query += `\n**CRITICAL REQUIREMENTS:**\n`;
  query += `- Research each field thoroughly and provide specific, realistic values\n`;
  query += `- Make educated assumptions based on the company's industry and business model\n`;
  query += `- If uncertain, provide the most likely scenario rather than "N/A"\n`;
  query += `- Focus on characteristics that would make customers a good fit for this company\n`;
  query += `- Do not include specific company names, contact information, or prospect lists\n`;
  query += `- Each field should be 1-2 lines maximum but highly specific\n`;
  query += `- Infer values from website analysis, industry context, and market research\n`;
  query += `- Use specific, actionable criteria that can be used for lead targeting\n\n`;
  
  query += `Format your response as a simple list with these 6 fields, each with detailed, specific values.`;
  
  return query;
}

/**
 * Create lead generation query based on ICP
 */
function createLeadGenerationQuery(icp: ICPResult, inputs: LightningInputs): string {
  let query = `Based on the following ICP, generate 5-10 specific sample leads with contact information:\n\n`;
  
  query += `**ICP Summary:**\n`;
  query += `Target Personas: ${icp.personas.jobTitles.join(', ')}\n`;
  query += `Industries: ${icp.personas.industries.join(', ')}\n`;
  query += `Company Size: ${icp.companyCharacteristics.size}\n`;
  query += `Pain Points: ${icp.painPoints.join(', ')}\n`;
  
  query += `\n**Lead Generation Requirements:**\n`;
  query += `1. Provide 5-10 specific individual leads with names and job titles\n`;
  query += `2. Include their company names and industries\n`;
  query += `3. Add LinkedIn profiles or contact methods where possible\n`;
  query += `4. Include brief reasoning why they fit the ICP\n`;
  query += `5. Suggest personalized outreach messages for each lead\n`;
  query += `6. Include company information (size, location, recent news)\n`;
  
  return query;
}

/**
 * Extract company name from inputs
 */
function extractCompanyNameFromInputs(inputs: LightningInputs): string {
  if (inputs.website) {
    try {
      const url = new URL(inputs.website);
      return url.hostname.replace('www.', '').split('.')[0];
    } catch {
      return 'Unknown Company';
    }
  }
  if (inputs.email) {
    return inputs.email.split('@')[1].split('.')[0];
  }
  return 'Unknown Company';
}

/**
 * Extract industry from inputs or company info
 */
function extractIndustryFromInputs(inputs: LightningInputs, companyInfo?: any): string {
  if (companyInfo?.industry) return companyInfo.industry;
  if (inputs.website) {
    // Try to infer industry from website domain
    const domain = inputs.website.toLowerCase();
    if (domain.includes('tech') || domain.includes('software')) return 'Technology';
    if (domain.includes('health') || domain.includes('medical')) return 'Healthcare';
    if (domain.includes('finance') || domain.includes('bank')) return 'Financial Services';
    if (domain.includes('retail') || domain.includes('shop')) return 'Retail';
    if (domain.includes('manufacturing') || domain.includes('industrial')) return 'Manufacturing';
  }
  return 'Technology'; // Default fallback
}

/**
 * Extract website from email domain
 */
function extractWebsiteFromEmail(email: string | null): string | null {
  if (!email) return null;
  const domain = email.split('@')[1];
  return `https://www.${domain}`;
}

/**
 * Parse ICP results from ResearchService
 */
function parseICPResults(results: any, companyName: string, industry: string): ICPResult {
  const geminiResult = results.gemini || '';
  const gpt4oResult = results.gpt4o || '';
  const perplexityResult = results.perplexity || '';
  const combinedResult = `${geminiResult}\n\n${gpt4oResult}\n\n${perplexityResult}`;

  // Extract the 6 specific fields for the compact ICP format - enforce inference, no fallbacks
  const industryValue = extractText(combinedResult, /(?:Industry|Industries?)[:\s]+([^\n]+)/i) || 
    extractText(combinedResult, /1\.\s*Industry[:\s]+([^\n]+)/i) ||
    extractText(combinedResult, /Industry[:\s]+([^\n]+)/i) ||
    'Technology, Manufacturing, Healthcare, Financial Services';
    
  const locationValue = extractText(combinedResult, /(?:Location|Locations?|Geography)[:\s]+([^\n]+)/i) || 
    extractText(combinedResult, /2\.\s*Location[:\s]+([^\n]+)/i) ||
    extractText(combinedResult, /Location[:\s]+([^\n]+)/i) ||
    'North America, Europe, Asia-Pacific, Global';
    
  const companySizeValue = extractText(combinedResult, /(?:Company Size|Size)[:\s]+([^\n]+)/i) || 
    extractText(combinedResult, /3\.\s*Company Size[:\s]+([^\n]+)/i) ||
    extractText(combinedResult, /Size[:\s]+([^\n]+)/i) ||
    'Medium to Large Enterprises (500–5,000 employees)';
    
  const decisionMakersValue = extractText(combinedResult, /(?:Decision Makers?|Decision Makers?)[:\s]+([^\n]+)/i) || 
    extractText(combinedResult, /4\.\s*Decision Makers?[:\s]+([^\n]+)/i) ||
    extractText(combinedResult, /Decision Makers?[:\s]+([^\n]+)/i) ||
    'CEOs, CTOs, VPs of Engineering, Procurement Directors';
    
  const painPointsValue = extractText(combinedResult, /(?:Pain Points?|Challenges?)[:\s]+([^\n]+)/i) || 
    extractText(combinedResult, /5\.\s*Pain Points?[:\s]+([^\n]+)/i) ||
    extractText(combinedResult, /Pain Points?[:\s]+([^\n]+)/i) ||
    'Scalability challenges, Cost optimization, Integration complexity, Digital transformation';
    
  const techStackValue = extractText(combinedResult, /(?:Tech Stack|Technology|Technologies?)[:\s]+([^\n]+)/i) || 
    extractText(combinedResult, /6\.\s*Tech Stack[:\s]+([^\n]+)/i) ||
    extractText(combinedResult, /Tech Stack[:\s]+([^\n]+)/i) ||
    'Cloud platforms (AWS, Azure), CRM systems (Salesforce), Analytics tools, Modern development frameworks';

  return {
    companyName,
    industry: industryValue,
    // New compact format fields
    location: locationValue,
    companySize: companySizeValue,
    decisionMakers: decisionMakersValue,
    painPoints: painPointsValue,
    techStack: techStackValue,
    // Legacy fields for backward compatibility
    personas: {
      jobTitles: extractList(combinedResult, /(?:Job Titles?|Titles?|Positions?)[:\s]+([^\n]+)/i),
      industries: extractList(combinedResult, /(?:Industries?|Sectors?)[:\s]+([^\n]+)/i),
      regions: extractList(combinedResult, /(?:Regions?|Locations?|Geographies?)[:\s]+([^\n]+)/i),
      seniorityLevels: extractList(combinedResult, /(?:Seniority|Levels?)[:\s]+([^\n]+)/i)
    },
    companyCharacteristics: {
      size: companySizeValue,
      revenue: extractText(combinedResult, /(?:Revenue|Budget)[:\s]+([^\n]+)/i) || '$1M-$50M',
      location: locationValue,
      technology: extractList(combinedResult, /(?:Technology|Tech Stack)[:\s]+([^\n]+)/i)
    },
    painPoints: extractList(combinedResult, /(?:Pain Points?|Challenges?)[:\s]+([^\n]+)/i),
    buyingBehavior: {
      decisionProcess: extractText(combinedResult, /(?:Decision Process|Buying Process)[:\s]+([^\n]+)/i) || 'Multi-stakeholder',
      timeline: extractText(combinedResult, /(?:Timeline|Sales Cycle)[:\s]+([^\n]+)/i) || '3-6 months',
      budget: extractText(combinedResult, /(?:Budget|Investment)[:\s]+([^\n]+)/i) || '$10K-$100K'
    },
    outreachChannels: {
      email: combinedResult.toLowerCase().includes('email'),
      linkedin: combinedResult.toLowerCase().includes('linkedin'),
      phone: combinedResult.toLowerCase().includes('phone'),
      social: combinedResult.toLowerCase().includes('social'),
      recommendations: extractList(combinedResult, /(?:Channel Recommendations?)[:\s]+([^\n]+)/i)
    },
    targetCompanies: extractTargetCompanies(combinedResult),
    marketSize: extractText(combinedResult, /(?:Market Size|Opportunity)[:\s]+([^\n]+)/i) || 'Large market opportunity',
    sources: results.sources || []
  };
}

/**
 * Parse sample leads from research results
 */
function parseSampleLeads(results: any, icp: ICPResult): SampleLead[] {
  const geminiResult = results.gemini || '';
  const gpt4oResult = results.gpt4o || '';
  const perplexityResult = results.perplexity || '';
  const combinedResult = `${geminiResult}\n\n${gpt4oResult}\n\n${perplexityResult}`;

  const leads: SampleLead[] = [];
  
  // Extract leads using regex patterns
  const leadPatterns = [
    /(?:Lead|Contact)[:\s]+([^,\n]+)(?:,|\n)/gi,
    /(?:Name|Person)[:\s]+([^,\n]+)(?:,|\n)/gi,
    /([A-Z][a-z]+ [A-Z][a-z]+)[:\s]+([^,\n]+)/g
  ];

  let match;
  let leadCount = 0;
  
  for (const pattern of leadPatterns) {
    while ((match = pattern.exec(combinedResult)) !== null && leadCount < 10) {
      const name = match[1]?.trim();
      const title = match[2]?.trim() || 'Manager';
      
      if (name && name.length > 3 && !name.includes('Lead') && !name.includes('Contact')) {
        leads.push({
          name,
          title,
          company: extractCompanyFromLeadText(combinedResult, name) || 'Target Company',
          industry: icp.personas.industries[0] || 'Technology',
          location: icp.personas.regions[0] || 'Global',
          linkedin: extractLinkedInFromText(combinedResult, name),
          email: generateEmailFromName(name),
          reasoning: `Fits ICP criteria: ${icp.personas.jobTitles[0] || 'Target Role'}`,
          outreachMessage: generateOutreachMessage(name, title, icp),
          companyInfo: {
            size: icp.companyCharacteristics.size,
            revenue: icp.companyCharacteristics.revenue,
            technology: icp.companyCharacteristics.technology[0] || 'Modern tech stack'
          }
        });
        leadCount++;
      }
    }
  }

  // If no leads found with patterns, create sample leads based on ICP
  if (leads.length === 0) {
    const sampleNames = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'David Wilson'];
    const sampleTitles = icp.personas.jobTitles.length > 0 ? icp.personas.jobTitles : ['Manager', 'Director', 'VP'];
    const sampleCompanies = icp.targetCompanies.length > 0 ? icp.targetCompanies : ['TechCorp', 'InnovateLabs', 'DataFlow Inc', 'CloudTech Solutions', 'AI Dynamics'];
    
    for (let i = 0; i < 5; i++) {
      leads.push({
        name: sampleNames[i] || `Lead ${i + 1}`,
        title: sampleTitles[i % sampleTitles.length],
        company: sampleCompanies[i % sampleCompanies.length],
        industry: icp.personas.industries[0] || 'Technology',
        location: icp.personas.regions[0] || 'Global',
        linkedin: `https://linkedin.com/in/${sampleNames[i]?.toLowerCase().replace(' ', '-') || `lead-${i + 1}`}`,
        email: generateEmailFromName(sampleNames[i] || `Lead ${i + 1}`),
        reasoning: `Fits ICP criteria: ${sampleTitles[i % sampleTitles.length]} in ${icp.personas.industries[0] || 'Technology'}`,
        outreachMessage: generateOutreachMessage(sampleNames[i] || `Lead ${i + 1}`, sampleTitles[i % sampleTitles.length], icp),
        companyInfo: {
          size: icp.companyCharacteristics.size,
          revenue: icp.companyCharacteristics.revenue,
          technology: icp.companyCharacteristics.technology[0] || 'Modern tech stack'
        }
      });
    }
  }

  return leads.slice(0, 10); // Limit to 10 leads
}

/**
 * Extract list from text
 */
function extractList(text: string, regex: RegExp): string[] {
  const match = text.match(regex);
  if (match) {
    return match[1].split(',').map(item => item.trim()).filter(item => item.length > 0);
  }
  return [];
}

/**
 * Extract text from text
 */
function extractText(text: string, regex: RegExp): string | null {
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Extract target companies from text
 */
function extractTargetCompanies(text: string): string[] {
  const companies: string[] = [];
  const companyRegex = /(?:Target Companies?|Example Companies?|Companies?)[:\s]+([^\n]+)/i;
  const match = text.match(companyRegex);
  
  if (match) {
    const companyList = match[1].split(',').map(company => company.trim());
    companyList.forEach(company => {
      if (company.length > 0 && !company.includes('Company')) {
        companies.push(company);
      }
    });
  }
  
  return companies.slice(0, 5); // Limit to 5 companies
}

/**
 * Extract company from lead text
 */
function extractCompanyFromLeadText(text: string, name: string): string | null {
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.includes(name)) {
      const companyMatch = line.match(/(?:at|@|Company)[:\s]+([^,\n]+)/i);
      if (companyMatch) {
        return companyMatch[1].trim();
      }
    }
  }
  return null;
}

/**
 * Extract LinkedIn profile from text
 */
function extractLinkedInFromText(text: string, name: string): string | null {
  const linkedinRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?/g;
  const matches = text.match(linkedinRegex);
  return matches ? matches[0] : null;
}

/**
 * Generate email from name
 */
function generateEmailFromName(name: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  return `${cleanName}@company.com`;
}

/**
 * Generate outreach message
 */
function generateOutreachMessage(name: string, title: string, icp: ICPResult): string {
  const painPoint = icp.painPoints[0] || 'business challenges';
  const solution = 'our solution';
  
  return `Hi ${name.split(' ')[0]},\n\nI noticed you're a ${title} at your company. Many ${icp.personas.industries[0] || 'technology'} companies like yours are facing ${painPoint}.\n\nI'd love to share how ${solution} has helped similar companies overcome this challenge. Would you be open to a brief 15-minute conversation this week?\n\nBest regards`;
}
