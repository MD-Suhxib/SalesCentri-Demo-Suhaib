'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Star, Zap, Crown, Building } from 'lucide-react';

export default function VoiceAIAgentPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-ai-agent';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const plans = [
    {
      name: 'Voice Starter',
      description: 'Perfect for small businesses starting with voice AI calls',
      price: 497,
      period: 'month',
      icon: Zap,
      gradient: 'from-blue-500 to-purple-500',
      features: [
        '1 VoiceAI Agent',
        'Up to 500 voice calls/month',
        'Basic voice personalities (3)',
        'Inbound call handling',
        'Standard voice quality',
        'Email integration',
        'Basic call analytics',
        'Email support',
        '14-day free trial'
      ],
      limitations: [
        'No outbound calling',
        'No custom voice training',
        'No advanced analytics',
        'No priority support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Voice Professional',
      description: 'Ideal for growing businesses with higher call volumes',
      price: 997,
      period: 'month',
      icon: Star,
      gradient: 'from-purple-500 to-pink-500',
      features: [
        '3 VoiceAI Agents',
        'Up to 2,000 voice calls/month',
        'Advanced voice personalities (10+)',
        'Inbound &amp; outbound calling',
        'Premium voice quality',
        'Multi-language support (5 languages)',
        'Advanced call analytics',
        'CRM integrations',
        'Call recording &amp; transcription',
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
      name: 'Voice Enterprise',
      description: 'For large organizations requiring maximum call capacity',
      price: 1997,
      period: 'month',
      icon: Crown,
      gradient: 'from-pink-500 to-red-500',
      features: [
        'Unlimited VoiceAI Agents',
        'Unlimited voice calls',
        'Custom voice personalities',
        'Advanced outbound campaigns',
        'Ultra-premium voice quality',
        'Multi-language support (25+ languages)',
        'Real-time call intelligence',
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
      name: 'Custom Voice',
      description: 'Tailored voice AI solutions for enterprise requirements',
      price: null,
      period: 'custom',
      icon: Building,
      gradient: 'from-gray-500 to-gray-700',
      features: [
        'Custom voice agent development',
        'Dedicated voice infrastructure',
        'Custom voice synthesis',
        'Full API access',
        'On-premise deployment',
        'Custom SLA agreements',
        'Unlimited everything',
        '24/7 dedicated support',
        'Custom training &amp; onboarding',
        'Industry-specific compliance'
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-white to-pink-400 bg-clip-text text-transparent">
              VoiceAI Agent Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform your phone sales with human-like voice AI that handles calls 24/7. Choose the perfect plan 
              for your call volume and business needs, from small teams to enterprise operations.
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
                    plan.popular ? 'border-purple-500/50 shadow-lg shadow-purple-500/20' : 'border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
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
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
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
                Compare all voice AI features across our VoiceAI Agent plans to find the perfect fit for your calling needs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800/30 rounded-xl border border-gray-700/50">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-6 text-white font-semibold">Features</th>
                    <th className="text-center p-6 text-white font-semibold">Voice Starter</th>
                    <th className="text-center p-6 text-white font-semibold">Voice Professional</th>
                    <th className="text-center p-6 text-white font-semibold">Voice Enterprise</th>
                    <th className="text-center p-6 text-white font-semibold">Custom Voice</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'VoiceAI Agents', starter: '1', professional: '3', enterprise: 'Unlimited', custom: 'Custom' },
                    { feature: 'Monthly Voice Calls', starter: '500', professional: '2,000', enterprise: 'Unlimited', custom: 'Unlimited' },
                    { feature: 'Voice Personalities', starter: '3', professional: '10+', enterprise: 'Custom', custom: 'Full Custom' },
                    { feature: 'Outbound Calling', starter: false, professional: true, enterprise: true, custom: true },
                    { feature: 'Voice Quality', starter: 'Standard', professional: 'Premium', enterprise: 'Ultra-Premium', custom: 'Custom' },
                    { feature: 'Language Support', starter: 'English', professional: '5 Languages', enterprise: '25+ Languages', custom: 'All Languages' },
                    { feature: 'Call Recording', starter: false, professional: true, enterprise: true, custom: true },
                    { feature: 'Custom Voice Training', starter: false, professional: false, enterprise: true, custom: true },
                    { feature: 'White-label Options', starter: false, professional: false, enterprise: true, custom: true },
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Voice AI ROI Calculator</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how much you can save with VoiceAI Agent compared to hiring traditional phone sales representatives.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold mb-6 text-white">Traditional Phone Sales Team</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">3 Phone Sales Reps</span>
                    <span className="text-white font-semibold">$180,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Benefits &amp; Overhead</span>
                    <span className="text-white font-semibold">$72,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Phone System &amp; Tools</span>
                    <span className="text-white font-semibold">$12,000/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Training &amp; Management</span>
                    <span className="text-white font-semibold">$15,000/year</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total Annual Cost</span>
                      <span className="text-red-400">$279,000</span>
                    </div>
                  </div>
                  <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                    <p className="text-red-400 text-sm">Limited to business hours, calls per day, and human performance variations</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-500/20">
                <h3 className="text-2xl font-bold mb-6 text-white">VoiceAI Agent Professional</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Professional Plan (3 Agents)</span>
                    <span className="text-white font-semibold">$11,964/year</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Setup &amp; Integration</span>
                    <span className="text-white font-semibold">$2,000/year</span>
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
                      <span className="text-green-400">$13,964</span>
                    </div>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="text-green-400 font-bold text-2xl mb-2">$265,036 Annual Savings</div>
                    <p className="text-green-400 text-sm">1,899% ROI with 24/7 availability and unlimited call capacity</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Voice AI Pricing FAQ</h2>
              <p className="text-lg text-gray-300">
                Get answers to common questions about VoiceAI Agent pricing and voice call plans.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: 'What counts as a voice call in my monthly limit?',
                  answer: 'A voice call is any phone conversation initiated or received by your VoiceAI Agent, regardless of duration or outcome. Calls are counted when the connection is established, whether the call results in a conversation, voicemail, or busy signal.'
                },
                {
                  question: 'Can I use custom voices or accents?',
                  answer: 'Voice personalities and accents are available based on your plan level. Starter plans include 3 basic voices, Professional plans offer 10+ voices in multiple languages, while Enterprise plans include custom voice training to match your brand requirements.'
                },
                {
                  question: 'What happens if I exceed my monthly call limit?',
                  answer: 'We&apos;ll notify you as you approach your limit. You can upgrade your plan or purchase additional call credits. Your VoiceAI Agents will continue operating, but additional calls will be charged at standard overage rates based on your plan level.'
                },
                {
                  question: 'Do you support international calling?',
                  answer: 'Yes, VoiceAI Agent supports international calling with rates varying by destination. Professional and Enterprise plans include international calling capabilities with competitive per-minute rates for global outreach campaigns.'
                },
                {
                  question: 'How does call quality compare to human agents?',
                  answer: 'Our voice technology achieves 99.8% natural voice quality ratings and response times under 200ms. Most prospects cannot distinguish between our AI agents and human representatives during phone conversations.'
                },
                {
                  question: 'Can I integrate with my existing phone system?',
                  answer: 'VoiceAI Agent integrates with most modern phone systems including VoIP platforms, traditional PBX systems, and cloud-based solutions. Our team provides integration support to ensure seamless connectivity with your current setup.'
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
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-pink-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Phone Sales?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of businesses using VoiceAI Agent to scale their phone operations. 
              Start your free trial today and hear the difference human-like voice AI makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/solutions/psa-suite-one-stop-solution"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Try SalesGPT
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
