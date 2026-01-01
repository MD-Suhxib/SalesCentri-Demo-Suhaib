// Onboarding Smart Router - Conversational onboarding system
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { fuzzyMatcher } from "../fuzzyMatcher";

export interface OnboardingField {
  name: string;
  type: 'select' | 'text' | 'boolean' | 'array';
  required: boolean;
  options?: string[];
  currentValue?: unknown;
}

export interface OnboardingState {
  id?: number;
  organization_id?: number;
  anon_id?: string;
  sales_objective?: string;
  sales_objective_raw?: string;
  company_role?: string;
  company_role_raw?: string;
  short_term_goal?: string;
  short_term_goal_raw?: string;
  website_url?: string;
  gtm?: string;
  gtm_raw?: string;
  target_industries?: string[];
  target_industries_raw?: string[];
  target_revenue_size?: string;
  target_revenue_size_raw?: string;
  target_employee_size?: string;
  target_employee_size_raw?: string;
  target_departments?: string[];
  target_departments_raw?: string;
  target_region?: string;
  target_region_raw?: string;
  target_location?: string;
  target_audience_list_exist?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ConversationAnalysis {
  nextField: string | null;
  extractedValues: Partial<OnboardingState>;
  question: string;
  isComplete: boolean;
  needsClarification: boolean;
  clarificationMessage?: string;
}

export class OnboardingSmartRouter {
  private llm: ChatGoogleGenerativeAI;
  
  // Onboarding field definitions based on API documentation
  private readonly onboardingFields: Record<string, OnboardingField> = {
    sales_objective: {
      name: 'sales_objective',
      type: 'array',
      required: true,
      options: [
        'Generate qualified leads',
        'Expand into a new region or sector',
        'Enrich or clean an existing list',
        'Purchase a new contact list'
      ]
    },
    company_role: {
      name: 'company_role',
      type: 'array',
      required: true,
      options: [
        'Founder / CEO',
        'Sales Director or Manager',
        'Marketing Director or Manager',
        'Sales Development Representative (SDR)',
        'Consultant / Advisor',
        'Other'
      ]
    },
    short_term_goal: {
      name: 'short_term_goal',
      type: 'select',
      required: true,
      options: [
        'Purchase or download contacts',
        'Create a new list from scratch',
      ]
    },
    website_url: {
      name: 'website_url',
      type: 'text',
      required: true
    },
    gtm: {
      name: 'gtm',
      type: 'array',
      required: true,
      options: ['B2B', 'B2C', 'B2G', 'BOTH (B2B & B2C)']
    },
    target_industries: {
      name: 'target_industries',
      type: 'array',
      required: true,
      options: [
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
      ]
    },
    target_revenue_size: {
      name: 'target_revenue_size',
      type: 'array',
      required: true,
      options: [
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
      ]
    },
    target_employee_size: {
      name: 'target_employee_size',
      type: 'array',
      required: true,
      options: [
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
      ]
    },
    target_departments: {
      name: 'target_departments',
      type: 'array',
      required: true,
      options: [
        'C-suite',
        'Sales',
        'Marketing',
        'Product',
        'Engineering',
        'IT',
        'Operations',
        'HR',
        'Finance',
        'Procurement',
        'Support',
        'Legal',
        'R&D',
        'Supply Chain',
        'Data/Analytics',
        'Other'
      ]
    },
    target_region: {
      name: 'target_region',
      type: 'array',
      required: true,
      options: [
        'India',
        'North America',
        'Europe',
        'Asia-Pacific',
        'Global / Multiple regions'
      ]
    },
    target_location: {
      name: 'target_location',
      type: 'text',
      required: true
    },
    target_audience_list_exist: {
      name: 'target_audience_list_exist',
      type: 'array',
      required: false,
      options: ['Yes', 'No']
    }
  };

