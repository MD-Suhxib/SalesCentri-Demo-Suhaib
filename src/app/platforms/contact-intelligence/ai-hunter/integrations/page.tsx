'use client';

import {  ArrowRight, Settings, Cloud, Workflow, Monitor } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AIHunterIntegrationsPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/ai-hunter', active: pathname === '/platforms/contact-intelligence/ai-hunter' },
    { name: 'Features', href: '/platforms/contact-intelligence/ai-hunter/features', active: pathname === '/platforms/contact-intelligence/ai-hunter/features' },
    { name: 'Integrations', href: '/platforms/contact-intelligence/ai-hunter/integrations', active: pathname === '/platforms/contact-intelligence/ai-hunter/integrations' },
    { name: 'Pricing', href: '/platforms/contact-intelligence/ai-hunter/pricing', active: pathname === '/platforms/contact-intelligence/ai-hunter/pricing' }
  ];

  const integrationCategories = [
    {
      title: 'CRM Systems',
      description: 'Seamlessly sync discovered contacts with your existing CRM',
      integrations: [
        { name: 'Salesforce', description: 'Direct integration with lead and contact objects', popular: true },
        { name: 'HubSpot', description: 'Automated contact creation and enrichment', popular: true },
        { name: 'Pipedrive', description: 'Streamlined lead import and management', popular: false },
        { name: 'Zoho CRM', description: 'Complete contact lifecycle management', popular: false },
        { name: 'Microsoft Dynamics', description: 'Enterprise-grade CRM integration', popular: false },
        { name: 'Copper', description: 'Google Workspace native CRM sync', popular: false }
      ]
    },
    {
      title: 'Email Marketing Platforms',
      description: 'Send discovered contacts directly to your email campaigns',
      integrations: [
        { name: 'Mailchimp', description: 'Automated list building and segmentation', popular: true },
        { name: 'Constant Contact', description: 'Direct contact import and campaign setup', popular: false },
        { name: 'Campaign Monitor', description: 'Advanced email marketing automation', popular: false },
        { name: 'ActiveCampaign', description: 'Marketing automation and CRM integration', popular: true },
        { name: 'ConvertKit', description: 'Creator-focused email marketing', popular: false },
        { name: 'Klaviyo', description: 'E-commerce email marketing platform', popular: false }
      ]
    },
    {
      title: 'Sales Automation Tools',
      description: 'Enhance your sales processes with automated workflows',
      integrations: [
        { name: 'Outreach', description: 'Sales engagement platform integration', popular: true },
        { name: 'SalesLoft', description: 'Complete sales development platform', popular: true },
        { name: 'Apollo', description: 'Sales intelligence and engagement', popular: false },
        { name: 'Mixmax', description: 'Email productivity and tracking', popular: false },
        { name: 'Yesware', description: 'Email tracking and templates', popular: false },
        { name: 'Reply.io', description: 'Multichannel sales automation', popular: false }
      ]
    },
    {
      title: 'Data & Analytics',
      description: 'Enhance data quality and gain deeper insights',
      integrations: [
        { name: 'Clearbit', description: 'Company and contact enrichment', popular: true },
        { name: 'ZoomInfo', description: 'B2B contact and company database', popular: true },
        { name: 'LinkedIn Sales Navigator', description: 'Professional network insights', popular: true },
        { name: 'Hunter.io', description: 'Email finding and verification', popular: false },
        { name: 'FullContact', description: 'Contact enrichment and insights', popular: false },
        { name: 'Pipl', description: 'People search and identity resolution', popular: false }
      ]
    }
  ];

  const apiFeatures = [
    {
      icon: Cloud,
      title: 'RESTful API',
      description: 'Complete REST API with comprehensive documentation and SDKs for major programming languages.'
    },
    {
      icon: Workflow,
      title: 'Webhook Support',
      description: 'Real-time notifications for contact discoveries, validations, and status updates.'
    },
    {
      icon: Settings,
      title: 'Custom Integrations',
      description: 'Build custom integrations with our flexible API and extensive documentation.'
    },
    {
      icon: Monitor,
      title: 'Real-time Monitoring',
      description: 'Monitor integration health and performance with detailed analytics and alerts.'
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

      {/* Hero Section */}
      <section className="relative pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
              AI Hunter Integrations
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect AI Hunter with your favorite tools and platforms for seamless workflow automation
            </p>
          </div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {integrationCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-white">{category.title}</h2>
                  <p className="text-lg text-gray-400 max-w-2xl mx-auto">{category.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.integrations.map((integration, integrationIndex) => (
                    <div key={integrationIndex} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {integration.name}
                        </h3>
                        {integration.popular && (
                          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/30">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                        {integration.description}
                      </p>
                      <div className="flex items-center text-sm text-blue-400 group-hover:text-blue-300">
                        <span>Learn more</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Features */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Developer-Friendly API
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Build custom integrations and automate your workflows with our comprehensive API
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {apiFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-black/50 rounded-xl border border-gray-800">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-500/20 p-3 rounded-xl">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 inline-flex items-center gap-2">
              View API Documentation
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Integration Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">200+</div>
              <div className="text-gray-400">Available Integrations</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-400">Integration Uptime</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">&lt; 5min</div>
              <div className="text-gray-400">Setup Time</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-400">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Integrate AI Hunter?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Connect AI Hunter with your existing tools and start automating your prospect discovery today
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group">
              Start Integration
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </section>
      
      </main>
    </>
  );
}
