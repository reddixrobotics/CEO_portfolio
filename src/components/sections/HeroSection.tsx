"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RobotCanvas from "@/components/3d/RobotCanvas";
import StatusHud from "@/components/ui/StatusHud";
import HeroTextTelemetry from "@/components/ui/HeroTextTelemetry";
import { HeroContent } from "@/lib/content/types";

interface HeroSectionProps {
  hero: HeroContent;
  hideCanvas?: boolean;
}

export default function HeroSection({ hero, hideCanvas = false }: HeroSectionProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={heroRef}
      className={`relative flex h-screen min-h-screen w-full overflow-hidden ${hideCanvas ? 'bg-transparent' : 'bg-black'}`}
    >
      {/* ─── 3D Robot Canvas fills the entire background ─── */}
      {!hideCanvas && (
        <div className="pointer-events-none absolute inset-0 z-[2]">
          <div className="pointer-events-auto relative h-full w-full">
            <RobotCanvas />
          </div>
        </div>
      )}

      {/* ─── Status HUD: top-left, below navbar ─── */}
      <div className="absolute left-4 right-4 sm:left-8 sm:right-auto lg:left-12 z-20 top-14 sm:top-16 lg:top-20 max-w-full">
        <StatusHud
          location="REDDIX LABS"
          timezone={hero.hudTimezone || "GMT+5:30"}
          statusWords={["SLAM MAPPING", "AUTONOMOUS", "SYSTEM NOMINAL"]}
        />
      </div>

      {/* ─── Top-right tagline (visible on large screens) ─── */}
      <div
        className="absolute z-20 hidden text-right font-mono uppercase lg:block"
        style={{ right: "2.5rem", top: "5rem" }}
      >
        <span className="block text-white font-semibold" style={{ fontSize: "0.6rem", letterSpacing: "0.22em" }}>
          {hero.taglinePrimary || "BUILDING AUTONOMOUS SYSTEMS"}
        </span>
        <span className="block text-zinc-500" style={{ fontSize: "0.6rem", letterSpacing: "0.15em" }}>
          {hero.taglineSecondary || "FROM ALGORITHMS TO HARDWARE"}
        </span>
      </div>

      {/* ─── Corner targeting reticles around the robot (Desktop only) ─── */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden select-none xl:block">
        <span
          className="absolute font-mono text-sm leading-none text-cyan-400"
          style={{ left: "55.5%", top: "30%", opacity: 0.85 }}
        >
          ┌
        </span>
        <span
          className="absolute font-mono text-sm leading-none text-cyan-400"
          style={{ right: "20.5%", top: "33%", opacity: 0.85 }}
        >
          ┐
        </span>
        <span
          className="absolute font-mono text-sm leading-none text-cyan-400"
          style={{ right: "14.5%", top: "66%", opacity: 0.85 }}
        >
          ┘
        </span>
        <span
          className="absolute font-mono text-[11px] leading-none text-cyan-400"
          style={{ right: "18.5%", top: "34%", opacity: 0.9 }}
        >
          +
        </span>
        <span className="absolute block h-2 w-2 border border-zinc-700/40" style={{ left: "14%", top: "25%" }} />
        <span className="absolute block h-2 w-2 border border-zinc-700/40" style={{ left: "30%", top: "16%" }} />
        <span className="absolute block h-1.5 w-1.5 border border-zinc-700/30" style={{ right: "10%", top: "20%" }} />
        <span className="absolute block h-1.5 w-1.5 border border-zinc-700/30" style={{ right: "4%", top: "60%" }} />
      </div>

      {/* ─── Technical HUD: | LiDAR / SLAM / NAVIGATION / ROS 2 (Visible on mobile & desktop) ─── */}
      <div
        className="pointer-events-none absolute z-20 select-none block right-3 sm:right-6 lg:right-[3.5%] top-[50%] sm:top-[44%] lg:top-[32%]"
      >
        <div
          className="border-l-2 border-cyan-400 pl-2 sm:pl-2.5 font-mono uppercase"
          style={{
            fontSize: "clamp(8.5px, 2.2vw, 10px)",
            letterSpacing: "0.18em",
            lineHeight: "1.8",
          }}
        >
          <p className="text-zinc-500">LiDAR</p>
          <p className="font-bold text-cyan-300" style={{ textShadow: "0 0 10px rgba(0,229,255,0.8)" }}>
            SLAM
          </p>
          <p className="text-zinc-500">Navigation</p>
          <p className="text-zinc-600">ROS 2</p>
        </div>
      </div>

      {/* ─── Main hero text block — left half with Cyber Matrix Decode & Telemetry Animations ─── */}
      <div
        className="absolute z-20 left-4 right-4 sm:left-8 sm:right-auto lg:left-12 top-[4.8rem] sm:top-24 md:top-28 lg:top-36 max-w-full sm:max-w-md md:max-w-lg lg:max-w-[44rem] min-w-0"
      >
        <HeroTextTelemetry
          eyebrow={hero.eyebrow || "/ REDDIX ROBOTICS • CEO"}
          line1="RAJA RAJESHWAR"
          line2="REDDY PATURI"
          subtitle={hero.subtitle || "ROBOTICS / AI / AUTONOMOUS SYSTEMS"}
          ctaLabel="EXPLORE MY WORK"
          ctaLink="/#about"
        />
      </div>

      {/* ─── Mobile Explore My Work CTA Button (Positioned Below 3D Robot Scene as in Reference) ─── */}
      <div className="absolute z-20 left-4 right-4 bottom-16 sm:bottom-20 flex justify-center lg:hidden">
        <Link
          href="/#about"
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
          className="group relative inline-flex w-full max-w-sm sm:max-w-md min-h-[46px] items-center justify-between overflow-hidden rounded-[2px] border border-cyan-400/80 bg-black/95 px-5 py-3 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_18px_rgba(0,229,255,0.22)] transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-950/40 hover:shadow-[0_0_26px_rgba(0,229,255,0.35)] active:scale-[0.98]"
        >
          {/* Subtle scanning light streak */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-[linear-gradient(90deg,transparent,rgba(0,229,255,0.35),transparent)]" />
          <span className="absolute inset-[1px] rounded-[1px] bg-[#020508]" />
          <span className="relative z-10 whitespace-nowrap transition-colors group-hover:text-cyan-200">
            EXPLORE MY WORK
          </span>
          <span className="relative z-10 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-cyan-300 drop-shadow-[0_0_6px_#00e5ff] shrink-0 font-sans text-sm font-black">
            →
          </span>
        </Link>
      </div>

      {/* ─── Bottom-left: circular N logo (Hidden on mobile) ─── */}
      <div className="absolute bottom-6 left-6 z-20 hidden md:block">
        <div
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-zinc-700 bg-black/70 font-mono text-[11px] font-bold text-zinc-400 backdrop-blur-sm transition-colors hover:border-zinc-500 hover:text-white"
        >
          N
        </div>
      </div>

      {/* ─── Bottom-right: "Get in touch" pill (min-h 44px touch-friendly) ─── */}
      <div className="absolute z-20 bottom-4 right-4 sm:bottom-6 sm:right-8">
        <Link
          href={hero.ctaLink || "#about"}
          className="flex min-h-[44px] items-center gap-2.5 rounded-full bg-white px-4 py-2 sm:px-5 sm:py-2.5 font-bold text-black text-xs transition-all hover:bg-zinc-100 shadow-[0_0_24px_rgba(255,255,255,0.2)] select-none"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shrink-0">
            <ArrowRight className="h-3 w-3" />
          </div>
          <span className="whitespace-nowrap">{hero.ctaLabel || "Get in touch"}</span>
        </Link>
      </div>
    </section>
  );
}
