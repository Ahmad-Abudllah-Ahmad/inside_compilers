'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { gsapHelpers } from '@/components/motion/gsap-helpers';
import type { Project } from '@/types';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current || !imageRef.current) return;

    const card = cardRef.current;
    const image = imageRef.current;

    // Parallax hover effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;

      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateX = (e.clientY - centerY) / 20;
      const rotateY = (e.clientX - centerX) / 20;

      gsap.to(card, {
        rotationX: -rotateX,
        rotationY: rotateY,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(image, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(card, {
        z: 50,
        duration: 0.3,
        ease: 'back.out(1.7)',
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 0.5,
        ease: 'power2.out',
      });

      gsap.to(image, {
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  const handleCardClick = () => {
    // Zoom-warp transition to project detail
    if (cardRef.current) {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();

      // Create overlay for transition
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        background: #111216;
        z-index: 10000;
        pointer-events: none;
        border-radius: 1rem;
      `;
      document.body.appendChild(overlay);

      // Animate to fullscreen
      gsap.to(overlay, {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // Navigate to project detail (would integrate with Next.js routing)
          console.log(`Navigate to project: ${project.id}`);
          overlay.remove();
        },
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="group relative bg-surface rounded-xl sm:rounded-2xl overflow-hidden border border-surface hover:border-accent-cyan/30 transition-all duration-500 cursor-pointer"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onClick={handleCardClick}
      whileHover={{ 
        y: -10,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
    >
      {/* Image container */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <div ref={imageRef} className="w-full h-full">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500"
          />
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
        
        {/* Category tag */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="bg-accent-purple/20 backdrop-blur-md text-accent-purple px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-semibold">
            {project.category}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-display text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-accent-cyan transition-colors duration-300 line-clamp-2">
          {project.title}
        </h3>

        <p className="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
          {project.tags.map((tag) => (
            <span 
              key={tag}
              className="bg-background/50 text-text-secondary px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Metrics */}
        <div className="flex justify-between items-center text-xs sm:text-sm">
          {Object.entries(project.metrics).slice(0, 2).map(([key, value]) => (
            <div key={key} className="text-center">
              <div className="font-bold text-accent-lime text-sm sm:text-base">{value}</div>
              <div className="text-text-secondary capitalize text-xs sm:text-sm">{key}</div>
            </div>
          ))}
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-purple group-hover:w-full transition-all duration-500" />
      </div>

      {/* Hover spotlight effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(35, 209, 248, 0.05) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
