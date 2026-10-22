import * as THREE from "three";

/**
 * Procedural CAD Box Grid Shader Material
 * Uses fract() with fwidth() anti-aliasing to render 1px-thin, continuous grid lines
 * on all 6 faces of a box geometry without z-fighting, dashing, or Moire artifacts.
 */
export function createCadBoxGridMaterial({
  colorFill = "#04070a",
  alphaFill = 0.92,
  colorLine = "#7d868c",
  alphaLine = 0.60,
  gridScale = new THREE.Vector3(25, 20, 25),
  boxSize = new THREE.Vector3(1.0, 0.8, 1.0),
  lineWidth = 0.80,
  topOnly = false,
}: {
  colorFill?: string;
  alphaFill?: number;
  colorLine?: string;
  alphaLine?: number;
  gridScale?: THREE.Vector3;
  boxSize?: THREE.Vector3;
  lineWidth?: number;
  topOnly?: boolean;
}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    uniforms: {
      uColorFill: { value: new THREE.Color(colorFill) },
      uAlphaFill: { value: alphaFill },
      uColorLine: { value: new THREE.Color(colorLine) },
      uAlphaLine: { value: alphaLine },
      uGridScale: { value: gridScale },
      uBoxSize: { value: boxSize },
      uLineWidth: { value: lineWidth },
      uTopOnly: { value: topOnly ? 1.0 : 0.0 },
    },
    vertexShader: `
      varying vec3 vLocalPos;
      varying vec3 vNormal;

      void main() {
        vLocalPos = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform vec3 uColorFill;
      uniform float uAlphaFill;
      uniform vec3 uColorLine;
      uniform float uAlphaLine;
      uniform vec3 uGridScale;
      uniform vec3 uBoxSize;
      uniform float uLineWidth;
      uniform float uTopOnly;

      varying vec3 vLocalPos;
      varying vec3 vNormal;

      void main() {
        vec3 an = abs(vNormal);
        vec2 coord;
        vec2 scale;

        // Map local position [-size/2, size/2] to [0, 1] across each face
        vec3 normPos = (vLocalPos / uBoxSize) + 0.5;

        bool isTop = (vNormal.y > 0.5);

        if (uTopOnly > 0.5 && !isTop) {
          gl_FragColor = vec4(uColorFill, uAlphaFill);
          return;
        }

        if (an.x >= an.y && an.x >= an.z) {
          coord = normPos.zy;
          scale = uGridScale.zy;
        } else if (an.y >= an.x && an.y >= an.z) {
          coord = normPos.xz;
          scale = uGridScale.xz;
        } else {
          coord = normPos.xy;
          scale = uGridScale.xy;
        }

        vec2 grid = coord * scale;
        vec2 dGrid = fwidth(grid);
        vec2 wrapped = abs(fract(grid - 0.5) - 0.5);
        vec2 lineDist = wrapped / max(dGrid, vec2(0.0001));
        float minLine = min(lineDist.x, lineDist.y);

        // 1px anti-aliased line
        float lineFactor = 1.0 - clamp(minLine / uLineWidth, 0.0, 1.0);

        // Outer border highlight along edges
        vec2 edgeDist = min(coord, 1.0 - coord) * scale;
        vec2 edgeUnits = edgeDist / max(dGrid, vec2(0.0001));
        float minEdge = min(edgeUnits.x, edgeUnits.y);
        float edgeFactor = 1.0 - clamp(minEdge / (uLineWidth * 1.5), 0.0, 1.0);

        float totalLine = clamp(lineFactor + edgeFactor * 0.7, 0.0, 1.0);

        vec3 outColor = mix(uColorFill, uColorLine, totalLine);
        float outAlpha = mix(uAlphaFill, uAlphaLine, totalLine);

        gl_FragColor = vec4(outColor, outAlpha);
      }
    `,
  });
}

/**
 * Procedural CAD Cylinder Grid Shader Material (Standard Y-Axis Cylinder)
 * Continuous subtle radial grid on face, simple smooth tread (no stacked rings).
 */
