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
  const [isRobotVisible, setIsRobotVisible] = useState(true);
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
        } else if (projectsTop > 0) {
          // In About section: firmly lock robot at p = 1.0 parked in the About dock
          p = 1.0;
        } else {
          // Arrived inside Projects section
          p = 2.0;
        }

        // Only hide the 3D robot when Projects has scrolled past the upper middle screen
        if (projectsTop <= windowHeight * 0.45) {
          setIsRobotVisible(false);
        } else {
          setIsRobotVisible(true);
        }

        // When scrolling past projects section, scroll the canvas up with it
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
        setIsRobotVisible(true);
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
      {/* ─── Continuous 3D Robot Canvas (visible in Hero and About, fades out cleanly for Featured Projects) ─── */}
      <div
        id="robot-canvas-container"
        className="pointer-events-none fixed inset-0 z-[2] h-screen w-full max-w-full overflow-hidden transition-opacity duration-500"
        style={{
          opacity: isSceneVisible && isRobotVisible ? 1 : 0,
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
