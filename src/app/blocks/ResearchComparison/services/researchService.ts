// Research service for handling API calls and data processing

import { 
  ResearchResults, 
  VisibleModels, 
  ResearchCategory, 
  DepthLevel, 
  CompanySize, 
  RevenueCategory,
  BulkResearchResult 
} from '../types';
import { determinePerplexityModel, shouldUseWebSearch, formatBulkSalesOpportunitiesResults } from '../utils';
import { getAuthHeaders } from '../../../lib/auth';

export interface ResearchPayload {
  query: string;
  category: ResearchCategory;
  depth: DepthLevel;
  timeframe: string;
  geographic_scope: string;
  website_url: string | null;
  website_url_2: string | null;
  company_size: CompanySize;
  revenue_category: RevenueCategory;
  focus_on_leads: boolean;
  web_search_enabled: boolean;
  excel_data: string[] | null;
  excel_file_name: string | null;
  deep_research: boolean;
  include_founders: boolean;
  include_products: boolean;
  analyze_sales_opportunities: boolean;
  include_tabular_data: boolean;
  extract_company_info: boolean;
  analyze_prospective_clients: boolean;
  include_employee_count: boolean;
  include_revenue_data: boolean;
  include_complete_urls: boolean;
  perplexity_model: string;
  selected_models: VisibleModels;
  using_web_search: boolean;
  config_summary: string;
  analysis_type?: 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused';
  multi_gpt_output_format?: 'tableOnly' | 'withContext';
}

