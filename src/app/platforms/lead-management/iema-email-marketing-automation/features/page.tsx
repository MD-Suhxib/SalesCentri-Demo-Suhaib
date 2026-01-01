'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, BarChart3, Target, Zap, Users, CheckCircle, ArrowRight, Shield, Clock, TrendingUp } from 'lucide-react';

export default function IEMAFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/iema-email-marketing-automation';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Content Generation',
      description: 'Advanced AI creates personalized email content based on subscriber behavior, preferences, and engagement history.',
      benefits: ['Dynamic subject lines', 'Personalized messaging', 'Content optimization', 'Language adaptation']
    },
    {
      icon: Target,
      title: 'Behavioral Triggers',
      description: 'Intelligent automation that responds to subscriber actions in real-time with relevant follow-up sequences.',
      benefits: ['Website activity triggers', 'Email engagement based', 'Purchase behavior', 'Abandonment recovery']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and analytics to track performance, identify trends, and optimize campaigns.',
      benefits: ['Real-time reporting', 'Conversion tracking', 'ROI attribution', 'Predictive insights']
    },
    {
      icon: Users,
      title: 'Audience Segmentation',
      description: 'AI-powered segmentation that automatically groups subscribers based on behavior, demographics, and preferences.',
      benefits: ['Dynamic segments', 'Behavioral grouping', 'Predictive modeling', 'Custom criteria']
    },
    {
      icon: Clock,
      title: 'Send-Time Optimization',
      description: 'Machine learning algorithms determine the optimal send time for each individual subscriber.',
      benefits: ['Individual optimization', 'Time zone awareness', 'Engagement prediction', 'Performance tracking']
    },
    {
      icon: Shield,
      title: 'Deliverability Management',
      description: 'Advanced techniques and monitoring to ensure your emails reach the inbox with high deliverability rates.',
      benefits: ['Spam filter avoidance', 'Reputation monitoring', 'Authentication setup', 'Deliverability scoring']
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
                      ? 'text-purple-400 border-b-2 border-purple-400'
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
              iEMA Advanced Features
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Discover the powerful AI-driven features that make iEMA the most advanced email marketing automation platform. 
              Every feature is designed to maximize engagement and drive conversions.
            </p>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                  
                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Workflow Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Complete Automation Workflow</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how iEMA&apos;s features work together to create a seamless, automated email marketing experience 
                that nurtures leads and drives conversions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'AI Analysis',
                  description: 'iEMA analyzes subscriber behavior, preferences, and engagement patterns to create detailed profiles.',
                  icon: Brain
                },
                {
                  step: '02',
                  title: 'Smart Segmentation',
                  description: 'Automatically segments audiences based on AI insights and creates personalized campaign strategies.',
                  icon: Users
                },
                {
                  step: '03',
                  title: 'Automated Delivery',
                  description: 'Delivers personalized content at optimal times with advanced deliverability and performance tracking.',
                  icon: Zap
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-purple-400 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Performance Metrics */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Proven Performance Results</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our advanced features deliver measurable results that transform your email marketing ROI.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { metric: '340%', label: 'Higher Response Rates', icon: TrendingUp },
                { metric: '99.5%', label: 'Email Deliverability', icon: Shield },
                { metric: '65%', label: 'Better Conversions', icon: Target },
                { metric: '250%', label: 'ROI Improvement', icon: BarChart3 }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.metric}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience iEMA&apos;s Advanced Features
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Ready to transform your email marketing with AI-powered automation? Start your free trial and see 
              the difference advanced features make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
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
