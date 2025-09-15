'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!progressRef.current) return;

    const progress = progressRef.current;

    // Set initial state
    gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });

    // Create scroll progress animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          gsap.to(progress, {
            scaleX: self.progress,
            duration: 0.1,
            ease: 'none',
          });
        },
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9998] pointer-events-none">
      <div
        ref={progressRef}
        className="h-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-lime"
        style={{
          boxShadow: '0 0 10px currentColor',
        }}
      />
    </div>
  );
}
