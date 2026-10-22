"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowUpRight, Cpu } from "lucide-react";
import { ProjectItem } from "@/lib/content/types";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface FeaturedProjectsSectionProps {
  projects?: ProjectItem[];
  scrollProgress?: number;
}

const DEFAULT_FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "rexa-robot-dog",
    title: "REXA ROBOT DOG",
    category: "Quadruped Robotics",
    year: "2026",
    description:
      "Advanced 12-DOF quadruped robot featuring high-torque micro-actuators, inverse kinematics path planning, and wireless ESP32 real-time telemetry.",
    technologies: ["ESP32", "Kinematics", "Embedded C++", "Wi-Fi Telemetry"],
    metrics: "12-DOF Dynamic Gait",
    image: "/images/projects/autonomous-navigation-robot.png",
    githubUrl: "https://github.com/reddixrobotics",
    liveUrl: "https://github.com/reddixrobotics",
  },
  {
    id: "6-dof-robotic-arm",
    title: "6 DOF ROBOTIC ARM",
    category: "Robotic Manipulation",
    year: "2026",
    description:
      "Precision 6-axis manipulator engineered for pick-and-place automation, computer vision closed-loop feedback, and force control.",
    technologies: ["Arduino", "ESP32", "Servo Kinematics", "ROS 2"],
    metrics: "±0.5mm Repeatability",
    image: "/images/projects/robotic-manipulator.png",
    githubUrl: "https://github.com/reddixrobotics",
    liveUrl: "https://github.com/reddixrobotics",
  },
  {
    id: "kushi-amr",
    title: "KUSHI AMR",
    category: "Autonomous Mobile Robot",
    year: "2026",
    description:
      "Dual-tier warehouse autonomous rover powered by ROS 2 Humble on Ubuntu 22.04 with 360° RPLiDAR obstacle avoidance and EKF sensor fusion.",
    technologies: ["ROS 2", "Ubuntu 22.04", "RPLiDAR", "Raspberry Pi"],
    metrics: "±2cm Navigation Accuracy",
    image: "/images/projects/lidar-mapping-slam.png",
    githubUrl: "https://github.com/reddixrobotics",
    liveUrl: "https://github.com/reddixrobotics",
  },
];

const DEFAULT_IMAGES = [
  "/images/projects/autonomous-navigation-robot.png",
  "/images/projects/robotic-manipulator.png",
  "/images/projects/lidar-mapping-slam.png",
  "/images/projects/autonomous-drone.png",
];

