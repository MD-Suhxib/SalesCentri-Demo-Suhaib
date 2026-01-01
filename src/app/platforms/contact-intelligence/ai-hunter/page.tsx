'use client';

import { motion } from 'framer-motion';
import { Search, Target, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function AIHunterPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/ai-hunter', active: pathname === '/platforms/contact-intelligence/ai-hunter' },
    { name: 'Features', href: '/platforms/contact-intelligence/ai-hunter/features', active: pathname === '/platforms/contact-intelligence/ai-hunter/features' },
    { name: 'Integrations', href: '/platforms/contact-intelligence/ai-hunter/integrations', active: pathname === '/platforms/contact-intelligence/ai-hunter/integrations' },
    { name: 'Pricing', href: '/platforms/contact-intelligence/ai-hunter/pricing', active: pathname === '/platforms/contact-intelligence/ai-hunter/pricing' }
  ];

  const keyFeatures = [
    {
      icon: Search,
      title: "AI-Powered Contact Finding",
      description: "Advanced algorithms identify and verify high-quality prospects across multiple data sources with 95% accuracy.",
      stats: "95% accuracy"
    },
    {
      icon: Target,
      title: "Targeting & Personalization",
      description: "Smart targeting algorithms and personalization features that adapt to your specific market and customer profile.",
      stats: "Smart targeting"
    },
    {
      icon: Shield,
      title: "Quality & Compliance",
      description: "Ensure data quality and regulatory compliance with built-in validation and GDPR-compliant processes.",
      stats: "GDPR compliant"
    }
  ];

  const leadSources = [
    "B2B Database Networks",
    "Professional Social Platforms", 
    "Company Website Crawling",
    "Industry Directories",
    "Public Records & Databases",
    "Event & Conference Data",
    "News & Press Release Mining",
    "Patent & Filing Records"
  ];

  const platforms = [
    "Salesforce", "HubSpot", "Pipedrive", "Apollo", 
    "ZoomInfo", "LinkedIn Sales Navigator", "Outreach", "SalesLoft"
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
                <Search className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">AI Hunter Platform</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                AI Contact{' '}
                <span className="text-blue-400">Hunter</span>{' '}
                Platform
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Find Your Next Best Customers with AI-Powered Precision. Our intelligent lead sourcing 
                engine revolutionizes prospect discovery by leveraging advanced AI algorithms to identify, 
                filter, and validate high-quality leads across multiple data sources.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Hunting Better Prospects - Free Trial
                  </motion.button>
                </Link>
                <Link href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Watch Platform Demo
                  </motion.button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                  <div className="text-gray-400">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
                  <div className="text-gray-400">Data Sources</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                  <div className="text-gray-400">Daily Leads</div>
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
              <h2 className="text-4xl font-bold text-white mb-6">AI-Powered Contact Finding</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover and connect with your ideal prospects using cutting-edge artificial intelligence 
                and machine learning algorithms that adapt to your specific market and customer profile.
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

        {/* Lead Sources Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Comprehensive Lead Sources</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Access over 500 premium data sources to build the most complete prospect database 
                  possible. Our AI algorithms continuously scan and analyze data from multiple channels 
                  to identify high-quality leads that match your ideal customer profile.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {leadSources.map((source, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{source}</span>
                    </div>
                  ))}
                </div>

                <Link href="/platforms/contact-intelligence/ai-hunter/features">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Explore All Features</span>
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
                    <h3 className="text-white font-semibold">AI Hunter Dashboard</h3>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Live Hunting</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { source: "LinkedIn Sales Navigator", status: "Active", leads: "1,247" },
                      { source: "ZoomInfo Database", status: "Scanning", leads: "856" },
                      { source: "Company Websites", status: "Active", leads: "2,134" },
                      { source: "Industry Events", status: "Active", leads: "423" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <div className="text-gray-300 text-sm">{item.source}</div>
                          <div className="text-gray-500 text-xs">{item.leads} leads found</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'Active' ? 'bg-blue-400' : 
                            item.status === 'Scanning' ? 'bg-blue-400' : 'bg-blue-400'
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
              <h2 className="text-4xl font-bold text-white mb-6">Seamless Platform Integrations</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Integrate with your favorite CRM and sales platforms. AI Hunter seamlessly pushes 
                qualified leads directly into your existing workflows and sales processes.
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
              <Link href="/platforms/contact-intelligence/ai-hunter/integrations">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View All Integrations</span>
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
              <Search className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Find Your Next Best Customers?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Start using AI Hunter today and discover high-quality prospects that convert into customers. 
                Join thousands of sales teams already using our AI-powered lead discovery platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Hunting Better Prospects - Free Trial
                  </motion.button>
                </Link>
                <Link href="/platforms/contact-intelligence/ai-hunter/pricing">
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
