'use client';

import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCatLogoProps {
  isHovered?: boolean;
  showContainer?: boolean;
  className?: string;
}

export const AnimatedCatLogo: React.FC<AnimatedCatLogoProps> = ({
  isHovered = false,
  showContainer = true,
  className = '',
}) => {
  const rawId = React.useId();
  const furGradientId = `catLogoFur-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const logoRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for pupils
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const angle = Math.atan2(deltaY, deltaX);
      const dist = Math.min(Math.hypot(deltaX, deltaY) / 180, 1) * 1.6;
      setEyeOffset({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Periodic blinking
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={logoRef}
      className={`relative shrink-0 aspect-square flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
        showContainer
          ? 'w-8 h-8 rounded-full overflow-hidden bg-purple-100/90 dark:bg-gradient-to-tr dark:from-purple-900/60 dark:to-indigo-900/60 border border-purple-200/80 dark:border-purple-500/30 shadow-xs dark:shadow-inner'
          : 'w-10 h-10 overflow-visible bg-transparent border-0'
      } ${className}`}
    >
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id={furGradientId} cx="45%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="65%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
        </defs>

        {/* Left Ear */}
        <g className={isHovered ? '-rotate-12 origin-[12px_14px] transition-transform' : ''}>
          <polygon
            points="7,18 13,3 20,15"
            fill="#d97706"
            stroke="#b45309"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <polygon points="10,16 13,7 17,14" fill="#fca5a5" />
        </g>

        {/* Right Ear (Yokai calico) */}
        <g className={isHovered ? 'rotate-12 origin-[28px_14px] transition-transform' : ''}>
          <polygon
            points="20,15 27,3 33,18"
            fill="#291206"
            stroke="#1c0901"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <polygon points="23,14 27,7 30,16" fill="#fca5a5" />
        </g>

        {/* Chubby Round Head - Solid Opaque Base (prevents background bleed) */}
        <ellipse
          cx="20"
          cy="23"
          rx="15"
          ry="13"
          fill="#fde68a"
        />

        {/* Chubby Round Head - Gradient & Border */}
        <ellipse
          cx="20"
          cy="23"
          rx="15"
          ry="13"
          fill={`url(#${furGradientId})`}
          stroke="#b45309"
          strokeWidth="1.2"
        />

        {/* Calico Patch on right side */}
        <path
          d="M24 12 C30 13 34 18 34 24 C30 28 26 27 24 23 C22 20 22 15 24 12 Z"
          fill="#291206"
          opacity="0.95"
        />

        {/* Rosy Cheeks */}
        <circle cx="11" cy="24" r="2.5" fill="#f43f5e" opacity="0.6" />
        <circle cx="29" cy="24" r="2.5" fill="#f43f5e" opacity="0.6" />

        {/* Whiskers */}
        <line x1="9" y1="23.5" x2="3" y2="22.5" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="9" y1="25.5" x2="4" y2="26.5" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="31" y1="23.5" x2="37" y2="22.5" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="31" y1="25.5" x2="36" y2="26.5" stroke="#b45309" strokeWidth="0.8" strokeLinecap="round" />

        {/* Eyes (Blinking or Mouse Tracking) */}
        {isBlinking ? (
          <>
            <path
              d="M11 20 Q14 23 17 20"
              stroke="#78350f"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M23 20 Q26 23 29 20"
              stroke="#78350f"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Left Eye */}
            <ellipse cx="14" cy="20" rx="3.2" ry="3.8" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx={14 + eyeOffset.x} cy={20 + eyeOffset.y} rx="1.8" ry="2.4" fill="#0f172a" />
            <circle cx={13.2 + eyeOffset.x * 0.5} cy={19 + eyeOffset.y * 0.5} r="0.9" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse cx="26" cy="20" rx="3.2" ry="3.8" fill="#fbbf24" stroke="#78350f" strokeWidth="0.8" />
            <ellipse cx={26 + eyeOffset.x} cy={20 + eyeOffset.y} rx="1.8" ry="2.4" fill="#0f172a" />
            <circle cx={25.2 + eyeOffset.x * 0.5} cy={19 + eyeOffset.y * 0.5} r="0.9" fill="#ffffff" />
          </>
        )}

        {/* Nose & Feline Mouth */}
        <polygon points="19,23.5 21,23.5 20,25" fill="#f472b6" />
        <path
          d="M18 25.5 C19 26.5 20 26 20 25 C20 26 21 26.5 22 25.5"
          stroke="#78350f"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};
