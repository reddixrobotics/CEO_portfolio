"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { AchievementItem } from "@/lib/content/types";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";

interface AchievementsSectionProps {
  achievements?: AchievementItem[];
}

export default function AchievementsSection({ achievements = [] }: AchievementsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Fallback items if array is empty
  const items: AchievementItem[] =
    achievements && achievements.length > 0
      ? achievements
      : [
          {
            id: "top-robotics-innovation",
            title: "Top Autonomous Robotics Innovation Award",
            date: "OCT 2026",
            issuer: "NATIONAL ROBOTICS FORUM 2026",
            description:
              "Recognized for pioneering multi-agent autonomous navigation and real-time obstacle evasion algorithms.",
            metric: "1st Place Winner",
          },
          {
            id: "national-robotics-award",
            title: "1st Place — National Autonomous Robotics Challenge",
            date: "OCT 2023",
            issuer: "ROBOTICS INNOVATION FORUM",
            description:
              "Won 1st prize for autonomous obstacle negotiation and dynamic replanning in an unknown maze layout.",
            metric: "Rank #1 / 84 Teams",
          },
          {
            id: "open-source-contributor",
            title: "ROS 2 Navigation Ecosystem Contributor",
            date: "2024",
            issuer: "OPEN SOURCE ROBOTICS FOUNDATION",
            description:
              "Contributed bug fixes and documentation to Nav2 costmap recovery behaviors and lifecycle managers.",
            metric: "5+ Merged PRs",
          },
          {
            id: "patent-filing",
            title: "Patent Filed: Modular Tiered AMR Suspension & Swivel Mounting",
            date: "JAN 2024",
            issuer: "INTELLECTUAL PROPERTY OFFICE",
            description:
              "Novel mechanical coupling mechanism allowing rapid field replacement of sensor pods without chassis disassembly.",
            metric: "Patent Pending",
          },
        ];

  // Exactly 3 horizontal line indicators as shown in the reference image
  const TOTAL_INDICATOR_SEGMENTS = 3;
  const hasHorizontalScroll = items.length > 3;

  // Intersection observer for entrance animation
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.location.hash === "#achievements") {
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Update scroll indicators & active dash index
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);

    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }

    const progress = scrollLeft / maxScroll;
    const segment = Math.min(
      TOTAL_INDICATOR_SEGMENTS - 1,
      Math.max(0, Math.round(progress * (TOTAL_INDICATOR_SEGMENTS - 1)))
    );
    setActiveIndex(segment);
  }, []);

  useEffect(() => {
    updateScrollState();
    const handleResize = () => updateScrollState();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateScrollState]);

  // Click on a specific line indicator segment (0 = start, 1 = middle, 2 = end)
  const scrollToSegment = (segmentIdx: number) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;

    const targetLeft = (segmentIdx / (TOTAL_INDICATOR_SEGMENTS - 1)) * maxScroll;
    scrollRef.current.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
    setActiveIndex(segmentIdx);
  };

  // Scroll by 1 card width
  const scrollByDirection = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardElement = scrollRef.current.querySelector<HTMLElement>(".achievement-card");
    const cardWidth = cardElement ? cardElement.offsetWidth + 24 : 360;
    const scrollDelta = direction === "right" ? cardWidth : -cardWidth;

    scrollRef.current.scrollBy({
      left: scrollDelta,
      behavior: "smooth",
    });
  };

  // Mouse Drag to Scroll handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // Drag speed multiplier
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const onMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative min-h-screen py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-black border-t border-zinc-900 overflow-hidden w-full select-none"
    >
      {/* Background radial cyan glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,229,255,0.05),transparent)]" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* ─── Header: Exact Match to Reference UI ─── */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {/* Left Title & Milestones Badge */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-[2px] w-6 bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
              <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                OUR MILESTONES
              </span>
            </div>

            <h2 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight">
              <span className="text-white">KEY </span>
              <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.4)]">
                ACHIEVEMENTS
              </span>
            </h2>

            <p className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-zinc-500 font-medium">
              INNOVATION / RECOGNITION / IMPACT
            </p>
          </div>

          {/* Right Subtitle with Cyan Bar & Cybernetic Dot Matrix */}
          <div className="hidden md:flex items-center gap-5">
            <div className="h-10 w-[2px] bg-cyan-400 shadow-[0_0_8px_#00e5ff] shrink-0" />
            <p className="font-mono text-xs text-zinc-400 max-w-[280px] leading-relaxed">
              Building intelligent robotics solutions that create real world impact.
            </p>
            <div className="flex flex-col items-end opacity-40 select-none pl-3">
              <span className="text-cyan-400 text-sm font-mono leading-none font-bold">+</span>
              <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="h-1 w-1 rounded-full bg-cyan-400/80" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Cards Horizontal Scroll Container ─── */}
        {/* On desktop (md & lg), displays exactly 3 cards side-by-side with horizontal scroll for card 4+ */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className="flex flex-row gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] cursor-grab active:cursor-grabbing"
        >
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`achievement-card group relative flex flex-col justify-between rounded-xl border border-cyan-500/25 bg-[#030812]/90 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/70 hover:shadow-[0_0_28px_rgba(0,229,255,0.18)] hover:-translate-y-1 snap-start shrink-0 ${
                // Width sizing: exactly 3 cards fit in container on md/lg desktop
                "w-[85vw] sm:w-[calc((100%-1.5rem)/2)] md:w-[calc((100%-3rem)/3)] min-w-[290px] sm:min-w-[320px]"
              } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              {/* Cyan corner accent bracket ⌞ on bottom-left */}
              <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#00e5ff] pointer-events-none" />

              <div>
                {/* Top Row: Trophy in Glowing Cyan Rounded Badge + Date */}
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-950/30 text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.25)] transition-transform duration-300 group-hover:scale-105">
                    <Trophy className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider font-medium">
                    {item.date}
                  </span>
                </div>

                {/* Achievement Title */}
                <h3 className="mt-5 text-lg sm:text-[19px] font-bold tracking-tight text-white leading-snug group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                {/* Issuer / Category */}
                <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  {item.issuer}
                </p>

                {/* Description */}
                <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>

              {/* Metric Row */}
              {item.metric && (
                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-500 uppercase tracking-widest text-[10px]">
                    METRIC:
                  </span>
                  <span className="text-cyan-400 font-semibold tracking-wide">
                    {item.metric}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ─── Horizontal Scroll Lines Indicator (Exact match to uploaded image) ─── */}
        {hasHorizontalScroll && (
          <div className="mt-8 flex items-center justify-center gap-4 select-none">
            {/* Left Chevron (optional subtle control) */}
            <button
              type="button"
              onClick={() => scrollByDirection("left")}
              aria-label="Previous achievement"
              className={`flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-400 transition-all hover:border-cyan-500/60 hover:text-cyan-400 ${
                canScrollLeft ? "opacity-100 cursor-pointer" : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {/* Exactly the 3 horizontal line indicators from the uploaded screenshot */}
            <div className="flex items-center gap-3">
              {Array.from({ length: TOTAL_INDICATOR_SEGMENTS }).map((_, i) => {
                const isActive = activeIndex === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollToSegment(i)}
                    className={`h-[2px] w-9 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                      isActive
                        ? "bg-[#00E5FF] shadow-[0_0_12px_#00e5ff] scale-y-125"
                        : "bg-cyan-500/20 hover:bg-cyan-500/40"
                    }`}
                    aria-label={`Scroll to achievement section ${i + 1}`}
                    aria-current={isActive ? "true" : undefined}
                  />
                );
              })}
            </div>

            {/* Right Chevron */}
            <button
              type="button"
              onClick={() => scrollByDirection("right")}
              aria-label="Next achievement"
              className={`flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950/80 text-zinc-400 transition-all hover:border-cyan-500/60 hover:text-cyan-400 ${
                canScrollRight ? "opacity-100 cursor-pointer" : "opacity-30 cursor-not-allowed"
              }`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
