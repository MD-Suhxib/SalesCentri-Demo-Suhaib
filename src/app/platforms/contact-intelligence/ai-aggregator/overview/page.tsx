'use client';

import { motion } from 'framer-motion';
import { Database, Zap, Globe, CheckCircle, ArrowRight, Workflow } from 'lucide-react';

export default function AIAggregatorOverviewPage() {
  const keyFeatures = [
    {
      icon: Database,
      title: "Multi-Source Integration",
      description: "Connect and aggregate data from 50+ sources including CRMs, databases, social platforms, and web APIs.",
      stats: "50+ sources"
    },
    {
      icon: Zap,
      title: "AI-Enhanced Quality",
      description: "Advanced AI algorithms clean, deduplicate, and enhance contact data for maximum accuracy.",
      stats: "99% accuracy"
    },
    {
      icon: Workflow,
      title: "Workflow Integration",
      description: "Seamlessly integrate aggregated data into your existing sales and marketing workflows.",
      stats: "Real-time sync"
    }
  ];

  const dataSources = [
    "CRM Systems (Salesforce, HubSpot, Pipedrive)",
    "Email Marketing Platforms",
    "Social Media Networks",
    "Web Scraping APIs",
    "B2B Databases",
    "Company Websites",
    "Professional Networks",
    "Government Databases",
    "Industry Directories",
    "Event Platforms"
  ];

  const aiEnhancements = [
    {
      feature: "Duplicate Detection",
      description: "AI-powered algorithms identify and merge duplicate records across all data sources"
    },
    {
      feature: "Data Standardization", 
      description: "Automatically standardize formats, phone numbers, addresses, and company names"
    },
    {
      feature: "Missing Data Inference",
      description: "Use machine learning to infer missing contact information from available data points"
    },
    {
      feature: "Quality Scoring",
      description: "Assign quality scores to each contact based on data completeness and accuracy"
    },
    {
      feature: "Relationship Mapping",
      description: "Identify connections between contacts and companies using graph analysis"
    },
    {
      feature: "Intent Prediction",
      description: "Predict purchase intent based on behavioral data and engagement patterns"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Source Connection",
      description: "Connect your data sources through APIs, integrations, or file uploads",
      time: "5 min"
    },
    {
      step: "2",
      title: "Data Extraction", 
      description: "Extract contact data from all connected sources automatically",
      time: "Real-time"
    },
    {
      step: "3",
      title: "AI Processing",
      description: "Clean, deduplicate, and enhance data using advanced AI algorithms",
      time: "< 1 min"
    },
    {
      step: "4",
      title: "Unified Database",
      description: "Create a single, clean database with all your contact information",
      time: "Instant"
    }
  ];

  return (
    <>
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
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">AI Aggregator Platform</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                AI-Powered{' '}
                <span className="text-blue-400">Contact Data Aggregation</span>{' '}
                Platform
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Consolidate contact data from multiple sources into one unified, AI-enhanced database. 
                Eliminate data silos, reduce duplicates, and create a single source of truth for all 
                your customer and prospect information.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Aggregate Your Contact Data - Start Free Trial
                  </motion.button>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                  <div className="text-gray-400">Data Sources</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">99%</div>
                  <div className="text-gray-400">Data Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">80%</div>
                  <div className="text-gray-400">Time Savings</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Multi-Source Integration</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connect all your data sources and create a unified view of your contacts with AI-powered 
                data processing and enhancement.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                  <div className="text-blue-400 font-semibold">{feature.stats}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Sources Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Comprehensive Data Sources</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Connect with over 50 different data sources to build the most complete contact database 
                  possible. Our platform handles the complexity of multiple integrations and data formats.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {dataSources.slice(0, 5).map((source, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{source}</span>
                    </div>
                  ))}
                  <div className="text-gray-400 text-sm">+ 45 more sources...</div>
                </div>

                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View All Data Sources</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-semibold">Data Source Integration</h3>
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Live Status</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { source: "Salesforce CRM", status: "Connected", records: "45,231" },
                      { source: "LinkedIn Sales Navigator", status: "Syncing", records: "12,847" },
                      { source: "HubSpot Marketing", status: "Connected", records: "28,592" },
                      { source: "ZoomInfo Database", status: "Connected", records: "156,773" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <div className="text-gray-300 text-sm">{item.source}</div>
                          <div className="text-gray-500 text-xs">{item.records} records</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'Connected' ? 'bg-green-400' : 
                            item.status === 'Syncing' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}></div>
                          <span className="text-xs text-gray-400">{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* AI Enhancement Section */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">AI-Enhanced Quality</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our advanced AI algorithms automatically clean, enhance, and optimize your aggregated data 
                for maximum accuracy and usability.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aiEnhancements.map((enhancement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{enhancement.feature}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{enhancement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">4-Step Aggregation Process</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our streamlined process makes it easy to consolidate all your contact data sources 
                into one unified, AI-enhanced database.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-400 font-bold text-lg">{step.step}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                    <div className="text-green-400 font-semibold text-sm">{step.time}</div>
                  </div>
                  
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Integration */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Seamless Workflow Integration</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Once your data is aggregated and enhanced, automatically sync it back to your 
                  existing tools and workflows. Keep your team working with the tools they know 
                  while ensuring they have the best possible data.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Real-time sync with CRM systems",
                    "Automated email list updates",
                    "Marketing automation integration", 
                    "Sales tool data enhancement",
                    "Custom API endpoints",
                    "Webhook notifications"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore Integrations
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6"
              >
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-2">Integration Dashboard</h3>
                  <div className="text-gray-400 text-sm">Active workflows and sync status</div>
                </div>

                <div className="space-y-4">
                  {[
                    { workflow: "CRM Contact Sync", status: "Active", frequency: "Real-time" },
                    { workflow: "Email List Updates", status: "Active", frequency: "Daily" },
                    { workflow: "Lead Score Refresh", status: "Running", frequency: "Hourly" },
                    { workflow: "Data Quality Reports", status: "Scheduled", frequency: "Weekly" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="text-gray-300 text-sm">{item.workflow}</div>
                        <div className="text-gray-500 text-xs">{item.frequency}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          item.status === 'Active' ? 'bg-green-400' : 
                          item.status === 'Running' ? 'bg-blue-400' : 'bg-yellow-400'
                        }`}></div>
                        <span className="text-xs text-gray-400">{item.status}</span>
                      </div>
                    </div>
                  ))}
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
              <Globe className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Consolidate Your Contact Data?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Stop managing multiple data sources manually. Let our AI Aggregator platform create 
                a unified, high-quality contact database that powers better sales and marketing results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Aggregate Your Contact Data - Start Free Trial
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
