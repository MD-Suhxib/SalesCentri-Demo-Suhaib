// Time counter component for research progress

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeCounterProps {
  isRunning: boolean;
  onReset?: () => void;
  variant?: 'floating' | 'inline'; // 'floating' for absolute positioning, 'inline' for normal flow
}

// Array of loading messages to rotate through
const loadingMessages = [
  "Analyzing data...",
  "Gathering insights...",
  "Processing information...",
  "Summarizing findings...",
  "Connecting data points...",
  "Evaluating sources...",
  "Generating analysis...",
  "Reviewing market trends...",
  "Compiling research...",
  "Synthesizing results...",
  "Deep diving into data...",
  "Cross-referencing sources...",
  "Building comprehensive report...",
  "Validating information...",
  "Finalizing insights..."
];

export const TimeCounter: React.FC<TimeCounterProps> = ({ isRunning, onReset, variant = 'floating' }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCompleted, setShowCompleted] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Debug log when isRunning changes
  useEffect(() => {
    console.log('⏱️ TimeCounter: isRunning changed to', isRunning);
  }, [isRunning]);

  // Rotate loading messages every 1 second
  useEffect(() => {
    let messageInterval: NodeJS.Timeout | null = null;

    if (isRunning) {
      setCurrentMessageIndex(0); // Reset to first message when starting
      messageInterval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1000); // Change message every 1 second
    } else {
      setCurrentMessageIndex(0); // Reset when stopped
    }

    return () => {
      if (messageInterval) {
        clearInterval(messageInterval);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      console.log('⏱️ TimeCounter: Starting timer');
      const startTime = Date.now() - elapsedTime * 1000;
      setShowCompleted(false);
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 100); // Update every 100ms for smooth display
    } else {
      if (interval) {
        clearInterval(interval);
      }
      // Show completed state for 5 seconds after research finishes
      if (elapsedTime > 0) {
        setShowCompleted(true);
        const hideTimer = setTimeout(() => {
          setShowCompleted(false);
          setElapsedTime(0);
        }, 5000);
        
        return () => clearTimeout(hideTimer);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, elapsedTime]);

  // Reset timer when requested
  useEffect(() => {
    if (onReset && !isRunning) {
      setElapsedTime(0);
      setShowCompleted(false);
    }
  }, [isRunning, onReset]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRunning && !showCompleted) {
    return null;
  }

  // Determine classes and styles based on variant
  const containerClasses = variant === 'floating'
    ? "absolute top-2 right-2 sm:top-4 sm:right-4 z-10 px-3 py-2 sm:px-4 sm:py-3 rounded-lg border flex items-center gap-3 shadow-2xl animate-pulse-subtle pointer-events-auto"
    : "w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border flex items-center gap-3 shadow-2xl animate-pulse-subtle";

  const containerStyle = variant === 'floating'
    ? {
        background: 'rgba(0, 20, 40, 0.98)',
        borderColor: 'rgba(0, 170, 255, 0.6)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 170, 255, 0.4), 0 0 0 1px rgba(0, 170, 255, 0.2)',
        minWidth: '280px',
        maxWidth: '400px'
      }
    : {
        background: 'rgba(0, 20, 40, 0.98)',
        borderColor: 'rgba(0, 170, 255, 0.6)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 170, 255, 0.4), 0 0 0 1px rgba(0, 170, 255, 0.2)'
      };

  return (
    <div 
      className={containerClasses}
      style={containerStyle}
    >
      <Clock 
        className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${isRunning ? 'animate-spin-slow text-cyan-400' : 'text-green-400'}`}
        style={{ animationDuration: '3s' }}
      />
      <div className="flex flex-col flex-1 min-w-0">
        {/* Loading message - rotates every 1 second when running */}
        {isRunning && (
          <span 
            key={currentMessageIndex}
            className="text-[11px] sm:text-xs font-medium mb-1 loading-message"
            style={{ 
              color: 'rgba(100, 200, 255, 0.95)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {loadingMessages[currentMessageIndex]}
          </span>
        )}
        <div className="flex items-center justify-between gap-2">
          <span 
            className="text-[10px] sm:text-xs font-medium whitespace-nowrap"
            style={{ color: 'rgba(156, 163, 175, 0.9)' }}
          >
            {isRunning ? 'In Progress' : 'Completed'}
          </span>
          <span 
            className="text-base sm:text-lg font-bold font-mono"
            style={{ 
              color: isRunning ? '#00ffff' : '#10b981',
              textShadow: isRunning ? '0 0 10px rgba(0, 255, 255, 0.5)' : '0 0 10px rgba(16, 185, 129, 0.5)'
            }}
          >
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Add custom CSS for subtle pulse animation and loading message fade
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-subtle {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.95;
        transform: scale(1.02);
      }
    }
    
    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    
    @keyframes fade-slide-in {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-pulse-subtle {
      animation: pulse-subtle 2s ease-in-out infinite;
    }
    
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }
    
    .loading-message {
      animation: fade-slide-in 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}

