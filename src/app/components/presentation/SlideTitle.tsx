'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideTitleProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
  center?: boolean;
}

export default function SlideTitle({ 
  children, 
  subtitle, 
  className = '', 
  center = false 
}: SlideTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`mb-3 sm:mb-4 md:mb-6 ${center ? 'text-center' : ''} ${className} dark`}
    >
      <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-purple-100 leading-tight mb-1 sm:mb-2 drop-shadow-lg">
        {children}
      </h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-xs sm:text-sm md:text-base text-white/80 dark:text-white/80 max-w-xl drop-shadow-md"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}