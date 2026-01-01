import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '../../lib/authMiddleware';
import { orchestrateResearch, ResearchRequest } from '../../lib/researchOrchestration';
import { orchestrateIncrementalResearch } from '../../lib/researchOrchestration/incremental';
import { updateSessionProgress, storeResultsInSession } from '../../lib/sessionManager';

// Handler for research requests
export async function POST(request: NextRequest) {
  // Allow guest users - check authentication but don't block
  let isAuthenticated = false;
  let userEmail = null;
  
  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔐 API Route - Auth header present:', !!authHeader);
    
    if (authHeader) {
      const authResult = await checkAuth(request);
      if (!(authResult as any)?.error) {
        isAuthenticated = true;
        userEmail = (authResult as any)?.user?.email || null;
        console.log('✅ API Route - Auth successful:', userEmail);
      } else {
        console.log('⚠️ API Route - Guest user (auth optional)');
      }
    } else {
      console.log('⚠️ API Route - Guest user (no auth header)');
    }
  } catch (error) {
    console.log('⚠️ API Route - Auth check failed, proceeding as guest:', error);
    // Continue as guest user - don't block
  }

  try {
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    // Create research request with ALL user inputs and configuration settings
    const researchRequest: ResearchRequest = {
      query: body.query,
      originalPrompt: body.originalPrompt || body.query, // Store original prompt for batch context
      category: body.category || 'market_analysis',
      depth: body.depth || 'basic',
      timeframe: body.timeframe || '1Y',
      geographic_scope: body.geographic_scope || 'Global',
      data_sources: body.data_sources || [],
      company_size: body.company_size || 'all',
      focus_on_leads: body.focus_on_leads || body.category === 'sales_opportunities',
      selected_models: body.selected_models || { gpt4o: true, gemini: true, perplexity: false }, // Default to GPT-4o and Gemini only for testing
      web_search_enabled: body.web_search_enabled || body.category === 'sales_opportunities' || body.focus_on_leads || true, // Force web search for lead generation
      excel_data: body.excel_data || null,
      excel_file_name: body.excel_file_name || null,
      using_web_search: body.using_web_search || body.category === 'sales_opportunities' || body.focus_on_leads || false, // Force web search for leads
      config_summary: body.config_summary || '',
      website_url: body.website_url || null,
      website_url_2: body.website_url_2 || null,
      // Additional configuration settings from frontend
      revenue_category: body.revenue_category || null,
      deep_research: body.deep_research || false,
      include_founders: body.include_founders || false,
      include_products: body.include_products || false,
      analyze_sales_opportunities: body.analyze_sales_opportunities || false,
      include_tabular_data: body.include_tabular_data || false,
      extract_company_info: body.extract_company_info || false,
      analyze_prospective_clients: body.analyze_prospective_clients || false,
      include_employee_count: body.include_employee_count || false,
      include_revenue_data: body.include_revenue_data || false,
      include_complete_urls: body.include_complete_urls || false,
      perplexity_model: body.perplexity_model || 'sonar-deep-research',
      analysis_type: body.analysis_type || 'default',
      multi_gpt_output_format: body.multi_gpt_output_format || 'withContext',
      
      // Batch research fields
      sessionId: body.sessionId || undefined,
      isContinuation: body.isContinuation || false,
      batchIndex: body.batchIndex !== undefined ? body.batchIndex : undefined,
      currentBatch: body.currentBatch || undefined,
      previousResults: body.previousResults || undefined,
      mergedInstructions: body.mergedInstructions || undefined
    };

    console.log("📥 RECEIVED ALL USER INPUTS & CONFIGURATION:");
    console.log("🎯 Basic Research Settings:", {
      query: body.query,
      category: body.category,
      depth: body.depth,
      timeframe: body.timeframe,
      geographic_scope: body.geographic_scope,
      company_size: body.company_size,
      revenue_category: body.revenue_category
    });
    
    // Log batch research context if applicable
    if (researchRequest.isContinuation) {
      console.log("📦 BATCH RESEARCH - Continuation mode:");
      console.log({
        sessionId: researchRequest.sessionId,
        batchIndex: researchRequest.batchIndex,
        isContinuation: true,
        currentBatchSize: researchRequest.currentBatch?.length || 0,
        hasPreviousResults: !!researchRequest.previousResults
      });
    }
    
    console.log("⚙️ Advanced Features:", {
      focus_on_leads: body.focus_on_leads,
      deep_research: body.deep_research,
      web_search_enabled: body.web_search_enabled,
      using_web_search: body.using_web_search,
      include_founders: body.include_founders,
      include_products: body.include_products,
      analyze_sales_opportunities: body.analyze_sales_opportunities,
      include_tabular_data: body.include_tabular_data,
      extract_company_info: body.extract_company_info,
      analyze_prospective_clients: body.analyze_prospective_clients,
      include_employee_count: body.include_employee_count,
      include_revenue_data: body.include_revenue_data,
      include_complete_urls: body.include_complete_urls
    });
    console.log("🌐 Website & Data Context:", {
      website_url: body.website_url,
      website_url_2: body.website_url_2,
      has_excel_data: !!body.excel_data?.length,
      excel_file_name: body.excel_file_name,
      config_summary: body.config_summary
    });
    console.log("🤖 Model & API Settings:", {
      selected_models: body.selected_models,
      perplexity_model: body.perplexity_model
    });

    console.log("✅ Research request with FULL configuration:", JSON.stringify(researchRequest, null, 2));
    
    // Route to incremental orchestrator if this is a batch continuation
    let results;
    if (researchRequest.isContinuation) {
      console.log("🔄 Routing to incremental research orchestrator for batch:", researchRequest.batchIndex);
      results = await orchestrateIncrementalResearch(researchRequest);
      
      // Update session progress with batch results
      if (researchRequest.sessionId && researchRequest.batchIndex !== undefined) {
        try {
          await storeResultsInSession(
            researchRequest.sessionId,
            researchRequest.batchIndex,
            results,
            researchRequest.mergedInstructions || ''
          );
          console.log('✅ Session progress updated for batch:', researchRequest.batchIndex);
        } catch (error) {
          console.error('⚠️ Failed to update session progress:', error);
          // Don't fail the request, just log the error
        }
      }
    } else {
      console.log("🚀 Routing to normal research orchestrator");
      results = await orchestrateResearch(researchRequest);
    }
    
    console.log("Research results:", Object.keys(results));
    console.log("GPT-4o result length:", results.gpt4o?.length || 0);
    console.log("Gemini result length:", results.gemini?.length || 0);
    console.log("Perplexity result length:", results.perplexity?.length || 0);
    console.log("Errors:", results.errors);

    // Return results to the client
    return NextResponse.json(results);
  } catch (error: Error | unknown) {
    console.error('Research error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process research request' },
      { status: 500 }
    );
  }
}