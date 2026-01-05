'use client';

import AboutSection from '@/components/scenes/about-section';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black relative">
       {/* The AboutSection includes its own GradientBlinds background */}
       <AboutSection />
    </main>
  );
}
