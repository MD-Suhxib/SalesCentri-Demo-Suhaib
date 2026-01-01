import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Settings2, Zap, Target, AudioLines, Atom, Upload, Search, Globe, Microscope, X, Bot, Gem, Sparkles } from "lucide-react";
import LightRays from "../blocks/Backgrounds/LightRays/LightRays";
import GlobalStyles from "../solutions/psa-suite-one-stop-solution/GlobalStyles";
import styles from "./HomepageSalesGPT.module.css";
import { canMakeQuery, incrementQueryCount } from "../lib/queryLimit";
import { QueryLimitGate } from "./QueryLimitGate";
import { VideoModal } from "./VideoModal";
import { VideoPreview } from "./VideoPreview";
import { useStreamingResearch } from "../hooks/useStreamingResearch";
import { useWebSearchProgress } from "../hooks/useWebSearchProgress";
import InlineWebSearchProgress from "./InlineWebSearchProgress";
import { ResearchProgress } from "./ResearchProgress";
import ResearchGPTTableRenderer from "./ResearchGPTTableRenderer";
import { hasTableContent } from "../lib/contentParser";

import { validateAuthenticationAsync } from "../lib/auth";
import { chatApi } from "../lib/chatApi";
import { useLightningMode } from "../hooks/useLightningMode";
import { parseLightningModeInput, validateLightningModeInputs } from "../lib/lightningModeInputParser";
import { LightningInputs } from "../types/lightningMode";

// Define TrackerApi interface
interface TrackerApi {
  trackEvent: (eventName: string, eventData?: Record<string, unknown>) => void;
}

// Define TrackerApi interface
interface TrackerApi {
  trackEvent: (eventName: string, eventData?: Record<string, unknown>) => void;
}

