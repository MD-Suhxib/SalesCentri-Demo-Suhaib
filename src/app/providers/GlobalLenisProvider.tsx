'use client';

import { ReactNode } from 'react';
import { useLenisGlobal } from '../hooks/useLenisGlobal';

interface GlobalLenisProviderProps {
  children: ReactNode;
}

export const GlobalLenisProvider = ({ children }: GlobalLenisProviderProps) => {
  useLenisGlobal();
  
  return <>{children}</>;
};
