"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Target,
  Brain,
  Users,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  MessageSquare,
} from "lucide-react";

export default function ABMPage() {
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
                      ? "text-blue-400 border-b-2 border-blue-400"
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
              Account-Based Marketing (ABM)
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transform your B2B strategy with precision targeting, personalized
              outreach, and measurable engagement using AI-powered account-based
              marketing that delivers real conversations and closed deals.
            </p>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-16 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Target, label: "Targeting Precision", value: "95%" },
                { icon: Zap, label: "Response Rate", value: "340%" },
                { icon: Users, label: "Deal Size", value: "3x" },
                { icon: BarChart3, label: "Sales Cycle", value: "50%" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* What is ABM Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  What is Account-Based Marketing (ABM)?
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Account-Based Marketing (ABM) is a highly focused B2B strategy
                  that aligns marketing and sales efforts to engage specific
                  high-value accounts, rather than casting a wide net to attract
                  general leads.
                </p>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Unlike traditional lead-generation methods that prioritize
                  volume, ABM centers on precision targeting, personalized
                  outreach, and measurable engagement with decision-makers
                  across buying committees.
                </p>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  At Sales Centri AI, we supercharge this strategy using advanced
                  AI and behavioral data to identify and connect with in-market
                  accounts that are already exploring solutions like yours. This
                  results in more efficient outreach, stronger engagement, and
                  faster deal cycles.
                </p>

                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Why ABM Matters Today
                  </h3>
                  <p className="text-gray-300">
                    With longer buying journeys and more stakeholders involved
                    in B2B decisions, a one-size-fits-all approach no longer
                    works. ABM ensures your message reaches the right person at
                    the right time — with relevance and intent.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-8 border border-gray-700/50">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Precision Targeting
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Focus your efforts on accounts that match your ideal
                    customer profile and show buying intent.
                  </p>
                  <div className="space-y-3">
                    {[
                      "High-value account identification",
                      "Buying committee mapping",
                      "Intent signal detection",
                      "Personalized messaging",
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

        {/* How SalesCentri AI Powers ABM Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                How Sales Centri AI Powers ABM
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Sales Centri AI uses real-time buyer intent data and machine
                learning to pinpoint companies actively researching your
                solution category. We don&apos;t just guess who might be a good
                fit — we know.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Intent Scanning",
                  description:
                    "We tap into behavioral signals from platforms like LinkedIn, TechTarget, Demandbase, Google Trends, and Bombora to detect accounts showing real-time interest.",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  icon: Target,
                  title: "ICP Alignment",
                  description:
                    "We build and refine your Ideal Customer Profile (ICP) to match your best-fit prospects — based on firmographics, technographics, job roles, and active buying signals.",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  icon: MessageSquare,
                  title: "Multichannel Outreach",
                  description:
                    "We engage prospects across email, LinkedIn, and other B2B channels, creating personalized experiences that break through the noise and drive replies.",
                  color: "from-green-500 to-green-600",
                },
                {
                  icon: Users,
                  title: "Buying Committee Targeting",
                  description:
                    "Sales Centri doesn't stop at a single contact. We engage multiple stakeholders across each account to influence the full buying team.",
                  color: "from-cyan-500 to-cyan-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your B2B Strategy?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Start with 3 free qualified leads and see how precision targeting
              translates into real conversations and closed deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solutions/psa-suite-one-stop-solution"
                data-track="abm_cta_get_started"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Get Started with ABM</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/platforms/lead-management/abm/benefits"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Explore Benefits
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
