'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Banknote, Shield, ArrowRight, CheckCircle, Target, Users, Lock, Clock, Award, FileText, Calculator } from 'lucide-react';

export default function FinanceBankingPage() {
  const financeChallenges = [
    {
      icon: Shield,
      title: "Regulatory Compliance",
      problem: "Complex regulations like GDPR, SOX, FINRA, and MiFID II require strict adherence",
      solution: "Built-in compliance frameworks with automated documentation and audit trails"
    },
    {
      icon: Lock,
      title: "Data Security & Privacy",
      problem: "Financial data requires highest security standards and privacy protection",
      solution: "Bank-grade encryption, SOC 2 compliance, and role-based access controls"
    },
    {
      icon: Users,
      title: "High-Net-Worth Client Acquisition",
      problem: "Targeting and engaging affluent prospects requires sophisticated approaches",
      solution: "Advanced wealth screening and personalized high-touch engagement strategies"
    },
    {
      icon: Clock,
      title: "Trust Building in Digital Environment",
      problem: "Financial services require extensive trust-building before purchase decisions",
      solution: "Multi-touch nurturing with educational content and credibility indicators"
    }
  ];

  const financeFeatures = [
    {
      icon: Shield,
      title: "Regulatory Compliance Suite",
      description: "Comprehensive compliance management for financial services regulations and requirements",
      benefits: ["GDPR & CCPA compliance automation", "SOX documentation workflows", "FINRA communication archiving", "MiFID II reporting capabilities"]
    },
    {
      icon: Target,
      title: "Wealth & Risk Profiling",
      description: "Advanced prospect profiling tools designed for financial services client qualification",
      benefits: ["Net worth estimation algorithms", "Investment risk tolerance assessment", "Life event trigger identification", "Portfolio optimization insights"]
    },
    {
      icon: Calculator,
      title: "Financial Planning Tools",
      description: "Interactive calculators and planning tools that demonstrate value and engage prospects",
      benefits: ["Retirement planning calculators", "Tax optimization scenarios", "Insurance needs analysis", "Investment return projections"]
    },
    {
      icon: FileText,
      title: "Educational Content Engine",
      description: "Sophisticated content delivery system for financial education and thought leadership",
      benefits: ["Market commentary automation", "Educational webinar sequences", "Regulatory update distribution", "Personalized financial insights"]
    }
  ];

  const financeStats = [
    {
      stat: "180%",
      label: "Increase in Qualified Leads",
      description: "Advanced screening identifies serious prospects from information seekers"
    },
    {
      stat: "55%",
      label: "Improvement in Conversion Rates",
      description: "Trust-building sequences convert more prospects to clients"
    },
    {
      stat: "35%",
      label: "Reduction in Sales Cycle",
      description: "Automated education accelerates trust and decision-making"
    },
    {
      stat: "95%",
      label: "Compliance Audit Success",
      description: "Built-in compliance controls ensure regulatory adherence"
    }
  ];

  const financeUseCases = [
    {
      company: "Regional Bank",
      challenge: "Low digital engagement rates among high-value prospects",
      solution: "Implemented personalized financial education campaigns with interactive tools",
      results: "150% increase in online engagement, 40% growth in new account openings"
    },
    {
      company: "Investment Advisory Firm",
      challenge: "Difficulty scaling personalized service for growing client base",
      solution: "Automated client onboarding with risk profiling and portfolio recommendations",
      results: "300% increase in client capacity, 65% improvement in client satisfaction"
    },
    {
      company: "Insurance Broker",
      challenge: "Long sales cycles and complex needs assessment processes",
      solution: "Interactive needs analysis tools with automated proposal generation",
      results: "45% reduction in sales cycle, 85% increase in proposal acceptance rates"
    }
  ];

  const financeWorkflow = [
    {
      step: "1",
      title: "Prospect Identification",
      description: "AI-powered wealth screening and trigger event identification for high-value prospects",
      icon: Target
    },
    {
      step: "2",
      title: "Compliance Verification",
      description: "Automated compliance checks and documentation for all prospect interactions",
      icon: Shield
    },
    {
      step: "3",
      title: "Educational Engagement",
      description: "Personalized financial education content based on prospect needs and interests",
      icon: FileText
    },
    {
      step: "4",
      title: "Risk Assessment",
      description: "Comprehensive risk profiling and suitability analysis for financial products",
      icon: Calculator
    },
    {
      step: "5",
      title: "Trust Development",
      description: "Multi-touch sequences that build credibility and demonstrate expertise",
      icon: Award
    },
    {
      step: "6",
      title: "Relationship Conversion",
      description: "Guided transition from prospect to client with onboarding automation",
      icon: Users
    }
  ];

  const financeSegments = [
    "Commercial Banking",
    "Investment Management",
    "Insurance Services",
    "Wealth Management",
    "Mortgage Lending",
    "Credit Unions",
    "Fintech Platforms",
    "Financial Planning",
    "Investment Banking",
    "Private Banking",
    "Risk Management",
    "Payment Processing",
    "Cryptocurrency Services",
    "Robo-Advisory",
    "Corporate Finance",
    "Real Estate Finance"
  ];

  const complianceFeatures = [
    {
      regulation: "GDPR Compliance",
      description: "Automated consent management and data protection workflows"
    },
    {
      regulation: "SOX Compliance",
      description: "Financial reporting controls and audit trail documentation"
    },
    {
      regulation: "FINRA Rules",
      description: "Communication supervision and record-keeping automation"
    },
    {
      regulation: "MiFID II",
      description: "Best execution reporting and transaction cost analysis"
    },
    {
      regulation: "CCPA Compliance",
      description: "California privacy rights management and data handling"
    },
    {
      regulation: "PCI DSS",
      description: "Payment card security standards and data protection"
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
              <Banknote className="w-4 h-4 text-green-400" />
              <span className="text-green-300">Finance & Banking Solutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Financial Services Sales Automation:
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"> Compliant, Secure, Profitable</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Revolutionize your financial services sales with industry-specific automation that prioritizes compliance, security, and trust-building. Our platform is designed for banks, credit unions, investment firms, insurance companies, and fintech platforms that need to navigate complex regulations while scaling their client acquisition. Achieve 180% more qualified leads while maintaining 95% compliance audit success rates with our proven financial services framework.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Compliance Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-green-500/30 text-green-300 px-8 py-4 rounded-xl font-semibold hover:bg-green-500/10 transition-all duration-300 cursor-pointer">
                Schedule Financial Strategy Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Finance Stats */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {financeStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-2">{stat.stat}</div>
                <div className="text-lg font-semibold text-white mb-2">{stat.label}</div>
                <div className="text-sm text-gray-300">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Finance Challenges */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Financial Services Challenges We Address</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized solutions for the unique compliance and trust requirements of financial services.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {financeChallenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <challenge.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{challenge.title}</h3>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-red-300 font-medium text-sm">Challenge</span>
                      </div>
                      <p className="text-red-200 text-sm">{challenge.problem}</p>
                    </div>
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

      {/* Finance Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Financial Services-Specific Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Purpose-built tools for financial institutions, advisors, and fintech companies.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {financeFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-green-500/30 rounded-xl p-8 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Built-in Compliance Management</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive regulatory compliance features designed for financial services.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.regulation}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Finance Workflow */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Financial Services Sales Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Compliant and secure workflow designed for financial services client acquisition.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {financeWorkflow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-black/30 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-green-400 font-bold text-sm mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Finance Segments */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Financial Services Segments We Serve</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Proven expertise across all areas of financial services and fintech.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {financeSegments.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-green-500/20 rounded-lg p-4 text-center hover:border-green-500/40 transition-all duration-300"
              >
                <span className="text-white font-medium">{segment}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Financial Services Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real results from financial institutions that transformed their client acquisition.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {financeUseCases.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{story.company}</h3>
                <div className="mb-4">
                  <div className="text-sm font-medium text-red-300 mb-1">Challenge:</div>
                  <p className="text-gray-300 text-sm mb-3">{story.challenge}</p>
                  <div className="text-sm font-medium text-blue-300 mb-1">Solution:</div>
                  <p className="text-gray-300 text-sm mb-3">{story.solution}</p>
                  <div className="text-sm font-medium text-green-300 mb-1">Results:</div>
                  <p className="text-green-200 text-sm font-semibold">{story.results}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600/20 to-emerald-700/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Financial Services Sales?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join financial institutions achieving 180% more qualified leads while maintaining 95% compliance audit success rates with our specialized platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Compliance Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-green-500/30 text-green-300 px-8 py-4 rounded-xl font-semibold hover:bg-green-500/10 transition-all duration-300 cursor-pointer">
                Schedule Financial Strategy Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
