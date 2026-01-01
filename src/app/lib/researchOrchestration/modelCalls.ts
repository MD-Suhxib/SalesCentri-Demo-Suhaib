// Individual AI model call functions

import { ResearchRequest, ResearchCategory } from './types';
import { runGemini } from '../../api/gemini/geminiHandler';
import { callPerplexityWithRetry } from '../perplexityApi';
import { getResearchModel } from '../modelMapping';
import { llmTracker } from '../llmTracker';
import { verifyWebsitesInText } from './websiteVerification';
import { callGroq } from '../groqApi';
import { processResearchResponse, logNameMaskingResults } from '../namesMasking';

export async function gpt4oCall(
  prompt: string, 
  systemPrompt: string, 
  request: ResearchRequest
): Promise<string> {
  const callStartTime = Date.now();
  console.log('🚀 GPT-4o Call Starting...');
  console.log('🎨 Output Format:', request.multi_gpt_output_format);
  console.log('🔑 Checking OpenAI API Key in orchestration:', {
    keyExists: !!process.env.OPENAI_API_KEY,
    keyLength: process.env.OPENAI_API_KEY?.length || 0,
    keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) || 'none'
  });
  
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ CRITICAL: OPENAI_API_KEY not found in orchestration");
      console.error("❌ This will prevent real data from being returned");
      console.error("❌ Please set OPENAI_API_KEY environment variable");
      throw new Error("OPENAI_API_KEY environment variable is not set - real data unavailable");
    }

    // Validate API key format
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.error("❌ CRITICAL: Invalid OpenAI API key format");
      console.error("❌ OpenAI API keys should start with 'sk-'");
      throw new Error("Invalid OpenAI API key format - real data unavailable");
    }

    console.log("✅ OpenAI API key found and validated, proceeding with enhanced GPT-4o call");

    // Import the enhanced GPT-4o with Tavily search integration
    const { callEnhancedGPT4o } = await import('../enhancedGPT4o');
    // Use the enhanced version that includes web search results with higher search depth
    const response = await callEnhancedGPT4o(prompt, systemPrompt, 15, request);
    
    console.log("✅ GPT-4o response received, length:", response?.length || 0);
    
    // 🔐 POST-PROCESS: Apply name masking to ensure GDPR compliance
    const { processedResponse, validation, wasModified } = processResearchResponse(response);
    logNameMaskingResults(request.category, 'gpt4o', validation, wasModified);
    
    // Track usage metrics
    const responseTime = Date.now() - callStartTime;
    const inputTokens = llmTracker.estimateTokens(prompt + systemPrompt);
    const outputTokens = llmTracker.estimateTokens(processedResponse);
    
    llmTracker.trackLLMUsage(
      'openai',
      'gpt-4o',
      'research_query',
      request.depth === 'basic' ? 'low' : request.depth === 'intermediate' ? 'medium' : 'high',
      inputTokens,
      outputTokens,
      responseTime,
      prompt,
      processedResponse,
      {
        userId: 'research-user',
        webSearchUsed: true // GPT-4O enhanced uses Tavily
      }
    );
    
    // For table-only mode, return raw response without headers
    if (request.analysis_type === 'multiGPTFocused' && request.multi_gpt_output_format === 'tableOnly') {
      console.log('📊 Table-only mode: Returning raw response without header');
      return processedResponse;
    }
    
    // Add ResearchGPT header to the response for other modes
    const formattedResponse = `# 🔍 ResearchGPT Analysis\n\n${processedResponse}`;
    return formattedResponse;
  } catch (error) {
    console.error("❌ GPT-4O API error in orchestration:", error);
    
    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error("❌ Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 500)
      });
    }
    
    // Instead of returning mock data, return an error message that explains the issue
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
      return `# ChatGPT/GPT-4O Configuration Error

## ⚠️ Real Data Unavailable

**Issue**: The OpenAI API key is not properly configured, preventing access to real ChatGPT data.

**Error Details**: ${errorMessage}

**Solution**: 
1. Ensure your OpenAI API key is properly set in the environment variables
2. Verify the API key format starts with 'sk-'
3. Check that the API key has sufficient credits and permissions

**Current Status**: Mock responses are disabled to ensure you know when real data is unavailable.

To get real research data from ChatGPT, please configure the OpenAI API key properly.`;
    }
    
    // For other errors, return a more informative error response
    return `# ChatGPT/GPT-4O Service Error

## ⚠️ Real Data Temporarily Unavailable

**Error**: ${errorMessage}

**Time**: ${new Date().toISOString()}

**Troubleshooting**:
- Check your internet connection
- Verify API rate limits haven't been exceeded
- Try the request again in a few moments

**Note**: This is a real error, not mock data. The system is designed to provide actual ChatGPT responses when properly configured.`;
  }
}

