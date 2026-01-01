'use client';

import { motion } from 'framer-motion';
import { Video, UserPlus, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Aurora } from '../components/Aurora';

export default function GetStartedPage() {
  const options = [
    {
      title: "Sign Up",
      // Removed the '14-day free trial' line per request and point Sign Up to the dashboard login
      description: "Create an account to access your dashboard",
      icon: UserPlus,
      href: "/login-portal",
      cta: "Sign Up",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "group-hover:border-green-500/50"
    },
    {
      title: "Book a Demo",
      description: "Schedule a personalized demo with our sales team",
      icon: Video,
      href: "/get-started/book-demo",
      cta: "Book a Demo",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "group-hover:border-blue-500/50"
    },
    {
      title: "Contact Form",
      description: "Get in touch with our experts",
      icon: MessageSquare,
      href: "/get-started/contact-form",
      cta: "Contact Us",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "group-hover:border-purple-500/50"
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Aurora />
      
      <section className="pt-24 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Start Your Journey</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Get Started with{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Sales Centri
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Choose the path that best fits your needs and begin transforming your sales process with our AI-powered platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {options.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={option.href}>
                  <div className={`h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 ${option.border} hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1`}>
                    <div className={`w-12 h-12 ${option.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      <option.icon className={`w-6 h-6 ${option.color}`} />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors">
                      {option.title}
                    </h3>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300">
                      {option.description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                      <span>{option.cta}</span>
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}