'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, MousePointer, Bell, BarChart3, Zap, Target, Activity, Clock, Shield, Globe, Users, Brain, CheckCircle, TrendingUp, Filter, Bot, Smartphone, ArrowRight } from 'lucide-react';

export default function LeadStreamFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/lead-stream';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const featureCategories = [
    {
      title: 'Visitor Identification',
      icon: Eye,
      features: [
        {
          name: 'IP Intelligence &amp; Reverse DNS',
          description: 'Advanced IP lookup with reverse DNS resolution to identify company domains and locations',
          icon: Globe
        },
        {
          name: 'Company Data Enrichment',
          description: 'Automatically enrich identified companies with firmographic data, industry classification, and contact information',
          icon: Target
        },
        {
          name: 'Contact Discovery',
          description: 'Find decision-makers and relevant contacts within identified companies using role-based matching',
          icon: Users
        },
        {
          name: 'Technographic Profiling',
          description: 'Identify technology stack, tools, and platforms used by visiting companies for better targeting',
          icon: Bot
        }
      ]
    },
    {
      title: 'Behavioral Analytics',
      icon: MousePointer,
      features: [
        {
          name: 'Page View Tracking',
          description: 'Comprehensive tracking of all page visits with timestamps, duration, and navigation patterns',
          icon: Eye
        },
        {
          name: 'Engagement Scoring',
          description: 'AI-powered engagement scoring based on time spent, page depth, and interaction patterns',
          icon: TrendingUp
        },
        {
          name: 'Content Interest Analysis',
          description: 'Analyze which content pieces resonate most with visitors to understand their interests and needs',
          icon: BarChart3
        },
        {
          name: 'Session Recording',
          description: 'Optional session recordings to understand user experience and identify optimization opportunities',
          icon: Activity
        }
      ]
    },
    {
      title: 'Real-time Alerts',
      icon: Bell,
      features: [
        {
          name: 'Instant Notifications',
          description: 'Real-time alerts delivered within 30 seconds of visitor identification via multiple channels',
          icon: Clock
        },
        {
          name: 'Smart Filtering',
          description: 'Intelligent filtering to only alert on high-value prospects based on customizable criteria',
          icon: Filter
        },
        {
          name: 'Multi-channel Delivery',
          description: 'Receive alerts via email, SMS, Slack, Microsoft Teams, or webhook integrations',
          icon: Smartphone
        },
        {
          name: 'Alert Customization',
          description: 'Customize alert content, frequency, and recipients based on visitor attributes and behavior',
          icon: Brain
        }
      ]
    },
    {
      title: 'Intent Scoring',
      icon: Target,
      features: [
        {
          name: 'Buying Intent Signals',
          description: 'Identify visitors showing strong buying intent based on behavior patterns and page sequences',
          icon: TrendingUp
        },
        {
          name: 'Lead Quality Scoring',
          description: 'Automatic lead scoring based on company fit, engagement level, and behavioral indicators',
          icon: BarChart3
        },
        {
          name: 'Predictive Analytics',
          description: 'ML-powered predictions for conversion likelihood and optimal outreach timing',
          icon: Brain
        },
        {
          name: 'Custom Scoring Models',
          description: 'Build custom scoring models based on your specific criteria and historical conversion data',
          icon: Target
        }
      ]
    },
    {
      title: 'CRM Integration',
      icon: Zap,
      features: [
        {
          name: 'Automatic Lead Creation',
          description: 'Automatically create leads in your CRM when high-value visitors are identified',
          icon: Users
        },
        {
          name: 'Activity Logging',
          description: 'Log all visitor activities and behaviors directly into CRM contact records',
          icon: Activity
        },
        {
          name: 'Lead Enrichment',
          description: 'Enrich existing CRM records with visitor behavior data and engagement history',
          icon: Target
        },
        {
          name: 'Two-way Sync',
          description: 'Maintain bidirectional sync between Lead Stream data and your CRM system',
          icon: Zap
        }
      ]
    },
    {
      title: 'Analytics &amp; Reporting',
      icon: BarChart3,
      features: [
        {
          name: 'Visitor Analytics Dashboard',
          description: 'Comprehensive dashboard showing visitor trends, identification rates, and engagement metrics',
          icon: BarChart3
        },
        {
          name: 'Conversion Tracking',
          description: 'Track how identified visitors progress through your sales funnel and conversion rates',
          icon: TrendingUp
        },
        {
          name: 'ROI Reporting',
          description: 'Measure the revenue impact of identified visitors and calculate Lead Stream ROI',
          icon: Target
        },
        {
          name: 'Custom Reports',
          description: 'Create custom reports and dashboards tailored to your specific business metrics',
          icon: BarChart3
        }
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
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-white to-blue-400 bg-clip-text text-transparent">
                  Lead Stream Features
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Comprehensive visitor intelligence and real-time lead streaming capabilities that transform 
                anonymous website traffic into actionable sales opportunities.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { label: "Visitor ID Rate", value: "35%", icon: Eye },
                { label: "Alert Speed", value: "<30s", icon: Clock },
                { label: "Data Accuracy", value: "95%", icon: Shield },
                { label: "Global Coverage", value: "190+", icon: Globe }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Feature Categories */}
        {featureCategories.map((category, categoryIndex) => (
          <motion.section 
            key={categoryIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 * categoryIndex }}
            className={`py-20 ${categoryIndex % 2 === 1 ? 'bg-gray-900/50' : ''}`}
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold" dangerouslySetInnerHTML={{ __html: category.title }}></h2>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {category.features.map((feature, featureIndex) => (
                  <motion.div 
                    key={featureIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * featureIndex }}
                    className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/30"
                  >
                    <div className="flex items-start mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-3" dangerouslySetInnerHTML={{ __html: feature.name }}></h3>
                        <p className="text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}

        {/* Technical Specifications */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Technical Specifications</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade infrastructure and advanced technology stack powering accurate visitor identification.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Infrastructure */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Infrastructure</h3>
                <ul className="space-y-4">
                  {[
                    '99.9% uptime SLA guarantee',
                    'Global CDN for fast tracking',
                    'Real-time data processing',
                    'GDPR &amp; CCPA compliant',
                    'Enterprise security standards',
                    'Redundant backup systems'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: spec }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Data Sources */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Data Sources</h3>
                <ul className="space-y-4">
                  {[
                    '500M+ IP address database',
                    '93M+ company profiles',
                    '200M+ verified contacts',
                    'Real-time data verification',
                    'Multiple data partnerships',
                    'Continuous data enrichment'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{spec}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Integration Options */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Integration Options</h3>
                <ul className="space-y-4">
                  {[
                    'REST API &amp; webhooks',
                    'Native CRM integrations',
                    'Marketing automation sync',
                    'Custom integrations available',
                    'Real-time data streaming',
                    'Bulk data export options'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: spec }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Implementation Process */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Quick Implementation</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Get Lead Stream up and running in minutes with our simple tracking code and guided setup process.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Install Tracking Code',
                  description: 'Add a simple JavaScript snippet to your website header or use Google Tag Manager.',
                  icon: Brain
                },
                {
                  step: '02',
                  title: 'Configure Alerts',
                  description: 'Set up alert criteria, delivery channels, and recipient preferences in minutes.',
                  icon: Bell
                },
                {
                  step: '03',
                  title: 'Connect Integrations',
                  description: 'Link your CRM, email tools, and other systems for seamless data flow.',
                  icon: Zap
                },
                {
                  step: '04',
                  title: 'Start Identifying',
                  description: 'Begin receiving visitor identification and behavioral insights immediately.',
                  icon: Eye
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 bg-gradient-to-r from-green-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Identify Your Website Visitors?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Unlock the full potential of your website traffic with Lead Stream&apos;s comprehensive visitor intelligence features.
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
                View Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
