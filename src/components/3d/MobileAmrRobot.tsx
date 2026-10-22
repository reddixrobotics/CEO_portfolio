"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import CreaseEdges from "./CreaseEdges";
import {
  createCadBoxGridMaterial,
  createCadCylinderGridMaterial,
} from "./CadGridMaterial";

interface MobileAmrRobotProps {
  useHalftoneShader?: boolean;
  clipY?: number;
  scale?: number;
  styleMix?: number;
  position?: [number, number, number];
  baseRotationY?: number;
  driveSpeed?: number;
}

/**
 * Realistic Robotic Wheel (Kushi AMR Design)
 * 1. Outer Tire: Open-ended black rubber cylinder with tread lugs and RingGeometry sidewalls.
 * 2. Wheel Rim: Metallic blue rim dish with 10 radial metallic blue spokes.
 * 3. Glowing Effect: Thin, bright cyan-blue emissive ring (#00f0ff) around the rim, subtle blue glow.
 * 4. Center Hub: Metallic blue hub with chrome axle nut & 5 lug nuts.
 * 5. Realistic Depth: Unblocked visible spokes through the tire opening, authentic AMR proportions.
 */
function RealisticRoboticWheel({
  position,
  rotation,
  spinDirection = 1,
  driveSpeed = 4.5,
  outerRadius = 0.22,
  rimRadius = 0.165,
  thickness = 0.11,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  spinDirection?: number;
  driveSpeed?: number;
  outerRadius?: number;
  rimRadius?: number;
  thickness?: number;
}) {
  const spinGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    if (spinGroupRef.current) {
      spinGroupRef.current.rotation.y += clampedDelta * driveSpeed * spinDirection * 2.5;
    }
  });

  const hw = thickness / 2;
  const hubRadius = 0.050;

  // 1. Rubber Materials
  const tireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#121417",
        roughness: 0.85,
        metalness: 0.08,
      }),
    []
  );

  const sidewallMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#16181c",
        roughness: 0.82,
        metalness: 0.06,
        side: THREE.DoubleSide,
      }),
    []
  );

  const treadLugMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1d22",
        roughness: 0.88,
        metalness: 0.05,
      }),
    []
  );

  // 2. Anodized Metallic Blue Materials
  const metallicBlueMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0066cc",
        emissive: new THREE.Color("#002277"),
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.88,
      }),
    []
  );

  const spokeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0088ff",
        emissive: new THREE.Color("#0044cc"),
        emissiveIntensity: 0.55,
        roughness: 0.18,
        metalness: 0.92,
      }),
    []
  );

  const dishBackingMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#041428",
        roughness: 0.40,
        metalness: 0.85,
        side: THREE.DoubleSide,
      }),
    []
  );

  const silverNutMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.22,
        metalness: 0.95,
      }),
    []
  );

  // Open-ended Tire Barrel Cylinder (NO solid end caps, leaves tire center open!)
  const tireTreadGeo = useMemo(
    () => new THREE.CylinderGeometry(outerRadius, outerRadius, thickness, 36, 1, true),
    [outerRadius, thickness]
  );

  // Outer & Inner Sidewall Rings (Ring from rimRadius to outerRadius)
  const sidewallRingGeo = useMemo(
    () => new THREE.RingGeometry(rimRadius, outerRadius, 36),
    [rimRadius, outerRadius]
  );

  // Knobby Robotic Tread Lugs around circumference (28 lugs)
  const lugCount = 28;
  const lugGeo = useMemo(
    () => new THREE.BoxGeometry(0.014, thickness * 0.94, 0.018),
    [thickness]
  );
  const lugs = useMemo(() => {
    const list: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    const r = outerRadius + 0.002;
    for (let i = 0; i < lugCount; i++) {
      const angle = (i / lugCount) * Math.PI * 2;
      list.push({
        pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r],
        rot: [0, -angle, 0],
      });
    }
    return list;
  }, [outerRadius, lugCount]);

  // Metallic Blue Rim Outer Lip Torus
  const rimLipGeo = useMemo(
    () => new THREE.TorusGeometry(rimRadius, 0.008, 14, 36),
    [rimRadius]
  );

  // Recessed Metallic Blue Rim Backing Dish (Circle at depth hw - 0.015)
  const rimDishGeo = useMemo(
    () => new THREE.CircleGeometry(rimRadius, 36),
    [rimRadius]
  );

  // 10 Radial Metallic Blue Spokes (Radiating in X-Z plane on outer face)
  const spokeCount = 10;
  const spokeLength = rimRadius - hubRadius + 0.006;
  const spokeWidth = 0.022;
  const spokeDepth = 0.014; // along local Y axis
  const spokeGeo = useMemo(
    () => new THREE.BoxGeometry(spokeWidth, spokeDepth, spokeLength),
    [spokeWidth, spokeDepth, spokeLength]
  );
  const spokes = useMemo(() => {
    const list: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    const midR = (hubRadius + rimRadius) / 2;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      list.push({
        pos: [Math.sin(angle) * midR, hw - 0.004, Math.cos(angle) * midR],
        rot: [0, angle, 0],
      });
    }
    return list;
  }, [hubRadius, rimRadius, hw, spokeCount]);

  // Center Hub & Axle Nut
  const hubGeo = useMemo(() => new THREE.CylinderGeometry(hubRadius, hubRadius, 0.022, 24), [hubRadius]);
  const axleNutGeo = useMemo(() => new THREE.CylinderGeometry(0.018, 0.018, 0.014, 6), []);
  const lugNutGeo = useMemo(() => new THREE.CylinderGeometry(0.005, 0.005, 0.010, 6), []);
  const lugNuts = useMemo(() => {
    const list: [number, number, number][] = [];
    const r = 0.032;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      list.push([Math.sin(angle) * r, hw + 0.006, Math.cos(angle) * r]);
    }
    return list;
  }, [hw]);

  // Thin, Bright Cyan Neon Emissive Ring on the outer rim lip
  const neonRimGeo = useMemo(
    () => new THREE.TorusGeometry(rimRadius, 0.008, 16, 48),
    [rimRadius]
  );

  // Subtle Controlled Halo
  const haloRimGeo = useMemo(
    () => new THREE.TorusGeometry(rimRadius, 0.022, 16, 48),
    [rimRadius]
  );

  return (
    <group position={position} rotation={rotation}>
      <group ref={spinGroupRef}>
        {/* ─── 1. BLACK RUBBER OPEN TIRE BARREL (No solid end caps) ─── */}
        <mesh geometry={tireTreadGeo} material={tireMat} />

        {/* Outer and Inner Rubber Sidewall Rings (Hollow center exposes rim!) */}
        <mesh geometry={sidewallRingGeo} material={sidewallMat} position={[0, hw, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={sidewallRingGeo} material={sidewallMat} position={[0, -hw, 0]} rotation={[-Math.PI / 2, 0, 0]} />

        {/* Knobby Robotic Tread Lugs around circumference */}
        {lugs.map((l, i) => (
          <mesh key={i} geometry={lugGeo} material={treadLugMat} position={l.pos} rotation={l.rot} />
        ))}

        {/* ─── 2. RECESSED METALLIC BLUE RIM DISH & OUTER LIP ─── */}
        <mesh geometry={rimDishGeo} material={dishBackingMat} position={[0, hw - 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={rimLipGeo} material={metallicBlueMat} position={[0, hw - 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} />

        {/* ─── 3. TEN RADIAL METALLIC BLUE SPOKES (Fully visible through tire opening) ─── */}
        {spokes.map((s, i) => (
          <mesh key={i} geometry={spokeGeo} material={spokeMat} position={s.pos} rotation={s.rot} />
        ))}

        {/* ─── 4. METALLIC BLUE CENTER HUB & SILVER LUG NUTS ─── */}
        <mesh geometry={hubGeo} material={metallicBlueMat} position={[0, hw - 0.004, 0]} />
        {/* Chrome Central Axle Nut */}
        <mesh geometry={axleNutGeo} material={silverNutMat} position={[0, hw + 0.006, 0]} />
        {/* 5 Silver Lug Nuts */}
        {lugNuts.map((p, i) => (
          <mesh key={i} geometry={lugNutGeo} material={silverNutMat} position={p} />
        ))}

        {/* ─── 5. THIN CYAN-BLUE NEON RIM ACCENT RING (Outer Face only) ─── */}
        <mesh geometry={neonRimGeo} position={[0, hw + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial color="#00f0ff" toneMapped={false} />
        </mesh>

        {/* Subtle, Controlled Rim Halo */}
        <mesh geometry={haloRimGeo} position={[0, hw + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <meshBasicMaterial
            color="#0099ff"
            transparent
            opacity={0.24}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function MobileAmrRobot({
  scale = 0.92,
  position = [1.14, -0.25, 0],
  baseRotationY = -0.22, // ~ -12.5° around Y: right wheel outer face faces camera, front turns toward text
  driveSpeed = 4.5,
}: MobileAmrRobotProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const lidarPuckRef = useRef<THREE.Group>(null);

  // Robot pose is stationary: no left-right sway, rock, or lateral translation.
  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    if (lidarPuckRef.current) {
      lidarPuckRef.current.rotation.y += clampedDelta * 2.6;
    }
  });

  // 1. Broad, Rectangular Chassis Box (w=1.40, h=0.72, d=1.10)
  const chassisW = 1.40, chassisH = 0.72, chassisD = 1.10;
  const chassisBoxGeo = useMemo(() => new THREE.BoxGeometry(chassisW, chassisH, chassisD), []);

  // Body Material: matte black fill (#04070a, opacity 0.92) with clean white/grey grid (~20 cells across front)
  const chassisMat = useMemo(
    () =>
      createCadBoxGridMaterial({
        colorFill: "#04070a",
        alphaFill: 0.92,
        colorLine: "#8da0af",
        alphaLine: 0.65,
        gridScale: new THREE.Vector3(20, 11, 16),
        boxSize: new THREE.Vector3(chassisW, chassisH, chassisD),
        lineWidth: 0.85,
      }),
    [chassisW, chassisH, chassisD]
  );

  // 2. Top Chassis Plate: Cyan fill (#38bdf8 / #5fd0dc, opacity ~0.65) with visible grid on top
  const topPlateGeo = useMemo(() => new THREE.BoxGeometry(chassisW, 0.02, chassisD), []);
  const topPlateMat = useMemo(
    () =>
      createCadBoxGridMaterial({
        colorFill: "#38bdf8",
        alphaFill: 0.65,
        colorLine: "#8da0af",
        alphaLine: 0.65,
        gridScale: new THREE.Vector3(20, 1, 16),
        boxSize: new THREE.Vector3(chassisW, 0.02, chassisD),
        lineWidth: 0.85,
      }),
    [chassisW, chassisD]
  );

  // 3. Wide Upper Shelves (thickness ≈ 0.035, width ≈ 1.30, depth ≈ 1.02), light grey (#aab3b9)
  const shelfW = 1.30, shelfH = 0.035, shelfD = 1.02;
  const shelfGeo = useMemo(() => new THREE.BoxGeometry(shelfW, shelfH, shelfD), []);
  const shelfMat = useMemo(
    () =>
      createCadBoxGridMaterial({
        colorFill: "#aab3b9",
        alphaFill: 0.85,
        colorLine: "#8da0af",
        alphaLine: 0.70,
        gridScale: new THREE.Vector3(18, 1, 15),
        boxSize: new THREE.Vector3(shelfW, shelfH, shelfD),
        lineWidth: 0.85,
        topOnly: true,
      }),
    [shelfW, shelfH, shelfD]
  );

  // 4. Vertical Support Columns: 4 corner posts per level, metallic light grey (#b8c0c6)
  const postRadius = 0.022;
  const postHeight = 0.32;
  const postGeo = useMemo(() => new THREE.CylinderGeometry(postRadius, postRadius, postHeight, 16), [postHeight]);
  const postMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#b8c0c6", metalness: 0.50, roughness: 0.25 }),
    []
  );

  // 5. LiDAR Assembly: 2 support posts, metallic disc base, cyan sensor dome with grid
  const lidarPostGeo = useMemo(() => new THREE.CylinderGeometry(postRadius, postRadius, 0.26, 16), []);
  const lidarBaseDiscGeo = useMemo(() => new THREE.CylinderGeometry(0.28, 0.28, 0.025, 32), []);
  const lidarDomeGeo = useMemo(() => new THREE.CylinderGeometry(0.23, 0.23, 0.19, 32, 6), []);
  const lidarDomeMat = useMemo(
    () =>
      createCadCylinderGridMaterial({
        colorFill: "#38bdf8",
        alphaFill: 0.65,
        colorLine: "#8da0af",
        alphaLine: 0.65,
        radialCells: 24,
        radius: 0.23,
        height: 0.19,
        lineWidth: 0.85,
      }),
    []
  );
  const lidarTopCapGeo = useMemo(() => new THREE.CylinderGeometry(0.24, 0.24, 0.02, 32), []);

  // 6. Recessed Front Face Panel (width ≈ 0.54, height ≈ 0.26)
  const facePanelGeo = useMemo(() => new THREE.BoxGeometry(0.54, 0.26, 0.02), []);
  // Eyes: two large, circular expressive eyes (white outer ring + dark pupil)
  const eyeTorusWhite = useMemo(() => new THREE.TorusGeometry(0.055, 0.013, 16, 32), []);
  const eyeCavityDark = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.042, 0.042, 0.014, 24);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);
  // Mouth: dark rectangular slot with crisp white outline
  const mouthSlotGeo = useMemo(() => new THREE.BoxGeometry(0.24, 0.055, 0.015), []);

  // Heights and Spacing:
  const shelf1Y = 0.68;
  const shelf2Y = 1.00;
  const lidarBaseY = 1.26;
  const lidarDomeY = 1.365;

  // Headlights: twin cybernetic cyan illuminators on lower front bumper
  const headlightBezelGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.046, 0.050, 0.02, 24);
    geo.rotateX(Math.PI / 2);
    return geo;
  }, []);
  const headlightLensGeo = useMemo(() => new THREE.CircleGeometry(0.040, 24), []);

  // Tire contact shadow geometry (flat on road under rubber contact patch)
  const tireContactGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.18, 0.28);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);
  const casterContactGeo = useMemo(() => {
    const geo = new THREE.CircleGeometry(0.05, 18);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, []);

  // Corner post positions (shelf half-width = 0.65, shelf half-depth = 0.51, inset slightly)
  const px = 0.55, pz = 0.42;

  // Realistic Kushi AMR Wheel Dimensions & Placement:
  // Outer tire radius: 0.22, thickness: 0.11, rim radius: 0.165
  const wheelRadius = 0.22;
  const wheelThickness = 0.11;
  const rimRadius = 0.165;
  const wheelX = 0.70 + 0.055 + 0.005; // 0.760 (close to chassis sides)
  const wheelY = -0.17; // bottom at -0.17 - 0.22 = -0.39 (touches floor, chassis bottom at -0.36 has 0.03 clearance)

  return (
    <group ref={rootGroupRef} scale={scale} position={position} rotation={[0, baseRotationY, 0]}>
      {/* ─── 1. WIDE MATTE BLACK CHASSIS BOX (w=1.40, h=0.72, d=1.10) ─── */}
      <mesh geometry={chassisBoxGeo} position={[0, 0, 0]} material={chassisMat} />

      {/* ─── 2. TOP CHASSIS PLATE: BRIGHT CYAN FILL WITH GRID ─── */}
      <mesh geometry={topPlateGeo} position={[0, 0.37, 0]} material={topPlateMat} />

      {/* ─── 3. RECESSED FRONT FACE PANEL (with expressive eyes & mouth) ─── */}
      <group position={[0, -0.035, 0.555]}>
        {/* Panel fill */}
        <mesh geometry={facePanelGeo}>
          <meshBasicMaterial color="#05080a" transparent opacity={0.60} />
          <CreaseEdges geometry={facePanelGeo} threshold={15} color="#8da0af" opacity={0.80} depthWrite={false} />
        </mesh>

        {/* Left Eye: White ring with dark center */}
        <group position={[-0.12, 0.040, 0.012]}>
          <mesh geometry={eyeTorusWhite}>
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh geometry={eyeCavityDark}>
            <meshBasicMaterial color="#020406" />
          </mesh>
        </group>

        {/* Right Eye: White ring with dark center */}
        <group position={[0.12, 0.040, 0.012]}>
          <mesh geometry={eyeTorusWhite}>
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh geometry={eyeCavityDark}>
            <meshBasicMaterial color="#020406" />
          </mesh>
        </group>

        {/* Mouth: Dark rectangular slot with thin white outline */}
        <mesh geometry={mouthSlotGeo} position={[0, -0.055, 0.012]}>
          <meshBasicMaterial color="#020406" />
          <CreaseEdges geometry={mouthSlotGeo} threshold={15} color="#ffffff" opacity={0.90} depthWrite={false} />
        </mesh>
      </group>

      {/* ─── 3b. DUAL CYAN HEADLIGHTS (Front Lower Bumper, Illuminating Road Ahead) ─── */}
      <group position={[-0.46, -0.20, 0.552]}>
        {/* Left Headlight Bezel */}
        <mesh geometry={headlightBezelGeo}>
          <meshStandardMaterial color="#0a0e14" metalness={0.90} roughness={0.20} />
          <CreaseEdges geometry={headlightBezelGeo} threshold={20} color="#00e5ff" opacity={0.70} depthWrite={false} />
        </mesh>
        {/* Left Glowing Cyan Lens */}
        <mesh geometry={headlightLensGeo} position={[0, 0, 0.011]}>
          <meshBasicMaterial color="#00f0ff" toneMapped={false} />
        </mesh>
      </group>

      <group position={[0.46, -0.20, 0.552]}>
        {/* Right Headlight Bezel */}
        <mesh geometry={headlightBezelGeo}>
          <meshStandardMaterial color="#0a0e14" metalness={0.90} roughness={0.20} />
          <CreaseEdges geometry={headlightBezelGeo} threshold={20} color="#00e5ff" opacity={0.70} depthWrite={false} />
        </mesh>
        {/* Right Glowing Cyan Lens */}
        <mesh geometry={headlightLensGeo} position={[0, 0, 0.011]}>
          <meshBasicMaterial color="#00f0ff" toneMapped={false} />
        </mesh>
      </group>

      {/* ─── 3c. ROAD CONTACT SHADOWS (Tires firmly touching road, NO floating) ─── */}
      <mesh geometry={tireContactGeo} position={[-wheelX, -0.389, 0]}>
        <meshBasicMaterial color="#000000" transparent opacity={0.80} depthWrite={false} />
      </mesh>
      <mesh geometry={tireContactGeo} position={[wheelX, -0.389, 0]}>
        <meshBasicMaterial color="#000000" transparent opacity={0.80} depthWrite={false} />
      </mesh>
      <mesh geometry={casterContactGeo} position={[0, -0.389, 0.48]}>
        <meshBasicMaterial color="#000000" transparent opacity={0.75} depthWrite={false} />
      </mesh>

      {/* ─── 4. FRONT ROBOTIC CASTER (Matching Kushi AMR reference photo) ─── */}
      <group position={[0, -0.37, 0.48]}>
        {/* Dark Swivel Fork Bracket */}
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.035, 0.035, 0.035]} />
          <meshStandardMaterial color="#1a1e22" metalness={0.70} roughness={0.35} />
        </mesh>
        {/* Dark Rubber Caster Wheel */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.038, 0.038, 0.024, 18]} />
          <meshStandardMaterial color="#121417" metalness={0.15} roughness={0.80} />
        </mesh>
      </group>

      {/* ─── 5. REALISTIC ROBOTIC TIRES WITH METALLIC BLUE SPOKES & CYAN RIM ─── */}
      {/* Left Wheel (axle tilted to -X, outer face points -X) */}
      <RealisticRoboticWheel
        position={[-wheelX, wheelY, 0]}
        rotation={[0, 0, Math.PI / 2]}
        spinDirection={1}
        driveSpeed={driveSpeed}
        outerRadius={wheelRadius}
        rimRadius={rimRadius}
        thickness={wheelThickness}
      />

      {/* Right Wheel (axle tilted to +X, outer face points +X) */}
      <RealisticRoboticWheel
        position={[wheelX, wheelY, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        spinDirection={-1}
        driveSpeed={driveSpeed}
        outerRadius={wheelRadius}
        rimRadius={rimRadius}
        thickness={wheelThickness}
      />

      {/* ─── 6. TIER 1: FOUR CORNER COLUMNS & SHELF 1 ─── */}
      <mesh geometry={postGeo} material={postMat} position={[-px, 0.52, pz]} />
      <mesh geometry={postGeo} material={postMat} position={[px, 0.52, pz]} />
      <mesh geometry={postGeo} material={postMat} position={[-px, 0.52, -pz]} />
      <mesh geometry={postGeo} material={postMat} position={[px, 0.52, -pz]} />

      {/* Shelf 1 (Wide platform, width 1.30, light grey with grid) */}
      <mesh geometry={shelfGeo} position={[0, shelf1Y, 0]} material={shelfMat} />

      {/* ─── 7. TIER 2: FOUR CORNER COLUMNS & SHELF 2 ─── */}
      <mesh geometry={postGeo} material={postMat} position={[-px, 0.84, pz]} />
      <mesh geometry={postGeo} material={postMat} position={[px, 0.84, pz]} />
      <mesh geometry={postGeo} material={postMat} position={[-px, 0.84, -pz]} />
      <mesh geometry={postGeo} material={postMat} position={[px, 0.84, -pz]} />

      {/* Shelf 2 (Wide platform, width 1.30, light grey with grid) */}
      <mesh geometry={shelfGeo} position={[0, shelf2Y, 0]} material={shelfMat} />

      {/* ─── 8. TOP SENSOR ASSEMBLY: TWO SUPPORT POSTS, DISC BASE & CYAN DOME ─── */}
      <mesh geometry={lidarPostGeo} material={postMat} position={[-0.10, 1.13, 0]} />
      <mesh geometry={lidarPostGeo} material={postMat} position={[0.10, 1.13, 0]} />

      {/* Thin Disc Base (radius 0.28) */}
      <mesh geometry={lidarBaseDiscGeo} position={[0, lidarBaseY, 0]}>
        <meshStandardMaterial color="#0c1117" metalness={0.85} roughness={0.30} />
        <CreaseEdges geometry={lidarBaseDiscGeo} threshold={20} color="#8da0af" opacity={0.75} depthWrite={false} />
      </mesh>

      {/* Rotating LiDAR Dome (Cyan fill with grid pattern) */}
      <group ref={lidarPuckRef} position={[0, lidarDomeY, 0]}>
        <mesh geometry={lidarDomeGeo} material={lidarDomeMat} />
        <mesh geometry={lidarTopCapGeo} position={[0, 0.10, 0]}>
          <meshStandardMaterial color="#0c1117" metalness={0.85} roughness={0.30} />
          <CreaseEdges geometry={lidarTopCapGeo} threshold={20} color="#00e5ff" opacity={0.85} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}
