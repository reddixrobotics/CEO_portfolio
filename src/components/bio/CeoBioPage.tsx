"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Code2, Cpu, Cog } from "lucide-react";
import Navbar from "@/components/site/Navbar";
import PixelPortrait from "@/components/ui/PixelPortrait";

/**
 * Animated Cybernetic Floor Grid for the CEO Bio page
 * Canvas-based perspective grid with neon laser pulses & horizon fade
 */
function PerspectiveGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Speed streaks traveling along perspective lines
    const streaks: {
      lane: number;
      dist: number;
      speed: number;
      len: number;
      brightness: number;
    }[] = [];

    const totalLanes = 28;
    for (let i = 0; i < 35; i++) {
      streaks.push({
        lane: Math.floor(Math.random() * totalLanes),
        dist: Math.random(),
        speed: 0.15 + Math.random() * 0.25,
        len: 0.08 + Math.random() * 0.16,
        brightness: 0.6 + Math.random() * 0.4,
      });
    }

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (width <= 0 || height <= 0 || !Number.isFinite(width) || !Number.isFinite(height)) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const vanX = width * 0.52;
      const vanY = height * 0.74; // Horizon level at lower section
      const bottomY = height;

      // 1. Perspective Longitudinal Lines
      ctx.lineWidth = 1;
      const spread = width * 1.35;

      for (let i = 0; i <= totalLanes; i++) {
        const u = i / totalLanes;
        const bottomX = width * 0.5 + (u - 0.5) * spread;

        if (
          !Number.isFinite(bottomX) ||
          !Number.isFinite(bottomY) ||
          !Number.isFinite(vanX) ||
          !Number.isFinite(vanY)
        ) {
          continue;
        }

        // Gradient from bright cyan at bottom to deep blue/black near horizon
        const grad = ctx.createLinearGradient(bottomX, bottomY, vanX, vanY);
        grad.addColorStop(0.0, "rgba(0, 217, 255, 0.45)");
        grad.addColorStop(0.4, "rgba(0, 180, 255, 0.22)");
        grad.addColorStop(0.85, "rgba(0, 80, 160, 0.05)");
        grad.addColorStop(1.0, "rgba(3, 6, 6, 0.0)");

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(bottomX, bottomY);
        ctx.lineTo(vanX, vanY);
        ctx.stroke();
      }

      // 2. Transverse Horizontal Grid Rungs
      const rungCount = 18;
      for (let j = 1; j <= rungCount; j++) {
        const progress = Math.pow(j / rungCount, 2.2);
        const y = vanY + progress * (bottomY - vanY);
        const halfW = (spread * 0.5) * progress;

        const leftX = width * 0.5 - halfW;
        const rightX = width * 0.5 + halfW;

        if (!Number.isFinite(leftX) || !Number.isFinite(rightX) || !Number.isFinite(y)) {
          continue;
        }

        const alpha = Math.min(0.35, progress * 0.5);
        ctx.strokeStyle = `rgba(0, 217, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.stroke();
      }

      // 3. Glowing Laser Streaks along perspective lanes
      for (const s of streaks) {
        s.dist += dt * s.speed;
        if (s.dist > 1.0) {
          s.dist = 0;
          s.lane = Math.floor(Math.random() * totalLanes);
        }

        const u = s.lane / totalLanes;
        const bottomX = width * 0.5 + (u - 0.5) * spread;

        // Head position
        const tHead = Math.pow(Math.min(1.0, s.dist), 2.2);
        const headX = vanX + (bottomX - vanX) * tHead;
        const headY = vanY + (bottomY - vanY) * tHead;

        // Tail position
        const tTail = Math.pow(Math.max(0.0, s.dist - s.len), 2.2);
        const tailX = vanX + (bottomX - vanX) * tTail;
        const tailY = vanY + (bottomY - vanY) * tTail;

        if (
          !Number.isFinite(tailX) ||
          !Number.isFinite(tailY) ||
          !Number.isFinite(headX) ||
          !Number.isFinite(headY) ||
          (Math.abs(tailX - headX) < 0.5 && Math.abs(tailY - headY) < 0.5)
        ) {
          continue;
        }

        const streakGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        const alpha = s.brightness * Math.sin(s.dist * Math.PI);
        streakGrad.addColorStop(0.0, "rgba(0, 150, 255, 0.0)");
        streakGrad.addColorStop(0.6, `rgba(0, 217, 255, ${alpha * 0.8})`);
        streakGrad.addColorStop(1.0, `rgba(255, 255, 255, ${alpha})`);

        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();
      }

      // 4. Soft Cyan Ambient Pools under Portrait and Floor
      const rx = width * 0.28;
      const ry = height * 0.88;
      const rRad = width * 0.35;
      if (Number.isFinite(rx) && Number.isFinite(ry) && Number.isFinite(rRad) && rRad > 0) {
        const glowGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, rRad);
        glowGrad.addColorStop(0.0, "rgba(0, 217, 255, 0.16)");
        glowGrad.addColorStop(0.5, "rgba(0, 140, 220, 0.06)");
        glowGrad.addColorStop(1.0, "rgba(3, 6, 6, 0.0)");
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}

export default function CeoBioPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full select-none overflow-x-hidden bg-[#030606] font-mono text-[#F5F7FA]">
      {/* ─── Cybernetic Animated Perspective Floor Grid ─── */}
      <PerspectiveGridCanvas />

      {/* ─── Subtle Ambient Background Vignette & Fog ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 30%, transparent 40%, rgba(3,6,6,0.75) 75%, #030606 100%)",
        }}
      />

      {/* ─── Floating Cyan Particles / Dust Specks ─── */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <span
          className="absolute block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse"
          style={{ left: "12%", top: "35%", animationDuration: "3s" }}
        />
        <span
          className="absolute block h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#00e5ff] animate-pulse"
          style={{ left: "38%", top: "58%", animationDuration: "4.5s" }}
        />
        <span
          className="absolute block h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff] animate-pulse"
          style={{ left: "75%", top: "25%", animationDuration: "3.5s" }}
        />
        <span
          className="absolute block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse"
          style={{ left: "88%", top: "62%", animationDuration: "5s" }}
        />
      </div>

      {/* ─── Unified Website Navigation Header (CAREER, ABOUT, >>, PROJECTS, ACHIEVEMENTS, ADMIN) ─── */}
      <Navbar />

      {/* ─── MAIN CONTENT: THREE-SECTION / TWO-COLUMN HERO COMPOSITION ─── */}
      <main className="relative z-20 mx-auto max-w-7xl px-6 pt-32 pb-16 sm:px-10 lg:px-14 lg:pt-36">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* ════════ LEFT COLUMN: DIGITAL CEO PORTRAIT (lg: col-span-5) ════════ */}
          <div className="relative flex flex-col items-center lg:col-span-5 lg:items-start">
            <div className="relative w-full max-w-[430px]">
              {/* Holographic Portrait Container with Interactive Pixel & Biometric Scan Animation */}
              <PixelPortrait
                src="/images/ceo-portrait-clean.png"
                alt="Raja Rajeshwar Reddy Paturi — Founder & CEO of Reddix Robotics"
                width={450}
                height={450}
                priority
                className="w-full"
              />
            </div>
          </div>

          {/* ════════ CENTER COLUMN: BIOGRAPHY (lg: col-span-4 xl:col-span-4) ════════ */}
          <div className="flex flex-col justify-center lg:col-span-4 xl:col-span-4">
            {/* Cyan Role Callout */}
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-400">
              / CEO &amp; FOUNDER
            </p>

            {/* Name Heading (White + Steel Blue) */}
            <div className="mt-2 select-none">
              <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl xl:text-5xl">
                RAJA RAJESHWAR
              </h1>
              <h2 className="mt-0.5 text-3xl font-black uppercase tracking-tight text-[#7898BC] sm:text-4xl xl:text-5xl">
                REDDY PATURI
              </h2>
              {/* Short Cyan Underline Bar */}
              <div className="mt-3 h-[3px] w-16 bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
            </div>

            {/* ABOUT ME Heading */}
            <h3 className="mt-8 text-sm font-bold uppercase tracking-[0.20em] text-white">
              ABOUT ME
            </h3>

            {/* Biography Text Paragraphs */}
            <div className="mt-4 space-y-4 font-mono text-[13px] leading-[1.8] text-[#A8BED5]">
              <p>
                I&apos;m Raja Rajeshwar Reddy Paturi, the Founder &amp; CEO of
                Reddix Robotics.
              </p>
              <p>
                I&apos;m passionate about building intelligent autonomous systems
                that can perceive, decide and act in the real world. My work
                focuses on robotics, AI, SLAM, and navigation, with a strong
                interest in creating practical solutions for real-world
                deployment.
              </p>
              <p>
                I believe in the power of technology to solve meaningful
                problems and am committed to building systems that bridge the gap
                between research and real-world impact.
              </p>
            </div>

          </div>

          {/* ════════ RIGHT SIDEBAR: TECHNICAL EXPERTISE (lg: col-span-3 xl:col-span-3) ════════ */}
          <div className="mt-4 border-t border-cyan-500/25 pt-8 lg:mt-0 lg:col-span-3 lg:border-t-0 lg:border-l lg:pl-8 xl:col-span-3">
            <div className="flex flex-col justify-center space-y-9 sm:space-y-11">
              {/* 01 — ROBOTICS & AI */}
              <div className="group flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-cyan-400/40 bg-cyan-950/20 text-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.12)] transition-colors group-hover:border-cyan-300 group-hover:shadow-[0_0_16px_#00e5ff]">
                  <Code2 className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-cyan-400 transition-colors group-hover:text-cyan-300">
                    ROBOTICS &amp; AI
                  </h4>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#A8BED5]">
                    Intelligent systems for real-world impact.
                  </p>
                </div>
              </div>

              {/* 02 — AUTONOMOUS SYSTEMS */}
              <div className="group flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-cyan-400/40 bg-cyan-950/20 text-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.12)] transition-colors group-hover:border-cyan-300 group-hover:shadow-[0_0_16px_#00e5ff]">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-cyan-400 transition-colors group-hover:text-cyan-300">
                    AUTONOMOUS SYSTEMS
                  </h4>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#A8BED5]">
                    Perception, navigation and decision making.
                  </p>
                </div>
              </div>

              {/* 03 — HARDWARE INTEGRATION */}
              <div className="group flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-cyan-400/40 bg-cyan-950/20 text-cyan-400 shadow-[0_0_12px_rgba(0,217,255,0.12)] transition-colors group-hover:border-cyan-300 group-hover:shadow-[0_0_16px_#00e5ff]">
                  <Cog className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-cyan-400 transition-colors group-hover:text-cyan-300">
                    HARDWARE INTEGRATION
                  </h4>
                  <p className="mt-1 font-mono text-[11px] leading-relaxed text-[#A8BED5]">
                    Bridging software and physical robots.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
