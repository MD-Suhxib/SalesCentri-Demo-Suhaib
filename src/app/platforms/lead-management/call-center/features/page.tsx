'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, CheckCircle, BarChart, Shield, Volume2, Brain, Users, TrendingUp, ChevronRight, Star } from 'lucide-react';

export default function CallCenterFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/call-center';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const featureCategories = [
    {
      category: "Call Management",
      icon: Phone,
      description: "Comprehensive call handling and routing capabilities",
      features: [
        {
          name: "Intelligent Call Routing",
          description: "AI-powered routing based on agent skills, availability, and customer priority",
          benefits: "50% faster call resolution • Improved customer satisfaction • Optimal agent utilization",
          highlight: true
        },
        {
          name: "Automatic Call Distribution (ACD)",
          description: "Smart distribution of incoming calls to available agents",
          benefits: "Reduced wait times • Better workload balance • Queue management"
        },
        {
          name: "Call Recording & Monitoring",
          description: "100% call recording with real-time monitoring capabilities",
          benefits: "Quality assurance • Compliance • Training & coaching"
        },
        {
          name: "Interactive Voice Response (IVR)",
          description: "Multi-level IVR with voice recognition and self-service options",
          benefits: "Reduced agent workload • 24/7 automation • Customer self-service"
        },
        {
          name: "Call Queuing & Hold",
          description: "Advanced queuing system with personalized hold experiences",
          benefits: "Reduced abandonment rates • Custom hold music • Queue callbacks"
        },
        {
          name: "Call Transfer & Conference",
          description: "Seamless call transfers, warm transfers, and multi-party conferencing",
          benefits: "Improved collaboration • Expert consultation • Customer satisfaction"
        }
      ]
    },
    {
      category: "Agent Experience",
      icon: Users,
      description: "Tools and features designed to empower your agents",
      features: [
        {
          name: "Unified Agent Desktop",
          description: "Single interface for calls, customer data, and communication tools",
          benefits: "Faster call handling • Reduced training time • Better efficiency",
          highlight: true
        },
        {
          name: "Real-time Agent Assistance",
          description: "AI-powered suggestions and knowledge base integration",
          benefits: "Improved call quality • Faster resolutions • Reduced escalations"
        },
        {
          name: "Call Scripting & Guidance",
          description: "Dynamic call scripts and guided workflows",
          benefits: "Consistent messaging • Compliance • New agent support"
        },
        {
          name: "Agent Analytics Dashboard",
          description: "Personal performance metrics and coaching insights",
          benefits: "Self-improvement • Goal tracking • Performance optimization"
        },
        {
          name: "Flexible Scheduling",
          description: "Advanced scheduling with shift preferences and time-off management",
          benefits: "Better work-life balance • Reduced turnover • Optimal staffing"
        },
        {
          name: "Multi-channel Communication",
          description: "Voice, chat, email, and social media in one platform",
          benefits: "Seamless customer experience • Agent efficiency • Unified view"
        }
      ]
    },
    {
      category: "Analytics & Insights",
      icon: BarChart,
      description: "Comprehensive reporting and real-time analytics",
      features: [
        {
          name: "Real-time Performance Dashboards",
          description: "Live monitoring of call center KPIs and agent performance",
          benefits: "Immediate insights • Proactive management • Quick adjustments",
          highlight: true
        },
        {
          name: "Historical Reporting",
          description: "Detailed reports on call volume, resolution times, and trends",
          benefits: "Data-driven decisions • Trend analysis • Performance tracking"
        },
        {
          name: "Customer Journey Analytics",
          description: "Track customer interactions across all touchpoints",
          benefits: "Better customer understanding • Journey optimization • Personalization"
        },
        {
          name: "Quality Assurance Reports",
          description: "Automated quality scoring and coaching recommendations",
          benefits: "Consistent quality • Improved training • Performance improvement"
        },
        {
          name: "Predictive Analytics",
          description: "AI-powered forecasting for call volume and staffing needs",
          benefits: "Optimal staffing • Cost reduction • Better planning"
        },
        {
          name: "Custom Analytics",
          description: "Build custom reports and metrics specific to your business",
          benefits: "Tailored insights • Business-specific KPIs • Flexible reporting"
        }
      ]
    },
    {
      category: "AI & Automation",
      icon: Brain,
      description: "Intelligent automation and AI-powered features",
      features: [
        {
          name: "AI Virtual Agents",
          description: "Advanced chatbots and voice bots for first-level support",
          benefits: "24/7 availability • Cost reduction • Instant responses",
          highlight: true
        },
        {
          name: "Sentiment Analysis",
          description: "Real-time emotion detection during customer interactions",
          benefits: "Better customer understanding • Proactive interventions • Quality insights"
        },
        {
          name: "Automatic Call Summarization",
          description: "AI-generated call summaries and next-action recommendations",
          benefits: "Faster case resolution • Better handoffs • Improved follow-up"
        },
        {
          name: "Intent Recognition",
          description: "Understand customer intent to route calls more effectively",
          benefits: "Better routing decisions • Reduced transfers • Faster resolution"
        },
        {
          name: "Predictive Dialing",
          description: "AI-optimized outbound calling with predictive algorithms",
          benefits: "Higher connect rates • Improved efficiency • Better outcomes"
        },
        {
          name: "Voice Analytics",
          description: "Advanced voice pattern analysis for insights and coaching",
          benefits: "Communication insights • Training opportunities • Quality improvement"
        }
      ]
    }
  ];

  const performanceMetrics = [
    { metric: "Average Call Resolution", improvement: "45%", description: "Faster issue resolution" },
    { metric: "Customer Satisfaction", improvement: "38%", description: "Higher CSAT scores" },
    { metric: "Agent Productivity", improvement: "52%", description: "More calls handled per agent" },
    { metric: "Operational Costs", improvement: "35%", description: "Reduction in total costs" },
    { metric: "First Call Resolution", improvement: "42%", description: "Issues resolved on first call" },
    { metric: "Agent Turnover", improvement: "48%", description: "Reduction in turnover rate" }
  ];

  return (
    <>
      {/* Sub-navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800 sticky top-18 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end">
            <nav className="flex space-x-8">
              {subNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`py-4 px-2 text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-blue-400 border-b-2 border-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        {/* Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                Call Center Features
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Comprehensive call center platform with AI-powered features, advanced analytics, 
              and tools designed to maximize agent productivity and customer satisfaction.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Star className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">Enterprise-grade • AI-powered • Cloud-native platform</span>
            </div>
          </div>
        </motion.section>

        {/* Performance Metrics */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Proven Performance Improvements</h2>
              <p className="text-lg text-gray-300">
                Real results from call centers using our platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {performanceMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl p-8">
                    <div className="text-3xl font-bold text-blue-400 mb-2">+{metric.improvement}</div>
                    <div className="text-lg font-semibold text-white mb-2">{metric.metric}</div>
                    <div className="text-gray-400 text-sm">{metric.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Feature Categories */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="space-y-20">
              {featureCategories.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
                >
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">{category.category}</h2>
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto">{category.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {category.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.05 * index }}
                        className={`bg-gray-800/50 rounded-xl p-6 border transition-all duration-300 ${
                          feature.highlight 
                            ? 'border-blue-500/50 bg-gradient-to-br from-blue-900/20 to-indigo-900/20' 
                            : 'border-gray-700/50 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">{feature.name}</h3>
                          {feature.highlight && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 mb-4">{feature.description}</p>
                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-400">{feature.benefits}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Integration Capabilities */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Enterprise Integration</h2>
              <p className="text-lg text-gray-300">
                Seamlessly connect with your existing business systems and workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: "CRM Integration",
                  description: "Native integration with Salesforce, HubSpot, and 200+ CRM systems",
                  features: ["Screen pop on incoming calls", "Automatic call logging", "Contact synchronization"]
                },
                {
                  icon: Volume2,
                  title: "Unified Communications",
                  description: "Connect with existing UC platforms and communication tools",
                  features: ["Microsoft Teams integration", "Slack notifications", "Email coordination"]
                },
                {
                  icon: TrendingUp,
                  title: "Business Intelligence",
                  description: "Export data to your BI tools and data warehouses",
                  features: ["Real-time data streaming", "Custom API endpoints", "Automated reporting"]
                }
              ].map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                    <capability.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{capability.title}</h3>
                  <p className="text-gray-400 mb-6">{capability.description}</p>
                  <ul className="space-y-2">
                    {capability.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                        <ChevronRight className="w-4 h-4 text-blue-400 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your Call Center Operations
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Experience the power of AI-driven call center management. 
              Start your free trial and see immediate improvements in efficiency and customer satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/get-started/book-demo"
                className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
