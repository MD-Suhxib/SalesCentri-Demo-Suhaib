"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Zap } from "lucide-react";
import { getLoginUrl } from "../lib/loginUtils";

interface QueryLimitGateProps {
  isOpen: boolean;
  onClose: () => void;
}

// Add type definition at the top of the file
interface WindowWithTracker extends Window {
  salescentriTrackerReady?: boolean;
}

export const QueryLimitGate: React.FC<QueryLimitGateProps> = ({
  isOpen,
  onClose,
}) => {
  // Programmatic event via external tracker
  React.useEffect(() => {
    if (!isOpen) return;
    const fire = () => {
      const w = window as unknown as {
        salescentriTrackerReady?: boolean;
        tracker?: {
          trackEvent: (
            eventType: string,
            data?: Record<string, unknown>
          ) => void;
        };
      };
      if (
        w.salescentriTrackerReady &&
        w.tracker &&
        typeof w.tracker.trackEvent === "function"
      ) {
        w.tracker.trackEvent("query_limit_reached");
      }
    };
    // Wait up to 200ms for readiness
    if (typeof window !== "undefined") {
      let done = false;
      const onReady = () => {
        if (done) return;
        done = true;
        fire();
        window.removeEventListener(
          "salescentri:tracker-ready",
          onReady as EventListener
        );
      };
      if ((window as WindowWithTracker).salescentriTrackerReady) {
        fire();
      } else {
        window.addEventListener(
          "salescentri:tracker-ready",
          onReady as EventListener,
          { once: true }
        );
        setTimeout(onReady, 200);
      }
    }
  }, [isOpen]);

  const handleLoginClick = () => {
    // Set flag to track return from login
    if (typeof window !== "undefined") {
      sessionStorage.setItem("redirected_from_login", "true");
    }
    // Redirect to external dashboard with conditional query parameters
    window.location.href = getLoginUrl();
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-md mx-3 sm:mx-4"
          >
            <div className="glass-container rounded-2xl p-6 sm:p-8 border border-blue-400/30 bg-black/40 backdrop-blur-xl">
              {/* Close button - Mobile Responsive */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* Icon - Mobile Responsive */}
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                  <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>

              {/* Content - Mobile Responsive */}
              <div className="text-center space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Query Limit Reached
                </h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  You&apos;ve used your 3 free queries! To continue exploring
                  SalesGPT and unlock unlimited access, please log in with your
                  business email.
                </p>

                {/* Features list - Mobile Responsive */}
                <div className="bg-blue-500/10 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
                  <div className="flex items-center space-x-2 text-blue-300 text-xs sm:text-sm">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Unlimited AI queries</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300 text-xs sm:text-sm mt-2">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Advanced research mode</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300 text-xs sm:text-sm mt-2">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>CSV upload & analysis</span>
                  </div>
                </div>

                {/* CTA Button - Mobile Responsive */}
                <button
                  onClick={handleLoginClick}
                  className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer"
                  style={{
                    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                  }}
                >
                  Continue with Business Email
                </button>

                <p className="text-xs text-gray-400 mt-3 sm:mt-4">
                  Free forever • No credit card required
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