  // Define the onboarding flow sequence
  private readonly onboardingSequence = [
    'sales_objective',
    'company_role',
    'short_term_goal',
    'website_url',
    'gtm',
    'target_industries',
    'target_revenue_size',
    'target_employee_size',
    'target_departments',
    'target_region',
    'target_location',
    'target_audience_list_exist'
  ];

  constructor() {
    this.llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.3,
      maxOutputTokens: 500,
    });
  }

  /**
   * Analyze conversation and determine next onboarding step
   */
  public async analyzeConversation(
    userMessage: string,
    currentState: OnboardingState,
    conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = []
  ): Promise<ConversationAnalysis> {
    console.log('🎯 ONBOARDING ROUTER: Analyzing conversation for next step');
    
    // Determine what fields are missing
    const missingRequiredFields = this.getMissingRequiredFields(currentState);
    const currentNextField = this.getNextField(currentState);
    
    console.log(`📋 MISSING REQUIRED FIELDS: ${missingRequiredFields.join(', ')}`);
    console.log(`➡️ NEXT FIELD (including optional): ${currentNextField}`);

    // Extract values from user message
    const extractedValues = await this.extractValuesFromMessage(
      userMessage,
      currentNextField,
      conversationHistory
    );

    // Calculate the NEXT field after applying extracted values
    const updatedState = { ...currentState, ...extractedValues };
    const nextFieldAfterExtraction = this.getNextField(updatedState);
    const updatedMissingRequiredFields = this.getMissingRequiredFields(updatedState);
    
    console.log(`🔄 AFTER EXTRACTION - MISSING REQUIRED FIELDS: ${updatedMissingRequiredFields.join(', ')}`);
    console.log(`🔄 AFTER EXTRACTION - NEXT FIELD: ${nextFieldAfterExtraction}`);

    // Check if onboarding is complete - when no next field in sequence
    const isComplete = nextFieldAfterExtraction === null;

    // Generate next question based on the updated state
    const question = await this.generateNextQuestion(
      nextFieldAfterExtraction,
      updatedState,
      extractedValues
    );

    return {
      nextField: nextFieldAfterExtraction,
      extractedValues,
      question,
      isComplete,
      needsClarification: false
    };
  }

  /**
   * Fields that support multiple selections and must be stored as arrays.
   */
  private readonly multiSelectFields = new Set(['target_industries', 'target_departments']);

  /**
   * Normalizes extracted values to match onboarding state expectations.
   */
  private normalizeExtractedValue(
    targetField: string,
    value: string | string[] | boolean | null | undefined
  ): Partial<OnboardingState> {
    if (value === null || value === undefined) {
      return {};
    }

    if (this.multiSelectFields.has(targetField)) {
      const asArray = Array.isArray(value) ? value : [value];
      const normalized = Array.from(
        new Set(
          asArray
            .map((item) => (typeof item === 'string' ? item.trim() : String(item).trim()))
            .filter((item) => item.length > 0)
        )
      );

      if (normalized.length === 0) {
        return {};
      }

      return { [targetField]: normalized } as Partial<OnboardingState>;
    }

    if (Array.isArray(value)) {
      const firstNonEmpty = value.find(
        (item) => typeof item === 'string' && item.trim().length > 0
      );
      if (firstNonEmpty) {
        return { [targetField]: firstNonEmpty } as Partial<OnboardingState>;
      }
      return {};
    }

    return { [targetField]: value } as Partial<OnboardingState>;
  }

  /**
   * Extract values from user message based on current context
   */
  private async extractValuesFromMessage(
    userMessage: string,
    targetField: string | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
  ): Promise<Partial<OnboardingState>> {
    if (!targetField) return {};

    const field = this.onboardingFields[targetField];
    if (!field) return {};

    // Clean the user input (remove leading/trailing whitespace and newlines)
    const cleanedMessage = userMessage.trim();
    console.log(`🔍 EXTRACTING VALUES: Field=${targetField}, Input="${cleanedMessage}" (original: "${userMessage}")`);

    // Step 0: BULLETPROOF EXACT MATCH - If input exactly matches any predefined option, use it immediately
    // This prevents any predefined answer from going to _raw fields
    if (field.options && field.options.length > 0) {
      const exactMatch = field.options.find(option => option === cleanedMessage);
      if (exactMatch) {
        console.log(`✅ EXACT MATCH (PREDEFINED): "${cleanedMessage}" → "${exactMatch}"`);
        return this.normalizeExtractedValue(targetField, exactMatch);
      }
      
      // Also check case-insensitive exact match
      const caseInsensitiveMatch = field.options.find(
        option => option.toLowerCase() === cleanedMessage.toLowerCase()
      );
      if (caseInsensitiveMatch) {
        console.log(`✅ EXACT MATCH (CASE-INSENSITIVE): "${cleanedMessage}" → "${caseInsensitiveMatch}"`);
        return this.normalizeExtractedValue(targetField, caseInsensitiveMatch);
      }
    }

    // Step 1: Use intelligent fuzzy matching first
    const fuzzyResult = fuzzyMatcher.mapOnboardingResponse(cleanedMessage, targetField, field.options);
    
    if (fuzzyResult !== null) {
      console.log(`🚀 FUZZY MATCH SUCCESS: "${cleanedMessage}" → "${fuzzyResult}"`);
      return this.normalizeExtractedValue(targetField, fuzzyResult);
    }

    // Step 2: Handle text fields
    if (field.type === 'text') {
      if (targetField === 'target_location') {
        const lower = cleanedMessage.toLowerCase();
        const emptySignals = ['no', 'n', 'none', 'null', 'na', 'not applicable', "don't have", 'do not have', 'nope'];
        if (emptySignals.some(sig => lower === sig)) {
          console.log('📝 LOCATION SET TO NULL SENTINEL ("null")');
          return { [targetField]: 'null' } as Partial<OnboardingState>;
        }
      }
      console.log(`📝 TEXT FIELD ACCEPTED: "${cleanedMessage}"`);
      return { [targetField]: cleanedMessage };
    }

    // Step 3: Handle array fields - parse as comma-separated list
    if (field.type === 'array') {
      const arrayValue = this.parseArrayValue(cleanedMessage);
      if (arrayValue.length > 0) {
        console.log(`📝 ARRAY FIELD ACCEPTED: ${arrayValue}`);
        return this.normalizeExtractedValue(targetField, arrayValue);
      }
    }

    // Step 4: Handle boolean fields
    if (field.type === 'boolean') {
      const boolValue = this.parseBooleanValue(cleanedMessage);
      if (boolValue !== null) {
        console.log(`📝 BOOLEAN FIELD ACCEPTED: ${boolValue}`);
        return { [targetField]: boolValue };
      }
    }

    // Step 5: Handle select fields - store as _raw if no match
    if (field.type === 'select' && field.options) {
      const rawFieldName = `${targetField}_raw` as keyof OnboardingState;
      console.log(`📝 STORING AS RAW: Field=${rawFieldName}, Value="${cleanedMessage}"`);
      return { [rawFieldName]: cleanedMessage };
    }

    console.log(`⚠️ NO MATCH FOUND: Field=${targetField}, Input="${cleanedMessage}"`);
    return {};
  }

  private parseBooleanValue(value: string): boolean | null {
    const lowerValue = value.toLowerCase().trim();
    
    const trueValues = ['true', 'yes', 'y', '1', 'have', 'exist', 'exists', 'got', 'do'];
    const falseValues = ['false', 'no', 'n', '0', 'dont', "don't", 'none', 'nothing', 'build'];
    
    if (trueValues.some(v => lowerValue.includes(v))) return true;
    if (falseValues.some(v => lowerValue.includes(v))) return false;
    
    return null;
  }


  /**
   * Parse array value from text input
   */
  private parseArrayValue(input: string): string[] {
    return input
      .split(/[,;&\n]/)
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => item.replace(/^["']|["']$/g, ''));
  }

  /**
   * Helper function to format options as clickable buttons
   */
  private formatOptions(options: string[], fieldName: string, inlineStyle?: string): string {
    // Helper function to format option display text
    const formatOptionDisplay = (option: string, field: string): string => {
      // Add $ signs to revenue size options for display
      if (field === 'target_revenue_size' && option !== 'NA') {
        // Add $ signs to revenue ranges
        if (option.includes('-')) {
          const [min, max] = option.split('-');
          return `$${min}-$${max}`;
        } else if (option.includes('+')) {
          return `$${option}`;
        } else if (option.includes('K') || option.includes('M') || option.includes('B')) {
          return `$${option}`;
        }
      }
      return option;
    };

    // For all fields (select and array), create inline buttons layout
    // Special multi-select UI for target_departments is handled in generateNextQuestion
    return options.map(option => {
      const displayText = formatOptionDisplay(option, fieldName);
      const attr = inlineStyle ? `style="${inlineStyle}"` : `class="option-button"`;
      return `<button onclick="window.selectOption('${option}')" ${attr}>${displayText}</button>`;
    }).join(' ');
  }

  /**
   * Get base question text for each field
   */
  private getBaseQuestion(fieldName: string, rawValue?: string): string {
    const field = this.onboardingFields[fieldName];
    const isMultiSelect = field?.type === 'array' && fieldName !== 'target_departments';
    
    const baseQuestions: Record<string, string> = {
      sales_objective: rawValue ? 
        `I understand you mentioned "${rawValue}". Let me help you pick from our standard options:` :
        `Welcome to SalesCentri! What's your primary sales objective?${isMultiSelect ? '' : ''}`,
      company_role: rawValue ?
        `Thanks for letting me know about "${rawValue}". Please choose from these standard roles:` :
        `What's your role in the company?${isMultiSelect ? '' : ''}`,
      short_term_goal: rawValue ?
        `I noted "${rawValue}". Let me offer these specific goals:` :
        `What is your immediate goal?`,
      gtm: rawValue ?
        `Thanks for mentioning "${rawValue}". Please select your market focus:` :
        `What's your go-to-market focus?${isMultiSelect ? '' : ''}`,
      target_industries: rawValue ? 
        `I see you mentioned "${rawValue}". Here are our industry categories:` :
        `What industries do you want to target? (You can select multiple)`,
      target_revenue_size: rawValue ?
        `Thanks for the info "${rawValue}". Please choose a revenue range:` :
        `What's the revenue size of companies you want to target?${isMultiSelect ? '' : ''}`,
      target_employee_size: rawValue ?
        `Got it, "${rawValue}". Please select an employee size range:` :
        `What's the employee size of companies you want to target?${isMultiSelect ? '' : ''}`,
      target_region: rawValue ?
        `Thanks for "${rawValue}". Please choose from these regions:` :
        `Which geographic region do you want to target?${isMultiSelect ? '' : ''}`,
      target_audience_list_exist: rawValue ?
        `Thanks for "${rawValue}". Please choose from these options:` :
        `Do you already have a target audience list?`,
    };
    
    return baseQuestions[fieldName] || "Please select from the options below:";
  }

  /**
   * Generate the next question based on current state
   */
  private async generateNextQuestion(
    nextField: string | null,
    currentState: OnboardingState,
    extractedValues: Partial<OnboardingState>
  ): Promise<string> {
    if (!nextField) {
      return "🎉 Excellent! Your onboarding is complete. I have all the information I need to create your personalized sales strategy. Let's move to your dashboard where you can start generating qualified leads and insights tailored to your business.";
    }

    const field = this.onboardingFields[nextField];
    if (!field) {
      return "Let's continue with your onboarding.";
    }

    // Check if we have a _raw value for this field (user provided invalid response)
    const rawFieldName = `${nextField}_raw` as keyof OnboardingState;
    const hasRawValue = currentState[rawFieldName] || extractedValues[rawFieldName];

     // Special multi-select UI for target_departments - working version with oval buttons
     if (nextField === 'target_departments' && field.options) {
       const baseQuestion = `Select all departments you want to target, then click Done.`;

       const chipStyleBase = [
         'display:inline-flex',
         'align-items:center',
         'gap:8px',
         'padding:8px 12px',
         'margin:4px',
         'border-radius:999px',
         'cursor:pointer',
         'font-size:13px',
         'line-height:1',
         'user-select:none',
         'border:1px solid #4b5563',
         'background:#374151',
         'color:#e5e7eb'
       ].join(';');

       const doneStyle = [
         'background:#10b981',
         'color:#06281e',
         'border:1px solid #0ea5a0',
         'padding:8px 14px',
         'margin:4px 2px 0 2px',
         'border-radius:6px',
         'cursor:pointer',
         'font-weight:600',
         'display:inline-block'
       ].join(';');

       const hintStyle = [
         'font-size:12px',
         'color:#9ca3af',
         'margin-bottom:8px'
       ].join(';');

       const chips = field.options.map(opt => {
         const safe = opt.replace(/'/g, "\\'");
         const onclick = ` (function(el){
           window.__deptSel = window.__deptSel || new Set();
           var k='${safe}';
           if(window.__deptSel.has(k)){ window.__deptSel.delete(k); } else { window.__deptSel.add(k); }
           var sel = window.__deptSel.has(k);
           el.style.background = sel ? '#2563eb' : '#374151';
           el.style.borderColor = sel ? '#1d4ed8' : '#4b5563';
           el.style.color = sel ? '#ffffff' : '#e5e7eb';
         })(this)`;
         return `<span data-chip="${opt}" onclick="${onclick}" style="${chipStyleBase}">${opt}</span>`;
       }).join(' ');

       const doneOnclick = [
         "(function(){",
         "var arr = Array.from(window.__deptSel || []);",
         "if(window.selectOption){ window.selectOption(arr.join(', ')); }",
         "window.__deptSel = new Set();",
         "})()"
       ].join('');

       return [
         baseQuestion,
         `<div style="${hintStyle}">You can select multiple.</div>`,
         `<div style="display:block;overflow:visible;max-height:none;margin-bottom:8px">${chips}</div>`,
         `<div style="text-align:left;margin-top:4px"><span role="button" tabindex="0" onclick="${doneOnclick}" style="${doneStyle}">Done</span></div>`
       ].join('<br/>');
     }

     // Special multi-select UI for target_industries - same UX as departments
     if (nextField === 'target_industries' && field.options) {
       const baseQuestion = `Select all industries you want to target, then click Done.`;

       const chipStyleBase = [
         'display:inline-flex',
         'align-items:center',
         'gap:8px',
         'padding:8px 12px',
         'margin:4px',
         'border-radius:999px',
         'cursor:pointer',
         'font-size:13px',
         'line-height:1',
         'user-select:none',
         'border:1px solid #4b5563',
         'background:#374151',
         'color:#e5e7eb'
       ].join(';');

       const doneStyle = [
         'background:#10b981',
         'color:#06281e',
         'border:1px solid #0ea5a0',
         'padding:8px 14px',
         'margin:4px 2px 0 2px',
         'border-radius:6px',
         'cursor:pointer',
         'font-weight:600',
         'display:inline-block'
       ].join(';');

       const hintStyle = [
         'font-size:12px',
         'color:#9ca3af',
         'margin-bottom:8px'
       ].join(';');

       const chips = field.options.map(opt => {
         const safe = opt.replace(/'/g, "\\'");
         const onclick = ` (function(el){
           window.__indSel = window.__indSel || new Set();
           var k='${safe}';
           if(window.__indSel.has(k)){ window.__indSel.delete(k); } else { window.__indSel.add(k); }
           var sel = window.__indSel.has(k);
           el.style.background = sel ? '#2563eb' : '#374151';
           el.style.borderColor = sel ? '#1d4ed8' : '#4b5563';
           el.style.color = sel ? '#ffffff' : '#e5e7eb';
         })(this)`;
         return `<span data-chip="${opt}" onclick="${onclick}" style="${chipStyleBase}">${opt}</span>`;
       }).join(' ');

       const doneOnclick = [
         "(function(){",
         "var arr = Array.from(window.__indSel || []);",
         "if(window.selectOption){ window.selectOption(arr.join(', ')); }",
         "window.__indSel = new Set();",
         "})()"
       ].join('');

       return [
         baseQuestion,
         `<div style="${hintStyle}">You can select multiple.</div>`,
         `<div style="display:block;overflow:visible;max-height:none;margin-bottom:8px">${chips}</div>`,
         `<div style=\"text-align:left;margin-top:4px\"><span role=\"button\" tabindex=\"0\" onclick=\"${doneOnclick}\" style=\"${doneStyle}\">Done</span></div>`
       ].join('<br/>');
     }

    // Generate question based on field type and options
    if ((field.type === 'select' || field.type === 'array') && field.options) {
      const baseQuestion = this.getBaseQuestion(nextField, hasRawValue as string);
      // Use fixed inline styles to avoid size flicker across messages
      const inlineButtonStyle = [
        'background:#374151',
        'color:#e5e7eb',
        'border:1px solid #4b5563',
        'padding:8px 14px',
        'margin:4px',
        'border-radius:6px',
        'cursor:pointer',
        'font-size:13px',
        'display:inline-block',
        'max-width:100%',
        'box-sizing:border-box',
        'line-height:1.2',
        'text-align:center'
      ].join(';');

      const optionsList = this.formatOptions(field.options, nextField, inlineButtonStyle);
      const question = `${baseQuestion}<br/><br/><div style="display:flex;flex-wrap:wrap;gap:8px;">${optionsList}</div>`;

      return question;
    }

    // For non-select fields, use simple question templates
    const questionTemplates: Record<string, string> = {
      website_url: `Please share your company website URL.<br/><br/>(This helps me research your company and generate better leads for you.)`,
      target_departments: `Which departments do you want to target?<br/><br/>**Examples:** C-suite, Sales, Marketing, Engineering, IT, Operations, HR, Finance, Procurement, Other.<br/><br/>You can list multiple departments.`,
      target_location: `Do you have a specific target location (city, state, etc.)?<br/><br/>Type the location or 'null' if not specific.`,
      target_audience_list_exist: `Do you already have a target audience list?<br/><br/>**Options:**<br/>1. Yes<br/>2. No<br/><br/>Reply with Yes or No.`,
    };

    const question = questionTemplates[nextField] || "Let's continue with the next step.";

    return question;
  }

  /**
   * Get missing required fields
   */
  private getMissingRequiredFields(state: OnboardingState): string[] {
    return this.onboardingSequence.filter(fieldName => {
      const field = this.onboardingFields[fieldName];
      return field?.required && !state[fieldName as keyof OnboardingState];
    });
  }

  /**
   * Get the next field to ask about following the sequence order
   */
  private getNextField(state: OnboardingState): string | null {
    // Follow the onboarding sequence in order, including optional fields
    for (const fieldName of this.onboardingSequence) {
      const fieldValue = state[fieldName as keyof OnboardingState];
      
      // Special handling for optional fields with "null" sentinel
      if (fieldName === 'target_location' && fieldValue === 'null') {
        // This is valid - user indicated no specific location
        continue;
      }
      
      // Check if field is missing, null, undefined, or empty string
      // Also check for empty arrays
      const isMissing = 
        fieldValue === undefined || 
        fieldValue === null || 
        fieldValue === '' ||
        (Array.isArray(fieldValue) && fieldValue.length === 0);
      
      if (isMissing) {
        console.log(`🔍 NEXT FIELD LOGIC: ${fieldName} is missing (value: ${fieldValue})`);
        return fieldName;
      }
    }
    console.log(`✅ ALL FIELDS COMPLETE: No more fields needed`);
    return null; // All fields completed
  }

}

export const onboardingSmartRouter = new OnboardingSmartRouter();
