'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bot, Brain, Zap, MessageSquare, ArrowRight, CheckCircle, TrendingUp, Clock, Users, Target, Activity, Globe, Headphones } from 'lucide-react';

export default function SalesAIAgentPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/salesai-agent';

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
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mr-6">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent">
                  SalesAI Agent
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Autonomous AI Sales Representative
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Meet your new AI sales team member that never sleeps, never takes breaks, and consistently delivers 
                personalized sales conversations. SalesAI Agent handles inbound leads, qualifies prospects, books meetings, 
                and nurtures relationships with human-like intelligence—scaling your sales capacity 24/7 without adding headcount.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Clock, label: "24/7 Availability", value: "100%" },
                { icon: TrendingUp, label: "Lead Response", value: "<30s" },
                { icon: Target, label: "Qualification Rate", value: "85%" },
                { icon: Users, label: "Conversations/Day", value: "500+" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-cyan-400" />
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
              {/* Intelligent Conversations */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Intelligent Conversations</h3>
                <ul className="space-y-4">
                  {[
                    'Natural language processing',
                    'Context-aware responses',
                    'Multi-language support',
                    'Sentiment analysis &amp; adaptation'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Lead Qualification */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Lead Qualification</h3>
                <ul className="space-y-4">
                  {[
                    'BANT qualification framework',
                    'Custom qualification criteria',
                    'Intelligent follow-up sequences',
                    'Automated meeting scheduling'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* CRM Integration */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">CRM Integration</h3>
                <ul className="space-y-4">
                  {[
                    'Real-time data synchronization',
                    'Automatic lead scoring',
                    'Conversation logging',
                    'Pipeline management'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5 flex-shrink-0" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose SalesAI Agent?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transform your sales operations with an AI agent that works around the clock, handles unlimited 
                conversations, and consistently delivers qualified leads to your human sales team.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: '24/7 Lead Response',
                  description: 'Never miss another lead. SalesAI Agent responds to inquiries instantly, any time of day or night.',
                  icon: Clock
                },
                {
                  title: 'Human-Like Conversations',
                  description: 'Advanced NLP creates natural, engaging conversations that feel authentically human to prospects.',
                  icon: MessageSquare
                },
                {
                  title: 'Intelligent Qualification',
                  description: 'Automatically qualify leads using BANT criteria and custom qualification frameworks.',
                  icon: Target
                },
                {
                  title: 'Seamless Handoffs',
                  description: 'Smoothly transfer qualified prospects to human sales reps with complete context and history.',
                  icon: Users
                },
                {
                  title: 'Continuous Learning',
                  description: 'AI improves over time by learning from successful conversations and sales outcomes.',
                  icon: Brain
                },
                {
                  title: 'Scalable Capacity',
                  description: 'Handle unlimited simultaneous conversations without hiring additional sales staff.',
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
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-cyan-400" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How SalesAI Agent Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our AI agent seamlessly integrates into your sales process, handling initial conversations 
                and qualification before passing hot leads to your human sales team.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Engage &amp; Respond',
                  description: 'AI agent instantly engages with inbound leads via chat, email, or phone with personalized responses.',
                  icon: MessageSquare
                },
                {
                  step: '02',
                  title: 'Qualify &amp; Score',
                  description: 'Conducts intelligent qualification conversations and scores leads based on your criteria.',
                  icon: Target
                },
                {
                  step: '03',
                  title: 'Schedule &amp; Route',
                  description: 'Books meetings for qualified prospects and routes them to the appropriate sales representative.',
                  icon: Clock
                },
                {
                  step: '04',
                  title: 'Handoff &amp; Continue',
                  description: 'Seamlessly transfers qualified leads with full context while continuing to nurture unqualified prospects.',
                  icon: Users
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-cyan-400 mb-4">{step.step}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">SalesAI Agent Use Cases</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how different organizations leverage SalesAI Agent to scale their sales operations and improve lead conversion.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'Inbound Lead Management',
                  description: 'Instantly respond to and qualify inbound leads from your website, ads, and marketing campaigns.',
                  icon: Target,
                  features: ['Instant lead response', 'BANT qualification', 'Meeting scheduling', 'Lead scoring']
                },
                {
                  title: 'Customer Support &amp; Sales',
                  description: 'Handle customer inquiries while identifying upsell and cross-sell opportunities.',
                  icon: Headphones,
                  features: ['Support automation', 'Opportunity identification', 'Product recommendations', 'Escalation management']
                },
                {
                  title: 'After-Hours Coverage',
                  description: 'Provide sales coverage when your human team is offline, capturing global opportunities.',
                  icon: Globe,
                  features: ['24/7 availability', 'Global time zone coverage', 'Lead capture', 'Follow-up scheduling']
                },
                {
                  title: 'Event &amp; Webinar Follow-up',
                  description: 'Automatically follow up with event attendees and webinar participants at scale.',
                  icon: Activity,
                  features: ['Event follow-up', 'Interest qualification', 'Demo scheduling', 'Nurture sequences']
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
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                      <useCase.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: useCase.description }}></p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                        <span dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* AI Capabilities */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced AI Capabilities</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Powered by cutting-edge AI technology that delivers human-like interactions and intelligent decision-making.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Natural Language',
                  description: 'Understands context, nuance, and intent in human communication',
                  value: '99%',
                  icon: MessageSquare
                },
                {
                  title: 'Response Speed',
                  description: 'Instant responses to leads and prospects without any delay',
                  value: '<1s',
                  icon: Zap
                },
                {
                  title: 'Qualification Accuracy',
                  description: 'Accurately identifies and qualifies sales-ready prospects',
                  value: '92%',
                  icon: Target
                },
                {
                  title: 'Language Support',
                  description: 'Communicate with prospects in their preferred language',
                  value: '50+',
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
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <capability.icon className="w-8 h-8 text-cyan-400" />
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
          className="py-20 bg-gradient-to-r from-cyan-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Add an AI Sales Agent to Your Team?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Stop losing leads to slow response times and limited availability. Let SalesAI Agent work 24/7 
              to qualify prospects, book meetings, and scale your sales capacity instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 group inline-flex items-center justify-center"
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
