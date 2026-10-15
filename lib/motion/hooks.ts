"use client";

import { useEffect, useLayoutEffect, useState, type DependencyList, type RefObject } from "react";
import { gsap, ScrollTrigger } from "./gsap";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Sections further than this below the fold set up their motion lazily, on approach. */
const NEAR = 1.5; // × viewport height

/** One shared IntersectionObserver for every lazily-mounted scene (one per scene was ~0.5s of intersection work). */
const lazyCallbacks = new Map<Element, () => void>();
let lazyIO: IntersectionObserver | null = null;
function observeOnce(el: Element, cb: () => void) {
  lazyIO ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const fn = lazyCallbacks.get(e.target);
        lazyCallbacks.delete(e.target);
        lazyIO?.unobserve(e.target);
        fn?.();
      }),
    { rootMargin: "100% 0px 100% 0px" },
  );
  lazyCallbacks.set(el, cb);
  lazyIO.observe(el);
  return () => {
    lazyCallbacks.delete(el);
    lazyIO?.unobserve(el);
  };
}

let refreshQueued = false;
/** One coalesced ScrollTrigger.refresh() after late-mounted scenes (e.g. a pin) change the layout. */
function queueRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.refresh();
  });
}

/**
 * Scoped GSAP matchMedia. Everything created inside is reverted on unmount
 * or when a media condition stops matching (e.g. reduced motion toggled).
 *
 * Performance (Phase 4 QA): scenes near the fold are set up immediately; the
 * rest are set up when they come within one viewport of the screen. This keeps
 * hydration from creating ~100 ScrollTriggers (each forcing layout) in a single
 * long task that delayed the hero's first paint.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia) => void,
  deps: DependencyList = [],
) {
  useIsoLayoutEffect(() => {
    const el = scope.current;
    if (!el) return;
    let mm: gsap.MatchMedia | null = null;
    const start = (late: boolean) => {
      if (mm) return;
      const pins = late ? ScrollTrigger.getAll().filter((t) => t.pin).length : 0;
      mm = gsap.matchMedia(el);
      setup(mm);
      // only a newly created PIN shifts the layout below it → re-measure once
      if (late && ScrollTrigger.getAll().filter((t) => t.pin).length > pins) queueRefresh();
    };

    if (el.getBoundingClientRect().top < window.innerHeight * NEAR) {
      start(false);
      return () => mm?.revert();
    }
    const stop = observeOnce(el, () => start(true));
    return () => {
      stop();
      mm?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

/** Element size via ResizeObserver */
export function useSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((s) => (s.w === width && s.h === height ? s : { w: width, h: height }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}
