"use client";

import React, { useRef, useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import FeaturedProjectsSection from "./FeaturedProjectsSection";
import RobotCanvas from "@/components/3d/RobotCanvas";
import { HeroContent, AboutContent, ProjectItem } from "@/lib/content/types";

interface HeroAboutSceneProps {
  hero: HeroContent;
  about?: AboutContent;
  projects?: ProjectItem[];
}

export default function HeroAboutScene({ hero, about, projects }: HeroAboutSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSceneVisible, setIsSceneVisible] = useState(true);
  const [canvasTranslateY, setCanvasTranslateY] = useState(0);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      const windowHeight = window.innerHeight || 1;
      const aboutEl = document.getElementById("about");
      const projectsEl = document.getElementById("projects");

      let p = 0;

      if (aboutEl && projectsEl) {
        const aboutTop = aboutEl.getBoundingClientRect().top;
        const projectsTop = projectsEl.getBoundingClientRect().top;
        const projectsBottom = projectsEl.getBoundingClientRect().bottom;

        if (aboutTop > 0) {
          // Scrolling Hero -> About
          const t = Math.max(0, Math.min(1, 1 - aboutTop / windowHeight));
          p = t;
        } else if (projectsTop > windowHeight * 0.35) {
          // Scrolling About -> Featured Projects
          const t = Math.max(0, Math.min(1, (windowHeight - projectsTop) / (windowHeight * 0.65)));
          p = 1.0 + t;
        } else {
          // Arrived inside Featured Projects: firmly locked at p = 2.0 so robot remains stationary
          p = 2.0;
        }

        // When scrolling past projects section, scroll the robot canvas up 1:1 with the projects section
        // so the robot stays firmly anchored inside the projects section and exits cleanly with it
        if (projectsBottom < windowHeight) {
          setCanvasTranslateY(projectsBottom - windowHeight);
        } else {
          setCanvasTranslateY(0);
        }

        setIsSceneVisible(projectsBottom > 0);
      } else {
        const scrollY = window.scrollY || 0;
        p = Math.min(2.0, scrollY / windowHeight);
        setCanvasTranslateY(0);
        setIsSceneVisible(true);
      }

      setScrollProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-full overflow-x-clip">
      {/* ─── Continuous 3D Robot Canvas (persists across Hero, About, and Featured Projects) ─── */}
      <div
        id="robot-canvas-container"
        className="pointer-events-none fixed inset-0 z-[2] h-screen w-full max-w-full overflow-hidden transition-opacity duration-300"
        style={{
          opacity: isSceneVisible ? 1 : 0,
          transform: `translate3d(0, ${canvasTranslateY}px, 0)`,
          willChange: "transform",
        }}
      >
        <RobotCanvas scrollProgress={scrollProgress} />
      </div>

      {/* ─── Content Sections in Natural DOM Flow ─── */}
      <div className="relative z-10 pointer-events-auto">
        <HeroSection hero={hero} hideCanvas={true} />
        <AboutSection about={about} />
        <FeaturedProjectsSection projects={projects} scrollProgress={scrollProgress} />
      </div>
    </div>
  );
}
