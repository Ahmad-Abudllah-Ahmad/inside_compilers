import HeroSection from '@/components/scenes/hero-section';
import ServicesSection from '@/components/scenes/services-section';
import ProjectsSection from '@/components/scenes/projects-section';
import AboutSection from '@/components/scenes/about-section';
import ContactSection from '@/components/scenes/contact-section';
import InteractiveFooter from '@/components/scenes/interactive-footer';
import Silk from '@/components/ui/Silk';

export default function Home() {
  return (
    <div className="scroll-smooth">
      {/* Silk Background */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1,
        opacity: 0.8,
        pointerEvents: 'none'
      }}>
        <Silk
          speed={3}
          scale={0.7}
          color="#7B7481"
          noiseIntensity={2}
          rotation={0}
        />
      </div>
      
      <section className="relative z-10">
        <HeroSection />
      </section>
      <section className="relative z-10">
        <ServicesSection />
      </section>
      <section className="relative z-10">
        <ProjectsSection />
      </section>
      
      {/* Gradient transition between Projects and About */}
      <div 
        className="relative z-10"
        style={{ 
          height: '200px',
          background: 'linear-gradient(180deg, #4F46E5 0%, #7C3AED 25%, #2563EB 50%, #1E293B 75%, #0a0a0a 100%)'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.4) 0%, rgba(124, 58, 237, 0.3) 25%, rgba(37, 99, 235, 0.2) 50%, rgba(30, 41, 59, 0.1) 75%, rgba(10, 10, 10, 0) 100%)',
            backdropFilter: 'blur(1px)'
          }}
        />
      </div>
      
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
