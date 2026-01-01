'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, DollarSign, HelpCircle, Heart, Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function ContactPage() {
  const contactOptions = [
    {
      icon: DollarSign,
      title: 'Sales Inquiry',
      description: 'Ready to purchase? Get a custom quote and speak with our sales team',
      link: '/get-started/contact/sales-inquiry',
      color: 'from-green-500 to-emerald-600',
      urgent: true
    },
    {
      icon: HelpCircle,
      title: 'General Questions',
      description: 'Have questions about features, pricing, or how Sales Centri works?',
      link: '/get-started/contact/general-questions',
      color: 'from-blue-500 to-cyan-600',
      urgent: false
    },
    {
      icon: Heart,
      title: 'Feedback & Suggestions',
      description: 'Share your experience, report issues, or suggest new features',
      link: '/get-started/contact/feedback',
      color: 'from-purple-500 to-pink-600',
      urgent: false
    }
  ];

  const supportChannels = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: '+1 415-754-4766',
      availability: 'Mon-Fri, 9AM-6PM EST',
      link: 'tel:+14157544494'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@salescentri.com',
      availability: '24/7 response within 24 hours',
      link: '#'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 24/7',
      link: '#'
    }
  ];

  const officeLocations = [
    {
      city: 'Palo Alto',
      address: '228 Hamilton Avenue Palo Alto CA 94301',
      phone: '+1 415-754-4766',
      timezone: 'PST'
    },
    {
      city: 'San Francisco - Bay Area',
      address: '1390 Market Street San Francisco CA 94102',
      phone: '+1 415-754-4766',
      timezone: 'PST'
    },
    {
      city: 'New York - Manhattan',
      address: '1177 6th Avenue Tower, 5th Floor New York City NY 10036',
      phone: '+1 415-754-4766',
      timezone: 'EST'
    },
    {
      city: 'Austin',
      address: '111 Congress Avenue, Suite 500 Austin TX 78704',
      phone: '+1 415-754-4766',
      timezone: 'CST'
    },
    {
      city: 'Dallas',
      address: '100 Crescent Court Dallas TX 75201',
      phone: '+1 415-754-4766',
      timezone: 'CST'
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
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                Get in <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                We&apos;re here to help you succeed. Choose the best way to reach out based on your needs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">How Can We Help?</h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">Select the option that best describes your inquiry</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {contactOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 text-center hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden ${
                    option.urgent ? 'ring-2 ring-green-500/30' : ''
                  }`}
                >
                  {/* Background gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {option.urgent && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg shadow-green-500/30">
                        Priority
                      </span>
                    </div>
                  )}
                  
                  <div className="relative z-10">
                    <div className={`flex items-center justify-center w-24 h-24 bg-gradient-to-r ${option.color} rounded-2xl mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/20`}>
                      <option.icon className="w-12 h-12 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-6">{option.title}</h3>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">{option.description}</p>
                    
                    <Link
                      href={option.link}
                      className={`inline-flex items-center gap-3 bg-gradient-to-r ${option.color} text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105`}
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Channels */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Direct Support Channels</h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">Multiple ways to reach our support team</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {supportChannels.map((channel, index) => (
                <motion.div
                  key={channel.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 relative overflow-hidden"
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg shadow-blue-500/20">
                      <channel.icon className="w-10 h-10 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">{channel.title}</h3>
                    <p className="text-blue-400 font-semibold mb-4 text-lg">{channel.description}</p>
                    
                    <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700/30">
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>{channel.availability}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={channel.link}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105"
                    >
                      Contact Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Global Offices</h2>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">Find us around the world</p>
            </motion.div>

            <div className="max-w-5xl mx-auto space-y-6">
              {/* First row - 3 cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officeLocations.slice(0, 3).map((office, index) => (
                  <motion.div
                    key={office.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="group bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{office.city}</h3>
                          <span className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                            {office.timezone}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                        <p className="text-gray-300 text-sm leading-relaxed">{office.address}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Second row - 2 cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {officeLocations.slice(3, 5).map((office, index) => (
                  <motion.div
                    key={office.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
                    className="group bg-gradient-to-br from-gray-900/80 to-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{office.city}</h3>
                          <span className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                            {office.timezone}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
                        <p className="text-gray-300 text-sm leading-relaxed">{office.address}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-br from-blue-500/10 via-gray-900/50 to-cyan-600/10 border border-blue-500/30 rounded-3xl p-10 text-center relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Not Sure Where to Start?</h2>
                <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Try these popular options or browse our help center for instant answers.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link
                    href="/get-started/book-demo"
                    className="group bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-3 justify-center hover:scale-105"
                  >
                    Book a Demo
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link
                    href="/resources/faq"
                    className="group border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 hover:scale-105"
                  >
                    Browse FAQ
                  </Link>
                  <Link
                    href="/get-started/free-trial"
                    className="group border-2 border-green-500/30 text-green-300 px-8 py-4 rounded-2xl font-semibold hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300 hover:scale-105"
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
