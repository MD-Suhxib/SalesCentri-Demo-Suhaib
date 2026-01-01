'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Book, FileText, Video, Users, HelpCircle, Search, Download, ExternalLink } from 'lucide-react';

export default function SupportResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const resources = [
    {
      icon: Book,
      title: 'Getting Started Guide',
      description: 'Complete walkthrough for setting up your account and first campaigns',
      type: 'Guide',
      duration: '15 min read',
      link: '#getting-started'
    },
    {
      icon: Video,
      title: 'Platform Overview Video',
      description: 'Visual tour of Sales Centri features and capabilities',
      type: 'Video',
      duration: '12 min',
      link: '/resources/tutorials-webinars'
    },
    {
      icon: FileText,
      title: 'API Documentation',
      description: 'Technical documentation for developers and integrations',
      type: 'Documentation',
      duration: '30 min read',
      link: '/docs/api-reference'
    },
    {
      icon: Users,
      title: 'Best Practices Webinar',
      description: 'Learn from successful sales teams using Sales Centri',
      type: 'Webinar',
      duration: '45 min',
      link: '/resources/tutorials-webinars'
    }
  ];

  const quickStart = [
    {
      step: 1,
      title: 'Import Your Contacts',
      description: 'Upload your contact list or connect your CRM',
      link: '#contact-import'
    },
    {
      step: 2,
      title: 'Set Up Your First Campaign',
      description: 'Create your first email or calling campaign',
      link: '#campaign-setup'
    },
    {
      step: 3,
      title: 'Configure AI Settings',
      description: 'Customize AI responses and automation rules',
      link: '#ai-configuration'
    },
    {
      step: 4,
      title: 'Launch and Monitor',
      description: 'Start your campaign and track performance',
      link: '#campaign-monitoring'
    }
  ];

  const supportChannels = [
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Search our knowledge base for instant answers',
      action: 'Browse FAQs',
      link: '/resources/faq'
    },
    {
      icon: Users,
      title: 'Live Chat Support',
      description: '24/7 assistance from our support team',
      action: 'Start Chat',
      link: '#'
    },
    {
      icon: Video,
      title: 'Schedule Training Call',
      description: 'One-on-one training session with our experts',
      action: 'Book Session',
      link: '/get-started/book-demo'
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
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Support <span className="text-blue-400">Resources</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Everything you need to get started and succeed with Sales Centri. Access guides, videos, documentation, and expert support.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Quick Start Guide</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStart.map((item, index) => (
                  <motion.div
                    key={item.step}
                    id={item.link && item.link.startsWith('#') ? item.link.slice(1) : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full text-white font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400 mb-4">{item.description}</p>
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Resource Library Section */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Resource Library</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {resources.map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                          <resource.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                            {resource.type}
                          </span>
                          <span className="text-xs text-gray-400">{resource.duration}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-gray-400 mb-4">{resource.description}</p>
                        <Link
                          href={resource.link}
                          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          Access Resource
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Support Channels Section */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold text-white mb-12 text-center">Get Help When You Need It</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {supportChannels.map((channel, index) => (
                  <motion.div
                    key={channel.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 text-center"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-4">
                      <channel.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{channel.title}</h3>
                    <p className="text-gray-400 mb-6">{channel.description}</p>
                    <Link
                      href={channel.link}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      {channel.action}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Download Resources Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/30 rounded-2xl p-8 text-center"
            >
              <Download className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Downloadable Resources</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Access our complete collection of guides, templates, and best practices to accelerate your success with Sales Centri.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/resources/whitepapers-ebooks"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  Download All Resources
                  <Download className="w-5 h-5" />
                </Link>
                <Link
                  href="/get-started/contact/general-questions"
                  className="border border-gray-600 text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Contact Support
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
