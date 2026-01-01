'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mic, MessageSquare, Shield, Zap, CheckCircle, Brain, Speaker, Users, Globe, Settings, Database,  Target } from 'lucide-react';

export default function VoiceAIFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-ai';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              VoiceAI Features
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the advanced AI-powered features that make VoiceAI the most natural and effective conversational AI platform for sales and customer service.
            </p>
          </div>
        </motion.section>

        {/* Core AI Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Core AI Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Advanced artificial intelligence capabilities that enable natural, contextual conversations with unprecedented accuracy.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Natural Language Processing */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-6">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Advanced NLP Engine</h3>
                    <p className="text-gray-300">State-of-the-art natural language processing for human-like understanding</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Contextual conversation understanding',
                    'Intent recognition and classification',
                    'Sentiment analysis and emotion detection',
                    'Multi-turn dialogue management',
                    'Named entity recognition',
                    'Semantic search and matching'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Voice Synthesis */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-6">
                    <Speaker className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Neural Voice Synthesis</h3>
                    <p className="text-gray-300">Human-quality voice generation with emotional intelligence</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Neural text-to-speech generation',
                    'Emotional tone modulation',
                    'Custom voice cloning technology',
                    'Real-time prosody optimization',
                    'Multi-language voice support',
                    'Brand voice personality matching'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Conversation Intelligence */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-6">
                    <MessageSquare className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Conversation Intelligence</h3>
                    <p className="text-gray-300">Smart dialogue management and response optimization</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Dynamic conversation flow control',
                    'Intelligent objection handling',
                    'Personalized response generation',
                    'Context-aware script adaptation',
                    'Goal-oriented dialogue strategies',
                    'Persuasion technique optimization'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Real-time Processing */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-6">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Real-time Processing</h3>
                    <p className="text-gray-300">Ultra-fast response generation and processing capabilities</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Sub-200ms response latency',
                    'Streaming audio processing',
                    'Real-time sentiment tracking',
                    'Live conversation adaptation',
                    'Instant context switching',
                    'Dynamic personality adjustment'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Advanced Capabilities */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Capabilities</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade features that enable sophisticated conversation management and optimization.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Multi-language Support',
                  description: 'Conduct conversations in 50+ languages with native-level fluency and cultural context.',
                  icon: Globe,
                  features: ['50+ language support', 'Cultural adaptation', 'Accent recognition', 'Regional dialects']
                },
                {
                  title: 'Voice Personality',
                  description: 'Customize voice characteristics to match your brand personality and communication style.',
                  icon: Mic,
                  features: ['Custom voice creation', 'Personality traits', 'Speaking style', 'Brand alignment']
                },
                {
                  title: 'Emotional Intelligence',
                  description: 'Detect and respond to emotional cues for more empathetic and effective conversations.',
                  icon: Brain,
                  features: ['Emotion detection', 'Empathy responses', 'Mood adaptation', 'Stress management']
                },
                {
                  title: 'Learning &amp; Adaptation',
                  description: 'Continuously improve performance through machine learning and conversation analysis.',
                  icon: Target,
                  features: ['Performance learning', 'Script optimization', 'Success pattern recognition', 'A/B testing']
                },
                {
                  title: 'Integration Hub',
                  description: 'Seamlessly connect with CRM systems, databases, and third-party applications.',
                  icon: Settings,
                  features: ['CRM integration', 'API connectivity', 'Data synchronization', 'Webhook support']
                },
                {
                  title: 'Compliance &amp; Security',
                  description: 'Enterprise-grade security with built-in compliance for regulated industries.',
                  icon: Shield,
                  features: ['Data encryption', 'GDPR compliance', 'PCI DSS certified', 'SOC 2 Type II']
                }
              ].map((capability, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <capability.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white" dangerouslySetInnerHTML={{ __html: capability.title }}></h3>
                  <p className="text-gray-300 mb-4">{capability.description}</p>
                  <ul className="space-y-2">
                    {capability.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Conversation Management */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Conversation Management</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Sophisticated tools for designing, managing, and optimizing conversational experiences.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Dialogue Designer */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Visual Dialogue Designer</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Drag-and-drop conversation builder',
                      'Visual flow mapping and logic',
                      'Conditional branching and routing',
                      'Pre-built conversation templates',
                      'A/B testing framework',
                      'Version control and rollback'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-2xl p-8 border border-green-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Knowledge Management</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Dynamic knowledge base integration',
                      'Real-time information retrieval',
                      'Contextual fact verification',
                      'Product catalog integration',
                      'FAQ automation',
                      'Content versioning and updates'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Analytics & Optimization */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl p-8 border border-orange-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Performance Analytics</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Real-time conversation analytics',
                      'Conversion rate optimization',
                      'Sentiment tracking and analysis',
                      'Performance benchmarking',
                      'Custom KPI dashboards',
                      'Predictive success scoring'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Team Collaboration</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Multi-user workspace management',
                      'Role-based access controls',
                      'Conversation sharing and review',
                      'Team performance dashboards',
                      'Collaborative script editing',
                      'Training and onboarding tools'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Technical Specifications */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Technical Specifications</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade infrastructure and performance specifications for mission-critical applications.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Performance',
                  metrics: [
                    { label: 'Response Latency', value: '<200ms' },
                    { label: 'Uptime SLA', value: '99.9%' },
                    { label: 'Concurrent Calls', value: '10,000+' },
                    { label: 'Languages', value: '50+' }
                  ]
                },
                {
                  title: 'Accuracy',
                  metrics: [
                    { label: 'Speech Recognition', value: '98.5%' },
                    { label: 'Intent Detection', value: '96.8%' },
                    { label: 'Sentiment Analysis', value: '94.2%' },
                    { label: 'Context Retention', value: '99.1%' }
                  ]
                },
                {
                  title: 'Security',
                  metrics: [
                    { label: 'Data Encryption', value: 'AES-256' },
                    { label: 'SOC 2 Type II', value: 'Certified' },
                    { label: 'GDPR Compliance', value: 'Full' },
                    { label: 'PCI DSS', value: 'Level 1' }
                  ]
                },
                {
                  title: 'Scalability',
                  metrics: [
                    { label: 'Auto-scaling', value: 'Dynamic' },
                    { label: 'Global CDN', value: '150+ PoPs' },
                    { label: 'Load Balancing', value: 'Automatic' },
                    { label: 'Redundancy', value: 'Multi-zone' }
                  ]
                }
              ].map((spec, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <h3 className="text-xl font-bold mb-6 text-white text-center">{spec.title}</h3>
                  <div className="space-y-4">
                    {spec.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{metric.label}</span>
                        <span className="text-white font-semibold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