const MemoizedLightRaysBackground = React.memo(
  function MemoizedLightRaysBackground() {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      // Lazy load LightRays after component mounts
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
      <div className={styles.pointerEventsNone}>
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

const HomepageSalesGPT: React.FC = () => {
  // ResearchGPT Modal State
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResults, setResearchResults] = useState<{
    gpt4o: string | null;
    gemini: string | null;
    perplexity: string | null;
  }>({ gpt4o: null, gemini: null, perplexity: null });
  const [isResearching, setIsResearching] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Research hooks
  const { isStreaming, sources, result, error: streamingError, startStreamingResearch, stopStreaming } = useStreamingResearch();
  const webSearchProgress = useWebSearchProgress();

  // Helper to send tracker events, gated by localhost
  type TrackerWindow = Window & {
    tracker?: {
      trackEvent: (eventName: string, eventData: Record<string, unknown>) => void;
    };
  };

  const sendTrackerEvent = (eventName: string, eventData: Record<string, unknown> = {}) => {
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      const w = window as TrackerWindow;
      if (w.tracker?.trackEvent) {
        w.tracker.trackEvent(eventName, eventData);
      }
    }
  };

  // Track landing page to PSA navigation
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      // Listen for navigation to PSA
      const handlePSANav = (e: MouseEvent) => {
        const target = e.target as HTMLAnchorElement;
        if (target?.href && target.href.includes("psa-suite-one-stop-solution")) {
          sendTrackerEvent("landing_to_psa", { from: window.location.pathname });
        }
      };
      document.addEventListener("click", handlePSANav, true);
      return () => document.removeEventListener("click", handlePSANav, true);
    }
    return undefined;
  }, []);

  // Track query submissions for Query 1, 2, 3
  const handleQuerySubmit = (queryLabel: string) => {
    sendTrackerEvent(`${queryLabel}_submitted`, { input });
  };

  // Track query limit reached
  const handleQueryLimitReached = () => {
    sendTrackerEvent("query_limit_reached", { input });
  };

  // Track redirect to login
  const handleRedirectToLogin = () => {
    sendTrackerEvent("redirect_to_login", { from: window.location.pathname });
  };

  // Track redirect to dashboard
  const handleRedirectToDashboard = () => {
    sendTrackerEvent("redirect_to_dashboard", { from: window.location.pathname });
  };

  // Track redirect from login (token present and valid)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.includes("dashboard") && window.location.search.includes("token")) {
      // Validate token via /profile endpoint
      fetch("/profile", { credentials: "include" })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.user) {
            sendTrackerEvent("redirect_from_login", { token: window.location.search, user: data.user });
          }
        })
        .catch(() => {});
    }
  }, []);

  // Restore researchGPT state from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedQuery = localStorage.getItem('researchGPTQuery');
      const savedResults = localStorage.getItem('researchGPTResults');
      const modalOpen = localStorage.getItem('researchGPTModalOpen');
      
      if (savedQuery && modalOpen === 'true') {
        setResearchQuery(savedQuery);
        setShowResearchModal(true);
        
        if (savedResults) {
          try {
            const results = JSON.parse(savedResults);
            setResearchResults(results);
          } catch (error) {
            console.error('Error parsing saved research results:', error);
          }
        }
      }
    }
  }, []);

  // ResearchGPT Functions
  const handleResearchGPT = async (query: string) => {
    if (!query.trim()) return;
    
    setResearchQuery(query);
    setShowResearchModal(true);
    setResearchError(null);
    setResearchResults({ gpt4o: null, gemini: null, perplexity: null });
    
    // Save research query to localStorage for persistence
    localStorage.setItem('researchGPTQuery', query);
    localStorage.setItem('researchGPTModalOpen', 'true');
    
    // Start research with pre-configured settings
    await startResearch(query);
  };

  const startResearch = async (query: string) => {
    setIsResearching(true);
    
    try {
      // Call the multi-research-ai API with pre-configured settings for market research
      const response = await fetch('/api/multi-research-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          category: 'market_analysis',
          depth: 'comprehensive',
          timeframe: '1Y',
          geographic_scope: 'Global',
          web_search_enabled: true,
          selected_models: {
            gpt4o: true,
            gemini: true,
            perplexity: true
          },
          deep_research: true,
          include_founders: true,
          include_products: true,
          analyze_sales_opportunities: true,
          include_tabular_data: true,
          extract_company_info: true,
          analyze_prospective_clients: true,
          include_employee_count: true,
          include_revenue_data: true,
          include_complete_urls: true
        })
      });

      if (!response.ok) {
        throw new Error(`Research failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("🔍 Homepage ResearchGPT API Response:", data);
      
      const results = {
        gpt4o: data.gpt4o || null,
        gemini: data.gemini || null,
        perplexity: data.perplexity || null
      };
      
      setResearchResults(results);
      
      // Save results to localStorage for persistence
      localStorage.setItem('researchGPTResults', JSON.stringify(results));
      
      // Log any errors for debugging
      if (data.errors) {
        console.error("ResearchGPT API Errors:", data.errors);
      }
    } catch (error) {
      console.error('ResearchGPT error:', error);
      setResearchError(error instanceof Error ? error.message : 'Research failed');
    } finally {
      setIsResearching(false);
    }
  };

  const closeResearchModal = () => {
    setShowResearchModal(false);
    setResearchQuery('');
    setResearchResults({ gpt4o: null, gemini: null, perplexity: null });
    setResearchError(null);
    setIsResearching(false);
    
    // Clear localStorage when modal is closed
    localStorage.removeItem('researchGPTQuery');
    localStorage.removeItem('researchGPTResults');
    localStorage.removeItem('researchGPTModalOpen');
  };
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputRows, setInputRows] = useState(1);
  useEffect(() => {
    // Responsive character count per row based on screen size
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const charsPerRow = isMobile ? 30 : 80; // Fewer characters per row on mobile
    const maxRows = isMobile ? 5 : 6; // Fewer max rows on mobile
    const minRows = isMobile ? 3 : 1; // At least 3 rows on mobile for better placeholder visibility
    
    const rows = Math.min(
      maxRows,
      Math.max(minRows, Math.ceil(input.length / charsPerRow))
    );
    setInputRows(rows);
  }, [input]);
  const [activeMode, setActiveMode] = useState<
    "lightning" | "focus" | "research" | "brain" | "explore"
  >("lightning");
  
  // Debug: Log activeMode changes
  useEffect(() => {
    console.log('🔍 activeMode changed to:', activeMode);
  }, [activeMode]);
  
  // Lightning Mode hook
  const lightningMode = useLightningMode();
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // New state for hover
  const [isPaused, setIsPaused] = useState(false); // New state for pause control
  const [showTextOverlay, setShowTextOverlay] = useState(false); // New state for text overlay
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Track if auth check is complete
  const [showQueryLimitGate, setShowQueryLimitGate] = useState(false); // Query limit gate state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  
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
  
  // Video modal and preview states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const previewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Lightning Mode video modal and preview states
  const [showLightningVideoModal, setShowLightningVideoModal] = useState(false);
  const [showLightningVideoPreview, setShowLightningVideoPreview] = useState(false);
  const [lightningPreviewPosition, setLightningPreviewPosition] = useState({ x: 0, y: 0 });
  const lightningPreviewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // ResearchGPT video modal and preview states
  const [showResearchVideoModal, setShowResearchVideoModal] = useState(false);
  const [showResearchVideoPreview, setShowResearchVideoPreview] = useState(false);
  const [researchPreviewPosition, setResearchPreviewPosition] = useState({ x: 0, y: 0 });
  const researchPreviewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      question: "What’s your monthly spend on lead generation/customer acquisition?",
      response: "My monthly spend on lead generation is :"
    },
    {
      question: "What’s your monthly lead generation target?",
      response: "My monthly lead generation target is :"
    }
  ];

  // Rotate placeholder text with an extended stay for the first prompt
  useEffect(() => {
    if (input.length > 0 || isHovered || isPaused) return; // Stop transition if user is typing, text is present, hovered, or paused

    const baseDelay = 1500;
    const extraDelayForWebsitePrompt = currentPlaceholder === 0 ? 7000 : 0;
    let animationTimeout: NodeJS.Timeout | null = null;

    const rotationTimeout = setTimeout(() => {
      setIsAnimating(true);
      animationTimeout = setTimeout(() => {
        setCurrentPlaceholder(
          (prev: number) => (prev + 1) % placeholderQuestions.length
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
  }, [placeholderQuestions.length, input.length, isHovered, isPaused, currentPlaceholder]);

  // Suggestion buttons array (now supports two rows)
  const textSuggestions: string[] = [
    "Create my ICP list",
"Generate leads",
"Identify target audience",
"Start campaign",
"Verify my list",
"Enrich my list",
"Leads from healthcare companies",
  ];

  // Animated subtitle messages
  const subtitleMessages = [
    "The Only AI-Powered Sales Search Engine",
    "Delivering Intelligent Insights and Real-Time Solutions",
    "Not Just Recommendations or Options, the Complete Solution",
  ];
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const [subtitleBlink, setSubtitleBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleBlink(true);
      setTimeout(() => {
        setSubtitleIndex((prev) => (prev + 1) % subtitleMessages.length);
        setSubtitleBlink(false);
      }, 1200); // blink duration (slower) 1.2 seconds
    }, 6000); // interval between subtitle changes (slower) 6 seconds
    return () => clearInterval(interval);
  }, [subtitleMessages.length]);

  // Show text overlay permanently when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTextOverlay(true);
    }, 1000); // Start after 1 second

    return () => clearTimeout(timer);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authResult = await validateAuthenticationAsync();
        setIsAuthenticated(authResult.isAuthenticated);
        setIsAuthChecked(true);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setIsAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Video preview management functions
  const showPreview = (e: React.MouseEvent) => {
    // Only show preview on desktop (not mobile)
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (previewTimeoutRef.current) {
        clearTimeout(previewTimeoutRef.current);
      }
      setPreviewPosition({ x: e.clientX, y: e.clientY });
      setShowVideoPreview(true);
    }
  };

  const hidePreviewWithDelay = () => {
    // Only hide preview on desktop
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      previewTimeoutRef.current = setTimeout(() => {
        setShowVideoPreview(false);
      }, 300); // 300ms delay to allow moving to preview
    }
  };

  const cancelHidePreview = () => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  };
  
  // Lightning Mode video preview management functions
  const showLightningPreview = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (lightningPreviewTimeoutRef.current) {
        clearTimeout(lightningPreviewTimeoutRef.current);
      }
      setLightningPreviewPosition({ x: e.clientX, y: e.clientY });
      setShowLightningVideoPreview(true);
    }
  };

  const hideLightningPreviewWithDelay = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      lightningPreviewTimeoutRef.current = setTimeout(() => {
        setShowLightningVideoPreview(false);
      }, 300);
    }
  };

  const cancelHideLightningPreview = () => {
    if (lightningPreviewTimeoutRef.current) {
      clearTimeout(lightningPreviewTimeoutRef.current);
      lightningPreviewTimeoutRef.current = null;
    }
  };
  
  // ResearchGPT video preview management functions
  const showResearchPreview = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      if (researchPreviewTimeoutRef.current) {
        clearTimeout(researchPreviewTimeoutRef.current);
      }
      setResearchPreviewPosition({ x: e.clientX, y: e.clientY });
      setShowResearchVideoPreview(true);
    }
  };

  const hideResearchPreviewWithDelay = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      researchPreviewTimeoutRef.current = setTimeout(() => {
        setShowResearchVideoPreview(false);
      }, 300);
    }
  };

  const cancelHideResearchPreview = () => {
    if (researchPreviewTimeoutRef.current) {
      clearTimeout(researchPreviewTimeoutRef.current);
      researchPreviewTimeoutRef.current = null;
    }
  };

  // Handle focus mode click - always redirect to PSA with focus mode (no chat creation)
  const handleFocusModeClick = async () => {
    console.log('🔍 Focus Mode button clicked, redirecting to PSA with focus mode');
    
    // Track Focus mode activation
    try {
      const w = window as unknown as {
        tracker?: TrackerApi;
        salescentriTrackerReady?: boolean;
      };
      const fire = () =>
        w.tracker?.trackEvent &&
        w.tracker.trackEvent("focus_mode_activated", {
          from: "homepage",
          query: input.substring(0, 100)
        });
      if (w.salescentriTrackerReady) fire();
      else setTimeout(fire, 200);
    } catch {}
    // Always redirect to PSA homepage and set focus mode
    localStorage.setItem("activeModePSA", "focus");
    window.location.href = `/solutions/psa-suite-one-stop-solution`;
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
            source: "homepage",
            fileType: fileExtension,
            fileName: file.name,
            fileSize: file.size,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        alert('Please upload a valid file (.xlsx, .xls, .csv, .pdf)');
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Add specific text for certain suggestions
    let modifiedSuggestion = suggestion;
    
    // First 4 suggestions: add "for my company. Website: "
    if (["Create my ICP list", "Generate leads", "Identify target audience", "Start campaign"].includes(suggestion)) {
      modifiedSuggestion = `${suggestion} for my company. Website: `;
    }
    // Last 2 suggestions: add "for my company. Website: "
    else if (["Leads from healthcare companies", "Generate leads for Oil & gas"].includes(suggestion)) {
      modifiedSuggestion = `${suggestion} for my company. Website: `;
    }
    // "Verify my list" and "Enrich my list" remain unchanged
    
    setInput(modifiedSuggestion);
    
    // Track Query 1, 2, 3 if suggestion matches
    if (["Train a Sales Rep", "Increase conversions", "Write an email"].includes(suggestion)) {
      const idx = ["Train a Sales Rep", "Increase conversions", "Write an email"].indexOf(suggestion) + 1;
      handleQuerySubmit(`query_${idx}`);
    }
    try {
      const w = window as unknown as {
        tracker?: TrackerApi;
        salescentriTrackerReady?: boolean;
      };
      const fire = () =>
        w.tracker?.trackEvent &&
        w.tracker.trackEvent("salesgpt_suggestion_click", { suggestion });
      if (w.salescentriTrackerReady) fire();
      else setTimeout(fire, 200);
    } catch {}
  };



  // Function to handle placeholder click and type response
  const handlePlaceholderClick = (index: number, setInput: (val: string) => void) => {
    const response = placeholderQuestions[index].response;
    setInput("");
    let i = 0;
    const typeChar = () => {
      if (i <= response.length) {
        setInput(response.slice(0, i));
        i++;
        setTimeout(typeChar, 18);
      }
    };
    typeChar();
  };

  // Placeholder click logic: only for desktop (sm and up)
  const handlePlaceholderClickDesktop = () => {
    if (typeof window !== "undefined" ) {
      if (input.length === 0) {
        const response = placeholderQuestions[currentPlaceholder].response;
        setInput("");
        setIsPaused(true);
        let i = 0;
        const typeChar = () => {
          if (i <= response.length) {
            setInput(response.slice(0, i));
            i++;
            setTimeout(typeChar, 18);
          }
        };
        typeChar();
        try {
          const w = window as unknown as {
            tracker?: TrackerApi;
            salescentriTrackerReady?: boolean;
          };
          const fire = () =>
            w.tracker?.trackEvent &&
            w.tracker.trackEvent("salesgpt_placeholder_click", {
              placeholder: placeholderQuestions[currentPlaceholder].question,
            });
          if (w.salescentriTrackerReady) fire();
          else setTimeout(fire, 200);
        } catch {}
      }
    }
  };

  // Reset pause when input is cleared
  useEffect(() => {
    if (input.length === 0) {
      setIsPaused(false);
    }
  }, [input]);

  // Chat creation and redirect logic
  const handleSearchSubmit = async () => {
    if (!input.trim() || isSubmitting) return;

    // Check query limit for unauthenticated users
    if (!isAuthenticated && !canMakeQuery()) {
      setShowQueryLimitGate(true);
      return;
    }
    console.log('🔍 handleSearchSubmit called:', {
      input: input.substring(0, 50) + '...',
      activeMode,
      isSubmitting
    });
    
    // Debug: Log the current activeMode state
    console.log('🔍 Current activeMode state:', activeMode);
    console.log('🔍 Type of activeMode:', typeof activeMode);
    
    if (!input.trim() || isSubmitting) return;

    // Query limit disabled - users can make unlimited queries

    // Track SalesGPT submission
    try {
      const w = window as unknown as {
        tracker?: TrackerApi;
        salescentriTrackerReady?: boolean;
      };
      const fire = () =>
        w.tracker?.trackEvent &&
        w.tracker.trackEvent("salesgpt_submission", {
          input_length: input.length,
          active_mode: activeMode,
        });
      if (w.salescentriTrackerReady) fire();
      else setTimeout(fire, 200);
    } catch {}

    setIsSubmitting(true);
    
    try {
      // Debug: Ensure we have the correct activeMode
      console.log('🔍 About to process submission, activeMode:', activeMode);
      
      // Validate activeMode to prevent double processing
      if (activeMode !== "lightning" && activeMode !== "research" && activeMode !== "focus" && activeMode !== "brain" && activeMode !== "explore") {
        console.error('🔍 Invalid activeMode:', activeMode);
        setIsSubmitting(false);
        return;
      }
      
      // Check if Lightning Mode is active - handle Lightning Mode directly
      if (activeMode === "lightning") {
        console.log('🔍 Processing as Lightning Mode');
        console.log('🔍 Lightning Mode processing started - blocking other modes');
        // Parse input to extract structured data
        const parsedInputs = parseLightningModeInput(input);
        const validation = validateLightningModeInputs(parsedInputs);
        // Best-effort: even if validation fails, proceed with minimal input so Lightning can start on PSA
        const inputsForLightning = validation.isValid
          ? parsedInputs
          : { input: input.trim() } as any;
        
        // Get tracker anon_id from localStorage
        const trackerAnonId = localStorage.getItem('tracker_anon_id');
        console.log('🔍 Retrieved tracker_anon_id from localStorage:', trackerAnonId);
        
        // Add tracker anon_id to parsed inputs
        if (trackerAnonId) {
          parsedInputs.userId = trackerAnonId;
          parsedInputs.anonymousUserId = trackerAnonId;
          console.log('🔍 Added tracker_anon_id to parsedInputs:', parsedInputs);
        }
        
        // Create chat and redirect to PSA with lightning mode data
        try {
          const chat = await chatApi.createChat("Lightning Mode Chat", "lightning");
          
          if (!chat || !chat.id) {
            throw new Error("Failed to create chat. Please try again.");
          }
          
          // Store lightning mode data for the PSA chat
          localStorage.setItem("lightningModeData", JSON.stringify({
            chatId: chat.id,
            inputs: inputsForLightning,
            step: 'entry',
            timestamp: Date.now()
          }));
          
          // Redirect to PSA chat page
          window.location.href = `/solutions/psa-suite-one-stop-solution/c/${chat.id}`;
          
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to create chat');
        }
        
        setIsSubmitting(false);
        return;
      }
      
      // Check if research mode is active - handle ResearchGPT directly
      if (activeMode === "research") {
        console.log('🔍 Processing as ResearchGPT Mode');
        console.log('🔍 ResearchGPT Mode processing started - blocking other modes');
        console.log('🔍 Homepage: ResearchGPT mode detected, input:', input);
        
        // Track ResearchGPT chat creation
        try {
          const w = window as unknown as {
            tracker?: TrackerApi;
            salescentriTrackerReady?: boolean;
          };
          const fire = () =>
            w.tracker?.trackEvent &&
            w.tracker.trackEvent("researchgpt_chat_created", {
              from: "homepage",
              query: input.substring(0, 100)
            });
          if (w.salescentriTrackerReady) fire();
          else setTimeout(fire, 200);
        } catch {}

        // Create normal chat with research mode metadata
        const inferredTitle = input && input.trim().length > 0 ? input.trim().slice(0, 40) : "ResearchGPT Chat";
        const chat = await chatApi.createChat(inferredTitle, "research");
        
        if (chat && chat.id) {
          // Store research metadata for PSA page
          localStorage.setItem("researchMeta", JSON.stringify({
            chatId: chat.id,
            query: input,
            mode: "research",
            isFirstMessage: true
          }));
          
          // Store user input in localStorage for retrieval in chat page
          localStorage.setItem(
            "pendingChatMessage",
            JSON.stringify({
              chatId: chat.id,
              message: input,
              timestamp: Date.now(),
            })
          );
          
          // Redirect to PSA chat page
          window.location.href = `/solutions/psa-suite-one-stop-solution/c/${chat.id}`;
          return;
        } else {
          alert("Failed to create chat. Please try again.");
          return;
        }
      }

      // Check if Explore mode is active - handle regular chat with AI
      if (activeMode === "explore" || activeMode === "focus" || activeMode === "brain") {
        console.log('🔍 Processing as Explore/Focus/Brain Mode - Regular AI Chat');
        
        // Track Explore chat creation
        try {
          const w = window as unknown as {
            tracker?: TrackerApi;
            salescentriTrackerReady?: boolean;
          };
          const fire = () =>
            w.tracker?.trackEvent &&
            w.tracker.trackEvent("explore_chat_created", {
              from: "homepage",
              mode: activeMode,
              query: input.substring(0, 100)
            });
          if (w.salescentriTrackerReady) fire();
          else setTimeout(fire, 200);
        } catch {}

        // Create normal chat with explore mode
        const inferredTitle = input && input.trim().length > 0 ? input.trim().slice(0, 40) : "SalesGPT Chat";
        const chat = await chatApi.createChat(inferredTitle, activeMode);

        if (chat && chat.id) {
          // Store user input in localStorage for retrieval in chat page
          localStorage.setItem(
            "pendingChatMessage",
            JSON.stringify({
              chatId: chat.id,
              message: input,
              timestamp: Date.now(),
            })
          );
          
          // Track redirect to dashboard
          handleRedirectToDashboard();
          
          // Redirect to PSA chat page
          window.location.href = `/solutions/psa-suite-one-stop-solution/c/${chat.id}`;
          return;
        } else {
          alert("Failed to create chat. Please try again.");
          return;
        }
      }

      // Fallback for any unhandled mode
      console.warn('🔍 Unhandled mode, falling back to default chat creation');
      const inferredTitle = input && input.trim().length > 0 ? input.trim().slice(0, 40) : "SalesGPT Chat";
      const chat = await chatApi.createChat(inferredTitle);

      if (chat && chat.id) {
        localStorage.setItem(
          "pendingChatMessage",
          JSON.stringify({
            chatId: chat.id,
            message: input,
            timestamp: Date.now(),
          })
        );
        handleRedirectToDashboard();
        window.location.href = `/solutions/psa-suite-one-stop-solution/c/${chat.id}`;
      } else {
        alert("Failed to create chat. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit on Enter, newline on Shift+Enter
  const handleTextareaKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  return (
    <>
      <GlobalStyles />



      <section
        className="relative w-full bg-black text-white"
        style={{
          minHeight: "100vh",
          transform: "scale(0.8)",
          transformOrigin: "top center",
        }}
        id="salesgpt-section"
      >
        {/* Background: Light Rays - CRITICAL: pointer-events: none */}
        <div
          className="absolute inset-0 z-0 w-full h-full"
          style={{ pointerEvents: "none" }}
        >
          <MemoizedLightRaysBackground />
        </div>

        {/* Main Content - CRITICAL: Allow pointer events */}
        <div className="relative z-10 px-3 sm:px-6 pt-24 sm:pt-32 lg:pt-24 pb-20 sm:pb-26 lg:pb-16 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-10 lg:space-y-8">
          {/* Title and Description - Mobile Responsive */}
          <div className="space-y-3 sm:space-y-4 flex flex-col items-center text-center font-poppins font-semibold">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-mediumbold text-blue-400 drop-shadow-2xl tracking-wide font-poppins text-center">
              SalesGPT
            </div>
            <p
              className={`text-base sm:text-lg md:text-xl lg:text-xl tracking-wide text-center px-4 font-dm-sans font-normal transition-all duration-400 ${subtitleBlink ? "opacity-0" : "opacity-100"} text-blue-200`}
              style={{ minHeight: "2.5em" }}
            >
              {subtitleMessages[subtitleIndex]}
            </p>
          </div>

          {/* Main Input Container */}
          <div className="w-full max-w-4xl lg:max-w-3xl relative px-2 sm:px-0 mb-10 sm:mb-12">
            <form
              className="glass-container rounded-2xl sm:rounded-3xl p-2 sm:p-3 lg:p-3 flex flex-col items-stretch shadow-2xl border border-blue-400/30 relative w-full max-w-4xl lg:max-w-3xl mx-auto"
              style={{ pointerEvents: "auto" }}
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                handleSearchSubmit();
              }}
            >
              {/* Top row: Search input and send button - Mobile Responsive */}
              <div className="flex items-center w-full space-x-2 sm:space-x-4 lg:space-x-3 cursor-pointer">
                <div
                  className="flex-1 relative cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={handlePlaceholderClickDesktop}
                >
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleTextareaKeyDown}
                    placeholder={placeholderQuestions[currentPlaceholder].question}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    rows={inputRows}
                    className={`w-full bg-transparent text-sm sm:text-lg lg:text-[1.12rem] placeholder-gray-400 outline-none px-3 sm:px-3 py-4 sm:py-2 tracking-wide transition-all duration-600 font-inter font-medium resize-none ${
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
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.6 : 1,
                      minHeight: `${inputRows * (typeof window !== "undefined" && window.innerWidth < 640 ? 2.2 : 1.7)}em`,
                      maxHeight: "20em",
                      borderRadius: "0.6em",
                      resize: "none",
                      overflow: "hidden",
                      lineHeight: typeof window !== "undefined" && window.innerWidth < 640 ? "1.5" : "1.5"
                    }}
                  />
                </div>

                {/* Text Overlay */}
                <div className="relative">
                  {showTextOverlay && (
                    <div
                      className="absolute bottom-full mb-4 z-15 animate-fade-in-up"
                      style={{ right: "-75%" }}
                    >
                      <div className="relative">
                        {/* Desktop version */}
                        <div className="hidden sm:block bg-black/80 backdrop-blur-md rounded-lg px-1 py-1 shadow-xl border border-blue-400/50 animate-pulse">
                          <span className="text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text font-medium text-xs whitespace-nowrap">
                            💭 Generate your first 10 leads now
                          </span>
                        </div>
                        
                        </div>
                        {/* Thought bubble tail */}
                        <div className="hidden sm:block absolute top-full right-2 w-2 h-2 bg-black/80 backdrop-blur-md rounded-full border border-blue-400/30 animate-pulse"></div>
                        <div className="hidden sm:block absolute top-full right-4 mt-1 w-1.5 h-1.5 bg-black/80 backdrop-blur-md rounded-full border border-blue-400/30 animate-pulse"></div>
                        <div className="hidden sm:block absolute top-full right-6 mt-2 w-1 h-1 bg-black/80 backdrop-blur-md rounded-full border border-blue-400/30 animate-pulse"></div>
                        {/* Mobile version */}
                        <div className="sm:hidden bg-black/80 backdrop-blur-md rounded-lg px-1 py-1 shadow-xl border border-blue-400/50 animate-pulse absolute -top-8 -left-5 transform -translate-x-1/2">
                          <span className="text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text font-small text-[11px] whitespace-nowrap">
                            💭 Generate leads now
                          </span>
                          {/* Mobile thought bubble tail */}
                          <div className="absolute bottom-0 right-10 transform translate-y-full">
                            <div className="w-1.5 h-1.5 bg-black/80 rounded-full border border-blue-400/50 mb-0.5"></div>
                            <div className="w-1 h-1 bg-black/80 rounded-full border border-blue-400/50 mr-2"></div>
                          </div>
                      </div>
                      
                    </div>
                  )}

                  <button
                    className="send-button p-2 sm:p-3 lg:p-2.5 rounded-full text-lg sm:text-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
                    style={{
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Submit sales question"
                  >
                    {isSubmitting ? (
                      <span className="loader w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Image
                        src="/rise.webp"
                        alt="Send"
                        width={18}
                        height={18}
                        className="object-contain sm:w-[22px] sm:h-[22px]"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom row: Tools on left, mode controls on right - Mobile Responsive */}
              <div className="flex flex-row w-full mt-1.5 sm:mt-2 justify-between items-center">
                {/* Left side: Tools button - Mobile Responsive - Smaller on mobile */}
                <div ref={toolsDropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setShowToolsDropdown((v) => !v)}
                    title="Open Tools Menu"
                    className="w-6 h-6 sm:w-10 sm:h-10 lg:w-9 lg:h-9 flex items-center justify-center rounded-lg sm:rounded-2xl hover:bg-blue-400/10 transition-colors focus:outline-none border border-blue-400/20"
                    style={{
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    disabled={isSubmitting}
                  >
                    <Settings2 className="w-3 h-3 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-blue-400" />
                  </button>
                  {showToolsDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 w-44 sm:w-52 bg-black/95 border border-blue-400/30 rounded-xl shadow-2xl z-50 flex flex-col animate-fade-in-up max-h-80 overflow-y-auto">
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            setSelectedToolMode('lightning');
                            setShowToolsDropdown(false);
                            setActiveMode("lightning");
                            lightningMode.activateLightningMode();
                          }}
                          title="Switch to Lightning Mode"
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
                            setActiveMode("focus");
                          }}
                        >
                          <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                          <span className="font-medium">Focus</span>
                        </button>
                        
                        <button 
                          className={`w-full flex items-center px-2 sm:px-2.5 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-200 rounded-lg ${
                            selectedToolMode === 'discover' 
                              ? 'text-blue-400 bg-blue-400/10 border border-blue-400/30' 
                              : 'text-blue-200 hover:bg-blue-400/10'
                          }`}
                          onClick={() => {
                            setSelectedToolMode('discover');
                            setShowToolsDropdown(false);
                            setActiveMode("explore");
                          }}
                        >
                          <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" />
                          <span className="font-medium">Discover</span>
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        setSelectedToolMode('research');
                        setShowToolsDropdown(false);
                        setActiveMode("research");
                      }}
                      title="Research Mode"
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
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side: Mode buttons - Mobile Responsive - Smaller on mobile */}
                <div className="flex items-center space-x-1 sm:space-x-3 lg:space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Only enable the mode, don't open video modal
                      console.log('🔍 Lightning Mode button clicked, current activeMode:', activeMode);
                      setActiveMode("lightning");
                      lightningMode.activateLightningMode();
                      console.log('🔍 Lightning Mode set to:', "lightning");
                    }}
                    onMouseEnter={showLightningPreview}
                    onMouseLeave={hideLightningPreviewWithDelay}
                    onMouseMove={(e) => {
                      // Only update position on desktop
                      if (typeof window !== "undefined" && window.innerWidth >= 768) {
                        setLightningPreviewPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    className={`mode-toggle-button transition-all duration-500 ease-in-out cursor-pointer ${
                      activeMode === "lightning"
                        ? "mode-active flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-4 lg:px-3 py-1 sm:py-2 lg:py-1.5"
                        : "mode-inactive w-6 h-6 sm:w-10 sm:h-10 lg:w-9 lg:h-9 flex items-center justify-center rounded-full"
                    }`}
                    style={{
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    disabled={isSubmitting}
                    title="Lightning Mode"
                  >
                    <span className="sr-only">Lightning Mode</span>
                    <Zap className="w-3 h-3 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-blue-400" />
                    <span
                      className={`text-[0.6rem] sm:text-sm lg:text-[0.85rem] font-medium tracking-wide transition-all duration-500 font-dm-sans font-normal ${
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      console.log('🔍 Explore Mode button clicked, current activeMode:', activeMode);
                      setActiveMode("explore");
                      console.log('🔍 Explore Mode set to:', "explore");
                    }}
                    className={`mode-toggle-button transition-all duration-500 ease-in-out cursor-pointer ${
                      activeMode === "explore"
                        ? "mode-active flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-4 lg:px-3 py-1 sm:py-2 lg:py-1.5"
                        : "mode-inactive w-6 h-6 sm:w-10 sm:h-10 lg:w-9 lg:h-9 flex items-center justify-center rounded-full"
                    }`}
                    style={{
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    disabled={isSubmitting}
                    title="Discover Mode - Regular AI Chat"
                  >
                    <span className="sr-only">Discover Mode</span>
                    <Search className="w-3 h-3 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-blue-400" />
                    <span
                      className={`text-[0.6rem] sm:text-sm lg:text-[0.85rem] font-medium tracking-wide transition-all duration-500 font-dm-sans font-normal ${
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFocusModeClick();
                    }}
                    onMouseEnter={showPreview}
                    onMouseLeave={hidePreviewWithDelay}
                    onMouseMove={(e) => {
                      // Only update position on desktop
                      if (typeof window !== "undefined" && window.innerWidth >= 768) {
                        setPreviewPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    className={`mode-toggle-button transition-all duration-500 ease-in-out relative cursor-pointer ${
                      activeMode === "focus"
                        ? "mode-active flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-4 lg:px-3 py-1 sm:py-2 lg:py-1.5"
                        : "mode-inactive w-6 h-6 sm:w-10 sm:h-10 lg:w-9 lg:h-9 flex items-center justify-center rounded-full"
                    }`}
                    style={{
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    disabled={isSubmitting}
                    title="Focus Mode"
                  >
                    <span className="sr-only">Focus Mode</span>
                    <Target className="w-3 h-3 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-blue-400" />
                    <span
                      className={`text-[0.6rem] sm:text-sm lg:text-[0.85rem] font-medium tracking-wide transition-all duration-500 font-dm-sans font-normal ${
                        activeMode === "focus"
                          ? "opacity-100 block ml-0.5 sm:ml-2"
                          : "opacity-0 hidden"
                      }`}
                    >
                      <span className="hidden sm:inline">Focus Mode</span>
                      <span className="sm:hidden">Focus</span>
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Only enable the mode, don't open video modal
                      console.log('🔍 ResearchGPT button clicked, preventing double triggers');
                      console.log('🔍 Setting activeMode to research, previous value:', activeMode);
                      
                      // Ensure we're setting the mode correctly
                      setActiveMode("research");
                      
                      // Verify the mode was set correctly
                      setTimeout(() => {
                        console.log('🔍 activeMode after setting to research:', activeMode);
                      }, 100);
                      try {
                        const w = window as unknown as {
                          tracker?: TrackerApi;
                          salescentriTrackerReady?: boolean;
                        };
                        const fire = () =>
                          w.tracker?.trackEvent &&
                          w.tracker.trackEvent("research_mode_modal", {
                            from: "homepage",
                            query: input.substring(0, 100),
                          });
                        if (w.salescentriTrackerReady) fire();
                        else setTimeout(fire, 200);
                      } catch {}

                      // ResearchGPT mode - handled by handleSearchSubmit function
                      // No redirect needed, will be processed in handleSearchSubmit
                    }}
                    onMouseEnter={showResearchPreview}
                    onMouseLeave={hideResearchPreviewWithDelay}
                    onMouseMove={(e) => {
                      // Only update position on desktop
                      if (typeof window !== "undefined" && window.innerWidth >= 768) {
                        setResearchPreviewPosition({ x: e.clientX, y: e.clientY });
                      }
                    }}
                    className={`mode-toggle-button transition-all duration-500 ease-in-out cursor-pointer ${
                      activeMode === "research"
                        ? "mode-active flex items-center space-x-1 sm:space-x-2 px-1.5 sm:px-4 lg:px-3 py-1 sm:py-2 lg:py-1.5"
                        : "mode-inactive w-6 h-6 sm:w-10 sm:h-10 lg:w-9 lg:h-9 flex items-center justify-center rounded-full"
                    }`}
                    style={{
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    disabled={isSubmitting}
                    title="ResearchGPT Mode"
                  >
                    <span className="sr-only">ResearchGPT Mode</span>
                    <Atom className="w-3 h-3 sm:w-5 sm:h-5 lg:w-4 lg:h-4 object-contain text-blue-400" />
                    <span
                      className={`text-[0.6rem] sm:text-sm lg:text-[0.85rem] font-medium tracking-wide transition-all duration-500 font-dm-sans font-normal ${
                        activeMode === "research"
                          ? "opacity-100 block ml-0.5 sm:ml-2"
                          : "opacity-0 hidden"
                      }`}
                    >
                      <span className="hidden sm:inline">ResearchGPT</span>
                      <span className="sm:hidden">Research</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="w-6 h-6 sm:w-10 sm:h-10 lg:w-9 lg:h-9 flex items-center justify-center rounded-lg sm:rounded-2xl hover:bg-blue-400/10 transition-colors focus:outline-none border border-blue-400/20 cursor-pointer"
                    aria-label="Voice AI"
                    style={{
                      pointerEvents: isSubmitting ? "none" : "auto",
                      opacity: isSubmitting ? 0.6 : 1,
                      display: 'none',
                    }}
                    disabled={isSubmitting}
                    title="Voice AI"
                  >
                    <AudioLines className="w-3 h-3 sm:w-5 sm:h-5 lg:w-4 lg:h-4 text-blue-400" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="w-full max-w-2xl flex flex-col items-center space-y-2 sm:space-y-3 px-2 sm:px-0"></div>

          {/* Suggestion Buttons */}
          <div className="w-full flex flex-col items-center gap-2 sm:gap-3">
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
                        fontSize: "1rem",
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
              </div>
              </div>

        {/* Scroll Down CTA - Moved to the bottom */}
        <div className="w-full flex justify-center mt-1 mb-2">
          <button
            className="scroll-cta group flex flex-col items-center justify-center gap-1 px-5 py-3 rounded-xl bg-black/70 hover:bg-black/90 transition-all duration-300 shadow-lg cursor-pointer"
            style={{
              color: "white",
              fontWeight: 500,
              fontSize: "1rem",
              letterSpacing: "0.02em",
            }}
            onClick={() => {
              const nextSection = document.querySelector(".video-section");
              if (nextSection) {
                nextSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          >
            <span className="text-white/70 text-md font-normal mb-2">
              Discover more
            </span>
            <span className="relative flex items-center justify-center">
              <Image
                src="/arrow-down.webp"
                alt="Scroll Down"
                width={28}
                height={28}
                className="animate-bounce object-contain"
              />
            </span>
          </button>
        </div>
      </section>

      {/* Query Limit Gate */}
      <QueryLimitGate 
        isOpen={showQueryLimitGate}
        onClose={() => setShowQueryLimitGate(false)}
      />

      {/* Focus Mode Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoSrc="https://cdn.salescentri.com/focus-mode-demo-video-h264.mp4"
        title="Focus Mode Demo"
      />

      {/* Focus Mode Video Preview - Only show on desktop */}
      <VideoPreview
        isVisible={showVideoPreview && typeof window !== "undefined" && window.innerWidth >= 768}
        videoSrc="https://cdn.salescentri.com/focus-mode-demo-video-h264.mp4"
        position={previewPosition}
        title="Focus Mode Preview"
        onVideoClick={() => {
          setShowVideoPreview(false);
          setShowVideoModal(true);
        }}
        onMouseEnter={cancelHidePreview}
        onMouseLeave={hidePreviewWithDelay}
      />

      {/* Lightning Mode Video Modal */}
      <VideoModal
        isOpen={showLightningVideoModal}
        onClose={() => setShowLightningVideoModal(false)}
        videoSrc="https://cdn.salescentri.com/lightning-mode-demo-video-h264.mp4"
        title="Lightning Mode Demo"
      />

      {/* Lightning Mode Video Preview - Only show on desktop */}
      <VideoPreview
        isVisible={showLightningVideoPreview && typeof window !== "undefined" && window.innerWidth >= 768}
        videoSrc="https://cdn.salescentri.com/lightning-mode-demo-video-h264.mp4"
        position={lightningPreviewPosition}
        title="Lightning Mode Preview"
        onVideoClick={() => {
          setShowLightningVideoPreview(false);
          setShowLightningVideoModal(true);
        }}
        onMouseEnter={cancelHideLightningPreview}
        onMouseLeave={hideLightningPreviewWithDelay}
      />

      {/* ResearchGPT Video Modal */}
      <VideoModal
        isOpen={showResearchVideoModal}
        onClose={() => setShowResearchVideoModal(false)}
        videoSrc="https://cdn.salescentri.com/research-gpt-demo-video-h264.mp4"
        title="ResearchGPT Demo"
      />

      {/* ResearchGPT Video Preview - Only show on desktop */}
      <VideoPreview
        isVisible={showResearchVideoPreview && typeof window !== "undefined" && window.innerWidth >= 768}
        videoSrc="https://cdn.salescentri.com/research-gpt-demo-video-h264.mp4"
        position={researchPreviewPosition}
        title="ResearchGPT Preview"
        onVideoClick={() => {
          setShowResearchVideoPreview(false);
          setShowResearchVideoModal(true);
        }}
        onMouseEnter={cancelHideResearchPreview}
        onMouseLeave={hideResearchPreviewWithDelay}
      />

      {/* ResearchGPT Modal */}
      {showResearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-60">
          <div className="bg-gradient-to-b from-gray-900 via-black to-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 text-white border border-blue-500/10 relative max-h-[90vh] overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeResearchModal}
              title="Close Research Modal"
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X size={24} />
            </button>
            
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">ResearchGPT Analysis</h3>
                  <p className="text-gray-400 text-sm">Market Research: {researchQuery}</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {isResearching ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-300 text-lg">Analyzing market data...</p>
                  <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                </div>
              ) : researchError ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-400" />
                  </div>
                  <h4 className="text-red-400 text-lg font-semibold mb-2">Research Failed</h4>
                  <p className="text-gray-400">{researchError}</p>
                  <button
                    onClick={() => startResearch(researchQuery)}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (researchResults.gpt4o || researchResults.gemini || researchResults.perplexity) ? (
                <div className="space-y-6">
                  {/* GPT-4O Results */}
                  {researchResults.gpt4o && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center space-x-2 mb-3">
                        <Bot className="w-5 h-5 text-blue-400" />
                        <h4 className="font-semibold text-blue-400">GPT-4O Analysis</h4>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: researchResults.gpt4o.replace(/\n/g, '<br>') }} />
                      </div>
                    </div>
                  )}
                  
                  {/* Gemini Results */}
                  {researchResults.gemini && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center space-x-2 mb-3">
                        <Gem className="w-5 h-5 text-green-400" />
                        <h4 className="font-semibold text-green-400">Gemini Analysis</h4>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        {hasTableContent(researchResults.gemini) ? (
                          <ResearchGPTTableRenderer markdown={researchResults.gemini} hideTopToolbar={true} />
                        ) : (
                          <div dangerouslySetInnerHTML={{ __html: researchResults.gemini.replace(/\n/g, '<br>') }} />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Perplexity Results */}
                  {researchResults.perplexity && (
                    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <h4 className="font-semibold text-purple-400">Perplexity Analysis</h4>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: researchResults.perplexity.replace(/\n/g, '<br>') }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Microscope className="w-8 h-8 text-blue-400" />
                  </div>
                  <h4 className="text-blue-400 text-lg font-semibold mb-2">Ready to Research</h4>
                  <p className="text-gray-400">Click the ResearchGPT button to start your market analysis</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-700 bg-gray-900/50">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Powered by GPT-4O, Gemini, and Perplexity AI
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={closeResearchModal}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  {(researchResults.gpt4o || researchResults.gemini || researchResults.perplexity) && (
                    <>
                      <button
                        onClick={() => {
                          const allResults = `ResearchGPT Analysis: ${researchQuery}\n\n${researchResults.gpt4o ? `GPT-4O:\n${researchResults.gpt4o}\n\n` : ''}${researchResults.gemini ? `Gemini:\n${researchResults.gemini}\n\n` : ''}${researchResults.perplexity ? `Perplexity:\n${researchResults.perplexity}\n\n` : ''}`;
                          navigator.clipboard.writeText(allResults);
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                      >
                        Copy Results
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            // Import the PDF export function
                            const { exportMultipleConversationsToPdf } = await import('@/app/lib/robustPdfExporter');
                            
                            // Create conversations array from research results
                            const conversations = [];
                            
                            if (researchResults.gpt4o) {
                              conversations.push({
                                userQuery: researchQuery,
                                botResponse: `GPT-4O Analysis:\n\n${researchResults.gpt4o}`,
                                timestamp: new Date().toISOString()
                              });
                            }
                            
                            if (researchResults.gemini) {
                              conversations.push({
                                userQuery: researchQuery,
                                botResponse: `Gemini Analysis:\n\n${researchResults.gemini}`,
                                timestamp: new Date().toISOString()
                              });
                            }
                            
                            if (researchResults.perplexity) {
                              conversations.push({
                                userQuery: researchQuery,
                                botResponse: `Perplexity Analysis:\n\n${researchResults.perplexity}`,
                                timestamp: new Date().toISOString()
                              });
                            }
                            
                            // Export to PDF
                            await exportMultipleConversationsToPdf(
                              conversations,
                              `researchgpt_${researchQuery.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`
                            );
                          } catch (error) {
                            console.error('Error exporting to PDF:', error);
                            alert('Failed to export PDF. Please try again.');
                          }
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Export PDF</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomepageSalesGPT;
