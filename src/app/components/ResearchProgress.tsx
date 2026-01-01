'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Users, Target, BarChart3 } from 'lucide-react';
import { ResearchFlowState } from '../lib/researchFlow';

interface ResearchProgressProps {
  flowState: ResearchFlowState;
  isVisible: boolean;
}

export const ResearchProgress: React.FC<ResearchProgressProps> = ({ 
  flowState, 
  isVisible 
}) => {
  const steps = [
    { key: 'normal_chat', icon: Search, label: 'Ready', description: 'Ready for conversation' },
    { key: 'context_research', icon: Building2, label: 'Context', description: 'Company analysis' },
    { key: 'icp_check', icon: Users, label: 'ICP Check', description: 'Verify ICP status' },
    { key: 'icp_development', icon: Target, label: 'ICP Build', description: 'Build customer profile' },
    { key: 'lead_generation', icon: BarChart3, label: 'Leads', description: 'Generate leads' },
    { key: 'completed', icon: BarChart3, label: 'Complete', description: 'Analysis ready' },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === flowState.step);
  };

  const currentStepIndex = getCurrentStepIndex();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-black/40 backdrop-blur-xl border border-purple-400/30 rounded-xl p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-purple-300">ResearchGPT Progress</h3>
        {flowState.isAutoProcessing && (
          <div className="flex items-center space-x-2 text-purple-400">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs">Processing...</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2 overflow-x-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          // const isUpcoming = index > currentStepIndex;
          
          const Icon = step.icon;
          
          return (
            <div key={step.key} className="flex items-center space-x-2 min-w-0">
              <div className="flex flex-col items-center space-y-1">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-purple-500 border-purple-400 text-white' 
                      : isCurrent 
                        ? 'border-purple-400 text-purple-400 bg-purple-500/20' 
                        : 'border-gray-600 text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <div className={`text-xs font-medium ${
                    isCurrent ? 'text-purple-300' : isCompleted ? 'text-purple-400' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 ${
                    isCompleted ? 'bg-purple-400' : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {flowState.userProfile && (
        <div className="mt-3 text-xs text-purple-300">
          <span className="font-medium">Company: </span>
          {flowState.userProfile.organization.name}
          {flowState.conversationContext && (
            <div className="mt-1">
              <span className="font-medium">Context: </span>
              <span className="text-gray-400">
                {flowState.conversationContext.substring(0, 50)}...
              </span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
