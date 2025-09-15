'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollRevealProps {
  children: React.ReactNode;
  baseOpacity?: number;
  enableBlur?: boolean;
  baseRotation?: number;
  blurStrength?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  baseOpacity = 0,
  enableBlur = true,
  baseRotation = 5,
  blurStrength = 10,
  className = ''
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const element = elementRef.current;

    // Set initial state
    gsap.set(element, {
      opacity: baseOpacity,
      rotation: baseRotation,
      filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
    });

    // Create the scroll-triggered animation
    gsap.to(element, {
      opacity: 1,
      rotation: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [baseOpacity, enableBlur, baseRotation, blurStrength]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
