/**
 * NavTree — the behavior-tree visual illustration that overlays the
 * static nav skeleton. Hydrated progressively (Agent 9 ships the SSR
 * skeleton; we layer the tick animation on top).
 *
 * Propagation rule: on hover / focus of a leaf, the tick propagates
 * root→leaf at 80ms per step (Agent 6 Stepper easing). On click, the
 * full path ticks and then the route-replan fires.
 *
 * Keyboard model matches Agent 8 §3.2 — Tab walks, Enter activates.
 * The reduced-motion variant: no propagation; the active leaf flips
 * to amber instantly.
 */
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type Leaf = { key: string; label: string; href: string; active: boolean };

export interface Props {
  leaves: Leaf[];
  /** Index in the `leaves` array corresponding to the active route. */
  activeIndex: number;
}

export default function NavTree({ leaves, activeIndex }: Props) {
  const reduced = useReducedMotion();
  // "tick" is how far the tick has propagated (in 80ms steps) toward
  // the currently-hovered/focused leaf.
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tickStep, setTickStep] = useState<number>(0);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  // Advance the tick in discrete 80ms steps when hoverIndex is set.
  useEffect(() => {
    if (reduced || hoverIndex == null) {
      setTickStep(0);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    setTickStep(0);
    let step = 0;
    const maxStep = 3; // root(0) → trunk(1) → branch(2) → leaf(3)
    timerRef.current = window.setInterval(() => {
      step += 1;
      setTickStep(step);
      if (step >= maxStep && timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }, 80);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [hoverIndex, reduced]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  // We draw a thin overlay SVG that aligns to the nav layout by
  // positioning absolutely. For the site's layout we render the tree
  // as a small inline SVG that sits inside the nav.
  const rootLit = hoverIndex != null && (reduced || tickStep >= 1);
  const branchLit = hoverIndex != null && (reduced || tickStep >= 2);
  const leafLit = (i: number) =>
    hoverIndex === i && (reduced || tickStep >= 3);

  return (
    <div
      className="nav-tree"
      onMouseLeave={() => setHoverIndex(null)}
    >
      <svg
        viewBox="0 0 120 24"
        width="120"
        height="24"
        className="nav-tree__svg"
        aria-hidden="true"
        focusable="false"
      >
        {/* Root node (square) */}
        <rect
          x="2"
          y="9"
          width="6"
          height="6"
          fill={rootLit || activeIndex >= 0 ? 'var(--primary)' : 'transparent'}
          stroke="currentColor"
          strokeWidth="1"
          opacity={rootLit ? 1 : 0.6}
        />
        {/* Trunk line */}
        <line
          x1="8"
          y1="12"
          x2="24"
          y2="12"
          stroke={rootLit ? 'var(--primary)' : 'currentColor'}
          strokeWidth="1"
          opacity={rootLit ? 1 : 0.5}
        />
        {/* Branches — one per leaf. We space them over the full width. */}
        {leaves.map((_, i) => {
          const total = leaves.length;
          const y = 4 + ((i + 0.5) * 16) / total;
          return (
            <g key={i}>
              <line
                x1="24"
                y1="12"
                x2="36"
                y2={y}
                stroke={branchLit ? 'var(--primary)' : 'currentColor'}
                strokeWidth="1"
                opacity={branchLit && hoverIndex === i ? 1 : 0.35}
              />
              <rect
                x="36"
                y={y - 3}
                width="6"
                height="6"
                fill={leafLit(i) || i === activeIndex ? 'var(--primary)' : 'transparent'}
                stroke="currentColor"
                strokeWidth="1"
                opacity={hoverIndex === i || i === activeIndex ? 1 : 0.6}
              />
            </g>
          );
        })}
      </svg>
      <ul className="nav-tree__leaves" role="presentation">
        {leaves.map((leaf, i) => (
          <li key={leaf.key}>
            <a
              href={leaf.href}
              className={`nav-tree__leaf ${leaf.active ? 'is-active' : ''}`}
              aria-current={leaf.active ? 'page' : undefined}
              onMouseEnter={() => setHoverIndex(i)}
              onFocus={() => setHoverIndex(i)}
              onBlur={() => setHoverIndex((cur) => (cur === i ? null : cur))}
            >
              {leaf.label}
            </a>
          </li>
        ))}
      </ul>
      <style>{`
        .nav-tree {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .nav-tree__svg {
          color: var(--ink-muted);
          flex-shrink: 0;
        }
        .nav-tree__leaves {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          row-gap: var(--space-2);
          gap: var(--space-4);
        }
        @media (max-width: 400px) {
          .nav-tree__leaves {
            gap: var(--space-3);
          }
          .nav-tree {
            flex-wrap: wrap;
          }
        }
        .nav-tree__leaf {
          font-family: var(--font-mono);
          font-size: var(--fs-mono);
          letter-spacing: var(--tr-mono);
          font-weight: var(--fw-medium);
          color: var(--ink-muted);
          text-decoration: none;
          transition: color var(--dur-base) var(--ease-default);
        }
        .nav-tree__leaf:hover,
        .nav-tree__leaf:focus-visible {
          color: var(--ink);
        }
        .nav-tree__leaf.is-active {
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
