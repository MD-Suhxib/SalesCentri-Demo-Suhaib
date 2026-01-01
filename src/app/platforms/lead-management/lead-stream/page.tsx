'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, Zap, Users, BarChart3, ArrowRight, CheckCircle, Target, Clock, Bell, TrendingUp, Globe, Shield, Activity, MousePointer } from 'lucide-react';

export default function LeadStreamPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/lead-stream';

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
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-6">
                  <Activity className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-white to-blue-400 bg-clip-text text-transparent">
                  Lead Stream
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Real-time Website Visitor Intelligence &amp; Lead Streaming
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                98% of website visitors leave without converting, and you never know who they are or why they came. 
                Lead Stream reveals the identity of anonymous visitors, tracks their behavior in real-time, and sends 
                instant alerts when high-value prospects show buying intent—turning invisible traffic into actionable sales opportunities.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Eye, label: "Visitor Identification", value: "35%" },
                { icon: Clock, label: "Real-time Alerts", value: "<30s" },
                { icon: Target, label: "Intent Accuracy", value: "92%" },
                { icon: TrendingUp, label: "Conversion Lift", value: "180%" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-green-400" />
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
              {/* Visitor Identification */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Visitor Identification</h3>
                <ul className="space-y-4">
                  {[
                    'De-anonymize website visitors',
                    'Company and contact identification',
                    'IP intelligence and matching',
                    'Technographic data enrichment'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Behavioral Tracking */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <MousePointer className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Behavioral Tracking</h3>
                <ul className="space-y-4">
                  {[
                    'Page views and session tracking',
                    'Time spent and engagement metrics',
                    'Content consumption analysis',
                    'User journey mapping'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Real-time Alerts */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Real-time Alerts</h3>
                <ul className="space-y-4">
                  {[
                    'Instant visitor notifications',
                    'Intent-based trigger alerts',
                    'Multi-channel delivery options',
                    'Custom alert criteria'
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Lead Stream?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transform your website from a passive brochure into an active lead generation machine that 
                identifies and converts visitors in real-time.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Visitor De-anonymization',
                  description: 'Reveal the identity of 35% of your anonymous website visitors using advanced IP intelligence and data matching.',
                  icon: Eye
                },
                {
                  title: 'Real-time Intelligence',
                  description: 'Get instant insights into visitor behavior, interests, and buying intent as it happens on your website.',
                  icon: Activity
                },
                {
                  title: 'Intent Scoring',
                  description: 'AI-powered algorithms score visitor intent based on behavior patterns and engagement signals.',
                  icon: Target
                },
                {
                  title: 'Instant Notifications',
                  description: 'Receive real-time alerts via email, SMS, or Slack when high-value prospects visit your site.',
                  icon: Bell
                },
                {
                  title: 'Journey Mapping',
                  description: 'Visualize complete customer journeys from first visit to conversion with detailed analytics.',
                  icon: BarChart3
                },
                {
                  title: 'CRM Integration',
                  description: 'Automatically sync identified visitors and their behavior data with your existing CRM system.',
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
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-green-400" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Lead Stream Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our advanced tracking technology identifies visitors, analyzes their behavior, and delivers 
                actionable intelligence to your sales team in real-time.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Track &amp; Identify',
                  description: 'Advanced tracking code identifies visitors using IP intelligence, reverse DNS lookup, and behavioral fingerprinting.',
                  icon: Eye
                },
                {
                  step: '02',
                  title: 'Analyze &amp; Score',
                  description: 'AI algorithms analyze visitor behavior, engagement patterns, and intent signals to generate quality scores.',
                  icon: BarChart3
                },
                {
                  step: '03',
                  title: 'Alert &amp; Convert',
                  description: 'Real-time alerts notify your team of high-value prospects, enabling immediate outreach and conversion.',
                  icon: Bell
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-green-400 mb-4">{step.step}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Lead Stream Use Cases</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how different teams leverage Lead Stream to turn website traffic into qualified sales opportunities.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'Sales Team Intelligence',
                  description: 'Enable sales teams to identify and engage with prospects while they&apos;re actively researching.',
                  icon: Target,
                  features: ['Real-time prospect alerts', 'Account-based insights', 'Warm outreach opportunities', 'Competitive intelligence']
                },
                {
                  title: 'Marketing Attribution',
                  description: 'Understand which marketing channels and campaigns drive the highest-quality website visitors.',
                  icon: BarChart3,
                  features: ['Campaign attribution', 'Channel performance', 'Content effectiveness', 'ROI optimization']
                },
                {
                  title: 'Account-Based Marketing',
                  description: 'Track target account engagement and personalize experiences for key prospects.',
                  icon: Users,
                  features: ['Target account monitoring', 'Engagement scoring', 'Personalization triggers', 'Pipeline acceleration']
                },
                {
                  title: 'Customer Success',
                  description: 'Monitor existing customer behavior to identify expansion opportunities and churn risks.',
                  icon: Shield,
                  features: ['Customer health scoring', 'Expansion signals', 'Churn prediction', 'Renewal optimization']
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
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                      <useCase.icon className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-gray-300">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Technical Capabilities */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Technical Capabilities</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Advanced technology stack that delivers accurate visitor identification and real-time behavioral insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Identification Rate',
                  description: 'Industry-leading 35% visitor identification rate using proprietary data matching algorithms.',
                  value: '35%',
                  icon: Eye
                },
                {
                  title: 'Data Accuracy',
                  description: 'High-quality contact and company data with 95%+ accuracy and real-time verification.',
                  value: '95%',
                  icon: Shield
                },
                {
                  title: 'Real-time Processing',
                  description: 'Sub-30 second processing time from visitor action to alert delivery.',
                  value: '<30s',
                  icon: Clock
                },
                {
                  title: 'Global Coverage',
                  description: 'Worldwide visitor identification with region-specific data sources and compliance.',
                  value: '190+',
                  icon: Globe
                }
              ].map((capability, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <capability.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{capability.value}</div>
                  <h3 className="text-lg font-bold mb-3 text-white">{capability.title}</h3>
                  <p className="text-gray-300 text-sm">{capability.description}</p>
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
          className="py-20 bg-gradient-to-r from-green-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to See Who&apos;s Visiting Your Website?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Stop losing 98% of your website visitors. Start identifying and converting anonymous traffic into 
              qualified sales opportunities with Lead Stream&apos;s real-time visitor intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 group inline-flex items-center justify-center"
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
