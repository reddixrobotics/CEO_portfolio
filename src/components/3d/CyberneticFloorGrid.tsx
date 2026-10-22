"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";

interface CyberneticFloorGridProps {
  centerX?: number;
  centerZ?: number;
  floorY?: number;
  driveSpeed?: number;
}

interface RadialStreakData {
  theta: number;       // Angle radiating from vanishing point
  r: number;           // Radial distance along ray
  speed: number;       // Forward movement speed
  length: number;      // Streak quad length
  width: number;       // Streak quad thickness
  peakBrightness: number;
}

/**
 * Dense Neon Speed Tunnel Streaks (~200 Quads)
 * Strictly radiating from single vanishing point behind the robot toward the camera.
 * Colors: bright cyan #00e5ff near camera, fading to deep blue #0a3a5a and black toward horizon.
 */
function SpeedTunnelStreaks({
  count = 200,
  vanishingX = 5.8,
  vanishingZ = -22.0,
  minR = 4.5,
  maxR = 30.0,
  driveSpeed = 4.5,
}: {
  count?: number;
  vanishingX?: number;
  vanishingZ?: number;
  minR?: number;
  maxR?: number;
  driveSpeed?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Base quad geometry lying flat on floor (X = width, Z = length)
  const quadGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // Luminous laser streak texture with white-hot core and electric-cyan falloff
  const streakTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Longitudinal laser gradient
    const hGrad = ctx.createLinearGradient(0, 0, 256, 0);
    hGrad.addColorStop(0.0, "rgba(0, 0, 0, 0)");
    hGrad.addColorStop(0.18, "rgba(0, 180, 255, 0.40)");
    hGrad.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
    hGrad.addColorStop(0.82, "rgba(0, 229, 255, 0.55)");
    hGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = hGrad;
    ctx.fillRect(0, 0, 256, 32);

    // Lateral gaussian softness
    const vGrad = ctx.createLinearGradient(0, 0, 0, 32);
    vGrad.addColorStop(0.0, "rgba(0, 0, 0, 0.85)");
    vGrad.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
    vGrad.addColorStop(1.0, "rgba(0, 0, 0, 0.85)");
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, 256, 32);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  // Center angle pointing from (vanishingX, vanishingZ) toward camera (0, 5.5)
  const centerTheta = useMemo(
    () => Math.atan2(0 - vanishingX, 5.5 - vanishingZ),
    [vanishingX, vanishingZ]
  );

  // Precompute radial streaks strictly along radial rays
  const streaks = useMemo<RadialStreakData[]>(() => {
    const list: RadialStreakData[] = [];
    const spreadAngle = (24 * Math.PI) / 180; // Focused central corridor matching Image 2

    for (let i = 0; i < count; i++) {
      const u = (i + Math.random() * 0.95) / count;
      const centered = (u - 0.5) * 2.0;
      const theta = centerTheta + Math.sign(centered) * Math.pow(Math.abs(centered), 0.95) * spreadAngle;

      const r = minR + Math.random() * (maxR - minR);
      const isThick = Math.random() < 0.12;
      const width = isThick ? 0.045 + Math.random() * 0.035 : 0.015 + Math.random() * 0.016;
      const length = 1.4 + Math.random() * 2.0;
      const speed = 0.85 + Math.random() * 0.35;
      const peakBrightness = isThick ? 2.5 : 1.4 + Math.random() * 0.8;

      list.push({ theta, r, speed, length, width, peakBrightness });
    }
    return list;
  }, [count, minR, maxR, centerTheta]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const clampedDelta = Math.min(delta, 0.1);
    const range = maxR - minR;

    for (let i = 0; i < count; i++) {
      const s = streaks[i];

      // Move streak toward viewer along radial ray (forward driving effect)
      const effectiveSpeed = driveSpeed > 0.1 ? driveSpeed : 0.35;
      s.r += clampedDelta * effectiveSpeed * s.speed;
      if (s.r > maxR) {
        s.r = minR + (s.r - maxR);
      }

      // 3D Cartesian coordinates from polar ray
      const sinT = Math.sin(s.theta);
      const cosT = Math.cos(s.theta);
      const px = vanishingX + sinT * s.r;
      const pz = vanishingZ + cosT * s.r;

      // Position quad flat on floor
      dummy.position.set(px, 0.005, pz);
      // Strictly lookAt vanishing point — eliminates all vertical or parallel streaks
      dummy.lookAt(vanishingX, 0.005, vanishingZ);
      dummy.scale.set(s.width, 1.0, s.length);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Color gradient: deep blue #0a3a5a -> electric cyan #00e5ff -> white-hot core
      const t = Math.max(0.0, Math.min(1.0, (s.r - minR) / range));
      let rCol = 0, gCol = 0, bCol = 0;

      if (t < 0.28) {
        const sub = t / 0.28;
        rCol = 0.04 * sub;
        gCol = 0.20 * sub;
        bCol = 0.35 * sub;
      } else if (t < 0.65) {
        const sub = (t - 0.28) / 0.37;
        rCol = 0.04 + (0.0 - 0.04) * sub;
        gCol = 0.20 + (0.55 - 0.20) * sub;
        bCol = 0.35 + (0.85 - 0.35) * sub;
      } else {
        const sub = (t - 0.65) / 0.35;
        const glowBoost = s.peakBrightness * (1.0 + sub * 0.8);
        rCol = (0.0 + sub * 0.4) * glowBoost;
        gCol = (0.55 + sub * 0.35) * glowBoost;
        bCol = (0.85 + sub * 0.15) * glowBoost;
      }

      // Corner & lateral fade: streaks smoothly fade out to pitch black towards left and right edges
      let cornerFade = 1.0;
      if (px < -0.1) {
        cornerFade = Math.max(0.0, 1.0 - (-0.1 - px) / 1.6);
      } else if (px > 2.5) {
        cornerFade = Math.max(0.0, 1.0 - (px - 2.5) / 1.6);
      }

      tempColor.setRGB(rCol * cornerFade, gCol * cornerFade, bCol * cornerFade);
      meshRef.current.setColorAt(i, tempColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[quadGeo, undefined, count]}
      frustumCulled={false}
    >
      <meshBasicMaterial
        map={streakTexture || undefined}
        transparent
        opacity={0.92}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

/**
 * Fine Perspective Grid Lines (Converging to Vanishing Point, fading towards outer flanks)
 */
function FinePerspectiveGridLines({
  vanishingX = 5.8,
  vanishingZ = -22.0,
  minR = 4.0,
  maxR = 30.0,
  laneCount = 56,
}: {
  vanishingX?: number;
  vanishingZ?: number;
  minR?: number;
  maxR?: number;
  laneCount?: number;
}) {
  const lineGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const colors: number[] = [];
    const centerTheta = Math.atan2(0 - vanishingX, 5.5 - vanishingZ);
    const spreadAngle = (28 * Math.PI) / 180;

    for (let i = 0; i <= laneCount; i++) {
      const u = (i / laneCount - 0.5) * 2.0;
      const theta = centerTheta + Math.sign(u) * Math.pow(Math.abs(u), 0.95) * spreadAngle;
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);

      pts.push(
        new THREE.Vector3(vanishingX + sinT * minR, 0.002, vanishingZ + cosT * minR),
        new THREE.Vector3(vanishingX + sinT * maxR, 0.002, vanishingZ + cosT * maxR)
      );

      // Fade outer lanes smoothly to black so left & right corners remain dark
      const lateralFalloff = Math.max(0.0, 1.0 - Math.pow(Math.abs(u), 1.8));
      const r = 0.0 * lateralFalloff, g = 0.90 * lateralFalloff, b = 1.0 * lateralFalloff;
      colors.push(r, g, b, r, g, b);
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [vanishingX, vanishingZ, minR, maxR, laneCount]);

  return (
    <lineSegments geometry={lineGeo}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.14}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/**
 * Soft Cyan Glow Pool on Floor Under Robot (~35% intensity, soft #22d3ee gradient)
 */
function SoftGlowPoolUnderRobot({
  centerX = 1.38,
  centerZ = 0,
  robotScale = 0.80,
}: {
  centerX?: number;
  centerZ?: number;
  robotScale?: number;
}) {
  const glowTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const radGrad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    radGrad.addColorStop(0.0, "rgba(0, 217, 255, 0.22)");
    radGrad.addColorStop(0.4, "rgba(0, 140, 220, 0.08)");
    radGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  const s = Math.max(0.2, robotScale);

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[centerX, 0.003, centerZ]}
    >
      <planeGeometry args={[1.8 * s, 2.2 * s]} />
      <meshBasicMaterial
        map={glowTexture || undefined}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * Dynamic Luminous Tire Trails behind the robot's left and right wheels
 * Active when vehicle is driving along the road; smoothly dissolves when stopped.
 */
function TireMotionStreaks({
  centerX = 0,
  centerZ = 0,
  robotScale = 0.38,
  driveSpeed = 0,
}: {
  centerX?: number;
  centerZ?: number;
  robotScale?: number;
  driveSpeed?: number;
}) {
  const halfWheelTrack = 0.76 * robotScale;
  const trailLen = Math.min(2.8, Math.max(0.1, driveSpeed * 0.45 * Math.max(0.3, robotScale)));
  const opacity = Math.min(0.85, Math.max(0, (driveSpeed / 5.0) * 0.85));

  const trailTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 256, 0, 0);
    grad.addColorStop(0.0, "rgba(0, 229, 255, 0.95)");
    grad.addColorStop(0.35, "rgba(0, 180, 255, 0.45)");
    grad.addColorStop(0.85, "rgba(0, 100, 200, 0.10)");
    grad.addColorStop(1.0, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 256);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  if (opacity <= 0.01) return null;

  return (
    <group position={[centerX, 0.003, centerZ]}>
      {/* Left Tire Trail */}
      <mesh position={[-halfWheelTrack, 0, -trailLen / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12 * Math.max(0.4, robotScale), trailLen]} />
        <meshBasicMaterial
          map={trailTexture || undefined}
          color="#00f0ff"
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Right Tire Trail */}
      <mesh position={[halfWheelTrack, 0, -trailLen / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.12 * Math.max(0.4, robotScale), trailLen]} />
        <meshBasicMaterial
          map={trailTexture || undefined}
          color="#00f0ff"
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function CyberneticFloorGrid({
  centerX = 1.38,
  centerZ = 0,
  floorY = -0.769,
  driveSpeed = 4.5,
  robotScale = 0.38,
}: CyberneticFloorGridProps & { robotScale?: number }) {
  return (
    <group position={[0, floorY, 0]}>
      {/* 1. Dark Glossy Reflective Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.005, centerZ]}>
        <planeGeometry args={[52, 52]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mirror={0.30}
          mixBlur={0.85}
          mixStrength={10}
          roughness={0.48}
          depthScale={1.2}
          minDepthThreshold={0.2}
          maxDepthThreshold={1.4}
          color="#020406"
          metalness={0.88}
        />
      </mesh>

      {/* 2. Soft Ground Reflection Pool Under Robot (proportional to robot scale) */}
      <SoftGlowPoolUnderRobot centerX={centerX} centerZ={centerZ} robotScale={robotScale} />

      {/* 3. Luminous Tire Motion Streaks behind wheels when driving */}
      <TireMotionStreaks
        centerX={centerX}
        centerZ={centerZ}
        robotScale={robotScale}
        driveSpeed={driveSpeed}
      />

      {/* 4. Fine Perspective Grid Lines Converging to Vanishing Point (~12% Opacity, NO horizontal noise) */}
      <FinePerspectiveGridLines
        vanishingX={5.8}
        vanishingZ={-22.0}
        minR={4.0}
        maxR={30.0}
        laneCount={56}
      />

      {/* 5. Dense Neon Speed Tunnel Light Streaks (~200 Quads strictly radial from vanishing point) */}
      <SpeedTunnelStreaks
        count={200}
        vanishingX={5.8}
        vanishingZ={-22.0}
        minR={4.5}
        maxR={30.0}
        driveSpeed={driveSpeed}
      />
    </group>
  );
}
