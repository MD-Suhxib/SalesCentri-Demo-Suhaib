'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building2,
  FileText,
  Upload,
  Eye,
  HelpCircle,
  Briefcase,
  Globe,
  LogIn,
  UserPlus,
} from 'lucide-react';
import {
  getDocumentRequirements,
  getCompanyTypes,
  type Region,
  type BusinessType,
  type CompanyType,
  type DocumentRequirement,
} from '../../lib/marketplace/documentRequirements';
import { validateAuthenticationAsync } from '../../lib/auth';
import { getLoginUrl } from '../../lib/loginUtils';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  calculateMarketplaceCompletion,
  formatTimeRemaining,
  type MarketplaceRegistrationData,
} from '../../lib/draftStorage';

type AccountCategory = 'Individual' | 'Business';
type IndividualType = 'Freelancer' | 'Consultant' | 'Others';
type BusinessSize = 'Startup' | 'SMB' | 'Business';

interface RegistrationData {
  accountCategory?: AccountCategory;
  individualType?: IndividualType;
  businessSize?: BusinessSize;
  region?: Region;
  businessType?: BusinessType;
  companyType?: CompanyType;
  companyDetails?: {
    companyLegalName: string;
    website: string;
    registeredAddress: string;
    contactPersonName: string;
    contactPersonId: string;
    businessPhone: string;
    businessEmail: string;
    taxId: string;
  };
  documents?: Record<string, File>;
}

