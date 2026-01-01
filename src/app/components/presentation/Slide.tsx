'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function Slide({ 
  children, 
  className = '', 
  delay = 0
}: SlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
      className={`
        min-h-screen w-full flex flex-col justify-center items-center
        p-2 sm:p-3 md:p-4 lg:p-6 relative z-10
        pt-14 sm:pt-16 md:pt-18
        dark
        ${className}
      `}
    >
      {/* Content Container with Glass Effect */}
      <div 
        className="max-w-5xl w-full mx-auto bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl border border-white/20 p-2 sm:p-3 md:p-4 lg:p-6 shadow-2xl dark"
      >
        {children}
      </div>
    </motion.div>
  );
}