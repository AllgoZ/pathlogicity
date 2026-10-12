"use client";

import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from "react";
import { applyRouteProgress, scalePath } from "@/lib/motion/route";
import { gsap, MQ, ScrollTrigger } from "@/lib/motion/gsap";
import { useIsoLayoutEffect, useSize } from "@/lib/motion/hooks";

export type RouteHandle = { set: (p: number) => void; get: () => number };

type Tone = "dark" | "light";

type Props = {
  /** Path in normalised 0–100 space (absolute M/L/C/Q/S commands) */
  d: string;
  tone?: Tone;
  /** Dormant full-length hairline under the drawn route */
  base?: boolean;
  /** Initial progress before any animation (default 1 = fully drawn for SSR/no-JS) */
  initial?: number;
  /** Self-animating behaviour; omit to drive it via ref */
  auto?: "enter" | "scrub";
  scrubStart?: string;
  scrubEnd?: string;
  /** Keep head visible at the end */
  keepHead?: boolean;
  className?: string;
  strokeWidth?: number;
};

/** The signature device: a thin route line with a moving yellow "vehicle" head. */
export const Route = forwardRef<RouteHandle, Props>(function Route(
  { d, tone = "dark", base = true, initial = 1, auto, scrubStart = "top 75%", scrubEnd = "bottom 40%", keepHead = true, className = "", strokeWidth = 1.5 },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const trail = useRef<SVGPathElement>(null);
  const comet = useRef<SVGPathElement>(null);
  const head = useRef<HTMLSpanElement>(null);
  const progress = useRef(initial);
  const { w, h } = useSize(wrap);
  const scaled = useMemo(() => (w && h ? scalePath(d, w, h) : ""), [d, w, h]);

  const set = useCallback(
    (p: number) => {
      progress.current = p;
      applyRouteProgress(p, { path: path.current, trail: trail.current, comet: comet.current, head: head.current });
      if (head.current && !keepHead && p >= 0.999) head.current.style.opacity = "0";
    },
    [keepHead],
  );

  useImperativeHandle(ref, () => ({ set, get: () => progress.current }), [set]);

  // Re-apply on resize (path geometry changed)
  useIsoLayoutEffect(() => {
    if (scaled) set(progress.current);
  }, [scaled, set]);

  useIsoLayoutEffect(() => {
    if (!auto || !wrap.current || !scaled) return;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const o = { p: 0 };
      set(0);
      if (auto === "scrub") {
        const tw = gsap.to(o, {
          p: 1,
          ease: "none",
          onUpdate: () => set(o.p),
          scrollTrigger: { trigger: wrap.current, start: scrubStart, end: scrubEnd, scrub: 0.6 },
        });
        return () => tw.kill();
      }
      const st = ScrollTrigger.create({
        trigger: wrap.current,
        start: "top 80%",
        once: true,
        onEnter: () => gsap.to(o, { p: 1, duration: 1.6, ease: "power2.inOut", onUpdate: () => set(o.p) }),
      });
      return () => {
        st.kill();
        set(1);
      };
    });
    return () => mm.revert();
  }, [auto, scaled, scrubStart, scrubEnd, set]);

  const dormant = tone === "light" ? "rgb(7 14 38 / 0.14)" : "rgb(255 255 255 / 0.12)";
  const trailColor = tone === "light" ? "rgb(7 14 38 / 0.55)" : "rgb(196 201 214 / 0.55)";

  return (
    <div ref={wrap} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {scaled ? (
        <svg width={w} height={h} className="absolute inset-0 overflow-visible" fill="none">
          {base ? <path d={scaled} stroke={dormant} strokeWidth={1} /> : null}
          <path ref={path} d={scaled} stroke="none" />
          <path
            ref={trail}
            d={scaled}
            pathLength={1}
            stroke={trailColor}
            strokeWidth={strokeWidth}
            strokeDasharray="1 1"
            strokeDashoffset={1 - initial}
          />
          <path
            ref={comet}
            d={scaled}
            pathLength={1}
            stroke="var(--color-yellow-400)"
            strokeWidth={strokeWidth + 0.5}
            strokeLinecap="round"
            strokeDasharray="0 4"
          />
        </svg>
      ) : null}
      <span
        ref={head}
        className="absolute left-0 top-0 block opacity-0 will-change-transform"
        style={{ width: 0, height: 0 }}
      >
        <span className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_0_6px_rgb(231_172_0/0.16),0_0_24px_4px_rgb(231_172_0/0.35)]" />
      </span>
    </div>
  );
});
