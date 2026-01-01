// LLM Analytics Dashboard Component
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTracker } from '../hooks/useTracker';

interface LLMAnalytics {
  totalQueries: number;
  totalCost: number;
  averageResponseTime: number;
  accuracyByProvider: Record<string, number>;
  costByProvider: Record<string, number>;
  usageByTaskType: Record<string, number>;
  tokenUsage: {
    totalInput: number;
    totalOutput: number;
    totalTokens: number;
  };
  topModels: Array<{
    model: string;
    usage: number;
    cost: number;
    accuracy: number;
  }>;
  additionalMetrics: {
    totalProviders: number;
    totalModels: number;
    averageAccuracy: number;
    dataPoints: number;
    accuracyDataPoints: number;
  };
}

interface UsageHistory {
  provider: string;
  model: string;
  taskType: string;
  queryComplexity: string;
  cost: number;
  responseTime: number;
  timestamp: string;
  query: string;
}

export const LLMAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<LLMAnalytics | null>(null);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
    end: new Date().toISOString().split('T')[0] // today
  });
  const [selectedTab, setSelectedTab] = useState<'overview' | 'costs' | 'performance' | 'accuracy'>('overview');
  
  const { trackCustomEvent } = useTracker();

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (timeframe.start) params.append('start', timeframe.start);
      if (timeframe.end) params.append('end', timeframe.end);
      
      const response = await fetch(`/api/analytics/llm?${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const data = await response.json();
      setAnalytics(data);
      setUsageHistory(data.usageHistory || []);
      setError(null);
      
      // Track analytics view
      trackCustomEvent('llm_analytics_viewed', {
        timeframe: timeframe,
        totalQueries: data.totalQueries,
        totalCost: data.totalCost
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [timeframe, trackCustomEvent]); // Added dependencies

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]); // Only depend on fetchAnalytics since timeframe is already in its deps

  const formatCurrency = (amount: number) => `$${amount.toFixed(4)}`;
  const formatTime = (ms: number) => `${(ms / 1000).toFixed(2)}s`;
  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">Error loading analytics</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button 
          onClick={fetchAnalytics}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) {
    return <div>No analytics data available</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">LLM Analytics Dashboard</h1>
        <p className="text-gray-600">Track usage, costs, and performance across all LLM providers</p>
      </div>

      {/* Timeframe Selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <input
            type="date"
            value={timeframe.start}
            onChange={(e) => setTimeframe(prev => ({ ...prev, start: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            aria-label="Start date"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={timeframe.end}
            onChange={(e) => setTimeframe(prev => ({ ...prev, end: e.target.value }))}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
            aria-label="End date"
          />
          <button
            onClick={fetchAnalytics}
            className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'costs', label: 'Costs' },
            { id: 'performance', label: 'Performance' },
            { id: 'accuracy', label: 'Accuracy' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as 'overview' | 'costs' | 'performance' | 'accuracy')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Queries</h3>
            <p className="text-3xl font-bold text-gray-900">{analytics.totalQueries}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(analytics.totalCost)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg Response Time</h3>
            <p className="text-3xl font-bold text-gray-900">{formatTime(analytics.averageResponseTime)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500">Avg Accuracy</h3>
            <p className="text-3xl font-bold text-gray-900">{formatPercentage(analytics.additionalMetrics.averageAccuracy)}</p>
          </div>
        </div>
      )}

      {/* Costs Tab */}
      {selectedTab === 'costs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cost by Provider</h3>
            <div className="space-y-3">
              {Object.entries(analytics.costByProvider).map(([provider, cost]) => (
                <div key={provider} className="flex justify-between items-center">
                  <span className="font-medium capitalize">{provider}</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(cost)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Models by Cost</h3>
            <div className="space-y-3">
              {analytics.topModels.slice(0, 5).map((model) => (
                <div key={model.model} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{model.model}</span>
                    <span className="text-sm text-gray-500 ml-2">({model.usage} queries)</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(model.cost)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {selectedTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Usage by Task Type</h3>
            <div className="space-y-3">
              {Object.entries(analytics.usageByTaskType).map(([taskType, count]) => (
                <div key={taskType} className="flex justify-between items-center">
                  <span className="font-medium capitalize">{taskType.replace('-', ' ')}</span>
                  <span className="text-lg font-bold text-blue-600">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Token Usage</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics.tokenUsage.totalInput.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Input Tokens</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics.tokenUsage.totalOutput.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Output Tokens</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{analytics.tokenUsage.totalTokens.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Tokens</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accuracy Tab */}
      {selectedTab === 'accuracy' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Accuracy by Provider</h3>
            <div className="space-y-3">
              {Object.entries(analytics.accuracyByProvider).map(([provider, accuracy]) => (
                <div key={provider} className="flex justify-between items-center">
                  <span className="font-medium capitalize">{provider}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${accuracy * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-green-600">{formatPercentage(accuracy)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Usage History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {usageHistory.slice(0, 10).map((usage, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(usage.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {usage.provider}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {usage.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {usage.taskType.replace('-', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(usage.cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(usage.responseTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LLMAnalyticsDashboard;
