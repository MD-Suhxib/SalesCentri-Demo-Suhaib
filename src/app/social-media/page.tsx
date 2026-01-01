'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    Target, 
    MessageSquare, 
    TrendingUp, 
    Users, 
    Clock,
    ArrowRight,
    CheckCircle,
    Quote
} from 'lucide-react';
import Link from 'next/link';

export default function SocialMediaPage() {
    const journeySteps = [
        {
            title: 'Identify',
            description: 'Automated follow-ups & reminders to keep leads engaged',
            icon: Target,
        },
        {
            title: 'Engage',
            description: 'Personalized multi-channel outreach campaigns',
            icon: MessageSquare,
        },
        {
            title: 'Convert',
            description: 'Automated follow-ups & deal closing automation',
            icon: TrendingUp,
        },
    ];

    const stats = [
        { value: '+340%', label: 'Revenue Growth', icon: TrendingUp },
        { value: '+185%', label: 'Conversion Rate', icon: Target },
        { value: '+450%', label: 'Lead Generation', icon: Users },
        { value: '-65%', label: 'Time Saved', icon: Clock },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f]">
            {/* Hero Section */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
                
                <div className="relative z-10 max-w-6xl mx-auto px-4">
                    {/* Hero Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Sales<span className="text-blue-400">GPT</span>
                        </h1>
                        <p className="text-xl text-gray-400 mb-8">
                            The Only AI-Powered Sales Search Engine
                        </p>

                        {/* Search Box */}
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400 text-sm">My company website is :</span>
                                    <input
                                        type="text"
                                        placeholder="www.salescentri.com"
                                        className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                                    />
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                        <Zap className="w-4 h-4" />
                                        Lightning Mode
                                    </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap justify-center gap-3 mt-6">
                                    {['Create my ICP list', 'Generate leads', 'Identify target audience', 'Start campaign'].map((action) => (
                                        <button
                                            key={action}
                                            className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap justify-center gap-3 mt-3">
                                    {['Verify my list', 'Enrich my list', 'Leads from healthcare companies'].map((action) => (
                                        <button
                                            key={action}
                                            className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Discover More */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-12"
                        >
                            <p className="text-gray-500 text-sm mb-2">Discover more</p>
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="text-gray-500"
                            >
                                ↓
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="py-16 bg-gradient-to-b from-[#0a0a0f] to-[#0d1117]">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Take Your Business To New Heights
                        </h2>
                        <p className="text-blue-400 text-lg">Your End to end journey</p>
                    </motion.div>

                    {/* Journey Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {journeySteps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center hover:border-blue-500/50 transition-all"
                            >
                                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <step.icon className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-400 mb-3">{step.title}</h3>
                                <p className="text-gray-400">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results & Testimonial Section */}
            <section className="py-16 bg-[#0d1117]">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Results Achieved */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-8">Results Achieved:</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {stats.map((stat, index) => (
                                    <div
                                        key={stat.label}
                                        className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <stat.icon className="w-5 h-5 text-blue-400" />
                                            <span className={`text-2xl font-bold ${stat.value.startsWith('-') ? 'text-green-400' : 'text-blue-400'}`}>
                                                {stat.value}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Client Testimonial */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-8">Client Testimonial:</h3>
                            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-8">
                                <Quote className="w-8 h-8 text-blue-400/50 mb-4" />
                                <p className="text-gray-300 text-lg italic mb-6">
                                    "Sales Centri transformed our entire sales process. We went from struggling with lead quality to closing enterprise deals 3x faster."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                        S
                                    </div>
                                    <div>
                                        <p className="text-blue-400 font-medium">— Sarah Johnson, VP of Sales</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-[#0d1117] to-[#0a0a0f]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Be Our Next Success Story?
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Join 1,500+ companies that have transformed their sales performance. Start your journey today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/get-started"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-colors"
                            >
                                Start with SalesGPT
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/contact"
                                className="bg-transparent border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-full font-medium transition-colors"
                            >
                                Get Custom Strategy
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer Newsletter */}
            <section className="py-12 bg-[#0a0a0f] border-t border-gray-800">
                <div className="max-w-xl mx-auto px-4">
                    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6">
                        <h4 className="text-white font-bold mb-2">Stay Updated</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe to our newsletter for the latest updates and insights.
                        </p>
                        <div className="flex gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
