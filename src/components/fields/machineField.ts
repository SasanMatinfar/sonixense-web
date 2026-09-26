// Shared seeded visual grammar. Complexity adds detail without changing the restrained field.
export const SOURCES = ["Sensors", "Imaging", "Tracking", "AI", "Simulation", "Robotics", "Data"];
const TAU = Math.PI * 2;
const hash = (n: number) => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v: number) => { v = clamp(v); return v * v * (3 - 2 * v); };
export type Geometry = { x0: number; xspan: number; iface: number; human: number; humanY: number; top: number; span: number; mid: number; lineTop: number; lineBot: number };
export const fallbackGeometry: Geometry = { x0: .115, xspan: .61, iface: .7, human: .91, humanY: .78, top: .34, span: .54, mid: .62, lineTop: .27, lineBot: .92 };


export function drawMachineField(ctx: CanvasRenderingContext2D, width: number, height: number, geo: Geometry, time: number, mobile: boolean, reduced = false, reveal = 1, warm = false, reach = 1, complexity = 0) {
 const phase = time * .00012;
 const streamCount = mobile ? 42 : 63;
 ctx.save();
 ctx.globalAlpha *= reveal;
    function streamPoint(stream: number, progress: number, time: number) {

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
        const startX = width * geo.x0 + (sibling - (siblings - 1) / 2) * 1.2;
        const startY = height * (geo.top + familyPosition * geo.span);
        const bottleneckY = height * (geo.mid + .04);
        const y = startY + progress * (bottleneckY - startY);
        const converge = smooth((progress - .6) / .36);
        const character = family === 4 ? .65 : family === 3 ? 1.3 : family === 5 ? .82 : 1;
        const familyMotion = Math.sin(progress * TAU * frequency + strandPhase) * width * (.009 + sibling * .0011) * character * amplitude;
        const fineMotion = Math.sin(progress * TAU * (2.1 + hash(strandSeed + 3) * 3.4) - time * motionRate + strandPhase * .4) * width * (.0025 + hash(strandSeed + 6) * .0055);
        const turbulence = Math.sin(progress * TAU * (5.2 + hash(strandSeed + 11) * 5.8) + time * motionRate * .63) * width * (.0012 + hash(strandSeed + 15) * .0028) * Math.sin(progress * Math.PI);
        const x = startX * (1 - converge) + width * .5 * converge + (familyMotion + fineMotion + turbulence) * (1 - converge * .72);
        return { x, y, compression: smooth((y / bottleneckY - .77) / .23) };
      }
      const startY = height * (geo.top + familyPosition * geo.span) + (sibling - (siblings - 1) / 2) * 1.45;
      const x = width * geo.x0 + progress * width * geo.xspan;
      const bottleneckX = width * geo.iface;
      const converge = smooth((progress - .58) / .38);
      const character = family === 4 ? .62 : family === 3 ? 1.3 : family === 5 ? .76 : 1;
      const broad = Math.sin(progress * TAU * frequency + strandPhase) * height * (.006 + sibling * .0008) * character * amplitude;
      const fine = Math.sin(progress * TAU * (1.8 + hash(strandSeed + 3) * 3.8) - time * motionRate + strandPhase * .37) * height * (.0018 + hash(strandSeed + 6) * .0062);
      const chirp = Math.sin(progress * progress * TAU * (3.5 + hash(strandSeed + 10) * 7.5) + time * motionRate * .52) * height * (.0014 + hash(strandSeed + 14) * .0036) * Math.sin(progress * Math.PI);
      const localBurst = Math.sin(progress * TAU * (7 + hash(strandSeed + 18) * 6) - time * motionRate * 1.7) * height * .0045 * Math.exp(-Math.pow((progress - (.25 + hash(strandSeed + 21) * .46)) / (.07 + hash(strandSeed + 25) * .13), 2));
      const drift = Math.sin(progress * TAU * (.28 + hash(strandSeed + 17) * .56) + strandPhase * .7) * height * (.004 + hash(strandSeed + 20) * .009);
      const y = startY * (1 - converge) + height * geo.mid * converge + (broad + fine + chirp + localBurst + drift) * (1 - converge * .72);
      return { x, y, compression: smooth((x / bottleneckX - .72) / .28) };
    }

      for (let stream = 0; stream < streamCount; stream++) {
        const siblings = mobile ? 6 : 9;
        const kind = Math.floor(stream / siblings);
        let previous: ReturnType<typeof streamPoint> | null = null;
        const steps = mobile ? 52 : 84;
        for (let i = 0; i <= steps; i++) {
          const p = i / steps;
          if (p > reach) break;
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
              ctx!.strokeStyle = `rgba(${warm ? "237,207,226" : "145,218,214"},${(.04 + activity * .14) * depth * shimmer})`;
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
          if (p > reach) break;
          const point = streamPoint(contour * (mobile ? 6 : 9) + 2, p, time);
          const offset = Math.sin(p * TAU * 2.3 + contour + phase) * (mobile ? 9 : 13) * (1 - point.compression);
          if (mobile) point.x += offset; else point.y += offset;
          if (i) ctx!.lineTo(point.x, point.y); else ctx!.moveTo(point.x, point.y);
        }
        ctx!.strokeStyle = `rgba(${warm ? "233,194,215" : "124,200,202"},${.07 + contour * .006})`;
        ctx!.lineWidth = .65; ctx!.stroke();
      }

      // Bright samples travel with each source family and collect at the interface.
      const siblings = mobile ? 6 : 9;
      for (let family = 0; family < 7; family++) {
        for (let sample = 0; sample < 3; sample++) {
          const sampleSeed = family * 17.31 + sample * 5.73;
          const speed = .58 + hash(sampleSeed + 2.1) * 1.34;
          const offset = hash(sampleSeed + 8.4);
          const travel = reduced ? offset : (time * .0001 * speed + offset) % 1;
          if (travel > reach) continue;
          const point = streamPoint(family * siblings + 2 + sample, travel, time);
          const presence = Math.pow(Math.sin(travel * Math.PI), .45);
          const irregularGlow = reduced ? .68 : clamp(
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

      // Technology adds 98 desktop / 70 mobile paths to the existing 63 / 42.
      // Each remains attached to a source family and the established convergence geometry.
      // The zero-complexity branch performs no drawing: Section 02 stays pixel-identical.
      const intake = Array<number>(7).fill(0);
      if (complexity > 0) {
        const detailCount = mobile ? 10 : 14;
        const steps = mobile ? 64 : 104;
        const frequencies = [5.2, 2.8, 1.1, 9.4, .8, 4.1, 6.7];
        const richPoint = (family: number, lane: number, progress: number) => {
          const siblings = mobile ? 6 : 9;
          const seed = family * 43.7 + lane * 9.13;
          const anchor = streamPoint(family * siblings + lane % siblings, progress, time);
          const transverse = mobile ? width : height;
          const gather = smooth((progress - .58) / .4);
          const envelope = Math.sin(Math.PI * progress);
          // Modality-specific carriers: samples, layered imaging, smooth tracking,
          // locally dense AI, low-frequency simulation, stepped robotics, segmented data.
          const rate = .0003 + hash(seed + 2) * .0006;
          const carrier = progress * TAU * frequencies[family] - time * rate + hash(seed) * TAU;
          const wave = family === 5 ? Math.tanh(Math.sin(carrier) * 2.2) : Math.sin(carrier);
          const detail = (lane - (detailCount - 1) / 2) * transverse * .0028
            + wave * transverse * (.003 + hash(seed + 3) * .0045) * envelope
            + Math.sin(progress * TAU * (13 + hash(seed + 4) * 9) - time * rate * .7)
              * transverse * .002 * envelope * (family === 3 || family === 6 ? 1 : .35);
          const offset = detail * (1 - gather * .84);
          if (mobile) anchor.x += offset; else anchor.y += offset;
          return anchor;
        };
        ctx.save();
        ctx.globalAlpha *= complexity;
        for (let family = 0; family < 7; family++) {
          for (let lane = 0; lane < detailCount; lane++) {
            const seed = family * 43.7 + lane * 9.13;
            const primary = lane < 4;
            ctx.beginPath();
            const sampled = family === 0 || (family === 6 && !primary);
            const segmented = family === 3 || family === 5 || family === 6;
            let connected = false;
            for (let i = 0; i <= steps; i++) {
              const p = i / steps;
              if (p > reach) break;
              const point = richPoint(family, lane, p);
              if (sampled) {
                if (i % (primary ? 4 : 7) === lane % 3) {
                  ctx.fillStyle = `rgba(237,207,226,${primary ? .24 : .14})`;
                  ctx.moveTo(point.x + .65, point.y);
                  ctx.arc(point.x, point.y, primary ? .75 : .5, 0, TAU);
                }
              } else {
                const gap = segmented && (i + lane * 3) % 13 > 8;
                if (!connected || gap) ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
                connected = !gap;
              }
            }
            if (sampled) ctx.fill();
            else {
              ctx.strokeStyle = `rgba(237,207,226,${(primary ? .19 : .095) + hash(seed + 5) * .035})`;
              ctx.lineWidth = primary ? .8 : .45;
              ctx.stroke();
            }
          }
          // Most particles cruise; occasional faster pulses travel on the same paths.
          // Exponential progress has positive, increasing velocity (about 3× at intake).
          // Phase offsets and rates are seeded independently, never synchronized.
          for (let sample = 0; sample < (mobile ? 9 : 14); sample++) {
            const seed = family * 37.13 + sample * 5.71;
            const rate = .115 + hash(seed + 1) * .135 + (sample % 6 === 0 ? .09 : 0);
            const phase = (time * .001 * rate + hash(seed + 8)) % 1;
            const acceleration = .9 + hash(seed + 3) * .65;
            const travel = Math.expm1(acceleration * phase) / Math.expm1(acceleration);
            const lane = sample % detailCount;
            // Smooth periodic arrival response: no jump in contour spacing at recycle.
            intake[family] += Math.exp((Math.cos(TAU * (phase - rate * .12)) - 1) * 110) / 3;
            if (travel > reach) continue;
            const point = richPoint(family, lane, travel);
            const presence = smooth(travel / .035) * (1 - smooth((travel - .97) / .03));
            const activity = .55 + .45 * smooth((travel - .4) / .6);
            const tail = Math.max(0, travel - (.006 + .017 * travel * travel));
            const back = richPoint(family, lane, tail);
            ctx.strokeStyle = `rgba(245,216,231,${presence * activity * .26})`;
            ctx.lineWidth = .65;
            ctx.beginPath(); ctx.moveTo(back.x, back.y); ctx.lineTo(point.x, point.y); ctx.stroke();
            ctx.fillStyle = `rgba(248,230,237,${presence * activity * (.5 + hash(seed + 9) * .27)})`;
            ctx.beginPath(); ctx.arc(point.x, point.y, .65 + hash(seed + 10) * .8, 0, TAU); ctx.fill();
          }
          intake[family] = clamp(intake[family]) * complexity * smooth((reach - .9) / .1);
        }
        ctx.restore();
      }

 ctx.restore();
 return intake;
}
