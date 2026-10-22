"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/motion/tokens";

interface PixelPortraitProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

interface PhotoBlock {
  col: number;
  row: number;
  x: number;
  y: number;
  w: number;
  h: number;
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  order: number;
}

export default function PixelPortrait({
  src,
  alt,
  width = 450,
  height = 450,
  priority = false,
  className = "",
}: PixelPortraitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Trigger function for manual re-build on click
  const triggerBuildRef = useRef<(dir?: "center" | "down" | "up") => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const isReduced = prefersReducedMotion();
    let animId: number;
    let isVisible = false;

    // Load original image into an off-screen HTMLImageElement for canvas block slicing
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    // ─── Block by Block Grid Data ───
    let blocks: PhotoBlock[] = [];
    const numCols = 16;
    const numRows = 16;
    let buildProgress = 0;
    let isBuilding = true;
    const buildSpeed = 0.72; // Completes smoothly in ~1.4s
    let lastTriggerTime = 0;

    const initBlocks = (direction: "center" | "down" | "up" = "center") => {
      blocks = [];
      const bw = width / numCols;
      const bh = height / numRows;

      const natW = img.naturalWidth || 1024;
      const natH = img.naturalHeight || 1024;
      const sw = natW / numCols;
      const sh = natH / numRows;

      const centerX = numCols / 2;
      const centerY = numRows / 2;
      const maxDist = Math.hypot(centerX, centerY);

      for (let c = 0; c < numCols; c++) {
        for (let r = 0; r < numRows; r++) {
          const jitter = (Math.sin(c * 4.1 + r * 6.7) * 0.5 + 0.5) * 0.22;
          let order = 0;

          if (direction === "down") {
            // Scrolling down: blocks construct cascading top to bottom
            order = (r / numRows) * 0.74 + (c / numCols) * 0.08 + jitter * 0.18;
          } else if (direction === "up") {
            // Scrolling up: blocks construct cascading bottom to top
            order = ((numRows - 1 - r) / numRows) * 0.74 + (c / numCols) * 0.08 + jitter * 0.18;
          } else {
            // Refresh / Mount: cascading radial wave from center outward
            const dist = Math.hypot(c - centerX, r - centerY);
            order = (dist / maxDist) * 0.76 + jitter * 0.24;
          }

          blocks.push({
            col: c,
            row: r,
            x: c * bw,
            y: r * bh,
            w: bw + 0.6, // avoid subpixel gap seams
            h: bh + 0.6,
            sx: c * sw,
            sy: r * sh,
            sw,
            sh,
            order,
          });
        }
      }
    };

    const startBuild = (direction: "center" | "down" | "up" = "center") => {
      if (isReduced) {
        buildProgress = 2.0;
        isBuilding = false;
        return;
      }
      initBlocks(direction);
      buildProgress = 0;
      isBuilding = true;
    };
    triggerBuildRef.current = (dir = "center") => startBuild(dir);

    const handleResize = () => {
      if (!canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initBlocks("center");
    };

    img.onload = () => {
      setIsReady(true);
      handleResize();
      startBuild("center");
    };

    // ─── Scroll Driven Block Creation ───
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let wasInView = false;

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight || 1;
      const inView = rect.top < windowHeight * 0.85 && rect.bottom > windowHeight * 0.15;
      const now = performance.now();

      // When scrolling into view, trigger block-by-block construction
      if (inView && !wasInView) {
        if (now - lastTriggerTime > 800) {
          lastTriggerTime = now;
          startBuild(deltaY >= 0 ? "down" : "up");
        }
      } else if (inView && !isBuilding && Math.abs(deltaY) > 35) {
        // Re-construct blocks on active user scroll through the section
        if (now - lastTriggerTime > 2400) {
          lastTriggerTime = now;
          startBuild(deltaY >= 0 ? "down" : "up");
        }
      }

      wasInView = inView;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // IntersectionObserver to trigger when scrolling into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && img.complete) {
            const now = performance.now();
            if (now - lastTriggerTime > 800) {
              lastTriggerTime = now;
              const dir = window.scrollY >= lastScrollY ? "down" : "up";
              startBuild(dir);
            }
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(container);

    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isVisible || !img.complete) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Advance build progress smoothly
      if (isBuilding && !isReduced) {
        buildProgress += delta * buildSpeed;
        if (buildProgress >= 1.25) {
          isBuilding = false;
        }
      }

      // Draw photo block by block
      const currentT = isBuilding ? buildProgress : 2.0;

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];

        if (currentT < b.order) {
          // Block not yet created: pure dark with subtle digital grid coordinate dot
          ctx.fillStyle = "rgba(0, 229, 255, 0.03)";
          ctx.fillRect(b.x + b.w / 2 - 1, b.y + b.h / 2 - 1, 2, 2);
        } else {
          // Block is created!
          const timeSince = (currentT - b.order) / 0.18; // 0 to 1 over 180ms

          if (timeSince < 1.0) {
            // Materializing block: zooms in with electric cyan flash
            const scale = 0.5 + 0.5 * timeSince;
            const drawW = b.w * scale;
            const drawH = b.h * scale;
            const drawX = b.x + (b.w - drawW) / 2;
            const drawY = b.y + (b.h - drawH) / 2;

            // Draw image block slice
            ctx.drawImage(img, b.sx, b.sy, b.sw, b.sh, drawX, drawY, drawW, drawH);

            // Glowing cyan outline on newly created block
            ctx.shadowColor = "#00E5FF";
            ctx.shadowBlur = 8;
            ctx.strokeStyle = `rgba(0, 229, 255, ${(1 - timeSince) * 0.95})`;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(drawX, drawY, drawW, drawH);
            ctx.shadowBlur = 0;
          } else {
            // Fully placed block: exact slice of the photo
            ctx.drawImage(img, b.sx, b.sy, b.sw, b.sh, b.x, b.y, b.w, b.h);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [src]);

  const handlePhotoClick = useCallback(() => {
    if (triggerBuildRef.current) {
      triggerBuildRef.current("center");
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handlePhotoClick}
      className={`group relative cursor-pointer select-none overflow-hidden rounded-sm bg-[#010408] ${className}`}
      title="Click to reconstruct photo block by block"
    >
      {/* ─── Realtime Block-by-Block Canvas (Creates whole photo block by block) ─── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="relative z-10 block h-auto w-full"
        style={{ aspectRatio: "1 / 1" }}
      />
    </div>
  );
}
