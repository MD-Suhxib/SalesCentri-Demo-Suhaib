'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Users, Target, ArrowRight, CheckCircle, TrendingUp, BarChart3, MessageSquare, Phone, UserCheck, Globe } from 'lucide-react';

export default function SalesTeamsPage() {
  const solutions = [
    {
      icon: Target,
      title: "Sales Performance Optimization",
      description: "Advanced strategies and tools to maximize your sales team's closing rates and revenue generation.",
      benefits: [
        "Sales process optimization and standardization",
        "Advanced closing techniques and methodologies",
        "Pipeline management and forecasting accuracy",
        "Performance tracking and KPI management"
      ],
      metrics: { increase: "180%", conversion: "65%", cycle: "40%" }
    },
    {
      icon: Users,
      title: "Team Development & Training",
      description: "Comprehensive training programs and skill development to elevate your sales team's capabilities.",
      benefits: [
        "Customized training programs and workshops",
        "Sales coaching and mentorship programs",
        "Objection handling and negotiation skills",
        "Product knowledge and competitive positioning"
      ],
      metrics: { increase: "220%", conversion: "55%", cycle: "35%" }
    },
    {
      icon: Zap,
      title: "Technology Integration & Automation",
      description: "Leverage cutting-edge sales technologies to streamline processes and increase efficiency.",
      benefits: [
        "CRM optimization and workflow automation",
        "Sales intelligence and prospecting tools",
        "Communication and engagement platforms",
        "Analytics and reporting dashboard setup"
      ],
      metrics: { increase: "300%", conversion: "70%", cycle: "50%" }
    }
  ];

  const stats = [
    { label: "Revenue Increase", value: "230%" },
    { label: "Closing Rate Improvement", value: "85%" },
    { label: "Sales Cycle Reduction", value: "45%" },
    { label: "Team Satisfaction", value: "96%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-indigo-300">Sales Teams</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Sales Teams:
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent"> 230% Revenue Increase, 85% Higher Closing Rates</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Underperforming sales teams miss revenue targets and waste valuable opportunities. Our 
              specialized solutions for sales teams deliver 230% revenue increases, 85% higher closing 
              rates, and 45% sales cycle reductions through performance optimization, advanced training, 
              and technology integration that transforms average performers into top closers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Transform Your Sales Team - Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-indigo-500/30 text-indigo-300 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-500/10 transition-all duration-300 cursor-pointer"
              >
                See Team Success Stories
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
            <h2 className="text-4xl font-bold text-white mb-4">Complete Sales Team Transformation</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Elevate your sales team&apos;s performance with our comprehensive solutions designed for revenue growth.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
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
                    <div className="text-xs text-gray-400">Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">+{solution.metrics.conversion}</div>
                    <div className="text-xs text-gray-400">Closing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">-{solution.metrics.cycle}</div>
                    <div className="text-xs text-gray-400">Cycle</div>
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
            <h2 className="text-4xl font-bold text-white mb-4">Our Sales Team Optimization Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Systematic approach to transforming your sales team into a high-performing revenue generation machine.
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
              <h3 className="text-2xl font-bold text-white mb-6">Assessment & Strategy</h3>
              <div className="space-y-4">
                {[
                  { icon: BarChart3, text: "Current performance analysis and benchmarking" },
                  { icon: Target, text: "Custom strategy development and goal setting" },
                  { icon: UserCheck, text: "Individual skill assessment and gap analysis" },
                  { icon: Globe, text: "Market positioning and competitive analysis" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
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
              <h3 className="text-2xl font-bold text-white mb-6">Implementation & Growth</h3>
              <div className="space-y-4">
                {[
                  { icon: TrendingUp, text: "Training program delivery and coaching" },
                  { icon: Zap, text: "Technology implementation and automation" },
                  { icon: MessageSquare, text: "Performance monitoring and feedback" },
                  { icon: Phone, text: "Ongoing support and optimization" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600/20 to-purple-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Sales Team Performance?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Unlock your sales team&apos;s full potential with proven strategies that drive revenue growth and success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
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
