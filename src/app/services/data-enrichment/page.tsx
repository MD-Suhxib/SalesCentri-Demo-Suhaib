'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Shield, BarChart3, ArrowRight, CheckCircle, Search, Target, TrendingUp, Globe, Users, Mail, Phone } from 'lucide-react';

export default function DataEnrichmentPage() {
  const features = [
    {
      icon: Search,
      title: "Contact Information Enrichment",
      description: "Missing email and phone number discovery with contact verification and validation.",
      benefits: [
        "Missing email and phone number discovery",
        "Contact verification and validation",
        "Job title and role standardization",
        "Social media profile linking"
      ]
    },
    {
      icon: Database,
      title: "Company Intelligence Addition",
      description: "Firmographic data and company profiles with technographic information and tech stack.",
      benefits: [
        "Firmographic data and company profiles",
        "Technographic information and tech stack",
        "Financial data and funding information",
        "Industry classification and market position"
      ]
    },
    {
      icon: TrendingUp,
      title: "Behavioral and Intent Data",
      description: "Website activity and engagement tracking with content consumption and interest mapping.",
      benefits: [
        "Website activity and engagement tracking",
        "Content consumption and interest mapping",
        "Buying intent signals and scoring",
        "Competitive intelligence gathering"
      ]
    }
  ];

  const stats = [
    { label: "Data Quality Improvement", value: "95%" },
    { label: "Email Deliverability", value: "87%" },
    { label: "Response Rate Increase", value: "65%" },
    { label: "Lead Quality Score", value: "4.8/5" }
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
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300">Data Enrichment Services</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Data Enrichment:
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Transform Incomplete Records Into Sales-Ready Leads</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Incomplete contact records waste your sales team&apos;s time and limit campaign effectiveness. Our 
              Data Enrichment service fills gaps in your database with verified contact information, company 
              intelligence, and behavioral data—improving data quality by 95% and increasing email 
              deliverability while reducing bounce rates and improving response rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Enrich Your Database Today - Get Custom Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-cyan-500/30 text-cyan-300 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer"
              >
                See Sample Report
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
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Database Enhancement</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Fill every gap in your contact database with accurate, up-to-date information that drives better results.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
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

      {/* Process Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Our Data Enrichment Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Systematic approach to transforming your incomplete database into a high-quality lead source.
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
              <h3 className="text-2xl font-bold text-white mb-6">Data Collection & Verification</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, text: "Email discovery and verification" },
                  { icon: Phone, text: "Phone number validation and formatting" },
                  { icon: Users, text: "Professional profile matching" },
                  { icon: Shield, text: "Data accuracy verification" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
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
              <h3 className="text-2xl font-bold text-white mb-6">Intelligence & Analysis</h3>
              <div className="space-y-4">
                {[
                  { icon: Database, text: "Company intelligence gathering" },
                  { icon: BarChart3, text: "Behavioral data analysis" },
                  { icon: Target, text: "Intent signal identification" },
                  { icon: Globe, text: "Market positioning insights" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cyan-600/20 to-blue-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Enhance Your Database Quality?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your incomplete contact records into sales-ready leads with our comprehensive data enrichment service.
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
                Get Custom Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
