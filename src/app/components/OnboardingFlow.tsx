import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Target, 
  Users, 
  Globe,
  Briefcase,
  MessageCircle,
  Zap
} from 'lucide-react';

interface OnboardingData {
  // Aligned with backend API field names
  sales_objective?: string;
  company_role?: string;
  short_term_goal?: string;
  website_url?: string;
  gtm?: string;
  target_industry?: string;
  target_revenue_size?: string;
  target_employee_size?: string;
  target_departments?: string[];
  target_region?: string;
  target_location?: string;
  target_audience_list_exist?: boolean;
}

interface StepData {
  // Aligned with backend API field names
  sales_objective?: string;
  company_role?: string;
  short_term_goal?: string;
  website_url?: string;
  gtm?: string;
  target_industry?: string;
  target_revenue_size?: string;
  target_employee_size?: string;
  target_departments?: string[];
  target_region?: string;
  target_location?: string;
  target_audience_list_exist?: boolean;
  completedAt?: string;
}

interface OnboardingFlowProps {
  currentStep: string;
  onboardingData: OnboardingData;
  onStepComplete: (stepData: StepData, nextStep?: string) => void;
  isLoading: boolean;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
}

// Individual step components
const WelcomeStep: React.FC<{ onNext: (data: StepData) => void }> = ({ onNext }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6 p-8"
    >
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Welcome to Focus Mode</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Let&apos;s get to know your business better so we can provide personalized sales strategies and insights.
          This guided setup will take about 5 minutes.
        </p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-3">What we&apos;ll cover:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Your business details</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-gray-300">Target audience</span>
          </div>
          <div className="flex items-center space-x-3">
            <MessageCircle className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300">Sales process</span>
          </div>
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300">Goals & objectives</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => onNext({})}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
      >
        <span>Let&apos;s Get Started</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

const BusinessBasicsStep: React.FC<{ data: OnboardingData; onNext: (data: StepData) => void; onBack: () => void }> = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    sales_objective: data.sales_objective || '',
    company_role: data.company_role || '',
    short_term_goal: data.short_term_goal || '',
    website_url: data.website_url || ''
  });

const salesObjectives = [
  'Generate qualified leads',
  'Expand into a new region or sector',
  'Enrich or clean an existing list',
  'Purchase a new contact list',
];

const userRoles = [
  'Founder / CEO',
  'Sales Director or Manager',
  'Marketing Director or Manager',
  'Sales Development Representative (SDR)',
  'Consultant / Advisor',
  'Other',
];

