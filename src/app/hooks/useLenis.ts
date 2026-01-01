import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

export const useLenis = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis for local component usage
    lenisRef.current = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return lenisRef.current;
};
