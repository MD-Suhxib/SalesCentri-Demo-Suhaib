'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Target, Brain, Users, BarChart3, ArrowRight, CheckCircle, Zap, Globe, Search, TrendingUp, Database, Shield } from 'lucide-react';

export default function LeadGenerationPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/lead-generation';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
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
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-6">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
                  Lead Generation
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                AI-Powered Lead Generation That Delivers Results
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Traditional lead generation methods produce low-quality prospects that waste your sales team&apos;s time. 
                Our AI-powered lead generation platform identifies high-intent prospects, verifies their contact information, 
                and provides the intelligence you need to convert them into customers. Generate 5x more qualified leads 
                while reducing acquisition costs by 45%.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Target, label: "Lead Quality", value: "5x" },
                { icon: TrendingUp, label: "Conversion Rate", value: "300%" },
                { icon: Users, label: "Cost Reduction", value: "45%" },
                { icon: BarChart3, label: "ROI Increase", value: "250%" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Overview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Intelligent Prospect Identification */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Intelligent Prospect Identification</h3>
                <ul className="space-y-4">
                  {[
                    'AI-powered ideal customer profile matching',
                    'Intent data and buying signal detection',
                    'Lookalike audience discovery',
                    'Market penetration analysis'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Multi-Channel Lead Capture */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Multi-Channel Lead Capture</h3>
                <ul className="space-y-4">
                  {[
                    'Website visitor identification and tracking',
                    'Social media lead generation',
                    'Event and webinar prospect capture',
                    'Referral and partnership lead management'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Lead Qualification & Scoring */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Lead Qualification &amp; Scoring</h3>
                <ul className="space-y-4">
                  {[
                    'Automated lead scoring algorithms',
                    'BANT qualification framework',
                    'Predictive conversion modeling',
                    'Sales-ready lead prioritization'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Lead Generation Platform?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Stop wasting time on unqualified leads. Our AI-powered platform delivers high-quality prospects 
                that are ready to buy and convert into customers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'High-Quality Prospects',
                  description: 'AI algorithms identify prospects that match your ideal customer profile with 95% accuracy.',
                  icon: Target
                },
                {
                  title: 'Intent Data Integration',
                  description: 'Access real-time buying signals to identify prospects actively researching solutions.',
                  icon: TrendingUp
                },
                {
                  title: 'Contact Verification',
                  description: 'Every lead comes with verified contact information and detailed company intelligence.',
                  icon: Shield
                },
                {
                  title: 'Multi-Source Discovery',
                  description: 'Capture leads from websites, social media, events, and partner referrals in one platform.',
                  icon: Database
                },
                {
                  title: 'Automated Scoring',
                  description: 'Machine learning algorithms score leads based on conversion probability and readiness.',
                  icon: BarChart3
                },
                {
                  title: 'CRM Integration',
                  description: 'Seamlessly sync qualified leads with your CRM and sales tools for immediate follow-up.',
                  icon: Zap
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Process Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our AI-powered lead generation process identifies, qualifies, and delivers sales-ready prospects 
                in three simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'AI Discovery',
                  description: 'Our AI analyzes your ideal customer profile and identifies matching prospects across multiple data sources.',
                  icon: Search
                },
                {
                  step: '02',
                  title: 'Intent Analysis',
                  description: 'Machine learning algorithms analyze buying signals and behavioral data to score lead quality.',
                  icon: Brain
                },
                {
                  step: '03',
                  title: 'Qualified Delivery',
                  description: 'Verified, scored leads are delivered to your CRM with complete contact and company intelligence.',
                  icon: Target
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-blue-400 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-purple-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Generate More Qualified Leads?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Start generating 5x more qualified leads with our AI-powered lead generation platform. 
              Free trial includes 100 verified leads and full platform access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
