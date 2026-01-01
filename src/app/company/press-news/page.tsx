'use client';

import { motion } from 'framer-motion';
import { FileText, Calendar, Download, ExternalLink, Users } from 'lucide-react';
export default function PressNewsPage() {
  const pressReleases = [
    {
      id: 1,
      title: "Revolutionary Voice AI Technology Achieves 99.5% Accuracy Rate",
      date: "2024-01-10",
      category: "Product",
      excerpt: "Sales Centri's breakthrough voice AI delivers human-like conversations with industry-leading natural language processing capabilities.",
      readTime: "4 min read",
      featured: true
    },
    {
      id: 2,
      title: "Strategic AI Partnership with Microsoft Enhances Enterprise Capabilities",
      date: "2023-12-20",
      category: "Partnership",
      excerpt: "Integration with Microsoft Azure AI services brings advanced machine learning to Fortune 500 sales automation workflows.",
      readTime: "3 min read",
      featured: false
    }
  ];

  const mediaHighlights: Array<{ publication: string; headline: string; date: string; type: string }> = [];

  const stats = [
    { label: "Press Mentions", value: "150+", description: "Major publications" },
    { label: "Industry Awards", value: "12", description: "Received in 2024" },
    { label: "Conference Talks", value: "30+", description: "Speaking engagements" },
    { label: "AI Patents", value: "25+", description: "Filed and pending" }
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
              Press & <span className="text-blue-400">News</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Latest news, announcements, and media coverage about Sales Centri&apos;s AI-powered sales automation revolution
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-purple-500/10 text-purple-400 px-4 py-2 rounded-full border border-purple-500/20">
                150+ Media Mentions
              </div>
              <div className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20">
                99.5% AI Accuracy
              </div>
              <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-full border border-green-500/20">
                390M+ B2B Contacts
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Press Resources */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Press Resources</h2>
            <p className="text-lg text-gray-300">
              Access media kits, company information, and press contact details
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 text-center"
            >
              <Download className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Media Kit</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Download logos, executive photos, company facts, and product screenshots.
              </p>
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Download Media Kit
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 text-center"
            >
              <Users className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Press Contact</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Connect with our media relations team for interviews and information.
              </p>
              <motion.button
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Press Team
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 text-center"
            >
              <Calendar className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Press Events</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Stay updated on upcoming conferences, product launches, and announcements.
              </p>
              <motion.button
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Press Calendar
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

      {/* Featured Press Releases */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Latest Announcements</h2>
            <p className="text-xl text-gray-300">
              Major milestones and developments in our AI innovation journey
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {pressReleases.filter(release => release.featured).map((release, index) => (
              <motion.article
                key={release.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm border border-blue-500/20">
                    {release.category}
                  </span>
                  <div className="text-right text-sm text-gray-400">
                    <div>{new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div>{release.readTime}</div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 leading-tight">{release.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{release.excerpt}</p>

                <div className="flex items-center justify-between">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Read Full Release
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </motion.button>
                  <motion.button
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* All Press Releases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">All Press Releases</h2>
            <p className="text-xl text-gray-300">
              Complete archive of company announcements and AI innovation updates
            </p>
          </motion.div>

          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <motion.article
                key={release.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm">
                        {release.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <span className="text-sm text-gray-400">{release.readTime}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{release.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{release.excerpt}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-4 lg:mt-0 lg:ml-6">
                    <motion.button
                      className="border border-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Read More
                    </motion.button>
                    <motion.button
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>


      {/* Contact CTA */}
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
              Media & Press Inquiries
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              For press inquiries, interview requests, or information about Sales Centri&apos;s AI innovation, 
              contact our media relations team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Contact Press Team
              </motion.button>
              <motion.button
                className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Media Kit
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
    </>
  );
}
