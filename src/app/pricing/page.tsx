'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Star,  Sparkles } from 'lucide-react';
import { getAuthHeaders } from '../lib/auth';
import { usePricingData } from '@/app/hooks/usePricingData';
import { useCurrency } from '@/app/hooks/useCurrency';
import { convertPrice, formatCurrency, type ExchangeRates } from '@/app/lib/currency';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [segment, setSegment] = useState<'personal' | 'business' | 'funnel-level'>('personal');
  const [funnelLevel, setFunnelLevel] = useState<'TOFU' | 'MOFU' | 'BOFU' | null>(null);
  const { data: pricingData, updatedAt, loading, error } = usePricingData();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  
  // Currency detection and exchange rates
  const { currency } = useCurrency();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);

  // Auto-select TOFU when switching to funnel-level segment
  useEffect(() => {
    if (segment === 'funnel-level' && !funnelLevel) {
      setFunnelLevel('TOFU');
    } else if (segment !== 'funnel-level') {
      setFunnelLevel(null);
    }
  }, [segment]); // Only depend on segment, not funnelLevel to avoid race conditions

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
        // Use fallback rates
        if (mounted) {
          setExchangeRates({ INR: 83.0, GBP: 0.79 });
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Debug: Log currency and exchange rates when they change
  useEffect(() => {
    if (currency && exchangeRates) {
      console.log('[PricingPage] Currency detected:', currency, 'Exchange rates:', exchangeRates);
      if (currency === 'USD') {
        console.log('[PricingPage] Currency is USD - prices will not be converted. To test conversion, geolocation must detect INR or GBP.');
      } else {
        console.log('[PricingPage] Currency is', currency, '- prices will be converted from USD');
      }
    }
  }, [currency, exchangeRates]);

  // Check authentication to control visibility of Upload button
  useEffect(() => {
    (async () => {
      try {
        const headers = getAuthHeaders();
        if (!('Authorization' in headers)) {
          setAuthChecked(true);
          return;
        }
        const res = await fetch('https://app.demandintellect.com/app/api/profile.php', {
          method: 'GET',
          headers: { ...(headers as any), 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
        if (res.status !== 200) {
          setAuthChecked(true);
          return;
        }
        // Allow all authenticated users to see upload button
        setIsAdmin(true);
      } catch {
        // ignore and treat as non-authenticated
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  // Fallback plans (original hardcoded content)
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
      link: '/solutions/psa-suite-one-stop-solution'
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
      link: '/solutions/psa-suite-one-stop-solution'
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
      link: '/solutions/psa-suite-one-stop-solution'
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
      link: '/solutions/psa-suite-one-stop-solution'
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
      link: '/solutions/psa-suite-one-stop-solution'
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
      link: '/solutions/psa-suite-one-stop-solution'
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
      link: '/solutions/psa-suite-one-stop-solution'
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
      link: '/pricing/enterprise-custom'
    }
  ];

  const plans = useMemo(() => {
    const cycle = billingPeriod === 'yearly' ? 'yearly' : 'monthly';
    let filtered: any[] = [];

    if (segment === 'funnel-level') {
      // Filter for funnel level models
      // Use TOFU as default if funnelLevel is not set yet (during initial render)
      const activeFunnelLevel = funnelLevel || 'TOFU';
      filtered = pricingData.filter((p: any) =>
        String(p.segment || '').toLowerCase() === 'funnel level' &&
        String(p.funnelLevel || '').toUpperCase() === activeFunnelLevel &&
        String(p.billingCycle || '').toLowerCase() === cycle
      );
    } else {
      // Filter for Personal/Business plans (existing logic)
      filtered = pricingData.filter((p: any) =>
        String(p.segment || '').toLowerCase() === segment &&
        String(p.billingCycle || '').toLowerCase() === cycle
      );
    }

    const dynamicPlans = filtered.map((p: any, idx: number) => {
      // Handle funnel-level models differently
      if (segment === 'funnel-level' && p.leadGenName) {
        const name: string = p.leadGenName;
        const description: string = p.tagline || p.type || '';
        const basePrice = typeof p.minimumPrice === 'number' ? p.minimumPrice : (typeof p.price === 'number' ? p.price : null);
        
        // Convert price if we have exchange rates and base price is numeric
        let price: number | string;
        if (basePrice !== null && typeof basePrice === 'number' && currency !== 'USD') {
          // Use exchange rates if available, otherwise use fallback rates
          const rates = exchangeRates || { INR: 83.0, GBP: 0.79 };
          price = convertPrice(basePrice, 'USD', currency, rates);
        } else if (basePrice !== null && typeof basePrice === 'number') {
          price = basePrice;
        } else {
          price = String(p.price || p.minimumPrice || 'Flexible');
        }
        
        const priceDisplay = typeof price === 'number' 
          ? formatCurrency(price, currency)
          : price;
        
        const features: string[] = [
          p.type ? `Type: ${p.type}` : null,
          `Minimum Price: ${priceDisplay}`,
          ...(Array.isArray(p.features) ? p.features : []),
        ].filter(Boolean) as string[];

        const slug = `${p.funnelLevel}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const popular = false; // Can customize based on model if needed
        const color = p.funnelLevel === 'TOFU' ? 'from-green-500 to-emerald-600' : 
                      p.funnelLevel === 'MOFU' ? 'from-blue-500 to-indigo-600' : 
                      'from-purple-500 to-pink-600';
        const gradient = p.funnelLevel === 'TOFU' ? 'from-green-500/20 to-emerald-600/20' : 
                         p.funnelLevel === 'MOFU' ? 'from-blue-500/20 to-indigo-600/20' : 
                         'from-purple-500/20 to-pink-600/20';

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
          ctaText: 'Book Demo',
          link: process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled',
          funnelLevel: p.funnelLevel,
          type: p.type,
          leadGenName: p.leadGenName,
          isFunnelLevel: true,
        };
      }

      // Handle Personal/Business plans (existing logic)
      const name: string = p.planName ?? `Plan ${idx + 1}`;
      const description: string = p.tagline || '';
      const basePrice = typeof p.price === 'number' ? p.price : null;
      
      // Convert price if we have exchange rates and base price is numeric
      let price: number | string;
      if (basePrice !== null && typeof basePrice === 'number' && currency !== 'USD') {
        // Use exchange rates if available, otherwise use fallback rates
        const rates = exchangeRates || { INR: 83.0, GBP: 0.79 };
        const converted = convertPrice(basePrice, 'USD', currency, rates);
        console.log(`[PricingPage] Converting ${name}: $${basePrice} USD -> ${formatCurrency(converted, currency)}`);
        price = converted;
      } else if (basePrice !== null && typeof basePrice === 'number') {
        price = basePrice;
      } else {
        price = String(p.price || 'Flexible');
      }
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
      let ctaText = 'Subscribe';
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
        link: '/solutions/psa-suite-one-stop-solution',
      };
    });

    // Add Enterprise card to all funnel levels
    if (segment === 'funnel-level') {
      const activeFunnelLevel = funnelLevel || 'TOFU';
      const enterprisePlan = fallbackBusinessPlans.find(p => p.id === 'enterprise');
      if (enterprisePlan) {
        dynamicPlans.push({
          id: `enterprise-${activeFunnelLevel.toLowerCase()}`,
          name: enterprisePlan.name,
          price: enterprisePlan.price,
          description: enterprisePlan.description,
          features: enterprisePlan.features,
          limitations: enterprisePlan.limitations,
          popular: enterprisePlan.popular,
          color: enterprisePlan.color,
          gradient: enterprisePlan.gradient,
          ctaText: 'Book Demo',
          link: process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled',
          funnelLevel: activeFunnelLevel,
          type: 'Enterprise',
          leadGenName: 'Enterprise',
          isFunnelLevel: true,
        });
      }
    }

    const sortedPlans = [...dynamicPlans].sort((a, b) => {
      const normalizePrice = (plan: typeof a) => {
        if (typeof plan.price === 'number') {
          return { value: plan.price, isNumeric: true };
        }
        // Treat non-numeric prices like "Flexible" or "Custom" as infinitely large for sorting purposes
        return { value: Number.POSITIVE_INFINITY, isNumeric: false };
      };

      const aPrice = normalizePrice(a);
      const bPrice = normalizePrice(b);

      if (aPrice.value === bPrice.value) {
        // Preserve original ordering when both prices are non-numeric or equal
        return 0;
      }

      return aPrice.value - bPrice.value;
    });

    // Only return dynamic plans (no fallback)
    return sortedPlans;
  }, [pricingData, segment, funnelLevel, billingPeriod, currency, exchangeRates]);

  const features = [
    {
      category: 'AI & Automation',
      items: [
        { name: 'AI Hunter (Lead Generation)', free: '100-500/mo', starter: '1K-5K/mo', professional: '10K-25K/mo', premium: '50K-100K/mo', enterprise: 'Unlimited' },
        { name: 'Contact Validation', free: '500-1K/mo', starter: '5K-25K/mo', professional: '25K-100K/mo', premium: '100K/mo', enterprise: 'Unlimited' },
        { name: 'SalesGPT Conversations', free: 'Basic', starter: 'Advanced', professional: 'Advanced', premium: 'Premium', enterprise: 'Enterprise' },
        { name: 'Voice AI Agent', free: false, starter: false, professional: true, premium: true, enterprise: true },
        { name: 'Custom AI Training', free: false, starter: false, professional: false, premium: false, enterprise: true }
      ]
    },
    {
      category: 'Integrations & APIs',
      items: [
        { name: 'CRM Integrations', free: 'Standard', starter: 'All', professional: 'All', premium: 'All', enterprise: 'All + Custom' },
        { name: 'API Access', free: 'Limited', starter: 'Limited', professional: 'Full', premium: 'Full', enterprise: 'Enterprise' },
        { name: 'Webhooks', free: false, starter: false, professional: true, premium: true, enterprise: true },
        { name: 'Custom Integrations', free: false, starter: false, professional: false, premium: false, enterprise: true }
      ]
    },
    {
      category: 'Support & Training',
      items: [
        { name: 'Support Level', free: 'Community', starter: 'Email', professional: 'Priority', premium: 'Priority', enterprise: 'Dedicated Manager' },
        { name: 'Response Time', free: 'Community', starter: '24-48 hours', professional: '4-8 hours', premium: '4-8 hours', enterprise: '1-2 hours' },
        { name: 'Phone Support', free: false, starter: false, professional: false, premium: false, enterprise: true },
        { name: 'Custom Training', free: false, starter: false, professional: false, premium: false, enterprise: true },
        { name: 'SLA Guarantee', free: false, starter: false, professional: false, premium: false, enterprise: true }
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

  const testimonials = [
    {
      quote: "Sales Centri's pricing is transparent and the ROI is incredible. We've 3x'd our lead generation.",
      author: "Sarah Johnson",
      title: "VP Sales",
      company: "TechCorp",
      rating: 5
    },
    {
      quote: "The Professional plan gives us everything we need. Excellent value for the features provided.",
      author: "Michael Chen",
      title: "Sales Director",
      company: "GrowthCo",
      rating: 5
    },
    {
      quote: "Enterprise support is outstanding. The dedicated manager makes all the difference.",
      author: "Emily Rodriguez",
      title: "CRO",
      company: "ScaleUp Inc",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10">
        
        {/* Hero Section */}
        <section className="pt-12 pb-6 sm:pt-16 sm:pb-8 px-4 sm:px-8 lg:px-16 hero-section">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 mb-2 sm:mb-3">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-blue-400 text-xs sm:text-sm font-medium">Premium Pricing</span>
              </div>
              
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1.5 sm:mb-2">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                  Choose Your
                </span>{" "}
                <span className="text-white">Plan</span>
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-3xl mx-auto mb-2 sm:mb-3 leading-relaxed">
                Scale your sales operations with our enterprise-grade AI solutions. 
                <span className="text-blue-400 font-semibold"> Start free, upgrade anytime.</span>
              </p>
              
              {/* Pricing Upload Link - visible only to admins */}
              {authChecked && isAdmin && (
                <div className="mb-3">
                  <Link 
                    href="/admin/pricing-upload"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-green-400 hover:from-green-500/20 hover:to-emerald-500/20 hover:border-green-500/40 transition-all duration-300 text-sm font-medium"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Upload Pricing Data
                  </Link>
                </div>
              )}
              
              {/* Segment Selection - 3-way selector */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap px-2">
                {(['personal', 'business', 'funnel-level'] as const).map((seg) => (
                  <button
                    key={seg}
                    onClick={() => setSegment(seg)}
                    className={`px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border ${
                      segment === seg
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                        : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 active:bg-gray-700/50'
                    }`}
                  >
                    {seg === 'funnel-level' ? 'Lead Streams' : seg.charAt(0).toUpperCase() + seg.slice(1)}
                  </button>
                ))}
              </div>

              {/* Funnel Level Secondary Selector - only shown when Funnel Level segment is selected */}
              {segment === 'funnel-level' && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap px-2">
                  {(['TOFU', 'MOFU', 'BOFU'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setFunnelLevel(level)}
                      className={`px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border ${
                        funnelLevel === level
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                          : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 active:bg-gray-700/50'
                      }`}
                    >
                      <span className="hidden sm:inline">{level === 'TOFU' ? 'TOFU (Top of Funnel)' : level === 'MOFU' ? 'MOFU (Middle of Funnel)' : 'BOFU (Bottom of Funnel)'}</span>
                      <span className="sm:hidden">{level}</span>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-4 mb-3 sm:mb-4 flex-wrap px-2">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 border ${
                    billingPeriod === 'monthly'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                      : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 active:bg-gray-700/50'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 border ${
                    billingPeriod === 'yearly'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                      : 'bg-gray-800/50 text-gray-300 border-gray-700 hover:bg-gray-700/50 hover:border-gray-600 active:bg-gray-700/50'
                  }`}
                >
                  Yearly
                </button>
                {billingPeriod === 'yearly' && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-sm">
                    <span className="flex items-center gap-1 sm:gap-2">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Save 20%</span>
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          <div className="mt-3 sm:mt-4 flex justify-center">
            <Link
              href="/solutions/psa-suite-one-stop-solution"
              className="inline-flex items-center gap-1.5 sm:gap-2 border border-cyan-500/30 text-cyan-300 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:bg-cyan-500/10 transition-all duration-300"
            >
              Try SalesGPT Now
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </section>

        {/* Plans Section */}
        <section className="pb-6 sm:pb-8 px-4 sm:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center">
              <div className={`grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-items-center ${
                plans.length === 1 ? 'grid-cols-1' :
                plans.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                plans.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
              {(!plans.length && !loading) && (
                <div className="col-span-full text-center text-gray-300">
                  No pricing data available. Please upload pricing data to get started.
                </div>
              )}
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group w-full max-w-sm"
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-500/25 backdrop-blur-sm border border-blue-400/30">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <motion.div
                    className={`relative bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-xl border rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 transition-all duration-500 h-full flex flex-col group-hover:scale-105 ${
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
                      <div className="mb-3 sm:mb-4 md:mb-6">
                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                        <div className="flex items-baseline mb-1 sm:mb-2">
                          {typeof plan.price === 'number' ? (
                            <>
                              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                                {plan.price === 0 ? 'Free' : formatCurrency(plan.price, currency)}
                              </span>
                              {plan.price !== 0 && (
                                <span className="text-gray-400 ml-1 sm:ml-2 text-sm sm:text-base md:text-lg">/month</span>
                              )}
                            </>
                          ) : (
                            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">{plan.price}</span>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2 sm:space-x-3">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            </div>
                            <span className="text-gray-300 text-xs sm:text-sm leading-relaxed break-words">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative z-10 mt-auto">
                      {segment === 'funnel-level' && (plan as any).isFunnelLevel ? (
                        <Link
                          href={plan.link || (process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                          prefetch={false}
                        >
                          <motion.button
                            className={`w-full py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 cursor-pointer text-xs sm:text-sm md:text-base ${
                              plan.popular
                                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                                : "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/30 hover:text-white active:bg-gray-700"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Book Demo
                          </motion.button>
                        </Link>
                      ) : (
                        <Link
                          href={`/checkout?segment=${segment === 'personal' ? 'Personal' : 'Business'}&cycle=${billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'}&plan=${encodeURIComponent(plan.name)}`}
                          className="block w-full"
                        >
                          <motion.button
                            className={`w-full py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 cursor-pointer text-xs sm:text-sm md:text-base ${
                              plan.popular
                                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                                : "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/30 hover:text-white active:bg-gray-700"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {plan.ctaText || (plan.name === 'Enterprise' ? 'Contact Sales' : 'Subscribe')}
                          </motion.button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              </div>
            </div>

            {/* Disclaimer - shown for each segment, below plans grid */}
            {plans.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="mt-4 sm:mt-6 md:mt-8"
              >
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 backdrop-blur-sm mx-2 sm:mx-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-amber-400 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <span>⚠️</span>
                    Disclaimer
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    All prices are indicative and subject to change. Final pricing will be determined after a discovery call, where the scope of work (SOW), expectations, and required services will be defined. Pricing may vary based on the industry, product/service, complexity of lead generation, and average sale size. Final pricing & terms will be agreed upon mutually.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center mb-4 sm:mb-6 md:mb-8"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2 md:mb-4 pt-2">Feature Comparison</h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300">See what&apos;s included in each plan</p>
            </motion.div>

            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {features.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500/20 to-cyan-600/20 px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">{category.category}</h3>
                  </div>
                  
                  <div className="p-2 sm:p-3 md:p-4 lg:p-6">
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                      <table className="w-full text-xs sm:text-sm min-w-[640px]">
                        <thead>
                          <tr className="border-b border-gray-700">
                            <th className="text-left py-2 sm:py-3 px-2 text-gray-300 font-semibold">Feature</th>
                            <th className="text-center py-2 sm:py-3 px-2 text-gray-300 font-semibold">Free</th>
                            <th className="text-center py-2 sm:py-3 px-2 text-gray-300 font-semibold">Starter</th>
                            <th className="text-center py-2 sm:py-3 px-2 text-gray-300 font-semibold">Professional</th>
                            <th className="text-center py-2 sm:py-3 px-2 text-gray-300 font-semibold">Premium</th>
                            <th className="text-center py-2 sm:py-3 px-2 text-gray-300 font-semibold">Enterprise</th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.items.map((item, itemIndex) => (
                            <tr key={itemIndex} className="border-b border-gray-800/50">
                              <td className="py-2 sm:py-3 px-2 text-gray-300">{item.name}</td>
                              <td className="py-2 sm:py-3 text-center">
                                {typeof item.free === 'boolean' ? (
                                  item.free ? (
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto" />
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )
                                ) : (
                                  <span className="text-gray-300 text-xs sm:text-sm">{item.free}</span>
                                )}
                              </td>
                              <td className="py-2 sm:py-3 text-center">
                                {typeof item.starter === 'boolean' ? (
                                  item.starter ? (
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto" />
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )
                                ) : (
                                  <span className="text-gray-300 text-xs sm:text-sm">{item.starter}</span>
                                )}
                              </td>
                              <td className="py-2 sm:py-3 text-center">
                                {typeof item.professional === 'boolean' ? (
                                  item.professional ? (
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto" />
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )
                                ) : (
                                  <span className="text-gray-300 text-xs sm:text-sm">{item.professional}</span>
                                )}
                              </td>
                              <td className="py-2 sm:py-3 text-center">
                                {typeof item.premium === 'boolean' ? (
                                  item.premium ? (
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto" />
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )
                                ) : (
                                  <span className="text-gray-300 text-xs sm:text-sm">{item.premium}</span>
                                )}
                              </td>
                              <td className="py-2 sm:py-3 text-center">
                                {typeof item.enterprise === 'boolean' ? (
                                  item.enterprise ? (
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mx-auto" />
                                  ) : (
                                    <span className="text-gray-500">-</span>
                                  )
                                ) : (
                                  <span className="text-gray-300 text-xs sm:text-sm">{item.enterprise}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Add-ons */}
        <section className="pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center mb-4 sm:mb-6 md:mb-8"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2 md:mb-4 pt-2">Optional Add-ons</h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300">Enhance your plan with additional features</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {addOns.map((addon, index) => (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 hover:border-blue-500/50 transition-all duration-300"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-1.5 sm:mb-2">{addon.name}</h3>
                  <p className="text-gray-300 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm">{addon.description}</p>
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">${addon.price}</span>
                    <span className="text-gray-400 text-xs sm:text-sm">{addon.unit}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/10 to-cyan-700/10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mb-4 sm:mb-6 md:mb-8"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1.5 sm:mb-2 md:mb-4 pt-2">What Our Customers Say</h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300">Real feedback from teams using Sales Centri</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6"
                >
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-2 sm:mb-3 md:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-2 sm:mb-3 md:mb-4 italic text-xs sm:text-sm md:text-base">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="text-white font-semibold text-xs sm:text-sm md:text-base">{testimonial.author}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{testimonial.title}</p>
                    <p className="text-blue-400 text-xs sm:text-sm">{testimonial.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-6 sm:pb-8 px-4 sm:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-sm text-center mx-2 sm:mx-0"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                Need a custom solution?
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-3 sm:mb-4 md:mb-6 max-w-2xl mx-auto">
                Contact our sales team for enterprise pricing, custom integrations, and dedicated support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
                <Link
                  href="/solutions/psa-suite-one-stop-solution"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 active:scale-95 text-center"
                >
                  Try SalesGPT Now
                </Link>
                <Link
                  href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-gray-600 text-gray-300 px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-semibold hover:bg-gray-800 transition-all duration-300 active:scale-95 text-center"
                  prefetch={false}
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
