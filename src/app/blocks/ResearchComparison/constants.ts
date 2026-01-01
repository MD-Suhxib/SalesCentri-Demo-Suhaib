// Constants for ResearchComparison component

export const RESEARCH_CATEGORIES = [
  'market_analysis',
  'sales_opportunities', 
  'competitive_intelligence',
  'industry_insights',
  'company_deep_research',
  'general_research'
] as const;

export const DEPTH_LEVELS = ['basic', 'intermediate', 'comprehensive'] as const;

export const PERPLEXITY_MODELS = {
  basic: 'sonar-deep-research',
  standard: 'sonar-deep-research',
  advanced: 'sonar-deep-research',
  research: 'sonar-deep-research',
} as const;

export const TAILWIND_CLASSES = {
  modalBody: 'p-4 md:p-6',
  configMainGrid: 'grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6',
  configColumn: 'space-y-4 md:space-y-5',
  configLabel: 'text-xs md:text-sm font-medium text-gray-300',
  labelText: 'flex items-center gap-2',
  labelIcon: 'w-3.5 h-3.5',
  selectWrapper: 'relative',
  adaptiveSelect: 'w-full px-3 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  selectArrow: 'absolute right-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none',
  configGrid: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  configCard: 'bg-gray-800 border border-gray-700 rounded-lg p-4',
  cardHeader: 'flex items-center justify-between mb-4',
  cardTitle: 'text-sm font-semibold text-white',
  cardGrid: 'grid grid-cols-2 gap-2',
  checkboxLabel: 'flex items-center gap-2 p-3 md:p-4 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer transition-all duration-200 hover:border-blue-500',
  checkboxInput: 'w-3.5 h-3.5 text-blue-500 bg-gray-600 border-gray-500 rounded focus:ring-blue-500',
  checkboxText: 'text-xs md:text-sm font-medium text-gray-300',
  modalFooter: 'flex justify-end gap-3 p-4 md:p-6 border-t border-gray-700',
  footerButtons: 'flex gap-2',
  footerButton: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
  resultsGrid: 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6',
  resultCard: 'bg-gray-800 border border-gray-700 rounded-lg overflow-hidden',
  resultHeader: 'flex items-center justify-between p-4 border-b border-gray-700',
  resultTitle: 'text-lg font-semibold text-white',
  resultStatus: 'px-2 py-1 text-xs font-medium rounded-full',
  resultContent: 'p-4 max-h-96 overflow-y-auto',
  resultActions: 'flex gap-2 p-4 border-t border-gray-700',
  exportButton: 'flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200',
  modelButton: 'flex items-center gap-2 p-2 rounded-md border cursor-pointer transition-all duration-200 hover:border-opacity-80',
  modelCheckbox: 'sr-only',
  modelButtonContent: 'flex items-center gap-1.5 text-xs font-medium',
  modelIcon: 'w-2.5 h-2.5',
  aiModelsSection: 'space-y-4',
  toggleGroupTitle: 'flex items-center gap-2 text-sm font-semibold text-white',
  toggleGroupIcon: 'w-4 h-4',
  modelButtons: 'grid grid-cols-2 gap-2'
} as const;
