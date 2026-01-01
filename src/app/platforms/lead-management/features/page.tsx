'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Mail, Target, Database, TrendingUp, CheckCircle, Zap, 
  BarChart3, Brain, Shield, Globe
} from 'lucide-react';

export default function LeadManagementFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const featureCategories = [
    {
      title: 'AI-Powered Intelligence',
      description: 'Advanced artificial intelligence that learns and adapts to your business needs',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Machine Learning Lead Scoring',
        'Predictive Analytics',
        'Behavioral Pattern Recognition',
        'Intelligent Personalization',
        'Automated Decision Making',
        'Smart Content Recommendations'
      ]
    },
    {
      title: 'Multi-Channel Lead Capture',
      description: 'Capture leads from every touchpoint across your digital ecosystem',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Website Visitor Identification',
        'Social Media Lead Generation',
        'Email Campaign Integration',
        'Chat Bot Lead Capture',
        'WhatsApp Business Integration',
        'Voice AI Agent Collection'
      ]
    },
    {
      title: 'Automated Workflows',
      description: 'Streamline your lead management with intelligent automation',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Automated Lead Routing',
        'Smart Nurturing Sequences',
        'Trigger-Based Actions',
        'Multi-Touch Campaigns',
        'Follow-up Automation',
        'Lead Lifecycle Management'
      ]
    },
    {
      title: 'Real-Time Analytics',
      description: 'Monitor and optimize your lead generation performance in real-time',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Live Performance Dashboards',
        'Conversion Tracking',
        'ROI Measurement',
        'A/B Testing Analytics',
        'Predictive Insights',
        'Custom Reporting'
      ]
    },
    {
      title: 'Advanced Targeting',
      description: 'Reach the right prospects with precision targeting capabilities',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Intent-Based Targeting',
        'Demographic Segmentation',
        'Behavioral Profiling',
        'Account-Based Marketing',
        'Lookalike Audience Creation',
        'Geographic Targeting'
      ]
    },
    {
      title: 'Security & Compliance',
      description: 'Enterprise-grade security and compliance for your data',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      features: [
        'GDPR Compliance',
        'SOC 2 Type II Certified',
        'End-to-End Encryption',
        'Data Privacy Controls',
        'Audit Trails',
        'Secure API Access'
      ]
    }
  ];

  const platformFeatures = [
    {
      title: 'iEMA Email Marketing Automation',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      link: '/platforms/lead-management/iema-email-marketing-automation',
      highlights: [
        'AI-powered email personalization',
        'Behavioral trigger automation',
        'Advanced deliverability optimization',
        'Comprehensive ROI analytics'
      ]
    },
    {
      title: 'Lead Generation Platform',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      link: '/platforms/lead-management/lead-generation',
      highlights: [
        'AI prospect identification',
        'Intent data analysis',
        'Multi-channel lead capture',
        'Automated qualification'
      ]
    },
    {
      title: 'Lead Stream',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      link: '/platforms/lead-management/lead-stream',
      highlights: [
        'Real-time visitor identification',
        'Behavioral tracking',
        'Instant lead alerts',
        'Intent scoring'
      ]
    },
    {
      title: 'iLMS Lead Management System',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      link: '/platforms/lead-management/ilms-lead-management-system',
      highlights: [
        'Automated lead scoring',
        'Smart routing algorithms',
        'Nurturing workflows',
        'CRM integration'
      ]
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
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
              Lead Management Features
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover the comprehensive suite of AI-powered features that transform how you capture, 
              nurture, and convert leads across every channel.
            </p>
          </div>
        </motion.section>

        {/* Feature Categories */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featureCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{category.title}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{category.description}</p>
                  <ul className="space-y-3">
                    {category.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="py-16 px-6 bg-gray-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Platform-Specific Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Each platform in our lead management suite offers specialized features 
                designed for specific use cases and business needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {platformFeatures.map((platform, index) => (
                <motion.div
                  key={platform.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center mr-4`}>
                      <platform.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{platform.title}</h3>
                  </div>
                  
                                     <ul className="space-y-3">
                     {platform.highlights.map((highlight) => (
                       <li key={highlight} className="flex items-start space-x-3">
                         <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                         <span className="text-gray-300">{highlight}</span>
                       </li>
                     ))}
                   </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-blue-900/50 to-blue-900/50 border border-blue-500/30 rounded-2xl p-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-white">
                Ready to Transform Your Lead Management?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Start with a free trial and see how our AI-powered features can revolutionize your lead generation and management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/get-started/free-trial"
                  className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-600 transition-all duration-300"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/get-started/book-demo"
                  className="border border-blue-500 text-blue-400 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300"
                >
                  Book Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
