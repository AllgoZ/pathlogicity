/**
 * Deterministic topographic contour field used by asset placeholders.
 * Pure function → identical output on server and client (no hydration drift).
 */
type Hill = { cx: number; cy: number; r: number; rings: number; seed: number };

function ring(cx: number, cy: number, r: number, seed: number, stretch: number) {
  const n = 96;
  let d = "";
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const k =
      1 +
      0.09 * Math.sin(3 * t + seed) +
      0.05 * Math.sin(5 * t + seed * 1.7) +
      0.025 * Math.sin(9 * t + seed * 2.3);
    const x = cx + r * k * Math.cos(t) * stretch;
    const y = cy + r * k * Math.sin(t);
    d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d + "Z";
}

export function contourPaths(variant = 0, w = 1600, h = 900): string[] {
  const s = variant * 1.37;
  const hills: Hill[] = [
    { cx: w * 0.24, cy: h * 0.3, r: 34, rings: 14, seed: 0.4 + s },
    { cx: w * 0.72, cy: h * 0.66, r: 30, rings: 17, seed: 2.1 + s },
    { cx: w * 0.86, cy: h * 0.12, r: 26, rings: 9, seed: 4.2 + s },
  ];
  const out: string[] = [];
  for (const hill of hills) {
    for (let i = 0; i < hill.rings; i++) {
      out.push(ring(hill.cx, hill.cy, hill.r + i * 34, hill.seed + i * 0.22, 1.55));
    }
  }
  return out;
}
