'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Star, Zap, Crown, Building } from 'lucide-react';

export default function SalesTunePricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/sales-tune';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const plans = [
    {
      name: 'Tune Starter',
      description: 'Perfect for small sales teams starting with voice coaching',
      price: 297,
      period: 'month',
      icon: Zap,
      gradient: 'from-blue-500 to-blue-500',
      features: [
        'Up to 5 sales reps',
        '500 coached calls/month',
        'Real-time coaching prompts',
        'Basic performance analytics',
        'Call recording &amp; transcription',
        'Standard coaching library',
        'Email support',
        '14-day free trial'
      ],
      limitations: [
        'No custom coaching models',
        'No advanced integrations',
        'No team benchmarking',
        'No priority support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Tune Professional',
      description: 'Ideal for growing sales teams with advanced coaching needs',
      price: 697,
      period: 'month',
      icon: Star,
      gradient: 'from-blue-500 to-blue-500',
      features: [
        'Up to 25 sales reps',
        '2,500 coached calls/month',
        'Advanced real-time coaching',
        'Comprehensive analytics dashboard',
        'Custom coaching frameworks',
        'CRM integrations',
        'Team performance benchmarking',
        'Sentiment analysis',
        'Objection handling library',
        'Priority email support',
        '30-day free trial'
      ],
      limitations: [
        'No unlimited users',
        'No white-label options',
        'No dedicated account manager'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Tune Enterprise',
      description: 'For large sales organizations requiring maximum coaching capacity',
      price: 1497,
      period: 'month',
      icon: Crown,
      gradient: 'from-blue-500 to-blue-500',
      features: [
        'Unlimited sales reps',
        'Unlimited coached calls',
        'AI-powered custom coaching',
        'Real-time manager alerts',
        'Advanced predictive analytics',
        'Custom integration development',
        'White-label options',
        'Multi-language support',
        'Industry-specific coaching models',
        'Dedicated account manager',
        'Priority phone support',
        '60-day free trial'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    },
    {
      name: 'Custom Tune',
      description: 'Tailored voice coaching solutions for enterprise requirements',
      price: null,
      period: 'custom',
      icon: Building,
      gradient: 'from-gray-500 to-gray-700',
      features: [
        'Custom coaching AI development',
        'Dedicated infrastructure',
        'Industry-specific models',
        'Advanced compliance features',
        'Custom analytics dashboards',
        'On-premise deployment',
        'Custom SLA agreements',
        'Unlimited everything',
        '24/7 dedicated support',
        'Custom training programs'
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
              Sales Tune Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Transform your sales team performance with AI-powered real-time coaching and analytics. 
              Choose the perfect plan for your team size and coaching requirements.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-blue-400 mr-2" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-blue-400 mr-2" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-blue-400 mr-2" />
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
                                         plan.popular ? 'border-blue-500/50 shadow-lg shadow-blue-500/20' : 'border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                             <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
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
                                                     ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
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
                          <Check className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
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
                              <X className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
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
                Compare all voice coaching features across our plans to find the perfect solution for your sales team needs.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-800/30 rounded-xl border border-gray-700/50">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left p-6 text-white font-semibold">Features</th>
                    <th className="text-center p-6 text-white font-semibold">Tune Starter</th>
                    <th className="text-center p-6 text-white font-semibold">Tune Professional</th>
                    <th className="text-center p-6 text-white font-semibold">Tune Enterprise</th>
                    <th className="text-center p-6 text-white font-semibold">Custom Tune</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Sales Reps Included', starter: '5', professional: '25', enterprise: 'Unlimited', custom: 'Custom' },
                    { feature: 'Monthly Coached Calls', starter: '500', professional: '2,500', enterprise: 'Unlimited', custom: 'Unlimited' },
                    { feature: 'Real-time Coaching', starter: true, professional: true, enterprise: 'Advanced', custom: 'AI-Powered' },
                    { feature: 'Custom Coaching Models', starter: false, professional: true, enterprise: true, custom: true },
                    { feature: 'Team Benchmarking', starter: false, professional: true, enterprise: true, custom: true },
                    { feature: 'CRM Integrations', starter: false, professional: 'Standard', enterprise: 'Advanced', custom: 'Custom' },
                    { feature: 'Multi-language Support', starter: false, professional: false, enterprise: true, custom: true },
                    { feature: 'White-label Options', starter: false, professional: false, enterprise: true, custom: true },
                    { feature: 'Predictive Analytics', starter: false, professional: false, enterprise: true, custom: true },
                    { feature: 'Support Level', starter: 'Email', professional: 'Priority Email', enterprise: 'Phone + Dedicated', custom: '24/7 Dedicated' }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-gray-700/30 last:border-b-0">
                      <td className="p-6 text-white font-medium">{row.feature}</td>
                      <td className="p-6 text-center text-gray-300">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? <Check className="w-5 h-5 text-blue-400 mx-auto" /> : <X className="w-5 h-5 text-blue-400 mx-auto" />
                        ) : (
                          row.starter
                        )}
                      </td>
                      <td className="p-6 text-center text-gray-300">
                        {typeof row.professional === 'boolean' ? (
                          row.professional ? <Check className="w-5 h-5 text-blue-400 mx-auto" /> : <X className="w-5 h-5 text-blue-400 mx-auto" />
                        ) : (
                          row.professional
                        )}
                      </td>
                      <td className="p-6 text-center text-gray-300">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? <Check className="w-5 h-5 text-blue-400 mx-auto" /> : <X className="w-5 h-5 text-blue-400 mx-auto" />
                        ) : (
                          row.enterprise
                        )}
                      </td>
                      <td className="p-6 text-center text-gray-300">
                        {typeof row.custom === 'boolean' ? (
                          row.custom ? <Check className="w-5 h-5 text-blue-400 mx-auto" /> : <X className="w-5 h-5 text-blue-400 mx-auto" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Sales Tune ROI Calculator</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how much revenue Sales Tune can generate through improved sales performance and conversion rates.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
                <h3 className="text-2xl font-bold mb-6 text-white">Without Sales Tune</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">10 Sales Reps</span>
                    <span className="text-white font-semibold">$800K ARR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Conversion Rate</span>
                    <span className="text-white font-semibold">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Monthly Sales Calls</span>
                    <span className="text-white font-semibold">2,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Training &amp; Coaching Costs</span>
                    <span className="text-white font-semibold">$60,000/year</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total Annual Revenue</span>
                      <span className="text-gray-400">$800,000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold mb-6 text-white">With Sales Tune Professional</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">10 Sales Reps (Same Team)</span>
                    <span className="text-white font-semibold">$1.07M ARR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Improved Conversion Rate</span>
                    <span className="text-blue-400 font-semibold">24% (+34%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Same Monthly Calls</span>
                    <span className="text-white font-semibold">2,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sales Tune Professional</span>
                    <span className="text-white font-semibold">$8,364/year</span>
                  </div>
                  <div className="border-t border-gray-600 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span className="text-white">Total Annual Revenue</span>
                      <span className="text-blue-400">$1,072,000</span>
                    </div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="text-blue-400 font-bold text-2xl mb-2">$272,000 Additional Revenue</div>
                    <p className="text-blue-400 text-sm">3,252% ROI with same team performing 34% better</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Sales Tune Pricing FAQ</h2>
              <p className="text-lg text-gray-300">
                Get answers to common questions about Sales Tune pricing and coaching plans.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: 'What counts as a coached call in my monthly limit?',
                  answer: 'A coached call is any sales conversation where Sales Tune provides real-time coaching prompts and analytics. This includes outbound prospecting calls, inbound sales calls, and follow-up conversations with prospects.'
                },
                {
                  question: 'Can I upgrade or downgrade my plan during the billing cycle?',
                  answer: 'Yes, you can upgrade your plan at any time to access additional features and coaching capacity. Downgrades take effect at the next billing cycle to ensure uninterrupted service for your team.'
                },
                {
                  question: 'How does Sales Tune integrate with our existing phone system?',
                  answer: 'Sales Tune integrates with major phone systems including Salesforce Voice, RingCentral, Zoom Phone, and Microsoft Teams. Our team provides technical support during setup to ensure seamless integration.'
                },
                {
                  question: 'What happens if we exceed our monthly coached call limit?',
                  answer: 'We&apos;ll notify you as you approach your limit. You can upgrade your plan or purchase additional coaching credits. Your service continues uninterrupted, with additional calls charged at standard overage rates.'
                },
                {
                  question: 'Can we customize the coaching prompts for our sales methodology?',
                  answer: 'Professional and Enterprise plans include custom coaching framework development. Our team works with you to create coaching models that align with your sales process, messaging, and best practices.'
                },
                {
                  question: 'How quickly will we see improvements in sales performance?',
                  answer: 'Most teams see initial improvements within 2-3 weeks of implementation. Significant performance gains typically occur within 60-90 days as reps adapt to real-time coaching and implement suggested improvements.'
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
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Sales Performance?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Start improving your sales team&apos;s performance today with AI-powered real-time coaching and analytics. 
              Experience measurable improvements in conversion rates and revenue generation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                data-track="sales_tune_pricing_schedule_coaching_demo"
              >
                Schedule Coaching Demo
              </a>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
