'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Zap, BarChart3, ArrowRight, CheckCircle, Users, Target, TrendingUp, Calendar, MessageSquare, Send, Inbox } from 'lucide-react';

export default function EmailCampaignManagementPage() {
  const features = [
    {
      icon: Mail,
      title: "Campaign Strategy & Design",
      description: "Custom email strategies and responsive template design with A/B testing setup.",
      benefits: [
        "Custom email strategies and sequence mapping",
        "Responsive template design and branding",
        "A/B testing setup and optimization",
        "Segmentation and targeting strategies"
      ]
    },
    {
      icon: Send,
      title: "Automated Workflow Management",
      description: "Drip campaigns and trigger-based automation with behavioral response handling.",
      benefits: [
        "Drip campaigns and nurture sequences",
        "Trigger-based automation and workflows",
        "Behavioral response handling",
        "Lead scoring and progression tracking"
      ]
    },
    {
      icon: BarChart3,
      title: "Performance Analytics & Optimization",
      description: "Real-time campaign analytics and deliverability optimization with ROI tracking.",
      benefits: [
        "Real-time campaign analytics and reporting",
        "Deliverability optimization and monitoring",
        "ROI tracking and conversion attribution",
        "Continuous performance improvement"
      ]
    }
  ];

  const stats = [
    { label: "Open Rate Improvement", value: "45%" },
    { label: "Click-Through Rate", value: "12.3%" },
    { label: "Conversion Increase", value: "85%" },
    { label: "Deliverability Rate", value: "96%" }
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
              <Mail className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300">Email Campaign Management</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Email Campaign Management:
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"> Drive 85% Higher Conversions with Strategic Email Marketing</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Generic email blasts waste opportunities and damage sender reputation. Our Email Campaign 
              Management service creates strategic, personalized campaigns that achieve 45% higher open 
              rates, 12.3% click-through rates, and 85% conversion improvements through data-driven 
              optimization and automated workflows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Launch High-Converting Campaigns - Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-purple-500/30 text-purple-300 px-8 py-4 rounded-xl font-semibold hover:bg-purple-500/10 transition-all duration-300 cursor-pointer"
              >
                See Campaign Examples
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
            <h2 className="text-4xl font-bold text-white mb-4">Complete Campaign Lifecycle Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From strategy to execution, we handle every aspect of your email marketing for maximum impact.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
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

      {/* Campaign Types Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Campaign Types We Manage</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive email marketing solutions tailored to your specific business objectives.
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
              <h3 className="text-2xl font-bold text-white mb-6">Lead Nurturing Campaigns</h3>
              <div className="space-y-4">
                {[
                  { icon: Users, text: "Welcome and onboarding sequences" },
                  { icon: Target, text: "Educational content drip campaigns" },
                  { icon: Calendar, text: "Event-based trigger campaigns" },
                  { icon: TrendingUp, text: "Lead scoring progression workflows" }
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

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Conversion Campaigns</h3>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Product launch announcements" },
                  { icon: MessageSquare, text: "Promotional and sales campaigns" },
                  { icon: Inbox, text: "Win-back and re-engagement" },
                  { icon: BarChart3, text: "Customer retention workflows" }
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600/20 to-pink-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Email Marketing Results?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start driving higher engagement and conversions with our strategic email campaign management service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Request Campaign Strategy
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
