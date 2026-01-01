'use client';

import { motion } from 'framer-motion';
import { 
  Book, 
  Code, 
  Settings, 
  Zap, 
  ArrowRight, 
  Users,
  Workflow,
  Shield
} from 'lucide-react';

export default function DocumentationPage() {
  const documentationSections = [
    {
      icon: Zap,
      title: "Getting Started",
      description: "Quick start guides, setup tutorials, and basic configuration",
      links: [
        { name: "Quick Start Guide", href: "/docs/getting-started/quick-start" },
        { name: "Account Setup", href: "/docs/getting-started/account-setup" },
        { name: "First Integration", href: "/docs/getting-started/first-integration" },
        { name: "Basic Configuration", href: "/docs/getting-started/basic-config" }
      ]
    },
    {
      icon: Workflow,
      title: "Integrations",
      description: "Complete guides for connecting your tools and platforms",
      links: [
        { name: "Integration Overview", href: "/docs/integrations" },
        { name: "CRM Integrations", href: "/docs/integrations/crm-setup" },
        { name: "Marketing Automation", href: "/docs/integrations/marketing-automation" },
        { name: "Custom API Integration", href: "/docs/integrations/api-guide" }
      ]
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Complete API documentation with examples and code samples",
      links: [
        { name: "API Overview", href: "/docs/api-reference" },
        { name: "Authentication", href: "/docs/api/authentication" },
        { name: "Data Ingestion", href: "/docs/api/ingestion" },
        { name: "Data Export", href: "/docs/api/export" },
        { name: "Webhooks", href: "/docs/api/webhooks" }
      ]
    },
    {
      icon: Users,
      title: "User Guides",
      description: "Feature walkthroughs and best practices for end users",
      links: [
        { name: "User Guide Overview", href: "/docs/user-guide" },
        { name: "Feature Walkthroughs", href: "/docs/user-guide/feature-walkthroughs" },
        { name: "Data Management", href: "/docs/user-guide/data-management" },
        { name: "Reporting & Analytics", href: "/docs/user-guide/reporting" }
      ]
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "Security guidelines, compliance information, and data protection",
      links: [
        { name: "Security Overview", href: "/docs/security" },
        { name: "Data Privacy", href: "/docs/security/privacy" },
        { name: "GDPR Compliance", href: "/docs/security/gdpr" },
        { name: "Security Best Practices", href: "/docs/security/best-practices" }
      ]
    },
    {
      icon: Settings,
      title: "Troubleshooting",
      description: "Common issues, error codes, and solutions",
      links: [
        { name: "Troubleshooting Guide", href: "/docs/troubleshooting" },
        { name: "Error Codes", href: "/docs/troubleshooting/error-codes" },
        { name: "Common Issues", href: "/docs/troubleshooting/common-issues" },
        { name: "Performance Optimization", href: "/docs/troubleshooting/performance" }
      ]
    }
  ];

  const popularGuides = [
    {
      title: "Salesforce Integration Setup",
      description: "Connect your Salesforce CRM in 5 minutes",
      time: "5 min",
      link: "/docs/integrations/salesforce"
    },
    {
      title: "API Authentication Guide",
      description: "Secure your API connections properly",
      time: "8 min",
      link: "/docs/api/authentication"
    },
    {
      title: "Data Quality Best Practices",
      description: "Optimize your contact data quality",
      time: "12 min",
      link: "/docs/user-guide/data-quality"
    },
    {
      title: "Webhook Configuration",
      description: "Set up real-time notifications",
      time: "10 min",
      link: "/docs/api/webhooks"
    }
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
              <span className="text-sm font-medium text-blue-300">Documentation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Sales Centri
              </span>
              <br />
              <span className="text-white">Documentation</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Everything you need to build, integrate, and optimize your sales automation workflows. 
              From quick start guides to advanced API references.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900/10 to-cyan-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Documentation Sections</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore our comprehensive documentation organized by topic and expertise level.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documentationSections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <section.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{section.title}</h3>
                <p className="text-gray-400 mb-6">{section.description}</p>
                
                <div className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <div 
                      key={linkIndex} 
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-500/10 transition-all duration-300 group cursor-pointer"
                    >
                      <span className="text-gray-300 text-sm">{link.name}</span>
                      <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Guides */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Popular Guides</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Most accessed guides and tutorials to help you get the most out of Sales Centri.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularGuides.map((guide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 group"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{guide.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 text-sm">{guide.time} read</span>
                  <div className="text-blue-400 hover:text-blue-300 transition-colors group-hover:translate-x-1 duration-300 cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Need Additional Help?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team and developer community 
              are here to help you succeed.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
