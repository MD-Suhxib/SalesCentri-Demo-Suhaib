'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Download, Clock, Star, ArrowRight, TrendingUp, Users, Target, Zap, BarChart3, Lightbulb } from 'lucide-react';

export default function WhitepapersEbooksPage() {
  const whitepapers = [
    {
      title: "The Complete Guide to Sales AI Revolution",
      description: "A comprehensive guide covering everything you need to know about implementing AI in your sales process. Includes case studies, ROI calculations, and step-by-step implementation strategies.",
      type: "Whitepaper",
      category: "AI & Automation",
      featured: true,
      topics: ["AI Implementation", "ROI Analysis", "Case Studies", "Best Practices"],
      filename: "The Complete Guide to Sales AI Revolution.pdf"
    },
    {
      title: "Lead Generation Playbook: From Zero to $1M Pipeline",
      description: "The definitive guide to building a million-dollar sales pipeline. Learn the exact strategies used by top-performing companies to generate and convert high-quality leads.",
      type: "eBook",
      category: "Lead Generation",
      featured: true,
      topics: ["Pipeline Building", "Lead Qualification", "Conversion Strategies", "Scaling Methods"],
      filename: "LEAD GENERATION PLAYBOOK_ FROM ZERO TO $1M PIPELINE.pdf"
    },
    {
      title: "Revenue Optimization Manual: 10x Your Sales Performance",
      description: "Advanced strategies for optimizing every stage of your sales funnel. Includes templates, frameworks, and tools used by Fortune 500 companies.",
      type: "Whitepaper",
      category: "Sales Optimization",
      featured: true,
      topics: ["Funnel Optimization", "Performance Metrics", "Sales Analytics", "Growth Hacking"],
      filename: "Revenue Optimization Manual_ 10x Your Sales Performance.pdf"
    },
    {
      title: "B2B Sales Automation Trends 2024",
      description: "Stay ahead of the curve with the latest trends and predictions for sales automation in B2B markets. Discover emerging technologies and best practices.",
      type: "Report",
      category: "Industry Reports",
      featured: false,
      topics: ["Automation", "Trends", "B2B Sales"],
      filename: "b2b-sales-automation-trends-2024.pdf"
    },
    {
      title: "Customer Acquisition Cost (CAC) Optimization",
      description: "Comprehensive strategies to reduce customer acquisition costs while improving lead quality and conversion rates. Data-driven approaches to maximize ROI.",
      type: "Guide",
      category: "Cost Optimization",
      featured: false,
      topics: ["CAC Reduction", "ROI", "Conversion Optimization"],
      filename: "Customer Acquisition Cost (CAC) Optimization.pdf"
    },
    {
      title: "Sales Team Performance Benchmarks",
      description: "Industry benchmarks and KPIs for measuring sales team performance. Compare your metrics against top-performing organizations.",
      type: "Benchmark Report",
      category: "Analytics",
      featured: false,
      topics: ["Benchmarks", "KPIs", "Performance Metrics"],
      filename: "sales-team-performance-benchmarks.pdf"
    },
    {
      title: "Email Marketing for B2B Sales",
      description: "Complete guide to email marketing strategies that actually convert leads. Learn proven tactics, templates, and automation workflows.",
      type: "eBook",
      category: "Email Marketing",
      featured: false,
      topics: ["Email Campaigns", "B2B Marketing", "Conversion"],
      filename: "email-marketing-for-b2b-sales.pdf"
    },
    {
      title: "Cold Outreach That Converts",
      description: "Proven templates and strategies for cold outreach that gets responses. Master the art of first contact and follow-up sequences.",
      type: "Template Pack",
      category: "Outreach",
      featured: false,
      topics: ["Cold Outreach", "Templates", "Response Rates"],
      filename: "Cold Outreach That Converts.pdf"
    },
    {
      title: "Sales Technology Stack Guide",
      description: "How to build the perfect sales tech stack for maximum efficiency. Evaluation frameworks, integration strategies, and vendor comparisons.",
      type: "Guide",
      category: "Technology",
      featured: false,
      topics: ["Tech Stack", "Tools", "Integration"],
      filename: "Sales Technology Stack Guide.pdf"
    }
  ];

  const featuredContent = whitepapers.filter(wp => wp.featured);
  const allContent = whitepapers.filter(wp => !wp.featured);

  const categories = [
    { name: "AI & Automation", count: 1, icon: Zap },
    { name: "Lead Generation", count: 1, icon: Target },
    { name: "Sales Optimization", count: 1, icon: TrendingUp },
    { name: "Industry Reports", count: 1, icon: BarChart3 },
    { name: "Email Marketing", count: 1, icon: Lightbulb },
    { name: "Technology", count: 1, icon: Users }
  ];

  const stats = [
    { label: "Whitepapers & eBooks", value: "9" },
    { label: "Expert Resources", value: "Free Access" },
    { label: "Categories", value: "6+" },
    { label: "Download Now", value: "No Sign-up" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300">Whitepapers & eBooks</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Expert Knowledge Hub:
              <span className="bg-gradient-to-r from-purple-400 to-blue-600 bg-clip-text text-transparent"> Free Sales Resources</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Access our collection of whitepapers, eBooks, and research reports. Download proven 
              strategies, implementation guides, and data-driven insights to accelerate your sales growth. 
              All resources are completely free with no sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Featured Resources</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our most popular and impactful resources, downloaded by thousands of sales professionals.
            </p>
          </motion.div>
          
          <div className="space-y-8">
            {featuredContent.map((content, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 lg:p-10 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="grid lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        {content.type}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                      <span className="text-gray-400 text-sm">{content.category}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">{content.title}</h3>
                    <p className="text-gray-300 mb-6">{content.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {content.topics.map((topic, topicIndex) => (
                        <span 
                          key={topicIndex}
                          className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-md text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-1 text-center lg:text-right">
                    <div className="mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 mb-4">
                        <BookOpen className="w-10 h-10 text-white" />
                      </div>
                      <div className="text-lg font-bold text-white mb-1">{content.type}</div>
                      <div className="text-gray-400 text-sm">PDF Resource</div>
                    </div>
                    <a 
                      href={`/whitepapers/${content.filename}`}
                      download
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-5 h-5" />
                      Download Free
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Find resources organized by topic to match your specific needs.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{category.count} resources</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-300 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Content Grid */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">More Resources</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Additional whitepapers, eBooks, and guides to accelerate your sales success.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {allContent.map((content, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                    {content.type}
                  </span>
                  <span className="text-gray-400 text-xs">{content.category}</span>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {content.title}
                </h3>
                <p className="text-gray-300 text-sm mb-6">{content.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {content.topics.map((topic, topicIndex) => (
                    <span 
                      key={topicIndex}
                      className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-md text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                
                <a 
                  href={`/whitepapers/${content.filename}`}
                  download
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600/20 to-blue-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Apply These Strategies?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Download our resources and start implementing proven strategies with Sales Centri&apos;s AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-purple-500/30 text-purple-300 px-8 py-4 rounded-xl font-semibold hover:bg-purple-500/10 transition-all duration-300 cursor-pointer"
              >
                Book Strategy Session
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
