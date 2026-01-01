'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ArrowRight, 
  MessageSquare
} from 'lucide-react';

export default function TroubleshootingPage() {
  const commonIssues = [
    {
      issue: "Authentication failures",
      solution: "Check API key format and permissions",
      severity: "High",
      link: "/docs/troubleshooting/auth-errors"
    },
    {
      issue: "Data sync delays",
      solution: "Verify webhook configuration and rate limits",
      severity: "Medium", 
      link: "/docs/troubleshooting/sync-issues"
    },
    {
      issue: "Integration connection errors",
      solution: "Validate endpoint URLs and network connectivity",
      severity: "High",
      link: "/docs/troubleshooting/connection-errors"
    },
    {
      issue: "Data quality validation failures",
      solution: "Review field mapping and data formats",
      severity: "Low",
      link: "/docs/troubleshooting/data-quality"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1426] text-white">
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 mb-6">
              <AlertTriangle className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-300">Troubleshooting Guide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Troubleshooting
              </span>
              <br />
              <span className="text-white">& Support</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Find solutions to common integration issues and get expert help when you need it.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {commonIssues.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20"
              >
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mb-4 ${
                  item.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                  item.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {item.severity} Priority
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.issue}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.solution}</p>
                <Link href={item.link} className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <span className="text-sm">Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/get-started/contact" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 inline-flex items-center gap-2">
              Get Expert Help
              <MessageSquare className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
