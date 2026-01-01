'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, BarChart3, ArrowRight, Settings, Cloud, Workflow, Monitor } from 'lucide-react';

export default function IntelliBaseIntegrationsPage() {
  const pathname = usePathname();
  const basePath = '/platforms/contact-intelligence/intellibase';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const integrationCategories = [
    {
      title: 'Business Intelligence Platforms',
      description: 'Connect with leading BI platforms for enhanced analytics',
      integrations: [
        { name: 'Tableau', description: 'Advanced data visualization and reporting', popular: true },
        { name: 'Power BI', description: 'Microsoft&apos;s business analytics solution', popular: true },
        { name: 'Looker', description: 'Modern business intelligence platform', popular: false },
        { name: 'QlikSense', description: 'Associative analytics platform', popular: false },
        { name: 'Sisense', description: 'AI-driven analytics platform', popular: false },
        { name: 'Domo', description: 'Cloud-based business intelligence', popular: false }
      ]
    },
    {
      title: 'CRM & Sales Platforms',
      description: 'Enhance your CRM with intelligent insights and predictions',
      integrations: [
        { name: 'Salesforce', description: 'Complete CRM integration with Einstein Analytics', popular: true },
        { name: 'HubSpot', description: 'Marketing and sales automation platform', popular: true },
        { name: 'Pipedrive', description: 'Sales-focused CRM with visual pipelines', popular: false },
        { name: 'Zoho CRM', description: 'Comprehensive business software suite', popular: false },
        { name: 'Microsoft Dynamics', description: 'Enterprise CRM and ERP solution', popular: true },
        { name: 'SugarCRM', description: 'Open-source CRM platform', popular: false }
      ]
    },
    {
      title: 'Marketing Automation',
      description: 'Supercharge your marketing campaigns with intelligence data',
      integrations: [
        { name: 'Marketo', description: 'Adobe&apos;s marketing automation platform', popular: true },
        { name: 'Pardot', description: 'Salesforce B2B marketing automation', popular: true },
        { name: 'Eloqua', description: 'Oracle&apos;s marketing automation solution', popular: false },
        { name: 'ActiveCampaign', description: 'Customer experience automation', popular: false },
        { name: 'Mailchimp', description: 'Email marketing and automation', popular: true },
        { name: 'Campaign Monitor', description: 'Email marketing platform', popular: false }
      ]
    },
    {
      title: 'Data Sources & Warehouses',
      description: 'Connect to your existing data infrastructure',
      integrations: [
        { name: 'Snowflake', description: 'Cloud data warehouse platform', popular: true },
        { name: 'Amazon Redshift', description: 'AWS data warehouse solution', popular: true },
        { name: 'Google BigQuery', description: 'Serverless data warehouse', popular: true },
        { name: 'Azure Synapse', description: 'Microsoft analytics service', popular: false },
        { name: 'Databricks', description: 'Unified analytics platform', popular: false },
        { name: 'PostgreSQL', description: 'Open-source relational database', popular: false }
      ]
    }
  ];

  const apiFeatures = [
    {
      icon: Cloud,
      title: 'RESTful API',
      description: 'Comprehensive REST API with detailed documentation and SDKs for popular programming languages.'
    },
    {
      icon: Workflow,
      title: 'Real-time Webhooks',
      description: 'Instant notifications for data updates, predictions, and threshold alerts.'
    },
    {
      icon: Settings,
      title: 'Custom Analytics',
      description: 'Build custom analytics solutions using our flexible API and data models.'
    },
    {
      icon: Monitor,
      title: 'Performance Monitoring',
      description: 'Monitor integration performance and data flow with comprehensive analytics.'
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
              IntelliBase Integrations
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Seamlessly connect IntelliBase with your existing business intelligence and data infrastructure
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
              Build custom integrations and extend IntelliBase&apos;s capabilities with our robust API
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
              Explore API Documentation
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Integration Benefits
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Maximize the value of your existing tools and data with seamless integrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Database className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Unified Data View</h3>
              <p className="text-gray-400 text-sm">
                Consolidate data from multiple sources into a single, comprehensive intelligence platform.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Workflow className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Automated Workflows</h3>
              <p className="text-gray-400 text-sm">
                Streamline your processes with automated data sync and intelligent workflow triggers.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Enhanced Analytics</h3>
              <p className="text-gray-400 text-sm">
                Enrich your existing analytics with predictive insights and advanced intelligence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Stats */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">150+</div>
              <div className="text-gray-400">Available Integrations</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">99.8%</div>
              <div className="text-gray-400">Integration Reliability</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">&lt; 2min</div>
              <div className="text-gray-400">Average Setup Time</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-400">Integration Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Integrate IntelliBase?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Connect your existing tools and unlock the full potential of your business intelligence
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
