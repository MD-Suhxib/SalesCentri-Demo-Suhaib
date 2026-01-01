'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Database, BarChart3, CheckCircle, ArrowRight, Brain, Globe, Eye, Clock} from 'lucide-react';

export default function IntelliBaseFeaturesPage() {
  const pathname = usePathname();
  const basePath = '/platforms/contact-intelligence/intellibase';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const features = [
    {
      icon: Brain,
      title: 'Predictive Analytics',
      description: 'Advanced machine learning algorithms that analyze historical data and market patterns to predict future customer behavior and market trends.',
      benefits: ['92% prediction accuracy', 'Real-time forecasting', 'Trend identification', 'Risk assessment']
    },
    {
      icon: Eye,
      title: 'Behavioral Insights',
      description: 'Deep analysis of customer interactions, engagement patterns, and decision-making processes to understand buyer psychology.',
      benefits: ['Customer journey mapping', 'Engagement scoring', 'Behavioral triggers', 'Decision patterns']
    },
    {
      icon: Globe,
      title: 'Market Intelligence',
      description: 'Comprehensive market analysis including competitor insights, industry trends, and market opportunities.',
      benefits: ['Competitive analysis', 'Market sizing', 'Industry benchmarks', 'Opportunity identification']
    },
    {
      icon: BarChart3,
      title: 'Custom Reports & Analytics',
      description: 'Build custom reports and dashboards tailored to your specific business needs and KPIs.',
      benefits: ['100+ report templates', 'Custom dashboards', 'Automated reporting', 'Data visualization']
    },
    {
      icon: Clock,
      title: 'Real-time Dashboards',
      description: 'Live dashboards that provide instant access to critical business metrics and performance indicators.',
      benefits: ['Real-time updates', 'Interactive visualizations', 'Mobile responsive', 'Alert system']
    },
    {
      icon: Database,
      title: 'Data Integration Hub',
      description: 'Seamlessly integrate data from multiple sources to create a unified view of your business intelligence.',
      benefits: ['200+ data connectors', 'Automated data sync', 'Data cleansing', 'API access']
    }
  ];

  const analyticsCapabilities = [
    {
      title: 'Lead Scoring & Qualification',
      description: 'AI-powered lead scoring that identifies the highest quality prospects',
      metrics: '95% accuracy'
    },
    {
      title: 'Customer Lifetime Value',
      description: 'Predict and optimize customer lifetime value across segments',
      metrics: '3x ROI improvement'
    },
    {
      title: 'Churn Prediction',
      description: 'Identify at-risk customers before they leave',
      metrics: '87% prediction rate'
    },
    {
      title: 'Revenue Forecasting',
      description: 'Accurate revenue predictions based on pipeline and market data',
      metrics: '±5% accuracy'
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
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-white to-blue-400 bg-clip-text text-transparent">
              IntelliBase Features
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the advanced analytics and intelligence capabilities that power data-driven decisions
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-cyan-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Capabilities */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Advanced Analytics Capabilities
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Leverage AI-powered analytics to gain deeper insights into your business performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {analyticsCapabilities.map((capability, index) => (
              <div key={index} className="bg-black/50 border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{capability.title}</h3>
                  <span className="bg-cyan-500/20 text-cyan-400 text-sm px-3 py-1 rounded-full border border-cyan-500/30">
                    {capability.metrics}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Platform Specifications
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Built on enterprise-grade infrastructure with industry-leading performance
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-cyan-400 mb-2">99.9%</div>
              <div className="text-white font-semibold mb-1">Uptime</div>
              <div className="text-sm text-gray-400">Service availability</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-blue-400 mb-2">93M+</div>
              <div className="text-white font-semibold mb-1">Data Points</div>
              <div className="text-sm text-gray-400">Processed daily</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-purple-400 mb-2">&lt; 100ms</div>
              <div className="text-white font-semibold mb-1">Query Speed</div>
              <div className="text-sm text-gray-400">Average response time</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-green-400 mb-2">SOC 2</div>
              <div className="text-white font-semibold mb-1">Compliance</div>
              <div className="text-sm text-gray-400">Security standard</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-900/20 via-black to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Experience IntelliBase&apos;s Powerful Features
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Unlock the full potential of your data with advanced analytics and business intelligence
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 flex items-center justify-center gap-2 group">
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            {/* Demo button removed intentionally */}
          </div>
        </div>
      </section>
      
      </main>
    </>
  );
}
