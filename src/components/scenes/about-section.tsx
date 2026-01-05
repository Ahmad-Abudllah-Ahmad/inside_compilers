'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const GradientBlinds = dynamic(() => import('../GradientBlinds'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />
});

// Enhanced hook for smooth individual element animations
function useStaggeredFade(options: { threshold?: number; rootMargin?: string; staggerDelay?: number } = {}) {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    threshold = 0.1,
    rootMargin = '-20px',
    staggerDelay = 100
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          const index = parseInt(element.dataset.index || '0');

          if (entry.isIntersecting) {
            setTimeout(() => {
              setVisibleElements(prev => new Set([...prev, index]));
            }, index * staggerDelay);
          } else {
            setVisibleElements(prev => {
              const newSet = new Set(prev);
              newSet.delete(index);
              return newSet;
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    observerRef.current = observer;

    const observeElements = () => {
      if (containerRef.current) {
        const elements = containerRef.current.querySelectorAll('[data-fade-element]');
        elements.forEach((element, index) => {
          (element as HTMLElement).dataset.index = index.toString();
          observer.observe(element);
        });
      }
    };

    // Use RAF to ensure DOM is ready
    requestAnimationFrame(observeElements);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, staggerDelay]);

  const getElementProps = (index: number, additionalClasses = '') => ({
    'data-fade-element': true,
    'data-index': index,
    className: `transition-all duration-700 ease-out will-change-transform ${additionalClasses} ${visibleElements.has(index)
      ? 'opacity-100 transform translate-y-0'
      : 'opacity-0 transform translate-y-4'
      }`
  });

  return [containerRef, getElementProps] as const;
}

const stats = [
  { label: 'Projects Completed', value: 150, suffix: '+' },
  { label: 'Client Satisfaction', value: 98, suffix: '%' },
  { label: 'Years Experience', value: 5, suffix: '+' },
  { label: 'Team Members', value: 12, suffix: '' },
];


const timeline = [
  { year: '2023', title: 'Company Founded', description: 'Started with a vision to transform digital experiences' },
  { year: '2023', title: 'First Major Client', description: 'Delivered enterprise-level automation solution' },
  { year: '2024', title: 'AI Integration', description: 'Expanded services to include AI-powered solutions' },
  { year: '2024', title: 'International Expansion', description: 'Served clients across 15+ countries' },
  { year: '2024', title: 'Innovation Lab', description: 'Launched R&D division for emerging technologies' },
  { year: '2025', title: 'Scale & Excellence', description: 'Reached 150+ successful projects milestone' },
];

// Counter component for animated numbers
function AnimatedCounter({ end, suffix, duration = 2000 }: { end: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const startValue = 0;
          const endValue = end;

          const updateCounter = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

            setCount(currentValue);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <div ref={counterRef} className="text-4xl sm:text-5xl md:text-6xl font-bold text-accent-lime mb-4">
      {count}{suffix}
    </div>
  );
}

// Year counter component for timeline
function AnimatedYearCounter({ year, duration = 1500 }: { year: string; duration?: number }) {
  const [count, setCount] = useState(2019);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);
  const targetYear = parseInt(year);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const startValue = 2019;
          const endValue = targetYear;

          const updateCounter = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart);

            setCount(currentValue);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          };

          requestAnimationFrame(updateCounter);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [targetYear, duration, hasAnimated]);

  return (
    <div ref={counterRef} className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-accent-cyan rounded-full flex items-center justify-center font-bold text-white text-sm sm:text-base md:text-lg mx-auto">
      {count}
    </div>
  );
}

const GRADIENT_COLORS = ['#FF9FFC', '#5227FF'];

