'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bot, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Star, Clock, Users, Target} from 'lucide-react';

export default function DialerAIPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/dialer-ai';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: 'per agent/month',
      description: 'Perfect for small teams getting started with AI dialing',
      popular: false,
      features: [
        'Basic predictive dialing',
        'Local presence caller ID',
        'Basic call analytics',
        'CRM integration (3 platforms)',
        'Call recording (15 days)',
        'Email support',
        'Up to 10 agents',
        'Standard compliance tools'
      ],
      cta: 'Start Free Trial',
      highlight: false
    },
    {
      name: 'Professional',
      price: '$149',
      period: 'per agent/month',
      description: 'Perfect for growing sales teams ready to optimize their calling operations',
      popular: true,
      features: [
        'Predictive dialing algorithms',
        'Local presence caller ID',
        'Basic call analytics',
        'CRM integration (5 platforms)',
        'Call recording (30 days)',
        'Email support',
        'Up to 50 agents',
        'Standard compliance tools'
      ],
      cta: 'Start Free Trial',
      highlight: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Advanced features for high-volume calling operations and complex workflows',
      popular: false,
      features: [
        'Everything in Professional',
        'Advanced AI optimization',
        'Real-time coaching tools',
        'Custom integrations',
        'Advanced analytics &amp; reporting',
        'Call recording (unlimited)',
        'Priority support + CSM',
        'Unlimited agents',
        'Advanced compliance suite',
        'Custom caller ID pools',
        'API access',
        'White-label options'
      ],
      cta: 'Contact Sales',
      highlight: true
    },
    {
      name: 'Custom',
      price: 'Custom',
      period: 'pricing',
      description: 'Tailored solutions for enterprise organizations with specific requirements',
      popular: false,
      features: [
        'Everything in Enterprise',
        'Custom AI model training',
        'Dedicated infrastructure',
        'Advanced security features',
        'Custom compliance modules',
        'Dedicated support team',
        'On-premise deployment',
        'Custom SLA agreements',
        'Advanced integration support',
        'Custom feature development'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  const addOns = [
    {
      name: 'Advanced Analytics Suite',
      price: '$50',
      period: 'per agent/month',
      description: 'Enhanced reporting, conversation analytics, and predictive insights',
      icon: BarChart3
    },
    {
      name: 'Compliance Plus',
      price: '$30',
      period: 'per agent/month',
      description: 'Advanced compliance features for highly regulated industries',
      icon: Shield
    },
    {
      name: 'AI Optimization Pro',
      price: '$75',
      period: 'per agent/month',
      description: 'Premium AI features including custom model training and optimization',
      icon: Bot
    },
    {
      name: 'Premium Support',
      price: '$100',
      period: 'per month',
      description: '24/7 priority support with dedicated customer success manager',
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
              DialerAI Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the perfect plan to optimize your calling operations. All plans include our core dialing technology and 24/7 uptime guarantee.
            </p>

            {/* ROI Calculator Teaser */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-blue-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Calculate Your ROI</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Most customers see 300% increase in talk time and 65% higher answer rates. Calculate your potential savings:
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">$2,400</div>
                  <div className="text-gray-400">Monthly savings per agent</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">45%</div>
                  <div className="text-gray-400">Reduction in cost per lead</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">6x</div>
                  <div className="text-gray-400">Faster ROI realization</div>
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
                Enhance your DialerAI experience with premium add-ons designed for specific business needs.
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

        {/* Implementation & Support */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Implementation &amp; Support</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Get up and running quickly with our comprehensive onboarding and ongoing support services.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quick Setup',
                  description: 'Get started in under 48 hours with our guided setup process and data migration assistance.',
                  icon: Zap,
                  features: ['Data migration', 'Integration setup', 'Agent training', 'Go-live support']
                },
                {
                  title: 'Ongoing Training',
                  description: 'Comprehensive training programs to ensure your team maximizes DialerAI capabilities.',
                  icon: Users,
                  features: ['Admin training', 'Agent workshops', 'Best practices', 'Regular check-ins']
                },
                {
                  title: '24/7 Support',
                  description: 'Round-the-clock technical support with guaranteed response times and escalation procedures.',
                  icon: Clock,
                  features: ['Technical support', 'Account management', 'Performance optimization', 'Troubleshooting']
                }
              ].map((service, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                  <p className="text-gray-300 mb-6">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
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

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: 'What&apos;s included in the free trial?',
                  answer: 'The 14-day free trial includes full access to all Professional plan features, up to 10 agents, and complete setup assistance from our team.'
                },
                {
                  question: 'How does billing work for seasonal businesses?',
                  answer: 'We offer flexible billing options including seasonal pricing and agent scaling. Contact our sales team to discuss custom arrangements for your business cycle.'
                },
                {
                  question: 'Can I upgrade or downgrade my plan?',
                  answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle.'
                },
                {
                  question: 'What compliance certifications do you have?',
                  answer: 'DialerAI is SOC 2 certified, GDPR compliant, and includes built-in TCPA compliance features. We also support HIPAA requirements for healthcare clients.'
                },
                {
                  question: 'Do you offer on-premise deployment?',
                  answer: 'Yes, on-premise deployment is available with our Custom plan. This includes dedicated hardware, installation, and ongoing maintenance support.'
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
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-purple-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Optimize Your Calling Operations?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of sales teams who&apos;ve increased their talk time by 300% with DialerAI. 
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
