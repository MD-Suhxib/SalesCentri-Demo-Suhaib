'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  LogIn,
  Upload,
  ShieldCheck,
  Rocket,
  Users,
  LucideIcon,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface Step {
  title: string;
  description: string;
  icon: string;
}

interface RegistrationFlowProps {
  title?: string;
  subtitle?: string;
}

const iconMap: Record<string, LucideIcon> = {
  LogIn,
  Upload,
  ShieldCheck,
  Rocket,
  Users,
};

const steps: Step[] = [
  {
    title: 'Authentication',
    description: 'User signs up or logs into the portal',
    icon: 'LogIn',
  },
  {
    title: 'Submission',
    description: 'Fill forms, upload documents, save draft',
    icon: 'Upload',
  },
  {
    title: 'Verification',
    description: 'Admin verifies documents and information',
    icon: 'ShieldCheck',
  },
  {
    title: 'Activation & Go-Live',
    description: 'Profile generated, marketplace activated',
    icon: 'Rocket',
  },
  {
    title: 'Active Participation',
    description: 'Business engages in marketplace activities',
    icon: 'Users',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 120,
      damping: 10,
    },
  },
};

export default function RegistrationFlow({
  title = 'Registration Flow',
  subtitle = 'Follow these steps to get started on the Sales Centri Marketplace',
}: RegistrationFlowProps) {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-black relative">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-black border border-blue-500/20 rounded-full px-5 py-2 mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm font-semibold">Streamlined Process</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
        </motion.div>

        {/* Timeline Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          {/* Steps Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-6 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = iconMap[step.icon];
              const isLast = index === steps.length - 1;

              return (
                <React.Fragment key={index}>
                  <motion.div
                    variants={stepVariants}
                    whileHover={{ y: -8 }}
                    className="flex flex-col items-center relative"
                  >
                    {/* Step Card - Fixed Height */}
                    <div className="flex flex-col items-center w-full h-full min-h-[280px] bg-black border-2 border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                      {/* Circular Icon Background */}
                      <motion.div
                        variants={iconVariants}
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="relative mb-6 flex-shrink-0"
                      >
                        {/* Animated Glow */}
                        <div className="absolute inset-0 w-24 h-24 bg-blue-500/30 rounded-full blur-xl animate-pulse" />

                        {/* Inner Circle Background */}
                        <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl border-4 border-black">
                          {/* Icon */}
                          <IconComponent
                            className="w-12 h-12 text-white"
                            strokeWidth={2}
                          />
                        </div>

                        {/* Step Number Badge */}
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 border-4 border-black rounded-full flex items-center justify-center text-base font-bold text-white shadow-lg">
                          {index + 1}
                        </div>
                      </motion.div>

                      {/* Step Content - Fixed Layout */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-center flex flex-col"
                      >
                        <h3 className="text-xl font-bold text-white mb-3 leading-tight h-14 flex items-center justify-center">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>

                    {/* Arrow Connector - Desktop (Sleek Design) */}
                    {!isLast && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20"
                      >
                        <motion.div
                          animate={{
                            x: [0, 3, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="w-6 h-6 text-blue-400/60" strokeWidth={2.5} />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Arrow Connector - Mobile/Tablet (Vertical) */}
                    {!isLast && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="lg:hidden flex items-center justify-center mt-6 mb-6"
                      >
                        <motion.div
                          animate={{
                            y: [0, 3, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ArrowRight className="w-6 h-6 text-blue-400/60 rotate-90" strokeWidth={2.5} />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </React.Fragment>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-br from-blue-600/20 via-blue-700/20 to-indigo-800/20 border-2 border-blue-500/30 rounded-3xl p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to join the SalesCentri Marketplace?
              </h3>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Start your journey today and connect with thousands of potential customers
              </p>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-4 bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold rounded-xl hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-300 text-lg inline-flex items-center space-x-2"
              >
                <span>Get Started Today</span>
                <Rocket className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
