// Enhanced GSAP Helpers for Inside Compiler 2026
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { GSAPHelpers, SplitRevealOptions } from '@/types';
import { MOTION_CONFIG, MAGNETIC_CONFIG } from '@/constants/motion';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const gsapHelpers: GSAPHelpers = {
  /**
   * Split text reveal animation with staggered lines (simplified version)
   */
  splitReveal: (element: HTMLElement, options: SplitRevealOptions = {}) => {
    const {
      stagger = MOTION_CONFIG.stagger.lines,
      yStart = 100,
      ease = MOTION_CONFIG.easing.power3Out,
      duration = MOTION_CONFIG.duration.md,
      delay = 0
    } = options;

    // Simple fallback animation for the entire element
    gsap.set(element, { y: yStart, opacity: 0 });

    return gsap.to(element, {
      y: 0,
      opacity: 1,
      duration,
      ease,
      delay
    });
  },

  /**
   * Elastic text stretching effect
   */
  elasticText: (element: HTMLElement) => {
    let tl: GSAPTimeline | null = null;
    
    const handleMouseEnter = () => {
      if (tl) tl.kill();
      tl = gsap.timeline();
      tl.to(element, {
        scaleX: 1.1,
        skewX: 5,
        duration: MOTION_CONFIG.duration.xs,
        ease: MOTION_CONFIG.easing.backOut
      })
      .to(element, {
        scaleX: 1,
        skewX: 0,
        duration: MOTION_CONFIG.duration.sm,
        ease: MOTION_CONFIG.easing.power3Out
      });
    };

    const handleMouseLeave = () => {
      if (tl) tl.kill();
      gsap.to(element, {
        scaleX: 1,
        skewX: 0,
        duration: MOTION_CONFIG.duration.xs,
        ease: MOTION_CONFIG.easing.power3Out
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return gsap.timeline();
  },

  /**
   * Multi-layer parallax peel effect (disabled to prevent positioning issues)
   */
  peelLayers: (container: HTMLElement, layers = 3) => {
    // Completely disabled to prevent inline style issues
    return gsap.timeline();
  },

  /**
   * 3D scatter grid animation
   */
  scatterGrid: (container: HTMLElement, strength = 500, depth = 300) => {
    const items = Array.from(container.children) as HTMLElement[];
    const tl = gsap.timeline();

    // Set initial 3D context
    gsap.set(container, { 
      perspective: 1200,
      transformStyle: 'preserve-3d'
    });

    items.forEach((item, index) => {
      gsap.set(item, {
        transformOrigin: 'center center',
        willChange: 'transform'
      });
    });

    const scatter = () => {
      items.forEach((item, index) => {
        const x = (Math.random() - 0.5) * strength;
        const y = (Math.random() - 0.5) * strength;
        const z = (Math.random() - 0.5) * depth;
        const rotationX = (Math.random() - 0.5) * 90;
        const rotationY = (Math.random() - 0.5) * 90;
        const rotationZ = (Math.random() - 0.5) * 45;

        gsap.to(item, {
          x, y, z: z,
          rotationX, rotationY, rotationZ,
          duration: MOTION_CONFIG.duration.lg,
          ease: MOTION_CONFIG.easing.expoOut,
          delay: index * MOTION_CONFIG.stagger.chips
        });
      });
    };

    const reassemble = () => {
      gsap.to(items, {
        x: 0, y: 0, z: 0,
        rotationX: 0, rotationY: 0, rotationZ: 0,
        duration: MOTION_CONFIG.duration.lg,
        ease: MOTION_CONFIG.easing.power3Out,
        stagger: MOTION_CONFIG.stagger.chips
      });
    };

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: container,
        start: 'top center',
        end: 'bottom center',
        onEnter: scatter,
        onLeaveBack: reassemble
      });
    }

    return tl;
  },

  /**
   * Magnetic cursor attraction
   */
  magnetic: (element: HTMLElement, radius = MAGNETIC_CONFIG.radius, force = MAGNETIC_CONFIG.force) => {
    let isInside = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < radius) {
        if (!isInside) {
          isInside = true;
          element.style.cursor = 'pointer';
        }
        
        const pullX = deltaX * force;
        const pullY = deltaY * force;
        
        gsap.to(element, {
          x: pullX,
          y: pullY,
          duration: MOTION_CONFIG.duration.xs,
          ease: MOTION_CONFIG.easing.power3Out
        });
      } else if (isInside) {
        isInside = false;
        element.style.cursor = '';
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: MOTION_CONFIG.duration.sm,
          ease: MOTION_CONFIG.easing.backOut
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      gsap.set(element, { x: 0, y: 0 });
    };
  }
};

/**
 * Utility function to create scroll-triggered animations
 */
export const createScrollAnimation = (
  trigger: HTMLElement,
  animation: GSAPTween | GSAPTimeline,
  options: ScrollTrigger.Vars = {}
) => {
  if (typeof ScrollTrigger !== 'undefined') {
    return ScrollTrigger.create({
      trigger,
      start: 'top 80%',
      end: 'bottom 20%',
      animation,
      toggleActions: 'play none none reverse',
      ...options
    });
  }
  return null;
};

/**
 * Utility function to kill all ScrollTriggers
 */
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

/**
 * Utility function for reduced motion
 */
export const respectReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Device detection utilities
 */
export const deviceUtils = {
  isMobile: () => window.innerWidth < 768,
  isTouchDevice: () => window.matchMedia('(hover: none) and (pointer: coarse)').matches,
  prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  
  // Conditional animation wrapper
  conditionalAnimate: (animation: () => gsap.core.Timeline, fallback?: () => void) => {
    if (deviceUtils.prefersReducedMotion() || deviceUtils.isMobile()) {
      fallback && fallback();
      return gsap.timeline();
    }
    return animation();
  },
  
  // Safe animation with mobile fallback
  safeAnimate: (target: gsap.TweenTarget, vars: gsap.TweenVars) => {
    if (deviceUtils.prefersReducedMotion()) {
      // Apply end state immediately
      gsap.set(target, {
        ...vars,
        duration: 0.01,
        ease: 'none'
      });
      return gsap.timeline();
    }
    
    if (deviceUtils.isMobile()) {
      // Simplified animation for mobile
      return gsap.to(target, {
        ...vars,
        duration: ((vars.duration as number) || 0.5) * 0.5, // Half duration
        ease: vars.ease || 'power2.out'
      });
    }
    
    return gsap.to(target, vars);
  }
};
