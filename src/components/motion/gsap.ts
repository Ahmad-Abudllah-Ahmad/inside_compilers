import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);
}

// Motion Tokens
export const motion = {
  duration: {
    xs: 0.18,
    sm: 0.28,
    md: 0.45,
    lg: 0.75,
    xl: 1.2,
  },
  ease: {
    power3: 'power3.out',
    expo: 'expo.out',
    back: 'back.out(1.7)',
    custom: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  stagger: {
    lines: 0.06,
    words: 0.03,
    chars: 0.02,
  },
};

// Reusable GSAP Helpers
export const gsapHelpers = {
  // Split text reveal animation
  splitReveal: (
    element: HTMLElement | string,
    options: {
      stagger?: number;
      yStart?: number;
      ease?: string;
      duration?: number;
    } = {}
  ) => {
    const { stagger = motion.stagger.lines, yStart = 100, ease = motion.ease.power3, duration = motion.duration.md } = options;
    
    const split = new SplitText(element, { type: 'lines', linesClass: 'split-line' });
    
    gsap.set(split.lines, { y: yStart, opacity: 0 });
    
    return gsap.to(split.lines, {
      y: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
    });
  },

  // Elastic text stretch effect
  elasticText: (element: HTMLElement | string) => {
    const split = new SplitText(element, { type: 'chars', charsClass: 'elastic-char' });
    
    gsap.set(split.chars, { transformOrigin: 'center center' });
    
    return {
      stretch: () => gsap.to(split.chars, {
        scaleX: 1.2,
        skewX: 5,
        duration: motion.duration.sm,
        ease: motion.ease.back,
        stagger: motion.stagger.chars,
      }),
      snap: () => gsap.to(split.chars, {
        scaleX: 1,
        skewX: 0,
        duration: motion.duration.md,
        ease: motion.ease.back,
        stagger: motion.stagger.chars,
      }),
    };
  },

  // Parallax layers with different speeds
  peelLayers: (container: HTMLElement, layers: number = 3) => {
    const layerElements = container.querySelectorAll('[data-layer]');
    
    layerElements.forEach((layer, index) => {
      const speed = (index + 1) / layers;
      const element = layer as HTMLElement;
      
      gsap.to(element, {
        y: () => -window.innerHeight * speed * 0.5,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  },

  // 3D scatter animation
  scatterGrid: (container: HTMLElement, strength: number = 1, depth: number = 200) => {
    const items = container.querySelectorAll('[data-scatter-item]');
    const originalPositions: Array<{ x: number; y: number; z: number }> = [];
    
    // Store original positions
    items.forEach((item, index) => {
      const element = item as HTMLElement;
      originalPositions[index] = { x: 0, y: 0, z: 0 };
    });
    
    const scatter = () => {
      items.forEach((item, index) => {
        const element = item as HTMLElement;
        const x = (Math.random() - 0.5) * window.innerWidth * strength;
        const y = (Math.random() - 0.5) * window.innerHeight * strength;
        const z = Math.random() * depth - depth / 2;
        
        gsap.to(element, {
          x,
          y,
          z,
          rotationX: Math.random() * 360,
          rotationY: Math.random() * 360,
          duration: motion.duration.lg,
          ease: motion.ease.expo,
        });
      });
    };
    
    const gather = () => {
      items.forEach((item) => {
        const element = item as HTMLElement;
        gsap.to(element, {
          x: 0,
          y: 0,
          z: 0,
          rotationX: 0,
          rotationY: 0,
          duration: motion.duration.lg,
          ease: motion.ease.expo,
        });
      });
    };
    
    return { scatter, gather };
  },

  // Magnetic cursor attraction
  magnetic: (element: HTMLElement, radius: number = 80, force: number = 0.3) => {
    let isHovering = false;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      if (distance < radius) {
        const x = (e.clientX - centerX) * force;
        const y = (e.clientY - centerY) * force;
        
        gsap.to(element, {
          x,
          y,
          duration: motion.duration.sm,
          ease: motion.ease.power3,
        });
      }
    };
    
    const handleMouseEnter = () => {
      isHovering = true;
    };
    
    const handleMouseLeave = () => {
      isHovering = false;
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: motion.duration.md,
        ease: motion.ease.back,
      });
    };
    
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  },
};

// Kill all ScrollTriggers (useful for route changes)
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
};

export { gsap, ScrollTrigger, SplitText };
