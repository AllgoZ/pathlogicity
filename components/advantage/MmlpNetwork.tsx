"use client";

import { useRef } from "react";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";

const W = 720;
const H = 520;
const COLS = 7;
const ROWS = 5;
const HUB = 2 * COLS + 4; // one node reads as the largest MMLP

/** Deterministic pseudo-random jitter so the layout is stable between server and client. */
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const NODES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  // rounded: server (Node) and client (browser) must print identical coordinates or React will not hydrate cleanly
  return {
    x: Math.round(((c + 0.5) / COLS) * W + (rand(i) - 0.5) * 62),
    y: Math.round(((r + 0.5) / ROWS) * H + (rand(i + 99) - 0.5) * 50),
  };
});

const EDGES = (() => {
  const seen = new Set<string>();
  const out: { a: number; b: number; hub: boolean }[] = [];
  const link = (a: number, b: number) => {
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ a, b, hub: a === HUB || b === HUB });
  };
  NODES.forEach((n, i) => {
    const near = NODES.map((m, j) => ({ j, d: Math.hypot(m.x - n.x, m.y - n.y) }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d);
    near.slice(0, i === HUB ? 5 : 2).forEach((o) => link(i, o.j));
  });
  return out;
})();

/**
 * Data-led visual for PM Gati Shakti: the national MMLP network as a schematic graph, with
 * Path Logicity's Bengaluru hub as its largest node. Positions are NOT geographic (no map of
 * India is drawn) — it shows connection and scale only, using the client's facts.
 */
export function MmlpNetwork({ hubLabel }: { hubLabel: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useMotion(ref as React.RefObject<HTMLElement | null>, (mm) => {
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 78%", once: true } });
      tl.from(q("[data-edge]"), { strokeDashoffset: 1, duration: 1.1, ease: "power2.inOut", stagger: { each: 0.018, from: "random" } }, 0)
        .from(q("[data-node]"), { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2)", stagger: { each: 0.02, from: "random" } }, 0.15)
        .from(q("[data-hub]"), { scale: 0.2, opacity: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(1.8)" }, 0.9);
    });
  });

  const hub = NODES[HUB];
  return (
    <figure>
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Schematic of the national MMLP network under PM Gati Shakti, with the Bengaluru hub as the largest node"
        className="block h-auto w-full"
        fill="none"
      >
        {EDGES.map((e, i) => (
          <line
            key={i}
            data-edge
            x1={NODES[e.a].x}
            y1={NODES[e.a].y}
            x2={NODES[e.b].x}
            y2={NODES[e.b].y}
            pathLength={1}
            strokeDasharray="1 1"
            stroke={e.hub ? "var(--color-yellow-400)" : "var(--color-indigo-700)"}
            strokeOpacity={e.hub ? 0.95 : 0.22}
            strokeWidth={e.hub ? 2 : 1}
          />
        ))}
        {NODES.map((n, i) =>
          i === HUB ? null : (
            <circle key={i} data-node cx={n.x} cy={n.y} r={6.5} fill="var(--color-paper)" stroke="var(--color-indigo-700)" strokeWidth={2} />
          ),
        )}
        <g data-hub>
          <circle cx={hub.x} cy={hub.y} r={34} fill="var(--color-yellow-400)" opacity={0.18} className="animate-pulse-soft" style={{ transformOrigin: `${hub.x}px ${hub.y}px` }} />
          <circle cx={hub.x} cy={hub.y} r={20} fill="var(--color-paper)" stroke="var(--color-yellow-400)" strokeWidth={3} />
          <image href="/client/logo-mark-160.png" x={hub.x - 10} y={hub.y - 11.5} width={20} height={23} />
          <text x={hub.x} y={hub.y + 52} textAnchor="middle" className="fill-ink" stroke="var(--color-stone)" strokeWidth={5} paintOrder="stroke" style={{ font: "700 19px var(--font-sans)" }}>
            {hubLabel}
          </text>
        </g>
      </svg>
      <figcaption className="t-micro mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-steel-700">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded-full border-2 border-yellow-400 bg-paper" /> {hubLabel} — the largest MMLP being built currently
        </span>
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-2.5 w-2.5 rounded-full border-2 border-indigo-700 bg-paper" /> MMLPs under PM Gati Shakti
        </span>
        <span className="text-steel-500">Schematic · not geographic</span>
      </figcaption>
    </figure>
  );
}
