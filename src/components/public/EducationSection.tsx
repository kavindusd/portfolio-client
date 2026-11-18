'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { CertificateItem } from '../../types/portfolio';
import { Icons } from '../ui/Icons';
import { PeekingCat } from '../ui/PeekingCat';

export const EducationSection: React.FC = () => {
  const { educations, certificates } = usePortfolio();
  const [showCertificates, setShowCertificates] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  return (
    <section id="education" className="py-16 sm:py-24 px-5 sm:px-6 max-w-5xl mx-auto w-full scroll-mt-24">
      {/* ── Section Header with Peeking Cat Mascot & Expandable Certificates Trigger ── */}
      <div className="mb-12 sm:mb-16 flex flex-col items-start">
        <PeekingCat text="Education" variant="white" />
        <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 sm:mb-3">
              Education & Academics
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Academic qualifications, computer science fundamentals, and verified professional certifications.
            </p>
          </div>

          {/* Interactive Certificates Toggle Button */}
          {certificates && certificates.length > 0 && (
            <button
              type="button"
              onClick={() => setShowCertificates((prev) => !prev)}
              className={`group inline-flex items-center justify-between sm:justify-start gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm border w-full sm:w-auto shrink-0 ${
                showCertificates
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/25'
                  : 'bg-stone-100/80 hover:bg-white dark:bg-[#0c0c14] text-zinc-800 dark:text-zinc-200 border border-stone-300/70 dark:border-zinc-800 hover:border-indigo-500/50 dark:hover:bg-zinc-900/60'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  showCertificates
                    ? 'bg-white/20 text-white'
                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}
              >
                <Icons.Award size={16} />
              </div>
              <span>{showCertificates ? 'Hide Certificates' : 'View Certificates'}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                  showCertificates
                    ? 'bg-white/20 text-white'
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                }`}
              >
                {certificates.length} Verified
              </span>
              {showCertificates ? (
                <Icons.ChevronUp size={16} className="text-white transition-transform" />
              ) : (
                <Icons.ChevronDown size={16} className="text-zinc-400 group-hover:text-indigo-500 transition-transform" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Expandable Certificates Showcase Drawer ── */}
      {showCertificates && certificates && certificates.length > 0 && (
        <div className="mb-14 sm:mb-16 p-5 sm:p-8 rounded-2xl bg-gradient-to-b from-indigo-500/5 via-purple-500/5 to-transparent border border-indigo-500/20 dark:border-indigo-500/30 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-stone-200/80 dark:border-zinc-800/80">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
                <Icons.Award size={13} />
                <span>Verified Credentials</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                Professional Certifications & Badges
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Click any certificate to inspect full resolution preview and verification details.
              </p>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {certificates.length} Credentials Available
            </span>
          </div>

          {/* Grid of Certificate Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group relative rounded-2xl bg-[#fbf9f4] dark:bg-[#0c0c14]/90 border border-stone-300/70 dark:border-zinc-800/80 hover:border-indigo-500/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_-8px_rgba(99,102,241,0.2)] dark:hover:shadow-indigo-950/30 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1"
              >
                {/* Subtle top-right ambient glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/15 via-purple-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div>
                  {/* Certificate Image Preview */}
                  <div
                    className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-stone-100/90 dark:bg-zinc-900 cursor-pointer"
                    onClick={() => setSelectedCert(cert)}
                  >
                    {cert.imageUrl ? (
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-950/40 via-zinc-900 to-purple-950/40 text-indigo-400 p-4 text-center">
                        <Icons.Award size={36} className="mb-2 opacity-80" />
                        <span className="text-xs font-semibold text-zinc-300">{cert.title}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    {/* Verified Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-zinc-900/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Verified</span>
                    </div>

                    {/* Hover Preview Button */}
                    <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-900/85 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icons.Eye size={14} />
                    </div>

                    {/* Date Pill on bottom right */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-black/70 backdrop-blur-sm text-zinc-200">
                      {cert.date}
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1.5">
                      {cert.issuer}
                    </span>
                    <h4 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-2 mb-3">
                      {cert.title}
                    </h4>

                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {cert.skills.map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100/90 dark:bg-zinc-800/60 text-stone-700 dark:text-zinc-300 border border-stone-200/60 dark:border-zinc-700/40"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Footer */}
                <div className="px-5 pb-5 pt-3 flex items-center justify-between border-t border-stone-100 dark:border-zinc-800/60">
                  <button
                    type="button"
                    onClick={() => setSelectedCert(cert)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <Icons.Eye size={13} />
                    <span>Preview Image</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modern Frameless Timeline Stream (No Heavy Boxes) ── */}
      <div className="relative space-y-12 sm:space-y-16 before:absolute before:left-[18px] sm:before:left-[22px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-indigo-500 before:via-indigo-500/40 before:to-transparent">
        {educations.map((edu, index) => (
          <div
            key={edu.id || index}
            className="group relative pl-14 sm:pl-16 transition-all duration-300"
          >
            {/* ── Timeline Checkpoint Node with Dynamic Number Badge (Centered directly on the vertical line) ── */}
            <div className="absolute left-[18px] sm:left-[22px] -translate-x-1/2 top-0.5 z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white dark:bg-[#0c0c14] border-2 border-indigo-500/60 dark:border-indigo-400/60 group-hover:border-indigo-500 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300 flex items-center justify-center shadow-md">
                <span className="font-mono font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* ── Open Modern Timeline Content Stream ── */}
            <div>
              {/* Header: Degree Title + Period Badge */}
              <div className="flex flex-wrap items-baseline justify-between gap-3 mb-1.5">
                <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                  {edu.degree}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-100/90 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 shadow-2xs">
                  <Icons.Calendar size={13} className="text-indigo-600 dark:text-indigo-400" />
                  <span>{edu.period}</span>
                </div>
              </div>

              {/* Institution Row */}
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-zinc-900 dark:text-zinc-100 font-bold">{edu.institution}</span>
              </div>

              {/* Description Overview */}
              {edu.description && (
                <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4 max-w-3xl">
                  {edu.description}
                </p>
              )}

              {/* Bullet Key Points / Academic Milestones */}
              {edu.keyPoints && edu.keyPoints.length > 0 && (
                <div className="space-y-2.5 mb-2 max-w-3xl">
                  {edu.keyPoints.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20">
                        <Icons.Check size={13} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        {point}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Certificate Preview Modal / Lightbox ── */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[92vh] overflow-y-auto bg-white dark:bg-[#0c0c14] border border-stone-200/90 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-stone-100/90 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              aria-label="Close Preview"
            >
              <Icons.X size={18} />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-stone-200/90 dark:border-zinc-800 mb-6">
              {selectedCert.imageUrl ? (
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  className="w-full h-full object-contain bg-black/60"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-indigo-400 p-8 text-center">
                  <Icons.Award size={48} className="mb-3 opacity-80" />
                  <span className="text-sm font-semibold text-zinc-200">{selectedCert.title}</span>
                  <span className="text-xs text-zinc-400 mt-1">{selectedCert.issuer}</span>
                </div>
              )}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-xl text-xs font-semibold bg-zinc-900/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Certificate</span>
              </div>
            </div>

            {/* Modal Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {selectedCert.issuer} • {selectedCert.date}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  {selectedCert.title}
                </h3>
                {selectedCert.skills && selectedCert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedCert.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 border border-stone-200 dark:border-zinc-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
