"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export function LoadOrchestrator() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (sessionStorage.getItem("site-loaded")) {
      timeoutId = setTimeout(() => {
        setLoading(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setLoading(false);
        sessionStorage.setItem("site-loaded", "true");
      },
    });

    // We do the orchestrator logic inside HeroSection mostly, but we handle the overlay here.
    tl.to("#load-overlay", { opacity: 0, duration: 0.4, ease: "power2.inOut", delay: 0.2 });

    return () => clearTimeout(timeoutId);
  }, []);

  if (!loading) return null;

  return (
    <div
      id="load-overlay"
      className="fixed inset-0 z-[10000] bg-black pointer-events-none"
    />
  );
}
