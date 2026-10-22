"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProjectItem } from "@/lib/content/types";

interface FeaturedProjectsSectionProps {
  projects?: ProjectItem[];
  scrollProgress?: number;
}

// Default 3 Featured Showcase Projects matching the exact reference UI
const DEFAULT_FEATURED_SHOWCASE = [
  {
    id: "rexa-robot-dog",
    title: "REXA ROBOT DOG",
    tags: "ESP32 + Wi-Fi Control + Embedded C++",
    description:
      "AI-enabled quadruped robot with remote control and autonomous routines.",
    image: "/images/projects/rexa-robot-dog.jpg",
    link: "https://github.com",
  },
  {
    id: "6-dof-robotic-arm",
    title: "6 DOF ROBOTIC ARM",
    tags: "Arduino + ESP32 + Servo Motors",
    description:
      "High precision 6 DOF robotic arm for industrial and research applications.",
    image: "/images/projects/6-dof-robotic-arm.jpg",
    link: "https://github.com",
  },
  {
    id: "kushi-amr",
    title: "KUSHI AMR",
    tags: "ROS 2 Humble + Ubuntu 22.04 + Raspberry Pi 4",
    description:
      "Autonomous mobile robot for indoor navigation and object transport.",
    image: "/images/projects/kushi-amr.jpg",
    link: "https://github.com",
  },
];

