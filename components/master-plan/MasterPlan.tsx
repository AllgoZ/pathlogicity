"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Zone } from "@/lib/content/types";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ArrowLink } from "@/components/ui/Button";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { Icon } from "@/components/ui/Icon";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OFFICIAL_PLAN, officialZones } from "./officialZones";

const { width: W, height: H, src: PLAN_SRC } = OFFICIAL_PLAN;

/** Paint order: big, low zones first so small ones sit on top and stay hoverable. */
const PAINT_ORDER = ["green", "roads", "yards", "warehousing", "rail", "commercial", "icd"];

/**
 * §03 — Explore Path Logicity. The client's OFFICIAL master plan is the interface:
 * zones are traced from the drawing itself (scripts/generate-plan-zones.py), so
 * hovering or selecting one lights up the real layout and washes out the rest.
 * The zone list stays the primary, keyboard/screen-reader control.
 */
export function MasterPlan({ zones }: { zones: Zone[] }) {
  const section = useRef<HTMLElement>(null);
  const planWrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const touched = useRef(false);
  const shown = hover ?? active;
  const shownZone = zones.find((z) => z.id === shown) ?? null;
  const zone = zones.find((z) => z.id === active) ?? null;

  // First time the plan is seen: step through the zones once, then hand over to the visitor.
  useEffect(() => {
    const el = planWrap.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      zones.forEach((z, i) => {
        timers.push(
          setTimeout(() => {
            if (!touched.current) setHover(z.id);
          }, 500 + i * 620),
        );
      });
      timers.push(
        setTimeout(() => {
          if (!touched.current) setHover(null);
        }, 500 + zones.length * 620),
      );
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [zones]);

  const interact = () => {
    touched.current = true;
  };
  const select = (id: string) => {
    interact();
    setActive((a) => (a === id ? null : id));
  };
  const enter = (id: string) => {
    interact();
    setHover(id);
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
          <div className="border-l-[3px] border-yellow-400 pl-5">
            <p className="t-label text-indigo-700">The official master plan</p>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-steel-700">Hover or tap a zone on the drawing, or pick one from the list.</p>
          </div>
        </div>
      </div>

      <div className="shell relative mt-14 grid-12 gap-y-6 lg:mt-20">
        {/* Zone index — the accessible primary control. On desktop the selected zone opens inline. */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <p className="t-label hidden text-steel-700 lg:block">Zones · {zones.length}</p>
          <ul className="no-scrollbar -mx-[var(--margin)] flex gap-2 overflow-x-auto px-[var(--margin)] pb-1 lg:mx-0 lg:mt-4 lg:block lg:overflow-visible lg:border-t lg:border-ink/10 lg:px-0">
            {zones.map((z) => {
              const on = active === z.id;
              const lit = shown === z.id;
              return (
                <li key={z.id} className="shrink-0 lg:border-b lg:border-ink/10">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-expanded={on}
                    onClick={() => select(z.id)}
                    onMouseEnter={() => enter(z.id)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => enter(z.id)}
                    onBlur={() => setHover(null)}
                    className={`group flex h-11 w-full items-center gap-3 border px-4 text-left transition-colors duration-300 lg:h-auto lg:border-0 lg:px-0 lg:py-4 ${
                      on ? "border-yellow-400 bg-yellow-400 text-ink lg:bg-transparent lg:text-indigo-700" : "border-ink/15 bg-paper text-ink/80 hover:text-indigo-700 lg:bg-transparent"
                    }`}
                  >
                    <span className={`t-micro tnum ${on ? "" : "text-steel-500"} lg:w-7`}>{z.index}</span>
                    <span className="whitespace-nowrap text-[0.875rem] font-bold lg:text-[0.9375rem]">{z.name}</span>
                    <span aria-hidden className={`ml-auto hidden h-px transition-all duration-500 ease-[var(--ease-out-expo)] lg:block ${on || lit ? "w-10 bg-yellow-400" : "w-3 bg-ink/25"}`} />
                  </button>
                  {on ? <ZonePanel zone={z} onClose={() => setActive(null)} className="mb-5 hidden lg:block" inline /> : null}
                </li>
              );
            })}
          </ul>
        </div>

        {/* The official drawing */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-9">
          <div ref={planWrap} className="card relative overflow-hidden">
            <figure onMouseLeave={() => setHover(null)}>
              <div className="relative">
              <Image
                src={PLAN_SRC}
                alt="Official Path Logicity master plan: warehouses, surface parking, commercial areas, open warehouses, CFS shed, utilities, transit warehouse and the railway terminal, with access from the STRR / NH 648 trumpet"
                width={W}
                height={H}
                sizes="(min-width: 1024px) 72vw, 100vw"
                priority={false}
                className="block h-auto w-full select-none"
                draggable={false}
              />
              <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {shown ? (
                    <clipPath id="plan-zone-clip">
                      <path d={officialZones[shown].d} clipRule="evenodd" />
                    </clipPath>
                  ) : null}
                </defs>
                {/* wash out everything, then re-reveal the chosen zone in full colour */}
                <rect width={W} height={H} fill="#f9fafd" className="transition-opacity duration-500" opacity={shown ? 0.72 : 0} />
                {shown ? <image href={PLAN_SRC} width={W} height={H} clipPath="url(#plan-zone-clip)" /> : null}
                {shown ? (
                  <path
                    key={shown}
                    d={officialZones[shown].d}
                    fill="none"
                    stroke="var(--color-indigo-700)"
                    strokeWidth={5}
                    strokeLinejoin="round"
                    pathLength={1}
                    strokeDasharray="1 1"
                    style={{ animation: "draw 0.9s var(--ease-out-expo) both" }}
                  />
                ) : null}
                {/* hit targets */}
                {PAINT_ORDER.map((id) =>
                  officialZones[id] ? (
                    <path
                      key={id}
                      d={officialZones[id].d}
                      fillRule="evenodd"
                      fill="transparent"
                      className="cursor-pointer"
                      onPointerEnter={(e) => e.pointerType === "mouse" && enter(id)}
                      onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
                      onClick={() => select(id)}
                    />
                  ) : null,
                )}
              </svg>

              {/* marker + name tag for the lit zone */}
              {shown && shownZone ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${(officialZones[shown].anchor[0] / W) * 100}%`, top: `${(officialZones[shown].anchor[1] / H) * 100}%` }}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse-soft" />
                    <span className="relative h-3 w-3 rounded-full border-2 border-paper bg-yellow-400 shadow" />
                  </span>
                  <span className={`t-micro absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-ink px-2.5 py-1 text-paper shadow-lg ${officialZones[shown].anchor[0] > W * 0.62 ? "right-4" : "left-4"}`}>
                    {shownZone.index} · {shownZone.name}
                  </span>
                </div>
              ) : null}
              </div>

              <figcaption className="t-micro flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-ink/10 px-4 py-3 text-steel-500">
                <span>Official master plan · Path Logicity, Dobbaspet</span>
                <span className="hidden sm:inline">Hover or tap a zone to light it up</span>
                <ContentSlot>Zone ↔ legend mapping to be confirmed by the client</ContentSlot>
              </figcaption>
            </figure>
          </div>

          {/* Detail panel (mobile/tablet, inline under the drawing) */}
          <div className="lg:hidden">{zone ? <ZonePanel zone={zone} onClose={() => setActive(null)} className="mt-4" /> : <ZoneHint className="mt-4" />}</div>
        </div>
      </div>
    </section>
  );
}

function ZoneHint({ className = "" }: { className?: string }) {
  return (
    <div className={`border border-ink/10 bg-paper p-5 ${className}`}>
      <p className="t-label text-indigo-700">Seven zones, one connected ecosystem</p>
      <p className="mt-2 text-sm text-steel-700">Tap a zone on the plan or choose one above.</p>
    </div>
  );
}

function ZonePanel({ zone, onClose, className = "", inline = false }: { zone: Zone; onClose: () => void; className?: string; inline?: boolean }) {
  return (
    <div
      key={zone.id}
      className={`relative border border-ink/10 bg-paper [animation:wipe-in_.6s_var(--ease-out-expo)_both] ${inline ? "" : "shadow-[0_18px_40px_-20px_rgb(26_28_70/0.3)]"} ${className}`}
      aria-live="polite"
    >
      <span aria-hidden className="absolute -top-px left-0 h-[2px] w-16 bg-yellow-400" />
      <div className={inline ? "p-5" : "p-6"}>
        <div className="flex items-start justify-between">
          <p className="t-label text-indigo-700">Zone {zone.index}</p>
          <button type="button" onClick={onClose} aria-label="Close zone details" className="-m-2 p-2 text-steel-500 hover:text-ink">
            <Icon name="x" size={16} />
          </button>
        </div>
        <h3 className="t-m mt-2 text-ink">{zone.name}</h3>
        <p className="mt-2 text-[0.9375rem] text-steel-700">{zone.short}</p>
        {zone.facts.length ? (
          <ul className="mt-4 space-y-2.5 border-t border-ink/10 pt-4">
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
      {zone.media.src ? (
        <AssetSlot slot={zone.media.slot} spec={zone.media.spec} ratio="16/7" compact variant={2} label={zone.media.alt} src={zone.media.src} focus="center" sizes="(min-width: 1024px) 26vw, 100vw" />
      ) : (
        <p className="slot-annotation px-5 pb-3">
          <ContentSlot>Zone image — to be supplied</ContentSlot>
        </p>
      )}
      <div className="px-5 py-3">
        <ArrowLink href="/logicity-advantage">Explore the site</ArrowLink>
      </div>
    </div>
  );
}
