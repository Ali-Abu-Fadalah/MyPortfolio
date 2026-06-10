"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PortfolioProject } from "@/lib/sanity";
import { Github, ExternalLink } from "lucide-react";

export function ProjectCard({ project, index, total }: { project: PortfolioProject; index: number; total: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Create noise texture once per card
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 380;
    canvas.height = 160;

    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const data = imgData.data;

    // Generative noise based on index/title
    const seed = index * 1000 + project.title.charCodeAt(0);

    for (let i = 0; i < data.length; i += 4) {
      // Very subtle noise
      const val = (Math.sin(i * 0.01 + seed) * 0.5 + 0.5) * 20;
      data[i] = val; // R
      data[i + 1] = val + 10; // G
      data[i + 2] = val + 20; // B
      data[i + 3] = 255; // Alpha
    }

    ctx.putImageData(imgData, 0, 0);
  }, [index, project.title]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !shineRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Shine effect
    gsap.to(shineRef.current, {
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.06) 0%, transparent 60%)`,
      duration: 0.1
    });

    // 3D tilt
    const cardCenterX = rect.width / 2;
    const cardCenterY = rect.height / 2;
    const rotX = ((y - cardCenterY) / rect.height) * -12;
    const rotY = ((x - cardCenterX) / rect.width) * 12;

    gsap.to(cardRef.current, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !shineRef.current) return;

    gsap.to(shineRef.current, {
      background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 0%, transparent 60%)`,
      duration: 0.5
    });

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "power2.out"
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-[340px] md:w-[380px] h-[480px] md:h-[500px] bg-[#111113] border border-white/5 overflow-hidden flex flex-col cursor-none"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div ref={shineRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Top section: Noise Texture */}
      <div className="relative h-[160px] w-full shrink-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111113]" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 font-mono text-[10px] uppercase text-zinc-400 bg-white/5 px-2 py-1 rounded">
          {project.category || 'Project'}
        </div>

        {/* Tech Pills (Bottom of texture) */}
        <div className="absolute bottom-2 left-4 flex flex-wrap gap-2">
          {project.techStack?.slice(0, 3).map((tech) => (
            <span key={tech} className="text-[11px] font-mono text-cyan-500">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1 justify-between relative z-10">
        <div>
          <div className="font-mono text-[11px] text-zinc-500 mb-4">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>

          <h3 className="text-2xl font-bold text-white mb-3">
            {project.title}
          </h3>

          <p className="text-sm text-zinc-400 line-clamp-3 leading-[1.6]">
            {project.description}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-6">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View Code</span>
            </a>
          )}
          {project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-cyan-500 hover:text-cyan-400 transition-colors ml-auto"
            >
              <span>Demo</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
