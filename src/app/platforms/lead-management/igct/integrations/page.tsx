'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, ExternalLink, Plug, Database, Cloud, Building, Network, Server, Settings, Code, Phone, Activity } from 'lucide-react';

export default function IGCTIntegrationsPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/igct';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const integrationCategories = [
    {
      category: "VoIP Platforms",
      icon: Phone,
      description: "Seamless integration with popular VoIP and unified communications platforms",
      integrations: [
        { name: "Asterisk", description: "Open-source PBX system integration", status: "Available" },
        { name: "FreeSWITCH", description: "Scalable communication platform", status: "Available" },
        { name: "3CX", description: "Business phone system integration", status: "Available" },
        { name: "Avaya", description: "Enterprise communication solutions", status: "Available" },
        { name: "Cisco Unified CM", description: "Call manager integration", status: "Available" },
        { name: "Custom PBX", description: "SIP-based custom PBX systems", status: "Available" }
      ]
    },
    {
      category: "Carrier Networks",
      icon: Network,
      description: "Direct integration with major telecommunications carriers worldwide",
      integrations: [
        { name: "Tier-1 Carriers", description: "Direct peering with global carriers", status: "Available" },
        { name: "Regional Carriers", description: "Local carrier partnerships", status: "Available" },
        { name: "Mobile Networks", description: "Mobile operator integration", status: "Available" },
        { name: "PSTN Gateways", description: "Traditional telephony connections", status: "Available" },
        { name: "SS7 Networks", description: "Signaling system integration", status: "Available" },
        { name: "SIP Trunking", description: "Direct SIP connectivity", status: "Available" }
      ]
    },
    {
      category: "Cloud Platforms",
      icon: Cloud,
      description: "Integration with major cloud infrastructure and communication services",
      integrations: [
        { name: "AWS Connect", description: "Amazon cloud contact center", status: "Available" },
        { name: "Microsoft Teams", description: "Direct routing integration", status: "Available" },
        { name: "Google Cloud", description: "Contact Center AI integration", status: "Available" },
        { name: "Twilio", description: "Programmable voice platform", status: "Available" },
        { name: "Vonage", description: "Communication APIs", status: "Coming Soon" },
        { name: "Custom Cloud", description: "Private cloud deployments", status: "Available" }
      ]
    },
    {
      category: "Business Systems",
      icon: Building,
      description: "Integration with CRM, billing, and business management systems",
      integrations: [
        { name: "Salesforce", description: "CRM call logging &amp; analytics", status: "Available" },
        { name: "HubSpot", description: "Sales &amp; marketing integration", status: "Available" },
        { name: "QuickBooks", description: "Billing &amp; accounting integration", status: "Available" },
        { name: "NetSuite", description: "ERP system connectivity", status: "Available" },
        { name: "Custom CRM", description: "API-based CRM integration", status: "Available" },
        { name: "Billing Systems", description: "Telecom billing platforms", status: "Available" }
      ]
    },
    {
      category: "Development APIs",
      icon: Code,
      description: "Comprehensive APIs for custom integrations and applications",
      integrations: [
        { name: "REST API", description: "Full-featured RESTful API", status: "Available" },
        { name: "GraphQL", description: "Flexible query API interface", status: "Available" },
        { name: "WebSocket", description: "Real-time event streaming", status: "Available" },
        { name: "Webhooks", description: "Event-driven notifications", status: "Available" },
        { name: "SDKs", description: "Multi-language development kits", status: "Available" },
        { name: "Custom APIs", description: "Tailored API development", status: "Available" }
      ]
    },
    {
      category: "Monitoring &amp; Analytics",
      icon: Activity,
      description: "Integration with monitoring, analytics, and reporting platforms",
      integrations: [
        { name: "Grafana", description: "Real-time monitoring dashboards", status: "Available" },
        { name: "Elasticsearch", description: "Log analysis &amp; search", status: "Available" },
        { name: "Splunk", description: "Enterprise monitoring platform", status: "Available" },
        { name: "Datadog", description: "Infrastructure monitoring", status: "Available" },
        { name: "New Relic", description: "Application performance monitoring", status: "Coming Soon" },
        { name: "Custom Analytics", description: "Tailored reporting solutions", status: "Available" }
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
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                IGCT Integrations
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect our International Gateway Call Termination platform with your existing 
              infrastructure. Comprehensive integration options for seamless call routing and management.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Plug className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">500+ carrier integrations • Enterprise APIs • 24/7 support</span>
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
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
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
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {integration.status}
                          </span>
                        </div>
                        
                        {integration.status === 'Available' && (
                          <div className="flex items-center text-blue-400 text-sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            <span>View Integration Guide</span>
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

        {/* Technical Specifications */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Technical Capabilities</h2>
              <p className="text-lg text-gray-300 mb-8">
                Enterprise-grade technical specifications for seamless integration with any infrastructure.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Database,
                  title: "Protocol Support",
                  description: "SIP, H.323, SS7, ISUP, and custom protocols for maximum compatibility"
                },
                {
                  icon: Server,
                  title: "High Availability",
                  description: "99.99% uptime SLA with redundant infrastructure and automatic failover"
                },
                {
                  icon: Settings,
                  title: "Scalable Architecture",
                  description: "Auto-scaling infrastructure handling millions of concurrent calls"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Code Example */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">API Integration Example</h2>
              <p className="text-lg text-gray-300">
                Simple API calls to route international calls through our gateway network.
              </p>
            </div>

            <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Call Routing API</h3>
                <span className="text-sm text-gray-400">REST API</span>
              </div>
              <pre className="text-gray-300 text-sm overflow-x-auto">
{`POST /api/v1/calls/route
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "from": "+15551234567",
  "to": "+441234567890",
  "routing_preferences": {
    "priority": "quality",
    "max_cost_per_minute": 0.008,
    "carrier_preference": "tier1"
  },
  "webhook_url": "https://your-domain.com/webhooks/call-status"
}

Response:
{
  "call_id": "igct_call_abc123",
  "route_selected": {
    "carrier": "Premium-UK-01",
    "rate_per_minute": 0.0055,
    "estimated_pdd": "4ms",
    "quality_score": 9.8
  },
  "status": "routing_initiated"
}`}
              </pre>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-indigo-900/20"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Integrate with Our Gateway?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Connect your infrastructure to our global call termination network. 
              Our technical team will help you integrate quickly and efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started/book-demo"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 group inline-flex items-center justify-center"
              >
                <span>Schedule Technical Demo</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs/api-reference"
                className="border border-blue-500 text-blue-400 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 inline-flex items-center justify-center"
              >
                View API Documentation
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
