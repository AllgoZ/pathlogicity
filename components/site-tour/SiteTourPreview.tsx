"use client";

import { useRef, useState } from "react";
import type { Homepage } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OfficialPlanMap, useZoneTour } from "@/components/master-plan/OfficialPlanMap";
import { officialZones, OFFICIAL_PLAN } from "@/components/master-plan/officialZones";
import { RevealLines } from "@/components/ui/Reveal";

const CHIP_ZONE: Record<string, string | null> = {
  Explore: null,
  Warehousing: "warehousing",
  Rail: "rail",
  ICD: "icd",
  Commercial: "commercial",
  Roads: "roads",
  "Green Areas": "green",
};

/** zone → chip, for a click/tap on the map (not hover: the camera moves, so hover would chase the cursor) */
const ZONE_CHIP: Record<string, string> = Object.fromEntries(Object.entries(CHIP_ZONE).filter(([, z]) => z).map(([c, z]) => [z as string, c]));
/** camera zoom per zone (1 = whole plan) — small zones get a closer look */
const ZOOM: Record<string, number> = { warehousing: 1.7, rail: 1.8, icd: 2.6, commercial: 2.2, roads: 1.45, green: 1.35 };
/** the order the camera tours the zones in on first view */
const TOUR = ["Warehousing", "Rail", "ICD", "Commercial", "Roads", "Green Areas"];

/**
 * §09 — Logicity360 preview. The official master plan, with a camera that glides onto the chosen zone,
 * stands in for the future 3D model. On first view the camera tours every zone once, then hands over.
 */
export function SiteTourPreview({ data }: { data: Homepage["siteTour"] }) {
  const root = useRef<HTMLDivElement>(null);
  const [chip, setChip] = useState("Explore");
  const [touched, setTouched] = useState(false);
  const [tour, stopTour] = useZoneTour(root, TOUR, { start: 900, step: 2300 });
  const shown = touched ? chip : tour ?? "Explore";
  const zone = CHIP_ZONE[shown] ?? null;
  const pick = (c: string) => {
    stopTour();
    setTouched(true);
    setChip(c);
  };

  // camera: translate so the zone's anchor sits at the centre, then scale about the centre
  const z = zone ? ZOOM[zone] ?? 1.5 : 1;
  const [ax, ay] = zone ? officialZones[zone].anchor : [OFFICIAL_PLAN.width / 2, OFFICIAL_PLAN.height / 2];
  const tx = -z * (ax / OFFICIAL_PLAN.width - 0.5) * 100;
  const ty = -z * (ay / OFFICIAL_PLAN.height - 0.5) * 100;
  // zone camera: set inline. Overview (no zone): the plan sits below and to the right of the title block on desktop
  const camera = zone ? ({ "--tx": `${tx.toFixed(2)}%`, "--ty": `${ty.toFixed(2)}%`, "--z": String(z) } as React.CSSProperties) : undefined;

  return (
    <section id="site-tour" data-stage="explore" aria-labelledby="tour-title" className="relative isolate overflow-hidden bg-porcelain text-ink">
      <div ref={root} className="relative min-h-[88svh] lg:min-h-[100vh]">
        {/* the official plan under a slow-moving camera (drift paused under reduced motion via the global rule) */}
        <div aria-hidden className="absolute inset-0 flex items-center justify-center [perspective:1800px]">
          <div
            className="w-[190%] max-w-[1700px] [--tx:0%] [--ty:0%] [--z:1] [transform:translate(var(--tx),var(--ty))_scale(var(--z))] [transform-origin:50%_50%] transition-transform duration-[1600ms] ease-[var(--ease-out-expo)] sm:w-[130%] lg:w-[92%] lg:[--tx:9%] lg:[--ty:-12%] lg:[--z:0.7]"
            style={camera}
          >
            <div style={{ animation: "tour-drift 26s ease-in-out infinite alternate" }}>
              <OfficialPlanMap
                zone={zone}
                tag={zone ? shown : null}
                interactive
                onZoneSelect={(id) => ZONE_CHIP[id] && pick(ZONE_CHIP[id])}
                sizes="(min-width: 1024px) 92vw, 190vw"
              />
            </div>
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_45%,rgb(249_250_253/0.85)_92%)]" />
        {/* soft porcelain behind the title block so text stays readable when the camera is close */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-porcelain via-porcelain/70 to-transparent lg:w-[42%]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_35%_at_50%_55%,rgb(231_172_0/0.12),transparent_70%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-porcelain to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-porcelain via-porcelain/80 to-transparent" />

        <div className="shell pointer-events-none relative flex min-h-[88svh] flex-col justify-between py-16 lg:min-h-[100vh] lg:py-24">
          <div className="flex items-start justify-between gap-6">
            <div className="pointer-events-auto">
              <p className="t-label text-ink">
                <span data-idx className="text-indigo-700">09 /</span> {data.kicker}
              </p>
              <RevealLines id="tour-title" lines={[data.title]} className="t-xl mt-5 text-ink" />
              <p className="t-body-l mt-4 max-w-[34ch] text-steel-700">A 3D site tour of the hub — explore every zone from above.</p>
            </div>
            <div className="slot-annotation pointer-events-auto hidden border border-ink/15 bg-paper/80 px-4 py-3 text-right md:block">
              <p className="t-micro text-steel-500">Asset slot 09</p>
              <p className="t-label mt-1 text-ink">{data.media.slot}</p>
              <p className="t-micro mt-1 max-w-[26ch] text-steel-500">{data.media.spec}</p>
            </div>
          </div>

          <div className="pointer-events-auto">
            <div role="group" aria-label="Preview zones" className="no-scrollbar -mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)] pb-1">
              {data.chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={shown === c}
                  onClick={() => pick(c)}
                  className={`t-micro flex h-10 shrink-0 items-center gap-2 border px-4 backdrop-blur-sm transition-colors ${
                    shown === c ? "border-yellow-400 bg-yellow-400 text-ink" : "border-ink/20 bg-paper/80 text-ink hover:border-indigo-700"
                  }`}
                >
                  {c === "Explore" ? <Icon name="expand" size={14} /> : <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${shown === c ? "bg-ink" : "bg-indigo-700"}`} />}
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="t-micro text-steel-700">Full-screen interactive 3D model · coming to Logicity360</p>
              <ButtonLink href="/site-tour">Enter the 3D site tour</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
