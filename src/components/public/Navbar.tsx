'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';
import { AnimatedCatLogo } from '../ui/AnimatedCatLogo';

export const Navbar: React.FC = () => {
  const { profile } = usePortfolio();
  const [activeSection, setActiveSection] = useState('home');
  const [isCatHovered, setIsCatHovered] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync theme on initial mount
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    }
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const toggleTheme = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      try {
        localStorage.setItem('portfolio-theme', 'dark');
      } catch (err) {}
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      try {
        localStorage.setItem('portfolio-theme', 'light');
      } catch (err) {}
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
      setIsMobileMenuOpen(false);
    }
  };

  // Nav Items definition with icons and labels
  const navItems = [
    { id: 'home', label: 'Home', href: '#home', icon: <Icons.Home size={17} /> },
    { id: 'about', label: 'About', href: '#about', icon: <Icons.User size={17} /> },
    { id: 'services', label: 'Services', href: '#services', icon: <Icons.Layers size={17} /> },
    { id: 'experience', label: 'Experience', href: '#experience', icon: <Icons.Briefcase size={17} /> },
    { id: 'education', label: 'Education', href: '#education', icon: <Icons.GraduationCap size={17} /> },
    { id: 'projects', label: 'Projects', href: '#projects', icon: <Icons.Folder size={17} /> },
    { id: 'contact', label: 'Contact', href: '#contact', icon: <Icons.Mail size={17} /> },
  ];

  // Active section tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── MOBILE BACKDROP OVERLAY ── */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 sm:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* ── MOBILE HEADER (under 640px) ── */}
      <header className="sm:hidden fixed top-3 inset-x-3 z-50 pointer-events-auto">
        <div className="flex items-center justify-between px-3.5 py-2 rounded-full bg-white/90 dark:bg-zinc-950/85 backdrop-blur-2xl border border-stone-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.75)]">
          {/* Left: Brand with Mini Cat & Name */}
          <Link
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home')}
            className="flex items-center gap-2 shrink-0"
          >
            <AnimatedCatLogo isHovered={false} />
            <span className="font-bold text-xs tracking-tight text-zinc-900 dark:text-white">
              {profile.name.toLowerCase()}
              <span className="text-purple-600 dark:text-purple-400">.dev</span>
            </span>
          </Link>

          {/* Right: Theme Toggle & Hamburger Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 hover:text-amber-500 hover:bg-stone-100 dark:text-zinc-300 dark:hover:text-amber-400 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <Icons.Moon size={16} className="text-zinc-300" />
              ) : (
                <Icons.Sun size={16} className="text-amber-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                isMobileMenuOpen
                  ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-stone-100 dark:bg-zinc-900 border-stone-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 active:scale-95'
              }`}
            >
              {isMobileMenuOpen ? (
                <Icons.X size={18} />
              ) : (
                <Icons.Menu size={18} />
              )}
            </button>
          </div>
        </div>

        {/* ── MOBILE MENU CARD DROPDOWN (No "Navigation" or "Available for work" header) ── */}
        {isMobileMenuOpen && (
          <div className="mt-2 rounded-2xl bg-white/95 dark:bg-[#0c0c14]/95 backdrop-blur-2xl border border-stone-200/90 dark:border-zinc-800/80 shadow-2xl p-3 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
            {/* Navigation Links List */}
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25 font-semibold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-stone-100/90 dark:hover:bg-zinc-800/70 active:bg-stone-200 dark:active:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : 'text-purple-600 dark:text-purple-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Footer Quick Actions */}
            <div className="pt-3 mt-2 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 px-1">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-stone-100/80 dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 hover:border-amber-400/40 transition-colors cursor-pointer"
              >
                {isDarkMode ? (
                  <>
                    <Icons.Moon size={14} className="text-zinc-300" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Icons.Sun size={14} className="text-amber-500" />
                    <span>Light</span>
                  </>
                )}
              </button>

              <Link
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-600/25 active:scale-98 transition-transform"
              >
                <span>Get in Touch</span>
                <Icons.ArrowRight size={13} />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── DESKTOP FLOATING DOCK (screens >= 640px) ── */}
      <header className="hidden sm:block fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <nav
          aria-label="Desktop Floating Navigation"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 dark:bg-zinc-950/80 backdrop-blur-2xl border border-stone-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.75)] hover:border-stone-300 dark:hover:border-white/20 transition-all duration-300"
        >
          {/* Brand Logo with Mini Cat & Name (matches mobile view) */}
          <Link
            href="#home"
            onClick={(e) => handleScrollTo(e, '#home')}
            onMouseEnter={() => setIsCatHovered(true)}
            onMouseLeave={() => setIsCatHovered(false)}
            className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-stone-100/80 dark:hover:bg-white/10 transition-colors shrink-0 group"
            title={`${profile.name}.dev`}
          >
            <AnimatedCatLogo isHovered={isCatHovered} />
            <span className="font-bold text-xs tracking-tight text-zinc-900 dark:text-white">
              {profile.name.toLowerCase()}
              <span className="text-purple-600 dark:text-purple-400">.dev</span>
            </span>
          </Link>

          {/* Subtle Divider */}
          <div className="w-px h-5 bg-stone-200 dark:bg-white/10 mx-0.5 shrink-0" />

          {/* Nav Links with Hover Text Expansion & Tooltip */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleScrollTo(e, item.href)}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'text-purple-700 dark:text-white bg-purple-50 dark:bg-white/15 shadow-inner border border-purple-200 dark:border-white/15'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white/10 border border-transparent'
                  }`}
                >
                  {/* Nav Icon */}
                  <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {item.icon}
                  </span>

                  {/* Text Appears on Hover on desktop */}
                  <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[70px] group-hover:opacity-100 transition-all duration-300 text-xs font-medium tracking-wide">
                    {item.label}
                  </span>

                  {/* Floating Tooltip Indicator on desktop */}
                  <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900/95 border border-stone-200 dark:border-white/15 text-[10px] font-medium text-stone-800 dark:text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl shadow-zinc-300/50 dark:shadow-black/80">
                    {item.label}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white dark:bg-zinc-900 border-l border-t border-stone-200 dark:border-white/15 rotate-45" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Subtle Divider */}
          <div className="w-px h-5 bg-stone-200 dark:bg-white/10 mx-0.5" />

          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-stone-700 hover:text-amber-500 hover:bg-stone-100/80 dark:text-zinc-300 dark:hover:text-amber-400 dark:hover:bg-white/10 border border-transparent hover:border-amber-400/25 transition-all duration-300 cursor-pointer"
          >
            <span className="shrink-0 transition-transform duration-500 group-hover:rotate-45">
              {isDarkMode ? (
                <Icons.Moon size={16} className="text-zinc-300 group-hover:text-amber-300 transition-colors" />
              ) : (
                <Icons.Sun size={16} className="text-amber-500 transition-colors" />
              )}
            </span>

            {/* Text Appears on Hover on desktop */}
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[65px] group-hover:opacity-100 transition-all duration-300 text-xs font-medium tracking-wide text-zinc-800 dark:text-zinc-200">
              {isDarkMode ? 'Dark' : 'Light'}
            </span>

            {/* Tooltip on Hover on desktop */}
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900/95 border border-zinc-200 dark:border-white/15 text-[10px] font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-xl shadow-zinc-300/50 dark:shadow-black/80">
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white dark:bg-zinc-900 border-l border-t border-zinc-200 dark:border-white/15 rotate-45" />
            </div>
          </button>
        </nav>
      </header>
    </>
  );
};
