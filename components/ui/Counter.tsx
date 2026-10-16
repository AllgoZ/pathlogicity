"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";

const fmt = (v: number, decimals: number) =>
  v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * M7 — Odometer. Each digit is a reel that rolls into place once when the number enters view.
 *
 * `spins` = 0 (default): each reel rolls straight from 0 to its digit.
 * `spins` > 0: each reel first whirls through that many full 0–9 turns (one more turn for every
 * place to the right, so the units race past while the leading digit is the last to settle), then
 * decelerates smoothly onto the final value.
 *
 * Reels render at their final position for SSR/no-JS/reduced motion, and the real value is always in
 * the DOM for screen readers (the reels are aria-hidden).
 */
export function Counter({ value, decimals = 0, duration = 1.8, spins = 0, className = "" }: { value: number; decimals?: number; duration?: number; spins?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = fmt(value, decimals);
  const chars = final.split("");
  const digitCount = chars.filter((c) => /\d/.test(c)).length;
  let k = -1;

  useMotion(ref, (mm) => {
    const el = ref.current!;
    mm.add(MQ.motion, () => {
      const reels = gsap.utils.toArray<HTMLElement>("[data-reel]", el);
      const land = (_: number, t: HTMLElement) => -Number(t.dataset.land);
      gsap.set(reels, { y: 0, yPercent: 0 });
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          if (!spins) {
            gsap.to(reels, { yPercent: land, duration, ease: "expo.out", stagger: { each: 0.09, from: "end" } });
            return;
          }
          // all reels start together; the leading digit runs longest and settles last
          reels.forEach((r, i) => {
            const fromLeft = Number(r.dataset.pos);
            const extra = (reels.length - 1 - fromLeft) * 0.14;
            gsap.fromTo(
              r,
              { yPercent: 0, filter: "blur(1.4px)" },
              {
                yPercent: land(i, r),
                duration: duration * (1 + extra),
                ease: "power4.out",
                filter: "blur(0px)",
                onComplete: () => {
                  r.style.filter = "";
                },
              },
            );
          });
        },
      });
      return () => {
        st.kill();
        gsap.set(reels, { y: 0, filter: "", yPercent: land });
      };
    });
  }, [final, duration, spins]);

  return (
    <span className={`tnum inline-flex ${className}`}>
      <span ref={ref} aria-hidden className="inline-flex">
        {chars.map((c, i) => {
          if (!/\d/.test(c)) {
            return (
              <span key={i} className="inline-block h-[1.1em] align-top leading-[1.1em]">
                {c}
              </span>
            );
          }
          k += 1;
          const turns = spins ? spins + k : 0; // more whirls for the places further right
          const cells = turns * 10 + 10;
          const target = turns * 10 + Number(c);
          return (
            <span key={i} className="relative inline-block h-[1.1em] overflow-hidden align-top leading-[1.1em]">
              <span data-reel={c} data-pos={k} data-land={(target * 100) / cells} className="flex flex-col will-change-transform" style={{ transform: `translateY(-${(target * 100) / cells}%)` }}>
                {Array.from({ length: cells }, (_, n) => (
                  <span key={n} className="block h-[1.1em]">
                    {DIGITS[n % 10]}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
