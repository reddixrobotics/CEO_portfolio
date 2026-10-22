"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion/tokens";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [isOverHero, setIsOverHero] = useState(false);

  useEffect(() => {
    // Hide custom cursor on touch devices or reduced motion
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch || prefersReducedMotion()) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setHasMoved(true);
      const target = e.target as HTMLElement | null;
      const inHero = target ? !!target.closest("#hero-section, section") : false;
      setIsOverHero(inHero);

      if (dotRef.current) {
        gsap.to(dotRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.08,
          ease: "power2.out",
        });
      }

      if (ringRef.current) {
        gsap.to(ringRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.28,
          ease: "power3.out",
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest("a, button, [role='button'], input, textarea, select");
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          scale: isInteractive ? 1.8 : 1,
          borderColor: isInteractive ? "#38bdf8" : "#ffffff",
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!isVisible || !hasMoved || isOverHero) return null;

  return (
    <>
      {/* Center dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] -ml-1 -mt-1 h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[119] -ml-4 -mt-4 h-8 w-8 rounded-full border border-white/40 transition-colors"
      />
    </>
  );
}
