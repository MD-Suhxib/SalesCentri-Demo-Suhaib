'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Clock, Users, CheckCircle, Calendar, Video } from 'lucide-react';

export default function LiveQAPage() {
  const [selectedTopic, setSelectedTopic] = useState('general');

  const qaSessions = [
    {
      id: 'general',
      title: 'General Q&A Session',
      date: 'August 15, 2025',
      time: '2:00 PM EST',
      duration: '45 minutes',
      description: 'Open discussion about Sales Centri features, pricing, and implementation',
      topics: ['Platform overview', 'Pricing questions', 'Implementation timeline', 'Integration capabilities'],
      spots: 12,
      icon: MessageCircle
    },
    {
      id: 'technical',
      title: 'Technical Deep Dive',
      date: 'August 18, 2025',
      time: '3:00 PM EST',
      duration: '60 minutes',
      description: 'Technical discussion for developers and IT teams',
      topics: ['API documentation', 'Security protocols', 'Custom integrations', 'Data migration'],
      spots: 8,
      icon: Users
    },
    {
      id: 'sales-focused',
      title: 'Sales Team Focused Session',
      date: 'August 22, 2025',
      time: '1:00 PM EST',
      duration: '30 minutes',
      description: 'Dedicated session for sales managers and team leads',
      topics: ['Sales automation', 'Team management', 'Performance tracking', 'Best practices'],
      spots: 15,
      icon: CheckCircle
    }
  ];

  const commonQuestions = [
    {
      question: 'How quickly can we implement Sales Centri?',
      answer: 'Most teams are up and running within 2-4 weeks, depending on integration complexity.'
    },
    {
      question: 'What integrations are available?',
      answer: 'We support 50+ integrations including Salesforce, HubSpot, Pipedrive, and custom APIs.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial with full access to core features.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: '24/7 chat support, dedicated account managers, and comprehensive documentation.'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Live <span className="text-blue-400">Q&A Sessions</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join our expert-led Q&A sessions to get your questions answered in real-time. Connect with our team and other prospects to learn more about Sales Centri.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Upcoming Sessions */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Upcoming Sessions</h2>
              <p className="text-xl text-gray-300">Choose the session that best fits your needs</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              {qaSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className={`bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer ${
                    selectedTopic === session.id ? 'border-blue-500' : 'border-gray-700/50'
                  }`}
                  onClick={() => setSelectedTopic(session.id)}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
                      <session.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{session.title}</h3>
                      <p className="text-blue-400">{session.spots} spots available</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>{session.time} ({session.duration})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{session.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Topics covered:</h4>
                    <ul className="space-y-2">
                      {session.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="text-gray-300 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 w-full justify-center">
                    <Video className="w-5 h-5" />
                    Reserve Your Spot
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Questions */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-300">Get quick answers to common questions</p>
            </motion.div>

            <div className="space-y-6">
              {commonQuestions.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Can&apos;t Wait for the Next Session?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Book a private demo or start your free trial today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started/book-demo" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105">
                  Book Private Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/get-started/free-trial" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300">
                  Start Free Trial
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
