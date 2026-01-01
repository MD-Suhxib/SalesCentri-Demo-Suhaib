'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Volume2, ArrowRight, ExternalLink, Plug, Database, Cloud, Building, Users, BarChart3, Mail, Code, Smartphone, Globe } from 'lucide-react';

export default function TextToSpeechIntegrationsPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/text-to-speech';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
  ];

  const integrationCategories = [
    {
      category: "Content Management Systems",
      icon: Building,
      description: "Seamlessly integrate with popular CMS platforms for automated content narration",
      integrations: [
        { name: "WordPress", description: "Auto-generate audio for blog posts &amp; pages", status: "Available" },
        { name: "Drupal", description: "Content accessibility &amp; audio generation", status: "Available" },
        { name: "Joomla", description: "Website content narration", status: "Available" },
        { name: "Ghost", description: "Blog post audio generation", status: "Available" },
        { name: "Webflow", description: "Website accessibility features", status: "Coming Soon" },
        { name: "Custom CMS", description: "API integration for any platform", status: "Available" }
      ]
    },
    {
      category: "E-learning Platforms",
      icon: Users,
      description: "Transform educational content with professional narration and accessibility features",
      integrations: [
        { name: "Moodle", description: "Course content narration &amp; accessibility", status: "Available" },
        { name: "Canvas", description: "Educational material audio generation", status: "Available" },
        { name: "Blackboard", description: "Learning management integration", status: "Available" },
        { name: "Google Classroom", description: "Assignment &amp; material narration", status: "Available" },
        { name: "Coursera", description: "Course content voice-over", status: "Coming Soon" },
        { name: "Custom LMS", description: "API-based e-learning integration", status: "Available" }
      ]
    },
    {
      category: "Development Platforms",
      icon: Code,
      description: "Integrate voice generation into your applications and development workflow",
      integrations: [
        { name: "REST API", description: "Full-featured RESTful API access", status: "Available" },
        { name: "GraphQL", description: "Flexible GraphQL API interface", status: "Available" },
        { name: "Webhooks", description: "Real-time event notifications", status: "Available" },
        { name: "Python SDK", description: "Native Python library integration", status: "Available" },
        { name: "Node.js SDK", description: "JavaScript/TypeScript development", status: "Available" },
        { name: "Custom SDKs", description: "Language-specific development kits", status: "Available" }
      ]
    },
    {
      category: "Marketing Tools",
      icon: BarChart3,
      description: "Enhance marketing campaigns with voice content and audio advertising",
      integrations: [
        { name: "HubSpot", description: "Marketing automation &amp; content", status: "Available" },
        { name: "Mailchimp", description: "Email campaign audio content", status: "Available" },
        { name: "Salesforce Marketing", description: "Campaign voice personalization", status: "Available" },
        { name: "Marketo", description: "Lead nurturing audio content", status: "Available" },
        { name: "Klaviyo", description: "E-commerce marketing audio", status: "Coming Soon" },
        { name: "Custom Marketing", description: "API integration for any platform", status: "Available" }
      ]
    },
    {
      category: "Communication Platforms",
      icon: Mail,
      description: "Add voice capabilities to communication and messaging platforms",
      integrations: [
        { name: "Twilio", description: "Voice calls &amp; messaging integration", status: "Available" },
        { name: "Slack", description: "Voice message generation in channels", status: "Available" },
        { name: "Microsoft Teams", description: "Meeting &amp; message voice content", status: "Available" },
        { name: "Discord", description: "Community voice message creation", status: "Available" },
        { name: "Telegram", description: "Bot voice message generation", status: "Coming Soon" },
        { name: "Custom Chat", description: "Voice integration for any platform", status: "Available" }
      ]
    },
    {
      category: "Mobile &amp; Apps",
      icon: Smartphone,
      description: "Integrate voice generation into mobile applications and digital products",
      integrations: [
        { name: "iOS SDK", description: "Native iPhone &amp; iPad app integration", status: "Available" },
        { name: "Android SDK", description: "Native Android app development", status: "Available" },
        { name: "React Native", description: "Cross-platform mobile development", status: "Available" },
        { name: "Flutter", description: "Multi-platform app framework", status: "Available" },
        { name: "Xamarin", description: "Microsoft mobile development", status: "Coming Soon" },
        { name: "Unity", description: "Game development voice integration", status: "Available" }
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
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-white to-indigo-400 bg-clip-text text-transparent">
                Text to Speech Integrations
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect our Text to Speech technology with your existing tools and workflows. 
              Comprehensive integration options for any platform or application.
            </p>
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-2">
              <Plug className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm">150+ integrations available • Custom development supported</span>
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

        {/* API Features */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="py-20 bg-gradient-to-r from-blue-900/10 via-black to-indigo-900/10"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful API Features</h2>
              <p className="text-lg text-gray-300 mb-8">
                Our comprehensive API provides everything you need to integrate voice generation into any application.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Database,
                  title: "RESTful API",
                  description: "Simple, intuitive REST endpoints with comprehensive documentation and code examples"
                },
                {
                  icon: Cloud,
                  title: "Real-time Streaming",
                  description: "Stream audio in real-time for instant playback without waiting for full generation"
                },
                {
                  icon: Globe,
                  title: "Global CDN",
                  description: "Fast audio delivery worldwide with our global content delivery network"
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Easy Integration</h2>
              <p className="text-lg text-gray-300">
                Get started with just a few lines of code. Our API is designed for simplicity and power.
              </p>
            </div>

            <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Quick Start Example</h3>
                <span className="text-sm text-gray-400">JavaScript</span>
              </div>
              <pre className="text-gray-300 text-sm overflow-x-auto">
{`const response = await fetch('https://api.salescentri.com/tts/v1/synthesize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello, this is a sample text to speech conversion.',
    voice: 'en-US-Neural-Jenny',
    format: 'mp3',
    speed: 1.0
  })
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();`}
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
              Ready to Integrate Voice Generation?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Start building with our Text to Speech API today. Comprehensive documentation, 
              SDKs, and support to get you up and running quickly.
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
