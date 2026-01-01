'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, Building, Phone, DollarSign, Users, MessageSquare, Calendar } from 'lucide-react';
import { CaptchaOTP } from '../../../components/CaptchaOTP';

export default function SalesInquiryPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phone: '',
    teamSize: '',
    budget: '',
    timeline: '',
    currentSolution: '',
    painPoints: '',
    specificInterests: [] as string[],
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [usePersonalEmail, setUsePersonalEmail] = useState(false);
  const [showLightningModal, setShowLightningModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error' | null, message: string}>({
    type: null,
    message: ''
  });

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
        linkedin_profile: '',
        company: formData.company,
        job_title: formData.jobTitle,
        sales_team_size: formData.teamSize,
        areas_of_interest: [
          ...formData.specificInterests,
          ...(formData.budget ? [`Budget: ${formData.budget}`] : []),
          ...(formData.timeline ? [`Timeline: ${formData.timeline}`] : []),
          ...(formData.preferredContact ? [`Preferred Contact: ${formData.preferredContact}`] : [])
        ],
        additional_information: [
          formData.message,
          formData.currentSolution ? `Current Solution: ${formData.currentSolution}` : '',
          formData.painPoints ? `Pain Points: ${formData.painPoints}` : ''
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
          message: 'Thank you! Your sales inquiry has been submitted successfully. Our sales team will contact you soon.'
        });
        setShowLightningModal(true);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          jobTitle: '',
          phone: '',
          teamSize: '',
          budget: '',
          timeline: '',
          currentSolution: '',
          painPoints: '',
          specificInterests: [],
          message: '',
          preferredContact: 'email'
        });
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit inquiry. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'email') {
      validateEmail(value, usePersonalEmail);
    }
  };

  const handleInterestChange = (interest: string) => {
    setFormData({
      ...formData,
      specificInterests: formData.specificInterests.includes(interest)
        ? formData.specificInterests.filter(i => i !== interest)
        : [...formData.specificInterests, interest]
    });
  };

  const teamSizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const budgetRanges = [
    'Under $5,000/month',
    '$5,000 - $15,000/month',
    '$15,000 - $50,000/month',
    '$50,000 - $100,000/month',
    '$100,000+/month'
  ];

  const timelines = [
    'Immediate (within 1 month)',
    'Short-term (1-3 months)',
    'Medium-term (3-6 months)',
    'Long-term (6+ months)',
    'Just exploring options'
  ];

  const interests = [
    'Lead Generation',
    'Email Marketing',
    'Voice AI Solutions',
    'CRM Integration',
    'Data Enrichment',
    'Sales Automation',
    'Custom Development',
    'Enterprise Solutions'
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
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Sales <span className="text-blue-400">Inquiry</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Ready to transform your sales process? Share your requirements and our sales team will create a customized solution for your business.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                  
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

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full pl-12 pr-4 py-3 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none ${emailError ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-blue-500'}`}
                          placeholder="Enter your business email"
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
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
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
                  </div>
                </div>

                {/* Business Requirements */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Business Requirements</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Team Size *
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                          required
                        >
                          <option value="">Select team size</option>
                          {teamSizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget Range
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="budget"
                          value={formData.budget}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select budget range</option>
                          {budgetRanges.map((budget) => (
                            <option key={budget} value={budget}>{budget}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Implementation Timeline
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                        >
                          <option value="">Select timeline</option>
                          {timelines.map((timeline) => (
                            <option key={timeline} value={timeline}>{timeline}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      Areas of Interest (Select all that apply)
                    </label>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {interests.map((interest) => (
                        <label
                          key={interest}
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.specificInterests.includes(interest)}
                            onChange={() => handleInterestChange(interest)}
                            className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm text-gray-300">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Additional Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Solution (if any)
                      </label>
                      <input
                        type="text"
                        name="currentSolution"
                        value={formData.currentSolution}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        placeholder="What tools/platforms are you currently using?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Main Pain Points
                      </label>
                      <textarea
                        name="painPoints"
                        value={formData.painPoints}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        placeholder="What challenges are you facing with your current sales process?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Additional Message
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          placeholder="Tell us more about your requirements or specific questions..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Preferred Contact Method
                      </label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="email"
                            checked={formData.preferredContact === 'email'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-300">Email</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="phone"
                            checked={formData.preferredContact === 'phone'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-300">Phone</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="preferredContact"
                            value="both"
                            checked={formData.preferredContact === 'both'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-gray-300">Both</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Captcha Verification */}
                <CaptchaOTP onCaptchaVerified={setCaptchaVerified} />

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
                  <button
                    type="submit"
                    disabled={isSubmitting || !captchaVerified || !!emailError}
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center flex-1 cursor-pointer ${
                      isSubmitting || !captchaVerified || !!emailError ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : !!emailError
                        ? 'Fix Email Validation to Submit'
                        : !captchaVerified
                          ? 'Complete Captcha Verification to Submit'
                          : 'Submit Sales Inquiry'
                    }
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <Link
                    href="/get-started/book-demo"
                    className="border border-gray-600 text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 text-center"
                  >
                    Book Demo Instead
                  </Link>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
