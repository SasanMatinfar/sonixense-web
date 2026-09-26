/** One clock for DOM and canvas. ?frame=N selects an exact 30fps export frame.
 * Exporters may dispatch CustomEvent('pitch:seek', {detail: seconds}). */
export function runPitchTimeline(root: HTMLElement, duration: number, draw: (seconds: number) => void, options: { loop?: boolean; hold?: number } = {}) {
  let frame = 0, disposed = false, origin = 0, current = 0;
  const requested = new URLSearchParams(location.search).get("frame");
  const render = (seconds: number) => {
    current = options.loop ? ((seconds % duration) + duration) % duration
      : Math.max(0, Math.min(duration - (options.hold ?? .75), seconds));
    root.style.setProperty("--pitch-sources", String(Math.min(1, current / .8)));
    draw(current);
    root.dataset.time = current.toFixed(5);
  };
  const tick = (now: number) => {
    render((now - origin) / 1000);
    if (options.loop || (now - origin) / 1000 < duration) frame = requestAnimationFrame(tick);
  };
  const seek = (event: Event) => { cancelAnimationFrame(frame); render(Number((event as CustomEvent<number>).detail) || 0); };
  const resize = () => render(current);
  window.addEventListener("pitch:seek", seek);
  window.addEventListener("resize", resize);
  document.fonts.ready.then(() => {
    if (disposed) return;
    root.dataset.ready = "true";
    origin = performance.now();
    if (requested !== null) render((Number(requested) || 0) / 30);
    else { render(0); frame = requestAnimationFrame(tick); }
  });
  return () => { disposed = true; cancelAnimationFrame(frame); window.removeEventListener("pitch:seek", seek); window.removeEventListener("resize", resize); };
}
