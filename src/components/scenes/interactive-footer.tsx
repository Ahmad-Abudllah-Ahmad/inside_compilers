'use client';

import { useEffect, useRef, useState } from 'react';
import Galaxy from '@/components/ui/Galaxy';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#about', action: 'scroll' },
    { label: 'Careers', href: '#careers', action: 'popup' },
  ],
  support: [
    { label: 'Contact', href: '#contact', action: 'scroll' },
    { label: 'Support', href: '#contact', action: 'scroll' },
  ],
};

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/inside-compilers/',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  },
];

export default function InteractiveFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const stripesRef = useRef<HTMLDivElement>(null);
  const [showCareersPopup, setShowCareersPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleLinkClick = (link: { href: string; action: string; label?: string }) => {
    if (link.action === 'popup' && link.label === 'Careers') {
      setShowCareersPopup(true);
    } else if (link.action === 'scroll') {
      const targetId = link.href.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: '#0a0a0a', contain: 'layout style paint' }}
    >
      {/* Galaxy Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}>
        <Galaxy
          mouseRepulsion={false}
          mouseInteraction={false}
          density={0.6}
          glowIntensity={0.7}
          saturation={0.1}
          hueShift={0}
          twinkleIntensity={0.5}
          rotationSpeed={0.01}
          starSpeed={0.08}
          speed={0.2}
          transparent={true}
        />
      </div>

      {/* Counter-rotating background stripes */}
      <div
        ref={stripesRef}
        className="absolute inset-0 opacity-5 overflow-hidden"
        style={{ zIndex: 2 }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute h-2 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-lime"
            style={{
              top: `${i * 5}%`,
              transform: `skew(-15deg)`,
              width: isMobile ? '80%' : '100%',
              left: isMobile ? '10%' : '0',
            }}
          />
        ))}
      </div>

      {/* Main footer content */}
      <div
        ref={contentRef}
        className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col items-center justify-center text-center pt-12 sm:pt-16 md:pt-20"
        style={{ zIndex: 10 }}
      >
        {/* CTA Section */}
        <div ref={ctaRef} className="text-center mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-display text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 px-4">
            <span className="astloch-regular">R</span>eady <span className="astloch-regular">t</span>o <span className="text-accent-cyan"><span className="astloch-regular">I</span>nnovate</span>?
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-8 sm:mb-10 md:mb-12 max-w-xl md:max-w-2xl mx-auto px-4">
            Let&apos;s create something extraordinary together. Start your project today.
          </p>

          <button
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="cta-button group relative px-4 sm:px-6 py-2 sm:py-3 bg-transparent text-white font-medium text-sm border border-white rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300"
          >
            <span className="relative z-10">Start Your Project</span>
          </button>
        </div>

        {/* Footer links */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20 ${isMobile ? 'justify-items-center text-center' : ''}`}>
          {/* Logo and description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-display text-xl sm:text-2xl font-bold mb-3 sm:mb-4" style={{ fontFamily: 'Raleway, sans-serif' }}>
              <span className="text-accent-cyan">Inside</span>
              <span className="text-text">Compilers</span>
            </div>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4 sm:mb-6">
              Transforming ideas into digital reality through innovative development,
              automation, and AI-powered solutions.
            </p>

            {/* Social links */}
            <div className={`flex space-x-3 sm:space-x-4 ${isMobile ? 'justify-center' : ''}`}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="social-icon w-10 h-10 sm:w-12 sm:h-12 bg-background/10 backdrop-blur-sm border border-surface rounded-lg flex items-center justify-center text-text-secondary hover:text-accent-cyan hover:border-accent-cyan/50 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>


          {/* Company */}
          <div className={isMobile ? 'text-center' : ''}>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-accent-purple">Company</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className={`text-sm sm:text-base text-text-secondary hover:text-accent-cyan transition-colors duration-200 group flex items-center cursor-pointer ${isMobile ? 'justify-center' : ''}`}
                  >
                    <span className="w-0 h-0.5 bg-accent-cyan group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className={isMobile ? 'text-center' : ''}>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-accent-lime">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className={`text-sm sm:text-base text-text-secondary hover:text-accent-cyan transition-colors duration-200 group flex items-center cursor-pointer ${isMobile ? 'justify-center' : ''}`}
                  >
                    <span className="w-0 h-0.5 bg-accent-cyan group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-surface/30 pt-6 sm:pt-8 pb-8 sm:pb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-xs text-text-secondary mb-2">We&apos;re passionate about creating</p>
            <p className="text-text-secondary text-xs">
              2024 <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}>Inside Compilers</span>. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
              <button onClick={() => handleLinkClick({ href: '#contact', action: 'scroll' })} className="text-text-secondary hover:text-accent-cyan transition-colors duration-200">
                Privacy Policy
              </button>
              <button onClick={() => handleLinkClick({ href: '#contact', action: 'scroll' })} className="text-text-secondary hover:text-accent-cyan transition-colors duration-200">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 30% 70%, rgba(35, 209, 248, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(159, 107, 255, 0.1) 0%, transparent 50%)
          `,
          animation: 'gradientShift 12s ease-in-out infinite',
        }}
      />

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { 
            opacity: 0.3;
            filter: hue-rotate(0deg);
          }
          50% { 
            opacity: 0.6;
            filter: hue-rotate(180deg);
          }
        }
      `}</style>

      {/* Careers Popup */}
      {showCareersPopup && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCareersPopup(false)}
          />
          <div className="relative max-w-md w-full p-6 rounded-xl shadow-2xl transform transition-all duration-300 bg-gradient-to-br from-accent-purple to-accent-cyan">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20">
                  💼
                </div>
                <h3 className="text-lg font-bold text-white">
                  Careers
                </h3>
              </div>
              <button
                onClick={() => setShowCareersPopup(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center">
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                We&apos;re always looking for talented individuals to join our team! Career opportunities will be posted soon.
              </p>
              <p className="text-white/80 text-xs mb-4">
                Stay tuned for exciting opportunities in web development, AI integration, and automation solutions.
              </p>
              <button
                onClick={() => {
                  setShowCareersPopup(false);
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors text-sm"
              >
                Get Notified
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
