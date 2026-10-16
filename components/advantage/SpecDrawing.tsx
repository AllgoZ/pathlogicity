"use client";

import { useRef, useState } from "react";
import type { Homepage } from "@/lib/content";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { boxIn, useLinks } from "@/lib/motion/useLinks";
import { ArrowLink } from "@/components/ui/Button";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { Metric } from "@/components/ui/Metric";
import { Reveal } from "@/components/ui/Reveal";
import { OfficialPlanMap, useZoneTour } from "@/components/master-plan/OfficialPlanMap";

/**
 * Where each figure sits on the OFFICIAL master plan, in the drawing's own pixel space (2774 × 1583).
 * Every point was checked to fall inside the zone it names (the legend → zone mapping is pending client confirmation).
 */
const ANCHORS: Record<string, { x: number; y: number; zone: string | null; label: string }> = {
  acres: { x: 1380, y: 760, zone: null, label: "The site" },
  warehousing: { x: 1484, y: 573, zone: "warehousing", label: "Warehousing" },
  commercial: { x: 637, y: 1029, zone: "commercial", label: "Commercial" },
  rail: { x: 2175, y: 904, zone: "rail", label: "Rail terminal" },
  sidings: { x: 2330, y: 760, zone: "rail", label: "Railway sidings" },
  bonded: { x: 2228, y: 1141, zone: "icd", label: "Customs-bonded · CFS" },
};
/** map zone → the figure it belongs to (two-way hover) */
const ZONE_TO_ID: Record<string, string> = { warehousing: "warehousing", commercial: "commercial", rail: "rail", icd: "bonded" };
const MARKERS = Object.entries(ANCHORS).map(([id, a]) => ({ id, x: a.x, y: a.y }));
/** the order the figures light up in the first-view tour */
const TOUR = ["acres", "warehousing", "commercial", "rail", "sidings", "bonded"];
const LEFT = ["acres", "warehousing", "commercial"];
const RIGHT = ["rail", "sidings", "bonded"];

