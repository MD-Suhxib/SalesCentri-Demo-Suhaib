// Enhanced fuzzy matching utility for intelligent user response mapping
import * as fuzzball from 'fuzzball';

export interface FuzzyMatch {
  value: string;
  score: number;
  confidence: number;
}

export interface FieldMapping {
  field: string;
  options?: string[];
  aliases?: Record<string, string>;
  patterns?: Record<string, RegExp>;
}

export class FuzzyMatcher {
  private confidenceThreshold = 70;

  /**
   * Find the best match for user input against available options
   */
  findBestMatch(input: string, options: string[], threshold: number = this.confidenceThreshold): FuzzyMatch | null {
    if (!input || !options.length) return null;

    const cleanInput = input.trim().toLowerCase();
    
    // Try exact match first
    const exactMatch = options.find(option => option.toLowerCase() === cleanInput);
    if (exactMatch) {
      return { value: exactMatch, score: 100, confidence: 100 };
    }

    // Use fuzzball for fuzzy matching
    const results = fuzzball.extract(cleanInput, options, {
      scorer: fuzzball.ratio,
      limit: 1,
      cutoff: threshold * 0.6 // Lower cutoff for fuzzy search
    });

    if (results.length > 0) {
      const [match, score] = results[0];
      
      // Also try token_set_ratio for better handling of partial matches
      const tokenScore = fuzzball.token_set_ratio(cleanInput, match.toLowerCase());
      
      // Use the higher score
      const finalScore = Math.max(score, tokenScore);
      
      if (finalScore >= threshold) {
        return { 
          value: match, 
          score: finalScore, 
          confidence: Math.min(finalScore + 10, 100) // Boost confidence slightly
        };
      }
    }

    return null;
  }

  /**
   * Enhanced mapping for onboarding fields with intelligent pattern matching
   */
  mapOnboardingResponse(input: string, fieldName: string, options?: string[]): string | string[] | boolean | null {
    const cleanInput = input.trim().toLowerCase();

    // Handle skip/null cases
    if (['skip', 'none', 'not applicable', 'na', 'null', ''].includes(cleanInput)) {
      return null;
    }

    // Field-specific intelligent mapping
    switch (fieldName) {
      case 'sales_objective':
        return this.mapSalesObjective(input, options);
      
      case 'company_role':
        return this.mapCompanyRole(input, options);
      
      case 'short_term_goal':
        return this.mapShortTermGoal(input, options);
      
      case 'website_url':
        return this.mapWebsiteUrl(input);
      
      case 'gtm':
        return this.mapGtm(input, options);
      
      case 'company_industry':
      case 'target_industry':
        return this.mapIndustry(input, options);
      case 'target_industries':
        return this.mapIndustries(input, options);
      
      case 'company_revenue_size':
      case 'target_revenue_size':
        return this.mapRevenueSize(input, options);
      
      case 'company_employee_size':
      case 'target_employee_size':
        return this.mapEmployeeSize(input, options);
      
      case 'target_region':
        return this.mapTargetRegion(input, options);
      
      case 'target_audience_list_exist':
        return this.mapBoolean(input);
      
      case 'target_departments':
        return this.mapDepartments(input, options);
      
      case 'target_location':
        return this.mapLocation(input);
      
      default:
        // Generic fuzzy matching for unknown fields
        if (options) {
          const match = this.findBestMatch(input, options);
          return match?.value || input;
        }
        return input;
    }
  }

