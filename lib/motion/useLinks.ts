"use client";

import { useEffect, useState, type DependencyList, type RefObject } from "react";

export type Box = { x: number; y: number; w: number; h: number; cx: number; cy: number; r: number; b: number };

/** Layout position of `el` inside `container` (ignores CSS transforms, so reveal animations don't skew lines). */
export function boxIn(el: HTMLElement | SVGElement | null, container: HTMLElement): Box | null {
  if (!el) return null;
  if (el instanceof SVGElement) {
    const c = container.getBoundingClientRect();
    const b = el.getBoundingClientRect();
    const x = b.left - c.left;
    const y = b.top - c.top;
    return { x, y, w: b.width, h: b.height, cx: x + b.width / 2, cy: y + b.height / 2, r: x + b.width, b: y + b.height };
  }
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, r: x + w, b: y + h };
}

/**
 * Recomputes connector paths (in container pixels) whenever the container
 * resizes or fonts load. `build` returns SVG path strings.
 */
export function useLinks(container: RefObject<HTMLElement | null>, build: (c: HTMLElement) => string[], deps: DependencyList = []) {
  const [state, setState] = useState<{ paths: string[]; w: number; h: number }>({ paths: [], w: 0, h: 0 });
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setState({ paths: build(el), w: el.offsetWidth, h: el.offsetHeight }));
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(el);
    document.fonts?.ready.then(run);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

/** Smooth horizontal-tangent S-curve between two points */
export const curve = (x1: number, y1: number, x2: number, y2: number, k = 0.5) => {
  const dx = (x2 - x1) * k;
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
};