/** §06b — Project at a glance as an architectural specification drawing. */
export function SpecDrawing({ glance }: { glance: Homepage["glance"] }) {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dots = useRef<Record<string, HTMLSpanElement | null>>({});
  const anchors = useRef<Record<string, HTMLElement | null>>({});
  const [hover, setHover] = useState<string | null>(null);
  // first view: after the leader lines draw, the figures light up in turn (stops for good on the first hover / focus)
  const [tour, stopTour] = useZoneTour(stage, TOUR, { start: 2000, step: 1500 });
  const active = hover ?? tour;
  const setActive = (id: string | null) => {
    if (id) stopTour();
    setHover(id);
  };
  const byId = Object.fromEntries(glance.map((g) => [g.id, g]));
  const phase1 = byId.phase1;
  const activeZone = active ? ANCHORS[active]?.zone ?? null : null;

  const { paths, w, h } = useLinks(stage, (c) =>
    [...LEFT, ...RIGHT].map((id) => {
      const a = boxIn(dots.current[id], c);
      const b = boxIn(anchors.current[id], c);
      if (!a || !b) return "";
      const dir = LEFT.includes(id) ? 1 : -1;
      const x1 = a.cx;
      const elbow = x1 + dir * 36;
      return `M ${x1} ${a.cy} L ${elbow} ${a.cy} L ${b.cx} ${b.cy}`;
    }),
  );

  useMotion(section, (mm) => {
    if (!paths.length) return;
    mm.add(MQ.desktop, () => {
      const q = gsap.utils.selector(section);
      gsap.from(q("[data-leader]"), {
        strokeDashoffset: 1,
        duration: 1,
        stagger: 0.12,
        ease: "power2.inOut",
        scrollTrigger: { trigger: stage.current, start: "top 60%", once: true },
      });
    });
  }, [paths.length]);

  const callout = (id: string, side: "l" | "r") => {
    const g = byId[id];
    const on = active === id;
    return (
      <li key={id}>
        <button
          type="button"
          onMouseEnter={() => setActive(id)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(id)}
          onBlur={() => setActive(null)}
          aria-pressed={on}
          className={`group relative block w-full py-5 text-left lg:py-6 ${side === "r" ? "lg:pl-10" : "lg:pr-10"}`}
        >
          <span
            ref={(el) => {
              dots.current[id] = el;
            }}
            aria-hidden
            className={`absolute top-9 hidden h-2 w-2 rounded-full transition-colors duration-300 lg:block ${side === "r" ? "left-0" : "right-0"} ${on ? "bg-yellow-400" : "bg-indigo-700/60"}`}
          />
          <Metric data={g} size="m" valueClassName={on ? "text-indigo-700" : "text-ink"} className={`transition-opacity duration-300 ${active && !on ? "opacity-40" : ""}`} />
        </button>
      </li>
    );
  };

  return (
    <div ref={section} id="at-a-glance" className="relative bg-stone section-pad">
      <div className="shell grid-12 gap-y-8">
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <p className="t-label text-ink">
            <span data-idx className="text-indigo-700">06.1 /</span> Project at a glance
          </p>
          <h2 className="t-l mt-5 text-ink">
            Scale,
            <br />
            <em>specified.</em>
          </h2>
        </div>
        <p className="t-body-l col-span-4 self-end text-steel-700 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          Every number below is part of one integrated plan — hover a figure to locate it.
        </p>
      </div>

      <div ref={stage} className="shell relative mt-14 grid-12 gap-y-6 lg:mt-20">
        {w ? (
          <svg aria-hidden width={w} height={h} className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block" fill="none">
            {paths.map((d, i) => {
              const id = [...LEFT, ...RIGHT][i];
              return (
                <path
                  key={id}
                  data-leader
                  d={d}
                  pathLength={1}
                  strokeDasharray="1 1"
                  stroke={active === id ? "var(--color-indigo-700)" : "rgb(26 28 70 / 0.3)"}
                  strokeWidth={active === id ? 1.5 : 1}
                  className="transition-[stroke] duration-300"
                />
              );
            })}
          </svg>
        ) : null}

        <ul className="order-2 col-span-2 sm:col-span-4 lg:order-1 lg:col-span-3 lg:border-r lg:border-ink/10">{LEFT.map((id) => callout(id, "l"))}</ul>

        <div className="order-1 col-span-4 sm:col-span-8 lg:order-2 lg:col-span-6">
          <OfficialPlanMap
            zone={activeZone}
            tag={active ? ANCHORS[active].label : null}
            markers={MARKERS}
            activeMarker={active}
            markerRef={(id, el) => {
              anchors.current[id] = el;
            }}
            interactive
            onZoneEnter={(z) => ZONE_TO_ID[z] && setActive(ZONE_TO_ID[z])}
            onZoneLeave={() => setHover(null)}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <p className="t-micro mt-2 text-center text-steel-500">Official master plan · Path Logicity, Dobbaspet</p>
        </div>

        <ul className="order-3 col-span-2 sm:col-span-4 lg:col-span-3 lg:border-l lg:border-ink/10">{RIGHT.map((id) => callout(id, "r"))}</ul>
      </div>

      {/* Phase 1 band */}
      <Reveal className="shell mt-16 lg:mt-24">
        <div className="grid-12 items-end gap-y-6 border-t border-ink/15 pt-10">
          <div className="col-span-4 sm:col-span-4 lg:col-span-5">
            <p className="t-micro text-indigo-700">Phase 1</p>
            <Metric data={{ ...phase1, unit: "Acres" }} size="xl" showLabel={false} className="mt-4" />
          </div>
          <p className="t-s col-span-4 max-w-[26ch] text-ink sm:col-span-4 lg:col-span-4">{phase1.label}.</p>
          <div className="col-span-4 flex flex-col items-start gap-4 sm:col-span-8 lg:col-span-3 lg:items-end">
            <ContentSlot>Phase 1 boundary — to be supplied</ContentSlot>
            <ArrowLink href="/logicity-advantage">Explore the advantage</ArrowLink>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
