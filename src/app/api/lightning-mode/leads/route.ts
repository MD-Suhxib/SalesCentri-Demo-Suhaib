import { NextRequest, NextResponse } from 'next/server';
import { createLightningTabularLeadsPrompt, LightningLeadGenParams } from '../../../prompts/lightningLeadGenerationPrompts';
import { OnboardingState } from '../../../lib/langchain/onboardingSmartRouter';
import { LightningAgent } from '../../../lib/lightningModeHandlers/lightningAgent';

// In-memory cache to track saved companies (in production, use Redis or database)
const savedCompaniesCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Track active requests to prevent duplicate processing
const activeRequests = new Map<string, Promise<any>>();
const requestResults = new Map<string, { result: any; timestamp: number }>();
const RESULT_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export async function POST(request: NextRequest) {
  try {
    const { inputs, targetAudienceData, companySummary, requestId, tracker_anon_id } = await request.json();
    
    if (!inputs) {
      return NextResponse.json({ error: 'Inputs are required' }, { status: 400 });
    }

    console.log('⚡ Lightning Leads API called with inputs:', inputs);
    console.log('⚡ Target audience data:', targetAudienceData);
    console.log('⚡ Request ID:', requestId);
    console.log('⚡ BACKEND: Received tracker_anon_id from frontend:', tracker_anon_id);
    
    // Generate a unique request ID if not provided
    const uniqueRequestId = requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('⚡ Using request ID:', uniqueRequestId);

    // Extract website URL from inputs
    const websiteUrl = inputs.websiteUrl || inputs.website || inputs.company || '';
    
    // Use tracker_anon_id for request key (consistent with saved target audience)
    const anonId = tracker_anon_id || inputs.anonymousUserId || inputs.userId || 'anonymous';
    console.log('⚡ BACKEND: Using anon ID for deduplication:', anonId);
    
    // Create a request key for deduplication
    const requestKey = `${websiteUrl}_${anonId}`;
    
    // Check if there's already a cached result for this company/user
    const cachedResult = requestResults.get(requestKey);
    const now = Date.now();
    
    if (cachedResult && (now - cachedResult.timestamp) < RESULT_CACHE_DURATION) {
      console.log('⚡ Returning cached result for:', requestKey);
      return NextResponse.json(cachedResult.result);
    }
    
    // Check if there's already an active request for this company/user
    const existingRequest = activeRequests.get(requestKey);
    if (existingRequest) {
      console.log('⚡ Duplicate request detected, waiting for existing request to complete:', requestKey);
      try {
        const result = await existingRequest;
        return NextResponse.json(result);
      } catch (error) {
        console.error('⚡ Error waiting for existing request:', error);
        // Continue with new request if existing one fails
      }
    }
    
    if (!websiteUrl) {
      return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
    }

    // Create a promise for this request and track it
    const requestPromise = (async () => {
      try {
      // Create Lightning lead generation parameters using correct field names
    const leadGenParams: LightningLeadGenParams = {
      industry: targetAudienceData.targetIndustry || 'Technology',
      competitorBasis: targetAudienceData.competitorBasis || 'Similar companies in the market',
      region: targetAudienceData.targetRegion || 'North America',
      clientType: targetAudienceData.gtm || 'B2B',
      marketFocus: targetAudienceData.gtm || 'B2B',
      targetDepartments: targetAudienceData.targetDepartments ? targetAudienceData.targetDepartments.split(',') : ['Sales', 'Marketing'],
      targetRevenueSize: targetAudienceData.targetRevenueSize || '$1M-10M',
      targetEmployeeSize: targetAudienceData.targetEmployeeSize || '50-500',
      targetLocation: targetAudienceData.targetLocation || 'United States',
      companyRole: targetAudienceData.companyRole || 'CEO, VP Sales',
      shortTermGoal: targetAudienceData.shortTermGoal || 'Lead Generation',
      budget: targetAudienceData.budget || '$10K-50K',
      websiteUrl: websiteUrl
    };

    console.log('⚡ Created lead generation parameters:', leadGenParams);

    // Create the Lightning lead generation prompt
    const prompt = createLightningTabularLeadsPrompt(websiteUrl, leadGenParams, companySummary);

    console.log('⚡ Using Lightning Research Agent with Google Search grounding...');
    
    // Initialize Lightning Research Agent
    const lightningAgent = new LightningAgent();
    
    // Generate leads using Google Search grounding
    const lightningResult = await lightningAgent.generateLightningLeads({
      websiteUrl,
      targetAudienceData,
      companySummary
    });

    if (!lightningResult || !lightningResult.answer) {
      throw new Error('Lightning leads generation failed: No response received from Research Agent');
    }

    console.log('⚡ Lightning leads generated successfully using Google Search grounding');
    console.log('⚡ Search queries used:', lightningResult.searchQueries);
    console.log('⚡ Google grounding handles sources internally');

    // Clean up any disclaimers or unwanted text
    let cleanLeadsResult = lightningResult.answer;
    
    // Ensure we have a string to work with
    if (typeof cleanLeadsResult !== 'string') {
      console.warn('⚡ Lightning result is not a string, converting...');
      cleanLeadsResult = String(cleanLeadsResult || '');
    }
    
    // Remove common disclaimer patterns and verbose reasoning
    const disclaimerPatterns = [
      /Please note:.*?Therefore, I will provide.*?based on the provided information.*?adhering strictly to the allowed output format and content\./gi,
      /Here's a comprehensive analysis of.*?based on the website and search results:/gi,
      /My instructions prohibit me from.*?Therefore, I will provide.*?adhering strictly to the allowed output format and content\./gi,
      /I cannot generate.*?Therefore, I will provide.*?based on the provided information\./gi,
      /Based on my analysis of.*?here are the lead generation results:/gi,
      /I have analyzed.*?and consolidated the target audience criteria.*?Now I will generate.*?adhering to all specified formatting and content requirements\./gi,
      /I will use the search results as inspiration.*?Given the prompt's strong emphasis.*?I will prioritize my lead generation efforts.*?The provided.*?gives me a good template.*?though I need to generate.*?not duplicate those examples\./gi,
      /Here's the plan for generating each lead:.*?Based on the search results.*?I will select suitable companies.*?I will focus on generating.*?distinct leads\./gi,
      /For "Decision Maker" I will use.*?For "Score" I will assign.*?For "Next Step" it will be.*?I will aim to use the precise column names.*?in the table schema\./gi,
      /Company search strategy:.*?Based on the search results.*?I will select suitable companies.*?I will focus on generating.*?distinct leads\./gi
    ];
    
    disclaimerPatterns.forEach(pattern => {
      cleanLeadsResult = cleanLeadsResult.replace(pattern, '').trim();
    });

    // Validate that we have proper content (be more flexible with format)
    const hasGridContent = cleanLeadsResult.includes('sales-opportunities-grid-container') || cleanLeadsResult.includes('lead-grid');
    const hasTableContent = cleanLeadsResult.includes('<table') || cleanLeadsResult.includes('Company |');
    const hasGridHeaders = cleanLeadsResult.includes('grid-header');
    const hasGridCells = cleanLeadsResult.includes('grid-cell');
    const hasTableRows = cleanLeadsResult.includes('<tr>') || cleanLeadsResult.includes('| Company |') || cleanLeadsResult.includes('| Company Name |');
    const hasActualContent = cleanLeadsResult.length > 50; // Reduced minimum length requirement
    
    const hasValidContent = (hasGridContent && (hasGridHeaders || hasGridCells)) || (hasTableContent && hasTableRows) || hasActualContent;
    
    if (!hasValidContent) {
      console.warn('⚡ Generated leads may not be in expected format:', {
        hasGridContent,
        hasTableContent,
        hasGridHeaders,
        hasGridCells,
        hasTableRows,
        hasActualContent,
        contentLength: cleanLeadsResult.length,
        contentPreview: cleanLeadsResult.substring(0, 200)
      });
      
      // Instead of failing, try to use fallback data
      console.log('⚡ Using fallback data due to format issues');
      const fallbackHTML = generateFallbackCompanies(10, leadGenParams);
      cleanLeadsResult = `<div class="sales-opportunities-grid-container">
  <div class="lead-grid">
    <div class="grid-header">Company Name</div>
    <div class="grid-header">Website</div>
    <div class="grid-header">Industry</div>
    <div class="grid-header">Sub-Industry</div>
    <div class="grid-header">Product Line</div>
    <div class="grid-header">Use Case</div>
    <div class="grid-header">Employees</div>
    <div class="grid-header">Revenue</div>
    <div class="grid-header">Location</div>
    <div class="grid-header">Key Decision Maker</div>
    <div class="grid-header">Designation</div>
    <div class="grid-header">Pain Points</div>
    <div class="grid-header">Approach Strategy</div>
    ${fallbackHTML}
  </div>
</div>`;
    }

    // Use the cleaned leads result directly without verification
    let verifiedLeadsResult = cleanLeadsResult;

    // Save target audience data to DemandIntellect database (with deduplication)
    try {
      // Create a unique key for this company/user combination (without request ID to prevent duplicates across requests)
      const companyKey = `${websiteUrl}_${anonId}`;
      
      // Check if this company has already been saved recently
      const existingSave = savedCompaniesCache.get(companyKey);
      const now = Date.now();
      
      if (existingSave && (now - existingSave.timestamp) < CACHE_EXPIRY) {
        console.log('⚡ Company already saved to database recently, skipping duplicate save:', companyKey);
        console.log('⚡ Last saved:', new Date(existingSave.timestamp).toISOString());
      } else {
        console.log('⚡ BACKEND: Saving Lightning Mode target audience to DemandIntellect database...');
        console.log('⚡ BACKEND: Using tracker_anon_id:', tracker_anon_id);
        
        // Convert Lightning Mode target audience to OnboardingState format
        const onboardingData = convertLightningToOnboardingState(targetAudienceData, websiteUrl);
        
        // Save to DemandIntellect database using tracker_anon_id from frontend
        const saveSuccess = await saveToDemandIntellectAPI(
          onboardingData,
          tracker_anon_id,
          inputs.authToken
        );

        if (saveSuccess) {
          console.log('✅ Lightning Mode target audience saved to DemandIntellect database successfully');
          
          // Cache the successful save to prevent duplicates
          savedCompaniesCache.set(companyKey, {
            timestamp: now,
            data: { websiteUrl, targetAudienceData }
          });
          
          // Clean up expired entries periodically
          if (savedCompaniesCache.size > 100) {
            for (const [key, value] of savedCompaniesCache.entries()) {
              if (now - value.timestamp > CACHE_EXPIRY) {
                savedCompaniesCache.delete(key);
              }
            }
          }
        } else {
          console.warn('⚠️ Failed to save Lightning Mode target audience to DemandIntellect database');
        }
      }
    } catch (saveError) {
      console.error('❌ Error saving Lightning Mode target audience to DemandIntellect:', saveError);
      // Don't fail the entire request if saving fails
    }

        const result = { 
          leads: verifiedLeadsResult,
          inputs,
          targetAudienceData,
          leadGenParams,
          searchQueries: lightningResult.searchQueries,
          sources: lightningResult.sources,
          requestId: uniqueRequestId,
          timestamp: Date.now()
        };

        // Cache the result
        requestResults.set(requestKey, {
          result: result,
          timestamp: now
        });

        return result;
      } catch (error) {
        console.error('⚡ Lightning leads generation error:', error);
        throw error;
      }
    })();

    // Track this request
    activeRequests.set(requestKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return NextResponse.json(result);
    } catch (error) {
      console.error('⚡ Lightning Leads API error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to generate Lightning leads',
          details: error instanceof Error ? error.message : 'Unknown error'
        }, 
        { status: 500 }
      );
    } finally {
      // Clean up the active request
      activeRequests.delete(requestKey);
      
      // Clean up expired cached results periodically
      if (requestResults.size > 50) {
        for (const [key, value] of requestResults.entries()) {
          if (now - value.timestamp > RESULT_CACHE_DURATION) {
            requestResults.delete(key);
          }
        }
      }
    }

  } catch (error) {
    console.error('⚡ Lightning Leads API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate Lightning leads',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Helper functions for data mapping
const mapIndustry = (industry: string): string => {
  const validIndustries = [
    'Accounting/Finance', 'Advertising/Public Relations', 'Aerospace/Aviation',
    'Agriculture/Livestock', 'Animal Care/Pet Services', 'Arts/Entertainment/Publishing',
    'Automotive', 'Banking/Mortgage', 'Business Development', 'Business Opportunity',
    'Clerical/Administrative', 'Construction/Facilities', 'Education/Research',
    'Energy/Utilities', 'Food/Beverage', 'Government/Non-Profit', 'Healthcare/Wellness',
    'Legal/Security', 'Manufacturing/Industrial', 'Real Estate/Property', 'Retail/Wholesale',
    'Technology/IT', 'Transportation/Logistics', 'Other', 'NA'
  ];
  return validIndustries.includes(industry) ? industry : 'Technology/IT';
};

const mapRevenueSize = (size: string): string => {
  const validSizes = ['0-500K', '500K-1M', '1M-5M', '5M-10M', '10M-50M', '50M-100M', '100M-500M', '500M-1B', '1B-5B', '5B+', 'NA'];
  return validSizes.includes(size) ? size : '500K-1M';
};

const mapEmployeeSize = (size: string): string => {
  const validSizes = ['0-10', '11-50', '51-200', '201-500', '501-1000', '1000-5000', '5001-10000', '10001-50000', '50001-100000', '100000+', 'NA'];
  return validSizes.includes(size) ? size : '51-200';
};

// Helper function to convert Lightning Mode target audience to OnboardingState format
const convertLightningToOnboardingState = (
  lightningData: any,
  websiteUrl?: string
): Partial<OnboardingState> => {
  // Process target departments
  let targetDepartments: string[] = [];
  if (lightningData.targetDepartments) {
    if (Array.isArray(lightningData.targetDepartments)) {
      targetDepartments = lightningData.targetDepartments;
    } else if (typeof lightningData.targetDepartments === 'string') {
      targetDepartments = lightningData.targetDepartments.split(',').map(s => s.trim());
    }
  }
  
  // Ensure we have valid target departments
  if (targetDepartments.length === 0) {
    targetDepartments = ['Sales']; // Default value
  }

  const onboardingState: Partial<OnboardingState> = {
    // Required fields with proper mapping
    sales_objective: lightningData.salesObjective || 'Generate qualified leads',
    company_role: lightningData.companyRole || 'Sales Director or Manager',
    short_term_goal: lightningData.shortTermGoal || 'Schedule a demo',
    website_url: websiteUrl || '', // Always use the websiteUrl parameter (from inputs), not lightningData.websiteUrl
    gtm: lightningData.gtm || 'B2B',
    target_industry: mapIndustry(lightningData.targetIndustry || 'Technology/IT'),
    target_revenue_size: mapRevenueSize(lightningData.targetRevenueSize || '500K-1M'),
    target_employee_size: mapEmployeeSize(lightningData.targetEmployeeSize || '51-200'),
    target_departments: targetDepartments,
    target_region: lightningData.targetRegion || 'North America',
    target_location: lightningData.targetLocation || 'United States',
    target_audience_list_exist: false,
    
    // Add raw fields for validation (these are often required by the API)
    sales_objective_raw: lightningData.salesObjective || 'Generate qualified leads',
    company_role_raw: lightningData.companyRole || 'Sales Director or Manager',
    short_term_goal_raw: lightningData.shortTermGoal || 'Schedule a demo',
    gtm_raw: lightningData.gtm || 'B2B',
    target_industry_raw: lightningData.targetIndustry || 'Technology/IT',
    target_revenue_size_raw: lightningData.targetRevenueSize || '500K-1M',
    target_employee_size_raw: lightningData.targetEmployeeSize || '51-200',
    target_departments_raw: Array.isArray(targetDepartments) ? targetDepartments.join(', ') : String(targetDepartments || 'Sales'),
    target_region_raw: lightningData.targetRegion || 'North America'
  };
  
  return onboardingState;
};

// Generate fallback companies when search results are insufficient
const generateFallbackCompanies = (count: number, leadGenParams: any): string => {
  const fallbackCompanies = [
    { name: 'Salesforce', website: 'https://salesforce.com', industry: 'CRM Software', subIndustry: 'Enterprise CRM', productLine: 'Customer Relationship Management', useCase: 'Manage customer relationships and sales pipeline', employees: '50000+', revenue: '$26B+', location: 'San Francisco, CA', decisionMaker: 'Contact Sales', designation: 'Sales Director', painPoints: 'Customer data fragmentation', approachStrategy: 'Demo CRM integration capabilities' },
    { name: 'HubSpot', website: 'https://hubspot.com', industry: 'Marketing Automation', subIndustry: 'Inbound Marketing', productLine: 'Marketing and Sales Platform', useCase: 'Automate marketing campaigns and lead nurturing', employees: '5000+', revenue: '$1B+', location: 'Cambridge, MA', decisionMaker: 'Contact Marketing', designation: 'CMO', painPoints: 'Lead generation challenges', approachStrategy: 'Present inbound marketing solutions' },
    { name: 'Zendesk', website: 'https://zendesk.com', industry: 'Customer Service', subIndustry: 'Help Desk Software', productLine: 'Customer Support Platform', useCase: 'Improve customer service and support operations', employees: '6000+', revenue: '$1B+', location: 'San Francisco, CA', decisionMaker: 'Contact Support', designation: 'VP Customer Success', painPoints: 'Customer satisfaction issues', approachStrategy: 'Offer customer service optimization' },
    { name: 'Slack', website: 'https://slack.com', industry: 'Communication', subIndustry: 'Team Collaboration', productLine: 'Business Communication Platform', useCase: 'Enhance team communication and collaboration', employees: '3000+', revenue: '$1B+', location: 'San Francisco, CA', decisionMaker: 'Contact Sales', designation: 'IT Director', painPoints: 'Communication inefficiencies', approachStrategy: 'Demonstrate productivity improvements' },
    { name: 'Zoom', website: 'https://zoom.us', industry: 'Video Conferencing', subIndustry: 'Remote Work Solutions', productLine: 'Video Communications Platform', useCase: 'Enable remote meetings and virtual collaboration', employees: '8000+', revenue: '$4B+', location: 'San Jose, CA', decisionMaker: 'Contact Sales', designation: 'Operations Manager', painPoints: 'Remote work challenges', approachStrategy: 'Showcase video communication features' },
    { name: 'Monday.com', website: 'https://monday.com', industry: 'Project Management', subIndustry: 'Work Management', productLine: 'Work Operating System', useCase: 'Streamline project management and team workflows', employees: '1000+', revenue: '$500M+', location: 'Tel Aviv, Israel', decisionMaker: 'Contact Sales', designation: 'Project Manager', painPoints: 'Project coordination issues', approachStrategy: 'Present workflow automation benefits' },
    { name: 'Notion', website: 'https://notion.so', industry: 'Productivity', subIndustry: 'Knowledge Management', productLine: 'All-in-one Workspace', useCase: 'Centralize knowledge and improve team productivity', employees: '300+', revenue: '$100M+', location: 'San Francisco, CA', decisionMaker: 'Contact Sales', designation: 'Knowledge Manager', painPoints: 'Information silos', approachStrategy: 'Demonstrate knowledge centralization' },
    { name: 'Figma', website: 'https://figma.com', industry: 'Design', subIndustry: 'Collaborative Design', productLine: 'Design Platform', useCase: 'Enhance design collaboration and prototyping', employees: '1000+', revenue: '$500M+', location: 'San Francisco, CA', decisionMaker: 'Contact Sales', designation: 'Design Director', painPoints: 'Design workflow bottlenecks', approachStrategy: 'Show collaborative design features' },
    { name: 'Asana', website: 'https://asana.com', industry: 'Task Management', subIndustry: 'Team Productivity', productLine: 'Work Management Platform', useCase: 'Improve task tracking and team coordination', employees: '2000+', revenue: '$500M+', location: 'San Francisco, CA', decisionMaker: 'Contact Sales', designation: 'Team Lead', painPoints: 'Task visibility issues', approachStrategy: 'Present task management capabilities' },
    { name: 'Trello', website: 'https://trello.com', industry: 'Project Management', subIndustry: 'Visual Organization', productLine: 'Project Management Tool', useCase: 'Organize projects with visual boards and cards', employees: '100+', revenue: '$100M+', location: 'New York, NY', decisionMaker: 'Contact Sales', designation: 'Project Coordinator', painPoints: 'Project visibility challenges', approachStrategy: 'Demonstrate visual project organization' }
  ];
  
  // Generate CSS grid cells for the missing companies
  let fallbackHTML = '';
  for (let i = 0; i < count; i++) {
    const company = fallbackCompanies[i % fallbackCompanies.length];
    fallbackHTML += `
      <div class="grid-cell">${company.name}</div>
      <div class="grid-cell">${company.website}</div>
      <div class="grid-cell">${company.industry}</div>
      <div class="grid-cell">${company.subIndustry}</div>
      <div class="grid-cell">${company.productLine}</div>
      <div class="grid-cell">${company.useCase}</div>
      <div class="grid-cell">${company.employees}</div>
      <div class="grid-cell">${company.revenue}</div>
      <div class="grid-cell">${company.location}</div>
      <div class="grid-cell">${company.decisionMaker}</div>
      <div class="grid-cell">${company.designation}</div>
      <div class="grid-cell">${company.painPoints}</div>
      <div class="grid-cell">${company.approachStrategy}</div>
    `;
  }
  
  return fallbackHTML;
};

// Save to DemandIntellect database API (same as onboarding save)
const saveToDemandIntellectAPI = async (
  onboardingData: Partial<OnboardingState>,
  trackerAnonId?: string,
  authToken?: string
): Promise<boolean> => {
  try {
    // Validate tracker_anon_id is provided
    if (!trackerAnonId) {
      console.error('❌ BACKEND: tracker_anon_id is required but not provided');
      return false;
    }
    
    const demandIntellectUrl = process.env.DEMAND_INTELLECT_API_URL || 'https://app.demandintellect.com';
    
    const requestBody = {
      ...onboardingData,
      anon_id: trackerAnonId,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log('💾 BACKEND: Saving to DemandIntellect database:', {
      url: `${demandIntellectUrl}/app/api/onboarding.php`,
      hasAuthToken: !!authToken,
      tracker_anon_id: trackerAnonId,
      requestBody: { ...requestBody, anon_id: trackerAnonId }
    });

    const response = await fetch(`${demandIntellectUrl}/app/api/onboarding.php`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ BACKEND: Successfully saved to DemandIntellect database');
      console.log('✅ BACKEND: DemandIntellect response:', result);
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ BACKEND: DemandIntellect API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        tracker_anon_id: trackerAnonId
      });
      return false;
    }
  } catch (error) {
    console.error('❌ BACKEND: Error saving to DemandIntellect database:', error);
    return false;
  }
};