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
      const count = coarsePointer.matches || width < 700 ? 110 : 280;
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
                ? `rgba(187,92,118,${visibility * .4})`
                : `rgba(166,90,117,${visibility * (.23 + ripple.complexity * .13)})`;
              context.lineWidth = .38 + harmonicStrength * .26;
              context.shadowColor = `rgba(166,90,117,${visibility * .1})`;
              context.shadowBlur = harmonic === 0 ? 1.8 : 0;
              context.beginPath();
              context.moveTo(previous.x, previous.y);
              context.lineTo(x, y);
              context.stroke();
            }
            if (sample % (harmonic + 3) === 0 && visibility > .13) {
              context.fillStyle = ripple.coral && harmonic === 0 && sample % 11 === 0
                ? `rgba(187,92,118,${visibility * .62})`
                : `rgba(166,90,117,${visibility * .76})`;
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
          context.fillStyle = `rgba(166,90,117,${diffuseEnvelope * .1})`;
          context.beginPath();
          context.arc(x, y, .45 + ripple.complexity * .3, 0, TAU);
          context.fill();
        }

        context.strokeStyle = `rgba(166,90,117,${envelope * .035})`;
        context.lineWidth = 1.4 + ripple.complexity;
        context.shadowColor = `rgba(166,90,117,${envelope * .025})`;
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
              ? `rgba(187,92,118,${edgeLife * (.27 + edgeExcitation * .3) * deformationVisibility})`
              : `rgba(166,90,117,${edgeLife * (.24 + depth * .28 + excitation * .11) * deformationVisibility})`;
            context.lineWidth = .36 + (nodePoint.z + candidatePoint.z) * .21;
            context.shadowColor = coralEdge ? `rgba(187,92,118,${edgeExcitation * .2})` : `rgba(166,90,117,${excitation * .1})`;
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
            ? `rgba(187,92,118,${Math.min(.92, (nodeAlpha + nodeExcitation * .72) * (1 + nodePoint.displacement * .08))})`
            : `rgba(166,90,117,${nodeAlpha * (1 + nodePoint.displacement * .08)})`;
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
          ? `rgba(187,92,118,${Math.max(0, life) * (.18 + bridgeExcitation * .24)})`
          : `rgba(116,77,111,${Math.max(0, life) * (.17 + depth * .2)})`;
        context.lineWidth = .32 + depth * .3;
        context.shadowColor = `rgba(166,90,117,${bridgeExcitation * .08})`;
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
      context.fillStyle = `rgba(187,92,118,${eventStrength * .78})`;
      context.beginPath(); context.arc(eventPoint.x, eventPoint.y, (2.1 + eventStrength * 1.6) * (1 + eventPoint.displacement * .04), 0, TAU); context.fill();

      if (wave > 0 && wave < 1) {
        const packetStart = centerX + width * .045;
        const packetLength = width * .25;
        const eventIndex = Math.floor(time / 14000);
        const eventSeed = Math.abs(Math.sin((eventIndex + 1) * 12.9898) * 43758.5453) % 1;
        const family = Math.min(5, Math.floor(eventSeed * 6));
        const fundamental = 1.8 + eventSeed * 1.05;
        const baseAmplitude = 28 + eventSeed * 14;
        const morph = Math.sin(wave * Math.PI);
        const complexityMorph = Math.pow(Math.sin(Math.min(1, wave / .72) * Math.PI), .55);
        const strandCount = eventSeed > .32 ? 3 : 2;

        for (let strand = 0; strand < strandCount; strand++) {
          const count = strand === 0 ? 68 : 46;
          const strandStrength = strand === 0 ? 1 : .34 - strand * .055;
          let previousPoint: ReturnType<typeof deformedPoint> | null = null;
          for (let index = 0; index < count; index++) {
            const progress = index / (count - 1);
            const swell = Math.pow(Math.sin(progress * Math.PI), .72);
            const doubleSwell = Math.pow(Math.sin(progress * Math.PI), .7) * (.48 + .52 * Math.pow(Math.sin(progress * TAU * 1.25 + eventSeed), 2));
            const attackDecay = (1 - Math.exp(-progress * 15)) * Math.exp(-progress * (1.1 + eventSeed));
            const clusterEnvelope = Math.min(1,
              Math.exp(-Math.pow((progress - .24) / .16, 2)) * .72
              + Math.exp(-Math.pow((progress - .58) / .2, 2))
              + Math.exp(-Math.pow((progress - .82) / .11, 2)) * .55
            );
            const asymmetricSwell = Math.pow(Math.sin(progress * Math.PI), .9) * (.55 + progress * .7);
            const pulsedEnvelope = swell * (.55 + .45 * Math.pow(Math.sin(progress * TAU * 2.15 + eventSeed * 3), 2));
            const envelopes = [swell, doubleSwell, attackDecay, asymmetricSwell, clusterEnvelope, pulsedEnvelope];
            const amplitudeEnvelope = envelopes[family] * (.92 + .08 * Math.sin(progress * TAU * 3 + wave * 2));

            const modulation = Math.sin(progress * TAU * (1.15 + eventSeed * .55) + eventSeed * 4) * (.22 + eventSeed * .18);
            const sweep = (progress - .5) ** 3 * (1.1 + eventSeed * 1.3);
            const phase = TAU * (fundamental * progress + modulation + sweep) - wave * TAU * (1.12 + eventSeed * .4);
            const detailCenter = .3 + eventSeed * .38;
            const detailWindow = Math.exp(-Math.pow((progress - detailCenter) / (.13 + eventSeed * .08), 2));
            const tailWindow = Math.exp(-Math.pow((progress - (.72 + eventSeed * .08)) / .16, 2));
            const weight17 = (.38 + detailWindow * .46) * complexityMorph;
            const weight23 = (.23 + detailWindow * .4 + tailWindow * .18) * complexityMorph;
            const weight38 = (.1 + detailWindow * .3) * complexityMorph;
            const beating = Math.sin(phase * 2.72 + eventSeed * 5) * Math.sin(progress * TAU * (.62 + eventSeed * .35)) * (.13 + detailWindow * .23) * complexityMorph;
            const transientCenter = .38 + eventSeed * .34;
            const transientWindow = Math.exp(-Math.pow((progress - transientCenter) / (.055 + eventSeed * .035), 2));
            const transient = Math.sin(phase * (4.45 + eventSeed * .8) + 1.7) * transientWindow * (.34 + eventSeed * .28) * complexityMorph;
            const composite = Math.sin(phase)
              + Math.sin(phase * 1.71 + eventSeed * 2.7) * weight17
              + Math.sin(phase * 2.33 - eventSeed * 4.1) * weight23
              + Math.sin(phase * 3.81 + eventSeed * 6.2) * weight38
              + beating
              + transient;
            const saturated = Math.tanh(composite * (1.02 + complexityMorph * .24));
            const asymmetric = saturated >= 0
              ? saturated * (1.08 + eventSeed * .22)
              : saturated * (.68 + (1 - eventSeed) * .18);
            const strandPhase = strand === 0 ? 0 : strand * .72 + eventSeed;
            const strandDetail = strand === 0
              ? 0
              : Math.sin(phase * (1.43 + strand * .37) + strandPhase) * (.24 + detailWindow * .22);
            const signal = asymmetric + strandDetail;
            const travel = wave * width * (.1 + eventSeed * .035);
            const x = packetStart + progress * packetLength + travel;
            const offset = strand === 0 ? 0 : (strand === 1 ? -1 : 1) * (7 + eventSeed * 5);
            const y = centerY + offset + signal * baseAmplitude * amplitudeEnvelope * morph * strandStrength;
            const packetPoint = deformedPoint(x, y, .62 + progress * .2 - strand * .06, time);
            const fragment = Math.sin(index * 1.73 + strand * 2.2 + eventSeed * 11);
            const visible = fragment > (strand === 0 ? -.72 : -.18);

            if (visible) {
              const coral = strand === 0 && index % 13 === 0;
              const opacity = morph * amplitudeEnvelope * strandStrength;
              context.fillStyle = coral ? `rgba(187,92,118,${opacity * .5})` : `rgba(166,90,117,${opacity * .42})`;
              context.beginPath();
              context.arc(packetPoint.x, packetPoint.y, (coral ? 1.55 : .8 + strandStrength * .28) * (1 + packetPoint.displacement * .04), 0, TAU);
              context.fill();
              if (previousPoint && index % 5 !== 0 && fragment > .05) {
                context.strokeStyle = `rgba(166,90,117,${opacity * (strand === 0 ? .2 : .09)})`;
                context.lineWidth = strand === 0 ? .48 : .34;
                context.beginPath();
                context.moveTo(previousPoint.x, previousPoint.y);
                context.lineTo(packetPoint.x, packetPoint.y);
                context.stroke();
              }
              previousPoint = packetPoint;
            } else {
              previousPoint = null;
            }
          }
        }
      }
    };

    const drawPerceptualFlow = (time: number) => {
      const mobile = width < 700;
      const entryX = width * (mobile ? .76 : .775);
      const centerX = width * (mobile ? .895 : .89);
      const centerY = height * (mobile ? .68 : .51);
      const sourceX = width * (mobile ? .08 : .34);
      const streamCount = mobile ? 4 : 6;

      context.save();
      context.globalCompositeOperation = "source-over";
      for (let stream = 0; stream < streamCount; stream++) {
        const identity = stream / Math.max(1, streamCount - 1) - .5;
        const sourceY = centerY + identity * height * (mobile ? .43 : .64) + (stream % 2 ? height * .035 : -height * .02);
        const phase = time * (.00009 + stream * .000006) + stream * 1.37;
        const samples = mobile ? 54 : 82;
        let previous: { x: number; y: number } | null = null;

        for (let sample = 0; sample <= samples; sample++) {
          const progress = sample / samples;
          const entryEnd = .61 + (stream % 3) * .018;
          let x: number;
          let y: number;
          let absorption = 0;

          if (progress <= entryEnd) {
            const approach = progress / entryEnd;
            const accelerated = Math.pow(approach, .72);
            const baseline = sourceY + (centerY - sourceY) * Math.pow(approach, 1.12);
            const narrowing = Math.pow(1 - approach, 1.35);
            const amplitude = height * (.015 + Math.abs(identity) * .02) * narrowing;
            x = sourceX + (entryX - sourceX) * accelerated;
            y = baseline
              + Math.sin(approach * TAU * (1.2 + stream * .11) - phase * 2.45) * amplitude
              + Math.sin(approach * TAU * 3 + phase) * amplitude * .2;
          } else {
            absorption = (progress - entryEnd) / (1 - entryEnd);
            const radiusX = (centerX - entryX) * Math.pow(1 - absorption, 1.18);
            const radiusY = height * (.105 + Math.abs(identity) * .045) * Math.pow(1 - absorption, 1.3);
            const entryAngle = Math.PI + identity * .52;
            const angle = entryAngle + absorption * TAU * (.72 + stream * .027) + Math.sin(phase) * .09;
            x = centerX + Math.cos(angle) * radiusX;
            y = centerY + Math.sin(angle) * radiusY;
          }

          const arrival = Math.min(1, progress / entryEnd);
          const absorptionFade = absorption === 0 ? 1 : Math.pow(1 - absorption, .9);
          const opacity = (.16 + arrival * .5) * absorptionFade * (mobile ? .82 : 1);
          const packet = .3 + .7 * Math.pow(Math.max(0, Math.sin(progress * TAU * 2.4 - phase * 3.2)), 5);

          if (previous) {
            context.strokeStyle = `rgba(${stream % 3 === 0 ? "218,155,187" : stream % 3 === 1 ? "187,92,118" : "161,92,130"},${opacity * (.38 + packet * .62)})`;
            context.lineWidth = (.8 + arrival * 1.65) * (1 - absorption * .5);
            context.shadowColor = "rgba(218,155,187,.32)";
            context.shadowBlur = arrival * 5;
            context.beginPath();
            context.moveTo(previous.x, previous.y);
            context.lineTo(x, y);
            context.stroke();
          }

          if (sample % 4 === stream % 4 && packet > .55) {
            context.fillStyle = `rgba(218,155,187,${opacity * packet * 1.25})`;
            context.beginPath();
            context.arc(x, y, (.45 + arrival * 1.25) * (1 - absorption * .7), 0, TAU);
            context.fill();
          }
          previous = { x, y };
        }
      }

      const arrivalPulse = reduceMotion.matches ? .45 : .5 + .5 * Math.sin(time * .00115);
      for (let layer = 0; layer < 3; layer++) {
        context.strokeStyle = `rgba(${layer === 0 ? "116,77,111" : layer === 1 ? "161,92,130" : "187,92,118"},${.08 + arrivalPulse * (.035 + layer * .018)})`;
        context.lineWidth = .7 + layer * .28;
        context.shadowColor = "rgba(187,92,118,.22)";
        context.shadowBlur = 4 + layer * 2;
        context.beginPath();
        context.ellipse(entryX + layer * width * .027, centerY, width * (.018 + layer * .012), height * (.11 + layer * .055), 0, -Math.PI / 2, Math.PI / 2);
        context.stroke();
      }
      context.restore();
      context.shadowBlur = 0;
    };

    // Retain the richer field generator for future non-hero use without running
    // its expensive topology pass on every hero frame.
    void drawScaffold;

    const render = (time: number) => {
      if (!running) return;
      if (!visible) { frame = requestAnimationFrame(render); return; }
      const staticTime = reduceMotion.matches ? 6800 : time;
      const cycle = (staticTime % 14000) / 14000;
      const structure = reduceMotion.matches ? .7 : Math.max(0, Math.sin(Math.PI * Math.min(1, Math.max(0, (cycle - .18) / .62))));

      context.clearRect(0, 0, width, height);
      const calmBoundary = width * .4;
      for (const particle of particles) {
        particle.z = (particle.z + (reduceMotion.matches ? 0 : .00016 + particle.seed % 1 * .00012)) % 1;
        const depthSpeed = .08 + particle.z * .42;
        const normalizedX = particle.x / width;
        const funnelProgress = Math.max(0, Math.min(1, (normalizedX - .22) / .6));
        const funnelCenter = height * (width < 700 ? .68 : .51);
        const corridorCenter = funnelCenter + (particle.y - funnelCenter) * Math.pow(1 - funnelProgress, 1.7) + Math.sin(normalizedX * 7 + staticTime * .00012 + particle.branch) * height * .018 * (1 - funnelProgress);
        const corridorPull = particle.x > width * .22 ? (corridorCenter - particle.y) * (.00055 + funnelProgress * .0014 + particle.z * .00035) : 0;
        const angle = Math.sin(particle.y * .006 + staticTime * .0001 + particle.seed) * .75 + Math.cos(particle.x * .003 - staticTime * .00007) * .38;
        const flowX = (.56 + Math.cos(angle) * .28) * depthSpeed;
        const flowY = Math.sin(angle) * depthSpeed + corridorPull;
        let forceX = 0;
        let forceY = 0;
        if (pointer.active && !reduceMotion.matches) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.max(30, Math.hypot(dx, dy));
          if (distance < 150) { const force = (1 - distance / 150) * .055; forceX += dx / distance * force; forceY += dy / distance * force; }
        }
        const targetX = width * .8 + Math.cos(particle.seed * TAU) * width * .035;
        const targetY = height * (width < 700 ? .68 : .51) + Math.sin(particle.seed * TAU * 1.7) * height * .045;
        const assemble = structure * (particle.seed % 1 > .72 ? .008 : .0012);
        particle.vx = particle.vx * .94 + flowX * .06 + (targetX - particle.x) * assemble * .012 + forceX;
        particle.vy = particle.vy * .94 + flowY * .06 + (targetY - particle.y) * assemble * .012 + forceY;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width * .84) { particle.x = -20 - (particle.seed % 1) * width * .12; particle.y = ((particle.seed * 19.37 + time * .000013) % 1) * height; }
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const textCalm = particle.x < calmBoundary ? .2 : 1;
        const displayPoint = deformedPoint(particle.x, particle.y, particle.z, staticTime);
        const alpha = (.035 + displayPoint.z * .3) * textCalm * (1 + displayPoint.displacement * .09);
        const size = .28 + displayPoint.z * displayPoint.z * 1.55;
        const excitation = particleExcitation(particle, staticTime) * (particle.x < calmBoundary ? .15 : 1);
        context.fillStyle = excitation > .025
          ? `rgba(187,92,118,${Math.min(.94, alpha * .75 + excitation * .86)})`
          : `rgba(166,90,117,${alpha})`;
        context.beginPath(); context.arc(displayPoint.x, displayPoint.y, size * (1 + excitation * .32), 0, TAU); context.fill();
        if (particle.z > .75 && particle.seed % 1 > .68) {
          const trailPoint = deformedPoint(particle.x - particle.vx * 14, particle.y - particle.vy * 14, particle.z, staticTime);
          context.strokeStyle = `rgba(116,77,111,${alpha * .35})`;
          context.lineWidth = .45;
          context.beginPath(); context.moveTo(displayPoint.x, displayPoint.y); context.lineTo(trailPoint.x, trailPoint.y); context.stroke();
        }
      }
      drawPerceptualFlow(staticTime);
      drawRipples(staticTime);
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
