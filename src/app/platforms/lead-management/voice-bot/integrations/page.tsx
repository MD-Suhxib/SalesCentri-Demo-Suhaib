'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, BarChart3, ArrowRight, CheckCircle, Settings, Phone } from 'lucide-react';

export default function VoiceBotIntegrationsPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/voice-bot';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
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
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-20 pb-16 px-6"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-cyan-400 bg-clip-text text-transparent">
              Voice Bot Integrations
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Seamlessly connect Voice Bot with your existing telephony and business tools for a unified communication experience. 
              Our extensive integration library ensures your voice automation works perfectly with your current tech stack.
            </p>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Telephony Systems',
                  description: 'Integration with major phone and VoIP platforms',
                  icon: Phone,
                  color: 'from-blue-500 to-cyan-500',
                  integrations: [
                    { name: 'Twilio', description: 'Direct API integration for voice calls' },
                    { name: 'Vonage', description: 'Seamless voice communication platform' },
                    { name: 'RingCentral', description: 'Enterprise telephony integration' },
                    { name: '8x8', description: 'Cloud communication platform support' },
                    { name: 'Asterisk', description: 'Open-source PBX integration' },
                    { name: 'Custom SIP', description: 'Any SIP-compatible system' }
                  ]
                },
                {
                  title: 'CRM Systems',
                  description: 'Direct integration with major CRM platforms',
                  icon: Users,
                  color: 'from-cyan-500 to-indigo-500',
                  integrations: [
                    { name: 'Salesforce', description: 'Real-time lead sync and contact creation' },
                    { name: 'HubSpot', description: 'Automated contact management and scoring' },
                    { name: 'Pipedrive', description: 'Deal creation and pipeline management' },
                    { name: 'Zoho CRM', description: 'Complete customer lifecycle management' },
                    { name: 'Freshworks CRM', description: 'Modern CRM with automation' },
                    { name: 'Custom API', description: 'REST API for any CRM system' }
                  ]
                },
                {
                  title: 'Business Tools',
                  description: 'Connect with essential business applications',
                  icon: Settings,
                  color: 'from-indigo-500 to-purple-500',
                  integrations: [
                    { name: 'Slack', description: 'Real-time notifications and alerts' },
                    { name: 'Microsoft Teams', description: 'Team collaboration integration' },
                    { name: 'Zapier', description: 'Connect with 5000+ apps automatically' },
                    { name: 'Make.com', description: 'Advanced workflow automation' },
                    { name: 'n8n', description: 'Open-source automation platform' },
                    { name: 'Custom Webhook', description: 'Real-time data synchronization' }
                  ]
                },
                {
                  title: 'Analytics & Reporting',
                  description: 'Comprehensive insights and performance tracking',
                  icon: BarChart3,
                  color: 'from-purple-500 to-pink-500',
                  integrations: [
                    { name: 'Google Analytics', description: 'Website and call tracking' },
                    { name: 'Mixpanel', description: 'User behavior analytics' },
                    { name: 'Amplitude', description: 'Product analytics integration' },
                    { name: 'Tableau', description: 'Advanced data visualization' },
                    { name: 'Power BI', description: 'Microsoft business intelligence' },
                    { name: 'Custom Dashboard', description: 'Real-time KPI monitoring' }
                  ]
                }
              ].map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center mb-4`}>
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                  <div className="space-y-3">
                    {category.integrations.map((integration, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white text-sm font-medium">{integration.name}</p>
                          <p className="text-gray-500 text-xs">{integration.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20 px-6"
        >
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Integrate Voice Bot?
              </h2>
              <p className="text-gray-300 mb-6">
                Start automating your voice communications today with our comprehensive integration platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/get-started" 
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center gap-2 justify-center"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a 
                  href={process.env.NEXT_PUBLIC_MS_BOOKINGS_URL || 'https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled'} 
                  target="_blank" rel="noopener noreferrer" 
                  className="border border-blue-500/30 text-blue-300 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500/10 transition-all duration-300"
                  data-track="voice_bot_integrations_schedule_demo"
                >
                  Schedule Demo
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
