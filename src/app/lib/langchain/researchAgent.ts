// Internet Search and Research Agent using Langchain
import { StateGraph, MessagesAnnotation, MemorySaver, START, END } from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { llmRouter, TaskType } from "./llmRouter";
import { ragSystem } from "./ragSystem";
import { webSearchService, SearchResult } from "./webSearch";
import { progressEmitter } from "../progressEmitter";
import { UserProfile } from "../auth"; // ✅ CRITICAL FIX: Import full UserProfile with industry field
import { 
  createCompanyAnalysisPrompt, 
  createICPResearchPrompt 
} from "../../../app/prompts";
import { createTabularLeadsPrompt } from "../../../app/prompts/leadGenerationPrompts";

type CompanyAnalysis = {
  website?: string;
  businessModel?: string;
  services?: string[];
  painPoints?: string;
  source?: string;
};

export interface ResearchConfig {
  maxSearchResults?: number;
  enableWeb?: boolean;
  enableRAG?: boolean;
  taskType?: TaskType;
  companyAnalysis?: CompanyAnalysis;
  userProfile?: UserProfile; // Add userProfile to access company website
}

export interface ResearchResult {
  answer: string;
  sources: string[];
  detailedSources?: Array<{
    title: string;
    url: string;
    domain: string;
    content: string;
    snippet: string;
  }>;
  searchQueries: string[];
  timestamp: string;
  taskType: TaskType;
}

export class ResearchAgent {
  private memory: MemorySaver;

  constructor() {
    this.memory = new MemorySaver();
    console.log('🔬 RESEARCH AGENT: Initialized with multi-provider web search');
  }

  /**
   * Use Gemini to synthesize BUYER-INTENT Tavily queries for lead generation.
   * Ensures we search for potential customers (organizations/institutions), not competitors.
   */
  private async generateBuyerQueriesViaGemini(input: {
    industry: string;
    region?: string;
    website: string;
    targetDepts?: string[] | string;
    extraContext?: string;
    targetIndustry?: string;
  }): Promise<string[]> {
    const { industry, region, website } = input;
    const targetDepts = Array.isArray(input.targetDepts) ? input.targetDepts.join(', ') : (input.targetDepts || '');
    const regionHint = region && region.trim().length > 0 ? region.trim() : 'North America';

    // Force Gemini for planning; lightweight and fast
    const planner = llmRouter.routeLLM('icp-development');
    const domain = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const targetIndustryFocus = input.targetIndustry || industry;
    const planPrompt = `You are a lead-generation strategist. Create 6-8 Tavily-ready search queries to find BUYERS (not vendors/competitors) for the company at ${website}.

Company offering industry (contextual): ${industry}
Target Industry for Leads: ${targetIndustryFocus}
Target region preference: ${regionHint}
Target departments/titles (if any): ${targetDepts}
Extra context (optional): ${input.extraContext || 'N/A'}

Rules:
- Focus EXCLUSIVELY on organizations in the ${targetIndustryFocus} industry that would BUY the solution.
- Include specific company directories with detailed information: "Fortune 500 ${targetIndustryFocus} companies", "Inc 5000 ${targetIndustryFocus} companies", "${targetIndustryFocus} companies list with CEO names"
- Search for company databases and profiles: "${targetIndustryFocus} company profiles", "${targetIndustryFocus} business directory with contacts", "Crunchbase ${targetIndustryFocus} companies"
- Include industry reports with company names: "top ${targetIndustryFocus} companies 2024", "${targetIndustryFocus} market leaders list", "${targetIndustryFocus} industry report companies"
- Search for decision makers with company context: "${targetIndustryFocus} CEO names list", "${targetIndustryFocus} CTO executives directory", "LinkedIn ${targetIndustryFocus} leadership profiles", "${targetIndustryFocus} company executives names", "${targetIndustryFocus} management team directory"
- Include specific business listing sites: "ZoomInfo ${targetIndustryFocus} companies", "Apollo ${targetIndustryFocus} database", "LinkedIn ${targetIndustryFocus} company pages"
- Search specifically for executive names: "Bloomberg ${targetIndustryFocus} executives", "Forbes ${targetIndustryFocus} CEO list", "${targetIndustryFocus} company leadership teams", "Who is CEO of ${targetIndustryFocus} companies"
- Search for company case studies and press releases: "${targetIndustryFocus} companies news", "${targetIndustryFocus} companies acquisitions", "${targetIndustryFocus} startups funding"
- Include procurement and vendor lists: "${targetIndustryFocus} companies procurement", "${targetIndustryFocus} companies RFP", "${targetIndustryFocus} technology buyers"
- MANDATORY: At least 6 out of 6-8 queries MUST specifically include "${targetIndustryFocus}" and focus on finding company names with contact details
- DO NOT use generic queries - every query should target finding specific companies with leadership information
- DO NOT use the word "leads" or "lead generation" in the queries.
- Return ONLY a JSON array of strings. No commentary.`;

    try {
      const response = await planner.invoke([new HumanMessage(planPrompt)]);
      const content = (response.content as string).trim();
      let queries: string[] = [];
      try {
        queries = JSON.parse(content);
      } catch {
        // Attempt to extract JSON array substring
        const match = content.match(/\[([\s\S]*?)\]/);
        if (match) {
          queries = JSON.parse(match[0]);
        }
      }
      if (Array.isArray(queries) && queries.length > 0) {
        return queries.slice(0, 8);
      }
    } catch (err) {
      console.warn('Gemini planning failed, falling back to heuristic queries:', err);
    }

    // Fallback heuristic if Gemini fails
    const deptExpr = targetDepts ? ` (${targetDepts})` : '';
    const r = regionHint ? ` ${regionHint}` : '';
    return [
      `${industry}${r} RFP OR tender OR procurement`,
      `${industry}${r} case study adoption OR deployment`,
      `${industry}${r} evaluation OR pilot`,
      `site:linkedin.com/in${r} (CEO OR CIO OR "VP Operations" OR "Head of Digital") ${industry}${deptExpr}`,
      `directory ${industry} organizations${r}`,
      `list of ${industry} companies${r}`,
      `${industry}${r} buying criteria OR vendor selection`,
      `${industry}${r} modernization OR digital transformation adoption`
    ];
  }

