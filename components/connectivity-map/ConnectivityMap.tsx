"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Destination, Mode } from "@/lib/content/types";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useIsoLayoutEffect } from "@/lib/motion/hooks";
import { applyRouteProgress } from "@/lib/motion/route";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PLACES, RAIL_MAIN, ROUTES, SITE, SITE_OUTLINE, VIEWS, type Level } from "./mapGeometry";

const MODES: { id: Mode | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "road", label: "Road" },
  { id: "rail", label: "Rail" },
  { id: "air", label: "Air" },
  { id: "port", label: "Port" },
];
const MODE_ICON = { road: "road", rail: "rail", air: "air", port: "port" } as const;

/* Mode is encoded by line style, not colour alone. Lengths are px × --u (user units per px). */
const modeStroke = (mode: Mode, active: boolean): CSSProperties => {
  const u = (n: number) => `calc(var(--u) * ${n}px)`;
  const color = active ? "var(--color-yellow-400)" : mode === "rail" ? "rgb(147 187 230 / 0.8)" : mode === "air" ? "rgb(196 201 214 / 0.75)" : "rgb(243 239 230 / 0.5)";
  const base: CSSProperties = { stroke: color, strokeWidth: u(active ? 2.2 : 1.4), fill: "none", strokeLinecap: mode === "air" ? "round" : "butt" };
  if (mode === "air") return { ...base, strokeDasharray: `${u(0.1)} ${u(6)}`, strokeWidth: u(active ? 3 : 2.4) };
  if (mode === "port") return { ...base, strokeDasharray: `${u(12)} ${u(7)}` };
  return base;
};

