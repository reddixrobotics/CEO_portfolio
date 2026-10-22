"use client";

import React, { useEffect, useRef, useState, useMemo, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import MobileAmrRobot from "./MobileAmrRobot";
import FloatingParticles from "./FloatingParticles";
import { useDeviceQualityTier, FpsGuard } from "./QualityGuard";
import CyberneticFloorGrid from "./CyberneticFloorGrid";
import PostProcessingBloom from "./PostProcessingBloom";

interface RobotCanvasProps {
  onLoaded?: () => void;
  scrollProgress?: number;
}

export type ViewportMode = "desktop" | "laptop" | "tablet" | "mobile" | "smallMobile";

function getViewportMode(w: number): ViewportMode {
  if (w >= 1280) return "desktop";
  if (w >= 1024) return "laptop";
  if (w >= 768) return "tablet";
  if (w >= 380) return "mobile";
  return "smallMobile";
}

/**
 * Cinematic 3D Scene Controller for the continuous Robot scroll transition:
 * - Phase 1 (p = 0): Resting at Hero (responsive positioning across devices).
 * - Phase 2 (0 < p <= 0.35): Moves forward toward camera with perspective depth.
 * - Phase 3 (0.35 < p <= 0.85): Banks & curves across toward the bio dock, scaling down smoothly.
 * - Phase 4 (0.85 < p <= 1.0): Settles beside the CEO portrait with idle hover.
 */
function CinematicRobotScene({
  scrollProgress = 0,
  viewportMode = "desktop",
  useHalftone = false,
  clipY = 10,
  styleMix = 0,
  prefersReducedMotion = false,
}: {
  scrollProgress?: number;
  viewportMode?: ViewportMode;
  useHalftone?: boolean;
  clipY?: number;
  styleMix?: number;
  prefersReducedMotion?: boolean;
}) {
  const currentP = useRef(0);
  const robotGroupRef = useRef<THREE.Group>(null);
  const headlightTargetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const [wheelDriveSpeed, setWheelDriveSpeed] = useState(0.25);

  const isDesktop = viewportMode === "desktop";
  const isLaptop = viewportMode === "laptop";
  const isTablet = viewportMode === "tablet";
  const isMobile = viewportMode === "mobile" || viewportMode === "smallMobile";
  const isSmallMobile = viewportMode === "smallMobile";

  // Floor Y level according to device framing
  const floorY = isMobile ? (isSmallMobile ? -0.62 : -0.58) : isTablet ? -0.62 : -0.56;

  const targetAboutPos = useRef({ x: isDesktop ? -0.92 : isTablet ? -0.75 : 0.0, z: isMobile ? -0.8 : 0.15 });
  const targetProjPos = useRef({ x: isDesktop ? -0.42 : isTablet ? -0.25 : 0.0, z: 0.20 });
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -floorY), [floorY]);
  const ndcVec = useMemo(() => new THREE.Vector2(), []);

  const [currentScale, setCurrentScale] = useState(0.80);
  const [currentPos, setCurrentPos] = useState<[number, number]>([1.18, 0]);

  useFrame((state, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    // Smooth dampening of progress for organic momentum without jitter
    currentP.current = THREE.MathUtils.damp(
      currentP.current,
      scrollProgress,
      prefersReducedMotion ? 24 : 6.5,
      clampedDelta
    );
    const p = currentP.current;

    // Dynamically calculate 3D target coordinates relative to DOM elements
    if (typeof document !== "undefined") {
      const bioDock = document.getElementById("bio-robot-dock");
      if (bioDock) {
        const rect = bioDock.getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0) {
          const screenX = rect.left + rect.width / 2;
          const screenY = rect.top + rect.height / 2;
          const ndcX = (screenX / window.innerWidth) * 2 - 1;
          const ndcY = -(screenY / window.innerHeight) * 2 + 1;
          ndcVec.set(ndcX, ndcY);
          raycaster.setFromCamera(ndcVec, state.camera);
          const hit = new THREE.Vector3();
          if (raycaster.ray.intersectPlane(floorPlane, hit)) {
            if (isDesktop || isLaptop) {
              targetAboutPos.current.x = THREE.MathUtils.clamp(hit.x, -1.35, -0.75);
              targetAboutPos.current.z = THREE.MathUtils.clamp(hit.z, -0.6, 0.6);
            } else if (isTablet) {
              targetAboutPos.current.x = THREE.MathUtils.clamp(hit.x, -0.85, 0.85);
              targetAboutPos.current.z = THREE.MathUtils.clamp(hit.z, -1.2, 0.4);
            } else {
              targetAboutPos.current.x = THREE.MathUtils.clamp(hit.x, -0.5, 0.5);
              targetAboutPos.current.z = THREE.MathUtils.clamp(hit.z, -1.4, 0.3);
            }
          }
        }
      } else {
        targetAboutPos.current.x = isDesktop || isLaptop ? -0.92 : isTablet ? -0.75 : 0.0;
        targetAboutPos.current.z = isMobile ? -0.8 : 0.15;
      }

      targetProjPos.current.x = isDesktop ? -0.42 : isTablet ? -0.25 : 0.0;
      targetProjPos.current.z = 0.20;
    }

    // --- Responsive Waypoint Calculations ---
    let startX = 1.18;
    let startZ = 0.0;
    let startScale = 0.80;
    let startRotY = -0.58;

    if (isDesktop) {
      startX = 1.18;
      startScale = 0.80;
      startRotY = -0.58;
    } else if (isLaptop) {
      startX = 1.02;
      startScale = 0.68;
      startRotY = -0.52;
    } else if (isTablet) {
      // Reposition on tablet: sits gracefully on the right half, clear of text & button
      startX = 0.68;
      startZ = 0.08;
      startScale = 0.50;
      startRotY = -0.42;
    } else if (viewportMode === "mobile") {
      // Single-column: place robot forward toward viewer and centered between heading and CTA
      startX = 0.0;
      startZ = 0.58;
      startScale = 0.48;
      startRotY = -0.10;
    } else {
      // Small mobile (320px)
      startX = 0.0;
      startZ = 0.50;
      startScale = 0.40;
      startRotY = -0.10;
    }

    // Target 1 (About section):
    const aboutX = targetAboutPos.current.x;
    const aboutZ = targetAboutPos.current.z;
    const aboutScale = isDesktop ? 0.095 : isTablet ? 0.075 : isSmallMobile ? 0.048 : 0.055;
    const aboutRotY = isDesktop || isLaptop ? -0.12 : 0.0;

    // Target 2 (Featured Projects section):
    const projX = isDesktop ? targetProjPos.current.x : isTablet ? -0.25 : 0.0;
    const projZ = targetProjPos.current.z;
    const projScale = isDesktop ? 0.68 : isTablet ? 0.52 : 0.38;
    const projRotY = isDesktop ? -0.15 : 0.0;

    let posX = startX;
    let posZ = startZ;
    let scale = startScale;
    let rotY = startRotY;
    let rotX = 0;
    let rotZ = 0;
    let currentSpeed = prefersReducedMotion ? 0.0 : 0.22;

    if (p <= 0.01) {
      // Home page idle
      posX = startX;
      posZ = startZ;
      scale = startScale;
      rotY = startRotY;
      rotX = 0;
      rotZ = 0;
      currentSpeed = prefersReducedMotion ? 0.0 : 0.22;
    } else if (p <= 0.25) {
      // Stage 1: Accelerate forward
      const t = p / 0.25;
      const alignT = Math.sin((t * Math.PI) / 2);
      posX = THREE.MathUtils.lerp(startX, isDesktop || isLaptop ? 0.65 : 0.0, t);
      posZ = THREE.MathUtils.lerp(startZ, 1.25, alignT);
      scale = THREE.MathUtils.lerp(startScale, (isDesktop || isLaptop ? 0.70 : 0.45), t);
      rotY = THREE.MathUtils.lerp(startRotY, -0.20, alignT);
      rotX = -0.026 * Math.sin(t * Math.PI);
      currentSpeed = prefersReducedMotion ? 0 : 6.8 * alignT;
    } else if (p <= 0.75) {
      // Stage 2: Highway driving along curve toward Bio dock
      const t = (p - 0.25) / 0.50;
      const s = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      posX = THREE.MathUtils.lerp(isDesktop || isLaptop ? 0.65 : 0.0, aboutX, s);
      posZ = THREE.MathUtils.lerp(1.25, aboutZ, s);
      scale = THREE.MathUtils.lerp(isDesktop || isLaptop ? 0.70 : 0.45, aboutScale, s);
      rotY = THREE.MathUtils.lerp(-0.20, aboutRotY, s) - 0.08 * Math.sin(t * Math.PI);
      rotZ = -0.038 * Math.sin(t * Math.PI);
      currentSpeed = prefersReducedMotion ? 0 : 6.8;
    } else if (p <= 1.0) {
      // Stage 3 & 4: Decelerate and dock beside bio portrait
      const t = (p - 0.75) / 0.25;
      posX = aboutX;
      posZ = aboutZ;
      scale = aboutScale;
      rotY = THREE.MathUtils.lerp(aboutRotY - 0.04, aboutRotY, t);
      rotZ = 0;
      rotX = 0.016 * Math.sin(t * Math.PI);
      currentSpeed = prefersReducedMotion ? 0 : Math.max(0, 6.8 * (1 - t * 1.15));
      if (p >= 0.98) {
        currentSpeed = 0.0;
        rotX = 0;
        rotZ = 0;
      }
    } else {
      // Bio -> Featured Projects driving journey
      const u = Math.min(1, Math.max(0, p - 1.0));
      const midX = isDesktop || isLaptop ? -0.72 : 0.0;
      const highwayZ = -0.65;
      const steerAngle = isDesktop ? 0.38 : 0.08;

      if (u <= 0.22) {
        const tA = u / 0.22;
        const easeA = tA * tA;
        posX = THREE.MathUtils.lerp(aboutX, midX, tA);
        posZ = THREE.MathUtils.lerp(aboutZ, highwayZ, tA);
        scale = THREE.MathUtils.lerp(aboutScale, 0.18, tA);
        rotY = THREE.MathUtils.lerp(aboutRotY, steerAngle, Math.sin((tA * Math.PI) / 2));
        rotX = -0.026 * Math.sin(tA * Math.PI);
        rotZ = 0.015 * Math.sin(tA * Math.PI);
        currentSpeed = prefersReducedMotion ? 0 : 7.2 * easeA;
      } else if (u <= 0.78) {
        const tB = (u - 0.22) / 0.56;
        const sB = tB < 0.5 ? 2 * tB * tB : 1 - Math.pow(-2 * tB + 2, 2) / 2;
        posX = THREE.MathUtils.lerp(midX, projX, sB);
        posZ = THREE.MathUtils.lerp(highwayZ, projZ, sB);
        scale = THREE.MathUtils.lerp(0.18, projScale, sB);
        rotY = THREE.MathUtils.lerp(steerAngle, projRotY, sB) + 0.05 * Math.sin(tB * Math.PI);
        rotZ = -0.035 * Math.sin(tB * Math.PI);
        rotX = 0;
        currentSpeed = prefersReducedMotion ? 0 : 7.2;
      } else {
        const tC = Math.min(1, Math.max(0, (u - 0.78) / 0.12));
        posX = projX;
        posZ = projZ;
        scale = projScale;
        rotY = projRotY;
        rotZ = 0;
        rotX = 0;
        currentSpeed = prefersReducedMotion ? 0 : Math.max(0, 3.0 * (1 - tC));
      }

      if (u >= 0.85) {
        posX = projX;
        posZ = projZ;
        scale = projScale;
        rotY = projRotY;
        rotX = 0;
        rotZ = 0;
        currentSpeed = 0.0;
      }
    }

    // STRICT GROUND CONTACT: Wheels ALWAYS pinned to road plane
    const posY = floorY + 0.39 * scale;

    if (robotGroupRef.current) {
      robotGroupRef.current.position.set(posX, posY, posZ);
      robotGroupRef.current.scale.setScalar(scale);
      robotGroupRef.current.rotation.set(rotX, rotY, rotZ);
    }

    // Forward headlight aim target
    if (headlightTargetRef.current) {
      headlightTargetRef.current.position.set(
        posX + Math.sin(rotY) * 3.0 * Math.max(0.4, scale),
        floorY,
        posZ + Math.cos(rotY) * 3.0 * Math.max(0.4, scale)
      );
    }

    // Responsive Camera Framing
    if (p <= 0.05) {
      if (isMobile) {
        state.camera.position.set(0.0, 0.50, 5.2);
        state.camera.lookAt(0.0, -0.28, 0);
      } else if (isTablet) {
        state.camera.position.set(0.0, 0.65, 5.2);
        state.camera.lookAt(0.15, 0.04, 0);
      } else {
        state.camera.position.set(0.0, 0.72, 5.2);
        state.camera.lookAt(0.24, 0.08, 0);
      }
    } else {
      const uCam = Math.min(1, Math.max(0, (p - 1.0) / 1.0));
      const sCam = uCam < 0.5 ? 2 * uCam * uCam : 1 - Math.pow(-2 * uCam + 2, 2) / 2;
      const baseCamY = isMobile ? 0.45 : isTablet ? 0.65 : 0.72;
      const baseLookX = isMobile ? 0.0 : isTablet ? 0.15 : 0.24;
      const camZ = THREE.MathUtils.lerp(5.2, 4.96, sCam);
      const camX = THREE.MathUtils.lerp(0.0, -0.07, sCam);
      const camY = THREE.MathUtils.lerp(baseCamY, baseCamY - 0.07, sCam);
      state.camera.position.set(camX, camY, camZ);
      state.camera.lookAt(
        THREE.MathUtils.lerp(baseLookX, -0.16, Math.min(1, p / 2.0)),
        THREE.MathUtils.lerp(0.08, 0.03, Math.min(1, p / 2.0)),
        0
      );
    }

    setWheelDriveSpeed(currentSpeed);
    setCurrentScale(scale);
    setCurrentPos([posX, posZ]);
  });

  return (
    <>
      {/* Forward-aimed Headlight Illuminating the Road Ahead */}
      <primitive object={headlightTargetRef.current} />
      <spotLight
        position={[currentPos[0], floorY + 0.15 * currentScale, currentPos[1] + 0.40 * currentScale]}
        target={headlightTargetRef.current}
        angle={Math.PI / 5.5}
        penumbra={0.85}
        intensity={prefersReducedMotion ? 0.2 : (wheelDriveSpeed > 0.5 ? 0.38 : 0.18) * Math.min(1.0, currentScale / 0.5)}
        distance={3.2 * Math.max(0.3, currentScale)}
        color="#00f0ff"
      />

      {/* Continuous 3D Reflective Cybernetic Floor Grid across Hero, About & Projects */}
      <CyberneticFloorGrid
        centerX={currentPos[0]}
        centerZ={currentPos[1]}
        floorY={floorY}
        driveSpeed={wheelDriveSpeed}
        robotScale={currentScale}
      />

      {/* The 3D Robot Mesh Group */}
      <group ref={robotGroupRef}>
        <MobileAmrRobot
          useHalftoneShader={useHalftone}
          clipY={clipY}
          scale={1}
          styleMix={styleMix}
          position={[0, 0, 0]}
          baseRotationY={0}
          driveSpeed={wheelDriveSpeed}
        />
      </group>
    </>
  );
}

