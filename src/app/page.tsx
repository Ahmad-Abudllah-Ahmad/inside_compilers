'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/scenes/hero-section';
import ServicesSection from '@/components/scenes/services-section';
import ProjectsSection from '@/components/scenes/projects-section';
import AboutSection from '@/components/scenes/about-section';
import ContactSection from '@/components/scenes/contact-section';
import InteractiveFooter from '@/components/scenes/interactive-footer';
import Silk from '@/components/ui/Silk';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="scroll-smooth">
      {/* Silk Background - ONLY on desktop to preserve WebGL contexts for Projects sphere on mobile */}
      {!isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          opacity: 0.8,
          pointerEvents: 'none',
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}>
          <Silk
            speed={3}
            scale={0.7}
            color="#7B7481"
            noiseIntensity={2}
            rotation={0}
          />
        </div>
      )}

      {/* Simple gradient fallback for mobile */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
          pointerEvents: 'none'
        }} />
      )}

      <section className="relative z-10">
        <HeroSection />
      </section>
      <section className="relative z-10">
        <ServicesSection />
      </section>
      <section className="relative z-10">
        <ProjectsSection />
      </section>

      <section className="relative z-10">
        <AboutSection />
      </section>

      <section className="relative z-10">
        <ContactSection />
      </section>
      <section className="relative z-10">
        <InteractiveFooter />
      </section>
    </div>
  );
}
