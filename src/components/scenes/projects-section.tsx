'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Project } from '@/types';
import InfiniteMenu from '../InfiniteMenu';
import { GridScan } from '../ui/GridScan';

// Dynamic import for GhostCursor to avoid SSR issues with Three.js
const GhostCursor = dynamic(() => import('../ui/GhostCursor'), { ssr: false });

const categories = [
  {
    name: 'All',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center'
  },
  {
    name: 'Web Development',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&crop=center'
  },
  {
    name: 'Automation',
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop&crop=center'
  },
  {
    name: 'AI Integration',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&crop=center'
  },
  {
    name: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center'
  },
];

const projects: Project[] = [
  {
    id: 'brain-tumor-diagnosis',
    title: 'Ultra-Realistic Brain Tumor Masking & Diagnosis',
    category: 'AI Integration',
    description: 'Computer vision system for brain tumor detection using MRI/CT scans with deep learning models for precise tumor masking and automated diagnosis.',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=center',
    tags: ['Python', 'TensorFlow', 'OpenCV', 'Medical Imaging', 'Deep Learning'],
    metrics: { accuracy: '94%', processing: '< 2min', detection: '98%' },
    link: '#',
    status: 'In progress'
  },
  {
    id: 'school-management-ai',
    title: 'AI-Integrated School Management System',
    category: 'AI Integration',
    description: 'School management platform with AI-powered LMS integration. Manages student/teacher operations and streamlines administrative workflows with intelligent automation.',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop&crop=center',
    tags: ['React', 'Next.js', 'Prisma', 'AI Integration', 'LMS'],
    metrics: { users: '2k+', automation: '85%', efficiency: '70%' },
    link: 'https://school-management-system-2025-v2.windsurf.build/login'
  },
  {
    id: 'daily-deli-co',
    title: 'Daily Deli Co',
    category: 'Web Development',
    description: 'Comprehensive restaurant management system with real-time order tracking, automated inventory management, customer loyalty programs, and detailed analytics.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&crop=center',
    tags: ['Next.js', 'Prisma', 'AI Analytics'],
    metrics: { orders: '10k+', efficiency: '90%', revenue: '+150%' },
    link: 'https://daily-deli-co.windsurf.build/'
  },
  {
    id: 'i-fragrances',
    title: 'I. Fragrances',
    category: 'E-commerce',
    description: 'Innovative fragrance e-commerce platform with AI-powered recommendations, advanced filtering by notes/mood/occasions, and virtual scent profiling.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop&crop=center',
    tags: ['Next.js', 'Prisma', 'AI Analytics'],
    metrics: { products: '500+', recommendations: '96%', sales: '+200%' },
    link: 'https://elysian-scents.windsurf.build/'
  },
  {
    id: 'crush-confessions',
    title: 'Crush Confessions',
    category: 'Web Development',
    description: 'Secure anonymous platform for UMT students with advanced privacy protection, anonymous posting, and secure messaging system.',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=600&fit=crop&crop=center',
    tags: ['Next.js', 'Prisma', 'NextAuth', 'Tailwind'],
    metrics: { users: '1.5k+', posts: '5k+', privacy: '100%' },
    link: 'https://crush-confessions.vercel.app'
  },
  {
    id: 'ess-lgs',
    title: 'ESS LGS',
    category: 'Automation',
    description: 'Making automate online whole system of school to take admission online and also hire teachers online by posting requirements on website.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&crop=center',
    tags: ['Next.js', 'Prisma', 'NextAuth', 'Tailwind', 'Authorization'],
    metrics: { admissions: '2k+', automation: '95%', efficiency: '80%' },
    link: 'https://lgs-school-2025.windsurf.build'
  },
  {
    id: 'voice-to-pptx-generator',
    title: 'Voice to PPTx Generator (Using NLP)',
    category: 'AI Integration',
    description: 'Python program converting voice to PowerPoint presentations using NLP. Features text preprocessing, tokenization, and automatic slide generation with proper formatting.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&crop=center',
    tags: ['Python', 'NLP', 'PowerPoint', 'Voice Processing'],
    metrics: { processing: 'Real-time', accuracy: '92%', slides: '50+' },
    link: '#',
    period: '05/2025 - 06/2025'
  },
  {
    id: 'automatic-door-rfid',
    title: 'Automatic Door Opening and Closing (with RFID)',
    category: 'Automation',
    description: 'Secure RFID door system with contactless authentication, automated door control, and enhanced security for authorized access only.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&crop=center',
    tags: ['Arduino', 'RFID', 'C++', 'IoT'],
    metrics: { security: '99.8%', response: '< 1sec', access: 'Contactless' },
    link: '#',
    period: '03/2022 - 06/2022'
  },
  {
    id: 'book-to-podcast-converter',
    title: 'Book To Podcast Converter',
    category: 'AI Integration',
    description: 'NLP system converting books to podcasts with text preprocessing, speech synthesis using TTS technology, and audio enhancement features.',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop&crop=center',
    tags: ['Python', 'NLP', 'TTS', 'Audio Processing'],
    metrics: { books: '100+', quality: '96%', speed: '2x faster' },
    link: '#',
    period: '04/2025 - 05/2025'
  },
  {
    id: 'chugtai-medical-store',
    title: 'Chugtai Medical Store - Management System',
    category: 'Web Development',
    description: 'Business growth management platform for medical store operations with secure, scalable, and modern architecture built with Next.js.',
    image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&h=600&fit=crop&crop=center',
    tags: ['Next.js', 'Management System', 'Healthcare', 'Business'],
    metrics: { operations: 'Streamlined', security: 'High', growth: 'Enhanced' },
    link: 'https://ahmad-medical-store-pos.windsurf.build/login'
  },
  {
    id: 'ahmad-portfolio',
    title: 'Ahmad Abdullah Ahmad - Developer Portfolio',
    category: 'Web Development',
    description: 'AI Engineer & Developer portfolio showcasing intelligent solutions, projects, skills, and professional experience in modern web design.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center',
    tags: ['Portfolio', 'AI Engineer', 'Web Design', 'Personal Branding'],
    metrics: { projects: '10+', technologies: '15+', experience: '3+ years' },
    link: 'https://aaahmadthedev.vercel.app/'
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-black"
      style={{
        // Use min-height with mobile-safe viewport units
        minHeight: isMobile ? '100svh' : '100vh',
        // Ensure section doesn't get clipped
        overflow: 'visible',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {/* Main content container */}
      <div
        className="flex flex-col items-center justify-start py-8 md:py-16 select-none"
        style={{
          minHeight: 'inherit'
        }}
      >
        {/* Header with Ghost Cursor Background - CENTERED */}
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-4 md:mb-8 relative flex flex-col items-center justify-center" style={{ height: isMobile ? '200px' : '280px' }}>
          {/* Ghost Cursor effect - smoky trail following mouse */}
          {/* Ghost Cursor effect - smoky trail following mouse */}
          <GhostCursor
            className=""
            style={{}}
            color="#a29bfe"
            brightness={isMobile ? 1.8 : 2.2}
            edgeIntensity={0}
            trailLength={isMobile ? 20 : 40}
            inertia={0.6}
            grainIntensity={0.03}
            bloomStrength={isMobile ? 0.8 : 1.5}
            bloomRadius={isMobile ? 0.4 : 0.6}
            bloomThreshold={0.02}
            fadeDelayMs={800}
            fadeDurationMs={1200}
            zIndex={0}
            mixBlendMode="screen"
            targetPixels={undefined}
          />
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes ghostPulse {
              0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
            }
          `}} />

          <h2
            ref={titleRef}
            className="text-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 md:mb-6 text-center relative z-10 text-black transition-colors duration-300"
          >
            <span className="astloch-regular">F</span>eatured <span className="text-black"><span className="astloch-regular">P</span>rojects</span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-black mb-4 md:mb-6 max-w-2xl mx-auto text-center relative z-10">
            Discover our portfolio of successful projects that showcase our expertise in
            web development, automation, and AI integration.
          </p>

          <p className="text-xs sm:text-sm text-black text-center relative z-10">
            {isMobile ? 'Swipe on the sphere to explore projects' : 'Drag to rotate • Click to view project'}
          </p>
        </div>

        {/* Combined Interactive Menu & CTA Section with Shared GridScan */}
        <div className="relative w-full overflow-hidden" style={{ willChange: 'auto', contain: 'layout style paint' }}>
          {/* Shared Grid Background */}
          <div className="absolute inset-0 z-0">
            <GridScan
              sensitivity={0.55}
              lineThickness={1}
              linesColor="#392e4e"
              gridScale={0.1}
              scanColor="#FF9FFC"
              scanOpacity={0.4}
              enablePost={!isMobile} // Performance optimization: Disable post-processing on mobile
              bloomIntensity={0.6}
              chromaticAberration={0.002}
              noiseIntensity={0.01}
              className="absolute inset-0"
              style={{ width: '100%', height: '100%' }}
            />
          </div>

          {/* Interactive Projects Menu */}
          <div
            className="relative w-full z-10"
            data-lenis-prevent
            style={{
              // Use FIXED pixel height to prevent collapse during scroll
              height: isMobile ? '500px' : '650px',
              minHeight: isMobile ? '450px' : '500px',
              // Removed manual gradient - using GridBeam
              background: 'transparent',
              // Prevent touch from propagating to page scroll while interacting
              touchAction: 'none'
            }}
          >
            {/* Full-width container for the sphere */}
            <div
              className="absolute inset-0"
              data-lenis-prevent
              style={{
                width: '100%',
                height: '100%',
                zIndex: 10
              }}
            >
              <InfiniteMenu items={filteredProjects.map(project => ({
                image: project.image,
                link: (project.link || `#project-${project.id}`),
                title: project.title,
                description: project.description || project.category
              }))} />
            </div>
          </div>

          {/* Call to Action - Grid Scan Enhanced */}
          <div className="w-full relative z-10 flex flex-col items-center justify-center py-20 px-4" style={{ contain: 'layout style' }}>
            {/* GridScan Overlay/Extensions if needed (removed manual beam) */}
            <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
              {/* Gradient heading */}
              <h3
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #23D1F8 50%, #9F6BFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1.2'
                }}
              >
                Ready to Start Your Project?
              </h3>

              <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
                Let&apos;s collaborate to bring your vision to life with our cutting-edge development expertise.
              </p>

              {/* Enhanced CTA button */}
              <button
                className="group relative overflow-hidden transition-all duration-300 active:scale-95 inline-flex items-center justify-center"
                style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  background: 'linear-gradient(135deg, #23D1F8 0%, #9F6BFF 50%, #FF6B9F 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientShift 3s ease infinite',
                  borderRadius: '50px',
                  border: 'none',
                  color: '#0a0a0a',
                  cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(35, 209, 248, 0.4), 0 0 40px rgba(159, 107, 255, 0.2)',
                  minWidth: '220px'
                }}
                onClick={() => {
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(35, 209, 248, 0.5), 0 0 60px rgba(159, 107, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(35, 209, 248, 0.4), 0 0 40px rgba(159, 107, 255, 0.2)';
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Discuss Your Project
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
