'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight,  ExternalLink, Plug, Database, Cloud, Building, ShoppingCart, Users, BarChart3, Mail, CreditCard } from 'lucide-react';

export default function WhatsAppBotIntegrationsPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/whatsapp-bot';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const integrationCategories = [
    {
      category: "CRM Systems",
      icon: Users,
      description: "Seamlessly sync customer data and conversations with your CRM",
      integrations: [
        { name: "Salesforce", description: "Complete lead &amp; opportunity management", status: "Available" },
        { name: "HubSpot", description: "Marketing automation &amp; contact sync", status: "Available" },
        { name: "Pipedrive", description: "Sales pipeline &amp; deal tracking", status: "Available" },
        { name: "Zoho CRM", description: "Customer relationship management", status: "Available" },
        { name: "Microsoft Dynamics", description: "Enterprise CRM integration", status: "Available" },
        { name: "Custom CRM", description: "API-based custom CRM connections", status: "Available" }
      ]
    },
    {
      category: "E-commerce Platforms",
      icon: ShoppingCart,
      description: "Connect with e-commerce platforms for order management and customer support",
      integrations: [
        { name: "Shopify", description: "Order tracking &amp; customer support", status: "Available" },
        { name: "WooCommerce", description: "WordPress e-commerce integration", status: "Available" },
        { name: "Magento", description: "Advanced e-commerce features", status: "Available" },
        { name: "BigCommerce", description: "Enterprise e-commerce platform", status: "Available" },
        { name: "Square", description: "Point of sale &amp; inventory sync", status: "Coming Soon" },
        { name: "Custom Cart", description: "API integration for custom platforms", status: "Available" }
      ]
    },
    {
      category: "Business Tools",
      icon: Building,
      description: "Integrate with essential business and productivity tools",
      integrations: [
        { name: "Google Workspace", description: "Calendar, Drive, &amp; Gmail integration", status: "Available" },
        { name: "Microsoft 365", description: "Office suite &amp; Teams integration", status: "Available" },
        { name: "Slack", description: "Team notifications &amp; alerts", status: "Available" },
        { name: "Trello", description: "Project management &amp; task creation", status: "Available" },
        { name: "Asana", description: "Workflow &amp; team collaboration", status: "Available" },
        { name: "Monday.com", description: "Work management platform", status: "Coming Soon" }
      ]
    },
    {
      category: "Analytics &amp; Marketing",
      icon: BarChart3,
      description: "Track performance and enhance marketing efforts",
      integrations: [
        { name: "Google Analytics", description: "Conversation &amp; conversion tracking", status: "Available" },
        { name: "Facebook Pixel", description: "Retargeting &amp; audience building", status: "Available" },
        { name: "Mailchimp", description: "Email marketing automation", status: "Available" },
        { name: "Klaviyo", description: "Advanced email &amp; SMS marketing", status: "Available" },
        { name: "Mixpanel", description: "Advanced event tracking", status: "Coming Soon" },
        { name: "Segment", description: "Customer data platform", status: "Available" }
      ]
    },
    {
      category: "Payment Systems",
      icon: CreditCard,
      description: "Accept payments and process transactions directly in WhatsApp",
      integrations: [
        { name: "Stripe", description: "Online payment processing", status: "Available" },
        { name: "PayPal", description: "Global payment solutions", status: "Available" },
        { name: "Square Payments", description: "Unified payment platform", status: "Available" },
        { name: "Razorpay", description: "Indian payment gateway", status: "Available" },
        { name: "Paymob", description: "MENA region payments", status: "Coming Soon" },
        { name: "Custom Gateway", description: "API-based payment integration", status: "Available" }
      ]
    },
    {
      category: "Communication Platforms",
      icon: Mail,
      description: "Extend conversations across multiple communication channels",
      integrations: [
        { name: "Twilio", description: "SMS &amp; voice integration", status: "Available" },
        { name: "SendGrid", description: "Email delivery &amp; management", status: "Available" },
        { name: "Telegram", description: "Multi-platform messaging", status: "Available" },
        { name: "Facebook Messenger", description: "Social media messaging", status: "Available" },
        { name: "Instagram DM", description: "Instagram direct messages", status: "Coming Soon" },
        { name: "Live Chat", description: "Website chat widget", status: "Available" }
      ]
    }
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                WhatsApp Bot Integrations
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect your WhatsApp Bot with the tools you already use. Seamless integrations to enhance 
              your customer experience and streamline business operations.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Plug className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">100+ pre-built integrations available</span>
            </div>
          </div>
        </motion.section>

        {/* Integration Categories */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="py-20 px-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="space-y-16">
              {integrationCategories.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * categoryIndex }}
                >
                  <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white" dangerouslySetInnerHTML={{ __html: category.category }}></h2>
                    </div>
                    <p className="text-gray-400 max-w-2xl mx-auto">{category.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.integrations.map((integration, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.05 * index }}
                        className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
                            <p className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: integration.description }}></p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                          integration.status === 'Available' 
                               ? 'bg-blue-500/20 text-blue-400' 
                               : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {integration.status}
                          </span>
                        </div>
                        
                        {integration.status === 'Available' && (
                          <div className="flex items-center text-blue-400 text-sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span>View Integration Details</span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Custom Integration */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-blue-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a Custom Integration?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Don&apos;t see your tool listed? Our developers can create custom integrations for your specific needs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Database,
                  title: "API Connections",
                  description: "Connect to any system with REST or GraphQL APIs for seamless data exchange"
                },
                {
                  icon: Cloud,
                  title: "Webhook Support",
                  description: "Real-time event notifications and data synchronization with your existing tools"
                },
                {
                  icon: Building,
                  title: "Enterprise Solutions",
                  description: "Custom enterprise integrations with dedicated support and SLA guarantees"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Connect Your Tools?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Get started with our WhatsApp Bot and connect all your favorite tools. 
              Most integrations can be set up in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/free-trial"
                className="bg-gradient-to-r from-blue-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                Request Custom Integration
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