export function createCadCylinderGridMaterial({
  colorFill = "#04070a",
  alphaFill = 0.92,
  colorLine = "#38bdf8",
  alphaLine = 0.55,
  radialCells = 32,
  radius = 0.36,
  height = 0.18,
  lineWidth = 0.80,
}: {
  colorFill?: string;
  alphaFill?: number;
  colorLine?: string;
  alphaLine?: number;
  radialCells?: number;
  radius?: number;
  height?: number;
  lineWidth?: number;
}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: true,
    uniforms: {
      uColorFill: { value: new THREE.Color(colorFill) },
      uAlphaFill: { value: alphaFill },
      uColorLine: { value: new THREE.Color(colorLine) },
      uAlphaLine: { value: alphaLine },
      uRadialCells: { value: radialCells },
      uRadius: { value: radius },
      uHeight: { value: height },
      uLineWidth: { value: lineWidth },
    },
    vertexShader: `
      varying vec3 vLocalPos;
      varying vec3 vNormal;

      void main() {
        vLocalPos = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform vec3 uColorFill;
      uniform float uAlphaFill;
      uniform vec3 uColorLine;
      uniform float uAlphaLine;
      uniform float uRadialCells;
      uniform float uRadius;
      uniform float uHeight;
      uniform float uLineWidth;

      varying vec3 vLocalPos;
      varying vec3 vNormal;

      void main() {
        vec3 an = abs(vNormal);
        float totalLine = 0.0;

        if (an.y > 0.5) {
          // Circular face: Cartesian coordinate grid
          vec2 capCoords = (vLocalPos.xz / (uRadius * 2.0) + 0.5) * (uRadialCells * 0.45);
          vec2 dCap = fwidth(capCoords);
          vec2 wrapped = abs(fract(capCoords - 0.5) - 0.5);
          vec2 lineDist = wrapped / max(dCap, vec2(0.0001));
          float minLine = min(lineDist.x, lineDist.y);
          float lineFactor = 1.0 - clamp(minLine / uLineWidth, 0.0, 1.0);

          float rNorm = length(vLocalPos.xz) / uRadius;
          float rimDist = abs(rNorm - 1.0) / max(fwidth(rNorm), 0.0001);
          float rimFactor = 1.0 - clamp(rimDist / (uLineWidth * 1.5), 0.0, 1.0);

          totalLine = clamp(lineFactor + rimFactor, 0.0, 1.0);
        } else {
          // Tread barrel: clean grid with radial lines around circumference and 2 bands along width
          float angle = atan(vLocalPos.z, vLocalPos.x);
          float uCirc = (angle / 6.2831853) + 0.5;
          vec2 barrelCoords = vec2(uCirc * uRadialCells, ((vLocalPos.y / uHeight) + 0.5) * 2.0);
          vec2 dBarrel = fwidth(barrelCoords);
          vec2 wrappedB = abs(fract(barrelCoords - 0.5) - 0.5);
          vec2 lineDistB = wrappedB / max(dBarrel, vec2(0.0001));
          float minLineB = min(lineDistB.x, lineDistB.y);
          float lineFactorB = 1.0 - clamp(minLineB / uLineWidth, 0.0, 1.0);

          float hNorm = (vLocalPos.y / uHeight) + 0.5;
          float edgeDist = min(hNorm, 1.0 - hNorm);
          float edgeFactor = 1.0 - clamp((edgeDist / max(fwidth(hNorm), 0.0001)) / 1.5, 0.0, 1.0);

          totalLine = clamp(lineFactorB + edgeFactor * 0.8, 0.0, 1.0);
        }

        vec3 outColor = mix(uColorFill, uColorLine, totalLine);
        float outAlpha = mix(uAlphaFill, uAlphaLine, totalLine);

        gl_FragColor = vec4(outColor, outAlpha);
      }
    `,
  });
}
