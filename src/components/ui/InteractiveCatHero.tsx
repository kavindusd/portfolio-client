'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icons } from './Icons';

type CatMood = 'idle' | 'petted' | 'eating' | 'playing' | 'sleeping';

export const InteractiveCatHero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<CatMood>('idle');
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [speech, setSpeech] = useState<string>("Hi! I'm Scampuss, Kavindu's pet companion! 🐾");
  const [loveCount, setLoveCount] = useState(0);

  // Mouse tracking for pupils when awake
  useEffect(() => {
    if (mood === 'sleeping') return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY);

      const maxOffset = 5;
      const angle = Math.atan2(deltaY, deltaX);
      const intensity = Math.min(distance / 280, 1) * maxOffset;

      setEyeOffset({
        x: Math.cos(angle) * intensity,
        y: Math.sin(angle) * intensity,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mood]);

  // Periodic blinking when awake and not playing
  useEffect(() => {
    if (mood === 'sleeping') return;
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 4000);
    return () => clearInterval(interval);
  }, [mood]);

  // Action: Pet
  const handlePet = () => {
    setMood('petted');
    setLoveCount((prev) => prev + 1);
    const quotes = [
      'Purrrr! I love chin scratches! ❤️',
      'Meow! Kavindu writes very clean code! ✨',
      'Purrr... Want to hire my human? Click Contact! 🐾',
      'Happy Scampuss noises! 💖',
    ];
    setSpeech(quotes[Math.floor(Math.random() * quotes.length)]);
    setTimeout(() => setMood('idle'), 1800);
  };

  // Action: Feed
  const handleFeed = () => {
    setMood('eating');
    setSpeech('Om nom nom! Delicious fish snack! 🐟');
    setTimeout(() => {
      setMood('idle');
      setSpeech('Burp! Full of energy to build websites! ⚡');
    }, 2400);
  };

  // Action: Play
  const handlePlay = () => {
    setMood('playing');
    setSpeech('Catching bugs like Kavindu catches code bugs! 🧶');
    setTimeout(() => {
      setMood('idle');
      setSpeech('Whew, that was fun! What project should we see? 🚀');
    }, 2800);
  };

  // Action: Nap / Sleep
  const handleToggleSleep = () => {
    if (mood === 'sleeping') {
      setMood('idle');
      setSpeech('Yaaaawn! Im awake and ready to code! ☀️');
    } else {
      setMood('sleeping');
      setSpeech('Zzz... dreaming of Next.js & Tailwind CSS... 🌙');
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center select-none"
    >
      {/* Speech Bubble */}
      <div className="relative mb-3 max-w-[280px] sm:max-w-[320px] px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-purple-500/30 shadow-2xl backdrop-blur-md transition-all">
        <p className="text-xs sm:text-sm font-medium text-zinc-200 text-center leading-relaxed">
          {speech}
        </p>
        {/* Downward triangle arrow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-zinc-900 border-r border-b border-purple-500/30 rotate-45" />
      </div>

      {/* Main Cat Pedestal / Habitat Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Ambient Pedestal Glow Rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/30 via-indigo-500/20 to-rose-500/20 blur-2xl animate-pulse -z-10" />
        <div className="absolute -bottom-2 w-48 h-8 rounded-[100%] bg-purple-950/60 blur-md -z-10" />

        {/* Floating Hearts when petted */}
        {mood === 'petted' && (
          <div className="absolute -top-4 inset-x-0 flex justify-center gap-3 pointer-events-none z-30">
            <span className="text-2xl animate-bounce">💖</span>
            <span className="text-xl animate-ping">❤️</span>
            <span className="text-2xl animate-bounce delay-150">✨</span>
          </div>
        )}

        {/* Floating Fish when eating */}
        {mood === 'eating' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-2xl animate-bounce z-30">
            🐟
          </div>
        )}

        {/* Floating Yarn when playing */}
        {mood === 'playing' && (
          <div className="absolute bottom-6 right-6 text-2xl animate-spin z-30">
            🧶
          </div>
        )}

        {/* Floating ZZZ when sleeping */}
        {mood === 'sleeping' && (
          <div className="absolute -top-3 right-8 flex flex-col items-center pointer-events-none z-30 text-purple-400 font-bold font-mono">
            <span className="text-xs animate-pulse">z</span>
            <span className="text-sm animate-pulse delay-100">Z</span>
            <span className="text-base animate-pulse delay-200">Z</span>
          </div>
        )}

        {/* Clickable Interactive Cat SVG */}
        <div
          onClick={handlePet}
          title="Click to pet Scampuss! 🐾"
          className={`relative w-52 h-52 sm:w-60 sm:h-60 cursor-pointer transition-all duration-300 ${
            mood === 'petted'
              ? 'scale-110 -translate-y-2'
              : mood === 'eating'
              ? 'scale-105'
              : mood === 'playing'
              ? 'rotate-3 scale-105'
              : mood === 'sleeping'
              ? 'translate-y-2 opacity-95'
              : 'hover:scale-105'
          }`}
        >
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full drop-shadow-2xl"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Fur Gradient - Warm cream Scampuss fur */}
              <radialGradient id="catFur" cx="45%" cy="38%" r="62%">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="65%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#d97706" />
              </radialGradient>

              {/* Yokai Calico Patch */}
              <radialGradient id="catPatch" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#451a03" />
                <stop offset="100%" stopColor="#1c0901" />
              </radialGradient>

              {/* Belly */}
              <radialGradient id="catBelly" cx="50%" cy="60%" r="45%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fef3c7" />
              </radialGradient>

              {/* Cheeks Blush */}
              <radialGradient id="blush">
                <stop
                  offset="0%"
                  stopColor="#f43f5e"
                  stopOpacity={mood === 'petted' ? '0.85' : '0.6'}
                />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Bottom Shadow */}
            <ellipse cx="80" cy="142" rx="42" ry="9" fill="#090514" opacity="0.6" />

            {/* Wagging Tail */}
            <g
              className={`${
                mood === 'playing'
                  ? 'animate-[tailWag_1.2s_ease-in-out_infinite]'
                  : mood === 'sleeping'
                  ? ''
                  : 'animate-[tailWag_2.6s_ease-in-out_infinite]'
              } origin-[125px_110px]`}
            >
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

            {/* Left Ear */}
            <g
              className={`${
                mood === 'sleeping'
                  ? 'rotate-6'
                  : 'animate-[earTwitchLeft_4.5s_ease-in-out_infinite]'
              } origin-[48px_48px]`}
            >
              <polygon
                points="34,54 48,22 66,46"
                fill="#d97706"
                stroke="#b45309"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <polygon points="38,50 48,28 60,45" fill="#fca5a5" />
            </g>

            {/* Right Ear */}
            <g
              className={`${
                mood === 'sleeping'
                  ? '-rotate-6'
                  : 'animate-[earTwitchRight_4.5s_ease-in-out_infinite]'
              } origin-[112px_48px]`}
            >
              <polygon
                points="94,46 112,22 126,54"
                fill="#291206"
                stroke="#1c0901"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <polygon points="100,45 112,28 122,50" fill="#fca5a5" />
            </g>

            {/* Chubby Round Ball Body */}
            <ellipse
              cx="80"
              cy="88"
              rx="52"
              ry="48"
              fill="url(#catFur)"
              stroke="#b45309"
              strokeWidth="2.5"
            />

            {/* Dark Patch on right side (Yokai calico spot) */}
            <path
              d="M96 46C112 50 126 62 130 78C126 92 114 96 102 90C92 85 90 70 96 46Z"
              fill="url(#catPatch)"
              opacity="0.9"
            />

            {/* Chubby White Belly */}
            <ellipse cx="80" cy="102" rx="34" ry="28" fill="url(#catBelly)" />

            {/* Rosy Blushing Cheeks */}
            <circle
              cx="50"
              cy="94"
              r={mood === 'petted' ? 12 : 9}
              fill="url(#blush)"
            />
            <circle
              cx="110"
              cy="94"
              r={mood === 'petted' ? 12 : 9}
              fill="url(#blush)"
            />

            {/* EYES */}
            {mood === 'sleeping' ? (
              // Sleeping closed eyes: gentle curved lines (- . -)
              <g stroke="#1c0901" strokeWidth="3" strokeLinecap="round">
                <line x1="50" y1="80" x2="68" y2="80" />
                <line x1="92" y1="80" x2="110" y2="80" />
              </g>
            ) : isBlinking || mood === 'petted' ? (
              // Happy squinting blinking eyes (^ . ^)
              <g stroke="#1c0901" strokeWidth="3.2" strokeLinecap="round">
                <path d="M52 82C56 77 64 77 68 82" />
                <path d="M92 82C96 77 104 77 108 82" />
              </g>
            ) : mood === 'eating' ? (
              // Wide star sparkle eyes while eating! (★ . ★)
              <g fill="#f59e0b">
                <circle cx="60" cy="80" r="9" fill="#1c0901" />
                <path
                  d="M60 74L61.5 78.5L66 80L61.5 81.5L60 86L58.5 81.5L54 80L58.5 78.5Z"
                  fill="#fef08a"
                />
                <circle cx="100" cy="80" r="9" fill="#1c0901" />
                <path
                  d="M100 74L101.5 78.5L106 80L101.5 81.5L100 86L98.5 81.5L94 80L98.5 78.5Z"
                  fill="#fef08a"
                />
              </g>
            ) : (
              // Open Anime Eyes with pupil tracking
              <g>
                {/* Left Eye */}
                <circle cx="60" cy="80" r="9.5" fill="#1c0901" />
                <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                  <circle cx="60" cy="80" r="8" fill="#0f0502" />
                  <circle cx="58" cy="77" r="3.2" fill="#ffffff" />
                  <circle cx="63" cy="83" r="1.4" fill="#ffffff" />
                </g>

                {/* Right Eye */}
                <circle cx="100" cy="80" r="9.5" fill="#1c0901" />
                <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                  <circle cx="100" cy="80" r="8" fill="#0f0502" />
                  <circle cx="98" cy="77" r="3.2" fill="#ffffff" />
                  <circle cx="103" cy="83" r="1.4" fill="#ffffff" />
                </g>
              </g>
            )}

            {/* Nose & Mouth */}
            <polygon points="78,89 82,89 80,92" fill="#f43f5e" />

            {/* Mouth */}
            {mood === 'eating' ? (
              <circle cx="80" cy="95" r="3" fill="#451a03" />
            ) : (
              <path
                d="M74 95C76 98 79 98 80 94C81 98 84 98 86 95"
                stroke="#451a03"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            )}

            {/* Whiskers */}
            <g stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
              <line x1="32" y1="88" x2="44" y2="90" />
              <line x1="33" y1="94" x2="45" y2="93" />
              <line x1="116" y1="90" x2="128" y2="88" />
              <line x1="115" y1="93" x2="127" y2="94" />
            </g>

            {/* Tiny Chubby Front Paws */}
            <g>
              <ellipse
                cx="64"
                cy={mood === 'playing' ? 110 : 116}
                rx="8"
                ry="6"
                fill="#ffffff"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <ellipse
                cx="96"
                cy={mood === 'playing' ? 112 : 116}
                rx="8"
                ry="6"
                fill="#ffffff"
                stroke="#d97706"
                strokeWidth="1.5"
              />
            </g>

            {/* Scampuss Forehead Yokai Mark */}
            <circle cx="80" cy="58" r="2.8" fill="#dc2626" />
          </svg>
        </div>
      </div>

      {/* Interactive Action Control Bar */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={handlePet}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-purple-950/40 text-purple-300 border border-purple-500/30 hover:border-purple-500/60 transition-all active:scale-95 shadow-md"
        >
          <span>🐾</span>
          <span>Pet</span>
        </button>

        <button
          onClick={handleFeed}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-amber-950/40 text-amber-300 border border-amber-500/30 hover:border-amber-500/60 transition-all active:scale-95 shadow-md"
        >
          <span>🐟</span>
          <span>Feed</span>
        </button>

        <button
          onClick={handlePlay}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60 transition-all active:scale-95 shadow-md"
        >
          <span>🧶</span>
          <span>Play</span>
        </button>

        <button
          onClick={handleToggleSleep}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 hover:border-zinc-500 transition-all active:scale-95 shadow-md"
        >
          <span>{mood === 'sleeping' ? '☀️' : '💤'}</span>
          <span>{mood === 'sleeping' ? 'Wake' : 'Nap'}</span>
        </button>
      </div>

      {/* Love Meter / Fun counter */}
      {loveCount > 0 && (
        <span className="mt-2 text-[11px] font-mono text-purple-400">
          Affection Level: {loveCount} ❤️
        </span>
      )}
    </div>
  );
};
