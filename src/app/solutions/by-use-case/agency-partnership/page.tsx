'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Handshake, Users, TrendingUp, ArrowRight, CheckCircle, Zap, Brain, DollarSign, Award, Target, Globe, Star } from 'lucide-react';

export default function AgencyPartnershipPage() {
  const features = [
    {
      icon: Brain,
      title: "White-Label Solutions",
      description: "Complete white-label platform with your agency branding and custom domain",
      details: ["Custom branding and logo integration", "Dedicated subdomain setup", "Agency-branded client dashboards"]
    },
    {
      icon: Zap,
      title: "Revenue Sharing Program",
      description: "Attractive commission structure with recurring revenue opportunities",
      details: ["Up to 30% recurring commission", "Performance-based bonus tiers", "Monthly revenue sharing reports"]
    },
    {
      icon: Target,
      title: "Client Success Support",
      description: "Dedicated support team to ensure your clients achieve maximum ROI",
      details: ["Dedicated account management", "Client onboarding assistance", "24/7 technical support"]
    }
  ];

  const benefits = [
    {
      stat: "30%",
      label: "Recurring Commission",
      description: "Earn ongoing revenue from every client subscription"
    },
    {
      stat: "24/7",
      label: "Partner Support",
      description: "Dedicated support team for all your partnership needs"
    },
    {
      stat: "90%",
      label: "Client Retention Rate",
      description: "High client satisfaction leads to long-term partnerships"
    },
    {
      stat: "$10K+",
      label: "Average Monthly Revenue",
      description: "Top partners earn substantial recurring income"
    }
  ];

  const partnershipTiers = [
    {
      icon: Star,
      title: "Certified Partner",
      description: "Entry-level partnership with basic benefits",
      requirements: ["5+ clients onboarded", "Basic certification completion"],
      benefits: ["15% commission rate", "Marketing materials access", "Partner portal access"]
    },
    {
      icon: Award,
      title: "Premier Partner",
      description: "Advanced partnership with enhanced benefits",
      requirements: ["25+ clients onboarded", "Advanced training completion"],
      benefits: ["25% commission rate", "Co-marketing opportunities", "Priority support"]
    },
    {
      icon: Globe,
      title: "Elite Partner",
      description: "Top-tier partnership with maximum benefits",
      requirements: ["50+ clients onboarded", "Proven track record"],
      benefits: ["30% commission rate", "White-label solutions", "Dedicated account manager"]
    }
  ];

  const supportTools = [
    {
      icon: Brain,
      title: "Training & Certification",
      description: "Comprehensive training programs to ensure success",
      link: "/get-started/book-demo",
      features: ["Sales methodology training", "Product certification courses", "Ongoing education programs"]
    },
    {
      icon: DollarSign,
      title: "Marketing Resources",
      description: "Ready-to-use marketing materials and campaigns",
      link: "/resources",
      features: ["Sales collateral library", "Case studies and testimonials", "Co-branded marketing assets"]
    },
    {
      icon: Users,
      title: "Client Management Tools",
      description: "Advanced tools to manage and grow your client base",
      link: "/platforms/lead-management",
      features: ["Client dashboard access", "Performance reporting tools", "Automated client communications"]
    },
    {
      icon: TrendingUp,
      title: "Revenue Analytics",
      description: "Detailed insights into your partnership performance",
      link: "/platforms/contact-intelligence",
      features: ["Real-time commission tracking", "Client performance metrics", "Revenue forecasting tools"]
    }
  ];

  const workflow = [
    {
      step: "1",
      title: "Apply & Get Approved",
      description: "Submit your agency application and complete the approval process",
      icon: Handshake
    },
    {
      step: "2",
      title: "Complete Training",
      description: "Participate in our comprehensive partner training program",
      icon: Brain
    },
    {
      step: "3",
      title: "Start Selling",
      description: "Begin offering our solutions to your clients with full support",
      icon: Target
    },
    {
      step: "4",
      title: "Earn & Grow",
      description: "Receive recurring commissions and scale your partnership",
      icon: TrendingUp
    }
  ];

  const whyPartner = [
    {
      icon: DollarSign,
      title: "Recurring Revenue Stream",
      solution: "Build predictable monthly income with our subscription-based model"
    },
    {
      icon: Zap,
      title: "Proven Sales Technology",
      solution: "Offer cutting-edge AI-powered sales automation to your clients"
    },
    {
      icon: Users,
      title: "Dedicated Support Team",
      solution: "Get expert assistance for client onboarding and technical support"
    },
    {
      icon: Award,
      title: "Industry Recognition",
      solution: "Join our network of certified partners and enhance your credibility"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0020] via-[#18122b] to-[#0a0020] relative">
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
              <Handshake className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300">Agency Partnership Program</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Start Your Agency Partnership &
              <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent"> Unlock Recurring Revenue</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Join our exclusive agency partnership program and transform your business with recurring revenue opportunities. Partner with Sales Centri to offer cutting-edge AI-powered sales automation to your clients while earning up to 30% recurring commissions. Our white-label solutions, comprehensive training, and dedicated support ensure your success in the rapidly growing sales automation market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Apply for Partnership
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-purple-500/30 text-purple-300 px-8 py-4 rounded-xl font-semibold hover:bg-purple-500/10 transition-all duration-300 cursor-pointer">
                Schedule Partnership Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
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

      {/* Why Partner With Us */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Partner With Sales Centri?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the advantages of joining our growing network of successful agency partners.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {whyPartner.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <reason.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{reason.title}</h3>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-300 font-medium text-sm">Partnership Benefit</span>
                      </div>
                      <p className="text-purple-200 text-sm">{reason.solution}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Partnership Tiers & Benefits</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Multiple partnership levels designed to grow with your agency.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {partnershipTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-8 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <tier.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{tier.title}</h3>
                <p className="text-gray-300 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-purple-300 mb-3">REQUIREMENTS</h4>
                  <ul className="space-y-2">
                    {tier.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-purple-300 mb-3">BENEFITS</h4>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Workflow */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">How to Get Started</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Simple steps to launch your successful agency partnership.
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
                <div className="bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-purple-400 font-bold text-sm mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
                {index < workflow.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-600 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Partnership Benefits & Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive support and tools to ensure your partnership success.
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
                className="bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-8 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Tools */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Partner Support & Resources</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools and resources to accelerate your partnership success.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {supportTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer"
              >
                <Link href={tool.link}>
                  <div className="bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">{tool.title}</h3>
                        <p className="text-gray-300 mb-4">{tool.description}</p>
                        <ul className="space-y-1">
                          {tool.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors mt-4">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600/20 to-blue-700/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Agency Partnership?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our growing network of successful agency partners and unlock recurring revenue opportunities with cutting-edge sales automation technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Apply for Partnership
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-purple-500/30 text-purple-300 px-8 py-4 rounded-xl font-semibold hover:bg-purple-500/10 transition-all duration-300 cursor-pointer">
                Schedule Partnership Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
