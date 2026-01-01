'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  FileText,
  Target,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Zap,
  BarChart3,
  Shield,
  Globe,
  Rocket
} from 'lucide-react';

export default function LeadGenerationModelsContent() {
  // Top of Funnel (TOFU) cards
  const tofuCards = [
    {
      icon: Mail,
      title: 'Email Marketing Campaigns',
      type: 'Inbound/Outbound',
      definition: 'Automated and targeted email sequences designed to nurture interest and guide prospects through the buyer journey.',
      rationale: 'Low-cost, scalable, and effective for reaching a wide audience.',
      bestFor: 'Nurturing lists, building brand awareness, and driving early engagement.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: FileText,
      title: 'Content Syndication',
      type: 'Inbound/Outbound',
      definition: 'Distributing valuable content (whitepapers, eBooks, reports) across trusted networks to attract top-funnel prospects.',
      rationale: 'Helps generate high-volume early-stage leads.',
      bestFor: 'Brands focusing on awareness and content-driven campaigns.',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  // Middle of Funnel (MOFU) cards
  const mofuCards = [
    {
      icon: Target,
      title: 'MQL – Marketing Qualified Lead',
      type: 'Qualification Metric',
      definition: 'Leads showing measurable marketing engagement.',
      rationale: 'Balances lead volume with quality.',
      bestFor: 'Businesses seeking consistent mid-stage lead flow.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: TrendingUp,
      title: 'HQL – Highly Qualified Lead',
      type: 'Qualification Metric',
      definition: 'Leads with strong buying signals and high intent.',
      rationale: 'Ensures better ROI and conversion potential.',
      bestFor: 'Targeted B2B campaigns.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'BANT Framework',
      type: 'Qualification Framework',
      definition: 'Evaluates leads based on Budget, Authority, Need, and Timeline.',
      rationale: 'Reduces wasted effort by ensuring genuine qualification.',
      bestFor: 'Sales teams with specific criteria.',
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  // Bottom of Funnel (BOFU) cards
  const bofuCards = [
    {
      icon: CheckCircle2,
      title: 'SQL – Sales Qualified Lead',
      type: 'Qualification Metric',
      definition: 'Leads vetted by the sales team as ready for direct engagement.',
      rationale: 'High purchase intent, minimal nurturing needed.',
      bestFor: 'Sales teams closing deals faster.',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Calendar,
      title: 'AG – Appointment Generated Lead',
      type: 'Performance-Based Model',
      definition: 'Guaranteed qualified meetings with decision-makers.',
      rationale: 'Eliminates prospecting time and ensures ROI.',
      bestFor: 'High-ticket B2B sales.',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  // Why Choose SalesCentri cards
  const whyChooseCards = [
    {
      icon: Zap,
      title: 'Proven Frameworks Across Every Funnel Stage',
      description: 'Comprehensive strategies that work from awareness to conversion'
    },
    {
      icon: BarChart3,
      title: 'Pay-for-Performance Models',
      description: 'Only pay for results that drive real ROI for your business'
    },
    {
      icon: Rocket,
      title: 'End-to-End Nurturing & Tracking',
      description: 'Complete visibility and optimization across the entire customer journey'
    },
    {
      icon: Shield,
      title: 'Industry-Specific Targeting for Higher ROI',
      description: 'Tailored approaches that maximize conversion rates in your vertical'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
        {/* Motion particles */}
        {[...Array(15)].map((_, i) => (
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

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Fuel Your Sales Pipeline with{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Proven Lead Generation Models
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                SalesCentri helps you attract, qualify, and convert high-value B2B leads across every stage of your funnel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://dashboard.salescentri.com/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105"
                  data-track="lead_generation_models_get_qualified_leads"
                >
                  Get Qualified Leads Now
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300"
                  data-track="lead_generation_models_book_consultation"
                >
                  Book a Free Consultation
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Top of Funnel (TOFU) Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300">Top of Funnel</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                <span className="text-blue-400">TOFU</span> – Awareness & Discovery
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Build brand awareness and capture early-stage interest with scalable inbound and outbound strategies.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8">
              {tofuCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 w-full md:w-[calc(33.333%-2rem)] lg:w-[calc(33.333%-2.25rem)]"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-6`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-blue-500/10 text-blue-300 px-3 py-1 rounded-full text-xs font-medium mb-2">
                      {card.type}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Definition:</p>
                      <p className="text-gray-400">{card.definition}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Rationale:</p>
                      <p className="text-gray-400">{card.rationale}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Best For:</p>
                      <p className="text-gray-400">{card.bestFor}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Middle of Funnel (MOFU) Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900/50 to-black/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-300">Middle of Funnel</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                <span className="text-green-400">MOFU</span> – Qualification & Engagement
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Identify and nurture high-intent prospects ready to move closer to a purchase decision.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {mofuCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-6`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-green-500/10 text-green-300 px-3 py-1 rounded-full text-xs font-medium mb-2">
                      {card.type}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Definition:</p>
                      <p className="text-gray-400">{card.definition}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Rationale:</p>
                      <p className="text-gray-400">{card.rationale}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Best For:</p>
                      <p className="text-gray-400">{card.bestFor}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom of Funnel (BOFU) Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Rocket className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-300">Bottom of Funnel</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                <span className="text-cyan-400">BOFU</span> – Conversion & Closing
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Connect with decision-makers ready to buy and accelerate your path to closed deals.
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8">
              {bofuCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 w-full md:w-[calc(33.333%-2rem)] lg:w-[calc(33.333%-2.25rem)]"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-6`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-3">
                    <span className="inline-block bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium mb-2">
                      {card.type}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Definition:</p>
                      <p className="text-gray-400">{card.definition}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Rationale:</p>
                      <p className="text-gray-400">{card.rationale}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-300 mb-2">Best For:</p>
                      <p className="text-gray-400">{card.bestFor}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose SalesCentri Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Choose <span className="text-blue-400">SalesCentri</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Proven expertise across every stage of the B2B sales funnel
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {whyChooseCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-gray-400 text-sm">{card.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <a
                href="https://dashboard.salescentri.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                data-track="lead_generation_models_start_generating_leads"
              >
                Start Generating Leads Today
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

