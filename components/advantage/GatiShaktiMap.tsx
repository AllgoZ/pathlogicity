"use client";

import { useRef, useState, type CSSProperties } from "react";
import type { Destination, Mode } from "@/lib/content/types";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useIsoLayoutEffect, useMotion } from "@/lib/motion/hooks";
import { Icon } from "@/components/ui/Icon";
import { MAP, ROUTES, SITE } from "@/components/connectivity-map/mapGeometry";

/** The points, in the order they are drawn (nearest corridors first, far ports last). */
const ORDER = ["nh648", "strr", "nh48", "dodbele", "kia", "mangalore", "chennai"] as const;
const SHORT: Record<string, string> = {
  nh648: "NH 648",
  strr: "STRR",
  nh48: "NH 48",
  dodbele: "Dodbele station",
  kia: "Kempegowda Airport",
  mangalore: "Mangalore Port",
  chennai: "Chennai Port",
};
/** where each label sits relative to its pin, chosen so it clears the map's own printed names */
const PLACE: Record<string, "left" | "right" | "above" | "below"> = {
  nh648: "below",
  strr: "right",
  nh48: "below",
  dodbele: "below",
  kia: "left",
  mangalore: "right",
  chennai: "left",
};
const PLACE_CLASS = {
  left: "right-3.5 top-0 -translate-y-1/2",
  right: "left-3.5 top-0 -translate-y-1/2",
  above: "bottom-3.5 left-0 -translate-x-1/2",
  below: "left-0 top-3.5 -translate-x-1/2",
} as const;
const MODE_COLOR: Record<Mode, string> = {
  road: "var(--color-indigo-700)",
  rail: "var(--color-blue-500)",
  air: "var(--color-orange-600)",
  port: "var(--color-green-700)",
};
const MODE_ICON = { road: "road", rail: "rail", air: "air", port: "port" } as const;

