"use client";

import { useRef, useState } from "react";
import type { Homepage } from "@/lib/content";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { boxIn, useLinks } from "@/lib/motion/useLinks";
import { ArrowLink } from "@/components/ui/Button";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { Metric, PINWHEEL_TEXT } from "@/components/ui/Metric";
import { Reveal } from "@/components/ui/Reveal";
import { PlanSvg } from "@/components/master-plan/PlanSvg";

/** Oblique projection of the schematic plan (x' = .9x − .55y + 360, y' = .32x + .6y + 20) */
const AXO = "matrix(0.9 0.32 -0.55 0.6 360 20)";
const ANCHORS: Record<string, { x: number; y: number; zone: string | null }> = {
  acres: { x: 500, y: 330, zone: null },
  warehousing: { x: 365, y: 336, zone: "warehousing" },
  commercial: { x: 780, y: 505, zone: "commercial" },
  rail: { x: 640, y: 125, zone: "rail" },
  sidings: { x: 250, y: 126, zone: "rail" },
  bonded: { x: 795, y: 245, zone: "icd" },
};
const LEFT = ["acres", "warehousing", "commercial"];
const RIGHT = ["rail", "sidings", "bonded"];

/** §06b — Project at a glance as an architectural specification drawing. */
export function SpecDrawing({ glance }: { glance: Homepage["glance"] }) {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dots = useRef<Record<string, HTMLSpanElement | null>>({});
  const anchors = useRef<Record<string, SVGCircleElement | null>>({});
  const [active, setActive] = useState<string | null>(null);
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
            className={`absolute top-9 hidden h-2 w-2 rounded-full transition-colors duration-300 lg:block ${side === "r" ? "left-0" : "right-0"} ${on ? "bg-yellow-400" : "bg-blue-500/60"}`}
          />
          <Metric data={g} size="m" valueClassName={on ? "text-indigo-700" : "text-ink"} className={`transition-opacity duration-300 ${active && !on ? "opacity-40" : ""}`} />
        </button>
      </li>
    );
  };

  return (
    <div ref={section} id="at-a-glance" className="relative bg-canvas-2 section-pad">
      <div className="shell grid-12 gap-y-8">
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <p className="t-label text-ink">
            <span className="text-blue-500">06.1 /</span> Project at a glance
          </p>
          <h3 className="t-l mt-5 text-ink">
            Scale,
            <br />
            specified.
          </h3>
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
                  stroke={active === id ? "var(--color-blue-500)" : "rgb(26 28 70 / 0.3)"}
                  strokeWidth={active === id ? 1.5 : 1}
                  className="transition-[stroke] duration-300"
                />
              );
            })}
          </svg>
        ) : null}

        <ul className="order-2 col-span-2 sm:col-span-4 lg:order-1 lg:col-span-3 lg:border-r lg:border-ink/10">{LEFT.map((id) => callout(id, "l"))}</ul>

        <div className="order-1 col-span-4 sm:col-span-8 lg:order-2 lg:col-span-6">
          <svg viewBox="0 0 1270 760" className="block h-auto w-full" fill="none" role="img" aria-label="Oblique view of the illustrative master plan">
            <g transform={AXO}>
              <PlanSvg nested showGrid={false} active={activeZone} />
              {Object.entries(ANCHORS).map(([id, a]) => (
                <g key={id}>
                  <circle
                    ref={(el) => {
                      anchors.current[id] = el;
                    }}
                    cx={a.x}
                    cy={a.y}
                    r="5"
                    fill={active === id ? "var(--color-yellow-400)" : "var(--color-indigo-700)"}
                  />
                  <circle cx={a.x} cy={a.y} r="12" stroke={active === id ? "var(--color-yellow-400)" : "rgb(32 31 133 / 0.3)"} strokeWidth={active === id ? 2 : 1} />
                </g>
              ))}
            </g>
          </svg>
          <p className="t-micro mt-2 text-center text-steel-500">Illustrative oblique · not to scale</p>
        </div>

        <ul className="order-3 col-span-2 sm:col-span-4 lg:col-span-3 lg:border-l lg:border-ink/10">{RIGHT.map((id) => callout(id, "r"))}</ul>
      </div>

      {/* Phase 1 band */}
      <Reveal className="shell mt-16 lg:mt-24">
        <div className="grid-12 items-end gap-y-6 border-t border-ink/15 pt-10">
          <div className="col-span-4 sm:col-span-4 lg:col-span-5">
            <p className="t-micro text-blue-500">Phase 1</p>
            <Metric data={{ ...phase1, unit: "Acres" }} size="xl" showLabel={false} valueClassName={PINWHEEL_TEXT[0]} className="mt-4" />
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
