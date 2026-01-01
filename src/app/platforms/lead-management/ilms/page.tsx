'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Target, BarChart3, Zap, ArrowRight, CheckCircle, Brain, Clock, Shield, TrendingUp, Bot, Database, Workflow } from 'lucide-react';

export default function ILMSPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/ilms';

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
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                  <Database className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
                  iLMS
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Intelligent Lead Management System
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Transform chaos into clarity with our AI-powered lead management platform. iLMS automatically captures, 
                scores, nurtures, and routes leads through intelligent workflows—ensuring no opportunity is ever missed 
                while maximizing conversion rates through predictive analytics and automated optimization.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: TrendingUp, label: "Conversion Increase", value: "240%" },
                { icon: Clock, label: "Response Time", value: "<5min" },
                { icon: Brain, label: "Lead Score Accuracy", value: "94%" },
                { icon: Workflow, label: "Process Automation", value: "85%" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Core Features Overview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Intelligent Capture */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Intelligent Capture</h3>
                <ul className="space-y-4">
                  {[
                    'Multi-channel lead ingestion',
                    'Automated data validation',
                    'Duplicate detection &amp; merging',
                    'Real-time enrichment'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Smart Scoring */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Smart Scoring</h3>
                <ul className="space-y-4">
                  {[
                    'AI-powered lead scoring',
                    'Behavioral analysis',
                    'Predictive conversion modeling',
                    'Dynamic score updates'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Automated Workflows */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Workflow className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Automated Workflows</h3>
                <ul className="space-y-4">
                  {[
                    'Intelligent lead routing',
                    'Automated nurturing sequences',
                    'Follow-up orchestration',
                    'Performance optimization'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose iLMS?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Stop losing leads in spreadsheets and manual processes. iLMS brings intelligence and automation 
                to every stage of your lead management lifecycle.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Automated Lead Capture',
                  description: 'Seamlessly capture leads from all sources—forms, emails, social media, and integrations—with automatic validation.',
                  icon: Target
                },
                {
                  title: 'Intelligent Scoring',
                  description: 'AI algorithms analyze 200+ data points to score lead quality and predict conversion likelihood in real-time.',
                  icon: Brain
                },
                {
                  title: 'Smart Routing',
                  description: 'Automatically route leads to the right sales rep based on territory, skills, workload, and lead characteristics.',
                  icon: Zap
                },
                {
                  title: 'Nurturing Automation',
                  description: 'Deploy personalized nurturing campaigns that adapt based on lead behavior and engagement patterns.',
                  icon: Bot
                },
                {
                  title: 'Performance Analytics',
                  description: 'Track conversion rates, source quality, and team performance with comprehensive dashboards and reports.',
                  icon: BarChart3
                },
                {
                  title: 'CRM Integration',
                  description: 'Seamlessly sync with your existing CRM while adding intelligent automation and advanced analytics.',
                  icon: Database
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How iLMS Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our intelligent system handles every aspect of lead management, from initial capture to final conversion, 
                using AI-powered automation and optimization.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Capture &amp; Validate',
                  description: 'Automatically capture leads from all sources, validate data quality, and enrich with additional information.',
                  icon: Target
                },
                {
                  step: '02',
                  title: 'Score &amp; Prioritize',
                  description: 'AI algorithms analyze lead data and behavior to assign quality scores and prioritize follow-up actions.',
                  icon: Brain
                },
                {
                  step: '03',
                  title: 'Route &amp; Assign',
                  description: 'Intelligent routing ensures leads reach the right sales rep at the optimal time for maximum conversion.',
                  icon: Zap
                },
                {
                  step: '04',
                  title: 'Nurture &amp; Convert',
                  description: 'Automated workflows nurture leads through personalized sequences until they&apos;re ready to buy.',
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
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-purple-400 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-4 text-white" dangerouslySetInnerHTML={{ __html: step.title }}></h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Use Cases */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">iLMS Use Cases</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how different teams and industries leverage iLMS to streamline lead management and boost conversions.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'Sales Team Optimization',
                  description: 'Empower sales teams with qualified, prioritized leads and automated follow-up workflows.',
                  icon: Users,
                  features: ['Lead scoring &amp; prioritization', 'Automated lead distribution', 'Performance tracking', 'Follow-up automation']
                },
                {
                  title: 'Marketing Attribution',
                  description: 'Track lead sources, campaign performance, and ROI with detailed attribution reporting.',
                  icon: BarChart3,
                  features: ['Source attribution', 'Campaign ROI tracking', 'Conversion analytics', 'Marketing automation']
                },
                {
                  title: 'Customer Success',
                  description: 'Identify expansion opportunities and prevent churn through intelligent lead scoring.',
                  icon: Shield,
                  features: ['Expansion opportunity detection', 'Churn risk identification', 'Customer health scoring', 'Upsell automation']
                },
                {
                  title: 'Business Development',
                  description: 'Automate partnership lead management and referral tracking with custom workflows.',
                  icon: TrendingUp,
                  features: ['Partner lead routing', 'Referral tracking', 'Custom scoring models', 'Channel management']
                }
              ].map((useCase, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                      <useCase.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-gray-300">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Integration Ecosystem */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Seamless Integrations</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                iLMS works with your existing tools and platforms, creating a unified lead management ecosystem.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  category: 'CRM Systems',
                  tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM'],
                  icon: Database
                },
                {
                  category: 'Marketing Tools',
                  tools: ['Marketo', 'Pardot', 'ActiveCampaign', 'Mailchimp'],
                  icon: Target
                },
                {
                  category: 'Communication',
                  tools: ['Slack', 'Teams', 'Email', 'SMS'],
                  icon: Bot
                },
                {
                  category: 'Analytics',
                  tools: ['Google Analytics', 'Mixpanel', 'Segment', 'Custom APIs'],
                  icon: BarChart3
                }
              ].map((integration, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <integration.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white">{integration.category}</h3>
                  <ul className="space-y-2">
                    {integration.tools.map((tool, toolIndex) => (
                      <li key={toolIndex} className="text-gray-300 text-sm">{tool}</li>
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
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Lead Management?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Stop losing leads to manual processes and scattered systems. Let iLMS automate your lead management 
              with intelligent workflows that maximize conversions and optimize team performance.
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
