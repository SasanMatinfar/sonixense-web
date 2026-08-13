"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; z: number; vx: number; vy: number; seed: number; branch: number };

const TAU = Math.PI * 2;

export default function LivingSonicField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let running = true;
    let visible = true;
    let particles: Particle[] = [];

    const reset = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = coarsePointer.matches || width < 700 ? 240 : 700;
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        vx: 0,
        vy: 0,
        seed: index * 0.61803398875,
        branch: index % 3 - 1,
      }));
    };

    const drawScaffold = (time: number, structure: number, vibration: number, wave: number) => {
      if (structure <= .01) return;
      const centerX = width * .69;
      const centerY = height * .51;
      const count = coarsePointer.matches ? 18 : 30;
      const nodes = Array.from({ length: count }, (_, index) => {
        const angle = index * 2.399963 + Math.sin(index * 1.7) * .18;
        const radius = Math.sqrt((index + .6) / count);
        const nx = Math.cos(angle) * radius;
        const ny = Math.sin(angle) * radius;
        const distanceFromEvent = Math.hypot(nx + .23, ny + .08);
        const propagation = Math.sin(distanceFromEvent * 18 - vibration * TAU * 2.2) * Math.exp(-distanceFromEvent * 2.7);
        const modal = Math.sin(nx * 7 + time * .00055 + index * .19) * Math.cos(ny * 5);
        const displacement = (propagation * .8 + modal * .2) * structure * Math.sin(vibration * Math.PI);
        return {
          x: centerX + nx * width * .145 + Math.sin(ny * 4 + time * .00016) * 5 * structure,
          y: centerY + ny * height * .19 + displacement * 18,
          energy: Math.abs(displacement),
          seed: (index * .61803398875) % 1,
        };
      });

      context.lineWidth = .5;
      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        const neighbors = nodes.map((candidate, candidateIndex) => ({ candidate, candidateIndex, distance: Math.hypot(node.x - candidate.x, node.y - candidate.y) })).filter(({ candidateIndex }) => candidateIndex > index).sort((a, b) => a.distance - b.distance).slice(0, 2);
        for (const neighbor of neighbors) {
          if (neighbor.distance > width * .09 || (index + neighbor.candidateIndex) % 5 === 0) continue;
          context.strokeStyle = `rgba(74,143,162,${(.055 + node.energy * .2) * structure})`;
          context.beginPath(); context.moveTo(node.x, node.y); context.lineTo(neighbor.candidate.x, neighbor.candidate.y); context.stroke();
        }
        context.fillStyle = node.energy > .2 ? `rgba(242,211,197,${(.18 + node.energy * .35) * structure})` : `rgba(103,180,194,${.22 * structure})`;
        context.beginPath(); context.arc(node.x, node.y, .65 + node.seed * .85, 0, TAU); context.fill();
      }

      const eventX = centerX - width * .055;
      const eventY = centerY - height * .025;
      const eventStrength = Math.sin(Math.min(1, vibration) * Math.PI);
      context.fillStyle = `rgba(219,95,66,${eventStrength * .78})`;
      context.beginPath(); context.arc(eventX, eventY, 2.1 + eventStrength * 1.6, 0, TAU); context.fill();

      if (wave > 0 && wave < 1) {
        const packetStart = centerX + width * .045;
        const packetLength = width * .25;
        for (let index = 0; index < 34; index++) {
          const progress = index / 33;
          const envelope = Math.sin(progress * Math.PI) * Math.sin(wave * Math.PI);
          const travel = wave * width * .12;
          const x = packetStart + progress * packetLength + travel;
          const y = centerY + Math.sin(progress * TAU * 3.2 - wave * TAU * 1.4) * 18 * envelope;
          const coral = index % 9 === 0;
          context.fillStyle = coral ? `rgba(219,95,66,${envelope * .48})` : `rgba(103,180,194,${envelope * .38})`;
          context.beginPath(); context.arc(x, y, coral ? 1.6 : 1, 0, TAU); context.fill();
        }
      }
    };

    const render = (time: number) => {
      if (!running) return;
      if (!visible) { frame = requestAnimationFrame(render); return; }
      const staticTime = reduceMotion.matches ? 6800 : time;
      const cycle = (staticTime % 14000) / 14000;
      const structure = reduceMotion.matches ? .7 : Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (cycle - .18) / .62))));
      const vibration = reduceMotion.matches ? .52 : Math.min(1, Math.max(0, (cycle - .4) / .3));
      const wave = reduceMotion.matches ? .56 : Math.min(1, Math.max(0, (cycle - .53) / .31));

      context.clearRect(0, 0, width, height);
      const calmBoundary = width * .46;
      for (const particle of particles) {
        particle.z = (particle.z + (reduceMotion.matches ? 0 : .00016 + particle.seed % 1 * .00012)) % 1;
        const depthSpeed = .08 + particle.z * .42;
        const normalizedX = particle.x / width;
        const corridorCenter = height * (.5 + Math.sin(normalizedX * 5.4 + staticTime * .00008) * .16 + particle.branch * (.045 + .08 * Math.sin(normalizedX * Math.PI)));
        const corridorPull = particle.x > calmBoundary ? (corridorCenter - particle.y) * (.00022 + particle.z * .00034) : 0;
        const angle = Math.sin(particle.y * .006 + staticTime * .0001 + particle.seed) * .75 + Math.cos(particle.x * .003 - staticTime * .00007) * .38;
        const flowX = Math.cos(angle) * depthSpeed;
        const flowY = Math.sin(angle) * depthSpeed + corridorPull;
        let forceX = 0;
        let forceY = 0;
        if (pointer.active && !reduceMotion.matches) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.max(30, Math.hypot(dx, dy));
          if (distance < 150) { const force = (1 - distance / 150) * .055; forceX += dx / distance * force; forceY += dy / distance * force; }
        }
        const targetX = width * .69 + Math.cos(particle.seed * TAU) * width * .13;
        const targetY = height * .51 + Math.sin(particle.seed * TAU * 1.7) * height * .17;
        const assemble = structure * (particle.seed % 1 > .72 ? .008 : .0012);
        particle.vx = particle.vx * .94 + flowX * .06 + (targetX - particle.x) * assemble * .012 + forceX;
        particle.vy = particle.vy * .94 + flowY * .06 + (targetY - particle.y) * assemble * .012 + forceY;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const textCalm = particle.x < calmBoundary ? .13 : 1;
        const alpha = (.035 + particle.z * .3) * textCalm;
        const size = .28 + particle.z * particle.z * 1.55;
        context.fillStyle = particle.seed % 1 > .94 ? `rgba(219,95,66,${alpha * 1.6})` : `rgba(103,180,194,${alpha})`;
        context.beginPath(); context.arc(particle.x, particle.y, size, 0, TAU); context.fill();
        if (particle.z > .75 && particle.seed % 1 > .68) {
          context.strokeStyle = `rgba(74,143,162,${alpha * .35})`;
          context.lineWidth = .45;
          context.beginPath(); context.moveTo(particle.x, particle.y); context.lineTo(particle.x - particle.vx * 14, particle.y - particle.vy * 14); context.stroke();
        }
      }
      drawScaffold(staticTime, structure, vibration, wave);
      if (!reduceMotion.matches) frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event: PointerEvent) => { const bounds = canvas.getBoundingClientRect(); pointer.x = event.clientX - bounds.left; pointer.y = event.clientY - bounds.top; pointer.active = true; };
    const onPointerLeave = () => { pointer.active = false; };
    const resize = new ResizeObserver(() => { reset(); cancelAnimationFrame(frame); render(performance.now()); });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "100px" });
    const onMotionChange = () => { cancelAnimationFrame(frame); render(performance.now()); };

    reset();
    resize.observe(canvas);
    intersection.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    reduceMotion.addEventListener("change", onMotionChange);
    render(performance.now());

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      resize.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      reduceMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="living-sonic-field" aria-hidden="true" />;
}
