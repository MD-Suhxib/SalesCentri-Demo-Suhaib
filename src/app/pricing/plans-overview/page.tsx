'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, Users, Building, Zap, ArrowRight, Calculator, Shield, Gift } from 'lucide-react';
import { useCurrency } from '@/app/hooks/useCurrency';
import { convertPrice, formatCurrency, type ExchangeRates } from '@/app/lib/currency';

export default function PlansOverviewPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [planType, setPlanType] = useState<'personal' | 'business'>('personal');
  
  // Currency detection and exchange rates
  const { currency } = useCurrency();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);

  // Fetch exchange rates
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await fetch('/api/exchange-rates', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch exchange rates');
        const data = await response.json();
        if (mounted) {
          setExchangeRates(data.rates);
        }
      } catch (err) {
        console.error('Failed to fetch exchange rates:', err);
        if (mounted) {
          setExchangeRates({ INR: 83.0, GBP: 0.79 });
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const personalPlans = [
    {
      name: 'Free',
      description: 'Perfect for individuals getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      icon: Gift,
      features: [
        '100 AI searches per month',
        '500 contact validations',
        'Basic CRM integrations',
        'Community support',
        'Standard analytics',
        'Mobile app access'
      ],
      limitations: [
        'Limited features',
        'No priority support',
        'No custom workflows'
      ],
      cta: 'Get Started Free',
      href: '/solutions/psa-suite-one-stop-solution',
      color: 'from-cyan-400 to-blue-400'
    },
    {
      name: 'Starter',
      description: 'Great for freelancers and small teams',
      monthlyPrice: 29,
      annualPrice: 23,
      popular: false,
      icon: Users,
      features: [
        '1,000 AI searches per month',
        '5,000 contact validations',
        'All CRM integrations',
        'Email support',
        'Standard analytics',
        'Up to 3 team members',
        'Mobile app access',
        'Basic automation'
      ],
      limitations: [
        'No custom workflows',
        'Limited API access',
        'Standard support only'
      ],
      cta: 'Start Free Trial',
      href: '/solutions/psa-suite-one-stop-solution'
    },
    {
      name: 'Professional',
      description: 'Advanced features for growing professionals',
      monthlyPrice: 79,
      annualPrice: 63,
      popular: true,
      icon: Building,
      features: [
        '10,000 AI searches per month',
        '25,000 contact validations',
        'All CRM integrations',
        'Priority support',
        'Advanced analytics',
        'Up to 5 team members',
        'Mobile app access',
        'Advanced automation',
        'Custom workflows',
        'API access',
        'Lead scoring',
        'Team collaboration tools'
      ],
      limitations: [
        'Limited white-label options'
      ],
      cta: 'Start Free Trial',
      href: '/solutions/psa-suite-one-stop-solution'
    },
    {
      name: 'Premium',
      description: 'Maximum power for serious professionals',
      monthlyPrice: 149,
      annualPrice: 119,
      popular: false,
      icon: Zap,
      features: [
        '50,000 AI searches per month',
        '100,000 contact validations',
        'All CRM integrations',
        'Priority support',
        'Advanced analytics',
        'Up to 10 team members',
        'Mobile app access',
        'Enterprise automation',
        'Custom workflows',
        'Full API access',
        'Advanced lead scoring',
        'Team collaboration tools',
        'White-label options',
        'Custom training'
      ],
      limitations: [],
      cta: 'Start Free Trial',
      href: '/solutions/psa-suite-one-stop-solution'
    }
  ];

  const businessPlans = [
    {
      name: 'Free',
      description: 'Perfect for small businesses getting started',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      icon: Gift,
      features: [
        '500 AI searches per month',
        '1,000 contact validations',
        'Basic CRM integrations',
        'Community support',
        'Standard analytics',
        'Up to 3 team members',
        'Mobile app access'
      ],
      limitations: [
        'Limited features',
        'No priority support',
        'No custom workflows'
      ],
      cta: 'Get Started Free',
      href: '/solutions/psa-suite-one-stop-solution',
      color: 'from-cyan-400 to-blue-400'
    },
    {
      name: 'Starter',
      description: 'Great for growing businesses',
      monthlyPrice: 99,
      annualPrice: 79,
      popular: false,
      icon: Users,
      features: [
        '5,000 AI searches per month',
        '25,000 contact validations',
        'All CRM integrations',
        'Email support',
        'Standard analytics',
        'Up to 10 team members',
        'Mobile app access',
        'Basic automation'
      ],
      limitations: [
        'No custom workflows',
        'Limited API access',
        'Standard support only'
      ],
      cta: 'Start Free Trial',
      href: '/solutions/psa-suite-one-stop-solution'
    },
    {
      name: 'Premium',
      description: 'Advanced features for established businesses',
      monthlyPrice: 299,
      annualPrice: 239,
      popular: true,
      icon: Building,
      features: [
        '25,000 AI searches per month',
        '100,000 contact validations',
        'All CRM integrations',
        'Priority support',
        'Advanced analytics',
        'Up to 25 team members',
        'Mobile app access',
        'Advanced automation',
        'Custom workflows',
        'API access',
        'Lead scoring',
        'Team collaboration tools'
      ],
      limitations: [
        'Limited white-label options'
      ],
      cta: 'Start Free Trial',
      href: '/solutions/psa-suite-one-stop-solution'
    },
    {
      name: 'Enterprise',
      description: 'Unlimited power for large organizations',
      monthlyPrice: 'Custom',
      annualPrice: 'Custom',
      popular: false,
      icon: Zap,
      features: [
        'Unlimited AI searches',
        'Unlimited contact validations',
        'All integrations + custom',
        '24/7 dedicated support',
        'Enterprise analytics',
        'Unlimited team members',
        'Mobile app access',
        'Enterprise automation',
        'Custom workflows',
        'Full API access',
        'Advanced lead scoring',
        'Team collaboration tools',
        'White-label options',
        'Custom training',
        'Dedicated account manager',
        'SLA guarantees'
      ],
      limitations: [],
      cta: 'Contact Sales',
      href: '/pricing/enterprise-custom'
    }
  ];

  const plans = planType === 'personal' ? personalPlans : businessPlans;

  const addOns = [
    {
      name: 'Additional Searches',
      description: '10,000 extra AI searches per month',
      price: 49
    },
    {
      name: 'Premium Support',
      description: '24/7 phone and chat support',
      price: 99
    },
    {
      name: 'Custom Integrations',
      description: 'Dedicated integration development',
      price: 299
    },
    {
      name: 'Advanced Training',
      description: 'Personalized team training sessions',
      price: 199
    }
  ];

  const comparisonFeatures = [
    {
      category: 'Core Features',
      features: [
        {
          name: 'AI-Powered Search',
          free: planType === 'personal' ? '100/month' : '500/month',
          starter: planType === 'personal' ? '1,000/month' : '5,000/month',
          professional: planType === 'personal' ? '10,000/month' : '25,000/month',
          premium: planType === 'personal' ? '50,000/month' : '100,000/month',
          enterprise: 'Unlimited'
        },
        {
          name: 'Contact Validation',
          free: planType === 'personal' ? '500/month' : '1,000/month',
          starter: planType === 'personal' ? '5,000/month' : '25,000/month',
          professional: planType === 'personal' ? '25,000/month' : '100,000/month',
          premium: planType === 'personal' ? '100,000/month' : '100,000/month',
          enterprise: 'Unlimited'
        },
        {
          name: 'Team Members',
          free: planType === 'personal' ? '1' : '3',
          starter: planType === 'personal' ? '3' : '10',
          professional: planType === 'personal' ? '5' : '25',
          premium: planType === 'personal' ? '10' : '25',
          enterprise: 'Unlimited'
        },
        {
          name: 'CRM Integrations',
          free: 'Basic',
          starter: 'All',
          professional: 'All',
          premium: 'All',
          enterprise: 'All + Custom'
        }
      ]
    },
    {
      category: 'Analytics & Reporting',
      features: [
        {
          name: 'Standard Reports',
          free: true,
          starter: true,
          professional: true,
          premium: true,
          enterprise: true
        },
        {
          name: 'Advanced Analytics',
          free: false,
          starter: false,
          professional: true,
          premium: true,
          enterprise: true
        },
        {
          name: 'Custom Dashboards',
          free: false,
          starter: false,
          professional: true,
          premium: true,
          enterprise: true
        },
        {
          name: 'Real-time Insights',
          free: false,
          starter: false,
          professional: false,
          premium: false,
          enterprise: true
        }
      ]
    },
    {
      category: 'Support & Training',
      features: [
        {
          name: 'Email Support',
          free: false,
          starter: true,
          professional: true,
          premium: true,
          enterprise: true
        },
        {
          name: 'Priority Support',
          free: false,
          starter: false,
          professional: true,
          premium: true,
          enterprise: true
        },
        {
          name: '24/7 Dedicated Support',
          free: false,
          starter: false,
          professional: false,
          premium: false,
          enterprise: true
        },
        {
          name: 'Dedicated Account Manager',
          free: false,
          starter: false,
          professional: false,
          premium: false,
          enterprise: true
        }
      ]
    }
  ];

  const savings = (monthlyPrice: number, annualPrice: number) => {
    const monthlyCost = monthlyPrice * 12;
    const annualCost = annualPrice * 12;
    const saved = monthlyCost - annualCost;
    const percentage = Math.round((saved / monthlyCost) * 100);
    return { saved, percentage };
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-section">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                <span className="text-blue-400">Upgrade</span> Your Plan
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Choose the perfect plan for your needs. Start free, upgrade or downgrade anytime.
              </p>
              
              {/* Plan Type Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className={`text-lg font-semibold ${planType === 'personal' ? 'text-blue-400' : 'text-gray-400'}`}>
                  Personal
                </span>
                <button
                  onClick={() => setPlanType(planType === 'personal' ? 'business' : 'personal')}
                  className="relative w-16 h-8 bg-gray-700 rounded-full transition-colors duration-300"
                >
                  <div className={`absolute top-1 w-6 h-6 bg-blue-500 rounded-full transition-transform duration-300 ${
                    planType === 'business' ? 'translate-x-9' : 'translate-x-1'
                  }`} />
                </button>
                <span className={`text-lg font-semibold ${planType === 'business' ? 'text-blue-400' : 'text-gray-400'}`}>
                  Business
                </span>
              </div>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    billingCycle === 'monthly'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('annual')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                    billingCycle === 'annual'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Annual
                </button>
                {billingCycle === 'annual' && (
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold">
                    Save up to 20%
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-6">
              {plans.map((plan, index) => {
                const basePrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
                // Convert price if we have exchange rates and base price is numeric
                const currentPrice = typeof basePrice === 'number' && basePrice > 0 && exchangeRates && currency !== 'USD'
                  ? convertPrice(basePrice, 'USD', currency, exchangeRates)
                  : basePrice;
                const savingsData = typeof plan.monthlyPrice === 'number' && typeof plan.annualPrice === 'number' 
                  ? savings(plan.monthlyPrice, plan.annualPrice)
                  : { saved: 0, percentage: 0 };
                
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className={`relative bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-6 flex flex-col ${
                      plan.popular 
                        ? 'border-blue-500 scale-105' 
                        : 'border-gray-700/50'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center`}>
                          <plan.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      </div>
                      <p className="text-gray-400 mb-4 text-sm h-12">{plan.description}</p>
                      
                      <div className="mb-6">
                        <div className="flex items-baseline">
                          <span className="text-4xl font-bold text-white">
                            {currentPrice === 0 ? 'Free' : (typeof currentPrice === 'number' ? formatCurrency(currentPrice, currency) : 'Custom')}
                          </span>
                          {currentPrice !== 0 && typeof currentPrice === 'number' && <span className="text-gray-400 ml-2">/month</span>}
                        </div>
                        
                        {billingCycle === 'annual' && typeof plan.monthlyPrice === 'number' && typeof plan.annualPrice === 'number' && plan.annualPrice > 0 && (
                          <div className="text-blue-400 text-sm mt-1">
                            Save {formatCurrency(savingsData.saved, currency)} per year ({savingsData.percentage}% off)
                          </div>
                        )}
                      </div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.slice(0, 4).map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto">
                      <Link
                        href={plan.href}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-2xl hover:shadow-blue-500/30'
                            : plan.name === 'Free'
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-white hover:shadow-lg hover:shadow-cyan-400/25'
                            : 'border border-blue-500/30 text-blue-300 hover:bg-blue-500/10'
                        }`}
                      >
                        {plan.cta}
                        {plan.name !== 'Enterprise' && <ArrowRight className="w-4 h-4" />}
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Optional Add-ons</h2>
              <p className="text-xl text-gray-300">Enhance your plan with additional features</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {addOns.map((addon, index) => {
                const addonPrice = exchangeRates && currency !== 'USD'
                  ? convertPrice(addon.price, 'USD', currency, exchangeRates)
                  : addon.price;
                return (
                  <motion.div
                    key={addon.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-white">{addon.name}</h3>
                      <span className="text-blue-400 font-bold">{formatCurrency(addonPrice, currency)}/mo</span>
                    </div>
                    <p className="text-gray-400">{addon.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Feature Comparison</h2>
              <p className="text-xl text-gray-300">See what&apos;s included in each plan</p>
            </motion.div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-6 items-center p-4 border-b border-gray-700/50 bg-gray-800/50">
                <div className="text-gray-300 font-semibold">Feature</div>
                <div className="text-center text-gray-300 font-semibold">Free</div>
                <div className="text-center text-gray-300 font-semibold">Starter</div>
                <div className="text-center text-gray-300 font-semibold">Professional</div>
                <div className="text-center text-gray-300 font-semibold">Premium</div>
                <div className="text-center text-gray-300 font-semibold">Enterprise</div>
              </div>
              
              {comparisonFeatures.map((category, categoryIndex) => (
                <div key={category.category}>
                  {categoryIndex > 0 && <div className="border-t border-gray-700/50" />}
                  
                  <div className="bg-gray-800/50 p-4">
                    <h3 className="text-lg font-bold text-white">{category.category}</h3>
                  </div>
                  
                  {category.features.map((feature) => (
                    <div key={feature.name} className="grid grid-cols-6 items-center p-4 border-t border-gray-700/50">
                      <div className="text-gray-300">{feature.name}</div>
                      <div className="text-center">
                        {typeof feature.free === 'boolean' ? (
                          feature.free ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-300">{feature.free}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-300">{feature.starter}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.professional === 'boolean' ? (
                          feature.professional ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-300">{feature.professional}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.premium === 'boolean' ? (
                          feature.premium ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-300">{feature.premium}</span>
                        )}
                      </div>
                      <div className="text-center">
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? (
                            <Check className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-gray-300">{feature.enterprise}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/30 rounded-2xl p-8 text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <Calculator className="w-8 h-8 text-blue-400" />
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Need Help Choosing?</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Not sure which plan is right for you? Try our ROI calculator or speak with our sales team for personalized recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/roi-calculator"
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  Calculate ROI
                  <Calculator className="w-5 h-5" />
                </Link>
                <Link
                  href="/get-started/contact/general-questions"
                  className="border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Talk to Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}
