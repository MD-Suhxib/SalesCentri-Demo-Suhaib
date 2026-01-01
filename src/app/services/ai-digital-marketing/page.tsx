'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Target, BarChart3, ArrowRight, CheckCircle, Zap, Globe, TrendingUp, Users, MessageSquare } from 'lucide-react';

export default function AIDigitalMarketingPage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Driven Strategy & Execution",
      description: "Predictive audience targeting and segmentation with automated content creation and optimization",
      details: ["Real-time campaign performance optimization", "Cross-channel attribution and ROI tracking", "Behavioral pattern analysis"]
    },
    {
      icon: Target,
      title: "Lead Generation Focus",
      description: "B2B-specific marketing automation with account-based marketing (ABM) campaigns",
      details: ["Intent data integration and activation", "Sales-qualified lead generation", "Multi-touch attribution modeling"]
    },
    {
      icon: BarChart3,
      title: "Full-Service Support",
      description: "Strategic planning and execution with creative development and testing",
      details: ["Performance monitoring and reporting", "Ongoing optimization and scaling", "Dedicated account management"]
    }
  ];

  const benefits = [
    {
      stat: "250%",
      label: "Lead Generation Increase",
      description: "Average improvement in qualified lead volume"
    },
    {
      stat: "85%",
      label: "Conversion Rate Boost",
      description: "Higher conversion rates through AI optimization"
    },
    {
      stat: "60%",
      label: "Cost Reduction",
      description: "Lower cost per acquisition with smart targeting"
    },
    {
      stat: "3x",
      label: "ROI Improvement",
      description: "Better return on marketing investment"
    }
  ];

  const services = [
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "AI-powered insights to predict customer behavior and optimize campaigns",
      features: ["Customer lifetime value prediction", "Churn risk assessment", "Optimal timing analysis"]
    },
    {
      icon: Users,
      title: "Audience Segmentation",
      description: "Dynamic segmentation based on behavior, intent, and engagement patterns",
      features: ["Real-time persona updates", "Micro-segmentation capabilities", "Cross-platform tracking"]
    },
    {
      icon: MessageSquare,
      title: "Content Optimization",
      description: "AI-generated and optimized content for maximum engagement and conversion",
      features: ["A/B testing automation", "Personalized messaging", "Performance-driven iteration"]
    },
    {
      icon: Globe,
      title: "Omnichannel Campaigns",
      description: "Coordinated campaigns across all digital channels with unified messaging",
      features: ["Cross-channel attribution", "Unified customer journey", "Consistent brand experience"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300">AI Digital Marketing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Comprehensive AI
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"> Marketing Services</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Transform your marketing strategy with AI-driven campaigns that deliver measurable results. Our comprehensive AI marketing services combine predictive analytics, automated optimization, and strategic expertise to accelerate your growth and maximize ROI across all digital channels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solutions/psa-suite-one-stop-solution" className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Accelerate Your Digital Marketing - Get Custom Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="border border-purple-500/30 text-purple-300 px-8 py-4 rounded-xl font-semibold hover:bg-purple-500/10 transition-all duration-300 cursor-pointer">
                Schedule Strategy Call
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
                <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-2">{benefit.stat}</div>
                <div className="text-lg font-semibold text-white mb-2">{benefit.label}</div>
                <div className="text-sm text-gray-300">{benefit.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive AI Marketing Services</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Strategic planning, execution, and optimization powered by advanced AI algorithms.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
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

      {/* Services Grid */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">AI-Powered Marketing Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI technologies that transform your marketing performance and customer engagement.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{service.title}</h3>
                    <p className="text-gray-300 mb-4">{service.description}</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
            <h2 className="text-4xl font-bold text-white mb-4">Integrated Marketing Tools</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Seamlessly connect with our comprehensive sales and marketing automation platform.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Lead Generation", link: "/platforms/lead-management", icon: Target },
              { name: "Marketing Automation", link: "/platforms/lead-management", icon: Zap },
              { name: "ABM Campaigns", link: "/platforms/contact-intelligence", icon: Users },
              { name: "Performance Tracking", link: "/resources/performance-benchmarks", icon: BarChart3 }
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
                    <tool.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-white font-medium text-sm group-hover:text-purple-300 transition-colors">{tool.name}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600/20 to-blue-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Leverage AI-powered marketing strategies to accelerate growth and maximize your ROI across all channels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solutions/psa-suite-one-stop-solution" className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contact" className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer">
                Schedule Strategy Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