export default function RobotCanvas({ onLoaded, scrollProgress = 0 }: RobotCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [useHalftone, setUseHalftone] = useState(false);
  const [clipY, setClipY] = useState(10.0);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [forcedLowDpr, setForcedLowDpr] = useState(false);

  const quality = useDeviceQualityTier();

  useEffect(() => {
    const handleResize = () => setViewportMode(getViewportMode(window.innerWidth));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On mobile screens, clamp DPR to 1.5 for buttery smooth 60 FPS battery performance
  const activeDpr = useMemo(() => {
    if (forcedLowDpr) return 1.0;
    if (viewportMode === "mobile" || viewportMode === "smallMobile") {
      return Math.min(quality.dpr, 1.5);
    }
    return quality.dpr;
  }, [quality.dpr, viewportMode, forcedLowDpr]);

  // Pause render loop when offscreen
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const [styleMix, setStyleMix] = useState(0.0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none overflow-hidden max-w-full"
    >
      <Canvas
        frameloop={isInView ? "always" : "never"}
        dpr={activeDpr}
        gl={{
          antialias: quality.antialias,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{ position: [0.0, 0.72, 5.2], fov: 34 }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0);
          camera.lookAt(0.24, 0.08, 0);
          onLoaded?.();
          return () => {
            gl.forceContextLoss();
            gl.dispose();
          };
        }}
        className="pointer-events-auto h-full w-full"
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#000000", 6.0, 19.0]} />

          {/* Clean balanced studio lighting */}
          <ambientLight intensity={0.55} />
          <directionalLight position={[3, 5, 4]} intensity={1.0} color="#ffffff" />
          <pointLight position={[-2.5, 2.5, -3]} intensity={1.4} color="#00a8e8" distance={10} />
          <pointLight position={[3, 2, -2]} intensity={1.0} color="#0088cc" distance={8} />

          {/* Sparse floating particles */}
          <FloatingParticles count={25} />

          {/* Animated 3D Robot Scene with continuous 4-phase transition */}
          <CinematicRobotScene
            scrollProgress={scrollProgress}
            viewportMode={viewportMode}
            useHalftone={useHalftone}
            clipY={clipY}
            styleMix={styleMix}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Post-Processing Bloom */}
          <PostProcessingBloom strength={0.70} radius={0.60} threshold={0.70} />

          <FpsGuard onDowngrade={() => setForcedLowDpr(true)} />
        </Suspense>
      </Canvas>

      {/* ─── Deep Black Vignette: Fades out as user scrolls toward About ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 2.2),
          background: `
            linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 20%, transparent 40%),
            linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 20%, transparent 40%),
            radial-gradient(ellipse 90% 75% at 54% 42%, transparent 45%, rgba(0,0,0,0.4) 75%, rgba(0,0,0,0.75) 100%)
          `,
        }}
      />

      {/* MODE: Holographic Wireframes pill: Bottom-left as shown in reference ─── */}
      <div
        className="absolute z-20 flex items-center gap-1.5 sm:gap-2 border border-zinc-800 bg-black/85 font-mono uppercase backdrop-blur-md transition-opacity duration-300 bottom-4 left-4 sm:bottom-6 sm:left-8 lg:left-12 px-3 py-1.5 max-w-[calc(100%-11rem)] sm:max-w-none rounded-full"
        style={{
          opacity: Math.max(0, 1 - scrollProgress * 3.0),
          pointerEvents: scrollProgress > 0.15 ? "none" : "auto",
          fontSize: "9.5px",
          letterSpacing: "0.12em",
        }}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            styleMix < 0.5
              ? "bg-cyan-400 shadow-[0_0_5px_#38bdf8]"
              : "bg-emerald-400"
          }`}
        />
        <span className="text-zinc-500 font-semibold">MODE:</span>
        <button
          type="button"
          suppressHydrationWarning
          onClick={() => {
            const next = styleMix > 0.5 ? 0.0 : 1.0;
            setStyleMix(next);
            setUseHalftone(next > 0.5);
          }}
          className="text-white transition-colors hover:text-sky-400 font-semibold"
        >
          {styleMix < 0.5 ? "Holographic Wireframes" : "Halftone Dot-Matrix"}
        </button>
      </div>
    </div>
  );
}
