'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { Aurora } from '../Aurora';

interface PresentationLayoutProps {
  children: ReactNode[];
  title?: string;
  className?: string;
}

export default function PresentationLayout({ 
  children, 
  title = 'Presentation',
  className = '' 
}: PresentationLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = children.length;

  // Force dark mode regardless of browser/system preferences
  useEffect(() => {
    // Set presentation theme attribute
    document.documentElement.setAttribute('data-presentation-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
    
    // Force dark mode CSS variables
    const root = document.documentElement;
    const originalBackground = root.style.getPropertyValue('--background');
    const originalForeground = root.style.getPropertyValue('--foreground');
    const originalCard = root.style.getPropertyValue('--card');
    const originalCardForeground = root.style.getPropertyValue('--card-foreground');
    const originalPopover = root.style.getPropertyValue('--popover');
    const originalPopoverForeground = root.style.getPropertyValue('--popover-foreground');
    const originalPrimary = root.style.getPropertyValue('--primary');
    const originalPrimaryForeground = root.style.getPropertyValue('--primary-foreground');
    const originalSecondary = root.style.getPropertyValue('--secondary');
    const originalSecondaryForeground = root.style.getPropertyValue('--secondary-foreground');
    const originalMuted = root.style.getPropertyValue('--muted');
    const originalMutedForeground = root.style.getPropertyValue('--muted-foreground');
    const originalAccent = root.style.getPropertyValue('--accent');
    const originalAccentForeground = root.style.getPropertyValue('--accent-foreground');
    const originalBorder = root.style.getPropertyValue('--border');
    const originalInput = root.style.getPropertyValue('--input');
    const originalRing = root.style.getPropertyValue('--ring');
    
    root.style.setProperty('--background', '#0D1117');
    root.style.setProperty('--foreground', '#F0F6FC');
    root.style.setProperty('--card', '#0D1117');
    root.style.setProperty('--card-foreground', '#F0F6FC');
    root.style.setProperty('--popover', '#161B22');
    root.style.setProperty('--popover-foreground', '#F0F6FC');
    root.style.setProperty('--primary', '#2F81F7');
    root.style.setProperty('--primary-foreground', '#F0F6FC');
    root.style.setProperty('--secondary', '#30363D');
    root.style.setProperty('--secondary-foreground', '#F0F6FC');
    root.style.setProperty('--muted', '#161B22');
    root.style.setProperty('--muted-foreground', '#8B949E');
    root.style.setProperty('--accent', '#21262D');
    root.style.setProperty('--accent-foreground', '#F0F6FC');
    root.style.setProperty('--border', '#30363D');
    root.style.setProperty('--input', '#30363D');
    root.style.setProperty('--ring', '#58A6FF');
    
    // Cleanup function to restore original values
    return () => {
      document.documentElement.removeAttribute('data-presentation-theme');
      document.documentElement.style.colorScheme = '';
      
      // Restore original CSS variables
      root.style.setProperty('--background', originalBackground);
      root.style.setProperty('--foreground', originalForeground);
      root.style.setProperty('--card', originalCard);
      root.style.setProperty('--card-foreground', originalCardForeground);
      root.style.setProperty('--popover', originalPopover);
      root.style.setProperty('--popover-foreground', originalPopoverForeground);
      root.style.setProperty('--primary', originalPrimary);
      root.style.setProperty('--primary-foreground', originalPrimaryForeground);
      root.style.setProperty('--secondary', originalSecondary);
      root.style.setProperty('--secondary-foreground', originalSecondaryForeground);
      root.style.setProperty('--muted', originalMuted);
      root.style.setProperty('--muted-foreground', originalMutedForeground);
      root.style.setProperty('--accent', originalAccent);
      root.style.setProperty('--accent-foreground', originalAccentForeground);
      root.style.setProperty('--border', originalBorder);
      root.style.setProperty('--input', originalInput);
      root.style.setProperty('--ring', originalRing);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className={`min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark ${className}`}
    >
      {/* Aurora Background */}
      <Aurora />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/20 dark">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-3 flex justify-between items-center">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-white dark:text-white truncate">
            {title}
          </h1>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Slide counter */}
            <span className="text-xs sm:text-sm text-white/80 dark:text-white/80 hidden sm:block">
              {currentSlide + 1} / {totalSlides}
            </span>
            
            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white dark:text-white text-sm sm:text-base"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white dark:text-white text-sm sm:text-base"
            >
              →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 sm:pt-16 md:pt-18 relative">
        {/* Large Previous Button */}
        {currentSlide > 0 && (
          <button
            onClick={prevSlide}
            className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 sm:p-4 text-white dark:text-white transition-all duration-200 border border-white/30 hover:border-white/50 shadow-lg dark"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        {/* Large Next Button */}
        {currentSlide < totalSlides - 1 && (
          <button
            onClick={nextSlide}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-3 sm:p-4 text-white dark:text-white transition-all duration-200 border border-white/30 hover:border-white/50 shadow-lg dark"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {children[currentSlide]}
        </motion.div>
      </main>

      {/* Slide Navigation Dots */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex space-x-2 sm:space-x-3 bg-black/40 backdrop-blur-md rounded-full px-3 sm:px-4 py-2 sm:py-3 border border-white/20">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              title={`Go to slide ${index + 1}`}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300
                ${currentSlide === index 
                  ? 'bg-blue-400 scale-125 shadow-lg shadow-blue-400/50' 
                  : 'bg-white/40 hover:bg-white/60'
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="sr-only">
        <button
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
          }}
        />
      </div>
    </div>
  );
}