'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Users, BarChart3, ArrowRight, CheckCircle, Zap, Brain, MessageSquare, Headphones, Clock } from 'lucide-react';

export default function CallCentersPage() {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Call Routing",
      description: "AI-powered call distribution and agent matching with real-time sentiment analysis",
      details: ["Smart queue management and priority routing", "Agent skill-based routing optimization", "Predictive wait time calculations"]
    },
    {
      icon: Zap,
      title: "Automated Customer Engagement",
      description: "Multi-channel automation with personalized customer journeys and responses",
      details: ["Automated follow-up campaigns", "Intelligent chatbot integration", "Omnichannel conversation continuity"]
    },
    {
      icon: BarChart3,
      title: "Performance Analytics & Optimization",
      description: "Real-time dashboards with call quality monitoring and agent performance tracking",
      details: ["Call recording and conversation analysis", "Agent coaching and performance insights", "Customer satisfaction scoring"]
    }
  ];

  const benefits = [
    {
      stat: "50%",
      label: "Reduced Wait Times",
      description: "Smart routing gets customers to the right agent faster"
    },
    {
      stat: "35%",
      label: "Higher First-Call Resolution",
      description: "AI-assisted agents solve issues on the first try"
    },
    {
      stat: "40%",
      label: "Improved Agent Productivity",
      description: "Automation handles routine tasks and queries"
    },
    {
      stat: "90%",
      label: "Customer Satisfaction Score",
      description: "Enhanced experience across all touchpoints"
    }
  ];

  const tools = [
    {
      icon: Phone,
      title: "Intelligent Call Management",
      description: "Smart call routing and queue optimization",
      link: "/platforms/contact-intelligence",
      features: ["AI-powered call routing", "Real-time queue monitoring", "Predictive dialing systems"]
    },
    {
      icon: MessageSquare,
      title: "Omnichannel Support",
      description: "Unified communication across all channels",
      link: "/platforms/lead-management",
      features: ["Live chat integration", "Email automation", "Social media monitoring"]
    },
    {
      icon: Headphones,
      title: "Agent Performance Tools",
      description: "Real-time assistance and performance tracking",
      link: "/platforms/lead-management",
      features: ["Live call coaching", "Knowledge base integration", "Performance dashboards"]
    },
    {
      icon: Clock,
      title: "Automated Workflows",
      description: "Streamlined processes and follow-up automation",
      link: "/solutions/psa-suite-one-stop-solution",
      features: ["Automated ticket creation", "Follow-up scheduling", "Escalation management"]
    }
  ];

  const workflow = [
    {
      step: "1",
      title: "Intelligent Routing",
      description: "AI analyzes customer needs and routes to best-matched agent",
      icon: Brain
    },
    {
      step: "2",
      title: "Real-Time Assistance",
      description: "Agents get live suggestions and customer context",
      icon: Headphones
    },
    {
      step: "3",
      title: "Automated Documentation",
      description: "AI captures call notes and creates follow-up tasks",
      icon: MessageSquare
    },
    {
      step: "4",
      title: "Performance Optimization",
      description: "Continuous learning and process improvement",
      icon: BarChart3
    }
  ];

  const challenges = [
    {
      icon: Clock,
      title: "Long Wait Times",
      solution: "Smart queue management reduces wait times by 50%"
    },
    {
      icon: Users,
      title: "Agent Burnout",
      solution: "Automation handles routine tasks, agents focus on complex issues"
    },
    {
      icon: Phone,
      title: "Low First-Call Resolution",
      solution: "AI provides real-time guidance and customer context"
    },
    {
      icon: BarChart3,
      title: "Inconsistent Service Quality",
      solution: "Standardized workflows and real-time coaching"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
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
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Phone className="w-4 h-4 text-green-400" />
              <span className="text-green-300">Call Center Transformation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Transform Your Call Center with
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"> AI-Powered Operations</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Your call center agents spend 70% of their time on manual processes while customers wait longer and satisfaction drops. Traditional call center operations struggle with inefficient routing, inconsistent service quality, and agent burnout. Our AI-powered call center platform revolutionizes operations with intelligent routing, real-time assistance, and automated workflows that boost efficiency by 40% while delivering exceptional customer experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Transform Your Call Center - Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-green-500/30 text-green-300 px-8 py-4 rounded-xl font-semibold hover:bg-green-500/10 transition-all duration-300 cursor-pointer">
                Schedule Demo
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
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">{benefit.stat}</div>
                <div className="text-lg font-semibold text-white mb-2">{benefit.label}</div>
                <div className="text-sm text-gray-300">{benefit.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call Center Challenges */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Common Call Center Challenges We Solve</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Address the pain points that plague traditional call center operations.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {challenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <challenge.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{challenge.title}</h3>
                    <p className="text-gray-300 mb-4">Traditional Challenge</p>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 font-medium text-sm">Our Solution</span>
                      </div>
                      <p className="text-green-200 text-sm">{challenge.solution}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call Center Workflow */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Optimized Call Center Workflow</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Intelligent processes that enhance every customer interaction.
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
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-green-400 font-bold text-sm mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-600 transform -translate-y-1/2"></div>
                )}
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
            <h2 className="text-4xl font-bold text-white mb-4">Call Center Transformation Tools</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced AI tools designed specifically for modern call center operations.
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
                className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Integrated Call Center Tools</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything your call center needs in one unified platform.
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
                  <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-300 transition-colors">{tool.title}</h3>
                        <p className="text-gray-300 mb-4">{tool.description}</p>
                        <ul className="space-y-1">
                          {tool.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center text-green-400 group-hover:text-green-300 transition-colors mt-4">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600/20 to-blue-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Call Center Operations?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join leading call centers already using our platform to deliver exceptional customer experiences while boosting operational efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800/30 transition-all duration-300 cursor-pointer">
                Book Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
