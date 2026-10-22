"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Eye,
  Crosshair,
  Cpu,
  ShieldCheck,
  Building2,
  Users,
  Leaf,
  Target,
} from "lucide-react";

export interface VisionImpactSectionProps {
  standalone?: boolean;
}

export interface VisionCardItem {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  type: "paragraph" | "bullets";
  content?: string;
  bullets?: string[];
}

export const VISION_CARDS_DATA: VisionCardItem[] = [
  {
    id: "card-vision",
    title: "OUR VISION",
    icon: Eye,
    type: "paragraph",
    content:
      "To build intelligent robotic systems that make industries safer, more efficient and more sustainable.",
  },
  {
    id: "card-mission",
    title: "OUR MISSION",
    icon: Crosshair,
    type: "paragraph",
    content:
      "To innovate, develop and deploy real-world robotics solutions that solve meaningful problems and create lasting value.",
  },
  {
    id: "card-focus",
    title: "OUR FOCUS AREAS",
    icon: Cpu,
    type: "bullets",
    bullets: [
      "Autonomous Mobile Robots",
      "Robotic Manipulators",
      "Drones & Computer Vision",
      "ROS 2 & SLAM",
      "AI-Powered Systems",
    ],
  },
  {
    id: "card-impact",
    title: "THE IMPACT WE AIM FOR",
    icon: ShieldCheck,
    type: "bullets",
    bullets: [
      "Safer workplaces",
      "Higher productivity",
      "Smarter industries",
      "Enhanced accessibility",
      "A more sustainable planet",
    ],
  },
];

export interface ImpactIndicatorItem {
  id: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  subtitle: string;
}

