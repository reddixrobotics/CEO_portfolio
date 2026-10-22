"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectItem } from "@/lib/content/types";

interface FeaturedProjectsSectionProps {
  projects?: ProjectItem[];
  scrollProgress?: number;
}

// 12 Showcase Projects arranged into 3 pages of 4 projects each for 3-dots scroller navigation
const ALL_FEATURED_PROJECTS = [
  // ─── PAGE 1: CORE AUTONOMOUS SYSTEMS ───
  {
    id: "autonomous-navigation-robot",
    title: "AUTONOMOUS NAVIGATION ROBOT",
    tags: "SLAM + ROS 2 + LIDAR",
    image: "/images/projects/autonomous-navigation-robot.png",
    link: "https://github.com",
  },
  {
    id: "robotic-manipulator",
    title: "ROBOTIC MANIPULATOR",
    tags: "VISION + AI + CONTROL",
    image: "/images/projects/robotic-manipulator.png",
    link: "https://github.com",
  },
  {
    id: "lidar-mapping-slam",
    title: "LIDAR MAPPING & SLAM",
    tags: "3D MAPPING + NAVIGATION",
    image: "/images/projects/lidar-mapping-slam.png",
    link: "https://github.com",
  },
  {
    id: "autonomous-drone",
    title: "AUTONOMOUS DRONE",
    tags: "COMPUTER VISION + AI",
    image: "/images/projects/autonomous-drone.png",
    link: "https://github.com",
  },

  // ─── PAGE 2: DISTRIBUTED SWARMS & AERIAL KINEMATICS ───
  {
    id: "multi-agent-swarm",
    title: "MULTI-AGENT SWARM AMR",
    tags: "DISTRIBUTED FLEET + ROS 2 NAV2",
    image: "/images/projects/autonomous-navigation-robot.png",
    link: "https://github.com",
  },
  {
    id: "precision-6dof-arm",
    title: "PRECISION 6-DOF ROBOTIC ARM",
    tags: "KINEMATICS + FORCE FEEDBACK",
    image: "/images/projects/robotic-manipulator.png",
    link: "https://github.com",
  },
  {
    id: "point-cloud-telemetry",
    title: "3D POINT CLOUD TELEMETRY HUD",
    tags: "WEBRTC + THREE.JS + FASTAPI",
    image: "/images/projects/lidar-mapping-slam.png",
    link: "https://github.com",
  },
  {
    id: "aerial-inspection-drone",
    title: "HIGH-SPEED INSPECTION DRONE",
    tags: "PX4 AUTOPILOT + TENSORRT",
    image: "/images/projects/autonomous-drone.png",
    link: "https://github.com",
  },

  // ─── PAGE 3: EMBEDDED CONTROL & EDGE RECOGNITION ───
  {
    id: "foc-motor-controller",
    title: "DUAL-CHANNEL FOC MOTOR CONTROLLER",
    tags: "STM32F4 + FIELD ORIENTED CONTROL",
    image: "/images/projects/autonomous-navigation-robot.png",
    link: "https://github.com",
  },
  {
    id: "haptic-teleop-rig",
    title: "HAPTIC TELEOPERATION RIG",
    tags: "LOW-LATENCY CAN + IMU SENSORS",
    image: "/images/projects/robotic-manipulator.png",
    link: "https://github.com",
  },
  {
    id: "slam-loop-closure",
    title: "REAL-TIME SLAM & LOOP CLOSURE",
    tags: "CARTOGRAPHER + EKF SENSOR FUSION",
    image: "/images/projects/lidar-mapping-slam.png",
    link: "https://github.com",
  },
  {
    id: "edge-obstacle-segmentation",
    title: "EDGE AI OBSTACLE RECOGNITION",
    tags: "YOLOV8 + JETSON ORIN + CUDA",
    image: "/images/projects/autonomous-drone.png",
    link: "https://github.com",
  },
];

