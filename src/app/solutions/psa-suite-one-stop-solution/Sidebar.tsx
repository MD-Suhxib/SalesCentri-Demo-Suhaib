// Custom scrollbar styles for chat history scroll area
import './SidebarScrollbar.css';
import React, { useEffect, useRef, useState } from 'react';
import { Cpu, History, Plus, CirclePlus, Trash2, ChevronDown, ChevronRight, Pin, PinOff, Calendar, Users, Briefcase, Crown, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { Banknote, Building2, Stethoscope, ShoppingCart } from 'lucide-react';

// Main categories with 3-layer structure (legacy fallback)
const mainCategories = [
  {
    id: 'industry',
    name: 'Industry',
    icon: <Building2 size={20} />,
    expanded: false,
    useCases: [
      {
        id: 'fintech',
        name: 'Fintech',
        icon: <Banknote size={18} />,
        expanded: false,
    prompts: [
      'Generate banking & credit union lead lists by geography',
      'Find C-level executives at financial services companies',
      'Identify fintech startups seeking funding or partnerships',
      'Create compliance-focused prospect lists for financial software',
      'Build targeted lists of payment processing decision makers'
    ]
  },
  { 
        id: 'realestate',
        name: 'Real Estate',
        icon: <Building2 size={18} />,
        expanded: false,
    prompts: [
      'Generate commercial real estate investor contact lists',
      'Find property management company decision makers',
      'Identify real estate agents and brokers by market',
      'Create lists of construction company executives',
      'Build targeted lists of real estate technology buyers'
    ]
  },
  { 
        id: 'healthcare',
        name: 'Healthcare',
        icon: <Stethoscope size={18} />,
        expanded: false,
    prompts: [
      'Generate hospital and clinic administrator contact lists',
      'Find healthcare IT decision makers and CTOs',
      'Identify medical device company procurement teams',
      'Create lists of healthcare compliance officers',
      'Build targeted lists of telemedicine platform buyers'
    ]
  },
  { 
        id: 'technology',
        name: 'Technology',
        icon: <Cpu size={18} />,
        expanded: false,
    prompts: [
      'Generate enterprise software buyer contact lists',
      'Find CTOs and IT directors at tech companies',
      'Identify SaaS companies seeking integrations',
      'Create lists of technology procurement managers',
      'Build targeted lists of cloud migration decision makers'
    ]
  },
  { 
        id: 'ecommerce',
        name: 'E-commerce',
        icon: <ShoppingCart size={18} />,
        expanded: false,
    prompts: [
      'Generate online retailer and marketplace contact lists',
      'Find e-commerce platform decision makers',
      'Identify digital marketing agency executives',
      'Create lists of supply chain and logistics managers',
      'Build targeted lists of e-commerce technology buyers'
        ]
      }
    ]
  },
  {
    id: 'events',
    name: 'Events',
    icon: <Calendar size={20} />,
    expanded: false,
    useCases: [
      {
        id: 'conferences',
        name: 'Conferences',
        icon: <Calendar size={18} />,
        expanded: false,
        prompts: [
          'Find attendees from tech conferences in your industry',
          'Identify speakers and panelists from relevant events',
          'Generate lists of conference sponsors and exhibitors',
          'Create targeted lists of event organizers and planners',
          'Build contact lists of networking event participants'
        ]
      },
      {
        id: 'webinars',
        name: 'Webinars',
        icon: <Calendar size={18} />,
        expanded: false,
        prompts: [
          'Find webinar attendees in your target market',
          'Identify webinar hosts and moderators',
          'Generate lists of webinar sponsors and partners',
          'Create targeted lists of online event participants',
          'Build contact lists of virtual conference attendees'
        ]
      }
    ]
  },
  {
    id: 'agency',
    name: 'Agency & Marketer',
    icon: <Briefcase size={20} />,
    expanded: false,
    useCases: [
      {
        id: 'marketing_agencies',
        name: 'Marketing Agencies',
        icon: <Briefcase size={18} />,
        expanded: false,
        prompts: [
          'Find digital marketing agency decision makers',
          'Identify creative directors and account managers',
          'Generate lists of PR and communications agencies',
          'Create targeted lists of social media marketing firms',
          'Build contact lists of advertising agency executives'
        ]
      },
      {
        id: 'consultants',
        name: 'Consultants',
        icon: <Users size={18} />,
        expanded: false,
        prompts: [
          'Find business consultants in your industry',
          'Identify management consulting firm partners',
          'Generate lists of independent marketing consultants',
          'Create targeted lists of strategy consultants',
          'Build contact lists of industry-specific advisors'
        ]
      }
    ]
  },
  {
    id: 'founders',
    name: 'Founders & CEOs',
    icon: <Crown size={20} />,
    expanded: false,
    useCases: [
      {
        id: 'startup_founders',
        name: 'Startup Founders',
        icon: <Crown size={18} />,
        expanded: false,
        prompts: [
          'Find startup founders in your target industry',
          'Identify serial entrepreneurs and investors',
          'Generate lists of early-stage company CEOs',
          'Create targeted lists of startup accelerator participants',
          'Build contact lists of venture-backed founders'
        ]
      },
      {
        id: 'enterprise_ceos',
        name: 'Enterprise CEOs',
        icon: <Crown size={18} />,
        expanded: false,
        prompts: [
          'Find Fortune 500 CEO contact information',
          'Identify mid-market company executives',
          'Generate lists of family business owners',
          'Create targeted lists of public company leaders',
          'Build contact lists of industry association presidents'
        ]
      }
    ]
  }
];

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
}

