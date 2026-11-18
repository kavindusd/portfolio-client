'use client';

import React from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';
import { PeekingCat } from '../ui/PeekingCat';

const THEME_STYLES: Record<string, {
  cardStyles: string;
  glow: string;
  topLine: string;
  badgeBg: string;
  tagStyles: string;
  titleHover: string;
}> = {
  purple: {
    cardStyles:
      'bg-gradient-to-b from-[#fbf7ff] via-white to-[#f6effe] dark:from-[#170e2b]/95 dark:via-[#100a1e]/95 dark:to-[#0a0614]/95 border-purple-200/90 dark:border-purple-500/35 hover:border-purple-500 shadow-[0_6px_24px_-4px_rgba(168,85,247,0.12)] dark:shadow-[0_8px_32px_-4px_rgba(147,51,234,0.25)] hover:shadow-[0_16px_40px_-6px_rgba(168,85,247,0.28)]',
    glow: 'from-purple-500/25 via-indigo-500/15 to-transparent',
    topLine: 'bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400',
    badgeBg: 'bg-purple-500/15 border-purple-400/40 dark:border-purple-500/30 text-purple-700 dark:text-purple-300',
    tagStyles: 'bg-purple-100/80 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200/70 dark:border-purple-800/40',
    titleHover: 'group-hover:text-purple-600 dark:group-hover:text-purple-300',
  },
  rose: {
    cardStyles:
      'bg-gradient-to-b from-[#fff5f7] via-white to-[#fef0f3] dark:from-[#2a0e1c]/95 dark:via-[#1c0a13]/95 dark:to-[#12050b]/95 border-rose-200/90 dark:border-rose-500/35 hover:border-rose-500 shadow-[0_6px_24px_-4px_rgba(244,63,94,0.12)] dark:shadow-[0_8px_32px_-4px_rgba(244,63,94,0.25)] hover:shadow-[0_16px_40px_-6px_rgba(244,63,94,0.28)]',
    glow: 'from-rose-500/25 via-pink-500/15 to-transparent',
    topLine: 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400',
    badgeBg: 'bg-rose-500/15 border-rose-400/40 dark:border-rose-500/30 text-rose-700 dark:text-rose-300',
    tagStyles: 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/40',
    titleHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-300',
  },
  sky: {
    cardStyles:
      'bg-gradient-to-b from-[#f0f9ff] via-white to-[#e6f4fe] dark:from-[#0b1c33]/95 dark:via-[#071324]/95 dark:to-[#040c17]/95 border-sky-200/90 dark:border-sky-500/35 hover:border-sky-500 shadow-[0_6px_24px_-4px_rgba(14,165,233,0.12)] dark:shadow-[0_8px_32px_-4px_rgba(14,165,233,0.25)] hover:shadow-[0_16px_40px_-6px_rgba(14,165,233,0.28)]',
    glow: 'from-sky-500/25 via-cyan-500/15 to-transparent',
    topLine: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500',
    badgeBg: 'bg-sky-500/15 border-sky-400/40 dark:border-sky-500/30 text-sky-700 dark:text-sky-300',
    tagStyles: 'bg-sky-100/80 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200/70 dark:border-sky-800/40',
    titleHover: 'group-hover:text-sky-600 dark:group-hover:text-sky-300',
  },
  emerald: {
    cardStyles:
      'bg-gradient-to-b from-[#f0fdf4] via-white to-[#e6fcf0] dark:from-[#0a2318]/95 dark:via-[#071912]/95 dark:to-[#04100c]/95 border-emerald-200/90 dark:border-emerald-500/35 hover:border-emerald-500 shadow-[0_6px_24px_-4px_rgba(16,185,129,0.12)] dark:shadow-[0_8px_32px_-4px_rgba(16,185,129,0.25)] hover:shadow-[0_16px_40px_-6px_rgba(16,185,129,0.28)]',
    glow: 'from-emerald-500/25 via-teal-500/15 to-transparent',
    topLine: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400',
    badgeBg: 'bg-emerald-500/15 border-emerald-400/40 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    tagStyles: 'bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/40',
    titleHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-300',
  },
  amber: {
    cardStyles:
      'bg-gradient-to-b from-[#fffbeb] via-white to-[#fef3c7] dark:from-[#2a1e0b]/95 dark:via-[#1e1507]/95 dark:to-[#120c04]/95 border-amber-200/90 dark:border-amber-500/35 hover:border-amber-500 shadow-[0_6px_24px_-4px_rgba(245,158,11,0.12)] dark:shadow-[0_8px_32px_-4px_rgba(245,158,11,0.25)] hover:shadow-[0_16px_40px_-6px_rgba(245,158,11,0.28)]',
    glow: 'from-amber-500/25 via-yellow-500/15 to-transparent',
    topLine: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-400',
    badgeBg: 'bg-amber-500/15 border-amber-400/40 dark:border-amber-500/30 text-amber-700 dark:text-amber-300',
    tagStyles: 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/40',
    titleHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-300',
  },
};

