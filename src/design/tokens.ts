/**
 * Design tokens — TypeScript export mirroring tokens.css.
 * Use in React islands / component logic. CSS custom properties
 * remain the source of truth for styling; this module is for JS.
 *
 * Contrast-safety forbidden pairings (documented, enforced by discipline):
 *  - --ink-muted on --surface-2 for body text <18px  (4.1:1 dark mode)
 *  - --danger   on --surface-2 at any body size      (3.6:1 dark mode)
 */

// ---------- Colors ----------

export const darkColors = {
  bg: '#0B0D0E',
  surface1: '#15191B',
  surface2: '#1F2427',
  ink: '#E6E1D6',
  inkMuted: '#8E8A82',
  primary: '#F3A03B',
  accent: '#62E0C8',
  danger: '#E5484D',
} as const;

/** Light mode with Agent 8 / phase-2-revisions AA fixes applied. */
export const lightColors = {
  bg: '#F5F2EB',
  surface1: '#ECE7DC',
  surface2: '#E0D9CB',
  ink: '#1A1C1D',
  inkMuted: '#5A5650',
  primary: '#9A580F', // darkened from #B86A14 for AA normal
  accent: '#0A7A67',  // darkened from #0F8F7A for AA normal
  danger: '#B3282D',
} as const;

// ---------- Motion (Agent 6) ----------

export const easings = {
  /** Observer — default UI curve. */
  default: [0.22, 1, 0.36, 1] as const,
  /** Stepper — mechanical S-curve for technical motifs. */
  system: [0.65, 0, 0.35, 1] as const,
  /** Drift — ambient always-on loops. */
  ambient: [0.4, 0, 0.6, 1] as const,
} as const;

export const durations = {
  tick: 80,
  fast: 160,
  base: 240,
  slow: 400,
  narrative: 800,
  scene: 1200,
} as const;

export const staggers = {
  tight: 30,
  base: 60,
  loose: 120,
} as const;

export const MAX_STAGGER_CHAIN = 8;
export const HEARTBEAT_PERIOD_MS = 2400;

/** Sensor-handoff modality names (for reduced-motion labels). */
export const SENSOR_LABELS = {
  vision: 'VISION / RGB',
  stereo: 'STEREO / DEPTH',
  lidar: 'LIDAR / SWEEP',
  mapToPlanner: 'MAP → PLANNER',
  worldToIntent: 'WORLD → INTENT',
  intentToBus: 'INTENT → BUS',
  introspection: 'INTROSPECTION',
  radar: 'RADAR / OUTWARD',
} as const;

export type SensorModality = keyof typeof SENSOR_LABELS;

// ---------- Spacing (px) ----------
export const space = {
  s0: 0,
  s1: 4,
  s2: 8,
  s3: 16,
  s4: 24,
  s5: 32,
  s6: 40,
  s7: 64,
  s8: 96,
  s9: 160,
} as const;

// ---------- Breakpoints (px) ----------
export const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
  large: 1920,
} as const;
