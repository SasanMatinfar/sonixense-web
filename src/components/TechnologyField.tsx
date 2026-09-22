"use client";

import { useEffect, useRef } from "react";
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
 * Everything is a pure function of the cycle time `t`; everything downstream
 * reacts only after an excitation pulse has arrived at its position along the
 * transformation (arr(u)), so the motion is causal rather than decorative.
 * (u, v) → pixels via pt()/ax()/ac()/at() — the one place the mobile/desktop
 * axis swap happens; every drawing routine below is orientation-agnostic.
 */

const TAU = Math.PI * 2;
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v: number) => { v = clamp(v); return v * v * (3 - 2 * v); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const CYCLE = 15.5;    // seconds for one full cause → effect → harmonize → settling loop
const ARR0 = .5;       // the first signal arrives — almost immediately, not after a dead pause
const ARRK = 5.6;      // seconds for the excitation to travel u = 0 → 1 (a brisk, legible sweep)
const T_STATIC = 7.4;  // frame shown under prefers-reduced-motion (mid-harmonization)

const arr = (u: number) => ARR0 + u * ARRK;
const env = (tau: number) => (tau <= 0 ? 0 : Math.min(1, (1 - Math.exp(-tau / .45)) * Math.exp(-tau / 3.4) * 1.6));
const ex = (u: number, t: number) => env(t - arr(u)) * (1 - smooth((t - 14) / 1.3));
const pulse = (u: number, t: number, w = .35) => Math.exp(-Math.pow((t - arr(u)) / w, 2));

// The transformation's zones, as fractions of the primary axis. The box sits on the exact
// centre of the field. boxL/boxR/formR/hornR are recomputed every resize (see below) from
// the capsule image's own rendered pixel size, so the streams always terminate at its real
// edges — never an independent rectangle that happens to sit near it.
const CAPSULE_ASPECT = 684 / 922; // the identity pattern's own width:height
const FORM_OFFSET = .065, HORN_OFFSET = .185; // how far formR/hornR sit past boxR
const GATHER_U = .85; // past this, the three outcomes gather back toward the speaker
const U = { streamStart: .04, boxL: .385, boxR: .615, formR: .68, hornR: .8, outEnd: .95 };

const STAGES = [
  { name: "Input", detail: "multimodal data", u: .12, um: .1 },
  { name: "Integrate", detail: "align · synchronize · fuse", u: .29, um: .27 },
  { name: "Model", detail: "state · relationships · dynamics", u: .5, um: .48 },
  { name: "Sonify", detail: "resonate · harmonize · encode", u: .71, um: .7 },
  { name: "Render", detail: "real-time · spatial audio", u: .93, um: .92 },
] as const;

// Section 02's machine-capacity language, continued at the same density: same seven sources,
// same order, same number of strands per source (9, matching Section 02's own desktop count),
// each recognised by behaviour rather than an icon.
const SOURCES = [
  { name: "Sensors", v: .08, n: 9 },
  { name: "Imaging", v: .22, n: 9 },
  { name: "Tracking", v: .38, n: 9 },
  { name: "AI", v: .53, n: 9 },
  { name: "Simulation", v: .67, n: 9 },
  { name: "Robotics", v: .8, n: 9 },
  { name: "Data", v: .93, n: 9 },
] as const;
const TRACKING_SRC = SOURCES.findIndex((s) => s.name === "Tracking");

type Strand = { src: number; v0: number; vEnd: number; ph: number; seed: number };
const STRANDS: Strand[] = (() => {
  const out: Strand[] = [];
  SOURCES.forEach((s, si) => {
    const gap = si === 1 ? .0105 : .013;
    for (let j = 0; j < s.n; j++) {
      out.push({ src: si, v0: s.v + (j - (s.n - 1) / 2) * gap, vEnd: 0, ph: hash(out.length * 1.9) * TAU, seed: out.length + 1 });
    }
  });
  const n = out.length, spread = .108; // the box receives distinct, still-legible entry points, not one merged point
  out.forEach((s, k) => { s.vEnd = .5 + (k - (n - 1) / 2) * (2 * spread / (n - 1)); });
  return out;
})();
const FAMILY_START = SOURCES.map((_, fam) => STRANDS.findIndex((s) => s.src === fam));
// One excitation head per source, not just tracking — the causal wave visibly arrives at
// every source at once, each riding a representative strand from its own family.
const HEAD_STRANDS = SOURCES.map((_, fam) => FAMILY_START[fam] + Math.floor(SOURCES[fam].n / 2));
const IMAGING_RANGE = (() => {
  const start = STRANDS.findIndex((s) => s.src === 1);
  return [start, start + SOURCES[1].n - 1] as const;
})();

// Three related outcomes, never a random scatter: a slow, stable pair for the dominant
// system states ("high-level insights"), a mid pair moving in coordination ("harmonized
// perceptual cues"), and a quicker pair that reads as the clearest acoustic behaviour
// ("sound"). Their frequencies are simple multiples of one shared base — a fifth and an
// octave apart — so the three are always related, never dissonant, however different their
// character. Each cluster is two voices, close enough to read as one coordinated pair.
const BASE_FREQ = 3.4;
const CLUSTERS = [
  { key: "insights", label: "High-level insights", centerV: -.078, harmonic: 1, amp: 1.3, mix: .7 },
  { key: "cues", label: "Harmonized perceptual cues", centerV: 0, harmonic: 1.5, amp: 1, mix: .58 },
  { key: "sound", label: "Sound", centerV: .078, harmonic: 2.2, amp: .82, mix: .84 },
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

export default function TechnologyField() {
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current, root = wrap.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
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
      U.formR = U.boxR + FORM_OFFSET; U.hornR = U.boxR + HORN_OFFSET;
      root.style.setProperty("--capsule-h", `${zoneHpx * CAPSULE_OVERLAP}px`);
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * ratio); canvas.height = Math.round(H * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(reduced.matches ? T_STATIC : now());
    };
    const now = () => (((performance.now() - start) / 1000) % CYCLE + CYCLE) % CYCLE;

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

    // Section 02's own motion, exactly: not a clean periodic wave per source, but five layered,
    // per-strand-randomised terms — a broad carrier, a finer wobble, a chirp that grows across
    // the strand, a localised burst, and a slow drift — the same heterogeneous, non-repeating
    // texture "machine capacity expands" has. Sources are told apart by rendering (dotted,
    // layered, dashed…), never by a distinct waveform.
    function behaviour(s: Strand, u: number, t: number) {
      const character = s.src === 3 ? 1.3 : s.src === 4 ? .62 : s.src === 5 ? .76 : 1;
      const amplitude = .58 + hash(s.seed * 1.4) * 1.05;
      const frequency = .62 + hash(s.seed * 4.8) * 1.7;
      const rate = .07 + hash(s.seed * 9.2) * .24;
      const broad = Math.sin(u * TAU * frequency + s.ph) * .012 * character * amplitude;
      const fine = Math.sin(u * TAU * (1.8 + hash(s.seed * 3) * 3.8) - t * rate + s.ph * .37) * (.004 + hash(s.seed * 6) * .011);
      const chirp = Math.sin(u * u * TAU * (3.5 + hash(s.seed * 10) * 7.5) + t * rate * .52) * (.003 + hash(s.seed * 14) * .008) * Math.sin(u * Math.PI);
      const burst = Math.sin(u * TAU * (7 + hash(s.seed * 18) * 6) - t * rate * 1.7) * .009
        * Math.exp(-Math.pow((u - (.25 + hash(s.seed * 21) * .46)) / (.07 + hash(s.seed * 25) * .13), 2));
      const drift = Math.sin(u * TAU * (.28 + hash(s.seed * 17) * .56) + s.ph * .7) * (.007 + hash(s.seed * 20) * .016);
      return broad + fine + chirp + burst + drift;
    }
    function strandV(s: Strand, u: number) {
      const t = now();
      const conv = smooth((u - U.streamStart) / (U.boxL - .02 - U.streamStart));
      return lerp(s.v0, s.vEnd, conv) + behaviour(s, u, t) * (1 - conv);
    }

    function drawStreams(t: number) {
      const steps = g.mobile ? 56 : 76, uEnd = U.boxL + .01; // run past boxL, under the capsule — overlap, never a gap
      const pts: [number, number][][] = STRANDS.map((s) => {
        const row: [number, number][] = [];
        for (let i = 0; i <= steps; i++) row.push(pt(lerp(U.streamStart, uEnd, i / steps), strandV(s, lerp(U.streamStart, uEnd, i / steps))));
        return row;
      });
      // A depth wash seats the field in the environment — the sources feel like they emerge
      // from something, rather than starting flat on the plain background.
      const washFrom = pt(U.streamStart - .03, .5), washTo = pt(lerp(U.streamStart, U.boxL, .62), .5);
      const wash = ctx!.createLinearGradient(washFrom[0], washFrom[1], washTo[0], washTo[1]);
      wash.addColorStop(0, "rgba(10,4,8,.3)"); wash.addColorStop(1, "rgba(10,4,8,0)");
      ctx!.fillStyle = wash; ctx!.fillRect(0, 0, g.W, g.H);
      // Each source gets a faint halo of its own at its origin — a little more presence,
      // a little more variation, source to source.
      SOURCES.forEach((source, fam) => {
        const op = pt(U.streamStart - .01, source.v), r = g.S * .07;
        const glow = ctx!.createRadialGradient(op[0], op[1], 0, op[0], op[1], r);
        glow.addColorStop(0, tone(.14 + fam * .01, 0, .1 + .04 * Math.sin(t * .5 + fam)));
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = glow; ctx!.fillRect(op[0] - r, op[1] - r, r * 2, r * 2);
      });
      // Imaging reads as dense layered slices: contours interpolated between its own strands.
      for (let k = IMAGING_RANGE[0]; k < IMAGING_RANGE[1]; k++) {
        ctx!.beginPath();
        for (let i = 0; i <= steps; i++) {
          const x = (pts[k][i][0] + pts[k + 1][i][0]) / 2, y = (pts[k][i][1] + pts[k + 1][i][1]) / 2;
          if (i) ctx!.lineTo(x, y); else ctx!.moveTo(x, y);
        }
        ctx!.strokeStyle = tone(.06, 0, .12); ctx!.lineWidth = .6; ctx!.stroke();
      }
      // Line type, not just line colour, tells the sources apart — dotted, dashed, ticked,
      // solid — the same restraint Section 02 keeps: dim enough to read as texture, not signage.
      const DASH_BY_SRC: number[][] = [[], [], [], [3, 3], [11, 5], [], [4, 4]];
      STRANDS.forEach((s, k) => {
        const srcMix = .03 + s.src * .012; // each source keeps a faintly different warmth, not one flat white
        ctx!.setLineDash(DASH_BY_SRC[s.src] ?? []);
        for (let i = 1; i <= steps; i++) {
          const u = lerp(U.streamStart, uEnd, i / steps), conv = smooth((u - U.streamStart) / (uEnd - U.streamStart));
          let lw = 1, al = lerp(.13, .22, conv);
          if (s.src === TRACKING_SRC) { lw = lerp(1.4, 1, conv); al = lerp(.17, .28, conv); } // tracking: still the most confident line, just not blown out
          if (s.src === 0) { // sensors: jittering samples, not a continuous line
            al = .05; if (i % 3 === 0) { ctx!.fillStyle = tone(srcMix, 0, .32); ctx!.beginPath(); ctx!.arc(pts[k][i][0], pts[k][i][1], .9, 0, TAU); ctx!.fill(); }
          }
          if (s.src === 6 && i % 9 > 5) continue; // data: derived, segmented structure
          ctx!.strokeStyle = tone(srcMix, 0, clamp(al)); ctx!.lineWidth = lw;
          ctx!.beginPath(); ctx!.moveTo(pts[k][i - 1][0], pts[k][i - 1][1]); ctx!.lineTo(pts[k][i][0], pts[k][i][1]); ctx!.stroke();
          if (s.src === 5 && i % 6 === 0) { // robotics: small perpendicular ticks — a mechanical, stepped read
            const tick = at(pts[k][i], 0, 2.4);
            ctx!.strokeStyle = tone(srcMix, 0, al * .8); ctx!.lineWidth = .7;
            ctx!.beginPath(); ctx!.moveTo(pts[k][i][0], pts[k][i][1]); ctx!.lineTo(tick[0], tick[1]); ctx!.stroke();
          }
        }
      });
      ctx!.setLineDash([]);
      // A secondary contour threads through each family — the same layered, textured field
      // Section 02 has, not a single clean line standing in for the whole source.
      SOURCES.forEach((source, fam) => {
        const k = FAMILY_START[fam] + Math.floor(source.n / 2);
        ctx!.beginPath();
        for (let i = 0; i <= steps; i++) {
          const u = lerp(U.streamStart, uEnd, i / steps), conv = smooth((u - U.streamStart) / (uEnd - U.streamStart));
          const off = .024 * Math.sin(u * TAU * (1.5 + fam * .35) - t * .13 + fam * 1.7) * (1 - conv);
          const p = pt(u, strandV(STRANDS[k], u) + off);
          if (i) ctx!.lineTo(p[0], p[1]); else ctx!.moveTo(p[0], p[1]);
        }
        ctx!.strokeStyle = tone(.08, 0, .09); ctx!.lineWidth = .55; ctx!.stroke();
      });
      // Every source keeps sending — many independent feeds, none of them metronomic, and not
      // all moving the same way. Each one settles into one of four small behaviours: most
      // cruise at their own steady pace; some arrive in a quick eased burst and trail behind
      // themselves as they do; some hold, then jump, holding again — a stutter, like a sensor
      // sampling in steps; a few wander with a looser, looping path rather than a straight run.
      STRANDS.forEach((s, k) => {
        for (let n = 0; n < 5; n++) {
          const seed = k * 3.1 + n * 7.3;
          // Density: each slot fades in and out of existence on its own slow, random cycle,
          // rather than a fixed count of dots being present every frame.
          const onRate = .18 + hash(seed + 13) * .5, onPhase = hash(seed + 15) * TAU;
          const threshold = -.15 + hash(seed + 17) * .35;
          const presence = smooth((Math.sin(t * onRate + onPhase) - threshold) / .3);
          if (presence <= 0) continue;
          const ph0 = hash(k * 5.7 + n * 2.3);
          const cls = hash(seed + 40);
          const isBurst = cls < .22, isStutter = !isBurst && cls < .4, isLoop = !isBurst && !isStutter && cls < .58;
          // else: cruise, the plain steady majority (~42%)

          let p: number, speed = .55; // speed: 0..1-ish, how fast this dot reads right now — drives trail length
          if (isBurst) {
            const cyc = ((t * (.3 + hash(seed) * .4) + ph0) % 1 + 1) % 1;
            p = smooth(cyc); // eased S-curve: slow off the source, quick through the middle, slow into the box
            speed = Math.sin(cyc * Math.PI);
          } else if (isStutter) {
            const segments = 4 + Math.floor(hash(seed + 2) * 3);
            const raw = ((t * (.09 + hash(seed) * .13) + ph0) % 1 + 1) % 1;
            const idx = Math.floor(raw * segments), frac = raw * segments - idx;
            const jump = smooth((frac - .68) / .3);
            p = (idx + jump) / segments;
            speed = jump * (1 - jump) * 4; // only "moving" during the brief jump between holds
          } else {
            const baseSpeed = .08 + hash(seed) * .34;
            const driftFreq = .25 + hash(seed + 4) * 1.1, driftPhase = hash(seed + 8) * TAU;
            p = t * baseSpeed + ph0 + .05 * Math.sin(t * driftFreq + driftPhase);
            p -= Math.floor(p);
          }
          const u = lerp(U.streamStart, uEnd, p);
          // Movement: most drift a little off the strand's centreline; the loop class wanders
          // with a second, faster frequency layered in, so its path visibly curls rather than
          // just trembling.
          const wander = isLoop
            ? .022 * Math.sin(t * (.8 + hash(seed + 20) * 1.4) + hash(seed + 22) * TAU) + .012 * Math.sin(t * (2.4 + hash(seed + 24) * 2.2) + hash(seed + 26) * TAU)
            : .01 * Math.sin(t * (.7 + hash(seed + 20) * 1.6) + hash(seed + 22) * TAU);
          const q = at(pt(u, strandV(s, u)), 0, wander * g.Ad);
          const glint = .55 + .45 * Math.sin(t * 2.6 + k * 1.7 + n * 3.1);
          const size = isBurst ? .8 + speed * .9 : isStutter ? .75 + speed * .7 : .85 + .55 * Math.sin(Math.PI * p);
          const alpha = presence * (isStutter ? .26 + speed * .22 : .32) * glint * Math.sin(Math.PI * clamp(p, .02, .98));
          // A brief trail behind the fast ones — the only visible sign of how quickly they move.
          if ((isBurst || isStutter) && speed > .12) {
            const pBack = clamp(p - (isBurst ? .028 : .02) * speed);
            const uBack = lerp(U.streamStart, uEnd, pBack);
            const back = at(pt(uBack, strandV(s, uBack)), 0, wander * g.Ad);
            ctx!.strokeStyle = tone(.1, 0, alpha * .5); ctx!.lineWidth = .7;
            ctx!.beginPath(); ctx!.moveTo(back[0], back[1]); ctx!.lineTo(q[0], q[1]); ctx!.stroke();
          }
          ctx!.fillStyle = tone(.1, 0, alpha);
          ctx!.beginPath(); ctx!.arc(q[0], q[1], presence * size, 0, TAU); ctx!.fill();
        }
      });
      // Absorption: each stream arrives at its own point on the box face and is received there.
      const flash = pulse(U.boxL, t, .5);
      STRANDS.forEach((s) => {
        const p = pt(uEnd, s.vEnd);
        ctx!.fillStyle = tone(.4, .3, .12 + flash * .5); ctx!.beginPath(); ctx!.arc(p[0], p[1], .9 + flash * 1.1, 0, TAU); ctx!.fill();
      });
      ctx!.fillStyle = "rgba(240,222,231,.58)"; ctx!.font = "500 9px ui-monospace, SFMono-Regular, Menlo, monospace";
      SOURCES.forEach((s) => {
        const p = pt(U.streamStart - .008, s.v), label = s.name.toUpperCase();
        if (g.mobile) { ctx!.save(); ctx!.translate(p[0] + 3, p[1] - 4); ctx!.rotate(-Math.PI / 2); ctx!.textAlign = "left"; ctx!.fillText(label, 0, 0); ctx!.restore(); }
        else {
          ctx!.textAlign = "right";
          // "Simulation" is the longest label — keep its full width on-canvas even on a
          // narrower monitor, rather than let the right edge of the text run past x = 0.
          const longest = ctx!.measureText("SIMULATION").width;
          ctx!.fillText(label, Math.max(p[0] - 4, longest + 6), p[1] + 3);
        }
      });
    }

    // The SoniXense core is now the same identity capsule as the Hero — held as a DOM image
    // over the canvas, not redrawn here — so the canvas only needs to know where it sits.

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
      // because what actually reaches a person is a single, perceptible thing: sound.
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
        const p = (t * .05 + hash(i * 3.7)) % 1, pos = p * steps;
        const i0 = clamp(Math.floor(pos), 0, steps - 1), frac = pos - i0;
        const a = voicePts[i][i0], b = voicePts[i][i0 + 1];
        const q: [number, number] = [lerp(a[0], b[0], frac), lerp(a[1], b[1], frac)];
        const bright = smooth(Math.sin(Math.PI * p));
        ctx!.save();
        ctx!.shadowColor = tone(CLUSTERS[v.cluster].mix + .1, .08, .8); ctx!.shadowBlur = 4 * bright;
        ctx!.fillStyle = tone(CLUSTERS[v.cluster].mix + .12, .05, .75 * bright);
        ctx!.beginPath(); ctx!.arc(q[0], q[1], 1.5 + bright * .6, 0, TAU); ctx!.fill();
        ctx!.restore();
      });
      // The three outcomes gather back into one point — met there by an emitter unmistakably
      // built around a speaker's own driver (a diaphragm of concentric rings, viewed head-on),
      // housed in the same instrument-panel language as everything else in this field (a
      // faceted frame, ticks, dashes), not a plain household icon. Every size below is a
      // fraction of the field's own real margin past outEnd, so it can never crowd the edge.
      {
        const speakerP = pt(U.outEnd, .5);
        const sPulse = ex(U.outEnd, t);
        const margin = (1 - U.outEnd) * g.Ld;
        const core = margin * .15, coneA = margin * .22, coneB = margin * .29, coneC = margin * .37;
        const hex = margin * .43, tickR = margin * .49, tickLen = margin * .09;
        const spin = t * .045;

        // A soft field glow, like each source's own halo — this reads as an active point,
        // not a flat drawing dropped on top.
        const halo = ctx!.createRadialGradient(speakerP[0], speakerP[1], 0, speakerP[0], speakerP[1], hex * 2.1);
        halo.addColorStop(0, tone(.8, .12, .15 + sPulse * .12));
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = halo;
        ctx!.beginPath(); ctx!.arc(speakerP[0], speakerP[1], hex * 2.1, 0, TAU); ctx!.fill();

        // The driver itself — a speaker cone's own concentric rings, viewed straight on, the
        // one shape that reads as "this is a speaker" before anything else here does.
        [coneA, coneB, coneC].forEach((r, i) => {
          ctx!.beginPath(); ctx!.arc(speakerP[0], speakerP[1], r, 0, TAU);
          ctx!.strokeStyle = tone(.6, 0, .34 - i * .07 + sPulse * .12); ctx!.lineWidth = 1;
          ctx!.stroke();
        });

        // A faceted housing, slowly turning — a hexagonal frame around the driver, never a
        // plain circle.
        ctx!.save();
        ctx!.strokeStyle = tone(.7, 0, .4 + sPulse * .16); ctx!.lineWidth = 1;
        ctx!.setLineDash([hex * .5, hex * .32]);
        ctx!.beginPath();
        for (let i = 0; i <= 6; i++) {
          const th = spin + (i / 6) * TAU;
          const p = at(speakerP, Math.cos(th) * hex, Math.sin(th) * hex);
          if (i) ctx!.lineTo(p[0], p[1]); else ctx!.moveTo(p[0], p[1]);
        }
        ctx!.stroke();
        ctx!.restore();

        // A ring of short ticks around it — mounting points, a dial, a piece of instrumentation.
        ctx!.strokeStyle = tone(.6, 0, .3);
        ctx!.lineWidth = 1;
        for (let i = 0; i < 16; i++) {
          const th = spin * .6 + (i / 16) * TAU;
          const a0 = at(speakerP, Math.cos(th) * tickR, Math.sin(th) * tickR);
          const a1 = at(speakerP, Math.cos(th) * (tickR + tickLen), Math.sin(th) * (tickR + tickLen));
          ctx!.beginPath(); ctx!.moveTo(a0[0], a0[1]); ctx!.lineTo(a1[0], a1[1]); ctx!.stroke();
        }

        // The glowing dust cap at the centre — where the gathered lines are actually received,
        // and where the sound is actually made. It breathes gently even between excitations,
        // and flares with each one, rather than sitting dark until the pulse arrives.
        const breathe = .5 + .5 * Math.sin(t * .7);
        const coreGlow = ctx!.createRadialGradient(speakerP[0], speakerP[1], 0, speakerP[0], speakerP[1], core);
        coreGlow.addColorStop(0, tone(.95, .35, .75 + sPulse * .25));
        coreGlow.addColorStop(.6, tone(.85, .2, .32 + breathe * .12 + sPulse * .2));
        coreGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = coreGlow;
        ctx!.beginPath(); ctx!.arc(speakerP[0], speakerP[1], core, 0, TAU); ctx!.fill();
        ctx!.strokeStyle = tone(.9, .1, .55 + sPulse * .3); ctx!.lineWidth = .9;
        ctx!.beginPath(); ctx!.arc(speakerP[0], speakerP[1], core * .55, 0, TAU); ctx!.stroke();

        // Real sound waves, not a static decoration — dashed, like a scanning pulse rather
        // than a soft ripple, several in flight together so the emission reads as continuous,
        // never a single blip, and each still tied to the same excitation that just travelled
        // the whole field.
        for (let f = 0; f < 4; f++) {
          const dt = f * .32, a = t - (arr(U.outEnd) + dt), life = 2.3;
          if (a < 0 || a > life) continue;
          const grow = smooth(a / .35);
          const rr = tickR + margin * .045 * f + margin * .16 * grow;
          const alpha = grow * Math.pow(1 - a / life, 1.4) * .58;
          if (alpha <= .01) continue;
          ctx!.save();
          ctx!.strokeStyle = tone(.92, .15, alpha); ctx!.lineWidth = 1.1;
          ctx!.setLineDash([rr * .13, rr * .09]);
          ctx!.beginPath();
          for (let i = 0; i <= 20; i++) {
            const th = -.66 + (i / 20) * 1.32;
            const p = at(speakerP, Math.cos(th) * rr, Math.sin(th) * rr);
            if (i) ctx!.lineTo(p[0], p[1]); else ctx!.moveTo(p[0], p[1]);
          }
          ctx!.stroke();
          ctx!.restore();
        }
      }
      // Restrained annotations, not cards — the same register as the source labels on the left.
      ctx!.font = "600 9px ui-monospace, SFMono-Regular, Menlo, monospace";
      CLUSTERS.forEach((c) => {
        const asym = c.centerV < 0 ? 1.15 : c.centerV > 0 ? .9 : 1;
        const p = pt(.82, .5 + c.centerV * asym * 1.55), label = c.label.toUpperCase();
        ctx!.fillStyle = tone(c.mix, 0, .64);
        if (g.mobile) { ctx!.save(); ctx!.translate(p[0], p[1]); ctx!.rotate(-Math.PI / 2); ctx!.textAlign = "center"; ctx!.fillText(label, 0, 0); ctx!.restore(); }
        else { ctx!.textAlign = "center"; ctx!.fillText(label, p[0], p[1]); }
      });
    }

    function draw(t: number) {
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

      drawOutput(t);
      drawStreams(t);

      // The excitation that drives everything downstream — visible only until it is received.
      // Each source gets its own start time and its own pace now, not one synchronised sweep
      // — they arrive at, and cross, the field independently, the way real signals would.
      HEAD_STRANDS.forEach((idx, fam) => {
        const seed = fam * 7.3;
        const ownArr0 = ARR0 + hash(seed + 1) * CYCLE * .3;
        const ownArrK = ARRK * (.72 + hash(seed + 2) * .6);
        const hu = clamp((t - ownArr0) / ownArrK, 0, U.boxL - .01);
        if (t <= ownArr0 || hu >= U.boxL - .012) return;
        const ha = 1 - smooth((hu - (U.boxL - .06)) / .05);
        const head = STRANDS[idx], hp = pt(hu, strandV(head, hu));
        const r = 10 + hash(fam * 3.7) * 6, ownHa = ha * (.75 + hash(fam * 5.1) * .35);
        const glow = ctx!.createRadialGradient(hp[0], hp[1], 0, hp[0], hp[1], r);
        glow.addColorStop(0, `rgba(238,132,141,${.4 * ownHa})`); glow.addColorStop(1, "rgba(238,132,141,0)");
        ctx!.fillStyle = glow; ctx!.beginPath(); ctx!.arc(hp[0], hp[1], r, 0, TAU); ctx!.fill();
        ctx!.fillStyle = `rgba(250,226,226,${.85 * ownHa})`; ctx!.beginPath(); ctx!.arc(hp[0], hp[1], 1.5 + hash(fam * 6.3) * .6, 0, TAU); ctx!.fill();
      });

      STAGES.forEach((st, i) => {
        const val = (reduced.matches ? .7 : ex(g.mobile ? st.um : st.u, t)).toFixed(2);
        if (stageValue[i] !== val) { stageValue[i] = val; stageNodes[i]?.style.setProperty("--ex", val); }
      });
    }

    const tick = () => { if (visible) draw(now()); if (!reduced.matches) frame = requestAnimationFrame(tick); };
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) start = performance.now() - now() * 1000;
      visible = e.isIntersecting;
    }, { rootMargin: "80px" });
    const motion = () => { cancelAnimationFrame(frame); draw(reduced.matches ? T_STATIC : now()); if (!reduced.matches) frame = requestAnimationFrame(tick); };
    start = performance.now();
    resize(); ro.observe(canvas); io.observe(canvas); reduced.addEventListener("change", motion);
    if (!reduced.matches) frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); reduced.removeEventListener("change", motion); };
  }, []);

  const boxU = (U.boxL + U.boxR) / 2;
  return (
    <div className="tf" ref={wrap}>
      <canvas ref={ref} role="img" aria-label="Heterogeneous machine data streams — sensors, imaging, tracking, AI, simulation, robotics and data — enter the SoniXense processing core. A small aligned bundle emerges from it, opens into a curved acoustic form, and resolves into three harmonized outcomes: high-level insights, harmonized perceptual cues, and sound." />
      <div className="tf__capsule" style={{ "--u": boxU, "--um": boxU } as React.CSSProperties}>
        <div className="tf__capsule-frame">
          <Image
            className="tf__capsule-pattern"
            src="/images/hero/sonixense-identity-pattern.png"
            alt=""
            width={684}
            height={922}
          />
          <Image className="tf__capsule-logo" src={techLogo} alt="SoniXense" priority={false} />
          <p className="tf__capsule-caption">Adaptive perceptualization · Congruent multisensory cues</p>
        </div>
      </div>
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
