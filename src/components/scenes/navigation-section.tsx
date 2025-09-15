'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

export default function NavigationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const underlineRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const navItems = section.querySelectorAll('.nav-item');

    // Initial setup
    gsap.set(navItems, { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    });

    // Scroll triggered animation
    gsap.to(navItems, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 60%',
        toggleActions: 'play none none none',
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === section) {
          trigger.kill();
        }
      });
    };
  }, []);

  const handleMouseEnter = (itemId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredItem(itemId);
    
    const target = event.currentTarget;
    const underline = underlineRefs.current[itemId];
    
    if (!underline) return;

    // Split text animation effect
    const textSpans = target.querySelectorAll('.char');
    if (textSpans.length > 0) {
      gsap.to(textSpans, {
        x: (index) => (index < textSpans.length / 2) ? -10 : 10,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.02
      });
    }

    // Red underline animation
    gsap.to(underline, {
      scaleX: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    });

    // Text glow effect
    gsap.to(target, {
      textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = (itemId: string, event: React.MouseEvent<HTMLAnchorElement>) => {
    setHoveredItem(null);
    
    const target = event.currentTarget;
    const underline = underlineRefs.current[itemId];
    
    if (!underline) return;

    // Reset text position
    const textSpans = target.querySelectorAll('.char');
    if (textSpans.length > 0) {
      gsap.to(textSpans, {
        x: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.02
      });
    }

    // Hide underline
    gsap.to(underline, {
      scaleX: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Remove text glow
    gsap.to(target, {
      textShadow: '0 0 0px rgba(255, 255, 255, 0)',
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

  // Split text into individual characters for animation
  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section 
      id="navigation"
      ref={sectionRef}
      className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full" />
        <div className="absolute top-40 right-32 w-3 h-3 bg-white rounded-full" />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-2.5 h-2.5 bg-white rounded-full" />
      </div>

      {/* Main navigation content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-8 md:space-y-12">
          {navigationItems.map((item, index) => (
            <div key={item.id} className="relative">
              <a
                href={item.href}
                className="nav-item block relative text-[8vw] md:text-[6vw] lg:text-[5vw] xl:text-[4vw] font-black leading-none tracking-wider text-white cursor-pointer transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item.href);
                }}
                onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                onMouseLeave={(e) => handleMouseLeave(item.id, e)}
                style={{
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  fontWeight: 900,
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  transformStyle: 'preserve-3d'
                }}
              >
                {splitText(item.label)}
                {index < navigationItems.length - 1 && (
                  <span className="ml-4 text-white/60">,</span>
                )}
              </a>
              
              {/* Red underline */}
              <div
                ref={(el) => {
                  underlineRefs.current[item.id] = el;
                }}
                className="absolute bottom-[-8px] left-0 right-0 h-1 bg-red-500 transform scale-x-0 opacity-0"
                style={{ transformOrigin: 'left center' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .nav-item {
          user-select: none;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .char {
          transition: transform 0.1s ease-out;
          will-change: transform;
        }
        
        .nav-item:hover .char {
          transform-origin: center bottom;
        }
        
        @media (max-width: 768px) {
          .space-y-8 > * + * {
            margin-top: 2rem;
          }
        }
        
        @media (max-width: 640px) {
          .space-y-8 > * + * {
            margin-top: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
