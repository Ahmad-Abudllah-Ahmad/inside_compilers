'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { id: 'services', label: 'SERVICES', href: '#services' },
  { id: 'projects', label: 'PROJECTS', href: '#projects' },
  { id: 'about', label: 'ABOUT', href: '#about' },
  { id: 'contact', label: 'CONTACT', href: '#contact' },
];

export default function AnimatedNavigation() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (itemId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredItem(itemId);
    
    const target = event.currentTarget;
    const container = containerRef.current;
    const underline = underlineRef.current;
    
    if (!container || !underline) return;

    // Get the position and width of the hovered item
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    
    const left = targetRect.left - containerRect.left;
    const width = targetRect.width;

    // Animate underline to the hovered item
    gsap.to(underline, {
      x: left,
      width: width,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Animate text with slight skew and scale
    gsap.to(target, {
      skewX: -2,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredItem(null);
    
    const target = event.currentTarget;
    const underline = underlineRef.current;
    
    if (!underline) return;

    // Hide underline
    gsap.to(underline, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Reset text transform
    gsap.to(target, {
      skewX: 0,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleClick = (href: string) => {
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <nav className="w-full">
      <div 
        ref={containerRef}
        className="relative flex items-center justify-center gap-8 md:gap-16 lg:gap-24 py-8"
      >
        {/* Red underline indicator */}
        <div
          ref={underlineRef}
          className="absolute bottom-0 h-1 bg-red-500 opacity-0"
          style={{ transformOrigin: 'left center' }}
        />

        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              handleClick(item.href);
            }}
            onMouseEnter={(e) => handleMouseEnter(item.id, e)}
            onMouseLeave={handleMouseLeave}
            className="relative text-[4vw] md:text-[3vw] lg:text-[2.5vw] xl:text-[2vw] font-bold leading-none tracking-wide text-white hover:text-white/90 transition-colors duration-300 cursor-pointer will-change-transform"
            style={{
              fontFamily: 'Arial, Helvetica, sans-serif',
              fontWeight: 900,
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased'
            }}
          >
            {item.label}
            {item.id !== 'contact' && <span className="ml-2 text-white/60">,</span>}
          </a>
        ))}
      </div>

      {/* Custom styles for enhanced animations */}
      <style jsx>{`
        nav {
          user-select: none;
        }
        
        a {
          transform-origin: center bottom;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        a:hover {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        
        @media (max-width: 768px) {
          .gap-8 {
            gap: 1rem;
          }
        }
      `}</style>
    </nav>
  );
}
