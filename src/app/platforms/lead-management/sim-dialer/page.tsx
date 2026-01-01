'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Zap, BarChart3, Bot, ArrowRight, CheckCircle, Clock, Users, TrendingUp, Globe, Shield, Activity, Headphones, MessageSquare } from 'lucide-react';

export default function SIMDialerPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/sim-dialer';

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
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-6">
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-400 via-white to-red-400 bg-clip-text text-transparent">
                  SIM Dialer
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Smart Intelligent Multi-Line Power Dialer
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Supercharge your sales team&apos;s productivity with SIM Dialer&apos;s intelligent multi-line auto-dialing system. 
                Automatically dial multiple prospects simultaneously, detect live answers, leave personalized voicemails, 
                and route qualified calls to your sales reps—increasing talk time by 400% while maintaining personal touch.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: TrendingUp, label: "Talk Time Increase", value: "400%" },
                { icon: Clock, label: "Connect Rate", value: "250%" },
                { icon: Users, label: "Productivity Boost", value: "300%" },
                { icon: Phone, label: "Calls Per Hour", value: "200+" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Core Features Overview */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Multi-Line Dialing */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Multi-Line Dialing</h3>
                <ul className="space-y-4">
                  {[
                    'Simultaneous multi-line calling',
                    'Intelligent call routing',
                    'Live answer detection',
                    'Automatic voicemail drops'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Smart Automation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Smart Automation</h3>
                <ul className="space-y-4">
                  {[
                    'AI-powered call prioritization',
                    'Automated follow-up scheduling',
                    'Predictive dialing algorithms',
                    'Dynamic call list optimization'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Performance Analytics */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Performance Analytics</h3>
                <ul className="space-y-4">
                  {[
                    'Real-time call metrics',
                    'Team performance dashboards',
                    'Conversion tracking',
                    'ROI reporting &amp; insights'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-orange-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose SIM Dialer?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transform your sales calling from manual drudgery into an efficient, automated process that 
                maximizes rep productivity and increases connection rates.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Intelligent Multi-Line Dialing',
                  description: 'Dial multiple numbers simultaneously and route live answers to available reps, maximizing talk time and minimizing downtime.',
                  icon: Phone
                },
                {
                  title: 'Advanced Call Detection',
                  description: 'AI-powered algorithms detect live answers, voicemails, and busy signals with 99%+ accuracy for optimal call handling.',
                  icon: Bot
                },
                {
                  title: 'Personalized Voicemail Drops',
                  description: 'Automatically leave pre-recorded personalized voicemails when prospects don&apos;t answer, maintaining engagement.',
                  icon: MessageSquare
                },
                {
                  title: 'Real-Time Call Routing',
                  description: 'Instantly connect live prospects to available sales reps based on skills, territory, and availability.',
                  icon: Zap
                },
                {
                  title: 'Comprehensive Analytics',
                  description: 'Track call performance, conversion rates, and rep productivity with detailed reporting and insights.',
                  icon: BarChart3
                },
                {
                  title: 'CRM Integration',
                  description: 'Seamlessly sync call data, outcomes, and follow-ups with your existing CRM and sales tools.',
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
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-orange-400" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How SIM Dialer Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our intelligent dialing system automates the entire calling process, from list management 
                to call routing, ensuring maximum efficiency and results.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Upload &amp; Prioritize',
                  description: 'Upload contact lists and let AI prioritize calling order based on lead scores and optimal contact times.',
                  icon: Users
                },
                {
                  step: '02',
                  title: 'Multi-Line Dial',
                  description: 'System dials multiple numbers simultaneously using predictive algorithms to maximize connection rates.',
                  icon: Phone
                },
                {
                  step: '03',
                  title: 'Detect &amp; Route',
                  description: 'Advanced detection identifies live answers and instantly routes calls to available sales representatives.',
                  icon: Zap
                },
                {
                  step: '04',
                  title: 'Track &amp; Optimize',
                  description: 'Monitor performance metrics and optimize calling strategies for continuous improvement and ROI.',
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
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-orange-400 mb-4">{step.step}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">SIM Dialer Use Cases</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how different teams leverage SIM Dialer to transform their calling operations and achieve exceptional results.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'Sales Development Teams',
                  description: 'Accelerate lead qualification and appointment setting with high-volume intelligent dialing.',
                  icon: Users,
                  features: ['Lead qualification automation', 'Appointment scheduling', 'Follow-up management', 'Performance tracking']
                },
                {
                  title: 'Account Management',
                  description: 'Maintain regular contact with existing customers for retention and expansion opportunities.',
                  icon: Shield,
                  features: ['Customer check-ins', 'Renewal reminders', 'Upsell opportunities', 'Satisfaction surveys']
                },
                {
                  title: 'Inside Sales Teams',
                  description: 'Maximize outbound calling efficiency for quota attainment and revenue generation.',
                  icon: TrendingUp,
                  features: ['Quota achievement', 'Pipeline acceleration', 'Territory coverage', 'Revenue optimization']
                },
                {
                  title: 'Customer Success',
                  description: 'Proactively reach out to customers for support, onboarding, and success initiatives.',
                  icon: Headphones,
                  features: ['Onboarding calls', 'Success check-ins', 'Support follow-ups', 'Churn prevention']
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
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg flex items-center justify-center mr-4">
                      <useCase.icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-gray-300">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
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
                Enterprise-grade infrastructure delivering reliable, scalable, and compliant calling solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Call Capacity',
                  description: 'Support for thousands of simultaneous calls with consistent quality and performance',
                  value: '10K+',
                  icon: Phone
                },
                {
                  title: 'Answer Detection',
                  description: 'Industry-leading accuracy in detecting live answers versus voicemails and busy signals',
                  value: '99%',
                  icon: Bot
                },
                {
                  title: 'Global Coverage',
                  description: 'Make calls to over 200 countries with local number support and compliance',
                  value: '200+',
                  icon: Globe
                },
                {
                  title: 'Uptime SLA',
                  description: 'Enterprise-grade reliability with redundant infrastructure and 24/7 monitoring',
                  value: '99.9%',
                  icon: Shield
                }
              ].map((capability, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <capability.icon className="w-8 h-8 text-orange-400" />
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
          className="py-20 bg-gradient-to-r from-orange-900/20 via-black to-red-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to 4x Your Calling Productivity?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Stop wasting time on manual dialing and focus on what matters—having conversations with qualified prospects. 
              SIM Dialer automates the process so your team can close more deals.
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
                Book Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