export default function MarketplaceRegisterPage() {
  const router = useRouter();
  const [registrationData, setRegistrationData] = useState<RegistrationData>({});
  const [documentUploads, setDocumentUploads] = useState<Record<string, File>>({});
  const [hoveredDoc, setHoveredDoc] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('auth');

  // Draft and progress state
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [draftExpiresAt, setDraftExpiresAt] = useState<number | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  // Form data for Step 4
  const [formData, setFormData] = useState({
    companyLegalName: '',
    website: '',
    registeredAddress: '',
    contactPersonName: '',
    contactPersonId: '',
    businessPhone: '',
    businessEmail: '',
    taxId: '',
  });

  // Calculate completion percentage whenever data changes
  useEffect(() => {
    const { percentage } = calculateMarketplaceCompletion(
      registrationData as MarketplaceRegistrationData,
      isAuthenticated
    );
    setCompletionPercentage(percentage);
  }, [registrationData, isAuthenticated]);

  // Check for saved draft on mount
  useEffect(() => {
    const draft = loadDraft<{ registrationData: RegistrationData; formData: typeof formData }>('marketplace');
    if (draft) {
      setHasSavedDraft(true);
      setDraftExpiresAt(draft.metadata.expiresAt);
      setShowDraftBanner(true);
    }
  }, []);

  // Auto-save draft periodically (every 30 seconds) if there's data
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (completionPercentage > 0 && isAuthenticated) {
        saveDraft(
          'marketplace',
          { registrationData, formData },
          completionPercentage,
          activeSection
        );
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [registrationData, formData, completionPercentage, activeSection, isAuthenticated]);

  // Function to restore draft
  const restoreDraft = () => {
    const draft = loadDraft<{ registrationData: RegistrationData; formData: typeof formData }>('marketplace');
    if (draft) {
      setRegistrationData(draft.data.registrationData || {});
      if (draft.data.formData) {
        setFormData(draft.data.formData);
      }
      setShowDraftBanner(false);
      // Navigate to the last step
      setTimeout(() => scrollToSection(draft.metadata.lastStep), 500);
    }
  };

  // Function to discard draft
  const discardDraft = () => {
    clearDraft('marketplace');
    setHasSavedDraft(false);
    setShowDraftBanner(false);
  };

  // Function to manually save draft
  const handleSaveDraft = () => {
    const saved = saveDraft(
      'marketplace',
      { registrationData, formData },
      completionPercentage,
      activeSection
    );
    if (saved) {
      const draft = loadDraft<unknown>('marketplace');
      if (draft) {
        setDraftExpiresAt(draft.metadata.expiresAt);
        setHasSavedDraft(true);
      }
      alert('Draft saved successfully! You can close this page and come back later to continue.');
    } else {
      alert('Failed to save draft. Please try again.');
    }
  };

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await validateAuthenticationAsync();
        setIsAuthenticated(result.isAuthenticated);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    // Check if there are token parameters in URL (from login redirect)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hasTokenParams = urlParams.get('token') && urlParams.get('refreshToken') && urlParams.get('expiresAt');
      
      if (hasTokenParams) {
        // Poll for tokens to be saved, then validate auth
        const maxAttempts = 20;
        const pollForTokens = (attempt: number = 0) => {
          const token = localStorage.getItem('salescentri_token');
          if (token) {
            checkAuth();
          } else if (attempt < maxAttempts) {
            setTimeout(() => pollForTokens(attempt + 1), 100);
          } else {
            checkAuth();
          }
        };
        setTimeout(() => pollForTokens(0), 200);
      } else {
        checkAuth();
      }
    }
  }, []);

  // Scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
      setActiveSection(sectionId);
    }
  }, []);

  // Handle section visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['auth', 'region', 'business-type', 'company-type', 'documents', 'review'];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const onClickSignIn = () => {
    window.location.href = getLoginUrl(true);
  };

  const onClickCreateAccount = () => {
    window.location.href = getLoginUrl(true);
  };

  // Step 1: Authentication
  const AuthSection = () => (
    <div id="auth" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
        <h2 className="text-xl md:text-2xl font-semibold text-white">Authentication</h2>
      </div>
      {authChecked && isAuthenticated ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm md:text-base">You are signed in. Continue to registration.</p>
          </div>
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center space-x-2"
            onClick={() => scrollToSection('region')}
          >
            <span>Continue to Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-400 mb-4 text-sm md:text-base">Please sign in or create an account to continue with marketplace registration.</p>
          <div className="flex border-b border-gray-700 mb-4">
            <button 
              className={`px-4 py-2 font-medium text-sm md:text-base ${authTab === 'signin' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
              onClick={() => setAuthTab('signin')}
            >
              Sign In
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm md:text-base ${authTab === 'signup' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
              onClick={() => setAuthTab('signup')}
            >
              Create Account
            </button>
          </div>
          <div className="space-y-4">
            <button
              onClick={authTab === 'signin' ? onClickSignIn : onClickCreateAccount}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
            >
              {authTab === 'signin' ? (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center">
              You'll be redirected to our secure login page and brought back here after authentication.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Step 2: Account Category Selection
  const AccountCategorySection = () => {
    if (!isAuthenticated) return null;

    return (
      <div id="account-category" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            registrationData.accountCategory ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {registrationData.accountCategory ? <CheckCircle className="w-5 h-5" /> : '2'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Select Account Category</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Choose whether you're registering as an individual or a business</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(['Individual', 'Business'] as AccountCategory[]).map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                setRegistrationData({ ...registrationData, accountCategory: category });
                setTimeout(() => scrollToSection('business-role'), 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 transition-all ${
                registrationData.accountCategory === category
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">{category}</h3>
                  <p className="text-sm text-gray-400">
                    {category === 'Individual' 
                      ? 'Freelancers, consultants, and independent professionals'
                      : 'Companies, startups, and established businesses'}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Step 3: Business Role (Buyer/Supplier)
  const BusinessRoleSection = () => {
    if (!registrationData.accountCategory) return null;

    const roles: { value: BusinessType; label: string; description: string }[] = [
      {
        value: 'Buyer',
        label: 'Buyer',
        description: 'Looking to purchase products or services',
      },
      {
        value: 'Supplier',
        label: 'Supplier',
        description: 'Offering products or services',
      },
    ];

    return (
      <div id="business-role" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            registrationData.businessType ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {registrationData.businessType ? <CheckCircle className="w-5 h-5" /> : '3'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Select Your Role</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Are you looking to buy or supply products/services?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => (
            <motion.button
              key={role.value}
              onClick={() => {
                setRegistrationData({ ...registrationData, businessType: role.value });
                // Navigate to next step based on account category
                if (registrationData.accountCategory === 'Individual') {
                  setTimeout(() => scrollToSection('individual-type'), 300);
                } else {
                  setTimeout(() => scrollToSection('business-size'), 300);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                registrationData.businessType === role.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{role.label}</h3>
                  <p className="text-sm text-gray-400">{role.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Step 4a: Individual Type (only for Individual account category)
  const IndividualTypeSection = () => {
    if (registrationData.accountCategory !== 'Individual' || !registrationData.businessType) return null;

    const individualTypes: { value: IndividualType; label: string; description: string }[] = [
      {
        value: 'Freelancer',
        label: 'Freelancer',
        description: 'Independent professional offering services',
      },
      {
        value: 'Consultant',
        label: 'Consultant',
        description: 'Providing expert advice and consulting services',
      },
      {
        value: 'Others',
        label: 'Others',
        description: 'Other individual professional categories',
      },
    ];

    return (
      <div id="individual-type" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            registrationData.individualType ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {registrationData.individualType ? <CheckCircle className="w-5 h-5" /> : '4'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Select Individual Type</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Choose the category that best describes you</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {individualTypes.map((type) => (
            <motion.button
              key={type.value}
              onClick={() => {
                setRegistrationData({ ...registrationData, individualType: type.value });
                setTimeout(() => scrollToSection('region'), 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                registrationData.individualType === type.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{type.label}</h3>
                  <p className="text-sm text-gray-400">{type.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Step 4b: Business Size (only for Business account category)
  const BusinessSizeSection = () => {
    if (registrationData.accountCategory !== 'Business' || !registrationData.businessType) return null;

    const businessSizes: { value: BusinessSize; label: string; description: string }[] = [
      {
        value: 'Startup',
        label: 'Startup',
        description: 'Early-stage companies in growth phase',
      },
      {
        value: 'SMB',
        label: 'SMB (Small & Medium Business)',
        description: 'Small to medium-sized established businesses',
      },
      {
        value: 'Business',
        label: 'Business',
        description: 'Large established businesses and enterprises',
      },
    ];

    return (
      <div id="business-size" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            registrationData.businessSize ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {registrationData.businessSize ? <CheckCircle className="w-5 h-5" /> : '4'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Select Business Size</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Choose the size category that best describes your business</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {businessSizes.map((size) => (
            <motion.button
              key={size.value}
              onClick={() => {
                setRegistrationData({ ...registrationData, businessSize: size.value });
                setTimeout(() => scrollToSection('region'), 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                registrationData.businessSize === size.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{size.label}</h3>
                  <p className="text-sm text-gray-400">{size.description}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Step 5: Region Selection (now step 5 instead of 2)
  const RegionSection = () => {
    if (!isAuthenticated || !registrationData.accountCategory || !registrationData.businessType) return null;
    
    // For Individual, also need individualType; for Business, need businessSize
    if (registrationData.accountCategory === 'Individual' && !registrationData.individualType) return null;
    if (registrationData.accountCategory === 'Business' && !registrationData.businessSize) return null;

    const regions: { value: Region; label: string; flag: string }[] = [
      { value: 'United States', label: 'United States', flag: '🇺🇸' },
      { value: 'India', label: 'India', flag: '🇮🇳' },
    ];

    return (
      <div id="region" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            registrationData.region ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {registrationData.region ? <CheckCircle className="w-5 h-5" /> : '5'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Select Your Region</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Choose the region where your business is registered</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regions.map((region) => (
            <motion.button
              key={region.value}
              onClick={() => {
                setRegistrationData({ ...registrationData, region: region.value });
                setTimeout(() => scrollToSection('business-type'), 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 transition-all ${
                registrationData.region === region.value
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{region.flag}</div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">{region.label}</h3>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Step 6: Company Type (now step 6 instead of 4)
  const CompanyTypeSection = () => {
    if (!registrationData.region) return null;
    
    // Only show company type for Business accounts
    if (registrationData.accountCategory === 'Individual') {
      // For individuals, skip company type and go directly to documents
      return null;
    }
    
    if (!registrationData.businessType) return null;

    const companyTypes = getCompanyTypes(registrationData.region);

    return (
      <div id="company-type" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            registrationData.companyType ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {registrationData.companyType ? <CheckCircle className="w-5 h-5" /> : '6'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Select Your Company Type</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Choose the legal structure of your business in {registrationData.region}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyTypes.map((type) => (
            <motion.button
              key={type}
              onClick={() => {
                setRegistrationData({ ...registrationData, companyType: type });
                // For individuals, skip company type, so this only runs for business
                setTimeout(() => scrollToSection('documents'), 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                registrationData.companyType === type
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <h3 className="text-base font-semibold text-white">{type}</h3>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Step 7: Documents & Company Details (now step 7)
  const DocumentsSection = () => {
    if (!registrationData.region || !registrationData.businessType) {
      return null;
    }
    
    // For Business accounts, require companyType; for Individual, skip it
    if (registrationData.accountCategory === 'Business' && !registrationData.companyType) {
      return null;
    }
    
    // Get document requirements based on account type
    let docRequirements;
    if (registrationData.accountCategory === 'Business' && registrationData.companyType) {
      docRequirements = getDocumentRequirements(
        registrationData.region,
        registrationData.businessType,
        registrationData.companyType
      );
    } else if (registrationData.accountCategory === 'Individual') {
      // Simplified requirements for individuals
      docRequirements = {
        region: registrationData.region,
        businessType: registrationData.businessType,
        companyType: 'Individual' as CompanyType,
        documents: [
          {
            id: 'id-proof',
            name: 'Identity Proof',
            description: 'Government-issued ID (Passport, Driver License, etc.)',
            required: true,
            category: 'identity' as const,
          },
          {
            id: 'address-proof',
            name: 'Address Proof',
            description: 'Utility bill, bank statement, or rental agreement',
            required: true,
            category: 'address' as const,
          },
          {
            id: 'tax-id',
            name: 'Tax ID',
            description: registrationData.region === 'India' ? 'PAN Card' : 'SSN or Tax ID',
            required: true,
            category: 'tax' as const,
          },
        ],
        requiredFields: {
          companyLegalName: false, // Use contact person name for individuals
          website: false,
          registeredAddress: true,
          contactPersonName: true,
          contactPersonId: true,
          businessPhone: true,
          businessEmail: true,
          taxId: true,
          bankVerification: false,
        },
      };
    } else {
      return null;
    }

    const handleFileUpload = (docId: string, file: File) => {
      setDocumentUploads({ ...documentUploads, [docId]: file });
    };

    const handleInputChange = (field: string, value: string) => {
      setFormData({ ...formData, [field]: value });
    };

    const isFormValid = () => {
      const required = docRequirements.requiredFields;
      return (
        (required.companyLegalName ? formData.companyLegalName : true) &&
        (required.website ? formData.website : true) &&
        (required.registeredAddress ? formData.registeredAddress : true) &&
        (required.contactPersonName ? formData.contactPersonName : true) &&
        (required.contactPersonId ? formData.contactPersonId : true) &&
        (required.businessPhone ? formData.businessPhone : true) &&
        (required.businessEmail ? formData.businessEmail : true) &&
        (required.taxId ? formData.taxId : true)
      );
    };

    return (
      <div id="documents" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">7</div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            {registrationData.accountCategory === 'Individual' ? 'Personal Details & Documents' : 'Company Details & Documents'}
          </h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          {registrationData.accountCategory === 'Individual' 
            ? 'Provide your personal information and upload required documents'
            : 'Provide your company information and upload required documents'}
        </p>

        {/* Details Form */}
        <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            {registrationData.accountCategory === 'Individual' ? 'Personal Information' : 'Company Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrationData.accountCategory === 'Business' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Legal Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.companyLegalName}
                  onChange={(e) => handleInputChange('companyLegalName', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  placeholder="Enter legal company name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website {docRequirements.requiredFields.website && <span className="text-red-400">*</span>}
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="https://example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registered Business Address <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.registeredAddress}
                onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="Enter complete registered address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Person Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.contactPersonName}
                onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Person ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.contactPersonId}
                onChange={(e) => handleInputChange('contactPersonId', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="ID Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={formData.businessPhone}
                onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.businessEmail}
                onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tax ID ({registrationData.region === 'India' ? 'PAN/GST' : 'EIN'}){' '}
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => handleInputChange('taxId', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder={registrationData.region === 'India' ? 'PAN or GST Number' : 'EIN'}
              />
            </div>
          </div>
        </div>

        {/* Document Uploads */}
        <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Required Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docRequirements.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                onMouseEnter={() => setHoveredDoc(doc.id)}
                onMouseLeave={() => setHoveredDoc(null)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-semibold text-white">{doc.name}</h4>
                      {doc.required && <span className="text-red-400 text-xs">*</span>}
                      {!doc.required && (
                        <span className="text-gray-500 text-xs">(Optional)</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{doc.description}</p>
                  </div>
                  {hoveredDoc === doc.id && (
                    <div className="relative group">
                      <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                      <div className="absolute right-0 top-6 w-64 p-2 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        {doc.description}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <label className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      {documentUploads[doc.id] ? documentUploads[doc.id].name : 'Upload Document'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.id, file);
                      }}
                    />
                  </label>
                  {documentUploads[doc.id] && (
                    <div className="mt-2 flex items-center space-x-2 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      <span>Uploaded: {documentUploads[doc.id].name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Draft & Continue Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
          <button
            onClick={() => {
              setRegistrationData({
                ...registrationData,
                companyDetails: formData,
                documents: documentUploads,
              });
              handleSaveDraft();
            }}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Save & Continue Later
          </button>
          <button
            onClick={() => {
              if (isFormValid()) {
                setRegistrationData({
                  ...registrationData,
                  companyDetails: formData,
                  documents: documentUploads,
                });
                scrollToSection('review');
              } else {
                alert('Please fill in all required fields');
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            <span>Continue to Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 8: Review & Submit (now step 8)
  const ReviewSection = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!registrationData.region || !registrationData.businessType) {
      return null;
    }
    
    // For Business, require companyType; for Individual, skip it
    if (registrationData.accountCategory === 'Business' && !registrationData.companyType) {
      return null;
    }

    // Get document requirements (same logic as DocumentsSection)
    let docRequirements;
    if (registrationData.accountCategory === 'Business' && registrationData.companyType) {
      docRequirements = getDocumentRequirements(
        registrationData.region,
        registrationData.businessType,
        registrationData.companyType
      );
    } else if (registrationData.accountCategory === 'Individual') {
      docRequirements = {
        region: registrationData.region,
        businessType: registrationData.businessType,
        companyType: 'Individual' as CompanyType,
        documents: [],
        requiredFields: {
          companyLegalName: false,
          website: false,
          registeredAddress: true,
          contactPersonName: true,
          contactPersonId: true,
          businessPhone: true,
          businessEmail: true,
          taxId: true,
          bankVerification: false,
        },
      };
    } else {
      return null;
    }

    const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
        // Prepare data for submission (convert File objects to file info)
        const submissionData = {
          accountCategory: registrationData.accountCategory,
          businessType: registrationData.businessType,
          region: registrationData.region,
          individualType: registrationData.individualType,
          businessSize: registrationData.businessSize,
          companyType: registrationData.companyType,
          companyDetails: registrationData.companyDetails,
          documents: Object.keys(documentUploads).reduce((acc: Record<string, string>, key: string) => {
            acc[key] = documentUploads[key].name;
            return acc;
          }, {}),
        };

        // Submit to API
        const response = await fetch('/api/marketplace/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to submit application');
        }

        // Store application ID for dashboard
        if (result.applicationId) {
          localStorage.setItem('marketplace_application_id', result.applicationId);
        }

        // Redirect to dashboard
        router.push('/market-place/dashboard');
      } catch (error) {
        console.error('Submission error:', error);
        alert(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
        setIsSubmitting(false);
      }
    };

    return (
      <div id="review" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">8</div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Review Your Application</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Please review all information before submitting</p>

        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Registration Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Region</p>
                <p className="text-white font-medium">{registrationData.region}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Business Type</p>
                <p className="text-white font-medium">{registrationData.businessType}</p>
              </div>
              {registrationData.accountCategory === 'Business' && (
                <>
                  <div>
                    <p className="text-sm text-gray-400">Business Size</p>
                    <p className="text-white font-medium">{registrationData.businessSize || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Company Type</p>
                    <p className="text-white font-medium">{registrationData.companyType || 'N/A'}</p>
                  </div>
                </>
              )}
              {registrationData.accountCategory === 'Individual' && (
                <div>
                  <p className="text-sm text-gray-400">Individual Type</p>
                  <p className="text-white font-medium">{registrationData.individualType || 'N/A'}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">
                  {registrationData.accountCategory === 'Business' ? 'Company Name' : 'Contact Name'}
                </p>
                <p className="text-white font-medium">
                  {registrationData.accountCategory === 'Business' 
                    ? (registrationData.companyDetails?.companyLegalName || 'N/A')
                    : (registrationData.companyDetails?.contactPersonName || 'N/A')}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Summary */}
          {docRequirements && (
            <div className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Uploaded Documents</h3>
              <div className="space-y-2">
                {docRequirements.documents && docRequirements.documents.length > 0 ? (
                  docRequirements.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.description}</p>
                      </div>
                    </div>
                    {documentUploads[doc.id] ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <span className="text-xs text-yellow-400">Pending</span>
                    )}
                  </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No documents required for this account type.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <button
            onClick={() => {
              setRegistrationData({
                ...registrationData,
                companyDetails: registrationData.companyDetails,
                documents: documentUploads,
              });
              handleSaveDraft();
            }}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm md:text-base flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Save & Continue Later
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Application</span>
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(122,92,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Draft Restoration Banner */}
          {showDraftBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Continue where you left off?</h3>
                    <p className="text-sm text-gray-400">
                      You have a saved application. {draftExpiresAt && formatTimeRemaining(draftExpiresAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={restoreDraft}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Resume Application
                  </button>
                  <button
                    onClick={discardDraft}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                  >
                    Start Fresh
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Header with Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Marketplace Registration</h1>
            <p className="text-sm md:text-base text-gray-400 mb-4">Complete your business registration in a few simple steps</p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm font-semibold text-blue-400">{completionPercentage}% Complete</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Layout: Sidebar + Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Progress Sidebar - Left Side */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 lg:p-6 h-fit lg:sticky lg:top-8">
                {/* Completion Summary */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Overall Progress</span>
                    <span className="text-lg font-bold text-blue-400">{completionPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  {hasSavedDraft && draftExpiresAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Draft auto-saved · {formatTimeRemaining(draftExpiresAt)}
                    </p>
                  )}
                </div>
                
                <h3 className="text-white font-semibold mb-4 text-sm lg:text-base">Registration Steps</h3>
                <div className="space-y-2">
                  {[
                    { id: 'auth', label: 'Authentication', number: 1 },
                    { id: 'account-category', label: 'Account Category', number: 2 },
                    { id: 'business-role', label: 'Business Role', number: 3 },
                    ...(registrationData.accountCategory === 'Individual' 
                      ? [{ id: 'individual-type', label: 'Individual Type', number: 4 }]
                      : registrationData.accountCategory === 'Business'
                      ? [{ id: 'business-size', label: 'Business Size', number: 4 }]
                      : []
                    ),
                    { id: 'region', label: 'Region', number: 5 },
                    ...(registrationData.accountCategory === 'Business' 
                      ? [{ id: 'company-type', label: 'Company Type', number: 6 }]
                      : []
                    ),
                    { id: 'documents', label: 'Documents', number: registrationData.accountCategory === 'Business' ? 7 : 6 },
                    { id: 'review', label: 'Review', number: registrationData.accountCategory === 'Business' ? 8 : 7 },
                  ].map((item) => {
                    const isActive = activeSection === item.id;
                    const isCompleted = 
                      (item.id === 'auth' && isAuthenticated) ||
                      (item.id === 'account-category' && registrationData.accountCategory) ||
                      (item.id === 'business-role' && registrationData.businessType) ||
                      (item.id === 'individual-type' && registrationData.individualType) ||
                      (item.id === 'business-size' && registrationData.businessSize) ||
                      (item.id === 'region' && registrationData.region) ||
                      (item.id === 'company-type' && registrationData.companyType) ||
                      (item.id === 'documents' && registrationData.companyDetails) ||
                      (item.id === 'review' && false);

                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : isCompleted 
                            ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive 
                              ? 'bg-white text-blue-600' 
                              : isCompleted 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-600 text-gray-300'
                          }`}>
                            {isCompleted ? '✓' : item.number}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.label}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content - Right Side */}
            <div className="flex-1 min-w-0">
              <div className="space-y-8">
                <AuthSection />
                <AccountCategorySection />
                <BusinessRoleSection />
                <IndividualTypeSection />
                <BusinessSizeSection />
                <RegionSection />
                <CompanyTypeSection />
                <DocumentsSection />
                <ReviewSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
