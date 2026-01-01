'use client';

import { motion } from 'framer-motion';
import { Search, Zap, Target, Bot, CheckCircle, ArrowRight, Workflow, Users, TrendingUp, Shield, Sparkles, Network, Globe, Atom } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PSAExplainedPage() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('overview');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [planType, setPlanType] = useState<'personal' | 'business'>('personal');
  
  const subNavItems = [
    { name: 'Overview', href: '/solutions/pre-sales-automation', sectionId: 'overview' },
    { name: 'Modes', href: '#modes', sectionId: 'modes' },
    { name: 'Features', href: '#features', sectionId: 'features' },
    { name: 'Use Cases', href: '#use-cases', sectionId: 'use-cases' },
    { name: 'Pricing', href: '#pricing', sectionId: 'pricing' }
  ];

  // Track which section is currently in view
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'modes', 'features', 'use-cases', 'pricing'];
      const scrollPosition = window.scrollY + 100; // Offset for sticky header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const modes = [
    {
      icon: Search,
      title: "Discover Mode",
      description: "Automatically scans 500+ data sources to identify and qualify leads matching your Ideal Customer Profile. The system locates decision-makers, verifies contact information, and enriches prospect data with firmographic and technographic insights. Prospects are automatically scored based on ICP alignment and engagement signals, enabling sales teams to prioritize the most promising opportunities. The workflow delivers verified, qualified prospects ready for immediate outreach.",
      features: ["AI-powered prospect discovery", "Contact verification", "Lead scoring", "Data enrichment"]
    },
    {
      icon: Zap,
      title: "Lightning Mode",
      description: "Instantly engages inbound or warm leads through pre-built automation workflows. Users provide basic contact information (email, website, or LinkedIn), and the mode automatically generates ICP analysis, identifies decision-makers, and creates verified prospect data. The streamlined interface presents qualified opportunities immediately, enabling sales teams to engage within seconds. Ideal for high-velocity scenarios where speed-to-contact directly impacts conversion rates.",
      features: ["Instant lead engagement", "Pre-built workflows", "Automated qualification", "Quick response pipelines"]
    },
    {
      icon: Target,
      title: "Focus Mode",
      description: "Provides a distraction-free interface for executing targeted campaigns on high-value prospects or specific account lists. Prospect data is displayed in an organized grid format for easy review and prioritization. The mode enables detailed analysis of lead quality, engagement history, and qualification status, making it ideal for enterprise accounts, ABM campaigns, and strategic account management where methodical analysis is essential.",
      features: ["Targeted campaigns", "Detailed analysis", "Personalized engagement", "High-value prospect focus"]
    },
    {
      icon: Atom,
      title: "ResearchGPT Mode",
      description: "Conducts comprehensive intelligence gathering on prospects, companies, markets, and competitors using advanced AI research. The mode performs deep research across web sources and company databases, synthesizing findings into actionable insights. Users can query about specific companies, request competitive analysis, develop ICPs, and generate detailed prospect intelligence reports. Essential for sales professionals who need comprehensive prospect intelligence before high-stakes outreach.",
      features: ["AI research capabilities", "Comprehensive intelligence", "Deep prospect insights", "Personalized outreach data"]
    },
    {
      icon: Network,
      title: "MultiGPT Mode",
      description: "Leverages multiple AI models working simultaneously to conduct research from different perspectives. Research queries run in parallel across several AI models, with results displayed side-by-side for comparison. Users can identify consensus findings and discover unique insights from each model's approach, ensuring higher reliability through cross-referenced intelligence. Ideal for complex market analysis, competitive intelligence, and strategic research where multiple viewpoints enhance decision-making.",
      features: ["Multi-model research", "Comparative analysis", "Aggregated insights", "Cross-referenced findings"]
    },
    {
      icon: Globe,
      title: "WebIntel Mode",
      description: "Extracts and analyzes intelligence directly from websites and web-based sources to gather company and prospect information. The mode performs deep website analysis, extracting company details, technology stack, product offerings, and business intelligence from web presence. The workflow automatically visits target websites, extracts structured data, and identifies decision-makers, technology patterns, and buying signals. Essential for quickly understanding companies based on their digital footprint for data-driven outreach.",
      features: ["Website intelligence", "Web data extraction", "Company analysis", "Digital footprint insights"]
    }
  ];

  const keyFeatures = [
    {
      icon: Workflow,
      title: "Automated Workflows",
      description: "Pre-built and customizable automation workflows that handle lead qualification, initial outreach, and follow-up sequences.",
      stats: "80% time savings"
    },
    {
      icon: Users,
      title: "Multi-Channel Engagement",
      description: "Engage prospects across email, phone, social media, and messaging platforms with unified campaign management.",
      stats: "5+ channels"
    },
    {
      icon: TrendingUp,
      title: "AI-Powered Insights",
      description: "Advanced analytics and AI insights that help optimize your pre-sales processes and improve conversion rates.",
      stats: "40% higher conversion"
    },
    {
      icon: Shield,
      title: "CRM Integration",
      description: "Seamless integration with popular CRMs including Salesforce, HubSpot, and Pipedrive for unified data management.",
      stats: "20+ CRM integrations"
    }
  ];

  const useCases = [
    {
      title: "Enterprise Sales Teams",
      description: "Reduce manual prospecting by automating lead discovery and qualification. Scale your sales efforts while maintaining high-quality engagement with decision-makers.",
      image: "/sales-team-pre-sales-automation.png",
      benefits: ["Automated lead discovery", "Scalable qualification", "Decision-maker targeting", "CRM synchronization"]
    },
    {
      title: "Marketing Agencies",
      description: "Launch multi-client pre-sales automation workflows for better lead conversions. Manage multiple campaigns and clients with centralized automation tools.",
      image: "/marketing-sales-pre-sales-automation.png",
      benefits: ["Multi-client management", "Campaign automation", "Client reporting", "Scalable operations"]
    },
    {
      title: "SaaS Companies",
      description: "Automate trial engagement, detect intent, and improve conversion rates. Use intelligent workflows to nurture trial users and identify high-intent prospects.",
      image: "/saas-dashboard-pre-sales-automation.png",
      benefits: ["Trial automation", "Intent detection", "Conversion optimization", "User journey mapping"]
    },
    {
      title: "B2B Lead Gen Firms",
      description: "Use ResearchGPT Mode to enrich leads with verified intelligence and improve sales velocity. Provide comprehensive prospect data for better sales outcomes.",
      image: "/b2b-leads-pre-sales-automation.png",
      benefits: ["Lead enrichment", "Verified intelligence", "Sales velocity", "Comprehensive data"]
    }
  ];

  return (
    <>
      {/* Sub-navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <nav className="flex space-x-8">
              {subNavItems.map((item) => {
                const isActive = activeSection === item.sectionId;
                return item.href.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href.substring(1))}
                    className={`py-4 px-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`py-4 px-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Hero Section */}
        <section id="overview" className="pt-20 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Workflow className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Pre-Sales Automation Platform</span>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-blue-400">Pre-Sales Automation Overview</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
                Uncover how Pre-Sales Automation (PSA) accelerates your lead-to-conversion journey through 
                intelligent modes, AI workflows, and data-driven engagement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/get-started/book-demo">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book a Demo
                  </motion.button>
                </Link>
                <Link href="/solutions/psa-suite-one-stop-solution">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Try PSA Suite
                  </motion.button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">4</div>
                  <div className="text-gray-400">Automation Modes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">80%</div>
                  <div className="text-gray-400">Time Savings</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">40%</div>
                  <div className="text-gray-400">Higher Conversion</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">The Power of Pre-Sales Automation</h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Pre-Sales Automation (PSA) transforms the way marketing and sales teams handle leads. 
                By automating early-stage engagement, qualification, and intelligence gathering, PSA frees up 
                human potential for high-impact conversions. With deep CRM integrations and intelligent AI-driven 
                insights, it ensures your pre-sales efforts are precise, efficient, and scalable.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Modes Section */}
        <section id="modes" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Six Powerful Automation Modes</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Choose the right mode for your specific needs and campaign objectives. Each mode is 
                optimized for different stages of the pre-sales process.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modes.map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <mode.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{mode.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{mode.description}</p>
                  <div className="space-y-2">
                    {mode.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Highlights Section */}
        <section id="features" className="py-20 bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Key Feature Highlights</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Powerful features designed to streamline your pre-sales process and maximize conversion rates.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                  <div className="text-blue-400 font-semibold">{feature.stats}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Real-World Use Cases</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how different organizations leverage PSA to transform their pre-sales processes and achieve better results.
              </p>
            </motion.div>

            <div className="space-y-20">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <h3 className="text-3xl font-bold text-white mb-6">{useCase.title}</h3>
                    <p className="text-lg text-gray-300 mb-6">{useCase.description}</p>
                    <div className="grid grid-cols-1 gap-3">
                      {useCase.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                      <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={useCase.image}
                          alt={useCase.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-black via-gray-900 to-black relative px-4 md:px-6 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1),transparent_50%)]"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 md:mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Pre-Sales Automation Pricing</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 md:mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                  Choose Your
                </span>{" "}
                <span className="text-white">Plan</span>
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Scale your pre-sales automation with our enterprise-grade AI solutions. 
                <span className="text-blue-400 font-semibold"> Start free, upgrade anytime.</span>
              </p>

              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Cancel anytime</span>
                </div>
              </div>

              {/* Plan Type Toggle */}
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full p-1 flex">
                  <button
                    onClick={() => setPlanType('personal')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      planType === 'personal'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Personal
                  </button>
                  <button
                    onClick={() => setPlanType('business')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      planType === 'business'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Business
                  </button>
                </div>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center mb-12">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full p-1 flex">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      billingPeriod === 'monthly'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      billingPeriod === 'yearly'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Yearly
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {(planType === 'personal' ? [
                {
                  name: "Free",
                  price: { monthly: 0, yearly: 0 },
                  period: "/month",
                  description: "Perfect for individuals getting started",
                  features: [
                    "100 AI Hunter searches/month",
                    "500 contact validations",
                    "Basic SalesGPT conversations",
                    "Community support",
                    "Standard integrations"
                  ],
                  cta: "Get Started Free",
                  popular: false,
                  color: "from-cyan-400 to-blue-400",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                },
                {
                  name: "Starter",
                  price: { monthly: 29, yearly: 23 },
                  period: "/month",
                  description: "Great for freelancers and small teams",
                  features: [
                    "1,000 AI Hunter searches/month",
                    "5,000 contact validations",
                    "Advanced SalesGPT conversations",
                    "Email support",
                    "All integrations",
                    "Basic analytics"
                  ],
                  cta: "Start Free Trial",
                  popular: false,
                  color: "from-blue-500 to-blue-600",
                  gradient: "from-blue-600/20 to-blue-700/20",
                },
                {
                  name: "Professional",
                  price: { monthly: 79, yearly: 63 },
                  period: "/month",
                  description: "Advanced features for growing professionals",
                  features: [
                    "10,000 AI Hunter searches/month",
                    "25,000 contact validations",
                    "Advanced SalesGPT with custom prompts",
                    "Priority support",
                    "All integrations",
                    "Custom workflows",
                    "Analytics dashboard",
                    "Up to 5 team members"
                  ],
                  cta: "Start Free Trial",
                  popular: true,
                  color: "from-purple-500 to-blue-600",
                  gradient: "from-purple-600/20 to-blue-600/20",
                },
                {
                  name: "Pay-As-You-Go",
                  price: "Flexible",
                  period: "",
                  description: "Only pay for what you use. No monthly commitment.",
                  features: [
                    "Contact Validator: $0.00494 per validation (first 100 free)",
                    "No monthly minimums",
                    "Access to all integrations",
                    "Basic analytics",
                    "Community support"
                  ],
                  cta: "Start Now",
                  popular: false,
                  color: "from-green-400 to-blue-400",
                  gradient: "from-green-500/20 to-blue-500/20",
                }
              ] : [
                {
                  name: "Free",
                  price: { monthly: 0, yearly: 0 },
                  period: "/month",
                  description: "Perfect for small businesses getting started",
                  features: [
                    "500 AI Hunter searches/month",
                    "1,000 contact validations",
                    "Basic SalesGPT conversations",
                    "Community support",
                    "Standard integrations",
                    "Up to 3 team members"
                  ],
                  cta: "Get Started Free",
                  popular: false,
                  color: "from-cyan-400 to-blue-400",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                },
                {
                  name: "Pay-As-You-Go",
                  price: "Flexible",
                  period: "",
                  description: "Only pay for what you use. No monthly commitment.",
                  features: [
                    "Contact Validator: $0.00494 per validation (first 500 free)",
                    "No monthly minimums",
                    "Access to all integrations",
                    "Basic analytics",
                    "Up to 10 team members",
                    "Community support"
                  ],
                  cta: "Start Now",
                  popular: false,
                  color: "from-green-400 to-blue-400",
                  gradient: "from-green-500/20 to-blue-500/20",
                },
                {
                  name: "Premium",
                  price: { monthly: 299, yearly: 239 },
                  period: "/month",
                  description: "Advanced features for established businesses",
                  features: [
                    "25,000 AI Hunter searches/month",
                    "100,000 contact validations",
                    "Advanced SalesGPT with custom prompts",
                    "Priority support",
                    "All integrations",
                    "Custom workflows",
                    "Advanced analytics",
                    "Up to 25 team members",
                    "API access"
                  ],
                  cta: "Start Free Trial",
                  popular: true,
                  color: "from-purple-500 to-blue-600",
                  gradient: "from-purple-600/20 to-blue-600/20",
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "",
                  description: "Unlimited power for large organizations",
                  features: [
                    "Unlimited AI Hunter searches",
                    "Unlimited contact validations",
                    "Enterprise SalesGPT with custom training",
                    "Dedicated account manager",
                    "Custom integrations & API access",
                    "Advanced analytics & white-label",
                    "SLA guarantee & phone support",
                    "On-premise deployment options",
                    "Unlimited team members",
                    "Custom training & onboarding"
                  ],
                  cta: "Contact Sales",
                  popular: false,
                  color: "from-indigo-500 to-indigo-600",
                  gradient: "from-indigo-600/20 to-indigo-700/20",
                }
              ]).map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-blue-500/25 backdrop-blur-sm border border-blue-400/30">
                        Most Popular
                      </div>
                    </div>
                  )}

                  <motion.div
                    className={`relative bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-500 h-full flex flex-col group-hover:scale-105 ${
                      plan.popular
                        ? "border-blue-500/50 shadow-2xl shadow-blue-500/20 bg-gradient-to-br from-gray-900/90 via-black/95 to-gray-900/90"
                        : "border-gray-800 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
                    }`}
                    whileHover={{ y: -8 }}
                    style={{
                      background: plan.popular 
                        ? `linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(0, 0, 0, 0.95) 50%, rgba(17, 24, 39, 0.9) 100%)`
                        : `linear-gradient(135deg, rgba(17, 24, 39, 0.8) 0%, rgba(0, 0, 0, 0.9) 50%, rgba(17, 24, 39, 0.8) 100%)`
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-20 rounded-2xl`}></div>
                    
                    <div className="relative z-10 flex-grow">
                      <div className="mb-6">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline mb-2">
                          {typeof plan.price === "object" ? (
                            <>
                              <span className="text-3xl md:text-4xl font-bold text-white">
                                ${billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly}
                              </span>
                              <span className="text-gray-400 ml-2 text-lg">
                                {plan.period}
                              </span>
                            </>
                          ) : (
                            <span className="text-3xl md:text-4xl font-bold text-white">
                              {plan.price}
                            </span>
                          )}
                        </div>
                        {typeof plan.price === "object" && billingPeriod === 'monthly' && (
                          <p className="text-sm text-blue-400 font-medium">
                            Save 20% with annual billing (${plan.price.yearly}/month)
                          </p>
                        )}
                        {typeof plan.price === "object" && billingPeriod === 'yearly' && (
                          <p className="text-sm text-green-400 font-medium">
                            You're saving 20% with annual billing!
                          </p>
                        )}
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-300 text-sm leading-relaxed">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative z-10 mt-auto">
                      <Link
                        href={plan.name === "Enterprise" ? "/get-started/contact" : "/get-started/free-trial"}
                        className="block w-full"
                      >
                        <motion.button
                          className={`w-full py-4 rounded-xl font-bold transition-all duration-300 cursor-pointer text-base ${
                            plan.popular
                              ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                              : "bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/30 hover:text-white"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {plan.cta}
                        </motion.button>
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <div className="bg-gradient-to-r from-gray-900/50 to-black/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Need a custom solution?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Contact our sales team for enterprise pricing, custom integrations, and dedicated support.
                </p>
                <Link href="/get-started/contact">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                    Contact Sales
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Workflow className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-6">
                Revolutionize your pre-sales funnel with PSA.
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Transform your lead-to-conversion process with intelligent automation. 
                Book a demo to see how PSA can accelerate your sales results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/get-started/book-demo">
                  <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book a Demo
                  </motion.button>
                </Link>
                <Link href="/solutions/pre-sales-automation/pricing">
                  <motion.button
                    className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Pricing
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
