'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';

export const HeroSection: React.FC = () => {
  const { profile } = usePortfolio();
  const [avatarError, setAvatarError] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-[85vh] lg:min-h-[calc(100vh-80px)] flex flex-col justify-end pt-20 sm:pt-24 lg:pt-28 pb-0 px-4 sm:px-6 overflow-hidden isolate"
    >
      {/* Red & Blue atmospheric backdrop matching reference design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center opacity-45 dark:opacity-75 transition-opacity duration-500">
        {/* Dual-tone vivid red and blue backdrop gradient */}
        <div
          className="w-full max-w-6xl h-[600px] translate-y-16"
          style={{
            background: `
              radial-gradient(ellipse 55% 50% at 30% 72%, rgba(239, 68, 68, 0.55) 0%, rgba(220, 38, 38, 0.35) 40%, rgba(185, 28, 28, 0.15) 60%, transparent 80%),
              radial-gradient(ellipse 55% 50% at 75% 70%, rgba(37, 99, 235, 0.60) 0%, rgba(59, 130, 246, 0.40) 40%, rgba(29, 78, 216, 0.18) 60%, transparent 80%),
              radial-gradient(ellipse 60% 45% at 50% 30%, rgba(147, 51, 234, 0.45) 0%, rgba(126, 34, 206, 0.20) 50%, transparent 75%)
            `,
            filter: 'blur(50px)',
          }}
        />

        {/* Supplementary distinct red glow orb behind left side */}
        <div className="absolute top-[50%] left-[20%] w-[420px] h-[280px] bg-red-600/45 rounded-full blur-[75px]" />

        {/* Supplementary distinct blue glow orb behind right side */}
        <div className="absolute top-[46%] right-[15%] w-[450px] h-[300px] bg-blue-600/50 rounded-full blur-[75px]" />

        {/* Violet glow behind heading */}
        <div className="absolute top-[18%] left-[38%] w-[500px] h-[340px] bg-purple-600/40 rounded-full blur-[85px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-end flex-1">
          {/* Left Column: Heading, Role, Glitter Star, Bio & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left self-center py-6 sm:py-10 lg:py-14">
            {/* Heading with page load animation and top-right glitter sparkle */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.14] mb-4 sm:mb-6">
              {/* First line: Hey, I'm Kavindu + Glitter Star at top right */}
              <span className="relative inline-block animate-hero-line-1 opacity-0">
                <span className="text-zinc-900 dark:text-white">
                  {profile.hero?.greeting ? `${profile.hero.greeting} ` : "Hey, I'm "}
                </span>
                <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 dark:from-violet-300 dark:via-purple-200 dark:to-indigo-300 bg-clip-text text-transparent drop-shadow-none dark:drop-shadow-[0_0_35px_rgba(168,85,247,0.4)] font-extrabold">
                  {profile.name}
                </span>

                {/* Glittering Sparkle Stars at the top-right corner of the first line */}
                <span className="absolute -top-2.5 -right-6 sm:-top-4 sm:-right-8 inline-flex items-center pointer-events-none select-none">
                  {/* Primary 4-point glitter star */}
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#fde047] animate-glitter"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  {/* Secondary companion glitter star */}
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#fef08a] animate-glitter-mini absolute -bottom-1 -left-2"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                </span>
              </span>

              <br />

              {/* Second line: A Web Developer */}
              <span className="inline-block animate-hero-line-2 opacity-0 mt-1">
                <span className="text-zinc-900 dark:text-white">
                  {profile.hero?.rolePrefix ? `${profile.hero.rolePrefix} ` : "A "}
                </span>
                <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 dark:from-violet-300 dark:via-purple-200 dark:to-indigo-300 bg-clip-text text-transparent drop-shadow-none dark:drop-shadow-[0_0_35px_rgba(168,85,247,0.4)] font-extrabold">
                  {profile.role}
                </span>
              </span>
            </h1>

            {/* Subtitle / Bio description */}
            <div className="max-w-xl text-left mb-6 sm:mb-8 space-y-1.5 animate-hero-bio opacity-0">
              {profile.hero?.tagline ? (
                <p className="text-zinc-800 dark:text-white font-medium text-sm sm:text-base leading-relaxed">
                  {profile.hero.tagline}
                </p>
              ) : (
                <p className="text-zinc-800 dark:text-white font-medium text-sm sm:text-base leading-relaxed">
                  A web developer <span className="text-zinc-500 dark:text-zinc-400 font-normal">with solid foundations in design.</span>
                </p>
              )}
              {profile.bio && (
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-base font-normal leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* CTA Buttons & Social Icons Row */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 animate-hero-cta opacity-0">
              {/* Download CV button */}
              <a
                href={profile.hero?.cvUrl || '/cv.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                download={`${(profile.name || 'Kavindu_Sandeepa').replace(/\s+/g, '_')}_CV.pdf`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 dark:bg-zinc-950/90 dark:hover:bg-zinc-900 border border-purple-500/30 dark:border-zinc-800 hover:border-purple-500/60 shadow-lg shadow-purple-600/25 dark:shadow-black/60 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Icons.Download size={15} className="text-purple-200 dark:text-purple-400" />
                <span>Download CV</span>
              </a>

              {/* View Projects button */}
              <Link
                href="#projects"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-50 dark:text-zinc-300 dark:hover:text-white dark:bg-zinc-950/90 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50 shadow-sm dark:shadow-black/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Icons.Folder size={15} className="text-zinc-500 dark:text-zinc-400" />
                <span>View Projects</span>
              </Link>

              {/* Vertical Divider */}
              <span className="text-zinc-300 dark:text-zinc-700 font-light mx-1 hidden sm:inline-block">
                |
              </span>

              {/* Social Icons with Black rounded bg in Light Mode & White rounded bg in Dark Mode */}
              <div className="flex items-center gap-2 sm:gap-2.5">
                {profile.socials.github && (
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white shadow-sm hover:scale-110 active:scale-95 transition-all duration-300"
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
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white shadow-sm hover:scale-110 active:scale-95 transition-all duration-300"
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
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 border border-zinc-900 dark:border-white shadow-sm hover:scale-110 active:scale-95 transition-all duration-300"
                    title="Instagram"
                  >
                    <Icons.Instagram size={17} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Frameless Avatar without any container frame */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end items-end self-end animate-hero-avatar opacity-0">
            <div className="relative group flex items-end justify-center">
              {/* Subtle ambient backlight glow behind avatar */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 via-indigo-500/15 to-blue-500/15 dark:from-purple-600/30 dark:via-indigo-500/20 dark:to-blue-500/25 blur-3xl rounded-full opacity-40 dark:opacity-60 pointer-events-none -z-10 scale-95" />

              {/* Frameless Avatar Cutout */}
              <img
                src={avatarError ? '/avatar.png' : (profile.avatarUrl || '/avatar.png')}
                alt={profile.name}
                onError={() => setAvatarError(true)}
                className="w-auto h-auto max-h-[340px] sm:max-h-[500px] lg:max-h-[640px] object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.14)] dark:drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)] group-hover:drop-shadow-[0_20px_40px_rgba(168,85,247,0.25)] select-none block -mb-1 transition-all duration-500 ease-out group-hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
