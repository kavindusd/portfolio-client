'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';
import { PeekingCat } from '../ui/PeekingCat';

export const ProjectsSection: React.FC = () => {
  const { projects } = usePortfolio();
  const [filter, setFilter] = useState<'All' | 'Fullstack' | 'Frontend' | 'Design'>('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isPointerDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  const categories = ['All', 'Fullstack', 'Frontend', 'Design'] as const;

  const filteredProjects = projects.filter((p) => {
    if (filter === 'All') return true;
    return p.category === filter;
  });

  // Track active project index as user scrolls
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    const cardStep = 265;
    const index = Math.round(scrollLeft / cardStep);
    setActiveIndex(Math.min(Math.max(0, index), filteredProjects.length - 1));
  }, [filteredProjects.length]);

  // Jump to specific project index
  const scrollToIndex = (idx: number) => {
    if (!scrollContainerRef.current) return;
    const cardStep = 265;
    scrollContainerRef.current.scrollTo({
      left: idx * cardStep,
      behavior: 'smooth',
    });
    setActiveIndex(idx);
  };

  // Mouse wheel handler: allows horizontal scrolling on mobile via normal mouse wheel OR Shift+Wheel
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    // Only convert on mobile screens where carousel is horizontal
    if (window.innerWidth < 640) {
      // If user scrolls regular vertical wheel, translate deltaY into horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
      } else if (Math.abs(e.deltaX) > 0) {
        scrollContainerRef.current.scrollLeft += e.deltaX;
      }
    }
  };

  // Pointer Drag handling (works uniformly for mouse drag, trackpads, and DevTools touch/pointer emulation)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || window.innerWidth >= 640 || !scrollContainerRef.current) return;
    isPointerDown.current = true;
    dragDistance.current = 0;
    startX.current = e.clientX;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;

    if (e.pointerType === 'mouse') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current || !scrollContainerRef.current) return;
    const deltaX = e.clientX - startX.current;
    dragDistance.current = Math.abs(deltaX);

    if (dragDistance.current > 4) {
      if (!isDraggingState) {
        setIsDraggingState(true);
      }
      scrollContainerRef.current.scrollLeft = scrollLeftStart.current - deltaX;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    if (isDraggingState) {
      setTimeout(() => setIsDraggingState(false), 50);
    }
    if (e.pointerType === 'mouse') {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDown.current = false;
    setIsDraggingState(false);
    if (e.pointerType === 'mouse') {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Prevent link click when dragging
  const handleLinkClick = (e: React.MouseEvent) => {
    if (dragDistance.current > 8) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Reset scroll position on filter change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      setActiveIndex(0);
    }
  }, [filter]);

  return (
    <section id="projects" className="py-16 sm:py-24 px-5 sm:px-6 max-w-6xl mx-auto w-full min-w-0">
      {/* ── Section Header with Peeking Cat Mascot ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-12 gap-4 sm:gap-6">
        <div className="flex flex-col items-start">
          <PeekingCat text="Projects" variant="white" />
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-1.5 sm:mb-3">
            Featured Projects
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
            Selected applications and digital products demonstrating engineering and design excellence.
          </p>
        </div>

        {/* Filter Pills with horizontal scroll on mobile */}
        <div className="flex gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#0c0c14]/90 border border-stone-200/90 dark:border-zinc-800/80 shadow-sm overflow-x-auto max-w-full no-scrollbar self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-stone-100/90 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile: Smooth Horizontal Scroll in One Line | Desktop: 4-in-a-row Grid ── */}
      <div className="relative w-full min-w-0">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{ WebkitOverflowScrolling: 'touch' }}
          className={`w-full max-w-full min-w-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 pt-1 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar touch-pan-x select-none ${
            isDraggingState
              ? 'snap-none scroll-auto cursor-grabbing'
              : 'snap-x snap-mandatory scroll-smooth cursor-grab'
          }`}
        >
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              onClick={handleLinkClick}
              className="w-[250px] xs:w-[270px] sm:w-auto shrink-0 snap-center group relative rounded-2xl overflow-hidden bg-[#fbf9f4] dark:bg-[#0c0c14]/90 border border-stone-300/70 dark:border-zinc-800/80 hover:border-purple-500/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_-8px_rgba(168,85,247,0.15)] dark:hover:shadow-purple-950/30 transition-all duration-300 flex flex-col hover:-translate-y-1 select-none cursor-pointer"
            >
              {/* Ambient corner glow on hover */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-purple-500/15 via-indigo-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                {project.imageUrl && project.imageUrl !== '/avatar.png' ? (
                  <>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100 pointer-events-none"
                      loading="lazy"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-950/25 via-zinc-900 to-zinc-950 text-zinc-500 group-hover:text-purple-400 transition-colors">
                    <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:border-purple-500/30 transition-all">
                      <Icons.Folder size={20} />
                    </div>
                    <span className="text-[10px] font-medium tracking-wide opacity-75">
                      Upload Image in Admin
                    </span>
                  </div>
                )}

                {/* Badges on image */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/75 backdrop-blur-md text-zinc-200 border border-white/10">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-600/90 text-white backdrop-blur-md">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Content: Title & Basic Info */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <Icons.ArrowRight
                      size={14}
                      className="text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0"
                    />
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {project.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100/90 dark:bg-zinc-800/60 text-stone-700 dark:text-zinc-300 border border-stone-200/60 dark:border-zinc-700/40"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 self-center">
                      +{project.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Mobile Indicator Dots ── */}
      {filteredProjects.length > 1 && (
        <div className="flex sm:hidden items-center justify-center gap-1.5 pt-3">
          {filteredProjects.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Jump to project ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-5 bg-purple-600 dark:bg-purple-400'
                  : 'w-1.5 bg-stone-300 dark:bg-zinc-700'
              }`}
            />
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-[#0c0c14]/90 rounded-2xl border border-stone-200/90 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">No projects found in this category.</p>
        </div>
      )}
    </section>
  );
};
