'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Video, Users, Clock, CheckCircle, Play, MessageSquare, Zap, X } from 'lucide-react';
import BookingsEmbed from '../../components/BookingsEmbed';

function BookDemoContent() {
  const [selectedDemoType, setSelectedDemoType] = useState('standard');
  const searchParams = useSearchParams();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    amount: number;
    currency: string;
    plan: string;
    paymentId: string;
  } | null>(null);

  useEffect(() => {
    // Check for payment success parameters
    const paymentSuccess = searchParams.get('payment_success');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');
    const plan = searchParams.get('plan');
    const paymentId = searchParams.get('payment_id');

    if (paymentSuccess === 'true' && amount && currency && plan && paymentId) {
      setPaymentData({
        amount: parseFloat(amount),
        currency,
        plan,
        paymentId
      });
      setShowPaymentSuccess(true);

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment_success');
      url.searchParams.delete('amount');
      url.searchParams.delete('currency');
      url.searchParams.delete('plan');
      url.searchParams.delete('payment_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const demoTypes = [
    {
      id: 'standard',
      title: 'Standard Demo',
      duration: '30 minutes',
      description: 'Perfect introduction to Sales Centri\'s core features',
      features: [
        'Platform overview',
        'Key feature demonstration',
        'Q&A session',
        'Pricing discussion'
      ],
      icon: Play,
      popular: true
    },
    {
      id: 'deep-dive',
      title: 'Deep Dive Demo',
      duration: '60 minutes',
      description: 'Comprehensive walkthrough for technical teams',
      features: [
        'Detailed feature exploration',
        'Technical Q&A',
        'Integration discussion',
        'Custom use case review'
      ],
      icon: Zap,
      popular: false
    },
    {
      id: 'team',
      title: 'Team Demo',
      duration: '45 minutes',
      description: 'Group demonstration for multiple stakeholders',
      features: [
        'Multi-stakeholder presentation',
        'Role-based feature focus',
        'Team collaboration features',
        'Implementation planning'
      ],
      icon: Users,
      popular: false
    }
  ];

  const demoOptions = [
    {
      icon: Video,
      title: 'Live Interactive Demo',
      description: 'Join a real-time demo with our product experts',
      link: '/get-started/book-demo/feature-tour',
      action: 'Schedule Live Demo',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: MessageSquare,
      title: 'Demo + Q&A Session',
      description: 'Get your questions answered by our specialists',
      link: '/get-started/book-demo/live-qa',
      action: 'Book Q&A Demo',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: CheckCircle,
      title: 'Onboarding Preview',
      description: 'See how easy it is to get started with Sales Centri',
      link: '/get-started/book-demo/onboarding-checklist',
      action: 'Preview Onboarding',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const benefits = [
    'See SalesCentri in action with real data',
    'Learn best practices from our experts',
    'Get answers to your specific questions',
    'Understand ROI potential for your team',
    'Explore integration possibilities',
    'Receive personalized recommendations'
  ];

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM'
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Payment Success Banner */}
        {showPaymentSuccess && paymentData && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-500/30 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      Payment Successful! 🎉
                    </h3>
                    <p className="text-sm text-gray-300">
                      Your subscription to <span className="font-semibold text-green-400">{paymentData.plan}</span> ({paymentData.currency} {paymentData.amount.toFixed(2)}) has been processed.
                    </p>
                    <p className="text-sm text-blue-300 mt-2 font-medium">
                      To proceed with your subscription and start your campaign, please book a meeting below.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPaymentSuccess(false)}
                  className="text-gray-400 hover:text-white transition-colors ml-4"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Book a <span className="text-blue-400">Demo</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                See SalesCentri in action. Get a personalized demonstration tailored to your business needs and discover how we can transform your sales process.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a
                  href="https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${showPaymentSuccess ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/50' : 'bg-gradient-to-r from-blue-500 to-cyan-600'} text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105`}
                  data-track="book_demo_page_schedule_now"
                >
                  {showPaymentSuccess ? 'Book Meeting to Start Campaign' : 'Schedule Demo Now'}
                  <Calendar className="w-5 h-5" />
                </a>
                <Link
                  href="/get-started/free-trial"
                  className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300"
                >
                  Try Free Trial Instead
                </Link>
                <Link
                  href="/solutions/psa-suite-one-stop-solution"
                  className="border border-cyan-500/30 text-cyan-300 px-8 py-4 rounded-xl font-semibold hover:bg-cyan-500/10 transition-all duration-300"
                >
                  Try SalesGPT Now
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Demo Types */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Choose Your Demo Type</h2>
              <p className="text-xl text-gray-300">Select the format that works best for you</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {demoTypes.map((demo, index) => (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  onClick={() => setSelectedDemoType(demo.id)}
                  className={`bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-blue-500/50 ${
                    selectedDemoType === demo.id ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-700/50'
                  } ${demo.popular ? 'relative' : ''}`}
                >
                  {demo.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${
                      selectedDemoType === demo.id 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600' 
                        : 'bg-gray-700'
                    }`}>
                      <demo.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{demo.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {demo.duration}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{demo.description}</p>
                  
                  <ul className="space-y-2">
                    {demo.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-400">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Options */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">Demo Formats Available</h2>
              <p className="text-xl text-gray-300">Choose the experience that fits your needs</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {demoOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className={`flex items-center justify-center w-20 h-20 bg-gradient-to-r ${option.color} rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <option.icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{option.title}</h3>
                  <p className="text-gray-300 mb-6">{option.description}</p>
                  
                  <Link
                    href={option.link}
                    className={`inline-flex items-center gap-2 bg-gradient-to-r ${option.color} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300`}
                  >
                    {option.action}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/solutions/psa-suite-one-stop-solution"
                className="inline-flex items-center gap-2 border border-cyan-500/30 text-cyan-300 px-8 py-3 rounded-xl font-semibold hover:bg-cyan-500/10 transition-all duration-300"
              >
                Launch SalesGPT
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-white mb-4">What You&apos;ll Get from Our Demo</h2>
              <p className="text-xl text-gray-300">Maximize your time with our product experts</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex items-center gap-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                >
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Direct scheduling handled via external link now */}
      </div>
    </div>
  );
}

export default function BookDemoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <BookDemoContent />
    </Suspense>
  );
}
