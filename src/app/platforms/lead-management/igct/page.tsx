'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Server, Globe, ArrowRight, CheckCircle, Clock, Users, Activity, Cloud, Network } from 'lucide-react';

export default function IGCTPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/igct';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  return (
    <>
      {/* Sub-navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <nav className="flex space-x-8">
              {subNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-4 px-2 text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                  IGCT
                </h1>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                International Gateway Call Termination
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Managing international call routing and termination across multiple carriers requires complex 
                infrastructure and expensive hardware investments. Our IGCT platform provides cloud-based 
                international gateway services—enabling you to route calls globally with high-quality termination, 
                competitive rates, and real-time analytics without maintaining your own gateway infrastructure.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Globe, label: "Countries Covered", value: "195+" },
                { icon: Activity, label: "Call Quality (ASR)", value: "98.5%" },
                { icon: Clock, label: "Average Setup Time", value: "<6ms" },
                { icon: Users, label: "Minutes/Month", value: "50M+" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Core Capabilities */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Global Routing */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
                  <Network className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Global Routing Network</h3>
                <ul className="space-y-4">
                  {[
                    'Intelligent least cost routing (LCR)',
                    'Multiple carrier redundancy',
                    'Real-time route optimization',
                    'Quality-based routing decisions',
                    'Geographic load balancing',
                    'Failover &amp; backup routing'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Call Management */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Cloud className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Call Management</h3>
                <ul className="space-y-4">
                  {[
                    'SIP protocol support &amp; connectivity',
                    'Call detail records (CDR) &amp; billing',
                    'Real-time call monitoring',
                    'Quality of service (QoS) management',
                    'Fraud detection &amp; prevention',
                    'Custom routing rules &amp; policies'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Enterprise Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                  <Server className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Enterprise Features</h3>
                <ul className="space-y-4">
                  {[
                    'High-capacity call termination',
                    'Dedicated network resources',
                    'API integration &amp; automation',
                    'White-label gateway solutions',
                    'Compliance &amp; regulatory support',
                    '24/7 technical support &amp; monitoring'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }}></span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-indigo-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Scale Your International Call Routing?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Connect to our global gateway network for high-quality international call termination. 
              Reduce costs and improve call quality with intelligent routing and carrier redundancy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/book-demo"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Scale International Call Routing - Book Demo</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
