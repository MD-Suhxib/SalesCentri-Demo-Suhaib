// Web Search Progress Component - Glassmorphic Black Theme
'use client';

import React from 'react';

export interface WebSearchStep {
  id: string;
  type: 'config' | 'search' | 'optimization' | 'provider' | 'result' | 'success';
  message: string;
  timestamp: number;
  data?: {
    query?: string;
    optimizedQuery?: string;
    provider?: string;
    result?: {
      title: string;
      url: string;
      content: string;
      score?: number;
    };
    resultsCount?: number;
  };
}

interface WebSearchProgressProps {
  isVisible: boolean;
  steps: WebSearchStep[];
  onComplete: () => void;
}

const WebSearchProgress: React.FC<WebSearchProgressProps> = ({
  isVisible,
  steps,
  onComplete
}) => {
  if (!isVisible) return null;

  const getStepIcon = (type: string) => {
    const icons = {
      config: '⚙️',
      search: '🔍',
      optimization: '🔧',
      provider: '🌐',
      result: '📄',
      success: '✅'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getStepColor = (type: string) => {
    const colors = {
      config: 'border-purple-500/30 bg-purple-500/10',
      search: 'border-blue-500/30 bg-blue-500/10',
      optimization: 'border-yellow-500/30 bg-yellow-500/10',
      provider: 'border-green-500/30 bg-green-500/10',
      result: 'border-cyan-500/30 bg-cyan-500/10',
      success: 'border-emerald-500/30 bg-emerald-500/10'
    };
    return colors[type as keyof typeof colors] || 'border-gray-500/30 bg-gray-500/10';
  };

  const extractDomain = (url: string) => {
    try {
      if (url === 'N/A' || !url) return 'Unknown';
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url.substring(0, 20) + '...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[70vh] bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center">
                🔍
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Web Search</h3>
                <p className="text-gray-400 text-xs">Finding relevant sources...</p>
              </div>
            </div>
            <button
              onClick={onComplete}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-gray-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 py-2">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min((steps.length / 8) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Steps Container with Vertical Scroll */}
        <div className="px-4 pb-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all duration-300 ${getStepColor(step.type)}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInUp 0.3s ease-out forwards'
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                    {getStepIcon(step.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium leading-relaxed">
                      {step.message}
                    </p>
                    
                    {/* Result Details */}
                    {step.type === 'result' && step.data?.result && (
                      <div className="mt-2 p-2 bg-black/30 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-cyan-400 text-xs font-medium truncate">
                            {extractDomain(step.data.result.url)}
                          </span>
                          {step.data.result.score && (
                            <div className="flex items-center gap-1">
                              <div className="w-8 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500"
                                  style={{ width: `${step.data.result.score}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">{step.data.result.score}%</span>
                            </div>
                          )}
                        </div>
                        <p className="text-white text-xs font-medium truncate">
                          {step.data.result.title}
                        </p>
                        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-1">
                          {step.data.result.content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-track-white\/5::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        .scrollbar-thumb-white\/20::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        .hover\\:scrollbar-thumb-white\/30::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default WebSearchProgress;
