"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import LeadCaptureModal from './LeadCaptureModal';
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  Shield,
  Database,
  TrendingUp,
  MessageSquare,
  Phone,
  Bot,
  Cloud,
  Home,
  Settings,
  Layers,
  Package,
  DollarSign,
  BookOpen,
  Monitor,
  Users,
  FileText,
  HelpCircle,
  Video,
  Target,
  Play,
  Heart,
  Rocket,
  Store,
  Info,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Dock, { type DockItemData } from "../blocks/Components/Dock/Dock";

import { validateAuthenticationAsync, type UserProfile, clearTokens } from "../lib/auth";
import { getLoginUrl } from "../lib/loginUtils";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showDock, setShowDock] = useState(false);
  const [isTopNav, setIsTopNav] = useState(true);
  const [isDockDropdownOpen, setIsDockDropdownOpen] = useState(false);
  const [activeDockDropdown, setActiveDockDropdown] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { isAuthenticated, profile } = await validateAuthenticationAsync();
      setIsAuthenticated(isAuthenticated);
      if (profile) {
        setUserProfile(profile);
      }
    };
    checkAuth();
  }, []);

  // Refresh navbar auth state when tokens are saved/cleared in the same tab
  useEffect(() => {
    const handleAuthChanged = async () => {
      const { isAuthenticated, profile } = await validateAuthenticationAsync();
      setIsAuthenticated(isAuthenticated);
      setUserProfile(profile ?? null);
    };

    window.addEventListener("salescentri-auth-changed", handleAuthChanged);
    return () => window.removeEventListener("salescentri-auth-changed", handleAuthChanged);
  }, []);

  const handleSignOut = () => {
    clearTokens();
    setIsAuthenticated(false);
    setUserProfile(null);
    window.location.href = "/";
  };

  // Monitor scroll position to show/hide dock
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector(".hero-section");
      const footerSection = document.querySelector("footer");

      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        let shouldShowDock = heroBottom <= 0;

        // Hide dock when footer is visible
        if (footerSection) {
          const footerTop = footerSection.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;

          // Debug logging

          // Hide dock when footer starts appearing (when footer top is less than window height)
          if (footerTop < windowHeight) {
            shouldShowDock = false;
            console.log("Hiding dock - footer is visible");
          }
        } else {
          console.log("Footer element not found");
        }

        setShowDock(shouldShowDock);
        setIsTopNav(heroBottom > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Call once on mount to set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const platformsData = {
    "Contact Intelligence & Data": [
      {
        name: "AI Aggregator",
        href: "/platforms/contact-intelligence/ai-aggregator",
        icon: Database,
      },
      {
        name: "AI Hunter",
        href: "/platforms/contact-intelligence/ai-hunter",
        icon: Search,
      },
      {
        name: "Contact Validator",
        href: "/platforms/contact-intelligence/hunter-validator",
        icon: Shield,
      },
      {
        name: "IntelliBase",
        href: "/platforms/contact-intelligence/intellibase",
        icon: TrendingUp,
      },
    ],
    "Lead Management & Generation": [
      {
        name: "iEMA (Email Marketing)",
        href: "/platforms/lead-management/iema-email-marketing-automation",
        icon: MessageSquare,
      },
      {
        name: "Lead Generation",
        href: "/platforms/lead-management/lead-generation",
        icon: Search,
      },
      {
        name: "Lead Stream",
        href: "/platforms/lead-management/lead-stream",
        icon: TrendingUp,
      },
      {
        name: "iLMS (Lead Management)",
        href: "/platforms/lead-management/ilms-lead-management-system",
        icon: Database,
      },
    ],
    "Voice AI & Dialer Solutions": [
      {
        name: "DialerAI",
        href: "/platforms/lead-management/dialer-ai",
        icon: Phone,
      },
      {
        name: "SIM Dialer",
        href: "/platforms/lead-management/sim-dialer",
        icon: Phone,
      },
      {
        name: "SalesAI Agent",
        href: "/platforms/lead-management/salesai-agent",
        icon: Bot,
      },
      {
        name: "VoiceAI Agent",
        href: "/platforms/lead-management/voice-ai-agent",
        icon: Bot,
      },
      {
        name: "Voice Bot",
        href: "/platforms/lead-management/voice-bot",
        icon: Bot,
      },
      {
        name: "Sales Tune",
        href: "/platforms/lead-management/sales-tune",
        icon: TrendingUp,
      },
    ],
    "Chat & Text AI Automation": [
      {
        name: "Chat Bot",
        href: "/platforms/lead-management/chat-bot",
        icon: Bot,
      },
      {
        name: "WhatsApp Bot",
        href: "/platforms/lead-management/whatsapp-bot",
        icon: MessageSquare,
      },
      {
        name: "Text to Speech",
        href: "/platforms/lead-management/text-to-speech",
        icon: Bot,
      },
      {
        name: "Speech to Text",
        href: "/platforms/lead-management/speech-to-text",
        icon: Bot,
      },
      {
        name: "Voice Bot",
        href: "/platforms/lead-management/voice-bot",
        icon: Bot,
      },
      {
        name: "Sales Tune",
        href: "/platforms/lead-management/sales-tune",
        icon: TrendingUp,
      },
    ],
    "Cloud Telephony & Infrastructure": [
      { name: "iGCT", href: "/platforms/lead-management/igct", icon: Cloud },
      {
        name: "Call Center",
        href: "/platforms/lead-management/call-center",
        icon: Phone,
      },
    ],
  };

  const solutionsData = [
    {
      name: "PSA Suite: One-Stop Solution",
      href: "/solutions/psa-suite-one-stop-solution",
    },
    {
      name: "Pre-Sales Automation: Overview",
      href: "/solutions/pre-sales-automation",
    },
    {
      name: "Multi GPT: Aggregated Research",
      href: "/solutions/multi-gpt-aggregated-research",
    },
    { name: "By Industry", href: "/solutions/by-industry" },
    { name: "By Use Case", href: "/solutions/by-use-case" },
    { name: "Use Case Navigator", href: "/solutions/use-case-navigator" },
    {
      name: "Comparison & Case Studies",
      href: "/solutions/comparison-case-studies",
    },
  ];

  const servicesData = [
    { name: "AI Digital Marketing", href: "/services/ai-digital-marketing" },
    { name: "AI Website Designing", href: "/services/ai-website-designing" },
    { name: "Sales Outsourcing", href: "/services/sales-outsourcing" },
    { name: "Data Enrichment", href: "/services/data-enrichment" },
    { name: "SDR as a Service", href: "/services/sdr-as-a-service" },
    { name: "Account-Based Marketing (ABM)", href: "/services/abm" },
    {
      name: "Lead Research as a Service",
      href: "/services/lead-research-as-a-service",
    },
    
    { name: "Lead Generation Models", href: "/services/lead-generation-models" },
  ];

  const resourcesData = [
    { name: "Landing Pages", href: "/resources/landing-pages" },
    { name: "Social Media", href: "/social-media" },
    { name: "About Us", href: "/company/about-us" },
    { name: "Blog", href: "/blog" },
    { name: "Performance Benchmarks", href: "/resources/performance-benchmarks" },
    { name: "Startup Program", href: "/resources/startup-program" },
    { name: "Case Studies", href: "/resources/case-studies" },
    { name: "Marketplace", href: "/market-place" },
    { name: "Whitepapers & Ebooks", href: "/resources/whitepapers-ebooks" },
    { name: "Community Engagement", href: "/company/community-engagement" },
    { name: "Tutorials & Webinars", href: "/resources/tutorials-webinars" },
    { name: "Privacy Center", href: "/privacy/management" },
    { name: "FAQ", href: "/resources/faq" },
    { name: "Demo Videos", href: "/demo" },
    { name: "Print Media OCR", href: "/resources/print-media-ocr" },
  ];

  // Dock items configuration
  const dockItems: DockItemData[] = [
    {
      icon: <Home className="w-6 h-6 text-white" />,
      label: "Home",
      onClick: () => {
        // Close any open dock dropdowns first
        setActiveDockDropdown(null);
        setIsDockDropdownOpen(false);

        // Scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        // Update dock visibility state immediately to remove blur overlay
        setTimeout(() => {
          setShowDock(false);
          setIsTopNav(true);
        }, 100); // Small delay to ensure scroll starts
      },
      className: "bg-black/80 hover:bg-gray-800/80",
    },
    {
      icon: <Layers className="w-6 h-6 text-white" />,
      label: "Platforms",
      onClick: () => {}, // Empty onClick since we want dropdown behavior
      className: "bg-black/80 hover:bg-gray-800/80",
      dropdown: {
        title: "Our Platform Categories",
        items: [
          {
            name: "Contact Intelligence & Data",
            href: "/platforms/contact-intelligence",
            icon: Database,
            description: "AI-powered data aggregation and contact intelligence",
          },
          {
            name: "Lead Management & Generation",
            href: "/platforms/lead-management",
            icon: TrendingUp,
            description: "Advanced lead generation and management tools",
          },
          {
            name: "Chat & Text AI Automation",
            href: "/platforms/lead-management",
            icon: MessageSquare,
            description: "Intelligent chatbots and text automation",
          },
          {
            name: "Voice AI & Dialer Solutions",
            href: "/platforms/lead-management",
            icon: Phone,
            description: "AI-powered voice and dialing technology",
          },
          {
            name: "Cloud Telephony & Infrastructure",
            href: "/platforms/lead-management",
            icon: Cloud,
            description: "Scalable cloud communication infrastructure",
          },
        ],
      },
    },
    {
      icon: <Settings className="w-6 h-6 text-white" />,
      label: "Solutions",
      onClick: () => {}, // Empty onClick since we want dropdown behavior
      className: "bg-black/80 hover:bg-gray-800/80",
      dropdown: {
        title: "Our Solutions",
        items: [
          {
            name: "Pre-Sales Automation: Overview",
            href: "/solutions/pre-sales-automation",
            icon: Settings,
            description: "Complete guide to Pre-Sales Automation modes and features",
          },
          {
            name: "PSA Suite: One-Stop Solution",
            href: "/solutions/psa-suite-one-stop-solution",
            icon: Settings,
            description: "Complete business automation platform",
          },
          {
            name: "Multi GPT: Aggregated Research",
            href: "/solutions/multi-gpt-aggregated-research",
            icon: Bot,
            description: "Aggregated research powered by multiple AI models",
          },
          {
            name: "By Industry",
            href: "/solutions/by-industry",
            icon: TrendingUp,
            description: "Industry-specific solution packages",
          },
          {
            name: "By Use Case",
            href: "/solutions/by-use-case",
            icon: Package,
            description: "Targeted use case solutions",
          },
          {
            name: "Use Case Navigator",
            href: "/solutions/use-case-navigator",
            icon: Search,
            description: "Find the right solution for your needs",
          },
          {
            name: "Comparison & Case Studies",
            href: "/solutions/comparison-case-studies",
            icon: FileText,
            description: "Compare solutions and success stories",
          },
        ],
      },
    },
    {
      icon: <Package className="w-6 h-6 text-white" />,
      label: "Services",
      onClick: () => {}, // Empty onClick since we want dropdown behavior
      className: "bg-black/80 hover:bg-gray-800/80",
      dropdown: {
        title: "Our Services",
        items: [
          {
            name: "AI Digital Marketing",
            href: "/services/ai-digital-marketing",
            icon: TrendingUp,
            description: "AI-powered marketing automation",
          },
          {
            name: "AI Website Designing",
            href: "/services/ai-website-designing",
            icon: Monitor,
            description: "Intelligent web design solutions",
          },
          {
            name: "Sales Outsourcing",
            href: "/services/sales-outsourcing",
            icon: Users,
            description: "Complete sales team management",
          },
          {
            name: "Account-Based Marketing (ABM)",
            href: "/services/abm",
            icon: Target,
            description: "Account-Based Marketing services",
          },
          {
            name: "Data Enrichment",
            href: "/services/data-enrichment",
            icon: Database,
            description: "Enhanced data quality and insights",
          },
          {
            name: "Lead Research as a Service",
            href: "/services/lead-research-as-a-service",
            icon: Search,
            description: "Professional lead research services",
          },
          
          {
            name: "Lead Generation Models",
            href: "/services/lead-generation-models",
            icon: TrendingUp,
            description: "TOFU, MOFU, and BOFU lead generation strategies",
          },
        ],
      },
    },
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      label: "Resources",
      onClick: () => {}, // Empty onClick since we want dropdown behavior
      className: "bg-black/80 hover:bg-gray-800/80",
      dropdown: {
        title: "Our Resources",
        items: [
          {
            name: "Landing Pages",
            href: "#",
            icon: Target,
            description: "Interactive landing pages for growth strategies",
            subItems: [
              { name: "Landing Page 01", href: "/resources/landingpage" },
              { name: "Landing Page 02", href: "/resources/landingpage-02" },
            ]
          },
          {
            name: "Blog",
            href: "/blog",
            icon: BookOpen,
            description: "Latest articles, insights, and updates",
          },
          {
            name: "Performance Benchmarks",
            href: "/resources/performance-benchmarks",
            icon: TrendingUp,
            description: "Industry performance metrics and data",
          },
          {
            name: "Startup Program",
            href: "/resources/startup-program",
            icon: Rocket,
            description: "Special programs and resources for startups",
          },
          {
            name: "Case Studies",
            href: "/resources/case-studies",
            icon: FileText,
            description: "Real-world success stories and examples",
          },
          {
            name: "Marketplace",
            href: "/market-place",
            icon: Package,
            description: "Explore our marketplace of solutions and services",
          },
          {
            name: "Whitepapers & Ebooks",
            href: "/resources/whitepapers-ebooks",
            icon: BookOpen,
            description: "In-depth industry insights and guides",
          },
          {
            name: "Community Engagement",
            href: "/company/community-engagement",
            icon: Heart,
            description: "Join our community initiatives and programs",
          },
          {
            name: "About Us",
            href: "/company/about-us",
            icon: Info,
            description: "Learn about our mission, vision, and journey",
          },
          {
            name: "Tutorials & Webinars",
            href: "/resources/tutorials-webinars",
            icon: Video,
            description: "Educational content and training sessions",
          },
          {
            name: "Privacy Center",
            href: "/privacy/management",
            icon: Shield,
            description: "Manage your data privacy requests and preferences",
          },
          {
            name: "FAQ",
            href: "/resources/faq",
            icon: HelpCircle,
            description: "Frequently asked questions and answers",
          },
          {
            name: "Demo Videos",
            href: "/demo",
            icon: Play,
            description: "Watch product demos and see Sales Centri in action",
          },
          {
            name: "Print Media OCR",
            href: "/resources/print-media-ocr",
            icon: FileText,
            description: "Upload print media files for OCR processing and structured output",
          },
        ],
      },
    },
    {
      icon: <DollarSign className="w-6 h-6 text-white" />,
      label: "Pricing",
      onClick: () => {}, // Empty onClick since we want dropdown behavior
      className: "bg-black/80 hover:bg-gray-800/80",
      dropdown: {
        title: "Our Pricing Plans",
        items: [
          {
            name: "Free Trial",
            href: "/pricing/free-trial",
            icon: DollarSign,
            description: "Start with our comprehensive free trial",
          },
          {
            name: "Plans Overview",
            href: "/pricing/plans-overview",
            icon: Settings,
            description: "Compare all available pricing plans",
          },
          {
            name: "Enterprise Custom",
            href: "/pricing/enterprise-custom",
            icon: TrendingUp,
            description: "Custom enterprise solutions and pricing",
          },
        ],
      },
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      label: "Get started",
      onClick: () => (window.location.href = "/get-started"),
      className: "bg-gradient-to-r from-slate-700 to-indigo-800 hover:from-slate-600 hover:to-indigo-700 border border-indigo-400/20",
    },
  ];

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Platforms", dropdown: "platforms" },
    { name: "Solutions", dropdown: "solutions" },
    { name: "Services", dropdown: "services" },
    { name: "Pricing", href: "/pricing" },
    { name: "Resources", dropdown: "resources" },
  ];

  return (
    <>
      {/* Global Blur Overlay for Dock Dropdown */}
      <AnimatePresence>
        {isDockDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-30 dark:bg-black/60"
            style={{ backdropFilter: "blur(8px)" }}
          />
        )}
      </AnimatePresence>

      {/* Top Navigation - Only visible when at hero section */}
      <AnimatePresence>
        {isTopNav && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-[9999] bg-black border-b border-white/10 dark:bg-black"
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-20">
                {/* Logo - Fixed Left */}
                <Link href="/" className="flex-shrink-0 relative z-50 group">
                  <motion.div
                    className="flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Image
                      src="/saleslogo.webp"
                      alt="Sales Centri"
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                    <span className="text-xl font-bold tracking-tight">
                      <span className="text-white">Sales</span>
                      <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent ml-1">
                       Centri
                      </span>
                    </span>
                  </motion.div>
                </Link>

                {/* Desktop Navigation - Center Section */}
                <div className="hidden lg:flex items-center justify-center flex-1 px-8">
                  <div className="flex items-center gap-8">
                    {navItems.map((item) => (
                      <div key={item.name} className="relative group">
                        {item.href ? (
                          <Link
                            href={item.href}
                            className="text-gray-400 hover:text-white transition-colors duration-200 relative flex items-center gap-1.5 text-sm font-medium tracking-wide py-2"
                          >
                            <span>{item.name}</span>
                          </Link>
                        ) : (
                          <button
                            className="text-gray-400 hover:text-white transition-colors duration-200 relative flex items-center gap-1.5 text-sm font-medium tracking-wide cursor-pointer py-2"
                            onMouseEnter={() => setActiveDropdown(item.dropdown!)}
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            <span>{item.name}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === item.dropdown ? 'rotate-180' : ''}`} />
                          </button>
                        )}

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {activeDropdown === item.dropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute top-full left-0 mt-2 ${item.dropdown === "platforms" ? "w-[800px]" : "w-[600px]"} bg-black border border-gray-700/50 rounded-xl p-6 shadow-xl dark:bg-black`}
                            onMouseEnter={() =>
                              setActiveDropdown(item.dropdown!)
                            }
                            onMouseLeave={() => setActiveDropdown(null)}
                          >
                            {item.dropdown === "platforms" && (
                              <div className="flex space-x-6">
                                <div className="flex-1 space-y-4">
                                  {Object.entries(platformsData)
                                    .slice(0, 3)
                                    .map(([category, items]) => (
                                      <div key={category}>
                                        <h3 className="text-white font-semibold mb-2 text-sm">
                                          {category}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-1">
                                          {items.map((product) => (
                                            <Link
                                              key={product.name}
                                              href={product.href}
                                              className="flex items-center space-x-3 py-1 px-2 rounded-lg hover:bg-gray-800/70 transition-colors group"
                                            >
                                              <product.icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                                              <span className="text-gray-300 group-hover:text-white text-sm">
                                                {product.name}
                                              </span>
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                                <div className="flex-1 space-y-4">
                                  {Object.entries(platformsData)
                                    .slice(3)
                                    .map(([category, items]) => (
                                      <div key={category}>
                                        <h3 className="text-white font-semibold mb-2 text-sm">
                                          {category}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-1">
                                          {items.map((product) => (
                                            <Link
                                              key={product.name}
                                              href={product.href}
                                              className="flex items-center space-x-3 py-1 px-2 rounded-lg hover:bg-gray-800/70 transition-colors group"
                                            >
                                              <product.icon className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                                              <span className="text-gray-300 group-hover:text-white text-sm">
                                                {product.name}
                                              </span>
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}

                            {item.dropdown === "solutions" && (
                              <div className="grid grid-cols-2 gap-2">
                                {solutionsData.map((solution) => (
                                  <Link
                                    key={solution.name}
                                    href={solution.href}
                                    className="p-1.5 md:p-2 rounded-lg hover:bg-gray-800/70 transition-colors group"
                                  >
                                    <span className="text-gray-300 group-hover:text-white text-sm">
                                      {solution.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            )}

                            {item.dropdown === "services" && (
                              <div className="grid grid-cols-2 gap-2">
                                {servicesData.map((service) => (
                                  <Link
                                    key={service.name}
                                    href={service.href}
                                    className="p-1.5 md:p-2 rounded-lg hover:bg-gray-800/70 transition-colors group"
                                  >
                                    <span className="text-gray-300 group-hover:text-white text-sm">
                                      {service.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            )}

                            {item.dropdown === "resources" && (
                              <div className="grid grid-cols-2 gap-x-0 gap-y-0">
                                {resourcesData.map((resource) => (
                                  <div key={resource.name} className="relative group/sub">
                                    {resource.subItems ? (
                                      <>
                                        <div className="p-1.5 md:p-2 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer flex items-center justify-between">
                                          <span className="text-gray-300 group-hover/sub:text-white text-sm">
                                            {resource.name}
                                          </span>
                                          <ChevronRight className="w-3 h-3 text-gray-500" />
                                        </div>
                                        <div className="absolute left-full top-0 ml-1 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg p-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200 min-w-[160px] z-50">
                                          {resource.subItems.map((subItem) => (
                                            <Link
                                              key={subItem.name}
                                              href={subItem.href}
                                              className="block p-2 rounded-lg hover:bg-gray-800/70 transition-colors"
                                            >
                                              <span className="text-gray-300 hover:text-white text-sm">
                                                {subItem.name}
                                              </span>
                                            </Link>
                                          ))}
                                        </div>
                                      </>
                                    ) : (
                                      <Link
                                        href={resource.href}
                                        className="block p-1.5 md:p-2 rounded-lg hover:bg-gray-800/70 transition-colors"
                                      >
                                        <span className="text-gray-300 hover:text-white text-sm">
                                          {resource.name}
                                        </span>
                                      </Link>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  </div>
                </div>

                {/* Auth Buttons - Fixed Right */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0 ml-auto z-50">
                  {isAuthenticated && userProfile ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                        className="flex items-center gap-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors border border-white/10"
                      >
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {userProfile.user.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="max-w-[150px] truncate">{userProfile.user.email}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {showUserDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-56 bg-black border border-gray-700/50 rounded-xl shadow-xl overflow-hidden py-1 dark:bg-black"
                          >
                            <div className="px-4 py-3 border-b border-gray-800">
                              <p className="text-xs text-gray-400">Signed in as</p>
                              <p className="text-sm font-medium text-white truncate">{userProfile.user.email}</p>
                            </div>
                            <Link 
                              href="https://dashboard.salescentri.com" 
                              className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                            >
                              Dashboard
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors"
                            >
                              Sign out
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const from = typeof window !== "undefined" ? window.location.href : "https://salescentri.com";
                          window.location.href = `/login-portal?from=${encodeURIComponent(from)}`;
                        }}
                        className="text-gray-400 hover:text-white transition-colors text-sm font-medium tracking-wide whitespace-nowrap px-2"
                        data-track="nav_login"
                      >
                        Sign in
                      </button>
                      <Link
                        href="/get-started"
                        className="relative p-[1px] rounded-full group overflow-hidden"
                        data-track="nav_get_started"
                      >
                        <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#f04a4a_0%,#fcca3f_25%,#2ad067_50%,#4a8afc_75%,#f04a4a_100%)] opacity-100" />
                        <span className="relative flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white backdrop-blur-3xl transition-all duration-300">
                          Get started
                        </span>
                      </Link>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2 rounded-full shadow-lg shadow-blue-600/20 transition-all duration-300 text-sm font-medium flex items-center gap-2 group cursor-pointer whitespace-nowrap border border-white/10"
                        data-track="nav_lets_talk"
                      >
                        <Phone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                        <span>Let&apos;s Talk</span>
                      </button>
                      <Link
                        href="/demo"
                        className="text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium tracking-wide whitespace-nowrap flex items-center gap-2"
                        data-track="nav_view_demo"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        View Demo
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden text-white p-1 cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              {/* Mobile Menu rendered via portal */}
              {isOpen &&
                typeof window !== "undefined" &&
                createPortal(
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="lg:hidden fixed inset-0 bg-black/90 z-[2147483646] dark:bg-black/90"
                      onClick={() => setIsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, x: "100%" }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: "100%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black border-l border-gray-800 z-[2147483647] overflow-y-auto shadow-2xl dark:bg-black"
                    >
                      {/* existing mobile menu content */}
                      {/* Mobile Menu Header */}
                      <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-black">
                        <div className="flex items-center space-x-3">
                          <Image
                            src="/saleslogo.webp"
                            alt="Sales Centri Logo"
                            width={40}
                            height={40}
                            className="w-10 h-10 object-contain"
                          />
                          <span className="text-xl font-bold tracking-tight">
                            <span className="text-white">Sales</span>
                            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent ml-1">Centri</span>
                          </span>
                        </div>
                        <button
                          className="text-white p-2 hover:bg-gray-900 rounded-xl cursor-pointer transition-colors duration-200"
                          onClick={() => setIsOpen(false)}
                          aria-label="Close menu"
                        >
                          <X size={22} />
                        </button>
                      </div>

                      {/* Mobile Menu Items */}
                      <div className="p-5 space-y-1 bg-black">
                        {navItems.map((item) => (
                          <div key={item.name}>
                            {item.href ? (
                              <Link
                                href={item.href}
                                className="block text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-200 py-4 px-4 rounded-xl font-medium"
                                onClick={() => setIsOpen(false)}
                              >
                                {item.name}
                              </Link>
                            ) : (
                              <div>
                                <button
                                  className="flex items-center justify-between w-full text-gray-300 hover:text-white hover:bg-gray-900 transition-all duration-200 py-4 px-4 rounded-xl cursor-pointer font-medium"
                                  onClick={() =>
                                    setActiveDropdown(
                                      activeDropdown === item.dropdown
                                        ? null
                                        : item.dropdown!
                                    )
                                  }
                                >
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.dropdown ? "rotate-180" : ""}`}
                                  />
                                </button>

                                <AnimatePresence>
                                  {activeDropdown === item.dropdown && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="ml-4 mt-2 space-y-1 border-l-2 border-blue-500/40 pl-4 bg-black/60 rounded-r-xl py-3"
                                    >
                                      {item.dropdown === "platforms" &&
                                        Object.entries(platformsData).map(
                                          ([category, items]) => (
                                            <div key={category}>
                                              <h4 className="text-blue-400 text-sm font-semibold mb-3 px-2">
                                                {category}
                                              </h4>
                                              {items.map((product) => (
                                                <Link
                                                  key={product.name}
                                                  href={product.href}
                                                  className="block text-gray-400 hover:text-white hover:bg-gray-800 py-2 px-2 text-sm rounded-lg transition-colors duration-200"
                                                  onClick={() =>
                                                    setIsOpen(false)
                                                  }
                                                >
                                                  {product.name}
                                                </Link>
                                              ))}
                                            </div>
                                          )
                                        )}

                                      {item.dropdown === "solutions" &&
                                        solutionsData.map((solution) => (
                                          <Link
                                            key={solution.name}
                                            href={solution.href}
                                            className="block text-gray-400 hover:text-white hover:bg-gray-800 py-2 px-2 text-sm rounded-lg transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                          >
                                            {solution.name}
                                          </Link>
                                        ))}

                                      {item.dropdown === "services" &&
                                        servicesData.map((service) => (
                                          <Link
                                            key={service.name}
                                            href={service.href}
                                            className="block text-gray-400 hover:text-white hover:bg-gray-800 py-2 px-2 text-sm rounded-lg transition-colors duration-200"
                                            onClick={() => setIsOpen(false)}
                                          >
                                            {service.name}
                                          </Link>
                                        ))}

                                      {item.dropdown === "resources" &&
                                        resourcesData.map((resource) => (
                                          <div key={resource.name}>
                                            {resource.subItems ? (
                                              <div className="py-1">
                                                <div className="text-gray-300 font-medium py-2 px-2 text-sm">
                                                  {resource.name}
                                                </div>
                                                <div className="pl-4">
                                                  {resource.subItems.map((subItem) => (
                                                    <Link
                                                      key={subItem.name}
                                                      href={subItem.href}
                                                      className="block text-gray-400 hover:text-white hover:bg-gray-800 py-2 px-2 text-sm rounded-lg transition-colors duration-200"
                                                      onClick={() => setIsOpen(false)}
                                                    >
                                                      {subItem.name}
                                                    </Link>
                                                  ))}
                                                </div>
                                              </div>
                                            ) : (
                                              <Link
                                                href={resource.href}
                                                className="block text-gray-400 hover:text-white hover:bg-gray-800 py-2 px-2 text-sm rounded-lg transition-colors duration-200"
                                                onClick={() => setIsOpen(false)}
                                              >
                                                {resource.name}
                                              </Link>
                                            )}
                                          </div>
                                        ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Mobile Auth Buttons */}
                      <div className="border-t border-gray-800 p-4 space-y-3 bg-black">
                        {isAuthenticated && userProfile ? (
                          <>
                            <div className="px-4 py-2 flex items-center gap-3 text-white bg-gray-900/50 rounded-xl">
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                                {userProfile.user.email.charAt(0).toUpperCase()}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs text-gray-400">Signed in as</p>
                                <p className="text-sm font-medium truncate">{userProfile.user.email}</p>
                              </div>
                            </div>
                            <Link
                              href="https://dashboard.salescentri.com"
                              className="flex items-center justify-center w-full text-white hover:bg-gray-900 transition-all duration-300 py-3 px-4 rounded-xl border border-gray-800 font-medium"
                            >
                              Dashboard
                            </Link>
                            <button
                              onClick={handleSignOut}
                              className="flex items-center justify-center w-full text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-all duration-300 py-3 px-4 rounded-xl border border-red-900/30 font-medium"
                            >
                              Sign out
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setIsOpen(false);
                                const from = typeof window !== "undefined" ? window.location.href : "https://salescentri.com";
                                window.location.href = `/login-portal?from=${encodeURIComponent(from)}`;
                              }}
                              className="flex items-center justify-center w-full text-gray-400 hover:text-white transition-all duration-300 py-2 px-4 text-sm font-medium"
                              data-track="mobile_nav_login"
                            >
                              Sign in
                            </button>
                            <Link
                              href="/get-started"
                              className="relative flex w-full p-[1px] rounded-full overflow-hidden group"
                              data-track="mobile_nav_get_started"
                              onClick={() => {
                                setIsOpen(false);
                              }}
                            >
                              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#FF0000_0%,#FFFF00_25%,#00FF00_50%,#0000FF_75%,#FF0000_100%)]" />
                              <span className="relative flex items-center justify-center w-full bg-black text-white px-4 py-3 rounded-full font-medium transition-all duration-300">
                                <span>Get started</span>
                              </span>
                            </Link>
                            <button
                              onClick={() => {
                                setIsModalOpen(true);
                                setIsOpen(false);
                              }}
                              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-3 rounded-full shadow-lg shadow-blue-600/20 transition-all duration-300 border border-white/10 font-medium group"
                              data-track="mobile_nav_lets_talk"
                            >
                              <Phone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                              <span>Let&apos;s Talk</span>
                            </button>
                            <Link
                              href="/demo"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-center gap-2 w-full text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 py-3 px-4 rounded-full font-medium"
                              data-track="mobile_nav_view_demo"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>View Demo</span>
                            </Link>
                          </>
                        )}
                      </div>
                    </motion.div>
                  </>,
                  document.body
                )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Futuristic Dock Navigation - Appears at bottom when scrolled past hero */}
      <AnimatePresence>
        {showDock && (
          <motion.div
            initial={{ y: 200, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 200, opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              duration: 0.6,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
          >
            <div className="flex justify-center pb-4 pointer-events-auto">
              <Dock
                items={dockItems}
                className="bg-black/80 border-gray-700/40"
                magnification={window.innerWidth < 768 ? 50 : 80}
                distance={200}
                baseItemSize={window.innerWidth < 768 ? 40 : 60}
                panelHeight={window.innerWidth < 768 ? 60 : 80}
                spring={{ mass: 0.1, stiffness: 200, damping: 15 }}
                onDropdownChangeAction={setIsDockDropdownOpen}
                activeDockDropdown={activeDockDropdown}
                setActiveDockDropdownAction={setActiveDockDropdown}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Platforms Dropdown for Dock */}
      <AnimatePresence>
        {activeDropdown === "platforms" && showDock && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-40 w-[900px] bg-black border border-gray-700/50 rounded-2xl p-6 shadow-2xl dark:bg-black"
            onMouseEnter={() => setActiveDropdown("platforms")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex space-x-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">
                    Contact Intelligence & Data
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      href="/platforms/contact-intelligence/ai-aggregator"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Database className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        AI Aggregator
                      </span>
                    </Link>
                    <Link
                      href="/platforms/contact-intelligence/ai-hunter"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Search className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        AI Hunter
                      </span>
                    </Link>
                    <Link
                      href="/platforms/contact-intelligence/hunter-validator"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Shield className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Contact Validator
                      </span>
                    </Link>
                    <Link
                      href="/platforms/contact-intelligence/intellibase"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <TrendingUp className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        IntelliBase
                      </span>
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">
                    Lead Management Core
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      href="/platforms/lead-management/iema-email-marketing-automation"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <MessageSquare className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        iEMA (Email Marketing)
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/lead-generation"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Search className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Lead Generation
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/lead-stream"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <TrendingUp className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Lead Stream
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/ilms-lead-management-system"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Database className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        iLMS (Lead Management)
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">
                    Voice AI & Dialer Solutions
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      href="/platforms/lead-management/dialer-ai"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Phone className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        DialerAI
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/sim-dialer"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Phone className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        SIM Dialer
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/salesai-agent"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Bot className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        SalesAI Agent
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/voice-ai-agent"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Bot className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        VoiceAI Agent
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/voice-bot"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Bot className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Voice Bot
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/sales-tune"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <TrendingUp className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Sales Tune
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">
                    Chat & AI Automation
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      href="/platforms/lead-management/chat-bot"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Bot className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Chat Bot
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/whatsapp-bot"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <MessageSquare className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        WhatsApp Bot
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/text-to-speech"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Bot className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Text to Speech
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/speech-to-text"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Bot className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Speech to Text
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/voice-bot"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Bot className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Voice Bot
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/sales-tune"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <TrendingUp className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Sales Tune
                      </span>
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-3 text-lg">
                    Cloud Infrastructure
                  </h3>
                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      href="/platforms/lead-management/igct"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Cloud className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        iGCT
                      </span>
                    </Link>
                    <Link
                      href="/platforms/lead-management/call-center"
                      className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-gray-800/70 transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <Phone className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                      <span className="text-gray-300 group-hover:text-white text-sm">
                        Call Center
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead Capture Modal */}
      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};