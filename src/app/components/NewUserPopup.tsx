import React, { useState } from 'react';
import { getLoginUrl } from '../lib/loginUtils';

interface NewUserPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string }) => Promise<void>;
}

const NewUserPopup: React.FC<NewUserPopupProps> = ({ isOpen, onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({ email: email.trim() });
      // Reset form
      setEmail('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
             {/* Modal */}
       <div className="relative w-full max-w-sm">
         <div 
           className="relative rounded-3xl p-5 shadow-2xl border border-blue-400/30"
           style={{
             background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 70%, rgba(59, 130, 246, 0.3) 100%)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
           }}
         >
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-2">
              Welcome to Sales Centri!
            </h2>
            <p className="text-blue-200 text-sm">
              Join thousands of sales professionals who are accelerating their revenue with AI-powered automation.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 rounded-lg bg-black/40 border border-blue-400/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-colors"
                disabled={isSubmitting}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg p-2">
                {error}
              </div>
            )}

                         {/* Buttons */}
             <div className="space-y-2">
                               {/* Get Started button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-track="get_started_button"
                  className="w-full py-2 px-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Getting Started...
                    </div>
                  ) : (
                    'Get Started'
                  )}
                </button>

                {/* Login button */}
                <button
                  type="button"
                  onClick={handleLogin}
                  data-track="login_button"
                  className="w-full py-2 px-4 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                >
                  Login
                </button>

                {/* Stay logged out button */}
                <button
                  type="button"
                  onClick={handleClose}
                  data-track="stay_logged_out_button"
                  className="w-full py-2 px-4 rounded-full bg-black hover:bg-gray-900 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400/50"
                >
                  Stay logged out
                </button>
             </div>
          </form>

          {/* Footer */}
          <p className="text-xs text-gray-400 mt-3 text-center">
            We respect your privacy. Your information will only be used to improve your experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewUserPopup;
