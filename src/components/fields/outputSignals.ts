// Independent carriers; a voice recycles only where its particle and event are invisible.
const TAU = Math.PI * 2;
const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const smooth = (v: number) => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
export type SonicEvent = "dot" | "packet" | "rings" | "pattern" | "note";

export function outputSignal(index: number, time: number) {
  const speed = .043 + hash(index + 17) * .018;
  const phase = time * speed + hash(index * 3.7);
  const cycle = Math.floor(phase);
  const progress = phase - cycle;
  const cluster = Math.floor(index / 3);
  const slot = ((cycle + index) % 5 + 5) % 5;
  // One in five spatial-sound passages is a note: ~6.7% across all nine carriers.
  // The upper branch stays predominantly dots; the other branches carry more abstract structures.
  const event: SonicEvent = cluster === 2
    ? (["note", "packet", "dot", "rings", "pattern"] as const)[slot]
    : cluster === 1
      ? (["dot", "rings", "dot", "packet", "pattern"] as const)[slot]
      : slot === 4 ? "pattern" : "dot";
  const morph = event === "dot" ? 0 : smooth((progress - .28) / .13) * (1 - smooth((progress - .86) / .1));
  return { progress, event, morph, sinceArrival: progress / speed, visibility: smooth(Math.sin(Math.PI * progress)) };
}

// Smooth periodic reception envelopes peak just after each carrier arrives.
// Unlike a modulo-triggered decay, value AND slope match at every recycle boundary.
export function receptionActivity(time: number) {
  let total = 0;
  for (let index = 0; index < 9; index++) {
    const speed = .043 + hash(index + 17) * .018;
    const phase = time * speed + hash(index * 3.7);
    total += Math.exp((Math.cos(TAU * (phase - .018)) - 1) * 95);
  }
  return 1 - Math.exp(-total * .7);
}

/** A causal, smoothly bounded impulse response; attack and cutoff have zero slope. */
export function resonanceEnvelope(age: number, lifetime: number, decay: number) {
  if (age <= 0 || age >= lifetime) return 0;
  return smooth(age / .045) * Math.exp(-age / decay)
    * (1 - smooth((age - lifetime * .6) / (lifetime * .4)));
}

// Each burst is caused by a carrier finishing its preceding passage. Nothing is
// scheduled to a shared beat; carrier phases and per-arrival response seeds differ.
export function perceptionResonances(time: number) {
  return Array.from({ length: 9 }, (_, index) => {
    const speed = .043 + hash(index + 17) * .018;
    const phase = time * speed + hash(index * 3.7);
    const passage = Math.floor(phase);
    const age = (phase - passage) / speed;
    const seed = index * 19.73 + passage * 7.19;
    const arrivingEvent = outputSignal(index, time - age - .001).event;
    const strong = arrivingEvent === "packet" || arrivingEvent === "rings" || arrivingEvent === "note";
    const lifetime = (strong ? .95 : .62) + hash(seed + 1) * .28;
    return {
      age, lifetime,
      fronts: (strong ? 4 : 2) + Math.floor(hash(seed + 2) * (strong ? 3 : 2)),
      spacing: .033 + hash(seed + 3) * .024,
      strength: (strong ? .8 : .5) + hash(seed + 4) * .18,
      velocity: 4.8 + hash(seed + 5) * 2.8,
      decay: .24 + hash(seed + 6) * .14,
      deformation: .07 + hash(seed + 7) * .045,
      phase: hash(seed + 8) * TAU,
    };
  }).filter(event => event.age < event.lifetime + (event.fronts - 1) * event.spacing);
}
