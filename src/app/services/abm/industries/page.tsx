"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Target,
  Users,
  BarChart3,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  Heart,
  Globe,
  Cpu,
  CreditCard,
  Factory,
} from "lucide-react";

export default function ABMIndustriesPage() {
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

  const industries = [
    {
      icon: Heart,
      title: "Healthcare and MedTech",
      description:
        "Target healthcare providers, pharmaceutical companies, and medical device manufacturers with precision ABM strategies.",
      color: "from-red-500 to-red-600",
      useCases: [
        "Hospital systems",
        "Pharmaceutical companies",
        "Medical device manufacturers",
        "Healthcare IT solutions",
      ],
    },
    {
      icon: CreditCard,
      title: "Financial Services and Fintech",
      description:
        "Engage banks, insurance companies, and fintech startups with personalized account-based approaches.",
      color: "from-green-500 to-green-600",
      useCases: [
        "Banks and credit unions",
        "Insurance companies",
        "Fintech startups",
        "Investment firms",
      ],
    },
    {
      icon: Cpu,
      title: "IT and SaaS",
      description:
        "Connect with technology companies, software providers, and IT service organizations through targeted ABM campaigns.",
      color: "from-blue-500 to-blue-600",
      useCases: [
        "Software companies",
        "IT consulting firms",
        "Cloud service providers",
        "Cybersecurity companies",
      ],
    },
    {
      icon: Factory,
      title: "Manufacturing and Supply Chain",
      description:
        "Target manufacturing companies and supply chain organizations with industry-specific ABM strategies.",
      color: "from-orange-500 to-orange-600",
      useCases: [
        "Manufacturing companies",
        "Supply chain solutions",
        "Industrial equipment",
        "Logistics providers",
      ],
    },
    {
      icon: Users,
      title: "HR Tech and Talent Platforms",
      description:
        "Engage HR departments and talent acquisition teams with personalized recruitment and HR technology solutions.",
      color: "from-purple-500 to-purple-600",
      useCases: [
        "HR departments",
        "Recruitment agencies",
        "Talent platforms",
        "HR software providers",
      ],
    },
    {
      icon: Globe,
      title: "Blockchain and Web3 Solutions",
      description:
        "Target blockchain companies, crypto exchanges, and Web3 organizations with cutting-edge ABM strategies.",
      color: "from-cyan-500 to-cyan-600",
      useCases: [
        "Blockchain companies",
        "Crypto exchanges",
        "DeFi platforms",
        "Web3 startups",
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
              Who Should Use ABM?
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              ABM isn&apos;t just for enterprise companies. It&apos;s ideal for
              growth-focused B2B teams in industries where deal size,
              complexity, or sales cycles require a more personalized, strategic
              approach.
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
                  Perfect for Strategic B2B Growth
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Whether you&apos;re a startup looking to break into strategic
                  accounts or an established firm scaling your outreach,
                  Sales Centri AI adapts ABM to meet your specific needs and
                  industry requirements.
                </p>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Our AI-powered platform identifies the right accounts, engages
                  the right decision-makers, and delivers measurable results
                  across diverse industry verticals.
                </p>

                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Ideal ABM Candidates
                  </h3>
                  <p className="text-gray-300">
                    Companies with complex sales cycles, high-value deals, or
                    multiple stakeholders in the buying process benefit most
                    from our precision targeting approach.
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
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Industry Expertise
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Our platform understands industry-specific challenges and
                    tailors ABM strategies accordingly.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Industry-specific targeting",
                      "Customized messaging",
                      "Regulatory compliance",
                      "Stakeholder mapping",
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

        {/* Industries Grid Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Industries Benefiting from ABM
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover how different industries leverage Account-Based
                Marketing to achieve their growth objectives and connect with
                high-value prospects.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries.map((industry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${industry.color} rounded-xl flex items-center justify-center mb-6`}
                  >
                    <industry.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {industry.title}
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {industry.description}
                  </p>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wide">
                      Use Cases:
                    </h4>
                    {industry.useCases.map((useCase, useCaseIndex) => (
                      <div key={useCaseIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-300">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Why ABM Works Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Why ABM Works Across Industries
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Regardless of your industry, ABM delivers consistent results
                through precision targeting and personalized engagement.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Target,
                  title: "Precision Targeting",
                  description:
                    "Focus resources on accounts that match your ideal customer profile and show buying intent.",
                },
                {
                  icon: MessageSquare,
                  title: "Personalized Messaging",
                  description:
                    "Deliver relevant content that resonates with specific industry challenges and pain points.",
                },
                {
                  icon: Users,
                  title: "Multi-Stakeholder Engagement",
                  description:
                    "Engage all decision-makers across complex buying committees and organizational structures.",
                },
                {
                  icon: BarChart3,
                  title: "Measurable Results",
                  description:
                    "Track engagement, conversion rates, and ROI with industry-specific metrics and benchmarks.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-purple-400" />
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
          className="py-20 bg-gradient-to-r from-purple-900/20 via-black to-blue-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Industry Approach?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Whether you&apos;re in healthcare, fintech, or any other industry,
              our ABM platform adapts to your specific needs and delivers
              measurable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solutions/psa-suite-one-stop-solution"
                data-track="abm_industries_cta"
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Your Industry ABM</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/platforms/lead-management/abm/why-choose-us"
                className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
              >
                Why Choose Sales Centri
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
