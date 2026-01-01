import { NextRequest, NextResponse } from 'next/server';
import { orchestrateResearch } from '../../lib/researchOrchestration';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 ResearchGPT API called');
    const { query } = await request.json();
    console.log('🔍 ResearchGPT query:', query);
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log('🔍 Calling orchestrateResearch for ResearchGPT...');
    
                // Create research request with market analysis configuration
                const researchRequest = {
                  query: query,
                  category: 'market_analysis' as const,
      depth: 'comprehensive' as const,
      timeframe: '1Y',
      geographic_scope: 'Regional',
      data_sources: [],
      company_size: 'all' as const,
      focus_on_leads: true,
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
                  config_summary: 'ResearchGPT market analysis with regional scope',
      website_url: null,
      website_url_2: null,
      revenue_category: null,
      deep_research: true,
      include_founders: true,
      include_products: true,
                  analyze_sales_opportunities: false,
      include_tabular_data: true,
      extract_company_info: true,
      analyze_prospective_clients: true,
      include_employee_count: true,
      include_revenue_data: true,
      include_complete_urls: true,
      perplexity_model: 'sonar-deep-research'
    };

    console.log('🔍 ResearchGPT research request:', researchRequest);

    // Call orchestrateResearch directly
    const results = await orchestrateResearch(researchRequest);
    console.log('🔍 ResearchGPT results received:', results);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('ResearchGPT research error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Research failed' },
      { status: 500 }
    );
  }
}
