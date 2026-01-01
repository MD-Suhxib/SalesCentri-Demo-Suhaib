'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Mail, Target, Database, TrendingUp, ArrowRight, CheckCircle
} from 'lucide-react';

export default function LeadManagementPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const platformPricing = [
    {
      title: 'iEMA Email Marketing Automation',
      icon: Mail,
      color: 'from-purple-500 to-purple-600',
      link: '/platforms/lead-management/iema-email-marketing-automation/pricing',
      plans: [
        {
          name: 'Starter',
          price: { monthly: 99, yearly: 79 },
          description: 'Perfect for small teams',
          features: ['5,000 emails/month', 'Basic templates', 'Email analytics', 'Support']
        },
        {
          name: 'Professional',
          price: { monthly: 199, yearly: 159 },
          description: 'For growing businesses',
          features: ['25,000 emails/month', 'Advanced automation', 'A/B testing', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: { monthly: 499, yearly: 399 },
          description: 'For large organizations',
          features: ['Unlimited emails', 'Custom integrations', 'Dedicated support', 'Advanced analytics']
        }
      ]
    },
    {
      title: 'Lead Generation Platform',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      link: '/platforms/lead-management/lead-generation/pricing',
      plans: [
        {
          name: 'Starter',
          price: { monthly: 149, yearly: 119 },
          description: 'Perfect for small teams',
          features: ['1,000 leads/month', 'Basic targeting', 'Lead scoring', 'Email support']
        },
        {
          name: 'Professional',
          price: { monthly: 299, yearly: 239 },
          description: 'For growing businesses',
          features: ['5,000 leads/month', 'Advanced targeting', 'CRM integration', 'Phone support']
        },
        {
          name: 'Enterprise',
          price: { monthly: 799, yearly: 639 },
          description: 'For large organizations',
          features: ['Unlimited leads', 'Custom solutions', 'Dedicated manager', 'API access']
        }
      ]
    },
    {
      title: 'Lead Stream',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      link: '/platforms/lead-management/lead-stream/pricing',
      plans: [
        {
          name: 'Starter',
          price: { monthly: 79, yearly: 63 },
          description: 'Perfect for small websites',
          features: ['1,000 visitors/month', 'Basic identification', 'Email alerts', 'Support']
        },
        {
          name: 'Professional',
          price: { monthly: 159, yearly: 127 },
          description: 'For growing websites',
          features: ['10,000 visitors/month', 'Advanced tracking', 'Real-time alerts', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: { monthly: 399, yearly: 319 },
          description: 'For large websites',
          features: ['Unlimited visitors', 'Custom tracking', 'Dedicated support', 'Advanced analytics']
        }
      ]
    },
    {
      title: 'iLMS Lead Management System',
      icon: Database,
      color: 'from-cyan-500 to-cyan-600',
      link: '/platforms/lead-management/ilms-lead-management-system/pricing',
      plans: [
        {
          name: 'Starter',
          price: { monthly: 129, yearly: 103 },
          description: 'Perfect for small teams',
          features: ['1,000 leads', 'Basic scoring', 'Email automation', 'Support']
        },
        {
          name: 'Professional',
          price: { monthly: 259, yearly: 207 },
          description: 'For growing businesses',
          features: ['10,000 leads', 'Advanced scoring', 'CRM integration', 'Priority support']
        },
        {
          name: 'Enterprise',
          price: { monthly: 599, yearly: 479 },
          description: 'For large organizations',
          features: ['Unlimited leads', 'Custom workflows', 'Dedicated support', 'Advanced analytics']
        }
      ]
    }
  ];

  const addOns = [
    {
      name: 'Additional Users',
      price: 25,
      description: 'Add more team members to your plan',
      unit: 'per user/month'
    },
    {
      name: 'Premium Support',
      price: 99,
      description: '24/7 phone support and dedicated success manager',
      unit: 'per month'
    },
    {
      name: 'Custom Training',
      price: 499,
      description: 'Personalized onboarding and training sessions',
      unit: 'one-time'
    },
    {
      name: 'Advanced Analytics',
      price: 149,
      description: 'Enhanced reporting and business intelligence',
      unit: 'per month'
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
                      ? 'text-purple-400 border-b-2 border-purple-400'
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
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
              Lead Management Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Transparent, scalable pricing for every stage of your business. 
              Choose the plan that fits your needs and scale as you grow.
            </p>
          </div>
        </motion.section>

        {/* Platform Pricing */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            {platformPricing.map((platform, platformIndex) => (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: platformIndex * 0.2 }}
                className="mb-20"
              >
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${platform.color} flex items-center justify-center mr-4`}>
                      <platform.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{platform.title}</h2>
                  </div>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Choose the perfect plan for your {platform.title.toLowerCase()} needs
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {platform.plans.map((plan, planIndex) => (
                    <motion.div
                      key={plan.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: platformIndex * 0.2 + planIndex * 0.1 }}
                      className={`bg-gray-900/50 border rounded-2xl p-8 relative ${
                        plan.name === 'Professional' 
                          ? 'border-purple-500/50 bg-purple-900/20' 
                          : 'border-gray-800 hover:border-purple-500/30'
                      }`}
                    >
                      {plan.name === 'Professional' && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            Most Popular
                          </span>
                        </div>
                      )}

                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                        <p className="text-gray-400 mb-6">{plan.description}</p>
                        
                        <div className="mb-6">
                          <div className="flex items-baseline justify-center">
                            <span className="text-4xl font-bold text-white">${plan.price.monthly}</span>
                            <span className="text-gray-400 ml-2">/month</span>
                          </div>
                          <div className="flex items-baseline justify-center text-sm text-gray-500">
                            <span>${plan.price.yearly}</span>
                            <span className="ml-1">/month</span>
                            <span className="ml-1">(billed yearly)</span>
                          </div>
                        </div>

                        <Link
                          href={platform.link}
                          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                            plan.name === 'Professional'
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600'
                              : 'border border-purple-500 text-purple-400 hover:bg-purple-500/10'
                          }`}
                        >
                          Get Started
                        </Link>
                      </div>

                      <ul className="space-y-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-16 px-6 bg-gray-900/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Additional Services
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Enhance your lead management capabilities with our additional services 
                and support options.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {addOns.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2 text-white">{addon.name}</h3>
                    <div className="mb-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl font-bold text-white">${addon.price}</span>
                        <span className="text-gray-400 ml-2 text-sm">{addon.unit}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-6">{addon.description}</p>
                    <Link
                      href="/contact/sales-inquiry"
                      className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors text-sm"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: 'Can I switch between plans?',
                  answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing adjustments.'
                },
                {
                  question: 'Is there a free trial available?',
                  answer: 'Yes, we offer a 14-day free trial on all plans. No credit card required to start your trial.'
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely.'
                },
                {
                  question: 'Do you offer discounts for nonprofits?',
                  answer: 'Yes, we offer special pricing for qualified nonprofits and educational institutions. Contact our sales team for details.'
                }
              ].map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-bold mb-4 text-white">{faq.question}</h3>
                  <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-2xl p-12"
            >
              <h2 className="text-3xl font-bold mb-6 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Start your free trial today and see how our lead management platforms can transform your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/get-started/free-trial"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                >
                  Start Free Trial
                </Link>
                <Link
                  href="/contact/sales-inquiry"
                  className="border border-purple-500 text-purple-400 px-8 py-4 rounded-xl font-semibold hover:bg-purple-500/10 transition-all duration-300"
                >
                  Contact Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
