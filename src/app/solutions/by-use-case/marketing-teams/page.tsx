'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Target, BarChart3, ArrowRight, CheckCircle, Users, Zap, Globe, MessageSquare, Phone, UserCheck } from 'lucide-react';

export default function MarketingTeamsPage() {
  const solutions = [
    {
      icon: Target,
      title: "Campaign Performance Optimization",
      description: "Advanced strategies and analytics to maximize your marketing campaigns' ROI and conversion rates.",
      benefits: [
        "Multi-channel campaign optimization",
        "Advanced audience targeting and segmentation",
        "Conversion funnel analysis and improvement",
        "Attribution modeling and ROI tracking"
      ],
      metrics: { increase: "280%", conversion: "75%", cost: "45%" }
    },
    {
      icon: Users,
      title: "Lead Generation & Nurturing",
      description: "Comprehensive lead generation strategies that attract, engage, and convert high-quality prospects.",
      benefits: [
        "Inbound marketing strategy development",
        "Content marketing and SEO optimization",
        "Marketing automation and lead nurturing",
        "Lead scoring and qualification systems"
      ],
      metrics: { increase: "320%", conversion: "65%", cost: "40%" }
    },
    {
      icon: BarChart3,
      title: "Data-Driven Marketing Intelligence",
      description: "Leverage advanced analytics and AI to make informed marketing decisions and predictions.",
      benefits: [
        "Advanced marketing analytics and reporting",
        "Predictive modeling and forecasting",
        "Customer journey mapping and optimization",
        "Competitive intelligence and market research"
      ],
      metrics: { increase: "250%", conversion: "80%", cost: "50%" }
    }
  ];

  const stats = [
    { label: "Marketing ROI Increase", value: "285%" },
    { label: "Lead Quality Improvement", value: "90%" },
    { label: "Cost Per Acquisition Reduction", value: "55%" },
    { label: "Campaign Success Rate", value: "94%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              <span className="text-pink-300">Marketing Teams</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Marketing Teams:
              <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent"> 285% ROI Increase, 90% Lead Quality Improvement</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Ineffective marketing campaigns waste budgets and fail to generate quality leads. Our 
              specialized solutions for marketing teams deliver 285% ROI increases, 90% lead quality 
              improvements, and 55% cost-per-acquisition reductions through data-driven strategies, 
              advanced analytics, and optimized campaign management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Optimize Your Marketing - Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-pink-500/30 text-pink-300 px-8 py-4 rounded-xl font-semibold hover:bg-pink-500/10 transition-all duration-300 cursor-pointer"
              >
                See Marketing Success Stories
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
            <h2 className="text-4xl font-bold text-white mb-4">Complete Marketing Team Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform your marketing performance with our comprehensive solutions designed for maximum ROI.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-pink-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
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
                    <div className="text-xs text-gray-400">ROI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">+{solution.metrics.conversion}</div>
                    <div className="text-xs text-gray-400">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">-{solution.metrics.cost}</div>
                    <div className="text-xs text-gray-400">Cost</div>
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
            <h2 className="text-4xl font-bold text-white mb-4">Our Marketing Optimization Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Systematic approach to transforming your marketing team into a high-performing lead generation engine.
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
              <h3 className="text-2xl font-bold text-white mb-6">Analysis & Strategy</h3>
              <div className="space-y-4">
                {[
                  { icon: BarChart3, text: "Current campaign performance analysis" },
                  { icon: Target, text: "Audience research and segmentation" },
                  { icon: Globe, text: "Competitive analysis and positioning" },
                  { icon: UserCheck, text: "Customer journey mapping and optimization" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
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
              <h3 className="text-2xl font-bold text-white mb-6">Implementation & Optimization</h3>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Campaign setup and automation" },
                  { icon: TrendingUp, text: "Performance monitoring and optimization" },
                  { icon: MessageSquare, text: "Regular reporting and insights" },
                  { icon: Phone, text: "Ongoing support and strategy refinement" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-600/20 to-purple-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Maximize Your Marketing ROI?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform your marketing performance with data-driven strategies that deliver exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Get Marketing Audit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
