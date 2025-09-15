// Core Types for Inside Compiler 2026

export interface Project {
  id: string;
  slug?: string;
  title: string;
  category: string;
  tags: string[];
  cover?: string;
  image: string;
  link: string;
  role?: string[];
  results?: {
    leads?: number;
    load_time?: number;
    core_web_vitals?: 'A' | 'B' | 'C';
    conversion_rate?: number;
    performance_boost?: number;
  };
  metrics: Record<string, string>;
  gallery?: string[];
  video?: string;
  summary?: string;
  description: string;
  challenge?: string;
  solution?: string;
  challenges?: string[];
  solutions?: string[];
  testimonial?: {
    quote: string;
    author: string;
    position: string;
    company: string;
  };
  year?: number;
  featured?: boolean;
  status?: string;
  period?: string;
}

export type ProjectTag = 
  | 'Automation' 
  | 'Web Development' 
  | 'AI Integration' 
  | 'E-commerce' 
  | 'Digital Solutions'
  | 'Integration';

export interface MotionConfig {
  duration: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  easing: {
    power3Out: string;
    expoOut: string;
    backOut: string;
    custom: string;
  };
  stagger: {
    lines: number;
    chips: number;
    glyphs: number;
  };
}

export interface GSAPHelpers {
  splitReveal: (element: HTMLElement, options?: SplitRevealOptions) => gsap.core.Tween;
  elasticText: (element: HTMLElement) => gsap.core.Timeline;
  peelLayers: (container: HTMLElement, layers?: number) => gsap.core.Timeline;
  scatterGrid: (container: HTMLElement, strength?: number, depth?: number) => gsap.core.Timeline;
  magnetic: (element: HTMLElement, radius?: number, force?: number) => void;
}

export interface SplitRevealOptions {
  stagger?: number;
  yStart?: number;
  ease?: string;
  duration?: number;
  delay?: number;
}

export interface PageTransition {
  name: string;
  leave: (data: Record<string, unknown>) => Promise<void>;
  enter: (data: Record<string, unknown>) => Promise<void>;
  afterEnter?: (data: Record<string, unknown>) => void;
}

export interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  features: string[];
  href?: string;
}

export interface TimelineItem {
  year: number;
  title: string;
  description: string;
  milestone?: boolean;
}

export interface StatCounter {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  message: string;
  project_type?: ProjectTag;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}
