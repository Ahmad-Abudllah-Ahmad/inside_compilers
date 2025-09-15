'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface StairsTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
  direction?: 'in' | 'out';
  stairCount?: number;
  duration?: number;
}

export default function StairsTransition({ 
  isActive, 
  onComplete, 
  direction = 'in', 
  stairCount = 8,
  duration = 1.2 
}: StairsTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !isActive) return;

    const stairs = containerRef.current.querySelectorAll('.stair');
    
    if (direction === 'in') {
      // Stairs coming in (covering the screen)
      gsap.set(stairs, { scaleY: 0, transformOrigin: 'bottom' });
      
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      tl.to(stairs, {
        scaleY: 1,
        duration: duration / 2,
        stagger: {
          amount: duration / 3,
          from: 'start'
        },
        ease: 'power3.out'
      });

    } else {
      // Stairs going out (revealing the screen)
      gsap.set(stairs, { scaleY: 1, transformOrigin: 'top' });
      
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      tl.to(stairs, {
        scaleY: 0,
        duration: duration / 2,
        stagger: {
          amount: duration / 3,
          from: 'end'
        },
        ease: 'power3.in'
      });
    }

  }, [isActive, direction, duration, onComplete]);

  if (!isActive) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ 
        background: 'transparent',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      {Array.from({ length: stairCount }, (_, index) => (
        <div
          key={index}
          className="stair"
          style={{
            width: `${100 / stairCount}%`,
            height: '100vh',
            backgroundColor: '#0a0a0a',
            borderRight: index < stairCount - 1 ? '1px solid #1a1a1a' : 'none',
            transformOrigin: direction === 'in' ? 'bottom' : 'top'
          }}
        />
      ))}
    </div>
  );
}
