'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Target, Database, Zap, CheckCircle, ArrowRight, Crown, Briefcase, Phone, Mail } from 'lucide-react';

export default function AIHunterPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/contact-intelligence/ai-hunter';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Integrations', href: `${basePath}/integrations`, active: pathname === `${basePath}/integrations` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const features = [
    'Custom contact discovery volume',
    'Advanced AI algorithms & targeting',
    'Multi-source data integration (500+ sources)',
    'Real-time contact validation',
    'Bulk processing capabilities',
    'CRM & email platform integrations',
    'API access & webhook support',
    'Data quality assurance',
    'GDPR compliance & security',
    'Priority customer support',
    'Custom reporting & analytics',
    'Dedicated account management'
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
              AI Hunter Pricing
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Custom pricing tailored to your business needs and contact discovery requirements
            </p>
          </div>
        </div>
      </section>

      {/* Custom Pricing Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-900/20 via-gray-900/50 to-purple-900/20 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                <Crown className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Enterprise Custom Pricing
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                AI Hunter pricing is customized based on your specific needs, contact volume requirements, 
                integration complexity, and usage patterns. Our team will work with you to create a 
                solution that fits your budget and delivers maximum ROI.
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
                    <Target className="h-5 w-5 text-purple-400 mr-2" />
                    Pricing Factors
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="font-semibold text-blue-400 mb-1">Contact Volume</div>
                      <div className="text-sm text-gray-400">Monthly contact discovery and validation limits</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="font-semibold text-purple-400 mb-1">Feature Set</div>
                      <div className="text-sm text-gray-400">Advanced AI features and integration requirements</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="font-semibold text-blue-400 mb-1">Support Level</div>
                      <div className="text-sm text-gray-400">Dedicated support and account management</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                      <div className="font-semibold text-cyan-400 mb-1">Implementation</div>
                      <div className="text-sm text-gray-400">Custom setup, training, and integration support</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6 mb-8 border border-gray-800">
                <h3 className="text-lg font-semibold mb-3 text-white">Get Your Custom Quote</h3>
                <p className="text-gray-400 mb-4 text-sm">
                  Schedule a consultation with our team to discuss your requirements and receive a personalized pricing proposal.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-center p-3 bg-black/50 rounded-lg border border-gray-800">
                    <Phone className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="text-sm text-gray-300">+1 415-754-4766</span>
                  </div>
                  <div className="flex items-center justify-center p-3 bg-black/50 rounded-lg border border-gray-800">
                    <Mail className="h-4 w-4 text-purple-400 mr-2" />
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
              Why Choose AI Hunter?
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Invest in a platform that delivers measurable results and ROI for your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Target className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">95% Accuracy Rate</h3>
              <p className="text-gray-400 text-sm">
                Industry-leading contact validation accuracy ensures your sales team focuses on real prospects
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">10x Faster Discovery</h3>
              <p className="text-gray-400 text-sm">
                AI-powered algorithms find qualified prospects 10x faster than manual research methods
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Database className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">500+ Data Sources</h3>
              <p className="text-gray-400 text-sm">
                Access the most comprehensive contact database with over 500 premium data sources
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started with AI Hunter?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Contact our team to discuss your needs and get a personalized pricing quote
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
