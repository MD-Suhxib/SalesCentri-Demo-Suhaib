'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getAuthHeaders, validateAuthenticationAsync } from '../lib/auth';
import { getLoginUrl } from '../lib/loginUtils';
import { processPayment } from '../lib/payment/handler';
import { generateOrderId } from '../lib/payment/utils';
import { useCurrency } from '@/app/hooks/useCurrency';
import { convertPrice, formatCurrency, type ExchangeRates, type Currency } from '@/app/lib/currency';

// Types
type BillingInfo = {
  country: string;
  company?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  saveAddress: boolean;
};

type PlanRow = {
  segment: string;
  billingCycle: string;
  planName?: string;
  price: number | string;
  tagline?: string;
  features?: string[];
  // Funnel Level fields
  funnelLevel?: string;
  leadGenName?: string;
  type?: string;
  minimumPrice?: number;
};

type PaymentMethod = 'stripe' | 'paypal' | 'payu';

export default function CheckoutPage() {
  // Step management
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  // Pricing + selection
  const [pricingData, setPricingData] = useState<PlanRow[]>([]);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selected plan inputs (can be provided via query params)
  const [segment, setSegment] = useState<'Personal' | 'Business' | 'Funnel Level'>('Personal');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [planName, setPlanName] = useState<string>('');
  // Funnel Level specific state
  const [funnelLevel, setFunnelLevel] = useState<string>('');
  const [leadGenName, setLeadGenName] = useState<string>('');

  // Billing state
  const [billing, setBilling] = useState<BillingInfo>({
    country: 'United States',
    company: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    saveAddress: true,
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [payuQuote, setPayuQuote] = useState<{ amountInr: number; rate: number } | null>(null);
  const [payuQuoteLoading, setPayuQuoteLoading] = useState(false);
  const [payuQuoteError, setPayuQuoteError] = useState<string | null>(null);

  // Coupon (optional UI only)
  const [coupon, setCoupon] = useState('');

  // Currency detection and exchange rates
  const { currency } = useCurrency();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);

  // Fetch pricing
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingPricing(true);
        const res = await fetch('/api/get-pricing', { cache: 'no-store' });
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        if (!mounted) return;
        setPricingData(data as PlanRow[]);
      } catch (e) {
        if (!mounted) return;
        setLoadError('Failed to load pricing.');
      } finally {
        if (mounted) setLoadingPricing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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

  // Initialize selection from query params (if present)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const qSegment = url.searchParams.get('segment');
    const qCycle = url.searchParams.get('cycle');
    const qPlan = url.searchParams.get('plan');
    const qFunnelLevel = url.searchParams.get('funnelLevel');
    const qLeadGenName = url.searchParams.get('leadGenName');
    
    if (qSegment) {
      const segLower = qSegment.toLowerCase();
      if (segLower === 'funnel level') {
        setSegment('Funnel Level');
      } else {
        setSegment(segLower === 'business' ? 'Business' : 'Personal');
      }
    }
    if (qCycle) setBillingCycle(qCycle.toLowerCase() === 'yearly' ? 'Yearly' : 'Monthly');
    if (qPlan) setPlanName(qPlan);
    if (qFunnelLevel) setFunnelLevel(qFunnelLevel);
    if (qLeadGenName) setLeadGenName(qLeadGenName);
  }, []);

  // Ensure planName is one of the available plans in current filters
  const availablePlans = useMemo(() => {
    if (segment === 'Funnel Level') {
      // Filter for funnel level models
      return pricingData.filter((p) =>
        String(p.segment || '').toLowerCase() === 'funnel level' &&
        (funnelLevel ? String(p.funnelLevel || '').toUpperCase() === funnelLevel.toUpperCase() : true) &&
        String(p.billingCycle || '').toLowerCase() === billingCycle.toLowerCase()
      );
    } else {
      // Filter for Personal/Business plans
      return pricingData.filter((p) =>
        String(p.segment || '').toLowerCase() === segment.toLowerCase() &&
        String(p.billingCycle || '').toLowerCase() === billingCycle.toLowerCase()
      );
    }
  }, [pricingData, segment, billingCycle, funnelLevel]);

  useEffect(() => {
    if (availablePlans.length === 0) return;
    
    if (segment === 'Funnel Level') {
      // For funnel level, use leadGenName to find the plan
      if (leadGenName) {
        const exists = availablePlans.some((p) => 
          String(p.leadGenName || '').toLowerCase() === leadGenName.toLowerCase()
        );
        if (!exists && availablePlans.length > 0) {
          setLeadGenName(availablePlans[0].leadGenName || '');
        }
      } else if (availablePlans.length > 0) {
        setLeadGenName(availablePlans[0].leadGenName || '');
      }
    } else {
      // For Personal/Business, use planName
      if (!planName && availablePlans.length > 0) {
        setPlanName(availablePlans[0].planName || '');
        return;
      }
      const exists = availablePlans.some((p) => String(p.planName || '').toLowerCase() === planName.toLowerCase());
      if (!exists && availablePlans.length > 0) {
        setPlanName(availablePlans[0].planName || '');
      }
    }
  }, [availablePlans, planName, segment, leadGenName]);

  const selectedPlan = useMemo(() => {
    if (segment === 'Funnel Level') {
      return availablePlans.find((p) => 
        String(p.leadGenName || '').toLowerCase() === leadGenName.toLowerCase()
      ) || null;
    } else {
      return availablePlans.find((p) => 
        String(p.planName || '').toLowerCase() === planName.toLowerCase()
      ) || null;
    }
  }, [availablePlans, planName, segment, leadGenName]);

  // Auth gating — user must be logged in before proceeding beyond Step 1
  // This effect checks authentication on mount and also re-checks when token parameters are detected in URL
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await validateAuthenticationAsync();
        setIsAuthenticated(result.isAuthenticated);
        
        // If not authenticated and not on step 1, redirect to login
        if (!result.isAuthenticated && step !== 1) {
          // Redirect to login page, preserving current URL for redirect back
          window.location.href = getLoginUrl(true);
          return;
        }
      } catch {
        setIsAuthenticated(false);
        // If error and not on step 1, redirect to login
        if (step !== 1) {
          window.location.href = getLoginUrl(true);
          return;
        }
      } finally {
        setAuthChecked(true);
      }
    };

    // Check if there are token parameters in URL (from login redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const hasTokenParams = urlParams.get('token') && urlParams.get('refreshToken') && urlParams.get('expiresAt');
    
    if (hasTokenParams) {
      // Token params detected - LoginRedirectHandler will process them
      // Poll for tokens to be saved, then validate auth (with timeout)
      const maxAttempts = 20; // Max 2 seconds (20 * 100ms)
      
      const pollForTokens = (attempt: number = 0) => {
        const token = localStorage.getItem('salescentri_token');
        if (token) {
          // Tokens have been saved, now validate authentication
          checkAuth();
        } else if (attempt < maxAttempts) {
          // Retry after a short delay
          setTimeout(() => pollForTokens(attempt + 1), 100);
        } else {
          // Timeout reached, check auth anyway (might have failed)
          checkAuth();
        }
      };
      
      // Start polling after a brief delay to allow LoginRedirectHandler to run
      const timer = setTimeout(() => pollForTokens(0), 200);
      return () => clearTimeout(timer);
    } else {
      // Normal auth check on mount
      checkAuth();
    }
  }, [step]);

  // Redirect to login if user tries to access steps 2-4 without authentication
  useEffect(() => {
    if (authChecked && !isAuthenticated && step > 1) {
      window.location.href = getLoginUrl(true);
    }
  }, [authChecked, isAuthenticated, step]);

  const goToNext = useCallback(() => {
    // Prevent navigation beyond step 1 if not authenticated
    if (step === 1 && (!authChecked || !isAuthenticated)) {
      // Redirect to login if trying to proceed without authentication
      window.location.href = getLoginUrl(true);
      return;
    }
    
    const nextStep = step < 4 ? ((step + 1) as 1 | 2 | 3 | 4) : step;
    setStep(nextStep);
    setCompletedSteps(prev => new Set([...prev, step]));
    scrollToSection(nextStep);
  }, [step, authChecked, isAuthenticated]);

  const goToPrev = useCallback(() => {
    const prevStep = step > 1 ? ((step - 1) as 1 | 2 | 3 | 4) : step;
    setStep(prevStep);
    scrollToSection(prevStep);
  }, [step]);

  const goToStep = useCallback((targetStep: 1 | 2 | 3 | 4) => {
    // Prevent navigation to steps 2-4 if not authenticated
    if (targetStep > 1 && (!authChecked || !isAuthenticated)) {
      // Redirect to login if trying to access protected steps without authentication
      window.location.href = getLoginUrl(true);
      return;
    }
    
    setStep(targetStep);
    scrollToSection(targetStep);
  }, [authChecked, isAuthenticated]);

  const scrollToSection = useCallback((sectionNumber: number) => {
    const element = document.getElementById(`section-${sectionNumber}`);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

  // Auth actions - using the same method as customer portal login
  const onClickSignIn = () => {
    // Use the same getLoginUrl utility as customer portal, preserving current URL
    // This ensures consistent authentication flow across the application
    window.location.href = getLoginUrl(true);
  };

  const onClickCreateAccount = () => {
    // Use the same getLoginUrl utility as customer portal, preserving current URL
    // This ensures consistent authentication flow across the application
    window.location.href = getLoginUrl(true);
  };

  const subtotal = useMemo(() => {
    if (!selectedPlan) return 0;
    // For funnel-level, prefer minimumPrice, fallback to price
    let basePrice: number;
    if (segment === 'Funnel Level' && typeof selectedPlan.minimumPrice === 'number') {
      basePrice = selectedPlan.minimumPrice;
    } else {
      basePrice = typeof selectedPlan.price === 'number' ? selectedPlan.price : 0;
    }
    
    // Convert to user's currency if needed
    if (basePrice > 0 && exchangeRates && currency !== 'USD') {
      return convertPrice(basePrice, 'USD', currency, exchangeRates);
    }
    return basePrice;
  }, [selectedPlan, segment, currency, exchangeRates]);

  const taxes = useMemo(() => {
    return 0; // Tax estimation placeholder
  }, []);

  const total = useMemo(() => subtotal + taxes, [subtotal, taxes]);

  useEffect(() => {
    if (paymentMethod !== 'payu') {
      setPayuQuote(null);
      setPayuQuoteError(null);
      setPayuQuoteLoading(false);
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      setPayuQuote(null);
      setPayuQuoteError(null);
      setPayuQuoteLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    const loadQuote = async () => {
      setPayuQuoteLoading(true);
      setPayuQuoteError(null);

      try {
        const res = await fetch(
          `/api/payu/convert?amount=${total.toFixed(2)}`,
          { signal: controller.signal },
        );

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || 'Unable to fetch FX rate');
        }

        const data = await res.json();
        if (cancelled) return;

        const amountInr = Number(data?.amountInr);
        const rate = Number(data?.rate);

        if (!Number.isFinite(amountInr) || amountInr <= 0 || !Number.isFinite(rate) || rate <= 0) {
          throw new Error('Invalid conversion data received');
        }

        setPayuQuote({ amountInr, rate });
      } catch (error: unknown) {
        if (cancelled) return;
        const errorLike = error as { name?: string };
        if (errorLike?.name === 'AbortError') {
          return;
        }
        console.error('PayU FX conversion error:', error);
        setPayuQuote(null);
        setPayuQuoteError('Live FX rate unavailable. PayU will convert at checkout.');
      } finally {
        if (!cancelled) {
          setPayuQuoteLoading(false);
        }
      }
    };

    void loadQuote();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [paymentMethod, total]);

  const inrFormatter = useMemo(() => {
    if (typeof Intl === 'undefined' || typeof Intl.NumberFormat === 'undefined') {
      return null;
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  const formatInr = useCallback(
    (value?: number | null) => {
      if (value === undefined || value === null || !Number.isFinite(value)) {
        return null;
      }

      return inrFormatter ? inrFormatter.format(value) : `₹${value.toFixed(2)}`;
    },
    [inrFormatter],
  );

  const payuInrDisplay = useMemo(() => {
    if (!payuQuote) return null;
    const formatted = formatInr(payuQuote.amountInr);
    if (formatted) return formatted;
    return `₹${payuQuote.amountInr.toFixed(2)}`;
  }, [payuQuote, formatInr]);

  const payuRateDisplay = useMemo(() => {
    if (!payuQuote || !Number.isFinite(payuQuote.rate)) return null;
    return payuQuote.rate.toFixed(4);
  }, [payuQuote]);

  // Generic payment handler for all gateways
  const submitPayUForm = useCallback((action: string, params: Record<string, string>) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = action;

    Object.entries(params).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }, []);

  const handlePayment = useCallback(async () => {
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }

    setProcessing(true);
    try {
      // Get user email if available
      let userEmail: string | undefined = billing.email?.trim() || undefined;
      const token = localStorage.getItem('salescentri_token');
      if (token) {
        try {
          const response = await fetch('https://app.demandintellect.com/app/api/profile.php', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const profile = await response.json();
            if (profile?.user?.email) {
              userEmail = profile.user.email;
            }
          }
        } catch (error) {
          console.log('Could not fetch user email for payment');
        }
      }

      // Prepare payment metadata
      const orderId = generateOrderId();
      const paymentMetadata = {
        segment,
        billingCycle,
        planName: segment === 'Funnel Level' ? undefined : (selectedPlan.planName || planName),
        funnelLevel: segment === 'Funnel Level' ? funnelLevel : undefined,
        leadGenName: segment === 'Funnel Level' ? (selectedPlan.leadGenName || leadGenName) : undefined,
        currency: currency,
        amount: total,
        orderId,
        userEmail,
      };

      // Handle PayU hosted checkout
      if (paymentMethod === 'payu') {
        if (!billing.firstName?.trim() || !billing.email?.trim() || !billing.phone?.trim()) {
          alert('Please provide first name, email, and phone number for PayU.');
          return;
        }

        const response = await fetch('/api/payu/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total.toFixed(2),
            firstname: billing.firstName.trim(),
            email: billing.email.trim(),
            phone: billing.phone.trim(),
            productinfo:
              segment === 'Funnel Level'
                ? selectedPlan?.leadGenName || 'Funnel subscription'
                : selectedPlan?.planName || 'Subscription',
          }),
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error?.error || 'Failed to initiate PayU checkout');
        }

        const data = await response.json();
        submitPayUForm(data.action, data.params);
        return;
      }

      // Handle PayPal separately (uses different flow)
      if (paymentMethod === 'paypal') {
        // Call PayPal handler directly
        try {
          const successUrl = new URL('/api/paypal/success', window.location.origin);
          
          let paypalUserEmail: string | undefined;
          const paypalToken = localStorage.getItem('salescentri_token');
          if (paypalToken) {
            try {
              const response = await fetch('https://app.demandintellect.com/app/api/profile.php', {
                headers: { 'Authorization': `Bearer ${paypalToken}` }
              });
              if (response.ok) {
                const profile = await response.json();
                if (profile?.user?.email) {
                  paypalUserEmail = profile.user.email;
                  successUrl.searchParams.set('email', paypalUserEmail);
                }
              }
            } catch (error) {
              console.log('Could not fetch user email for payment');
            }
          }

          const paypalBody: any = {
            segment,
            billingCycle,
            currency: currency,
            amount: total,
            returnUrl: successUrl.toString(),
            cancelUrl: `${window.location.origin}/checkout?cancelled=true`,
          };

          if (segment === 'Funnel Level') {
            paypalBody.funnelLevel = funnelLevel;
            paypalBody.leadGenName = selectedPlan.leadGenName || leadGenName;
          } else {
            paypalBody.planName = selectedPlan.planName || planName;
          }

          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paypalBody),
          });
          
          const json = await res.json();
          
          if (!res.ok || !json?.id) {
            throw new Error(json?.error || 'Failed to create order');
          }

          let paypalCheckoutUrl = json.approveUrl;
          
          if (!paypalCheckoutUrl) {
            const paypalEnv = process.env.NEXT_PUBLIC_PAYPAL_ENV || 'sandbox';
            const baseUrl = paypalEnv === 'live'
              ? 'https://www.paypal.com/checkoutnow'
              : 'https://www.sandbox.paypal.com/checkoutnow';
            paypalCheckoutUrl = `${baseUrl}?token=${json.id}`;
          }
          
          window.location.href = paypalCheckoutUrl;
          return;
        } catch (error) {
          console.error('PayPal payment error:', error);
          alert('Failed to initiate payment. Please try again.');
          setProcessing(false);
          return;
        }
      }

      // Handle Stripe hosted checkout session creation
      const result = await processPayment({
        gateway: 'stripe',
        metadata: paymentMetadata,
      });

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Failed to initiate payment');
      }

      // Redirect to gateway checkout
      window.location.href = result.url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [
    selectedPlan,
    segment,
    billingCycle,
    total,
    paymentMethod,
    funnelLevel,
    leadGenName,
    planName,
    billing.email,
    billing.firstName,
    billing.phone,
    submitPayUForm,
  ]);

  // PayPal create order with success redirect (keep existing PayPal handler)
  const handlePayPalPayment = useCallback(async () => {
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }

    setProcessing(true);
    try {
      // Create success URL (PayPal will add token and PayerID)
      // We'll get order metadata from PayPal API using custom_id, so minimal query params needed
      const successUrl = new URL('/api/paypal/success', window.location.origin);
      
      // Optionally add email if available (won't interfere with PayPal params)
      const token = localStorage.getItem('salescentri_token');
      if (token) {
        try {
          const response = await fetch('https://app.demandintellect.com/app/api/profile.php', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const profile = await response.json();
            if (profile?.user?.email) {
              successUrl.searchParams.set('email', profile.user.email);
            }
          }
        } catch (error) {
          console.log('Could not fetch user email for payment');
        }
      }

      const paypalBody: any = {
        segment,
        billingCycle,
        currency: currency,
        amount: total,
        returnUrl: successUrl.toString(),
        cancelUrl: `${window.location.origin}/checkout?cancelled=true`,
      };

      // Add plan identifier based on segment type
      if (segment === 'Funnel Level') {
        paypalBody.funnelLevel = funnelLevel;
        paypalBody.leadGenName = selectedPlan.leadGenName || leadGenName;
      } else {
        paypalBody.planName = selectedPlan.planName || planName;
      }

      console.log('Creating PayPal order with data:', paypalBody);

      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paypalBody),
      });
      
      console.log('PayPal create-order response status:', res.status);
      const json = await res.json();
      console.log('PayPal create-order response:', json);
      
      if (!res.ok || !json?.id) {
        throw new Error(json?.error || 'Failed to create order');
      }

      // Use approval URL from PayPal API response (more reliable than hardcoding)
      // Fallback to constructed URL if approveUrl not provided
      let paypalCheckoutUrl = json.approveUrl;
      
      if (!paypalCheckoutUrl) {
        // Fallback: construct URL based on environment
        // Use NEXT_PUBLIC_PAYPAL_ENV to match backend configuration
        const paypalEnv = process.env.NEXT_PUBLIC_PAYPAL_ENV || 'sandbox';
        const baseUrl = paypalEnv === 'live'
          ? 'https://www.paypal.com/checkoutnow'
          : 'https://www.sandbox.paypal.com/checkoutnow';
        paypalCheckoutUrl = `${baseUrl}?token=${json.id}`;
      }
      
      console.log('Redirecting to PayPal:', paypalCheckoutUrl);
      window.location.href = paypalCheckoutUrl;
      
    } catch (error) {
      console.error('PayPal payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  }, [selectedPlan, segment, billingCycle, total]);


  // Left sidebar navigation
  const LeftSidebar = () => (
    <div className="w-64 bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 h-fit sticky top-8">
      <h3 className="text-white font-semibold mb-6 text-sm">Checkout Progress</h3>
      <div className="space-y-4">
        {[
          { number: 1, title: 'Authentication', description: 'Sign in to continue' },
          { number: 2, title: 'Billing Info', description: 'Your contact details' },
          { number: 3, title: 'Payment Method', description: 'Choose payment option' },
          { number: 4, title: 'Review & Confirm', description: 'Final confirmation' }
        ].map((item) => {
          const isActive = step === item.number;
          const isCompleted = completedSteps.has(item.number);
          const isAccessible = item.number === 1 || completedSteps.has(item.number - 1);
          
          // Additional check: prevent access to steps 2-4 if not authenticated
          const isAuthenticatedAndAccessible = item.number === 1 || (authChecked && isAuthenticated);
          
          return (
            <button
              key={item.number}
              onClick={() => isAccessible && isAuthenticatedAndAccessible && goToStep(item.number as 1 | 2 | 3 | 4)}
              disabled={!isAccessible || !isAuthenticatedAndAccessible}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : isCompleted 
                    ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                    : isAccessible && isAuthenticatedAndAccessible
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive 
                    ? 'bg-white text-blue-600' 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-600 text-gray-300'
                }`}>
                  {isCompleted ? '✓' : item.number}
                </div>
                <div>
                  <div className="font-medium text-sm">{item.title}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  // Individual section components
  const AuthSection = () => (
    <div id="section-1" className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">1</div>
        <h2 className="text-xl font-semibold text-white">Authentication</h2>
      </div>
      {authChecked && isAuthenticated ? (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">You are signed in. Continue to billing.</p>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium"
              onClick={() => goToStep(2)}
            >
              Continue to Billing
            </button>
            <Link href="/" className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm">
              Cancel
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex border-b border-gray-700 mb-3">
            <button 
              className={`px-3 py-2 font-medium text-sm ${authTab === 'signin' ? 'text-blue-400' : 'text-gray-400'}`}
              onClick={() => setAuthTab('signin')}
            >
              Sign In
            </button>
            <button 
              className={`px-3 py-2 font-medium text-sm ${authTab === 'signup' ? 'text-blue-400' : 'text-gray-400'}`}
              onClick={() => setAuthTab('signup')}
            >
              Create Account
            </button>
          </div>
          
          {authTab === 'signin' ? (
            <div>
              <h3 className="font-medium mb-2 text-white text-sm">Sign In</h3>
              <div className="space-y-2">
                <input placeholder="Email" type="email" className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" aria-label="Email address" />
                <input placeholder="Password" type="password" className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" aria-label="Password" />
                <div className="text-xs text-blue-400">
                  <a href="https://dashboard.salescentri.com/forgot" target="_blank" rel="noopener noreferrer">Forgot Password?</a>
                </div>
                <button onClick={onClickSignIn} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium">Sign In</button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-medium mb-2 text-white text-sm">Create Account</h3>
              <div className="space-y-2">
                <input placeholder="Name" className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" aria-label="Full name" />
                <input placeholder="Email" type="email" className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" aria-label="Email address" />
                <input placeholder="Password" type="password" className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" aria-label="Password" />
                <input placeholder="Confirm Password" type="password" className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" aria-label="Confirm Password" />
                <label className="flex items-center gap-2 text-xs text-gray-400">
                  <input type="checkbox" className="rounded" defaultChecked />
                  I agree to the Terms of Service
                </label>
                <button onClick={onClickCreateAccount} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium">Create Account</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const BillingSection = () => {
    // Show loading or redirect message if not authenticated
    if (!authChecked || !isAuthenticated) {
      return (
        <div id="section-2" className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
            <h2 className="text-xl font-semibold text-white">Billing Information</h2>
          </div>
          <p className="text-gray-400 text-sm">Please sign in to access billing information.</p>
        </div>
      );
    }
    
    return (
      <div id="section-2" className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">2</div>
          <h2 className="text-xl font-semibold text-white">Billing Information</h2>
        </div>
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Country / Region</label>
            <select
              className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm"
              value={billing.country}
              aria-label="Country or Region"
              onChange={(e) => setBilling((b) => ({ ...b, country: e.target.value }))}
            >
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Company (optional)</label>
            <input className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" value={billing.company} onChange={(e) => setBilling((b) => ({ ...b, company: e.target.value }))} aria-label="Company" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">First Name</label>
              <input className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" value={billing.firstName} onChange={(e) => setBilling((b) => ({ ...b, firstName: e.target.value }))} aria-label="First name" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Last Name</label>
              <input className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400" value={billing.lastName} onChange={(e) => setBilling((b) => ({ ...b, lastName: e.target.value }))} aria-label="Last name" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400"
                value={billing.email}
                onChange={(e) => setBilling((b) => ({ ...b, email: e.target.value }))}
                aria-label="Email"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone</label>
              <input
                className="w-full rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm placeholder-gray-400"
                value={billing.phone}
                onChange={(e) => setBilling((b) => ({ ...b, phone: e.target.value }))}
                aria-label="Phone number"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-400">
            <input type="checkbox" className="rounded" checked={billing.saveAddress} onChange={(e) => setBilling((b) => ({ ...b, saveAddress: e.target.checked }))} />
            Save this information for future billing
          </label>
        </div>

        <div className="flex justify-between">
          <button className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm" onClick={goToPrev}>Back</button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium" onClick={goToNext}>Continue to Payment</button>
        </div>
      </div>
    </div>
    );
  };

  const PaymentSection = () => {
    // Show loading or redirect message if not authenticated
    if (!authChecked || !isAuthenticated) {
      return (
        <div id="section-3" className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
            <h2 className="text-xl font-semibold text-white">Payment Method</h2>
          </div>
          <p className="text-gray-400 text-sm">Please sign in to access payment options.</p>
        </div>
      );
    }
    
    return (
    <div id="section-3" className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">3</div>
        <h2 className="text-xl font-semibold text-white">Payment Method</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 bg-gray-800 hover:border-gray-600 cursor-pointer transition-colors">
            <input type="radio" name="payment" checked={paymentMethod === 'stripe'} onChange={() => setPaymentMethod('stripe')} />
            <div className="flex items-center gap-2">
              <span className="font-medium text-white text-sm">Stripe</span>
              <span className="text-xs text-gray-400">Pay with credit/debit card</span>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 bg-gray-800 hover:border-gray-600 cursor-pointer transition-colors">
            <input type="radio" name="payment" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
            <div className="flex items-center gap-2">
            <span className="font-medium text-white text-sm">PayPal</span>
              <span className="text-xs text-gray-400">Pay with PayPal account</span>
            </div>
          </label>
          <label className="flex items-start gap-3 p-3 rounded-lg border border-gray-700 bg-gray-800 hover:border-gray-600 cursor-pointer transition-colors">
            <input type="radio" name="payment" checked={paymentMethod === 'payu'} onChange={() => setPaymentMethod('payu')} className="mt-1" />
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-white text-sm">PayU</span>
              <span className="text-xs text-gray-400">Hosted checkout (India)</span>
              {paymentMethod === 'payu' && (
                <span className="text-[11px] text-blue-300">
                  {payuQuoteLoading && 'Fetching INR amount…'}
                  {!payuQuoteLoading && payuInrDisplay
                    ? `${payuInrDisplay} (USD ${total.toFixed(2)})`
                    : null}
                  {!payuQuoteLoading && !payuInrDisplay && !payuQuoteError && 'Calculating…'}
                  {!payuQuoteLoading && payuQuoteError && payuQuoteError}
                </span>
              )}
            </div>
          </label>
        </div>

        <div className="flex justify-between">
          <button className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm" onClick={goToPrev}>Back</button>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium" onClick={goToNext}>Review & Confirm</button>
        </div>
      </div>
    </div>
    );
  };

  const ReviewSection = () => {
    // Show loading or redirect message if not authenticated
    if (!authChecked || !isAuthenticated) {
      return (
        <div id="section-4" className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</div>
            <h2 className="text-xl font-semibold text-white">Review & Confirm</h2>
          </div>
          <p className="text-gray-400 text-sm">Please sign in to review your order.</p>
        </div>
      );
    }
    
    return (
    <div id="section-4" className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">4</div>
        <h2 className="text-xl font-semibold text-white">Review & Confirm</h2>
      </div>
      <div className="space-y-4">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Plan</span>
            <span className="font-medium text-white">
              {segment === 'Funnel Level' ? selectedPlan?.leadGenName : selectedPlan?.planName} ({billingCycle})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Amount</span>
            <span className="font-medium text-white">{formatCurrency(total, currency)}</span>
          </div>
        </div>
        {paymentMethod === 'payu' && (
          <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-700/30 text-xs text-blue-200">
            <div>
              PayU will charge approximately{' '}
              <span className="font-semibold text-white">
                {payuQuoteLoading
                  ? 'Calculating…'
                  : payuInrDisplay ?? '—'}
              </span>
            </div>
            <div className="text-[11px] text-blue-300">
              {formatCurrency(total, currency)} at rate {payuQuoteLoading ? '—' : payuRateDisplay ?? 'unavailable'}
            </div>
            {payuQuoteError && (
              <div className="text-red-300 mt-1">
                {payuQuoteError}
              </div>
            )}
          </div>
        )}

        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input type="checkbox" className="rounded" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
          I agree to the Terms & Privacy Policy
        </label>

        <div className="mt-2">
          <button
            onClick={handlePayment}
            disabled={!agreeTerms || !selectedPlan || (segment === 'Funnel Level' ? typeof selectedPlan.minimumPrice !== 'number' : typeof selectedPlan.price !== 'number') || processing}
            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 text-base ${
              !agreeTerms || !selectedPlan || (segment === 'Funnel Level' ? typeof selectedPlan.minimumPrice !== 'number' : typeof selectedPlan.price !== 'number') || processing
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105'
            }`}
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Processing...
              </span>
            ) : (
              <>
                {paymentMethod === 'stripe' && 'Pay via Stripe Checkout'}
                {paymentMethod === 'paypal' && 'Pay with PayPal'}
                {paymentMethod === 'payu' && 'Pay via PayU'}
              </>
            )}
          </button>
        </div>

        {paymentSuccess && (
          <div className="p-3 rounded-lg bg-green-900/20 border border-green-700 text-green-400 text-xs">
            Subscription started successfully. You will receive a confirmation email shortly.
          </div>
        )}

        <div className="flex justify-between">
          <button className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm" onClick={goToPrev}>Back</button>
          <button disabled className="px-4 py-2 rounded-lg bg-gray-600 text-gray-400 cursor-not-allowed text-sm">Start Subscription</button>
        </div>
      </div>
    </div>
    );
  };


  const SummaryPanel = () => (
    <aside className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-4 h-fit">
      <h3 className="font-semibold mb-3 text-white text-sm">Subscription Summary</h3>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between"><span className="text-gray-400">Plan</span><span className="font-medium text-white">{segment === 'Funnel Level' ? (selectedPlan?.leadGenName || '—') : (selectedPlan?.planName || '—')}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Billing Cycle</span><span className="font-medium text-white">{billingCycle}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Price</span><span className="font-medium text-white">
          {segment === 'Funnel Level' && typeof selectedPlan?.minimumPrice === 'number'
            ? formatCurrency(subtotal, currency)
            : typeof selectedPlan?.price === 'number'
            ? formatCurrency(subtotal, currency)
            : String(selectedPlan?.price || '—')}
        </span></div>
        <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="font-medium text-white">{formatCurrency(subtotal, currency)}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">Taxes</span><span className="font-medium text-white">{formatCurrency(taxes, currency)}</span></div>
        <div className="flex justify-between border-t border-gray-700 pt-2"><span className="text-white font-semibold">Total</span><span className="text-white font-semibold">{formatCurrency(total, currency)}</span></div>
        {paymentMethod === 'payu' && (
          <div className="flex justify-between">
            <span className="text-blue-200">PayU Charge (INR)</span>
            <span className="font-medium text-blue-200">
              {payuQuoteLoading
                ? 'Calculating…'
                : payuInrDisplay ?? (payuQuoteError ? 'Unavailable' : '—')}
            </span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <label className="block text-xs text-gray-400 mb-1">Coupon Code (optional)</label>
        <div className="flex gap-2">
          <input className="flex-1 rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-xs placeholder-gray-400" value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Enter code" />
          <button className="px-3 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 text-xs">Apply</button>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs text-gray-500">Cancel anytime.</p>
      </div>
      {selectedPlan?.features && selectedPlan.features.length > 0 && (
        <div className="mt-4">
          <p className="font-medium text-xs mb-2 text-white">What's included</p>
          <ul className="list-disc pl-4 text-xs text-gray-400 space-y-1">
            {(selectedPlan.features || []).map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen bg-black overflow-x-hidden overflow-y-auto relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Subscription</h1>
            <p className="text-gray-400">Choose your plan and complete the checkout process</p>
          </div>

          {/* Plan selection controls */}
          <div className="mb-8 flex justify-center">
            <div className="flex flex-wrap gap-4 items-center bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Segment:</span>
                <select className="rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm" value={segment} onChange={(e) => setSegment(e.target.value as 'Personal' | 'Business')} aria-label="Segment selector">
                  <option value="Personal">Personal</option>
                  <option value="Business">Business</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Cycle:</span>
                <select className="rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm" value={billingCycle} onChange={(e) => setBillingCycle(e.target.value as 'Monthly' | 'Yearly')} aria-label="Billing cycle selector">
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">Plan:</span>
                {segment === 'Funnel Level' ? (
                  <select className="rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm" value={leadGenName} onChange={(e) => setLeadGenName(e.target.value)} aria-label="Lead Gen Model selector">
                    {availablePlans.map((p) => (
                      <option key={`${p.leadGenName}-${p.billingCycle}`} value={p.leadGenName}>{p.leadGenName}</option>
                    ))}
                  </select>
                ) : (
                  <select className="rounded-lg border border-gray-700 bg-gray-800 text-white px-3 py-2 text-sm" value={planName} onChange={(e) => setPlanName(e.target.value)} aria-label="Plan selector">
                    {availablePlans.map((p) => (
                      <option key={`${p.planName}-${p.billingCycle}`} value={p.planName}>{p.planName}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-1">
              <LeftSidebar />
            </div>

            {/* Main Content - All Sections Vertically Stacked */}
            <div className="lg:col-span-2">
              <AuthSection />
              <BillingSection />
              <PaymentSection />
              <ReviewSection />
            </div>

            {/* Right Sidebar - Summary */}
            <div className="lg:col-span-1">
              <SummaryPanel />
            </div>
          </div>

          {loadingPricing && (
            <div className="mt-4 text-xs text-gray-400 text-center">Loading pricing…</div>
          )}
          {loadError && (
            <div className="mt-4 text-xs text-red-400 text-center">{loadError}</div>
          )}
        </div>
      </div>
    </div>
  );
}