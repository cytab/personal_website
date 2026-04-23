/**
 * Poisson-disk sampling (Bridson's algorithm, 2D).
 * Deterministic given a seed — we want different pages to look different
 * but the same page to look the same on reload. No runtime randomness.
 */

export type Point = { x: number; y: number };

/**
 * Mulberry32 PRNG — 32-bit, fast, good enough for visual determinism.
 */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) >>> 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Bridson Poisson-disk sample in the rect [-1, 1] x [-aspect, aspect].
 * Returns typed-array-friendly array of Points.
 */
export function poissonDisk({
  seed = 1,
  minDist = 0.06,
  aspect = 1,
  maxCandidates = 20,
  maxPoints = 900,
}: {
  seed?: number;
  minDist?: number;
  aspect?: number;
  maxCandidates?: number;
  maxPoints?: number;
}): Point[] {
  const rand = mulberry32(seed);
  const w = 2;
  const h = 2 * aspect;
  const cell = minDist / Math.SQRT2;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const grid: (Point | null)[] = new Array(cols * rows).fill(null);
  const active: Point[] = [];
  const result: Point[] = [];

  const idxOf = (p: Point) => {
    const ci = Math.floor((p.x + 1) / cell);
    const ri = Math.floor((p.y + aspect) / cell);
    return ri * cols + ci;
  };

  const fits = (p: Point) => {
    if (p.x < -1 || p.x > 1 || p.y < -aspect || p.y > aspect) return false;
    const ci = Math.floor((p.x + 1) / cell);
    const ri = Math.floor((p.y + aspect) / cell);
    for (let r = Math.max(0, ri - 2); r <= Math.min(rows - 1, ri + 2); r++) {
      for (let c = Math.max(0, ci - 2); c <= Math.min(cols - 1, ci + 2); c++) {
        const n = grid[r * cols + c];
        if (n) {
          const dx = n.x - p.x;
          const dy = n.y - p.y;
          if (dx * dx + dy * dy < minDist * minDist) return false;
        }
      }
    }
    return true;
  };

  // Seed the process with a point near origin for visual centering.
  const start: Point = { x: (rand() - 0.5) * 0.4, y: (rand() - 0.5) * 0.4 };
  active.push(start);
  result.push(start);
  grid[idxOf(start)] = start;

  while (active.length > 0 && result.length < maxPoints) {
    const ai = Math.floor(rand() * active.length);
    const base = active[ai]!;
    let placed = false;
    for (let k = 0; k < maxCandidates; k++) {
      const angle = rand() * Math.PI * 2;
      const radius = minDist * (1 + rand());
      const cand: Point = {
        x: base.x + Math.cos(angle) * radius,
        y: base.y + Math.sin(angle) * radius,
      };
      if (fits(cand)) {
        active.push(cand);
        result.push(cand);
        grid[idxOf(cand)] = cand;
        placed = true;
        break;
      }
    }
    if (!placed) {
      active.splice(ai, 1);
    }
  }

  return result;
}

/** Hash a string to a 32-bit integer — for page-slug seeding. */
export function hashSeed(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
