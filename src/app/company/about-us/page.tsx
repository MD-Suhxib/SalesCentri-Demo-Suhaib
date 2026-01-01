'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Target, Eye, Heart, Globe, Zap, Brain, Rocket, TrendingUp, Award, Lightbulb, Sparkles, CheckCircle2, ArrowRight, Users, Building2, Store, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Milestones data moved outside component
const milestones = [
  {
    year: 2021,
    title: 'Established',
    date: 'DECEMBER 24, 2021',
    description: 'Sales Centri is officially established and begins its foundational operations.',
    icon: Rocket,
    color: 'from-blue-600 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
  },
  {
    year: 2024,
    title: 'DESIDECK LLC Incorporation Date USA',
    date: 'MAY 21, 2024',
    description: 'DESIDECK LLC is officially incorporated as a registered business entity.',
    icon: Globe,
    color: 'from-cyan-600 to-blue-600',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
  },
  {
    year: 2025,
    quarter: 'Q2',
    title: 'Acquisition of DESIDECK LLC',
    date: 'JUNE 09, 2025',
    description: 'Sales Centri acquires DESIDECK LLC and rebrands it as Sales Centri AI LLC, enabling expansion into global AI and Agentic AI technologies.',
    icon: TrendingUp,
    color: 'from-blue-600 to-indigo-600',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop',
  },
  {
    year: 2025,
    quarter: 'Q3',
    title: 'MSME/UDYAM Registration',
    date: 'SEPTEMBER 24, 2025',
    description: 'Sales Centri secures MSME/UDYAM certification, recognizing it as a registered micro-enterprise in India.',
    icon: Award,
    color: 'from-indigo-600 to-blue-600',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
  },
  {
    year: 2025,
    quarter: 'Q4',
    month: 'October',
    title: 'Recognized as a DPIIT Startup',
    date: 'OCTOBER 28, 2025',
    description: 'The Department for Promotion of Industry and Internal Trade officially recognizes Sales Centri as a startup in the AI and Machine Learning sectors.',
    icon: Brain,
    color: 'from-blue-600 to-cyan-600',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
  },
  {
    year: 2025,
    quarter: 'Q4',
    month: 'November',
    title: 'Bengaluru Tech Summit Recognition',
    date: 'NOVEMBER 19, 2025',
    description: 'At Bengaluru Tech Summit 2025 – Product Launch 4.0, Sales Centri is honored among the Top 50 groundbreaking products for next-gen innovation in AI, Agentic AI, and Sales Technology.',
    icon: Sparkles,
    color: 'from-cyan-600 to-blue-600',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
  }
];

// Get unique years from milestones for navigation
const years = Array.from(new Set(milestones.map(m => m.year))).sort();

