/**
 * RobotArm.tsx — procedural 6-DOF wire-frame robot arm hero scene.
 *
 * Blueprint aesthetic: solid low-poly faces in --surface-1 with
 * --ink-muted edge lines (THREE.LineSegments + EdgesGeometry). A
 * single amber LED on the gripper lights when a grasp is simulated.
 * A shallow ground plane with a faint lattice grid.
 *
 * Choreography: 14s loop of approach → descend → grasp (LED on) →
 * lift → traverse → release (LED off) → retreat. Eased with the
 * Stepper curve `cubic-bezier(0.65, 0, 0.35, 1)`.
 *
 * Performance:
 *   - IntersectionObserver pauses the render loop off-screen.
 *   - Tab-visibility pauses the render loop when the tab is hidden.
 *   - Auto-pause after 30s of continuous animation with no user
 *     interaction (scroll/keyboard/pointer/focus/visibility).
 *   - Pause control (WCAG 2.2.2) in top-right.
 *   - `prefers-reduced-motion` renders a single mid-choreography frame
 *     (arm extended, gripper closed, LED amber) and no render loop.
 *   - setPixelRatio clamped (1.5 desktop, 1 mobile) to keep GPU cost
 *     bounded.
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type Strings = {
  pauseLabel: string;
  resumeLabel: string;
  sceneLabel: string;
};

const DEFAULT_STRINGS: Strings = {
  pauseLabel: 'Pause scene',
  resumeLabel: 'Resume scene',
  sceneLabel: 'Procedural six-axis robot arm performing a pick-and-place choreography.',
};

interface Props {
  strings?: Partial<Strings>;
}

/** Stepper easing — matches tokens --ease-system. */
function easeStepper(t: number): number {
  // cubic-bezier(0.65, 0, 0.35, 1) approximation via a symmetric
  // cubic. Good enough for motion curves at 60 fps.
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Ease in/out that starts and ends exactly at 0. */
function pulse(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return Math.sin(x * Math.PI);
}

/** Six-DOF articulated rig. Returns root + joint refs. */
function buildArm(): {
  root: THREE.Group;
  base: THREE.Group;
  shoulder: THREE.Group;
  elbow: THREE.Group;
  wristPitch: THREE.Group;
  wristRoll: THREE.Group;
  gripperL: THREE.Group;
  gripperR: THREE.Group;
  led: THREE.Mesh;
} {
  const SURFACE = new THREE.Color('#15191B');
  const LINE = new THREE.Color('#8E8A82');
  const AMBER = new THREE.Color('#F3A03B');

  const faceMat = new THREE.MeshBasicMaterial({ color: SURFACE });
  const lineMat = new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.85 });

  const mkPart = (geom: THREE.BufferGeometry): THREE.Group => {
    const g = new THREE.Group();
    const mesh = new THREE.Mesh(geom, faceMat);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 20), lineMat);
    g.add(mesh);
    g.add(edges);
    return g;
  };

  const root = new THREE.Group();

  // Plinth — shallow hex platform under the arm.
  const plinth = mkPart(new THREE.CylinderGeometry(0.9, 1.0, 0.2, 6));
  plinth.position.y = 0.1;
  root.add(plinth);

  // Base pedestal (yaw rotation axis)
  const base = new THREE.Group();
  base.position.y = 0.2;
  root.add(base);
  const basePart = mkPart(new THREE.CylinderGeometry(0.38, 0.48, 0.35, 8));
  basePart.position.y = 0.175;
  base.add(basePart);

  // Shoulder pivot — attached to top of base
  const shoulder = new THREE.Group();
  shoulder.position.y = 0.35;
  base.add(shoulder);
  // Shoulder block
  const shoulderBlock = mkPart(new THREE.BoxGeometry(0.5, 0.35, 0.55));
  shoulder.add(shoulderBlock);
  // Upper arm segment extending up from shoulder
  const upper = mkPart(new THREE.BoxGeometry(0.22, 1.1, 0.28));
  upper.position.y = 0.55;
  shoulder.add(upper);

  // Elbow pivot at top of upper arm
  const elbow = new THREE.Group();
  elbow.position.y = 1.1;
  shoulder.add(elbow);
  const elbowHub = mkPart(new THREE.CylinderGeometry(0.18, 0.18, 0.32, 8));
  elbowHub.rotation.z = Math.PI / 2;
  elbow.add(elbowHub);
  // Forearm extending from elbow
  const forearm = mkPart(new THREE.BoxGeometry(0.2, 0.95, 0.22));
  forearm.position.y = 0.475;
  elbow.add(forearm);

  // Wrist pitch at end of forearm
  const wristPitch = new THREE.Group();
  wristPitch.position.y = 0.95;
  elbow.add(wristPitch);
  const wristBlock = mkPart(new THREE.BoxGeometry(0.22, 0.2, 0.22));
  wristPitch.add(wristBlock);

  // Wrist roll — rotates around the tool axis
  const wristRoll = new THREE.Group();
  wristRoll.position.y = 0.18;
  wristPitch.add(wristRoll);
  const rollHub = mkPart(new THREE.CylinderGeometry(0.1, 0.1, 0.18, 6));
  rollHub.position.y = 0.09;
  wristRoll.add(rollHub);

  // Gripper palm
  const palm = mkPart(new THREE.BoxGeometry(0.3, 0.08, 0.18));
  palm.position.y = 0.22;
  wristRoll.add(palm);

  // Gripper fingers — two prismatic jaws
  const gripperL = new THREE.Group();
  gripperL.position.set(-0.08, 0.32, 0);
  wristRoll.add(gripperL);
  const fingerL = mkPart(new THREE.BoxGeometry(0.04, 0.22, 0.14));
  fingerL.position.y = 0.11;
  gripperL.add(fingerL);

  const gripperR = new THREE.Group();
  gripperR.position.set(0.08, 0.32, 0);
  wristRoll.add(gripperR);
  const fingerR = mkPart(new THREE.BoxGeometry(0.04, 0.22, 0.14));
  fingerR.position.y = 0.11;
  gripperR.add(fingerR);

  // Amber LED on top of the palm
  const ledGeom = new THREE.SphereGeometry(0.035, 8, 6);
  const ledMat = new THREE.MeshBasicMaterial({ color: AMBER, transparent: true, opacity: 0.2 });
  const led = new THREE.Mesh(ledGeom, ledMat);
  led.position.set(0, 0.28, 0.06);
  wristRoll.add(led);

  return { root, base, shoulder, elbow, wristPitch, wristRoll, gripperL, gripperR, led };
}