export async function geminiCall(
  prompt: string, 
  systemPrompt: string, 
  request: ResearchRequest
): Promise<string> {
  const callStartTime = Date.now();
  console.log('🎨 Gemini Output Format:', request.multi_gpt_output_format);
  
  try {
    // Skip verification for table-only mode - just use the prompt as-is
    const isTableOnlyMode = request.analysis_type === 'multiGPTFocused' && request.multi_gpt_output_format === 'tableOnly';
    
    let finalPrompt = prompt;
    
    if (!isTableOnlyMode) {
      // ULTRA-STRICT pre-verification for Gemini - scan only user query, not system prompt
      console.log('🔍 ULTRA-STRICT VERIFICATION: Checking Gemini user query for fake data patterns...');
      
      // Check for common fake data patterns in user query only
      const userQueryForValidation = request.query.toLowerCase();
      const fakeDataPatterns = [
        /example\.com/g,
        /company\d+\.com/g,
        /testcompany/g,
        /samplebusiness/g,
        /fakedata/g,
        /placeholder/g,
        /genericcompany/g
      ];
      
      let hasFakeData = false;
      for (const pattern of fakeDataPatterns) {
        if (pattern.test(userQueryForValidation)) {
          hasFakeData = true;
          console.warn(`🚨 FAKE DATA DETECTED: Found pattern ${pattern} in user query`);
          break;
        }
      }
      
      if (hasFakeData) {
        console.error('🚨 BLOCKING FAKE DATA: User query contains fake data patterns');
        return 'ERROR: Fake data patterns detected in user query. Request blocked for data integrity.';
      }

      // Verify websites in the prompt before processing
      console.log('🔍 Verifying websites in Gemini prompt...');
      const { verifiedUrls, invalidUrls } = await verifyWebsitesInText(prompt);

      if (invalidUrls.length > 0) {
        console.warn(`⚠️ Found ${invalidUrls.length} invalid websites:`, invalidUrls);
      }

      if (verifiedUrls.length > 0) {
        console.log(`✅ Verified ${verifiedUrls.length} websites:`, verifiedUrls);
      }

      // Enhanced prompt with ULTRA-STRICT website verification requirements
      finalPrompt = prompt + `

🔍 ULTRA-STRICT WEBSITE VERIFICATION REQUIREMENTS:
- ONLY include information from VERIFIED, ACCESSIBLE, LEGITIMATE websites
- EXCLUDE any data from invalid, inaccessible, or suspicious websites: ${invalidUrls.join(', ')}
- If a website is mentioned but cannot be verified as legitimate, DO NOT include it in your analysis
- Prioritize information from verified, authoritative sources only
- For any company or business data, ensure the source website is accessible, legitimate, and current (2024-2025)
- If you cannot verify a website's legitimacy with 100% certainty, exclude that information entirely
- REQUIRE concrete verification evidence for each company (official website, SEC filings, LinkedIn, business directories)
- EXCLUDE any company without multiple verification sources

VERIFIED WEBSITES AVAILABLE: ${verifiedUrls.join(', ') || 'None found - use only well-known companies with proven verification'}
INVALID WEBSITES TO EXCLUDE: ${invalidUrls.join(', ') || 'None found'}

🚨 CRITICAL: If you cannot provide VERIFICATION EVIDENCE for a company, EXCLUDE IT COMPLETELY. NO EXCEPTIONS.`;
    } else {
      console.log('✅ Table-only mode: Skipping verification prompt additions');
    }

    const response = await runGemini(finalPrompt, [], { 
      mode: 'research', 
      // Enable Google grounding for PSA GPT in multi-GPT
      useGrounding: request.web_search_enabled || request.using_web_search || true,
      enableWebSearch: request.web_search_enabled || request.using_web_search || true,
    });
    
    // 🔐 POST-PROCESS: Apply name masking to ensure GDPR compliance
    const { processedResponse: maskedResponse, validation, wasModified } = processResearchResponse(response);
    logNameMaskingResults(request.category, 'gemini', validation, wasModified);
    
    // Track usage metrics
    const responseTime = Date.now() - callStartTime;
    const inputTokens = llmTracker.estimateTokens(prompt);
    const outputTokens = llmTracker.estimateTokens(maskedResponse);
    
    llmTracker.trackLLMUsage(
      'gemini',
      'gemini-2.0-flash',
      'research_query',
      request.depth === 'basic' ? 'low' : request.depth === 'intermediate' ? 'medium' : 'high',
      inputTokens,
      outputTokens,
      responseTime,
      prompt,
      maskedResponse,
      {
        userId: 'research-user',
        webSearchUsed: true // Gemini with grounding uses web search
      }
    );
    
    // ULTRA-STRICT post-validation for Gemini response - scan response only
    console.log('🔍 ULTRA-STRICT VALIDATION: Checking Gemini response for fake data...');
    
    // Check response for fake data patterns
    const responseFakePatterns = [
      /example\.com/g,
      /company\d+\.com/g,
      /testcompany/g,
      /samplebusiness/g,
      /fakedata/g,
      /placeholder/g,
      /genericcompany/g,
      /fakecompany/g,
      /samplecompany/g,
      /democompany/g
    ];
    
    let responseHasFakeData = false;
    for (const pattern of responseFakePatterns) {
      if (pattern.test(maskedResponse.toLowerCase())) {
        responseHasFakeData = true;
        console.error(`🚨 FAKE DATA IN RESPONSE: Found pattern ${pattern} in Gemini response`);
        break;
      }
    }
    
    if (responseHasFakeData) {
      console.error('🚨 BLOCKING FAKE RESPONSE: Gemini response contains fake data patterns');
      return 'ERROR: Response contains fake or placeholder data. Filtered for data integrity. Please try again.';
    }
    
    // Additional validation: Check for lack of verification evidence
    if (request.category === 'sales_opportunities' && !maskedResponse.includes('Verification') && !maskedResponse.includes('verified') && !maskedResponse.includes('official')) {
      console.warn('⚠️ WARNING: Gemini response lacks verification evidence for sales opportunities');
    }
    
    // For table-only mode, extract ONLY the markdown table from response
    if (isTableOnlyMode) {
      console.log('🎯 Table-only mode: Extracting markdown table from response');
      
      // Extract markdown table using regex
      // Match pattern: |...| with header row, separator row, and data rows
      const tableRegex = /\|[^\n]+\|[\s\S]*?\n\|[-:\s|]+\|[\s\S]*?(?:\n(?!\|)|\n*$)/;
      const tableMatch = maskedResponse.match(tableRegex);
      
      if (tableMatch) {
        const extractedTable = tableMatch[0].trim();
        console.log('✅ Extracted pure table from Gemini response');
        return extractedTable;
      } else {
        console.warn('⚠️ No markdown table found in Gemini response');
        // If no table found, try to extract any table-like structure
        const lines = maskedResponse.split('\n');
        const tableLines = lines.filter(line => line.trim().startsWith('|'));
        
        if (tableLines.length > 0) {
          const extractedTable = tableLines.join('\n');
          console.log('✅ Extracted table lines from response');
          return extractedTable;
        }
        
        // Fallback: return a "no info found" table
        console.error('❌ Could not extract table from response');
        return `| Company | Topic | Finding | Source |\n|---------|-------|---------|--------|\n| N/A | N/A | No relevant information found | N/A |`;
      }
    }
    
    // Add ResearchGPT header to the response (only for non-table-only mode)
    const formattedResponse = `# 🔍 ResearchGPT Analysis\n\n${maskedResponse}`;
    return formattedResponse;
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    
    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error("❌ Gemini Error details:", {
        message: error.message,
        name: error.name,
        stack: error.stack?.substring(0, 500)
      });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
      return `# Gemini Configuration Error

## ⚠️ Real Data Unavailable

**Issue**: The Google/Gemini API key is not properly configured, preventing access to real Gemini data.

**Error Details**: ${errorMessage}

**Solution**: 
1. Ensure your Google API key (GOOGLE_API_KEY) is properly set in environment variables
2. Verify the API key has Gemini API access enabled
3. Check that the API key has sufficient quota and permissions

**Current Status**: Mock responses are disabled to ensure transparency about data availability.

To get real research data from Gemini, please configure the Google API key properly.`;
    }
    
    return `# Gemini Service Error

## ⚠️ Real Data Temporarily Unavailable

**Error**: ${errorMessage}

**Time**: ${new Date().toISOString()}

**Troubleshooting**:
- Check your internet connection
- Verify API rate limits haven't been exceeded  
- Try the request again in a few moments

**Note**: This is a real error, not mock data. The system is designed to provide actual Gemini responses when properly configured.`;
  }
}

