'use client';

import { motion } from 'framer-motion';

interface FlowStep {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface FlowDiagramProps {
  steps: FlowStep[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export default function FlowDiagram({ 
  steps, 
  direction = 'horizontal', 
  className = '' 
}: FlowDiagramProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const isHorizontal = direction === 'horizontal';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`
        flex ${isHorizontal ? 'flex-col items-center' : 'flex-col items-start'} 
        ${isHorizontal ? 'justify-center space-y-4' : 'space-y-4'}
        dark
        ${className}
      `}
    >
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <motion.div
            variants={stepVariants}
            className="relative"
          >
            {/* Step Card */}
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 shadow-lg border border-white/30 text-center min-w-[140px] max-w-[200px] dark">
              {step.icon && (
                <div className="mb-2 flex justify-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-500 dark:to-purple-600 rounded-lg flex items-center justify-center text-white dark:text-white text-sm">
                    <div className="flex items-center justify-center w-full h-full">
                      {step.icon}
                    </div>
                  </div>
                </div>
              )}
              <h3 className="font-bold text-white dark:text-white mb-1 drop-shadow-md text-sm">
                {step.title}
              </h3>
              {step.description && (
                <p className="text-xs text-white/80 dark:text-white/80 drop-shadow-sm">
                  {step.description}
                </p>
              )}
            </div>

            {/* Step Number */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 dark:from-purple-500 dark:to-blue-600 rounded-full flex items-center justify-center text-white dark:text-white text-xs font-bold">
              {index + 1}
            </div>
          </motion.div>

          {/* Simple Connector */}
          {index < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.2 + 0.5 }}
              className="my-3 flex flex-col items-center"
            >
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-500 dark:from-blue-400 dark:to-purple-500 rounded-full"></div>
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
}