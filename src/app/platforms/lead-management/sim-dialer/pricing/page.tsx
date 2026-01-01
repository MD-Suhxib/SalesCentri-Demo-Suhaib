'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Check, X, ArrowRight, BarChart3, Zap, Users, Shield, Clock,TrendingUp } from 'lucide-react';

export default function SIMDialerPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/sim-dialer';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$49',
      period: '/agent/month',
      description: 'Essential power dialing for small sales teams',
      popular: false,
      features: [
        { name: 'Up to 3 simultaneous lines per agent', included: true },
        { name: 'Basic call detection &amp; routing', included: true },
        { name: 'Standard voicemail drops', included: true },
        { name: 'Basic reporting dashboard', included: true },
        { name: 'Email &amp; chat support', included: true },
        { name: 'CRM integration (3 platforms)', included: true },
        { name: 'Advanced AI detection', included: false },
        { name: 'Predictive dialing algorithms', included: false },
        { name: 'Custom voicemail personalization', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false }
      ],
      cta: 'Start Free Trial',
      ctaLink: '/get-started/free-trial'
    },
    {
      name: 'Professional',
      price: '$149',
      period: '/agent/month',
      description: 'Advanced multi-line dialing for growing teams',
      popular: true,
      features: [
        { name: 'Up to 6 simultaneous lines per agent', included: true },
        { name: 'Advanced AI call detection', included: true },
        { name: 'Personalized voicemail drops', included: true },
        { name: 'Advanced reporting &amp; analytics', included: true },
        { name: 'Priority email &amp; chat support', included: true },
        { name: 'CRM integration (all platforms)', included: true },
        { name: 'Predictive dialing algorithms', included: true },
        { name: 'Local presence dialing', included: true },
        { name: 'A/B testing for voicemails', included: true },
        { name: 'Real-time performance monitoring', included: true },
        { name: 'REST API access', included: true },
        { name: 'Phone support', included: false }
      ],
      cta: 'Start Free Trial',
      ctaLink: '/get-started/free-trial'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Maximum performance for large sales organizations',
      popular: false,
      features: [
        { name: 'Up to 10 simultaneous lines per agent', included: true },
        { name: 'Premium AI detection &amp; routing', included: true },
        { name: 'Dynamic voicemail personalization', included: true },
        { name: 'Custom dashboards &amp; reports', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Unlimited CRM integrations', included: true },
        { name: 'Advanced predictive algorithms', included: true },
        { name: 'Global local presence', included: true },
        { name: 'Advanced A/B testing suite', included: true },
        { name: 'Real-time coaching tools', included: true },
        { name: 'Full API &amp; webhook access', included: true },
        { name: '24/7 phone &amp; chat support', included: true }
      ],
      cta: 'Contact Sales',
      ctaLink: '/get-started/book-demo'
    }
  ];

  const addOns = [
    {
      name: 'Additional Lines',
      description: 'Extra simultaneous dialing lines beyond plan limits',
      pricing: '$25/line/month',
      icon: Phone
    },
    {
      name: 'Premium Call Analytics',
      description: 'Advanced analytics, custom reports, and business intelligence features',
      pricing: '$99/month',
      icon: BarChart3
    },
    {
      name: 'Custom Integrations',
      description: 'Bespoke integrations with legacy systems and proprietary platforms',
      pricing: 'Starting at $2,500',
      icon: Zap
    },
    {
      name: 'White-label Solution',
      description: 'Branded SIM Dialer platform for agencies and resellers',
      pricing: 'Contact for pricing',
      icon: Users
    },
    {
      name: 'Compliance Package',
      description: 'Advanced compliance tools for regulated industries (HIPAA, financial)',
      pricing: '$199/month',
      icon: Shield
    },
    {
      name: 'Professional Services',
      description: 'Implementation, training, and optimization consulting services',
      pricing: '$225/hour',
      icon: Users
    }
  ];

  const faqs = [
    {
      question: 'How many calls can each agent make per hour?',
      answer: 'With SIM Dialer, agents can typically make 150-200+ calls per hour depending on the number of lines, contact list quality, and answer rates. This represents a 300-400% increase over manual dialing.'
    },
    {
      question: 'What is the accuracy of call detection?',
      answer: 'Our Advanced AI call detection achieves 99%+ accuracy in distinguishing between live answers, voicemails, busy signals, and disconnected numbers, ensuring optimal call handling and agent efficiency.'
    },
    {
      question: 'Can I use my existing phone numbers?',
      answer: 'Yes! You can port your existing numbers to SIM Dialer or use our local presence feature to display local caller IDs from our extensive number inventory to increase answer rates.'
    },
    {
      question: 'How does billing work for multiple agents?',
      answer: 'Billing is per agent per month. You can add or remove agents at any time, and changes will be reflected in your next billing cycle. Volume discounts are available for teams of 50+ agents.'
    },
    {
      question: 'Is there a setup fee or long-term contract?',
      answer: 'No setup fees for standard plans, and all subscriptions are month-to-month with no long-term contracts. Custom implementations may have one-time setup costs.'
    },
    {
      question: 'What kind of support is included?',
      answer: 'All plans include comprehensive onboarding, training materials, and ongoing support. Professional and Enterprise plans include priority support with faster response times and dedicated account management.'
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
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-white to-red-400 bg-clip-text text-transparent">
                  SIM Dialer Pricing
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Supercharge your sales team&apos;s calling productivity with intelligent multi-line dialing. 
                Choose the perfect plan to maximize talk time and accelerate your revenue growth.
              </p>
            </div>

            {/* Pricing Toggle */}
            <div className="flex justify-center mb-16">
              <div className="bg-gray-800/50 rounded-lg p-2 border border-gray-700">
                <div className="flex">
                  <button className="px-6 py-2 rounded-md bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium">
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
                      ? 'border-orange-500/50 ring-2 ring-orange-500/20' 
                      : 'border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-medium">
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
                          <Check className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
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
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
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
                Enhance your SIM Dialer experience with additional capabilities and professional services.
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
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mb-4">
                    <addon.icon className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{addon.name}</h3>
                  <p className="text-gray-300 mb-4 text-sm">{addon.description}</p>
                  <div className="text-orange-400 font-semibold">{addon.pricing}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">SIM Dialer ROI Impact</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how SIM Dialer delivers measurable ROI through increased productivity and higher conversion rates.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Talk Time Increase',
                  description: 'More time talking to prospects means more opportunities to close deals',
                  value: '+400%',
                  icon: Clock
                },
                {
                  title: 'Calls Per Hour',
                  description: 'Dramatically increase calling volume without adding more staff',
                  value: '200+',
                  icon: Phone
                },
                {
                  title: 'Cost Per Lead',
                  description: 'Reduce cost per lead through improved calling efficiency and higher connect rates',
                  value: '-60%',
                  icon: TrendingUp
                },
                {
                  title: 'Revenue Per Rep',
                  description: 'Increase individual rep performance and overall team revenue generation',
                  value: '+250%',
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
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-orange-400" />
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
                Common questions about SIM Dialer pricing, features, and implementation.
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
          className="py-20 bg-gradient-to-r from-orange-900/20 via-black to-red-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to 4x Your Calling Productivity?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of sales teams using SIM Dialer to transform their calling operations and achieve 
              record-breaking results. Start your free trial today—no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group inline-flex items-center justify-center"
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
