/**
 * HeroScene — vanilla Three.js (no R3F) island for the SLAM scene.
 *
 * We skip @react-three/fiber to keep the bundle under the 200KB gzip
 * budget: R3F pulls in the full Three.js barrel via `import * as THREE
 * from 'three'`, defeating tree-shaking. Writing vanilla WebGL lets us
 * deep-import only the three/src classes we actually touch.
 *
 * Responsibilities:
 *  - Poisson-sampled instanced point cloud with streaming-in boot,
 *    cursor attention, and "locked loop-closure" recoloring.
 *  - Loop-closure arcs drawn as line strips.
 *  - Faint lattice grid as a background fullscreen quad.
 *  - WCAG 2.2.2 pause control.
 *  - Reduced-motion static terminal state (renders one frame, no rAF).
 *  - IntersectionObserver-based off-screen pause.
 *  - Auto-pause at 5s without interaction (SC 2.2.2 autoplay limit).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
// Import only what we need from Three.js — tree-shake the rest.
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer.js';
import { Scene } from 'three/src/scenes/Scene.js';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera.js';
import { BufferAttribute } from 'three/src/core/BufferAttribute.js';
import { BufferGeometry } from 'three/src/core/BufferGeometry.js';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial.js';
import { AdditiveBlending } from 'three/src/constants.js';
import { Color } from 'three/src/math/Color.js';
import { Vector2 } from 'three/src/math/Vector2.js';
import { Points as ThreePoints } from 'three/src/objects/Points.js';
import { LineSegments } from 'three/src/objects/LineSegments.js';
import { Mesh } from 'three/src/objects/Mesh.js';

import { arcFrag, arcVert, gridFrag, gridVert, pointsFrag, pointsVert } from './shaders.glsl.ts';
import { hashSeed, poissonDisk } from './poisson.ts';

type Props = {
  seed?: string;
  locale?: 'en' | 'fr';
  hidePauseControl?: boolean;
  opacity?: number;
  skipBoot?: boolean;
};

const MAX_ARCS = 6;
const ARC_SEGMENTS = 14;

function detectReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function detectCoarsePointer() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(hover: none)').matches
  );
}

export default function HeroScene({
  seed = 'home',
  locale = 'en',
  hidePauseControl = false,
  opacity = 1,
  skipBoot = false,
}: Props) {
  const reduced = useMemo(() => detectReducedMotion(), []);
  const coarse = useMemo(() => detectCoarsePointer(), []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [paused, setPaused] = useState<boolean>(reduced);
  const [userInteracted, setUserInteracted] = useState(false);
  const [inView, setInView] = useState(true);

  // Shared state — mutable to avoid re-renders driving GL.
  const state = useRef({
    cursor: { x: 10, y: 10, active: 0 },
    boot: { value: skipBoot || reduced ? 1 : 0, paused: reduced },
    running: true,
  });

  // Auto-pause at 5s if user hasn't interacted (WCAG 2.2.2).
  useEffect(() => {
    if (reduced || userInteracted || skipBoot) return;
    const timer = window.setTimeout(() => {
      if (!userInteracted) setPaused(true);
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [reduced, userInteracted, skipBoot]);

  // Intersection observer — pause when off-screen.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause on tab hidden.
  useEffect(() => {
    const onVis = () => setInView(!document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Main GL mount/effect. Rebuilds when seed or reduced changes.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block';
    canvas.setAttribute('aria-hidden', 'true');
    wrapper.appendChild(canvas);
    canvasRef.current = canvas;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let renderer: InstanceType<typeof WebGLRenderer>;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch (_e) {
      // WebGL unavailable — fallback is the SSR SVG underneath.
      wrapper.removeChild(canvas);
      return;
    }
    renderer.setPixelRatio(dpr);

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      if (gridMat) gridMat.uniforms.uResolution.value.set(rect.width, rect.height);
    };

    // Compute world aspect from the wrapper rect.
    const rectInit = wrapper.getBoundingClientRect();
    const aspect = rectInit.height / Math.max(rectInit.width, 1);

    // --- Sample the point cloud ---
    const sampled = poissonDisk({
      seed: hashSeed(seed),
      minDist: 0.07,
      aspect,
      maxPoints: 560,
    });
    const count = sampled.length;
    const origins = new Float32Array(count * 3);
    const phases = new Float32Array(count * 2);
    const lockedAttr = new Float32Array(count);
    const lockedMask = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
      const p = sampled[i]!;
      origins[i * 3] = p.x;
      origins[i * 3 + 1] = p.y;
      const ph = Math.abs(Math.sin(i * 12.9898 + 78.233));
      const pj = Math.abs(Math.sin(i * 3.141 + 1.618));
      phases[i * 2] = ph - Math.floor(ph);
      phases[i * 2 + 1] = pj - Math.floor(pj);
    }

    // --- Scene / camera (orthographic so NDC == world) ---
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    // --- Points ---
    const ptsGeo = new BufferGeometry();
    ptsGeo.setAttribute('aOrigin', new BufferAttribute(origins, 3));
    ptsGeo.setAttribute('aPhase', new BufferAttribute(phases, 2));
    ptsGeo.setAttribute('aLocked', new BufferAttribute(lockedAttr, 1));
    ptsGeo.setAttribute('position', new BufferAttribute(new Float32Array(count * 3), 3));

    const ptsMat = new ShaderMaterial({
      vertexShader: pointsVert,
      fragmentShader: pointsFrag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uCursor: { value: new Vector2(10, 10) },
        uCursorOn: { value: 0 },
        uBoot: { value: state.current.boot.value },
        uPixelRatio: { value: dpr },
        uInk: { value: new Color('#E6E1D6') },
        uAmber: { value: new Color('#F3A03B') },
        uCyan: { value: new Color('#62E0C8') },
      },
    });
    const pointsObj = new ThreePoints(ptsGeo, ptsMat);
    scene.add(pointsObj);

    // --- Arcs ---
    const vertsPerArc = ARC_SEGMENTS * 2;
    const arcTotal = MAX_ARCS * vertsPerArc;
    const arcPos = new Float32Array(arcTotal * 3);
    const arcGeo = new BufferGeometry();
    const arcAttr = new BufferAttribute(arcPos, 3);
    arcGeo.setAttribute('aPos', arcAttr);
    arcGeo.setAttribute('position', new BufferAttribute(new Float32Array(arcTotal * 3), 3));
    arcGeo.setDrawRange(0, 0);
    const arcMat = new ShaderMaterial({
      vertexShader: arcVert,
      fragmentShader: arcFrag,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uAmber: { value: new Color('#F3A03B') },
        uAlpha: { value: 0.9 },
      },
    });
    const arcObj = new LineSegments(arcGeo, arcMat);
    scene.add(arcObj);

    // --- Lattice grid ---
    const gridGeo = new BufferGeometry();
    const gridVerts = new Float32Array([-1, -1, 3, -1, -1, 3]);
    gridGeo.setAttribute('aPos', new BufferAttribute(gridVerts, 2));
    gridGeo.setAttribute('position', new BufferAttribute(new Float32Array(9), 3));
    const gridMat = new ShaderMaterial({
      vertexShader: gridVert,
      fragmentShader: gridFrag,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uResolution: { value: new Vector2(rectInit.width, rectInit.height) },
        uInkMuted: { value: new Color('#8E8A82') },
        uAlpha: { value: reduced ? 0.04 : 0.06 },
      },
    });
    const gridObj = new Mesh(gridGeo, gridMat);
    gridObj.frustumCulled = false;
    scene.add(gridObj);

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    // --- Loop closures (CPU simulation) ---
    type Arc = { a: number; b: number; t0: number; life: number };
    const arcs: Arc[] = [];
    let elapsed = 0;
    let nextSpawn = 3.2;

    // Reduced-motion: seed terminal-state arcs at boot.
    if (reduced) {
      let s = 1234567;
      const rand = () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
      };
      for (let attempt = 0; attempt < 40 && arcs.length < 4; attempt++) {
        const a = Math.floor(rand() * count);
        const b = Math.floor(rand() * count);
        if (a === b) continue;
        const ax = origins[a * 3]!;
        const ay = origins[a * 3 + 1]!;
        const bx = origins[b * 3]!;
        const by = origins[b * 3 + 1]!;
        const d = Math.hypot(ax - bx, ay - by);
        if (d > 0.35 && d < 0.85) {
          arcs.push({ a, b, t0: -1000, life: 1e6 });
          lockedMask[a] = 1;
          lockedMask[b] = 1;
        }
      }
    }

    // --- Render loop ---
    let raf = 0;
    let lastT = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const s = state.current;
      if (s.boot.paused) {
        renderer.render(scene, camera); // hold current frame
        return;
      }
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;

      // Boot progress
      if (!skipBoot && !reduced && s.boot.value < 1) {
        s.boot.value = Math.min(1, s.boot.value + dt / 1.8);
      } else if (skipBoot || reduced) {
        s.boot.value = 1;
      }
      ptsMat.uniforms.uTime.value += dt;
      ptsMat.uniforms.uBoot.value = s.boot.value;
      ptsMat.uniforms.uCursor.value.set(s.cursor.x, s.cursor.y);
      ptsMat.uniforms.uCursorOn.value = s.cursor.active;

      // Spawn arcs after boot completes.
      elapsed += dt;
      if (!reduced && s.boot.value >= 1 && elapsed >= nextSpawn) {
        for (let attempt = 0; attempt < 20; attempt++) {
          const a = Math.floor(Math.random() * count);
          const b = Math.floor(Math.random() * count);
          if (a === b || lockedMask[a] || lockedMask[b]) continue;
          const ax = origins[a * 3]!;
          const ay = origins[a * 3 + 1]!;
          const bx = origins[b * 3]!;
          const by = origins[b * 3 + 1]!;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < 0.25 || d > 0.95) continue;
          arcs.push({ a, b, t0: elapsed, life: 1.6 });
          lockedMask[a] = 1;
          lockedMask[b] = 1;
          break;
        }
        nextSpawn = elapsed + 4 + Math.random() * 4;
        if (arcs.length > MAX_ARCS) arcs.splice(0, arcs.length - MAX_ARCS);
      }

      // Rebuild arc geometry.
      const arr = arcPos;
      let used = 0;
      let envelope = 0;
      for (const arc of arcs) {
        const age = elapsed - arc.t0;
        if (age > arc.life && !reduced) continue;
        const env = reduced
          ? 0.85
          : age < 0.2
          ? age / 0.2
          : age > arc.life - 0.4
          ? Math.max(0, (arc.life - age) / 0.4)
          : 1;
        envelope = Math.max(envelope, env);
        const ax = origins[arc.a * 3]!;
        const ay = origins[arc.a * 3 + 1]!;
        const bx = origins[arc.b * 3]!;
        const by = origins[arc.b * 3 + 1]!;
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dx = bx - ax;
        const dy = by - ay;
        const dist = Math.hypot(dx, dy) || 1;
        const nx = -dy / dist;
        const ny = dx / dist;
        const bump = dist * 0.18;
        const cx = mx + nx * bump;
        const cy = my + ny * bump;
        for (let si = 0; si < ARC_SEGMENTS; si++) {
          const t0 = si / ARC_SEGMENTS;
          const t1 = (si + 1) / ARC_SEGMENTS;
          const p0x = (1 - t0) * (1 - t0) * ax + 2 * (1 - t0) * t0 * cx + t0 * t0 * bx;
          const p0y = (1 - t0) * (1 - t0) * ay + 2 * (1 - t0) * t0 * cy + t0 * t0 * by;
          const p1x = (1 - t1) * (1 - t1) * ax + 2 * (1 - t1) * t1 * cx + t1 * t1 * bx;
          const p1y = (1 - t1) * (1 - t1) * ay + 2 * (1 - t1) * t1 * cy + t1 * t1 * by;
          arr[used++] = p0x;
          arr[used++] = p0y;
          arr[used++] = 0;
          arr[used++] = p1x;
          arr[used++] = p1y;
          arr[used++] = 0;
        }
      }
      arcAttr.needsUpdate = true;
      arcGeo.setDrawRange(0, used / 3);
      arcMat.uniforms.uAlpha.value = envelope * 0.8;

      // Sync locked-mask → attribute.
      const lockedAttrArr = ptsGeo.getAttribute('aLocked') as InstanceType<typeof BufferAttribute>;
      const la = lockedAttrArr.array as Float32Array;
      for (let i = 0; i < la.length; i++) la[i] = lockedMask[i] ? 1 : 0;
      lockedAttrArr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    // First render (even when paused or reduced).
    renderer.render(scene, camera);
    if (!reduced) raf = requestAnimationFrame(frame);
    else {
      // Run one extra frame so arcs compute after boot=1.
      state.current.boot.value = 1;
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ptsGeo.dispose();
      ptsMat.dispose();
      arcGeo.dispose();
      arcMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [seed, reduced, skipBoot]);

  // Propagate paused/inView → boot.paused without re-initing GL.
  useEffect(() => {
    state.current.boot.paused = paused || !inView;
  }, [paused, inView]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (coarse) return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    state.current.cursor.x = nx;
    state.current.cursor.y = ny;
    state.current.cursor.active = 1;
    if (!userInteracted) setUserInteracted(true);
  };
  const onPointerLeave = () => {
    state.current.cursor.active = 0;
  };

  const togglePause = () => {
    setPaused((p) => !p);
    setUserInteracted(true);
  };

  const labels = {
    pause: locale === 'fr' ? "Pauser l'animation ambiante" : 'Pause background motion',
    resume: locale === 'fr' ? "Reprendre l'animation ambiante" : 'Resume background motion',
  };

  return (
    <div
      ref={wrapperRef}
      className="hero-scene"
      style={{ opacity }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {!hidePauseControl && !reduced && (
        <button
          type="button"
          className="hero-scene__pause"
          onClick={togglePause}
          aria-label={paused ? labels.resume : labels.pause}
        >
          {paused ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M3 2 L3 10 L10 6 Z" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <rect x="3" y="2" width="2" height="8" fill="currentColor" />
              <rect x="7" y="2" width="2" height="8" fill="currentColor" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
