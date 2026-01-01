'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Clock, Shield, Users, Zap, Gift, Star } from 'lucide-react';

export default function FreeTrialPage() {
  const trialFeatures = [
    {
      icon: Clock,
      title: '14 Days Full Access',
      description: 'Complete access to all premium features for 14 days'
    },
    {
      icon: Shield,
      title: 'No Credit Card Required',
      description: 'Start your trial without any payment information'
    },
    {
      icon: Users,
      title: 'Full Team Access',
      description: 'Invite your entire team during the trial period'
    },
    {
      icon: Zap,
      title: 'All Features Included',
      description: 'Experience every feature available in our platform'
    }
  ];

  const includedFeatures = [
    'AI Hunter with 1,000 searches',
    'Contact validation for 5,000 contacts',
    'SalesGPT conversations',
    'All CRM integrations',
    'Advanced analytics dashboard',
    'Team collaboration tools',
    'Email & chat support',
    'Custom workflow automation',
    'Lead scoring and routing',
    'API access',
    'Mobile app access',
    'Training resources'
  ];

  const steps = [
    {
      number: 1,
      title: 'Sign Up',
      description: 'Create your account with just basic information'
    },
    {
      number: 2,
      title: 'Setup',
      description: 'Configure your workspace and invite team members'
    },
    {
      number: 3,
      title: 'Explore',
      description: 'Start using all features immediately'
    },
    {
      number: 4,
      title: 'Choose Plan',
      description: 'Select your plan before trial expires'
    }
  ];

  const testimonials = [
    {
      quote: "The free trial gave us complete confidence in Sales Centri. We saw results within the first week.",
      author: "Sarah Johnson",
      title: "Sales Director",
      company: "TechCorp",
      rating: 5
    },
    {
      quote: "14 days was perfect to test with our entire team. The onboarding was seamless.",
      author: "Michael Chen",
      title: "VP Sales",
      company: "GrowthCo",
      rating: 5
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
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-section">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <Gift className="w-8 h-8 text-blue-400" />
                <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  FREE TRIAL
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Start Your <span className="text-blue-400">Free Trial</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Experience the full power of Sales Centri with a 14-day free trial. No credit card required, no commitments, cancel anytime.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/get-started/free-trial"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105"
                >
                  Start Free Trial Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/get-started/book-demo"
                  className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300"
                >
                  Book Demo First
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trial Features */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Free Trial?</h2>
              <p className="text-xl text-gray-300">No restrictions, no hidden costs, just pure value</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trialFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Everything Included</h2>
              <p className="text-xl text-gray-300">Full access to all premium features during your trial</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {includedFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-center gap-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4"
                >
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-xl text-gray-300">Get started in minutes</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Trial Success Stories</h2>
              <p className="text-xl text-gray-300">See what teams discover during their free trial</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.title}</p>
                    <p className="text-blue-400 text-sm">{testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/30 rounded-2xl p-8 text-center"
            >
              <Zap className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Sales?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of sales teams who have already discovered the power of AI-driven sales automation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/get-started/free-trial"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/get-started/contact/general-questions"
                  className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Have Questions?
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
