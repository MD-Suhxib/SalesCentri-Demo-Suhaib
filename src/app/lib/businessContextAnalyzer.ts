// Business context analyzer for extracting value propositions and product information

export interface BusinessContext {
  companyName: string;
  website: string;
  products: string[];
  services: string[];
  targetCustomers: string[];
  valuePropositions: string[];
  useCases: string[];
  competitiveAdvantages: string[];
  industry: string;
  companySize: 'small' | 'medium' | 'large' | 'unknown';
  businessModel: string;
}

export interface ValuePropositionMapping {
  product: string;
  targetCustomer: string;
  painPoint: string;
  solution: string;
  benefit: string;
  competitiveAdvantage: string;
}

// Analyze website content to extract business context
export async function analyzeBusinessContext(website: string): Promise<BusinessContext> {
  // In a real implementation, this would scrape and analyze the website
  // For now, we'll create a mock analysis based on common patterns
  
  const context: BusinessContext = {
    companyName: extractCompanyName(website),
    website,
    products: [],
    services: [],
    targetCustomers: [],
    valuePropositions: [],
    useCases: [],
    competitiveAdvantages: [],
    industry: 'unknown',
    companySize: 'unknown',
    businessModel: 'unknown'
  };

  // Mock analysis - in production, this would use web scraping
  // and AI analysis of the website content
  try {
    // Simulate website analysis
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Extract basic information from URL patterns
    const domain = new URL(website.startsWith('http') ? website : `https://${website}`).hostname;
    
    // Common business indicators
    if (domain.includes('saas') || domain.includes('software') || domain.includes('app')) {
      context.industry = 'technology';
      context.businessModel = 'SaaS';
      context.products = ['Software Platform', 'Mobile App', 'Web Application'];
      context.valuePropositions = [
        'Streamline operations with automated workflows',
        'Increase productivity with integrated tools',
        'Reduce costs through automation'
      ];
    } else if (domain.includes('consulting') || domain.includes('advisory')) {
      context.industry = 'professional_services';
      context.businessModel = 'Consulting';
      context.services = ['Strategic Consulting', 'Implementation Services', 'Training'];
      context.valuePropositions = [
        'Expert guidance and industry expertise',
        'Customized solutions for business challenges',
        'Proven methodologies and best practices'
      ];
    } else if (domain.includes('marketing') || domain.includes('agency')) {
      context.industry = 'marketing';
      context.businessModel = 'Agency';
      context.services = ['Digital Marketing', 'Content Creation', 'Campaign Management'];
      context.valuePropositions = [
        'Increase brand visibility and reach',
        'Generate qualified leads and conversions',
        'Optimize marketing ROI and performance'
      ];
    } else {
      // Generic business analysis
      context.industry = 'general';
      context.businessModel = 'B2B';
      context.products = ['Products/Services'];
      context.valuePropositions = [
        'Solve specific business challenges',
        'Improve operational efficiency',
        'Drive growth and profitability'
      ];
    }

    // Generate target customers based on industry
    context.targetCustomers = generateTargetCustomers(context.industry);
    
    // Generate use cases based on business model
    context.useCases = generateUseCases(context.businessModel);
    
    // Generate competitive advantages
    context.competitiveAdvantages = generateCompetitiveAdvantages(context.industry);

  } catch (error) {
    console.error('Error analyzing business context:', error);
  }

  return context;
}

// Extract company name from website URL
function extractCompanyName(website: string): string {
  try {
    const url = new URL(website.startsWith('http') ? website : `https://${website}`);
    const domain = url.hostname.replace('www.', '');
    const name = domain.split('.')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return 'Unknown Company';
  }
}

// Generate target customers based on industry
function generateTargetCustomers(industry: string): string[] {
  const customerMappings: Record<string, string[]> = {
    'technology': [
      'Tech startups and scale-ups',
      'Mid-market software companies',
      'Enterprise technology teams',
      'IT departments and CTOs',
      'Product managers and developers'
    ],
    'professional_services': [
      'Small to medium businesses',
      'Growing companies seeking expertise',
      'Executives and decision makers',
      'Business owners and founders',
      'Management teams'
    ],
    'marketing': [
      'Marketing directors and CMOs',
      'Growing businesses needing brand awareness',
      'E-commerce companies',
      'B2B companies with complex sales cycles',
      'Startups and scale-ups'
    ],
    'general': [
      'Small to medium businesses',
      'Growing companies',
      'Business owners and executives',
      'Decision makers and influencers',
      'Companies seeking growth'
    ]
  };

  return customerMappings[industry] || customerMappings['general'];
}

