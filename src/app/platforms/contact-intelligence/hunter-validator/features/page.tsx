'use client';

import { motion } from 'framer-motion';
import { Search, Shield, Database, Zap, Target, CheckCircle, Settings, BarChart3, Clock, Filter, Download } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HunterValidatorFeaturesPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/hunter-validator', active: false },
    { name: 'Features', href: '/platforms/contact-intelligence/hunter-validator/features', active: pathname === '/platforms/contact-intelligence/hunter-validator/features' },
    { name: 'Integrations', href: '/platforms/contact-intelligence/hunter-validator/integrations', active: false },
    { name: 'Pricing', href: '/platforms/contact-intelligence/hunter-validator/pricing', active: false }
  ];

  const coreFeatures = [
    {
      icon: Search,
      title: "AI-Powered Contact Discovery",
      description: "Advanced search algorithms that discover contacts across multiple databases and social platforms.",
      features: [
        "Multi-source data aggregation",
        "Social media profile matching",
        "Company hierarchy mapping",
        "Role-based contact filtering",
        "Intent signal detection"
      ]
    },
    {
      icon: Shield,
      title: "Real-Time Email Validation",
      description: "Comprehensive email verification with multiple validation layers for maximum accuracy.",
      features: [
        "Syntax and format validation",
        "Domain and MX record verification",
        "Mailbox existence checking",
        "Role-based email detection",
        "Disposable email filtering"
      ]
    },
    {
      icon: Database,
      title: "Bulk Processing Engine",
      description: "Process thousands of contacts simultaneously with our high-performance validation system.",
      features: [
        "Batch upload processing",
        "CSV file import/export",
        "API rate optimization",
        "Progress tracking",
        "Error handling & retry logic"
      ]
    }
  ];

  const advancedFeatures = [
    {
      icon: Target,
      title: "Smart Lead Scoring",
      description: "AI-powered scoring based on contact quality, engagement potential, and company fit.",
      stats: "85% accuracy"
    },
    {
      icon: Filter,
      title: "Advanced Filtering",
      description: "Sophisticated filters for industry, company size, location, and contact attributes.",
      stats: "50+ filters"
    },
    {
      icon: BarChart3,
      title: "Quality Analytics",
      description: "Detailed insights into contact quality, validation results, and campaign performance.",
      stats: "Real-time"
    },
    {
      icon: Clock,
      title: "Speed Optimization",
      description: "Sub-second validation response times with global infrastructure deployment.",
      stats: "0.5s avg"
    },
    {
      icon: Settings,
      title: "Custom Workflows",
      description: "Configurable validation rules and automated workflows for your specific needs.",
      stats: "Unlimited"
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Multiple export formats with custom field mapping and scheduling options.",
      stats: "10+ formats"
    }
  ];

  const validationSteps = [
    {
      step: "1",
      title: "Syntax Validation",
      description: "Check email format and structure compliance with RFC standards",
      time: "0.1s"
    },
    {
      step: "2", 
      title: "Domain Verification",
      description: "Verify domain exists and has valid MX records for email delivery",
      time: "0.3s"
    },
    {
      step: "3",
      title: "Mailbox Check",
      description: "Confirm mailbox exists and can receive emails without bouncing",
      time: "0.8s"
    },
    {
      step: "4",
      title: "Risk Assessment", 
      description: "Analyze contact for spam traps, role emails, and deliverability risks",
      time: "1.2s"
    }
  ];

  const integrationCapabilities = [
    "REST API with 99.9% uptime",
    "Webhook notifications",
    "Real-time streaming",
    "Batch processing queues",
    "Custom validation rules",
    "White-label options"
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
                <Settings className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Platform Features</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Advanced{' '}
                <span className="text-blue-400">Contact Discovery</span>{' '}
                & Validation Features
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Discover the comprehensive feature set that makes our Hunter & Validator platform 
                the most accurate and efficient solution for contact discovery and verification.
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
                Three foundational capabilities that power accurate contact discovery and validation.
              </p>
            </motion.div>

            <div className="space-y-16">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
                >
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                    </div>
                    
                    <p className="text-lg text-gray-300 mb-8">{feature.description}</p>
                    
                    <div className="space-y-3">
                      {feature.features.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                          <span className="text-gray-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-semibold">Feature Demo</h4>
                        <div className="flex items-center space-x-2 text-blue-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Active</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {feature.features.slice(0, 3).map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                            <span className="text-gray-300 text-sm">{item}</span>
                            <span className="text-blue-400 text-xs">✓</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Features Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Advanced Capabilities</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Sophisticated features that set our platform apart from basic contact validation tools.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {advancedFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <feature.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                  <div className="text-blue-400 font-semibold">{feature.stats}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Validation Process */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">4-Step Validation Process</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our comprehensive validation process ensures maximum accuracy through multiple verification layers.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {validationSteps.map((step, index) => (
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
                    <div className="text-blue-400 font-semibold text-sm">{step.time}</div>
                  </div>
                  
                  {index < validationSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-blue-500"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Enterprise Integration</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Built for enterprise scale with robust APIs, webhook support, and custom integration options 
                  that fit seamlessly into your existing tech stack.
                </p>

                <div className="space-y-4 mb-8">
                  {integrationCapabilities.map((capability, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{capability}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View API Documentation
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
                  <h3 className="text-white font-semibold mb-2">API Response Example</h3>
                  <div className="text-gray-400 text-sm">POST /validate/bulk</div>
                </div>

                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm">
                  <div className="text-blue-400">{`{`}</div>
                  <div className="text-blue-400 ml-4">&quot;results&quot;: [</div>
                  <div className="ml-8">
                    <div className="text-blue-400">{`{`}</div>
                    <div className="text-blue-400 ml-4">&quot;email&quot;: &quot;john@company.com&quot;,</div>
                    <div className="text-blue-400 ml-4">&quot;status&quot;: &quot;valid&quot;,</div>
                    <div className="text-blue-400 ml-4">&quot;confidence&quot;: 98,</div>
                    <div className="text-blue-400 ml-4">&quot;deliverable&quot;: true</div>
                    <div className="text-blue-400">{`}`}</div>
                  </div>
                  <div className="text-blue-400 ml-4">],</div>
                  <div className="text-blue-400 ml-4">&quot;processed&quot;: 1000,</div>
                  <div className="text-blue-400 ml-4">&quot;valid&quot;: 950</div>
                  <div className="text-blue-400">{`}`}</div>
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
              <Zap className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Experience These Features in Action
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                See how our advanced contact discovery and validation features can transform 
                your lead generation and improve your sales pipeline quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try All Features Free
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