  private mapSalesObjective(input: string, options?: string[]): string | null {
    const cleanInput = input.toLowerCase();
    
    const aliases = {
      'Generate qualified leads': ['leads', 'prospects', 'generate', 'qualified', 'find customers', 'new business', 'pipeline', 'lead generation'],
      'Expand into a new region or sector': ['expand', 'growth', 'new market', 'region', 'sector', 'geographic', 'territory', 'international', 'expansion'],
      'Enrich or clean an existing list': ['enrich', 'clean', 'update', 'verify', 'enhance', 'existing list', 'data quality', 'maintain', 'improve'],
      'Purchase a new contact list': ['purchase', 'buy', 'acquire', 'contact list', 'database', 'external data', 'third party', 'buy list']
    };

    // Try alias matching first
    for (const [value, aliasList] of Object.entries(aliases)) {
      if (aliasList.some(alias => cleanInput.includes(alias))) {
        return value;
      }
    }
    
    // Pattern-based mapping
    const patterns = {
      'Generate qualified leads': [
        /lead/i, /prospect/i, /generate/i, /qualification/i, /qualified/i,
        /find.*customer/i, /new.*business/i, /pipeline/i
      ],
      'Expand into a new region or sector': [
        /expand/i, /growth/i, /new.*market/i, /region/i, /sector/i,
        /geographic/i, /territory/i, /international/i
      ],
      'Enrich or clean an existing list': [
        /enrich/i, /clean/i, /update/i, /verify/i, /enhance/i,
        /existing.*list/i, /data.*quality/i, /maintain/i
      ],
      'Purchase a new contact list': [
        /purchase/i, /buy/i, /acquire/i, /contact.*list/i, /database/i,
        /external.*data/i, /third.*party/i
      ]
    };

    // Try pattern matching first
    for (const [value, regexList] of Object.entries(patterns)) {
      if (regexList.some(regex => regex.test(input))) {
        return value;
      }
    }

    // Number selection
    const numberMatch = cleanInput.match(/^\d+$/);
    if (numberMatch && options) {
      const index = parseInt(numberMatch[0]) - 1;
      if (index >= 0 && index < options.length) {
        return options[index];
      }
    }

    // Fuzzy match
    if (options) {
      const match = this.findBestMatch(input, options);
      return match?.value || null;
    }

    return null;
  }

  private mapCompanyRole(input: string, options?: string[]): string | null {
    const cleanInput = input.toLowerCase();
    
    const aliases = {
      'Founder / CEO': ['ceo', 'founder', 'chief executive', 'owner', 'president', 'co-founder', 'founder ceo', 'startup founder'],
      'Sales Director or Manager': ['sales director', 'sales manager', 'head of sales', 'vp sales', 'sales lead', 'sales head', 'sales leader'],
      'Marketing Director or Manager': ['marketing director', 'marketing manager', 'head of marketing', 'vp marketing', 'cmo', 'marketing head', 'marketing leader'],
      'Sales Development Representative (SDR)': ['sdr', 'sales rep', 'sales representative', 'bdr', 'inside sales', 'sales development', 'business development rep'],
      'Consultant / Advisor': ['consultant', 'advisor', 'freelancer', 'contractor', 'independent', 'consulting'],
      'Other': ['other', 'misc', 'miscellaneous', 'custom', 'specialized', 'different']
    };

    // Try alias matching
    for (const [value, aliasList] of Object.entries(aliases)) {
      if (aliasList.some(alias => cleanInput.includes(alias))) {
        return value;
      }
    }

    // Number selection and fuzzy match
    return this.handleStandardSelection(input, options);
  }

  private mapShortTermGoal(input: string, options?: string[]): string | null {
    const cleanInput = input.toLowerCase();

    // Restrict mapping to only the two allowed options
    const orderedAliases: Array<[string, string[]]> = [
      ['Create a new list from scratch', ['create', 'new', 'build', 'scratch', 'fresh', 'start new', 'build list', 'from scratch']],
      ['Purchase or download contacts', ['purchase', 'buy', 'download', 'buy contacts', 'download list', 'contact list', 'contacts']]
    ];

    for (const [value, aliasList] of orderedAliases) {
      if (aliasList.some(alias => cleanInput.includes(alias))) {
        return value;
      }
    }

    // Patterns, ordered similarly (only two options)
    const patterns: Array<[string, RegExp[]]> = [
      ['Create a new list from scratch', [/create/i, /new/i, /build/i, /scratch/i, /fresh/i, /from\s+scratch/i]],
      ['Purchase or download contacts', [/purchase/i, /buy/i, /download/i, /contact\b/i, /contacts\b/i]]
    ];

    for (const [value, regexList] of patterns) {
      if (regexList.some(regex => regex.test(input))) {
        return value;
      }
    }

    // Only allow selection among the two allowed options
    const allowed = options?.filter(o => o === 'Purchase or download contacts' || o === 'Create a new list from scratch')
      || ['Purchase or download contacts', 'Create a new list from scratch'];
    return this.handleStandardSelection(input, allowed);
  }

