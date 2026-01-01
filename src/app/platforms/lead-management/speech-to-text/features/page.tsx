'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mic, Bot, ArrowRight, CheckCircle, Star, Zap, Shield, Clock, Users, Globe, Settings, BarChart3 } from 'lucide-react';

export default function SpeechToTextFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/speech-to-text';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const features = [
    {
      icon: Bot,
      title: "Advanced Speech Recognition",
      description: "Cutting-edge AI models for accurate speech-to-text conversion",
      capabilities: [
        "State-of-the-art deep learning models",
        "Real-time transcription processing",
        "Context-aware speech recognition",
        "Noise reduction &amp; audio enhancement",
        "Accent &amp; dialect adaptation",
        "Custom model training available"
      ]
    },
    {
      icon: Users,
      title: "Speaker Identification",
      description: "Advanced speaker diarization and voice recognition capabilities",
      capabilities: [
        "Multiple speaker detection",
        "Speaker labeling &amp; identification",
        "Voice pattern recognition",
        "Speaker change detection",
        "Custom speaker profiles",
        "Confidence scoring per speaker"
      ]
    },
    {
      icon: Globe,
      title: "Multilingual Processing",
      description: "Comprehensive language support with automatic detection",
      capabilities: [
        "50+ languages supported",
        "Automatic language detection",
        "Code-switching recognition",
        "Regional accent processing",
        "Dialect-specific optimization",
        "Mixed-language transcription"
      ]
    },
    {
      icon: Settings,
      title: "Advanced Processing",
      description: "Sophisticated text processing and formatting capabilities",
      capabilities: [
        "Intelligent punctuation insertion",
        "Number &amp; date formatting",
        "Custom vocabulary integration",
        "Profanity filtering options",
        "Text normalization &amp; cleanup",
        "Timestamp &amp; timing information"
      ]
    },
    {
      icon: BarChart3,
      title: "Quality &amp; Analytics",
      description: "Comprehensive quality metrics and performance monitoring",
      capabilities: [
        "Confidence scoring per word",
        "Quality assessment metrics",
        "Accuracy reporting &amp; analytics",
        "Performance optimization insights",
        "Usage statistics &amp; trends",
        "Custom quality thresholds"
      ]
    },
    {
      icon: Shield,
      title: "Security &amp; Compliance",
      description: "Enterprise-grade security with regulatory compliance",
      capabilities: [
        "End-to-end encryption",
        "HIPAA &amp; GDPR compliance",
        "Data retention controls",
        "Access logging &amp; auditing",
        "On-premise deployment options",
        "Compliance reporting tools"
      ]
    }
  ];

  return (
    <>
      {/* Sub-navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <nav className="flex space-x-8">
              {subNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-4 px-2 text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                Speech to Text Features
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive speech recognition capabilities designed to accurately convert spoken words 
              into text for any application, from meetings to media transcription.
            </p>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {feature.capabilities.map((capability, capIndex) => (
                      <li key={capIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: capability }}></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Feature Highlights */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our Speech to Text?</h2>
              <p className="text-lg text-gray-300">
                Industry-leading accuracy and features that deliver exceptional transcription quality
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Real-time Processing",
                  description: "Instant transcription with sub-second latency for live conversations"
                },
                {
                  icon: Users,
                  title: "Multi-speaker Support",
                  description: "Accurately identify and separate multiple speakers in conversations"
                },
                {
                  icon: Star,
                  title: "99.2% Accuracy",
                  description: "Industry-leading accuracy rates across multiple languages and accents"
                },
                {
                  icon: Clock,
                  title: "24/7 Processing",
                  description: "Always-available transcription service with guaranteed uptime"
                }
              ].map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <highlight.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{highlight.title}</h3>
                  <p className="text-gray-400 text-sm">{highlight.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your spoken content into accurate text transcripts with our advanced speech recognition technology. 
              Try all features risk-free with our comprehensive trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Try All Features Free</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                Schedule Feature Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
