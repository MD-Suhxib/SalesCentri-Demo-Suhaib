// Analytics Page - View LLM Query History and Costs
'use client';

import React from 'react';
import LLMAnalyticsDashboard from '../components/LLMAnalyticsDashboard';
import { AppShell } from '../components/AppShell';

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Query Analytics & Cost Tracking
            </h1>
            <p className="text-gray-600 mb-4">
              Track your LLM usage, costs, and performance across all providers. 
              View detailed history of all your research queries and their associated costs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-blue-800 font-medium mb-1">🔍 Query History</h3>
                <p className="text-blue-600 text-sm">
                  View all your previous research queries with timestamps and costs
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-green-800 font-medium mb-1">💰 Cost Tracking</h3>
                <p className="text-green-600 text-sm">
                  Monitor spending across GPT-4O, Gemini, and Perplexity models
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-purple-800 font-medium mb-1">📊 Performance Metrics</h3>
                <p className="text-purple-600 text-sm">
                  Analyze response times, token usage, and model performance
                </p>
              </div>
            </div>
          </div>
          
          <LLMAnalyticsDashboard />
        </div>
      </div>
    </AppShell>
  );
}
