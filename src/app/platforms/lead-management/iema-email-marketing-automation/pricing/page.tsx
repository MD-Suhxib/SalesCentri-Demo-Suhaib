'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, ArrowRight, Users, Briefcase, Phone } from 'lucide-react';

export default function IEMAPricingPage() {
  const pathname = usePathname();
  const basePath = '/platforms/lead-management/iema-email-marketing-automation';

  const subNavItems = [
    { name: 'Overview', href: basePath, active: pathname === basePath },
    { name: 'Features', href: `${basePath}/features`, active: pathname === `${basePath}/features` },
    { name: 'Pricing', href: `${basePath}/pricing`, active: pathname === `${basePath}/pricing` },
  ];

  const features = [
    'Custom email volume limits',
    'Advanced AI personalization',
    'Multi-channel automation workflows',
    'Behavioral trigger campaigns',
    'A/B testing and optimization',
    'Advanced deliverability management',
    'Real-time analytics and reporting',
    'CRM and marketing tool integrations',
    'API access and custom development',
    'Priority customer support',
    'Custom implementation and training',
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
                      ? 'text-purple-400 border-b-2 border-purple-400'
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
              iEMA Custom Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Get a personalized quote for iEMA based on your email volume, automation needs, and integration requirements. 
              Our pricing scales with your business growth.
            </p>
          </div>
        </motion.section>

        {/* Custom Pricing Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="py-20 px-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700/50 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <Mail className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold mb-6 text-white">Enterprise Email Automation</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                iEMA pricing is customized based on your specific needs including email volume, automation complexity, 
                integrations, and support requirements. Contact our team for a personalized quote.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-white">Pricing Factors Include:</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Monthly email volume</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Number of contacts</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Automation complexity</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Integration requirements</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-white">What&apos;s Included:</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Full platform access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Implementation support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Training and onboarding</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">Ongoing optimization</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/get-started/contact-form"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
                >
                  <span>Get Custom Quote</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/get-started/book-demo"
                  className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Book Demo Call
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features Included */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="py-20 bg-gray-900/50"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Everything You Need for Success</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Every iEMA plan includes our complete feature set designed to maximize your email marketing ROI.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * index }}
                  className="flex items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700/30"
                >
                  <CheckCircle className="w-6 h-6 text-green-400 mr-4 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="py-20"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-12 text-center border border-gray-700/30">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Contact our team to discuss your email marketing automation needs and receive a customized quote 
                tailored to your business requirements.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="flex flex-col items-center">
                  <Users className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Expert Consultation</h3>
                  <p className="text-gray-300 text-sm">Free strategy session with our automation experts</p>
                </div>
                <div className="flex flex-col items-center">
                  <Briefcase className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Custom Implementation</h3>
                  <p className="text-gray-300 text-sm">Tailored setup and integration with your existing tools</p>
                </div>
                <div className="flex flex-col items-center">
                  <Phone className="w-12 h-12 text-purple-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Ongoing Support</h3>
                  <p className="text-gray-300 text-sm">Dedicated support team and success manager</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/solutions/psa-suite-one-stop-solution"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 group inline-flex items-center justify-center"
                >
                  <span>Request Quote</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/solutions/psa-suite-one-stop-solution"
                  className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300"
                >
                  Schedule Call
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
    </>
  );
}
