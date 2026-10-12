"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useIsoLayoutEffect } from "@/lib/motion/hooks";

const fmt = (v: number, decimals: number) =>
  v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Counts up once on entering the viewport. The final value is always in the DOM
 * for screen readers and no-JS; the animated digits are visual only.
 */
export function Counter({ value, decimals = 0, duration = 1.4, className = "" }: { value: number; decimals?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = fmt(value, decimals);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const o = { v: 0 };
      el.textContent = fmt(0, decimals);
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(o, {
            v: value,
            duration,
            ease: "expo.out",
            onUpdate: () => {
              el.textContent = fmt(o.v, decimals);
            },
          }),
      });
      return () => {
        st.kill();
        el.textContent = final;
      };
    });
    return () => mm.revert();
  }, [value, decimals, duration, final]);

  return (
    <span className={`tnum inline-grid ${className}`}>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {final}
      </span>
      <span ref={ref} aria-hidden className="col-start-1 row-start-1">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
