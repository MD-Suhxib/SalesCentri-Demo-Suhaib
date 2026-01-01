"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  Handshake,
  RefreshCw,
} from "lucide-react";

export default function ABMBenefitsPage() {
  const pathname = usePathname();
  const basePath = "/services/abm";

  const subNavItems = [
    { name: "Overview", href: basePath, active: pathname === basePath },
    {
      name: "Benefits",
      href: `${basePath}/benefits`,
      active: pathname === `${basePath}/benefits`,
    },
    {
      name: "Industries",
      href: `${basePath}/industries`,
      active: pathname === `${basePath}/industries`,
    },
    {
      name: "Why Choose Us",
      href: `${basePath}/why-choose-us`,
      active: pathname === `${basePath}/why-choose-us`,
    },
  ];

  // Placeholder functions for future implementation
  // const handleCTAClick = () => {};
  // const handleLinkClick = (href: string, text: string) => {};

  // Track page view
  useEffect(() => {
    // External tracker handles page views via SPA bridge
  }, []);

  const benefits = [
    {
      icon: Clock,
      title: "Shorter Sales Cycles",
      description:
        "When your outreach is targeted and relevant, conversations progress faster and close sooner.",
      color: "from-green-500 to-green-600",
      metrics: [
        "50% faster deal closure",
        "Reduced time to first meeting",
        "Streamlined decision process",
      ],
    },
    {
      icon: DollarSign,
      title: "Higher Deal Values",
      description:
        "ABM targets strategic accounts, often leading to larger contracts and long-term partnerships.",
      color: "from-blue-500 to-blue-600",
      metrics: [
        "3x larger deal sizes",
        "Increased contract value",
        "Long-term customer relationships",
      ],
    },
    {
      icon: BarChart3,
      title: "Better ROI",
      description:
        "Sales Centri's AI-driven ABM model reduces wasted effort and increases the ROI per dollar spent.",
      color: "from-purple-500 to-purple-600",
      metrics: [
        "250% ROI improvement",
        "Reduced cost per acquisition",
        "Higher conversion rates",
      ],
    },
    {
      icon: Users,
      title: "Sales & Marketing Alignment",
      description:
        "Our platform keeps your sales and marketing efforts synchronized, using the same account data and goals.",
      color: "from-cyan-500 to-cyan-600",
      metrics: [
        "Unified account strategy",
        "Shared success metrics",
        "Collaborative campaigns",
      ],
    },
    {
      icon: RefreshCw,
      title: "Real-Time Feedback Loops",
      description:
        "We continuously optimize targeting and messaging based on response quality and engagement metrics.",
      color: "from-orange-500 to-orange-600",
      metrics: [
        "Dynamic optimization",
        "Performance tracking",
        "Continuous improvement",
      ],
    },
  ];

  return (
    <>
      {/* Sub-navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <nav className="flex space-x-8">
              {subNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  data-track={`abm_subnav_${item.name.toLowerCase().replace(/\s+/g, "_")}`}
                  className={`py-4 px-2 text-sm font-medium transition-colors ${
                    item.active
                      ? "text-purple-400 border-b-2 border-purple-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
              ABM Benefits for Sales & Marketing Teams
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Account-Based Marketing bridges the traditional gap between sales
              and marketing by aligning goals, data, and messaging toward a
              common target — high-value accounts with high intent.
            </p>
          </div>
        </motion.section>

        {/* Overview Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-16 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Transform Your B2B Strategy
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Traditional marketing approaches often create silos between
                  sales and marketing teams, leading to misaligned goals and
                  wasted resources. ABM changes this dynamic by creating a
                  unified approach to account engagement.
                </p>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  With Sales Centri AI&apos;s ABM platform, both teams work from
                  the same playbook, targeting the same high-value accounts with
                  coordinated messaging that drives real business results.
                </p>

                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Key Advantage
                  </h3>
                  <p className="text-gray-300">
                    ABM ensures your message reaches the right person at the
                    right time with relevance and intent, resulting in more
                    meaningful conversations and faster deal closures.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="relative"
              >
                <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                    <Handshake className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Team Alignment
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Break down silos between sales and marketing with unified
                    account strategies and shared success metrics.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Shared account ownership",
                      "Unified messaging strategy",
                      "Collaborative campaign planning",
                      "Joint success metrics",
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Benefits Grid Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Top Benefits of ABM
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how Account-Based Marketing transforms your business
                outcomes with measurable results that impact both your top and
                bottom line.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>

                  <div className="space-y-3">
                    {benefit.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{metric}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Comparison Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Traditional vs. ABM Approach
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                See how ABM transforms your approach to B2B marketing and sales.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="bg-gray-800/30 rounded-xl p-8 border border-gray-700/50"
              >
                <h3 className="text-2xl font-bold text-red-400 mb-6">
                  Traditional Marketing
                </h3>
                <div className="space-y-4">
                  {[
                    "Broad, untargeted campaigns",
                    "High volume, low quality leads",
                    "Disconnected sales and marketing",
                    "Long sales cycles",
                    "Low conversion rates",
                    "Wasted marketing budget",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-purple-500/30"
              >
                <h3 className="text-2xl font-bold text-green-400 mb-6">
                  ABM with Sales Centri AI
                </h3>
                <div className="space-y-4">
                  {[
                    "Precision-targeted accounts",
                    "High-quality, intent-driven leads",
                    "Aligned sales and marketing",
                    "Faster deal closure",
                    "Higher conversion rates",
                    "Measurable ROI improvement",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience These Benefits?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join the companies already seeing 3x larger deals and 50% faster
              sales cycles with our ABM platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solutions/psa-suite-one-stop-solution"
                data-track="abm_benefits_cta"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Your ABM Journey</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/platforms/lead-management/abm/industries"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Explore Industries
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
