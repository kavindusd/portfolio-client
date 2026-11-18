'use client';

import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';
import { PeekingCat } from '../ui/PeekingCat';

export const ExperienceSection: React.FC = () => {
  const { experiences } = usePortfolio();

  return (
    <section id="experience" className="py-16 sm:py-24 px-5 sm:px-6 max-w-5xl mx-auto w-full scroll-mt-24">
      {/* ── Section Header with Peeking Cat Mascot ── */}
      <div className="mb-12 sm:mb-16 flex flex-col items-start">
        <PeekingCat text="Experience" variant="white" />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full gap-4">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 sm:mb-3">
              Work Experience & Career Journey
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Hands-on software engineering, real-world client architectures, and key accomplishments delivering high-impact web products.
            </p>
          </div>
          <span className="self-start sm:self-end px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 whitespace-nowrap">
            {experiences.length} Professional Roles
          </span>
        </div>
      </div>

      {/* ── Modern Frameless Timeline Stream (No Heavy Boxes) ── */}
      <div className="relative space-y-12 sm:space-y-16 before:absolute before:left-[18px] sm:before:left-[22px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-purple-500 before:via-purple-500/40 before:to-transparent">
        {experiences.map((exp, index) => (
          <div
            key={exp.id || index}
            className="group relative pl-14 sm:pl-16 transition-all duration-300"
          >
            {/* ── Timeline Checkpoint Node with Dynamic Number Badge (Centered directly on the vertical line) ── */}
            <div className="absolute left-[18px] sm:left-[22px] -translate-x-1/2 top-0.5 z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-[#0c0c14] border-2 border-purple-500/60 dark:border-purple-400/60 group-hover:border-purple-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300 flex items-center justify-center shadow-md">
                <span className="font-mono font-bold text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* ── Open Modern Timeline Content Stream ── */}
            <div>
              {/* Header: Role Title + Period Badge */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1.5">
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors tracking-tight">
                  {exp.role}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-100/90 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 shadow-2xs">
                  <Icons.Calendar size={13} className="text-purple-600 dark:text-purple-400" />
                  <span>{exp.period}</span>
                </div>
              </div>

              {/* Company & Details Row */}
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-zinc-900 dark:text-zinc-100 font-bold">{exp.company}</span>
              </div>

              {/* Overview Description */}
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 max-w-3xl">
                {exp.description}
              </p>

              {/* Bullet Key Points / Deliverables */}
              {exp.keyPoints && exp.keyPoints.length > 0 && (
                <div className="space-y-2.5 mb-5 max-w-3xl">
                  {exp.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-md bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/20">
                        <Icons.Check size={13} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technologies Stack Tags */}
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-1">
                    Tech Stack:
                  </span>
                  {exp.technologies.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-stone-100/90 dark:bg-zinc-900 text-stone-700 dark:text-zinc-300 border border-stone-200/80 dark:border-zinc-800 hover:border-purple-400/50 dark:hover:border-purple-500/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
