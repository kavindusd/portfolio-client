'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePortfolio } from '../../../context/PortfolioContext';
import { initialProjects } from '../../../data/mockData';
import { Project } from '../../../types/portfolio';
import { Icons } from '../../../components/ui/Icons';
import { BackgroundIllustration } from '../../../components/ui/BackgroundIllustration';

interface ProjectDetailContentProps {
  projectId: string;
}

export const ProjectDetailContent: React.FC<ProjectDetailContentProps> = ({ projectId }) => {
  const { projects, profile } = usePortfolio();
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync theme
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

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      try {
        localStorage.setItem('portfolio-theme', 'dark');
      } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      try {
        localStorage.setItem('portfolio-theme', 'light');
      } catch {}
    }
  };

  // Find project in context or fallback to mockData
  const projectList = projects && projects.length > 0 ? projects : initialProjects;
  const projectIndex = projectList.findIndex((p) => p.id === projectId);
  const project: Project | undefined = projectList[projectIndex];

  // Previous and next projects for navigation
  const prevProject = projectIndex > 0 ? projectList[projectIndex - 1] : projectList[projectList.length - 1];
  const nextProject = projectIndex < projectList.length - 1 ? projectList[projectIndex + 1] : projectList[0];

  if (!project) {
    return (
      <div className="relative min-h-screen bg-[#f8f5ee] dark:bg-[#050508] text-zinc-900 dark:text-zinc-100 flex flex-col justify-center items-center px-6">
        <BackgroundIllustration />
        <div className="relative z-10 max-w-md w-full text-center p-8 rounded-2xl bg-white/90 dark:bg-[#0c0c14]/90 border border-stone-200/90 dark:border-zinc-800 shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
            <Icons.Folder size={26} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            The project you are looking for does not exist or has been relocated.
          </p>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-all"
          >
            <Icons.ArrowLeft size={14} />
            <span>Back to All Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8f5ee] dark:bg-[#050508] text-zinc-900 dark:text-zinc-100 flex flex-col overflow-x-hidden transition-colors duration-300">
      {/* Background illustration */}
      <BackgroundIllustration />

      {/* ── Top Floating Navigation Bar ── */}
      <header className="fixed top-3 sm:top-5 inset-x-3 sm:inset-x-6 max-w-5xl mx-auto z-50 pointer-events-auto">
        <nav
          aria-label="Project Navigation"
          className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 rounded-full bg-white/90 dark:bg-zinc-950/85 backdrop-blur-2xl border border-stone-200/90 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.75)]"
        >
          {/* Back button */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-stone-700 hover:text-purple-600 hover:bg-stone-100/80 dark:text-zinc-300 dark:hover:text-purple-400 dark:hover:bg-white/10 transition-all group"
          >
            <Icons.ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden xs:inline">Back to Projects</span>
            <span className="xs:hidden">Back</span>
          </Link>

          {/* Center Brand */}
          <Link
            href="/#home"
            className="flex items-center gap-1.5 text-xs font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            <span>{profile.name.toLowerCase()}</span>
            <span className="text-purple-600 dark:text-purple-400">.dev</span>
          </Link>

          {/* Right actions: Theme toggle & Contact */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 hover:text-amber-500 hover:bg-stone-100 dark:text-zinc-300 dark:hover:text-amber-400 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isDarkMode ? (
                <Icons.Moon size={15} className="text-zinc-300" />
              ) : (
                <Icons.Sun size={15} className="text-amber-500" />
              )}
            </button>

            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xs shadow-purple-600/25 hover:opacity-95 transition-all"
            >
              <span className="hidden sm:inline">Contact</span>
              <Icons.Mail size={13} />
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Main Project Content ── */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-5 sm:px-6 pt-24 sm:pt-32 pb-20">
        {/* Breadcrumb row */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-6">
          <Link href="/#home" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/#projects" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Projects
          </Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-zinc-200 font-semibold truncate max-w-[200px] sm:max-w-none">
            {project.title}
          </span>
        </div>

        {/* ── Hero Header ── */}
        <div className="mb-8 sm:mb-10">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/90 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white shadow-xs">
                Featured Work
              </span>
            )}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-stone-100/80 dark:bg-zinc-900 text-stone-600 dark:text-zinc-400 border border-stone-200/70 dark:border-zinc-800">
              <Icons.Calendar size={12} />
              <span>{project.createdAt}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight mb-4">
            {project.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed max-w-3xl mb-6">
            {project.description}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30 transition-all hover:-translate-y-0.5"
              >
                <span>Live Demo</span>
                <Icons.ExternalLink size={14} />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold bg-stone-100 hover:bg-stone-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-stone-300/70 dark:border-zinc-800 transition-all hover:-translate-y-0.5"
              >
                <Icons.Github size={15} />
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>

        {/* ── Main Showcase Image (Only when an image is uploaded) ── */}
        {project.imageUrl && project.imageUrl !== '/avatar.png' && (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-stone-300/70 dark:border-zinc-800/80 shadow-2xl mb-12 sm:mb-16">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* ── Project Details: 2-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-12 mb-16">
          {/* Left Column: Overview, Features & Deliverables (2 Cols) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">
                Project Overview
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {project.overview || project.description}
              </p>
            </div>

            {/* Key Highlights & Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
                  Key Features & Highlights
                </h2>
                <div className="space-y-3">
                  {project.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-zinc-900/40 border border-stone-200/80 dark:border-zinc-800/60"
                    >
                      <div className="w-5 h-5 rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/30">
                        <Icons.Check size={13} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">
                  Key Deliverables
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-purple-50/80 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/50 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Gallery Showcase */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
                  Visual Gallery
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((imgUrl, gIdx) => (
                    <div
                      key={gIdx}
                      className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-stone-200/90 dark:border-zinc-800 group"
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} screenshot ${gIdx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Project Meta Sidebar (1 Col) */}
          <div className="space-y-6">
            {/* Meta Card */}
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#0c0c14]/90 border border-stone-200/90 dark:border-zinc-800/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Project Metadata
              </h3>

              {project.role && (
                <div className="pb-3 border-b border-stone-100 dark:border-zinc-800/80">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-0.5">Role</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{project.role}</span>
                </div>
              )}

              {project.client && (
                <div className="pb-3 border-b border-stone-100 dark:border-zinc-800/80">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-0.5">Client / Context</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{project.client}</span>
                </div>
              )}

              <div className="pb-3 border-b border-stone-100 dark:border-zinc-800/80">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-0.5">Category</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{project.category}</span>
              </div>

              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-0.5">Released</span>
                <span className="text-sm font-mono font-medium text-zinc-900 dark:text-zinc-100">{project.createdAt}</span>
              </div>
            </div>

            {/* Technologies Used Card */}
            <div className="p-6 rounded-2xl bg-white/80 dark:bg-[#0c0c14]/90 border border-stone-200/90 dark:border-zinc-800/80 shadow-xs">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-stone-200/70 dark:border-zinc-700/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Navigation: Prev & Next Projects ── */}
        <div className="pt-10 border-t border-stone-200/90 dark:border-zinc-800/80">
          <div className="flex items-center justify-between gap-4">
            {/* Prev */}
            {prevProject && (
              <Link
                href={`/projects/${prevProject.id}`}
                className="group flex flex-col items-start p-4 rounded-2xl hover:bg-white/60 dark:hover:bg-zinc-900/40 transition-colors max-w-[48%]"
              >
                <div className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                  <Icons.ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                  <span>Previous Project</span>
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                  {prevProject.title}
                </span>
              </Link>
            )}

            {/* Next */}
            {nextProject && (
              <Link
                href={`/projects/${nextProject.id}`}
                className="group flex flex-col items-end p-4 rounded-2xl hover:bg-white/60 dark:hover:bg-zinc-900/40 transition-colors max-w-[48%] ml-auto text-right"
              >
                <div className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                  <span>Next Project</span>
                  <Icons.ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">
                  {nextProject.title}
                </span>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t border-stone-200/80 dark:border-zinc-900 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};
