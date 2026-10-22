"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion/tokens";
import { ArrowRight } from "lucide-react";

interface LiquidButtonProps {
  label: string;
  href: string;
  className?: string;
  ariaLabel?: string;
}

export default function LiquidButton({
  label,
  href,
  className = "",
  ariaLabel,
}: LiquidButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const fillBlobRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (prefersReducedMotion()) return;

    if (fillBlobRef.current) {
      gsap.to(fillBlobRef.current, {
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out",
      });
    }

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        x: 3,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion()) return;

    if (fillBlobRef.current) {
      gsap.to(fillBlobRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        x: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  };

  return (
    <Link
      ref={buttonRef}
      href={href}
      aria-label={ariaLabel || label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative inline-flex select-none items-center rounded-full ring-2 ring-transparent transition-all duration-300 hover:ring-white/80 active:scale-95 ${className}`}
      style={{ backgroundColor: "#ece7df" }}
    >
      {/* Dynamic pill base */}
      <span
        ref={fillBlobRef}
        aria-hidden="true"
        className="pointer-events-none absolute z-0 rounded-full transition-transform"
        style={{
          top: "0.375rem",
          left: "0.375rem",
          bottom: "0.375rem",
          width: "2.25rem",
          backgroundColor: "#0a0a0a",
        }}
      />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-3 py-1.5 pl-1.5 pr-6">
        <span
          ref={arrowRef}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <span className="text-[0.9375rem] font-semibold tracking-tight text-[#0a0a0a]">
          {label}
        </span>
      </span>
    </Link>
  );
}
