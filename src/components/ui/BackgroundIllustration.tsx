'use client';

import React from 'react';

/**
 * BackgroundIllustration Component
 * A universally applied, subtle background illustration that seamlessly flows
 * under the hero section and continues through all subsequent sections.
 * Beautifully balanced for both Dark and Light themes.
 */
export const BackgroundIllustration: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* ── 1. Ambient Diffused Glow Orbs (Fluid Depth Layer) ── */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden">
        {/* Upper Hero Glow (Top Right) */}
        <div className="absolute -top-24 right-[-5%] w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full bg-gradient-to-br from-purple-200/25 via-indigo-100/15 to-transparent dark:from-purple-600/20 dark:via-indigo-600/10 dark:to-transparent blur-[120px] transition-opacity duration-500" />

        {/* Bio / Marquee Transition Glow (Mid-Left) */}
        <div className="absolute top-[22%] -left-20 w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] rounded-full bg-gradient-to-tr from-indigo-200/20 via-purple-100/10 to-transparent dark:from-indigo-600/15 dark:via-purple-600/10 dark:to-transparent blur-[110px] transition-opacity duration-500" />

        {/* Services & Experience Glow (Mid-Right) */}
        <div className="absolute top-[48%] -right-24 w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-gradient-to-bl from-purple-200/20 via-indigo-100/10 to-transparent dark:from-purple-600/15 dark:via-pink-600/10 dark:to-transparent blur-[130px] transition-opacity duration-500" />

        {/* Projects & Contact Section Glow (Lower Center-Left) */}
        <div className="absolute top-[75%] left-[-8%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full bg-gradient-to-tr from-indigo-200/20 via-purple-100/10 to-transparent dark:from-violet-700/20 dark:via-indigo-800/10 dark:to-transparent blur-[140px] transition-opacity duration-500" />
      </div>

      {/* ── 2. Technical Dot-Matrix / Micro-Grid Pattern Layer ── */}
      <div className="absolute inset-0 opacity-[0.45] dark:opacity-[0.35] transition-opacity duration-500">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 48px x 48px Fine Grid Pattern with Center Dot */}
            <pattern
              id="universal-tech-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              {/* Subtle Grid Lines */}
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                className="stroke-stone-300/[0.25] dark:stroke-zinc-600/[0.12]"
                strokeWidth="0.8"
              />
              {/* Intersection Micro-Dot */}
              <circle
                cx="0"
                cy="0"
                r="1"
                className="fill-purple-500/20 dark:fill-purple-400/30"
              />
            </pattern>

            {/* Linear and Radial Gradients for the Abstract Wave Curves */}
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#ec4899" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="waveGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
              <stop offset="40%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Fill with soft edge vignette mask */}
          <rect
            width="100%"
            height="100%"
            fill="url(#universal-tech-grid)"
            style={{
              maskImage:
                'radial-gradient(ellipse 95% 95% at 50% 30%, black 50%, transparent 98%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 95% 95% at 50% 30%, black 50%, transparent 98%)',
            }}
          />
        </svg>
      </div>

      {/* ── 3. Sweeping Harmonic Vector Waves (Universal Across Entire Height) ── */}
      {/* Wave Stream 1: Top (Hero) through Upper-Middle (Bio & Marquee) */}
      <div className="absolute top-0 left-0 right-0 w-full h-[1800px] overflow-hidden opacity-50 dark:opacity-60 transition-opacity duration-500">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 1800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Main Harmonic Wave 1 */}
          <path
            d="M-100,280 C320,120 720,480 1100,240 C1300,110 1480,260 1600,320"
            stroke="url(#waveGrad1)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Echo Wave 1.1 */}
          <path
            d="M-80,310 C340,150 740,510 1120,270 C1320,140 1500,290 1620,350"
            stroke="url(#waveGrad1)"
            strokeWidth="1"
            strokeDasharray="4 8"
            fill="none"
            opacity="0.7"
          />
          {/* Echo Wave 1.2 */}
          <path
            d="M-60,340 C360,180 760,540 1140,300 C1340,170 1520,320 1640,380"
            stroke="url(#waveGrad1)"
            strokeWidth="0.8"
            fill="none"
            opacity="0.4"
          />

          {/* S-Curve sweeping from Bio to Services */}
          <path
            d="M1540,680 C1180,820 820,620 460,940 C220,1160 80,1050 -60,1180"
            stroke="url(#waveGrad2)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M1520,710 C1160,850 800,650 440,970 C200,1190 60,1080 -80,1210"
            stroke="url(#waveGrad2)"
            strokeWidth="1"
            strokeDasharray="6 6"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Wave Stream 2: Middle (Services & Experience) to Lower (Projects & Contact) */}
      <div className="absolute top-[1700px] left-0 right-0 w-full h-[2200px] overflow-hidden opacity-45 dark:opacity-55 transition-opacity duration-500">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 2200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Wave traversing Services and Projects */}
          <path
            d="M-100,320 C360,540 840,220 1220,480 C1400,610 1540,520 1600,560"
            stroke="url(#waveGrad3)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M-80,350 C380,570 860,250 1240,510 C1420,640 1560,550 1620,590"
            stroke="url(#waveGrad3)"
            strokeWidth="1"
            strokeDasharray="4 8"
            fill="none"
            opacity="0.7"
          />

          {/* Wave flowing down into Contact section */}
          <path
            d="M1600,1100 C1200,980 780,1320 380,1180 C140,1100 0,1260 -100,1320"
            stroke="url(#waveGrad1)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M1580,1130 C1180,1010 760,1350 360,1210 C120,1130 -20,1290 -120,1350"
            stroke="url(#waveGrad1)"
            strokeWidth="0.8"
            strokeDasharray="3 6"
            fill="none"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* ── 4. Subtle Micro-Geometric Accents (Crosshairs & Diamond Markers) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Near Hero Right */}
        <div className="absolute top-[12%] right-[8%] text-purple-600/30 dark:text-purple-400/40 text-xs font-mono font-light hidden sm:block">
          +
        </div>
        <div className="absolute top-[16%] left-[6%] text-indigo-600/25 dark:text-indigo-400/35 text-xs font-mono font-light hidden sm:block">
          +
        </div>

        {/* Near Bio / Marquee */}
        <div className="absolute top-[28%] right-[14%] w-1.5 h-1.5 rotate-45 border border-purple-500/30 dark:border-purple-400/40 hidden md:block" />
        <div className="absolute top-[35%] left-[10%] text-sky-600/25 dark:text-sky-400/35 text-xs font-mono font-light hidden sm:block">
          +
        </div>

        {/* Near Services & Experience */}
        <div className="absolute top-[52%] right-[7%] text-purple-600/30 dark:text-purple-400/40 text-xs font-mono font-light hidden sm:block">
          +
        </div>
        <div className="absolute top-[58%] left-[8%] w-1.5 h-1.5 rotate-45 border border-indigo-500/30 dark:border-indigo-400/40 hidden md:block" />

        {/* Near Projects & Contact */}
        <div className="absolute top-[72%] right-[10%] text-indigo-600/25 dark:text-indigo-400/35 text-xs font-mono font-light hidden sm:block">
          +
        </div>
        <div className="absolute top-[84%] left-[6%] text-purple-600/30 dark:text-purple-400/40 text-xs font-mono font-light hidden sm:block">
          +
        </div>
        <div className="absolute top-[92%] right-[15%] w-1.5 h-1.5 rotate-45 border border-purple-500/30 dark:border-purple-400/40 hidden md:block" />
      </div>
    </div>
  );
};
