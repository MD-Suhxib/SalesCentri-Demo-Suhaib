// Inline Web Search Progress Component - Displays in chat flow like ChatGPT
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

interface InlineWebSearchProgressProps {
  isVisible: boolean;
  steps: WebSearchStep[];
  isSearching?: boolean;
}

const InlineWebSearchProgress: React.FC<InlineWebSearchProgressProps> = ({
  isVisible,
  steps,
  isSearching = false
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

  const extractDomain = (url: string) => {
    try {
      if (url === 'N/A' || !url) return 'Unknown';
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url.substring(0, 20) + '...';
    }
  };

  const currentStep = steps[steps.length - 1];
  const isSearchStep = currentStep?.type === 'search' || isSearching;

  // If no steps yet, create default progress steps to show immediate feedback
  const displaySteps = steps.length > 0 ? steps : [
    {
      id: 'step_1',
      type: 'config' as const,
      message: '⚙️ Configuring research parameters...',
      timestamp: Date.now() - 2000
    },
    {
      id: 'step_2',
      type: 'search' as const,
      message: '🔍 Starting web search...',
      timestamp: Date.now() - 1000
    },
    {
      id: 'step_3',
      type: 'optimization' as const,
      message: '🔧 Optimizing search queries...',
      timestamp: Date.now()
    }
  ];

  return (
    <div className="max-w-4xl w-full mb-4">
      <div className="flex justify-start">
        <div className="max-w-3xl">
          {/* Main Progress Container */}
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                isSearching ? 'animate-pulse bg-blue-500/20 border border-blue-400/40' : 'bg-green-500/20 border border-green-400/40'
              }`}>
                {isSearching ? '🔍' : '✅'}
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  {isSearching ? 'Searching the web...' : 'Web search complete'}
                </p>
                <p className="text-gray-400 text-xs">
                  {isSearching ? 'Finding relevant sources' : `Found ${displaySteps.filter(s => s.type === 'result').length} sources`}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            {displaySteps.length > 0 && (
              <div className="space-y-2">
                {/* Show current/latest step */}
                {displaySteps[displaySteps.length - 1] && (
                  <div className="flex items-center gap-3 p-2 bg-black/20 rounded-lg border border-gray-600/30">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-xs">
                      {getStepIcon(displaySteps[displaySteps.length - 1].type)}
                    </div>
                    <p className="text-gray-200 text-xs font-medium flex-1">
                      {displaySteps[displaySteps.length - 1].message}
                    </p>
                    {isSearchStep && (
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Show sources found */}
                {displaySteps.filter(s => s.type === 'result').slice(0, 3).map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-2 bg-black/20 rounded-lg border border-gray-600/30"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'slideInRight 0.3s ease-out forwards'
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs">
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 text-xs font-medium truncate">
                          {step.data?.result ? extractDomain(step.data.result.url) : 'Source'}
                        </span>
                        {step.data?.result?.score && (
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-1 bg-gray-600/50 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-500"
                                style={{ width: `${step.data.result.score}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{step.data.result.score}%</span>
                          </div>
                        )}
                      </div>
                      {step.data?.result?.title && (
                        <p className="text-gray-300 text-xs truncate mt-1">
                          {step.data.result.title}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Show "and X more sources" if there are more */}
                {displaySteps.filter(s => s.type === 'result').length > 3 && (
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-5 h-5" />
                    <p className="text-gray-400 text-xs">
                      and {displaySteps.filter(s => s.type === 'result').length - 3} more sources...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Progress bar for searching state */}
            {isSearching && (
              <div className="mt-3">
                <div className="w-full h-1 bg-gray-700/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-full animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default InlineWebSearchProgress;
