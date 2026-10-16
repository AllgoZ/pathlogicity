"use client";

import { useRef, useState } from "react";
import type { Milestone, MilestoneStatus } from "@/lib/content/types";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { AssetSlot } from "@/components/ui/AssetSlot";
import { ContentSlot } from "@/components/ui/ContentSlot";
import { SectionHeader } from "@/components/ui/SectionHeader";

const STATUS: Record<MilestoneStatus, { label: string; text: string; dot: string }> = {
  completed: { label: "Completed", text: "text-green-700", dot: "bg-green-500 border-green-500" },
  "in-progress": { label: "In progress", text: "text-indigo-700", dot: "bg-yellow-400 border-yellow-400" },
  upcoming: { label: "Upcoming", text: "text-steel-500", dot: "bg-paper border-steel-500" },
};

const isVideo = (src?: string | null) => Boolean(src && /\.(mp4|webm)(\?|$)/i.test(src));

/**
 * §04 — Watch the project take shape: sticky Constra site-capture viewer + live
 * timeline. A milestone whose media `src` is an MP4/WebM (Constra timelapse)
 * plays inline; images show in the framed slot.
 */
export function ProjectStatus({ milestones, lastUpdated }: { milestones: Milestone[]; lastUpdated: string | null }) {
  const section = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const m = milestones[active] ?? milestones[0];

  useMotion(section, (mm) => {
    const items = gsap.utils.toArray<HTMLElement>("[data-milestone]", list.current);
    mm.add("all", () => {
      const triggers = items.map((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 58%",
          end: "bottom 58%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    });
    mm.add(MQ.motion, () => {
      gsap.fromTo(
        fill.current,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: list.current, start: "top 58%", end: "bottom 58%", scrub: 0.4 } },
      );
    });
  });

  const jump = (i: number) => {
    const el = list.current?.querySelectorAll<HTMLElement>("[data-milestone]")[i];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y });
  };

  const counts = milestones.reduce<Record<string, number>>((a, x) => ({ ...a, [x.status]: (a[x.status] ?? 0) + 1 }), {});

  return (
    <section ref={section} id="status" data-stage="explore" aria-labelledby="status-title" className="relative bg-porcelain section-pad">
      <div className="shell grid-12 gap-y-10">
        <SectionHeader
          className="col-span-4 sm:col-span-8 lg:col-span-8"
          index="04"
          chapter="Project Status · Site progress"
          id="status-title"
          lines={["Watch the project", "*take shape*"]}
          body="Milestones from approval to operations, with on-site progress captured through Constra construction monitoring."
        />
        <div className="col-span-4 flex flex-col justify-end gap-6 sm:col-span-8 lg:col-span-4">
          <p className={`t-micro flex flex-wrap items-center gap-x-3 gap-y-2 text-steel-700 ${lastUpdated ? "" : "slot-annotation"}`}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-green-500 animate-pulse-soft" />
              <span className="relative h-2 w-2 rounded-full bg-green-500" />
            </span>
            Last updated · {lastUpdated ?? <ContentSlot>CMS date</ContentSlot>}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {(Object.keys(STATUS) as MilestoneStatus[]).map((s) => (
              <li key={s} className={`t-micro flex items-center gap-2 ${STATUS[s].text}`}>
                <span aria-hidden className={`h-2.5 w-2.5 rounded-full border ${STATUS[s].dot}`} />
                {STATUS[s].label}
                <span className="text-steel-500">· {String(counts[s] ?? 0).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell mt-14 grid-12 gap-y-10 lg:mt-20">
        {/* Media viewer */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <div className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[2px] bg-paper-2 shadow-[var(--shadow-card)]">
              <div key={m.id} className="[animation:wipe-in_.8s_var(--ease-out-expo)_both]">
                {isVideo(m.media.src) ? (
                  <video
                    className="block aspect-video w-full object-cover"
                    src={m.media.src ?? undefined}
                    poster={m.media.poster ?? undefined}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={m.media.alt}
                  />
                ) : (
                  <AssetSlot slot={m.media.slot} spec={m.media.spec} ratio="16/9" id={`04.${active + 1}`} variant={active + 1} label={m.media.alt} src={m.media.src} focus="center" reveal={false} sizes="(min-width: 1024px) 60vw, 100vw" />
                )}
              </div>
              {m.media.credit ? (
                <p className="t-micro absolute right-4 top-4 bg-midnight/70 px-3 py-1.5 text-paper backdrop-blur-md">{m.media.credit}</p>
              ) : null}
              <div className="absolute bottom-5 left-5 hidden items-center gap-3 border border-ink/10 bg-paper/95 px-3 py-2 shadow-sm sm:flex">
                <span aria-hidden className={`h-2 w-2 rounded-full border ${STATUS[m.status].dot}`} />
                <span className={`t-micro ${STATUS[m.status].text}`}>{STATUS[m.status].label}</span>
                <span className="t-micro text-steel-500">· Milestone {String(active + 1).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Scrubber — a route with milestone ticks */}
            <div className="mt-6 flex items-center gap-5">
              <p className="t-micro shrink-0 text-steel-500">Timeline</p>
              <div className="relative h-10 flex-1">
                <span aria-hidden className="absolute left-0 right-0 top-1/2 h-px bg-ink/15" />
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-0.5 -translate-y-px bg-yellow-400 transition-[width] duration-700 ease-[var(--ease-out-expo)]"
                  style={{ width: `${(active / Math.max(1, milestones.length - 1)) * 100}%` }}
                />
                {milestones.map((x, i) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => jump(i)}
                    aria-label={`Milestone ${i + 1}: ${STATUS[x.status].label}`}
                    aria-current={i === active ? "step" : undefined}
                    className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                    style={{ left: `${(i / Math.max(1, milestones.length - 1)) * 100}%` }}
                  >
                    <span
                      className={`block rounded-full border transition-all duration-300 ${STATUS[x.status].dot} ${i === active ? "h-3.5 w-3.5 ring-4 ring-yellow-400/30" : "h-2.5 w-2.5"}`}
                    />
                  </button>
                ))}
              </div>
              <p className="t-micro tnum shrink-0 text-ink">
                {String(active + 1).padStart(2, "0")} <span className="text-steel-500">/ {String(milestones.length).padStart(2, "0")}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          <ol ref={list} className="relative">
            <span aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px bg-ink/10" />
            <span ref={fill} aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-yellow-400" />
            {milestones.map((x, i) => {
              const s = STATUS[x.status];
              const on = i === active;
              return (
                <li key={x.id} data-milestone className="relative pb-12 pl-10 lg:min-h-[36vh] lg:pb-0">
                  <span aria-hidden className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border ${s.dot}`}>
                    {x.status === "in-progress" ? <span className="absolute inset-0 rounded-full bg-yellow-400 animate-pulse-soft" /> : null}
                  </span>
                  <div>
                    <p className={`t-micro ${s.text}`}>{s.label}</p>
                    <p className={`mt-2 text-[clamp(2.5rem,3.6vw,3.5rem)] font-bold leading-none tracking-[-0.03em] text-indigo-700 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-60"}`} aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <div className="mt-4 space-y-2.5">
                      <p className="t-s text-ink">{x.title ?? <ContentSlot>Milestone — to be supplied</ContentSlot>}</p>
                      <p className="flex flex-wrap gap-3">
                        {x.phase ? <span className="t-micro text-steel-700">{x.phase}</span> : <ContentSlot>Phase</ContentSlot>}
                        {x.date ? <span className="t-micro text-indigo-700">{x.date}</span> : <ContentSlot>Date — CMS</ContentSlot>}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
