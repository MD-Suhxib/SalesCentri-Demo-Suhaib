'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, CheckCircle, Globe, Shield } from 'lucide-react';

export default function ByIndustryPage() {
  const industries = [
    {
      icon: Building2,
      title: "Technology & SaaS",
      description: "Accelerate growth with specialized sales solutions for tech companies and software platforms.",
      benefits: [
        "Product-led growth optimization",
        "Technical prospect identification",
        "SaaS-specific messaging and positioning",
        "Expansion and upsell strategies"
      ],
      stats: { leads: "200%", conversion: "65%", cycle: "40%" },
      link: "/solutions/by-industry/it"
    },
    {
      icon: Shield,
      title: "Financial Services",
      description: "Compliant sales solutions for banks, fintech, insurance, and investment firms.",
      benefits: [
        "Regulatory compliance management",
        "High-net-worth prospect targeting",
        "Trust-building communication strategies",
        "Multi-touch nurturing campaigns"
      ],
      stats: { leads: "180%", conversion: "55%", cycle: "35%" },
      link: "/solutions/by-industry/finance-banking"
    },
    {
      icon: Globe,
      title: "Manufacturing & Industrial",
      description: "B2B sales strategies for complex, high-value manufacturing and industrial solutions.",
      benefits: [
        "Long sales cycle management",
        "Technical stakeholder engagement",
        "ROI-focused value propositions",
        "Channel partner development"
      ],
      stats: { leads: "150%", conversion: "70%", cycle: "50%" },
      link: "/solutions/by-industry/manufacturing"
    }
  ];

  const stats = [
    { label: "Industries Served", value: "25+" },
    { label: "Avg Lead Increase", value: "175%" },
    { label: "Client Retention Rate", value: "95%" },
    { label: "Implementation Time", value: "2-4 Weeks" }
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
              <Building2 className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Solutions by Industry</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Industry-Specific Solutions:
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent"> 175% Average Lead Increase Across 25+ Industries</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Generic sales approaches fail to address industry-specific challenges, buyer behaviors, and 
              market dynamics. Our industry-specific solutions deliver 175% average lead increases across 
              25+ industries by leveraging deep sector expertise, specialized messaging, and tailored 
              strategies that resonate with your target market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Get Industry-Specific Strategy - Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                View Industry Case Studies
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

      {/* Industries Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Featured Industry Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized sales strategies and solutions designed for your industry&apos;s unique challenges and opportunities.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-6">
                  <industry.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{industry.title}</h3>
                <p className="text-gray-300 mb-6">{industry.description}</p>
                
                <div className="space-y-3 mb-6">
                  {industry.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">+{industry.stats.leads}</div>
                    <div className="text-xs text-gray-400">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">+{industry.stats.conversion}</div>
                    <div className="text-xs text-gray-400">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">-{industry.stats.cycle}</div>
                    <div className="text-xs text-gray-400">Cycle Time</div>
                  </div>
                </div>

                {industry.link && (
                  <Link 
                    href={industry.link}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer w-full"
                  >
                    Explore {industry.title} Solutions
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Industries Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Industries We Serve</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive sales solutions across a wide range of industries and verticals.
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
              <h3 className="text-2xl font-bold text-white mb-6">Technology & Innovation</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/solutions/by-industry/it" className="flex items-center gap-2 hover:text-blue-300 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm hover:text-blue-300">SaaS & Software</span>
                </Link>
                <Link href="/solutions/by-industry/finance-banking" className="flex items-center gap-2 hover:text-blue-300 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm hover:text-blue-300">Fintech & Payments</span>
                </Link>
                {[
                  "Cybersecurity", "AI & Machine Learning",
                  "IoT & Hardware", "Cloud Services", "E-commerce Platforms", "EdTech Solutions"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{item}</span>
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
              <h3 className="text-2xl font-bold text-white mb-6">Traditional Industries</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/solutions/by-industry/it" className="flex items-center gap-2 hover:text-blue-300 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm hover:text-blue-300">Healthcare & Medical</span>
                </Link>
                <Link href="/solutions/by-industry/finance-banking" className="flex items-center gap-2 hover:text-blue-300 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm hover:text-blue-300">Financial Services</span>
                </Link>
                <Link href="/solutions/by-industry/manufacturing" className="flex items-center gap-2 hover:text-blue-300 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm hover:text-blue-300">Manufacturing</span>
                </Link>
                <Link href="/solutions/by-industry/real-estate" className="flex items-center gap-2 hover:text-blue-300 transition-colors cursor-pointer">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm hover:text-blue-300">Real Estate</span>
                </Link>
                {[
                  "Legal Services", "Consulting", "Energy & Utilities", "Logistics & Supply Chain"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-cyan-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Industry-Specific Sales Strategy?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get tailored sales solutions that understand your industry&apos;s unique challenges and opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Request Industry Analysis
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
