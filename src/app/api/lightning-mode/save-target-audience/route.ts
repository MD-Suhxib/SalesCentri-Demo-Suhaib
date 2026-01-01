import { NextRequest, NextResponse } from 'next/server';
import { OnboardingState } from '../../../lib/langchain/onboardingSmartRouter';

interface LightningTargetAudience {
  salesObjective: string;
  companyRole: string;
  shortTermGoal: string;
  websiteUrl: string;
  gtm: string;
  targetIndustry: string;
  targetRevenueSize: string;
  targetEmployeeSize: string;
  targetDepartments: string;
  targetRegion: string;
  targetLocation: string;
}

interface LightningSaveRequest {
  targetAudienceData: LightningTargetAudience;
  userId?: string;
  anonymousUserId?: string;
  companySummary?: string;
  websiteUrl?: string;
}

// Convert Lightning Mode target audience to OnboardingState format
const convertLightningToOnboardingState = (
  lightningData: LightningTargetAudience,
  websiteUrl?: string
): Partial<OnboardingState> => {
  console.log('🔄 Converting Lightning Mode data to OnboardingState format');
  console.log('📋 Lightning Data:', lightningData);
  
  // Map target departments string to array if needed
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
    targetDepartments = ['C-suite']; // Default value
  }
  
  // Map revenue size to valid options from onboarding.md
  const mapRevenueSize = (size: string): string => {
    // Valid revenue size options from onboarding.md
    const validRevenueSizes = [
      '0-500K',
      '500K-1M', 
      '1M-5M',
      '5M-10M',
      '10M-50M',
      '50M-100M',
      '100M-500M',
      '500M-1B',
      '1B-5B',
      '5B+',
      'NA'
    ];
    
    // If already valid, return it
    if (validRevenueSizes.includes(size)) {
      return size;
    }
    
    // Otherwise map common variations
    const sizeMap: Record<string, string> = {
      '$1M-10M': '1M-5M',
      '$10M-50M': '10M-50M',
      '$50M-100M': '50M-100M',
      '$100M-500M': '100M-500M',
      '$500M-1B': '500M-1B',
      '$1B+': '1B-5B',
      '1M-10M': '1M-5M',
      '10M-50M': '10M-50M',
      '50M-100M': '50M-100M',
      '100M-500M': '100M-500M',
      '500M-1B': '500M-1B',
      '1B+': '1B-5B'
    };
    return sizeMap[size] || size; // Return original if no mapping found
  };
  
  // Map employee size to valid options from onboarding.md
  const mapEmployeeSize = (size: string): string => {
    // Valid employee size options from onboarding.md
    const validEmployeeSizes = [
      '0-10',
      '11-50',
      '51-200',
      '201-500',
      '501-1000',
      '1000-5000',
      '5001-10000',
      '10001-50000',
      '50001-100000',
      '100000+',
      'NA'
    ];
    
    // If already valid, return it
    if (validEmployeeSizes.includes(size)) {
      return size;
    }
    
    // Otherwise map common variations
    const sizeMap: Record<string, string> = {
      '50-500': '51-200',
      '500-1000': '501-1000',
      '1000-5000': '1000-5000',
      '5000+': '5001-10000',
      '10-50': '11-50',
      '0-10': '0-10',
      '200-500': '201-500',
      '1000+': '1000-5000'
    };
    return sizeMap[size] || size; // Return original if no mapping found
  };
  
  // Map industry to valid options (preserve exact input if it's already valid)
  const mapIndustry = (industry: string): string => {
    // Valid industry options from onboarding.md
    const validIndustries = [
      'Accounting/Finance',
      'Advertising/Public Relations', 
      'Aerospace/Aviation',
      'Agriculture/Livestock',
      'Animal Care/Pet Services',
      'Arts/Entertainment/Publishing',
      'Automotive',
      'Banking/Mortgage',
      'Business Development',
      'Business Opportunity',
      'Clerical/Administrative',
      'Construction/Facilities',
      'Education/Research',
      'Energy/Utilities',
      'Food/Beverage',
      'Government/Non-Profit',
      'Healthcare/Wellness',
      'Legal/Security',
      'Manufacturing/Industrial',
      'Real Estate/Property',
      'Retail/Wholesale',
      'Technology/IT',
      'Transportation/Logistics',
      'Other',
      'NA'
    ];
    
    // If the industry is already valid, return it
    if (validIndustries.includes(industry)) {
      return industry;
    }
    
    // Otherwise, try to map it
    const industryMap: Record<string, string> = {
      'Technology': 'Technology/IT',
      'IT': 'Technology/IT',
      'Tech': 'Technology/IT',
      'Software': 'Technology/IT',
      'Healthcare': 'Healthcare/Wellness',
      'Finance': 'Banking/Mortgage',
      'Manufacturing': 'Manufacturing/Industrial',
      'Education': 'Education/Research',
      'Retail': 'Retail/Wholesale',
      'Real Estate': 'Real Estate/Property',
      'Automotive': 'Automotive',
      'Energy': 'Energy/Utilities',
      'Government': 'Government/Non-Profit',
      'Legal': 'Legal/Security',
      'Construction': 'Construction/Facilities',
      'Transportation': 'Transportation/Logistics',
      'Agriculture': 'Agriculture/Livestock',
      'Aerospace': 'Aerospace/Aviation',
      'Arts': 'Arts/Entertainment/Publishing',
      'Advertising': 'Advertising/Public Relations',
      'Accounting': 'Accounting/Finance',
      'Business Development': 'Business Development',
      'Clerical': 'Clerical/Administrative',
      'Food': 'Food/Beverage',
      'Animal Care': 'Animal Care/Pet Services'
    };
    return industryMap[industry] || industry; // Return original if no mapping found
  };
  
  // Map target region to valid options from onboarding.md
  const mapTargetRegion = (region: string): string => {
    // Valid region options from onboarding.md
    const validRegions = [
      'India',
      'North America',
      'Europe',
      'Asia-Pacific',
      'Global / Multiple regions'
    ];
    
    // If already valid, return it
    if (validRegions.includes(region)) {
      return region;
    }
    
    // Otherwise map common variations
    const regionMap: Record<string, string> = {
      'Asia Pacific': 'Asia-Pacific',
      'AsiaPacific': 'Asia-Pacific',
      'APAC': 'Asia-Pacific',
      'USA': 'North America',
      'US': 'North America',
      'United States': 'North America',
      'Canada': 'North America',
      'Global': 'Global / Multiple regions',
      'Multiple regions': 'Global / Multiple regions',
      'Worldwide': 'Global / Multiple regions'
    };
    return regionMap[region] || region; // Return original if no mapping found
  };
  
  // Map company role to valid options
  const mapCompanyRole = (role: string): string => {
    const roleMap: Record<string, string> = {
      'CEO': 'Founder / CEO',
      'Founder': 'Founder / CEO',
      'Founder/CEO': 'Founder / CEO',
      'Sales Director': 'Sales Director or Manager',
      'Sales Manager': 'Sales Director or Manager',
      'VP Sales': 'Sales Director or Manager',
      'Marketing Director': 'Marketing Director or Manager',
      'Marketing Manager': 'Marketing Director or Manager',
      'SDR': 'Sales Development Representative (SDR)',
      'Sales Development Representative': 'Sales Development Representative (SDR)',
      'Consultant': 'Consultant / Advisor',
      'Advisor': 'Consultant / Advisor'
    };
    return roleMap[role] || 'Sales Director or Manager'; // Default to Sales Director or Manager
  };
  
  // Map short term goal to valid options
  const mapShortTermGoal = (goal: string): string => {
    const goalMap: Record<string, string> = {
      'Prospect List': 'Schedule a demo',
      'Lead Generation': 'Schedule a demo',
      'Generate Leads': 'Schedule a demo',
      'Demo': 'Schedule a demo',
      'Schedule Demo': 'Schedule a demo',
      'Purchase Contacts': 'Purchase or download contacts',
      'Download Contacts': 'Purchase or download contacts',
      'Enrich List': 'Enrich my existing list',
      'Create List': 'Create a new list from scratch',
      'Strategy': 'Get advice on strategy',
      'Advice': 'Get advice on strategy'
    };
    return goalMap[goal] || 'Schedule a demo'; // Default to Schedule a demo
  };
  
  const onboardingState: Partial<OnboardingState> = {
    // Required fields with proper mapping and validation
    sales_objective: lightningData.salesObjective || 'Generate qualified leads',
    company_role: mapCompanyRole(lightningData.companyRole || 'Sales Director or Manager'),
    short_term_goal: mapShortTermGoal(lightningData.shortTermGoal || 'Schedule a demo'),
    website_url: lightningData.websiteUrl || websiteUrl || '',
    gtm: lightningData.gtm || 'B2B',
    target_industry: mapIndustry(lightningData.targetIndustry || 'Technology/IT'),
    target_revenue_size: mapRevenueSize(lightningData.targetRevenueSize || '500K-1M'),
    target_employee_size: mapEmployeeSize(lightningData.targetEmployeeSize || '51-200'),
    target_departments: targetDepartments, // Use the processed array from above
    target_region: mapTargetRegion(lightningData.targetRegion || 'North America'),
    target_location: lightningData.targetLocation || 'United States',
    target_audience_list_exist: false, // Lightning Mode generates new lists
    
    // Add raw fields for validation (these are often required by the API)
    sales_objective_raw: lightningData.salesObjective || 'Generate qualified leads',
    company_role_raw: lightningData.companyRole || 'Sales Director or Manager',
    short_term_goal_raw: lightningData.shortTermGoal || 'Schedule a demo',
    gtm_raw: lightningData.gtm || 'B2B',
    target_industry_raw: lightningData.targetIndustry || 'Technology/IT',
    target_revenue_size_raw: lightningData.targetRevenueSize || '500K-1M',
    target_employee_size_raw: lightningData.targetEmployeeSize || '51-200',
    target_departments_raw: Array.isArray(targetDepartments) ? targetDepartments.join(', ') : targetDepartments.toString(),
    target_region_raw: lightningData.targetRegion || 'North America'
  };

  console.log('✅ Converted Lightning Mode data to OnboardingState:');
  console.log('📋 Mapped fields:', Object.keys(onboardingState));
  console.log('📋 Values:', onboardingState);
  
  return onboardingState;
};

