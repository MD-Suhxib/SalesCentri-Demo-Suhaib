'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Star, Zap, Crown, Building } from 'lucide-react';

export default function VoiceBotPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-bot';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const plans = [
    {
      name: 'Bot Starter',
      description: 'Perfect for small businesses starting with voice automation',
      price: 197,
      period: 'month',
      icon: Zap,
      gradient: 'from-blue-500 to-emerald-500',
      features: [
        '1 Voice Bot instance',
        'Up to 1,000 interactions/month',
        'Basic voice personalities (2)',
        'Phone system integration',
        'Standard voice quality',
        'Knowledge base (500 articles)',
        'Basic analytics dashboard',
        'Email support',
        '14-day free trial'
      ],
      limitations: [
        'No multi-language support',
        'No custom voice training',
        'No advanced integrations',
        'No priority support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Bot Professional',
      description: 'Ideal for growing businesses with higher interaction volumes',
      price: 497,
      period: 'month',
      icon: Star,
      gradient: 'from-emerald-500 to-teal-500',
      features: [
        '3 Voice Bot instances',
        'Up to 5,000 interactions/month',
        'Advanced voice personalities (5+)',
        'Multi-channel integration',
        'Premium voice quality',
        'Multi-language support (10 languages)',
        'Knowledge base (unlimited)',
        'Advanced analytics &amp; reporting',
        'CRM integrations',
        'Custom workflows',
        'Priority email support',
        '30-day free trial'
      ],
      limitations: [
        'No custom voice creation',
        'No white-label options',
        'No dedicated account manager'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Bot Enterprise',
      description: 'For large organizations requiring maximum interaction capacity',
      price: 997,
      period: 'month',
      icon: Crown,
      gradient: 'from-teal-500 to-cyan-500',
      features: [
        'Unlimited Voice Bot instances',
        'Unlimited interactions',
        'Custom voice personalities',
        'Enterprise integrations',
        'Ultra-premium voice quality',
        'Multi-language support (30+ languages)',
        'Custom knowledge bases',
        'Real-time analytics',
        'Custom voice training',
        'White-label options',
        'Advanced security &amp; compliance',
        'Dedicated account manager',
        'Priority phone support',
        '60-day free trial'
      ],
      limitations: [],
      cta: 'Try SalesGPT',
      popular: false
    },
    {
      name: 'Custom Bot',
      description: 'Tailored voice bot solutions for specific enterprise needs',
      price: null,
      period: 'custom',
      icon: Building,
      gradient: 'from-gray-500 to-gray-700',
      features: [
        'Custom voice bot development',
        'Dedicated infrastructure',
        'Custom voice synthesis',
        'Industry-specific training',
        'Full API access',
        'On-premise deployment',
        'Custom SLA agreements',
        'Unlimited everything',
        '24/7 dedicated support',
        'Custom compliance requirements'
      ],
      limitations: [],
      cta: 'Try SalesGPT',
      popular: false
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-white to-teal-400 bg-clip-text text-transparent">
              Voice Bot Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Deploy intelligent voice automation that enhances customer interactions and streamlines support operations. 
              Choose the perfect plan for your interaction volume and accessibility needs.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-400 mr-2" />
                <span>Free trial included</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Pricing Plans */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative bg-gray-800/50 rounded-2xl p-8 border ${
                    plan.popular ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/20' : 'border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                      <plan.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-6">{plan.description}</p>
                    
                    <div className="mb-6">
                      {plan.price ? (
                        <>
                          <div className="text-4xl font-bold text-white mb-2">
                            ${plan.price.toLocaleString()}
                          </div>
                          <div className="text-gray-400">per {plan.period}</div>
                        </>
                      ) : (
                        <div className="text-3xl font-bold text-white mb-2">Custom Quote</div>
                      )}
                    </div>

                    <Link
                      href={plan.cta === 'Try SalesGPT' ? '/solutions/psa-suite-one-stop-solution' : '/get-started/free-trial'}
                      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center group ${
                        plan.popular
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/30'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-white mb-4">Features included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                        </li>
                      ))}
                    </ul>

                    {plan.limitations.length > 0 && (
                      <>
                        <h4 className="font-semibold text-white mb-4 mt-6">Not included:</h4>
                        <ul className="space-y-3">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <li key={limitIndex} className="flex items-start">
                              <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-400">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Comparison Table */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Feature Comparison</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Compare all voice bot features across our plans to find the perfect solution for your customer interaction needs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800/30 rounded-xl border border-gray-700/50">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-6 text-white font-semibold">Features</th>
                    <th className="text-center p-6 text-white font-semibold">Bot Starter</th>
                    <th className="text-center p-6 text-white font-semibold">Bot Professional</th>
                    <th className="text-center p-6 text-white font-semibold">Bot Enterprise</th>
                    <th className="text-center p-6 text-white font-semibold">Custom Bot</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Voice Bot Instances', starter: '1', professional: '3', enterprise: 'Unlimited', custom: 'Custom' },
                    { feature: 'Monthly Interactions', starter: '1,000', professional: '5,000', enterprise: 'Unlimited', custom: 'Unlimited' },
                    { feature: 'Voice Personalities', starter: '2', professional: '5+', enterprise: 'Custom', custom: 'Full Custom' },
                    { feature: 'Multi-language Support', starter: false, professional: '10 Languages', enterprise: '30+ Languages', custom: 'All Languages' },
                    { feature: 'Knowledge Base', starter: '500 Articles', professional: 'Unlimited', enterprise: 'Custom', custom: 'Custom' },
                    { feature: 'Custom Voice Training', starter: false, professional: false, enterprise: true, custom: true },
                    { feature: 'White-label Options', starter: false, professional: false, enterprise: true, custom: true },
                    { feature: 'Advanced Analytics', starter: 'Basic', professional: 'Advanced', enterprise: 'Real-time', custom: 'Custom' },
                    { feature: 'Enterprise Integrations', starter: false, professional: 'Standard', enterprise: 'Advanced', custom: 'Custom' },
                    { feature: 'Support Level', starter: 'Email', professional: 'Priority Email', enterprise: 'Phone + Dedicated', custom: '24/7 Dedicated' }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/30 last:border-b-0">
                      <td className="p-6 text-white font-medium">{row.feature}</td>
                      <td className="p-6 text-center text-gray-300">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          row.starter
                        )}
                      </td>
                      <td className="p-6 text-center text-gray-300">
                        {typeof row.professional === 'boolean' ? (
                          row.professional ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          row.professional
                        )}
                      </td>
                      <td className="p-6 text-center text-gray-300">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          row.enterprise
                        )}
                      </td>
                      <td className="p-6 text-center text-gray-300">
                        {typeof row.custom === 'boolean' ? (
                          row.custom ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
                        ) : (
                          row.custom
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>

        {/* ROI Calculator */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Voice Bot ROI Calculator</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how much you can save with Voice Bot automation compared to traditional customer support staffing.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold mb-6 text-white">Traditional Support Team</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">2 Support Representatives</span>
                    <span className="text-white font-semibold">$80,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Benefits &amp; Overhead</span>
                    <span className="text-white font-semibold">$32,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Support Tools &amp; Software</span>
                    <span className="text-white font-semibold">$8,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Training &amp; Management</span>
                    <span className="text-white font-semibold">$10,000/year</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total Annual Cost</span>
                      <span className="text-red-400">$130,000</span>
                    </div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <p className="text-red-400 text-sm">Limited to business hours, handling capacity, and human availability constraints</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-8 border border-emerald-500/20">
                <h3 className="text-2xl font-bold mb-6 text-white">Voice Bot Professional</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Professional Plan (3 Bots)</span>
                    <span className="text-white font-semibold">$5,964/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Setup &amp; Configuration</span>
                    <span className="text-white font-semibold">$1,500/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">No Additional Overhead</span>
                    <span className="text-green-400 font-semibold">$0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">24/7 Operation</span>
                    <span className="text-green-400 font-semibold">Included</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total Annual Cost</span>
                      <span className="text-green-400">$7,464</span>
                    </div>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="text-green-400 font-bold text-2xl mb-2">$122,536 Annual Savings</div>
                    <p className="text-green-400 text-sm">1,642% ROI with 24/7 availability and unlimited interaction capacity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Voice Bot Pricing FAQ</h2>
              <p className="text-lg text-gray-300">
                Get answers to common questions about Voice Bot pricing and interaction plans.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: 'What counts as an interaction in my monthly limit?',
                  answer: 'An interaction is any voice conversation or exchange between a user and your Voice Bot, regardless of duration or complexity. This includes phone calls, voice chat sessions, and voice-activated support requests.'
                },
                {
                  question: 'Can I deploy Voice Bot across multiple channels?',
                  answer: 'Yes, Voice Bot can be deployed across phone systems, mobile apps, websites, smart speakers, and other voice-enabled platforms. Professional and Enterprise plans include multi-channel deployment capabilities.'
                },
                {
                  question: 'How does Voice Bot handle different languages and accents?',
                  answer: 'Voice Bot includes advanced speech recognition that supports multiple languages and accents. Professional plans support 10 languages, Enterprise plans support 30+ languages, and Custom plans can be tailored for specific regional requirements.'
                },
                {
                  question: 'What happens if I exceed my monthly interaction limit?',
                  answer: 'We&apos;ll notify you as you approach your limit. You can upgrade your plan or purchase additional interaction credits. Your Voice Bot will continue operating, but additional interactions will be charged at standard overage rates.'
                },
                {
                  question: 'Can Voice Bot integrate with my existing systems?',
                  answer: 'Yes, Voice Bot integrates with most phone systems, CRM platforms, help desk software, and knowledge bases. Our team provides integration support to ensure seamless connectivity with your current infrastructure.'
                },
                {
                  question: 'How accurate is Voice Bot in understanding customer requests?',
                  answer: 'Voice Bot achieves 94% intent recognition accuracy and 97% speech recognition accuracy. The system continuously learns from interactions to improve understanding and response quality over time.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20 bg-gradient-to-r from-emerald-900/20 via-black to-teal-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Deploy Intelligent Voice Automation?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your customer interactions with Voice Bot technology that understands, responds, 
              and resolves inquiries naturally. Start your free trial and experience the future of voice automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                data-track="voice_bot_pricing_try_voice_demo"
              >
                Try Voice Demo
              </a>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
