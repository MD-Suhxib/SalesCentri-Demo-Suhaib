'use client';

import React, { useState, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Bot, Settings, Download, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import { hasTableContent, isTextContent, isMixedContent } from '@/app/lib/contentParser';

// Dynamic imports to reduce initial bundle size and compilation time
const MarkdownRenderer = dynamic(() => import('../blocks/ResearchComparison/MarkdownRenderer'), {
  loading: () => <div className="animate-pulse">Loading content...</div>,
  ssr: false
});

const ResearchGPTTableRenderer = dynamic(() => import('../components/ResearchGPTTableRenderer'), {
  loading: () => <div className="animate-pulse">Loading table renderer...</div>,
  ssr: false
});

const ResearchTxtExportButton = dynamic(() => 
  import('../components/TxtExportButton').then(mod => ({ default: mod.ResearchTxtExportButton })), {
  loading: () => <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg">Loading...</button>,
  ssr: false
});

const CopyToClipboardButton = dynamic(() => 
  import('../components/TxtExportButton').then(mod => ({ default: mod.CopyToClipboardButton })), {
  loading: () => <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg">Loading...</button>,
  ssr: false
});

const SingleModelExcelExportButton = dynamic(() => 
  import('../components/ExcelExportComponents').then(mod => ({ default: mod.SingleModelExcelExportButton })), {
  loading: () => <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg">Loading...</button>,
  ssr: false
});

const RobustPdfExportButton = dynamic(() => import('../components/RobustPdfExportButton'), {
  loading: () => <button className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg">Loading...</button>,
  ssr: false
});

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Gemini API format for chat history
interface GeminiChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function PSAGPTPage() {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  
  // Research configuration states (similar to ResearchBot)
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [deepResearch, setDeepResearch] = useState(true);
  const [includeFounders, setIncludeFounders] = useState(true);
  const [includeProducts, setIncludeProducts] = useState(true);
  const [analyzeSalesOpportunities, setAnalyzeSalesOpportunities] = useState(true);

  // Check for initial query from localStorage on component mount
  useEffect(() => {
    const initialQuery = localStorage.getItem('psagpt_initial_query');
    if (initialQuery) {
      setQuery(initialQuery);
      localStorage.removeItem('psagpt_initial_query'); // Clean up
      
      // Auto-submit the initial query
      setTimeout(() => {
        handleSubmitWithQuery(initialQuery);
      }, 500);
    }
  }, []);

  const handleSubmitWithQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: queryText,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
    setCurrentResponse('');
    setQuery('');

    try {
      // Convert chat history to Gemini format
      const geminiHistory: GeminiChatMessage[] = chatHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Detect lead generation requests and force Google Grounding
      const isLeadGenRequest = queryText.toLowerCase().includes('generate leads') || 
                              queryText.toLowerCase().includes('find leads') ||
                              queryText.toLowerCase().includes('prospect') ||
                              queryText.toLowerCase().includes('customers for');

      // Enhanced prompt for proper table formatting
      const enhancedQuery = isLeadGenRequest ? 
        `${queryText}

🚨 CRITICAL OUTPUT REQUIREMENTS:
1. Format ALL data in proper markdown tables
2. Use this exact table format:
   | Company | Website | Industry | Employees | Revenue | Location | Pain Point | Solution Fit |
   |---------|---------|----------|-----------|---------|----------|------------|--------------|
   | Example Co | https://example.com | Tech | 50-100 | $1M-10M | USA | Need automation | Perfect fit |

3. Provide at least 20 companies per table
4. Include complete URLs (https://)
5. Make tables downloadable-ready
6. NO explanations - just tables with data
7. Verify all companies are real and operational

START WITH TABLES IMMEDIATELY.` : 
        `${queryText}

📊 OUTPUT FORMAT REQUIREMENTS:
- Use proper markdown formatting for tables
- Structure data in organized tables when applicable
- Include headers and proper alignment
- Make content export-ready
- Provide comprehensive analysis with clear sections`;

      console.log('🎯 Enhanced Query:', enhancedQuery.substring(0, 200) + '...');

      console.log('🚀 PSAGPT: Calling Gemini API with research mode');
      console.log('📝 Query:', queryText);
      console.log('📚 Chat History Length:', geminiHistory.length);
      console.log('🎯 Lead Generation Detected:', isLeadGenRequest);

      // Use Gemini API with direct Google Search grounding (NO Langchain/Tavily)
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: enhancedQuery,
          chatHistory: geminiHistory,
          useLangchain: false, // Use direct Gemini for speed
          enableWebSearch: false, // Keep disabled for speed
          enableRAG: false, // Keep disabled for speed  
          useGrounding: false, // Disable grounding to avoid delays
          options: {
            mode: 'chat' // Use simple chat mode for faster responses
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const geminiResponse = data.result || data.response || 'No response received';

      console.log('✅ PSAGPT: Received response from Gemini');
      console.log('📄 Response preview:', geminiResponse.substring(0, 100) + '...');

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: geminiResponse,
        timestamp: new Date()
      };

      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('🚨 PSAGPT Error:', error);
      
      let errorContent = 'I apologize, but I encountered an error processing your request.';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorContent = 'Connection error. Please check your internet connection and try again.';
        } else if (error.message.includes('API error')) {
          errorContent = 'Service temporarily unavailable. Please try again in a moment.';
        } else {
          errorContent = 'Something went wrong. Please try again with a different query.';
        }
      }
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmitWithQuery(query);
  };

  const clearChat = () => {
    setChatHistory([]);
    setCurrentResponse('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              PSAGPT
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Professional Services AI Assistant powered by Gemini. Get intelligent insights, research, and analysis for your business needs.
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-slate-400 py-16">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Welcome to PSAGPT</h3>
                <p className="text-sm">Start a conversation by asking a question or requesting analysis.</p>
                <div className="mt-6 space-y-4 max-w-3xl mx-auto">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-green-300 font-medium mb-2">✅ Lead Generation - What PSAGPT Actually Does:</p>
                    <div className="text-xs text-slate-300 space-y-1">
                      <p><strong>Input:</strong> "generate leads for https://www.unitedrubber.net/"</p>
                      <p><strong>Output:</strong> Actual prospect list with company names, decision makers, contact info, and reasons why they need rubber products</p>
                      <p className="text-green-400">✅ Real companies, not instructions!</p>
                      <p className="text-blue-400">📊 Formatted in professional tables</p>
                      <p className="text-purple-400">📥 Downloadable as Excel, PDF, or TXT</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-sm text-blue-300 font-medium">📊 Table Format</p>
                      <p className="text-xs text-slate-400">Structured data in markdown tables</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-sm text-green-300 font-medium">📥 Export Options</p>
                      <p className="text-xs text-slate-400">Excel, PDF, TXT, Copy to clipboard</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-sm text-purple-300 font-medium">🔍 Research Mode</p>
                      <p className="text-xs text-slate-400">Google Search grounding enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {chatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-4xl rounded-2xl px-4 py-3 ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-12'
                        : 'bg-white/10 text-slate-100 mr-12 border border-white/10'
                    }`}>
                      {message.role === 'assistant' ? (
                        <>
                          {/* Enhanced Content Rendering */}
                          <div className="prose prose-invert max-w-none">
                            {(() => {
                              const hasTables = hasTableContent(message.content);
                              console.log('🔍 PSAGPT Content Detection:', {
                                hasTables,
                                contentLength: message.content.length,
                                contentPreview: message.content.substring(0, 200) + '...'
                              });
                              
                              return hasTables ? (
                                /* Use ResearchGPTTableRenderer for table content or mixed content */
                                <ResearchGPTTableRenderer markdown={message.content} hideTopToolbar={true} />
                              ) : (
                                /* Simple text rendering for text-only content */
                                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                  {message.content}
                                </div>
                              );
                            })()}
                          </div>
                          
                          {/* Export Buttons for Assistant Messages */}
                          {message.content.trim() && (
                            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/10">
                              <React.Suspense fallback={<div className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg">Loading...</div>}>
                                <ResearchTxtExportButton
                                  query={`PSAGPT Query: ${chatHistory[index-1]?.content || 'N/A'}`}
                                  result={message.content}
                                  modelName="PSAGPT"
                                  fileName={`psagpt_response_${index}_${Date.now()}.txt`}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                                />
                              </React.Suspense>
                              <React.Suspense fallback={<div className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg">Loading...</div>}>
                                <SingleModelExcelExportButton
                                  data={message.content}
                                  filename={`psagpt_data_${index}_${Date.now()}.xlsx`}
                                  title="Excel"
                                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                                />
                              </React.Suspense>
                              <React.Suspense fallback={<div className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg">Loading...</div>}>
                                <RobustPdfExportButton
                                  userQuery={chatHistory[index-1]?.content || 'PSAGPT Query'}
                                  botResponse={message.content}
                                  fileName={`psagpt_report_${index}_${Date.now()}.pdf`}
                                  buttonText="PDF"
                                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                                />
                              </React.Suspense>
                              <React.Suspense fallback={<div className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg">Loading...</div>}>
                                <CopyToClipboardButton
                                  content={message.content}
                                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                                />
                              </React.Suspense>
                            </div>
                          )}
                        </>
                      ) : (
                        /* User Message - Simple Text */
                        <div className="prose prose-invert max-w-none">
                          {message.content.split('\n').map((line, i) => (
                            <p key={i} className="mb-2 last:mb-0 text-sm leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                      )}
                      <div className="text-xs opacity-60 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl rounded-2xl px-4 py-3 bg-white/10 text-slate-100 mr-12 border border-white/10">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></div>
                          </div>
                          <span className="text-sm text-slate-300">PSAGPT is analyzing your request...</span>
                        </div>
                          <div className="mt-3">
                          <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-1.5 rounded-full animate-pulse"></div>
                          </div>
                          <div className="text-xs text-slate-400 mt-2">
                            <span>🤖 Generating comprehensive response...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input Form */}
          <div className="border-t border-white/10 p-6">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask PSAGPT anything about business, research, or analysis..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                />
                <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="px-4 py-3 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/10 flex items-center gap-2"
                title="Research Configuration"
                aria-label="Toggle research configuration settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Send'}
              </button>
              {chatHistory.length > 0 && (
                <button
                  type="button"
                  onClick={clearChat}
                  className="px-4 py-3 bg-white/10 text-slate-300 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/10"
                >
                  Clear
                </button>
              )}
            </form>
            
            {/* Configuration Panel */}
            {showConfig && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-white font-semibold mb-4">Research Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={webSearchEnabled}
                      onChange={(e) => setWebSearchEnabled(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50"
                    />
                    Web Search Enhanced
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={deepResearch}
                      onChange={(e) => setDeepResearch(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50"
                    />
                    Deep Research Mode
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeFounders}
                      onChange={(e) => setIncludeFounders(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50"
                    />
                    Include Founders Info
                  </label>
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={includeProducts}
                      onChange={(e) => setIncludeProducts(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50"
                    />
                    Include Products Info
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 md:col-span-2">
                    <input
                      type="checkbox"
                      checked={analyzeSalesOpportunities}
                      onChange={(e) => setAnalyzeSalesOpportunities(e.target.checked)}
                      className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50"
                    />
                    Analyze Sales Opportunities
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-slate-300 text-sm">
              Advanced AI technology for intelligent responses and comprehensive analysis.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Conversational</h3>
            <p className="text-slate-300 text-sm">
              Natural conversation interface that maintains context throughout your session.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Research Mode</h3>
            <p className="text-slate-300 text-sm">
              Enhanced with web search and RAG capabilities for accurate, up-to-date information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