export default function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  // Use provided projects or fall back to the exact reference showcase
  const items =
    projects && projects.length > 0
      ? projects.map((p, i) => {
          let defaultImg = [
            "/images/projects/rexa-robot-dog.jpg",
            "/images/projects/6-dof-robotic-arm.jpg",
            "/images/projects/kushi-amr.jpg",
          ][i % 3];

          const titleUpper = (p.title || "").toUpperCase();
          if (
            titleUpper.includes("DOG") ||
            titleUpper.includes("REXA") ||
            titleUpper.includes("QUAD")
          ) {
            defaultImg = "/images/projects/rexa-robot-dog.jpg";
          } else if (
            titleUpper.includes("ARM") ||
            titleUpper.includes("MANIPULATOR") ||
            titleUpper.includes("6 DOF")
          ) {
            defaultImg = "/images/projects/6-dof-robotic-arm.jpg";
          } else if (
            titleUpper.includes("AMR") ||
            titleUpper.includes("KUSHI") ||
            titleUpper.includes("ROVER") ||
            titleUpper.includes("WAREHOUSE")
          ) {
            defaultImg = "/images/projects/kushi-amr.jpg";
          }

          return {
            id: p.id || `proj-${i}`,
            title: p.title,
            tags:
              p.technologies && p.technologies.length > 0
                ? p.technologies.slice(0, 3).join(" + ")
                : p.category || "ROBOTICS",
            description:
              p.description ||
              (i === 0
                ? "AI-enabled quadruped robot with remote control and autonomous routines."
                : i === 1
                ? "High precision 6 DOF robotic arm for industrial and research applications."
                : "Autonomous mobile robot for indoor navigation and object transport."),
            image:
              p.image && !p.image.includes("placeholder")
                ? p.image
                : defaultImg,
            link: p.githubUrl || p.liveUrl || "https://github.com",
          };
        })
      : DEFAULT_FEATURED_SHOWCASE;

  // Pagination: 3 projects per page matching the 3-column HUD container
  const CARDS_PER_PAGE = 3;
  const totalPages = Math.ceil(items.length / CARDS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);

  // Group projects into pages of 3
  const pages = Array.from({ length: totalPages }, (_, pageIdx) =>
    items.slice(pageIdx * CARDS_PER_PAGE, (pageIdx + 1) * CARDS_PER_PAGE)
  );

  // Touch swipe support for horizontal scroll
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || totalPages <= 1) return;
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (diff > 45) {
      setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
    } else if (diff < -45) {
      setCurrentPage((p) => (p + 1) % totalPages);
    }
    touchStartXRef.current = null;
  };

  return (
    <section
      id="projects"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-transparent px-4 sm:px-8 lg:px-12 xl:px-14 py-20 lg:py-24 font-mono text-[#F5F7FA]"
    >
      {/* ─── Main Content Container matching exact reference composition ─── */}
      <div className="relative mx-auto w-full max-w-[1550px]">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-10">
          {/* ════════ LEFT COLUMN: INTRODUCTION & CALL TO ACTION (lg: col-span-4) ════════ */}
          <div className="flex flex-col justify-center select-none lg:col-span-4 xl:col-span-4 relative z-10">
            {/* Cyan Category Eyebrow */}
            <p className="font-mono text-xs font-bold uppercase tracking-[0.26em] text-cyan-400">
              / OUR PROJECTS
            </p>

            {/* Main Headline (White + Steel Blue) */}
            <div className="mt-3">
              <h2 className="text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-normal text-white leading-[1.05]">
                INNOVATIVE
                <br />
                ROBOTICS
              </h2>
              <h3 className="mt-1 text-2xl sm:text-4xl xl:text-5xl font-black uppercase tracking-normal text-[#7898BC] leading-[1.05]">
                REAL WORLD
                <br />
                IMPACT
              </h3>
              {/* Short Cyan Underline Accent Bar */}
              <div className="mt-3.5 h-[3px] w-14 bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
            </div>

            {/* Description Paragraph */}
            <p className="mt-6 font-mono text-[13px] leading-[1.8] text-[#A8BED5] max-w-[380px]">
              Explore our projects where cutting-edge robotics, AI and
              autonomous systems come together to solve real-world challenges.
            </p>

            {/* VIEW ALL PROJECTS -> CTA Button */}
            <div className="mt-8">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 border border-cyan-400 bg-transparent px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.22em] text-white shadow-[0_0_12px_rgba(0,217,255,0.18)] transition-all duration-300 hover:border-cyan-300 hover:bg-cyan-950/30 hover:shadow-[0_0_20px_rgba(0,217,255,0.45)] rounded-[2px]"
              >
                <span>VIEW ALL PROJECTS</span>
                <span className="text-cyan-400 transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </div>

          {/* ════════ RIGHT COLUMN: CYBERPUNK HUD FEATURED PROJECTS FRAME (lg: col-span-8) ════════ */}
          <div className="lg:col-span-8 flex flex-col relative z-20 w-full">
            {/* Header Badge: /// FEATURED PROJECTS */}
            <div className="mb-2.5 flex items-center justify-between select-none">
              <span className="font-mono text-[11px] font-bold tracking-[0.24em] text-cyan-400 drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                /// FEATURED PROJECTS
              </span>

              {/* Navigation Controls (Only visible if more than 3 projects) */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((p) => (p - 1 + totalPages) % totalPages)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded border border-cyan-500/40 bg-zinc-950/80 text-cyan-400 hover:border-cyan-300 hover:text-white transition-colors"
                    aria-label="Previous projects"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => (p + 1) % totalPages)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-cyan-500/40 bg-zinc-950/80 text-cyan-400 hover:border-cyan-300 hover:text-white transition-colors"
                    aria-label="Next projects"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Outer HUD Container with Chamfered Top-Right Corner matching reference */}
            <div
              className="p-[1.5px] rounded-xl bg-gradient-to-br from-cyan-400/90 via-cyan-500/50 to-cyan-400/80 shadow-[0_0_32px_rgba(0,217,255,0.16)] transition-all duration-300"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)",
              }}
            >
              <div
                className="relative rounded-[10px] bg-[#02060c]/90 p-3 sm:p-4 lg:p-5 backdrop-blur-md"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 23px) 0, 100% 23px, 100% 100%, 0 100%)",
                }}
              >
                {/* Multi-Page Carousel Wrapper with Touch/Swipe */}
                <div
                  className="w-full overflow-hidden"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      transform: `translateX(-${currentPage * 100}%)`,
                    }}
                  >
                    {pages.map((pageItems, pageIdx) => (
                      <div
                        key={pageIdx}
                        className="w-full flex-shrink-0 grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:gap-4"
                      >
                        {pageItems.map((item) => (
                          <div
                            key={item.id}
                            tabIndex={0}
                            className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-cyan-500/30 bg-[#03080d]/85 p-3 sm:p-3.5 outline-none transition-all duration-300 hover:border-cyan-400/80 hover:bg-[#05101a] hover:shadow-[0_0_24px_rgba(0,229,255,0.22)] shadow-[0_0_12px_rgba(0,229,255,0.06)]"
                          >
                            {/* ─── Studio-Grade Robot Thumbnail Image ─── */}
                            <div className="relative aspect-[1.18/1] w-full overflow-hidden rounded-md bg-gradient-to-b from-[#081524] via-[#040b12] to-[#010408] border border-cyan-900/30 p-2 flex items-center justify-center">
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-[1.05]"
                              />
                              {/* Bottom Vignette for seamless contrast */}
                              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#03080d] to-transparent opacity-75" />
                            </div>

                            {/* ─── Card Text Content ─── */}
                            <div className="mt-2.5 flex flex-col flex-grow">
                              {/* Project Title */}
                              <h4 className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-wider text-white transition-colors group-hover:text-cyan-200 line-clamp-1">
                                {item.title}
                              </h4>

                              {/* Tech Stack Tags */}
                              <p className="mt-1 font-mono text-[9.5px] sm:text-[10px] uppercase tracking-wider text-[#6189B0] line-clamp-1">
                                {item.tags}
                              </p>

                              {/* Short Cyan Divider Line */}
                              <div className="my-2.5 h-[1.5px] w-6 bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />

                              {/* Project Description */}
                              <p className="font-mono text-[10px] sm:text-[11px] leading-relaxed text-zinc-400 line-clamp-3">
                                {item.description}
                              </p>
                            </div>

                            {/* ─── VIEW PROJECT -> Action Link ─── */}
                            <div className="mt-4 pt-2.5 border-t border-cyan-950/40">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400 transition-colors hover:text-cyan-300 group-hover:translate-x-0.5"
                              >
                                <span>VIEW PROJECT</span>
                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                  →
                                </span>
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── Horizontal Scroll Dots Indicator (Only if more than 3 projects) ─── */}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2 select-none">
                    {pages.map((_, i) => {
                      const isActive = currentPage === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentPage(i)}
                          className={`transition-all duration-300 rounded-full focus:outline-none ${
                            isActive
                              ? "w-7 h-2 bg-cyan-400 shadow-[0_0_12px_#00e5ff]"
                              : "w-2 h-2 bg-cyan-950/80 border border-cyan-500/40 hover:border-cyan-300 hover:bg-cyan-800/60"
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                          aria-current={isActive ? "true" : undefined}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
