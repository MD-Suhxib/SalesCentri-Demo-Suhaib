'use client';

import {Target, Database, Zap, CheckCircle, ArrowRight, Shield, Clock, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AIHunterFeaturesPage() {
  const pathname = usePathname();
  
  const subNavItems = [
    { name: 'Overview', href: '/platforms/contact-intelligence/ai-hunter', active: pathname === '/platforms/contact-intelligence/ai-hunter' },
    { name: 'Features', href: '/platforms/contact-intelligence/ai-hunter/features', active: pathname === '/platforms/contact-intelligence/ai-hunter/features' },
    { name: 'Integrations', href: '/platforms/contact-intelligence/ai-hunter/integrations', active: pathname === '/platforms/contact-intelligence/ai-hunter/integrations' },
    { name: 'Pricing', href: '/platforms/contact-intelligence/ai-hunter/pricing', active: pathname === '/platforms/contact-intelligence/ai-hunter/pricing' }
  ];

  const features = [
    {
      icon: Target,
      title: 'Advanced AI Algorithms',
      description: 'Machine learning models that continuously improve prospect identification accuracy based on your successful conversions.',
      benefits: ['95% accuracy rate', 'Self-learning algorithms', 'Predictive scoring', 'Behavioral analysis']
    },
    {
      icon: Clock,
      title: 'Real-time Validation',
      description: 'Instant contact verification ensuring you never waste time on invalid leads or bounced emails.',
      benefits: ['< 1 second validation', 'Email deliverability check', 'Phone number verification', 'Social profile validation']
    },
    {
      icon: Database,
      title: 'Multi-source Data Integration',
      description: 'Access to 500+ premium data sources providing comprehensive prospect information.',
      benefits: ['500+ data sources', 'Global coverage', 'Industry-specific databases', 'Regular data updates']
    },
    {
      icon: Zap,
      title: 'Smart Filtering & Segmentation',
      description: 'Intelligent filters that automatically categorize prospects based on your ideal customer profile.',
      benefits: ['Custom filtering rules', 'Automated segmentation', 'Priority scoring', 'Tag management']
    },
    {
      icon: BarChart3,
      title: 'Bulk Processing',
      description: 'Process thousands of prospects simultaneously with our high-performance infrastructure.',
      benefits: ['10K+ leads per hour', 'Batch processing', 'Queue management', 'Progress tracking']
    },
    {
      icon: Shield,
      title: 'Data Quality Assurance',
      description: 'Multi-layer validation ensures the highest quality data for your sales team.',
      benefits: ['Triple verification', 'Duplicate detection', 'Data enrichment', 'Quality scoring']
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-white to-purple-400 bg-clip-text text-transparent">
              AI Hunter Features
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Discover the powerful features that make AI Hunter the most advanced contact finding platform
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
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
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

      {/* Technical Specifications */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Built on enterprise-grade infrastructure with industry-leading performance metrics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-black/50 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-white font-semibold mb-1">Uptime</div>
              <div className="text-sm text-gray-400">Service availability</div>
            </div>
            <div className="text-center p-6 bg-black/50 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-purple-400 mb-2">&lt; 200ms</div>
              <div className="text-white font-semibold mb-1">Response Time</div>
              <div className="text-sm text-gray-400">Average API response</div>
            </div>
            <div className="text-center p-6 bg-black/50 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-green-400 mb-2">10M+</div>
              <div className="text-white font-semibold mb-1">Contacts/Day</div>
              <div className="text-sm text-gray-400">Processing capacity</div>
            </div>
            <div className="text-center p-6 bg-black/50 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-cyan-400 mb-2">256-bit</div>
              <div className="text-white font-semibold mb-1">Encryption</div>
              <div className="text-sm text-gray-400">Data security standard</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/20 via-black to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Experience AI Hunter&apos;s Advanced Features
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            See how our AI-powered features can transform your prospect discovery process
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 group">
              Start Free Trial
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}
