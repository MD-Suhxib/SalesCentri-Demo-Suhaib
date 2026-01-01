'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

interface PaymentSuccessPopupProps {
  amount: number;
  currency: string;
  plan: string;
  paymentId: string;
  onClose: () => void;
}

export default function PaymentSuccessPopup({
  amount,
  currency,
  plan,
  paymentId,
  onClose
}: PaymentSuccessPopupProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  // Popup remains visible until the user closes it manually
   
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close payment success popup"
              title="Close"
            >
              <X size={20} />
            </button>

            {/* Success icon */}
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.5 }}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <CheckCircle className="w-8 h-8 text-green-400" />
              </motion.div>
            </div>

            {/* Success message */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                You've paid <span className="font-semibold text-green-400">
                  {currency} {amount.toFixed(2)}
                </span> for the <span className="font-semibold text-blue-400">
                  {plan}
                </span> plan.
              </p>
              <p className="text-gray-400 text-xs">
                Your credits will be credited shortly. You'll receive a confirmation email with your receipt.
              </p>
            </div>

            {/* Payment details */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
              <div className="text-xs text-gray-400 space-y-1">
                <div className="flex justify-between">
                  <span>Payment ID:</span>
                  <span className="text-gray-300 font-mono">{paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="text-gray-300">{currency} {amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plan:</span>
                  <span className="text-gray-300">{plan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-400">Completed</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  handleClose();
                  window.location.href = '/get-started/book-demo';
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Book Meeting
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-600 hover:bg-gray-800 text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
