'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Clock, Users, Target, BarChart3, Zap, Shield } from 'lucide-react';

export default function FeatureTourPage() {
  const tourSections = [
    {
      id: 'ai-automation',
      title: 'AI-Powered Sales Automation',
      duration: '5 minutes',
      description: 'Discover how our AI handles lead qualification, outreach, and follow-ups automatically',
      features: ['Smart lead scoring', 'Automated email sequences', 'Response optimization'],
      icon: Zap,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'crm-integration',
      title: 'CRM & Platform Integrations',
      duration: '3 minutes',
      description: 'See seamless integration with your existing tools and workflows',
      features: ['Salesforce sync', 'HubSpot integration', 'Custom API connections'],
      icon: Target,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'analytics-reporting',
      title: 'Advanced Analytics & Reporting',
      duration: '4 minutes',
      description: 'Explore real-time dashboards and performance insights',
      features: ['ROI tracking', 'Conversion analytics', 'Team performance metrics'],
      icon: BarChart3,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'security-compliance',
      title: 'Security & Compliance',
      duration: '2 minutes',
      description: 'Learn about enterprise-grade security and compliance features',
      features: ['GDPR compliance', 'SOC 2 certification', 'Data encryption'],
      icon: Shield,
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Interactive <span className="text-blue-400">Feature Tour</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Take a guided tour through Sales Centri&apos;s powerful features. See how our AI-powered platform can transform your sales process in just 15 minutes.
              </p>
              
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 text-blue-400">
                  <Clock className="w-5 h-5" />
                  <span>15 minutes total</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Users className="w-5 h-5" />
                  <span>Interactive demo</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Tour Sections */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {tourSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`bg-gradient-to-r ${section.color} p-3 rounded-xl`}>
                      <section.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                      <p className="text-blue-400">{section.duration}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{section.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">You&apos;ll see:</h4>
                    <ul className="space-y-2">
                      {section.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="text-gray-300 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 w-full justify-center">
                    <Play className="w-5 h-5" />
                    Start This Section
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-cyan-700/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Start Your Tour?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Begin your interactive journey through Sales Centri&apos;s features and see the power of AI-driven sales automation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105">
                  <Play className="w-5 h-5" />
                  Start Feature Tour
                </button>
                <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300">
                  Back to Demo Options
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
