'use client';

import React, { useRef, useEffect, useState } from 'react';

interface ContactSectionProps {
  email: string;
  linkedinUrl: string;
  copyrightName: string;
}

export function ContactSection({ email, linkedinUrl, copyrightName }: ContactSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputText, setInputText] = useState('');
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      // Handle resizing
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = 200;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      const targetAmp = isReducedMotion ? 0 : 10 + Math.min(inputText.length * 2.5, 70);
      const targetFreq = isReducedMotion ? 0 : 0.01 + Math.min(inputText.length * 0.0015, 0.06);

      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      for (let x = 0; x < width; x++) {
        const y = (height / 2) + targetAmp * Math.sin(targetFreq * x + time);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#06b6d4'; // Cyan primary accent
      ctx.lineWidth = 2;
      ctx.stroke();

      // Subtle glow
      if (!isReducedMotion) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#06b6d4';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      time += isReducedMotion ? 0 : 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [inputText, isReducedMotion]);

  return (
    <footer id="contact" className="relative py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-900 overflow-hidden transition-colors duration-300">
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-zinc-900 dark:text-white mb-6 text-center font-sans">
          Initialize Connection
        </h2>
        
        <p className="text-zinc-600 dark:text-zinc-400 text-center mb-12 max-w-lg font-mono text-sm">
          Signal your intent. The waveform reacts to your transmission length.
        </p>

        <div className="w-full max-w-xl relative group">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your frequency..."
            className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors placeholder-zinc-400 dark:placeholder-zinc-600 font-mono text-center relative z-10"
          />
        </div>

        {/* Oscilloscope Canvas */}
        <div className="w-full h-[200px] mt-4 opacity-80 pointer-events-none relative -z-0">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-6">
          <a
            href={`mailto:${email}?subject=Incoming Transmission&body=${encodeURIComponent(inputText)}`}
            className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold tracking-wider rounded hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white transition-colors uppercase"
          >
            Transmit
          </a>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-cyan-500 transition-colors font-mono uppercase text-xs tracking-widest"
            >
              LinkedIn
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-cyan-500 transition-colors font-mono uppercase text-xs tracking-widest"
            >
              Resume
            </a>
          </div>
        </div>

        <div className="mt-24 text-[10px] font-mono text-zinc-400 dark:text-zinc-600 tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} {copyrightName} :: System Online
        </div>
      </div>
    </footer>
  );
}
