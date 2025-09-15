// Professional CMS Structure for Inside Compiler 2026
import type { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'harmain-transport',
    title: 'Harmain Transport — KSA',
    category: 'Web Development',
    description: 'Full-stack transportation management system with real-time tracking and automated booking flows.',
    image: 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&h=600&fit=crop&crop=center',
    link: 'https://harmaintransport.com',
    tags: ['Next.js', 'TypeScript', 'Automation'],
    metrics: { leads: '2.1x', performance: '98%', satisfaction: '4.9/5' },
    gallery: [
      'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=center',
    ],
    video: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    summary: 'Full-stack site with automated booking flows for transportation services in Saudi Arabia.',
    challenges: [
      'Real-time GPS tracking integration',
      'Multi-language support (Arabic/English)',
      'Payment gateway compliance',
      'High-availability requirements'
    ],
    solutions: [
      'WebSocket-based real-time updates',
      'i18n implementation with RTL support',
      'Secure payment processing',
      'Load balancing and CDN optimization'
    ],
    testimonial: {
      quote: 'Inside Compiler transformed our business operations. The platform increased our booking efficiency by 210% and customer satisfaction scores reached 4.9/5.',
      author: 'Ahmed Al-Rashid',
      position: 'Operations Director',
      company: 'Harmain Transport'
    }
  },
  {
    id: 'ai-content-generator',
    title: 'AI Content Generator',
    category: 'AI Integration',
    description: 'Intelligent content creation platform powered by advanced language models and custom training.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
    link: 'https://aicontentgen.com',
    tags: ['Python', 'OpenAI', 'React'],
    metrics: { efficiency: '85%', accuracy: '94%', users: '10k+' },
    gallery: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1676277791608-ac54876c85ce?w=800&h=600&fit=crop&crop=center',
    ],
    summary: 'AI-powered content creation platform with custom model training.',
  },
  {
    id: 'ecommerce-automation',
    title: 'E-commerce Automation Suite',
    category: 'E-commerce',
    description: 'Complete automation solution for inventory management, order processing, and customer service.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&crop=center',
    link: 'https://ecommerce-suite.com',
    tags: ['Node.js', 'MongoDB', 'Shopify API'],
    metrics: { orders: '50k+', automation: '90%', savings: '$200k' },
    summary: 'Comprehensive e-commerce automation reducing manual work by 90%.',
  },
  {
    id: 'smart-workflow-engine',
    title: 'Smart Workflow Engine',
    category: 'Automation',
    description: 'Custom workflow automation platform with visual builder and advanced integrations.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop&crop=center',
    link: 'https://workflow-engine.com',
    tags: ['React', 'Node.js', 'Zapier'],
    metrics: { workflows: '500+', efficiency: '75%', integrations: '100+' },
    summary: 'Visual workflow builder with 100+ integrations and 75% efficiency gains.',
  },
  {
    id: 'digital-banking-platform',
    title: 'Digital Banking Platform',
    category: 'Web Development',
    description: 'Secure, scalable banking application with real-time transactions and advanced security.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop&crop=center',
    link: 'https://digital-bank.com',
    tags: ['Next.js', 'PostgreSQL', 'Security'],
    metrics: { transactions: '1M+', uptime: '99.9%', security: 'A+' },
    summary: 'Enterprise banking platform handling 1M+ transactions with 99.9% uptime.',
  },
  {
    id: 'ml-analytics-dashboard',
    title: 'ML Analytics Dashboard',
    category: 'AI Integration',
    description: 'Machine learning-powered analytics platform with predictive insights and custom models.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center',
    link: 'https://ml-analytics.com',
    tags: ['Python', 'TensorFlow', 'D3.js'],
    metrics: { accuracy: '96%', insights: '1000+', models: '50+' },
    summary: 'ML analytics platform with 96% prediction accuracy and 1000+ insights.',
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === 'All') return projects;
  return projects.filter(project => project.category === category);
};

export const getCategories = (): string[] => {
  return ['All', ...Array.from(new Set(projects.map(project => project.category)))];
};