const immediateGoals = [
  'Schedule a demo',
  'Purchase or download contacts',
  'Enrich my existing list',
  'Create a new list from scratch',
  'Get advice on strategy',
];

  const handleSubmit = () => {
    if (formData.sales_objective && formData.company_role && formData.short_term_goal) {
      onNext(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 p-8"
    >
      <div className="text-center space-y-4">
        <Building2 className="w-12 h-12 mx-auto text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Tell us about your business</h2>
        <p className="text-gray-300">Help us understand your role and objectives</p>
      </div>

      <div className="space-y-6">
        {/* Sales Objective */}
        <div>
          <label className="block text-white font-medium mb-3">What&apos;s your primary sales objective?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {salesObjectives.map((objective) => (
              <button
                key={objective}
                onClick={() => setFormData(prev => ({ ...prev, sales_objective: objective }))}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.sales_objective === objective
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                {objective}
              </button>
            ))}
          </div>
        </div>

        {/* User Role */}
        <div>
          <label className="block text-white font-medium mb-3">What&apos;s your role?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {userRoles.map((role) => (
              <button
                key={role}
                onClick={() => setFormData(prev => ({ ...prev, company_role: role }))}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.company_role === role
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Immediate Goal */}
        <div>
          <label className="block text-white font-medium mb-3">What&apos;s your immediate goal?</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {immediateGoals.map((goal) => (
              <button
                key={goal}
                onClick={() => setFormData(prev => ({ ...prev, short_term_goal: goal }))}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.short_term_goal === goal
                    ? 'bg-blue-500 border-blue-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Company Website */}
        <div>
          <label className="block text-white font-medium mb-3">Company website (optional)</label>
          <input
            type="url"
            value={formData.website_url}
            onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
            placeholder="https://yourcompany.com"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
          />
          <p className="text-gray-400 text-sm mt-2">We&apos;ll use this to research your company and provide better insights</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!formData.sales_objective || !formData.company_role || !formData.short_term_goal}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const CompanyDetailsStep: React.FC<{ data: OnboardingData; onNext: (data: StepData) => void; onBack: () => void }> = ({ data, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    gtm: data.gtm || '',
    target_industry: data.target_industry || '',
    target_revenue_size: data.target_revenue_size || '',
    target_employee_size: data.target_employee_size || ''
  });

  const marketFocusOptions = ['B2B', 'B2C', 'B2G', 'BOTH'];
  const industries = [
    'Accounting/Finance', 'Advertising/Public Relations', 'Aerospace/Aviation', 'Agriculture/Livestock',
    'Animal Care/Pet Services', 'Arts/Entertainment/Publishing', 'Automotive', 'Banking/Mortgage',
    'Business Development', 'Business Opportunity', 'Clerical/Administrative', 'Construction/Facilities',
    'Education/Research', 'Energy/Utilities', 'Food/Beverage', 'Government/Non-Profit',
    'Healthcare/Wellness', 'Legal/Security', 'Manufacturing/Industrial', 'Real Estate/Property',
    'Retail/Wholesale', 'Technology/IT', 'Transportation/Logistics', 'Other', 'NA',
  ];
  const revenueSizes = [
    '0-500K', '500K-1M', '1M-5M', '5M-10M', '10M-50M', '50M-100M', '100M-500M',
    '500M-1B', '1B-5B', '5B+', 'NA',
  ];
  const employeeSizes = [
    '0-10', '11-50', '51-200', '201-500', '501-1000', '1000-5000', '5001-10000',
    '10001-50000', '50001-100000', '100000+', 'NA',
  ];
  const targetRegions = [
    'India', 'North America', 'Europe', 'Asia-Pacific', 'Global / Multiple regions',
  ];
  const departmentOptions = [
    'C-suite', 'Sales', 'Marketing', 'Engineering', 'IT', 'Operations', 'HR', 'Finance', 'Procurement', 'Other',
  ];

  const [targetDepartments, setTargetDepartments] = useState<string[]>(data.target_departments || []);
  const [targetRegion, setTargetRegion] = useState<string>(data.target_region || '');
  const [targetLocation, setTargetLocation] = useState<string>(data.target_location || '');
  const [targetAudienceListExist, setTargetAudienceListExist] = useState<boolean | undefined>(
    typeof data.target_audience_list_exist === 'boolean' ? data.target_audience_list_exist : undefined
  );

  const handleDepartmentToggle = (dept: string) => {
    setTargetDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  const handleSubmit = () => {
    if (formData.gtm && formData.target_industry && targetRegion) {
      onNext({
        gtm: formData.gtm,
        target_industry: formData.target_industry,
        target_revenue_size: formData.target_revenue_size,
        target_employee_size: formData.target_employee_size,
        target_departments: targetDepartments,
        target_region: targetRegion,
        target_location: targetLocation,
        target_audience_list_exist: typeof targetAudienceListExist === 'boolean' ? targetAudienceListExist : undefined,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 p-8"
    >
      <div className="text-center space-y-4">
        <Briefcase className="w-12 h-12 mx-auto text-green-400" />
        <h2 className="text-2xl font-bold text-white">Company Details</h2>
        <p className="text-gray-300">Tell us more about your company</p>
      </div>

      {/* Target Departments */}
      <div>
        <label className="block text-white font-medium mb-3">Target Departments (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {departmentOptions.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => handleDepartmentToggle(dept)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                targetDepartments.includes(dept)
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Target Region */}
      <div>
        <label className="block text-white font-medium mb-3">Target Region</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {targetRegions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setTargetRegion(region)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                targetRegion === region
                  ? 'bg-blue-500 border-blue-400 text-white'
                  : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Target Location */}
      <div>
        <label className="block text-white font-medium mb-3">Target Location (city, state, etc.)</label>
        <input
          type="text"
          value={targetLocation}
          onChange={e => setTargetLocation(e.target.value)}
          placeholder="e.g. San Francisco, California"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
        />
      </div>

      {/* Target Audience List Exist */}
      <div>
        <label className="block text-white font-medium mb-3">Do you already have a target audience list?</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setTargetAudienceListExist(true)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              targetAudienceListExist === true
                ? 'bg-green-500 border-green-400 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setTargetAudienceListExist(false)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
              targetAudienceListExist === false
                ? 'bg-red-500 border-red-400 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
            }`}
          >
            No
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Go-To-Market Focus */}
        <div>
          <label className="block text-white font-medium mb-3">What&apos;s your go-to-market focus?</label>
          <div className="grid grid-cols-4 gap-3">
            {marketFocusOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFormData(prev => ({ ...prev, gtm: option }))}
                className={`p-4 rounded-lg border text-center font-medium transition-all ${
                  formData.gtm === option
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="text-lg">{option}</div>
                <div className="text-xs mt-1 opacity-80">
                  {option === 'B2B' ? 'Business to Business' : 
                   option === 'B2C' ? 'Business to Consumer' : 
                   option === 'B2G' ? 'Business to Government' :
                   'Multiple Markets'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Target Industry */}
        <div>
          <label className="block text-white font-medium mb-3">Target Industry</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  target_industry: industry 
                }))}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.target_industry === industry
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                {industry}
              </button>
            ))}
          </div>
        </div>

        {/* Target Revenue Size */}
        <div>
          <label className="block text-white font-medium mb-3">Target Company Revenue Size</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {revenueSizes.map((size) => (
              <button
                key={size}
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  target_revenue_size: size 
                }))}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.target_revenue_size === size
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Target Employee Size */}
        <div>
          <label className="block text-white font-medium mb-3">Target Company Team Size</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {employeeSizes.map((size) => (
              <button
                key={size}
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  target_employee_size: size 
                }))}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  formData.target_employee_size === size
                    ? 'bg-green-500 border-green-400 text-white'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!formData.gtm || !formData.target_industry}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};

const CompletionStep: React.FC<{ data: OnboardingData; onComplete: () => void }> = ({ data, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6 p-8"
    >
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Setup Complete!</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Perfect! I now have a clear understanding of your business. 
          Let me analyze your profile and provide some insights based on what you&apos;ve shared.
        </p>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700 text-left">
        <h3 className="text-xl font-semibold text-white mb-4">Your Profile Summary:</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Target className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">Objective: {data.sales_objective}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-gray-300">Role: {data.company_role}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300">Industry: {data.target_industry}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300">Market: {data.gtm}</span>
          </div>
          {data.website_url && (
            <div className="flex items-center space-x-3">
              <Building2 className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300">Website: {data.website_url}</span>
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={onComplete}
        className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
      >
        <span>Let&apos;s Start!</span>
        <Zap className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

// Main OnboardingFlow component
export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  currentStep, 
  onboardingData, 
  onStepComplete,
  isLoading 
}) => {
  const steps: OnboardingStep[] = [
    {
      id: 'start',
      title: 'Welcome',
      description: 'Get started with Focus Mode',
      icon: <Target className="w-6 h-6" />,
      component: WelcomeStep
    },
    {
      id: 'business_basics',
      title: 'Business Basics',
      description: 'Tell us about your business',
      icon: <Building2 className="w-6 h-6" />,
      component: BusinessBasicsStep
    },
    {
      id: 'company_details',
      title: 'Company Details',
      description: 'More about your company',
      icon: <Briefcase className="w-6 h-6" />,
      component: CompanyDetailsStep
    },
    {
      id: 'completed',
      title: 'Complete',
      description: 'You are all set!',
      icon: <CheckCircle className="w-6 h-6" />,
      component: CompletionStep
    }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const currentStepData = steps[currentStepIndex];

  const handleNext = (stepData: StepData) => {
    const nextStepIndex = currentStepIndex + 1;
    const nextStep = nextStepIndex < steps.length ? steps[nextStepIndex].id : 'completed';
    onStepComplete(stepData, nextStep);
  };

  const handleBack = () => {
    const prevStepIndex = currentStepIndex - 1;
    if (prevStepIndex >= 0) {
      const prevStep = steps[prevStepIndex].id;
      onStepComplete({}, prevStep);
    }
  };

  const handleComplete = () => {
    onStepComplete({ completedAt: new Date().toISOString() }, 'completed');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentStepData) {
    return null;
  }

  const StepComponent = currentStepData.component;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.slice(0, -1).map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                index <= currentStepIndex 
                  ? 'bg-blue-500 border-blue-400 text-white' 
                  : 'bg-gray-800 border-gray-600 text-gray-400'
              }`}>
                {index < currentStepIndex ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 2 && (
                <div className={`w-full h-1 mx-4 ${
                  index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-white">{currentStepData.title}</h3>
          <p className="text-gray-400 text-sm">{currentStepData.description}</p>
        </div>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {currentStep === 'start' && (
            <StepComponent onNext={handleNext} />
          )}
          {currentStep === 'business_basics' && (
            <StepComponent 
              data={onboardingData} 
              onNext={handleNext} 
              onBack={handleBack} 
            />
          )}
          {currentStep === 'company_details' && (
            <StepComponent 
              data={onboardingData} 
              onNext={handleNext} 
              onBack={handleBack} 
            />
          )}
          {currentStep === 'completed' && (
            <StepComponent 
              data={onboardingData} 
              onComplete={handleComplete} 
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
