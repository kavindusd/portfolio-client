'use client';

import React, { useState, useEffect, useRef } from 'react';

interface PeekingCatProps {
  text?: string;
  variant?: 'white' | 'dark' | 'purple';
  className?: string;
}

export const PeekingCat: React.FC<PeekingCatProps> = ({
  text = 'About Me',
  variant = 'white',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  // Scroll detection: Peek when scrolled into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsPeeking(true);
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentEl = containerRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) observer.unobserve(currentEl);
      observer.disconnect();
    };
  }, []);

  // Subtle mouse tracking for cat pupils
  useEffect(() => {
    if (!isPeeking) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top - 20;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const dist = Math.min(Math.hypot(deltaX, deltaY) / 220, 1) * 2.2;

      setEyeOffset({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPeeking]);

  // Periodic blinking
  useEffect(() => {
    if (!isPeeking) return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3800);
    return () => clearInterval(interval);
  }, [isPeeking]);

  // Styling variants for the shape
  const variantStyles = {
    white:
      'bg-white text-zinc-950 font-bold border-stone-200/90 dark:border-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_4px_25px_rgba(168,85,247,0.35)]',
    dark:
      'bg-zinc-900/90 text-white font-semibold border-white/15 shadow-lg shadow-black/40 hover:border-purple-500/40',
    purple:
      'bg-purple-500/15 text-purple-300 font-semibold border-purple-500/30 shadow-lg shadow-purple-900/20 hover:bg-purple-500/25',
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center pt-8 mb-4 cursor-pointer select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered((prev) => !prev)}
    >
      {/* Interactive Speech Bubble */}
      <div
        className={`absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-xl bg-purple-950/90 border border-purple-500/40 text-purple-200 text-[10px] font-mono shadow-lg transition-all duration-300 pointer-events-none z-30 ${
          isHovered
            ? 'opacity-100 scale-100 -translate-y-1'
            : 'opacity-0 scale-90 translate-y-1'
        }`}
      >
        <span>Meow! 🐾</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-950 border-r border-b border-purple-500/40 rotate-45" />
      </div>

      {/* Layer 0: Cat Head Peeking from behind the shape */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-14 pointer-events-none transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) z-0 ${
          isPeeking
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-75'
        }`}
      >
        <svg
          viewBox="0 0 80 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-md"
        >
          <defs>
            {/* Fur Gradient - Warm cream Scampuss fur */}
            <radialGradient id="peekFur" cx="45%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="65%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            {/* Yokai Calico Patch */}
            <radialGradient id="peekPatch" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1c0901" />
            </radialGradient>
          </defs>

          {/* Left Ear (Amber Fur with Pink Inside) */}
          <g className={isHovered ? '-rotate-6 transition-transform' : ''}>
            <polygon
              points="14,32 23,8 37,25"
              fill="#d97706"
              stroke="#b45309"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon points="18,28 23,13 33,25" fill="#fca5a5" />
          </g>

          {/* Right Ear (Yokai Calico with Pink Inside) */}
          <g className={isHovered ? 'rotate-6 transition-transform' : ''}>
            <polygon
              points="43,25 57,8 66,32"
              fill="#291206"
              stroke="#1c0901"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <polygon points="47,25 57,13 62,28" fill="#fca5a5" />
          </g>

          {/* Chubby Round Head */}
          <ellipse
            cx="40"
            cy="36"
            rx="29"
            ry="23"
            fill="url(#peekFur)"
            stroke="#b45309"
            strokeWidth="1.5"
          />

          {/* Calico Patch on right side */}
          <path
            d="M48 16 C62 18 69 26 69 36 C63 43 55 42 49 37 C45 33 45 23 48 16 Z"
            fill="url(#peekPatch)"
            opacity="0.95"
          />

          {/* Rosy Blushing Cheeks */}
          <circle cx="21" cy="37" r="5" fill="#f43f5e" opacity="0.6" />
          <circle cx="59" cy="37" r="5" fill="#f43f5e" opacity="0.6" />

          {/* Whiskers */}
          <line
            x1="18"
            y1="36"
            x2="5"
            y2="34"
            stroke="#b45309"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="39"
            x2="7"
            y2="41"
            stroke="#b45309"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="62"
            y1="36"
            x2="75"
            y2="34"
            stroke="#b45309"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <line
            x1="62"
            y1="39"
            x2="73"
            y2="41"
            stroke="#b45309"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Eyes (Tracking mouse or Blinking) */}
          {isBlinking ? (
            <>
              {/* Happy Blinking curved lines */}
              <path
                d="M24 31 Q28 35 32 31"
                stroke="#78350f"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M48 31 Q52 35 56 31"
                stroke="#78350f"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              {/* Left Eye */}
              <ellipse
                cx="28"
                cy="31"
                rx="5"
                ry="6"
                fill="#fbbf24"
                stroke="#78350f"
                strokeWidth="1"
              />
              <ellipse
                cx={28 + eyeOffset.x}
                cy={31 + eyeOffset.y}
                rx="2.6"
                ry="3.6"
                fill="#0f172a"
              />
              <circle
                cx={27 + eyeOffset.x * 0.5}
                cy={29.5 + eyeOffset.y * 0.5}
                r="1.4"
                fill="#ffffff"
              />

              {/* Right Eye */}
              <ellipse
                cx="52"
                cy="31"
                rx="5"
                ry="6"
                fill="#fbbf24"
                stroke="#78350f"
                strokeWidth="1"
              />
              <ellipse
                cx={52 + eyeOffset.x}
                cy={31 + eyeOffset.y}
                rx="2.6"
                ry="3.6"
                fill="#0f172a"
              />
              <circle
                cx={51 + eyeOffset.x * 0.5}
                cy={29.5 + eyeOffset.y * 0.5}
                r="1.4"
                fill="#ffffff"
              />
            </>
          )}

          {/* Snout & Nose */}
          <polygon points="38.5,35.5 41.5,35.5 40,38" fill="#f472b6" />
          <path
            d="M37 38.5 C38.5 40 40 39.5 40 38 C40 39.5 41.5 40 43 38.5"
            stroke="#78350f"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Layer 1: The Shape / Pill Badge ("About Me") */}
      <div
        className={`relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 select-none cursor-default ${variantStyles[variant]}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse" />
        <span className="text-xs uppercase tracking-wider">{text}</span>
        <span className="text-[11px] text-purple-600 font-bold">✦</span>
      </div>

      {/* Layer 2: Little Paws resting right on the top rim of the shape */}
      <div
        className={`absolute top-[26px] left-1/2 -translate-x-1/2 w-14 h-3 pointer-events-none transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) z-20 ${
          isPeeking
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-75'
        }`}
      >
        <svg
          viewBox="0 0 56 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-sm"
        >
          {/* Left Paw */}
          <path
            d="M4 12 C4 5 9 2 13 2 C17 2 20 5 20 12 Z"
            fill="#fef3c7"
            stroke="#b45309"
            strokeWidth="1.2"
          />
          <line
            x1="9"
            y1="5"
            x2="9"
            y2="11"
            stroke="#b45309"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <line
            x1="14"
            y1="5"
            x2="14"
            y2="11"
            stroke="#b45309"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Right Paw */}
          <path
            d="M36 12 C36 5 41 2 45 2 C49 2 52 5 52 12 Z"
            fill="#fef3c7"
            stroke="#b45309"
            strokeWidth="1.2"
          />
          <line
            x1="41"
            y1="5"
            x2="41"
            y2="11"
            stroke="#b45309"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <line
            x1="46"
            y1="5"
            x2="46"
            y2="11"
            stroke="#b45309"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
