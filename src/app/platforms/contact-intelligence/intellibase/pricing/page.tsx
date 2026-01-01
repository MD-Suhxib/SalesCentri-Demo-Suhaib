'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target, Database, BarChart3, CheckCircle, ArrowRight, Crown, Briefcase, Phone, Mail } from 'lucide-react';

export default function IntelliBasePricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/contact-intelligence/intellibase';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const features = [
    'Custom data volume & analytics capacity',
    'Advanced predictive analytics & ML models',
    'Real-time behavioral insights',
    'Comprehensive market intelligence',
    'Custom reports & dashboards (100+ templates)',
    'Real-time data visualization',
    'Multi-platform integrations (150+ connectors)',
    'API access & webhook support',
    'Advanced data security & compliance',
    'Priority customer support',
    'Dedicated account management',
    'Custom implementation & training'
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
              IntelliBase Pricing
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Enterprise-grade business intelligence pricing tailored to your data and analytics needs
            </p>
          </div>
        </div>
      </section>

      {/* Custom Pricing Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-900/20 via-gray-900/50 to-blue-900/20 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6">
                <Crown className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Enterprise Custom Pricing
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                IntelliBase pricing is customized based on your data volume, analytics requirements, 
                integration complexity, and user count. Our team creates a solution that maximizes 
                your ROI while fitting your budget and business objectives.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <Briefcase className="h-5 w-5 text-blue-400 mr-2" />
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <CheckCircle className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-left">
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                    <Target className="h-5 w-5 text-blue-400 mr-2" />
                    Pricing Factors
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="font-semibold text-blue-400 mb-1">Data Volume</div>
                      <div className="text-sm text-gray-400">Monthly data points processed and stored</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="font-semibold text-blue-400 mb-1">Analytics Complexity</div>
                      <div className="text-sm text-gray-400">ML models, predictive analytics, and custom reports</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="font-semibold text-blue-400 mb-1">User Count</div>
                      <div className="text-sm text-gray-400">Number of users and access levels required</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="font-semibold text-blue-400 mb-1">Integration Scope</div>
                      <div className="text-sm text-gray-400">Number and complexity of platform integrations</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 mb-8 border border-gray-800">
                <h3 className="text-lg font-semibold mb-3 text-white">Get Your Custom Quote</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Schedule a consultation with our business intelligence experts to discuss your requirements and receive a tailored pricing proposal.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center p-3 bg-black/50 rounded-lg border border-gray-800">
                    <Phone className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="text-sm text-gray-300">+1 415-754-4766</span>
                  </div>
                  <div className="flex items-center justify-center p-3 bg-black/50 rounded-lg border border-gray-800">
                    <Mail className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="text-sm text-gray-300">info@salescentri.com</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group">
                  Request Custom Quote
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose IntelliBase?
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Invest in a platform that transforms your data into actionable business intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">92% Prediction Accuracy</h3>
              <p className="text-gray-400 text-sm">
                Industry-leading AI algorithms deliver highly accurate predictions and insights for better decision-making
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Database className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">50M+ Data Points</h3>
              <p className="text-gray-400 text-sm">
                Process and analyze massive datasets to uncover hidden patterns and business opportunities
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">3x ROI Improvement</h3>
              <p className="text-gray-400 text-sm">
                Customers typically see 3x improvement in ROI through data-driven decision making and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Transform Your Business Intelligence?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Contact our team to discuss your analytics needs and get a personalized IntelliBase pricing quote
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group">
              Get Custom Pricing
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300">
              Book Demo Call
            </button>
          </div>
        </div>
      </section>
      
      </main>
    </>
  );
}
