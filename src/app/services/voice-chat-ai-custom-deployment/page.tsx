'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, MessageSquare, Phone, ArrowRight, CheckCircle, Mic, Headphones, Settings, Brain, Volume2, Users, BarChart3 } from 'lucide-react';

export default function VoiceChatAICustomDeploymentPage() {
  const features = [
    {
      icon: Bot,
      title: "Custom AI Voice & Chat Solutions",
      description: "Tailored conversational AI development with industry-specific training and integration.",
      benefits: [
        "Custom conversational AI development",
        "Industry-specific training and optimization",
        "Multi-language and accent support",
        "Brand voice and personality customization"
      ]
    },
    {
      icon: Settings,
      title: "Enterprise Integration & Deployment",
      description: "Seamless system integration with scalable infrastructure and security compliance.",
      benefits: [
        "Seamless CRM and system integration",
        "Scalable cloud infrastructure deployment",
        "Security and compliance optimization",
        "Real-time analytics and monitoring"
      ]
    },
    {
      icon: BarChart3,
      title: "Performance Optimization & Support",
      description: "Continuous learning and improvement with dedicated support and maintenance.",
      benefits: [
        "Continuous learning and model improvement",
        "Performance analytics and optimization",
        "24/7 technical support and maintenance",
        "Regular updates and feature enhancements"
      ]
    }
  ];

  const stats = [
    { label: "Response Accuracy", value: "95%" },
    { label: "Customer Satisfaction", value: "4.8/5" },
    { label: "Cost Reduction", value: "70%" },
    { label: "Implementation Time", value: "4-6 Weeks" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Bot className="w-4 h-4 text-teal-400" />
              <span className="text-teal-300">Voice & Chat AI Custom Deployment</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Voice & Chat AI Custom Deployment:
              <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent"> 95% Accuracy, 4.8/5 Satisfaction, 70% Cost Reduction</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Generic chatbots and voice assistants fail to meet complex business needs and provide poor 
              customer experiences. Our Voice & Chat AI Custom Deployment service creates tailored 
              conversational AI solutions that achieve 95% response accuracy, 4.8/5 customer satisfaction 
              ratings, and 70% cost reduction compared to traditional support methods.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                Deploy Custom AI Solution - Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-teal-500/30 text-teal-300 px-8 py-4 rounded-xl font-semibold hover:bg-teal-500/10 transition-all duration-300 cursor-pointer"
              >
                See AI Demo
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
            <h2 className="text-4xl font-bold text-white mb-4">Enterprise-Grade AI Solutions</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Custom-built conversational AI that understands your business and delivers exceptional customer experiences.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mb-6">
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

      {/* Solution Types Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">AI Solutions We Deploy</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive voice and chat AI solutions tailored to your specific business requirements.
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
              <h3 className="text-2xl font-bold text-white mb-6">Voice AI Solutions</h3>
              <div className="space-y-4">
                {[
                  { icon: Phone, text: "Intelligent call routing and handling" },
                  { icon: Mic, text: "Speech recognition and processing" },
                  { icon: Volume2, text: "Natural voice synthesis" },
                  { icon: Headphones, text: "Interactive voice response (IVR)" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
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
              <h3 className="text-2xl font-bold text-white mb-6">Chat AI Solutions</h3>
              <div className="space-y-4">
                {[
                  { icon: MessageSquare, text: "Intelligent chatbot development" },
                  { icon: Brain, text: "Natural language understanding" },
                  { icon: Users, text: "Multi-channel conversation management" },
                  { icon: BarChart3, text: "Conversation analytics and insights" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-600/20 to-cyan-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Deploy Custom AI Solutions?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Transform customer interactions with intelligent voice and chat AI solutions designed specifically for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/contact-form" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer"
              >
                Request AI Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
