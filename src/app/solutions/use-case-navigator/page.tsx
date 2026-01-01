'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Users, Target, TrendingUp } from 'lucide-react';

export default function UseCaseNavigatorPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedTeamSize, setSelectedTeamSize] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Define types for recommendations
  type RecommendationItem = {
    name: string;
    description: string;
    link: string;
  };

  type Recommendations = {
    platforms: RecommendationItem[];
    services: RecommendationItem[];
    solutions: RecommendationItem[];
  };

  const industries = [
    { id: 'technology', name: 'Technology & Software', description: 'SaaS, tech startups, software companies' },
    { id: 'professional', name: 'Professional Services', description: 'Consulting, agencies, legal, accounting' },
    { id: 'manufacturing', name: 'Manufacturing & Industrial', description: 'B2B manufacturing, industrial equipment' },
    { id: 'healthcare', name: 'Healthcare & Life Sciences', description: 'Medical devices, pharmaceuticals, health tech' },
    { id: 'financial', name: 'Financial Services', description: 'Fintech, banking, insurance, investment' },
    { id: 'education', name: 'Education & Training', description: 'EdTech, online learning, corporate training' }
  ];

  const teamSizes = [
    { id: 'startup', name: '1-10 employees', description: 'Early-stage startup or small business' },
    { id: 'small', name: '11-50 employees', description: 'Growing small business' },
    { id: 'medium', name: '51-200 employees', description: 'Mid-market company' },
    { id: 'large', name: '201-1000 employees', description: 'Large enterprise' },
    { id: 'enterprise', name: '1000+ employees', description: 'Fortune 500 enterprise' }
  ];

  const goals = [
    { id: 'lead-generation', name: 'Increase Lead Generation', description: 'Generate more qualified prospects' },
    { id: 'conversion', name: 'Improve Conversion Rates', description: 'Convert more leads to customers' },
    { id: 'efficiency', name: 'Boost Team Efficiency', description: 'Automate manual sales tasks' },
    { id: 'scale', name: 'Scale Sales Operations', description: 'Support rapid business growth' },
    { id: 'pipeline', name: 'Build Better Pipeline', description: 'Create predictable revenue streams' },
    { id: 'roi', name: 'Maximize Sales ROI', description: 'Get better returns on sales investment' }
  ];

  const getRecommendations = (): Recommendations => {
    const recommendations: Recommendations = {
      platforms: [],
      services: [],
      solutions: []
    };

    // Platform recommendations based on goals
    if (selectedGoal === 'lead-generation' || selectedGoal === 'pipeline') {
      recommendations.platforms.push({
        name: 'Contact Intelligence Data',
        description: 'AI-powered prospect discovery and data enrichment',
        link: '/platforms/contact-intelligence'
      });
      recommendations.platforms.push({
        name: 'Lead Management & Generation',
        description: 'Automated lead capture and qualification',
        link: '/platforms/lead-management'
      });
    }

    if (selectedGoal === 'conversion' || selectedGoal === 'efficiency') {
      recommendations.platforms.push({
        name: 'Voice AI & Dialer Solutions',
        description: 'Intelligent calling automation and analytics',
        link: '/platforms/lead-management'
      });
    }

    // Service recommendations based on team size
    if (selectedTeamSize === 'startup' || selectedTeamSize === 'small') {
      recommendations.services.push({
        name: 'SDR as a Service',
        description: 'Professional sales development on-demand',
        link: '/services/sdr-as-a-service'
      });
    }

    if (selectedTeamSize === 'medium' || selectedTeamSize === 'large') {
      recommendations.services.push({
        name: 'Custom Workflow Automation',
        description: 'Tailored automation for complex processes',
        link: '/services/custom-workflow-automation'
      });
    }

    // Solution recommendations based on industry
    if (selectedIndustry === 'technology' || selectedIndustry === 'professional') {
      recommendations.solutions.push({
        name: 'PSA Suite One-Stop Solution',
        description: 'Complete automation platform for tech companies',
        link: '/solutions/psa-suite-one-stop-solution'
      });
    }

    return recommendations;
  };

  const handleGetRecommendations = () => {
    if (selectedIndustry && selectedTeamSize && selectedGoal) {
      setShowRecommendations(true);
    }
  };

  const recommendations = showRecommendations ? getRecommendations() : null;

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
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300">Interactive Solution Navigator</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Find Your Perfect
              <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent"> Sales Automation</span> Solution
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Every business has unique sales challenges that require tailored automation solutions. 
              Instead of guessing which features you need, our interactive Use Case Navigator asks about your industry, 
              team size, and goals to recommend the exact automation tools that will drive results for your specific situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/solutions/psa-suite-one-stop-solution" 
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer"
              >
                Start with SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/get-started/book-demo" 
                className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer"
              >
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Assessment */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Personalized Solution Discovery</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Answer a few questions to get personalized recommendations for your business
            </p>
          </motion.div>

          {/* Step 1: Industry Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</span>
              What industry are you in?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industries.map((industry) => (
                <motion.button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 cursor-pointer ${
                    selectedIndustry === industry.id 
                      ? 'border-blue-500 bg-blue-500/20 backdrop-blur-sm' 
                      : 'border-gray-700/50 bg-gray-800/50 hover:border-blue-400 backdrop-blur-sm'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="text-lg font-semibold text-white mb-2">{industry.name}</h4>
                  <p className="text-gray-400 text-sm">{industry.description}</p>
                  {selectedIndustry === industry.id && (
                    <CheckCircle className="w-6 h-6 text-blue-400 mt-3" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Step 2: Team Size */}
          {selectedIndustry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</span>
                What&apos;s your team size?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamSizes.map((size) => (
                  <motion.button
                    key={size.id}
                    onClick={() => setSelectedTeamSize(size.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 cursor-pointer ${
                      selectedTeamSize === size.id 
                        ? 'border-blue-500 bg-blue-500/20 backdrop-blur-sm' 
                        : 'border-gray-700/50 bg-gray-800/50 hover:border-blue-400 backdrop-blur-sm'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">{size.name}</h4>
                    </div>
                    <p className="text-gray-400 text-sm">{size.description}</p>
                    {selectedTeamSize === size.id && (
                      <CheckCircle className="w-6 h-6 text-blue-400 mt-3" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Goals */}
          {selectedTeamSize && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</span>
                What&apos;s your primary goal?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((goal) => (
                  <motion.button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 cursor-pointer ${
                      selectedGoal === goal.id 
                        ? 'border-blue-500 bg-blue-500/20 backdrop-blur-sm' 
                        : 'border-gray-700/50 bg-gray-800/50 hover:border-blue-400 backdrop-blur-sm'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">{goal.name}</h4>
                    </div>
                    <p className="text-gray-400 text-sm">{goal.description}</p>
                    {selectedGoal === goal.id && (
                      <CheckCircle className="w-6 h-6 text-blue-400 mt-3" />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Get Recommendations Button */}
          {selectedIndustry && selectedTeamSize && selectedGoal && !showRecommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <button
                onClick={handleGetRecommendations}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-12 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-3 mx-auto hover:scale-105 cursor-pointer"
              >
                <TrendingUp className="w-6 h-6" />
                Get My Custom Recommendations
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {/* Recommendations */}
          {showRecommendations && recommendations && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-16"
            >
              <h3 className="text-3xl font-bold text-white mb-8 text-center">
                Your Personalized Recommendations
              </h3>
              
              {recommendations.platforms.length > 0 && (
                <div className="mb-12">
                  <h4 className="text-2xl font-bold text-blue-400 mb-6">Recommended Platforms</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.platforms.map((platform, index) => (
                      <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                        <h5 className="text-xl font-semibold text-white mb-3">{platform.name}</h5>
                        <p className="text-gray-300 mb-4">{platform.description}</p>
                        <Link href={platform.link} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 cursor-pointer">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.services.length > 0 && (
                <div className="mb-12">
                  <h4 className="text-2xl font-bold text-blue-400 mb-6">Recommended Services</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.services.map((service, index) => (
                      <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                        <h5 className="text-xl font-semibold text-white mb-3">{service.name}</h5>
                        <p className="text-gray-300 mb-4">{service.description}</p>
                        <Link href={service.link} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 cursor-pointer">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.solutions.length > 0 && (
                <div className="mb-12">
                  <h4 className="text-2xl font-bold text-blue-400 mb-6">Recommended Solutions</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {recommendations.solutions.map((solution, index) => (
                      <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                        <h5 className="text-xl font-semibold text-white mb-3">{solution.name}</h5>
                        <p className="text-gray-300 mb-4">{solution.description}</p>
                        <Link href={solution.link} className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 cursor-pointer">
                          Learn More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center">
                <Link href="/get-started/book-demo" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center gap-2 hover:scale-105 cursor-pointer">
                  Book Expert Consultation
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-cyan-700/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Your Solution Discovery Journey
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Get personalized recommendations and start transforming your sales process today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/solutions/psa-suite-one-stop-solution" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                View Complete Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
