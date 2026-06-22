'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PageLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem('portfolio_loaded');
    if (!hasLoaded) {
      setShow(true);
      document.body.style.overflow = 'hidden';
      sessionStorage.setItem('portfolio_loaded', '1');

      const timer = setTimeout(() => {
        setShow(false);
        document.body.style.overflow = '';
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] flex items-center justify-center"
          style={{ backgroundColor: 'var(--bg-base)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Stylized "A" monogram */}
              <motion.path
                d="M40 12 L16 62 L28 62 L34 48 L46 48 L52 62 L64 62 L40 12Z M37 38 L40 28 L43 38Z"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.0, ease: 'easeInOut', delay: 0.2 }}
              />
              {/* Small decorative dot */}
              <motion.circle
                cx="40"
                cy="72"
                r="3"
                fill="var(--accent)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
