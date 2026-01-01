'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, CheckCircle, Star, Crown, Zap, Building, Phone } from 'lucide-react';

export default function WhatsAppBotPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/whatsapp-bot';

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
      price: "99",
      period: "month",
      description: "Perfect for small businesses getting started with WhatsApp automation",
      popular: false,
      features: [
        "Up to 1,000 conversations/month",
        "Basic AI chatbot capabilities",
        "WhatsApp Business API integration",
        "Template message management",
        "Basic analytics dashboard",
        "Email support",
        "Standard response time (5 seconds)",
        "5 custom conversation flows",
        "Contact management (up to 2,500)",
        "Basic CRM integration"
      ],
      cta: "Start Free Trial",
      ctaLink: "/get-started/free-trial"
    },
    {
      name: "Professional",
      icon: Star,
      price: "299",
      period: "month",
      description: "Ideal for growing businesses with moderate WhatsApp automation needs",
      popular: true,
      features: [
        "Up to 5,000 conversations/month",
        "Advanced AI with context awareness",
        "Rich media support (images, videos, docs)",
        "Interactive buttons &amp; quick replies",
        "Advanced analytics &amp; reporting",
        "Priority support (chat &amp; email)",
        "Fast response time (2 seconds)",
        "Unlimited conversation flows",
        "Contact management (up to 10,000)",
        "Multiple CRM integrations",
        "Appointment booking system",
        "Custom branding options"
      ],
      cta: "Start Professional",
      ctaLink: "/get-started/free-trial"
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "799",
      period: "month",
      description: "Advanced solution for large-scale WhatsApp automation and customer engagement",
      popular: false,
      features: [
        "Up to 25,000 conversations/month",
        "Premium AI with sentiment analysis",
        "Advanced workflow automation",
        "Multi-agent handoff capabilities",
        "Real-time analytics &amp; insights",
        "24/7 priority support + phone",
        "Ultra-fast response (1 second)",
        "Advanced conversation builder",
        "Unlimited contact management",
        "Enterprise CRM integrations",
        "Advanced security &amp; compliance",
        "Custom API development",
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
        "Unlimited conversations",
        "Custom AI model training",
        "Advanced integration capabilities",
        "Dedicated infrastructure",
        "Custom feature development",
        "24/7 dedicated support team",
        "SLA guarantees",
        "Advanced security controls",
        "On-premise deployment options",
        "Custom compliance requirements",
        "Advanced reporting &amp; analytics",
        "Multi-tenant architecture",
        "Global scaling support",
        "Professional services included"
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                WhatsApp Bot Pricing
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Choose the perfect plan for your WhatsApp automation needs. Scale as you grow with flexible pricing options.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Star className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">30-day free trial available on all plans</span>
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
                      <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
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
                        ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
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

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-blue-900/10"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-300">
                Common questions about our WhatsApp Bot pricing and features
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "What counts as a conversation?",
                  answer: "A conversation is a 24-hour messaging session between your bot and a customer, regardless of the number of messages exchanged during that period."
                },
                {
                  question: "Can I upgrade or downgrade my plan?",
                  answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle."
                },
                {
                  question: "Is there a setup fee?",
                  answer: "No setup fees. You only pay the monthly subscription cost for your chosen plan."
                },
                {
                  question: "What happens if I exceed my conversation limit?",
                  answer: "We'll notify you when you approach your limit. Overage conversations are charged at $0.05 per conversation above your plan limit."
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
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Join thousands of businesses using our WhatsApp Bot to automate customer interactions and boost sales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start 30-Day Free Trial</span>
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
