"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, DollarSign, Users, Calculator, ArrowRight } from "lucide-react";

interface PerformanceData {
  conversionRate: number;
  cac: number;
  revenuePerRep: number;
  industry: string;
}

interface BenchmarkComparison {
  metric: string;
  yourValue: number;
  industryAverage: number;
  top10Percent: number;
  salesCentriUsers: number;
  improvement: string;
  status: 'below' | 'average' | 'above' | 'excellent';
}

const COLORS = {
  yourValue: '#3b82f6',
  industryAverage: '#6b7280',
  top10Percent: '#10b981',
  salesCentriUsers: '#8b5cf6'
};

export const PerformanceCalculator = () => {
  const [data, setData] = useState<PerformanceData>({
    conversionRate: 15,
    cac: 2500,
    revenuePerRep: 45000,
    industry: 'all'
  });

  const [isCalculated, setIsCalculated] = useState(false);

  // Industry benchmark data (based on real industry data)
  const benchmarks = {
    conversionRate: { average: 13.2, top10: 28.7, salesCentri: 25.4 },
    cac: { average: 2840, top10: 1520, salesCentri: 1680 },
    revenuePerRep: { average: 42000, top10: 78000, salesCentri: 71000 }
  };

  // Industry-specific benchmarks
  const industryBenchmarks = {
    technology: {
      conversionRate: { average: 15.8, top10: 32.1, salesCentri: 28.9 },
      cac: { average: 3200, top10: 1800, salesCentri: 1950 },
      revenuePerRep: { average: 52000, top10: 95000, salesCentri: 85000 }
    },
    professional: {
      conversionRate: { average: 12.4, top10: 26.3, salesCentri: 23.8 },
      cac: { average: 2600, top10: 1400, salesCentri: 1550 },
      revenuePerRep: { average: 38000, top10: 72000, salesCentri: 65000 }
    },
    manufacturing: {
      conversionRate: { average: 11.8, top10: 24.9, salesCentri: 22.1 },
      cac: { average: 2400, top10: 1300, salesCentri: 1450 },
      revenuePerRep: { average: 35000, top10: 68000, salesCentri: 61000 }
    }
  };

  const getBenchmarks = () => {
    if (data.industry === 'all') return benchmarks;
    return industryBenchmarks[data.industry as keyof typeof industryBenchmarks] || benchmarks;
  };

  const calculateComparison = (): BenchmarkComparison[] => {
    const currentBenchmarks = getBenchmarks();
    
    return [
      {
        metric: 'Conversion Rate (%)',
        yourValue: data.conversionRate,
        industryAverage: currentBenchmarks.conversionRate.average,
        top10Percent: currentBenchmarks.conversionRate.top10,
        salesCentriUsers: currentBenchmarks.conversionRate.salesCentri,
        improvement: `${((data.conversionRate - currentBenchmarks.conversionRate.average) / currentBenchmarks.conversionRate.average * 100).toFixed(1)}%`,
        status: data.conversionRate >= currentBenchmarks.conversionRate.salesCentri ? 'excellent' : 
                data.conversionRate >= currentBenchmarks.conversionRate.average ? 'above' : 'below'
      },
      {
        metric: 'Customer Acquisition Cost ($)',
        yourValue: data.cac,
        industryAverage: currentBenchmarks.cac.average,
        top10Percent: currentBenchmarks.cac.top10,
        salesCentriUsers: currentBenchmarks.cac.salesCentri,
        improvement: `${((currentBenchmarks.cac.average - data.cac) / currentBenchmarks.cac.average * 100).toFixed(1)}%`,
        status: data.cac <= currentBenchmarks.cac.salesCentri ? 'excellent' : 
                data.cac <= currentBenchmarks.cac.average ? 'above' : 'below'
      },
      {
        metric: 'Revenue per Rep ($)',
        yourValue: data.revenuePerRep,
        industryAverage: currentBenchmarks.revenuePerRep.average,
        top10Percent: currentBenchmarks.revenuePerRep.top10,
        salesCentriUsers: currentBenchmarks.revenuePerRep.salesCentri,
        improvement: `${((data.revenuePerRep - currentBenchmarks.revenuePerRep.average) / currentBenchmarks.revenuePerRep.average * 100).toFixed(1)}%`,
        status: data.revenuePerRep >= currentBenchmarks.revenuePerRep.salesCentri ? 'excellent' : 
                data.revenuePerRep >= currentBenchmarks.revenuePerRep.average ? 'above' : 'below'
      }
    ];
  };

  const handleCalculate = () => {
    setIsCalculated(true);
  };

  const handleReset = () => {
    setIsCalculated(false);
    setData({
      conversionRate: 15,
      cac: 2500,
      revenuePerRep: 45000,
      industry: 'all'
    });
  };

  const comparisonData = calculateComparison();

  // Data for bar chart
  const chartData = comparisonData.map(item => ({
    metric: item.metric.split(' ')[0], // Shortened metric name
    yourValue: item.yourValue,
    industryAverage: item.industryAverage,
    top10Percent: item.top10Percent,
    salesCentriUsers: item.salesCentriUsers
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400';
      case 'above': return 'text-blue-400';
      case 'average': return 'text-yellow-400';
      case 'below': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return '🚀';
      case 'above': return '📈';
      case 'average': return '📊';
      case 'below': return '📉';
      default: return '❓';
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
        {/* Header */}
        <section className="pt-32 pb-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Performance <span className="text-blue-400">Calculator</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
                Input your current metrics to see how you compare to industry benchmarks and identify improvement opportunities
              </p>
            </motion.div>
          </div>
        </section>

        {/* Calculator Form */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Calculator className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Enter Your Metrics</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Industry
                  </label>
                  <select
                    value={data.industry}
                    onChange={(e) => setData({...data, industry: e.target.value})}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    aria-label="Select industry"
                  >
                    <option value="all">All Industries</option>
                    <option value="technology">Technology & Software</option>
                    <option value="professional">Professional Services</option>
                    <option value="manufacturing">Manufacturing</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Conversion Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.conversionRate}
                      onChange={(e) => setData({...data, conversionRate: Number(e.target.value)})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Enter conversion rate"
                    />
                    <Target className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Customer Acquisition Cost ($)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.cac}
                      onChange={(e) => setData({...data, cac: Number(e.target.value)})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Enter CAC"
                    />
                    <DollarSign className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Revenue per Rep ($)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={data.revenuePerRep}
                      onChange={(e) => setData({...data, revenuePerRep: Number(e.target.value)})}
                      className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                      placeholder="Enter revenue per rep"
                    />
                    <Users className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleCalculate}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  Compare Performance
                  <ArrowRight className="w-4 h-4" />
                </button>
                {isCalculated && (
                  <button
                    onClick={handleReset}
                    className="border border-gray-600 text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-800/50 transition-all duration-300"
                  >
                    Reset
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        {isCalculated && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="py-8 px-4"
          >
            <div className="max-w-6xl mx-auto">
              {/* Performance Overview Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {comparisonData.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white">{item.metric}</h3>
                      <span className="text-2xl">{getStatusIcon(item.status)}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Your Value:</span>
                        <span className="text-white font-semibold">
                          {item.metric.includes('$') ? `$${item.yourValue.toLocaleString()}` : `${item.yourValue}%`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Industry Avg:</span>
                        <span className="text-gray-300">
                          {item.metric.includes('$') ? `$${item.industryAverage.toLocaleString()}` : `${item.industryAverage}%`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Top 10%:</span>
                        <span className="text-green-400">
                          {item.metric.includes('$') ? `$${item.top10Percent.toLocaleString()}` : `${item.top10Percent}%`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Sales Centri:</span>
                        <span className="text-blue-400">
                          {item.metric.includes('$') ? `$${item.salesCentriUsers.toLocaleString()}` : `${item.salesCentriUsers}%`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Improvement:</span>
                        <span className={`font-semibold ${getStatusColor(item.status)}`}>
                          {item.improvement}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-12"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Performance Comparison Chart</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="metric" 
                        stroke="#9ca3af"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        fontSize={12}
                        tickFormatter={(value) => value.toLocaleString()}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        formatter={(value, name) => [
                          typeof value === 'number' ? value.toLocaleString() : value,
                          name === 'yourValue' ? 'Your Value' :
                          name === 'industryAverage' ? 'Industry Average' :
                          name === 'top10Percent' ? 'Top 10%' :
                          name === 'salesCentriUsers' ? 'Sales Centri Users' : name
                        ]}
                      />
                      <Bar dataKey="yourValue" fill={COLORS.yourValue} name="yourValue" />
                      <Bar dataKey="industryAverage" fill={COLORS.industryAverage} name="industryAverage" />
                      <Bar dataKey="top10Percent" fill={COLORS.top10Percent} name="top10Percent" />
                      <Bar dataKey="salesCentriUsers" fill={COLORS.salesCentriUsers} name="salesCentriUsers" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Performance Recommendations</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">Areas for Improvement</h4>
                    <ul className="space-y-2 text-gray-300">
                      {comparisonData.filter(item => item.status === 'below' || item.status === 'average').map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-red-400">•</span>
                          Focus on improving {item.metric.toLowerCase()} to reach industry standards
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-400 mb-3">Strengths</h4>
                    <ul className="space-y-2 text-gray-300">
                      {comparisonData.filter(item => item.status === 'above' || item.status === 'excellent').map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-green-400">•</span>
                          {item.metric} is performing well above industry average
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};
