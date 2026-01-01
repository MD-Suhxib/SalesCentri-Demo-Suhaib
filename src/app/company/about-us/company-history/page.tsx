'use client';

import { motion } from 'framer-motion';
import { Calendar, Rocket, Users, Trophy, Globe, Zap, Brain, TrendingUp, Target, CheckCircle } from 'lucide-react';
export default function CompanyHistoryPage() {
  const timeline = [
    {
      year: "2019",
      title: "The Vision Begins",
      description: "Founded with a mission to democratize AI-powered sales automation for teams of all sizes",
      icon: Rocket,
      color: "text-blue-400",
      achievements: ["Initial concept development", "Founding team assembled", "Market research completed"]
    },
    {
      year: "2020",
      title: "Product Development",
      description: "Built the core AI engine and launched our first sales automation tools",
      icon: Brain,
      color: "text-purple-400",
      achievements: ["AI Hunter MVP launched", "First 1,000 contacts validated", "Voice AI technology prototyped"]
    },
    {
      year: "2021",
      title: "Platform Launch",
      description: "Released the full Sales Centri platform with integrated lead generation and outreach automation",
      icon: Zap,
      color: "text-green-400",
      achievements: ["Complete platform launch", "100+ early customers", "AI voice dialer beta release"]
    },
    {
      year: "2022",
      title: "Rapid Growth",
      description: "Scaled to thousands of users and expanded our AI capabilities across multiple channels",
      icon: TrendingUp,
      color: "text-yellow-400",
      achievements: ["10,000+ active users", "Multi-channel automation", "Enterprise features launched"]
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Expanded internationally and reached 390M+ verified B2B contacts in our database",
      icon: Globe,
      color: "text-cyan-400",
      achievements: ["390M+ contact database", "Global market presence", "Advanced AI personalization"]
    },
    {
      year: "2024",
      title: "Industry Leadership",
      description: "Established as a leading AI sales automation platform with enterprise-grade solutions",
      icon: Trophy,
      color: "text-orange-400",
      achievements: ["Industry recognition", "Enterprise partnerships", "99.5% AI accuracy achieved"]
    }
  ];

  const milestones = [
    { metric: "390M+", label: "Verified B2B Contacts", description: "In our global database" },
    { metric: "10,000+", label: "Active Users", description: "Across 50+ countries" },
    { metric: "99.5%", label: "AI Accuracy", description: "Voice AI technology" },
    { metric: "< 1 Hour", label: "Setup Time", description: "First campaign live" },
    { metric: "300%", label: "Average ROI", description: "Customer growth" },
    { metric: "24/7", label: "Support", description: "Global customer success" }
  ];

  const founders = [
    {
      name: "Alex Thompson",
      role: "CEO & Co-Founder",
      background: "Former VP of Sales at TechCorp, 15+ years in B2B sales automation",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Sarah Chen",
      role: "CTO & Co-Founder", 
      background: "Former AI Research Lead at DataSystems, PhD in Machine Learning",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Michael Rodriguez",
      role: "CPO & Co-Founder",
      background: "Former Product Director at SalesForce, expert in sales workflow optimization",
      image: "/api/placeholder/150/150"
    }
  ];

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
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
              Our <span className="text-blue-400">Journey</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From a vision to revolutionize sales automation to becoming the trusted AI platform for thousands of teams worldwide
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">The Sales Centri Story</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Sales Centri was born from a simple but powerful observation: <strong className="text-blue-400">sales teams were drowning in manual tasks</strong> 
                while missing opportunities to connect with their ideal customers.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Our founders, coming from backgrounds in enterprise sales, AI research, and product development, 
                saw the gap between what existing tools promised and what they actually delivered. 
                They envisioned a platform that would truly <strong className="text-purple-400">empower sales teams with AI</strong> 
                — not replace them, but augment their capabilities.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Today, Sales Centri serves thousands of sales professionals across the globe, 
                from startups to Fortune 500 companies, all united by the goal of 
                <strong className="text-green-400"> closing more deals with less manual work</strong>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Key Milestones</h3>
              <div className="grid grid-cols-2 gap-6">
                {milestones.map((milestone, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">{milestone.metric}</div>
                    <div className="text-sm font-semibold text-white mb-1">{milestone.label}</div>
                    <div className="text-xs text-gray-400">{milestone.description}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Timeline</h2>
            <p className="text-xl text-gray-300">
              Key moments that shaped Sales Centri into the platform it is today
            </p>
          </motion.div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col lg:flex-row gap-8 items-start"
              >
                <div className="flex-shrink-0 flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-gray-900 to-black border-2 border-gray-700 flex items-center justify-center`}>
                    <item.icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-400">{item.year}</div>
                </div>

                <div className="flex-1 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">{item.description}</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {item.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-400">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">The Founding Team</h2>
            <p className="text-xl text-gray-300">
              The visionaries who turned an idea into the leading AI sales automation platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{founder.name}</h3>
                <div className="text-blue-400 font-semibold mb-3">{founder.role}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{founder.background}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Culture & Values</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Since day one, we&apos;ve built Sales Centri around core principles that drive innovation and foster growth
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                <Target className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Customer-First Innovation</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every feature we build, every decision we make starts with one question: 
                  &quot;How does this help our customers close more deals?&quot;
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                <Brain className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">AI-Powered, Human-Centered</h3>
                <p className="text-gray-400 leading-relaxed">
                  We believe AI should augment human capabilities, not replace them. 
                  Our technology amplifies what sales teams do best.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                <Zap className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Speed & Simplicity</h3>
                <p className="text-gray-400 leading-relaxed">
                  Complex problems require elegant solutions. We build tools that are powerful yet 
                  intuitive, delivering results in hours, not weeks.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                <TrendingUp className="w-10 h-10 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Continuous Growth</h3>
                <p className="text-gray-400 leading-relaxed">
                  The sales landscape evolves rapidly. We stay ahead by constantly learning, 
                  adapting, and pushing the boundaries of what&apos;s possible.
                </p>
              </div>
            </motion.div>
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
            <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Be Part of Our Story?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of sales teams who&apos;ve transformed their results with Sales Centri&apos;s AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Your Free Trial Today
              </motion.button>
              <motion.button
                className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Schedule a Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  </>
  );
}
