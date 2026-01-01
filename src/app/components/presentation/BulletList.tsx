'use client';

import { motion } from 'framer-motion';

interface BulletListProps {
  items: string[];
  className?: string;
  stagger?: boolean;
}

export default function BulletList({ items, className = '', stagger = true }: BulletListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger ? 0.1 : 0,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-1 sm:space-y-2 md:space-y-3 dark ${className}`}
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={itemVariants}
          className="flex items-start space-x-2 text-xs sm:text-sm md:text-base text-white/90 dark:text-white/90 drop-shadow-md"
        >
          <div className="flex-shrink-0 mt-1">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-500 dark:to-purple-500 rounded-full"></div>
          </div>
          <span className="leading-relaxed">{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}