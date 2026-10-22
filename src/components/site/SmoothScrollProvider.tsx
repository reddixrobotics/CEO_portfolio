"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/motion/gsapUtils";

interface SmoothScrollContextValue {
  lenis: Lenis | null;
  remeasure: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  remeasure: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  const remeasure = () => {
    if (lenisRef.current) {
      lenisRef.current.resize();
    }
    ScrollTrigger.refresh();
  };

  useEffect(() => {
    registerGSAP();

    // 1. Create Lenis with autoRaf: false (single unified animation loop)
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    });

    lenisRef.current = lenis;
    if (typeof window !== "undefined") {
      (window as any).lenis = lenis;
    }

    // 2. Synchronize Lenis scroll event directly with ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // 3. Drive Lenis entirely through GSAP's RAF ticker
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // 4. Staggered layout remeasurement to eliminate pin-spacer race conditions
    const timers = [
      setTimeout(() => remeasure(), 150),
      setTimeout(() => remeasure(), 600),
      setTimeout(() => remeasure(), 1500),
    ];

    const handleResize = () => {
      remeasure();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      timers.forEach((id) => clearTimeout(id));
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, remeasure }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
