"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Zone } from "@/lib/content/types";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { applyRouteProgress } from "@/lib/motion/route";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ArrowLink } from "@/components/ui/Button";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PlanSvg } from "./PlanSvg";
import { zoneGeom } from "./planGeometry";

const COLS = "ABCDEFGHIJ".split("");

/** §03 — Explore Path Logicity: interactive master plan. */
export function MasterPlan({ zones }: { zones: Zone[] }) {
  const section = useRef<HTMLElement>(null);
  const planWrap = useRef<HTMLDivElement>(null);
  const routePath = useRef<SVGPathElement>(null);
  const routeTrail = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  /** "plan" = interactive schematic · "official" = the client's official master plan drawing */
  const [view, setView] = useState<"plan" | "official">("official");
  const names = Object.fromEntries(zones.map((z) => [z.id, z.name]));
  const zone = zones.find((z) => z.id === active) ?? null;
  const routeD = active ? zoneGeom[active].route : "M 632 600 L 632 600";

  // Draw the route from the gate to the selected zone
  useEffect(() => {
    const els = { path: routePath.current, trail: routeTrail.current, head: head.current };
    if (!active) {
      applyRouteProgress(0, els);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const o = { p: 0 };
    applyRouteProgress(0, els);
    if (reduce) {
      applyRouteProgress(1, els);
      return;
    }
    const tw = gsap.to(o, { p: 1, duration: 1.2, ease: "power2.inOut", onUpdate: () => applyRouteProgress(o.p, els) });
    return () => {
      tw.kill();
    };
  }, [active]);

  // "System boot": zones light up in sequence the first time the plan is seen
  useMotion(section, (mm) => {
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(planWrap);
      gsap.from(q("[data-zone]"), {
        opacity: 0,
        duration: 0.8,
        stagger: 0.18,
        ease: "power2.out",
        clearProps: "opacity",
        scrollTrigger: { trigger: planWrap.current, start: "top 70%", once: true },
      });
    });
  });

  const select = (id: string) => {
    setView("plan");
    setActive((a) => (a === id ? null : id));
  };

  return (
    <section ref={section} id="explore" data-stage="explore" aria-labelledby="explore-title" className="relative overflow-hidden bg-stone section-pad">
      <div className="shell relative grid-12 gap-y-8">
        <SectionHeader
          className="col-span-4 sm:col-span-8 lg:col-span-7"
          index="03"
          chapter="Explore Path Logicity"
          id="explore-title"
          lines={["Explore the", "*ecosystem*"]}
          body="Warehousing, rail, dry port, commercial, yards, roads and green infrastructure — one connected plan. Select a zone to explore it."
        />
        <div className="col-span-4 self-end sm:col-span-8 lg:col-span-4 lg:col-start-9">
          <div className="border-l-2 border-yellow-400 pl-5">
            <p className="t-micro text-indigo-700">Interactive plan · official drawing</p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel-700">Explore the zones on the interactive schematic, or switch to the official master plan drawing.</p>
            <div role="group" aria-label="Plan view" className="mt-4 inline-flex border border-ink/15 bg-paper p-1">
              {(["plan", "official"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className={`t-micro h-9 px-4 transition-colors ${view === v ? "bg-indigo-700 text-paper" : "text-steel-700 hover:text-ink"}`}
                >
                  {v === "plan" ? "Interactive zones" : "Official master plan"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="shell relative mt-14 grid-12 gap-y-6 lg:mt-20">
        {/* Zone index — the accessible primary control */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <p className="t-micro hidden text-steel-500 lg:block">Zones · {zones.length}</p>
          <ul className="no-scrollbar -mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)] pb-1 lg:mx-0 lg:mt-4 lg:block lg:space-y-0 lg:overflow-visible lg:border-t lg:border-ink/10 lg:px-0">
            {zones.map((z) => {
              const on = active === z.id;
              const hv = hover === z.id;
              return (
                <li key={z.id} className="shrink-0 lg:border-b lg:border-ink/10">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => select(z.id)}
                    onMouseEnter={() => setHover(z.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(z.id)}
                    onBlur={() => setHover(null)}
                    className={`group flex h-11 w-full items-center gap-3 border px-4 text-left transition-colors duration-300 lg:h-auto lg:border-0 lg:px-0 lg:py-4 ${
                      on ? "border-yellow-400 bg-yellow-400 text-ink lg:bg-transparent lg:text-indigo-700" : "border-ink/15 bg-paper text-ink/80 hover:text-indigo-700 lg:bg-transparent"
                    }`}
                  >
                    <span className={`t-micro ${on ? "" : "text-steel-500"} lg:w-7`}>{z.index}</span>
                    <span className="whitespace-nowrap text-[0.875rem] font-bold lg:text-[0.9375rem]">{z.name}</span>
                    <span
                      aria-hidden
                      className={`ml-auto hidden h-px transition-all duration-500 ease-[var(--ease-out-expo)] lg:block ${on || hv ? "w-10 bg-yellow-400" : "w-3 bg-ink/25"}`}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Plan */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-9">
          <div ref={planWrap} className="card relative overflow-hidden">
            {/* grid references */}
            <div aria-hidden className={`t-micro pointer-events-none absolute inset-x-0 top-0 hidden h-7 grid-cols-10 border-b border-ink/10 text-steel-500 ${view === "official" ? "" : "sm:grid"}`}>
              {COLS.map((c) => (
                <span key={c} className="flex items-center justify-center border-l border-ink/5 first:border-l-0">
                  {c}
                </span>
              ))}
            </div>
            <div aria-hidden className={`t-micro pointer-events-none absolute bottom-0 left-0 top-7 hidden w-7 flex-col border-r border-ink/10 text-steel-500 ${view === "official" ? "" : "sm:flex"}`}>
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="flex flex-1 items-center justify-center">
                  {i + 1}
                </span>
              ))}
            </div>

            {view === "official" ? (
              <figure className="relative">
                <Image
                  src="/client/image-1731136566206.webp"
                  alt="Official Path Logicity master plan: warehouses, surface parking, commercial areas, open warehouses, CFS shed, utilities, transit warehouse and the railway terminal, with access from the STRR / NH 648 trumpet"
                  width={2774}
                  height={1583}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  className="block h-auto w-full"
                />
                <figcaption className="t-micro border-t border-ink/10 px-4 py-3 text-steel-500">Official master plan · Path Logicity, Dobbaspet</figcaption>
              </figure>
            ) : null}
            <div className={`p-3 sm:pl-10 sm:pt-10 sm:pr-4 sm:pb-12 ${view === "official" ? "hidden" : ""}`}>
              <PlanSvg
                interactive
                active={active}
                hover={hover}
                names={names}
                onEnter={setHover}
                onLeave={() => setHover(null)}
                onSelect={select}
                routeRef={routePath}
                routeTrailRef={routeTrail}
                headRef={head}
                routeD={routeD}
              />
            </div>

            {/* hover tag */}
            <div aria-hidden className={`pointer-events-none absolute left-10 top-10 hidden ${view === "official" ? "" : "sm:block"}`}>
              <p className={`t-micro transition-opacity duration-300 ${hover || active ? "opacity-100" : "opacity-0"}`}>
                <span className="text-indigo-700">Zone {zones.find((z) => z.id === (hover ?? active))?.index ?? "—"}</span>
                <span className="text-steel-700"> / {names[hover ?? active ?? ""] ?? ""} / Grid {zoneGeom[hover ?? active ?? "roads"]?.grid}</span>
              </p>
            </div>

            {/* legend + north */}
            <div aria-hidden className={`pointer-events-none absolute bottom-3 left-10 right-4 hidden items-center justify-between ${view === "official" ? "" : "sm:flex"}`}>
              <p className="t-micro text-steel-500">
                <span className="mr-2 inline-block h-2.5 w-2.5 border border-ink align-middle" /> Main gate
                <span className="ml-5 mr-2 inline-block h-0.5 w-5 bg-indigo-700 align-middle" /> Route to zone
              </p>
              <p className="t-micro flex items-center gap-2 text-steel-500">
                <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden>
                  <path d="M6 0 L11 14 L6 10 L1 14 Z" fill="currentColor" />
                </svg>
                N · Schematic
              </p>
            </div>

            {/* Detail panel (desktop overlay) */}
            <ZonePanel zone={zone} onClose={() => setActive(null)} className={`hidden lg:absolute lg:bottom-12 lg:right-4 lg:w-[340px] ${view === "official" ? "" : "lg:block"}`} />
          </div>

          {/* Detail panel (mobile/tablet, inline) */}
          <ZonePanel zone={zone} onClose={() => setActive(null)} className={`mt-4 lg:hidden ${view === "official" ? "hidden" : ""}`} />
        </div>
      </div>
    </section>
  );
}

function ZonePanel({ zone, onClose, className = "" }: { zone: Zone | null; onClose: () => void; className?: string }) {
  if (!zone) {
    return (
      <div className={`border border-ink/10 bg-paper/95 p-6 shadow-[0_18px_40px_-20px_rgb(26_28_70/0.3)] backdrop-blur-md ${className}`}>
        <p className="t-micro text-indigo-700">Interactive plan</p>
        <p className="t-s mt-3 max-w-[24ch] text-ink">Seven zones. One connected ecosystem.</p>
        <p className="mt-3 text-sm text-steel-700">Select a zone on the plan or from the index.</p>
      </div>
    );
  }
  return (
    <div key={zone.id} className={`relative border border-ink/10 bg-paper shadow-[0_18px_40px_-20px_rgb(26_28_70/0.3)] [animation:wipe-in_.6s_var(--ease-out-expo)_both] ${className}`} aria-live="polite">
      <span aria-hidden className="absolute -top-px left-0 h-px w-16 bg-yellow-400" />
      <div className="p-6">
        <div className="flex items-start justify-between">
          <p className="t-micro text-indigo-700">
            Zone {zone.index} <span className="text-steel-500">/ Grid {zoneGeom[zone.id]?.grid}</span>
          </p>
          <button type="button" onClick={onClose} aria-label="Close zone details" className="-m-2 p-2 text-steel-500 hover:text-ink">
            <Icon name="x" size={16} />
          </button>
        </div>
        <h3 className="t-m mt-3 text-ink">{zone.name}</h3>
        <p className="mt-2 text-[0.9375rem] text-steel-700">{zone.short}</p>
        {zone.facts.length ? (
          <ul className="mt-5 space-y-2.5 border-t border-ink/10 pt-5">
            {zone.facts.map((f) => (
              <li key={f} className="flex gap-3 text-[0.9375rem] leading-snug text-ink">
                <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-yellow-400" />
                {f}
              </li>
            ))}
          </ul>
        ) : null}
        {zone.pending ? (
          <p className="mt-4">
            <ContentSlot>{zone.pending}</ContentSlot>
          </p>
        ) : null}
      </div>
      <AssetSlot slot={zone.media.slot} spec={zone.media.spec} ratio="16/7" compact variant={2} label={zone.media.alt} src={zone.media.src} focus="center" sizes="(min-width: 1024px) 30vw, 100vw" />
      <div className="px-6 py-3">
        <ArrowLink href="/site-tour">Explore the site</ArrowLink>
      </div>
    </div>
  );
}
