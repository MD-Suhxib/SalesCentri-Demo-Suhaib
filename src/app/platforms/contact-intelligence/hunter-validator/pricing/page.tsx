'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Crown, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HunterValidatorPricingPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/hunter-validator', active: false },
    { name: 'Features', href: '/platforms/contact-intelligence/hunter-validator/features', active: false },
    { name: 'Integrations', href: '/platforms/contact-intelligence/hunter-validator/integrations', active: false },
    { name: 'Pricing', href: '/platforms/contact-intelligence/hunter-validator/pricing', active: pathname === '/platforms/contact-intelligence/hunter-validator/pricing' }
  ];

  const plans = [
    {
      name: "Starter",
      price: "Custom",
      period: "pricing",
      description: "Perfect for small teams getting started with contact validation",
      features: [
        "1,000 validations/month",
        "Real-time API access",
        "Basic email support",
        "Standard integrations",
        "95% accuracy guarantee",
        "CSV import/export"
      ],
      limitations: [
        "No phone support",
        "Standard processing speed"
      ],
      popular: false,
      cta: "Get Custom Quote"
    },
    {
      name: "Professional", 
      price: "Custom",
      period: "pricing",
      description: "Ideal for growing teams that need more validation volume and features",
      features: [
        "10,000 validations/month",
        "Priority API access",
        "Phone & email support",
        "All integrations",
        "95% accuracy guarantee",
        "Bulk processing",
        "Custom field mapping",
        "Webhook notifications",
        "Advanced analytics"
      ],
      limitations: [],
      popular: true,
      cta: "Get Custom Quote"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For large organizations with high-volume validation needs",
      features: [
        "Unlimited validations",
        "Dedicated infrastructure",
        "24/7 priority support",
        "Custom integrations",
        "99.5% accuracy SLA",
        "White-label options",
        "Custom workflows",
        "Dedicated success manager",
        "Advanced security",
        "Custom reporting",
        "On-premise deployment"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const addOns = [
    {
      name: "Phone Validation",
      description: "Validate phone numbers with carrier lookup and format verification",
      price: "$0.02",
      unit: "per validation"
    },
    {
      name: "Lead Enrichment",
      description: "Enhance contacts with additional data points like company info and social profiles", 
      price: "$0.05",
      unit: "per contact"
    },
    {
      name: "Dedicated IP",
      description: "Get your own dedicated IP address for improved deliverability and reputation",
      price: "$200",
      unit: "per month"
    },
    {
      name: "Priority Support",
      description: "Get priority technical support with guaranteed response times",
      price: "$500",
      unit: "per month"
    }
  ];

  const frequentlyAsked = [
    {
      question: "How does the accuracy guarantee work?",
      answer: "We guarantee 95% accuracy on all email validations. If your accuracy rate falls below 95%, we&apos;ll provide credits for the difference or investigate and resolve any issues."
    },
    {
      question: "Can I upgrade or downgrade my plan anytime?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle. Unused validations don&apos;t roll over to the next month."
    },
    {
      question: "What happens if I exceed my monthly limit?",
      answer: "If you exceed your monthly validation limit, we&apos;ll automatically charge for additional validations at your plan&apos;s overage rate. You&apos;ll receive notifications before reaching your limit."
    },
    {
      question: "Do you offer custom enterprise pricing?",
      answer: "Yes, we offer custom pricing for enterprise customers with high-volume needs, special requirements, or multiple integrations. Contact our sales team for a personalized quote."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, all plans come with a 14-day free trial that includes 100 free validations so you can test our accuracy and features before committing to a paid plan."
    }
  ];

  const comparisonFeatures = [
    { feature: "Monthly Validations", starter: "1,000", professional: "10,000", enterprise: "Unlimited" },
    { feature: "API Access", starter: "✓", professional: "✓ Priority", enterprise: "✓ Dedicated" },
    { feature: "Support", starter: "Email", professional: "Phone + Email", enterprise: "24/7 Dedicated" },
    { feature: "Integrations", starter: "Standard", professional: "All", enterprise: "Custom" },
    { feature: "Accuracy SLA", starter: "95%", professional: "95%", enterprise: "99.5%" },
    { feature: "Processing Speed", starter: "Standard", professional: "Fast", enterprise: "Instant" },
    { feature: "Bulk Operations", starter: "✗", professional: "✓", enterprise: "✓ Advanced" },
    { feature: "Custom Workflows", starter: "✗", professional: "Basic", enterprise: "✓ Full" },
    { feature: "White Label", starter: "✗", professional: "✗", enterprise: "✓" },
    { feature: "Dedicated Manager", starter: "✗", professional: "✗", enterprise: "✓" }
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
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Crown className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Transparent Pricing</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Choose Your{' '}
                <span className="text-blue-400">Validation Plan</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Flexible pricing plans designed to scale with your business. Start with our free trial 
                and upgrade as your contact validation needs grow.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">14-day</div>
                  <div className="text-gray-400 text-sm">Free Trial</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">95%</div>
                  <div className="text-gray-400 text-sm">Accuracy SLA</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
                  <div className="text-gray-400 text-sm">Setup Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border rounded-2xl p-8 ${
                    plan.popular 
                      ? 'border-blue-500/50 shadow-2xl shadow-blue-500/20' 
                      : 'border-gray-800 hover:border-blue-500/30'
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      {plan.price === "Custom" ? (
                        <div className="text-3xl font-bold text-blue-400">Custom</div>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-white">${plan.price}</span>
                          <span className="text-gray-400">/{plan.period}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full border border-gray-600 flex-shrink-0"></div>
                        <span className="text-gray-500 text-sm line-through">{limitation}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                        : 'border border-gray-600 text-white hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.cta}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Detailed Plan Comparison</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Compare features across all plans to find the perfect fit for your team&apos;s needs.
              </p>
            </motion.div>

            <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-6 text-white font-semibold">Features</th>
                      <th className="text-center p-6 text-white font-semibold">Starter</th>
                      <th className="text-center p-6 text-white font-semibold relative">
                        Professional
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Popular</div>
                        </div>
                      </th>
                      <th className="text-center p-6 text-white font-semibold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((row, index) => (
                      <tr key={index} className="border-b border-gray-800/50">
                        <td className="p-6 text-gray-300">{row.feature}</td>
                        <td className="p-6 text-center text-gray-400">{row.starter}</td>
                        <td className="p-6 text-center text-gray-400 bg-blue-500/5">{row.professional}</td>
                        <td className="p-6 text-center text-gray-400">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Optional Add-ons</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Enhance your plan with additional services and premium features.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {addOns.map((addon, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{addon.name}</h3>
                      <p className="text-gray-400 text-sm">{addon.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">{addon.price}</div>
                      <div className="text-gray-400 text-xs">{addon.unit}</div>
                    </div>
                  </div>
                  
                  <motion.button
                    className="w-full border border-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Plan
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-gray-900/30">
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
                Get answers to common questions about our pricing and plans.
              </p>
            </motion.div>

            <div className="space-y-6">
              {frequentlyAsked.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Zap className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Improve Your Contact Quality?
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Start your free trial today and see how Hunter & Validator can reduce your bounce rates 
                and improve your email deliverability in just minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Start Free Trial - 100 Validations</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Contact Sales Team
                </motion.button>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Cancel anytime</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
