"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Homepage } from "@/lib/content";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { boxIn, curve, useLinks } from "@/lib/motion/useLinks";
import { Counter } from "@/components/ui/Counter";
import { Icon } from "@/components/ui/Icon";
import { Route } from "@/components/ui/Route";
import { RevealLines } from "@/components/ui/Reveal";

/**
 * §02 — 400 ACRES ↓ INTEGRATED LOGISTICS ECOSYSTEM.
 * The PDF's "interactive icons" become nodes on a network branching from one number.
 */
export function ScaleIndex({ data }: { data: Homepage["scale"] }) {
  const section = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLSpanElement | null)[]>([]);
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState<string | null>(null);
  // Client round 9: the previews used to appear only on hover. On desktop the list now holds the screen for a moment and the
  // previews open ONE AT A TIME as the visitor scrolls: the first opens, closes as the second opens, and so on (each lights
  // its branch); after the fourth the page moves on. Scrolling back reverses it. The pointer (or keyboard focus) still shows
  // the row it is on. Phones get each photo inline instead (below); reduced motion keeps the original hover-only previews.
  const paused = useRef(false);
  const [hover, setHover] = useState<string | null>(null);
  const take = (id: string) => {
    paused.current = true;
    setHover(id);
    setActive(id);
  };
  const give = () => {
    paused.current = false;
    setHover(null);
    setActive(null);
  };
  const [seen, setSeen] = useState<string[]>([]);
  const [open, setOpen] = useState<string[]>([]);
  // the pointer wins while it is on the list; otherwise the preview the scroll has reached
  const shown = (id: string) => (hover ? hover === id : open.includes(id));

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    // phones / tablets: each point opens its photo the first time it scrolls into view
    const rows = Array.from(el.querySelectorAll<HTMLElement>("[data-node]"));
    const rio = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = (e.target as HTMLElement).dataset.node;
          if (id) setSeen((v) => (v.includes(id) ? v : [...v, id]));
          rio.unobserve(e.target);
        }),
      { threshold: 0.5 },
    );
    rows.forEach((r) => rio.observe(r));
    return () => rio.disconnect();
  }, [data.nodes]);

  const { paths, w, h } = useLinks(grid, (c) => {
    const n = boxIn(num.current, c);
    if (!n) return [];
    const sx = n.r + 20;
    const sy = n.y + n.h * 0.52;
    return markers.current.map((m) => {
      const b = boxIn(m, c);
      return b ? curve(sx, sy, b.cx, b.cy, 0.55) : "";
    });
  });

  useMotion(section, (mm) => {
    if (!paths.length) return;
    mm.add(MQ.desktop, () => {
      const q = gsap.utils.selector(section);
      gsap.from(q("[data-branch]"), {
        strokeDashoffset: 1,
        duration: 1.3,
        stagger: 0.14,
        ease: "power2.inOut",
        scrollTrigger: { trigger: grid.current, start: "top 60%", once: true },
      });
      gsap.from(q("[data-node]"), {
        opacity: 0,
        x: 24,
        duration: 0.9,
        stagger: 0.14,
        delay: 0.5,
        ease: "expo.out",
        scrollTrigger: { trigger: grid.current, start: "top 60%", once: true },
      });
      // the list holds the screen while the four previews open one by one with the scroll, then releases
      const ids = data.nodes.map((n) => n.id);
      const sync = (p: number) => {
        const cur = p < 0.05 ? null : ids[Math.min(ids.length - 1, Math.floor((p - 0.05) / 0.25))];
        setOpen((v) => (cur ? (v.length === 1 && v[0] === cur ? v : [cur]) : v.length ? [] : v));
        if (!paused.current) setActive(cur);
      };
      ScrollTrigger.create({
        trigger: grid.current,
        start: "center center",
        end: () => "+=" + Math.round(window.innerHeight * 1.4),
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => sync(self.progress),
        onRefresh: (self) => sync(self.progress),
      });
    });
    mm.add(MQ.mobile, () => {
      const q = gsap.utils.selector(section);
      gsap.from(q("[data-node]"), {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        scrollTrigger: { trigger: q("[data-nodes]")[0], start: "top 80%", once: true },
      });
    });
  }, [paths.length]);

  return (
    <section ref={section} id="scale" data-stage="discover" aria-labelledby="scale-title" className="relative bg-porcelain pb-[clamp(88px,12vh,160px)]">
      {/* Route arriving from the hero, x = 6% */}
      <div className="relative mb-6 h-[clamp(96px,16vh,200px)]">
        <Route d="M 6 0 L 6 100" auto="scrub" scrubStart="top bottom" scrubEnd="bottom 45%" base={false} />
      </div>

      <div ref={grid} className="shell relative grid-12 gap-y-14">
        {/* branch network (desktop) */}
        {w ? (
          <svg aria-hidden width={w} height={h} className="pointer-events-none absolute left-0 top-0 hidden lg:block" fill="none">
            {paths.map((d, i) => (
              <g key={i}>
                <path d={d} stroke="rgb(26 28 70 / 0.1)" strokeWidth={1} />
                <path
                  data-branch
                  d={d}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeWidth={1.5}
                  className="transition-[stroke,opacity] duration-300"
                  stroke={active === data.nodes[i].id ? "var(--color-yellow-400)" : "rgb(32 31 133 / 0.3)"}
                  opacity={active && active !== data.nodes[i].id ? 0.25 : 1}
                />
              </g>
            ))}
          </svg>
        ) : null}

        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <p className="t-label flex items-center gap-3">
            Scale
          </p>
          <div ref={num} className="mt-8 flex w-fit items-start">
            <div className="t-xxl relative text-indigo-700">
              <Counter value={data.metric.value} duration={2.4} spins={2} />
            </div>
            <p className="t-label ml-3 mt-[0.4em] text-green-700 [writing-mode:vertical-rl] lg:ml-4">{data.metric.unit}</p>
          </div>
          <p className="t-label mt-6 text-steel-700">{data.metric.label}</p>

          <div className="mt-10 flex items-start gap-5">
            <span aria-hidden className="mt-3 block h-[clamp(64px,8vw,120px)] w-px bg-gradient-to-b from-yellow-400 to-transparent" />
            <RevealLines
              id="scale-title"
              lines={data.result}
              className="t-l font-light text-steel-700 [&_[data-line]]:font-light"
            />
          </div>
        </div>

        <div className="col-span-4 self-center sm:col-span-8 lg:col-span-5 lg:col-start-8">
        <ul ref={list} data-nodes className="relative border-l border-ink/10 lg:border-l-0" onMouseLeave={give}>
          {data.nodes.map((n, i) => (
            <li key={n.id} data-node={n.id} className="border-b border-ink/10 first:border-t lg:first:border-t-0 lg:last:border-b-0">
              <Link
                href={n.href}
                data-active={active === n.id}
                onMouseEnter={() => take(n.id)}
                onFocus={() => take(n.id)}
                onBlur={give}
                className="group relative flex items-start gap-5 py-6 pl-6 lg:gap-6 lg:py-8 lg:pl-0"
              >
                {/* preview — wipes in beside the node as the section arrives, then stays open (desktop) */}
                {n.image ? (
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute right-[calc(100%+48px)] top-1/2 ${active === n.id ? "z-20" : "z-10"} hidden h-[180px] w-[280px] -translate-y-1/2 overflow-hidden rounded-[2px] shadow-[var(--shadow-card)] transition-[clip-path] duration-700 ease-[var(--ease-out-expo)] lg:block`}
                    style={{ clipPath: shown(n.id) ? "inset(0 0 0 0)" : "inset(0 0 0 100%)" }}
                  >
                    <Image src={n.image} alt="" fill sizes="280px" className={`object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] [filter:contrast(1.05)_saturate(0.82)] ${shown(n.id) ? "scale-100" : "scale-110"}`} />
                  </span>
                ) : null}
                <span
                  ref={(el) => {
                    markers.current[i] = el;
                  }}
                  aria-hidden
                  className={`absolute -left-[6.5px] top-[44px] h-3 w-3 rounded-full border transition-colors duration-300 lg:static lg:mt-[22px] lg:shrink-0 ${
                    active === n.id ? "border-yellow-400 bg-yellow-400" : "border-ink/30 bg-paper"
                  }`}
                />
                <span
                  aria-hidden
                  className={`flex h-14 w-14 shrink-0 items-center justify-center border transition-colors duration-300 ${
                    active === n.id ? "border-indigo-700 bg-indigo-50 text-indigo-700" : "border-ink/15 text-indigo-700"
                  }`}
                >
                  <Icon name={n.icon} size={26} draw />
                </span>
                <span className="min-w-0 flex-1">
                  <span aria-hidden className="t-micro block text-steel-500">•</span>
                  <span className="t-label mt-1 block text-indigo-700">{n.label}</span>
                  <span className="t-s mt-1.5 block text-ink">{n.text}</span>
                  {/* phones / tablets: the photo opens inline the first time the point scrolls into view */}
                  {n.image ? (
                    <span
                      aria-hidden
                      className="relative mt-4 block aspect-[16/9] overflow-hidden rounded-[2px] shadow-[var(--shadow-card)] transition-[clip-path] duration-1000 ease-[var(--ease-out-expo)] lg:hidden"
                      style={{ clipPath: seen.includes(n.id) ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
                    >
                      <Image src={n.image} alt="" fill sizes="(max-width: 640px) 80vw, 480px" className="object-cover [filter:contrast(1.05)_saturate(0.82)]" />
                    </span>
                  ) : null}
                </span>
                <Icon
                  name="arrow-right"
                  size={18}
                  className={`mt-6 shrink-0 transition-all duration-300 ${active === n.id ? "translate-x-0 text-indigo-700 opacity-100" : "-translate-x-2 opacity-0"}`}
                />
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  );
}
