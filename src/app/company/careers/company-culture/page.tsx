'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Globe, Zap, Target, Brain, Star, Book } from 'lucide-react';
export default function CompanyCulturePage() {
  const coreValues = [
    {
      title: "Customer Obsession",
      description: "Every decision starts with our customers. We build products that solve real problems and drive genuine business results.",
      icon: Target,
      color: "text-blue-400",
      examples: ["Monthly customer feedback sessions", "Direct customer access for all teams", "Success metrics tied to customer outcomes"]
    },
    {
      title: "Innovation Through AI",
      description: "We're not just using AI — we're pushing its boundaries to create solutions that seemed impossible yesterday.",
      icon: Brain,
      color: "text-purple-400",
      examples: ["20% time for AI research projects", "Internal AI hackathons", "Collaboration with leading AI researchers"]
    },
    {
      title: "Transparent Communication",
      description: "Open, honest communication builds trust. We share context, give feedback constructively, and celebrate wins together.",
      icon: Users,
      color: "text-green-400",
      examples: ["All-hands transparency meetings", "Open communication channels", "Anonymous feedback culture"]
    },
    {
      title: "Rapid Execution",
      description: "Speed matters in AI. We move fast, learn quickly, and iterate constantly to stay ahead of the curve.",
      icon: Zap,
      color: "text-yellow-400",
      examples: ["Weekly sprint demos", "Rapid prototyping culture", "Fail fast, learn faster mindset"]
    },
    {
      title: "Global Impact",
      description: "We're building technology that transforms how people work across industries and continents.",
      icon: Globe,
      color: "text-cyan-400",
      examples: ["Bangalore office team", "Diverse market perspectives", "Local and national customer focus"]
    },
    {
      title: "Continuous Growth",
      description: "Everyone grows here. We invest in learning, skill development, and career advancement for every team member.",
      icon: Star,
      color: "text-pink-400",
      examples: ["Learning and development opportunities", "Internal mentorship programs", "Conference speaking opportunities"]
    }
  ];


  const perks = [
    {
      category: "Work-Life Balance",
      items: [
        "Unlimited PTO (minimum 3 weeks encouraged)",
        "Flexible working hours",
        "Mental health days and wellness programs",
        "Family leave and support programs"
      ]
    },
    {
      category: "Professional Growth",
      items: [
        "Learning and development opportunities",
        "Conference attendance and speaking opportunities",
        "Internal mentorship and coaching programs",
        "Career advancement pathways"
      ]
    },
    {
      category: "Technology & Tools",
      items: [
        "High-quality monitors and peripherals",
        "Premium software licenses and subscriptions",
      ]
    },
    {
      category: "Financial Benefits",
      items: [
        "Growth opportunities and career advancement",
        "Recognition and achievement rewards",
        "Professional development support",
      ]
    },
    {
      category: "Fun & Social",
      items: [
        "Annual company retreats and team building",
        "Office social events and celebrations",
        "Local team meetups and activities"
      ]
    }
  ];

  const workEnvironment = [
    {
      title: "Office-Based Collaboration",
      description: "Work together in our modern Bangalore office with state-of-the-art facilities and collaborative spaces.",
      icon: Users,
      stats: ["Modern office space", "Collaborative environment", "In-person teamwork"]
    },
    {
      title: "Team Communication",
      description: "We believe in open communication and regular face-to-face interactions to build strong working relationships.",
      icon: Globe,
      stats: ["Daily standups", "Open communication", "Team collaboration"]
    },
    {
      title: "Innovation Time",
      description: "Every team member gets dedicated time to explore AI research, side projects, and creative problem-solving.",
      icon: Brain,
      stats: ["20% research time", "Monthly hackathons", "Patent filing support"]
    },
    {
      title: "Continuous Learning",
      description: "We're all students in the rapidly evolving AI landscape. Learning and sharing knowledge is part of everyone's role.",
      icon: Book,
      stats: ["Weekly learning sessions", "Learning opportunities", "Internal tech talks"]
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
              Company <span className="text-blue-400">Culture</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We&apos;re building more than a product — we&apos;re creating a culture where innovation thrives, people grow, and everyone can do their best work together in our Bangalore office
            </p>
          </motion.div>
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
              These aren&apos;t just words on a wall — they guide every decision we make and how we work together
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <value.icon className={`w-12 h-12 ${value.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm mb-4">{value.description}</p>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-2">In Practice:</h4>
                  <ul className="space-y-1">
                    {value.examples.map((example, i) => (
                      <li key={i} className="text-gray-400 text-xs flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Environment */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">How We Work</h2>
            <p className="text-xl text-gray-300">
              Our work environment is designed to bring out the best in everyone in our collaborative office space
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {workEnvironment.map((env, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
              >
                <div className="flex items-start gap-6">
                  <env.icon className="w-12 h-12 text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">{env.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">{env.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {env.stats.map((stat, i) => (
                        <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Perks & Benefits</h2>
            <p className="text-xl text-gray-300">
              We invest in our people because when you succeed, we all succeed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {perks.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">{category.category}</h3>
                <ul className="space-y-3">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
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
            <Heart className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Join Our Culture?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              We&apos;re looking for people who share our values and want to build the future of AI-powered sales automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = 'open-positions'}
              >
                View Open Positions
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  );
}
