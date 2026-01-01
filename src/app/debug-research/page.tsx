// Debug page for research bot issues
'use client';

import React, { useState } from 'react';

export default function DebugResearchPage() {
  const [query, setQuery] = useState('What are the latest trends in AI?');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    sources: Array<{ url: string; title: string; content: string }>;
    metadata?: Record<string, unknown>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testResearchBot = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);

    try {
      addLog('Starting research bot test...');
      
      // First check environment status
      addLog('Checking environment variables...');
      const envResponse = await fetch('/api/debug/env-check');
      if (envResponse.ok) {
        const envData = await envResponse.json();
        addLog(`Environment check: ${JSON.stringify(envData)}`);
      }
      
      const response = await fetch('/api/multi-research-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          category: 'market_analysis',
          depth: 'basic',
          timeframe: '1Y',
          geographic_scope: 'Global',
          data_sources: []
        }),
      });

      addLog(`Response status: ${response.status}`);
      addLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`Error response: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      addLog(`Response data keys: ${Object.keys(data).join(', ')}`);
      addLog(`Response data: ${JSON.stringify(data, null, 2)}`);

      setResult(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const testEnhancedGPT4o = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);

    try {
      addLog('Testing enhanced GPT-4o directly...');
      
      const response = await fetch('/api/gpt/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          useLangchain: true,
          researchType: 'research'
        }),
      });

      addLog(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        addLog(`Error response: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      addLog(`Response data: ${JSON.stringify(data, null, 2)}`);

      setResult(data);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      addLog(`Error: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Research Bot Debug Page</h1>
      
      <div className="space-y-6">
        {/* Query Input */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Query
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your research query..."
          />
        </div>

        {/* Test Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={testResearchBot}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Research Bot API'}
          </button>
          
          <button
            onClick={testEnhancedGPT4o}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Enhanced GPT-4o'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Logs */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Debug Logs</h3>
          <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Click a test button to start.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-900 mb-2">API Response</h3>
            <div className="bg-gray-50 p-3 rounded max-h-96 overflow-y-auto">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
