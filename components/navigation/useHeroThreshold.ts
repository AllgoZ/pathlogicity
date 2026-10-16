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

/**
 * true once the page is scrolled past `px`. Re-renders only when the boolean
 * flips (not on every scroll frame) — Phase 4 perf: the old useScrollY made the
 * nav, journey rail and action bar re-render on every frame of scrolling.
 */
export function useScrolledPast(px: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setPast(window.scrollY > px);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, [px]);
  return past;
}

/**
 * Hide-on-scroll-down / reveal-on-scroll-up after `from` px. Updates state only
 * when the hidden flag actually changes.
 */
export function useHideOnScroll(from: number, locked: boolean) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const check = () => {
      raf = 0;
      const y = window.scrollY;
      const dy = y - last;
      last = y;
      if (locked || y < from) setHidden(false);
      else if (dy > 8) setHidden(true);
      else if (dy < -4) setHidden(false);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, [from, locked]);
  return hidden;
}

/** @deprecated re-renders every scroll frame — prefer useScrolledPast / useHideOnScroll */
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
