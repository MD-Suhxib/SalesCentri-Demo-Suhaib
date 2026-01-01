'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Volume2, Mic, Phone, Brain, Zap, Target,  Users, Shield, Globe, Activity, BarChart, MessageSquare, Monitor,  Database, ArrowRight, CheckCircle } from 'lucide-react';

export default function VoiceAIAgentFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-ai-agent';

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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-white to-pink-400 bg-clip-text text-transparent">
              VoiceAI Agent Features
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Explore the comprehensive voice AI features that power natural, intelligent phone conversations. 
              From advanced voice synthesis to real-time conversation intelligence, every feature is designed to maximize your call success rates.
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Voice Technology</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Cutting-edge voice synthesis and natural language processing that creates truly human-like phone conversations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Natural Voice Synthesis */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Volume2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Natural Voice Synthesis</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'Human-like speech patterns',
                    'Emotional tone adaptation',
                    'Natural breathing &amp; pauses',
                    'Multiple voice personalities',
                    'Gender &amp; age voice options',
                    'Real-time voice modulation'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
                <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                  <p className="text-purple-400 text-sm font-medium">99.8% Voice Quality Rating</p>
                </div>
              </motion.div>

              {/* Speech Recognition */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Advanced Speech Recognition</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'Real-time speech-to-text',
                    'Accent &amp; dialect support',
                    'Background noise filtering',
                    'Multi-speaker detection',
                    'Intent recognition',
                    'Sentiment analysis'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-blue-400 text-sm font-medium">97% Speech Recognition Accuracy</p>
                </div>
              </motion.div>

              {/* Conversation Intelligence */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Conversation Intelligence</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'Context-aware responses',
                    'Dynamic conversation flow',
                    'Objection handling',
                    'Pain point identification',
                    'Opportunity detection',
                    'Next-best-action suggestions'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <p className="text-green-400 text-sm font-medium">87% Conversation Success Rate</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Call Management Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Call Management &amp; Automation</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Comprehensive call handling features that manage your entire phone sales process from start to finish.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Inbound Call Handling',
                  description: 'Instantly answer and manage incoming sales calls with professional voice interactions.',
                  icon: Phone,
                  features: [
                    'Instant call answering (&lt;2 rings)',
                    'Professional greeting customization',
                    'Caller ID integration',
                    'Call routing &amp; transfer',
                    'Voicemail detection &amp; handling',
                    'Call queue management'
                  ]
                },
                {
                  title: 'Outbound Dialing',
                  description: 'Automated outbound calling campaigns with intelligent dialing and prospect engagement.',
                  icon: Target,
                  features: [
                    'Predictive dialer integration',
                    'Power dialing capabilities',
                    'Do-not-call list compliance',
                    'Optimal calling time detection',
                    'Callback scheduling',
                    'Campaign management'
                  ]
                },
                {
                  title: 'Call Recording &amp; Analysis',
                  description: 'Comprehensive call recording with AI-powered analysis and performance insights.',
                  icon: Monitor,
                  features: [
                    'Full call recording',
                    'Real-time transcription',
                    'Call sentiment analysis',
                    'Performance scoring',
                    'Keyword detection',
                    'Quality assurance metrics'
                  ]
                },
                {
                  title: 'Smart Call Routing',
                  description: 'Intelligent call routing based on caller profile, intent, and agent availability.',
                  icon: Activity,
                  features: [
                    'Skills-based routing',
                    'Priority caller identification',
                    'Load balancing',
                    'Geographic routing',
                    'Time-based routing',
                    'Failover management'
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
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400" dangerouslySetInnerHTML={{ __html: item }}></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AI Intelligence Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Intelligence &amp; Learning</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Advanced AI capabilities that continuously learn and adapt to improve call outcomes and conversation quality.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Adaptive Learning',
                  description: 'AI continuously improves from successful calls and conversation outcomes.',
                  icon: Brain,
                  capabilities: [
                    'Call outcome analysis',
                    'Successful pattern recognition',
                    'Strategy optimization',
                    'Performance improvement'
                  ]
                },
                {
                  title: 'Real-Time Intelligence',
                  description: 'Access live data and insights during calls for informed responses.',
                  icon: Zap,
                  capabilities: [
                    'CRM data integration',
                    'Real-time suggestions',
                    'Context awareness',
                    'Dynamic scripting'
                  ]
                },
                {
                  title: 'Predictive Analytics',
                  description: 'Predict call outcomes and optimize conversation strategies for success.',
                  icon: BarChart,
                  capabilities: [
                    'Success probability scoring',
                    'Optimal timing prediction',
                    'Conversation path optimization',
                    'Outcome forecasting'
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
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.capabilities.map((capability, capIndex) => (
                      <li key={capIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        <span className="text-gray-400">{capability}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Language & Personalization */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Language &amp; Personalization</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Comprehensive language support and personalization features that adapt to your audience and market needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Language Support',
                  value: '25+',
                  description: 'Support for major global languages with native-level fluency and pronunciation.',
                  icon: Globe
                },
                {
                  title: 'Voice Personalities',
                  value: '50+',
                  description: 'Multiple voice options with different ages, genders, and personality traits.',
                  icon: Users
                },
                {
                  title: 'Response Speed',
                  value: '&lt;200ms',
                  description: 'Lightning-fast response times that maintain natural conversation flow.',
                  icon: Zap
                },
                {
                  title: 'Accent Varieties',
                  value: '100+',
                  description: 'Regional accents and dialects for localized market engagement.',
                  icon: Volume2
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: feature.value }}></div>
                  <h3 className="text-lg font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Integration Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Integration Capabilities</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Seamlessly connect with your existing phone systems, CRM, and business tools for unified operations.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Phone Systems',
                  icon: Phone,
                  integrations: [
                    'VoIP platforms',
                    'Traditional PBX',
                    'Cloud phone systems',
                    'SIP trunking',
                    'WebRTC integration',
                    'Mobile carriers'
                  ]
                },
                {
                  title: 'CRM &amp; Sales Tools',
                  icon: Database,
                  integrations: [
                    'Salesforce',
                    'HubSpot',
                    'Pipedrive',
                    'Zoho CRM',
                    'Microsoft Dynamics',
                    'Custom APIs'
                  ]
                },
                {
                  title: 'Communication Platforms',
                  icon: MessageSquare,
                  integrations: [
                    'Slack notifications',
                    'Microsoft Teams',
                    'Email integration',
                    'SMS platforms',
                    'Calendar systems',
                    'Webhook support'
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
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-6">
                    <category.icon className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-white" dangerouslySetInnerHTML={{ __html: category.title }}></h3>
                  <ul className="space-y-3">
                    {category.integrations.map((integration, integrationIndex) => (
                      <li key={integrationIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{integration}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Security & Compliance */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Security &amp; Compliance</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade security and compliance features that protect sensitive call data and meet regulatory requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Call Security',
                  icon: Shield,
                  features: [
                    'End-to-end call encryption',
                    'Secure voice transmission',
                    'PCI DSS compliance',
                    'Call recording encryption',
                    'Secure API access',
                    'Data anonymization'
                  ]
                },
                {
                  title: 'Regulatory Compliance',
                  icon: CheckCircle,
                  features: [
                    'TCPA compliance',
                    'Do-not-call management',
                    'GDPR compliance',
                    'HIPAA ready',
                    'SOC 2 Type II',
                    'Industry certifications'
                  ]
                },
                {
                  title: 'Access Control',
                  icon: Users,
                  features: [
                    'Role-based permissions',
                    'Multi-factor authentication',
                    'Single sign-on (SSO)',
                    'Audit logging',
                    'Session management',
                    'API key management'
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
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
                    <category.icon className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-white">{category.title}</h3>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
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
          transition={{ duration: 0.8, delay: 1.5 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-pink-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience VoiceAI Agent Features
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your phone sales with human-like voice conversations that work around the clock. 
              Start your free trial and hear the difference VoiceAI Agent makes.
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
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Hear Voice Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
