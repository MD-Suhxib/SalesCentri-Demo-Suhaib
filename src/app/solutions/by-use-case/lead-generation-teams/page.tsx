'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Users, Zap, ArrowRight, CheckCircle, TrendingUp, BarChart3, Globe, Phone, MessageSquare, UserCheck } from 'lucide-react';

export default function LeadGenerationTeamsPage() {
  const solutions = [
    {
      icon: Target,
      title: "Lead Generation Acceleration",
      description: "Advanced strategies and tools to identify, attract, and convert high-quality leads faster.",
      benefits: [
        "Multi-channel lead generation campaigns",
        "Advanced prospect identification and scoring",
        "Conversion optimization and funnel management",
        "Lead qualification and handoff processes"
      ],
      metrics: { increase: "250%", quality: "4.8/5", time: "60%" }
    },
    {
      icon: Users,
      title: "Team Performance Optimization",
      description: "Enhance your lead generation team's efficiency with data-driven insights and best practices.",
      benefits: [
        "Performance analytics and KPI tracking",
        "Team training and skill development",
        "Process optimization and standardization",
        "Technology stack integration and automation"
      ],
      metrics: { increase: "180%", quality: "4.6/5", time: "45%" }
    },
    {
      icon: Zap,
      title: "Technology Integration & Automation",
      description: "Leverage cutting-edge tools and automation to scale your lead generation efforts.",
      benefits: [
        "CRM and marketing automation setup",
        "Lead scoring and nurturing workflows",
        "Data enrichment and verification",
        "Real-time analytics and reporting"
      ],
      metrics: { increase: "300%", quality: "4.9/5", time: "70%" }
    }
  ];

  const stats = [
    { label: "Lead Quality Improvement", value: "95%" },
    { label: "Team Productivity Increase", value: "220%" },
    { label: "Cost Per Lead Reduction", value: "40%" },
    { label: "Implementation Success Rate", value: "98%" }
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
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">Lead Generation Teams</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Lead Generation Teams:
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent"> 220% Productivity Increase, 95% Quality Improvement</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Ineffective lead generation strategies waste resources and deliver poor-quality prospects. 
              Our specialized solutions for lead generation teams deliver 220% productivity increases, 
              95% lead quality improvements, and 40% cost-per-lead reductions through optimized processes, 
              advanced technology integration, and data-driven strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Optimize Your Lead Gen Team - Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-emerald-500/30 text-emerald-300 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-500/10 transition-all duration-300 cursor-pointer"
              >
                See Team Transformation Results
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

      {/* Solutions Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Lead Generation Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your lead generation team&apos;s performance with our proven strategies and technologies.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-6">
                  <solution.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{solution.title}</h3>
                <p className="text-gray-300 mb-6">{solution.description}</p>
                
                <div className="space-y-3 mb-6">
                  {solution.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">+{solution.metrics.increase}</div>
                    <div className="text-xs text-gray-400">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{solution.metrics.quality}</div>
                    <div className="text-xs text-gray-400">Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">-{solution.metrics.time}</div>
                    <div className="text-xs text-gray-400">Time</div>
                  </div>
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
            <h2 className="text-4xl font-bold text-white mb-4">Our Lead Generation Optimization Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Systematic approach to transforming your lead generation team&apos;s performance and results.
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
              <h3 className="text-2xl font-bold text-white mb-6">Strategy & Implementation</h3>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, text: "Current performance analysis and benchmarking" },
                  { icon: Target, text: "Custom strategy development and planning" },
                  { icon: Globe, text: "Technology stack optimization and integration" },
                  { icon: UserCheck, text: "Team training and process implementation" }
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
              <h3 className="text-2xl font-bold text-white mb-6">Optimization & Growth</h3>
              <div className="space-y-4">
                {[
                  { icon: BarChart3, text: "Performance monitoring and analytics" },
                  { icon: Zap, text: "Continuous optimization and refinement" },
                  { icon: MessageSquare, text: "Regular reporting and communication" },
                  { icon: Phone, text: "Ongoing support and strategic guidance" }
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
              Ready to Supercharge Your Lead Generation Team?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your team&apos;s performance with proven strategies that deliver higher quality leads and better results.
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
                Get Team Assessment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
