'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, MessageSquare, Zap, Target, Clock, Users, Shield, Globe, Activity, BarChart, Settings, Calendar, Monitor, Database, ArrowRight, CheckCircle } from 'lucide-react';

export default function SalesAIAgentFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/salesai-agent';

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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent">
              SalesAI Agent Features
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover the comprehensive suite of AI-powered features that make SalesAI Agent your ultimate 24/7 sales representative. 
              From natural conversations to intelligent qualification, every feature is designed to maximize your sales potential.
            </p>
          </div>
        </motion.section>

        {/* Core Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Core AI Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Advanced artificial intelligence capabilities that power natural, intelligent, and effective sales conversations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Natural Language Processing */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Natural Language Processing</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'Advanced GPT-4 powered conversations',
                    'Context-aware response generation',
                    'Sentiment analysis &amp; emotion detection',
                    'Intent recognition &amp; classification',
                    'Multi-turn conversation management',
                    'Dynamic conversation flow adaptation'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
                <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                  <p className="text-cyan-400 text-sm font-medium">99.2% Natural Conversation Accuracy</p>
                </div>
              </motion.div>

              {/* Intelligent Qualification */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Intelligent Qualification</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'BANT qualification framework',
                    'Custom qualification criteria',
                    'Adaptive questioning strategies',
                    'Lead scoring algorithms',
                    'Pain point identification',
                    'Decision-maker detection'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <p className="text-blue-400 text-sm font-medium">92% Qualification Accuracy Rate</p>
                </div>
              </motion.div>

              {/* Multi-Channel Communication */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Multi-Channel Communication</h3>
                <ul className="space-y-4 mb-6">
                  {[
                    'Website chat integration',
                    'Email conversation handling',
                    'Voice call capabilities',
                    'SMS text messaging',
                    'Social media messaging',
                    'WhatsApp &amp; Telegram support'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
                <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                  <p className="text-green-400 text-sm font-medium">6+ Communication Channels</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Automation Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Automation &amp; Workflow Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Streamline your sales process with intelligent automation that handles routine tasks and complex workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Automated Lead Response',
                  description: 'Instantly respond to inbound leads with personalized messages based on their source and profile.',
                  icon: Zap,
                  features: [
                    'Instant response (&lt;30 seconds)',
                    'Source-based personalization',
                    'Lead profile analysis',
                    'Custom greeting templates',
                    'Priority lead detection',
                    '24/7 availability'
                  ]
                },
                {
                  title: 'Meeting Scheduling',
                  description: 'Seamlessly schedule meetings with qualified prospects using calendar integration and availability.',
                  icon: Calendar,
                  features: [
                    'Calendar integration (Google, Outlook)',
                    'Availability checking',
                    'Time zone coordination',
                    'Meeting type selection',
                    'Automatic confirmations',
                    'Reminder sequences'
                  ]
                },
                {
                  title: 'Follow-up Sequences',
                  description: 'Automated follow-up campaigns that nurture leads and move them through your sales funnel.',
                  icon: Activity,
                  features: [
                    'Intelligent follow-up timing',
                    'Multi-channel sequences',
                    'Personalized messaging',
                    'Engagement tracking',
                    'Drop-off detection',
                    'Re-engagement campaigns'
                  ]
                },
                {
                  title: 'CRM Integration',
                  description: 'Seamlessly sync all conversations, lead data, and activities with your existing CRM system.',
                  icon: Database,
                  features: [
                    'Real-time data sync',
                    'Lead profile updates',
                    'Conversation logging',
                    'Activity tracking',
                    'Pipeline management',
                    'Custom field mapping'
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
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-400" dangerouslySetInnerHTML={{ __html: item }}></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AI Learning Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Learning &amp; Intelligence</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Advanced machine learning capabilities that continuously improve performance and adapt to your sales process.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Continuous Learning',
                  description: 'AI improves over time by analyzing successful conversations and outcomes.',
                  icon: Brain,
                  capabilities: [
                    'Conversation analysis',
                    'Success pattern recognition',
                    'Performance optimization',
                    'Strategy refinement'
                  ]
                },
                {
                  title: 'Predictive Analytics',
                  description: 'Predict lead conversion probability and optimize engagement strategies.',
                  icon: BarChart,
                  capabilities: [
                    'Conversion prediction',
                    'Engagement scoring',
                    'Timing optimization',
                    'Channel preference'
                  ]
                },
                {
                  title: 'Personalization Engine',
                  description: 'Create highly personalized experiences based on lead behavior and preferences.',
                  icon: Settings,
                  capabilities: [
                    'Behavioral analysis',
                    'Preference detection',
                    'Message customization',
                    'Experience optimization'
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

        {/* Performance Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Performance &amp; Analytics</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Comprehensive analytics and performance monitoring to optimize your sales processes and maximize ROI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Real-time Analytics',
                  value: 'Live',
                  description: 'Monitor conversations, lead quality, and conversion rates in real-time.',
                  icon: Monitor
                },
                {
                  title: 'Response Time',
                  value: '&lt;30s',
                  description: 'Lightning-fast response times that never miss a lead opportunity.',
                  icon: Clock
                },
                {
                  title: 'Conversation Volume',
                  value: '500+',
                  description: 'Handle unlimited simultaneous conversations without quality degradation.',
                  icon: MessageSquare
                },
                {
                  title: 'Qualification Rate',
                  value: '92%',
                  description: 'Industry-leading accuracy in identifying qualified sales prospects.',
                  icon: Target
                }
              ].map((metric, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: metric.value }}></div>
                  <h3 className="text-lg font-bold mb-3 text-white">{metric.title}</h3>
                  <p className="text-gray-300 text-sm">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Security & Compliance */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Security &amp; Compliance</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade security and compliance features that protect your data and meet regulatory requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Data Protection',
                  icon: Shield,
                  features: [
                    'End-to-end encryption',
                    'GDPR compliance',
                    'CCPA compliance',
                    'SOC 2 Type II certified',
                    'Data residency options',
                    'Regular security audits'
                  ]
                },
                {
                  title: 'Access Control',
                  icon: Users,
                  features: [
                    'Role-based permissions',
                    'Single sign-on (SSO)',
                    'Multi-factor authentication',
                    'API access controls',
                    'Audit logging',
                    'Session management'
                  ]
                },
                {
                  title: 'Compliance',
                  icon: CheckCircle,
                  features: [
                    'HIPAA ready',
                    'PCI DSS compliant',
                    'ISO 27001 certified',
                    'Regular penetration testing',
                    'Compliance reporting',
                    'Data backup &amp; recovery'
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
                        <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
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
          transition={{ duration: 0.8, delay: 1.3 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Integration Capabilities</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Seamlessly connect with your existing sales stack and tools for a unified workflow experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { category: 'CRM Systems', tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Monday.com', 'Custom APIs'] },
                { category: 'Communication', tools: ['Slack', 'Microsoft Teams', 'Discord', 'Telegram', 'WhatsApp', 'Email'] },
                { category: 'Calendars', tools: ['Google Calendar', 'Outlook', 'Calendly', 'Acuity', 'ScheduleOnce', 'Apple Calendar'] },
                { category: 'Marketing', tools: ['Mailchimp', 'Klaviyo', 'ActiveCampaign', 'Marketo', 'Pardot', 'ConvertKit'] }
              ].map((integration, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <h3 className="text-lg font-bold mb-4 text-white">{integration.category}</h3>
                  <ul className="space-y-2">
                    {integration.tools.map((tool, toolIndex) => (
                      <li key={toolIndex} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                        <span>{tool}</span>
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
          className="py-20 bg-gradient-to-r from-cyan-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience All SalesAI Agent Features
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              See how these powerful features can transform your sales process and scale your business. 
              Start your free trial today and experience the future of AI-powered sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Book Feature Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
