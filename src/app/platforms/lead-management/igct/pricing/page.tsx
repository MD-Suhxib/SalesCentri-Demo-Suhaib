'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, CheckCircle, Star, Crown, Zap, Building, Phone } from 'lucide-react';

export default function IGCTPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/igct';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "0.008",
      period: "per minute",
      description: "Perfect for small businesses testing international markets",
      popular: false,
      features: [
        "Up to 10,000 minutes/month",
        "50+ destination countries",
        "Standard route optimization",
        "Basic quality monitoring",
        "Email support",
        "Standard CDR reporting",
        "SIP protocol support",
        "Basic fraud protection",
        "Web portal access",
        "Monthly billing"
      ],
      cta: "Start Testing",
      ctaLink: "/get-started/free-trial"
    },
    {
      name: "Professional",
      icon: Star,
      price: "0.006",
      period: "per minute",
      description: "Ideal for growing businesses with regular international traffic",
      popular: true,
      features: [
        "Up to 100,000 minutes/month",
        "150+ destination countries",
        "Advanced LCR algorithms",
        "Real-time quality monitoring",
        "Priority support (chat &amp; email)",
        "Detailed analytics &amp; reporting",
        "Multiple protocol support",
        "Advanced fraud detection",
        "API access included",
        "Flexible billing options",
        "Carrier redundancy",
        "Custom routing rules"
      ],
      cta: "Start Professional",
      ctaLink: "/get-started/book-demo"
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "0.004",
      period: "per minute",
      description: "Advanced solution for high-volume international call routing",
      popular: false,
      features: [
        "Up to 1,000,000 minutes/month",
        "195+ destination countries",
        "AI-powered route optimization",
        "Premium quality assurance",
        "24/7 priority support + phone",
        "Custom analytics dashboards",
        "All protocols supported",
        "Enterprise fraud protection",
        "Full API &amp; webhook access",
        "Volume-based pricing tiers",
        "Dedicated carrier relationships",
        "Custom SLA agreements",
        "Dedicated account manager",
        "White-label options"
      ],
      cta: "Contact Sales",
      ctaLink: "/get-started/book-demo"
    },
    {
      name: "Custom",
      icon: Building,
      price: "Custom",
      period: "pricing",
      description: "Tailored solution for enterprise customers with specific requirements",
      popular: false,
      features: [
        "Unlimited minutes available",
        "Global coverage guarantee",
        "Custom routing algorithms",
        "Dedicated infrastructure",
        "24/7 dedicated support team",
        "Real-time analytics platform",
        "Custom protocol development",
        "Advanced security features",
        "On-premise deployment options",
        "Multi-tenant architecture",
        "Regulatory compliance tools",
        "Professional services included",
        "Flexible contract terms",
        "Revenue sharing models"
      ],
      cta: "Contact Sales",
      ctaLink: "/contact"
    }
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
                  className={`py-4 px-2 text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
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
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                IGCT Pricing
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Competitive per-minute pricing for international call termination. 
              Transparent rates with volume discounts and flexible billing options.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Star className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">No setup fees • Volume discounts available • 24/7 support</span>
            </div>
          </div>
        </motion.section>

        {/* Pricing Plans */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative bg-gray-800/50 rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg ${
                    plan.popular 
                      ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: feature }}></span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaLink}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                        : 'border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Rate Calculator */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Sample Destination Rates</h2>
              <p className="text-lg text-gray-300">
                Competitive rates for popular international destinations (Professional plan rates shown)
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { destination: "United States", rate: "$0.0045/min", quality: "Premium" },
                { destination: "United Kingdom", rate: "$0.0055/min", quality: "Premium" },
                { destination: "Germany", rate: "$0.0050/min", quality: "Premium" },
                { destination: "India", rate: "$0.0065/min", quality: "High" },
                { destination: "Australia", rate: "$0.0070/min", quality: "Premium" },
                { destination: "China", rate: "$0.0080/min", quality: "High" }
              ].map((rate, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{rate.destination}</h3>
                  <p className="text-blue-400 font-medium mb-1">{rate.rate}</p>
                  <p className="text-gray-400 text-sm">{rate.quality} Quality</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-300">
                Common questions about our IGCT pricing and billing
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "How is billing calculated?",
                  answer: "Billing is based on successful call completion (answered calls) with 6-second increments after the first 60 seconds. Only connected calls are charged."
                },
                {
                  question: "Are there any setup or monthly fees?",
                  answer: "No setup fees or monthly minimums. You only pay for the minutes you use, making it perfect for businesses of all sizes."
                },
                {
                  question: "What about volume discounts?",
                  answer: "We offer tiered pricing based on monthly volume. Higher volumes qualify for better per-minute rates and dedicated account management."
                },
                {
                  question: "How do you ensure call quality?",
                  answer: "We maintain premium carrier relationships and use intelligent routing to ensure high ASR rates and crystal-clear voice quality."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-300">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-indigo-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Optimize Your Call Routing?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Start routing calls globally with competitive rates and premium quality. 
              Contact our sales team for custom pricing and volume discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/book-demo"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Get Custom Pricing</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Talk to Sales
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
