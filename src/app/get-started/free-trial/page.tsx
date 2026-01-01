'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, CheckCircle, Users, CreditCard, Rocket } from 'lucide-react';

export default function FreeTrialSignupPage() {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Plan',
      description: 'Select the perfect plan for your team size and needs',
      link: '/get-started/free-trial/choose-plan',
      icon: CreditCard,
      duration: '2 min'
    },
    {
      number: 2,
      title: 'Create Account',
      description: 'Set up your account with basic information',
      link: '/get-started/free-trial/account-setup',
      icon: Users,
      duration: '3 min'
    },
    {
      number: 3,
      title: 'Access Resources',
      description: 'Get training materials and support resources',
      link: '/get-started/free-trial/support-resources',
      icon: Rocket,
      duration: '5 min'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: '14-Day Free Trial',
      description: 'Full access to all features for 14 days'
    },
    {
      icon: CreditCard,
      title: 'No Credit Card Required',
      description: 'Start your trial without any payment information'
    },
    {
      icon: Shield,
      title: 'Cancel Anytime',
      description: 'No commitments, cancel or change plans anytime'
    },
    {
      icon: Users,
      title: 'Full Team Access',
      description: 'Invite your entire team during the trial period'
    }
  ];

  const features = [
    'AI-powered lead generation',
    'Advanced contact validation',
    'SalesGPT conversations',
    'CRM integrations',
    'Real-time analytics',
    'Team collaboration tools',
    'Custom workflows',
    'Priority support'
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
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Start Your <span className="text-blue-400">Free Trial</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Experience the full power of Sales Centri with a 14-day free trial. No credit card required, cancel anytime.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/solutions/psa-suite-one-stop-solution"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105"
                >
                  Start Free Trial Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300"
                  data-track="free_trial_book_demo_first"
                >
                  Book Demo First
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Quick Setup Process</h2>
              <p className="text-xl text-gray-300">Get started in less than 10 minutes</p>
            </motion.div>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full">
                        <span className="text-2xl font-bold text-white">{step.number}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">{step.description}</p>
                      <Link
                        href={step.link}
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
                      >
                        {step.number === 1 ? 'Start Here' : 'Continue'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="flex-shrink-0">
                      <step.icon className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">What&apos;s Included in Your Trial</h2>
              <p className="text-xl text-gray-300">Full access to all premium features</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
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
                Join thousands of sales teams who have already boosted their performance with Sales Centri&apos;s AI-powered platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/get-started/free-trial/choose-plan"
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
