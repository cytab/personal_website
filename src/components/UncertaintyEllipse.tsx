/**
 * UncertaintyEllipse — per-cluster SVG sigil with breath animation.
 * Each cluster has its own character (Agent 3 §4.3, Agent 5 §5, refined
 * per mandate B):
 *  - Perception: elongated along a dominant axis, fusion satellites.
 *  - Planning: multiple overlapping ellipses (MCTS branching).
 *  - Human: tighter outer ellipse around a smaller inner (theory-of-mind).
 *  - Systems: grid-aligned lattice of small ellipses (messages on a bus).
 *
 * Framer Motion drives the breath (±3% over 1.6s per Agent 3) on ambient.
 * On in-view / focus / hover, the ellipse tightens to its "locked" shape
 * — the belief-state convergence in miniature.
 *
 * Reduced-motion: static tightened terminal state is rendered at entry;
 * no breath, no transitions.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type ClusterKey = 'perception' | 'planning' | 'human' | 'systems';

export interface Props {
  cluster: ClusterKey;
  size?: number;
  ariaHidden?: boolean;
}

/**
 * Compute an ellipse from a synthetic covariance matrix [[a,b],[b,c]].
 * Returns {rx, ry, rotateDeg}. "Computed" not "faked" (Agent 10 mandate).
 */
function ellipseFromCov(a: number, b: number, c: number, scale = 1) {
  // Eigenvalues of 2×2 symmetric: λ = (a+c ± sqrt((a-c)^2 + 4b^2)) / 2
  const tr = a + c;
  const disc = Math.sqrt((a - c) * (a - c) + 4 * b * b);
  const l1 = (tr + disc) / 2;
  const l2 = (tr - disc) / 2;
  const rx = Math.sqrt(Math.max(l1, 1e-6)) * scale;
  const ry = Math.sqrt(Math.max(l2, 1e-6)) * scale;
  // Principal axis orientation.
  const theta = 0.5 * Math.atan2(2 * b, a - c);
  return { rx, ry, rotateDeg: (theta * 180) / Math.PI };
}

export default function UncertaintyEllipse({
  cluster,
  size = 160,
  ariaHidden = true,
}: Props) {
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setInView(true);
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tightened = inView || hovered;

  // A small breath animation; disabled on reduce.
  const breath = reduced || tightened
    ? { scale: 1 }
    : { scale: [1, 1.03, 1] };

  const shape = useMemo(() => renderShape(cluster, tightened), [cluster, tightened]);

  return (
    <div
      ref={wrapperRef}
      className="u-ellipse"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      style={{ width: size, height: size, display: 'inline-block', flexShrink: 0 }}
    >
      <motion.svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        aria-hidden={ariaHidden ? 'true' : undefined}
        role={ariaHidden ? undefined : 'img'}
        animate={breath as any}
        transition={{
          duration: 1.6,
          ease: [0.4, 0, 0.6, 1],
          repeat: Infinity,
        }}
      >
        {shape}
      </motion.svg>
    </div>
  );
}

