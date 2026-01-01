'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Building2, ArrowRight, Award, Zap } from 'lucide-react';

export default function CaseStudiesPage() {
  const featuredCases = [
    {
      company: "TechCorp Solutions",
      industry: "Enterprise Software",
      size: "500+ employees",
      challenge: "Low conversion rates and inefficient lead qualification",
      solution: "SalesGPT AI automation with custom workflow integration",
      results: {
        revenue: "+340%",
        conversion: "+185%",
        leads: "+450%",
        time: "-65%"
      },
      testimonial: "Sales Centri transformed our entire sales process. We went from struggling with lead quality to closing enterprise deals 3x faster.",
      author: "Sarah Johnson, VP of Sales",
      featured: true
    },
    {
      company: "GrowthTech Industries",
      industry: "B2B SaaS",
      size: "100-200 employees",
      challenge: "Manual lead research consuming 70% of sales team time",
      solution: "Lead Research as a Service + AI-powered data enrichment",
      results: {
        revenue: "+280%",
        conversion: "+150%",
        leads: "+380%",
        time: "-75%"
      },
      testimonial: "The ROI was immediate. Our sales team now focuses on selling instead of researching, and our close rates have never been higher.",
      author: "Michael Rodriguez, CEO",
      featured: true
    },
    {
      company: "ScaleUp Dynamics",
      industry: "Marketing Technology",
      size: "50-100 employees",
      challenge: "Inconsistent outreach and poor email response rates",
      solution: "LinkedIn Outreach + Email Campaign Management with AI personalization",
      results: {
        revenue: "+320%",
        conversion: "+200%",
        leads: "+400%",
        time: "-60%"
      },
      testimonial: "Our outreach went from generic to highly personalized overnight. Response rates increased by 200% in the first month.",
      author: "Jennifer Chen, Head of Growth",
      featured: true
    }
  ];

  const moreCases = [
    {
      company: "Enterprise Global",
      industry: "Manufacturing",
      size: "1000+ employees",
      results: { revenue: "+250%", conversion: "+120%", leads: "+300%", time: "-50%" }
    },
    {
      company: "StartupX",
      industry: "FinTech",
      size: "20-50 employees",
      results: { revenue: "+400%", conversion: "+180%", leads: "+500%", time: "-70%" }
    },
    {
      company: "MidMarket Pro",
      industry: "Healthcare",
      size: "200-500 employees",
      results: { revenue: "+290%", conversion: "+160%", leads: "+350%", time: "-55%" }
    },
    {
      company: "Innovation Labs",
      industry: "AI/ML",
      size: "100-200 employees",
      results: { revenue: "+380%", conversion: "+220%", leads: "+450%", time: "-80%" }
    }
  ];

  const industries = [
    { name: "Enterprise Software", cases: 45, avgGrowth: "+285%" },
    { name: "B2B SaaS", cases: 38, avgGrowth: "+310%" },
    { name: "Marketing Technology", cases: 32, avgGrowth: "+295%" },
    { name: "FinTech", cases: 28, avgGrowth: "+340%" },
    { name: "Healthcare", cases: 25, avgGrowth: "+265%" },
    { name: "Manufacturing", cases: 22, avgGrowth: "+220%" }
  ];

  const stats = [
    { label: "Success Stories", value: "1,500+" },
    { label: "Average Revenue Growth", value: "+295%" },
    { label: "Client Retention Rate", value: "97%" },
    { label: "Industries Served", value: "25+" }
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
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Success Stories</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Real Results from Real Companies:
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> 1,500+ Success Stories</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Discover how businesses across 25+ industries have transformed their sales performance 
              with Sales Centri. From startups to Fortune 500 companies, see the proven results that 
              have generated over $2 billion in additional revenue for our clients.
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
                href="/get-started/book-demo" 
                className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                Schedule Strategy Call
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

      {/* Featured Case Studies */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
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
              Deep-dive into our most impactful transformations across different industries and company sizes.
            </p>
          </motion.div>
          
          <div className="space-y-12">
            {featuredCases.map((caseStudy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 lg:p-12 backdrop-blur-sm"
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Company Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="w-6 h-6 text-blue-400" />
                      <h3 className="text-2xl font-bold text-white">{caseStudy.company}</h3>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Industry:</span>
                        <span className="text-blue-300 font-medium">{caseStudy.industry}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Size:</span>
                        <span className="text-white font-medium">{caseStudy.size}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Challenge:</h4>
                        <p className="text-gray-300 text-sm">{caseStudy.challenge}</p>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Solution:</h4>
                        <p className="text-gray-300 text-sm">{caseStudy.solution}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Results */}
                  <div className="lg:col-span-1">
                    <h4 className="text-xl font-bold text-white mb-6">Results Achieved:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                        <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-400 mb-1">{caseStudy.results.revenue}</div>
                        <div className="text-gray-300 text-xs">Revenue Growth</div>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                        <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-400 mb-1">{caseStudy.results.conversion}</div>
                        <div className="text-gray-300 text-xs">Conversion Rate</div>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                                                 <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                         <div className="text-2xl font-bold text-blue-400 mb-1">{caseStudy.results.leads}</div>
                        <div className="text-gray-300 text-xs">Lead Generation</div>
                      </div>
                      <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                        <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-400 mb-1">{caseStudy.results.time}</div>
                        <div className="text-gray-300 text-xs">Time Saved</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Testimonial */}
                  <div className="lg:col-span-1">
                    <h4 className="text-xl font-bold text-white mb-6">Client Testimonial:</h4>
                    <blockquote className="text-gray-300 italic mb-4">
                      &ldquo;{caseStudy.testimonial}&rdquo;
                    </blockquote>
                    <div className="text-blue-400 font-medium">— {caseStudy.author}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* More Success Stories */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">More Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Quick overview of additional client transformations across various industries.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {moreCases.map((caseStudy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold text-white">{caseStudy.company}</h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <span>{caseStudy.industry}</span>
                  <span>•</span>
                  <span>{caseStudy.size}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{caseStudy.results.revenue}</div>
                    <div className="text-gray-400 text-xs">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{caseStudy.results.conversion}</div>
                    <div className="text-gray-400 text-xs">Conversion</div>
                  </div>
                  <div className="text-center">
                                         <div className="text-lg font-bold text-blue-400">{caseStudy.results.leads}</div>
                    <div className="text-gray-400 text-xs">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-400">{caseStudy.results.time}</div>
                    <div className="text-gray-400 text-xs">Time Saved</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Breakdown */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Success by Industry</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See how companies in your industry have achieved exceptional results with Sales Centri.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-3">{industry.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Success Stories:</span>
                  <span className="text-blue-400 font-semibold">{industry.cases}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Avg. Growth:</span>
                  <span className="text-blue-400 font-semibold text-lg">{industry.avgGrowth}</span>
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
              Ready to Be Our Next Success Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 1,500+ companies that have transformed their sales performance. Start your journey today.
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
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Get Custom Strategy
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