export default function AboutSection() {
  // Single staggered fade hook for all elements
  const [containerRef, getElementProps] = useStaggeredFade({
    threshold: 0.1,
    rootMargin: '-30px',
    staggerDelay: 80
  });

  return (
    <section id="about" className="relative z-10" style={{ contain: 'layout style paint' }}>
      <section className="py-20 sm:py-28 md:py-32 lg:py-40 relative overflow-hidden min-h-screen flex items-center justify-center bg-black">
        {/* Background Layer */}
        <div className="absolute inset-0 w-full h-full z-0 bg-black">
          {/* GradientBlinds - visible on all screens */}
          <div className="block absolute inset-0 w-full h-full z-1 transform-gpu">
            <GradientBlinds
              gradientColors={GRADIENT_COLORS}
              angle={241}
              noise={0.9}
              blindCount={16}
              blindMinWidth={30}
              spotlightRadius={0.55}
              spotlightSoftness={1}
              spotlightOpacity={1}
              mouseDampening={0.06}
              distortAmount={1}
              shineDirection="left" // Default from user snippet: "left". Old was "left". User "Light Direction" prompt empty? Assuming left.
              mixBlendMode="lighten"
              dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
              className={undefined}
            />
          </div>
        </div>

        {/* Content Overlay */}
        <div ref={containerRef} className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-16 sm:mb-20 md:mb-24">
            <h2 {...getElementProps(0, 'text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center mb-8 text-accent-cyan')} style={{ fontFamily: 'Raleway, sans-serif' }}>
              <span className="astloch-regular">A</span>bout <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}>Inside Compilers</span>
            </h2>
          </div>

          {/* Stats */}
          <div className="text-center mb-20 sm:mb-24 md:mb-28">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 max-w-5xl mx-auto">
              {stats.map((stat, index) => (
                <div key={stat.label} {...getElementProps(index + 1, 'text-center')}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  <div className={`text-base sm:text-lg font-medium ${stat.label === 'Years Experience' ? 'text-white' : 'text-text-secondary'
                    }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Story */}
          <div className="w-full max-w-5xl text-center mb-20 sm:mb-24 md:mb-28">
            <h3 {...getElementProps(5, 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-accent-cyan')}>
              Transforming Ideas Into Digital Reality
            </h3>

            <div {...getElementProps(6, 'text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed mb-8 sm:mb-10')}>
              At <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 100 }}>Inside Compilers</span>, we believe in the power of technology to solve complex problems and create meaningful experiences. Our team of passionate developers, designers, and innovators work together to deliver cutting-edge solutions that drive business growth and digital transformation.
            </div>

            <div {...getElementProps(7, 'text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed')}>
              From concept to deployment, we handle every aspect of your project with precision, creativity, and a commitment to excellence that has made us a trusted partner for businesses worldwide.
            </div>
          </div>

          {/* Timeline */}
          <div className="w-full max-w-5xl text-center mb-20 sm:mb-24 md:mb-28">
            <h3 {...getElementProps(8, 'text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-accent-lime')}>
              Our Journey
            </h3>

            <div className="space-y-8 sm:space-y-10">
              {timeline.map((item, index) => (
                <div key={`${item.year}-${item.title}`} {...getElementProps(9 + index * 3, 'flex flex-col items-center justify-center space-y-4 sm:space-y-6')}>
                  <div {...getElementProps(10 + index * 3, 'flex-shrink-0')}>
                    <AnimatedYearCounter year={item.year} />
                  </div>

                  <div {...getElementProps(11 + index * 3, 'text-center max-w-md mx-auto')}>
                    <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-accent-lime">
                      {item.title}
                    </h4>
                    <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="w-full max-w-5xl text-center mb-20">
            <h3 {...getElementProps(27, 'text-2xl sm:text-3xl md:text-4xl font-bold mb-12 sm:mb-16 text-accent-purple')}>
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mx-auto">
              {[
                {
                  title: 'Innovation',
                  description: 'We push boundaries and embrace cutting-edge technologies to deliver solutions that are ahead of their time.',
                  icon: '💡'
                },
                {
                  title: 'Excellence',
                  description: 'Every line of code, every design element, and every user interaction is crafted with meticulous attention to detail.',
                  icon: '⭐'
                },
                {
                  title: 'Partnership',
                  description: 'We work closely with our clients, understanding their vision and collaborating to bring it to life.',
                  icon: '🤝'
                }
              ].map((value, index) => (
                <div key={value.title} {...getElementProps(28 + index, 'text-center')}>
                  <div className="text-4xl sm:text-5xl mb-6">
                    {value.icon}
                  </div>
                  <h4 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-accent-lime">
                    {value.title}
                  </h4>
                  <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
