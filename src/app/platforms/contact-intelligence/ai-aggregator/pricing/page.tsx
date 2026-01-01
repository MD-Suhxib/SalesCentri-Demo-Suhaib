'use client';

import { motion } from 'framer-motion';
import { Database, CheckCircle, ArrowRight, Star, Shield, Zap, Users, Globe, Headphones } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AIAggregatorPricingPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/ai-aggregator', active: false },
    { name: 'Features', href: '/platforms/contact-intelligence/ai-aggregator/features', active: false },
    { name: 'Integrations', href: '/platforms/contact-intelligence/ai-aggregator/integrations', active: false },
    { name: 'Pricing', href: '/platforms/contact-intelligence/ai-aggregator/pricing', active: pathname === '/platforms/contact-intelligence/ai-aggregator/pricing' }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Custom",
      period: "pricing",
      description: "Perfect for small teams just getting started with data aggregation",
      features: [
        "Up to 10,000 contact records",
        "5 data source integrations",
        "Basic AI data enhancement",
        "Standard duplicate detection",
        "Email support",
        "Weekly data quality reports",
        "Basic API access",
        "1 user account"
      ],
      limitations: [
        "Limited to CRM and email integrations",
        "Batch processing only",
        "Standard data refresh (daily)"
      ],
      cta: "Get Custom Quote",
      popular: false
    },
    {
      name: "Professional", 
      price: "Custom",
      period: "pricing",
      description: "Ideal for growing businesses with multiple data sources and teams",
      features: [
        "Up to 100,000 contact records",
        "25 data source integrations",
        "Advanced AI data enhancement",
        "Smart duplicate detection & merging",
        "Priority email & chat support",
        "Daily data quality reports",
        "Full API access with webhooks",
        "5 user accounts",
        "Real-time data synchronization",
        "Custom field mapping",
        "Data export capabilities",
        "Integration health monitoring"
      ],
      limitations: [
        "Premium data sources additional cost",
        "Advanced analytics add-on required"
      ],
      cta: "Get Custom Quote",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "month", 
      description: "Advanced solution for large organizations with complex data needs",
      features: [
        "Unlimited contact records",
        "Unlimited data source integrations",
        "Premium AI data enhancement",
        "Advanced duplicate detection with ML",
        "Dedicated customer success manager",
        "Real-time data quality monitoring",
        "Enterprise API with SLA",
        "Unlimited user accounts",
        "Real-time data synchronization",
        "Custom integrations included",
        "Advanced analytics & reporting",
        "SOC 2 Type II compliance",
        "GDPR & CCPA compliance tools",
        "On-premise deployment options",
        "Custom data retention policies",
        "White-label options available"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const addOnServices = [
    {
      icon: Database,
      name: "Premium Data Sources",
      description: "Access to premium databases like ZoomInfo, Apollo, and LinkedIn Sales Navigator",
      pricing: "Starting at $99/month",
      features: [
        "ZoomInfo database access",
        "LinkedIn Sales Navigator integration", 
        "Apollo.io premium data",
        "Clearbit enrichment",
        "People Data Labs access"
      ]
    },
    {
      icon: Zap,
      name: "Advanced Analytics",
      description: "Deep insights into your data quality, source performance, and ROI metrics",
      pricing: "Starting at $49/month",
      features: [
        "Data quality scoring",
        "Source performance analytics",
        "ROI and conversion tracking",
        "Custom dashboard creation",
        "Automated insights reports"
      ]
    },
    {
      icon: Users,
      name: "Migration Services",
      description: "Expert-led data migration from your existing systems and platforms",
      pricing: "Starting at $2,500",
      features: [
        "Full data audit and mapping",
        "Custom migration planning",
        "Hands-on migration execution",
        "Data validation and testing",
        "Post-migration optimization"
      ]
    },
    {
      icon: Headphones,
      name: "Professional Services",
      description: "Custom integrations, training, and ongoing optimization support",
      pricing: "Starting at $1,500",
      features: [
        "Custom integration development",
        "Team training and onboarding",
        "Workflow optimization consulting",
        "Ongoing strategic support",
        "Performance optimization"
      ]
    }
  ];

  const comparisonFeatures = [
    {
      feature: "Contact Records",
      starter: "10,000",
      professional: "100,000", 
      enterprise: "Unlimited"
    },
    {
      feature: "Data Source Integrations",
      starter: "5",
      professional: "25",
      enterprise: "Unlimited"
    },
    {
      feature: "AI Enhancement",
      starter: "Basic",
      professional: "Advanced",
      enterprise: "Premium"
    },
    {
      feature: "Real-time Sync",
      starter: "❌",
      professional: "✅",
      enterprise: "✅"
    },
    {
      feature: "API Access",
      starter: "Basic",
      professional: "Full",
      enterprise: "Enterprise"
    },
    {
      feature: "User Accounts",
      starter: "1",
      professional: "5",
      enterprise: "Unlimited"
    },
    {
      feature: "Custom Integrations",
      starter: "❌",
      professional: "❌",
      enterprise: "✅"
    },
    {
      feature: "Dedicated Support",
      starter: "❌",
      professional: "❌",
      enterprise: "✅"
    },
    {
      feature: "SLA Guarantee",
      starter: "❌",
      professional: "❌",
      enterprise: "99.9%"
    },
    {
      feature: "On-premise Deployment",
      starter: "❌",
      professional: "❌",
      enterprise: "✅"
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 Type II compliance with end-to-end encryption"
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "GDPR, CCPA, and international data protection compliance"
    },
    {
      icon: Users,
      title: "Access Controls",
      description: "Role-based permissions and multi-factor authentication"
    },
    {
      icon: Database,
      title: "Data Protection",
      description: "Automated backups and disaster recovery procedures"
    }
  ];

  const supportLevels = [
    {
      plan: "Starter",
      support: "Email Support",
      response: "48 hours",
      features: [
        "Email ticket system",
        "Knowledge base access",
        "Community forum",
        "Basic documentation"
      ]
    },
    {
      plan: "Professional", 
      support: "Priority Support",
      response: "24 hours",
      features: [
        "Email and chat support",
        "Priority ticket handling",
        "Phone support (business hours)",
        "Advanced documentation",
        "Video tutorials"
      ]
    },
    {
      plan: "Enterprise",
      support: "Dedicated Support",
      response: "4 hours",
      features: [
        "Dedicated customer success manager",
        "24/7 phone and email support",
        "Emergency escalation procedures",
        "Custom training sessions",
        "Quarterly business reviews"
      ]
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
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Database className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">AI Aggregator Pricing</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Simple{' '}
                <span className="text-blue-400">Transparent</span>{' '}
                Pricing
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Choose the perfect plan for your data aggregation needs. Start with our free trial 
                and scale as your business grows. No hidden fees, no surprise charges.
              </p>

              <div className="flex items-center justify-center space-x-4 mb-12">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 ${
                    plan.popular ? 'border-blue-500/50 scale-105' : 'border-gray-800'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      {plan.price === "Custom" ? (
                        <div className="text-4xl font-bold text-white">Custom</div>
                      ) : (
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-white">${plan.price}</span>
                          <span className="text-gray-400 ml-1">/{plan.period}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="border-t border-gray-700 pt-6 mb-8">
                      <div className="text-gray-400 text-sm font-medium mb-3">Limitations:</div>
                      <div className="space-y-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <div key={limitIndex} className="text-gray-500 text-sm flex items-start space-x-2">
                            <span className="text-yellow-500">•</span>
                            <span>{limitation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href={plan.name === 'Starter' ? '/get-started/free-trial' : '/get-started/contact'}>
                    <motion.button
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                          : 'border border-gray-600 text-white hover:bg-gray-800'
                      } cursor-pointer`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {plan.name === 'Starter' ? 'Start Free Trial' : plan.cta}
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Detailed Feature Comparison</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Compare all features across our pricing plans to find the perfect fit for your needs.
              </p>
            </motion.div>

            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left p-6 text-white font-semibold">Feature</th>
                      <th className="text-center p-6 text-white font-semibold">Starter</th>
                      <th className="text-center p-6 text-white font-semibold bg-blue-500/10">Professional</th>
                      <th className="text-center p-6 text-white font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                        <td className="p-6 text-gray-300">{feature.feature}</td>
                        <td className="p-6 text-center text-gray-400">{feature.starter}</td>
                        <td className="p-6 text-center text-gray-300 bg-blue-500/5">{feature.professional}</td>
                        <td className="p-6 text-center text-gray-300">{feature.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Add-on Services */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Add-on Services</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Enhance your data aggregation platform with premium services and advanced capabilities.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {addOnServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{service.name}</h3>
                      <div className="text-blue-400 font-semibold">{service.pricing}</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 mb-6">{service.description}</p>
                  
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Enterprise-Grade Security</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Your data security is our top priority. We provide enterprise-grade security 
                and compliance features across all plans.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all duration-300"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Support Levels */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Support & Success</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get the support you need to succeed with our comprehensive support offerings 
                tailored to each plan level.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {supportLevels.map((support, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{support.plan}</h3>
                    <div className="text-blue-400 font-semibold">{support.support}</div>
                    <div className="text-gray-400 text-sm">Response: {support.response}</div>
                  </div>
                  
                  <div className="space-y-3">
                    {support.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-300">
                Common questions about our pricing and platform capabilities.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "Can I change plans at any time?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we&apos;ll prorate any billing adjustments."
                },
                {
                  question: "What happens if I exceed my contact limit?",
                  answer: "We&apos;ll notify you when you approach your limit. You can either upgrade your plan or we&apos;ll temporarily expand your limit with additional charges."
                },
                {
                  question: "Do you offer volume discounts?",
                  answer: "Yes, we offer custom pricing for large organizations with significant data processing needs. Contact our sales team for a personalized quote."
                },
                {
                  question: "Is there a setup fee?",
                  answer: "No, there are no setup fees for any of our plans. You only pay the monthly subscription fee for your chosen plan."
                },
                {
                  question: "Can I cancel anytime?",
                  answer: "Yes, you can cancel your subscription at any time. Your service will continue until the end of your current billing period."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Database className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Start Aggregating Your Data?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of businesses using our AI Aggregator platform to consolidate 
                and enhance their contact data. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started/free-trial">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Start 14-Day Free Trial</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/get-started/contact">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Contact Sales
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
