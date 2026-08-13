"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; z: number; vx: number; vy: number; seed: number };

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
      }));
    };

    const drawMembrane = (time: number, emergence: number, pulse: number) => {
      const centerX = width * .69;
      const centerY = height * .5;
      const columns = coarsePointer.matches ? 9 : 14;
      const rows = coarsePointer.matches ? 6 : 9;
      const spanX = width * .34;
      const spanY = height * .42;
      const nodes: { x: number; y: number; energy: number }[][] = [];

      for (let row = 0; row < rows; row++) {
        const line = [];
        for (let column = 0; column < columns; column++) {
          const nx = column / (columns - 1) - .5;
          const ny = row / (rows - 1) - .5;
          const radius = Math.hypot(nx * 1.25, ny);
          const propagation = Math.sin(radius * 20 - pulse * TAU * 2.1) * Math.exp(-radius * 2.6);
          const mode = Math.sin(nx * Math.PI * 3 + time * .00045) * Math.cos(ny * Math.PI * 2);
          const energy = (propagation * .72 + mode * .28) * emergence;
          line.push({
            x: centerX + nx * spanX + Math.sin(ny * 5 + time * .00025) * 12 * emergence,
            y: centerY + ny * spanY + energy * 22 + Math.sin(nx * 4) * 9,
            energy,
          });
        }
        nodes.push(line);
      }

      context.lineWidth = .65;
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const node = nodes[row][column];
          context.strokeStyle = `rgba(74, 143, 162, ${(.08 + Math.abs(node.energy) * .24) * emergence})`;
          context.beginPath();
          if (column < columns - 1) { context.moveTo(node.x, node.y); context.lineTo(nodes[row][column + 1].x, nodes[row][column + 1].y); }
          if (row < rows - 1) { context.moveTo(node.x, node.y); context.lineTo(nodes[row + 1][column].x, nodes[row + 1][column].y); }
          if (row < rows - 1 && column < columns - 1 && (row + column) % 2 === 0) { context.moveTo(node.x, node.y); context.lineTo(nodes[row + 1][column + 1].x, nodes[row + 1][column + 1].y); }
          context.stroke();
          if (Math.abs(node.energy) > .28) {
            context.fillStyle = `rgba(242, 211, 197, ${Math.min(.55, Math.abs(node.energy)) * emergence})`;
            context.beginPath(); context.arc(node.x, node.y, 1.1 + Math.abs(node.energy), 0, TAU); context.fill();
          }
        }
      }

      const eventX = centerX - spanX * .18;
      const eventY = centerY - spanY * .05;
      context.fillStyle = `rgba(219, 95, 66, ${.45 + pulse * .45})`;
      context.beginPath(); context.arc(eventX, eventY, 2.8 + pulse * 2.2, 0, TAU); context.fill();
      for (let ring = 0; ring < 3; ring++) {
        const progress = (pulse + ring / 3) % 1;
        context.strokeStyle = `rgba(219, 95, 66, ${(1 - progress) * .22 * emergence})`;
        context.lineWidth = .8;
        context.beginPath(); context.ellipse(eventX, eventY, progress * spanX * .44, progress * spanY * .54, -.18, 0, TAU); context.stroke();
      }
    };

    const render = (time: number) => {
      if (!running) return;
      if (!visible) { frame = requestAnimationFrame(render); return; }
      const staticTime = reduceMotion.matches ? 6800 : time;
      const cycle = (staticTime % 14000) / 14000;
      const emergence = reduceMotion.matches ? .82 : Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (cycle - .12) / .78))));
      const pulse = reduceMotion.matches ? .55 : ((cycle - .38 + 1) % 1);

      context.clearRect(0, 0, width, height);
      const calmBoundary = width * .46;
      for (const particle of particles) {
        const depthSpeed = .12 + particle.z * .34;
        const angle = Math.sin(particle.y * .008 + staticTime * .00013 + particle.seed) * 1.15 + Math.cos(particle.x * .004 - staticTime * .00009) * .62;
        const flowX = Math.cos(angle) * depthSpeed;
        const flowY = Math.sin(angle) * depthSpeed;
        let forceX = 0;
        let forceY = 0;
        if (pointer.active && !reduceMotion.matches) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.max(30, Math.hypot(dx, dy));
          if (distance < 150) { const force = (1 - distance / 150) * .055; forceX += dx / distance * force; forceY += dy / distance * force; }
        }
        const targetX = width * .68 + Math.cos(particle.seed * TAU) * width * .18;
        const targetY = height * .5 + Math.sin(particle.seed * TAU * 1.7) * height * .22;
        const assemble = emergence * (particle.seed % 1 > .32 ? .012 : .004);
        particle.vx = particle.vx * .94 + flowX * .06 + (targetX - particle.x) * assemble * .012 + forceX;
        particle.vy = particle.vy * .94 + flowY * .06 + (targetY - particle.y) * assemble * .012 + forceY;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const textCalm = particle.x < calmBoundary ? .13 : 1;
        const alpha = (.05 + particle.z * .28) * textCalm;
        const size = .35 + particle.z * 1.25;
        context.fillStyle = particle.seed % 1 > .94 ? `rgba(219,95,66,${alpha * 1.6})` : `rgba(103,180,194,${alpha})`;
        context.beginPath(); context.arc(particle.x, particle.y, size, 0, TAU); context.fill();
        if (particle.z > .75 && particle.seed % 1 > .68) {
          context.strokeStyle = `rgba(74,143,162,${alpha * .35})`;
          context.lineWidth = .45;
          context.beginPath(); context.moveTo(particle.x, particle.y); context.lineTo(particle.x - particle.vx * 14, particle.y - particle.vy * 14); context.stroke();
        }
      }
      drawMembrane(staticTime, emergence, pulse);
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
