'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Calendar, Clock, Users, BookOpen, Video } from 'lucide-react';

export default function TutorialsWebinarsPage() {
  const [activeTab, setActiveTab] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', count: 24 },
    { id: 'webinars', name: 'Live Webinars', count: 8 },
    { id: 'tutorials', name: 'Video Tutorials', count: 12 },
    { id: 'certification', name: 'Certification Courses', count: 4 }
  ];

  const upcomingWebinars = [
    {
      title: 'Advanced Email Automation Strategies for Q1 2025',
      date: 'February 15, 2025',
      time: '2:00 PM EST',
      duration: '60 minutes',
      presenter: 'Sarah Chen, Head of Sales Automation',
      description: 'Learn the latest email automation techniques that are driving 300% higher response rates',
      registrants: 847,
      type: 'webinar',
      level: 'Advanced',
      link: '/get-started/book-demo'
    },
    {
      title: 'Building Your First AI-Powered Sales Funnel',
      date: 'February 22, 2025',
      time: '1:00 PM EST',
      duration: '45 minutes',
      presenter: 'Mike Rodriguez, Customer Success Manager',
      description: 'Step-by-step guide to creating automated sales funnels that convert 40% better',
      registrants: 623,
      type: 'webinar',
      level: 'Beginner',
      link: '/get-started/book-demo'
    },
    {
      title: 'CRM Integration Masterclass: Salesforce & HubSpot',
      date: 'March 1, 2025',
      time: '3:00 PM EST',
      duration: '90 minutes',
      presenter: 'Alex Thompson, Integration Specialist',
      description: 'Master complex CRM integrations and data synchronization best practices',
      registrants: 412,
      type: 'webinar',
      level: 'Intermediate',
      link: '/get-started/book-demo'
    }
  ];

  const tutorials = [
    {
      title: 'Getting Started with Sales Centri Platform',
      duration: '15 minutes',
      views: '12.4K',
      description: 'Complete walkthrough of platform setup and initial configuration',
      type: 'tutorial',
      level: 'Beginner',
      category: 'Platform Basics',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      link: '/get-started/free-trial/support-resources#getting-started'
    },
    {
      title: 'Advanced Lead Scoring Techniques',
      duration: '25 minutes',
      views: '8.7K',
      description: 'Set up sophisticated lead scoring models using AI and behavioral data',
      type: 'tutorial',
      level: 'Advanced',
      category: 'Lead Management',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
      link: '/get-started/free-trial/support-resources'
    },
    {
      title: 'Email Sequence Automation Workshop',
      duration: '35 minutes',
      views: '15.2K',
      description: 'Create high-converting email sequences with personalization and timing optimization',
      type: 'tutorial',
      level: 'Intermediate',
      category: 'Email Marketing',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=225&fit=crop',
      link: '/get-started/free-trial/support-resources'
    },
    {
      title: 'Voice AI Setup and Optimization',
      duration: '20 minutes',
      views: '6.3K',
      description: 'Configure voice AI systems for maximum call conversion rates',
      type: 'tutorial',
      level: 'Intermediate',
      category: 'Voice AI',
      thumbnail: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400&h=225&fit=crop',
      link: '/get-started/free-trial/support-resources'
    },
    {
      title: 'Analytics and Reporting Deep Dive',
      duration: '30 minutes',
      views: '9.8K',
      description: 'Master advanced analytics features and create custom performance reports',
      type: 'tutorial',
      level: 'Advanced',
      category: 'Analytics',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
      link: '/get-started/free-trial/support-resources'
    },
    {
      title: 'Multi-Channel Campaign Management',
      duration: '40 minutes',
      views: '11.1K',
      description: 'Coordinate email, voice, and social campaigns for maximum impact',
      type: 'tutorial',
      level: 'Advanced',
      category: 'Campaign Management',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
      link: '/get-started/free-trial/support-resources'
    }
  ];

  const certificationCourses = [
    {
      title: 'Sales Centri Certified Sales Automation Specialist',
      duration: '8 hours',
      modules: 12,
      description: 'Comprehensive certification covering all aspects of sales automation implementation and optimization',
      type: 'certification',
      level: 'Professional',
      participants: '2.1K',
      completion: '94%',
      badge: 'Professional Certification',
      link: '/get-started/book-demo'
    },
    {
      title: 'Advanced AI Integration Certification',
      duration: '6 hours',
      modules: 8,
      description: 'Deep dive into AI features, machine learning optimization, and advanced automation strategies',
      type: 'certification',
      level: 'Expert',
      participants: '847',
      completion: '87%',
      badge: 'Expert Certification',
      link: '/get-started/book-demo'
    },
    {
      title: 'Sales Manager Leadership Program',
      duration: '10 hours',
      modules: 15,
      description: 'Management-focused program covering team optimization, performance analytics, and strategic implementation',
      type: 'certification',
      level: 'Leadership',
      participants: '1.3K',
      completion: '91%',
      badge: 'Leadership Certification',
      link: '/get-started/book-demo'
    },
    {
      title: 'Partner Implementation Specialist',
      duration: '12 hours',
      modules: 18,
      description: 'Complete partner training program for agencies and consultants offering Sales Centri services',
      type: 'certification',
      level: 'Partner',
      participants: '456',
      completion: '96%',
      badge: 'Partner Certification',
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
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Sales Automation <span className="text-blue-400">Training</span>
              <br />Webinars, Tutorials & Best Practices
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Master sales automation with our comprehensive training resources designed for users at every skill level. 
              From beginner tutorials to advanced strategy webinars, our expert-led content helps you maximize your 
              investment and achieve better results from your sales automation efforts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      {(activeTab === 'all' || activeTab === 'webinars') && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-400" />
                Live Webinar Series
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join our weekly webinars featuring industry experts, product training, and Q&A sessions
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-1 gap-6 mb-16">
              {upcomingWebinars.map((webinar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={
                          webinar.level === 'Beginner' ? 'bg-blue-500/20 text-blue-400' :
                          webinar.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-blue-500/20 text-blue-400'
                        }>
                          {webinar.level}
                        </span>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                          Live Webinar
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{webinar.title}</h3>
                      <p className="text-gray-300 mb-4">{webinar.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {webinar.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {webinar.time} ({webinar.duration})
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {webinar.registrants} registered
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 mt-2">Presented by {webinar.presenter}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Link href={webinar.link} className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                        Register Free
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Tutorials */}
      {(activeTab === 'all' || activeTab === 'tutorials') && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <Video className="w-8 h-8 text-blue-400" />
                Step-by-Step Tutorials
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Master platform features with detailed video tutorials and implementation guides
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {tutorials.map((tutorial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:bg-gray-800/70 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${tutorial.thumbnail})` }}
                    >
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-blue-500 rounded-full p-3 hover:bg-blue-600 transition-colors cursor-pointer">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={
                        tutorial.level === 'Beginner' ? 'bg-blue-500/20 text-blue-400' :
                        tutorial.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-blue-500/20 text-blue-400'
                      }>
                        {tutorial.level}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {tutorial.duration}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                        {tutorial.category}
                      </span>
                      <span className="text-gray-400 text-sm">{tutorial.views} views</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{tutorial.title}</h3>
                    <p className="text-gray-300 text-sm mb-4">{tutorial.description}</p>
                    <Link href={tutorial.link} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 cursor-pointer">
                      Watch Tutorial <Play className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certification Courses */}
      {(activeTab === 'all' || activeTab === 'certification') && (
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-400" />
                Advanced Training Programs
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Earn official certifications and advance your sales automation expertise
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {certificationCourses.map((course, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={
                      course.level === 'Leadership' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-blue-500/20 text-blue-400'
                    }>
                      {course.level}
                    </span>
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {course.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{course.title}</h3>
                  <p className="text-gray-300 mb-4">{course.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Clock className="w-4 h-4" />
                        Duration
                      </div>
                      <div className="text-white font-semibold">{course.duration}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <BookOpen className="w-4 h-4" />
                        Modules
                      </div>
                      <div className="text-white font-semibold">{course.modules}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                        <Users className="w-4 h-4" />
                        Participants
                      </div>
                      <div className="text-white font-semibold">{course.participants}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Completion Rate</div>
                      <div className="text-white font-semibold">{course.completion}</div>
                    </div>
                  </div>
                  
                  <Link href={course.link} className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer w-full">
                    Enroll Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Join Our Next Training Session
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Register for free webinars and start mastering sales automation today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Register Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/solutions/psa-suite-one-stop-solution" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                View Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  );
}
