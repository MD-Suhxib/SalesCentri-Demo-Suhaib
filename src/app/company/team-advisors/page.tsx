'use client';

import { motion } from 'framer-motion';
import { Users, Award, TrendingUp, Brain, Briefcase } from 'lucide-react';
export default function TeamAdvisorsPage() {
  const executiveTeam = [
    {
      name: "Ishtiaq Tonse",
      position: "CEO & Co-Founder",
      bio: "Serial entrepreneur with 20+ years in AI and sales automation. Previously led at Ton Technology Services and founded two successful SaaS startups.",
      image: "AC",
      expertise: ["AI Strategy", "Product Vision", "Go-to-Market"],
      linkedin: "#"
    },
    {
      name: "Sarah Rodriguez",
      position: "CTO & Co-Founder", 
      bio: "Former Principal Engineer at Google AI. PhD in Machine Learning from Stanford. Expert in scalable AI systems and natural language processing.",
      image: "SR",
      expertise: ["AI/ML Engineering", "System Architecture", "Technical Leadership"],
      linkedin: "#"
    },
    {
      name: "Michael Thompson",
      position: "VP of Sales",
      bio: "20+ years in enterprise sales leadership. Former VP at HubSpot and Outreach. Built and scaled multiple $100M+ sales organizations.",
      image: "MT",
      expertise: ["Enterprise Sales", "Revenue Operations", "Team Building"],
      linkedin: "#"
    },
    {
      name: "Dr. Emily Wang",
      position: "VP of Product",
      bio: "Product leader with deep AI expertise. Former Product Director at Microsoft. Led the development of AI-powered features used by millions.",
      image: "EW",
      expertise: ["Product Strategy", "AI/UX", "Customer Research"],
      linkedin: "#"
    }
  ];

  const teamStats = [
    { label: "Team Members", value: "120+", description: "Across 15 countries" },
    { label: "Engineering", value: "60%", description: "Of total team" },
    { label: "AI Experts", value: "25+", description: "PhD & Masters" },
    { label: "Average Experience", value: "8+ Years", description: "In relevant fields" }
  ];

  const departments = [
    {
      icon: Brain,
      name: "AI & Engineering",
      count: "72",
      description: "Building the future of sales automation"
    },
    {
      icon: TrendingUp,
      name: "Sales & Marketing",
      count: "25",
      description: "Driving growth and customer success"
    },
    {
      icon: Users,
      name: "Customer Success",
      count: "15",
      description: "Ensuring customer satisfaction and retention"
    },
    {
      icon: Briefcase,
      name: "Operations",
      count: "8",
      description: "Supporting company infrastructure and growth"
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
              Our <span className="text-blue-400">Team</span> &{' '}
              <span className="text-purple-400">Advisors</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Meet the world-class team and advisors building the future of AI-powered sales automation
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20">
                120+ Team Members
              </div>
              <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20">
                25+ AI Experts
              </div>
              <div className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full border border-purple-500/20">
                15 Countries
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Explore Our Advisory Structure</h2>
            <p className="text-lg text-gray-300">
              Learn more about the experts guiding our strategic direction and technical innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300"
            >
              <Award className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Board of Advisors</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Industry veterans from leading technology companies providing strategic guidance and market expertise.
              </p>
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/company/team-advisors/board-of-advisors'}
              >
                Meet Our Board Advisors
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300"
            >
              <Brain className="w-12 h-12 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Technical Advisors</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                AI and technology experts ensuring our platform maintains cutting-edge innovation and enterprise-grade reliability.
              </p>
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/company/team-advisors/technical-advisors'}
              >
                Meet Our Technical Advisors
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {teamStats.map((stat, index) => (
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

      {/* Executive Team */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Executive Leadership</h2>
            <p className="text-xl text-gray-300">
              Experienced leaders driving innovation in AI-powered sales automation
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {executiveTeam.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {member.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-400 font-semibold mb-3">{member.position}</p>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">{member.bio}</p>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.expertise.map((skill, idx) => (
                      <span key={idx} className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Departments */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Our Departments</h2>
            <p className="text-xl text-gray-300">
              Cross-functional teams working together to revolutionize sales automation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-all duration-300"
              >
                <dept.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{dept.name}</h3>
                <div className="text-3xl font-bold text-blue-400 mb-2">{dept.count}</div>
                <p className="text-gray-400 text-sm leading-relaxed">{dept.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
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
              Join Our World-Class Team
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              We&apos;re always looking for exceptional talent to help us build the future of AI-powered sales automation. 
              Join us in our mission to transform how businesses connect with their customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = 'careers/open-positions'}
              >
                View Open Positions
              </motion.button>
              <motion.button
                className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = 'careers/company-culture'}
              >
                Learn About Our Culture
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  );
}