export default function AboutUsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2021);
  const [milestoneIndex, setMilestoneIndex] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Get all milestones for the selected year
  const currentYearMilestones = milestones.filter(m => m.year === selectedYear);

  // Current milestone to display
  const currentMilestone = currentYearMilestones[milestoneIndex] || currentYearMilestones[0];

  // Navigate to previous milestone
  const previousMilestone = () => {
    if (milestoneIndex > 0) {
      setMilestoneIndex(milestoneIndex - 1);
    } else {
      // Move to previous year
      const currentYearIndex = years.indexOf(selectedYear);
      if (currentYearIndex > 0) {
        const prevYear = years[currentYearIndex - 1];
        const prevYearMilestones = milestones.filter(m => m.year === prevYear);
        setSelectedYear(prevYear);
        setMilestoneIndex(prevYearMilestones.length - 1); // Go to last milestone of previous year
      }
    }
  };

  // Navigate to next milestone
  const nextMilestone = () => {
    if (milestoneIndex < currentYearMilestones.length - 1) {
      setMilestoneIndex(milestoneIndex + 1);
    } else {
      // Move to next year
      const currentYearIndex = years.indexOf(selectedYear);
      if (currentYearIndex < years.length - 1) {
        setSelectedYear(years[currentYearIndex + 1]);
        setMilestoneIndex(0);
      }
    }
  };

  // Check if we can navigate
  const canGoPrevious = milestoneIndex > 0 || years.indexOf(selectedYear) > 0;
  const canGoNext = milestoneIndex < currentYearMilestones.length - 1 || years.indexOf(selectedYear) < years.length - 1;

  return (
    <div ref={containerRef} className="relative">
      <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[120px] [animation-delay:2s] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] [animation-delay:4s] animate-pulse" />
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold mb-8"
            >
              Reimagining Sales{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Automation
                </span>
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 blur-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12"
            >
              For A New Era
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-center"
            >
              <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-white">
                Empowering Sales Teams{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Worldwide
                </span>
              </h2>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Intelligence</h3>
                    <p className="text-gray-400 text-sm">Advanced AI algorithms that understand context and intent</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                    <p className="text-gray-400 text-sm">Get campaigns live in hours, not weeks</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="group"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Global Scale</h3>
                    <p className="text-gray-400 text-sm">Enterprise-grade solutions for teams worldwide</p>
                  </div>
                </motion.div>
              </div>

              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                With Sales Centri, you're not just automating sales;{' '}
                <span className="text-blue-400 font-semibold">you're equipped to transform it.</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-block mb-8"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 rounded-full">
                  <span className="text-blue-400 font-semibold text-sm">Our Mission</span>
                </div>
              </motion.div>

              <h2 className="text-4xl lg:text-6xl font-bold mb-8">
                Build A Sales{' '}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Intelligence Layer
                </span>
              </h2>

              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                We're utilizing cutting-edge AI to reveal what others can't: hidden opportunities,
                buyer intent signals, and market insights that drive revenue growth.
              </p>

              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                With this level of intelligence, we help sales teams act faster, sell smarter,
                and close more deals. From lead generation and personalization to workflow
                automation and analytics, we're building the AI layer the modern sales stack urgently needs.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">AI-powered lead discovery and validation</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">Personalized outreach at scale</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-gray-300">Data-driven sales optimization</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                      <div className="text-sm text-gray-400">Verified Businesses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">40+</div>
                      <div className="text-sm text-gray-400">Industries Served</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                      <div className="text-sm text-gray-400">Countries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-2">1,000+</div>
                      <div className="text-sm text-gray-400">Successful Connections</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-block mb-8"
              >
                <div className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 rounded-full">
                  <span className="text-cyan-400 font-semibold text-sm">Our Vision</span>
                </div>
              </motion.div>

              <h2 className="text-4xl lg:text-6xl font-bold mb-8">
                Democratize{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Enterprise AI
                </span>
              </h2>

              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Sales Centri's vision is to make enterprise-grade AI sales automation accessible
                to every business, regardless of size or technical expertise.
              </p>

              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Our comprehensive AI sales suite will transform how businesses sell, from startups
                to enterprises. We envision a future where AI doesn't just automate tasks—it
                amplifies human potential, drives meaningful connections, and creates unprecedented
                growth opportunities.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">AI-powered personalization at scale</h4>
                    <p className="text-gray-400 text-sm">Transform every interaction with intelligent automation</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Instant ROI and measurable results</h4>
                    <p className="text-gray-400 text-sm">Data-driven insights that drive revenue growth</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Global accessibility and reach</h4>
                    <p className="text-gray-400 text-sm">Enterprise-grade solutions for teams worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <Globe className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Global AI Sales Platform</h3>
                    <p className="text-gray-400">Connecting businesses worldwide with intelligent automation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Milestones Section */}
      <section className="relative py-24 z-10 bg-gradient-to-b from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-6">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-bold">
              Key{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Milestones
              </span>
            </h2>
          </motion.div>

          {/* Year Timeline Navigation - Pixxel Style */}
          <div className="relative mb-8">
            <div className="flex justify-between items-start border-b border-gray-700">
              {years.map((year) => {
                const isSelected = selectedYear === year;
                
                return (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setMilestoneIndex(0);
                    }}
                    className={`relative px-8 py-4 text-lg font-semibold transition-all duration-300 flex flex-col items-center ${
                      isSelected 
                        ? 'text-cyan-400' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span>{year}</span>
                    
                    {/* Active indicator line */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeYear"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Milestone Content - Full Width Layout */}
          <div className="bg-gray-900/50 rounded-3xl overflow-hidden">
            <AnimatePresence mode="wait">
              {currentMilestone && (
                <motion.div
                  key={`${currentMilestone.year}-${milestoneIndex}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  {/* Full Width Month Display */}
                  <div className="border-b border-gray-800 bg-gray-900/70 px-6 py-3">
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((month, idx) => {
                        const yearMilestones = milestones.filter(m => m.year === selectedYear);
                        const milestonMonths = yearMilestones.map(m => m.date.split(' ')[0].substring(0, 3).toUpperCase());
                        const hasMinestone = milestonMonths.includes(month);
                        const milestoneIdx = yearMilestones.findIndex(m => 
                          m.date.split(' ')[0].substring(0, 3).toUpperCase() === month
                        );
                        const isCurrentMonth = milestoneIdx === milestoneIndex;
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              if (hasMinestone) {
                                setMilestoneIndex(milestoneIdx);
                              }
                            }}
                            disabled={!hasMinestone}
                            className={`px-2.5 py-1 text-xs font-medium rounded transition-all duration-200 ${
                              isCurrentMonth
                                ? 'bg-cyan-400 text-black font-bold shadow-md shadow-cyan-400/50'
                                : hasMinestone
                                ? 'bg-cyan-400/20 text-cyan-300 hover:bg-cyan-400/30 cursor-pointer'
                                : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                            }`}
                          >
                            {month}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid lg:grid-cols-2 min-h-[500px]">
                    {/* Left Content */}
                    <div className="p-12 flex flex-col justify-center">
                    <div className="text-gray-400 font-medium tracking-wider text-sm mb-4">
                      {currentMilestone.date}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                      {currentMilestone.title}
                    </h3>
                    
                    <p className="text-gray-400 leading-relaxed text-lg mb-8">
                      {currentMilestone.description}
                    </p>
                    
                    {/* Navigation Arrows */}
                    <div className="flex gap-4">
                      <button
                        onClick={previousMilestone}
                        disabled={!canGoPrevious}
                        aria-label="Previous milestone"
                        title="Previous milestone"
                        className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors duration-300 ${
                          canGoPrevious 
                            ? 'border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 cursor-pointer' 
                            : 'border-gray-800 text-gray-700 cursor-not-allowed'
                        }`}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextMilestone}
                        disabled={!canGoNext}
                        aria-label="Next milestone"
                        title="Next milestone"
                        className={`w-12 h-12 border rounded-lg flex items-center justify-center transition-colors duration-300 ${
                          canGoNext 
                            ? 'border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 cursor-pointer' 
                            : 'border-gray-800 text-gray-700 cursor-not-allowed'
                        }`}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Right Image Section */}
                  <div className="relative overflow-hidden min-h-[400px]">
                    {/* Stock Photo using Next.js Image */}
                    <Image
                      src={currentMilestone.image}
                      alt={currentMilestone.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                    {/* Gradient overlay for aesthetic look */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {/* Decorative elements */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />
                  </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Investors Section - Commented Out */}
      {/* 
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 rounded-full">
                <span className="text-blue-400 font-semibold text-sm">Investors</span>
              </div>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Backed by{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're proud to be supported by visionary investors who share our mission to democratize AI sales automation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6].map((investor, index) => (
              <motion.div
                key={investor}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 group-hover:border-blue-500/50 transition-all duration-300 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                      <Building2 className="w-8 h-8 text-blue-400" />
                    </div>
                    <div className="text-sm font-semibold text-gray-300">Investor {investor}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Recognition Section */}
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 rounded-full">
                <span className="text-cyan-400 font-semibold text-sm">Recognition</span>
              </div>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Industry{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Recognition
              </span>
            </h2>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our innovation in AI sales automation has earned recognition from leading industry organizations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group-hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">DPIIT Startup Recognition</h3>
                    <p className="text-sm text-gray-400">Government certified startup</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Recognized by the Department for Promotion of Industry and Internal Trade for innovation in AI and Machine Learning sectors.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group-hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Bengaluru Tech Summit 2025</h3>
                    <p className="text-sm text-gray-400">Top 50 Innovative Products</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Honored among the Top 50 groundbreaking products at Product Launch 4.0 for next-gen innovation in AI and Sales Technology.</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group-hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">MSME/UDYAM Certified</h3>
                    <p className="text-sm text-gray-400">Government Recognition</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">Officially recognized as a registered micro-enterprise in India, validating our business model and growth potential.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Careers CTA Section - Commented Out */}
      {/*
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-8"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-xl border border-blue-500/30 rounded-full">
                <span className="text-blue-400 font-semibold text-sm">Join Us</span>
              </div>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Shape the Future of{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Sales AI
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Join us to build what's next in AI sales automation and help solve some of sales teams' biggest challenges!
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Link href="/careers">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                  Explore Careers
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      */}

      {/* Knowledge Hub Preview - Commented Out */}
      {/*
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <div className="px-4 py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 backdrop-blur-xl border border-cyan-500/30 rounded-full">
                <span className="text-cyan-400 font-semibold text-sm">Knowledge Hub</span>
              </div>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Insights &{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Innovation
              </span>
            </h2>

            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Discover how Sales Centri's AI solutions drive real-world sales transformation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group-hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-400 font-medium">November 25, 2025</div>
                    <div className="text-xs text-gray-400">Blog</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">AI Sales Automation Trends 2026</h3>
                <p className="text-gray-400 text-sm mb-4">Explore the latest trends shaping the future of AI-powered sales automation and what they mean for your business.</p>
                <Link href="/blog/ai-sales-trends-2026" className="text-blue-400 hover:text-cyan-400 text-sm font-medium transition-colors">
                  Read more →
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group-hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-cyan-400 font-medium">November 20, 2025</div>
                    <div className="text-xs text-gray-400">Case Study</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">How TechCorp Increased Pipeline by 300%</h3>
                <p className="text-gray-400 text-sm mb-4">Learn how a leading technology company transformed their sales process with Sales Centri's AI automation suite.</p>
                <Link href="/case-studies/techcorp-pipeline-growth" className="text-cyan-400 hover:text-blue-400 text-sm font-medium transition-colors">
                  Read more →
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 group-hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-blue-400 font-medium">November 15, 2025</div>
                    <div className="text-xs text-purple-400 font-medium">Whitepaper</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">The ROI of AI Sales Automation</h3>
                <p className="text-gray-400 text-sm mb-4">A comprehensive analysis of the financial impact of implementing AI-powered sales automation solutions.</p>
                <Link href="/whitepapers/ai-sales-automation-roi" className="text-blue-400 hover:text-cyan-400 text-sm font-medium transition-colors">
                  Download →
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/blog">
              <div className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300">
                View All Insights
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
      */}

      {/* Final CTA Section */}
      <section className="relative py-32 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              See what others miss.{' '}
              <span className="text-blue-400">Act when it matters.</span>
            </h2>

            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
              Join thousands of sales teams worldwide who are transforming their results with Sales Centri's AI automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <Link href="/get-started">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl">
                    Get Started Free
                  </div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <Link href="/contact">
                  <div className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 border border-white/20">
                    Contact Sales
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      </main>
    </div>
  );
}
