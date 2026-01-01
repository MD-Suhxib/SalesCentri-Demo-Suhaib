'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Hero } from '../../components/Hero';
import { VideoSection } from '../../components/VideoSection';
import { Features } from '../../components/Features';
import { ROICalculator } from '../../components/ROICalculator';
import { Workflow } from '../../components/Workflow';
import { Pricing } from '../../components/Pricing';
import { ContactForm } from '../../components/ContactForm';
import HomepageSalesGPT from '../../components/HomepageSalesGPT';
import PaymentSuccessPopup from '../../components/PaymentSuccessPopup';

export const HomePage = () => {
  const searchParams = useSearchParams();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    amount: number;
    currency: string;
    plan: string;
    paymentId: string;
  } | null>(null);

  useEffect(() => {
    // Check for payment success parameters
    const paymentSuccess = searchParams.get('payment_success');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');
    const plan = searchParams.get('plan');
    const paymentId = searchParams.get('payment_id');

    if (paymentSuccess === 'true' && amount && currency && plan && paymentId) {
      setPaymentData({
        amount: parseFloat(amount),
        currency,
        plan,
        paymentId
      });
      setShowPaymentSuccess(true);

      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('payment_success');
      url.searchParams.delete('amount');
      url.searchParams.delete('currency');
      url.searchParams.delete('plan');
      url.searchParams.delete('payment_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  const handleClosePaymentSuccess = () => {
    setShowPaymentSuccess(false);
    setPaymentData(null);
  };

  return (
    <div className="min-h-screen bg-black overflow-x-hidden overflow-y-auto relative">
      <HomepageSalesGPT />
      <VideoSection />
      <Hero />
      {/* Spacer between Hero section and Features */}
      <div className="h-16 md:h-24 lg:h-32 bg-black"></div>
      <Features />
      
      <ROICalculator />
      <Workflow />
      <Pricing />
      <ContactForm />

      {/* Payment Success Popup */}
      {showPaymentSuccess && paymentData && (
        <PaymentSuccessPopup
          amount={paymentData.amount}
          currency={paymentData.currency}
          plan={paymentData.plan}
          paymentId={paymentData.paymentId}
          onClose={handleClosePaymentSuccess}
        />
      )}
    </div>
  );
};
