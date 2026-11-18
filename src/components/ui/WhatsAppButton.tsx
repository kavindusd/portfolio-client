'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { usePortfolio } from '../../context/PortfolioContext';
import { Icons } from './Icons';

export const WhatsAppButton: React.FC = () => {
  const { profile } = usePortfolio();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Do not render inside the Admin dashboard
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Fallback to phone or default if whatsapp is not explicitly filled yet
  const rawWhatsapp = profile.socials?.whatsapp?.trim() || profile.socials?.phone?.trim() || '+94 77 123 4567';

  // Build clean WhatsApp URL
  let whatsappUrl = '';
  if (rawWhatsapp.startsWith('http://') || rawWhatsapp.startsWith('https://')) {
    whatsappUrl = rawWhatsapp;
  } else {
    // Strip non-digits except leading plus
    const digitsOnly = rawWhatsapp.replace(/[^\d]/g, '');
    const prefillMessage = encodeURIComponent(
      `Hi ${profile.name || 'there'}, I came across your portfolio and would like to connect!`
    );
    whatsappUrl = `https://wa.me/${digitsOnly}?text=${prefillMessage}`;
  }

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center group pointer-events-auto">
      {/* Floating Hover Tooltip / Pill */}
      <div
        className={`hidden sm:flex items-center mr-2.5 px-3 py-1.5 rounded-full bg-zinc-900/95 dark:bg-white/95 text-white dark:text-zinc-900 text-xs font-semibold shadow-lg backdrop-blur-md transition-all duration-300 pointer-events-none ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span>Chat on WhatsApp</span>
      </div>

      {/* Main Floating WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.35)] hover:shadow-[0_10px_30px_rgba(37,211,102,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        <Icons.WhatsApp size={24} className="transition-transform group-hover:scale-110" />
      </a>
    </div>
  );
};
