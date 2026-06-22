'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate random particle positions once
  const positions = useMemo(() => {
    const count = 180;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 16; // x
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;  // z
    }
    return arr;
  }, []);

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle drift rotation (transform only — GPU-friendly)
    pointsRef.current.rotation.y = t * 0.04;
    pointsRef.current.rotation.x = Math.sin(t * 0.02) * 0.1;
    // Subtle mouse influence
    pointsRef.current.position.x = THREE.MathUtils.lerp(
      pointsRef.current.position.x,
      pointer.x * 0.3,
      0.03
    );
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      pointer.y * 0.2,
      0.03
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#6C63FF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function ParticleCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power' }}
    >
      <ParticleField />
    </Canvas>
  );
}
