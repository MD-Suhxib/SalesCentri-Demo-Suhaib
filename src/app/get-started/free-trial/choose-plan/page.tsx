'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { usePricingData } from '@/app/hooks/usePricingData';

export default function ChoosePlanPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [planType, setPlanType] = useState<'personal' | 'business'>('personal');
  const { data: pricingData, loading, error } = usePricingData();

  // Fallback plans (same as pricing page)
  const fallbackPersonalPlans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for individuals getting started',
      features: [
        '100 AI Hunter searches/month',
        '500 contact validations',
        'Basic SalesGPT conversations',
        'Community support',
        'Standard integrations'
      ],
      limitations: ['Limited features', 'No priority support'],
      popular: false,
      color: 'from-cyan-400 to-blue-400',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      id: 'starter',
      name: 'Starter',
      price: { monthly: 29, yearly: 23 },
      description: 'Great for freelancers and small teams',
      features: [
        '1,000 AI Hunter searches/month',
        '5,000 contact validations',
        'Advanced SalesGPT conversations',
        'Email support',
        'All integrations',
        'Basic analytics'
      ],
      limitations: ['No custom integrations', 'Limited advanced features'],
      popular: false,
      color: 'from-blue-500 to-blue-600',
      gradient: 'from-blue-600/20 to-blue-700/20',
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 79, yearly: 63 },
      description: 'Advanced features for growing professionals',
      features: [
        '10,000 AI Hunter searches/month',
        '25,000 contact validations',
        'Advanced SalesGPT with custom prompts',
        'Priority support',
        'All integrations',
        'Custom workflows',
        'Analytics dashboard',
        'Up to 5 team members'
      ],
      limitations: [],
      popular: true,
      color: 'from-purple-500 to-blue-600',
      gradient: 'from-purple-600/20 to-blue-600/20',
    },
    {
      id: 'payg',
      name: 'Pay-As-You-Go',
      price: 'Flexible',
      description: 'Only pay for what you use. No monthly commitment.',
      features: [
        'Contact Validator: $0.00494 per validation (first 100 free)',
        'No monthly minimums',
        'Access to all integrations',
        'Basic analytics',
        'Community support'
      ],
      limitations: ['No advanced SalesGPT features', 'No priority support'],
      popular: false,
      color: 'from-green-400 to-blue-400',
      gradient: 'from-green-500/20 to-blue-500/20',
    }
  ];

  const fallbackBusinessPlans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for small businesses getting started',
      features: [
        '500 AI Hunter searches/month',
        '1,000 contact validations',
        'Basic SalesGPT conversations',
        'Community support',
        'Standard integrations',
        'Up to 3 team members'
      ],
      limitations: ['Limited features', 'No priority support'],
      popular: false,
      color: 'from-cyan-400 to-blue-400',
      gradient: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      id: 'payg',
      name: 'Pay-As-You-Go',
      price: 'Flexible',
      description: 'Only pay for what you use. No monthly commitment.',
      features: [
        'Contact Validator: $0.00494 per validation (first 500 free)',
        'No monthly minimums',
        'Access to all integrations',
        'Basic analytics',
        'Up to 10 team members',
        'Community support'
      ],
      limitations: ['No advanced SalesGPT features', 'No priority support'],
      popular: false,
      color: 'from-green-400 to-blue-400',
      gradient: 'from-green-500/20 to-blue-500/20',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 299, yearly: 239 },
      description: 'Advanced features for established businesses',
      features: [
        '25,000 AI Hunter searches/month',
        '100,000 contact validations',
        'Advanced SalesGPT with custom prompts',
        'Priority support',
        'All integrations',
        'Custom workflows',
        'Advanced analytics',
        'Up to 25 team members',
        'API access',
      ],
      limitations: [],
      popular: true,
      color: 'from-purple-500 to-blue-600',
      gradient: 'from-purple-600/20 to-blue-600/20',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'Unlimited power for large organizations',
      features: [
        'Unlimited AI Hunter searches',
        'Unlimited contact validations',
        'Enterprise SalesGPT with custom training',
        'Dedicated account manager',
        'Custom integrations & API access',
        'Advanced analytics & white-label',
        'SLA guarantee & phone support',
        'On-premise deployment options',
        'Unlimited team members',
        'Custom training & onboarding'
      ],
      limitations: [],
      popular: false,
      color: 'from-indigo-500 to-indigo-600',
      gradient: 'from-indigo-600/20 to-indigo-700/20',
    }
  ];

  const plans = useMemo(() => {
    const segment = planType === 'personal' ? 'personal' : 'business';
    const cycle = billingPeriod === 'yearly' ? 'yearly' : 'monthly';
    const filtered = pricingData.filter((p: any) =>
      String(p.segment || '').toLowerCase() === segment &&
      String(p.billingCycle || '').toLowerCase() === cycle
    );

    const dynamicPlans = filtered.map((p: any, idx: number) => {
      const name: string = p.planName ?? `Plan ${idx + 1}`;
      const description: string = p.tagline || '';
      const price = typeof p.price === 'number' ? p.price : String(p.price || 'Flexible');
      const features: string[] = [
        p.aiHunterSearches ? `${p.aiHunterSearches} AI Hunter searches/month` : null,
        p.contactValidations ? `${p.contactValidations} contact validations/month` : null,
        p.credits ? `${p.credits} credits` : null,
        ...(Array.isArray(p.features) ? p.features : []),
      ].filter(Boolean) as string[];

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const popular = /professional|premium/i.test(name);
      const color = popular ? 'from-purple-500 to-blue-600' : 'from-blue-500 to-blue-600';
      const gradient = popular ? 'from-purple-600/20 to-blue-600/20' : 'from-blue-600/20 to-blue-700/20';

      // Update CTA based on plan name
      let ctaText = 'Start Free Trial';
      if (name.toLowerCase().includes('free')) {
        ctaText = 'Start Free Trial';
      } else if (name.toLowerCase().includes('pay') && name.toLowerCase().includes('go')) {
        ctaText = 'Start Now';
      } else if (name.toLowerCase().includes('enterprise')) {
        ctaText = 'Contact Sales';
      }

      return {
        id: slug,
        name,
        price,
        description,
        features,
        limitations: [],
        popular,
        color,
        gradient,
        ctaText,
      };
    });

    // Use fallback if no dynamic plans available
    if (dynamicPlans.length === 0) {
      return planType === 'personal' ? fallbackPersonalPlans : fallbackBusinessPlans;
    }

    return dynamicPlans;
  }, [pricingData, planType, billingPeriod]);

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 sm:px-12 lg:px-32 hero-section">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">14-Day Free Trial</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                  Choose Your
                </span>{" "}
                <span className="text-white">Plan</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Start your 14-day free trial with any plan. No credit card required. 
                <span className="text-blue-400 font-semibold"> Upgrade, downgrade, or cancel anytime.</span>
              </p>
              
              {/* Plan Type Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-lg font-semibold transition-colors duration-300 ${planType === 'personal' ? 'text-blue-400' : 'text-gray-400'}`}>
                  Personal
                </span>
                <button
                  onClick={() => setPlanType(planType === 'personal' ? 'business' : 'personal')}
                  aria-label="Toggle plan type"
                  className="relative w-16 h-8 bg-gray-800 rounded-full transition-colors duration-300 border border-gray-700 hover:border-blue-500/50"
                >
                  <div className={`absolute top-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-transform duration-300 shadow-lg ${
                    planType === 'business' ? 'translate-x-9' : 'translate-x-1'
                  }`} />
                </button>
                <span className={`text-lg font-semibold transition-colors duration-300 ${planType === 'business' ? 'text-blue-400' : 'text-gray-400'}`}>
                  Business
                </span>
              </div>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  aria-label="Select monthly billing"
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border ${
                    billingPeriod === 'monthly'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                      : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  aria-label="Select yearly billing"
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 border ${
                    billingPeriod === 'yearly'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                      : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600'
                  }`}
                >
                  Yearly
                </button>
                {billingPeriod === 'yearly' && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Save 20%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="pb-24 px-6 sm:px-12 lg:px-32">
          <div className="max-w-7xl mx-auto">
            {loading && (
              <div className="text-center text-gray-300 py-12">
                Loading pricing plans...
              </div>
            )}
            {error && (
              <div className="text-center text-red-400 py-12">
                {error}
              </div>
            )}
            {!loading && !error && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {plans.length === 0 && (
                  <div className="col-span-full text-center text-gray-300">
                    No pricing data available. Please try again later.
                  </div>
                )}
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-500/25 backdrop-blur-sm border border-blue-400/30">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <motion.div
                      className={`relative bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-500 h-full flex flex-col group-hover:scale-105 ${
                        plan.popular
                          ? "border-blue-500/50 shadow-2xl shadow-blue-500/20 bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90"
                          : "border-gray-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
                      }`}
                      whileHover={{ y: -8 }}
                      style={{
                        background: plan.popular 
                          ? `linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(0, 0, 0, 0.95) 50%, rgba(17, 24, 39, 0.9) 100%)`
                          : `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(0, 0, 0, 0.9) 50%, rgba(17, 24, 39, 0.8) 100%)`
                      }}
                    >
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-20 rounded-2xl`}></div>
                      
                      <div className="relative z-10 flex-grow">
                        <div className="mb-6">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                            {plan.name}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {plan.description}
                          </p>
                        </div>

                        <div className="mb-8">
                          <div className="flex items-baseline mb-2">
                            {typeof plan.price === 'number' ? (
                              <>
                                <span className="text-3xl md:text-4xl font-bold text-white">{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                                {plan.price !== 0 && (
                                  <span className="text-gray-400 ml-2 text-lg">/month</span>
                                )}
                              </>
                            ) : typeof plan.price === 'object' && plan.price !== null ? (
                              <>
                                <span className="text-3xl md:text-4xl font-bold text-white">
                                  ${billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly}
                                </span>
                                <span className="text-gray-400 ml-2 text-lg">/month</span>
                              </>
                            ) : (
                              <span className="text-3xl md:text-4xl font-bold text-white">{plan.price}</span>
                            )}
                          </div>
                          {typeof plan.price === 'object' && plan.price !== null && billingPeriod === 'yearly' && (
                            <p className="text-sm text-green-400 font-medium">
                              You're saving 20% with annual billing!
                            </p>
                          )}
                        </div>

                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-3">
                              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="relative z-10 mt-auto">
                        <Link
                          href={`/checkout?segment=${planType === 'personal' ? 'Personal' : 'Business'}&cycle=${billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'}&plan=${encodeURIComponent(plan.name)}`}
                          className="block w-full"
                        >
                          <motion.button
                            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 cursor-pointer text-base ${
                              plan.popular
                                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                                : "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/30 hover:text-white"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {plan.ctaText || 'Start Free Trial'}
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-24 px-6 sm:px-12 lg:px-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm text-center"
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Need help choosing a plan?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Talk to our sales team for personalized recommendations and enterprise pricing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/get-started/free-trial/account-setup"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  Continue to Account Setup
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-600 text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Book a Demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
