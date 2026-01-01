'use client';

import React, { createContext, useContext } from 'react';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentDark: string;
  gradient: string;
  gradientHover: string;
  border: string;
  background: string;
  backgroundSecondary: string;
  glow: string;
}

export interface ProductTheme {
  name: string;
  colors: ThemeColors;
}

// Define unique blue themes for each product category
export const productThemes: Record<string, ProductTheme> = {
  // Contact Intelligence & Data - Blue variants
  'ai-aggregator': {
    name: 'AI Aggregator',
    colors: {
      primary: 'cyan-500',
      primaryDark: 'cyan-600',
      primaryLight: 'cyan-400',
      accent: 'cyan-300',
      accentDark: 'cyan-700',
      gradient: 'from-cyan-500 to-cyan-600',
      gradientHover: 'from-cyan-400 to-cyan-500',
      border: 'cyan-500/20',
      background: 'cyan-500/10',
      backgroundSecondary: 'cyan-500/5',
      glow: 'cyan-500/25'
    }
  },
  'ai-hunter': {
    name: 'AI Hunter',
    colors: {
      primary: 'blue-500',
      primaryDark: 'blue-600',
      primaryLight: 'blue-400',
      accent: 'blue-300',
      accentDark: 'blue-700',
      gradient: 'from-blue-500 to-blue-600',
      gradientHover: 'from-blue-400 to-blue-500',
      border: 'blue-500/20',
      background: 'blue-500/10',
      backgroundSecondary: 'blue-500/5',
      glow: 'blue-500/25'
    }
  },
  'hunter-validator': {
    name: 'Contact Validator',
    colors: {
      primary: 'sky-500',
      primaryDark: 'sky-600',
      primaryLight: 'sky-400',
      accent: 'sky-300',
      accentDark: 'sky-700',
      gradient: 'from-sky-500 to-sky-600',
      gradientHover: 'from-sky-400 to-sky-500',
      border: 'sky-500/20',
      background: 'sky-500/10',
      backgroundSecondary: 'sky-500/5',
      glow: 'sky-500/25'
    }
  },
  'intellibase': {
    name: 'IntelliBase',
    colors: {
      primary: 'indigo-500',
      primaryDark: 'indigo-600',
      primaryLight: 'indigo-400',
      accent: 'indigo-300',
      accentDark: 'indigo-700',
      gradient: 'from-indigo-500 to-indigo-600',
      gradientHover: 'from-indigo-400 to-indigo-500',
      border: 'indigo-500/20',
      background: 'indigo-500/10',
      backgroundSecondary: 'indigo-500/5',
      glow: 'indigo-500/25'
    }
  },
  
  // Lead Management & Generation - Purple-blue variants
  'iema-email-marketing-automation': {
    name: 'iEMA',
    colors: {
      primary: 'violet-500',
      primaryDark: 'violet-600',
      primaryLight: 'violet-400',
      accent: 'violet-300',
      accentDark: 'violet-700',
      gradient: 'from-violet-500 to-violet-600',
      gradientHover: 'from-violet-400 to-violet-500',
      border: 'violet-500/20',
      background: 'violet-500/10',
      backgroundSecondary: 'violet-500/5',
      glow: 'violet-500/25'
    }
  },
  'lead-generation': {
    name: 'Lead Generation',
    colors: {
      primary: 'purple-500',
      primaryDark: 'purple-600',
      primaryLight: 'purple-400',
      accent: 'purple-300',
      accentDark: 'purple-700',
      gradient: 'from-purple-500 to-purple-600',
      gradientHover: 'from-purple-400 to-purple-500',
      border: 'purple-500/20',
      background: 'purple-500/10',
      backgroundSecondary: 'purple-500/5',
      glow: 'purple-500/25'
    }
  },
  'lead-stream': {
    name: 'Lead Stream',
    colors: {
      primary: 'fuchsia-500',
      primaryDark: 'fuchsia-600',
      primaryLight: 'fuchsia-400',
      accent: 'fuchsia-300',
      accentDark: 'fuchsia-700',
      gradient: 'from-fuchsia-500 to-fuchsia-600',
      gradientHover: 'from-fuchsia-400 to-fuchsia-500',
      border: 'fuchsia-500/20',
      background: 'fuchsia-500/10',
      backgroundSecondary: 'fuchsia-500/5',
      glow: 'fuchsia-500/25'
    }
  },
  'ilms-lead-management-system': {
    name: 'iLMS',
    colors: {
      primary: 'pink-500',
      primaryDark: 'pink-600',
      primaryLight: 'pink-400',
      accent: 'pink-300',
      accentDark: 'pink-700',
      gradient: 'from-pink-500 to-pink-600',
      gradientHover: 'from-pink-400 to-pink-500',
      border: 'pink-500/20',
      background: 'pink-500/10',
      backgroundSecondary: 'pink-500/5',
      glow: 'pink-500/25'
    }
  },

  // Voice AI & Dialer Solutions - Teal-blue variants
  'dialerai': {
    name: 'DialerAI',
    colors: {
      primary: 'teal-500',
      primaryDark: 'teal-600',
      primaryLight: 'teal-400',
      accent: 'teal-300',
      accentDark: 'teal-700',
      gradient: 'from-teal-500 to-teal-600',
      gradientHover: 'from-teal-400 to-teal-500',
      border: 'teal-500/20',
      background: 'teal-500/10',
      backgroundSecondary: 'teal-500/5',
      glow: 'teal-500/25'
    }
  },
  'sim-dialer': {
    name: 'SIM Dialer',
    colors: {
      primary: 'emerald-500',
      primaryDark: 'emerald-600',
      primaryLight: 'emerald-400',
      accent: 'emerald-300',
      accentDark: 'emerald-700',
      gradient: 'from-emerald-500 to-emerald-600',
      gradientHover: 'from-emerald-400 to-emerald-500',
      border: 'emerald-500/20',
      background: 'emerald-500/10',
      backgroundSecondary: 'emerald-500/5',
      glow: 'emerald-500/25'
    }
  },
  'salesai-agent': {
    name: 'SalesAI Agent',
    colors: {
      primary: 'green-500',
      primaryDark: 'green-600',
      primaryLight: 'green-400',
      accent: 'green-300',
      accentDark: 'green-700',
      gradient: 'from-green-500 to-green-600',
      gradientHover: 'from-green-400 to-green-500',
      border: 'green-500/20',
      background: 'green-500/10',
      backgroundSecondary: 'green-500/5',
      glow: 'green-500/25'
    }
  },
  'voiceai-agent': {
    name: 'VoiceAI Agent',
    colors: {
      primary: 'lime-500',
      primaryDark: 'lime-600',
      primaryLight: 'lime-400',
      accent: 'lime-300',
      accentDark: 'lime-700',
      gradient: 'from-lime-500 to-lime-600',
      gradientHover: 'from-lime-400 to-lime-500',
      border: 'lime-500/20',
      background: 'lime-500/10',
      backgroundSecondary: 'lime-500/5',
      glow: 'lime-500/25'
    }
  },

  // Chat & Text AI Automation - Blue-green variants
  'chat-bot': {
    name: 'Chat Bot',
    colors: {
      primary: 'slate-500',
      primaryDark: 'slate-600',
      primaryLight: 'slate-400',
      accent: 'slate-300',
      accentDark: 'slate-700',
      gradient: 'from-slate-500 to-slate-600',
      gradientHover: 'from-slate-400 to-slate-500',
      border: 'slate-500/20',
      background: 'slate-500/10',
      backgroundSecondary: 'slate-500/5',
      glow: 'slate-500/25'
    }
  },
  'whatsapp-bot': {
    name: 'WhatsApp Bot',
    colors: {
      primary: 'zinc-500',
      primaryDark: 'zinc-600',
      primaryLight: 'zinc-400',
      accent: 'zinc-300',
      accentDark: 'zinc-700',
      gradient: 'from-zinc-500 to-zinc-600',
      gradientHover: 'from-zinc-400 to-zinc-500',
      border: 'zinc-500/20',
      background: 'zinc-500/10',
      backgroundSecondary: 'zinc-500/5',
      glow: 'zinc-500/25'
    }
  },
  'text-to-speech': {
    name: 'Text to Speech',
    colors: {
      primary: 'neutral-500',
      primaryDark: 'neutral-600',
      primaryLight: 'neutral-400',
      accent: 'neutral-300',
      accentDark: 'neutral-700',
      gradient: 'from-neutral-500 to-neutral-600',
      gradientHover: 'from-neutral-400 to-neutral-500',
      border: 'neutral-500/20',
      background: 'neutral-500/10',
      backgroundSecondary: 'neutral-500/5',
      glow: 'neutral-500/25'
    }
  },
  'speech-to-text': {
    name: 'Speech to Text',
    colors: {
      primary: 'stone-500',
      primaryDark: 'stone-600',
      primaryLight: 'stone-400',
      accent: 'stone-300',
      accentDark: 'stone-700',
      gradient: 'from-stone-500 to-stone-600',
      gradientHover: 'from-stone-400 to-stone-500',
      border: 'stone-500/20',
      background: 'stone-500/10',
      backgroundSecondary: 'stone-500/5',
      glow: 'stone-500/25'
    }
  },

  // Cloud Telephony & Infrastructure - Dark blue variants
  'igct': {
    name: 'iGCT',
    colors: {
      primary: 'blue-700',
      primaryDark: 'blue-800',
      primaryLight: 'blue-600',
      accent: 'blue-500',
      accentDark: 'blue-900',
      gradient: 'from-blue-700 to-blue-800',
      gradientHover: 'from-blue-600 to-blue-700',
      border: 'blue-700/20',
      background: 'blue-700/10',
      backgroundSecondary: 'blue-700/5',
      glow: 'blue-700/25'
    }
  },
  'call-center': {
    name: 'Call Center',
    colors: {
      primary: 'indigo-700',
      primaryDark: 'indigo-800',
      primaryLight: 'indigo-600',
      accent: 'indigo-500',
      accentDark: 'indigo-900',
      gradient: 'from-indigo-700 to-indigo-800',
      gradientHover: 'from-indigo-600 to-indigo-700',
      border: 'indigo-700/20',
      background: 'indigo-700/10',
      backgroundSecondary: 'indigo-700/5',
      glow: 'indigo-700/25'
    }
  }
};

interface ThemeContextType {
  currentTheme: ProductTheme;
  setTheme: (productKey: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initialTheme = 'ai-hunter' }) => {
  const [currentTheme, setCurrentTheme] = React.useState<ProductTheme>(
    productThemes[initialTheme] || productThemes['ai-hunter']
  );

  const setTheme = (productKey: string) => {
    const theme = productThemes[productKey];
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
