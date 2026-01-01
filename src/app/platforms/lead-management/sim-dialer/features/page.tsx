'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Bot, BarChart3, Zap, Users, CheckCircle, Shield, Clock, Globe, MessageSquare, Headphones, Activity, TrendingUp, Filter, Settings, ArrowRight } from 'lucide-react';

export default function SIMDialerFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/sim-dialer';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const featureCategories = [
    {
      title: 'Multi-Line Dialing Engine',
      icon: Phone,
      features: [
        {
          name: 'Simultaneous Multi-Line Calling',
          description: 'Dial up to 10 numbers simultaneously per agent, dramatically increasing connection rates and productivity',
          icon: Phone
        },
        {
          name: 'Predictive Dialing Algorithms',
          description: 'AI-powered algorithms predict optimal dialing ratios and timing to minimize agent idle time',
          icon: Bot
        },
        {
          name: 'Progressive &amp; Power Dialing',
          description: 'Choose between progressive, power, or predictive dialing modes based on your campaign needs',
          icon: Zap
        },
        {
          name: 'Local Number Presence',
          description: 'Display local caller ID numbers to increase answer rates and establish trust with prospects',
          icon: Globe
        }
      ]
    },
    {
      title: 'Advanced Call Detection',
      icon: Bot,
      features: [
        {
          name: 'Live Answer Detection',
          description: 'Industry-leading 99%+ accuracy in detecting live human answers versus voicemail and automated systems',
          icon: Headphones
        },
        {
          name: 'Voicemail &amp; Busy Signal Detection',
          description: 'Automatically identify voicemails, busy signals, and disconnected numbers for proper handling',
          icon: MessageSquare
        },
        {
          name: 'Answering Machine Detection (AMD)',
          description: 'Advanced algorithms distinguish between human voices and automated answering systems',
          icon: Bot
        },
        {
          name: 'Call Progress Analysis',
          description: 'Real-time analysis of call progress tones and signals for optimal call routing decisions',
          icon: Activity
        }
      ]
    },
    {
      title: 'Intelligent Call Routing',
      icon: Zap,
      features: [
        {
          name: 'Skills-Based Routing',
          description: 'Route calls to agents based on skills, experience level, product knowledge, and territory',
          icon: Users
        },
        {
          name: 'Real-Time Availability',
          description: 'Monitor agent availability in real-time and route calls only to ready representatives',
          icon: Clock
        },
        {
          name: 'Priority Call Handling',
          description: 'Assign priority levels to contacts and ensure high-value prospects get immediate attention',
          icon: TrendingUp
        },
        {
          name: 'Overflow &amp; Escalation',
          description: 'Automatic overflow routing and escalation when agents are unavailable or busy',
          icon: Shield
        }
      ]
    },
    {
      title: 'Automated Voicemail Management',
      icon: MessageSquare,
      features: [
        {
          name: 'Pre-Recorded Voicemail Drops',
          description: 'Automatically leave personalized pre-recorded voicemails when prospects don&apos;t answer',
          icon: MessageSquare
        },
        {
          name: 'Dynamic Message Personalization',
          description: 'Insert prospect name, company, and custom variables into voicemail messages automatically',
          icon: Settings
        },
        {
          name: 'A/B Testing for Voicemails',
          description: 'Test different voicemail scripts and track which versions generate the most callbacks',
          icon: BarChart3
        },
        {
          name: 'Callback Tracking',
          description: 'Monitor voicemail callback rates and response times to optimize messaging strategies',
          icon: TrendingUp
        }
      ]
    },
    {
      title: 'Campaign Management',
      icon: Settings,
      features: [
        {
          name: 'Multi-Campaign Support',
          description: 'Run multiple calling campaigns simultaneously with different strategies and priorities',
          icon: Activity
        },
        {
          name: 'Dynamic List Management',
          description: 'Upload, manage, and prioritize calling lists with real-time updates and filtering',
          icon: Filter
        },
        {
          name: 'Time Zone Optimization',
          description: 'Automatically respect time zones and call prospects during optimal business hours',
          icon: Clock
        },
        {
          name: 'Do Not Call (DNC) Compliance',
          description: 'Built-in DNC list management and compliance features to ensure regulatory adherence',
          icon: Shield
        }
      ]
    },
    {
      title: 'Analytics &amp; Reporting',
      icon: BarChart3,
      features: [
        {
          name: 'Real-Time Performance Dashboards',
          description: 'Monitor call metrics, agent performance, and campaign progress in real-time',
          icon: BarChart3
        },
        {
          name: 'Comprehensive Call Analytics',
          description: 'Track connect rates, talk time, conversion rates, and ROI across all campaigns',
          icon: TrendingUp
        },
        {
          name: 'Agent Performance Metrics',
          description: 'Individual and team performance tracking with coaching insights and recommendations',
          icon: Users
        },
        {
          name: 'Custom Reporting &amp; Exports',
          description: 'Create custom reports and export data for external analysis and business intelligence',
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
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-white to-red-400 bg-clip-text text-transparent">
                  SIM Dialer Features
                </h1>
              </div>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Advanced multi-line dialing capabilities that transform your sales calling operations with 
                intelligent automation, precision targeting, and comprehensive performance analytics.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {[
                { label: "Talk Time Increase", value: "400%", icon: TrendingUp },
                { label: "Connect Rate", value: "250%", icon: Phone },
                { label: "Detection Accuracy", value: "99%", icon: Bot },
                { label: "Calls Per Hour", value: "200+", icon: Clock }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-orange-400" />
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
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
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
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-orange-400" />
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

        {/* Enterprise Features */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Enterprise-Grade Infrastructure</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Built for scale and reliability with enterprise security, compliance, and performance standards.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Security &amp; Compliance */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Security &amp; Compliance</h3>
                <ul className="space-y-4">
                  {[
                    'SOC 2 Type II certified',
                    'HIPAA compliant calling',
                    'TCPA compliance tools',
                    'PCI DSS security standards',
                    'End-to-end encryption',
                    'Audit logs &amp; monitoring'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: spec }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Performance &amp; Scale */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Performance &amp; Scale</h3>
                <ul className="space-y-4">
                  {[
                    '99.9% uptime SLA guarantee',
                    '10,000+ concurrent calls',
                    'Global carrier redundancy',
                    'Sub-second call routing',
                    'Real-time performance monitoring',
                    'Auto-scaling infrastructure'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: spec }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Integration &amp; APIs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Integration &amp; APIs</h3>
                <ul className="space-y-4">
                  {[
                    'REST API &amp; webhooks',
                    'Native CRM integrations',
                    'Real-time event streaming',
                    'Custom integration support',
                    'Zapier &amp; middleware connect',
                    'Single sign-on (SSO)'
                  ].map((spec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
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
                Get your team up and running with SIM Dialer in days, not weeks, with our streamlined setup process.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Setup &amp; Configuration',
                  description: 'Configure your dialing campaigns, upload contact lists, and set routing rules.',
                  icon: Settings
                },
                {
                  step: '02',
                  title: 'Agent Training',
                  description: 'Train your team on the system and best practices for maximizing calling efficiency.',
                  icon: Users
                },
                {
                  step: '03',
                  title: 'Integration &amp; Testing',
                  description: 'Connect with your CRM and other tools, then run test campaigns to optimize settings.',
                  icon: Zap
                },
                {
                  step: '04',
                  title: 'Launch &amp; Optimize',
                  description: 'Go live with full campaigns and continuously optimize based on performance data.',
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
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-orange-400 mb-4">{step.step}</div>
                  <h3 className="text-lg font-bold mb-4 text-white" dangerouslySetInnerHTML={{ __html: step.title }}></h3>
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
          className="py-20 bg-gradient-to-r from-orange-900/20 via-black to-red-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience SIM Dialer Features?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Discover how SIM Dialer&apos;s comprehensive feature set can transform your calling operations 
              and deliver unprecedented productivity gains for your sales team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 group inline-flex items-center justify-center"
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