/* Line style per mode (the same language as §07): lengths are screen px × --u (user units per px). */
const u = (n: number) => `calc(var(--u) * ${n}px)`;
const stroke = (mode: Mode, w: number): CSSProperties => {
  const base: CSSProperties = { stroke: MODE_COLOR[mode], strokeWidth: u(w), fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  if (mode === "air") return { ...base, strokeDasharray: `${u(0.1)} ${u(w * 2.2)}`, strokeWidth: u(w * 1.5) };
  if (mode === "port") return { ...base, strokeDasharray: `${u(w * 4)} ${u(w * 2.4)}`, strokeLinecap: "butt" };
  if (mode === "rail") return { ...base, strokeDasharray: `${u(w * 3)} ${u(w * 1.4)}`, strokeLinecap: "butt" };
  return base;
};
const casing = (w: number): CSSProperties => ({ stroke: "white", strokeWidth: u(w), fill: "none", strokeLinecap: "round", strokeLinejoin: "round", opacity: 0.92 });

const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/**
 * §07.1 — PM Gati Shakti on the client's own location map (the same image and traced routes as §07).
 * Path Logicity is the hub; every road, rail, air and port link is drawn out from it to its point.
 * Distances are shown only where the client supplied them.
 */
export function GatiShaktiMap({ destinations }: { destinations: Destination[] }) {
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const byId = Object.fromEntries(destinations.map((d) => [d.id, d]));
  const ids = ORDER.filter((id) => ROUTES[id] && byId[id]);

  // user-units-per-pixel, so line widths and dashes stay a constant size on screen at any map width
  useIsoLayoutEffect(() => {
    const el = svg.current;
    if (!el) return;
    const set = () => el.style.setProperty("--u", String(MAP.w / (el.clientWidth || MAP.w)));
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // first view: the site pops, the routes draw out one by one, each point lands with its route
  useMotion(root, (mm) => {
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 72%", once: true } });
      tl.from(q("[data-gsite]"), { scale: 0, opacity: 0, duration: 0.7, ease: "back.out(2.4)" })
        .from(q("[data-gmask]"), { strokeDashoffset: 1, duration: 1.2, ease: "power2.inOut", stagger: 0.32 }, 0.35)
        .from(q("[data-gpin]"), { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(2.4)", stagger: 0.32 }, 1.2)
        .from(q("[data-glabel]"), { opacity: 0, y: 6, duration: 0.5, ease: "power2.out", stagger: 0.32 }, 1.3);
    });
  });

  const dist = (d: Destination) => (d.distanceKm !== null ? `${d.distanceKm} km` : null);

  return (
    <figure ref={root}>
      <div className="card relative overflow-hidden" style={{ aspectRatio: `${MAP.w} / ${MAP.h}` }} onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}>
        <svg ref={svg} viewBox={`0 0 ${MAP.w} ${MAP.h}`} role="img" aria-label="Location map: the routes that connect Path Logicity, Dobbaspet to NH 648, STRR, NH 48, Dodbele railway station, Kempegowda International Airport and the ports of Mangalore and Chennai" className="absolute inset-0 h-full w-full">
          <image href={MAP.src} width={MAP.w} height={MAP.h} />
          <defs>
            {ids.map((id) => (
              <mask key={id} id={`gs-mask-${id}`} maskUnits="userSpaceOnUse" x="0" y="0" width={MAP.w} height={MAP.h}>
                <path data-gmask d={ROUTES[id].d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={0} style={{ stroke: "white", strokeWidth: u(14), fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }} />
              </mask>
            ))}
          </defs>
          {ids.map((id) => {
            const r = ROUTES[id];
            const dim = active && active !== id;
            return (
              <g key={id} mask={`url(#gs-mask-${id})`} className="transition-opacity duration-500" opacity={dim ? 0.22 : 1}>
                <path d={r.d} style={casing(active === id ? 11 : 9)} />
                <path d={r.d} style={stroke(r.mode, active === id ? 4.4 : 3.4)} />
              </g>
            );
          })}
        </svg>

        {/* the site — Path Logicity, Dobbaspet */}
        <span
          data-gsite
          aria-hidden
          className="pointer-events-none absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(SITE.x, MAP.w), top: pct(SITE.y, MAP.h) }}
        >
          <span className="absolute -inset-1 rounded-full bg-yellow-400 animate-pulse-soft" />
          <span className="relative block h-4 w-4 rounded-full border-[2.5px] border-white bg-yellow-400 shadow" />
        </span>

        {/* the points */}
        {ids.map((id) => {
          const r = ROUTES[id];
          const d = byId[id];
          const on = active === id;
          const place = PLACE[id] ?? "right";
          return (
            <div key={id} className={`absolute z-20 transition-opacity duration-500 ${active && !on ? "opacity-40" : ""}`} style={{ left: pct(r.end.x, MAP.w), top: pct(r.end.y, MAP.h) }}>
              <button
                data-gpin
                type="button"
                aria-label={`${SHORT[id]}${dist(d) ? `, ${dist(d)}` : ""} — show route`}
                aria-pressed={on}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(id)}
                onFocus={() => setActive(id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(id)}
                className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <span className="block h-3 w-3 rounded-full border-2 border-white shadow transition-transform duration-300" style={{ background: on ? "var(--color-yellow-400)" : MODE_COLOR[r.mode], transform: on ? "scale(1.45)" : undefined }} />
              </button>
              <span aria-hidden className={`pointer-events-none absolute ${PLACE_CLASS[place]}`}>
                <span
                  data-glabel
                  className={`flex items-center gap-1.5 whitespace-nowrap border bg-paper/95 px-2 py-1 text-[0.6875rem] font-semibold leading-none shadow-sm transition-[border-color] duration-300 sm:text-[0.75rem] ${
                    on ? "border-yellow-400 text-ink" : "border-ink/15 text-steel-700 max-sm:hidden"
                  }`}
                >
                  <Icon name={MODE_ICON[r.mode]} size={12} className="shrink-0" style={{ color: MODE_COLOR[r.mode] }} />
                  {SHORT[id]}
                  {dist(d) ? <span className="tnum font-bold text-indigo-700">· {dist(d)}</span> : null}
                </span>
              </span>
            </div>
          );
        })}

        <p aria-hidden className="t-micro pointer-events-none absolute bottom-2 right-2 bg-paper/90 px-2 py-1 text-steel-500">
          Map · not to scale
        </p>
      </div>

      <figcaption className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.8125rem] font-semibold text-steel-700">
        <span className="flex items-center gap-2">
          <span aria-hidden className="h-3 w-3 rounded-full border-2 border-white bg-yellow-400 shadow ring-1 ring-ink/15" /> Path Logicity · Dobbaspet
        </span>
        {(["road", "rail", "air", "port"] as Mode[]).map((m) => (
          <span key={m} className="flex items-center gap-2 capitalize">
            <svg aria-hidden width="28" height="8" viewBox="0 0 28 8">
              <line x1="1" y1="4" x2="27" y2="4" stroke={MODE_COLOR[m]} strokeWidth={m === "air" ? 3 : 2.5} strokeLinecap={m === "road" || m === "air" ? "round" : "butt"} strokeDasharray={m === "rail" ? "6 3" : m === "port" ? "9 5" : m === "air" ? "0.1 5" : undefined} />
            </svg>
            {m === "port" ? "Ports" : m}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
