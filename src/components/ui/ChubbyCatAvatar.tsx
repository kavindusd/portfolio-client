'use client';

import React, { useState, useEffect, useRef } from 'react';

export const ChubbyCatAvatar: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPetted, setIsPetted] = useState(false);

  // Mouse tracking for pupils
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      const maxOffset = 4;
      const angle = Math.atan2(deltaY, deltaX);
      const intensity = Math.min(distance / 250, 1) * maxOffset;

      setEyeOffset({
        x: Math.cos(angle) * intensity,
        y: Math.sin(angle) * intensity,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Natural blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = () => {
    setIsPetted(true);
    setTimeout(() => setIsPetted(false), 700);
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      title="Click to pet the chubby Scampuss! 🐾"
      className={`relative w-full h-full cursor-pointer select-none flex items-center justify-center transition-transform duration-300 ${
        isPetted ? 'scale-110 -translate-y-2' : 'hover:scale-105'
      }`}
    >
      <svg
        viewBox="0 0 160 160"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fur Gradient - Warm cream Scampuss fur */}
          <radialGradient
            id="catFur"
            cx="45%"
            cy="40%"
            r="60%"
            fx="40%"
            fy="35%"
          >
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="65%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>

          {/* Calico / Scampuss dark patch */}
          <radialGradient
            id="catPatch"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c0901" />
          </radialGradient>

          {/* Belly highlight */}
          <radialGradient
            id="catBelly"
            cx="50%"
            cy="60%"
            r="45%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#fef3c7" />
          </radialGradient>

          {/* Blush glow */}
          <radialGradient id="blush">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient bottom shadow */}
        <ellipse cx="80" cy="142" rx="42" ry="9" fill="#090514" opacity="0.6" />

        {/* Tail (swaying) */}
        <g className="animate-[tailWag_2.6s_ease-in-out_infinite] origin-[125px_110px]">
          <path
            d="M125 110C138 115 148 106 146 92C144 80 135 84 130 90"
            stroke="#d97706"
            strokeWidth="11"
            strokeLinecap="round"
          />
          <path
            d="M125 110C138 115 148 106 146 92C144 80 135 84 130 90"
            stroke="#b45309"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </g>

        {/* Ears */}
        {/* Left Ear */}
        <g className="origin-[48px_48px] animate-[earTwitchLeft_4.5s_ease-in-out_infinite]">
          {/* Outer ear */}
          <polygon
            points="34,54 48,22 66,46"
            fill="#d97706"
            stroke="#b45309"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner pink ear */}
          <polygon points="38,50 48,28 60,45" fill="#fca5a5" />
        </g>

        {/* Right Ear (with dark Scampuss patch) */}
        <g className="origin-[112px_48px] animate-[earTwitchRight_4.5s_ease-in-out_infinite]">
          {/* Outer ear */}
          <polygon
            points="94,46 112,22 126,54"
            fill="#291206"
            stroke="#1c0901"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Inner pink ear */}
          <polygon points="100,45 112,28 122,50" fill="#fca5a5" />
        </g>

        {/* Chubby Round Ball Body (Nioh 2 Scampuss style) */}
        <ellipse
          cx="80"
          cy="88"
          rx="52"
          ry="48"
          fill="url(#catFur)"
          stroke="#b45309"
          strokeWidth="2.5"
        />

        {/* Dark Patch on right side of head (Yokai calico spot) */}
        <path
          d="M96 46C112 50 126 62 130 78C126 92 114 96 102 90C92 85 90 70 96 46Z"
          fill="url(#catPatch)"
          opacity="0.9"
        />

        {/* Chubby White Belly */}
        <ellipse cx="80" cy="102" rx="34" ry="28" fill="url(#catBelly)" />

        {/* Blushing cheeks */}
        <circle cx="50" cy="94" r="9" fill="url(#blush)" />
        <circle cx="110" cy="94" r="9" fill="url(#blush)" />

        {/* EYES */}
        {isBlinking ? (
          // Blinking eyes: cute curved happy lines
          <g stroke="#1c0901" strokeWidth="3" strokeLinecap="round">
            <path d="M52 82C56 86 64 86 68 82" />
            <path d="M92 82C96 86 104 86 108 82" />
          </g>
        ) : (
          // Open big anime cute eyes with pupil tracking
          <g>
            {/* Left Eye */}
            <circle cx="60" cy="80" r="9.5" fill="#1c0901" />
            {/* Pupil & reflections */}
            <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
              <circle cx="60" cy="80" r="8" fill="#0f0502" />
              {/* Big primary sparkle */}
              <circle cx="58" cy="77" r="3.2" fill="#ffffff" />
              {/* Secondary tiny sparkle */}
              <circle cx="63" cy="83" r="1.4" fill="#ffffff" />
            </g>

            {/* Right Eye */}
            <circle cx="100" cy="80" r="9.5" fill="#1c0901" />
            {/* Pupil & reflections */}
            <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
              <circle cx="100" cy="80" r="8" fill="#0f0502" />
              {/* Big primary sparkle */}
              <circle cx="98" cy="77" r="3.2" fill="#ffffff" />
              {/* Secondary tiny sparkle */}
              <circle cx="103" cy="83" r="1.4" fill="#ffffff" />
            </g>
          </g>
        )}

        {/* Nose & Mouth (Cat :3 face) */}
        {/* Tiny pink nose */}
        <polygon points="78,89 82,89 80,92" fill="#f43f5e" />
        {/* Cute :3 kitty mouth */}
        <path
          d="M74 95C76 98 79 98 80 94C81 98 84 98 86 95"
          stroke="#451a03"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <g stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
          <line x1="32" y1="88" x2="44" y2="90" />
          <line x1="33" y1="94" x2="45" y2="93" />
          <line x1="116" y1="90" x2="128" y2="88" />
          <line x1="115" y1="93" x2="127" y2="94" />
        </g>

        {/* Tiny Chubby Front Paws */}
        <g>
          {/* Left paw */}
          <ellipse cx="64" cy="116" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
          {/* Right paw */}
          <ellipse cx="96" cy="116" rx="8" ry="6" fill="#ffffff" stroke="#d97706" strokeWidth="1.5" />
        </g>

        {/* Tiny Scampuss forehead mark (red yokai dot) */}
        <circle cx="80" cy="58" r="2.8" fill="#dc2626" />
      </svg>

      {/* Floating love heart when clicked/petted */}
      {isPetted && (
        <span className="absolute -top-3 right-2 text-rose-400 text-lg animate-bounce pointer-events-none select-none">
          ❤️
        </span>
      )}
    </div>
  );
};
