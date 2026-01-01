'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight, Star, Zap, Crown, Building} from 'lucide-react';

export default function ChatBotPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/chat-bot';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const plans = [
    {
      name: 'Chat Starter',
      description: 'Perfect for small websites starting with chat automation',
      price: 49,
      period: 'month',
      icon: Zap,
      gradient: 'from-blue-500 to-blue-500',
      features: [
        'Up to 1,000 chat conversations/month',
        'Basic AI chat bot functionality',
        '2 custom conversation flows',
        'Email integration',
        'Basic analytics dashboard',
        'Standard support',
        '14-day free trial'
      ],
      limitations: [
        'No CRM integrations',
        'No advanced AI features',
        'No custom branding',
        'No priority support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Chat Professional',
      description: 'Ideal for growing businesses with higher chat volumes',
      price: 149,
      period: 'month',
      icon: Star,
      gradient: 'from-blue-500 to-blue-500',
      features: [
        'Up to 5,000 chat conversations/month',
        'Advanced AI conversation engine',
        'Unlimited conversation flows',
        'CRM integrations (Salesforce, HubSpot)',
        'Lead qualification &amp; scoring',
        'Meeting scheduling automation',
        'Advanced analytics &amp; reporting',
        'Custom branding &amp; styling',
        'Priority email support',
        '30-day free trial'
      ],
      limitations: [
        'No white-label options',
        'No API access',
        'No dedicated account manager'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Chat Enterprise',
      description: 'For large organizations requiring maximum chat capacity',
      price: 'Custom',
      period: '',
      icon: Crown,
      gradient: 'from-indigo-500 to-blue-500',
      features: [
        'Unlimited chat conversations',
        'Enterprise AI features',
        'Custom AI training &amp; models',
        'Full CRM &amp; platform integrations',
        'Advanced lead qualification',
        'White-label &amp; custom branding',
        'Real-time monitoring &amp; alerts',
        'API access &amp; webhooks',
        'Multi-language support',
        'Dedicated account manager',
        'Priority phone support',
        '60-day free trial'
      ],
      limitations: [],
      cta: 'Try SalesGPT',
      popular: false
    },
    {
      name: 'Custom Chat',
      description: 'Tailored chat solutions for specific enterprise needs',
      price: null,
      period: 'custom',
      icon: Building,
      gradient: 'from-gray-500 to-gray-700',
      features: [
        'Custom chat bot development',
        'Dedicated infrastructure',
        'Industry-specific AI models',
        'Custom integration development',
        'On-premise deployment options',
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
              Chat Bot Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
              Deploy intelligent chat automation that engages visitors and converts leads. 
              Choose the perfect plan for your website traffic and engagement needs.
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
                      href={plan.cta === 'Try SalesGPT' ? '/solutions/psa-suite-one-stop-solution' : '/get-started/free-trial'}
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

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Deploy Chat Bot Automation?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your website engagement with AI-powered chat automation that converts visitors into customers 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
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
