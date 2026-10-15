"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/motion/gsap";

/**
 * M6 — Magnetic hover. Wraps ONE interactive element without changing layout
 * (`display: contents`): the element leans toward the cursor and its label
 * (`[data-magnetic-inner]`) leans a little further, then springs back on leave.
 * Desktop pointers with motion enabled only.
 */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrap.current?.firstElementChild as HTMLElement | null;
    if (!el) return;
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!ok.matches) return;

    const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" }) : null;
    const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" }) : null;

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      ixTo?.(dx * strength * 0.5);
      iyTo?.(dy * strength * 0.5);
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      gsap.set([el, inner].filter(Boolean), { clearProps: "transform" });
    };
  }, [strength]);

  return (
    <span ref={wrap} className="contents">
      {children}
    </span>
  );
}
