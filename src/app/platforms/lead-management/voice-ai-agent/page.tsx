'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, Mic, Volume2, Brain, Zap, MessageSquare, ArrowRight, CheckCircle, TrendingUp, Clock, Users, Target, Activity, Globe, Headphones} from 'lucide-react';

export default function VoiceAIAgentPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-ai-agent';

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
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
                  <Volume2 className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-white to-pink-400 bg-clip-text text-transparent">
                  VoiceAI Agent
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Human-Like Voice AI for Sales Calls
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience the next generation of voice AI technology that conducts natural, persuasive phone conversations. 
                VoiceAI Agent handles inbound calls, makes outbound prospecting calls, qualifies leads, and books meetings 
                with human-like voice interactions that build genuine rapport and trust.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Volume2, label: "Voice Clarity", value: "99.8%" },
                { icon: Clock, label: "Response Time", value: "<200ms" },
                { icon: Target, label: "Call Success Rate", value: "87%" },
                { icon: Users, label: "Calls/Hour", value: "200+" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-purple-400" />
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
              {/* Natural Voice Technology */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Mic className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Natural Voice Technology</h3>
                <ul className="space-y-4">
                  {[
                    'Human-like speech patterns',
                    'Emotional tone adaptation',
                    'Natural conversation flow',
                    'Multiple voice personalities',
                    'Accent &amp; language support',
                    'Real-time voice modulation'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Intelligent Call Handling */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Intelligent Call Handling</h3>
                <ul className="space-y-4">
                  {[
                    'Inbound call management',
                    'Outbound prospecting calls',
                    'Call routing &amp; transfers',
                    'Voicemail detection',
                    'Call recording &amp; analysis',
                    'Real-time transcription'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Advanced AI Intelligence */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Advanced AI Intelligence</h3>
                <ul className="space-y-4">
                  {[
                    'Context-aware responses',
                    'Objection handling',
                    'Lead qualification',
                    'Appointment scheduling',
                    'Follow-up automation',
                    'Performance analytics'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5 flex-shrink-0" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose VoiceAI Agent?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transform your phone sales operations with AI voice technology that delivers consistent, 
                professional, and persuasive conversations at scale.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Human-Like Conversations',
                  description: 'Advanced voice synthesis creates natural, engaging phone conversations that prospects trust.',
                  icon: MessageSquare
                },
                {
                  title: '24/7 Call Availability',
                  description: 'Never miss a call opportunity. VoiceAI Agent answers and makes calls around the clock.',
                  icon: Clock
                },
                {
                  title: 'Consistent Performance',
                  description: 'Every call follows best practices with perfect execution and no bad days or mood swings.',
                  icon: Target
                },
                {
                  title: 'Scalable Operations',
                  description: 'Handle hundreds of simultaneous calls without hiring additional sales representatives.',
                  icon: TrendingUp
                },
                {
                  title: 'Real-Time Intelligence',
                  description: 'Access customer data and respond intelligently based on CRM information and call context.',
                  icon: Brain
                },
                {
                  title: 'Cost-Effective Solution',
                  description: 'Reduce phone sales costs by up to 80% compared to traditional sales representatives.',
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
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-purple-400" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How VoiceAI Agent Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                From initial contact to meeting booking, VoiceAI Agent seamlessly handles your entire phone sales process 
                with natural voice interactions and intelligent conversation management.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Receive &amp; Initiate',
                  description: 'AI agent answers inbound calls instantly or initiates outbound prospecting calls based on your campaign settings.',
                  icon: Phone
                },
                {
                  step: '02',
                  title: 'Engage &amp; Listen',
                  description: 'Natural voice conversation begins with intelligent listening and context-aware responses to prospect needs.',
                  icon: Headphones
                },
                {
                  step: '03',
                  title: 'Qualify &amp; Present',
                  description: 'AI conducts qualification questions and presents solutions based on prospect responses and pain points.',
                  icon: Target
                },
                {
                  step: '04',
                  title: 'Close &amp; Schedule',
                  description: 'Handles objections, closes for next steps, and schedules meetings directly with calendar integration.',
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
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-purple-400 mb-4">{step.step}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">VoiceAI Agent Use Cases</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how businesses across industries leverage VoiceAI Agent to transform their phone sales operations and drive results.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'Inbound Sales Calls',
                  description: 'Handle incoming sales inquiries with professional voice conversations that qualify and convert prospects.',
                  icon: Phone,
                  features: ['Instant call answering', 'Professional greeting', 'Needs assessment', 'Solution presentation']
                },
                {
                  title: 'Outbound Prospecting',
                  description: 'Make hundreds of outbound calls daily to generate leads and book meetings with potential customers.',
                  icon: Target,
                  features: ['Automated dialing', 'Personalized pitches', 'Objection handling', 'Meeting scheduling']
                },
                {
                  title: 'Lead Re-engagement',
                  description: 'Call dormant leads and previous prospects to re-engage them with new offers and solutions.',
                  icon: Activity,
                  features: ['Lead scoring analysis', 'Personalized follow-up', 'Offer presentation', 'Relationship building']
                },
                {
                  title: 'Customer Support Sales',
                  description: 'Handle support calls while identifying upsell and cross-sell opportunities through natural conversation.',
                  icon: Headphones,
                  features: ['Support resolution', 'Needs identification', 'Product recommendations', 'Upgrade presentations']
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
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mr-4">
                      <useCase.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{useCase.title}</h3>
                      <p className="text-gray-300">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Voice Technology */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Advanced Voice Technology</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Powered by cutting-edge voice synthesis and natural language processing that creates truly human-like phone conversations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Voice Quality',
                  description: 'Crystal-clear, natural-sounding voice with emotional intelligence',
                  value: '99.8%',
                  icon: Volume2
                },
                {
                  title: 'Response Latency',
                  description: 'Near-instantaneous responses that feel like natural conversation',
                  value: '&lt;200ms',
                  icon: Zap
                },
                {
                  title: 'Conversation Success',
                  description: 'High success rate in completing meaningful sales conversations',
                  value: '87%',
                  icon: Target
                },
                {
                  title: 'Language Support',
                  description: 'Multiple languages and regional accents for global reach',
                  value: '25+',
                  icon: Globe
                }
              ].map((tech, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: tech.value }}></div>
                  <h3 className="text-lg font-bold mb-3 text-white">{tech.title}</h3>
                  <p className="text-gray-300 text-sm">{tech.description}</p>
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
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-pink-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Scale Your Phone Sales with AI?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your phone sales operations with VoiceAI Agent. Handle more calls, qualify more leads, 
              and close more deals with human-like voice conversations that work 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Hear Voice Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
