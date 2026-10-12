"use client";

import { useEffect, useState } from "react";

/**
 * Scroll position at which the page has "left" the cinematic hero.
 * Uses a [data-hero-end] sentinel placed after the hero (works with the
 * pinned desktop scene and the unpinned mobile hero). Pages without a hero → 0.
 */
export function useHeroThreshold() {
  const [threshold, setThreshold] = useState(0);
  useEffect(() => {
    const compute = () => {
      const s = document.querySelector<HTMLElement>("[data-hero-end]");
      if (!s) return setThreshold(0);
      const vh = window.innerHeight;
      const top = s.getBoundingClientRect().top + window.scrollY;
      setThreshold(Math.max(top - vh * 1.2, vh * 0.6));
    };
    compute();
    const t = setTimeout(compute, 600); // after pin-spacers are created
    window.addEventListener("resize", compute);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", compute);
    };
  }, []);
  return threshold;
}

export function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, []);
  return y;
}
