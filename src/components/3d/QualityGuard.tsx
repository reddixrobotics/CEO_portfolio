"use client";

import { useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  tier: QualityTier;
  dpr: number;
  antialias: boolean;
  particleCount: number;
}

export function useDeviceQualityTier(): QualitySettings {
  const [settings, setSettings] = useState<QualitySettings>({
    tier: "high",
    dpr: 1.5,
    antialias: true,
    particleCount: 120,
  });

  useEffect(() => {
    // 1. Probe hardware concurrency and GPU heuristics
    const cores = navigator.hardwareConcurrency || 4;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile || cores <= 4) {
      setSettings({
        tier: "medium",
        dpr: 1.0,
        antialias: false,
        particleCount: 60,
      });
    } else {
      setSettings({
        tier: "high",
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        antialias: true,
        particleCount: 140,
      });
    }
  }, []);

  return settings;
}

/**
 * Runtime FPS Guard:
 * Monitors frame times over 60-frame windows.
 * If average FPS dips below 40, automatically steps down quality.
 */
export function FpsGuard({ onDowngrade }: { onDowngrade: () => void }) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const hasDowngraded = useRef(false);

  useFrame(() => {
    if (hasDowngraded.current) return;

    frameCount.current++;
    if (frameCount.current >= 60) {
      const now = performance.now();
      const deltaSec = (now - lastTime.current) / 1000;
      const avgFps = frameCount.current / deltaSec;

      if (avgFps < 42) {
        hasDowngraded.current = true;
        onDowngrade();
      }

      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}
