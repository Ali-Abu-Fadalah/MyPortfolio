'use client';

import { useState, useEffect } from 'react';

interface MobileDetect {
  isMobile: boolean;   // < 768px
  isTablet: boolean;   // 768px – 1023px
  mounted: boolean;    // false on SSR, true once hydrated
}

export function useMobileDetect(): MobileDetect {
  const [state, setState] = useState<MobileDetect>({
    isMobile: false,
    isTablet: false,
    mounted: false,
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setState({
        isMobile: w < 768,
        isTablet: w >= 768 && w < 1024,
        mounted: true,
      });
    };

    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return state;
}
