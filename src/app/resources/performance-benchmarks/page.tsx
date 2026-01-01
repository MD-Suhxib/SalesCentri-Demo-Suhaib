'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, TrendingUp, Target, Calculator, Download, Filter } from 'lucide-react';
import { generateBenchmarkPDF } from '@/app/lib/pdfGenerator';

export default function PerformanceBenchmarksPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const industries = [
    { id: 'all', name: 'All Industries' },
    { id: 'technology', name: 'Technology & Software' },
    { id: 'professional', name: 'Professional Services' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'financial', name: 'Financial Services' }
  ];

  const metricTypes = [
    { id: 'all', name: 'All Metrics' },
    { id: 'email', name: 'Email Performance' },
    { id: 'calling', name: 'Calling & Voice' },
    { id: 'conversion', name: 'Conversion Rates' },
    { id: 'roi', name: 'ROI & Revenue' }
  ];

  const benchmarkData = [
    {
      category: 'Email Performance',
      industry: 'technology',
      metrics: [
        { name: 'Open Rate', average: '24.2%', top10: '42.1%', salesCentri: '38.7%', improvement: '+59.8%' },
        { name: 'Click-Through Rate', average: '3.1%', top10: '7.8%', salesCentri: '6.9%', improvement: '+122.6%' },
        { name: 'Response Rate', average: '1.8%', top10: '4.2%', salesCentri: '3.8%', improvement: '+111.1%' },
        { name: 'Unsubscribe Rate', average: '0.8%', top10: '0.3%', salesCentri: '0.4%', improvement: '-50%' }
      ]
    },
    {
      category: 'Calling & Voice',
      industry: 'professional',
      metrics: [
        { name: 'Connect Rate', average: '18.5%', top10: '32.4%', salesCentri: '29.8%', improvement: '+61.1%' },
        { name: 'Conversation Rate', average: '12.3%', top10: '24.1%', salesCentri: '21.7%', improvement: '+76.4%' },
        { name: 'Appointment Set Rate', average: '4.2%', top10: '9.1%', salesCentri: '8.3%', improvement: '+97.6%' },
        { name: 'Call-to-Meeting Ratio', average: '2.8%', top10: '6.4%', salesCentri: '5.9%', improvement: '+110.7%' }
      ]
    },
    {
      category: 'Conversion Rates',
      industry: 'manufacturing',
      metrics: [
        { name: 'Lead-to-Opportunity', average: '13.2%', top10: '28.7%', salesCentri: '25.4%', improvement: '+92.4%' },
        { name: 'Opportunity-to-Win', average: '22.1%', top10: '38.9%', salesCentri: '35.2%', improvement: '+59.3%' },
        { name: 'MQL-to-SQL', average: '15.8%', top10: '31.2%', salesCentri: '28.1%', improvement: '+77.8%' },
        { name: 'Demo-to-Close', average: '18.4%', top10: '34.6%', salesCentri: '31.2%', improvement: '+69.6%' }
      ]
    },
    {
      category: 'ROI & Revenue',
      industry: 'all',
      metrics: [
        { name: 'Cost per Lead', average: '$127', top10: '$68', salesCentri: '$74', improvement: '-41.7%' },
        { name: 'Customer Acquisition Cost', average: '$2,840', top10: '$1,520', salesCentri: '$1,680', improvement: '-40.8%' },
        { name: 'Sales Cycle Length (days)', average: '89', top10: '52', salesCentri: '58', improvement: '-34.8%' },
        { name: 'Revenue per Rep (monthly)', average: '$42K', top10: '$78K', salesCentri: '$71K', improvement: '+69.0%' }
      ]
    }
  ];

  const companyBenchmarks = [
    {
      size: '1-50 employees',
      industry: 'Technology',
      metrics: {
        emailOpen: '26.8%',
        responseRate: '2.1%',
        leadConversion: '18.4%',
        salesCycle: '45 days',
        monthlyRevenue: '$28K'
      },
      improvement: {
        emailOpen: '+45%',
        responseRate: '+85%',
        leadConversion: '+65%',
        salesCycle: '-35%',
        monthlyRevenue: '+75%'
      }
    },
    {
      size: '51-200 employees',
      industry: 'Professional Services',
      metrics: {
        emailOpen: '23.4%',
        responseRate: '1.9%',
        leadConversion: '15.2%',
        salesCycle: '67 days',
        monthlyRevenue: '$52K'
      },
      improvement: {
        emailOpen: '+38%',
        responseRate: '+79%',
        leadConversion: '+58%',
        salesCycle: '-28%',
        monthlyRevenue: '+69%'
      }
    },
    {
      size: '201-1000 employees',
      industry: 'Manufacturing',
      metrics: {
        emailOpen: '21.7%',
        responseRate: '1.6%',
        leadConversion: '12.8%',
        salesCycle: '94 days',
        monthlyRevenue: '$89K'
      },
      improvement: {
        emailOpen: '+42%',
        responseRate: '+88%',
        leadConversion: '+72%',
        salesCycle: '-31%',
        monthlyRevenue: '+64%'
      }
    }
  ];

  const filteredBenchmarks = benchmarkData.filter(item => {
    const industryMatch = selectedIndustry === 'all' || item.industry === selectedIndustry || item.industry === 'all';
    const metricMatch = selectedMetric === 'all' || 
      (selectedMetric === 'email' && item.category === 'Email Performance') ||
      (selectedMetric === 'calling' && item.category === 'Calling & Voice') ||
      (selectedMetric === 'conversion' && item.category === 'Conversion Rates') ||
      (selectedMetric === 'roi' && item.category === 'ROI & Revenue');
    
    return industryMatch && metricMatch;
  });

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      await generateBenchmarkPDF(benchmarkData, companyBenchmarks);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You could add a toast notification here for better UX
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.1),transparent_50%)]" />
      </div>
      
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Sales Automation <span className="text-blue-400">Performance Benchmarks</span>
              <br />& Industry Data
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Understanding how your sales performance compares to industry standards is crucial for optimization and goal setting. 
              Our comprehensive benchmark database provides real performance data across industries, helping you identify 
              improvement opportunities and set realistic targets for your sales automation initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Filter Benchmarks</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Industry</label>
                <div className="grid grid-cols-2 gap-2">
                  {industries.map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => setSelectedIndustry(industry.id)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                        selectedIndustry === industry.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {industry.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">Metric Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {metricTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedMetric(type.id)}
                      className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                        selectedMetric === type.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Performance Analytics */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              Industry Benchmark Data
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Compare your performance with industry averages, top 10% performers, and Sales Centri users
            </p>
          </motion.div>

          <div className="space-y-8">
            {filteredBenchmarks.map((benchmark, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6"
              >
                <h3 className="text-2xl font-bold text-white mb-6">{benchmark.category}</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-4 px-2 text-gray-300 font-semibold">Metric</th>
                        <th className="text-center py-4 px-2 text-gray-300 font-semibold">Industry Average</th>
                        <th className="text-center py-4 px-2 text-blue-400 font-semibold">Top 10%</th>
                        <th className="text-center py-4 px-2 text-blue-400 font-semibold">Sales Centri Users</th>
                        <th className="text-center py-4 px-2 text-blue-400 font-semibold">Improvement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmark.metrics.map((metric, metricIndex) => (
                        <tr key={metricIndex} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="py-4 px-2 text-white font-medium">{metric.name}</td>
                          <td className="py-4 px-2 text-center text-gray-300">{metric.average}</td>
                          <td className="py-4 px-2 text-center text-blue-400 font-semibold">{metric.top10}</td>
                          <td className="py-4 px-2 text-center text-blue-400 font-semibold">{metric.salesCentri}</td>
                          <td className="py-4 px-2 text-center text-blue-400 font-semibold">{metric.improvement}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Size Benchmarks */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              Performance by Company Size
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              See how automation performance varies by company size and industry
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-1 gap-6">
            {companyBenchmarks.map((company, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">{company.size}</h3>
                    <p className="text-gray-400">{company.industry}</p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                      Average +65% Improvement
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{company.metrics.emailOpen}</div>
                    <div className="text-sm text-gray-400 mb-2">Email Open Rate</div>
                    <div className="text-blue-400 font-semibold text-sm">{company.improvement.emailOpen}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{company.metrics.responseRate}</div>
                    <div className="text-sm text-gray-400 mb-2">Response Rate</div>
                    <div className="text-blue-400 font-semibold text-sm">{company.improvement.responseRate}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{company.metrics.leadConversion}</div>
                    <div className="text-sm text-gray-400 mb-2">Lead Conversion</div>
                    <div className="text-blue-400 font-semibold text-sm">{company.improvement.leadConversion}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{company.metrics.salesCycle}</div>
                    <div className="text-sm text-gray-400 mb-2">Sales Cycle</div>
                    <div className="text-blue-400 font-semibold text-sm">{company.improvement.salesCycle}</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{company.metrics.monthlyRevenue}</div>
                    <div className="text-sm text-gray-400 mb-2">Revenue/Rep</div>
                    <div className="text-blue-400 font-semibold text-sm">{company.improvement.monthlyRevenue}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Benchmark Tools */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <Calculator className="w-8 h-8 text-blue-400" />
              Interactive Benchmark Tools
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Use our tools to compare your performance and set realistic improvement goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Performance Calculator</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Input your current metrics to see how you compare to industry benchmarks and identify improvement opportunities
              </p>
              <Link href="/resources/performance-calculator" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Launch Calculator
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Download className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Download Full Report</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Get the complete benchmark report with detailed analysis, methodology, and actionable insights for your industry
              </p>
              <button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="border border-blue-500/30 text-blue-300 px-6 py-3 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 flex items-center gap-2 justify-center cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    Download Report
                    <Download className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Insights */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Key Performance Insights</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">67%</div>
                <div className="text-lg font-semibold text-white mb-2">Average Improvement</div>
                <div className="text-gray-300">across all automation metrics when using Sales Centri</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">90 days</div>
                <div className="text-lg font-semibold text-white mb-2">Time to Results</div>
                <div className="text-gray-300">typical timeframe to see significant performance improvements</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">3.2x</div>
                <div className="text-lg font-semibold text-white mb-2">ROI Multiplier</div>
                <div className="text-gray-300">average return on investment from automation implementation</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Compare Your Performance
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Access detailed benchmark data and start improving your sales automation performance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started/free-trial" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105 cursor-pointer">
                Access Benchmark Data
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/solutions/psa-suite-one-stop-solution" className="border border-blue-500/30 text-blue-300 px-8 py-4 rounded-xl font-semibold hover:bg-blue-500/10 transition-all duration-300 cursor-pointer">
                View Performance Tools
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  );
}
