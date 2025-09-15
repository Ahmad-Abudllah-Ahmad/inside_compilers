'use client';

import React, { useEffect, useRef } from 'react';
import ScrollFloat from '@/components/ui/ScrollFloat';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// HeroNavButton component with flowing marquee animation
function HeroNavButton({ text, targetId, image }: { text: string; targetId: string; image: string }) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);

  const animationDefaults = { duration: 0.3, ease: 'power2.out' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };


  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);
    
    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { 
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: '64px',
        y: edge === 'top' ? '-101%' : '101%',
        zIndex: 999999,
        display: 'block',
        visibility: 'visible'
      }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;

    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .set(marqueeRef.current, {
        display: 'none',
        visibility: 'hidden'
      }, animationDefaults.duration);
  };

  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: target, offsetY: 0 },
        ease: 'power2.inOut'
      });
    }
  };

  const repeatedMarqueeContent = Array.from({ length: 25 }).map((_, idx) => (
    <div key={idx} className="flex items-center" style={{ gap: '16px' }}>
      <span className="text-black font-semibold text-2xl md:text-3xl lg:text-4xl whitespace-nowrap">{text}</span>
      <div className="w-[60px] h-[30px] md:w-[80px] md:h-[40px] rounded-full bg-cover flex-shrink-0" style={{ backgroundImage: `url(${image})` }} />
    </div>
  ));

  return (
    <div 
      className="relative overflow-hidden text-center cursor-pointer group hero-nav-button h-16 w-full" 
      ref={itemRef}
      style={{ boxShadow: '0 -1px rgba(255,255,255,0.3), 0 1px rgba(255,255,255,0.3)', zIndex: 300 }}
    >
      <button 
        className="flex items-center justify-center h-full w-full relative cursor-pointer text-white font-black text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[5vw] xl:text-[4vw] leading-none tracking-wider transition-all duration-300 bg-transparent border-none pointer-events-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ zIndex: 10 }}
      >
        <span className="relative striped-text" style={{ zIndex: 20 }}>{text}</span>
      </button>
      
      <div 
        className="marquee white-strip"
        ref={marqueeRef}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '64px',
          overflow: 'hidden',
          pointerEvents: 'none',
          backgroundColor: 'white',
          background: 'white',
          backgroundImage: 'none',
          backgroundBlendMode: 'normal',
          transform: 'translate3d(0, -100%, 0)', 
          zIndex: 999999,
          margin: 0,
          padding: 0,
          border: 'none',
          boxShadow: 'none'
        }}
      >
        <div className="marquee__inner-wrap" ref={marqueeInnerRef} style={{ height: '100%', width: '200%', display: 'flex', transform: 'translateX(0)', backgroundColor: '#ffffff' }}>
          <div className="marquee__inner" style={{ display: 'flex', alignItems: 'center', position: 'relative', height: '100%', width: '200%', willChange: 'transform', animation: 'marquee 25s linear infinite', gap: '16px', backgroundColor: '#ffffff' }}>
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const insideRef = useRef<HTMLSpanElement>(null);
  const compilerRef = useRef<HTMLSpanElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const sinceRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!insideRef.current || !compilerRef.current || !descriptionRef.current || !sinceRef.current || !navigationRef.current || !titleContainerRef.current) return;

    // Kill any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger === sectionRef.current) {
        trigger.kill();
      }
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=600%",
        scrub: true,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 0,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onRefresh: () => {
          // Reset to initial state on refresh
          gsap.set([insideRef.current, compilerRef.current], { 
            x: 0,
            y: 0,
            opacity: 1,
            visibility: "visible",
            zIndex: 30,
            clearProps: "transform"
          });
          gsap.set(titleContainerRef.current, {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            transformOrigin: "center center",
            clearProps: "transform"
          });
          gsap.set([descriptionRef.current, sinceRef.current, navigationRef.current], { 
            opacity: 0, 
            y: 50,
            visibility: "hidden",
            display: "none",
            scale: 1,
            filter: "none",
            clearProps: "transform"
          });
        },
        onUpdate: (self) => {
          // Ensure proper layering during animation
          if (self.progress === 0) {
            gsap.set([descriptionRef.current, sinceRef.current, navigationRef.current], { 
              opacity: 0,
              visibility: "hidden",
              display: "none"
            });
            gsap.set([insideRef.current, compilerRef.current], {
              x: 0,
              y: 0,
              opacity: 1,
              visibility: "visible"
            });
          }
        }
      }
    });

    // Initial state - text centered and visible
    gsap.set([insideRef.current, compilerRef.current], {
      x: 0,
      y: 0,
      opacity: 1,
      visibility: "visible",
      zIndex: 30
    });
    gsap.set([descriptionRef.current, sinceRef.current, navigationRef.current], {
      opacity: 0,
      y: 50,
      visibility: "hidden",
      display: "none"
    });

    // Stage 1: Split text and reveal description (responsive positioning)
    const isMobile = window.innerWidth < 768;
    const splitDistance = isMobile ? "-25vw" : "-35vw";
    
    tl.to(insideRef.current, {
      x: splitDistance,
      duration: 0.6,
      ease: "power2.inOut"
    }, 0)
    .to(compilerRef.current, {
      x: isMobile ? "25vw" : "35vw", 
      duration: 0.6,
      ease: "power2.inOut"
    }, 0)
    .set(descriptionRef.current, {
      display: "flex"
    }, 0.3)
    .to(descriptionRef.current, {
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.5,
      ease: "power2.out"
    }, 0.3)
    
    // Stage 2: Hide description, show "Since 2023"
    .to(descriptionRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: "power2.inOut"
    }, 0.8)
    .set(descriptionRef.current, {
      visibility: "hidden",
      display: "none"
    }, 1.1)
    .set(sinceRef.current, {
      display: "flex"
    }, 0.9)
    .to(sinceRef.current, {
      opacity: 1,
      y: 0,
      visibility: "visible",
      duration: 0.5,
      ease: "power2.out"
    }, 0.9)
    
    // Stage 3: Combine text and zoom in
    .to(sinceRef.current, {
      opacity: 0,
      y: -30,
      duration: 0.3,
      ease: "power2.inOut"
    }, 1.3)
    .set(sinceRef.current, {
      visibility: "hidden",
      display: "none"
    }, 1.6)
    
    // Combine INSIDE and COMPILERS
    .to([insideRef.current, compilerRef.current], {
      x: 0,
      duration: 0.8,
      ease: "power2.inOut"
    }, 1.4)
    
    // Stage 4: Continuous zoom into the letter O in COMPILERS
    // Position transform origin on the O letter in COMPILERS (precise positioning)
    .set(titleContainerRef.current, {
      transformOrigin: "85% center" // The O in COMPILERS is approximately at 85% from left
    }, 2.0)
    
    // Progressive zoom into the O with blur effects
    .to(titleContainerRef.current, {
      scale: 2,
      filter: "blur(0px)",
      duration: 1.5,
      ease: "power1.inOut"
    }, 2.0)
    
    .to(titleContainerRef.current, {
      scale: 4,
      filter: "blur(1px)",
      duration: 1.5,
      ease: "power1.inOut"
    }, 3.2)
    
    .to(titleContainerRef.current, {
      scale: 8,
      filter: "blur(2px)",
      duration: 1.5,
      ease: "power1.inOut"
    }, 4.4)
    
    .to(titleContainerRef.current, {
      scale: 16,
      filter: "blur(4px)",
      duration: 1.5,
      ease: "power1.inOut"
    }, 5.6)
    
    .to(titleContainerRef.current, {
      scale: 32,
      filter: "blur(8px)",
      duration: 1.5,
      ease: "power1.inOut"
    }, 6.8)
    
    .to(titleContainerRef.current, {
      scale: 64,
      filter: "blur(16px)",
      duration: 1.2,
      ease: "power2.inOut"
    }, 8.0)
    
    // Final zoom - text disappears into the O with maximum blur
    .to(titleContainerRef.current, {
      scale: 150,
      filter: "blur(32px)",
      opacity: 0,
      duration: 1.0,
      ease: "power3.in"
    }, 9.0)
    
    // Show navigation emerging from inside the O with shining effects
    .set(navigationRef.current, {
      display: "block",
      scale: 0.1,
      opacity: 0,
      filter: "blur(10px) brightness(0.3)"
    }, 9.8)
    .to(navigationRef.current, {
      opacity: 1,
      scale: 1,
      filter: "blur(0px) brightness(1) drop-shadow(0 0 20px rgba(255,255,255,0.8))",
      visibility: "visible",
      pointerEvents: "auto",
      duration: 1.5,
      ease: "back.out(1.7)"
    }, 9.8)
    
    // Add extra glow/shine effect that fades out
    .to(navigationRef.current, {
      filter: "blur(0px) brightness(1) drop-shadow(0 0 0px rgba(255,255,255,0))",
      duration: 2.0,
      ease: "power2.out"
    }, 11.0);

    return () => {
      // Cleanup on component unmount
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };

  }, []);

  return (
    <section 
      id="home"
      ref={sectionRef}
      className="relative h-screen text-text overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Main Title */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8" style={{ zIndex: 1 }}>
        <div className="text-center w-full max-w-none">
          <div ref={titleContainerRef} className="text-[8vw] sm:text-[7vw] md:text-[8vw] lg:text-[9vw] xl:text-[10vw] 2xl:text-[11vw] font-bold leading-none tracking-wider flex items-center justify-center gap-1 sm:gap-2 md:gap-4 lg:gap-6 whitespace-nowrap transform-gpu will-change-transform">
            <span ref={insideRef} className="inline-block text-text transform-gpu will-change-transform" style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}>
              <ScrollFloat
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='center bottom+=50%'
                scrollEnd='bottom bottom-=40%'
                stagger={0.03}
              >
                INSIDE
              </ScrollFloat>
            </span>
            <span ref={compilerRef} className="inline-block text-text transform-gpu will-change-transform" style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}>
              <ScrollFloat
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='center bottom+=50%'
                scrollEnd='bottom bottom-=40%'
                stagger={0.03}
              >
                COMPILERS
              </ScrollFloat>
            </span>
          </div>
        </div>
      </div>

      {/* Stage 1: Center Description */}
      <div 
        ref={descriptionRef}
        className="absolute inset-0 flex items-center justify-center opacity-0 z-20 pointer-events-none"
        style={{ visibility: 'hidden' }}
      >
        <div className="text-center max-w-xs sm:max-w-sm md:max-w-md px-4">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 text-text-secondary">
            DIGITAL SOLUTIONS
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-text-secondary leading-relaxed mb-3 sm:mb-4">
            WEB DEVELOPMENT<br />
            AUTOMATION<br />
            AI INTEGRATION
          </p>
          <div className="text-xs sm:text-sm text-text-muted">
            TRANSFORMING IDEAS INTO<br />
            DIGITAL REALITY
          </div>
        </div>
      </div>

      {/* Stage 2: Since 2023 */}
      <div 
        ref={sinceRef}
        className="absolute inset-0 flex items-center justify-center opacity-0 z-20 pointer-events-none"
        style={{ visibility: 'hidden' }}
      >
        <div className="text-center px-4">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-accent-cyan mb-2 sm:mb-3 md:mb-4">
            SINCE 2023
          </div>
          <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-2">
            Building digital experiences that transform businesses and elevate brands
          </p>
        </div>
      </div>

      {/* Stage 3: Navigation Menu */}
      <div 
        ref={navigationRef}
        className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
        style={{ visibility: 'hidden', transform: 'scale(0.8)', zIndex: 100 }}
      >
        <div className="w-full h-full relative">
          {/* Main navigation in center */}
          <div className="flex flex-col items-center justify-center h-full w-full px-4 pointer-events-auto" style={{ zIndex: 100 }}>
            <HeroNavButton 
              text="SERVICES" 
              targetId="services" 
              image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop" 
            />
            <HeroNavButton 
              text="PROJECTS" 
              targetId="projects" 
              image="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=600&h=400&fit=crop" 
            />
            <HeroNavButton 
              text="ABOUT" 
              targetId="about" 
              image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
            />
            <HeroNavButton 
              text="CONTACT" 
              targetId="contact" 
              image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop" 
            />
          </div>
        </div>
      </div>


      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-accent-cyan rounded-full opacity-30" />
        <div className="absolute top-40 right-32 w-3 h-3 bg-accent-purple rounded-full opacity-20" />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-accent-lime rounded-full opacity-25" />
        <div className="absolute bottom-20 right-20 w-2.5 h-2.5 bg-accent-cyan rounded-full opacity-15" />
      </div>

      {/* Custom styles for navigation hover effects */}
      <style jsx>{`
        button .striped-text {
          background: repeating-linear-gradient(
            45deg,
            #ffffff 0px,
            #ffffff 8px,
            #00bcd4 8px,
            #00bcd4 16px,
            #9c27b0 16px,
            #9c27b0 24px,
            #cddc39 24px,
            #cddc39 32px
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          background-size: 32px 32px;
          animation: stripe-move 2s linear infinite;
        }
        
        .marquee span {
          background: none !important;
          -webkit-text-fill-color: inherit !important;
          color: black !important;
        }
        
        @keyframes stripe-move {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 32px 0;
          }
        }
        
        .nav-item {
          user-select: none;
          transform-origin: center bottom;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .nav-item:hover {
          transform: skewX(-2deg) scale(1.02);
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
        
        .nav-link:hover {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .marquee-animation {
          animation: marquee-flow 20s linear infinite;
          will-change: transform;
          animation-play-state: running !important;
        }
        
        .marquee {
          z-index: 500 !important;
        }
        
        .hero-nav-button {
          z-index: 300 !important;
        }
        
        .hero-nav-button:hover .marquee {
          z-index: 9999 !important;
        }
        
        /* Override any conflicting z-index */
        .hero-nav-button * {
          position: relative;
        }
        
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        @keyframes marquee-flow {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .marquee-flow {
          animation: marquee-flow 15s linear infinite;
          will-change: transform;
        }
        
        .marquee__inner {
          animation: marquee 25s linear infinite !important;
        }
        
        .white-strip {
          background-color: white !important;
          background: white !important;
          background-image: none !important;
          background-blend-mode: normal !important;
        }
        
        .white-strip * {
          background-color: white !important;
          background: white !important;
          background-image: none !important;
        }
        
        .marquee.white-strip {
          background-color: white !important;
          background: white !important;
        }
        
        div.marquee {
          background-color: white !important;
          background: white !important;
        }
        
        /* Override any striped or gradient backgrounds */
        .marquee, .marquee *, 
        .hero-nav-button .marquee,
        .hero-nav-button .marquee *,
        .marquee .striped-text,
        .marquee span {
          background: white !important;
          background-color: white !important;
          background-image: none !important;
          background-clip: border-box !important;
          -webkit-background-clip: border-box !important;
          -webkit-text-fill-color: black !important;
          color: black !important;
        }
        
        /* Force marquee to always be white */
        .marquee[style*="background"] {
          background: white !important;
          background-color: white !important;
        }
        
        /* Ensure marquee covers full screen edge-to-edge */
        .marquee {
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
          position: fixed !important;
          z-index: 999999 !important;
          box-sizing: border-box !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
        }
        
        /* Force marquee to break out of container constraints */
        .hero-nav-button .marquee {
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          margin: 0 !important;
          padding: 0 !important;
          z-index: 999999 !important;
          position: fixed !important;
          box-sizing: border-box !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
        }
        
        /* Ensure marquee appears above everything */
        .hero-nav-button:hover .marquee {
          z-index: 999999 !important;
          display: block !important;
          visibility: visible !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
        }
        
        /* Marquee strip styles */
        .marquee {
          position: fixed !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          height: 64px !important;
          z-index: 999999 !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
        }
          
          /* Disable complex transforms on mobile for performance */
          .nav-item:hover {
            transform: scale(1.02);
          }
        }
        
        @media (max-width: 480px) {
          .nav-item {
            font-size: 14vw !important;
          }
          
          .space-y-4 > * + * {
            margin-top: 0.75rem;
          }
        }
      `}</style>
    </section>
  );
}
