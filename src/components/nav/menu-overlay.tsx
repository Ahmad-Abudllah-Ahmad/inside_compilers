'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { scrollTo } from '@/components/motion/lenis';
import { motion, AnimatePresence } from 'framer-motion';
import FlowingMenu from '@/components/ui/FlowingMenu';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavClick: (target: string) => void;
}

const menuItems = [
  {
    link: '#services',
    text: 'Services',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center'
  },
  {
    link: '#projects',
    text: 'Projects',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center'
  },
  {
    link: '#about',
    text: 'About',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop&crop=center'
  },
  {
    link: '#contact',
    text: 'Contact',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&h=400&fit=crop&crop=center'
  },
];

export function MenuOverlay({ isOpen, onClose, onNavClick }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current || !menuRef.current) return;

    const overlay = overlayRef.current;
    const menu = menuRef.current;

    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // GSAP entrance animation
      const tl = gsap.timeline();

      // Background fade in
      tl.fromTo(overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      // Menu items stagger animation
      const items = menu.querySelectorAll('.menu-item');
      tl.fromTo(items,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          stagger: 0.1
        },
        '-=0.2'
      );

      // Gradient drift animation
      tl.to(overlay, {
        background: 'linear-gradient(135deg, #0A0A0C 0%, #111216 50%, #0A0A0C 100%)',
        duration: 2,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      }, 0);

    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleItemClick = (target: string) => {
    // Use Lenis smooth scroll
    scrollTo(target, {
      duration: 1.5,
      easing: (t: number) => 1 - Math.pow(1 - t, 3)
    });
    onNavClick(target);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl"
          style={{ zIndex: 99999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <div
            ref={menuRef}
            className="min-h-screen relative z-[100000]"
            style={{ zIndex: 100000 }}
          >
            {/* FlowingMenu */}
            <div className="h-screen relative z-[100001]" style={{ zIndex: 100001 }} onClick={(e) => e.stopPropagation()}>
              <FlowingMenu items={menuItems} />
            </div>

            {/* Contact info */}
            <motion.div
              className="absolute bottom-8 left-8 text-left space-y-2 opacity-90 z-[100002] pointer-events-auto"
              style={{ zIndex: 100002 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.9, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-white/60 text-sm">Get in touch</p>
              <p className="text-accent-lime text-lg font-semibold">inside.compiler@gmail.com</p>
            </motion.div>

            {/* Close button */}
            <motion.button
              onClick={onClose}
              data-menu-close
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-white hover:text-accent-cyan transition-colors duration-200 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 z-[100002] pointer-events-auto"
              style={{ zIndex: 100002 }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MenuOverlay;
