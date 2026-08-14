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

    const particleExcitation = (particle: Particle, time: number) => {
      const identity = particle.seed % 1;
      if (identity < .965) return 0;
      const strengthNoise = .5 + .5 * Math.sin(particle.seed * 37.17);
      const strength = strengthNoise > .86 ? 1 : strengthNoise > .42 ? .62 : .3;
      const period = 10500 + (particle.seed * 7919) % 13500;
      const phase = ((time + particle.seed * 1837) % period) / period;
      const fadeIn = Math.min(1, phase / (.1 + strengthNoise * .08));
      const fadeOutStart = .25 + strengthNoise * .18;
      const fadeOut = phase < fadeOutStart ? 1 : Math.max(0, 1 - (phase - fadeOutStart) / (.22 + (1 - strengthNoise) * .18));
      return Math.sin(fadeIn * Math.PI * .5) * fadeOut * strength;
    };

    const drawScaffold = (time: number, structure: number, vibration: number, wave: number) => {
      if (structure <= .01) return;
      const centerX = width * .69;
      const centerY = height * .51;
      const topologyTime = time * .000045;
      const structuralNodes: Particle[] = [];
      const regions = [
        { x: .77, y: .25, rx: .3, ry: .28, phase: 0, density: .67, reach: .1 },
        { x: .63, y: .52, rx: .36, ry: .18, phase: 2.1, density: .6, reach: .12 },
        { x: .81, y: .78, rx: .28, ry: .26, phase: 4.2, density: .52, reach: .115 },
      ];

      for (let regionIndex = 0; regionIndex < regions.length; regionIndex++) {
        const region = regions[regionIndex];
        const localLife = .32 + .68 * (.5 + .5 * Math.sin(topologyTime + region.phase));
        const regionX = width * (region.x + Math.sin(topologyTime * .41 + region.phase) * .035);
        const regionY = height * (region.y + Math.cos(topologyTime * .33 + region.phase) * .035);
        const nodes = particles.filter((particle) => {
          const nx = (particle.x - regionX) / (width * region.rx);
          const ny = (particle.y - regionY) / (height * region.ry);
          const organicBoundary = nx * nx + ny * ny + Math.sin(nx * 5 + ny * 3 + region.phase) * .16;
          const selection = (particle.seed * (1.73 + regionIndex * .19)) % 1;
          return particle.x > width * .43 && organicBoundary < 1.08 && selection > region.density;
        });
        structuralNodes.push(...nodes);

        for (let index = 0; index < nodes.length; index++) {
          const node = nodes[index];
          const nodeLife = Math.max(0, Math.sin(topologyTime * .74 + node.seed * TAU + region.phase));
          if (nodeLife < .16) continue;
          const neighborLimit = node.seed % 1 > .84 ? 4 : node.seed % 1 > .58 ? 3 : node.seed % 1 > .24 ? 2 : 1;
          const neighbors = nodes
            .map((candidate, candidateIndex) => ({
              candidate,
              candidateIndex,
              distance: Math.hypot(node.x - candidate.x, node.y - candidate.y),
            }))
            .filter(({ candidateIndex }) => candidateIndex > index)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, neighborLimit);

          for (const { candidate, candidateIndex, distance } of neighbors) {
            const depth = (node.z + candidate.z) * .5;
            const reach = width * region.reach * (.68 + depth * .55);
            const edgeSeed = (node.seed + candidate.seed + regionIndex * .31) % 1;
            if (distance > reach || edgeSeed < .2) continue;
            const edgeLife = structure * localLife * nodeLife * (.45 + depth * .55);
            const midpointX = (node.x + candidate.x) * .5;
            const midpointY = (node.y + candidate.y) * .5;
            const dx = candidate.x - node.x;
            const dy = candidate.y - node.y;
            const bend = Math.sin(node.seed * 9 + candidateIndex + topologyTime) * distance * .08;
            const length = Math.max(1, distance);
            const excitation = Math.max(0, Math.sin(vibration * Math.PI - distance / width * 4));
            const nodeExcitation = particleExcitation(node, time);
            const propagatedExcitation = particleExcitation(candidate, time - 700 - edgeSeed * 1400) * .72;
            const edgeExcitation = Math.max(nodeExcitation, propagatedExcitation, excitation * (edgeSeed > .86 ? .42 : 0));
            const coralEdge = edgeExcitation > .24;
            context.strokeStyle = coralEdge
              ? `rgba(219,95,66,${edgeLife * (.27 + edgeExcitation * .3)})`
              : `rgba(86,166,181,${edgeLife * (.24 + depth * .28 + excitation * .11)})`;
            context.lineWidth = .36 + depth * .42;
            context.shadowColor = coralEdge ? `rgba(219,95,66,${edgeExcitation * .2})` : `rgba(103,180,194,${excitation * .1})`;
            context.shadowBlur = edgeExcitation > .38 || excitation > .6 ? 2.5 : 0;
            context.beginPath();
            context.moveTo(node.x, node.y);
            context.quadraticCurveTo(midpointX - dy / length * bend, midpointY + dx / length * bend, candidate.x, candidate.y);
            context.stroke();
            context.shadowBlur = 0;
          }

          const nodeAlpha = structure * localLife * nodeLife * (.12 + node.z * .3);
          const nodeExcitation = particleExcitation(node, time);
          context.fillStyle = nodeExcitation > .08
            ? `rgba(219,95,66,${Math.min(.92, nodeAlpha + nodeExcitation * .72)})`
            : `rgba(103,180,194,${nodeAlpha})`;
          context.beginPath();
          context.arc(node.x, node.y, .4 + node.z * 1.15, 0, TAU);
          context.fill();
        }
      }

      const bridgeNodes = Array.from(new Set(structuralNodes))
        .filter((node) => node.seed % 1 > .62)
        .sort((a, b) => a.x - b.x);
      for (let index = 0; index < bridgeNodes.length - 1; index++) {
        const node = bridgeNodes[index];
        const stride = node.seed % 1 > .9 ? 3 : 2;
        const candidate = bridgeNodes[index + stride];
        if (!candidate) continue;
        const distance = Math.hypot(candidate.x - node.x, candidate.y - node.y);
        if (distance < width * .14 || distance > width * .48 || (node.seed + candidate.seed) % 1 < .52) continue;
        const depth = (node.z + candidate.z) * .5;
        const life = structure * (.28 + .34 * Math.sin(topologyTime + node.seed * TAU));
        const midpointX = (node.x + candidate.x) * .5;
        const midpointY = (node.y + candidate.y) * .5 + Math.sin(node.seed * 11 + topologyTime) * distance * .055;
        const bridgeExcitation = Math.max(particleExcitation(node, time), particleExcitation(candidate, time - 1600) * .58);
        context.strokeStyle = bridgeExcitation > .22
          ? `rgba(219,95,66,${Math.max(0, life) * (.18 + bridgeExcitation * .24)})`
          : `rgba(74,143,162,${Math.max(0, life) * (.17 + depth * .2)})`;
        context.lineWidth = .32 + depth * .3;
        context.shadowColor = `rgba(103,180,194,${bridgeExcitation * .08})`;
        context.shadowBlur = bridgeExcitation > .38 ? 2 : 0;
        context.beginPath();
        context.moveTo(node.x, node.y);
        context.quadraticCurveTo(midpointX, midpointY, candidate.x, candidate.y);
        context.stroke();
        context.shadowBlur = 0;
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
        const excitation = particleExcitation(particle, staticTime) * (particle.x < calmBoundary ? .15 : 1);
        context.fillStyle = excitation > .025
          ? `rgba(219,95,66,${Math.min(.94, alpha * .75 + excitation * .86)})`
          : `rgba(103,180,194,${alpha})`;
        context.beginPath(); context.arc(particle.x, particle.y, size * (1 + excitation * .32), 0, TAU); context.fill();
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
