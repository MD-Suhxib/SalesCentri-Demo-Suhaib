'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Users, Database, Rocket, Search, Sparkles, ChevronRight, ChevronDown, TrendingUp, RefreshCw, ArrowUpCircle, Globe } from 'lucide-react';

// Growth Strategy Types
type GrowthStrategy = 'Q1' | 'Q2' | 'Q3' | 'Q4';

interface Question {
    id: number;
    question: string;
    placeholder: string;
}

interface StrategyOption {
    id: GrowthStrategy;
    title: string;
    description: string;
    icon: any;
    color: string;
}

interface Visualization {
    title: string;
    subtitle: string;
    color: string;
    icon: any;
}

export default function LandingPage() {
    const [growthStrategy, setGrowthStrategy] = useState<GrowthStrategy | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 for strategy selection
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    // Strategy Selection Options
    const strategyOptions: StrategyOption[] = [
        {
            id: 'Q2',
            title: 'Revenue Optimization',
            description: 'Grow revenue from existing customers using current offerings',
            icon: RefreshCw,
            color: 'from-green-500 to-emerald-600'
        },
        {
            id: 'Q1',
            title: 'New Customer Acquisition',
            description: 'Acquire new customers using current offerings',
            icon: Users,
            color: 'from-blue-500 to-cyan-600'
        },
        {
            id: 'Q3',
            title: 'Upsell / Expansion',
            description: 'Sell new products or upgrades to existing customers',
            icon: ArrowUpCircle,
            color: 'from-purple-500 to-pink-600'
        },
        {
            id: 'Q4',
            title: 'New Market Entry',
            description: 'Enter new markets with new products',
            icon: Globe,
            color: 'from-orange-500 to-red-600'
        }
    ];

    // Question Sets for Each Strategy
    const questionSets: Record<GrowthStrategy, Question[]> = {
        Q1: [ // New Customer Acquisition
            { id: 1, question: 'What is your revenue target?', placeholder: 'e.g., $1M annually' },
            { id: 2, question: 'How many leads do you need per month?', placeholder: 'e.g., 500 leads' },
            { id: 3, question: 'What is your monthly acquisition budget?', placeholder: 'e.g., $5,000' },
            { id: 4, question: 'How many deals need to be closed per month?', placeholder: 'e.g., 20 deals' },
            { id: 5, question: 'What is your primary industry?', placeholder: 'e.g., SaaS, Healthcare, Finance' },
        ],
        Q2: [ // Revenue Optimization
            { id: 1, question: 'How many active customers do you have?', placeholder: 'e.g., 1,000 customers' },
            { id: 2, question: 'What is your average order value (AOV)?', placeholder: 'e.g., $500' },
            { id: 3, question: 'What is the purchase frequency per customer?', placeholder: 'e.g., 3 times per year' },
            { id: 4, question: 'What is your retention or churn rate?', placeholder: 'e.g., 85% retention or 15% churn' },
            { id: 5, question: 'What is your revenue growth target?', placeholder: 'e.g., 25% year-over-year' },
        ],
        Q3: [ // Upsell / Expansion
            { id: 1, question: 'What is your existing customer base size?', placeholder: 'e.g., 500 customers' },
            { id: 2, question: 'What is the upsell or upgrade price?', placeholder: 'e.g., $200/month' },
            { id: 3, question: 'What is the estimated attach or adoption rate?', placeholder: 'e.g., 30%' },
            { id: 4, question: 'What is your sales cycle length?', placeholder: 'e.g., 2 months' },
            { id: 5, question: 'What is your revenue target from expansion?', placeholder: 'e.g., $500K annually' },
        ],
        Q4: [ // New Market Entry
            { id: 1, question: 'What is your target market or segment?', placeholder: 'e.g., Enterprise healthcare in APAC' },
            { id: 2, question: 'What is your primary industry?', placeholder: 'e.g., FinTech, EdTech' },
            { id: 3, question: 'What is your sales motion?', placeholder: 'e.g., Outbound, Inbound, PLG, Partners' },
            { id: 4, question: 'What is your monthly budget allocation?', placeholder: 'e.g., $10,000' },
            { id: 5, question: 'What is your timeframe to revenue expectations?', placeholder: 'e.g., 6-12 months' },
        ]
    };

    // Visualization data for each strategy and question
    const strategyVisualizations: Record<GrowthStrategy, Visualization[]> = {
        Q1: [
            { title: 'Revenue', subtitle: 'Target', color: 'from-blue-500 to-cyan-600', icon: Rocket },
            { title: 'Lead', subtitle: 'Generation', color: 'from-blue-500 to-cyan-600', icon: Users },
            { title: 'Budget', subtitle: 'Planning', color: 'from-blue-500 to-cyan-600', icon: Database },
            { title: 'Deal', subtitle: 'Closing', color: 'from-blue-500 to-cyan-600', icon: Zap },
            { title: 'Industry', subtitle: 'Focus', color: 'from-blue-500 to-cyan-600', icon: Sparkles },
        ],
        Q2: [
            { title: 'Customer', subtitle: 'Base', color: 'from-green-500 to-emerald-600', icon: Users },
            { title: 'Order', subtitle: 'Value', color: 'from-green-500 to-emerald-600', icon: Database },
            { title: 'Purchase', subtitle: 'Frequency', color: 'from-green-500 to-emerald-600', icon: RefreshCw },
            { title: 'Retention', subtitle: 'Rate', color: 'from-green-500 to-emerald-600', icon: TrendingUp },
            { title: 'Revenue', subtitle: 'Growth', color: 'from-green-500 to-emerald-600', icon: Rocket },
        ],
        Q3: [
            { title: 'Customer', subtitle: 'Base', color: 'from-purple-500 to-pink-600', icon: Users },
            { title: 'Upsell', subtitle: 'Price', color: 'from-purple-500 to-pink-600', icon: ArrowUpCircle },
            { title: 'Adoption', subtitle: 'Rate', color: 'from-purple-500 to-pink-600', icon: TrendingUp },
            { title: 'Sales', subtitle: 'Cycle', color: 'from-purple-500 to-pink-600', icon: Zap },
            { title: 'Expansion', subtitle: 'Revenue', color: 'from-purple-500 to-pink-600', icon: Rocket },
        ],
        Q4: [
            { title: 'Target', subtitle: 'Market', color: 'from-orange-500 to-red-600', icon: Globe },
            { title: 'Industry', subtitle: 'Focus', color: 'from-orange-500 to-red-600', icon: Sparkles },
            { title: 'Sales', subtitle: 'Motion', color: 'from-orange-500 to-red-600', icon: Zap },
            { title: 'Budget', subtitle: 'Allocation', color: 'from-orange-500 to-red-600', icon: Database },
            { title: 'Timeline', subtitle: 'to Revenue', color: 'from-orange-500 to-red-600', icon: Rocket },
        ]
    };

    // Stats data
    const stats = [
        { value: '10k+', label: 'Leads/Day', icon: Users },
        { value: '3X', label: 'Revenue', icon: Rocket },
        { value: '0.5B', label: 'verified contact database', icon: Database },
        { value: '<1 Day', label: 'campaign launch', icon: Zap },
    ];

    // Quick action buttons for SalesGPT section
    const quickActions = [
        'Create my ICP list',
        'Generate leads',
        'Identify target audience',
        'Start campaign',
        'Verify my list',
        'Enrich my list',
        'Leads from healthcare companies',
    ];

    // Get strategy name for display
    const getStrategyName = (strategy: GrowthStrategy): string => {
        const option = strategyOptions.find(opt => opt.id === strategy);
        return option?.title || '';
    };

    // Get current questions based on selected strategy
    const getCurrentQuestions = (): Question[] => {
        if (!growthStrategy) return [];
        return questionSets[growthStrategy];
    };

    // Get current visualization based on strategy and question index
    const getCurrentVisualization = (): Visualization | null => {
        if (!growthStrategy || currentQuestionIndex < 0) return null;
        return strategyVisualizations[growthStrategy][currentQuestionIndex] || null;
    };

    // Handle strategy selection
    const handleStrategySelect = (strategy: GrowthStrategy) => {
        setGrowthStrategy(strategy);
        setCurrentQuestionIndex(0);
    };

    // Handle next question
    const handleNext = () => {
        const currentQuestions = getCurrentQuestions();

        if (currentAnswer.trim()) {
            setAnswers({ ...answers, [currentQuestionIndex]: currentAnswer });
            setCurrentAnswer('');

            if (currentQuestionIndex < currentQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setIsComplete(true);
            }
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleNext();
        }
    };

    // Analyze answers to determine bottleneck
    const getBottleneckAnalysis = () => {
        if (!growthStrategy) return { bottleneck: 'Unknown', recommendation: 'Complete the questionnaire' };

        // Simple heuristic-based analysis
        switch (growthStrategy) {
            case 'Q1':
                return {
                    bottleneck: 'Lead Volume',
                    recommendation: 'Paid Acquisition + Sales Automation'
                };
            case 'Q2':
                return {
                    bottleneck: 'Customer Retention',
                    recommendation: 'Customer Success Programs + Loyalty Initiatives'
                };
            case 'Q3':
                return {
                    bottleneck: 'Product Adoption',
                    recommendation: 'Product Marketing + Customer Education'
                };
            case 'Q4':
                return {
                    bottleneck: 'Go-to-Market Speed',
                    recommendation: 'Market Research + Strategic Partnerships'
                };
            default:
                return { bottleneck: 'Unknown', recommendation: 'Contact our team' };
        }
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Animated Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
            </div>

            <div className="relative z-10">
                {/* Hero Section with Step-by-Step Questionnaire */}
                <section className="pt-32 pb-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        {!isComplete ? (
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                {/* Left Side - Animated Visualization */}
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="hidden lg:flex items-center justify-center relative h-[600px]">
                                    {currentQuestionIndex === -1 ? (
                                        // Strategy Selection Visualization
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.6 }}
                                            className="relative"
                                        >
                                            <div className="relative">
                                                {/* Outer glow pulse */}
                                                <motion.div 
                                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-50"
                                                />
                                                
                                                {/* Orbiting ring 1 */}
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-[-20px] border-2 border-blue-400/30 rounded-full"
                                                />
                                                
                                                {/* Orbiting ring 2 */}
                                                <motion.div
                                                    animate={{ rotate: -360 }}
                                                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-[-40px] border border-purple-400/20 rounded-full"
                                                />
                                                
                                                {/* Orbiting dot */}
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                                    className="absolute inset-[-30px]"
                                                >
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" />
                                                </motion.div>
                                                
                                                {/* Main circle */}
                                                <motion.div 
                                                    animate={{ scale: [1, 1.02, 1] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                    className="relative w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-purple-500/30"
                                                >
                                                    {/* Inner glow */}
                                                    <div className="absolute inset-4 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full" />
                                                    
                                                    <motion.div
                                                        animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                    >
                                                        <Rocket className="w-24 h-24 text-white mb-4 drop-shadow-lg" />
                                                    </motion.div>
                                                    <h3 className="text-5xl font-bold text-white drop-shadow-lg">Growth</h3>
                                                    <p className="text-2xl text-white/80 mt-2">Strategy</p>
                                                </motion.div>
                                                
                                                {/* Floating particles */}
                                                <motion.div
                                                    animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                    className="absolute -top-8 -right-8 w-4 h-4 bg-blue-400 rounded-full blur-sm"
                                                />
                                                <motion.div
                                                    animate={{ y: [0, 25, 0], opacity: [0.3, 0.8, 0.3] }}
                                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                                    className="absolute -bottom-6 -left-6 w-3 h-3 bg-purple-400 rounded-full blur-sm"
                                                />
                                                <motion.div
                                                    animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                                    className="absolute top-1/3 -right-12 w-2 h-2 bg-cyan-400 rounded-full"
                                                />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        // Question-specific Visualization
                                        <AnimatePresence mode="wait">
                                            {getCurrentVisualization() && (
                                                <motion.div
                                                    key={currentQuestionIndex}
                                                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                                    transition={{ duration: 0.6 }}
                                                    className="relative"
                                                >
                                                    <div className="relative">
                                                        {/* Outer glow pulse */}
                                                        <motion.div 
                                                            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                                                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                                            className={`absolute inset-0 bg-gradient-to-r ${getCurrentVisualization()!.color} rounded-full blur-3xl opacity-50`}
                                                        />
                                                        
                                                        {/* Orbiting ring 1 */}
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-[-25px] border-2 border-white/20 rounded-full"
                                                        />
                                                        
                                                        {/* Orbiting ring 2 */}
                                                        <motion.div
                                                            animate={{ rotate: -360 }}
                                                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-[-50px] border border-white/10 rounded-full"
                                                        />
                                                        
                                                        {/* Orbiting dots */}
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-[-35px]"
                                                        >
                                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50" />
                                                        </motion.div>
                                                        <motion.div
                                                            animate={{ rotate: -360 }}
                                                            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                                            className="absolute inset-[-20px]"
                                                        >
                                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-300 rounded-full" />
                                                        </motion.div>
                                                        
                                                        {/* Main circle */}
                                                        <motion.div 
                                                            animate={{ scale: [1, 1.03, 1] }}
                                                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                            className={`relative w-96 h-96 bg-gradient-to-br ${getCurrentVisualization()!.color} rounded-full flex flex-col items-center justify-center shadow-2xl`}
                                                        >
                                                            {/* Inner glow ring */}
                                                            <div className="absolute inset-4 border border-white/20 rounded-full" />
                                                            <div className="absolute inset-8 border border-white/10 rounded-full" />
                                                            
                                                            <motion.div
                                                                initial={{ scale: 0, rotate: -180 }}
                                                                animate={{ scale: 1, rotate: 0, y: [0, -5, 0] }}
                                                                transition={{ 
                                                                    scale: { delay: 0.2, type: "spring", stiffness: 200 },
                                                                    y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
                                                                }}
                                                            >
                                                                {React.createElement(getCurrentVisualization()!.icon, {
                                                                    className: "w-20 h-20 text-white mb-4 drop-shadow-lg"
                                                                })}
                                                            </motion.div>
                                                            <motion.h3 
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.3 }}
                                                                className="text-5xl font-bold text-white drop-shadow-lg"
                                                            >
                                                                {getCurrentVisualization()!.title}
                                                            </motion.h3>
                                                            <motion.p 
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.4 }}
                                                                className="text-2xl text-white/80 mt-2"
                                                            >
                                                                {getCurrentVisualization()!.subtitle}
                                                            </motion.p>
                                                        </motion.div>

                                                        {/* Floating Geometric Shapes - Enhanced */}
                                                        <motion.div
                                                            animate={{
                                                                y: [0, -25, 0],
                                                                rotate: [0, 180, 360],
                                                                scale: [1, 1.1, 1]
                                                            }}
                                                            transition={{
                                                                duration: 4,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                            className="absolute -top-12 -right-12 w-24 h-24 bg-gray-700/30 rounded-lg backdrop-blur-sm border border-white/10"
                                                        />
                                                        <motion.div
                                                            animate={{
                                                                y: [0, 25, 0],
                                                                x: [0, -15, 0],
                                                                scale: [1, 1.15, 1]
                                                            }}
                                                            transition={{
                                                                duration: 3,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                            className="absolute -bottom-10 -left-10 w-20 h-20 bg-gray-600/30 rounded-full backdrop-blur-sm border border-white/10"
                                                        />
                                                        <motion.div
                                                            animate={{
                                                                rotate: [0, 360],
                                                                scale: [1, 1.3, 1]
                                                            }}
                                                            transition={{
                                                                duration: 5,
                                                                repeat: Infinity,
                                                                ease: "linear"
                                                            }}
                                                            className="absolute top-1/2 -left-20 w-16 h-16 bg-gray-500/20 rounded-full backdrop-blur-sm border border-white/5"
                                                        />
                                                        {/* Additional floating element */}
                                                        <motion.div
                                                            animate={{
                                                                y: [0, -20, 0],
                                                                x: [0, 10, 0],
                                                                opacity: [0.5, 1, 0.5]
                                                            }}
                                                            transition={{
                                                                duration: 3.5,
                                                                repeat: Infinity,
                                                                ease: "easeInOut",
                                                                delay: 0.5
                                                            }}
                                                            className="absolute top-1/4 -right-16 w-6 h-6 bg-white/20 rounded-full"
                                                        />
                                                    </div>

                                                    {/* Strategy Label */}
                                                    <div className="absolute -left-20 top-1/4 -rotate-90">
                                                        <span className="text-gray-500 text-sm tracking-widest uppercase">
                                                            {growthStrategy && getStrategyName(growthStrategy)}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </motion.div>

                                {/* Right Side - Questionnaire Form */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12"
                                >
                                    {currentQuestionIndex === -1 ? (
                                        // Strategy Selection Screen
                                        <>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                                What best describes your current growth goal?
                                            </h2>
                                            <p className="text-gray-400 mb-8">
                                                Select the option that matches your business objective
                                            </p>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {strategyOptions.map((option) => (
                                                    <motion.button
                                                        key={option.id}
                                                        onClick={() => handleStrategySelect(option.id)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={`
                                                            p-6 rounded-xl border-2 transition-all duration-300 text-left
                                                            bg-gray-800/50 border-gray-600/50 hover:border-blue-500/50
                                                            hover:bg-gray-700/50 group
                                                        `}
                                                    >
                                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center mb-4`}>
                                                            {React.createElement(option.icon, {
                                                                className: "w-6 h-6 text-white"
                                                            })}
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                            {option.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-400">
                                                            {option.description}
                                                        </p>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        // Questions Screen
                                        <>
                                            {/* Progress Bar */}
                                            <div className="mb-8">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm text-gray-400">
                                                        Step {currentQuestionIndex + 1} of {getCurrentQuestions().length} – {growthStrategy && getStrategyName(growthStrategy)}
                                                    </span>
                                                    <span className="text-sm text-blue-400">
                                                        {Math.round(((currentQuestionIndex + 1) / getCurrentQuestions().length) * 100)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-800 rounded-full h-2">
                                                    <motion.div
                                                        className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${((currentQuestionIndex + 1) / getCurrentQuestions().length) * 100}%` }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Question Animation */}
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={currentQuestionIndex}
                                                    initial={{ opacity: 0, x: 50 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -50 }}
                                                    transition={{ duration: 0.4 }}
                                                >
                                                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                                                        {getCurrentQuestions()[currentQuestionIndex]?.question}
                                                    </h2>

                                                    <div className="space-y-4">
                                                        <input
                                                            type="text"
                                                            value={currentAnswer}
                                                            onChange={(e) => setCurrentAnswer(e.target.value)}
                                                            onKeyPress={handleKeyPress}
                                                            placeholder={getCurrentQuestions()[currentQuestionIndex]?.placeholder}
                                                            className="w-full bg-gray-800/70 border border-gray-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                                            autoFocus
                                                        />

                                                        <button
                                                            onClick={handleNext}
                                                            disabled={!currentAnswer.trim()}
                                                            className={`
                                                                w-full md:w-auto px-8 py-4 rounded-xl font-semibold 
                                                                transition-all duration-300 flex items-center gap-2 justify-center
                                                                ${currentAnswer.trim()
                                                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105'
                                                                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                                                                }
                                                            `}
                                                        >
                                                            {currentQuestionIndex < getCurrentQuestions().length - 1 ? 'Next' : 'Complete'}
                                                            <ChevronRight className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    {/* Previous Answers Summary */}
                                                    {currentQuestionIndex > 0 && (
                                                        <div className="mt-8 pt-6 border-t border-gray-700/50">
                                                            <p className="text-sm text-gray-400 mb-3">Your answers:</p>
                                                            <div className="space-y-2">
                                                                {Object.entries(answers).map(([index, answer]) => (
                                                                    <div key={index} className="text-sm">
                                                                        <span className="text-gray-500">{getCurrentQuestions()[parseInt(index)]?.question}</span>
                                                                        <span className="text-blue-400 ml-2">{answer}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </>
                                    )}
                                </motion.div>
                            </div>
                        ) : (
                            // Completion Message - Simplified
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center max-w-2xl mx-auto py-20"
                            >
                                {/* Animated Checkmark */}
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30"
                                >
                                    <motion.span 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-5xl text-white"
                                    >
                                        ✓
                                    </motion.span>
                                </motion.div>
                                
                                <motion.h2 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                                >
                                    Analysis Completed
                                </motion.h2>
                                
                                <motion.p 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-xl text-gray-300 mb-12"
                                >
                                    We have analysed your current status.<br />
                                    <span className="text-blue-400 font-semibold">Continue to Lightning Mode</span>
                                </motion.p>
                                
                                {/* Animated Down Arrow Button */}
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    onClick={() => {
                                        document.getElementById('salesgpt-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="group"
                                >
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110"
                                    >
                                        <ChevronDown className="w-8 h-8 text-white" />
                                    </motion.div>
                                </motion.button>
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Feature Section */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                AI Sales Intelligence Marketplace
                            </h2>
                            <p className="text-xl text-blue-400 mb-12">
                                powered by <span className="font-semibold">Agentic AI</span>
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                                        className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300"
                                    >
                                        <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                                        <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* SalesGPT Section */}
                <section id="salesgpt-section" className="py-16 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 md:p-12"
                        >
                            {/* SalesGPT Header */}
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Sparkles className="w-8 h-8 text-cyan-400" />
                                    <h2 className="text-3xl font-bold text-white">SalesGPT</h2>
                                </div>
                                <p className="text-gray-400">
                                    The Only AI-Powered Sales Search Engine
                                </p>
                            </div>

                            {/* Search Input */}
                            <div className="relative mb-6">
                                <input
                                    type="text"
                                    placeholder="My company website is: www.salescentri.com"
                                    className="w-full bg-gray-800/70 border border-gray-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                    <span className="text-green-400 text-sm">✓</span>
                                </div>
                            </div>

                            {/* Lightning Mode Toggle */}
                            <div className="flex justify-center mb-8">
                                <button className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-2 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">
                                    <Zap className="w-4 h-4" />
                                    Lightning Mode
                                </button>
                            </div>

                            {/* Quick Action Buttons */}
                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                {quickActions.map((action, index) => (
                                    <button
                                        key={index}
                                        className="px-4 py-2 bg-gray-800/70 border border-gray-600/50 rounded-lg text-sm text-gray-300 hover:bg-gray-700/70 hover:border-blue-500/30 hover:text-white transition-all duration-300"
                                    >
                                        {action}
                                    </button>
                                ))}
                            </div>

                            {/* Discover More Link */}
                            <div className="text-center">
                                <Link
                                    href="/solutions/psa-suite-one-stop-solution"
                                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center justify-center gap-2"
                                >
                                    Discover more
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Customer Testimonials Section */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                                What Our Customers Say
                            </h2>
                            <p className="text-gray-400 text-center mb-12">
                                Real feedback from teams using Sales Centri
                            </p>

                            {/* Testimonials Grid */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Testimonial 1 */}
                                <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 italic mb-6">
                                        "Sales Centri's pricing is transparent and the ROI is incredible. We've 3x'd our lead generation."
                                    </p>
                                    <div>
                                        <p className="text-white font-semibold">Sarah Johnson</p>
                                        <p className="text-gray-400 text-sm">VP Sales</p>
                                        <p className="text-blue-400 text-sm">TechCorp</p>
                                    </div>
                                </div>

                                {/* Testimonial 2 */}
                                <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 italic mb-6">
                                        "The Professional plan gives us everything we need. Excellent value for the features provided."
                                    </p>
                                    <div>
                                        <p className="text-white font-semibold">Michael Chen</p>
                                        <p className="text-gray-400 text-sm">Sales Director</p>
                                        <p className="text-blue-400 text-sm">GrowthCo</p>
                                    </div>
                                </div>

                                {/* Testimonial 3 */}
                                <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-gray-300 italic mb-6">
                                        "Enterprise support is outstanding. The dedicated manager makes all the difference."
                                    </p>
                                    <div>
                                        <p className="text-white font-semibold">Emily Rodriguez</p>
                                        <p className="text-gray-400 text-sm">CRO</p>
                                        <p className="text-blue-400 text-sm">ScaleUp Inc</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Custom Solution CTA Section */}
                <section className="py-16 px-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Need a custom solution?
                            </h2>
                            <p className="text-gray-400 mb-8">
                                Contact our sales team for enterprise pricing, custom integrations, and dedicated support.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/solutions/psa-suite-one-stop-solution"
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105"
                                >
                                    Try SalesGPT Now
                                </Link>
                                <Link
                                    href="/get-started/book-demo"
                                    className="border border-gray-500/50 text-gray-300 px-8 py-4 rounded-xl font-semibold hover:bg-gray-700/50 transition-all duration-300"
                                >
                                    Book a Demo
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="py-16 px-4 bg-gray-900/90">
                    <div className="max-w-xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">
                                Stay Updated
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Subscribe to our newsletter for the latest updates and insights.
                            </p>
                            <div className="flex gap-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 bg-gray-800/70 border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none transition-all duration-300"
                                />
                                <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                                    Subscribe
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 px-4 bg-black border-t border-gray-800/50">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">SC</span>
                                </div>
                                <span className="text-white font-semibold">Sales <span className="text-blue-400">Centri</span></span>
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                                <Link href="/legal/terms-of-service" className="hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                                <Link href="/legal/privacy-policy" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link href="/legal/cookie-policy" className="hover:text-white transition-colors">
                                    Cookie Policy
                                </Link>
                            </div>

                            {/* Social Icons */}
                            <div className="flex items-center gap-3">
                                {['f', 'x', 'in', '✉', 'Q', '📌'].map((icon, index) => (
                                    <div
                                        key={index}
                                        className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer text-xs"
                                    >
                                        {icon}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="mt-8 pt-6 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                            <p>© 2025 Sales Centri. All rights reserved.</p>
                            <p>Developed at Sales Centri</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
