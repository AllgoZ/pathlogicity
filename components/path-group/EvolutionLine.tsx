"use client";

import { useRef } from "react";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";

/** PATH LEGACY → INFRASTRUCTURE → LOGISTICS → PATH LOGICITY, drawn as one route. */
export function EvolutionLine({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  useMotion(ref, (mm) => {
    mm.add(MQ.motion, () => {
      const q = gsap.utils.selector(ref);
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 55%", scrub: 0.5 } });
      tl.fromTo(q("[data-evo-line]"), { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, ease: "none", duration: 1 }, 0);
      q("[data-evo-step]").forEach((el, i) => {
        tl.from(el, { opacity: 0.15, duration: 0.15, ease: "none" }, (i / (steps.length - 1)) * 0.85);
      });
    });
  });

  return (
    <ol ref={ref} aria-label="From PATH legacy to PATH Logicity" className="relative grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-0">
      {/* line: vertical on mobile, horizontal on desktop */}
      <span aria-hidden className="absolute bottom-2 left-[7px] top-2 w-px bg-navy-950/15 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[7px] lg:h-px lg:w-auto" />
      <span
        data-evo-line
        aria-hidden
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-navy-950 lg:bottom-auto lg:left-0 lg:right-[12%] lg:top-[7px] lg:h-px lg:w-auto lg:origin-left"
      />
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <li key={s} data-evo-step className="relative pl-10 lg:pl-0 lg:pr-8">
            {last ? (
              <span aria-hidden className="absolute left-0 top-0 block h-[15px] w-[15px] lg:left-0">
                {/* brand-coloured ring: the destination */}
                <svg viewBox="0 0 16 16" className="h-full w-full">
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="var(--color-yellow-400)" strokeWidth="2.5" strokeDasharray="13.6 27.2" />
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="var(--color-green-500)" strokeWidth="2.5" strokeDasharray="13.6 27.2" strokeDashoffset="-13.6" />
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="var(--color-indigo-500)" strokeWidth="2.5" strokeDasharray="13.6 27.2" strokeDashoffset="-27.2" />
                </svg>
              </span>
            ) : (
              <span aria-hidden className="absolute left-0 top-0 block h-[15px] w-[15px] rounded-full border border-navy-950 bg-paper" />
            )}
            <p className="t-micro text-steel-700 lg:mt-8">{String(i + 1).padStart(2, "0")}</p>
            <p className={`mt-2 font-display font-extrabold uppercase leading-[0.95] tracking-[-0.03em] ${last ? "text-[clamp(1.75rem,2.6vw,2.6rem)]" : "text-[clamp(1.25rem,1.8vw,1.75rem)]"}`}>{s}</p>
          </li>
        );
      })}
    </ol>
  );
}
