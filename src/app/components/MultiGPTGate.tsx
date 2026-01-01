'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Brain, Database, BarChart3 } from 'lucide-react';
import { getLoginUrl } from '../lib/loginUtils';

interface MultiGPTGateProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiGPTGate: React.FC<MultiGPTGateProps> = ({
  isOpen,
  onClose
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleLoginClick = () => {
    // Set flag to track return from login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirected_from_login', 'true');
    }
    // Redirect to external dashboard with current URL preserved
    window.location.href = getLoginUrl(true);
  };

  if (!mounted) return null;

  const gateContent = (
    <AnimatePresence>
      {isOpen && (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
        overflowY: 'auto',
        overflowX: 'hidden',
        minHeight: '100vh',
        minWidth: '100vw'
      }}
    >
      {/* Min-height wrapper for proper centering */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          minHeight: 'calc(100vh - 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 0',
          boxSizing: 'border-box',
          width: '100%',
          flexShrink: 0
        }}
      >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
            onClick={onClose}
            style={{ position: 'absolute' }}
          />

          {/* Modal - Mobile Responsive */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-md mx-3 sm:mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: 'calc(100vh - 2rem)',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
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
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>

              {/* Content - Mobile Responsive */}
              <div className="text-center space-y-3 sm:space-y-4">
                <h2 id="gate-title" className="text-xl sm:text-2xl font-bold text-white">
                  Multi GPT: Aggregated Research
                </h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  Access advanced multi-model AI research capabilities with comprehensive analysis across multiple AI models. Sign up or log in to unlock unlimited research features.
                </p>

                {/* Features list - Mobile Responsive */}
                <div className="bg-blue-500/10 rounded-lg p-3 sm:p-4 mt-4 sm:mt-6">
                  <div className="flex items-center space-x-2 text-blue-300 text-xs sm:text-sm">
                    <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Multi-model AI research & analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300 text-xs sm:text-sm mt-2">
                    <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Compare results across GPT-4O, Gemini, Claude & more</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300 text-xs sm:text-sm mt-2">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>CSV upload & bulk analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300 text-xs sm:text-sm mt-2">
                    <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span>Advanced analytics & insights</span>
                  </div>
                </div>

                {/* CTA Button - Mobile Responsive */}
                <button
                  onClick={handleLoginClick}
                  className="w-full mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600 hover:scale-105 transition-all duration-200 shadow-lg cursor-pointer"
                  style={{
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
                  }}
                >
                  Sign Up / Log In to Continue
                </button>

                <p className="text-xs text-gray-400 mt-3 sm:mt-4">
                  Free forever • No credit card required
                </p>
              </div>
            </div>
          </motion.div>
      </div>
    </div>
      )}
    </AnimatePresence>
  );

  // Use portal to render gate at document root, avoiding parent container constraints
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(gateContent, document.body);
  }

  return null;
};

export default MultiGPTGate;
