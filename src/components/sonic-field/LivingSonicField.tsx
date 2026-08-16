"use client";

import { useEffect, useRef } from "react";

type Particle = { x: number; y: number; z: number; vx: number; vy: number; seed: number; branch: number };
type Ripple = { x: number; y: number; startedAt: number; duration: number; radius: number; harmonics: number; tilt: number; rotation: number; seed: number; coral: boolean; complexity: number; frequency: number; directionality: number };

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
    let ripples: Ripple[] = [];
    const regionWasComplex = [false, false, false];
    const regionCooldownUntil = [0, 0, 0];
    let deformationStartedAt = -Infinity;
    let deformationCooldownUntil = 0;
    const deformationDuration = 10500;

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

    const deformationEnvelope = (time: number) => {
      if (reduceMotion.matches) return 0;
      const age = (time - deformationStartedAt) / deformationDuration;
      if (age <= 0 || age >= 1) return 0;
      const rise = Math.sin(Math.min(1, age / .28) * Math.PI * .5);
      const fall = Math.sin(Math.min(1, (1 - age) / .34) * Math.PI * .5);
      return rise * fall;
    };

    const deformationAt = (x: number, y: number, time: number) => {
      const envelope = deformationEnvelope(time);
      if (envelope === 0) return 0;
      const nx = x / width;
      const ny = y / height;
      const elapsed = (time - deformationStartedAt) * .0001;
      const warpedPhase = nx * 4.1 + ny * 1.7 + Math.sin(ny * 4.3 - elapsed * .32) * .72 - elapsed;
      const broad = Math.sin(warpedPhase) * (.62 + Math.sin(ny * 2.7 + elapsed * .21) * .18);
      const regional = Math.sin(nx * 7.2 - ny * 5.1 + elapsed * .63) * .24;
      const local = Math.sin(nx * 13.7 + ny * 9.4 - elapsed * .41) * .09;
      return (broad + regional + local) * envelope;
    };

    const deformedPoint = (x: number, y: number, z: number, time: number) => {
      const displacement = deformationAt(x, y, time);
      const gradientX = deformationAt(x + 9, y, time) - displacement;
      const gradientY = deformationAt(x, y + 9, time) - displacement;
      const projection = 1 + displacement * (.017 + z * .018);
      return {
        x: width * .5 + (x - width * .5) * projection + gradientX * 22,
        y: height * .5 + (y - height * .5) * projection + displacement * 2.2 + gradientY * 18,
        z: Math.max(0, Math.min(1, z + displacement * .14)),
        displacement,
      };
    };

    const drawRipples = (time: number) => {
      ripples = ripples.filter((ripple) => time - ripple.startedAt < ripple.duration);
      for (const ripple of ripples) {
        const age = (time - ripple.startedAt) / ripple.duration;
        const attack = Math.sin(Math.min(1, age / .18) * Math.PI * .5);
        const decay = Math.pow(1 - age, 1.35);
        const envelope = attack * decay;
        const travel = (1 - Math.pow(1 - age, 2.1)) * ripple.radius * (.58 + ripple.directionality * .32);
        const packetLength = ripple.radius * (.5 + ripple.complexity * .25);
        const amplitude = ripple.radius * (.035 + (1 - ripple.frequency / 5) * .035);
        const deformedOrigin = deformedPoint(ripple.x, ripple.y, ripple.tilt, time);
        context.save();
        context.translate(deformedOrigin.x, deformedOrigin.y);
        context.rotate(ripple.rotation);
        context.scale(1 + deformedOrigin.displacement * .025, (.72 + ripple.tilt * .18) * (1 + deformedOrigin.displacement * .035));

        for (let harmonic = 0; harmonic < ripple.harmonics; harmonic++) {
          const harmonicStrength = 1 - harmonic / (ripple.harmonics + .5);
          const strandOffset = (harmonic - (ripple.harmonics - 1) * .5) * amplitude * .9;
          const samples = coarsePointer.matches ? 36 : 58;
          let previous: { x: number; y: number } | null = null;
          for (let sample = 0; sample <= samples; sample++) {
            const u = sample / samples - .5;
            const packetEnvelope = Math.pow(Math.max(0, Math.cos(u * Math.PI)), 1.35);
            const localPhase = u * TAU * (ripple.frequency + harmonic * .42) - age * TAU * (1.25 + harmonic * .18) + ripple.seed * 9;
            const turbulence = Math.sin(u * 13 + ripple.seed * 17 + harmonic) * amplitude * .08;
            const curve = Math.sin(u * Math.PI + ripple.seed * 4) * packetLength * .055 * ripple.directionality;
            const x = travel + u * packetLength;
            const y = strandOffset + curve + Math.sin(localPhase) * amplitude * packetEnvelope * harmonicStrength + turbulence;
            const visibility = packetEnvelope * envelope * harmonicStrength * (.55 + .45 * Math.sin(sample * 1.7 + harmonic * 2.4 + ripple.seed * 13));
            if (previous && visibility > .075) {
              const coralAccent = ripple.coral && harmonic === 0 && sample % 9 === 0;
              context.strokeStyle = coralAccent
                ? `rgba(219,95,66,${visibility * .4})`
                : `rgba(103,180,194,${visibility * (.23 + ripple.complexity * .13)})`;
              context.lineWidth = .38 + harmonicStrength * .26;
              context.shadowColor = `rgba(103,180,194,${visibility * .1})`;
              context.shadowBlur = harmonic === 0 ? 1.8 : 0;
              context.beginPath();
              context.moveTo(previous.x, previous.y);
              context.lineTo(x, y);
              context.stroke();
            }
            if (sample % (harmonic + 3) === 0 && visibility > .13) {
              context.fillStyle = ripple.coral && harmonic === 0 && sample % 11 === 0
                ? `rgba(219,95,66,${visibility * .62})`
                : `rgba(103,180,194,${visibility * .76})`;
              context.beginPath();
              context.arc(x, y, .32 + ripple.complexity * .42 * harmonicStrength, 0, TAU);
              context.fill();
            }
            previous = { x, y };
          }
        }

        const farFieldSamples = coarsePointer.matches ? 28 : 44;
        for (let sample = 0; sample < farFieldSamples; sample++) {
          const u = sample / (farFieldSamples - 1) - .5;
          const diffuseEnvelope = Math.max(0, Math.cos(u * Math.PI)) * envelope;
          const x = travel * 1.12 + u * packetLength * 1.35;
          const y = Math.sin(u * TAU * (1.2 + ripple.frequency * .16) - age * TAU) * amplitude * 1.45 + Math.sin(u * 5 + ripple.seed) * amplitude * .35;
          if (diffuseEnvelope < .08 || (sample + Math.floor(ripple.seed * 10)) % 3 === 0) continue;
          context.fillStyle = `rgba(103,180,194,${diffuseEnvelope * .1})`;
          context.beginPath();
          context.arc(x, y, .45 + ripple.complexity * .3, 0, TAU);
          context.fill();
        }

        context.strokeStyle = `rgba(103,180,194,${envelope * .035})`;
        context.lineWidth = 1.4 + ripple.complexity;
        context.shadowColor = `rgba(103,180,194,${envelope * .025})`;
        context.shadowBlur = 5;
        context.beginPath();
        context.moveTo(-packetLength * .18, 0);
        context.bezierCurveTo(travel * .2, -amplitude * 2.1, travel * .72, amplitude * 2.3, travel + packetLength * .35, 0);
        context.stroke();
        context.restore();
      }
      context.shadowBlur = 0;
    };

    const drawScaffold = (time: number, structure: number, vibration: number, wave: number) => {
      if (structure <= .01) return;
      const centerX = width * .69;
      const centerY = height * .51;
      const topologyTime = time * .000045;
      const structuralNodes: Particle[] = [];
      let complexRegionCount = 0;
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
        let edgeCount = 0;
        const nodeDegrees = new Array(nodes.length).fill(0) as number[];

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
            edgeCount++;
            nodeDegrees[index]++;
            nodeDegrees[candidateIndex]++;
            const nodePoint = deformedPoint(node.x, node.y, node.z, time);
            const candidatePoint = deformedPoint(candidate.x, candidate.y, candidate.z, time);
            const edgeLife = structure * localLife * nodeLife * (.45 + depth * .55);
            const midpointX = (nodePoint.x + candidatePoint.x) * .5;
            const midpointY = (nodePoint.y + candidatePoint.y) * .5;
            const dx = candidatePoint.x - nodePoint.x;
            const dy = candidatePoint.y - nodePoint.y;
            const bend = Math.sin(node.seed * 9 + candidateIndex + topologyTime) * distance * .08;
            const length = Math.max(1, distance);
            const excitation = Math.max(0, Math.sin(vibration * Math.PI - distance / width * 4));
            const nodeExcitation = particleExcitation(node, time);
            const propagatedExcitation = particleExcitation(candidate, time - 700 - edgeSeed * 1400) * .72;
            const edgeExcitation = Math.max(nodeExcitation, propagatedExcitation, excitation * (edgeSeed > .86 ? .42 : 0));
            const coralEdge = edgeExcitation > .24;
            const deformationVisibility = .92 + (nodePoint.displacement + candidatePoint.displacement) * .075;
            context.strokeStyle = coralEdge
              ? `rgba(219,95,66,${edgeLife * (.27 + edgeExcitation * .3) * deformationVisibility})`
              : `rgba(86,166,181,${edgeLife * (.24 + depth * .28 + excitation * .11) * deformationVisibility})`;
            context.lineWidth = .36 + (nodePoint.z + candidatePoint.z) * .21;
            context.shadowColor = coralEdge ? `rgba(219,95,66,${edgeExcitation * .2})` : `rgba(103,180,194,${excitation * .1})`;
            context.shadowBlur = edgeExcitation > .38 || excitation > .6 ? 2.5 : 0;
            context.beginPath();
            context.moveTo(nodePoint.x, nodePoint.y);
            context.quadraticCurveTo(midpointX - dy / length * bend, midpointY + dx / length * bend, candidatePoint.x, candidatePoint.y);
            context.stroke();
            context.shadowBlur = 0;
          }

          const nodeAlpha = structure * localLife * nodeLife * (.12 + node.z * .3);
          const nodeExcitation = particleExcitation(node, time);
          const nodePoint = deformedPoint(node.x, node.y, node.z, time);
          context.fillStyle = nodeExcitation > .08
            ? `rgba(219,95,66,${Math.min(.92, (nodeAlpha + nodeExcitation * .72) * (1 + nodePoint.displacement * .08))})`
            : `rgba(103,180,194,${nodeAlpha * (1 + nodePoint.displacement * .08)})`;
          context.beginPath();
          context.arc(nodePoint.x, nodePoint.y, .4 + nodePoint.z * 1.15, 0, TAU);
          context.fill();
        }

        if (!reduceMotion.matches && nodes.length > 0) {
          const xs = nodes.map((node) => node.x);
          const ys = nodes.map((node) => node.y);
          const extent = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / Math.hypot(width, height);
          const maxDegree = Math.max(0, ...nodeDegrees);
          const coherence = structure * localLife;
          const complexity = (nodes.length * .58 + edgeCount * 1.25 + maxDegree * 2.8 + extent * 18) * coherence + vibration * 7;
          const soundTriggerThreshold = coarsePointer.matches ? 24 : 46;
          const isComplex = complexity > soundTriggerThreshold && edgeCount >= (coarsePointer.matches ? 8 : 17) && maxDegree >= 3;
          if (isComplex) complexRegionCount++;

          if (isComplex && !regionWasComplex[regionIndex] && time >= regionCooldownUntil[regionIndex] && ripples.length < 3) {
            const originIndex = nodeDegrees.reduce((best, degree, index) => degree > nodeDegrees[best] ? index : best, 0);
            const origin = nodes[originIndex];
            const variation = .5 + .5 * Math.sin(origin.seed * 23.7 + time * .00017);
            const originExcitation = particleExcitation(origin, time);
            const structuralMagnitude = nodes.length * .45 + edgeCount * .75 + maxDegree * 2 + extent * 12;
            const complexityNormalized = Math.max(0, Math.min(1, structuralMagnitude / (coarsePointer.matches ? 58 : 112)));
            const centroidX = nodes.reduce((sum, node) => sum + node.x, 0) / nodes.length;
            const centroidY = nodes.reduce((sum, node) => sum + node.y, 0) / nodes.length;
            const covarianceX = nodes.reduce((sum, node) => sum + (node.x - centroidX) ** 2, 0) / nodes.length;
            const covarianceY = nodes.reduce((sum, node) => sum + (node.y - centroidY) ** 2, 0) / nodes.length;
            const covarianceXY = nodes.reduce((sum, node) => sum + (node.x - centroidX) * (node.y - centroidY), 0) / nodes.length;
            const orientation = .5 * Math.atan2(2 * covarianceXY, covarianceX - covarianceY);
            const anisotropy = Math.min(1, Math.abs(covarianceX - covarianceY) / Math.max(1, covarianceX + covarianceY));
            const connectivityDensity = edgeCount / Math.max(1, nodes.length);
            ripples.push({
              x: origin.x,
              y: origin.y,
              startedAt: time,
              duration: 3300 + complexityNormalized * 3500 + variation * 350,
              radius: width * (.09 + complexityNormalized * .27 + extent * .08) * (.96 + variation * .08),
              harmonics: 2 + Math.round(complexityNormalized * 3 + Math.min(1, connectivityDensity / 2)),
              tilt: .64 + origin.z * .28,
              rotation: orientation + (origin.seed % 1 > .5 ? 0 : Math.PI),
              seed: origin.seed,
              coral: originExcitation > .52 || complexity > soundTriggerThreshold * 1.42,
              complexity: complexityNormalized,
              frequency: 1.6 + Math.min(2.7, connectivityDensity * .9 + (1 - extent) * 1.35),
              directionality: .45 + anisotropy * .55,
            });
            regionCooldownUntil[regionIndex] = time + 11000 + variation * 5000;
          }
          regionWasComplex[regionIndex] = isComplex;
        } else {
          regionWasComplex[regionIndex] = false;
        }
      }

      if (!reduceMotion.matches && complexRegionCount >= 2 && time >= deformationCooldownUntil) {
        deformationStartedAt = time;
        deformationCooldownUntil = time + deformationDuration + 22000;
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
        const nodePoint = deformedPoint(node.x, node.y, node.z, time);
        const candidatePoint = deformedPoint(candidate.x, candidate.y, candidate.z, time);
        const depth = (node.z + candidate.z) * .5;
        const life = structure * (.28 + .34 * Math.sin(topologyTime + node.seed * TAU));
        const midpointX = (nodePoint.x + candidatePoint.x) * .5;
        const midpointY = (nodePoint.y + candidatePoint.y) * .5 + Math.sin(node.seed * 11 + topologyTime) * distance * .055;
        const bridgeExcitation = Math.max(particleExcitation(node, time), particleExcitation(candidate, time - 1600) * .58);
        context.strokeStyle = bridgeExcitation > .22
          ? `rgba(219,95,66,${Math.max(0, life) * (.18 + bridgeExcitation * .24)})`
          : `rgba(74,143,162,${Math.max(0, life) * (.17 + depth * .2)})`;
        context.lineWidth = .32 + depth * .3;
        context.shadowColor = `rgba(103,180,194,${bridgeExcitation * .08})`;
        context.shadowBlur = bridgeExcitation > .38 ? 2 : 0;
        context.beginPath();
        context.moveTo(nodePoint.x, nodePoint.y);
        context.quadraticCurveTo(midpointX, midpointY, candidatePoint.x, candidatePoint.y);
        context.stroke();
        context.shadowBlur = 0;
      }

      const eventX = centerX - width * .055;
      const eventY = centerY - height * .025;
      const eventStrength = Math.sin(Math.min(1, vibration) * Math.PI);
      const eventPoint = deformedPoint(eventX, eventY, .78, time);
      context.fillStyle = `rgba(219,95,66,${eventStrength * .78})`;
      context.beginPath(); context.arc(eventPoint.x, eventPoint.y, (2.1 + eventStrength * 1.6) * (1 + eventPoint.displacement * .04), 0, TAU); context.fill();

      if (wave > 0 && wave < 1) {
        const packetStart = centerX + width * .045;
        const packetLength = width * .25;
        for (let index = 0; index < 34; index++) {
          const progress = index / 33;
          const envelope = Math.sin(progress * Math.PI) * Math.sin(wave * Math.PI);
          const travel = wave * width * .12;
          const x = packetStart + progress * packetLength + travel;
          const y = centerY + Math.sin(progress * TAU * 3.2 - wave * TAU * 1.4) * 18 * envelope;
          const packetPoint = deformedPoint(x, y, .65 + progress * .18, time);
          const coral = index % 9 === 0;
          context.fillStyle = coral ? `rgba(219,95,66,${envelope * .48})` : `rgba(103,180,194,${envelope * .38})`;
          context.beginPath(); context.arc(packetPoint.x, packetPoint.y, (coral ? 1.6 : 1) * (1 + packetPoint.displacement * .04), 0, TAU); context.fill();
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
        const displayPoint = deformedPoint(particle.x, particle.y, particle.z, staticTime);
        const alpha = (.035 + displayPoint.z * .3) * textCalm * (1 + displayPoint.displacement * .09);
        const size = .28 + displayPoint.z * displayPoint.z * 1.55;
        const excitation = particleExcitation(particle, staticTime) * (particle.x < calmBoundary ? .15 : 1);
        context.fillStyle = excitation > .025
          ? `rgba(219,95,66,${Math.min(.94, alpha * .75 + excitation * .86)})`
          : `rgba(103,180,194,${alpha})`;
        context.beginPath(); context.arc(displayPoint.x, displayPoint.y, size * (1 + excitation * .32), 0, TAU); context.fill();
        if (particle.z > .75 && particle.seed % 1 > .68) {
          const trailPoint = deformedPoint(particle.x - particle.vx * 14, particle.y - particle.vy * 14, particle.z, staticTime);
          context.strokeStyle = `rgba(74,143,162,${alpha * .35})`;
          context.lineWidth = .45;
          context.beginPath(); context.moveTo(displayPoint.x, displayPoint.y); context.lineTo(trailPoint.x, trailPoint.y); context.stroke();
        }
      }
      drawRipples(staticTime);
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
