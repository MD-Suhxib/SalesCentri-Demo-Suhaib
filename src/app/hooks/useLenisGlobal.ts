import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useLenisGlobal = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling with proper configuration
    lenisRef.current = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Proper RAF loop for Lenis
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect Lenis with GSAP ScrollTrigger properly
    lenisRef.current.on('scroll', () => {
      ScrollTrigger.update();
    });

    // Remove conflicting GSAP ticker
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return lenisRef.current;
};
