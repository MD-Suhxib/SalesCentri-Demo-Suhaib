'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mic, MessageSquare, Zap, CheckCircle, ArrowRight, Star, Clock, Users, Target, TrendingUp, Brain, Speaker } from 'lucide-react';

export default function VoiceAIPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-ai';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$49',
      period: 'per month',
      description: 'Perfect for small teams testing conversational AI capabilities',
      popular: false,
      features: [
        'Up to 1,000 conversations/month',
        'Basic voice personalities (5 options)',
        'Standard response templates',
        'Email support',
        'Basic analytics dashboard',
        'Single language support',
        'API access (basic)',
        'Standard compliance features'
      ],
      cta: 'Start Free Trial',
      highlight: false
    },
    {
      name: 'Professional',
      price: '$149',
      period: 'per month',
      description: 'Advanced AI features for growing sales and support teams',
      popular: true,
      features: [
        'Up to 10,000 conversations/month',
        'Custom voice cloning (3 voices)',
        'Advanced conversation flows',
        'Priority support + training',
        'Advanced analytics &amp; insights',
        'Multi-language support (10 languages)',
        'CRM integrations',
        'Enhanced compliance suite',
        'Real-time sentiment analysis',
        'Custom personality traits',
        'A/B testing framework',
        'Performance optimization'
      ],
      cta: 'Start Free Trial',
      highlight: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'Unlimited conversations with enterprise-grade features and support',
      popular: false,
      features: [
        'Unlimited conversations',
        'Unlimited custom voice cloning',
        'Advanced AI model training',
        'Dedicated success manager',
        'Custom integrations',
        'All languages supported',
        'White-label options',
        'Advanced security features',
        'On-premise deployment',
        'SLA guarantees',
        'Custom compliance modules',
        'Priority feature development'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  const addOns = [
    {
      name: 'Additional Conversations',
      price: '$0.15',
      period: 'per conversation',
      description: 'Extra conversations beyond your plan&apos;s included limit',
      icon: MessageSquare
    },
    {
      name: 'Custom Voice Training',
      price: '$500',
      period: 'per voice',
      description: 'Professional voice cloning service with brand personality matching',
      icon: Mic
    },
    {
      name: 'Advanced Analytics Suite',
      price: '$99',
      period: 'per month',
      description: 'Enhanced conversation analytics, predictive insights, and custom reporting',
      icon: Target
    },
    {
      name: 'Premium Support',
      price: '$199',
      period: 'per month',
      description: '24/7 priority support with dedicated technical account manager',
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              VoiceAI Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your conversations with AI that speaks naturally. Choose the perfect plan to unlock human-like voice interactions for your business.
            </p>

            {/* ROI Calculator Teaser */}
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/20 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-purple-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Conversion Impact Calculator</h3>
              </div>
              <p className="text-gray-300 mb-6">
                VoiceAI typically increases conversion rates by 340% compared to traditional scripts. See your potential impact:
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-400 mb-2">340%</div>
                  <div className="text-gray-400">Conversion increase</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">85%</div>
                  <div className="text-gray-400">Customer satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400 mb-2">60%</div>
                  <div className="text-gray-400">Cost reduction</div>
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
                      ? 'bg-gradient-to-b from-purple-900/30 to-blue-900/30 border-purple-500/50' 
                      : 'bg-gray-800/50 border-gray-700/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
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
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/30'
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
                Enhance your VoiceAI experience with premium add-ons for specialized requirements and advanced features.
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
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <addon.icon className="w-6 h-6 text-purple-400" />
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

        {/* Voice Samples */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Voice Quality Samples</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Experience the natural, human-like quality of VoiceAI with our sample conversations and voice personalities.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Professional Sales',
                  description: 'Confident and persuasive voice perfect for B2B sales conversations and lead qualification.',
                  personality: ['Confident', 'Persuasive', 'Professional', 'Engaging'],
                  icon: Target
                },
                {
                  title: 'Friendly Support',
                  description: 'Warm and empathetic voice ideal for customer service and support interactions.',
                  personality: ['Warm', 'Empathetic', 'Patient', 'Helpful'],
                  icon: Users
                },
                {
                  title: 'Executive Assistant',
                  description: 'Sophisticated and efficient voice for appointment setting and administrative tasks.',
                  personality: ['Sophisticated', 'Efficient', 'Organized', 'Reliable'],
                  icon: Clock
                }
              ].map((sample, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                    <sample.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{sample.title}</h3>
                  <p className="text-gray-300 mb-6">{sample.description}</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {sample.personality.map((trait, traitIndex) => (
                      <div key={traitIndex} className="bg-purple-500/10 rounded-lg px-3 py-2 text-center">
                        <span className="text-purple-300 text-sm font-medium">{trait}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 text-purple-300 py-3 rounded-lg font-medium hover:bg-purple-500/30 transition-all duration-300 flex items-center justify-center group">
                    <Speaker className="w-5 h-5 mr-2" />
                    <span>Play Sample</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Implementation Process */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Implementation Process</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Get started with VoiceAI in just days, not months. Our streamlined setup process ensures rapid deployment and immediate results.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Consultation &amp; Setup',
                  description: 'Strategy session to understand your needs and configure VoiceAI for your specific use case.',
                  duration: '1-2 days',
                  icon: Users
                },
                {
                  step: '2',
                  title: 'Voice Training',
                  description: 'Custom voice creation and personality development to match your brand and communication style.',
                  duration: '3-5 days',
                  icon: Mic
                },
                {
                  step: '3',
                  title: 'Integration &amp; Testing',
                  description: 'Connect with your existing systems and conduct comprehensive testing with your team.',
                  duration: '2-3 days',
                  icon: Zap
                },
                {
                  step: '4',
                  title: 'Launch &amp; Optimization',
                  description: 'Go live with full support and continuous optimization based on performance data.',
                  duration: 'Ongoing',
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
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">Step {step.step}</div>
                  <h3 className="text-xl font-bold mb-3 text-white" dangerouslySetInnerHTML={{ __html: step.title }}></h3>
                  <p className="text-gray-300 mb-2">{step.description}</p>
                  <div className="text-sm text-purple-300 font-medium">{step.duration}</div>
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
                  question: 'How realistic are the AI-generated voices?',
                  answer: 'VoiceAI generates human-quality voices that are virtually indistinguishable from real human speech. Our neural voice synthesis technology creates natural intonation, emotion, and personality traits.'
                },
                {
                  question: 'Can I create a custom voice that sounds like a specific person?',
                  answer: 'Yes, with our voice cloning service, you can create custom voices that match specific speaking styles, accents, and personality traits. Professional voice training typically takes 3-5 business days.'
                },
                {
                  question: 'What languages does VoiceAI support?',
                  answer: 'VoiceAI supports 50+ languages with native-level fluency. Enterprise plans include access to all languages, while lower-tier plans include specific language packages.'
                },
                {
                  question: 'How does billing work for conversations?',
                  answer: 'Conversations are billed based on successful connections and meaningful exchanges. Short hang-ups, technical failures, and system tests don&apos;t count toward your monthly limits.'
                },
                {
                  question: 'What compliance and security measures are in place?',
                  answer: 'VoiceAI is SOC 2 Type II certified, GDPR compliant, and includes enterprise-grade security features. All conversations are encrypted, and we provide detailed audit trails for compliance reporting.'
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
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Conversations?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of businesses using VoiceAI to create natural, engaging conversations that convert 340% better than traditional methods. Start your free trial today.
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
