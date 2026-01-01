'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage02() {
    return (
        <div className="min-h-screen bg-black">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-2xl"
                >
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30">
                            <Rocket className="w-12 h-12 text-white" />
                        </div>
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Landing Page 02
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Coming Soon
                    </p>
                    <p className="text-gray-500 mb-12">
                        This landing page is currently under development. Check back soon for exciting new content!
                    </p>

                    <Link
                        href="/resources/landingpage"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                        Visit Landing Page 01
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