// Generate use cases based on business model
function generateUseCases(businessModel: string): string[] {
  const useCaseMappings: Record<string, string[]> = {
    'SaaS': [
      'Automate repetitive tasks and workflows',
      'Integrate with existing business systems',
      'Scale operations without proportional cost increase',
      'Improve team collaboration and productivity',
      'Gain insights through data analytics'
    ],
    'Consulting': [
      'Strategic planning and business development',
      'Process optimization and efficiency improvement',
      'Technology implementation and adoption',
      'Change management and transformation',
      'Performance improvement and growth'
    ],
    'Agency': [
      'Brand awareness and market presence',
      'Lead generation and customer acquisition',
      'Content creation and marketing campaigns',
      'Digital transformation and online presence',
      'ROI optimization and performance tracking'
    ],
    'B2B': [
      'Streamline business operations',
      'Improve customer experience',
      'Increase sales and revenue',
      'Reduce operational costs',
      'Enhance competitive advantage'
    ]
  };

  return useCaseMappings[businessModel] || useCaseMappings['B2B'];
}

// Generate competitive advantages based on industry
function generateCompetitiveAdvantages(industry: string): string[] {
  const advantageMappings: Record<string, string[]> = {
    'technology': [
      'Cutting-edge technology and innovation',
      'User-friendly interface and experience',
      'Scalable and flexible architecture',
      'Comprehensive integration capabilities',
      'Advanced security and compliance'
    ],
    'professional_services': [
      'Deep industry expertise and knowledge',
      'Proven track record and case studies',
      'Customized solutions and approaches',
      'Ongoing support and partnership',
      'Cost-effective and efficient delivery'
    ],
    'marketing': [
      'Creative and innovative campaigns',
      'Data-driven strategies and insights',
      'Multi-channel expertise and reach',
      'Measurable results and ROI',
      'Agile and responsive approach'
    ],
    'general': [
      'Proven expertise and experience',
      'Customized solutions and approaches',
      'Reliable and consistent delivery',
      'Competitive pricing and value',
      'Strong customer support and service'
    ]
  };

  return advantageMappings[industry] || advantageMappings['general'];
}

// Map value propositions to specific customer segments
export function createValuePropositionMappings(context: BusinessContext): ValuePropositionMapping[] {
  const mappings: ValuePropositionMapping[] = [];

  context.products.forEach(product => {
    context.targetCustomers.forEach(customer => {
      context.valuePropositions.forEach(proposition => {
        mappings.push({
          product,
          targetCustomer: customer,
          painPoint: generatePainPoint(customer, context.industry),
          solution: proposition,
          benefit: generateBenefit(proposition),
          competitiveAdvantage: context.competitiveAdvantages[0] || 'Proven expertise'
        });
      });
    });
  });

  return mappings;
}

// Generate pain points based on customer and industry
function generatePainPoint(customer: string, industry: string): string {
  const painPointMappings: Record<string, string[]> = {
    'technology': [
      'Inefficient manual processes slowing down development',
      'Lack of integration between different tools and systems',
      'Difficulty scaling operations with growing team',
      'Security concerns and compliance requirements',
      'Limited visibility into performance and metrics'
    ],
    'professional_services': [
      'Lack of specialized expertise for complex challenges',
      'Need for strategic guidance and direction',
      'Resource constraints and capacity limitations',
      'Difficulty keeping up with industry changes',
      'Need for objective third-party perspective'
    ],
    'marketing': [
      'Low brand awareness and market visibility',
      'Difficulty generating qualified leads',
      'Limited marketing resources and expertise',
      'Inconsistent messaging and brand presence',
      'Difficulty measuring marketing ROI'
    ],
    'general': [
      'Operational inefficiencies and bottlenecks',
      'Lack of strategic direction and planning',
      'Resource constraints and capacity issues',
      'Difficulty competing in the market',
      'Need for growth and expansion'
    ]
  };

  const painPoints = painPointMappings[industry] || painPointMappings['general'];
  return painPoints[Math.floor(Math.random() * painPoints.length)];
}

// Generate benefits from value propositions
function generateBenefit(proposition: string): string {
  const benefitKeywords = [
    'increase', 'improve', 'reduce', 'enhance', 'optimize',
    'streamline', 'accelerate', 'boost', 'maximize', 'minimize'
  ];

  const hasBenefitKeyword = benefitKeywords.some(keyword => 
    proposition.toLowerCase().includes(keyword)
  );

  if (hasBenefitKeyword) {
    return proposition;
  } else {
    return `Achieve ${proposition.toLowerCase()}`;
  }
}

// Generate opportunity fit explanation for a lead
export function generateOpportunityFit(
  lead: { company: string; industry: string },
  context: BusinessContext,
  mappings: ValuePropositionMapping[]
): string {
  // Find the most relevant mapping for this lead
  const relevantMapping = mappings.find(mapping => 
    mapping.targetCustomer.toLowerCase().includes(lead.industry.toLowerCase()) ||
    lead.industry.toLowerCase().includes(mapping.targetCustomer.toLowerCase())
  ) || mappings[0];

  return `${lead.company} in the ${lead.industry} industry would benefit from ${context.companyName}'s ${relevantMapping.product} to ${relevantMapping.solution}. This addresses their ${relevantMapping.painPoint} and provides ${relevantMapping.benefit}.`;
}
