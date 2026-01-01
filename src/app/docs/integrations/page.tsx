'use client';

import { motion } from 'framer-motion';
import { 
  Book, 
  Code, 
  Settings, 
  Zap, 
  Database, 
  ArrowRight, 
  Globe, 
  CheckCircle,
  Download,
  Upload,
  Webhook,
  Monitor,
  BarChart3
} from 'lucide-react';

export default function IntegrationsDocumentationPage() {
  const quickStartGuides = [
    {
      icon: Zap,
      title: "Quick Start Guide",
      description: "Get up and running with your first integration in under 5 minutes",
      link: "/docs/integrations/quick-start",
      time: "5 min read"
    },
    {
      icon: Database,
      title: "CRM Integration Setup",
      description: "Step-by-step guide for connecting Salesforce, HubSpot, and other CRMs",
      link: "/docs/integrations/crm-setup",
      time: "10 min read"
    },
    {
      icon: BarChart3,
      title: "Marketing Automation",
      description: "Connect your marketing tools for enhanced campaign performance",
      link: "/docs/integrations/marketing-automation",
      time: "8 min read"
    },
    {
      icon: Code,
      title: "API Integration Guide",
      description: "Build custom integrations using our comprehensive REST API",
      link: "/docs/integrations/api-guide",
      time: "15 min read"
    }
  ];

  const integrationCategories = [
    {
      category: "CRM Systems",
      icon: Database,
      integrations: [
        { name: "Salesforce", status: "Available", guide: "/docs/integrations/salesforce" },
        { name: "HubSpot", status: "Available", guide: "/docs/integrations/hubspot" },
        { name: "Pipedrive", status: "Available", guide: "/docs/integrations/pipedrive" },
        { name: "Microsoft Dynamics", status: "Available", guide: "/docs/integrations/dynamics" },
        { name: "Zoho CRM", status: "Available", guide: "/docs/integrations/zoho" }
      ]
    },
    {
      category: "Marketing Platforms",
      icon: BarChart3,
      integrations: [
        { name: "Marketo", status: "Available", guide: "/docs/integrations/marketo" },
        { name: "Pardot", status: "Available", guide: "/docs/integrations/pardot" },
        { name: "Mailchimp", status: "Available", guide: "/docs/integrations/mailchimp" },
        { name: "ActiveCampaign", status: "Available", guide: "/docs/integrations/activecampaign" }
      ]
    },
    {
      category: "Data Sources",
      icon: Globe,
      integrations: [
        { name: "LinkedIn Sales Navigator", status: "Available", guide: "/docs/integrations/linkedin" },
        { name: "ZoomInfo", status: "Available", guide: "/docs/integrations/zoominfo" },
        { name: "Apollo", status: "Available", guide: "/docs/integrations/apollo" },
        { name: "Hunter.io", status: "Available", guide: "/docs/integrations/hunter" }
      ]
    },
    {
      category: "Business Intelligence",
      icon: Monitor,
      integrations: [
        { name: "Tableau", status: "Available", guide: "/docs/integrations/tableau" },
        { name: "Power BI", status: "Available", guide: "/docs/integrations/powerbi" },
        { name: "Looker", status: "Available", guide: "/docs/integrations/looker" },
        { name: "Google Analytics", status: "Available", guide: "/docs/integrations/google-analytics" }
      ]
    }
  ];

  const apiResources = [
    {
      icon: Upload,
      title: "Data Ingestion API",
      description: "Push contact data from any source",
      endpoint: "/api/v1/contacts/ingest",
      link: "/docs/api/ingestion"
    },
    {
      icon: Download,
      title: "Data Export API",
      description: "Extract aggregated and enhanced data",
      endpoint: "/api/v1/contacts/export",
      link: "/docs/api/export"
    },
    {
      icon: Webhook,
      title: "Webhook Notifications",
      description: "Real-time event notifications",
      endpoint: "/api/v1/webhooks",
      link: "/docs/api/webhooks"
    },
    {
      icon: Settings,
      title: "Configuration API",
      description: "Manage integration settings",
      endpoint: "/api/v1/config",
      link: "/docs/api/configuration"
    }
  ];

  const troubleshootingTopics = [
    "Common integration errors and solutions",
    "Authentication and authorization issues",
    "Data mapping and field configuration",
    "Rate limiting and API quotas",
    "Webhook delivery failures",
    "Data quality and validation errors"
  ];

  return (
    <div className="min-h-screen bg-[#0B1426] text-white">
      {/* Header */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 mb-6">
              <Book className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-300">Integration Documentation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Integration
              </span>
              <br />
              <span className="text-white">Documentation Hub</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Comprehensive guides, API references, and step-by-step tutorials for integrating 
              the AI Aggregator platform with your favorite tools and systems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Start Guides */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/10 to-cyan-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Quick Start Guides</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get started quickly with these comprehensive guides for the most common integration scenarios.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickStartGuides.map((guide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group"
              >
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <guide.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{guide.title}</h3>
                <p className="text-gray-400 mb-4">{guide.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-300">{guide.time}</span>
                  <div className="text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-300 cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Platform-Specific Guides</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Detailed integration guides for specific platforms and tools, with step-by-step instructions and best practices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {integrationCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 w-12 h-12 rounded-xl flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{category.category}</h3>
                </div>
                
                <div className="space-y-3">
                  {category.integrations.map((integration, idx) => (
                    <div key={idx} className="block p-3 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-gray-300 font-medium">{integration.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-blue-400">{integration.status}</span>
                          <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Resources */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/10 to-cyan-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">API Reference</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Complete API documentation with examples, authentication guides, and interactive testing tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiResources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group"
              >
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <resource.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{resource.description}</p>
                <div className="bg-gray-800/50 rounded-lg p-2 mb-4">
                  <code className="text-blue-300 text-xs">{resource.endpoint}</code>
                </div>
                <div className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-300 cursor-pointer">
                  <span className="text-sm">View Docs</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">Troubleshooting & Support</h2>
              <p className="text-xl text-gray-300 mb-8">
                Find solutions to common integration issues and get the help you need to keep your data flowing smoothly.
              </p>
              
              <div className="space-y-4 mb-8">
                {troubleshootingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{topic}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Integration Health Check</h3>
              <div className="space-y-4">
                {[
                  { check: "API Authentication", status: "Passed", color: "text-green-400" },
                  { check: "Data Source Connectivity", status: "Passed", color: "text-green-400" },
                  { check: "Webhook Delivery", status: "Passed", color: "text-green-400" },
                  { check: "Rate Limit Status", status: "Normal", color: "text-blue-400" },
                  { check: "Data Quality Score", status: "98%", color: "text-green-400" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                    <span className="text-gray-300">{item.check}</span>
                    <span className={`font-semibold ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">All Systems Operational</span>
                </div>
                <p className="text-green-300 text-sm">Your integrations are running smoothly with no issues detected.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600/20 to-cyan-700/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Integrating?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Follow our step-by-step guides to connect your tools and start aggregating contact data 
              in minutes, not hours.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
