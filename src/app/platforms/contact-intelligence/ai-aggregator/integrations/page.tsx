'use client';

import { motion } from 'framer-motion';
import { Database, Globe, CheckCircle, Settings, BarChart3, Workflow, Play, Download, Upload, Webhook } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AIAggregatorIntegrationsPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/ai-aggregator', active: false },
    { name: 'Features', href: '/platforms/contact-intelligence/ai-aggregator/features', active: false },
    { name: 'Integrations', href: '/platforms/contact-intelligence/ai-aggregator/integrations', active: pathname === '/platforms/contact-intelligence/ai-aggregator/integrations' },
    { name: 'Pricing', href: '/platforms/contact-intelligence/ai-aggregator/pricing', active: false }
  ];

  const integrationCategories = [
    {
      icon: Database,
      category: "CRM Systems",
      description: "Bi-directional sync with all major CRM platforms to keep your contact data consistent across sales tools.",
      platforms: [
        { name: "Salesforce", status: "Available", type: "Real-time sync" },
        { name: "HubSpot", status: "Available", type: "Real-time sync" },
        { name: "Pipedrive", status: "Available", type: "Real-time sync" },
        { name: "Microsoft Dynamics", status: "Available", type: "Real-time sync" },
        { name: "Zoho CRM", status: "Available", type: "Batch sync" },
        { name: "Custom CRMs", status: "API Available", type: "Custom integration" }
      ]
    },
    {
      icon: BarChart3,
      category: "Marketing Automation",
      description: "Enhance your marketing campaigns with enriched contact data from multiple sources.",
      platforms: [
        { name: "Marketo", status: "Available", type: "Real-time sync" },
        { name: "Pardot", status: "Available", type: "Real-time sync" },
        { name: "Mailchimp", status: "Available", type: "Batch sync" },
        { name: "Constant Contact", status: "Available", type: "Batch sync" },
        { name: "Campaign Monitor", status: "Available", type: "Batch sync" },
        { name: "ActiveCampaign", status: "Available", type: "Real-time sync" }
      ]
    },
    {
      icon: Globe,
      category: "Data Sources",
      description: "Extract and aggregate contact data from premium databases and social platforms.",
      platforms: [
        { name: "LinkedIn Sales Navigator", status: "Available", type: "API integration" },
        { name: "ZoomInfo", status: "Available", type: "API integration" },
        { name: "Apollo", status: "Available", type: "API integration" },
        { name: "Hunter.io", status: "Available", type: "API integration" },
        { name: "Clearbit", status: "Available", type: "API integration" },
        { name: "People Data Labs", status: "Available", type: "API integration" }
      ]
    },
    {
      icon: Workflow,
      category: "Business Intelligence",
      description: "Connect aggregated data to your analytics and reporting tools for comprehensive insights.",
      platforms: [
        { name: "Tableau", status: "Available", type: "Data connector" },
        { name: "Power BI", status: "Available", type: "Data connector" },
        { name: "Looker", status: "Available", type: "Data connector" },
        { name: "Google Analytics", status: "Available", type: "API integration" },
        { name: "Mixpanel", status: "Available", type: "API integration" },
        { name: "Custom Dashboards", status: "API Available", type: "REST API" }
      ]
    }
  ];

  const apiFeatures = [
    {
      icon: Upload,
      title: "Data Ingestion API",
      description: "Push contact data from any source into the aggregation platform",
      capabilities: [
        "RESTful API with JSON payloads",
        "Bulk upload capabilities",
        "Real-time data streaming",
        "Custom field mapping"
      ]
    },
    {
      icon: Download,
      title: "Data Export API", 
      description: "Extract aggregated and enhanced data for use in other systems",
      capabilities: [
        "Filtered data exports",
        "Multiple format support (JSON, CSV, XML)",
        "Scheduled data pulls",
        "Real-time change notifications"
      ]
    },
    {
      icon: Webhook,
      title: "Webhook Notifications",
      description: "Receive real-time notifications when data is processed or updated",
      capabilities: [
        "Custom webhook endpoints",
        "Event-based triggers",
        "Retry logic and failure handling",
        "Payload customization"
      ]
    },
    {
      icon: Settings,
      title: "Configuration API",
      description: "Programmatically manage integration settings and data processing rules",
      capabilities: [
        "Dynamic field mapping",
        "Processing rule configuration",
        "Integration status monitoring",
        "Error handling customization"
      ]
    }
  ];

  const integrationMethods = [
    {
      method: "Pre-built Connectors",
      description: "Ready-to-use integrations with popular platforms",
      setup: "5 minutes",
      features: [
        "One-click setup",
        "Auto-configuration",
        "Maintained by our team",
        "Regular updates"
      ]
    },
    {
      method: "API Integration",
      description: "Custom integrations using our comprehensive REST API",
      setup: "1-2 hours",
      features: [
        "Full customization",
        "Custom field mapping",
        "Advanced filtering",
        "Webhook support"
      ]
    },
    {
      method: "File Upload",
      description: "Batch upload contact data via CSV, Excel, or JSON files",
      setup: "Instant",
      features: [
        "Drag and drop interface",
        "Automatic field detection",
        "Preview before import",
        "Error validation"
      ]
    },
    {
      method: "Database Direct Connect",
      description: "Direct connection to your databases for real-time sync",
      setup: "30 minutes",
      features: [
        "Real-time synchronization",
        "Automatic schema detection",
        "Incremental updates",
        "Secure connections"
      ]
    }
  ];

  const workflowExamples = [
    {
      title: "CRM Data Enhancement Workflow",
      description: "Automatically enhance CRM contacts with data from multiple sources",
      steps: [
        "New contact added to CRM",
        "AI Aggregator detects new record",
        "Enrich with data from LinkedIn, ZoomInfo, and other sources", 
        "Validate and standardize information",
        "Update CRM with enhanced data"
      ],
      frequency: "Real-time"
    },
    {
      title: "Marketing List Enrichment",
      description: "Enhance marketing lists before campaign launch",
      steps: [
        "Upload marketing list to platform",
        "Cross-reference with premium databases",
        "Add missing email addresses and phone numbers",
        "Validate all contact information",
        "Export enriched list to marketing automation platform"
      ],
      frequency: "On-demand"
    },
    {
      title: "Data Quality Monitoring",
      description: "Continuous monitoring and improvement of contact data quality",
      steps: [
        "Monitor data quality across all sources",
        "Identify degraded or outdated records",
        "Automatically refresh with latest information",
        "Remove duplicates and standardize formats",
        "Send quality reports to stakeholders"
      ],
      frequency: "Daily"
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
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Workflow className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">AI Aggregator Integrations</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Connect{' '}
                <span className="text-blue-400">Everything</span>{' '}
                to Your Data Aggregation Platform
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Seamlessly integrate with 200+ platforms, databases, and tools to create a unified 
                contact data ecosystem. From CRMs to marketing automation, from social platforms 
                to business intelligence tools - connect everything in minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/get-started/free-trial">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Integrations - Start Free Trial
                  </motion.button>
                </Link>
                <Link href="/docs/integrations">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Integration Guide
                  </motion.button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">200+</div>
                  <div className="text-gray-400">Integrations</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">&lt;5 min</div>
                  <div className="text-gray-400">Setup Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">Real-time</div>
                  <div className="text-gray-400">Data Sync</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">99.9%</div>
                  <div className="text-gray-400">Uptime</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Popular Integration Categories</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connect your favorite tools and platforms with pre-built integrations designed 
                for maximum compatibility and performance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {integrationCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{category.category}</h3>
                  </div>
                  
                  <p className="text-gray-400 mb-6">{category.description}</p>
                  
                  <div className="space-y-3">
                    {category.platforms.map((platform, platformIndex) => (
                      <div key={platformIndex} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 text-sm font-medium">{platform.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-400 text-xs font-medium">{platform.status}</div>
                          <div className="text-gray-500 text-xs">{platform.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* API Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Powerful API & Webhook System</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Build custom integrations with our comprehensive API suite. Push data in, pull data out, 
                and get real-time notifications for any changes or processing events.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {apiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-xs">{capability}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Methods */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Multiple Integration Methods</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Choose the integration method that best fits your technical requirements and timeline. 
                From instant file uploads to custom API integrations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {integrationMethods.map((method, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{method.method}</h3>
                    <div className="text-green-400 text-sm font-medium">{method.setup}</div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6">{method.description}</p>
                  
                  <div className="space-y-2">
                    {method.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Examples */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Common Integration Workflows</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how our integrations work in practice with these common workflow examples 
                used by thousands of businesses to automate their data management.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {workflowExamples.map((workflow, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{workflow.title}</h3>
                    <div className="text-blue-400 text-sm font-medium">{workflow.frequency}</div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-6">{workflow.description}</p>
                  
                  <div className="space-y-3">
                    {workflow.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-400 text-xs font-bold">{stepIndex + 1}</span>
                        </div>
                        <span className="text-gray-300 text-sm">{step}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/get-started/free-trial">
                    <motion.button
                      className="w-full mt-6 bg-blue-500/10 border border-blue-500/20 text-blue-400 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-4 h-4" />
                      <span>Try This Workflow</span>
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Support */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Expert Integration Support</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Our integration experts are here to help you connect any system to the AI Aggregator platform. 
                  From pre-built connectors to custom integrations, we ensure seamless data flow.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Free integration consultation",
                    "Custom connector development",
                    "Migration assistance from existing tools",
                    "Real-time monitoring and support",
                    "24/7 technical support",
                    "Comprehensive integration documentation"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/get-started/contact">
                    <motion.button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Integration Help
                    </motion.button>
                  </Link>
                  <Link href="/docs">
                    <motion.button
                      className="border border-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Documentation
                    </motion.button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
              >
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-2">Integration Health Dashboard</h3>
                  <div className="text-gray-400 text-sm">Monitor all your integrations in real-time</div>
                </div>

                <div className="space-y-4">
                  {[
                    { integration: "Salesforce CRM", status: "Healthy", lastSync: "2 min ago", records: "1,247" },
                    { integration: "HubSpot Marketing", status: "Healthy", lastSync: "5 min ago", records: "893" },
                    { integration: "LinkedIn Sales Nav", status: "Syncing", lastSync: "Active", records: "456" },
                    { integration: "ZoomInfo API", status: "Healthy", lastSync: "1 min ago", records: "2,341" }
                  ].map((item, index) => (
                    <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-gray-300 text-sm font-medium">{item.integration}</div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'Healthy' ? 'bg-green-400' : 
                            item.status === 'Syncing' ? 'bg-blue-400' : 'bg-yellow-400'
                          }`}></div>
                          <span className="text-xs text-gray-400">{item.status}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Last sync: {item.lastSync}</span>
                        <span>{item.records} records</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="text-green-400 text-sm font-medium mb-1">All Integrations Healthy</div>
                  <div className="text-green-300 text-xs">4,937 records processed in the last hour</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Workflow className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Connect Your Data Sources?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Start integrating your favorite tools and platforms today. With our extensive integration 
                library and expert support, you&apos;ll have a unified data system up and running in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started/free-trial">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Integrating - Free Trial
                  </motion.button>
                </Link>
                <Link href="/platforms/contact-intelligence/ai-aggregator/features">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Browse All Features
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
