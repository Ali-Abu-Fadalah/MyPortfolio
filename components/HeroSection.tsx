'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Float, Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import * as THREE from 'three';
import { Profile } from '@/lib/sanity';

interface AbstractShapeProps {
  theme: string;
  isMobile: boolean;
}

function AbstractShape({ theme, isMobile }: AbstractShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Auto rotate and track pointer using linear interpolation (lerp)
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Limit delta to prevent huge jumps when tab was inactive
      const clampedDelta = Math.min(delta, 0.1);

      // 1. Auto rotation based on time (frame rate independent)
      meshRef.current.rotation.y += clampedDelta * 0.2;
      meshRef.current.rotation.x += clampedDelta * 0.1;

      // 2. Smoothly interpolate position based on pointer x/y to follow cursor
      if (!isMobile) {
        const targetX = state.pointer.x * 2.0;
        const targetY = state.pointer.y * 1.5;

        meshRef.current.position.x = THREE.MathUtils.lerp(
          meshRef.current.position.x,
          targetX,
          0.1
        );
        meshRef.current.position.y = THREE.MathUtils.lerp(
          meshRef.current.position.y,
          targetY,
          0.1
        );
      }
    }
  });

  const isDark = theme === 'dark';
  // Cyan in dark mode, zinc dark gray in light mode
  const meshColor = isDark ? '#06b6d4' : '#52525b';
  const emissiveColor = isDark ? '#06b6d4' : '#71717a';
  const emissiveIntensity = isDark ? 0.6 : 0.25;

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <Icosahedron ref={meshRef} args={[1, 0]} scale={isMobile ? 1.2 : 2.5}>
        <meshStandardMaterial
          color={meshColor}
          wireframe
          transparent
          opacity={isDark ? 0.35 : 0.25}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
        />
      </Icosahedron>
    </Float>
  );
}

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const activeTheme = mounted ? (resolvedTheme || 'dark') : 'dark';

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden pt-16 transition-colors duration-300">

      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0 opacity-60 dark:opacity-50">
        {isMobile ? (
          // CSS fallback for mobile to save battery and performance
          <div className="w-full h-full flex items-center justify-center opacity-30">
            <div className={`w-64 h-64 border-[0.5px] rounded-full flex items-center justify-center
              ${activeTheme === 'dark' ? 'border-cyan-500/30' : 'border-zinc-500/30'}`}>
              <div className={`w-48 h-48 border-[0.5px] rounded-full flex items-center justify-center transform rotate-45
                ${activeTheme === 'dark' ? 'border-cyan-500/40' : 'border-zinc-500/40'}`}>
                <div className={`w-32 h-32 border-[1px] rounded-full transform -rotate-45
                  ${activeTheme === 'dark' ? 'border-cyan-500/50' : 'border-zinc-500/50'}`} />
              </div>
            </div>
          </div>
        ) : (
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            dpr={[1, 1.5]}
          >
            <ambientLight intensity={activeTheme === 'dark' ? 0.5 : 0.8} />
            <directionalLight position={[10, 10, 5]} intensity={activeTheme === 'dark' ? 1.0 : 1.2} />
            <AbstractShape theme={activeTheme} isMobile={isMobile} />
          </Canvas>
        )}
      </div>

      {/* Foreground Overlay for readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-zinc-50/40 via-zinc-50/80 to-zinc-50 dark:from-zinc-950/40 dark:via-zinc-950/80 dark:to-zinc-950 pointer-events-none transition-colors duration-300" />

      {/* Dynamic Text Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto space-y-6 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-200/80 border border-zinc-300/85 text-xs sm:text-sm font-medium text-zinc-800 dark:bg-zinc-900/80 dark:border-zinc-800 dark:text-zinc-300 backdrop-blur-md shadow-md transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse" />
          Available for work
        </motion.div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-7xl bg-clip-text bg-gradient-to-b from-zinc-900 to-zinc-600 text-transparent dark:from-white dark:to-zinc-400">
          {profile.name}
        </h1>

        <p className="text-lg sm:text-2xl text-blue-600 dark:text-blue-400 font-medium tracking-wide">
          {profile.specialty}
        </p>

        <p className="text-sm sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mt-4">
          {profile.bio}
        </p>

        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="#projects"
          className="mt-8 px-6 py-3 rounded-full bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-950 font-semibold shadow-lg hover:shadow-xl dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all pointer-events-auto"
        >
          View Projects
        </motion.a>
      </motion.div>
    </section>
  );
}
