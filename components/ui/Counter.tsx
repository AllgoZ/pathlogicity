"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";

const fmt = (v: number, decimals: number) =>
  v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * M7 — Odometer. Each digit is a 0–9 reel that rolls into place once, staggered
 * from the right, when the number enters view. Reels render at their final
 * position for SSR/no-JS/reduced motion, and the real value is always in the DOM
 * for screen readers (the reels are aria-hidden).
 */
export function Counter({ value, decimals = 0, duration = 1.8, className = "" }: { value: number; decimals?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = fmt(value, decimals);

  useMotion(ref, (mm) => {
    const el = ref.current!;
    mm.add(MQ.motion, () => {
      const reels = gsap.utils.toArray<HTMLElement>("[data-reel]", el);
      const land = (_: number, t: HTMLElement) => -Number(t.dataset.reel) * 10;
      gsap.set(reels, { y: 0, yPercent: 0 });
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => gsap.to(reels, { yPercent: land, duration, ease: "expo.out", stagger: { each: 0.09, from: "end" } }),
      });
      return () => {
        st.kill();
        gsap.set(reels, { y: 0, yPercent: land });
      };
    });
  }, [final, duration]);

  return (
    <span className={`tnum inline-flex ${className}`}>
      <span ref={ref} aria-hidden className="inline-flex">
        {final.split("").map((c, i) =>
          /\d/.test(c) ? (
            <span key={i} className="relative inline-block h-[1.1em] overflow-hidden align-top leading-[1.1em]">
              <span data-reel={c} className="flex flex-col" style={{ transform: `translateY(-${Number(c) * 10}%)` }}>
                {DIGITS.map((d) => (
                  <span key={d} className="block h-[1.1em]">
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i} className="inline-block h-[1.1em] align-top leading-[1.1em]">
              {c}
            </span>
          ),
        )}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
