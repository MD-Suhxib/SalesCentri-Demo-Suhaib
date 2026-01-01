"use client";

import { motion } from "framer-motion";
import { Check, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { usePricingData } from "@/app/hooks/usePricingData";
import { useCurrency } from "@/app/hooks/useCurrency";
import { convertPrice, formatCurrency, getCurrencySymbol, type Currency, type ExchangeRates } from "@/app/lib/currency";

export const Pricing = () => {
  const [segment, setSegment] = useState<'personal' | 'business' | 'funnel-level'>('personal');
  const [funnelLevel, setFunnelLevel] = useState<'TOFU' | 'MOFU' | 'BOFU' | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  // Dynamic pricing with real-time updates via Firebase (falls back to API if not configured)
  const { data: pricingData, loading, error } = usePricingData();
  
  // Currency detection and exchange rates
  const { currency, loading: currencyLoading } = useCurrency();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [ratesLoading, setRatesLoading] = useState(true);

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
        setRatesLoading(true);
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
      } finally {
        if (mounted) {
          setRatesLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Debug: Log currency and exchange rates when they change
  useEffect(() => {
    if (!currencyLoading && currency && exchangeRates) {
      console.log('[Pricing] Currency detected:', currency, 'Exchange rates:', exchangeRates);
      if (currency === 'USD') {
        console.log('[Pricing] Currency is USD - prices will not be converted. To test conversion, geolocation must detect INR or GBP.');
      } else {
        console.log('[Pricing] Currency is', currency, '- prices will be converted from USD');
      }
    }
  }, [currency, exchangeRates, currencyLoading]);

  const plans = useMemo(() => {
    if (!Array.isArray(pricingData) || pricingData.length === 0) return [] as any[];
    
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
          typeof price === 'number' 
            ? `Minimum Price: ${priceDisplay}`
            : `Minimum Price: ${priceDisplay}`,
          ...(Array.isArray(p.features) ? p.features : []),
        ].filter(Boolean) as string[];

        const slug = `${p.funnelLevel}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const popular = false;
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
          popular,
          color,
          gradient,
          ctaText: 'Book Demo',
          link: process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled',
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
        console.log(`[Pricing] Converting ${name}: $${basePrice} USD -> ${formatCurrency(converted, currency)}`);
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
      const enterprisePlan = {
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
        link: process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled',
        ctaText: 'Book Demo',
        funnelLevel: activeFunnelLevel,
        type: 'Enterprise',
        leadGenName: 'Enterprise',
        isFunnelLevel: true,
      };
      dynamicPlans.push(enterprisePlan as any);
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

    return sortedPlans;
  }, [pricingData, segment, funnelLevel, billingPeriod, currency, exchangeRates]);


  return (
    <section
      id="pricing"
      className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-black via-gray-900 to-black relative px-4 md:px-6 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Premium Pricing</span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
              Choose Your
            </span>{" "}
            <span className="text-white">Plan</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Scale your sales operations with our enterprise-grade AI solutions. 
            <span className="text-blue-400 font-semibold"> Start free, upgrade anytime.</span>
          </p>

          {/* Segment Selection - 3-way selector */}
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap px-2">
            {(['personal', 'business', 'funnel-level'] as const).map((seg) => (
              <button
                key={seg}
                onClick={() => setSegment(seg)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border ${
                  segment === seg
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]'
                    : 'bg-black/40 backdrop-blur-md text-gray-400 border-white/10 hover:bg-white/5 hover:text-gray-200 hover:border-white/20'
                }`}
              >
                {seg === 'funnel-level' ? 'Lead Streams' : seg.charAt(0).toUpperCase() + seg.slice(1)}
              </button>
            ))}
          </div>

          {/* Funnel Level Secondary Selector - only shown when Funnel Level segment is selected */}
          {segment === 'funnel-level' && (
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap px-2">
              {(['TOFU', 'MOFU', 'BOFU'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setFunnelLevel(level)}
                  className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 border ${
                    funnelLevel === level
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]'
                      : 'bg-black/40 backdrop-blur-md text-gray-400 border-white/10 hover:bg-white/5 hover:text-gray-200 hover:border-white/20'
                  }`}
                >
                  <span className="hidden sm:inline">{level === 'TOFU' ? 'TOFU (Top of Funnel)' : level === 'MOFU' ? 'MOFU (Middle of Funnel)' : 'BOFU (Bottom of Funnel)'}</span>
                  <span className="sm:hidden">{level}</span>
                </button>
              ))}
            </div>
          )}

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap px-2">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 border ${
                billingPeriod === "monthly"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                  : "bg-black/40 backdrop-blur-md text-gray-400 border-white/10 hover:bg-white/5 hover:text-gray-200 hover:border-white/20"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 border ${
                billingPeriod === "yearly"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]"
                  : "bg-black/40 backdrop-blur-md text-gray-400 border-white/10 hover:bg-white/5 hover:text-gray-200 hover:border-white/20"
              }`}
            >
              Yearly
            </button>
            {billingPeriod === "yearly" && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-sm">
                <span className="flex items-center gap-1 sm:gap-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Save 20%</span>
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex justify-center">
          <div className={`grid gap-4 sm:gap-6 md:gap-8 justify-items-center ${
            plans.length === 1 ? 'grid-cols-1' :
            plans.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
            plans.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
          {(!plans.length && !loading) && (
            <div className="col-span-full text-center text-gray-300 px-4">
              No pricing data available. Please upload pricing data to get started.
            </div>
          )}
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group w-full max-w-sm"
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10 transition-transform duration-500 group-hover:scale-[1.02] group-hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-bold shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] backdrop-blur-sm border border-blue-400/50 tracking-wide">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <motion.div
                className={`relative bg-[#0A0A0A] backdrop-blur-xl border rounded-3xl p-6 sm:p-8 transition-all duration-500 h-full flex flex-col group-hover:scale-[1.02] group-hover:-translate-y-2 ${
                  plan.popular
                    ? "border-blue-500/40 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)]"
                    : "border-white/10 hover:border-white/20 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]"
                }`}
                style={{
                  boxShadow: plan.popular 
                    ? '0 0 0 1px rgba(59,130,246,0.2), 0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : '0 0 0 1px rgba(255,255,255,0.05), 0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-[0.08] rounded-3xl`}></div>
                
                <div className="relative z-10 flex-grow">
                  <div className="mb-6 sm:mb-8 border-b border-white/5 pb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed min-h-[40px]">
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-6 sm:mb-8">
                    <div className="flex items-baseline mb-2">
                      {typeof plan.price === 'number' ? (
                        <>
                          <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                            {plan.price === 0 ? 'Free' : formatCurrency(plan.price, currency)}
                          </span>
                          {plan.price !== 0 && (
                            <span className="text-gray-400 ml-2 text-sm font-medium uppercase tracking-wide">/month</span>
                          )}
                        </>
                      ) : (
                        <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start space-x-3 group/item"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                          plan.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-300 group-hover/item:bg-white/20 group-hover/item:text-white'
                        }`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="text-gray-300 text-sm leading-relaxed font-medium group-hover/item:text-gray-200 transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10 mt-auto pt-6 border-t border-white/5">
                  {segment === 'funnel-level' && (plan as any).isFunnelLevel ? (
                    <Link
                      href={plan.link || (process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full"
                      prefetch={false}
                    >
                      <motion.button
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 cursor-pointer text-sm tracking-wide ${
                          plan.popular
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110"
                            : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Book Demo
                      </motion.button>
                    </Link>
                  ) : (
                    <Link
                      href={plan.name === "Enterprise" ? "/pricing/enterprise-custom" : `/checkout?segment=${segment === 'personal' ? 'Personal' : 'Business'}&cycle=${billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'}&plan=${encodeURIComponent(plan.name)}`}
                      className="block w-full"
                    >
                      <motion.button
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 cursor-pointer text-sm tracking-wide ${
                          plan.popular
                            ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:brightness-110"
                            : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        data-track={`pricing_${plan.name.toLowerCase()}_cta`}
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
            className="max-w-7xl mx-auto mt-6 sm:mt-8"
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

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 backdrop-blur-sm mx-2 sm:mx-0">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Need a custom solution?
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Contact our sales team for enterprise pricing, custom integrations, and dedicated support.
            </p>
            <Link href="/pricing/enterprise-custom">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 active:scale-95">
                Contact Sales
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
