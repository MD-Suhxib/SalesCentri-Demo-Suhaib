'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bot, MessageCircle, Volume2, Brain, Zap, Phone, ArrowRight, CheckCircle, TrendingUp, Clock, Users, Target, Activity, Globe, Headphones, Mic } from 'lucide-react';

export default function VoiceBotPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-bot';

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
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-6">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-white to-teal-400 bg-clip-text text-transparent">
                  Voice Bot
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Intelligent Voice-Powered Customer Interaction
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Deploy advanced voice bots that handle customer inquiries, provide support, and guide users through 
                complex processes with natural voice interactions. Voice Bot combines the accessibility of phone 
                communication with the intelligence of AI to deliver exceptional customer experiences at scale.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: MessageCircle, label: "Interaction Success", value: "94%" },
                { icon: Clock, label: "Average Response", value: "<1s" },
                { icon: Target, label: "Issue Resolution", value: "89%" },
                { icon: Users, label: "Calls/Day", value: "1000+" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-emerald-400" />
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
              {/* Intelligent Voice Processing */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <Volume2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Intelligent Voice Processing</h3>
                <ul className="space-y-4">
                  {[
                    'Natural language understanding',
                    'Multi-accent recognition',
                    'Real-time voice synthesis',
                    'Emotion &amp; intent detection',
                    'Background noise filtering',
                    'Voice command recognition'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Customer Support Automation */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Customer Support Automation</h3>
                <ul className="space-y-4">
                  {[
                    'Automated issue resolution',
                    'Knowledge base integration',
                    'Ticket creation &amp; routing',
                    'Escalation management',
                    'Customer authentication',
                    'Follow-up scheduling'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Multi-Channel Integration */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Multi-Channel Integration</h3>
                <ul className="space-y-4">
                  {[
                    'Phone system integration',
                    'IVR replacement &amp; enhancement',
                    'Mobile app voice features',
                    'Web browser voice chat',
                    'Smart speaker compatibility',
                    'API-driven integrations'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Voice Bot?</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Transform your customer interactions with AI-powered voice technology that delivers consistent, 
                intelligent, and accessible support experiences across all touchpoints.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Accessibility First',
                  description: 'Voice-based interactions make your services accessible to users with visual impairments or motor disabilities.',
                  icon: Globe
                },
                {
                  title: 'Instant Availability',
                  description: 'Provide immediate voice support 24/7 without wait times or busy signals.',
                  icon: Clock
                },
                {
                  title: 'Natural Interactions',
                  description: 'Engage customers through natural speech patterns that feel intuitive and human-like.',
                  icon: MessageCircle
                },
                {
                  title: 'Scalable Support',
                  description: 'Handle unlimited simultaneous voice interactions without compromising quality.',
                  icon: TrendingUp
                },
                {
                  title: 'Cost Efficiency',
                  description: 'Reduce support costs by up to 70% while improving customer satisfaction scores.',
                  icon: Target
                },
                {
                  title: 'Smart Routing',
                  description: 'Intelligently route complex issues to human agents with full context and history.',
                  icon: Brain
                }
              ].map((benefit, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/30"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-emerald-400" />
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How Voice Bot Works</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                From initial contact to issue resolution, Voice Bot seamlessly handles customer interactions 
                with intelligent voice processing and contextual understanding.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Listen &amp; Understand',
                  description: 'Voice Bot listens to customer inquiries and uses NLP to understand intent, context, and urgency.',
                  icon: Mic
                },
                {
                  step: '02',
                  title: 'Process &amp; Analyze',
                  description: 'AI analyzes the request against knowledge base and customer history for optimal response strategy.',
                  icon: Brain
                },
                {
                  step: '03',
                  title: 'Respond &amp; Interact',
                  description: 'Provides clear, natural voice responses and guides customers through solutions or processes.',
                  icon: Volume2
                },
                {
                  step: '04',
                  title: 'Resolve &amp; Route',
                  description: 'Completes resolution independently or routes to human agents with full context and background.',
                  icon: Target
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-emerald-400 mb-4">{step.step}</div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Voice Bot Use Cases</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how organizations across industries leverage Voice Bot to enhance customer experiences and streamline operations.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: 'Customer Support &amp; Help Desk',
                  description: 'Automate first-level support with intelligent voice interactions that resolve common issues instantly.',
                  icon: Headphones,
                  features: ['Issue diagnosis', 'Solution guidance', 'Ticket creation', 'Agent escalation']
                },
                {
                  title: 'Interactive Voice Response (IVR)',
                  description: 'Replace traditional IVR systems with intelligent voice navigation that understands natural speech.',
                  icon: Phone,
                  features: ['Natural language menus', 'Smart call routing', 'Information lookup', 'Self-service options']
                },
                {
                  title: 'Accessibility Services',
                  description: 'Provide voice-powered access to digital services for users with disabilities or mobility challenges.',
                  icon: Globe,
                  features: ['Voice navigation', 'Audio descriptions', 'Hands-free interaction', 'Screen reader integration']
                },
                {
                  title: 'Voice Commerce &amp; Ordering',
                  description: 'Enable customers to place orders, check status, and manage accounts through natural voice commands.',
                  icon: Activity,
                  features: ['Voice ordering', 'Order tracking', 'Account management', 'Payment processing']
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
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg flex items-center justify-center mr-4">
                      <useCase.icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2" dangerouslySetInnerHTML={{ __html: useCase.title }}></h3>
                      <p className="text-gray-300">{useCase.description}</p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-2 gap-3">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-400">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Technology Features */}
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
                Powered by cutting-edge AI and voice processing technology that delivers natural, intelligent voice interactions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Voice Recognition',
                  description: 'Advanced speech recognition with 97% accuracy across accents and languages',
                  value: '97%',
                  icon: Mic
                },
                {
                  title: 'Response Speed',
                  description: 'Ultra-fast processing and response generation for natural conversation flow',
                  value: '&lt;1s',
                  icon: Zap
                },
                {
                  title: 'Issue Resolution',
                  description: 'High success rate in resolving customer issues without human intervention',
                  value: '89%',
                  icon: Target
                },
                {
                  title: 'Language Support',
                  description: 'Comprehensive support for multiple languages and regional dialects',
                  value: '30+',
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
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="w-8 h-8 text-emerald-400" />
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
          className="py-20 bg-gradient-to-r from-emerald-900/20 via-black to-teal-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Deploy Intelligent Voice Interactions?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your customer experience with Voice Bot technology that understands, responds, and 
              resolves inquiries through natural voice interactions. Start enhancing accessibility and efficiency today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Try Voice Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