  /**
   * Simple internet search using multi-provider web search
   */
  public async searchInternet(query: string, maxResults: number = 5): Promise<SearchResult[]> {
    try {
      const searchMessage = `🌐 RESEARCH SEARCH: Performing web search for "${query}"`;
      console.log(searchMessage);
      progressEmitter.emitLog(searchMessage);
      
      const results = await webSearchService.search(query, maxResults);
      
      // Emit sources immediately as they're discovered
      if (results && results.length > 0) {
        const detailedSources = results.map(result => ({
          title: result.title || 'Unknown Source',
          url: result.url || '',
          domain: result.url && result.url !== 'N/A' && result.url !== '' ? (() => {
            try {
              return new URL(result.url).hostname.replace('www.', '');
            } catch {
              return 'unknown';
            }
          })() : 'unknown',
          content: (result.content || '').substring(0, 200) + '...',
          snippet: result.snippet || result.content || ''
        })).filter(source => source.url && source.url !== 'N/A' && source.url !== '');
        
        console.log('🎯 SEARCH: Emitting sources immediately:', detailedSources.length);
        progressEmitter.emitSources(detailedSources);
      }
      
      // Convert to expected format for backward compatibility
      return results.map(result => ({
        content: result.content,
        url: result.url,
        title: result.title,
        snippet: result.snippet
      }));
    } catch (error) {
      console.error('🚨 WEB SEARCH ERROR:', error);
      progressEmitter.emitLog('🚨 WEB SEARCH ERROR: Search operation failed');
      return [];
    }
  }

  /**
   * Research Agent with orchestration (legacy method - kept for compatibility)
   */
  public async createResearchAgent(taskType: TaskType = 'research') {
    const llm = llmRouter.routeLLM(taskType);
    // Note: Using new web search service instead of tools
    console.log('🔬 RESEARCH AGENT: Created agent for task type:', taskType);
    return { llm, searchService: webSearchService };
  }

