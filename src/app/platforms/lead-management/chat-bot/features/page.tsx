'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Smartphone, ArrowRight, CheckCircle, Users, Target, Activity, Shield, Zap, Brain, MessageSquare, TrendingUp, BarChart3 } from 'lucide-react';

export default function ChatBotFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/chat-bot';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
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
              Chat Bot Features
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover the comprehensive suite of AI-powered chat features that transform website visitors 
              into engaged prospects and drive measurable conversion improvements.
            </p>
          </div>
        </motion.section>

        {/* AI Conversation Engine */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced AI Conversation Engine</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Powered by natural language processing and machine learning to deliver human-like conversations that engage and convert.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Natural Language Understanding',
                  description: 'AI comprehends visitor intent, context, and sentiment to provide relevant and helpful responses.',
                  icon: Brain,
                  features: ['Intent recognition', 'Context awareness', 'Sentiment analysis', 'Multi-turn conversations']
                },
                {
                  title: 'Dynamic Response Generation',
                  description: 'Generate contextually appropriate responses that adapt to visitor behavior and conversation flow.',
                  icon: MessageSquare,
                  features: ['Personalized messaging', 'Adaptive responses', 'Conversation branching', 'Smart follow-ups']
                },
                {
                  title: 'Learning &amp; Optimization',
                  description: 'Continuously improve conversation quality through machine learning and performance analytics.',
                  icon: TrendingUp,
                  features: ['Performance learning', 'A/B testing', 'Response optimization', 'Conversation analytics']
                },
                {
                  title: 'Multi-Language Support',
                  description: 'Engage global visitors with native language support and cultural localization.',
                  icon: Globe,
                  features: ['50+ languages', 'Cultural adaptation', 'Regional customization', 'Automatic detection']
                },
                {
                  title: 'Intelligent Escalation',
                  description: 'Smart handoff to human agents when complex issues require personal attention.',
                  icon: Users,
                  features: ['Escalation triggers', 'Context preservation', 'Agent notifications', 'Seamless transitions']
                },
                {
                  title: 'Conversation Memory',
                  description: 'Remember previous interactions to provide consistent and personalized experiences.',
                  icon: Brain,
                  features: ['Visitor history', 'Preference tracking', 'Context retention', 'Personalization']
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
                  <h3 className="text-xl font-bold mb-3 text-white" dangerouslySetInnerHTML={{ __html: feature.title }}></h3>
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

        {/* Engagement & Conversion Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Engagement &amp; Conversion Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Advanced features designed to capture visitor attention, qualify leads, and drive conversions.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'Proactive Visitor Engagement',
                  description: 'Intelligent triggers that initiate conversations based on visitor behavior and intent signals.',
                  icon: Zap,
                  features: [
                    'Behavioral trigger system based on page views and time spent',
                    'Exit-intent detection to prevent visitor abandonment',
                    'Geographic and demographic-based personalization',
                    'Custom engagement rules for different visitor segments',
                    'A/B testing for optimal engagement timing',
                    'Mobile-optimized engagement for all device types'
                  ]
                },
                {
                  title: 'Lead Qualification Engine',
                  description: 'Automated qualification process that identifies high-value prospects and sales-ready leads.',
                  icon: Target,
                  features: [
                    'Dynamic questioning flows based on visitor responses',
                    'BANT (Budget, Authority, Need, Timeline) qualification',
                    'Lead scoring and prioritization algorithms',
                    'Progressive profiling to build comprehensive lead data',
                    'Integration with CRM for seamless lead handoff',
                    'Custom qualification criteria for different industries'
                  ]
                },
                {
                  title: 'Meeting &amp; Demo Scheduling',
                  description: 'Seamless appointment booking that connects qualified prospects with your sales team.',
                  icon: Activity,
                  features: [
                    'Real-time calendar integration and availability checking',
                    'Automated meeting confirmation and reminder emails',
                    'Time zone detection and scheduling optimization',
                    'Custom meeting types and duration options',
                    'Pre-meeting questionnaires and preparation forms',
                    'Integration with popular calendar platforms'
                  ]
                },
                {
                  title: 'Analytics &amp; Performance Tracking',
                  description: 'Comprehensive insights into chat performance, visitor behavior, and conversion metrics.',
                  icon: BarChart3,
                  features: [
                    'Real-time conversation analytics and performance metrics',
                    'Conversion funnel analysis from chat to customer',
                    'Visitor journey mapping and behavior insights',
                    'A/B testing results for message and flow optimization',
                    'ROI tracking and attribution reporting',
                    'Custom dashboard creation and data export capabilities'
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
                      <h3 className="text-2xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: category.title }}></h3>
                      <p className="text-gray-300">{category.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {category.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Platform & Integration Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Platform &amp; Integration Features</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Seamlessly integrate with your existing tools and platforms for a unified customer experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Website Integration',
                  description: 'Easy implementation across all website platforms',
                  icon: Globe,
                  integrations: ['WordPress', 'Shopify', 'Webflow', 'Custom HTML']
                },
                {
                  title: 'CRM Connectivity',
                  description: 'Direct integration with major CRM platforms',
                  icon: Users,
                  integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM']
                },
                {
                  title: 'Marketing Tools',
                  description: 'Connect with email and marketing automation',
                  icon: Target,
                  integrations: ['Mailchimp', 'Marketo', 'Pardot', 'ActiveCampaign']
                },
                {
                  title: 'Analytics Platforms',
                  description: 'Track performance across analytics tools',
                  icon: BarChart3,
                  integrations: ['Google Analytics', 'Adobe Analytics', 'Mixpanel', 'Segment']
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
                Enterprise-grade capabilities that set Chat Bot apart from basic chat solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Custom Chat Flows',
                  description: 'Design personalized conversation flows for different visitor segments and use cases.',
                  icon: MessageSquare,
                  benefits: ['Visual flow builder', 'Conditional logic', 'Dynamic branching', 'A/B testing']
                },
                {
                  title: 'Mobile Optimization',
                  description: 'Responsive chat interface optimized for mobile devices and touch interactions.',
                  icon: Smartphone,
                  benefits: ['Touch-friendly UI', 'Mobile-first design', 'Offline messaging', 'App integration']
                },
                {
                  title: 'Security &amp; Compliance',
                  description: 'Enterprise-grade security features and compliance with data protection regulations.',
                  icon: Shield,
                  benefits: ['GDPR compliance', 'Data encryption', 'Access controls', 'Audit trails']
                },
                {
                  title: 'AI Training &amp; Customization',
                  description: 'Train the AI on your specific business knowledge and customize responses.',
                  icon: Brain,
                  benefits: ['Knowledge base training', 'Custom responses', 'Industry-specific models', 'Continuous learning']
                },
                {
                  title: 'Real-Time Monitoring',
                  description: 'Live monitoring and intervention capabilities for conversation oversight.',
                  icon: Activity,
                  benefits: ['Live chat monitoring', 'Agent takeover', 'Performance alerts', 'Quality assurance']
                },
                {
                  title: 'API &amp; Webhooks',
                  description: 'Flexible API access and webhook integrations for custom implementations.',
                  icon: Activity,
                  benefits: ['REST API access', 'Webhook triggers', 'Custom integrations', 'Developer tools']
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
                  <h3 className="text-xl font-bold mb-3 text-white" dangerouslySetInnerHTML={{ __html: feature.title }}></h3>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Chat Bot vs Traditional Solutions</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how Chat Bot&apos;s AI-powered approach delivers superior results compared to basic chat widgets.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30">
                <h3 className="text-2xl font-bold text-white mb-6">Traditional Chat Widgets</h3>
                <ul className="space-y-4">
                  {[
                    'Basic contact forms and message collection',
                    'Manual response required for every inquiry',
                    'Limited availability during business hours',
                    'No visitor behavior analysis or personalization',
                    'Basic reporting and limited analytics',
                    'Static conversation flows and responses'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start text-gray-400">
                      <div className="w-5 h-5 border-2 border-blue-400 rounded mr-3 mt-0.5 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-xl p-8 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-6">Chat Bot AI Solution</h3>
                <ul className="space-y-4">
                  {[
                    'Intelligent conversation management and lead qualification',
                    'Automated responses with human-like interaction quality',
                    '24/7 availability with consistent performance',
                    'Advanced behavioral analysis and personalized engagement',
                    'Comprehensive analytics with ROI tracking and insights',
                    'Dynamic conversation flows that adapt to visitor needs'
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
              Experience Advanced Chat Bot Features
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Discover how Chat Bot&apos;s comprehensive feature set can transform your website engagement 
              and drive measurable improvements in lead generation and conversion rates.
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
