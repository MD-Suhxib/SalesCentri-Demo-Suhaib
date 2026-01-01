'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Monitor, Target, Zap, Network, Atom, ArrowRight, Users, ShoppingCart, Factory } from 'lucide-react';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'modes' | 'marketplace'>('modes');

  const demoVideos = [
    {
      id: "lightning-mode",
      title: "Lightning Mode",
      description: "Ultra-fast AI-powered research and insights",
      icon: Zap,
      videoSrc: "https://cdn.salescentri.com/lightning-mode-demo-video-h264.mp4",
      href: "/demo/lightning-mode",
      color: "blue"
    },
    {
      id: "focus-mode",
      title: "Focus Mode",
      description: "Experience distraction-free sales automation",
      icon: Target,
      videoSrc: "https://cdn.salescentri.com/focus-mode-demo-video-h264.mp4",
      href: "/demo/focus-mode",
      color: "purple"
    },
    {
      id: "dashboard",
      title: "Dashboard",
      description: "Comprehensive analytics and insights",
      icon: Monitor,
      videoSrc: "https://cdn.salescentri.com/dashboard-demo-video.mp4",
      href: "/demo/dashboard",
      color: "cyan"
    },
    {
      id: "multigpt",
      title: "MultiGPT",
      description: "Multi-source aggregated AI research",
      icon: Network,
      videoSrc: "https://cdn.salescentri.com/multi-gpt-demo-video-h264.mp4",
      href: "/demo/multigpt",
      color: "green"
    },
    {
      id: "researchgpt",
      title: "ResearchGPT",
      description: "Deep dive AI research and analysis",
      icon: Atom,
      videoSrc: "https://cdn.salescentri.com/research-gpt-demo-video-h264.mp4",
      href: "/demo/researchgpt",
      color: "pink"
    }
  ];

  const marketplaceDemos = [
    {
      id: "startup-journey",
      title: "Startup Journey",
      description: "Complete startup onboarding and marketplace navigation experience",
      icon: Users,
      href: "/demo/market-place/startups",
      color: "emerald",
      badge: "Interactive"
    },
    {
      id: "buyer-journey",
      title: "Buyer Journey", 
      description: "Corporate procurement and vendor discovery process",
      icon: ShoppingCart,
      href: "/demo/market-place/buyers",
      color: "blue",
      badge: "Interactive"
    },
    {
      id: "supplier-journey",
      title: "Supplier Journey",
      description: "Business onboarding and marketplace management for suppliers",
      icon: Factory,
      href: "/demo/market-place/suppliers", 
      color: "purple",
      badge: "Interactive"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Mode Toggle Styles */}
      <style jsx>{`
        .mode-toggle-button {
          background: rgba(59, 130, 246, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .mode-toggle-button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(59, 130, 246, 0.15),
            transparent
          );
          transform: rotate(45deg);
          transition: transform 0.6s ease;
          opacity: 0;
        }
        .mode-toggle-button:hover::before {
          animation: shine 0.6s ease-in-out;
          opacity: 1;
        }
        .mode-toggle-button:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.5);
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .mode-active {
          background: rgba(59, 130, 246, 0.2) !important;
          border-color: rgba(59, 130, 246, 0.5) !important;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(147, 197, 253, 0.3) !important;
          border-radius: 50px !important;
          transform: scale(1.02);
        }
        .mode-active::before {
          background: linear-gradient(
            45deg,
            transparent,
            rgba(59, 130, 246, 0.2),
            transparent
          );
        }
        .mode-inactive {
          background: rgba(59, 130, 246, 0.08) !important;
          border-color: rgba(59, 130, 246, 0.2) !important;
          transform: scale(0.98);
        }
        .marketplace-active {
          background: rgba(16, 185, 129, 0.2) !important;
          border-color: rgba(16, 185, 129, 0.5) !important;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.25), inset 0 1px 0 rgba(52, 211, 153, 0.3) !important;
          border-radius: 50px !important;
          transform: scale(1.02);
        }
        .marketplace-inactive {
          background: rgba(16, 185, 129, 0.08) !important;
          border-color: rgba(16, 185, 129, 0.2) !important;
          transform: scale(0.98);
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-18 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Play className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300">Demo Videos</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                See Sales Centri in
                <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent"> Action</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Watch how our AI-powered platform transforms your sales process from lead generation to deal closure. 
                Explore each demo mode and discover the power of automated sales intelligence.
              </p>
            </motion.div>

            {/* Mode Toggle Navigation Bar */}
            <div className="mb-12">
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 border border-blue-500/20 rounded-2xl p-2 backdrop-blur-sm">
                  {/* AI Modes */}
                  <button
                    onClick={() => setActiveTab('modes')}
                    className={`mode-toggle-button transition-all duration-500 ease-in-out cursor-pointer flex items-center space-x-2 px-6 py-2.5 rounded-full ${
                      activeTab === 'modes' ? 'mode-active' : 'mode-inactive'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium tracking-wide text-white">
                      AI Modes
                    </span>
                  </button>

                  {/* Marketplace */}
                  <button
                    onClick={() => setActiveTab('marketplace')}
                    className={`mode-toggle-button transition-all duration-500 ease-in-out cursor-pointer flex items-center space-x-2 px-6 py-2.5 rounded-full ${
                      activeTab === 'marketplace' ? 'marketplace-active' : 'marketplace-inactive'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium tracking-wide text-white">
                      Marketplace
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Demo Videos Grid - Modes */}
            {activeTab === 'modes' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-7xl mx-auto">
                {demoVideos.map((video, index) => {
                  const IconComponent = video.icon;
                  return (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={video.href}>
                        <div className="group bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer h-full flex flex-col">
                          {/* Video Preview */}
                          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                            <video
                              src={video.videoSrc}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                            {/* Play Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-300">
                              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                                <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                            {/* Icon Badge */}
                            <div className={`absolute top-3 left-3 p-2 rounded-lg bg-${video.color}-500/20 border border-${video.color}-500/30 backdrop-blur-sm`}>
                              <IconComponent className={`w-4 h-4 text-${video.color}-400`} />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-blue-300 transition-colors">
                              {video.title}
                            </h3>
                            <p className="text-gray-300 text-sm mb-3 flex-1 line-clamp-2">
                              {video.description}
                            </p>
                            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                              <span>Watch Demo</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Marketplace Presentations Section */}
            {activeTab === 'marketplace' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-16"
              >
                {/* Marketplace Demos Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {marketplaceDemos.map((demo, index) => {
                    const IconComponent = demo.icon;
                    return (
                      <motion.div
                        key={demo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Link href={demo.href}>
                          <div className="group bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden backdrop-blur-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer h-full flex flex-col">
                            {/* Presentation Preview */}
                            <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                              {/* Animated Background Pattern */}
                              <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 via-transparent to-purple-900/40" />
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1),transparent_70%)]" />
                              
                              {/* Interactive Badge */}
                              <div className="absolute top-3 right-3 bg-emerald-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                                {demo.badge}
                              </div>

                              {/* Play Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-300">
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                                  <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                                </div>
                              </div>
                              
                              {/* Icon Badge */}
                              <div className={`absolute top-3 left-3 p-2 rounded-lg bg-${demo.color}-500/20 border border-${demo.color}-500/30 backdrop-blur-sm`}>
                                <IconComponent className={`w-4 h-4 text-${demo.color}-400`} />
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-emerald-300 transition-colors">
                                {demo.title}
                              </h3>
                              <p className="text-gray-300 text-sm mb-3 flex-1 line-clamp-2">
                                {demo.description}
                              </p>
                              <div className="flex items-center text-emerald-400 text-sm font-medium group-hover:text-emerald-300 transition-colors">
                                <span>View Presentation</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8 md:p-12 backdrop-blur-sm"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Experience Sales Centri?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Book a personalized demo with our team to see how Sales Centri can transform your sales process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/solutions/psa-suite-one-stop-solution"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Talk to SalesGPT</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300"
                >
                  Book a Demo
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
