"use client";

import { useEffect, useRef, useState } from "react";
import { Github, Linkedin } from "lucide-react";

export function ContactSection({ linkedinUrl, copyrightName }: { email: string; linkedinUrl: string; copyrightName: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = 80;
    };

    window.addEventListener('resize', resize);
    resize();

    const render = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const freq = inputText.length * 0.08 + 1.0;
      const targetAmp = Math.min(inputText.length * 1.5 + 5, 30);

      // Smooth out amplitude changes (simplified here, in reality we'd lerp a ref value)
      const amp = targetAmp;

      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        // Center the wave energy
        const xNormalized = (x / canvas.width) * 2 - 1;
        const envelope = 1 - Math.pow(xNormalized, 4); // taper off at edges

        const y = canvas.height / 2 + Math.sin(x * 0.05 * freq + time) * amp * envelope;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [inputText]);

  return (
    <section id="contact" className="w-full bg-transparent border-t border-white/5 py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 md:gap-8">

        {/* Left Panel */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-5xl md:text-[56px] font-extrabold leading-[1.1] text-white">
              Let&apos;s build
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-500">
                something
              </span>
              <br />
              together.
            </h2>

            <p className="mt-8 text-zinc-400 max-w-sm text-lg leading-relaxed">
              Available for full-time roles, freelance projects, and interesting open-source.
            </p>
          </div>

          <div className="mt-16 flex items-center gap-6">
            <a href="https://github.com/Ali-Abu-Fadalah" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors cursor-none">
              <Github className="w-6 h-6" />
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition-colors cursor-none">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="font-mono text-sm text-zinc-500 hover:text-white transition-colors cursor-none">
              {copyrightName.toLowerCase().replace(/\s+/g, '')}.me
            </a>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col justify-center">

          {/* Waveform Canvas */}
          <div className="w-full h-[80px] mb-8 relative">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
          </div>

          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-end gap-4 border-b border-white/10 pb-2 focus-within:border-cyan-500 transition-colors">
              <input
                type="email"
                placeholder="your@email.com"
                className="bg-transparent flex-1 outline-none font-mono text-sm text-white placeholder:text-zinc-600"
                onChange={(e) => setInputText(e.target.value)}
              />
              <button className="text-sm font-bold text-white hover:text-cyan-400 transition-colors cursor-none whitespace-nowrap">
                Send →
              </button>
            </div>

            <div className="border-b border-white/10 pb-2 focus-within:border-cyan-500 transition-colors h-32">
              <textarea
                placeholder="What do you want to build?"
                className="bg-transparent w-full h-full outline-none font-mono text-sm text-white placeholder:text-zinc-600 resize-none"
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
          </form>

        </div>
      </div>
    </section>
  );
}
