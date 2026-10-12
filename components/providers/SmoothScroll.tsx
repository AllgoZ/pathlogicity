"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const NAV_OFFSET = -64;

/** Smooth scroll (disabled under reduced motion) + in-page anchor handling. */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | undefined;
    const tick = (time: number) => lenis?.raf(time * 1000);

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, smoothWheel: true });
      window.__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!a) return;
      const raw = a.getAttribute("href")!;
      if (raw.startsWith("/#") && location.pathname !== "/") return; // let Next navigate home
      const hash = raw.replace(/^\//, "").split("?")[0];
      if (hash.length < 2) return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.4 });
      else target.scrollIntoView();
      history.pushState(null, "", raw.replace(/^\//, ""));
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };
    document.addEventListener("click", onClick);

    // Fonts change layout → refresh triggers once they settle.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
