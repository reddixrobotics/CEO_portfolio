"use client";

import React, { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface FloatingParticlesProps {
  count?: number;
}

// Exact particle colors visible in reference image:
// Small glowing cyan/white square pixel dots scattered around the robot
const PARTICLE_COLORS = [
  new THREE.Color("#00d8ff"), // bright cyan
  new THREE.Color("#38bdf8"), // sky blue
  new THREE.Color("#cbd5e1"), // soft white
  new THREE.Color("#94a3b8"), // slate
  new THREE.Color("#64748b"), // darker slate
];

export default function FloatingParticles({ count = 100 }: FloatingParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate deterministic particle data
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 10,
        // Bias particles toward the right (robot) side of the scene
        z: (Math.random() - 0.5) * 7 - 1.5,
        speedY: Math.random() * 0.12 + 0.03,
        speedX: (Math.random() - 0.5) * 0.04,
        // Very small scale — exact tiny pixel squares from reference
        scale: Math.random() * 0.045 + 0.018,
      });
    }
    return data;
  }, [count]);

  // Assign per-instance colors
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const colorIdx = Math.floor(Math.random() * PARTICLE_COLORS.length);
      meshRef.current.setColorAt(i, PARTICLE_COLORS[colorIdx]);
    }
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [count]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.y += p.speedY * delta;
      p.x += p.speedX * delta;
      if (p.y > 5.5)  p.y = -5.5;
      if (p.x > 7)    p.x = -7;
      if (p.x < -7)   p.x = 7;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* Square pixel particle geometry */}
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        transparent
        opacity={0.30}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
