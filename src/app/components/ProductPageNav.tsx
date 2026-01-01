'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProductPageNavProps {
  sections: {
    id: string;
    label: string;
  }[];
}

export const ProductPageNav = ({ sections }: ProductPageNavProps) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;

      // Find which section is currently in view
      let currentSection = sections[0]?.id;
      let minDistance = Number.MAX_VALUE;

      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top);
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = section.id;
          }
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, activeSection, isScrolling]);

  const scrollToSection = (sectionId: string) => {
    setIsScrolling(true);
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100; // Adjust based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Reset the isScrolling state after animation completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-24 z-40 w-full backdrop-blur-md bg-black/80 border-b border-gray-800 py-4"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center space-x-8 overflow-x-auto hide-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ${
                activeSection === section.id 
                  ? 'text-white bg-blue-600' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
