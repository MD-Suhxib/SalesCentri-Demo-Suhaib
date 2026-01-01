'use client';

import { motion } from 'framer-motion';
import { Brain, Users, Target, Rocket, Globe, Award, TrendingUp, Zap, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

export default function CompanyPage() {
  const companyStats = [
    { label: "Team Members", value: "120+", description: "Across 15 countries" },
    { label: "AI Patents", value: "25+", description: "Filed and pending" },
    { label: "Customer Growth", value: "400%", description: "Year over year" },
    { label: "B2B Contacts", value: "390M+", description: "Verified database" }
  ];

  const companyValues = [
    {
      icon: Brain,
      title: "AI-First Innovation",
      description: "We're building the future of sales with cutting-edge artificial intelligence and machine learning."
    },
    {
      icon: Users,
      title: "Human-Centric Design",
      description: "Our AI augments human capabilities, making sales teams more effective and relationships stronger."
    },
    {
      icon: Zap,
      title: "Speed & Efficiency", 
      description: "From first outreach to closed deals in hours, not weeks. We believe in rapid, measurable results."
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Empowering sales teams worldwide with intelligent automation that scales across all markets."
    }
  ];

  const quickLinks = [
    {
      title: "About Us",
      description: "Learn about our mission, vision, and the values that drive our innovation",
      href: "/company/about-us",
      icon: Target,
    },
    {
      title: "Team & Advisors",
      description: "Meet our world-class team and board of industry-leading advisors",
      href: "/company/team-advisors", 
      icon: Users,
    },
    {
      title: "Careers",
      description: "Join our mission to build the future of AI-powered sales automation",
      href: "/company/careers",
      icon: Rocket,
    },
    {
      title: "Press & News",
      description: "Latest announcements, press releases, and media coverage",
      href: "/company/press-news",
      icon: TrendingUp,
    },
    {
      title: "Community Engagement",
      description: "Join our community initiatives, programs, and inclusive talent opportunities",
      href: "/company/community-engagement",
      icon: Heart,
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "Started with a vision to revolutionize sales automation with AI"
    },
    {
      year: "2022", 
      title: "Platform Launch",
      description: "Launched comprehensive AI sales automation platform, growing to 1,000+ customers"
    },
    {
      year: "2023",
      title: "Voice AI Launch",
      description: "Launched revolutionary voice AI with 99.5% accuracy rate"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Scaling globally with 390M+ verified contacts and enterprise customers"
    }
  ];

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden hero-section">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Building the <span className="text-blue-400">Future</span> of{' '}
              <span className="text-purple-400">AI Sales</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
              Sales Centri isn&apos;t just another SaaS product. We&apos;re a <strong className="text-blue-400">movement toward smarter selling</strong> — 
              empowering modern sales teams with AI-powered automation, personalized communication, and scalable workflows.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20">
                390M+ B2B Contacts
              </div>
              <div className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full border border-purple-500/20">
                99.5% AI Accuracy
              </div>
              <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20">
                400% Customer Growth
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {companyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                To <strong className="text-blue-400">empower modern sales teams</strong> with{' '}
                <strong className="text-purple-400">AI-powered automation</strong>,{' '}
                <strong className="text-green-400">personalized communication</strong>, and{' '}
                <strong className="text-yellow-400">scalable workflows</strong> that close more deals, 
                foster stronger relationships, and drive revenue — without increasing operational complexity.
              </p>
              <p className="text-gray-400 leading-relaxed mb-8">
                We&apos;re not just building a product. We&apos;re building <strong className="text-white">the future of selling</strong>.
              </p>
              
              <Link href="/company/about-us">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More About Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8"
            >
              <Brain className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">What Makes Us Unique?</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  <span>Complete AI sales automation suite with 390M+ verified contacts</span>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>Human-centric automation that augments, not replaces</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  <span>First outreach in hours, not weeks with our LaunchKit</span>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span>99.5% accuracy voice AI with industry-leading NLP</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-300">
              The principles that drive our innovation and guide our decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <value.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Journey</h2>
            <p className="text-xl text-gray-300">
              Key milestones in building the future of AI-powered sales automation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{milestone.year}</div>
                <h3 className="text-lg font-bold text-white mb-3">{milestone.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Explore Sales Centri</h2>
            <p className="text-xl text-gray-300">
              Learn more about our company, team, and opportunities
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative h-full bg-gradient-to-br from-blue-600/15 via-blue-500/10 to-blue-700/15 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer group overflow-hidden"
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  {/* Glassmorphic shine effect with blue tint */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-300/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  
                  {/* Enhanced blue glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-400/0 to-blue-600/0 group-hover:from-blue-500/15 group-hover:via-blue-400/10 group-hover:to-blue-600/15 transition-all duration-300 rounded-2xl blur-xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/30 group-hover:bg-blue-500/30 group-hover:border-blue-400/40 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                        <link.icon className="w-6 h-6 text-blue-300 group-hover:text-blue-200" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400/70 group-hover:text-blue-300 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                      {link.title}
                    </h3>
                    <p className="text-blue-100/80 leading-relaxed text-sm group-hover:text-blue-50 transition-colors duration-300">
                      {link.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Award className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Join the AI Revolution?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Whether you&apos;re looking to transform your sales process or join our mission, 
              we&apos;re here to help you succeed with intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Free Trial - Meet Our AI
                </motion.button>
              </Link>
              
              <Link href="/company/careers">
                <motion.button
                  className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Our Team
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  );
}
