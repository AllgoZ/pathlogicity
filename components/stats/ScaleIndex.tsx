"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { Homepage } from "@/lib/content";
import { gsap, MQ } from "@/lib/motion/gsap";
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
  const [active, setActive] = useState<string | null>(null);

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
    <section ref={section} id="scale" data-stage="discover" aria-labelledby="scale-title" className="relative overflow-hidden bg-navy-950 pb-[clamp(96px,14vh,192px)]">
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
                <path d={d} stroke="rgb(255 255 255 / 0.1)" strokeWidth={1} />
                <path
                  data-branch
                  d={d}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeWidth={1.5}
                  className="transition-[stroke,opacity] duration-300"
                  stroke={active === data.nodes[i].id ? "var(--color-yellow-400)" : "rgb(196 201 214 / 0.55)"}
                  opacity={active && active !== data.nodes[i].id ? 0.25 : 1}
                />
              </g>
            ))}
          </svg>
        ) : null}

        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <p className="t-label flex items-center gap-3">
            <span className="text-yellow-400">02 /</span> Scale
          </p>
          <div ref={num} className="mt-8 flex w-fit items-start">
            <div className="t-xxl relative text-paper">
              <Counter value={data.metric.value} duration={1.8} />
            </div>
            <p className="t-label ml-3 mt-[0.4em] text-yellow-400 [writing-mode:vertical-rl] lg:ml-4">{data.metric.unit}</p>
          </div>
          <p className="t-label mt-6 text-steel-300">{data.metric.label}</p>

          <div className="mt-10 flex items-start gap-5">
            <span aria-hidden className="mt-3 block h-[clamp(64px,8vw,120px)] w-px bg-gradient-to-b from-yellow-400 to-transparent" />
            <RevealLines
              id="scale-title"
              lines={data.result}
              className="t-l font-light text-steel-300 [&_[data-line]]:font-light"
            />
          </div>
        </div>

        <ul data-nodes className="relative col-span-4 self-center border-l border-white/10 sm:col-span-8 lg:col-span-5 lg:col-start-8 lg:border-l-0">
          {data.nodes.map((n, i) => (
            <li key={n.id} data-node className="border-b border-white/10 first:border-t lg:first:border-t-0 lg:last:border-b-0">
              <Link
                href={n.href}
                data-active={active === n.id}
                onMouseEnter={() => setActive(n.id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n.id)}
                onBlur={() => setActive(null)}
                className="group relative flex items-start gap-5 py-7 pl-6 lg:gap-6 lg:py-9 lg:pl-0"
              >
                <span
                  ref={(el) => {
                    markers.current[i] = el;
                  }}
                  aria-hidden
                  className={`absolute -left-[6.5px] top-[44px] h-3 w-3 rounded-full border transition-colors duration-300 lg:static lg:mt-[22px] lg:shrink-0 ${
                    active === n.id ? "border-yellow-400 bg-yellow-400" : "border-white/40 bg-navy-950"
                  }`}
                />
                <span
                  aria-hidden
                  className={`flex h-14 w-14 shrink-0 items-center justify-center border transition-colors duration-300 ${
                    active === n.id ? "border-yellow-400/70 text-yellow-400" : "border-white/15 text-paper/80"
                  }`}
                >
                  <Icon name={n.icon} size={26} draw />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="t-micro block text-steel-500">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-label mt-1 block text-paper">{n.label}</span>
                  <span className="t-s mt-2 block text-paper/90">{n.text}</span>
                </span>
                <Icon
                  name="arrow-right"
                  size={18}
                  className={`mt-6 shrink-0 transition-all duration-300 ${active === n.id ? "translate-x-0 text-yellow-400 opacity-100" : "-translate-x-2 opacity-0"}`}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
