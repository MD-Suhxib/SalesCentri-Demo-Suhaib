'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BarChart3, Target, ArrowRight, CheckCircle, Users, Globe, Building2 } from 'lucide-react';

export default function ComparisonCaseStudiesPage() {
  const beforeAfterData = [
    { metric: "Lead Generation", before: "50 leads/month", after: "275 leads/month", improvement: "+450%" },
    { metric: "Conversion Rate", before: "2.1%", after: "8.7%", improvement: "+314%" },
    { metric: "Sales Cycle", before: "90 days", after: "45 days", improvement: "-50%" },
    { metric: "Customer Acquisition Cost", before: "$450", after: "$180", improvement: "-60%" }
  ];

  const benchmarkData = [
    { metric: "Response Rate", industry: "3.2%", our: "12.8%", advantage: "4x higher" },
    { metric: "Lead Quality Score", industry: "3.1/5", our: "4.8/5", advantage: "55% better" },
    { metric: "Implementation Time", industry: "12 weeks", our: "3 weeks", advantage: "75% faster" },
    { metric: "ROI Achievement", industry: "6 months", our: "2 months", advantage: "3x faster" }
  ];

  const comparisons = [
    {
      icon: BarChart3,
      title: "Before vs After Performance",
      description: "See dramatic improvements in key metrics across different business scenarios and implementations.",
      type: "beforeAfter",
      data: beforeAfterData
    },
    {
      icon: Target,
      title: "Industry Benchmark Comparison",
      description: "How our solutions perform against industry standards and competitor alternatives.",
      type: "benchmark",
      data: benchmarkData
    }
  ];

  const caseStudies = [
    {
      icon: Building2,
      company: "TechScale Solutions",
      industry: "SaaS",
      challenge: "Low lead quality and high customer acquisition costs",
      solution: "Implemented comprehensive lead generation and qualification system",
      results: [
        "380% increase in qualified leads",
        "65% reduction in customer acquisition cost",
        "45% improvement in sales cycle time",
        "ROI achieved in 6 weeks"
      ]
    },
    {
      icon: Globe,
      company: "Global Manufacturing Inc",
      industry: "Manufacturing",
      challenge: "Complex B2B sales process with long cycles",
      solution: "Custom workflow automation and advanced nurturing campaigns",
      results: [
        "250% increase in pipeline velocity",
        "70% improvement in lead-to-close rate",
        "50% reduction in sales cycle length",
        "300% ROI within 3 months"
      ]
    },
    {
      icon: Users,
      company: "Financial Services Pro",
      industry: "FinTech",
      challenge: "Regulatory compliance while scaling outreach",
      solution: "Compliant automation with personalized engagement",
      results: [
        "200% increase in compliant outreach",
        "85% improvement in response rates",
        "40% reduction in compliance costs",
        "450% ROI achievement"
      ]
    }
  ];

  const stats = [
    { label: "Case Studies Completed", value: "150+" },
    { label: "Average ROI Improvement", value: "340%" },
    { label: "Client Success Rate", value: "97%" },
    { label: "Implementation Success", value: "99%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300">Comparison Case Studies</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Comparison Case Studies:
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> 340% Average ROI, 97% Success Rate Proven</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              See real results from businesses that transformed their sales performance with our solutions. 
              Our comprehensive case studies demonstrate 340% average ROI improvements, 97% client success 
              rates, and consistent outperformance of industry benchmarks across diverse business scenarios 
              and competitive comparisons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                See Your Potential Results - Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-cyan-500/30 text-cyan-300 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer"
              >
                Download Full Case Studies
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

      {/* Comparison Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Performance Comparisons</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how our solutions consistently outperform industry standards and deliver exceptional results.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {comparisons.map((comparison, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <comparison.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{comparison.title}</h3>
                <p className="text-gray-300 mb-6">{comparison.description}</p>
                
                <div className="space-y-4">
                  {comparison.data.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-gray-900/50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">{item.metric}</span>
                        <span className="text-green-400 font-bold">
                          {comparison.type === 'beforeAfter' 
                            ? (item as typeof beforeAfterData[0]).improvement 
                            : (item as typeof benchmarkData[0]).advantage}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">
                            {comparison.type === 'beforeAfter' ? 'Before:' : 'Industry:'}
                          </span>
                          <span className="text-gray-300 ml-2">
                            {comparison.type === 'beforeAfter' 
                              ? (item as typeof beforeAfterData[0]).before 
                              : (item as typeof benchmarkData[0]).industry}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">
                            {comparison.type === 'beforeAfter' ? 'After:' : 'Our Result:'}
                          </span>
                          <span className="text-white ml-2 font-medium">
                            {comparison.type === 'beforeAfter' 
                              ? (item as typeof beforeAfterData[0]).after 
                              : (item as typeof benchmarkData[0]).our}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Featured Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real businesses, real challenges, real results. See how we&apos;ve helped companies transform their sales performance.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                  <study.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{study.company}</h3>
                <p className="text-cyan-400 text-sm mb-4">{study.industry}</p>
                
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Challenge:</h4>
                  <p className="text-gray-300 text-sm">{study.challenge}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Solution:</h4>
                  <p className="text-gray-300 text-sm">{study.solution}</p>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-3">Results:</h4>
                  <div className="space-y-2">
                    {study.results.map((result, resultIndex) => (
                      <div key={resultIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{result}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-600/20 to-blue-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Be Our Next Success Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the companies that have transformed their sales performance and achieved exceptional results with our solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Request Case Study Analysis
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
