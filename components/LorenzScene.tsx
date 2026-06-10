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

const vertexShader = `
uniform vec3 uCursorPos;
uniform float uTime;
uniform bool uIsMobile;

varying float vDistance;

void main() {
  vec3 pos = position;
  
  // Transform instance position
  vec4 instanceWorld = instanceMatrix * vec4(pos, 1.0);
  vDistance = 100.0; // Default far distance
  
  if (!uIsMobile) {
    // Repulsion logic
    float dist = distance(instanceWorld.xyz, uCursorPos);
    vDistance = dist;
    if (dist < 1.5) {
      vec3 dir = normalize(instanceWorld.xyz - uCursorPos);
      float force = (1.5 - dist) / 1.5;
      force = smoothstep(0.0, 1.0, force);
      instanceWorld.xyz += dir * force * 0.6;
    }
  }

  // Subtle ambient floating
  instanceWorld.y += sin(uTime * 0.5 + instanceWorld.x) * 0.1;
  instanceWorld.x += cos(uTime * 0.3 + instanceWorld.y) * 0.05;

  gl_Position = projectionMatrix * viewMatrix * instanceWorld;
}
`;

const fragmentShader = `
varying float vDistance;

void main() {
  vec3 baseColor = vec3(0.024, 0.714, 0.831); // Cyan #06b6d4
  vec3 accentColor = vec3(0.659, 0.333, 0.969); // Violet #a855f7
  
  // Slight glow and color variation near cursor
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

function Particles({ count, isMobile }: { count: number, isMobile: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();
  
  const points = useMemo(() => getLorenzPoints(count), [count]);
  
  const uniforms = useMemo(() => ({
    uCursorPos: { value: new THREE.Vector3(0,0,100) },
    uTime: { value: 0 },
    uIsMobile: { value: isMobile }
  }), [isMobile]);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    
    const scale = 0.15;
    const offsetX = 0;
    const offsetY = -4; 
    const offsetZ = -5;
    
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
  }, [points, count]);

  const vec = new THREE.Vector3();
  useFrame((state) => {
    if (!meshRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;

    if (!isMobile) {
      // Find intersection of cursor ray with z=0 plane
      vec.set(state.pointer.x, state.pointer.y, 0.5);
      vec.unproject(state.camera);
      vec.sub(state.camera.position).normalize();
      
      // Calculate intersection distance
      const distance = (0 - state.camera.position.z) / vec.z;
      const targetPos = state.camera.position.clone().add(vec.multiplyScalar(distance));
      
      uniforms.uCursorPos.value.lerp(targetPos, 0.1);
    }
    
    // Rotate the entire system slowly
    meshRef.current.rotation.y += 0.001;
    meshRef.current.rotation.x += 0.0005;
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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    setMounted(true);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  const particleCount = isMobile ? 8000 : 50000;

  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
        <Particles count={particleCount} isMobile={isMobile} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} intensity={0.8} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
