'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Zap, Brain, Database } from 'lucide-react';
import { getLoginUrl } from '../lib/loginUtils';

interface ResearchGPTGateProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchGPTGate: React.FC<ResearchGPTGateProps> = ({
  isOpen,
  onClose
}) => {
  const handleLoginClick = () => {
    // Save current URL to restore results after login
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.href;
      localStorage.setItem('researchGPT_redirect_url', currentUrl);
      
      // Also preserve guest research data if it exists
      const guestResults = localStorage.getItem('researchGPT_guest_results');
      if (guestResults) {
        localStorage.setItem('researchGPT_preserve_on_login', 'true');
      }
    }
    
    // Redirect to external dashboard with current URL preserved
    window.location.href = getLoginUrl(true);
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
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-700 flex items-center justify-center">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              
              {/* Content - Mobile Responsive */}
              <div className="text-center space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Unlock Unlimited Research
                </h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  You've seen your research results! Log in or sign up to save this report, run unlimited queries, and access advanced features like sharing, exporting, and more.
                </p>
                
                {/* Features list - Mobile Responsive */}
                <div className="bg-purple-500/10 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
                  <div className="flex items-center space-x-2 text-purple-300 text-xs sm:text-sm">
                    <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Advanced AI research & analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300 text-xs sm:text-sm mt-2">
                    <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Access to comprehensive market data</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300 text-xs sm:text-sm mt-2">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Unlimited research queries</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-300 text-xs sm:text-sm mt-2">
                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Deep industry insights</span>
                  </div>
                </div>
                
                {/* CTA Button - Mobile Responsive */}
                <button
                  onClick={handleLoginClick}
                  className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-500 hover:to-blue-600 hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer"
                  style={{
                    boxShadow: '0 4px 16px rgba(147, 51, 234, 0.3)'
                  }}
                >
                  Log In / Sign Up to Continue
                </button>
                
                <p className="text-xs text-gray-400 mt-3 sm:mt-4">
                  Your research results will be saved • No credit card required
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
