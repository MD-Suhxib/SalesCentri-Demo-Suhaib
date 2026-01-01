'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Users, CheckCircle, ArrowRight, Star, Zap, Shield, Search, Database, Clock, TrendingUp } from 'lucide-react';

export default function LeadGenerationPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/lead-generation';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: 'per month',
      description: 'Perfect for small sales teams and startups getting started with AI-powered lead generation',
      popular: false,
      features: [
        'Up to 5,000 leads per month',
        'Basic AI prospect discovery',
        'Email verification included',
        'Standard data enrichment (25 fields)',
        'CRM integration (3 platforms)',
        'Email support',
        'Basic analytics dashboard',
        'Lead export functionality'
      ],
      cta: 'Start Free Trial',
      highlight: false
    },
    {
      name: 'Professional',
      price: '$149',
      period: 'per month',
      description: 'Advanced features for growing sales teams that need comprehensive lead intelligence',
      popular: true,
      features: [
        'Up to 25,000 leads per month',
        'Advanced AI prospect scoring',
        'Phone &amp; email verification',
        'Premium data enrichment (50+ fields)',
        'All CRM integrations',
        'Priority support + training',
        'Advanced analytics &amp; reporting',
        'Intent signal monitoring',
        'Real-time alerts &amp; notifications',
        'Custom search filters',
        'Bulk export capabilities',
        'API access (basic)'
      ],
      cta: 'Start Free Trial',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'Unlimited leads with enterprise-grade features and dedicated support',
      popular: false,
      features: [
        'Unlimited leads and searches',
        'Custom AI model training',
        'Advanced intent intelligence',
        'Complete data enrichment suite',
        'Custom integrations',
        'Dedicated success manager',
        'Custom reporting &amp; dashboards',
        'White-label options',
        'Advanced security features',
        'SLA guarantees',
        'On-premise deployment option',
        'Full API access'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  const addOns = [
    {
      name: 'Additional Leads',
      price: '$0.12',
      period: 'per lead',
      description: 'Extra verified leads beyond your plan&apos;s monthly limit',
      icon: Search
    },
    {
      name: 'Premium Data Enrichment',
      price: '$0.25',
      period: 'per contact',
      description: 'Enhanced data with 75+ fields including technographics and intent data',
      icon: Database
    },
    {
      name: 'Custom Integrations',
      price: '$2,500',
      period: 'one-time setup',
      description: 'Custom API integrations for proprietary systems and workflows',
      icon: Zap
    },
    {
      name: 'Dedicated Success Manager',
      price: '$1,500',
      period: 'per month',
      description: 'Dedicated customer success manager for strategy and optimization',
      icon: Users
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
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lead Generation Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Generate 5x more qualified leads with AI-powered prospect discovery. Choose the plan that scales with your sales team&apos;s growth.
            </p>

            {/* ROI Calculator Teaser */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">ROI Impact Calculator</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Our customers typically see 300% increase in qualified leads and 45% reduction in acquisition costs:
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">5x</div>
                  <div className="text-gray-400">More qualified leads</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">45%</div>
                  <div className="text-gray-400">Lower acquisition cost</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">250%</div>
                  <div className="text-gray-400">ROI increase</div>
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
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative rounded-2xl p-8 border ${
                    plan.highlight 
                      ? 'bg-gradient-to-b from-blue-900/30 to-purple-900/30 border-blue-500/50' 
                      : 'bg-gray-800/50 border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-gray-400 ml-2">/{plan.period}</span>}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.cta === 'Start Free Trial' ? '/get-started/free-trial' : '/get-started/contact-form'}
                    className={`w-full py-4 px-6 rounded-lg font-semibold transition-all duration-300 group inline-flex items-center justify-center ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                        : 'border border-gray-600 text-white hover:bg-gray-800'
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Add-on Services</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enhance your lead generation capabilities with premium add-ons for specialized requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {addOns.map((addon, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <addon.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{addon.name}</h3>
                  <p className="text-gray-300 mb-4">{addon.description}</p>
                  <div className="border-t border-gray-700 pt-4">
                    <div className="text-2xl font-bold text-white">{addon.price}</div>
                    <div className="text-gray-400">{addon.period}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Lead Quality Guarantee */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Lead Quality Guarantee</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                We&apos;re so confident in our lead quality that we offer guarantees and credits for undeliverable contacts.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: '95% Accuracy Guarantee',
                  description: 'Email deliverability rate of 95% or higher, or we provide replacement contacts at no cost.',
                  icon: Shield,
                  features: ['Email bounce rate <5%', 'Phone number accuracy >90%', 'Real-time verification', 'Automatic replacements']
                },
                {
                  title: 'Data Freshness Promise',
                  description: 'All contact data is verified within 30 days, with real-time updates for job changes and moves.',
                  icon: Clock,
                  features: ['30-day data freshness', 'Job change monitoring', 'Real-time updates', 'Automated data refresh']
                },
                {
                  title: 'Compliance Assurance',
                  description: 'Full GDPR, CCPA, and CAN-SPAM compliance with opt-out management and privacy controls.',
                  icon: Target,
                  features: ['GDPR compliant', 'Opt-out management', 'Privacy controls', 'Audit trail records']
                }
              ].map((guarantee, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                    <guarantee.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{guarantee.title}</h3>
                  <p className="text-gray-300 mb-6">{guarantee.description}</p>
                  <ul className="space-y-3">
                    {guarantee.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Implementation Timeline */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Implementation Timeline</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Get up and running quickly with our streamlined onboarding process and dedicated support team.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                {
                  day: 'Day 1',
                  title: 'Account Setup',
                  description: 'Account creation, initial configuration, and team member access setup.',
                  icon: Users
                },
                {
                  day: 'Day 2-3',
                  title: 'Integration &amp; Training',
                  description: 'CRM integration setup and comprehensive team training sessions.',
                  icon: Zap
                },
                {
                  day: 'Day 4-5',
                  title: 'First Campaign Launch',
                  description: 'Launch your first lead generation campaign with our guidance and support.',
                  icon: Target
                },
                {
                  day: 'Ongoing',
                  title: 'Optimization &amp; Support',
                  description: 'Continuous optimization based on performance data and dedicated support.',
                  icon: TrendingUp
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-xl font-bold text-blue-400 mb-2">{step.day}</div>
                  <h3 className="text-lg font-bold mb-3 text-white" dangerouslySetInnerHTML={{ __html: step.title }}></h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: 'What&apos;s included in the free trial?',
                  answer: 'The 14-day free trial includes 1,000 verified leads, full platform access, CRM integration setup, and dedicated onboarding support.'
                },
                {
                  question: 'How do you ensure lead quality and accuracy?',
                  answer: 'We use real-time verification, multiple data sources, and AI validation to ensure 95%+ email deliverability and 90%+ phone accuracy. Replacement credits are provided for undeliverable contacts.'
                },
                {
                  question: 'Can I upgrade or downgrade my plan anytime?',
                  answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle.'
                },
                {
                  question: 'What CRM systems do you integrate with?',
                  answer: 'We integrate with all major CRM platforms including Salesforce, HubSpot, Pipedrive, Zoho, Microsoft Dynamics, and many others. Custom integrations are available for Enterprise plans.'
                },
                {
                  question: 'Is my data secure and compliant?',
                  answer: 'Yes, we maintain SOC 2 Type II certification, GDPR compliance, and enterprise-grade security. All data is encrypted in transit and at rest, with comprehensive privacy controls.'
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <h3 className="text-xl font-bold mb-3 text-white">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-purple-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Generate 5x More Qualified Leads?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of sales teams using our AI-powered platform to find and convert high-quality prospects. 
              Start your free trial today—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
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
