'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, User, Mail, MessageSquare, HelpCircle, Search, Phone, Video, Clock } from 'lucide-react';
import { CaptchaOTP } from '../../../components/CaptchaOTP';

export default function GeneralQuestionsPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    category: '',
    priority: 'normal',
    message: '',
    preferredResponse: 'email'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error' | null, message: string}>({
    type: null,
    message: ''
  });
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
        company: 'Not provided',
        job_title: 'Not provided',
        linkedin_profile: '',
        sales_team_size: '',
        areas_of_interest: [
          formData.category,
          `Priority: ${formData.priority}`,
          `Preferred Response: ${formData.preferredResponse}`
        ].filter(Boolean),
        additional_information: [
          `Subject: ${formData.subject}`,
          `Category: ${formData.category}`,
          `Message: ${formData.message}`
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
          message: 'Thank you! Your question has been submitted successfully. We\'ll respond soon.'
        });
        setShowLightningModal(true);
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          category: '',
          priority: 'normal',
          message: '',
          preferredResponse: 'email'
        });
        setUsePersonalEmail(false);
        setEmailError('');
        setCaptchaVerified(false);
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit question. Please try again or contact us directly.'
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

  const categories = [
    'General Information',
    'Pricing & Plans',
    'Technical Support',
    'Feature Questions',
    'Integration Help',
    'Account Management',
    'Billing & Payments',
    'Training & Onboarding',
    'API & Development',
    'Other'
  ];

  const faqCategories = [
    {
      title: 'Getting Started',
      questions: [
        {
          question: 'How do I set up my first campaign?',
          answer: 'Setting up your first campaign is easy! Navigate to the Campaigns section and click "Create New Campaign". Our step-by-step wizard will guide you through the process.'
        },
        {
          question: 'What integrations are available?',
          answer: 'Sales Centri integrates with popular CRMs like Salesforce, HubSpot, Pipedrive, and many others. Check our integrations page for the full list.'
        },
        {
          question: 'How long is the free trial?',
          answer: 'We offer a 14-day free trial with full access to all features. No credit card required to start.'
        }
      ]
    },
    {
      title: 'Pricing & Billing',
      questions: [
        {
          question: 'Can I change my plan anytime?',
          answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, PayPal, and wire transfers for enterprise accounts.'
        },
        {
          question: 'Is there a setup fee?',
          answer: 'No setup fees for any of our plans. You only pay the monthly or annual subscription fee.'
        }
      ]
    },
    {
      title: 'Technical',
      questions: [
        {
          question: 'What are the API rate limits?',
          answer: 'API rate limits vary by plan. Starter plans have 1,000 requests/hour, while Enterprise plans have unlimited API access.'
        },
        {
          question: 'How secure is my data?',
          answer: 'We use enterprise-grade security including SSL encryption, SOC 2 compliance, and regular security audits.'
        },
        {
          question: 'Can I export my data?',
          answer: 'Yes, you can export all your data at any time in various formats including CSV, Excel, and JSON.'
        }
      ]
    }
  ];

  const contactOptions = [
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      availability: 'Available 24/7',
      action: 'Start Chat',
      link: '#'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      availability: 'Mon-Fri, 9AM-6PM EST',
      action: 'Call Now',
      link: 'tel:+1-800-SALES-AI'
    },
    {
      icon: Video,
      title: 'Schedule Call',
      description: 'Book a personalized consultation',
      availability: 'Available anytime',
      action: 'Book Call',
      link: '/get-started/book-demo'
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

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
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                General <span className="text-blue-400">Questions</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Have questions about Sales Centri? Browse our FAQ or contact our support team for personalized assistance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Quick Contact Options */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Get Help Fast</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {contactOptions.map((option, index) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 text-center"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-4">
                      <option.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{option.title}</h3>
                    <p className="text-gray-400 mb-2">{option.description}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4" />
                      {option.availability}
                    </div>
                    <Link
                      href={option.link}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      {option.action}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Search */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search FAQs..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-6">{category.title}</h3>
                  <div className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <div key={index} className="border-b border-gray-700/50 pb-4 last:border-b-0 last:pb-0">
                        <h4 className="text-lg font-semibold text-blue-400 mb-2">{faq.question}</h4>
                        <p className="text-gray-300">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Still Have Questions?</h2>
              <p className="text-gray-300 text-center mb-8">Can\'t find what you\'re looking for? Send us a message and we\'ll get back to you within 24 hours.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Brief subject of your question"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <HelpCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Priority Level
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="low"
                        checked={formData.priority === 'low'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Low</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="normal"
                        checked={formData.priority === 'normal'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Normal</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="high"
                        checked={formData.priority === 'high'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">High</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priority"
                        value="urgent"
                        checked={formData.priority === 'urgent'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Urgent</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Question *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Please describe your question in detail..."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Preferred Response Method
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredResponse"
                        value="email"
                        checked={formData.preferredResponse === 'email'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Email</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferredResponse"
                        value="phone"
                        checked={formData.preferredResponse === 'phone'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-500 bg-gray-800 border-gray-600 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Phone Call</span>
                    </label>
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
                    disabled={isSubmitting || !!emailError || !captchaVerified}
                    className={`bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center flex-1 cursor-pointer ${
                      isSubmitting || !!emailError || !captchaVerified ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : !!emailError ? 'Fix Email Validation to Submit' : !captchaVerified ? 'Complete Captcha Verification to Submit' : 'Send Question'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <Link
                    href="/resources/faq"
                    className="border border-gray-600 text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 text-center"
                  >
                    Browse All FAQs
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
