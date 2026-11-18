'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';
import { AnimatedCatLogo } from '../ui/AnimatedCatLogo';

export const Footer: React.FC = () => {
  const { profile } = usePortfolio();
  const [year, setYear] = useState('2026');
  const [isCatHovered, setIsCatHovered] = useState(false);

  React.useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Experience', href: '#experience' },
    { label: 'Education', href: '#education' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      const id = href.substring(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="border-t border-stone-200/80 dark:border-zinc-900 bg-white/70 dark:bg-[#040407]/90 backdrop-blur-md pt-10 sm:pt-14 pb-8 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-8 sm:gap-10">
        {/* ── Top Row: Brand, Nav Links & Socials ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-stone-200/60 dark:border-zinc-800/60">
          {/* Brand Logo with Animated Cat (Container removed & enlarged) & Name */}
          <Link
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home')}
            onMouseEnter={() => setIsCatHovered(true)}
            onMouseLeave={() => setIsCatHovered(false)}
            className="flex items-center gap-3 group"
            title={`${profile.name}.dev`}
          >
            <AnimatedCatLogo
              isHovered={isCatHovered}
              showContainer={false}
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <div className="flex flex-col items-start text-left">
              <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {profile.name.toLowerCase()}
                <span className="text-purple-600 dark:text-purple-400">.dev</span>
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                {profile.role}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-zinc-600 hover:text-purple-600 dark:text-zinc-400 dark:hover:text-purple-400 transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons (GitHub, LinkedIn, Twitter/X - Dribbble removed) */}
          <div className="flex items-center gap-2.5 text-zinc-600 dark:text-zinc-400">
            {profile.socials.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white bg-stone-100/90 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
                title="GitHub"
              >
                <Icons.Github size={16} />
              </a>
            )}
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white bg-stone-100/90 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
                title="LinkedIn"
              >
                <Icons.Linkedin size={16} />
              </a>
            )}
            {profile.socials.instagram && (
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white bg-stone-100/90 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
                title="Instagram"
              >
                <Icons.Instagram size={16} />
              </a>
            )}
          </div>
        </div>

        {/* ── Bottom Row: Copyright, Location & Tech Credits ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span>© {year} {profile.name}. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span>🌐</span>
              <span>{profile.location}</span>
            </span>
            <span>•</span>
            <Link
              href="/admin"
              className="text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              Admin
            </Link>
          </div>

          <div className="text-zinc-500 dark:text-zinc-400 text-center md:text-right">
            Designed in Figma. Built with{' '}
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Next.js</span>,{' '}
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">TypeScript</span>, and{' '}
            <span className="text-zinc-800 dark:text-zinc-200 font-medium">Tailwind CSS</span>.
          </div>
        </div>
      </div>
    </footer>
  );
};