export const IMPACT_INDICATORS: ImpactIndicatorItem[] = [
  {
    id: "ind-industries",
    icon: Building2,
    title: "INDUSTRIES",
    subtitle: "Stronger operations",
  },
  {
    id: "ind-communities",
    icon: Users,
    title: "COMMUNITIES",
    subtitle: "Better accessibility",
  },
  {
    id: "ind-environment",
    icon: Leaf,
    title: "ENVIRONMENT",
    subtitle: "Lower footprint",
  },
  {
    id: "ind-future",
    icon: Target,
    title: "FUTURE",
    subtitle: "Sustainable growth",
  },
];

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function VisionImpactSection({
  standalone = false,
}: VisionImpactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);

  const [hasMounted, setHasMounted] = useState(false);
  const [initialPhase, setInitialPhase] = useState(true);
  const [heroInView, setHeroInView] = useState(false);
  const [cardsInView, setCardsInView] = useState(false);
  const [impactInView, setImpactInView] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeIndicator, setActiveIndicator] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }

    // Set page mounted for the initial dark power-on dissolve
    const mountTimer = setTimeout(() => {
      setHasMounted(true);
    }, 60);

    // Initial phase finishes after 1.8s, transitioning into pure scroll-responsive mode
    const initialTimer = setTimeout(() => {
      setInitialPhase(false);
    }, 1800);

    // If standalone (/vision route), initialize visibility for the entrance choreography
    if (standalone) {
      setHeroInView(true);
      setCardsInView(true);
      setImpactInView(true);
    }

    // Set up dedicated IntersectionObservers for Hero, Cards, and Impact sections
    const createObserver = (
      setter: React.Dispatch<React.SetStateAction<boolean>>,
      threshold = 0.1,
      margin = "0px 0px -40px 0px"
    ) => {
      return new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setter(true);
            } else {
              // Reset when scrolled out of view so it smoothly re-animates on scroll
              setter(false);
            }
          });
        },
        { threshold, rootMargin: margin }
      );
    };

    const heroObs = createObserver(setHeroInView, 0.1, "0px 0px -20px 0px");
    const cardsObs = createObserver(setCardsInView, 0.1, "0px 0px -40px 0px");
    const impactObs = createObserver(setImpactInView, 0.1, "0px 0px -40px 0px");

    const heroEl = heroRef.current;
    const cardsEl = cardsRef.current;
    const impactEl = impactRef.current;

    if (heroEl) heroObs.observe(heroEl);
    if (cardsEl) cardsObs.observe(cardsEl);
    if (impactEl) impactObs.observe(impactEl);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(initialTimer);
      heroObs.disconnect();
      cardsObs.disconnect();
      impactObs.disconnect();
    };
  }, []);

  // If user prefers reduced motion, everything is immediately visible with no delays
  const showHero = heroInView || reducedMotion;
  const showCards = cardsInView || reducedMotion;
  const showImpact = impactInView || reducedMotion;

  return (
    <section
      ref={sectionRef}
      id="vision"
      className={`relative w-full overflow-hidden bg-black text-white scroll-mt-24 sm:scroll-mt-28 ${
        standalone
          ? "min-h-screen pt-24 pb-8 sm:pt-28 sm:pb-12"
          : "pt-24 pb-8 sm:pt-28 sm:pb-10 lg:pt-28 lg:pb-10"
      }`}
      style={{
        background: `
          radial-gradient(ellipse 75% 50% at 75% 15%, rgba(0, 229, 255, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse 65% 45% at 20% 80%, rgba(0, 180, 216, 0.06) 0%, transparent 55%),
          #02060b
        `,
      }}
    >
      {/* Anchor for direct navigation */}
      <div id="impact" className="sr-only scroll-mt-24 sm:scroll-mt-28" aria-hidden="true" />

      {/* ─── Sci-Fi Power-On Entrance: Dark Overlay & Horizontal Cyan Light Sweep ─── */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-30 transition-opacity duration-700 ease-out ${
          hasMounted ? "opacity-0 pointer-events-none" : "opacity-95 bg-black"
        }`}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-20 w-48 blur-xl"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.22) 50%, transparent 100%)",
          transform: showHero ? "translateX(1600px)" : "translateX(-350px)",
          opacity: showHero ? 0 : 0.85,
          transition: reducedMotion
            ? "none"
            : `transform 1200ms ${EASING}, opacity 1300ms ease-out`,
        }}
      />

      {/* ─── Ambient Robotics Floor Grid & Lighting ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 40%, transparent 85%)",
        }}
      />

      {/* Glowing vertical perspective light pillars in background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <span
          className="absolute top-0 block h-96 w-1 bg-cyan-400/20 blur-[2px]"
          style={{ right: "16%", boxShadow: "0 0 25px 2px #00e5ff" }}
        />
        <span
          className="absolute top-10 block h-80 w-0.5 bg-cyan-400/30 blur-[1px]"
          style={{ right: "32%", boxShadow: "0 0 20px 2px #00e5ff" }}
        />
        <span
          className="absolute top-4 block h-72 w-0.5 bg-cyan-400/15 blur-[2px]"
          style={{ left: "8%", boxShadow: "0 0 20px 1px #00e5ff" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1550px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ══════════════════════════════════════════════════════════════
            HERO SECTION: Top Row (Heading Left, Robotics Visuals Right)
           ══════════════════════════════════════════════════════════════ */}
        <div ref={heroRef} className="relative grid grid-cols-1 items-center gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Left Column: Heading, Description & Technical Banner */}
          <div className="lg:col-span-6 xl:col-span-6">
            {/* 1. // OUR VISION label */}
            <p
              className={`font-mono text-[10.5px] sm:text-xs font-bold tracking-[0.22em] uppercase text-cyan-400 mb-1 sm:mb-1.5 flex items-center gap-2 transition-all duration-600 ${
                showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : "60ms",
                transitionTimingFunction: EASING,
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse" />
              // OUR VISION
            </p>

            {/* 2. Main Title reveals line by line smoothly */}
            <h1 className="font-mono text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-extrabold uppercase leading-[1.08] tracking-tight text-white">
              <span className="block overflow-hidden pb-0.5">
                <span
                  className={`block transition-all duration-700 ${
                    showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
                  }`}
                  style={{
                    transitionDelay: reducedMotion ? "0ms" : "120ms",
                    transitionTimingFunction: EASING,
                  }}
                >
                  BUILDING A SMARTER,
                </span>
              </span>
              <span className="block overflow-hidden pb-0.5">
                <span
                  className={`block text-cyan-400 transition-all duration-700 ${
                    showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
                  }`}
                  style={{
                    transitionDelay: reducedMotion ? "0ms" : "220ms",
                    transitionTimingFunction: EASING,
                    textShadow:
                      "0 0 20px rgba(0, 229, 255, 0.45), 0 0 35px rgba(0, 229, 255, 0.2)",
                  }}
                >
                  SAFER TOMORROW
                </span>
              </span>
            </h1>

            {/* 3. Description fades in and moves upward slightly */}
            <p
              className={`mt-1.5 sm:mt-2 max-w-lg text-[10.5px] sm:text-[11.5px] xl:text-xs leading-relaxed text-slate-300 transition-all duration-700 ${
                showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : "320ms",
                transitionTimingFunction: EASING,
              }}
            >
              At Reddix Robotics, we envision a future where intelligent robots work alongside
              humans to solve real-world problems, increase productivity, and create a safer,
              more sustainable world.
            </p>

            {/* 4. Slim Technical Banner: Horizontal Reveal */}
            <div
              className={`mt-2.5 inline-flex items-center gap-2 px-2.5 py-1 border border-cyan-400/60 bg-cyan-950/25 backdrop-blur-sm transition-all duration-700 hover:border-cyan-300 ${
                showHero ? "opacity-100 scale-x-100 origin-left" : "opacity-0 scale-x-75 origin-left"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : "420ms",
                transitionTimingFunction: EASING,
                clipPath:
                  "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                boxShadow:
                  "0 0 12px rgba(0, 229, 255, 0.15), inset 0 0 8px rgba(0, 229, 255, 0.08)",
              }}
            >
              <span className="font-mono text-[7.5px] sm:text-[8.5px] xl:text-[9px] font-bold tracking-[0.16em] uppercase text-cyan-300 flex items-center gap-1.5 flex-wrap">
                <span>INTELLIGENT ROBOTS</span>
                <span className="text-cyan-400/60">×</span>
                <span>REAL-WORLD IMPACT</span>
                <span className="text-cyan-400/60">×</span>
                <span>A SUSTAINABLE FUTURE</span>
              </span>
            </div>
          </div>

          {/* 5. Right Column: Kushi AMR 3D Holographic Hero Experience (Matching Image 2 Reference) */}
          <div className="relative flex items-center justify-center lg:justify-end lg:col-span-6 xl:col-span-6">
            <div
              className={`relative w-full max-w-[440px] sm:max-w-[520px] lg:max-w-[560px] xl:max-w-[620px] h-[270px] sm:h-[310px] lg:h-[340px] xl:h-[370px] flex items-center justify-center transition-all duration-800 ${
                showHero ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.95] translate-y-4"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : "260ms",
                transitionTimingFunction: EASING,
              }}
            >
              {/* ── Floating HUD Information Panel: KUSHI AMR (Top Right) ── */}
              <div
                className={`absolute top-0 right-1 sm:top-1 sm:right-3 z-30 transition-all duration-700 ${
                  showHero ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                }`}
                style={{
                  transitionDelay: reducedMotion ? "0ms" : "480ms",
                  transitionTimingFunction: EASING,
                }}
              >
                <div
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-cyan-400/50 bg-black/60 backdrop-blur-md rounded-sm transition-all duration-300 hover:border-cyan-300"
                  style={{
                    boxShadow:
                      "0 0 16px rgba(0, 229, 255, 0.22), inset 0 0 10px rgba(0, 229, 255, 0.08)",
                    clipPath:
                      "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-ping" />
                    <span className="font-mono text-[10px] sm:text-[11.5px] font-black tracking-[0.2em] uppercase text-cyan-300 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                      KUSHI AMR
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono text-[7.5px] sm:text-[8.5px] tracking-wide text-cyan-200/80 flex items-center gap-1.5">
                    <span>Autonomous</span>
                    <span className="text-cyan-400/60">•</span>
                    <span>Intelligent</span>
                    <span className="text-cyan-400/60">•</span>
                    <span>Reliable</span>
                  </p>
                </div>
              </div>

              {/* ── Background: Sweeping Cyan Energy Ribbon Arc (from left behind Kushi to platform) ── */}
              <div
                className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-1000 ${
                  showHero ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  transitionDelay: reducedMotion ? "0ms" : "200ms",
                }}
              >
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 360"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="kushiEnergyGrad" x1="0%" y1="60%" x2="100%" y2="40%">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
                      <stop offset="25%" stopColor="#00e5ff" stopOpacity="0.4" />
                      <stop offset="65%" stopColor="#00f0ff" stopOpacity="0.95" />
                      <stop offset="90%" stopColor="#00e5ff" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.1" />
                    </linearGradient>
                    <filter id="kushiEnergyGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="7" result="blur2" />
                      <feGaussianBlur stdDeviation="2.5" result="blur1" />
                      <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Wide ambient bloom halo behind arc */}
                  <path
                    d="M 10 210 C 80 180, 140 100, 270 115 C 400 130, 500 185, 545 260 C 565 295, 515 325, 410 325"
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="14"
                    opacity="0.18"
                    filter="url(#kushiEnergyGlow)"
                  />
                  {/* Glowing Core Stream */}
                  <path
                    d="M 10 210 C 80 180, 140 100, 270 115 C 400 130, 500 185, 545 260 C 565 295, 515 325, 410 325"
                    fill="none"
                    stroke="url(#kushiEnergyGrad)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    filter="url(#kushiEnergyGlow)"
                  />
                  {/* High-intensity White Core Filament */}
                  <path
                    d="M 50 195 C 115 165, 185 110, 280 120 C 375 130, 460 180, 500 240"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    opacity="0.85"
                  />
                </svg>
              </div>

              {/* ── Holographic 3D Circular Platform (Floor Rings & Radar Scanner) ── */}
              <div
                className={`pointer-events-none absolute bottom-0 sm:bottom-1 inset-x-0 h-40 sm:h-48 flex items-center justify-center transition-all duration-1000 ${
                  showHero ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
                style={{
                  transitionDelay: reducedMotion ? "0ms" : "300ms",
                  perspective: "900px",
                }}
              >
                {/* 3D Tilted Floor Plane */}
                <div
                  className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[410px] aspect-square flex items-center justify-center"
                  style={{
                    transform: "rotateX(72deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Radial Cyan Floor Glow */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(0, 229, 255, 0.45) 0%, rgba(0, 229, 255, 0.15) 45%, transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Platform Base Disc: Dark Reflective Glass */}
                  <div
                    className="absolute inset-3 rounded-full border border-cyan-400/40"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(2, 16, 28, 0.9) 0%, rgba(1, 8, 14, 0.98) 75%, transparent 100%)",
                      boxShadow:
                        "0 0 28px rgba(0, 229, 255, 0.28), inset 0 0 16px rgba(0, 229, 255, 0.22)",
                    }}
                  />

                  {/* Concentric Animated Holographic Rings */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                    <defs>
                      <filter id="kushiRingGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id="kushiSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.85" />
                        <stop offset="45%" stopColor="#00e5ff" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Outer Dashed Compass Ring: Clockwise Continuous Rotation */}
                    <g style={{ transformOrigin: "200px 200px", animation: "ringRotateCw 28s linear infinite" }}>
                      <circle
                        cx="200"
                        cy="200"
                        r="184"
                        fill="none"
                        stroke="#00e5ff"
                        strokeWidth="1.2"
                        strokeDasharray="4 8 16 8"
                        opacity="0.65"
                        filter="url(#kushiRingGlow)"
                      />
                      {/* Cardinal Compass Markers */}
                      <line x1="200" y1="10" x2="200" y2="22" stroke="#00e5ff" strokeWidth="2.2" opacity="0.9" />
                      <line x1="200" y1="378" x2="200" y2="390" stroke="#00e5ff" strokeWidth="2.2" opacity="0.9" />
                      <line x1="10" y1="200" x2="22" y2="200" stroke="#00e5ff" strokeWidth="2.2" opacity="0.9" />
                      <line x1="378" y1="200" x2="390" y2="200" stroke="#00e5ff" strokeWidth="2.2" opacity="0.9" />
                    </g>

                    {/* Middle Segmented Ring: Counter-Clockwise Continuous Rotation */}
                    <g style={{ transformOrigin: "200px 200px", animation: "ringRotateCcw 18s linear infinite" }}>
                      <circle
                        cx="200"
                        cy="200"
                        r="148"
                        fill="none"
                        stroke="#00e5ff"
                        strokeWidth="1.6"
                        strokeDasharray="22 12 6 12"
                        opacity="0.8"
                        filter="url(#kushiRingGlow)"
                      />
                      <circle cx="200" cy="52" r="3" fill="#00e5ff" />
                      <circle cx="200" cy="348" r="3" fill="#00e5ff" />
                    </g>

                    {/* Inner Target Reticle Ring */}
                    <circle
                      cx="200"
                      cy="200"
                      r="108"
                      fill="none"
                      stroke="#00e5ff"
                      strokeWidth="2"
                      strokeDasharray="45 10 3 10"
                      opacity="0.9"
                      filter="url(#kushiRingGlow)"
                    />

                    {/* Radar Scanning Beam: Smooth 360-degree continuous sweep */}
                    <g style={{ transformOrigin: "200px 200px", animation: "radarSweep 5s linear infinite" }}>
                      <path d="M 200 200 L 200 16 A 184 184 0 0 1 330 68 Z" fill="url(#kushiSweepGrad)" opacity="0.5" />
                      <line x1="200" y1="200" x2="200" y2="16" stroke="#ffffff" strokeWidth="1.6" opacity="0.95" filter="url(#kushiRingGlow)" />
                    </g>

                    {/* Central Target Reticle */}
                    <circle cx="200" cy="200" r="44" fill="none" stroke="#00e5ff" strokeWidth="1.2" strokeDasharray="6 6" opacity="0.6" />
                    <circle cx="200" cy="200" r="14" fill="#00e5ff" opacity="0.75" filter="url(#kushiRingGlow)" />
                  </svg>
                </div>
              </div>

              {/* ── Kushi AMR Robot: 3D Floating / Hover Presentation ── */}
              <div
                className={`relative z-10 w-[240px] sm:w-[280px] lg:w-[310px] xl:w-[335px] aspect-square flex flex-col items-center justify-center transition-all duration-700 ${
                  showHero ? "opacity-100 scale-100" : "opacity-0 scale-[0.92]"
                }`}
                style={{
                  transitionDelay: reducedMotion ? "0ms" : "360ms",
                  animation: reducedMotion ? "none" : "kushiHover 4.2s ease-in-out infinite",
                }}
              >
                {/* Realistic Contact Floor Reflection under Kushi */}
                <div
                  className="pointer-events-none absolute -bottom-10 inset-x-0 h-28 overflow-hidden opacity-30 blur-[1px] mix-blend-screen"
                  style={{
                    transform: "scaleY(-0.45) translateY(20%)",
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 60%)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 60%)",
                  }}
                >
                  <Image
                    src="/images/vision/kushi-hero.png"
                    alt="Kushi AMR Reflection"
                    fill
                    sizes="335px"
                    className="object-contain object-bottom"
                  />
                </div>

                {/* Main Kushi Robot Visual */}
                <div className="relative w-full h-full drop-shadow-[0_16px_32px_rgba(0,229,255,0.3)]">
                  {/* Soft Periodic Cyan Light Sweep across Kushi body */}
                  <div
                    className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-lg"
                    style={{
                      maskImage: "url(/images/vision/kushi-hero.png)",
                      WebkitMaskImage: "url(/images/vision/kushi-hero.png)",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                    }}
                  >
                    <div
                      className="absolute inset-y-0 w-32 -translate-x-full"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.45) 50%, transparent 100%)",
                        animation: reducedMotion ? "none" : "kushiSheen 6s ease-in-out infinite",
                      }}
                    />
                  </div>

                  <Image
                    src="/images/vision/kushi-hero.png"
                    alt="Reddix Kushi Autonomous Mobile Robot (AMR)"
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 335px"
                    className="object-contain object-bottom transition-transform duration-500 hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Keyframes for Kushi Hover, Rings Rotation, Radar Sweep, Sheen ── */}
        <style jsx>{`
          @keyframes kushiHover {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
          }
          @keyframes ringRotateCw {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes ringRotateCcw {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(-360deg);
            }
          }
          @keyframes radarSweep {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes kushiSheen {
            0% {
              transform: translateX(-150%);
              opacity: 0;
            }
            15% {
              opacity: 0.8;
            }
            35% {
              transform: translateX(350%);
              opacity: 0;
            }
            100% {
              transform: translateX(350%);
              opacity: 0;
            }
          }
        `}</style>

        {/* ══════════════════════════════════════════════════════════════
            FOUR INFORMATION CARDS: Sequential Reveal (120ms Stagger)
           ══════════════════════════════════════════════════════════════ */}
        <div ref={cardsRef} className="mt-3.5 sm:mt-4 lg:mt-4 w-full">
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2.5 xl:gap-3 w-full">
              {VISION_CARDS_DATA.map((card, index) => {
                const IconComp = card.icon;
                const isHovered = activeCard === index;
                // Staggered reveal: initial page load (450ms, 570ms, 690ms, 810ms) vs scroll entry (60ms, 170ms, 280ms, 390ms)
                const cardDelay = initialPhase ? 450 + index * 120 : 60 + index * 110;

                return (
                  <div
                    key={card.id}
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                    className={`group relative flex flex-col justify-between transition-all duration-700 cursor-pointer w-full min-w-0 ${
                      showCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[22px]"
                    }`}
                    style={{
                      transitionDelay: reducedMotion ? "0ms" : `${cardDelay}ms`,
                      transitionTimingFunction: EASING,
                      transform: isHovered
                        ? "translateY(-4px)"
                        : showCards
                        ? "translateY(0px)"
                        : "translateY(22px)",
                    }}
                  >
                    {/* Futuristic HUD Card Container with Clipped Chamfered Corners */}
                    <div
                      className={`relative flex flex-col justify-between h-full p-2.5 sm:p-3 xl:p-3 transition-all duration-300 rounded-sm overflow-hidden ${
                        isHovered
                          ? "border-cyan-300 shadow-[0_0_18px_rgba(0,229,255,0.45),inset_0_0_10px_rgba(0,229,255,0.15)]"
                          : "border-cyan-500/40 shadow-[0_0_8px_rgba(0,229,255,0.06),inset_0_0_6px_rgba(0,229,255,0.02)]"
                      }`}
                      style={{
                        borderWidth: "1px",
                        borderStyle: "solid",
                        background:
                          "linear-gradient(180deg, rgba(3, 14, 25, 0.88) 0%, rgba(2, 8, 16, 0.94) 100%)",
                        backdropFilter: "blur(12px)",
                        clipPath:
                          "polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)",
                      }}
                    >
                      {/* Subtle cyan light sweep along card borders during reveal */}
                      <div
                        className={`pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-1000 ease-in-out opacity-25 group-hover:translate-x-full ${
                          showCards ? "translate-x-full" : "-translate-x-full"
                        }`}
                        style={{
                          transitionDelay: reducedMotion ? "0ms" : `${cardDelay + 100}ms`,
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.4) 50%, transparent 100%)",
                        }}
                      />

                      {/* Top Row: Circular Glowing Cyan Icon */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-6 w-6 sm:h-6.5 sm:w-6.5 items-center justify-center rounded-full border transition-all duration-300 shrink-0 ${
                            isHovered
                              ? "border-cyan-300 bg-cyan-950/70 text-cyan-300 shadow-[0_0_10px_#00e5ff] scale-105"
                              : "border-cyan-400/60 bg-cyan-950/30 text-cyan-400"
                          }`}
                        >
                          <IconComp className="h-3.5 w-3.5" />
                        </div>

                        {/* Small Cyan Accent Pill on top-right */}
                        <span className="block h-1.5 w-3.5 rounded-full bg-cyan-400/40 group-hover:bg-cyan-400 transition-colors duration-300 shadow-[0_0_6px_#00e5ff]" />
                      </div>

                      {/* Middle: Title & Content */}
                      <div className="mt-2 flex-1">
                        <h3
                          className={`font-mono text-[10.5px] sm:text-[11px] xl:text-[11.5px] font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                            isHovered ? "text-cyan-300" : "text-white"
                          }`}
                          style={{
                            textShadow: isHovered
                              ? "0 0 8px rgba(0, 229, 255, 0.5)"
                              : "none",
                          }}
                        >
                          {card.title}
                        </h3>

                        {card.type === "paragraph" ? (
                          <p className="mt-1 text-[8.5px] sm:text-[9px] xl:text-[9.5px] leading-[1.38] text-slate-300/90 font-sans">
                            {card.content}
                          </p>
                        ) : (
                          <ul className="mt-1 space-y-0.5 text-[8.5px] sm:text-[9px] xl:text-[9.5px] leading-tight text-slate-300/90 font-sans">
                            {card.bullets?.map((bullet, bIndex) => (
                              <li key={bIndex} className="flex items-center gap-1.5">
                                <span className="block h-1 w-1 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_4px_#00e5ff]" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Bottom Technical Accent Line */}
                      <div className="mt-2 flex items-center justify-between border-t border-cyan-500/20 pt-1">
                        <span className="h-[2px] w-6 bg-cyan-400/80 group-hover:w-10 transition-all duration-300 shadow-[0_0_6px_#00e5ff]" />
                        <span className="font-mono text-[7.5px] text-cyan-400/60 uppercase tracking-widest">
                          0{index + 1} //
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            OUR IMPACT SECTION: Wide Technical HUD-Style Panel
           ══════════════════════════════════════════════════════════════ */}
        <div ref={impactRef} className="mt-3.5 sm:mt-4 lg:mt-4">
          {(() => {
            const impactDelay = initialPhase ? 850 : 60;
            const eyebrowDelay = initialPhase ? 900 : 100;
            const headingDelay = initialPhase ? 960 : 170;
            const descDelay = initialPhase ? 1020 : 240;
            const earthDelay = initialPhase ? 940 : 140;

            return (
              <div
                className={`relative overflow-hidden border border-cyan-500/50 transition-all duration-800 shadow-[0_0_16px_rgba(0,229,255,0.12),inset_0_0_10px_rgba(0,229,255,0.03)] ${
                  showImpact ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-[20px] scale-[0.98]"
                }`}
                style={{
                  transitionDelay: reducedMotion ? "0ms" : `${impactDelay}ms`,
                  transitionTimingFunction: EASING,
                  background:
                    "linear-gradient(135deg, rgba(3, 14, 26, 0.94) 0%, rgba(2, 8, 16, 0.98) 100%)",
                  backdropFilter: "blur(12px)",
                  clipPath:
                    "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
                }}
              >
                {/* Cyan Top Corner Marker */}
                <div className="absolute top-0 right-0 h-1.5 w-8 bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />

                <div className="grid grid-cols-1 items-center gap-3 p-3 sm:p-3.5 lg:grid-cols-12 lg:gap-4 lg:p-4">
                  {/* Left Side: Eyebrow, Heading, Description */}
                  <div className="lg:col-span-5 xl:col-span-4 relative z-10">
                    {/* 1. // OUR IMPACT eyebrow */}
                    <p
                      className={`font-mono text-[9px] sm:text-[9.5px] font-bold tracking-[0.2em] uppercase text-cyan-400 mb-0.5 flex items-center gap-1.5 transition-all duration-600 ${
                        showImpact ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      }`}
                      style={{
                        transitionDelay: reducedMotion ? "0ms" : `${eyebrowDelay}ms`,
                        transitionTimingFunction: EASING,
                      }}
                    >
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
                      // OUR IMPACT
                    </p>

                    {/* 2. Heading: TECHNOLOGY THAT / CREATES REAL CHANGE */}
                    <h2
                      className={`font-mono text-sm sm:text-base lg:text-lg font-extrabold uppercase leading-[1.12] tracking-tight text-white transition-all duration-600 ${
                        showImpact ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      }`}
                      style={{
                        transitionDelay: reducedMotion ? "0ms" : `${headingDelay}ms`,
                        transitionTimingFunction: EASING,
                      }}
                    >
                      TECHNOLOGY THAT <br />
                      <span
                        className="text-cyan-400"
                        style={{
                          textShadow:
                            "0 0 14px rgba(0, 229, 255, 0.45), 0 0 25px rgba(0, 229, 255, 0.2)",
                        }}
                      >
                        CREATES REAL CHANGE
                      </span>
                    </h2>

                    {/* 3. Description */}
                    <p
                      className={`mt-1 text-[9px] sm:text-[9.5px] xl:text-[10px] leading-snug text-slate-300 font-sans max-w-sm transition-all duration-600 ${
                        showImpact ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                      }`}
                      style={{
                        transitionDelay: reducedMotion ? "0ms" : `${descDelay}ms`,
                        transitionTimingFunction: EASING,
                      }}
                    >
                      From factories and warehouses to agriculture and disaster response, our
                      robotics solutions are designed to solve real problems and improve lives — today
                      and for future generations.
                    </p>
                  </div>

                  {/* Center Area: Four Compact Impact Indicators (Sequentially Revealed) */}
                  <div className="lg:col-span-4 xl:col-span-4 relative z-10">
                    <div className="grid grid-cols-4 gap-1.5">
                      {IMPACT_INDICATORS.map((item, index) => {
                        const IconComp = item.icon;
                        const isHovered = activeIndicator === index;
                        const indDelay = initialPhase ? 1060 + index * 70 : 280 + index * 70;

                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setActiveIndicator(index)}
                            onMouseLeave={() => setActiveIndicator(null)}
                            className={`flex flex-col items-center justify-center p-1.5 rounded border transition-all duration-500 text-center cursor-pointer ${
                              showImpact ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-3"
                            } ${
                              isHovered
                                ? "border-cyan-300 bg-cyan-950/40 shadow-[0_0_10px_rgba(0,229,255,0.3)] -translate-y-0.5"
                                : "border-cyan-500/25 bg-black/40 hover:border-cyan-400/50"
                            }`}
                            style={{
                              transitionDelay: reducedMotion ? "0ms" : `${indDelay}ms`,
                              transitionTimingFunction: EASING,
                            }}
                          >
                            {/* Glowing Circular Icon */}
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                                isHovered
                                  ? "border-cyan-300 bg-cyan-900/60 text-cyan-300 shadow-[0_0_6px_#00e5ff]"
                                  : "border-cyan-400/50 bg-cyan-950/20 text-cyan-400"
                              }`}
                            >
                              <IconComp className="h-2.5 w-2.5" />
                            </div>

                            {/* Title */}
                            <span className="mt-1 font-mono text-[7.5px] sm:text-[8px] xl:text-[8.5px] font-extrabold uppercase tracking-wider text-white">
                              {item.title}
                            </span>

                            {/* Subtitle */}
                            <span className="text-[6.5px] sm:text-[7px] text-slate-400 font-sans leading-tight">
                              {item.subtitle}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Side: Realistic Earth Globe with Orbital Connection Lines & Gentle Ambient Glow */}
                  <div className="relative lg:col-span-3 xl:col-span-4 flex items-center justify-end overflow-hidden">
                    <div
                      className={`relative w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[290px] xl:max-w-[340px] aspect-[800/400] transition-all duration-900 ${
                        showImpact ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-[0.94] translate-x-4"
                      }`}
                      style={{
                        transitionDelay: reducedMotion ? "0ms" : `${earthDelay}ms`,
                        transitionTimingFunction: EASING,
                      }}
                    >
                      {/* Slow, gentle ambient cyan glow halo behind Earth */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-radial-at-c from-cyan-400/20 via-cyan-500/5 to-transparent rounded-full blur-2xl animate-pulse"
                        style={{ animationDuration: "6s" }}
                      />

                      <Image
                        src="/images/vision/impact-globe.png"
                        alt="Earth Globe with glowing cyan connection lines and network points"
                        fill
                        sizes="(max-width: 1024px) 100vw, 340px"
                        className="object-contain object-right-bottom transition-transform duration-700 hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>
  );
}
