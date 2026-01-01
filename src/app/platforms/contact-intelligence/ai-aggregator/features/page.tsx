'use client';

import { motion } from 'framer-motion';
import { Database, Zap, Shield, Settings, BarChart3, Globe, CheckCircle, ArrowRight, Workflow, Users, Clock, Filter } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function AIAggregatorFeaturesPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/ai-aggregator', active: false },
    { name: 'Features', href: '/platforms/contact-intelligence/ai-aggregator/features', active: pathname === '/platforms/contact-intelligence/ai-aggregator/features' },
    { name: 'Integrations', href: '/platforms/contact-intelligence/ai-aggregator/integrations', active: false },
    { name: 'Pricing', href: '/platforms/contact-intelligence/ai-aggregator/pricing', active: false }
  ];

  const coreFeatures = [
    {
      icon: Database,
      title: "Multi-Source Data Aggregation",
      description: "Connect and consolidate data from 50+ sources including CRMs, databases, social platforms, and APIs into one unified database.",
      details: [
        "50+ pre-built connectors",
        "Custom API integrations", 
        "Real-time and batch processing",
        "Support for structured and unstructured data"
      ]
    },
    {
      icon: Zap,
      title: "AI-Powered Data Enhancement",
      description: "Advanced machine learning algorithms automatically clean, standardize, and enrich your contact data for maximum quality.",
      details: [
        "Duplicate detection and merging",
        "Data standardization and formatting",
        "Missing information inference",
        "Quality scoring and validation"
      ]
    },
    {
      icon: Workflow,
      title: "Automated Workflow Integration",
      description: "Seamlessly integrate enhanced data back into your existing tools and processes with real-time synchronization.",
      details: [
        "Real-time CRM synchronization", 
        "Marketing automation updates",
        "Custom webhook notifications",
        "API-first architecture"
      ]
    }
  ];

  const dataProcessingFeatures = [
    {
      title: "Smart Deduplication",
      description: "AI algorithms identify and merge duplicate records across different data sources using fuzzy matching.",
      icon: Filter,
      capabilities: [
        "Cross-source duplicate detection",
        "Fuzzy matching algorithms",
        "Confidence scoring",
        "Manual review interface"
      ]
    },
    {
      title: "Data Standardization", 
      description: "Automatically standardize contact information formats, phone numbers, addresses, and company names.",
      icon: Settings,
      capabilities: [
        "Phone number formatting",
        "Address normalization", 
        "Company name standardization",
        "Email validation and formatting"
      ]
    },
    {
      title: "Enrichment Engine",
      description: "Enhance existing records with additional data points from premium databases and public sources.",
      icon: BarChart3,
      capabilities: [
        "Social media profiles",
        "Company information",
        "Job titles and roles",
        "Contact preferences"
      ]
    },
    {
      title: "Quality Monitoring",
      description: "Continuous monitoring and scoring of data quality with automated alerts for data degradation.",
      icon: Shield,
      capabilities: [
        "Real-time quality metrics",
        "Data completeness scoring",
        "Accuracy validation",
        "Automated quality reports"
      ]
    }
  ];

  const integrationFeatures = [
    {
      category: "CRM Integration",
      description: "Seamless bi-directional sync with major CRM platforms",
      integrations: [
        "Salesforce",
        "HubSpot", 
        "Pipedrive",
        "Microsoft Dynamics",
        "Zoho CRM",
        "Custom CRMs"
      ]
    },
    {
      category: "Marketing Platforms",
      description: "Real-time data sync with email and marketing automation tools",
      integrations: [
        "Marketo",
        "Pardot",
        "Mailchimp",
        "Constant Contact",
        "Campaign Monitor",
        "Custom Marketing Tools"
      ]
    },
    {
      category: "Data Sources",
      description: "Extract data from diverse business and social platforms",
      integrations: [
        "LinkedIn Sales Navigator",
        "ZoomInfo",
        "Apollo",
        "Hunter.io",
        "Clearbit",
        "Company Websites"
      ]
    },
    {
      category: "Business Intelligence",
      description: "Connect enhanced data to analytics and reporting tools",
      integrations: [
        "Tableau",
        "Power BI",
        "Looker",
        "Google Analytics",
        "Custom Dashboards",
        "API Endpoints"
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: Clock,
      title: "Real-Time Processing",
      description: "Process and enhance data in real-time as it flows through your systems",
      benefits: [
        "Instant data availability",
        "Live quality monitoring",
        "Immediate sync to destinations",
        "Real-time alerts and notifications"
      ]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built-in tools for team collaboration on data quality and management",
      benefits: [
        "Shared data quality dashboards",
        "Collaborative record review",
        "Team assignment and workflows", 
        "Activity logs and audit trails"
      ]
    },
    {
      icon: Globe,
      title: "Enterprise Security",
      description: "Enterprise-grade security and compliance features for sensitive contact data",
      benefits: [
        "SOC 2 Type II compliance",
        "GDPR and CCPA compliance",
        "End-to-end encryption",
        "Role-based access controls"
      ]
    }
  ];

  const analyticsFeatures = [
    {
      metric: "Data Quality Score",
      description: "Overall quality rating of your aggregated database",
      value: "98.5%"
    },
    {
      metric: "Duplicate Records Removed", 
      description: "Number of duplicate records identified and merged",
      value: "15,847"
    },
    {
      metric: "Data Sources Connected",
      description: "Active data source integrations feeding the platform",
      value: "23"
    },
    {
      metric: "Records Enhanced",
      description: "Contact records that have been AI-enhanced with additional data",
      value: "142,593"
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
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">AI Aggregator Features</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Advanced{' '}
                <span className="text-blue-400">Data Aggregation</span>{' '}
                Features
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Discover the powerful features that make our AI Aggregator the most comprehensive 
                contact data consolidation platform available. From intelligent deduplication to 
                real-time enhancement, every feature is designed to maximize data quality and usability.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Core Platform Features</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our three pillar features work together to create the most comprehensive contact 
                database possible from your existing data sources.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mb-6" />
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{feature.description}</p>
                  
                  <div className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Processing Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">AI-Powered Data Processing</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Advanced machine learning algorithms handle the complex task of cleaning, 
                standardizing, and enhancing your contact data automatically.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {dataProcessingFeatures.map((feature, index) => (
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
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  </div>
                  
                  <p className="text-gray-400 mb-6">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Features */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Comprehensive Integrations</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connect with all your existing tools and platforms to create a seamless 
                data flow throughout your entire tech stack.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {integrationFeatures.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <h3 className="text-lg font-bold text-white mb-3">{category.category}</h3>
                  <p className="text-gray-400 text-sm mb-6">{category.description}</p>
                  
                  <div className="space-y-2">
                    {category.integrations.map((integration, intIndex) => (
                      <div key={intIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{integration}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Enterprise-Grade Features</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Advanced capabilities designed for large-scale operations with enterprise 
                security, compliance, and collaboration requirements.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {advancedFeatures.map((feature, index) => (
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
                  <p className="text-gray-400 mb-6">{feature.description}</p>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics Dashboard */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Real-Time Analytics & Monitoring</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Monitor your data quality, processing status, and integration health in real-time 
                  with comprehensive analytics dashboards and automated reporting.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Real-time data quality metrics",
                    "Processing status monitoring",
                    "Integration health checks",
                    "Custom dashboard creation",
                    "Automated quality reports",
                    "Alert and notification system"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View Demo Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
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
                  <h3 className="text-white font-semibold mb-2">Platform Analytics</h3>
                  <div className="text-gray-400 text-sm">Live data quality metrics</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {analyticsFeatures.map((metric, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{metric.value}</div>
                      <div className="text-gray-300 text-sm font-medium mb-1">{metric.metric}</div>
                      <div className="text-gray-500 text-xs">{metric.description}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm">Processing Status</span>
                    <span className="text-green-400 text-sm">Active</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                  </div>
                  <div className="text-gray-500 text-xs mt-1">87% of today&apos;s records processed</div>
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
              <Database className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Experience All Features with a Free Trial
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                See how our comprehensive feature set can transform your contact data management. 
                Start your free trial today and experience the power of AI-driven data aggregation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started/free-trial">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Start Free Trial - Access All Features
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
