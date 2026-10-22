"use client";

import { useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

interface PostProcessingBloomProps {
  strength?: number;
  radius?: number;
  threshold?: number;
}

/**
 * High-Performance Unreal Bloom Post-Processing Pass
 * Makes cyan laser streaks, wheel neon rims, and LiDAR dome glow softly with zero third-party dependencies.
 */
export default function PostProcessingBloom({
  strength = 0.40,
  radius = 0.32,
  threshold = 0.65,
}: PostProcessingBloomProps) {
  const { gl, scene, camera, size } = useThree();

  const [composer, bloomPass] = useMemo(() => {
    // Create half-float render target for HDR bloom precision
    const renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    });
    const comp = new EffectComposer(gl, renderTarget);

    const renderPass = new RenderPass(scene, camera);
    comp.addPass(renderPass);

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      strength,
      radius,
      threshold
    );
    comp.addPass(bloom);

    return [comp, bloom];
  }, [gl, scene, camera, strength, radius, threshold]);

  useEffect(() => {
    composer.setSize(size.width, size.height);
    bloomPass.resolution.set(size.width, size.height);
  }, [composer, bloomPass, size]);

  // Priority 1 ensures composer renders scene after R3F scene updates
  useFrame(() => {
    composer.render();
  }, 1);

  return null;
}
