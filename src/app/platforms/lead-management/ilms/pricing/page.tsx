'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Database, Check, X, ArrowRight, Brain, BarChart3, Zap, Users, Target, Clock } from 'lucide-react';

export default function ILMSPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/ilms';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/month',
      description: 'Essential lead management for small teams',
      popular: false,
      features: [
        { name: 'Up to 1,000 leads/month', included: true },
        { name: 'Basic lead capture &amp; validation', included: true },
        { name: 'Standard lead scoring', included: true },
        { name: 'Email nurturing campaigns', included: true },
        { name: 'Basic reporting dashboard', included: true },
        { name: 'Email support', included: true },
        { name: 'AI-powered scoring', included: false },
        { name: 'Advanced workflow automation', included: false },
        { name: 'CRM integrations', included: false },
        { name: 'Custom scoring models', included: false },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false }
      ],
      cta: 'Start Free Trial',
      ctaLink: '/get-started/free-trial'
    },
    {
      name: 'Professional',
      price: '$149',
      period: '/month',
      description: 'Advanced automation for growing sales teams',
      popular: true,
      features: [
        { name: 'Up to 10,000 leads/month', included: true },
        { name: 'Advanced lead capture &amp; enrichment', included: true },
        { name: 'AI-powered lead scoring', included: true },
        { name: 'Multi-channel nurturing campaigns', included: true },
        { name: 'Advanced analytics &amp; reporting', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Visual workflow builder', included: true },
        { name: 'CRM integrations (5 platforms)', included: true },
        { name: 'Custom scoring models', included: true },
        { name: 'REST API access', included: true },
        { name: 'Phone support', included: true },
        { name: 'Dedicated account manager', included: false }
      ],
      cta: 'Start Free Trial',
      ctaLink: '/get-started/free-trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Complete lead management solution for large organizations',
      popular: false,
      features: [
        { name: 'Unlimited leads &amp; contacts', included: true },
        { name: 'Premium data enrichment', included: true },
        { name: 'Advanced AI &amp; machine learning', included: true },
        { name: 'Omnichannel automation', included: true },
        { name: 'Custom dashboards &amp; reports', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Advanced workflow automation', included: true },
        { name: 'Unlimited CRM integrations', included: true },
        { name: 'Custom AI scoring models', included: true },
        { name: 'Full API &amp; webhook access', included: true },
        { name: '24/7 phone &amp; chat support', included: true },
        { name: 'White-label options', included: true }
      ],
      cta: 'Contact Sales',
      ctaLink: '/get-started/book-demo'
    }
  ];

  const addOns = [
    {
      name: 'Additional Lead Volume',
      description: 'Extra monthly lead processing beyond plan limits',
      pricing: '$0.05 per additional lead',
      icon: Target
    },
    {
      name: 'Advanced AI Models',
      description: 'Custom machine learning models trained on your data',
      pricing: '$399/month',
      icon: Brain
    },
    {
      name: 'Premium Integrations',
      description: 'Custom integrations with enterprise tools and legacy systems',
      pricing: 'Starting at $1,500 setup',
      icon: Zap
    },
    {
      name: 'Data Migration Services',
      description: 'Professional data migration from existing lead management systems',
      pricing: 'Starting at $2,500',
      icon: Database
    },
    {
      name: 'Advanced Analytics Package',
      description: 'Custom reporting, predictive analytics, and business intelligence',
      pricing: '$199/month',
      icon: BarChart3
    },
    {
      name: 'Implementation &amp; Training',
      description: 'Professional setup, customization, and team training services',
      pricing: '$200/hour',
      icon: Users
    }
  ];

  const faqs = [
    {
      question: 'How accurate is the AI lead scoring?',
      answer: 'Our AI lead scoring achieves 94% accuracy by analyzing over 200 data points including behavioral patterns, demographic data, and engagement history. The model continuously learns and improves based on your conversion data.'
    },
    {
      question: 'Can I customize the lead scoring criteria?',
      answer: 'Yes! Professional and Enterprise plans include custom scoring model builders. You can define your own criteria, weights, and business rules to create scoring models that match your specific sales process.'
    },
    {
      question: 'What CRM systems do you integrate with?',
      answer: 'iLMS integrates with all major CRM platforms including Salesforce, HubSpot, Pipedrive, Zoho, Microsoft Dynamics, and many others. Enterprise plans include unlimited custom integrations.'
    },
    {
      question: 'How quickly can leads be processed and routed?',
      answer: 'Lead processing and routing happens in real-time, typically within 5 minutes of capture. Our system can handle millions of leads per month with consistent performance and reliability.'
    },
    {
      question: 'Is there a setup fee or contract requirement?',
      answer: 'No setup fees for standard plans, and all plans are month-to-month with no long-term contracts required. Custom implementations may have one-time setup costs depending on complexity.'
    },
    {
      question: 'Can I migrate data from my existing system?',
      answer: 'Absolutely! We provide data migration tools and services to help you seamlessly transition from your current lead management system. Our team can assist with the migration process.'
    }
  ];

  return (
    <>
      {/* Sub-navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <nav className="flex space-x-8">
              {subNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-4 px-2 text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
                  iLMS Pricing
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Transform your lead management with intelligent automation and AI-powered insights. 
                Choose the perfect plan to scale your sales operations and maximize conversions.
              </p>
            </div>

            {/* Pricing Toggle */}
            <div className="flex justify-center mb-16">
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
                <div className="flex">
                  <button className="px-6 py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium">
                    Monthly
                  </button>
                  <button className="px-6 py-2 rounded-md text-gray-400 hover:text-white transition-colors">
                    Annual (Save 20%)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Pricing Plans */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pb-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative bg-gray-800/50 rounded-2xl p-8 border ${
                    plan.popular 
                      ? 'border-purple-500/50 ring-2 ring-purple-500/20' 
                      : 'border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-gray-300">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                        )}
                        <span 
                          className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-500'}`}
                          dangerouslySetInnerHTML={{ __html: feature.name }}
                        ></span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={plan.ctaLink}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 text-center block ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
                        : 'border border-gray-600 text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Add-ons */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Add-ons &amp; Services</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Extend iLMS capabilities with additional features and professional services tailored to your needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {addOns.map((addon, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <addon.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3" dangerouslySetInnerHTML={{ __html: addon.name }}></h3>
                  <p className="text-gray-300 mb-4 text-sm">{addon.description}</p>
                  <div className="text-purple-400 font-semibold">{addon.pricing}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ROI Calculator */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">iLMS ROI Impact</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how iLMS delivers measurable ROI through improved lead conversion and sales efficiency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Conversion Rate Increase',
                  description: 'AI scoring and routing improves lead quality and conversion rates',
                  value: '+240%',
                  icon: Target
                },
                {
                  title: 'Response Time Reduction',
                  description: 'Automated routing ensures leads are contacted within minutes',
                  value: '85%',
                  icon: Clock
                },
                {
                  title: 'Lead Processing Cost',
                  description: 'Automation reduces manual lead processing and administration costs',
                  value: '-60%',
                  icon: BarChart3
                },
                {
                  title: 'Sales Team Efficiency',
                  description: 'Focus on qualified leads increases overall sales productivity',
                  value: '+180%',
                  icon: Users
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{benefit.value}</div>
                  <h3 className="text-lg font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-300">
                Common questions about iLMS pricing, features, and implementation.
              </p>
            </div>

            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
                  <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Lead Management?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of sales teams using iLMS to automate lead processes, improve conversion rates, 
              and scale their revenue operations. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
