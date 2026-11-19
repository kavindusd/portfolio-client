'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PeekingCat } from '../ui/PeekingCat';

export const PersonalBioSection: React.FC = () => {
  const { profile } = usePortfolio();
  const [imageError, setImageError] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  const photoSrc = profile.about?.photoUrl || (imageError ? '/profile.jpg' : (profile.avatarUrl || '/profile.jpg'));

  // Trigger smooth reveal of the quote & small circular image when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setQuoteVisible(true);
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const currentEl = quoteRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
      observer.disconnect();
    };
  }, []);

  const badgeText = profile.about?.badge || 'About Me';
  const headingText = profile.about?.heading || 'Passionate about crafting digital experiences that make an impact.';
  const stat1Value = profile.about?.stat1Value || '3+';
  const stat1Label = profile.about?.stat1Label || 'Years Coding Experience';
  const stat2Value = profile.about?.stat2Value || '25+';
  const stat2Label = profile.about?.stat2Label || 'Applications Built';
  const stat3Value = profile.about?.stat3Value || '100%';
  const stat3Label = profile.about?.stat3Label || 'Client & Project Commitment';
  const quoteText = profile.about?.quote || "Great software isn't just about writing code — it's about creating intuitive, memorable digital experiences that solve real problems with elegance and speed.";

  return (
    <section id="about" className="py-16 sm:py-24 px-5 sm:px-6 max-w-5xl mx-auto w-full">
      {/* ── Section Header with Mascot ── */}
      <div className="flex flex-col items-start mb-6 sm:mb-8">
        <PeekingCat text={badgeText} variant="white" />
        <h2 className="text-3xl sm:text-5xl lg:text-[46px] font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.15] mb-4">
          {headingText}
        </h2>
      </div>

      {/* ── Full-Width Clean Bio Narrative ── */}
      <div className="space-y-6 sm:space-y-7 text-left w-full">
        {/* Intro */}
        {profile.about?.intro ? (
          <p className="text-base sm:text-xl lg:text-2xl font-normal text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
            {profile.about.intro}
          </p>
        ) : (
          <p className="text-base sm:text-xl lg:text-2xl font-normal text-zinc-700 dark:text-zinc-300 leading-relaxed">
            Hi, I&apos;m <span className="font-bold text-zinc-950 dark:text-white">{profile.name}</span> — a dedicated web developer bridging the gap between creative UI/UX design and engineering performance to build web applications that look stunning and function seamlessly.
          </p>
        )}

        {/* Narrative Description */}
        <div className="space-y-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {profile.about?.paragraph1 ? (
            <p className="whitespace-pre-line">{profile.about.paragraph1}</p>
          ) : (
            <p>
              With solid expertise across modern frontend architecture and backend technologies like Next.js, React, Node.js, PHP, and databases, I specialize in crafting digital products that load fast, scale reliably, and deliver an intuitive user experience.
            </p>
          )}

          {profile.about?.paragraph2 ? (
            <p className="whitespace-pre-line">{profile.about.paragraph2}</p>
          ) : (
            <p>
              Whether translating Figma prototypes into responsive, accessible code or architecting fullstack solutions, I prioritize clean modular architecture, thoughtful interaction design, and continuous learning.
            </p>
          )}
        </div>

        {/* ── Quick Stats Strip ── */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full py-4 sm:py-5 border-y border-stone-200/90 dark:border-zinc-800/80 text-center sm:text-left">
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {stat1Value}
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-tight block">
              {stat1Label}
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {stat2Value}
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-tight block">
              {stat2Label}
            </span>
          </div>
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
              {stat3Value}
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-tight block">
              {stat3Label}
            </span>
          </div>
        </div>

        {/* ── Scroll-Triggered Personal Quote freely in background (No box) ── */}
        <div
          ref={quoteRef}
          className={`w-full py-4 sm:py-6 text-center transition-all duration-700 ease-out ${
            quoteVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          {/* Two horizontal lines flanking the small circular image */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-xl mx-auto mb-4 sm:mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-stone-300 to-stone-400/80 dark:via-zinc-800 dark:to-zinc-700" />
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0 p-0.5 bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-500 shadow-md shadow-purple-600/20">
              <img
                src={photoSrc}
                alt={profile.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover rounded-full select-none"
              />
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-stone-300 to-stone-400/80 dark:via-zinc-800 dark:to-zinc-700" />
          </div>

          {/* Quote text under the image */}
          <blockquote className="max-w-2xl mx-auto text-sm sm:text-lg md:text-xl font-medium text-zinc-800 dark:text-zinc-200 italic leading-relaxed">
            &ldquo;{quoteText}&rdquo;
          </blockquote>
        </div>
      </div>
    </section>
  );
};
