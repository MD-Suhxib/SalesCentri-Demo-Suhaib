'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Zap, 
    Target, 
    MessageSquare, 
    TrendingUp, 
    Users, 
    Clock,
    ArrowRight,
    Quote,
    Search,
    Settings2,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';

export default function SocialMediaPage() {
    const [input, setInput] = useState('');
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [subtitleIndex, setSubtitleIndex] = useState(0);
    const [subtitleBlink, setSubtitleBlink] = useState(false);

    const placeholderQuestions = [
        "Please share your personal LinkedIn profile URL.",
        "Please share your company website.",
        "Please share your company's LinkedIn profile URL.",
    ];

    const subtitleMessages = [
        "The Only AI-Powered Sales Search Engine",
        "Delivering Intelligent Insights and Real-Time Solutions",
        "Not Just Recommendations or Options, the Complete Solution",
    ];

    // Rotate placeholder text
    useEffect(() => {
        if (input.length > 0) return;
        
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentPlaceholder((prev) => (prev + 1) % placeholderQuestions.length);
                setIsAnimating(false);
            }, 300);
        }, 4000);

        return () => clearInterval(interval);
    }, [input.length, placeholderQuestions.length]);

    // Rotate subtitle messages
    useEffect(() => {
        const interval = setInterval(() => {
            setSubtitleBlink(true);
            setTimeout(() => {
                setSubtitleIndex((prev) => (prev + 1) % subtitleMessages.length);
                setSubtitleBlink(false);
            }, 500);
        }, 6000);
        return () => clearInterval(interval);
    }, [subtitleMessages.length]);

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

    const textSuggestions = [
        "Create my ICP list",
        "Generate leads",
        "Identify target audience",
        "Start campaign",
        "Verify my list",
        "Enrich my list",
        "Leads from healthcare companies",
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section - Exact match to homepage */}
            <section className="hero-section relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-black to-black" />
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/5 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-24">
                    {/* SalesGPT Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-6"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-mediumbold text-blue-400 drop-shadow-2xl tracking-wide font-poppins">
                            SalesGPT
                        </h1>
                    </motion.div>

                    {/* Animated Subtitle */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mb-10"
                    >
                        <p className={`text-base sm:text-lg md:text-xl lg:text-xl tracking-wide text-center px-4 font-dm-sans font-normal transition-all duration-400 ${subtitleBlink ? 'opacity-0' : 'opacity-100'} text-blue-200`}
                           style={{ minHeight: '2.5em' }}>
                            {subtitleMessages[subtitleIndex]}
                        </p>
                    </motion.div>

                    {/* Search Box Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="relative max-w-3xl mx-auto"
                    >
                        {/* Generate leads badge */}
                        <div className="absolute -top-3 right-4 z-10">
                            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                Generate your first 10 leads now
                            </div>
                        </div>

                        {/* Main Search Box */}
                        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl shadow-cyan-500/5">
                            {/* Input Row */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-2 text-gray-400 text-sm whitespace-nowrap">
                                    <Settings2 className="w-4 h-4" />
                                </div>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={placeholderQuestions[currentPlaceholder]}
                                        className={`w-full bg-transparent text-white placeholder-gray-500 focus:outline-none text-base transition-opacity ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
                                    />
                                </div>
                                {/* Submit Button */}
                                <button className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                                    <ArrowRight className="w-5 h-5 text-white" />
                                </button>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center justify-between border-t border-gray-700/50 pt-4">
                                <div className="flex items-center gap-2">
                                    {/* Lightning Mode Button */}
                                    <button className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-sm font-medium">
                                        <Zap className="w-4 h-4" />
                                        Lightning Mode
                                    </button>
                                    
                                    {/* Search Icon */}
                                    <button className="w-9 h-9 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg flex items-center justify-center transition-colors">
                                        <Search className="w-4 h-4 text-gray-400" />
                                    </button>
                                    
                                    {/* Target Icon */}
                                    <button className="w-9 h-9 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg flex items-center justify-center transition-colors">
                                        <Target className="w-4 h-4 text-gray-400" />
                                    </button>
                                    
                                    {/* Settings Icon */}
                                    <button className="w-9 h-9 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg flex items-center justify-center transition-colors">
                                        <Settings2 className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Suggestion Buttons */}
                        <div className="flex flex-wrap justify-center gap-3 mt-6">
                            {textSuggestions.slice(0, 4).map((suggestion) => (
                                <button
                                    key={suggestion}
                                    className="bg-gray-900/60 hover:bg-gray-800/60 border border-gray-700/50 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors hover:border-gray-600"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 mt-3">
                            {textSuggestions.slice(4).map((suggestion) => (
                                <button
                                    key={suggestion}
                                    className="bg-gray-900/60 hover:bg-gray-800/60 border border-gray-700/50 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors hover:border-gray-600"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Discover More */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-center mt-16"
                    >
                        <p className="text-gray-500 text-sm mb-2">Discover more</p>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <ChevronDown className="w-6 h-6 text-gray-500 mx-auto" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Journey Section */}
            <section className="py-20 bg-gradient-to-b from-black to-[#0d1117]">
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
                                {stats.map((stat) => (
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
            <section className="py-20 bg-gradient-to-b from-[#0d1117] to-black">
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
                                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition-all"
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
            <section className="py-12 bg-black border-t border-gray-800">
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
