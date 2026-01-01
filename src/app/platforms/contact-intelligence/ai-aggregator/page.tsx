'use client';

import { motion } from 'framer-motion';
import { Database, Zap, Globe, CheckCircle, ArrowRight, Workflow } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AIAggregatorPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/ai-aggregator', active: pathname === '/platforms/contact-intelligence/ai-aggregator' },
    { name: 'Features', href: '/platforms/contact-intelligence/ai-aggregator/features', active: false },
    { name: 'Integrations', href: '/platforms/contact-intelligence/ai-aggregator/integrations', active: false },
    { name: 'Pricing', href: '/platforms/contact-intelligence/ai-aggregator/pricing', active: false }
  ];

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
    "Government Databases"
  ];

  const platforms = [
    "Salesforce", "HubSpot", "Marketo", "Pardot", 
    "LinkedIn", "ZoomInfo", "Apollo", "Clearbit"
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
        <section className="pt-20 pb-20 relative overflow-hidden">
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
                <Link href="/get-started/free-trial">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Free Trial - Aggregate Your Data
                  </motion.button>
                </Link>
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
                  {dataSources.map((source, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{source}</span>
                    </div>
                  ))}
                </div>

                <Link href="/platforms/contact-intelligence/ai-aggregator/integrations">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>View All Data Sources</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
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

        {/* Platform Integrations */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Popular Platform Integrations</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Seamlessly integrate with your favorite platforms and tools. Real-time data sync 
                keeps everything up-to-date across your entire tech stack.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {platforms.map((platform, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="text-gray-300 font-medium">{platform}</div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/platforms/contact-intelligence/ai-aggregator/features">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Explore All Features</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
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
                <Link href="/get-started/free-trial">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Free Trial - Aggregate Data Now
                  </motion.button>
                </Link>
                <Link href="/platforms/contact-intelligence/ai-aggregator/pricing">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Pricing Options
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