  /**
   * Company Analysis Research
   */
  public async analyzeCompany(
    website: string, 
    additionalContext?: string,
    onboardingData?: {
      userRole?: string;
      salesObjective?: string;
      companyWebsite?: string;
      immediateGoal?: string;
      marketFocus?: string;
      companyInfo?: {
        industry?: string;
        revenueSize?: string;
        employeeSize?: string;
      };
      targetRegion?: string;
      targetTitles?: string[];
      budget?: string;
    }
  ): Promise<ResearchResult> {
    // Emit research configuration
    const configMessage = `🔬 RESEARCH CONFIG: Web=true, RAG=true, MaxResults=3, Target=${website}`;
    console.log(configMessage);
    progressEmitter.emitLog(configMessage);
    
    const searchQueries = [
      `site:${website} about company business model`,
      `"${website}" company profile industry`,
      `${website} competitors market analysis`,
      `"${website}" company news recent developments`
    ];

    progressEmitter.emitLog(`🎯 RESEARCH PLAN: Executing ${searchQueries.length} targeted searches`);

    const searchResults: SearchResult[] = [];
    for (let i = 0; i < searchQueries.length; i++) {
      const query = searchQueries[i];
      progressEmitter.emitLog(`🔍 SEARCH ${i + 1}/${searchQueries.length}: ${query}`);
      const results = await this.searchInternet(query, 3);
      searchResults.push(...results);
    }

    // Extract URLs for RAG indexing
    const urls = searchResults
      .filter(r => r.url && r.url !== 'N/A')
      .map(r => r.url)
      .slice(0, 5); // Limit to 5 URLs

    // Index web content for RAG
    if (urls.length > 0) {
      progressEmitter.emitLog(`📚 RAG INDEXING: Processing ${urls.length} sources for enhanced analysis`);
      await ragSystem.indexWebContent(urls);
    }

    // Build research context
    const context = searchResults
      .map((r: SearchResult) => `Source: ${r.url}\nContent: ${r.content}`)
      .join('\n\n');

    progressEmitter.emitLog('🧠 AI ANALYSIS: Generating comprehensive company insights');

    const prompt = createCompanyAnalysisPrompt(website, onboardingData);
    const fullPrompt = `${prompt}\n\nResearch Context:\n${context}\n\nAdditional Context: ${additionalContext || 'None'}`;

    const llm = llmRouter.routeLLM('company-analysis');
    const response = await llm.invoke([new HumanMessage(fullPrompt)]);

    progressEmitter.emitComplete('Company analysis completed successfully');

    return {
      answer: response.content as string,
      sources: urls,
      searchQueries,
      timestamp: new Date().toISOString(),
      taskType: 'company-analysis'
    };
  }

  /**
   * ICP Research
   */
  public async researchICP(onboardingData: {
    userRole?: string;
    salesObjective?: string;
    companyWebsite?: string;
    immediateGoal?: string;
  }): Promise<ResearchResult> {
    const industry = onboardingData.salesObjective || '';
    const searchQueries = [
      `"${industry}" industry ideal customer profile`,
      `B2B buyers "${industry}" decision makers`,
      `"${industry}" market size target companies`,
      `best prospects "${industry}" lead generation`
    ];

    const searchResults: SearchResult[] = [];
    for (const query of searchQueries) {
      const results = await this.searchInternet(query, 3);
      searchResults.push(...results);
    }

    const context = searchResults
      .map(r => `Source: ${r.url}\nContent: ${r.content}`)
      .join('\n\n');

    const prompt = createICPResearchPrompt(onboardingData);
    // Place research context BEFORE instructions so the final instructions/template appear last and are followed
    const fullPrompt = `Market Research Context:\n${context}\n\n${prompt}`;

    const llm = llmRouter.routeLLM('icp-development');
    const response = await llm.invoke([new HumanMessage(fullPrompt)]);

    return {
      answer: response.content as string,
      sources: searchResults.map(r => r.url).filter(url => url && url !== 'N/A'),
      searchQueries,
      timestamp: new Date().toISOString(),
      taskType: 'icp-development'
    };
  }

