"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Lightbulb, Cpu, Code2, Users, Rocket, Target } from "lucide-react";

export interface MilestoneItem {
  id: string;
  date: string;
  title: string;
  description: string;
  nodeLabel: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  image?: string;
  isCustomSvg?: boolean;
}

export const MILESTONES_DATA: MilestoneItem[] = [
  {
    id: "card-idea",
    date: "2023",
    title: "THE IDEA",
    description:
      "It started with a simple question — how can we make robots more useful, affordable and accessible for real-world industries?",
    nodeLabel: "IDEA",
    icon: Lightbulb,
    isCustomSvg: true,
  },
  {
    id: "card-prototype",
    date: "EARLY 2024",
    title: "THE FIRST PROTOTYPE",
    description:
      "Built our first autonomous mobile robot using ROS 2, exploring SLAM and navigation capabilities.",
    nodeLabel: "PROTOTYPE",
    icon: Cpu,
    image: "/images/projects/autonomous-navigation-robot.png",
  },
  {
    id: "card-development",
    date: "MID 2024",
    title: "PRODUCT DEVELOPMENT",
    description:
      "Improved the robot platform, added sensor fusion, and started working on robotic manipulation systems.",
    nodeLabel: "DEVELOPMENT",
    icon: Code2,
    image: "/images/projects/robotic-manipulator.png",
  },
  {
    id: "card-team",
    date: "EARLY 2025",
    title: "TEAM & ECOSYSTEM",
    description:
      "Grew our team, built key partnerships and started exploring real-world deployment opportunities.",
    nodeLabel: "TEAM",
    icon: Users,
    image: "/images/journey/thumb-team.png",
  },
  {
    id: "card-testing",
    date: "LATE 2025",
    title: "REAL-WORLD TESTING",
    description:
      "Deployed prototypes in real environments, validated performance and gathered valuable feedback.",
    nodeLabel: "TESTING",
    icon: Rocket,
    image: "/images/journey/thumb-testing.png",
  },
  {
    id: "card-scaling",
    date: "2026+",
    title: "SCALING FOR IMPACT",
    description:
      "Expanding our product lineup, working with industry partners and building a future of intelligent, autonomous systems.",
    nodeLabel: "GROWTH",
    icon: Target,
    image: "/images/projects/autonomous-drone.png",
  },
];

