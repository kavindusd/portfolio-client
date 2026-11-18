'use client';

import React from 'react';

interface TechLogo {
  title: string;
  icon: React.ReactNode;
}

const techLogos: TechLogo[] = [
  // Next.js
  {
    title: 'Next.js',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 180 180" fill="none">
        <mask height="180" id="nextMask" maskUnits="userSpaceOnUse" width="180" x="0" y="0">
          <circle cx="90" cy="90" fill="white" r="90" />
        </mask>
        <g mask="url(#nextMask)">
          <circle cx="90" cy="90" fill="#000000" stroke="#333333" strokeWidth="6" r="87" />
          <path
            d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
            fill="url(#nextGrad1)"
          />
          <rect fill="url(#nextGrad2)" height="72" width="12" x="115" y="54" />
        </g>
        <defs>
          <linearGradient id="nextGrad1" x1="109" x2="144.5" y1="116.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nextGrad2" x1="121" x2="120.799" y1="54" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },

  // PHP
  {
    title: 'PHP',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 128 128">
        <ellipse cx="64" cy="64" rx="60" ry="34" fill="#777BB4" />
        <ellipse cx="64" cy="64" rx="56" ry="30" fill="#4F5B93" />
        <path
          fill="#FFFFFF"
          d="M33.6 54.4c0-2.3 1.8-4.1 4.1-4.1h9.8c5.4 0 9.2 3.6 9.2 8.7 0 5.8-4.6 9.8-10.9 9.8h-4.9l-2.4 9.5H31l2.6-23.9zm8.5 4h-2.1l-1.3 5.4h2.1c2.8 0 4.6-1.5 4.6-3.8 0-1.2-.9-1.6-3.3-1.6zm22.4-4c0-2.3 1.8-4.1 4.1-4.1h7.5l-2.4 9.5h-5.2l-1 4h4.7l-2.4 9.5h-4.7l-2.7 10.9H57l7.5-29.8zm24.7 0c0-2.3 1.8-4.1 4.1-4.1h9.8c5.4 0 9.2 3.6 9.2 8.7 0 5.8-4.6 9.8-10.9 9.8h-4.9l-2.4 9.5H81.7l2.5-23.9zm8.5 4h-2.1l-1.3 5.4h2.1c2.8 0 4.6-1.5 4.6-3.8 0-1.2-.9-1.6-3.3-1.6z"
        />
      </svg>
    ),
  },

  // MySQL
  {
    title: 'MySQL',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="28" fill="#00618A" />
        <path
          fill="#F29111"
          d="M93.3 48.7c-4.2-7.1-12.7-9.5-20.7-9.5-12.2 0-21.7 6.4-25.1 16.4-2.1 6.2-1.3 12.8 2.2 18.2 4.1 6.4 11.2 9.8 19.3 9.8 8.7 0 16.1-4.2 20.3-11.2l-9.1-5.3c-2.3 3.9-6.3 6.1-11.2 6.1-5.7 0-9.8-2.9-11.4-7.8h33.8c.8-2.2 1.9-9.9 1.9-16.7zm-29.5 8.3c1.4-4.5 5.5-7.3 10.3-7.3 5.1 0 8.7 2.9 9.8 7.3H63.8z"
        />
        <circle cx="44" cy="52" r="5" fill="#FFFFFF" />
      </svg>
    ),
  },

  // Node.js
  {
    title: 'Node.js',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 256 256">
        <path
          fill="#339933"
          d="M128 0L242.3 66v132L128 264 13.7 198V66L128 0zm-10.2 40.5L34.1 88.7v78.6l83.7 48.3v-44.5l-45.2-26v-34.6l76.7 44.3 1.5-.9V40.5h-33zm20.4 0v113.4l76.7-44.3v34.6l-45.2 26v44.5l83.7-48.3V88.7L138.2 40.5z"
        />
      </svg>
    ),
  },

  // Figma
  {
    title: 'Figma',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
      </svg>
    ),
  },

  // React
  {
    title: 'React',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="-11.5 -10.23174 23 20.46348">
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },

  // TypeScript
  {
    title: 'TypeScript',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="24" fill="#3178C6" />
        <path
          fill="#FFFFFF"
          d="M103.3 84.1c-1.8-1.3-4.5-2.4-7.8-3.2l-4.5-1.1c-2.9-.7-4.8-1.7-5.9-2.7-1.1-1.1-1.7-2.6-1.7-4.4 0-2.1.8-3.7 2.5-5 1.7-1.3 4.2-1.9 7.4-1.9 3 0 5.6.6 7.9 1.8 2.3 1.2 4.1 2.8 5.4 4.8l8.6-6.9c-2.3-3.2-5.5-5.6-9.5-7.2-4-1.6-8.7-2.4-14.2-2.4-7.4 0-13.3 2-17.7 5.9-4.4 3.9-6.6 9.4-6.6 16.4 0 5.4 1.4 9.8 4.3 13.1 2.9 3.3 7.2 5.9 12.9 7.6l5.7 1.7c3.4 1 5.9 2.1 7.4 3.4 1.5 1.3 2.3 2.9 2.3 5 0 2.4-1 4.3-3 5.6-2 1.3-5 2-9 2-4.6 0-8.5-1.1-11.8-3.3-3.3-2.2-5.7-5.3-7.1-9.4l-9.7 6.4c2.4 5.3 6.3 9.4 11.7 12.3 5.4 2.9 11.9 4.3 19.3 4.3 8.3 0 15-2 19.9-6.1 4.9-4.1 7.4-9.8 7.4-17 0-5.8-1.7-10.4-5.1-13.7zM49.2 44H20v14.4h14.7v55.2h16.8V58.4h14.7V44H49.2z"
        />
      </svg>
    ),
  },

  // Tailwind CSS
  {
    title: 'Tailwind CSS',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 54 33">
        <path
          fill="#38BDF8"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
        />
      </svg>
    ),
  },

  // MongoDB
  {
    title: 'MongoDB',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24">
        <path
          fill="#47A248"
          d="M17.193 9.555c-1.264-5.32-4.237-7.391-4.708-7.555-.238.163-1.045.69-1.921 2.052C8.83 6.67 7 10.871 7 13.43c0 4.148 2.392 7.02 5.485 8.57 0 0-.256-1.579-.047-2.738.152-.843.585-2.005 1.059-3.268.468-1.246.994-2.585 1.229-3.921.146-.83.33-1.692.467-2.518z"
        />
        <path
          fill="#499D4A"
          d="M12.485 22c3.093-1.55 5.485-4.422 5.485-8.57 0-2.559-1.83-6.76-3.464-9.351-.876-1.362-1.683-1.889-1.921-2.052.471.164 3.444 2.235 4.708 7.555.234 1.336.42 2.675.467 3.921.047 1.263-.105 2.425-.257 3.268-.209 1.159-.047 2.738-.047 2.738l-4.971 2.491z"
        />
        <path
          fill="#E6E7E8"
          d="M12.485 22v-3.791c-.474 1.263-.907 2.425-1.059 3.268-.209 1.159.047 2.738.047 2.738l1.012-2.215z"
        />
      </svg>
    ),
  },

  // PostgreSQL
  {
    title: 'PostgreSQL',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="24" fill="#336791" />
        <path
          fill="#FFFFFF"
          d="M64 26C43 26 26 43 26 64s17 38 38 38 38-17 38-38-17-38-38-38zm4.5 59.8V74.1h-9v11.7c-17.8-2.2-31.5-17.3-31.5-35.8 0-2.8.4-5.4.9-8.1L45.8 74v4.5c0 5 4 9 9 9v-.3c1.5.2 3 .3 4.5.3s3-.1 4.5-.3v.3c5 0 9-4 9-9V74l21.6-26.1c.6 2.6.9 5.3.9 8.1 0 18.5-13.7 33.6-31.8 35.8z"
        />
      </svg>
    ),
  },

  // JavaScript
  {
    title: 'JavaScript',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 128 128">
        <rect width="128" height="128" rx="24" fill="#F7DF1E" />
        <path
          fill="#000000"
          d="M32.8 107.2l12.7-7.7c2.6 4.6 5.5 8.4 11.2 8.4 5.7 0 9.3-2.3 9.3-11.2V48.1h16v48.8c0 17.5-10.2 25.3-24.9 25.3-13.2 0-20.9-6.7-24.3-15zm48.8-1.5l12.7-7.4c3.5 5.6 8.2 9.8 15.6 9.8 6.5 0 10.7-3.3 10.7-7.8 0-5.5-4.4-7.5-12.2-10.9-11.1-4.8-18.5-10.6-18.5-22.7 0-11.3 8.7-20 22.3-20 9.7 0 16.7 3.5 21.3 11.7l-12.1 7.8c-2.6-4.6-5.5-6.5-9.3-6.5-4.2 0-7.2 2.6-7.2 6.2 0 4.3 2.8 6.2 10.1 9.3 12.9 5.5 20.7 11.1 20.7 23.9 0 13.7-10.7 21.6-25.7 21.6-14.4 0-23.7-6.9-28.7-15z"
        />
      </svg>
    ),
  },

  // Git
  {
    title: 'Git',
    icon: (
      <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 128 128">
        <path
          fill="#F05032"
          d="M125.7 57.7L70.3 2.3c-3-3-7.9-3-11 0L47.5 14.1l14 14c3.2-1.1 6.9-.3 9.4 2.2 2.5 2.5 3.3 6.2 2.2 9.4l13.5 13.5c3.2-1.1 6.9-.3 9.4 2.2 3.6 3.6 3.6 9.4 0 13s-9.4 3.6-13 0c-2.6-2.6-3.4-6.5-2.1-9.8L68.5 46.2v35.3c1 .5 1.9 1.2 2.6 1.9 3.6 3.6 3.6 9.4 0 13s-9.4 3.6-13 0c-3.6-3.6-3.6-9.4 0-13 .9-.9 2-1.6 3.2-2.1V45.8c-1.2-.5-2.3-1.2-3.2-2.1-2.7-2.7-3.4-6.7-2-10L42.2 19.4 2.3 59.3c-3 3-3 7.9 0 11l55.4 55.4c3 3 7.9 3 11 0l57-57c3-3.1 3-8 0-11z"
        />
      </svg>
    ),
  },
];

