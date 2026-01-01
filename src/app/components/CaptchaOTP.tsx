"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface CaptchaOTPProps {
  onCaptchaVerified: (verified: boolean) => void;
  className?: string;
}

export const CaptchaOTP: React.FC<CaptchaOTPProps> = ({
  onCaptchaVerified,
  className = "",
}) => {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState("");

  // Generate random captcha text
  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput("");
    setCaptchaVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Verify captcha
  const verifyCaptcha = () => {
    if (userInput.toLowerCase() === captchaText.toLowerCase()) {
      setCaptchaVerified(true);
      onCaptchaVerified(true);
      setError("");
    } else {
      setError("Captcha verification failed. Please try again.");
      generateCaptcha();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Captcha Section */}
      <div className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-blue-400" />
          Security Verification
        </h4>
        
        <div className="flex items-center space-x-3">
          <div className="bg-white text-black px-4 py-2 rounded font-mono text-lg font-bold tracking-wider">
            {captchaText}
          </div>
          <button
            onClick={generateCaptcha}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Refresh captcha"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 flex items-center space-x-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter captcha text"
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            disabled={captchaVerified}
          />
          {!captchaVerified ? (
            <button
              onClick={verifyCaptcha}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Verify
            </button>
          ) : (
            <div className="flex items-center text-green-400">
              <CheckCircle className="w-5 h-5 mr-1" />
              <span className="text-sm">Verified</span>
            </div>
          )}
        </div>
      </div>


      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm"
        >
          {error}
        </motion.div>
      )}

    </div>
  );
};