  /**
   * Lead Generation Research
   */
  public async generateLeads(onboardingData: {
    userRole?: string;
    salesObjective?: string; // Not used for industry inference
    companyWebsite?: string;
    immediateGoal?: string;
    companyInfo?: { 
      industry?: string;
      revenueSize?: string;
      employeeSize?: string;
    };
    marketFocus?: string;
    targetRegion?: string;
    targetTitles?: string[];
    targetIndustries?: string[]; // ✅ Multi-select industries only
    targetLocation?: string; // ✅ CRITICAL FIX: Add targetLocation support
    budget?: string; // ✅ CRITICAL FIX: Add budget support
  }): Promise<ResearchResult> {
    // Derive core targeting
    // Priority: targetIndustries[0] > companyInfo.industry > RAG inference > fallback
    const selectedIndustries: string[] = (Array.isArray(onboardingData.targetIndustries) && onboardingData.targetIndustries.length > 0)
      ? onboardingData.targetIndustries
      : [];
    let industry = (onboardingData.companyInfo?.industry || '').trim();
    if (!industry && selectedIndustries.length > 0) {
      industry = selectedIndustries[0];
    }
    const region = (onboardingData.targetRegion || '').trim();
    const titles = (onboardingData.targetTitles && onboardingData.targetTitles.length > 0)
      ? onboardingData.targetTitles.join(' OR ')
      : 'CEO OR CTO OR VP Sales OR Head of Sales';
    const website = (onboardingData.companyWebsite || 'your-company.com').trim();

    // Build SMART prospect queries focused on actual companies (avoid generic "lead" providers)
    // If industry missing, try to pull from previously indexed company analysis via RAG system keywords
    if (!industry) {
      try {
        const ragHints = await ragSystem.search(`${website} industry category vertical products services buyers`);
        const hintText = ragHints.map((r: { content: string }) => r.content).join(' ').toLowerCase();
        const candidates = ['education', 'smart campus', 'retail', 'e-commerce', 'healthcare', 'finance', 'manufacturing', 'logistics', 'technology', 'analytics'];
        const matched = candidates.find(k => hintText.includes(k));
        industry = (matched || 'Technology').replace(/\bsmart campus\b/, 'Education').trim();
      } catch {
        industry = 'Technology';
      }
    }

        // Use Gemini to plan buyer-intent Tavily queries with specific industry focus
        console.log('🎯 CALLING generateBuyerQueriesViaGemini WITH:', {
          targetIndustries: selectedIndustries,
          industry,
          region,
          website
        });
        let searchQueries: string[] = [];
        if (selectedIndustries.length > 0) {
          const perIndustryQueries: string[][] = [];
          for (const targetInd of selectedIndustries) {
            const q = await this.generateBuyerQueriesViaGemini({
              industry,
              region,
              website,
              targetDepts: onboardingData.targetTitles || titles,
              extraContext: onboardingData.immediateGoal || '',
              targetIndustry: targetInd
            });
            perIndustryQueries.push(q);
          }
          // Flatten, de-duplicate, and limit total queries
          const dedup = Array.from(new Set(perIndustryQueries.flat()));
          searchQueries = dedup.slice(0, 12);
        } else {
          searchQueries = await this.generateBuyerQueriesViaGemini({
            industry,
            region,
            website,
            targetDepts: onboardingData.targetTitles || titles,
            extraContext: onboardingData.immediateGoal || '',
            targetIndustry: industry
          });
        }

    const searchResults: SearchResult[] = [];
    for (const query of searchQueries) {
      const results = await this.searchInternet(query, 6); // Increased from 4 to 6 for more company data
      searchResults.push(...results);
    }

    const context = searchResults
      .map(r => `Source: ${r.url}\nContent: ${r.content}`)
      .join('\n\n');

    // Tabular output prompt grounded to the user's website and onboarding
    const leadGenAnswers: import("../../../app/prompts/leadGenerationPrompts").LeadGenParams = {
      industry,
      competitorBasis: 'Market leaders',
      region: region || 'North America',
      clientType: onboardingData.marketFocus === 'B2C' ? 'Mid-Market' : 'Enterprise',
      marketFocus: onboardingData.marketFocus,
      targetDepartments: onboardingData.targetTitles || [],
      targetRevenueSize: onboardingData.companyInfo?.revenueSize,
      targetEmployeeSize: onboardingData.companyInfo?.employeeSize,
      // ✅ CRITICAL FIX: Use targetLocation field correctly (was incorrectly using targetRegion)
      targetLocation: onboardingData.targetLocation,
      // ✅ Multi-industry only
      targetIndustries: selectedIndustries.length > 0 ? selectedIndustries : undefined,
      companyRole: onboardingData.userRole,
      shortTermGoal: onboardingData.immediateGoal,
      // ✅ CRITICAL FIX: Add budget field
      budget: onboardingData.budget,
    };

    const prompt = createTabularLeadsPrompt(website, leadGenAnswers);
    const fullPrompt = `${prompt}\n\nProspect Research Context:\n${context}`;

    const llm = llmRouter.routeLLM('lead-generation');
    const response = await llm.invoke([new HumanMessage(fullPrompt)]);

    return {
      answer: response.content as string,
      sources: searchResults.map(r => r.url).filter(url => url && url !== 'N/A'),
      searchQueries,
      timestamp: new Date().toISOString(),
      taskType: 'lead-generation'
    };
  }

