'use client';

import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function LoadOrchestrator() {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('hasLoaded')) {
      setShouldAnimate(true);
      sessionStorage.setItem('hasLoaded', 'true');
    }
  }, []);

  useGSAP(() => {
    if (!shouldAnimate) return;

    // Hide elements initially
    gsap.set('.hero-text-content', { opacity: 0, y: 50 });
    gsap.set('.navbar', { opacity: 0, y: -20 });
    gsap.set('.hero-cta', { opacity: 0, scale: 0.9 });
    
    const tl = gsap.timeline();

    // Black overlay fades (200ms)
    tl.to('.load-overlay', { opacity: 0, duration: 0.2, ease: 'power2.inOut' }, 0);
    tl.set('.load-overlay', { display: 'none' });

    // Text morphs (600ms)
    tl.to('.hero-text-content', { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' }, 0.6);

    // Nav fades (1000ms)
    tl.to('.navbar', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.0);

    // CTA fades (1400ms)
    tl.to('.hero-cta', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, 1.4);

  }, [shouldAnimate]);

  if (!shouldAnimate) return null;

  return (
    <div className="load-overlay fixed inset-0 bg-black z-[9999] pointer-events-none" />
  );
}