export default function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  const displayProjects =
    projects && projects.length > 0 ? projects : DEFAULT_FEATURED_PROJECTS;

  return (
    <section
      id="projects"
      className="relative min-h-screen w-full bg-black py-24 sm:py-32 font-mono text-[#F5F7FA] overflow-hidden"
    >
      {/* ─── Cybernetic Perspective Grid Background ─── */}
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#00e5ff_1px,transparent_1px),linear-gradient(to_bottom,#00e5ff_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)]" />

      {/* Glowing atmospheric flares */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ─── Section Header ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyan-500/20 pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-[0.25em]">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff] animate-pulse" />
              <span>/ OUR PROJECTS & INNOVATION</span>
            </div>

            <h2 className="mt-3 text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
              FEATURED <span className="text-cyan-400 drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">PROJECTS</span>
            </h2>

            <p className="mt-3 max-w-2xl font-sans text-sm sm:text-base text-zinc-400 leading-relaxed">
              Explore our cutting-edge robotics where artificial intelligence, embedded kinematics, and autonomous systems solve real-world industrial challenges.
            </p>
          </div>

          {/* Telemetry Indicator */}
          <div className="flex items-center gap-3 shrink-0 rounded-lg border border-cyan-500/30 bg-[#030814]/80 px-4 py-2.5 backdrop-blur-md">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <div className="font-mono text-xs">
              <span className="text-zinc-500 text-[10px] block">SYSTEM UNITS</span>
              <span className="font-bold text-white tracking-wider">
                0{displayProjects.length} ACTIVE DEPLOYMENTS
              </span>
            </div>
          </div>
        </div>

        {/* ─── Full-Width Clean Responsive Projects Grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {displayProjects.map((project, idx) => {
            const hasExternal = Boolean(project.liveUrl || project.githubUrl);
            const targetUrl = project.liveUrl || project.githubUrl || "https://github.com/reddixrobotics";
            const projectImage = project.image || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];

            return (
              <div
                key={project.id || idx}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-cyan-500/25 bg-[#030710]/90 backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(0,229,255,0.22)] hover:-translate-y-1.5"
              >
                {/* Cyberpunk HUD Corner Reticles */}
                <span className="pointer-events-none absolute top-2 left-2 font-mono text-[11px] leading-none text-cyan-400 select-none">
                  ┌
                </span>
                <span className="pointer-events-none absolute top-2 right-2 font-mono text-[11px] leading-none text-cyan-400 select-none">
                  ┐
                </span>
                <span className="pointer-events-none absolute bottom-2 left-2 font-mono text-[11px] leading-none text-cyan-400 select-none">
                  └
                </span>
                <span className="pointer-events-none absolute bottom-2 right-2 font-mono text-[11px] leading-none text-cyan-400 select-none">
                  ┘
                </span>

                <div>
                  {/* ─── Uncropped Image Showcase Container ─── */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#02050A] border border-cyan-500/20 mb-5">
                    <Image
                      src={projectImage}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-2.5 transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Laser Scanning Line on Hover */}
                    <div className="pointer-events-none absolute inset-x-0 h-[2px] bg-cyan-300 shadow-[0_0_10px_#00e5ff] opacity-0 group-hover:opacity-80 transition-opacity duration-300 group-hover:animate-pulse" />

                    {/* Year & Category Tag */}
                    <div className="absolute top-2.5 left-2.5 rounded bg-black/80 border border-cyan-500/40 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-300 backdrop-blur-sm">
                      [{project.year || "2026"}] • {project.category || "ROBOTICS"}
                    </div>
                  </div>

                  {/* ─── Project Title ─── */}
                  <h3 className="font-mono text-lg sm:text-xl font-bold uppercase tracking-wide text-white transition-colors group-hover:text-cyan-300 leading-snug">
                    {project.title}
                  </h3>

                  {/* ─── Metric Badge ─── */}
                  {project.metrics && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-1 font-mono text-[10px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{project.metrics}</span>
                    </div>
                  )}

                  {/* ─── Description ─── */}
                  <p className="mt-3 font-sans text-xs sm:text-[13px] leading-relaxed text-zinc-400 line-clamp-3">
                    {project.description ||
                      "Engineering next-generation robotic intelligence and physical autonomy."}
                  </p>

                  {/* ─── Technology Badges ─── */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies &&
                      project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-cyan-500/25 bg-cyan-950/30 px-2 py-0.5 font-mono text-[10px] font-medium text-cyan-300 uppercase tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>

                {/* ─── Card Action Footer ─── */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <a
                    href={targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 transition-all group-hover:text-cyan-300 group-hover:translate-x-1"
                  >
                    <span>VIEW PROJECT</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-cyan-400 hover:text-white"
                        aria-label={`GitHub source for ${project.title}`}
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/80 bg-zinc-900/80 text-zinc-400 transition-colors hover:border-cyan-400 hover:text-white"
                        aria-label={`Live demo for ${project.title}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── Bottom CTA Strip ─── */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-cyan-500/20 bg-[#030814]/70 p-6 backdrop-blur-md">
          <div className="text-center sm:text-left">
            <p className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              LOOKING FOR CUSTOM ROBOTICS SOLUTIONS?
            </p>
            <p className="mt-1 font-sans text-xs text-zinc-400">
              Autonomous Mobile Robots (AMRs), robotic arms, and custom ROS 2 pipelines tailored for your facility.
            </p>
          </div>

          <Link
            href="/#contact"
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-cyan-400/80 bg-cyan-500 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] active:scale-95"
          >
            <span>GET IN TOUCH</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
