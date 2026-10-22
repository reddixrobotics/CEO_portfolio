"use client";

import React, { useMemo } from "react";
import * as THREE from "three";

interface CreaseEdgesProps {
  geometry: THREE.BufferGeometry;
  threshold?: number; // In degrees
  color?: string;
  lineWidth?: number;
  opacity?: number;
  blending?: THREE.Blending;
  depthWrite?: boolean;
}

export default function CreaseEdges({
  geometry,
  threshold = 24, // Clean facets angle threshold
  color = "#ffffff",
  opacity = 0.65,
  blending = THREE.NormalBlending,
  depthWrite = true,
}: CreaseEdgesProps) {
  const edgesGeometry = useMemo(() => {
    const thresholdRadians = (threshold * Math.PI) / 180;
    return new THREE.EdgesGeometry(geometry, thresholdRadians);
  }, [geometry, threshold]);

  return (
    <lineSegments geometry={edgesGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={blending}
        depthWrite={depthWrite}
      />
    </lineSegments>
  );
}