  private mapWebsiteUrl(input: string): string | null {
    const cleanInput = input.trim();
    
    // Handle skip cases
    if (['skip', 'none', 'not applicable', 'na', 'null', ''].includes(cleanInput.toLowerCase())) {
      return '';
    }

    // URL patterns
    const urlPatterns = [
      /^https?:\/\//i,
      /^www\./i,
      /\.(com|org|net|io|ai|co|gov|edu|ly|me|app|dev)/i
    ];

    // Check if it looks like a URL or domain
    if (urlPatterns.some(pattern => pattern.test(cleanInput)) || 
        (cleanInput.includes('.') && !cleanInput.includes(' ') && cleanInput.length > 4)) {
      let url = cleanInput;
      if (!url.startsWith('http')) {
        url = 'https://' + url.replace(/^www\./, '');
      }
      return url;
    }

    // If it doesn't look like a URL, return null so it gets stored as _raw
    return null;
  }

  private mapGtm(input: string, options?: string[]): string | null {
    const cleanInput = input.toLowerCase();
    
    const aliases = {
      'B2B': ['b2b', 'business to business', 'enterprise', 'corporate', 'business', 'b-to-b'],
      'B2C': ['b2c', 'business to consumer', 'consumer', 'retail', 'customer', 'b-to-c'],
      'B2G': ['b2g', 'business to government', 'government', 'public sector', 'b-to-g'],
      'BOTH': ['both', 'all', 'mixed', 'multiple', 'hybrid', 'combined']
    };

    // Try alias matching
    for (const [value, aliasList] of Object.entries(aliases)) {
      if (aliasList.some(alias => cleanInput.includes(alias))) {
        return value;
      }
    }

    return this.handleStandardSelection(input, options);
  }

  private mapIndustry(input: string, options?: string[]): string | null {
    const cleanInput = input.toLowerCase();
    
    // First, try exact match against the full industry names
    if (options) {
      const exactMatch = options.find(option => option.toLowerCase() === cleanInput);
      if (exactMatch) {
        return exactMatch;
      }
    }
    
    const aliases = {
      'Accounting/Finance': ['accounting', 'finance', 'financial', 'banking', 'fintech', 'investment', 'cpa', 'accountant'],
      'Advertising/Public Relations': ['advertising', 'ad', 'pr', 'public relations', 'marketing', 'media', 'creative'],
      'Aerospace/Aviation': ['aerospace', 'aviation', 'aircraft', 'airline', 'space', 'defense', 'military'],
      'Agriculture/Livestock': ['agriculture', 'farming', 'livestock', 'crop', 'dairy', 'poultry', 'farm'],
      'Animal Care/Pet Services': ['pet', 'veterinary', 'animal care', 'pet care', 'vet', 'dog', 'cat', 'pet services'],
      'Arts/Entertainment/Publishing': ['arts', 'entertainment', 'publishing', 'media', 'film', 'music', 'theater', 'creative'],
      'Automotive': ['automotive', 'car', 'auto', 'vehicle', 'dealership', 'transportation'],
      'Banking/Mortgage': ['banking', 'mortgage', 'bank', 'lending', 'credit', 'loan'],
      'Business Development': ['business development', 'biz dev', 'partnership', 'growth', 'expansion'],
      'Business Opportunity': ['business opportunity', 'franchise', 'startup', 'entrepreneur'],
      'Clerical/Administrative': ['clerical', 'administrative', 'admin', 'office', 'secretarial', 'reception'],
      'Construction/Facilities': ['construction', 'facilities', 'building', 'contractor', 'infrastructure', 'maintenance'],
      'Education/Research': ['education', 'research', 'academic', 'university', 'school', 'college', 'learning', 'education/research'],
      'Energy/Utilities': ['energy', 'utilities', 'power', 'oil', 'gas', 'renewable', 'electric', 'water'],
      'Food/Beverage': ['food', 'beverage', 'restaurant', 'catering', 'dining', 'culinary', 'f&b'],
      'Government/Non-Profit': ['government', 'non-profit', 'nonprofit', 'public sector', 'ngo', 'charity'],
      'Healthcare/Wellness': ['healthcare', 'health', 'medical', 'pharma', 'biotech', 'hospital', 'clinic', 'wellness'],
      'Legal/Security': ['legal', 'law', 'security', 'attorney', 'lawyer', 'compliance', 'cybersecurity'],
      'Manufacturing/Industrial': ['manufacturing', 'industrial', 'factory', 'production', 'plant', 'machinery'],
      'Real Estate/Property': ['real estate', 'property', 'housing', 'construction', 'realtor', 'development'],
      'Retail/Wholesale': ['retail', 'wholesale', 'commerce', 'shopping', 'store', 'ecommerce', 'merchandise'],
      'Technology/IT': ['technology', 'tech', 'it', 'software', 'saas', 'computer', 'digital', 'tech company'],
      'Transportation/Logistics': ['transportation', 'logistics', 'shipping', 'freight', 'delivery', 'supply chain'],
      'Other': ['other', 'misc', 'miscellaneous', 'custom', 'specialized'],
      'NA': ['na', 'n/a', 'not applicable', 'none', 'skip']
    };

    // Try exact alias matching first (more strict)
    for (const [value, aliasList] of Object.entries(aliases)) {
      if (aliasList.some(alias => cleanInput === alias)) {
        return value;
      }
    }

    // Try partial alias matching (less strict, but with priority for longer matches)
    const matches: Array<{value: string, score: number}> = [];
    for (const [value, aliasList] of Object.entries(aliases)) {
      for (const alias of aliasList) {
        if (cleanInput.includes(alias) || alias.includes(cleanInput)) {
          // Score based on match length - longer matches get higher priority
          const score = Math.min(alias.length, cleanInput.length) / Math.max(alias.length, cleanInput.length);
          matches.push({value, score});
        }
      }
    }

    // Sort by score (highest first) and return the best match
    if (matches.length > 0) {
      matches.sort((a, b) => b.score - a.score);
      return matches[0].value;
    }

    // If no alias matches, try fuzzy matching with higher threshold
    if (options) {
      const match = this.findBestMatch(input, options, 80); // Higher threshold for industry
      return match?.value || null;
    }

    return null;
  }

