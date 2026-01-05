'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { gsapHelpers } from '@/components/motion/gsap-helpers';
import { motion } from 'framer-motion';
import Galaxy from '@/components/ui/Galaxy';

const services = [
  {
    id: 'web-dev',
    title: 'Web Development',
    description: 'Modern, responsive web applications built with cutting-edge technologies like Next.js, React, and TypeScript.',
    icon: '🚀',
    gradient: 'from-blue-400 to-cyan-400',
    features: [
      'Next.js & React',
      'TypeScript',
      'Responsive Design',
      'Performance Optimization'
    ]
  },
  {
    id: 'automation',
    title: 'Automation Solutions',
    description: 'Streamline your workflows with custom automation tools and integrations that save time and reduce manual work.',
    icon: '🤖',
    gradient: 'from-purple-400 to-pink-400',
    features: [
      'Process Automation',
      'API Integrations',
      'Workflow Tools',
      'Custom Scripts'
    ]
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    description: 'Integrate powerful AI capabilities into your applications with custom models and intelligent automation.',
    icon: '🧠',
    gradient: 'from-green-400 to-blue-400',
    features: [
      'Custom AI Models',
      'Natural Language Processing',
      'Machine Learning',
      'Intelligent Automation'
    ]
  }
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !cardsRef.current) return;

    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current.querySelectorAll('.service-card');

    // Wait for DOM to be fully rendered
    setTimeout(() => {
      // Initial setup for cards and title
      gsap.set(title, { opacity: 0, y: 50 });
      cards.forEach((card, index) => {
        gsap.set(card, {
          y: index * 20, // Stack initial positioning
          scale: 1 - (index * 0.05),
          zIndex: services.length - index,
          opacity: index === 0 ? 1 : 0,
          rotationZ: index * 2, // Slight rotation for stack effect
          filter: 'blur(0px)'
        });
      });

      // Create scroll-triggered timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=400%', // Extended scroll area for all cards
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Title reveal
      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Sequential one-after-another card animations with blur effect
      cards.forEach((card, index) => {
        const leftText = card.querySelector('.service-title-left');
        const rightText = card.querySelector('.service-title-right');

        // Ensure we found the text elements
        if (!leftText || !rightText) {
          console.warn(`Text elements not found for card ${index}`);
          return;
        }

        // Set initial positions - alternate directions for each card
        const isEvenCard = index % 2 === 0;

        // Responsive positioning based on screen width
        const isMobile = window.innerWidth < 768;
        const moveDistance = isMobile ? 400 : 800;

        gsap.set(leftText, {
          x: isEvenCard ? -moveDistance : moveDistance,
          y: Math.random() * 50 - 25,
          rotation: Math.random() * 15 - 7.5,
          opacity: 0,
          force3D: true
        });

        gsap.set(rightText, {
          x: isEvenCard ? moveDistance : -moveDistance,
          y: Math.random() * 50 - 25,
          rotation: Math.random() * 15 - 7.5,
          opacity: 0,
          force3D: true
        });

        if (index === 0) {
          // Animate first card text floating in from left
          tl.to(leftText, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 0.5,
            duration: 1.2,
            ease: 'power2.out'
          }, 0.2)
            .to(rightText, {
              x: 0,
              y: 0,
              rotation: 0,
              opacity: 0.5,
              duration: 1.2,
              ease: 'power2.out'
            }, 0.4)
            .to({}, { duration: 1.0 });
          return;
        }

        const startTime = index * 1.2; // Clean sequential timing

        // Animate current card sliding up from bottom
        tl.to(card, {
          opacity: 1, // Make card visible
          y: 0,
          scale: 1,
          rotationZ: 0,
          filter: 'blur(0px)',
          zIndex: 20 + index, // Bring to front
          duration: 0.8,
          ease: 'power3.out'
        }, startTime)

          // Float in current text from left
          .to(leftText, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 0.5,
            duration: 1.0,
            ease: 'power2.out'
          }, startTime - 0.3)

          .to(rightText, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 0.5,
            duration: 1.0,
            ease: 'power2.out'
          }, startTime - 0.1)

          // Hold the card fully visible
          .to({}, { duration: 0.8 })

          // Push previous card to background
          .to(cards[index - 1], {
            filter: 'blur(8px)',
            scale: 0.88,
            y: -30,
            opacity: 0.7,
            zIndex: 15 - index,
            rotationZ: (Math.random() - 0.5) * 6,
            duration: 0.6,
            ease: 'power2.out'
          }, startTime + 0.3)

        // Float out previous text - alternating directions
        const prevIsEvenCard = (index - 1) % 2 === 0;
        tl.to(cards[index - 1].querySelector('.service-title-left'), {
          x: prevIsEvenCard ? -(isMobile ? 500 : 1000) : (isMobile ? 500 : 1000), // Responsive exit directions
          y: Math.random() * 100 - 50,
          rotation: Math.random() * 30 - 15,
          opacity: 0,
          duration: 1.0,
          ease: 'power2.in'
        }, startTime + 0.2)

          .to(cards[index - 1].querySelector('.service-title-right'), {
            x: prevIsEvenCard ? (isMobile ? 500 : 1000) : -(isMobile ? 500 : 1000), // Responsive exit directions
            y: Math.random() * 100 - 50,
            rotation: Math.random() * 30 - 15,
            opacity: 0,
            duration: 1.0,
            ease: 'power2.in'
          }, startTime + 0.4);
      });

      // Setup magnetic effect for cards
      cards.forEach((card) => {
        gsapHelpers.magnetic(card as HTMLElement, 40, 0.15);
      });

    }, 100);

  }, []);

  const handleCardHover = (cardId: string) => {
    setHoveredCard(cardId);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="min-h-screen w-full relative overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Galaxy Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}>
        <Galaxy
          mouseRepulsion={true}
          mouseInteraction={true}
          density={0.8}
          glowIntensity={0.8}
          saturation={0.1}
          hueShift={0}
          twinkleIntensity={0.6}
          rotationSpeed={0.02}
          starSpeed={0.1}
          speed={0.3}
          transparent={true}
        />
      </div>

      <div className="h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 10 }}>
        <h2
          ref={titleRef}
          className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-8 sm:mb-10 md:mb-12 z-20 px-4"
        >
          <span className="astloch-regular">W</span>hat <span className="astloch-regular">W</span>e <span className="text-accent-purple"><span className="astloch-regular">B</span>uild</span>
        </h2>

        <div ref={cardsRef} className="relative w-full h-full flex-1 flex items-center justify-center">
          {services.map((service, index) => {
            // Split service title for left/right layout
            const titleWords = service.title.toUpperCase().split(' ');
            const leftText = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
            const rightText = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

            return (
              <div
                key={service.id}
                className="service-card absolute w-[90vw] max-w-[700px] h-[60vh] max-h-[400px] min-h-[350px] sm:w-[700px] sm:h-[400px] flex items-center justify-center"
                onMouseEnter={() => handleCardHover(service.id)}
                onMouseLeave={handleCardLeave}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                  zIndex: services.length - index, // Stack cards with proper z-index
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Background Text - Left */}
                <div className="absolute left-[-30px] sm:left-[-50px] md:left-[-100px] top-1/2 transform -translate-y-1/2 z-0">
                  <h3
                    className="service-title-left text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[100px] font-black leading-none tracking-tight opacity-50"
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '3px white',
                      WebkitFontSmoothing: 'antialiased',
                      textRendering: 'optimizeLegibility',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontWeight: 900
                    }}
                  >
                    {leftText}
                  </h3>
                </div>

                {/* Background Text - Right */}
                <div className="absolute right-[-30px] sm:right-[-50px] md:right-[-100px] top-1/2 transform -translate-y-1/2 z-0">
                  <h3
                    className="service-title-right text-[8vw] sm:text-[7vw] md:text-[6vw] lg:text-[100px] font-black leading-none tracking-tight opacity-50"
                    style={{
                      color: 'transparent',
                      WebkitTextStroke: '3px white',
                      WebkitFontSmoothing: 'antialiased',
                      textRendering: 'optimizeLegibility',
                      fontFamily: 'Arial, Helvetica, sans-serif',
                      fontWeight: 900
                    }}
                  >
                    {rightText}
                  </h3>
                </div>

                {/* Central Card - White with Scalloped Edges on Top and Bottom */}
                <div className="relative z-10 w-72 h-80 sm:w-80 sm:h-96 bg-white shadow-2xl flex flex-col items-center justify-center p-4 sm:p-6 transform rotate-1"
                  style={{
                    clipPath: `polygon(
                         0% 8px,
                         5% 0%, 10% 8px,
                         15% 0%, 20% 8px,
                         25% 0%, 30% 8px,
                         35% 0%, 40% 8px,
                         45% 0%, 50% 8px,
                         55% 0%, 60% 8px,
                         65% 0%, 70% 8px,
                         75% 0%, 80% 8px,
                         85% 0%, 90% 8px,
                         95% 0%, 100% 8px,
                         100% calc(100% - 8px),
                         95% 100%, 90% calc(100% - 8px),
                         85% 100%, 80% calc(100% - 8px),
                         75% 100%, 70% calc(100% - 8px),
                         65% 100%, 60% calc(100% - 8px),
                         55% 100%, 50% calc(100% - 8px),
                         45% 100%, 40% calc(100% - 8px),
                         35% 100%, 30% calc(100% - 8px),
                         25% 100%, 20% calc(100% - 8px),
                         15% 100%, 10% calc(100% - 8px),
                         5% 100%, 0% calc(100% - 8px)
                       )`,
                    fontFamily: 'Kalam, cursive'
                  }}>
                  {/* Service Icon */}
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">
                    {service.icon}
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-black mb-3 sm:mb-4 text-center">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-700 text-center leading-relaxed mb-3 sm:mb-4 px-2 sm:px-3">
                    {service.description}
                  </p>

                  {/* Technology/Features Title */}
                  <h4 className="text-sm sm:text-base md:text-lg font-bold text-black mb-2 text-center">
                    {service.features[0]}
                  </h4>

                  {/* Features List */}
                  <div className="space-y-0.5 sm:space-y-1 text-center">
                    {service.features.slice(1).map((feature, idx) => (
                      <div key={idx} className="text-xs sm:text-sm font-medium text-gray-600">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Marquee section - positioned absolutely at bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-30">
          <div className="marquee-container py-2 sm:py-3 border-t border-surface/30 bg-black/20 backdrop-blur-sm">
            <div className="marquee-content flex items-center space-x-6 sm:space-x-8 md:space-x-12 text-xs sm:text-sm font-bold text-white/80">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="whitespace-nowrap">
                  AUTOMATION • WEB DEVELOPMENT • AI INTEGRATION • DIGITAL SOLUTIONS •
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for marquee */}
      <style jsx>{`
        .marquee-container {
          mask: linear-gradient(to right, transparent, white 10%, white 90%, transparent);
        }
        
        .marquee-content {
          animation: marquee 30s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        
        @media (max-width: 640px) {
          .service-card {
            padding: 0 1rem;
          }
          
          .marquee-content {
            animation: marquee 20s linear infinite;
          }
        }
      `}</style>
    </section>
  );
}

