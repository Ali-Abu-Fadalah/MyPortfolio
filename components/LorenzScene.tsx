'use client';

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Lorenz Attractor CPU calculation
function getLorenzPoints(count: number) {
  const points = new Float32Array(count * 3);
  let x = 0.1, y = 0, z = 0;
  const sigma = 10, rho = 28, beta = 8/3, dt = 0.005;

  for (let i = 0; i < count; i++) {
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;

    x += dx;
    y += dy;
    z += dz;

    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
}

// Rössler Attractor CPU calculation
function getRosslerPoints(count: number) {
  const points = new Float32Array(count * 3);
  let x = 0.1, y = 0, z = 0;
  const a = 0.2, b = 0.2, c = 5.7, dt = 0.04;

  for (let i = 0; i < count; i++) {
    const dx = (-y - z) * dt;
    const dy = (x + a * y) * dt;
    const dz = (b + z * (x - c)) * dt;

    x += dx;
    y += dy;
    z += dz;

    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }
  return points;
}

const vertexShader = `
uniform vec3 uCursorPos;
uniform float uTime;
uniform bool uIsMobile;
uniform bool uIsReducedMotion;

varying float vDistance;

void main() {
  vec3 pos = position;
  
  vec4 instanceWorld = instanceMatrix * vec4(pos, 1.0);
  vDistance = 100.0;
  
  if (!uIsMobile && !uIsReducedMotion) {
    float dist = distance(instanceWorld.xyz, uCursorPos);
    vDistance = dist;
    if (dist < 1.5) {
      vec3 dir = normalize(instanceWorld.xyz - uCursorPos);
      float force = (1.5 - dist) / 1.5;
      force = smoothstep(0.0, 1.0, force);
      instanceWorld.xyz += dir * force * 0.6;
    }
  }

  if (!uIsReducedMotion) {
    instanceWorld.y += sin(uTime * 0.5 + instanceWorld.x) * 0.1;
    instanceWorld.x += cos(uTime * 0.3 + instanceWorld.y) * 0.05;
  }

  gl_Position = projectionMatrix * viewMatrix * instanceWorld;
}
`;

const fragmentShader = `
uniform bool uIsRossler;

varying float vDistance;

void main() {
  vec3 baseColor = uIsRossler ? vec3(0.9, 0.1, 0.1) : vec3(0.024, 0.714, 0.831);
  vec3 accentColor = uIsRossler ? vec3(0.6, 0.0, 0.0) : vec3(0.659, 0.333, 0.969);
  
  float intensity = 0.8;
  vec3 color = baseColor;
  
  if (vDistance < 1.5) {
    float mixFactor = 1.0 - (vDistance / 1.5);
    color = mix(baseColor, accentColor, mixFactor);
    intensity += mixFactor * 1.5;
  }
  
  gl_FragColor = vec4(color * intensity, 0.8);
}
`;

function Particles({ count, isMobile, isRossler, isReducedMotion }: { count: number, isMobile: boolean, isRossler: boolean, isReducedMotion: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  
  const points = useMemo(() => isRossler ? getRosslerPoints(count) : getLorenzPoints(count), [count, isRossler]);
  
  const uniforms = useMemo(() => ({
    uCursorPos: { value: new THREE.Vector3(0,0,100) },
    uTime: { value: 0 },
    uIsMobile: { value: isMobile },
    uIsRossler: { value: isRossler },
    uIsReducedMotion: { value: isReducedMotion }
  }), [isMobile, isRossler, isReducedMotion]);

  useEffect(() => {
    uniforms.uIsRossler.value = isRossler;
    uniforms.uIsReducedMotion.value = isReducedMotion;
  }, [isRossler, isReducedMotion, uniforms]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    
    const scale = isRossler ? 0.3 : 0.15;
    const offsetX = isRossler ? 0 : 0;
    const offsetY = isRossler ? -2 : -4; 
    const offsetZ = isRossler ? -10 : -5;
    
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        points[i * 3] * scale + offsetX,
        points[i * 3 + 1] * scale + offsetY,
        points[i * 3 + 2] * scale + offsetZ
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [points, count, isRossler]);

  const vec = new THREE.Vector3();
  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (!isReducedMotion) {
      uniforms.uTime.value = state.clock.elapsedTime;
      
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x += 0.0005;

      if (!isMobile) {
        vec.set(state.pointer.x, state.pointer.y, 0.5);
        vec.unproject(state.camera);
        vec.sub(state.camera.position).normalize();
        
        const distance = (0 - state.camera.position.z) / vec.z;
        const targetPos = state.camera.position.clone().add(vec.multiplyScalar(distance));
        
        uniforms.uCursorPos.value.lerp(targetPos, 0.1);
      }
    }
  });

  return (
    // @ts-ignore args types for InstancedMesh
    <instancedMesh ref={meshRef} args={[null, null, count]} frustumCulled={false}>
      <boxGeometry args={[0.04, 0.04, 0.04]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

export default function LorenzScene() {
  const [isMobile, setIsMobile] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isRossler, setIsRossler] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setMounted(true);
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionHandler);

    // Konami code listener
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setIsRossler(prev => !prev);
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    
    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);

  if (!mounted) return null;

  const particleCount = isMobile ? 8000 : 50000;

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
        <Particles count={particleCount} isMobile={isMobile} isRossler={isRossler} isReducedMotion={isReducedMotion} />
        {!isReducedMotion && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} intensity={0.8} mipmapBlur />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
