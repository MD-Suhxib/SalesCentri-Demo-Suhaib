'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage02() {
    const [answers, setAnswers] = useState({
        revenueTarget: '',
        leadsNeeded: '',
        monthlyBudget: '',
        dealsToClose: '',
    });
    const [isComplete, setIsComplete] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const questions = [
        {
            id: 'revenueTarget',
            label: 'What is your revenue target?',
            placeholder: 'e.g., $500,000',
        },
        {
            id: 'leadsNeeded',
            label: 'What are the number of leads needed per month?',
            placeholder: 'e.g., 500',
        },
        {
            id: 'monthlyBudget',
            label: 'What is your monthly budget?',
            placeholder: 'e.g., $10,000',
        },
        {
            id: 'dealsToClose',
            label: 'How many deals need to be closed per month?',
            placeholder: 'e.g., 20',
        },
    ];

    const handleInputChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
    };

    const allAnswered = Object.values(answers).every(answer => answer.trim() !== '');

    const handleSubmit = () => {
        if (allAnswered) {
            setIsAnalyzing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setIsComplete(true);
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Simple gradient background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20" />

            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
                <AnimatePresence mode="wait">
                    {!isComplete ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-4xl"
                        >
                            {/* Header */}
                            <div className="text-center mb-12">
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    AI Sales Intelligence Marketplace
                                </h1>
                                <p className="text-blue-400 text-lg">
                                    powered by Agentic AI
                                </p>
                            </div>

                            {/* Questions Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {questions.map((question, index) => (
                                    <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6"
                                    >
                                        <label className="block text-white text-sm font-medium mb-3">
                                            {question.label}
                                        </label>
                                        <input
                                            type="text"
                                            value={answers[question.id as keyof typeof answers]}
                                            onChange={(e) => handleInputChange(question.id, e.target.value)}
                                            placeholder={question.placeholder}
                                            className="w-full bg-black/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap justify-center gap-8 mb-8 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">10k+</div>
                                    <div className="text-gray-400 text-sm">Leads/Day</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">3X</div>
                                    <div className="text-gray-400 text-sm">Revenue</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">0.5B</div>
                                    <div className="text-gray-400 text-sm">verified contacts</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-blue-400">&lt;1 Day</div>
                                    <div className="text-gray-400 text-sm">campaign launch</div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!allAnswered || isAnalyzing}
                                    className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                                        allAnswered && !isAnalyzing
                                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 cursor-pointer'
                                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isAnalyzing ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Analyzing...
                                        </span>
                                    ) : (
                                        'Analyze My Data'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            {/* Analysis Complete */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    We Analyzed Your Data
                                </h2>
                                <p className="text-gray-400 mb-8">
                                    Your personalized sales strategy is ready
                                </p>
                            </motion.div>

                            {/* Arrow pointing down */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, y: [0, 10, 0] }}
                                transition={{ 
                                    opacity: { delay: 0.5 },
                                    y: { delay: 0.5, duration: 1.5, repeat: Infinity }
                                }}
                                className="mb-8"
                            >
                                <ChevronDown className="w-12 h-12 text-blue-400 mx-auto" />
                            </motion.div>

                            {/* Go to Lightning Mode Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Link
                                    href="/psagpt?mode=lightning"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                >
                                    <Zap className="w-6 h-6" />
                                    Go to Lightning Mode
                                </Link>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
