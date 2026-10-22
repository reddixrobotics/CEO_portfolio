"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion/tokens";

interface PixelBox {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  targetAlpha: number;
  type: "outline" | "fill" | "glow" | "red";
  pulseSpeed: number;
  pulseTimer: number;
  lastActivated: number;
}

interface GridParticle {
  progress: number;
  speed: number;
  rayIndex: number;
  size: number;
  alpha: number;
}

export default function PixelBoxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isReduced = prefersReducedMotion();

    // Mouse tracking with smooth lerp
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };

    // Wave parameters
    let waveProgress = -0.2;
    let waveActive = true;
    let initialWave = 0; // radial wave on mount

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initPixels();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Setup pixels
    let pixels: PixelBox[] = [];
    const initPixels = () => {
      pixels = [];
      // Slightly tighter density for a rich cyber matrix across both desktop and mobile
      const density = Math.max(28, Math.min(38, Math.floor(Math.sqrt((width * height) / 650))));
      const cols = Math.floor(width / density);
      const rows = Math.floor(height / density);

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Jitter for organic high-tech distribution
          const jitterX = (Math.random() - 0.5) * density * 0.75;
          const jitterY = (Math.random() - 0.5) * density * 0.75;
          const x = (c + 0.5) * density + jitterX;
          const y = (r + 0.5) * density + jitterY;

          // Pixel size distribution: mostly 2-3.5px, occasional 5px, rare 7px
          const rand = Math.random();
          let size = 2.5;
          if (rand > 0.93) size = 6.5;
          else if (rand > 0.78) size = 4.5;
          else if (rand > 0.50) size = 3.0;

          // Type distribution: outline, fill, subtle glow, or rare red alert accent
          const typeRand = Math.random();
          let type: "outline" | "fill" | "glow" | "red" = "outline";
          if (typeRand > 0.95) type = "red"; // #FF3030 telemetry alert accent
          else if (typeRand > 0.78) type = "glow"; // #00E5FF glowing cyan
          else if (typeRand > 0.52) type = "fill"; // cyan/slate solid fill

          const baseAlpha = type === "red" ? 0.35 : 0.08 + Math.random() * 0.18;

          pixels.push({
            x,
            y,
            size,
            baseAlpha,
            alpha: baseAlpha,
            targetAlpha: baseAlpha,
            type,
            pulseSpeed: 0.015 + Math.random() * 0.035,
            pulseTimer: Math.random() * Math.PI * 2,
            lastActivated: 0,
          });
        }
      }
    };

    // Setup perspective grid particles (traveling along vanishing lines)
    const perspectiveParticles: GridParticle[] = [];
    const numRays = 10;
    for (let i = 0; i < 18; i++) {
      perspectiveParticles.push({
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.006,
        rayIndex: Math.floor(Math.random() * numRays),
        size: 2.5 + Math.random() * 2.5,
        alpha: 0.35 + Math.random() * 0.5,
      });
    }

    // Set initial canvas sizing with DPR
    handleResize();

    let lastTime = performance.now();

    const render = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinate interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Progress horizontal wave
      if (!isReduced) {
        waveProgress += delta * 0.15; // moves across every ~7s
        if (waveProgress > 1.3) {
          waveProgress = -0.3;
        }

        // Expand initial mount wave
        if (initialWave < 1.4) {
          initialWave += delta * 0.6;
        }
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

      // Render pixel boxes
      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];

        if (!isReduced) {
          p.pulseTimer += p.pulseSpeed;

          // Natural breathing
          let activeAlpha = p.baseAlpha + Math.sin(p.pulseTimer) * 0.06;

          // Horizontal digital wave excitation
          const waveX = waveProgress * width;
          const distToWave = Math.abs(p.x - waveX);
          if (distToWave < 110) {
            const waveIntensity = 1 - distToWave / 110;
            activeAlpha = Math.max(activeAlpha, p.baseAlpha + waveIntensity * 0.65);
          }

          // Initial radial wave excitation on mount
          if (initialWave < 1.3) {
            const currentWaveRadius = initialWave * maxRadius;
            const distFromCenter = Math.hypot(p.x - centerX, p.y - centerY);
            const distToRadius = Math.abs(distFromCenter - currentWaveRadius);
            if (distToRadius < 120) {
              const radiusIntensity = 1 - distToRadius / 120;
              activeAlpha = Math.max(activeAlpha, p.baseAlpha + radiusIntensity * 0.7);
            }
          }

          // Mouse proximity reaction
          if (mouse.active) {
            const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
            const mouseRadius = 140;
            if (distToMouse < mouseRadius) {
              const mouseIntensity = (1 - distToMouse / mouseRadius) ** 1.5;
              activeAlpha = Math.max(activeAlpha, p.baseAlpha + mouseIntensity * 0.8);
            }
          }

          // Smooth lerp toward target alpha
          p.alpha += (activeAlpha - p.alpha) * 0.1;
        }

        // Draw the pixel box
        const s = p.size;
        const half = s / 2;

        if (p.type === "red") {
          // Red highlight pixel (#FF3030)
          ctx.fillStyle = `rgba(255, 48, 48, ${Math.min(p.alpha, 0.85)})`;
          ctx.fillRect(p.x - half, p.y - half, s, s);
          ctx.strokeStyle = `rgba(255, 100, 100, ${Math.min(p.alpha * 1.2, 1)})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(p.x - half, p.y - half, s, s);
        } else if (p.type === "glow") {
          // Neon Cyan Glowing Pixel (#00E5FF)
          ctx.shadowColor = "#00E5FF";
          ctx.shadowBlur = p.alpha > 0.4 ? 8 : 4;
          ctx.fillStyle = `rgba(0, 229, 255, ${Math.min(p.alpha * 1.1, 0.95)})`;
          ctx.fillRect(p.x - half, p.y - half, s, s);
          ctx.shadowBlur = 0; // reset
        } else if (p.type === "fill") {
          // Cyan solid or steel gray filled pixel
          ctx.fillStyle = `rgba(0, 217, 255, ${Math.min(p.alpha, 0.75)})`;
          ctx.fillRect(p.x - half, p.y - half, s, s);
        } else {
          // Outlined technical box
          ctx.strokeStyle = `rgba(0, 229, 255, ${Math.min(p.alpha * 1.2, 0.8)})`;
          ctx.lineWidth = 0.85;
          ctx.strokeRect(p.x - half, p.y - half, s, s);

          // Subtle center micro-dot for high-tech HUD look
          if (s >= 5 && p.alpha > 0.3) {
            ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha * 0.8})`;
            ctx.fillRect(p.x - 0.75, p.y - 0.75, 1.5, 1.5);
          }
        }
      }

      // Render traveling perspective grid particles at the bottom horizon
      if (!isReduced) {
        const horizonY = height * 0.72;
        const bottomY = height;
        const originX = width / 2;

        for (let i = 0; i < perspectiveParticles.length; i++) {
          const pt = perspectiveParticles[i];
          pt.progress += pt.speed;
          if (pt.progress > 1) {
            pt.progress = 0;
            pt.rayIndex = Math.floor(Math.random() * numRays);
          }

          // Ray angles spread out from center horizon
          const spreadFactor = (pt.rayIndex / (numRays - 1) - 0.5) * 2; // -1 to 1
          const startX = originX + spreadFactor * (width * 0.15);
          const endX = originX + spreadFactor * (width * 0.65);

          const currentX = startX + (endX - startX) * pt.progress;
          const currentY = horizonY + (bottomY - horizonY) * (pt.progress ** 1.8);

          // Size scales as it approaches foreground
          const pSize = pt.size * (0.6 + pt.progress * 0.8);
          const pAlpha = pt.alpha * Math.sin(pt.progress * Math.PI); // fade in and out

          ctx.fillStyle = `rgba(0, 229, 255, ${pAlpha})`;
          ctx.shadowColor = "#00E5FF";
          ctx.shadowBlur = 6;
          ctx.fillRect(currentX - pSize / 2, currentY - pSize / 2, pSize, pSize);
          ctx.shadowBlur = 0;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] select-none"
      style={{
        opacity: 0.85,
        mixBlendMode: "screen",
      }}
    />
  );
}
