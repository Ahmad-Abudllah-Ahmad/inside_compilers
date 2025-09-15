'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ScrollFloatProps {
  children: React.ReactNode;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

export default function ScrollFloat({
  children,
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03
}: ScrollFloatProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const element = elementRef.current;
    const chars = element.textContent?.split('') || [];
    
    // Clear the original text and create spans for each character
    element.innerHTML = '';
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      element.appendChild(span);
    });

    const charSpans = element.querySelectorAll('span');

    // Create the scroll-triggered animation
    gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: scrollStart,
        end: scrollEnd,
        scrub: false,
        toggleActions: 'play none none reverse'
      }
    }).to(charSpans, {
      opacity: 1,
      y: 0,
      duration: animationDuration,
      ease: ease,
      stagger: stagger
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <div ref={elementRef} className="inline-block">
      {children}
    </div>
  );
}
