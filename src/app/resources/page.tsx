'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Video, Download, ArrowRight, BarChart3, HelpCircle, TrendingUp, Rocket } from 'lucide-react';

export default function ResourcesPage() {
  const resourceCategories = [
    {
      icon: BarChart3,
      title: "Case Studies",
      description: "Real success stories from businesses that transformed their sales with Sales Centri",
      href: "/resources/case-studies",
      items: ["Enterprise Growth Stories", "SMB Success Cases", "Industry-Specific Results", "ROI Documentation"]
    },
    {
      icon: BookOpen,
      title: "Whitepapers & eBooks",
      description: "In-depth guides and research on sales optimization and AI automation",
      href: "/resources/whitepapers-ebooks",
      items: ["Sales AI Revolution Guide", "Lead Generation Playbook", "Revenue Optimization Manual", "Future of Sales Report"]
    },
    {
      icon: Video,
      title: "Tutorials & Webinars",
      description: "Expert-led training sessions and how-to guides for maximizing your results",
      href: "/resources/tutorials-webinars",
      items: ["Platform Setup Guides", "Best Practices Webinars", "Expert Interviews", "Feature Deep-Dives"]
    },
    {
      icon: Video,
      title: "Demo Videos",
      description: "Watch product demonstrations and see Sales Centri in action across all features",
      href: "/demo",
      items: ["Lightning Mode Demo", "Focus Mode Demo", "Dashboard Overview", "MultiGPT Demo", "ResearchGPT Demo"]
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Frequently asked questions about Sales Centri features, pricing, and support",
      href: "/resources/faq",
      items: ["General Questions", "Pricing & Plans", "Technical Support", "Feature Requests"]
    },
    {
      icon: Download,
      title: "Print Media OCR",
      description: "Upload print media files (PDF/images) for OCR and receive parsed structured results.",
      href: "/resources/print-media-ocr",
      items: ["PDF & Image Upload", "High-accuracy OCR", "CSV/Excel Output", "Secure & Fast"]
    },
    {
      icon: Rocket,
      title: "Startup Program",
      description: "Global initiatives, funding programs, and partner perks designed for high-growth startups",
      href: "/resources/startup-program",
      items: ["Accelerator Partnerships", "Regional Growth Funds", "Co-marketing Opportunities", "GTM Playbooks"]
    },
    {
      icon: TrendingUp,
      title: "Performance Benchmarks",
      description: "Industry benchmarks and performance metrics to measure your success",
      href: "/resources/performance-benchmarks",
      items: ["Industry Standards", "Success Metrics", "Performance Reports", "Competitive Analysis"]
    }
  ];

  const featuredResources = [
    {
      type: "Case Study",
      title: "How TechCorp Increased Sales by 340% with Sales Centri",
      description: "Enterprise software company achieves record-breaking growth using our AI-powered sales automation.",
      downloadUrl: "/whitepapers/sales-team-performance-benchmarks.pdf",
      readTime: "8 min read"
    },
    {
      type: "Whitepaper",
      title: "The Complete Guide to Sales AI Revolution",
      description: "A comprehensive 50-page guide covering everything you need to know about AI in sales.",
      downloadUrl: "/whitepapers/The Complete Guide to Sales AI Revolution.pdf",
      readTime: "25 min read"
    },
    {
      type: "Webinar",
      title: "Building High-Converting Sales Funnels with AI",
      description: "Live session with our experts showing proven strategies for funnel optimization.",
      downloadUrl: "https://cdn.salescentri.com/dashboard-demo-video.mp4",
      readTime: "45 min watch"
    }
  ];

  const stats = [
    { label: "Resources Available", value: "500+" },
    { label: "Hours of Content", value: "1,200+" },
    { label: "Downloads This Month", value: "25,000+" },
    { label: "Success Stories", value: "1,500+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Resource Center</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sales Knowledge Hub:
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> 500+ Expert Resources</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Access our comprehensive library of case studies, whitepapers, tutorials, and expert insights. 
              Learn from real success stories, industry benchmarks, and proven strategies that have helped 
              thousands of businesses transform their sales performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/resources/case-studies" 
                className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                Browse Case Studies
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

      {/* Featured Resources */}
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
              Our most popular and impactful resources, handpicked by our experts.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {resource.type}
                  </span>
                  <span className="text-gray-400 text-sm">{resource.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-300 mb-6">{resource.description}</p>
                <a href={resource.downloadUrl} download className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                  <Download className="w-4 h-4" />
                  Download Now
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Resource Categories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our comprehensive collection of resources organized by category.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {resourceCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-300 mb-4">{category.description}</p>
                    <div className="space-y-2 mb-6">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-400 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link 
                      href={category.href}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      Explore {category.title}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-blue-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Sales?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start implementing the strategies and insights from our resource library today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Book Expert Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
