'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {  MessageCircle, Volume2, Brain, Phone, Mic, Target, Clock,  Shield, Activity, BarChart, Settings, Monitor, Database, ArrowRight, CheckCircle } from 'lucide-react';

export default function VoiceBotFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-bot';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
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
              Voice Bot Features
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Explore the comprehensive voice AI features that power intelligent customer interactions. 
              From advanced speech processing to smart automation, every feature is designed to deliver exceptional voice experiences.
            </p>
          </div>
        </motion.section>

        {/* Core Voice Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Voice Processing</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                State-of-the-art voice technology that enables natural, intelligent conversations with your customers.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Speech Recognition */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Advanced Speech Recognition</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'Multi-accent support',
                    'Background noise filtering',
                    'Real-time transcription',
                    'Confidence scoring',
                    'Custom vocabulary training',
                    'Speaker identification'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
                  <p className="text-emerald-400 text-sm font-medium">97% Recognition Accuracy</p>
                </div>
              </motion.div>

              {/* Natural Language Understanding */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Natural Language Understanding</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'Intent classification',
                    'Entity extraction',
                    'Context awareness',
                    'Sentiment analysis',
                    'Conversation flow management',
                    'Dialogue state tracking'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-blue-400 text-sm font-medium">94% Intent Recognition</p>
                </div>
              </motion.div>

              {/* Voice Synthesis */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Natural Voice Synthesis</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'Human-like voice generation',
                    'Emotional tone adaptation',
                    'SSML markup support',
                    'Voice speed &amp; pitch control',
                    'Custom voice personalities',
                    'Real-time voice modulation'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <p className="text-green-400 text-sm font-medium">Natural Voice Quality</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Customer Support Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Customer Support Automation</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Comprehensive support features that handle customer inquiries, resolve issues, and provide intelligent assistance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Intelligent Issue Resolution',
                  description: 'Automatically diagnose and resolve common customer issues through guided voice interactions.',
                  icon: Target,
                  features: [
                    'Problem diagnosis workflows',
                    'Step-by-step guidance',
                    'Solution recommendations',
                    'Success confirmation',
                    'Alternative options',
                    'Escalation triggers'
                  ]
                },
                {
                  title: 'Knowledge Base Integration',
                  description: 'Access comprehensive knowledge repositories to provide accurate information and solutions.',
                  icon: Database,
                  features: [
                    'Dynamic content retrieval',
                    'Multi-source integration',
                    'Real-time updates',
                    'Contextual recommendations',
                    'Personalized responses',
                    'Content versioning'
                  ]
                },
                {
                  title: 'Customer Authentication',
                  description: 'Secure voice-based customer verification and identity management for personalized service.',
                  icon: Shield,
                  features: [
                    'Voice biometric authentication',
                    'Multi-factor verification',
                    'Account security checks',
                    'Privacy protection',
                    'Fraud detection',
                    'Secure data access'
                  ]
                },
                {
                  title: 'Ticket Management',
                  description: 'Automatically create, update, and manage support tickets based on voice interactions.',
                  icon: Activity,
                  features: [
                    'Automated ticket creation',
                    'Priority classification',
                    'Status updates',
                    'Assignment routing',
                    'Follow-up scheduling',
                    'Resolution tracking'
                  ]
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Integration Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Multi-Channel Integration</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Seamlessly integrate voice capabilities across multiple platforms and communication channels.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Phone System Integration',
                  icon: Phone,
                  integrations: [
                    'VoIP platforms',
                    'Traditional PBX',
                    'Cloud phone systems',
                    'SIP trunking',
                    'Call center software',
                    'IVR replacement'
                  ]
                },
                {
                  title: 'Digital Platforms',
                  icon: Monitor,
                  integrations: [
                    'Web browsers',
                    'Mobile applications',
                    'Smart speakers',
                    'Voice assistants',
                    'IoT devices',
                    'Kiosks &amp; terminals'
                  ]
                },
                {
                  title: 'Business Systems',
                  icon: Database,
                  integrations: [
                    'CRM platforms',
                    'Help desk software',
                    'Knowledge bases',
                    'Ticketing systems',
                    'Analytics tools',
                    'Custom APIs'
                  ]
                }
              ].map((category, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                    <category.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-white">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.integrations.map((integration, integrationIndex) => (
                      <li key={integrationIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: integration }}></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Analytics & Intelligence */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Analytics &amp; Intelligence</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Comprehensive analytics and AI-powered insights to optimize voice interactions and improve customer satisfaction.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Conversation Analytics',
                  value: 'Real-time',
                  description: 'Monitor and analyze voice interactions as they happen for immediate insights.',
                  icon: BarChart
                },
                {
                  title: 'Intent Accuracy',
                  value: '94%',
                  description: 'High accuracy in understanding customer intent and routing to appropriate responses.',
                  icon: Target
                },
                {
                  title: 'Response Time',
                  value: '&lt;1s',
                  description: 'Lightning-fast processing and response generation for natural conversation flow.',
                  icon: Clock
                },
                {
                  title: 'Issue Resolution',
                  value: '89%',
                  description: 'Success rate in resolving customer issues without human intervention.',
                  icon: CheckCircle
                }
              ].map((metric, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: metric.value }}></div>
                  <h3 className="text-lg font-bold mb-3 text-white">{metric.title}</h3>
                  <p className="text-gray-300 text-sm">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Advanced Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced AI Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Cutting-edge AI capabilities that enable sophisticated voice interactions and intelligent automation.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Contextual Memory',
                  description: 'Maintain conversation context across interactions for personalized experiences.',
                  icon: Brain,
                  capabilities: [
                    'Session persistence',
                    'Historical context',
                    'User preferences',
                    'Interaction history'
                  ]
                },
                {
                  title: 'Adaptive Learning',
                  description: 'Continuously improve responses based on successful interactions and feedback.',
                  icon: Settings,
                  capabilities: [
                    'Performance optimization',
                    'Response refinement',
                    'Pattern recognition',
                    'Outcome analysis'
                  ]
                },
                {
                  title: 'Emotional Intelligence',
                  description: 'Detect and respond to customer emotions for empathetic interactions.',
                  icon: MessageCircle,
                  capabilities: [
                    'Emotion detection',
                    'Tone adaptation',
                    'Empathy responses',
                    'De-escalation techniques'
                  ]
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-gray-700/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.capabilities.map((capability, capIndex) => (
                      <li key={capIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                        <span className="text-gray-400">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="py-20 bg-gradient-to-r from-emerald-900/20 via-black to-teal-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience Voice Bot Features
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your customer interactions with intelligent voice technology that understands, responds, 
              and resolves inquiries naturally. Start your free trial and hear the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Try Voice Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