export function ConnectivityMap({ destinations }: { destinations: Destination[] }) {
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const mask = useRef<SVGPathElement>(null);
  const measure = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const vb = useRef<[number, number, number, number]>([...VIEWS.region]);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [level, setLevel] = useState<Level>("region");
  const [mode, setMode] = useState<Mode | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const dest = destinations.find((d) => d.id === selected) ?? null;
  const list = destinations.filter((d) => mode === "all" || d.mode === mode);

  const applyView = useCallback(() => {
    const el = svg.current;
    if (!el) return;
    const [x, y, w, h] = vb.current;
    el.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    const s = Math.min(el.clientWidth / w, el.clientHeight / h) || 1;
    el.style.setProperty("--u", String(1 / s));
  }, []);

  useIsoLayoutEffect(() => {
    applyView();
    const ro = new ResizeObserver(applyView);
    if (svg.current) ro.observe(svg.current);
    return () => ro.disconnect();
  }, [applyView]);

  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const flyTo = useCallback(
    (target: Level, then?: () => void) => {
      tl.current?.kill();
      const to = VIEWS[target];
      setLevel(target);
      if (reduce()) {
        vb.current = [...to];
        applyView();
        then?.();
        return;
      }
      const o = { x: vb.current[0], y: vb.current[1], w: vb.current[2], h: vb.current[3] };
      tl.current = gsap.timeline();
      tl.current.to(o, {
        x: to[0],
        y: to[1],
        w: to[2],
        h: to[3],
        duration: 0.9,
        ease: "power3.inOut",
        onUpdate: () => {
          vb.current = [o.x, o.y, o.w, o.h];
          applyView();
        },
      });
      if (then) tl.current.add(then);
    },
    [applyView],
  );

  // Draw the selected route (mask reveal keeps the mode's line style intact)
  const draw = useCallback(() => {
    const els = { path: measure.current, trail: mask.current, head: head.current };
    if (reduce()) return applyRouteProgress(1, els);
    const o = { p: 0 };
    applyRouteProgress(0, els);
    gsap.to(o, { p: 1, duration: 1.3, ease: "power2.inOut", onUpdate: () => applyRouteProgress(o.p, els) });
  }, []);

  const select = (d: Destination) => {
    if (selected === d.id) {
      setSelected(null);
      return;
    }
    setSelected(d.id);
    flyTo(d.level, draw);
  };

  useEffect(() => {
    if (!selected) applyRouteProgress(0, { path: measure.current, trail: mask.current, head: head.current });
  }, [selected]);

  // Intro: routes fade in one by one the first time the map is seen
  useIsoLayoutEffect(() => {
    if (!section.current) return;
    const mm = gsap.matchMedia(section.current);
    mm.add(MQ.motion, () => {
      const routes = svg.current?.querySelectorAll("[data-base-route]");
      if (!routes) return;
      gsap.set(routes, { opacity: 0 });
      const st = ScrollTrigger.create({
        trigger: svg.current,
        start: "top 70%",
        once: true,
        onEnter: () => gsap.to(routes, { opacity: 1, duration: 0.8, stagger: 0.15, ease: "power2.out", clearProps: "opacity" }),
      });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  const routeIds = Object.keys(ROUTES);
  const activeGeom = selected ? ROUTES[selected] : null;

  return (
    <section ref={section} id="connectivity" data-stage="understand" aria-labelledby="connectivity-title" className="relative overflow-hidden bg-navy-900 section-pad">
      <div className="shell grid-12 gap-y-8">
        <SectionHeader
          className="col-span-4 sm:col-span-8 lg:col-span-7"
          index="07"
          chapter="Solutions · Connectivity"
          id="connectivity-title"
          lines={["Road. Rail.", "Air. Ports."]}
          body="Select a destination to trace its route and mode of connectivity from Path Logicity."
        />
        <ul className="col-span-4 self-end sm:col-span-8 lg:col-span-4 lg:col-start-9" aria-label="Line legend">
          {(["road", "rail", "air", "port"] as Mode[]).map((m) => (
            <li key={m} className="flex items-center gap-4 border-b border-white/10 py-2.5 first:border-t">
              <svg width="56" height="10" aria-hidden className="shrink-0">
                {m === "road" ? <path d="M0 5 H56" stroke="rgb(243 239 230 / .7)" strokeWidth="1.6" /> : null}
                {m === "rail" ? (
                  <>
                    <path d="M0 5 H56" stroke="rgb(147 187 230)" strokeWidth="1.4" />
                    <path d="M0 5 H56" stroke="rgb(147 187 230)" strokeWidth="6" strokeDasharray="1 5" />
                  </>
                ) : null}
                {m === "air" ? <path d="M1 5 H56" stroke="rgb(196 201 214)" strokeWidth="2.4" strokeDasharray="0.1 6" strokeLinecap="round" /> : null}
                {m === "port" ? <path d="M0 5 H56" stroke="rgb(243 239 230 / .7)" strokeWidth="1.4" strokeDasharray="12 7" /> : null}
              </svg>
              <span className="t-micro text-paper">{m}</span>
              <span className="t-micro ml-auto text-steel-500">
                {m === "road" ? "NH 648 · NH 48 · STRR" : m === "rail" ? "6 railway sidings" : m === "air" ? "Kempegowda Int'l" : "Mangalore · Chennai"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="shell mt-12 grid-12 gap-y-6 lg:mt-16">
        {/* Map */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-8">
          <div className="relative aspect-[1.6] overflow-hidden border border-white/10 bg-ink">
            <svg
              ref={svg}
              className="absolute inset-0 h-full w-full"
              viewBox={VIEWS.region.join(" ")}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={`Schematic connectivity map, ${level} view${dest ? `, showing route to ${dest.name}` : ""}`}
              style={{ ["--u" as string]: 1 }}
            >
              <defs>
                <pattern id="map-dots" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" style={{ r: "calc(var(--u) * 0.9px)" } as CSSProperties} fill="rgb(255 255 255 / 0.16)" />
                </pattern>
                <mask id="route-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">
                  <path
                    ref={mask}
                    d={activeGeom?.d ?? "M 0 0"}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1}
                    stroke="white"
                    fill="none"
                    style={{ strokeWidth: "calc(var(--u) * 16px)" }}
                  />
                </mask>
              </defs>
              <rect x="-500" y="-500" width="2000" height="2000" fill="url(#map-dots)" />

              {/* rail main line + site footprint (visible at site level) */}
              <g className="transition-opacity duration-500" opacity={level === "site" ? 1 : 0}>
                <path d={RAIL_MAIN} style={{ ...modeStroke("rail", false), strokeDasharray: "none" }} />
                <path d={RAIL_MAIN} style={{ stroke: "rgb(147 187 230 / 0.8)", strokeWidth: "calc(var(--u) * 6px)", strokeDasharray: "calc(var(--u) * 1px) calc(var(--u) * 5px)", fill: "none" }} />
                <path d={SITE_OUTLINE} style={{ stroke: "rgb(243 239 230 / 0.6)", strokeWidth: "calc(var(--u) * 1px)", strokeDasharray: "calc(var(--u) * 6px) calc(var(--u) * 3px)", fill: "rgb(32 31 133 / 0.25)" }} />
              </g>

              {/* base routes */}
              {routeIds.map((id) => {
                const r = ROUTES[id];
                const visible = (mode === "all" || r.mode === mode) && (id !== "sidings" || level === "site");
                const dim = selected !== null && selected !== id;
                return (
                  <g key={id} data-base-route className="transition-opacity duration-500" opacity={!visible ? 0.06 : dim ? 0.18 : 1}>
                    <path d={r.d} style={modeStroke(r.mode, false)} />
                    {r.mode === "rail" ? <path d={r.d} style={{ stroke: "rgb(147 187 230 / 0.6)", strokeWidth: "calc(var(--u) * 4px)", strokeDasharray: "calc(var(--u) * 0.8px) calc(var(--u) * 4px)", fill: "none" }} /> : null}
                  </g>
                );
              })}

              {/* active route, revealed by the drawing mask */}
              {activeGeom ? (
                <g mask="url(#route-mask)">
                  <path d={activeGeom.d} style={modeStroke(activeGeom.mode, true)} />
                  {activeGeom.mode === "rail" ? <path d={activeGeom.d} style={{ stroke: "var(--color-yellow-400)", strokeWidth: "calc(var(--u) * 5px)", strokeDasharray: "calc(var(--u) * 1px) calc(var(--u) * 4px)", fill: "none" }} /> : null}
                </g>
              ) : null}
              <path ref={measure} d={activeGeom ? activeGeom.d.split(" M ")[0] : "M 0 0"} fill="none" stroke="none" />

              {/* route labels */}
              {routeIds.map((id) => {
                const l = ROUTES[id].label;
                if (!l) return null;
                const show = l.levels.includes(level);
                return (
                  <g key={`l-${id}`} className="transition-opacity duration-500" opacity={show ? (selected && selected !== id ? 0.35 : 1) : 0} style={{ transform: `translate(${l.x}px, ${l.y}px) scale(var(--u))` }}>
                    <text textAnchor={l.anchor ?? "middle"} className="font-mono" fontSize="11" letterSpacing="1.2" fill={selected === id ? "var(--color-yellow-400)" : "rgb(243 239 230 / 0.75)"}>
                      {l.text}
                    </text>
                  </g>
                );
              })}

              {/* places */}
              {PLACES.map((p) => {
                const show = p.levels.includes(level);
                const isSite = p.kind === "site";
                return (
                  <g key={p.id} className="transition-opacity duration-500" opacity={show ? 1 : 0} style={{ transform: `translate(${p.x}px, ${p.y}px) scale(var(--u))` }}>
                    {isSite ? (
                      <>
                        <circle r="16" fill="rgb(231 172 0 / 0.12)">
                          <animate attributeName="r" values="8;22;8" dur="2.8s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.9;0;0.9" dur="2.8s" repeatCount="indefinite" />
                        </circle>
                        <circle r="6" fill="var(--color-yellow-400)" />
                        <circle r="10" fill="none" stroke="var(--color-yellow-400)" strokeOpacity="0.6" />
                      </>
                    ) : p.kind === "label" ? null : p.kind === "city" ? (
                      <rect x="-3" y="-3" width="6" height="6" fill="none" stroke="rgb(243 239 230 / 0.5)" />
                    ) : (
                      <>
                        <circle r="5" fill="var(--color-navy-950)" stroke={selected === p.id ? "var(--color-yellow-400)" : "rgb(243 239 230 / 0.85)"} strokeWidth="1.5" />
                        <circle r="1.8" fill={selected === p.id ? "var(--color-yellow-400)" : "rgb(243 239 230 / 0.85)"} />
                      </>
                    )}
                    <text x={p.dx ?? 10} y={p.dy ?? 4} textAnchor={p.anchor ?? "start"} className="font-mono uppercase" fontSize={isSite ? 12 : 10.5} letterSpacing="1.2" fill={isSite || p.kind === "label" ? "var(--color-yellow-400)" : p.kind === "city" ? "rgb(196 201 214 / 0.7)" : "rgb(243 239 230 / 0.9)"} fontWeight={isSite ? 600 : 400}>
                      {p.text}
                    </text>
                    {p.sub ? (
                      <text x={p.dx ?? 10} y={(p.dy ?? 4) - 14} textAnchor={p.anchor ?? "start"} className="font-mono uppercase" fontSize="9" letterSpacing="1.4" fill="rgb(196 201 214 / 0.7)">
                        {p.sub}
                      </text>
                    ) : null}
                  </g>
                );
              })}

              {/* moving head */}
              <g ref={head} opacity={0}>
                <g style={{ transform: "scale(var(--u))" }}>
                  <circle r="11" fill="rgb(231 172 0 / 0.2)" />
                  <circle r="4" fill="var(--color-yellow-400)" />
                </g>
              </g>
            </svg>

            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(4_8_26/0.7)_100%)]" />

            {/* camera levels */}
            <div className="absolute left-3 top-3 flex border border-white/15 bg-navy-950/80 backdrop-blur-sm" role="group" aria-label="Map scale">
              {(["site", "region", "india"] as Level[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={level === l}
                  onClick={() => flyTo(l, selected && destinations.find((d) => d.id === selected)?.level === l ? draw : undefined)}
                  className={`t-micro h-9 px-3 transition-colors sm:px-4 ${level === l ? "bg-paper text-navy-950" : "text-steel-300 hover:text-paper"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p aria-hidden className="t-micro pointer-events-none absolute bottom-3 left-3 text-steel-500">
              Schematic · not to scale
            </p>
            <p aria-hidden className="t-micro pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 text-steel-500">
              <svg width="10" height="13" viewBox="0 0 12 16">
                <path d="M6 0 L11 14 L6 10 L1 14 Z" fill="currentColor" />
              </svg>
              N
            </p>
          </div>
        </div>

        {/* Route planner */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <div className="flex h-full flex-col border border-white/10 bg-navy-950/70">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="t-micro text-steel-500">Route planner</p>
              <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto" role="group" aria-label="Filter by mode">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={mode === m.id}
                    onClick={() => setMode(m.id)}
                    className={`t-micro h-9 shrink-0 border px-3 transition-colors ${mode === m.id ? "border-paper bg-paper text-navy-950" : "border-white/15 text-steel-300 hover:border-white/40 hover:text-paper"}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <ul className="flex-1" aria-label="Destinations">
              {list.map((d) => {
                const on = selected === d.id;
                return (
                  <li key={d.id} className="border-b border-white/10">
                    <button type="button" aria-pressed={on} onClick={() => select(d)} className={`group flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors ${on ? "bg-yellow-400 text-navy-950" : "hover:bg-white/[0.04]"}`}>
                      <Icon name={MODE_ICON[d.mode]} size={20} className={on ? "" : "text-steel-300"} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">{d.name}</span>
                        {d.subtitle ? <span className={`t-micro block ${on ? "text-navy-950/70" : "text-steel-500"}`}>{d.subtitle}</span> : null}
                      </span>
                      <span className={`t-micro ${on ? "" : "text-steel-500"}`}>{d.mode}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-white/10 px-5 py-5" aria-live="polite">
              {dest ? (
                <>
                  <p className="t-micro text-yellow-400">Selected route</p>
                  <p className="t-s mt-2">{dest.name}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                    <Row k="Mode" v={dest.mode} />
                    <Row k="Type" v={dest.kind === "corridor" ? "Highway corridor" : dest.kind === "onsite" ? "On-site" : "Destination"} />
                    <Row k="Distance" v={dest.distanceKm !== null ? `${dest.distanceKm} km` : null} />
                    <Row k="Travel time" v={dest.durationText} />
                  </dl>
                  {dest.note ? <p className="mt-4 text-sm text-steel-300">{dest.note}</p> : null}
                </>
              ) : (
                <p className="text-sm text-steel-300">
                  <span className="t-micro block text-steel-500">No route selected</span>
                  <span className="mt-2 block">Choose a destination to animate its route.</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string | null }) {
  return (
    <div>
      <dt className="t-micro text-steel-500">{k}</dt>
      <dd className={`mt-1 text-[13px] ${v ? "capitalize text-paper" : "t-micro text-steel-300"}`}>{v ?? "Coming soon"}</dd>
    </div>
  );
}
