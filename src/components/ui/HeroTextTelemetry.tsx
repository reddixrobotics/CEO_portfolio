"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { prefersReducedMotion } from "@/lib/motion/tokens";

interface HeroTextTelemetryProps {
  eyebrow?: string;
  line1?: string;
  line2?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  className?: string;
}

const GLYPHS = "0123456789ABCDEF█▒░▚▞#$%=/\\<>_+-*[]";

export default function HeroTextTelemetry({
  eyebrow = "/ REDDIX ROBOTICS • CEO",
  line1 = "RAJA RAJESHWAR",
  line2 = "REDDY PATURI",
  subtitle = "ROBOTICS / AI / AUTONOMOUS SYSTEMS",
  ctaLabel = "EXPLORE MY WORK",
  ctaLink = "/#about",
  className = "",
}: HeroTextTelemetryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Text Scramble States
  const [dispLine1, setDispLine1] = useState(line1);
  const [dispLine2, setDispLine2] = useState(line2);
  const [dispEyebrow, setDispEyebrow] = useState(eyebrow);
  const [isScrambling, setIsScrambling] = useState(false);
  const [activeChars1, setActiveChars1] = useState<boolean[]>([]);
  const [activeChars2, setActiveChars2] = useState<boolean[]>([]);

  // Telemetry Bar Position (0 to 100 percentage)
  const [markerPos, setMarkerPos] = useState(35);
  const targetPosRef = useRef(35);
  const isMouseActiveRef = useRef(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Cybernetic Decode Animation ───
  const runDecode = useCallback(() => {
    if (prefersReducedMotion()) {
      setDispLine1(line1);
      setDispLine2(line2);
      setDispEyebrow(eyebrow);
      return;
    }

    setIsScrambling(true);

    const len1 = line1.length;
    const len2 = line2.length;
    let step = 0;
    const totalSteps = 38;

    const interval = setInterval(() => {
      step++;
      const p1 = Math.min(1, step / 24);
      const p2 = Math.min(1, Math.max(0, (step - 8) / 26));
      const pEye = Math.min(1, step / 18);

      // Line 1 Decode
      const locked1 = Math.floor(p1 * len1);
      const active1: boolean[] = [];
      let res1 = "";
      for (let i = 0; i < len1; i++) {
        if (line1[i] === " ") {
          res1 += " ";
          active1.push(false);
        } else if (i < locked1) {
          res1 += line1[i];
          active1.push(false);
        } else if (i === locked1) {
          res1 += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          active1.push(true);
        } else {
          res1 += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          active1.push(false);
        }
      }
      setDispLine1(res1);
      setActiveChars1(active1);

      // Line 2 Decode
      const locked2 = Math.floor(p2 * len2);
      const active2: boolean[] = [];
      let res2 = "";
      for (let i = 0; i < len2; i++) {
        if (line2[i] === " ") {
          res2 += " ";
          active2.push(false);
        } else if (i < locked2) {
          res2 += line2[i];
          active2.push(false);
        } else if (i === locked2) {
          res2 += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          active2.push(true);
        } else {
          res2 += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          active2.push(false);
        }
      }
      setDispLine2(res2);
      setActiveChars2(active2);

      // Eyebrow Decode
      const lockedEye = Math.floor(pEye * eyebrow.length);
      let resEye = "";
      for (let i = 0; i < eyebrow.length; i++) {
        if (eyebrow[i] === " ") {
          resEye += " ";
        } else if (i < lockedEye) {
          resEye += eyebrow[i];
        } else {
          resEye += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDispEyebrow(resEye);

      if (step >= totalSteps) {
        clearInterval(interval);
        setDispLine1(line1);
        setDispLine2(line2);
        setDispEyebrow(eyebrow);
        setActiveChars1([]);
        setActiveChars2([]);
        setIsScrambling(false);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [line1, line2, eyebrow]);

  // Initial trigger & Scroll to top trigger
  useEffect(() => {
    runDecode();

    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let lastTrigger = performance.now();

    const onScroll = () => {
      const curY = window.scrollY;
      const now = performance.now();

      // If user scrolls back up into Hero section from below, trigger cyber decode!
      if (curY < 80 && lastScrollY >= 80 && now - lastTrigger > 2000) {
        lastTrigger = now;
        runDecode();
      }
      lastScrollY = curY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [runDecode]);

  // ─── Active Robotics Telemetry Sweeper ───
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const updateTelemetry = (time: number) => {
      const elapsed = (time - startTime) / 1000;

      if (!isMouseActiveRef.current) {
        // Autonomous sweeping trajectory: oscillates between 18% and 78% with multi-frequency sinusoid
        const sweep = 48 + 26 * Math.sin(elapsed * 1.6) + 7 * Math.sin(elapsed * 3.4);
        targetPosRef.current = Math.max(12, Math.min(88, sweep));
      }

      // Smooth lerp toward target
      setMarkerPos((prev) => prev + (targetPosRef.current - prev) * 0.12);

      animId = requestAnimationFrame(updateTelemetry);
    };

    animId = requestAnimationFrame(updateTelemetry);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Mouse interaction: tracks cursor across the telemetry bar
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const pct = Math.max(8, Math.min(92, relX * 100));

    targetPosRef.current = pct;
    isMouseActiveRef.current = true;

    if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
    mouseTimeoutRef.current = setTimeout(() => {
      isMouseActiveRef.current = false;
    }, 1800);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative select-none max-w-full min-w-0 ${className}`}
    >
      {/* ─── Eyebrow Tagline with live terminal pulse ─── */}
      <div className="mb-2 sm:mb-2.5 flex items-center gap-2 max-w-full flex-wrap">
        <p className="font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.26em] text-cyan-400 break-words max-w-full">
          {dispEyebrow}
        </p>
        {isScrambling && (
          <span className="inline-block h-3 w-1.5 animate-pulse bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
        )}
      </div>

      {/* ─── Main Two-Line Name Heading with Matrix Decode & Interactive Glitch ─── */}
      <div
        className="group relative inline-block cursor-pointer max-w-full"
        onClick={runDecode}
        title="Click to trigger cybernetic decode"
      >
        <h1
          className="font-sans font-black uppercase leading-[0.95] tracking-[-0.03em] max-w-full break-words"
          style={{ fontSize: "clamp(1.35rem, 6.2vw, 4.2rem)" }}
        >
          {/* Line 1: RAJA RAJESHWAR */}
          <span className="block">
            {dispLine1.split("").map((ch, idx) => {
              const isActive = activeChars1[idx];
              return (
                <span
                  key={`l1-${idx}`}
                  className={`transition-colors duration-75 ${
                    isActive
                      ? "text-[#00E5FF] drop-shadow-[0_0_12px_#00e5ff]"
                      : "text-white"
                  }`}
                >
                  {ch}
                </span>
              );
            })}
          </span>

          {/* Line 2: REDDY PATURI */}
          <span className="block mt-0.5 sm:mt-1">
            {dispLine2.split("").map((ch, idx) => {
              const isActive = activeChars2[idx];
              return (
                <span
                  key={`l2-${idx}`}
                  className={`transition-colors duration-75 ${
                    isActive
                      ? "text-[#00E5FF] drop-shadow-[0_0_12px_#00e5ff]"
                      : "text-[#71717a]"
                  }`}
                >
                  {ch}
                </span>
              );
            })}
            {/* Inline Cyan Corner Bracket (└) with soft breathing pulse */}
            <span
              className="inline-block ml-1 sm:ml-1.5 font-mono text-base sm:text-xl font-bold leading-none text-cyan-400 align-baseline transition-transform duration-300 group-hover:scale-125"
              style={{ textShadow: "0 0 10px rgba(0, 229, 255, 0.7)" }}
            >
              └
            </span>
          </span>
        </h1>
      </div>

      {/* ─── Subtitle with highlighted cyan slashes ─── */}
      <p className="mt-3 sm:mt-4 font-mono text-[9.5px] sm:text-[11px] font-medium uppercase tracking-[0.12em] sm:tracking-[0.24em] text-zinc-400 max-w-full break-words">
        ROBOTICS&nbsp;<span className="text-cyan-400 font-bold shadow-cyan-400/50">/</span>&nbsp;AI&nbsp;<span className="text-cyan-400 font-bold shadow-cyan-400/50">/</span>&nbsp;AUTONOMOUS SYSTEMS
      </p>

      {/* ─── Dynamic Robotics Telemetry Line & Moving '+' Crosshair Scanner ─── */}
      <div
        className="relative mt-2 sm:mt-2.5 mb-5 sm:mb-7 flex items-center w-full max-w-[20rem] h-5"
      >
        {/* Background dark track */}
        <div className="absolute inset-x-0 h-px bg-zinc-800" />

        {/* Active glowing cyan lead line */}
        <div
          className="absolute left-0 h-[2px] bg-gradient-to-r from-cyan-500/20 via-cyan-400 to-cyan-300 transition-all duration-75"
          style={{
            width: `${markerPos}%`,
            boxShadow: "0 0 8px rgba(0, 229, 255, 0.75)",
          }}
        />

        {/* Moving '+' Telemetry Crosshair Marker */}
        <div
          className="absolute flex items-center justify-center -translate-x-1/2 pointer-events-none transition-all duration-75"
          style={{ left: `${markerPos}%` }}
        >
          {/* Outer radar pulse aura */}
          <span className="absolute h-4 w-4 rounded-full border border-cyan-400/40 animate-ping opacity-75" />
          {/* Inner glowing '+' symbol */}
          <span
            className="relative font-mono text-[13px] font-black text-cyan-300 leading-none"
            style={{
              textShadow: "0 0 10px #00E5FF, 0 0 18px rgba(0,229,255,0.8)",
            }}
          >
            +
          </span>
        </div>
      </div>

      {/* ─── EXPLORE MY WORK → Button (Desktop view; mobile CTA is rendered below robot) ─── */}
      <div className="hidden lg:block w-full sm:w-auto">
        <Link
          href={ctaLink}
          onClick={(e) => {
            const el = document.getElementById("about");
            if (el) {
              e.preventDefault();
              if ((window as any).lenis) {
                (window as any).lenis.scrollTo(el, { duration: 1.4 });
              } else {
                el.scrollIntoView({ behavior: "smooth" });
              }
              window.history.pushState(null, "", "/#about");
            }
          }}
          className="group relative inline-flex w-full sm:w-auto min-h-[44px] items-center justify-center sm:justify-start gap-2.5 sm:gap-3 overflow-hidden rounded-[2px] border border-cyan-400/80 bg-black/90 px-5 py-2.5 sm:px-6 font-mono text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-white transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-950/40 hover:shadow-[0_0_24px_rgba(0,229,255,0.3)] active:scale-[0.98] max-w-full"
        >
          {/* Subtle scanning light streak across the button */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-[linear-gradient(90deg,transparent,rgba(0,229,255,0.35),transparent)]" />

          {/* Inner background blocker for crisp button body */}
          <span className="absolute inset-[1px] rounded-[1px] bg-[#020508]" />

          {/* Button Content */}
          <span className="relative z-10 whitespace-nowrap transition-colors group-hover:text-cyan-200">
            {ctaLabel}
          </span>
          <span className="relative z-10 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-cyan-300 drop-shadow-[0_0_6px_#00e5ff] shrink-0">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