export default function FeaturedProjectsSection({
  projects,
  scrollProgress,
}: FeaturedProjectsSectionProps) {
  // Use provided projects or fall back to the multi-page catalog (12 projects = 3 pages of 4)
  const items =
    projects && projects.length > 0
      ? projects.map((p, i) => ({
          id: p.id || `proj-${i}`,
          title: p.title,
          tags:
            p.technologies && p.technologies.length > 0
              ? p.technologies.slice(0, 3).join(" + ")
              : p.category || "ROBOTICS",
          image:
            p.image ||
            [
              "/images/projects/autonomous-navigation-robot.png",
              "/images/projects/robotic-manipulator.png",
              "/images/projects/lidar-mapping-slam.png",
              "/images/projects/autonomous-drone.png",
            ][i % 4],
          link: p.githubUrl || p.liveUrl || "https://github.com",
        }))
      : ALL_FEATURED_PROJECTS;

  // Pagination: 4 projects per page
  const CARDS_PER_PAGE = 4;
  const totalPages = Math.ceil(items.length / CARDS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  // Group projects into pages of 4
  const pages = Array.from({ length: totalPages }, (_, pageIdx) =>
    items.slice(pageIdx * CARDS_PER_PAGE, (pageIdx + 1) * CARDS_PER_PAGE)
  );

  // Touch and wheel swipe support
  const touchStartXRef = useRef<number | null>(null);
  const wheelLockRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 45) {
      setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
    } else if (diff < -45) {
      setCurrentPage((p) => (p + 1) % totalPages);
    }
    touchStartXRef.current = null;
  };

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, []);

  // Calculate arrival animation factor: 0 when scrolled away, 1 when arrived
  const entryProgress =
    scrollProgress !== undefined
      ? Math.min(1.0, Math.max(0, (scrollProgress - 1.05) / 0.60))
      : 1.0;
  const s =
    entryProgress < 0.5
      ? 2 * entryProgress * entryProgress
      : 1 - Math.pow(-2 * entryProgress + 2, 2) / 2;

  // Mechanical Shutter Activation synchronized with the AMR Robot:
  // When robot drives in from Bio (scrollProgress >= 1.28), activate sequence.
  // Hysteresis prevents replaying on tiny scroll movements; resets on reverse scroll past 1.15.
  const [isActivated, setIsActivated] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Panel hover state: true when cursor or keyboard focus is anywhere inside the Featured Projects container
  const [isPanelHovered, setIsPanelHovered] = useState(false);
  const isHoveredRef = useRef(false);
  // Viewport centering translation delta (dx, dy)
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const slotRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateOffset = useCallback(() => {
    if (!slotRef.current) return;
    const rect = slotRef.current.getBoundingClientRect();
    const slotCenterX = rect.left + rect.width / 2;
    const slotCenterY = rect.top + rect.height / 2;
    const viewportCenterX = (document.documentElement.clientWidth || window.innerWidth) / 2;
    const viewportCenterY = window.innerHeight / 2;

    let dx = viewportCenterX - slotCenterX;
    let dy = viewportCenterY - slotCenterY;

    // Guard against top clipping beneath header navbar on compact screens
    const safeTop = 64;
    if (rect.top + dy < safeTop) {
      dy = safeTop - rect.top;
    }

    setOffset({
      x: Math.round(dx),
      y: Math.round(dy),
    });
  }, []);

  // Native non-passive wheel interceptor on the panel:
  // Completely prevents background page scroll and smoothly cycles pages without closing hover
  useEffect(() => {
    if (!isPanelHovered) return;
    const panelEl = panelRef.current;
    if (!panelEl) return;

    const onNativeWheel = (e: WheelEvent) => {
      // Prevent browser from scrolling the background window
      e.preventDefault();
      e.stopPropagation();

      if (totalPages <= 1) return;
      if (Math.abs(e.deltaX) > 15 || Math.abs(e.deltaY) > 20) {
        if (wheelLockRef.current) return;
        wheelLockRef.current = true;
        if (e.deltaX > 15 || e.deltaY > 20) {
          // Scroll next with infinite loop
          setCurrentPage((p) => (p + 1) % totalPages);
        } else {
          // Scroll prev with infinite loop
          setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
        }
        setTimeout(() => {
          wheelLockRef.current = false;
        }, 360);
      }
    };

    panelEl.addEventListener("wheel", onNativeWheel, { passive: false });
    return () => {
      panelEl.removeEventListener("wheel", onNativeWheel);
    };
  }, [isPanelHovered, totalPages]);

  // Sync class on document.body to smoothly blur and dim 3D robot canvas and grid floor
  useEffect(() => {
    if (isPanelHovered) {
      document.body.classList.add("projects-panel-hovered");
    } else {
      document.body.classList.remove("projects-panel-hovered");
    }
    return () => {
      document.body.classList.remove("projects-panel-hovered");
    };
  }, [isPanelHovered]);

  const isTargetInActiveZone = useCallback((target: any) => {
    if (!target || typeof Node === "undefined" || !(target instanceof Node)) return false;
    if (panelRef.current && panelRef.current.contains(target)) return true;
    if (slotRef.current && slotRef.current.contains(target)) return true;
    return false;
  }, []);

  const handleActiveEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (!isHoveredRef.current) {
      updateOffset();
      isHoveredRef.current = true;
      setIsPanelHovered(true);
    }
  }, [updateOffset]);

  const handleActiveLeave = useCallback(
    (e: React.MouseEvent) => {
      // If moving to an element within panelRef or slotRef (including bridge), keep it open!
      if (isTargetInActiveZone(e.relatedTarget as Node)) {
        return;
      }
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(() => {
        isHoveredRef.current = false;
        setIsPanelHovered(false);
      }, 350);
    },
    [isTargetInActiveZone]
  );

  const handleActiveBlur = useCallback(
    (e: React.FocusEvent) => {
      if (isTargetInActiveZone(e.relatedTarget as Node)) {
        return;
      }
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = setTimeout(() => {
        isHoveredRef.current = false;
        setIsPanelHovered(false);
      }, 350);
    },
    [isTargetInActiveZone]
  );

  // Dynamically recompute center if viewport is resized
  useEffect(() => {
    if (!isPanelHovered) return;
    const handleResize = () => updateOffset();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [isPanelHovered, updateOffset]);

  // Dismiss when tapping/clicking anywhere outside the centered panel and dock
  useEffect(() => {
    if (!isPanelHovered) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!isTargetInActiveZone(target)) {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        isHoveredRef.current = false;
        setIsPanelHovered(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [isPanelHovered, isTargetInActiveZone]);

  // Keyboard navigation: Escape to dismiss, Arrow keys to flip pages
  useEffect(() => {
    if (!isPanelHovered) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        isHoveredRef.current = false;
        setIsPanelHovered(false);
      } else if (e.key === "ArrowRight") {
        setCurrentPage((p) => (p + 1) % totalPages);
      } else if (e.key === "ArrowLeft") {
        setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPanelHovered, totalPages]);

  useEffect(() => {
    if (scrollProgress === undefined) {
      setIsActivated(true);
      return;
    }
    if (scrollProgress >= 1.28) {
      setIsActivated(true);
    } else if (scrollProgress < 1.15) {
      setIsActivated(false);
    }
  }, [scrollProgress]);

  // Card open thresholds for smooth sequential activation as robot approaches parking spot
  // On Page 0, mechanical shutters open sequentially as AMR approaches (thresholds: 1.28, 1.42, 1.56, 1.70).
  // On subsequent pages (pageIndex > 0), cards are already fully unlocked and ready to inspect.
  const isCardOpen = (pageIndex: number, cardIndex: number) => {
    if (pageIndex > 0) return true;
    if (scrollProgress === undefined) return true;
    if (!isActivated) return false;
    const thresholds = [1.28, 1.42, 1.56, 1.70];
    return scrollProgress >= thresholds[cardIndex];
  };

  return (
    <section
      id="projects"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-transparent px-4 sm:px-10 lg:px-14 py-20 lg:py-28 font-mono text-[#F5F7FA]"
    >
      {/* ─── Subtle Floating Cyan Cybernetic Dust Particles ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none transition-all duration-400"
        style={{
          filter: isPanelHovered ? "blur(6px)" : "none",
          opacity: 1,
          transition: "filter 400ms ease",
        }}
      >
        <span
          className="absolute block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse"
          style={{ left: "8%", top: "28%", animationDuration: "3.5s" }}
        />
        <span
          className="absolute block h-1 w-1 rounded-full bg-cyan-300 shadow-[0_0_6px_#00e5ff] animate-pulse"
          style={{ left: "44%", top: "18%", animationDuration: "4s" }}
        />
        <span
          className="absolute block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse"
          style={{ left: "72%", top: "22%", animationDuration: "3s" }}
        />
        <span
          className="absolute block h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff] animate-pulse"
          style={{ left: "92%", top: "70%", animationDuration: "5s" }}
        />
        {/* Dim rectangular HUD markers */}
        <span className="absolute block h-2 w-2 border border-zinc-700/40" style={{ left: "46%", top: "12%" }} />
        <span className="absolute block h-1.5 w-1.5 border border-zinc-700/30" style={{ left: "70%", top: "38%" }} />
      </div>

      {/* ─── Main Content Container (Max width matching reference composition) ─── */}
      <div className="relative mx-auto w-full max-w-[1550px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* ════════ LEFT COLUMN: INTRODUCTION & CALL TO ACTION (lg: col-span-4) ════════ */}
          <div
            className="flex flex-col justify-center select-none lg:col-span-4 xl:col-span-4 relative z-10"
            style={{
              opacity: prefersReducedMotion ? 1 : Math.min(1, Math.max(0, (s - 0.04) / 0.96)),
              transform: prefersReducedMotion || !isDesktop
                ? "none"
                : `translateX(${-120 * (1 - s)}px)`,
              filter: isPanelHovered ? "blur(6px)" : "none",
              transition:
                "filter 400ms ease, opacity 650ms cubic-bezier(0.16, 1, 0.3, 1), transform 750ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Cyan Category Eyebrow */}
            <p
              className="font-mono text-xs font-bold uppercase tracking-[0.26em] text-cyan-400 transition-all duration-700 ease-out"
              style={{
                transform: prefersReducedMotion || !isDesktop ? "none" : `translateX(${-40 * (1 - s)}px)`,
                opacity: s,
              }}
            >
              / OUR PROJECTS
            </p>

            {/* Main Headline (White + Steel Blue) */}
            <div
              className="mt-2.5 transition-all duration-750 ease-out"
              style={{
                transform: prefersReducedMotion || !isDesktop ? "none" : `translateX(${-60 * (1 - s)}px)`,
                opacity: s,
              }}
            >
              <h2 className="text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-normal text-white leading-[1.05]">
                INNOVATIVE ROBOTICS
              </h2>
              <h3 className="mt-1 text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-normal text-[#7898BC] leading-[1.05]">
                REAL WORLD IMPACT
              </h3>
              {/* Short Cyan Underline Accent Bar */}
              <div
                className="mt-3.5 h-[3px] bg-cyan-400 shadow-[0_0_10px_#00e5ff] transition-all duration-700 ease-out"
                style={{
                  width: `${Math.round(56 * Math.min(1, s * 1.25))}px`,
                  opacity: s,
                }}
              />
            </div>

            {/* Description Paragraph */}
            <p
              className="mt-6 font-mono text-[13px] leading-[1.8] text-[#A8BED5] max-w-[370px] transition-all duration-800 ease-out"
              style={{
                transform: prefersReducedMotion || !isDesktop ? "none" : `translateX(${-50 * (1 - s)}px)`,
                opacity: s,
              }}
            >
              Explore our projects where cutting-edge robotics, AI and autonomous
              systems come together to solve real-world challenges.
            </p>

            {/* VIEW ALL PROJECTS -> CTA Button */}
            <div
              className="mt-8 transition-all duration-850 ease-out"
              style={{
                transform: prefersReducedMotion || !isDesktop ? "none" : `translateX(${-40 * (1 - s)}px)`,
                opacity: s,
              }}
            >
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 border border-cyan-400 bg-transparent px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-white shadow-[0_0_12px_rgba(0,217,255,0.18)] transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-950/30 hover:shadow-[0_0_20px_rgba(0,217,255,0.45)]"
                style={{ borderRadius: "2px" }}
              >
                <span>VIEW ALL PROJECTS</span>
                <span className="text-cyan-400 transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>

            {/* Bottom-left ticker matching reference image: INNOVATE / DEPLOY */}
            <div
              className="mt-16 hidden lg:flex items-center gap-2.5 font-mono text-[11px] font-bold tracking-[0.28em] text-zinc-500 uppercase transition-all duration-900 ease-out"
              style={{
                transform: prefersReducedMotion ? "none" : `translateX(${-30 * (1 - s)}px)`,
                opacity: s,
              }}
            >
              <span>INNOVATE</span>
              <span className="text-cyan-400">/</span>
              <span>DEPLOY</span>
            </div>
          </div>

          {/* ════════ CENTER COLUMN: OPEN STAGE FOR 3D AMR ROBOT (lg: col-span-1 xl:col-span-2) ════════ */}
          {/* The continuous 3D robot sits cleanly in this open corridor */}
          <div
            className="hidden lg:col-span-1 xl:col-span-2 xl:flex items-center justify-center pointer-events-none relative z-10 transition-all duration-400"
            style={{
              filter: isPanelHovered ? "blur(6px)" : "none",
              opacity: 1,
              transition: "filter 400ms ease",
            }}
          >
            <div id="projects-robot-dock" className="h-4 w-4 opacity-0 pointer-events-none" aria-hidden="true" />
          </div>

          {/* ════════ RIGHT COLUMN: CYBERPUNK HUD FEATURED PROJECTS FRAME (lg: col-span-7 xl:col-span-6) ════════ */}
          <div
            className="lg:col-span-7 xl:col-span-6 flex flex-col items-center lg:items-end transition-all duration-300 ease-out relative z-30 w-full"
            style={{
              opacity: 0.15 + 0.85 * s,
              transform: prefersReducedMotion || !isDesktop ? "none" : `translateX(${36 * (1 - s)}px)`,
            }}
          >
            {/* Resting slot wrapper maintaining natural layout in right column */}
            <div
              ref={slotRef}
              className="w-full max-w-[560px] min-h-[500px] relative"
              onMouseEnter={handleActiveEnter}
              onMouseLeave={handleActiveLeave}
            >

              {/* Hover bridge extending from dock across to centered panel so traveling cursor never leaves hit area */}
              {isPanelHovered && (
                <div
                  aria-hidden="true"
                  className="pointer-events-auto absolute z-30"
                  style={{
                    left: `${Math.min(0, offset.x)}px`,
                    right: 0,
                    top: `${Math.min(0, offset.y)}px`,
                    bottom: `${Math.min(0, -offset.y)}px`,
                  }}
                  onMouseEnter={handleActiveEnter}
                />
              )}

              {/* Floating Featured Projects panel that glides to exact viewport center */}
              <div
                ref={panelRef}
                tabIndex={0}
                onMouseEnter={handleActiveEnter}
                onMouseLeave={handleActiveLeave}
                onFocus={handleActiveEnter}
                onBlur={handleActiveBlur}
                className={`w-full relative outline-none ${
                  isPanelHovered ? "z-40 pointer-events-auto" : "z-30"
                }`}
                style={{
                  transform: isPanelHovered
                    ? `translate3d(${offset.x}px, ${offset.y}px, 0) scale(1.03)`
                    : "translate3d(0, 0, 0) scale(1.0)",
                  transformOrigin: "center center",
                  filter: isPanelHovered ? "brightness(1.08)" : "none",
                  transition:
                    "transform 450ms cubic-bezier(0.16, 1, 0.3, 1), filter 450ms ease, box-shadow 450ms ease",
                }}
              >
                {/* Header Badge: /// FEATURED PROJECTS */}
                <div className="mb-2 flex items-center gap-2 select-none">
                  <span
                    className={`font-mono text-[11px] font-bold tracking-[0.24em] transition-all duration-300 ${
                      isPanelHovered
                        ? "text-cyan-200 drop-shadow-[0_0_10px_#00e5ff]"
                        : "text-cyan-400"
                    }`}
                  >
                    /// FEATURED PROJECTS
                  </span>
                </div>

                {/* Outer HUD Container with Chamfered/Beveled Top-Right Corner matching reference */}
                <div
                  className={`p-[1.5px] transition-all duration-450 ease-out ${
                    isPanelHovered
                      ? "bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-300 shadow-[0_0_45px_rgba(0,229,255,0.50),0_0_90px_rgba(0,229,255,0.25)]"
                      : "bg-gradient-to-br from-cyan-400/80 via-cyan-500/40 to-cyan-400/70 shadow-[0_0_28px_rgba(0,217,255,0.08)]"
                  }`}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
                  }}
                >
                <div
                  className={`relative p-3 sm:p-3.5 lg:p-4 backdrop-blur-md transition-all duration-350 ${
                    isPanelHovered
                      ? "bg-black/80 shadow-[inset_0_0_24px_rgba(0,229,255,0.12)]"
                      : "bg-black/80"
                  }`}
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 19px) 0, 100% 19px, 100% 100%, 0 100%)",
                  }}
                >
                  {/* Outer HUD Corner Ticks */}
                  <span
                    className={`pointer-events-none absolute top-1 left-1 font-mono text-[10px] leading-none select-none transition-all duration-300 ${
                      isPanelHovered
                        ? "text-cyan-200 drop-shadow-[0_0_8px_#00e5ff] scale-110"
                        : "text-cyan-400"
                    }`}
                  >
                    ┌
                  </span>
                  <span
                    className={`pointer-events-none absolute bottom-1 left-1 font-mono text-[10px] leading-none select-none transition-all duration-300 ${
                      isPanelHovered
                        ? "text-cyan-200 drop-shadow-[0_0_8px_#00e5ff] scale-110"
                        : "text-cyan-400"
                    }`}
                  >
                    └
                  </span>
                  <span
                    className={`pointer-events-none absolute bottom-1 right-1 font-mono text-[10px] leading-none select-none transition-all duration-300 ${
                      isPanelHovered
                        ? "text-cyan-200 drop-shadow-[0_0_8px_#00e5ff] scale-110"
                        : "text-cyan-400"
                    }`}
                  >
                    ┘
                  </span>

                  {/* Multi-Page 2x2 Grid Carousel Container with Touch & Wheel Support */}
                  <div
                    className="w-full overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(-${currentPage * 100}%)`,
                      }}
                    >
                      {pages.map((pageItems, pageIdx) => (
                        <div
                          key={pageIdx}
                          className="w-full flex-shrink-0 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-3"
                        >
                          {pageItems.map((item, idx) => {
                            const open = isCardOpen(pageIdx, idx);
                            // Staggered delay for cascading robotic activation on initial arrival
                            const staggerDelay = pageIdx === 0 ? idx * 130 : 0;

                      return (
                        <div
                          key={item.id}
                          tabIndex={0}
                          className={`group relative flex flex-col justify-between overflow-hidden rounded-[2px] border bg-[#04090d]/90 p-2.5 sm:p-2.5 outline-none transition-all duration-300 min-w-0 w-full ${
                            open
                              ? "border-cyan-500/40 hover:border-cyan-300 hover:shadow-[0_0_18px_rgba(0,217,255,0.22)] shadow-[0_0_14px_rgba(0,229,255,0.10)]"
                              : "border-cyan-500/20 shadow-none"
                          }`}
                          style={{
                            transform: "scale(1.0)",
                            filter: "none",
                          }}
                        >
                          {/* ─── MECHANICAL SHUTTER PANELS (LEFT & RIGHT) ─── */}
                          {/* Left Shutter Panel (Slides toward left edge) */}
                          <div
                            className="pointer-events-none absolute inset-y-0 left-0 w-[50.5%] z-20 overflow-hidden bg-[#060b11] border-r border-cyan-400/90 shadow-[2px_0_12px_rgba(0,229,255,0.40)] transition-all duration-650 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            style={{
                              transform: prefersReducedMotion
                                ? "none"
                                : open
                                ? "translateX(-102%)"
                                : "translateX(0%)",
                              opacity: open ? 0 : 1,
                              transitionDelay: prefersReducedMotion ? "0ms" : `${staggerDelay}ms`,
                            }}
                          >
                            {/* Dark glass-like micro-pattern */}
                            <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:10px_10px] opacity-15" />
                            <div className="absolute bottom-1 right-2 font-mono text-[7px] font-bold tracking-[0.2em] text-cyan-500/60 select-none">
                              SHUTTER-L
                            </div>
                          </div>

                          {/* Right Shutter Panel (Slides toward right edge) */}
                          <div
                            className="pointer-events-none absolute inset-y-0 right-0 w-[50.5%] z-20 overflow-hidden bg-[#060b11] border-l border-cyan-400/90 shadow-[-2px_0_12px_rgba(0,229,255,0.40)] transition-all duration-650 ease-[cubic-bezier(0.16,1,0.3,1)]"
                            style={{
                              transform: prefersReducedMotion
                                ? "none"
                                : open
                                ? "translateX(102%)"
                                : "translateX(0%)",
                              opacity: open ? 0 : 1,
                              transitionDelay: prefersReducedMotion ? "0ms" : `${staggerDelay}ms`,
                            }}
                          >
                            <div className="absolute inset-0 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:10px_10px] opacity-15" />
                            <div className="absolute top-1 left-2 font-mono text-[7px] font-bold tracking-[0.2em] text-cyan-500/60 select-none">
                              SHUTTER-R
                            </div>
                          </div>

                          {/* Center Seam Laser Latch Indicator (visible when shutters are closed) */}
                          <div
                            className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 z-25 flex items-center justify-center transition-opacity duration-300"
                            style={{
                              opacity: open ? 0 : 1,
                              transitionDelay: open ? "0ms" : `${staggerDelay}ms`,
                            }}
                          >
                            <div className="flex items-center gap-1.5 border border-cyan-400/60 bg-black/90 px-2 py-0.5 font-mono text-[7.5px] font-bold tracking-[0.2em] text-cyan-400 shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                              <span className="h-1 w-1 rounded-full bg-cyan-400 animate-ping" />
                              <span>[ SYS-0{idx + 1} ]</span>
                            </div>
                          </div>

                          {/* ─── Inner Cyberpunk HUD Corner Reticles (Illuminate on open, pop on panel hover) ─── */}
                          <span
                            className={`pointer-events-none absolute top-1 left-1 font-mono text-[10px] leading-none select-none transition-all duration-300 ${
                              isPanelHovered
                                ? "text-cyan-200 drop-shadow-[0_0_8px_#00e5ff]"
                                : open
                                ? "text-cyan-300 drop-shadow-[0_0_6px_#00e5ff]"
                                : "text-cyan-600/50"
                            }`}
                          >
                            ┌
                          </span>
                          <span
                            className={`pointer-events-none absolute top-1 right-1 font-mono text-[10px] leading-none select-none transition-all duration-300 ${
                              isPanelHovered
                                ? "text-cyan-200 drop-shadow-[0_0_8px_#00e5ff]"
                                : open
                                ? "text-cyan-300 drop-shadow-[0_0_6px_#00e5ff]"
                                : "text-cyan-600/50"
                            }`}
                          >
                            ┐
                          </span>
                          <span
                            className={`pointer-events-none absolute bottom-1 left-1 font-mono text-[10px] leading-none select-none transition-all duration-300 ${
                              isPanelHovered
                                ? "text-cyan-200 drop-shadow-[0_0_8px_#00e5ff]"
                                : open
                                ? "text-cyan-300 drop-shadow-[0_0_6px_#00e5ff]"
                                : "text-cyan-600/50"
                            }`}
                          >
                            └
                          </span>
                          <span
                            className={`pointer-events-none absolute bottom-1 right-1 font-mono text-[10px] leading-none select-none transition-all duration-300 ${
                              isPanelHovered
                                ? "text-cyan-200 drop-shadow-[0_0_8px_#00e5ff]"
                                : open
                                ? "text-cyan-300 drop-shadow-[0_0_6px_#00e5ff]"
                                : "text-cyan-600/50"
                            }`}
                          >
                            ┘
                          </span>

                          {/* ─── Thumbnail Image Container with Cyan Scanning Line ─── */}
                          <div className="relative aspect-[2.15/1] w-full overflow-hidden rounded-[1px] bg-black/80">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                            {/* Subtle Vignette Overlay */}
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04090d] via-transparent to-transparent opacity-60" />

                            {/* Thin Cyan Scanning Line across image as shutters open */}
                            <div
                              className={`pointer-events-none absolute inset-x-0 h-[1.5px] bg-cyan-300 shadow-[0_0_8px_#00e5ff] transition-opacity duration-500 ${
                                open ? "opacity-75" : "opacity-0"
                              }`}
                              style={{
                                animationName: open ? "scanline" : "none",
                                animationDuration: "2.6s",
                                animationTimingFunction: "linear",
                                animationIterationCount: "infinite",
                                animationDelay: `${idx * 0.35}s`,
                              }}
                            />
                          </div>

                          {/* ─── Card Content with Subtle Upward Motion Reveal ─── */}
                          <div
                            className="mt-2.5 flex flex-col transition-all duration-500 ease-out"
                            style={{
                              transitionDelay: prefersReducedMotion
                                ? "0ms"
                                : open
                                ? `${staggerDelay + 180}ms`
                                : "0ms",
                              opacity: open ? 1 : 0,
                              transform: prefersReducedMotion
                                ? "none"
                                : open
                                ? "translateY(0px)"
                                : "translateY(10px)",
                            }}
                          >
                            {/* Project Title */}
                            <h4 className="font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-white transition-colors group-hover:text-cyan-200 leading-snug line-clamp-1">
                              {item.title}
                            </h4>

                            {/* Tech Stack Tags */}
                            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[#6189B0] line-clamp-1">
                              {item.tags}
                            </p>

                            {/* VIEW PROJECT -> Action Link */}
                            <div className="mt-2">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-400 transition-colors group-hover:text-cyan-300"
                              >
                                <span>VIEW PROJECT</span>
                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                  →
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── 3 DOTS SCROLLER / CYBERNETIC PAGINATOR (Shown when more projects are included) ─── */}
                {totalPages > 1 && (
                  <div className="mt-3.5 flex items-center justify-between border-t border-cyan-500/20 pt-2.5 px-1 select-none">
                    {/* Technical Telemetry Counter */}
                    <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] text-[#6189B0]">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff] animate-pulse" />
                      <span className="text-cyan-400 font-bold">PROJECTS</span>
                      <span className="text-zinc-600">//</span>
                      <span className="text-white font-bold tracking-widest">
                        0{currentPage + 1} <span className="text-zinc-500 font-normal">/</span> 0{totalPages}
                      </span>
                    </div>

                    {/* 3 Dots Scroller Controls */}
                    <div className="flex items-center gap-2" suppressHydrationWarning>
                      {/* Previous Page Arrow */}
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setCurrentPage((p) => (p - 1 + totalPages) % totalPages)}
                        aria-label="Previous project page"
                        className="flex h-5 w-5 items-center justify-center rounded-[1px] border border-cyan-500/30 bg-[#04090d] text-cyan-400 transition-all hover:border-cyan-300 hover:bg-cyan-950/40 active:scale-95 cursor-pointer"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </button>

                      {/* 3 Dots */}
                      <div className="flex items-center gap-1.5 px-1" suppressHydrationWarning>
                        {Array.from({ length: totalPages }).map((_, dotIdx) => {
                          const isActive = dotIdx === currentPage;
                          return (
                            <button
                              key={dotIdx}
                              type="button"
                              suppressHydrationWarning
                              onClick={() => setCurrentPage(dotIdx)}
                              aria-label={`Go to project page ${dotIdx + 1}`}
                              className={`transition-all duration-300 cursor-pointer ${
                                isActive
                                  ? "h-1.5 w-6 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]"
                                  : "h-1.5 w-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 hover:bg-cyan-500/40 hover:border-cyan-300"
                              }`}
                            />
                          );
                        })}
                      </div>

                      {/* Next Page Arrow */}
                      <button
                        type="button"
                        suppressHydrationWarning
                        onClick={() => setCurrentPage((p) => (p + 1) % totalPages)}
                        aria-label="Next project page"
                        className="flex h-5 w-5 items-center justify-center rounded-[1px] border border-cyan-500/30 bg-[#04090d] text-cyan-400 transition-all hover:border-cyan-300 hover:bg-cyan-950/40 active:scale-95 cursor-pointer"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
