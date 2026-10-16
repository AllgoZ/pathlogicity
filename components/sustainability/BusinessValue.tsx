"use client";

import { useRef, type ReactNode } from "react";
import type { Benefit } from "@/lib/content/types";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";
import { ArrowLink } from "@/components/ui/Button";
import { RevealLines } from "@/components/ui/Reveal";

/* Diagram-icons: each shows the idea, not a generic glyph. 64×64. */
const P = (d: string, extra: Record<string, unknown> = {}) => <path d={d} pathLength={1} {...extra} />;
const DIAGRAMS: Record<Benefit["id"], ReactNode> = {
  // shorter cycle
  tat: (
    <>
      <circle cx="32" cy="32" r="25" stroke="rgb(26 28 70 / 0.18)" strokeDasharray="3 4" />
      {P("M32 18 A14 14 0 1 1 18.5 28.5", { stroke: "var(--color-yellow-400)" })}
      {P("M14.5 26 18.5 28.5 21.5 24.5", { stroke: "var(--color-yellow-400)" })}
      <circle cx="32" cy="32" r="2.5" fill="currentColor" />
    </>
  ),
  // stepping down
  cost: (
    <>
      <path d="M8 56 H58" stroke="rgb(26 28 70 / 0.18)" />
      {P("M8 12 H20 V24 H32 V36 H44 V48 H56", { stroke: "var(--color-yellow-400)" })}
      {P("M50 43 56 48 50 53")}
    </>
  ),
  // converging
  connectivity: (
    <>
      {P("M6 12 C 28 12, 34 32, 52 32")}
      {P("M6 32 H52", { stroke: "var(--color-yellow-400)" })}
      {P("M6 52 C 28 52, 34 32, 52 32")}
      <circle cx="54" cy="32" r="4" fill="var(--color-yellow-400)" />
    </>
  ),
  // many → one
  efficiency: (
    <g className="bv-collapse">
      <rect x="10" y="10" width="12" height="12" style={{ ["--tx" as string]: "11px", ["--ty" as string]: "11px" }} />
      <rect x="42" y="10" width="12" height="12" style={{ ["--tx" as string]: "-11px", ["--ty" as string]: "11px" }} />
      <rect x="10" y="42" width="12" height="12" style={{ ["--tx" as string]: "11px", ["--ty" as string]: "-11px" }} />
      <rect x="42" y="42" width="12" height="12" style={{ ["--tx" as string]: "-11px", ["--ty" as string]: "-11px" }} />
      <rect x="26" y="26" width="12" height="12" fill="var(--color-yellow-400)" stroke="var(--color-yellow-400)" />
    </g>
  ),
  // modules added
  scalability: (
    <g className="bv-grow">
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={10 + (i % 3) * 16} y={10 + Math.floor(i / 3) * 16} width="12" height="12" style={{ transitionDelay: `${i * 60}ms` }} data-first={i === 0} />
      ))}
    </g>
  ),
};

/** §08b — Infrastructure that delivers business value. Advantages, not features. */
export function BusinessValue({ benefits }: { benefits: Benefit[] }) {
  const section = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useMotion(section, (mm) => {
    mm.add(MQ.desktop, () => {
      gsap.fromTo(
        panel.current,
        { clipPath: "inset(0% 5% 0% 5%)" },
        { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "top 30%", scrub: true } },
      );
    });
    mm.add(MQ.motion, () => {
      const svgs = gsap.utils.toArray<SVGElement>("[data-bv]", section.current);
      const st = ScrollTrigger.create({
        trigger: section.current,
        start: "top 55%",
        once: true,
        onEnter: () =>
          svgs.forEach((s, i) =>
            setTimeout(() => {
              s.classList.add("is-drawing", "is-on");
              setTimeout(() => s.classList.remove("is-drawing", "is-on"), 1600);
            }, i * 160),
          ),
      });
      return () => st.kill();
    });
  });

  return (
    <section ref={section} id="business-value" data-stage="believe" aria-labelledby="bv-title" className="relative bg-porcelain">
      <div ref={panel} className="relative bg-stone section-pad">
        <div className="shell grid-12 gap-y-8">
          <div className="col-span-4 sm:col-span-8 lg:col-span-8">
            <p className="t-label text-ink">
              <span data-idx className="text-indigo-700">08.1 /</span> Business value
            </p>
            <RevealLines id="bv-title" lines={["Infrastructure", "that delivers", "*business value*"]} className="t-xl mt-5 text-ink" />
          </div>
          <div className="col-span-4 flex items-end sm:col-span-8 lg:col-span-3 lg:col-start-10 lg:justify-end">
            <ArrowLink href="/sustainability#business-value">Explore sustainability</ArrowLink>
          </div>
        </div>

        <ul className="shell no-scrollbar mt-16 flex snap-x snap-mandatory gap-0 overflow-x-auto lg:mt-24 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {benefits.map((b, i) => (
            <li key={b.id} className="group w-[78vw] shrink-0 snap-start border-l border-ink/10 px-6 pb-4 first:border-l-0 first:pl-0 sm:w-[44vw] lg:w-auto lg:px-7 lg:first:pl-0">
              <span className="t-micro text-steel-500">{String(i + 1).padStart(2, "0")}</span>
              <svg data-bv viewBox="0 0 64 64" width="72" height="72" fill="none" stroke="var(--color-indigo-700)" strokeWidth="1.75" className="icon-draw mt-6 text-indigo-700" aria-hidden>
                {DIAGRAMS[b.id]}
              </svg>
              <h3 className="mt-7 font-display text-[clamp(1.125rem,1.35vw,1.375rem)] font-bold leading-[1.2] text-ink">{b.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-steel-700">{b.text}</p>
            </li>
          ))}
        </ul>
        <p className="shell t-micro mt-6 text-steel-500 lg:hidden" aria-hidden>
          Swipe →
        </p>
      </div>
    </section>
  );
}
