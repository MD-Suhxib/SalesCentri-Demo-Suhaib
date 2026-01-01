'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Headphones,BarChart3, TrendingUp, ArrowRight, CheckCircle, Users, Target, Activity, Shield, Globe, Mic, Zap, Volume2, Brain } from 'lucide-react';

export default function SalesTuneFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/sales-tune';

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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
              Sales Tune Features
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover the comprehensive suite of AI-powered voice coaching and analytics features that transform 
              sales conversations and drive measurable performance improvements across your entire sales team.
            </p>
          </div>
        </motion.section>

        {/* Real-Time Coaching Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Real-Time Coaching Engine</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                AI-powered coaching that provides instant guidance during live sales calls to optimize conversation flow and outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Live Conversation Monitoring',
                  description: 'AI monitors every word spoken during sales calls and analyzes conversation flow in real-time.',
                  icon: Headphones,
                  features: ['Speech recognition', 'Intent detection', 'Context understanding', 'Emotion analysis']
                },
                {
                  title: 'Instant Coaching Prompts',
                  description: 'Get immediate coaching suggestions displayed on your screen during active sales conversations.',
                  icon: Zap,
                  features: ['Next-best-action alerts', 'Response suggestions', 'Question prompts', 'Closing cues']
                },
                {
                  title: 'Objection Handling Support',
                  description: 'Receive real-time guidance on how to handle specific objections as they arise during calls.',
                  icon: Shield,
                  features: ['Objection identification', 'Response frameworks', 'Success patterns', 'Confidence building']
                },
                {
                  title: 'Talk Ratio Optimization',
                  description: 'Monitor and optimize the balance between talking and listening for maximum sales effectiveness.',
                  icon: BarChart3,
                  features: ['Real-time ratio tracking', 'Optimal balance alerts', 'Listening prompts', 'Engagement metrics']
                },
                {
                  title: 'Sentiment Detection',
                  description: 'AI analyzes prospect sentiment and emotional state to guide conversation direction.',
                  icon: Brain,
                  features: ['Emotional intelligence', 'Mood detection', 'Engagement scoring', 'Temperature alerts']
                },
                {
                  title: 'Call Script Guidance',
                  description: 'Dynamic script suggestions that adapt based on prospect responses and conversation flow.',
                  icon: Mic,
                  features: ['Adaptive scripting', 'Personalization cues', 'Flow optimization', 'Message consistency']
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-gray-400 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Voice Analytics Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Voice Analytics</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Comprehensive conversation analysis and performance tracking that turns every sales call into actionable insights.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'Conversation Intelligence',
                  description: 'Deep analysis of every sales conversation with AI-powered insights and recommendations.',
                  icon: Brain,
                  features: [
                    'Automatic call transcription with 98% accuracy',
                    'Keyword and phrase tracking for competitive intelligence',
                    'Talk time analysis and optimal ratio recommendations',
                    'Conversation flow mapping and optimization suggestions',
                    'Topic analysis and content effectiveness scoring',
                    'Customer sentiment progression throughout calls'
                  ]
                },
                {
                  title: 'Performance Metrics',
                  description: 'Comprehensive scoring and tracking of individual and team sales performance.',
                  icon: BarChart3,
                  features: [
                    'Individual call scoring based on best practices',
                    'Team performance benchmarking and comparisons',
                    'Goal achievement tracking and progress monitoring',
                    'Revenue impact correlation with coaching metrics',
                    'Skill gap identification and improvement areas',
                    'Success pattern recognition and replication'
                  ]
                },
                {
                  title: 'Trend Analysis',
                  description: 'Identify patterns and trends in sales conversations to optimize strategies and outcomes.',
                  icon: TrendingUp,
                  features: [
                    'Monthly and quarterly performance trend analysis',
                    'Successful conversation pattern identification',
                    'Objection frequency and resolution tracking',
                    'Prospect behavior pattern recognition',
                    'Seasonal and market trend correlation',
                    'Predictive performance forecasting'
                  ]
                },
                {
                  title: 'Quality Assurance',
                  description: 'Automated quality monitoring and compliance tracking for all sales conversations.',
                  icon: Shield,
                  features: [
                    'Automated compliance monitoring and alerting',
                    'Call quality scoring against defined standards',
                    'Brand message consistency verification',
                    'Legal and regulatory compliance tracking',
                    'Customer experience quality measurement',
                    'Training requirement identification and recommendations'
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
                  <div className="flex items-start mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mr-4">
                      <category.icon className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{category.title}</h3>
                      <p className="text-gray-300">{category.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Seamless Integrations</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Sales Tune integrates with your existing sales tech stack to provide comprehensive coaching and analytics.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Phone Systems',
                  description: 'Direct integration with major phone and VoIP systems',
                  icon: Volume2,
                  integrations: ['Salesforce Voice', 'RingCentral', 'Zoom Phone', 'Microsoft Teams']
                },
                {
                  title: 'CRM Platforms',
                  description: 'Sync coaching data and insights with your CRM',
                  icon: Users,
                  integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'Microsoft Dynamics']
                },
                {
                  title: 'Sales Tools',
                  description: 'Connect with popular sales automation platforms',
                  icon: Target,
                  integrations: ['Outreach', 'SalesLoft', 'Gong', 'Chorus']
                },
                {
                  title: 'Analytics Platforms',
                  description: 'Export data to business intelligence tools',
                  icon: BarChart3,
                  integrations: ['Tableau', 'Power BI', 'Looker', 'Google Analytics']
                }
              ].map((integration, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <integration.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">{integration.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{integration.description}</p>
                  <ul className="space-y-2">
                    {integration.integrations.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-gray-400 text-sm">{item}</li>
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
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Cutting-edge capabilities that set Sales Tune apart from traditional call monitoring and coaching solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'AI-Powered Coaching',
                  description: 'Machine learning algorithms that adapt coaching based on individual rep performance and improvement patterns.',
                  icon: Brain,
                  benefits: ['Personalized coaching', 'Adaptive learning', 'Continuous improvement', 'Performance optimization']
                },
                {
                  title: 'Multi-Language Support',
                  description: 'Support for coaching and analytics in multiple languages and regional dialects.',
                  icon: Globe,
                  benefits: ['Global team support', 'Localized coaching', 'Cultural adaptation', 'Regional best practices']
                },
                {
                  title: 'Predictive Analytics',
                  description: 'Forecast sales outcomes and identify at-risk deals based on conversation patterns.',
                  icon: TrendingUp,
                  benefits: ['Deal forecasting', 'Risk identification', 'Opportunity scoring', 'Success prediction']
                },
                {
                  title: 'Custom Coaching Models',
                  description: 'Build and deploy custom coaching frameworks tailored to your sales methodology.',
                  icon: Target,
                  benefits: ['Methodology alignment', 'Custom frameworks', 'Brand consistency', 'Competitive advantage']
                },
                {
                  title: 'Real-Time Alerts',
                  description: 'Instant notifications for managers when reps need immediate support or intervention.',
                  icon: Zap,
                  benefits: ['Immediate assistance', 'Manager alerts', 'Escalation protocols', 'Quality assurance']
                },
                {
                  title: 'Performance Benchmarking',
                  description: 'Compare individual and team performance against industry standards and top performers.',
                  icon: Activity,
                  benefits: ['Industry benchmarks', 'Competitive analysis', 'Goal setting', 'Performance gaps']
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-gray-400 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Feature Comparison */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Sales Tune vs Traditional Solutions</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how Sales Tune&apos;s AI-powered approach delivers superior results compared to traditional coaching methods.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30">
                <h3 className="text-2xl font-bold text-white mb-6">Traditional Coaching</h3>
                <ul className="space-y-4">
                  {[
                    'Manual call review and scoring',
                    'Delayed feedback after calls end',
                    'Inconsistent coaching standards',
                    'Limited manager availability',
                    'Subjective performance evaluation',
                    'Time-intensive training processes'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-gray-400">
                      <div className="w-5 h-5 border-2 border-blue-400 rounded mr-3 mt-0.5 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Sales Tune AI Coaching</h3>
                <ul className="space-y-4">
                  {[
                    'Automated real-time call analysis',
                    'Instant coaching during active calls',
                    'Consistent AI-powered standards',
                    '24/7 coaching availability',
                    'Objective data-driven evaluation',
                    'Accelerated learning and improvement'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience Advanced Voice Coaching
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Discover how Sales Tune&apos;s comprehensive feature set can transform your sales team performance 
              and drive measurable improvements in conversation quality and closing rates.
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
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                See Features Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
