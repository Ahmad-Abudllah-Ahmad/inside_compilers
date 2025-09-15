'use client';

import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/types';
import InfiniteMenu from '../InfiniteMenu';

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

  useEffect(() => {
    // Disable animations to prevent positioning issues
    return () => {
      // Cleanup any potential tweens
    };
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === activeCategory));
    }
  }, [activeCategory]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    (category: string) => {
      setActiveCategory(category);
    };
  };

  return (
    <section 
      id="projects"
      ref={sectionRef}
      className="h-screen overflow-hidden relative"
    >
      {/* Scrollable container within the section */}
      <div 
        className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Header content with integrated InfiniteMenu */}
        <div className="min-h-screen flex flex-col items-center justify-center py-16">
          <div className="w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
            <h2 
              ref={titleRef}
              className="text-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-center"
            >
              <span className="astloch-regular">F</span>eatured <span className="text-accent-lime"><span className="astloch-regular">P</span>rojects</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-text-secondary mb-6 sm:mb-8 max-w-2xl text-center">
              Discover our portfolio of successful projects that showcase our expertise in 
              web development, automation, and AI integration.
            </p>
            
            <p className="text-sm text-text-secondary mb-4">Let&apos;s explore what we&apos;ve built</p>
            <p className="text-xs sm:text-sm text-text-secondary/70 mb-6 text-center">
              Scroll down to see projects spread from center one by one
            </p>

            {/* Interactive Projects Menu integrated here */}
            <div className="relative mt-8 w-full" 
                 style={{ 
                   height: '100vh',
                   minHeight: '600px',
                   background: `
                     radial-gradient(circle at 20% 20%, rgba(159, 107, 255, 0.15) 0%, transparent 40%),
                     radial-gradient(circle at 80% 20%, rgba(35, 209, 248, 0.15) 0%, transparent 40%),
                     radial-gradient(circle at 20% 80%, rgba(155, 255, 77, 0.15) 0%, transparent 40%),
                     radial-gradient(circle at 80% 80%, rgba(255, 107, 159, 0.15) 0%, transparent 40%),
                     linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)
                   `,
                   boxShadow: `
                     0 0 100px rgba(159, 107, 255, 0.1),
                     inset 0 0 100px rgba(0, 0, 0, 0.2)
                   `
                 }}
            >
              {/* Desktop view */}
              <div className="hidden md:block absolute inset-0"
                   style={{
                     width: '100vw',
                     marginLeft: 'calc(-50vw + 50%)',
                     height: '100%',
                     zIndex: 10,
                     willChange: 'transform',
                     backfaceVisibility: 'hidden'
                   }}>
                <InfiniteMenu items={filteredProjects.map(project => ({
                  image: project.image,
                  link: (project.link || `#project-${project.id}`),
                  title: project.title,
                  description: project.description || project.category
                }))} />
              </div>
              
              {/* Mobile view */}
              <div className="md:hidden absolute inset-0 p-4 flex items-center justify-center"
                   style={{
                     height: '100%',
                     zIndex: 10,
                     position: 'absolute',
                     width: '100%',
                     left: 0,
                     top: 0,
                     transform: 'none',
                     willChange: 'transform',
                     backfaceVisibility: 'hidden'
                   }}>
                <InfiniteMenu items={filteredProjects.map(project => ({
                  image: project.image,
                  link: (project.link || `#project-${project.id}`),
                  title: project.title,
                  description: project.description || project.category
                }))} />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center px-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-sm sm:text-base text-text-secondary mb-8 max-w-2xl mx-auto">
              Let&apos;s collaborate to bring your vision to life with our cutting-edge development expertise.
            </p>
            
            <button
              className="group relative px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-accent-cyan to-accent-purple text-background font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 glow-cyan"
            >
              <span className="relative z-10">Discuss Your Project</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-lime opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
