"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Target, Zap } from "lucide-react";
import Link from "next/link";
import { DashboardPreview } from "./DashboardPreview";
import { Aurora } from "./Aurora";

export const Hero = () => {
  return (
    <section className="hero-section min-h-screen relative overflow-hidden bg-black flex items-center">
      {/* Modern dark background with subtle gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-blue-500/5 rounded-full blur-[120px] opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 text-center lg:text-left relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-blue-400 fill-blue-400/20" />
              <span className="text-gray-300 text-sm font-medium">
                Next Gen Sales Intelligence
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Automate Your <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Sales Pipeline
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Stop chasing leads. Start closing deals. Our AI agents handle prospecting, outreach, and scheduling so you can focus on revenue.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
            >
              <Link href="/get-started" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-black px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  data-track="hero_get_started"
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/get-started/book-demo" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-4 rounded-xl font-semibold text-white border border-white/10 hover:border-white/20 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                  data-track="hero_watch_demo"
                  onClick={(e) => {
                    e.preventDefault();
                    const videoSection = document.querySelector(".video-section");
                    if (videoSection) {
                      videoSection.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                >
                  <Target className="w-4 h-4 text-blue-400" />
                  Watch Demo
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-8 border-t border-white/5 flex items-center justify-center lg:justify-start gap-8"
            >
              {[
                { value: "10K+", label: "Leads/Day" },
                { value: "95%", label: "Accuracy" },
                { value: "3x", label: "Revenue" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 animate-pulse" />
            <div className="relative rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-2xl">
              <DashboardPreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
