'use client';

import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from '../ui/Icons';
import { PeekingCat } from '../ui/PeekingCat';

export const ContactSection: React.FC = () => {
  const { profile, sendMessage } = usePortfolio();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      sendMessage(formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 450);
  };

  const phoneDisplay = profile.socials.phone || '+94 77 123 4567';
  const phoneTel = phoneDisplay.replace(/\s+/g, '');

  return (
    <section id="contact" className="py-16 sm:py-24 px-5 sm:px-6 max-w-6xl mx-auto w-full">
      {/* ── Section Header with Animated Peeking Cat Mascot ── */}
      <div className="flex flex-col items-start mb-8 sm:mb-10">
        <PeekingCat text="Let's Talk" variant="white" />
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2 sm:mb-3">
          Hey, let&apos;s talk.
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
          Have an exciting project, a freelance opportunity, or just want to connect? Send me a message and I&apos;ll get right back to you.
        </p>
      </div>

      {/* ── Modern Unified Contact Card with Red & Blue Color Mesh INSIDE ── */}
      <div className="relative rounded-2xl p-5 sm:p-10 lg:p-12 bg-[#fbf9f4]/85 dark:bg-[#0c0c14]/85 backdrop-blur-2xl border border-stone-300/70 dark:border-zinc-800/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.06)] dark:shadow-2xl overflow-hidden transition-all duration-300">
        {/* ── Red & Blue Atmospheric Color Mesh Backdrop INSIDE the container (Matching Hero Section) ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-50 dark:opacity-75 transition-opacity duration-500">
          {/* Dual-tone vivid red, blue, and violet radial mesh gradient */}
          <div
            className="absolute inset-0 w-full h-full scale-105"
            style={{
              background: `
                radial-gradient(ellipse 55% 50% at 25% 70%, rgba(239, 68, 68, 0.55) 0%, rgba(220, 38, 38, 0.35) 40%, rgba(185, 28, 28, 0.15) 60%, transparent 80%),
                radial-gradient(ellipse 55% 50% at 80% 35%, rgba(37, 99, 235, 0.60) 0%, rgba(59, 130, 246, 0.40) 40%, rgba(29, 78, 216, 0.18) 60%, transparent 80%),
                radial-gradient(ellipse 60% 45% at 50% 50%, rgba(147, 51, 234, 0.45) 0%, rgba(126, 34, 206, 0.20) 50%, transparent 75%)
              `,
              filter: 'blur(50px)',
            }}
          />

          {/* Supplementary distinct red glow orb on left side */}
          <div className="absolute -bottom-10 -left-10 w-[380px] h-[280px] bg-red-600/45 rounded-full blur-[75px]" />

          {/* Supplementary distinct blue glow orb on right side */}
          <div className="absolute -top-10 -right-10 w-[420px] h-[300px] bg-blue-600/50 rounded-full blur-[75px]" />

          {/* Supplementary violet glow orb in center */}
          <div className="absolute top-[25%] left-[35%] w-[380px] h-[260px] bg-purple-600/40 rounded-full blur-[85px]" />
        </div>

        {/* ── Subtly Blended Chat Message Icon Watermark (Left Side) ── */}
        <div className="absolute -bottom-10 -left-10 sm:-bottom-6 sm:-left-6 pointer-events-none select-none text-purple-600/[0.08] dark:text-purple-400/[0.12] rotate-[6deg] scale-x-[-1] z-0">
          <svg
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[300px] sm:w-[380px] lg:w-[440px] h-[300px] sm:h-[380px] lg:h-[440px]"
          >
            {/* Chat Speech Bubble */}
            <path
              d="M45 28 h150 c13.8 0 25 11.2 25 25 v84 c0 13.8 -11.2 25 -25 25 h-65 l-46 36 c-4.6 3.6 -11.4 0.3 -11.4 -5.5 v-30.5 H45 c-13.8 0 -25 -11.2 -25 -25 V53 c0 -13.8 11.2 -25 25 -25 z"
              fill="currentColor"
              fillOpacity="0.04"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Three Signature Chat Message Dots */}
            <circle cx="82" cy="95" r="10" fill="currentColor" fillOpacity="0.22" />
            <circle cx="120" cy="95" r="10" fill="currentColor" fillOpacity="0.22" />
            <circle cx="158" cy="95" r="10" fill="currentColor" fillOpacity="0.22" />
          </svg>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Direct Contact Info (Simplified) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
            {/* Location Card */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-stone-100/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-stone-300/60 dark:border-zinc-800/70 shadow-xs">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Icons.MapPin size={19} />
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Location
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  Kurunegala, Sri Lanka
                </span>
              </div>
            </div>

            {/* Phone Number Card */}
            {phoneDisplay && (
              <a
                href={`tel:${phoneTel}`}
                className="group flex items-center gap-3.5 p-4 rounded-2xl bg-stone-100/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-stone-300/60 dark:border-zinc-800/70 hover:border-emerald-500/50 hover:bg-stone-50 dark:hover:bg-zinc-900 shadow-xs hover:shadow-sm transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icons.Phone size={19} />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    Phone Number
                  </span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {phoneDisplay}
                  </span>
                </div>
              </a>
            )}

            {/* WhatsApp Card */}
            {profile.socials.whatsapp && (
              <a
                href={
                  profile.socials.whatsapp.startsWith('http')
                    ? profile.socials.whatsapp
                    : `https://wa.me/${profile.socials.whatsapp.replace(/[^\d]/g, '')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 p-4 rounded-2xl bg-stone-100/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-stone-300/60 dark:border-zinc-800/70 hover:border-[#25D366]/50 hover:bg-stone-50 dark:hover:bg-zinc-900 shadow-xs hover:shadow-sm transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icons.WhatsApp size={19} />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    WhatsApp Chat
                  </span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-[#25D366] transition-colors">
                    {profile.socials.whatsapp}
                  </span>
                </div>
              </a>
            )}

            {/* Direct Email Card */}
            <a
              href={`mailto:${profile.socials.email || 'kavindu@example.com'}`}
              className="group flex items-center gap-3.5 p-4 rounded-2xl bg-stone-100/80 dark:bg-zinc-900/60 backdrop-blur-sm border border-stone-300/60 dark:border-zinc-800/70 hover:border-purple-500/50 hover:bg-stone-50 dark:hover:bg-zinc-900 shadow-xs hover:shadow-sm transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Icons.Mail size={19} />
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Direct Email
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {profile.socials.email || 'kavindu@example.com'}
                </span>
              </div>
            </a>

            {/* Social Links Strip */}
            <div className="pt-3 flex items-center gap-2.5">
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mr-1">
                Socials:
              </span>
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white bg-stone-100/90 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="GitHub"
                >
                  <Icons.Github size={16} />
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white bg-stone-100/90 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Icons.Linkedin size={16} />
                </a>
              )}
              {profile.socials.instagram && (
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white bg-stone-100/90 dark:bg-zinc-800/60 hover:bg-stone-200 dark:hover:bg-zinc-700 transition-colors"
                  aria-label="Instagram"
                >
                  <Icons.Instagram size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Modern Streamlined Contact Form */}
          <div className="lg:col-span-7 relative z-10">
            <div className="relative rounded-2xl p-4 sm:p-8 bg-[#f5f1e8]/85 dark:bg-[#07070b]/85 border border-stone-300/70 dark:border-zinc-800/90 shadow-sm backdrop-blur-md overflow-hidden">
              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center justify-center animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                    <Icons.Check size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mb-6 leading-relaxed">
                    Thank you for reaching out. Your message is safely logged, and I will reply to you as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="name"
                      className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5"
                    >
                      <Icons.User size={13} className="text-purple-600 dark:text-purple-400" />
                      <span>Your Name</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-stone-300/70 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-xs transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5"
                    >
                      <Icons.Mail size={13} className="text-purple-600 dark:text-purple-400" />
                      <span>Your Email</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="e.g. alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-stone-300/70 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-xs transition-all"
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label
                      htmlFor="message"
                      className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-zinc-300 mb-1.5"
                    >
                      <Icons.MessageSquare size={13} className="text-purple-600 dark:text-purple-400" />
                      <span>Message</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={4}
                      placeholder="Tell me about your project, ideas, or timeline..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900/80 border border-stone-300/70 dark:border-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-stone-400 dark:placeholder-zinc-600 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 shadow-xs transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 active:scale-[0.99] shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Icons.Send size={14} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
