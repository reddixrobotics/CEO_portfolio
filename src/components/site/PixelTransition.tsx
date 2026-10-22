"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion/tokens";

interface PixelTransitionProps {
  cols?: number;
  rows?: number;
  onComplete?: () => void;
}

export default function PixelTransition({
  cols = 20,
  rows = 12,
  onComplete,
}: PixelTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) {
      setIsActive(false);
      onComplete?.();
      return;
    }

    setIsActive(true);

    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const cells = containerRef.current.querySelectorAll(".pixel-cell");

      // Dissolve cells in randomized / radial wave pattern
      gsap.fromTo(
        cells,
        { scale: 1, opacity: 1 },
        {
          scale: 0,
          opacity: 0,
          duration: 0.55,
          stagger: {
            grid: [rows, cols],
            from: "center",
            amount: 0.45,
          },
          ease: "power2.inOut",
          onComplete: () => {
            setIsActive(false);
            onComplete?.();
          },
        }
      );
    }, 20);

    return () => clearTimeout(timer);
  }, [pathname, cols, rows, onComplete]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className="pixel-cell bg-black" />
      ))}
    </div>
  );
}
