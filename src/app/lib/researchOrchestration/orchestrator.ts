// Main research orchestration logic

import { 
  ResearchRequest, 
  ResearchResponse, 
  ResearchCategory 
} from './types';
import { 
  generateBulkResearchForAllCategories, 
  generateLeadsForBulkUpload 
} from './bulkResearch';
import { 
  generateLeadProfile, 
  generateLeadsWithProfile 
} from './leadGeneration';
import { 
  gpt4oCall, 
  geminiCall, 
  perplexityCall,
  groqCall
} from './modelCalls';
import {
  buildResearchConfig,
  buildSpecialFeatures,
  buildExcelContext,
  buildWebsiteContext,
  getDepthSuffix,
  buildSystemPrompts,
  buildModelPrompts
} from './prompts';
import { 
  validateAllApiKeys, 
  logValidationResults, 
  isChatGPTAvailable, 
  isGeminiAvailable, 
  isPerplexityAvailable,
  isGroqAvailable
} from '../apiKeyValidator';
import { logEnvironmentStatus } from '../envCheck';
import { companyVerificationPipeline } from '../companyVerification';
import { analyzeBusinessContext, createValuePropositionMappings } from '../businessContextAnalyzer';

export async function orchestrateResearch(request: ResearchRequest): Promise<ResearchResponse> {
  // Validate all API keys and log detailed results
  const validationSummary = validateAllApiKeys();
  logValidationResults(validationSummary);
  
  // Log environment status for debugging
  logEnvironmentStatus();
  
  // Log all configuration settings being sent to LLM models
  console.log('🔍 COMPREHENSIVE RESEARCH CONFIG SENT TO LLM MODELS:');
  console.log('📝 Basic Settings:', {
    query: request.query,
    category: request.category,
    depth: request.depth,
    timeframe: request.timeframe,
    geographic_scope: request.geographic_scope,
    company_size: request.company_size,
    revenue_category: request.revenue_category
  });
  console.log('🎯 Research Features:', {
    focus_on_leads: request.focus_on_leads,
    deep_research: request.deep_research,
    web_search_enabled: request.web_search_enabled,
    using_web_search: request.using_web_search
  });
  console.log('📊 Data Analysis Features:', {
    include_founders: request.include_founders,
    include_products: request.include_products,
    analyze_sales_opportunities: request.analyze_sales_opportunities,
    include_tabular_data: request.include_tabular_data,
    extract_company_info: request.extract_company_info,
    analyze_prospective_clients: request.analyze_prospective_clients,
    include_employee_count: request.include_employee_count,
    include_revenue_data: request.include_revenue_data,
    include_complete_urls: request.include_complete_urls
  });
  console.log('🌐 Website Context:', {
    website_url: request.website_url,
    website_url_2: request.website_url_2
  });
  console.log('🤖 Model Selection:', request.selected_models);
  console.log('📁 Excel Data:', {
    has_excel_data: !!request.excel_data?.length,
    excel_entries: request.excel_data?.length || 0,
    excel_file_name: request.excel_file_name
  });
  console.log('🎨 Output Format Settings:', {
    analysis_type: request.analysis_type,
    multi_gpt_output_format: request.multi_gpt_output_format
  });
  
  // Prepare enhanced query with ALL configuration context
  const configContext = request.config_summary || '';
  const excelContext = buildExcelContext(request);
  
  // Force web search for sales opportunities to ensure real data
  const forceWebSearchForLeads = request.category === 'sales_opportunities' || request.focus_on_leads;
  const webSearchContext = request.using_web_search || forceWebSearchForLeads
    ? '\n\nNote: Web search is enabled for enhanced real-time data verification.'
    : '';
  
  // Add website context to the query
  const websiteContext = buildWebsiteContext(request);

  // Check if bulk upload data is provided (for ALL categories)
  if (request.excel_data && request.excel_data.length > 0) {
    console.log('📊 BULK UPLOAD DETECTED: Processing bulk research for category:', request.category);
    return await generateBulkResearchForAllCategories(request);
  }

  // Two-step sales opportunities process
  if (request.category === 'sales_opportunities') {
    console.log('🚀 SALES OPPORTUNITIES: Starting two-step process');
    
    // Step 1: Generate ideal lead profile (internal)
    console.log('📋 STEP 1: Generating ideal lead profile...');
    const leadProfile = await generateLeadProfile(request);
    console.log('✅ Lead profile generated:', leadProfile.companyName);
    
    // Step 2: Generate leads using the profile for each selected model
    console.log('🎯 STEP 2: Generating 30-40 leads using lead profile...');
    
    const results: ResearchResponse = {
      gpt4o: null,
      gemini: null,
      perplexity: null,
      claude: null,
      llama: null,
      grok: null,
      deepseek: null
    };

    // Generate leads for each selected model
    const modelPromises = [];
    
    if (request.selected_models?.gpt4o) {
      modelPromises.push(
        generateLeadsWithProfile(request, leadProfile, 'gpt4o')
          .then(result => { results.gpt4o = result; })
          .catch(error => { 
            console.error('GPT-4O error:', error);
            results.gpt4o = `Error: ${error.message}`;
          })
      );
    }
    
    if (request.selected_models?.gemini) {
      modelPromises.push(
        generateLeadsWithProfile(request, leadProfile, 'gemini')
          .then(result => { results.gemini = result; })
          .catch(error => { 
            console.error('Gemini error:', error);
            results.gemini = `Error: ${error.message}`;
          })
      );
    }
    
    if (request.selected_models?.perplexity) {
      modelPromises.push(
        generateLeadsWithProfile(request, leadProfile, 'perplexity')
          .then(result => { results.perplexity = result; })
          .catch(error => { 
            console.error('Perplexity error:', error);
            results.perplexity = `Error: ${error.message}`;
          })
      );
    }
    
    if (request.selected_models?.claude) {
      modelPromises.push(
        generateLeadsWithProfile(request, leadProfile, 'claude')
          .then(result => { results.claude = result; })
          .catch(error => { 
            console.error('Claude error:', error);
            results.claude = `Error: ${error.message}`;
          })
      );
    }
    
    if (request.selected_models?.llama) {
      modelPromises.push(
        generateLeadsWithProfile(request, leadProfile, 'llama')
          .then(result => { results.llama = result; })
          .catch(error => { 
            console.error('Llama error:', error);
            results.llama = `Error: ${error.message}`;
          })
      );
    }
    
    if (request.selected_models?.grok) {
      modelPromises.push(
        generateLeadsWithProfile(request, leadProfile, 'grok')
          .then(result => { results.grok = result; })
          .catch(error => { 
            console.error('Grok error:', error);
            results.grok = `Error: ${error.message}`;
          })
      );
    }

    // Wait for all models to complete
    await Promise.all(modelPromises);
    
    console.log('✅ SALES OPPORTUNITIES: Two-step process completed');
    return results;
  }

  // Business context preprocessing for other categories
  let businessContext = null;
  let valuePropositionMappings = [];
  
  if (request.website_url) {
    try {
      console.log('🏢 BUSINESS CONTEXT: Analyzing company website for value propositions');
      businessContext = await analyzeBusinessContext(request.website_url);
      valuePropositionMappings = createValuePropositionMappings(businessContext);
      console.log(`✅ BUSINESS CONTEXT: Extracted ${businessContext.products.length} products and ${businessContext.valuePropositions.length} value propositions`);
    } catch (error) {
      console.error('Error analyzing business context:', error);
      console.log('⚠️ BUSINESS CONTEXT: Failed to analyze website, proceeding without context');
    }
  }

  const websiteInfo = websiteContext.length > 0 
    ? `\n\nWebsite Information:\n${websiteContext.join('\n')}`
    : '';
  
  // Build comprehensive research configuration context
  const researchConfig = buildResearchConfig(request);
  const specialFeatures = buildSpecialFeatures(request);
  
  if (specialFeatures.length > 0) {
    researchConfig.push(`Special Features: ${specialFeatures.join(', ')}`);
  }
  
  const comprehensiveConfig = `\n\nResearch Configuration:\n${researchConfig.join('\n')}`;
  const fullQuery = `${request.query}${configContext ? `\n\nUser Configuration: ${configContext}` : ''}${comprehensiveConfig}${excelContext}${webSearchContext}${websiteInfo}`;
  
  // Generate specialized prompts for each model with ALL configuration settings
  const { gpt4oPrompt, geminiPrompt, perplexityPrompt } = buildModelPrompts(
    request,
    fullQuery,
    websiteInfo,
    configContext,
    comprehensiveConfig,
    excelContext
  );

  // Depth adjustments for each model
  const depthSuffix = getDepthSuffix(request.depth);

  // System prompts for each model
  const { gpt4oSystemPrompt, geminiSystemPrompt, perplexitySystemPrompt } = buildSystemPrompts(
    request,
    forceWebSearchForLeads
  );

  // Track start time for performance metadata
  const startTime = Date.now();

  // Get selected models (default to all if not specified)
  const selectedModels = request.selected_models || { gpt4o: true, gemini: true, perplexity: true };
  
  // Log which models will be called
  const enabledModels = Object.entries(selectedModels)
    .filter(([_, enabled]) => enabled)
    .map(([model, _]) => model);
  console.log(`🚀 EXECUTING RESEARCH WITH MODELS: ${enabledModels.join(', ').toUpperCase()}`);
  console.log(`📋 Model Selection:`, selectedModels);

  // Create array of promises for only selected models
  const promises: Promise<string>[] = [];
  const modelOrder: string[] = [];

  if (selectedModels.gpt4o) {
    if (isChatGPTAvailable()) {
      console.log('✅ Adding GPT-4o to research execution (API key validated)');
      promises.push(gpt4oCall(gpt4oPrompt + "\n\n" + depthSuffix, gpt4oSystemPrompt, request));
      modelOrder.push('gpt4o');
    } else {
      console.log('⚠️  GPT-4o selected but API key invalid - will return configuration error');
      promises.push(Promise.resolve(`# ChatGPT/GPT-4O Configuration Required

## ⚠️ Real Data Unavailable

The OpenAI API key is not properly configured. To get real ChatGPT research data:

1. **Set your OpenAI API key** in the environment variables
2. **Ensure the key format** starts with 'sk-'
3. **Verify the key is complete** (no truncation or line breaks)
4. **Restart the application** after adding the key

**Current Status**: ChatGPT integration is disabled until the API key is properly configured.

**Note**: This message indicates a configuration issue, not a service error. Once configured, you'll receive real research data from ChatGPT.`));
      modelOrder.push('gpt4o');
    }
  } else {
    console.log('⏭️  Skipping GPT-4o (not selected)');
  }

  if (selectedModels.gemini) {
    if (isGeminiAvailable()) {
      console.log('✅ Adding Gemini to research execution (API key validated)');
      promises.push(geminiCall(geminiPrompt + "\n\n" + depthSuffix, geminiSystemPrompt, request));
      modelOrder.push('gemini');
    } else {
      console.log('⚠️  Gemini selected but API key invalid - will return configuration error');
      promises.push(Promise.resolve(`# Google Gemini Configuration Required

## ⚠️ Real Data Unavailable

The Google API key is not properly configured. To get real Gemini research data:

1. **Set your Google API key** (GOOGLE_API_KEY) in the environment variables
2. **Enable the Gemini API** in your Google Cloud Console
3. **Verify the key has sufficient quota** and permissions
4. **Restart the application** after adding the key

**Current Status**: Gemini integration is disabled until the API key is properly configured.

**Note**: This message indicates a configuration issue, not a service error. Once configured, you'll receive real research data from Gemini.`));
      modelOrder.push('gemini');
    }
  } else {
    console.log('⏭️  Skipping Gemini (not selected)');
  }

  if (selectedModels.perplexity) {
    if (isPerplexityAvailable()) {
      console.log('✅ Adding Perplexity to research execution (API key validated)');
      promises.push(perplexityCall(perplexityPrompt + "\n\n" + depthSuffix, perplexitySystemPrompt, request));
      modelOrder.push('perplexity');
    } else {
      console.log('⚠️  Perplexity selected but API key invalid - will return configuration error');
      promises.push(Promise.resolve(`# Perplexity Configuration Required

## ⚠️ Real Data Unavailable

The Perplexity API key is not properly configured. To get real Perplexity research data:

1. **Set your Perplexity API key** (PERPLEXITY_API_KEY) in the environment variables
2. **Ensure the key format** starts with 'pplx-'
3. **Verify the key has sufficient credits** and permissions
4. **Restart the application** after adding the key

**Current Status**: Perplexity integration is disabled until the API key is properly configured.

**Note**: This message indicates a configuration issue, not a service error. Once configured, you'll receive real research data from Perplexity.`));
      modelOrder.push('perplexity');
    }
  } else {
    console.log('⏭️  Skipping Perplexity (not selected)');
  }

  // Build Groq system prompt if selected
  const groqSystemPrompt = buildSystemPrompts(request, forceWebSearchForLeads).gpt4oSystemPrompt; // Use similar system prompt as GPT-4o
  const groqPrompt = buildModelPrompts(request, forceWebSearchForLeads).gpt4oPrompt; // Use similar model prompt

  if (selectedModels.groq) {
    if (isGroqAvailable()) {
      console.log('✅ Adding Groq (Llama/Mixtral) to research execution (API key validated)');
      promises.push(groqCall(groqPrompt + "\n\n" + depthSuffix, groqSystemPrompt, request));
      modelOrder.push('groq');
    } else {
      console.log('⚠️  Groq selected but API key invalid - will return configuration error');
      promises.push(Promise.resolve(`# Groq Configuration Required

## ⚠️ Real Data Unavailable

The Groq API key is not properly configured. To get real Groq research data:

1. **Set your Groq API key** (GROQ_API_KEY) in the environment variables
2. **Verify the API key is valid and active** from your Groq console
3. **Ensure you have sufficient API quota** for Llama/Mixtral models
4. **Restart the application** after adding the key

**Current Status**: Groq integration is disabled until the API key is properly configured.

**Note**: This message indicates a configuration issue, not a service error. Once configured, you'll receive real research data from Groq's fast Llama and Mixtral models.`));
      modelOrder.push('groq');
    }
  } else {
    console.log('⏭️  Skipping Groq (not selected)');
  }

  // Execute only selected research calls in parallel
  const results = await Promise.allSettled(promises);

  const processingTime = (Date.now() - startTime) / 1000; // seconds

  // Process errors and map results back to model names
  const errors: Record<string, string> = {};
  const finalResults: { gpt4o: string | null; gemini: string | null; perplexity: string | null; groq: string | null } = {
    gpt4o: null,
    gemini: null,
    perplexity: null,
    groq: null
  };

  // Map results back to their respective models
  results.forEach((result, index) => {
    const modelName = modelOrder[index];
    
    if (result.status === 'rejected') {
      const error = result.reason;
      errors[modelName] = error instanceof Error ? error.message : String(error);
    } else {
      finalResults[modelName as keyof typeof finalResults] = result.value;
    }
  });

  // Generate fallback responses for models that failed or weren't selected
  const getFallbackResponse = (modelName: string, category: ResearchCategory) => {
    if (!selectedModels[modelName.toLowerCase() as keyof typeof selectedModels]) {
      return null; // Return null for unselected models
    }
    
    return `# ${modelName} Research Response
    
## Notice
We encountered an error processing this request with ${modelName}. 
Please check the API keys and network connection, then try again.

## Error Details
${errors[modelName.toLowerCase()] || "Unknown error"}

## Category
${category.replace(/_/g, " ")}`;
  };

  // Background company verification (don't show in output)
  try {
    console.log('🔍 BACKGROUND VERIFICATION: Starting company verification...');
    
    // Combine all results for verification
    const allResults = Object.values(finalResults).filter(result => result && typeof result === 'string');
    
    if (allResults.length > 0) {
      const combinedResults = allResults.join('\n\n');
      const verificationResults = await companyVerificationPipeline.extractAndVerifyCompanies(combinedResults);
      const validCompanies = verificationResults.filter(result => result.isValid);
      
      console.log(`✅ BACKGROUND VERIFICATION: ${validCompanies.length} companies verified in background`);
      
      // Log verification details for debugging (not shown to user)
      verificationResults.forEach(result => {
        if (result.isValid) {
          console.log(`✅ VERIFIED: ${result.companyName} - ${result.verificationSource} (${Math.round(result.confidence * 100)}%)`);
        } else {
          console.log(`❌ INVALID: ${result.companyName} - ${result.reason}`);
        }
      });
    }
  } catch (error) {
    console.error('Background verification error:', error);
    // Don't fail the main request if verification fails
  }

  return {
    gpt4o: selectedModels.gpt4o ? 
           (finalResults.gpt4o || getFallbackResponse("GPT-4o", request.category)) : 
           null,
    
    gemini: selectedModels.gemini ? 
            (finalResults.gemini || getFallbackResponse("Gemini", request.category)) : 
            null,
    
    perplexity: selectedModels.perplexity ? 
                (finalResults.perplexity || getFallbackResponse("Perplexity", request.category)) : 
                null,
    
    groq: selectedModels.groq ? 
          (finalResults.groq || getFallbackResponse("Groq", request.category)) : 
          null,
    
    claude: null,
    llama: null,
    grok: null,
    deepseek: null,
    
    errors,
    metadata: {
      processing_time: processingTime,
      source_count: promises.length,
      confidence_score: 0.85
    }
  };
}

