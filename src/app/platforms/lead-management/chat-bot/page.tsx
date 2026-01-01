'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, Bot, Globe, Smartphone, ArrowRight, CheckCircle, TrendingUp, Clock, Users, Target, Activity, Shield, Zap, Brain, MessageSquare } from 'lucide-react';

export default function ChatBotPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/chat-bot';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
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
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                  Chat Bot
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Intelligent Website Chat Automation
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                24/7 visitor engagement that never sleeps. Our AI-powered Chat Bot engages website visitors instantly, 
                qualifies leads automatically, and provides personalized support around the clock—turning more visitors 
                into customers while reducing support workload by 70%.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: TrendingUp, label: "Engagement Increase", value: "85%" },
                { icon: Clock, label: "Response Time", value: "<2s" },
                { icon: Target, label: "Lead Conversion", value: "42%" },
                { icon: Users, label: "Visitor Satisfaction", value: "94%" }
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
              {/* 24/7 Visitor Engagement */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">24/7 Visitor Engagement</h3>
                <ul className="space-y-4">
                  {[
                    'Instant response to visitor inquiries',
                    'Proactive engagement based on behavior',
                    'Multi-language support &amp; localization',
                    'Mobile-optimized chat interface',
                    'Personalized conversation flows',
                    'Smart visitor intent detection'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Advanced AI Capabilities */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Advanced AI Capabilities</h3>
                <ul className="space-y-4">
                  {[
                    'Natural language understanding',
                    'Context-aware conversation management',
                    'Learning from previous interactions',
                    'Seamless handoff to human agents',
                    'Sentiment analysis &amp; emotion detection',
                    'Dynamic response personalization'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Lead Generation & Qualification */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Lead Generation &amp; Qualification</h3>
                <ul className="space-y-4">
                  {[
                    'Automated lead capture &amp; qualification',
                    'Meeting scheduling &amp; calendar integration',
                    'CRM data synchronization',
                    'Visitor intelligence &amp; tracking',
                    'Progressive profiling &amp; segmentation',
                    'Sales-ready lead handoff'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Chat Bot?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transform your website into a 24/7 lead generation machine that engages visitors, 
                qualifies prospects, and converts more traffic into customers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Instant Visitor Engagement',
                  description: 'Engage every website visitor immediately with personalized conversations that guide them toward conversion.',
                  icon: Zap
                },
                {
                  title: 'Automated Lead Qualification',
                  description: 'Qualify leads automatically using smart questioning flows that identify the best prospects for your sales team.',
                  icon: Target
                },
                {
                  title: 'Multi-Language Support',
                  description: 'Serve global audiences with AI that communicates naturally in multiple languages and cultural contexts.',
                  icon: Globe
                },
                {
                  title: 'Mobile-Optimized Experience',
                  description: 'Deliver seamless chat experiences across all devices with responsive design and mobile-first interface.',
                  icon: Smartphone
                },
                {
                  title: 'Smart Escalation',
                  description: 'Know when to hand off conversations to human agents with context preservation and seamless transitions.',
                  icon: Users
                },
                {
                  title: 'Performance Analytics',
                  description: 'Track engagement metrics, conversion rates, and chat performance to optimize visitor experiences.',
                  icon: TrendingUp
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Chat Bot Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                From visitor arrival to lead conversion, Chat Bot seamlessly guides every interaction 
                to maximize engagement and drive measurable results.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Visitor Detection',
                  description: 'AI detects visitor behavior and intent, triggering proactive engagement based on page views, time spent, and interaction patterns.',
                  icon: Users
                },
                {
                  step: '02',
                  title: 'Intelligent Engagement',
                  description: 'Chat Bot initiates personalized conversations using natural language processing and context-aware messaging.',
                  icon: MessageSquare
                },
                {
                  step: '03',
                  title: 'Lead Qualification',
                  description: 'Smart questioning flows identify visitor needs, budget, timeline, and decision-making authority automatically.',
                  icon: Target
                },
                {
                  step: '04',
                  title: 'Conversion &amp; Handoff',
                  description: 'Qualified leads are seamlessly transferred to sales teams or booked for meetings with full conversation context.',
                  icon: Activity
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Chat Bot Use Cases</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how businesses across industries leverage Chat Bot to enhance visitor engagement and drive conversions.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'E-commerce &amp; Retail',
                  description: 'Guide customers through product discovery, answer questions, and reduce cart abandonment with personalized assistance.',
                  icon: Target,
                  features: ['Product recommendations', 'Order tracking', 'Return &amp; refund assistance', 'Inventory inquiries']
                },
                {
                  title: 'SaaS &amp; Technology',
                  description: 'Qualify prospects, schedule demos, and provide technical support while capturing valuable lead information.',
                  icon: Bot,
                  features: ['Demo scheduling', 'Feature explanations', 'Pricing inquiries', 'Technical support']
                },
                {
                  title: 'Professional Services',
                  description: 'Capture leads for consultations, answer service questions, and route inquiries to appropriate specialists.',
                  icon: Users,
                  features: ['Consultation booking', 'Service inquiries', 'Case studies', 'Expert routing']
                },
                {
                  title: 'Healthcare &amp; Medical',
                  description: 'Assist with appointment scheduling, answer basic questions, and provide patient support while maintaining compliance.',
                  icon: Shield,
                  features: ['Appointment booking', 'Insurance verification', 'Service information', 'Location &amp; hours']
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
                      <h3 className="text-2xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: useCase.title }}></h3>
                      <p className="text-gray-300">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span dangerouslySetInnerHTML={{ __html: feature }}></span>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Chat Bot Performance Impact</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how Chat Bot transforms website engagement and drives measurable business results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Visitor Engagement',
                  description: 'Increase in website visitor engagement rates',
                  value: '+85%',
                  icon: TrendingUp
                },
                {
                  title: 'Response Speed',
                  description: 'Average time to first response',
                  value: '&lt;2s',
                  icon: Zap
                },
                {
                  title: 'Lead Conversion',
                  description: 'Improvement in visitor-to-lead conversion',
                  value: '+42%',
                  icon: Target
                },
                {
                  title: 'Support Deflection',
                  description: 'Reduction in human support ticket volume',
                  value: '70%',
                  icon: Shield
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
                  <div className="text-3xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: metric.value }}></div>
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
              Ready to Engage More Website Visitors?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your website into a powerful lead generation engine with AI-powered chat automation. 
              Engage visitors 24/7, qualify leads automatically, and convert more traffic into customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Engage More Website Visitors - Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                See Chat Bot Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
