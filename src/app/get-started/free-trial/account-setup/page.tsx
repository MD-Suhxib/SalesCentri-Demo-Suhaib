'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Lock, Building, Globe, Phone, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { CaptchaOTP } from '../../../components/CaptchaOTP';

export default function AccountSetupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    phone: '',
    website: '',
    teamSize: '',
    industry: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error' | null, message: string}>({
    type: null,
    message: ''
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [usePersonalEmail, setUsePersonalEmail] = useState(false);
  const [showLightningModal, setShowLightningModal] = useState(false);

  const validateEmail = (email: string, allowPersonal: boolean) => {
    if (!email) {
      setEmailError('');
      return;
    }
    const personalEmailDomains = [
      'gmail.com','yahoo.com','hotmail.com','outlook.com','aol.com','icloud.com','me.com','mac.com','live.com','msn.com','ymail.com','rocketmail.com','protonmail.com','tutanota.com','zoho.com'
    ];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!allowPersonal && emailDomain && personalEmailDomains.includes(emailDomain)) {
      setEmailError('Please use your business email address or check "I don\'t have a business email" below.');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Require captcha verification on final submission
    if (!captchaVerified) {
      setSubmitStatus({ type: 'error', message: 'Please complete captcha verification before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      // Map form data to API format
      const apiData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        business_email: formData.email,
        no_business_email: usePersonalEmail,
        linkedin_profile: formData.website,
        company: formData.company,
        job_title: formData.jobTitle,
        sales_team_size: formData.teamSize,
        areas_of_interest: [
          'Free Trial Signup',
          `Industry: ${formData.industry}`,
          `Team Size: ${formData.teamSize}`,
          formData.phone ? `Phone: ${formData.phone}` : ''
        ].filter(Boolean),
        additional_information: [
          'Free Trial Account Setup',
          formData.website ? `Website: ${formData.website}` : '',
          `Industry: ${formData.industry}`,
          `Team Size: ${formData.teamSize}`
        ].filter(Boolean).join('\n\n')
      };

      const response = await fetch('/api/contact-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Account created successfully! Welcome to Sales Centri.'
        });
        setShowLightningModal(true);
      } else {
        throw new Error(result.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to create account. Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'email') {
      validateEmail(value, usePersonalEmail);
    }
  };

  const teamSizes = [
    '1-5 employees',
    '6-20 employees',
    '21-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Financial Services',
    'Manufacturing',
    'Retail & E-commerce',
    'Professional Services',
    'Real Estate',
    'Education',
    'Non-profit',
    'Other'
  ];

  const steps = [
    { number: 1, title: 'Personal Info', completed: currentStep > 1 },
    { number: 2, title: 'Company Info', completed: currentStep > 2 },
    { number: 3, title: 'Verification', completed: false }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Create Your <span className="text-blue-400">Account</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Set up your Sales Centri account and start your 14-day free trial. No credit card required.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.completed 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : currentStep === step.number 
                        ? 'border-blue-500 text-blue-500' 
                        : 'border-gray-600 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="text-sm font-semibold">{step.number}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      step.completed || currentStep === step.number ? 'text-white' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`ml-6 w-16 h-0.5 ${
                      step.completed ? 'bg-blue-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6">Personal Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none ${emailError ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-blue-500'}`}
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                      {emailError && (
                        <p className="text-red-400 text-sm mt-2">{emailError}</p>
                      )}
                      <div className="mt-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={usePersonalEmail}
                            onChange={(e) => {
                              setUsePersonalEmail(e.target.checked);
                              if (formData.email) validateEmail(formData.email, e.target.checked);
                            }}
                            className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-300 text-sm">I don't have a business email</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Create a strong password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-6">Company Information</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company Name *
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Enter your company name"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Job Title
                        </label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Your job title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Team Size *
                        </label>
                        <select
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                          required
                        >
                          <option value="">Select team size</option>
                          {teamSizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Industry *
                        </label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                          required
                        >
                          <option value="">Select industry</option>
                          {industries.map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Captcha Verification (final step) */}
                {currentStep >= 2 && (
                  <CaptchaOTP onCaptchaVerified={setCaptchaVerified} />
                )}

                {/* Status Messages */}
                {submitStatus.type && (
                  <div className={`p-4 rounded-lg border ${
                    submitStatus.type === 'success' 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {submitStatus.message}
                  </div>
                )}

                {/* Lightning Mode Modal */}
                {showLightningModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                      <h2 className="text-2xl font-bold text-white mb-4">Check out Lightning Mode</h2>
                      <p className="text-gray-300 mb-6">Explore SalesGPT and see instant AI-powered insights.</p>
                      <button
                        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 text-lg cursor-pointer"
                        onClick={() => (window.location.href = '/solutions/psa-suite-one-stop-solution')}
                      >
                        Check out Lightning Mode
                      </button>
                      <button
                        className="mt-4 text-gray-400 hover:text-white"
                        onClick={() => setShowLightningModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="border border-gray-600 text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || (currentStep >= 2 && !captchaVerified) || !!emailError}
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center flex-1 cursor-pointer ${
                      isSubmitting || (currentStep >= 2 && !captchaVerified) || !!emailError ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting 
                      ? 'Creating Account...' 
                      : currentStep < 2 
                        ? 'Continue' 
                        : !!emailError
                          ? 'Fix Email Validation to Submit'
                          : !captchaVerified
                            ? 'Complete Captcha Verification to Submit'
                            : 'Create Account & Start Trial'
                    }
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
