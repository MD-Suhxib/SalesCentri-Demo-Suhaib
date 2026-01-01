'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Database, Target, Brain, Workflow, Zap, BarChart3, Users, Bot, CheckCircle, Shield, Clock, TrendingUp, Filter, Globe, Mail, Bell, ArrowRight } from 'lucide-react';

export default function ILMSFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/ilms';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const featureCategories = [
    {
      title: 'Lead Capture &amp; Validation',
      icon: Target,
      features: [
        {
          name: 'Multi-Channel Ingestion',
          description: 'Capture leads from websites, forms, email, social media, phone calls, and third-party integrations',
          icon: Globe
        },
        {
          name: 'Real-time Data Validation',
          description: 'Automatically validate email addresses, phone numbers, and company information upon capture',
          icon: Shield
        },
        {
          name: 'Duplicate Detection &amp; Merging',
          description: 'Intelligent algorithms identify and merge duplicate leads while preserving complete history',
          icon: Filter
        },
        {
          name: 'Automatic Data Enrichment',
          description: 'Enrich lead profiles with company data, social profiles, and demographic information',
          icon: Target
        }
      ]
    },
    {
      title: 'AI-Powered Lead Scoring',
      icon: Brain,
      features: [
        {
          name: 'Predictive Scoring Models',
          description: 'Machine learning algorithms analyze 200+ data points to predict conversion likelihood',
          icon: Brain
        },
        {
          name: 'Behavioral Analysis',
          description: 'Track and score lead engagement patterns across email, website, and content interactions',
          icon: BarChart3
        },
        {
          name: 'Custom Scoring Criteria',
          description: 'Build custom scoring models based on your specific business criteria and historical data',
          icon: Target
        },
        {
          name: 'Dynamic Score Updates',
          description: 'Scores update in real-time as leads interact with your brand and move through the funnel',
          icon: TrendingUp
        }
      ]
    },
    {
      title: 'Intelligent Routing &amp; Assignment',
      icon: Zap,
      features: [
        {
          name: 'Smart Lead Distribution',
          description: 'Automatically route leads to the right sales rep based on territory, skills, and workload',
          icon: Users
        },
        {
          name: 'Round-Robin &amp; Weighted Routing',
          description: 'Flexible routing options including round-robin, weighted distribution, and performance-based',
          icon: Workflow
        },
        {
          name: 'Escalation Management',
          description: 'Automatic escalation and reassignment when leads aren&apos;t contacted within defined timeframes',
          icon: Bell
        },
        {
          name: 'Capacity Management',
          description: 'Monitor rep capacity and automatically pause routing when maximum leads are reached',
          icon: Clock
        }
      ]
    },
    {
      title: 'Automated Nurturing',
      icon: Bot,
      features: [
        {
          name: 'Personalized Email Sequences',
          description: 'Create dynamic email campaigns that adapt based on lead behavior and engagement',
          icon: Mail
        },
        {
          name: 'Multi-Touch Campaigns',
          description: 'Orchestrate campaigns across email, SMS, social media, and direct mail channels',
          icon: Bell
        },
        {
          name: 'Trigger-Based Automation',
          description: 'Set up complex automation workflows triggered by specific lead actions or score changes',
          icon: Zap
        },
        {
          name: 'A/B Testing Framework',
          description: 'Continuously optimize nurturing campaigns with built-in A/B testing and performance analytics',
          icon: BarChart3
        }
      ]
    },
    {
      title: 'Workflow Automation',
      icon: Workflow,
      features: [
        {
          name: 'Visual Workflow Builder',
          description: 'Drag-and-drop interface for creating complex lead management workflows without coding',
          icon: Bot
        },
        {
          name: 'Conditional Logic &amp; Branching',
          description: 'Create sophisticated workflows with conditional logic, branching, and decision points',
          icon: Filter
        },
        {
          name: 'Task &amp; Follow-up Automation',
          description: 'Automatically create tasks, set reminders, and schedule follow-ups based on lead behavior',
          icon: Clock
        },
        {
          name: 'Integration Triggers',
          description: 'Trigger workflows based on events from connected CRM, marketing, and sales tools',
          icon: Zap
        }
      ]
    },
    {
      title: 'Analytics &amp; Reporting',
      icon: BarChart3,
      features: [
        {
          name: 'Real-time Performance Dashboards',
          description: 'Monitor lead flow, conversion rates, and team performance with customizable dashboards',
          icon: BarChart3
        },
        {
          name: 'Source Attribution &amp; ROI',
          description: 'Track lead sources, campaign performance, and calculate ROI across all marketing channels',
          icon: TrendingUp
        },
        {
          name: 'Predictive Analytics',
          description: 'Forecast conversion rates, revenue potential, and identify trends before they happen',
          icon: Brain
        },
        {
          name: 'Custom Reports &amp; Exports',
          description: 'Create custom reports with advanced filtering and export data to external systems',
          icon: Database
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
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
                  iLMS Features
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Comprehensive lead management capabilities powered by AI and automation to capture, score, 
                nurture, and convert leads with unprecedented efficiency and intelligence.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { label: "Conversion Increase", value: "240%", icon: TrendingUp },
                { label: "Response Time", value: "<5min", icon: Clock },
                { label: "Score Accuracy", value: "94%", icon: Brain },
                { label: "Automation Rate", value: "85%", icon: Workflow }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-purple-400" />
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
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
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
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-purple-400" />
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

        {/* Advanced Capabilities */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Capabilities</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Enterprise-grade features that scale with your business and adapt to your unique sales processes.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* AI &amp; Machine Learning */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">AI &amp; Machine Learning</h3>
                <ul className="space-y-4">
                  {[
                    'Predictive lead scoring algorithms',
                    'Behavioral pattern recognition',
                    'Conversion probability modeling',
                    'Automated optimization',
                    'Natural language processing',
                    'Sentiment analysis capabilities'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{spec}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Integration &amp; APIs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Integration &amp; APIs</h3>
                <ul className="space-y-4">
                  {[
                    'REST API &amp; webhooks',
                    'Native CRM integrations',
                    'Marketing automation sync',
                    'Real-time data streaming',
                    'Custom integration support',
                    'Bi-directional data sync'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: spec }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Enterprise Security */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Enterprise Security</h3>
                <ul className="space-y-4">
                  {[
                    'SOC 2 Type II compliance',
                    'GDPR &amp; CCPA compliant',
                    'End-to-end encryption',
                    'Role-based access control',
                    'Audit logs &amp; monitoring',
                    'Single sign-on (SSO)'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: spec }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Workflow Builder */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Visual Workflow Builder</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Create sophisticated lead management workflows without coding using our intuitive drag-and-drop interface.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Drag &amp; Drop',
                  description: 'Build workflows visually with pre-built components and custom actions.',
                  icon: Bot
                },
                {
                  step: '02',
                  title: 'Add Logic',
                  description: 'Insert conditional logic, branching, and decision points for complex flows.',
                  icon: Filter
                },
                {
                  step: '03',
                  title: 'Set Triggers',
                  description: 'Define trigger conditions based on lead behavior, scores, or external events.',
                  icon: Zap
                },
                {
                  step: '04',
                  title: 'Deploy &amp; Monitor',
                  description: 'Activate workflows and monitor performance with real-time analytics.',
                  icon: BarChart3
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold mb-4 text-white" dangerouslySetInnerHTML={{ __html: step.title }}></h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Performance Metrics */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Performance &amp; Scale</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Built for enterprise scale with industry-leading performance and reliability standards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  metric: '99.9%',
                  label: 'Uptime SLA',
                  description: 'Enterprise-grade reliability with redundant infrastructure',
                  icon: Shield
                },
                {
                  metric: '10M+',
                  label: 'Leads/Month',
                  description: 'Process millions of leads with consistent performance',
                  icon: Database
                },
                {
                  metric: '<100ms',
                  label: 'Response Time',
                  description: 'Lightning-fast processing for real-time lead management',
                  icon: Clock
                },
                {
                  metric: '500+',
                  label: 'Integrations',
                  description: 'Connect with virtually any tool in your tech stack',
                  icon: Zap
                }
              ].map((metric, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <metric.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{metric.metric}</div>
                  <h3 className="text-lg font-bold mb-3 text-white">{metric.label}</h3>
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
          transition={{ duration: 0.8, delay: 1.2 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience iLMS Features?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Discover how iLMS&apos;s comprehensive feature set can transform your lead management process 
              and drive unprecedented conversion rates.
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
                View Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
