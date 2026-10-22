"use client";

import React, { useEffect, useRef } from "react";
import { ProjectItem } from "@/lib/content/types";
import { createSafeGSAPContext, gsap, ScrollTrigger } from "@/lib/motion/gsapUtils";
import { prefersReducedMotion } from "@/lib/motion/tokens";
import { ExternalLink } from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface ProjectsMarqueeProps {
  projects: ProjectItem[];
}

export default function ProjectsMarquee({ projects }: ProjectsMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const { revert } = createSafeGSAPContext(() => {
      itemsRef.current.forEach((item) => {
        if (!item) return;

        ScrollTrigger.create({
          trigger: item,
          start: "top center+=150",
          end: "bottom center-=150",
          onEnter: () => activate(item),
          onEnterBack: () => activate(item),
          onLeave: () => deactivate(item),
          onLeaveBack: () => deactivate(item),
        });
      });

      function activate(el: HTMLElement) {
        gsap.to(el, {
          opacity: 1,
          scale: 1.02,
          borderColor: "rgba(56, 189, 248, 0.4)",
          backgroundColor: "#0d0d11",
          duration: 0.4,
          ease: "power2.out",
        });
      }

      function deactivate(el: HTMLElement) {
        gsap.to(el, {
          opacity: 0.35,
          scale: 0.98,
          borderColor: "rgba(39, 39, 42, 0.5)",
          backgroundColor: "#08080a",
          duration: 0.4,
          ease: "power2.out",
        });
      }
    }, containerRef);

    return () => revert();
  }, [projects]);

  return (
    <section id="projects" ref={containerRef} className="relative min-h-screen py-32 px-6 sm:px-12 bg-black">
      {/* Section Header */}
      <div className="mx-auto max-w-5xl mb-20">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-sky-400">
          / SELECTED SYSTEMS & REPOSITORIES
        </p>
        <h2 className="mt-2 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl">
          FEATURED PROJECTS
        </h2>
      </div>

      {/* Center-Scrub Project List */}
      <div className="mx-auto max-w-5xl space-y-12">
        {projects.map((proj, idx) => (
          <div
            key={proj.id}
            ref={(el) => {
              itemsRef.current[idx] = el;
            }}
            className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-8 sm:p-10 backdrop-blur-sm transition-shadow duration-300 hover:border-zinc-700"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
              <div>
                <span className="font-mono text-xs text-sky-400 uppercase tracking-widest">
                  [{proj.year}] • {proj.category}
                </span>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {proj.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                    aria-label={`GitHub source for ${proj.title}`}
                  >
                    <GithubIcon className="h-4 w-4" />
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
                    aria-label={`Live demo for ${proj.title}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>

            <p className="mt-6 text-base text-zinc-400 leading-relaxed max-w-3xl">
              {proj.description}
            </p>

            {/* Performance Metric Badge */}
            {proj.metrics && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-sky-950/40 border border-sky-800/40 px-3.5 py-1.5 text-xs font-mono text-sky-300">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                <span>{proj.metrics}</span>
              </div>
            )}

            {/* Tech Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {proj.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs font-mono text-zinc-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
