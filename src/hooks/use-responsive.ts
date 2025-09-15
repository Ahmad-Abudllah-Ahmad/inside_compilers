// Responsive Design Hook for Inside Compiler 2026
'use client';

import { useState, useEffect } from 'react';
import { BREAKPOINTS } from '@/constants/motion';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeScreen: boolean;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  windowWidth: number;
  windowHeight: number;
}

export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLargeScreen: false,
    prefersReducedMotion: false,
    isTouchDevice: false,
    windowWidth: 1920,
    windowHeight: 1080,
  });

  useEffect(() => {
    const updateResponsiveState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isMobile = width < BREAKPOINTS.sm;
      const isTablet = width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg;
      const isDesktop = width >= BREAKPOINTS.lg;
      const isLargeScreen = width >= BREAKPOINTS.xl;
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

      setState({
        isMobile,
        isTablet,
        isDesktop,
        isLargeScreen,
        prefersReducedMotion,
        isTouchDevice,
        windowWidth: width,
        windowHeight: height,
      });
    };

    // Initial call
    updateResponsiveState();

    // Event listeners
    window.addEventListener('resize', updateResponsiveState);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', updateResponsiveState);

    return () => {
      window.removeEventListener('resize', updateResponsiveState);
      reducedMotionQuery.removeEventListener('change', updateResponsiveState);
    };
  }, []);

  return state;
}

// Utility hook for conditional motion
export function useMotionPreferences() {
  const { prefersReducedMotion, isMobile } = useResponsive();
  
  return {
    shouldReduceMotion: prefersReducedMotion || isMobile,
    shouldDisableComplexAnimations: prefersReducedMotion || isMobile,
    shouldUseSimpleTransitions: prefersReducedMotion,
  };
}
