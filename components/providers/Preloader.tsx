"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion/gsap";

/** Four pinwheel petals (gold · blue · green · orange) around the centre of a 100×100 box. */
const PETAL = "M50 50 L41 14 L57 6 L64 36 Z";
const PETALS = [
  { fill: "var(--color-yellow-400)", rot: 0 },
  { fill: "var(--color-blue-500)", rot: 90 },
  { fill: "var(--color-green-500)", rot: 180 },
  { fill: "var(--color-orange-500)", rot: 270 },
];

/**
 * M1 — Brand preloader, once per session, home page only, motion-enabled only.
 * A <head> script sets html[data-preload] before paint (see app/layout.tsx);
 * CSS shows this overlay and holds the hero intro while that attribute exists.
 * The petals fly in and lock into the pinwheel, the wordmark rises, then the
 * curtain wipes up into the hero (≈1.6s). It never blocks the hero image (LCP),
 * which loads underneath. A CSS failsafe hides it after 4s regardless.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || html.dataset.preload !== "1") return;

    const done = () => {
      delete html.dataset.preload;
      try {
        sessionStorage.setItem("pl-intro", "1");
      } catch {}
    };
    // petals + wordmark start hidden in CSS (no flash of the assembled mark); explicit
    // fromTo values + a context that reverts make this safe under React's dev double-run
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: done });
      // each petal flies in along its own axis (local frame: outward = up)
      PETALS.forEach((_, i) => {
        tl.fromTo(`[data-petal="${i}"]`, { y: -110, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, i * 0.07);
      });
      tl.to("[data-mark]", { rotation: 90, duration: 0.6, ease: "power3.inOut", svgOrigin: "50 50" }, 0.55)
        .fromTo("[data-wordmark]", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 0.6)
        .fromTo("[data-bar]", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0.2)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "power3.inOut" }, 1.15);
    }, el);

    const failsafe = window.setTimeout(done, 3500);
    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="preloader fixed inset-0 z-[200] flex-col items-center justify-center bg-midnight" style={{ clipPath: "inset(0% 0% 0% 0%)" }}>
      <svg viewBox="0 0 100 100" width="96" height="96" className="overflow-visible">
        <g data-mark>
          {PETALS.map((p, i) => (
            <g key={i} transform={`rotate(${p.rot} 50 50)`}>
              <path data-petal={i} d={PETAL} fill={p.fill} />
            </g>
          ))}
        </g>
      </svg>
      <div data-wordmark className="mt-7">
        <Image src="/client/logo-text-white.png" alt="" width={218} height={84} priority className="h-9 w-auto" sizes="120px" />
      </div>
      <span className="relative mt-8 block h-px w-40 overflow-hidden bg-white/15">
        <span data-bar className="absolute inset-0 origin-left bg-yellow-400" />
      </span>
    </div>
  );
}
