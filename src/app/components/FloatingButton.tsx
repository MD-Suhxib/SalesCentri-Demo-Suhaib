'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingButtonProps {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 z-50 group cursor-pointer"
      aria-label="Open Let's Talk dialog"
      type="button"
    >
      <div
        className={`
          relative flex items-center gap-2 px-4 py-2.5
          bg-gradient-to-r from-blue-500 to-blue-600
          text-white font-semibold text-sm
          rounded-lg shadow-lg hover:shadow-xl
          transition-all duration-300 ease-out
          ${isHovered ? 'scale-105 shadow-blue-500/30' : 'scale-100'}
        `}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          <MessageCircle 
            className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`}
            strokeWidth={2.5}
          />
          <span className="whitespace-nowrap text-sm">Let&apos;s Talk</span>
        </div>

        {/* Pulse animation ring */}
        <div className="absolute inset-0 rounded-lg bg-blue-500 opacity-0 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500" />
      </div>
    </button>
  );
}
