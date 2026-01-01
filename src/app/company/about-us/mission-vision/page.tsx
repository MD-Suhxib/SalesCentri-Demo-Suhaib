'use client';

import { motion } from 'framer-motion';
import { Target, Eye, Heart, Globe, Zap, Users, Brain, Rocket, TrendingUp } from 'lucide-react';
export default function MissionVisionPage() {
  const values = [
    {
      icon: Brain,
      title: "AI-Powered Innovation",
      description: "We leverage cutting-edge artificial intelligence to transform sales automation, making it smarter, more personalized, and incredibly effective."
    },
    {
      icon: Users,
      title: "Human-Centric Automation",
      description: "Our AI doesn't replace sales reps — it augments them. We help teams scale personalized outreach while keeping the essential human touch."
    },
    {
      icon: Zap,
      title: "Speed & Efficiency",
      description: "Get your first outreach campaign live in hours, not weeks. We believe in rapid deployment and instant ROI for our customers."
    },
    {
      icon: Globe,
      title: "Global Scale",
      description: "Built to perform whether you're sending 100 or 100,000 messages. Our platform delivers enterprise-level uptime and reliability."
    }
  ];

  const metrics = [
    { label: "B2B Contacts", value: "390M+", description: "Verified database" },
    { label: "AI Accuracy", value: "99.5%", description: "Voice AI technology" },
    { label: "Customer Growth", value: "300%", description: "Average increase" },
    { label: "Setup Time", value: "< 1 Day", description: "First campaign live" }
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
              Our <span className="text-blue-400">Mission</span> &{' '}
              <span className="text-purple-400">Vision</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Empowering modern sales teams with AI-powered automation, personalized communication, and scalable workflows
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Target className="w-16 h-16 text-blue-400 mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                To <strong className="text-blue-400">empower modern sales teams</strong> with{' '}
                <strong className="text-purple-400">AI-powered automation</strong>,{' '}
                <strong className="text-green-400">personalized communication</strong>, and{' '}
                <strong className="text-yellow-400">scalable workflows</strong> that close more deals, 
                foster stronger relationships, and drive revenue — without increasing operational complexity.
              </p>
              <p className="text-gray-400 leading-relaxed">
                We&apos;re not just building a product. We&apos;re building <strong className="text-white">the future of selling</strong>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
            >
              <div className="grid grid-cols-2 gap-6">
                {metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{metric.value}</div>
                    <div className="text-sm font-semibold text-white mb-1">{metric.label}</div>
                    <div className="text-xs text-gray-400">{metric.description}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Short-Term Vision</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Build the most intuitive and effective sales automation stack that allows teams to move from{' '}
                  <strong className="text-blue-400">cold outreach to closed deals</strong> — with speed, intelligence, and personalization.
                </p>
                
                <h3 className="text-2xl font-bold text-white mb-4">Long-Term Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  To become the <strong className="text-purple-400">global standard</strong> for AI-powered sales engagement — 
                  used by teams across industries and continents. We aim to power a future where sales is{' '}
                  <strong className="text-green-400">data-driven</strong>,{' '}
                  <strong className="text-yellow-400">human-centric</strong>, and{' '}
                  <strong className="text-blue-400">radically efficient</strong>.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <Eye className="w-16 h-16 text-purple-400 mb-6" />
              <h2 className="text-4xl font-bold text-white mb-6">Our Vision</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                We envision a world where every sales team has access to enterprise-grade AI automation, 
                regardless of company size or technical expertise.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Rocket className="w-6 h-6 text-blue-400 mr-3" />
                  <span className="text-gray-300">AI-powered personalization at scale</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-6 h-6 text-green-400 mr-3" />
                  <span className="text-gray-300">Instant ROI and measurable results</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-purple-400 mr-3" />
                  <span className="text-gray-300">Global accessibility and reach</span>
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
            {values.map((value, index) => (
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

      {/* What Makes Us Unique */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">What Makes Sales Centri Unique?</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              In a world full of bloated CRMs and disconnected tools, Sales Centri redefines the sales stack with 
              AI-powered automation that actually works.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
            >
              <Brain className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Complete AI Sales Suite</h3>
              <p className="text-gray-300 leading-relaxed">
                More than just software — a comprehensive AI-powered ecosystem covering every stage of the sales funnel, 
                from contact discovery to deal closure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
            >
              <Zap className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">First Outreach in Hours</h3>
              <p className="text-gray-300 leading-relaxed">
                Use AI Hunter, Contact Validator, and iGCT to source and validate high-intent leads. 
                Get your first campaign live the same day with our LaunchKit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8"
            >
              <Heart className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">Human + AI = Powerful Results</h3>
              <p className="text-gray-300 leading-relaxed">
                Our AI augments your sales team without replacing the human touch. Scale personalized outreach 
                while maintaining authentic relationships.
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
            <Rocket className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Sales Process?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of sales teams already using Sales Centri to close more deals with AI-powered automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                type="button"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/get-started/free-trial'}
              >
                Start Free Trial - Meet Our AI
              </motion.button>
              <motion.button
                type="button"
                className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/solutions/psa-suite-one-stop-solution'}
              >
                Request Board-Level Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  </>
  );
}
