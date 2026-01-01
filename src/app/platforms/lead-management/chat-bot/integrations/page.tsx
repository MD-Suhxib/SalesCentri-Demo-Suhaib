'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Users, Target, BarChart3, ArrowRight, CheckCircle, Zap, Settings, Database, Shield, Code } from 'lucide-react';

export default function ChatBotIntegrationsPage() {
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
              Chat Bot Integrations
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Seamlessly connect Chat Bot with your existing tools and platforms for a unified customer experience. 
              Our extensive integration library ensures your chat automation works perfectly with your current tech stack.
            </p>
          </div>
        </motion.section>

        {/* Integration Categories */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Website Platforms',
                  description: 'Easy implementation across all major website builders',
                  icon: Globe,
                  color: 'from-blue-500 to-blue-500',
                  integrations: [
                    { name: 'WordPress', description: 'Plugin available with one-click installation' },
                    { name: 'Shopify', description: 'Native app integration for e-commerce stores' },
                    { name: 'Webflow', description: 'Custom embed code for responsive designs' },
                    { name: 'Squarespace', description: 'Code injection for seamless integration' },
                    { name: 'Wix', description: 'HTML component integration' },
                    { name: 'Custom HTML', description: 'JavaScript snippet for any website' }
                  ]
                },
                {
                  title: 'CRM Systems',
                  description: 'Direct integration with major CRM platforms',
                  icon: Users,
                  color: 'from-blue-500 to-blue-500',
                  integrations: [
                    { name: 'Salesforce', description: 'Real-time lead sync and contact creation' },
                    { name: 'HubSpot', description: 'Automated contact management and scoring' },
                    { name: 'Pipedrive', description: 'Deal creation and pipeline management' },
                    { name: 'Zoho CRM', description: 'Lead qualification and follow-up automation' },
                    { name: 'Microsoft Dynamics', description: 'Enterprise CRM integration' },
                    { name: 'Custom CRM', description: 'API-based integration for proprietary systems' }
                  ]
                },
                {
                  title: 'Marketing Tools',
                  description: 'Connect with email marketing and automation platforms',
                  icon: Target,
                  color: 'from-blue-500 to-blue-500',
                  integrations: [
                    { name: 'Mailchimp', description: 'Email list building and campaign automation' },
                    { name: 'Marketo', description: 'Lead scoring and nurturing workflows' },
                    { name: 'Pardot', description: 'B2B marketing automation integration' },
                    { name: 'ActiveCampaign', description: 'Behavioral email sequences' },
                    { name: 'ConvertKit', description: 'Creator-focused email marketing' },
                    { name: 'Klaviyo', description: 'E-commerce email automation' }
                  ]
                },
                {
                  title: 'Analytics &amp; Tracking',
                  description: 'Monitor performance across analytics platforms',
                  icon: BarChart3,
                  color: 'from-blue-500 to-blue-500',
                  integrations: [
                    { name: 'Google Analytics', description: 'Conversion tracking and goal setup' },
                    { name: 'Adobe Analytics', description: 'Enterprise analytics integration' },
                    { name: 'Mixpanel', description: 'Event tracking and user behavior analysis' },
                    { name: 'Segment', description: 'Customer data platform integration' },
                    { name: 'Hotjar', description: 'User session recording and heatmaps' },
                    { name: 'Facebook Pixel', description: 'Social media advertising optimization' }
                  ]
                }
              ].map((category, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white text-center" dangerouslySetInnerHTML={{ __html: category.title }}></h3>
                  <p className="text-gray-300 text-center mb-6">{category.description}</p>
                  <ul className="space-y-3">
                    {category.integrations.map((integration, integrationIndex) => (
                      <li key={integrationIndex} className="border-b border-gray-700/30 pb-3 last:border-b-0">
                        <div className="font-semibold text-white text-sm">{integration.name}</div>
                        <div className="text-gray-400 text-xs mt-1">{integration.description}</div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* API & Developer Tools */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">API &amp; Developer Tools</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Flexible integration options for developers and custom implementations.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'REST API',
                  description: 'Full REST API access for custom integrations and data synchronization.',
                  icon: Code,
                  features: [
                    'Complete CRUD operations for conversations',
                    'Real-time webhook notifications',
                    'Authentication via API keys or OAuth',
                    'Rate limiting and usage monitoring',
                    'Comprehensive API documentation',
                    'SDKs for popular programming languages'
                  ]
                },
                {
                  title: 'Webhooks',
                  description: 'Real-time event notifications to keep your systems synchronized.',
                  icon: Zap,
                  features: [
                    'New conversation started events',
                    'Lead qualification completed notifications',
                    'Meeting scheduled confirmations',
                    'Custom event trigger configuration',
                    'Retry logic for failed deliveries',
                    'Webhook signature verification'
                  ]
                },
                {
                  title: 'Custom Integrations',
                  description: 'Professional services for complex integration requirements.',
                  icon: Settings,
                  features: [
                    'Custom API development for proprietary systems',
                    'Legacy system integration solutions',
                    'Enterprise SSO and authentication setup',
                    'Data migration and synchronization services',
                    'Performance optimization and scaling',
                    'Ongoing maintenance and support'
                  ]
                }
              ].map((tool, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                    <tool.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white" dangerouslySetInnerHTML={{ __html: tool.title }}></h3>
                  <p className="text-gray-300 mb-6">{tool.description}</p>
                  <ul className="space-y-3">
                    {tool.features.map((feature, featureIndex) => (
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

        {/* Security & Compliance */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Security &amp; Compliance</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade security features and compliance standards for all integrations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Data Encryption',
                  description: 'End-to-end encryption for all data transmission',
                  icon: Shield,
                  features: ['AES-256 encryption', 'TLS 1.3 protocols', 'Encrypted data storage', 'Key management']
                },
                {
                  title: 'Access Controls',
                  description: 'Granular permissions and user management',
                  icon: Users,
                  features: ['Role-based access', 'SSO integration', 'Multi-factor auth', 'Audit trails']
                },
                {
                  title: 'Compliance Standards',
                  description: 'Industry standard compliance certifications',
                  icon: Database,
                  features: ['GDPR compliance', 'SOC 2 Type II', 'HIPAA ready', 'ISO 27001']
                },
                {
                  title: 'Data Privacy',
                  description: 'Comprehensive privacy protection measures',
                  icon: Shield,
                  features: ['Data anonymization', 'Right to deletion', 'Consent management', 'Privacy by design']
                }
              ].map((security, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <security.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-white" dangerouslySetInnerHTML={{ __html: security.title }}></h3>
                  <p className="text-gray-300 text-sm mb-4">{security.description}</p>
                  <ul className="space-y-2">
                    {security.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-400 text-sm">{feature}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Integration Support */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Integration Support</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Comprehensive support to ensure successful integration with your existing systems.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Setup Assistance',
                  description: 'Expert guidance for integration setup and configuration.',
                  benefits: ['Technical consultation', 'Configuration guidance', 'Best practices', 'Quality assurance']
                },
                {
                  title: 'Documentation',
                  description: 'Comprehensive guides and resources for developers.',
                  benefits: ['API documentation', 'Code examples', 'Video tutorials', 'Integration guides']
                },
                {
                  title: 'Ongoing Support',
                  description: 'Continuous support for maintenance and optimization.',
                  benefits: ['Technical support', 'Performance monitoring', 'Updates &amp; patches', 'Troubleshooting']
                }
              ].map((support, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30 text-center"
                >
                  <h3 className="text-2xl font-bold mb-4 text-white">{support.title}</h3>
                  <p className="text-gray-300 mb-6">{support.description}</p>
                  <ul className="space-y-3">
                    {support.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center justify-center text-gray-400">
                        <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                        <span dangerouslySetInnerHTML={{ __html: benefit }}></span>
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
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Integrate Chat Bot?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Connect Chat Bot with your existing tools and platforms for a seamless customer experience. 
              Our integration experts are ready to help you get started.
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
                href="/contact"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Discuss Integration
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