export async function perplexityCall(
  prompt: string, 
  systemPrompt: string, 
  request: ResearchRequest
): Promise<string> {
  const callStartTime = Date.now();
  console.log('🎨 Perplexity Output Format:', request.multi_gpt_output_format);
  
  try {
    // Check if Perplexity API key is available
    if (!process.env.PERPLEXITY_API_KEY) {
      console.warn("❌ PERPLEXITY_API_KEY not found, using mock response");
      throw new Error("PERPLEXITY_API_KEY environment variable is not set");
    }

    // Use the selected Perplexity model from the request, or fall back to default
    const selectedPerplexityModel = request.perplexity_model || getResearchModel('perplexity', 'standard');
    console.log(`🤖 Calling Perplexity API with selected model: ${selectedPerplexityModel}`);
    console.log(`📏 Prompt length: ${prompt.length} characters`);
    console.log(`🎯 System prompt length: ${systemPrompt.length} characters`);
    
    const response = await callPerplexityWithRetry(prompt, selectedPerplexityModel, systemPrompt);
    
    console.log(`✅ Perplexity response received, length: ${response?.length || 0} characters`);
    
    // Check if response contains the fallback message
    if (response.includes('Service Temporarily Unavailable') || response.includes('high demand')) {
      console.warn('⚠️ Perplexity returned fallback response due to service issues');
      // Don't throw error, return the fallback response as is
      return response;
    }
    
    // 🔐 POST-PROCESS: Apply name masking to ensure GDPR compliance
    const { processedResponse: maskedResponse, validation, wasModified } = processResearchResponse(response);
    logNameMaskingResults(request.category, 'perplexity', validation, wasModified);
    
    // Track usage metrics
    const responseTime = Date.now() - callStartTime;
    const inputTokens = llmTracker.estimateTokens(prompt + systemPrompt);
    const outputTokens = llmTracker.estimateTokens(maskedResponse);
    
    llmTracker.trackLLMUsage(
      'perplexity',
      selectedPerplexityModel,
      'research_query',
      request.depth === 'basic' ? 'low' : request.depth === 'intermediate' ? 'medium' : 'high',
      inputTokens,
      outputTokens,
      responseTime,
      prompt,
      maskedResponse,
      {
        userId: 'research-user',
        webSearchUsed: true // Perplexity always uses web search
      }
    );
    
    // Skip header for table-only mode
    if (request.analysis_type === 'multiGPTFocused' && request.multi_gpt_output_format === 'tableOnly') {
      console.log('✅ Table-only mode: Returning raw Perplexity response without header');
      return maskedResponse;
    }
    
    // Add ResearchGPT header to the response
    const formattedResponse = `# 🔍 ResearchGPT Analysis\n\n${maskedResponse}`;
    return formattedResponse;
  } catch (error) {
    console.error("❌ Perplexity API error in orchestration:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("📋 Error details:", errorMessage);
    
    // Return the enhanced fallback response instead of mock response
    return `# Perplexity Real-Time Intelligence (Service Temporarily Unavailable)

## Notice
Perplexity's real-time web search service is currently experiencing issues. The comprehensive research analysis has been provided by our other AI models with the latest available data.

## Technical Details
**Error**: ${errorMessage}
**Time**: ${new Date().toISOString()}
**Model**: ${request.perplexity_model || 'sonar-deep-research'}

## Alternative Actions
- **Immediate**: Use the detailed research from GPT-4o and Gemini models above
- **Manual Verification**: Cross-reference contact information through LinkedIn and company websites
- **Retry Option**: Try the research again in a few minutes when Perplexity service stabilizes

## Contact Discovery Recommendations
For finding real decision maker emails:
1. Check company "About Us" and "Leadership" pages directly
2. Use LinkedIn Sales Navigator for verified contact details
3. Look for recent press releases with executive contact information
4. Check industry directories and professional associations

*Note: This fallback ensures you still receive comprehensive research insights while Perplexity's real-time contact discovery features are restored.*`;
  }
}

/**
 * Groq API Call (Llama, Mixtral, etc.)
 */
export async function groqCall(
  prompt: string, 
  systemPrompt: string, 
  request: ResearchRequest
): Promise<string> {
  const callStartTime = Date.now();
  console.log('🚀 Groq Call Starting...');
  console.log('🔑 Checking Groq API Key in orchestration:', {
    keyExists: !!process.env.GROQ_API_KEY,
    keyLength: process.env.GROQ_API_KEY?.length || 0,
    keyPrefix: process.env.GROQ_API_KEY?.substring(0, 10) || 'none'
  });
  
  try {
    // Check if Groq API key is available
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ CRITICAL: GROQ_API_KEY not found in orchestration");
      console.error("❌ This will prevent real data from being returned");
      console.error("❌ Please set GROQ_API_KEY environment variable");
      throw new Error("GROQ_API_KEY environment variable is not set - real data unavailable");
    }

    console.log("✅ Groq API key found and validated, proceeding with Groq call");

    // Call Groq API with Llama 70B model
    const response = await callGroq(
      prompt, 
      systemPrompt,
      'llama-3.1-70b-versatile'
    );
    
    console.log("✅ Groq response received, length:", response?.length || 0);
    
    // Track usage metrics
    const responseTime = Date.now() - callStartTime;
    const inputTokens = llmTracker.estimateTokens(prompt + systemPrompt);
    const outputTokens = llmTracker.estimateTokens(response);
    
    llmTracker.recordCall({
      provider: 'Groq',
      model: 'llama-3.1-70b-versatile',
      inputTokens,
      outputTokens,
      responseTime,
      category: request.category,
      successful: true
    });

    return response;
  } catch (error) {
    console.error("❌ Groq API error in orchestration:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("📋 Error details:", errorMessage);
    
    // Return the enhanced fallback response instead of mock response
    return `# Groq (Llama) Analysis (Service Temporarily Unavailable)

## Notice
Groq's API service is currently experiencing issues. The comprehensive research analysis has been provided by our other AI models with the latest available data.

## Technical Details
**Error**: ${errorMessage}
**Time**: ${new Date().toISOString()}
**Model**: llama-3.1-70b-versatile

## Alternative Actions
- **Immediate**: Use the detailed research from GPT-4o and Gemini models above
- **Manual Verification**: Cross-reference contact information through LinkedIn and company websites
- **Retry Option**: Try the research again in a few minutes when Groq service stabilizes

## Contact Discovery Recommendations
For finding real decision maker emails:
1. Check company "About Us" and "Leadership" pages directly
2. Use LinkedIn Sales Navigator for verified contact details
3. Look for recent press releases with executive contact information
4. Check industry directories and professional associations

*Note: This fallback ensures you still receive comprehensive research insights while Groq's service is restored.*`;
  }
}

