"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Destination, Mode } from "@/lib/content/types";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useIsoLayoutEffect, useMotion } from "@/lib/motion/hooks";
import { applyRouteProgress } from "@/lib/motion/route";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ESTABLISH, MAP, ROUTES, SITE, VIEWS, type Level } from "./mapGeometry";

const MODES: { id: Mode | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "road", label: "Road" },
  { id: "rail", label: "Rail" },
  { id: "air", label: "Air" },
  { id: "port", label: "Port" },
];
const MODE_ICON = { road: "road", rail: "rail", air: "air", port: "port" } as const;

/** Destinations close enough to read best on the zoomed site view */
const SITE_LEVEL = new Set(["sidings", "dodbele"]);
const levelFor = (id: string): Level => (SITE_LEVEL.has(id) ? "site" : "map");

/* Mode = colour + line style (never colour alone). Lengths are px × --u (user units per px). */
const MODE_COLOR: Record<Mode, string> = {
  road: "var(--color-indigo-700)",
  rail: "var(--color-blue-500)",
  air: "var(--color-orange-600)",
  port: "var(--color-green-700)",
};
const u = (n: number) => `calc(var(--u) * ${n}px)`;
const modeStroke = (mode: Mode, w: number): CSSProperties => {
  const base: CSSProperties = { stroke: MODE_COLOR[mode], strokeWidth: u(w), fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  if (mode === "air") return { ...base, strokeDasharray: `${u(0.1)} ${u(w * 2.2)}`, strokeWidth: u(w * 1.5) };
  if (mode === "port") return { ...base, strokeDasharray: `${u(w * 4)} ${u(w * 2.4)}`, strokeLinecap: "butt" };
  if (mode === "rail") return { ...base, strokeDasharray: `${u(w * 3)} ${u(w * 1.4)}`, strokeLinecap: "butt" };
  return base;
};
const casing = (w: number): CSSProperties => ({ stroke: "white", strokeWidth: u(w), fill: "none", strokeLinecap: "round", strokeLinejoin: "round", opacity: 0.9 });

const distanceText = (d: Destination) => (d.distanceKm !== null ? `~${d.distanceKm} km` : d.kind === "onsite" ? "On site" : d.kind === "corridor" ? "Adjacent corridor" : "");

/** §07 — Solutions · Connectivity, on the client's own location map. */
export function ConnectivityMap({ destinations }: { destinations: Destination[] }) {
  const section = useRef<HTMLElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const mask = useRef<SVGPathElement>(null);
  const measure = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const vb = useRef<[number, number, number, number]>([...VIEWS.map]);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const cam = useRef<gsap.core.Tween | null>(null);
  const [level, setLevel] = useState<Level>("map");
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
      // any interaction hands the camera over from the scroll-driven establishing shot
      cam.current?.scrollTrigger?.kill();
      cam.current?.kill();
      cam.current = null;
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
    gsap.to(o, { p: 1, duration: 1.4, ease: "power2.inOut", onUpdate: () => applyRouteProgress(o.p, els) });
  }, []);

  const select = (id: string) => {
    if (selected === id) {
      setSelected(null);
      return;
    }
    setSelected(id);
    flyTo(levelFor(id), draw);
  };

  useEffect(() => {
    if (!selected) applyRouteProgress(0, { path: measure.current, trail: mask.current, head: head.current });
  }, [selected]);

  // M8 — Intro: (1) an establishing shot pulls back from the site to the region as the
  // map scrolls in; (2) a gold trace draws each route in turn, and the route settles
  // in beneath it. Any click hands the camera to the user (see flyTo).
  useMotion(section, (mm) => {
    mm.add(MQ.motion, () => {
      const o = { x: ESTABLISH[0], y: ESTABLISH[1], w: ESTABLISH[2], h: ESTABLISH[3] };
      vb.current = [...ESTABLISH];
      applyView();
      cam.current = gsap.to(o, {
        x: VIEWS.map[0],
        y: VIEWS.map[1],
        w: VIEWS.map[2],
        h: VIEWS.map[3],
        ease: "none",
        onUpdate: () => {
          vb.current = [o.x, o.y, o.w, o.h];
          applyView();
        },
        scrollTrigger: { trigger: svg.current, start: "top 90%", end: "center 55%", scrub: 0.6 },
      });

      const routes = gsap.utils.toArray<SVGGElement>("[data-base-route]", svg.current);
      const traces = gsap.utils.toArray<SVGPathElement>("[data-trace]", svg.current);
      gsap.set(routes, { opacity: 0 });
      gsap.set(traces, { strokeDashoffset: 1, opacity: 1 });
      const draw = gsap.timeline({ paused: true });
      traces.forEach((t, i) => {
        draw
          .to(t, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, i * 0.28)
          .to(routes[i], { opacity: 1, duration: 0.6, clearProps: "opacity" }, i * 0.28 + 0.6)
          .to(t, { opacity: 0, duration: 0.6 }, i * 0.28 + 0.8);
      });
      const st = ScrollTrigger.create({ trigger: svg.current, start: "top 55%", once: true, onEnter: () => draw.play() });
      return () => {
        st.kill();
        draw.kill();
        vb.current = [...VIEWS.map];
        applyView();
      };
    });
  }, [applyView]);

  const activeGeom = selected ? ROUTES[selected] : null;
  const shown = destinations.filter((d) => ROUTES[d.id] && (mode === "all" || d.mode === mode));

  return (
    <section ref={section} id="connectivity" data-stage="understand" aria-labelledby="connectivity-title" className="relative overflow-hidden bg-porcelain section-pad">
      <div className="shell grid-12 gap-y-8">
        <SectionHeader
          className="col-span-4 sm:col-span-8 lg:col-span-7"
          index="07"
          chapter="Solutions · Connectivity"
          id="connectivity-title"
          lines={["Road. Rail.", "Air. *Ports.*"]}
          body="Located in the northwest quadrant of Bengaluru, adjacent to the STRR (NH 648) — the only facility of its kind in the region. Select a destination to trace its route."
        />
        <ul className="col-span-4 self-end sm:col-span-8 lg:col-span-4 lg:col-start-9" aria-label="Line legend">
          {(["road", "rail", "air", "port"] as Mode[]).map((m) => (
            <li key={m} className="flex items-center gap-4 border-b border-ink/10 py-2.5 first:border-t">
              <svg width="56" height="10" aria-hidden className="shrink-0" style={{ ["--u" as string]: 1 }}>
                <path d="M2 5 H54" style={modeStroke(m, 3)} />
              </svg>
              <span className="t-micro text-ink">{m}</span>
              <span className="t-micro ml-auto text-right text-steel-500">
                {m === "road" ? "NH 648 · NH 48 · STRR" : m === "rail" ? "6 sidings · Dodbele 3.5 km" : m === "air" ? "Kempegowda Int'l · 55 km" : "Mangalore · Chennai"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="shell mt-12 grid-12 gap-y-6 lg:mt-14">
        {/* Map — the client's own location map with the route overlay */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <div className="relative overflow-hidden rounded-[2px] bg-paper-2 shadow-[var(--shadow-card)]" style={{ aspectRatio: `${MAP.w} / ${MAP.h}` }}>
            <svg
              ref={svg}
              className="absolute inset-0 h-full w-full"
              viewBox={VIEWS.map.join(" ")}
              preserveAspectRatio="xMidYMid slice"
              role="img"
              aria-label={`Location map of Path Logicity at Dobbaspet, northwest Bengaluru${dest ? `, showing the route to ${dest.name}` : ""}`}
              style={{ ["--u" as string]: 1 }}
            >
              <defs>
                <mask id="route-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={MAP.w} height={MAP.h}>
                  <path
                    ref={mask}
                    d={activeGeom?.d ?? "M 0 0"}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1}
                    stroke="white"
                    fill="none"
                    style={{ strokeWidth: u(26) }}
                  />
                </mask>
              </defs>

              <image href={MAP.src} x="0" y="0" width={MAP.w} height={MAP.h} preserveAspectRatio="none" />

              {/* base routes */}
              {shown.map((d) => {
                const r = ROUTES[d.id];
                const dim = selected !== null && selected !== d.id;
                return (
                  <g key={d.id}>
                    <g data-base-route className="transition-opacity duration-500" opacity={dim ? 0.12 : selected ? 0 : 0.55}>
                      <path d={r.d} style={casing(5)} />
                      <path d={r.d} style={modeStroke(r.mode, 2.2)} />
                    </g>
                    {/* M8 intro trace — drawn once, then fades */}
                    <path data-trace d={r.d.split(" M ")[0]} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1} opacity={0} fill="none" stroke="var(--color-yellow-400)" strokeLinecap="round" style={{ strokeWidth: u(3.5) }} />
                  </g>
                );
              })}

              {/* active route, revealed by the drawing mask */}
              {activeGeom ? (
                <g mask="url(#route-mask)">
                  <path d={activeGeom.d} style={casing(10)} />
                  <path d={activeGeom.d} style={modeStroke(activeGeom.mode, 4.5)} />
                </g>
              ) : null}
              <path ref={measure} d={activeGeom ? activeGeom.d.split(" M ")[0] : "M 0 0"} fill="none" stroke="none" />

              {/* the site */}
              <g style={{ transform: `translate(${SITE.x}px, ${SITE.y}px) scale(var(--u))` }} aria-hidden>
                <circle r="16" fill="rgb(231 172 0 / 0.25)">
                  <animate attributeName="r" values="8;26;8" dur="2.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="2.8s" repeatCount="indefinite" />
                </circle>
                <circle r="7" fill="var(--color-yellow-400)" stroke="white" strokeWidth="2.5" />
              </g>

              {/* destination pins */}
              {shown.map((d) => {
                const r = ROUTES[d.id];
                if (d.id === "sidings") return null;
                const on = selected === d.id;
                return (
                  <g
                    key={`pin-${d.id}`}
                    className="cursor-pointer transition-opacity duration-500"
                    opacity={selected && !on ? 0.35 : 1}
                    style={{ transform: `translate(${r.end.x}px, ${r.end.y}px) scale(var(--u))` }}
                    onClick={() => select(d.id)}
                  >
                    <circle r="14" fill="transparent" />
                    <circle r={on ? 8 : 6} fill={on ? "var(--color-yellow-400)" : MODE_COLOR[d.mode]} stroke="white" strokeWidth="2.5" />
                  </g>
                );
              })}

              {/* callout for the selected destination */}
              {activeGeom && dest ? (
                <Callout x={activeGeom.end.x} y={activeGeom.end.y} side={activeGeom.side ?? "right"} title={dest.name} meta={`${distanceText(dest)}${activeGeom.offMap ? " · beyond map" : ""}`} />
              ) : null}

              {/* moving head */}
              <g ref={head} opacity={0}>
                <g style={{ transform: "scale(var(--u))" }}>
                  <circle r="13" fill="rgb(231 172 0 / 0.3)" />
                  <circle r="6" fill="var(--color-yellow-400)" stroke="white" strokeWidth="2" />
                </g>
              </g>
            </svg>

            {/* camera levels */}
            <div className="absolute right-3 top-3 flex border border-ink/15 bg-paper/95 shadow-sm" role="group" aria-label="Map zoom">
              {(["map", "site"] as Level[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={level === l}
                  onClick={() => flyTo(l, selected && levelFor(selected) === l ? draw : undefined)}
                  className={`t-micro h-9 px-3 transition-colors sm:px-4 ${level === l ? "bg-indigo-700 text-paper" : "text-steel-700 hover:text-ink"}`}
                >
                  {l === "map" ? "Region" : "Site"}
                </button>
              ))}
            </div>
            <p aria-hidden className="t-micro pointer-events-none absolute bottom-3 right-3 bg-paper/90 px-2 py-1 text-steel-500">
              Map · not to scale
            </p>
          </div>
        </div>

        {/* Route planner */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-5">
          <div className="card flex h-full flex-col overflow-hidden">
            <div className="border-b border-ink/10 px-5 py-4">
              <p className="t-micro text-indigo-700">Route planner</p>
              <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto" role="group" aria-label="Filter by mode">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={mode === m.id}
                    onClick={() => setMode(m.id)}
                    className={`t-micro h-9 shrink-0 border px-3 transition-colors ${mode === m.id ? "border-indigo-700 bg-indigo-700 text-paper" : "border-ink/15 bg-paper text-steel-700 hover:border-ink/40 hover:text-ink"}`}
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
                  <li key={d.id} className="border-b border-ink/10">
                    <button type="button" aria-pressed={on} onClick={() => select(d.id)} className={`group flex w-full items-center gap-4 px-5 py-3 text-left transition-colors ${on ? "bg-yellow-400 text-ink" : "hover:bg-porcelain"}`}>
                      <Icon name={MODE_ICON[d.mode]} size={20} className={on ? "" : "text-indigo-700"} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] font-bold text-ink">{d.name}</span>
                        {d.subtitle ? <span className={`block text-[0.8125rem] ${on ? "text-ink/75" : "text-steel-500"}`}>{d.subtitle}</span> : null}
                      </span>
                      <span className={`tnum shrink-0 text-[0.9375rem] font-bold ${on ? "text-ink" : "text-indigo-700"}`}>{d.distanceKm !== null ? `${d.distanceKm} km` : ""}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-ink/10 bg-porcelain px-5 py-5" aria-live="polite">
              {dest ? (
                <>
                  <p className="t-micro text-indigo-700">Selected route</p>
                  <p className="t-s mt-2 text-ink">{dest.name}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                    <Row k="Mode" v={dest.mode} />
                    <Row k="Type" v={dest.kind === "corridor" ? "Highway corridor" : dest.kind === "onsite" ? "On-site" : "Destination"} />
                    <Row k="Distance" v={dest.distanceKm !== null ? `~${dest.distanceKm} km` : null} />
                    <Row k="Travel time" v={dest.durationText} />
                  </dl>
                  {dest.note ? <p className="mt-4 text-sm text-steel-700">{dest.note}</p> : null}
                </>
              ) : (
                <p className="text-[0.9375rem] text-steel-700">
                  <span className="t-micro block text-steel-500">No route selected</span>
                  <span className="mt-2 block">Choose a destination to trace its route on the map.</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Map callout — fixed pixel size at any zoom (scaled by --u). */
function Callout({ x, y, side, title, meta }: { x: number; y: number; side: "left" | "right"; title: string; meta: string }) {
  const w = Math.max(title.length * 7.4, meta.length * 6.6) + 28;
  const dx = side === "right" ? 16 : -16 - w;
  return (
    <g aria-hidden className="pointer-events-none [animation:fade-in_.5s_ease-out_both]" style={{ transform: `translate(${x}px, ${y}px) scale(var(--u))` }}>
      <g transform={`translate(${dx} -26)`}>
        <rect width={w} height="52" fill="white" stroke="var(--color-indigo-700)" strokeOpacity="0.2" />
        <rect width="3" height="52" fill="var(--color-yellow-400)" />
        <text x="14" y="22" fontSize="13" fontWeight="700" fill="var(--color-ink)" className="font-sans">
          {title}
        </text>
        <text x="14" y="40" fontSize="11.5" fontWeight="600" fill="var(--color-blue-500)" className="font-sans">
          {meta}
        </text>
      </g>
    </g>
  );
}

function Row({ k, v }: { k: string; v: string | null }) {
  return (
    <div>
      <dt className="t-micro text-steel-500">{k}</dt>
      <dd className={`mt-1 text-[0.875rem] ${v ? "font-semibold capitalize text-ink" : "t-micro text-steel-500"}`}>{v ?? "Coming soon"}</dd>
    </div>
  );
}
