"use client";

import { useEffect, useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Read shaders as plain text strings to pass to ShaderMaterial
// In a real Vite/Next setup with vite-plugin-glsl these would be imported directly.
// We'll just define them inline or fetch them since Next.js app router doesn't parse .glsl by default without extra config.

const vertShader = `
uniform float u_time;
uniform vec3 u_pointer; // Mouse position in 3D
uniform float u_progress; // 0 to 1

attribute vec3 a_attractor;
attribute vec3 a_chaos;

varying vec3 v_color;
varying float v_depth;

const vec3 COLOR_CYAN = vec3(0.024, 0.714, 0.831);
const vec3 COLOR_VIOLET = vec3(0.659, 0.333, 0.969);

void main() {
    vec3 startPos = a_chaos;
    vec3 currentPos = mix(startPos, a_attractor, u_progress);

    float dist = distance(currentPos, u_pointer);
    float repulsionRadius = 1.5;

    if (dist < repulsionRadius) {
        vec3 dir = normalize(currentPos - u_pointer);
        float force = clamp(0.1 / (dist * dist + 0.01), 0.0, 1.0);
        currentPos += dir * force * u_progress * 0.5;
    }

    vec4 mvPosition = modelViewMatrix * vec4(currentPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = (10.0 / -mvPosition.z);

    float normalizedZ = clamp(a_attractor.z / 10.0, 0.0, 1.0);
    v_color = mix(COLOR_CYAN, COLOR_VIOLET, normalizedZ);
    v_depth = -mvPosition.z;
}
`;

const fragShader = `
varying vec3 v_color;
varying float v_depth;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    if(length(coord) > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.3, 0.5, length(coord));
    float fogFactor = smoothstep(2.0, 10.0, v_depth);
    alpha *= (1.0 - fogFactor * 0.8);

    gl_FragColor = vec4(v_color, alpha);
}
`;

export default function LorenzScene() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport, camera } = useThree();

  const isMobile = size.width < 768;
  const numParticles = isMobile ? 8000 : 50000;

  const [attractorPositions, chaosPositions] = useMemo(() => {
    const attractor = new Float32Array(numParticles * 3);
    const chaos = new Float32Array(numParticles * 3);

    let x = 0.1, y = 0, z = 0;
    const sigma = 10, rho = 28, beta = 8 / 3, dt = 0.005;

    for (let i = 0; i < numParticles; i++) {
      const dx = sigma * (y - x) * dt;
      const dy = (x * (rho - z) - y) * dt;
      const dz = (x * y - beta * z) * dt;
      x += dx; y += dy; z += dz;

      attractor[i * 3] = x * 0.3;
      attractor[i * 3 + 1] = y * 0.3;
      attractor[i * 3 + 2] = z * 0.3;
    }

    // Since we're in useMemo, React hook purity rule complains about Math.random().
    // It's safe to use Math.random here since we want random positions once per mount.
    // However, to satisfy the strict linter, we'll just generate them here anyway and ignore the warning,
    // or use a pseudo-random generator. But a simpler approach is just doing it here as it only runs when numParticles changes.
    // We'll disable the lint rule for these lines.

    for (let i = 0; i < numParticles; i++) {
      // eslint-disable-next-line react-hooks/purity
      chaos[i * 3] = (Math.random() - 0.5) * 40;
      // eslint-disable-next-line react-hooks/purity
      chaos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      // eslint-disable-next-line react-hooks/purity
      chaos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    return [attractor, chaos];
  }, [numParticles]);

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_pointer: { value: new THREE.Vector3(999, 999, 999) },
    u_progress: { value: 0 }
  }), []);

  useEffect(() => {
    // Reveal animation
    gsap.to(uniforms.u_progress, {
      value: 1,
      duration: 1.8,
      ease: "expo.out",
      delay: 0.2
    });
  }, [uniforms]);

  // Handle konami code easter egg
  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          console.log("you know your attractors 🦋");
          konamiIndex = 0;
          // Could implement rossler attractor logic here
        }
      } else {
        konamiIndex = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.elapsedTime;

      if (!isMobile) {
        // Map mouse to 3D space
        const vector = new THREE.Vector3(state.pointer.x, state.pointer.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        // Smooth pointer movement
        materialRef.current.uniforms.u_pointer.value.lerp(pos, 0.1);
      }
    }

    if (pointsRef.current) {
      // Gentle rotation
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      pointsRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef} position={[isMobile ? 0 : 3, -4, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-a_attractor"
          count={numParticles}
          array={attractorPositions}
          itemSize={3}
          args={[attractorPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-a_chaos"
          count={numParticles}
          array={chaosPositions}
          itemSize={3}
          args={[chaosPositions, 3]}
        />
        {/* We just need a dummy position attribute, shader uses a_chaos and a_attractor */}
        <bufferAttribute
          attach="attributes-position"
          count={numParticles}
          array={chaosPositions}
          itemSize={3}
          args={[chaosPositions, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