// Save to DemandIntellect database API (same as onboarding save)
const saveToDemandIntellectAPI = async (
  onboardingData: Partial<OnboardingState>,
  anonymousUserId?: string,
  authToken?: string
): Promise<boolean> => {
  try {
    const baseURL = 'https://app.demandintellect.com/app/api';
    let url = `${baseURL}/onboarding.php`;
    
    // Add anon_id as query parameter if available
    if (anonymousUserId) {
      url += `?anon_id=${anonymousUserId}`;
    }
    
    console.log(`🌐 SAVE LIGHTNING TARGET AUDIENCE: POST ${url}`);
    console.log('📤 Lightning Target Audience Data:', onboardingData);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Bearer token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('✅ Added Bearer token to headers');
    } else {
      console.log('⚠️ No Bearer token available');
    }

    if (anonymousUserId) {
      console.log('✅ Added anon_id to URL parameter');
    } else {
      console.log('⚠️ No anon_id available');
    }

    const config: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(onboardingData),
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      console.error(`Lightning Target Audience API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error details:', errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ SAVE LIGHTNING TARGET AUDIENCE: Success');
    console.log('📋 Response:', data);
    return true;
  } catch (error) {
    console.error('❌ SAVE LIGHTNING TARGET AUDIENCE: Error', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const body: LightningSaveRequest = await request.json();
    const { targetAudienceData, userId, anonymousUserId, companySummary, websiteUrl } = body;
    
    if (!targetAudienceData) {
      return NextResponse.json(
        { error: 'Target audience data is required' },
        { status: 400 }
      );
    }

    console.log('⚡ Lightning Mode Save Target Audience API called');
    console.log('📋 Target Audience Data:', targetAudienceData);
    console.log('👤 User ID:', userId || anonymousUserId);

    // Extract auth token from headers
    const authHeader = request.headers.get('authorization');
    const authToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

    // Convert Lightning Mode data to OnboardingState format
    const onboardingData = convertLightningToOnboardingState(targetAudienceData, websiteUrl);

    // Save to DemandIntellect database
    const saveSuccess = await saveToDemandIntellectAPI(
      onboardingData,
      anonymousUserId || userId,
      authToken
    );

    if (saveSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Lightning Mode target audience saved to DemandIntellect database successfully',
        data: onboardingData,
        timestamp: Date.now()
      });
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to save Lightning Mode target audience to DemandIntellect database',
          details: 'Database API request failed'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('⚡ Lightning Mode Save Target Audience API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to save Lightning Mode target audience',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}