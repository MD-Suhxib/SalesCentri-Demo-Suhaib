// History sidebar component for ResearchComparison

import React from 'react';
import { 
  History, 
  Pin, 
  X, 
  Plus, 
  FileText, 
  FileSpreadsheet, 
  Trash2 
} from 'lucide-react';
import { ChatHistoryEntry } from '../types';

interface HistorySidebarProps {
  sidebarOpen: boolean;
  sidebarDocked: boolean;
  onClose: () => void;
  onToggleDock: () => void;
  chatHistory: ChatHistoryEntry[];
  currentSessionId: number | null;
  onLoadHistoryEntry: (entry: ChatHistoryEntry) => void;
  onDeleteHistoryEntry: (id: number) => void;
  onNewResearch: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  sidebarOpen,
  sidebarDocked,
  onClose,
  onToggleDock,
  chatHistory,
  currentSessionId,
  onLoadHistoryEntry,
  onDeleteHistoryEntry,
  onNewResearch
}) => {
  return (
    <>
      {/* History Button - hide when sidebar is docked */}
      {!sidebarDocked && (
        <button
          onClick={() => onClose()}
          className="fixed top-20 left-4 sm:top-4 z-[99999] bg-neutral-800 hover:bg-neutral-900 text-white px-3 py-2 sm:px-4 flex items-center gap-2 rounded-lg shadow-lg transition-colors duration-200 border border-gray-700"
          aria-label="Open History"
        >
          <History size={18} className="text-white sm:w-5 sm:h-5" />
          <span className="hidden sm:inline font-medium">History</span>
        </button>
      )}
      
      {/* Overlay - only show when sidebar is open and not docked */}
      {sidebarOpen && !sidebarDocked && (
        <div
          className="fixed inset-0 bg-black/50 z-[99998]"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-80 flex flex-col z-[99999] transition-transform duration-300 ease-in-out border-r border-gray-700 ${
        sidebarDocked ? 'translate-x-0' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
      }`}
      style={{
        background: 'rgba(13, 17, 23, 0.75)',
        backdropFilter: 'saturate(1.2) blur(10px)',
        WebkitBackdropFilter: 'saturate(1.2) blur(10px)',
        contain: 'layout style paint',
        willChange: 'auto',
        overscrollBehavior: 'contain',
        overscrollBehaviorY: 'contain',
        touchAction: 'pan-y',
        height: '100vh',
        maxHeight: '100vh'
      }}>
        {/* History Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800 bg-gray-900">
          <div className="flex items-center gap-3">
            <History size={20} className="text-gray-200" />
            <span className="text-lg font-semibold text-gray-200">History</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Pin/Dock Toggle Button */}
            <button
              onClick={onToggleDock}
              className={`p-2 rounded-lg transition-all duration-200 ${
                sidebarDocked
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              aria-label={sidebarDocked ? 'Undock sidebar' : 'Dock sidebar'}
            >
              <Pin size={16} />
            </button>

            {/* Close Button - only show when not docked */}
            {!sidebarDocked && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
                aria-label="Close sidebar"
              >
                <X size={16} />
              </button>
            )}

            {/* New Research Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onNewResearch}
                className="flex items-center justify-center p-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                aria-label="New Research"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 p-4 sidebar-independent-scroll">
          {chatHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 italic text-center">No previous research sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chatHistory.slice().reverse().map((entry) => (
                <div
                  key={entry.id}
                  className={`group p-4 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-200 cursor-pointer ${
                    entry.id === currentSessionId ? 'ring-2 ring-blue-500 bg-gray-800' : ''
                  }`}
                  onClick={() => onLoadHistoryEntry(entry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={16} className="text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                        <h4 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                          {entry.query.length > 40 ? `${entry.query.substring(0, 40)}...` : entry.query}
                        </h4>
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mb-2">
                        {typeof window !== 'undefined' ? new Date(entry.timestamp).toLocaleString() : entry.timestamp}
                      </div>
                      {entry.fileName && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                          <FileSpreadsheet size={12} />
                          <span className="truncate">{entry.fileName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {entry.category.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {entry.depth}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryEntry(entry.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200 rounded hover:bg-gray-700"
                      title="Delete session"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
