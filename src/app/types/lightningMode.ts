export interface LightningInputs {
  email?: string;
  website?: string;
  linkedin?: string;
  domain?: string; // Extracted from email
  userId?: string;
  anonymousUserId?: string;
  isAuthenticated?: boolean;
  input?: string; // For simple text input
}

export interface CompanyProfile {
  website?: string;
  industry?: string;
  employeeSize?: string;
  revenueBand?: string;
  jobTitle?: string;
  targetGeography?: string;
  techStack?: string[];
  productsServices?: string[];
  companyName?: string;
  description?: string;
  headquarters?: string;
  foundedYear?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
}

export interface GrowthChallenge {
  challenge: string;
  customChallenge?: string;
}

export interface PersonalizationInputs {
  productFocus?: string;
  outreachPreference?: string;
  leadHandoffPreference?: string;
  customOutreach?: string;
  customHandoff?: string;
}

export interface ICPPreview {
  personas: {
    jobTitles: string[];
    industries: string[];
    regions: string[];
  };
  targetAccounts: {
    companyName: string;
    industry: string;
    size: string;
    location: string;
  }[];
  targetLeads: {
    name: string;
    title: string;
    company: string;
    location: string;
  }[];
  channelFit: {
    email: boolean;
    linkedin: boolean;
    phone: boolean;
    social: boolean;
    recommendations: string[];
  };
  growthPlaybook: {
    strategy: string;
    tactics: string[];
    tools: string[];
  };
}

export interface ICPResult {
  companyName: string;
  industry: string;
  personas: {
    jobTitles: string[];
    industries: string[];
    regions: string[];
    seniorityLevels: string[];
  };
  companyCharacteristics: {
    size: string;
    revenue: string;
    location: string;
    technology: string[];
  };
  painPoints: string[];
  buyingBehavior: {
    decisionProcess: string;
    timeline: string;
    budget: string;
  };
  outreachChannels: {
    email: boolean;
    linkedin: boolean;
    phone: boolean;
    social: boolean;
    recommendations: string[];
  };
  targetCompanies: string[];
  marketSize: string;
  sources: string[];
}

export interface SampleLead {
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  linkedin?: string;
  email: string;
  reasoning: string;
  outreachMessage: string;
  companyInfo: {
    size: string;
    revenue: string;
    technology: string;
  };
}

export interface LightningModeState {
  isActive: boolean;
  currentStep: LightningStep;
  inputs: LightningInputs;
  companyProfile?: CompanyProfile;
  growthChallenge?: GrowthChallenge;
  personalization?: PersonalizationInputs;
  icpPreview?: ICPPreview;
  chatId?: string;
}

export enum LightningStep {
  ENTRY = 'entry',
  RESEARCH = 'research',
  GROWTH_CHALLENGE = 'growth_challenge',
  PERSONALIZATION = 'personalization',
  ICP_PREVIEW = 'icp_preview',
  LEAD_GENERATION = 'lead_generation',
  ACTIVATION = 'activation',
  COMPLETED = 'completed'
}

export interface LightningModeMessage {
  type: 'lightning_mode';
  step: LightningStep;
  data: any;
  timestamp: number;
}

export interface TargetAudience {
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

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  lightningMode?: LightningModeMessage;
}
