"use client";

import { useEffect, useRef } from "react";
import { drawMachineField, fallbackGeometry, SOURCES } from "./fields/machineField";
import { outputSignal, receptionActivity, perceptionResonances, resonanceEnvelope } from "./fields/outputSignals";
import { runPitchTimeline } from "./fields/pitchTimeline";
import Image from "next/image";
import techLogo from "../../SoniXense-Brand-Kit/01-Logo/SVG/sonixense-horizontal-white.svg";

/*
 * SoniXense technology phenomenon — the visual answer to Section 02's
 * perception gap. The left side is the same machine-capacity language — the
 * same seven sources, in the same order — but instead of converging on a
 * limited human interface, they enter ONE object: the SoniXense black box.
 * What comes out is never a bottleneck and never dissonant: a small number of
 * aligned filaments emerge already organized, open into a curved acoustic
 * form, and resolve into three related, harmonically-tuned outcomes — high-
 * level insights, harmonized perceptual cues, and sound. The field gets
 * SIMPLER moving right, not busier.
 *
 * MANY MACHINE SIGNALS → SONIXENSE → HIGH-LEVEL INSIGHTS + HARMONIZED CUES + SOUND.
 *
 * Website time is unbounded; particles recycle independently at zero opacity.
 * Pitch mode shows the fully established diagram immediately. Reception and cognition
 * respond to the same carriers, with a short propagation delay.
 * (u, v) → pixels via pt()/ax()/ac()/at() — the one place the mobile/desktop
 * axis swap happens; every drawing routine below is orientation-agnostic.
 */

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v: number) => { v = clamp(v); return v * v * (3 - 2 * v); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const T_STATIC = 7.4;  // Representative reduced-motion frame.

// The transformation's zones, as fractions of the primary axis. The box sits on the exact
// centre of the field. boxL/boxR/formR/hornR are recomputed every resize (see below) from
// the transformation layer's rendered size, so streams terminate at its real
// edges — never an independent rectangle that happens to sit near it.
const CAPSULE_ASPECT = 684 / 922; // Retain the established central object proportions.
const FORM_OFFSET = .065, HORN_OFFSET = .185; // how far formR/hornR sit past boxR
const GATHER_U = .84; // past this, the three outcomes gather back toward the listener
const DEFAULT_U = { streamStart: .04, boxL: .385, boxR: .615, formR: .68, hornR: .8, outEnd: .9 };

const STAGES = [
  { name: "Input", detail: "multimodal data", u: .12, um: .1 },
  { name: "Integrate", detail: "align · synchronize · fuse", u: .29, um: .27 },
  { name: "Model", detail: "state · relationships · dynamics", u: .5, um: .48 },
  { name: "Sonify", detail: "resonate · harmonize · encode", u: .71, um: .7 },
  { name: "Render", detail: "real-time · spatial audio", u: .93, um: .92 },
] as const;

// Three related outcomes, never a random scatter: a slow, stable pair for the dominant
// system states ("high-level insights"), a mid pair moving in coordination ("harmonized
// perceptual cues"), and a quicker pair that reads as the clearest acoustic behaviour
// ("sound"). Their frequencies are simple multiples of one shared base — a fifth and an
// octave apart — so the three are always related, never dissonant, however different their
// character. Each cluster is two voices, close enough to read as one coordinated pair.
const BASE_FREQ = 3.4;
const CLUSTERS = [
  { key: "insights", label: "Information-rich sound", centerV: -.145, harmonic: 1, amp: 1.3, mix: .7 },
  { key: "cues", label: "Perceptual audio cues", centerV: 0, harmonic: 1.5, amp: 1, mix: .58 },
  { key: "sound", label: "Spatial sound", centerV: .145, harmonic: 2.2, amp: .82, mix: .84 },
] as const;
// Three voices per cluster now, not two — and each one carries its own small amplitude
// jitter, a tiny (still-harmonic) detune and its own lane spacing, so a cluster reads as
// several related voices, not one line mirrored.
const VOICES_PER_CLUSTER = 3;
type Outcome = { cluster: number; slot: number; phase: number; ampJitter: number; detune: number; laneJitter: number };
const VOICES: Outcome[] = CLUSTERS.flatMap((_, ci) => Array.from({ length: VOICES_PER_CLUSTER }, (_, j) => {
  const seed = ci * 11 + j * 3.7;
  return {
    cluster: ci, slot: j,
    phase: j * 1.05 + hash(seed + 1) * .4,
    ampJitter: .8 + hash(seed + 2) * .4,
    detune: 1 + (hash(seed + 3) - .5) * .06,
    laneJitter: (j - (VOICES_PER_CLUSTER - 1) / 2) * (1 + (hash(seed + 4) - .5) * .3),
  };
}));

type Geo = { mobile: boolean; W: number; H: number; Ld: number; Ad: number; S: number; cx: number; boxHalf: number };

export default function TechnologyField({ pitch = false }: { pitch?: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current, root = wrap.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: pitch });
    if (!ctx) return;
    let lastPitchTime = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const U = { ...DEFAULT_U };
    const stageNodes = Array.from(root.querySelectorAll<HTMLElement>(".tf__stage"));
    const stageValue: string[] = [];
    let g: Geo = { mobile: false, W: 1, H: 1, Ld: 1, Ad: 1, S: 1, cx: .5, boxHalf: .205 };
    let frame = 0, visible = true, start = 0;

    const resize = () => {
      const b = canvas.getBoundingClientRect();
      const W = Math.max(1, b.width), H = Math.max(1, b.height), mobile = W < 700;
      g = mobile
        ? { mobile, W, H, Ld: H, Ad: W * .64, S: (W + H) / 2, cx: W * .5, boxHalf: .44 }
        : { mobile, W, H, Ld: W, Ad: H * .82, S: (W + H) / 2, cx: H * .5, boxHalf: .205 };
      // The zone the lines actually converge to/emerge from — then the capsule is rendered
      // deliberately LARGER than that zone (same centre), so it overlaps their ends. A
      // capsule sized to exactly match would still show a hairline gap at some sizes; one
      // sized bigger never can.
      const CAPSULE_OVERLAP = 1.4;
      const zoneHpx = 2 * g.boxHalf * g.Ad, zoneWpx = zoneHpx * CAPSULE_ASPECT;
      const halfWFrac = (zoneWpx / 2) / g.Ld;
      U.boxL = .5 - halfWFrac; U.boxR = .5 + halfWFrac;
      if (pitch) { U.boxL = .46; U.boxR = .54; }
      U.formR = U.boxR + FORM_OFFSET; U.hornR = U.boxR + HORN_OFFSET;
      root.style.setProperty("--capsule-h", `${zoneHpx * CAPSULE_OVERLAP}px`);
      const ratio = pitch ? 1 : Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * ratio); canvas.height = Math.round(H * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(pitch ? lastPitchTime : reduced.matches ? T_STATIC : now());
    };
    // Website time never wraps. Every carrier and deformation owns its own phase.
    const now = () => (performance.now() - start) / 1000;
    const ex = (u: number, t: number) => .22 + .2 * (1 + Math.sin(t * .61 - u * 6.2)) / 2
        + .18 * (1 + Math.sin(t * .37 - u * 9.1 + 1.7)) / 2;

    const pt = (u: number, v: number): [number, number] =>
      g.mobile ? [g.cx + (v - .5) * g.Ad, u * g.H] : [u * g.W, g.cx + (v - .5) * g.Ad];
    const ax = (): [number, number] => (g.mobile ? [0, 1] : [1, 0]);
    const ac = (): [number, number] => (g.mobile ? [1, 0] : [0, 1]);
    const at = (o: [number, number], a: number, b: number): [number, number] => {
      const [ax0, ay0] = ax(), [cx0, cy0] = ac();
      return [o[0] + ax0 * a + cx0 * b, o[1] + ay0 * a + cy0 * b];
    };

    // Pale lilac-white through to pure white, with a warm gold accent for events — never the
    // teal/cyan of Section 02, which would be lost against this chapter's pink-violet ground.
    function tone(mix: number, accent: number, a: number) {
      const k = clamp(mix), c = clamp(accent);
      let r = lerp(228, 255, k), gr = lerp(203, 255, k), b = lerp(221, 255, k);
      r = lerp(r, 255, c); gr = lerp(gr, 211, c); b = lerp(b, 163, c);
      return `rgba(${r | 0},${gr | 0},${b | 0},${clamp(a, 0, 1)})`;
    }

    function drawStreams(t: number, flowTime: number) {
      const geo = { ...fallbackGeometry, xspan: U.boxL - .115 + .012,
        iface: U.boxL, top: g.mobile ? .06 : .2, span: g.mobile ? .25 : .64, mid: g.mobile ? .46 : .52, x0: g.mobile ? .31 : .115 };
      return drawMachineField(ctx!, g.W, g.H, geo, flowTime * 1000, g.mobile, reduced.matches && !pitch,
        1, true, 1, 1);
    }

    // The translucent DOM core overlays the computational trajectories drawn below.

    // Where a voice sits: a tight, aligned bundle right off the box, opening — asymmetrically,
    // like a horn — into three widely-spaced clusters. It only ever spreads out; it never
    // scatters.
    function outcomeLane(v: Outcome, u: number) {
      const c = CLUSTERS[v.cluster];
      const near = .5 + v.laneJitter * .011;
      const openEase = smooth((u - U.formR) / (U.hornR - U.formR));
      const asym = c.centerV < 0 ? 1.15 : c.centerV > 0 ? .9 : 1; // one strong primary curve, controlled asymmetry
      const far = .5 + c.centerV * asym + v.laneJitter * .013;
      const opened = lerp(near, far, openEase);
      // Three outcomes, told apart to be understood — then gathered back into one point,
      // where the related representations collectively reach perception and cognition.
      const closeEase = smooth((u - GATHER_U) / (U.outEnd - GATHER_U));
      const gathered = .5 + v.laneJitter * .006;
      return lerp(opened, gathered, closeEase);
    }
    // Organized from the moment it leaves the box — never a dissonant hold. What each cluster
    // gets is its own simple multiple of one shared frequency (with a tiny per-voice detune),
    // so insights, cues and sound stay three different characters that are nonetheless always
    // in tune with one another and with themselves.
    function outcomeOffset(v: Outcome, u: number, t: number) {
      const c = CLUSTERS[v.cluster];
      const reach = smooth((u - U.boxR) / .05);
      return c.amp * v.ampJitter * .0095 * Math.sin(BASE_FREQ * c.harmonic * v.detune * (u - U.boxR) * 9 + v.phase + t * .55) * reach;
    }
    function drawOutput(t: number) {
      const steps = 76, uStart = U.boxR - .01, uEnd = U.outEnd; // start from inside boxR, under the capsule — overlap, never a gap
      const voicePts: [number, number][][] = VOICES.map((v) => {
        const row: [number, number][] = [];
        for (let i = 0; i <= steps; i++) {
          const u = lerp(uStart, uEnd, i / steps);
          const edgeFade = 1 - smooth((u - .9) / .07);
          row.push(pt(u, outcomeLane(v, u) + outcomeOffset(v, u, t) * edgeFade));
        }
        return row;
      });
      // A handful of companion filaments, only in the tight zone right off the box — several
      // aligned lines, not one, so the exit already reads as an organized structure.
      const cutIdx = Math.round(((U.formR - uStart) / (uEnd - uStart)) * steps);
      for (let k = 0; k < voicePts.length - 1; k++) {
        ctx!.beginPath();
        for (let i = 0; i <= cutIdx; i++) {
          const x = (voicePts[k][i][0] + voicePts[k + 1][i][0]) / 2, y = (voicePts[k][i][1] + voicePts[k + 1][i][1]) / 2;
          if (i) ctx!.lineTo(x, y); else ctx!.moveTo(x, y);
        }
        ctx!.strokeStyle = tone(.68, 0, .2); ctx!.lineWidth = .6; ctx!.stroke();
      }
      // Each cluster's voices are close enough, and linked by faint ribbons between
      // neighbours, to read as one coordinated outcome — never independent lines.
      const boost = ex(lerp(uStart, uEnd, .5), t);
      CLUSTERS.forEach((c, ci) => {
        for (let j = 0; j < VOICES_PER_CLUSTER - 1; j++) {
          const a = voicePts[ci * VOICES_PER_CLUSTER + j], b = voicePts[ci * VOICES_PER_CLUSTER + j + 1];
          ctx!.beginPath();
          a.forEach((p, k) => { if (k) ctx!.lineTo(p[0], p[1]); else ctx!.moveTo(p[0], p[1]); });
          for (let k = steps; k >= 0; k--) ctx!.lineTo(b[k][0], b[k][1]);
          ctx!.closePath();
          ctx!.fillStyle = tone(c.mix, 0, .032 + boost * .045); ctx!.fill();
        }
      });
      VOICES.forEach((v, i) => {
        ctx!.beginPath();
        voicePts[i].forEach((p, j) => { if (j) ctx!.lineTo(p[0], p[1]); else ctx!.moveTo(p[0], p[1]); });
        ctx!.strokeStyle = tone(CLUSTERS[v.cluster].mix, 0, .5); ctx!.lineWidth = .95; ctx!.stroke();
      });
      // High-level structure: beneath the three individual voices, one calm aggregate shape per
      // cluster — the pattern a listener would actually notice, not the raw signals — marked
      // with a few recurring points, the way recognisable structure in sound has landmarks.
      CLUSTERS.forEach((c, ci) => {
        const lo = ci * VOICES_PER_CLUSTER, hi = lo + VOICES_PER_CLUSTER;
        const envPts: [number, number][] = [];
        for (let s = 0; s <= steps; s++) {
          const u = lerp(uStart, uEnd, s / steps);
          let laneSum = 0;
          for (let vi = lo; vi < hi; vi++) laneSum += outcomeLane(VOICES[vi], u) + outcomeOffset(VOICES[vi], u, t);
          const swell = .007 * Math.sin(t * .18 + ci * 1.7) * smooth((u - U.boxR) / .12);
          envPts.push(pt(u, laneSum / VOICES_PER_CLUSTER + swell));
        }
        ctx!.beginPath();
        envPts.forEach((p, s) => { if (s) ctx!.lineTo(p[0], p[1]); else ctx!.moveTo(p[0], p[1]); });
        ctx!.strokeStyle = tone(c.mix + .06, 0, .17); ctx!.lineWidth = 1.15; ctx!.stroke();
        for (let m = 1; m <= 2; m++) { // stay inside the open fan — past this the lanes gather
          const s = Math.round((m / 4) * steps), q = envPts[s], sz = 2.3;
          const pulseA = .32 + .26 * Math.sin(t * .55 + ci * 2.1 + m * 1.3);
          ctx!.fillStyle = tone(c.mix + .12, .12, pulseA);
          ctx!.beginPath();
          ctx!.moveTo(q[0], q[1] - sz); ctx!.lineTo(q[0] + sz, q[1]); ctx!.lineTo(q[0], q[1] + sz); ctx!.lineTo(q[0] - sz, q[1]);
          ctx!.closePath(); ctx!.fill();
        }
      });
      // Few, meaningful, harmonized: one calm glint per voice, never a swarm — riding smoothly
      // between the sampled points rather than snapping from one to the next, and bright
      // enough now to actually read as something travelling, not a flicker.
      VOICES.forEach((v, i) => {
        const signal = outputSignal(i, t);
        const p = signal.progress, pos = p * steps;
        const i0 = clamp(Math.floor(pos), 0, steps - 1), frac = pos - i0;
        const a = voicePts[i][i0], b = voicePts[i][i0 + 1];
        const q: [number, number] = [lerp(a[0], b[0], frac), lerp(a[1], b[1], frac)];
        const bright = signal.visibility;
        ctx!.save();
        ctx!.shadowColor = tone(CLUSTERS[v.cluster].mix + .1, .08, .8); ctx!.shadowBlur = 4 * bright;
        ctx!.fillStyle = tone(CLUSTERS[v.cluster].mix + .12, .05, .75 * bright * (1 - signal.morph * .7));
        ctx!.beginPath(); ctx!.arc(q[0], q[1], 1.5 + bright * .6, 0, TAU); ctx!.fill();
        ctx!.restore();
        if (signal.morph > 0) {
          // Tiny structures stay attached to a carrier and dissolve before recycling.
          const size = (pitch ? 6 : 3.6) * (1 + smooth((p - .65) / .25) * .35);
          ctx!.save();
          ctx!.translate(...q);
          if (g.mobile) ctx!.rotate(Math.PI / 2);
          ctx!.strokeStyle = tone(CLUSTERS[v.cluster].mix + .1, .04, .6 * bright * signal.morph);
          ctx!.fillStyle = tone(CLUSTERS[v.cluster].mix + .1, .04, .65 * bright * signal.morph);
          ctx!.lineWidth = pitch ? 1.1 : .8;
          if (signal.event === "note") {
            // A single understated note head/stem; never notation or a staff.
            ctx!.beginPath(); ctx!.ellipse(-size * .15, size * .35, size * .45, size * .27, -.4, 0, TAU); ctx!.fill();
            ctx!.beginPath(); ctx!.moveTo(size * .22, size * .3); ctx!.lineTo(size * .22, -size); ctx!.stroke();
          } else if (signal.event === "rings") {
            for (let ring = 0; ring < 2; ring++) {
              ctx!.beginPath(); ctx!.ellipse(0, 0, size * (.65 + ring * .45), size * (.38 + ring * .28), -.2, 0, TAU); ctx!.stroke();
            }
          } else if (signal.event === "packet") {
            ctx!.beginPath();
            for (let k = 0; k <= 24; k++) {
              const x = (k / 24 - .5) * size * 3.6;
              const y = Math.sin(k / 24 * TAU * 2 - t * 1.1) * Math.pow(Math.sin(k / 24 * Math.PI), 2) * size * .55;
              if (k) ctx!.lineTo(x, y); else ctx!.moveTo(x, y);
            }
            ctx!.stroke();
          } else {
            for (let k = -2; k <= 2; k++) {
              ctx!.beginPath(); ctx!.arc(k * size * .62, Math.sin(k * 1.2 - t * .6) * size * .28, size * .13, 0, TAU); ctx!.fill();
            }
          }
          ctx!.restore();
        }
      });
      // Reception is a small resonant field, followed by the separate cognition network.
      {
        const perceptionP = pt(U.outEnd, .5);
        const resonances = perceptionResonances(t);
        const sPulse = 1 - Math.exp(-resonances.reduce((sum, event) =>
          sum + resonanceEnvelope(event.age, event.lifetime, event.decay) * event.strength * 2, 0));
        const margin = (1 - U.outEnd) * g.Ld;
        const receptionR = margin * .17;
        const halo = ctx!.createRadialGradient(...perceptionP, 0, ...perceptionP, receptionR * 2);
        halo.addColorStop(0, tone(.8, .12, .12 + sPulse * .12));
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = halo;
        ctx!.beginPath(); ctx!.arc(...perceptionP, receptionR * 2, 0, TAU); ctx!.fill();
        for (let ring = 0; ring < 3; ring++) {
          const radius = receptionR * (.5 + ring * .34) * (1 + sPulse * .09);
          ctx!.beginPath();
          for (let k = 0; k <= 40; k++) {
            // Open curved wavefronts suggest reception rather than a speaker cone.
            const theta = .38 + k / 40 * (TAU - .76);
            const q = at(perceptionP, Math.cos(theta) * radius * .72, Math.sin(theta) * radius);
            if (k) ctx!.lineTo(...q); else ctx!.moveTo(...q);
          }
          ctx!.strokeStyle = tone(.85, .07, .12 - ring * .018 + sPulse * .08);
          ctx!.lineWidth = .85; ctx!.stroke();
        }
        // Closely spaced wavefronts launch in 33–57 ms succession, oscillate,
        // and damp locally. The surrounding field keeps its existing slow motion.
        for (const event of resonances) {
          for (let front = 0; front < event.fronts; front++) {
            const age = event.age - front * event.spacing;
            const envelope = resonanceEnvelope(age, event.lifetime, event.decay);
            if (envelope <= .001) continue;
            const expansion = 1 - Math.exp(-age * event.velocity);
            const oscillation = Math.sin(age * 32 + event.phase) * Math.exp(-age * 4);
            const radius = receptionR * (.26 + expansion * 1.2 + oscillation * .065);
            ctx!.beginPath();
            for (let k = 0; k <= 64; k++) {
              const theta = .32 + k / 64 * (TAU - .64);
              const deformation = 1 + event.deformation * Math.exp(-age * 3.6)
                * (Math.sin(theta * 3 - age * 35 + event.phase)
                  + .35 * Math.sin(theta * 5 + age * 23));
              const q = at(perceptionP, Math.cos(theta) * radius * .78 * deformation,
                Math.sin(theta) * radius * deformation);
              if (k) ctx!.lineTo(...q); else ctx!.moveTo(...q);
            }
            ctx!.strokeStyle = tone(.88, .1, envelope * event.strength * .72);
            ctx!.lineWidth = .75 + envelope * .35; ctx!.stroke();
          }
        }
        ctx!.fillStyle = tone(.95, .2, .64 + sPulse * .25);
        ctx!.beginPath(); ctx!.arc(...perceptionP, Math.max(1.6, receptionR * .14) * (1 + sPulse * .2), 0, TAU); ctx!.fill();

        // The listener — not drawn as a literal brain, but as what a brain actually is here:
        // a small cluster of nodes and the connections between them, the same diagram language
        // as a neural network. Activity follows reception with a short delay,
        // then propagates outward from the hub.
        const brainR = margin * .15;
        const brainP = at(perceptionP, margin * .74, 0);
        ctx!.beginPath(); ctx!.moveTo(...at(perceptionP, receptionR, 0)); ctx!.lineTo(...brainP);
        ctx!.strokeStyle = tone(.7, 0, .3); ctx!.lineWidth = .8; ctx!.stroke();
        VOICES.forEach((_, index) => {
          const transit = outputSignal(index, t).sinceArrival / .55;
          if (transit >= 1) return;
          const q = at(perceptionP, lerp(receptionR, margin * .74, transit), 0);
          ctx!.fillStyle = tone(.9, .1, Math.pow(Math.sin(transit * Math.PI), 2) * .55);
          ctx!.beginPath(); ctx!.arc(...q, pitch ? 1.8 : 1.2, 0, TAU); ctx!.fill();
        });
        const heard = receptionActivity(t - .55); // Reception reaches cognition after a short delay.

        const bHalo = ctx!.createRadialGradient(brainP[0], brainP[1], 0, brainP[0], brainP[1], brainR * 1.9);
        bHalo.addColorStop(0, tone(.85, .15, .05 + heard * .16));
        bHalo.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = bHalo;
        ctx!.beginPath(); ctx!.arc(brainP[0], brainP[1], brainR * 1.9, 0, TAU); ctx!.fill();

        // An irregular, organic outline — never a perfect circle — the one cue that this is
        // a soft mass of tissue, not another piece of instrumentation.
        const rim = 12;
        ctx!.beginPath();
        for (let i = 0; i <= rim; i++) {
          const th = (i / rim) * TAU;
          const wobble = .82 + hash(Math.floor(i % rim) + 61) * .16 + .02 * Math.sin(t * .25 + i);
          const p = at(brainP, Math.cos(th) * brainR * wobble, Math.sin(th) * brainR * wobble);
          if (i) ctx!.lineTo(p[0], p[1]); else ctx!.moveTo(p[0], p[1]);
        }
        ctx!.closePath();
        ctx!.strokeStyle = tone(.75, 0, .32 + heard * .18); ctx!.lineWidth = 1;
        ctx!.stroke();

        // A small network inside it — a hub, and a ring of nodes around it, wired together
        // like a minimal perceptual/cognitive graph. Each node fires in its own short cascade
        // outward from the hub, rather than all at once, so it reads as a signal actually
        // propagating through it.
        const nodeN = 6;
        const nodes: [number, number][] = Array.from({ length: nodeN }, (_, i) => {
          const th = (i / nodeN) * TAU + hash(i + 63) * .5;
          const r = brainR * (.52 + hash(i + 66) * .14);
          return at(brainP, Math.cos(th) * r, Math.sin(th) * r);
        });
        ctx!.strokeStyle = tone(.85, .05, .12 + heard * .16); ctx!.lineWidth = .8;
        nodes.forEach((n, i) => {
          ctx!.beginPath(); ctx!.moveTo(brainP[0], brainP[1]); ctx!.lineTo(n[0], n[1]); ctx!.stroke();
          const next = nodes[(i + 1) % nodeN];
          ctx!.beginPath(); ctx!.moveTo(n[0], n[1]); ctx!.lineTo(next[0], next[1]); ctx!.stroke();
        });
        const hubFire = smooth(heard / .5);
        ctx!.fillStyle = tone(.95, .3, .3 + hubFire * .55);
        ctx!.beginPath(); ctx!.arc(brainP[0], brainP[1], brainR * .16, 0, TAU); ctx!.fill();
        nodes.forEach((n, i) => {
          const cascade = receptionActivity(t - .55 - hash(i + 69) * .5 - .1);
          const fire = smooth(cascade / .5);
          ctx!.save();
          ctx!.shadowColor = tone(.95, .25, .8); ctx!.shadowBlur = 3.5 * fire;
          ctx!.fillStyle = tone(.9, .2, .22 + fire * .68);
          ctx!.beginPath(); ctx!.arc(n[0], n[1], brainR * .1 + fire * brainR * .06, 0, TAU); ctx!.fill();
          ctx!.restore();
        });

        // Separate, local labels keep the two stages legible even on narrow layouts.
        ctx!.font = `${pitch ? 18 : 9}px ${getComputedStyle(root!).getPropertyValue("--font-mono")}, monospace`;
        ctx!.fillStyle = tone(.85, 0, .58);
        for (const [label, point] of [["PERCEPTION", perceptionP], ["COGNITION", brainP]] as const) {
          const lp = at(point, 0, receptionR * 1.8);
          if (g.mobile) {
            ctx!.textAlign = "left"; ctx!.fillText(label, lp[0], lp[1] + 3);
          } else {
            const tw = ctx!.measureText(label).width;
            ctx!.textAlign = "left";
            ctx!.fillText(label, clamp(lp[0] - tw / 2, 4, g.W - tw - 4), lp[1]);
          }
        }
      }
      // Restrained annotations, not cards — the same register as the source labels on the left.
      ctx!.font = `${pitch ? 22 : 10}px ${getComputedStyle(root!).getPropertyValue("--font-mono")}, monospace`;
      CLUSTERS.forEach((c) => {
        const asym = c.centerV < 0 ? 1.15 : c.centerV > 0 ? .9 : 1;
        const p = pt(.77, .5 + c.centerV * asym * 1.55 - (c.centerV === 0 ? .045 : 0)), label = c.label.toUpperCase();
        ctx!.fillStyle = tone(c.mix, 0, .64);
        if (g.mobile) { ctx!.save(); ctx!.translate(p[0], p[1]); ctx!.rotate(-Math.PI / 2); ctx!.textAlign = "center"; ctx!.fillText(label, 0, 0); ctx!.restore(); }
        else { ctx!.textAlign = "center"; ctx!.fillText(label, p[0], p[1]); }
      });
    }

    function draw(t: number) {
      lastPitchTime = t;
      ctx!.clearRect(0, 0, g.W, g.H);
      const eBox = ex((U.boxL + U.boxR) / 2, t), eOut = ex(U.hornR, t);
      const boxC = pt((U.boxL + U.boxR) / 2, .5);
      const haze = ctx!.createRadialGradient(boxC[0], boxC[1], 8, boxC[0], boxC[1], g.S * .32);
      haze.addColorStop(0, `rgba(248,236,242,${.05 + eBox * .05})`); haze.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = haze; ctx!.fillRect(0, 0, g.W, g.H);
      const outPx = pt(U.hornR, .5);
      const calm = ctx!.createRadialGradient(outPx[0], outPx[1], 6, outPx[0], outPx[1], g.S * .55);
      calm.addColorStop(0, `rgba(255,244,248,${.04 + .04 * eOut})`); calm.addColorStop(1, "rgba(0,0,0,0)");
      ctx!.fillStyle = calm; ctx!.fillRect(0, 0, g.W, g.H);

      ctx!.save();
      drawOutput(t);
      ctx!.restore();
      const flowTime = t;
      const intake = drawStreams(t, flowTime);
      const pressure = intake.reduce((sum, value) => sum + value, 0) / intake.length;
      root!.style.setProperty("--core-charge", String(.35 + .48 * ex(.5, t) + pressure * .17));
      if (pitch) root!.style.setProperty("--pitch-core", "1");
      // Fine internal trajectories replace product gloss with an integration field.
      ctx!.save();
      ctx!.globalAlpha = 1;
      for (let strand = 0; strand < 14; strand++) {
        ctx!.beginPath();
        for (let i = 0; i <= 40; i++) {
          const p = i / 40;
          const compression = intake[Math.floor(strand / 2)] * Math.exp(-p * 5);
          const propagation = Math.sin(p * TAU * 1.4 - flowTime * 2.3 + strand * .3)
            * .009 * pressure * Math.sin(p * Math.PI);
          const v = .5 + (strand - 6.5) * .019 * (1 - compression * .18)
            + Math.sin(p * TAU + strand * .4 - flowTime * .35) * .025 * Math.sin(p * Math.PI)
            + propagation;
          const q = pt(lerp(U.boxL, U.boxR, p), v);
          if (i) ctx!.lineTo(...q); else ctx!.moveTo(...q);
        }
        ctx!.strokeStyle = tone(.7, 0, .16 + intake[Math.floor(strand / 2)] * .09); ctx!.lineWidth = .7; ctx!.stroke();
      }
      ctx!.restore();

      STAGES.forEach((st, i) => {
        const position = i === 1 ? U.boxL : i === 2 ? .5 : (g.mobile ? st.um : st.u);
        const activation = ex(position, t);
        const val = (reduced.matches && !pitch ? .7 : activation).toFixed(2);
        if (stageValue[i] !== val) { stageValue[i] = val; stageNodes[i]?.style.setProperty("--ex", val); }
      });
    }

    if (pitch) {
      // Keep the approved first frame and full-speed motion for the speaking window.
      // Blend two deterministic continuations only at the loop seam; neither clock
      // reverses or stops, and the smooth envelope preserves velocity at the join.
      const outgoing = document.createElement("canvas");
      const outgoingContext = outgoing.getContext("2d")!;
      const renderPitch = (seconds: number) => {
        draw(seconds + 20);
        if (seconds > 88) {
          outgoing.width = canvas.width; outgoing.height = canvas.height;
          outgoingContext.drawImage(canvas, 0, 0);
          const charge = Number(root.style.getPropertyValue("--core-charge"));
          const blend = smooth((seconds - 88) / 2);
          draw(seconds - 90 + 20);
          const incomingCharge = Number(root.style.getPropertyValue("--core-charge"));
          ctx.save();
          ctx.globalCompositeOperation = "destination-in";
          ctx.fillStyle = `rgba(0,0,0,${blend})`;
          ctx.fillRect(0, 0, g.W, g.H);
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = 1 - blend;
          ctx.drawImage(outgoing, 0, 0);
          ctx.restore();
          root.style.setProperty("--core-charge", String(lerp(charge, incomingCharge, blend)));
        }
        root.style.setProperty("--pitch-sources", "1");
      };
      resize();
      const ro = new ResizeObserver(resize); ro.observe(canvas);
      const stop = runPitchTimeline(root, 90, renderPitch, { loop: true, hold: 0 });
      return () => { stop(); ro.disconnect(); };
    }
    const tick = () => { if (visible) draw(now()); if (!reduced.matches) frame = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    }, { rootMargin: "80px" });
    const motion = () => { cancelAnimationFrame(frame); draw(pitch ? lastPitchTime : reduced.matches ? T_STATIC : now()); if (!reduced.matches) frame = requestAnimationFrame(tick); };
    start = performance.now();
    resize(); ro.observe(canvas); io.observe(canvas); reduced.addEventListener("change", motion);
    if (!reduced.matches) frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); reduced.removeEventListener("change", motion); };
  }, [pitch]);

  const boxU = .5;
  return (
    <div className="tf" ref={wrap}>
      <canvas ref={ref} role="img" aria-label="Heterogeneous machine data streams — sensors, imaging, tracking, AI, simulation, robotics and data — enter the SoniXense processing core. A small aligned bundle emerges from it, opens into a curved acoustic form, and resolves into three complementary auditory aspects: information-rich sound, perceptual audio cues, and spatial sound, received by a responsive acoustic resonance field before reaching cognition." />
      <div className="tf__capsule" style={{ "--u": boxU, "--um": boxU } as React.CSSProperties}>
        <div className="tf__capsule-frame">
          <Image className="tf__capsule-logo" src={techLogo} alt="SoniXense" priority={false} />
        </div>
      </div>
      <div className="tf__sources">{SOURCES.map((label, i) => <span key={label} style={{ "--i": i } as React.CSSProperties}>{label}</span>)}</div>
      <ol className="tf__stages">
        {STAGES.map((s, i) => (
          <li className="tf__stage" key={s.name} style={{ "--u": s.u, "--um": s.um } as React.CSSProperties}>
            <span>0{i + 1}</span><strong>{s.name}</strong><em>{s.detail}</em>
          </li>
        ))}
      </ol>
    </div>
  );
}
