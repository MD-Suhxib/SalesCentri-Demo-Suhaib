"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Shield,
  DollarSign,
  Star,
  Award,
} from "lucide-react";

export default function ABMWhyChooseUsPage() {
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

  const advantages = [
    {
      icon: DollarSign,
      title: "Performance-Based Pricing",
      description:
        "No upfront fees. You only pay when qualified leads are delivered.",
      color: "from-blue-500 to-blue-600",
      details: [
        "No setup costs",
        "Pay per qualified lead",
        "Transparent pricing",
        "Risk-free model",
      ],
    },
    {
      icon: Star,
      title: "3 Free Qualified Leads",
      description:
        "Try before you commit. We offer a POC (Proof of Concept) with 3 verified replies — completely free.",
      color: "from-blue-500 to-blue-600",
      details: [
        "No obligation trial",
        "3 verified responses",
        "Full platform access",
        "Proven results",
      ],
    },
    {
      icon: Shield,
      title: "Exclusive Lead Delivery",
      description:
        "All leads are exclusive to you. No recycled or shared prospects.",
      color: "from-blue-500 to-blue-600",
      details: [
        "100% exclusive leads",
        "No shared prospects",
        "Fresh contact data",
        "Competitor-free",
      ],
    },
    {
      icon: Users,
      title: "Human + AI Advantage",
      description:
        "Our blend of automation and human strategy ensures each message resonates with your ICP.",
      color: "from-blue-500 to-blue-600",
      details: [
        "AI-powered targeting",
        "Human strategy oversight",
        "Personalized messaging",
        "Continuous optimization",
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
              Why Choose Sales Centri AI for ABM?
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Most ABM tools give you access to data — we deliver actual buying
              conversations. Sales Centri AI is not just software; it&apos;s a
              done-for-you ABM engine.
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
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                  Beyond Traditional ABM Tools
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  While other ABM platforms provide data and tools, Sales Centri
                  AI delivers actual conversations and qualified leads directly
                  to your inbox. We identify high-intent accounts, initiate
                  personalized outreach, and deliver verified replies.
                </p>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Our unique approach combines AI-powered intent detection with
                  human strategy to ensure each interaction drives real business
                  value and measurable ROI.
                </p>

                <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    The Sales Centri Difference
                  </h3>
                  <p className="text-gray-300">
                    We don&apos;t just help you find prospects — we help you
                    start meaningful conversations that lead to closed deals and
                    long-term partnerships.
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
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Proven Results
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Our clients consistently achieve superior results compared
                    to traditional ABM approaches.
                  </p>
                  <div className="space-y-3">
                    {[
                      "340% higher response rates",
                      "3x larger deal sizes",
                      "50% faster sales cycles",
                      "250% ROI improvement",
                    ].map((metric, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{metric}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Advantages Grid Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                What Sets Us Apart
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover the unique advantages that make Sales Centri AI the
                preferred choice for Account-Based Marketing success.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${advantage.color} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <advantage.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {advantage.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {advantage.description}
                  </p>

                  <div className="space-y-3">
                    {advantage.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-blue-400 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Process Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-blue-400 bg-clip-text text-transparent">
                Our ABM Process
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                From initial setup to ongoing optimization, we handle every
                aspect of your ABM strategy.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Target,
                  title: "1. Account Identification",
                  description:
                    "AI-powered intent scanning identifies high-value accounts showing buying signals.",
                },
                {
                  icon: MessageSquare,
                  title: "2. Personalized Outreach",
                  description:
                    "Multi-channel campaigns with tailored messaging for each target account.",
                },
                {
                  icon: Users,
                  title: "3. Engagement Management",
                  description:
                    "Continuous monitoring and optimization of prospect interactions.",
                },
                {
                  icon: CheckCircle,
                  title: "4. Lead Delivery",
                  description:
                    "Qualified, verified leads delivered directly to your sales team.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Testimonial Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <blockquote className="text-xl text-gray-300 mb-6 italic">
                &ldquo;Sales Centri AI transformed our ABM strategy. We went from
                generic outreach to meaningful conversations with
                decision-makers. The results speak for themselves — 3x larger
                deals and 50% faster sales cycles.&rdquo;
              </blockquote>
              <div className="text-white font-semibold">Sarah Johnson</div>
              <div className="text-gray-400">
                VP of Sales, TechCorp Solutions
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to See ABM in Action?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Book a walkthrough or start with your free ABM trial. Sales Centri
              AI will show you how precision targeting translates into real
              conversations and closed deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solutions/psa-suite-one-stop-solution"
                data-track="abm_why_choose_us_cta"
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Get Started with ABM</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Book Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