export class ResearchService {
  // Handle incremental bulk research with progress callbacks
  static async handleIncrementalBulkResearch(
    excelData: string[],
    startIndex: number,
    count: number,
    category: ResearchCategory,
    depth: DepthLevel,
    timeframe: string,
    geoScope: string,
    companySize: CompanySize,
    revenueCategory: RevenueCategory,
    visibleModels: VisibleModels,
    webSearchEnabled: boolean,
    determinePerplexityModel: (category: ResearchCategory, depth: DepthLevel, websiteUrl?: string) => string,
    userQuery: string,
    analysisType: 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused' = 'default',
    multiGPTOutputFormat: 'tableOnly' | 'withContext' = 'withContext',
    onCompanyComplete?: (index: number, website: string, result: { companyName: string; results?: ResearchResults; error?: string }) => void,
    cancellationRef?: { current: boolean }
  ): Promise<{ [website: string]: { companyName: string; results?: ResearchResults; error?: string } }> {
    const bulkResults: BulkResearchResult = {};
    const endIndex = Math.min(startIndex + count, excelData.length);

    console.log(`📦 ResearchService: Processing rows ${startIndex + 1}–${endIndex} of ${excelData.length}`);

    // Create AbortController for cancelling ongoing requests
    const abortController = new AbortController();

    // Process companies from startIndex to endIndex
    for (let i = startIndex; i < endIndex; i++) {
      // Check if cancelled before processing each company
      if (cancellationRef?.current) {
        console.log(`🛑 Research cancelled at company ${i + 1}/${excelData.length}`);
        abortController.abort();
        break;
      }
      
      const websiteEntry = excelData[i];
      const website = websiteEntry.split(' (')[0];
      let companyName = websiteEntry.includes(' (') ? websiteEntry.split(' (')[1].replace(')', '') : '';
      
      // If company name is not provided, extract it from the website URL
      if (!companyName || companyName.trim() === '') {
        companyName = this.extractCompanyNameFromUrl(website);
      }

      console.log(`🔍 Processing company ${i + 1}/${excelData.length}: ${website} (${companyName}) for ${category}`);

      // Create individual research query for this website
      // For multiGPTFocused mode, append company name to user query for context
      const individualQuery = analysisType === 'multiGPTFocused' 
        ? `${userQuery} for ${companyName}` 
        : this.createCategorySpecificQuery(category, companyName, website, userQuery);

      // Determine flags based on category - for general_research, exclude company-specific data
      const isGeneralResearch = category === 'general_research';
      const isSalesOpportunities = category === 'sales_opportunities';

      console.log(`🎨 Creating payload for ${companyName} with output format:`, {
        analysisType,
        multiGPTOutputFormat
      });

      // Prepare payload for individual website research
      const payload: ResearchPayload = {
        query: individualQuery,
        category: category,
        depth,
        timeframe,
        geographic_scope: geoScope,
        website_url: null,
        website_url_2: website,
        company_size: companySize,
        revenue_category: revenueCategory,
        focus_on_leads: isSalesOpportunities,
        web_search_enabled: webSearchEnabled,
        excel_data: null,
        excel_file_name: null,
        deep_research: true,
        include_founders: !isGeneralResearch,
        include_products: !isGeneralResearch,
        analyze_sales_opportunities: isSalesOpportunities,
        include_tabular_data: true,
        extract_company_info: !isGeneralResearch,
        analyze_prospective_clients: !isGeneralResearch,
        include_employee_count: !isGeneralResearch,
        include_revenue_data: !isGeneralResearch,
        include_complete_urls: true,
        perplexity_model: determinePerplexityModel(category, depth, website),
        selected_models: visibleModels,
        using_web_search: true,
        config_summary: `Bulk ${category.replace('_', ' ')} Research: Processing ${companyName} at ${website}`,
        analysis_type: analysisType,
        multi_gpt_output_format: multiGPTOutputFormat
      };

      try {
        const authHeaders = getAuthHeaders();
        if (!authHeaders || Object.keys(authHeaders).length === 0) {
          throw new Error('Authentication required. Please log in and try again.');
        }

        // Check cancellation before making API call
        if (cancellationRef?.current) {
          console.log(`🛑 Research cancelled before API call for ${website}`);
          break;
        }

        const res = await fetch('/api/multi-research-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify(payload),
          signal: abortController.signal // Add abort signal to allow cancellation
        });

        // Check cancellation after API call
        if (cancellationRef?.current) {
          console.log(`🛑 Research cancelled after API call for ${website}`);
          break;
        }

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`API error for ${website}:`, res.status, errorText);
          const errorResult = {
            error: `Failed to process ${website}: ${res.status} ${errorText}`,
            companyName: companyName
          };
          bulkResults[website] = errorResult;
          
          // Call progress callback
          if (onCompanyComplete) {
            onCompanyComplete(i, website, errorResult);
          }
        } else {
          const data = await res.json();
          console.log(`✅ Research completed for ${website}`);

          const result = {
            companyName: companyName,
            results: {
              gpt4o: data.gpt4o || (data.errors?.gpt4o ? `Error: ${data.errors.gpt4o}` : null),
              gemini: data.gemini || (data.errors?.gemini ? `Error: ${data.errors.gemini}` : null),
              perplexity: data.perplexity || (data.errors?.perplexity ? `Error: ${data.errors.perplexity}` : null),
              claude: data.claude || (data.errors?.claude ? `Error: ${data.errors.claude}` : null),
              llama: data.llama || (data.errors?.llama ? `Error: ${data.errors.llama}` : null),
              grok: data.grok || (data.errors?.grok ? `Error: ${data.errors.grok}` : null),
              deepseek: data.deepseek || (data.errors?.deepseek ? `Error: ${data.errors.deepseek}` : null),
              qwen3: data.qwen3 || (data.errors?.qwen3 ? `Error: ${data.errors.qwen3}` : null),
              mistralLarge: data.mistralLarge || (data.errors?.mistralLarge ? `Error: ${data.errors.mistralLarge}` : null),
            },
            processedAt: new Date().toISOString(),
            processingIndex: i
          };
          
          bulkResults[website] = result;

          // Call progress callback
          if (onCompanyComplete) {
            onCompanyComplete(i, website, result);
          }
        }

        // Add small delay between requests to avoid overwhelming the API
        if (i < endIndex - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (websiteError) {
        // Check if error is due to abort (cancellation)
        if ((websiteError as Error).name === 'AbortError') {
          console.log(`🛑 Research cancelled during fetch for ${website}`);
          break;
        }
        
        console.error(`Error processing ${website}:`, websiteError);
        const errorResult = {
          error: `Error processing ${website}: ${(websiteError as Error).message}`,
          companyName: companyName,
          processedAt: new Date().toISOString(),
          processingIndex: i
        };
        bulkResults[website] = errorResult;
        
        // Call progress callback even on error
        if (onCompanyComplete) {
          onCompanyComplete(i, website, errorResult);
        }
      }
    }

