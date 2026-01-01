'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, ExternalLink, Plug, Database, Cloud, Building, Users, Code, Activity, Zap } from 'lucide-react';

export default function CallCenterIntegrationsPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/call-center';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const integrationCategories = [
    {
      category: "CRM & Sales Platforms",
      icon: Building,
      description: "Seamless integration with leading customer relationship management systems",
      integrations: [
        { name: "Salesforce", description: "Complete CRM integration with screen pops &amp; call logging", status: "Available", popular: true },
        { name: "HubSpot", description: "Sales &amp; marketing automation integration", status: "Available", popular: true },
        { name: "Microsoft Dynamics", description: "Enterprise CRM integration", status: "Available" },
        { name: "Pipedrive", description: "Sales pipeline management integration", status: "Available" },
        { name: "Zoho CRM", description: "Complete business suite integration", status: "Available" },
        { name: "Freshworks CRM", description: "Customer experience platform integration", status: "Available" },
        { name: "Custom CRM", description: "API-based custom CRM integration", status: "Available" },
        { name: "SugarCRM", description: "Open source CRM platform integration", status: "Coming Soon" }
      ]
    },
    {
      category: "Communication Platforms",
      icon: Users,
      description: "Integration with unified communications and collaboration tools",
      integrations: [
        { name: "Microsoft Teams", description: "Direct calling &amp; presence integration", status: "Available", popular: true },
        { name: "Slack", description: "Team collaboration &amp; notification integration", status: "Available", popular: true },
        { name: "Zoom", description: "Video conferencing &amp; phone integration", status: "Available" },
        { name: "Cisco Webex", description: "Enterprise collaboration platform", status: "Available" },
        { name: "Google Workspace", description: "Complete productivity suite integration", status: "Available" },
        { name: "Discord", description: "Community &amp; team communication", status: "Available" },
        { name: "Mattermost", description: "Secure team messaging platform", status: "Available" },
        { name: "RocketChat", description: "Open source team communication", status: "Coming Soon" }
      ]
    },
    {
      category: "Business Intelligence",
      icon: Activity,
      description: "Connect with analytics, reporting, and business intelligence platforms",
      integrations: [
        { name: "Tableau", description: "Advanced data visualization &amp; analytics", status: "Available" },
        { name: "Power BI", description: "Microsoft business analytics platform", status: "Available", popular: true },
        { name: "Google Analytics", description: "Web analytics &amp; customer insights", status: "Available" },
        { name: "Looker", description: "Modern business intelligence platform", status: "Available" },
        { name: "Qlik Sense", description: "Self-service data analytics", status: "Available" },
        { name: "Sisense", description: "AI-driven analytics platform", status: "Available" },
        { name: "Custom BI", description: "Tailored business intelligence solutions", status: "Available" },
        { name: "Grafana", description: "Open source analytics &amp; monitoring", status: "Available" }
      ]
    },
    {
      category: "Help Desk &amp; Support",
      icon: Users,
      description: "Integration with customer support and ticketing systems",
      integrations: [
        { name: "Zendesk", description: "Customer service &amp; support platform", status: "Available", popular: true },
        { name: "ServiceNow", description: "Enterprise service management", status: "Available" },
        { name: "Freshdesk", description: "Cloud-based customer support software", status: "Available" },
        { name: "Jira Service Desk", description: "IT service management platform", status: "Available" },
        { name: "Help Scout", description: "Customer support &amp; knowledge base", status: "Available" },
        { name: "Intercom", description: "Customer messaging &amp; support platform", status: "Available" },
        { name: "LiveChat", description: "Live chat &amp; help desk software", status: "Available" },
        { name: "Custom Ticketing", description: "API-based ticketing system integration", status: "Available" }
      ]
    },
    {
      category: "Cloud Platforms",
      icon: Cloud,
      description: "Integration with major cloud infrastructure and services",
      integrations: [
        { name: "AWS Connect", description: "Amazon cloud contact center service", status: "Available", popular: true },
        { name: "Google Cloud", description: "Contact Center AI &amp; cloud services", status: "Available" },
        { name: "Microsoft Azure", description: "Cloud communication services", status: "Available" },
        { name: "Twilio Flex", description: "Programmable contact center platform", status: "Available" },
        { name: "Five9", description: "Cloud contact center software", status: "Available" },
        { name: "Genesys Cloud", description: "Omnichannel orchestration platform", status: "Available" },
        { name: "Custom Cloud", description: "Private cloud &amp; hybrid deployments", status: "Available" },
        { name: "Oracle Cloud", description: "Enterprise cloud applications", status: "Coming Soon" }
      ]
    },
    {
      category: "Development &amp; APIs",
      icon: Code,
      description: "Comprehensive APIs and development tools for custom integrations",
      integrations: [
        { name: "REST API", description: "Full-featured RESTful API", status: "Available", popular: true },
        { name: "GraphQL", description: "Flexible query API interface", status: "Available" },
        { name: "WebSocket", description: "Real-time event streaming", status: "Available" },
        { name: "Webhooks", description: "Event-driven notifications", status: "Available" },
        { name: "JavaScript SDK", description: "Frontend development toolkit", status: "Available" },
        { name: "Python SDK", description: "Backend development toolkit", status: "Available" },
        { name: "Node.js SDK", description: "Server-side development toolkit", status: "Available" },
        { name: "Custom APIs", description: "Tailored API development", status: "Available" }
      ]
    }
  ];

  const integrationBenefits = [
    {
      icon: Zap,
      title: "Seamless Data Flow",
      description: "Automatic synchronization between your call center and business systems",
      features: ["Real-time data sync", "Bidirectional updates", "Conflict resolution"]
    },
    {
      icon: Database,
      title: "Unified Customer View",
      description: "Complete customer context across all touchpoints and systems",
      features: ["360-degree customer profile", "Interaction history", "Preference tracking"]
    },
    {
      icon: Activity,
      title: "Enhanced Analytics",
      description: "Cross-platform insights and reporting for better decision making",
      features: ["Multi-system reporting", "Advanced analytics", "Custom dashboards"]
    }
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
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <Plug className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                Call Center Integrations
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect your call center platform with your existing business systems. 
              Seamless integrations for CRM, communication tools, analytics, and more.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <CheckCircle className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">200+ integrations • Enterprise APIs • Custom development</span>
            </div>
          </div>
        </motion.section>

        {/* Integration Benefits */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Integration Benefits</h2>
              <p className="text-lg text-gray-300">
                Unlock the full potential of your call center with seamless system integrations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {integrationBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <benefit.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{benefit.title}</h3>
                  <p className="text-gray-400 mb-6">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center justify-center text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Integration Categories */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="space-y-16">
              {integrationCategories.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
                >
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white" dangerouslySetInnerHTML={{ __html: category.category }}></h2>
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto">{category.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {category.integrations.map((integration, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.05 * index }}
                        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300 relative"
                      >
                        {integration.popular && (
                          <div className="absolute -top-2 -right-2">
                            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Popular
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            integration.status === 'Available' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {integration.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4" dangerouslySetInnerHTML={{ __html: integration.description }}></p>
                        
                        {integration.status === 'Available' && (
                          <div className="flex items-center text-blue-400 text-sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span>View Integration</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Custom Integration */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Custom Integration Development</h2>
              <p className="text-lg text-gray-300">
                Need a specific integration? Our development team can build custom solutions for your unique requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">What We Can Build</h3>
                <ul className="space-y-4">
                  {[
                    "Custom API integrations with proprietary systems",
                    "Legacy system connectors and data migration",
                    "Real-time data synchronization solutions",
                    "Custom workflow automation",
                    "Specialized reporting and analytics",
                    "Third-party service integrations"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                <h3 className="text-xl font-semibold text-white mb-6">Development Process</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Requirements Analysis", desc: "Understanding your specific needs" },
                    { step: "2", title: "Technical Design", desc: "Architecture and implementation planning" },
                    { step: "3", title: "Development", desc: "Building and testing the integration" },
                    { step: "4", title: "Deployment", desc: "Implementation and monitoring" }
                  ].map((phase, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0">
                        {phase.step}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{phase.title}</h4>
                        <p className="text-gray-400 text-sm">{phase.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Connect Your Systems?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Discover how our call center platform can integrate with your existing business systems. 
              Start with our pre-built integrations or let us create a custom solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/book-demo"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Schedule Integration Demo</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs/api-reference"
                className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                View API Documentation
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              Need a custom integration? <Link href="/contact" className="text-blue-400 hover:underline">Contact our development team</Link>
            </p>
          </div>
        </motion.section>
      </main>
    </>
  );
}
