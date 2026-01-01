"use client";

// Global function declarations for Lightning Mode buttons
declare global {
  interface Window {
    handleQ1Response: (productFocus: string) => void;
    handleQ2Response: (outreachPreference: string) => void;
    handleQ3Response: (leadHandoffPreference: string) => void;
    handleICPResponse?: (response: "yes" | "no") => void;
    generateLeads?: () => void;
    handleLeadGenAnswer?: (
      key: string,
      answer: string,
      nextStep: number
    ) => void;
    startLeadGenQuestions?: () => void;
    submitCustomRegion?: () => void;
    showCustomRegionInput?: () => void;
    selectOption?: (option: string) => void;
    viewDashboard?: () => void;
    lightningGenerateLeads: () => void;
    handleGenerateProspectsClick: () => Promise<void>;
    testLightningGenerateLeads?: () => void;
  }
}

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter, useParams } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { callGemini, callGeminiWithSources } from "../../lib/callGemini";
import BlurText from "../../blocks/TextAnimations/BlurText/BlurText";
import Image from "next/image";
import {
  Zap,
  Target,
  Settings2,
  AudioLines,
  User,
  Wrench,
  History,
  ChevronDown,
  Home,
  Package,
  Info,
  Phone,
  Calendar,
  Building2,
  X,
  ExternalLink,
  Rocket,
  Atom,
  Pin,
  Upload,
  Search,
  Globe,
  Microscope,
  Bot,
} from "lucide-react";
import LightRays from "../../blocks/Backgrounds/LightRays/LightRays";
import Orb from "../../blocks/Backgrounds/Orb/Orb";
import Dock from "../../blocks/Components/Dock/Dock";
import VerticalDock from "../../blocks/Components/Dock/VerticalDock";
import markdown from "@wcj/markdown-to-html";
import { motion } from "framer-motion";
import { canMakeQuery, incrementQueryCount } from "../../lib/queryLimit";
import {
  validateAuthenticationAsync,
  clearTokens,
  UserProfile,
} from "../../lib/auth";
import { getLoginUrl } from "../../lib/loginUtils";
import {
  ResearchFlowState,
  shouldTriggerLeadGeneration,
  extractConversationContext,
} from "../../lib/researchFlow";
import { QueryLimitGate } from "../../components/QueryLimitGate";
import { ResearchGPTGate } from "../../components/ResearchGPTGate";
import { ResearchProgress } from "../../components/ResearchProgress";
import { useWebSearchProgress } from "../../hooks/useWebSearchProgress";
import { useStreamingResearch } from "../../hooks/useStreamingResearch";
import InlineWebSearchProgress from "../../components/InlineWebSearchProgress";
import { getUserId } from "../../lib/userIdUtils";
import GlobalStyles from "./GlobalStyles";
import { chatApi } from "../../lib/chatApi";
import { useLightningMode } from "../../hooks/useLightningMode";
import { useTracker } from "../../hooks/useTracker";
import { ResearchExcelExportButton, SingleModelExcelExportButton } from "../../components/ExcelExportComponents";
import { ResearchTxtExportButton, CopyToClipboardButton } from "../../components/TxtExportButton";
import RobustPdfExportButton from "../../components/RobustPdfExportButton";
import MarkdownRenderer from "../../blocks/ResearchComparison/MarkdownRenderer";
import ResearchGPTTableRenderer from "../../components/ResearchGPTTableRenderer";
import { TimeCounter } from "../../blocks/ResearchComparison/components/TimeCounter";

// viewDashboard is attached to window by globalHandlers; avoid importing from barrel to prevent extra init
// Import global handlers to ensure they're initialized
import "../../lib/lightningModeHandlers/globalHandlers";
import "../../components/lightning-mode.css";



// Define the OnboardingData interface
interface OnboardingData {
  userId: string;
  currentStep: string;
  salesObjective?: string;
  userRole?: string;
  immediateGoal?: string;
  companyWebsite?: string;
  marketFocus?: "B2B" | "B2C" | "B2G";
  companyInfo?: {
    industry: string;
    revenueSize: string;
    employeeSize: string;
  };
  // New multi-select industries from onboarding
  targetIndustries?: string[];
  targetTitles?: string[];
  targetRegion?: string;
  targetLocation?: string;
  targetEmployeeSize?: string; // Target company size the user wants to reach
  // targetIndustry?: string; // removed; use targetIndustries only
  hasTargetList?: boolean;
  contactListStatus?: {
    isUpToDate: boolean;
    isVerified: boolean;
    needsEnrichment: boolean;
  };
  outreachChannels?: string[];
  leadHandlingCapacity?: number;
  currentLeadGeneration?: number;
  budget?: string;
  completedAt?: string;
  [key: string]: unknown; // Index signature to allow Record<string, unknown> compatibility
}

// Define interface for lead generation questions
interface LeadGenQuestions {
  industry: string;
  competitorBasis: string;
  region: string;
  clientType: string;
}

// Define StepData interface to match OnboardingFlow component
interface StepData {
  salesObjective?: string;
  userRole?: string;
  immediateGoal?: string;
  companyWebsite?: string;
  marketFocus?: "B2B" | "B2C" | "B2G";
  companyInfo?: {
    industry: string;
    revenueSize: string;
    employeeSize: string;
  };
  completedAt?: string;
}

// Import prompts and messages
import {
  createCompanyAnalysisPrompt,
  createICPResearchPrompt,
  createTabularLeadsPrompt,
  createLeadGenQuestionPrompt,
  createWelcomeMessage,
  createICPQuestionMessage,
  createICPCreationMessage,
  createLeadsGenerationMessage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createResearchMessage,
  createFallbackMessage,
  createCompanyAnalysisFallback,
  createLeadsGenerationFallback,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createTabularLeadsFallback,
  icpCreationFallbackMessage,
  createLeadsResultMessage,
} from "../../prompts";

// Type definitions
type ModeType = "lightning" | "focus" | "research" | "brain" | "explore";
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  lightningMode?: any;
  data?: {
    content: string;
    type: string;
    isHTML?: boolean;
    isStructuredData?: boolean;
    structuredData?: any;
  };
};
type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  mode?: "lightning" | "focus" | "research" | "brain" | "explore";
};

// Helper: derive a clean chat title from onboarding website
function getCompanyWebsiteTitle(data?: OnboardingData | null): string {
  const websiteRaw = (data && (data as OnboardingData).companyWebsite) || "";
  const cleaned = extractDomainFromUrl(websiteRaw);
  return cleaned || "Focus Chat";
}

function extractDomainFromUrl(url: string): string {
  if (!url) return "";
  let input = url.trim();
  if (!/^https?:\/\//i.test(input)) input = `https://${input}`;
  try {
    const u = new URL(input);
    let host = u.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    return host;
  } catch {
    return input
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .toLowerCase();
  }
}



// Chat Message Component - Built from scratch for clean rendering
interface ChatMessageProps {
  message: ChatMessage;
  isLatestMessage: boolean;
  isTyping: boolean;
  displayedResult: string;
  isLoading?: boolean;
  isResearchLoading?: boolean;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = React.memo(
  ({
  message, 
  isLatestMessage, 
  isTyping, 
  displayedResult,
    isLoading = false,
    isResearchLoading = false,
}) => {
    const isUser = message.role === "user";
  const showTypingEffect = isTyping && isLatestMessage && !isUser;
  const showLoadingEffect = isLoading && isLatestMessage && !isUser;
  
  // Grounded minimal message (from /api/gemini/direct)
  const isGroundedMessage = !isUser && (
    (typeof message.content === 'string' && message.content.includes('data-grounded')) ||
    (message as any)?.lightningMode?.type === 'grounded'
  );
  
  // Check if this is a research result message or if research is currently loading
  const isResearchResult = !isUser && (
    isResearchLoading || 
    message.content.includes("# 🔍 ResearchGPT Analysis") || 
    message.content.includes("# 🔍 Multi-GPT Research Analysis")
  );
  
  // Check if this is a Lightning Mode message
  const isLightningModeMessage = !isUser && message.lightningMode;
  
  // Debug Lightning mode detection
  if (!isUser && message.lightningMode) {
    console.log('🔍 Lightning mode message detected:', {
      messageId: message.id,
      hasLightningMode: !!message.lightningMode,
      lightningModeType: message.lightningMode.type,
      lightningModeStep: message.lightningMode.step,
      contentPreview: message.content.substring(0, 100) + '...'
    });
  }
  
  return (
      <div
        className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
      >
        <div
          className={`
        ${isUser ? "p-3 rounded-lg max-w-xl chat-message-user" : "max-w-3xl"} min-w-0 
      `}
        >
        {/* Only show SalesCentriAI label for assistant messages that are not loading/placeholder */}
        
          <div
            className={`${isUser ? "font-normal" : "font-light"} text-sm tracking-normal break-words`}
          >
          {isUser ? (
            message.content
          ) : showLoadingEffect ? (
            <div className="ai-loading">
              <span>Researching</span>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : showTypingEffect ? (
            <>
              <div 
                  dangerouslySetInnerHTML={{ __html: displayedResult || "" }}
                className="prose prose-invert max-w-none markdown-style text-sm"
                style={{ 
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    maxWidth: "100%",
                    overflowX: "hidden",
                }}
              />
              {isTyping && <span className="typing-cursor" />}
            </>
          ) : (
            <>
                <div className="mb-1.5"></div>
              {isGroundedMessage ? (
                <div className="text-white leading-relaxed prose prose-invert max-w-none overflow-x-auto" style={{ width: '100%', minWidth: '100%', overflowX: 'auto' }}>
                  <div 
                    dangerouslySetInnerHTML={{ __html: message.content }}
                    className="prose prose-invert max-w-none markdown-style text-sm"
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word', maxWidth: '100%' }}
                  />
                </div>
              ) : isResearchResult ? (
                <div className="research-chat-container bg-gradient-to-r from-blue-950/20 to-purple-950/20 rounded-xl p-4 sm:p-6 border border-blue-400/20 backdrop-blur-sm shadow-lg max-w-full overflow-hidden">
                  {/* Research Header */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-400/20">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Atom size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Research GPT : Comprehensive Analysis
                      </h3>
                      <p className="text-xs text-blue-300">AI-powered research results</p>
                    </div>
                  </div>
                  
                  {/* Time Counter for Research Progress - positioned below header, only visible while loading */}
                  {isResearchLoading && (
                    <div className="mb-4">
                      <TimeCounter isRunning={isResearchLoading} variant="inline" />
                    </div>
                  )}
                  
                  <div className="relative">
                    
                    <div className="text-white leading-relaxed prose prose-invert max-w-none" style={{ width: '100%', minWidth: '100%', overflow: 'visible' }}>
                      <ResearchGPTTableRenderer 
                        markdown={message.content.replace(/^#\s*🔍\s*ResearchGPT Analysis\s*\n*/m, '')} 
                        hideTopToolbar={true} 
                      />
                      {/* Enhanced scroll hint for wide tables */}
                      
                    </div>
                  </div>
                  
                  {/* Export buttons for research results - Only show when research is complete */}
                  {!isLoading && !message.content.includes("Starting research") && !message.content.includes("Please wait while I analyze") && (
                  <div className="mt-4 pt-4">
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <ResearchTxtExportButton
                        query="ResearchGPT Analysis"
                        result={message.content}
                        modelName="ResearchGPT"
                        fileName="Sales_Centri_ResearchGPT_analysis.txt"
                        className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      />
                      <SingleModelExcelExportButton
                        data={message.content}
                        filename="Sales_Centri_ResearchGPT_analysis"
                        title="Export to Excel"
                        className="px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      />
                      <RobustPdfExportButton
                        userQuery="ResearchGPT Analysis"
                        botResponse={message.content}
                        fileName="Sales_Centri_ResearchGPT_analysis.pdf"
                        buttonText="Export PDF"
                        className="px-4 py-2 text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      />
                      <CopyToClipboardButton
                        content={message.content}
                        className="px-4 py-2 text-sm bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                  )}
                </div>
              ) : isLightningModeMessage ? (
                <div className="text-white leading-relaxed prose prose-invert max-w-none overflow-x-auto" style={{ width: '100%', minWidth: '100%' }}>
                    {(() => {
                      // Check if content contains JSON objects that need to be parsed
                      if (message.content.includes('{"type":"dashboard_button"') || message.content.includes('{"type":"disclaimer"')) {
                        // Parse and render JSON objects as components
                        const jsonObjects = message.content.match(/\{[^}]*"type":"(dashboard_button|disclaimer)"[^}]*\}/g) || [];
                        const otherContent = message.content.replace(/\{[^}]*"type":"(dashboard_button|disclaimer)"[^}]*\}/g, '').trim();
                        
                        
                        return (
                          <>
                            {/* Render non-JSON content */}
                            {otherContent && (
                              <div 
                                dangerouslySetInnerHTML={{ __html: otherContent }} 
                                className="prose prose-invert max-w-none markdown-style text-sm"
                                style={{ 
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                  maxWidth: "100%",
                                  overflowX: "hidden",
                                }}
                                ref={(el) => {
                                  if (el && (otherContent.includes("lightning-excel-export-button") || otherContent.includes("lightning-excel-export-button-header"))) {
                                    setTimeout(() => {
                                      // Try to find the header button first, then fallback to the old one
                                      let excelButtonPlaceholder = el.querySelector("#lightning-excel-export-button-header");
                                      if (!excelButtonPlaceholder) {
                                        excelButtonPlaceholder = el.querySelector("#lightning-excel-export-button");
                                      }
                                      
                                      if (excelButtonPlaceholder) {
                                        const content = excelButtonPlaceholder.getAttribute("data-content");
                                        if (content) {
                                          // Create React root and render Excel export button
                                          import('react-dom/client').then(({ createRoot }) => {
                                            const root = createRoot(excelButtonPlaceholder);
                                            root.render(
                                              <SingleModelExcelExportButton
                                                data={content}
                                                filename="Sales_Centri_Lightning_Mode_prospects"
                                                title="Export Prospects to Excel"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                                              />
                                            );
                                          }).catch(console.error);
                                        }
                                      }
                                    }, 100);
                                  }
                                }}
                              />
                            )}
                            
                            {/* Render JSON objects as components - disclaimer first, then dashboard button */}
                            {jsonObjects
                              .sort((a, b) => {
                                try {
                                  const dataA = JSON.parse(a);
                                  const dataB = JSON.parse(b);
                                  // Sort: disclaimer first (0), dashboard_button second (1)
                                  const orderA = dataA.type === 'disclaimer' ? 0 : 1;
                                  const orderB = dataB.type === 'disclaimer' ? 0 : 1;
                                  return orderA - orderB;
                                } catch {
                                  return 0;
                                }
                              })
                              .map((jsonStr, index) => {
                              try {
                                const data = JSON.parse(jsonStr);
                                if (data.type === 'disclaimer') {
                                  return (
                                    <div key={index} className="lightning-disclaimer-container" style={{
                                      margin: '24px 0',
                                      padding: '20px',
                                      background: 'rgba(156, 163, 175, 0.1)',
                                      borderRadius: '12px',
                                      borderLeft: '4px solid #6B7280',
                                      clear: 'both'
                                    }}>
                                      <p style={{
                                        color: '#6B7280',
                                        fontSize: '14px',
                                        margin: '0',
                                        lineHeight: '1.5'
                                      }}>
                                        <strong>{data.title}</strong> {data.text}
                                      </p>
                                    </div>
                                  );
                                } else if (data.type === 'dashboard_button') {
                                  return (
                                    <div key={index} className="lightning-dashboard-container" style={{
                                      margin: '32px 0',
                                      textAlign: 'center',
                                      clear: 'both',
                                      paddingTop: '24px',
                                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))',
                                      borderRadius: '12px',
                                      padding: '24px'
                                    }}>
                                      <p style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#60a5fa',
                                        marginBottom: '16px'
                                      }}>
                                        {data.title}
                                      </p>
                                      <a 
                                        href={data.buttonUrl}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{
                                          display: 'inline-block',
                                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                          color: 'white',
                                          padding: '16px 32px',
                                          border: 'none',
                                          borderRadius: '12px',
                                          fontWeight: '600',
                                          textDecoration: 'none',
                                          fontSize: '16px',
                                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                          transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.transform = 'translateY(-2px)';
                                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.transform = 'translateY(0)';
                                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                        }}
                                      >
                                        {data.buttonText}
                                      </a>
                                    </div>
                                  );
                                }
                              } catch (error) {
                                console.error('Error parsing JSON object:', error, jsonStr);
                                return null;
                              }
                              return null;
                            })}
                          </>
                        );
                      }
                      
                      // Check if content contains hybrid Markdown + HTML (company summary format)
                      if (message.content.includes('<div class="target-audience-section">')) {
                        // Split content into Markdown and HTML parts
                        const htmlStartIndex = message.content.indexOf('<div class="target-audience-section">');
                        const markdownContent = message.content.substring(0, htmlStartIndex);
                        const htmlContent = message.content.substring(htmlStartIndex);
                        
                        return (
                          <>
                            {/* Render Markdown part with MarkdownRenderer */}
                            <MarkdownRenderer markdown={markdownContent} hideTopToolbar={true} />
                            
                            {/* Render HTML part with dangerouslySetInnerHTML */}
                            <div 
                              dangerouslySetInnerHTML={{ __html: htmlContent }} 
                              className="prose prose-invert max-w-none markdown-style text-sm"
                              style={{ 
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                maxWidth: "100%",
                                overflowX: "hidden",
                              }}
                              ref={(el) => {
                                if (el && htmlContent.includes("<button")) {
                                  // Add event listeners to buttons after they're rendered
                                  // Use a longer timeout to ensure buttons are fully rendered after reload
                                  setTimeout(() => {
                                    const buttons = el.querySelectorAll("button");
                                    console.log("🔘 LIGHTNING MODE FOUND BUTTONS:", buttons.length);
                                    buttons.forEach((button, index) => {
                                      // Remove any existing listeners to prevent duplicates
                                      const newButton = button.cloneNode(true) as HTMLButtonElement;
                                      button.parentNode?.replaceChild(newButton, button);
                                      
                                      const onclick = newButton.getAttribute("onclick");
                                      if (onclick) {
                                        console.log(`🔘 LIGHTNING MODE BUTTON ${index} onclick:`, onclick);
                                        // Set up button click handler
                                        newButton.addEventListener('click', (e) => {
                                          e.preventDefault();
                                          console.log(`🔘 LIGHTNING MODE BUTTON ${index} clicked!`);
                                          // Execute the onclick function
                                          try {
                                            eval(onclick);
                                          } catch (error) {
                                            console.error('Error executing button onclick:', error);
                                          }
                                        });
                                      }
                                    });
                                  }, 300); // Increased timeout for reload scenarios
                                }
                              }}
                            />
                          </>
                        );
                      } else if (message.content.includes('<table') || message.content.includes('<div class="lead-grid">') || message.content.includes('<div class="lightning-dashboard-container">') || message.content.includes('<div class="lightning-disclaimer-container">') || message.content.includes('<div class="lightning-error-message"') || (message.data?.isHTML) || (message.data?.type === 'icp') || (message.data?.type === 'prospects') || (message.data?.type === 'lightning_leads') || (message.data?.type === 'lightning_dashboard_button') || (message.data?.type === 'lightning_disclaimer') || (message.data?.type === 'error') || (message.lightningMode && (message.content.includes('Let\'s Personalize Your Sales Strategy') || message.content.includes('Q1. Which product or service') || message.content.includes('Q2. Outreach Preference') || message.content.includes('Q3. Lead Handoff Preference')))) {
                        // Pure HTML content
                        return (
                      <div 
                        dangerouslySetInnerHTML={{ __html: message.content }} 
                        className="prose prose-invert max-w-none markdown-style text-sm"
                        style={{ 
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          maxWidth: "100%",
                          overflowX: "hidden",
                        }}
                        ref={(el) => {
                          if (el) {
                            // Skip export/button injection for grounded responses
                            if (el.querySelector('[data-grounded]')) {
                              return;
                            }
                            // Handle Excel export button placeholder
                            if (message.content.includes("lightning-excel-export-button") || message.content.includes("lightning-excel-export-button-header")) {
                              setTimeout(() => {
                                // Try to find the header button first, then fallback to the old one
                                let excelButtonPlaceholder = el.querySelector("#lightning-excel-export-button-header");
                                if (!excelButtonPlaceholder) {
                                  excelButtonPlaceholder = el.querySelector("#lightning-excel-export-button");
                                }
                                if (excelButtonPlaceholder) {
                                  const content = excelButtonPlaceholder.getAttribute("data-content");
                                  if (content) {
                                    // Create React root and render Excel export button
                                    import('react-dom/client').then(({ createRoot }) => {
                                      const root = createRoot(excelButtonPlaceholder);
                                      root.render(
                                        <SingleModelExcelExportButton
                                          data={content}
                                          filename="Sales_Centri_Lightning_Mode_prospects"
                                          title="Export Prospects to Excel"
                                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                                        />
                                      );
                                    }).catch(console.error);
                                  }
                                }
                              }, 100);
                            }
                            
                            // Add event listeners to buttons after they're rendered
                            if (message.content.includes("<button")) {
                              setTimeout(() => {
                                const buttons = el.querySelectorAll("button");
                                console.log("🔘 LIGHTNING MODE FOUND BUTTONS:", buttons.length);
                                buttons.forEach((button, index) => {
                                  const onclick = button.getAttribute("onclick");
                                  if (onclick) {
                                    console.log(`🔘 LIGHTNING MODE BUTTON ${index} onclick:`, onclick);
                                    // Set up button click handler
                                    button.addEventListener('click', (e) => {
                                      e.preventDefault();
                                      console.log(`🔘 LIGHTNING MODE BUTTON ${index} clicked!`);
                                      // Execute the onclick function
                                      try {
                                        eval(onclick);
                                      } catch (error) {
                                        console.error('Error executing button onclick:', error);
                                      }
                                    });
                                  }
                                });
                              }, 100);
                            }
                          }
                        }}
                      />
                        );
                      } else if ((message.data as any)?.isStructuredData && (message.data as any)?.structuredData) {
                        // Render structured data as React components
                        const data = (message.data as any).structuredData;
                        console.log('🔍 Rendering structured data:', data);
                        
                        if (data.type === 'disclaimer') {
                          return (
                            <div className="lightning-disclaimer-container" style={{
                              margin: '24px 0',
                              padding: '20px',
                              background: 'rgba(156, 163, 175, 0.1)',
                              borderRadius: '12px',
                              borderLeft: '4px solid #6B7280',
                              clear: 'both'
                            }}>
                              <p style={{
                                color: '#6B7280',
                                fontSize: '14px',
                                margin: '0',
                                lineHeight: '1.5'
                              }}>
                                <strong>{data.title}</strong> {data.text}
                              </p>
                            </div>
                          );
                        } else if (data.type === 'dashboard_button') {
                          return (
                            <div className="lightning-dashboard-container" style={{
                              margin: '32px 0',
                              textAlign: 'center',
                              clear: 'both',
                              paddingTop: '24px',
                              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))',
                              borderRadius: '12px',
                              padding: '24px'
                            }}>
                              <p style={{
                                fontSize: '18px',
                                fontWeight: '600',
                                color: '#60a5fa',
                                marginBottom: '16px'
                              }}>
                                {data.title}
                              </p>
                              <a 
                                href={data.buttonUrl}
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-block',
                                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                  color: 'white',
                                  padding: '16px 32px',
                                  border: 'none',
                                  borderRadius: '12px',
                                  fontWeight: '600',
                                  textDecoration: 'none',
                                  fontSize: '16px',
                                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                  transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                }}
                              >
                                {data.buttonText}
                              </a>
                            </div>
                          );
                        }
                      } else if (message.content.includes('"type":"dashboard_button"') || message.content.includes('"type":"disclaimer"')) {
                        // Fallback: Parse JSON content and render as components
                        try {
                          const data = JSON.parse(message.content);
                          console.log('🔍 Parsing JSON content as fallback:', data);
                          
                          if (data.type === 'disclaimer') {
                            return (
                              <div className="lightning-disclaimer-container" style={{
                                margin: '24px 0',
                                padding: '20px',
                                background: 'rgba(156, 163, 175, 0.1)',
                                borderRadius: '12px',
                                borderLeft: '4px solid #6B7280',
                                clear: 'both'
                              }}>
                                <p style={{
                                  color: '#6B7280',
                                  fontSize: '14px',
                                  margin: '0',
                                  lineHeight: '1.5'
                                }}>
                                  <strong>{data.title}</strong> {data.text}
                                </p>
                              </div>
                            );
                          } else if (data.type === 'dashboard_button') {
                            return (
                              <div className="lightning-dashboard-container" style={{
                                margin: '32px 0',
                                textAlign: 'center',
                                clear: 'both',
                                paddingTop: '24px',
                                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))',
                                borderRadius: '12px',
                                padding: '24px'
                              }}>
                                <p style={{
                                  fontSize: '18px',
                                  fontWeight: '600',
                                  color: '#60a5fa',
                                  marginBottom: '16px'
                                }}>
                                  {data.title}
                                </p>
                                <a 
                                  href={data.buttonUrl}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-block',
                                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                    color: 'white',
                                    padding: '16px 32px',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                                  }}
                                >
                                  {data.buttonText}
                                </a>
                              </div>
                            );
                          }
                        } catch (error) {
                          console.error('🔍 Error parsing JSON content:', error);
                        }
                      } else if (message.content.includes('<div class="lightning-dashboard-container">') || message.content.includes('<div class="lightning-disclaimer-container">')) {
                        // Additional check for button and disclaimer containers
                        console.log('🔍 Rendering button/disclaimer HTML content (fallback):', {
                          type: message.data?.type,
                          contentPreview: message.content.substring(0, 100)
                        });
                        return (
                          <div 
                            dangerouslySetInnerHTML={{ __html: message.content }} 
                            className="prose prose-invert max-w-none markdown-style text-sm"
                            style={{ 
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              maxWidth: "100%",
                              overflowX: "hidden",
                            }}
                          />
                        );
                      } else {
                        // Pure Markdown content
                        return <MarkdownRenderer markdown={message.content} hideTopToolbar={true} />;
                      }
                    })()}
                    </div>
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: message.content }} 
                  className="prose prose-invert max-w-none markdown-style text-sm"
                  style={{ 
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      maxWidth: "100%",
                      overflowX: "hidden",
                  }}
                  ref={(el) => {
                    if (el && message.content.includes("<button")) {
                    // Add event listeners to buttons after they're rendered
                    setTimeout(() => {
                        const buttons = el.querySelectorAll("button");
                        console.log("🔘 FOUND BUTTONS:", buttons.length);
                      buttons.forEach((button, index) => {
                          const onclick = button.getAttribute("onclick");
                        if (onclick) {
                          console.log(`🔘 BUTTON ${index} onclick:`, onclick);
                          // Prevent the raw inline onclick from firing in addition to our listener
                            button.removeAttribute("onclick");
                          // Avoid binding multiple times across re-renders
                            if (
                              (button as HTMLButtonElement).dataset.bound ===
                              "1"
                            ) {
                            return;
                          }
                            (button as HTMLButtonElement).dataset.bound = "1";
                            button.addEventListener("click", (e) => {
                            e.preventDefault();
                              console.log("🔘 BUTTON CLICKED:", onclick);
                            // Execute the onclick function
                              if (onclick.includes("handleICPResponse")) {
                                const match = onclick.match(
                                  /handleICPResponse\('([^']+)'\)/
                                );
                              if (match) {
                                  const response = match[1] as "yes" | "no";
                                  console.log(
                                    "🔘 CALLING handleICPResponse with:",
                                    response
                                  );
                                if (window.handleICPResponse) {
                                  window.handleICPResponse(response);
                                } else {
                                    console.error(
                                      "🔘 handleICPResponse not available on window"
                                    );
                                  }
                                }
                              } else if (
                                onclick.includes("startLeadGenQuestions")
                              ) {
                                if (
                                  typeof window.startLeadGenQuestions ===
                                  "function"
                                ) {
                                window.startLeadGenQuestions();
                              } else {
                                  console.error(
                                    "🔘 startLeadGenQuestions not available on window"
                                  );
                                }
                              } else if (
                                onclick.includes("handleLeadGenAnswer")
                              ) {
                                const match = onclick.match(
                                  /handleLeadGenAnswer\('([^']+)'\s*,\s*'([^']+)'\s*,\s*(\d+)\)/
                                );
                              if (match) {
                                const key = match[1];
                                const answer = match[2];
                                const nextStep = Number(match[3]);
                                  if (
                                    typeof window.handleLeadGenAnswer ===
                                    "function"
                                  ) {
                                    window.handleLeadGenAnswer(
                                      key,
                                      answer,
                                      nextStep
                                    );
                                } else {
                                    console.error(
                                      "🔘 handleLeadGenAnswer not available on window"
                                    );
                                  }
                              }
                              } else if (
                                onclick.includes("selectOption")
                              ) {
                                // Handle selectOption clicks
                                const match = onclick.match(
                                  /selectOption\('([^']+)'\)/
                                );
                                if (match) {
                                  const option = match[1];
                                  if (window.selectOption) {
                                    window.selectOption(option);
                                }
                              }
                              } else if (
                                onclick.includes("handleQ1Response")
                              ) {
                                const match = onclick.match(
                                  /handleQ1Response\('([^']+)'\)/
                                );
                                if (match) {
                                  const productFocus = match[1];
                                  console.log(
                                    "🔘 CALLING handleQ1Response with:",
                                    productFocus
                                  );
                                  if (typeof (window as any).handleQ1Response === "function") {
                                    (window as any).handleQ1Response(productFocus);
                                  } else {
                                    console.error(
                                      "🔘 handleQ1Response not available on window"
                                    );
                                  }
                                }
                              } else if (
                                onclick.includes("handleQ2Response")
                              ) {
                                const match = onclick.match(
                                  /handleQ2Response\('([^']+)'\)/
                                );
                                if (match) {
                                  const outreachPreference = match[1];
                                  console.log(
                                    "🔘 CALLING handleQ2Response with:",
                                    outreachPreference
                                  );
                                  if (typeof (window as any).handleQ2Response === "function") {
                                    (window as any).handleQ2Response(outreachPreference);
                                  } else {
                                    console.error(
                                      "🔘 handleQ2Response not available on window"
                                    );
                                  }
                                }
                              } else if (
                                onclick.includes("handleQ3Response")
                              ) {
                                const match = onclick.match(
                                  /handleQ3Response\('([^']+)'\)/
                                );
                                if (match) {
                                  const leadHandoffPreference = match[1];
                                  console.log(
                                    "🔘 CALLING handleQ3Response with:",
                                    leadHandoffPreference
                                  );
                                  if (typeof (window as any).handleQ3Response === "function") {
                                    (window as any).handleQ3Response(leadHandoffPreference);
                                  } else {
                                    console.error(
                                      "🔘 handleQ3Response not available on window"
                                    );
                                  }
                                }
                              } else if (
                                onclick.includes("openResearchWebsitePrompt")
                              ) {
                                // Handle openResearchWebsitePrompt
                                console.log("🔘 CALLING openResearchWebsitePrompt");
                                if (
                                  typeof (window as any).openResearchWebsitePrompt ===
                                  "function"
                                ) {
                                  (window as any).openResearchWebsitePrompt();
                                } else {
                                  console.error(
                                    "🔘 openResearchWebsitePrompt not available on window"
                                  );
                                }
                              } else if (
                                onclick.includes("window.location.href")
                              ) {
                                // Handle window.location.href redirects
                                const match = onclick.match(
                                  /window\.location\.href\s*=\s*['"]([^'"]+)['"]/
                                );
                                if (match) {
                                  const url = match[1];
                                  console.log("🔗 Redirecting to:", url);
                                  window.location.href = url;
                                } else {
                                  console.error("🔗 Could not parse redirect URL");
                                }
                            }
                          });
                        }
                      });
                    }, 100);
                  }
                  // Inject export bar near the lead results CTA/disclaimer
                  try {
                    const existingBar = el && el.querySelector('[data-lead-export-bar]');
                    const hasAnchor = el && Array.from(el.querySelectorAll('a')).some((a) => (a.textContent || '').includes('View Dashboard'));
                    const hasDisclaimer = el && el.querySelector('.lead-disclaimer');
                    const hasAnyTable = el && el.querySelector('table');
                    if (el && (hasAnchor || hasDisclaimer || hasAnyTable) && !existingBar && !el.hasAttribute('data-export-injected')) {
                      const bar = document.createElement('div');
                      bar.setAttribute('data-lead-export-bar', '1');
                      bar.style.display = 'flex';
                      bar.style.gap = '8px';
                      bar.style.margin = '12px 0';
                      bar.style.flexWrap = 'wrap';
                      bar.innerHTML = `
                        <button id="lead_export_excel" style="background:#10b981;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">Export Excel</button>
                        <button id="lead_export_pdf" style="background:#ef4444;color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;">Export PDF</button>
                      `;
                      // Preferred placement: directly above the "View Dashboard" CTA
                      const ctaAnchor = Array.from(el.querySelectorAll('a')).find((a) =>
                        (a.textContent || '').includes('View Dashboard')
                      ) as HTMLAnchorElement | undefined;
                      const ctaContainer = ctaAnchor ? (ctaAnchor.closest('div') as HTMLElement | null) : null;

                      if (ctaContainer && ctaContainer.parentElement) {
                        ctaContainer.parentElement.insertBefore(bar, ctaContainer);
                      } else {
                        // Secondary placement: right after the disclaimer
                        const disclaimer = el.querySelector('.lead-disclaimer') as HTMLElement | null;
                        if (disclaimer && disclaimer.parentElement) {
                          disclaimer.parentElement.insertBefore(bar, disclaimer.nextSibling);
                        } else {
                          // Fallback: after the table if present, else append to container
                          const firstTable = el.querySelector('table.lead-table');
                          if (firstTable && firstTable.parentElement) {
                            firstTable.parentElement.parentElement?.insertBefore(bar, firstTable.parentElement.nextSibling);
                          } else {
                            el.appendChild(bar);
                          }
                        }
                      }

                      // Ensure disclaimer exists and is immediately after the export bar
                      let disclaimerEl = el.querySelector('.lead-disclaimer') as HTMLElement | null;
                      if (!disclaimerEl) {
                        const p = document.createElement('p');
                        p.className = 'lead-disclaimer';
                        p.style.margin = '8px 0 16px 0';
                        p.style.fontSize = '12px';
                        p.style.lineHeight = '1.5';
                        p.style.color = '#9ca3af';
                        p.innerHTML = '<strong>Disclaimer:</strong> Access to complete and verified information requires a user account (Sign up). Some data currently displayed may be heuristic or placeholder. We strictly adhere to and comply with GDPR, CCPA, CPRA, and other applicable data privacy regulations. By signing up, you agree to our Terms of Service and Privacy Policy.';
                        bar.parentElement?.insertBefore(p, bar.nextSibling);
                        disclaimerEl = p;
                      } else if (disclaimerEl.parentElement !== bar.parentElement || disclaimerEl.previousSibling !== bar) {
                        // Move existing disclaimer to appear right after the export bar
                        disclaimerEl.parentElement?.removeChild(disclaimerEl);
                        bar.parentElement?.insertBefore(disclaimerEl, bar.nextSibling);
                      }

                      const htmlContent = message.content;
                      const excelBtn = bar.querySelector('#lead_export_excel');
                      const pdfBtn = bar.querySelector('#lead_export_pdf');
                      excelBtn?.addEventListener('click', () => {
                        window.dispatchEvent(new CustomEvent('sc_export_excel', { detail: { data: htmlContent, source: 'lead-table' } }));
                      });
                      pdfBtn?.addEventListener('click', () => {
                        window.dispatchEvent(new CustomEvent('sc_export_pdf', { detail: { data: htmlContent, source: 'lead-table' } }));
                      });
                      // mark to avoid duplicate injections on re-render
                      el.setAttribute('data-export-injected', '1');
                    }
                  } catch (e) {
                    console.error('Export bar injection failed:', e);
                  }
                }}
              />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});
ChatMessageComponent.displayName = "ChatMessageComponent";
// Memoized LightRays background component
const MemoizedLightRaysBackground = React.memo(
  function MemoizedLightRaysBackground() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <LightRays
        raysOrigin="top-center"
        raysColor="#00ffff"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.1}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
    </div>
  );
  }
);

interface SalesConsultantUIProps {
  initialChatId?: string;
}

const SalesConsultantUI: React.FC<SalesConsultantUIProps> = ({
  initialChatId: propsChatId,
}) => {
  const router = useRouter();
  const params = useParams();
  const {
    trackLandingToPSAQuery,
    trackQuery,
    trackRedirectFromLogin,
    trackCustomEvent,
  } = useTracker();
  const [hasTrackedLanding, setHasTrackedLanding] = useState(false);
  const [queryCount, setQueryCount] = useState(0);

  // Ensure anonymous user is created ASAP for first-message performance
  useEffect(() => {
    (async () => {
      try {
        await chatApi.ensureAnonymousUser();
      } catch (e) {
        console.error("Failed to ensure anonymous user early:", e);
      }
    })();
  }, []);
  
  // Get initialChatId from props first, then URL params as fallback
  const urlChatId = params.chatId as string;
  const initialChatId = propsChatId || urlChatId;
  
  // Get message from query parameters (from homepage redirect)
  
  // Sidebar state
  const [sidebarExtended, setSidebarExtended] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Dummy user for now
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [icpQuestionSent, setIcpQuestionSent] = useState<boolean>(false);
  const [leadGenMessageSent, setLeadGenMessageSent] = useState<boolean>(false);
  const leadGenMessageLockRef = useRef<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [recentPrompt, setRecentPrompt] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [result, setResult] = useState<string>("");
  const [displayedResult, setDisplayedResult] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState(false); // New state for hover
  const [isPaused, setIsPaused] = useState(false); // New state for pause control
  const [inputRows, setInputRows] = useState(1);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  // Duplicate-prevention refs
  const icpHandlingRef = useRef<boolean>(false);
  const leadGenStartedRef = useRef<boolean>(false);
  const leadGenMessageSentRef = useRef<boolean>(false);
  
  // New function to handle placeholder click - only for desktop
  const handlePlaceholderClick = () => {
    // Only allow placeholder click on desktop (sm and up)
    if (typeof window !== "undefined") {
      // sm breakpoint
      console.log(
        "🖱️ Placeholder clicked, input length:",
        input.length,
        "currentPlaceholder:",
                currentPlaceholder
      );
      if (input.length === 0) {
        // Only if input is empty
                const currentQuestion = placeholderQuestions[currentPlaceholder];
        console.log(
          "🖱️ Setting input to:",
          currentQuestion.response
        );
        setInput(currentQuestion.response);
        setIsPaused(true); // Pause the rotation
      }
    }
  };
  
  // Reset pause when input is cleared
  useEffect(() => {
    if (input.length === 0) {
      setIsPaused(false);
    }
  }, [input]);

  // Calculate input rows for textarea
  useEffect(() => {
    // Only grow after 60 chars per row, minimum 1 row
    const charsPerRow = 80;
    const rows = Math.min(
      6,
      Math.max(1, Math.ceil(input.length / charsPerRow))
    );
    setInputRows(rows);
  }, [input]);
  
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<ModeType>("explore"); // Default to explore mode in PSA
  const [isInitialRestoration, setIsInitialRestoration] = useState(true); // Track if we're in initial restoration phase
  // Debug: Log activeMode changes (parity with homepage)
  useEffect(() => {
    console.log('🔍 activeMode changed to:', activeMode);
  }, [activeMode]);
  // Guard to prevent duplicate Lightning Mode entries per chat
  const lightningEntryGuardRef = useRef<Set<string>>(new Set());

  const hasLightningEntryFired = useCallback((chatId?: string | null): boolean => {
    if (!chatId) return false;
    return (
      lightningEntryGuardRef.current.has(chatId) ||
      localStorage.getItem(`lightning_entry_fired_${chatId}`) === 'true'
    );
  }, []);

  const markLightningEntryFired = useCallback((chatId?: string | null) => {
    if (!chatId) return;
    lightningEntryGuardRef.current.add(chatId);
    localStorage.setItem(`lightning_entry_fired_${chatId}`, 'true');
  }, []);

  const sanitizeLightningInputs = useCallback((data: any): any => {
    const sanitized = { ...(data || {}) } as any;
    const rawWebsite = sanitized.website_url;
    if (
      typeof rawWebsite === 'string' &&
      /\[?\s*company\s+website\s+url\s*\]?/i.test(rawWebsite.trim())
    ) {
      sanitized.website_url = null;
    }
    return sanitized;
  }, []);
  
  // Mode isolation tracking
  const [modeHistory, setModeHistory] = useState<{mode: ModeType, timestamp: number, chatId?: string}[]>([]);
  const [currentModeChat, setCurrentModeChat] = useState<string | null>(null);
  
  // Restore mode state from localStorage on mount
  useEffect(() => {
    // Check if coming from homepage with activeModePSA flag
    const psaMode = localStorage.getItem('activeModePSA');
    if (psaMode) {
      console.log('🔍 Found activeModePSA flag from homepage:', psaMode);
      setActiveMode(psaMode as ModeType);
      localStorage.removeItem('activeModePSA');
      setIsInitialRestoration(false);
      return;
    }
    
    // Check for research mode metadata from homepage (ResearchGPT)
    const researchMetaData = localStorage.getItem("researchMeta");
    if (researchMetaData) {
      try {
        const researchMeta = JSON.parse(researchMetaData);
        if (researchMeta.mode === "research") {
          console.log('🔍 Found ResearchGPT mode from homepage, preserving research mode');
          setActiveMode("research");
          setIsInitialRestoration(false);
          return;
        }
      } catch (e) {
        console.error('Error parsing research metadata during restoration:', e);
      }
    }
    
    // Only restore saved mode when on a chat route; default to explore on PSA homepage
    const isChatRoute = typeof window !== 'undefined' && /\/solutions\/psa-suite-one-stop-solution\/c\//.test(window.location.pathname);
    const savedMode = isChatRoute ? (localStorage.getItem('activeMode') as ModeType) : undefined;
    const savedChatId = localStorage.getItem('currentModeChat');
    const savedTimestamp = localStorage.getItem('modeChangeTimestamp');
    
    // Preserve research mode if it was saved
    if (savedMode && savedMode === "research") {
      console.log(`🔄 MODE RESTORATION: Preserving research mode from localStorage`);
      setActiveMode("research");
      
      if (savedChatId) {
        setCurrentModeChat(savedChatId);
      }
      
      if (savedTimestamp) {
        setModeHistory(prev => [...prev, { 
          mode: savedMode, 
          timestamp: parseInt(savedTimestamp), 
          chatId: savedChatId || undefined 
        }]);
      }
      setIsInitialRestoration(false);
    } else if (savedMode && savedMode !== activeMode && savedMode !== "research") {
      // Only restore non-research modes if not already in research mode
      console.log(`🔄 MODE RESTORATION: Restoring mode ${savedMode} from localStorage`);
      setActiveMode(savedMode);
      
      if (savedChatId) {
        setCurrentModeChat(savedChatId);
      }
      
      if (savedTimestamp) {
        setModeHistory(prev => [...prev, { 
          mode: savedMode, 
          timestamp: parseInt(savedTimestamp), 
          chatId: savedChatId || undefined 
        }]);
      }
      setIsInitialRestoration(false);
    } else if (!isChatRoute) {
      // On PSA homepage (no chat), force explore mode and clear any persisted focus state
      // BUT preserve research mode if it exists
      if (activeMode !== 'explore' && activeMode !== 'research') {
        console.log('🔄 PSA HOMEPAGE: Forcing explore mode on base route');
        setActiveMode('explore');
      }
      // Don't clear activeMode if it's research mode
      if (activeMode !== 'research') {
        localStorage.removeItem('activeMode');
        localStorage.removeItem('currentModeChat');
      }
      setIsInitialRestoration(false);
    } else {
      setIsInitialRestoration(false);
    }
  }, []); // Only run on mount
  
  // Lightning Mode hook
  const lightningMode = useLightningMode();
  // Voice AI mode state
  const [voiceMode, setVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Scroll down arrow state
  const [showScrollDown, setShowScrollDown] = useState(false);
  // Chat history state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const chatSessionsRef = useRef<ChatSession[]>([]);
  const [chatsLoaded, setChatsLoaded] = useState(false);
  
  
  // Deduplication helper function
  const deduplicateChatSessions = useCallback(
    (sessions: ChatSession[]): ChatSession[] => {
    const seen = new Set<string>();
      return sessions.filter((session) => {
      if (seen.has(session.id)) {
          console.warn(
            "🚨 Duplicate chat session detected and removed:",
            session.id
          );
        return false;
      }
      seen.add(session.id);
      return true;
    });
    },
    []
  );
  
  // Enhanced setChatSessions with deduplication
  const setDeduplicatedChatSessions = useCallback(
    (updateFn: (prev: ChatSession[]) => ChatSession[]) => {
      setChatSessions((prev) => {
      const updated = updateFn(prev);
      const deduplicated = deduplicateChatSessions(updated);
      chatSessionsRef.current = deduplicated; // Update ref immediately
      return deduplicated;
    });
    },
    [deduplicateChatSessions]
  );
  
  // Keep ref in sync with state
  useEffect(() => {
    chatSessionsRef.current = chatSessions;
  }, [chatSessions]);
  
  // Force dark theme override for SalesGPT - ensure it works regardless of system theme
  useEffect(() => {
    // Set data attribute on document body to override any theme
    document.documentElement.setAttribute("data-salesgpt-theme", "dark");
    document.body.style.backgroundColor = "#0a0a0a";
    document.body.style.color = "#ffffff";
    
    // Override CSS color-scheme
    document.documentElement.style.colorScheme = "dark";
    
    // Force meta theme-color for mobile browsers
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeColorMeta) {
      themeColorMeta = document.createElement("meta");
      themeColorMeta.setAttribute("name", "theme-color");
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.setAttribute("content", "#0a0a0a");
    
    // Cleanup function to restore if component unmounts
    return () => {
      document.documentElement.removeAttribute("data-salesgpt-theme");
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", "");
      }
    };
  }, []);
  
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [processingChatId, setProcessingChatId] = useState<string | null>(null); // Track chat being processed
  const [isMessageInProgress, setIsMessageInProgress] = useState(false); // Track if message/typing is in progress
  // Loading state to prevent homepage flicker when loading from URL
  const [isInitializing, setIsInitializing] = useState(true);
  // Query limit gate state
  const [showQueryLimitGate, setShowQueryLimitGate] = useState(false);
  // ResearchGPT gate state
  const [showResearchGPTGate, setShowResearchGPTGate] = useState(false);
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  // Modal state for post-login CTA
  const [showLeadGenModal, setShowLeadGenModal] = useState(false);
  // Track if user just logged in with bearer token
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showExistingUserModal, setShowExistingUserModal] = useState(false);
  const [showFocusModeModal, setShowFocusModeModal] = useState(false);
  const [focusModalAlreadyShown, setFocusModalAlreadyShown] = useState(false);
  // Custom prompts state and modal
  const [customPrompts, setCustomPrompts] = useState<{ title: string; text: string }[]>([]);
  const [showAddPromptModal, setShowAddPromptModal] = useState(false);
  const [newCustomPromptTitle, setNewCustomPromptTitle] = useState("");
  const [newCustomPromptText, setNewCustomPromptText] = useState("");
  const [showWebsitePromptModal, setShowWebsitePromptModal] = useState(false);
  const [websitePromptBase, setWebsitePromptBase] = useState("");
  const [websiteBackendBase, setWebsiteBackendBase] = useState<string | null>(null);
  const [pendingBackendOverride, setPendingBackendOverride] = useState<string | null>(null);
  const [pendingVisibleOverride, setPendingVisibleOverride] = useState<string | null>(null);
  const [pendingTitleOverride, setPendingTitleOverride] = useState<string | null>(null);
  const [websiteInput, setWebsiteInput] = useState("");
  // Research → Lightning website confirmation flow
  const [showResearchWebsitePrompt, setShowResearchWebsitePrompt] = useState(false);
  const [researchWebsiteInput, setResearchWebsiteInput] = useState("");
  // Research flow state
  const [researchFlow, setResearchFlow] = useState<ResearchFlowState>({
    step: "normal_chat",
    isAutoProcessing: false,
  });
  
  // ResearchGPT configuration state
  const [showResearchConfig, setShowResearchConfig] = useState<boolean>(false);
  const [isChatResearch, setIsChatResearch] = useState<boolean>(false);
  const [isResearchLoading, setIsResearchLoading] = useState<boolean>(false);
  // Flag: next send should use direct Gemini+Google (sidebar-originated)
  const [forceGeminiOnlyNext, setForceGeminiOnlyNext] = useState<boolean>(false);
  const [researchConfig, setResearchConfig] = useState({
    category: 'sales_opportunities',
    depth: 'comprehensive',
    timeframe: '1Y',
    geoScope: 'Global',
    companySize: 'all',
    revenueCategory: 'all',
    useWebSearch: true
  });
  
  // ResearchGPT Configuration Modal State
  const [showResearchGPTConfig, setShowResearchGPTConfig] = useState<boolean>(false);
  
  // Load ResearchGPT configuration from localStorage or use defaults
  const [researchGPTConfig, setResearchGPTConfig] = useState(() => {
    if (typeof window !== 'undefined') {
      // First check if there's research metadata from homepage
      const researchMetaData = localStorage.getItem("researchMeta");
      if (researchMetaData) {
        try {
          const researchMeta = JSON.parse(researchMetaData);
          if (researchMeta.research_type) {
            console.log('🔍 Found research metadata from homepage, using research_type:', researchMeta.research_type);
            return {
              category: researchMeta.research_type,
              depth: 'comprehensive',
              timeframe: '1Y',
              geoScope: 'Global',
              companySize: 'all',
              revenueCategory: 'all',
              useWebSearch: true,
              selectedModels: {
                gpt4o: false,
                gemini: true,
                perplexity: false
              }
            };
          }
        } catch (e) {
          console.error('Error parsing research metadata:', e);
        }
      }
      
      // Fall back to saved configuration or defaults
      const saved = localStorage.getItem('researchGPTConfig');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved ResearchGPT config:', e);
        }
      }
    }
    return {
      category: 'sales_opportunities',
      depth: 'comprehensive',
      timeframe: '1Y',
      geoScope: 'Global',
      companySize: 'all',
      revenueCategory: 'all',
      useWebSearch: true,
      selectedModels: {
        gpt4o: false,
        gemini: true,
        perplexity: false
      }
    };
  });

  // Save ResearchGPT configuration to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('researchGPTConfig', JSON.stringify(researchGPTConfig));
    }
  }, [researchGPTConfig]);

  
  // Onboarding message typing state
  const [onboardingTypingIndex, setOnboardingTypingIndex] =
    useState<number>(-1);
  const [onboardingDisplayedText, setOnboardingDisplayedText] =
    useState<string>("");

  // Safe mode setter that validates before switching from research mode
  const setActiveModeSafe = useCallback((newMode: ModeType, source?: string) => {
    if (activeMode === "research" && newMode === "lightning") {
      console.warn(`⚠️ MODE VALIDATION: Blocked switch from research to lightning mode${source ? ` (source: ${source})` : ''}. Research mode preserved.`);
      return;
    }
    console.log(`🔄 Setting activeMode to ${newMode}${source ? ` from ${source}` : ''}`);
    setActiveMode(newMode);
  }, [activeMode]);
  
  // Enhanced mode tracking and isolation (defined after all state declarations)
  const trackModeChange = useCallback((newMode: ModeType, chatId?: string) => {
    const timestamp = Date.now();
    console.log(`🔄 MODE TRACKING: Switching to ${newMode} mode${chatId ? ` for chat ${chatId}` : ''}`);
    
    // Update mode history
    setModeHistory(prev => [...prev, { mode: newMode, timestamp, chatId }]);
    
    // Track current mode chat
    if (chatId) {
      setCurrentModeChat(chatId);
    }
    
    // Persist to localStorage for session continuity
    localStorage.setItem('activeMode', newMode);
    localStorage.setItem('modeChangeTimestamp', timestamp.toString());
    if (chatId) {
      localStorage.setItem('currentModeChat', chatId);
    }
    
    // Log mode isolation status
    console.log(`📊 MODE ISOLATION: Current mode: ${newMode}, Chat: ${chatId || 'none'}, History: ${modeHistory.length + 1} entries`);
  }, [modeHistory.length]);
  
  // Validate mode isolation for specific operations
  const validateModeIsolation = useCallback((requiredMode: ModeType, operation: string) => {
    const currentChat = chatSessions.find(chat => chat.id === currentChatId);
    const chatMode = currentChat?.mode;
    const globalMode = activeMode;
    
    const isValid = chatMode === requiredMode || globalMode === requiredMode;
    
    if (!isValid) {
      console.warn(`⚠️ MODE ISOLATION VIOLATION: ${operation} requires ${requiredMode} mode but current chat mode is ${chatMode} and global mode is ${globalMode}`);
      return false;
    }
    
    console.log(`✅ MODE ISOLATION VALID: ${operation} allowed in ${requiredMode} mode`);
    return true;
  }, [chatSessions, currentChatId, activeMode]);
  
  // Clean up mode-specific data when switching modes
  const cleanupModeData = useCallback((fromMode: ModeType, toMode: ModeType) => {
    console.log(`🧹 MODE CLEANUP: Cleaning up data from ${fromMode} to ${toMode}`);
    
    // Clear Lightning Mode data when switching away from Lightning Mode
    if (fromMode === 'lightning' && toMode !== 'lightning') {
      console.log('🧹 LIGHTNING MODE CLEANUP: Clearing Lightning Mode data');
      localStorage.removeItem('lightningModeData');
      localStorage.removeItem('lightning_target_audience_data');
      localStorage.removeItem('pendingChatMessage');
      localStorage.removeItem('lightning_company_summary');
      localStorage.removeItem('lightning_inputs');
      localStorage.removeItem('lightningModeResults');
    }
    
    // Clear Lightning Mode data when switching TO Explore mode
    if (toMode === 'explore') {
      console.log('🧹 EXPLORE MODE: Clearing Lightning Mode data to ensure clean chat experience');
      localStorage.removeItem('lightningModeData');
      localStorage.removeItem('lightning_target_audience_data');
      localStorage.removeItem('lightning_company_summary');
      localStorage.removeItem('lightning_inputs');
      localStorage.removeItem('lightningModeResults');
    }
    
    // Clear Research Mode data when switching away from Research Mode
    if (fromMode === 'research' && toMode !== 'research') {
      console.log('🧹 RESEARCH MODE CLEANUP: Clearing Research Mode data');
      localStorage.removeItem('researchMeta');
      localStorage.removeItem('companyAnalysis');
    }
    
    // Clear Focus Mode data when switching away from Focus Mode
    if (fromMode === 'focus' && toMode !== 'focus') {
      console.log('🧹 FOCUS MODE CLEANUP: Clearing Focus Mode data');
      localStorage.removeItem('salescentri_preserved_chat');
    }
  }, []);
  
  // Helpers for custom prompts keyed by auth or anon id
  const getCustomPromptUserKey = useCallback((): string => {
    const getToken = () => {
      if (typeof window === "undefined") return null;
      try {
        return localStorage.getItem("salescentri_token");
      } catch {
        return null;
      }
    };
    const token = getToken();
    if (token) {
      // If we have a profile id, prefer a stable id-based key; else session token bucket
      if (userProfile?.user?.id != null) {
        return `auth_${String(userProfile.user.id)}`;
      }
      return `auth_token`;
    }
    if (typeof window !== "undefined") {
      const tracker = localStorage.getItem("tracker_anon_id");
      if (tracker) return `anon_${tracker}`;
    }
    // Fallback to internal anon util
    try {
      const anon = getUserId();
      return `anon_${anon}`;
    } catch {
      return `anon_fallback`;
    }
  }, [userProfile]);

  const getAnonPromptKey = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    const tracker = localStorage.getItem("tracker_anon_id");
    if (tracker) return `salescentri_custom_prompts:anon_${tracker}`;
    return null;
  }, []);

  const getAuthPromptKey = useCallback((): string | null => {
    if (!isAuthenticated || !userProfile?.user?.id) return null;
    return `salescentri_custom_prompts:auth_${String(userProfile.user.id)}`;
  }, [isAuthenticated, userProfile]);

  const loadCustomPrompts = useCallback(() => {
    if (typeof window === "undefined") return;
    const key = getCustomPromptUserKey();
    try {
      const raw = localStorage.getItem(`salescentri_custom_prompts:${key}`);
      if (!raw) {
        setCustomPrompts([]);
      } else {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === "string") {
            // Backward compatibility: migrate from [string] to [{ title, text }]
            const migrated = (parsed as string[]).map((text) => ({
              title: text.length > 60 ? `${text.slice(0, 57)}...` : text,
              text,
            }));
            setCustomPrompts(migrated);
            // Persist migrated format
            saveCustomPromptsForUser(migrated);
          } else {
            setCustomPrompts(parsed as { title: string; text: string }[]);
          }
        } else {
          setCustomPrompts([]);
        }
      }
    } catch {
      setCustomPrompts([]);
    }
  }, [getCustomPromptUserKey]);

  const saveCustomPromptsForUser = useCallback((prompts: { title: string; text: string }[]) => {
    if (typeof window === "undefined") return;
    const key = getCustomPromptUserKey();
    try {
      localStorage.setItem(
        `salescentri_custom_prompts:${key}`,
        JSON.stringify(prompts)
      );
    } catch {}
  }, [getCustomPromptUserKey]);

  useEffect(() => {
    loadCustomPrompts();
  }, [loadCustomPrompts]);

  // Reload prompts whenever auth token or profile changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "salescentri_token") {
        loadCustomPrompts();
      }
    };
    const onVisibility = () => loadCustomPrompts();
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
      document.addEventListener("visibilitychange", onVisibility);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", onStorage);
        document.removeEventListener("visibilitychange", onVisibility);
      }
    };
  }, [loadCustomPrompts]);

  useEffect(() => {
    loadCustomPrompts();
  }, [isAuthenticated, userProfile, loadCustomPrompts]);
  const [isOnboardingTyping, setIsOnboardingTyping] = useState<boolean>(false);
  
  // Onboarding state for Focus Mode
  const [isOnboardingMode, setIsOnboardingMode] = useState(false);
  const [isOnboardingChat, setIsOnboardingChat] = useState(false);
  const [isOnboardingRestartMode, setIsOnboardingRestartMode] = useState(false);
  const [isFreshOnboardingSession, setIsFreshOnboardingSession] =
    useState(false);
  const [onboardingChatId, setOnboardingChatId] = useState<string>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [onboardingWelcomeMessage, setOnboardingWelcomeMessage] =
    useState<string>("");
  const [onboardingMessages, setOnboardingMessages] = useState<ChatMessage[]>(
    []
  );
  const [currentOnboardingStep, setCurrentOnboardingStep] =
    useState<string>("start");
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userId: "",
    currentStep: "start",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingOnboarding] = useState(false);
  const [showOnboardingCompletion, setShowOnboardingCompletion] =
    useState(false);
  const [isFirstUserInteraction, setIsFirstUserInteraction] = useState(true);

  const [isAuthChecked, setIsAuthChecked] = useState(false); // Track if auth check is complete
  
  // Lead generation state
  const [leadGenQuestions, setLeadGenQuestions] = useState({
    industry: "",
    competitorBasis: "",
    region: "",
    clientType: "",
  });
  const [currentLeadGenStep, setCurrentLeadGenStep] = useState(0);
  
  // Loading state for AI responses
  const [isAILoading] = useState(false);
  
  // Text overlay state
  const [showTextOverlay, setShowTextOverlay] = useState(false);

  // Show text overlay permanently when component mounts, but hide on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setShowTextOverlay(window.innerWidth >= 640); // Show only on screens >= 640px (sm breakpoint)
      };
      
      // Initial check after a short delay
      const timer = setTimeout(() => {
        handleResize();
      }, 1000);
      
      // Add resize listener
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
    return () => {}; // Return empty cleanup function for SSR
  }, []);

  // Backend status indicators
  const [backendStatus, setBackendStatus] = useState<{
    [key: string]: "idle" | "loading" | "success" | "error";
  }>({
    onboarding: "idle",
    research: "idle",
    company: "idle",
  });
  
  // Web search progress state
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const webSearchProgress = useWebSearchProgress({
    onComplete: () => {
      console.log("🎉 Web search progress completed");
      setIsWebSearchActive(false);
    },
    autoShow: true,
  });
  
  // Streaming research state
  const streamingResearch = useStreamingResearch();
  
  // Get current chat session - use more robust fallback logic
  const activeChatId =
    currentChatId || processingChatId || initialChatId || urlChatId;
  
  // More robust currentChat resolution - check multiple sources
  let currentChat = null;
  if (activeChatId) {
    // First try to find in current chatSessions state
    currentChat = chatSessions.find((chat) => chat.id === activeChatId);
    
    // If not found but we have a processing chat, try the ref
    if (!currentChat && processingChatId) {
      currentChat = chatSessionsRef.current.find(
        (chat) => chat.id === processingChatId
      );
    }
    
    // If still not found, try with activeChatId from ref
    if (!currentChat && activeChatId) {
      currentChat = chatSessionsRef.current.find(
        (chat) => chat.id === activeChatId
      );
    }
    
    // If still not found but we're processing, create a minimal chat object for rendering
    if (
      !currentChat &&
      (isProcessing || processingChatId || (activeChatId && !currentChatId))
    ) {
      const chatId = processingChatId || activeChatId;
      console.log("🔧 Creating minimal chat object for rendering:", chatId);
      
      // Check if we can get messages from ref first
      const refChat = chatSessionsRef.current.find(
        (chat) => chat.id === chatId
      );
      currentChat = {
        id: chatId,
        title: refChat?.title || "Loading...",
        messages: refChat?.messages || [],
        createdAt: refChat?.createdAt || Date.now(),
      };
    }
  }

  // Update the displayed source dynamically during search
  useEffect(() => {
    if (isWebSearchActive) {
      const titleElement = document.getElementById("current-source-title");
      const domainElement = document.getElementById("current-source-domain");
      const sourcesFoundElement = document.getElementById("sources-found");
      
      // Check if we have real sources or are still waiting
      const hasRealSources =
        webSearchProgress.discoveredSources &&
        webSearchProgress.discoveredSources.length > 0;
      const currentSource = hasRealSources
        ? webSearchProgress.currentSource
        : null;
      
      if (titleElement && domainElement) {
        // Add slide transition effect
        titleElement.style.transform = "translateX(-100%)";
        domainElement.style.transform = "translateX(-100%)";
        
        setTimeout(() => {
          if (currentSource) {
            titleElement.textContent = currentSource.title;
            domainElement.textContent = currentSource.domain;
          } else {
            titleElement.textContent = "Searching for sources...";
            domainElement.textContent = "Please wait...";
          }
          titleElement.style.transform = "translateX(0)";
          domainElement.style.transform = "translateX(0)";
        }, 150);
      }
      
      if (sourcesFoundElement) {
        const foundCount = webSearchProgress.discoveredSources?.length || 0;
        sourcesFoundElement.textContent =
          foundCount > 0
            ? `Found ${foundCount} source${foundCount === 1 ? "" : "s"}`
            : "Searching web...";
      }
    }
  }, [
    isWebSearchActive,
    webSearchProgress.currentSource,
    webSearchProgress.discoveredSources,
  ]);
  // Load chat sessions from backend on component mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        const chats = await chatApi.getChats(false);
        console.log("🔄 LoadChats - Raw backend response:", chats);
        
        const formattedChats: ChatSession[] = chats.map((chat) => ({
          id: chat.id,
          title: chat.title,
          messages: [], // Messages will be loaded when chat is selected
          createdAt: new Date(chat.created_at).getTime(),
          mode: chat.mode,
        }));
        
        console.log(
          "🔄 LoadChats - Formatted chats:",
          formattedChats.map((c) => ({ id: c.id, title: c.title }))
        );
        setDeduplicatedChatSessions(() => formattedChats);
        // Update ref immediately for consistent access
        chatSessionsRef.current = formattedChats;
        setChatsLoaded(true);
      } catch (error) {
        console.error("Failed to load chats:", error);
        setChatsLoaded(true); // Set to true even on error so we don't get stuck
      } finally {
        // Only set initializing to false if we don't have an initial chat to load
        if (!initialChatId) {
          setIsInitializing(false);
        }
      }
    };

    loadChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-start focus mode onboarding when landing on page with no chat
  const focusAutoStartRef = useRef<boolean>(false);
  const onboardingCompletionSyncRef = useRef<boolean>(false);
  useEffect(() => {
    if (
      activeMode === "focus" &&
      !focusAutoStartRef.current &&
      !currentChatId &&
      !isOnboardingChat &&
      (onboardingMessages?.length || 0) === 0 &&
      !isInitializing
    ) {
      focusAutoStartRef.current = true;
      try {
        // Function is defined later in component but available at runtime
                handleStartConversationalOnboarding();
      } catch (e) {
        console.error("Failed to auto-start focus onboarding:", e);
      }
    }
  }, [activeMode, currentChatId, isOnboardingChat, onboardingMessages?.length, isInitializing]);

  // Handle initial chat ID from URL
  const initializedChatsRef = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    // Don't proceed if chat sessions haven't loaded yet or if we're processing a message
    if (!chatsLoaded || isProcessing || isMessageInProgress) return;
    
    const targetChatId = initialChatId || urlChatId;
    if (targetChatId && !initializedChatsRef.current.has(targetChatId)) {
      const chatExists = chatSessions.find((chat) => chat.id === targetChatId);
      if (chatExists) {
        console.log("🎯 Setting initial chat from URL:", targetChatId);
        initializedChatsRef.current.add(targetChatId);
        setCurrentChatId(targetChatId);

        // Set mode based on chat during initial load, but preserve research mode if active
        // Only set mode if current mode is explore or matches chat mode
        if (isInitialRestoration) {
          if (activeMode === "explore" || activeMode === chatExists.mode) {
            console.log(`🔄 INITIAL CHAT LOAD: Setting mode to ${chatExists.mode} from chat`);
            setActiveMode(chatExists.mode);
            trackModeChange(chatExists.mode, targetChatId);
          } else if (activeMode === "research" && chatExists.mode !== "research") {
            console.log('🔍 INITIAL CHAT LOAD: Preserving research mode, chat mode is', chatExists.mode);
            // Keep research mode, don't override
          } else if (activeMode === "research" && chatExists.mode === "research") {
            console.log('🔍 INITIAL CHAT LOAD: Chat is research mode, confirming research mode');
            setActiveMode("research");
            trackModeChange("research", targetChatId);
          }
        }
        
        // Clean up Lightning Mode data if this is NOT a Lightning Mode chat
        if (chatExists.mode !== "lightning") {
          console.log('🧹 CHAT LOAD: Clearing Lightning Mode data for non-Lightning chat (mode: ' + chatExists.mode + ')');
          localStorage.removeItem('lightningModeData');
          localStorage.removeItem('lightning_target_audience_data');
          localStorage.removeItem('lightning_company_summary');
          localStorage.removeItem('lightning_inputs');
          localStorage.removeItem('lightningModeResults');
          localStorage.removeItem('pendingLightningMessage');
        } else {
          // For Lightning Mode chats, preserve the data on reload to ensure normalization works
          console.log('✅ Lightning Mode chat detected, preserving localStorage data for normalization');
        }
        
        // Load messages and set up UI state immediately
        const loadInitialChatMessages = async () => {
          if (chatExists.messages.length === 0) {
            try {
              console.log("📥 Loading messages for chat:", targetChatId, "- current messages count:", chatExists.messages.length);
              const backendMessages = await chatApi.getMessages(targetChatId);
              console.log("📥 Raw backend messages:", backendMessages.length);
              
              // Import normalization functions - do this outside the map to avoid async issues
              let isCompanySummaryMessage: ((message: any) => boolean) | null = null;
              let normalizeCompanySummaryMessage: ((message: any) => string) | null = null;
              
              try {
                const normalizationModule = await import('../../lib/lightningModeHandlers/backgroundProcessing');
                isCompanySummaryMessage = normalizationModule.isCompanySummaryMessage;
                normalizeCompanySummaryMessage = normalizationModule.normalizeCompanySummaryMessage;
              } catch (importError) {
                console.warn('⚠️ Failed to import normalization functions:', importError);
              }
              
              const formattedMessages: ChatMessage[] = backendMessages.map(
                (msg) => {
                  // Preserve grounded/lightning metadata if backend returns it (object or JSON string)
                  const rawLightning = (msg as any).lightningMode;
                  let lightningMode: any | undefined = undefined;
                  if (rawLightning != null) {
                    if (typeof rawLightning === "string") {
                      try {
                        lightningMode = JSON.parse(rawLightning);
                      } catch {
                        lightningMode = { type: rawLightning };
                      }
                    } else {
                      lightningMode = rawLightning;
                    }
                  }
                  
                  // Create message object
                  let messageContent = msg.content;
                  
                  // Check if this is a company summary message that needs normalization
                  if (msg.role === 'assistant' && isCompanySummaryMessage && normalizeCompanySummaryMessage) {
                    const messageObj = {
                      id: msg.id.toString(),
                      role: msg.role,
                      content: msg.content,
                      timestamp: new Date(msg.created_at).getTime(),
                      lightningMode,
                    } as ChatMessage;
                    
                    // Normalize company summary messages on reload
                    if (isCompanySummaryMessage(messageObj)) {
                      console.log('🔍 Detected company summary message, normalizing...');
                      try {
                        messageContent = normalizeCompanySummaryMessage(messageObj);
                        console.log('✅ Company summary message normalized');
                      } catch (error) {
                        console.error('⚠️ Error normalizing company summary message:', error);
                        // Continue with original content if normalization fails
                      }
                    }
                  }
                  
                  return {
                    id: msg.id.toString(),
                    role: msg.role,
                    content: messageContent,
                    timestamp: new Date(msg.created_at).getTime(),
                    lightningMode,
                  } as ChatMessage;
                }
              );

              console.log(
                "📨 Loaded and formatted",
                formattedMessages.length,
                "messages for chat:",
                targetChatId
              );
              console.log("📨 Sample messages:", formattedMessages.slice(0, 2).map(m => ({ role: m.role, content: m.content.substring(0, 50) })));
              
              // Update the chat session with loaded messages
              setChatSessions((prev) =>
                prev.map((c) =>
                c.id === targetChatId 
                  ? { ...c, messages: formattedMessages }
                  : c
                )
              );
              
              // Set up UI based on loaded messages
              if (formattedMessages.length > 0) {
                console.log(
                  "📥 Setting up UI with",
                  formattedMessages.length,
                  "loaded messages"
                );
                const lastUserMessage = [...formattedMessages]
                  .reverse()
                  .find((m) => m.role === "user");
                const lastAssistantMessage = [...formattedMessages]
                  .reverse()
                  .find((m) => m.role === "assistant");

                console.log(
                  "📥 lastUserMessage:",
                  lastUserMessage ? "Found" : "Not found"
                );
                
                if (lastUserMessage) {
                  setRecentPrompt(lastUserMessage.content);
                } else if (lastAssistantMessage) {
                  // For AI-only chats, set a default prompt
                  setRecentPrompt("Analysis in progress...");
                }
                
                // No typing animation for loaded chats - display content immediately
                if (lastAssistantMessage) {
                  setResult(lastAssistantMessage.content);
                  setDisplayedResult(lastAssistantMessage.content);
                }
              } else {
                console.log(
                  "📥 No messages found, but setting up chat UI anyway"
                );
                // Even with no messages, this is a valid chat - set up the UI
                setRecentPrompt("New chat ready...");
              }
              
              // ALWAYS set background to chat mode for valid chats
                            setShowHyperspeed(false);
                            setHasPrompted(true);
              console.log("🎨 Set UI to chat mode for:", targetChatId);
            } catch (error) {
              console.error("Failed to load messages for initial chat:", error);
            } finally {
              // Chat loading complete, stop initializing
              setIsInitializing(false);
              
              // Check for pending analysis after chat is fully loaded
              setTimeout(() => {
                                checkForPendingAnalysis(targetChatId);
              }, 500);
              
              // Check for pending message from localStorage (for new chats from homepage)
              setTimeout(() => {
                                checkForPendingMessage(targetChatId);
              }, 800);
            }
          } else {
            // Messages already loaded, just set up UI
            console.log("📋 Using existing messages for chat:", targetChatId);
            console.log(
              "📋 chatExists.messages.length:",
              chatExists.messages.length
            );
            const lastUserMessage = [...chatExists.messages]
              .reverse()
              .find((m) => m.role === "user");
            const lastAssistantMessage = [...chatExists.messages]
              .reverse()
              .find((m) => m.role === "assistant");

            console.log(
              "📋 lastUserMessage:",
              lastUserMessage ? "Found" : "Not found"
            );
            
            if (lastUserMessage) {
              setRecentPrompt(lastUserMessage.content);
            } else if (lastAssistantMessage) {
              // For AI-only chats, set a default prompt
              setRecentPrompt("Analysis in progress...");
            } else {
              // Empty chat
              setRecentPrompt("New chat ready...");
            }
            
            // No typing animation for existing chats - display content immediately
            if (lastAssistantMessage) {
              setResult(lastAssistantMessage.content);
              setDisplayedResult(lastAssistantMessage.content);
            }
            
            // ALWAYS set background to chat mode for valid chats
                        setShowHyperspeed(false);
                        setHasPrompted(true);
            console.log(
              "🎨 Set UI to chat mode for existing chat:",
              targetChatId
            );
            
            // Chat loading complete, stop initializing
            setIsInitializing(false);
            
            // Check for pending analysis after chat is fully loaded
            setTimeout(() => {
                            checkForPendingAnalysis(targetChatId);
            }, 500);
            
            // Check for pending message from localStorage (for new chats from homepage)
              setTimeout(() => {
                            checkForPendingMessage(targetChatId);
            }, 800);
          }
        };
        
        loadInitialChatMessages();
      } else {
        console.warn(
          "⚠️ Chat ID from URL not found in chat sessions:",
          targetChatId
        );
        // Only redirect if we're sure the chat doesn't exist AND we're not in the middle of processing a message
        if (!isProcessing && !isMessageInProgress) {
          console.log("🔄 Redirecting to home - chat not found and not processing");
          setIsInitializing(false);
          router.push("/solutions/psa-suite-one-stop-solution");
        } else {
          console.log("🛑 Chat not found but message in progress - skipping redirect");
          setIsInitializing(false);
        }
      }
    } else if (!targetChatId) {
      // We're on the home page, ensure we show the home state
      console.log("🏠 On home page, setting up home state");
      setCurrentChatId(null);
      setRecentPrompt("");
      setResult("");
      setDisplayedResult("");
      setIsTyping(false);
            setShowHyperspeed(true);
            setHasPrompted(false);
      setIsInitializing(false); // Home page setup complete
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialChatId, urlChatId, router, chatsLoaded, chatSessions, isProcessing, isMessageInProgress]);
// Added 'chatSessions' to dependency array to fix warning

  // Check authentication state on page load

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthLoading(true);
      try {
        const result = await validateAuthenticationAsync();
        if (result.isAuthenticated && result.profile) {
          setIsAuthenticated(true);
          setUserProfile(result.profile);
          // Show modal if user has bearer token and is on homepage
          const token = localStorage.getItem("bearerToken");
          if (token) {
            setShowLeadGenModal(true);
            setJustLoggedIn(true);
            // Don't automatically set focus mode - let the modal handle it
          }
        } else {
          setIsAuthenticated(false);
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Authentication check error:", error);
        setIsAuthenticated(false);
        setUserProfile(null);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authResult = await validateAuthenticationAsync();
        setIsAuthChecked(true);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Track landing to PSA query (only when user first visits the page)
  useEffect(() => {
    if (!hasTrackedLanding && !initialChatId && !urlChatId) {
      // Only track landing if we're on the homepage (no existing chat)
      trackLandingToPSAQuery();
      setHasTrackedLanding(true);
    }
  }, [hasTrackedLanding, trackLandingToPSAQuery, initialChatId, urlChatId]);

  // Track redirect from login (check if user came back authenticated)
  useEffect(() => {
    if (isAuthenticated && typeof window !== "undefined") {
      const hasRedirectedFromLogin = sessionStorage.getItem(
        "redirected_from_login"
      );
      if (hasRedirectedFromLogin) {
        trackRedirectFromLogin();
        sessionStorage.removeItem("redirected_from_login");
      }
    }
  }, [isAuthenticated, trackRedirectFromLogin]);

  // Handler for CTA click in modal
  const handleLeadGenModalCTA = () => {
    setShowLeadGenModal(false);
    setIsOnboardingMode(true);
    setActiveMode("focus");
        setShowHyperspeed(false);
        setHasPrompted(false);
        handleStartConversationalOnboarding();
  };

  // Handler for closing modal
  const handleLeadGenModalClose = () => {
    setShowLeadGenModal(false);
    setIsOnboardingMode(false);
    setActiveModeSafe("lightning", "handleLeadGenModalClose");
        setShowHyperspeed(true);
        setHasPrompted(false);
  };

  // Robust typing effect using useCallback and refs - continues even when tab is not focused
  const typingTextRef = useRef<string | null>(null);
  const typingIndexRef = useRef<number>(0);
  const typingActiveRef = useRef<boolean>(false);
  const typingStartTimeRef = useRef<number>(0);
  const processingChatIdRef = useRef<string | null>(null);
  const TYPING_SPEED = 2; // ms per character (2x faster)
  
  // Keep ref in sync with state
  useEffect(() => {
    processingChatIdRef.current = processingChatId;
  }, [processingChatId]);
  
  const typeText = useCallback(
    (text: string): void => {
    // Stop any existing typing animation
    typingActiveRef.current = false;
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Reset and start new typing - immediately clear displayed result to prevent flash
      setDisplayedResult("");
    typingTextRef.current = text;
    typingIndexRef.current = 0;
    typingStartTimeRef.current = Date.now();
    setIsTyping(true);
    typingActiveRef.current = true;
    
    // Use both setInterval AND requestAnimationFrame for maximum reliability
    const typeStep = () => {
      if (!typingActiveRef.current || !typingTextRef.current) return;
      
      // Calculate how many characters should be displayed based on elapsed time
      const elapsed = Date.now() - typingStartTimeRef.current;
      const targetIndex = Math.floor(elapsed / TYPING_SPEED) * 6; // 6 chars per interval (2x faster)
        const actualTarget = Math.min(
          targetIndex,
          typingTextRef.current.length
        );
      
      if (actualTarget > typingIndexRef.current) {
        typingIndexRef.current = actualTarget;
          setDisplayedResult(
            typingTextRef.current.slice(0, typingIndexRef.current)
          );
      }
      
      if (typingIndexRef.current >= typingTextRef.current.length) {
        typingActiveRef.current = false;
        setIsTyping(false);
        // Set the final result once typing is complete
        setResult(typingTextRef.current);
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      } else {
        // Continue with both methods
        animationFrameRef.current = requestAnimationFrame(typeStep);
      }
    };
    
    // Start both interval (for background tabs) AND animation frame (for active tabs)
    typingIntervalRef.current = setInterval(typeStep, TYPING_SPEED);
    animationFrameRef.current = requestAnimationFrame(typeStep);
    },
    [setDisplayedResult, setResult, setIsTyping]
  );
  
  // Cleanup effect for typing and scroll
  useEffect(() => {
    return () => {
      typingActiveRef.current = false;
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
            if (scrollCheckTimeoutRef.current) {
                clearTimeout(scrollCheckTimeoutRef.current);
                scrollCheckTimeoutRef.current = null;
      }
    };
  }, []);

  // Research loading effect
  const researchLoadingMessages = [
    "🔍 Analyzing your research request...",
    "🌐 Searching the web for latest information...",
    "📊 Processing data with Gemini AI...",
    "🔬 Deep diving into research sources...",
    "📝 Compiling comprehensive analysis...",
    "✨ Finalizing research insights..."
  ];

  const showResearchLoading = useCallback(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      if (!isResearchLoading) {
        clearInterval(interval);
        return;
      }
      setDisplayedResult(researchLoadingMessages[messageIndex]);
      messageIndex = (messageIndex + 1) % researchLoadingMessages.length;
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isResearchLoading, researchLoadingMessages]);

  // Show research loading messages when research is loading
  useEffect(() => {
    if (isResearchLoading) {
      const cleanup = showResearchLoading();
      return cleanup;
    }
  }, [isResearchLoading, showResearchLoading]);

  // Force UI update when currentChatId changes during processing
  
  // Improved state synchronization effect
  useEffect(() => {
    if ((currentChatId || processingChatId) && isProcessing) {
      console.log("🔄 Chat ID changed during processing, ensuring state sync");
      // Only force re-render if absolutely necessary
      const targetChatId = currentChatId || processingChatId;
      const chatExists = chatSessionsRef.current.find(
        (chat) => chat.id === targetChatId
      );
      
      if (!chatExists) {
        console.log("🔄 Chat not found in ref, forcing UI update");
      }
    }
  }, [currentChatId, processingChatId, isProcessing, chatSessions]);

  // Consolidated effect for state synchronization and typing animation
  useEffect(() => {
    // Only sync if there's a significant difference (not just typing state changes)
    if (Math.abs(chatSessions.length - chatSessionsRef.current.length) > 0) {
      console.log("🔄 Syncing chatSessionsRef with chatSessions state");
      chatSessionsRef.current = [...chatSessions];
    }
  }, [chatSessions]); // Include full chatSessions array in dependency

  // Critical effect: Ensure currentChatId is properly set when we have an active chat
  useEffect(() => {
    // Check if we have a processing chat but no currentChatId
    if (processingChatId && !currentChatId) {
      console.log(
        "🔧 Setting currentChatId to match processingChatId:",
        processingChatId
      );
      setCurrentChatId(processingChatId);
    }
    
    // Check if we have an initial chat but no currentChatId
    if (initialChatId && !currentChatId && chatsLoaded) {
      const chatExists = chatSessions.find((chat) => chat.id === initialChatId);
      if (chatExists) {
        console.log(
          "🔧 Setting currentChatId to match initialChatId:",
          initialChatId
        );
        setCurrentChatId(initialChatId);
      }
    }
    
    // Check if we have messages being displayed but no currentChatId
    if (
      displayedResult &&
      !currentChatId &&
      (processingChatId || activeChatId)
    ) {
      const targetChatId = processingChatId || activeChatId;
      if (targetChatId) {
        console.log(
          "🔧 Setting currentChatId to match active display chat:",
          targetChatId
        );
        setCurrentChatId(targetChatId);
      }
    }
  }, [
    processingChatId,
    currentChatId,
    initialChatId,
    chatsLoaded,
    chatSessions,
    displayedResult,
    activeChatId,
  ]);

  // Set up global functions for button clicks (safe placeholders that won't overwrite real handlers)
  useEffect(() => {
    if (typeof window.handleICPResponse !== "function") {
      (
        window as unknown as {
          handleICPResponse: (response: "yes" | "no") => void;
        }
      ).handleICPResponse = (response: "yes" | "no") => {
        console.log("🔘 (placeholder) ICP Response called:", response);
      };
    }
    if (typeof window.generateLeads !== "function") {
      (
        window as unknown as { generateLeads: () => Promise<void> }
      ).generateLeads = async () => {
        try {
          const onboardingData = await chatApi.getOnboardingData();
          console.log("Generating leads (placeholder) for:", onboardingData);
        } catch (error) {
          console.error(
            "Error loading onboarding data for lead generation:",
            error
          );
        }
      };
    }
    if (typeof window.handleLeadGenAnswer !== "function") {
      (
        window as unknown as {
          handleLeadGenAnswer: (
            key: string,
            answer: string,
            nextStep: number
          ) => Promise<void>;
        }
      ).handleLeadGenAnswer = async () => {
        console.log("🔘 (placeholder) handleLeadGenAnswer called");
      };
    }
    if (typeof window.startLeadGenQuestions !== "function") {
      (
        window as unknown as { startLeadGenQuestions: () => Promise<void> }
      ).startLeadGenQuestions = async () => {
        console.log("🔘 (placeholder) startLeadGenQuestions called");
      };
    }
    if (typeof window.submitCustomRegion !== "function") {
      (
        window as unknown as { submitCustomRegion: () => void }
      ).submitCustomRegion = () => {
        const input = document.getElementById(
          "region-input"
        ) as HTMLInputElement;
        if (input) {
          const customValue = input.value.trim();
          if (customValue && typeof window.handleLeadGenAnswer === "function") {
            const inputDiv = document.getElementById("custom-region-input");
            if (inputDiv) inputDiv.style.display = "none";
            window.handleLeadGenAnswer(
              "region",
              customValue,
              currentLeadGenStep + 1
            );
          }
        }
      };
    }
    if (typeof window.showCustomRegionInput !== "function") {
      (
        window as unknown as { showCustomRegionInput: () => void }
      ).showCustomRegionInput = () => {
        const inputDiv = document.getElementById("custom-region-input");
        if (inputDiv) {
          inputDiv.style.display = "block";
          const input = document.getElementById(
            "region-input"
          ) as HTMLInputElement;
          if (input) setTimeout(() => input.focus(), 100);
        }
      };
    }

    return () => {
      delete window.handleICPResponse;
      delete window.lightningGenerateLeads;
      delete window.viewDashboard;
      delete window.generateLeads;
      delete window.handleLeadGenAnswer;
      delete window.startLeadGenQuestions;
      delete window.submitCustomRegion;
      delete window.showCustomRegionInput;
    };
  }, []);

  // Create a ref to store the onboarding message handler
  const handleOnboardingMessageRef = useRef<((message: string) => void) | null>(null);

  // Set up selectOption function without dependencies
  useEffect(() => {
    if (typeof window.selectOption !== "function") {
      (
        window as unknown as { selectOption: (option: string) => void }
      ).selectOption = (option: string) => {
        console.log("🔘 Option selected:", option);
        // Use the ref to call the handler
        if (handleOnboardingMessageRef.current) {
          handleOnboardingMessageRef.current(option);
        }
      };
    }

    return () => {
      delete window.selectOption;
    };
  }, []);

  // Load onboarding data and check for first interaction
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Don't override onboarding mode if we're already in a chat
      if (!isAuthLoading && !activeChatId && !urlChatId) {
        try {
          // Check if user has existing onboarding data
      const existingData = await chatApi.getOnboardingData();
          
          if (existingData && existingData.completedAt) {
            // User has completed onboarding before
            setOnboardingData(
                            convertOnboardingData(
                existingData as unknown as Record<string, unknown>
              )
            );
            setCurrentOnboardingStep(existingData.currentStep || "completed");
            setIsFirstUserInteraction(false);
            console.log("Existing onboarding data found:", existingData);
          } else {
            // First time user or incomplete onboarding
            console.log("No completed onboarding found, user needs onboarding");
            setIsFirstUserInteraction(true);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          // If backend fails, assume first time user
          setIsFirstUserInteraction(true);
        }
      } else if (activeChatId || urlChatId) {
        // We're in a chat, don't force onboarding mode
        console.log("In chat mode, skipping onboarding status check");
        setIsFirstUserInteraction(false);
      }
    };

    checkOnboardingStatus();
  }, [isAuthenticated, userProfile, isAuthLoading, activeChatId, urlChatId]);

  // Legacy localStorage fallback (remove this later)
  useEffect(() => {
    const savedOnboardingData = localStorage.getItem("onboardingData");
    if (savedOnboardingData) {
      try {
        const parsedData = JSON.parse(savedOnboardingData);
        setOnboardingData(parsedData);
        setCurrentOnboardingStep(parsedData.currentStep || "start");
      } catch (error) {
        console.error(
          "Error loading onboarding data from localStorage:",
          error
        );
      }
    }
  }, []);
  // Trigger research for a message in a chat
  const triggerResearchForMessage = useCallback(async (message: string, chatId: string) => {
    try {
      console.log('🔍 Triggering research for chat:', chatId, 'Query:', message);
      
      // Clear Lightning Mode data to prevent conflicts when ResearchGPT is triggered
      console.log("🔍 ResearchGPT triggered, clearing Lightning Mode data to prevent conflicts");
      localStorage.removeItem("lightningModeData");
      localStorage.removeItem("pendingLightningMessage");
      
      // Allow guest users to execute research - authentication check removed
      // Gate will be shown AFTER results are displayed
      // Save guest user research context for persistence
      if (!isAuthenticated) {
        localStorage.setItem('researchGPT_guest_query', message);
        localStorage.setItem('researchGPT_guest_chatId', chatId);
        localStorage.setItem('researchGPT_guest_timestamp', Date.now().toString());
      }
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_user`,
        role: "user",
        content: message,
        timestamp: Date.now(),
      };
      
      setDeduplicatedChatSessions((prev) => {
        const updated = prev.map((chat) =>
          chat.id === chatId 
            ? { ...chat, messages: [...chat.messages, userMessage] } 
            : chat
        );
        return updated;
      });
      
      // Save user message to backend
      await chatApi.addMessage(chatId, {
        role: "user",
        content: message,
      });
      
      // Add placeholder AI message
      const placeholderMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai_placeholder`,
        role: "assistant",
        content: `# 🔍 ResearchGPT Analysis\n\n> **Status:** Starting research...\n> **Query:** ${message}\n> **Configuration:** ${researchGPTConfig.category} - ${researchGPTConfig.depth}\n\n*Please wait while I analyze your request across multiple AI models...*`,
        timestamp: Date.now(),
      };
      
      setDeduplicatedChatSessions((prev) => {
        const updated = prev.map((chat) =>
          chat.id === chatId 
            ? { ...chat, messages: [...chat.messages, placeholderMessage] } 
            : chat
        );
        return updated;
      });
      
      // Call multi-research-ai API
      const researchPayload = {
        query: message,
        category: researchGPTConfig.category,
        depth: researchGPTConfig.depth,
        timeframe: researchGPTConfig.timeframe,
        geographic_scope: researchGPTConfig.geoScope,
        website_url: null,
        website_url_2: null,
        company_size: researchGPTConfig.companySize,
        revenue_category: researchGPTConfig.revenueCategory,
        focus_on_leads: false,
        web_search_enabled: researchGPTConfig.useWebSearch,
        selected_models: researchGPTConfig.selectedModels,
        deep_research: true,
        include_founders: true,
        include_products: true,
        analyze_sales_opportunities: false,
        include_tabular_data: true,
        extract_company_info: true,
        analyze_prospective_clients: false,
        include_employee_count: true,
        include_revenue_data: true,
        include_complete_urls: true,
        perplexity_model: 'llama-3.1-sonar-large-128k-online'
      };
      
      console.log('📤 Calling /api/multi-research-ai with payload:', researchPayload);
      
      const response = await fetch('/api/multi-research-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(researchPayload)
      });
      
      if (!response.ok) {
        // If unauthorized (401) and guest user, show signup popup instead of error
        if (response.status === 401 && !isAuthenticated) {
          console.log('🔐 401 Unauthorized - showing ResearchGPT gate for guest user');
          setShowResearchGPTGate(true);
          
          // Remove the placeholder message since we're showing the gate
          setDeduplicatedChatSessions((prev) => {
            const updated = prev.map((chat) => {
              if (chat.id === chatId) {
                const messages = chat.messages.filter(m => m.id !== placeholderMessage.id);
                return { ...chat, messages };
              }
              return chat;
            });
            return updated;
          });
          return;
        }
        
        throw new Error(`Research failed: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Research completed:', data);
      
      // Format results from all models
      let formattedResult = `# 🔍 ResearchGPT Analysis\n\n`;
      formattedResult += `**Query:** ${message}\n\n`;
      formattedResult += `**Configuration:** ${researchGPTConfig.category} - ${researchGPTConfig.depth} - ${researchGPTConfig.geoScope}\n\n`;
      
      // Add results from each selected model
      if (researchGPTConfig.selectedModels.gpt4o && data.gpt4o) {
        formattedResult += `## 🤖 GPT-4O Analysis\n\n${data.gpt4o}\n\n---\n\n`;
      }
      if (researchGPTConfig.selectedModels.gemini && data.gemini) {
        formattedResult += `\n\n${data.gemini}\n\n---\n\n`;
      }
      if (researchGPTConfig.selectedModels.perplexity && data.perplexity) {
        formattedResult += `## 🔍 Perplexity Analysis\n\n${data.perplexity}\n\n---\n\n`;
      }
      
      // Add timestamp
      const now = new Date();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      formattedResult += `\n*Research completed on ${now.toLocaleString()} ${timezone} using Multi-GPT Research*`;
      
      // Save results to localStorage for guest users (for persistence after login)
      if (!isAuthenticated) {
        const guestResearchData = {
          query: message,
          chatId: chatId,
          results: formattedResult,
          rawResults: data,
          timestamp: Date.now(),
          config: researchGPTConfig
        };
        localStorage.setItem('researchGPT_guest_results', JSON.stringify(guestResearchData));
        localStorage.setItem('researchGPT_guest_results_url', window.location.href);
        console.log('💾 Guest research results saved to localStorage');
      }
      
      // Update the placeholder message with actual results
      setDeduplicatedChatSessions((prev) => {
        const updated = prev.map((chat) => {
          if (chat.id === chatId) {
            const messages = [...chat.messages];
            const placeholderIndex = messages.findIndex(m => m.id === placeholderMessage.id);
            if (placeholderIndex !== -1) {
              messages[placeholderIndex] = {
                ...messages[placeholderIndex],
                content: formattedResult,
              };
            }
            return { ...chat, messages };
          }
          return chat;
        });
        return updated;
      });
      
      // Save AI message to backend (only if authenticated)
      if (isAuthenticated) {
        try {
          await chatApi.addMessage(chatId, {
            role: "assistant",
            content: formattedResult,
          });
        } catch (error) {
          console.log('⚠️ Failed to save message to backend (guest user)', error);
        }
      }
      
      console.log('✅ Research results saved to chat');
      
      // Show ResearchGPT Gate AFTER results are displayed (for guest users only)
      if (!isAuthenticated) {
        // Small delay to ensure results are fully rendered
        setTimeout(() => {
          setShowResearchGPTGate(true);
        }, 1000);
      }
      // Post follow-up CTA to confirm website and enter Lightning Mode (website only)
      const followUpMessage: ChatMessage = {
        id: `msg_${Date.now()}_cta_lightning`,
        role: "assistant",
        content: `<div class="glass-container rounded-xl p-4 border border-blue-400/30 bg-gradient-to-r from-blue-950/40 to-black/40 backdrop-blur-xl max-w-xl mx-auto my-3 shadow-lg">
  <div class="flex items-center justify-between gap-3">
    <div class="flex-1 mr-2">
      <p class="text-white text-sm font-semibold">Ready to generate leads?</p>
      <p class="text-blue-300/80 text-xs">Confirm your website to start Lightning Mode. Only the website will be used.</p>
    </div>
    <div class="flex gap-2">
      <button onclick="window.openResearchWebsitePrompt && window.openResearchWebsitePrompt()" 
         class="px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-md border border-blue-500/60 text-xs cursor-pointer whitespace-nowrap">
        Confirm Website
      </button>
      <button 
         class="px-3 py-2 rounded-lg font-medium text-blue-200 bg-white/5 hover:bg-white/10 transition-all duration-200 border border-blue-500/20 text-xs cursor-pointer whitespace-nowrap">
        Stay in Chat
      </button>
    </div>
  </div>
</div>`,
        timestamp: Date.now(),
      };
      setDeduplicatedChatSessions((prev) => {
        const updated = prev.map((chat) =>
          chat.id === chatId ? { ...chat, messages: [...chat.messages, followUpMessage] } : chat
        );
        return updated;
      });
      try { await chatApi.addMessage(chatId, { role: 'assistant', content: followUpMessage.content }); } catch {}
      // Optionally show the modal immediately
      setShowResearchWebsitePrompt(true);
      
    } catch (error) {
      console.error('❌ Research error:', error);
      
      // Check if error is related to authentication (401)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isUnauthorized = errorMessage.includes('401') || errorMessage.includes('Unauthorized');
      
      if (isUnauthorized && !isAuthenticated) {
        console.log('🔐 Unauthorized error detected - showing ResearchGPT gate for guest user');
        setShowResearchGPTGate(true);
        
        // Remove the placeholder message since we're showing the gate
        setDeduplicatedChatSessions((prev) => {
          const updated = prev.map((chat) => {
            if (chat.id === chatId) {
              const messages = chat.messages.filter(m => m.role !== 'assistant' || !m.content.includes('Starting research'));
              return { ...chat, messages };
            }
            return chat;
          });
          return updated;
        });
        return;
      }
      
      // Update placeholder with error message for other errors
      const formattedErrorMessage = `# ❌ Research Failed\n\n**Error:** ${errorMessage}\n\nPlease try again or contact support if the issue persists.`;
      
      setDeduplicatedChatSessions((prev) => {
        const updated = prev.map((chat) => {
          if (chat.id === chatId) {
            const messages = [...chat.messages];
            const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf("assistant");
            if (lastAssistantIndex !== -1) {
              messages[lastAssistantIndex] = {
                ...messages[lastAssistantIndex],
                content: formattedErrorMessage,
              };
            }
            return { ...chat, messages };
          }
          return chat;
        });
        return updated;
      });
    }
  }, [researchGPTConfig, setDeduplicatedChatSessions, setShowResearchGPTGate, isAuthenticated]);

  // Create new chat session
  const createNewChat = useCallback(
    async (title: string = "New Chat", initialMessage?: string, modeOverride?: ModeType) => {
    try {
      const chatMode: ModeType = modeOverride || activeMode || "explore";
      console.log('🔄 Creating new chat:', { title, mode: chatMode, isAuthenticated, hasInitialMessage: !!initialMessage });
      
      // For anonymous users, ensure we have an anon_id before attempting chat creation
      if (!isAuthenticated) {
        await chatApi.ensureAnonymousUser();
        const anonId = localStorage.getItem('tracker_anon_id');
        console.log('👤 Anonymous user preparation:', { anonId });
      }
      
      // When creating from PSA page, check if user has configured ResearchGPT settings
      const chatOptions: any = {
        mode: chatMode,
        source: "psa-page"
      };

      // If research mode, include research configuration
      if (chatMode === "research") {
        chatOptions.research_type = researchGPTConfig.category;
        chatOptions.llm_settings = {
          category: researchGPTConfig.category,
          depth: researchGPTConfig.depth,
          timeframe: researchGPTConfig.timeframe,
          geoScope: researchGPTConfig.geoScope,
          companySize: researchGPTConfig.companySize,
          revenueCategory: researchGPTConfig.revenueCategory,
          useWebSearch: researchGPTConfig.useWebSearch,
          selectedModels: researchGPTConfig.selectedModels
        };
      }

      const newChat = await chatApi.createChat(title, chatOptions);
      if (newChat) {
        console.log('✅ Chat created successfully via API:', newChat.id);
        
        // If research mode and initial message provided, automatically trigger research
        if (chatMode === "research" && initialMessage) {
          console.log('🔍 Auto-triggering research for new chat:', newChat.id);
          // Trigger research asynchronously (don't wait for it)
          triggerResearchForMessage(initialMessage, newChat.id).catch(err => {
            console.error('Failed to auto-trigger research:', err);
          });
        }
        
        const formattedChat: ChatSession = {
          id: newChat.id,
          title: newChat.title,
          messages: [],
          mode: chatMode as ModeType,
          createdAt: new Date(newChat.created_at).getTime(),
        };
        
        // Track mode change for new chat
        trackModeChange(chatMode, newChat.id);
          setDeduplicatedChatSessions((prev) => {
          // Check if chat already exists to prevent duplicates
            const existingIndex = prev.findIndex(
              (c) => c.id === formattedChat.id
            );
          if (existingIndex !== -1) {
              console.log(
                "🔄 Chat already exists, returning existing ID:",
                formattedChat.id
              );
            return prev; // Return unchanged to prevent unnecessary re-renders
          }
            console.log("➕ Adding new chat to state:", formattedChat.id);
          return [formattedChat, ...prev];
        });
        
        // Clean state setup
        setCurrentChatId(newChat.id);
          setRecentPrompt("");
          setResult("");
        setDisplayedResult("");
        
        return newChat.id;
      } else {
        console.warn('⚠️ API chat creation returned null, falling back to local');
        throw new Error('API returned null');
      }
    } catch (error) {
        console.error("❌ Failed to create new chat via API, using fallback:", error);
      // Enhanced fallback to local creation if backend fails
      const fallbackId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      console.log('🔄 Creating fallback chat:', { fallbackId, title });
      
      const fallbackChat: ChatSession = {
        id: fallbackId,
        title: title,
        messages: [],
        mode: activeMode as 'lightning' | 'focus' | 'research' | 'brain',
        createdAt: Date.now(),
      };
        setDeduplicatedChatSessions((prev) => {
        // Check if chat already exists to prevent duplicates
          const existingIndex = prev.findIndex((c) => c.id === fallbackChat.id);
        if (existingIndex !== -1) {
            console.log(
              "🔄 Fallback chat already exists, returning existing ID:",
              fallbackChat.id
            );
          return prev; // Return unchanged to prevent unnecessary re-renders
        }
          console.log("➕ Adding fallback chat to state:", fallbackChat.id);
        return [fallbackChat, ...prev];
      });
      
      // Clean state setup
      setCurrentChatId(fallbackChat.id);
        setRecentPrompt("");
        setResult("");
        setDisplayedResult("");
      
      return fallbackChat.id;
    }
    },
    [setDeduplicatedChatSessions, isAuthenticated, activeMode, researchGPTConfig, triggerResearchForMessage]
  );

  // Start new chat
  const startNewChat = useCallback(async () => {
    // Reset states to homepage
    setRecentPrompt("");
    setResult("");
    setDisplayedResult("");
    setIsTyping(false);
    setShowHyperspeed(true);
    setHasPrompted(false);
    setCurrentChatId(null);
    
    // Navigate to homepage instead of creating a chat
    router.push("/solutions/psa-suite-one-stop-solution");
  }, [router]);

  // Logout function
  const handleLogout = useCallback(() => {
    clearTokens();
    setIsAuthenticated(false);
    setUserProfile(null);
    setShowProfileModal(false); // Close the modal after logout
  }, []);

  // Switch to existing chat
  const switchToChat = useCallback(
    async (chatId: string) => {
    setCurrentChatId(chatId);
      const chat = chatSessions.find((c) => c.id === chatId);
    
    // Set activeMode based on chat mode with enhanced tracking
    // Only set mode when explicitly switching to a chat (not during initial restoration)
    // This ensures research mode isn't overridden during initial page load
    if (chat?.mode && !isInitialRestoration) {
      const previousMode = activeMode;
      
      // Validate mode switch: prevent switching from research to lightning unless explicitly requested
      if (previousMode === "research" && chat.mode === "lightning") {
        console.warn('⚠️ MODE VALIDATION: Preventing switch from research to lightning mode. Research mode will be preserved.');
        // Keep research mode, but still track the chat
        trackModeChange("research", chatId);
        return;
      }
      
      // Allow switching to research mode from any other mode
      // Allow switching from research to other modes only if explicitly switching to a research chat
      if (chat.mode === "research" || previousMode !== "research") {
        setActiveMode(chat.mode);
        
        // Track mode change and cleanup data
        trackModeChange(chat.mode, chatId);
        if (previousMode !== chat.mode) {
          cleanupModeData(previousMode, chat.mode);
        }
      } else {
        // Preserve research mode if switching to a non-research chat
        console.log('🔍 Preserving research mode when switching to non-research chat');
        trackModeChange("research", chatId);
      }
    } else if (chat?.mode && isInitialRestoration) {
      // During initial restoration, only set mode if it matches the current mode or if current mode is explore
      // This prevents overriding research mode during initial load
      if (activeMode === "explore" || activeMode === chat.mode) {
        console.log(`🔄 INITIAL RESTORATION: Setting mode to ${chat.mode} from chat`);
        setActiveMode(chat.mode);
        trackModeChange(chat.mode, chatId);
      } else if (activeMode === "research") {
        console.log('🔍 INITIAL RESTORATION: Preserving research mode, not overriding with chat mode');
        // Keep research mode during initial restoration
      }
    }
    
    // Navigate to chat URL
    router.push(`/solutions/psa-suite-one-stop-solution/c/${chatId}`);
    
    // Load messages from backend if not already loaded
    if (chat && chat.messages.length === 0) {
      try {
        const backendMessages = await chatApi.getMessages(chatId);
              const formattedMessages: ChatMessage[] = backendMessages.map(
                (msg) => {
                  // Preserve grounded/lightning metadata if backend returns it (object or JSON string)
                  const rawLightning = (msg as any).lightningMode;
                  let lightningMode: any | undefined = undefined;
                  if (rawLightning != null) {
                    if (typeof rawLightning === "string") {
                      try {
                        lightningMode = JSON.parse(rawLightning);
                      } catch {
                        lightningMode = { type: rawLightning };
                      }
                    } else {
                      lightningMode = rawLightning;
                    }
                  }
                  return {
                    id: msg.id.toString(),
                    role: msg.role,
                    content: msg.content,
                    timestamp: new Date(msg.created_at).getTime(),
                    lightningMode,
                  } as ChatMessage;
                }
              );
        
        // Update the chat session with loaded messages
          setChatSessions((prev) => {
            const updated = prev.map((c) =>
              c.id === chatId ? { ...c, messages: formattedMessages } : c
          );
          // Update ref immediately for consistent access
          chatSessionsRef.current = updated;
          return updated;
        });
        
        // Set up UI based on loaded messages
        if (formattedMessages.length > 0) {
            const lastUserMessage = [...formattedMessages]
              .reverse()
              .find((m) => m.role === "user");
          if (lastUserMessage) {
            setRecentPrompt(lastUserMessage.content);
          }
          // Set background to chat mode
          setShowHyperspeed(false);
          setHasPrompted(true);
        }
      } catch (error) {
          console.error("Failed to load messages:", error);
      }
    } else if (chat && chat.messages.length > 0) {
        const lastUserMessage = [...chat.messages]
          .reverse()
          .find((m) => m.role === "user");
      if (lastUserMessage) {
        setRecentPrompt(lastUserMessage.content);
      }
      // Set background to chat mode
      setShowHyperspeed(false);
      setHasPrompted(true);
    } else {
        setRecentPrompt("");
    }
      setResult("");
      setDisplayedResult("");
    setIsTyping(false);
    },
    [chatSessions, router, isInitialRestoration, activeMode, trackModeChange, cleanupModeData]
  );

  // Delete chat
  const deleteChat = useCallback(
    async (chatId: string) => {
    try {
      const success = await chatApi.deleteChat(chatId);
      if (success) {
        // Remove from local state
          setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId));
        
        // If the deleted chat was the current chat, switch to the first available chat or create a new one
        if (currentChatId === chatId) {
            const remainingChats = chatSessions.filter(
              (chat) => chat.id !== chatId
            );
          if (remainingChats.length > 0) {
            await switchToChat(remainingChats[0].id);
          } else {
            setCurrentChatId(null);
              setRecentPrompt("");
              setResult("");
              setDisplayedResult("");
            setShowHyperspeed(true);
            setHasPrompted(false);
              router.push("/solutions/psa-suite-one-stop-solution");
          }
        }
      } else {
          console.error("Failed to delete chat from backend");
        // Still remove from local state if backend deletion failed
          setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
            setRecentPrompt("");
            setResult("");
            setDisplayedResult("");
          setShowHyperspeed(true);
          setHasPrompted(false);
            router.push("/solutions/psa-suite-one-stop-solution");
        }
      }
    } catch (error) {
        console.error("Error deleting chat:", error);
    }
    },
    [chatSessions, currentChatId, switchToChat, router, isInitialRestoration, activeMode, trackModeChange, cleanupModeData]
  );

  // Navigate to home page
  const navigateHome = useCallback(() => {
    setCurrentChatId(null);
    setRecentPrompt("");
    setResult("");
    setDisplayedResult("");
    setIsTyping(false);
    setShowHyperspeed(true);
    setHasPrompted(false);
    router.push("/solutions/psa-suite-one-stop-solution");
  }, [router]);

  // Backend persistence helper: split large assistant messages into two POSTs
  const saveAssistantMessageSplit = useCallback(async (cid: string, text: string, retries: number = 3): Promise<void> => {
    // Ensure chat exists before trying to add messages
    const ensureChatExists = async (chatId: string): Promise<boolean> => {
      // Check if chat exists in chatSessions
      const chatExists = chatSessions.find(chat => chat.id === chatId);
      if (chatExists) {
        // For newly created chats, give them a moment to propagate
        // If chat is in sessions but very recent, wait a bit
        const chatAge = Date.now() - (chatExists.createdAt || Date.now());
        if (chatAge < 2000) {
          // Chat is less than 2 seconds old, wait a bit
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Verify chat exists in backend by trying to get it
        try {
          const chat = await chatApi.getChat(chatId);
          return !!chat;
        } catch (error) {
          console.log('Chat verification failed, will retry:', error);
          return false;
        }
      }
      return false;
    };

    // Wait for chat to exist with retries
    let chatReady = await ensureChatExists(cid);
    let attempts = 0;
    while (!chatReady && attempts < 5) {
      await new Promise(resolve => setTimeout(resolve, 500 * (attempts + 1))); // Exponential backoff
      chatReady = await ensureChatExists(cid);
      attempts++;
    }

    if (!chatReady) {
      console.error(`Chat ${cid} not found after ${attempts} attempts, skipping message save`);
      return;
    }

    // Dynamically split long content into N chunks so each chunk ≤ TARGET_CHARS
    const TARGET_CHARS = 4500; // aim per chunk; adjust if backend requires
    // HTML-aware safe splitter to avoid tearing grounded grid tables or tags
    const splitHtmlSafely = (html: string, target: number): string[] => {
      const content = html || "";
      if (content.length <= target) return [content];
      // 1) Extract grounded grid blocks as atomic placeholders
      const gridRegex = /<div\s+data-grounded-grid=\"1\"[\s\S]*?<\/div>\s*<\/div>/gi;
      const grids: string[] = [];
      let placeholderized = content.replace(gridRegex, (m) => {
        const key = `__GRID_BLOCK_${grids.length}__`;
        grids.push(m);
        return key;
      });
      // 2) Tokenize by block-level closings and placeholders
      const tokens: string[] = [];
      const placeholderRegex = /__GRID_BLOCK_(\d+)__/g;
      let cursor = 0; let match: RegExpExecArray | null;
      while ((match = placeholderRegex.exec(placeholderized)) !== null) {
        const idx = match.index;
        const before = placeholderized.slice(cursor, idx);
        // split 'before' by block closing tags into tokens
        const blockClose = /[\s\S]*?<\/(?:p|div|ul|ol|section|table|h[1-6])>/gi;
        let rest = before;
        let m2: RegExpExecArray | null;
        // exec cannot be reused easily; use loop over search
        while (true) {
          const closeIdx = rest.search(/<\/(?:p|div|ul|ol|section|table|h[1-6])>/i);
          if (closeIdx === -1) break;
          const end = closeIdx + rest.slice(closeIdx).indexOf('>') + 1;
          tokens.push(rest.slice(0, end));
          rest = rest.slice(end);
        }
        if (rest.trim()) tokens.push(rest);
        // push the grid placeholder as a standalone token
        tokens.push(match[0]);
        cursor = idx + match[0].length;
      }
      // tail after last placeholder
      const tail = placeholderized.slice(cursor);
      if (tail) {
        let rest = tail;
        while (true) {
          const closeIdx = rest.search(/<\/(?:p|div|ul|ol|section|table|h[1-6])>/i);
          if (closeIdx === -1) break;
          const end = closeIdx + rest.slice(closeIdx).indexOf('>') + 1;
          tokens.push(rest.slice(0, end));
          rest = rest.slice(end);
        }
        if (rest.trim()) tokens.push(rest);
      }
      // 3) Restore placeholders to real grid blocks in tokens
      const restored = tokens.map(t => t.replace(/__GRID_BLOCK_(\d+)__/g, (_, i) => grids[Number(i)] || ''));
      // 4) Accumulate into chunks under target size
      const chunks: string[] = [];
      let buf = '';
      for (const t of restored) {
        if ((buf + t).length > target && buf.length > 0) {
          chunks.push(buf);
          buf = t;
        } else {
          buf += t;
        }
      }
      if (buf) chunks.push(buf);
      // If any chunk still exceeds target (e.g., single giant grid), fall back to hard split at safe boundaries inside text
      const finalChunks: string[] = [];
      for (const c of chunks) {
        if (c.length <= target) { finalChunks.push(c); continue; }
        // try splitting on double newlines first
        let remaining = c;
        while (remaining.length > target) {
          let cut = remaining.lastIndexOf('\n\n', target);
          if (cut < 0) cut = remaining.lastIndexOf('</div>', target);
          if (cut < 0) cut = remaining.lastIndexOf('</p>', target);
          if (cut < 0) cut = target;
          finalChunks.push(remaining.slice(0, cut));
          remaining = remaining.slice(cut);
        }
        if (remaining) finalChunks.push(remaining);
      }
      return finalChunks;
    };
    const safeSplitIndex = (t: string, approx: number): number => {
      const lower = Math.max(0, approx - 1000);
      const upper = Math.min(t.length, approx + 1000);
      const windowText = t.slice(lower, upper);
      const patterns = ["\n\n", "</div>", "</p>", "\n", " "];
      let best = approx;
      for (const p of patterns) {
        const idx = windowText.lastIndexOf(p, approx - lower);
        if (idx !== -1) { best = lower + idx + p.length; break; }
      }
      if (best !== approx) return best;
      for (const p of patterns) {
        const idx = windowText.indexOf(p, approx - lower);
        if (idx !== -1) { best = lower + idx + p.length; break; }
      }
      return best;
    };
    const content = text || "";
    
    // Retry function for adding messages
    const addMessageWithRetry = async (chatId: string, message: { role: "user" | "assistant"; content: string }, attempt: number = 0): Promise<void> => {
      try {
        const result = await chatApi.addMessage(chatId, message);
        if (!result && attempt < retries) {
          // If addMessage returns null and we have retries left, wait and retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          return addMessageWithRetry(chatId, message, attempt + 1);
        }
      } catch (error: any) {
        const errorText = error?.message || String(error);
        if (errorText.includes('Chat not found') && attempt < retries) {
          console.log(`Chat not found, retrying (attempt ${attempt + 1}/${retries})...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          return addMessageWithRetry(chatId, message, attempt + 1);
        }
        throw error;
      }
    };

    if (content.length <= TARGET_CHARS) {
      await addMessageWithRetry(cid, { role: "assistant", content });
      return;
    }

    const parts = splitHtmlSafely(content, TARGET_CHARS);

    for (const part of parts) {
      await addMessageWithRetry(cid, { role: "assistant", content: part });
    }
  }, [chatSessions]);

  // Helper function to add AI message to chat and save to backend
  const addAIMessage = useCallback(
    async (
      chatId: string,
      content: string,
      forceNewMessage: boolean = false,
      lightningMode?: any
    ) => {
    // Skip empty content messages
    if (!content || content.trim() === '') {
      console.log('🔍 Empty content message detected, skipping...');
      return;
    }
    
    // Check for duplicate content to prevent repeats
    const currentChat = chatSessions.find(chat => chat.id === chatId);
    if (currentChat && !forceNewMessage) {
      const lastMessage = currentChat.messages[currentChat.messages.length - 1];
      if (lastMessage && lastMessage.role === "assistant" && lastMessage.content === content) {
        console.log('🔍 Duplicate message detected, skipping:', content.substring(0, 50) + '...');
        return;
      }
    }
    
    // Update the placeholder AI message with the final content
      setChatSessions((prev) => {
        const updated = prev.map((chat) => {
        if (chat.id === chatId) {
          const messages = [...chat.messages];
          
          // For focus mode or when forced, always add a new message
          if (forceNewMessage) {
            messages.push({
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai`,
                role: "assistant",
              content: content,
                timestamp: Date.now(),
              lightningMode: lightningMode
            } as ChatMessage);
          } else {
            // Find the last assistant message (should be our placeholder)
              const lastAssistantIndex = messages
                .map((m) => m.role)
                .lastIndexOf("assistant");
            if (lastAssistantIndex !== -1) {
              // Update the existing placeholder
              messages[lastAssistantIndex] = {
                ...messages[lastAssistantIndex],
                  content: content,
                lightningMode: lightningMode
              } as ChatMessage;
            } else {
              // Fallback: add new message if no placeholder exists
              messages.push({
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai`,
                  role: "assistant",
                content: content,
                  timestamp: Date.now(),
                lightningMode: lightningMode
              } as ChatMessage);
            }
          }
          return { ...chat, messages };
        }
        return chat;
      });
      
      // Update ref immediately for consistent access
      chatSessionsRef.current = updated;
      
      return updated;
    });

    // Save AI message to backend (split into two parts for large payloads)
    try {
      await saveAssistantMessageSplit(chatId, content);
    } catch (error) {
      console.error("Failed to save AI message:", error);
    }
    },
    [chatSessions, saveAssistantMessageSplit]
  );

  // Restore guest research results after login
  useEffect(() => {
    const restoreGuestResearchResults = async () => {
      // Check if we have guest results to restore
      const preserveOnLogin = localStorage.getItem('researchGPT_preserve_on_login');
      const guestResults = localStorage.getItem('researchGPT_guest_results');
      
      if (preserveOnLogin !== 'true' || !guestResults) {
        return; // No guest results to restore
      }
      
      // Wait for chats to be loaded and user to be authenticated
      if (!isAuthLoading && isAuthenticated && chatsLoaded) {
        try {
          const redirectUrl = localStorage.getItem('researchGPT_redirect_url');
          const guestData = JSON.parse(guestResults);
          
          // Use currentChatId if available, otherwise use chatId from guest data
          const targetChatIdToUse = currentChatId || guestData.chatId;
          
          if (!targetChatIdToUse) {
            console.log('⚠️ No chat ID available for restoration');
            return;
          }
          
          console.log('💾 Restoring guest research results after login for chat:', targetChatIdToUse);
          
          // Ensure chat exists in sessions and has messages loaded
          const chatExists = chatSessions.find(chat => chat.id === targetChatIdToUse);
          
          // If chat doesn't exist or has no messages, load them first
          let loadedMessages: ChatMessage[] = [];
          if (!chatExists || chatExists.messages.length === 0) {
            console.log('📥 Loading chat messages before restoring results');
            try {
              const backendMessages = await chatApi.getMessages(targetChatIdToUse);
              loadedMessages = backendMessages.map((msg: any) => ({
                id: msg.id.toString(),
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.created_at || msg.timestamp).getTime(),
                lightningMode: typeof msg.lightningMode === 'string' 
                  ? JSON.parse(msg.lightningMode) 
                  : msg.lightningMode
              }));
              
              // Update chat sessions with loaded messages
              setDeduplicatedChatSessions(prev => 
                prev.map(chat => 
                  chat.id === targetChatIdToUse 
                    ? { ...chat, messages: loadedMessages }
                    : chat
                )
              );
              
              console.log('📥 Loaded', loadedMessages.length, 'messages for restoration');
            } catch (error) {
              console.error('Failed to load chat messages:', error);
            }
          } else {
            loadedMessages = chatExists.messages;
          }
          
          // Check if message already exists (to avoid duplicates)
          const messageExists = loadedMessages.some(
            msg => msg.role === 'assistant' && 
            msg.content.includes('ResearchGPT Analysis') &&
            msg.content.includes(guestData.query.substring(0, 50))
          );
          
          if (!messageExists) {
            // Add the research results as a new message (forceNewMessage: true)
            await addAIMessage(
              targetChatIdToUse,
              guestData.results,
              true, // Force new message
              {
                type: "research_mode",
                step: "results_restored",
                query: guestData.query,
                timestamp: guestData.timestamp,
              }
            );
            
            // Save to backend now that user is authenticated
            try {
              await chatApi.addMessage(targetChatIdToUse, {
                role: "assistant",
                content: guestData.results,
              });
            } catch (error) {
              console.log('⚠️ Failed to save restored message to backend', error);
            }
          } else {
            console.log('✅ Research results already exist in chat, skipping restoration');
          }
          
          // Clean up guest data
          localStorage.removeItem('researchGPT_guest_results');
          localStorage.removeItem('researchGPT_guest_results_url');
          localStorage.removeItem('researchGPT_guest_query');
          localStorage.removeItem('researchGPT_guest_chatId');
          localStorage.removeItem('researchGPT_guest_timestamp');
          localStorage.removeItem('researchGPT_preserve_on_login');
          localStorage.removeItem('researchGPT_redirect_url');
          
          console.log('✅ Guest research results restored successfully');
        } catch (error) {
          console.error('Error restoring guest research results:', error);
          localStorage.removeItem('researchGPT_guest_results');
          localStorage.removeItem('researchGPT_preserve_on_login');
        }
      }
    };
    
    restoreGuestResearchResults();
  }, [isAuthenticated, isAuthLoading, chatsLoaded, currentChatId, chatSessions, addAIMessage]);
  
  // Retry pending research when authentication completes
  useEffect(() => {
    const retryPendingResearch = async () => {
      if (!isAuthLoading && isAuthenticated && currentChatId) {
        try {
          const pendingResearchData = localStorage.getItem("pendingResearchAfterAuth");
          if (pendingResearchData) {
            const { chatId, query, timestamp } = JSON.parse(pendingResearchData);

            const isCorrectChat = chatId === currentChatId;
            const isNotTooOld = Date.now() - timestamp < 5 * 60 * 1000;

            if (isCorrectChat && isNotTooOld) {
              console.log(
                "🔍 Authentication complete, retrying pending research for chat:",
                chatId,
                "Query:",
                query
              );

              localStorage.removeItem("pendingResearchAfterAuth");

              const researchMetaData = localStorage.getItem("researchMeta");
              if (researchMetaData) {
                try {
                  const researchMeta = JSON.parse(researchMetaData);
                  if (researchMeta.chatId === chatId && researchMeta.query === query) {
                    localStorage.removeItem("researchMeta");

                    console.log("🔍 ResearchGPT triggered after auth, clearing Lightning Mode data");
                    localStorage.removeItem("lightningModeData");
                    localStorage.removeItem("pendingLightningMessage");
                    localStorage.removeItem("lightning_company_summary");
                    localStorage.removeItem("lightning_inputs");
                    localStorage.removeItem("lightningModeResults");

                    await addAIMessage(
                      currentChatId,
                      "🔍 **Welcome to ResearchGPT!**\n\nI'm going to help you conduct comprehensive market research and analysis. Let me analyze your query and provide you with detailed insights from multiple AI models.",
                      true,
                      {
                        type: "research_mode",
                        step: "welcome",
                        query: query,
                        timestamp: Date.now(),
                      }
                    );

                    triggerResearchForMessage(query, chatId).catch((err) => {
                      console.error("Failed to auto-trigger research after authentication:", err);
                    });
                  }
                } catch (error) {
                  console.error("Error parsing research metadata on retry:", error);
                  localStorage.removeItem("researchMeta");
                  localStorage.removeItem("pendingResearchAfterAuth");
                }
              } else {
                console.log("🔍 ResearchMeta not found, but triggering research with stored query");
                localStorage.removeItem("pendingResearchAfterAuth");

                localStorage.removeItem("lightningModeData");
                localStorage.removeItem("pendingLightningMessage");
                localStorage.removeItem("lightning_company_summary");
                localStorage.removeItem("lightning_inputs");
                localStorage.removeItem("lightningModeResults");

                await addAIMessage(
                  currentChatId,
                  "🔍 **Welcome to ResearchGPT!**\n\nI'm going to help you conduct comprehensive market research and analysis. Let me analyze your query and provide you with detailed insights from multiple AI models.",
                  true,
                  {
                    type: "research_mode",
                    step: "welcome",
                    query: query,
                    timestamp: Date.now(),
                  }
                );

                triggerResearchForMessage(query, chatId).catch((err) => {
                  console.error("Failed to auto-trigger research after authentication:", err);
                });
              }
            } else if (!isNotTooOld) {
              localStorage.removeItem("pendingResearchAfterAuth");
            }
          }
        } catch (error) {
          console.error("Error retrying pending research:", error);
          localStorage.removeItem("pendingResearchAfterAuth");
        }
      }
    };

    retryPendingResearch();
  }, [isAuthenticated, isAuthLoading, currentChatId, addAIMessage, triggerResearchForMessage]);

  // Process research results from localStorage when component mounts
  useEffect(() => {
    console.log('🔍 Research results useEffect triggered, currentChatId:', currentChatId);
    const processResearchResults = async () => {
      try {
        console.log('🔍 Checking for stored research results...');
        const storedResults = localStorage.getItem('researchResults');
        console.log('🔍 Stored results:', storedResults);
        console.log('🔍 Current chat ID:', currentChatId);
        
        if (storedResults && currentChatId) {
          const { chatId, query, results } = JSON.parse(storedResults);
          console.log('🔍 Parsed results:', { chatId, query, results });
          console.log('🔍 Chat ID comparison - stored:', chatId, 'current:', currentChatId);
          console.log('🔍 Chat ID match:', chatId === currentChatId);
          
          // Check if this research is for the current chat
          if (chatId === currentChatId) {
            console.log('🔍 Processing stored research results for chat:', chatId);
            
            // Clear the stored results immediately to prevent duplicate processing
            localStorage.removeItem('researchResults');
            console.log('🔍 Cleared localStorage to prevent duplicates');
            
            // Format the research results for display
            // Check if the results already contain proper formatting
            const hasProperFormatting = results.gemini?.includes('# ') || 
                                       results.gpt4o?.includes('# ') || 
                                       results.perplexity?.includes('# ');
            
            let formattedResult = `# 🔍 ResearchGPT Analysis\n\n`;
            
            // Only add header if results don't already have proper formatting
            if (!hasProperFormatting) {
              formattedResult = `# 🔍 ResearchGPT Analysis\n\n`;
              formattedResult += `> **Query:** ${query}\n`;
              formattedResult += `> **Status:** Research completed\n\n`;
            }
            
            // Add results from each model
            if (results.gemini) {
              formattedResult += `${results.gemini}\n\n`;
            }
            if (results.gpt4o) {
              // Only add section header if the content doesn't already have one
              if (!results.gpt4o.includes('## ') && !hasProperFormatting) {
                formattedResult += `## GPT-4O Analysis\n\n${results.gpt4o}\n\n`;
              } else {
                formattedResult += `${results.gpt4o}\n\n`;
              }
            }
            if (results.perplexity) {
              // Only add section header if the content doesn't already have one
              if (!results.perplexity.includes('## ') && !hasProperFormatting) {
                formattedResult += `## Perplexity Analysis\n\n${results.perplexity}\n\n`;
              } else {
                formattedResult += `${results.perplexity}\n\n`;
              }
            }
            
            // Add timestamp only if we added the main header
            if (!hasProperFormatting) {
              const now = new Date();
              const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              formattedResult += `*Research completed on ${now.toLocaleString()} ${timezone} using ResearchGPT*`;
            }
            
            // Add the research results to the chat
            console.log('🔍 About to call addAIMessage with:', { currentChatId, formattedResult: formattedResult.substring(0, 200) + '...' });
            await addAIMessage(currentChatId, formattedResult);
            console.log('🔍 addAIMessage completed');
            
            // Reload messages to show the new research results
            console.log('🔍 Reloading messages to show research results...');
            const backendMessages = await chatApi.getMessages(currentChatId);
            const formattedMessages: ChatMessage[] = backendMessages.map((msg: any) => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp).getTime(),
              lightningMode: msg.lightningMode
            }));
            setDeduplicatedChatSessions(prev => 
              prev.map(chat => 
                chat.id === currentChatId 
                  ? { ...chat, messages: formattedMessages }
                  : chat
              )
            );
            console.log('🔍 Messages reloaded');
            
            console.log('🔍 Research results added to chat successfully');
          }
        }
      } catch (error) {
        console.error('Error processing research results:', error);
      }
    };
    
    if (currentChatId) {
      processResearchResults();
    }
  }, [currentChatId, addAIMessage]);

  // Additional useEffect to process research results when currentChatId changes
  useEffect(() => {
    console.log('🔍 currentChatId changed, checking for research results...');
    if (currentChatId) {
      const storedResults = localStorage.getItem('researchResults');
      if (storedResults) {
        console.log('🔍 Found stored results, processing...');
        const { chatId } = JSON.parse(storedResults);
        if (chatId === currentChatId) {
          console.log('🔍 Chat ID matches, triggering research results processing...');
          // Clear the stored results immediately to prevent duplicate processing
          localStorage.removeItem('researchResults');
          console.log('🔍 Cleared localStorage to prevent duplicates');
          
          // Trigger the research results processing
          const processResearchResults = async () => {
            try {
              const { query, results } = JSON.parse(storedResults);
              console.log('🔍 Processing research results for chat:', currentChatId);
              
              // Format the research results for display
              // Check if the results already contain proper formatting
              const hasProperFormatting = results.gemini?.includes('# ') || 
                                         results.gpt4o?.includes('# ') || 
                                         results.perplexity?.includes('# ');
              
              let formattedResult = '';
              
              // Only add header if results don't already have proper formatting
              if (!hasProperFormatting) {
                formattedResult = `# 🔍 ResearchGPT Analysis\n\n`;
                formattedResult += `> **Query:** ${query}\n`;
                formattedResult += `> **Status:** Research completed\n\n`;
              }
              
              // Add results from each model
              if (results.gemini) {
                formattedResult += `${results.gemini}\n\n`;
              }
              if (results.gpt4o) {
                // Only add section header if the content doesn't already have one
                if (!results.gpt4o.includes('## ') && !hasProperFormatting) {
                  formattedResult += `## GPT-4O Analysis\n\n${results.gpt4o}\n\n`;
                } else {
                  formattedResult += `${results.gpt4o}\n\n`;
                }
              }
              if (results.perplexity) {
                // Only add section header if the content doesn't already have one
                if (!results.perplexity.includes('## ') && !hasProperFormatting) {
                  formattedResult += `## Perplexity Analysis\n\n${results.perplexity}\n\n`;
                } else {
                  formattedResult += `${results.perplexity}\n\n`;
                }
              }
              
              // Add timestamp only if we added the main header
              if (!hasProperFormatting) {
                const now = new Date();
                const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                formattedResult += `*Research completed on ${now.toLocaleString()} ${timezone} using ResearchGPT*`;
              }
              
              // Add the research results to the chat
              console.log('🔍 About to call addAIMessage with:', { currentChatId, formattedResult: formattedResult.substring(0, 200) + '...' });
              await addAIMessage(currentChatId, formattedResult);
              console.log('🔍 addAIMessage completed');
              
              // Reload messages to show the new research results
              console.log('🔍 Reloading messages to show research results...');
              const backendMessages = await chatApi.getMessages(currentChatId);
              const formattedMessages: ChatMessage[] = backendMessages.map((msg: any) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: new Date(msg.timestamp).getTime(),
                lightningMode: msg.lightningMode
              }));
              setDeduplicatedChatSessions(prev => 
                prev.map(chat => 
                  chat.id === currentChatId 
                    ? { ...chat, messages: formattedMessages }
                    : chat
                )
              );
              console.log('🔍 Messages reloaded');
              
              console.log('🔍 Research results added to chat successfully');
            } catch (error) {
              console.error('Error processing research results:', error);
            }
          };
          processResearchResults();
        }
      }
    }
  }, [currentChatId, addAIMessage]);
  // ResearchGPT function for direct chat research (Multi-GPT endpoint)
  const handleResearchInChat = useCallback(async (query: string): Promise<void> => {
    if (!query.trim()) return;
    const chatId = currentChatId;
    if (!chatId) return;
    // Allow guest users to execute research - gate will show AFTER results
    // Authentication check removed for better UX
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_user`,
      role: "user",
      content: query,
      timestamp: Date.now(),
    };
    setDeduplicatedChatSessions((prev) => {
      const updated = prev.map((chat) =>
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, userMessage] } 
          : chat
      );
      return updated;
    });
    // Placeholder AI message
    const placeholderMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai_placeholder`,
      role: "assistant",
      content: `# 🔍 ResearchGPT Analysis\n\n> **Status:** Starting research...\n> **Query:** ${query}\n> **Configuration:** ${researchGPTConfig.category} - ${researchGPTConfig.depth}\n\n*Please wait while I analyze your request across multiple AI models...*`,
      timestamp: Date.now(),
    };
    setDeduplicatedChatSessions((prev) => {
      const updated = prev.map((chat) =>
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, placeholderMessage] } 
          : chat
      );
      return updated;
    });
    try {
      const payload = {
        query,
        category: researchGPTConfig.category,
        depth: researchGPTConfig.depth,
        timeframe: researchGPTConfig.timeframe,
        geographic_scope: researchGPTConfig.geoScope,
        website_url: null,
        website_url_2: null,
        company_size: researchGPTConfig.companySize,
        revenue_category: researchGPTConfig.revenueCategory,
        focus_on_leads: false,
        web_search_enabled: researchGPTConfig.useWebSearch,
        selected_models: researchGPTConfig.selectedModels,
        deep_research: true,
        include_founders: true,
        include_products: true,
        analyze_sales_opportunities: false,
        include_tabular_data: true,
        extract_company_info: true,
        analyze_prospective_clients: false,
        include_employee_count: true,
        include_revenue_data: true,
        include_complete_urls: true,
        perplexity_model: 'llama-3.1-sonar-large-128k-online'
      } as any;
      const response = await fetch('/api/multi-research-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        // If unauthorized (401) and guest user, show signup popup instead of error
        if (response.status === 401 && !isAuthenticated) {
          console.log('🔐 401 Unauthorized - showing ResearchGPT gate for guest user');
          setShowResearchGPTGate(true);
          
          // Remove the placeholder message since we're showing the gate
          setDeduplicatedChatSessions((prev) => {
            const updated = prev.map((chat) => {
              if (chat.id === chatId) {
                const messages = chat.messages.filter(m => m.id !== placeholderMessage.id);
                return { ...chat, messages };
              }
              return chat;
            });
            return updated;
          });
          return;
        }
        
        throw new Error(`Research failed: ${response.status}`);
      }
      const data = await response.json();
      // Check if the results already contain proper formatting
      const hasProperFormatting = data.gemini?.includes('# ') || 
                                 data.gpt4o?.includes('# ') || 
                                 data.perplexity?.includes('# ');
      
      let formattedResult = '';
      
      // Only add header if results don't already have proper formatting
      if (!hasProperFormatting) {
        formattedResult = `# 🔍 ResearchGPT Analysis\n\n`;
        formattedResult += `**Configuration:** ${researchGPTConfig.category} - ${researchGPTConfig.depth} - ${researchGPTConfig.geoScope}\n\n`;
      }
      
      if (researchGPTConfig.selectedModels.gpt4o && data.gpt4o) {
        // Only add section header if the content doesn't already have one
        if (!data.gpt4o.includes('## ') && !hasProperFormatting) {
          formattedResult += `## 🤖 GPT-4O Analysis\n\n${data.gpt4o}\n\n---\n\n`;
        } else {
          formattedResult += `${data.gpt4o}\n\n---\n\n`;
        }
      }
      if (researchGPTConfig.selectedModels.gemini && data.gemini) {
        formattedResult += `${data.gemini}\n\n---\n\n`;
      }
      if (researchGPTConfig.selectedModels.perplexity && data.perplexity) {
        // Only add section header if the content doesn't already have one
        if (!data.perplexity.includes('## ') && !hasProperFormatting) {
          formattedResult += `## 🔍 Perplexity Analysis\n\n${data.perplexity}\n\n---\n\n`;
        } else {
          formattedResult += `${data.perplexity}\n\n---\n\n`;
        }
      }
      
      // Add timestamp only if we added the main header
      if (!hasProperFormatting) {
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        formattedResult += `*Research completed on ${now.toLocaleString()} ${timezone} using Multi-GPT Research*`;
      }
      setDeduplicatedChatSessions((prev) => {
        const updated = prev.map((chat) => {
          if (chat.id === chatId) {
            const messages = [...chat.messages];
            const idx = messages.findIndex(m => m.id === placeholderMessage.id);
            if (idx !== -1) {
              messages[idx] = { ...messages[idx], content: formattedResult };
            }
            return { ...chat, messages };
          }
          return chat;
        });
        return updated;
      });
      await chatApi.addMessage(chatId, { role: 'assistant', content: formattedResult });
      // Post follow-up CTA to confirm website and enter Lightning Mode (website only)
      {
        const followUpMessage: ChatMessage = {
          id: `msg_${Date.now()}_cta_lightning`,
          role: "assistant",
          content: `<div class=\"glass-container rounded-xl p-4 border border-blue-400/30 bg-gradient-to-r from-blue-950/40 to-black/40 backdrop-blur-xl max-w-xl mx-auto my-3 shadow-lg\">\n  <div class=\"flex items-center justify-between gap-3\">\n    <div class=\"flex-1 mr-2\">\n      <p class=\"text-white text-sm font-semibold\">Ready to generate leads?</p>\n      <p class=\"text-blue-300/80 text-xs\">Confirm your website to start Lightning Mode. Only the website will be used.</p>\n    </div>\n    <div class=\"flex gap-2\">\n      <button onclick=\"window.openResearchWebsitePrompt && window.openResearchWebsitePrompt()\" \n         class=\"px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 shadow-md border border-blue-500/60 text-xs cursor-pointer whitespace-nowrap\">\n        Confirm Website\n      </button>\n      <button \n         class=\"px-3 py-2 rounded-lg font-medium text-blue-200 bg-white/5 hover:bg-white/10 transition-all duration-200 border border-blue-500/20 text-xs cursor-pointer whitespace-nowrap\">\n        Stay in Chat\n      </button>\n    </div>\n  </div>\n</div>`,
          timestamp: Date.now(),
        };
        setDeduplicatedChatSessions((prev) => {
          const updated = prev.map((chat) =>
            chat.id === chatId ? { ...chat, messages: [...chat.messages, followUpMessage] } : chat
          );
          return updated;
        });
        try { await chatApi.addMessage(chatId, { role: 'assistant', content: followUpMessage.content }); } catch {}
        setShowResearchWebsitePrompt(true);
      }
    } catch (error) {
      console.error('ResearchGPT error:', error);
      
      // Check if error is related to authentication (401)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const isUnauthorized = errorMessage.includes('401') || errorMessage.includes('Unauthorized');
      
      if (isUnauthorized && !isAuthenticated) {
        console.log('🔐 Unauthorized error detected - showing ResearchGPT gate for guest user');
        setShowResearchGPTGate(true);
        
        // Remove the placeholder message since we're showing the gate
        setDeduplicatedChatSessions((prev) => {
          const updated = prev.map((chat) => {
            if (chat.id === chatId) {
              const messages = chat.messages.filter(m => m.id !== placeholderMessage.id);
              return { ...chat, messages };
            }
            return chat;
          });
          return updated;
        });
        return;
      }
      
      // Update placeholder with error message for other errors
      const formattedErrorMessage = `# ❌ ResearchGPT Error\n\n> **Error:** Sorry, I encountered an error while researching: ${errorMessage}\n\n> **Solution:** Please try again or check your research configuration.\n\n---\n\n*If the problem persists, please contact support.*`;
      setDeduplicatedChatSessions((prev) => {
        const updated = prev.map((chat) => {
          if (chat.id === chatId) {
            const messages = [...chat.messages];
            const idx = messages.findIndex(m => m.id === placeholderMessage.id);
            if (idx !== -1) {
              messages[idx] = { ...messages[idx], content: formattedErrorMessage };
            }
            return { ...chat, messages };
          }
          return chat;
        });
        return updated;
      });
    }
  }, [currentChatId, setDeduplicatedChatSessions, researchGPTConfig, setShowResearchGPTGate, isAuthenticated]);

  // Chat container ref for auto-scroll
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const onboardingContainerRef = useRef<HTMLDivElement>(null); // Add ref for onboarding chat
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const previousScrollHeightRef = useRef(0);
  const scrollCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userScrolledRef = useRef(false);

  // Auto-scroll to bottom function
  const scrollToBottom = useCallback(
    (force = false) => {
      const containerRef = isOnboardingChat
        ? onboardingContainerRef
        : chatContainerRef;
    
    if (containerRef.current && (shouldAutoScroll || force)) {
      // Use both setTimeout and requestAnimationFrame for reliability
      const performScroll = () => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      };
      
      // Immediate scroll
      performScroll();
      
      // Delayed scroll to handle dynamic content
      setTimeout(performScroll, 10);
      setTimeout(performScroll, 50);
      setTimeout(performScroll, 100);
    }
    },
    [shouldAutoScroll, isOnboardingChat]
  );

  // Enhanced scroll function specifically for Lightning Mode
  const scrollToBottomLightning = useCallback(
    (smooth = true) => {
      const containerRef = isOnboardingChat
        ? onboardingContainerRef
        : chatContainerRef;
    
    if (containerRef.current) {
      const performLightningScroll = () => {
        if (containerRef.current) {
          if (smooth) {
            containerRef.current.scrollTo({
              top: containerRef.current.scrollHeight,
              behavior: 'smooth'
            });
          } else {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        }
      };
      
      // Immediate scroll
      performLightningScroll();
      
      // Multiple delayed scrolls to ensure content is visible
      setTimeout(performLightningScroll, 50);
      setTimeout(performLightningScroll, 150);
      setTimeout(performLightningScroll, 300);
      setTimeout(performLightningScroll, 500);
    }
    },
    [isOnboardingChat]
  );

  // More responsive scroll detection - checks scroll position changes
  const handleScroll = useCallback(() => {
    const containerRef = isOnboardingChat
      ? onboardingContainerRef
      : chatContainerRef;
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10; // Slightly looser threshold
    
    // Mark that user has manually scrolled
    userScrolledRef.current = true;
    
    // Show/hide scroll down indicator
    setShowScrollDown(!isAtBottom && scrollHeight > clientHeight);
    
    // If user scrolled to bottom manually, enable auto-scroll
    if (isAtBottom) {
      setShouldAutoScroll(true);
      userScrolledRef.current = false;
    } else {
      // If user scrolled away from bottom, disable auto-scroll
      setShouldAutoScroll(false);
    }
    
    // Clear any pending scroll checks
    if (scrollCheckTimeoutRef.current) {
      clearTimeout(scrollCheckTimeoutRef.current);
    }
    
    // Check if content height changed (new content) and we should auto-scroll
    scrollCheckTimeoutRef.current = setTimeout(() => {
      if (containerRef.current) {
        const currentScrollHeight = containerRef.current.scrollHeight;
        
        // If scroll height increased and we're near bottom, enable auto-scroll
        if (
          currentScrollHeight > previousScrollHeightRef.current &&
          isAtBottom
        ) {
          setShouldAutoScroll(true);
          scrollToBottom(true);
        }
        
        previousScrollHeightRef.current = currentScrollHeight;
      }
    }, 50);
  }, [scrollToBottom, isOnboardingChat]);

  // Auto-scroll when new messages arrive or typing updates
  useEffect(() => {
    const containerRef = isOnboardingChat
      ? onboardingContainerRef
      : chatContainerRef;
    if (containerRef.current && shouldAutoScroll && !isProcessing) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50; // More lenient threshold
      
      // Only auto-scroll if shouldAutoScroll is true and user is near bottom
      // Also don't auto-scroll while processing to prevent upward movement
      if (isNearBottom) {
        scrollToBottom(true);
      }
    }
  }, [
    currentChat?.messages?.length,
    displayedResult,
    isProcessing,
    scrollToBottom,
    shouldAutoScroll,
    isOnboardingChat,
    onboardingMessages?.length,
    onboardingDisplayedText,
  ]);

  // Enhanced auto-scroll for Lightning Mode messages
  useEffect(() => {
    const containerRef = isOnboardingChat
      ? onboardingContainerRef
      : chatContainerRef;
    
    if (!containerRef.current) return;

    // Check if the latest message is a Lightning Mode message
    const latestMessage = currentChat?.messages?.slice(-1)[0];
    const isLightningModeMessage = latestMessage?.lightningMode;
    
    if (isLightningModeMessage && shouldAutoScroll) {
      // Use the enhanced Lightning Mode scroll function
      scrollToBottomLightning(true);
    }
  }, [
    currentChat?.messages?.length,
    isOnboardingChat,
    shouldAutoScroll,
    scrollToBottomLightning
  ]);

  // Track scroll height changes for auto-scroll trigger
  useEffect(() => {
    const containerRef = isOnboardingChat
      ? onboardingContainerRef
      : chatContainerRef;
    if (containerRef.current) {
      previousScrollHeightRef.current = containerRef.current.scrollHeight;
    }
  }, [
    currentChat?.messages?.length,
    onboardingMessages?.length,
    isOnboardingChat,
  ]);

  // Reset auto-scroll when switching chats
  useEffect(() => {
    setShouldAutoScroll(true);
    setShowScrollDown(false);
    userScrolledRef.current = false;
    if (scrollCheckTimeoutRef.current) {
      clearTimeout(scrollCheckTimeoutRef.current);
    }
  }, [currentChatId]);

  // Text suggestions
  const textSuggestions: string[] = [
    "Create my ICP list",
"Generate leads",
"Identify target audience",
"Start campaign",
"Verify my list",
"Enrich my list",
"Leads from healthcare companies"
  ];


  // Slideshow placeholders for sales questions with responses
  const placeholderQuestions: { question: string; response: string }[] = [
    {
      question: "Please share your company website.",
      response: "My company website is :"
    },
    {
      question: "Please share your company's LinkedIn profile URL.",
      response: "Our company's LinkedIn profile is :"
    },
    {
      question: "Please enter your company email ID to get started.",
      response: "My company email ID is :"
    },
    {
      question: "Please share your personal LinkedIn profile URL.",
      response: "My personal LinkedIn profile is :"
    },
    {
      question: "Please share your full name to personalize your experience.",
      response: "My full name is :"
    },
    {
      question: "Enter your full name to get started with the session.",
      response: "My full name is :"
    },
    {
      question: "What's your monthly spend on lead generation/customer acquisition?",
      response: "My monthly spend on lead generation is :"
    },
    {
      question: "What's your monthly lead generation target?",
      response: "My monthly lead generation target is :"
    }
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Slideshow effect for placeholders with extra dwell time on the first prompt
  useEffect(() => {
    // Don't run slideshow if user is typing, text is present, hovered, or paused
    if (input.length > 0 || isHovered || isPaused) {
      return;
    }

    const baseDelay = 3000;
    const extraDelayForWebsitePrompt = currentPlaceholder === 0 ? 7000 : 0;
    let animationTimeout: NodeJS.Timeout | null = null;

    const rotationTimeout = setTimeout(() => {
      setIsAnimating(true);
      animationTimeout = setTimeout(() => {
        setCurrentPlaceholder(
          (prev) => (prev + 1) % placeholderQuestions.length
        );
        setIsAnimating(false);
      }, 300); // Half of the transition duration
    }, baseDelay + extraDelayForWebsitePrompt);

    return () => {
      clearTimeout(rotationTimeout);
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, [
    placeholderQuestions.length,
    input.length,
    isHovered,
    isPaused,
    currentPlaceholder,
  ]);

  const [highlightModels, setHighlightModels] = useState(false);
  // Dock navigation items
  const dockItems = [
    {
      icon: <Home className="text-blue-400 h-5 w-5" size={18} />,
      label: "Home",
      onClick: () => (window.location.href = "/"),
      className: "text-blue-400 hover:bg-blue-500/20",
    },
    {
      icon: <Package className="text-blue-400 h-5 w-5" size={18} />,
      label: "Platforms",
      onClick: () => (window.location.href = "/platforms/contact-intelligence"),
      className: "text-blue-400 hover:bg-blue-500/20",
    },
    {
      icon: <Building2 className="text-blue-400 h-5 w-5" size={18} />,
      label: "Services",
      onClick: () => (window.location.href = "/services/data-enrichment"),
      className: "text-blue-400 hover:bg-blue-500/20",
    },
    {
      icon: <Info className="text-blue-400 h-5 w-5" size={18} />,
      label: "About",
      onClick: () => (window.location.href = "/"),
      className: "text-blue-400 hover:bg-blue-500/20",
    },
    {
      icon: <Phone className="text-blue-400 h-5 w-5" size={18} />,
      label: "Contact",
      onClick: () => (window.location.href = "/contact"),
      className: "text-blue-400 hover:bg-blue-500/20",
    },
    {
      icon: <Calendar className="text-white h-5 w-5" size={18} />,
      label: "BOOK A MEETING",
      onClick: () => (window.location.href = "https://outlook.office.com/book/Website.Booking@salescentri.com/?ismsaljsauthenabled"),
      className:
        "bg-blue-600/80 border-blue-500/30 hover:bg-blue-600 text-white",
      "data-track": "psa_suite_book_meeting",
    },
  ];
  // Function to handle logo click: refresh if in onboarding focus mode, else go home
  const handleLogoClick = (): void => {
    if (activeMode === "focus" && (isOnboardingMode || isOnboardingChat)) {
      if (typeof window !== "undefined") {
        window.location.reload();
      }
      return;
    }
    navigateHome();
  };

  // Type text specifically for onboarding messages
  const typeOnboardingMessage = useCallback(
    (messageIndex: number, text: string): void => {
    const formattedText = formatAIText(text);
    
    setOnboardingTypingIndex(messageIndex);
      setOnboardingDisplayedText("");
    setIsOnboardingTyping(true);
    
    let index = 0;
    const TYPING_SPEED = 1; // Very fast typing for onboarding
    
    const typeStep = () => {
      if (index < formattedText.length) {
        const charsToAdd = Math.min(15, formattedText.length - index); // Add 15 chars at once for much faster animation
        const newText = formattedText.substring(0, index + charsToAdd);
        setOnboardingDisplayedText(newText);
        index += charsToAdd;
        setTimeout(typeStep, TYPING_SPEED);
      } else {
        // When typing is finished, just stop the animation without updating content
        setIsOnboardingTyping(false);
        setOnboardingTypingIndex(-1);
        setOnboardingDisplayedText(formattedText); // Keep the final text
      }
    };  
    
    typeStep();
    },
    []
  );
// Simple AI text formatter - let the AI provide the correct output format
function formatAIText(text: string): string {
    console.log("🎨 FORMAT AI TEXT: Input length:", text.length);
  
  // First, normalize line endings
  const normalizedText = text
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\r/g, "\n") // Convert any remaining \r to \n
    .trim();
  
  // CHECK FOR BUTTONS FIRST - before any aggressive cleaning
    const containsButtons =
      normalizedText.includes("<button") || normalizedText.includes("onclick=");
  
  if (containsButtons) {
      console.log(
        "🔘 DETECTED: HTML with buttons - preserving button functionality EARLY"
      );
      console.log("🔍 BUTTON HTML CONTENT (RAW):", normalizedText);
    
    // For button content, do minimal cleaning to preserve HTML structure
    let processedHtml = normalizedText;
    
    // Only do safe markdown processing for buttons
      processedHtml = processedHtml.replace(
        /\*\*([^*]+)\*\*/g,
        "<strong>$1</strong>"
      );
      processedHtml = processedHtml.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    
    // Return HTML content directly without aggressive cleaning
    const wrappedContent = `<markdown-style>\n${processedHtml}\n</markdown-style>`;
      console.log(
        "✅ HTML BUTTONS FORMAT COMPLETE (EARLY) - Final HTML:",
        wrappedContent
      );
    return wrappedContent;
  }
  
  // For non-button content, do the aggressive cleaning
  let cleanText = normalizedText;
  
  // Remove ALL markdown code block artifacts and formatting - ENHANCED
    cleanText = cleanText.replace(/```\s*html/gi, "");
    cleanText = cleanText.replace(/```\s*$/gm, "");
    cleanText = cleanText.replace(/^```\s*/gm, "");
    cleanText = cleanText.replace(/```html\s*/gi, "");
    cleanText = cleanText.replace(/```\s*\n/gi, "");
    cleanText = cleanText.replace(/\n```/gi, "");
    cleanText = cleanText.replace(/```/g, "");
  
  // Enhanced markdown header removal for lead generation ONLY (keep headings for analysis)
    const isLeadGenResult = /<table/i.test(cleanText) || /Target Companies|Lead Generation/i.test(cleanText);
    if (isLeadGenResult) {
      cleanText = cleanText.replace(/###\s*\d+\)\s*[^#\n]*/gi, ""); // Remove "### 1) Small Companies..."
      cleanText = cleanText.replace(/###\s*[^#\n]*/gi, ""); // Remove any "### text"
      cleanText = cleanText.replace(/####\s*[^#\n]*/gi, ""); // Remove any "#### text"
      cleanText = cleanText.replace(/#{1,6}\s*[^#\n]*/gi, ""); // Remove any markdown headers
    }
  
  // Remove lead generation specific text patterns
    cleanText = cleanText.replace(/Below are the[^:]*:/gi, ""); // Remove intro text
    cleanText = cleanText.replace(/formatted as HTML tables:\s*/gi, ""); // Remove formatting reference
    cleanText = cleanText.replace(/Below are the targeted[^:]*:/gi, ""); // Remove specific intro
  
  // Preserve paragraph spacing: collapse 3+ newlines to exactly two, keep blank lines
    cleanText = cleanText.replace(/\n{3,}/g, "\n\n");
  
  // Check if the text already contains HTML (tables, etc.)
    const containsHtml = cleanText.includes("<") && cleanText.includes(">");
  
  if (containsHtml) {
      console.log("🔍 DETECTED: HTML content - processing HTML");
    
    // At this point, we already handled buttons above, so this is tables/other HTML
      console.log("🔍 DETECTED: HTML content - processing tables");
    
    // Add proper table classes and structure for alignment
    let processedHtml = cleanText;
    
    // Process markdown bold text in HTML content
      processedHtml = processedHtml.replace(
        /\*\*([^*]+)\*\*/g,
        "<strong>$1</strong>"
      );
      processedHtml = processedHtml.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    
    // Add lead-table class to tables that don't have it
      processedHtml = processedHtml.replace(
        /<table(?![^>]*class)/gi,
        '<table class="lead-table"'
      );
      processedHtml = processedHtml.replace(
        /<table\s+class="([^"]*)"(?![^>]*lead-table)/gi,
        '<table class="$1 lead-table"'
      );
    // Use fixed layout for better column width control
    processedHtml = processedHtml.replace(
      /<table([^>]*)class="([^"]*\blead-table\b[^"]*)"([^>]*)>/gi,
        (_m, preAttrs, cls, postAttrs) =>
          `<table${preAttrs} class="${cls}" style="table-layout: fixed; width: auto; border-collapse: collapse;"${postAttrs}>`
    );
    
    // Make URLs clickable in table cells - handle both Website and LinkedIn URL columns
    processedHtml = processedHtml.replace(
      /(<td[^>]*>)(https?:\/\/[^\s<]+)(<\/td>)/gi, 
      '$1<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline;">$2</a>$3'
    );
    
    // Handle LinkedIn URLs specifically
    processedHtml = processedHtml.replace(
      /(<td[^>]*>)(https:\/\/linkedin\.com\/[^\s<]+)(<\/td>)/gi,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline;">$2</a>$3'
    );
    
    // Apply consistent styling to table cells (widths will be normalized by the table normalization function)
      processedHtml = processedHtml.replace(
        /<th([^>]*)>/gi,
        `<th$1 style="text-align: left; vertical-align: top; white-space: nowrap;">`
      );
      processedHtml = processedHtml.replace(
        /<td([^>]*)>/gi,
        `<td$1 style="text-align: left; vertical-align: top; word-break: keep-all; white-space: nowrap; overflow-wrap: normal; hyphens: none;">`
      );

    // If content includes lead tables, normalize structure to prevent header/data misalignment
    const normalizeLeadTable = (tableHtml: string): string => {
      try {
        const rows = tableHtml.match(/<tr[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return tableHtml;

        // Find header row: prefer first row with any <th>, otherwise the first row
        let headerIndex = rows.findIndex((r) => /<th\b/i.test(r));
        if (headerIndex === -1) headerIndex = 0;

        // Get the actual header row to determine column count
        const headerRow = rows[headerIndex];
        // Allow headers encoded as either <th> or <td>
        const headerCellsAny =
          headerRow.match(/<t[hd]\b[^>]*>[\s\S]*?<\/t[hd]>/gi) || [];
        const columnCount = headerCellsAny.length;
        
          console.log("🔍 Table analysis:", {
            headerIndex,
            columnCount,
            headerCells: headerCellsAny.map((c) =>
              c.replace(/<[^>]*>/g, "").trim()
            ),
          });
        
        if (columnCount === 0) {
            console.log("⚠️ No header cells found, returning original table");
          return tableHtml;
        }

        // Validate column order and fix if needed
        const expectedHeaders = [
            "Company Name",
            "Website",
            "Industry",
            "Sub-Industry",
            "Product Line",
            "Use Case",
            "Employees",
            "Revenue",
            "Location",
            "Key Decision Maker",
            "Designation",
            "Pain Points",
            "Approach Strategy",
          ];

        const actualHeaders = headerCellsAny.map((c) =>
            c.replace(/<[^>]*>/g, "").trim()
          );
          console.log("🔍 Expected headers:", expectedHeaders);
          console.log("🔍 Actual headers:", actualHeaders);
        
        // Check if headers are in wrong order and need reordering
        let needsReordering = false;
        if (actualHeaders.length === expectedHeaders.length) {
          for (let i = 0; i < actualHeaders.length; i++) {
              if (
                !actualHeaders[i]
                  .toLowerCase()
                  .includes(expectedHeaders[i].toLowerCase()) &&
                !expectedHeaders[i]
                  .toLowerCase()
                  .includes(actualHeaders[i].toLowerCase())
              ) {
              needsReordering = true;
              break;
            }
          }
        }
        
        if (needsReordering) {
            console.log(
              "⚠️ Column order mismatch detected, attempting to fix..."
            );
          // For now, return original table and let CSS handle it
          // TODO: Implement column reordering logic if needed
        }

        // Let the browser determine column widths based on content
        const normalizedHeaderCells = headerCellsAny.map((cell) => {
          // Extract the content between <th> tags
          const content = cell
            .replace(/<th[^>]*>([\s\S]*?)<\/th>/i, "$1")
            .replace(/<td[^>]*>([\s\S]*?)<\/td>/i, "$1");
          
          console.log(`📏 Header cell content: "${content.trim()}"`);
          
          return `<th style="text-align: left; vertical-align: top; white-space: nowrap;">${content}</th>`;
        });

        // Build normalized header
          const headerHtml = `<tr>${normalizedHeaderCells.join("")}</tr>`;

        // Build normalized body rows
        const normalizedRows: string[] = rows
          .filter((r, idx) => idx !== headerIndex)
            .map((r) => {
            // Accept both td and th in body rows (LLMs sometimes mix)
            const cells = r.match(/<t[hd]\b[^>]*>[\s\S]*?<\/t[hd]>/gi) || [];
            const normalizedCells: string[] = [];
            
            // Ensure each row has the same number of columns as the header
            for (let i = 0; i < columnCount; i++) {
              const cell = cells[i] || `<td>N/A</td>`;
              // Extract content and apply styling
              const content = cell
                .replace(/<td[^>]*>([\s\S]*?)<\/td>/i, "$1")
                .replace(/<th[^>]*>([\s\S]*?)<\/th>/i, "$1");
              
              // Force single-line cells and strip <br> and paragraph tags
                const sanitizedContent = content
                  .replace(/<br\s*\/?>(\s*)/gi, ' ')
                  .replace(/\n+/g, ' ')
                  .replace(/<p[^>]*>/gi, '')
                  .replace(/<\/p>/gi, ' ');
                const textWrapping =
                  "word-break: keep-all; white-space: nowrap; overflow-wrap: normal; hyphens: none; writing-mode: horizontal-tb; text-orientation: mixed; direction: ltr;";
              
              const styled = `<td style=\"text-align: left; vertical-align: top; ${textWrapping}\">${sanitizedContent}</td>`;
              normalizedCells.push(styled);
            }
              return `<tr>${normalizedCells.join("")}</tr>`;
          });

        // Replace table content wholesale
          const inner = normalizedRows.join("");
        const out = tableHtml
            .replace(/<thead[\s\S]*?<\/thead>/i, "")
            .replace(/<tbody[\s\S]*?<\/tbody>/i, "")
            .replace(
              /(<table[^>]*>)[\s\S]*?(<\/table>)/i,
              `$1${headerHtml}${inner}$2`
            );
        return out;
      } catch (error) {
          console.error("Table normalization error:", error);
        // Fallback: ensure table has lead-table class and basic styling
        return tableHtml
          .replace(/<table(?![^>]*class)/gi, '<table class="lead-table"')
            .replace(
              /<table\s+class="([^"]*)"(?![^>]*lead-table)/gi,
              '<table class="$1 lead-table"'
            );
      }
    };

    // Normalize ALL tables to ensure proper alignment
      processedHtml = processedHtml.replace(
        /<table[\s\S]*?<\/table>/gi,
        (tbl) => {
          console.log("🔧 Normalizing table:", tbl.substring(0, 200) + "...");
      const normalized = normalizeLeadTable(tbl);
          console.log(
            "🔧 Normalized table result:",
            normalized.substring(0, 200) + "..."
          );
      return normalized;
        }
      );

    // Wrap tables with container for better horizontal scrolling and expand table to content width
      processedHtml = processedHtml.replace(
        /<table/gi,
      '<div class="table-container" style="overflow-x: auto; margin: 1rem 0; width: 100%;"><table style="width: max-content; table-layout: auto;"'
      );
      processedHtml = processedHtml.replace(/<\/table>/gi, "</table></div>");
    
    const wrappedContent = `<markdown-style>\n${processedHtml}\n</markdown-style>`;
      console.log("✅ HTML TABLE FORMAT COMPLETE");
    return wrappedContent;
  }
  
  // For pure markdown content, convert to HTML
  let htmlContent = String(markdown(cleanText));
  
  // Format headings properly for lead generation results
    htmlContent = htmlContent.replace(
      /###\s*(Small Companies|Medium Companies|Large Companies|Competitor Analysis)/gi,
      "<h3>$1</h3>"
    );
    htmlContent = htmlContent.replace(
      /####\s*(Small Companies|Medium Companies|Large Companies)/gi,
      "<h4>$1</h4>"
    );
  
  // Preserve paragraph spacing (do not collapse double newlines)
  
  // Wrap with markdown-style
  const wrappedContent = `<markdown-style>\n${htmlContent}\n</markdown-style>`;
  
    console.log("🎯 FORMAT COMPLETE: Final length:", wrappedContent.length);
  return wrappedContent;
}

// Minimal formatter for grounded responses (no table normalization or export hooks)
function formatGroundedText(cleanText: string): string {
  try {
    // First render markdown to HTML
    let html = String(markdown(cleanText));

    // Convert markdown tables (and basic HTML tables) into a CSS Grid layout with horizontal scroll
    const toGrid = (table: string): string => {
      try {
        // Try HTML table first
        const trMatches = table.match(/<tr[\s\S]*?<\/tr>/gi);
        if (trMatches && trMatches.length > 0) {
          // Extract headers (th) or fallback to first row cells
          const headerRowHtml = trMatches.find(r => /<th\b/i.test(r)) || trMatches[0];
          const headerCells = (headerRowHtml.match(/<t(?:h|d)\b[^>]*>[\s\S]*?<\/t(?:h|d)>/gi) || [])
            .map(c => c.replace(/<[^>]*>/g, '').trim());
          const colCount = headerCells.length || 1;
          const dataRows = trMatches.filter(r => r !== headerRowHtml).map(r => {
            const cells = (r.match(/<t(?:h|d)\b[^>]*>[\s\S]*?<\/t(?:h|d)>/gi) || [])
              .map(c => c.replace(/<[^>]*>/g, '').trim());
            // Pad to header length
            while (cells.length < colCount) cells.push('');
            return cells.slice(0, colCount);
          });

          const gridCols = `repeat(${colCount}, minmax(220px, auto))`;
          const headerHtml = headerCells.map(h => `<div style="font-weight:700;padding:12px 10px;border:1px solid #374151;background:#111827;color:#e5e7eb;position:sticky;top:0;z-index:1;">${h}</div>`).join('');
          const bodyHtml = dataRows.map(row => row.map((c, i) => {
            // Make websites clickable
            let content = c;
            if (i === 1 && /^(https?:\/\/|www\.)/i.test(c)) {
              const url = c.startsWith('http') ? c : `https://${c}`;
              content = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:none;">${c}</a>`;
            }
            if (i === 2) {
              content = content.replace(/[,;]\s*/g, '<br/>');
            }
            return `<div style="padding:12px 10px;border:1px solid #253041;background:#0a1220;color:#e5e7eb;white-space:normal;line-height:1.5;">${content}</div>`;
          }).join('')).join('');

          return `
<div data-grounded-grid="1" class="researchgpt-table-container" style="overflow-x:auto;width:100%;margin:12px 0;">
  <div style="display:grid;grid-template-columns:${gridCols};gap:0;min-width:max-content;width:max-content;">
    ${headerHtml}
    ${bodyHtml}
  </div>
</div>`;
        }

        // Markdown table fallback (| header | header | ...)
        const lines = table.trim().split('\n');
        if (lines.length >= 2 && /\|\s*-+\s*\|/.test(lines[1])) {
          const headers = lines[0].split('|').map(s => s.trim()).filter(Boolean);
          const colCount = headers.length || 1;
          const rows = lines.slice(2).map(line => line.split('|').map(s => s.trim()).filter(Boolean));
          const gridCols = `repeat(${colCount}, minmax(220px, auto))`;
          const headerHtml = headers.map(h => `<div style=\"font-weight:700;padding:12px 10px;border:1px solid #374151;background:#111827;color:#e5e7eb;position:sticky;top:0;z-index:1;\">${h}</div>`).join('');
          const bodyHtml = rows.map(r => {
            const cells = [...r];
            while (cells.length < colCount) cells.push('');
            return cells.slice(0, colCount).map((c, i) => {
              let content = c;
              if (i === 1 && /^(https?:\/\/|www\.)/i.test(c)) {
                const url = c.startsWith('http') ? c : `https://${c}`;
                content = `<a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"color:#60a5fa;text-decoration:none;\">${c}</a>`;
              }
              if (i === 2) {
                content = content.replace(/[,;]\s*/g, '<br/>');
              }
              return `<div style=\"padding:12px 10px;border:1px solid #253041;background:#0a1220;color:#e5e7eb;white-space:normal;line-height:1.5;\">${content}</div>`;
            }).join('');
          }).join('');

          return `
<div data-grounded-grid=\"1\" class=\"researchgpt-table-container\" style=\"overflow-x:auto;width:100%;margin:12px 0;\">
  <div style=\"display:grid;grid-template-columns:${gridCols};gap:0;min-width:max-content;width:max-content;\">
    ${headerHtml}
    ${bodyHtml}
  </div>
</div>`;
        }
      } catch { /* fall through */ }
      return table;
    };

    // Replace HTML tables
    html = html.replace(/<table[\s\S]*?<\/table>/gi, toGrid);
    // Replace markdown tables rendered as plain text blocks (before markdown rendered). If some slipped through in html form, above covers.

    return `<markdown-style data-grounded="1">\n${html}\n</markdown-style>`;
  } catch {
    const escaped = cleanText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre data-grounded="1" style="white-space: pre-wrap; word-break: break-word;">${escaped}</pre>`;
  }
}
// Enhanced sendMessage: try fuzzy match first, then Gemini
  // Function to check and process pending messages from localStorage
  const checkForPendingMessage = useCallback(
    async (targetChatId: string) => {
      console.log("🔍 Checking for pending message for chat:", targetChatId);
    
    try {
        const pendingMessageData = localStorage.getItem("pendingChatMessage");
      if (!pendingMessageData) {
          console.log("📭 No pending message found");
    return;
      }
      
      const { chatId, message, visible, title, timestamp, geminiGrounding } = JSON.parse(pendingMessageData);
      
      // Check if this is the right chat and message is not too old (5 minutes)
      const isCorrectChat = chatId === targetChatId;
      const isNotTooOld = Date.now() - timestamp < 5 * 60 * 1000; // 5 minutes
      
      if (!isCorrectChat || !isNotTooOld) {
          console.log("📭 Pending message not applicable:", {
            isCorrectChat,
            isNotTooOld,
          });
        if (!isNotTooOld) {
            localStorage.removeItem("pendingChatMessage"); // Clean up old messages
        }
        return;
      }
      
        console.log(
          "📬 Found pending message for chat:",
          chatId,
          "Message:",
          message
        );
      
      // Check for focus metadata (for focus mode from homepage)
      const focusMetaData = localStorage.getItem("focusMeta");
      if (focusMetaData) {
        try {
          const focusMeta = JSON.parse(focusMetaData);
          if (focusMeta.chatId === chatId && focusMeta.isFirstMessage && focusMeta.query) {
            console.log('🔍 Found focus metadata, triggering focus mode chat:', focusMeta.query);
            
            // Clear focus metadata immediately
            localStorage.removeItem("focusMeta");
            
            // Set active mode to focus
            setActiveMode("focus");
            
            // The pendingChatMessage will be processed normally by the existing flow below
          }
        } catch (error) {
          console.error('Error parsing focus metadata:', error);
          localStorage.removeItem("focusMeta");
        }
      }
      
      // Check for research metadata (for research mode from homepage)
      const researchMetaData = localStorage.getItem("researchMeta");
      if (researchMetaData) {
        try {
          const researchMeta = JSON.parse(researchMetaData);
          if (researchMeta.chatId === chatId && researchMeta.isFirstMessage && researchMeta.query) {
            console.log('🔍 Found research metadata, showing ResearchGPT welcome message:', researchMeta.query);
            console.log('🔍 Authentication status:', { isAuthenticated, isAuthLoading });
            
            // If authentication is still loading, wait for it to complete
            if (isAuthLoading) {
              console.log('🔍 Authentication still loading, waiting before triggering research...');
              // Store flag to retry when auth completes
              localStorage.setItem("pendingResearchAfterAuth", JSON.stringify({
                chatId: chatId,
                query: researchMeta.query,
                timestamp: Date.now()
              }));
              // Keep researchMeta in localStorage for retry
              return; // Wait for authentication to complete
            }
            
            // ResearchGPT supports guest users - proceed immediately
            // Clear research metadata immediately
            localStorage.removeItem("researchMeta");
            
            // Clear Lightning Mode data to prevent conflicts when ResearchGPT is triggered
            console.log("🔍 ResearchGPT triggered, clearing Lightning Mode data to prevent conflicts");
            localStorage.removeItem("lightningModeData");
            localStorage.removeItem("pendingLightningMessage");
            localStorage.removeItem("lightning_company_summary");
            localStorage.removeItem("lightning_inputs");
            localStorage.removeItem("lightningModeResults");
            
            // Add ResearchGPT welcome message first
            await addAIMessage(currentChatId, "🔍 **Welcome to ResearchGPT!**\n\nI'm going to help you conduct comprehensive market research and analysis. Let me analyze your query and provide you with detailed insights from multiple AI models.", true, {
              type: 'research_mode',
              step: 'welcome',
              query: researchMeta.query,
              timestamp: Date.now()
            });
            
            // Trigger research automatically after welcome message
            triggerResearchForMessage(researchMeta.query, chatId).catch(err => {
              console.error('Failed to auto-trigger research from homepage:', err);
            });
            return; // Exit early, research will handle message display
          }
        } catch (error) {
          console.error('Error parsing research metadata:', error);
          localStorage.removeItem("researchMeta");
        }
      }
      
      // Clear the pending message immediately to prevent re-processing
        localStorage.removeItem("pendingChatMessage");
      
      // Give the UI a brief moment to settle without adding noticeable latency
      await new Promise(requestAnimationFrame);
      
      // Set up UI state
      setIsMessageInProgress(true);
      setIsProcessing(true);
      setRecentPrompt(visible || message);

      // Check if user message already exists in chat (deduplication)
        const currentChat = chatSessions.find((chat) => chat.id === chatId);
        const shouldUpdateTitle = currentChat?.title === "New Chat";
        const baseTitle = (title && String(title)) || visible || message;
        const newTitle = shouldUpdateTitle
          ? baseTitle.substring(0, 60)
          : currentChat?.title || "New Chat";

      const alreadyExists = currentChat?.messages.some(
          (m) => m.role === "user" && m.content === message
      );

      if (!alreadyExists) {
        // Add user message to frontend state immediately for responsiveness
        const userMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
            role: "user",
          content: visible || message,
            timestamp: Date.now(),
        };
          setDeduplicatedChatSessions((prev) => {
            const updated = prev.map((chat) =>
            chat.id === chatId 
              ? { 
                  ...chat, 
                  messages: [...chat.messages, userMessage],
                    title: shouldUpdateTitle ? newTitle : chat.title,
                } 
              : chat
          );
          return updated;
        });

        // Fire backend save and title update in parallel (non-blocking)
        Promise.allSettled([
            chatApi.addMessage(chatId, { role: "user", content: visible || message }),
            shouldUpdateTitle && newTitle
              ? chatApi.updateChat(chatId, { title: newTitle })
              : Promise.resolve(null),
          ]).catch(() => {
            /* errors logged inside chatApi */
          });
      } else {
        // Message already exists, just update title in background if needed
        if (shouldUpdateTitle && newTitle) {
            chatApi.updateChat(chatId, { title: newTitle }).catch(() => {
              /* logged in chatApi */
            });
        }
      }
      
      // Check if there's already an AI response for this message
        const currentChatSession = chatSessions.find(
          (chat) => chat.id === chatId
        );
        const lastMessage =
          currentChatSession?.messages[currentChatSession.messages.length - 1];
        const hasAIResponse = lastMessage?.role === "assistant";
      
      if (hasAIResponse) {
          console.log("🤖 AI response already exists, skipping generation");
        setIsMessageInProgress(false);
        setIsProcessing(false);
        return;
      }
      
      // Start AI response
        console.log("🤖 Starting AI response for pending message");
      
      // Start typing animation
      setIsTyping(true);
        setDisplayedResult("");
      
      try {
        // Get chat history without including the message we just added
          const chatHistory =
            currentChatSession?.messages.slice(0, -1).map((msg) => ({
              role:
                msg.role === "user"
                  ? ("user" as const)
                  : ("assistant" as const),
              content: msg.content,
        })) || [];
        
      // Use Gemini API for AI response. If geminiGrounding flag is present, call minimal route and render minimally
        const result = await fetch(geminiGrounding ? "/api/gemini/direct" : "/api/gemini", {
            method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(geminiGrounding ? {
            query: message,
            chatHistory: [],
            options: { mode: 'research' as const },
          } : {
            message,
            chatHistory,
            useLangchain: true,
            enableWebSearch: false,
            enableRAG: true,
          }),
        });
        
        if (!result.ok) {
          throw new Error(`API call failed: ${result.status}`);
        }
        
        const data = await result.json();
        const aiResult = geminiGrounding
          ? (typeof data?.result === 'string' ? data.result : '')
          : (data.response || data.message || "I'm sorry, I couldn't generate a response.");
        
          console.log(
            "✅ AI response received:",
            aiResult?.substring(0, 100) + "..."
          );
        
        if (aiResult) {
          // Format minimally for grounded flow
          const formatted = geminiGrounding ? formatGroundedText(aiResult) : formatAIText(aiResult);
          
          // Add the AI message to local state first
          const aiMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai`,
              role: "assistant",
            content: formatted,
              timestamp: Date.now(),
            lightningMode: geminiGrounding ? { type: 'grounded' } : undefined,
          };
          
            setDeduplicatedChatSessions((prev) => {
              const updated = prev.map((chat) =>
              chat.id === chatId 
                ? { ...chat, messages: [...chat.messages, aiMessage] } 
                : chat
            );
            return updated;
          });
          
          // Type the AI response
          typeText(formatted);
          
          // Save to backend (split into two smaller assistant messages if large)
          try {
            await saveAssistantMessageSplit(chatId, formatted);
          } catch (error) {
              console.error("❌ Error saving AI message to backend:", error);
          }
          
          setResult(formatted);
          setDisplayedResult(formatted);
        }
      } catch (error) {
          console.error("❌ Error getting AI response:", error);
          const errorMessage =
            "I apologize, but I encountered an error while processing your request. Please try again.";
        
        // Add error message to local state
        const errorAIMessage: ChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai_error`,
            role: "assistant",
          content: errorMessage,
            timestamp: Date.now(),
        };
        
          setDeduplicatedChatSessions((prev) => {
            const updated = prev.map((chat) =>
            chat.id === chatId 
              ? { ...chat, messages: [...chat.messages, errorAIMessage] } 
              : chat
          );
          return updated;
        });
        
        // Save error message to backend
        try {
          await chatApi.addMessage(chatId, {
              role: "assistant",
            content: errorMessage,
          });
        } catch (saveError) {
            console.error(
              "❌ Error saving error message to backend:",
              saveError
            );
        }
        
        setResult(errorMessage);
        setDisplayedResult(errorMessage);
      }
      
      // Clean up state
      setIsTyping(false);
      setIsMessageInProgress(false);
      setIsProcessing(false);
    } catch (error) {
        console.error("❌ Error processing pending message:", error);
        localStorage.removeItem("pendingChatMessage"); // Clean up on error
      setIsMessageInProgress(false);
      setIsProcessing(false);
    }
    },
    [chatSessions, setDeduplicatedChatSessions, addAIMessage, triggerResearchForMessage, isAuthenticated, isAuthLoading, currentChatId]
  );

  const sendMessage = useCallback(
    async (message: string, visibleOverride?: string): Promise<void> => {
      console.log("🚀 sendMessage called with message:", message);
      console.log("🔍 Current state:", {
        currentChatId,
        initialChatId, 
        urlChatId,
        isProcessing,
        isMessageInProgress,
        currentPath: window.location.pathname,
        activeMode,
        visibleOverride
      });
  
  // Set message in progress flag AND immediate loading state
  setIsMessageInProgress(true);
  setIsProcessing(true);
  
  // Enhanced mode isolation: Clear Lightning Mode data if we're in non-Lightning mode to prevent cross-contamination
  const currentChatForClear = chatSessions.find(chat => chat.id === currentChatId);
  const isNonLightningModeChat = currentChatForClear?.mode === "research" || currentChatForClear?.mode === "explore" || currentChatForClear?.mode === "focus" || currentChatForClear?.mode === "brain" || activeMode === "research" || activeMode === "explore" || activeMode === "focus" || activeMode === "brain";
  
  if (isNonLightningModeChat) {
    console.log("🔍 Non-Lightning mode chat detected (mode: " + (currentChatForClear?.mode || activeMode) + "), clearing Lightning Mode data to prevent conflicts");
    localStorage.removeItem("lightningModeData");
    localStorage.removeItem("pendingLightningMessage");
    localStorage.removeItem("lightning_company_summary");
    localStorage.removeItem("lightning_inputs");
    localStorage.removeItem("lightningModeResults");
  }
  
  // Check authentication status
  const userIsAuthenticated = isAuthenticated;
  
  // Check query limit for unauthenticated users
  if (!userIsAuthenticated && !canMakeQuery()) {
    // Add user message first to show it in chat
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: message,
      timestamp: Date.now(),
    };

    // Get or use current chat ID without creating new one if possible
    let chatId = currentChatId || initialChatId || urlChatId;
    
    // Only create new chat if absolutely necessary
    if (!chatId) {
      const newChatId = await createNewChat();
      if (newChatId) {
        chatId = newChatId;
        setCurrentChatId(newChatId);
        setProcessingChatId(newChatId);
      }
    }

    // Add query limit message to chat instead of showing typing animation
    const queryLimitMessage: ChatMessage = {
      id: `msg-${Date.now()}-limit`,
      role: "assistant",
      content: `<div class="glass-container rounded-xl p-4 border border-blue-400/30 bg-gradient-to-r from-blue-950/40 to-black/40 backdrop-blur-xl max-w-lg mx-auto my-3 shadow-lg animate-fadeIn" style="animation: slideUp 0.3s ease-out;">
  <div class="flex items-center justify-between">
    <div class="flex-1 mr-4">
      <p class="text-white text-sm font-semibold">Query limit reached</p>
      <p class="text-blue-300/80 text-xs">Sign up for unlimited access</p>
    </div>
    <button onclick="window.location.href='${getLoginUrl()}'" 
       class="px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md border border-blue-500/60 text-xs cursor-pointer whitespace-nowrap">
      Sign Up Free
    </button>
  </div>
</div>

<style>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>`,
      timestamp: Date.now(),
    };

    // Store complete chat data for preservation before adding limit message
    if (chatId) {
      // Find current chat session
      const currentSession = chatSessions.find(session => session.id === chatId);
      if (currentSession) {
        // Store the complete chat data INCLUDING the user message, but EXCLUDING the limit message
        const chatToPreserve = {
          id: currentSession.id,
          title: currentSession.title,
          messages: [...currentSession.messages, userMessage], // Add user message but not limit message
          createdAt: currentSession.createdAt
        };
        
        console.log('🔄 STORING CHAT FOR PRESERVATION:', {
          chatId: chatToPreserve.id,
          title: chatToPreserve.title,
          messageCount: chatToPreserve.messages.length
        });
        
        // Store in localStorage for post-login preservation
        localStorage.setItem('salescentri_preserved_chat', JSON.stringify(chatToPreserve));
      }

      // Now add both messages to the current chat for display
      setDeduplicatedChatSessions(prev => 
        prev.map(session => 
          session.id === chatId 
            ? { ...session, messages: [...session.messages, userMessage, queryLimitMessage] }
            : session
        )
      );
    }

    // Clear processing states immediately to prevent UI glitches
    setIsMessageInProgress(false);
    setIsProcessing(false);
    setIsTyping(false);
    
    // Show the modal as well for additional emphasis
    setShowQueryLimitGate(true);
    return;
  }
  
  // Increment query count for unauthenticated users
  if (!userIsAuthenticated) {
    incrementQueryCount();
    // Track query number - always track queries for unauthenticated users
    const newQueryCount = queryCount + 1;
    setQueryCount(newQueryCount);
    // Track as query 1 only if landing was not tracked, otherwise track as regular query
    if (!hasTrackedLanding) {
      trackQuery(1);
    } else {
      trackQuery(newQueryCount);
    }
  }
  
  // Create new chat if none exists
  let chatId = currentChatId || initialChatId || urlChatId; // Use robust fallback chain
  let isNewChat = false;
  
  // CRITICAL: Never create a new chat if we have a URL chat ID (user is already on a chat page)
  if (!chatId && !urlChatId) {
    const newChatId = await createNewChat();
    if (!newChatId) {
      setIsMessageInProgress(false);
      setIsProcessing(false);
      return; // If chat creation failed, exit early
    }
    chatId = newChatId;
    isNewChat = true; // Flag to indicate this is a newly created chat
    
    console.log("🔄 Created new chat:", newChatId);
    
    // Check if we need to navigate or can process in place
    const currentPath = window.location.pathname;
    const basePath = "/solutions/psa-suite-one-stop-solution";
    const isOnBasePage = currentPath === basePath || currentPath === basePath + "/";
    
    // FOR PSA HOMEPAGE: Navigate immediately BEFORE any UI state changes
    if (isOnBasePage && !initialChatId && !urlChatId) {
      // **STORE MESSAGE IN LOCALSTORAGE FOR NEW CHATS** - Store the message to be sent after navigation
      console.log("💾 Storing pending message in localStorage for chat:", newChatId);
      const shouldUseGeminiGrounding = !!(forceGeminiOnlyNext && (activeMode === "explore"));
      localStorage.setItem(
        "pendingChatMessage",
        JSON.stringify({
          chatId: newChatId,
          message: message, // backend message to send
          visible: (visibleOverride && visibleOverride.trim()) || null, // first user bubble text
          title: pendingTitleOverride?.trim() || null,
          geminiGrounding: shouldUseGeminiGrounding,
          timestamp: Date.now(),
        })
      );
    
      // **IMMEDIATE NAVIGATION** - Navigate immediately BEFORE any UI state changes
      console.log("🧭 Navigating to chat URL immediately (before UI changes):", newChatId);
      
      // Use window.location.href for immediate redirect (like HomepageSalesGPT)
      window.location.href = `/solutions/psa-suite-one-stop-solution/c/${newChatId}`;
      
      // Exit immediately - don't update any UI state
      if (forceGeminiOnlyNext) setForceGeminiOnlyNext(false);
      return;
    }
    
    // For non-homepage scenarios, continue with in-place processing
    setCurrentChatId(newChatId);
    setProcessingChatId(newChatId);
    
    // Short delay to ensure state propagation for in-place chat creation
    await new Promise((resolve) => setTimeout(resolve, 100));
  } else if (!currentChatId && (initialChatId || urlChatId)) {
    // If we have a chat ID from URL/props but currentChatId is not set, set it
    const fallbackChatId = initialChatId || urlChatId;
    console.log("🔄 Setting currentChatId from fallback:", fallbackChatId);
    setCurrentChatId(fallbackChatId);
    setProcessingChatId(fallbackChatId);
    chatId = fallbackChatId; // Use this chat ID for the current message
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  
  // Final safety check - if we still don't have a chatId, something is wrong
  if (!chatId) {
    console.error("❌ No chat ID available after all checks - aborting sendMessage");
    setIsMessageInProgress(false);
    setIsProcessing(false);
    return;
  }
  
  console.log("✅ Using chat ID for message:", chatId);
  
  // If we're using an existing chat (not creating new), log this success
  if (!isNewChat) {
    console.log("🎯 Sending message to existing chat - no navigation needed");
  }
  
  // Add user message to chat
  const displayContent = (visibleOverride && visibleOverride.trim()) || message;
  const userMessage: ChatMessage = {
    id: `msg_${Date.now()}`,
    role: "user",
    content: displayContent,
    timestamp: Date.now(),
  };
  
  // Check if we need to update the title BEFORE updating local state
  // For new chats, set the title to the user's first message
  const currentChat = chatSessions.find((chat) => chat.id === chatId);
  const shouldUpdateTitle = isNewChat || currentChat?.title === "New Chat" || !currentChat?.title;
  const newTitle = shouldUpdateTitle
    ? (pendingTitleOverride?.trim() || displayContent.trim()).slice(0, 60)
    : currentChat?.title || "New Chat";

  console.log("🔍 Before local update:", {
    chatId,
    currentTitle: currentChat?.title,
    shouldUpdateTitle,
    newTitle,
    isNewChat,
  });

  // Update local state first for immediate UI response
  setDeduplicatedChatSessions((prev) => {
    const updated = prev.map((chat) =>
      chat.id === chatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, userMessage],
            title: shouldUpdateTitle ? newTitle : chat.title,
          } 
        : chat
    );
    
    const updatedChat = updated.find((c) => c.id === chatId);
    console.log(
      "📝 Local state update - Chat title changed to:",
      updatedChat?.title
    );
    
    return updated;
  });

  // **IMMEDIATE PLACEHOLDER FOR AI RESPONSE** - Add typing placeholder
  // Avoid placeholder/typing on PSA base page for brand new chats (we navigate instead)
  {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const basePath = "/solutions/psa-suite-one-stop-solution";
    const isOnBasePage = currentPath === basePath || currentPath === basePath + "/";
    const addingForHomepage = isNewChat && isOnBasePage;
    if (!addingForHomepage) {
      const placeholderAIMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai`,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      setDeduplicatedChatSessions((prev) => {
        const updated = prev.map((chat) =>
          chat.id === chatId ? { ...chat, messages: [...chat.messages, placeholderAIMessage] } : chat
        );
        return updated;
      });
      setIsTyping(true);
      setDisplayedResult("");
    }
  }

  // Save user message to backend (don't wait for response to maintain UI responsiveness)
  chatApi
    .addMessage(chatId, {
      role: "user",
      content: displayContent,
    })
    .catch((error) => console.error("Failed to save user message:", error));

  // Update chat title in backend if it was changed from "New Chat"
  if (shouldUpdateTitle && newTitle) {
    console.log('📤 Updating chat title from "New Chat" to:', newTitle);
    
    chatApi
      .updateChat(chatId, { title: newTitle })
      .then((result) => {
        console.log("✅ Chat title update successful:", result);
      })
      .catch((error) => {
        console.error("❌ Failed to update chat title:", error);
      });
  } else {
    console.log(
      '⏭️ Skipping title update - current title is not "New Chat"'
    );
  }
  
  // Only set recentPrompt for existing chats or in-place processing (not for homepage redirects)
  // This prevents the chat UI from showing before navigation
  const currentPath = window.location.pathname;
  const basePath = "/solutions/psa-suite-one-stop-solution";
  const isOnBasePage = currentPath === basePath || currentPath === basePath + "/";
  
  if (!isNewChat || !isOnBasePage) {
    setRecentPrompt(displayContent);
  }
  
  // For new chats, ensure result is cleared and typing is ready
  if (isNewChat) {
    setResult("");
    setDisplayedResult("");
    setIsTyping(false);
    // Give React more time to update the chat messages and state before starting AI response
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  
  // Force auto-scroll when new user message is added
  setShouldAutoScroll(true);
  
  // Scroll to the new user message first (scroll up to show it)
  setTimeout(() => {
    if (chatContainerRef.current) {
          const messages = chatContainerRef.current.querySelectorAll(
            '[data-message-role="user"]'
          );
      const lastUserMessage = messages[messages.length - 1];
      if (lastUserMessage) {
            lastUserMessage.scrollIntoView({
              behavior: "auto",
              block: "start",
            });
        // Then scroll to bottom after a short delay
        setTimeout(() => scrollToBottom(true), 300);
      } else {
        scrollToBottom(true);
      }
    }
  }, 50);
  
  // Try fuzzy match first for Focus Mode
      let fuzzyResult = "";
      if (activeMode === "focus") {
    try {
      const fuzzyMatchResult = await checkFuzzyMatch(message);
      if (fuzzyMatchResult) {
        fuzzyResult = fuzzyMatchResult;
      }
    } catch (error) {
          console.error("Fuzzy matching failed:", error);
    }
  }
  
  if (fuzzyResult) {
    const formatted = formatAIText(fuzzyResult);
    // Don't set result immediately to prevent flash - let typeText handle it
    typeText(formatted);
    
    // Add AI response to chat
    await addAIMessage(chatId, formatted);
    
    setIsProcessing(false);
    setProcessingChatId(null); // Clear processing chat ID when done
    return;
  }
  
  // Check if we're in onboarding mode and route to conversational onboarding
      if (
        isOnboardingChat &&
        (activeMode === "lightning" || activeMode === "focus")
      ) {
    try {
          await handleOnboardingMessage(message);
    } catch (error) {
          console.error("Onboarding chat error:", error);
    }
    // Ensure we stop processing in the generic handler; the onboarding handler updates its own UI state
    setIsProcessing(false);
    setProcessingChatId(null);
    return;
  }
  
  // If no fuzzy match, call appropriate API based on mode
  try {
        let aiResult = "";
    
        if (activeMode === "research") {
      // Handle ResearchGPT flow using user-selected configuration
      try {
        // Prepare research payload with user-selected settings from researchGPTConfig
        const researchPayload = {
          query: message,
          category: researchGPTConfig.category,
          depth: researchGPTConfig.depth,
          timeframe: researchGPTConfig.timeframe,
          geographic_scope: researchGPTConfig.geoScope,
          website_url: null,
          website_url_2: null,
          company_size: 'all',
          revenue_category: 'all',
          focus_on_leads: false,
          selected_models: { gpt4o: true, gemini: true, perplexity: true },
          web_search_enabled: true,
          excel_data: null,
          excel_file_name: null,
          using_web_search: true,
          config_summary: `ResearchGPT: market_analysis, comprehensive`,
          deep_research: true,
          include_founders: true,
          include_products: true,
          analyze_sales_opportunities: true,
          include_tabular_data: true,
          extract_company_info: true,
          analyze_prospective_clients: true,
          include_employee_count: true,
          include_revenue_data: true,
          include_complete_urls: true,
          perplexity_model: 'llama-3.1-sonar-large-128k-online'
        };

        // Call research API
        const response = await fetch('/api/multi-research-ai', {
          method: 'POST',
            headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(researchPayload)
          });

          if (response.ok) {
            const researchResult = await response.json();
            console.log("🔍 ResearchGPT API Response:", researchResult);
          
          // Format result for display
          let formattedResult = `# 🔍 ResearchGPT Analysis\n\n`;
          
          // Check all available results
          if (researchResult.gpt4o) {
            formattedResult += `## GPT-4O Research Results\n${researchResult.gpt4o}\n\n`;
          }
          
          if (researchResult.gemini) {
            formattedResult += `## Gemini Research Results\n${researchResult.gemini}\n\n`;
          }
          
          if (researchResult.perplexity) {
            formattedResult += `## Perplexity Research Results\n${researchResult.perplexity}\n\n`;
          }
          
          // If no results from any model, show error info
          if (!researchResult.gpt4o && !researchResult.gemini && !researchResult.perplexity) {
            formattedResult += `## Research Status\n`;
            if (researchResult.errors) {
              formattedResult += `**Errors encountered:**\n`;
              Object.entries(researchResult.errors).forEach(([model, error]) => {
                formattedResult += `- ${model}: ${error}\n`;
              });
            } else {
              formattedResult += `No research results were generated. Please check your API keys and try again.`;
            }
            formattedResult += `\n`;
          }
          
          if (researchResult.sources && researchResult.sources.length > 0) {
            formattedResult += `## Sources\n`;
            researchResult.sources.forEach((source: string, index: number) => {
              formattedResult += `${index + 1}. ${source}\n`;
            });
          }
          
          aiResult = formattedResult;
          } else {
                throw new Error("Research API failed");
        }
      } catch (researchError) {
        console.error("ResearchGPT error:", researchError);
        aiResult = "Sorry, I encountered an error while researching. Please try again.";
      }
    }
    
    if (!aiResult) {
      // Get current chat history BEFORE adding the new message
          const currentChatSession = chatSessions.find(
            (chat) => chat.id === chatId
          );
          const geminiHistory =
            currentChatSession?.messages.map((msg) => ({
              role:
                msg.role === "user" ? ("user" as const) : ("model" as const),
              parts: [
                {
                  text:
                    msg.role === "user"
                      ? msg.content
                      : msg.content.replace(/<[^>]*>/g, ""),
                },
              ], // Strip HTML from AI responses
      })) || [];
      
          console.log("Sending to Gemini with history:", geminiHistory); // Debug log
      
      // For Focus Mode, enhance the message with onboarding context
      let enhancedMessage = message;
          if (
            activeMode === "focus" &&
            onboardingData &&
            Object.keys(onboardingData).length > 0
          ) {
        const contextualInfo = `
Based on the user's profile:
- Sales Objective: ${onboardingData.salesObjective || "Not specified"}
- Role: ${onboardingData.userRole || "Not specified"}
- Immediate Goal: ${onboardingData.immediateGoal || "Not specified"}
- Company Website: ${onboardingData.companyWebsite || "Not provided"}
- Market Focus: ${onboardingData.marketFocus || "Not specified"}
- Industry: ${onboardingData.companyInfo?.industry || "Not specified"}
- Company Revenue: ${onboardingData.companyInfo?.revenueSize || "Not specified"}
- Team Size: ${onboardingData.companyInfo?.employeeSize || "Not specified"}
Please provide personalized advice considering this context. Original question: ${message}`;
        
        enhancedMessage = contextualInfo;
      }
      
      // Pass mode and chat context. If sidebar-originated in explore, force Gemini+Google only.
      const options = forceGeminiOnlyNext && (activeMode === "explore") ? {
        mode: 'research' as const,
        useLangchain: false,
        enableWebSearch: true,
        useGrounding: true,
        enableRAG: false,
        chatId: chatId || undefined,
      } : {
        mode: activeMode,
        useLangchain: true,
        enableWebSearch: activeMode === "focus" || activeMode === "research",
        enableRAG: false,
            chatId: chatId || undefined,
      };
      
      // Only show web search progress for research mode (authentication disabled)
      if (!forceGeminiOnlyNext && activeMode === "research") {
            console.log(
              "🔍 FRONTEND: Research mode detected, starting web search"
            );
        
        // Use streaming research for research mode
            console.log(
              "🚀 FRONTEND: Starting streaming research for:",
              message
            );
        setIsWebSearchActive(true);
        
        try {
              await streamingResearch.startStreamingResearch(
                message,
                webSearchProgress
              );
          
          // Wait for the result
          while (streamingResearch.isStreaming) {
                await new Promise((resolve) => setTimeout(resolve, 100));
          }
          
          if (streamingResearch.error) {
            throw new Error(streamingResearch.error);
          }
          
              aiResult =
                streamingResearch.result ||
                "No result received from streaming research";
              console.log(
                "✅ FRONTEND: Streaming research completed, result length:",
                aiResult.length
              );
        } catch (error) {
              console.error("❌ FRONTEND: Streaming research failed:", error);
          // Fallback to traditional API call
              console.log("🔄 FRONTEND: Falling back to traditional API call");
          setIsWebSearchActive(true);
          webSearchProgress.startProgress(message);
          
              const geminiResponse = await callGeminiWithSources(
                enhancedMessage,
                geminiHistory,
                options
              );
          aiResult = geminiResponse.result;
        }
      } else if (!(forceGeminiOnlyNext && activeMode === "explore")) {
        // For all other modes, use regular chat without web search progress
            console.log("� FRONTEND: Regular chat mode, no web search UI");
            aiResult = await callGemini(
              enhancedMessage,
              geminiHistory,
              options
            );
      } else {
        // Sidebar-originated explore: call our minimal Gemini grounding route and STOP regular rendering
        try {
          const res = await fetch('/api/gemini/direct', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: enhancedMessage, chatHistory: geminiHistory, options: { mode: 'research' as const } }),
          });
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          const data = await res.json();
          aiResult = typeof data?.result === 'string' ? data.result : '';
          // Render grounded response minimally
          const formatted = formatGroundedText(aiResult);
          if (currentChatId) {
            await addAIMessage(currentChatId, formatted, true, { type: 'grounded' });
          }
          setIsProcessing(false);
          setIsWebSearchActive(false);
          setProcessingChatId(null);
          setIsMessageInProgress(false);
          if (forceGeminiOnlyNext) setForceGeminiOnlyNext(false);
          return;
        } catch (err) {
          aiResult = 'Sorry, there was an error contacting Gemini with web search.';
        }
      }
    }
    
    const formatted = formatAIText(aiResult);
    
    // Debug: Check chat state before starting typing animation
        const debugCurrentChat = chatSessions.find(
          (chat) => chat.id === chatId
        );
        const debugCurrentChatViaRef = chatSessionsRef.current.find(
          (chat) => chat.id === chatId
        );
    const debugCurrentChatViaState = currentChat;
    
        console.log("🐛 Before typeText - Chat state:", {
      chatId,
      currentChatId,
      processingChatId,
      activeChatId,
      chatFoundById: !!debugCurrentChat,
      chatFoundViaRef: !!debugCurrentChatViaRef,
      chatFoundViaState: !!debugCurrentChatViaState,
      messagesCount: debugCurrentChat?.messages?.length || 0,
      messagesCountViaRef: debugCurrentChatViaRef?.messages?.length || 0,
      totalChatsInState: chatSessions.length,
      totalChatsInRef: chatSessionsRef.current.length,
          isNewChat,
    });
    
    // Ensure chat exists in both state and ref before proceeding
    if (!debugCurrentChatViaRef) {
          console.log("🔧 Chat missing from ref, syncing from state");
      chatSessionsRef.current = [...chatSessions];
    }
    
    // Ensure state consistency for currentChatId and processingChatId
        if (
          !currentChatId ||
          !processingChatId ||
          currentChatId !== chatId ||
          processingChatId !== chatId
        ) {
          console.log("🔧 Synchronizing chat state before typing animation:", {
        setting: {
          currentChatId: chatId,
              processingChatId: chatId,
        },
        previous: {
          currentChatId,
              processingChatId,
            },
      });
      
      // Update both states simultaneously
      setCurrentChatId(chatId);
      setProcessingChatId(chatId);
      
      // Brief pause to allow React to process the state updates
          await new Promise((resolve) => setTimeout(resolve, 50));
    }
    
        console.log("🎬 Starting typing animation with chatId:", chatId);
        console.log("🔍 Final chat verification:", {
      finalActiveChatId: chatId,
          finalCurrentChatFound: !!chatSessionsRef.current.find(
            (chat) => chat.id === chatId
          ),
          messagesCount:
            chatSessionsRef.current.find((chat) => chat.id === chatId)?.messages
              ?.length || 0,
          allChatIds: chatSessionsRef.current.map((c) => c.id),
      totalChats: chatSessionsRef.current.length,
      currentChatIdState: currentChatId,
          processingChatIdState: processingChatId,
    });
    
    // Start typing animation without additional delays or force renders
    typeText(formatted);
    
    // Add AI response to chat
    await addAIMessage(chatId, formatted);
    
    // AI response already added to state - no need for forced reload to prevent flicker
    console.log("✅ AI response added to chat successfully");
  } catch {
        const errorMsg = "Sorry, there was an error contacting the AI.";
    // Don't set result immediately to prevent flash - let typeText handle it
    typeText(errorMsg);
    
    // Add error message to chat
    await addAIMessage(chatId, errorMsg);
    
    // Error message already added to state - no need for forced reload to prevent flicker
    console.log("✅ Error message added to chat successfully");
    
    // Also clear the message in progress flag on error
    setIsMessageInProgress(false);
  }
  
  // Clean up processing state
  setIsProcessing(false);
  setIsWebSearchActive(false);
  setProcessingChatId(null); // Clear processing chat ID when done
  setIsMessageInProgress(false); // Clear message in progress flag
    // Clear the one-shot flag after sending
    if (forceGeminiOnlyNext) setForceGeminiOnlyNext(false);
  
  // **REMOVED POST-COMPLETION NAVIGATION** - Navigation now happens immediately to prevent UI flash
  // This ensures smooth user experience without showing distorted homepage
  
      console.log("✅ sendMessage completed for chatId:", chatId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      currentChatId,
      createNewChat,
      chatSessions,
      activeMode,
      scrollToBottom,
      isAuthenticated,
      onboardingData,
      userProfile,
      webSearchProgress,
      streamingResearch,
      addAIMessage,
      isOnboardingChat,
      router,
      initialChatId,
    ]
  );

  // Direct Gemini + Google (no Langchain) path for sidebar-prompts in explore
  // Declare before usage in handleSend
  const sendMessageWithDirectGemini = useCallback(
    async (message: string, visibleOverride?: string): Promise<void> => {
      // Build gemini-style history
      const currentChatSession = chatSessions.find((chat) => chat.id === (currentChatId || initialChatId || urlChatId));
      const geminiHistory = currentChatSession?.messages.map((msg) => ({
        role: msg.role === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: msg.role === 'user' ? msg.content : msg.content.replace(/<[^>]*>/g, '') }],
      })) || [];

      // Use Gemini API route in legacy mode with grounding
      const body = {
        query: message,
        chatHistory: geminiHistory,
        useLangchain: false,
        useGrounding: true,
        enableWebSearch: true,
        options: { mode: 'research' },
        chatId: currentChatId || initialChatId || urlChatId || `chat_${Date.now()}`,
      } as const;

      // Optimistically add user message if not already present
      if (visibleOverride) {
        // ensure visible text shown to user matches override
      }

      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        const aiResult = typeof data?.result === 'string' ? data.result : '';
        const formatted = formatAIText(aiResult);
        // Render
        if (currentChatId) {
          await addAIMessage(currentChatId, formatted);
        }
      } catch (err) {
        const errorMsg = 'Sorry, there was an error contacting Gemini with web search.';
        if (currentChatId) {
          await addAIMessage(currentChatId, errorMsg);
        }
      }
    }, [chatSessions, currentChatId, initialChatId, urlChatId, addAIMessage]
  );

  const handleSuggestionClick = (suggestion: string): void => {
    // Add specific text for certain suggestions - matching HomepageSalesGPT logic
    let modifiedSuggestion = suggestion;
    
    // First 4 suggestions: add "for my company. Website: "
    if (["Create my ICP list", "Generate leads", "Identify target audience", "Start campaign"].includes(suggestion)) {
      modifiedSuggestion = `${suggestion} for my company. Website: `;
    }
    // Last 2 suggestions: add "for my company. Website: "
    else if (["Leads from healthcare companies", "Generate leads for Oil & gas"].includes(suggestion)) {
      modifiedSuggestion = `${suggestion} for my company. Our Website: `;
    }
    // "Verify my list" and "Enrich my list" remain unchanged
    
    // Set the input with the modified suggestion (like homepage) instead of sending immediately
    setInput(modifiedSuggestion);
    
    // Track suggestion click
    try {
      trackCustomEvent("salesgpt_suggestion_click", { suggestion });
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline behavior
      handleSend();
    }
  };



  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setInput(e.target.value);
  };

  // Convert backend OnboardingData to local OnboardingData type (handles both formats)
  const convertOnboardingData = (
    backendData: Record<string, unknown>
  ): OnboardingData => {
    // DEBUGGING: Log all keys in the backend data
    console.log("🔍 CONVERSION DEBUG - All backend data keys:", Object.keys(backendData));
    console.log("🔍 CONVERSION DEBUG - Full backend data:", JSON.stringify(backendData, null, 2));
    
    // If already in correct format with all required fields, return as-is 
    if (
      typeof backendData === "object" &&
      backendData &&
      "userId" in backendData &&
      "currentStep" in backendData &&
      typeof (backendData as { userId?: unknown }).userId === "string" &&
      typeof (backendData as { currentStep?: unknown }).currentStep === "string"
    ) {
      return backendData as unknown as OnboardingData;
    }
    
    // Handle nested structure where data might be inside an 'onboarding' key
    let data = backendData as Record<string, unknown>;
    
    // Check for onboarding_list at top level (when already pre-normalized)
    if (data.onboarding_list && Array.isArray(data.onboarding_list)) {
      if (data.onboarding_list.length > 0) {
        // Pick the latest item by id or created_at instead of the first element
        const list = data.onboarding_list as Array<Record<string, unknown>>;
        const latest = [...list].sort((a, b) => {
          const idA = Number((a as Record<string, unknown>).id ?? 0);
          const idB = Number((b as Record<string, unknown>).id ?? 0);
          if (idA !== 0 || idB !== 0) return idB - idA;
          const ca = Date.parse(String((a as Record<string, unknown>).created_at || 0));
          const cb = Date.parse(String((b as Record<string, unknown>).created_at || 0));
          return cb - ca;
        })[0];
        data = latest as Record<string, unknown>;
        console.log("🔍 CONVERSION DEBUG - Extracted latest item from top-level onboarding_list array, new keys:", Object.keys(data));
      }
    } else if (data.onboarding && typeof data.onboarding === "object") {
      data = data.onboarding as Record<string, unknown>;
      console.log("🔍 CONVERSION DEBUG - Extracted from nested 'onboarding' key, new keys:", Object.keys(data));
    }
    
    // Check for 'data' wrapper (some responses wrap in {data: {...}})
    if (data.data && typeof data.data === "object") {
      const innerData = data.data as Record<string, unknown>;
      
      // Handle onboarding_list (array of onboarding records)
      if (innerData.onboarding_list && Array.isArray(innerData.onboarding_list)) {
        // Take the latest item from the array (by id or created_at)
        if (innerData.onboarding_list.length > 0) {
          const list = innerData.onboarding_list as Array<Record<string, unknown>>;
          const latest = [...list].sort((a, b) => {
            const idA = Number((a as Record<string, unknown>).id ?? 0);
            const idB = Number((b as Record<string, unknown>).id ?? 0);
            if (idA !== 0 || idB !== 0) return idB - idA;
            const ca = Date.parse(String((a as Record<string, unknown>).created_at || 0));
            const cb = Date.parse(String((b as Record<string, unknown>).created_at || 0));
            return cb - ca;
          })[0];
          data = latest as Record<string, unknown>;
          console.log("🔍 CONVERSION DEBUG - Extracted latest item from onboarding_list array, new keys:", Object.keys(data));
        }
      } else if (innerData.onboarding_list) {
        // If onboarding_list is not an array (single object), use it directly
        data = innerData.onboarding_list as Record<string, unknown>;
        console.log("🔍 CONVERSION DEBUG - Extracted from 'onboarding_list' (single object), new keys:", Object.keys(data));
      } else if (innerData.onboarding) {
        // Handle onboarding key
        data = innerData.onboarding as Record<string, unknown>;
        console.log("🔍 CONVERSION DEBUG - Extracted from 'onboarding' key, new keys:", Object.keys(data));
      }
    }
    const result: OnboardingData = {
      userId: String(
        (data as { userId?: unknown; anon_id?: unknown }).userId ??
          (data as { anon_id?: unknown }).anon_id ??
          ""
      ),
      currentStep: String(
        (data as { currentStep?: unknown; current_step?: unknown })
          .currentStep ??
          (data as { current_step?: unknown }).current_step ??
          "completed"
      ),
      salesObjective: String(
        (data as { salesObjective?: unknown; sales_objective?: unknown })
          .salesObjective ??
          (data as { sales_objective?: unknown }).sales_objective ??
          ""
      ),
      userRole: String(
        (data as { userRole?: unknown; company_role?: unknown }).userRole ??
          (data as { company_role?: unknown }).company_role ??
          ""
      ),
      immediateGoal: String(
        (data as { immediateGoal?: unknown; short_term_goal?: unknown })
          .immediateGoal ??
          (data as { short_term_goal?: unknown }).short_term_goal ??
          ""
      ),
      companyWebsite: String(
        (
          data as {
            companyWebsite?: unknown;
            company_website?: unknown;
            website_url?: unknown;
          }
        ).companyWebsite ??
          (data as { company_website?: unknown }).company_website ??
          (data as { website_url?: unknown }).website_url ??
          ""
      ),
      marketFocus: String(
        (data as { marketFocus?: unknown; gtm?: unknown }).marketFocus ??
          (data as { gtm?: unknown }).gtm ??
          "B2B"
      ) as "B2B" | "B2C" | "B2G",
      companyInfo: (() => {
        const ci = (data as { companyInfo?: unknown }).companyInfo as unknown;
        if (
          ci &&
          typeof ci === "object" &&
          "industry" in (ci as Record<string, unknown>)
        ) {
          return ci as {
            industry: string;
            revenueSize: string;
            employeeSize: string;
          };
        }
        
        // Prefer selected industries from array fields, then single target_industry/company_industry
        const targetIndustriesAny =
          (data as { target_industries?: unknown; targetIndustries?: unknown }).target_industries ??
          (data as { targetIndustries?: unknown }).targetIndustries;
        let firstFromTargets = "";
        if (Array.isArray(targetIndustriesAny)) {
          const first = (targetIndustriesAny as unknown[])
            .map((item) => (typeof item === "string" ? item : String(item)))
            .find((item) => item && item.trim().length > 0);
          if (first) {
            firstFromTargets = first.trim();
          }
        } else if (typeof targetIndustriesAny === "string") {
          const first = targetIndustriesAny
            .split(/[,;]+/)
            .map((token) => token.trim())
            .find(Boolean);
          if (first) {
            firstFromTargets = first;
          }
        }
        // Extract industry from various possible backend keys
        const industryFromSingle = String(
          (data as { target_industry?: unknown; company_industry?: unknown; industry?: unknown })
            .target_industry ??
            (data as { company_industry?: unknown }).company_industry ??
            (data as { industry?: unknown }).industry ??
            ""
        );
        const industry = firstFromTargets || industryFromSingle;
        
        const revenueSize = String(
          (data as { company_revenue_size?: unknown; target_revenue_size?: unknown; revenue_size?: unknown }).company_revenue_size ??
            (data as { target_revenue_size?: unknown }).target_revenue_size ??
            (data as { revenue_size?: unknown }).revenue_size ??
            ""
        );
        
        const employeeSize = String(
          (data as { company_employee_size?: unknown; target_employee_size?: unknown; employee_size?: unknown })
            .company_employee_size ??
            (data as { target_employee_size?: unknown }).target_employee_size ??
            (data as { employee_size?: unknown }).employee_size ??
            ""
        );
        
        console.log("🔍 CONVERSION DEBUG - Extracted companyInfo:", { industry, revenueSize, employeeSize });
        
        return {
          industry: industry || "",
          revenueSize: revenueSize || "500k-1M",
          employeeSize: employeeSize || "51-200",
        };
      })(),
      targetTitles: (() => {
        const targetTitles = (data as { targetTitles?: unknown }).targetTitles;
        const targetDepartments = (data as { target_departments?: unknown }).target_departments;
        
        if (Array.isArray(targetTitles)) {
          return targetTitles;
        }
        
        if (Array.isArray(targetDepartments)) {
          return targetDepartments;
        }
        
        if (typeof targetDepartments === 'string') {
          return targetDepartments.split(',').map(s => s.trim());
        }
        
        return ['Sales', 'Marketing']; // Default value
      })(),
      targetRegion: (() => {
        const primaryRegion =
          (data as {
            targetRegion?: unknown;
            target_region?: unknown;
            region?: unknown;
            location?: unknown;
          }).targetRegion ??
          (data as { target_region?: unknown }).target_region ??
          (data as { region?: unknown }).region ??
          (data as { location?: unknown }).location ??
          "";
        const regionRaw = (data as { target_region_raw?: unknown }).target_region_raw;
        const region = String(primaryRegion || "").trim();
        const finalRegion =
          region ||
          (typeof regionRaw === "string" ? regionRaw.trim() : "") ||
          "";
        console.log("🔍 CONVERSION DEBUG - Extracted targetRegion:", finalRegion);
        return finalRegion || undefined;
      })(),
      targetEmployeeSize:
        ((data as { targetEmployeeSize?: unknown; target_employee_size?: unknown })
          .targetEmployeeSize as string) ??
        ((data as { target_employee_size?: unknown }).target_employee_size as string) ??
        "51-200",
      // ✅ CRITICAL FIX: Add targetIndustry extraction from backend
      // New: extract array-based target industries
      targetIndustries: (() => {
        const raw =
          (data as { target_industries?: unknown; targetIndustries?: unknown }).target_industries ??
          (data as { targetIndustries?: unknown }).targetIndustries;
        if (Array.isArray(raw)) {
          return (raw as unknown[])
            .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
            .filter((item) => item.length > 0);
        }
        if (typeof raw === "string") {
          const normalized = raw
            .split(/[,;]+/)
            .map((token) => token.trim())
            .filter(Boolean);
          if (normalized.length > 0) {
            return normalized;
          }
        }
        const single =
          (data as { targetIndustry?: unknown; target_industry?: unknown }).targetIndustry ??
          (data as { target_industry?: unknown }).target_industry;
        if (typeof single === "string" && single.trim().length > 0) {
          return [single.trim()];
        }
        const rawFallback = (data as { target_industries_raw?: unknown }).target_industries_raw;
        if (typeof rawFallback === "string") {
          const normalized = rawFallback
            .split(/[,;]+/)
            .map((token) => token.trim())
            .filter(Boolean);
          if (normalized.length > 0) {
            return normalized;
          }
        }
        return undefined;
      })(),
      // Legacy single removed: rely exclusively on targetIndustries
      // ✅ CRITICAL FIX: Add targetLocation extraction from backend
      targetLocation: (() => {
        const targetLoc = String(
          (data as { targetLocation?: unknown; target_location?: unknown })
            .targetLocation ??
            (data as { target_location?: unknown }).target_location ??
            ""
        );
        console.log("🔍 CONVERSION DEBUG - Extracted targetLocation:", targetLoc);
        return targetLoc || undefined;
      })(),
      hasTargetList:
        ((
          data as {
            hasTargetList?: unknown;
            target_audience_list_exist?: unknown;
          }
        ).hasTargetList as boolean) ??
        ((data as { target_audience_list_exist?: unknown })
          .target_audience_list_exist as boolean),
      contactListStatus: (() => {
        const cls = (data as { contactListStatus?: unknown })
          .contactListStatus as unknown;
        if (
          cls &&
          typeof cls === "object" &&
          "isUpToDate" in (cls as Record<string, unknown>)
        ) {
          return cls as {
            isUpToDate: boolean;
            isVerified: boolean;
            needsEnrichment: boolean;
          };
        }
        return undefined;
      })(),
      outreachChannels:
        ((data as { outreachChannels?: unknown; outreach_channels?: unknown })
          .outreachChannels as string[]) ??
        ((data as { outreach_channels?: unknown }).outreach_channels as
          | string[]
          | undefined),
      leadHandlingCapacity:
        ((
          data as {
            leadHandlingCapacity?: unknown;
            lead_handling_capacity?: unknown;
          }
        ).leadHandlingCapacity as number) ??
        ((data as { lead_handling_capacity?: unknown })
          .lead_handling_capacity as number),
      currentLeadGeneration:
        ((
          data as {
            currentLeadGeneration?: unknown;
            current_lead_generation?: unknown;
          }
        ).currentLeadGeneration as number) ??
        ((data as { current_lead_generation?: unknown })
          .current_lead_generation as number),
      budget: (data as { budget?: unknown }).budget as string,
      completedAt:
        ((data as { completedAt?: unknown; completed_at?: unknown })
          .completedAt as string) ??
        ((data as { completed_at?: unknown }).completed_at as string),
    };
    
    // Log final converted data for debugging
    console.log("🔍 CONVERSION DEBUG - Final converted OnboardingData:", {
      companyWebsite: result.companyWebsite,
      salesObjective: result.salesObjective,
      userRole: result.userRole,
      immediateGoal: result.immediateGoal,
      marketFocus: result.marketFocus,
      companyInfoIndustry: result.companyInfo?.industry,
      targetIndustry: result.targetIndustry, // ✅ NEW
      targetRegion: result.targetRegion,
      targetLocation: result.targetLocation, // ✅ NEW
      targetTitles: result.targetTitles,
      targetEmployeeSize: result.targetEmployeeSize,
      budget: result.budget,
      fullData: result
    });
    
    return result;
  };

  const syncOnboardingToDashboard = useCallback(
    async (
      snapshot: Record<string, unknown> | OnboardingData,
      userIdentifier?: string,
      contextLabel = "psa_page"
    ): Promise<void> => {
      try {
        const normalized = convertOnboardingData(
          snapshot as Record<string, unknown>
        );

        const resolvedUserId =
          userIdentifier ||
          (isAuthenticated
            ? String(userProfile?.user?.id || "")
            : getUserId());

        if (!resolvedUserId) {
          console.warn(
            "[Onboarding Sync] Missing user identifier; skipping sync."
          );
          return;
        }

        const response = await fetch("/api/onboarding/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            onboardingData: normalized,
            anonymousUserId: resolvedUserId,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `[Onboarding Sync] Failed for ${contextLabel}:`,
            response.status,
            errorText
          );
        } else {
          console.log(
            `[Onboarding Sync] Success for ${contextLabel} ->`,
            resolvedUserId
          );

          if (process.env.NODE_ENV !== "production") {
            try {
              const verifyResponse = await fetch(
                `/api/onboarding/get?anonymousUserId=${encodeURIComponent(
                  resolvedUserId
                )}`
              );
              if (verifyResponse.ok) {
                const verifyPayload = await verifyResponse.json();
                console.log(
                  `[Onboarding Sync] Verification snapshot for ${resolvedUserId}:`,
                  verifyPayload?.onboarding || verifyPayload
                );
              } else {
                console.warn(
                  "[Onboarding Sync] Verification fetch failed:",
                  verifyResponse.status
                );
              }
            } catch (verifyError) {
              console.warn(
                "[Onboarding Sync] Verification errored:",
                verifyError
              );
            }
          }
        }
      } catch (error) {
        console.error(
          `[Onboarding Sync] Unexpected error for ${contextLabel}:`,
          error
        );
      }
    },
    [isAuthenticated, userProfile]
  );

  const persistConversationalOnboardingCompletion = async (
    backendState: Record<string, unknown> | undefined,
    sourceLabel = "conversational_auto_completion"
  ): Promise<void> => {
    if (!backendState || Object.keys(backendState).length === 0) {
      console.warn(
        "[Onboarding Sync] Empty backend state provided, skipping completion persistence."
      );
      return;
    }

    if (onboardingCompletionSyncRef.current) {
      console.log(
        "[Onboarding Sync] Completion already persisted in this session, skipping duplicate."
      );
      return;
    }

    const resolvedUserId = isAuthenticated
      ? String(userProfile?.user?.id || "")
      : getUserId();

    if (!resolvedUserId) {
      console.warn(
        "[Onboarding Sync] Unable to resolve user ID during conversational completion; skipping persistence."
      );
      return;
    }

    onboardingCompletionSyncRef.current = true;

    try {
      const normalized = convertOnboardingData(backendState);
      const completionPayload: OnboardingData = {
        ...normalized,
        userId: resolvedUserId,
        currentStep: "completed",
        completedAt: normalized.completedAt || new Date().toISOString(),
      };

      await chatApi.saveOnboardingData(
        completionPayload as Record<
          string,
          string | number | boolean | object | undefined
        >
      );

      await syncOnboardingToDashboard(
        completionPayload,
        resolvedUserId,
        sourceLabel
      );

      console.log(
        "[Onboarding Sync] Conversational completion persisted successfully."
      );
    } catch (error) {
      onboardingCompletionSyncRef.current = false;
      console.error(
        "[Onboarding Sync] Failed to persist conversational completion:",
        error
      );
    }
  };
  const handleModeChange = async (mode: ModeType): Promise<void> => {
    // Mode validation: prevent switching from research to lightning
    if (activeMode === "research" && mode === "lightning") {
      console.warn('⚠️ MODE VALIDATION: Cannot switch from research to lightning mode. Research mode must be explicitly exited first.');
      return;
    }
    
    // Authentication disabled - allow direct access to ResearchGPT
    // if (mode === "research" && !isAuthenticated) {
    //   setShowResearchGPTGate(true);
    //   return;
    // }
    
    // Handle research mode - select mode only; redirect happens on Send/Enter
    if (mode === "research") {
      if (typeof window !== 'undefined' && window.tracker) {
        window.tracker.trackEvent("research_mode_activated", {
          source: "psa_page",
          timestamp: new Date().toISOString()
        });
      }
      // Just switch to research mode and wait for user to type, no banners
      setActiveMode("research");
      // Persist research mode to localStorage
      localStorage.setItem('activeMode', 'research');
      try { localStorage.removeItem('lightningModeData'); } catch {}
      return;
    }
    
    
    
    // Handle Focus Mode - Check if first interaction and onboarding completion
    if (mode === "focus") {
      // Don't check onboarding status if we're already in a chat
      if (!activeChatId && !urlChatId && !currentChatId) {
        const checkOnboardingStatus = async () => {
          try {
            // Get the latest onboarding data from backend
            const backendData = await chatApi.getOnboardingData();
            const normalized = (backendData as unknown as Record<string, unknown>)?.hasOwnProperty?.("onboarding")
              ? ((backendData as unknown as Record<string, unknown>)["onboarding"] as Record<string, unknown>)
              : ((backendData as unknown as Record<string, unknown>)?.hasOwnProperty?.("data")
                ? ((backendData as unknown as Record<string, unknown>)["data"] as Record<string, unknown>)
                : (backendData as unknown as Record<string, unknown>));
            console.log(
              "📊 Focus Mode - Backend onboarding data (normalized):",
              normalized
            );
            
              if (normalized && Object.keys(normalized).length > 0) {
                // If backend marks as completed, trust that over field presence
                const isCompletedFlag =
                  (normalized as Record<string, unknown>).status ===
                    "completed" ||
                  Boolean(
                    (normalized as Record<string, unknown>)[
                      "onboarding_completed"
                    ]
                  );

                // User has onboarding data, check if complete using actual backend keys
                const requiredFields = [
                "sales_objective",
                "company_role",
                "short_term_goal",
                "website_url",
                "gtm",
                "target_industries",
                "target_revenue_size",
                "target_employee_size",
                "target_departments",
                "target_region",
                // Treat target_location as optional; backend often returns null
                ];
                const hasAllRequiredFields = requiredFields.every((key) => {
                  const val = (normalized as Record<string, unknown>)[key];
                if (Array.isArray(val)) return val.length > 0;
                return (
                  val !== undefined && val !== null && String(val).length > 0
                );
                });
              
              if (isCompletedFlag || hasAllRequiredFields) {
                console.log(
                  "✅ Onboarding already completed, showing existing user modal"
                );
                setIsFirstUserInteraction(false);
                setIsOnboardingMode(false);
                setIsOnboardingChat(false);
                // Update local state with backend data
                const transformedData = convertOnboardingData(
                  normalized as unknown as Record<string, unknown>
                );
                setOnboardingData({
                  ...transformedData,
                  completedAt: new Date().toISOString(),
                });
                setShowExistingUserModal(true);
                // Keep current mode (lightning) to show modal on homepage background
              } else {
                console.log("🔄 Onboarding partially completed, resuming...");
                setIsFirstUserInteraction(false);
                setIsOnboardingMode(true);
                setIsOnboardingChat(false);
                // Update local state with backend data
                const transformedData = convertOnboardingData(
                  normalized as unknown as Record<string, unknown>
                );
                setOnboardingData(transformedData);
                // Switch to focus mode for onboarding
                setActiveMode(mode);
                setShowHyperspeed(false);
                // Kick off conversational onboarding so chat isn't empty
                try {
                  await handleStartConversationalOnboarding();
                } catch (e) {
                  console.error("Failed to start conversational onboarding:", e);
                }
              }
            } else {
              console.log(
                "🆕 No onboarding data found, showing onboarding modal"
              );
              setIsFirstUserInteraction(true);
              setIsOnboardingMode(false);
              setIsOnboardingChat(false);
              setShowOnboardingModal(true);
              setOnboardingData({
                userId: !isAuthenticated
                  ? getUserId()
                  : String(userProfile?.user?.id || ""),
                currentStep: "start",
              });
              // Keep current mode (lightning) to show modal on homepage background
            }
          } catch (error) {
            console.error("Error checking onboarding status:", error);
            // Fallback to local check
            if (isFirstUserInteraction) {
              setIsOnboardingMode(false);
              setIsOnboardingChat(false);
              setShowOnboardingModal(true);
              // Keep current mode (lightning) to show modal on homepage background
            } else if (
              onboardingData &&
              onboardingData.completedAt &&
              onboardingData.currentStep === "completed"
            ) {
              setIsOnboardingMode(false);
              setIsOnboardingChat(false);
            } else {
              setIsOnboardingMode(false);
              setIsOnboardingChat(false);
              setShowOnboardingModal(true);
              // Keep current mode (lightning) to show modal on homepage background
            }
          }
        };
        
        checkOnboardingStatus();
      } else {
        // We're in a chat, ensure onboarding mode is off and switch to focus mode
        console.log("🎯 In chat mode, switching to focus mode");
        setIsOnboardingMode(false);
        setIsOnboardingChat(false);
        setIsFirstUserInteraction(false);
        setActiveMode(mode);
        setShowHyperspeed(false);
      }
      return; // Early return to avoid setting mode again
    } else {
      // Exit onboarding mode when switching away from Focus Mode
      setIsOnboardingMode(false);
      setShowOnboardingCompletion(false);
      
      // Only show hyperspeed when switching to lightning mode
      if (mode === "lightning") {
        console.log('🔍 PSA Lightning Mode activated, waiting for user input before creating chat');
        setShowHyperspeed(true);
        setHasPrompted(false);

        const currentChat = currentChatId ? chatSessions.find(c => c.id === currentChatId) : undefined;

        if (currentChatId && (!currentChat || currentChat.mode !== "lightning")) {
          console.log('⚡ Preparing fresh Lightning Mode session, clearing current chat selection');
          setCurrentChatId(null);
          setProcessingChatId(null);
          setIsMessageInProgress(false);
          setCurrentModeChat(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('currentModeChat');
          }
        }
      }
    }
    
    // Final validation: prevent switching to lightning if currently in research mode
    if (activeMode === "research" && mode === "lightning") {
      console.warn('⚠️ MODE VALIDATION: Cannot switch from research to lightning mode. Please exit research mode first.');
      return;
    }
    
    console.log('🔍 PSA Setting activeMode to:', mode);
    const previousMode = activeMode;
    setActiveMode(mode);
    
    // Track mode change and cleanup data
    trackModeChange(mode);
    if (previousMode !== mode) {
      cleanupModeData(previousMode, mode);
    }
  };

  // Research configuration handler
  const handleResearchConfigConfirm = async () => {
    console.log("handleResearchConfigConfirm called");
    console.log("isChatResearch:", isChatResearch);
    console.log("input:", input);
    console.log("input.trim():", input.trim());
    
    setShowResearchConfig(false);
    
    if (isChatResearch) {
      // Handle research in current chat context
      if (input.trim()) {
        console.log("Calling handleChatResearch with:", input.trim());
        // Set loading states for research
        setIsResearchLoading(true);
        setIsProcessing(true);
        setProcessingChatId(currentChatId);
        setIsMessageInProgress(true);
        
        try {
          console.log("About to call handleChatResearch");
          await handleChatResearch(input.trim());
          console.log("handleChatResearch completed");
          setInput(''); // Clear the input after research
        } catch (error) {
          console.error("Research failed:", error);
          // Add error message to chat
          const errorMessage: ChatMessage = {
            id: `error_${Date.now()}`,
            role: 'assistant',
            content: 'Sorry, I encountered an error while researching. Please try again.',
            timestamp: Date.now()
          };
          
          // Find the placeholder message and replace it with error
          setChatSessions(prev => 
            prev.map(chat => 
              chat.id === currentChatId 
                ? {
                    ...chat,
                    messages: chat.messages.map(msg => 
                      msg.content === 'Starting research...' && msg.role === 'assistant'
                        ? errorMessage
                        : msg
                    )
                  }
                : chat
            )
          );
        } finally {
          setIsResearchLoading(false);
          setIsProcessing(false);
          setProcessingChatId(null);
          setIsMessageInProgress(false);
        }
      } else {
        // Show error message for empty input
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          role: 'assistant',
          content: ` Please enter a research query in the input field before clicking "Research in Current Chat".`,
          timestamp: Date.now()
        };
        
        // Add error message to chat
        setChatSessions(prev => 
          prev.map(chat => 
            chat.id === currentChatId 
              ? {
                  ...chat,
                  messages: [...chat.messages, errorMessage]
                }
              : chat
          )
        );
      }
      setIsChatResearch(false);
    } else {
      // Create new chat for research mode
      const newChatId = await createNewChat();
      if (newChatId) {
        setCurrentChatId(newChatId);
        setProcessingChatId(newChatId);
        
        // Navigate to chat URL
        router.push(`/solutions/psa-suite-one-stop-solution/c/${newChatId}`);
      }
    }
  };

  // Start Lightning Mode using only a confirmed website (no research context transfer)
  const startLightningFromResearch = useCallback(async (site: string) => {
    const website = (site || '').trim();
    if (!website) return;
    
    try {
      // Save Lightning Mode data
      localStorage.setItem(
        'lightningModeData',
        JSON.stringify({ inputs: { website }, timestamp: Date.now() })
      );
      
      // Always create a NEW Lightning Mode chat (don't use current chat)
      console.log('⚡ Creating NEW Lightning Mode chat from ResearchGPT');
      const newChatId = await createNewChat("Lightning Mode Chat", undefined, "lightning");
      
      if (newChatId) {
        // Set active mode to lightning (this is intentional when starting lightning from research)
        setActiveMode("lightning");
        
        // Wait for chat to be added to chatSessions before navigating
        let chatReady = false;
        let attempts = 0;
        while (!chatReady && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 300));
          const chatExists = chatSessions.find(chat => chat.id === newChatId);
          if (chatExists) {
            chatReady = true;
            console.log('✅ Lightning Mode chat ready in sessions');
          }
          attempts++;
        }
        
        if (!chatReady) {
          console.warn('⚠️ Chat not found in sessions after creation, but proceeding anyway');
        }
        
        // Navigate to the new chat
        setCurrentChatId(newChatId);
        try {
          router.push(`/solutions/psa-suite-one-stop-solution/c/${newChatId}`);
        } catch (error) {
          console.error('Error navigating to Lightning Mode chat:', error);
          // Fallback: use window.location if router fails
          window.location.href = `/solutions/psa-suite-one-stop-solution/c/${newChatId}`;
        }
      } else {
        console.error('Failed to create Lightning Mode chat');
        // Fallback to mode change if chat creation fails
        handleModeChange('lightning');
      }
    } catch (error) {
      console.error('Error starting Lightning Mode from research:', error);
      // Fallback to mode change
      handleModeChange('lightning');
    }
  }, [createNewChat, setActiveMode, setCurrentChatId, router, handleModeChange, chatSessions]);

  // Expose opener to inline CTA buttons in chat
  useEffect(() => {
    if (typeof window === 'undefined') return;
    (window as any).openResearchWebsitePrompt = () => {
      console.log('🔘 openResearchWebsitePrompt called');
      setShowResearchWebsitePrompt(true);
    };
    return () => { try { delete (window as any).openResearchWebsitePrompt; } catch {} };
  }, [setShowResearchWebsitePrompt]);
  // Research handler for chat context
  const handleChatResearch = async (query: string) => {
    console.log("handleChatResearch called with query:", query);
    console.log("currentChatId:", currentChatId);
    console.log("isAuthenticated:", isAuthenticated);
    
    if (!currentChatId) {
      console.error("No active chat");
      return;
    }
    
    if (!isAuthenticated) {
      console.warn("User not authenticated, but proceeding with research for testing");
      // return; // Temporarily commented out for testing
    }

    // Add user message first
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: Date.now()
    };
    
    console.log("Adding user message:", userMessage);

    // Add user message to chat
    await chatApi.addMessage(currentChatId, { role: "user", content: query });
    
    // Add placeholder AI message for research loading
    const placeholderId = `research_loading_${Date.now()}`;
    const placeholderMessage: ChatMessage = {
      id: placeholderId,
      role: 'assistant',
      content: `# 🔍 ResearchGPT Analysis\n\n> **Status:** Starting research...\n> **Query:** ${query}\n> **Configuration:** ${researchConfig.category.replace('_', ' ').toUpperCase()} - ${researchConfig.depth.toUpperCase()}\n\n*Please wait while I analyze your request...*`,
      timestamp: Date.now()
    };
    
    console.log("Adding placeholder message:", placeholderMessage);
    
    // Update local state with both user and placeholder messages
    setChatSessions(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? {
              ...chat,
              messages: [...chat.messages, userMessage, placeholderMessage]
            }
          : chat
      )
    );

    try {
      // Prepare research payload for chat context
      const researchPayload = {
        query: query,
        category: researchConfig.category,
        depth: researchConfig.depth,
        timeframe: researchConfig.timeframe,
        geographic_scope: researchConfig.geoScope,
        website_url: null,
        website_url_2: null,
        company_size: researchConfig.companySize,
        revenue_category: researchConfig.revenueCategory,
        focus_on_leads: researchConfig.category === 'sales_opportunities',
        selected_models: { gpt4o: false, gemini: true, perplexity: false },
        web_search_enabled: researchConfig.useWebSearch,
        excel_data: null,
        excel_file_name: null,
        using_web_search: researchConfig.useWebSearch,
        config_summary: `ResearchGPT: ${researchConfig.category}, ${researchConfig.depth}`,
        deep_research: true,
        include_founders: true,
        include_products: true,
        analyze_sales_opportunities: researchConfig.category === 'sales_opportunities',
        include_tabular_data: true,
        extract_company_info: true,
        analyze_prospective_clients: true,
        include_employee_count: true,
        include_revenue_data: true,
        include_complete_urls: true,
        perplexity_model: 'llama-3.1-sonar-large-128k-online'
      };

      // Call multi-research-ai API
      console.log("Calling multi-research-ai API with payload:", researchPayload);
      const response = await fetch('/api/multi-research-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(researchPayload)
      });
      console.log("Multi-research-ai API response status:", response.status);

      if (response.ok) {
        const researchResult = await response.json();
        
        // Check if the results already contain proper formatting
        const hasProperFormatting = researchResult.gemini?.includes('# ') || 
                                   researchResult.gpt4o?.includes('# ') || 
                                   researchResult.perplexity?.includes('# ');
        
        let formattedResult = '';
        
        // Only add header if results don't already have proper formatting
        if (!hasProperFormatting) {
          formattedResult = `# 🔍 ResearchGPT Analysis\n\n`;
          
          // Add query and configuration in a nice info box
          formattedResult += `> **📋 Research Query:** ${query}\n`;
          formattedResult += `> **⚙️ Configuration:** ${researchConfig.category.replace('_', ' ').toUpperCase()} - ${researchConfig.depth.toUpperCase()} Research\n`;
          formattedResult += `> **🌍 Scope:** ${researchConfig.geoScope} | **📊 Company Size:** ${researchConfig.companySize} | **💰 Revenue:** ${researchConfig.revenueCategory}\n\n`;
        }
        
        // Add a separator
        formattedResult += `---\n\n`;
        
        if (researchResult.gemini) {
          formattedResult += `## 🤖 Gemini Research Results\n\n`;
          formattedResult += `${researchResult.gemini}\n\n`;
        }
        
        // Add sources section if available
        if (researchResult.sources && researchResult.sources.length > 0) {
          formattedResult += `## 📚 Research Sources\n\n`;
          researchResult.sources.forEach((source: string, index: number) => {
            formattedResult += `${index + 1}. ${source}\n`;
          });
          formattedResult += `\n`;
        }
        
        // Add footer with timestamp only if we added the main header
        if (!hasProperFormatting) {
          const now = new Date();
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const timestamp = now.toLocaleString();
          formattedResult += `---\n\n`;
          formattedResult += `*Research completed on ${timestamp} ${timezone} using ResearchGPT*`;
        }
        
        // Add the research result to the current chat
        await addAIMessage(currentChatId, formattedResult);
        
        // Update the chat sessions to replace the placeholder message with the actual result
        setChatSessions(prev => 
          prev.map(chat =>
            chat.id === currentChatId 
              ? {
                  ...chat,
                  messages: chat.messages.map(msg => 
                    msg.id === placeholderId 
                      ? {
                          ...msg,
                          content: formattedResult
                        }
                      : msg
                  )
                }
              : chat
          )
        );
        
      } else {
        const errorText = await response.text();
        console.error("Research API failed:", response.status, errorText);
        throw new Error(`Research API failed: ${response.status} - ${errorText}`);
      }
    } catch (researchError) {
      console.error("ResearchGPT error:", researchError);
      const errorMessage = `# ❌ ResearchGPT Error\n\n> **Error:** Sorry, I encountered an error while researching: ${researchError instanceof Error ? researchError.message : 'Unknown error'}\n\n> **Solution:** Please try again or check your research configuration.\n\n---\n\n*If the problem persists, please contact support.*`;
      await addAIMessage(currentChatId, errorMessage);
      
      // Update local state with error message (replace placeholder)
      setChatSessions(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? {
                ...chat,
                messages: chat.messages.map(msg => 
                  msg.id === placeholderId 
                    ? {
                        ...msg,
                        content: errorMessage
                      }
                    : msg
                )
              }
            : chat
        )
      );
    }
  };

  // Only show Hyperspeed until first prompt is submitted
  // Background and UI state - Set initial values based on whether we're loading a specific chat
  const [showHyperspeed, setShowHyperspeed] = useState(!initialChatId); // Don't show hyperspeed if loading a chat
  const [hasPrompted, setHasPrompted] = useState(!!initialChatId); // Set to true if loading a chat

  useEffect(() => {
    if (recentPrompt && !hasPrompted) {
      setShowHyperspeed(false);
      setHasPrompted(true);
    }
  }, [recentPrompt, hasPrompted]); // Only depends on prompt submission

  // Dropdown state for tools button
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isMultiResearchSelected, setIsMultiResearchSelected] = useState(false);
  
  // Tools dropdown selected mode state
  const [selectedToolMode, setSelectedToolMode] = useState<string | null>(null);
  
  // Close tools dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(event.target as Node) &&
        showToolsDropdown
      ) {
        setShowToolsDropdown(false);
      }
    };

    if (showToolsDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showToolsDropdown]);

  // Sync selectedToolMode with activeMode
  useEffect(() => {
    if (activeMode === "focus") {
      setSelectedToolMode('focus-mode');
    } else if (activeMode === "research") {
      setSelectedToolMode('researchgpt');
    } else if (activeMode === "lightning") {
      setSelectedToolMode('lightning');
    }
  }, [activeMode]);

  // Handler for voice button (stub)
  const handleVoiceClick = () => {
    setVoiceMode(true);
    setIsSpeaking(false);
  };

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['.xlsx', '.xls', '.csv', '.pdf'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (allowedTypes.includes(fileExtension)) {
        setUploadedFile(file);
        setUploadedFileName(file.name);
        
        // Track file upload
        if (typeof window !== 'undefined' && window.tracker) {
          window.tracker.trackEvent("bulk_upload_file", {
            source: "psa_page",
            fileType: fileExtension,
            fileName: file.name,
            fileSize: file.size,
            timestamp: new Date().toISOString()
          });
        }
        
        // Only redirect if Multi-researchGPT is selected
        if (isMultiResearchSelected) {
          const redirectUrl = `/multi-gpt-aggregated-research?uploadedFile=${encodeURIComponent(file.name)}`;
          window.location.href = redirectUrl;
        }
      } else {
        alert('Please upload a valid file type (.xlsx, .xls, .csv, .pdf)');
      }
    }
  };


  const handleVoiceStart = () => {
    setIsSpeaking((prev) => !prev);
    // Add your voice logic here (start/stop recognition)
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const saveOnboardingData = async (stepData: StepData, nextStep?: string) => {
    console.log("saveOnboardingData called with:", { stepData, nextStep });
    
    const updatedData = {
      ...onboardingData,
      ...stepData,
      currentStep: nextStep || currentOnboardingStep,
    };
    
    // If moving to completed step and no completedAt timestamp exists, set it
    if (nextStep === "completed" && !updatedData.completedAt) {
      updatedData.completedAt = new Date().toISOString();
      console.log("Setting completedAt timestamp:", updatedData.completedAt);
    }
    
    console.log("Updated onboarding data:", updatedData);
    
    setOnboardingData(updatedData);
    if (nextStep) {
      setCurrentOnboardingStep(nextStep);
      console.log("Setting current step to:", nextStep);
    }
    
    // If onboarding is completed, show completion screen instead of auto-analysis
    if (nextStep === "completed" || updatedData.completedAt) {
      console.log("Onboarding completed, showing completion screen");
      setIsOnboardingMode(false);
      setShowOnboardingCompletion(true); // Show manual trigger screen
    }
    
    // Save to backend API
    try {
      setBackendStatus((prev) => ({ ...prev, onboarding: "loading" }));
      
      // Get user ID (authenticated or anonymous)
      const currentUserId = isAuthenticated
        ? String(userProfile?.user?.id || "")
        : getUserId();
      
      if (!currentUserId) {
        console.log("No user ID available for saving onboarding data");
        setBackendStatus((prev) => ({ ...prev, onboarding: "error" }));
        return;
      }
      
      // Save using backend API
      await chatApi.saveOnboardingData(updatedData);
      await syncOnboardingToDashboard(updatedData, currentUserId, "psa_save_flow");
      
      setBackendStatus((prev) => ({ ...prev, onboarding: "success" }));
      console.log("Onboarding data saved to backend successfully");
    } catch (error) {
      console.error("Error saving onboarding data to backend:", error);
      setBackendStatus((prev) => ({ ...prev, onboarding: "error" }));
      
      // Fallback to localStorage if backend fails
      localStorage.setItem("onboardingData", JSON.stringify(updatedData));
      console.log("Saved to localStorage as fallback");
    } finally {
      // Reset status after 2 seconds
      setTimeout(() => {
        setBackendStatus((prev) => ({ ...prev, onboarding: "idle" }));
      }, 2000);
    }
  };

  // Manual trigger for onboarding analysis (called when user clicks the button)
  const startOnboardingAnalysis = async () => {
    console.log("Manual onboarding analysis started");
    setShowOnboardingCompletion(false);
    
    // Stay in focus mode and transition to chat interface
    setActiveMode("focus");
    setRecentPrompt(
      "Focus Mode Analysis - Generating your personalized insights..."
    );
    setShowHyperspeed(false);
    setHasPrompted(true);
    
    // Small delay to ensure UI switches
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    try {
      // Create a chat if we don't have one
      if (!currentChatId) {
        console.log("Creating new chat for manual analysis...");
        const chatId = await createNewChat();
        if (chatId) {
          console.log("Chat created successfully:", chatId);
          setCurrentChatId(chatId);
        }
      }
      
       await triggerOnboardingAnalysis(onboardingData as OnboardingData);
    } catch (error) {
      console.error("Error in manual analysis trigger:", error);
    }
  };

  // Handle conversational onboarding completion
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleConversationalOnboardingComplete = async (
    completedData: Record<string, unknown>
  ) => {
    console.log(
      "Conversational onboarding completed with data:",
      completedData
    );
    
    // Transform the data to match OnboardingData interface
    const transformedData: OnboardingData = {
      userId: !isAuthenticated
        ? getUserId()
        : String(userProfile?.user?.id || ""),
      currentStep: "completed",
      ...completedData,
      completedAt: new Date().toISOString(),
    };
    
    // Do not save onboarding chats to history/sidebar
    
    // Update local state
    setOnboardingData(transformedData);
    setIsOnboardingMode(false);
    setShowOnboardingCompletion(true);
    
    // Save to backend using existing save function
    try {
      await chatApi.saveOnboardingData(
        completedData as Record<
          string,
          string | number | boolean | object | undefined
        >
      );
      await syncOnboardingToDashboard(
        transformedData,
        transformedData.userId,
        "conversational_flow"
      );
      console.log(
        "Conversational onboarding data saved to backend successfully"
      );
    } catch (error) {
      console.error("Error saving conversational onboarding data:", error);
      // Fallback to localStorage
      localStorage.setItem("onboardingData", JSON.stringify(transformedData));
    }
  };

  // Start conversational onboarding in existing chat interface
  const handleStartConversationalOnboarding = async () => {
    console.log(
      "Starting conversational onboarding - showing welcome message and sales objective question"
    );
    // If this is a manual start (not via Restart), don't use restart mode
    setIsOnboardingRestartMode(false);
    onboardingCompletionSyncRef.current = false;
    
    // Only generate a new chatId if one does not exist
    if (!onboardingChatId) {
      const newOnboardingChatId = `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setOnboardingChatId(newOnboardingChatId);
    }

    // Do not clear onboardingMessages if already present (preserve history)
    if (onboardingMessages.length === 0) {
      // Get the initial question from the backend with clickable options
      setIsOnboardingMode(true);
      setIsOnboardingChat(true);
      
      // Call the backend to get the initial question with clickable options
      try {
        await handleOnboardingMessage("START_ONBOARDING");
      } catch (error) {
        console.error("Error starting onboarding:", error);
        // Fallback to basic message if backend fails
        const fallbackMessage = "Welcome to Sales Centri! Let me help you build a targeted sales strategy.";
        const welcomeAiMessage: ChatMessage = {
          id: `onboarding_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai_welcome`,
          role: "assistant",
          content: formatAIText(fallbackMessage),
          timestamp: Date.now(),
        };
        setOnboardingMessages([welcomeAiMessage]);
      }
    }
  };
  // Handle onboarding message (no chat creation, just onboarding API)
  const handleOnboardingMessage = useCallback(
    async (message: string) => {
      console.log("Processing onboarding message:", message);
    
    // Initialize currentMessages to handle both cases
    let currentMessages: ChatMessage[] = [];

    if (message === "START_ONBOARDING") {
      onboardingCompletionSyncRef.current = false;
    }

    // Don't show START_ONBOARDING to users - it's just for backend initialization
    if (message !== "START_ONBOARDING") {
      // Add user message to onboarding messages
      const userMessage: ChatMessage = {
        id: `onboarding_msg_${Date.now()}_user`,
          role: "user",
        content: message,
          timestamp: Date.now(),
        };

      // Capture history BEFORE adding the new user message to avoid double-counting in reconstruction
      const historyBefore = onboardingMessages;

        // Update messages and get the current state for conversation history
        setOnboardingMessages((prev) => {
          currentMessages = [...prev, userMessage];
          
          // Auto-scroll to bottom when user message appears
          setTimeout(() => {
            setShouldAutoScroll(true);
            scrollToBottom(true);
          }, 50); // Quick scroll for user message
          
          return currentMessages;
        });

      // For payload below, prefer history BEFORE the latest user message
      currentMessages = historyBefore as unknown as ChatMessage[];
    } else {
      // For START_ONBOARDING, use existing messages
      currentMessages = onboardingMessages;
    }
    
    try {
      // Get the proper JWT token for anonymous users (same as chatApi uses)
        const anonId = !isAuthenticated
          ? localStorage.getItem("tracker_anon_id")
          : undefined;
        const authToken = localStorage.getItem("salescentri_token");
      
      // Prepare headers with proper authentication
      const headers: Record<string, string> = {
          "Content-Type": "application/json",
      };
      
      // Add Bearer token if authenticated
      if (authToken) {
          headers["Authorization"] = `Bearer ${authToken}`;
      }
      
      // Prepare URL with restart semantics if needed, and anon_id query parameter if needed
        let url = "/api/onboarding/chat";
        if (isOnboardingRestartMode || isFreshOnboardingSession || message === "START_ONBOARDING") {
          url += "?ignore_external=1";
      }
      if (anonId && !authToken) {
        const params = new URLSearchParams();
          params.append("anon_id", anonId);
          url +=
            isOnboardingRestartMode || isFreshOnboardingSession
              ? `&${params.toString()}`
              : `?${params.toString()}`;
        }

        // Send conversation history to help backend track progress
        const payload: {
          message: string;
          chatId: string;
          conversationHistory?: { role: string; content: string }[];
        } = {
        message,
          chatId: onboardingChatId || `onboarding_${Date.now()}`,
        };

        // Always send conversation history so backend can track progress
        // Use the current messages we just updated (or existing messages for START_ONBOARDING)
        // IMPORTANT: Exclude the just-added user message from reconstruction
        const messagesToSend = message === "START_ONBOARDING" ? onboardingMessages : (currentMessages || []);
        payload.conversationHistory = messagesToSend.map((msg) => ({
          role: msg.role,
          content:
            msg.role === "assistant"
              ? msg.content.replace(/<[^>]*>/g, "")
              : msg.content,
        }));

        console.log("🎯 Sending onboarding payload:", {
          message: payload.message,
          chatId: payload.chatId,
          conversationHistoryLength: payload.conversationHistory?.length || 0,
          isRestartMode: isOnboardingRestartMode,
          conversationHistory: payload.conversationHistory,
        });

      // Call the onboarding API with the message
      const response = await fetch(url, {
          method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
          console.log("🎯 Onboarding API Response:", data);

        // Incrementally sync onboarding data with backend state for accurate summaries
        if (data?.onboarding?.currentState) {
          try {
            const convertedSnapshot = convertOnboardingData(
              data.onboarding.currentState as Record<string, unknown>
            );
            setOnboardingData((prev) => {
              const mergedCompanyInfo = {
                industry:
                  convertedSnapshot.companyInfo?.industry ??
                  prev.companyInfo?.industry ??
                  "",
                revenueSize:
                  convertedSnapshot.companyInfo?.revenueSize ??
                  prev.companyInfo?.revenueSize ??
                  "",
                employeeSize:
                  convertedSnapshot.companyInfo?.employeeSize ??
                  prev.companyInfo?.employeeSize ??
                  "",
              };

              const mergedData: OnboardingData = {
                ...prev,
                ...convertedSnapshot,
                userId: prev.userId || convertedSnapshot.userId || "",
                currentStep:
                  convertedSnapshot.currentStep || prev.currentStep || "start",
                companyInfo: mergedCompanyInfo,
                marketFocus:
                  convertedSnapshot.marketFocus || prev.marketFocus || "B2B",
                targetIndustries:
                  convertedSnapshot.targetIndustries ??
                  prev.targetIndustries ??
                  (convertedSnapshot as unknown as {
                    target_industries?: string[];
                  }).target_industries,
                targetTitles:
                  convertedSnapshot.targetTitles ?? prev.targetTitles,
                targetRegion:
                  convertedSnapshot.targetRegion ?? prev.targetRegion,
                targetLocation:
                  convertedSnapshot.targetLocation ?? prev.targetLocation,
                targetEmployeeSize:
                  convertedSnapshot.targetEmployeeSize ??
                  prev.targetEmployeeSize,
                hasTargetList:
                  typeof convertedSnapshot.hasTargetList === "boolean"
                    ? convertedSnapshot.hasTargetList
                    : prev.hasTargetList,
                budget: convertedSnapshot.budget ?? prev.budget,
                completedAt: convertedSnapshot.completedAt ?? prev.completedAt,
              };

              return mergedData;
            });
          } catch (syncError) {
            console.error(
              "⚠️ Failed to sync onboarding snapshot:",
              syncError
            );
          }
        }

        // Always use the backend's question as the next onboarding prompt
          const backendQuestion =
            data.question ||
            data.result ||
            data.response ||
            "I understand. Let me continue with the next question.";
        // Add backend question to onboarding messages
        const aiMessage: ChatMessage = {
          id: `onboarding_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai`,
            role: "assistant",
          content: formatAIText(backendQuestion), // Store formatted content
            timestamp: Date.now(),
        };
          setOnboardingMessages((prev) => {
            const newMessages = [...prev, aiMessage];

        // NO TYPING EFFECT - Display all options at once
        // Just scroll to the new message immediately
        setTimeout(() => {
          setShouldAutoScroll(true);
          scrollToBottom(true);
        }, 50); // Quick scroll to show message

        // Disable restart mode after first successful interaction
        if (isOnboardingRestartMode) {
          setIsOnboardingRestartMode(false);
        }

            return newMessages;
          });
        
        // Check if onboarding is complete
        if (data.onboarding?.isComplete) {
            console.log("🎉 Onboarding complete! Starting analysis phase...");
            // Reset fresh session flag since onboarding is complete
            setIsFreshOnboardingSession(false);

          try {
            await persistConversationalOnboardingCompletion(
              data.onboarding.currentState as Record<string, unknown>,
              "conversational_auto_completion"
            );
          } catch (persistenceError) {
            console.error(
              "[Onboarding Sync] Error persisting conversational completion:",
              persistenceError
            );
          }
          
          // During restart mode, allow completion to proceed to analysis again
          if (!onboardingData?.completedAt || isOnboardingRestartMode || isFreshOnboardingSession) {
            // Onboarding is complete, now start the analysis phase directly
            setTimeout(async () => {
              try {
                  await handleOnboardingComplete(
                    data.onboarding.currentState || {}
                  );
              } catch (error) {
                  console.error("Error in onboarding completion:", error);
              }
            }, 2000); // Shorter delay for better UX
          } else {
              console.log(
                "📝 Onboarding already completed, skipping duplicate completion"
              );
          }
        } else if (data.onboarding) {
            console.log("📊 Onboarding status:", {
            isComplete: data.onboarding.isComplete,
            nextField: data.onboarding.nextField,
            currentState: Object.keys(data.onboarding.currentState || {}),
          });
        }
      } else {
          console.error("Onboarding API error:", response.status);
        
        // Add error message
        const errorMessage: ChatMessage = {
          id: `onboarding_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai_error`,
            role: "assistant",
            content:
              "Sorry, I had trouble processing that. Could you please try again?",
            timestamp: Date.now(),
          };

          setOnboardingMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
        console.error("Error processing onboarding message:", error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `onboarding_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai_error`,
          role: "assistant",
          content:
            "Sorry, I had trouble processing that. Could you please try again?",
          timestamp: Date.now(),
        };

        setOnboardingMessages((prev) => [...prev, errorMessage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [
      onboardingChatId,
      isAuthenticated,
      onboardingData?.completedAt,
      typeOnboardingMessage,
      isOnboardingRestartMode,
      isFreshOnboardingSession,
    ]
  );

  // Update the ref when handleOnboardingMessage changes
  useEffect(() => {
    handleOnboardingMessageRef.current = handleOnboardingMessage;
  }, [handleOnboardingMessage]);

  // Handle Lightning Mode message processing
  const handleLightningModeMessage = useCallback(async (message: string): Promise<void> => {
    if (!currentChatId) return;
    
    // Enhanced mode isolation validation
    if (!validateModeIsolation("lightning", "Lightning Mode message processing")) {
      console.log('🔍 MODE ISOLATION: Skipping Lightning Mode message processing - not in Lightning Mode chat');
      return;
    }
    
    // Check if this is actually a lightning mode chat
    const currentChat = chatSessions.find(chat => chat.id === currentChatId);
    const isLightningModeChat = currentChat?.mode === "lightning";
    const isNonLightningChat = currentChat?.mode === "research" || currentChat?.mode === "focus" || currentChat?.mode === "explore" || currentChat?.mode === "brain";
    
    // Skip Lightning Mode processing if this is NOT a lightning mode chat
    if (isNonLightningChat) {
      console.log('🔍 Non-Lightning mode chat detected (mode: ' + currentChat?.mode + '), skipping lightning mode processing');
      return;
    }
    
    if (!isLightningModeChat) {
      console.log('🔍 Not a lightning mode chat, skipping lightning mode processing');
      return;
    }
    
    try {
      // Check for Lightning Mode data from homepage
      const lightningModeData = localStorage.getItem("lightningModeData");
      const pendingAnalysis = localStorage.getItem('pendingAnalysis');
      if (pendingAnalysis) {
        console.log('🔍 Pending analysis detected, suppressing lightning mode message processing');
        return;
      }
      if (lightningModeData) {
        console.log('🔍 Lightning Mode data found and chat is in lightning mode, processing...');
        const data = JSON.parse(lightningModeData);
        
        // Helper function to format inputs as string
        const formatLightningInputsAsString = (inputs: any): string => {
          const parts: string[] = [];
          if (inputs.email) parts.push(`My company email is: ${inputs.email}`);
          if (inputs.website) parts.push(`My company website is: ${inputs.website}`);
          if (inputs.linkedin) parts.push(`My LinkedIn profile is: ${inputs.linkedin}`);
          return parts.length > 0 ? parts.join('\n') : 'Lightning Mode activated';
        };
        
        // Handle different data formats
        let lightningInput: string;
        let lightningInputs: any;
        
        if (data.inputs?.website) {
          // Website from startLightningFromResearch
          lightningInput = `My company website is: ${data.inputs.website}`;
          lightningInputs = { website: data.inputs.website };
          console.log('🔍 Processing website from startLightningFromResearch:', lightningInput);
        } else if (data.inputs?.input) {
          // Regular input
          lightningInput = data.inputs.input;
          lightningInputs = data.inputs;
        } else if (data.inputs) {
          // Direct inputs object
          lightningInput = formatLightningInputsAsString(data.inputs);
          lightningInputs = data.inputs;
        } else {
          lightningInput = 'Lightning Mode activated';
          lightningInputs = {};
        }
        
        // Create lightning message from the data
        const lightningMessage = {
          id: `lightning_${Date.now()}`,
          role: 'user' as const,
          content: lightningInput,
          timestamp: data.timestamp || Date.now(),
          lightningMode: {
            type: 'lightning_mode',
            step: 'entry',
            data: lightningInputs,
            timestamp: data.timestamp || Date.now()
          }
        };
        
        console.log('🔍 Created lightning message:', lightningMessage);
        
        // Process the Lightning Mode entry
        await processLightningModeEntry(lightningMessage);
        return;
      }
      
      // Check if this is a Lightning Mode input (email/website/LinkedIn)
      const { parseLightningModeInput, validateLightningModeInputs, isLightningModeInput } = await import('../../lib/lightningModeInputParser');
      
      console.log('🔍 PSA Lightning Mode check:', {
        message: message.substring(0, 50) + '...',
        activeMode,
        isLightningMode: activeMode === "lightning",
        fullMessage: message
      });
      
      if (isLightningModeInput(message)) {
        console.log('🔍 PSA Lightning mode input detected, parsing...');
        // Parse inputs from textarea
        const lightningInputs = parseLightningModeInput(message);
        console.log('🔍 PSA Parsed lightning inputs:', lightningInputs);
        
        // Get tracker anon_id from localStorage and add to inputs
        const trackerAnonId = localStorage.getItem('tracker_anon_id');
        console.log('🔍 PSA Retrieved tracker_anon_id from localStorage:', trackerAnonId);
        
        if (trackerAnonId) {
          lightningInputs.userId = trackerAnonId;
          lightningInputs.anonymousUserId = trackerAnonId;
          console.log('🔍 PSA Added tracker_anon_id to lightningInputs:', lightningInputs);
        }
        
        const validation = validateLightningModeInputs(lightningInputs);
        console.log('🔍 PSA Validation result:', validation);
        
        if (!validation.isValid) {
          await addAIMessage(currentChatId, `Please provide valid inputs:\n${validation.errors.join('\n')}`);
          return;
        }
        
        // Process Lightning Mode entry
        const lightningMessage = {
          id: `lightning_entry_${Date.now()}`,
          role: 'user' as const,
          content: `Lightning Mode Entry: ${JSON.stringify(lightningInputs)}`,
          timestamp: Date.now(),
          lightningMode: {
            type: 'lightning_mode' as const,
            step: 'entry' as const,
            data: { inputs: lightningInputs },
            timestamp: Date.now()
          }
        };
        
        await processLightningModeEntry(lightningMessage);
        return;
      }
      
      // Check if this is a Lightning Mode question response
      const lightningData = localStorage.getItem('lightningModeData');
      if (lightningData) {
        console.log('🔍 PSA Found lightning mode data and chat is in lightning mode:', lightningData);
        try {
          const data = JSON.parse(lightningData);
          console.log('🔍 PSA Lightning Mode step check:', data.step);
          
          // Add user message to chat (force new message for Lightning Mode)
          // Check if this user response was already added
          const lastUserMessage = chatSessions.find(chat => chat.id === currentChatId)?.messages
            ?.filter(msg => msg.role === 'user')
            ?.slice(-1)[0];
          
          if (!lastUserMessage || lastUserMessage.content !== message) {
            // Add user response without Lightning Mode styling
            const userMessage: ChatMessage = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_user`,
              role: "user",
              content: message,
            timestamp: Date.now()
            };
            
            setChatSessions((prev) =>
              prev.map((chat) =>
                chat.id === currentChatId 
                  ? { ...chat, messages: [...chat.messages, userMessage] } 
                  : chat
              )
            );
          }
          
          // Handle based on current step
          const { handleQ1Response, handleQ2Response, handleQ3Response } = await import('../../lib/lightningModeHandlers');
          
          let responseMessage;
          
          if (data.step === 'q1') {
            responseMessage = await handleQ1Response(message, data.inputs);
          } else if (data.step === 'q2') {
            responseMessage = await handleQ2Response(message, data);
          } else if (data.step === 'q3') {
            responseMessage = await handleQ3Response(message, data);
          } else {
            // Not a question step, treat as regular message
            return;
          }
          
          // Add response to chat (force new message for Lightning Mode)
          await addAIMessage(currentChatId, responseMessage.content, true, responseMessage.lightningMode);
          
        } catch (error) {
          console.error('Error handling Lightning Mode step:', error);
          await addAIMessage(currentChatId, `Error processing your response: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return;
      }
      
      // If Lightning Mode is active but input doesn't match detection, treat as regular Lightning Mode input
      if (activeMode === "lightning") {
        console.log('🔍 Lightning Mode active but input not detected, treating as regular input');
        
        // Create Lightning Mode message for regular input
        const lightningMessage = {
          id: `lightning_entry_${Date.now()}`,
          role: 'user' as const,
          content: message,
          timestamp: Date.now(),
          lightningMode: {
            type: 'lightning_mode' as const,
            step: 'entry' as const,
            data: { input: message },
            timestamp: Date.now()
          }
        };
        
        await processLightningModeEntry(lightningMessage);
        return;
      }
      
      // Regular Lightning Mode message - process based on current step
      await processLightningModeResponse(message);
      
    } catch (error) {
      console.error('Lightning Mode message processing error:', error);
        await addAIMessage(currentChatId, `Error processing Lightning Mode message: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
    }
    
  }, [currentChatId, addAIMessage]);

  // Process Lightning Mode entry
  const processLightningModeEntry = useCallback(async (lightningMessage: any): Promise<void> => {
    if (!currentChatId) return;
    
    // Check if this is actually a lightning mode chat
    const currentChat = chatSessions.find(chat => chat.id === currentChatId);
    const isLightningModeChat = currentChat?.mode === "lightning";
    const isNonLightningChat = currentChat?.mode === "research" || currentChat?.mode === "focus" || currentChat?.mode === "explore" || currentChat?.mode === "brain";
    
    // Skip Lightning Mode processing if this is NOT a lightning mode chat
    if (isNonLightningChat) {
      console.log('🔍 Non-Lightning mode chat detected (mode: ' + currentChat?.mode + '), skipping lightning mode entry processing');
      return;
    }
    
    if (!isLightningModeChat) {
      console.log('🔍 Not a lightning mode chat, skipping lightning mode entry processing');
      return;
    }
    
    console.log('🔍 PSA processLightningModeEntry called with:', lightningMessage);
    
    try {
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: lightningMessage.id,
        role: 'user',
        content: lightningMessage.content,
        timestamp: lightningMessage.timestamp,
        lightningMode: lightningMessage.lightningMode
      };
      
      // Add to chat sessions
      setDeduplicatedChatSessions((prev) => {
        return prev.map((chat) =>
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, userMessage] }
            : chat
        );
      });
      
      // Save to backend
      await chatApi.addMessage(currentChatId, { 
        role: "user", 
        content: lightningMessage.content,
        lightningMode: lightningMessage.lightningMode
      });
      
       // Add welcome message first (force new message for Lightning Mode)
       await addAIMessage(currentChatId, "🎯 Welcome to Lightning Mode!\n\nI'm going to help you create your ideal customer profile and generate sample leads. Let's start with a few quick questions to personalize your experience.", true, {
        type: 'lightning_mode',
        step: 'welcome',
        data: lightningMessage.lightningMode.data,
        timestamp: Date.now()
      });
      
      // Add authentication information to Lightning Mode inputs
      const enhancedLightningData = {
        ...sanitizeLightningInputs(lightningMessage.lightningMode.data),
        userId: isAuthenticated ? String(userProfile?.user?.id || "") : getUserId(),
        anonymousUserId: !isAuthenticated ? getUserId() : undefined,
        isAuthenticated: isAuthenticated
      };
      
      // Prevent duplicate entries per chat
      if (hasLightningEntryFired(currentChatId)) {
        console.log('⏭️ Lightning entry already fired for this chat, skipping duplicate');
        return;
      }
      markLightningEntryFired(currentChatId);

      // Trigger Lightning Mode research
      console.log('🔍 PSA Calling handleLightningModeEntry with data:', enhancedLightningData);
      const { handleLightningModeEntry } = await import('../../lib/lightningModeHandlers');
      console.log('🔍 PSA About to call handleLightningModeEntry...');
      const researchMessage = await handleLightningModeEntry(enhancedLightningData);
      console.log('🔍 PSA handleLightningModeEntry returned:', researchMessage);
      console.log('🔍 PSA researchMessage.lightningMode:', researchMessage.lightningMode);
      console.log('🔍 PSA researchMessage.content preview:', researchMessage.content.substring(0, 200) + '...');
      
       // Add research results to chat (force new message for Lightning Mode)
       await addAIMessage(currentChatId, researchMessage.content, true, researchMessage.lightningMode);
      console.log('🔍 PSA Lightning mode message added to chat successfully');
      
      // Force autoscroll for Lightning Mode content
      setTimeout(() => {
        scrollToBottomLightning(true);
      }, 100);
      
    } catch (error) {
      console.error('Lightning Mode entry processing error:', error);
      await addAIMessage(currentChatId, `Error processing Lightning Mode entry: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
    }
  }, [currentChatId, addAIMessage, setDeduplicatedChatSessions]);

  // Process pending Lightning Mode messages when PSA suite loads
  useEffect(() => {
    const processPendingLightningMode = async () => {
      // Wait for chats to be loaded
      if (!chatsLoaded) {
        console.log('🔍 Chats not loaded yet, waiting...');
        return;
      }
      
      if (!currentChatId) return;
      
      // Wait for chat to be available in backend (with retries)
      const ensureChatReady = async (chatId: string): Promise<boolean> => {
        const chatInSessions = chatSessions.find(chat => chat.id === chatId);
        if (!chatInSessions) {
          console.log('🔍 Chat not in sessions yet, waiting...');
          return false;
        }
        
        // Verify chat exists in backend
        try {
          const chat = await chatApi.getChat(chatId);
          if (chat) {
            console.log('✅ Chat verified in backend:', chatId);
            return true;
          }
        } catch (error) {
          console.log('🔍 Chat verification failed, will retry:', error);
        }
        return false;
      };
      
      // Wait up to 5 seconds for chat to be ready
      let chatReady = await ensureChatReady(currentChatId);
      let attempts = 0;
      while (!chatReady && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        chatReady = await ensureChatReady(currentChatId);
        attempts++;
      }
      
      if (!chatReady) {
        console.error('⚠️ Chat not ready after waiting, skipping Lightning Mode processing');
        return;
      }
      
      // Only process lightning mode for lightning mode chats
      const currentChat = chatSessions.find(chat => chat.id === currentChatId);
      const isLightningModeChat = currentChat?.mode === "lightning" || (activeMode as string) === "lightning";
      const isNonLightningModeChat = currentChat?.mode === "research" || currentChat?.mode === "focus" || currentChat?.mode === "explore" || currentChat?.mode === "brain";
      
      // Skip Lightning Mode processing if this is NOT a lightning mode chat (and not switching to lightning)
      if (isNonLightningModeChat && (activeMode as string) !== "lightning") {
        console.log('🔍 Non-Lightning mode chat detected (mode: ' + currentChat?.mode + '), skipping pending lightning mode processing');
        return;
      }

      // Skip if onboarding just completed and pending analysis is queued
      const pendingAnalysis = localStorage.getItem('pendingAnalysis');
      if (pendingAnalysis) {
        console.log('🔍 Pending analysis detected, skipping pending lightning mode processing');
        return;
      }
      
      // If chat mode is not lightning but activeMode is, or if we're switching to lightning, process it
      if (!isLightningModeChat && (activeMode as string) !== "lightning") {
        console.log('🔍 Not a lightning mode chat and not switching to lightning, skipping pending lightning mode processing');
        return;
      }
      
      // Check if Lightning Mode has already been processed for this chat
      const processedKey = `lightning_processed_${currentChatId}`;
      if (localStorage.getItem(processedKey)) {
        console.log('🔍 PSA Lightning Mode already processed for this chat, skipping...');
        return;
      }
      
      // Additional check: ensure we're not already processing
      const processingKey = `lightning_processing_${currentChatId}`;
      if (localStorage.getItem(processingKey)) {
        console.log('🔍 PSA Lightning Mode already being processed for this chat, skipping...');
        return;
      }
      
      try {
        // Check for pending Lightning Mode message from homepage
        const lightningModeData = localStorage.getItem('lightningModeData');
        if (lightningModeData) {
          console.log('🔍 PSA Processing Lightning Mode data from homepage for lightning mode chat');
          
          // Set processing flag to prevent concurrent processing
          localStorage.setItem(processingKey, 'true');
          
          const data = JSON.parse(lightningModeData);
          
          // Mark as processed to prevent multiple calls
          localStorage.setItem(processedKey, 'true');
          
          // Handle different data formats (website from startLightningFromResearch, or regular input)
          let lightningInput: string;
          let lightningInputs: any;
          
          if (data.inputs?.website) {
            // Website from startLightningFromResearch
            lightningInput = `My company website is: ${data.inputs.website}`;
            lightningInputs = { website: data.inputs.website };
            console.log('🔍 Processing website from startLightningFromResearch in pending handler:', lightningInput);
          } else if (data.inputs?.input) {
            // Regular input
            lightningInput = data.inputs.input;
            lightningInputs = data.inputs;
          } else if (data.inputs) {
            // Direct inputs object - format as string
            const parts: string[] = [];
            if (data.inputs.email) parts.push(`My company email is: ${data.inputs.email}`);
            if (data.inputs.website) parts.push(`My company website is: ${data.inputs.website}`);
            if (data.inputs.linkedin) parts.push(`My LinkedIn profile is: ${data.inputs.linkedin}`);
            lightningInput = parts.length > 0 ? parts.join('\n') : 'Lightning Mode activated';
            lightningInputs = data.inputs;
          } else {
            lightningInput = 'Lightning Mode activated';
            lightningInputs = {};
          }
          
          // Create lightning message from the data
          const lightningMessage = {
            id: `lightning_${Date.now()}`,
            role: 'user' as const,
            content: lightningInput,
            timestamp: data.timestamp || Date.now(),
            lightningMode: {
              type: 'lightning_mode',
              step: 'entry',
              data: lightningInputs,
              timestamp: data.timestamp || Date.now()
            }
          };
          
          console.log('🔍 Created lightning message in pending handler:', lightningMessage);
          
          // Check if this is actually a lightning mode chat
          const currentChatForDirect = chatSessions.find(chat => chat.id === currentChatId);
          const isLightningModeChatForDirect = currentChatForDirect?.mode === "lightning" || activeMode === "lightning";
          
          if (!isLightningModeChatForDirect) {
            console.log('🔍 Not a lightning mode chat, skipping direct lightning mode entry processing');
            return;
          }
          
          // Process the Lightning Mode entry directly here to avoid dependency issues
          console.log('🔍 PSA processLightningModeEntry called with:', lightningMessage);
          
          try {
            // Add user message to chat
            const userMessage: ChatMessage = {
              id: lightningMessage.id,
              role: 'user',
              content: lightningMessage.content,
              timestamp: lightningMessage.timestamp,
              lightningMode: lightningMessage.lightningMode
            };
            
            // Add to chat sessions
            setDeduplicatedChatSessions((prev) => {
              return prev.map((chat) =>
                chat.id === currentChatId 
                  ? { ...chat, messages: [...chat.messages, userMessage] }
                  : chat
              );
            });
            
            // Save to backend
            await chatApi.addMessage(currentChatId, { 
              role: "user", 
              content: lightningMessage.content,
              lightningMode: lightningMessage.lightningMode
            });
            
             // Add welcome message first (force new message for Lightning Mode)
             await addAIMessage(currentChatId, "🎯 Welcome to Lightning Mode!\n\nI'm going to help you create your ideal customer profile and generate sample leads. Let's start with a few quick questions to personalize your experience.", true, {
               type: 'lightning_mode',
               step: 'welcome',
               data: lightningMessage.lightningMode.data,
               timestamp: Date.now()
             });
             
             // Add authentication information to Lightning Mode inputs
             const enhancedLightningData = {
               ...lightningMessage.lightningMode.data,
               userId: isAuthenticated ? String(userProfile?.user?.id || "") : getUserId(),
               anonymousUserId: !isAuthenticated ? getUserId() : undefined,
               isAuthenticated: isAuthenticated
             };
             
             // Sanitize and guard against duplicate firing
             const guardedData = sanitizeLightningInputs(enhancedLightningData);
             if (hasLightningEntryFired(currentChatId)) {
               console.log('⏭️ Lightning entry already fired for this chat (homepage handoff), skipping duplicate');
             } else {
               markLightningEntryFired(currentChatId);
               // Trigger Lightning Mode research
               console.log('🔍 PSA Calling handleLightningModeEntry with data:', guardedData);
               const { handleLightningModeEntry } = await import('../../lib/lightningModeHandlers');
               console.log('🔍 PSA About to call handleLightningModeEntry...');
               const researchMessage = await handleLightningModeEntry(guardedData);
               
               // Add research results to chat (force new message for Lightning Mode)
               await addAIMessage(currentChatId, researchMessage.content, true, researchMessage.lightningMode);
             }
             console.log('🔍 PSA Lightning Mode homepage handoff processed');
             
             // Force autoscroll for Lightning Mode content
             setTimeout(() => {
               scrollToBottomLightning(true);
             }, 100);
             
           } catch (error) {
             console.error('Lightning Mode entry processing error:', error);
             await addAIMessage(currentChatId, `Error processing Lightning Mode entry: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
           } finally {
             // Clear processing flag
             localStorage.removeItem(processingKey);
           }
        }
      } catch (error) {
        console.error('Error processing pending Lightning Mode message:', error);
        // Remove both flags on error so it can be retried
        localStorage.removeItem(processedKey);
        localStorage.removeItem(processingKey);
      }
    };
    
    processPendingLightningMode();
  }, [currentChatId, addAIMessage, setDeduplicatedChatSessions, chatSessions, chatsLoaded, activeMode]); // Added dependencies to ensure proper timing

  // Lightning Mode event listeners for research completion
  useEffect(() => {
    if (!currentChatId) return;

    // Check if event listeners are already set up for this chat
    const listenersKey = `lightning_listeners_setup_${currentChatId}`;
    if (localStorage.getItem(listenersKey)) {
      console.log('🔍 Lightning Mode event listeners already set up for this chat, skipping...');
      return;
    }

    console.log('🔍 Setting up Lightning Mode event listeners');
    
    // Mark listeners as set up for this chat
    localStorage.setItem(listenersKey, 'true');

    // Listen for research completion (legacy - now handled by postLightningMessage events)
    const handleResearchComplete = async (event: any) => {
      console.log('🔍 Lightning research completed (legacy handler):', event.detail);
      // This handler is no longer used in the new sequential flow
      // Results are now posted via postLightningMessage events
    };

    // Listen for research errors
    const handleResearchError = async (event: any) => {
      console.log('🔍 Lightning research error event received:', event.detail);
      const friendly = 'You need to enter a valid website to use Lightning Mode. Refresh to homepage and try again.';
      // Show friendly guidance (force new message for Lightning Mode)
      await addAIMessage(currentChatId, `❌ ${friendly}`, true, {
        type: 'lightning_mode',
        step: 'error',
        data: { friendly },
        timestamp: Date.now()
      });
    };

    // Listen for show results request (legacy - now handled by postLightningMessage events)
    const handleShowResults = async (event: any) => {
      console.log('🔍 Show Lightning results (legacy handler):', event.detail);
      // This handler is no longer used in the new sequential flow
      // Results are now posted via postLightningMessage events
    };

    // Listen for research timeout
    const handleResearchTimeout = async (event: any) => {
      console.log('🔍 Lightning research timeout event received:', event.detail);
      
      const { message } = event.detail;
      
       // Show timeout message (force new message for Lightning Mode)
       await addAIMessage(currentChatId, `⏰ ${message}`, true, {
        type: 'lightning_mode',
        step: 'timeout',
        data: { message },
        timestamp: Date.now()
      });
    };

    // Handle Lightning Mode message posting
    const handlePostLightningMessage = async (event: CustomEvent) => {
      console.log('🔍 handlePostLightningMessage called with:', event.detail);
      const { content, type, timestamp } = event.detail;
      
      if (currentChatId) {
        console.log('🔍 Adding Lightning Mode message to chat:', type, content.substring(0, 100) + '...');
        
        // For HTML content, we need to handle it specially with dangerouslySetInnerHTML
        const isHTMLFlag = type === 'icp' || type === 'company_summary' || type === 'lightning_leads' || type === 'lightning_dashboard_button' || type === 'lightning_disclaimer' || type === 'error' || event.detail.isHTML;
        console.log('🔍 Setting isHTML flag:', { type, isHTMLFlag, eventDetailIsHTML: event.detail.isHTML });
        
        // Ensure company_summary type is properly set for metadata
        const lightningType = type === 'compact_summary' ? 'company_summary' : type;
        
        const messageData = {
          type: 'lightning_mode',
          step: lightningType,
          data: { 
            content, 
            type, 
            isHTML: isHTMLFlag,
            isStructuredData: event.detail.isStructuredData || false,
            structuredData: event.detail.data || null
          },
          timestamp: timestamp || Date.now()
        };
        
        await addAIMessage(currentChatId, content, true, messageData);
        console.log('🔍 Lightning Mode message added to chat successfully');
      } else {
        console.error('🔍 No currentChatId available for Lightning Mode message');
      }
    };

    // Add event listeners
    window.addEventListener('lightningResearchComplete', handleResearchComplete);
    window.addEventListener('lightningResearchError', handleResearchError);
    window.addEventListener('showLightningResults', handleShowResults);
    window.addEventListener('lightningResearchTimeout', handleResearchTimeout);
    window.addEventListener('postLightningMessage', handlePostLightningMessage as EventListener);

    // Cleanup function
    return () => {
      window.removeEventListener('lightningResearchComplete', handleResearchComplete);
      window.removeEventListener('lightningResearchError', handleResearchError);
      window.removeEventListener('showLightningResults', handleShowResults);
      window.removeEventListener('lightningResearchTimeout', handleResearchTimeout);
      window.removeEventListener('postLightningMessage', handlePostLightningMessage as EventListener);
      
      // Remove listeners setup flag when chat changes
      if (currentChatId) {
        const listenersKey = `lightning_listeners_setup_${currentChatId}`;
        localStorage.removeItem(listenersKey);
      }
    };
  }, [currentChatId, addAIMessage]);
  // Process Lightning Mode response
  const processLightningModeResponse = useCallback(async (message: string): Promise<void> => {
    if (!currentChatId) return;
    
    // Check if this is actually a lightning mode chat
    const currentChat = chatSessions.find(chat => chat.id === currentChatId);
    const isLightningModeChat = currentChat?.mode === "lightning";
    const isNonLightningChat = currentChat?.mode === "research" || currentChat?.mode === "focus" || currentChat?.mode === "explore" || currentChat?.mode === "brain";
    
    // Skip Lightning Mode processing if this is NOT a lightning mode chat
    if (isNonLightningChat) {
      console.log('🔍 Non-Lightning mode chat detected (mode: ' + currentChat?.mode + '), skipping lightning mode response processing');
      return;
    }
    
    if (!isLightningModeChat) {
      console.log('🔍 Not a lightning mode chat, skipping lightning mode response processing');
      return;
    }
    
    try {
      // currentChat already found above for mode validation
      if (!currentChat) return;
      
      // Find the last Lightning Mode message to determine current step
      const lastLightningMessage = currentChat.messages
        .filter(msg => msg.lightningMode)
        .pop();
      
      if (!lastLightningMessage) {
        // No Lightning Mode context, treat as regular message
        await sendMessage(message);
        return;
      }
      
      const currentStep = lastLightningMessage.lightningMode?.step;
      
      // Process based on current step - this is handled by the main handleSend function now
      console.log('🔍 Lightning Mode message processing - redirecting to main handler');
      // Default to regular message processing
      await sendMessage(message);
      
    } catch (error) {
      console.error('Lightning Mode response processing error:', error);
      await addAIMessage(currentChatId, `Error processing Lightning Mode response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [currentChatId, addAIMessage, sendMessage, chatSessions]);

  // Handle send function for both normal chat and onboarding
  const handleSend = useCallback(async (): Promise<void> => {
    if (input.trim()) {
      // Check for backend sidebar prompt override
      const useOverride = !!pendingBackendOverride;
      const messageToSend = pendingBackendOverride?.trim() || input;
      const visibleToDisplay = useOverride && pendingVisibleOverride ? pendingVisibleOverride : undefined;
      // Clear the input immediately for better UX
      setInput("");
      
      // Only use the backend override once
      if (useOverride) {
        setPendingBackendOverride(null);
      }
      
      console.log('🔍 PSA handleSend called:', {
        input: input.substring(0, 50) + '...',
        activeMode,
        isOnboardingChat,
        useOverride,
        messageToSend: messageToSend.substring(0, 50) + '...'
      });
      
      // Check if we're in Lightning Mode - prefer chat mode; if no chat yet, allow activeMode
      const currentChatForSend = chatSessions.find(chat => chat.id === currentChatId);
      const isLightningModeChatForSend = (currentChatForSend?.mode === "lightning") || (!currentChatForSend && activeMode === "lightning");
      const isNonLightningModeChatForSend = currentChatForSend?.mode === "research" || currentChatForSend?.mode === "explore" || currentChatForSend?.mode === "focus" || currentChatForSend?.mode === "brain";
      
      // Handle ResearchGPT explicitly (match homepage behavior)
      if (activeMode === "research" || currentChatForSend?.mode === "research") {
        console.log('🔍 Processing as ResearchGPT Mode (PSA)');
        try {
          // If already in a research chat, run Multi-GPT in place
          if (currentChatForSend?.mode === "research" && currentChatId) {
            await handleResearchInChat(messageToSend);
            return;
          }
          // Otherwise create a dedicated research chat and redirect
          const inferredTitle = messageToSend && messageToSend.trim().length > 0 ? messageToSend.trim().slice(0, 40) : "ResearchGPT Chat";
          const chat = await chatApi.createChat(inferredTitle, "research");
          if (chat && chat.id) {
            // Store research metadata and pending message for auto-trigger on arrival
            localStorage.setItem("researchMeta", JSON.stringify({
              chatId: chat.id,
              query: messageToSend,
              mode: "research",
              isFirstMessage: true
            }));
            localStorage.setItem("pendingChatMessage", JSON.stringify({
              chatId: chat.id,
              message: messageToSend,
              timestamp: Date.now()
            }));
            try {
              router.push(`/solutions/psa-suite-one-stop-solution/c/${chat.id}`);
            } catch {
              window.location.href = `/solutions/psa-suite-one-stop-solution/c/${chat.id}`;
            }
            return;
          } else {
            alert("Failed to create chat. Please try again.");
            return;
          }
        } catch (err) {
          console.error('Failed to process ResearchGPT flow:', err);
          alert('Something went wrong starting ResearchGPT. Please try again.');
          return;
        }
      }

      // Skip Lightning Mode processing if this is NOT a lightning mode chat
      if (isNonLightningModeChatForSend) {
        console.log('🔍 Non-Lightning mode chat detected (mode: ' + currentChatForSend?.mode + '), processing as regular chat');
        // Process as regular message (chat creation and routing handled inside)
        await sendMessage(messageToSend, visibleToDisplay);
        return;
      }
      
      if (isLightningModeChatForSend) {
        console.log('🔍 PSA Lightning Mode chat detected, processing input:', messageToSend);
        try {
          // Ensure we have a dedicated Lightning Mode chat; otherwise mirror homepage handoff flow
          if (!currentChatId || (currentChatForSend && currentChatForSend.mode !== "lightning")) {
            console.log('🔍 No Lightning Mode chat available, creating one and deferring processing');
            
            const { parseLightningModeInput, validateLightningModeInputs, isLightningModeInput } = await import('../../lib/lightningModeInputParser');
            const looksLikeLightningInput = isLightningModeInput(messageToSend);
            let parsedInputs = looksLikeLightningInput
              ? parseLightningModeInput(messageToSend)
              : { input: messageToSend.trim() };
            const validation = validateLightningModeInputs(parsedInputs);
            const inputsForLightning = validation.isValid
              ? parsedInputs
              : { input: messageToSend.trim() };
            
            const payloadInputs: Record<string, unknown> = {
              ...sanitizeLightningInputs(inputsForLightning),
              isAuthenticated,
            };
            
            if (isAuthenticated) {
              payloadInputs.userId = String(userProfile?.user?.id || "");
            } else {
              payloadInputs.anonymousUserId = getUserId();
            }
            
            try {
              const trackerAnonId = localStorage.getItem('tracker_anon_id');
              if (trackerAnonId && !payloadInputs.userId) {
                payloadInputs.userId = trackerAnonId;
              }
              if (trackerAnonId && !payloadInputs.anonymousUserId) {
                payloadInputs.anonymousUserId = trackerAnonId;
              }
            } catch (error) {
              console.warn('🔍 Unable to access tracker_anon_id for Lightning Mode payload:', error);
            }
            
            const newChatId = await createNewChat("Lightning Mode Chat", undefined, "lightning");
            if (!newChatId) {
              console.error('❌ Failed to create chat for Lightning Mode');
              return;
            }
            
            try {
              localStorage.setItem("lightningModeData", JSON.stringify({
                chatId: newChatId,
                inputs: payloadInputs,
                step: 'entry',
                timestamp: Date.now()
              }));
              localStorage.removeItem(`lightning_processed_${newChatId}`);
              localStorage.removeItem(`lightning_processing_${newChatId}`);
              localStorage.removeItem(`lightning_entry_fired_${newChatId}`);
            } catch (error) {
              console.warn('🔍 Failed to persist Lightning Mode payload for new chat:', error);
            }
            
            try {
              router.push(`/solutions/psa-suite-one-stop-solution/c/${newChatId}`);
            } catch {
              // Fallback to hard navigation
              if (typeof window !== 'undefined') {
                window.location.href = `/solutions/psa-suite-one-stop-solution/c/${newChatId}`;
              }
            }
            
            // Force reload (like homepage handoff) to reset component state
            if (typeof window !== 'undefined') {
              window.location.href = `/solutions/psa-suite-one-stop-solution/c/${newChatId}`;
            }
            return;
          }

          // Check if this is a Lightning Mode response (button click or typed response)
          const lightningData = localStorage.getItem('lightningModeData');
          
          if (lightningData) {
            const data = JSON.parse(lightningData);
            console.log('🔍 Found Lightning Mode data, current step:', data.step);
            
            // Handle based on current step
            const { handleQ1Response, handleQ2Response, handleQ3Response } = await import('../../lib/lightningModeHandlers');
            
            let responseMessage;
            
            if (data.step === 'q1') {
              responseMessage = await handleQ1Response(messageToSend, data.inputs);
            } else if (data.step === 'q2') {
              responseMessage = await handleQ2Response(messageToSend, data);
            } else if (data.step === 'q3') {
              responseMessage = await handleQ3Response(messageToSend, data);
            } else {
              // Not currently in a question step (e.g., results_display). If user typed fresh inputs,
              // restart Lightning flow instead of treating as a plain message.
              const { parseLightningModeInput, validateLightningModeInputs, isLightningModeInput } = await import('../../lib/lightningModeInputParser');
              const looksLikeEntry = isLightningModeInput(messageToSend) || /website|linkedin|email/i.test(messageToSend);
              if (looksLikeEntry) {
                console.log('🔍 Restarting Lightning Mode flow from non-question step');
                // Clear stale state so we can re-enter flow
                localStorage.removeItem('lightningModeData');
                const parsed = isLightningModeInput(messageToSend)
                  ? parseLightningModeInput(messageToSend)
                  : { input: messageToSend };
                const validation = validateLightningModeInputs(parsed);
                if (!validation.isValid) {
                  if (currentChatId) {
                    await addAIMessage(currentChatId, `Please provide valid inputs:\n${validation.errors.join('\n')}`);
                  }
                  return;
                }
                const enhancedLightningInputs = {
                  ...parsed,
                  userId: isAuthenticated ? String(userProfile?.user?.id || "") : getUserId(),
                  anonymousUserId: !isAuthenticated ? getUserId() : undefined,
                  isAuthenticated: isAuthenticated
                };
                const { handleLightningModeEntry } = await import('../../lib/lightningModeHandlers');
                const researchMessage = await handleLightningModeEntry(enhancedLightningInputs);
                if (currentChatId && researchMessage) {
                  await addAIMessage(currentChatId, researchMessage.content, true, researchMessage.lightningMode);
                  setTimeout(() => {
                    scrollToBottomLightning(true);
                  }, 100);
                }
                return;
              }
              // Otherwise treat it as a regular message
              console.log('🔍 Lightning Mode not in question step and no entry pattern; treating as regular message');
              if (currentChatId) {
                await addAIMessage(currentChatId, messageToSend, true);
              }
              return;
            }
            
            console.log('🔍 Lightning Mode response generated:', responseMessage);
            
            // Add response to chat
            if (currentChatId && responseMessage) {
              await addAIMessage(currentChatId, responseMessage.content, false, responseMessage.lightningMode);
              // Ensure we're on the chat route after Q&A completes
              if (typeof window !== 'undefined') {
                const onChatRoute = /\/solutions\/psa-suite-one-stop-solution\/c\//.test(window.location.pathname);
                if (!onChatRoute) {
                  try {
                    router.push(`/solutions/psa-suite-one-stop-solution/c/${currentChatId}`);
                  } catch {}
                }
              }
            }
          } else {
            // No Lightning Mode data, treat as initial entry
            console.log('🔍 No Lightning Mode data found, treating as initial entry');
            
            // Handle Lightning Mode entry directly in current chat
            const { parseLightningModeInput, validateLightningModeInputs, isLightningModeInput } = await import('../../lib/lightningModeInputParser');
            
            // Check if input contains Lightning Mode data
            const isLightningInput = isLightningModeInput(messageToSend);
            console.log('🔍 Is Lightning Mode input?', isLightningInput);
            
            let lightningInputs;
            
            if (isLightningInput) {
              // Parse inputs from textarea
              lightningInputs = parseLightningModeInput(messageToSend);
              const validation = validateLightningModeInputs(lightningInputs);
              
              if (!validation.isValid) {
                if (currentChatId) {
                  await addAIMessage(currentChatId, `Please provide valid inputs:\n${validation.errors.join('\n')}`);
                }
                return;
              }
            } else {
              // Treat as regular Lightning Mode input
              lightningInputs = { input: messageToSend };
            }
            
            // Add authentication information to Lightning Mode inputs
            const enhancedLightningInputs = {
              ...sanitizeLightningInputs(lightningInputs),
              userId: isAuthenticated ? String(userProfile?.user?.id || "") : getUserId(),
              anonymousUserId: !isAuthenticated ? getUserId() : undefined,
              isAuthenticated: isAuthenticated
            };
            
            // Trigger Lightning Mode research
            if (hasLightningEntryFired(currentChatId)) {
              console.log('⏭️ Lightning entry already fired for this chat (typed entry), skipping duplicate');
              return;
            }
            markLightningEntryFired(currentChatId);
            console.log('🔍 PSA Calling handleLightningModeEntry with data:', enhancedLightningInputs);
            const { handleLightningModeEntry } = await import('../../lib/lightningModeHandlers');
            console.log('🔍 PSA About to call handleLightningModeEntry...');
            const researchMessage = await handleLightningModeEntry(enhancedLightningInputs);
            console.log('🔍 PSA handleLightningModeEntry returned:', researchMessage);
            
             // Add research results to chat (force new message for Lightning Mode)
            if (currentChatId && researchMessage) {
               await addAIMessage(currentChatId, researchMessage.content, true, researchMessage.lightningMode);
               
               // Force autoscroll for Lightning Mode content
               setTimeout(() => {
                 scrollToBottomLightning(true);
               }, 100);

               // Ensure we're on the chat route when Lightning results start
               if (typeof window !== 'undefined') {
                 const onChatRoute = /\/solutions\/psa-suite-one-stop-solution\/c\//.test(window.location.pathname);
                 if (!onChatRoute) {
                   try {
                     router.push(`/solutions/psa-suite-one-stop-solution/c/${currentChatId}`);
                   } catch {}
                 }
               }
            }
          }
        } catch (error) {
          console.error('🔍 Lightning Mode error:', error);
          if (currentChatId) {
            await addAIMessage(currentChatId, `Error processing Lightning Mode: ${error instanceof Error ? error.message : 'Unknown error'}`, true);
          }
        }
      } else if (isOnboardingChat) {
        handleOnboardingMessage(messageToSend);
      } else {
        sendMessage(messageToSend, visibleToDisplay);
      }
      
      // Clear visible override after we've used it to display the first user message
      if (useOverride) {
        setPendingVisibleOverride(null);
        setPendingTitleOverride(null);
      }
      // Clearing of forceGeminiOnlyNext handled in sendMessage after AI call
      
      setInput("");
      // Clear the input field immediately
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }

  }, [input, sendMessage, isOnboardingChat, handleOnboardingMessage, activeMode, lightningMode, addAIMessage, currentChatId, chatSessions, processLightningModeEntry, scrollToBottomLightning, pendingBackendOverride, pendingVisibleOverride]);

  // Define global functions for Lightning Mode button clicks
  useEffect(() => {
    if (typeof window !== 'undefined' && currentChatId) {
      // Check if handlers are already set up for this chat
      const handlersKey = `lightning_handlers_setup_${currentChatId}`;
      if (localStorage.getItem(handlersKey)) {
        console.log('🔍 Lightning Mode button handlers already set up for this chat, skipping...');
        return;
      }
      
      console.log('🔍 Setting up Lightning Mode button handlers...');
      console.log('🔍 Current chat ID for button handlers:', currentChatId);
      
      // Mark handlers as set up for this chat
      localStorage.setItem(handlersKey, 'true');
      
      (window as any).handleQ1Response = async (productFocus: string) => {
        console.log('🔍 Q1 Response clicked:', productFocus);
        if (!currentChatId) return;
        
        // Check if this is actually a lightning mode chat
        const currentChat = chatSessions.find(chat => chat.id === currentChatId);
        const isLightningModeChat = currentChat?.mode === "lightning";
        
        if (!isLightningModeChat) {
          console.log('🔍 Not a lightning mode chat, skipping Q1 response processing');
          return;
        }
        
        try {
          // Get current lightning mode data
          const lightningData = localStorage.getItem('lightningModeData');
          if (!lightningData) {
            console.error('🔍 No lightning mode data found');
            return;
          }
          
          const data = JSON.parse(lightningData);
          
          // Add user message to chat (force new message for Lightning Mode)
          // Check if this user response was already added
          const lastUserMessage = chatSessions.find(chat => chat.id === currentChatId)?.messages
            ?.filter(msg => msg.role === 'user')
            ?.slice(-1)[0];
          
          if (!lastUserMessage || lastUserMessage.content !== productFocus) {
            // Add user response without Lightning Mode styling
            const userMessage: ChatMessage = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_user`,
              role: "user",
              content: productFocus,
            timestamp: Date.now()
            };
            
            setChatSessions((prev) =>
              prev.map((chat) =>
                chat.id === currentChatId 
                  ? { ...chat, messages: [...chat.messages, userMessage] } 
                  : chat
              )
            );
            
            // Save user message to backend
            await chatApi.addMessage(currentChatId, {
              role: "user",
              content: productFocus,
            });
          }
          
          // Handle Q1 response
          const { handleQ1Response } = await import('../../lib/lightningModeHandlers');
          const responseMessage = await handleQ1Response(productFocus, data.inputs);
          
          // Add response to chat (force new message for Lightning Mode)
          await addAIMessage(currentChatId, responseMessage.content, true, responseMessage.lightningMode);
          
          // Force autoscroll for Lightning Mode content
          setTimeout(() => {
            scrollToBottomLightning(true);
          }, 100);
          
        } catch (error) {
          console.error('Error handling Q1 response:', error);
        }
      };
      
      (window as any).handleQ2Response = async (outreachPreference: string) => {
        console.log('🔍 Q2 Response clicked:', outreachPreference);
        if (!currentChatId) return;
        
        // Check if this is actually a lightning mode chat
        const currentChat = chatSessions.find(chat => chat.id === currentChatId);
        const isLightningModeChat = currentChat?.mode === "lightning";
        
        if (!isLightningModeChat) {
          console.log('🔍 Not a lightning mode chat, skipping Q2 response processing');
          return;
        }
        
        try {
          // Get current lightning mode data
          const lightningData = localStorage.getItem('lightningModeData');
          if (!lightningData) {
            console.error('🔍 No lightning mode data found');
            return;
          }
          
          const data = JSON.parse(lightningData);
          
          // Add user message to chat (force new message for Lightning Mode)
          // Check if this user response was already added
          const lastUserMessage = chatSessions.find(chat => chat.id === currentChatId)?.messages
            ?.filter(msg => msg.role === 'user')
            ?.slice(-1)[0];
          
          if (!lastUserMessage || lastUserMessage.content !== outreachPreference) {
            // Add user response without Lightning Mode styling
            const userMessage: ChatMessage = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_user`,
              role: "user",
              content: outreachPreference,
            timestamp: Date.now()
            };
            
            setChatSessions((prev) =>
              prev.map((chat) =>
                chat.id === currentChatId 
                  ? { ...chat, messages: [...chat.messages, userMessage] } 
                  : chat
              )
            );
            
            // Save user message to backend
            await chatApi.addMessage(currentChatId, {
              role: "user",
              content: outreachPreference,
            });
          }
          
          // Handle Q2 response
          const { handleQ2Response } = await import('../../lib/lightningModeHandlers');
          const responseMessage = await handleQ2Response(outreachPreference, data);
          
          // Add response to chat (force new message for Lightning Mode)
          await addAIMessage(currentChatId, responseMessage.content, true, responseMessage.lightningMode);
          
          // Force autoscroll for Lightning Mode content
          setTimeout(() => {
            scrollToBottomLightning(true);
          }, 100);
          
        } catch (error) {
          console.error('Error handling Q2 response:', error);
        }
      };
      
      (window as any).handleQ3Response = async (leadHandoffPreference: string) => {
        console.log('🔍 Q3 Response clicked:', leadHandoffPreference);
        if (!currentChatId) return;
        
        // Check if this is actually a lightning mode chat
        const currentChat = chatSessions.find(chat => chat.id === currentChatId);
        const isLightningModeChat = currentChat?.mode === "lightning";
        
        if (!isLightningModeChat) {
          console.log('🔍 Not a lightning mode chat, skipping Q3 response processing');
          return;
        }
        
        try {
          // Get current lightning mode data
          const lightningData = localStorage.getItem('lightningModeData');
          if (!lightningData) {
            console.error('🔍 No lightning mode data found');
            return;
          }
          
          const data = JSON.parse(lightningData);
          
          // Add user message to chat (force new message for Lightning Mode)
          // Check if this user response was already added
          const lastUserMessage = chatSessions.find(chat => chat.id === currentChatId)?.messages
            ?.filter(msg => msg.role === 'user')
            ?.slice(-1)[0];
          
          if (!lastUserMessage || lastUserMessage.content !== leadHandoffPreference) {
            // Add user response without Lightning Mode styling
            const userMessage: ChatMessage = {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_user`,
              role: "user",
              content: leadHandoffPreference,
            timestamp: Date.now()
            };
            
            setChatSessions((prev) =>
              prev.map((chat) =>
                chat.id === currentChatId 
                  ? { ...chat, messages: [...chat.messages, userMessage] } 
                  : chat
              )
            );
            
            // Save user message to backend
            await chatApi.addMessage(currentChatId, {
              role: "user",
              content: leadHandoffPreference,
            });
          }
          
          // Handle Q3 response
          const { handleQ3Response } = await import('../../lib/lightningModeHandlers');
          const responseMessage = await handleQ3Response(leadHandoffPreference, data);
          
          // Add response to chat (force new message for Lightning Mode)
          await addAIMessage(currentChatId, responseMessage.content, true, responseMessage.lightningMode);
          
          // Force autoscroll for Lightning Mode content
          setTimeout(() => {
            scrollToBottomLightning(true);
          }, 100);
          
        } catch (error) {
          console.error('Error handling Q3 response:', error);
        }
      };
      
      console.log('🔍 Lightning Mode button handlers attached to window:', {
        handleQ1Response: typeof (window as any).handleQ1Response,
        handleQ2Response: typeof (window as any).handleQ2Response,
        handleQ3Response: typeof (window as any).handleQ3Response
      });
    }
  }, [currentChatId, addAIMessage]);

  // ResearchGPT Configuration Modal Component
  const ResearchGPTConfigModal = () => {
    if (!showResearchGPTConfig) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-60 p-3">
        <div className="bg-gradient-to-b from-gray-900 via-black to-gray-800 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg text-white border border-blue-500/10 relative max-h-[75vh] overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => setShowResearchGPTConfig(false)}
            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-white transition-colors z-10 p-1"
          >
            <X size={18} />
          </button>
          
          {/* Header */}
          <div className="p-2.5 border-b border-gray-700">
            <div className="flex items-center space-x-2.5">
              <div className="w-5.5 h-5.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Atom className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white truncate">ResearchGPT Configuration</h3>
                <p className="text-gray-400 text-xs truncate">Configure your research parameters</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-2.5 overflow-y-auto max-h-[55vh] space-y-2.5">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Research Category</label>
              <select
                value={researchGPTConfig.category}
                onChange={(e) => setResearchGPTConfig(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Research Category"
              >
                <option value="market_analysis">Market Analysis</option>
                <option value="sales_opportunities">Sales Opportunities</option>
                <option value="competitor_analysis">Competitor Analysis</option>
                <option value="industry_trends">Industry Trends</option>
              </select>
            </div>

            {/* Depth */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Research Depth</label>
              <select
                value={researchGPTConfig.depth}
                onChange={(e) => setResearchGPTConfig(prev => ({ ...prev, depth: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Research Depth"
              >
                <option value="basic">Basic</option>
                <option value="comprehensive">Comprehensive</option>
                <option value="deep">Deep</option>
              </select>
            </div>

            {/* Timeframe */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Timeframe</label>
              <select
                value={researchGPTConfig.timeframe}
                onChange={(e) => setResearchGPTConfig(prev => ({ ...prev, timeframe: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Timeframe"
              >
                <option value="1M">1 Month</option>
                <option value="3M">3 Months</option>
                <option value="6M">6 Months</option>
                <option value="1Y">1 Year</option>
                <option value="2Y">2 Years</option>
              </select>
            </div>

            {/* Geographic Scope */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Geographic Scope</label>
              <select
                value={researchGPTConfig.geoScope}
                onChange={(e) => setResearchGPTConfig(prev => ({ ...prev, geoScope: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Geographic Scope"
              >
                <option value="Global">Global</option>
                <option value="North America">North America</option>
                <option value="Europe">Europe</option>
                <option value="Asia-Pacific">Asia-Pacific</option>
                <option value="India">India</option>
              </select>
            </div>

          </div>
          
          {/* Footer */}
          <div className="p-2.5 border-t border-gray-700 bg-gray-900/50">
            <div className="flex justify-end items-center space-x-2.5">
              <button
                onClick={() => setShowResearchGPTConfig(false)}
                className="px-3.5 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResearchGPTConfig(false);
                  if (input.trim()) {
                    handleResearchInChat(input);
                  }
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-xs font-medium"
              >
                Start Research
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  // Monitor for focus mode modal trigger specifically
  useEffect(() => {
    if (typeof window !== "undefined" && isAuthenticated && !isAuthLoading) {
      const checkModalFlags = () => {
        const focusModalFlag = localStorage.getItem("showFocusModeModal");
        const onboardingModalFlag = localStorage.getItem("showOnboardingModal");
        const preservedChatData = localStorage.getItem('salescentri_preserved_chat');
        
        // Check URL parameters to see if this was a login redirect
        const urlParams = new URLSearchParams(window.location.search);
        const hasAuthParams = urlParams.has('token') || urlParams.has('refreshToken');
        
        console.log('🔍 MODAL FLAGS CHECK:', {
          isAuthenticated,
          isAuthLoading,
          focusModalFlag,
          onboardingModalFlag,
          hasPreservedChat: !!preservedChatData,
          hasAuthParams,
          currentUrl: window.location.href,
          currentChatId,
          urlChatId,
          isOnboardingMode,
          isOnboardingChat
        });

        // Try to parse preserved chat data if it exists
        if (preservedChatData) {
          try {
            const chatData = JSON.parse(preservedChatData);
            console.log('🔍 PRESERVED CHAT DATA:', {
              id: chatData.id,
              title: chatData.title,
              messageCount: chatData.messages?.length || 0,
              createdAt: chatData.createdAt
            });
          } catch (error) {
            console.error('Error parsing preserved chat:', error);
          }
        }
      };
      
      checkModalFlags();
    }
  }, [isAuthenticated, isAuthLoading, currentChatId, urlChatId, isOnboardingMode, isOnboardingChat]);

  useEffect(() => {
  if (
      typeof window !== "undefined" &&
    isAuthenticated &&
    !isAuthLoading && // Add this condition to ensure auth check is complete
    !currentChatId &&
    !urlChatId &&
    !recentPrompt &&
    !isOnboardingMode &&
    !isOnboardingChat
    // Remove isProcessing condition as it can prevent modal from showing
  ) {
      // Check for focus mode modal first (has highest priority)
      const shouldShowFocusModal = localStorage.getItem("showFocusModeModal");
      const preservedChatData = localStorage.getItem('salescentri_preserved_chat');
      
      // Prevent showing modal multiple times
      if (focusModalAlreadyShown) {
        console.log("🎯 Focus modal already shown, skipping");
        return;
      }
      
      if (shouldShowFocusModal === "true") {
        localStorage.removeItem("showFocusModeModal");
        console.log("🎯 FOCUS MODE MODAL detected after login");
        console.log("🎯 Preserved chat data exists:", !!preservedChatData);
        
        if (preservedChatData) {
          console.log("🎯 Showing focus mode modal with preserved chat");
          setShowFocusModeModal(true);
          setFocusModalAlreadyShown(true);
          setActiveMode("lightning"); // Keep on homepage
          return;
        } else {
          console.log("⚠️ Focus mode flag set but no preserved chat data found");
          // Fall through to regular onboarding modal
        }
      }

      // Fallback: Check for preserved chat data even without the flag
      // This handles cases where user is already authenticated but has preserved chat
      if (!shouldShowFocusModal && preservedChatData) {
        try {
          const chatData = JSON.parse(preservedChatData);
          if (chatData && chatData.messages && chatData.messages.length > 0) {
            console.log("🎯 FALLBACK: Found preserved chat without flag - showing focus modal");
            setShowFocusModeModal(true);
            setFocusModalAlreadyShown(true);
            setActiveMode("lightning");
            return;
          }
        } catch (error) {
          console.error("Error parsing preserved chat data:", error);
          localStorage.removeItem('salescentri_preserved_chat');
        }
      }

      const shouldShowModal = localStorage.getItem("showOnboardingModal");
      if (shouldShowModal === "true") {
        localStorage.removeItem("showOnboardingModal");
      
      // Check if user has existing onboarding data
      const checkExistingUser = async () => {
        try {
          const backendData = await chatApi.getOnboardingData();
          if (backendData && Object.keys(backendData).length > 5) {
            // User has onboarding data - show existing user modal
              const hasAllRequiredFields =
                backendData.sales_objective &&
                                        backendData.company_role && 
                                        backendData.short_term_goal && 
                                        backendData.company_industry &&
                                        backendData.target_audience_list_exist !== undefined;
            
            if (hasAllRequiredFields) {
                console.log(
                  "✅ Existing user detected, showing existing user modal"
                );
                const transformedData = convertOnboardingData(
                  backendData as unknown as Record<string, unknown>
                );
                setOnboardingData({
                  ...transformedData,
                  completedAt: new Date().toISOString(),
                });
              setShowExistingUserModal(true);
                setActiveMode("lightning"); // Keep on homepage
            } else {
              // Partial onboarding data - show new user modal
                console.log(
                  "🔄 Partial onboarding data, showing new user modal"
                );
              setShowOnboardingModal(true);
                setActiveMode("lightning"); // Keep on homepage
            }
          } else {
            // No onboarding data - show new user modal
              console.log("🆕 No onboarding data, showing new user modal");
            setShowOnboardingModal(true);
              setActiveMode("lightning"); // Keep on homepage
          }
        } catch (error) {
            console.error("Error checking existing user data:", error);
          // Fallback to new user modal
          setShowOnboardingModal(true);
            setActiveMode("lightning"); // Keep on homepage
        }
      };
      
      checkExistingUser();
    }
  }
}, [
  isAuthenticated,
  isAuthLoading, // Add this dependency
  currentChatId,
  urlChatId,
  recentPrompt,
  isOnboardingMode,
  isOnboardingChat,
    // Remove isProcessing dependency
]);

  // Function to preserve current chat before login
  const preserveCurrentChatBeforeLogin = () => {
    if (!isAuthenticated && currentChatId) {
      const currentSession = chatSessions.find(session => session.id === currentChatId);
      if (currentSession && currentSession.messages.length > 0) {
        const chatToPreserve = {
          id: currentSession.id,
          title: currentSession.title,
          messages: currentSession.messages.filter(msg => 
            !msg.content.includes('Query limit reached') && 
            !msg.content.includes('Sign up for unlimited access')
          ),
          createdAt: currentSession.createdAt
        };
        
        console.log('🔄 PRESERVING CHAT BEFORE LOGIN:', {
          chatId: chatToPreserve.id,
          title: chatToPreserve.title,
          messageCount: chatToPreserve.messages.length
        });
        
        localStorage.setItem('salescentri_preserved_chat', JSON.stringify(chatToPreserve));
      }
    }
  };

  // Function to recreate preserved chat as authenticated user
  const recreatePreservedChat = async (): Promise<string | null> => {
    try {
      const preservedChatData = localStorage.getItem('salescentri_preserved_chat');
      if (!preservedChatData) {
        console.error('❌ No preserved chat data found');
        return null;
      }

      const chatData = JSON.parse(preservedChatData);
      console.log('🔄 RECREATING PRESERVED CHAT:', {
        originalId: chatData.id,
        title: chatData.title,
        messageCount: chatData.messages.length,
        isAuthenticated
      });

      // Create new authenticated chat with retry logic
      let newChatId: string | null = null;
      let attempts = 0;
      const maxAttempts = 2;
      
      while (!newChatId && attempts < maxAttempts) {
        attempts++;
        console.log(`📝 Attempt ${attempts} to create authenticated chat`);
        
        try {
          newChatId = await createNewChat(chatData.title);
          if (newChatId) {
            console.log('✅ Authenticated chat created successfully:', newChatId);
            break;
          }
        } catch (error) {
          console.warn(`⚠️ Attempt ${attempts} failed:`, error);
          if (attempts < maxAttempts) {
            // Wait briefly before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }

      if (!newChatId) {
        console.error('❌ Failed to create new chat for preservation after all attempts');
        return null;
      }

      // Transfer messages from preserved chat with proper filtering
      let messagesToTransfer = chatData.messages.filter((msg: ChatMessage) => 
        !msg.content.includes('Query limit reached') && 
        !msg.content.includes('Sign up for unlimited access')
      );

      // Limit to query limit for anonymous users (3 complete conversations = 6 messages max)
      // Count user messages to determine how many conversations we should preserve
      const userMessages = messagesToTransfer.filter((msg: ChatMessage) => msg.role === 'user');
      const maxUserMessages = 3; // Anonymous query limit
      
      if (userMessages.length > maxUserMessages) {
        // Keep only the first 3 user messages and their corresponding AI responses
        let keptUserMessages = 0;
        messagesToTransfer = messagesToTransfer.filter((msg: ChatMessage) => {
          if (msg.role === 'user') {
            keptUserMessages++;
            return keptUserMessages <= maxUserMessages;
          } else {
            // Keep AI responses only if we haven't exceeded the user message limit
            return keptUserMessages <= maxUserMessages;
          }
        });
      }

      console.log(`📝 Original messages:`, chatData.messages.length);
      console.log(`📝 Messages after limit filter:`, messagesToTransfer.length);
      console.log(`📝 User messages kept:`, messagesToTransfer.filter((m: ChatMessage) => m.role === 'user').length);
      console.log(`📝 First few messages:`, messagesToTransfer.slice(0, 3).map((m: ChatMessage) => ({ role: m.role, content: m.content.substring(0, 100) })));

      // Add all messages to the new chat with error handling
      let successfulTransfers = 0;
      for (const message of messagesToTransfer) {
        try {
          const result = await chatApi.addMessage(newChatId, {
            role: message.role,
            content: message.content
          });
          
          if (result) {
            successfulTransfers++;
          } else {
            console.warn('⚠️ Message transfer returned null:', message.role);
          }
        } catch (error) {
          console.error('❌ Failed to transfer message:', error, { 
            role: message.role, 
            contentPreview: message.content.substring(0, 50) 
          });
        }
      }

      console.log(`📊 Message transfer summary: ${successfulTransfers}/${messagesToTransfer.length} successful`);

      // Update local chat sessions regardless of API transfer success
      const newChatSession: ChatSession = {
        id: newChatId,
        title: chatData.title,
        messages: messagesToTransfer,
        createdAt: Date.now()
      };

      // Add the new chat session to both state and ref immediately
      setDeduplicatedChatSessions(prev => [newChatSession, ...prev]);
      
      // Also update the ref immediately for faster access
      chatSessionsRef.current = [newChatSession, ...chatSessionsRef.current];

      console.log('💾 Updated local chat sessions with recreated chat');

      // Clean up preserved chat data
      localStorage.removeItem('salescentri_preserved_chat');

      console.log('✅ CHAT RECREATION COMPLETED:', {
        newChatId,
        originalMessageCount: chatData.messages.length,
        transferredMessageCount: messagesToTransfer.length,
        successfulTransfers,
        localMessagesCount: newChatSession.messages.length
      });

      return newChatId;

    } catch (error) {
      console.error('❌ Error recreating preserved chat:', error);
      // Clean up on error
      localStorage.removeItem('salescentri_preserved_chat');
      return null;
    }
  };

  // Handle onboarding completion and start analysis
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type OnboardingStateUnknown = Record<string, unknown>;
  const handleOnboardingComplete = async (
    onboardingStateData: OnboardingStateUnknown
  ) => {
    console.log(
      "🎯 handleOnboardingComplete called with data:",
      onboardingStateData
    );
    console.log("🎯 Current state check:", {
      activeMode,
      isOnboardingMode,
      isOnboardingChat,
      currentChatId,
    });
    
    try {
      // Convert the backend state data to the frontend format
      const convertedData = convertOnboardingData(
        onboardingStateData as unknown as Record<string, unknown>
      );
      
      // Update local onboarding data to reflect completion
      const completedData: OnboardingData = {
        ...convertedData,
        userId: !isAuthenticated
          ? getUserId()
          : String(userProfile?.user?.id || ""),
        currentStep: "completed",
        completedAt: new Date().toISOString(),
      };

      console.log("🔄 Converted onboarding data:", completedData);
      
      // Create a chat FIRST, before changing any modes
      console.log("Creating new chat for analysis...");
      const chatTitle = getCompanyWebsiteTitle(completedData);
      const chatId = await createNewChat(chatTitle);
      if (!chatId) {
        console.error("Failed to create chat for analysis");
        return;
      }
      
      console.log("Chat created successfully:", chatId);
      
      // Set all state in one batch to avoid flash - this is critical!
      setOnboardingData(completedData);
      setIsFirstUserInteraction(false);
      setCurrentChatId(chatId);
      setIsOnboardingMode(false);
      setIsOnboardingChat(false);
      setShowOnboardingCompletion(false);
      setActiveMode("focus");
      setRecentPrompt("Starting your personalized analysis...");
      setShowHyperspeed(false);
      setHasPrompted(true);
      setShowOnboardingModal(false);
      setShowExistingUserModal(false);
      setIsProcessing(true); // Set processing to prevent homepage flashing
      
      // Create chat session object for sidebar
      const newChat: ChatSession = {
        id: chatId,
        title: chatTitle,
        messages: [],
        createdAt: Date.now(),
      };
      setChatSessions((prev) => [newChat, ...prev]);
      
      // Store analysis data for post-navigation execution
      localStorage.setItem(
        "pendingAnalysis",
        JSON.stringify({
        chatId,
        onboardingData: completedData,
          timestamp: Date.now(),
        })
      );
      
      // Clear any stale lightning mode handoff
      localStorage.removeItem('lightningModeData');

      // Navigate to the chat immediately - this will trigger checkForPendingAnalysis
      console.log("🚀 Navigating to chat after onboarding completion...");
      router.push(`/solutions/psa-suite-one-stop-solution/c/${chatId}`);
    } catch (error) {
      console.error("Error in handleOnboardingComplete:", error);
    }
  };

  // Check for pending analysis after navigation
  const checkForPendingAnalysis = useCallback(async (chatId: string) => {
    try {
      const pendingAnalysisStr = localStorage.getItem("pendingAnalysis");
      if (!pendingAnalysisStr) return;
      
      const pendingAnalysis = JSON.parse(pendingAnalysisStr);
      console.log("🔍 Found pending analysis:", pendingAnalysis);
      
      // Check if this is the correct chat and analysis is recent (within 10 seconds)
      if (
        pendingAnalysis.chatId === chatId &&
        Date.now() - pendingAnalysis.timestamp < 10000
      ) {
        console.log("🚀 STEP 9: Executing pending analysis in chat...");
        
        // Clear the pending analysis
        localStorage.removeItem("pendingAnalysis");
        
        // Set up UI for analysis
        setRecentPrompt("Generating your personalized analysis...");
        setIsProcessing(false); // Clear processing state from button
        
        // Start the analysis
        await triggerOnboardingAnalysis(
          pendingAnalysis.onboardingData as OnboardingData,
          chatId
        );
        
        console.log("✅ STEP 10: Analysis execution complete!");
      } else {
        console.log("⚠️ Pending analysis expired or wrong chat, clearing...");
        localStorage.removeItem("pendingAnalysis");
      }
    } catch (error) {
      console.error("❌ Error checking pending analysis:", error);
      localStorage.removeItem("pendingAnalysis");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Trigger onboarding analysis when user manually starts it
  const triggerOnboardingAnalysis = async (
    onboardingData: OnboardingData,
    forceChatId?: string
  ) => {
    console.log("🎯 triggerOnboardingAnalysis started");
    
    // PREVENT DUPLICATE CALLS - Check if analysis is already running
    if (isProcessing) {
      console.log("⚠️ Analysis already in progress, skipping duplicate call");
      return;
    }
    
    // PREVENT DUPLICATE ICP QUESTIONS - Check if already sent
    if (icpQuestionSent) {
      console.log("⚠️ ICP question already sent, skipping duplicate");
      return;
    }
    
    // Set processing flag immediately to prevent duplicate calls
    setIsProcessing(true);
    setIcpQuestionSent(false); // Reset ICP flag for new analysis
    setLeadGenMessageSent(false); // Reset lead gen flag for new analysis
    
    try {
      // Use provided chatId or current chatId or create new
      let chatId = forceChatId || currentChatId;
      if (!chatId) {
        console.log("Creating new backend chat for analysis");
        const newChatId = await createNewChat();
        if (!newChatId) {
          console.error("Failed to create chat for analysis");
          return;
        }
        chatId = newChatId;
        setCurrentChatId(chatId);
      }
      
      console.log("Backend chat ready, starting analysis with chatId:", chatId);
      
      // Ensure we stay in focus mode with proper UI state
      setActiveMode("focus");
      setIsOnboardingMode(false);
      setIsOnboardingChat(false);
      setHasPrompted(true);
      setRecentPrompt("Generating your personalized analysis..."); // Keep recentPrompt active
      setIsProcessing(false); // Clear processing flag when we start showing messages
      
      // Message 1: Welcome and Profile Summary
      const welcomeMsg = createWelcomeMessage({
        userRole: onboardingData.userRole,
        salesObjective: onboardingData.salesObjective,
        immediateGoal: onboardingData.immediateGoal,
        companyWebsite: onboardingData.companyWebsite,
        marketFocus: onboardingData.marketFocus,
        companyInfo: onboardingData.companyInfo,
        // Prefer array-based industries
        targetIndustries: (onboardingData as any).target_industries || (onboardingData as any).targetIndustries,
        targetRegion: onboardingData.targetRegion,
        targetLocation: onboardingData.targetLocation,
        targetTitles: onboardingData.targetTitles as string[] | undefined,
        hasTargetList: onboardingData.hasTargetList as boolean | undefined,
        budget: onboardingData.budget,
      });
      await sendTypedMessage(chatId, welcomeMsg);
      
      // Message 2: Company Analysis (if website provided)
      if (onboardingData.companyWebsite) {
        console.log(
          "Performing company research for:",
          onboardingData.companyWebsite
        );
        
        // Show web search progress BEFORE thinking/analysis (not during typing)
        setIsWebSearchActive(true);
        webSearchProgress.startProgress(
          `Analyzing ${onboardingData.companyWebsite} company information`
        );
        
        const companyAnalysisMsg = await analyzeUserCompany(
          onboardingData.companyWebsite
        );
        
        // Hide web search progress BEFORE typing
        setIsWebSearchActive(false);
        webSearchProgress.completeProgress();
        
        await sendTypedMessage(chatId, companyAnalysisMsg);
      }
      
      // Message 3: ICP Question with Options (only send once)
      if (!icpQuestionSent) {
        const icpQuestionMsg = createICPQuestionMessage();
        console.log("🔍 ICP QUESTION MESSAGE:", icpQuestionMsg);
        console.log("🔍 CONTAINS BUTTONS:", icpQuestionMsg.includes("<button"));
        await sendTypedMessage(chatId, icpQuestionMsg, 3000); // 3 second delay
        setIcpQuestionSent(true); // Mark as sent to prevent duplicates
        console.log("✅ ICP question sent, preventing duplicates");
      } else {
        console.log("⚠️ ICP question already sent, skipping duplicate");
      }
      
      // After analysis completes, maintain the chat state
      console.log("Analysis completed, maintaining focus mode chat state");
    } catch (error) {
      console.error("Error in analysis:", error);
      
      // Fallback message if something goes wrong
      const fallbackMsg = createFallbackMessage();
      
      // Ensure we have a chat to send the fallback to
      if (currentChatId) {
        await sendTypedMessage(currentChatId, fallbackMsg);
      }
    } finally {
      console.log("Analysis completed");
      setIsProcessing(false);
      setProcessingChatId(null); // Clear processing chat ID when done
      // DON'T clear recentPrompt here - keep the chat UI active
    }
  };

  // Helper function to send typed messages with delays and loading animation
  const sendTypedMessage = useCallback(
    async (chatId: string, content: string, delay: number = 0) => {
    if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      console.log("🔍 SEND MESSAGE - Original content:", content);
      console.log(
        "🔍 SEND MESSAGE - Contains buttons:",
        content.includes("<button")
      );
    
    const formatted = formatAIText(content);
    
      console.log("🔍 SEND MESSAGE - Formatted content:", formatted);
      console.log(
        "🔍 SEND MESSAGE - Formatted contains buttons:",
        formatted.includes("<button")
      );
    
    // Add the AI message to chat (force new message for focus mode)
    await addAIMessage(chatId, formatted, true);
    
    // NO TYPING EFFECT - Display all content at once (including buttons)
    setResult(formatted);
    setDisplayedResult(formatted);
    setIsProcessing(false);
    setProcessingChatId(null);
    
    // Force scroll to new message
    setTimeout(() => {
      scrollToBottom(true);
    }, 50);
    },
    [scrollToBottom, addAIMessage, setResult, setDisplayedResult, setIsProcessing, setProcessingChatId]
  );
// Added 'typeText' to dependency array to fix warning

  // Analyze user's company (not competitors)
  const analyzeUserCompany = async (website: string): Promise<string> => {
    try {
      const researchQuery = createCompanyAnalysisPrompt(website);
      
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: researchQuery,
          chatHistory: [],
          useLangchain: true,
          enableWebSearch: true,
          enableRAG: true,
          useGrounding: true,
          groundingParams: {
            useGoogleSearch: true,
          },
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const researchResponse = data.result;
        
        if (researchResponse) {
          // Format the response to add italics for additional information
          let formattedResponse = researchResponse;
          
          // Look for additional information patterns and make them italic
          formattedResponse = formattedResponse.replace(
            /(Additional information that would be helpful includes[^.]*\.)/gi, 
            "*$1*"
          );
          formattedResponse = formattedResponse.replace(
            /(It would be helpful to know more about[^.]*\.)/gi, 
            "*$1*"
          );
          formattedResponse = formattedResponse.replace(
            /(Further details about[^.]*\.)/gi, 
            "*$1*"
          );
          
          // STORE COMPANY ANALYSIS FOR LEAD GENERATION
          // Extract key insights about what the company does
          const companyAnalysis = {
            website: website,
            analysis: researchResponse,
            businessModel: extractBusinessModel(researchResponse),
            targetMarket: extractTargetMarket(researchResponse),
            services: extractServices(researchResponse),
            timestamp: new Date().toISOString(),
          };
          
          // Store in localStorage for lead generation to use
          localStorage.setItem(
            "companyAnalysis",
            JSON.stringify(companyAnalysis)
          );
          console.log("💾 STORED COMPANY ANALYSIS:", companyAnalysis);
          
          return ` Your Company Analysis 🏢
Based on my analysis of **${website}**, here's what I understand about your business:
${formattedResponse}
*Strategic Recommendations: This analysis will help us identify the perfect prospects who would benefit most from your solutions.*`;
        }
      }
    } catch (error) {
      console.error("Error in company research:", error);
    }
    
    // Fallback if research fails
    return createCompanyAnalysisFallback(website);
  };

  // Helper functions to extract key insights from company analysis
  const extractBusinessModel = (analysis: string): string => {
    const businessModelMatch = analysis.match(
      /(?:business model|value proposition|offers|provides|sells|delivers)[^.]*?\./gi
    );
    return businessModelMatch ? businessModelMatch[0] : "business services";
  };

  const extractTargetMarket = (analysis: string): string => {
    const targetMatch = analysis.match(
      /(?:target market|customer base|serves|clients|customers)[^.]*?\./gi
    );
    return targetMatch ? targetMatch[0] : "businesses";
  };

  const extractServices = (analysis: string): string[] => {
    const serviceMatches = analysis.match(
      /(?:services|products|solutions|offerings|platforms|tools)[^.]*?\./gi
    );
    return serviceMatches || ["business solutions"];
  };

  // ✅ NEW: Helper function to get website URL from any onboarding data format
  interface MinimalOnboardingLike {
    website_url?: unknown;
    companyWebsite?: unknown;
    company_website?: unknown;
  }
  const getWebsiteFromOnboarding = (data: MinimalOnboardingLike): string => {
    // Handle different possible field names and formats
    const websiteCandidate = (data?.website_url ??
      data?.companyWebsite ??
      data?.company_website) as unknown;
    const website =
      typeof websiteCandidate === "string" ? websiteCandidate : "";
    console.log("🌐 EXTRACTING WEBSITE:", {
      website_url: data.website_url,
      companyWebsite: data.companyWebsite,
      company_website: data.company_website,
      final: website,
      dataType: typeof data,
      hasData: !!data,
    });
    return String(website || "your-company.com");
  };

  // NEW: Extract company analysis from chat history
  type ExtractedCompanyAnalysis = {
    website: string;
    analysis: string;
    businessModel: string[] | string;
    targetMarket: string[] | string;
    services: string[];
    timestamp: string;
    source: "chat_history";
  };
  const extractCompanyAnalysisFromChat = (
    chatHistory: ChatMessage[]
  ): ExtractedCompanyAnalysis | null => {
    console.log("🔍 Extracting company analysis from chat history...");
    
    // Look for company analysis messages
    const companyAnalysisMessage = chatHistory.find(
      (msg) =>
        msg.role === "assistant" &&
        msg.content.includes("Your Company Analysis 🏢")
    );
    
    if (companyAnalysisMessage) {
      console.log("✅ Found company analysis in chat history");
      
      // Extract the analysis content
      const content = companyAnalysisMessage.content;
      const website =
        content.match(/Based on my analysis of \*\*([^*]+)\*\*/)?.[1] || "";
      
      return {
        website: website,
        analysis: content,
        businessModel: extractBusinessModel(content),
        targetMarket: extractTargetMarket(content),
        services: extractServices(content),
        timestamp: new Date().toISOString(),
        source: "chat_history",
      };
    }
    
    console.log("⚠️ No company analysis found in chat history");
    return null;
  };

  // NEW: Extract ICP data from chat history
  type ExtractedICP = {
    companySize: string;
    industry: string;
    revenue: string;
    location: string;
    painPoints: string;
    fullContent: string;
    timestamp: string;
    source: "chat_history";
  };
  const extractICPFromChat = (
    chatHistory: ChatMessage[]
  ): ExtractedICP | null => {
    console.log("🔍 Extracting ICP from chat history...");
    
    // Look for ICP creation messages
    const icpMessage = chatHistory.find(
      (msg) =>
        msg.role === "assistant" &&
        (msg.content.includes("Your Ideal Customer Profile") ||
          msg.content.includes("Ideal Customer Profile (ICP)"))
    );
    
    if (icpMessage) {
      console.log("✅ Found ICP in chat history");
      
      const content = icpMessage.content;
      
      // Extract key ICP components using regex
      const companySize =
        content.match(/(?:Company Size|Employee Range)[:\s]*([^\n]+)/i)?.[1] ||
        "";
      const industry =
        content.match(/(?:Industry|Sector)[:\s]*([^\n]+)/i)?.[1] || "";
      const revenue =
        content.match(/(?:Revenue|Budget)[:\s]*([^\n]+)/i)?.[1] || "";
      const location =
        content.match(/(?:Location|Geography|Region)[:\s]*([^\n]+)/i)?.[1] ||
        "";
      const painPoints =
        content.match(/(?:Pain Points|Challenges)[:\s]*([^\n]+)/i)?.[1] || "";
      
      return {
        companySize,
        industry,
        revenue,
        location,
        painPoints,
        fullContent: content,
        timestamp: new Date().toISOString(),
        source: "chat_history",
      };
    }
    
    console.log("⚠️ No ICP found in chat history");
    return null;
  };

  // NEW: Create comprehensive context for lead generation from chat history
  const createLeadGenContextFromChat = (
    chatHistory: ChatMessage[],
    onboardingData: OnboardingData
  ): {
    companyAnalysis: ExtractedCompanyAnalysis | null;
    icpData: ExtractedICP | null;
    onboardingData: OnboardingData;
    chatHistory: ChatMessage[];
    timestamp: string;
  } => {
    console.log("🎯 Creating lead generation context from chat history...");
    
    const companyAnalysis = extractCompanyAnalysisFromChat(chatHistory);
    const icpData = extractICPFromChat(chatHistory);
    
    return {
      companyAnalysis,
      icpData,
      onboardingData,
      chatHistory: chatHistory.slice(-10), // Last 10 messages for context
      timestamp: new Date().toISOString(),
    };
  };

  // Lead generation questions data
  const leadGenQuestionsData = useMemo(
    () => [
    {
      question: "What industry or sector is your company operating in?",
      options: [
        "CRM & Sales Tools",
        "Marketing Automation", 
        "Sales Enablement",
        "HR Tech",
        "FinTech",
        "E-commerce",
        "SaaS/Software",
        "Healthcare Tech",
          "Other",
      ],
        key: "industry",
    },
    {
      question: "Are you looking for competitors based on:",
      options: [
        "Similar product offerings",
        "Target markets", 
        "Both product offerings and target markets",
        "Business model similarity",
          "Technology stack",
      ],
        key: "competitorBasis",
    },
    {
      question: "Geographic focus for your research:",
      options: [
        "Global companies",
        "North America only",
        "Europe only", 
        "Asia-Pacific",
          "Specific country/region",
      ],
        key: "region",
    },
    {
      question: "For competitor clients, should we focus on:",
      options: [
        "Notable/key clients only",
        "As many publicly available as possible",
        "Enterprise clients (>1000 employees)",
        "Mid-market clients (100-1000 employees)", 
          "All client types",
        ],
        key: "clientType",
      },
    ],
    []
  );

  // Generate comprehensive leads based on all answers
  const generateComprehensiveLeads = useCallback(async () => {
    try {
      // Prefer the local in-memory onboarding that powers the Focus Mode summary
      let local = onboardingData;
      const hasLocal = local && (local.salesObjective || local.companyInfo?.industry || local.targetRegion);
      let convertedData = local as OnboardingData;
      if (!hasLocal) {
        const onboardingRaw = await chatApi.getOnboardingData();
        if (!onboardingRaw) return;
        convertedData = convertOnboardingData(
          onboardingRaw as unknown as Record<string, unknown>
        );
      }
      // Ensure industry reflects the user's selected industries before fallbacks
      const selectedIndustries = (convertedData as any).target_industries || (convertedData as any).targetIndustries;
      if ((!convertedData.companyInfo?.industry || convertedData.companyInfo.industry === 'Technology/IT') && Array.isArray(selectedIndustries) && selectedIndustries.length > 0) {
        convertedData = {
          ...convertedData,
          companyInfo: {
            ...(convertedData.companyInfo || { revenueSize: '', employeeSize: '' } as any),
            industry: String(selectedIndustries[0])
          }
        } as OnboardingData;
      }
      // Merge onboarding targeting into lead params so multi-industry is respected
      const fullLeadParams = {
        ...leadGenQuestions,
        marketFocus: convertedData.marketFocus,
        targetDepartments: convertedData.targetTitles,
        targetRevenueSize: convertedData.companyInfo?.revenueSize,
        targetEmployeeSize: convertedData.targetEmployeeSize,
        targetLocation: convertedData.targetLocation,
        targetIndustries: (convertedData as any).target_industries || (convertedData as any).targetIndustries,
        companyRole: convertedData.userRole,
        shortTermGoal: convertedData.immediateGoal,
        budget: convertedData.budget,
      } as any;

      // Immediately send the tabular leads prompt to backend for lead gen
      const leadsResult = await generateTabularLeads(
        convertedData,
        fullLeadParams
      );
      await sendTypedMessage(currentChatId!, leadsResult);
    } catch (error) {
      console.error(
        "Error loading onboarding data for lead generation:",
        error
      );
    }
  }, [
    leadGenQuestions,
    sendTypedMessage,
    currentChatId,
    convertOnboardingData,
  ]);

  // Ask the next question in the lead generation flow
  const askNextLeadGenQuestion = useCallback(
    async (stepIndex: number) => {
    if (stepIndex >= leadGenQuestionsData.length) {
      // All questions answered, generate leads
      await generateComprehensiveLeads();
      return;
    }
    
    const currentQuestion = leadGenQuestionsData[stepIndex];
      const questionMessage = createLeadGenQuestionPrompt(
        stepIndex,
        leadGenQuestionsData.length,
        currentQuestion
      );
    
    await sendTypedMessage(currentChatId!, questionMessage);
    },
    [
      sendTypedMessage,
      currentChatId,
      generateComprehensiveLeads,
      leadGenQuestionsData,
    ]
  );

  // Generate leads using existing onboarding data and chat history
  const generateLeadsWithChatHistory = useCallback(
    async (
      onboardingData: Record<string, unknown>,
      chatHistory: ChatMessage[]
    ): Promise<string> => {
      try {
        console.log(
          "🔍 Generating leads with chat history and onboarding data..."
        );
      
      // NEW: Extract context from chat history first (this is the key fix!)
      // Check if onboardingData is already converted or needs conversion
      const isAlreadyConverted = onboardingData.companyWebsite !== undefined;
        const convertedOnboardingData: OnboardingData = isAlreadyConverted
          ? (onboardingData as OnboardingData)
          : {
              userId: "chat_user",
              currentStep: "completed",
              salesObjective: String(onboardingData.sales_objective || ""),
              userRole: String(onboardingData.company_role || ""),
              immediateGoal: String(onboardingData.short_term_goal || ""),
        companyWebsite: getWebsiteFromOnboarding(onboardingData), // ✅ CORRECT: using helper function
              marketFocus:
                (onboardingData.gtm as "B2B" | "B2C" | "B2G") || "B2B",
              targetRegion: String(onboardingData.target_region || ""),
              targetTitles:
                (onboardingData.target_departments as string[]) || [],
            };

        console.log("🔍 CONVERTED ONBOARDING DATA:", {
        isAlreadyConverted,
        companyWebsite: convertedOnboardingData.companyWebsite,
          salesObjective: convertedOnboardingData.salesObjective,
      });
      
      // Extract comprehensive context from chat history
        const chatContext = createLeadGenContextFromChat(
          chatHistory,
          convertedOnboardingData
        );
      
        console.log("💬 CHAT CONTEXT EXTRACTED:", {
        hasCompanyAnalysis: !!chatContext.companyAnalysis,
        hasICP: !!chatContext.icpData,
          chatHistoryLength: chatContext.chatHistory.length,
      });
      
      // Build lead generation context prioritizing chat history data
        const inferredIndustry = String(
          convertedOnboardingData.companyInfo?.industry || "Technology"
        );
      const leadGenContext = {
        industry: chatContext.icpData?.industry || inferredIndustry,
          competitorBasis:
            convertedOnboardingData.marketFocus === "B2B"
              ? "Similar B2B companies"
              : "Market leaders",
          // Prefer ICP/summary region if present; fallback to onboarding targetRegion
          region: String(
            (chatContext.icpData?.location as string) ||
              convertedOnboardingData.targetRegion ||
              "North America"
          ),
          clientType:
            chatContext.icpData?.companySize ||
            (convertedOnboardingData.companyInfo?.revenueSize &&
            typeof convertedOnboardingData.companyInfo.revenueSize ===
              "string" &&
            convertedOnboardingData.companyInfo.revenueSize.includes("50M")
              ? "Enterprise"
              : "SMB"),
          marketFocus: String(convertedOnboardingData.marketFocus || ""),
        targetDepartments: convertedOnboardingData.targetTitles || undefined,
          targetRevenueSize:
            chatContext.icpData?.revenue ||
            String(convertedOnboardingData.companyInfo?.revenueSize || ""),
          targetEmployeeSize:
            chatContext.icpData?.companySize ||
            String(convertedOnboardingData.targetEmployeeSize || ""),
          // Location may use ICP extraction; keep separate from region
          targetLocation:
            chatContext.icpData?.location ||
            String(convertedOnboardingData.targetLocation || ""),
          // Use only array-based target industries
          targetIndustries: (convertedOnboardingData as any).target_industries || (convertedOnboardingData as any).targetIndustries,
          companyRole: String(convertedOnboardingData.userRole || ""),
          shortTermGoal: String(convertedOnboardingData.immediateGoal || ""),
        budget: undefined,
      };
      
      console.log('🎯 LEAD GEN CONTEXT CREATED:', {
        industry: leadGenContext.industry,
        targetIndustries: leadGenContext.targetIndustries,
        region: leadGenContext.region,
        source: 'generateLeadsWithChatHistory'
      });
      
      // ✅ CRITICAL FIX: Use actual website from onboarding (following companyAnalysisPrompts.ts pattern)
      const website =
        chatContext.companyAnalysis?.website ||
        convertedOnboardingData.companyWebsite ||
        getWebsiteFromOnboarding(onboardingData);
        console.log("🌐 USING WEBSITE FROM ONBOARDING:", website);
        console.log("📊 CONVERTED ONBOARDING DATA:", {
        companyWebsite: convertedOnboardingData.companyWebsite,
        salesObjective: convertedOnboardingData.salesObjective,
        userRole: convertedOnboardingData.userRole,
        targetRegion: convertedOnboardingData.targetRegion,
          fullData: convertedOnboardingData,
      });
      
      const tabularPrompt = createTabularLeadsPrompt(website, leadGenContext);
      
        console.log(
          "📊 Using createTabularLeadsPrompt for proper table format in chat history flow"
        );
      
      // Create context from chat history for better personalization
      const recentChatContext = chatHistory
        .slice(-10) // Get last 10 messages for context
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n");
      
      const enhancedPrompt = `${tabularPrompt}

**Business Context from Conversation:**
${recentChatContext}

**Onboarding Details:**
- Sales Objective: ${convertedOnboardingData.salesObjective || "Generate qualified leads"}
- Company Role: ${convertedOnboardingData.userRole || "Not specified"}
- Target Market: ${convertedOnboardingData.marketFocus || "B2B"}
- Company Industry: ${convertedOnboardingData.companyInfo?.industry || "Technology"}
- Company Size: ${convertedOnboardingData.companyInfo?.employeeSize || "Not specified"}
- Target Region: ${convertedOnboardingData.targetRegion || "Global"}

Use this context to provide highly targeted and relevant lead suggestions.`;

      // ✅ CRITICAL FIX: Construct userProfile and companyAnalysis like generateTabularLeads does
      const userProfile = {
        user: {
          id: 0,
            email: "",
          organization_id: 0,
            role: convertedOnboardingData.userRole || "",
            job_title: convertedOnboardingData.userRole || "",
            linkedin_profile: "",
            last_login_at: "",
            auth_provider: "",
            created_at: "",
        },
        organization: {
          id: 0,
            name: website || "Unknown",
          website: website, // ✅ Use the extracted website
        // ✅ Use first of target_industries if available, then companyInfo.industry
        industry: ((convertedOnboardingData as any).target_industries && (convertedOnboardingData as any).target_industries[0]) || 
                 ((convertedOnboardingData as any).targetIndustries && (convertedOnboardingData as any).targetIndustries[0]) || 
                 convertedOnboardingData.companyInfo?.industry || 
                     "",
            description: "",
            linkedin_page: "",
            created_at: "",
          },
      };

      // Use the company analysis from chat context, fallback to localStorage
      let companyAnalysis = chatContext.companyAnalysis;
      try {
          const storedAnalysis = localStorage.getItem("companyAnalysis");
        if (storedAnalysis) {
          companyAnalysis = JSON.parse(storedAnalysis);
            console.log(
              "💾 INCLUDING COMPANY ANALYSIS IN CHAT HISTORY API CALL:",
              companyAnalysis
            );
        }
      } catch {
          console.log("⚠️ No company analysis found for chat history API call");
      }

        console.log("🔍 CHAT HISTORY - SENDING TO API:", {
        userProfileWebsite: userProfile?.organization?.website,
        companyAnalysisWebsite: companyAnalysis?.website,
          queryLength: enhancedPrompt.length,
        });

        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: enhancedPrompt,
          chatHistory: [],
          useLangchain: true,
          enableWebSearch: true,
          enableRAG: true,
          userProfile, // ✅ Pass userProfile for targeted searches
            companyAnalysis, // ✅ Pass company analysis for context
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
          console.log("✅ Chat history lead generation API response received");
        return createLeadsResultMessage(data.result);
      } else {
          console.error("API response error:", response.status);
        throw new Error(`API response error: ${response.status}`);
      }
    } catch (error) {
        console.error("Error generating leads with chat history:", error);
      return createLeadsGenerationFallback();
    }
    },
    [createLeadGenContextFromChat, getWebsiteFromOnboarding]
  );

  // Start lead generation question flow
  const startLeadGenQuestions = useCallback(async () => {
    if (leadGenStartedRef.current) {
      console.warn(
        "⚠️ Lead generation already started; ignoring duplicate trigger"
      );
      return;
    }
    leadGenStartedRef.current = true;
    console.log(
      "🎯 Starting Lead Generation - Always using direct table generation"
    );
    
    try {
      // Prefer local summary onboarding; fall back to backend if missing
      let backendDataAny: Record<string, unknown> | null = null;
      const localAny = onboardingData as unknown as Record<string, unknown> | null;
      if (localAny && Object.keys(localAny).length > 0 && (localAny as any).salesObjective) {
        backendDataAny = localAny;
      } else {
        backendDataAny = (await chatApi.getOnboardingData()) as unknown as Record<string, unknown> | null;
      }
      const currentChat = chatSessions.find(
        (chat) => chat.id === currentChatId
      );
      const chatHistory = currentChat?.messages || [];
      
      console.log("📊 Onboarding data available:", !!backendDataAny);
      console.log("💬 Chat history length:", chatHistory.length);
      console.log("🔍 BACKEND DATA STRUCTURE:", backendDataAny);
      
      // Send message indicating we're generating leads
      const statusMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: `🎯 <strong>Generating Your Prospect List</strong>
<br/>I'll use your onboarding information and our conversation history to create a targeted lead list for you. <br/>This includes your sales objectives, target market, and business context we've already discussed.
<br/>Let me search for qualified prospects. <br/><strong>This may take a 30-60 seconds...</strong>`,
        timestamp: Date.now(),
      };
      
      setChatSessions((prev) =>
        prev.map((chat) =>
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, statusMessage] } 
          : chat
        )
      );
      
      // Save status message to backend
      try {
        await chatApi.addMessage(currentChatId!, {
          role: "assistant",
          content: statusMessage.content,
        });
        console.log("✅ Status message saved to backend");
      } catch (error) {
        console.error("❌ Failed to save status message to backend:", error);
      }
      
      // Always generate leads directly using available data and chat history
      let convertedBackendData;
      if (backendDataAny && Object.keys(backendDataAny).length > 0) {
        console.log("✅ Using existing onboarding data for lead generation");
        console.log("🔍 BEFORE CONVERSION - backendData:", backendDataAny);
        convertedBackendData = convertOnboardingData(
          backendDataAny as unknown as Record<string, unknown>
        );
        console.log(
          "🔍 AFTER CONVERSION - convertedBackendData:",
          convertedBackendData
        );
      } else {
        console.log(
          "⚠️ No onboarding data found, using default lead generation parameters"
        );
        // Use default/fallback data for lead generation
        convertedBackendData = {
          userId: "chat_user",
          currentStep: "completed",
          salesObjective: "Sales automation and lead generation",
          userRole: "Sales Manager",
          immediateGoal: "Find new leads and prospects",
          companyWebsite: "salescentri.com", // Default to own website
          marketFocus: "B2B" as "B2B" | "B2C" | "B2G",
          targetRegion: "North America",
          targetTitles: [
            "CEO",
            "VP Sales",
            "Sales Director",
            "Marketing Director",
          ],
        };
      }

      const leadsResult = await generateLeadsWithChatHistory(
        convertedBackendData as Record<string, unknown>,
        chatHistory
      );
      
      // Send the generated leads and save to backend
      const leadsMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: leadsResult,
        timestamp: Date.now(),
      };
      
      setChatSessions((prev) =>
        prev.map((chat) =>
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, leadsMessage] } 
          : chat
        )
      );
      
      // Save leads message to backend to ensure persistence
      try {
        await chatApi.addMessage(currentChatId!, {
          role: "assistant",
          content: leadsResult,
        });
        console.log("✅ Lead generation results saved to backend");
      } catch (error) {
        console.error(
          "❌ Failed to save lead generation results to backend:",
          error
        );
      }
    } catch (error) {
      console.error("Error generating leads:", error);
      
      // Send error message to user
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: "assistant",
        content: `❌ I encountered an error while generating leads. Please try again or contact support if the issue persists.`,
        timestamp: Date.now(),
      };
      
      setChatSessions((prev) =>
        prev.map((chat) =>
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, errorMessage] } 
          : chat
        )
      );
      
      // Save error message to backend
      try {
        await chatApi.addMessage(currentChatId!, {
          role: "assistant",
          content: errorMessage.content,
        });
      } catch (saveError) {
        console.error("❌ Failed to save error message to backend:", saveError);
      }
    } finally {
      // Reset the flag so the function can be called again
      leadGenStartedRef.current = false;
    }
  }, [currentChatId, chatSessions, generateLeadsWithChatHistory]);

  // Handle lead generation question answers
  const handleLeadGenAnswer = useCallback(
    async (key: string, answer: string, nextStep: number) => {
    if (leadGenStartedRef.current && nextStep === 0) {
      // Already started; guard initial duplicate
        console.warn("⚠️ Duplicate initial lead gen answer ignored");
      return;
    }
    // Update the current step
    setCurrentLeadGenStep(nextStep);
    
    // Update the answers
      setLeadGenQuestions((prev) => ({
      ...prev,
        [key]: answer,
    }));
    
    // Send user response message
    const userResponse: ChatMessage = {
      id: `msg_${Date.now()}`,
        role: "user",
      content: `Selected: ${answer}`,
        timestamp: Date.now(),
    };
    
      setChatSessions((prev) =>
        prev.map((chat) =>
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, userResponse] } 
        : chat
        )
      );

    // Continue to next question or generate leads
    if (nextStep < leadGenQuestionsData.length) {
      askNextLeadGenQuestion(nextStep);
    } else {
      if (!leadGenMessageSentRef.current) {
        leadGenMessageSentRef.current = true;
        await generateComprehensiveLeads();
      }
    }
    },
    [
      currentChatId,
      askNextLeadGenQuestion,
      generateComprehensiveLeads,
      leadGenQuestionsData,
    ]
  );

  // Generate leads in tabular format with comprehensive data
  const generateTabularLeads = async (
    onboardingData: OnboardingData,
    leadGenAnswers: LeadGenQuestions
  ): Promise<string> => {
    try {
      // ✅ CRITICAL FIX: Use actual website from onboarding data (following companyAnalysisPrompts.ts pattern)
      const website =
        onboardingData.companyWebsite ||
        getWebsiteFromOnboarding(onboardingData);
      console.log("🌐 TABULAR LEADS - USING WEBSITE:", website);
      console.log("📊 ONBOARDING DATA WEBSITE CHECK:", {
        companyWebsite: onboardingData.companyWebsite,
        userRole: onboardingData.userRole,
        salesObjective: onboardingData.salesObjective,
        fullData: onboardingData,
      });
      
      const leadsQuery = createTabularLeadsPrompt(website, leadGenAnswers);

      // Convert onboardingData to UserProfile structure for backend
      const userProfile = {
        user: {
          id: 0, // Use 0 or a placeholder for anonymous
          email: "", // Fill if available
          organization_id: 0, // Use 0 or a placeholder
          role: onboardingData.userRole || "",
          job_title: onboardingData.userRole || "",
          linkedin_profile: "",
          last_login_at: "",
          auth_provider: "",
          created_at: "",
        },
        organization: {
          id: 0, // Use 0 or a placeholder
          name: website || "Unknown",
          website: website, // ✅ Use the extracted website
          // ✅ Use selected industries first, then single target_industry, then companyInfo.industry
          industry: ((onboardingData as any).target_industries && (onboardingData as any).target_industries[0]) ||
                   ((onboardingData as any).targetIndustries && (onboardingData as any).targetIndustries[0]) ||
                   (onboardingData as any).target_industry ||
                   (onboardingData as any).targetIndustry || 
                   onboardingData.companyInfo?.industry || 
                   "",
          description: "",
          linkedin_page: "",
          created_at: "",
        },
      };
      
      // NEW: Get company analysis from chat history instead of localStorage
      const currentChat = chatSessions.find(
        (chat) => chat.id === currentChatId
      );
      const chatHistory = currentChat?.messages || [];
      const chatContext = createLeadGenContextFromChat(
        chatHistory,
        onboardingData
      );
      
      console.log("💬 TABULAR LEADS - CHAT CONTEXT:", {
        hasCompanyAnalysis: !!chatContext.companyAnalysis,
        hasICP: !!chatContext.icpData,
        source: chatContext.companyAnalysis?.source || "none",
      });
      
      // Use chat history company analysis, fallback to localStorage if needed
      let companyAnalysis = chatContext.companyAnalysis;
      try {
        const storedAnalysis = localStorage.getItem("companyAnalysis");
        if (storedAnalysis) {
          companyAnalysis = JSON.parse(storedAnalysis);
          console.log(
            "💾 INCLUDING COMPANY ANALYSIS IN API CALL:",
            companyAnalysis
          );
        }
      } catch {
        console.log("⚠️ No company analysis found for API call");
      }

      console.log("🔍 FRONTEND - SENDING TO API:", {
        userProfileWebsite: userProfile?.organization?.website,
        companyAnalysisWebsite: companyAnalysis?.website,
        queryLength: leadsQuery.length,
      });

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: leadsQuery,
          chatHistory: [],
          useLangchain: true,
          enableWebSearch: true,
          enableRAG: true,
          userProfile, // Pass userProfile for targeted searches
          companyAnalysis, // Pass company analysis for context
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return ` Your Comprehensive Lead Research Results 🎯

${data.result || data.answer}

 Next Steps:
1. **Prioritize targets** based on company size and fit
2. **Research decision makers** on LinkedIn for warm connections  
3. **Craft personalized outreach** based on identified pain points
4. **Track competitor movements** to identify opportunities
5. **Monitor client wins/losses** for competitive intelligence

Would you like me to help you craft outreach templates for any specific companies?`;
      }
    } catch (error) {
      console.error("Error generating comprehensive leads:", error);
    }
    
    return "Lead generation results are temporarily unavailable. Please try again later.";
  };

  // Handle ICP responses
  const handleICPResponse = useCallback(
    async (response: "yes" | "no") => {
    if (icpHandlingRef.current) {
        console.warn(
          "⚠️ ICP response already in progress; ignoring duplicate click"
        );
      return;
    }
    icpHandlingRef.current = true;
    try {
      // Try multiple sources for onboarding data
      let onboardingDataToUse = onboardingData;
      
      console.log("🔍 INITIAL ONBOARDING DATA:", onboardingDataToUse);
      
      // Try to get from backend API if local data is incomplete
      if (!onboardingDataToUse || !onboardingDataToUse.salesObjective || !onboardingDataToUse.companyWebsite) {
        console.log("🔍 Local data incomplete, fetching from backend...");
        try {
          const backendData = await chatApi.getOnboardingData();
            console.log("🔍 RAW BACKEND DATA:", backendData);
          
          if (backendData) {
            // Try different data structures the backend might return
            let dataToConvert: Record<string, unknown>;
            
            if ((backendData as { onboarding?: unknown }).onboarding) {
              // Backend returns { onboarding: {...} }
              dataToConvert = (backendData as { onboarding: Record<string, unknown> }).onboarding;
              console.log("🔍 Using nested onboarding data");
            } else if ((backendData as { data?: unknown }).data) {
              // Backend returns { data: {...} }
              dataToConvert = (backendData as { data: Record<string, unknown> }).data;
              console.log("🔍 Using nested data field");
            } else {
              // Backend returns flat structure
              dataToConvert = backendData as Record<string, unknown>;
              console.log("🔍 Using flat backend data");
            }
            
              console.log("🔍 DATA TO CONVERT:", dataToConvert);
            const convertedData = convertOnboardingData(dataToConvert);
            console.log("🔍 CONVERTED DATA:", convertedData);
            
            // Only use backend data if it has more information
            if (convertedData.salesObjective || convertedData.companyWebsite) {
              onboardingDataToUse = convertedData;
              console.log("✅ Using backend onboarding data");
            }
          }
        } catch (error) {
          console.error("Failed to fetch onboarding data from backend:", error);
        }
      }
      
      // Try extracting from chat history if still incomplete
      if (!onboardingDataToUse || !onboardingDataToUse.salesObjective || !onboardingDataToUse.companyWebsite) {
        console.log("🔍 Trying to extract from current chat...");
        const currentChat = chatSessions.find(chat => chat.id === currentChatId);
        if (currentChat && currentChat.messages.length > 0) {
          // Look for company analysis or onboarding information in chat
          const analysisMessage = currentChat.messages.find(msg => 
            msg.content.includes("Your Company Analysis") || 
            msg.content.includes("Business Overview")
          );
          
          if (analysisMessage) {
            console.log("🔍 Found company analysis in chat, extracting data...");
            // Extract company website from analysis
            const websiteMatch = analysisMessage.content.match(/(?:https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            if (websiteMatch && !onboardingDataToUse.companyWebsite) {
              onboardingDataToUse = { ...onboardingDataToUse, companyWebsite: websiteMatch[1] };
              console.log("✅ Extracted website from chat:", websiteMatch[1]);
            }
          }
        }
      }
      
      // Final validation with helpful error message
      if (!onboardingDataToUse || (!onboardingDataToUse.salesObjective && !onboardingDataToUse.companyWebsite)) {
        console.error("❌ No onboarding data available for ICP response");
          console.error("onboardingDataToUse:", onboardingDataToUse);
        
        // Show user-friendly error message
        await sendTypedMessage(
          currentChatId!,
          "⚠️ I need some information about your company first. Please complete the onboarding process or provide your company details.",
          0
        );
        
        icpHandlingRef.current = false;
        return;
      }

        console.log(
          "✅ Using onboarding data for ICP response:",
          onboardingDataToUse
        );
        console.log("✅ Response type:", response);

        if (response === "no") {
      // Create ICP with Internet research
      const icpMessage = createICPCreationMessage();

      await sendTypedMessage(currentChatId!, icpMessage);
      
      // Show research animation and then create ICP
      setTimeout(async () => {
        // Show web search progress for ICP research
        setIsWebSearchActive(true);
            webSearchProgress.startProgress(
              `Researching ideal customer profile for ${onboardingDataToUse.salesObjective || "your industry"}`
            );
        
        const icpResult = await createICPWithResearch(onboardingDataToUse);
        
        // Hide web search progress before typing
        setIsWebSearchActive(false);
        webSearchProgress.completeProgress();
        await sendTypedMessage(currentChatId!, icpResult, 1000);
        
        // After ICP creation, start lead generation questions
        const nextStep = ` Ready for Comprehensive Lead Research? 🚀

Now that we have your ICP, let me ask a few strategic questions to ensure we find the most relevant prospects and competitive intelligence.

<div style="margin: 20px 0;">
  <button onclick="startLeadGenQuestions()" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); font-size: 16px; ">
    🎯 Start Prospect Research
  </button>
</div>`;
        
        await sendTypedMessage(currentChatId!, nextStep, 2000);
      }, 3000);
    } else {
      // ICP already done, start lead generation questions (only send once)
      if (!leadGenMessageSent && !leadGenMessageLockRef.current) {
        leadGenMessageLockRef.current = true;
        const leadsMessage = createLeadsGenerationMessage();
        await sendTypedMessage(currentChatId!, leadsMessage);
        setLeadGenMessageSent(true);
            console.log("✅ Lead gen message sent, preventing duplicates");
      } else {
            console.log("⚠️ Lead gen message already sent, skipping duplicate");
      }
    }
    } catch (error) {
        console.error("Error handling ICP response:", error);
    } finally {
        console.log("🔄 Resetting ICP handling lock");
      icpHandlingRef.current = false;
    }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentChatId, sendTypedMessage, onboardingData, chatSessions, convertOnboardingData, setIsWebSearchActive]
  );

  // Create ICP with research
  const createICPWithResearch = async (
    onboardingData: OnboardingData
  ): Promise<string> => {
    try {
      const icpQuery = createICPResearchPrompt({
        userRole: onboardingData.userRole,
        salesObjective: onboardingData.salesObjective,
        companyWebsite: onboardingData.companyWebsite,
        immediateGoal: onboardingData.immediateGoal,
        marketFocus: onboardingData.marketFocus,
        companyInfo: onboardingData.companyInfo,
        targetRegion: onboardingData.targetRegion,
        targetTitles: onboardingData.targetTitles,
        hasTargetList: onboardingData.hasTargetList,
        budget: onboardingData.budget,
      });

      // Use Langchain Research Agent for Focus Mode (ICP development with research)
      const authToken = typeof window !== "undefined"
        ? localStorage.getItem("salescentri_token")
        : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const response = await fetch("/api/langchain/research", {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          query: icpQuery,
          taskType: "icp-development",
          onboardingData: {
            userRole: onboardingData.userRole,
            salesObjective: onboardingData.salesObjective,
            companyWebsite: onboardingData.companyWebsite,
            immediateGoal: onboardingData.immediateGoal,
            marketFocus: onboardingData.marketFocus,
            companyInfo: onboardingData.companyInfo,
            targetRegion: onboardingData.targetRegion,
            targetTitles: onboardingData.targetTitles,
            hasTargetList: onboardingData.hasTargetList,
            budget: onboardingData.budget,
          },
          options: { enableWeb: true, enableRAG: true }
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const rawIcp: string = String(data.result || "");

        // Pretty-format ICP as markdown with bold labels and bullets when it's plain text
        const containsHtml = /<[^>]+>/.test(rawIcp);
        let formattedSection = rawIcp;
        if (!containsHtml) {
          const paragraphs = rawIcp
            .split(/\r?\n\s*\r?\n/)
            .map((p) => p.trim())
            .filter(Boolean);
          const mdBlocks = paragraphs.map((para) => {
            const lines = para
              .split(/\r?\n/)
              .map((l: string) => l.trim())
              .filter((l: string) => l.length > 0);
            const items: string[] = [];
            for (const line of lines) {
              const labelValue = line.match(/^([A-Za-z][A-Za-z0-9\s\/,&+()\-\.]+):\s*(.+)$/);
              const isSectionHeader = /:$/g.test(line) || /\(ICP\)$/i.test(line);
              if (labelValue) {
                items.push(`- **${labelValue[1]}:** ${labelValue[2]}`);
              } else if (isSectionHeader) {
                // Render section headers as bold standalone lines (no bullet)
                const headerText = line.replace(/:$/, "");
                items.push(`\n\n**${headerText}**\n`);
              } else {
                items.push(`- ${line.replace(/^[-•]\s*/, "")}`);
              }
            }
            return items.join("\n").replace(/\n{3,}/g, "\n\n");
          });
          formattedSection = mdBlocks.join("\n\n");
        }

        return ` Your Ideal Customer Profile 📊\n\n${formattedSection}\n\nPerfect! This ICP will help us target the right prospects with laser precision.`;
      }

      // If unauthorized (e.g., anon user), fall back to Gemini endpoint to avoid breaking flow
      if (response.status === 401) {
        try {
          const alt = await fetch("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              query: icpQuery, 
              chatHistory: [], 
              useLangchain: true,
              enableWebSearch: true,
              enableRAG: true
            })
          });
          if (alt.ok) {
            const data = await alt.json();
            const rawIcp: string = String(data.result || "");
            
            // Apply same formatting as authenticated response
            const containsHtml = /<[^>]+>/.test(rawIcp);
            let formattedSection = rawIcp;
            if (!containsHtml) {
              const paragraphs = rawIcp
                .split(/\r?\n\s*\r?\n/)
                .map((p) => p.trim())
                .filter(Boolean);
              const mdBlocks = paragraphs.map((para) => {
                const lines = para
                  .split(/\r?\n/)
                  .map((l: string) => l.trim())
                  .filter((l: string) => l.length > 0);
                const items: string[] = [];
                for (const line of lines) {
                  const labelValue = line.match(/^([A-Za-z][A-Za-z0-9\s\/,&+()\-\.]+):\s*(.+)$/);
                  const isSectionHeader = /:$/g.test(line) || /\(ICP\)$/i.test(line);
                  if (labelValue) {
                    items.push(`- **${labelValue[1]}:** ${labelValue[2]}`);
                  } else if (isSectionHeader) {
                    const headerText = line.replace(/:$/, "");
                    items.push(`\n\n**${headerText}**\n`);
                  } else {
                    items.push(`- ${line.replace(/^[-•]\s*/, "")}`);
                  }
                }
                return items.join("\n").replace(/\n{3,}/g, "\n\n");
              });
              formattedSection = mdBlocks.join("\n\n");
            }

            return ` Your Ideal Customer Profile 📊\n\n${formattedSection}\n\nPerfect! This ICP will help us target the right prospects with laser precision.`;
          }
        } catch (e) {
          console.error("ICP auth fallback failed:", e);
        }
      }
    } catch (error) {
      console.error("Error creating ICP:", error);
    }
    
    return icpCreationFallbackMessage();
  };

  // Generate leads with research
  const generateLeadsWithResearch = useCallback(
    async (onboardingData: OnboardingData): Promise<string> => {
    try {
        console.log(
          "🎯 Using tabular prompt for lead generation with data:",
          onboardingData
        );
      
      // Use the tabular prompt for proper table formatting
      const leadGenContext = {
          industry: onboardingData.companyInfo?.industry || "Technology",
          competitorBasis:
            onboardingData.marketFocus === "B2B"
              ? "Similar B2B companies"
              : "Market leaders",
          region: onboardingData.targetRegion || "",
          clientType: "Enterprise",
        marketFocus: onboardingData.marketFocus,
        targetDepartments: onboardingData.targetTitles,
        targetRevenueSize: onboardingData.companyInfo?.revenueSize,
        targetEmployeeSize: onboardingData.targetEmployeeSize,
        // ✅ Use only array-based industries
        targetIndustries: (onboardingData as any).target_industries || (onboardingData as any).targetIndustries,
        // remove targetIndustry single
        targetLocation: undefined,
        companyRole: onboardingData.userRole,
        shortTermGoal: onboardingData.immediateGoal,
        budget: onboardingData.budget,
      };
      
      console.log('🎯 LEAD GEN CONTEXT CREATED:', {
        industry: leadGenContext.industry,
        targetIndustries: leadGenContext.targetIndustries,
        region: leadGenContext.region,
        source: 'generateLeadsWithResearch'
      });
      
        const website = onboardingData.companyWebsite || "your company";
      const leadsQuery = createTabularLeadsPrompt(website, leadGenContext);
      
        console.log(
          "📊 Using createTabularLeadsPrompt for proper table format"
        );

      // Get company analysis for context
      let companyAnalysis = null;
      try {
          const storedAnalysis = localStorage.getItem("companyAnalysis");
        if (storedAnalysis) {
          companyAnalysis = JSON.parse(storedAnalysis);
        }
      } catch {
          console.log("⚠️ No company analysis found for lead generation");
      }

      // Convert onboardingData to UserProfile structure
      const userProfile = {
        user: {
          id: 0,
            email: "",
          organization_id: 0,
            role: onboardingData.userRole || "",
            job_title: onboardingData.userRole || "",
            linkedin_profile: "",
            last_login_at: "",
            auth_provider: "",
            created_at: "",
        },
        organization: {
          id: 0,
            name: website || "Unknown",
          website: website,
            // ✅ Use first of target_industries if available, then companyInfo.industry
            industry: ((onboardingData as any).target_industries && (onboardingData as any).target_industries[0]) || 
                     ((onboardingData as any).targetIndustries && (onboardingData as any).targetIndustries[0]) || 
                     onboardingData.companyInfo?.industry || 
                     "",
            description: "",
            linkedin_page: "",
            created_at: "",
          },
        };

        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          query: leadsQuery,
          chatHistory: [],
          useLangchain: true,
          enableWebSearch: true,
          enableRAG: true,
          userProfile, // Pass userProfile for targeted searches
            companyAnalysis, // Pass company analysis for context
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
          console.log("✅ Lead generation API response received");
        return createLeadsResultMessage(data.result);
      }
    } catch (error) {
        console.error("Error generating leads:", error);
    }
    
    return createLeadsGenerationFallback();
    },
    []
  );

  // Update global functions once they're properly defined
  useEffect(() => {
    // Wire export events to existing React export components logic
    const onExcel = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { data: string; source?: string } | undefined;
        const html = detail?.data || '';
        if (!html) return;
        import('../../lib/leadTableExporter').then((m) => m.exportLeadTableToExcel(html));
      } catch (err) { console.error(err); }
    };
    const onPdf = async (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as { data: string; source?: string } | undefined;
        const html = detail?.data || '';
        if (!html) return;
        const mod = await import('../../lib/leadTableExporter');
        mod.exportLeadTableToPdf(html, { title: 'Sales Centri – Lead Report' });
      } catch (err) { console.error(err); }
    };
    window.addEventListener('sc_export_excel', onExcel as EventListener);
    window.addEventListener('sc_export_pdf', onPdf as EventListener);
    return () => {
      window.removeEventListener('sc_export_excel', onExcel as EventListener);
      window.removeEventListener('sc_export_pdf', onPdf as EventListener);
    };
  }, []);

  useEffect(() => {
    // Update the global functions with the actual implementations
    window.handleICPResponse = handleICPResponse;
    window.generateLeads = async () => {
      try {
        let backendDataAny: Record<string, unknown> | null = null;
        const localAny = onboardingData as unknown as Record<string, unknown> | null;
        if (localAny && Object.keys(localAny).length > 0 && (localAny as any).salesObjective) {
          backendDataAny = localAny;
        } else {
          backendDataAny = (await chatApi.getOnboardingData()) as unknown as Record<string, unknown> | null;
        }
        
        const leadsMessage = ` Generating Your Leads 🎯
🔍 **Internet Research Mode: ACTIVATED**
🌐 **Searching for high-quality prospects...**
*This may take a moment while I gather comprehensive data...*`;

      await sendTypedMessage(currentChatId!, leadsMessage);
      
      setTimeout(async () => {
        if (backendDataAny) {
            const onboardingData = convertOnboardingData(
              backendDataAny as unknown as Record<string, unknown>
            );
          
          // Show web search progress for lead generation research
          setIsWebSearchActive(true);
            webSearchProgress.startProgress(
              `Generating leads for ${onboardingData.salesObjective || "your business"} - finding qualified prospects`
            );
          
          const leadsResult = await generateLeadsWithResearch(onboardingData);
          
          // Hide web search progress before typing
          setIsWebSearchActive(false);
          webSearchProgress.completeProgress();
          
          await sendTypedMessage(currentChatId!, leadsResult, 2000);
        }
      }, 4000);
    } catch (error) {
        console.error(
          "Error loading onboarding data for lead generation:",
          error
        );
    }
    };
    window.handleLeadGenAnswer = handleLeadGenAnswer;
    window.startLeadGenQuestions = startLeadGenQuestions;
    window.submitCustomRegion = () => {
      const input = document.getElementById("region-input") as HTMLInputElement;
      if (input) {
        const customValue = input.value.trim();
        if (customValue) {
          handleLeadGenAnswer("region", customValue, currentLeadGenStep + 1);
        }
      }
    };
    window.showCustomRegionInput = () => {
      const inputDiv = document.getElementById("custom-region-input");
      if (inputDiv) {
        inputDiv.style.display = "block";
      }
    };
    window.startLeadGenQuestions = startLeadGenQuestions;
    
    // Add Lightning Mode ICP editing functions
    window.editICPField = (field: string) => {
      const element = document.getElementById(`icp-${field}`);
      if (element) {
        element.focus();
        element.style.backgroundColor = '#f0f8ff';
        element.style.border = '2px solid #4299E1';
        element.style.borderRadius = '4px';
        element.style.padding = '4px';
      }
    };
    
    window.updateICPField = (field: string, value: string) => {
      console.log(`Updating ICP field ${field}:`, value);
      // Store the updated value for confirmation
      if (typeof window !== 'undefined') {
        const currentICP = JSON.parse(localStorage.getItem('lightningModeData') || '{}').icp || {};
        currentICP[field] = value;
        const lightningData = JSON.parse(localStorage.getItem('lightningModeData') || '{}');
        lightningData.icp = currentICP;
        localStorage.setItem('lightningModeData', JSON.stringify(lightningData));
      }
    };
    
    // Note: lightningGenerateLeads is already set up in globalHandlers.ts
    // No need to override it here to prevent duplicate API calls
    
    // Debug: Add a test button to verify the function works
    window.testLightningGenerateLeads = async () => {
      console.log('🔍 Test button clicked - checking function availability...');
      console.log('🔍 window.lightningGenerateLeads type:', typeof window.lightningGenerateLeads);
      
      if (typeof window.lightningGenerateLeads === 'function') {
        console.log('🔍 Calling lightningGenerateLeads...');
        try {
          await window.lightningGenerateLeads();
        } catch (error) {
          console.error('🔍 Error calling lightningGenerateLeads:', error);
        }
      } else {
        console.error('🔍 lightningGenerateLeads function not available on window object');
        alert('lightningGenerateLeads function not available. Check console for details.');
      }
    };
    
    window.viewDashboard = () => {
      try {
        console.log('📊 View Dashboard button clicked');
        
        // Redirect to SalesCentri dashboard
        if (typeof window !== 'undefined') {
          // You can customize this URL to point to your actual dashboard
          window.open('https://dashboard.salescentri.com', '_blank');
        }
      } catch (error) {
        console.error('Error opening dashboard:', error);
      }
    };
    
    
    // Cleanup function to remove handlers setup flag when chat changes
    return () => {
      if (currentChatId) {
        const handlersKey = `lightning_handlers_setup_${currentChatId}`;
        localStorage.removeItem(handlersKey);
      }
    };
  }, [
    handleICPResponse,
    handleLeadGenAnswer,
    startLeadGenQuestions,
    sendTypedMessage,
    currentChatId,
    isAuthenticated,
    userProfile,
    generateLeadsWithResearch,
    currentLeadGenStep,
  ]);

  // Fuzzy matching for Focus Mode to avoid unnecessary Gemini calls
  const checkFuzzyMatch = async (query: string): Promise<string | null> => {
    try {
      const response = await fetch("/api/fuzzy/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.result && result.result.confidence > 0.7) {
          // High confidence threshold
          return result.result.answer;
        }
      }
    } catch (error) {
      console.error("Fuzzy matching error:", error);
    }
    
    return null;
  };

  // Show loading screen while initializing (but not during message processing)
  if (isInitializing && !isMessageInProgress) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center z-[9999]"
        data-salesgpt-page
      >
        <GlobalStyles />
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Let me work my magic…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative text-white overflow-x-hidden flex flex-col"
      data-salesgpt-page
    >
      <GlobalStyles />
      

      {/* Lead Gen Modal for post-login CTA */}
      {showLeadGenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center text-black">
            <h2 className="text-2xl font-bold mb-4">Welcome!</h2>
            <p className="mb-6">Ready to supercharge your sales?</p>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg mb-4 hover:bg-blue-700 transition"
              onClick={handleLeadGenModalCTA}
            >
              Generate Your First 10 LEADS TODAY
            </button>
            <br />
            <button
              className="text-gray-500 hover:text-gray-700 underline text-sm"
              onClick={handleLeadGenModalClose}
            >
              No thanks, maybe later
            </button>
          </div>
        </div>
      )}
      
      {/* Onboarding Modal for users with no onboarding data */}
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-30">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center text-white border border-gray-700 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowOnboardingModal(false);
                setIsOnboardingMode(false);
                setActiveMode("lightning");
                setShowHyperspeed(true);
                setHasPrompted(false);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Rocket Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-full">
                <Rocket className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
              Ready to Transform Your Sales Process?
            </h2>
            
            <p className="text-gray-300 mb-6 text-sm">
              Join thousands of sales teams already using Sales Centri to close
              more deals with AI-powered automation.
            </p>
            
            <div className="space-y-3">
              <button
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={async () => {
                  setShowOnboardingModal(false);
                  setIsOnboardingMode(true);
                  setIsOnboardingChat(true); // Ensure conversational chat is active
                  setActiveMode("focus");
                  setShowHyperspeed(false);
                  setHasPrompted(false);
                  setIsFreshOnboardingSession(true); // Always start fresh

                  // Send reset data to clear backend state
                  try {
                    const anonId = !isAuthenticated
                      ? localStorage.getItem("tracker_anon_id")
                      : undefined;
                    const authToken = localStorage.getItem("salescentri_token");
                    const headers: Record<string, string> = {
                      "Content-Type": "application/json",
                    };
                    if (authToken)
                      headers["Authorization"] = `Bearer ${authToken}`;
                    let url = "/api/onboarding/chat?reset=1&ignore_external=1";
                    if (anonId && !authToken) {
                      const params = new URLSearchParams();
                      params.append("anon_id", anonId);
                      url += `&${params.toString()}`;
                    }

                    const newOnboardingChatId = `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    setOnboardingChatId(newOnboardingChatId);

                    await fetch(url, {
                      method: "POST",
                      headers,
                      body: JSON.stringify({
                        message: "RESET_ONBOARDING",
                        chatId: newOnboardingChatId,
                        conversationHistory: [],
                        resetData: {
                          sales_objective: null,
                          sales_objective_raw: null,
                          address_by: null,
                          address_by_raw: null,
                          first_name: null,
                          last_name: null,
                          job_title: null,
                          company_role: null,
                          company_role_raw: null,
                          short_term_goal: null,
                          short_term_goal_raw: null,
                          website_url: null,
                          gtm: null,
                          gtm_raw: null,
                          target_industry: null,
                          target_industry_raw: null,
                          target_revenue_size: null,
                          target_revenue_size_raw: null,
                          target_employee_size: null,
                          target_employee_size_raw: null,
                          target_departments: null,
                          target_region: null,
                          target_region_raw: null,
                          target_location: null,
                          target_audience_list_exist: 0,
                        },
                      }),
                    });
                  } catch (error) {
                    console.error("Error resetting onboarding data:", error);
                  }

                  handleStartConversationalOnboarding();
                }}
              >
                Generate Your First 10 Leads Today
              </button>
              
              <button
                className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600"
                onClick={() => {
                  setShowOnboardingModal(false);
                  setIsOnboardingMode(false);
                  setActiveMode("lightning");
                  setShowHyperspeed(true);
                  setHasPrompted(false);
                }}
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Prompt Modal */}
      {showAddPromptModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddPromptModal(false)} />
          <div className="relative bg-gradient-to-br from-[#0b1020] via-[#0a0f1a] to-[#0b1020] rounded-xl shadow-2xl border border-blue-500/20 p-6 max-w-md w-[92vw] sm:w-[480px] mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Add custom prompt</h3>
              <button onClick={() => setShowAddPromptModal(false)} className="p-1.5 rounded-md hover:bg-blue-400/10 text-gray-300">✕</button>
            </div>
            <div className="space-y-3" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (document.getElementById('saveCustomPromptBtn') as HTMLButtonElement)?.click(); } }}>
              <label className="block text-sm text-gray-300">Title</label>
              <input
                value={newCustomPromptTitle}
                onChange={(e) => setNewCustomPromptTitle(e.target.value)}
                className="w-full rounded-lg bg-[#0a0f1a] border border-blue-500/20 focus:border-blue-400/40 outline-none p-3 text-sm text-white"
                placeholder="Display title"
              />
              <label className="block text-sm text-gray-300">Prompt</label>
              <textarea
                value={newCustomPromptText}
                onChange={(e) => setNewCustomPromptText(e.target.value)}
                rows={4}
                className="w-full rounded-lg bg-[#0a0f1a] border border-blue-500/20 focus:border-blue-400/40 outline-none p-3 text-sm text-white"
                placeholder="Type your prompt..."
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowAddPromptModal(false)}
                className="px-4 py-2 text-sm font-medium text-blue-200 bg-[#0d1426] hover:bg-[#111a33] border border-blue-500/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                id="saveCustomPromptBtn"
                onClick={() => {
                  const title = newCustomPromptTitle.trim();
                  const text = newCustomPromptText.trim();
                  if (!title || !text) return;
                  const withoutDup = customPrompts.filter(p => p.title.toLowerCase() !== title.toLowerCase());
                  const next = [{ title, text }, ...withoutDup].slice(0, 50);
                  setCustomPrompts(next);
                  saveCustomPromptsForUser(next);
                  setShowAddPromptModal(false);
                  setNewCustomPromptTitle("");
                  setNewCustomPromptText("");
                  // Also drop into search bar immediately
                  setInput(text);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Research → Lightning: Website Confirmation Modal */}
      {showResearchWebsitePrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowResearchWebsitePrompt(false)}
          />
          <div className="relative bg-gradient-to-br from-[#0b1020] via-[#0a0f1a] to-[#0b1020] rounded-xl shadow-2xl border border-blue-500/20 p-6 max-w-md w-[92vw] sm:w-[480px] mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Confirm website to enter Lightning Mode</h3>
              <button
                onClick={() => setShowResearchWebsitePrompt(false)}
                className="p-1.5 rounded-md hover:bg-blue-400/10 text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (document.getElementById('confirmResearchWebsiteBtn') as HTMLButtonElement)?.click(); } }}>
              <label className="block text-sm text-gray-300">Website</label>
              <input
                value={researchWebsiteInput}
                onChange={(e) => setResearchWebsiteInput(e.target.value)}
                className="w-full rounded-lg bg-[#0a0f1a] border border-blue-500/20 focus:border-blue-400/40 outline-none p-3 text-sm text-white"
                placeholder="example.com"
              />
              <p className="text-xs text-gray-400">Only the website will be used to start Lightning Mode. Research context is not transferred.</p>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowResearchWebsitePrompt(false)}
                className="px-4 py-2 text-sm font-medium text-blue-200 bg-[#0d1426] hover:bg-[#111a33] border border-blue-500/20 rounded-lg transition-colors"
              >
                Stay in Chat
              </button>
              <button
                id="confirmResearchWebsiteBtn"
                onClick={() => {
                  const site = researchWebsiteInput.trim();
                  if (!site) return;
                  setShowResearchWebsitePrompt(false);
                  setTimeout(() => startLightningFromResearch(site), 0);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow"
              >
                Enter Lightning Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Website Prompt Modal */}
      {showWebsitePromptModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowWebsitePromptModal(false)}
          />
          <div className="relative bg-gradient-to-br from-[#0b1020] via-[#0a0f1a] to-[#0b1020] rounded-xl shadow-2xl border border-blue-500/20 p-6 max-w-md w-[92vw] sm:w-[480px] mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Enter client website</h3>
              <button
                onClick={() => setShowWebsitePromptModal(false)}
                className="p-1.5 rounded-md hover:bg-blue-400/10 text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (document.getElementById('continueWebsitePromptBtn') as HTMLButtonElement)?.click(); } }}>
              <label className="block text-sm text-gray-300">Website</label>
              <input
                value={websiteInput}
                onChange={(e) => setWebsiteInput(e.target.value)}
                className="w-full rounded-lg bg-[#0a0f1a] border border-blue-500/20 focus:border-blue-400/40 outline-none p-3 text-sm text-white"
                placeholder="example.com"
              />
              <p className="text-xs text-gray-400">Prompt: <span className="text-gray-300">{websitePromptBase}</span></p>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowWebsitePromptModal(false)}
                className="px-4 py-2 text-sm font-medium text-blue-200 bg-[#0d1426] hover:bg-[#111a33] border border-blue-500/20 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                id="continueWebsitePromptBtn"
                onClick={() => {
                  const site = websiteInput.trim();
                  if (!site) return;
                  const composedVisible = `${websitePromptBase}. Website: ${site}`;
                  setInput(composedVisible);
                  if (websiteBackendBase) {
                    const composedBackend = `${websiteBackendBase}${site}`;
                    setPendingBackendOverride(composedBackend);
                    setPendingVisibleOverride(composedVisible);
                  } else {
                    setPendingBackendOverride(null);
                    setPendingVisibleOverride(null);
                  }
                  // Use the entered website as a one-time chat title
                  setPendingTitleOverride(site);
                  setShowWebsitePromptModal(false);
                  setWebsiteInput("");
                  setWebsiteBackendBase(null);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors shadow"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing User Modal for users with onboarding data */}
      {showExistingUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-30">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center text-white border border-gray-700 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowExistingUserModal(false);
                setIsOnboardingMode(false);
                setActiveMode("lightning");
                setShowHyperspeed(true);
                setHasPrompted(false);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* User Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-full">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Welcome Back!
            </h2>
            
            <p className="text-gray-300 mb-6 text-sm">
              I have your profile information ready. What would you like to do
              today?
            </p>
            
            <div className="space-y-3">
              <button
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
                onClick={async () => {
                  if (isProcessing) return; // Prevent multiple clicks
                  
                  console.log("🚀 Starting analysis flow...");
                  
                  try {
                    // STEP 1: Set processing immediately to prevent any UI changes
                    setIsProcessing(true);
                    
                    // STEP 2: Create chat first
                    console.log("🚀 Creating new chat...");
                    const chatTitle = getCompanyWebsiteTitle(onboardingData);
                    const chatId = await createNewChat(chatTitle);
                    if (!chatId) {
                      console.error("❌ Failed to create chat for analysis");
                      setIsProcessing(false);
                      return;
                    }
                    
                    console.log("✅ Chat created successfully:", chatId);
                    
                    // STEP 3: Set ALL state at once to prevent any intermediate renders
                    setShowExistingUserModal(false);
                    setCurrentChatId(chatId);
                    setActiveMode("focus");
                    setRecentPrompt("Generating your personalized analysis...");
                    setHasPrompted(true);
                    setShowHyperspeed(false);
                    setIsOnboardingMode(false);
                    setIsOnboardingChat(false);
                    setIsInitializing(false);
                    
                    // STEP 4: Set up chat session for sidebar
                    const newChat: ChatSession = {
                      id: chatId,
                      title: chatTitle,
                      messages: [],
                      createdAt: Date.now(),
                    };
                    setChatSessions((prev) => [newChat, ...prev]);
                    
                    // STEP 5: Store analysis data for post-navigation execution
                    if (onboardingData) {
                      console.log(
                        "💾 Storing analysis data for execution after navigation..."
                      );
                      localStorage.setItem(
                        "pendingAnalysis",
                        JSON.stringify({
                        chatId,
                        onboardingData,
                          timestamp: Date.now(),
                        })
                      );
                    }
                    
                    // STEP 6: Navigate immediately - checkForPendingAnalysis will handle the rest
                    console.log("🚀 Navigating to chat...");
                    router.push(
                      `/solutions/psa-suite-one-stop-solution/c/${chatId}`
                    );

                    console.log(
                      "✅ Navigation initiated - checkForPendingAnalysis will execute analysis"
                    );
                  } catch (error) {
                    console.error("❌ Error in analysis flow:", error);
                    setIsProcessing(false);
                    setRecentPrompt("");
                  }
                }}
              >
                Get Analysis
              </button>
              
              <button
                className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-600"
                onClick={async () => {
                  setShowExistingUserModal(false);
                  setOnboardingData((prev) => ({
                    userId: prev.userId,
                    currentStep: "start",
                    salesObjective: prev.salesObjective,
                    userRole: prev.userRole,
                    immediateGoal: prev.immediateGoal,
                    companyWebsite: prev.companyWebsite,
                    marketFocus: prev.marketFocus,
                    companyInfo: prev.companyInfo,
                    targetTitles: prev.targetTitles,
                    targetRegion: prev.targetRegion,
                    targetEmployeeSize: prev.targetEmployeeSize,
                    hasTargetList: prev.hasTargetList,
                    contactListStatus: prev.contactListStatus,
                    outreachChannels: prev.outreachChannels,
                    leadHandlingCapacity: prev.leadHandlingCapacity,
                    currentLeadGeneration: prev.currentLeadGeneration,
                    budget: prev.budget,
                    completedAt: prev.completedAt,
                  }));
                  setCurrentOnboardingStep("start");
                  setIsOnboardingRestartMode(true);
                  setIsOnboardingMode(true);
                  setIsOnboardingChat(true); // Ensure conversational chat is active
                  setCurrentChatId(null);
                  setRecentPrompt("");
                  setHasPrompted(false);
                  setShowOnboardingCompletion(false);
                  setActiveMode("focus");
                  setShowHyperspeed(false);

                  const newOnboardingChatId = `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                  setOnboardingChatId(newOnboardingChatId);
                  setOnboardingMessages([]);

                  try {
                    const anonId = !isAuthenticated
                      ? localStorage.getItem("tracker_anon_id")
                      : undefined;
                    const authToken = localStorage.getItem("salescentri_token");
                    const headers: Record<string, string> = {
                      "Content-Type": "application/json",
                    };
                    if (authToken)
                      headers["Authorization"] = `Bearer ${authToken}`;
                    let url = "/api/onboarding/chat?reset=1&ignore_external=1";
                    if (anonId && !authToken) {
                      const params = new URLSearchParams();
                      params.append("anon_id", anonId);
                      url += `&${params.toString()}`;
                    }
                    const resp = await fetch(url, {
                      method: "POST",
                      headers,
                      body: JSON.stringify({
                        message: "RESET_ONBOARDING",
                        chatId: newOnboardingChatId,
                        conversationHistory: [],
                        resetData: {
                          sales_objective: null,
                          sales_objective_raw: null,
                          address_by: null,
                          address_by_raw: null,
                          first_name: null,
                          last_name: null,
                          job_title: null,
                          company_role: null,
                          company_role_raw: null,
                          short_term_goal: null,
                          short_term_goal_raw: null,
                          website_url: null,
                          gtm: null,
                          gtm_raw: null,
                          target_industry: null,
                          target_industry_raw: null,
                          target_revenue_size: null,
                          target_revenue_size_raw: null,
                          target_employee_size: null,
                          target_employee_size_raw: null,
                          target_departments: null,
                          target_region: null,
                          target_region_raw: null,
                          target_location: null,
                          target_audience_list_exist: 0,
                        },
                      }),
                    });
                    if (resp.ok) {
                      const data = await resp.json();
                      const backendQuestion =
                        data.result ||
                        data.response ||
                        "Let's begin. What is your primary sales objective?";
                      const welcomeMessage =
                        "";

                      // Reset restart mode immediately after successful reset call
                      setIsOnboardingRestartMode(false);
                      // But mark this as a fresh session that should ignore external data
                      setIsFreshOnboardingSession(true);
                      console.log(
                        "🔄 Reset completed, starting fresh onboarding session"
                      );
                      const welcomeAiMessage: ChatMessage = {
                        id: `onboarding_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai_welcome`,
                        role: "assistant",
                        content: formatAIText(welcomeMessage),
                        timestamp: Date.now(),
                      };
                      const firstQuestion: ChatMessage = {
                        id: `onboarding_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_ai_q1`,
                        role: "assistant",
                        content: formatAIText(backendQuestion),
                        timestamp: Date.now(),
                      };
                      setOnboardingMessages([welcomeAiMessage, firstQuestion]);
                      // NO TYPING EFFECT - Display all options at once
                      setTimeout(() => {
                        setShouldAutoScroll(true);
                        scrollToBottom(true);
                      }, 50);
                    } else {
                      console.error("Failed to reset onboarding state");
                    }
                  } catch (e) {
                    console.error("Error during onboarding reset:", e);
                  }
                }}
              >
                Create a new list with AI
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Focus Mode Modal for users with preserved chat */}
      {showFocusModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-60">
          <div className="bg-gradient-to-b from-gray-900 via-black to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-white border border-blue-500/10 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowFocusModeModal(false);
                setFocusModalAlreadyShown(true); // Prevent reshowing
                setActiveMode("lightning");
                setShowHyperspeed(true);
                setHasPrompted(false);
                // Clean up preserved chat data on close
                localStorage.removeItem('salescentri_preserved_chat');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Rocket Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-full shadow-lg">
                <Rocket className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-4 text-white">
              Ready to Transform Your Sales Process?
            </h2>
            
            <p className="text-gray-300 text-center mb-8 leading-relaxed">
              Join thousands of sales teams already using Sales Centri to close more deals with AI-powered automation.
            </p>
            
            <div className="space-y-3">
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                onClick={async () => {
                  setShowFocusModeModal(false);
                  setFocusModalAlreadyShown(true); // Prevent reshowing
                  setIsOnboardingMode(true);
                  setIsOnboardingChat(true);
                  setActiveMode("focus");
                  setShowHyperspeed(false);
                  setHasPrompted(false);
                  setIsFreshOnboardingSession(true);

                  // Start onboarding flow for lead generation
                  try {
                    const anonId = !isAuthenticated
                      ? localStorage.getItem("tracker_anon_id")
                      : undefined;
                    const authToken = localStorage.getItem("salescentri_token");
                    const headers: Record<string, string> = {
                      "Content-Type": "application/json",
                    };
                    if (authToken)
                      headers["Authorization"] = `Bearer ${authToken}`;
                    let url = "/api/onboarding/chat?reset=1&ignore_external=1";
                    if (anonId && !authToken) {
                      const params = new URLSearchParams();
                      params.append("anon_id", anonId);
                      url += `&${params.toString()}`;
                    }

                    const newOnboardingChatId = `onboarding_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    setOnboardingChatId(newOnboardingChatId);

                    await fetch(url, {
                      method: "POST",
                      headers,
                      body: JSON.stringify({
                        message: "RESET_ONBOARDING",
                        chatId: newOnboardingChatId,
                        conversationHistory: [],
                        resetData: {
                          sales_objective: null,
                          address_by: null,
                          company_role: null,
                          short_term_goal: null,
                          website_url: null,
                          gtm: null,
                          target_industry: null,
                          target_revenue_size: null,
                          target_employee_size: null,
                          target_departments: null,
                          target_region: null,
                          target_location: null,
                          target_audience_list_exist: 0,
                        },
                      }),
                    });

                    // Clean up preserved chat since we're starting fresh
                    localStorage.removeItem('salescentri_preserved_chat');
                  } catch (error) {
                    console.error("Error resetting onboarding data:", error);
                  }

                  handleStartConversationalOnboarding();
                }}
              >
                Generate Your First 10 Leads Today
              </button>
              
              <button
                className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white px-6 py-4 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                onClick={async () => {
                  console.log('🔄 Continue chatting button clicked');
                  setShowFocusModeModal(false);
                  setFocusModalAlreadyShown(true); // Prevent reshowing

                  try {
                    console.log('🔄 Starting chat recreation...');
                    // Recreate the preserved chat
                    const newChatId = await recreatePreservedChat();
                    
                    if (newChatId) {
                      console.log('✅ Chat recreation successful, navigating to:', newChatId);
                      
                      // Update current state immediately and navigate
                      setCurrentChatId(newChatId);
                      setActiveMode("lightning");
                      
                      // Navigate immediately without showing loading state
                      const chatUrl = `/solutions/psa-suite-one-stop-solution/c/${newChatId}`;
                      console.log('🚀 Navigating to:', chatUrl);
                      router.push(chatUrl);
                    } else {
                      console.error('❌ Chat recreation failed - no chat ID returned');
                      setActiveMode("lightning");
                      setShowHyperspeed(true);
                    }
                  } catch (error) {
                    console.error('❌ Error in continue chatting flow:', error);
                    setActiveMode("lightning");
                    setShowHyperspeed(true);
                  }
                }}
              >
                Continue Chatting
              </button>
              
              <button
                className="w-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-xl font-medium text-base transition-all duration-200 border border-gray-700 hover:border-gray-600 shadow-lg"
                onClick={() => {
                  setShowFocusModeModal(false);
                  setFocusModalAlreadyShown(true); // Prevent reshowing
                  setActiveMode("lightning");
                  setShowHyperspeed(true);
                  setHasPrompted(false);
                  // Clean up preserved chat data
                  localStorage.removeItem('salescentri_preserved_chat');
                }}
              >
                Back to Homepage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar overlays content, not pushing layout */}
      <Sidebar 
        highlightModels={highlightModels}
        extended={sidebarExtended}
        setExtended={setSidebarExtended}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        onNewChat={startNewChat}
        onSwitchChat={switchToChat}
        onDeleteChat={deleteChat}
        onPromptClick={(prompt) => {
          // Paste prompt into HOME search only (do NOT enter chat mode)
          setInput(prompt);
          // Force next send to use Gemini+Google only (no Langchain)
          setForceGeminiOnlyNext(true);
          // Auto-focus the input after setting the prompt
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
            }
          }, 100);
        }}
        onPromptWithWebsite={(promptOrObj) => {
          setShowWebsitePromptModal(true);
          if (typeof promptOrObj === 'string') {
            setWebsitePromptBase(promptOrObj);
            setWebsiteBackendBase(null);
          } else if (promptOrObj && typeof promptOrObj === 'object') {
            setWebsitePromptBase(promptOrObj.visible);
            setWebsiteBackendBase(promptOrObj.backend || null);
          }
          // Mark that this came from sidebar menu
          setForceGeminiOnlyNext(true);
        }}
        customPrompts={customPrompts}
        onAddCustomPrompt={() => setShowAddPromptModal(true)}
      />
      
      {/* Show TargetCursor only on lander (not in chat or voice modes) */}
      {!voiceMode && !recentPrompt}
      {/* Background: Orb for Voice AI, Hyperspeed for landing, gradient for chat */}
      {voiceMode ? (
        <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
          {/* Orb is now rendered in main content for pointer events */}
        </div>
      ) : showHyperspeed ? (
        <div className="fixed inset-0 z-0 w-full h-full overflow-hidden">
          <MemoizedLightRaysBackground />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#0a0020] via-[#18122b] to-[#0a0020]" />
      )}
      {/* Header - Mobile Responsive - Lower z-index than sidebar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-2 py-2 sm:p-3 border-b border-blue-500/30 backdrop-blur-xl bg-black/20">
        <div
          className="flex items-center"
          style={{
            marginLeft: sidebarExtended ? "0" : "0",
            transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Sidebar toggle button - mobile only with more space */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-blue-500/10 transition-colors mr-3 flex items-center justify-center"
            onClick={() => {
              setMobileSidebarOpen(!mobileSidebarOpen);
            }}
            aria-label="Toggle sidebar"
          >
            <Image 
              src="/sidebar.webp" 
              alt="Toggle sidebar" 
              className="text-blue-400 transition-transform duration-300" 
              width={20} 
              height={20} 
              style={{ 
                transform: mobileSidebarOpen
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                width: "20px",
                height: "20px",
                filter: "brightness(1.2) saturate(1.5) hue-rotate(0deg)",
              }}
            />
          </button>
          
          {/* Home icon for mobile only */}
          <button
            className="sm:hidden p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors mr-4"
            onClick={handleLogoClick}
            aria-label="Home"
          >
            <Home className="w-5 h-5 text-blue-400" />
          </button>
          
          {/* Logo for desktop */}
          <motion.div 
            className="hidden sm:flex items-center space-x-2 sm:space-x-3 sm:ml-[4rem]"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={handleLogoClick}
          >
            <Image
              src="/saleslogo.webp"
              alt="Sales Centri"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-lg sm:text-2xl font-bold cursor-pointer">
              <span className="text-white">Sales</span>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent ml-1">Centri</span>
            </span>
          </motion.div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-4 ml-2 sm:ml-4">
          {/* Dashboard Button - Only show for authenticated users */}
          {process.env.NEXT_PUBLIC_DASHBOARD_URL && isAuthenticated && (
            <a
              href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL?.replace(/\/$/, "")}/lists${!isAuthenticated ? `?anon_id=${encodeURIComponent(typeof window!=="undefined"?localStorage.getItem("tracker_anon_id")||"":"")}` : ""}`}
              className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-300 font-medium text-xs sm:text-sm cursor-pointer"
            >
              <ExternalLink size={12} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Visit Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </a>
          )}
          
          {isAuthLoading ? (
            <div className="px-3 py-1 sm:px-4 sm:py-2 text-blue-400 text-xs sm:text-sm">
              Loading...
            </div>
          ) : isAuthenticated && userProfile ? (
            // Authenticated user UI
            <>
              <div className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm text-blue-400 bg-black/20 backdrop-blur-sm border border-blue-500/30">
                <span className="hidden sm:inline">Welcome, </span>
                <span className="font-semibold">
                  {userProfile.user?.email?.split("@")[0] ||
                    userProfile.organization?.name ||
                    "User"}
                </span>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-blue-500/10 transition-colors duration-200 border border-blue-500/30 cursor-pointer"
                title="Profile"
              >
                <User size={16} className="sm:w-5 sm:h-5 text-blue-400" />
              </button>
            </>
          ) : (
            // Unauthenticated user UI
            <>
              <button
                onClick={() => {
                  router.push('/#demo');
                }}
                className="px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-semibold text-gray-300 border-2 border-gray-700/40 hover:bg-gray-800/40 hover:border-gray-600/60 transition-all duration-200 backdrop-blur-sm bg-black/20 text-xs sm:text-base cursor-pointer font-dm-sans"
              >
                View Demo
              </button>
              <button
                onClick={() => {
                  preserveCurrentChatBeforeLogin();
                  window.location.href = getLoginUrl();
                }}
                className="px-2 py-1 sm:px-6 sm:py-2 rounded-lg font-semibold text-blue-400 border-2 border-blue-500/40 hover:bg-blue-500/10 hover:border-blue-400/60 transition-all duration-200 backdrop-blur-sm bg-black/20 text-xs sm:text-base cursor-pointer font-dm-sans"
              >
                Login
              </button>
              <button
                onClick={() => {
                  preserveCurrentChatBeforeLogin();
                  window.location.href = getLoginUrl();
                }}
                className="px-2 py-1 sm:px-6 sm:py-1.5 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-500/60 hover:from-blue-500 hover:to-blue-600 hover:scale-105 transition-all duration-200 shadow-lg text-xs sm:text-base font-dm-sans cursor-pointer"
                style={{ 
                  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                }}
              >
                <span className="hidden sm:inline">Sign up for free</span>
                <span className="sm:hidden">Sign up</span>
              </button>
            </>
          )}
        </div>
      </header>
      <main className="relative z-10 flex-1 flex flex-col pt-14 sm:pt-16">
        {/* Added responsive pt for fixed header space */}
        {voiceMode ? (
          <div
            className="flex-1 flex flex-col items-center justify-center relative px-4"
            style={{ minHeight: "300px" }}
          >
            <div
              style={{
                width: "240px",
                height: "240px",
                position: "relative",
                margin: "0 auto",
                pointerEvents: "auto",
                zIndex: 2,
              }}
              className="sm:w-[340px] sm:h-[340px]"
            >
              <Orb
                hoverIntensity={0.5}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </div>
            <button
              className={`mt-8 px-7 py-3 rounded-full font-bold text-white shadow-2xl border-2 transition-all duration-200 text-lg tracking-wide cursor-pointer ${isSpeaking ? "bg-[#a8001c] border-[#7a0015]" : "glass-container bg-gradient-to-br from-red-600 via-red-500 to-red-400 border-red-500/60 hover:scale-105"}`}
              style={{
                boxShadow: isSpeaking
                  ? "0 8px 32px 0 rgba(168,0,28,0.32), 0 1.5px 0 rgba(122,0,21,0.18) inset"
                  : "0 8px 32px 0 rgba(239,68,68,0.18), 0 1.5px 0 rgba(239,68,68,0.08) inset",
                backdropFilter: isSpeaking
                  ? undefined
                  : "blur(24px) saturate(1.2)",
                WebkitBackdropFilter: isSpeaking
                  ? undefined
                  : "blur(24px) saturate(1.2)",
                fontSize: "1.1rem",
                marginTop: "-60px",
                zIndex: 10,
              }}
              onClick={handleVoiceStart}
            >
              {isSpeaking ? "Stop Speaking" : "Start Speaking"}
            </button>
          </div>
        ) : showOnboardingCompletion ? (
          // Onboarding Completion Screen - Manual trigger for analysis
          <div className="flex-1 flex flex-col relative h-full min-h-0">
            {/* Chat Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
            <div className="absolute inset-0 opacity-60">
              <div className="absolute inset-0 bg-grid animate-grid-smoke" />
              <div className="absolute inset-0 bg-grid-secondary animate-grid-smoke-reverse" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
            
            {/* Completion Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 sm:px-4 py-4 sm:py-6 relative">
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 min-h-full flex items-center justify-center">
                <div className="text-center p-8 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
                  <div className="space-y-6">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Setup Complete!
                    </h2>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                      Perfect! I now have a clear understanding of your
                      business. Ready to analyze your profile and provide
                      personalized insights?
                    </p>
                    
                    {/* Profile Summary */}
                    <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700 text-left">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        Your Profile Summary:
                      </h3>
                      <div className="space-y-3">
                        {onboardingData.salesObjective && (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-blue-400">🎯</div>
                            <span className="text-gray-300">
                              Objective: {onboardingData.salesObjective}
                            </span>
                          </div>
                        )}
                        {onboardingData.userRole && (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-green-400">👤</div>
                            <span className="text-gray-300">
                              Role: {onboardingData.userRole}
                            </span>
                          </div>
                        )}
                        {onboardingData.companyInfo?.industry && (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-purple-400">🏢</div>
                            <span className="text-gray-300">
                              Industry: {onboardingData.companyInfo.industry}
                            </span>
                          </div>
                        )}
                        {(() => {
                          const industries =
                            (Array.isArray(onboardingData.targetIndustries) &&
                              onboardingData.targetIndustries.length > 0 &&
                              onboardingData.targetIndustries) ||
                            (Array.isArray(
                              (onboardingData as unknown as {
                                target_industries?: string[];
                              }).target_industries
                            ) &&
                              (
                                (onboardingData as unknown as {
                                  target_industries?: string[];
                                }).target_industries as string[]
                              ).filter(Boolean)) ||
                            undefined;

                          if (!industries || industries.length === 0) {
                            return null;
                          }

                          return (
                            <div className="flex items-center space-x-3">
                              <div className="w-5 h-5 text-pink-400">🏷️</div>
                              <span className="text-gray-300">
                                Target Industries: {industries.join(", ")}
                              </span>
                            </div>
                          );
                        })()}
                        {onboardingData.marketFocus && (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-orange-400">🌐</div>
                            <span className="text-gray-300">
                              Market: {onboardingData.marketFocus}
                            </span>
                          </div>
                        )}
                        {onboardingData.companyWebsite && (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-yellow-400">🔗</div>
                            <span className="text-gray-300">
                              Website: {onboardingData.companyWebsite}
                            </span>
                          </div>
                        )}
                        {onboardingData.companyInfo?.revenueSize && (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-green-400">💰</div>
                            <span className="text-gray-300">
                              Target Revenue: ${onboardingData.companyInfo.revenueSize}
                            </span>
                          </div>
                        )}
                        {onboardingData.companyInfo?.employeeSize && (
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 text-blue-400">👥</div>
                            <span className="text-gray-300">
                              Target Employees: {onboardingData.companyInfo.employeeSize}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button
                      onClick={startOnboardingAnalysis}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
                    >
                      <span>Start My Analysis</span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeMode === "focus" && isOnboardingMode ? (
          // Focus Mode Onboarding Screen - Always show when onboarding is active
          <div className="flex-1 flex flex-col relative h-full">
            {/* Chat Background for onboarding */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
            <div className="absolute inset-0 opacity-60">
              <div className="absolute inset-0 bg-grid animate-grid-smoke" />
              <div className="absolute inset-0 bg-grid-secondary animate-grid-smoke-reverse" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
            
            {/* Check if conversational onboarding is active */}
            {isOnboardingMode ? (
              // Conversational Onboarding Interface - Same as normal chat UI
              <div className="flex-1 flex flex-col min-h-0">
                {/* Messages Container - Same as normal chat with bottom padding for fixed input */}
                <div
                  ref={onboardingContainerRef}
                  onScroll={handleScroll}
                  onWheel={(e) => {
                    // Enable manual scroll for onboarding chat (mouse/touchpad)
                    e.currentTarget.scrollTop += e.deltaY;
                  }}
                  className="flex-1 overflow-y-scroll overflow-x-hidden px-2 sm:px-3 py-3 sm:py-4 relative font-dm-sans custom-scrollbar"
                  style={{
                    height: "calc(100vh - 140px)", // Match lightning/focus chat: Header (56px) + Input area (84px)
                    maxHeight: "calc(100vh - 140px)",
                    paddingBottom: "0.8rem",
                    scrollBehavior: "auto",
                    WebkitOverflowScrolling: "touch",
                    overscrollBehavior: "auto",
                    willChange: "scroll-position",
                    touchAction: "pan-y",
                  }}
                >
                  <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                    {onboardingMessages.map((message, index) => (
                      <div key={message.id || index} className="group">
                        <ChatMessageComponent
                          message={message}
                          isLatestMessage={
                            index === onboardingMessages.length - 1
                          }
                          isTyping={
                            isOnboardingTyping &&
                            onboardingTypingIndex === index
                          }
                          displayedResult={
                            isOnboardingTyping &&
                            onboardingTypingIndex === index
                              ? onboardingDisplayedText 
                              : message.content
                          }
                          isLoading={false}
                          isResearchLoading={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scroll to Bottom Button for onboarding chat */}
                {showScrollDown && (
                  <button
                    onClick={() => {
                      setShouldAutoScroll(true);
                      scrollToBottom(true);
                    }}
                    className="fixed bottom-16 sm:bottom-30 left-1/2 transform -translate-x-1/2 z-30 bg-black/90 hover:bg-black text-white p-1 sm:p-2 rounded-full shadow-lg transition-all border-2 border-white/60 hover:border-white hover:scale-110 backdrop-blur-sm w-6 h-6 sm:w-[38px] sm:h-[38px] cursor-pointer"
                    aria-label="Scroll to bottom"
                    style={{
                      boxShadow:
                        "0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <ChevronDown
                      size={12}
                      color="white"
                      className="sm:w-[18px] sm:h-[18px]"
                    />
                  </button>
                )}

                {/* No custom input area - use the global fixed input */}
              </div>
            ) : null}
                    </div>
        ) : activeMode === "focus" &&
          !isOnboardingMode &&
          !isOnboardingChat &&
          !recentPrompt &&
          !currentChatId &&
          !isProcessing &&
          !showOnboardingModal &&
          !showExistingUserModal ? (
          // Focus Mode - Show clear background when no modal is displayed
          <div className="flex-1 flex flex-col relative h-full">
            {/* Clear background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          </div>
        ) : !recentPrompt && !isProcessing ? (
          // Show landing page content - Mobile Responsive (but not when processing)
          <div
            className="px-3 sm:px-6 pt-12 sm:pt-18 pb-20 sm:pb-26 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-10 overflow-hidden"
            style={{ transform: "scale(0.75)", transformOrigin: "top" }}
            data-salesgpt-page
          >
            {/* Title and Description - Mobile Responsive */}
            <div className="space-y-3 sm:space-y-4 flex flex-col items-center text-center font-poppins font-semibold">
              <BlurText
                text="SalesGPT"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-4xl sm:text-6xl font-mediumbold text-blue-400 drop-shadow-2xl tracking-wide font-poppins text-center"
              />
              <p className="text-lg sm:text-2xl text-gray-300 tracking-wide text-center px-4 font-dm-sans font-normal">
                Smarter Pre-Sales Starts Here. Goals, ICP, and Leads on
                Autopilot
              </p>
            </div>
            <div className="w-full max-w-4xl relative px-2 sm:px-0 mt-8 sm:mt-12">
              <div
                className="glass-container rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex flex-col items-stretch shadow-2xl border border-blue-400/30 relative w-full max-w-4xl mx-auto"
                style={{ overflow: "visible" }}
              >
                {/* Top row: Search input and send button - Mobile Responsive */}
                <div className="flex items-center w-full space-x-2 sm:space-x-4">
                  <div 
                    className="flex-1 relative cursor-text"
                    onMouseEnter={() => {
                      console.log("🖱️ Mouse enter - setting isHovered to true");
                      setIsHovered(true);
                    }}
                    onMouseLeave={() => {
                      console.log(
                        "🖱️ Mouse leave - setting isHovered to false"
                      );
                      setIsHovered(false);
                    }}
                    onClick={handlePlaceholderClick}
                  >
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onClick={
                        input.length === 0 ? handlePlaceholderClick : undefined
                      }
                      placeholder={placeholderQuestions[currentPlaceholder].question}
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      rows={inputRows}
                      className={`w-full bg-transparent text-base sm:text-lg placeholder-gray-400 outline-none px-3 sm:px-4 py-2 sm:py-3 tracking-wide transition-all duration-600 font-inter font-medium resize-none ${
                        isAnimating && !isHovered
                          ? "placeholder-slide-out"
                          : "placeholder-slide-in"
                      } ${
                        input.length > 0
                          ? "placeholder-white"
                          : isHovered
                            ? "placeholder-gray"
                            : "placeholder-gray-500"
                      }`}
                      style={{ 
                        cursor: input.length === 0 ? "pointer" : "text",
                        minHeight: "4.2em",
                        maxHeight: "10em",
                        fontSize: "0.95rem",
                        borderRadius: "0.6em",
                        resize: "none",
                        overflow: "hidden",
                        lineHeight: "1.5"
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSend}
                    className="send-button p-3 sm:p-4 rounded-full text-xl sm:text-2xl transition-all duration-300 hover:scale-110"
                  >
                    <Image
                      src="/rise.webp"
                      alt="Send"
                      width={16}
                      height={16}
                      className="object-contain sm:w-[20px] sm:h-[20px]"
                    />
                  </button>
                </div>
                {/* Bottom row: Tools on left, mode controls on right - Mobile Responsive */}
                <div className="flex flex-row w-full mt-1.5 sm:mt-2 justify-between items-center">
                  {/* Left side: Tools button - Mobile Responsive - Better positioned */}
                  <div ref={toolsDropdownRef} className="relative ml-2 sm:ml-0">
                    <button
                      type="button"
                      onClick={() => setShowToolsDropdown((v) => !v)}
                      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-2xl hover:bg-blue-400/10 transition-colors focus:outline-none border border-blue-400/20"
                    >
                      <Settings2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    </button>
                    {showToolsDropdown && (
                      <div className="absolute bottom-8 sm:bottom-12 left-1 sm:left-0 w-44 sm:w-52 bg-black/95 border border-blue-400/30 rounded-xl shadow-2xl z-50 flex flex-col animate-fade-in-up max-h-80 overflow-y-auto">
                        {/* Bulk Upload Section */}
                        <div className="px-2 sm:px-3 py-1.5 sm:py-2">
                          <label className="flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm text-blue-200 hover:bg-blue-400/10 transition-colors cursor-pointer rounded-lg">
                            <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                            <span className="font-medium">
                              {uploadedFile ? `✓ ${uploadedFileName}` : 'Bulk Upload'}
                            </span>
                            <input
                              type="file"
                              accept=".xlsx,.xls,.csv,.pdf"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        
                        {/* Divider */}
                        <div className="border-t border-gray-600/50 mx-3 sm:mx-4"></div>
                        
                        {/* Section 1: Basic Tools */}
                        <div className="px-2 sm:px-3 py-1.5 sm:py-2 space-y-1">
                          <button 
                            className={`w-full flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-lg ${
                              selectedToolMode === 'lightning' 
                                ? 'text-blue-400 bg-blue-400/10 border border-blue-400/30' 
                                : 'text-blue-200 hover:bg-blue-400/10'
                            }`}
                            onClick={() => {
                              setSelectedToolMode('lightning');
                              setShowToolsDropdown(false);
                              handleModeChange("lightning");
                            }}
                          >
                            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                            <span className="font-medium">Lightning</span>
                          </button>
                          
                          <button 
                            className={`w-full flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-lg ${
                              selectedToolMode === 'focus' 
                                ? 'text-blue-400 bg-blue-400/10 border border-blue-400/30' 
                                : 'text-blue-200 hover:bg-blue-400/10'
                            }`}
                            onClick={() => {
                              setSelectedToolMode('focus');
                              setShowToolsDropdown(false);
                              handleModeChange("focus");
                            }}
                          >
                            <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                            <span className="font-medium">Focus</span>
                          </button>
                        </div>
                        
                        {/* Divider */}
                        <div className="border-t border-gray-600/50 mx-2 sm:mx-3"></div>
                        
                        {/* Section 2: Research Tools */}
                        <div className="px-2 sm:px-3 py-1.5 sm:py-2 space-y-1">
                          <button 
                            className={`w-full flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-lg ${
                              selectedToolMode === 'research' 
                                ? 'text-blue-400 bg-blue-400/10 border border-blue-400/30' 
                                : 'text-blue-200 hover:bg-blue-400/10'
                            }`}
                            onClick={() => {
                              setSelectedToolMode('research');
                              setShowToolsDropdown(false);
                              handleModeChange("research");
                            }}
                          >
                            <Atom className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                            <span className="font-medium">Research</span>
                          </button>
                          
                          <button 
                            className={`w-full flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-lg ${
                              selectedToolMode === 'multi-research' 
                                ? 'text-blue-400 bg-blue-400/10 border border-blue-400/30' 
                                : 'text-blue-200 hover:bg-blue-400/10'
                            }`}
                            onClick={() => {
                              setSelectedToolMode('multi-research');
                              setShowToolsDropdown(false);
                              setIsMultiResearchSelected(true);
                              
                              // If file is already uploaded, redirect immediately
                              if (uploadedFile) {
                                const redirectUrl = `/multi-gpt-aggregated-research?uploadedFile=${encodeURIComponent(uploadedFileName)}`;
                                window.location.href = redirectUrl;
                              } else {
                                // Otherwise just redirect to multi-gpt-aggregated-research
                                window.location.href = '/multi-gpt-aggregated-research';
                              }
                            }}
                          >
                            <Microscope className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                            <span className="font-medium">Multi Research</span>
                          </button>
                          
                          <button 
                            className={`w-full flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-lg ${
                              selectedToolMode === 'web-intel' 
                                ? 'text-blue-400 bg-blue-400/10 border border-blue-400/30' 
                                : 'text-blue-200 hover:bg-blue-400/10'
                            }`}
                            onClick={() => {
                              setSelectedToolMode('web-intel');
                              setShowToolsDropdown(false);
                              // Add web intel functionality here
                            }}
                          >
                            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                            <span className="font-medium">Web Intel</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Right side: Mode buttons - Mobile Responsive - Smaller on mobile */}
                  <div className="flex items-center space-x-1 sm:space-x-3">
                    <button
                      onClick={() => {
                        handleModeChange("lightning");
                        lightningMode.activateLightningMode();
                      }}
                      className={`mode-toggle-button transition-all duration-500 ease-in-out cursor-pointer ${
                        activeMode === "lightning"
                          ? "mode-active flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-4 py-1 sm:py-2"
                          : "mode-inactive w-5 h-5 sm:w-10 sm:h-10 flex items-center justify-center rounded-full"
                      }`}
                      title="Lightning Mode"
                    >
                      <span className="sr-only">Lightning Mode</span>
                      <Zap className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-blue-400" />
                      <span
                        className={`text-[0.6rem] sm:text-sm font-medium tracking-wide transition-all duration-500 font-dm-sans font-normal ${
                          activeMode === "lightning"
                            ? "opacity-100 block ml-0.5 sm:ml-2"
                            : "opacity-0 hidden"
                        }`}
                      >
                        <span className="hidden sm:inline">Lightning Mode</span>
                        <span className="sm:hidden">Lightning</span>
                      </span>
                    </button>
                    <button
                      onClick={() => handleModeChange("explore")}
                      className={`mode-toggle-button transition-all duration-500 ease-in-out cursor-pointer ${
                        activeMode === "explore"
                          ? "mode-active flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-4 py-1 sm:py-2"
                          : "mode-inactive w-5 h-5 sm:w-10 sm:h-10 flex items-center justify-center rounded-full"
                      }`}
                      title="Discover Mode - Regular AI Chat"
                    >
                      <span className="sr-only">Discover Mode</span>
                      <Search className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-blue-400" />
                      <span
                        className={`text-[0.6rem] sm:text-sm font-medium tracking-wide transition-all duration-500 font-dm-sans font-normal ${
                          activeMode === "explore"
                            ? "opacity-100 block ml-0.5 sm:ml-2"
                            : "opacity-0 hidden"
                        }`}
                      >
                        <span className="hidden sm:inline">Discover Mode</span>
                        <span className="sm:hidden">Discover</span>
                      </span>
                    </button>
                    <button
                      onClick={() => handleModeChange("focus")}
                      className={`mode-toggle-button transition-all duration-500 ease-in-out relative cursor-pointer ${
                        activeMode === "focus"
                          ? "mode-active flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-4 py-1 sm:py-2"
                          : "mode-inactive w-5 h-5 sm:w-10 sm:h-10 flex items-center justify-center rounded-full"
                      }`}
                      title="Focus Mode"
                    >
                      <span className="sr-only">Focus Mode</span>
                      <Target className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-blue-400" />
                      <span
                        className={`text-[0.6rem] sm:text-sm font-medium tracking-wide transition-all duration-500 font-dm-sans font-normal ${
                          activeMode === "focus"
                            ? "opacity-100 block ml-0.5 sm:ml-2"
                            : "opacity-0 hidden"
                        }`}
                      >
                        <span className="hidden sm:inline">Focus Mode</span>
                        <span className="sm:hidden">Focus</span>
                      </span>
                      {/* Backend Status Indicator for Focus Mode */}
                      {activeMode === "focus" &&
                        backendStatus.onboarding !== "idle" && (
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
                            <div
                              className={`backdrop-blur-sm rounded-full px-2 py-1 border text-xs font-medium ${
                                backendStatus.onboarding === "loading"
                                  ? "bg-blue-500/20 border-blue-400/30 text-blue-300"
                                  : backendStatus.onboarding === "success"
                                    ? "bg-green-500/20 border-green-400/30 text-green-300"
                                    : "bg-red-500/20 border-red-400/30 text-red-300"
                              }`}
                            >
                              {backendStatus.onboarding === "loading" && (
                              <span className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                <span>Saving...</span>
                              </span>
                            )}
                              {backendStatus.onboarding === "success" && (
                                <span>✓ Saved</span>
                              )}
                              {backendStatus.onboarding === "error" && (
                                <span>⚠ Error</span>
                              )}
                          </div>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => handleModeChange("research")}
                      className={`mode-toggle-button transition-all duration-500 ease-in-out cursor-pointer ${
                        activeMode === "research"
                          ? "mode-active flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-4 py-1 sm:py-2"
                          : "mode-inactive w-5 h-5 sm:w-10 sm:h-10 flex items-center justify-center rounded-full"
                      }`}
                      title="ResearchGPT Mode"
                    >
                      <span className="sr-only">ResearchGPT Mode</span>
                      <Atom className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-blue-400" />
                      <span
                        className={`text-[0.6rem] sm:text-sm font-medium tracking-wide transition-all duration-500 font-dm-sans font-normal ${
                          activeMode === "research"
                            ? "opacity-100 block ml-0.5 sm:ml-2"
                            : "opacity-0 hidden"
                        }`}
                      >
                        <span className="hidden sm:inline">ResearchGPT</span>
                        <span className="sm:hidden">Research</span>
                      </span>
                      {/* Research Flow Status Indicator */}
                      {activeMode === "research" && (
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
                          <div className="bg-purple-500/20 backdrop-blur-sm rounded-full px-2 py-1 border border-purple-400/30">
                            <span className="text-xs text-purple-300 font-medium">
                              {researchFlow.isAutoProcessing ? (
                                <span className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                  <span>Processing...</span>
                                </span>
                              ) : (
                                <span>
                                  {researchFlow.step === "normal_chat" &&
                                    "Ready"}
                                  {researchFlow.step === "context_research" &&
                                    "Company Info"}
                                  {researchFlow.step === "icp_check" &&
                                    "ICP Status"}
                                  {researchFlow.step === "icp_development" &&
                                    "Building ICP"}
                                  {researchFlow.step === "lead_generation" &&
                                    "Researching"}
                                  {researchFlow.step === "completed" &&
                                    "Complete"}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      className="w-5 h-5 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-2xl hover:bg-blue-400/10 transition-colors focus:outline-none border border-blue-400/20 cursor-pointer"
                      onClick={handleVoiceClick}
                      aria-label="Voice AI"
                      title="Voice AI"
                      style={{ display: 'none' }}
                    >
                      <AudioLines className="w-2.5 h-2.5 sm:w-5 sm:h-5 text-blue-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-2xl flex flex-col items-center space-y-2 sm:space-y-3 px-2 sm:px-0"></div>

          {/* Suggestion Buttons */}
          <div className="w-full flex flex-col items-center gap-2 sm:gap-3 -mt-4">
                <div className="flex flex-row flex-wrap gap-2 sm:gap-4 justify-center w-full">
                  {textSuggestions.slice(0, 4).map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex-shrink-0 px-2 py-1 sm:px-2.5 sm:py-2 lg:py-1.5 lg:px-2.5 rounded-md sm:rounded-lg glass-container bg-black/30 text-white font-semibold shadow-2xl transition-all duration-200 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60 cursor-pointer inline-flex"
                      style={{
                        boxShadow:
                          "0 8px 32px 0 rgba(31,38,135,0.18), 0 1.5px 0 rgba(59,130,246,0.08) inset",
                        backdropFilter: "blur(24px) saturate(1.2)",
                        WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <div className="flex flex-row flex-wrap gap-2 sm:gap-4 justify-center w-full">
                  {textSuggestions.slice(4).map((suggestion, idx) => (
                    <button
                      key={idx + 3}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex-shrink-0 px-2 py-1 sm:px-2.5 sm:py-2 lg:py-1.5 lg:px-2.5 rounded-md sm:rounded-lg glass-container bg-black/30 text-white font-semibold shadow-2xl transition-all duration-200 border border-blue-400/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60 cursor-pointer inline-flex"
                      style={{
                        boxShadow:
                          "0 8px 32px 0 rgba(31,38,135,0.18), 0 1.5px 0 rgba(59,130,246,0.08) inset",
                        backdropFilter: "blur(24px) saturate(1.2)",
                        WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                        fontSize: "1rem",
                        fontWeight: 600,
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              
            
              <button
                className="mt-6 sm:mt-8 px-3 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-blue-700/80 via-blue-500/70 to-blue-400/80 shadow-xl border border-blue-400/40 glass-container focus:outline-none focus:ring-2 focus:ring-blue-400/60 hover:scale-105 transition-all duration-200 cursor-pointer"
                style={{
                  boxShadow:
                    "0 8px 32px 0 rgba(31,38,135,0.18), 0 1.5px 0 rgba(59,130,246,0.08) inset",
                  backdropFilter: "blur(24px) saturate(1.2)",
                  WebkitBackdropFilter: "blur(24px) saturate(1.2)",
                  fontSize: "1.2rem",
                }}
                onClick={() => {
                  setHighlightModels(true);
                  setSidebarExtended(true);
                  setTimeout(() => setHighlightModels(false), 500);
                }}
              >
                Try our Industry Models
              </button>
              {sidebarExtended && (
                <div
                  className="fixed inset-0 z-40 cursor-pointer"
                  style={{ background: "transparent" }}
                  onClick={() => setSidebarExtended(false)}
                />
              )}
            </div>
          </div>
        ) : !isOnboardingMode && !isOnboardingChat ? (
          // NEW CHAT UI - Built from scratch with proper auto-scroll (ONLY when not in onboarding)
          <div className="flex-1 flex flex-col relative h-full">
            {/* Chat Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
            <div className="absolute inset-0 opacity-60">
              <div className="absolute inset-0 bg-grid animate-grid-smoke" />
              <div className="absolute inset-0 bg-grid-secondary animate-grid-smoke-reverse" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
            
            {/* Chat Messages Container - Fixed height with proper scrolling - Mobile Responsive */}
            <div 
              ref={chatContainerRef}
              onScroll={handleScroll}
              onWheel={(e) => {
                // Force wheel scrolling to work
                e.currentTarget.scrollTop += e.deltaY;
              }}
              className="flex-1 overflow-y-scroll overflow-x-hidden px-2 sm:px-3 py-3 sm:py-4 relative font-dm-sans custom-scrollbar"
              style={{ 
                height: "calc(100vh - 140px)", // Mobile: Header (56px) + Input area (84px)
                maxHeight: "calc(100vh - 140px)",
                paddingBottom: "0.8rem",
                scrollBehavior: "auto",
                WebkitOverflowScrolling: "touch",
                overscrollBehavior: "auto",
                willChange: "scroll-position",
                touchAction: "pan-y",
              }}
            >
              <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4 min-h-full">
                {/* Research Progress Indicator */}
                <ResearchProgress 
                  flowState={researchFlow} 
                  isVisible={activeMode === "research" && isAuthenticated}
                />
                
                {/* Research Mode Indicator removed to avoid transient banner */}

                {currentChat?.messages.map((message, index) => (
                    <div key={message.id} data-message-role={message.role}>
                      <ChatMessageComponent 
                        message={message}
                      isLatestMessage={
                        index === currentChat.messages.length - 1
                      }
                      isTyping={
                        (isTyping || isResearchLoading) &&
                        index === currentChat.messages.length - 1 &&
                        message.role === "assistant"
                      }
                      displayedResult={
                        (isTyping || isResearchLoading) &&
                        index === currentChat.messages.length - 1 &&
                        message.role === "assistant"
                          ? displayedResult
                          : message.content
                      }
                      isLoading={
                        isAILoading &&
                        index === currentChat.messages.length - 1 &&
                        message.role === "assistant"
                      }
                      isResearchLoading={isResearchLoading}
                      />
                    </div>
                ))}

                {/* Loading Indicator or Web Search Progress */}
                {isProcessing && (
                  <>
                    {/* Show web search progress when web search is triggered */}
                    {isWebSearchActive ? (
                      <InlineWebSearchProgress
                        isVisible={true}
                        steps={webSearchProgress.steps}
                        isSearching={isWebSearchActive}
                      />
                    ) : (
                      /* Default loading dots for other modes */
                      <div className="flex justify-start">
                        <div className="max-w-xl">
                          <div className="flex space-x-1.5 py-1.5">
                            {Array.from({ length: 3 }, (_, i) => (
                              <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce shadow-md"
                                style={{ animationDelay: `${i * 0.2}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Spacer to ensure content can scroll above input */}
                <div style={{ height: "20px" }} />
              </div>
            </div>
            
            {/* Scroll to Bottom Button - Black with white outline and icon - Mobile Responsive - Smaller on mobile */}
            {showScrollDown && (
              <button
                onClick={() => {
                  setShouldAutoScroll(true);
                  scrollToBottom(true);
                }}
                className="fixed bottom-16 sm:bottom-30 left-1/2 transform -translate-x-1/2 z-30 bg-black/90 hover:bg-black text-white p-1 sm:p-2 rounded-full shadow-lg transition-all border-2 border-white/60 hover:border-white hover:scale-110 backdrop-blur-sm w-6 h-6 sm:w-[38px] sm:h-[38px] cursor-pointer"
                aria-label="Scroll to bottom"
                style={{
                  boxShadow:
                    "0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(255, 255, 255, 0.1)",
                }}
              >
                <ChevronDown
                  size={12}
                  color="white"
                  className="sm:w-[18px] sm:h-[18px]"
                />
              </button>
            )}
          </div>
        ) : null}
      </main>
      {/* Fixed Input area at bottom - Mobile Responsive - Smaller on mobile */}
      {(recentPrompt || isOnboardingChat) && (
        <div className="fixed bottom-0 left-0 right-0 z-20 px-1 sm:px-3 py-1.5 sm:py-3 border-t border-blue-500/20 backdrop-blur-xl bg-black/40">
          <div className="max-w-3xl mx-auto">
            <div className="glass-container-chat rounded-full p-0.5 sm:p-1.5 flex items-center space-x-1 sm:space-x-2 shadow-lg border border-blue-400/30 ">
              <textarea
                ref={chatInputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  isOnboardingChat ? "Type your response..." : "Follow up..."
                }
                className="flex-1 bg-transparent text-xs sm:text-sm placeholder-gray-400 outline-none px-2 sm:px-3 py-1 sm:py-1.5 tracking-normal font-inter font-normal resize-none"
                rows={1}
                style={{
                  minHeight: "2.5em",
                  maxHeight: "6em",
                  overflow: "hidden",
                }}
              />
              {/* ResearchGPT Button */}
              <button
                onClick={() => {
                  if (input.trim()) {
                    // Show configuration modal
                    setShowResearchGPTConfig(true);
                  } else {
                    // Show error message if no input
                    addAIMessage(currentChatId, ` Please enter a research query in the input field before clicking "ResearchGPT".\n\n.`);
                  }
                }}
                className="research-button-chat p-1 sm:p-2 rounded-full text-sm transition-all duration-300 hover:scale-105 font-dm-sans font-normal cursor-pointer mr-1 sm:mr-2"
                disabled={isTyping || isOnboardingTyping}
                title="ResearchGPT Configuration"
              >
                <Atom className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              </button>
              
              <button
                onClick={handleSend}
                className="send-button-chat p-1 sm:p-2 rounded-full text-sm transition-all duration-300 hover:scale-105 font-dm-sans font-normal cursor-pointer"
                disabled={isTyping || isOnboardingTyping}
              >
                <Image
                  src="/rise.webp"
                  alt="Send"
                  width={12}
                  height={12}
                  className="object-contain sm:w-4 sm:h-4"
                ></Image>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Navigation Bar - Position changes based on chat mode - Hidden on mobile */}
      {recentPrompt || isOnboardingChat ? (
        // Vertical Dock for chat mode and onboarding - positioned on the right (desktop only)
        <div className="hidden sm:block fixed right-4 top-1/2 transform -translate-y-1/2 z-30">
          <VerticalDock 
            items={dockItems}
            panelWidth={68}
            baseItemSize={50}
            magnification={62}
          />
        </div>
      ) : (
        // Horizontal Dock for home page - positioned at bottom center (desktop only)
        <div className="hidden sm:block fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <Dock 
            items={dockItems}
            panelHeight={68}
            baseItemSize={50}
            magnification={70}
          />
        </div>
      )}
      {/* Footer - Hidden in chat mode and onboarding */}
      {!recentPrompt && !isOnboardingChat && (
        <footer className="relative z-10 p-6 border-t border-blue-500/30 backdrop-blur-xl bg-black/20 mt-auto">
          <p className="text-center text-sm text-blue-300 tracking-wider font-dm-sans font-normal">
            Powered by Sales Centri AI © 2025
          </p>
        </footer>
      )}
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/50">
          <div className="glass-container p-8 rounded-2xl max-w-md mx-4 border border-blue-400/30">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-400 tracking-wide font-poppins font-bold">
                Help
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="glass-button p-2 rounded-full text-xl hover:scale-110 transition-all font-dm-sans font-normal cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-gray-200 tracking-wide font-dm-sans font-normal"></div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowProfileModal(false)} // Close modal when clicking backdrop
        >
          <div 
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            
            {userProfile && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Name</label>
                  <div className="text-white">
                    {userProfile.user?.email?.split("@")[0] ||
                      userProfile.organization?.name ||
                      "User"}
                  </div>
                </div>
                
                {userProfile.user?.email && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email</label>
                    <div className="text-white">{userProfile.user.email}</div>
                  </div>
                )}
                
                {userProfile.organization?.name && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Organization
                    </label>
                    <div className="text-white">
                      {userProfile.organization.name}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 mt-6 border-t border-gray-700">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Query Limit Gate Modal */}
      <QueryLimitGate 
        isOpen={showQueryLimitGate}
        onClose={() => setShowQueryLimitGate(false)}
      />
      
      {/* ResearchGPT Gate Modal */}
      {/* ResearchGPT Gate - Only show for guest users, never for logged-in users */}
      {!isAuthenticated && (
        <ResearchGPTGate 
          isOpen={showResearchGPTGate}
          onClose={() => setShowResearchGPTGate(false)}
        />
      )}
      
      {/* Research Configuration Modal */}
      {showResearchConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-60">
          <div className="bg-gradient-to-b from-gray-900 via-black to-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-white border border-blue-500/10 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowResearchConfig(false);
                setIsChatResearch(false);
                if (!isChatResearch) {
                  setActiveMode("lightning");
                  setShowHyperspeed(true);
                  setHasPrompted(false);
                }
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-white text-lg font-semibold mb-4">
              {isChatResearch ? 'ResearchGPT - Current Chat' : 'ResearchGPT Configuration'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm">Research Category</label>
                <select 
                  value={researchConfig.category} 
                  onChange={(e) => setResearchConfig(prev => ({...prev, category: e.target.value}))}
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded border border-gray-600"
                >
                  <option value="sales_opportunities">Sales Opportunities</option>
                  <option value="competitive_analysis">Competitive Analysis</option>
                  <option value="market_research">Market Research</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Research Depth</label>
                <select 
                  value={researchConfig.depth} 
                  onChange={(e) => setResearchConfig(prev => ({...prev, depth: e.target.value}))}
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded border border-gray-600"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Timeframe</label>
                <select 
                  value={researchConfig.timeframe} 
                  onChange={(e) => setResearchConfig(prev => ({...prev, timeframe: e.target.value}))}
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded border border-gray-600"
                >
                  <option value="1M">1 Month</option>
                  <option value="3M">3 Months</option>
                  <option value="6M">6 Months</option>
                  <option value="1Y">1 Year</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm">Geographic Scope</label>
                <select 
                  value={researchConfig.geoScope} 
                  onChange={(e) => setResearchConfig(prev => ({...prev, geoScope: e.target.value}))}
                  className="w-full mt-1 p-2 bg-gray-800 text-white rounded border border-gray-600"
                >
                  <option value="Local">Local</option>
                  <option value="Regional">Regional</option>
                  <option value="National">National</option>
                  <option value="Global">Global</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={researchConfig.useWebSearch} 
                  onChange={(e) => setResearchConfig(prev => ({...prev, useWebSearch: e.target.checked}))}
                  className="mr-2"
                />
                <label className="text-gray-300 text-sm">Enable Web Search</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                onClick={() => {
                  setShowResearchConfig(false);
                  setIsChatResearch(false);
                  if (!isChatResearch) {
                    setActiveMode("lightning");
                    setShowHyperspeed(true);
                    setHasPrompted(false);
                  }
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button 
                onClick={handleResearchConfigConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                {isChatResearch ? 'Research in Current Chat' : 'Start ResearchGPT'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ResearchGPT Configuration Modal */}
      <ResearchGPTConfigModal />
    </div>
  );
};

// Global functions for Lightning Mode button clicks will be defined inside the component

// Default export for Next.js page routing
export default SalesConsultantUI;
