// Bulk research operations for handling multiple companies/websites

import { ResearchRequest, ResearchResponse } from './types';
import { getResearchModel } from '../modelMapping';

export async function generateBulkResearchForAllCategories(request: ResearchRequest): Promise<ResearchResponse> {
  console.log('📊 UNIVERSAL BULK RESEARCH: Processing bulk research for category:', request.category);
  
  const results: ResearchResponse = {
    gpt4o: null,
    gemini: null,
    perplexity: null,
    claude: null,
    llama: null,
    grok: null,
    deepseek: null
  };

  // Process each website in the bulk upload
  const websites = request.excel_data || [];
  console.log(`📋 Processing ${websites.length} websites for ${request.category} research`);

  // Generate research for each selected model
  const modelPromises = [];
  
  if (request.selected_models?.gpt4o) {
    modelPromises.push(
      generateBulkResearchForModel(request, websites, 'gpt4o')
        .then(result => { results.gpt4o = result; })
        .catch(error => { 
          console.error('GPT-4O bulk research error:', error);
          results.gpt4o = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.gemini) {
    modelPromises.push(
      generateBulkResearchForModel(request, websites, 'gemini')
        .then(result => { results.gemini = result; })
        .catch(error => { 
          console.error('Gemini bulk research error:', error);
          results.gemini = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.perplexity) {
    modelPromises.push(
      generateBulkResearchForModel(request, websites, 'perplexity')
        .then(result => { results.perplexity = result; })
        .catch(error => { 
          console.error('Perplexity bulk research error:', error);
          results.perplexity = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.claude) {
    modelPromises.push(
      generateBulkResearchForModel(request, websites, 'claude')
        .then(result => { results.claude = result; })
        .catch(error => { 
          console.error('Claude bulk research error:', error);
          results.claude = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.llama) {
    modelPromises.push(
      generateBulkResearchForModel(request, websites, 'llama')
        .then(result => { results.llama = result; })
        .catch(error => { 
          console.error('Llama bulk research error:', error);
          results.llama = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.grok) {
    modelPromises.push(
      generateBulkResearchForModel(request, websites, 'grok')
        .then(result => { results.grok = result; })
        .catch(error => { 
          console.error('Grok bulk research error:', error);
          results.grok = `Error: ${error.message}`;
        })
    );
  }

  // Wait for all models to complete
  await Promise.all(modelPromises);
  
  console.log('✅ UNIVERSAL BULK RESEARCH: Research completed for all websites');
  return results;
}

export async function generateBulkResearchForModel(
  request: ResearchRequest, 
  websites: any[], 
  model: 'gpt4o' | 'gemini' | 'perplexity' | 'claude' | 'llama' | 'grok'
): Promise<string> {
  console.log(`🎯 Generating bulk research for ${websites.length} websites using ${model} for category: ${request.category}`);
  
  // Parse website data
  const websiteData = websites.map(entry => {
    const website = entry.split(' (')[0];
    const companyName = entry.includes(' (') ? entry.split(' (')[1].replace(')', '') : '';
    return { website, companyName: companyName || 'Unknown Company' };
  });

  // Create category-specific prompt
  const categoryPrompts = {
    market_analysis: `You are a Market Analysis Specialist. Conduct market analysis for the user's query across multiple specific websites.`,
    sales_opportunities: `You are a Sales Lead Generation Specialist. Find sales opportunities for the user's query targeting specific websites.`,
    competitive_intelligence: `You are a Competitive Intelligence Specialist. Provide competitive intelligence for the user's query by analyzing specific websites.`,
    industry_insights: `You are an Industry Insights Specialist. Generate industry insights for the user's query focusing on specific websites.`,
    company_deep_research: `You are a Company Research Specialist. Conduct deep research on the user's query for specific websites.`
  };

  const specialistRole = categoryPrompts[request.category as keyof typeof categoryPrompts] || categoryPrompts.company_deep_research;

  // Create comprehensive prompt for bulk research
  const bulkResearchPrompt = `${specialistRole}

📊 BULK RESEARCH DATA (${websiteData.length} websites from "${request.excel_file_name}"):
${websiteData.slice(0, 20).map((site, index) => 
  `${index + 1}. ${site.website} (${site.companyName})`
).join('\n')}${websiteData.length > 20 ? `\n... and ${websiteData.length - 20} more websites` : ''}

🎯 TASK: Research each specific website for the user's query: "${request.query}"

RESEARCH REQUIREMENTS:
- Research each EXACT website provided in the bulk upload
- Apply the user's query to each specific website
- Provide detailed analysis for each website
- Include website-specific insights and findings
- Focus on the exact websites, not similar companies

OUTPUT FORMAT - STANDARDIZED TABLES:
For EACH website in the bulk upload, create a dedicated section with STANDARDIZED table format:

# ${request.category.replace('_', ' ').toUpperCase()} Research Results

## **WEBSITE 1: [Website URL]**
### **Research Analysis for [Company Name]**

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| [Company 1] | [URL] | [Industry] | [Sub-Industry] | [Product Line] | [Use Case] | [Size] | [Revenue] | [Location] | [Name] | [Title] | [Pain Points] | [Strategy] |

## **WEBSITE 2: [Next Website URL]**
### **Research Analysis for [Company Name]**

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| [Company 2] | [URL] | [Industry] | [Sub-Industry] | [Product Line] | [Use Case] | [Size] | [Revenue] | [Location] | [Name] | [Title] | [Pain Points] | [Strategy] |

[Continue for all websites with same 13-column format...]

STANDARDIZED COLUMN SPECIFICATIONS (13 COLUMNS TOTAL):
- Company Name: Real company name
- Website: Full URL (must be active, professional website)
- Industry: Specific industry sector
- Sub-Industry: Detailed industry subcategory
- Product Line: Main products or services offered
- Use Case: How they would use your solution
- Employees: Company size range
- Revenue: Revenue category
- Location: Geographic location
- Key Decision Maker: First name + ***** (for privacy)
- Designation: Job title (e.g., VP Sales, CMO, CEO)
- Pain Points: Specific pain points they face
- Approach Strategy: Recommended sales approach

RESEARCH FOCUS:
- User Query: "${request.query}"
- Research Category: ${request.category.replace('_', ' ').toUpperCase()}
- Target Websites: Each specific website from bulk upload
- Analysis Depth: ${request.depth.toUpperCase()}
- Geographic Scope: ${request.geographic_scope}
- Timeframe: ${request.timeframe}

MANDATORY: Research EVERY website in the bulk upload. Do NOT skip any websites. Each website should have its own dedicated section with detailed analysis.`;

  // Call the appropriate model
  try {
    if (model === 'gpt4o') {
      // Use enhanced GPT-4o with web search for bulk research
      const { callEnhancedGPT4o } = await import('../enhancedGPT4o');
      const result = await callEnhancedGPT4o(bulkResearchPrompt, specialistRole, 10, request);
      return result;
    } else {
      // For other models, we need to call the appropriate API function
      // This is a simplified approach - in a real implementation, you'd have specific handlers
      const modelName = getResearchModel(model as any, 'standard');
      console.log(`Using model: ${modelName} for ${model}`);
      // For now, return a placeholder - you'd implement the actual API calls here
      return `Research results for ${model} using ${modelName}`;
    }
  } catch (error) {
    console.error(`Error generating bulk research with ${model}:`, error);
    throw error;
  }
}

export async function generateLeadsForBulkUpload(request: ResearchRequest): Promise<ResearchResponse> {
  console.log('📊 BULK UPLOAD: Processing leads for each company in bulk upload');
  
  const results: ResearchResponse = {
    gpt4o: null,
    gemini: null,
    perplexity: null,
    claude: null,
    llama: null,
    grok: null,
    deepseek: null
  };

  // Process each company in the bulk upload
  const companies = request.excel_data || [];
  console.log(`📋 Processing ${companies.length} companies from bulk upload`);
  
  // Generate leads for each selected model
  const modelPromises = [];
  
  if (request.selected_models?.gpt4o) {
    modelPromises.push(
      generateBulkLeadsForModel(request, companies, 'gpt4o')
        .then(result => { results.gpt4o = result; })
        .catch(error => { 
          console.error('GPT-4O bulk error:', error);
          results.gpt4o = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.gemini) {
    modelPromises.push(
      generateBulkLeadsForModel(request, companies, 'gemini')
        .then(result => { results.gemini = result; })
        .catch(error => { 
          console.error('Gemini bulk error:', error);
          results.gemini = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.perplexity) {
    modelPromises.push(
      generateBulkLeadsForModel(request, companies, 'perplexity')
        .then(result => { results.perplexity = result; })
        .catch(error => { 
          console.error('Perplexity bulk error:', error);
          results.perplexity = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.claude) {
    modelPromises.push(
      generateBulkLeadsForModel(request, companies, 'claude')
        .then(result => { results.claude = result; })
        .catch(error => { 
          console.error('Claude bulk error:', error);
          results.claude = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.llama) {
    modelPromises.push(
      generateBulkLeadsForModel(request, companies, 'llama')
        .then(result => { results.llama = result; })
        .catch(error => { 
          console.error('Llama bulk error:', error);
          results.llama = `Error: ${error.message}`;
        })
    );
  }
  
  if (request.selected_models?.grok) {
    modelPromises.push(
      generateBulkLeadsForModel(request, companies, 'grok')
        .then(result => { results.grok = result; })
        .catch(error => { 
          console.error('Grok bulk error:', error);
          results.grok = `Error: ${error.message}`;
        })
    );
  }

  // Wait for all models to complete
  await Promise.all(modelPromises);
  
  console.log('✅ BULK UPLOAD: Lead generation completed for all companies');
  return results;
}

export async function generateBulkLeadsForModel(
  request: ResearchRequest, 
  companies: any[], 
  model: 'gpt4o' | 'gemini' | 'perplexity' | 'claude' | 'llama' | 'grok'
): Promise<string> {
  console.log(`🎯 Generating bulk leads for ${companies.length} companies using ${model}`);
  
  // Create a comprehensive prompt for bulk lead generation
  const bulkLeadPrompt = `You are a Sales Lead Generation Specialist. You have been provided with a list of companies from a bulk upload file.

📊 BULK UPLOAD DATA (${companies.length} companies from "${request.excel_file_name}"):
${companies.slice(0, 20).map((company, index) => 
  `${index + 1}. ${typeof company === 'string' ? company : JSON.stringify(company)}`
).join('\n')}${companies.length > 20 ? `\n... and ${companies.length - 20} more companies` : ''}

🎯 TASK: Generate REAL, VALID sales leads for EACH company in the bulk upload above.

REQUIREMENTS FOR EACH COMPANY:
1. Analyze each company's industry, size, and business model
2. Generate 3-5 high-quality leads that would be potential customers for that specific company
3. Find real, active businesses with verified websites
4. Include BANT qualification + lead scoring (1-10)
5. Focus on companies that would actually buy from each bulk upload company

WEBSITE VALIDATION REQUIREMENTS:
- ALL websites must be real, active business websites with actual content
- NO GoDaddy parked domains or placeholder pages
- NO generic domains like example.com, test.com, placeholder.com
- NO domains that redirect to hosting providers or domain registrars
- ONLY include companies with professional, operational websites
- Verify each website shows actual business content, not parked pages
- NO domains for sale or under construction

OUTPUT FORMAT - STANDARDIZED TABLES BY BULK UPLOAD COMPANY:
For EACH company in the bulk upload, create a dedicated section with STANDARDIZED table format:

# Sales Opportunities Analysis - Bulk Upload Results

## **COMPANY 1: [Company Name from Bulk Upload]**
### **Lead Prospects for [Company Name]**

| Company Name | Website | Industry | Sub-Industry | Product Line | Use Case | Employees | Revenue | Location | Key Decision Maker | Designation | Pain Points | Approach Strategy |
|--------------|---------|----------|--------------|--------------|----------|-----------|---------|----------|-------------------|-------------|-------------|-------------------|
| Lead Company 1 | https://realcompany1.com | Technology | Enterprise Software | CRM Solutions | Customer Management | 100-500 | $10M-50M | USA | John S***** | VP Sales | Growth challenges | Enterprise sales focus |

## **COMPANY 2: [Next Company Name from Bulk Upload]**
### **Lead Prospects for [Company Name]**

[Similar table format with 13 columns for each company]

STANDARDIZED COLUMN SPECIFICATIONS (13 COLUMNS TOTAL):
- Company Name: Real company name
- Website: Full URL (must be active, professional website)
- Industry: Specific industry sector
- Sub-Industry: Detailed industry subcategory
- Product Line: Main products or services offered
- Use Case: How they would use your solution
- Employees: Company size range
- Revenue: Revenue category
- Location: Geographic location
- Key Decision Maker: First name + ***** (for privacy)
- Designation: Job title (e.g., VP Sales, CMO, CEO)
- Pain Points: Specific pain points they face
- Approach Strategy: Recommended sales approach

UNIQUENESS REQUIREMENTS:
- Each lead must be scored for uniqueness (avoid common/obvious prospects)
- Target leads that align with your specific research perspective defined above
- Differentiate from generic leads that any AI would find
- Focus on the unique market segment defined in your research perspective at the top

MANDATORY: Generate leads for EVERY company in the bulk upload. Do NOT skip any companies. Each company should have its own dedicated section with 3-5 UNIQUE, real leads.`;

  // Call the appropriate model
  try {
    if (model === 'gpt4o') {
      // Use enhanced GPT-4o with web search for bulk upload
      const { callEnhancedGPT4o } = await import('../enhancedGPT4o');
      const result = await callEnhancedGPT4o(bulkLeadPrompt, 'You are a Sales Lead Generation Specialist providing high-quality sales opportunities for bulk upload companies.', 10, request);
      return result;
    } else {
      // For other models, we need to call the appropriate API function
      // This is a simplified approach - in a real implementation, you'd have specific handlers
      const modelName = getResearchModel(model as any, 'standard');
      console.log(`Using model: ${modelName} for ${model}`);
      // For now, return a placeholder - you'd implement the actual API calls here
      return `Lead generation results for ${model} using ${modelName}`;
    }
  } catch (error) {
    console.error(`Error generating bulk leads with ${model}:`, error);
    throw error;
  }
}

