'use client';

import { motion } from 'framer-motion';
import { Crown, Star, Globe, TrendingUp, Brain, Target, Award, Users, Linkedin, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function BoardOfAdvisorsPage() {
  const advisors = [
    {
      name: "Dr. Robert Steinberg",
      role: "Chairman of the Board",
      company: "Former CEO of SalesForce EMEA",
      experience: "25+ years",
      background: "Led SalesForce's expansion across Europe, Middle East, and Africa. Expert in enterprise sales transformation and global market penetration.",
      expertise: ["Enterprise Sales", "Global Expansion", "Market Strategy", "Board Governance"],
      achievements: ["Scaled SalesForce EMEA to $2B revenue", "Board member of 5 Fortune 500 companies", "Pioneered CRM adoption in emerging markets"],
      industries: ["SaaS", "Enterprise Software", "Global Markets"],
      quote: "Sales Centri represents the next evolution of sales technology — where AI doesn't replace human insight, but amplifies it exponentially.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Maria Gonzalez",
      role: "Strategic Advisor",
      company: "Former VP of AI at Google Cloud",
      experience: "20+ years",
      background: "Led AI product development at Google Cloud, focusing on enterprise AI solutions. Expert in machine learning, natural language processing, and AI ethics.",
      expertise: ["Artificial Intelligence", "Machine Learning", "Product Strategy", "AI Ethics"],
      achievements: ["Built Google's enterprise AI platform", "Led team of 200+ AI engineers", "50+ AI patents and publications"],
      industries: ["AI/ML", "Cloud Computing", "Enterprise Software"],
      quote: "The future belongs to companies that can harness AI responsibly and effectively. Sales Centri is leading that charge in sales automation.",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "James Mitchell",
      role: "Go-to-Market Advisor",
      company: "Former CMO of HubSpot",
      experience: "18+ years",
      background: "Built HubSpot's marketing engine from startup to IPO. Expert in growth marketing, demand generation, and product-led growth strategies.",
      expertise: ["Growth Marketing", "Demand Generation", "Product Marketing", "Customer Acquisition"],
      achievements: ["Led HubSpot to $1B+ revenue", "Built 390M+ contact database", "Pioneered inbound marketing methodology"],
      industries: ["Marketing Technology", "SaaS", "Growth Strategy"],
      quote: "Sales Centri's approach to AI-powered personalization at scale is exactly what modern sales teams need to compete and win.",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Dr. Priya Sharma",
      role: "Technology Advisor",
      company: "Former CTO of Microsoft Azure",
      experience: "22+ years",
      background: "Led cloud infrastructure development at Microsoft Azure. Expert in distributed systems, data architecture, and enterprise security.",
      expertise: ["Cloud Architecture", "Data Engineering", "Enterprise Security", "Platform Scaling"],
      achievements: ["Scaled Azure to $50B+ revenue", "Built enterprise-grade cloud platform", "Led digital transformation for 1000+ enterprises"],
      industries: ["Cloud Computing", "Enterprise Infrastructure", "Data Platforms"],
      quote: "Building scalable, secure AI platforms requires deep technical expertise. Sales Centri's architecture is world-class.",
      color: "from-red-500 to-orange-500"
    },
    {
      name: "Thomas Anderson",
      role: "Sales Strategy Advisor",
      company: "Former Chief Revenue Officer at Zoom",
      experience: "16+ years",
      background: "Led Zoom's global sales organization through hypergrowth. Expert in sales operations, revenue optimization, and team scaling.",
      expertise: ["Revenue Operations", "Sales Leadership", "Team Scaling", "Customer Success"],
      achievements: ["Grew Zoom revenue from $60M to $4B", "Built global sales team of 2000+", "Achieved 130%+ net revenue retention"],
      industries: ["SaaS", "Communications", "Revenue Operations"],
      quote: "Sales Centri understands what sales leaders need: tools that actually drive results, not just generate reports.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      name: "Lisa Chen",
      role: "Customer Experience Advisor",
      company: "Former VP of Customer Success at Zendesk",
      experience: "14+ years",
      background: "Built Zendesk's customer success organization from ground up. Expert in customer experience, retention strategies, and support operations.",
      expertise: ["Customer Success", "Support Operations", "Customer Experience", "Retention Strategy"],
      achievements: ["Achieved 98% customer satisfaction", "Built 24/7 global support", "Scaled customer success to 100,000+ customers"],
      industries: ["Customer Experience", "SaaS", "Support Technology"],
      quote: "The best products don't just solve problems — they delight customers. Sales Centri delivers on both fronts beautifully.",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const boardStats = [
    { metric: "200+", label: "Combined Years", description: "Industry experience" },
    { metric: "$50B+", label: "Revenue Generated", description: "At previous companies" },
    { metric: "15+", label: "Public Companies", description: "Board experience" },
    { metric: "100M+", label: "Users Served", description: "Across platforms built" },
    { metric: "500+", label: "Patents & Publications", description: "Technical innovations" },
    { metric: "50+", label: "Countries", description: "Global market expertise" }
  ];

  const advisoryAreas = [
    {
      title: "Strategic Direction",
      description: "Long-term vision and market positioning",
      icon: Target,
      color: "text-blue-400",
      focus: ["Market expansion", "Product roadmap", "Competitive strategy", "Partnership opportunities"]
    },
    {
      title: "Technology Innovation",
      description: "AI advancement and platform development",
      icon: Brain,
      color: "text-purple-400", 
      focus: ["AI research", "Platform architecture", "Security & compliance", "Technical partnerships"]
    },
    {
      title: "Go-to-Market Excellence",
      description: "Sales and marketing optimization",
      icon: TrendingUp,
      color: "text-green-400",
      focus: ["Sales strategy", "Marketing effectiveness", "Customer acquisition", "Revenue optimization"]
    },
    {
      title: "Customer Success",
      description: "User experience and satisfaction",
      icon: Star,
      color: "text-yellow-400",
      focus: ["Customer experience", "Product adoption", "Support excellence", "Customer retention"]
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
              Board of <span className="text-blue-400">Advisors</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              World-class industry leaders guiding Sales Centri&apos;s mission to revolutionize AI-powered sales automation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Board Impact */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Collective Impact</h2>
            <p className="text-xl text-gray-300">
              Our advisory board brings unparalleled expertise from leading technology and sales organizations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {boardStats.map((stat, index) => (
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

      {/* Advisory Board Members */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Advisors</h2>
            <p className="text-xl text-gray-300">
              Industry veterans who have built and scaled the world&apos;s leading technology companies
            </p>
          </motion.div>

          <div className="space-y-8">
            {advisors.map((advisor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
              >
                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Profile Section */}
                  <div className="lg:col-span-1 text-center lg:text-left">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${advisor.color} flex items-center justify-center mx-auto lg:mx-0 mb-4`}>
                      <Crown className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{advisor.name}</h3>
                    <div className="text-blue-400 font-semibold mb-2">{advisor.role}</div>
                    <div className="text-gray-400 text-sm mb-3">{advisor.company}</div>
                    <div className="text-gray-500 text-sm">{advisor.experience} experience</div>
                  </div>

                  {/* Details Section */}
                  <div className="lg:col-span-3">
                    <p className="text-gray-300 leading-relaxed mb-6">{advisor.background}</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3">Core Expertise:</h4>
                        <div className="flex flex-wrap gap-2">
                          {advisor.expertise.map((skill, i) => (
                            <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-white font-semibold mb-3">Industry Focus:</h4>
                        <div className="flex flex-wrap gap-2">
                          {advisor.industries.map((industry, i) => (
                            <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs">
                              {industry}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Key Achievements:</h4>
                      <div className="grid md:grid-cols-3 gap-3">
                        {advisor.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-400 text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                      <p className="text-gray-300 text-sm italic">&quot;{advisor.quote}&quot;</p>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-sm">LinkedIn Profile</span>
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Areas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Advisory Focus Areas</h2>
            <p className="text-xl text-gray-300">
              Our board provides strategic guidance across key areas of business growth and innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advisoryAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <area.icon className={`w-12 h-12 ${area.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">{area.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{area.description}</p>
                <div className="space-y-2">
                  {area.focus.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                      <span className="text-gray-400 text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Why World-Class Leaders Choose Sales Centri</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Our advisory board consists of proven leaders who have built the companies that define modern technology and sales
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center"
            >
              <Globe className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Proven Scale</h3>
              <p className="text-gray-300 leading-relaxed">
                Our advisors have collectively built and scaled companies serving hundreds of millions of users worldwide, 
                bringing unmatched experience in global growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center"
            >
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Technical Excellence</h3>
              <p className="text-gray-300 leading-relaxed">
                Deep expertise in AI, cloud architecture, and enterprise software ensures Sales Centri maintains 
                its technological leadership and innovation edge.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 text-center"
            >
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Market Leadership</h3>
              <p className="text-gray-300 leading-relaxed">
                Strategic guidance from leaders who have defined entire market categories, helping Sales Centri 
                maintain its position at the forefront of sales automation.
              </p>
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
              Experience the Platform Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              See why world-class advisors and thousands of sales teams choose Sales Centri for AI-powered automation.
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
