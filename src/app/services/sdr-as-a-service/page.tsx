'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Target, BarChart3, ArrowRight, CheckCircle, Mail } from 'lucide-react';

export default function SDRAsAServicePage() {
  const features = [
    {
      icon: Users,
      title: "Experienced SDR Team",
      description: "Pre-trained and certified sales development reps with industry-specific experience and expertise",
      details: ["Proven track record in B2B prospecting", "Continuous training and skill development", "Industry expertise across verticals"]
    },
    {
      icon: Target,
      title: "Proven SDR Process",
      description: "Systematic prospecting and qualification methodology with multi-touch outreach optimization",
      details: ["CRM management and pipeline development", "Regular performance monitoring and coaching", "Data-driven optimization"]
    },
    {
      icon: BarChart3,
      title: "Transparent Reporting",
      description: "Weekly pipeline and activity reports with lead quality scoring and ROI tracking",
      details: ["Direct access to SDR team members", "Real-time performance dashboards", "Continuous optimization recommendations"]
    }
  ];

  const benefits = [
    {
      stat: "30 Days",
      label: "Time to Market",
      description: "Start generating qualified pipeline immediately"
    },
    {
      stat: "50%",
      label: "Cost Reduction",
      description: "Compared to hiring and training internal SDRs"
    },
    {
      stat: "3x",
      label: "Faster Scaling",
      description: "Scale your sales team up or down instantly"
    },
    {
      stat: "95%",
      label: "Lead Quality Score",
      description: "Consistently high-quality prospect qualification"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Strategy & Setup",
      description: "Define your ideal customer profile and sales process",
      timeline: "Week 1"
    },
    {
      step: "2",
      title: "Team Assignment",
      description: "Match experienced SDRs to your industry and goals",
      timeline: "Week 1"
    },
    {
      step: "3",
      title: "Launch & Execute",
      description: "Begin prospecting with proven methodologies",
      timeline: "Week 2"
    },
    {
      step: "4",
      title: "Optimize & Scale",
      description: "Continuous improvement and performance optimization",
      timeline: "Ongoing"
    }
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
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">SDR as a Service</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Professional Sales Development
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> On-Demand</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Building an effective SDR team requires months of hiring, training, and optimization—time your growing business doesn&apos;t have. Our SDR as a Service provides experienced sales development representatives with proven processes and tools, delivering qualified pipeline in 30 days while you focus on closing deals and growing your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solutions/psa-suite-one-stop-solution" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Launch Your SDR Team - Get Custom Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Schedule Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">{benefit.stat}</div>
                <div className="text-lg font-semibold text-white mb-2">{benefit.label}</div>
                <div className="text-sm text-gray-300">{benefit.description}</div>
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
            <h2 className="text-4xl font-bold text-white mb-4">Complete SDR Outsourcing Solution</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional sales development representatives with proven processes and transparent reporting.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From strategy to execution, we handle everything to get your SDR team up and running fast.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{step.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{step.description}</p>
                  <div className="text-blue-400 text-xs font-medium">{step.timeline}</div>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Links */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Integrated Sales Tools</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our SDR team leverages the complete Sales Centri platform for maximum efficiency.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "SDR Solutions", link: "/solutions/by-use-case/sdr-teams", icon: Target },
              { name: "Prospecting Tools", link: "/platforms/contact-intelligence", icon: Users },
              { name: "Outreach Sequences", link: "/platforms/lead-management", icon: Mail },
              { name: "Pipeline Development", link: "/solutions/psa-suite-one-stop-solution", icon: BarChart3 }
            ].map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link href={tool.link}>
                  <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4 text-center hover:bg-gray-800/50 transition-all duration-300 group-hover:scale-105">
                    <tool.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <div className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">{tool.name}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-purple-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Scale Your Sales Team?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get experienced SDRs working on your pipeline in 30 days. No hiring, no training, no overhead.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solutions/psa-suite-one-stop-solution" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer">
                Schedule Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
