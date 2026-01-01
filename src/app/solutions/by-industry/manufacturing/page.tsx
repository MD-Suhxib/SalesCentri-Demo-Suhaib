'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Factory, Cog, TrendingUp, ArrowRight, CheckCircle, Target, BarChart3, Users, Clock, Shield, Zap, Award } from 'lucide-react';

export default function ManufacturingPage() {
  const manufacturingChallenges = [
    {
      icon: Clock,
      title: "Extended Sales Cycles",
      problem: "Manufacturing sales cycles can span 12-24 months with complex approval processes",
      solution: "Automated nurturing sequences that maintain engagement throughout extended decision timelines"
    },
    {
      icon: Users,
      title: "Multiple Stakeholder Complexity",
      problem: "Decisions involve engineers, procurement, operations, and C-suite executives",
      solution: "Multi-persona campaigns with role-specific messaging and technical documentation"
    },
    {
      icon: BarChart3,
      title: "High-Value Deal Management",
      problem: "Individual deals often exceed $500K requiring extensive ROI justification",
      solution: "Comprehensive value proposition tools and ROI calculators for complex business cases"
    },
    {
      icon: Shield,
      title: "Technical Specification Requirements",
      problem: "Buyers need detailed technical specs, certifications, and compliance documentation",
      solution: "Automated technical document delivery and specification matching systems"
    }
  ];

  const industryFeatures = [
    {
      icon: Factory,
      title: "Manufacturing-Specific CRM Integration",
      description: "Seamlessly integrate with ERP systems like SAP, Oracle, and Salesforce Manufacturing Cloud",
      benefits: ["Real-time inventory visibility", "Production schedule alignment", "Supply chain coordination", "Quality management integration"]
    },
    {
      icon: Cog,
      title: "Technical Stakeholder Engagement",
      description: "Specialized tools for engaging engineers, plant managers, and technical decision-makers",
      benefits: ["Technical specification databases", "Engineering-focused content libraries", "Compliance documentation automation", "CAD file management"]
    },
    {
      icon: TrendingUp,
      title: "Long-Cycle Pipeline Management",
      description: "Advanced pipeline management designed for 12-24 month manufacturing sales cycles",
      benefits: ["Multi-phase opportunity tracking", "Stakeholder influence mapping", "Budget cycle alignment", "Competitive intelligence gathering"]
    },
    {
      icon: Target,
      title: "ROI-Focused Value Selling",
      description: "Comprehensive value selling tools that quantify operational improvements and cost savings",
      benefits: ["Custom ROI calculators", "Total cost of ownership analysis", "Operational efficiency metrics", "Payback period calculations"]
    }
  ];

  const manufacturingStats = [
    {
      stat: "68%",
      label: "Reduction in Sales Cycle Length",
      description: "From 18-month average to 11-month cycles with automated nurturing"
    },
    {
      stat: "240%",
      label: "Increase in Qualified Leads",
      description: "Advanced lead scoring identifies serious prospects from tire-kickers"
    },
    {
      stat: "85%",
      label: "Improvement in Deal Size",
      description: "Better qualification leads to larger, more strategic opportunities"
    },
    {
      stat: "92%",
      label: "Customer Retention Rate",
      description: "Strong post-sale engagement drives long-term partnerships"
    }
  ];

  const manufacturingUseCase = [
    {
      company: "Industrial Equipment Manufacturer",
      challenge: "18-month sales cycles with 60% opportunity slippage",
      solution: "Implemented multi-touch nurturing with technical content automation",
      results: "Reduced cycle to 12 months, improved win rate from 22% to 38%"
    },
    {
      company: "Automation Systems Provider",
      challenge: "Difficulty reaching multiple stakeholders across large manufacturers",
      solution: "Role-based campaigns targeting engineers, procurement, and executives",
      results: "300% increase in stakeholder engagement, 45% growth in pipeline value"
    },
    {
      company: "Materials Supplier",
      challenge: "Competing solely on price in commoditized market",
      solution: "Value-based selling with ROI calculators and efficiency metrics",
      results: "Average deal size increased 75%, margin improvement of 12%"
    }
  ];

  const manufacturingWorkflow = [
    {
      step: "1",
      title: "Prospect Identification",
      description: "AI-powered identification of manufacturers expanding operations or seeking efficiency improvements",
      icon: Target
    },
    {
      step: "2",
      title: "Stakeholder Mapping",
      description: "Comprehensive mapping of decision-makers from engineering to executive levels",
      icon: Users
    },
    {
      step: "3",
      title: "Technical Engagement",
      description: "Automated delivery of technical specifications, case studies, and compliance documentation",
      icon: Cog
    },
    {
      step: "4",
      title: "Value Demonstration",
      description: "ROI calculators and efficiency assessments that quantify operational improvements",
      icon: BarChart3
    },
    {
      step: "5",
      title: "Long-Cycle Nurturing",
      description: "Sustained engagement throughout extended evaluation and approval processes",
      icon: Clock
    },
    {
      step: "6",
      title: "Deal Acceleration",
      description: "Strategic insights and competitive intelligence to accelerate decision-making",
      icon: Zap
    }
  ];

  const industrialSegments = [
    "Automotive Manufacturing",
    "Aerospace & Defense",
    "Heavy Machinery",
    "Chemical Processing",
    "Food & Beverage Production",
    "Pharmaceutical Manufacturing",
    "Electronics & Semiconductors",
    "Oil & Gas Equipment",
    "Construction Equipment",
    "Industrial Automation",
    "Materials & Metals",
    "Packaging & Converting"
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
              <Factory className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Manufacturing Solutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Manufacturing Sales Automation:
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent"> Accelerate Complex B2B Sales Cycles</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Transform your manufacturing sales process with industry-specific automation designed for complex, high-value B2B transactions. Our platform understands the unique challenges of manufacturing sales—from extended decision cycles and multiple stakeholders to technical specifications and compliance requirements. Reduce sales cycles by 68% while increasing deal sizes by 85% with proven manufacturing sales strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Manufacturing Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Schedule Strategy Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Manufacturing Stats */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {manufacturingStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-2">{stat.stat}</div>
                <div className="text-lg font-semibold text-white mb-2">{stat.label}</div>
                <div className="text-sm text-gray-300">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Challenges */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Manufacturing Sales Challenges We Solve</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Purpose-built solutions for the unique complexities of manufacturing sales environments.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {manufacturingChallenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
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

      {/* Industry Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Manufacturing-Specific Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized tools designed for the unique requirements of manufacturing sales teams.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {industryFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-8 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Workflow */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Manufacturing Sales Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Streamlined workflow designed for complex manufacturing sales environments.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {manufacturingWorkflow.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-black/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-blue-400 font-bold text-sm mb-2">STEP {step.step}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-300 text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Segments */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Manufacturing Segments We Serve</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Proven success across diverse manufacturing industries and verticals.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {industrialSegments.map((segment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-blue-500/20 rounded-lg p-4 text-center hover:border-blue-500/40 transition-all duration-300"
              >
                <span className="text-white font-medium">{segment}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Manufacturing Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real results from manufacturing companies that transformed their sales processes.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {manufacturingUseCase.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-cyan-700/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Accelerate Your Manufacturing Sales?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join manufacturing leaders who&apos;ve reduced sales cycles by 68% and increased deal sizes by 85% with our industry-specific automation platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Manufacturing Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Schedule Strategy Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
