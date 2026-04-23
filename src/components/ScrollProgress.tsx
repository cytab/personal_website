/**
 * ScrollProgress — belief-distribution scroll indicator (home only).
 *
 * Default state: 7 bars (Agent 2's 7-beat arc).
 * Cluster territory (#depth in view): the 4th bar subdivides into 4
 * cluster-labeled bars. Leaving cluster territory rejoins to 7.
 *
 * FLIP animation via Framer Motion `layoutId` + `LayoutGroup`.
 * Reduced-motion: the component switches layouts instantly; no animated
 * subdivision.
 */
import { useEffect, useMemo, useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';

type Beat = {
  id: string;
  key: string;
  labelEn: string;
  labelFr: string;
  kind: 'beat' | 'cluster';
};

const BASE_BEATS: Beat[] = [
  { id: 'hero', key: 'hero', labelEn: 'Hero', labelFr: 'Accueil', kind: 'beat' },
  { id: 'orientation', key: 'orientation', labelEn: 'Orientation', labelFr: 'Orientation', kind: 'beat' },
  { id: 'proof', key: 'proof', labelEn: 'Proof', labelFr: 'Preuve', kind: 'beat' },
  { id: 'depth', key: 'depth', labelEn: 'Depth', labelFr: 'Profondeur', kind: 'beat' },
  { id: 'frontier', key: 'frontier', labelEn: 'Frontier', labelFr: 'Frontière', kind: 'beat' },
  { id: 'signal', key: 'signal', labelEn: 'Signal', labelFr: 'Signal', kind: 'beat' },
  { id: 'contact', key: 'contact', labelEn: 'Invitation', labelFr: 'Invitation', kind: 'beat' },
];

const CLUSTER_BEATS: Beat[] = [
  { id: 'perception', key: 'perception', labelEn: 'Perception', labelFr: 'Perception', kind: 'cluster' },
  { id: 'planning', key: 'planning', labelEn: 'Planning', labelFr: 'Planification', kind: 'cluster' },
  { id: 'human', key: 'human', labelEn: 'Human', labelFr: 'Humain', kind: 'cluster' },
  { id: 'systems', key: 'systems', labelEn: 'Systems', labelFr: 'Systèmes', kind: 'cluster' },
];

export interface Props { locale: 'en' | 'fr' }

export default function ScrollProgress({ locale }: Props) {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string>('hero');
  const [subdivided, setSubdivided] = useState(false);

  // Track the currently-in-view section via IntersectionObserver.
  useEffect(() => {
    const ids = [
      ...BASE_BEATS.map((b) => b.id),
      ...CLUSTER_BEATS.map((b) => b.id),
    ];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    if (elements.length === 0) return;

    const visibility = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visibility.set((e.target as HTMLElement).id, e.intersectionRatio);
        }
        // Pick the id with highest ratio.
        let best: string | null = null;
        let bestR = 0;
        visibility.forEach((ratio, id) => {
          if (ratio > bestR) {
            bestR = ratio;
            best = id;
          }
        });
        if (best) setActiveId(best);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    elements.forEach((el) => io.observe(el));

    // Also watch #depth separately for subdivide trigger.
    const depthEl = document.getElementById('depth');
    if (depthEl) {
      const depthIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            setSubdivided(e.isIntersecting);
          }
        },
        { threshold: 0.05 },
      );
      depthIO.observe(depthEl);
      return () => {
        io.disconnect();
        depthIO.disconnect();
      };
    }
    return () => io.disconnect();
  }, []);

  const beats = useMemo<Beat[]>(() => {
    if (!subdivided) return BASE_BEATS;
    // Replace the "depth" beat with the 4 cluster sub-beats.
    const before = BASE_BEATS.slice(0, 3); // hero, orientation, proof
    const after = BASE_BEATS.slice(4);     // frontier, signal, contact
    return [...before, ...CLUSTER_BEATS, ...after];
  }, [subdivided]);

  const activeIndex = Math.max(0, beats.findIndex((b) => b.id === activeId));

  return (
    <nav
      className="scroll-progress"
      aria-label={locale === 'fr' ? 'Sections' : 'Sections'}
      id="section-nav"
      data-subdivided={subdivided ? 'true' : 'false'}
    >
      <LayoutGroup>
        <ol className="scroll-progress__list">
          {beats.map((beat, i) => {
            const label = locale === 'fr' ? beat.labelFr : beat.labelEn;
            const distance = Math.abs(i - activeIndex);
            const height = Math.max(6, 28 - distance * 5);
            const isActive = i === activeIndex;
            return (
              <li key={beat.key}>
                <a
                  href={`#${beat.id}`}
                  className={`scroll-progress__item ${isActive ? 'is-active' : ''} ${beat.kind === 'cluster' ? 'is-cluster' : ''}`}
                  aria-current={isActive ? 'location' : undefined}
                >
                  <motion.span
                    aria-hidden="true"
                    className="scroll-progress__bar"
                    layoutId={`sp-bar-${beat.key}`}
                    style={{ height: `${height}px` }}
                    transition={reduced ? { duration: 0 } : { duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
                  />
                  <span className="scroll-progress__label">{label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </LayoutGroup>
      <style>{`
        .scroll-progress {
          position: fixed;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 50;
        }
        @media (max-width: 767px) { .scroll-progress { display: none; } }
        .scroll-progress__list {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .scroll-progress__item {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none;
          color: var(--ink-muted);
        }
        .scroll-progress__item:hover,
        .scroll-progress__item:focus-visible {
          color: var(--ink);
        }
        .scroll-progress__item.is-cluster .scroll-progress__bar {
          border-left: 2px solid transparent;
        }
        .scroll-progress__bar {
          display: inline-block;
          width: 3px;
          background: var(--ink-muted);
        }
        .scroll-progress__item.is-active .scroll-progress__bar {
          background: var(--primary);
        }
        .scroll-progress__item.is-cluster .scroll-progress__bar {
          background: color-mix(in srgb, var(--ink-muted) 70%, var(--accent));
        }
        .scroll-progress__item.is-active.is-cluster .scroll-progress__bar {
          background: var(--primary);
        }
        .scroll-progress__label {
          font-family: var(--font-mono);
          font-size: var(--fs-micro);
          letter-spacing: var(--tr-micro);
          text-transform: uppercase;
          opacity: 0;
          transition: opacity 240ms var(--ease-default);
        }
        .scroll-progress__item:hover .scroll-progress__label,
        .scroll-progress__item:focus-visible .scroll-progress__label,
        .scroll-progress__item.is-active .scroll-progress__label {
          opacity: 1;
        }
      `}</style>
    </nav>
  );
}
