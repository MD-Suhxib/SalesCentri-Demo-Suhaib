'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, CheckCircle, Globe, ArrowRight, Search } from 'lucide-react';

export default function HunterValidatorOverviewPage() {
  const keyFeatures = [
    {
      icon: Search,
      title: "Advanced Contact Finding",
      description: "Discover verified contacts across multiple databases with our AI-powered search engine.",
      stats: "390M+ contacts"
    },
    {
      icon: Shield,
      title: "Real-time Validation",
      description: "Verify contact accuracy instantly with 95% guaranteed accuracy rates.",
      stats: "95% accuracy"
    },
    {
      icon: Zap,
      title: "Quality Assurance",
      description: "Automated quality checks ensure only the highest quality contacts reach your pipeline.",
      stats: "99.8% deliverability"
    }
  ];

  const complianceFeatures = [
    "GDPR Compliant",
    "CCPA Compliant", 
    "SOC 2 Type II",
    "ISO 27001 Certified",
    "CAN-SPAM Compliant",
    "Data Processing Agreements"
  ];

  return (
    <>
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
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Hunter & Validator Platform</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Find & Verify Contacts with{' '}
                <span className="text-blue-400">95% Accuracy Guarantee</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Combined discovery and verification platform that helps you find the right contacts 
                and ensures they&apos;re accurate before they enter your sales pipeline. Reduce bounce rates, 
                improve deliverability, and focus on converting real prospects.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Verified Contacts Instantly - Start Free
                  </motion.button>
                </a>
                <a href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Watch Platform Demo
                  </motion.button>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                  <div className="text-gray-400">Accuracy Guarantee</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">390M+</div>
                  <div className="text-gray-400">Verified Contacts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">99.8%</div>
                  <div className="text-gray-400">Deliverability Rate</div>
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
              <h2 className="text-4xl font-bold text-white mb-6">Advanced Contact Finding</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover and verify contacts with our intelligent platform that combines multiple data sources 
                with real-time validation technology.
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

        {/* Real-time Validation Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Real-Time Validation</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Every contact goes through our multi-step verification process to ensure 95% accuracy 
                  before reaching your sales team. Reduce bounce rates and improve campaign performance.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Syntax validation & formatting",
                    "Domain verification & MX record check", 
                    "Mailbox existence confirmation",
                    "Role-based email detection",
                    "Disposable email filtering",
                    "Risk assessment scoring"
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Test Validation Accuracy</span>
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
                    <h3 className="text-white font-semibold">Validation Process</h3>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Live Demo</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { step: "Email Syntax Check", status: "✓ Valid", time: "0.1s" },
                      { step: "Domain Verification", status: "✓ Active", time: "0.3s" },
                      { step: "Mailbox Confirmation", status: "✓ Exists", time: "0.8s" },
                      { step: "Risk Assessment", status: "✓ Low Risk", time: "1.2s" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <span className="text-gray-300">{item.step}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-400 text-sm">{item.status}</span>
                          <span className="text-gray-500 text-xs">{item.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Quality Assurance Section */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Quality Assurance</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our comprehensive compliance and quality framework ensures data integrity and regulatory compliance 
                across all contact discovery and validation processes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {complianceFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-lg p-4 text-center hover:border-blue-500/30 transition-all duration-300"
                >
                  <Shield className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <span className="text-white font-medium">{feature}</span>
                </motion.div>
              ))}
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
                Ready to Find & Verify Your Next Best Customers?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of sales teams who have improved their contact quality and reduced bounce rates 
                with our Hunter & Validator platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Get Verified Contacts Instantly - Start Free
                  </motion.button>
                </a>
                <a href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Schedule Platform Demo
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
