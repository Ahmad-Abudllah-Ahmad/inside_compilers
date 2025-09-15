'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useResponsive } from '@/hooks/use-responsive';
import MenuOverlay from './menu-overlay';
import StaggeredMenu from '@/components/StaggeredMenu';
import clsx from 'clsx';

// HeaderNavItem component with FlowingMenu animation
interface HeaderNavItemProps {
  text: string;
  targetId: string;
  onClick: (target: string) => void;
  showRedLine?: boolean;
}

function HeaderNavItem({ text, targetId, onClick, showRedLine = false }: HeaderNavItemProps) {
  const handleClick = () => {
    onClick(targetId);
  };

  return (
    <button
      className="text-sm lg:text-base text-text-secondary hover:text-text transition-colors duration-200 relative group px-4 py-2 bg-transparent border-none cursor-pointer"
      onClick={handleClick}
    >
      <span className="relative">{text}</span>
      {/* Cyan hover effect line */}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-cyan group-hover:w-full transition-all duration-300" />
      {/* Red hover effect line */}
      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
      {/* Red line that shows when past projects section 
      {showRedLine && (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-500 transition-all duration-300" />
      )}*/}
    </button>
  );
}

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showRedLines, setShowRedLines] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  
  // StaggeredMenu items
  const menuItems = [
    { label: 'Services', ariaLabel: 'View our services', link: '#services' },
    { label: 'Projects', ariaLabel: 'See our projects', link: '#projects' },
    { label: 'About', ariaLabel: 'Learn about us', link: '#about' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com' },
    { label: 'LinkedIn', link: 'https://linkedin.com' },
    { label: 'Twitter', link: 'https://twitter.com' }
  ];

  useEffect(() => {
    if (!headerRef.current) return;

    const header = headerRef.current;
    let lastScrollY = 0;
    let ticking = false;

    const updateHeader = () => {
      const scrollY = window.scrollY;
      const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
      const scrolled = scrollY > 50;

      setIsScrolled(scrolled);

      // Show navigation items once we scroll past the initial hero section
      let currentlyVisible: string[] = [];
      let shouldShowRedLines = false;
      
      // Show all navigation items when user starts scrolling (past 100px from top)
      if (scrollY >= 100) {
        currentlyVisible = ['services', 'projects', 'about', 'faq', 'contact'];
      }

      // Check if we should show red lines (when reaching projects section)
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const projectsTop = projectsSection.offsetTop;
        shouldShowRedLines = scrollY >= projectsTop;
      }

      setVisibleSections(currentlyVisible);
      setShowRedLines(shouldShowRedLines);

      // Hide header on down scroll, show on up scroll (but not when mobile menu is open)
      if (scrollDirection === 'down' && scrollY > 100 && !isMenuOpen) {
        gsap.to(header, {
          y: -100,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else if ((scrollDirection === 'up' || scrollY < 100) || isMenuOpen) {
        gsap.to(header, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      lastScrollY = scrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (target: string) => {
    // Simple scroll behavior for navigation items
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <header
        ref={headerRef}
        className={clsx(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300 hidden md:block',
          isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-surface' 
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[var(--max-width)] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[var(--header-height)]">
            {/* Logo */}
            <div className="text-display text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}>
              <span className="text-accent-cyan">Inside</span>
              <span className="text-text">Compilers</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-2 lg:space-x-4">
              {[
                { label: 'Services', target: '#services', sectionId: 'services' },
                { label: 'Projects', target: '#projects', sectionId: 'projects' },
                { label: 'About', target: '#about', sectionId: 'about' },
                { label: 'Contact', target: '#contact', sectionId: 'contact' },
              ].filter((item) => visibleSections.includes(item.sectionId)).map((item) => (
                <HeaderNavItem
                  key={item.label}
                  text={item.label}
                  targetId={item.target}
                  onClick={handleNavClick}
                  showRedLine={showRedLines}
                />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile StaggeredMenu */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <StaggeredMenu
          position="right"
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          menuButtonColor="#E6E7EB"
          openMenuButtonColor="#23D1F8"
          changeMenuColorOnOpen={true}
          colors={['#23D1F8', '#9F6BFF']}
          logoUrl=""
          accentColor="#23D1F8"
          onMenuOpen={() => console.log('Mobile menu opened')}
          onMenuClose={() => console.log('Mobile menu closed')}
        />
      </div>
      
    </>
  );
}