interface SidebarProps {
  highlightModels?: boolean;
  extended?: boolean;
  setExtended?: (v: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
  chatSessions?: ChatSession[];
  currentChatId?: string | null;
  onNewChat?: () => void;
  onSwitchChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
  onPromptClick?: (prompt: string) => void;
  onPromptWithWebsite?: (prompt: string | { visible: string; backend: string }) => void;
  customPrompts?: { title: string; text: string }[];
  onAddCustomPrompt?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  highlightModels, 
  extended: controlledExtended, 
  setExtended: setControlledExtended,
  mobileOpen: controlledMobileOpen,
  setMobileOpen: setControlledMobileOpen,
  chatSessions = [],
  currentChatId,
  onNewChat,
  onSwitchChat,
  onDeleteChat,
  onPromptClick,
  onPromptWithWebsite,
  customPrompts = [],
  onAddCustomPrompt
}) => {
  const [uncontrolledExtended, setUncontrolledExtended] = useState(false);
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] = useState(false);
  const mobileOpen = typeof controlledMobileOpen === 'boolean' ? controlledMobileOpen : uncontrolledMobileOpen;
  const setMobileOpen = setControlledMobileOpen ? setControlledMobileOpen : setUncontrolledMobileOpen;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<{ id: string; title: string } | null>(null);
  const extended = typeof controlledExtended === 'boolean' ? controlledExtended : uncontrolledExtended;
  const setExtended = setControlledExtended ? setControlledExtended : setUncontrolledExtended;
  const [isPinned, setIsPinned] = useState(false);
  const [categories, setCategories] = useState(mainCategories);
  const [loadingMenu, setLoadingMenu] = useState<boolean>(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [hoveredPrompt, setHoveredPrompt] = useState<string | null>(null);
  const [visibleChatsCount, setVisibleChatsCount] = useState(8); // Default to show 8 chats
  const modelsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [customExpanded, setCustomExpanded] = useState(false);

  // Build a backend prompt that is richer than the visible one
  const buildBackendPrompt = (useCaseName: string, visiblePrompt: string): string => {
    return `You are a senior B2B ${useCaseName} lead generation expert at SalesCentri. Your task is to generate highly targeted, verified leads based on the client's website context and the goal implied by: "${visiblePrompt}".\n\nInstructions:\n- Understand the client's ICP from their website (industry, size, product, buyer).\n- Find decision-makers (titles: CEO, Founder, VP, Head, Director) relevant to ${useCaseName}.\n- Include company name, role, LinkedIn URL, company URL, location, and short reason.\n- Prioritize recent funding, hiring, technology fit, or compliance needs where applicable.\n- Keep it actionable and deduplicated.\n\nOutput: A concise, bulleted list suitable for outbound. Website: `;
  };

  // Map icon names from API to Lucide components
  const iconMap: Record<string, React.ReactElement> = {
    Building2: <Building2 size={18} />,
    Banknote: <Banknote size={18} />,
    Stethoscope: <Stethoscope size={18} />,
    ShoppingCart: <ShoppingCart size={18} />,
    Cpu: <Cpu size={18} />,
    Calendar: <Calendar size={18} />,
    Users: <Users size={18} />,
    Briefcase: <Briefcase size={18} />,
    Crown: <Crown size={18} />,
  };

  // Fetch PSA menu from backend (admin-configured)
  useEffect(() => {
    let aborted = false;
    const fetchMenu = async () => {
      try {
        setLoadingMenu(true);
        setMenuError(null);
        const res = await fetch('https://app.demandintellect.com/app/api/psa-menu.php', { method: 'GET' });
        if (!res.ok) throw new Error(`Menu API failed: ${res.status}`);
        const json = await res.json();
        if (!json?.success || !json?.data?.sidebarCategories) throw new Error('Invalid menu payload');
        if (aborted) return;
        // Transform API to internal categories structure with expanded flags
        const apiCategories = json.data.sidebarCategories
          .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
          .map((cat: any) => ({
            id: String(cat.id),
            name: String(cat.name),
            icon: iconMap[String(cat.icon)] || <Building2 size={18} />,
            expanded: false,
            useCases: (cat.useCases || []).map((uc: any) => ({
              id: String(uc.id),
              name: String(uc.name),
              icon: iconMap[String(uc.icon)] || <Briefcase size={18} />,
              expanded: false,
              // Flatten sections/prompts into a render-ready shape
              sections: (uc.sections || []).map((sec: any) => ({
                title: String(sec.title),
                prompts: (sec.prompts || []).map((p: any) => ({
                  visible: String(p.visible_prompt || p.text || ''),
                  backend: String(p.backend_prompt || ''),
                })),
              })),
            })),
          }));
        setCategories(apiCategories);
      } catch (e: any) {
        if (!aborted) setMenuError(e?.message || 'Failed to load menu');
      } finally {
        if (!aborted) setLoadingMenu(false);
      }
    };
    fetchMenu();
    return () => {
      aborted = true;
    };
  }, []);

  const handleSidebarWheel = (e: React.WheelEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop += e.deltaY;
    e.preventDefault();
    e.stopPropagation();
  };

  React.useEffect(() => {
    if (highlightModels && modelsRef.current) {
      setExtended(true);
      setTimeout(() => {
        modelsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [highlightModels, setExtended]);

  const handleDeleteChat = (e: React.MouseEvent, chatId: string, chatTitle: string) => {
    e.stopPropagation(); // Prevent triggering the chat switch
    setChatToDelete({ id: chatId, title: chatTitle });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (chatToDelete && onDeleteChat) {
      onDeleteChat(chatToDelete.id);
    }
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
  };

  // Handle category expansion
  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, expanded: !cat.expanded }
        : cat
    ));
  };

  // Handle use case expansion
  const toggleUseCase = (categoryId: string, useCaseId: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? {
            ...cat,
            useCases: cat.useCases.map(uc => 
              uc.id === useCaseId 
                ? { ...uc, expanded: !uc.expanded }
                : uc
            )
          }
        : cat
    ));
  };

  // Handle prompt click
  const handlePromptClick = (prompt: string) => {
    if (onPromptClick) {
      onPromptClick(prompt);
    }
  };

  // Toggle pin state
  const togglePin = () => {
    setIsPinned(!isPinned);
  };

  // Handle loading more chats
  const loadMoreChats = () => {
    setVisibleChatsCount(prev => prev + 8);
  };

  // Get visible chats based on current count
  const visibleChats = chatSessions.slice(0, visibleChatsCount);
  const hasMoreChats = chatSessions.length > visibleChatsCount;

  return (
    <>
      {/* Desktop Sidebar - Responsive */}
      <aside
        className={`hidden sm:flex fixed top-0 left-0 z-60 h-full flex-col bg-black/95 backdrop-blur-sm border-r border-blue-400/10 shadow-lg transition-all duration-300 overflow-visible ${extended ? 'w-64 lg:w-72' : 'w-16 lg:w-16'} ${isPinned ? 'w-64 lg:w-72' : ''}`}
        onMouseEnter={() => !isPinned && setExtended(true)}
        onMouseLeave={() => !isPinned && setExtended(false)}
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem' }}
      >
        {/* Header with Logo and Controls */}
        <div className="flex items-center justify-between px-3 lg:px-4 py-3 lg:py-4 border-b border-blue-400/10">
          {extended || isPinned ? (
            <>
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <Image
                  src="/saleslogo.webp"
                  alt="Sales Centri"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                
                <span className="text-lg font-semibold">
                  <span className="text-white">Sales</span>
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent ml-1">Centri</span>
                </span>
              </div>
              {/* Pin and Close buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePin}
                  className="p-1.5 rounded-lg hover:bg-blue-400/10 transition-colors"
                  title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
                >
                  {isPinned ? <PinOff size={16} className="text-blue-400" /> : <Pin size={16} className="text-blue-400" />}
                </button>
          <button
            onClick={() => setExtended(false)}
                  className="p-1.5 rounded-lg hover:bg-blue-400/10 transition-colors"
                  title="Close sidebar"
          >
            <Image
              src="/sidebar.webp"
                    alt="Close sidebar"
                    width={16}
                    height={16}
                    className="text-blue-300"
                  />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setExtended(true)}
              className="p-1 rounded-lg hover:bg-blue-400/10 transition-colors"
              title="Open sidebar"
            >
              <Image
                src="/sidebar.webp"
                alt="Open sidebar"
                width={48}
                height={48}
                className="object-contain"
            />
          </button>
          )}
        </div>

        {/* Content container - hidden when not extended */}
        {(extended || isPinned) && (
          <div
            ref={scrollContainerRef}
            onWheel={handleSidebarWheel}
            className="flex-grow overflow-y-auto custom-scrollbar"
            style={{ overscrollBehavior: 'contain', touchAction: 'pan-y' }}
          >
            <div className="transition-transform duration-300 ease-in-out translate-x-0">
              {/* 3-Layer Structure */}
              <div className="flex flex-col px-3 lg:px-4 pt-3 lg:pt-4" ref={modelsRef}>
                <div className="text-[0.75rem] lg:text-[0.8rem] text-blue-300 font-semibold mb-3">Industry Models & More</div>
                
                {/* Categories */}
                <div className="flex flex-col gap-1">
                  {categories.map((category) => (
                    <div key={category.id} className="relative">
                      {/* Category Level 1 */}
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 bg-black/30 border border-transparent text-white hover:bg-blue-950/30 focus:outline-none"
                        style={{ fontSize: '0.85rem', minHeight: 40 }}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-blue-400">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        {category.expanded ? <ChevronDown size={16} className="text-blue-400" /> : <ChevronRight size={16} className="text-blue-400" />}
                      </button>
                      
                      {/* Use Cases Level 2 */}
                      {category.expanded && (
                        <div className="ml-4 mt-1 space-y-1">
                          {category.useCases.map((useCase) => (
                            <div key={useCase.id} className="relative">
                              <button
                                onClick={() => toggleUseCase(category.id, useCase.id)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 bg-black/20 border border-transparent text-gray-300 hover:bg-blue-950/20 focus:outline-none"
                                style={{ fontSize: '0.8rem', minHeight: 36 }}
                              >
                                <div className="flex items-center space-x-2">
                                  <span className="text-blue-300">{useCase.icon}</span>
                                  <span className="font-medium">{useCase.name}</span>
                                </div>
                                {useCase.expanded ? <ChevronDown size={14} className="text-blue-300" /> : <ChevronRight size={14} className="text-blue-300" />}
                              </button>

                              {/* Prompts Level 3 */}
                              {useCase.expanded && (
                                <div className="ml-4 mt-1">
                                  {/* If admin-provided sections exist, render them; else render legacy split */}
                                  {(useCase as any).sections && Array.isArray((useCase as any).sections) && (useCase as any).sections.length > 0 ? (
                                    <div className="space-y-2">
                                      {(useCase as any).sections.map((sec: any, sIdx: number) => (
                                        <div key={`${useCase.id}-sec-${sIdx}`} className="rounded-lg border border-blue-400/20 bg-black/10 p-2 space-y-2">
                                          <div className="px-2 text-[0.7rem] text-blue-300/90 font-semibold rounded-md border border-blue-400/20 inline-block bg-black/20 w-fit">{sec.title || 'Section'}</div>
                                          {(sec.prompts || []).map((pp: any, pIdx: number) => (
                                            <button
                                              key={`${useCase.id}-sp-${pIdx}`}
                                              onClick={() => {
                                                if (onPromptWithWebsite) {
                                                  const visible = String(pp.visible || pp.visible_prompt || '');
                                                  const backend = String(pp.backend || pp.backend_prompt || buildBackendPrompt(useCase.name, visible));
                                                  onPromptWithWebsite({ visible, backend });
                                                } else {
                                                  handlePromptClick(String(pp.visible || pp.visible_prompt || ''));
                                                }
                                              }}
                                              className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 bg-black/10 border border-transparent text-gray-400 hover:bg-blue-950/10 hover:text-blue-200 focus:outline-none overflow-hidden"
                                              style={{ fontSize: '0.75rem', minHeight: 32 }}
                                            >
                                              <div className="flex items-start space-x-2 overflow-hidden">
                                                <span className="text-blue-400 mt-0.5">•</span>
                                                <span className="leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>{String(pp.visible || pp.visible_prompt || '')}</span>
                                              </div>
                                            </button>
                                          ))}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="rounded-lg border border-blue-400/20 bg-black/10 p-2 space-y-2">
                                      {/* Legacy rendering fallback */}
                                      <div className="px-2 text-[0.7rem] text-blue-300/90 font-semibold rounded-md border border-blue-400/20 inline-block bg-black/20">Frequently used</div>
                                      {useCase.prompts.slice(0,3).map((prompt, promptIdx) => (
                                        <button
                                          key={promptIdx}
                                          onClick={() => {
                                            if (onPromptWithWebsite) {
                                              const visible = prompt;
                                              const backend = buildBackendPrompt(useCase.name, visible);
                                              onPromptWithWebsite({ visible, backend });
                                            } else {
                                              handlePromptClick(prompt);
                                            }
                                          }}
                                          onMouseEnter={() => setHoveredPrompt(`${category.id}-${useCase.id}-${promptIdx}`)}
                                          onMouseLeave={() => setHoveredPrompt(null)}
                                          className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 bg-black/10 border border-transparent text-gray-400 hover:bg-blue-950/10 hover:text-blue-200 focus:outline-none overflow-hidden"
                                          style={{ fontSize: '0.75rem', minHeight: 32 }}
                                        >
                                          <div className="flex items-start space-x-2 overflow-hidden">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span className="leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>{prompt}</span>
                                          </div>
                                        </button>
                                      ))}
                                      <div className="px-2 pt-1 mt-0.5 border-t border-blue-400/10 text-[0.7rem] text-blue-300/90 font-semibold rounded-md border border-blue-400/20 inline-block bg-black/20 w-fit">Predefined</div>
                                      {[
                                        `Top 10 ${useCase.name.replace(/s$/, '')} leads for outbound outreach`,
                                        `Decision-makers in ${useCase.name} with recent funding`,
                                        `Companies in ${useCase.name} adopting new tech`
                                      ].map((p, i) => (
                                        <button
                                          key={`pre-${i}`}
                                          onClick={() => {
                                            if (onPromptWithWebsite) {
                                              const visible = p;
                                              const backend = buildBackendPrompt(useCase.name, visible);
                                              onPromptWithWebsite({ visible, backend });
                                            } else {
                                              handlePromptClick(p);
                                            }
                                          }}
                                          className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 bg-black/10 border border-transparent text-gray-400 hover:bg-blue-950/10 hover:text-blue-200 focus:outline-none overflow-hidden"
                                          style={{ fontSize: '0.75rem', minHeight: 32 }}
                                        >
                                          <div className="flex items-start space-x-2 overflow-hidden">
                                            <span className="text-blue-400 mt-0.5">•</span>
                                            <span className="leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>{p}</span>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Universal  Prompts under Industry Models */}
                  <div className="relative -mt-1">
                    <button
                      onClick={() => setCustomExpanded(!customExpanded)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 bg-black/30 border border-transparent text-white hover:bg-blue-950/30 focus:outline-none"
                      style={{ fontSize: '0.85rem', minHeight: 40 }}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400"><CirclePlus size={18} /></span>
                        <span className="font-medium">Custom Models</span>
                      </div>
                      {customExpanded ? <ChevronDown size={16} className="text-blue-400" /> : <ChevronRight size={16} className="text-blue-400" />}
                    </button>
                    {customExpanded && (
                      <div className="ml-4 mt-1">
                        <div className="rounded-lg border border-blue-400/20 bg-black/10 p-2 space-y-2">
                          <div className="flex items-center justify-between px-2">
                            <div className="text-[0.75rem] text-blue-300/90 font-semibold">Your prompts</div>
                            <button
                              onClick={() => {
                                if (onAddCustomPrompt) onAddCustomPrompt();
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[0.7rem] transition-colors shadow-sm"
                              title="Add custom prompt"
                            >
                              <CirclePlus className="w-3.5 h-3.5" />
                              Add
                            </button>
                          </div>
                          {customPrompts && customPrompts.length > 0 ? (
                            customPrompts.map((cp, cpIdx) => (
                              <button
                                key={`root-cp-${cpIdx}`}
                                onClick={() => handlePromptClick(cp.text)}
                                className="w-full text-left px-3 py-2 rounded-lg transition-all duration-200 bg-black/10 border border-transparent text-gray-400 hover:bg-blue-950/10 hover:text-blue-200 focus:outline-none overflow-hidden"
                                style={{ fontSize: '0.75rem', minHeight: 32 }}
                              >
                                <div className="flex items-start space-x-2 overflow-hidden">
                                  <span className="text-blue-400 mt-0.5">•</span>
                                  <span className="leading-relaxed break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal' }}>{cp.title}</span>
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-[0.7rem] text-gray-400/80">No custom prompts yet.</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat History - Responsive with scroll and smooth touch/mouse support */}
              <div
                className="flex flex-col px-3 lg:px-4 pt-3 lg:pt-4 custom-scrollbar"
                style={{
                  marginTop: 16,
                  maxHeight: '32vh',
                  overflowY: 'auto',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain',
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'auto',
                  pointerEvents: 'auto',
                  touchAction: 'auto',
                }}
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[0.75rem] lg:text-[0.8rem] text-blue-300 font-semibold">Chat History</div>
                  {onNewChat && (
                    <button 
                      onClick={() => {
                        onNewChat();
                        // Close mobile sidebar if it's open
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-[0.7rem] lg:text-[0.75rem] text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors font-medium cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      New Chat
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 lg:gap-2">
                  {chatSessions.length === 0 ? (
                    <div className="text-xs lg:text-sm text-blue-100/80 italic">No chats yet.</div>
                  ) : (
                    <>
                      {visibleChats.map((chat) => (
                        <div
                          key={chat.id}
                          className={`w-full flex items-center justify-between group px-3 lg:px-4 py-1.5 lg:py-2 mb-1 rounded-lg text-white text-xs font-medium transition-all ${
                            currentChatId === chat.id 
                              ? 'bg-blue-700/30 border border-blue-200' 
                              : 'bg-black/30 hover:bg-blue-950/30'
                          }`}
                        >
                          <button
                            onClick={() => onSwitchChat && onSwitchChat(chat.id)}
                            className="flex items-center flex-1 min-w-0 text-left"
                          >
                            <History className="w-3 h-3 mr-2 text-blue-300 flex-shrink-0" />
                            <span className="truncate">{chat.title}</span>
                          </button>
                          {onDeleteChat && (
                            <button
                              onClick={(e) => handleDeleteChat(e, chat.id, chat.title)}
                              className="opacity-0 group-hover:opacity-100 ml-2 p-1 text-red-400 hover:text-red-300 transition-all flex-shrink-0"
                              title="Delete chat"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      {hasMoreChats && (
                        <button
                          onClick={loadMoreChats}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 text-blue-200 text-xs font-medium transition-all"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                          Load more chats ({chatSessions.length - visibleChatsCount} remaining)
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Account/Avatar - only shown when extended - Responsive */}
        {extended && (
          <div className="flex flex-row items-center justify-start gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3 mt-auto w-full bg-blue-900/20 border-t border-blue-400/10" 
               style={{ position: 'sticky', bottom: 0 }}>
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-blue-800/30 border border-blue-300/30 flex items-center justify-center flex-shrink-0">
              <Image 
                src="/saleslogo.webp" 
                alt="User" 
                width={24} 
                height={24} 
                className="object-contain rounded-full" 
              />
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar (Drawer) - Coming from left */}
      <aside
        className={`sm:hidden fixed top-0 left-0 z-60 h-full w-72 bg-black/95 backdrop-blur-2xl border-r border-blue-400/10 shadow-2xl transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem' }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside sidebar
      >
        {/* Header with Logo and Close */}
        <div className="flex items-center justify-between p-3 border-b border-blue-400/10">
          <div className="flex items-center space-x-2">
            <Image
              src="/saleslogo.webp"
              alt="Sales Centri"
              width={28}
              height={28}
              className="object-contain"
            />
            <span className="text-base font-semibold">
              <span className="text-white">Sales</span>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent ml-1">Centri</span>
            </span>
          </div>
          <button onClick={() => setMobileOpen(false)} aria-label="Close sidebar">
            <Image 
              src="/sidebar.webp" 
              alt="Close sidebar" 
              className="text-blue-300" 
              width={20} 
              height={20} 
            />
          </button>
        </div>

        {/* 3-Layer Structure for Mobile */}
          <div className="flex flex-col px-2 pt-3 overflow-y-auto custom-scrollbar" ref={modelsRef}>
          <div className="text-[0.65rem] text-blue-300 font-semibold mb-2 pl-2">Industry Models & More</div>
          
          {/* Categories */}
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <div key={category.id} className="relative">
                {/* Category Level 1 */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-2 py-2 rounded-lg transition-all duration-200 bg-black/30 border border-transparent text-white hover:bg-blue-950/30 focus:outline-none"
                  style={{ fontSize: '0.8rem', minHeight: 36 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  {category.expanded ? <ChevronDown size={14} className="text-blue-400" /> : <ChevronRight size={14} className="text-blue-400" />}
                </button>
                
                {/* Use Cases Level 2 */}
                {category.expanded && (
                  <div className="ml-3 mt-1 space-y-1">
                    {category.useCases.map((useCase) => (
                      <div key={useCase.id} className="relative">
                        <button
                          onClick={() => toggleUseCase(category.id, useCase.id)}
                          className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg transition-all duration-200 bg-black/20 border border-transparent text-gray-300 hover:bg-blue-950/20 focus:outline-none"
                          style={{ fontSize: '0.75rem', minHeight: 32 }}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-300">{useCase.icon}</span>
                            <span className="font-medium">{useCase.name}</span>
                          </div>
                          {useCase.expanded ? <ChevronDown size={12} className="text-blue-300" /> : <ChevronRight size={12} className="text-blue-300" />}
                        </button>

                        {/* Prompts Level 3 */}
                        {useCase.expanded && (
                          <div className="ml-3 mt-1">
                            {/* Admin sections if present */}
                                  {(useCase as any).sections && Array.isArray((useCase as any).sections) && (useCase as any).sections.length > 0 ? (
                              <div className="space-y-2">
                                {(useCase as any).sections.map((sec: any, sIdx: number) => (
                                  <div key={`m-${useCase.id}-sec-${sIdx}`} className="rounded-lg border border-blue-400/20 bg-black/10 p-2 space-y-2">
                                    <div className="px-2 text-[0.65rem] text-blue-300/90 font-semibold rounded-md border border-blue-400/20 inline-block bg-black/20 w-fit">{sec.title || 'Section'}</div>
                                    {(sec.prompts || []).map((pp: any, pIdx: number) => (
                                      <button
                                        key={`m-${useCase.id}-sp-${pIdx}`}
                                        onClick={() => {
                                          if (onPromptWithWebsite) {
                                            const visible = String(pp.visible || pp.visible_prompt || '');
                                            const backend = String(pp.backend || pp.backend_prompt || buildBackendPrompt(useCase.name, visible));
                                            onPromptWithWebsite({ visible, backend });
                                          } else {
                                            handlePromptClick(String(pp.visible || pp.visible_prompt || ''));
                                          }
                                          setMobileOpen(false);
                                        }}
                                        className="w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 bg-black/10 border border-transparent text-gray-400 hover:bg-blue-950/10 hover:text-blue-200 focus:outline-none"
                                        style={{ fontSize: '0.7rem', minHeight: 28 }}
                                      >
                                        <div className="flex items-start space-x-2">
                                          <span className="text-blue-400 mt-0.5">•</span>
                                          <span className="leading-relaxed">{String(pp.visible || pp.visible_prompt || '')}</span>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="rounded-lg border border-blue-400/20 bg-black/10 p-2 space-y-2">
                                {/* Legacy fallback */}
                                <div className="px-2 text-[0.65rem] text-blue-300/90 font-semibold rounded-md border border-blue-400/20 inline-block bg-black/20">Frequently used</div>
                                {useCase.prompts.slice(0,3).map((prompt, promptIdx) => (
                                  <button
                                    key={promptIdx}
                                    onClick={() => {
                                      if (onPromptWithWebsite) {
                                        const visible = prompt;
                                        const backend = buildBackendPrompt(useCase.name, visible);
                                        onPromptWithWebsite({ visible, backend });
                                      } else {
                                        handlePromptClick(prompt);
                                      }
                                      setMobileOpen(false);
                                    }}
                                    className="w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 bg-black/10 border border-transparent text-gray-400 hover:bg-blue-950/10 hover:text-blue-200 focus:outline-none"
                                    style={{ fontSize: '0.7rem', minHeight: 28 }}
                                  >
                                    <div className="flex items-start space-x-2">
                                      <span className="text-blue-400 mt-0.5">•</span>
                                      <span className="leading-relaxed">{prompt}</span>
                                    </div>
                                  </button>
                                ))}
                                <div className="px-2 pt-1 mt-0.5 border-t border-blue-400/10 text-[0.65rem] text-blue-300/90 font-semibold rounded-md border border-blue-400/20 inline-block bg-black/20 w-fit">Predefined</div>
                                {[
                                  `Top 10 ${useCase.name.replace(/s$/, '')} leads for outbound outreach`,
                                  `Decision-makers in ${useCase.name} with recent funding`,
                                  `Companies in ${useCase.name} adopting new tech`
                                ].map((p, i) => (
                                  <button
                                    key={`m-pre-${i}`}
                                    onClick={() => {
                                      if (onPromptWithWebsite) {
                                        const visible = p;
                                        const backend = buildBackendPrompt(useCase.name, visible);
                                        onPromptWithWebsite({ visible, backend });
                                      } else {
                                        handlePromptClick(p);
                                      }
                                      setMobileOpen(false);
                                    }}
                                    className="w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 bg-black/10 border border-transparent text-gray-400 hover:bg-blue-950/10 hover:text-blue-200 focus:outline-none"
                                    style={{ fontSize: '0.7rem', minHeight: 28 }}
                                  >
                                    <div className="flex items-start space-x-2">
                                      <span className="text-blue-400 mt-0.5">•</span>
                                      <span className="leading-relaxed">{p}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {/* Universal Custom Prompts - Mobile */}
            <div className="relative -mt-1">
              <button
                onClick={() => setCustomExpanded(!customExpanded)}
                className="w-full flex items-center justify-between px-2 py-2 rounded-lg transition-all duration-200 bg-black/30 border border-transparent text-white hover:bg-blue-950/30 focus:outline-none"
                style={{ fontSize: '0.8rem', minHeight: 36 }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400"><CirclePlus size={16} /></span>
                  <span className="font-medium">Custom Models</span>
                </div>
                {customExpanded ? <ChevronDown size={12} className="text-blue-400" /> : <ChevronRight size={12} className="text-blue-400" />}
              </button>
              {customExpanded && (
                <div className="ml-3 mt-1">
                  <div className="rounded-lg border border-blue-400/20 bg-black/10 p-2 space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <div className="text-[0.65rem] text-blue-300/90 font-semibold">Your prompts</div>
                      <button
                        onClick={() => {
                          if (onAddCustomPrompt) onAddCustomPrompt();
                          setMobileOpen(false);
                        }}
                        className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[0.65rem] transition-colors shadow-sm"
                        title="Add custom prompt"
                      >
                        <CirclePlus className="w-3 h-3" />
                        Add
                      </button>
                    </div>
                    {customPrompts && customPrompts.length > 0 ? (
                      customPrompts.map((cp, cpIdx) => (
                        <button
                          key={`m-root-cp-${cpIdx}`}
                          onClick={() => {
                            handlePromptClick(cp.text);
                            setMobileOpen(false);
                          }}
                          className="w-full text-left px-2 py-1.5 rounded-lg transition-all duration-200 bg-black/10 border border-transparent text-gray-400 hover:bg-blue-950/10 hover:text-blue-200 focus:outline-none"
                          style={{ fontSize: '0.7rem', minHeight: 28 }}
                        >
                          <div className="flex items-start space-x-2">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span className="leading-relaxed">{cp.title}</span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-[0.65rem] text-gray-400/80">No custom prompts yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat History - Smaller for mobile */}
        <div className="flex flex-col px-2 pt-2" style={{ marginTop: 8 }}>
          <div className="flex items-center justify-between mb-1 px-2">
            <div className="text-[0.65rem] text-blue-300 font-semibold">Chats</div>
            {onNewChat && (
              <button 
                onClick={() => {
                  onNewChat();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-1 px-2 py-1 text-[0.6rem] text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors font-medium"
              >
                <Plus className="w-2.5 h-2.5" />
                New
              </button>
            )}
          </div>
          <div 
            className="flex flex-col gap-1 custom-scrollbar"
            style={{
              maxHeight: '40vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
              scrollBehavior: 'smooth',
              msOverflowStyle: 'auto',
              pointerEvents: 'auto',
              touchAction: 'auto',
            }}
            tabIndex={0}
          >
            {chatSessions.length === 0 ? (
              <div className="text-[0.6rem] text-blue-100/80 italic px-2">No chats yet.</div>
            ) : (
              <>
                {visibleChats.map((chat, index) => (
                  <div
                    key={`${chat.id}-${index}`}
                    className={`w-full flex items-center justify-between group px-2 py-1.5 mb-1 rounded-lg text-white text-[0.7rem] font-medium transition-all cursor-pointer ${
                      currentChatId === chat.id 
                        ? 'bg-blue-700/30 border border-blue-200' 
                        : 'bg-black/30 hover:bg-blue-950/30 cursor-pointer'
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (onSwitchChat) {
                          onSwitchChat(chat.id);
                        }
                        setMobileOpen(false);
                      }}
                      className="flex items-center flex-1 min-w-0 text-left cursor-pointer"
                    >
                      <History className="w-2.5 h-2.5 mr-1.5 text-blue-300 flex-shrink-0" />
                      <span className="truncate">{chat.title}</span>
                    </button>
                    {onDeleteChat && (
                      <button
                        onClick={(e) => handleDeleteChat(e, chat.id, chat.title)}
                        className="opacity-0 group-hover:opacity-100 ml-1 p-1 text-red-400 hover:text-red-300 transition-all flex-shrink-0 cursor-pointer"
                        title="Delete chat"
                      >
                        <Trash2 className="w-2.5 h-2.5 cursor-pointer" />
                      </button>
                    )}
                  </div>
                ))}
                {hasMoreChats && (
                  <button
                    onClick={loadMoreChats}
                    className="w-full flex items-center justify-center gap-2 px-2 py-1.5 mt-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-400/20 text-blue-200 text-[0.65rem] font-medium transition-all"
                  >
                    <MoreHorizontal className="w-2.5 h-2.5" />
                    Load more ({chatSessions.length - visibleChatsCount})
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile backdrop to close sidebar when clicking outside */}
      {mobileOpen && (
        <div 
          className="sm:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={cancelDelete}
          />
          
          {/* Modal */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl border border-blue-400/20 p-6 max-w-sm mx-4 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Chat</h3>
                <p className="text-sm text-gray-400">This action cannot be undone</p>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm">
                Are you sure you want to delete <span className="font-medium text-white">&quot;{chatToDelete?.title}&quot;</span>?
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};