  private mapIndustries(input: string, options?: string[]): string[] {
    // Tokenize by common separators to support multi-select natural input
    const tokens = input
      .split(/[,;\n\|]/)
      .map(t => t.trim())
      .filter(Boolean);

    const selected: string[] = [];
    const candidateTokens = tokens.length > 0 ? tokens : [input];

    for (const token of candidateTokens) {
      const mapped = this.mapIndustry(token, options);
      if (mapped && !selected.includes(mapped)) {
        selected.push(mapped);
      }
    }

    return selected;
  }

  private mapRevenueSize(input: string, options?: string[]): string | null {
    const cleanInput = input.toLowerCase();
    
    const aliases = {
      '0-500K': ['under 500k', 'less than 500k', 'below 500k', 'small', 'startup', 'micro', 'under 500 thousand'],
      '500K-1M': ['500k to 1m', '500k-1m', '500 thousand to 1 million', 'small-medium'],
      '1M-5M': ['1m to 5m', '1m-5m', '1 million to 5 million', 'medium'],
      '5M-10M': ['5m to 10m', '5m-10m', '5 million to 10 million'],
      '10M-50M': ['10m to 50m', '10m-50m', '10 million to 50 million', 'mid-market'],
      '50M-100M': ['50m to 100m', '50m-100m', '50 million to 100 million'],
      '100M-500M': ['100m to 500m', '100m-500m', '100 million to 500 million', 'large'],
      '500M-1B': ['500m to 1b', '500m-1b', '500 million to 1 billion'],
      '1B-5B': ['1b to 5b', '1b-5b', '1 billion to 5 billion', 'enterprise'],
      '5B+': ['over 5b', 'above 5b', 'more than 5b', '5b+', 'fortune 500', 'large enterprise'],
      'NA': ['na', 'n/a', 'not applicable', 'none', 'skip', 'unknown']
    };

    // Try alias matching first
    for (const [value, aliasList] of Object.entries(aliases)) {
      if (aliasList.some(alias => cleanInput.includes(alias))) {
        return value;
      }
    }

    // Pattern matching for revenue sizes
    if (/under|less.*500|<.*500|below.*500/i.test(input)) return '0-500K';
    if (/500k.*1m|500.*thousand.*1.*million/i.test(input)) return '500K-1M';
    if (/1m.*5m|1.*million.*5.*million/i.test(input)) return '1M-5M';
    if (/5m.*10m|5.*million.*10.*million/i.test(input)) return '5M-10M';
    if (/10m.*50m|10.*million.*50.*million/i.test(input)) return '10M-50M';
    if (/50m.*100m|50.*million.*100.*million/i.test(input)) return '50M-100M';
    if (/100m.*500m|100.*million.*500.*million/i.test(input)) return '100M-500M';
    if (/500m.*1b|500.*million.*1.*billion/i.test(input)) return '500M-1B';
    if (/1b.*5b|1.*billion.*5.*billion/i.test(input)) return '1B-5B';
    if (/over|more.*5b|>.*5b|above.*5b/i.test(input)) return '5B+';

    return this.handleStandardSelection(input, options);
  }

