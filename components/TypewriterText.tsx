'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

interface TypewriterTextProps {
  texts: string[];
  speed?: number;        // ms per character
  pauseDuration?: number; // ms to pause after full text
  className?: string;
}

export function TypewriterText({
  texts,
  speed = 60,
  pauseDuration = 2200,
  className = '',
}: TypewriterTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayText(texts[0]);
      return;
    }

    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    const currentText = texts[textIndex];

    if (!isDeleting && charIndex <= currentText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex));
        setCharIndex((c) => c + 1);
        if (charIndex === currentText.length) setIsPaused(true);
      }, speed);
      return () => clearTimeout(timer);
    }

    if (isDeleting && charIndex >= 0) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, charIndex));
        setCharIndex((c) => c - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      }, speed * 0.5);
      return () => clearTimeout(timer);
    }
  }, [charIndex, isDeleting, isPaused, textIndex, texts, speed, pauseDuration, prefersReducedMotion]);

  return (
    <span className={className}>
      {displayText}
      <span
        aria-hidden="true"
        className="inline-block w-[2px] h-[1em] ml-[2px] align-middle animate-cursor-blink"
        style={{ backgroundColor: 'var(--accent)' }}
      />
    </span>
  );
}
