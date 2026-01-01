'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Headphones, Music, TrendingUp, ArrowRight, CheckCircle, BarChart3, Clock, Users, Target, Activity, Shield, Mic, Zap } from 'lucide-react';

export default function SalesTunePage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/sales-tune';

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
                  <Music className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                  Sales Tune
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Real-Time Voice Coaching &amp; Call Analytics
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Enhance your sales team performance with AI-powered real-time voice coaching, conversation analysis, 
                and actionable insights. Sales Tune listens to your calls, provides instant coaching prompts, 
                and delivers comprehensive analytics to improve conversion rates and close more deals.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: TrendingUp, label: "Conversion Increase", value: "34%" },
                { icon: Clock, label: "Coaching Response", value: "<1s" },
                { icon: Target, label: "Call Analysis", value: "100%" },
                { icon: BarChart3, label: "Performance Lift", value: "45%" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Core Capabilities Overview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Real-Time Coaching */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Real-Time Coaching</h3>
                <ul className="space-y-4">
                  {[
                    'Live call monitoring',
                    'Instant coaching prompts',
                    'Objection handling cues',
                    'Talk ratio optimization',
                    'Sentiment detection alerts',
                    'Next-best-action guidance'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Voice Analytics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Voice Analytics</h3>
                <ul className="space-y-4">
                  {[
                    'Conversation transcription',
                    'Sentiment analysis',
                    'Keywords &amp; phrases tracking',
                    'Talk time analytics',
                    'Performance scoring',
                    'Trend identification'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Performance Intelligence */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Performance Intelligence</h3>
                <ul className="space-y-4">
                  {[
                    'Individual performance tracking',
                    'Team performance comparisons',
                    'Goal achievement metrics',
                    'Training recommendations',
                    'Success pattern analysis',
                    'ROI measurement'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Sales Tune?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transform your sales team performance with AI-powered voice coaching that provides real-time guidance 
                and comprehensive analytics to maximize every sales conversation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Instant Performance Improvement',
                  description: 'See immediate improvements in sales conversations with real-time coaching prompts and guidance.',
                  icon: Zap
                },
                {
                  title: 'Data-Driven Insights',
                  description: 'Make decisions based on comprehensive voice analytics and conversation intelligence data.',
                  icon: BarChart3
                },
                {
                  title: 'Consistent Training',
                  description: 'Ensure every sales rep receives the same high-quality coaching on every call.',
                  icon: Target
                },
                {
                  title: 'Scalable Coaching',
                  description: 'Provide personalized coaching to unlimited sales reps without additional management overhead.',
                  icon: TrendingUp
                },
                {
                  title: 'Call Quality Assurance',
                  description: 'Monitor and maintain high standards across all sales conversations with automated quality checks.',
                  icon: Shield
                },
                {
                  title: 'Performance Optimization',
                  description: 'Optimize sales processes based on successful conversation patterns and proven techniques.',
                  icon: Activity
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Sales Tune Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                From call connection to post-call analysis, Sales Tune provides comprehensive voice coaching 
                and analytics to enhance every aspect of your sales conversations.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Connect &amp; Monitor',
                  description: 'Sales Tune connects to your phone system and begins monitoring sales calls in real-time with advanced voice recognition.',
                  icon: Headphones
                },
                {
                  step: '02',
                  title: 'Analyze &amp; Coach',
                  description: 'AI analyzes conversation flow and provides instant coaching prompts to sales reps during live calls.',
                  icon: Mic
                },
                {
                  step: '03',
                  title: 'Track &amp; Score',
                  description: 'Every conversation is scored based on best practices, objection handling, and successful sales techniques.',
                  icon: BarChart3
                },
                {
                  step: '04',
                  title: 'Improve &amp; Optimize',
                  description: 'Detailed post-call analytics and recommendations help sales reps continuously improve their performance.',
                  icon: TrendingUp
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-blue-400 mb-4">{step.step}</div>
                  <h3 className="text-xl font-bold mb-4 text-white" dangerouslySetInnerHTML={{ __html: step.title }}></h3>
                  <p className="text-gray-300">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Use Cases */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Sales Tune Use Cases</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how sales teams across industries use Sales Tune to improve conversation quality and drive better results.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'New Sales Rep Training',
                  description: 'Accelerate new hire onboarding with real-time coaching that teaches best practices during actual sales calls.',
                  icon: Users,
                  features: ['Live coaching prompts', 'Best practice guidance', 'Objection handling help', 'Performance tracking']
                },
                {
                  title: 'Sales Team Optimization',
                  description: 'Improve overall team performance by identifying successful patterns and replicating them across all reps.',
                  icon: TrendingUp,
                  features: ['Team performance analytics', 'Success pattern analysis', 'Skill gap identification', 'Training recommendations']
                },
                {
                  title: 'Call Quality Assurance',
                  description: 'Maintain consistent call quality standards with automated monitoring and scoring of every sales conversation.',
                  icon: Shield,
                  features: ['Automated call scoring', 'Quality benchmarking', 'Compliance monitoring', 'Performance alerts']
                },
                {
                  title: 'Revenue Optimization',
                  description: 'Maximize revenue potential by coaching reps on upselling, cross-selling, and closing techniques during calls.',
                  icon: Target,
                  features: ['Upsell opportunity alerts', 'Closing technique coaching', 'Revenue impact tracking', 'Deal progression insights']
                }
              ].map((useCase, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                      <useCase.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-gray-300">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Performance Metrics */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Performance Impact</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Sales Tune delivers measurable improvements in sales performance through real-time coaching and data-driven insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Conversion Rate',
                  description: 'Average increase in call-to-close conversion rates',
                  value: '+34%',
                  icon: Target
                },
                {
                  title: 'Talk Time Optimization',
                  description: 'Improvement in optimal talk-to-listen ratio',
                  value: '+28%',
                  icon: Clock
                },
                {
                  title: 'Objection Handling',
                  description: 'Better objection handling success rate',
                  value: '+42%',
                  icon: Shield
                },
                {
                  title: 'Deal Size',
                  description: 'Average increase in deal value closed',
                  value: '+19%',
                  icon: TrendingUp
                }
              ].map((metric, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <h3 className="text-lg font-bold mb-3 text-white">{metric.title}</h3>
                  <p className="text-gray-300 text-sm">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Tune Up Your Sales Performance?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your sales conversations with AI-powered real-time coaching and analytics. 
              Help your team close more deals and achieve consistent peak performance on every call.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Book Live Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
