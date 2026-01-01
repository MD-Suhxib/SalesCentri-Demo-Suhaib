// Configuration modal component for ResearchComparison

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Settings, 
  FolderOpen, 
  BarChart3, 
  Building2, 
  Bot, 
  Gem, 
  Search, 
  BookmarkPlus, 
  ChevronDown 
} from 'lucide-react';
import { 
  ResearchCategory, 
  DepthLevel, 
  CompanySize, 
  RevenueCategory, 
  VisibleModels,
  ResearchConfiguration 
} from '../types';
import { RESEARCH_CATEGORIES, DEPTH_LEVELS, TAILWIND_CLASSES } from '../constants';
import { createConfigurationName } from '../utils';

interface ConfigurationModalProps {
  showConfig: boolean;
  onClose: () => void;
  category: ResearchCategory;
  setCategory: (category: ResearchCategory) => void;
  depth: DepthLevel;
  setDepth: (depth: DepthLevel) => void;
  companySize: CompanySize;
  setCompanySize: (size: CompanySize) => void;
  revenueCategory: RevenueCategory;
  setRevenueCategory: (category: RevenueCategory) => void;
  focusOnLeads: boolean;
  setFocusOnLeads: (focus: boolean) => void;
  visibleModels: VisibleModels;
  setVisibleModels: (models: VisibleModels) => void;
  analysisType: 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused';
  setAnalysisType: (type: 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused') => void;
  multiGPTOutputFormat: 'tableOnly' | 'withContext';
  setMultiGPTOutputFormat: (format: 'tableOnly' | 'withContext') => void;
  onSaveConfiguration: () => void;
  saveSuccess: boolean;
  successMessage: string;
  modalBodyRef: React.RefObject<HTMLDivElement>;
}

export const ConfigurationModal: React.FC<ConfigurationModalProps> = ({
  showConfig,
  onClose,
  category,
  setCategory,
  depth,
  setDepth,
  companySize,
  setCompanySize,
  revenueCategory,
  setRevenueCategory,
  focusOnLeads,
  setFocusOnLeads,
  visibleModels,
  setVisibleModels,
  analysisType,
  setAnalysisType,
  multiGPTOutputFormat,
  setMultiGPTOutputFormat,
  onSaveConfiguration,
  saveSuccess,
  successMessage,
  modalBodyRef
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!showConfig || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '1rem',
        boxSizing: 'border-box'
      }}
    >
      {/* Min-height wrapper for proper centering */}
      <div
        style={{
          minHeight: 'calc(100vh - 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem 0',
          boxSizing: 'border-box',
          width: '100%',
          flexShrink: 0
        }}
      >
        {/* Modal container */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative rounded-2xl shadow-2xl flex flex-col overflow-hidden w-full"
          style={{ 
            background: 'var(--research-surface)',
            color: 'var(--research-text)',
            width: '100%',
            maxWidth: '56rem',
            maxHeight: 'calc(100vh - 2rem)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            margin: 'auto'
          }}
          tabIndex={-1}
        >
        <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b"
             style={{ borderColor: 'var(--research-border)' }}>
          <h3 id="modal-title" className="text-lg sm:text-xl md:text-2xl font-semibold flex items-center gap-2 sm:gap-3"
              style={{ color: 'var(--research-text)' }}>
            <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg"
                  style={{ background: 'var(--research-primary)' }}>
              <Settings size={16} className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </span>
            <span className="hidden sm:inline">Research Configuration</span>
            <span className="sm:hidden">Config</span>
          </h3>
          <button
            className="w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8 flex items-center justify-center rounded-lg transition-colors duration-200 text-xl sm:text-2xl font-light hover:bg-red-500/20 touch-manipulation"
            style={{ color: 'var(--research-text-muted)' }}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--research-danger)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--research-text-muted)';
            }}
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-3 md:p-6 modal-scroll-container"
             style={{
               contain: 'layout style paint',
               willChange: 'auto',
               overscrollBehavior: 'contain',
               scrollBehavior: 'smooth',
               isolation: 'isolate',
               minHeight: 0,
               flex: '1 1 auto'
             }}
             ref={modalBodyRef}>
          
          {/* Responsive Layout: Two-column layout with Research/Company on left, AI Models on right */}
          <div className="config-grid grid grid-cols-1 lg:grid-cols-2 gap-1.5 sm:gap-2 lg:gap-2.5">
            
            {/* Left Column: Research Settings + Company Settings */}
            <div className="space-y-1.5 sm:space-y-2">
              {/* Research Settings */}
              <div className="config-section p-1 sm:p-1.5 md:p-1.5 rounded-lg border mobile-form-section" style={{ 
                background: 'var(--research-surface)', 
                borderColor: 'var(--research-border)' 
              }}>
                <h4 className="config-section-header text-xs sm:text-xs md:text-sm font-semibold mb-1 sm:mb-1.5 md:mb-1.5 flex items-center gap-1 sm:gap-1 mobile-section-header" style={{ color: 'var(--research-text)' }}>
                  <FolderOpen size={12} className="sm:w-3 sm:h-3 md:w-3 md:h-3" />
                  Research Settings
                </h4>
                <div className="space-y-1 sm:space-y-1 md:space-y-1.5">
              <label className="block space-y-0.5">
                    <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: 'var(--research-text)' }}>
                  Research Category
                </span>
                <div className="relative">
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value as ResearchCategory)}
                    className="config-form-element w-full px-1 py-1 sm:px-1.5 sm:py-1 md:py-1 rounded border appearance-none cursor-pointer transition-all duration-200 font-medium text-xs touch-manipulation mobile-form-element"
                    style={{
                      background: 'var(--research-surface)',
                      borderColor: 'var(--research-border)',
                      color: 'var(--research-text)',
                      minHeight: '1.75rem'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--research-primary)';
                      e.target.style.boxShadow = '0 0 0 0.125rem var(--research-focus)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--research-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {RESEARCH_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                               style={{ color: 'var(--research-text-muted)' }} />
                </div>
              </label>
              
              <label className="block space-y-0.5">
                    <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: 'var(--research-text)' }}>
                  Research Depth
                </span>
                <div className="relative">
                  <select 
                    value={depth} 
                    onChange={e => setDepth(e.target.value as DepthLevel)}
                    className="config-form-element w-full px-1 py-1 sm:px-1.5 sm:py-1 md:py-1 rounded border appearance-none cursor-pointer transition-all duration-200 font-medium text-xs touch-manipulation mobile-form-element"
                    style={{
                      background: 'var(--research-surface)',
                      borderColor: 'var(--research-border)',
                      color: 'var(--research-text)',
                      minHeight: '1.75rem'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--research-primary)';
                      e.target.style.boxShadow = '0 0 0 0.125rem var(--research-focus)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--research-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {DEPTH_LEVELS.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={10} className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                               style={{ color: 'var(--research-text-muted)' }} />
                </div>
              </label>
              
              {/* Analysis Type - Only show for General Research */}
              {category === 'general_research' && (
                <>
                  <label className="block space-y-0.5">
                    <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: 'var(--research-text)' }}>
                      Analysis Type
                      <span className="text-xs opacity-75">(Multi-GPT Variant)</span>
                    </span>
                  <div className="relative">
                    <select 
                      value={analysisType} 
                      onChange={e => setAnalysisType(e.target.value as 'default' | 'technical' | 'business' | 'academic' | 'multiGPTFocused')}
                      className="config-form-element w-full px-1 py-1 sm:px-1.5 sm:py-1 md:py-1 rounded border appearance-none cursor-pointer transition-all duration-200 font-medium text-xs touch-manipulation mobile-form-element"
                      style={{
                        background: 'var(--research-surface)',
                        borderColor: 'var(--research-border)',
                        color: 'var(--research-text)',
                        minHeight: '1.75rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--research-primary)';
                        e.target.style.boxShadow = '0 0 0 0.125rem var(--research-focus)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'var(--research-border)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="default">Default - Standard analysis</option>
                      <option value="technical">Technical - Focus on technical aspects</option>
                      <option value="business">Business - Business-focused analysis</option>
                      <option value="academic">Academic - Research-oriented approach</option>
                      <option value="multiGPTFocused">✨ Multi-GPT Focused - Strict (topic × company) formula with no background info</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                                 style={{ color: 'var(--research-text-muted)' }} />
                  </div>
                  <p style={{ color: 'var(--research-text-muted)', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                    {analysisType === 'multiGPTFocused' 
                      ? '🎯 Research topic × company combination only. No assumptions or background info.'
                      : 'Select how you want the analysis to be performed.'}
                  </p>
                </label>

                {/* Output Format Selector - Only for multiGPTFocused */}
                {analysisType === 'multiGPTFocused' && (
                  <label style={{ display: 'block', marginTop: '0.75rem' }}>
                    <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: 'var(--research-text)' }}>
                      Output Format
                    </span>
                    <div style={{ position: 'relative', marginTop: '0.125rem' }}>
                      <select
                        value={multiGPTOutputFormat}
                        onChange={(e) => setMultiGPTOutputFormat(e.target.value as 'tableOnly' | 'withContext')}
                        className="w-full px-1 py-0.5 pr-5 rounded text-xs border mobile-select-input"
                        style={{
                          background: 'var(--research-input-bg)',
                          color: 'var(--research-text)',
                          borderColor: 'var(--research-border)',
                          cursor: 'pointer',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none'
                        }}
                      >
                        <option value="withContext">📝 With Context - Brief answer + findings (under 200 words)</option>
                        <option value="tableOnly">📊 Table Only - Pure markdown table with no explanatory text</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                                   style={{ color: 'var(--research-text-muted)' }} />
                    </div>
                    <p style={{ color: 'var(--research-text-muted)', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                      {multiGPTOutputFormat === 'tableOnly' 
                        ? '📊 Pure markdown table format: | Company | Topic | Finding | Source |'
                        : '📝 Brief 1-2 sentence answer + bullet points of key findings.'}
                    </p>
                  </label>
                )}
                </>
              )}
            </div>
          </div>
              
          {/* Company Settings */}
              <div className="config-section p-1 sm:p-1.5 md:p-1.5 rounded-lg border mobile-form-section" style={{ 
                background: 'var(--research-surface)', 
                borderColor: 'var(--research-border)' 
              }}>
                <h4 className="config-section-header text-xs sm:text-xs md:text-sm font-semibold mb-1 sm:mb-1.5 md:mb-1.5 flex items-center gap-1 sm:gap-1 mobile-section-header" style={{ color: 'var(--research-text)' }}>
                  <Building2 size={12} className="sm:w-3 sm:h-3 md:w-3 md:h-3" />
                  Company Settings
                </h4>
                <div className="space-y-1 sm:space-y-1 md:space-y-1.5">
              <label className="block space-y-0.5">
                    <span className="text-xs font-medium" style={{ color: 'var(--research-text)' }}>
                  Company Size
                </span>
                <div className="relative">
                  <select 
                    value={companySize} 
                    onChange={e => setCompanySize(e.target.value as CompanySize)} 
                    className="config-form-element w-full px-1 py-1 sm:px-1.5 sm:py-1 md:py-1 rounded border appearance-none cursor-pointer transition-all duration-200 font-medium text-xs touch-manipulation mobile-form-element"
                    style={{
                      background: 'var(--research-surface)',
                      borderColor: 'var(--research-border)',
                      color: 'var(--research-text)',
                      minHeight: '1.75rem'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--research-primary)';
                      e.target.style.boxShadow = '0 0 0 0.125rem var(--research-focus)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--research-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="all">All Sizes</option>
                    <option value="small">Small (1-50 employees)</option>
                    <option value="medium">Medium (51-500 employees)</option>
                    <option value="big">Large (500+ employees)</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                               style={{ color: 'var(--research-text-muted)' }} />
                </div>
              </label>

              <label className="block space-y-0.5">
                    <span className="text-xs font-medium" style={{ color: 'var(--research-text)' }}>
                  Revenue Category
                </span>
                <div className="relative">
                  <select 
                    value={revenueCategory} 
                    onChange={e => setRevenueCategory(e.target.value as RevenueCategory)} 
                    className="config-form-element w-full px-1 py-1 sm:px-1.5 sm:py-1 md:py-1 rounded border appearance-none cursor-pointer transition-all duration-200 font-medium text-xs touch-manipulation mobile-form-element"
                    style={{
                      background: 'var(--research-surface)',
                      borderColor: 'var(--research-border)',
                      color: 'var(--research-text)',
                      minHeight: '1.75rem'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--research-primary)';
                      e.target.style.boxShadow = '0 0 0 0.125rem var(--research-focus)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--research-border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="all">All Revenue Ranges</option>
                    <option value="startup">Startup (&lt;$1M)</option>
                    <option value="emerging">Emerging ($1M-$10M)</option>
                    <option value="growth">Growth ($10M-$100M)</option>
                    <option value="enterprise">Enterprise ($100M+)</option>
                  </select>
                  <ChevronDown size={10} className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                               style={{ color: 'var(--research-text-muted)' }} />
                </div>
              </label>
              
                  <div className="p-1 sm:p-1 md:p-1.5 rounded border" style={{
                     background: 'var(--research-muted)',
                     borderColor: 'var(--research-border)'
                   }}>
                <label className="flex items-start gap-1 cursor-pointer touch-manipulation">
                  <input 
                    type="checkbox" 
                    checked={focusOnLeads} 
                    onChange={() => setFocusOnLeads(!focusOnLeads)} 
                    className="mt-0.5 w-3 h-3 sm:w-3 sm:h-3 md:w-3 md:h-3 rounded border-2 transition-all duration-200"
                    style={{
                      accentColor: 'var(--research-primary)',
                      borderColor: 'var(--research-border)',
                      minWidth: '0.75rem',
                      minHeight: '0.75rem'
                    }}
                  />
                      <span className="text-xs font-medium leading-relaxed" style={{ color: 'var(--research-text)' }}>
                        Focus on Lead Generation
                  </span>
                </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column: AI Models */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="p-1 sm:p-1.5 md:p-1.5 rounded-lg border mobile-form-section" style={{ 
                     background: 'var(--research-surface)',
                     borderColor: 'var(--research-border)'
                   }}>
                <h4 className="config-section-header text-xs sm:text-xs md:text-sm font-semibold mb-1 sm:mb-1.5 md:mb-1.5 flex items-center gap-1 sm:gap-1 mobile-section-header" style={{ color: 'var(--research-text)' }}>
                  <Bot size={12} className="sm:w-3 sm:h-3 md:w-3 md:h-3" />
                  AI Models
                </h4>
                <div className="config-ai-grid grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5">
                  <label className={`config-ai-button flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation mobile-ai-button ${
                    visibleModels.gpt4o 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.gpt4o}
                      onChange={() => setVisibleModels({ ...visibleModels, gpt4o: !visibleModels.gpt4o })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Bot size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">GPT-4O</span>
                      <span className="sm:hidden whitespace-nowrap">GPT</span>
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation ${
                    visibleModels.gemini 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.gemini}
                      onChange={() => setVisibleModels({ ...visibleModels, gemini: !visibleModels.gemini })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Gem size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">PSA GPT</span>
                      <span className="sm:hidden whitespace-nowrap">PSA</span>
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation ${
                    visibleModels.perplexity 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.perplexity}
                      onChange={() => setVisibleModels({ ...visibleModels, perplexity: !visibleModels.perplexity })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Search size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">Perplexity</span>
                      <span className="sm:hidden whitespace-nowrap">Perp</span>
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation ${
                    visibleModels.claude 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.claude}
                      onChange={() => setVisibleModels({ ...visibleModels, claude: !visibleModels.claude })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Bot size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">Claude</span>
                      <span className="sm:hidden whitespace-nowrap">Claude</span>
                    </span>
                  </label>
                  <label className="flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 opacity-50 bg-gray-700 border-gray-600 text-gray-400 touch-manipulation"
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      disabled
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Gem size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">Gemini</span>
                      <span className="sm:hidden whitespace-nowrap">Gem</span>
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation ${
                    visibleModels.llama 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.llama}
                      onChange={() => setVisibleModels({ ...visibleModels, llama: !visibleModels.llama })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Bot size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">Llama 3</span>
                      <span className="sm:hidden whitespace-nowrap">Llama</span>
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation ${
                    visibleModels.grok 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.grok}
                      onChange={() => setVisibleModels({ ...visibleModels, grok: !visibleModels.grok })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Bot size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">Grok</span>
                      <span className="sm:hidden whitespace-nowrap">Grok</span>
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation ${
                    visibleModels.deepseek 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.deepseek}
                      onChange={() => setVisibleModels({ ...visibleModels, deepseek: !visibleModels.deepseek })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Bot size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">DeepSeek</span>
                      <span className="sm:hidden whitespace-nowrap">Deep</span>
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation ${
                    visibleModels.qwen3 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.qwen3}
                      onChange={() => setVisibleModels({ ...visibleModels, qwen3: !visibleModels.qwen3 })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Bot size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">Qwen 3</span>
                      <span className="sm:hidden whitespace-nowrap">Qwen</span>
                    </span>
                  </label>
                  <label className={`flex items-center justify-center gap-1 p-1.5 sm:p-1.5 md:p-2 rounded border cursor-pointer transition-all duration-200 hover:border-opacity-80 touch-manipulation ${
                    visibleModels.mistralLarge 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-gray-700 border-gray-600 text-gray-300'
                  }`}
                  style={{ minHeight: '2rem', minWidth: '100%' }}>
                    <input
                      type="checkbox"
                      checked={visibleModels.mistralLarge}
                      onChange={() => setVisibleModels({ ...visibleModels, mistralLarge: !visibleModels.mistralLarge })}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-center gap-1 text-xs font-medium text-center">
                      <Bot size={10} className="sm:w-2.5 sm:h-2.5 flex-shrink-0" />
                      <span className="hidden sm:inline whitespace-nowrap">Mistral Large</span>
                      <span className="sm:hidden whitespace-nowrap">Mistral</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Configuration Section - Centered */}
          <div className="flex justify-center items-center mt-2 sm:mt-3 md:mt-4 px-1 sm:px-2">
            <div className="flex flex-col items-center gap-1.5">
              <button
                onClick={onSaveConfiguration}
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded font-medium transition-all duration-200 hover:-translate-y-0.5 touch-manipulation"
                style={{
                  background: 'var(--research-accent)',
                  color: 'white',
                  minHeight: '2rem',
                  minWidth: '8rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--research-accent-hover)';
                  e.currentTarget.style.boxShadow = '0 0.125rem 0.5rem rgba(167, 139, 250, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--research-accent)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <BookmarkPlus size={12} />
                <span className="text-xs">Save Configuration</span>
              </button>
              {saveSuccess && (
                <div className="flex items-center gap-1 p-1.5 rounded text-xs"
                     style={{
                       background: 'rgba(86, 211, 100, 0.1)',
                       color: 'var(--research-success)',
                       border: '0.0625rem solid rgba(86, 211, 100, 0.2)'
                     }}>
                  ✓ {successMessage}
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document root, avoiding parent container constraints
  if (typeof window !== 'undefined' && document.body) {
    return createPortal(modalContent, document.body);
  }
  
  return null;
};
