// Utility functions for ResearchComparison component

import { ResearchCategory, DepthLevel, ResearchResults } from './types';

// Function to generate dynamic filename based on website input
export const generateFilename = (baseName: string, modelName: string, websiteUrl?: string, websiteUrl2?: string): string => {
  // Use websiteUrl2 (client website) if available, otherwise use websiteUrl, otherwise use default
  const website = websiteUrl2 || websiteUrl;
  
  if (website && website.trim() !== '') {
    // Clean the website URL to create a valid filename
    const cleanWebsite = website
      .replace(/^https?:\/\//, '') // Remove protocol
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
      .replace(/_{2,}/g, '_') // Replace multiple underscores with single
      .replace(/^_|_$/g, '') // Remove leading/trailing underscores
      .substring(0, 30); // Limit length
    
    return `Sales_Centri_${cleanWebsite}_${modelName}_${baseName}`;
  }
  
  // Fallback to original naming if no website is provided
  return `Sales_Centri_${modelName}_${baseName}`;
};

// Function to determine the appropriate Perplexity model based on research requirements
export const determinePerplexityModel = (
  category: ResearchCategory, 
  depth: DepthLevel, 
  websiteUrl?: string
): string => {
  // For comprehensive research, use the most powerful model
  if (depth === 'comprehensive') {
    return 'sonar-deep-research';
  }
  
  // For academic research, always use the research-focused model
  if (category === 'general_research') {
    return 'sonar-deep-research';
  }
  
  // For company deep research, financial analysis, general research, or when website URL is provided, use advanced model
  if (['company_deep_research', 'financial_analysis', 'founder_background', 'general_research'].includes(category) || 
      (websiteUrl && websiteUrl.trim() !== '')) {
    return 'sonar-deep-research';
  }
  
  // For intermediate depth research
  if (depth === 'intermediate') {
    return 'sonar-deep-research';
  }
  
  // For basic research
  if (depth === 'basic') {
    return 'sonar-deep-research';
  }
  
  // Default to standard model
  return 'sonar-deep-research';
};

// Function to check if web search should be enabled
export const shouldUseWebSearch = (
  webSearchEnabled: boolean,
  category: ResearchCategory,
  query: string,
  websiteUrl?: string,
  websiteUrl2?: string
): boolean => {
  const hasWebsite = websiteUrl && websiteUrl.trim() !== '';
  const hasClientWebsite = websiteUrl2 && websiteUrl2.trim() !== '';
  
  const categoryBasedSearch = webSearchEnabled && 
    (category === 'company_deep_research' ||
     category === 'competitive_intelligence' ||
     category === 'market_analysis' ||
     category === 'general_research' ||
     category === 'industry_insights' ||
     category === 'sales_opportunities' ||
     hasWebsite ||
     hasClientWebsite);

  const queryBasedSearch = query.toLowerCase().includes('search') ||
    query.toLowerCase().includes('find') ||
    query.toLowerCase().includes('research') ||
    query.toLowerCase().includes('analyze') ||
    query.toLowerCase().includes('compare') ||
    query.toLowerCase().includes('latest') ||
    query.toLowerCase().includes('current') ||
    query.toLowerCase().includes('recent');

  return categoryBasedSearch || queryBasedSearch;
};

// Function to format bulk sales opportunities results
export const formatBulkSalesOpportunitiesResults = (
  bulkResults: { [key: string]: any }, 
  processedWebsites: string[]
) => {
  const formattedResults = {
    gpt4o: '',
    gemini: '',
    perplexity: '',
    claude: '',
    llama: '',
    grok: '',
    deepseek: '',
    qwen3: '',
    mistralLarge: ''
  };

  // Create header for bulk results
  const header = `# Bulk Sales Opportunities Research Results\n\n**Total Websites Processed:** ${processedWebsites.length}\n**Research Focus:** Sales opportunities and business prospects\n\n`;

  // Process each model
  Object.keys(formattedResults).forEach(model => {
    let modelContent = header;
    let hasValidResults = false;

    processedWebsites.forEach(website => {
      const websiteData = bulkResults[website];
      if (websiteData && websiteData.results && websiteData.results[model] && 
          !websiteData.results[model].includes('Error:') && 
          !websiteData.results[model].includes('No response')) {
        hasValidResults = true;
        modelContent += `## ${websiteData.companyName} (${website})\n\n${websiteData.results[model]}\n\n---\n\n`;
      } else if (websiteData && websiteData.error) {
        modelContent += `## ${websiteData.companyName} (${website})\n\n**Error:** ${websiteData.error}\n\n---\n\n`;
      }
    });

    if (hasValidResults) {
      modelContent += `\n**Analysis Summary:**\n- Processed ${processedWebsites.length} websites for sales opportunities\n- Each website was analyzed individually for business prospects and potential deals\n- Results include company analysis, market positioning, and sales opportunity identification\n`;
    }

    formattedResults[model as keyof typeof formattedResults] = modelContent;
  });

  return formattedResults;
};

// Function to aggregate bulk results for display (backward compatibility)
export const aggregateBulkResultsForDisplay = (
  bulkResults: { [key: string]: { companyName: string; results?: ResearchResults; error?: string; processedAt?: string; processingIndex?: number } }
): ResearchResults => {
  const aggregatedResults: ResearchResults = {
    gpt4o: '',
    gemini: '',
    perplexity: '',
    claude: '',
    llama: '',
    grok: '',
    deepseek: '',
    qwen3: '',
    mistralLarge: ''
  };

  // Get sorted websites by processing index
  const websites = Object.keys(bulkResults).sort((a, b) => {
    const indexA = bulkResults[a].processingIndex ?? 0;
    const indexB = bulkResults[b].processingIndex ?? 0;
    return indexA - indexB;
  });

  // Create header
  const header = `# Bulk Research Results\n\n**Total Companies Processed:** ${websites.length}\n\n`;

  // Process each model
  Object.keys(aggregatedResults).forEach(model => {
    let modelContent = header;
    let hasValidResults = false;

    websites.forEach(website => {
      const websiteData = bulkResults[website];
      if (websiteData) {
        if (websiteData.error) {
          modelContent += `## ${websiteData.companyName} (${website})\n\n**Error:** ${websiteData.error}\n\n---\n\n`;
        } else if (websiteData.results && websiteData.results[model as keyof ResearchResults]) {
          const result = websiteData.results[model as keyof ResearchResults];
          if (result && !result.includes('Error:') && !result.includes('No response')) {
            hasValidResults = true;
            modelContent += `## ${websiteData.companyName} (${website})\n\n${result}\n\n---\n\n`;
          }
        }
      }
    });

    if (hasValidResults) {
      modelContent += `\n**Analysis Summary:**\n- Processed ${websites.length} companies\n- Each company was analyzed individually\n- Results include comprehensive research analysis\n`;
    }

    aggregatedResults[model as keyof ResearchResults] = modelContent || null;
  });

  return aggregatedResults;
};

// Function to create configuration name
export const createConfigurationName = (category: ResearchCategory, depth: DepthLevel): string => {
  const timestamp = typeof window !== 'undefined' ? new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) : 'Unknown';
  
  const categoryName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const depthText = depth.charAt(0).toUpperCase() + depth.slice(1);
  
  return `${categoryName} (${depthText}) - ${timestamp}`;
};
