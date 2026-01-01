'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  Users,
  Building2,
  Rocket,
  ArrowRight,
  CheckCircle,
  Globe,
  Zap,
  Target,
  Handshake,
  TrendingUp,
  Shield,
  Briefcase,
  Network,
  Sparkles,
} from 'lucide-react';
import { Navigation } from '../components/Navigation';
import RegistrationFlow from '../components/process/RegistrationFlow';

export default function MarketplaceOverviewPage() {
  // Track page view
  useEffect(() => {
    // External tracker handles page views via SPA bridge
  }, []);

  const marketplaceBenefits = [
    {
      icon: Network,
      title: 'Connect with Verified Businesses',
      description: 'Access a curated network of startups, buyers, and suppliers across multiple industries and regions. All businesses are verified and vetted for quality.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Target,
      title: 'Find Your Ideal Partners',
      description: 'Use advanced filtering and AI-powered matching to discover businesses that align with your goals, industry, and growth stage.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Accelerate Business Growth',
      description: 'Whether you\'re a startup seeking funding, a buyer looking for solutions, or a supplier expanding your reach, connect faster and grow smarter.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Handshake,
      title: 'Streamlined Collaboration',
      description: 'Built-in tools for communication, document sharing, and deal management make it easy to build lasting business relationships.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  const businessTypes = [
    {
      icon: Rocket,
      title: 'For Startups',
      description: 'Showcase your innovation, connect with investors, find strategic partners, and access resources to scale your business.',
      benefits: [
        'Visibility to potential investors and buyers',
        'Access to mentorship and resources',
        'Networking with industry leaders',
        'Funding and partnership opportunities',
      ],
      color: 'from-blue-500 to-purple-500',
    },
    {
      icon: Building2,
      title: 'For Buyers',
      description: 'Discover innovative solutions, compare vendors, and connect directly with suppliers who can meet your business needs.',
      benefits: [
        'Access to verified suppliers and service providers',
        'Compare solutions and pricing',
        'Direct communication with vendors',
        'Streamlined procurement process',
      ],
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: Store,
      title: 'For Suppliers',
      description: 'Expand your market reach, showcase your products and services, and connect with qualified buyers actively seeking solutions.',
      benefits: [
        'Increased market visibility',
        'Access to qualified leads',
        'Direct buyer connections',
        'Opportunity to scale your business',
      ],
      color: 'from-orange-500 to-pink-500',
    },
  ];

  const keyFeatures = [
    {
      icon: Shield,
      title: 'Verified Businesses Only',
      description: 'All marketplace participants undergo verification to ensure trust and quality.',
    },
    {
      icon: Globe,
      title: 'Global Reach, Local Focus',
      description: 'Connect with businesses worldwide while maintaining regional compliance and support.',
    },
    {
      icon: TrendingUp,
      title: 'AI-Powered Matching',
      description: 'Our intelligent system matches you with the most relevant business opportunities.',
    },
    {
      icon: Briefcase,
      title: 'Professional Network',
      description: 'Join a community of serious businesses committed to growth and collaboration.',
    },
  ];

  const stats = [
    { label: 'Verified Businesses', value: '500+' },
    { label: 'Industries Covered', value: '40+' },
    { label: 'Countries', value: '50+' },
    { label: 'Successful Connections', value: '1,000+' },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-4 pb-16 px-6 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
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

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6"
            >
              <Store className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">SalesCentri Marketplace</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect, Collaborate, and{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Grow Your Business
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              The SalesCentri Marketplace is your gateway to a thriving ecosystem of verified businesses. 
              Whether you're a startup seeking growth opportunities, a buyer looking for innovative solutions, 
              or a supplier expanding your reach, connect with the right partners to accelerate your success.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/market-place/register"
                data-track="marketplace_cta_register_now"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/market-place/dashboard"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                View Dashboard
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* What is Marketplace Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                What is the Sales Centri Marketplace?
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The Sales Centri Marketplace is a comprehensive B2B ecosystem designed to connect startups, 
                buyers, and suppliers in a trusted, verified environment. We facilitate meaningful business 
                connections that drive growth, innovation, and collaboration across industries and regions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">
                  A Trusted Business Network
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Our marketplace brings together verified businesses from around the world, creating 
                  opportunities for startups to find investors and partners, buyers to discover innovative 
                  solutions, and suppliers to expand their market reach.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Every business on our platform undergoes a verification process to ensure quality, 
                  trust, and compliance with regional regulations. This means you can focus on building 
                  relationships instead of worrying about credibility.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-8 border border-gray-700/50"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Network className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Powered by AI & Technology
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Our intelligent matching system uses AI to connect you with the most relevant business 
                  opportunities based on your profile, needs, and goals.
                </p>
                <div className="space-y-3">
                  {[
                    'Smart business matching',
                    'Industry and region filtering',
                    'Real-time opportunity alerts',
                    'Automated connection facilitation',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 px-6 bg-gradient-to-r from-blue-900/20 via-black to-purple-900/20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                What the Marketplace Can Do for Your Business
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how the Sales Centri Marketplace transforms business connections and accelerates growth
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {marketplaceBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Business Types Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Built for Every Business Type
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Whether you're just starting out or looking to scale, the marketplace offers tailored benefits for your business
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {businessTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 overflow-hidden relative"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${type.color} opacity-10 rounded-full blur-3xl`} />
                  <div className={`w-16 h-16 bg-gradient-to-br ${type.color} rounded-xl flex items-center justify-center mb-6 relative z-10`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                    {type.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed relative z-10">
                    {type.description}
                  </p>
                  <div className="space-y-3 relative z-10">
                    {type.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Key Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 px-6 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose Sales Centri Marketplace
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Get started in three simple steps and start connecting with businesses that matter
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Register Your Business',
                  description: 'Create your profile, select your business type (Startup, Buyer, or Supplier), and provide your company details. Our verification process ensures quality and trust.',
                  icon: Briefcase,
                },
                {
                  step: '2',
                  title: 'Get Verified',
                  description: 'Submit required documents based on your region and business type. Our team reviews and verifies your information to maintain marketplace integrity.',
                  icon: Shield,
                },
                {
                  step: '3',
                  title: 'Start Connecting',
                  description: 'Once verified, explore the marketplace, discover relevant businesses, and initiate connections. Our AI-powered matching helps you find the right partners.',
                  icon: Network,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-6">
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                      <step.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Registration Flow Section */}
        <RegistrationFlow
          title="Sales Centri Marketplace Registration Flow"
          subtitle="A streamlined 5-step process to get your business up and running on our marketplace"
        />

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="py-20 px-6"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-12 border border-gray-700/50">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-6"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Grow Your Business?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the Sales Centri Marketplace today and connect with verified businesses that can help 
                you achieve your goals. Whether you're seeking partners, customers, or suppliers, we make 
                meaningful connections happen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/market-place/register"
                  data-track="marketplace_cta_register_now_bottom"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/resources/case-studies"
                  className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  View Success Stories
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
