import React from 'react';

const GlobalStyles: React.FC = () => {
  return (
    <>
      {/* Google Fonts Import with fallbacks for server compatibility */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Inter:wght@500&family=DM+Sans:wght@400&display=swap');
        
        /* Enhanced CSS Reset for cross-server layout consistency */
        * {
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100vh;
          overflow-x: hidden;
          /* Fix for RDP/VPN text scaling issues */
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
          text-size-adjust: 100%;
        }
        
        body {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          transform: none !important;
          zoom: 1 !important;
          -webkit-transform: none !important;
          -moz-transform: none !important;
          /* Enhanced font smoothing for better rendering across servers */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Prevent layout shift on different servers */
        #__next {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }
        
        /* Font family utility classes with fallbacks */
        .font-poppins {
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
          font-display: swap;
        }
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-display: swap;
        }
        
        .font-dm-sans {
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          font-display: swap;
        }
        
        /* Custom Blue Scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #1f2937;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
      
      {/* Add markdown styling */}
      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css');
        @import url('https://unpkg.com/@wcj/markdown-to-html/dist/marked.css');
        
        /* Custom markdown styling */
        markdown-style {
          display: block;
        }
        /* Restore blue bold for markdown content, like lightning mode */
        markdown-style strong,
        .markdown-style strong {
          color: #60a5fa;
          font-weight: 600;
        }
        
        /* Ensure buttons in markdown content are visible and clickable */
        markdown-style button,
        .markdown-style button {
          display: inline-block !important;
          visibility: visible !important;
          opacity: 1 !important;
          cursor: pointer !important;
          pointer-events: auto !important;
          position: relative !important;
          z-index: 10 !important;
        }
        markdown-style em,
        .markdown-style em {
          color: #93c5fd;
          font-style: italic;
        }
        
        /* Custom markdown styling with deeper selector specificity */
        /* Restore blue gradient headings for brand consistency */
        .prose markdown-style h1,
        markdown-style h1,
        [data-markdown] h1 {
          color: #60a5fa !important;
          font-size: 20px !important;
          margin: 20px 0 12px !important;
          font-weight: 500 !important;
          background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        .prose markdown-style h2,
        markdown-style h2,
        [data-markdown] h2 {
          color: #60a5fa !important;
          font-size: 18px !important;
          margin: 16px 0 10px !important;
          font-weight: 500 !important;
          background: linear-gradient(90deg, #0ea5e9 0%, #3b82f6 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        .prose markdown-style h3,
        markdown-style h3,
        [data-markdown] h3 {
          color: #93c5fd !important;
          font-size: 16px !important;
          margin: 14px 0 8px !important;
          font-weight: 400 !important;
          background: linear-gradient(90deg, #60a5fa 0%, #93c5fd 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }
        markdown-style a {
          color: #3b82f6;
          text-decoration: none;
          transition: color 0.2s;
        }
        markdown-style a:hover {
          color: #60a5fa;
          text-decoration: underline;
        }
        markdown-style code {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
          font-size: 0.9em;
          color: #93c5fd;
        }
        markdown-style pre {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
          overflow-x: auto;
        }
        markdown-style pre code {
          background: transparent;
          border: none;
          padding: 0;
          color: #e0f2fe;
        }
        markdown-style blockquote {
          border-left: 4px solid #3b82f6;
          margin: 16px 0;
          padding: 8px 16px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 0 8px 8px 0;
          color: #93c5fd;
        }
        markdown-style table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          min-width: 1200px;
          max-width: none;
        }
        /* Table container with horizontal scroll - no borders or backgrounds */
        markdown-style .table-container,
        .table-container {
          overflow-x: auto;
          overflow-y: visible;
          max-height: none;
          margin: 16px 0;
          padding: 0;
          width: 100%;
          /* Force horizontal scrollbar to always be visible */
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #1f2937;
          /* Add visual indicator for scrollable content */
          position: relative;
        }
        
        /* Add scroll indicator */
        .table-container::after {
          content: "← Scroll for more →";
          position: absolute;
          bottom: -25px;
          right: 10px;
          font-size: 11px;
          color: #60a5fa;
          opacity: 0.7;
          pointer-events: none;
          z-index: 10;
        }
        markdown-style .table-container::-webkit-scrollbar,
        .table-container::-webkit-scrollbar {
          height: 14px;
          width: 14px;
        }
        markdown-style .table-container::-webkit-scrollbar-track,
        .table-container::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        markdown-style .table-container::-webkit-scrollbar-thumb,
        .table-container::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 8px;
          border: 2px solid rgba(15, 23, 42, 0.8);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        markdown-style .table-container::-webkit-scrollbar-thumb:hover,
        .table-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #2563eb, #1e40af);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          transform: scale(1.1);
        }
        markdown-style .table-container::-webkit-scrollbar-corner,
        .table-container::-webkit-scrollbar-corner {
          background: rgba(15, 23, 42, 0.9);
        }
        markdown-style .table-container table,
        .table-container table,
        table {
          min-width: 1200px;
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        markdown-style thead,
        thead {
          position: sticky;
          top: 0;
          background: rgba(15, 23, 42, 0.95);
          z-index: 2;
        }
        markdown-style th,
        th {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 12px;
          color: #60a5fa;
          font-weight: 600;
          min-width: 150px;
          text-align: left;
          white-space: normal;
          position: sticky;
          top: 0;
          z-index: 1;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        markdown-style td,
        td {
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 12px;
          min-width: 150px;
          vertical-align: top;
          white-space: normal;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        markdown-style tr:nth-child(even),
        tr:nth-child(even) {
          background: rgba(15, 23, 42, 0.3);
        }
        
        /* Improved table row styling */
        markdown-style tr,
        tr {
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        /* Make sure table cells have proper spacing */
        markdown-style td, markdown-style th,
        td, th {
          padding: 12px;
          text-align: left;
          line-height: 1.5;
          max-width: none;
          min-width: 150px;
          overflow: visible;
          text-overflow: initial;
          border: 1px solid rgba(59, 130, 246, 0.2);
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
        /* Loading animation */
        .ai-loading {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #60a5fa;
          font-style: italic;
          font-weight: normal;
        }
        .loading-dots {
          display: inline-flex;
          gap: 3px;
        }
        .loading-dots span {
          display: inline-block;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background-color: #60a5fa;
          animation: loading-pulse 1.5s infinite ease-in-out;
        }
        .loading-dots span:nth-child(1) { animation-delay: 0s; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes loading-pulse {
          0%, 60%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          30% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        /* Ensure no horizontal scroll except for tables */
        markdown-style *:not(table, .table-container, th, td) {
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        markdown-style ul, markdown-style ol {
          padding-left: 20px !important;
          margin: 8px 0 !important;
        }
        markdown-style li {
          margin: 4px 0 !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
        
        /* Special styling for lead generation tables - no borders or backgrounds */
        markdown-style h3 + .table-container,
        markdown-style h4 + .table-container,
        .lead-table-container,
        div:has(table.lead-table) {
          margin-top: 16px;
        }
        
        /* Make titles for lead gen tables stand out */
        h3:contains("Target Companies by Size"),
        h4:contains("Small Companies"),
        h4:contains("Medium Companies"),
        h4:contains("Large Companies"),
        h3:contains("Competitor Analysis") {
          margin-top: 24px !important;
          padding-bottom: 8px !important;
          border-bottom: 1px solid rgba(59, 130, 246, 0.3) !important;
        }
        
        markdown-style h4:contains("Medium Companies"),
        markdown-style h4:contains("Large Companies"),
        markdown-style h4:contains("Small Companies") {
          color: #60a5fa !important;
          font-size: 18px !important;
          margin: 24px 0 12px !important;
          padding-bottom: 8px !important;
          border-bottom: 1px solid rgba(59, 130, 246, 0.3) !important;
          font-weight: 500 !important;
        }
        /* Headings have already been defined earlier in the file */
        
        /* Basic markdown elements already defined earlier in the file */
        
        /* Typing animation styles */
        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background-color: #60a5fa;
          animation: blink 1s infinite;
          margin-left: 2px;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        /* Loading animation styles */
        .ai-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #60a5fa;
        }
        
        .loading-dots {
          display: flex;
          gap: 4px;
        }
        
        .loading-dots span {
          width: 6px;
          height: 6px;
          background: #60a5fa;
          border-radius: 50%;
          animation: loading 1.4s ease-in-out infinite both;
        }
        
        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        .loading-dots span:nth-child(3) { animation-delay: 0s; }
        
        @keyframes loading {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Chat message styles */
        .chat-message-user {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1));
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        
        /* Removed chat-message-ai styling to have plain text for AI responses */
        
        /* Prose adjustments for better overflow handling */
        .prose {
          max-width: none !important;
          overflow-x: hidden !important;
        }
        
        .prose * {
          max-width: 100% !important;
          overflow-wrap: break-word !important;
          word-wrap: break-word !important;
        }
        
        .prose table {
          display: table !important;
          overflow-x: auto !important;
          white-space: normal !important;
          width: 100% !important;
          min-width: 1200px !important;
          table-layout: auto !important;
          /* Ensure horizontal scrollbar is visible */
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #1f2937;
        }
        
        /* Enhanced scrollbar for prose tables */
        .prose table::-webkit-scrollbar {
          height: 14px;
        }
        .prose table::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .prose table::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 8px;
          border: 2px solid rgba(15, 23, 42, 0.8);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .prose table::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #2563eb, #1e40af);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          transform: scale(1.1);
        }
        
        .prose tbody {
          display: table !important;
          width: 100% !important;
        }
        
        /* Additional styles from Main.tsx */
        .ai-bullet {
          color: #7dd3fc;
          font-weight: bold;
          margin-right: 0.5em;
          font-size: 1.1em;
          vertical-align: middle;
        }
        .ai-highlight {
          background: #2563eb;
          color: #fff;
          padding: 0.1em 0.4em;
          border-radius: 0.4em;
          font-weight: 600;
          box-shadow: 0 1px 6px #2563eb33;
        }
        .ai-topic-heading {
          display: block;
          font-size: 1.35em;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(90deg, #2563eb 60%, #7dd3fc 100%);
          padding: 0.2em 0.7em 0.2em 0.5em;
          border-radius: 0.5em;
          margin: 1.1em 0 0.7em 0;
          box-shadow: 0 2px 12px #2563eb22;
          letter-spacing: 0.01em;
        }
        
        /* Chat message styles - only user messages have borders */
        .chat-message-user {
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #e0f2fe;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.1);
        }
        .chat-message-ai {
          /* No borders or background for AI messages */
          color: #e2e8f0;
        }
        .glass-container-chat {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .typing-cursor {
          display: inline-block;
          width: 6px;
          height: 0.9em;
          background-color: rgba(59, 130, 246, 0.8);
          margin-left: 1px;
          animation: blink 1s infinite;
          vertical-align: middle;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .send-button {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.9));
          backdrop-filter: blur(15px);
          border: 2px solid rgba(59, 130, 246, 0.6);
          box-shadow: 
            0 4px 16px rgba(59, 130, 246, 0.3), 
            inset 0 1px 0 rgba(147, 197, 253, 0.5);
          color: white;
        }
        .send-button:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(29, 78, 216, 1));
          border-color: rgba(59, 130, 246, 0.8);
          box-shadow: 
            0 8px 24px rgba(59, 130, 246, 0.4),
            inset 0 1px 0 rgba(147, 197, 253, 0.6);
          transform: scale(1.1);
        }
        .send-button-chat {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.7), rgba(37, 99, 235, 0.8));
          backdrop-filter: blur(12px);
          border: 2px solid rgba(59, 130, 246, 0.5);
          box-shadow: 
            0 3px 12px rgba(59, 130, 246, 0.25), 
            inset 0 1px 0 rgba(147, 197, 253, 0.4);
          color: white;
        }
        .send-button-chat:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.8), rgba(29, 78, 216, 0.9));
          border-color: rgba(59, 130, 246, 0.7);
          box-shadow: 
            0 6px 18px rgba(59, 130, 246, 0.35),
            inset 0 1px 0 rgba(147, 197, 253, 0.5);
          transform: scale(1.05);
        }
        .glass-container {
          background: rgba(210, 182, 182, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(52, 129, 252, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        /* Glass container chat should only be applied to user messages */
        .chat-message-user .glass-container-chat {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }
        /* Remove styling for AI messages */
        .chat-message-ai .glass-container-chat {
          background: transparent;
          backdrop-filter: none;
          border: none;
          box-shadow: none;
        }
        .glass-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .glass-button:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        /* Modernized chat message styles - only for user messages */
        .chat-message-user-modern {
          background: linear-gradient(120deg, #232046 0%, #18122b 100%);
          border: 1.5px solid #2d2a4a;
          box-shadow: 0 3px 12px #7F5FFF22, 0 1px 0 #C247AC22 inset;
        }
        /* AI messages have no styling */
        .chat-message-ai-modern {
          background: transparent;
          border: none;
          box-shadow: none;
        }
        .chat-background::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(15, 23, 42, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.1) 1px, transparent 1px);
          background-size: 30px 30px;
          background-position: center;
          opacity: 0.3;
          pointer-events: none;
          z-index: 0;
        }
        .bg-grid {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          filter: blur(0.5px);
        }
        .bg-grid-secondary {
          background-image: 
            linear-gradient(rgba(147, 197, 253, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(147, 197, 253, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
          filter: blur(0.3px);
        }
        .mode-toggle-button {
          background: rgba(59, 130, 246, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }
        .mode-toggle-button::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(59, 130, 246, 0.15),
            transparent
          );
          transform: rotate(45deg);
          transition: transform 0.6s ease;
          opacity: 0;
        }
        .mode-toggle-button:hover::before {
          animation: shine 0.6s ease-in-out;
          opacity: 1;
        }
        .mode-toggle-button:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.5);
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .mode-active {
          background: rgba(59, 130, 246, 0.2) !important;
          border-color: rgba(59, 130, 246, 0.5) !important;
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(147, 197, 253, 0.3) !important;
          border-radius: 50px !important;
          transform: scale(1.02);
        }
        .mode-active::before {
          background: linear-gradient(
            45deg,
            transparent,
            rgba(59, 130, 246, 0.2),
            transparent
          );
        }
        .mode-inactive {
          background: rgba(59, 130, 246, 0.08) !important;
          border-color: rgba(59, 130, 246, 0.2) !important;
          transform: scale(0.98);
        }
        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
            opacity: 0;
          }
        }
        @keyframes grid-smoke {
          0% { 
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
            transform: translate(20px, 20px);
          }
          100% { 
            transform: translate(40px, 40px);
            opacity: 0.3;
          }
        }
        @keyframes grid-smoke-reverse {
          0% { 
            transform: translate(40px, 40px);
            opacity: 0.2;
          }
          50% {
            opacity: 0.4;
            transform: translate(20px, 20px);
          }
          100% { 
            transform: translate(0, 0);
            opacity: 0.2;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-grid-smoke {
          animation: grid-smoke 15s ease-in-out infinite;
        }
        .animate-grid-smoke-reverse {
          animation: grid-smoke-reverse 18s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
        
        /* Prose styling for AI responses */
        .prose-invert {
          color: #e5e7eb;
        }
        .prose-chat {
          color: #d1d5db;
        }
        /* Headings inside rendered AI responses should use neutral light text */
        .prose-invert h1,
        .prose-invert h2,
        .prose-invert h3,
        .prose-invert h4,
        .prose-chat h1,
        .prose-chat h2,
        .prose-chat h3,
        .prose-chat h4,
        markdown-style h1,
        markdown-style h2,
        markdown-style h3,
        markdown-style h4 {
          color: #e5e7eb !important;
          -webkit-text-fill-color: initial !important; /* avoid gradient fill leftover */
          margin-top: 1em;
          margin-bottom: 0.75em;
        }
        .prose-invert li {
          margin-bottom: 0.5em;
        }
        .prose-invert ul {
          list-style-type: disc;
        }
        .prose-invert ol {
          list-style-type: decimal;
        }
        .prose-invert a {
          color: #19207fff;
          text-decoration: underline;
          text-decoration-color: rgba(0, 13, 255, 0.08);
        }
        .prose-invert a:hover {
          color: #3d3aeeff;
          text-decoration-color: rgba(0, 13, 255, 0.08);
        }
        
        /* Add font-family for placeholders */
        input::placeholder {
          font-family: 'Inter', sans-serif;
          font-weight: 500;
        }

        /* Placeholder slideshow animations */
        .placeholder-slide-in {
          animation: slideInFromTop 0.6s ease-out forwards;
        }

        .placeholder-slide-out {
          animation: slideOutToBottom 0.6s ease-in forwards;
        }

        @keyframes slideInFromTop {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOutToBottom {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }

        /* Ensure placeholder text animates */
        input::-webkit-input-placeholder {
          transition: all 0.6s ease;
        }
        input::-moz-placeholder {
          transition: all 0.6s ease;
        }
        input:-ms-input-placeholder {
          transition: all 0.6s ease;
        }
        input:-moz-placeholder {
          transition: all 0.6s ease;
        }
        
        /* Enhanced Lead Table Styles - With borders and proper alignment */
        .lead-table, table.lead-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          min-width: 800px;
          font-size: 14px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          overflow: hidden;
          table-layout: fixed; /* Force equal column widths */
        }
        
        .lead-table thead, table.lead-table thead {
          position: sticky;
          top: 0;
          z-index: 10;
        }
        
        .lead-table th, table.lead-table th {
          padding: 14px 12px;
          color: #60a5fa;
          font-weight: 600;
          width: 11.11% !important; /* Force equal width for 9 columns */
          text-align: left !important;
          vertical-align: top !important;
          background: rgba(59, 130, 246, 0.1);
          border-bottom: 2px solid rgba(59, 130, 246, 0.3);
          border-right: 1px solid rgba(59, 130, 246, 0.2);
          box-sizing: border-box;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .lead-table th:last-child, table.lead-table th:last-child {
          border-right: none;
        }
        
        .lead-table td, table.lead-table td {
          padding: 12px !important;
          border-right: 1px solid rgba(59, 130, 246, 0.1);
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
          color: #e2e8f0;
          vertical-align: top !important;
          width: 11.11% !important; /* Force equal width for 9 columns */
          text-align: left !important;
          box-sizing: border-box;
          word-wrap: break-word;
          overflow-wrap: break-word;
          max-width: 0; /* Enables text-overflow to work */
        }
        
        .lead-table td:last-child, table.lead-table td:last-child {
          border-right: none;
        }
        
        .lead-table tr:hover, table.lead-table tr:hover {
          background: rgba(59, 130, 246, 0.05);
        }
        
        .lead-table tr:nth-child(even), table.lead-table tr:nth-child(even) {
          background: rgba(15, 23, 42, 0.1);
        }
        
        .lead-table a, table.lead-table a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }
        
        .lead-table a:hover, table.lead-table a:hover {
          color: #60a5fa;
          text-decoration: underline;
        }
        
        /* Enhanced table container - no borders or backgrounds */
        .table-container {
          margin: 16px 0;
          overflow: hidden;
          padding: 0;
        }
        
        markdown-style .table-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 8px;
          border: 2px solid rgba(15, 23, 42, 0.8);
        }
        
        markdown-style .table-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
        }
        
        markdown-style .table-container::-webkit-scrollbar-corner {
          background: rgba(15, 23, 42, 0.8);
        }
        
        /* Specific styling for ResearchGPT tables */
        .researchgpt-table-wrapper {
          overflow-x: auto;
          overflow-y: visible;
          width: 100%;
          margin: 16px 0;
          padding: 8px;
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.3);
          border: 1px solid rgba(59, 130, 246, 0.2);
          /* Force horizontal scrollbar */
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #1f2937;
        }
        
        .researchgpt-table-wrapper::-webkit-scrollbar {
          height: 16px;
        }
        .researchgpt-table-wrapper::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.9);
          border-radius: 8px;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        .researchgpt-table-wrapper::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 8px;
          border: 2px solid rgba(15, 23, 42, 0.8);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        .researchgpt-table-wrapper::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #2563eb, #1e40af);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          transform: scale(1.05);
        }
        .researchgpt-table-wrapper::-webkit-scrollbar-corner {
          background: rgba(15, 23, 42, 0.9);
        }
      `}</style>
    </>
  );
};

export default GlobalStyles;
