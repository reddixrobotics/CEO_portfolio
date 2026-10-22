/**
 * Motion System Tokens
 * Central repository for all animation timings, easings, and accessibility checks.
 */

export const MOTION_TOKENS = {
  durations: {
    instant: 0.15,
    quick: 0.3,
    normal: 0.5,
    deliberate: 0.8,
    luxurious: 1.2,
    scanSweep: 1.8,
  },
  easings: {
    // Custom cubic-bezier standard curve for robotics UI
    default: "power2.out",
    smooth: "power3.out",
    cinematic: "power4.out",
    snappy: "expo.out",
    springy: "elastic.out(1, 0.75)",
    stepped: "steps(12)",
    linear: "none",
  },
  staggers: {
    tight: 0.04,
    medium: 0.08,
    loose: 0.15,
  },
} as const;

/**
 * Checks if the user has requested reduced motion in their OS settings.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
