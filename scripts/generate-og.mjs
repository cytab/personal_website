/**
 * generate-og.mjs — prebuild script that renders the default OG image
 * (1200×630 PNG) procedurally from the same Poisson-disk sampler the
 * hero scene uses. Keeps the site's asset policy intact: no stock,
 * all procedural.
 *
 * Input:  none (seed is hardcoded so the card is stable).
 * Output: public/og-default.png
 *
 * Dependency: sharp, shipped transitively through Astro.
 */
import sharp from 'sharp';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---- Poisson sampler (trimmed copy of src/components/HeroScene/poisson.ts) ----
function mulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t = (t + 0x6D2B79F5) >>> 0;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}
function poissonDisk({ seed = 1, minDist = 0.06, aspect = 1, maxCandidates = 20, maxPoints = 900 }) {
  const rand = mulberry32(seed);
  const w = 2;
  const h = 2 * aspect;
  const cell = minDist / Math.SQRT2;
  const cols = Math.ceil(w / cell);
  const rows = Math.ceil(h / cell);
  const grid = new Array(cols * rows).fill(null);
  const active = [];
  const result = [];
  const idxOf = (p) => {
    const ci = Math.floor((p.x + 1) / cell);
    const ri = Math.floor((p.y + aspect) / cell);
    return ri * cols + ci;
  };
  const fits = (p) => {
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
  const start = { x: (rand() - 0.5) * 0.4, y: (rand() - 0.5) * 0.4 };
  active.push(start);
  result.push(start);
  grid[idxOf(start)] = start;
  while (active.length > 0 && result.length < maxPoints) {
    const ai = Math.floor(rand() * active.length);
    const base = active[ai];
    let placed = false;
    for (let k = 0; k < maxCandidates; k++) {
      const angle = rand() * Math.PI * 2;
      const radius = minDist * (1 + rand());
      const cand = { x: base.x + Math.cos(angle) * radius, y: base.y + Math.sin(angle) * radius };
      if (fits(cand)) {
        active.push(cand); result.push(cand); grid[idxOf(cand)] = cand;
        placed = true; break;
      }
    }
    if (!placed) active.splice(ai, 1);
  }
  return result;
}

function hashSeed(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ---- Compose the SVG ----
const W = 1200;
const H = 630;
const seed = hashSeed('cyrille-tabe-og-v1');
const rand = mulberry32(seed);

// Sample on the card aspect ratio.
const points = poissonDisk({
  seed,
  minDist: 0.055,
  aspect: H / W,
  maxPoints: 700,
});

// Pre-lock a handful of "closed loop" pairs.
const lockedIdx = new Set();
const arcs = [];
for (let attempt = 0; attempt < 80 && arcs.length < 5; attempt++) {
  const a = Math.floor(rand() * points.length);
  const b = Math.floor(rand() * points.length);
  if (a === b || lockedIdx.has(a) || lockedIdx.has(b)) continue;
  const pa = points[a];
  const pb = points[b];
  const d = Math.hypot(pa.x - pb.x, pa.y - pb.y);
  if (d > 0.4 && d < 0.9) {
    arcs.push({ a, b });
    lockedIdx.add(a);
    lockedIdx.add(b);
  }
}

const aspect = H / W;
const toX = (x) => ((x + 1) / 2) * W;
const toY = (y) => ((-y + aspect) / (2 * aspect)) * H;

const bg = '#0B0D0E';
const ink = '#E6E1D6';
const inkMuted = '#8E8A82';
const amber = '#F3A03B';
const accent = '#62E0C8';

// 32px and 8px lattice via pattern
const svgParts = [];
svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`);
svgParts.push(`<rect width="${W}" height="${H}" fill="${bg}"/>`);
svgParts.push(`<defs>
  <pattern id="lat32" patternUnits="userSpaceOnUse" width="32" height="32">
    <path d="M 32 0 L 0 0 0 32" stroke="${inkMuted}" stroke-width="0.5" fill="none" opacity="0.15"/>
  </pattern>
  <pattern id="lat8" patternUnits="userSpaceOnUse" width="8" height="8">
    <path d="M 8 0 L 0 0 0 8" stroke="${inkMuted}" stroke-width="0.3" fill="none" opacity="0.08"/>
  </pattern>
</defs>`);
svgParts.push(`<rect width="${W}" height="${H}" fill="url(#lat8)"/>`);
svgParts.push(`<rect width="${W}" height="${H}" fill="url(#lat32)"/>`);

// Points
for (let i = 0; i < points.length; i++) {
  const p = points[i];
  const locked = lockedIdx.has(i);
  svgParts.push(
    `<circle cx="${toX(p.x).toFixed(1)}" cy="${toY(p.y).toFixed(1)}" r="${locked ? 3 : 1.6}" fill="${locked ? amber : ink}" opacity="${locked ? 0.9 : 0.5}"/>`,
  );
}

// Arcs
for (const { a, b } of arcs) {
  const pa = points[a];
  const pb = points[b];
  const mx = (pa.x + pb.x) / 2;
  const my = (pa.y + pb.y) / 2;
  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const bump = dist * 0.2;
  const cx = mx + nx * bump;
  const cy = my + ny * bump;
  svgParts.push(
    `<path d="M${toX(pa.x).toFixed(1)} ${toY(pa.y).toFixed(1)} Q${toX(cx).toFixed(1)} ${toY(cy).toFixed(1)} ${toX(pb.x).toFixed(1)} ${toY(pb.y).toFixed(1)}" fill="none" stroke="${amber}" stroke-width="1.2" opacity="0.7"/>`,
  );
}

// Card text: name + eyebrow + tagline.
const eyebrow = '§ 00 / BOOTING PERCEPTION';
const name = 'Cyrille Tabe';
const tag = 'I build machines that perceive, decide, and act.';

svgParts.push(`<g font-family="JetBrains Mono, monospace" font-size="20" fill="${accent}" opacity="0.9" letter-spacing="2">
  <text x="80" y="110">${eyebrow}</text>
</g>`);
svgParts.push(`<g font-family="Inter, sans-serif" font-size="72" font-weight="600" fill="${ink}">
  <text x="80" y="220">${name}</text>
</g>`);
svgParts.push(`<g font-family="Inter, sans-serif" font-size="34" font-weight="400" fill="${ink}" opacity="0.85">
  <text x="80" y="290">${tag}</text>
</g>`);
svgParts.push(`<g font-family="JetBrains Mono, monospace" font-size="16" fill="${inkMuted}" letter-spacing="2">
  <text x="80" y="${H - 60}">MONTRÉAL · ROBOTICS SOFTWARE ENGINEER</text>
</g>`);

svgParts.push(`</svg>`);
const svg = svgParts.join('\n');

// ---- Resolve paths and write ----
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const outDir = resolve(repoRoot, 'public');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const pngOut = resolve(outDir, 'og-default.png');
const svgOut = resolve(outDir, 'og-default.svg');

writeFileSync(svgOut, svg);

try {
  await sharp(Buffer.from(svg)).resize(W, H).png({ quality: 92 }).toFile(pngOut);
  console.log('[og] wrote', pngOut);
} catch (err) {
  console.warn('[og] sharp render failed, SVG written only:', err?.message || err);
}
