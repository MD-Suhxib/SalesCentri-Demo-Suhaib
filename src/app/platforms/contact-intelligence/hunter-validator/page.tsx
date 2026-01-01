'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, Globe, BarChart3, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HunterValidatorPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/hunter-validator', active: pathname === '/platforms/contact-intelligence/hunter-validator' },
    { name: 'Features', href: '/platforms/contact-intelligence/hunter-validator/features', active: false },
    { name: 'Integrations', href: '/platforms/contact-intelligence/hunter-validator/integrations', active: false },
    { name: 'Pricing', href: '/platforms/contact-intelligence/hunter-validator/pricing', active: false }
  ];

  const keyFeatures = [
    {
      icon: Shield,
      title: "Email Verification",
      description: "Verify email addresses in real-time with 99.9% accuracy using advanced validation algorithms.",
      stats: "99.9% accuracy"
    },
    {
      icon: Zap,
      title: "Bulk Processing",
      description: "Process thousands of email addresses simultaneously with lightning-fast validation speeds.",
      stats: "10K emails/min"
    },
    {
      icon: BarChart3,
      title: "Deliverability Insights",
      description: "Get detailed insights into email deliverability, bounce rates, and sender reputation.",
      stats: "Real-time analytics"
    }
  ];

  const validationTypes = [
    "Syntax validation",
    "Domain verification", 
    "MX record checking",
    "SMTP validation",
    "Disposable email detection",
    "Role-based email identification",
    "Catch-all detection",
    "Gibberish detection"
  ];

  const platforms = [
    "Salesforce", "HubSpot", "Mailchimp", "Constant Contact", 
    "Campaign Monitor", "ActiveCampaign", "Pipedrive", "Zoho CRM"
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
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Hunter Validator Platform</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Advanced{' '}
                <span className="text-blue-400">Email Validation</span>{' '}
                Platform
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Ensure maximum email deliverability with our industry-leading email validation platform. 
                Verify emails in real-time, reduce bounce rates, and protect your sender reputation 
                with 99.9% accuracy validation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Validate Your Emails - Start Free Trial
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
                  <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                  <div className="text-gray-400">Validation Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">10K+</div>
                  <div className="text-gray-400">Emails Per Minute</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                  <div className="text-gray-400">Platform Integrations</div>
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
              <h2 className="text-4xl font-bold text-white mb-6">Real-Time Email Validation</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our advanced validation engine performs comprehensive checks to ensure every email 
                address in your database is valid, deliverable, and safe to contact.
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

        {/* Validation Types */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-white mb-6">Comprehensive Validation Types</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Our platform performs multiple validation checks on every email address to ensure 
                  maximum accuracy and deliverability. From syntax validation to SMTP verification, 
                  we cover all aspects of email validation.
                </p>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {validationTypes.map((type, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <span className="text-gray-300">{type}</span>
                    </div>
                  ))}
                </div>

                <Link href="/platforms/contact-intelligence/hunter-validator/features">
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
                    <h3 className="text-white font-semibold">Validation Results</h3>
                    <div className="flex items-center space-x-2 text-blue-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Live Validation</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { email: "john.doe@company.com", status: "Valid", confidence: "99%" },
                      { email: "invalid@fakeemail.xyz", status: "Invalid", confidence: "100%" },
                      { email: "admin@company.com", status: "Role-based", confidence: "95%" },
                      { email: "test@tempmail.org", status: "Disposable", confidence: "100%" }
                    ].map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div>
                          <div className="text-gray-300 text-sm font-mono">{result.email}</div>
                          <div className="text-gray-500 text-xs">Confidence: {result.confidence}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            result.status === 'Valid' ? 'bg-blue-400' : 
                            result.status === 'Invalid' ? 'bg-blue-400' : 
                            result.status === 'Disposable' ? 'bg-blue-400' : 'bg-blue-400'
                          }`}></div>
                          <span className="text-xs text-gray-400">{result.status}</span>
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
                Integrate with your favorite email marketing platforms, CRMs, and tools. 
                Validate emails directly within your existing workflows.
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
              <Link href="/platforms/contact-intelligence/hunter-validator/integrations">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>View All Integrations</span>
                  <ExternalLink className="w-5 h-5" />
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
                Ready to Improve Your Email Deliverability?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Start validating your email lists today and see immediate improvements in your 
                email campaign performance and sender reputation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Validate Your Emails - Start Free Trial
                  </motion.button>
                </Link>
                <Link href="/platforms/contact-intelligence/hunter-validator/pricing">
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
