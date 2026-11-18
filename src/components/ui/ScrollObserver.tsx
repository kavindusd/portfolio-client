'use client';

import { useEffect } from 'react';

export const ScrollObserver: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Fallback if browser does not support IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.scroll-reveal, .reveal-card').forEach((el) => {
        el.classList.add('revealed', 'is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed', 'is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const scanAndObserve = () => {
      const items = document.querySelectorAll(
        '.scroll-reveal:not(.revealed), .reveal-card:not(.revealed)'
      );
      items.forEach((item) => observer.observe(item));
    };

    // Initial scan
    scanAndObserve();

    // Re-scans to capture dynamically rendered items from Supabase
    const t1 = setTimeout(scanAndObserve, 250);
    const t2 = setTimeout(scanAndObserve, 750);
    const t3 = setTimeout(scanAndObserve, 1500);

    // Watch for DOM mutations when asynchronous data renders
    const mutationObs = new MutationObserver(() => {
      scanAndObserve();
    });

    mutationObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      observer.disconnect();
      mutationObs.disconnect();
    };
  }, []);

  return null;
};
