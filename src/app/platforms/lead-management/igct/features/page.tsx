'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, Network, ArrowRight, CheckCircle, Star, Zap, Shield, Clock, Users, Activity, Settings, BarChart3 } from 'lucide-react';

export default function IGCTFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/igct';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const features = [
    {
      icon: Network,
      title: "Intelligent Routing Engine",
      description: "Advanced call routing algorithms for optimal performance and cost efficiency",
      capabilities: [
        "Least Cost Routing (LCR) algorithms",
        "Quality-based routing decisions",
        "Real-time carrier performance monitoring",
        "Dynamic route optimization",
        "Geographic load balancing",
        "Failover &amp; redundancy management"
      ]
    },
    {
      icon: Globe,
      title: "Global Network Coverage",
      description: "Comprehensive worldwide coverage with premium carrier partnerships",
      capabilities: [
        "195+ countries &amp; territories",
        "Tier-1 carrier partnerships",
        "Multiple route options per destination",
        "Regional point-of-presence (PoP)",
        "Local number portability support",
        "Emergency services routing"
      ]
    },
    {
      icon: Activity,
      title: "Quality Management",
      description: "Advanced quality monitoring and assurance systems",
      capabilities: [
        "Real-time call quality monitoring",
        "Answer Seizure Ratio (ASR) tracking",
        "Average Call Duration (ACD) analysis",
        "Post Dial Delay (PDD) optimization",
        "Voice quality scoring",
        "Carrier performance benchmarking"
      ]
    },
    {
      icon: Settings,
      title: "Protocol &amp; Standards",
      description: "Comprehensive support for industry protocols and standards",
      capabilities: [
        "SIP (Session Initiation Protocol)",
        "SS7 signaling support",
        "H.323 protocol compatibility",
        "ISUP (ISDN User Part) support",
        "TDM &amp; VoIP integration",
        "Custom protocol development"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics &amp; Reporting",
      description: "Comprehensive analytics and business intelligence tools",
      capabilities: [
        "Real-time call analytics",
        "Traffic pattern analysis",
        "Cost optimization reports",
        "Carrier performance metrics",
        "Revenue &amp; margin analysis",
        "Custom dashboard creation"
      ]
    },
    {
      icon: Shield,
      title: "Security &amp; Compliance",
      description: "Enterprise-grade security with regulatory compliance",
      capabilities: [
        "End-to-end call encryption",
        "Fraud detection &amp; prevention",
        "Regulatory compliance tools",
        "Call detail record (CDR) security",
        "Access control &amp; authentication",
        "Audit trails &amp; compliance reporting"
      ]
    }
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
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                IGCT Features
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced International Gateway Call Termination capabilities designed to optimize 
              call routing, reduce costs, and ensure superior voice quality across global networks.
            </p>
          </div>
        </motion.section>

        {/* Features Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50"
                >
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {feature.capabilities.map((capability, capIndex) => (
                      <li key={capIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: capability }}></span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Feature Highlights */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our IGCT Platform?</h2>
              <p className="text-lg text-gray-300">
                Industry-leading features that deliver exceptional call quality and cost optimization
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Sub-6ms Setup",
                  description: "Lightning-fast call setup times for optimal user experience"
                },
                {
                  icon: Users,
                  title: "Carrier Diversity",
                  description: "Access to 500+ global carriers for maximum route options"
                },
                {
                  icon: Star,
                  title: "98.5% ASR",
                  description: "Industry-leading Answer Seizure Ratio for reliable connections"
                },
                {
                  icon: Clock,
                  title: "24/7 Monitoring",
                  description: "Round-the-clock network monitoring and optimization"
                }
              ].map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <highlight.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{highlight.title}</h3>
                  <p className="text-gray-400 text-sm">{highlight.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Optimize your international call routing with our advanced IGCT platform. 
              Reduce costs, improve quality, and scale globally with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/book-demo"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Schedule Feature Demo</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
