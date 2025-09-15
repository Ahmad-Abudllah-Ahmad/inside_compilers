'use client';

import { useEffect } from 'react';
import { initLenis } from '@/components/motion/lenis';
import { initPageTransitions } from '@/components/transitions/barba';

interface MotionProviderProps {
  children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  useEffect(() => {
    // Initialize motion systems on client side only
    const lenis = initLenis();
    initPageTransitions();

    // Clean up function
    return () => {
      if (lenis) {
        lenis.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Re-initialize effects when page content changes
    const handlePageLoad = () => {
      // Re-run any page-specific animations
      console.log('Page loaded, reinitializing effects...');
    };

    document.addEventListener('page:loaded', handlePageLoad);
    
    return () => {
      document.removeEventListener('page:loaded', handlePageLoad);
    };
  }, []);

  return <>{children}</>;
}