interface StartupJourneySectionProps {
  standalone?: boolean;
}

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export default function StartupJourneySection({ standalone = false }: StartupJourneySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [hasMounted, setHasMounted] = useState(false);
  const [initialPhase, setInitialPhase] = useState(true);
  const [heroInView, setHeroInView] = useState(false);
  const [cardsInView, setCardsInView] = useState(false);
  const [bottomInView, setBottomInView] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }

    const mountTimer = setTimeout(() => {
      setHasMounted(true);
    }, 60);

    const initialTimer = setTimeout(() => {
      setInitialPhase(false);
    }, 1800);

    // If standalone (/journey route), initialize visibility for the entrance choreography
    if (standalone) {
      setHeroInView(true);
      setCardsInView(true);
      setBottomInView(true);
    }

    // Set up dedicated IntersectionObservers for Hero, Cards, and Bottom sections
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
    const bottomObs = createObserver(setBottomInView, 0.1, "0px 0px -40px 0px");

    const heroEl = heroRef.current;
    const cardsEl = cardsRef.current;
    const bottomEl = bottomRef.current;

    if (heroEl) heroObs.observe(heroEl);
    if (cardsEl) cardsObs.observe(cardsEl);
    if (bottomEl) bottomObs.observe(bottomEl);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(initialTimer);
      heroObs.disconnect();
      cardsObs.disconnect();
      bottomObs.disconnect();
    };
  }, [standalone]);

  const showHero = heroInView || reducedMotion;
  const showCards = cardsInView || reducedMotion;
  const showBottom = bottomInView || reducedMotion;

  return (
    <section
      ref={sectionRef}
      id="journey"
      className={`relative w-full overflow-hidden bg-black text-white scroll-mt-20 sm:scroll-mt-24 ${
        standalone
          ? "min-h-screen pt-20 pb-12 sm:pt-24 sm:pb-16"
          : "pt-14 pb-10 sm:pt-16 sm:pb-12 lg:pt-16 lg:pb-12"
      }`}
      style={{
        background: `
          radial-gradient(ellipse 70% 45% at 75% 15%, rgba(0, 229, 255, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 25% 75%, rgba(0, 180, 216, 0.06) 0%, transparent 50%),
          #02060b
        `,
      }}
    >
      {/* Anchor for backward compatibility with #career with scroll offset */}
      <div id="career" className="sr-only scroll-mt-20 sm:scroll-mt-20" aria-hidden="true" />

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
          style={{ right: "14%", boxShadow: "0 0 25px 2px #00e5ff" }}
        />
        <span
          className="absolute top-12 block h-80 w-0.5 bg-cyan-400/30 blur-[1px]"
          style={{ right: "18%", boxShadow: "0 0 20px 2px #00e5ff" }}
        />
        <span
          className="absolute top-4 block h-72 w-0.5 bg-cyan-400/15 blur-[2px]"
          style={{ left: "10%", boxShadow: "0 0 20px 1px #00e5ff" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1550px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* ══════════════════════════════════════════════════════════════
            HERO SECTION: Top Row (Heading Left, Hero Robot Right)
           ══════════════════════════════════════════════════════════════ */}
        {/* ══════════════════════════════════════════════════════════════
            HERO SECTION: Top Row (Heading Left, Hero Robot Right)
           ══════════════════════════════════════════════════════════════ */}
        <div ref={heroRef} className="relative grid grid-cols-1 items-center gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-6">
          {/* Left Column: Heading & Description */}
          <div className="lg:col-span-7 xl:col-span-7">
            {/* Eyebrow */}
            <p
              className={`font-mono text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-cyan-400 mb-1.5 sm:mb-2 flex items-center gap-2 transition-all duration-600 ${
                showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : "60ms",
                transitionTimingFunction: EASING,
              }}
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse" />
              // OUR JOURNEY
            </p>

            {/* Main Title: BUILDING / REDDIX ROBOTICS (bright cyan) / STEP BY STEP */}
            <h1 className="font-mono text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold uppercase leading-[1.08] tracking-tight text-white">
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
                  BUILDING
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
                    textShadow: "0 0 22px rgba(0, 229, 255, 0.45), 0 0 40px rgba(0, 229, 255, 0.2)",
                  }}
                >
                  REDDIX ROBOTICS
                </span>
              </span>
              <span className="block overflow-hidden pb-0.5">
                <span
                  className={`block transition-all duration-700 ${
                    showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
                  }`}
                  style={{
                    transitionDelay: reducedMotion ? "0ms" : "300ms",
                    transitionTimingFunction: EASING,
                  }}
                >
                  STEP BY STEP
                </span>
              </span>
            </h1>

            {/* Description */}
            <p
              className={`mt-2.5 sm:mt-3 max-w-lg text-[11.5px] sm:text-xs xl:text-sm leading-relaxed text-slate-300 transition-all duration-700 ${
                showHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : "380ms",
                transitionTimingFunction: EASING,
              }}
            >
              From a simple idea to a growing robotics startup — our journey is about learning,
              building, and creating real-world impact through innovation.
            </p>
          </div>

          {/* Right Column: Hero Autonomous Mobile Robot + Cursive Tagline (balanced position) */}
          <div className="relative flex items-center justify-center lg:justify-end lg:col-span-5 xl:col-span-5 lg:pr-8 xl:pr-14">
            {/* Handwritten-style Cyan Tagline: Small Steps. Big Impact. */}
            <div
              className={`absolute -top-1 sm:-top-2 lg:-top-3 -left-3 sm:-left-1 lg:-left-6 z-20 select-none -rotate-[6deg] pointer-events-none transition-all duration-700 ${
                showHero ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-2"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : "420ms",
                transitionTimingFunction: EASING,
                filter: "drop-shadow(0 0 8px rgba(0, 229, 255, 0.75))",
              }}
            >
              <span
                className="font-script block text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-400 tracking-wide whitespace-nowrap"
                style={{ lineHeight: 1.1 }}
              >
                Small Steps. <br />
                Big Impact.
              </span>
            </div>

            {/* Real Kushi Prototype Autonomous Mobile Robot */}
            <div
              className={`relative w-full max-w-[190px] sm:max-w-[220px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[300px] 2xl:max-w-[330px] aspect-square flex items-center justify-center transition-all duration-800 ${
                showHero ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.94] translate-y-4"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : "340ms",
                transitionTimingFunction: EASING,
              }}
            >
              {/* Subtle Cyan Light Sweep across robot */}
              <div
                className={`pointer-events-none absolute inset-0 z-10 transition-transform duration-1000 ease-in-out ${
                  showHero ? "translate-x-full" : "-translate-x-full"
                }`}
                style={{
                  transitionDelay: reducedMotion ? "0ms" : "460ms",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.25) 50%, transparent 100%)",
                }}
              />

              <div
                className="absolute inset-0 bg-radial-at-c from-cyan-500/20 via-cyan-500/5 to-transparent pointer-events-none rounded-full blur-xl"
                style={{ transform: "scale(1.1)" }}
              />
              <div className="relative w-full h-full drop-shadow-[0_12px_24px_rgba(0,229,255,0.22)]">
                <Image
                  src="/images/journey/kushi-robot.png"
                  alt="Kushi Autonomous Mobile Robot"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 330px"
                  className="object-contain object-center transition-transform duration-500 hover:scale-[1.04]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            SIX STARTUP MILESTONE CARDS + TIMELINE: Responsive Track / Grid
           ══════════════════════════════════════════════════════════════ */}
        <div ref={cardsRef} className="mt-4 sm:mt-5 lg:mt-6 w-full">
          <div className="w-full">
            {/* 6 Cards: Responsive Grid (1-col on mobile, 2-col on sm, 3-col on tablet, 6-col on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-2.5 lg:gap-2 xl:gap-2.5 w-full">
              {MILESTONES_DATA.map((item, index) => {
                const IconComp = item.icon;
                const isHovered = activeCard === index;
                const cardDelay = initialPhase ? 380 + index * 90 : 60 + index * 80;

                return (
                  <div
                    key={item.id}
                    onMouseEnter={() => setActiveCard(index)}
                    onMouseLeave={() => setActiveCard(null)}
                    className={`group relative flex flex-col justify-between transition-all duration-700 cursor-pointer w-full min-w-0 ${
                      showCards ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                    }`}
                    style={{
                      transitionDelay: reducedMotion ? "0ms" : `${cardDelay}ms`,
                      transitionTimingFunction: EASING,
                      transform: isHovered
                        ? "translateY(-3px)"
                        : showCards
                        ? "translateY(0px)"
                        : "translateY(20px)",
                    }}
                  >
                    {/* Futuristic HUD Card Container with Clipped Chamfered Corners */}
                    <div
                      className={`relative flex flex-col justify-between h-full p-2 sm:p-2.5 xl:p-2.5 transition-all duration-300 rounded-sm overflow-hidden ${
                        isHovered
                          ? "border-cyan-300 shadow-[0_0_16px_rgba(0,229,255,0.4),inset_0_0_10px_rgba(0,229,255,0.1)]"
                          : "border-cyan-500/40 shadow-[0_0_8px_rgba(0,229,255,0.06),inset_0_0_6px_rgba(0,229,255,0.02)]"
                      }`}
                      style={{
                        borderWidth: "1px",
                        borderStyle: "solid",
                        background: "linear-gradient(180deg, rgba(3, 14, 25, 0.88) 0%, rgba(2, 8, 16, 0.94) 100%)",
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
                            "linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.18) 50%, transparent 100%)",
                        }}
                      />

                      {/* Top Row: Left Icon Pill + Date | Right Visual Thumbnail */}
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          {/* Glowing Circular Icon Pill */}
                          <div
                            className={`flex h-5 w-5 sm:h-5.5 sm:w-5.5 items-center justify-center rounded-full border transition-all duration-300 shrink-0 ${
                              isHovered
                                ? "border-cyan-300 bg-cyan-950/60 text-cyan-300 shadow-[0_0_8px_#00e5ff]"
                                : "border-cyan-400/60 bg-cyan-950/30 text-cyan-400"
                            }`}
                          >
                            <IconComp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </div>

                          {/* Date Label */}
                          <span className="font-mono text-[8.5px] sm:text-[9px] xl:text-[9.5px] font-bold tracking-wider uppercase text-cyan-400">
                            {item.date}
                          </span>
                        </div>

                        {/* Right Visual Graphic / Thumbnail Preview */}
                        <div className="relative h-6 w-8 sm:h-7 sm:w-9 shrink-0 overflow-hidden rounded bg-black/40 border border-cyan-500/30 flex items-center justify-center">
                          {item.isCustomSvg ? (
                            /* Glowing Ideation Lightbulb for Card 1 */
                            <div className="relative flex items-center justify-center w-full h-full">
                              <Lightbulb
                                className="h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
                                style={{
                                  filter: "drop-shadow(0 0 5px #00e5ff)",
                                }}
                              />
                              <span className="absolute h-5 w-5 rounded-full bg-cyan-400/20 blur-sm pointer-events-none" />
                            </div>
                          ) : item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="36px"
                              className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : null}
                        </div>
                      </div>

                      {/* Middle: Title & Description */}
                      <div className="mt-1.5 sm:mt-2 flex-1">
                        <h3
                          className={`font-mono text-[9.5px] sm:text-[10px] xl:text-[11px] font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                            isHovered ? "text-cyan-300" : "text-white"
                          }`}
                          style={{
                            textShadow: isHovered ? "0 0 8px rgba(0, 229, 255, 0.5)" : "none",
                          }}
                        >
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[8.5px] sm:text-[9px] xl:text-[9.5px] leading-[1.38] text-slate-300/90 font-sans line-clamp-3 sm:line-clamp-4">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Technical Accent Notches */}
                      <div className="mt-1.5 sm:mt-2 flex items-center justify-between border-t border-cyan-500/20 pt-1">
                        <span className="font-mono text-[7.5px] sm:text-[8px] xl:text-[8.5px] text-cyan-400/80 tracking-widest uppercase">
                          PHASE 0{index + 1} // {item.nodeLabel}
                        </span>
                        <span className="block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continuous Horizontal Glowing Cyan Bar spanning across cards (desktop) */}
            <div className="hidden lg:block relative mt-3 sm:mt-3.5 w-full">
              <div className="relative flex items-center w-full">
                <div
                  className={`h-[2px] w-full bg-cyan-400 origin-left transition-all duration-800 ${
                    showCards ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                  }`}
                  style={{
                    transitionDelay: reducedMotion ? "0ms" : (initialPhase ? "450ms" : "120ms"),
                    transitionTimingFunction: EASING,
                    boxShadow: "0 0 8px #00e5ff, 0 0 16px rgba(0, 229, 255, 0.5)",
                  }}
                />
                {/* Sleek Arrowhead at Far Right */}
                <div
                  className={`shrink-0 -ml-1 text-cyan-400 transition-all duration-500 ${
                    showCards ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  }`}
                  style={{
                    transitionDelay: reducedMotion ? "0ms" : (initialPhase ? "950ms" : "550ms"),
                    transitionTimingFunction: EASING,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 1L10 6L2 11"
                      stroke="#00e5ff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ filter: "drop-shadow(0 0 6px #00e5ff)" }}
                    />
                  </svg>
                </div>
              </div>

              {/* 6 Circular Cyan Nodes Aligned Beneath Cards */}
              <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 grid grid-cols-6 px-0">
                {MILESTONES_DATA.map((item, index) => {
                  const isHovered = activeCard === index;
                  const nodeDelay = initialPhase ? 480 + index * 85 : 140 + index * 75;

                  return (
                    <div
                      key={`node-${item.id}`}
                      onMouseEnter={() => setActiveCard(index)}
                      onMouseLeave={() => setActiveCard(null)}
                      className={`flex flex-col items-center justify-center cursor-pointer group transition-all duration-500 ${
                        showCards ? "opacity-100 scale-100" : "opacity-0 scale-50"
                      }`}
                      style={{
                        transitionDelay: reducedMotion ? "0ms" : `${nodeDelay}ms`,
                        transitionTimingFunction: EASING,
                      }}
                    >
                      {/* Glowing Double-Ring Node */}
                      <div
                        className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                          isHovered
                            ? "h-4 w-4 sm:h-4.5 sm:w-4.5 border-2 border-cyan-200 bg-cyan-950 shadow-[0_0_12px_#00e5ff]"
                            : "h-3.5 w-3.5 sm:h-4 sm:w-4 border border-cyan-400 bg-black/90 shadow-[0_0_8px_#00e5ff]"
                        }`}
                      >
                        {/* Inner Solid Cyan Dot */}
                        <span
                          className={`block rounded-full bg-cyan-400 transition-all duration-300 ${
                            isHovered ? "h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white shadow-[0_0_6px_#ffffff]" : "h-1 w-1 sm:h-1.5 sm:w-1.5"
                          }`}
                        />
                      </div>

                      {/* Node Text Label: IDEA, PROTOTYPE, DEVELOPMENT, etc. */}
                      <span
                        className={`mt-1 font-mono text-[8px] sm:text-[9px] xl:text-[9.5px] font-bold tracking-[0.16em] uppercase transition-all duration-300 ${
                          isHovered
                            ? "text-white drop-shadow-[0_0_6px_#00e5ff]"
                            : "text-cyan-400/90"
                        }`}
                      >
                        {item.nodeLabel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            BOTTOM SECTION: Technical HUD Panel (Left) & Workspace (Right)
           ══════════════════════════════════════════════════════════════ */}
        <div ref={bottomRef} className="mt-4 sm:mt-5 lg:mt-6 grid grid-cols-1 items-end gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Lower Left: Wide Technical HUD Panel */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div
              className={`relative p-3.5 sm:p-4 lg:p-4 xl:p-5 border border-cyan-500/50 transition-all duration-700 shadow-[0_0_16px_rgba(0,229,255,0.12),inset_0_0_10px_rgba(0,229,255,0.03)] ${
                showBottom ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-[0.98]"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : (initialPhase ? "800ms" : "100ms"),
                transitionTimingFunction: EASING,
                background: "linear-gradient(135deg, rgba(3, 14, 26, 0.92) 0%, rgba(2, 8, 16, 0.96) 100%)",
                backdropFilter: "blur(10px)",
                clipPath:
                  "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
              }}
            >
              {/* Cyan Top Corner Marker */}
              <div className="absolute top-0 right-0 h-1.5 w-8 bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />

              <h2
                className="font-mono text-xs sm:text-sm xl:text-base font-extrabold uppercase tracking-[0.16em] text-cyan-400"
                style={{
                  textShadow: "0 0 12px rgba(0, 229, 255, 0.4)",
                }}
              >
                THE JOURNEY CONTINUES
              </h2>

              <p className="mt-1.5 sm:mt-2 text-[10.5px] sm:text-[11.5px] xl:text-xs leading-relaxed text-slate-200/90 font-sans">
                With every milestone, we move closer to a future where robots solve real problems,
                create opportunities and make a positive impact across industries and communities.
              </p>

              {/* Technical Indicator Footer */}
              <div className="mt-2.5 sm:mt-3 flex items-center gap-3 pt-2 border-t border-cyan-500/20 font-mono text-[8.5px] sm:text-[9px] text-cyan-400/80 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  STATUS: SCALING PHASE
                </span>
                <span>//</span>
                <span>EXPEDITION 2026+</span>
              </div>
            </div>
          </div>

          {/* Lower Right: Robotics Engineering Workspace Desk */}
          <div className="relative lg:col-span-6 xl:col-span-6 flex justify-end">
            <div
              className={`relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] xl:max-w-[480px] aspect-[16/7] overflow-hidden rounded-md transition-all duration-800 ${
                showBottom ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-[0.95] translate-y-4"
              }`}
              style={{
                transitionDelay: reducedMotion ? "0ms" : (initialPhase ? "920ms" : "220ms"),
                transitionTimingFunction: EASING,
              }}
            >
              <Image
                src="/images/journey/workspace-desk.png"
                alt="Robotics Engineering Workspace with Robot CAD Laptop and Manipulator"
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-contain object-bottom transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
