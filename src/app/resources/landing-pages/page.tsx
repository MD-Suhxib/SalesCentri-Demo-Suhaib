'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPagesIndex() {
    const landingPages = [
        {
            id: 1,
            title: 'Landing Page 01',
            subtitle: 'Growth Strategy Questionnaire',
            description: 'Interactive AI-powered growth strategy builder with personalized recommendations',
            icon: Rocket,
            href: '/resources/landingpage',
            gradient: 'from-blue-500 to-cyan-600',
        },
        {
            id: 2,
            title: 'Landing Page 02',
            subtitle: 'Simple Strategy Questionnaire',
            description: 'New landing page experience currently under development',
            icon: TrendingUp,
            href: '/resources/landingpage-02',
            gradient: 'from-indigo-500 to-purple-600',
        },
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
            </div>

            <div className="relative z-10 pt-32 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Landing Pages
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Explore our interactive landing pages designed to help you achieve your business goals
                        </p>
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {landingPages.map((page, index) => (
                            <motion.div
                                key={page.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                            >
                                <Link href={page.href}>
                                    <div className="group bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 cursor-pointer h-full">
                                        {/* Icon */}
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${page.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <page.icon className="w-8 h-8 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                            {page.title}
                                        </h2>
                                        <p className="text-blue-400 text-sm font-medium mb-4">
                                            {page.subtitle}
                                        </p>
                                        <p className="text-gray-400 mb-6">
                                            {page.description}
                                        </p>

                                        {/* CTA */}
                                        <div className="flex items-center gap-2 text-blue-400 group-hover:text-blue-300 transition-colors">
                                            <span className="font-medium">Explore</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
