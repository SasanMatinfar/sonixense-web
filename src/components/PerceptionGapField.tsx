"use client";

import { useEffect, useRef } from "react";

import { drawMachineField, fallbackGeometry, SOURCES as labels, type Geometry } from "./fields/machineField";
import { runPitchTimeline } from "./fields/pitchTimeline";
const TAU = Math.PI * 2;
const limits = ["Vision", "Attention", "Working memory", "Cognition", "Decision"];
const hash = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v: number) => { v = clamp(v); return v * v * (3 - 2 * v); };

// The canvas and the typography share one coordinate system: the layout is defined once, as CSS variables on the field.
export default function PerceptionGapField({ children, pitch = false }: { children?: React.ReactNode; pitch?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: pitch });
    if (!ctx) return;
    let lastPitchTime = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const field = canvas.parentElement as HTMLElement;
    const geo: Geometry = { ...fallbackGeometry };
    const charge: Record<string, string> = {};
    let width = 1, height = 1, frame = 0, visible = true;

    function readGeometry() {
      const style = getComputedStyle(field);
      (Object.keys(fallbackGeometry) as (keyof Geometry)[]).forEach((key) => {
        const name = "--gap-" + key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());
        const value = parseFloat(style.getPropertyValue(name));
        geo[key] = Number.isNaN(value) ? fallbackGeometry[key] : value;
      });
    }
    // Typography answers the animation subtly; the copy is fully legible at every value.
    function setCharge(name: string, value: number) {
      const rounded = value.toFixed(2);
      if (charge[name] !== rounded) { charge[name] = rounded; field.style.setProperty(name, rounded); }
    }

    function resize() {
      readGeometry();
      const bounds = canvas!.getBoundingClientRect();
      width = Math.max(1, bounds.width); height = Math.max(1, bounds.height);
      const ratio = pitch ? 1 : Math.min(devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * ratio); canvas!.height = Math.round(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(pitch ? lastPitchTime : (reduced.matches && !pitch) ? 8400 : performance.now());
    }

    function draw(time: number) {
      lastPitchTime = time;
      ctx!.clearRect(0, 0, width, height);
      const mobile = width < 700;
      const cycle = (reduced.matches && !pitch) ? .64 : (time % 9000) / 9000;
      const interfaceCharge = pitch ? smooth((time - 3500) / 1600) : smooth((cycle - .48) / .2) * (1 - smooth((cycle - .78) / .14));
      const decisionCharge = pitch ? smooth((time - 5500) / 1600) : smooth((cycle - .72) / .12) * (1 - smooth((cycle - .96) / .04));
      const machineCharge = smooth(cycle / .34) * (1 - smooth((cycle - .62) / .2));
      setCharge("--ch-m", (reduced.matches && !pitch) ? .7 : machineCharge);
      setCharge("--ch-i", (reduced.matches && !pitch) ? .7 : interfaceCharge);
      setCharge("--ch-d", (reduced.matches && !pitch) ? .7 : decisionCharge);
      // Broad fields establish scale and depth without containing the machine side.
      const haze = ctx!.createRadialGradient(width * (mobile ? .5 : .38), height * .48, 20,
        width * (mobile ? .5 : .38), height * .48, width * .58);
      haze.addColorStop(0, "rgba(72,139,143,.085)"); haze.addColorStop(1, "rgba(0,43,52,0)");
      ctx!.fillStyle = haze; ctx!.fillRect(0, 0, width, height);

      drawMachineField(ctx!, width, height, geo, time, mobile, (reduced.matches && !pitch), pitch ? smooth(time / 900) : 1, false, pitch ? smooth((time - 500) / 3000) : 1);

      if (pitch) {
        field.style.setProperty("--pitch-machine", String(smooth((time - 900) / 800)));
        field.style.setProperty("--pitch-interface", String(smooth((time - 3500) / 900)));
        field.style.setProperty("--pitch-human", String(smooth((time - 5500) / 700)));
        field.style.setProperty("--pitch-conclusion", String(smooth((time - 6500) / 700)));
        ctx!.save(); ctx!.globalAlpha = smooth((time - 3500) / 900);
      }
      const bx = mobile ? width * .5 : width * geo.iface;
      const by = height * geo.mid;
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
      if (mobile) ctx!.fillRect(width * .1, by - 50, width * .8, 100); else ctx!.fillRect(bx - 50, height * geo.lineTop, 100, height * (geo.lineBot - geo.lineTop));

      // The arriving samples charge the perceptual boundary before one decision fires.
      ctx!.save();
      ctx!.shadowColor = "rgba(238,112,125,.95)";
      ctx!.shadowBlur = 7 + interfaceCharge * 22;
      ctx!.strokeStyle = `rgba(224,103,119,${.42 + interfaceCharge * .56})`;
      ctx!.lineWidth = 1.25 + interfaceCharge * 2.6;
      ctx!.beginPath();
      if (mobile) { ctx!.moveTo(width * .16, by); ctx!.lineTo(width * .84, by); }
      else { ctx!.moveTo(bx, height * geo.lineTop); ctx!.lineTo(bx, height * geo.lineBot); }
      ctx!.stroke();
      for (let dot = 0; dot < 18; dot++) {
        const spread = (hash(dot * 7.3) - .5) * (mobile ? width * .62 : height * (geo.lineBot - geo.lineTop) * .9);
        const offset = (hash(dot * 11.7) - .5) * (7 - interfaceCharge * 4);
        const x = mobile ? bx + spread : bx + offset;
        const y = mobile ? by + offset : by + spread;
        ctx!.fillStyle = `rgba(245,151,157,${interfaceCharge * (.24 + hash(dot) * .58)})`;
        ctx!.beginPath(); ctx!.arc(x, y, .7 + hash(dot * 3.1) * 1.45, 0, TAU); ctx!.fill();
      }
      ctx!.restore();

      if (pitch) { ctx!.restore(); ctx!.save(); ctx!.globalAlpha = smooth((time - 5500) / 700); }
      // Only one calm state remains legible after the constraint.
      const pulse = (reduced.matches && !pitch) ? .62 : decisionCharge;
      if (mobile) {
        ctx!.strokeStyle = "rgba(188,218,211,.25)"; ctx!.lineWidth = .7;
        ctx!.beginPath(); ctx!.moveTo(bx, by + 6); ctx!.lineTo(bx, height * geo.humanY); ctx!.stroke();
        ctx!.shadowColor = "rgba(246,131,143,.95)"; ctx!.shadowBlur = 5 + pulse * 24;
        ctx!.fillStyle = `rgba(238,132,141,${.72 + pulse * .28})`; ctx!.beginPath(); ctx!.arc(bx, height * geo.humanY, 5.2 + pulse * 2.1, 0, TAU); ctx!.fill(); ctx!.shadowBlur = 0;
      } else {
        ctx!.strokeStyle = "rgba(188,218,211,.25)"; ctx!.lineWidth = .7;
        ctx!.beginPath(); ctx!.moveTo(bx + 6, by); ctx!.lineTo(width * geo.human, by); ctx!.stroke();
        ctx!.shadowColor = "rgba(246,131,143,.95)"; ctx!.shadowBlur = 5 + pulse * 24;
        ctx!.fillStyle = `rgba(238,132,141,${.72 + pulse * .28})`; ctx!.beginPath(); ctx!.arc(width * geo.human, by, 5.2 + pulse * 2.1, 0, TAU); ctx!.fill(); ctx!.shadowBlur = 0;
      }
      if (pitch) ctx!.restore();
    }

    if (pitch) { resize(); const ro = new ResizeObserver(resize); ro.observe(canvas); const stop = runPitchTimeline(field, 98.5, t => draw(t * 1000)); return () => { stop(); ro.disconnect(); }; }

    function tick(time: number) { if (visible) draw(time); if (!(reduced.matches && !pitch)) frame = requestAnimationFrame(tick); }
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "100px" });
    const motion = () => { cancelAnimationFrame(frame); draw(8400); if (!(reduced.matches && !pitch)) frame = requestAnimationFrame(tick); };
    resize(); ro.observe(canvas); io.observe(canvas); reduced.addEventListener("change", motion);
    if (!(reduced.matches && !pitch)) frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); ro.disconnect(); io.disconnect(); reduced.removeEventListener("change", motion); };
  }, [pitch]);

  return <div className="gap-field" role="group" aria-label="Many machine information streams converge through a constrained perceptual interface into one human decision point">
    <canvas ref={ref} aria-hidden="true" />
    <p className="gap-field__machine-title">Machine capacity expands</p>
    <i className="gap-field__axis" aria-hidden="true" />
    <div className="gap-field__labels">{labels.map((label, i) => <span key={label} style={{ "--i": i } as React.CSSProperties}>{label}</span>)}</div>
    <div className="gap-field__interface"><strong>Perceptual interface</strong>{limits.map(label => <span key={label}>{label}</span>)}</div>
    <p className="gap-field__human">One human decision-maker</p>
    {children}
  </div>;
}
