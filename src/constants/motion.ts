// Motion Tokens for Inside Compiler 2026
import type { MotionConfig } from '@/types';

export const MOTION_CONFIG: MotionConfig = {
  duration: {
    xs: 0.18,
    sm: 0.28,
    md: 0.45,
    lg: 0.75,
    xl: 1.2
  },
  easing: {
    power3Out: 'power3.out',
    expoOut: 'expo.out',
    backOut: 'back.out(1.7)',
    custom: 'cubic-bezier(0.22, 1, 0.36, 1)'
  },
  stagger: {
    lines: 0.08,
    chips: 0.04,
    glyphs: 0.02
  }
};

export const BREAKPOINTS = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1440,
  '4k': 2560
} as const;

export const SCROLL_CONFIG = {
  lenis: {
    lerp: 0.1,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    smoothWheel: true,
    syncTouch: false
  },
  scrollTrigger: {
    refreshPriority: 0,
    anticipatePin: 1
  }
} as const;

export const TRANSITION_TYPES = {
  OVERLAY_MORPH: 'overlay-morph',
  ZOOM_WARP: 'zoom-warp',
  GLITCH_BURST: 'glitch-burst',
  FADE: 'fade'
} as const;

export const MAGNETIC_CONFIG = {
  radius: 80,
  force: 0.3,
  ease: 'power2.out'
} as const;
