"use client";

import React, { useRef, useState, useEffect } from "react";
import { AchievementItem } from "@/lib/content/types";
import { Trophy } from "lucide-react";

interface AchievementsSectionProps {
  achievements?: AchievementItem[];
}

export default function AchievementsSection({ achievements = [] }: AchievementsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Number of dots:
  // If > 3 items, provide dots corresponding to pages/cards (capped to 3-4 dots as in screenshot)
  const totalDots = items.length > 3 ? Math.min(items.length - 2, 4) : 1;

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

  // Update active dot on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;

    const progress = scrollLeft / maxScroll;
    const newIdx = Math.round(progress * (totalDots - 1));
    setActiveIndex(Math.min(Math.max(newIdx, 0), totalDots - 1));
  };

  const scrollToDot = (dotIdx: number) => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const targetScroll = (dotIdx / (totalDots - 1)) * maxScroll;
    scrollRef.current.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
    setActiveIndex(dotIdx);
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

        {/* ─── Cards Grid / Horizontal Scroll Snap Container ─── */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible pb-4 pt-2 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
        >
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`group relative flex flex-col justify-between rounded-xl border border-cyan-500/25 bg-[#030812]/90 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:border-cyan-400/70 hover:shadow-[0_0_28px_rgba(0,229,255,0.18)] hover:-translate-y-1 min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center shrink-0 md:shrink ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{
                transitionDelay: `${idx * 120}ms`,
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

        {/* ─── Horizontal Scroll Dots Indicator (Exact match to reference) ─── */}
        {totalDots > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 select-none">
            {Array.from({ length: totalDots }).map((_, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToDot(i)}
                  className={`h-1 rounded-full transition-all duration-300 focus:outline-none ${
                    isActive
                      ? "w-8 bg-cyan-400 shadow-[0_0_10px_#00e5ff]"
                      : "w-6 bg-zinc-800 hover:bg-zinc-700"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={isActive ? "true" : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
