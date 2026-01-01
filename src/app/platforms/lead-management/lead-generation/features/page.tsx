'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Brain, BarChart3, CheckCircle, Zap, Globe, Search, TrendingUp, Database, Shield, Eye, Filter, Cpu, MessageSquare, Layers } from 'lucide-react';

export default function LeadGenerationFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/lead-generation';

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
              Lead Generation Features
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the powerful AI-driven features that make our lead generation platform 5x more effective than traditional methods.
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
                Advanced AI technology and data intelligence that revolutionizes how you find and qualify prospects.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* AI Prospect Discovery */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-6">
                    <Search className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">AI Prospect Discovery</h3>
                    <p className="text-gray-300">Intelligent algorithms that find high-quality prospects across multiple data sources</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Multi-source data aggregation',
                    'AI-powered prospect scoring',
                    'Intent signal detection',
                    'Behavioral pattern analysis',
                    'Real-time database updates',
                    'Custom search criteria'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Contact Verification */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-6">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Contact Verification</h3>
                    <p className="text-gray-300">Real-time verification ensures 95%+ accuracy of contact information</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Email deliverability verification',
                    'Phone number validation',
                    'Social media profile matching',
                    'Company information validation',
                    'Job title verification',
                    'GDPR compliance checking'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Intent Intelligence */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-6">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Intent Intelligence</h3>
                    <p className="text-gray-300">Advanced algorithms that identify prospects ready to buy</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Buying intent signal analysis',
                    'Technology stack identification',
                    'Funding and growth indicators',
                    'Competitor analysis insights',
                    'Market timing intelligence',
                    'Purchase probability scoring'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Data Enrichment */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="flex items-start mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-6">
                    <Database className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Data Enrichment</h3>
                    <p className="text-gray-300">Complete prospect profiles with 50+ data points</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Company demographics and firmographics',
                    'Revenue and employee count data',
                    'Technographic information',
                    'Social media presence analysis',
                    'News and trigger event monitoring',
                    'Organizational chart mapping'
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
                Enterprise-grade features that scale with your business and deliver consistent results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Real-time Monitoring',
                  description: 'Track prospect activity and receive instant alerts when they show buying intent.',
                  icon: Eye,
                  features: ['Website visitor tracking', 'Email engagement monitoring', 'Social media activity', 'Content consumption analysis']
                },
                {
                  title: 'Smart Filtering',
                  description: 'Advanced filters and AI-powered segmentation to find your ideal customer profile.',
                  icon: Filter,
                  features: ['ICP matching algorithms', 'Custom filter combinations', 'Lookalike audience creation', 'Negative criteria filtering']
                },
                {
                  title: 'Multi-channel Outreach',
                  description: 'Coordinate outreach across email, phone, social media, and direct mail channels.',
                  icon: MessageSquare,
                  features: ['Email sequence automation', 'LinkedIn outreach integration', 'SMS messaging', 'Direct mail campaigns']
                },
                {
                  title: 'Performance Analytics',
                  description: 'Comprehensive analytics to optimize your lead generation performance and ROI.',
                  icon: BarChart3,
                  features: ['Conversion tracking', 'Source attribution', 'Quality scoring metrics', 'ROI optimization']
                },
                {
                  title: 'CRM Integration',
                  description: 'Seamless integration with popular CRM systems for automated lead management.',
                  icon: Layers,
                  features: ['Salesforce integration', 'HubSpot connectivity', 'Pipedrive sync', 'Custom API endpoints']
                },
                {
                  title: 'Compliance &amp; Security',
                  description: 'Enterprise-grade security with full compliance for data protection regulations.',
                  icon: Shield,
                  features: ['GDPR compliance', 'SOC 2 certification', 'Data encryption', 'Privacy controls']
                }
              ].map((capability, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <capability.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white" dangerouslySetInnerHTML={{ __html: capability.title }}></h3>
                  <p className="text-gray-300 mb-4">{capability.description}</p>
                  <ul className="space-y-2">
                    {capability.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AI Technology Stack */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">AI Technology Stack</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Powered by cutting-edge artificial intelligence and machine learning technologies.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Machine Learning Models */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-8 border border-blue-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                      <Cpu className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Machine Learning Models</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Predictive lead scoring algorithms',
                      'Natural language processing for intent detection',
                      'Image recognition for company identification',
                      'Behavioral pattern analysis',
                      'Anomaly detection for data quality',
                      'Clustering algorithms for segmentation'
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
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Data Intelligence</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Real-time web scraping and monitoring',
                      'Social media sentiment analysis',
                      'News and event trigger detection',
                      'Competitive intelligence gathering',
                      'Market trend analysis',
                      'Economic indicator correlation'
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Zap className="w-4 h-4 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Automation Engine */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Automation Engine</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Automated prospect discovery workflows',
                      'Smart data enrichment processes',
                      'Real-time lead scoring updates',
                      'Trigger-based alert systems',
                      'Automated list building and maintenance',
                      'Intelligent duplicate detection and merging'
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
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Performance Optimization</h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'A/B testing for lead generation strategies',
                      'Conversion rate optimization algorithms',
                      'Quality score improvement recommendations',
                      'ROI optimization suggestions',
                      'Performance benchmarking and analytics',
                      'Predictive performance modeling'
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

        {/* Integration Ecosystem */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Integration Ecosystem</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Connect with your existing sales and marketing technology stack for seamless workflow integration.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  category: 'CRM Systems',
                  integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Microsoft Dynamics', 'Copper']
                },
                {
                  category: 'Marketing Automation',
                  integrations: ['Marketo', 'Pardot', 'Mailchimp', 'Constant Contact', 'ActiveCampaign', 'Drip']
                },
                {
                  category: 'Sales Tools',
                  integrations: ['Outreach', 'SalesLoft', 'Apollo', 'ZoomInfo', 'LinkedIn Sales Navigator', 'Gong']
                },
                {
                  category: 'Analytics &amp; BI',
                  integrations: ['Google Analytics', 'Tableau', 'Power BI', 'Looker', 'Mixpanel', 'Segment']
                }
              ].map((category, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <h3 className="text-lg font-bold mb-4 text-white" dangerouslySetInnerHTML={{ __html: category.category }}></h3>
                  <ul className="space-y-2">
                    {category.integrations.map((integration, integrationIndex) => (
                      <li key={integrationIndex} className="text-gray-400 text-sm">
                        {integration}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
