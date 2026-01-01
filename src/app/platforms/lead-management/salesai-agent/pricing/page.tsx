'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Star, Zap, Crown, Building } from 'lucide-react';

export default function SalesAIAgentPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/salesai-agent';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started with AI sales',
      price: 297,
      period: 'month',
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-500',
      features: [
        '1 AI Sales Agent',
        'Up to 1,000 conversations/month',
        'Basic lead qualification',
        'Email integration',
        'Chat widget integration',
        'CRM sync (3 platforms)',
        'Standard response templates',
        'Email support',
        '14-day free trial'
      ],
      limitations: [
        'No voice calling',
        'No custom AI training',
        'No advanced analytics',
        'No priority support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses with higher lead volumes',
      price: 697,
      period: 'month',
      icon: Star,
      gradient: 'from-cyan-500 to-blue-500',
      features: [
        '3 AI Sales Agents',
        'Up to 5,000 conversations/month',
        'Advanced lead qualification',
        'Multi-channel communication',
        'Voice calling capabilities',
        'SMS integration',
        'CRM sync (unlimited)',
        'Custom qualification criteria',
        'Advanced analytics dashboard',
        'Priority email support',
        '30-day free trial'
      ],
      limitations: [
        'No white-label options',
        'No custom AI model training',
        'No dedicated account manager'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      description: 'For large organizations requiring maximum scalability',
      price: 1497,
      period: 'month',
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      features: [
        'Unlimited AI Sales Agents',
        'Unlimited conversations',
        'Custom AI model training',
        'All communication channels',
        'Advanced voice AI capabilities',
        'White-label options',
        'Custom integrations',
        'Advanced security &amp; compliance',
        'Real-time analytics',
        'Dedicated account manager',
        'Priority phone support',
        '60-day free trial'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    },
    {
      name: 'Custom',
      description: 'Tailored solutions for enterprise-specific requirements',
      price: null,
      period: 'custom',
      icon: Building,
      gradient: 'from-gray-500 to-gray-700',
      features: [
        'Custom AI agent deployment',
        'Dedicated infrastructure',
        'Custom feature development',
        'Full API access',
        'On-premise deployment options',
        'Custom SLA agreements',
        'Unlimited everything',
        '24/7 dedicated support',
        'Custom training &amp; onboarding',
        'Compliance certifications'
      ],
      limitations: [],
      cta: 'Contact Sales',
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent">
              SalesAI Agent Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Choose the perfect plan for your business size and needs. Scale your sales operations with AI agents 
              that work 24/7 to qualify leads, book meetings, and drive conversions.
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
                    plan.popular ? 'border-cyan-500/50 shadow-lg shadow-cyan-500/20' : 'border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
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
                      href={plan.cta === 'Contact Sales' ? '/contact' : '/get-started/free-trial'}
                      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center group ${
                        plan.popular
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'
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
                Compare all features across our SalesAI Agent plans to find the perfect fit for your business needs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800/30 rounded-xl border border-gray-700/50">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-6 text-white font-semibold">Features</th>
                    <th className="text-center p-6 text-white font-semibold">Starter</th>
                    <th className="text-center p-6 text-white font-semibold">Professional</th>
                    <th className="text-center p-6 text-white font-semibold">Enterprise</th>
                    <th className="text-center p-6 text-white font-semibold">Custom</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'AI Sales Agents', starter: '1', professional: '3', enterprise: 'Unlimited', custom: 'Custom' },
                    { feature: 'Monthly Conversations', starter: '1,000', professional: '5,000', enterprise: 'Unlimited', custom: 'Unlimited' },
                    { feature: 'Lead Qualification', starter: 'Basic', professional: 'Advanced', enterprise: 'Advanced + Custom', custom: 'Full Custom' },
                    { feature: 'Communication Channels', starter: 'Email + Chat', professional: 'Multi-channel', enterprise: 'All Channels', custom: 'All + Custom' },
                    { feature: 'Voice Calling', starter: false, professional: true, enterprise: true, custom: true },
                    { feature: 'CRM Integrations', starter: '3 Platforms', professional: 'Unlimited', enterprise: 'Unlimited + Custom', custom: 'Full Custom' },
                    { feature: 'Custom AI Training', starter: false, professional: false, enterprise: true, custom: true },
                    { feature: 'White-label Options', starter: false, professional: false, enterprise: true, custom: true },
                    { feature: 'Analytics &amp; Reporting', starter: 'Basic', professional: 'Advanced', enterprise: 'Real-time + Custom', custom: 'Full Custom' },
                    { feature: 'Support Level', starter: 'Email', professional: 'Priority Email', enterprise: 'Phone + Dedicated', custom: '24/7 Dedicated' }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/30 last:border-b-0">
                      <td className="p-6 text-white font-medium" dangerouslySetInnerHTML={{ __html: row.feature }}></td>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Calculate Your ROI</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how much you can save and earn with SalesAI Agent compared to hiring additional sales staff.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold mb-6 text-white">Traditional Sales Team</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">2 Additional Sales Reps</span>
                    <span className="text-white font-semibold">$120,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Benefits &amp; Overhead</span>
                    <span className="text-white font-semibold">$48,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Training &amp; Onboarding</span>
                    <span className="text-white font-semibold">$10,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Tools &amp; Software</span>
                    <span className="text-white font-semibold">$6,000/year</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total Annual Cost</span>
                      <span className="text-red-400">$184,000</span>
                    </div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <p className="text-red-400 text-sm">Limited to business hours, vacation time, and human capacity constraints</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-8 border border-cyan-500/20">
                <h3 className="text-2xl font-bold mb-6 text-white">SalesAI Agent Professional</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Professional Plan (3 AI Agents)</span>
                    <span className="text-white font-semibold">$8,364/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Setup &amp; Training</span>
                    <span className="text-white font-semibold">$1,000/year</span>
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
                      <span className="text-green-400">$9,364</span>
                    </div>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="text-green-400 font-bold text-2xl mb-2">$174,636 Annual Savings</div>
                    <p className="text-green-400 text-sm">1,851% ROI with 24/7 availability and unlimited conversation capacity</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Pricing FAQ</h2>
              <p className="text-lg text-gray-300">
                Get answers to common questions about SalesAI Agent pricing and plans.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: 'What counts as a conversation in my monthly limit?',
                  answer: 'A conversation is defined as any interaction between your AI agent and a prospect, regardless of length or number of messages exchanged. Once a conversation is initiated, it counts toward your monthly limit until it&apos;s marked as complete or inactive for 30 days.'
                },
                {
                  question: 'Can I upgrade or downgrade my plan at any time?',
                  answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the start of your next billing cycle. Any unused conversations from higher-tier plans don&apos;t roll over to lower-tier plans.'
                },
                {
                  question: 'What happens if I exceed my conversation limit?',
                  answer: 'If you approach your monthly conversation limit, we&apos;ll notify you in advance. You can either upgrade your plan or purchase additional conversation packs. Your AI agents will continue operating, but additional conversations will be charged at standard overage rates.'
                },
                {
                  question: 'Do you offer discounts for annual plans?',
                  answer: 'Yes, we offer significant discounts for annual subscriptions. Contact our sales team for custom pricing on annual plans, multi-year agreements, and volume discounts for multiple AI agents.'
                },
                {
                  question: 'What&apos;s included in the free trial?',
                  answer: 'Free trials include full access to all features in your chosen plan, including AI agent setup, integrations, and support. No credit card required to start, and you can cancel anytime during the trial period with no obligations.'
                },
                {
                  question: 'How does billing work for the Enterprise plan?',
                  answer: 'Enterprise plans are billed based on your specific requirements and usage patterns. We offer flexible billing options including monthly, quarterly, or annual payments. Custom pricing is available based on conversation volume, feature requirements, and support needs.'
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
          className="py-20 bg-gradient-to-r from-cyan-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Sales Process?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of businesses using SalesAI Agent to scale their sales operations. 
              Start your free trial today and see the difference AI can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
