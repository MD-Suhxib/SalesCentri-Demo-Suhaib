'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Volume2, ArrowRight, CheckCircle, Star, Crown, Zap, Building, Phone } from 'lucide-react';

export default function TextToSpeechPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/text-to-speech';

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
      price: "49",
      period: "month",
      description: "Perfect for small businesses and content creators getting started",
      popular: false,
      features: [
        "50,000 characters/month",
        "Standard voice models",
        "5 languages supported",
        "MP3 &amp; WAV output formats",
        "Basic customization options",
        "Email support",
        "Standard processing speed",
        "Commercial usage rights",
        "API access included",
        "Basic analytics dashboard"
      ],
      cta: "Start Free Trial",
      ctaLink: "/get-started/free-trial"
    },
    {
      name: "Professional",
      icon: Star,
      price: "149",
      period: "month",
      description: "Ideal for businesses with regular voice content needs",
      popular: true,
      features: [
        "250,000 characters/month",
        "Premium neural voice models",
        "20+ languages supported",
        "All audio formats available",
        "Advanced voice customization",
        "Priority support (chat &amp; email)",
        "Fast processing (2x speed)",
        "SSML markup support",
        "Batch processing capabilities",
        "Advanced analytics &amp; reporting",
        "Custom pronunciation dictionary",
        "Voice cloning (basic)"
      ],
      cta: "Start Professional",
      ctaLink: "/get-started/free-trial"
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "449",
      period: "month",
      description: "Advanced solution for large-scale voice content production",
      popular: false,
      features: [
        "1,000,000 characters/month",
        "Ultra-premium voice models",
        "40+ languages &amp; accents",
        "Custom voice training",
        "Real-time streaming audio",
        "24/7 priority support + phone",
        "Ultra-fast processing (5x speed)",
        "Advanced SSML features",
        "Enterprise-grade security",
        "Custom analytics dashboards",
        "Advanced voice cloning",
        "Dedicated account manager",
        "SLA guarantees",
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
        "Unlimited character usage",
        "Custom voice model development",
        "On-premise deployment options",
        "Dedicated infrastructure",
        "Custom feature development",
        "24/7 dedicated support team",
        "Priority processing queues",
        "Advanced compliance features",
        "Custom integration development",
        "Multi-tenant architecture",
        "Global content delivery",
        "Advanced security controls",
        "Professional services included",
        "Flexible contract terms"
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
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                Text to Speech Pricing
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Flexible pricing plans designed to scale with your voice content needs. 
              From startups to enterprises, find the perfect plan for your requirements.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Star className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">14-day free trial on all plans • No credit card required</span>
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

        {/* Usage Calculator */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Character Usage Guide</h2>
              <p className="text-lg text-gray-300">
                Understand how many characters you need for different types of content
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  type: "1 minute of speech",
                  characters: "~150-200 characters",
                  examples: "Short announcements, notifications"
                },
                {
                  type: "10 minute presentation",
                  characters: "~1,500-2,000 characters",
                  examples: "Product demos, training modules"
                },
                {
                  type: "1 hour audiobook chapter",
                  characters: "~9,000-12,000 characters",
                  examples: "Educational content, long-form narration"
                },
                {
                  type: "Full-length audiobook",
                  characters: "~150,000-300,000 characters",
                  examples: "Complete books, comprehensive courses"
                }
              ].map((usage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{usage.type}</h3>
                  <p className="text-blue-400 font-medium mb-2">{usage.characters}</p>
                  <p className="text-gray-400 text-sm">{usage.examples}</p>
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
                Common questions about our Text to Speech pricing and usage
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "What counts as a character?",
                  answer: "Characters include all text, spaces, punctuation, and SSML markup tags that are processed for speech generation."
                },
                {
                  question: "Can I upgrade or downgrade my plan?",
                  answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle."
                },
                {
                  question: "What happens if I exceed my character limit?",
                  answer: "We'll notify you when you approach your limit. Additional characters are charged at $0.10 per 1,000 characters above your plan limit."
                },
                {
                  question: "Do you offer volume discounts?",
                  answer: "Yes, we offer custom pricing for high-volume users. Contact our sales team to discuss volume discounts and enterprise plans."
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
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your text into professional voice content today. Try any plan risk-free with our 14-day trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start 14-Day Free Trial</span>
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