/** Low-poly target cube — something the arm can pick up. */
function buildTarget(): THREE.Group {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.18, 0.18),
    new THREE.MeshBasicMaterial({ color: new THREE.Color('#1F2427') }),
  );
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry),
    new THREE.LineBasicMaterial({ color: new THREE.Color('#62E0C8'), transparent: true, opacity: 0.75 }),
  );
  g.add(mesh);
  g.add(edges);
  g.position.y = 0.1 + 0.09;
  return g;
}

/** Lattice ground plane — shader-free, using LineSegments. */
function buildGrid(size = 8, divisions = 20): THREE.LineSegments {
  const positions: number[] = [];
  const step = size / divisions;
  const half = size / 2;
  for (let i = 0; i <= divisions; i++) {
    const v = -half + i * step;
    positions.push(-half, 0, v, half, 0, v);
    positions.push(v, 0, -half, v, 0, half);
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#1F2427'),
    transparent: true,
    opacity: 0.7,
  });
  const grid = new THREE.LineSegments(geom, mat);
  grid.position.y = 0.001;
  return grid;
}

export default function RobotArm({ strings: s = {} }: Props) {
  const strings = { ...DEFAULT_STRINGS, ...s };
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(3.2, 2.4, 3.6);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Scene graph
    const rig = buildArm();
    scene.add(rig.root);
    const target = buildTarget();
    target.position.set(1.1, target.position.y, 0.1);
    scene.add(target);
    const grid = buildGrid(6, 18);
    scene.add(grid);

    // Resize observer — canvas tracks its container
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    resize();

    // Choreography keyframes — 14s loop.
    // Each segment is a function that sets joint targets given a
    // normalized [0,1] segment-time. Joint angles are in radians.
    const LOOP_MS = 14000;
    const drawFrame = (tGlobal: number) => {
      // 0–14s cycle
      const t = ((tGlobal % LOOP_MS) + LOOP_MS) % LOOP_MS;
      const phase = t / LOOP_MS;

      // Subtle camera sway
      const sway = Math.sin(tGlobal / 1000 * (Math.PI * 2 / 8)); // 8s period
      camera.position.x = 3.2 + Math.sin(sway) * 0.06;
      camera.position.z = 3.6 + Math.cos(sway) * 0.06;
      camera.lookAt(0, 1, 0);

      // Segment the loop.
      //  0.00–0.25  approach right (target)
      //  0.25–0.35  descend + close
      //  0.35–0.40  grasp (LED on)
      //  0.40–0.65  lift and traverse to left
      //  0.65–0.75  release (LED off)
      //  0.75–0.90  retreat up
      //  0.90–1.00  return to neutral
      const seg = (a: number, b: number) => easeStepper(Math.max(0, Math.min(1, (phase - a) / (b - a))));

      // Base yaw — tracks left/right
      // Start at +35° (right), sweep to −35° (left) during traverse,
      // return to 0° at end.
      const baseYawTo = (v: number) => v;
      let baseYaw = 0;
      if (phase < 0.25)         baseYaw = seg(0, 0.25) * 0.6; // to +0.6
      else if (phase < 0.4)     baseYaw = 0.6;
      else if (phase < 0.65)    baseYaw = 0.6 - seg(0.4, 0.65) * 1.2; // to -0.6
      else if (phase < 0.75)    baseYaw = -0.6;
      else                      baseYaw = -0.6 + seg(0.75, 1.0) * 0.6; // back to 0
      rig.base.rotation.y = baseYawTo(baseYaw);

      // Shoulder pitch — reach forward/out then back
      // Neutral at 0; reach out ≈ +0.55; lift up ≈ -0.15.
      let shoulder = 0;
      if (phase < 0.25)         shoulder = seg(0, 0.25) * 0.55;
      else if (phase < 0.35)    shoulder = 0.55 + seg(0.25, 0.35) * 0.25; // deepen
      else if (phase < 0.40)    shoulder = 0.80;
      else if (phase < 0.65)    shoulder = 0.80 - seg(0.40, 0.65) * 0.4; // lift/traverse
      else if (phase < 0.75)    shoulder = 0.40 + seg(0.65, 0.75) * 0.15;
      else                      shoulder = 0.55 - seg(0.75, 1.0) * 0.55; // return
      rig.shoulder.rotation.x = shoulder;

      // Elbow bend
      let elbow = -0.3;
      if (phase < 0.25)         elbow = -0.3 - seg(0, 0.25) * 0.5;
      else if (phase < 0.35)    elbow = -0.8 - seg(0.25, 0.35) * 0.2;
      else if (phase < 0.40)    elbow = -1.0;
      else if (phase < 0.65)    elbow = -1.0 + seg(0.40, 0.65) * 0.5;
      else if (phase < 0.75)    elbow = -0.5 + seg(0.65, 0.75) * -0.15;
      else                      elbow = -0.65 + seg(0.75, 1.0) * 0.35;
      rig.elbow.rotation.x = elbow;

      // Wrist pitch keeps the gripper roughly vertical
      rig.wristPitch.rotation.x = -shoulder - elbow - 0.3;

      // Wrist roll — slow continuous rotate to show the roll axis
      rig.wristRoll.rotation.y = Math.sin((tGlobal / 1000) * (Math.PI * 2 / 6)) * 0.6;

      // Gripper open/close
      // Open by default (±0.08), close during grasp+lift+traverse
      const grasping = phase >= 0.33 && phase <= 0.70;
      const openAmt = grasping
        ? 0.02
        : 0.08 - 0.01 * Math.sin((tGlobal / 1000) * Math.PI); // tiny idle twitch
      rig.gripperL.position.x = -openAmt;
      rig.gripperR.position.x = openAmt;

      // LED opacity — lights when grasping, with a small pulse
      const led = rig.led.material as THREE.MeshBasicMaterial;
      if (grasping) {
        led.opacity = 0.75 + pulse((phase - 0.33) / 0.37) * 0.2;
      } else {
        led.opacity = 0.15;
      }

      // Target cube — "picked up" and translated with the gripper
      if (grasping) {
        // Very rough world-space follow: target sits under the palm
        const palmWorld = new THREE.Vector3();
        rig.wristRoll.getWorldPosition(palmWorld);
        target.position.x = palmWorld.x;
        target.position.z = palmWorld.z;
        target.position.y = palmWorld.y + 0.28;
      } else if (phase < 0.25) {
        // Resting on the right before pickup
        target.position.x = 1.1;
        target.position.z = 0.1;
        target.position.y = 0.19;
      } else if (phase >= 0.70) {
        // Resting on the left after release
        target.position.x = -1.1;
        target.position.z = 0.1;
        target.position.y = 0.19;
      }

      renderer.render(scene, camera);
    };

    // Reduced-motion: single tuned frame and stop.
    if (reduced) {
      // Pick the mid-grasp moment (phase ≈ 0.40) as the static frame
      // and flag it.
      const FROZEN_T = LOOP_MS * 0.40;
      drawFrame(FROZEN_T);
      const canvas = renderer.domElement;
      canvas.setAttribute('data-paused', 'true');
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', strings.sceneLabel);
      setReady(true);
      setPaused(true);
      return () => {
        ro.disconnect();
        renderer.dispose();
        canvas.remove();
      };
    }

    // Active render loop state
    let t0 = performance.now();
    let lastInteraction = performance.now();
    let rafId = 0;
    let visible = true;
    let docVisible = !document.hidden;
    let userPaused = false;
    let autoPaused = false;

    const canvas = renderer.domElement;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', strings.sceneLabel);
    canvas.setAttribute('data-paused', 'false');

    const updatePausedAttr = (p: boolean) => {
      canvas.setAttribute('data-paused', p ? 'true' : 'false');
      setPaused(p);
    };

    const loop = () => {
      if (userPaused || autoPaused || !visible || !docVisible) {
        return;
      }
      const now = performance.now();
      if (now - lastInteraction > 30_000) {
        autoPaused = true;
        updatePausedAttr(true);
        return;
      }
      drawFrame(now - t0);
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (userPaused || autoPaused || !visible || !docVisible) return;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    // IntersectionObserver — pause off-screen
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
          if (visible) start();
          else stop();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(mount);

    const onVis = () => {
      docVisible = !document.hidden;
      lastInteraction = performance.now();
      if (docVisible) {
        // Resuming from hidden — treat as interaction, unpause auto.
        if (autoPaused && !userPaused) {
          autoPaused = false;
          updatePausedAttr(false);
        }
        start();
      } else {
        stop();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const onInteract = () => {
      lastInteraction = performance.now();
      if (autoPaused && !userPaused) {
        autoPaused = false;
        updatePausedAttr(false);
        start();
      }
    };
    window.addEventListener('scroll', onInteract, { passive: true });
    window.addEventListener('keydown', onInteract);
    window.addEventListener('pointerdown', onInteract);

    // Pause toggle — exposed via the outer button
    (mount as HTMLDivElement & { __togglePause?: () => void }).__togglePause = () => {
      userPaused = !userPaused;
      updatePausedAttr(userPaused || autoPaused);
      if (!userPaused) {
        autoPaused = false;
        lastInteraction = performance.now();
        start();
      } else {
        stop();
      }
    };

    // Initial paint — draw one frame immediately so there's no blank canvas
    drawFrame(0);
    setReady(true);
    start();

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('scroll', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('pointerdown', onInteract);
      stop();
      renderer.dispose();
      canvas.remove();
      // Drop scene graph
      scene.traverse((o: THREE.Object3D) => {
        if ((o as THREE.Mesh).geometry) (o as THREE.Mesh).geometry.dispose();
        const m = (o as THREE.Mesh).material;
        if (Array.isArray(m)) m.forEach((mm: THREE.Material) => mm.dispose());
        else if (m) (m as THREE.Material).dispose();
      });
    };
  }, [strings.sceneLabel]);

  const onToggle = () => {
    const mount = mountRef.current as (HTMLDivElement & { __togglePause?: () => void }) | null;
    if (mount && mount.__togglePause) mount.__togglePause();
  };

  return (
    <div className="robotarm">
      <div ref={mountRef} className="robotarm__canvas" />
      <button
        type="button"
        className="robotarm__pause"
        onClick={onToggle}
        aria-pressed={paused}
        aria-label={paused ? strings.resumeLabel : strings.pauseLabel}
        hidden={!ready}
      >
        {paused ? (
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
            <path d="M4 3 L13 8 L4 13 Z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false">
            <rect x="4" y="3" width="3" height="10" fill="currentColor" />
            <rect x="9" y="3" width="3" height="10" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
