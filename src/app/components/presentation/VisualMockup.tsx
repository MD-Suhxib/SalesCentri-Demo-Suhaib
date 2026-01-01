'use client';

import { motion } from 'framer-motion';

interface VisualMockupProps {
  title?: string;
  subtitle?: string;
  height?: string;
  width?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function VisualMockup({ 
  title, 
  subtitle, 
  height = 'h-28 sm:h-32 md:h-36 lg:h-40 xl:h-48', 
  width = 'w-full',
  className = '',
  children
}: VisualMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`dark ${className}`}
    >
      {title && (
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white dark:text-white mb-1 sm:mb-2 drop-shadow-md">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-white/70 dark:text-white/70 mb-2 sm:mb-3 text-xs sm:text-sm drop-shadow-sm">
          {subtitle}
        </p>
      )}
      <div className={`
        ${height} ${width}
        bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md
        dark:from-white/20 dark:to-white/10
        rounded-xl sm:rounded-2xl shadow-lg border border-white/30
        flex items-center justify-center
        relative overflow-hidden
        dark
      `}>
        {children ? (
          children
        ) : (
          <div className="text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/30 dark:bg-white/30 rounded-lg mb-2 sm:mb-3 mx-auto"></div>
            <p className="text-white/70 font-medium drop-shadow-md text-xs sm:text-sm">
              {title || 'Visual Mockup'}
            </p>
          </div>
        )}
        
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 flex space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  );
}