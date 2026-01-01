'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, MapPin, ArrowRight, CheckCircle, Target, Users, Clock, Phone, Mail, Calendar, Award } from 'lucide-react';

export default function RealEstatePage() {
  const realEstateChallenges = [
    {
      icon: Clock,
      title: "Time-Sensitive Opportunities",
      problem: "Real estate opportunities have narrow windows requiring immediate response and follow-up",
      solution: "Instant lead response automation with SMS, email, and call sequences within minutes"
    },
    {
      icon: Users,
      title: "High Lead Volume Management",
      problem: "Agents struggle to manage hundreds of leads from multiple sources effectively",
      solution: "Intelligent lead scoring and prioritization with automated nurturing workflows"
    },
    {
      icon: MapPin,
      title: "Geographic Market Complexity",
      problem: "Managing leads across multiple markets, neighborhoods, and property types",
      solution: "Location-based lead routing and market-specific messaging automation"
    },
    {
      icon: Phone,
      title: "Multi-Touch Follow-Up Requirements",
      problem: "Real estate buyers and sellers require 8-12 touchpoints before making decisions",
      solution: "Comprehensive multi-channel sequences with video tours, market reports, and personal outreach"
    }
  ];

  const realEstateFeatures = [
    {
      icon: Home,
      title: "Property-Specific Lead Management",
      description: "Advanced CRM designed specifically for real estate transactions and relationship management",
      benefits: ["Property-centric lead organization", "Transaction pipeline tracking", "Closing date management", "Commission calculation tools"]
    },
    {
      icon: MapPin,
      title: "Geographic Market Intelligence",
      description: "Location-based insights and automated market reports for prospects and clients",
      benefits: ["Neighborhood market analysis", "Comparable property reports", "Market trend notifications", "School district information"]
    },
    {
      icon: Calendar,
      title: "Showing & Appointment Automation",
      description: "Streamlined scheduling and coordination for property showings and client meetings",
      benefits: ["Online scheduling integration", "Automated reminders", "Route optimization", "Virtual tour scheduling"]
    },
    {
      icon: Mail,
      title: "Real Estate Content Engine",
      description: "Specialized content library and automation for real estate marketing and education",
      benefits: ["Market update newsletters", "Property listing promotions", "First-time buyer guides", "Investment property analysis"]
    }
  ];

  const realEstateStats = [
    {
      stat: "320%",
      label: "Increase in Lead Response Speed",
      description: "Instant automated responses capture time-sensitive opportunities"
    },
    {
      stat: "65%",
      label: "Improvement in Lead Conversion",
      description: "Systematic follow-up converts more leads to appointments and sales"
    },
    {
      stat: "45%",
      label: "Reduction in Time to Close",
      description: "Streamlined processes and better communication accelerate transactions"
    },
    {
      stat: "85%",
      label: "Client Satisfaction Rate",
      description: "Consistent communication and service delivery drives referrals"
    }
  ];

  const realEstateUseCases = [
    {
      company: "Residential Real Estate Team",
      challenge: "Missing leads due to slow response times and inconsistent follow-up",
      solution: "Implemented instant lead response with automated SMS and email sequences",
      results: "300% increase in lead conversion, 50% growth in closed transactions"
    },
    {
      company: "Commercial Real Estate Firm",
      challenge: "Complex multi-stakeholder decision processes with long sales cycles",
      solution: "Multi-touch nurturing campaigns with market intelligence and property analysis",
      results: "40% increase in qualified prospects, 60% improvement in deal size"
    },
    {
      company: "Real Estate Investment Company",
      challenge: "Difficulty identifying and engaging potential property sellers",
      solution: "Targeted marketing campaigns with market analysis and cash offer calculators",
      results: "250% increase in seller leads, 35% growth in property acquisitions"
    }
  ];

  const realEstateWorkflow = [
    {
      step: "1",
      title: "Lead Capture & Response",
      description: "Instant automated response to leads from websites, portals, and referrals",
      icon: Target
    },
    {
      step: "2",
      title: "Lead Qualification",
      description: "Automated qualification questions and lead scoring based on buying/selling readiness",
      icon: CheckCircle
    },
    {
      step: "3",
      title: "Market Positioning",
      description: "Personalized market reports and property recommendations based on preferences",
      icon: MapPin
    },
    {
      step: "4",
      title: "Appointment Setting",
      description: "Automated scheduling for property showings, consultations, and market evaluations",
      icon: Calendar
    },
    {
      step: "5",
      title: "Relationship Nurturing",
      description: "Ongoing market updates and property alerts to maintain engagement",
      icon: Users
    },
    {
      step: "6",
      title: "Transaction Management",
      description: "Automated workflows for offers, contracts, and closing coordination",
      icon: Home
    }
  ];

  const realEstateSegments = [
    "Residential Sales",
    "Commercial Real Estate",
    "Luxury Properties",
    "Investment Properties",
    "Property Management",
    "New Construction",
    "Land Development",
    "Vacation Rentals",
    "Real Estate Teams",
    "Independent Agents",
    "Brokerage Firms",
    "Property Developers",
    "Real Estate Investors",
    "Mortgage Brokers",
    "Title Companies",
    "Real Estate Attorneys"
  ];

  const realEstateTools = [
    {
      tool: "CMA Automation",
      description: "Automated comparative market analysis generation and delivery"
    },
    {
      tool: "Lead Source Tracking",
      description: "Comprehensive attribution across all marketing channels and referral sources"
    },
    {
      tool: "Virtual Tour Integration",
      description: "Seamless integration with virtual tour platforms and scheduling"
    },
    {
      tool: "Market Report Generator",
      description: "Automated neighborhood and market trend reports for clients"
    },
    {
      tool: "Referral Management",
      description: "Systematic referral tracking and reward programs for past clients"
    },
    {
      tool: "Social Media Automation",
      description: "Automated property promotions and market updates across social platforms"
    }
  ];

  const buyerSellerJourney = [
    {
      type: "First-Time Buyers",
      challenges: ["Understanding the buying process", "Mortgage pre-approval", "Market knowledge"],
      solutions: ["Educational email series", "Buyer guide automation", "Lender introduction workflow"]
    },
    {
      type: "Property Sellers",
      challenges: ["Home valuation uncertainty", "Market timing decisions", "Preparation requirements"],
      solutions: ["Automated CMA delivery", "Market condition reports", "Listing preparation checklists"]
    },
    {
      type: "Real Estate Investors",
      challenges: ["Property analysis", "Market opportunities", "ROI calculations"],
      solutions: ["Investment property alerts", "Cash flow calculators", "Market opportunity reports"]
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
              <Home className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Real Estate Solutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Real Estate Sales Automation:
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent"> Convert More Leads, Close More Deals</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Transform your real estate business with automation designed specifically for agents, teams, and brokerages. Our platform understands the fast-paced nature of real estate—from instant lead response requirements to complex transaction management. Increase your lead conversion by 65% and reduce time to close by 45% with proven real estate sales automation that works for residential, commercial, and investment properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Real Estate Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Schedule Agent Strategy Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real Estate Stats */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {realEstateStats.map((stat, index) => (
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

      {/* Real Estate Challenges */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Real Estate Challenges We Solve</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Purpose-built solutions for the unique demands of real estate sales and client management.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {realEstateChallenges.map((challenge, index) => (
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

      {/* Real Estate Features */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Real Estate-Specific Features</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized tools designed for real estate professionals and their unique business needs.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {realEstateFeatures.map((feature, index) => (
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

      {/* Buyer & Seller Journey */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Client Journey Automation</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tailored automation workflows for different types of real estate clients and their specific needs.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {buyerSellerJourney.map((journey, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-white mb-4">{journey.type}</h3>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-red-300 mb-2">Common Challenges:</h4>
                  <ul className="space-y-1">
                    {journey.challenges.map((challenge, challengeIndex) => (
                      <li key={challengeIndex} className="text-gray-300 text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-300 mb-2">Automated Solutions:</h4>
                  <ul className="space-y-1">
                    {journey.solutions.map((solution, solutionIndex) => (
                      <li key={solutionIndex} className="text-gray-300 text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {solution}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Workflow */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Real Estate Sales Process</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive workflow designed for modern real estate professionals.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {realEstateWorkflow.map((step, index) => (
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

      {/* Real Estate Tools */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Real Estate Tools & Integrations</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specialized tools that integrate with your existing real estate workflow and systems.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realEstateTools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-black/30 backdrop-blur-xl border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{tool.tool}</h3>
                <p className="text-gray-300 text-sm">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Estate Segments */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Real Estate Segments We Serve</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Proven solutions across all areas of real estate and property management.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {realEstateSegments.map((segment, index) => (
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
            <h2 className="text-4xl font-bold text-white mb-4">Real Estate Success Stories</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real results from real estate professionals who transformed their business with automation.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {realEstateUseCases.map((story, index) => (
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
              Ready to Transform Your Real Estate Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join real estate professionals achieving 65% better lead conversion and 45% faster closings with our specialized automation platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Real Estate Demo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Schedule Agent Strategy Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
