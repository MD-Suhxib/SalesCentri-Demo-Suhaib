'use client';

import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, ArrowRight, Brain, Globe, Zap} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function IntelliBasePage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/intellibase', active: pathname === '/platforms/contact-intelligence/intellibase' },
    { name: 'Features', href: '/platforms/contact-intelligence/intellibase/features', active: pathname === '/platforms/contact-intelligence/intellibase/features' },
    { name: 'Integrations', href: '/platforms/contact-intelligence/intellibase/integrations', active: pathname === '/platforms/contact-intelligence/intellibase/integrations' },
    { name: 'Pricing', href: '/platforms/contact-intelligence/intellibase/pricing', active: pathname === '/platforms/contact-intelligence/intellibase/pricing' }
  ];

  const keyFeatures = [
    {
      icon: Brain,
      title: "Company Intelligence",
      description: "Deep company profiles with comprehensive data including financials, technology stack, employee insights, and growth indicators.",
      stats: "93M+ companies"
    },
    {
      icon: Zap,
      title: "Intent Data & Signals",
      description: "Real-time buyer intent signals and behavioral data to identify prospects actively researching your solutions.",
      stats: "Real-time signals"
    },
    {
      icon: Globe,
      title: "Market Intelligence",
      description: "Comprehensive market trends, competitive analysis, and industry insights to inform your sales strategy.",
      stats: "Global coverage"
    }
  ];

  const intelligenceTypes = [
    "Predictive Analytics & Forecasting",
    "Behavioral Insights & Patterns", 
    "Market Trends & Analysis",
    "Competitive Intelligence",
    "Customer Journey Mapping",
    "Revenue Attribution",
    "Risk Assessment",
    "Growth Opportunities"
  ];

  const platforms = [
    "Tableau", "Power BI", "Salesforce", "HubSpot", 
    "Marketo", "Looker", "Snowflake", "BigQuery"
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
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">IntelliBase Platform</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Comprehensive{' '}
                <span className="text-blue-400">B2B Intelligence</span>{' '}
                Database
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Unlock the power of predictive analytics with IntelliBase. Our advanced marketing intelligence 
                platform analyzes customer behavior patterns, market trends, and engagement data to provide 
                actionable insights that drive revenue growth.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Access B2B Intelligence Database - Free Trial
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
                  <div className="text-3xl font-bold text-blue-400 mb-2">92%</div>
                  <div className="text-gray-400">Prediction Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">50M+</div>
                  <div className="text-gray-400">Data Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">100+</div>
                  <div className="text-gray-400">Report Types</div>
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
              <h2 className="text-4xl font-bold text-white mb-6">Advanced Marketing Intelligence Platform</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transform data into actionable insights with comprehensive B2B intelligence and predictive 
                analytics that drive revenue growth and market success.
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
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
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

        {/* Intelligence Types Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Comprehensive Intelligence Types</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Access over 100 different types of business intelligence reports and analytics. 
                  Our platform processes 93M+ data points daily to provide the most comprehensive 
                  B2B intelligence available in the market.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {intelligenceTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{type}</span>
                    </div>
                  ))}
                </div>

                <Link href="/platforms/contact-intelligence/intellibase/features">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
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
                    <h3 className="text-white font-semibold">Intelligence Dashboard</h3>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Live Analytics</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { metric: "Customer Lifetime Value", value: "$12,847", trend: "+15%" },
                      { metric: "Lead Conversion Rate", value: "23.4%", trend: "+8%" },
                      { metric: "Market Share Analysis", value: "34.2%", trend: "+2%" },
                      { metric: "Churn Risk Score", value: "Low", trend: "-12%" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <div className="text-gray-300 text-sm">{item.metric}</div>
                          <div className="text-gray-500 text-xs">Trend: {item.trend}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">{item.value}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            item.trend.startsWith('+') ? 'bg-blue-400' : 
                            item.trend.startsWith('-') ? 'bg-blue-400' : 'bg-blue-400'
                          }`}></div>
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
              <h2 className="text-4xl font-bold text-white mb-6">Business Intelligence Integrations</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Seamlessly integrate with leading BI platforms, data warehouses, and analytics tools. 
                IntelliBase enhances your existing infrastructure with advanced intelligence capabilities.
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
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 text-center hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="text-gray-300 font-medium">{platform}</div>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/platforms/contact-intelligence/intellibase/integrations">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2 mx-auto"
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
              <TrendingUp className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Unlock Market Intelligence?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Transform your business with comprehensive B2B intelligence and predictive analytics. 
                Start making data-driven decisions that drive revenue growth and market success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Access B2B Intelligence Database - Free Trial
                  </motion.button>
                </Link>
                <Link href="/platforms/contact-intelligence/intellibase/pricing">
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
