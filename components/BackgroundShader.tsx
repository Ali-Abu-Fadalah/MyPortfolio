'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  // Slow moving noise field
  float noise = snoise(vUv * 3.0 + uTime * 0.05);
  float intensity = noise * 0.5 + 0.5;
  
  // Subtle dark aesthetic blending around #09090b
  vec3 color1 = vec3(0.035, 0.035, 0.043); 
  vec3 color2 = vec3(0.055, 0.055, 0.065);
  vec3 finalColor = mix(color1, color2, intensity);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

function Scene() {
  const { viewport, invalidate } = useThree();
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useEffect(() => {
    let animationFrameId: number;
    let then = performance.now();
    const interval = 1000 / 30; // Throttle to 30fps

    const renderLoop = (now: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const delta = now - then;
      
      if (delta > interval) {
        then = now - (delta % interval);
        uniforms.uTime.value = now * 0.001;
        invalidate(); // Trigger exactly 1 frame render
      }
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [invalidate, uniforms]);

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function BackgroundShader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none">
      <Canvas frameloop="demand" camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
        <Scene />
      </Canvas>
    </div>
  );
}
