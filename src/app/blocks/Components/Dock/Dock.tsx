/*
	Installed from https://reactbits.dev/ts/tailwind/
*/

"use client";

import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
  AnimatePresence,
} from "framer-motion";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SpotlightCard from "../../SpotlightCard/SpotlightCard";

export type DockItemData = {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
  className?: string;
  "data-track"?: string;
  dropdown?: {
    title: string;
    items: Array<{
      name: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      description?: string;
    }>;
  };
};

export type DockProps = {
  items: DockItemData[];
  className?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  onDropdownChangeAction?: (isOpen: boolean) => void;
  activeDockDropdown?: string | null;
  setActiveDockDropdownAction?: (id: string | null | ((current: string | null) => string | null)) => void;
};

type DockItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  "data-track"?: string;
  mouseX: MotionValue;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  dropdown?: {
    title: string;
    items: Array<{
      name: string;
      href: string;
      icon: React.ComponentType<{ className?: string }>;
      description?: string;
    }>;
  };
  onDropdownChangeAction?: (isOpen: boolean) => void;
  itemId?: string;
  isActive?: boolean;
  setActiveDockDropdownAction?: (id: string | null | ((current: string | null) => string | null)) => void;
  isMobile?: boolean;
};

function DockItem({
  children,
  className = "",
  onClick,
  "data-track": dataTrack,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  dropdown,
  onDropdownChangeAction,
  itemId,
  isActive = false,
  setActiveDockDropdownAction,
  isMobile = false,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  const hoverTimeoutRef = useRef<number | null>(null);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);

  const handleClick = () => {
    if (isMobile && dropdown && itemId) {
      // On mobile, toggle dropdown on click
      if (isActive) {
        setActiveDockDropdownAction?.(null);
        onDropdownChangeAction?.(false);
      } else {
        setActiveDockDropdownAction?.(itemId);
        onDropdownChangeAction?.(true);
      }
    } else if (!dropdown) {
      onClick?.();
    }
    // For desktop with dropdown, no click behavior - handled by hover
  };

  const handleMouseEnter = () => {
    if (!isMobile && dropdown && itemId) {
      // Clear any existing timeout - both local and check if there might be global ones
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      // Set active dropdown immediately for better responsiveness
      setActiveDockDropdownAction?.(itemId);
      onDropdownChangeAction?.(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && dropdown && itemId) {
      // Clear timeout if leaving before delay completes
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      
      // Set timeout to close dropdown - but only if this item is currently active
      // This prevents interference when moving between dock items
      hoverTimeoutRef.current = window.setTimeout(() => {
        // Double check if this item is still the active one before closing
        setActiveDockDropdownAction?.((current: string | null) => {
          if (current === itemId) {
            onDropdownChangeAction?.(false);
            return null;
          }
          return current;
        });
      }, 150);
    }
  };

  const handleDropdownMouseEnter = () => {
    if (!isMobile && dropdown && hoverTimeoutRef.current) {
      // Cancel close timeout when entering dropdown
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleDropdownMouseLeave = () => {
    if (!isMobile && dropdown && itemId) {
      // Close dropdown when leaving popup area - shorter delay
      hoverTimeoutRef.current = window.setTimeout(() => {
        // Use functional update to ensure we only close if this item is still active
        setActiveDockDropdownAction?.((current: string | null) => {
          if (current === itemId) {
            onDropdownChangeAction?.(false);
            return null;
          }
          return current;
        });
      }, 150);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className="relative">
        <motion.div
          ref={ref}
          style={{
            width: size,
            height: size,
          }}
          onHoverStart={!isMobile ? () => {
            isHovered.set(1);
            handleMouseEnter();
          } : undefined}
          onHoverEnd={!isMobile ? () => {
            isHovered.set(0);
            handleMouseLeave();
          } : undefined}
          onFocus={() => isHovered.set(1)}
          onBlur={() => isHovered.set(0)}
          onClick={handleClick}
          className={`relative inline-flex items-center justify-center rounded-full bg-black/20 backdrop-blur-xl border-white/10 border-2 shadow-lg cursor-pointer transition-all duration-200 ${
            isActive ? 'bg-blue-500/30 border-blue-400/40 shadow-blue-500/20' : ''
          } ${className} ${isMobile ? 'active:scale-95' : ''}`}
          data-track={dataTrack}
          tabIndex={0}
          role="button"
          aria-haspopup={dropdown ? "true" : "false"}
          aria-expanded={dropdown ? isActive : undefined}
        >
          {Children.map(children, (child) =>
            React.isValidElement(child) && child.type === DockLabel
              ? cloneElement(child as React.ReactElement<DockLabelProps>, { 
                  isHovered, 
                  hasDropdown: !!dropdown 
                })
              : child
          )}
        </motion.div>
      </div>

      {/* Dropdown Card - Outside relative container for proper centering */}
      <AnimatePresence>
        {dropdown && isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`fixed ${isMobile ? 'bottom-[80px] w-[95vw] max-w-[400px]' : 'bottom-[120px] w-[700px]'} bg-transparent p-0 z-50`}
            data-dropdown-popup
            onMouseEnter={!isMobile ? handleDropdownMouseEnter : undefined}
            onMouseLeave={!isMobile ? handleDropdownMouseLeave : undefined}
            style={{ 
              left: '50%', 
              marginLeft: isMobile ? '-47.5vw' : '-350px',
              maxWidth: isMobile ? '400px' : '700px'
            }}
          >
              <div className={`bg-gray-900/98 backdrop-blur-xl border border-gray-700/50 rounded-xl ${isMobile ? 'p-3' : 'p-4'} shadow-2xl`}>
                <div className="text-center mb-3">
                  <h3 className={`text-white font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>{dropdown.title}</h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto mt-1.5"></div>
                </div>
              
              {/* Responsive Grid Layout */}
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-1.5' : 'grid-cols-3 gap-2'} auto-rows-min`}>
                {/* Mobile: Show first 4 items in 2 columns, Desktop: Original 3-column layout */}
                {isMobile ? (
                  dropdown.items.slice(0, 8).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex"
                    >
                      <SpotlightCard 
                        className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full"
                        spotlightColor="rgba(59, 130, 246, 0.08)"
                      >
                        <a
                          href={item.href}
                          className={`flex flex-col items-center text-center ${isMobile ? 'p-2' : 'p-3'}`}
                          onClick={() => setActiveDockDropdownAction?.(null)}
                        >
                          <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-md flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform duration-300`}>
                            <item.icon className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-blue-400 group-hover:text-blue-300`} />
                          </div>
                          <h4 className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-sm'} group-hover:text-blue-300 transition-colors leading-tight mb-1`}>
                            {item.name}
                          </h4>
                          {item.description && !isMobile && (
                            <p className="text-gray-400 text-xs opacity-75 group-hover:opacity-100 transition-opacity leading-snug line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </a>
                      </SpotlightCard>
                    </motion.div>
                  ))
                ) : (
                  <>
                    {/* Desktop: First 3 items in top row */}
                    {dropdown.items.slice(0, 3).map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex"
                      >
                        <SpotlightCard 
                          className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full"
                          spotlightColor="rgba(59, 130, 246, 0.08)"
                        >
                          <a
                            href={item.href}
                            className="flex flex-col items-center text-center p-3"
                            onClick={() => setActiveDockDropdownAction?.(null)}
                          >
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-md flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                              <item.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                            </div>
                            <h4 className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors leading-tight mb-1">
                              {item.name}
                            </h4>
                            {item.description && (
                              <p className="text-gray-400 text-xs opacity-75 group-hover:opacity-100 transition-opacity leading-snug line-clamp-2">
                                {item.description}
                              </p>
                            )}
                          </a>
                        </SpotlightCard>
                      </motion.div>
                    ))}
                    
                    {/* Desktop: Bottom 2 items spanning wider */}
                    {dropdown.items.length > 3 && (
                      <>
                        {dropdown.items.slice(3, 5).map((item, index) => (
                          <motion.div
                            key={index + 3}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index + 3) * 0.05 }}
                            className={`flex ${index === 0 ? 'col-span-2' : 'col-span-1'}`}
                          >
                            <SpotlightCard 
                              className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] w-full"
                              spotlightColor="rgba(59, 130, 246, 0.08)"
                            >
                              <a
                                href={item.href}
                                className="flex flex-col items-center text-center p-3"
                                onClick={() => setActiveDockDropdownAction?.(null)}
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-md flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                                  <item.icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                                </div>
                                <h4 className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors leading-tight mb-1">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="text-gray-400 text-xs opacity-75 group-hover:opacity-100 transition-opacity leading-snug line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                              </a>
                            </SpotlightCard>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
              
              {/* Arrow pointing down to dock item */}
              <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gray-900 border-r border-b border-gray-700/50 rotate-45"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

type DockLabelProps = {
  className?: string;
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
  hasDropdown?: boolean;
};

function DockLabel({ children, className = "", isHovered, hasDropdown }: DockLabelProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on("change", (latest) => {
      // Don't show simple label if item has dropdown
      setIsVisible(latest === 1 && !hasDropdown);
    });
    return () => unsubscribe();
  }, [isHovered, hasDropdown]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md border border-white/20 bg-black/40 backdrop-blur-xl px-2 py-0.5 text-xs text-white shadow-lg`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type DockIconProps = {
  className?: string;
  children: React.ReactNode;
};

function DockIcon({ children, className = "" }: DockIconProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
  onDropdownChangeAction,
  activeDockDropdown,
  setActiveDockDropdownAction,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const globalHoverTimeoutRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Clear any pending timeouts when the active dropdown changes
  useEffect(() => {
    return () => {
      if (globalHoverTimeoutRef.current) {
        clearTimeout(globalHoverTimeoutRef.current);
      }
    };
  }, [activeDockDropdown]);

  // Close dropdown when clicking outside on mobile
  useEffect(() => {
    if (!isMobile) return undefined;
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-dock-container]') && !target.closest('[data-dropdown-popup]')) {
        setActiveDockDropdownAction?.(null);
        onDropdownChangeAction?.(false);
      }
    };

    if (activeDockDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
    
    return undefined;
  }, [activeDockDropdown, isMobile, setActiveDockDropdownAction, onDropdownChangeAction]);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight],
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  // Mobile responsive values
  const mobileBaseItemSize = isMobile ? 40 : baseItemSize;
  const mobileMagnification = isMobile ? 50 : magnification;
  const mobilePanelHeight = isMobile ? 60 : panelHeight;

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-center"
    >
      <motion.div
        data-dock-container
        onMouseMove={!isMobile ? ({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        } : undefined}
        onMouseEnter={!isMobile ? () => {
          // Cancel any pending close timeout when entering dock area
          if (globalHoverTimeoutRef.current) {
            clearTimeout(globalHoverTimeoutRef.current);
            globalHoverTimeoutRef.current = null;
          }
        } : undefined}
        onMouseLeave={!isMobile ? () => {
          isHovered.set(0);
          mouseX.set(Infinity);
          // Clear dropdown when leaving dock entirely - with longer delay to allow for dropdown interaction
          if (globalHoverTimeoutRef.current) {
            clearTimeout(globalHoverTimeoutRef.current);
          }
          globalHoverTimeoutRef.current = window.setTimeout(() => {
            setActiveDockDropdownAction?.(null);
            onDropdownChangeAction?.(false);
          }, 300);
        } : undefined}
        className={`${className} absolute ${isMobile ? 'bottom-4' : 'bottom-2'} left-1/2 transform -translate-x-1/2 flex items-end w-fit ${isMobile ? 'gap-2' : 'gap-4'} rounded-2xl border-white/5 border-2 ${isMobile ? 'pb-1.5 px-3' : 'pb-2 px-4'} bg-black/10 backdrop-blur-xl shadow-2xl`}
        style={{ height: isMobile ? mobilePanelHeight : panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => {
          const itemId = item.label?.toString() || `dock-item-${index}`;
          const isActive = activeDockDropdown === itemId;
          
          return (
            <DockItem
              key={index}
              onClick={item.onClick}
              className={item.className}
              data-track={item["data-track"]}
              mouseX={mouseX}
              spring={spring}
              distance={distance}
              magnification={isMobile ? mobileMagnification : magnification}
              baseItemSize={isMobile ? mobileBaseItemSize : baseItemSize}
              dropdown={item.dropdown}
              onDropdownChangeAction={onDropdownChangeAction}
              itemId={itemId}
              isActive={isActive}
              setActiveDockDropdownAction={setActiveDockDropdownAction}
              isMobile={isMobile}
            >
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
