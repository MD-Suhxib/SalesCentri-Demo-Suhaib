'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {  ArrowRight, CheckCircle, Zap, Building, Crown, DollarSign, Calculator,  BarChart, Users, Clock } from 'lucide-react';

export default function CallCenterPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/call-center';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      icon: Zap,
      description: "Perfect for small teams and growing businesses",
      price: "$49",
      period: "per agent/month",
      popular: false,
      features: [
        "Up to 20 agents",
        "Basic call routing",
        "Call recording & monitoring",
        "Simple IVR (3 levels)",
        "Email & chat support",
        "Basic reporting dashboard",
        "Standard integrations",
        "99.9% uptime SLA"
      ],
      limitations: [
        "Limited to 10,000 minutes/month",
        "Basic analytics only",
        "Standard support hours"
      ],
      cta: "Start Free Trial",
      ctaSecondary: "Contact Sales"
    },
    {
      name: "Professional",
      icon: Building,
      description: "Advanced features for medium-sized contact centers",
      price: "$149",
      period: "per agent/month",
      popular: true,
      features: [
        "Up to 100 agents",
        "Advanced call routing & ACD",
        "AI-powered analytics",
        "Multi-level IVR with voice recognition",
        "24/7 priority support",
        "Real-time dashboards",
        "CRM integrations",
        "Quality management tools",
        "Workforce management",
        "Custom reporting",
        "99.95% uptime SLA"
      ],
      limitations: [
        "50,000 minutes included",
        "Additional minutes at $0.02/min"
      ],
      cta: "Start Free Trial",
      ctaSecondary: "Schedule Demo"
    },
    {
      name: "Enterprise",
      icon: Crown,
      description: "Complete solution for large-scale operations",
      price: "Custom",
      period: "tailored pricing",
      popular: false,
      features: [
        "Unlimited agents",
        "AI virtual agents & automation",
        "Advanced sentiment analysis",
        "Custom IVR development",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced security & compliance",
        "Predictive analytics",
        "Custom training & onboarding",
        "SLA customization",
        "99.99% uptime guarantee",
        "White-label options"
      ],
      limitations: [],
      cta: "Contact Sales",
      ctaSecondary: "Request Quote"
    }
  ];

  const addOnServices = [
    {
      name: "AI Virtual Agents",
      description: "Intelligent chatbots and voice bots for automated customer service",
      pricing: "$15/month per virtual agent",
      features: ["24/7 availability", "Multi-language support", "Custom training", "Seamless handoff to human agents"]
    },
    {
      name: "Advanced Analytics",
      description: "Deep insights with predictive analytics and custom reporting",
      pricing: "$25/month per 100 agents",
      features: ["Predictive modeling", "Custom dashboards", "Real-time alerts", "Historical trend analysis"]
    },
    {
      name: "Workforce Management",
      description: "Advanced scheduling and forecasting tools",
      pricing: "$12/month per agent",
      features: ["Predictive scheduling", "Real-time adherence", "Forecasting tools", "Performance tracking"]
    },
    {
      name: "Premium Support",
      description: "Dedicated support with faster response times",
      pricing: "$500/month",
      features: ["Dedicated support team", "Priority response", "Phone & chat support", "Custom training sessions"]
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
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                Call Center Pricing
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transparent, scalable pricing designed to grow with your business. 
              Choose the plan that fits your call center needs and budget.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Calculator className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">30-day free trial • No setup fees • Cancel anytime</span>
            </div>
          </div>
        </motion.section>

        {/* Pricing Plans */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`relative bg-gray-800/50 rounded-2xl p-8 border transition-all duration-300 ${
                    plan.popular 
                      ? 'border-blue-500 bg-gradient-to-b from-blue-900/20 to-gray-800/50 scale-105' 
                      : 'border-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 mb-6">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      {plan.price !== "Custom" && <span className="text-gray-400 ml-2">/{plan.period}</span>}
                      {plan.price === "Custom" && <span className="text-gray-400 ml-2">{plan.period}</span>}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <div className="border-t border-gray-700 pt-4 mt-6">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="flex items-start mb-2">
                            <span className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0">⚠</span>
                            <span className="text-gray-400 text-sm">{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}>
                      {plan.cta}
                    </button>
                    <button className="w-full py-3 px-6 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white transition-all duration-300">
                      {plan.ctaSecondary}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Add-on Services */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-blue-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Add-on Services</h2>
              <p className="text-lg text-gray-300">
                Enhance your call center with additional features and services
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {addOnServices.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-white">{addon.name}</h3>
                    <span className="text-blue-400 font-semibold">{addon.pricing}</span>
                  </div>
                  <p className="text-gray-300 mb-4">{addon.description}</p>
                  <div className="space-y-2">
                    {addon.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-400 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ROI Calculator Preview */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Calculate Your Savings</h2>
              <p className="text-lg text-gray-300">
                See how much you can save by switching to our call center platform
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Reduced Labor Costs</h3>
                  <p className="text-blue-400 text-2xl font-bold">35%</p>
                  <p className="text-gray-400 text-sm">Average reduction in operational costs</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Faster Resolution</h3>
                  <p className="text-blue-400 text-2xl font-bold">45%</p>
                  <p className="text-gray-400 text-sm">Improvement in average handle time</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Higher Satisfaction</h3>
                  <p className="text-blue-400 text-2xl font-bold">38%</p>
                  <p className="text-gray-400 text-sm">Increase in customer satisfaction scores</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Link
                  href="/roi-calculator"
                  className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Use Full ROI Calculator
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-blue-900/10"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Pricing FAQs</h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  question: "Is there a setup fee?",
                  answer: "No, there are no setup fees for any of our plans. You can start using our platform immediately after signup."
                },
                {
                  question: "Can I change plans anytime?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle."
                },
                {
                  question: "What happens if I exceed my minute allowance?",
                  answer: "Additional minutes are charged at our standard overage rates: $0.02/minute for Starter and Professional plans, $0.015/minute for Enterprise."
                },
                {
                  question: "Do you offer annual discounts?",
                  answer: "Yes, we offer up to 20% discount for annual payments. Contact our sales team for custom pricing options."
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
          transition={{ duration: 0.8, delay: 1.0 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Start your free 30-day trial today. No credit card required. 
              Experience the power of our call center platform risk-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                Schedule Demo
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              Questions about pricing? <Link href="/contact" className="text-blue-400 hover:underline">Contact our sales team</Link>
            </p>
          </div>
        </motion.section>
      </main>
    </>
  );
}
