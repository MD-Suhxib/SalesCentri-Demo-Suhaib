'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  className = '',
  delay = 0
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`
        bg-white/20 backdrop-blur-md rounded-lg p-2 sm:p-3 md:p-4
        shadow-lg hover:shadow-xl transition-all duration-300
        border border-white/30 hover:border-white/50
        dark
        ${className}
      `}
    >
      {icon && (
        <div className="mb-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-500 dark:to-purple-600 rounded-lg flex items-center justify-center text-white dark:text-white text-xs sm:text-sm">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-sm sm:text-base font-bold text-white dark:text-white mb-1 sm:mb-2 drop-shadow-md">
        {title}
      </h3>
      <p className="text-xs text-white/80 leading-relaxed drop-shadow-sm">
        {description}
      </p>
    </motion.div>
  );
}