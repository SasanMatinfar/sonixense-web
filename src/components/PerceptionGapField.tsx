"use client";

import { useEffect, useRef } from "react";

const TAU = Math.PI * 2;
const labels = ["Sensors", "Imaging", "Tracking", "AI", "Simulation", "Robotics", "Data"];
const limits = ["Vision", "Attention", "Working memory", "Cognition", "Decision"];
const hash = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v: number) => { v = clamp(v); return v * v * (3 - 2 * v); };

export default function PerceptionGapField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 1, height = 1, frame = 0, visible = true;

    function resize() {
      const bounds = canvas!.getBoundingClientRect();
      width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(width * ratio); canvas!.height = Math.round(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(reduced.matches ? 8400 : performance.now());
    }

    function streamPoint(stream: number, progress: number, time: number) {
      const mobile = width < 700;
      const siblings = mobile ? 6 : 9;
      const family = Math.floor(stream / siblings);
      const sibling = stream % siblings;
      const familyPosition = family / 6;
      const strandSeed = family * 31.7 + sibling * 7.13;
      const amplitude = .58 + hash(strandSeed + 1.4) * 1.05;
      const frequency = .62 + hash(strandSeed + 4.8) * 1.7;
      const motionRate = .00007 + hash(strandSeed + 9.2) * .00024;
      const strandPhase = hash(strandSeed + 13.6) * TAU;
      if (mobile) {
        const startX = width * .31 + (sibling - (siblings - 1) / 2) * 1.2;
        const startY = height * (.15 + familyPosition * .28);
        const bottleneckY = height * .66;
        const y = startY + progress * (bottleneckY - startY);
        const converge = smooth((progress - .6) / .36);
        const character = family === 4 ? .65 : family === 3 ? 1.3 : family === 5 ? .82 : 1;
        const familyMotion = Math.sin(progress * TAU * frequency + strandPhase) * width * (.009 + sibling * .0011) * character * amplitude;
        const fineMotion = Math.sin(progress * TAU * (2.1 + hash(strandSeed + 3) * 3.4) - time * motionRate + strandPhase * .4) * width * (.0025 + hash(strandSeed + 6) * .0055);
        const turbulence = Math.sin(progress * TAU * (5.2 + hash(strandSeed + 11) * 5.8) + time * motionRate * .63) * width * (.0012 + hash(strandSeed + 15) * .0028) * Math.sin(progress * Math.PI);
        const x = startX * (1 - converge) + width * .5 * converge + (familyMotion + fineMotion + turbulence) * (1 - converge * .72);
        return { x, y, compression: smooth((y / bottleneckY - .77) / .23) };
      }
      const startY = height * (.15 + familyPosition * .71) + (sibling - (siblings - 1) / 2) * 1.45;
      const x = width * .115 + progress * width * .61;
      const bottleneckX = width * .7;
      const converge = smooth((progress - .58) / .38);
      const character = family === 4 ? .62 : family === 3 ? 1.3 : family === 5 ? .76 : 1;
      const broad = Math.sin(progress * TAU * frequency + strandPhase) * height * (.006 + sibling * .0008) * character * amplitude;
      const fine = Math.sin(progress * TAU * (1.8 + hash(strandSeed + 3) * 3.8) - time * motionRate + strandPhase * .37) * height * (.0018 + hash(strandSeed + 6) * .0062);
      const chirp = Math.sin(progress * progress * TAU * (3.5 + hash(strandSeed + 10) * 7.5) + time * motionRate * .52) * height * (.0014 + hash(strandSeed + 14) * .0036) * Math.sin(progress * Math.PI);
      const localBurst = Math.sin(progress * TAU * (7 + hash(strandSeed + 18) * 6) - time * motionRate * 1.7) * height * .0045 * Math.exp(-Math.pow((progress - (.25 + hash(strandSeed + 21) * .46)) / (.07 + hash(strandSeed + 25) * .13), 2));
      const drift = Math.sin(progress * TAU * (.28 + hash(strandSeed + 17) * .56) + strandPhase * .7) * height * (.004 + hash(strandSeed + 20) * .009);
      const y = startY * (1 - converge) + height * .55 * converge + (broad + fine + chirp + localBurst + drift) * (1 - converge * .72);
      return { x, y, compression: smooth((x / bottleneckX - .72) / .28) };
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, width, height);
      const mobile = width < 700;
      const streamCount = mobile ? 42 : 63;
      const phase = time * .00012;
      const cycle = reduced.matches ? .64 : (time % 9000) / 9000;
      const interfaceCharge = smooth((cycle - .48) / .2) * (1 - smooth((cycle - .78) / .14));
      const decisionCharge = smooth((cycle - .72) / .12) * (1 - smooth((cycle - .96) / .04));
      // Broad fields establish scale and depth without containing the machine side.
      const haze = ctx!.createRadialGradient(width * (mobile ? .5 : .38), height * .48, 20,
        width * (mobile ? .5 : .38), height * .48, width * .58);
      haze.addColorStop(0, "rgba(72,139,143,.085)"); haze.addColorStop(1, "rgba(0,43,52,0)");
      ctx!.fillStyle = haze; ctx!.fillRect(0, 0, width, height);

      for (let stream = 0; stream < streamCount; stream++) {
        const siblings = mobile ? 6 : 9;
        const kind = Math.floor(stream / siblings);
        let previous: ReturnType<typeof streamPoint> | null = null;
        const steps = mobile ? 52 : 84;
        for (let i = 0; i <= steps; i++) {
          const p = i / steps;
          const point = streamPoint(stream, p, time);
          const packet = .28 + .72 * Math.pow(Math.max(0, Math.sin(p * TAU * (1.2 + kind * .13) - phase * (1 + kind * .16) + stream)), 4);
          const depth = .28 + hash(stream * 11) * .72;
          const activity = packet * (1 - point.compression * .42);
          if (previous) {
            const segmentPattern = 3 + Math.floor(hash(stream * 9.7) * 8);
            const segmentLength = 1 + Math.floor(hash(stream * 4.3 + 2) * Math.max(1, segmentPattern - 1));
            const visibleSegment = (i + Math.floor(hash(stream * 2.1) * segmentPattern)) % segmentPattern < segmentLength;
            if (visibleSegment) {
              const shimmer = .72 + Math.sin(time * (.00045 + hash(stream + 6) * .0011) + stream) * .28;
              ctx!.strokeStyle = `rgba(145,218,214,${(.026 + activity * .095) * depth * shimmer})`;
              ctx!.lineWidth = .4 + depth * (.45 + hash(stream + 12) * .52);
              ctx!.beginPath(); ctx!.moveTo(previous.x, previous.y); ctx!.lineTo(point.x, point.y); ctx!.stroke();
            }
          }
          if ((kind === 0 && i % 7 === 0) || (kind === 3 && i % 11 === 0) || (point.compression > .55 && i % 5 === 0)) {
            ctx!.fillStyle = `rgba(198,235,228,${(.045 + activity * .14) * depth})`;
            ctx!.beginPath(); ctx!.arc(point.x, point.y, .5 + depth * .8, 0, TAU); ctx!.fill();
          }
          previous = point;
        }
      }

      // A few spatial contours behave differently from trajectories and samples.
      for (let contour = 0; contour < (mobile ? 4 : 7); contour++) {
        ctx!.beginPath();
        for (let i = 0; i <= 65; i++) {
          const p = i / 65;
          const point = streamPoint(contour * (mobile ? 6 : 9) + 2, p, time);
          const offset = Math.sin(p * TAU * 2.3 + contour + phase) * (mobile ? 9 : 13) * (1 - point.compression);
          if (mobile) point.x += offset; else point.y += offset;
          if (i) ctx!.lineTo(point.x, point.y); else ctx!.moveTo(point.x, point.y);
        }
        ctx!.strokeStyle = `rgba(124,200,202,${.07 + contour * .006})`;
        ctx!.lineWidth = .65; ctx!.stroke();
      }

      // Bright samples travel with each source family and collect at the interface.
      const siblings = mobile ? 6 : 9;
      for (let family = 0; family < 7; family++) {
        for (let sample = 0; sample < 3; sample++) {
          const sampleSeed = family * 17.31 + sample * 5.73;
          const speed = .58 + hash(sampleSeed + 2.1) * 1.34;
          const offset = hash(sampleSeed + 8.4);
          const travel = reduced.matches ? offset : (time * .0001 * speed + offset) % 1;
          const point = streamPoint(family * siblings + 2 + sample, travel, time);
          const presence = Math.pow(Math.sin(travel * Math.PI), .45);
          const irregularGlow = reduced.matches ? .68 : clamp(
            .48
            + Math.sin(time * (.0011 + hash(sampleSeed + 4) * .0024) + sampleSeed) * .27
            + Math.sin(time * (.0037 + hash(sampleSeed + 9) * .0048) + sampleSeed * 2.3) * .19
          );
          const brightness = presence * (.34 + irregularGlow * .66);
          const radius = 1.05 + hash(sampleSeed + 12) * 1.5 + irregularGlow * .38;
          ctx!.shadowColor = `rgba(188,239,232,${.38 + irregularGlow * .5})`;
          ctx!.shadowBlur = 2 + brightness * 8;
          ctx!.fillStyle = `rgba(210,244,238,${brightness * .82})`;
          ctx!.beginPath(); ctx!.arc(point.x, point.y, radius, 0, TAU); ctx!.fill();
        }
      }
      ctx!.shadowBlur = 0;

      const bx = mobile ? width * .5 : width * .7;
      const by = mobile ? height * .62 : height * .55;
      // The interface is a constrained zone, not a funnel illustration.
      const gradient = mobile
        ? ctx!.createLinearGradient(0, by - 50, 0, by + 50)
        : ctx!.createLinearGradient(bx - 50, 0, bx + 50, 0);
      gradient.addColorStop(0, "rgba(181,97,130,0)");
      gradient.addColorStop(.48, "rgba(181,97,130,.11)");
      gradient.addColorStop(.5, "rgba(207,120,126,.48)");
      gradient.addColorStop(.52, "rgba(181,97,130,.11)");
      gradient.addColorStop(1, "rgba(181,97,130,0)");
      ctx!.fillStyle = gradient;
      if (mobile) ctx!.fillRect(width * .1, by - 50, width * .8, 100); else ctx!.fillRect(bx - 50, height * .12, 100, height * .76);

      // The arriving samples charge the perceptual boundary before one decision fires.
      ctx!.save();
      ctx!.shadowColor = "rgba(238,112,125,.95)";
      ctx!.shadowBlur = 7 + interfaceCharge * 22;
      ctx!.strokeStyle = `rgba(224,103,119,${.42 + interfaceCharge * .56})`;
      ctx!.lineWidth = 1.25 + interfaceCharge * 2.6;
      ctx!.beginPath();
      if (mobile) { ctx!.moveTo(width * .16, by); ctx!.lineTo(width * .84, by); }
      else { ctx!.moveTo(bx, height * .16); ctx!.lineTo(bx, height * .9); }
      ctx!.stroke();
      for (let dot = 0; dot < 18; dot++) {
        const spread = (hash(dot * 7.3) - .5) * (mobile ? width * .62 : height * .68);
        const offset = (hash(dot * 11.7) - .5) * (7 - interfaceCharge * 4);
        const x = mobile ? bx + spread : bx + offset;
        const y = mobile ? by + offset : by + spread;
        ctx!.fillStyle = `rgba(245,151,157,${interfaceCharge * (.24 + hash(dot) * .58)})`;
        ctx!.beginPath(); ctx!.arc(x, y, .7 + hash(dot * 3.1) * 1.45, 0, TAU); ctx!.fill();
      }
      ctx!.restore();

      // Only one calm state remains legible after the constraint.
      const pulse = reduced.matches ? .62 : decisionCharge;
      if (mobile) {
        ctx!.strokeStyle = "rgba(188,218,211,.25)"; ctx!.lineWidth = .7;
        ctx!.beginPath(); ctx!.moveTo(bx, by + 6); ctx!.lineTo(bx, height * .88); ctx!.stroke();
        ctx!.shadowColor = "rgba(246,131,143,.95)"; ctx!.shadowBlur = 5 + pulse * 24;
        ctx!.fillStyle = `rgba(238,132,141,${.72 + pulse * .28})`; ctx!.beginPath(); ctx!.arc(bx, height * .88, 5.2 + pulse * 2.1, 0, TAU); ctx!.fill(); ctx!.shadowBlur = 0;
      } else {
        ctx!.strokeStyle = "rgba(188,218,211,.25)"; ctx!.lineWidth = .7;
        ctx!.beginPath(); ctx!.moveTo(bx + 6, by); ctx!.lineTo(width * .91, by); ctx!.stroke();
        ctx!.shadowColor = "rgba(246,131,143,.95)"; ctx!.shadowBlur = 5 + pulse * 24;
        ctx!.fillStyle = `rgba(238,132,141,${.72 + pulse * .28})`; ctx!.beginPath(); ctx!.arc(width * .91, by, 5.2 + pulse * 2.1, 0, TAU); ctx!.fill(); ctx!.shadowBlur = 0;
      }
    }

    function tick(time: number) { if (visible) draw(time); if (!reduced.matches) frame = requestAnimationFrame(tick); }
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "100px" });
    const motion = () => { cancelAnimationFrame(frame); draw(8400); if (!reduced.matches) frame = requestAnimationFrame(tick); };
    resize(); ro.observe(canvas); io.observe(canvas); reduced.addEventListener("change", motion);
    if (!reduced.matches) frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); reduced.removeEventListener("change", motion); };
  }, []);

  return <div className="perception-field" aria-label="Many machine information streams converge through a constrained perceptual interface into one human decision point">
    <canvas ref={ref} aria-hidden="true" />
    <p className="perception-field__machine-title">Machine capacity expands</p>
    <div className="perception-field__machine-labels">{labels.map(label => <span key={label}>{label}</span>)}</div>
    <div className="perception-field__interface"><strong>Perceptual interface</strong>{limits.map(label => <span key={label}>{label}</span>)}</div>
    <div className="perception-field__decision"><strong>One human<br />decision-maker</strong></div>
  </div>;
}
