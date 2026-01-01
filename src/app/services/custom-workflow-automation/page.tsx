'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Workflow, Zap, Settings, ArrowRight, CheckCircle, GitBranch, Target, BarChart3, Clock, Cog, Repeat, Shield } from 'lucide-react';

export default function CustomWorkflowAutomationPage() {
  const features = [
    {
      icon: Workflow,
      title: "Custom Process Automation",
      description: "Tailored workflow design and implementation with cross-platform integration and optimization.",
      benefits: [
        "Custom workflow design and mapping",
        "Cross-platform integration capabilities",
        "Process optimization and efficiency gains",
        "Scalable automation architecture"
      ]
    },
    {
      icon: GitBranch,
      title: "Multi-System Integration",
      description: "CRM, marketing automation, and business tool connectivity with data synchronization.",
      benefits: [
        "CRM and marketing automation integration",
        "Business tool and platform connectivity",
        "Real-time data synchronization",
        "API development and management"
      ]
    },
    {
      icon: BarChart3,
      title: "Performance Monitoring & Optimization",
      description: "Workflow analytics and performance tracking with continuous improvement recommendations.",
      benefits: [
        "Workflow analytics and performance tracking",
        "Bottleneck identification and resolution",
        "Continuous improvement recommendations",
        "ROI measurement and reporting"
      ]
    }
  ];

  const stats = [
    { label: "Process Efficiency Gain", value: "300%" },
    { label: "Manual Task Reduction", value: "85%" },
    { label: "Error Rate Decrease", value: "95%" },
    { label: "Implementation Time", value: "2-4 Weeks" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Workflow className="w-4 h-4 text-orange-400" />
              <span className="text-orange-300">Custom Workflow Automation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Custom Workflow Automation:
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent"> 300% Efficiency Gain, 85% Manual Task Reduction</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Manual processes slow down sales teams and create inconsistent results. Our Custom Workflow 
              Automation service designs and implements tailored automation solutions that increase process 
              efficiency by 300%, reduce manual tasks by 85%, and decrease error rates by 95%—all while 
              integrating seamlessly with your existing tools and systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Automate Your Workflows - Get Custom Solution
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-orange-500/30 text-orange-300 px-8 py-4 rounded-xl font-semibold hover:bg-orange-500/10 transition-all duration-300 cursor-pointer"
              >
                See Automation Examples
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
            <h2 className="text-4xl font-bold text-white mb-4">End-to-End Workflow Automation</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transform manual processes into efficient, automated workflows that scale with your business.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-6">
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

      {/* Automation Types Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Automation Solutions We Build</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Custom automation solutions tailored to your specific business processes and requirements.
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
              <h3 className="text-2xl font-bold text-white mb-6">Sales & Marketing Automation</h3>
              <div className="space-y-4">
                {[
                  { icon: Target, text: "Lead routing and assignment" },
                  { icon: Repeat, text: "Follow-up sequence automation" },
                  { icon: BarChart3, text: "Pipeline management workflows" },
                  { icon: Zap, text: "Campaign trigger automation" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
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
              <h3 className="text-2xl font-bold text-white mb-6">Operations & Support Automation</h3>
              <div className="space-y-4">
                {[
                  { icon: Settings, text: "Customer onboarding workflows" },
                  { icon: Shield, text: "Quality assurance processes" },
                  { icon: Clock, text: "Scheduling and resource allocation" },
                  { icon: Cog, text: "Data processing and reporting" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-600/20 to-red-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Automate Your Business Processes?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform manual workflows into efficient, automated processes that save time and eliminate errors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Request Automation Assessment
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
