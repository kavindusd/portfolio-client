'use client';

import React from 'react';
import { Navbar } from '../components/public/Navbar';
import { HeroSection } from '../components/public/HeroSection';
import { TechMarquee } from '../components/public/TechMarquee';
import { PersonalBioSection } from '../components/public/PersonalBioSection';
import { ServicesSection } from '../components/public/ServicesSection';
import { ExperienceSection } from '../components/public/ExperienceSection';
import { EducationSection } from '../components/public/EducationSection';
import { ProjectsSection } from '../components/public/ProjectsSection';
import { ContactSection } from '../components/public/ContactSection';
import { Footer } from '../components/public/Footer';
import { BackgroundIllustration } from '../components/ui/BackgroundIllustration';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#f8f5ee] dark:bg-[#050508] text-zinc-900 dark:text-zinc-100 flex flex-col overflow-x-hidden transition-colors duration-300">
      {/* Universal Background Illustration under hero and all page sections */}
      <BackgroundIllustration />

      {/* Top Floating Island Navigation */}
      <Navbar />

      {/* Main One-Page Content */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0 w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Infinite Tech Stack Marquee Line */}
        <TechMarquee />

        {/* Personal Bio & Photo Section */}
        <PersonalBioSection />

        {/* Services & Capabilities Section */}
        <ServicesSection />

        {/* Work Experience Section */}
        <ExperienceSection />

        {/* Education & Academics Section */}
        <EducationSection />

        {/* Projects Showcase */}
        <ProjectsSection />

        {/* Contact Banner & Form */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