  private mapEmployeeSize(input: string, options?: string[]): string | null {
    const cleanInput = input.toLowerCase();
    
    const aliases = {
      '0-10': ['under 10', 'less than 10', 'below 10', 'small', 'startup', 'micro', 'tiny'],
      '11-50': ['11 to 50', '11-50', 'small-medium', 'small company'],
      '51-200': ['51 to 200', '51-200', 'medium', 'medium company'],
      '201-500': ['201 to 500', '201-500', 'large', 'large company'],
      '501-1000': ['501 to 1000', '501-1000', 'large-medium'],
      '1000-5000': ['1000 to 5000', '1000-5000', 'enterprise', 'big company'],
      '5001-10000': ['5001 to 10000', '5001-10000', 'large enterprise'],
      '10001-50000': ['10001 to 50000', '10001-50000', 'huge', 'fortune 500'],
      '50001-100000': ['50001 to 100000', '50001-100000', 'massive'],
      '100000+': ['over 100000', 'above 100000', 'more than 100000', '100000+', 'fortune 100'],
      'NA': ['na', 'n/a', 'not applicable', 'none', 'skip', 'unknown']
    };

    // Try alias matching first
    for (const [value, aliasList] of Object.entries(aliases)) {
      if (aliasList.some(alias => cleanInput.includes(alias))) {
        return value;
      }
    }

    // Pattern matching for employee sizes
    if (/under|less.*10|<.*10|below.*10|small|startup/i.test(input)) return '0-10';
    if (/11.*50|small.*medium/i.test(input)) return '11-50';
    if (/51.*200|medium/i.test(input)) return '51-200';
    if (/201.*500|large/i.test(input)) return '201-500';
    if (/501.*1000/i.test(input)) return '501-1000';
    if (/1000.*5000|enterprise/i.test(input)) return '1000-5000';
    if (/5001.*10000/i.test(input)) return '5001-10000';
    if (/10001.*50000/i.test(input)) return '10001-50000';
    if (/50001.*100000/i.test(input)) return '50001-100000';
    if (/over|more.*100000|>.*100000|massive|huge/i.test(input)) return '100000+';

    return this.handleStandardSelection(input, options);
  }

  private mapTargetRegion(input: string, options?: string[]): string | null {
    const cleanInput = input.toLowerCase();
    
    const aliases = {
      'India': ['india', 'indian', 'south asia', 'delhi', 'mumbai', 'bangalore', 'hyderabad'],
      'North America': ['north america', 'usa', 'us', 'america', 'canada', 'mexico', 'united states', 'states'],
      'Europe': ['europe', 'european', 'eu', 'uk', 'britain', 'germany', 'france', 'spain', 'italy'],
      'Asia-Pacific': ['asia pacific', 'asia', 'apac', 'pacific', 'australia', 'japan', 'china', 'singapore', 'hong kong'],
      'Global / Multiple regions': ['global', 'worldwide', 'international', 'multiple', 'all regions', 'everywhere']
    };

    // Try alias matching
    for (const [value, aliasList] of Object.entries(aliases)) {
      if (aliasList.some(alias => cleanInput.includes(alias))) {
        return value;
      }
    }

    return this.handleStandardSelection(input, options);
  }

  private mapBoolean(input: string): boolean | null {
    const cleanInput = input.toLowerCase();
    
    // True patterns
    if (['yes', 'y', 'true', '1', 'have', 'exist', 'exists', 'got', 'do', 'already'].some(val => cleanInput.includes(val))) {
      return true;
    }
    
    // False patterns
    if (['no', 'n', 'false', '0', 'dont', "don't", 'none', 'nothing', 'not', 'build', 'create'].some(val => cleanInput.includes(val))) {
      return false;
    }
    
    return null;
  }

