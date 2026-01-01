'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bot, Phone, BarChart3, Shield, Zap, CheckCircle, TrendingUp, Users, Clock, Globe, Headphones, Settings, Database, Mic, } from 'lucide-react';

export default function DialerAIFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/dialer-ai';

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              DialerAI Features
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the powerful AI-driven features that make DialerAI the most advanced auto-dialing platform for modern sales teams.
            </p>
          </div>
        </motion.section>

        {/* Core Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Core Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Advanced AI and machine learning capabilities that revolutionize your calling operations.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Predictive Dialing */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-6">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Predictive Dialing Engine</h3>
                    <p className="text-gray-300">AI-powered algorithms that predict optimal dialing patterns</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Machine learning call prediction models',
                    'Dynamic dial rate optimization',
                    'Real-time answer probability scoring',
                    'Abandoned call rate minimization',
                    'Agent availability synchronization',
                    'Campaign-specific dial strategies'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Progressive Dialing */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-6">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Progressive Dialing System</h3>
                    <p className="text-gray-300">Controlled dialing for maximum agent efficiency</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'One-to-one agent call matching',
                    'Manual dial override capabilities',
                    'Call pacing optimization',
                    'Agent skill-based routing',
                    'Queue management and prioritization',
                    'Custom dialing schedules'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Local Presence */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-6">
                    <Globe className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Local Presence Technology</h3>
                    <p className="text-gray-300">Increase answer rates with local caller ID</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Geographic number matching',
                    'Area code optimization',
                    'Caller ID reputation management',
                    'Number pool rotation',
                    'Spam detection avoidance',
                    'Compliance-verified numbers'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Call Analytics */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-6">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Advanced Call Analytics</h3>
                    <p className="text-gray-300">Deep insights into call performance and patterns</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Real-time performance dashboards',
                    'Call outcome prediction models',
                    'Agent productivity tracking',
                    'Campaign ROI analysis',
                    'Time-zone optimization reports',
                    'Custom KPI monitoring'
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

        {/* Quality & Compliance */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Quality &amp; Compliance</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Built-in compliance features and quality management tools to protect your business and improve performance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'TCPA Compliance',
                  description: 'Automated compliance with Telephone Consumer Protection Act regulations and consent management.',
                  icon: Shield,
                  features: ['Consent verification', 'Call time restrictions', 'DNC list management', 'Opt-out handling']
                },
                {
                  title: 'Call Recording',
                  description: 'High-quality call recording with cloud storage and advanced search capabilities.',
                  icon: Mic,
                  features: ['HD audio recording', 'Instant playback', 'Searchable transcripts', 'Compliance archiving']
                },
                {
                  title: 'Quality Scoring',
                  description: 'AI-powered call quality analysis and agent performance scoring systems.',
                  icon: TrendingUp,
                  features: ['Automated scoring', 'Custom criteria', 'Performance trends', 'Coaching insights']
                },
                {
                  title: 'Real-time Monitoring',
                  description: 'Live call monitoring with supervisor tools for training and quality assurance.',
                  icon: Headphones,
                  features: ['Live listening', 'Whisper coaching', 'Call barging', 'Silent monitoring']
                },
                {
                  title: 'Conversation Analytics',
                  description: 'Advanced speech analytics to identify trends, sentiment, and training opportunities.',
                  icon: Bot,
                  features: ['Sentiment analysis', 'Keyword tracking', 'Talk time ratios', 'Objection patterns']
                },
                {
                  title: 'Reporting Suite',
                  description: 'Comprehensive reporting with custom dashboards and automated compliance reports.',
                  icon: BarChart3,
                  features: ['Custom dashboards', 'Scheduled reports', 'Data export', 'API access']
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Advanced Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade capabilities for scaling your calling operations and maximizing performance.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* AI-Powered Features */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">AI-Powered Optimization</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Machine learning call timing optimization',
                      'Predictive lead scoring integration',
                      'Conversation outcome prediction',
                      'Automated campaign optimization',
                      'Dynamic caller ID selection',
                      'Intelligent call routing'
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
                    <h3 className="text-2xl font-bold text-white">Data Management</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Automated data cleansing and validation',
                      'Duplicate detection and removal',
                      'Contact enrichment services',
                      'Lead scoring and prioritization',
                      'Custom field mapping',
                      'Real-time data synchronization'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Integration Features */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Platform Integration</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Native CRM integrations (Salesforce, HubSpot)',
                      'API-first architecture',
                      'Webhook support for real-time updates',
                      'Single sign-on (SSO) capabilities',
                      'Third-party app marketplace',
                      'Custom integration development'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-2xl p-8 border border-orange-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Team Management</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Role-based access controls',
                      'Agent performance dashboards',
                      'Team collaboration tools',
                      'Shift scheduling and management',
                      'Training and onboarding workflows',
                      'Multi-location support'
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

        {/* Performance Metrics */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-purple-900/20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Performance Impact</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See the measurable results that DialerAI delivers for sales teams across industries.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { metric: "300%", label: "Increase in Talk Time", icon: Clock },
                { metric: "65%", label: "Average Answer Rate", icon: Phone },
                { metric: "75%", label: "Efficiency Improvement", icon: TrendingUp },
                { metric: "50%", label: "Reduction in Manual Work", icon: Bot }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{stat.metric}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