  /**
   * General research with RAG enhancement
   */
  public async researchWithRAG(
    query: string, 
    config: ResearchConfig = {}
  ): Promise<ResearchResult> {
    console.log(`🔬 RESEARCH AGENT START: Starting research with RAG for "${query}"`);
    const { 
      maxSearchResults = 5, 
      enableWeb = true, 
      enableRAG = true, 
      taskType = 'research' 
    } = config;
    console.log(`⚙️ RESEARCH CONFIG: Web=${enableWeb}, RAG=${enableRAG}, MaxResults=${maxSearchResults}, Type=${taskType}`);

    let searchResults: SearchResult[] = [];
    let ragContext = '';

    // Web search if enabled
    if (enableWeb) {
      console.log('🌐 WEB SEARCH: Performing internet search via Tavily');
      
      // SMART LEAD GENERATION SEARCH: Detect tabular lead prompts or explicit lead-gen intent
      const qLower = query.toLowerCase();
      const looksLikeLeadPrompt =
        qLower.includes('lead list') ||
        qLower.includes('lead research') ||
        qLower.includes('lead generation') ||
        qLower.includes('produce exactly four tables') ||
        qLower.includes('class="lead-table"');

      if (taskType === 'research' && looksLikeLeadPrompt) {
        console.log('🎯 LEAD GENERATION DETECTED: Using targeted prospect search based on company analysis');
        
        // Extract target criteria from the prompt and website URL
        const industryMatch = query.match(/- Industry: ([^\n]+)/);
        const regionMatch = query.match(/- Region: ([^\n]+)/);
        const locationMatch = query.match(/- (?:Specific )?Target Location: ([^\n]+)/); // ✅ Extract targetLocation
        const targetDeptMatch = query.match(/- Target Departments\/Titles: ([^\n]+)/);
        const revenueMatch = query.match(/- Target Revenue Size: ([^\n]+)/);
        const marketFocusMatch = query.match(/- Market Focus: ([^\n]+)/);
        const specificLocationMatch = query.match(/- Specific Target Location: ([^\n]+)/); // Alternative pattern
        
        // Get company website from multiple sources (prioritize userProfile)
        let companyWebsite = 'your-company.com'; // Default fallback
        
        // First try to get from userProfile (most reliable)
        if (config.userProfile?.organization?.website) {
          companyWebsite = config.userProfile.organization.website;
          console.log('🎯 USING COMPANY WEBSITE FROM USERPROFILE:', companyWebsite);
        } else if (config.userProfile?.organization?.name) {
          companyWebsite = config.userProfile.organization.name;
          console.log('🎯 USING COMPANY NAME FROM USERPROFILE:', companyWebsite);
        } else if (config.companyAnalysis?.website) {
          companyWebsite = config.companyAnalysis.website;
          console.log('🎯 USING COMPANY WEBSITE FROM ANALYSIS:', companyWebsite);
        } else {
                  // Fallback to extracting from query - look for any URL pattern
        const websiteMatch = query.match(/(?:https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (websiteMatch) {
          companyWebsite = websiteMatch[1];
          console.log('🎯 EXTRACTED COMPANY WEBSITE FROM QUERY:', companyWebsite);
        } else {
          // Look for salescentri.com specifically in the query
          if (query.includes('salescentri.com')) {
            companyWebsite = 'salescentri.com';
            console.log('🎯 FOUND SALESCENTRI.COM IN QUERY:', companyWebsite);
          } else {
            console.log('⚠️ NO COMPANY WEBSITE FOUND, using default:', companyWebsite);
          }
        }
        }
        
        // ✅ CRITICAL FIX: Extract industry from userProfile/companyAnalysis FIRST, then query, then fallback
        let targetIndustry = 'Technology'; // Default fallback
        
        // Priority 1: Check userProfile.organization.industry
        if (config.userProfile?.organization?.industry && config.userProfile.organization.industry.trim().length > 0) {
          targetIndustry = config.userProfile.organization.industry.trim();
          console.log('🎯 USING INDUSTRY FROM USERPROFILE:', targetIndustry);
        }
        // Priority 2: Check companyAnalysis for industry hints
        else if (config.companyAnalysis?.businessModel || config.companyAnalysis?.services) {
          const businessModel = (config.companyAnalysis.businessModel || '').toLowerCase();
          const services = (config.companyAnalysis.services || []).map((s: string) => s.toLowerCase()).join(' ');
          const combinedText = `${businessModel} ${services}`;
          
          // Infer industry from business model and services
          const industryKeywords: Record<string, string[]> = {
            'Education': ['education', 'school', 'university', 'campus', 'learning', 'academic', 'student'],
            'Healthcare': ['healthcare', 'medical', 'hospital', 'clinic', 'patient', 'health'],
            'Finance': ['finance', 'banking', 'financial', 'investment', 'insurance', 'fintech'],
            'Retail': ['retail', 'e-commerce', 'ecommerce', 'shopping', 'store', 'merchandise'],
            'Manufacturing': ['manufacturing', 'production', 'factory', 'industrial', 'assembly'],
            'Technology': ['software', 'saas', 'technology', 'tech', 'digital', 'cloud', 'data', 'analytics', 'crm', 'sales automation'],
            'Real Estate': ['real estate', 'property', 'housing', 'construction', 'building'],
            'Hospitality': ['hospitality', 'hotel', 'restaurant', 'travel', 'tourism'],
            'Logistics': ['logistics', 'supply chain', 'shipping', 'transportation', 'warehouse']
          };
          
          for (const [industry, keywords] of Object.entries(industryKeywords)) {
            if (keywords.some(keyword => combinedText.includes(keyword))) {
              targetIndustry = industry;
              console.log('🎯 INFERRED INDUSTRY FROM COMPANY ANALYSIS:', targetIndustry);
              break;
            }
          }
        }
        // Priority 3: Extract from query if provided
        else if (industryMatch) {
          targetIndustry = industryMatch[1].trim();
          console.log('🎯 EXTRACTED INDUSTRY FROM QUERY:', targetIndustry);
        }
        
        console.log('✅ FINAL TARGET INDUSTRY FOR LEAD GEN:', targetIndustry);
        
        // Region: prefer parsed; else fall back to North America as requested
        const targetRegion = (regionMatch ? regionMatch[1].trim() : '') || 'North America';
        // ✅ Extract targetLocation from query (prioritize specificLocationMatch, then locationMatch)
        const targetLocation = (specificLocationMatch ? specificLocationMatch[1].trim() : (locationMatch ? locationMatch[1].trim() : ''));
        const hasSpecificLocation = targetLocation && targetLocation.toLowerCase() !== 'null' && targetLocation.toLowerCase() !== 'n/a' && targetLocation.trim().length > 0;
        
        console.log('🌍 GEOGRAPHIC EXTRACTION:', {
          region: targetRegion,
          location: targetLocation,
          hasSpecificLocation
        });
        
        const targetDepts = targetDeptMatch ? targetDeptMatch[1].trim() : 'CEO, CTO, VP Sales';
        const revenueSize = revenueMatch ? revenueMatch[1].trim() : '';
        const marketFocus = marketFocusMatch ? marketFocusMatch[1].trim() : 'B2B';
        
        // GET COMPANY ANALYSIS FROM CONFIG OR FALLBACK TO LOCALSTORAGE
        let companyAnalysis: CompanyAnalysis | null = config.companyAnalysis || null;
        
        if (!companyAnalysis) {
          try {
            // Check if we're in a browser environment before accessing localStorage
            if (typeof window !== 'undefined' && window.localStorage) {
              const storedAnalysis = localStorage.getItem('companyAnalysis');
              if (storedAnalysis) {
                const parsed = JSON.parse(storedAnalysis) as unknown;
                if (parsed && typeof parsed === 'object') {
                  const maybe = parsed as Partial<CompanyAnalysis>;
                  companyAnalysis = {
                    website: typeof maybe.website === 'string' ? maybe.website : undefined,
                    businessModel: typeof maybe.businessModel === 'string' ? maybe.businessModel : undefined,
                    services: Array.isArray(maybe.services) ? (maybe.services as string[]) : undefined,
                    painPoints: typeof maybe.painPoints === 'string' ? maybe.painPoints : undefined,
                    source: typeof maybe.source === 'string' ? maybe.source : undefined,
                  };
                }
                console.log('💾 RETRIEVED COMPANY ANALYSIS FROM LOCALSTORAGE:', companyAnalysis);
              }
            } else {
              console.log('📝 SERVER-SIDE: localStorage not available, no company analysis provided in config');
            }
          } catch (error) {
            console.error('Error retrieving company analysis:', error);
          }
        } else {
          console.log('💾 USING COMPANY ANALYSIS FROM CONFIG:', companyAnalysis);
        }
        
        console.log('🎯 EXTRACTED CRITERIA:', { targetIndustry, targetRegion, targetDepts, revenueSize, marketFocus, companyWebsite });
        console.log('🔍 FULL CONFIG FOR RESEARCH:', {
          userProfile: config.userProfile,
          userProfileIndustry: config.userProfile?.organization?.industry,
          companyAnalysis: config.companyAnalysis,
          website: companyWebsite,
          FINAL_TARGET_INDUSTRY: targetIndustry
        });
        
        // SMART PROSPECT SEARCH QUERIES - Focus on finding actual buyers for client's solutions
        let prospectQueries: string[] = [];
        
        // Remove country info from region for cleaner searches
        const cleanRegion = targetRegion.replace(/\(.*?\)/g, '').trim();
        
        // ✅ ENHANCED: Build geographic search term considering both region and location
        let geoSearchTerm = cleanRegion;
        if (hasSpecificLocation) {
          // If specific location provided, prioritize it but keep region as context
          geoSearchTerm = `${targetLocation} ${cleanRegion}`;
          console.log(`🌍 USING SPECIFIC LOCATION: "${targetLocation}" within ${cleanRegion}`);
        } else {
          console.log(`🌍 USING REGION ONLY: ${cleanRegion}`);
        }
        
        // Always search for ACTUAL BUYERS in the target market, not service providers
        console.log('🎯 CREATING SMART SEARCHES FOR POTENTIAL BUYERS');
        
        // ENHANCED: Use rich context from chat history for better prospect searches
        if (companyAnalysis && (companyAnalysis.businessModel || companyAnalysis.services)) {
          console.log('🎯 USING COMPANY ANALYSIS FOR TARGETED SEARCH:', {
            businessModel: companyAnalysis.businessModel?.substring(0, 100),
            services: companyAnalysis.services?.slice(0, 2),
            source: companyAnalysis.source
          });
          
          // Extract key service/solution terms from company analysis
          const services = (companyAnalysis.services || []).map((s: string) => s.toLowerCase());
          const businessModel = (companyAnalysis.businessModel || '').toLowerCase();

          // Determine buyer-intent keywords and buyer-entity types
          const isSmartCampus = services.some((s: string) => s.includes('smart campus')) || /campus|university|education/.test(businessModel);
          const buyerIntent = isSmartCampus
            ? ['"smart campus"', 'campus iot', 'campus automation', 'facility management']
            : services.some((s: string) => s.includes('crm'))
            ? ['crm implementation', 'sales automation', 'pipeline management']
            : services.some((s: string) => s.includes('data'))
            ? ['data platform', 'analytics modernization', 'cdp migration']
            : ['digital transformation', 'automation'];

          const buyerEntities = isSmartCampus
            ? ['universities', 'campuses', 'colleges', 'school districts']
            : [
                'enterprises',
                `${targetIndustry} companies`,
                `${targetIndustry} organizations`
              ];

          // Construct buyer-focused queries with variety - using intelligent geo targeting
          prospectQueries = [
            `"list of ${buyerEntities[0]}" ${geoSearchTerm}`,
            `"${buyerEntities[0]} directory" ${geoSearchTerm}`,
            `"top ${targetIndustry} companies" ${geoSearchTerm}`,
            `${buyerEntities.join(' OR ')} ${geoSearchTerm} (${buyerIntent.join(' OR ')}) RFP OR tender OR procurement`,
            `${buyerEntities.join(' OR ')} ${geoSearchTerm} adopting OR deploying (${buyerIntent.join(' OR ')})`,
            `${buyerEntities.join(' OR ')} ${geoSearchTerm} evaluation OR pilot (${buyerIntent.join(' OR ')})`,
            `${targetIndustry} ${geoSearchTerm} case study (${buyerIntent.join(' OR ')})`,
            `"${targetIndustry} companies" ${geoSearchTerm} employee count revenue`
          ];
          
          // If we know specific pain points from ICP, add targeted searches
          if (companyAnalysis.painPoints) {
            prospectQueries.unshift(`${targetIndustry} ${geoSearchTerm} "${companyAnalysis.painPoints}" solutions`);
          }
        } else {
          // IMPROVED FALLBACK: Use website URL with better targeting based on user's business
          console.log(`⚠️ LIMITED COMPANY ANALYSIS, using website-based search for ${companyWebsite}`);
          
          // Try to infer business type from website domain
          const isMartech = companyWebsite.includes('sales') || companyWebsite.includes('crm') || companyWebsite.includes('lead');
          const searchFocus = isMartech ? ['sales automation', 'crm'] : ['adoption', 'deployment'];

          prospectQueries = [
            `"list of ${targetIndustry} companies" ${geoSearchTerm}`,
            `"${targetIndustry} companies directory" ${geoSearchTerm}`,
            `"top ${targetIndustry} companies" ${geoSearchTerm}`,
            `${targetIndustry} ${geoSearchTerm} (${searchFocus.join(' OR ')}) RFP OR tender OR procurement`,
            `${targetIndustry} ${geoSearchTerm} case study (${searchFocus.join(' OR ')})`,
            `"${targetIndustry} company profiles" ${geoSearchTerm}`,
            `"${targetIndustry} businesses" ${geoSearchTerm} employee count revenue`
          ];
        }
        
        console.log('🔍 DYNAMIC PROSPECT SEARCH QUERIES:', prospectQueries);
        
        for (const prospectQuery of prospectQueries) {
          console.log(`🔍 SEARCHING: ${prospectQuery}`);
          const results = await this.searchInternet(prospectQuery, 3);
          searchResults.push(...results);
        }
        
        console.log(`✅ PROSPECT SEARCH SUCCESS: Found ${searchResults.length} prospect sources`);
      } else {
        // Regular research search
        searchResults = await this.searchInternet(query, maxSearchResults);
        console.log(`✅ WEB SEARCH SUCCESS: Found ${searchResults.length} web results`);
      }
    } else {
      console.log('⚠️ WEB SEARCH DISABLED: Skipping web search');
    }

    // RAG search if enabled
    if (enableRAG) {
      console.log('📚 RAG SEARCH: Searching company knowledge base');
      const ragResults = await ragSystem.search(query);
      ragContext = ragResults.map(r => r.content).join('\n\n');
      console.log(`📊 RAG RESULTS: Found ${ragResults.length} knowledge chunks`);
    } else {
      console.log('⚠️ RAG DISABLED: Skipping RAG search');
    }

    // Combine contexts
    console.log('🔗 CONTEXT COMBINATION: Merging web and RAG contexts');
    const webContext = searchResults
      .map(r => `Source: ${r.url}\nContent: ${r.content}`)
      .join('\n\n');

    console.log(`📊 WEB CONTEXT: ${webContext.length} characters`);
    console.log(`📊 RAG CONTEXT: ${ragContext.length} characters`);
    
    if (webContext.length > 0) {
      console.log(`📄 WEB CONTENT PREVIEW: ${webContext.substring(0, 200)}...`);
    }
    
    if (ragContext.length > 0) {
      console.log(`📄 RAG CONTENT PREVIEW: ${ragContext.substring(0, 200)}...`);
    }

    const fullContext = [webContext, ragContext].filter(Boolean).join('\n\n---\n\n');
    console.log(`📝 CONTEXT SIZE: Combined context length: ${fullContext.length} characters`);

    if (fullContext.length === 0) {
      console.warn('⚠️ NO CONTEXT: No web or RAG context available for research');
    }

    const prompt = `Research Query: ${query}

Available Context:
${fullContext}

${fullContext.length < 100 ? 
  `Note: Limited context available. Based on the company domain mentioned in the query, provide practical research guidance and outreach strategies that would typically apply to technology service companies. Include specific steps the user can take to research this company and identify pain points.` :
  `Please provide a comprehensive answer based on the available context. If the context is insufficient, indicate what additional information would be helpful.`
}`;

    console.log(`🤖 MODEL SELECTION: Getting LLM for task type: ${taskType}`);
    const llm = llmRouter.routeLLM(taskType);
    console.log('🚀 LLM INVOCATION: Calling research LLM with context');
    const response = await llm.invoke([new HumanMessage(prompt)]);
    console.log('✅ RESEARCH SUCCESS: Research agent completed successfully');

    // Prepare detailed source information for frontend cycling
    const detailedSources = searchResults.map(r => ({
      title: r.title || 'Unknown Source',
      url: r.url || '',
      domain: r.url && r.url !== 'N/A' && r.url !== '' ? (() => {
        try {
          return new URL(r.url).hostname.replace('www.', '');
        } catch {
          return 'unknown';
        }
      })() : 'unknown',
      content: (r.content || '').substring(0, 200) + '...',
      snippet: r.snippet || r.content || ''
    })).filter(source => source.url && source.url !== 'N/A' && source.url !== '');

    console.log('🎯 RESEARCH AGENT: Prepared detailed sources for frontend:', detailedSources.length);
    console.log('📋 DETAILED SOURCES PREVIEW:', detailedSources.slice(0, 2));

    return {
      answer: response.content as string,
      sources: searchResults.map(r => r.url).filter(url => url && url !== 'N/A'),
      detailedSources, // Add detailed sources for frontend
      searchQueries: [query],
      timestamp: new Date().toISOString(),
      taskType
    };
  }

  /**
   * Multi-step research workflow using StateGraph
   */
  public async createMultiStepResearch(researchGoal: string) {
    const StateAnnotation = MessagesAnnotation;

    // Define research steps
    async function planResearch() {
      const llm = llmRouter.routeLLM('research');
      const planPrompt = `Break down this research goal into 3-5 specific search queries: "${researchGoal}"
      
Return as JSON array: ["query1", "query2", "query3"]`;
      
      const response = await llm.invoke([new HumanMessage(planPrompt)]);
      return { messages: [new AIMessage(response.content as string)] };
    }

    async function executeSearch(state: typeof StateAnnotation.State) {
      // Extract queries from previous step
      const lastMessage = state.messages[state.messages.length - 1];
      let queries: string[] = [];
      
      try {
        queries = JSON.parse(lastMessage.content as string);
      } catch {
        queries = [researchGoal]; // Fallback
      }

      const agent = new ResearchAgent();
      const results: SearchResult[] = [];
      
      for (const query of queries) {
        const searchResults = await agent.searchInternet(query, 3);
        results.push(...searchResults);
      }

      const context = results
        .map(r => `Source: ${r.url}\nContent: ${r.content}`)
        .join('\n\n');

      return { messages: [new AIMessage(context)] };
    }

    async function synthesize(state: typeof StateAnnotation.State) {
      const llm = llmRouter.routeLLM('research');
      const context = state.messages[state.messages.length - 1].content;
      
      const synthesisPrompt = `Based on the research context below, provide a comprehensive answer to: "${researchGoal}"

Research Context:
${context}

Provide a structured, insightful response.`;

      const response = await llm.invoke([new HumanMessage(synthesisPrompt)]);
      return { messages: [response] };
    }

    // Build the workflow
    const workflow = new StateGraph(StateAnnotation)
      .addNode("plan", planResearch)
      .addNode("search", executeSearch)
      .addNode("synthesize", synthesize)
      .addEdge(START, "plan")
      .addEdge("plan", "search")
      .addEdge("search", "synthesize")
      .addEdge("synthesize", END);

    return workflow.compile({ checkpointer: this.memory });
  }
}

// Export singleton instance
export const researchAgent = new ResearchAgent();
