'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, Check, X, ArrowRight, Eye, BarChart3, Zap, Users, Target, Brain, Shield, Clock } from 'lucide-react';

export default function LeadStreamPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/lead-stream';

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
      description: 'Perfect for small businesses wanting to identify website visitors',
      popular: false,
      features: [
        { name: 'Up to 1,000 monthly visitors tracked', included: true },
        { name: 'Basic visitor identification', included: true },
        { name: 'Email alerts only', included: true },
        { name: 'Standard dashboard', included: true },
        { name: 'Basic company data', included: true },
        { name: 'Email support', included: true },
        { name: 'Real-time alerts', included: false },
        { name: 'CRM integrations', included: false },
        { name: 'Custom alert rules', included: false },
        { name: 'Intent scoring', included: false },
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
      description: 'Ideal for growing companies ready to maximize visitor conversion',
      popular: true,
      features: [
        { name: 'Up to 5,000 monthly visitors tracked', included: true },
        { name: 'Advanced visitor identification', included: true },
        { name: 'Multi-channel alerts (Email, SMS, Slack)', included: true },
        { name: 'Advanced analytics dashboard', included: true },
        { name: 'Enriched company &amp; contact data', included: true },
        { name: 'Real-time alerts (&lt;30s)', included: true },
        { name: 'Basic CRM integrations', included: true },
        { name: 'Custom alert rules', included: true },
        { name: 'Basic intent scoring', included: true },
        { name: 'REST API access', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Account manager', included: false }
      ],
      cta: 'Start Free Trial',
      ctaLink: '/get-started/free-trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Comprehensive solution for large organizations with advanced needs',
      popular: false,
      features: [
        { name: 'Unlimited monthly visitors tracked', included: true },
        { name: 'Premium visitor identification', included: true },
        { name: 'All alert channels + webhooks', included: true },
        { name: 'Custom dashboards &amp; reporting', included: true },
        { name: 'Complete data enrichment suite', included: true },
        { name: 'Real-time alerts (&lt;10s)', included: true },
        { name: 'All CRM &amp; tool integrations', included: true },
        { name: 'Advanced custom alert rules', included: true },
        { name: 'AI-powered intent scoring', included: true },
        { name: 'Full API &amp; webhook access', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: '24/7 phone &amp; chat support', included: true }
      ],
      cta: 'Contact Sales',
      ctaLink: '/get-started/book-demo'
    }
  ];

  const addOns = [
    {
      name: 'Additional Visitor Volume',
      description: 'Extra monthly visitor tracking beyond plan limits',
      pricing: '$0.02 per additional visitor',
      icon: Eye
    },
    {
      name: 'Advanced Intent Scoring',
      description: 'ML-powered visitor intent analysis and predictive scoring',
      pricing: '$99/month',
      icon: Target
    },
    {
      name: 'Custom Integrations',
      description: 'Bespoke integrations with your existing tools and workflows',
      pricing: 'Starting at $500 setup',
      icon: Zap
    },
    {
      name: 'White-label Solution',
      description: 'Branded Lead Stream solution for agencies and resellers',
      pricing: 'Contact for pricing',
      icon: Users
    },
    {
      name: 'Dedicated IP Pool',
      description: 'Exclusive IP identification resources for enterprise clients',
      pricing: '$200/month',
      icon: Shield
    },
    {
      name: 'Professional Services',
      description: 'Implementation, training, and optimization consulting',
      pricing: '$150/hour',
      icon: Brain
    }
  ];

  const faqs = [
    {
      question: 'What is the visitor identification rate?',
      answer: 'Lead Stream identifies approximately 35% of your website visitors on average. The exact rate depends on your traffic sources, geographic distribution, and visitor types. B2B traffic typically has higher identification rates than B2C.'
    },
    {
      question: 'How quickly do I receive visitor alerts?',
      answer: 'Professional plans receive alerts within 30 seconds, while Enterprise plans get alerts in under 10 seconds. The exact timing depends on your alert delivery method and integration setup.'
    },
    {
      question: 'Can I integrate with my existing CRM?',
      answer: 'Yes! Lead Stream integrates with all major CRM platforms including Salesforce, HubSpot, Pipedrive, and many others. Enterprise plans include custom integration support for proprietary systems.'
    },
    {
      question: 'What visitor data do you provide?',
      answer: 'We provide company information (name, industry, size, location), contact details when available, technographic data, behavioral analytics, and intent scoring. The depth of data varies by plan level.'
    },
    {
      question: 'Is there a setup fee?',
      answer: 'No setup fees for standard plans. Custom integrations and professional services may have implementation costs. All plans include free onboarding and basic setup assistance.'
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle, and we&apos;ll prorate any differences in cost.'
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
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-white to-blue-400 bg-clip-text text-transparent">
                  Lead Stream Pricing
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Choose the perfect plan to start identifying your website visitors and converting anonymous traffic 
                into qualified sales opportunities. All plans include a 14-day free trial.
              </p>
            </div>

            {/* Pricing Toggle */}
            <div className="flex justify-center mb-16">
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
                <div className="flex">
                  <button className="px-6 py-2 rounded-md bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium">
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
                      ? 'border-green-500/50 ring-2 ring-green-500/20' 
                      : 'border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium">
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
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
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
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg hover:shadow-green-500/30'
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Add-ons &amp; Extensions</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enhance your Lead Stream experience with additional features and services tailored to your specific needs.
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
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <addon.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{addon.name}</h3>
                  <p className="text-gray-300 mb-4 text-sm">{addon.description}</p>
                  <div className="text-green-400 font-semibold">{addon.pricing}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Value Proposition */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Lead Stream Delivers ROI</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Lead Stream typically pays for itself within the first month by converting previously invisible traffic into sales opportunities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Increased Lead Volume',
                  description: 'Identify 35% more prospects from existing traffic without additional marketing spend',
                  value: '+35%',
                  icon: Eye
                },
                {
                  title: 'Faster Response Time',
                  description: 'Contact prospects while they&apos;re actively researching, increasing conversion rates',
                  value: '<30s',
                  icon: Clock
                },
                {
                  title: 'Higher Conversion',
                  description: 'Warm outreach to identified visitors converts 5x better than cold outbound',
                  value: '5x',
                  icon: Target
                },
                {
                  title: 'Cost Reduction',
                  description: 'Reduce cost per lead by maximizing value from existing website traffic',
                  value: '-60%',
                  icon: BarChart3
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-green-400" />
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
                Common questions about Lead Stream pricing and features.
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
          className="py-20 bg-gradient-to-r from-green-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Identifying Your Visitors?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of businesses using Lead Stream to convert anonymous website traffic into qualified sales opportunities. 
              Start your free trial today—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 group inline-flex items-center justify-center"
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
