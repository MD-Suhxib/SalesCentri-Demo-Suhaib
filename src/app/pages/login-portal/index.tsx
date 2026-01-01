'use client';

import { motion } from 'framer-motion';
import { LogIn, Users, Briefcase, ArrowRight, Shield, LayoutDashboard, Briefcase as BriefcaseIcon } from 'lucide-react';
import Link from 'next/link';
import { Aurora } from '@/app/components/Aurora';
import { getLoginUrl } from '@/app/lib/loginUtils';

export const LoginPortal = () => {
    const handleCustomerLogin = () => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const fromParam = params.get('from');
        // URLSearchParams.get already returns a decoded string.
        const from = fromParam || undefined;

        // Default to current origin (works for localhost + production)
        const returnUrl = from || window.location.origin;
        window.location.href = getLoginUrl(false, returnUrl);
    };

    const portals = [
        {
            title: "Customer Portal",
            description: "Access your dashboard, analytics, billing, and support",
            icon: LayoutDashboard,
            features: ["Dashboard", "Usage Analytics", "Billing & Invoices", "Support Ticketing"],
            href: null as string | null,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "group-hover:border-blue-500/50",
            buttonColor: "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
        },
        {
            title: "Partner Portal", 
            description: "Partner tools, co-selling resources, and training materials",
            icon: Users,
            features: ["Partner Dashboard", "Co-selling Tools", "Marketing Assets", "Training"],
            href: "/partners/register",
            color: "text-green-400",
            bg: "bg-green-500/10",
            border: "group-hover:border-green-500/50",
            buttonColor: "bg-green-500/10 text-green-400 hover:bg-green-500/20"
        },
        {
            title: "Business Portal",
            description: "Join our marketplace as a startup, buyer, or supplier.",
            icon: BriefcaseIcon,
            features: ["Startup", "Buyer", "Supplier", "Business Registration"],
            href: "/market-place/register",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "group-hover:border-purple-500/50",
            buttonColor: "bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
        }
    ];

	return (
		<div className="min-h-screen bg-black relative overflow-hidden">
            <Aurora />
            
			<section className="pt-24 pb-20 relative z-10">
				<div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
						className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-6 backdrop-blur-sm">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span>Secure Access</span>
                        </div>

						<h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            Login to{' '}
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                Your Portal
                            </span>
                        </h1>
						<p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Access your dedicated portal with tools and resources tailored specifically for your role
                        </p>
                    </motion.div>

					<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {portals.map((portal, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group"
                            >
								<div className={`h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 ${portal.border} hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 flex flex-col`}>
									<div className={`w-12 h-12 ${portal.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
										<portal.icon className={`w-6 h-6 ${portal.color}`} />
                                    </div>

									<h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors">
                                        {portal.title}
                                    </h3>

									<p className="text-gray-400 text-sm leading-relaxed mb-6 group-hover:text-gray-300 min-h-[40px]">
                                        {portal.description}
                                    </p>

									<div className="space-y-3 mb-8 flex-grow">
                                        {portal.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center space-x-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${portal.color.replace('text-', 'bg-')}`}></div>
												<span className="text-gray-400 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto">
                                        {portal.title === "Customer Portal" ? (
                                            <button
                                                type="button"
                                                onClick={handleCustomerLogin}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${portal.buttonColor}`}
                                            >
                                                <span>Access Portal</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <Link
                                                href={portal.href ?? "#"}
                                                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${portal.buttonColor}`}
                                            >
                                                <span>{portal.title === "Business Portal" ? "Register Now" : portal.title === "Partner Portal" ? "Become a Partner" : "Access Portal"}</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
