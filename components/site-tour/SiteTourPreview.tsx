"use client";

import { useState } from "react";
import type { Homepage } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PlanSvg } from "@/components/master-plan/PlanSvg";
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

/** §09 — Logicity360 preview. Perspective plan stands in for the future 3D model. */
export function SiteTourPreview({ data }: { data: Homepage["siteTour"] }) {
  const [chip, setChip] = useState("Explore");
  const zone = CHIP_ZONE[chip] ?? null;

  return (
    <section id="site-tour" data-stage="explore" aria-labelledby="tour-title" className="relative isolate overflow-hidden bg-ink">
      <div className="relative min-h-[100svh] lg:min-h-[110vh]">
        {/* perspective plan — slow orbit (paused under reduced motion via global rule) */}
        <div aria-hidden className="absolute inset-0 flex items-center justify-center [perspective:1600px]">
          <div
            className="w-[150%] max-w-[1500px] sm:w-[110%] lg:w-[88%]"
            style={{ animation: "orbit 40s ease-in-out infinite alternate", transformOrigin: "50% 55%" }}
          >
            <PlanSvg active={zone} showGrid />
          </div>
        </div>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,transparent_20%,rgb(4_8_26/0.85)_75%)]" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink to-transparent" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/80 to-transparent" />

        <div className="shell relative flex min-h-[100svh] flex-col justify-between py-16 lg:min-h-[110vh] lg:py-24">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="t-label">
                <span className="text-yellow-400">09 /</span> {data.kicker}
              </p>
              <RevealLines id="tour-title" lines={[data.title]} className="t-xl mt-6" />
              <p className="t-body-l mt-5 max-w-[34ch] text-steel-300">A 3D site tour of the hub — explore every zone from above.</p>
            </div>
            <div className="slot-annotation hidden border border-white/15 px-4 py-3 text-right md:block">
              <p className="t-micro text-steel-500">Asset slot 09</p>
              <p className="t-label mt-1 text-paper/85">{data.media.slot}</p>
              <p className="t-micro mt-1 max-w-[26ch] normal-case tracking-[0.03em] text-steel-500">{data.media.spec}</p>
            </div>
          </div>

          <div>
            <div role="group" aria-label="Preview zones" className="no-scrollbar -mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)] pb-1">
              {data.chips.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={chip === c}
                  onClick={() => setChip(c)}
                  className={`t-micro flex h-10 shrink-0 items-center gap-2 border px-4 backdrop-blur-sm transition-colors ${
                    chip === c ? "border-yellow-400 bg-yellow-400 text-navy-950" : "border-white/20 bg-navy-950/50 text-paper/85 hover:border-white/50"
                  }`}
                >
                  {c === "Explore" ? <Icon name="expand" size={14} /> : <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${chip === c ? "bg-navy-950" : "bg-yellow-400"}`} />}
                  {c}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="t-micro text-steel-500">Full-screen interactive 3D model · coming to Logicity360</p>
              <ButtonLink href="/site-tour">Enter the 3D site tour</ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
