"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Homepage } from "@/lib/content";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { Icon } from "@/components/ui/Icon";
import { Metric } from "@/components/ui/Metric";
import { RevealLines } from "@/components/ui/Reveal";

const R = 210; // ring radius in a 560 box

/** §08 — Sustainability: the route closes into a ring — the ecosystem. IGBC is the hero. */
export function Sustainability({ data }: { data: Homepage["sustainability"] }) {
  const section = useRef<HTMLElement>(null);
  const n = data.initiatives.length;

  useMotion(section, (mm) => {
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(section);
      const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-ring]")[0], start: "top 70%", once: true } });
      tl.from(q("[data-ring-arc]"), { strokeDashoffset: 1, duration: 1.8, ease: "power2.inOut" })
        .from(q("[data-ring-head]"), { opacity: 0, duration: 0.3 }, 1.5)
        .from(q("[data-ring-node]"), { opacity: 0, scale: 0.6, duration: 0.6, stagger: 0.12, ease: "expo.out" }, 0.6)
        .from(q("[data-ring-copy]"), { opacity: 0, y: 16, duration: 0.8, stagger: 0.08 }, 0.9);
      gsap.from(q("[data-story-step]"), {
        opacity: 0.2,
        stagger: 0.25,
        duration: 0.8,
        scrollTrigger: { trigger: q("[data-story]")[0], start: "top 80%", once: true },
      });
      gsap.from(q("[data-story-line]"), {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.25,
        duration: 0.8,
        ease: "power2.inOut",
        scrollTrigger: { trigger: q("[data-story]")[0], start: "top 80%", once: true },
      });
    });
  });

  return (
    <section ref={section} id="sustainability" data-stage="believe" aria-labelledby="sus-title" className="relative overflow-hidden bg-canvas text-ink section-pad">
      <div className="shell grid-12 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-8">
          <p className="t-label flex items-center gap-3">
            <span className="text-green-700">08 /</span> Sustainability · ESG
          </p>
          <RevealLines id="sus-title" lines={data.headline} lineClassNames={["", "text-green-700"]} className="t-l mt-5 text-ink" />
        </div>
        <p className="t-body-l col-span-4 self-end text-steel-700 sm:col-span-8 lg:col-span-3 lg:col-start-10">
          Infrastructure, efficiency and sustainability — engineered to work together.
        </p>
      </div>

      <div className="shell mt-14 grid-12 items-center gap-y-12 lg:mt-20">
        {/* Ring */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <div data-ring className="relative mx-auto aspect-square w-full max-w-[600px]">
            <svg viewBox="0 0 560 560" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
              <circle cx="280" cy="280" r={R + 46} stroke="rgb(26 28 70 / 0.1)" strokeDasharray="2 8" />
              <circle cx="280" cy="280" r={R} stroke="rgb(26 28 70 / 0.1)" strokeWidth="1" />
              <circle
                data-ring-arc
                cx="280"
                cy="280"
                r={R}
                pathLength={1}
                strokeDasharray="1 1"
                stroke="var(--color-green-500)"
                strokeWidth="2.5"
                transform="rotate(-90 280 280)"
              />
              <g data-ring-head>
                <circle cx="280" cy={280 - R} r="12" fill="rgb(231 172 0 / 0.25)" />
                <circle cx="280" cy={280 - R} r="5" fill="var(--color-yellow-400)" />
              </g>
            </svg>

            {/* IGBC lockup — the official IGBC mark (igbc.in) with the rating */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Image
                src="/client/partners/igbc.png"
                alt="Indian Green Building Council (IGBC)"
                width={420}
                height={666}
                sizes="120px"
                className="h-[clamp(84px,14vw,128px)] w-auto"
              />
              <p className="mt-3 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-none tracking-[-0.02em] text-green-700">{data.certification.level}</p>
              <p className="t-label mt-2 text-ink">{data.certification.type}</p>
            </div>

            {/* initiative nodes on the ring */}
            {data.initiatives.map((it, i) => {
              const a = (-90 + (360 / n) * (i + 0.5)) * (Math.PI / 180);
              const x = 50 + (R / 560) * 100 * Math.cos(a);
              const y = 50 + (R / 560) * 100 * Math.sin(a);
              const right = Math.cos(a) > 0.1;
              const left = Math.cos(a) < -0.1;
              return (
                <div key={it.id} className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
                  <div data-ring-node className="group relative -translate-x-1/2 -translate-y-1/2">
                    <span className="flex h-14 w-14 items-center justify-center border border-ink/15 bg-paper text-green-700 shadow-sm transition-colors duration-300 group-hover:border-green-700 group-hover:bg-green-700 group-hover:text-paper sm:h-16 sm:w-16">
                      <Icon name={it.icon} size={26} draw />
                    </span>
                    <div
                      data-ring-copy
                      className={`absolute top-1/2 hidden w-[150px] -translate-y-1/2 sm:block ${right ? "left-[calc(100%+14px)]" : left ? "right-[calc(100%+14px)] text-right" : "left-1/2 top-[calc(100%+12px)] -translate-x-1/2 translate-y-0 text-center"}`}
                    >
                      <p className="t-label leading-tight text-ink">{it.name}</p>
                      {it.metric ? <Metric data={it.metric} size="m" tone="light" /> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Initiatives list + imagery */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          <ul className="border-t border-ink/15">
            {data.initiatives.map((it, i) => (
              <li key={it.id} className="group flex items-start gap-4 border-b border-ink/15 py-4">
                <span className="t-micro pt-1 text-green-700">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <p className="t-label text-ink">{it.name}</p>
                  <p className="mt-1.5">{it.text ? <span className="text-sm text-steel-700">{it.text}</span> : <ContentSlot tone="light">Verified detail to be supplied</ContentSlot>}</p>
                </div>
                <Icon name={it.icon} size={20} className="mt-0.5 text-ink/40 transition-colors group-hover:text-green-700" />
              </li>
            ))}
          </ul>
          <AssetSlot slot={data.media.slot} spec={data.media.spec} ratio="4/3" tone="paper" variant={4} className="mt-8" compact label={data.media.alt} src={data.media.src} focus="center" sizes="(min-width: 1024px) 40vw, 100vw" />
        </div>
      </div>

      {/* Story strip */}
      <div className="shell mt-20 lg:mt-28">
        <ol data-story className="grid gap-6 border-t border-ink/15 pt-10 lg:grid-cols-3 lg:gap-0">
          {data.story.map((s, i) => (
            <li key={s} data-story-step className="relative flex items-center gap-5 lg:pr-10">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-green-700 text-xs font-bold text-green-700">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-display text-[clamp(1.125rem,1.5vw,1.5rem)] font-bold leading-[1.2] text-ink">{s}</p>
              {i < data.story.length - 1 ? (
                <span aria-hidden data-story-line className="ml-auto hidden h-px w-16 shrink-0 bg-green-700 lg:block xl:w-24">
                  <span className="relative -top-[3px] float-right block h-0 w-0 border-y-[3.5px] border-l-[6px] border-y-transparent border-l-green-700" />
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
