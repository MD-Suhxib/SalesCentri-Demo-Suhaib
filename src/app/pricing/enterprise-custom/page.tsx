'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Shield, 
  Users, 
  ArrowRight, 
  Check, 
  Phone, 
  Mail, 
  Calendar,
  Lock,
  Database,
  Cog,
  Headphones,
  Award,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { CaptchaOTP } from '../../components/CaptchaOTP';

export default function EnterpriseCustomPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    teamSize: '',
    industry: '',
    currentCRM: '',
    useCase: '',
    timeline: '',
    message: ''
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [usePersonalEmail, setUsePersonalEmail] = useState(false);
  const [showLightningModal, setShowLightningModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  const enterpriseFeatures = [
    {
      icon: Users,
      title: 'Unlimited Users',
      description: 'Scale without limits - add as many team members as you need'
    },
    {
      icon: Database,
      title: 'Custom Data Architecture',
      description: 'Tailored data models and schemas to fit your business needs'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'SOC 2, GDPR compliance, SSO, and advanced security controls'
    },
    {
      icon: Cog,
      title: 'Custom Integrations',
      description: 'Bespoke integrations with your existing tech stack'
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      description: '24/7 support with dedicated account manager and SLA guarantees'
    },
    {
      icon: Award,
      title: 'White-Label Options',
      description: 'Fully branded experience with your company identity'
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Proven ROI',
      description: 'Average 300% ROI within 6 months of implementation',
      stat: '300%'
    },
    {
      icon: Clock,
      title: 'Faster Implementation',
      description: 'Dedicated implementation team for rapid deployment',
      stat: '50% Faster'
    },
    {
      icon: Target,
      title: 'Higher Conversion',
      description: 'Enterprise clients see 40% higher conversion rates',
      stat: '+40%'
    },
    {
      icon: Shield,
      title: 'Enterprise Grade',
      description: '99.9% uptime SLA with enterprise-grade infrastructure',
      stat: '99.9%'
    }
  ];

  const industries = [
    'Technology',
    'Financial Services',
    'Healthcare',
    'Manufacturing',
    'Real Estate',
    'Professional Services',
    'Education',
    'Government',
    'Other'
  ];

  const teamSizes = [
    '50-100 employees',
    '100-500 employees',
    '500-1000 employees',
    '1000+ employees'
  ];

  const timelines = [
    'Immediate (within 30 days)',
    'Short-term (1-3 months)',
    'Medium-term (3-6 months)',
    'Long-term (6+ months)'
  ];

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

    // Check for captcha verification
    if (!captchaVerified) {
      setSubmitStatus({
        type: "error",
        message: "Please complete captcha verification before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Split contact name into first and last name
      const nameParts = formData.contactName.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      // Map form data to API format
      const apiData = {
        first_name,
        last_name,
        business_email: formData.email,
        no_business_email: usePersonalEmail,
        linkedin_profile: '', // Not collected in enterprise form
        company: formData.companyName,
        job_title: 'Enterprise Contact', // Default since not collected
        sales_team_size: formData.teamSize,
        areas_of_interest: [formData.industry, formData.useCase].filter(Boolean),
        additional_information: `Enterprise Quote Request Details:
Industry: ${formData.industry}
Current CRM: ${formData.currentCRM}
Use Case: ${formData.useCase}
Timeline: ${formData.timeline}
Phone: ${formData.phone}
Additional Requirements: ${formData.message}`
      };

      const response = await fetch("/api/contact-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your enterprise quote request has been submitted successfully. We'll get back to you within 24 hours.",
        });
        setShowLightningModal(true);
        // Reset form
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          teamSize: '',
          industry: '',
          currentCRM: '',
          useCase: '',
          timeline: '',
          message: ''
        });
        setCaptchaVerified(false);
      } else {
        throw new Error(result.error || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to submit form. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-section">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-10 h-10 text-blue-400" />
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ENTERPRISE SOLUTION
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Enterprise <span className="text-blue-400">Sales Platform</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Custom-built solutions for large organizations. Unlimited scale, enterprise security, and dedicated support to transform your sales operations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => {
                      const element = document.getElementById('contact-form');
                      if (element) {
                        element.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center cursor-pointer"
                  >
                    Request Custom Quote
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <a
                    href="https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 text-center"
                    data-track="enterprise_custom_schedule_demo_hero"
                  >
                    Schedule Demo
                  </a>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/30 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Enterprise Benefits</h3>
                  <div className="space-y-4">
                    {benefits.map((benefit) => (
                      <div key={benefit.title} className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                          <benefit.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white">{benefit.title}</h4>
                            <span className="text-blue-400 font-bold">{benefit.stat}</span>
                          </div>
                          <p className="text-gray-400 text-sm">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Enterprise-Grade Features</h2>
              <p className="text-xl text-gray-300">Built for scale, security, and performance</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enterpriseFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">{feature.title}</h3>
                  <p className="text-gray-400 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">What&apos;s Included</h2>
              <p className="text-xl text-gray-300">Everything you need for enterprise success</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6">Core Platform</h3>
                {[
                  'Unlimited AI searches and validations',
                  'Unlimited team members',
                  'All CRM integrations + custom builds',
                  'Advanced analytics and reporting',
                  'Custom workflow automation',
                  'White-label branding options',
                  'API access with higher rate limits',
                  'Mobile apps with custom features'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white mb-6">Enterprise Services</h3>
                {[
                  '24/7 dedicated support team',
                  'Dedicated account manager',
                  'Custom implementation plan',
                  'Data migration assistance',
                  'Ongoing training and consulting',
                  'SLA guarantees (99.9% uptime)',
                  'Security audits and compliance',
                  'Priority feature development'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form" className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Get Your Custom Quote</h2>
              <p className="text-xl text-gray-300">Tell us about your needs and we&apos;ll create a tailored solution</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-300 mb-2">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none ${emailError ? 'border-red-500 focus:border-red-400' : 'border-gray-600 focus:border-blue-500'}`}
                      placeholder="your.email@company.com"
                    />
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
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-2">
                      Team Size *
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      required
                      value={formData.teamSize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select team size</option>
                      {teamSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="currentCRM" className="block text-sm font-medium text-gray-300 mb-2">
                      Current CRM
                    </label>
                    <input
                      type="text"
                      id="currentCRM"
                      name="currentCRM"
                      value={formData.currentCRM}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      placeholder="Salesforce, HubSpot, etc."
                    />
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                      Implementation Timeline
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">Select timeline</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>{timeline}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="useCase" className="block text-sm font-medium text-gray-300 mb-2">
                    Primary Use Case *
                  </label>
                  <input
                    type="text"
                    id="useCase"
                    name="useCase"
                    required
                    value={formData.useCase}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Lead generation, account management, sales automation..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    placeholder="Tell us about any specific requirements, integrations, or questions..."
                  />
                </div>

                {/* Captcha Verification */}
                <CaptchaOTP
                  onCaptchaVerified={setCaptchaVerified}
                />

                {/* Status Messages */}
                {submitStatus.type && (
                  <div
                    className={`p-4 rounded-lg border ${
                      submitStatus.type === "success"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
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
                        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 text-lg cursor-pointer"
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

                <button
                  type="submit"
                  disabled={isSubmitting || !captchaVerified || !!emailError}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSubmitting || !captchaVerified || !!emailError
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-2xl hover:shadow-blue-500/30"
                  }`}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : !!emailError ? (
                    "Fix Email Validation to Submit"
                  ) : !captchaVerified ? (
                    "Complete Captcha Verification to Submit"
                  ) : (
                    "Request Custom Quote"
                  )}
                  {!isSubmitting && captchaVerified && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Prefer to Talk?</h2>
              <p className="text-xl text-gray-300">Our enterprise team is ready to help</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center"
              >
                <Phone className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Call Us</h3>
                <p className="text-gray-400 mb-4">Enterprise Sales Hotline</p>
                <a href="tel:+14157544494" className="text-blue-400 hover:text-blue-300 font-semibold">
                  +1 415-754-4766
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center"
              >
                <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Email Us</h3>
                <p className="text-gray-400 mb-4">Enterprise Solutions Team</p>
                <a href="mailto:info@salescentri.com" className="text-blue-400 hover:text-blue-300 font-semibold">
                  info@salescentri.com
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center"
              >
                <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Schedule Demo</h3>
                <p className="text-gray-400 mb-4">Personalized Walkthrough</p>
                <a 
                  href="https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                  data-track="enterprise_custom_book_demo_call"
                >
                  Book Demo Call
                </a>
              </motion.div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