    return bulkResults;
  }

  // Handle bulk research for all categories
  static async handleBulkResearchForAllCategories(
    excelData: string[],
    category: ResearchCategory,
    depth: DepthLevel,
    timeframe: string,
    geoScope: string,
    companySize: CompanySize,
    revenueCategory: RevenueCategory,
    visibleModels: VisibleModels,
    webSearchEnabled: boolean,
    determinePerplexityModel: (category: ResearchCategory, depth: DepthLevel, websiteUrl?: string) => string
  ): Promise<ResearchResults> {
    const startTime = Date.now();
    const bulkResults: BulkResearchResult = {};
    const processedWebsites: string[] = [];

    // Process each website individually
    for (let i = 0; i < excelData.length; i++) {
      const websiteEntry = excelData[i];
      const website = websiteEntry.split(' (')[0]; // Extract URL from "url (company)" format
      let companyName = websiteEntry.includes(' (') ? websiteEntry.split(' (')[1].replace(')', '') : '';
      
      // If company name is not provided, extract it from the website URL
      if (!companyName || companyName.trim() === '') {
        companyName = this.extractCompanyNameFromUrl(website);
      }

      console.log(`🔍 Processing website ${i + 1}/${excelData.length}: ${website} (${companyName}) for ${category}`);

      // Create individual research query for this website based on category
      const individualQuery = this.createCategorySpecificQuery(category, companyName, website);

      // Prepare payload for individual website research
      const payload: ResearchPayload = {
        query: individualQuery,
        category: category,
        depth,
        timeframe,
        geographic_scope: geoScope,
        website_url: null, // User's main website (if any)
        website_url_2: website, // Each website from bulk upload as client website
        company_size: companySize,
        revenue_category: revenueCategory,
        focus_on_leads: category === 'sales_opportunities',
        web_search_enabled: webSearchEnabled,
        excel_data: null,
        excel_file_name: null,
        deep_research: true,
        include_founders: true,
        include_products: true,
        analyze_sales_opportunities: category === 'sales_opportunities',
        include_tabular_data: true,
        extract_company_info: true,
        analyze_prospective_clients: true,
        include_employee_count: true,
        include_revenue_data: true,
        include_complete_urls: true,
        perplexity_model: determinePerplexityModel(category, depth, website),
        selected_models: visibleModels,
        using_web_search: true,
        config_summary: `Bulk ${category.replace('_', ' ')} Research: Processing ${companyName} at ${website}`
      };

                             try {
         const authHeaders = getAuthHeaders();
         console.log('🔐 Bulk research (all categories) auth headers:', authHeaders);
         if (!authHeaders || Object.keys(authHeaders).length === 0) {
           console.error('❌ No auth headers found! Token might be missing or expired.');
           throw new Error('Authentication required. Please log in and try again.');
         }
         
         const res = await fetch('/api/multi-research-ai', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             ...authHeaders
           },
           body: JSON.stringify(payload),
         });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`API error for ${website}:`, res.status, errorText);
          bulkResults[website] = {
            error: `Failed to process ${website}: ${res.status} ${errorText}`,
            companyName: companyName
          };
        } else {
          const data = await res.json();
          console.log(`✅ Research completed for ${website}`);

          // Store results with website as key
          bulkResults[website] = {
            companyName: companyName,
            results: {
              gpt4o: data.gpt4o || (data.errors?.gpt4o ? `Error: ${data.errors.gpt4o}` : "No response from GPT-4O"),
              gemini: data.gemini || (data.errors?.gemini ? `Error: ${data.errors.gemini}` : "No response from PSAGPT"),
              perplexity: data.perplexity || (data.errors?.perplexity ? `Error: ${data.errors.perplexity}` : "No response from Perplexity"),
              claude: data.claude || (data.errors?.claude ? `Error: ${data.errors.claude}` : "No response from Claude"),
              llama: data.llama || (data.errors?.llama ? `Error: ${data.errors.llama}` : "No response from Llama 3"),
              grok: data.grok || (data.errors?.grok ? `Error: ${data.errors.grok}` : "No response from Grok"),
              deepseek: data.deepseek || (data.errors?.deepseek ? `Error: ${data.errors.deepseek}` : "No response from DeepSeek"),
              qwen3: data.qwen3 || (data.errors?.qwen3 ? `Error: ${data.errors.qwen3}` : "No response from Qwen 3"),
              mistralLarge: data.mistralLarge || (data.errors?.mistralLarge ? `Error: ${data.errors.mistralLarge}` : "No response from Mistral Large"),
            }
          };
        }

        processedWebsites.push(website);

        // Add small delay between requests to avoid overwhelming the API
        if (i < excelData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (websiteError) {
        console.error(`Error processing ${website}:`, websiteError);
        bulkResults[website] = {
          error: `Error processing ${website}: ${(websiteError as Error).message}`,
          companyName: companyName
        };
      }
    }

    // Aggregate and format the bulk results
    const aggregatedResults = formatBulkSalesOpportunitiesResults(bulkResults, processedWebsites);

    return {
      gpt4o: aggregatedResults.gpt4o,
      gemini: aggregatedResults.gemini,
      perplexity: aggregatedResults.perplexity,
      claude: aggregatedResults.claude,
      llama: aggregatedResults.llama,
      grok: aggregatedResults.grok,
      deepseek: aggregatedResults.deepseek || null,
      qwen3: aggregatedResults.qwen3 || null,
      mistralLarge: aggregatedResults.mistralLarge || null,
    };
  }

  // Helper method to extract company name from website URL
  private static extractCompanyNameFromUrl(url: string): string {
    try {
      // Remove protocol and www
      let domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '');
      
      // Extract domain name (remove path, query params, etc.)
      domain = domain.split('/')[0].split('?')[0];
      
      // Extract the main domain part (e.g., "example" from "example.com")
      const parts = domain.split('.');
      
      // If it's a standard domain like "example.com", take the first part
      if (parts.length >= 2) {
        const mainPart = parts[0];
        // Capitalize first letter and format nicely
        return mainPart.charAt(0).toUpperCase() + mainPart.slice(1).replace(/[-_]/g, ' ');
      }
      
      // Fallback to the domain itself
      return domain;
    } catch (error) {
      console.error('Error extracting company name from URL:', error);
      // Fallback: try to get something meaningful from the URL
      const parts = url.split('/');
      if (parts.length > 2) {
        const domain = parts[2]?.replace(/^www\./, '').split('.')[0] || '';
        return domain.charAt(0).toUpperCase() + domain.slice(1);
      }
      return 'Company';
    }
  }

  // Helper method to create category-specific queries
  private static createCategorySpecificQuery(category: ResearchCategory, companyName: string, website: string, userQuery?: string): string {
    const baseQuery = `Research for ${companyName || 'the company'} at ${website}`;
    
    switch (category) {
      case 'general_research':
        // For general research, use the user's query if provided
        if (userQuery && userQuery.trim()) {
          return `${userQuery.trim()} for ${companyName || 'the company'} at ${website}`;
        }
        return `Research ${baseQuery}`;
      case 'market_analysis':
        return `Conduct market analysis for ${baseQuery}`;
      case 'sales_opportunities':
        return `Find sales opportunities and business prospects for ${baseQuery}`;
      case 'competitive_intelligence':
        return `Provide competitive intelligence for ${baseQuery}`;
      case 'industry_insights':
        return `Generate industry insights for ${baseQuery}`;
      case 'company_deep_research':
        return `Conduct deep research on ${baseQuery}`;
      default:
        return `Research ${baseQuery}`;
    }
  }

  // Handle bulk sales opportunities research for multiple websites
  static async handleBulkSalesOpportunitiesResearch(
    excelData: string[],
    category: ResearchCategory,
    depth: DepthLevel,
    timeframe: string,
    geoScope: string,
    companySize: CompanySize,
    revenueCategory: RevenueCategory,
    visibleModels: VisibleModels,
    webSearchEnabled: boolean,
    determinePerplexityModel: (category: ResearchCategory, depth: DepthLevel, websiteUrl?: string) => string
  ): Promise<ResearchResults> {
    const startTime = Date.now();
    const bulkResults: BulkResearchResult = {};
    const processedWebsites: string[] = [];

    // Process each website individually
    for (let i = 0; i < excelData.length; i++) {
      const websiteEntry = excelData[i];
      const website = websiteEntry.split(' (')[0]; // Extract URL from "url (company)" format
      let companyName = websiteEntry.includes(' (') ? websiteEntry.split(' (')[1].replace(')', '') : '';
      
      // If company name is not provided, extract it from the website URL
      if (!companyName || companyName.trim() === '') {
        companyName = this.extractCompanyNameFromUrl(website);
      }

      console.log(`🔍 Processing website ${i + 1}/${excelData.length}: ${website} (${companyName})`);

      // Create individual research query for this website
      const individualQuery = companyName
        ? `Find sales opportunities and business prospects for ${companyName} at ${website}`
        : `Find sales opportunities and business prospects for the company at ${website}`;

      // Prepare payload for individual website research
      const payload: ResearchPayload = {
        query: individualQuery,
        category: 'sales_opportunities',
        depth,
        timeframe,
        geographic_scope: geoScope,
        website_url: website,
        website_url_2: null,
        company_size: companySize,
        revenue_category: revenueCategory,
        focus_on_leads: category === 'sales_opportunities',
        web_search_enabled: webSearchEnabled,
        excel_data: null,
        excel_file_name: null,
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
        perplexity_model: determinePerplexityModel('sales_opportunities', depth, website),
        selected_models: visibleModels,
        using_web_search: true,
        config_summary: `Bulk Sales Opportunities Research: Processing ${companyName} at ${website}`
      };

             try {
         const authHeaders = getAuthHeaders();
         console.log('🔐 Bulk research auth headers:', authHeaders);
         const res = await fetch('/api/multi-research-ai', {
           method: 'POST',
           headers: { 
             'Content-Type': 'application/json',
             ...authHeaders
           },
           body: JSON.stringify(payload),
         });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`API error for ${website}:`, res.status, errorText);
          bulkResults[website] = {
            error: `Failed to process ${website}: ${res.status} ${errorText}`,
            companyName: companyName
          };
        } else {
          const data = await res.json();
          console.log(`✅ Research completed for ${website}`);

          // Store results with website as key
          bulkResults[website] = {
            companyName: companyName,
            results: {
              gpt4o: data.gpt4o || (data.errors?.gpt4o ? `Error: ${data.errors.gpt4o}` : "No response from GPT-4O"),
              gemini: data.gemini || (data.errors?.gemini ? `Error: ${data.errors.gemini}` : "No response from PSAGPT"),
              perplexity: data.perplexity || (data.errors?.perplexity ? `Error: ${data.errors.perplexity}` : "No response from Perplexity"),
              claude: data.claude || (data.errors?.claude ? `Error: ${data.errors.claude}` : "No response from Claude"),
              llama: data.llama || (data.errors?.llama ? `Error: ${data.errors.llama}` : "No response from Llama 3"),
              grok: data.grok || (data.errors?.grok ? `Error: ${data.errors.grok}` : "No response from Grok"),
              deepseek: data.deepseek || (data.errors?.deepseek ? `Error: ${data.errors.deepseek}` : "No response from DeepSeek"),
              qwen3: data.qwen3 || (data.errors?.qwen3 ? `Error: ${data.errors.qwen3}` : "No response from Qwen 3"),
              mistralLarge: data.mistralLarge || (data.errors?.mistralLarge ? `Error: ${data.errors.mistralLarge}` : "No response from Mistral Large"),
            }
          };
        }

        processedWebsites.push(website);

        // Add small delay between requests to avoid overwhelming the API
        if (i < excelData.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (websiteError) {
        console.error(`Error processing ${website}:`, websiteError);
        bulkResults[website] = {
          error: `Error processing ${website}: ${(websiteError as Error).message}`,
          companyName: companyName
        };
      }
    }

    // Aggregate and format the bulk results
    const aggregatedResults = formatBulkSalesOpportunitiesResults(bulkResults, processedWebsites);

    return {
      gpt4o: aggregatedResults.gpt4o,
      gemini: aggregatedResults.gemini,
      perplexity: aggregatedResults.perplexity,
      claude: aggregatedResults.claude,
      llama: aggregatedResults.llama,
      grok: aggregatedResults.grok,
      deepseek: aggregatedResults.deepseek || null,
      qwen3: aggregatedResults.qwen3 || null,
      mistralLarge: aggregatedResults.mistralLarge || null,
    };
  }

  // Handle single research request
  static async handleSingleResearch(
    query: string,
    category: ResearchCategory,
    depth: DepthLevel,
    timeframe: string,
    geoScope: string,
    websiteUrl: string,
    websiteUrl2: string,
    companySize: CompanySize,
    revenueCategory: RevenueCategory,
    focusOnLeads: boolean,
    webSearchEnabled: boolean,
    excelData: string[],
    uploadedFileName: string | null,
    visibleModels: VisibleModels,
    usingWebSearch: boolean,
    analysisType: 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused' = 'default'
  ): Promise<ResearchResults> {
    const selectedPerplexityModel = determinePerplexityModel(category, depth, websiteUrl);
    
    // Prepare enhanced request with deep research parameters
    const payload: ResearchPayload = { 
      query, 
      category, 
      depth, 
      timeframe, 
      geographic_scope: geoScope,
      website_url: websiteUrl || null,
      website_url_2: websiteUrl2 || null,
      company_size: companySize,
      revenue_category: revenueCategory,
      focus_on_leads: focusOnLeads,
      web_search_enabled: webSearchEnabled,
      excel_data: excelData.length > 0 ? excelData : null,
      excel_file_name: uploadedFileName || null,
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
      perplexity_model: selectedPerplexityModel,
      selected_models: visibleModels,
      using_web_search: usingWebSearch,
      config_summary: `Research Configuration: ${category.replace(/_/g, ' ')} analysis with ${depth} depth, ${timeframe} timeframe, ${geoScope} scope, company size: ${companySize}, revenue: ${revenueCategory}, leads focus: ${focusOnLeads ? 'enabled' : 'disabled'}, web search: ${webSearchEnabled ? 'enabled' : 'disabled'}`,
      analysis_type: analysisType
    };
    
                console.log("Sending enhanced research request:", payload);

      const authHeaders = getAuthHeaders();
      console.log('🔐 Single research auth headers:', authHeaders);
      if (!authHeaders || Object.keys(authHeaders).length === 0) {
        console.error('❌ No auth headers found! Token might be missing or expired.');
        throw new Error('Authentication required. Please log in and try again.');
      }
      
      const res = await fetch('/api/multi-research-ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(payload),
      });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error:", res.status, errorText);
      throw new Error(`Failed to fetch research results: ${res.status} ${errorText}`);
    }
    
    const data = await res.json();
    console.log("Research results received:", Object.keys(data));
    console.log("Full API response:", data);
    
    // Show more informative messages when no response
    const newResults: ResearchResults = {
      gpt4o: data.gpt4o || (data.errors?.gpt4o ? `Error: ${data.errors.gpt4o}` : "No response from GPT-4O"),
      gemini: data.gemini || (data.errors?.gemini ? `Error: ${data.errors.gemini}` : "No response from PSAGPT"),
      perplexity: data.perplexity || (data.errors?.perplexity ? `Error: ${data.errors.perplexity}` : "No response from Perplexity"),
      claude: data.claude || (data.errors?.claude ? `Error: ${data.errors.claude}` : "No response from Claude"),
      llama: data.llama || (data.errors?.llama ? `Error: ${data.errors.llama}` : "No response from Llama 3"),
      grok: data.grok || (data.errors?.grok ? `Error: ${data.errors.grok}` : "No response from Grok"),
      deepseek: data.deepseek || (data.errors?.deepseek ? `Error: ${data.errors.deepseek}` : "No response from DeepSeek"),
      qwen3: data.qwen3 || (data.errors?.qwen3 ? `Error: ${data.errors.qwen3}` : "No response from Qwen 3"),
      mistralLarge: data.mistralLarge || (data.errors?.mistralLarge ? `Error: ${data.errors.mistralLarge}` : "No response from Mistral Large"),
    };
    
    console.log("Processed results:", newResults);
    
    // Log any errors returned from the API (but don't display them to user)
    if (data.errors) {
      console.error("API returned errors:", data.errors);
    }
    
    return newResults;
  }
}