function renderShape(cluster: ClusterKey, tight: boolean) {
  const stroke = 'var(--ink)';
  const muted = 'var(--ink-muted)';
  const amber = 'var(--primary)';

  switch (cluster) {
    case 'perception': {
      // Covariance heavy on one axis: vision as dominant sensor.
      const wide = ellipseFromCov(1.0, 0.15, 0.18, 24);
      const tightW = ellipseFromCov(0.8, 0.05, 0.15, 22);
      const e = tight ? tightW : wide;
      return (
        <g>
          {/* Fusion satellites (secondary sensors) */}
          {[
            { x: 54, y: 18 },
            { x: 10, y: 48 },
            { x: 48, y: 50 },
          ].map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.6"
              fill={muted}
              opacity={tight ? 0.9 : 0.55}
            />
          ))}
          <ellipse
            cx="32"
            cy="32"
            rx={e.rx}
            ry={e.ry}
            transform={`rotate(${e.rotateDeg} 32 32)`}
            fill="none"
            stroke={tight ? amber : stroke}
            strokeWidth="1.25"
          />
          <circle cx="32" cy="32" r="1.5" fill={amber} />
        </g>
      );
    }
    case 'planning': {
      // Multiple overlapping eccentric ellipses, MCTS branching.
      // Root covariance, then two "children" with rotated branches.
      const root = ellipseFromCov(1.1, 0.55, 0.3, 22);
      const childA = ellipseFromCov(0.6, -0.15, 0.35, 18);
      const childB = ellipseFromCov(0.7, 0.35, 0.4, 18);
      const tweak = tight ? 0.85 : 1.0;
      return (
        <g>
          <ellipse
            cx="32"
            cy="32"
            rx={root.rx * tweak + 5}
            ry={root.ry * tweak + 5}
            transform={`rotate(${root.rotateDeg} 32 32)`}
            fill="none"
            stroke={muted}
            strokeWidth="0.75"
            strokeDasharray="2 3"
            opacity="0.55"
          />
          <ellipse
            cx="32"
            cy="32"
            rx={root.rx * tweak}
            ry={root.ry * tweak}
            transform={`rotate(${root.rotateDeg} 32 32)`}
            fill="none"
            stroke={tight ? amber : stroke}
            strokeWidth="1.25"
          />
          <ellipse
            cx="22"
            cy="22"
            rx={childA.rx * tweak}
            ry={childA.ry * tweak}
            transform={`rotate(${childA.rotateDeg} 22 22)`}
            fill="none"
            stroke={muted}
            strokeWidth="0.9"
            opacity={tight ? 0.75 : 0.5}
          />
          <ellipse
            cx="44"
            cy="42"
            rx={childB.rx * tweak}
            ry={childB.ry * tweak}
            transform={`rotate(${childB.rotateDeg} 44 42)`}
            fill="none"
            stroke={muted}
            strokeWidth="0.9"
            opacity={tight ? 0.75 : 0.5}
          />
          <circle cx="32" cy="32" r="1.5" fill={amber} />
        </g>
      );
    }
    case 'human': {
      // Outer ellipse (other's belief) around inner (self-model),
      // tilted — "orientations in mental state space."
      const outer = ellipseFromCov(0.9, 0.3, 0.55, 26);
      const inner = ellipseFromCov(0.5, 0.2, 0.4, 18);
      const tweak = tight ? 0.88 : 1.0;
      return (
        <g>
          <ellipse
            cx="32"
            cy="32"
            rx={outer.rx * tweak}
            ry={outer.ry * tweak}
            transform={`rotate(${outer.rotateDeg} 32 32)`}
            fill="none"
            stroke={tight ? amber : stroke}
            strokeWidth="1.25"
          />
          <ellipse
            cx="32"
            cy="32"
            rx={inner.rx * tweak}
            ry={inner.ry * tweak}
            transform={`rotate(${inner.rotateDeg} 32 32)`}
            fill="none"
            stroke={muted}
            strokeWidth="1"
            opacity={tight ? 0.9 : 0.7}
          />
          <circle cx="32" cy="32" r="1.5" fill={amber} />
        </g>
      );
    }
    case 'systems': {
      // A 3×3 grid of small on-axis ellipses — messages on a bus.
      const base = ellipseFromCov(0.22, 0, 0.2, 14);
      const coords: Array<[number, number]> = [
        [16, 16], [32, 16], [48, 16],
        [16, 32], [32, 32], [48, 32],
        [16, 48], [32, 48], [48, 48],
      ];
      return (
        <g>
          {coords.map(([cx, cy], i) => {
            const isCenter = cx === 32 && cy === 32;
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={base.rx * (tight ? 0.8 : 1)}
                ry={base.ry * (tight ? 0.8 : 1)}
                fill="none"
                stroke={isCenter && tight ? amber : muted}
                strokeWidth={isCenter ? 1.25 : 0.9}
                opacity={isCenter ? 1 : tight ? 0.8 : 0.55}
              />
            );
          })}
          <circle cx="32" cy="32" r="1.4" fill={amber} />
        </g>
      );
    }
  }
}
