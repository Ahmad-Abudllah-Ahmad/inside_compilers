import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

// Initialize Lenis smooth scrolling
export const initLenis = () => {
  if (typeof window === 'undefined' || lenis) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Add Lenis class to html
  document.documentElement.classList.add('lenis');

  return lenis;
};

// Destroy Lenis instance
export const destroyLenis = () => {
  if (lenis) {
    lenis.destroy();
    lenis = null;
    document.documentElement.classList.remove('lenis');
  }
};

// Get current Lenis instance
export const getLenis = () => lenis;

// Scroll to specific target
export const scrollTo = (target: string | number | HTMLElement, options?: Record<string, unknown>) => {
  if (lenis) {
    lenis.scrollTo(target, options);
  }
};

// Stop smooth scrolling
export const stopLenis = () => {
  if (lenis) {
    lenis.stop();
    document.documentElement.classList.add('lenis-stopped');
  }
};

// Start smooth scrolling
export const startLenis = () => {
  if (lenis) {
    lenis.start();
    document.documentElement.classList.remove('lenis-stopped');
  }
};