export const TechMarquee: React.FC = () => {
  // Duplicate array 3 times for a completely seamless, gap-free infinite scroll
  const duplicatedLogos = [...techLogos, ...techLogos, ...techLogos];

  return (
    <div className="relative w-full overflow-hidden border-y border-stone-200/60 dark:border-white/5 bg-white/60 dark:bg-[#050508]/50 backdrop-blur-md py-3.5 sm:py-5 transition-colors duration-300">
      {/* Inline styles for continuous GPU-accelerated logo scroll */}
      <style>{`
        @keyframes techScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .tech-track {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
          animation: techScroll 24s linear infinite;
        }
        .tech-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Left and Right Edge Fade Gradients */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-28 bg-gradient-to-r from-[#f8f5ee] via-[#f8f5ee]/85 dark:from-[#050508] dark:via-[#050508]/85 to-transparent z-10 transition-colors duration-300" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-28 bg-gradient-to-l from-[#f8f5ee] via-[#f8f5ee]/85 dark:from-[#050508] dark:via-[#050508]/85 to-transparent z-10 transition-colors duration-300" />

      {/* Continuously Moving Logo Track */}
      <div className="tech-track gap-6 sm:gap-11 px-3 sm:px-4 relative z-10">
        {duplicatedLogos.map((tech, idx) => (
          <div
            key={`${tech.title}-${idx}`}
            title={tech.title}
            className="flex items-center justify-center p-1 rounded-xl transition-transform duration-300 hover:scale-125 cursor-pointer filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_0_14px_rgba(168,85,247,0.6)] shrink-0"
          >
            {tech.icon}
          </div>
        ))}
      </div>
    </div>
  );
};
