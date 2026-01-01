'use client';

import { motion } from 'framer-motion';
import { Users, Award, Globe, Linkedin, Mail, Trophy, Star, TrendingUp, Target, Brain } from 'lucide-react';
import Link from 'next/link';

export default function LeadershipTeamPage() {
  const leadership = [
    {
      name: "Alex Thompson",
      role: "Chief Executive Officer",
      department: "Executive Leadership",
      experience: "15+ years",
      background: "Former VP of Sales at TechCorp, Led $100M+ revenue teams",
      expertise: ["Sales Strategy", "Team Building", "Revenue Growth", "Market Expansion"],
      achievements: ["Scaled Sales Centri to 10,000+ users", "Expanded to 15+ countries globally", "Built global sales organization"],
      quote: "AI doesn't replace great salespeople — it makes them unstoppable.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Sarah Chen",
      role: "Chief Technology Officer",
      department: "Engineering & AI",
      experience: "12+ years",
      background: "Former AI Research Lead at DataSystems, PhD in Machine Learning from MIT",
      expertise: ["AI/ML Development", "Platform Architecture", "Data Science", "Technical Strategy"],
      achievements: ["Built 99.5% accurate AI voice system", "Led platform scaling to 390M+ contacts", "20+ AI patents filed"],
      quote: "The future of sales is intelligence augmentation, not replacement.",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Product Officer",
      department: "Product & Design",
      experience: "10+ years",
      background: "Former Product Director at Salesforce, Expert in sales workflow optimization",
      expertise: ["Product Strategy", "UX Design", "Sales Operations", "Customer Experience"],
      achievements: ["Designed award-winning UI/UX", "Led product to 4.8/5 customer rating", "Reduced setup time to <1 hour"],
      quote: "Great products solve real problems beautifully and simply.",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Emily Watson",
      role: "Chief Financial Officer",
      department: "Finance & Operations",
      experience: "18+ years",
      background: "Former CFO at GrowthTech, CPA with expertise in SaaS financial modeling",
      expertise: ["Financial Strategy", "Operations", "Investor Relations", "Risk Management"],
      achievements: ["Led company to profitability", "Reduced operational costs by 40%", "Built scalable financial systems"],
      quote: "Sustainable growth comes from balancing innovation with financial discipline.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "David Park",
      role: "Chief Marketing Officer",
      department: "Marketing & Growth",
      experience: "14+ years",
      background: "Former Head of Growth at MarketingAI, Expert in B2B SaaS marketing",
      expertise: ["Growth Marketing", "Brand Strategy", "Content Marketing", "Demand Generation"],
      achievements: ["Grew user base 300% in 2 years", "Built thought leadership brand", "Generated 500% ROI on marketing"],
      quote: "The best marketing feels like education, not selling.",
      color: "from-red-500 to-rose-500"
    },
    {
      name: "Jennifer Liu",
      role: "Chief Customer Officer",
      department: "Customer Success",
      experience: "11+ years",
      background: "Former VP Customer Success at ClientFirst, Expert in customer retention and growth",
      expertise: ["Customer Success", "Support Operations", "Account Management", "Customer Experience"],
      achievements: ["Achieved 95% customer retention", "Built 24/7 global support", "NPS score of 72+"],
      quote: "Customer success isn't a department — it's our entire company's mission.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const departments = [
    {
      name: "Executive Leadership",
      description: "Strategic vision and company direction",
      icon: Target,
      color: "text-blue-400"
    },
    {
      name: "Engineering & AI",
      description: "Product development and AI innovation",
      icon: Brain,
      color: "text-purple-400"
    },
    {
      name: "Product & Design",
      description: "User experience and product strategy",
      icon: Star,
      color: "text-green-400"
    },
    {
      name: "Marketing & Growth",
      description: "Brand building and customer acquisition",
      icon: TrendingUp,
      color: "text-yellow-400"
    },
    {
      name: "Customer Success",
      description: "Customer satisfaction and retention",
      icon: Trophy,
      color: "text-red-400"
    },
    {
      name: "Finance & Operations",
      description: "Financial strategy and operational excellence",
      icon: Award,
      color: "text-cyan-400"
    }
  ];

  const companyStats = [
    { metric: "390M+", label: "Verified Contacts", description: "In our database" },
    { metric: "10,000+", label: "Active Users", description: "Globally" },
    { metric: "95%", label: "Customer Retention", description: "Industry leading" },
    { metric: "99.5%", label: "AI Accuracy", description: "Voice technology" },
    { metric: "24/7", label: "Global Support", description: "Customer success" },
    { metric: "4.8/5", label: "Customer Rating", description: "Platform satisfaction" }
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
              Leadership <span className="text-blue-400">Team</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the visionary leaders driving Sales Centri&apos;s mission to revolutionize sales automation with AI
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Performance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Under Their Leadership</h2>
            <p className="text-xl text-gray-300">
              Our leadership team has guided Sales Centri to become the industry leader in AI-powered sales automation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {companyStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.metric}</div>
                <div className="text-lg font-semibold text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Executive Team</h2>
            <p className="text-xl text-gray-300">
              Seasoned leaders with proven track records in building and scaling world-class technology companies
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {leadership.map((leader, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${leader.color} flex items-center justify-center flex-shrink-0`}>
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{leader.name}</h3>
                    <div className="text-blue-400 font-semibold mb-2">{leader.role}</div>
                    <div className="text-gray-400 text-sm mb-4">{leader.experience} experience • {leader.department}</div>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{leader.background}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-white font-semibold mb-2">Core Expertise:</h4>
                    <div className="flex flex-wrap gap-2">
                      {leader.expertise.map((skill, i) => (
                        <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-semibold mb-2">Key Achievements:</h4>
                    <ul className="space-y-1">
                      {leader.achievements.map((achievement, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                          <Trophy className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4 mt-4">
                    <p className="text-gray-300 text-sm italic">&quot;{leader.quote}&quot;</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">LinkedIn</span>
                    </motion.button>
                    <motion.button
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-300 cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">Contact</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Organization</h2>
            <p className="text-xl text-gray-300">
              Each department plays a crucial role in delivering exceptional value to our customers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-all duration-300"
              >
                <dept.icon className={`w-12 h-12 ${dept.color} mx-auto mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">{dept.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{dept.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Principles */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Leadership Principles</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              The core values that guide our leadership team in building Sales Centri and serving our customers
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
                <h3 className="text-xl font-bold text-white mb-3">Customer Obsession</h3>
                <p className="text-gray-400 leading-relaxed">
                  Every decision starts with our customers. We listen, learn, and build solutions that drive real business outcomes.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                <Brain className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Innovation Leadership</h3>
                <p className="text-gray-400 leading-relaxed">
                  We don&apos;t follow trends — we set them. Our team pushes the boundaries of what&apos;s possible with AI and automation.
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
                <TrendingUp className="w-10 h-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Operational Excellence</h3>
                <p className="text-gray-400 leading-relaxed">
                  We build systems and processes that scale. Quality, reliability, and performance are non-negotiable.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
                <Globe className="w-10 h-10 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Global Impact</h3>
                <p className="text-gray-400 leading-relaxed">
                  We&apos;re building technology that transforms how sales teams work across industries and continents.
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
            <Users className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Experience Leadership in AI Sales Automation?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              See how our leadership team&apos;s vision translates into results for your sales organization.
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
              <Link href="/solutions/psa-suite-one-stop-solution">
                <motion.button
                  className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Request Board-Level Demo
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
