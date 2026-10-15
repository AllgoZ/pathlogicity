"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MQ } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/hooks";

/**
 * M4 — Image reveal. The frame wipes up from the bottom (clip-path) while the
 * image settles from 1.2× to 1×, then drifts ±5% against the scroll. Fills its
 * positioned parent. Without JS or under reduced motion the image is simply shown.
 */
export function RevealMedia({ children, parallax = true, className = "" }: { children: ReactNode; parallax?: boolean; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useMotion(frame, (mm) => {
    mm.add(MQ.motion, () => {
      const st = { trigger: frame.current, start: "top 88%", once: true };
      gsap.fromTo(frame.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.out", scrollTrigger: st });
      gsap.fromTo(inner.current, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: st });
      if (parallax) {
        gsap.fromTo(inner.current, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: frame.current, start: "top bottom", end: "bottom top", scrub: true } });
      }
    });
  });

  return (
    <div ref={frame} className={`absolute inset-0 overflow-hidden ${className}`}>
      <div ref={inner} className={`absolute inset-x-0 ${parallax ? "-inset-y-[6%]" : "inset-y-0"}`}>
        {children}
      </div>
    </div>
  );
}
