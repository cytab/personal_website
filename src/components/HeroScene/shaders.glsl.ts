/**
 * Shaders for the hero SLAM point-cloud scene.
 * Kept in a .glsl.ts file so the bundler treats them as plain strings.
 *
 * - `pointsVert` / `pointsFrag`: instanced points with per-point origin,
 *   arrival fraction (streams-in at boot), attention bump (cursor focus),
 *   and "locked loop-closure" flag.
 * - `arcVert` / `arcFrag`: thin amber loop-closure arcs drawn as line
 *   strips with a fade-in/fade-out alpha envelope.
 * - `gridVert` / `gridFrag`: minimalist lattice grid on a full-screen quad,
 *   drawn behind the point cloud. Uses a single fullscreen plane so no
 *   geometry bloat.
 */

export const pointsVert = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uCursor;      // in [-1..1] NDC space
  uniform float uCursorOn;   // 0..1 — disabled on coarse pointer
  uniform float uBoot;       // 0..1 — boot progress (streams-in)
  uniform float uPixelRatio;

  attribute vec3 aOrigin;     // final resting position
  attribute vec2 aPhase;      // phase.x = arrival delay, phase.y = jitter seed
  attribute float aLocked;    // 0 or 1 — is part of a closed loop?

  varying float vBrightness;
  varying float vLocked;

  // hash/noise for cheap per-point wobble (no texture fetch)
  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    // Arrival: each point has a per-point delay; arrives over 0.35 of boot.
    float delay = aPhase.x * 0.65;
    float arrival = clamp((uBoot - delay) / 0.35, 0.0, 1.0);
    // Ease-out cubic for arrival
    arrival = 1.0 - pow(1.0 - arrival, 3.0);

    // Points stream in from a larger radius toward their origin.
    vec3 streamStart = aOrigin * 2.0;
    vec3 pos = mix(streamStart, aOrigin, arrival);

    // Ambient drift — tiny brownian jitter, compositor-cheap.
    float t = uTime * 0.35 + aPhase.y * 6.28318;
    pos.x += sin(t) * 0.004;
    pos.y += cos(t * 1.13) * 0.004;

    // Cursor attention: in NDC, pull brightness up for nearby points.
    vec2 ndc = pos.xy; // scene spans -1..1
    float d = distance(ndc, uCursor);
    float attention = uCursorOn * smoothstep(0.35, 0.0, d);

    // Base brightness derives from arrival and is bumped by attention and lock.
    float base = 0.28 + 0.14 * aPhase.y;
    vBrightness = mix(0.0, base, arrival) + attention * 0.45 + aLocked * 0.35;
    vLocked = aLocked;

    gl_Position = vec4(pos.xy, 0.0, 1.0);
    // Point size: smaller inflight, larger at rest, modest attention bump.
    float sizePx = mix(0.6, 2.0, arrival) + attention * 1.6 + aLocked * 0.8;
    gl_PointSize = sizePx * uPixelRatio;
  }
`;

export const pointsFrag = /* glsl */ `
  precision highp float;

  uniform vec3 uInk;
  uniform vec3 uAmber;
  uniform vec3 uCyan;

  varying float vBrightness;
  varying float vLocked;

  void main() {
    // Round point sprite — smooth circular alpha.
    vec2 c = gl_PointCoord - vec2(0.5);
    float r = length(c);
    float alpha = smoothstep(0.5, 0.2, r);
    if (alpha <= 0.01) discard;

    vec3 color = mix(uInk, uAmber, vLocked);
    // Slight cyan-tint on brighter points — feels like recent observation.
    color = mix(color, uCyan, clamp(vBrightness - 0.45, 0.0, 0.6) * 0.25);

    gl_FragColor = vec4(color, alpha * clamp(vBrightness, 0.0, 1.0));
  }
`;

export const arcVert = /* glsl */ `
  precision highp float;
  attribute vec3 aPos;
  varying float vY;
  void main() {
    vY = aPos.y;
    gl_Position = vec4(aPos.xy, 0.0, 1.0);
  }
`;

export const arcFrag = /* glsl */ `
  precision highp float;
  uniform vec3 uAmber;
  uniform float uAlpha;
  void main() {
    gl_FragColor = vec4(uAmber, uAlpha);
  }
`;

export const gridVert = /* glsl */ `
  precision highp float;
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

export const gridFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform vec3 uInkMuted;
  uniform float uAlpha;
  void main() {
    // 8px-equivalent lattice (converted to NDC via resolution).
    vec2 px = (vUv * 0.5 + 0.5) * uResolution;
    vec2 cellA = fract(px / 32.0);       // larger lattice
    vec2 cellB = fract(px / 8.0);        // atomic lattice
    float lineA = min(cellA.x, cellA.y);
    float lineB = min(cellB.x, cellB.y);
    float latticeA = 1.0 - smoothstep(0.0, 0.02, lineA);
    float latticeB = 1.0 - smoothstep(0.0, 0.05, lineB);
    float lattice = max(latticeA * 0.6, latticeB * 0.25);
    gl_FragColor = vec4(uInkMuted, lattice * uAlpha);
  }
`;
