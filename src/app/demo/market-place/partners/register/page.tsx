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
  Globe,
  LogIn,
  UserPlus,
  Users,
  Check,
} from 'lucide-react';
import {
  getPartnerDocumentRequirements,
  getPartnershipTypes,
  getPartnershipTypeDescription,
  type PartnerCountry,
  type PartnershipType,
  type PartnerDocumentRequirement,
} from '@/app/lib/marketplace/partnerDocumentRequirements';
import { validateAuthenticationAsync } from '@/app/lib/auth';
import { getLoginUrl } from '@/app/lib/loginUtils';
import {
  saveDraft,
  loadDraft,
  clearDraft,
  calculatePartnerCompletion,
  formatTimeRemaining,
  type PartnerRegistrationData as DraftPartnerData,
} from '@/app/lib/draftStorage';

interface PartnerRegistrationData {
  partnershipType?: PartnershipType;
  country?: PartnerCountry;
  partnerDetails?: {
    companyLegalName: string;
    companyName: string;
    website: string;
    registeredAddress: string;
    contactPersonName: string;
    contactPersonEmail: string;
    contactPersonPhone: string;
    taxId: string;
    bankAccount?: string;
  };
  documents?: Record<string, { fileName: string; fileUrl: string }>;
}

export default function PartnerRegisterPage() {
  const router = useRouter();
  const [registrationData, setRegistrationData] = useState<PartnerRegistrationData>({});
  const [documentUploads, setDocumentUploads] = useState<Record<string, File>>({});
  const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string>('auth');
  const [submitting, setSubmitting] = useState(false);

  // Draft and progress state
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [draftExpiresAt, setDraftExpiresAt] = useState<number | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  // Form data
  const [formData, setFormData] = useState({
    companyLegalName: '',
    companyName: '',
    website: '',
    registeredAddress: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    taxId: '',
    bankAccount: '',
  });

  // Calculate completion percentage whenever data changes
  useEffect(() => {
    const { percentage } = calculatePartnerCompletion(
      registrationData as DraftPartnerData,
      isAuthenticated
    );
    setCompletionPercentage(percentage);
  }, [registrationData, isAuthenticated]);

  // Check for saved draft on mount
  useEffect(() => {
    const draft = loadDraft<{ registrationData: PartnerRegistrationData; formData: typeof formData }>('partner');
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
          'partner',
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
    const draft = loadDraft<{ registrationData: PartnerRegistrationData; formData: typeof formData }>('partner');
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
    clearDraft('partner');
    setHasSavedDraft(false);
    setShowDraftBanner(false);
  };

  // Function to manually save draft
  const handleSaveDraft = () => {
    const saved = saveDraft(
      'partner',
      { registrationData, formData },
      completionPercentage,
      activeSection
    );
    if (saved) {
      const draft = loadDraft<unknown>('partner');
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

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hasTokenParams = urlParams.get('token') && urlParams.get('refreshToken') && urlParams.get('expiresAt');
      
      if (hasTokenParams) {
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
      const sections = ['auth', 'partnership-type', 'country', 'details', 'documents', 'review'];
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

  // Get document requirements
  const docRequirements = registrationData.country && registrationData.partnershipType
    ? getPartnerDocumentRequirements(registrationData.country, registrationData.partnershipType)
    : null;

  // Handle file upload
  const handleFileUpload = async (docId: string, file: File) => {
    setUploadingDocs({ ...uploadingDocs, [docId]: true });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('partnerId', 'temp_' + Date.now()); // Temporary ID, will be updated after registration
      formData.append('documentType', docId);

      const response = await fetch('/api/upload/partner-documents', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setRegistrationData({
          ...registrationData,
          documents: {
            ...registrationData.documents,
            [docId]: {
              fileName: result.fileName,
              fileUrl: result.fileUrl,
            },
          },
        });
      } else {
        alert('Failed to upload file: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    } finally {
      setUploadingDocs({ ...uploadingDocs, [docId]: false });
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    if (!docRequirements) return false;
    const required = docRequirements.requiredFields;
    return (
      (required.companyLegalName ? formData.companyLegalName : true) &&
      (required.companyName ? formData.companyName : true) &&
      (required.website ? formData.website : true) &&
      (required.registeredAddress ? formData.registeredAddress : true) &&
      (required.contactPersonName ? formData.contactPersonName : true) &&
      (required.contactPersonEmail ? formData.contactPersonEmail : true) &&
      (required.contactPersonPhone ? formData.contactPersonPhone : true) &&
      (required.taxId ? formData.taxId : true) &&
      (required.bankAccount ? formData.bankAccount : true)
    );
  };

  // Handle submission
  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        partnershipType: registrationData.partnershipType,
        country: registrationData.country,
        partnerDetails: formData,
        documents: registrationData.documents || {},
      };

      const response = await fetch('/api/partner/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/demo/market-place/partners/dashboard?applicationId=${result.applicationId}`);
      } else {
        alert('Registration failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Failed to submit registration');
    } finally {
      setSubmitting(false);
    }
  };

  // Step 1: Authentication
  const AuthSection = () => (
    <div id="auth" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">1</div>
        <h2 className="text-xl md:text-2xl font-semibold text-white">Authentication</h2>
      </div>
      {authChecked && isAuthenticated ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm md:text-base">You are signed in. Continue to registration.</p>
          </div>
          <button
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center space-x-2"
            onClick={() => scrollToSection('partnership-type')}
          >
            <span>Continue to Registration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-400 mb-4 text-sm md:text-base">Please sign in or create an account to continue with partner registration.</p>
          <div className="flex border-b border-gray-700 mb-4">
            <button 
              className={`px-4 py-2 font-medium text-sm md:text-base ${authTab === 'signin' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
              onClick={() => setAuthTab('signin')}
            >
              Sign In
            </button>
            <button 
              className={`px-4 py-2 font-medium text-sm md:text-base ${authTab === 'signup' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
              onClick={() => setAuthTab('signup')}
            >
              Create Account
            </button>
          </div>
          <div className="space-y-4">
            <button
              onClick={authTab === 'signin' ? onClickSignIn : onClickCreateAccount}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center space-x-2"
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

  // Step 2: Partnership Type Selection
  const PartnershipTypeSection = () => {
    if (!isAuthenticated) return null;

    const types = getPartnershipTypes();

    return (
      <div id="partnership-type" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            registrationData.partnershipType ? 'bg-green-500 text-white' : 'bg-green-600 text-white'
          }`}>
            {registrationData.partnershipType ? <CheckCircle className="w-5 h-5" /> : '2'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Select Partnership Type</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Choose the type of partnership you're interested in</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {types.map((type) => (
            <motion.button
              key={type}
              onClick={() => {
                setRegistrationData({ ...registrationData, partnershipType: type });
                setTimeout(() => scrollToSection('country'), 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                registrationData.partnershipType === type
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{type}</h3>
                  <p className="text-sm text-gray-400">{getPartnershipTypeDescription(type)}</p>
                </div>
              </div>
              {registrationData.partnershipType === type && (
                <div className="mt-4 flex items-center text-green-400">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="text-sm">Selected</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Step 3: Country Selection
  const CountrySection = () => {
    if (!registrationData.partnershipType) return null;

    const countries: { value: PartnerCountry; label: string; flag: string }[] = [
      { value: 'United States', label: 'United States', flag: '🇺🇸' },
      { value: 'India', label: 'India', flag: '🇮🇳' },
    ];

    return (
      <div id="country" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            registrationData.country ? 'bg-green-500 text-white' : 'bg-green-600 text-white'
          }`}>
            {registrationData.country ? <CheckCircle className="w-5 h-5" /> : '3'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Select Your Country</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Choose the country where your business is registered</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {countries.map((country) => (
            <motion.button
              key={country.value}
              onClick={() => {
                setRegistrationData({ ...registrationData, country: country.value });
                setTimeout(() => scrollToSection('details'), 300);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 transition-all ${
                registrationData.country === country.value
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{country.flag}</div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-white">{country.label}</h3>
                  <p className="text-sm text-gray-400">Country-specific requirements apply</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  // Step 4: Partner Details
  const DetailsSection = () => {
    if (!docRequirements) return null;

    const fields = docRequirements.requiredFields;

    return (
      <div id="details" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            isFormValid() ? 'bg-green-500 text-white' : 'bg-green-600 text-white'
          }`}>
            {isFormValid() ? <CheckCircle className="w-5 h-5" /> : '4'}
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Partner Details</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Provide your business and contact information</p>

        <div className="space-y-4">
          {fields.companyLegalName && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyLegalName}
                onChange={(e) => setFormData({ ...formData, companyLegalName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                placeholder="Enter legal company name"
              />
            </div>
          )}

          {fields.companyName && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company/Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                placeholder="Enter company or brand name"
              />
            </div>
          )}

          {fields.website && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                placeholder="https://example.com"
              />
            </div>
          )}

          {fields.registeredAddress && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Registered Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.registeredAddress}
                onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                placeholder="Enter registered business address"
                rows={3}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.contactPersonName && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contactPersonName}
                  onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  placeholder="Full name"
                />
              </div>
            )}

            {fields.contactPersonEmail && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactPersonEmail}
                  onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>
            )}

            {fields.contactPersonPhone && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.contactPersonPhone}
                  onChange={(e) => setFormData({ ...formData, contactPersonPhone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                  placeholder="+1 234 567 8900"
                />
              </div>
            )}
          </div>

          {fields.taxId && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tax ID {registrationData.country === 'India' ? '(PAN/GST)' : '(EIN/SSN)'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.taxId}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                placeholder={registrationData.country === 'India' ? 'PAN or GST number' : 'EIN or SSN'}
              />
            </div>
          )}

          {fields.bankAccount && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bank Account Details <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all"
                placeholder="Bank account number or routing details"
              />
            </div>
          )}

          <button
            onClick={() => scrollToSection('documents')}
            disabled={!isFormValid()}
            className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Continue to Documents</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Step 5: Documents
  const DocumentsSection = () => {
    if (!docRequirements || !isFormValid()) return null;

    return (
      <div id="documents" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">5</div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Upload Documents</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">
          Upload the required documents for {registrationData.country}
        </p>

        <div className="space-y-4">
          {docRequirements.documents.map((doc) => (
            <div key={doc.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    {doc.name}
                    {doc.required && <span className="text-red-500 text-sm">*</span>}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">{doc.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Category: {doc.category}</p>
                </div>
                <div className="ml-4">
                  {registrationData.documents?.[doc.id] ? (
                    <div className="flex items-center text-green-400">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm">Uploaded</span>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDocumentUploads({ ...documentUploads, [doc.id]: file });
                            handleFileUpload(doc.id, file);
                          }
                        }}
                        disabled={uploadingDocs[doc.id]}
                      />
                      <div className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all flex items-center space-x-2">
                        {uploadingDocs[doc.id] ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload</span>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollToSection('review')}
          className="mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center space-x-2"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Step 6: Review & Submit
  const ReviewSection = () => {
    if (!docRequirements || !isFormValid()) return null;

    return (
      <div id="review" className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 md:p-8 mb-8 scroll-mt-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">6</div>
          <h2 className="text-xl md:text-2xl font-semibold text-white">Review & Submit</h2>
        </div>
        <p className="text-gray-400 mb-6 text-sm md:text-base">Review your information before submitting</p>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Partnership Information</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Partnership Type:</span>
                <span className="text-white">{registrationData.partnershipType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Country:</span>
                <span className="text-white">{registrationData.country}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Company Details</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
              {formData.companyLegalName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Legal Name:</span>
                  <span className="text-white">{formData.companyLegalName}</span>
                </div>
              )}
              {formData.companyName && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Brand Name:</span>
                  <span className="text-white">{formData.companyName}</span>
                </div>
              )}
              {formData.website && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Website:</span>
                  <span className="text-white">{formData.website}</span>
                </div>
              )}
              {formData.registeredAddress && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Address:</span>
                  <span className="text-white text-right max-w-xs">{formData.registeredAddress}</span>
                </div>
              )}
              {formData.taxId && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax ID:</span>
                  <span className="text-white">{formData.taxId}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{formData.contactPersonName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">{formData.contactPersonEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{formData.contactPersonPhone}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Documents</h3>
            <div className="bg-gray-800/50 rounded-lg p-4 space-y-2 text-sm">
              {Object.keys(registrationData.documents || {}).map((docId) => (
                <div key={docId} className="flex items-center justify-between">
                  <span className="text-gray-400">{docId}:</span>
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Uploaded</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all flex items-center justify-center space-x-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Submit Registration</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="pt-32 pb-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          {/* Draft Restoration Banner */}
          {showDraftBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gradient-to-r from-green-600/20 to-green-400/20 border border-green-500/30 rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-400" />
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
                    className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Partner{' '}
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Registration
              </span>
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Join our partner ecosystem and unlock growth opportunities together
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm font-semibold text-green-400">{completionPercentage}% Complete</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <AuthSection />
              <PartnershipTypeSection />
              <CountrySection />
              <DetailsSection />
              <DocumentsSection />
              <ReviewSection />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                {/* Completion Summary */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Overall Progress</span>
                    <span className="text-lg font-bold text-green-400">{completionPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  {hasSavedDraft && draftExpiresAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Draft auto-saved · {formatTimeRemaining(draftExpiresAt)}
                    </p>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-4">Registration Steps</h3>
                <div className="space-y-3">
                  {[
                    { id: 'auth', label: 'Authentication', completed: isAuthenticated },
                    { id: 'partnership-type', label: 'Partnership Type', completed: !!registrationData.partnershipType },
                    { id: 'country', label: 'Country', completed: !!registrationData.country },
                    { id: 'details', label: 'Details', completed: isFormValid() },
                    { id: 'documents', label: 'Documents', completed: false },
                    { id: 'review', label: 'Review', completed: false },
                  ].map((step) => (
                    <button
                      key={step.id}
                      onClick={() => scrollToSection(step.id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        activeSection === step.id
                          ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                          : step.completed
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-800/50 text-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {step.completed && <CheckCircle className="w-4 h-4 text-green-400" />}
                        <span className="text-sm">{step.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Save Draft Button */}
                {isAuthenticated && completionPercentage > 0 && (
                  <button
                    onClick={handleSaveDraft}
                    className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Save & Continue Later
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
