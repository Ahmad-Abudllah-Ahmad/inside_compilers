'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CursorSpotlight() {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices
    const isDesktop = window.innerWidth >= 768 && !('ontouchstart' in window);
    setIsVisible(isDesktop);

    if (!isDesktop || !spotlightRef.current) return;

    const spotlight = spotlightRef.current;

    // Set initial styles
    gsap.set(spotlight, {
      scale: 0,
      opacity: 0,
    });

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(spotlight, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      gsap.to(spotlight, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(spotlight, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.inOut',
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}