  private mapDepartments(input: string, options?: string[]): string[] {
    const cleanInput = input.toLowerCase();
    const canonicalOptions = options && options.length > 0
      ? options
      : ['C-suite', 'Sales', 'Marketing', 'Product', 'Engineering', 'IT', 'Operations', 'HR', 'Finance', 'Procurement', 'Support', 'Legal', 'R&D', 'Supply Chain', 'Data/Analytics', 'Other'];

    const matches: string[] = [];

    // Tokenize by common separators for multi-select text inputs
    const tokens = cleanInput
      .split(/[,;\n\|]/)
      .map(t => t.trim())
      .filter(Boolean);

    // Synonym map to canonical department names
    const synonymMap: Record<string, string> = {
      // Data/Analytics
      'data': 'Data/Analytics',
      'analytics': 'Data/Analytics',
      'business intelligence': 'Data/Analytics',
      'bi': 'Data/Analytics',
      'insights': 'Data/Analytics',
      'data science': 'Data/Analytics',
      'data analyst': 'Data/Analytics',
      'data engineering': 'Data/Analytics',
      // Product
      'product': 'Product',
      'product management': 'Product',
      'pm': 'Product',
      'product manager': 'Product',
      // Support / Success
      'support': 'Support',
      'customer support': 'Support',
      'customer success': 'Support',
      'helpdesk': 'Support',
      'service': 'Support',
      // Legal
      'legal': 'Legal',
      'law': 'Legal',
      'compliance': 'Legal',
      // R&D
      'r&d': 'R&D',
      'rnd': 'R&D',
      'research': 'R&D',
      'laboratory': 'R&D',
      'lab': 'R&D',
      'development': 'Engineering',
      // Supply Chain
      'supply chain': 'Supply Chain',
      'fulfillment': 'Supply Chain',
      'logistics': 'Operations',
      // Existing ones
      'c-suite': 'C-suite',
      'executive': 'C-suite',
      'c-level': 'C-suite',
      'sales': 'Sales',
      'marketing': 'Marketing',
      'engineering': 'Engineering',
      'it': 'IT',
      'information technology': 'IT',
      'operations': 'Operations',
      'ops': 'Operations',
      'hr': 'HR',
      'human resources': 'HR',
      'finance': 'Finance',
      'accounting': 'Finance',
      'procurement': 'Procurement',
      'purchasing': 'Procurement',
      'sourcing': 'Procurement'
    };

    // First pass: synonyms (use word-boundary matching for short keys like "it")
    const wordBoundaryMatch = (text: string, key: string): boolean => {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z])${escaped}([^a-zA-Z]|$)`, 'i');
      return regex.test(text);
    };
    for (const token of tokens.length ? tokens : [cleanInput]) {
      for (const [key, canonical] of Object.entries(synonymMap)) {
        const isShort = key.length <= 3 && /^[a-zA-Z]+$/.test(key);
        const hit = isShort ? wordBoundaryMatch(token, key) : token.includes(key);
        if (hit) {
          const selected = canonicalOptions.find(opt => opt.toLowerCase() === canonical.toLowerCase());
          if (selected && !matches.includes(selected)) {
            matches.push(selected);
          }
        }
      }
    }

    // Second pass: exact match against provided options
    for (const token of tokens.length ? tokens : [cleanInput]) {
      const exact = canonicalOptions.find(opt => opt.toLowerCase() === token);
      if (exact && !matches.includes(exact)) {
        matches.push(exact);
      }
    }

    // Third pass: fuzzy matching against provided options
    if (matches.length === 0) {
      for (const token of tokens.length ? tokens : [cleanInput]) {
        const match = this.findBestMatch(token, canonicalOptions, 70);
        if (match && !matches.includes(match.value)) {
          matches.push(match.value);
        }
      }
    }

    // Fallback
    return matches.length > 0 ? matches : ['Other'];
  }

  private mapLocation(input: string): string {
    // Just return the input as-is for location - it's free text
    return input.trim();
  }

  private handleStandardSelection(input: string, options?: string[]): string | null {
    if (!options) return input;

    const cleanInput = input.toLowerCase();
    
    // Number selection
    const numberMatch = cleanInput.match(/^\d+$/);
    if (numberMatch) {
      const index = parseInt(numberMatch[0]) - 1;
      if (index >= 0 && index < options.length) {
        return options[index];
      }
    }

    // Fuzzy match
    const match = this.findBestMatch(input, options);
    return match?.value || null;
  }
}

export const fuzzyMatcher = new FuzzyMatcher();
