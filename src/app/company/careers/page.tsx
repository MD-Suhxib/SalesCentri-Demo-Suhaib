'use client';

import { motion } from 'framer-motion';
import { Briefcase, Heart, Award } from 'lucide-react';
export default function CareersPage() {

  const stats = [
    { label: "Open Positions", value: "30+", description: "Across all departments" },
    { label: "Employee Satisfaction", value: "4.9/5", description: "Glassdoor rating" },
    { label: "Retention Rate", value: "95%", description: "Industry leading" },
    { label: "Countries", value: "15", description: "Remote team locations" }
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
              Join the <span className="text-blue-400">AI Revolution</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Build the future of AI-powered sales automation with a world-class team of engineers, researchers, and innovators
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20">
                30+ Open Positions
              </div>
              <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20">
                AI-First Culture
              </div>
              <div className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full border border-purple-500/20">
                Remote-First Team
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
            <h2 className="text-3xl font-bold text-white mb-6">Explore Career Opportunities</h2>
            <p className="text-lg text-gray-300">
              Discover open positions, learn about our culture, and see what makes Sales Centri a great place to work
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
              <Briefcase className="w-12 h-12 text-blue-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Open Positions</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Browse current job openings across engineering, sales, product, and more. Find your perfect role in AI innovation.
              </p>
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/company/careers/open-positions'}
              >
                View All Open Positions
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300"
            >
              <Heart className="w-12 h-12 text-red-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Company Culture</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Learn about our values, work environment, benefits, and what makes our team passionate about building the future of sales.
              </p>
              <motion.button
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 cursor-pointer w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/company/careers/company-culture'}
              >
                Explore Our Culture
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
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
              Ready to Shape the Future of AI Sales?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join our mission to transform how businesses connect with customers through intelligent automation. 
              Work on cutting-edge AI technology with a world-class team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/company/careers/open-positions'}
              >
                View All Open Positions
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  );
}
