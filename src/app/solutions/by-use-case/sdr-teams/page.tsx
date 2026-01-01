'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Users, BarChart3, ArrowRight, CheckCircle, Zap, Brain, Phone, Mail } from 'lucide-react';

export default function SDRTeamsPage() {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Prospecting",
      description: "AI-powered lead scoring and prioritization with intent data and buyer signal detection",
      details: ["Account-based prospecting workflows", "Territory management and lead distribution", "Automated research and enrichment"]
    },
    {
      icon: Zap,
      title: "Scalable Outreach Automation",
      description: "Multi-touch sequence automation with personalization at scale using AI",
      details: ["A/B testing for optimal messaging", "Response tracking and follow-up automation", "Multi-channel campaign coordination"]
    },
    {
      icon: BarChart3,
      title: "Performance Optimization",
      description: "Real-time activity dashboards with quota tracking and forecasting",
      details: ["Call recording and conversation analysis", "Coaching insights and recommendations", "Pipeline velocity tracking"]
    }
  ];

  const benefits = [
    {
      stat: "40%",
      label: "Faster Quota Achievement",
      description: "SDR teams consistently hit targets ahead of schedule"
    },
    {
      stat: "65%",
      label: "Less Time on Research",
      description: "Automated prospecting frees up time for selling"
    },
    {
      stat: "3x",
      label: "Better Response Rates",
      description: "AI-powered personalization improves engagement"
    },
    {
      stat: "95%",
      label: "Data Accuracy",
      description: "Verified contacts and company intelligence"
    }
  ];

  const tools = [
    {
      icon: Target,
      title: "Lead Scoring & Prioritization",
      description: "AI-powered lead qualification and priority ranking",
      link: "/platforms/contact-intelligence",
      features: ["Predictive lead scoring", "Intent data integration", "Buyer signal detection"]
    },
    {
      icon: Mail,
      title: "Email Sequence Automation",
      description: "Personalized multi-touch email campaigns",
      link: "/platforms/lead-management",
      features: ["Dynamic personalization", "A/B testing", "Response automation"]
    },
    {
      icon: Phone,
      title: "Call Recording & Analysis",
      description: "Conversation intelligence and coaching insights",
      link: "/platforms/lead-management",
      features: ["Call transcription", "Sentiment analysis", "Performance scoring"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Shared workflows and performance tracking",
      link: "/solutions/psa-suite-one-stop-solution",
      features: ["Team dashboards", "Goal tracking", "Knowledge sharing"]
    }
  ];

  const workflow = [
    {
      step: "1",
      title: "Prospect Discovery",
      description: "AI identifies ideal prospects from 390M+ database",
      icon: Target
    },
    {
      step: "2",
      title: "Data Enrichment",
      description: "Automatic contact verification and company intelligence",
      icon: Brain
    },
    {
      step: "3",
      title: "Personalized Outreach",
      description: "Multi-channel sequences with AI personalization",
      icon: Mail
    },
    {
      step: "4",
      title: "Performance Tracking",
      description: "Real-time analytics and optimization insights",
      icon: BarChart3
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
              <span className="text-blue-300">SDR Teams Solution</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Sales Automation Built for
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> High-Performing SDR Teams</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Your SDR team spends 65% of their time on manual research instead of selling. With mounting quotas and shrinking response rates, traditional prospecting methods aren&apos;t cutting it. Our SDR-focused automation platform helps your team find better prospects, personalize outreach at scale, and hit quota 40% faster while maintaining authentic relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solutions/psa-suite-one-stop-solution" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Boost Your SDR Team&apos;s Performance - Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'} target="_blank" rel="noopener noreferrer" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer" data-track="sdr_teams_schedule_demo">
                Schedule Demo
              </a>
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

      {/* SDR Workflow */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Optimized SDR Workflow</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamlined processes that eliminate manual work and maximize selling time.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-blue-400 font-bold text-sm mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">SDR-Specific Automation Tools</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Purpose-built tools designed specifically for sales development teams.
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

      {/* Tools Integration */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Integrated SDR Tools</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything your SDR team needs in one unified platform.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link href={tool.link}>
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{tool.title}</h3>
                        <p className="text-gray-300 mb-4">{tool.description}</p>
                        <ul className="space-y-1">
                          {tool.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors mt-4">
                          <span className="text-sm font-medium">Learn More</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
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
              Ready to Supercharge Your SDR Team?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join hundreds of high-performing SDR teams already using our platform to exceed their quotas and accelerate growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/solutions/psa-suite-one-stop-solution" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'} target="_blank" rel="noopener noreferrer" className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer" data-track="sdr_teams_book_demo_footer">
                Book Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
