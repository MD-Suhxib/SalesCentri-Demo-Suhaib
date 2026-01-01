'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Users, Target, ArrowRight, CheckCircle, TrendingUp, Database, Filter, Globe, Mail, Phone, UserCheck } from 'lucide-react';

export default function LeadResearchServicePage() {
  const features = [
    {
      icon: Search,
      title: "Comprehensive Market Research",
      description: "Deep industry analysis and competitor intelligence with TAM/SAM sizing and market opportunity assessment.",
      benefits: [
        "Industry analysis and market sizing",
        "Competitor intelligence and positioning",
        "TAM/SAM opportunity assessment",
        "Market entry strategy recommendations"
      ]
    },
    {
      icon: Target,
      title: "Precision Lead Identification",
      description: "ICP-based prospecting and advanced filtering with multi-channel contact discovery.",
      benefits: [
        "ICP-based prospect identification",
        "Advanced filtering and segmentation",
        "Multi-channel contact discovery",
        "Lead scoring and prioritization"
      ]
    },
    {
      icon: Database,
      title: "Data Intelligence & Enrichment",
      description: "Contact verification and company intelligence with technographic and firmographic data.",
      benefits: [
        "Contact verification and validation",
        "Company intelligence gathering",
        "Technographic and firmographic data",
        "Intent signals and buying behavior"
      ]
    }
  ];

  const stats = [
    { label: "Qualified Leads Delivered", value: "95%" },
    { label: "Data Accuracy Rate", value: "98%" },
    { label: "Research Time Saved", value: "80%" },
    { label: "Lead Quality Score", value: "4.9/5" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">Lead Research as a Service</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Lead Research as a Service:
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"> 95% Qualified Leads with 80% Less Research Time</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Manual lead research consumes valuable selling time and often produces poor-quality prospects. 
              Our Lead Research as a Service delivers 95% qualified leads with verified contact information, 
              comprehensive company intelligence, and buying intent signals—saving your team 80% of research 
              time while improving lead quality scores to 4.9/5.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Get Qualified Leads Weekly - Start Research Service
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-emerald-500/30 text-emerald-300 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer"
              >
                See Sample Research Report
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

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">End-to-End Lead Research Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From market analysis to qualified prospect delivery, we handle the complete research process.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Process Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Research Methodology</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Systematic approach to identifying and qualifying your most valuable prospects.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Market & Prospect Discovery</h3>
              <div className="space-y-4">
                {[
                  { icon: Globe, text: "Industry and market analysis" },
                  { icon: Filter, text: "ICP definition and segmentation" },
                  { icon: TrendingUp, text: "Opportunity sizing and prioritization" },
                  { icon: Users, text: "Decision-maker identification" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Data Collection & Verification</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: "Email discovery and verification" },
                  { icon: Phone, text: "Phone number validation" },
                  { icon: UserCheck, text: "Contact role verification" },
                  { icon: Database, text: "Company intelligence gathering" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600/20 to-teal-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Scale Your Lead Research?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let our research experts deliver qualified prospects while your sales team focuses on closing deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Request Research Proposal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
