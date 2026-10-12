/**
 * Route-line math. Paths are authored in a normalised 0–100 space (absolute
 * M/L/C/Q/S/T commands only) and scaled to real pixels, so strokes stay crisp,
 * dashes stay true and the "vehicle" head stays round at any aspect ratio.
 */
export function scalePath(d: string, w: number, h: number) {
  let i = 0;
  return d.replace(/-?\d*\.?\d+(?:e-?\d+)?/gi, (n) => {
    const v = parseFloat(n) / 100;
    const out = i % 2 === 0 ? v * w : v * h;
    i++;
    return out.toFixed(1);
  });
}

/**
 * Applies progress (0–1) to a route made of: trail path, comet path, head element.
 * Trail & comet use pathLength="1".
 */
export function applyRouteProgress(
  p: number,
  els: { path: SVGPathElement | null; trail?: SVGPathElement | null; comet?: SVGPathElement | null; head?: HTMLElement | SVGElement | null },
  cometLength = 0.14,
) {
  const { path, trail, comet, head } = els;
  if (!path) return;
  const t = Math.min(1, Math.max(0, p));
  if (trail) trail.style.strokeDashoffset = String(1 - t);
  if (comet) {
    const s = Math.max(0, t - cometLength);
    comet.style.strokeDasharray = `${(t - s).toFixed(4)} 4`;
    comet.style.strokeDashoffset = String(-s);
  }
  if (head) {
    const len = path.getTotalLength();
    const pt = path.getPointAtLength(t * len);
    if (head instanceof HTMLElement) {
      head.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0)`;
    } else {
      head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
    }
    head.style.opacity = t <= 0.001 ? "0" : "1";
  }
}
