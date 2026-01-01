'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Building2, Phone, Mail, Target, BarChart3 } from 'lucide-react';

export default function ByUseCasePage() {
  const useCases = [
    {
      title: 'SDR Teams',
      icon: Users,
      description: "Boost your SDR team's performance with AI-powered prospecting and automated outreach",
      features: [
        'Intelligent prospecting and lead scoring',
        'Multi-touch sequence automation',
        'Performance optimization and coaching',
        'Real-time activity dashboards'
      ],
      metrics: {
        improvement: '40% faster quota achievement',
        efficiency: '65% time saved on research',
        results: '3x better prospect quality'
      },
      link: '/solutions/by-use-case/sdr-teams',
      cta: "Boost Your SDR Team's Performance"
    },
    {
      title: 'Call Centers',
      icon: Phone,
      description: 'Transform call center operations with AI dialers and conversation analytics',
      features: [
        'Smart dialing technology and optimization',
        'AI-powered conversation intelligence',
        'Real-time performance monitoring',
        'Compliance and quality management'
      ],
      metrics: {
        improvement: '45% increase in connect rates',
        efficiency: '60% reduction in manual dialing',
        results: 'Real-time coaching insights'
      },
      link: '/solutions/by-use-case/call-centers',
      cta: 'Transform Your Call Center Operations'
    },
    {
      title: 'Marketing Teams',
      icon: Mail,
      description: 'Deliver sophisticated lead generation and nurturing campaigns at scale',
      features: [
        'Advanced audience segmentation',
        'Multi-channel campaign automation',
        'Lead scoring and qualification',
        'Attribution and ROI tracking'
      ],
      metrics: {
        improvement: '250% increase in qualified leads',
        efficiency: '80% reduction in manual tasks',
        results: '3x better conversion rates'
      },
      link: '/solutions/by-use-case/marketing-teams',
      cta: 'Accelerate Marketing Performance'
    },
    {
      title: 'Sales Teams',
      icon: Target,
      description: 'Optimize sales processes and accelerate deal closure with intelligent automation',
      features: [
        'Pipeline management and forecasting',
        'Deal intelligence and insights',
        'Automated follow-up sequences',
        'Performance analytics and coaching'
      ],
      metrics: {
        improvement: '35% shorter sales cycles',
        efficiency: '50% more deals closed',
        results: 'Predictable revenue growth'
      },
      link: '/solutions/by-use-case/sales-teams',
      cta: 'Optimize Your Sales Process'
    },
    {
      title: 'Lead Generation Teams',
      icon: BarChart3,
      description: 'Scale lead generation efforts with AI-powered prospect discovery and qualification',
      features: [
        'AI-powered prospect discovery',
        'Real-time data enrichment',
        'Multi-channel outreach automation',
        'Lead quality scoring and routing'
      ],
      metrics: {
        improvement: '300% more qualified prospects',
        efficiency: '70% faster lead qualification',
        results: '5x better lead-to-customer rates'
      },
      link: '/solutions/by-use-case/lead-generation-teams',
      cta: 'Supercharge Lead Generation'
    },
    {
      title: 'Agencies',
      icon: Building2,
      description: 'Scale your agency with white-label AI sales automation and recurring revenue opportunities',
      features: [
        'Complete white-label platform with your branding',
        'Multi-client management and dashboards',
        'Up to 30% recurring commission structure',
        'Comprehensive partner training and certification'
      ],
      metrics: {
        improvement: '300% faster client acquisition',
        efficiency: '90% profit margins achievable',
        results: 'Predictable recurring revenue model'
      },
      link: '/solutions/by-use-case/agencies',
      cta: 'Launch Your Agency Partnership'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>
      
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Solutions <span className="text-blue-400">By Use Case</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Discover specialized automation solutions designed for your specific team, role, and business model. 
              Each use case comes with tailored features, proven methodologies, and industry-specific optimizations 
              to deliver maximum ROI for your unique requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Use Case</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select the use case that best matches your team and see how our automation solutions 
              can transform your specific challenges into competitive advantages
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-xl">
                    <useCase.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{useCase.title}</h3>
                </div>
                
                <p className="text-gray-300 mb-6 text-lg">{useCase.description}</p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {useCase.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-300 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">Proven Results:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Performance:</span>
                      <span className="text-white font-semibold">{useCase.metrics.improvement}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Efficiency:</span>
                      <span className="text-white font-semibold">{useCase.metrics.efficiency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Quality:</span>
                      <span className="text-white font-semibold">{useCase.metrics.results}</span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href={useCase.link}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer w-full"
                >
                  {useCase.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Navigator CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Not Sure Which Use Case Fits Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Use our interactive Use Case Navigator to get personalized recommendations based on 
              your industry, team size, and goals
            </p>
            <Link href="/solutions/use-case-navigator" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 cursor-pointer">
              Find Your Perfect Solution
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Team&apos;s Performance?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Choose your use case and start with a free trial to see immediate results
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/get-started/book-demo" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                Book a Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      </div>
    </div>
  );
}
