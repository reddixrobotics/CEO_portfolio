import * as THREE from "three";

export const HalftoneShader = {
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1920, 1080) },
    uDotScale: { value: 6.0 }, // Size of each raster dot cell in pixels
    uClipY: { value: 10.0 }, // Sweeping scan plane clipping threshold
    uScanLineThickness: { value: 0.15 },
    uScanLineColor: { value: new THREE.Color("#38bdf8") }, // Cyan laser scan edge
    uBaseColor: { value: new THREE.Color("#050505") },
    uDotColor: { value: new THREE.Color("#ffffff") },
    uLightPosition: { value: new THREE.Vector3(5, 8, 5) },
    uOpacity: { value: 1.0 },
  },

  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,

  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uDotScale;
    uniform float uClipY;
    uniform float uScanLineThickness;
    uniform vec3 uScanLineColor;
    uniform vec3 uBaseColor;
    uniform vec3 uDotColor;
    uniform vec3 uLightPosition;
    uniform float uOpacity;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying vec3 vViewPosition;

    void main() {
      // 1. Sweeping clip plane (hides geometry above threshold)
      if (vWorldPosition.y > uClipY) {
        discard;
      }

      // 2. Scanline laser edge glow near the clip boundary
      float distToClip = abs(vWorldPosition.y - uClipY);
      if (distToClip < uScanLineThickness) {
        float glow = 1.0 - (distToClip / uScanLineThickness);
        gl_FragColor = vec4(mix(uDotColor, uScanLineColor, glow), 1.0);
        return;
      }

      // 3. Normal & Lighting calculation
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      vec3 lightDir = normalize(uLightPosition);

      float diffuse = max(dot(normal, lightDir), 0.0);
      float rim = 1.0 - max(dot(normal, viewDir), 0.0);
      rim = pow(rim, 2.5);

      // Total light intensity drives the halftone dot diameter
      float intensity = clamp(diffuse * 0.75 + rim * 0.85, 0.02, 1.0);

      // 4. Halftone Screen-Space Dot Matrix
      vec2 screenCoord = gl_FragCoord.xy / uDotScale;
      vec2 cellPos = fract(screenCoord) - 0.5;
      float distFromCenter = length(cellPos);

      // Dot radius mapped from light intensity
      float targetRadius = intensity * 0.46;
      float dotMask = 1.0 - smoothstep(targetRadius - 0.04, targetRadius + 0.04, distFromCenter);

      // Final composite color: Black background with white raster dots
      vec3 finalColor = mix(uBaseColor, uDotColor, dotMask);

      // Add subtle blue-white rim radiance to lit edges
      finalColor += uScanLineColor * rim * 0.25;

      if (uOpacity <= 0.005) discard;

      gl_FragColor = vec4(finalColor, uOpacity);
    }
  `,
};

export function createHalftoneMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: THREE.UniformsUtils.clone(HalftoneShader.uniforms),
    vertexShader: HalftoneShader.vertexShader,
    fragmentShader: HalftoneShader.fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
  });
}