const THEME_KEYS = ['purple', 'rose', 'sky', 'emerald', 'amber'];

function renderServiceIcon(iconName: string) {
  switch (iconName?.toLowerCase()) {
    case 'laptop':
      return <Icons.Laptop size={22} />;
    case 'palette':
      return <Icons.Palette size={22} />;
    case 'layers':
      return <Icons.Layers size={22} />;
    case 'code':
      return <Icons.Code size={22} />;
    case 'sparkles':
      return <Icons.Sparkles size={22} />;
    case 'shield':
      return <Icons.Shield size={22} />;
    case 'award':
      return <Icons.Award size={22} />;
    default:
      return <Icons.Laptop size={22} />;
  }
}

export const ServicesSection: React.FC = () => {
  const { services, profile } = usePortfolio();

  const badgeText = profile.servicesConfig?.badge || 'Services';
  const headingText = profile.servicesConfig?.heading || 'Building Digital Experiences';
  const subtitleText =
    profile.servicesConfig?.subtitle ||
    'I specialize in engineering fullstack web applications and crafting modern user interfaces that look stunning and perform seamlessly.';

  return (
    <section id="services" className="py-16 sm:py-20 px-5 sm:px-6 max-w-6xl mx-auto w-full">
      {/* ── Services Header with Peeking Cat Mascot ── */}
      <div className="mb-8 sm:mb-12 flex flex-col items-start">
        <PeekingCat text={badgeText} variant="white" />
        <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 sm:mb-3">
          {headingText}
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl font-normal leading-relaxed whitespace-pre-line">
          {subtitleText}
        </p>
      </div>

      {/* ── Dynamic Responsive Service Cards with High-Contrast Theming ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-10">
        {services.map((service, index) => {
          let cleanIcon = service.icon || 'Laptop';
          let activeTheme = (service as any).theme;
          if (cleanIcon.includes('::')) {
            const parts = cleanIcon.split('::');
            cleanIcon = parts[0];
            if (!activeTheme) activeTheme = parts[1];
          }

          const themeKey = activeTheme || THEME_KEYS[index % THEME_KEYS.length];
          const styles = THEME_STYLES[themeKey] || THEME_STYLES.purple;
          const tags = service.bullets || [];

          return (
            <div
              key={service.id || index}
              className={`group relative rounded-2xl p-5 sm:p-7 border transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 ${styles.cardStyles}`}
            >
              {/* Top gradient highlight accent strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${styles.topLine}`} />

              {/* Ambient corner glow */}
              <div
                className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${styles.glow} rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              <div>
                {/* Icon badge */}
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 shadow-xs ${styles.badgeBg}`}
                >
                  {renderServiceIcon(cleanIcon)}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3 transition-colors ${styles.titleHover}`}>
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 whitespace-pre-line">
                  {service.description}
                </p>
              </div>

              {/* Tech Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-stone-200/60 dark:border-zinc-800/60">
                  {tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${styles.tagStyles}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick link button to projects */}
      <div className="flex justify-end">
        <Link
          href="#projects"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-stone-700 hover:text-zinc-950 bg-stone-100/80 hover:bg-white dark:text-zinc-300 dark:hover:text-white dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-stone-300/70 dark:border-zinc-800 hover:border-purple-500/40 transition-all shadow-xs"
        >
          <Icons.Folder size={14} className="text-purple-600 dark:text-purple-400" />
          <span>View My Projects</span>
        </Link>
      </div>
    </section>
  );
};
